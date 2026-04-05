"""
Deep Outlet Parser — Sprint 2

Parses Item 20 tables into structured outlet objects.

Table families:
  - systemwide_summary: Franchised/Company/Total by year (start, end, netChange)
  - franchised_state: state-level franchised detail
  - company_state: state-level company-owned detail
  - transfers: state-level transfer counts
  - projected_openings: signed-not-opened, projected openings
  - franchisee_lists: current/former list exhibit linkage

Year-aware: detects years in tables, identifies latest year,
maps latest-year to top-level canonical fields.

Separation rules:
  - Transfers separate from closures
  - Reacquisitions separate from terminations/non-renewals/ceased-other
  - Projected openings separate from signed-not-opened
"""

import re
from typing import Any, Dict, List, Optional, Tuple
from enum import Enum


class OutletTableFamily(str, Enum):
    SYSTEMWIDE_SUMMARY = "systemwide_summary"
    FRANCHISED_STATE = "franchised_state"
    COMPANY_STATE = "company_state"
    TRANSFERS = "transfers"
    PROJECTED = "projected_openings"
    FRANCHISEE_LIST = "franchisee_list"
    UNKNOWN = "unknown"


# ══════════════════════════════════════════════════════════════════
# TABLE CLASSIFICATION
# ════════════════════════════���═════════════════════════════════════

def classify_outlet_table(table) -> OutletTableFamily:
    """Classify an outlet table into a family."""
    cols = " ".join(table.columns).lower() if hasattr(table, 'columns') and table.columns else ""
    rows_text = " ".join(" ".join(r) for r in (table.rows[:5] if hasattr(table, 'rows') else []) if r).lower()
    combined = cols + " " + rows_text

    # Systemwide summary: has "Outlet Type" or Franchised/Company/Total rows with start/end
    if ("outlet type" in combined or "total outlets" in combined) and "net change" in combined:
        return OutletTableFamily.SYSTEMWIDE_SUMMARY
    if "franchised" in combined and "company" in combined and "total" in combined:
        if "start" in combined or "end of" in combined or "net" in combined:
            return OutletTableFamily.SYSTEMWIDE_SUMMARY

    # Transfer table: has "transfer" in columns or header
    if "transfer" in cols or "number of transfers" in combined:
        return OutletTableFamily.TRANSFERS

    # Projected openings
    if "projected" in combined or "signed" in combined and "not" in combined and "open" in combined:
        return OutletTableFamily.PROJECTED

    # State-level tables: has state names and year columns
    has_states = bool(re.search(r'\b(?:alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming|total)\b', combined))

    if has_states:
        # Company-owned: has "re-acquired" or "sold to franchisees" columns
        if "re-acquired" in combined or "reacquir" in combined or "sold to franchisee" in combined:
            return OutletTableFamily.COMPANY_STATE
        # Franchised: has terminations/non-renewals columns
        if "terminat" in combined or "non-renew" in combined or "ceased" in combined:
            return OutletTableFamily.FRANCHISED_STATE
        # Generic state table — classify by column structure
        if "opened" in combined:
            col_text = cols
            if "reacquir" in col_text or "sold to" in col_text:
                return OutletTableFamily.COMPANY_STATE
            return OutletTableFamily.FRANCHISED_STATE

    return OutletTableFamily.UNKNOWN


# ══════════════════════════════════════════════════════════════════
# SYSTEMWIDE SUMMARY PARSER
# ���══════════════════════���══════════════════════════════════════════

