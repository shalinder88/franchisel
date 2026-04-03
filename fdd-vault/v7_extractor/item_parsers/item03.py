"""
Item 3 Parser — Litigation

Extracts: no_litigation flag, case count, litigation type classification,
trend direction.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item03(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 3: Litigation history."""
    result: Dict[str, Any] = {
        "item": 3,
        "no_litigation": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "case_count": {"value": 0, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "case_types": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "trend": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text = section.text
    text_lower = text.lower()
    prov_base = {"source_page": section.start_page}

    # --- Check for no-litigation disclosure ---
    no_lit_patterns = [
        r'no\s+litigation',
        r'no\s+pending\s+litigation',
        r'(?:there\s+(?:is|are)\s+)?no\s+(?:pending\s+)?(?:litigation|actions?|suits?)',
        r'(?:need|required)\s+(?:not|to)\s+(?:be\s+)?disclose',
    ]
    for pattern in no_lit_patterns:
        if re.search(pattern, text_lower):
            result["no_litigation"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            result["case_count"] = {
                "value": 0,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            return result

    # --- Tables first: some FDDs put litigation in a summary table ---
    for table in section.tables:
        cols_lower = [c.lower() for c in table.columns]
        if any("case" in c or "caption" in c or "matter" in c for c in cols_lower):
            case_count = len(table.rows)
            tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
            result["case_count"] = {
                "value": case_count,
                "state": EvidenceState.PRESENT.value,
                "provenance": tprov,
            }

    # --- Text-based case counting ---
    # Look for "v." or "vs." or "Case No." patterns
    vs_matches = re.findall(r'\bv\.\s', text)
    case_no_matches = re.findall(r'(?:Case|Cause|Docket|Civil Action)\s+No\.', text, re.IGNORECASE)
    text_case_count = max(len(vs_matches), len(case_no_matches))

    if text_case_count > 0 and result["case_count"]["state"] == EvidenceState.NOT_FOUND.value:
        result["case_count"] = {
            "value": text_case_count,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- Type classification ---
    types_found: List[str] = []

    if re.search(r'franchisee.*(?:v\.|vs\.|against).*franchisor|franchisor.*(?:v\.|vs\.|against).*franchisee', text_lower):
        types_found.append("franchisee_vs_franchisor")
    if re.search(r'(?:ftc|federal trade commission|state attorney|attorney general|regulatory)', text_lower):
        types_found.append("regulatory")
    if re.search(r'(?:employment|wage|labor|eeoc|discrimination|harassment)', text_lower):
        types_found.append("employment")
    if re.search(r'(?:trademark|infringement|lanham act|trade dress)', text_lower):
        types_found.append("trademark")
    if re.search(r'(?:class action|class-action|putative class)', text_lower):
        types_found.append("class_action")

    # If we found cases but no type matched, mark as other
    if (result["case_count"].get("value", 0) or 0) > 0 and not types_found:
        types_found.append("other")

    if types_found:
        result["case_types"] = {
            "value": list(set(types_found)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- Trend ---
    case_count_val = result["case_count"].get("value", 0) or 0
    if case_count_val == 0:
        result["trend"] = {
            "value": "none",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif case_count_val <= 3:
        result["trend"] = {
            "value": "low",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif case_count_val <= 10:
        result["trend"] = {
            "value": "moderate",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    else:
        result["trend"] = {
            "value": "high",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
