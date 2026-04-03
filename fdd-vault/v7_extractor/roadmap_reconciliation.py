"""
Roadmap Reconciliation

At end of run, compare:
  - TOC-declared items
  - located items
  - extracted items
  - engine-fed items
  - publish-required items

Write explicit mismatch states.
No silent disappearance. No silent zero-values.
"""

from typing import Dict, List, Any


def reconcile_roadmap(toc_map: Dict[int, int],
                      located_items: Dict[int, Any],
                      extracted_items: Dict[int, Any],
                      evidence: Dict,
                      coverage: Dict[int, str]) -> Dict[str, Any]:
    """Compare what the TOC promised vs what was actually extracted.

    Returns reconciliation report with mismatches.
    """
    toc_declared = set(toc_map.keys())
    located = set(located_items.keys()) if located_items else set()
    extracted = set(extracted_items.keys()) if extracted_items else set()
    all_items = set(range(1, 24))

    # Mismatch categories
    toc_but_not_located = toc_declared - located
    located_but_not_extracted = located - extracted
    not_in_toc_but_found = located - toc_declared
    completely_missing = all_items - located

    # Publish-required items check
    publish_required = {5, 6, 7, 19, 20, 21}
    publish_missing = publish_required - extracted

    # Engine-fed check: did key engines get data?
    engine_gaps = []
    if not evidence.get("totalUnits") and not evidence.get("franchisedUnits"):
        engine_gaps.append("item20_units_not_fed")
    if not evidence.get("totalInvestmentLow"):
        engine_gaps.append("item7_investment_not_fed")
    if not evidence.get("royaltyRate"):
        engine_gaps.append("item6_royalty_not_fed")
    if evidence.get("hasItem19") is None:
        engine_gaps.append("item19_fpr_not_determined")

    # Zero-value check: items that exist but produced zero/null engine values
    zero_value_items = []
    for item_num, state in coverage.items():
        if state == "complete" and item_num in (20,):
            total = evidence.get("totalUnits")
            if total is not None and total == 0:
                zero_value_items.append({
                    "item": item_num,
                    "issue": "Item found and marked complete but total units = 0",
                })

    return {
        "toc_declared": sorted(toc_declared),
        "located": sorted(located),
        "extracted": sorted(extracted),
        "toc_but_not_located": sorted(toc_but_not_located),
        "located_but_not_extracted": sorted(located_but_not_extracted),
        "not_in_toc_but_found": sorted(not_in_toc_but_found),
        "completely_missing": sorted(completely_missing),
        "publish_required_missing": sorted(publish_missing),
        "engine_gaps": engine_gaps,
        "zero_value_items": zero_value_items,
        "items_found": len(located),
        "items_extracted": len(extracted),
        "total_mismatches": (len(toc_but_not_located) + len(located_but_not_extracted) +
                             len(engine_gaps) + len(zero_value_items)),
    }
