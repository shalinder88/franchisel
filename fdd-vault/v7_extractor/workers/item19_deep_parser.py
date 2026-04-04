"""
Item 19 Deep FPR Parser — Extracts full cohort/tier structure from FPR tables.

Canonical targets:
  - hasItem19
  - overallAvg, overallMedian, overallHigh, overallLow
  - restaurants (unit count)
  - excludes (exclusion text)
  - metOrExceededAvgPct, metOrExceededMedianPct
  - tiers[]: range, stores, avg, median, high, low
  - richData (boolean: has detailed tier breakdown)
  - correctedFromNoFPR (if initially missed)

Table structures detected:
  - Range-bucketed tables (">$925K", "$725-925K", etc.)
  - Summary rows with overall avg/median/high/low
  - Attainment rows ("X of Y (or Z%) exceeded average")
  - Multi-table structures (company-owned, franchised, combined)
"""

import re
from typing import Any, Dict, List, Optional, Tuple


def parse_fpr_tables_deep(tables: List, text: str) -> Dict[str, Any]:
    """Parse all FPR tables into structured cohort objects.

    Returns a dict matching the gold structure:
    {
        "hasItem19": True,
        "richData": True/False,
        "tables": [
            {
                "table_id": "table1_companyOwned",
                "cohort_type": "company_owned" | "franchised" | "combined" | "all",
                "restaurants": 26,
                "excludes": "2 under 1 year, 1 seasonal...",
                "overallAvg": 794003,
                "overallMedian": 731325,
                "overallHigh": 1585417,
                "overallLow": 458400,
                "metOrExceededAvgPct": 38.4,
                "metOrExceededMedianPct": 50.0,
                "tiers": [
                    {"range": ">$925K", "stores": 7, "avg": 1112921, ...},
                    ...
                ]
            },
            ...
        ]
    }
    """
    result = {
        "hasItem19": False,
        "richData": False,
        "tables": [],
        "metric_definition": None,
        "disclaimer": None,
    }

    text_lower = text.lower()

    # Detect attainment/percentage patterns from surrounding text
    attainment_blocks = _extract_attainment_blocks(text)

    # Track which table index we're on for naming
    fpr_table_index = 0

    for table in tables:
        rows = table.rows if hasattr(table, 'rows') else []
        cols = table.columns if hasattr(table, 'columns') else []
        all_text = " ".join(" ".join(r) for r in rows if r).lower()

        # Skip non-FPR tables (outlet, transfer, state tables)
        if _is_outlet_table(rows, cols):
            continue
        if _is_transfer_table(rows, cols):
            continue
        if _is_state_table(rows, cols):
            continue

        # Check if this looks like an FPR table
        has_dollar = bool(re.search(r'\$\s*[\d,]{4,}', all_text))
        has_revenue_header = any(kw in all_text for kw in
                                  ["gross revenue", "avg gross", "median gross",
                                   "average", "net sales", "gross sales"])

        if not has_dollar and not has_revenue_header:
            continue

        # This is an FPR table
        result["hasItem19"] = True
        fpr_table_index += 1

        parsed_table = _parse_single_fpr_table(
            table, rows, text, attainment_blocks, fpr_table_index
        )
        if parsed_table:
            result["tables"].append(parsed_table)

    # Determine richData
    if result["tables"]:
        has_tiers = any(len(t.get("tiers", [])) > 1 for t in result["tables"])
        result["richData"] = has_tiers

    # Extract metric definition from notes
    result["metric_definition"] = _extract_metric_definition(text)

    # Extract disclaimer
    result["disclaimer"] = _extract_disclaimer(text)

    return result


