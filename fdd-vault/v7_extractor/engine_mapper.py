"""
Engine Mapper — Row-Level Disambiguation

Prevents the bug where a single fee row gets mapped to multiple fields.

Rules:
  - royalty_rate requires label containing: royalty, continuing royalty, continuing franchise fee
  - ad_fund_rate requires label containing: advertising, ad fund, marketing, brand fund, national advertising
  - technology_fee requires: technology, software, POS, computer, tech
  - transfer_fee requires: transfer
  - renewal_fee requires: renewal, extension
  - if only one "% of gross" row exists, do NOT duplicate across multiple engines
  - preserve full_row_text, timing, recipient, notes
  - unresolved row mappings go to review queue
"""

import re
from typing import Dict, List, Any, Optional, Tuple


# Canonical fee type labels
FEE_LABEL_MAP = {
    "royalty": [r"royalt", r"continuing\s+(?:franchise\s+)?fee", r"continuing\s+royalt"],
    "ad_fund": [r"advertis", r"ad\s+fund", r"marketing", r"brand\s+fund",
                r"national\s+(?:advertising|marketing|ad)", r"NAF", r"MAF", r"LAF"],
    "technology": [r"technolog", r"software", r"POS", r"computer", r"tech\s+fee",
                   r"digital", r"help\s+desk"],
    "transfer": [r"transfer"],
    "renewal": [r"renewal|extension\s+fee"],
    "late_payment": [r"late\s+(?:fee|charge|payment|interest)"],
    "audit": [r"audit"],
    "liquidated_damages": [r"liquidated\s+damage"],
}


def classify_fee_row(label: str, amount_text: str = "") -> Tuple[str, float]:
    """Classify a fee row label into a canonical fee type.

    Returns (fee_type, confidence).
    fee_type is one of: royalty, ad_fund, technology, transfer, renewal,
                        late_payment, audit, liquidated_damages, other

    General rule: check label first. If label is empty, check amount text
    for fee type signals (e.g., "% of Net Sales" → royalty).
    """
    label_lower = label.lower().strip()

    # Check label first (high confidence)
    if label_lower:
        for fee_type, patterns in FEE_LABEL_MAP.items():
            for pattern in patterns:
                if re.search(pattern, label_lower, re.I):
                    return (fee_type, 0.9)
        return ("other", 0.3)

    # Empty label — check amount text for fee type signals (medium confidence)
    amount_lower = amount_text.lower().strip()
    if amount_lower:
        for fee_type, patterns in FEE_LABEL_MAP.items():
            for pattern in patterns:
                if re.search(pattern, amount_lower, re.I):
                    return (fee_type, 0.6)
        # Additional amount-text patterns: "X% of Net Sales" is a strong royalty signal
        if re.search(r'\d+%\s+of\s+(?:net|gross)\s+sales', amount_lower):
            return ("royalty", 0.5)

    return ("other", 0.0)


def extract_rate_from_amount(amount_text: str) -> Optional[str]:
    """Extract a percentage rate from an amount cell.
    Returns string like '6%' or '5.5%' or None.
    """
    m = re.search(r'(\d+(?:\.\d+)?)\s*%', str(amount_text))
    if m:
        val = float(m.group(1))
        if 0.1 <= val <= 50:
            return f"{m.group(1)}%"
    return None


def map_fee_table(fee_rows: List[List[str]]) -> Dict[str, Any]:
    """Map fee table rows to canonical fee types.

    Takes raw table rows (list of cell strings per row).
    Returns dict with royalty_rate, ad_fund_rate, etc.

    Rule: a row cannot populate multiple fee fields.
    """
    if not isinstance(fee_rows, list):
        return {}

    result: Dict[str, Any] = {}
    mapped_rows = []
    unresolved_rows = []
    last_fee_type = "other"  # For label inheritance across empty-label rows

    for row in fee_rows:
        if not isinstance(row, list) or len(row) < 2:
            continue
        if not any(str(c).strip() for c in row):
            continue

        label = str(row[0]) if row else ""
        amount = str(row[1]) if len(row) > 1 else ""
        timing = row[2] if len(row) > 2 else ""
        notes = row[3] if len(row) > 3 else ""

        fee_type, confidence = classify_fee_row(label, amount)

        # Label inheritance: empty-label rows inherit from most recent labeled row
        if not label.strip() and fee_type == "other" and last_fee_type != "other":
            fee_type = last_fee_type
            confidence = max(confidence, 0.4)  # inherited, lower confidence
        if label.strip():
            last_fee_type = fee_type

        rate = extract_rate_from_amount(amount)

        row_mapped = {
            "label": label,
            "amount": amount,
            "fee_type": fee_type,
            "rate": rate,
            "confidence": confidence,
            "timing": timing,
            "notes": notes,
        }
        mapped_rows.append(row_mapped)

        # Map to result fields (one row → one field, never duplicated)
        if fee_type == "royalty" and rate and "royalty_rate" not in result:
            result["royalty_rate"] = rate
        elif fee_type == "ad_fund" and rate and "ad_fund_rate" not in result:
            result["ad_fund_rate"] = rate
        elif fee_type == "technology" and rate and "technology_fee_rate" not in result:
            result["technology_fee_rate"] = rate
        elif fee_type == "transfer" and "transfer_fee" not in result:
            # Transfer fee might be a dollar amount, not a percentage
            m = re.search(r'\$([\d,]+)', amount)
            if m:
                result["transfer_fee"] = int(m.group(1).replace(',', ''))
            elif rate:
                result["transfer_fee_rate"] = rate
        elif fee_type == "renewal" and "renewal_fee" not in result:
            m = re.search(r'\$([\d,]+)', amount)
            if m:
                result["renewal_fee"] = int(m.group(1).replace(',', ''))
        elif fee_type == "other" and confidence < 0.5:
            unresolved_rows.append(row_mapped)

    result["_mapped_rows"] = mapped_rows
    result["_unresolved_rows"] = unresolved_rows

    return result
