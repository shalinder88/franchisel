"""
Section Segmenter — Layer 2

Groups pages into Items 1-23 sections by reading in order.

The segmenter reads sequentially through page reads.
When an item heading is detected on a page, the reader transitions to that item.
Items appear in order (1-23) in an FDD — the segmenter enforces this.

Section location hierarchy:
  Primary: TOC-anchored with heading verification on target page
  Secondary: Sequential heading detection (reading in order)
  Tertiary: Manual review flag for missing items

A section includes:
  - the pages inside the item
  - continuation tables
  - notes/footnotes tied to those tables
  - cross-references found on those pages
"""

import re
from typing import List, Dict, Optional
from .models import (PageRead, PageType, ItemSection, CrossReference,
                     FailureState, TABLE_REQUIRED_ITEMS)


# Page types that are bootstrap/exhibit — NOT item content
SKIP_PAGE_TYPES = {
    PageType.COVER, PageType.HOW_TO_USE, PageType.TOC,
    PageType.STATE_NOTICE, PageType.EXHIBIT_LIST, PageType.SPECIAL_RISKS,
}


def segment_items(page_reads: List[PageRead],
                  toc_map: Optional[Dict[int, int]] = None) -> Dict[int, ItemSection]:
    """Segment page reads into Item 1-23 sections.

    Reads sequentially. When an item heading is detected on a page,
    the reader transitions to that item. Items must go forward (no backwards).

    Uses TOC map for verification but heading detection is primary.
    """
    toc_map = toc_map or {}
    items: Dict[int, ItemSection] = {}
    current_item: Optional[int] = None
    current_pages: List[PageRead] = []

    for pr in page_reads:
        # Skip bootstrap pages entirely for item heading detection
        if pr.page_type in SKIP_PAGE_TYPES:
            continue

        # Check for item heading transitions on this page
        new_item_detected = False
        for heading in pr.item_headings:
            detected_num = heading["item_num"]

            # Items must go forward — no backwards transitions
            if current_item is not None and detected_num <= current_item:
                continue

            # Valid transition: save current item, start new one
            if current_item is not None and current_pages:
                items[current_item] = _build_section(current_item, current_pages)

            current_item = detected_num
            current_pages = [pr]
            new_item_detected = True
            break  # only process first valid heading per page

        if not new_item_detected and current_item is not None:
            # No new heading — accumulate for current item
            current_pages.append(pr)

    # Save last item
    if current_item is not None and current_pages:
        items[current_item] = _build_section(current_item, current_pages)

    # ── Use TOC to detect items we missed ──
    # If TOC says Item X starts on page P, and we didn't detect it,
    # look for it in the page reads near that page
    for item_num, toc_page in toc_map.items():
        if item_num in items:
            continue

        # Find the page range where this item should be
        # (between previous found item and next found item)
        prev_item_end = 0
        next_item_start = len(page_reads)
        for found_num, found_section in items.items():
            if found_num < item_num:
                prev_item_end = max(prev_item_end, found_section.end_page)
            elif found_num > item_num:
                next_item_start = min(next_item_start, found_section.start_page)

        # Look for item heading near TOC target page
        for pr in page_reads:
            if not (prev_item_end <= pr.page_num <= next_item_start):
                continue
            for heading in pr.item_headings:
                if heading["item_num"] == item_num:
                    # Found it — but we need to build its section
                    # Collect pages from this heading to the next item
                    section_pages = []
                    collecting = False
                    for pr2 in page_reads:
                        if pr2.page_num == pr.page_num:
                            collecting = True
                        if collecting:
                            # Stop at next item's start
                            if pr2.page_num >= next_item_start and pr2.page_num != pr.page_num:
                                break
                            section_pages.append(pr2)
                    if section_pages:
                        items[item_num] = _build_section(item_num, section_pages)
                    break
            if item_num in items:
                break

    return items


def _build_section(item_num: int, page_reads: List[PageRead]) -> ItemSection:
    """Build an ItemSection from accumulated page reads."""
    text = "\n".join(p.text for p in page_reads)
    if len(text) > 60000:
        text = text[:60000]

    cross_refs = []
    red_flags = []
    for p in page_reads:
        for ptr in p.unresolved_pointers:
            ptr.source_item = item_num
            cross_refs.append(ptr)
        red_flags.extend(p.red_flags)

    return ItemSection(
        item_num=item_num,
        start_page=page_reads[0].page_num,
        end_page=page_reads[-1].page_num,
        pages=page_reads,
        text=text,
        text_length=len(text),
        cross_refs=cross_refs,
        red_flags=red_flags,
        page_count=len(page_reads),
        # tables and notes are populated later by table_importer and note_linker
    )
