"""
Item Locator Service — TOC-Anchored Primary

The locator finds item sections by READING, not by regex.

Primary path: TOC-anchored
  1. Bootstrap parses TOC → item page numbers
  2. Calculate PDF page offset (FDD page 1 ≠ PDF page 1)
  3. Jump to predicted PDF page for each item
  4. Read that page — confirm by content signals
  5. Walk forward if needed to find exact start

Secondary path: Sequential reading
  For items NOT in TOC, read pages in order between known items.
  When content changes from one item's signals to another's, that's the boundary.

NO regex heading detection. Content confirmation only.
Regex is disabled here — it belongs in QA Phase 6 only.
"""

from typing import List, Dict, Optional, Tuple
from .models import PageRead, PageType


# ══════════════════════════════════════════════════════════════════════════════
# ITEM CONTENT SIGNATURES — used for content confirmation, not heading detection
# ══════════════════════════════════════════════════════════════════════════════

ITEM_CONTENT = {
    1: {"signals": ["formed", "incorporated", "organized", "parent", "predecessor",
                     "affiliate", "began offering", "began franchising"],
        "anti": ["% of gross", "systemwide outlet"]},
    2: {"signals": ["business experience", "served as", "officer", "director",
                     "employment history"],
        "anti": ["royalty", "systemwide outlet"]},
    3: {"signals": ["litigation", "v.", "case no", "filed", "settlement",
                     "no litigation"],
        "anti": ["royalty", "systemwide outlet"]},
    4: {"signals": ["bankruptcy", "chapter 7", "chapter 11", "no bankruptcy"],
        "anti": ["royalty"]},
    5: {"signals": ["initial franchise fee", "initial fee", "development fee",
                     "non-refundable", "lump sum"],
        "anti": ["% of gross", "systemwide outlet"]},
    6: {"signals": ["royalty", "advertising", "ad fund", "% of gross", "% of net",
                     "transfer fee", "late fee", "other fees"],
        "anti": ["systemwide outlet", "estimated initial investment"]},
    7: {"signals": ["estimated initial investment", "your estimated",
                     "leasehold", "equipment", "total"],
        "anti": ["systemwide outlet"]},
    8: {"signals": ["approved supplier", "designated supplier", "required purchase",
                     "sole source", "rebate", "commission"],
        "anti": ["systemwide outlet"]},
    9: {"signals": ["obligation", "section in agreement", "franchisee's obligations"],
        "anti": ["systemwide outlet"]},
    10: {"signals": ["financing", "do not offer financing", "guarantee", "sba",
                      "small business", "interest rate"],
         "anti": ["systemwide outlet"]},
    11: {"signals": ["training", "site selection", "advertising program", "computer",
                      "software", "operations manual", "opening assistance"],
         "anti": ["systemwide outlet"]},
    12: {"signals": ["exclusive territory", "protected area", "territory",
                      "radius", "mile", "non-exclusive", "development area"],
         "anti": ["systemwide outlet"]},
    13: {"signals": ["trademark", "service mark", "registration no", "uspto",
                      "principal register"],
         "anti": ["systemwide outlet"]},
    14: {"signals": ["patent", "copyright", "proprietary", "trade secret",
                      "confidential"],
         "anti": ["systemwide outlet"]},
    15: {"signals": ["full-time", "full time", "personal supervision",
                      "managing owner", "operating principal", "obligation to participate"],
         "anti": ["systemwide outlet"]},
    16: {"signals": ["restrictions on what", "authorized products", "may sell",
                      "only those products"],
         "anti": ["systemwide outlet"]},
    17: {"signals": ["renewal", "termination", "transfer", "non-compete",
                      "dispute resolution", "choice of forum", "choice of law",
                      "length of term", "term of franchise"],
         "anti": ["systemwide outlet", "financial performance"]},
    18: {"signals": ["public figure", "do not use"],
         "anti": ["royalty", "systemwide outlet"]},
    19: {"signals": ["financial performance", "average", "median", "gross sales",
                      "gross revenue", "ebitda", "sold these amounts"],
         "anti": ["systemwide outlet summary", "outlets at start"]},
    20: {"signals": ["systemwide outlet", "outlets at start", "outlets at end",
                      "opened", "terminated", "non-renewed", "reacquired",
                      "ceased operations", "franchised", "company-owned"],
         "anti": ["ebitda", "average revenue"]},
    21: {"signals": ["financial statement", "audited", "fiscal year", "exhibit"],
         "anti": ["systemwide outlet"]},
    22: {"signals": ["contracts", "agreement", "exhibit", "attached"],
         "anti": ["systemwide outlet"]},
    23: {"signals": ["receipt", "detach", "return", "acknowledg"],
         "anti": ["royalty"]},
}


