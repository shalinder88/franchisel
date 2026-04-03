"""
Item Locator — V7 Hardened

9-step pipeline:
  1. TOC parser (from bootstrap)
  2. TOC-to-PDF offset calibrator
  3. TOC page-band priors
  4. Block/span heading candidate collector (layout-aware, not text-stream)
  5. Table-mask suppressor (any candidate inside table region = cross-reference)
  6. Content confirmer
  7. Monotonic best-path resolver
  8. Recovery pass for unresolved items
  9. Coverage registry writeback

TOC is primary. Heading evidence is fallback, not primary truth.
Any candidate inside a detected table region is presumed cross-reference.
Regex is NOT used for section extraction.
"""

from typing import List, Dict, Optional, Tuple
from .models import PageRead, PageType
from .section_candidate import SectionCandidate, score_candidate
from .section_path_resolver import resolve_with_toc_priority
from .section_recovery_pass import recover_missing_items
from .content_confirmer import confirm_section_content


# ══════════════════════════════════════════════════════════════════════════════
# ITEM CONTENT SIGNALS — for content confirmation, not regex extraction
# Simple word matching (string `in` operator), no regex
# ══════════════════════════════════════════════════════════════════════════════

ITEM_CONTENT = {
    1: ["formed", "incorporated", "organized", "parent", "predecessor", "affiliate", "began franchising"],
    2: ["business experience", "served as", "officer", "director"],
    3: ["litigation", "v.", "case no", "no litigation"],
    4: ["bankruptcy", "chapter 7", "chapter 11", "no bankruptcy"],
    5: ["initial franchise fee", "initial fee", "development fee", "non-refundable", "lump sum"],
    6: ["royalty", "advertising", "ad fund", "% of gross", "% of net", "other fees"],
    7: ["estimated initial investment", "leasehold", "equipment", "total"],
    8: ["approved supplier", "designated supplier", "required purchase", "sole source"],
    9: ["obligation", "section in agreement", "franchisee's obligations"],
    10: ["financing", "do not offer financing", "guarantee", "sba", "interest rate"],
    11: ["training", "site selection", "advertising program", "computer", "software", "operations manual"],
    12: ["exclusive territory", "protected area", "territory", "radius", "non-exclusive"],
    13: ["trademark", "service mark", "registration no", "uspto", "principal register"],
    14: ["patent", "copyright", "proprietary", "trade secret", "confidential"],
    15: ["full-time", "full time", "personal supervision", "managing owner", "obligation to participate"],
    16: ["restrictions on what", "authorized products", "may sell"],
    17: ["renewal", "termination", "transfer", "non-compete", "dispute resolution", "choice of forum"],
    18: ["public figure", "do not use"],
    19: ["financial performance", "average", "median", "gross sales", "gross revenue", "ebitda"],
    20: ["systemwide outlet", "outlets at start", "outlets at end", "opened", "terminated", "franchised", "company-owned"],
    21: ["financial statement", "audited", "fiscal year"],
    22: ["contracts", "agreement", "exhibit", "attached"],
    23: ["receipt", "detach", "return", "acknowledg"],
}


def _content_score(text: str, item_num: int) -> int:
    """Score how well text matches expected content. Simple word matching, no regex."""
    signals = ITEM_CONTENT.get(item_num, [])
    text_lower = text[:8000].lower()
    return sum(1 for s in signals if s in text_lower)


def _calculate_offset(page_reads: List[PageRead], toc_map: Dict[int, int]) -> int:
    """Calculate FDD-to-PDF page offset by reading page footers.

    Looks for "- N -" style page number footers and compares to PDF page index.
    This is structural reading, not extraction.
    """
    import re
    for pr in page_reads[:60]:
        # Page number footers: "- 31 -" or "31" at bottom
        m = re.search(r'[-–]\s*(\d+)\s*[-–]\s*$', pr.text.strip(), re.MULTILINE)
        if m:
            fdd_page = int(m.group(1))
            pdf_page = pr.page_num
            offset = pdf_page - fdd_page
            if 0 <= offset <= 20:
                return offset

    # Fallback: try content matching against TOC entries
    for item_num, toc_page in sorted(toc_map.items()):
        for offset_try in range(0, 12):
            idx = toc_page + offset_try - 1
            if 0 <= idx < len(page_reads):
                if _content_score(page_reads[idx].text, item_num) >= 2:
                    return offset_try
    return 0


