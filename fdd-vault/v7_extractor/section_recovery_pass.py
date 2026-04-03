"""
Section Recovery Pass

If TOC says an item exists but the resolved path still marks it missing:
  1. Jump to TOC page ±2
  2. Scan layout blocks
  3. Run content confirmer
  4. If still unresolved, mark needs_manual_review

This is the last resort before giving up on an item.
"""

from typing import Dict, List, Optional
from .models import PageRead, PageType
from .section_candidate import SectionCandidate
from .content_confirmer import confirm_section_content


def recover_missing_items(resolved: Dict[int, SectionCandidate],
                          page_reads: List[PageRead],
                          toc_map: Dict[int, int],
                          offset: int = 0) -> Dict[int, SectionCandidate]:
    """Try to recover items that TOC declares but path resolver missed.

    Returns additional candidates for previously-missing items.
    """
    recovered: Dict[int, SectionCandidate] = {}
    total_pages = len(page_reads)

    for item_num in range(1, 24):
        if item_num in resolved:
            continue

        toc_page = toc_map.get(item_num) or toc_map.get(str(item_num))
        if not toc_page:
            continue

        # Jump to TOC target ±2 pages
        target_idx = toc_page + offset - 1

        best_idx = None
        best_score = -1

        for delta in range(-2, 4):
            check_idx = target_idx + delta
            if check_idx < 0 or check_idx >= total_pages:
                continue

            pr = page_reads[check_idx]
            if pr.page_type in (PageType.COVER, PageType.HOW_TO_USE, PageType.TOC,
                                PageType.STATE_NOTICE, PageType.EXHIBIT_LIST):
                continue

            # Content confirmation
            result = confirm_section_content(item_num, pr.text)
            if result["confirmed"] and result["confidence"] > best_score:
                best_score = result["confidence"]
                best_idx = check_idx

        if best_idx is not None and best_score > 0.3:
            # Check it doesn't violate monotonic order
            prev_page = -1
            next_page = total_pages + 1
            for sel_num, sel_cand in resolved.items():
                if sel_num < item_num:
                    prev_page = max(prev_page, sel_cand.page_pdf)
                elif sel_num > item_num:
                    next_page = min(next_page, sel_cand.page_pdf)

            pdf_page = best_idx + 1
            if prev_page < pdf_page < next_page:
                recovered[item_num] = SectionCandidate(
                    item_number=item_num,
                    page_pdf=pdf_page,
                    source_type="recovery",
                    confidence=best_score * 0.8,  # slightly lower confidence for recovery
                    toc_distance=abs(pdf_page - (toc_page + offset)),
                    toc_page_target=toc_page,
                    accepted=True,
                )

    return recovered