def parse_systemwide_summary(table) -> Dict[str, Any]:
    """Parse the systemwide outlet summary table.

    Returns: {
      "franchised": {2022: {start, end, netChange}, 2023: {...}, ...},
      "companyOwned": {2022: {...}, ...},
      "total": {2022: {...}, ...},
      "latestYear": 2024,
    }
    """
    result = {"franchised": {}, "companyOwned": {}, "total": {}}
    rows = table.rows if hasattr(table, 'rows') else []

    current_type = None
    for row in rows:
        if not row or not any(c.strip() for c in row):
            continue
        cells = [c.strip() for c in row]
        row_text = " ".join(cells).lower()

        # Detect outlet type
        if "franchised" in row_text and "company" not in row_text:
            current_type = "franchised"
        elif "company" in row_text:
            current_type = "companyOwned"
        elif "total" in row_text and "outlet" in row_text:
            current_type = "total"

        # Extract year row
        year_match = re.search(r'\b(20\d{2})\b', row_text)
        if year_match and current_type:
            year = int(year_match.group(1))
            # Find numeric values
            nums = []
            for c in cells:
                c_clean = c.replace("+", "").replace(",", "").strip()
                if re.match(r'^-?\d+$', c_clean):
                    nums.append(int(c_clean))

            if len(nums) >= 3:
                entry = {
                    "start": nums[0],
                    "end": nums[1],
                    "netChange": nums[2] if len(nums) > 2 else nums[1] - nums[0],
                }
                result[current_type][year] = entry
            elif len(nums) == 2:
                result[current_type][year] = {
                    "start": nums[0],
                    "end": nums[1],
                    "netChange": nums[1] - nums[0],
                }

    # Detect latest year
    all_years = set()
    for bucket in result.values():
        if isinstance(bucket, dict):
            all_years.update(k for k in bucket.keys() if isinstance(k, int))
    result["latestYear"] = max(all_years) if all_years else None

    return result


# ═════════════════════════════���════════════════════════════════════
# STATE-LEVEL TABLE PARSER
# ══════════���════════════════════════════════��══════════════════════

def parse_state_table(table, family: OutletTableFamily) -> Dict[str, Any]:
    """Parse a state-level outlet table.

    Returns: {
      "states": {
        "Utah": {2022: {start, opened, terminated, ...}, 2023: {...}},
        "Idaho": {...},
      },
      "totals": {2022: {...}, 2023: {...}, 2024: {...}},
      "latestYear": 2024,
    }
    """
    result = {"states": {}, "totals": {}}
    rows = table.rows if hasattr(table, 'rows') else []
    cols = table.columns if hasattr(table, 'columns') else []

    # Detect column mapping from headers
    col_map = _detect_column_mapping(cols, family)

    current_state = None
    for row in rows:
        if not row or not any(c.strip() for c in row):
            continue
        cells = [c.strip() for c in row]

        # Detect state name
        first_cell = cells[0].strip() if cells else ""
        if first_cell and not first_cell.isdigit() and first_cell not in ("", "Total"):
            if re.match(r'^[A-Z][a-z]', first_cell) or first_cell in ("Total",):
                current_state = first_cell

        if first_cell == "Total":
            current_state = "Total"

        # Extract year
        year = None
        for c in cells:
            m = re.match(r'^(20\d{2})$', c.strip())
            if m:
                year = int(m.group(1))
                break

        if not year or not current_state:
            continue

        # Extract numeric values
        nums = []
        for c in cells:
            c_clean = c.replace(",", "").replace("+", "").strip()
            if re.match(r'^-?\d+$', c_clean):
                nums.append(int(c_clean))

        # Build entry from column mapping
        entry = _build_entry_from_nums(nums, col_map, family)

        if current_state == "Total":
            result["totals"][year] = entry
        else:
            if current_state not in result["states"]:
                result["states"][current_state] = {}
            result["states"][current_state][year] = entry

    all_years = set()
    for bucket in [result["totals"]] + list(result["states"].values()):
        all_years.update(k for k in bucket.keys() if isinstance(k, int))
    result["latestYear"] = max(all_years) if all_years else None

    return result