def _parse_single_fpr_table(table, rows: List, full_text: str,
                              attainment_blocks: List[Dict],
                              table_index: int) -> Optional[Dict]:
    """Parse one FPR table into a structured object."""
    parsed = {
        "table_id": f"table{table_index}",
        "source_table_id": table.table_id if hasattr(table, 'table_id') else "",
        "cohort_type": "all",
        "restaurants": None,
        "excludes": None,
        "overallAvg": None,
        "overallMedian": None,
        "overallHigh": None,
        "overallLow": None,
        "metOrExceededAvgPct": None,
        "metOrExceededMedianPct": None,
        "tiers": [],
    }

    # Detect cohort type from surrounding text
    all_row_text = " ".join(" ".join(r) for r in rows if r).lower()
    text_before_table = full_text.lower()

    # Look for table number labels in rows
    for row in rows:
        row_text = " ".join(row).lower() if row else ""
        if "table 1" in row_text:
            parsed["table_id"] = f"table1"
        elif "table 2" in row_text:
            parsed["table_id"] = f"table2"
        elif "table 3" in row_text:
            parsed["table_id"] = f"table3"

    # Detect cohort type
    if any(kw in all_row_text for kw in ["company-owned", "company owned", "corporate"]):
        parsed["cohort_type"] = "company_owned"
        parsed["table_id"] += "_companyOwned"
    elif "franchise" in all_row_text and "all" not in all_row_text:
        parsed["cohort_type"] = "franchised"
        parsed["table_id"] += "_franchised"
    elif any(kw in all_row_text for kw in ["all cupbop", "all restaurants", "combined"]):
        parsed["cohort_type"] = "combined"
        parsed["table_id"] += "_combined"

    # Parse tiers and summary from rows
    tiers = []
    summary_row = None

    for row in rows:
        if not row or not any(c.strip() for c in row):
            continue
        row_text = " ".join(row)
        row_lower = row_text.lower()

        # Skip header/label rows
        if any(kw in row_lower for kw in ["gross revenue", "# of", "avg gross",
                                            "median gross", "high gross", "low gross",
                                            "table 1", "table 2", "table 3",
                                            "greater than", "franchise restaurant",
                                            "company-owned", "all cupbop",
                                            "the numbers in", "united states",
                                            "calendar year", "operating for",
                                            "item 19 note", "cupbop franchise",
                                            "disclosure document", "4916-"]):
            # But check for summary row pattern (total row with 2+ dollar amounts)
            dollars = _extract_dollars(row_text)
            if len(dollars) >= 2 and not any(kw in row_lower for kw in ["table", "the numbers"]):
                # Check for unit count (number without $)
                unit_match = re.search(r'(?<!\$)\b(\d{1,4})\b', row_text)
                if unit_match:
                    count = int(unit_match.group(1))
                    if 5 <= count <= 10000:
                        summary_row = {"count": count, "dollars": dollars}
            continue

        # Extract dollar amounts from row
        dollars = _extract_dollars(row_text)
        if not dollars:
            continue

        # Detect range label
        range_label = _extract_range_label(row)

        if range_label and len(dollars) >= 2:
            # This is a tier row
            tier = {"range": range_label, "stores": None}

            # Find store count (non-dollar number)
            nums = re.findall(r'(?<!\$)(?<!\$\s)\b(\d{1,4})\b', row_text)
            # Filter out numbers that are part of dollar amounts
            dollar_nums = set()
            for d in dollars:
                dollar_nums.add(str(int(d)))
            store_candidates = [int(n) for n in nums if n not in dollar_nums and 1 <= int(n) <= 500]
            if store_candidates:
                tier["stores"] = store_candidates[0]

            # Assign dollar amounts: avg, median, high, low
            if len(dollars) >= 4:
                tier["avg"] = int(dollars[0])
                tier["median"] = int(dollars[1])
                tier["high"] = int(dollars[2])
                tier["low"] = int(dollars[3])
            elif len(dollars) == 3:
                tier["avg"] = int(dollars[0])
                tier["median"] = int(dollars[1])
                tier["high"] = int(dollars[2])
            elif len(dollars) == 2:
                tier["avg"] = int(dollars[0])
                tier["median"] = int(dollars[1])

            tiers.append(tier)
        elif len(dollars) >= 2 and not range_label:
            # Possible summary row
            unit_candidates = re.findall(r'(?<!\$)\b(\d{1,4})\b', row_text)
            dollar_nums = {str(int(d)) for d in dollars}
            units = [int(n) for n in unit_candidates if n not in dollar_nums and 5 <= int(n) <= 10000]
            if units:
                summary_row = {"count": units[0], "dollars": dollars}

    parsed["tiers"] = tiers

    # Fill summary from summary row
    if summary_row:
        parsed["restaurants"] = summary_row["count"]
        d = summary_row["dollars"]
        if len(d) >= 4:
            parsed["overallAvg"] = int(d[0])
            parsed["overallMedian"] = int(d[1])
            parsed["overallHigh"] = int(d[2])
            parsed["overallLow"] = int(d[3])
        elif len(d) >= 2:
            parsed["overallAvg"] = int(d[0])
            parsed["overallMedian"] = int(d[1])
    elif tiers:
        # Compute from tiers
        all_highs = [t["high"] for t in tiers if t.get("high")]
        all_lows = [t["low"] for t in tiers if t.get("low")]
        total_stores = sum(t.get("stores", 0) for t in tiers if t.get("stores"))
        if all_highs:
            parsed["overallHigh"] = max(all_highs)
        if all_lows:
            parsed["overallLow"] = min(all_lows)
        if total_stores:
            parsed["restaurants"] = total_stores

    # Match attainment from text blocks
    for block in attainment_blocks:
        # Match by restaurant count
        if parsed["restaurants"] and block.get("total") == parsed["restaurants"]:
            parsed["metOrExceededAvgPct"] = block.get("avg_pct")
            parsed["metOrExceededMedianPct"] = block.get("median_pct")
            break

    # Extract exclusions from surrounding text
    parsed["excludes"] = _extract_exclusions_for_table(full_text, parsed)

    return parsed


