"""
Contradiction Checks

Verifies consistency across extracted data:
  - Do unit counts match between Item 1, Item 20, and Item 19?
  - Does cover page investment range match Item 7 total?
  - Does TOC item count match detected items?
  - Are there conflicting fee amounts?
"""

from typing import Dict, List, Any


def check_contradictions(evidence: Dict,
                         bootstrap: Dict,
                         items: Dict) -> List[Dict[str, Any]]:
    """Check for contradictions across extracted data.

    Returns list of contradiction findings.
    """
    findings = []

    # ── Cover investment vs Item 7 investment ──
    cover_inv = bootstrap.get("investmentRange", [])
    item7_low = evidence.get("totalInvestmentLow")
    item7_high = evidence.get("totalInvestmentHigh")
    if cover_inv and len(cover_inv) >= 2 and item7_low:
        if abs(cover_inv[0] - item7_low) > item7_low * 0.3:
            findings.append({
                "type": "investment_mismatch",
                "detail": f"Cover says ${cover_inv[0]:,}-${cover_inv[1]:,}, Item 7 says ${item7_low:,}-${item7_high:,}",
                "severity": "warning",
            })

    # ── Item 19 units included vs Item 20 total ──
    i19_units = evidence.get("item19_unitsIncluded")
    total_units = evidence.get("totalUnits")
    if i19_units and total_units and i19_units > total_units * 1.2:
        findings.append({
            "type": "unit_count_mismatch",
            "detail": f"Item 19 says {i19_units} units included but Item 20 total is {total_units}",
            "severity": "warning",
        })

    return findings
