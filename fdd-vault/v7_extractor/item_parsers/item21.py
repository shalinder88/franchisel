"""
Item 21 Parser — Financial Statements

Points to financial exhibit. Usually 1-3 lines. Extract exhibit reference.
"""

import re
from typing import Dict, Any

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item21(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 21: Financial Statements."""
    result: Dict[str, Any] = {
        "item": 21,
        "exhibit_reference": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "auditor_mentioned": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "fiscal_year_end": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text = section.text
    text_lower = text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST (rare for Item 21) ---
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        for row in table.rows:
            if not row:
                continue
            row_text = " ".join(row)
            exhibit_match = re.search(r'Exhibit\s+([A-Z](?:\.\d+)?)', row_text, re.IGNORECASE)
            if exhibit_match:
                result["exhibit_reference"] = {
                    "value": exhibit_match.group(0).strip(),
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    # --- TEXT reading ---

    # Exhibit reference
    if result["exhibit_reference"]["state"] == EvidenceState.NOT_FOUND.value:
        exhibit_patterns = [
            r'(?:see|refer\s+to|attached\s+(?:as|hereto))\s+(?:Exhibit\s+([A-Z](?:\.\d+)?))',
            r'Exhibit\s+([A-Z](?:\.\d+)?)\s+(?:contain|include|present|attach)',
            r'(?:financial\s+statements?\s+(?:are\s+)?(?:attached|included)\s+(?:as|in)\s+)?Exhibit\s+([A-Z](?:\.\d+)?)',
        ]
        for pattern in exhibit_patterns:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                result["exhibit_reference"] = {
                    "value": f"Exhibit {m.group(1)}",
                    "state": EvidenceState.PRESENT.value,
                    "provenance": prov_base,
                }
                break

    # Auditor
    if re.search(r'(?:audit|auditor|audited|independent.*accountant|cpa)', text_lower):
        result["auditor_mentioned"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Fiscal year end
    fye_match = re.search(r'(?:fiscal\s+year|year)\s+end(?:ing|ed)?\s+(?:on\s+)?(\w+\s+\d{1,2}(?:,?\s*\d{4})?)', text_lower)
    if fye_match:
        result["fiscal_year_end"] = {
            "value": fye_match.group(1).strip(),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
