"""
Item 16 Parser — Restrictions on What the Franchisee May Sell

Extracts: authorized products only, franchisor can add/delete/change products.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item16(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 16: Restrictions on What the Franchisee May Sell."""
    result: Dict[str, Any] = {
        "item": 16,
        "authorized_products_only": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "franchisor_can_modify": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "franchisor_can_add": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "franchisor_can_delete": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
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
            if "authorized" in row_lower or "approved" in row_lower:
                result["authorized_products_only"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    # --- TEXT reading ---

    # Authorized products only
    if result["authorized_products_only"]["state"] == EvidenceState.NOT_FOUND.value:
        if re.search(r'(?:only|solely|exclusively)\s+(?:sell|offer|provide).*(?:authorized|approved|designated)', text_lower):
            result["authorized_products_only"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
        elif re.search(r'(?:must\s+(?:only\s+)?(?:sell|offer|provide)|limited\s+to|restricted\s+to)', text_lower):
            result["authorized_products_only"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Franchisor modification rights
    if re.search(r'(?:we|franchisor)\s+(?:may|can|have the right to|reserve the right to)\s+(?:change|modify|alter|amend)', text_lower):
        result["franchisor_can_modify"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    if re.search(r'(?:we|franchisor)\s+(?:may|can|have the right to)\s+(?:add|introduce|require.*new)', text_lower):
        result["franchisor_can_add"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    if re.search(r'(?:we|franchisor)\s+(?:may|can|have the right to)\s+(?:delete|remove|discontinue|eliminate)', text_lower):
        result["franchisor_can_delete"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
