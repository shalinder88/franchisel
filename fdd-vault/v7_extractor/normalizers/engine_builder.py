"""
Engine Builder — Phase 5 Normalization

Converts parsed item data into the Layer B normalized engines.
These are the universal backbone that reports and comparisons build from.

Engines:
  - initial_fee_engine (from Item 5)
  - ongoing_fee_engine (from Item 6)
  - initial_investment_engine (from Item 7)
  - supplier_restrictions_engine (from Item 8)
  - site_and_territory_engine (from Item 12)
  - training_support_engine (from Item 11)
  - technology_requirements_engine (from Item 11)
  - owner_participation_engine (from Item 15)
  - contract_burden_engine (from Item 17)
  - kill_switch_engine (from Items 8, 11, 12, 15, 17)
  - litigation_engine (from Item 3)
  - bankruptcy_engine (from Item 4)
  - item19_engine (from Item 19)
  - item20_engine (from Item 20)
  - financial_statement_engine (from Item 21 + exhibits)
  - document_package_engine (from Items 22-23)
  - state_override_engine (from state addenda)
"""

from typing import Dict, Any, List, Optional
from ..models import ItemSection, EvidenceStore, EvidenceState, Provenance
from ..engine_mapper import map_fee_table


def build_all_engines(items: Dict[int, ItemSection],
                      parsed_items: Dict[int, Dict],
                      exhibit_data: Dict[str, Any],
                      evidence: EvidenceStore) -> Dict[str, Any]:
    """Build all Layer B engines from parsed item data.

    parsed_items: dict of item_num → parsed data from item_parsers
    exhibit_data: parsed exhibit results
    evidence: the EvidenceStore to populate

    Returns dict of engine_name → engine data.
    """
    engines = {}

    # ── Item 5: Initial Fee Engine ──
    i5 = parsed_items.get(5, {})
    engines["initial_fee_engine"] = {
        "initial_franchise_fee": i5.get("initial_fee"),
        "development_fee": i5.get("development_fee"),
        "fee_table": i5.get("fee_rows", []),
    }
    if i5.get("initial_fee"):
        evidence.set("initialFranchiseFee", i5["initial_fee"], EvidenceState.PRESENT,
                     i5.get("provenance"))

    # ── Item 6: Ongoing Fee Engine ──
    # Use engine_mapper for row-level disambiguation (prevents royalty/ad double-count)
    i6 = parsed_items.get(6, {})
    fee_rows_raw = i6.get("fee_rows", [])
    fee_mapped = map_fee_table(fee_rows_raw) if fee_rows_raw else {}

    # engine_mapper produces disambiguated fields — use those over raw parser output
    royalty = fee_mapped.get("royalty_rate") or i6.get("royalty_rate")
    ad_fund = fee_mapped.get("ad_fund_rate") or i6.get("ad_fund_rate")

    engines["ongoing_fee_engine"] = {
        "royalty_rate": royalty,
        "ad_fund_rate": ad_fund,
        "technology_fee": fee_mapped.get("technology_fee_rate") or i6.get("technology_fee"),
        "transfer_fee": fee_mapped.get("transfer_fee") or i6.get("transfer_fee"),
        "renewal_fee": fee_mapped.get("renewal_fee") or i6.get("renewal_fee"),
        "fee_table": fee_rows_raw,
        "mapped_rows": fee_mapped.get("_mapped_rows", []),
        "unresolved_rows": fee_mapped.get("_unresolved_rows", []),
    }
    if royalty:
        evidence.set("royaltyRate", royalty, EvidenceState.PRESENT,
                     i6.get("provenance"))
    if ad_fund:
        evidence.set("marketingFundRate", ad_fund, EvidenceState.PRESENT,
                     i6.get("provenance"))

    # ── Item 7: Investment Engine ──
    i7 = parsed_items.get(7, {})
    # Parser returns line_items.value as list of dicts, each with is_total flag
    # Pick the FIRST total row (standard format) as primary, store all variants
    line_items_data = i7.get("line_items", {})
    all_items = line_items_data.get("value", []) if isinstance(line_items_data, dict) else []
    total_rows = [li for li in all_items if li.get("is_total") and li.get("amount")]

    inv_low = None
    inv_high = None
    all_totals = []

    for tr in total_rows:
        amt = tr.get("amount", {})
        lo = amt.get("low")
        hi = amt.get("high")
        single = amt.get("amount")
        if lo and hi:
            all_totals.append({"low": int(lo), "high": int(hi), "name": tr.get("name", "")})
        elif single:
            all_totals.append({"low": int(single), "high": int(single), "name": tr.get("name", "")})

    # Primary: pick the total with the HIGHEST range (standard format is usually the largest)
    if all_totals:
        primary = max(all_totals, key=lambda t: t["high"])
        inv_low = primary["low"]
        inv_high = primary["high"]

    line_items = i7.get("line_items", {})
    line_items_val = line_items.get("value", []) if isinstance(line_items, dict) else []

    engines["initial_investment_engine"] = {
        "investment_low": inv_low,
        "investment_high": inv_high,
        "all_totals": all_totals,
        "line_items": all_items,
        "format_variants": i7.get("format_variants", {}).get("value", []) if isinstance(i7.get("format_variants"), dict) else [],
    }
    if inv_low:
        evidence.set("totalInvestmentLow", inv_low, EvidenceState.PRESENT)
        evidence.set("totalInvestmentHigh", inv_high, EvidenceState.PRESENT)

    # ── Item 8: Supplier Engine ──
    i8 = parsed_items.get(8, {})
    engines["supplier_restrictions_engine"] = i8

    # ── Item 17: Contract/Kill-Switch Engine ──
    i17 = parsed_items.get(17, {})
    engines["contract_burden_engine"] = i17
    engines["kill_switch_engine"] = {
        "minimum_payments": i17.get("minimum_payments"),
        "sales_performance_requirement": i17.get("sales_performance"),
        "cure_period_days": i17.get("cure_period_days"),
        "immediate_termination_triggers": i17.get("immediate_termination"),
        "cross_default": i17.get("cross_default"),
        "noncompete_years": i17.get("noncompete_years"),
        "noncompete_miles": i17.get("noncompete_miles"),
        "spousal_guaranty": i17.get("spousal_guaranty"),
        "venue": i17.get("dispute_venue"),
    }

    # ── Item 19: FPR Engine ──
    i19 = parsed_items.get(19, {})
    engines["item19_engine"] = i19
    evidence.set("hasItem19", i19.get("has_fpr", False),
                 EvidenceState.PRESENT if "has_fpr" in i19 else EvidenceState.NOT_FOUND)
    if i19.get("average_revenue"):
        evidence.set("item19_avgRevenue", i19["average_revenue"], EvidenceState.PRESENT)

    # ── Item 20: Outlet Engine ──
    i20 = parsed_items.get(20, {})
    # Parser returns nested: total_outlets.value, total_franchised.value, etc.
    def _i20_val(key):
        entry = i20.get(key, {})
        return entry.get("value") if isinstance(entry, dict) else entry

    total_outlets = _i20_val("total_outlets")
    total_franchised = _i20_val("total_franchised")
    total_co = _i20_val("total_company_owned")

    # If total not found, is zero, or is less than its components, compute it
    computed_total = (total_franchised or 0) + (total_co or 0)
    if not total_outlets or total_outlets < computed_total:
        total_outlets = computed_total

    engines["item20_engine"] = {
        "total_end": total_outlets,
        "franchised_end": total_franchised,
        "co_end": total_co,
        "net_growth": (total_outlets or 0) - (_i20_val("total_outlets") or 0),  # placeholder
        "raw_parsed": {k: v for k, v in i20.items() if k != "outlet_tables"},
    }

    if total_outlets:
        evidence.set("totalUnits", total_outlets, EvidenceState.PRESENT)
    if total_franchised:
        evidence.set("franchisedUnits", total_franchised, EvidenceState.PRESENT)
    if total_co:
        evidence.set("companyOwnedUnits", total_co, EvidenceState.PRESENT)

    # ── Item 21 + Exhibits: Financial Statement Engine ──
    fin = exhibit_data.get("financials", {})
    engines["financial_statement_engine"] = fin
    if fin.get("hasAuditedFinancials"):
        evidence.set("hasAuditedFinancials", True, EvidenceState.PRESENT)

    # ── Other engines ──
    engines["litigation_engine"] = parsed_items.get(3, {})
    engines["bankruptcy_engine"] = parsed_items.get(4, {})
    engines["territory_engine"] = parsed_items.get(12, {})
    engines["training_support_engine"] = parsed_items.get(11, {})
    engines["owner_participation_engine"] = parsed_items.get(15, {})
    engines["document_package_engine"] = parsed_items.get(22, {})

    return engines
