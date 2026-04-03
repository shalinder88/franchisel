"""
Item 4 Parser — Bankruptcy

Extracts: no_bankruptcy flag, bankruptcy type (Chapter 7/11),
year if disclosed. Usually very short section.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item04(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 4: Bankruptcy disclosure."""
    result: Dict[str, Any] = {
        "item": 4,
        "no_bankruptcy": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "bankruptcy_type": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "bankruptcy_year": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # Check for no-bankruptcy disclosure
    no_bk_patterns = [
        r'no\s+(?:person\s+)?(?:previously\s+)?(?:described\s+)?(?:has\s+)?(?:been\s+)?(?:adjudged\s+)?bankrupt',
        r'no\s+bankruptcy',
        r'(?:there\s+(?:is|are)\s+)?no\s+(?:bankruptcy|reorganization)',
        r'(?:need|required)\s+(?:not|to)\s+(?:be\s+)?disclose.*bankrupt',
        r'(?:none|n/?a)',
    ]
    for pattern in no_bk_patterns:
        if re.search(pattern, text_lower):
            result["no_bankruptcy"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            return result

    # Chapter detection
    chapter_match = re.search(r'chapter\s+(7|11|13)', text_lower)
    if chapter_match:
        result["bankruptcy_type"] = {
            "value": f"chapter_{chapter_match.group(1)}",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        result["no_bankruptcy"] = {
            "value": False,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Year detection
    year_match = re.search(r'(?:filed|petition|adjudged|discharged).*?(\d{4})', text_lower)
    if year_match:
        result["bankruptcy_year"] = {
            "value": int(year_match.group(1)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
