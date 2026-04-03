"""
Item Locator Service

Replaces strict sequential heading detection with a 4-level hierarchy:

  Level 1: TOC anchor — parse TOC, jump to predicted page, search local window
  Level 2: Heading graph — score all candidates by typography, isolation, distance from TOC
  Level 3: Content confirmation — verify section content matches expected item type
  Level 4: Text fallback — find_actual_item() style, only if Levels 1-3 fail

The locator builds an ITEM INDEX first, then the section segmenter uses that
index to extract in order. Finding items and extracting them are decoupled.

Output per item:
  {
    "item_number": 19,
    "start_page_idx": 57,  # 0-indexed
    "locator_method": "toc_anchor+heading_confirmed",
    "confidence": 0.95,
    "content_confirmed": True,
    "needs_review": False
  }
"""

import re
from typing import List, Dict, Optional, Tuple
from .models import PageRead, PageType, US_STATES


# ══════════════════════════════════════════════════════════════════════════════
# ITEM CONTENT SIGNATURES
# Used for Level 3: content confirmation
# Each item has keywords that MUST appear in its section and anti-keywords that
# indicate the section belongs to a DIFFERENT item
# ══════════════════════════════════════════════════════════════════════════════

ITEM_SIGNATURES = {
    1: {"kw": [r"(?:formed|incorporated|organized)", r"parent|predecessor|affiliate",
               r"began (?:offering|franchising)"],
        "anti": [r"Royalty fee", r"% of Gross"]},
    3: {"kw": [r"(?:v\.|vs\.)", r"Case No\.", r"no litigation.*(?:required|disclosed)"],
        "anti": [r"Royalty", r"Systemwide Outlet"]},
    4: {"kw": [r"bankrupt", r"Chapter (?:7|11)", r"no bankruptcy.*(?:required|disclosed)"],
        "anti": [r"Royalty", r"Systemwide Outlet"]},
    5: {"kw": [r"Initial Franchise Fee", r"Development Fee", r"non-refundable", r"lump sum"],
        "anti": [r"Royalty.*(?:weekly|monthly)", r"Systemwide Outlet"]},
    6: {"kw": [r"Royalty|Continuing.*Fee", r"Advertising|Ad Fund|Marketing|Brand Fund",
               r"Transfer Fee", r"% of (?:Gross|Net)", r"Late.*(?:Fee|Charge)"],
        "anti": [r"Systemwide Outlet", r"financial performance"]},
    7: {"kw": [r"ESTIMATED INITIAL INVESTMENT", r"Leasehold", r"Equipment", r"TOTAL"],
        "anti": [r"Royalty.*weekly", r"Systemwide Outlet"]},
    8: {"kw": [r"approved supplier|designated supplier", r"sole.*source",
               r"rebate|commission", r"required.*purchase"],
        "anti": [r"Systemwide Outlet", r"financial performance"]},
    9: {"kw": [r"Obligation", r"Section in.*Agreement"],
        "anti": [r"Systemwide Outlet"]},
    10: {"kw": [r"(?:do not|does not).*(?:offer|provide).*financ", r"guarantee.*note",
                r"SBA|Small Business", r"interest rate"],
         "anti": [r"Systemwide Outlet", r"Royalty"]},
    11: {"kw": [r"training|Training Program", r"site selection", r"advertising.*(?:fund|program)",
                r"computer|software|POS", r"Operations Manual"],
         "anti": [r"Systemwide Outlet"]},
    12: {"kw": [r"(?:exclusive|protected).*(?:territory|area)", r"radius|mile",
                r"non-exclusive", r"Development Area"],
         "anti": [r"Systemwide Outlet", r"Royalty"]},
    13: {"kw": [r"Registration No\.", r"USPTO", r"Principal Register", r"trademark|service mark"],
         "anti": [r"Royalty", r"Systemwide Outlet"]},
    14: {"kw": [r"patent|copyright|proprietary|trade secret|confidential"],
         "anti": [r"Systemwide Outlet"]},
    15: {"kw": [r"full.?time|best efforts|personal.*supervision", r"Managing Owner|Operating Principal"],
         "anti": [r"Systemwide Outlet"]},
    16: {"kw": [r"(?:only|must).*(?:offer|sell).*authorized", r"add.*delete"],
         "anti": [r"Systemwide Outlet"]},
    17: {"kw": [r"Length of.*term", r"Renewal|extension", r"Termination.*cause",
                r"Transfer", r"Non-compet", r"Dispute.*resolution", r"Choice of (?:forum|law)"],
         "anti": [r"Systemwide Outlet", r"financial performance"]},
    18: {"kw": [r"public figure", r"does not use.*public"],
         "anti": [r"Royalty", r"Systemwide Outlet", r"\$[\d,]{5,}"]},
    19: {"kw": [r"Financial Performance", r"\$[\d,]{4,}",
                r"(?:sold|earned).*amount.*differ", r"Average|Median", r"EBITDA|Gross.*(?:Sales|Revenue)"],
         "anti": [r"Systemwide Outlet Summary", r"Opened.*(?:Outlet|Restaurant).*Terminated"]},
    20: {"kw": [r"Systemwide.*(?:Outlet|Summary)", r"Outlets? at.*(?:Start|End)",
                r"(?:Opened|Terminated|Non-Renewed|Reacquired|Ceased|Transfer)",
                r"Franchised|Company.?Owned"],
         "anti": [r"\$[\d,]{5,}", r"EBITDA", r"Average.*Revenue"]},
    21: {"kw": [r"Financial Statement", r"Exhibit\s+[A-Z]", r"audited", r"fiscal year"],
         "anti": [r"Systemwide Outlet", r"EBITDA"]},
    22: {"kw": [r"Exhibit\s+[A-Z]", r"Agreement", r"attached.*exhibit"],
         "anti": [r"Systemwide Outlet", r"EBITDA"]},
    23: {"kw": [r"Receipt", r"detach|return", r"acknowledg"],
         "anti": [r"Royalty", r"EBITDA"]},
}


