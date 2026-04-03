"""
Item 11 Parser — Franchisor's Assistance, Advertising, Computer Systems, and Training

Extracts: site selection, training phases (classroom/OJT hours),
pre-opening/opening support, mandatory systems, ad structure,
annual conference.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _parse_hours(text: str) -> Optional[int]:
    """Extract hour count from text like '40 hours' or '120 classroom hours'."""
    m = re.search(r'(\d+)\s*(?:hours?|hrs?)', text.lower())
    return int(m.group(1)) if m else None


def parse_item11(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 11: Franchisor's Assistance, Advertising, Computer Systems, and Training."""
    result: Dict[str, Any] = {
        "item": 11,
        "training_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "site_selection": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "classroom_hours": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ojt_hours": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "total_training_hours": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "pre_opening_support": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ongoing_support": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "mandatory_systems": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ad_fund_structure": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "annual_conference": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: training program table ---
    training_rows: List[Dict[str, Any]] = []
    total_classroom = 0
    total_ojt = 0

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        is_training_table = any(
            "subject" in c or "training" in c or "program" in c or "topic" in c
            for c in cols_lower
        )

        if is_training_table:
            # Find column indices
            subject_idx = next((i for i, c in enumerate(cols_lower) if "subject" in c or "topic" in c or "training" in c), 0)
            hours_idx = next((i for i, c in enumerate(cols_lower) if "hour" in c or "length" in c or "duration" in c), None)
            classroom_idx = next((i for i, c in enumerate(cols_lower) if "classroom" in c), None)
            ojt_idx = next((i for i, c in enumerate(cols_lower) if "on-the-job" in c or "ojt" in c or "on the job" in c), None)
            location_idx = next((i for i, c in enumerate(cols_lower) if "location" in c or "where" in c), None)

            for row in table.rows:
                if not row or not any(cell.strip() for cell in row):
                    continue

                training_row: Dict[str, Any] = {
                    "raw_cells": row,
                    "provenance": tprov,
                }

                if subject_idx < len(row):
                    training_row["subject"] = row[subject_idx].strip()
                if hours_idx is not None and hours_idx < len(row):
                    h = _parse_hours(row[hours_idx])
                    if h:
                        training_row["hours"] = h
                if classroom_idx is not None and classroom_idx < len(row):
                    h = _parse_hours(row[classroom_idx])
                    if h:
                        training_row["classroom_hours"] = h
                        total_classroom += h
                if ojt_idx is not None and ojt_idx < len(row):
                    h = _parse_hours(row[ojt_idx])
                    if h:
                        training_row["ojt_hours"] = h
                        total_ojt += h
                if location_idx is not None and location_idx < len(row):
                    training_row["location"] = row[location_idx].strip()

                training_rows.append(training_row)

    if training_rows:
        result["training_rows"] = {
            "value": training_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    if total_classroom > 0:
        result["classroom_hours"] = {
            "value": total_classroom,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    if total_ojt > 0:
        result["ojt_hours"] = {
            "value": total_ojt,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }
    if total_classroom + total_ojt > 0:
        result["total_training_hours"] = {
            "value": total_classroom + total_ojt,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- TEXT reading for narrative facts ---

    # Site selection
    if re.search(r'site\s+selection|select.*(?:site|location)', text_lower):
        assisted = bool(re.search(r'(?:assist|help|approve|consent).*(?:site|location)', text_lower))
        result["site_selection"] = {
            "value": "franchisor_assisted" if assisted else "mentioned",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Pre-opening support signals
    pre_open_signals = []
    for signal, label in [
        (r'grand\s+opening', "grand_opening_support"),
        (r'pre[- ]?opening', "pre_opening_assistance"),
        (r'(?:initial|opening)\s+inventory', "initial_inventory_guidance"),
        (r'(?:build[- ]?out|construction|design)', "buildout_guidance"),
    ]:
        if re.search(signal, text_lower):
            pre_open_signals.append(label)
    if pre_open_signals:
        result["pre_opening_support"] = {
            "value": pre_open_signals,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Mandatory systems
    systems = []
    for kw in ["pos system", "point of sale", "proprietary software", "intranet",
                "crm", "scheduling system", "inventory system", "accounting software"]:
        if kw in text_lower:
            systems.append(kw)
    if systems:
        result["mandatory_systems"] = {
            "value": systems,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Ad fund structure
    if re.search(r'(?:advertising|ad|brand)\s+(?:fund|council|cooperative|co-op)', text_lower):
        result["ad_fund_structure"] = {
            "value": "fund_exists",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Annual conference
    if re.search(r'(?:annual|yearly)\s+(?:conference|convention|meeting)', text_lower):
        mandatory = bool(re.search(r'(?:must|required|mandatory|obligated).*(?:conference|convention)', text_lower))
        result["annual_conference"] = {
            "value": "mandatory" if mandatory else "offered",
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Fallback: get training hours from text if tables didn't yield them
    if result["classroom_hours"]["state"] == EvidenceState.NOT_FOUND.value:
        m = re.search(r'(\d+)\s*(?:hours?\s+of\s+)?classroom', text_lower)
        if m:
            result["classroom_hours"] = {
                "value": int(m.group(1)),
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    if result["ojt_hours"]["state"] == EvidenceState.NOT_FOUND.value:
        m = re.search(r'(\d+)\s*(?:hours?\s+of\s+)?(?:on[- ]the[- ]job|ojt)', text_lower)
        if m:
            result["ojt_hours"] = {
                "value": int(m.group(1)),
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    return result
