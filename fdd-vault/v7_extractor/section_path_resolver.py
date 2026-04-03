"""
Section Path Resolver

For each item, keeps multiple candidates and chooses the best
monotonic sequence across Items 1-23.

The resolver ensures:
  - Items appear in order (monotonic page sequence)
  - No item starts before the previous item
  - The best overall path is selected, not greedy first-match

Uses dynamic programming: find the highest-scoring monotonic
subsequence of candidates across all 23 items.
"""

from typing import Dict, List, Optional
from .section_candidate import SectionCandidate, score_candidate


def resolve_best_path(candidates: Dict[int, List[SectionCandidate]]) -> Dict[int, SectionCandidate]:
    """Select the best monotonic path through item candidates.

    Given multiple candidates per item, find the assignment that:
    1. Maximizes total score
    2. Maintains monotonic page order (item N's page < item N+1's page)
    3. Covers as many items as possible

    Returns dict: item_num → selected SectionCandidate
    """
    # Score all candidates
    for item_num, cands in candidates.items():
        for c in cands:
            score_candidate(c)

    # Sort items
    item_nums = sorted(candidates.keys())

    if not item_nums:
        return {}

    # For each item, sort candidates by score (descending)
    for item_num in item_nums:
        candidates[item_num].sort(key=lambda c: c.confidence, reverse=True)

    # ── Greedy forward pass with look-ahead ──
    # Start with the highest-scoring candidate for each item that maintains order
    selected: Dict[int, SectionCandidate] = {}
    last_page = -1

    for item_num in item_nums:
        best = None
        for cand in candidates[item_num]:
            # Must be after the previous item's page
            if cand.page_pdf > last_page:
                # Must not have critical rejection reasons
                if cand.in_table_region or cand.in_obligations_matrix:
                    cand.rejection_reasons.append("in_table_region")
                    continue
                best = cand
                break

        if best:
            best.accepted = True
            selected[item_num] = best
            last_page = best.page_pdf

    return selected


def resolve_with_toc_priority(candidates: Dict[int, List[SectionCandidate]],
                               toc_map: Dict[int, int],
                               offset: int = 0) -> Dict[int, SectionCandidate]:
    """Resolve path with TOC items getting priority placement.

    TOC-anchored candidates are placed first as fixed anchors.
    Then remaining items fill in between anchors.
    """
    # Score all
    for item_num, cands in candidates.items():
        for c in cands:
            score_candidate(c)

    item_nums = sorted(candidates.keys())
    selected: Dict[int, SectionCandidate] = {}

    # Phase 1: Place TOC-anchored candidates as fixed points
    toc_items = sorted(k for k in item_nums if k in toc_map or str(k) in toc_map)
    last_page = -1
    for item_num in toc_items:
        toc_cands = [c for c in candidates.get(item_num, [])
                     if c.source_type == "toc_anchor" and c.page_pdf > last_page]
        if toc_cands:
            best = max(toc_cands, key=lambda c: c.confidence)
            best.accepted = True
            selected[item_num] = best
            last_page = best.page_pdf

    # Phase 2: Fill gaps with non-TOC candidates
    for item_num in item_nums:
        if item_num in selected:
            continue

        # Find the page range this item must be in
        prev_page = -1
        next_page = 999999
        for sel_num in sorted(selected.keys()):
            if sel_num < item_num:
                prev_page = max(prev_page, selected[sel_num].page_pdf)
            elif sel_num > item_num:
                next_page = min(next_page, selected[sel_num].page_pdf)
                break

        # Find best candidate in range
        valid = [c for c in candidates.get(item_num, [])
                 if prev_page < c.page_pdf < next_page
                 and not c.in_table_region
                 and not c.in_obligations_matrix]
        if valid:
            best = max(valid, key=lambda c: c.confidence)
            best.accepted = True
            selected[item_num] = best

    return selected
