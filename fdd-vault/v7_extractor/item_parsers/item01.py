"""
Item 1 Parser — Entity Identity

Extracts: franchisor entity name, business description, formation state,
year franchising began, parent company, predecessor, affiliates,
offering variants (standard, non-traditional, etc.).
"""

import re
from typing import Dict, Any, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _find_year(text: str) -> Optional[int]:
    """Extract a four-digit year from text."""
    m = re.search(r'\b(19\d{2}|20\d{2})\b', text)
    return int(m.group(1)) if m else None


def _find_state(text: str) -> Optional[str]:
    """Find a US state name in formation context."""
    from ..models import US_STATES
    for state in US_STATES:
        if state.lower() in text.lower():
            return state
    return None


def parse_item01(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 1: The Franchisor and any Parents, Predecessors, and Affiliates."""
    result: Dict[str, Any] = {
        "item": 1,
        "entity_name": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "business_description": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "formation_state": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "year_incorporated": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "year_franchising_began": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "parent_company": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "predecessor": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "affiliates": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "offering_variants": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text = section.text.lower()
    prov = Provenance(source_item=1, source_page=section.start_page, extraction_method="reading")

    # --- Tables first: some Item 1s have affiliate tables ---
    for table in section.tables:
        cols_lower = [c.lower() for c in table.columns]
        if any("affiliate" in c for c in cols_lower) or any("parent" in c for c in cols_lower):
            affiliates = []
            for row in table.rows:
                if row and row[0].strip():
                    affiliates.append(row[0].strip())
            if affiliates:
                tprov = Provenance(
                    source_item=1, source_page=table.source_page,
                    source_table_id=table.table_id,
                    extraction_method="table_cell", confidence="high"
                )
                result["affiliates"] = {
                    "value": affiliates,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": {"source_page": tprov.source_page, "source_table_id": tprov.source_table_id},
                }

    # --- Text reading for narrative facts ---

    # Formation state
    for pattern in [r'(?:organized|incorporated|formed|established)\s+(?:in|under the laws of)\s+(?:the\s+)?(?:state\s+of\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)']:
        m = re.search(pattern, section.text)
        if m:
            state_name = m.group(1).strip()
            from ..models import US_STATES
            if state_name in US_STATES:
                result["formation_state"] = {
                    "value": state_name,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": {"source_page": section.start_page},
                }
                break

    # Year franchising began
    for pattern in [
        r'(?:began|started|commenced)\s+(?:offering\s+)?franchis(?:ing|es?)\s+(?:in\s+)?(\d{4})',
        r'(?:first\s+offered\s+franchises?\s+in\s+)(\d{4})',
        r'(?:franchising\s+since\s+)(\d{4})',
    ]:
        m = re.search(pattern, text)
        if m:
            result["year_franchising_began"] = {
                "value": int(m.group(1)),
                "state": EvidenceState.PRESENT.value,
                "provenance": {"source_page": section.start_page},
            }
            break

    # Year incorporated
    for pattern in [
        r'(?:incorporated|organized|formed)\s+(?:on\s+)?(?:\w+\s+\d{1,2},?\s+)?(\d{4})',
    ]:
        m = re.search(pattern, text)
        if m:
            result["year_incorporated"] = {
                "value": int(m.group(1)),
                "state": EvidenceState.PRESENT.value,
                "provenance": {"source_page": section.start_page},
            }
            break

    # Parent company
    for pattern in [
        r'(?:parent\s+(?:company|entity|corporation))\s+(?:is\s+)?([A-Z][A-Za-z\s,\.&]+?)(?:\.|,\s+a\s)',
        r'(?:wholly[- ]owned\s+subsidiary\s+of\s+)([A-Z][A-Za-z\s,\.&]+?)(?:\.|,)',
    ]:
        m = re.search(pattern, section.text)
        if m:
            result["parent_company"] = {
                "value": m.group(1).strip(),
                "state": EvidenceState.PRESENT.value,
                "provenance": {"source_page": section.start_page},
            }
            break

    # Predecessor
    for pattern in [r'(?:predecessor\s+(?:is|was)\s+)([A-Z][A-Za-z\s,\.&]+?)(?:\.|,)']:
        m = re.search(pattern, section.text)
        if m:
            result["predecessor"] = {
                "value": m.group(1).strip(),
                "state": EvidenceState.PRESENT.value,
                "provenance": {"source_page": section.start_page},
            }
            break

    # Offering variants
    variant_keywords = ["standard", "non-traditional", "non traditional", "small box",
                        "express", "satellite", "kiosk", "mobile", "food truck"]
    found_variants = []
    for kw in variant_keywords:
        if kw in text:
            found_variants.append(kw.replace("non traditional", "non-traditional"))
    if found_variants:
        result["offering_variants"] = {
            "value": list(set(found_variants)),
            "state": EvidenceState.PRESENT.value,
            "provenance": {"source_page": section.start_page},
        }

    return result
