"""
Reviewer Queues

Explicit queues for human review. These are not silent failures —
they are structured review tasks that must be addressed before gold publish.

Queues:
  - wrong_model_classification: archetype may be wrong
  - missing_exhibit_followthrough: exhibit referenced but not parsed
  - unsupported_score: score depends on missing inputs
  - visual_priority: fields needing visual inspection
  - caution_label: fields that need caution labels in reports
  - publish_gate_blockers: issues that block publishable state
"""

from typing import Dict, List, Any
from .models import ItemSection, FailureState, ExhibitObject, ExhibitRole


def build_reviewer_queues(items: Dict[int, ItemSection],
                          exhibits: Dict[str, ExhibitObject],
                          evidence: Dict,
                          archetype: Dict[str, Any],
                          coverage: Dict[int, str]) -> Dict[str, List[Dict]]:
    """Build all reviewer queues from extraction state.

    Returns dict of queue_name → list of review tasks.
    """
    queues: Dict[str, List[Dict]] = {
        "wrong_model_classification": [],
        "missing_exhibit_followthrough": [],
        "unsupported_score": [],
        "visual_priority": [],
        "caution_label": [],
        "publish_gate_blockers": [],
    }

    # ── Model classification check ──
    if archetype.get("confidence", 0) < 0.5:
        queues["wrong_model_classification"].append({
            "issue": "Low archetype confidence",
            "detail": f"Classified as {archetype.get('archetype', '?')} with confidence {archetype.get('confidence', 0)}",
            "action": "Verify business model manually",
        })

    # ── Missing exhibit follow-through ──
    for code, ex in exhibits.items():
        if ex.start_page > 0 and not ex.parsed:
            if ex.role in (ExhibitRole.FINANCIALS, ExhibitRole.FRANCHISE_AGREEMENT,
                           ExhibitRole.STATE_ADDENDA_FDD):
                queues["missing_exhibit_followthrough"].append({
                    "exhibit": code,
                    "role": ex.role.value,
                    "pages": f"{ex.start_page}-{ex.end_page}",
                    "action": "Parse this exhibit — it's critical",
                    "severity": "critical",
                })
            elif ex.role != ExhibitRole.OTHER:
                queues["missing_exhibit_followthrough"].append({
                    "exhibit": code,
                    "role": ex.role.value,
                    "action": "Parse this exhibit for completeness",
                    "severity": "normal",
                })

    # ── Unsupported scores ──
    if not evidence.get("totalUnits") and not evidence.get("franchisedUnits"):
        queues["unsupported_score"].append({
            "field": "unitGrowth",
            "issue": "No unit data — growth score cannot be computed",
            "action": "Locate Item 20 data",
        })
    if not evidence.get("hasItem19"):
        queues["unsupported_score"].append({
            "field": "financialTransparency",
            "issue": "No Item 19 FPR — transparency score cannot be computed",
            "action": "Verify Item 19 status",
        })

    # ── Caution labels ──
    if evidence.get("hasItem19") and not evidence.get("item19_avgRevenue"):
        queues["caution_label"].append({
            "field": "item19_avgRevenue",
            "issue": "FPR detected but average revenue not extracted",
            "label": "FPR present but incomplete extraction",
        })

    # ── Publish gate blockers ──
    not_found = [n for n, state in coverage.items() if state == "not_found"]
    if not_found:
        queues["publish_gate_blockers"].append({
            "issue": f"Items not found: {not_found}",
            "action": "Fix section localization",
            "severity": "critical" if any(n in (19, 20, 21) for n in not_found) else "warning",
        })

    no_table = [n for n, state in coverage.items() if state == "found_no_table"]
    if no_table:
        queues["publish_gate_blockers"].append({
            "issue": f"Items missing required tables: {no_table}",
            "action": "Improve table detection for these items",
            "severity": "warning",
        })

    return queues
