"""
TOC Parser

Parses TOC into structured item and exhibit locations.
Allows multiple items on same FDD page.
Preserves roman numeral and prefatory matter offsets.

Uses TOC page text identified by page_classifier, NOT regex on arbitrary pages.
"""

import re
from typing import List, Dict, Optional, Tuple
from .models import PageRead, PageType


def extract_toc_pages(page_reads: List[PageRead]) -> List[PageRead]:
    """Find pages classified as TOC."""
    return [pr for pr in page_reads if pr.page_type == PageType.TOC]


def parse_item_entries(toc_pages: List[PageRead]) -> Dict[int, int]:
    """Parse item → FDD page number from TOC pages.

    Handles formats like:
      "ITEM 5  Initial Fees ............................ 10"
      "Item 17 Renewal, Termination... 60"
      "ITEM 19. Financial Performance Representations...67"

    Returns dict: item_number → FDD page number
    """
    toc_map: Dict[int, int] = {}
    toc_text = "\n".join(pr.text for pr in toc_pages)

    # Pattern: ITEM/Item N ... page_number
    for m in re.finditer(r'(?:ITEM|Item)\s+(\d+).*?\.{2,}\s*(\d+)', toc_text):
        item_num = int(m.group(1))
        page_num = int(m.group(2))
        if 1 <= item_num <= 23 and 1 <= page_num <= 500:
            toc_map[item_num] = page_num

    # Also try without dots: "ITEM 5  10" (some FDDs use spaces)
    if not toc_map:
        for m in re.finditer(r'(?:ITEM|Item)\s+(\d+)\s+\S+.*?\s+(\d+)\s*$', toc_text, re.MULTILINE):
            item_num = int(m.group(1))
            page_num = int(m.group(2))
            if 1 <= item_num <= 23 and 1 <= page_num <= 500:
                toc_map[item_num] = page_num

    return toc_map


def parse_exhibit_entries(toc_pages: List[PageRead],
                          early_pages: Optional[List[PageRead]] = None) -> Dict[str, str]:
    """Parse exhibit → description from TOC or exhibit list pages.

    Returns dict: exhibit_code → description
    """
    exhibit_map: Dict[str, str] = {}
    text = "\n".join(pr.text for pr in toc_pages)
    if early_pages:
        text += "\n" + "\n".join(pr.text for pr in early_pages[:12])

    for m in re.finditer(
        r'(?:EXHIBIT|Exhibit)\s+["\']?([A-Z](?:-?\d)?)["\']?\s*[-–—:]\s*(.+?)(?:\n|$)',
        text
    ):
        code = m.group(1)
        desc = m.group(2).strip()[:100]
        if code not in exhibit_map:
            exhibit_map[code] = desc

    return exhibit_map