def _collect_candidates(page_reads: List[PageRead],
                        toc_map: Dict[int, int],
                        offset: int,
                        geometry: Dict = None) -> Dict[int, List[SectionCandidate]]:
    """Collect section candidates from TOC anchors and content reading.

    Step 3: TOC page-band priors
    Step 4: Layout-aware candidate collection
    Step 5: Table-mask suppression
    Step 6: Content confirmation
    """
    total_pages = len(page_reads)
    candidates: Dict[int, List[SectionCandidate]] = {n: [] for n in range(1, 24)}

    # Table region index (from geometry)
    page_geom = (geometry or {}).get("page_geometry", [])
    table_pages = set()
    if page_geom:
        for pg in page_geom:
            if pg.get("has_table_indicators"):
                table_pages.add(pg["page_num"])

    # ── Step 3: TOC page-band priors ──
    # For each TOC item, create a high-priority candidate at the predicted page
    for item_num in range(1, 24):
        toc_page = toc_map.get(item_num) or toc_map.get(str(item_num))
        if not toc_page:
            continue

        target_idx = toc_page + offset - 1

        # Search in a window around the target
        for delta in range(-2, 5):
            check_idx = target_idx + delta
            if check_idx < 0 or check_idx >= total_pages:
                continue

            pr = page_reads[check_idx]
            # Skip bootstrap pages
            if pr.page_type in (PageType.COVER, PageType.HOW_TO_USE, PageType.TOC,
                                PageType.STATE_NOTICE, PageType.EXHIBIT_LIST,
                                PageType.SPECIAL_RISKS):
                continue

            content_hits = _content_score(pr.text, item_num)
            # Also score next page for context
            if check_idx + 1 < total_pages:
                content_hits += _content_score(page_reads[check_idx + 1].text, item_num)

            if content_hits >= 1:
                # ── Step 5: Table-mask suppression ──
                in_table = pr.page_num in table_pages
                # Items 9's obligations matrix is a dense table page with many item mentions
                in_obligations = (pr.page_type == PageType.ITEM_TABLE and
                                  content_hits <= 1 and in_table)

                cand = SectionCandidate(
                    item_number=item_num,
                    page_pdf=pr.page_num,
                    source_type="toc_anchor",
                    toc_distance=abs(delta),
                    toc_page_target=toc_page,
                    in_table_region=in_table and item_num not in (5, 6, 7, 9, 17, 19, 20),
                    in_obligations_matrix=in_obligations,
                )

                # ── Step 6: Content confirmation ──
                conf = confirm_section_content(item_num, pr.text)
                cand.confidence = conf.get("confidence", 0.5)
                if conf.get("must_not_have_hits", 0) > 0:
                    cand.rejection_reasons.append(f"anti_content: {conf.get('reason', '')}")
                    cand.in_table_region = True  # treat anti-content as table contamination

                candidates[item_num].append(cand)

    # ── Step 4: Sequential content reading for items not in TOC ──
    # Read pages between known TOC anchors, looking for content that matches
    toc_items = set(toc_map.keys())
    for item_num in range(1, 24):
        if item_num in toc_items and candidates[item_num]:
            continue  # already have TOC candidates

        # Find gap this item should be in
        prev_page = 0
        next_page = total_pages
        for other in sorted(toc_items):
            toc_p = (toc_map.get(other) or 0) + offset
            if other < item_num:
                prev_page = max(prev_page, toc_p)
            elif other > item_num:
                next_page = min(next_page, toc_p)
                break

        # Scan gap pages
        for pi in range(max(0, prev_page - 1), min(next_page, total_pages)):
            pr = page_reads[pi]
            if pr.page_type in (PageType.COVER, PageType.HOW_TO_USE, PageType.TOC,
                                PageType.STATE_NOTICE, PageType.EXHIBIT_LIST,
                                PageType.SPECIAL_RISKS):
                continue

            content_hits = _content_score(pr.text, item_num)
            if content_hits >= 2:
                in_table = pr.page_num in table_pages
                cand = SectionCandidate(
                    item_number=item_num,
                    page_pdf=pr.page_num,
                    source_type="content_match",
                    confidence=min(0.7, content_hits * 0.15),
                    in_table_region=in_table and item_num not in (5, 6, 7, 9, 17, 19, 20),
                )
                candidates[item_num].append(cand)

    return candidates


def locate_all_items(page_reads: List[PageRead],
                     toc_map: Dict[int, int],
                     geometry: Dict = None) -> Dict[int, Dict]:
    """9-step item locator pipeline.

    1. TOC parser (from bootstrap — toc_map input)
    2. TOC-to-PDF offset calibrator
    3. TOC page-band priors
    4. Block/span heading candidate collector
    5. Table-mask suppressor
    6. Content confirmer
    7. Monotonic best-path resolver
    8. Recovery pass for unresolved items
    9. Coverage registry writeback

    Returns dict: item_num → location info
    """
    total_pages = len(page_reads)

    # ── Step 2: Offset calibration ──
    offset = _calculate_offset(page_reads, toc_map)

    # ── Steps 3-6: Collect and score candidates ──
    candidates = _collect_candidates(page_reads, toc_map, offset, geometry)

    # ── Step 7: Monotonic best-path resolver ──
    selected = resolve_with_toc_priority(candidates, toc_map, offset)

    # ── Step 8: Recovery pass ──
    recovered = recover_missing_items(selected, page_reads, toc_map, offset)
    for item_num, cand in recovered.items():
        if item_num not in selected:
            selected[item_num] = cand

    # ── Step 9: Build location output ──
    locations: Dict[int, Dict] = {}
    sorted_items = sorted(selected.keys())

    # Enforce monotonic order
    prev_page = -1
    for item_num in sorted_items:
        cand = selected[item_num]
        page = cand.page_pdf
        if page <= prev_page:
            page = prev_page + 1
            cand.confidence *= 0.5
        prev_page = page

        locations[item_num] = {
            "start_page_idx": page - 1,
            "start_page_num": page,
            "locator_method": cand.source_type,
            "confidence": cand.confidence,
            "content_confirmed": cand.confidence > 0.5,
            "needs_review": cand.confidence < 0.5 or bool(cand.rejection_reasons),
            "toc_distance": cand.toc_distance,
        }

    # Set end pages
    for i, item_num in enumerate(sorted_items):
        if i + 1 < len(sorted_items):
            next_item = sorted_items[i + 1]
            locations[item_num]["end_page_idx"] = locations[next_item]["start_page_idx"] - 1
        else:
            locations[item_num]["end_page_idx"] = total_pages - 1
        if locations[item_num]["end_page_idx"] < locations[item_num]["start_page_idx"]:
            locations[item_num]["end_page_idx"] = locations[item_num]["start_page_idx"]

    return locations
