"""
Engine Builder — Phase 5 Normalization

Converts parsed item data into Layer B normalized engines.
These are the universal backbone that reports and comparisons build from.

Rule: Parser outputs are envelopes. Engine outputs are normalized values.
Never pass parser envelopes directly into brand JSON.
"""

import re
from typing import Dict, Any, List, Optional
from ..models import ItemSection, EvidenceStore, EvidenceState, Provenance
from ..engine_mapper import map_fee_table


# ══════════════════════════════════════════════════════════════════════════════
# SHARED UNWRAP HELPERS
# Parser outputs wrap values in {"value": X, "state": "present", "provenance": {...}}
# These extract X. If obj is already a plain value, returns it directly.
# ══════���═════════════════════════════���═════════════════════════════��═══════════

def _pv(obj, default=None):
    """Parser value unwrap: parser envelope -> raw value."""
    if obj is None:
        return default
    if isinstance(obj, dict) and "value" in obj:
        val = obj.get("value")
        return val if val is not None else default
    return obj


def _pstate(obj, default="missing"):
    """Extract state from parser envelope."""
    if isinstance(obj, dict):
        return obj.get("state", default)
    return default


def _plist(obj):
    """Unwrap and ensure list."""
    v = _pv(obj, default=[])
    return v if isinstance(v, list) else []


def _pdict(obj):
    """Unwrap and ensure dict."""
    v = _pv(obj, default={})
    return v if isinstance(v, dict) else {}


def _coerce_fee_rows(rows):
    """Ensure fee rows are list of list[str] for map_fee_table."""
    if not isinstance(rows, list):
        return []
    cleaned = []
    for row in rows:
        if isinstance(row, list):
            cleaned.append(row)
        elif isinstance(row, dict):
            # Parser may wrap rows as {"raw_cells": [...], ...}
            raw = row.get("raw_cells")
            if isinstance(raw, list):
                cleaned.append(raw)
    return cleaned