def _detect_column_mapping(cols: List[str], family: OutletTableFamily) -> List[str]:
    """Detect what each column represents."""
    col_text = " ".join(cols).lower()

    if family == OutletTableFamily.FRANCHISED_STATE:
        # Typical: State, Year, Start, Opened, Terminated, Non-Renewed, Reacquired, Ceased-Other, End
        return ["state", "year", "start", "opened", "terminated", "nonRenewed",
                "reacquiredByFranchisor", "ceasedOther", "end"]
    elif family == OutletTableFamily.COMPANY_STATE:
        # Typical: State, Year, Start, Opened, Reacquired, Closed, SoldToFranchisee, End
        return ["state", "year", "start", "opened", "reacquiredFromFranchisees",
                "closed", "soldToFranchisees", "end"]
    else:
        return ["state", "year", "start", "opened", "end"]


def _build_entry_from_nums(nums: List[int], col_map: List[str],
                            family: OutletTableFamily) -> Dict[str, int]:
    """Map numeric values to named fields based on column mapping."""
    entry = {}
    # Skip state and year columns (not numeric), map rest
    numeric_fields = [f for f in col_map if f not in ("state", "year")]

    for i, val in enumerate(nums):
        if i < len(numeric_fields):
            entry[numeric_fields[i]] = val

    # Compute netChange if we have start and end
    if "start" in entry and "end" in entry:
        entry["netChange"] = entry["end"] - entry["start"]

    return entry


# ══════════════════════════════��═══════════════════════════════════
# TRANSFER TABLE PARSER
# ═══════���══════════════════���═════════════════════════════════���═════

def parse_transfer_table(table) -> Dict[str, Any]:
    """Parse the transfer table. Transfers are their own family."""
    result = {"states": {}, "totals": {}}
    rows = table.rows if hasattr(table, 'rows') else []

    current_state = None
    for row in rows:
        if not row or not any(c.strip() for c in row):
            continue
        cells = [c.strip() for c in row]
        first = cells[0].strip() if cells else ""

        if first and not first.isdigit() and first != "":
            current_state = first

        year = None
        count = None
        for c in cells:
            if re.match(r'^20\d{2}$', c.strip()):
                year = int(c.strip())
            elif re.match(r'^\d+$', c.strip()):
                count = int(c.strip())

        if year is not None and count is not None and current_state:
            if current_state == "Total":
                result["totals"][year] = count
            else:
                if current_state not in result["states"]:
                    result["states"][current_state] = {}
                result["states"][current_state][year] = count

    return result


# ═══════════════���══════════════════════════════════════════════════
# PROJECTED OPENINGS PARSER
# ════════════���═════════════════════════════��═══════════════════════

def parse_projected_openings(text: str) -> Dict[str, Any]:
    """Extract projected openings and signed-not-opened from narrative."""
    result = {}

    # Signed not opened
    m = re.search(r'(\d+)\s+(?:franchise\s+)?(?:agreement|outlet)s?\s+(?:signed|executed)\s+(?:but\s+)?(?:not\s+(?:yet\s+)?opened|pending)', text, re.IGNORECASE)
    if m:
        result["signedNotOpened"] = int(m.group(1))

    # Projected openings
    m = re.search(r'(?:project|estimat|plan|expect)\w*\s+(?:to\s+)?(?:open|add)\s+(?:approximately\s+)?(\d+)', text, re.IGNORECASE)
    if m:
        result["projectedOpenings"] = int(m.group(1))

    # Franchise projected
    m = re.search(r'(?:project|estimat)\w*\s+(?:to\s+)?(?:open|sell|grant)\s+(?:approximately\s+)?(\d+)\s+(?:new\s+)?franchise', text, re.IGNORECASE)
    if m:
        result["projectedFranchisedOpenings"] = int(m.group(1))

    # Company projected
    m = re.search(r'(?:project|estimat)\w*\s+(?:to\s+)?(?:open)\s+(?:approximately\s+)?(\d+)\s+(?:new\s+)?company', text, re.IGNORECASE)
    if m:
        result["projectedCompanyOwnedOpenings"] = int(m.group(1))

    return result


