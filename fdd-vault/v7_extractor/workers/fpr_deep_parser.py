"""
Deep FPR Parser — Sprint 1.1 + 1.2

Parses Item 19 tables into structured FPR objects with:
  - Table classification (company-owned, franchised, combined/systemwide)
  - Combined-table precedence for top-level overall metrics
  - Tier extraction (range buckets with avg/median/high/low)
  - Flat path output for gold scoring

Table precedence for top-level overall:
  1. combined / systemwide / all units / all restaurants
  2. franchised (only if no combined exists)
  3. company-owned (last resort)

Never let first-table-wins logic decide top-level metrics.
"""

import re
from typing import Any, Dict, List, Optional, Tuple


# ══════════════════════════════════════════════════════════════════
# TABLE CLASSIFICATION
# ══════════════════════════════════════════════════════════════════

class FPRTableType:
    COMPANY_OWNED = "companyOwned"
    FRANCHISED = "franchised"
    COMBINED = "combined"
    UNKNOWN = "unknown"


def classify_fpr_table(rows: List[List[str]], header_text: str = "") -> str:
    """Classify an FPR table as company-owned, franchised, or combined."""
    combined = (header_text + " " + " ".join(
        " ".join(r) for r in rows[:8] if r
    )).lower()

    # Combined / all / systemwide signals
    if any(kw in combined for kw in [
        "all restaurants", "all cupbop", "all units", "all outlets",
        "combined", "systemwide", "system-wide", "table 3",
        "company-owned restaurants\nand franchise",
        "company-owned\nand franchise",
    ]):
        return FPRTableType.COMBINED

    # Company-owned signals
    if any(kw in combined for kw in [
        "company-owned", "company owned", "corporate",
        "table 1", "mcopco",
    ]):
        return FPRTableType.COMPANY_OWNED

    # Franchised signals
    if any(kw in combined for kw in [
        "franchise restaurant", "franchised restaurant",
        "franchise locations", "table 2",
    ]):
        return FPRTableType.FRANCHISED

    return FPRTableType.UNKNOWN


# ══════════════════════════════════════════════════════════════════
# DOLLAR / PERCENT PARSING
# ══════════════════════════════════════════════════════════════════

def parse_dollar(text: str) -> Optional[int]:
    """Parse a dollar amount like '$728,821' or '$ 728,821'."""
    m = re.search(r'\$\s*([\d,]+)', text.replace(" ", "").replace("\xa0", ""))
    if m:
        try:
            return int(m.group(1).replace(",", ""))
        except ValueError:
            pass
    # Try without $ sign for merged cells
    m = re.search(r'([\d,]{4,})', text.replace(" ", ""))
    if m:
        try:
            val = int(m.group(1).replace(",", ""))
            if val >= 10000:  # Sanity: must be a meaningful dollar amount
                return val
        except ValueError:
            pass
    return None


def parse_percent(text: str) -> Optional[float]:
    m = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
    if m:
        return float(m.group(1))
    return None


def parse_int_count(text: str) -> Optional[int]:
    """Parse a count like '50' or '26'."""
    m = re.search(r'\b(\d{1,5})\b', text.strip())
    if m:
        return int(m.group(1))
    return None


# ══════════════════════════════════════════════════════════════════
# TIER EXTRACTION
# ══════════════════════════════════════════════════════════════════

