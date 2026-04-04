"""
Item 12 Parser — Territory

Extracts: territory type, exclusivity, protected area, reserved rights,
encroachment carveouts, development deadlines, loss-of-territory triggers.
"""

import re
from typing import Dict, Any, List

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def parse_item12(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 12: Territory."""
    result: Dict[str, Any] = {
        "item": 12,
        "territory_type": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "exclusivity": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "protected_area": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "reserved_rights": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "encroachment_carveouts": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "development_deadlines": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "loss_of_territory_triggers": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST ---
    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        # Some FDDs have territory parameters in a table
        for row in table.rows:
            if not row:
                continue
            row_lower = " ".join(row).lower()
            if "exclusive" in row_lower or "protected" in row_lower:
                result["exclusivity"] = {
                    "value": "exclusive" if "exclusive" in row_lower else "protected",
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    # --- TEXT reading ---

    # Territory type
    type_patterns = [
        (r'(\d+)[- ]?mile\s+radius', "radius"),
        (r'radius\s+of\s+(\d+)\s+miles?', "radius"),
        (r'zip\s+code', "zip_code"),
        (r'population\s+(?:of\s+)?(?:approximately\s+)?([\d,]+)', "population"),
        (r'geographic\s+(?:area|territory|boundary)', "geographic"),
        (r'designated\s+(?:area|territory|market)', "designated_area"),
    ]
    for pattern, ttype in type_patterns:
        m = re.search(pattern, text_lower)
        if m:
            val: Dict[str, Any] = {"type": ttype}
            if ttype == "radius" and m.group(1):
                val["miles"] = int(m.group(1))
            elif ttype == "population" and m.group(1):
                val["population"] = int(m.group(1).replace(",", ""))
            result["territory_type"] = {
                "value": val,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            break

    # Exclusivity
    # General rule: check NEGATIVE patterns FIRST ("no exclusive", "not exclusive",
    # "no protected", "no territory"). McDonald's grants NO exclusive territory.
    if result["exclusivity"]["state"] == EvidenceState.NOT_FOUND.value:
        no_territory_patterns = [
            r'(?:no|not|do\s+not|does\s+not|will\s+not)\s+(?:grant|receive|have|get)\s+(?:any\s+)?(?:exclusive|protected)\s+(?:territory|area)',
            r'(?:no|not)\s+(?:exclusive|protected)\s+(?:territory|area)',
            r'non[- ]?exclusive',
            r'(?:no|not)\s+(?:grant|provide|receive)\s+(?:a\s+)?territory',
            r'you\s+(?:will\s+not|do\s+not)\s+(?:receive|have|get)\s+(?:any\s+)?(?:territory|protected)',
        ]
        is_no_territory = any(re.search(p, text_lower) for p in no_territory_patterns)

        if is_no_territory:
            result["exclusivity"] = {
                "value": "none",
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            result["territory_type"] = {
                "value": {"type": "none"},
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
        elif re.search(r'exclusive\s+(?:territory|area|market|right)', text_lower):
            result["exclusivity"] = {
                "value": "exclusive",
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
        elif re.search(r'protected\s+(?:territory|area)', text_lower):
            result["exclusivity"] = {
                "value": "protected",
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Franchisor right to compete
    if re.search(r'(?:we|franchisor)\s+(?:may|can|has\s+the\s+right|reserve)', text_lower) and \
       re.search(r'(?:establish|operate|open|develop|franchise)', text_lower):
        result["franchisor_may_compete"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Encroachment risk assessment
    if result["exclusivity"].get("value") == "none":
        result["encroachment_risk"] = {
            "value": "high",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    elif result["exclusivity"].get("value") in ("exclusive", "protected"):
        result["encroachment_risk"] = {
            "value": "low",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Reserved rights
    reserved = []
    reserve_patterns = [
        (r'internet|online|e-commerce|digital', "internet_sales"),
        (r'national\s+accounts?|institutional', "national_accounts"),
        (r'catering', "catering"),
        (r'wholesale', "wholesale"),
        (r'alternative\s+(?:channel|distribution)', "alternative_channels"),
        (r'co[- ]?brand', "co_branding"),
    ]
    for pattern, rtype in reserve_patterns:
        if re.search(pattern, text_lower):
            reserved.append(rtype)
    if reserved:
        result["reserved_rights"] = {
            "value": reserved,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Encroachment carveouts
    carveouts = []
    if re.search(r'(?:grocery|supermarket|convenience)\s+store', text_lower):
        carveouts.append("grocery_convenience")
    if re.search(r'(?:airport|travel\s+plaza|military|college|university|hospital|stadium)', text_lower):
        carveouts.append("captive_audience_venue")
    if re.search(r'(?:food\s+truck|ghost\s+kitchen|virtual\s+kitchen)', text_lower):
        carveouts.append("alternative_format")
    if carveouts:
        result["encroachment_carveouts"] = {
            "value": carveouts,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Development deadlines
    if re.search(r'development\s+(?:schedule|deadline|timeline|obligation)', text_lower):
        result["development_deadlines"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Loss-of-territory triggers
    triggers = []
    trigger_patterns = [
        (r'(?:fail|failure)\s+to\s+(?:meet|achieve)\s+(?:performance|minimum|development)', "performance_shortfall"),
        (r'(?:lose|loss|forfeit|reduction).*territory', "general_loss"),
        (r'right\s+of\s+first\s+refusal', "rofr_territory"),
    ]
    for pattern, trigger_type in trigger_patterns:
        if re.search(pattern, text_lower):
            triggers.append(trigger_type)
    if triggers:
        result["loss_of_territory_triggers"] = {
            "value": triggers,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
