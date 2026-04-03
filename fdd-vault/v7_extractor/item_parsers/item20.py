"""
Item 20 Parser — Outlets and Franchisee Information

Import: openings, closures, transfers, reacquisitions, terminations,
non-renewals, sold-but-not-opened, franchised vs company-owned,
state-by-state counts. Table No. 1: Systemwide Summary.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _parse_int(text: str) -> Optional[int]:
    """Parse an integer from text, handling commas."""
    m = re.search(r'([\d,]+)', text.strip())
    if m:
        return int(m.group(1).replace(",", ""))
    return None


OUTLET_TABLE_TYPES = [
    "systemwide_outlet_summary",
    "transfers",
    "status_of_franchised_outlets",
    "status_of_company_owned_outlets",
    "projected_openings",
]


def _classify_table(table_title: str, columns: List[str]) -> str:
    """Classify what type of Item 20 table this is."""
    title_lower = table_title.lower()
    cols_joined = " ".join(columns).lower()

    if "systemwide" in title_lower or "table no. 1" in title_lower:
        return "systemwide_outlet_summary"
    if "transfer" in title_lower:
        return "transfers"
    if "franchised" in title_lower and ("status" in title_lower or "outlet" in title_lower):
        return "status_of_franchised_outlets"
    if "company" in title_lower and ("status" in title_lower or "owned" in title_lower or "outlet" in title_lower):
        return "status_of_company_owned_outlets"
    if "projected" in title_lower or "estimated" in title_lower:
        return "projected_openings"
    if "state" in cols_joined or "state" in title_lower:
        return "state_by_state"

    return "outlet_table_unclassified"


def parse_item20(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 20: Outlets and Franchisee Information."""
    result: Dict[str, Any] = {
        "item": 20,
        "outlet_tables": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "total_franchised": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "total_company_owned": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "total_outlets": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "openings": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "closures": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "transfers": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "reacquisitions": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "terminations": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "non_renewals": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "ceased_operations": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "state_counts": {"value": {}, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "year_columns": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: import every outlet table ---
    outlet_tables: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        table_type = _classify_table(table.title, table.columns)

        table_data: Dict[str, Any] = {
            "table_id": table.table_id,
            "title": table.title,
            "table_type": table_type,
            "columns": table.columns,
            "rows": [],
            "provenance": tprov,
        }

        # Detect year columns
        year_cols = []
        for col in table.columns:
            year_match = re.search(r'(20\d{2})', col)
            if year_match:
                year_cols.append(int(year_match.group(1)))

        if year_cols and result["year_columns"]["state"] != EvidenceState.PRESENT.value:
            result["year_columns"] = {
                "value": sorted(year_cols),
                "state": EvidenceState.PRESENT.value,
                "provenance": tprov,
            }

        # Track current type group across rows (Franchised / Company-Owned / Total)
        current_type_group = None

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            row_data: Dict[str, Any] = {
                "raw_cells": row,
                "label": row[0].strip() if row else "",
            }

            # Parse numeric values from non-label cells
            values = []
            for cell in row[1:]:
                val = _parse_int(cell)
                values.append(val)
            row_data["values"] = values

            table_data["rows"].append(row_data)

            # --- Track type group changes ---
            label = row[0].strip().lower() if row else ""
            if "franchised" in label and "total" not in label:
                current_type_group = "franchised"
            elif "company" in label or "affiliate" in label:
                current_type_group = "company"
            elif "total" in label and "franchised" not in label and "company" not in label:
                current_type_group = "total"

            # For rows with empty label, inherit the current type group
            if not label or label.isspace():
                label = current_type_group or ""

            label_lower = label

            # Use the last value (most recent year) for key metrics
            # Look for the 2024 row specifically
            is_2024 = any("2024" in str(c) for c in row)
            last_val = None
            for v in reversed(values):
                if v is not None and v > 0 and not (2000 <= v <= 2030):
                    last_val = v
                    break

            if last_val is not None and is_2024:
                # For 2024 rows, use current_type_group to determine what we're counting
                # The NASAA table has values: [year, start, end, net_change]
                # For end-of-period count, use second numeric value (end column)
                vals_no_year = [v for v in values if v is not None and not (2000 <= v <= 2030)]
                end_val = vals_no_year[1] if len(vals_no_year) >= 2 else (vals_no_year[0] if vals_no_year else None)

                if current_type_group == "franchised" and end_val:
                    result["total_franchised"] = {
                        "value": end_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif current_type_group == "company" and end_val:
                    result["total_company_owned"] = {
                        "value": end_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif current_type_group == "total" and end_val:
                    result["total_outlets"] = {
                        "value": end_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }

                if "open" in label_lower and "new" not in label_lower:
                    pass  # skip "outlets open at start"
                elif re.search(r'(?:new|opened)', label_lower):
                    result["openings"] = {
                        "value": last_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif "clos" in label_lower or "ceased" in label_lower:
                    result["closures"] = {
                        "value": last_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif "transfer" in label_lower:
                    result["transfers"] = {
                        "value": last_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif "reacquir" in label_lower:
                    result["reacquisitions"] = {
                        "value": last_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif "terminat" in label_lower:
                    result["terminations"] = {
                        "value": last_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif "non-renew" in label_lower or "nonrenew" in label_lower:
                    result["non_renewals"] = {
                        "value": last_val,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }

        # State-by-state detection
        if table_type == "state_by_state":
            from ..models import US_STATES
            state_counts: Dict[str, int] = {}
            for row in table.rows:
                if not row:
                    continue
                label = row[0].strip()
                if label in US_STATES:
                    vals = [_parse_int(c) for c in row[1:]]
                    last = None
                    for v in reversed(vals):
                        if v is not None:
                            last = v
                            break
                    if last is not None:
                        state_counts[label] = last
            if state_counts:
                result["state_counts"] = {
                    "value": state_counts,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

        outlet_tables.append(table_data)

    if outlet_tables:
        result["outlet_tables"] = {
            "value": outlet_tables,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
