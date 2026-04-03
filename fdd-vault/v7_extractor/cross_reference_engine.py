"""
Cross-Reference Engine

Manages the cross-reference graph.
When an item says "see Exhibit X" or "see Item Y", this engine:
  1. Records the reference
  2. Attempts to resolve it against known exhibits/items
  3. Flags unresolved references for the QA sweep
  4. Blocks gold publish if unresolved critical references remain

Detects: see Exhibit, see Note, see Item, see Addendum,
         see Attachment, see Appendix, see Operations Manual TOC

Statuses: resolved / unresolved / missing_target / blocked_pii / needs_review
"""

import re
from typing import List, Dict
from .models import CrossReference, ItemSection, ExhibitObject, ExhibitRole, PII_BLOCKED_SECTIONS


def collect_all_cross_refs(items: Dict[int, ItemSection]) -> List[CrossReference]:
    """Collect all cross-references from all items into a flat list."""
    all_refs = []
    for item_num, section in items.items():
        for cr in section.cross_refs:
            cr.source_item = item_num
            all_refs.append(cr)
    return all_refs


def resolve_cross_refs(refs: List[CrossReference],
                       items: Dict[int, ItemSection],
                       exhibits: Dict[str, ExhibitObject]) -> List[CrossReference]:
    """Attempt to resolve cross-references against known items and exhibits.

    Mutates the CrossReference status field.
    """
    for cr in refs:
        if cr.target_type == "exhibit":
            exhibit_code = cr.target_id.replace("Exhibit ", "").replace("Exhibit", "").strip()
            if exhibit_code in exhibits:
                ex = exhibits[exhibit_code]
                # Check PII blocking
                if ex.role in (ExhibitRole.FRANCHISEE_LIST, ExhibitRole.FORMER_FRANCHISEE_LIST,
                               ExhibitRole.RECEIPT):
                    cr.status = "blocked_pii"
                elif ex.parsed:
                    cr.status = "resolved"
                    cr.resolution_page = ex.start_page
                else:
                    cr.status = "unresolved"
            else:
                cr.status = "missing_target"

        elif cr.target_type == "item":
            try:
                item_num = int(re.search(r'\d+', cr.target_id).group())
                if item_num in items:
                    cr.status = "resolved"
                    cr.resolution_page = items[item_num].start_page
                else:
                    cr.status = "missing_target"
            except (ValueError, AttributeError):
                cr.status = "unresolved"

        elif cr.target_type == "note":
            # Notes are resolved by the note_linker; mark as needs_review here
            cr.status = "needs_review"

        elif cr.target_type == "table":
            cr.status = "needs_review"

    return refs


def summary(refs: List[CrossReference]) -> Dict[str, int]:
    """Count cross-references by status."""
    counts: Dict[str, int] = {}
    for cr in refs:
        counts[cr.status] = counts.get(cr.status, 0) + 1
    return counts


def check_publish_blocking(refs: List[CrossReference]) -> Dict[str, any]:
    """Check if unresolved cross-references should block gold publish.

    Rules:
      - Any unresolved exhibit reference from Items 19, 20, 21 blocks gold
      - Any missing_target exhibit blocks gold
      - >5 total unresolved references blocks gold
      - blocked_pii references are acceptable (expected behavior)

    Returns dict with blocking decision and details.
    """
    unresolved = [cr for cr in refs if cr.status == "unresolved"]
    missing = [cr for cr in refs if cr.status == "missing_target"]

    # Critical items where exhibit references must be resolved
    critical_item_unresolved = [
        cr for cr in unresolved
        if cr.source_item in (19, 20, 21) and cr.target_type == "exhibit"
    ]

    blocks_gold = (
        len(critical_item_unresolved) > 0 or
        len(missing) > 0 or
        len(unresolved) > 5
    )

    return {
        "blocks_gold": blocks_gold,
        "unresolved_count": len(unresolved),
        "missing_count": len(missing),
        "critical_unresolved": [
            {"text": cr.text, "item": cr.source_item, "page": cr.source_page}
            for cr in critical_item_unresolved
        ],
        "missing_targets": [
            {"text": cr.text, "item": cr.source_item}
            for cr in missing
        ],
    }