def _extract_dollars(text: str) -> List[float]:
    """Extract all dollar amounts from text."""
    matches = re.findall(r'\$\s*([\d,]+(?:\.\d{2})?)', text)
    return [float(m.replace(",", "")) for m in matches if float(m.replace(",", "")) >= 1000]


def _extract_range_label(row: List[str]) -> Optional[str]:
    """Extract range bucket label like ">$925K", "$725-925K", "<$600K"."""
    row_text = " ".join(row) if row else ""

    # Patterns for range labels
    patterns = [
        r'[Gg]reater\s+than\s*\n?\s*\$\s*([\d,]+)K?',
        r'>\s*\$\s*([\d,]+)K?',
        r'\$\s*([\d,]+)K?\s*[-–]\s*\$?\s*([\d,]+)K?',
        r'[Ll]ess\s+than\s+\$\s*([\d,]+)K?',
        r'<\s*\$\s*([\d,]+)K?',
    ]

    for cell in row:
        cell_stripped = cell.strip()
        if not cell_stripped:
            continue

        # "Greater than" / ">" patterns
        m = re.search(r'[Gg]reater\s+than', cell_stripped)
        if m:
            return cell_stripped.strip()

        # "$XXX-$YYY" range patterns
        m = re.search(r'\$\s*([\d,]+)K?\s*[-–]\s*\$?\s*([\d,]+)K?', cell_stripped)
        if m:
            return cell_stripped.strip()

        # "Less than" / "<" patterns
        m = re.search(r'[Ll]ess\s+than', cell_stripped)
        if m:
            return cell_stripped.strip()

        # Direct dollar range like "$925K"
        if re.match(r'^\$\s*[\d,]+K?$', cell_stripped):
            return cell_stripped.strip()

    return None