def _content_match(text: str, item_num: int) -> Tuple[int, int]:
    """Score how well page text matches expected content for an item.
    Uses simple word matching — NO regex.
    Returns (signal_hits, anti_hits).
    """
    content = ITEM_CONTENT.get(item_num)
    if not content:
        return (0, 0)
    text_lower = text[:8000].lower()
    signal_hits = sum(1 for s in content["signals"] if s in text_lower)
    anti_hits = sum(1 for a in content["anti"] if a in text_lower[:4000])
    return (signal_hits, anti_hits)


def _calculate_toc_offset(page_reads: List[PageRead], toc_map: Dict[int, int]) -> int:
    """Calculate the offset between FDD page numbers and PDF page numbers.

    FDDs often have front matter (cover, TOC, state notices) before page 1.
    If TOC says Item 10 is on "page 31" but that's actually PDF page 36,
    the offset is 5.

    Strategy: find a page with a clear page number footer like "- 31 -"
    and compare it to the PDF page index.
    """
    import re

    # Try to find page number footers in the first 50 pages
    for pr in page_reads[:50]:
        # Look for "- N -" pattern (common FDD footer)
        m = re.search(r'[-–]\s*(\d+)\s*[-–]\s*$', pr.text.strip(), re.MULTILINE)
        if m:
            fdd_page = int(m.group(1))
            pdf_page = pr.page_num
            offset = pdf_page - fdd_page
            if 0 <= offset <= 20:  # reasonable offset
                return offset

    # Fallback: try to match TOC entries to actual content
    # If TOC says Item 17 is on page 60 and we find Item 17 content near PDF page 65,
    # offset is 5
    for item_num, toc_page in sorted(toc_map.items()):
        # Search pages near toc_page for content that matches this item
        for offset_guess in range(0, 15):
            pdf_page_idx = toc_page + offset_guess - 1
            if 0 <= pdf_page_idx < len(page_reads):
                hits, antis = _content_match(page_reads[pdf_page_idx].text, item_num)
                if hits >= 2 and antis == 0:
                    return offset_guess
            # Also try negative offset (front matter is shorter than expected)
            pdf_page_idx = toc_page - offset_guess - 1
            if 0 <= pdf_page_idx < len(page_reads):
                hits, antis = _content_match(page_reads[pdf_page_idx].text, item_num)
                if hits >= 2 and antis == 0:
                    return -offset_guess

    return 0  # no offset detected


