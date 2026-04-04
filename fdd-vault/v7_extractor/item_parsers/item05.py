"""
Item 5 Parser — Initial Fees

Extracts: every fee row from tables (franchise fee, development fee,
establishment fee, technology fee), amounts, non-refundable rules,
discounts, veteran discounts.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _parse_dollar_amount(text: str) -> Optional[float]:
    """Parse a dollar amount from text like '$25,000' or '$10,000 to $50,000'."""
    m = re.search(r'\$\s*([\d,]+(?:\.\d{2})?)', text.replace(",", ""))
    if m:
        return float(m.group(1))
    return None


def _parse_dollar_range(text: str) -> Dict[str, Any]:
    """Parse '$X to $Y' ranges. Returns dict with low/high or single amount."""
    amounts = re.findall(r'\$\s*([\d,]+(?:\.\d{2})?)', text)
    cleaned = [float(a.replace(",", "")) for a in amounts]
    if len(cleaned) >= 2:
        return {"low": min(cleaned), "high": max(cleaned)}
    elif len(cleaned) == 1:
        return {"amount": cleaned[0]}
    return {}


def parse_item05(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 5: Initial Franchise Fee."""
    result: Dict[str, Any] = {
        "item": 5,
        "fee_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "franchise_fee": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "non_refundable": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "veteran_discount": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "other_discounts": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: import every fee row ---
    all_fee_rows: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}

        for row_idx, row in enumerate(table.rows):
            if not row or not any(cell.strip() for cell in row):
                continue

            fee_row: Dict[str, Any] = {
                "raw_cells": row,
                "provenance": tprov,
            }

            # Try to identify fee type and amount from cells
            row_text = " ".join(row).lower()
            row_full = " ".join(row)

            # Fee type detection
            if any(kw in row_text for kw in ["franchise fee", "initial franchise"]):
                fee_row["fee_type"] = "franchise_fee"
            elif any(kw in row_text for kw in ["development fee", "area development"]):
                fee_row["fee_type"] = "development_fee"
            elif any(kw in row_text for kw in ["establishment", "set-up", "setup"]):
                fee_row["fee_type"] = "establishment_fee"
            elif any(kw in row_text for kw in ["technology", "tech fee", "software"]):
                fee_row["fee_type"] = "technology_fee"
            elif any(kw in row_text for kw in ["training"]):
                fee_row["fee_type"] = "training_fee"
            elif any(kw in row_text for kw in ["transfer"]):
                fee_row["fee_type"] = "transfer_fee"
            else:
                fee_row["fee_type"] = "other"

            # Amount extraction from all cells
            amount_info = _parse_dollar_range(row_full)
            if amount_info:
                fee_row["amount"] = amount_info

            all_fee_rows.append(fee_row)

    if all_fee_rows:
        result["fee_rows"] = {
            "value": all_fee_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

        # Extract primary franchise fee from fee rows
        for fr in all_fee_rows:
            if fr.get("fee_type") == "franchise_fee" and fr.get("amount"):
                result["franchise_fee"] = {
                    "value": fr["amount"],
                    "state": EvidenceState.PRESENT.value,
                    "provenance": fr["provenance"],
                }
                break

    # --- TEXT reading for narrative facts ---

    # Non-refundable
    if re.search(r'non[- ]?refundable', text_lower):
        result["non_refundable"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif re.search(r'refundable', text_lower):
        result["non_refundable"] = {
            "value": False,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Veteran discount
    vet_match = re.search(r'veteran.*?(\d+)\s*%', text_lower)
    if vet_match:
        result["veteran_discount"] = {
            "value": {"percent": int(vet_match.group(1))},
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif "veteran" in text_lower and "discount" in text_lower:
        result["veteran_discount"] = {
            "value": {"noted": True},
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Other discounts
    discounts = []
    discount_patterns = [
        (r'multi[- ]?unit\s+discount', "multi_unit"),
        (r'area\s+developer?\s+discount', "area_developer"),
        (r'existing\s+franchisee\s+discount', "existing_franchisee"),
        (r'conversion\s+(?:fee|discount)', "conversion"),
    ]
    for pattern, dtype in discount_patterns:
        if re.search(pattern, text_lower):
            discounts.append(dtype)
    if discounts:
        result["other_discounts"] = {
            "value": discounts,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Fallback: if no table-based franchise fee found, try text extraction.
    # Covers multiple formats:
    #   - "initial franchise fee of $X" / "franchise fee ... $X" (label before amount)
    #   - "$X ... franchise fee" (amount before label)
    #   - "establishment fee of $X" (F45, some fitness brands use this term)
    #   - Colon-separated: "Initial Franchise Fee: $X,XXX"
    #   - "pay us $X" as the primary payment in item 5 context
    if result["franchise_fee"]["state"] == EvidenceState.NOT_FOUND.value:
        # Use original case text for dollar extraction (text_lower loses nothing for $amounts)
        ff_patterns = [
            # Colon/dash style: "Initial Franchise Fee: $34,900"
            r'(?:initial\s+)?(?:franchise|establishment)\s+fee\s*[:–-]\s*\$\s*([\d,]+(?:\.\d{2})?)',
            # Amount before label: "pay a $45,000 ... franchise fee"
            r'\$\s*([\d,]+(?:\.\d{2})?)\s+(?:lump\s+sum\s+)?(?:initial\s+)?(?:franchise|establishment)\s+fee',
            # Label before amount (non-greedy, within 200 chars): "franchise fee ... $45,000"
            r'(?:initial\s+)?franchise\s+fee[^$]{0,200}?\$\s*([\d,]+(?:\.\d{2})?)',
            # Establishment fee (e.g. F45: "establishment fee of $60,000")
            r'establishment\s+fee[^$]{0,200}?\$\s*([\d,]+(?:\.\d{2})?)',
            # Generic: "initial fee of $X"
            r'initial\s+fee\s+(?:of\s+)?\$\s*([\d,]+(?:\.\d{2})?)',
            # Narrative: "you will pay us $X" where X is a large round number (fallback for item 5 context)
            r'you\s+(?:will\s+)?(?:must\s+)?pay\s+(?:us\s+)?(?:a\s+)?\$\s*([\d,]+(?:\.\d{2})?)',
        ]
        for pattern in ff_patterns:
            ff_match = re.search(pattern, text_lower, re.IGNORECASE)
            if ff_match:
                amt = float(ff_match.group(1).replace(",", ""))
                # Sanity: must be a plausible franchise fee ($5k-$500k)
                if 5000 <= amt <= 500000:
                    result["franchise_fee"] = {
                        "value": {"amount": amt},
                        "state": EvidenceState.PRESENT.value,
                        "provenance": prov_base,
                    }
                    break

    return result