def _score_content(text: str, item_num: int) -> Tuple[int, int]:
    """Score how well text matches expected content for an item.
    Returns (keyword_hits, anti_hits)."""
    sig = ITEM_SIGNATURES.get(item_num)
    if not sig:
        return (0, 0)
    sample = text[:6000]
    kw_hits = sum(1 for kw in sig["kw"] if re.search(kw, sample, re.I))
    anti_hits = sum(1 for ak in sig["anti"] if re.search(ak, sample[:3000], re.I))
    return (kw_hits, anti_hits)


def _is_real_heading(text: str, match_start: int, match_end: int) -> bool:
    """Determine if an ITEM X match is a real heading vs a cross-reference or TOC entry."""
    after = text[match_end:match_end + 200]
    first_line = after.split('\n')[0].strip() if after else ""

    # TOC: trailing dots + page number
    if re.search(r'[\.\…]{3,}\s*\d+', first_line):
        return False
    if re.match(r'^[\.\…\s\d]+$', first_line):
        return False

    # Cross-ref: followed by lowercase prose (not a title)
    if first_line and first_line[0].islower():
        return False

    # Cross-ref: preceded by substantial same-line text
    line_start = text.rfind('\n', max(0, match_start - 200), match_start)
    before = text[line_start + 1:match_start].strip() if line_start >= 0 else ""
    if len(before) > 20 and not re.match(r'^[-–—\s\d\.]*$', before):
        return False

    # Cross-ref: followed by NASAA table row marker "(q)", "(s)"
    if re.match(r'^\s*\([a-z]\)', first_line):
        return False

    return True


# ══════════════════════════════════════════════════════════════════════════════
# MAIN LOCATOR
# ══════════════════════════════════════════════════════════════════════════════