# ══════════��═══════════════════════════════════════════════════════
# FRANCHISEE LIST LINKAGE
# ═���════════════════════════════════════════════════════════════════

def detect_franchisee_lists(text: str, exhibits: Dict) -> Dict[str, Any]:
    """Detect franchisee list exhibit references."""
    result = {
        "hasFranchiseeListCurrent": False,
        "hasFranchiseeListFormer": False,
        "currentExhibitCode": None,
        "formerExhibitCode": None,
    }

    # Check exhibits by role
    for code, ex in exhibits.items():
        role = ex.role.value if hasattr(ex, 'role') else ""
        if role == "franchisee_list":
            result["hasFranchiseeListCurrent"] = True
            result["currentExhibitCode"] = code
        elif role == "former_franchisee_list":
            result["hasFranchiseeListFormer"] = True
            result["formerExhibitCode"] = code

    # Also check text for references
    text_lower = text.lower()
    if "current franchisee" in text_lower or "list of franchisee" in text_lower:
        result["hasFranchiseeListCurrent"] = True
    if "former franchisee" in text_lower:
        result["hasFranchiseeListFormer"] = True

    return result


# ═══════════════════���════════════════════════════���═════════════════
# MAIN PARSER
# ══════════���══════════════════════════════════���════════════════════

def parse_outlet_tables_deep(tables: List, section_text: str = "",
                              exhibits: Dict = None,
                              all_items: Dict = None) -> Dict[str, Any]:
    """Parse all Item 20 outlet tables into structured objects.

    Also scans neighboring items for spilled outlet tables.
    """
    if exhibits is None:
        exhibits = {}

    # Collect all candidate outlet tables (including spills from nearby items)
    candidate_tables = list(tables)
    if all_items:
        for item_num in [19, 21]:  # Common spill targets
            sec = all_items.get(item_num)
            if sec and hasattr(sec, 'tables'):
                for t in sec.tables:
                    row_text = " ".join(" ".join(r) for r in t.rows[:5] if r).lower()
                    if any(kw in row_text for kw in ["outlet", "franchised", "company owned", "total outlets", "net change", "transfer"]):
                        if t not in candidate_tables:
                            candidate_tables.append(t)

    # Classify each table
    classified = []
    for t in candidate_tables:
        family = classify_outlet_table(t)
        classified.append((family, t))

    # Parse by family
    systemwide = {}
    franchised_state = {}
    company_state = {}
    transfers = {}
    all_state_tables = []

    for family, t in classified:
        if family == OutletTableFamily.SYSTEMWIDE_SUMMARY:
            systemwide = parse_systemwide_summary(t)
        elif family == OutletTableFamily.FRANCHISED_STATE:
            result = parse_state_table(t, family)
            franchised_state = _merge_state_data(franchised_state, result)
            all_state_tables.append(("franchised", result))
        elif family == OutletTableFamily.COMPANY_STATE:
            result = parse_state_table(t, family)
            company_state = _merge_state_data(company_state, result)
            all_state_tables.append(("company", result))
        elif family == OutletTableFamily.TRANSFERS:
            transfers = parse_transfer_table(t)

    # Parse projected openings from text
    projected = parse_projected_openings(section_text)

    # Detect franchisee list exhibits
    franchisee_lists = detect_franchisee_lists(section_text, exhibits)

    # Derive top-level canonical fields from latest year
    latest_year = systemwide.get("latestYear")
    if not latest_year:
        # Try from state tables
        for _, st in all_state_tables:
            if st.get("latestYear"):
                latest_year = st["latestYear"]
                break

    canonical = _build_canonical_fields(systemwide, franchised_state,
                                          company_state, latest_year,
                                          projected, franchisee_lists, transfers)

    return {
        "hasItem20": bool(systemwide or franchised_state or company_state),
        "systemwide": systemwide,
        "franchisedState": franchised_state,
        "companyOwnedState": company_state,
        "transfers": transfers,
        "projected": projected,
        "franchiseeLists": franchisee_lists,
        "canonical": canonical,
        "latestYear": latest_year,
        "tableCount": len(classified),
        "tableFamilies": [f.value for f, _ in classified],
    }