def locate_all_items(page_reads: List[PageRead],
                     toc_map: Dict[int, int]) -> Dict[int, Dict]:
    """Build an item index. TOC-anchored primary. No regex heading detection.

    Level 1: TOC anchor — use TOC page numbers + offset, confirm by reading content
    Level 2: Sequential reading — for items not in TOC, read between known items
    """
    total_pages = len(page_reads)
    locations: Dict[int, Dict] = {}

    # ── Calculate TOC offset ──
    offset = _calculate_toc_offset(page_reads, toc_map)

    # ── Level 1: TOC-anchored localization ──
    # For each item in the TOC, jump to predicted page and confirm by content
    for item_num in range(1, 24):
        toc_page = toc_map.get(item_num) or toc_map.get(str(item_num))
        if not toc_page:
            continue

        # Predicted PDF page
        predicted_idx = toc_page + offset - 1

        # Search in a window around the predicted page
        best_idx = None
        best_score = -1
        for delta in range(-3, 6):
            check_idx = predicted_idx + delta
            if check_idx < 0 or check_idx >= total_pages:
                continue
            # Skip bootstrap pages
            if page_reads[check_idx].page_type in (PageType.COVER, PageType.HOW_TO_USE,
                                                     PageType.TOC, PageType.STATE_NOTICE,
                                                     PageType.EXHIBIT_LIST, PageType.SPECIAL_RISKS):
                continue

            hits, antis = _content_match(page_reads[check_idx].text, item_num)
            # Also check next page (some items start mid-page)
            if check_idx + 1 < total_pages:
                h2, a2 = _content_match(page_reads[check_idx + 1].text, item_num)
                hits += h2
                antis += a2

            score = hits - antis * 3
            if score > best_score:
                best_score = score
                best_idx = check_idx

        if best_idx is not None and best_score >= 1:
            locations[item_num] = {
                "start_page_idx": best_idx,
                "start_page_num": best_idx + 1,
                "locator_method": "toc_anchor",
                "confidence": 0.95 if best_score >= 3 else 0.75,
                "content_confirmed": best_score >= 2,
                "needs_review": best_score < 2,
            }

    # ── Level 2: Sequential gap filling ──
    # For items NOT in TOC, find them in the gaps between known items
    # by reading page content sequentially
    sorted_found = sorted(locations.keys())

    for item_num in range(1, 24):
        if item_num in locations:
            continue

        # Find the gap this item should be in
        prev_item_end = 0
        next_item_start = total_pages
        for found_num in sorted_found:
            if found_num < item_num:
                prev_item_end = locations[found_num]["start_page_idx"]
            elif found_num > item_num:
                next_item_start = locations[found_num]["start_page_idx"]
                break

        # Read pages in the gap, looking for content that matches this item
        best_idx = None
        best_score = -1
        for pi in range(max(0, prev_item_end), min(next_item_start, total_pages)):
            # Skip bootstrap pages
            if page_reads[pi].page_type in (PageType.COVER, PageType.HOW_TO_USE,
                                             PageType.TOC, PageType.STATE_NOTICE,
                                             PageType.EXHIBIT_LIST, PageType.SPECIAL_RISKS):
                continue

            hits, antis = _content_match(page_reads[pi].text, item_num)
            score = hits - antis * 3
            if score > best_score and score >= 1:
                best_score = score
                best_idx = pi

        if best_idx is not None:
            locations[item_num] = {
                "start_page_idx": best_idx,
                "start_page_num": best_idx + 1,
                "locator_method": "content_reading",
                "confidence": 0.60 if best_score >= 2 else 0.40,
                "content_confirmed": best_score >= 2,
                "needs_review": True,
            }

    # ── Enforce document order ──
    sorted_items = sorted(locations.keys())
    prev_page = -1
    for item_num in sorted_items:
        loc = locations[item_num]
        if loc["start_page_idx"] <= prev_page:
            loc["start_page_idx"] = prev_page + 1
            loc["start_page_num"] = loc["start_page_idx"] + 1
            loc["locator_method"] += "_adjusted"
            loc["confidence"] = min(loc["confidence"], 0.40)
            loc["needs_review"] = True
        prev_page = loc["start_page_idx"]

    # ── Set end pages ──
    for i, item_num in enumerate(sorted_items):
        if i + 1 < len(sorted_items):
            next_item = sorted_items[i + 1]
            locations[item_num]["end_page_idx"] = locations[next_item]["start_page_idx"] - 1
        else:
            locations[item_num]["end_page_idx"] = total_pages - 1
        if locations[item_num]["end_page_idx"] < locations[item_num]["start_page_idx"]:
            locations[item_num]["end_page_idx"] = locations[item_num]["start_page_idx"]

    return locations
