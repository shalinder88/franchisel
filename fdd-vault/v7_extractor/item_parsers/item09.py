"""
Item 9 Parser — Franchisee's Obligations

Import table rows if available. This is typically a cross-reference matrix
mapping obligations to the relevant FDD item and agreement section.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item09(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 9: Franchisee's Obligations — cross-reference table."""
    result: Dict[str, Any] = {
        "item": 9,
        "obligation_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "obligation_count": {"value": 0, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: this is the obligations matrix ---
    obligation_rows: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        # Typical columns: Obligation | Section in Agreement | Item in FDD
        obligation_idx = next(
            (i for i, c in enumerate(cols_lower)
             if "obligation" in c or "subject" in c or "requirement" in c),
            0
        )
        section_idx = next(
            (i for i, c in enumerate(cols_lower)
             if "section" in c or "agreement" in c or "provision" in c),
            1 if len(cols_lower) > 1 else None
        )
        item_idx = next(
            (i for i, c in enumerate(cols_lower)
             if "item" in c or "fdd" in c or "disclosure" in c),
            2 if len(cols_lower) > 2 else None
        )

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            obligation: Dict[str, Any] = {
                "raw_cells": row,
                "provenance": tprov,
            }

            if obligation_idx < len(row):
                obligation["obligation"] = row[obligation_idx].strip()
            if section_idx is not None and section_idx < len(row):
                obligation["agreement_section"] = row[section_idx].strip()
            if item_idx is not None and item_idx < len(row):
                obligation["fdd_item"] = row[item_idx].strip()

            obligation_rows.append(obligation)

    if obligation_rows:
        result["obligation_rows"] = {
            "value": obligation_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        result["obligation_count"] = {
            "value": len(obligation_rows),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