def locate_all_items(page_reads: List[PageRead],
                     toc_map: Dict[int, int]) -> Dict[int, Dict]:
    """Build an item index using the 4-level locator hierarchy.

    Returns dict: item_num → location info
    """
    total_pages = len(page_reads)
    locations: Dict[int, Dict] = {}

    # ── Collect ALL heading candidates across all pages ──
    all_candidates: Dict[int, List[Dict]] = {}
    for pr in page_reads:
        # Skip bootstrap pages for heading detection
        if pr.page_type in (PageType.COVER, PageType.HOW_TO_USE, PageType.TOC,
                            PageType.STATE_NOTICE, PageType.EXHIBIT_LIST,
                            PageType.SPECIAL_RISKS):
            continue

        for m in re.finditer(r'(?:^|\n)\s*(?:ITEM|Item)\s+(\d+)\s*[:\.\s\n]', pr.text, re.MULTILINE):
            item_num = int(m.group(1))
            if not (1 <= item_num <= 23):
                continue
            if not _is_real_heading(pr.text, m.start(), m.end()):
                continue

            if item_num not in all_candidates:
                all_candidates[item_num] = []
            all_candidates[item_num].append({
                "page_idx": pr.page_num - 1,
                "page_num": pr.page_num,
                "position": m.start(),
            })

    # ── Level 1: TOC-anchored localization ──
    for item_num in range(1, 24):
        toc_page = toc_map.get(item_num) or toc_map.get(str(item_num))
        if not toc_page:
            continue

        candidates = all_candidates.get(item_num, [])
        best = None
        best_dist = 999

        for cand in candidates:
            # Calculate page offset: FDD page numbers often differ from PDF page numbers
            # Allow a generous window
            dist = abs(cand["page_num"] - toc_page)
            if dist <= 10 and dist < best_dist:
                best_dist = dist
                best = cand

        if best:
            # Verify content matches
            page_text = page_reads[best["page_idx"]].text
            # Also read next 2 pages for context
            context_text = page_text
            for extra in range(1, min(3, total_pages - best["page_idx"])):
                context_text += "\n" + page_reads[best["page_idx"] + extra].text
            kw_hits, anti_hits = _score_content(context_text, item_num)
            content_ok = kw_hits >= 1 and anti_hits == 0

            locations[item_num] = {
                "start_page_idx": best["page_idx"],
                "start_page_num": best["page_num"],
                "locator_method": "toc_anchor" + ("+content_confirmed" if content_ok else ""),
                "confidence": 0.95 if content_ok else 0.75,
                "content_confirmed": content_ok,
                "needs_review": not content_ok,
            }

    # ── Level 2: Heading graph (for items not found by TOC) ──
    for item_num in range(1, 24):
        if item_num in locations:
            continue

        candidates = all_candidates.get(item_num, [])
        if not candidates:
            continue

        # Score each candidate
        best = None
        best_score = -999
        for cand in candidates:
            # Skip very early pages (front matter)
            if cand["page_idx"] < total_pages * 0.03:
                continue

            page_text = page_reads[cand["page_idx"]].text
            context_text = page_text
            for extra in range(1, min(3, total_pages - cand["page_idx"])):
                context_text += "\n" + page_reads[cand["page_idx"] + extra].text

            kw_hits, anti_hits = _score_content(context_text, item_num)
            score = kw_hits * 10 - anti_hits * 20

            if score > best_score:
                best_score = score
                best = cand

        if best and best_score >= 0:
            locations[item_num] = {
                "start_page_idx": best["page_idx"],
                "start_page_num": best["page_num"],
                "locator_method": "heading_graph",
                "confidence": 0.80 if best_score >= 10 else 0.60,
                "content_confirmed": best_score >= 10,
                "needs_review": best_score < 10,
            }

    # ── Level 3: Content scan (for items still not found) ──
    # Search pages between known items for content that matches
    for item_num in range(1, 24):
        if item_num in locations:
            continue

        # Determine search range from neighboring found items
        prev_end = 0
        next_start = total_pages
        for found_num in sorted(locations.keys()):
            if found_num < item_num:
                prev_end = max(prev_end, locations[found_num]["start_page_idx"])
            elif found_num > item_num:
                next_start = min(next_start, locations[found_num]["start_page_idx"])
                break

        best_page = None
        best_score = -1
        for pi in range(prev_end, min(next_start, total_pages)):
            page_text = page_reads[pi].text
            kw_hits, anti_hits = _score_content(page_text, item_num)
            if kw_hits >= 2 and anti_hits == 0 and kw_hits > best_score:
                best_score = kw_hits
                best_page = pi

        if best_page is not None:
            locations[item_num] = {
                "start_page_idx": best_page,
                "start_page_num": best_page + 1,
                "locator_method": "content_scan",
                "confidence": 0.50,
                "content_confirmed": True,
                "needs_review": True,
            }

    # ── Enforce document order ──
    # Items must appear in order in the PDF. If an item's page is before its
    # predecessor, something is wrong — adjust.
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

        # Safety: end >= start
        if locations[item_num]["end_page_idx"] < locations[item_num]["start_page_idx"]:
            locations[item_num]["end_page_idx"] = locations[item_num]["start_page_idx"]

    return locations
