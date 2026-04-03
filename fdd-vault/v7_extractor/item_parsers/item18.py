"""
Item 18 Parser — Public Figures

Usually 1-2 lines. Either "we do not use any public figure" or a name
with compensation description. Very short item.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item18(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 18: Public Figures."""
    result: Dict[str, Any] = {
        "item": 18,
        "uses_public_figure": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "compensation_disclosed": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST (rare for Item 18) ---
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        for row in table.rows:
            if not row:
                continue
            row_lower = " ".join(row).lower()
            if "public figure" in row_lower or "celebrity" in row_lower or "spokesperson" in row_lower:
                result["uses_public_figure"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    # --- TEXT reading ---

    # No public figure
    no_pf_patterns = [
        r'(?:we|franchisor)\s+(?:do|does)\s+not\s+use.*public\s+figure',
        r'no\s+public\s+figure',
        r'(?:there\s+(?:is|are)\s+)?no\s+public\s+figure',
        r'not\s+(?:use|using|used).*public\s+figure',
    ]
    for pattern in no_pf_patterns:
        if re.search(pattern, text_lower):
            result["uses_public_figure"] = {
                "value": False,
                "state": EvidenceState.EXPLICITLY_ABSENT.value,
                "provenance": prov_base,
            }
            return result

    # Has public figure (if not already detected via table)
    if result["uses_public_figure"]["state"] != EvidenceState.PRESENT.value:
        if re.search(r'public\s+figure|celebrity|spokesperson|endorser|brand\s+ambassador', text_lower):
            result["uses_public_figure"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Compensation
    if re.search(r'(?:compensat|paid|payment|fee|salary|royalt)', text_lower):
        result["compensation_disclosed"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
