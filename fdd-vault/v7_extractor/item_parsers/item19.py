"""
Item 19 Parser — Financial Performance Representations (FPR)

HIGHEST SENSITIVITY. Read EVERY line. Import EVERY table.
Check for dollar amounts >= $1,000. Check for universal disclaimer.
Import all averages/medians/highs/lows, threshold buckets, pro formas,
EBITDA, what is excluded, what is not profit, population definitions.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


def _parse_dollar(text: str) -> Optional[float]:
    """Parse a dollar amount from text."""
    m = re.search(r'\$\s*([\d,]+(?:\.\d{2})?)', text)
    if m:
        return float(m.group(1).replace(",", ""))
    return None


def _find_all_dollar_amounts(text: str) -> List[float]:
    """Find all dollar amounts in text."""
    matches = re.findall(r'\$\s*([\d,]+(?:\.\d{2})?)', text)
    return [float(m.replace(",", "")) for m in matches]


def parse_item19(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 19: Financial Performance Representations."""
    result: Dict[str, Any] = {
        "item": 19,
        "has_fpr": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "fpr_tables": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "universal_disclaimer": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "metrics_reported": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "averages": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "medians": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "population_definition": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "exclusions": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "not_profit_disclaimer": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "has_ebitda": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "has_pro_forma": {"value": False, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "threshold_buckets": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "dollar_amounts_over_1000": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text = section.text
    text_lower = text.lower()
    prov_base = {"source_page": section.start_page}

    # --- Check for no-FPR disclosure ---
    no_fpr_patterns = [
        r'(?:we|franchisor)\s+(?:do|does)\s+not\s+make\s+(?:any\s+)?(?:financial\s+performance\s+representation|earnings\s+claim)',
        r'no\s+financial\s+performance\s+representation',
        r'(?:there\s+(?:is|are)\s+)?no\s+(?:financial\s+performance\s+representation|earnings\s+claim)',
    ]
    for pattern in no_fpr_patterns:
        if re.search(pattern, text_lower):
            result["has_fpr"] = {
                "value": False,
                "state": EvidenceState.EXPLICITLY_ABSENT.value,
                "provenance": prov_base,
            }
            return result

    result["has_fpr"] = {
        "value": True,
        "state": EvidenceState.PRESENT.value,
        "provenance": prov_base,
    }

    # --- TABLES FIRST: import EVERY table ---
    fpr_tables: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}

        table_data: Dict[str, Any] = {
            "table_id": table.table_id,
            "title": table.title,
            "columns": table.columns,
            "row_count": len(table.rows),
            "rows": [],
            "provenance": tprov,
        }

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            row_data: Dict[str, Any] = {
                "raw_cells": row,
            }

            # Extract dollar amounts from this row
            row_text = " ".join(row)
            row_dollars = _find_all_dollar_amounts(row_text)
            if row_dollars:
                row_data["dollar_amounts"] = row_dollars

            # Detect percentages
            pcts = re.findall(r'(\d+(?:\.\d+)?)\s*%', row_text)
            if pcts:
                row_data["percentages"] = [float(p) for p in pcts]

            table_data["rows"].append(row_data)

        fpr_tables.append(table_data)

    if fpr_tables:
        result["fpr_tables"] = {
            "value": fpr_tables,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- EXTRACT average_revenue from FPR table rows ---
    # General rule: look for "Average" rows in FPR tables.
    # The "Total" column (last non-empty value) in the franchised-stores section
    # gives the system-wide average revenue figure.
    avg_revenue = None
    avg_revenue_prov = None
    for tbl in fpr_tables:
        in_franchised_section = False
        for row_data in tbl.get("rows", []):
            cells = row_data.get("raw_cells", [])
            row_text = " ".join(cells).lower()

            # Track whether we're in the franchised stores section
            if "franchised" in row_text and "store" in row_text:
                in_franchised_section = True
            elif "corporate" in row_text and "store" in row_text:
                in_franchised_section = False

            # Look for average revenue row
            if re.search(r'average\s+net\s+(?:royalty\s+)?sales', row_text) or \
               re.search(r'average\s+(?:gross\s+)?sales', row_text) or \
               re.search(r'average\s+(?:net\s+)?revenue', row_text):
                dollars = row_data.get("dollar_amounts", [])
                if dollars:
                    # Last dollar amount is the "Total" column
                    candidate = dollars[-1]
                    if candidate >= 10000:  # sanity check: revenue should be meaningful
                        # Prefer franchised-section average over all-stores average
                        if in_franchised_section or avg_revenue is None:
                            avg_revenue = int(candidate)
                            avg_revenue_prov = tbl.get("provenance")
                        if in_franchised_section:
                            break  # Found franchised average — stop
        if avg_revenue and in_franchised_section:
            break  # Found franchised average — stop searching tables

    # Fallback: extract average from prose text if tables didn't have it
    # General rule: McDonald's and some brands state average in narrative, not table rows.
    # "The average annual sales volume...was $4,002,000"
    if not avg_revenue:
        avg_patterns = [
            r'average\s+(?:annual\s+)?(?:gross\s+)?sales\s+volume.*?was\s+\$\s*([\d,]+)',
            r'average\s+(?:annual\s+)?(?:net\s+)?(?:royalty\s+)?sales.*?(?:was|of)\s+\$\s*([\d,]+)',
            r'average\s+(?:annual\s+)?(?:unit\s+)?(?:volume|revenue).*?(?:was|of)\s+\$\s*([\d,]+)',
        ]
        for pattern in avg_patterns:
            m = re.search(pattern, text_lower)
            if m:
                val = float(m.group(1).replace(",", ""))
                if val >= 10000:
                    avg_revenue = int(val)
                    break

    if avg_revenue:
        result["average_revenue"] = {
            "value": avg_revenue,
            "state": EvidenceState.PRESENT.value,
            "provenance": avg_revenue_prov or prov_base,
        }

    # --- TEXT reading: every line matters ---

    # Universal disclaimer
    disclaimer_patterns = [
        r'some\s+outlets?\s+have\s+(?:sold|earned)\s+(?:this|these)\s+amount',
        r'your\s+(?:individual\s+)?results\s+may\s+(?:differ|vary)',
        r'(?:there\s+is\s+no\s+assurance|we\s+cannot\s+(?:assure|guarantee))',
        r'substantiation.*(?:available|upon\s+request)',
    ]
    for pattern in disclaimer_patterns:
        if re.search(pattern, text_lower):
            result["universal_disclaimer"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            break

    # Metrics reported
    metrics: List[str] = []
    metric_keywords = {
        "gross_sales": ["gross sales", "gross revenue", "total sales", "total revenue"],
        "net_sales": ["net sales", "net revenue"],
        "gross_profit": ["gross profit", "gross margin"],
        "ebitda": ["ebitda"],
        "ebit": ["ebit "],
        "net_income": ["net income", "net profit"],
        "cost_of_goods": ["cost of goods", "cogs", "cost of sales"],
        "operating_expenses": ["operating expense", "operating cost"],
        "average_unit_volume": ["average unit volume", "auv", "average gross sales"],
        "same_store_sales": ["same store", "same-store", "comparable store"],
    }
    for metric, keywords in metric_keywords.items():
        if any(kw in text_lower for kw in keywords):
            metrics.append(metric)
    if metrics:
        result["metrics_reported"] = {
            "value": list(set(metrics)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # EBITDA
    if "ebitda" in text_lower:
        result["has_ebitda"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Pro forma
    if re.search(r'pro\s*forma', text_lower):
        result["has_pro_forma"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Averages
    averages: List[Dict[str, Any]] = []
    avg_matches = re.finditer(r'average\s+(?:[\w\s]+?)(?:was|is|of)\s+\$\s*([\d,]+(?:\.\d{2})?)', text_lower)
    for m in avg_matches:
        val = float(m.group(1).replace(",", ""))
        averages.append({"value": val, "context": m.group(0)[:80]})
    if averages:
        result["averages"] = {
            "value": averages,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Medians
    medians: List[Dict[str, Any]] = []
    med_matches = re.finditer(r'median\s+(?:[\w\s]+?)(?:was|is|of)\s+\$\s*([\d,]+(?:\.\d{2})?)', text_lower)
    for m in med_matches:
        val = float(m.group(1).replace(",", ""))
        medians.append({"value": val, "context": m.group(0)[:80]})
    if medians:
        result["medians"] = {
            "value": medians,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Population definition
    pop_patterns = [
        r'(?:based\s+on|includes?|represents?|consist(?:s|ed)\s+of)\s+([\w\s,]+(?:outlet|unit|franchise|location|restaurant|store)s?\s+(?:that|which|who|in|open|operating)[\w\s,]*?)(?:\.|;)',
    ]
    for pattern in pop_patterns:
        m = re.search(pattern, text_lower)
        if m:
            result["population_definition"] = {
                "value": m.group(1).strip()[:200],
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
            break

    # Exclusions
    exclusions: List[str] = []
    excl_patterns = [
        (r'(?:exclud|not\s+include|does\s+not\s+(?:include|reflect)).*(?:outlet|unit|franchise|location|store)s?\s+(?:that|which|who)\s+([\w\s,]+?)(?:\.|;)', None),
    ]
    if re.search(r'(?:exclud|not\s+include|omit)', text_lower):
        if "first year" in text_lower or "less than 12 months" in text_lower:
            exclusions.append("outlets_open_less_than_12_months")
        if "closed" in text_lower:
            exclusions.append("closed_outlets")
        if "non-traditional" in text_lower:
            exclusions.append("non_traditional_outlets")
        if "company" in text_lower and "owned" in text_lower:
            exclusions.append("company_owned_outlets")
    if exclusions:
        result["exclusions"] = {
            "value": exclusions,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Not-profit disclaimer
    if re.search(r'(?:not\s+(?:represent|intended\s+as)|should\s+not\s+be\s+considered)\s+(?:actual\s+)?(?:profit|income|earnings|net\s+income)', text_lower):
        result["not_profit_disclaimer"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Dollar amounts over $1,000
    all_dollars = _find_all_dollar_amounts(text)
    big_dollars = [d for d in all_dollars if d >= 1000]
    if big_dollars:
        result["dollar_amounts_over_1000"] = {
            "value": sorted(set(big_dollars)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Threshold buckets (e.g., "X% of outlets achieved $Y or more")
    bucket_matches = re.finditer(
        r'(\d+(?:\.\d+)?)\s*%\s*(?:of\s+)?(?:outlet|unit|franchise|location|store)s?\s+(?:achieved|earned|had|exceeded|attained|surpassed).*?\$\s*([\d,]+)',
        text_lower
    )
    buckets: List[Dict[str, Any]] = []
    for m in bucket_matches:
        buckets.append({
            "percent_of_outlets": float(m.group(1)),
            "threshold_amount": float(m.group(2).replace(",", "")),
        })
    if buckets:
        result["threshold_buckets"] = {
            "value": buckets,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
