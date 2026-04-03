"""
Item 2 Parser — Management Experience

Extracts: executive role count, franchise experience indicators,
leadership stability signals.

PII HARD-BLOCK: No names are extracted. Only roles and counts.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


EXEC_ROLES = [
    "ceo", "chief executive officer",
    "coo", "chief operating officer",
    "cfo", "chief financial officer",
    "president", "founder", "co-founder",
    "vice president", "vp",
    "general counsel", "secretary", "treasurer",
    "chief development officer", "chief marketing officer",
    "chief technology officer", "cto", "cmo",
    "managing director", "director of operations",
    "director of franchise", "franchise director",
]

FRANCHISE_EXPERIENCE_KEYWORDS = [
    "franchise experience", "years of franchise", "franchising experience",
    "franchise industry", "franchise development", "franchise operations",
    "area developer", "multi-unit", "franchisee",
]


def parse_item02(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 2: Business Experience of directors, officers, and management."""
    result: Dict[str, Any] = {
        "item": 2,
        "executive_count": {"value": 0, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "roles_detected": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "has_franchise_experience": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "leadership_stability_signals": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "pii_blocked": True,
    }

    text = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- Tables first: some FDDs put management in a table ---
    table_roles: List[str] = []
    for table in section.tables:
        cols_lower = [c.lower() for c in table.columns]
        if any("title" in c or "position" in c or "role" in c for c in cols_lower):
            title_idx = next(
                (i for i, c in enumerate(cols_lower) if "title" in c or "position" in c or "role" in c),
                None
            )
            if title_idx is not None:
                for row in table.rows:
                    if title_idx < len(row) and row[title_idx].strip():
                        role = row[title_idx].strip().lower()
                        table_roles.append(role)

    # --- Text reading for roles ---
    text_roles: List[str] = []
    for role in EXEC_ROLES:
        if role in text:
            text_roles.append(role)

    all_roles = list(set(table_roles + text_roles))
    if all_roles:
        result["roles_detected"] = {
            "value": all_roles,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Count executive entries by looking for role title patterns
    # Each executive typically appears as a heading or bold entry
    exec_patterns = [
        r'\b(?:joined|has been|has served|became|appointed|named)\b',
    ]
    exec_count = 0
    for pattern in exec_patterns:
        exec_count += len(re.findall(pattern, text))
    # Fallback: count paragraphs that mention a role
    if exec_count == 0:
        for role in EXEC_ROLES:
            exec_count += text.count(role)
        # Deduplicate rough count
        exec_count = min(exec_count, 50)  # sanity cap

    if exec_count > 0:
        result["executive_count"] = {
            "value": exec_count,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Franchise experience detection
    has_fran_exp = any(kw in text for kw in FRANCHISE_EXPERIENCE_KEYWORDS)
    if has_fran_exp:
        result["has_franchise_experience"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Stability signals
    stability_signals = []
    if re.search(r'(?:since|for (?:over |more than )?\d{1,2}\s+years)', text):
        stability_signals.append("long_tenure_detected")
    if "founder" in text or "co-founder" in text:
        stability_signals.append("founder_led")
    if stability_signals:
        result["leadership_stability_signals"] = {
            "value": stability_signals,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
