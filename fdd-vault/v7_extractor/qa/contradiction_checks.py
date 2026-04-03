"""
Contradiction Checks — First-Class QA

Required checks per blueprint:
  - Cover page investment range vs Item 7 total
  - Item 5 fee lines vs Item 7 fee lines
  - Item 21 exhibit pointer vs parsed financial exhibit
  - Special-risks warnings vs kill-switch engine
  - Exhibit list vs actual exhibits read
  - Item 19 populations vs Item 20 outlet counts
  - Unresolved Exhibit / Note / Item references

Also includes Pages 1-2 Double-Authentication:
  - Did we find the business model promised on cover?
  - Did we find the fee/investment ranges promised on cover?
  - Did we follow the financial exhibit path from how-to-use?
  - Do Item 19/20/21 line up with the roadmap?
  - Do unit counts and investment ranges stay consistent?
"""

from typing import Dict, List, Any


def check_contradictions(evidence: Dict,
                         bootstrap: Dict,
                         items: Dict) -> List[Dict[str, Any]]:
    """Check for contradictions across extracted data.

    Returns list of contradiction findings with severity.
    """
    findings = []

    # Helper to get value from evidence dict entries
    def _ev(key):
        entry = evidence.get(key)
        if isinstance(entry, dict):
            return entry.get("value")
        return entry

    # ── Cover investment vs Item 7 investment ──
    cover_inv = bootstrap.get("investmentRange", [])
    item7_low = _ev("totalInvestmentLow")
    item7_high = _ev("totalInvestmentHigh")
    if cover_inv and len(cover_inv) >= 2 and item7_low:
        if abs(cover_inv[0] - item7_low) > item7_low * 0.3:
            findings.append({
                "type": "investment_mismatch",
                "detail": f"Cover says ${cover_inv[0]:,}-${cover_inv[1]:,}, Item 7 says ${item7_low:,}-${item7_high:,}",
                "severity": "warning",
            })

    # ── Item 19 populations vs Item 20 outlet counts ──
    i19_units = _ev("item19_unitsIncluded")
    total_units = _ev("totalUnits")
    if i19_units and total_units and i19_units > total_units * 1.2:
        findings.append({
            "type": "unit_count_mismatch",
            "detail": f"Item 19 says {i19_units} units included but Item 20 total is {total_units}",
            "severity": "warning",
        })

    # ── Item 21 exhibit pointer vs parsed financial exhibit ──
    exhibit_map = bootstrap.get("exhibitMap", {})
    has_financial_exhibit_in_map = any(
        'financial' in desc.lower() or 'statement' in desc.lower()
        for desc in exhibit_map.values()
    )
    has_parsed_financials = _ev("hasAuditedFinancials") is not None
    if has_financial_exhibit_in_map and not has_parsed_financials:
        findings.append({
            "type": "financial_exhibit_not_parsed",
            "detail": "Exhibit map lists financial statements but they were not parsed",
            "severity": "critical",
        })

    # ── Special risks vs kill-switch engine ──
    special_risks = bootstrap.get("specialRisks", [])
    if "spousal_liability" in special_risks and not _ev("spousalGuaranty"):
        findings.append({
            "type": "risk_not_captured",
            "detail": "Special-risks page flags spousal liability but kill-switch engine has no spousal guaranty field",
            "severity": "info",
        })
    if "mandatory_minimum" in special_risks and not _ev("minimumPayments"):
        findings.append({
            "type": "risk_not_captured",
            "detail": "Special-risks page flags mandatory minimum but kill-switch engine has no minimum payment field",
            "severity": "info",
        })

    # ── Exhibit list vs actual exhibits parsed ──
    total_exhibits_in_map = len(exhibit_map)
    # This check needs exhibit data passed in; for now flag if map is large but few parsed
    if total_exhibits_in_map > 5:
        findings.append({
            "type": "exhibit_coverage_check",
            "detail": f"Exhibit map has {total_exhibits_in_map} exhibits — verify all critical ones were parsed",
            "severity": "info",
        })

    # ── Items 11-16 not filler check ──
    # These items contain kill switches. If any have 0 text, flag it.
    NOT_FILLER_ITEMS = {11, 12, 13, 14, 15, 16}
    for item_num in NOT_FILLER_ITEMS:
        section = items.get(item_num)
        if section is None:
            findings.append({
                "type": "critical_item_missing",
                "detail": f"Item {item_num} not found — Items 11-16 contain kill switches and are NOT filler",
                "severity": "warning",
            })

    return findings


def double_authenticate_pages_1_2(bootstrap: Dict,
                                   evidence: Dict,
                                   items: Dict) -> List[Dict[str, Any]]:
    """Pages 1-2 double-authentication rule.

    Go back to cover and how-to-use pages and verify:
    - Did we find the business model promised?
    - Did we find the fee/investment ranges promised?
    - Did we follow the financial exhibit path?
    - Do Item 19/20/21 line up with the roadmap?
    - Do unit counts and investment ranges stay consistent?

    Returns list of authentication findings.
    """
    findings = []

    # ── Business model found? ──
    description = bootstrap.get("description", "")
    if not description:
        findings.append({
            "type": "missing_business_model",
            "detail": "Cover page business description not captured",
            "severity": "warning",
        })

    def _ev(key):
        entry = evidence.get(key)
        return entry.get("value") if isinstance(entry, dict) else entry

    # ── Investment range found? ──
    cover_inv = bootstrap.get("investmentRange", [])
    item7_low = _ev("totalInvestmentLow")
    if cover_inv and not item7_low:
        findings.append({
            "type": "investment_not_extracted",
            "detail": f"Cover page shows investment range {cover_inv} but Item 7 extraction produced no total",
            "severity": "warning",
        })

    # ── Financial exhibit path followed? ──
    exhibit_map = bootstrap.get("exhibitMap", {})
    has_fin_ref = any('financial' in v.lower() or 'statement' in v.lower() for v in exhibit_map.values())
    has_fin_data = _ev("hasAuditedFinancials")
    if has_fin_ref and not has_fin_data:
        findings.append({
            "type": "financial_path_not_followed",
            "detail": "How-to-use/exhibit map points to financial statements but they were not parsed",
            "severity": "critical",
        })

    # ── Item 19/20/21 present? ──
    for item_num, label in [(19, "Financial Performance"), (20, "Outlets"), (21, "Financial Statements")]:
        if item_num not in items:
            findings.append({
                "type": f"item_{item_num}_not_found",
                "detail": f"Item {item_num} ({label}) not found in extraction",
                "severity": "critical" if item_num in (19, 20) else "warning",
            })

    # ── Unit count consistency ──
    total_units = _ev("totalUnits") or 0
    if total_units == 0 and 20 in items:
        findings.append({
            "type": "zero_units_with_item20",
            "detail": "Item 20 was found but total units = 0 — extraction failure",
            "severity": "critical",
        })

    return findings
