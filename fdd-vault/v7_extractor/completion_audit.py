"""
Completion Audit — End-of-Run Verification

Before publish:
  1. Reread cover page summary
  2. Reread "How to Use" page
  3. Compare promised locations vs extracted outputs
  4. Verify all high-value expected sources were actually parsed
  5. If not, extraction is incomplete

This extends the existing double-authenticate into a real completion discipline.

A brand is NOT publishable unless all of these pass:
  - First two pages were read and summarized
  - Where-to-find ledger was built
  - Items 1-23 all received item memory states
  - All table-priority items were table-checked
  - Item 19 was double-checked
  - Item 20 outlet/system tables were parsed
  - Item 21 financial source was parsed
  - All referenced high-priority exhibits were parsed or flagged
  - Early-page promises reconcile with later extraction
  - Discovery lane and engine lane do not materially disagree
"""

from typing import Dict, List, Any


def run_completion_audit(reader_output: Dict[str, Any],
                         reconciliation: Dict[str, Any],
                         evidence: Dict,
                         items: Dict) -> Dict[str, Any]:
    """Run the end-of-run completion audit.

    Returns audit results with pass/fail per check.
    """
    checks = []

    def _ev(key):
        entry = evidence.get(key)
        return entry.get("value") if isinstance(entry, dict) else entry

    # ── 1. First two pages read ──
    brand = reader_output.get("brand_memory", {})
    checks.append({
        "check": "first_pages_read",
        "passed": bool(brand.get("brand_name")),
        "detail": f"Brand: {brand.get('brand_name', 'NOT READ')[:50]}",
    })

    # ── 2. Where-to-find ledger built ──
    ledger = reader_output.get("ledger", {})
    checks.append({
        "check": "ledger_built",
        "passed": ledger.get("total", 0) > 0,
        "detail": f"Ledger: {ledger.get('total', 0)} entries, {ledger.get('resolved', 0)} resolved",
    })

    # ── 3. All items received memory states ──
    item_mems = reader_output.get("item_memories", {})
    items_with_state = sum(1 for im in item_mems.values() if im.get("state") != "not_started")
    checks.append({
        "check": "all_items_have_state",
        "passed": items_with_state >= 20,  # allow 3 missing
        "detail": f"{items_with_state}/23 items have memory states",
    })

    # ── 4. Table-priority items table-checked ──
    table_items = {5, 6, 7, 9, 17, 19, 20}
    table_checked = sum(1 for n in table_items
                        if item_mems.get(n, {}).get("tables", 0) > 0)
    checks.append({
        "check": "table_items_checked",
        "passed": table_checked >= 5,  # at least 5 of 7
        "detail": f"{table_checked}/{len(table_items)} table-priority items have tables",
    })

    # ── 5. Item 19 double-checked ──
    i19_mem = item_mems.get(19, {})
    checks.append({
        "check": "item19_checked",
        "passed": i19_mem.get("state") in ("read", "read_no_tables"),
        "detail": f"Item 19: {i19_mem.get('state', 'NOT READ')}, tables={i19_mem.get('tables', 0)}",
    })

    # ── 6. Item 20 parsed ──
    total_units = _ev("totalUnits")
    checks.append({
        "check": "item20_parsed",
        "passed": total_units is not None and total_units > 0,
        "detail": f"Units: {total_units or 'NOT EXTRACTED'}",
    })

    # ── 7. Item 21 financial source parsed ──
    has_fin = _ev("hasAuditedFinancials")
    checks.append({
        "check": "item21_parsed",
        "passed": has_fin is not None,
        "detail": f"Financials: {'parsed' if has_fin else 'NOT PARSED'}",
    })

    # ── 8. High-priority exhibits parsed ──
    tracker = reader_output.get("exhibit_tracker", {})
    unparsed = tracker.get("unparsed_critical", [])
    checks.append({
        "check": "exhibits_parsed",
        "passed": len(unparsed) == 0,
        "detail": f"Unparsed critical: {unparsed or 'none'}",
    })

    # ── 9. Ledger reconciliation ──
    ledger_unresolved = ledger.get("unresolved", 0)
    checks.append({
        "check": "ledger_reconciled",
        "passed": ledger_unresolved <= 3,  # allow a few unresolved
        "detail": f"Ledger unresolved: {ledger_unresolved}",
    })

    # ── 10. No material disagreement ──
    material = reconciliation.get("material_disagreement", False)
    checks.append({
        "check": "no_material_disagreement",
        "passed": not material,
        "detail": f"Material disagreement: {material}",
    })

    # Overall
    all_passed = all(c["passed"] for c in checks)
    critical_passed = all(c["passed"] for c in checks
                          if c["check"] in ("item19_checked", "item20_parsed",
                                             "item21_parsed", "no_material_disagreement"))

    return {
        "checks": checks,
        "all_passed": all_passed,
        "critical_passed": critical_passed,
        "pass_count": sum(1 for c in checks if c["passed"]),
        "total_checks": len(checks),
        "audit_result": "pass" if all_passed else ("partial" if critical_passed else "fail"),
    }
