"""
Reader-Engine Reconciler — Lane C

Compares discovery findings (Lane A) against normalized engine outputs (Lane B).

Three types of findings:
  1. Discovery-only: reader found it, no engine captured it → potential miss
  2. Engine-only: engine emitted a value, reader didn't support it → potential fabrication
  3. Contradictions: reader and engine disagree → needs review

The reviewer sees both lanes and can resolve conflicts.
"""

from typing import Dict, List, Any
from .important_fact_store import ImportantFactStore


def reconcile(reader_output: Dict[str, Any],
              engines: Dict[str, Any],
              evidence: Dict) -> Dict[str, Any]:
    """Compare Lane A (reader/discovery) with Lane B (engines).

    Returns reconciliation report.
    """
    findings = {
        "discovery_only": [],
        "engine_only": [],
        "contradictions": [],
        "aligned": [],
    }

    # Helper to extract value from evidence entries
    def _ev(key):
        entry = evidence.get(key)
        if isinstance(entry, dict):
            return entry.get("value")
        return entry

    # ── Check: Item 19 FPR ──
    # Did the reader find FPR signals but the engine says no FPR?
    fact_store = reader_output.get("fact_store", {})
    i19_facts = [f for f in fact_store.get("facts", [])
                 if f.get("item") == 19 and f.get("importance", 0) >= 0.7]
    engine_has_fpr = _ev("hasItem19")

    if i19_facts and not engine_has_fpr:
        findings["discovery_only"].append({
            "topic": "Item 19 FPR",
            "detail": f"Reader found {len(i19_facts)} high-importance FPR signals but engine says no FPR",
            "severity": "critical",
        })
    elif engine_has_fpr and not i19_facts:
        findings["engine_only"].append({
            "topic": "Item 19 FPR",
            "detail": "Engine says FPR=True but reader found no high-importance FPR signals",
            "severity": "warning",
        })
    elif engine_has_fpr and i19_facts:
        findings["aligned"].append("Item 19 FPR: reader and engine agree")

    # ── Check: Investment range ──
    brand_mem = reader_output.get("brand_memory", {})
    cover_inv = brand_mem.get("investment_range", [])
    engine_inv_low = _ev("totalInvestmentLow")
    engine_inv_high = _ev("totalInvestmentHigh")

    if cover_inv and engine_inv_low:
        findings["aligned"].append(f"Investment: cover={cover_inv}, engine=${engine_inv_low:,}-${engine_inv_high:,}")
    elif cover_inv and not engine_inv_low:
        findings["discovery_only"].append({
            "topic": "Investment range",
            "detail": f"Cover page shows investment {cover_inv} but engine produced no total",
            "severity": "warning",
        })

    # ── Check: Unit counts ──
    total_units = _ev("totalUnits")
    i20_memory = reader_output.get("item_memories", {}).get(20, {})
    i20_tables = i20_memory.get("tables", 0)

    if i20_tables > 0 and (not total_units or total_units == 0):
        findings["discovery_only"].append({
            "topic": "Unit counts",
            "detail": f"Reader found {i20_tables} tables in Item 20 but engine produced 0 units",
            "severity": "critical",
        })
    elif total_units and total_units > 0:
        findings["aligned"].append(f"Units: {total_units}")

    # ── Check: Where-to-find ledger completion ──
    ledger = reader_output.get("ledger", {})
    unresolved_count = ledger.get("unresolved", 0)
    if unresolved_count > 0:
        findings["discovery_only"].append({
            "topic": "Where-to-find ledger",
            "detail": f"{unresolved_count} expected information sources were not resolved",
            "severity": "warning",
        })

    # ── Check: High-importance uncaptured facts ──
    uncaptured = fact_store.get("high_importance_uncaptured", 0)
    if uncaptured > 0:
        findings["discovery_only"].append({
            "topic": "Uncaptured important facts",
            "detail": f"{uncaptured} high-importance facts discovered but no engine captured them",
            "severity": "warning",
        })

    # ── Check: Exhibit completion ──
    tracker = reader_output.get("exhibit_tracker", {})
    unparsed_critical = tracker.get("unparsed_critical", [])
    if unparsed_critical:
        findings["discovery_only"].append({
            "topic": "Unparsed critical exhibits",
            "detail": f"Critical exhibits not parsed: {unparsed_critical}",
            "severity": "critical",
        })

    return {
        "discovery_only_count": len(findings["discovery_only"]),
        "engine_only_count": len(findings["engine_only"]),
        "contradiction_count": len(findings["contradictions"]),
        "aligned_count": len(findings["aligned"]),
        "findings": findings,
        "material_disagreement": (
            len(findings["discovery_only"]) > 0 and
            any(f.get("severity") == "critical" for f in findings["discovery_only"])
        ),
    }
