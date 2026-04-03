"""
Item 14 Parser — Patents, Copyrights, and Proprietary Information

Extracts: has_patents, has_copyrights, trade secrets, confidentiality
requirements, AI/ML prohibition.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item14(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 14: Patents, Copyrights, and Proprietary Information."""
    result: Dict[str, Any] = {
        "item": 14,
        "has_patents": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "has_copyrights": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "trade_secrets": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "confidentiality_requirements": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ai_ml_prohibition": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST ---
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        for row in table.rows:
            if not row:
                continue
            row_text = " ".join(row).lower()
            if "patent" in row_text:
                result["has_patents"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }
            if "copyright" in row_text:
                result["has_copyrights"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    # --- TEXT reading ---

    # Patents
    if re.search(r'(?:patent|U\.?S\.?\s*Patent)', text_lower):
        no_patents = re.search(r'(?:no|do not|does not)\s+(?:have|own|hold).*patent', text_lower)
        if no_patents:
            result["has_patents"] = {
                "value": False,
                "state": EvidenceState.EXPLICITLY_ABSENT.value,
                "provenance": prov_base,
            }
        elif result["has_patents"]["state"] != EvidenceState.PRESENT.value:
            result["has_patents"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Copyrights
    if re.search(r'copyright', text_lower):
        no_copyrights = re.search(r'(?:no|do not|does not)\s+(?:have|own|hold).*copyright', text_lower)
        if no_copyrights:
            result["has_copyrights"] = {
                "value": False,
                "state": EvidenceState.EXPLICITLY_ABSENT.value,
                "provenance": prov_base,
            }
        elif result["has_copyrights"]["state"] != EvidenceState.PRESENT.value:
            result["has_copyrights"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Trade secrets
    if re.search(r'trade\s+secret|proprietary\s+(?:information|system|method|recipe|formula)', text_lower):
        result["trade_secrets"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Confidentiality requirements
    if re.search(r'confidential|non[- ]?disclosure|nda', text_lower):
        result["confidentiality_requirements"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # AI/ML prohibition
    if re.search(r'(?:artificial\s+intelligence|machine\s+learning|ai\b|ml\b).*(?:prohibit|restrict|not\s+(?:use|permit))', text_lower):
        result["ai_ml_prohibition"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