def _extract_attainment_blocks(text: str) -> List[Dict]:
    """Extract "X of Y (or Z%) attained or surpassed" blocks."""
    blocks = []
    pattern = r'(\d+)\s+of\s+(\d+)\s+\(or\s+([\d.]+)%\)\s+[Rr]estaurants.*?(?:attained|surpassed|exceeded)\s+.*?(?:average|mean)'
    for m in re.finditer(pattern, text, re.DOTALL):
        count = int(m.group(1))
        total = int(m.group(2))
        pct = float(m.group(3))

        # Also look for median attainment nearby
        median_pct = None
        rest = text[m.end():m.end() + 200]
        med_m = re.search(r'(\d+)\s+of\s+\d+\s+\(or\s+([\d.]+)%\).*?(?:median)', rest)
        if med_m:
            median_pct = float(med_m.group(2))

        blocks.append({
            "count": count,
            "total": total,
            "avg_pct": pct,
            "median_pct": median_pct,
        })

    return blocks


def _extract_exclusions_for_table(text: str, parsed: Dict) -> Optional[str]:
    """Extract exclusion text like "6 under 1 year, 3 closed before Dec 31"."""
    text_lower = text.lower()

    # Look for exclusion patterns
    patterns = [
        r'(\d+)\s+(?:franchise[d]?\s+)?(?:location|restaurant|outlet|unit)s?\s+(?:operating\s+)?(?:for\s+)?less\s+than\s+(?:one\s+full\s+)?(?:calendar\s+)?year',
        r'(\d+)\s+(?:franchise[d]?\s+)?(?:location|restaurant)s?\s+(?:that\s+)?closed\s+before',
        r'(?:not\s+included|excluded)[^.]{0,200}',
    ]

    exclusion_parts = []
    for pattern in patterns:
        for m in re.finditer(pattern, text_lower):
            part = m.group(0)[:100].strip()
            if part and part not in exclusion_parts:
                exclusion_parts.append(part)

    if exclusion_parts:
        return ", ".join(exclusion_parts)
    return None


def _extract_metric_definition(text: str) -> Optional[str]:
    """Extract the "Gross Revenues" definition from notes."""
    m = re.search(
        r'["\u201c]?\s*[Gg]ross\s+[Rr]evenues?\s*["\u201d]?\s*means?\s+([^.]+\.)',
        text
    )
    if m:
        return m.group(0)[:300]
    return None


def _extract_disclaimer(text: str) -> Optional[str]:
    """Extract the universal FPR disclaimer."""
    patterns = [
        r'[Ss]ome\s+outlets?\s+have\s+(?:sold|earned)[^.]+\.',
        r'[Yy]our\s+individual\s+results\s+may\s+(?:differ|vary)[^.]*\.',
        r'[Tt]here\s+is\s+no\s+assurance[^.]+\.',
    ]
    for p in patterns:
        m = re.search(p, text)
        if m:
            return m.group(0)[:200]
    return None


def _is_outlet_table(rows: List, cols: List) -> bool:
    """Check if this is an outlet history table (Item 20), not FPR."""
    all_text = " ".join(" ".join(r) for r in rows if r).lower()
    col_text = " ".join(cols).lower() if cols else ""
    combined = f"{col_text} {all_text}"
    return any(kw in combined for kw in
               ["start of the year", "end of the year", "net change",
                "termina", "non-renew", "reacquir", "ceased operation",
                "outlet type"])


def _is_transfer_table(rows: List, cols: List) -> bool:
    col_text = " ".join(cols).lower() if cols else ""
    return "number of transfers" in col_text


def _is_state_table(rows: List, cols: List) -> bool:
    all_text = " ".join(" ".join(r) for r in rows if r).lower()
    col_text = " ".join(cols).lower() if cols else ""
    combined = f"{col_text} {all_text}"
    if "state" in combined and any(s in combined for s in ["arizona", "california", "colorado", "utah", "texas", "nevada"]):
        if "outlet" in combined or "franchise" in combined:
            return True
    return False
