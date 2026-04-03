"""
Item 15 Parser — Obligation to Participate in the Actual Operation of the Franchise Business

Extracts: full-time required, absentee allowed, manager requirements.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item15(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 15: Obligation to Participate in the Operation."""
    result: Dict[str, Any] = {
        "item": 15,
        "full_time_required": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "absentee_allowed": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "manager_required": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "manager_training_required": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "manager_equity_required": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST ---
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        for row in table.rows:
            if not row:
                continue
            row_lower = " ".join(row).lower()
            if "full-time" in row_lower or "full time" in row_lower:
                result["full_time_required"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }
            if "absentee" in row_lower:
                allowed = "not" not in row_lower and "prohibit" not in row_lower
                result["absentee_allowed"] = {
                    "value": allowed,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    # --- TEXT reading ---

    # Full-time required
    if result["full_time_required"]["state"] == EvidenceState.NOT_FOUND.value:
        if re.search(r'(?:full[- ]?time|devote.*full.*time|personal.*(?:supervision|participation|attention))', text_lower):
            result["full_time_required"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
        elif re.search(r'(?:need not|not required to).*(?:full[- ]?time|personally)', text_lower):
            result["full_time_required"] = {
                "value": False,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Absentee allowed
    if result["absentee_allowed"]["state"] == EvidenceState.NOT_FOUND.value:
        if re.search(r'absentee\s+(?:owner|ownership|operation)', text_lower):
            prohibited = bool(re.search(r'(?:not|no|prohibit|do not).*absentee', text_lower))
            result["absentee_allowed"] = {
                "value": not prohibited,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Manager required
    if re.search(r'(?:designate|appoint|employ|hire).*(?:manager|general manager|operating partner|operating principal)', text_lower):
        result["manager_required"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Manager must complete training
    if re.search(r'manager.*(?:complete|attend|pass).*training', text_lower):
        result["manager_training_required"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Manager equity interest required
    if re.search(r'manager.*(?:equity|ownership|interest|stake)', text_lower):
        result["manager_equity_required"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
