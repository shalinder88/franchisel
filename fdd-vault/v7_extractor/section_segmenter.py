"""
Section Segmenter — Layer 2

Groups pages into Items 1-23 sections.

Uses the item_locator service to build an item index FIRST,
then assembles sections by collecting pages within each item's boundaries.

Finding items and extracting them are DECOUPLED:
  1. item_locator.locate_all_items() builds the index
  2. This module assembles ItemSection objects from the index

A section includes:
  - the pages inside the item boundaries
  - text accumulated from those pages
  - cross-references found on those pages
  - red flags found on those pages
  - tables and notes are populated LATER by table_importer and note_linker
"""

from typing import List, Dict, Optional
from .models import PageRead, ItemSection, CrossReference, FailureState
from .item_locator import locate_all_items


def segment_items(page_reads: List[PageRead],
                  toc_map: Optional[Dict[int, int]] = None) -> Dict[int, ItemSection]:
    """Segment page reads into Item 1-23 sections.

    Uses item_locator to find boundaries, then collects pages for each item.
    """
    toc_map = toc_map or {}

    # Step 1: Build item index using the locator service
    item_index = locate_all_items(page_reads, toc_map)

    # Step 2: Assemble sections from index
    items: Dict[int, ItemSection] = {}

    for item_num, loc in item_index.items():
        start_idx = loc["start_page_idx"]
        end_idx = loc.get("end_page_idx", start_idx)

        # Collect pages for this item
        section_pages = []
        for pi in range(start_idx, min(end_idx + 1, len(page_reads))):
            section_pages.append(page_reads[pi])

        if not section_pages:
            continue

        # Build section
        text = "\n".join(p.text for p in section_pages)
        if len(text) > 60000:
            text = text[:60000]

        cross_refs = []
        red_flags = []
        for p in section_pages:
            for ptr in p.unresolved_pointers:
                ptr.source_item = item_num
                cross_refs.append(ptr)
            red_flags.extend(p.red_flags)

        items[item_num] = ItemSection(
            item_num=item_num,
            start_page=section_pages[0].page_num,
            end_page=section_pages[-1].page_num,
            pages=section_pages,
            text=text,
            text_length=len(text),
            cross_refs=cross_refs,
            red_flags=red_flags,
            page_count=len(section_pages),
            # tables and notes populated later
        )

    return items
