"""
Item 6 Parser — Other Fees (Ongoing Fees)

THE FEE TABLE. Columns: Type / Amount / Due Date / Remarks.
Extracts: royalty rate, ad fund rate, technology fees, transfer fee,
renewal fee, late charges, liquidated damages, and every fee row.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _parse_percent(text: str) -> Optional[float]:
    """Parse a percentage from text like '6%' or '5.5%'."""
    m = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
    return float(m.group(1)) if m else None


def _parse_dollar(text: str) -> Optional[float]:
    """Parse a dollar amount."""
    m = re.search(r'\$\s*([\d,]+(?:\.\d{2})?)', text.replace(",", ""))
    return float(m.group(1)) if m else None


FEE_TYPE_MAP = {
    "royalty": "royalty",
    "continuing royalty": "royalty",
    "service fee": "royalty",
    "ad fund": "ad_fund",
    "advertising": "ad_fund",
    "brand fund": "ad_fund",
    "national advertising": "ad_fund",
    "local advertising": "local_advertising",
    "technology": "technology",
    "tech fee": "technology",
    "software": "technology",
    "pos": "technology",
    "transfer": "transfer",
    "renewal": "renewal",
    "successor": "renewal",
    "late": "late_charge",
    "interest": "late_charge",
    "liquidated damages": "liquidated_damages",
    "audit": "audit",
    "insurance": "insurance",
    "relocation": "relocation",
    "training": "training",
    "additional training": "training",
    "conference": "conference",
    "convention": "conference",
}


def _classify_fee_type(row_text: str) -> str:
    """Classify a fee row by matching keywords."""
    lower = row_text.lower()
    for keyword, fee_type in FEE_TYPE_MAP.items():
        if keyword in lower:
            return fee_type
    return "other"


def parse_item06(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 6: Other Fees."""
    result: Dict[str, Any] = {
        "item": 6,
        "fee_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "royalty_rate": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ad_fund_rate": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "technology_fee": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "transfer_fee": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "renewal_fee": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "late_charges": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "liquidated_damages": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: this is THE fee table ---
    all_fee_rows: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        # Identify column indices
        type_idx = next((i for i, c in enumerate(cols_lower) if "type" in c or "fee" in c or "name" in c), 0)
        amount_idx = next((i for i, c in enumerate(cols_lower) if "amount" in c or "rate" in c), 1 if len(cols_lower) > 1 else 0)
        due_idx = next((i for i, c in enumerate(cols_lower) if "due" in c or "when" in c or "date" in c), None)
        remarks_idx = next((i for i, c in enumerate(cols_lower) if "remark" in c or "note" in c or "description" in c), None)

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            row_text = " ".join(row)
            fee_type = _classify_fee_type(row_text)

            fee_row: Dict[str, Any] = {
                "raw_cells": row,
                "fee_type": fee_type,
                "provenance": tprov,
            }

            # Type column
            if type_idx < len(row):
                fee_row["type_label"] = row[type_idx].strip()

            # Amount column
            if amount_idx < len(row):
                amount_text = row[amount_idx].strip()
                fee_row["amount_raw"] = amount_text
                pct = _parse_percent(amount_text)
                dollar = _parse_dollar(amount_text)
                if pct is not None:
                    fee_row["percent"] = pct
                if dollar is not None:
                    fee_row["dollar"] = dollar

            # Due date column
            if due_idx is not None and due_idx < len(row):
                fee_row["due_date"] = row[due_idx].strip()

            # Remarks column
            if remarks_idx is not None and remarks_idx < len(row):
                fee_row["remarks"] = row[remarks_idx].strip()

            all_fee_rows.append(fee_row)

    # --- LABEL INHERITANCE: rows with empty labels inherit from most recent labeled row ---
    # General rule: In fee tables, multi-format entries split across rows.
    # "Royalty" label in one row, format variants (Traditional–5%, Non-Traditional–5%)
    # in subsequent rows with empty label cells.
    last_label_type = "other"
    for fr in all_fee_rows:
        label = fr.get("type_label", "").strip()
        if label:
            last_label_type = fr["fee_type"]
        elif fr["fee_type"] == "other" and last_label_type != "other":
            # Empty label row — inherit from most recent labeled row
            fr["fee_type"] = last_label_type

    if all_fee_rows:
        result["fee_rows"] = {
            "value": all_fee_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

        # Extract key fee fields from rows
        for fr in all_fee_rows:
            ft = fr.get("fee_type", "")
            pct = fr.get("percent")
            dollar = fr.get("dollar")

            if ft == "royalty" and result["royalty_rate"]["state"] != EvidenceState.PRESENT.value:
                val = {"percent": pct} if pct else {"dollar": dollar} if dollar else {"raw": fr.get("amount_raw")}
                result["royalty_rate"] = {
                    "value": val,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
            elif ft == "ad_fund" and result["ad_fund_rate"]["state"] != EvidenceState.PRESENT.value:
                val = {"percent": pct} if pct else {"dollar": dollar} if dollar else {"raw": fr.get("amount_raw")}
                result["ad_fund_rate"] = {
                    "value": val,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
            elif ft == "technology" and result["technology_fee"]["state"] != EvidenceState.PRESENT.value:
                val = {"dollar": dollar} if dollar else {"percent": pct} if pct else {"raw": fr.get("amount_raw")}
                result["technology_fee"] = {
                    "value": val,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
            elif ft == "transfer" and result["transfer_fee"]["state"] != EvidenceState.PRESENT.value:
                val = {"dollar": dollar} if dollar else {"percent": pct} if pct else {"raw": fr.get("amount_raw")}
                result["transfer_fee"] = {
                    "value": val,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
            elif ft == "renewal" and result["renewal_fee"]["state"] != EvidenceState.PRESENT.value:
                val = {"dollar": dollar} if dollar else {"percent": pct} if pct else {"raw": fr.get("amount_raw")}
                result["renewal_fee"] = {
                    "value": val,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
            elif ft == "late_charge" and result["late_charges"]["state"] != EvidenceState.PRESENT.value:
                result["late_charges"] = {
                    "value": {"raw": fr.get("amount_raw", "")},
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
            elif ft == "liquidated_damages" and result["liquidated_damages"]["state"] != EvidenceState.PRESENT.value:
                result["liquidated_damages"] = {
                    "value": {"raw": fr.get("amount_raw", "")},
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }

    return result
