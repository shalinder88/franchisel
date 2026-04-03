"""
Item 13 Parser — Trademarks

Extracts: registration status, USPTO numbers, pending applications,
known challenges.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item13(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 13: Trademarks."""
    result: Dict[str, Any] = {
        "item": 13,
        "trademark_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "registration_status": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "uspto_numbers": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "pending_applications": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "known_challenges": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: trademark registration table ---
    trademark_rows: List[Dict[str, Any]] = []
    uspto_nums: List[str] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        mark_idx = next(
            (i for i, c in enumerate(cols_lower) if "mark" in c or "trademark" in c or "name" in c), 0
        )
        reg_idx = next(
            (i for i, c in enumerate(cols_lower) if "registration" in c or "reg" in c or "number" in c), None
        )
        status_idx = next(
            (i for i, c in enumerate(cols_lower) if "status" in c or "register" in c), None
        )
        date_idx = next(
            (i for i, c in enumerate(cols_lower) if "date" in c or "filed" in c), None
        )

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            tm_row: Dict[str, Any] = {
                "raw_cells": row,
                "provenance": tprov,
            }

            if mark_idx < len(row):
                tm_row["mark"] = row[mark_idx].strip()
            if reg_idx is not None and reg_idx < len(row):
                reg_num = row[reg_idx].strip()
                tm_row["registration_number"] = reg_num
                # Extract USPTO numbers (typically 7-digit numbers)
                nums = re.findall(r'(\d{6,8})', reg_num)
                uspto_nums.extend(nums)
            if status_idx is not None and status_idx < len(row):
                tm_row["status"] = row[status_idx].strip()
            if date_idx is not None and date_idx < len(row):
                tm_row["date"] = row[date_idx].strip()

            trademark_rows.append(tm_row)

    if trademark_rows:
        result["trademark_rows"] = {
            "value": trademark_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    if uspto_nums:
        result["uspto_numbers"] = {
            "value": list(set(uspto_nums)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- TEXT reading ---

    # Registration status
    if re.search(r'(?:registered|principal\s+register)', text_lower):
        result["registration_status"] = {
            "value": "registered",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif re.search(r'(?:supplemental\s+register)', text_lower):
        result["registration_status"] = {
            "value": "supplemental_register",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # USPTO numbers from text (fallback)
    if not uspto_nums:
        text_nums = re.findall(r'(?:Reg(?:istration)?\.?\s*(?:No\.?)?\s*)(\d{6,8})', section.text)
        if text_nums:
            result["uspto_numbers"] = {
                "value": list(set(text_nums)),
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Pending applications
    if re.search(r'(?:pending|application|applied|intent[- ]to[- ]use)', text_lower):
        result["pending_applications"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Known challenges
    if re.search(r'(?:opposition|challenge|dispute|infringement|cancel|cancellation)', text_lower):
        result["known_challenges"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
