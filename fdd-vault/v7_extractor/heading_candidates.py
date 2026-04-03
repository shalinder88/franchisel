"""
Heading Candidates — Layout-Based Collection

Collects section-start candidates from block/span geometry, NOT flattened text.

Rules:
  - block/span based: uses LayoutBlock position, font, style
  - joins two-line headings ("ITEM 7:\nESTIMATED INITIAL INVESTMENT")
  - mixed-case "Item" is weak evidence (body text cross-reference)
  - ALL CAPS "ITEM" in bold/display block near TOC page is strong evidence
  - candidates inside table regions get heavy penalty

Does NOT decide which candidate wins — that's the path resolver's job.
"""

from typing import List, Dict, Optional
from .layout_index import LayoutIndex, HeadingLikeBlock, TableRegion
from .section_candidate import SectionCandidate


def collect_heading_candidates(layout_index: LayoutIndex,
                                page_windows: Dict[int, tuple] = None) -> Dict[int, List[SectionCandidate]]:
    """Collect section candidates from layout-based heading detection.

    Uses HeadingLikeBlock objects from the layout index.
    Optionally filters by page windows (expected page range per item from TOC).

    Returns dict: item_number → list of SectionCandidate
    """
    candidates: Dict[int, List[SectionCandidate]] = {n: [] for n in range(1, 24)}
    table_pages = layout_index.pages_with_tables()

    for heading in layout_index.heading_candidates:
        item_num = heading.item_number
        if item_num is None or not (1 <= item_num <= 23):
            continue

        # Check if this candidate is within the expected page window
        if page_windows and item_num in page_windows:
            window_start, window_end = page_windows[item_num]
            if not (window_start <= heading.page_num <= window_end):
                continue  # outside expected range

        cand = SectionCandidate(
            item_number=item_num,
            page_pdf=heading.page_num,
            heading_text=heading.text,
            bbox=heading.bbox,
            font_size=heading.font_size,
            is_bold=heading.is_bold,
            is_centered=heading.is_centered,
            block_boundary=True,  # it came from a layout block
            in_table_region=heading.in_table_region,
            source_type="heading_candidate",
        )

        # Set confidence from layout features
        cand.confidence = heading.confidence

        candidates[item_num].append(cand)

    return candidates


def build_page_windows(toc_map: Dict[int, int],
                        offset: int,
                        total_pages: int,
                        window_size: int = 5) -> Dict[int, tuple]:
    """Build expected page windows from TOC map.

    For each TOC item, creates a (start, end) page range where
    the item heading should be found.

    Returns dict: item_number → (start_pdf_page, end_pdf_page)
    """
    windows = {}
    for item_num, toc_page in toc_map.items():
        if isinstance(item_num, str):
            item_num = int(item_num)
        target = toc_page + offset
        start = max(1, target - 2)
        end = min(total_pages, target + window_size)
        windows[item_num] = (start, end)
    return windows
