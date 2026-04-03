"""
Item 10 Parser — Financing

Extracts: whether financing exists, direct vs indirect, guarantees,
rates, collateral, default linkage, personal guarantee.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item10(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 10: Financing arrangements."""
    result: Dict[str, Any] = {
        "item": 10,
        "financing_offered": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "financing_type": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "financing_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "personal_guarantee": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "interest_rate": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "collateral": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "default_cross_link": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # Check for no-financing disclosure
    no_fin_patterns = [
        r'(?:we|franchisor)\s+(?:do|does)\s+not\s+(?:offer|provide|arrange)\s+(?:any\s+)?(?:direct\s+or\s+indirect\s+)?financing',
        r'no\s+financing',
        r'(?:there\s+(?:is|are)\s+)?no\s+(?:financing|loan)',
    ]
    for pattern in no_fin_patterns:
        if re.search(pattern, text_lower):
            result["financing_offered"] = {
                "value": False,
                "state": EvidenceState.EXPLICITLY_ABSENT.value,
                "provenance": prov_base,
            }
            return result

    # --- TABLES FIRST ---
    financing_rows: List[Dict[str, Any]] = []
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue
            financing_rows.append({
                "raw_cells": row,
                "provenance": tprov,
            })

    if financing_rows:
        result["financing_rows"] = {
            "value": financing_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        result["financing_offered"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- TEXT reading ---

    # Financing type
    if "direct financing" in text_lower or "we offer financing" in text_lower or "we provide financing" in text_lower:
        result["financing_offered"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        result["financing_type"] = {
            "value": "direct",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif "indirect financing" in text_lower or "third party" in text_lower or "third-party" in text_lower:
        result["financing_offered"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        result["financing_type"] = {
            "value": "indirect",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Personal guarantee
    if re.search(r'personal\s+guarant', text_lower):
        result["personal_guarantee"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Interest rate
    rate_match = re.search(r'(?:interest\s+rate|rate\s+of)\s*(?:of\s+|is\s+)?(\d+(?:\.\d+)?)\s*%', text_lower)
    if rate_match:
        result["interest_rate"] = {
            "value": float(rate_match.group(1)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Collateral
    if re.search(r'collateral|security interest|lien|pledge', text_lower):
        result["collateral"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Default cross-link
    if re.search(r'cross[- ]?default|default\s+under\s+(?:the\s+)?franchise\s+agreement', text_lower):
        result["default_cross_link"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
