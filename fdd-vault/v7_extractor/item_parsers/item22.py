"""
Item 22 Parser — Contracts

Document package map: list of agreements/exhibits that must be signed.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item22(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 22: Contracts — list of documents to be signed."""
    result: Dict[str, Any] = {
        "item": 22,
        "document_list": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "document_count": {"value": 0, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST ---
    documents: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        doc_idx = next(
            (i for i, c in enumerate(cols_lower)
             if "agreement" in c or "document" in c or "contract" in c or "exhibit" in c or "name" in c),
            0
        )
        exhibit_idx = next(
            (i for i, c in enumerate(cols_lower) if "exhibit" in c and i != doc_idx), None
        )

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            doc: Dict[str, Any] = {
                "raw_cells": row,
                "provenance": tprov,
            }

            if doc_idx < len(row):
                doc["document_name"] = row[doc_idx].strip()
            if exhibit_idx is not None and exhibit_idx < len(row):
                doc["exhibit_code"] = row[exhibit_idx].strip()

            documents.append(doc)

    # --- TEXT fallback: parse list from narrative ---
    if not documents:
        # Look for numbered or bulleted lists of documents
        doc_patterns = [
            r'(?:Exhibit\s+[A-Z](?:\.\d+)?)\s*[-:]\s*(.+)',
            r'(?:\d+\.|\*|[-])\s*(.+?(?:Agreement|Addendum|Disclosure|Guaranty|Receipt|Acknowledgment|Amendment|Lease))',
        ]
        for pattern in doc_patterns:
            matches = re.findall(pattern, section.text, re.IGNORECASE)
            for match in matches:
                documents.append({
                    "document_name": match.strip(),
                    "provenance": prov_base,
                })

    if documents:
        result["document_list"] = {
            "value": documents,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        result["document_count"] = {
            "value": len(documents),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