# ══════��══════════════════════��═════════════════════════════���══════════════════
# MAIN ENGINE BUILDER
# ══════════════════════════════════════════════════════════════════════════════

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
    initial_fee = _pv(i5.get("initial_fee"))
    dev_fee = _pv(i5.get("development_fee"))

    # Fallback: parser produces "franchise_fee" with {low, high} or {amount}
    if not initial_fee:
        ff = _pv(i5.get("franchise_fee"))
        if isinstance(ff, dict):
            initial_fee = int(ff.get("high") or ff.get("amount") or 0) or None
        elif isinstance(ff, (int, float)) and ff > 0:
            initial_fee = int(ff)

    engines["initial_fee_engine"] = {
        "initial_franchise_fee": initial_fee,
        "development_fee": dev_fee,
        "fee_table": _plist(i5.get("fee_rows")),
    }
    if initial_fee:
        evidence.set("initialFranchiseFee", initial_fee, EvidenceState.PRESENT)

    # ── Item 6: Ongoing Fee Engine ──
    # Unwrap ALL parser envelopes first. Never pass envelopes to brand output.
    # General rule: when Items 5+6 share a page, Item 5's fee_rows may contain
    # ongoing fees (royalty, rent) that belong to Item 6. Check both.
    i6 = parsed_items.get(6, {})
    fee_rows_raw = _plist(i6.get("fee_rows"))

    # General rule: ALWAYS check Item 5 fee_rows for ongoing fees that spilled
    # onto a shared page. McDonald's has Royalty+Rent on page 18 (Item 5's section)
    # while Item 6's tables start on page 19 with only advertising/tech fees.
    i5_rows = _plist(i5.get("fee_rows"))
    for row in i5_rows:
        raw = row.get("raw_cells", []) if isinstance(row, dict) else row
        if isinstance(raw, list):
            row_text = " ".join(str(c) for c in raw).lower()
            if any(kw in row_text for kw in ["royalt", "% of gross", "% of net", "rent", "advertis", "marketing"]):
                fee_rows_raw.append(row)

    fee_rows_clean = _coerce_fee_rows(fee_rows_raw)

    # Run through engine_mapper for disambiguation
    fee_mapped = map_fee_table(fee_rows_clean) if fee_rows_clean else {}

    # Extract clean scalar values — mapper first, then fallback to parser
    royalty = fee_mapped.get("royalty_rate")
    if not royalty:
        r = _pv(i6.get("royalty_rate"))
        if isinstance(r, str): royalty = r
        elif isinstance(r, dict) and r.get("percent"): royalty = f"{r['percent']}%"

    ad_fund = fee_mapped.get("ad_fund_rate")
    if not ad_fund:
        a = _pv(i6.get("ad_fund_rate"))
        if isinstance(a, str): ad_fund = a
        elif isinstance(a, dict) and a.get("percent"): ad_fund = f"{a['percent']}%"

    engines["ongoing_fee_engine"] = {
        "royalty_rate": royalty,
        "ad_fund_rate": ad_fund,
        "technology_fee": fee_mapped.get("technology_fee_rate"),
        "transfer_fee": fee_mapped.get("transfer_fee"),
        "renewal_fee": fee_mapped.get("renewal_fee"),
        "fees": fee_mapped.get("_mapped_rows", []),
    }

    if royalty:
        evidence.set("royaltyRate", royalty, EvidenceState.PRESENT)
    if ad_fund:
        evidence.set("marketingFundRate", ad_fund, EvidenceState.PRESENT)

    # ── Item 7: Investment Engine ──
    i7 = parsed_items.get(7, {})
    all_items_list = _plist(i7.get("line_items"))
    total_rows = [li for li in all_items_list if li.get("is_total") and li.get("amount")]

    inv_low = None
    inv_high = None
    all_totals = []
    for tr in total_rows:
        amt = tr.get("amount", {})
        lo = amt.get("low")
        hi = amt.get("high")
        single = amt.get("amount")
        name = tr.get("name", "")
        if lo and hi:
            all_totals.append({"low": int(lo), "high": int(hi), "name": name})
        elif single:
            all_totals.append({"low": int(single), "high": int(single), "name": name})

    # Pick primary investment: standard/traditional format first, then largest
    # General rule: multi-format brands have multiple TOTAL rows. Rank by format role:
    #   1. standard/traditional (primary offering)
    #   2. largest range (if no format info available)
    #   3. first TOTAL row found
    if all_totals:
        # Look for standard/traditional format first
        standard_names = ["standard", "traditional", ""]  # empty name = likely the first/primary table
        primary = None
        for name_match in standard_names:
            for t in all_totals:
                t_name = t.get("name", "").lower()
                if name_match and name_match in t_name:
                    primary = t
                    break
                elif not name_match and not t_name:
                    primary = t
                    break
            if primary:
                break
        # Fallback: pick largest range
        if not primary:
            primary = max(all_totals, key=lambda t: t["high"])
        inv_low = primary["low"]
        inv_high = primary["high"]

    engines["initial_investment_engine"] = {
        "investment_low": inv_low,
        "investment_high": inv_high,
        "all_totals": all_totals,
        "line_items": all_items_list,
        "format_variants": _plist(i7.get("format_variants")),
    }
    if inv_low:
        evidence.set("totalInvestmentLow", inv_low, EvidenceState.PRESENT)
        evidence.set("totalInvestmentHigh", inv_high, EvidenceState.PRESENT)

    # ── Item 8: Supplier Engine ──
    i8 = parsed_items.get(8, {})
    engines["supplier_restrictions_engine"] = {k: _pv(v) for k, v in i8.items()}

    # ── Item 17: Contract/Kill-Switch Engine ──
    i17 = parsed_items.get(17, {})
    contract = {k: _pv(v) for k, v in i17.items() if k != "item"}
    engines["contract_burden_engine"] = contract
    engines["kill_switch_engine"] = {
        "minimum_payments": contract.get("minimum_payments"),
        "sales_performance_requirement": contract.get("sales_performance"),
        "cure_period_days": contract.get("cure_period_days"),
        "immediate_termination_triggers": contract.get("immediate_termination"),
        "cross_default": contract.get("cross_default"),
        "noncompete_years": contract.get("noncompete_years"),
        "noncompete_miles": contract.get("noncompete_miles"),
        "spousal_guaranty": contract.get("spousal_guaranty"),
        "venue": contract.get("dispute_venue"),
    }

    # ── Item 19: FPR Engine ──
    i19 = parsed_items.get(19, {})
    has_fpr = _pv(i19.get("has_fpr"), False)
    avg_rev = _pv(i19.get("average_revenue"))
    median_rev = _pv(i19.get("median_revenue"))
    high_rev = _pv(i19.get("highest_unit_revenue"))
    low_rev = _pv(i19.get("lowest_unit_revenue"))
    fpr_unit_count = _pv(i19.get("fpr_unit_count"))
    engines["item19_engine"] = {k: _pv(v) for k, v in i19.items() if k != "item"}
    evidence.set("hasItem19", has_fpr, EvidenceState.PRESENT if "has_fpr" in i19 else EvidenceState.NOT_FOUND)
    if avg_rev:
        evidence.set("item19_avgRevenue", avg_rev, EvidenceState.PRESENT)
    if median_rev:
        evidence.set("medianGrossSales", median_rev, EvidenceState.PRESENT)
    if high_rev:
        evidence.set("item19_highRevenue", high_rev, EvidenceState.PRESENT)
    if low_rev:
        evidence.set("item19_lowRevenue", low_rev, EvidenceState.PRESENT)
    if fpr_unit_count:
        evidence.set("fprUnitCount", fpr_unit_count, EvidenceState.PRESENT)

    # ── Item 20: Outlet Engine ──
    i20 = parsed_items.get(20, {})
    franchised_end = _pv(i20.get("total_franchised"))
    co_end = _pv(i20.get("total_company_owned"))
    direct_total = _pv(i20.get("total_outlets"))

    # Source precedence: direct systemwide total > computed sum
    total_end = None
    total_basis = "missing"
    if direct_total and direct_total > 0:
        computed = (franchised_end or 0) + (co_end or 0)
        if direct_total >= computed:
            total_end = direct_total
            total_basis = "direct_systemwide"
        else:
            total_end = computed
            total_basis = "derived_from_components"
    elif franchised_end or co_end:
        total_end = (franchised_end or 0) + (co_end or 0)
        total_basis = "derived_from_components"

    # Note: cross-item table recovery now handled by table_router.py
    # which injects outlet_summary tables into Item 20's section before parsing.

    engines["item20_engine"] = {
        "total_end": total_end,
        "franchised_end": franchised_end,
        "co_end": co_end,
        "total_basis": total_basis,
    }
    if total_end:
        evidence.set("totalUnits", total_end, EvidenceState.PRESENT)
    if franchised_end:
        evidence.set("franchisedUnits", franchised_end, EvidenceState.PRESENT)
    if co_end:
        evidence.set("companyOwnedUnits", co_end, EvidenceState.PRESENT)

    # ── Item 21 + Exhibits: Financial Statement Engine ──
    fin = exhibit_data.get("financials", {})
    engines["financial_statement_engine"] = fin
    if fin.get("hasAuditedFinancials"):
        evidence.set("hasAuditedFinancials", True, EvidenceState.PRESENT)

    # ── Other engines (unwrap all parser envelopes) ──
    for item_num, engine_name in [(3, "litigation_engine"), (4, "bankruptcy_engine"),
                                    (11, "training_support_engine"), (12, "territory_engine"),
                                    (15, "owner_participation_engine"), (22, "document_package_engine")]:
        raw = parsed_items.get(item_num, {})
        engines[engine_name] = {k: _pv(v) for k, v in raw.items() if k != "item"}

    return engines
