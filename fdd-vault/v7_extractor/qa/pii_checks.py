"""PII checks — hard block. No PII in public outputs."""

import re
from typing import List, Dict
from ..models import ItemSection, PII_PATTERNS, PII_BLOCKED_SECTIONS


def check_pii_all_items(items: Dict[int, ItemSection]) -> List[Dict]:
    """Check all items for PII leakage. Returns list of violations."""
    violations = []
    compiled = [re.compile(p) for p in PII_PATTERNS]

    for item_num, section in items.items():
        for blocked in PII_BLOCKED_SECTIONS:
            if blocked.lower() in f"item {item_num}".lower():
                violations.append({"item": item_num, "type": "blocked_section", "detail": blocked})

        for pattern in compiled:
            if pattern.search(section.text):
                violations.append({"item": item_num, "type": "pii_detected", "detail": pattern.pattern[:30]})
                break

    return violations
