"""
Item 8 Parser — Restrictions on Sources of Products and Services

Extracts: approved/required/sole/affiliate suppliers, required software/hardware,
required payment processor, rebates/commissions, setup and ongoing
required-purchase percentages, lock-in severity score.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


SUPPLIER_KEYWORDS = {
    "approved_supplier": ["approved supplier", "approved vendor", "designated supplier"],
    "required_supplier": ["required supplier", "must purchase", "required to purchase", "obligated to purchase"],
    "sole_supplier": ["sole supplier", "sole source", "only supplier", "exclusive supplier"],
    "affiliate_supplier": ["affiliate", "related entity", "related company", "our affiliate"],
}

SYSTEM_KEYWORDS = {
    "required_software": ["required software", "proprietary software", "pos system", "point of sale",
                          "management system", "required technology"],
    "required_hardware": ["required hardware", "required equipment", "specified equipment"],
    "required_payment_processor": ["payment processor", "credit card processor", "merchant services"],
}


def parse_item08(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 8: Restrictions on Sources of Products and Services."""
    result: Dict[str, Any] = {
        "item": 8,
        "supplier_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "approved_suppliers": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "required_suppliers": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "sole_suppliers": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "affiliate_suppliers": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "required_software": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "required_hardware": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "required_payment_processor": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "rebates_commissions": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "setup_required_purchase_pct": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ongoing_required_purchase_pct": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "lock_in_severity": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST ---
    supplier_rows: List[Dict[str, Any]] = []
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue
            supplier_rows.append({
                "raw_cells": row,
                "provenance": tprov,
            })

    if supplier_rows:
        result["supplier_rows"] = {
            "value": supplier_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- TEXT reading for supplier categories ---
    severity_score = 0

    for field, keywords in SUPPLIER_KEYWORDS.items():
        found = any(kw in text_lower for kw in keywords)
        if found:
            result[field] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            severity_score += 2
        else:
            result[field] = {
                "value": False,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    for field, keywords in SYSTEM_KEYWORDS.items():
        found = any(kw in text_lower for kw in keywords)
        if found:
            result[field] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            severity_score += 1

    # Rebates/commissions
    if re.search(r'rebat|commission|revenue\s+(?:from|received)', text_lower):
        result["rebates_commissions"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
        severity_score += 1

    # Required purchase percentages — also catch "up to X%" and "represent X%"
    pct_patterns = [
        (r'(?:approximately|about|estimated|up\s+to)?\s*(\d{1,3})\s*%\s*(?:of\s+)?(?:your\s+)?(?:total\s+)?(?:initial|setup|start)', "setup_required_purchase_pct"),
        (r'(?:approximately|about|estimated|up\s+to|represent)?\s*(\d{1,3})\s*%\s*(?:of\s+)?(?:your\s+)?(?:total\s+)?(?:ongoing|continuing|annual|overall|purchases)', "ongoing_required_purchase_pct"),
    ]
    for pattern, field in pct_patterns:
        m = re.search(pattern, text_lower)
        if m:
            result[field] = {
                "value": int(m.group(1)),
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # ── NARRATIVE SUPPLIER EXTRACTION ──
    # Item 8 is often narrative-only. Extract specific supplier names and obligations from prose.
    named_suppliers: List[Dict[str, Any]] = []

    # Pattern: "our affiliate [Name]" or "[Name] distributes" or "from [Name]"
    affiliate_patterns = [
        r'(?:our\s+affiliate[,]?\s+)([A-Z][A-Za-z\s\',]+(?:Inc\.|LLC|Ltd\.|Corp\.))',
        r'(?:from\s+)([A-Z][A-Za-z\s\',]+(?:Inc\.|LLC|Ltd\.|Corp\.))',
        r'(?:through\s+)([A-Z][A-Za-z\s\',]+(?:Inc\.|LLC|Ltd\.|Corp\.))',
    ]
    seen_suppliers = set()
    for pattern in affiliate_patterns:
        for m in re.finditer(pattern, section.text):
            name = m.group(1).strip().rstrip(',. ')
            if name and len(name) > 3 and name not in seen_suppliers:
                seen_suppliers.add(name)
                named_suppliers.append({
                    "name": name,
                    "type": "affiliate" if "affiliate" in section.text[max(0,m.start()-30):m.start()].lower() else "designated",
                    "source_page": section.start_page,
                })

    if named_suppliers:
        result["named_suppliers"] = {
            "value": named_suppliers,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Revenue from suppliers/affiliates
    rev_match = re.search(r'(?:revenue\s+received|we\s+(?:or\s+our\s+affiliates\s+)?received)\s*\$\s*([\d,.]+)\s*(million|billion)?', text_lower)
    if rev_match:
        val = float(rev_match.group(1).replace(",", ""))
        if rev_match.group(2) == "million":
            val *= 1_000_000
        elif rev_match.group(2) == "billion":
            val *= 1_000_000_000
        result["affiliate_revenue"] = {
            "value": int(val),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Specific required products
    required_products: List[str] = []
    for m in re.finditer(r'(?:require(?:d)?\s+(?:that\s+)?you\s+purchase|must\s+purchase|only\s+from)\s+([^.]+)', text_lower):
        products_text = m.group(1).strip()[:150]
        required_products.append(products_text)
    if required_products:
        result["required_products"] = {
            "value": required_products,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Lock-in severity score (0-10)
    severity_score = min(severity_score, 10)
    result["lock_in_severity"] = {
        "value": severity_score,
        "state": EvidenceState.PRESENT.value,
        "provenance": prov_base,
    }

    return result