def extract_tiers_from_rows(rows: List[List[str]]) -> Tuple[Dict, List[Dict]]:
    """Extract overall metrics and tier buckets from FPR table rows.

    Returns (overall_dict, [tier_dicts]).
    """
    overall = {}
    tiers = []

    for row in rows:
        if not row or not any(c.strip() for c in row):
            continue

        cells = [c.strip() for c in row]
        row_text = " ".join(cells)

        # Skip header/description rows
        if any(kw in row_text.lower() for kw in [
            "gross revenue", "# of", "avg gross", "median gross",
            "high gross", "low gross", "stores", "revenue revenue",
        ]):
            if "greater than" not in row_text.lower() and "less than" not in row_text.lower():
                continue

        # Parse all dollar amounts from this row
        dollars = []
        for cell in cells:
            # Handle merged cells like "$728,821   $710,250   $1,585,417"
            for m in re.finditer(r'\$\s*([\d,]+)', cell):
                try:
                    dollars.append(int(m.group(1).replace(",", "")))
                except ValueError:
                    pass

        # Parse store count
        store_count = None
        for cell in cells:
            c = cell.strip()
            if re.match(r'^\d{1,4}$', c):
                store_count = int(c)
                break

        # Detect range label
        range_label = None
        for cell in cells:
            cl = cell.lower().strip()
            if "greater than" in cl or ">" in cl:
                range_label = ">" + re.sub(r'[^$\dK,]', '', cell).strip()
            elif "less than" in cl or "<" in cl:
                range_label = "<" + re.sub(r'[^$\dK,]', '', cell).strip()
            elif re.match(r'\$[\d,]+[Kk]?\s*[-–]\s*\$?[\d,]+[Kk]?', cl):
                range_label = cell.strip()
            elif re.match(r'[\d,]+[Kk]?\s*[-–]\s*[\d,]+[Kk]?', cl):
                range_label = "$" + cell.strip()

        # Determine if this is a tier row or overall/total row
        is_total_row = (
            store_count and store_count >= 20 and range_label is None and len(dollars) >= 2
        ) or (
            not range_label and len(dollars) >= 2 and store_count and store_count > 10
        )

        if is_total_row:
            # Overall row — usually the last data row with no range label
            overall["restaurants"] = store_count
            if len(dollars) >= 4:
                overall["avg"] = dollars[0]
                overall["median"] = dollars[1]
                overall["high"] = dollars[2]
                overall["low"] = dollars[3]
            elif len(dollars) >= 2:
                overall["avg"] = dollars[0]
                overall["median"] = dollars[1]
                if len(dollars) >= 3:
                    overall["high"] = dollars[2]
                if len(dollars) >= 4:
                    overall["low"] = dollars[3]

        elif range_label and dollars and store_count:
            # Tier row
            tier = {
                "range": range_label,
                "stores": store_count,
            }
            if len(dollars) >= 4:
                tier["avg"] = dollars[0]
                tier["median"] = dollars[1]
                tier["high"] = dollars[2]
                tier["low"] = dollars[3]
            elif len(dollars) >= 2:
                tier["avg"] = dollars[0]
                tier["median"] = dollars[1]
                if len(dollars) >= 3:
                    tier["high"] = dollars[2]
            elif len(dollars) == 1:
                tier["avg"] = dollars[0]
            tiers.append(tier)

    return overall, tiers


# ══════════════════════════════════════════════════════════════════
# META EXTRACTION (attainment, exclusions)
# ══════════════════════════════════════════════════════════════════

def extract_attainment(rows: List[List[str]], text_block: str = "") -> Dict:
    """Extract attainment percentages from FPR prose."""
    combined = text_block or " ".join(" ".join(r) for r in rows if r)
    result = {}

    avg_m = re.search(r'(\d+(?:\.\d+)?)\s*%\)?\s*(?:Restaurant|outlet|unit|store|location)s?\s+(?:represented|in the table).*?(?:attained|surpassed|exceeded).*?average', combined, re.IGNORECASE)
    if not avg_m:
        avg_m = re.search(r'(\d+(?:\.\d+)?)\s*(?:of\s+\d+\s+)?(?:\(or\s+)?(\d+(?:\.\d+)?)\s*%\)?.*?average', combined, re.IGNORECASE)
    if avg_m:
        pct = avg_m.group(2) if avg_m.lastindex and avg_m.lastindex >= 2 else avg_m.group(1)
        result["metOrExceededAvgPct"] = float(pct)

    med_m = re.search(r'(\d+(?:\.\d+)?)\s*%\)?\s*(?:Restaurant|outlet|unit|store|location)s?\s+(?:represented|in the table).*?(?:attained|surpassed|exceeded).*?median', combined, re.IGNORECASE)
    if not med_m:
        med_m = re.search(r'(\d+(?:\.\d+)?)\s*(?:of\s+\d+\s+)?(?:\(or\s+)?(\d+(?:\.\d+)?)\s*%\)?.*?median', combined, re.IGNORECASE)
    if med_m:
        pct = med_m.group(2) if med_m.lastindex and med_m.lastindex >= 2 else med_m.group(1)
        result["metOrExceededMedianPct"] = float(pct)

    return result


def extract_exclusions(text: str) -> Optional[str]:
    """Extract exclusion description from FPR prose."""
    m = re.search(
        r'(?:not\s+included|excluded?|are\s+not\s+included)[.:,]?\s*(.{10,200}?)(?:\.|$)',
        text, re.IGNORECASE
    )
    if m:
        return m.group(0).strip()[:200]

    # Alternative: "The X locations operating for less than..."
    m = re.search(
        r'(?:The\s+\d+\s+\w+\s+locations?\s+(?:operating|open).*?(?:not\s+included|are\s+not))',
        text, re.IGNORECASE | re.DOTALL
    )
    if m:
        return m.group(0).strip()[:200]

    return None


