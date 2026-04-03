"""
Item Coverage States

Every item must end in one of these states.
Missing items do NOT silently disappear.

States:
  - complete: item found, tables imported (if required), content confirmed
  - partial: item found, some data missing
  - not_found: item not located in the PDF
  - found_no_table: item found but required tables missing
  - found_needs_note_linkage: tables found but notes not linked
  - referenced_exhibit_missing: item references an exhibit that wasn't parsed
  - needs_manual_review: ambiguous content or low-confidence location
  - blocked_pii: item blocked due to PII content
  - no_data_disclosed: item found but explicitly says nothing to disclose
"""

from typing import Dict
from .models import ItemSection, FailureState, TABLE_REQUIRED_ITEMS


def assess_item_coverage(items: Dict[int, ItemSection]) -> Dict[int, str]:
    """Assess coverage state for all 23 items.

    Returns dict: item_num → coverage state string.
    Every item 1-23 gets a state, even if not found.
    """
    coverage = {}

    for item_num in range(1, 24):
        section = items.get(item_num)

        if section is None:
            coverage[item_num] = "not_found"
            continue

        if section.failure_state == FailureState.BLOCKED_PII:
            coverage[item_num] = "blocked_pii"
            continue

        # Check for "no data disclosed" (very short text with negative disclosure)
        if section.text_length < 200:
            import re
            if re.search(r'(?:no|none|not applicable|no.*required|no.*disclosed)', section.text[:200], re.I):
                coverage[item_num] = "no_data_disclosed"
                continue

        # Check table requirements
        if item_num in TABLE_REQUIRED_ITEMS:
            if len(section.tables) == 0:
                coverage[item_num] = "found_no_table"
                continue

        # Check note linkage
        has_tables_needing_notes = any(
            len(t.table_notes) == 0 and t.row_count >= 5
            for t in section.tables
        )
        if has_tables_needing_notes and item_num in (7, 19, 21):
            coverage[item_num] = "found_needs_note_linkage"
            continue

        # Check unresolved exhibit references
        has_unresolved_exhibit = any(
            cr.status == "unresolved" and cr.target_type == "exhibit"
            for cr in section.cross_refs
        )
        if has_unresolved_exhibit:
            coverage[item_num] = "referenced_exhibit_missing"
            continue

        # Check if location confidence is low
        if section.failure_state == FailureState.PARSE_FAILED:
            coverage[item_num] = "needs_manual_review"
            continue

        # Determine complete vs partial
        if section.text_length > 0 and (
            len(section.tables) > 0 or item_num not in TABLE_REQUIRED_ITEMS
        ):
            coverage[item_num] = "complete"
        else:
            coverage[item_num] = "partial"

    return coverage