def _merge_state_data(existing: Dict, new: Dict) -> Dict:
    """Merge state table data from continuation tables."""
    if not existing:
        return new
    for state, years in new.get("states", {}).items():
        if state not in existing.get("states", {}):
            if "states" not in existing:
                existing["states"] = {}
            existing["states"][state] = years
        else:
            existing["states"][state].update(years)
    for year, vals in new.get("totals", {}).items():
        if "totals" not in existing:
            existing["totals"] = {}
        if year not in existing["totals"]:
            existing["totals"][year] = vals
    if new.get("latestYear"):
        existing["latestYear"] = max(
            existing.get("latestYear") or 0,
            new["latestYear"]
        )
    return existing


def _build_canonical_fields(systemwide: Dict, franchised_state: Dict,
                              company_state: Dict, latest_year: Optional[int],
                              projected: Dict, franchisee_lists: Dict,
                              transfers: Dict) -> Dict[str, Any]:
    """Build top-level canonical fields from parsed outlet data."""
    canonical = {}

    if not latest_year:
        return canonical

    # From systemwide summary
    fran = systemwide.get("franchised", {}).get(latest_year, {})
    comp = systemwide.get("companyOwned", {}).get(latest_year, {})
    total = systemwide.get("total", {}).get(latest_year, {})

    if fran.get("end"):
        canonical["currentFranchisedOutlets"] = fran["end"]
    if comp.get("end"):
        canonical["currentCompanyOwnedOutlets"] = comp["end"]
    if total.get("end"):
        canonical["currentTotalOutlets"] = total["end"]
    elif fran.get("end") and comp.get("end"):
        canonical["currentTotalOutlets"] = fran["end"] + comp["end"]

    # Net change
    if total.get("netChange") is not None:
        canonical["outletNetChangeLatestYear"] = total["netChange"]
        canonical["outletsWentUpDown"] = "up" if total["netChange"] > 0 else "down" if total["netChange"] < 0 else "flat"
    elif fran.get("netChange") is not None and comp.get("netChange") is not None:
        net = fran["netChange"] + comp["netChange"]
        canonical["outletNetChangeLatestYear"] = net
        canonical["outletsWentUpDown"] = "up" if net > 0 else "down" if net < 0 else "flat"

    # Fallback: if no systemwide, use state table totals
    if not canonical.get("currentFranchisedOutlets"):
        fran_totals = franchised_state.get("totals", {}).get(latest_year, {})
        if fran_totals.get("end"):
            canonical["currentFranchisedOutlets"] = fran_totals["end"]
    if not canonical.get("currentCompanyOwnedOutlets"):
        comp_totals = company_state.get("totals", {}).get(latest_year, {})
        if comp_totals.get("end"):
            canonical["currentCompanyOwnedOutlets"] = comp_totals["end"]

    # Compute total if not set
    if not canonical.get("currentTotalOutlets"):
        f = canonical.get("currentFranchisedOutlets", 0)
        c = canonical.get("currentCompanyOwnedOutlets", 0)
        if f or c:
            canonical["currentTotalOutlets"] = f + c

    # Projected openings
    canonical.update(projected)

    # Franchisee lists
    canonical.update(franchisee_lists)

    # Transfers (latest year total)
    if transfers.get("totals", {}).get(latest_year) is not None:
        canonical["transfersLatestYear"] = transfers["totals"][latest_year]

    # Signed not opened
    if "signedNotOpened" not in canonical:
        canonical["signedNotOpened"] = 0  # Default if not mentioned

    return canonical
