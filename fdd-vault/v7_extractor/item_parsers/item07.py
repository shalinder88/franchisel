"""
Item 7 Parser — Estimated Initial Investment

Import EVERY line item from the investment table. Find TOTAL row.
Parse "$X to $Y" ranges. Track format-specific variants.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _parse_dollar_range(text: str) -> Dict[str, Any]:
    """Parse '$X to $Y' or '$X - $Y' ranges."""
    amounts = re.findall(r'\$\s*([\d,]+(?:\.\d{2})?)', text)
    cleaned = [float(a.replace(",", "")) for a in amounts]
    if len(cleaned) >= 2:
        return {"low": min(cleaned), "high": max(cleaned)}
    elif len(cleaned) == 1:
        return {"amount": cleaned[0]}
    return {}


def parse_item07(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 7: Estimated Initial Investment."""
    result: Dict[str, Any] = {
        "item": 7,
        "line_items": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "total_investment": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "format_variants": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: this is THE investment table ---
    all_line_items: List[Dict[str, Any]] = []
    total_row: Optional[Dict[str, Any]] = None
    variants_detected: List[str] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        # Detect format variant from table title
        title_lower = table.title.lower()
        for variant_kw, variant_name in [
            ("non-traditional", "non_traditional"), ("nontraditional", "non_traditional"),
            ("small box", "small_box"), ("express", "express"),
            ("standard", "standard"), ("traditional", "standard"),
            ("kiosk", "kiosk"), ("mobile", "mobile"),
        ]:
            if variant_kw in title_lower:
                variants_detected.append(variant_name)

        # Identify columns
        type_idx = 0
        low_idx = next((i for i, c in enumerate(cols_lower) if "low" in c or "your estimated" in c), 1 if len(cols_lower) > 1 else 0)
        high_idx = next((i for i, c in enumerate(cols_lower) if "high" in c), 2 if len(cols_lower) > 2 else low_idx)
        method_idx = next((i for i, c in enumerate(cols_lower) if "method" in c or "payment" in c or "when due" in c or "payable" in c), None)
        payee_idx = next((i for i, c in enumerate(cols_lower) if "to whom" in c or "payee" in c or "paid to" in c), None)

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            row_text = " ".join(row)
            item_name = row[type_idx].strip() if type_idx < len(row) else ""
            is_total = bool(re.search(r'\btotal\b', item_name, re.IGNORECASE))

            # Parse amounts from the row
            amount_info = _parse_dollar_range(row_text)

            # Also try specific columns
            if low_idx < len(row) and high_idx < len(row) and low_idx != high_idx:
                low_amt = _parse_dollar_range(row[low_idx])
                high_amt = _parse_dollar_range(row[high_idx])
                if low_amt and high_amt:
                    low_val = low_amt.get("amount", low_amt.get("low", 0))
                    high_val = high_amt.get("amount", high_amt.get("high", 0))
                    if low_val and high_val:
                        amount_info = {"low": min(low_val, high_val), "high": max(low_val, high_val)}

            line_item: Dict[str, Any] = {
                "name": item_name,
                "amount": amount_info,
                "is_total": is_total,
                "raw_cells": row,
                "provenance": tprov,
            }

            if method_idx is not None and method_idx < len(row):
                line_item["method_of_payment"] = row[method_idx].strip()
            if payee_idx is not None and payee_idx < len(row):
                line_item["to_whom_paid"] = row[payee_idx].strip()

            all_line_items.append(line_item)

            if is_total and amount_info:
                total_row = line_item

    if all_line_items:
        result["line_items"] = {
            "value": all_line_items,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    if total_row:
        result["total_investment"] = {
            "value": total_row["amount"],
            "state": EvidenceState.PRESENT.value,
            "provenance": total_row["provenance"],
        }

    if variants_detected:
        result["format_variants"] = {
            "value": list(set(variants_detected)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
