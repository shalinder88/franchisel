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
                  toc_map: Optional[Dict[int, int]] = None,
                  geometry: Optional[Dict] = None) -> Dict[int, ItemSection]:
    """Segment page reads into Item 1-23 sections.

    Uses item_locator to find boundaries, then collects pages for each item.
    """
    toc_map = toc_map or {}

    # Step 1: Build item index using the locator service
    # Pass layout_index as supplementary evidence if available
    from .layout_index import LayoutIndex
    layout_idx = geometry if isinstance(geometry, LayoutIndex) else None
    item_index = locate_all_items(page_reads, toc_map, layout_index=layout_idx)

    # Step 2: Assemble sections from index
    items: Dict[int, ItemSection] = {}

    # Identify shared pages for intra-page splitting
    import re
    shared_page_groups: Dict[int, List[int]] = {}
    for item_num, loc in item_index.items():
        if loc.get("needs_intra_page_split"):
            page_idx = loc["start_page_idx"]
            if page_idx not in shared_page_groups:
                shared_page_groups[page_idx] = []
            shared_page_groups[page_idx].append(item_num)

    for item_num, loc in item_index.items():
        start_idx = loc["start_page_idx"]
        end_idx = loc.get("end_page_idx", start_idx)

        # Collect pages for this item
        section_pages = []
        for pi in range(start_idx, min(end_idx + 1, len(page_reads))):
            section_pages.append(page_reads[pi])

        if not section_pages:
            continue

        # Build section text
        text = "\n".join(p.text for p in section_pages)

        # ── Intra-page splitting ──
        # When multiple items share a page, split text by "Item N" headings
        if loc.get("needs_intra_page_split") and start_idx in shared_page_groups:
            items_on_page = sorted(shared_page_groups[start_idx])
            page_text = section_pages[0].text if section_pages else ""

            # Find this item's text within the shared page
            split_text = _split_shared_page(page_text, item_num, items_on_page)
            if split_text is not None:
                # Use only the split portion for shared page, plus any additional pages
                if len(section_pages) > 1:
                    text = split_text + "\n" + "\n".join(p.text for p in section_pages[1:])
                else:
                    text = split_text

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


def _split_shared_page(page_text: str, target_item: int,
                       items_on_page: List[int]) -> Optional[str]:
    """Split a shared page's text to extract only the target item's portion.

    Looks for "Item N" headings within the page text.
    Returns the text belonging to target_item, or None if splitting fails.
    """
    import re

    # Find all "Item N" heading positions in the text
    heading_positions = []
    for m in re.finditer(r'(?:^|\n)\s*(?:ITEM|Item)\s+(\d+)\b', page_text):
        num = int(m.group(1))
        if num in items_on_page:
            heading_positions.append((num, m.start()))

    if not heading_positions:
        return None  # can't split — no headings found

    # Sort by position
    heading_positions.sort(key=lambda x: x[1])

    # Find the target item's text range
    for i, (num, pos) in enumerate(heading_positions):
        if num == target_item:
            start = pos
            if i + 1 < len(heading_positions):
                end = heading_positions[i + 1][1]
            else:
                end = len(page_text)
            return page_text[start:end]

    return None  # target item not found in headings
