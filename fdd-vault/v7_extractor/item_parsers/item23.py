"""
Item 23 Parser — Receipts

PII HARD-BLOCK. Receipts contain names/signatures.
Extract ONLY structural metadata (count of receipt pages).
NEVER extract names, signatures, addresses, or any PII.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item23(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 23: Receipts — structural metadata only, PII blocked."""
    result: Dict[str, Any] = {
        "item": 23,
        "pii_blocked": True,
        "receipt_page_count": {"value": 0, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "has_state_specific_receipts": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "receipt_detected": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    prov_base = {"source_page": section.start_page}

    # Count pages in this section
    page_count = section.page_count or (section.end_page - section.start_page + 1 if section.end_page >= section.start_page else 0)

    if page_count > 0:
        result["receipt_page_count"] = {
            "value": page_count,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Detect receipt presence from text (without extracting PII)
    text_lower = section.text.lower()

    if re.search(r'receipt', text_lower):
        result["receipt_detected"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # State-specific receipts
    from ..models import US_STATES
    state_count = sum(1 for state in US_STATES if state.lower() in text_lower)
    if state_count > 1:
        result["has_state_specific_receipts"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
