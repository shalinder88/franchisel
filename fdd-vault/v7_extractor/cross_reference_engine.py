"""
Cross-Reference Engine

Manages the cross-reference graph.
When an item says "see Exhibit X" or "see Item Y", this engine:
  1. Records the reference
  2. Attempts to resolve it against known exhibits/items
  3. Flags unresolved references for the QA sweep
"""

from typing import List, Dict
from .models import CrossReference, ItemSection, ExhibitObject


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

    Mutates the CrossReference status field:
      - "resolved" if target was found and parsed
      - "missing_target" if target doesn't exist
      - "blocked" if target is PII-blocked
      - "unresolved" if not yet processed
    """
    for cr in refs:
        if cr.target_type == "exhibit":
            # Check if exhibit exists and was parsed
            exhibit_code = cr.target_id.replace("Exhibit ", "").strip()
            if exhibit_code in exhibits:
                ex = exhibits[exhibit_code]
                if ex.parsed:
                    cr.status = "resolved"
                    cr.resolution_page = ex.start_page
                else:
                    cr.status = "unresolved"
            else:
                cr.status = "missing_target"

        elif cr.target_type == "item":
            # Check if item exists
            try:
                item_num = int(cr.target_id.replace("Item ", "").strip())
                if item_num in items:
                    cr.status = "resolved"
                    cr.resolution_page = items[item_num].start_page
                else:
                    cr.status = "missing_target"
            except ValueError:
                cr.status = "unresolved"

    return refs


def summary(refs: List[CrossReference]) -> Dict[str, int]:
    """Count cross-references by status."""
    counts: Dict[str, int] = {}
    for cr in refs:
        counts[cr.status] = counts.get(cr.status, 0) + 1
    return counts