def extract_restaurant_count_from_prose(text: str) -> Optional[int]:
    """Extract restaurant count from FPR table prose header."""
    m = re.search(r'(?:all\s+)?(\d+)\s+(?:of\s+the\s+)?(?:company.?owned|franchise|restaurant|outlet|unit|store)', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None


# ══════════════════════════════════════════════════════════════════
# MAIN PARSER
# ══════════════════════════════════════════════════════════════════

def parse_fpr_tables_deep(tables: List, section_text: str = "") -> Dict[str, Any]:
    """Parse all Item 19 FPR tables into structured objects.

    Returns a dict with:
      - tables: list of classified table objects
      - top_level: overall metrics from the highest-precedence table
      - has_fpr: bool
      - flat_paths: dict of gold-compatible flattened paths
    """
    if not tables:
        return {"tables": [], "top_level": {}, "has_fpr": False, "flat_paths": {}}

    parsed_tables = []

    for table in tables:
        rows = table.rows if hasattr(table, 'rows') else []
        if not rows or len(rows) < 3:
            continue

        # Get header text from first few rows
        header_text = " ".join(" ".join(r) for r in rows[:8] if r)

        # Classify
        table_type = classify_fpr_table(rows, header_text)
        if table_type == FPRTableType.UNKNOWN:
            # Check if this is even an FPR table (has dollar amounts and range labels)
            row_text = " ".join(" ".join(r) for r in rows if r)
            if not re.search(r'\$\s*[\d,]{4,}', row_text):
                continue  # Not an FPR table

        # Extract overall + tiers
        overall, tiers = extract_tiers_from_rows(rows)

        # Extract attainment from prose in early rows
        prose = " ".join(" ".join(r) for r in rows[:10] if r)
        attainment = extract_attainment(rows, prose)

        # Extract exclusions
        excl = extract_exclusions(prose)

        # Extract restaurant count from prose if not from table
        if "restaurants" not in overall:
            count = extract_restaurant_count_from_prose(prose)
            if count:
                overall["restaurants"] = count

        parsed_table = {
            "table_type": table_type,
            "table_id": table.table_id if hasattr(table, 'table_id') else "",
            "overall": {
                "restaurants": overall.get("restaurants"),
                "overallAvg": overall.get("avg"),
                "overallMedian": overall.get("median"),
                "overallHigh": overall.get("high"),
                "overallLow": overall.get("low"),
                **attainment,
            },
            "tiers": tiers,
            "excludes": excl,
        }

        # Clean None values from overall
        parsed_table["overall"] = {
            k: v for k, v in parsed_table["overall"].items() if v is not None
        }

        parsed_tables.append(parsed_table)

    if not parsed_tables:
        return {"tables": [], "top_level": {}, "has_fpr": False, "flat_paths": {}}

    # ── SELECT TOP-LEVEL TABLE ──
    # Precedence: combined > franchised > company-owned > unknown
    PRECEDENCE = {
        FPRTableType.COMBINED: 0,
        FPRTableType.FRANCHISED: 1,
        FPRTableType.COMPANY_OWNED: 2,
        FPRTableType.UNKNOWN: 3,
    }
    sorted_tables = sorted(parsed_tables, key=lambda t: PRECEDENCE.get(t["table_type"], 9))
    top_table = sorted_tables[0]

    top_level = dict(top_table["overall"])
    top_level["source_table_type"] = top_table["table_type"]

    # ── BUILD FLAT PATHS (for gold scoring) ──
    flat_paths = {}
    flat_paths["hasItem19"] = True

    # Top-level overall from best table
    for k, v in top_level.items():
        if k != "source_table_type" and v is not None:
            flat_paths[k] = v

    # Per-table structured data
    table_key_map = {}
    for pt in parsed_tables:
        tt = pt["table_type"]
        if tt == FPRTableType.COMPANY_OWNED:
            key = "table1_companyOwned"
        elif tt == FPRTableType.FRANCHISED:
            key = "table2_franchised"
        elif tt == FPRTableType.COMBINED:
            key = "table3_combined"
        else:
            key = f"table_unknown_{len(table_key_map)}"
        table_key_map[pt["table_id"]] = key

        # Overall for this table
        for ok, ov in pt["overall"].items():
            if ov is not None:
                flat_paths[f"item19.{key}.{ok}"] = ov

        # Exclusions
        if pt.get("excludes"):
            flat_paths[f"item19.{key}.excludes"] = pt["excludes"]

        # Tiers
        for ti, tier in enumerate(pt["tiers"]):
            for tk, tv in tier.items():
                if tv is not None:
                    flat_paths[f"item19.{key}.tiers[{ti}].{tk}"] = tv

    return {
        "tables": parsed_tables,
        "top_level": top_level,
        "has_fpr": True,
        "flat_paths": flat_paths,
        "table_count": len(parsed_tables),
        "tier_count": sum(len(pt["tiers"]) for pt in parsed_tables),
    }
