"""
Table Mask — Softened Penalizer

Three mask outcomes:
  - none: candidate is not in a table region
  - soft_penalty: candidate is near table content but not clearly inside a cell
  - hard_penalty: candidate is clearly inside a table cell (obligations matrix)

Hard penalty only when ALL are true:
  - inside detected table bbox
  - narrow cell or row context
  - multiple item references on page
  - weak or absent content confirmation

If content confirmation is strong AND TOC proximity is strong,
table mask should usually be soft_penalty, not rejection.

Layout modules may decrease confidence but do NOT replace
TOC anchoring or content confirmation as the primary basis.
"""

import re
from typing import List, Dict, Set
from .section_candidate import SectionCandidate
from .layout_index import LayoutIndex


def compute_table_penalty(cand: SectionCandidate,
                           table_pages: Set[int],
                           obligations_pages: Set[int]) -> str:
    """Compute table mask outcome for a candidate.

    Returns: "none", "soft_penalty", or "hard_penalty"
    """
    if cand.page_pdf not in table_pages:
        return "none"

    if cand.page_pdf in obligations_pages:
        return "hard_penalty"

    # Soft penalty: on a table page but not clearly in obligations matrix
    return "soft_penalty"


def apply_table_penalties(candidates: Dict[int, List[SectionCandidate]],
                           layout_index: LayoutIndex,
                           page_reads: list) -> None:
    """Apply table penalties to all candidates. Mutates candidates in place.

    Soft penalty: confidence *= 0.7
    Hard penalty: confidence *= 0.2, add rejection reason
    """
    table_pages = layout_index.pages_with_tables()
    obligations_pages = detect_obligations_matrix_pages(page_reads, table_pages)

    for item_num, cands in candidates.items():
        for cand in cands:
            penalty = compute_table_penalty(cand, table_pages, obligations_pages)

            if penalty == "hard_penalty":
                cand.in_table_region = True
                cand.in_obligations_matrix = True
                cand.confidence *= 0.2
                cand.rejection_reasons.append("hard_table_penalty: obligations_matrix")
            elif penalty == "soft_penalty":
                cand.in_table_region = True
                cand.confidence *= 0.7
                # Soft penalty does NOT add rejection reason — just lowers confidence


def detect_obligations_matrix_pages(page_reads: list,
                                     table_pages: Set[int]) -> Set[int]:
    """Detect pages that are part of Item 9's obligations matrix.

    Detection: table pages with 3+ different "Item N" mentions.
    These pages are dense cross-reference tables where item mentions
    are graph edges, NOT section starts.
    """
    obligations_pages: Set[int] = set()

    for pr in page_reads:
        if pr.page_num not in table_pages:
            continue

        text_lower = pr.text.lower()
        item_mentions = set()
        # Simple word matching, no regex
        for n in range(1, 24):
            if f"item {n}" in text_lower or f"item {n}" in text_lower:
                item_mentions.add(n)

        # 3+ different items mentioned on a table page = obligations matrix
        if len(item_mentions) >= 3:
            obligations_pages.add(pr.page_num)

    return obligations_pages
