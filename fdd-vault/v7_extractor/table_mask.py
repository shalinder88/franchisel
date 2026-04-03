"""
Table Mask

Prevents table cells from becoming section starts.

Hard rule: any candidate inside a detected table region is presumed
cross-reference unless strong contrary evidence exists.

The obligations matrix (Item 9) is the primary failure case.
It contains "Item 6", "Item 11", "Item 12", etc. as cross-references
to other items, NOT as section starts.
"""

from typing import List, Dict
from .section_candidate import SectionCandidate
from .layout_index import LayoutIndex


def mask_candidates_in_table_regions(candidates: Dict[int, List[SectionCandidate]],
                                      layout_index: LayoutIndex) -> Dict[int, List[SectionCandidate]]:
    """Apply table-region penalty to all candidates inside table areas.

    Does NOT delete candidates — marks them with in_table_region=True
    and adds rejection reason. The path resolver decides final acceptance.
    """
    table_pages = layout_index.pages_with_tables()

    for item_num, cands in candidates.items():
        for cand in cands:
            if cand.page_pdf in table_pages:
                cand.in_table_region = True
                cand.confidence *= 0.2  # heavy penalty
                cand.rejection_reasons.append("in_table_region")

    return candidates


def detect_obligations_matrix_pages(layout_index: LayoutIndex,
                                     page_reads: list) -> set:
    """Detect pages that are part of Item 9's obligations matrix.

    The obligations matrix is a dense table with many item cross-references.
    Any heading candidate on these pages should be treated as a cross-reference.

    Detection: pages with 3+ different "Item N" mentions AND table structure.
    """
    import re
    obligations_pages = set()
    table_pages = layout_index.pages_with_tables()

    for pr in page_reads:
        if pr.page_num not in table_pages:
            continue

        # Count distinct item mentions
        text_lower = pr.text.lower()
        item_mentions = set()
        for m in re.finditer(r'item\s+(\d+)', text_lower):
            n = int(m.group(1))
            if 1 <= n <= 23:
                item_mentions.add(n)

        # If 3+ different items mentioned on a table page, it's likely obligations matrix
        if len(item_mentions) >= 3:
            obligations_pages.add(pr.page_num)

    return obligations_pages


def apply_obligations_mask(candidates: Dict[int, List[SectionCandidate]],
                            obligations_pages: set) -> None:
    """Apply heavy penalty to candidates on obligations matrix pages."""
    for item_num, cands in candidates.items():
        for cand in cands:
            if cand.page_pdf in obligations_pages:
                cand.in_obligations_matrix = True
                cand.confidence *= 0.1  # very heavy penalty
                cand.rejection_reasons.append("in_obligations_matrix")
