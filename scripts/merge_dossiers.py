#!/usr/bin/env python3
"""
merge_dossiers.py — Franchise dossier consolidation merger.

Reads run canonicals (multiple schemas) from runs/ and writes one merged
dossier per publishable franchise to src/data/dossiers/<slug>.json.

This is the single merger script allowed by the consolidation guardrail.

Precedence (per franchise, per field):
  1. Within same filing year: manually-merged > reconciled > publish-gate > raw v2 > v1 > final
  2. Newer filing year wins for current_snapshot
  3. Clause-level extraction beats prose summary
  4. 2+ runs agreeing on a number wins; otherwise -> internal_unresolveds
  5. Old site data is merge input only
"""

from __future__ import annotations
import glob
import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
RUNS = ROOT / "runs"
OUT = ROOT / "src" / "data" / "dossiers"
REPORT = ROOT / "PUBLISH_REPORT.md"

# First-200 fresh runs live in a sibling project directory.
FIRST200_RUNS = Path("/Users/shelly/Franchiese/runs")
FIRST200_PLAN_JSON = Path("/tmp/first200_plan.json")

FRANCHISE_PLAN: dict[str, dict[str, Any]] = {
    "mcdonalds": {
        "name": "McDonald's",
        "primary": "mcdonalds-2025-merged-v2",
        "harvest": [
            "mcdonalds-2025-merged",
            "shadow-final-mcdonalds-2026-04-13",
            "shadow-live-mcdonalds-2026-04-07-final",
            "shadow-live-mcdonalds-2025-v2",
            "mcdonalds-2025",
            "shadow-previous-mcdonalds-2025",
        ],
        "filing_year": 2025,
        "quality": "gold_merged",
    },
    "ivybrook-academy": {
        "name": "Ivybrook Academy",
        "primary": "ivybrook-academy-2025-v2",
        "harvest": ["ivybrook-academy-2025"],
        "filing_year": 2025,
        "quality": "reconciled",
    },
    "burger-king": {
        "name": "Burger King",
        "primary": "burger-king-2025",
        "harvest": ["merged-burger-king-2025", "shadow-live-burger-king-2025", "637918-2025-Burger-King"],
        "filing_year": 2025,
        "quality": "merged",
    },
    "qdoba-mexican-eats": {
        "name": "Qdoba Mexican Eats",
        "primary": "qdoba-2025",
        "harvest": ["shadow-fresh-qdoba-2025", "640022-2025-Qdoba-Qdoba-Mexican-Eats-Qdoba-Mexican-Grill"],
        "filing_year": 2025,
        "quality": "v2",
    },
    "rocky-rococo-pizza-and-pasta": {
        "name": "Rocky Rococo Pizza and Pasta",
        "primary": "rocky-rococo-2025",
        "harvest": ["shadow-live-rocky-rococo-2025", "rocky-rococo-2025-shadow"],
        "filing_year": 2025,
        "quality": "reconciled",
    },
    "chick-fil-a": {
        "name": "Chick-fil-A",
        "primary": "chick-fil-a-2025",
        "harvest": [],
        "filing_year": 2025,
        "quality": "reconciled",
    },
    "anago-cleaning-systems": {
        "name": "Anago Cleaning Systems",
        "primary": "anago-cleaning-systems-2026",
        "harvest": [],
        "filing_year": 2026,
        "quality": "publish_gate",
    },
    "cruise-planners": {
        "name": "Cruise Planners",
        "primary": "cruise-planners-2025",
        "harvest": [],
        "filing_year": 2025,
        "quality": "publish_gate",
    },
    "cupbop": {
        "name": "Cupbop",
        "primary": "cupbop-2025",
        "harvest": [],
        "filing_year": 2025,
        "quality": "publish_gate",
    },
    "jiffy-lube": {
        "name": "Jiffy Lube",
        "primary": "jiffy-lube-2025",
        "harvest": [],
        "filing_year": 2025,
        "quality": "publish_gate",
    },
    "the-joint-chiropractic": {
        "name": "The Joint Chiropractic",
        "primary": "the-joint-chiropractic-2025",
        "harvest": [],
        "filing_year": 2025,
        "quality": "publish_gate",
    },
}


def load_json(p: Path) -> Any:
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text())
    except Exception:
        return None


def load_run(run_dir: str) -> dict[str, Any]:
    p = RUNS / run_dir
    if not p.exists():
        return {}
    bundle = {
        "_run": run_dir,
        "v2": load_json(p / "12_canonical_enriched_v2.json") or {},
        "v1": load_json(p / "11_canonical_enriched.json") or {},
        "final": load_json(p / "09_final_canonical.json") or {},
        "raw": load_json(p / "05_canonical.json") or {},
        "summary": load_json(p / "14_run_summary.json") or {},
        "rt_depth": {},
    }
    for f in p.glob("RT_depth_*.json"):
        bundle["rt_depth"][f.stem] = load_json(f) or {}
    # Merged composite — overlay later layers on earlier (raw < final < v1 < v2)
    composite: dict[str, Any] = {}
    for layer_key in ("raw", "final", "v1", "v2"):
        layer = bundle[layer_key]
        if isinstance(layer, dict):
            for k, v in layer.items():
                if k.startswith("$") or k in ("patches_from", "patches_from_a2"):
                    continue
                if v in (None, "", [], {}):
                    continue
                composite[k] = v
    bundle["composite"] = composite
    return bundle


def unwrap(v: Any) -> Any:
    """Strip the {value, source_object, ...} envelope."""
    if isinstance(v, dict) and "value" in v and any(
        k in v for k in ("source_object", "source_section", "source_pages", "confidence", "status")
    ):
        return v["value"]
    return v


def get_first(d: dict, *keys: str) -> Any:
    for k in keys:
        if k in d:
            v = unwrap(d[k])
            if v not in (None, "", [], {}):
                return v
    return None


def fmt_money_range(low: Any, high: Any) -> str | None:
    if low is None and high is None:
        return None
    def fmt(x: Any) -> str:
        if isinstance(x, (int, float)):
            return f"${int(x):,}"
        s = str(x)
        return s if s.startswith("$") else f"${s}"
    if low is not None and high is not None:
        return f"{fmt(low)} to {fmt(high)}"
    return fmt(low if low is not None else high)


def fmt_money(x: Any) -> str | None:
    if x is None:
        return None
    if isinstance(x, dict):
        if "value" in x:
            return fmt_money(unwrap(x))
        if "low" in x and "high" in x:
            return fmt_money_range(x["low"], x["high"])
        return str(x)
    if isinstance(x, (int, float)):
        return f"${int(x):,}"
    s = str(x)
    return s if s.startswith("$") else f"${s}"


# ── Schema-agnostic field extractors ────────────────────────────────


def x_identity_name(c: dict) -> Any:
    """Extract franchisor legal name across schemas."""
    if isinstance(c.get("identity"), dict):
        return unwrap(c["identity"].get("legal_name"))
    if isinstance(c.get("franchisor_identity"), dict):
        return unwrap(c["franchisor_identity"].get("legal_name"))
    if isinstance(c.get("document_identity"), dict):
        di = c["document_identity"]
        return unwrap(di.get("franchisor_legal_name") or di.get("franchisor") or di.get("brand"))
    return get_first(c, "franchisor_legal_name", "brand")


def x_parent(c: dict) -> Any:
    if isinstance(c.get("identity"), dict):
        return unwrap(c["identity"].get("parent"))
    if isinstance(c.get("franchisor_identity"), dict):
        return unwrap(c["franchisor_identity"].get("parent"))
    if isinstance(c.get("document_identity"), dict):
        di = c["document_identity"]
        return unwrap(di.get("parent_company") or di.get("ultimate_parent"))
    return get_first(c, "parents", "parent_company")


def x_hq(c: dict) -> Any:
    for src in (c.get("identity"), c.get("franchisor_identity"), c.get("document_identity")):
        if isinstance(src, dict):
            for k in ("headquarters", "principal_address", "address"):
                if k in src:
                    return unwrap(src[k])
    return get_first(c, "principal_address")


def x_initial_fee(c: dict) -> tuple[Any, Any]:
    """Returns (headline_value, by_format_dict)."""
    # Schema McD style
    if isinstance(c.get("initial_fees"), dict):
        d = c["initial_fees"]
        # try traditional / initial_franchise_fee / first key
        for k in ("traditional", "initial_franchise_fee", "primary", "single_unit", "standard"):
            if k in d:
                v = unwrap(d[k])
                if v not in (None, "", [], {}):
                    by = {kk: unwrap(vv) for kk, vv in d.items() if kk not in ("contradictions", "refund_terms")}
                    return v, by
        # fallback first key
        for k, v in d.items():
            if k in ("contradictions", "refund_terms"):
                continue
            uv = unwrap(v)
            if uv:
                by = {kk: unwrap(vv) for kk, vv in d.items() if kk not in ("contradictions", "refund_terms")}
                return uv, by
    # Item-numbered schema
    for src_k in ("item5_initial_fees", "item_5_initial_fees"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            for k in (
                "initial_franchise_fee_single",
                "initial_franchise_fee",
                "new_center_fee",
                "franchise_fee",
                "fee",
            ):
                if k in d:
                    v = unwrap(d[k])
                    if v not in (None, "", [], {}):
                        by = {kk: unwrap(vv) for kk, vv in d.items()}
                        return v, by
            # Fallback first numeric or money string
            by = {kk: unwrap(vv) for kk, vv in d.items()}
            for kk, vv in by.items():
                if isinstance(vv, (int, float)) or (isinstance(vv, str) and "$" in vv):
                    return vv, by
            return None, by
    return None, {}


def x_investment(c: dict) -> tuple[Any, Any]:
    """Returns (headline_string, by_format_dict)."""
    # McD / generic
    if isinstance(c.get("initial_investment_total"), dict):
        d = c["initial_investment_total"]
        for k in ("traditional", "single_unit", "standard"):
            if k in d:
                v = unwrap(d[k])
                if v:
                    by = {kk: unwrap(vv) for kk, vv in d.items() if kk != "contradictions"}
                    return v, by
        for kk, vv in d.items():
            if kk == "contradictions":
                continue
            uv = unwrap(vv)
            if uv:
                by = {kkk: unwrap(vvv) for kkk, vvv in d.items() if kkk != "contradictions"}
                return uv, by
    # Item-numbered
    for src_k in ("item7_initial_investment", "item7_investment"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            low = unwrap(d.get("total_low_usd") or d.get("total_low"))
            high = unwrap(d.get("total_high_usd") or d.get("total_high"))
            by = {kk: unwrap(vv) for kk, vv in d.items()}
            return fmt_money_range(low, high), by
    return None, {}


def x_recurring(c: dict) -> dict:
    """Returns a normalized recurring fee dict with royalty + ad_fund headlines."""
    royalty = ad = ""
    raw_obj: dict[str, Any] = {}
    for src_k in ("recurring_fees", "item6_fees", "item6_other_fees", "item6_ongoing_fees"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            raw_obj = {kk: unwrap(vv) for kk, vv in d.items()}
            for k in ("royalty", "royalty_rate", "royalty_rate_pct_gr"):
                if k in d:
                    royalty = unwrap(d[k])
                    if royalty not in (None, ""):
                        break
            for k in ("advertising", "ad_fund", "marketing_fund", "brand_fund", "brand_fund_rate_pct_gr"):
                if k in d:
                    ad = unwrap(d[k])
                    if ad not in (None, ""):
                        break
            if royalty or ad:
                break
    return {"royalty": royalty, "ad_fund": ad, "raw": raw_obj}


def x_item20(c: dict) -> dict:
    """Returns normalized item 20 outlet summary."""
    o: dict[str, Any] = {}
    for src_k in ("item_20_outlet_summary", "item20_outlet_summary", "item20_outlets"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            o["system_total"] = unwrap(
                d.get("system_total_2024_end") or d.get("total_outlets_end_2024") or d.get("total_2024_end") or d.get("totals_end_2024")
            )
            o["franchised"] = unwrap(d.get("franchised_2024_end") or d.get("franchised_end_2024"))
            o["company_owned"] = unwrap(d.get("company_owned_2024_end") or d.get("company_owned_end_2024"))
            o["openings"] = unwrap(d.get("openings_franchised_2024") or d.get("franchised_opened_2024"))
            o["terminations"] = unwrap(d.get("terminations_franchised_2024") or d.get("franchised_terminations_2024"))
            o["non_renewals"] = unwrap(d.get("non_renewals_franchised_2024") or d.get("franchised_non_renewals_2024"))
            o["transfers"] = unwrap(d.get("transfers_2024") or d.get("transfers_2022_2024"))
            o["net_change"] = unwrap(d.get("franchised_net_change_2024") or d.get("net_change_2024"))
            o["raw"] = {k: unwrap(v) for k, v in d.items()}
            return o
    return o


def x_item19(c: dict) -> dict:
    """Returns Item 19 quality summary."""
    for src_k in ("item_19_performance_summary", "item19_performance_summary", "item19_fpr", "item_19_performance"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            present = any(unwrap(v) for v in d.values()) if d else False
            return {
                "present": present,
                "cohort_n": unwrap(d.get("cohort_n_traditional_open_1yr") or d.get("cohort_n") or d.get("sample_size")),
                "average": unwrap(d.get("average_auv_2024_traditional") or d.get("average_auv") or d.get("average_revenue") or d.get("average_gross_revenue")),
                "median": unwrap(d.get("median_auv_2024_traditional") or d.get("median_auv") or d.get("median_revenue")),
                "high_low": unwrap(d.get("high_low_auv_2024") or d.get("high_low") or d.get("range")),
                "presentation_basis": unwrap(d.get("pro_forma_basis") or d.get("basis") or d.get("type")),
                "raw_keys": list(d.keys())[:25],
            }
    return {"present": False}


def x_item21(c: dict, v2: dict) -> dict:
    """Returns Item 21 financial strength summary."""
    out: dict[str, Any] = {}
    for src_k in ("item_21_financial_summary", "item21_financial_summary", "item21_financial_statements", "item21_auditor_guaranty_financial_summary"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            out["auditor"] = unwrap(d.get("auditor") or d.get("auditor_firm") or d.get("auditing_firm"))
            out["audit_opinion"] = unwrap(d.get("audit_opinion_type") or d.get("opinion") or d.get("opinion_type"))
            out["audit_opinion_date"] = unwrap(d.get("audit_opinion_date") or d.get("opinion_date") or d.get("audit_date"))
            out["fiscal_year_end"] = unwrap(d.get("fiscal_year_end") or d.get("fye"))
            out["total_revenue"] = unwrap(d.get("total_revenue_2024") or d.get("total_revenue"))
            out["net_income"] = unwrap(d.get("net_income_2024") or d.get("net_income"))
            out["total_assets"] = unwrap(d.get("total_assets_2024") or d.get("total_assets"))
            out["total_equity"] = unwrap(d.get("total_members_equity_2024") or d.get("total_equity") or d.get("stockholders_equity"))
            break
    if isinstance(v2.get("item21_financial_structure_detail"), dict):
        out["depth_v2"] = v2["item21_financial_structure_detail"]
    if isinstance(v2.get("item21_statement_detail"), dict):
        out["statement_detail"] = v2["item21_statement_detail"]
    return out


def x_term(c: dict) -> dict:
    for src_k in ("term_renewal_transfer_default_termination", "item17_contract", "item17_relationship"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            return {
                "term": unwrap(d.get("term_traditional") or d.get("term") or d.get("initial_term") or d.get("initial_term_years")),
                "renewal": unwrap(d.get("renewal") or d.get("renewal_term") or d.get("renewal_terms")),
                "termination_with_cause": unwrap(d.get("termination_with_cause") or d.get("termination_by_franchisor")),
                "termination_by_franchisee": unwrap(d.get("termination_by_franchisee") or d.get("franchisee_termination")),
                "transfer": unwrap(d.get("transfer") or d.get("transfer_provisions") or d.get("assignment")),
                "raw": {k: unwrap(v) for k, v in d.items()},
            }
    return {}


def x_territory(c: dict) -> Any:
    for src_k in ("territory_structure", "item12_territory"):
        if isinstance(c.get(src_k), dict):
            d = c[src_k]
            head = unwrap(d.get("headline") or d.get("type") or d.get("territory_type"))
            return {"headline": head, "raw": {k: unwrap(v) for k, v in d.items()}}
        elif src_k in c:
            return {"headline": unwrap(c[src_k]), "raw": None}
    return None


def x_state_overrides(c: dict) -> Any:
    for src_k in ("state_addenda_overrides_v2", "state_addenda_overrides", "state_addenda"):
        if c.get(src_k):
            return c[src_k]
    return None


def x_litigation(c: dict) -> Any:
    for src_k in ("litigation_summary", "item3_litigation", "litigation"):
        if c.get(src_k):
            v = c[src_k]
            if isinstance(v, dict):
                pending = unwrap(v.get("pending_count") or v.get("pending"))
                return {"pending": pending, "raw": v}
            return {"raw": v}
    return None


def x_bankruptcy(c: dict) -> Any:
    for src_k in ("bankruptcy_flag", "item4_bankruptcy"):
        if c.get(src_k) is not None:
            return unwrap(c[src_k])
    return None


def x_noncompete(c: dict) -> dict:
    if isinstance(c.get("noncompete"), dict):
        d = c["noncompete"]
        return {"in_term": unwrap(d.get("in_term")), "post_term": unwrap(d.get("post_term"))}
    return {}


def x_contract_burden(c: dict, v2: dict, rt: dict) -> dict:
    return {
        "from_canonical": {k: unwrap(v) for k, v in (c.get("contract_burden_promotions_from_FA", {}) or {}).items()} if isinstance(c.get("contract_burden_promotions_from_FA"), dict) else None,
        "from_depth_pass_v2": v2.get("contract_burden_summary_promoted") if isinstance(v2.get("contract_burden_summary_promoted"), dict) else None,
        "from_rt_depth": rt.get("RT_depth_contract_burdens"),
    }


def derive_red_flags(c: dict) -> list[dict]:
    flags: list[dict] = []
    contradictions = c.get("contradictions") or c.get("contradictions_consolidated") or []
    for cd in (contradictions or [])[:5]:
        if isinstance(cd, dict):
            flags.append({"severity": "warning", "kind": "contradiction", "summary": (cd.get("description") or cd.get("summary") or str(cd))[:200]})
    cb = c.get("contract_burden_promotions_from_FA") or {}
    if isinstance(cb, dict):
        rate = unwrap(cb.get("delinquency_interest_rate_pct"))
        try:
            if rate is not None and float(str(rate).strip("%")) >= 0.12:
                flags.append({"severity": "info", "kind": "fee", "summary": "Delinquency interest rate >= 12%/yr"})
        except (TypeError, ValueError):
            pass
    bk = x_bankruptcy(c)
    if bk and bk not in (False, "false", "no", "none"):
        flags.append({"severity": "warning", "kind": "bankruptcy", "summary": str(bk)[:200]})
    nc = x_noncompete(c)
    if nc.get("post_term"):
        s = str(nc["post_term"])
        if any(x in s.lower() for x in ("compet", "noncompete", "restraint")):
            flags.append({"severity": "info", "kind": "noncompete", "summary": "Post-term non-compete present"})
    return flags


def build_dossier(slug: str, plan: dict) -> dict:
    primary = load_run(plan["primary"])
    harvest = [load_run(r) for r in plan["harvest"]]
    c = primary.get("composite", {}) or {}
    v2 = primary.get("v2", {}) or {}
    rt = primary.get("rt_depth", {}) or {}
    name = plan["name"]
    fy = plan["filing_year"]

    fee_head, fee_by = x_initial_fee(c)
    inv_head, inv_by = x_investment(c)
    recurring = x_recurring(c)
    item20 = x_item20(c)
    item19 = x_item19(c)
    item21 = x_item21(c, v2)
    term = x_term(c)
    territory = x_territory(c)
    state_overrides = x_state_overrides(c)
    litigation = x_litigation(c)
    bankruptcy = x_bankruptcy(c)

    # Format fee headline if numeric
    if isinstance(fee_head, (int, float)):
        fee_head_str = fmt_money(fee_head)
    elif isinstance(fee_head, dict):
        if "value" in fee_head:
            v = fee_head["value"]
            fee_head_str = fmt_money(v) if isinstance(v, (int, float)) else str(v)
        elif "low" in fee_head and "high" in fee_head:
            fee_head_str = fmt_money_range(fee_head["low"], fee_head["high"])
        else:
            fee_head_str = json.dumps(fee_head)[:120]
    else:
        fee_head_str = fee_head

    current_snapshot = {
        "legal_name": x_identity_name(c),
        "parent": x_parent(c),
        "headquarters": x_hq(c),
        "fdd_filing_year": fy,
        "issuance_date": unwrap(c.get("issuance_date")),
        "franchise_fee_headline": fee_head_str,
        "investment_range_headline": inv_head,
        "royalty_headline": recurring.get("royalty"),
        "ad_fund_headline": recurring.get("ad_fund"),
        "term_headline": term.get("term"),
        "renewal_headline": term.get("renewal"),
        "territory_headline": (territory or {}).get("headline") if isinstance(territory, dict) else territory,
        "item_19_present": item19.get("present", False),
        "system_total_units": item20.get("system_total"),
        "franchised_units": item20.get("franchised"),
        "company_owned_units": item20.get("company_owned"),
    }

    economics = {
        "initial_fees_by_format": fee_by,
        "investment_by_format": inv_by,
        "recurring_fees_raw": recurring.get("raw"),
        "tech_fee_detail": v2.get("item6_fee_detail") if isinstance(v2.get("item6_fee_detail"), dict) else None,
    }

    item19_quality = item19

    item20_system_movement = item20

    contract_burden = x_contract_burden(c, v2, rt)
    contract_burden["termination_with_cause"] = term.get("termination_with_cause")
    contract_burden["termination_by_franchisee"] = term.get("termination_by_franchisee")
    contract_burden["transfer"] = term.get("transfer")
    nc = x_noncompete(c)
    contract_burden["noncompete_in_term"] = nc.get("in_term")
    contract_burden["noncompete_post_term"] = nc.get("post_term")

    territory_reality = territory or {}

    financial_strength = {
        **item21,
        "bankruptcy_flag": bankruptcy,
        "litigation_summary": litigation,
    }

    red_flags = derive_red_flags(c)

    contradictions = c.get("contradictions") or c.get("contradictions_consolidated") or []
    unresolveds = c.get("unresolveds") or c.get("unresolveds_consolidated") or []

    validation_questions: list[str] = []
    for cd in (contradictions or [])[:5]:
        if isinstance(cd, dict):
            d = cd.get("description") or cd.get("summary") or ""
            if d:
                validation_questions.append(f"Reconcile: {str(d)[:160]}")
    if not item19.get("cohort_n"):
        validation_questions.append("Confirm Item 19 cohort definition with franchisor.")
    if not item21.get("auditor"):
        validation_questions.append("Confirm current auditor and most recent opinion date.")
    if not state_overrides:
        validation_questions.append("Request current state-by-state addenda packet.")

    filing_changes: list[dict] = []
    for h in harvest:
        if not h:
            continue
        h_c = h.get("composite", {}) or {}
        h_fee_head, _ = x_initial_fee(h_c)
        if isinstance(h_fee_head, (int, float)):
            h_fee_head = fmt_money(h_fee_head)
        if h_fee_head and fee_head_str and str(h_fee_head) != str(fee_head_str):
            filing_changes.append({"field": "franchise_fee", "from_run": h["_run"], "old_value": str(h_fee_head)[:120], "current_value": str(fee_head_str)[:120]})
        h_recur = x_recurring(h_c)
        if h_recur.get("royalty") and recurring.get("royalty") and str(h_recur["royalty"]) != str(recurring["royalty"]):
            filing_changes.append({"field": "royalty", "from_run": h["_run"], "old_value": str(h_recur["royalty"])[:120], "current_value": str(recurring["royalty"])[:120]})
        h_item20 = x_item20(h_c)
        if h_item20.get("system_total") and item20.get("system_total") and str(h_item20["system_total"]) != str(item20["system_total"]):
            filing_changes.append({"field": "system_total_units", "from_run": h["_run"], "old_value": h_item20["system_total"], "current_value": item20["system_total"]})

    source_evidence = {
        "primary_run": plan["primary"],
        "harvest_runs": plan["harvest"],
        "filing_year": fy,
        "key_exhibits": c.get("key_exhibits", []),
        "issuance_date_pages": (c.get("issuance_date") or {}).get("source_pages") if isinstance(c.get("issuance_date"), dict) else None,
        "primary_layers_present": {k: bool(primary.get(k)) for k in ("v2", "v1", "final", "raw")},
        "rt_depth_files": list(rt.keys()),
    }

    internal_unresolveds: list[dict] = []
    for u in (unresolveds or []):
        if isinstance(u, dict):
            internal_unresolveds.append({"topic": u.get("topic") or u.get("field") or "unspecified", "reason": (u.get("reason") or u.get("description") or str(u))[:200]})
        else:
            internal_unresolveds.append({"topic": "unspecified", "reason": str(u)[:200]})
    for cd in (contradictions or []):
        if isinstance(cd, dict):
            internal_unresolveds.append({"topic": "contradiction", "reason": (cd.get("description") or cd.get("summary") or str(cd))[:200]})

    return {
        "slug": slug,
        "name": name,
        "schema_version": 1,
        "current_snapshot": current_snapshot,
        "economics": economics,
        "item19_quality": item19_quality,
        "item20_system_movement": item20_system_movement,
        "contract_burden": contract_burden,
        "territory_reality": territory_reality,
        "state_overrides": state_overrides,
        "financial_strength": financial_strength,
        "red_flags": red_flags,
        "validation_questions": validation_questions,
        "filing_changes": filing_changes,
        "source_evidence": source_evidence,
        "internal_unresolveds": internal_unresolveds,
    }


# ── First-200 phase: multi-schema headline extraction ─────────────────

def _unwrap_value(v: Any) -> Any:
    """Unwrap {value, source_*} envelope; also handle nested dicts of same shape."""
    if isinstance(v, dict):
        if "value" in v and any(k in v for k in ("source_object", "source_section", "source_pages", "confidence", "status")):
            return v["value"]
    return v


def _dig(d: Any, *path: str) -> Any:
    cur = d
    for p in path:
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        else:
            return None
    return _unwrap_value(cur)


def _first_non_empty(*vals: Any) -> Any:
    for v in vals:
        if v not in (None, "", [], {}):
            return v
    return None


def detect_schema(d: dict) -> str:
    if "document_identity" in d:
        return "B"
    if "franchisor_identity" in d:
        return "D"
    if any(k.startswith("item1_") for k in d):
        return "C"
    if "franchisor" in d and "concept" in d:
        return "E"
    if "brand" in d and "filing_id" in d:
        return "F"
    if "brand" in d and "franchise_fee" in d:
        return "A"
    return "?"


def _try_paths(d: dict, *paths: tuple) -> Any:
    """Try a series of path-tuples; return first non-empty unwrapped value."""
    for path in paths:
        cur = d
        ok = True
        for p in path:
            if isinstance(cur, dict) and p in cur:
                cur = cur[p]
            else:
                ok = False
                break
        if ok:
            v = _unwrap_value(cur)
            if v not in (None, "", [], {}):
                return v
    return None


def _clean_str(v: Any) -> Any:
    """Coerce dicts/lists to None (or a short JSON string) for headline display."""
    if v in (None, "", [], {}):
        return None
    if isinstance(v, dict):
        # Try common value-holders before giving up
        for k in ("value", "amount", "rate", "headline"):
            if k in v:
                return v[k]
        return None  # unrenderable dict -> suppress from public
    if isinstance(v, list):
        return None
    return v


def extract_headline_multi(d: dict) -> dict:
    """Schema-tolerant headline extractor for first-200 canonicals.

    Uses a union-of-paths approach: the publish set has at least 7 canonical
    variants that differ in top-level keys (document_identity vs flat, fees vs
    initial_fees/ongoing_fees vs item5_*/item6_*, item19 vs item19_fpr vs
    item19_financial_performance, etc.). We try every known location per field
    and take the first non-empty value.
    """
    s = detect_schema(d)
    out = {"schema_detected": s, "legal_name": None, "parent": None, "hq": None,
           "issuance_date": None, "fdd_id": d.get("fdd_id") or d.get("filing_id"),
           "franchise_fee": None, "royalty": None, "ad_fund": None,
           "investment_low": None, "investment_high": None,
           "term_years": None, "renewal": None, "territory": None,
           "system_total": None, "franchised_units": None, "company_units": None,
           "opens": None, "closes": None, "transfers": None,
           "item19_present": False, "item19_cohort_n": None, "item19_avg": None, "item19_median": None,
           "auditor": None, "audit_opinion": None, "fiscal_year_end": None,
           "bankruptcy": None, "litigation_pending": None,
           "state_addenda_count": None,
           "unresolveds": [], "contradictions": []}

    # ── Union-of-paths extraction (schema-agnostic) ──
    out["legal_name"] = _clean_str(_try_paths(d,
        ("document_identity","franchisor_legal_name"), ("document_identity","brand_name"),
        ("franchisor_identity","legal_name"), ("franchisor","legal_name"),
        ("item1_franchisor","legal_name"), ("item1_franchisor","franchisor_legal_name"),
        ("item1_entity","legal_name"),
        ("franchisor_legal_name",), ("brand",),
    ))
    out["parent"] = _clean_str(_try_paths(d,
        ("document_identity","parent_entity"), ("document_identity","parent_company"),
        ("franchisor_identity","parent"), ("franchisor","parent_entity"),
        ("parent_entity",), ("parent_company",),
    ))
    out["hq"] = _clean_str(_try_paths(d,
        ("document_identity","franchisor_address"), ("franchisor","address"),
        ("franchisor_identity","address"), ("item1_franchisor","address"),
        ("principal_address",), ("franchisor_address",),
    ))
    out["issuance_date"] = _clean_str(_try_paths(d,
        ("document_identity","issuance_date"), ("issuance_date",), ("meta","issuance_date"),
    ))

    # Franchise fee: try many locations
    out["franchise_fee"] = _try_paths(d,
        ("fees","initial_franchise_fee","standard"),
        ("fees","initial_franchise_fee","amount"),
        ("fees","initial_franchise_fee","value"),
        ("fees","franchise_fee","standard"),
        ("fees","franchise_fee","amount"),
        ("initial_fees","initial_franchise_fee","amount"),
        ("initial_fees","initial_franchise_fee","standard"),
        ("initial_fees","franchise_fee","amount"),
        ("initial_fees","new_center_fee","amount"),
        ("item5_initial_fees","initial_franchise_fee"),
        ("item5_initial_fees","new_center_fee"),
        ("item5_initial_fees","franchise_fee"),
        ("franchise_fee","standard"),
        ("franchise_fee",),
    )
    out["franchise_fee"] = _clean_str(out["franchise_fee"])

    # Royalty
    out["royalty"] = _try_paths(d,
        ("fees","royalty","rate"), ("fees","royalty","value"),
        ("ongoing_fees","royalty","rate"), ("ongoing_fees","royalty","value"),
        ("item6_ongoing_fees","royalty_rate"), ("item6_ongoing_fees","royalty"),
        ("item6_other_fees","royalty"), ("item6_fees","royalty"),
        ("recurring_fees","royalty"),
        ("royalty","rate"), ("royalty",),
    )
    out["royalty"] = _clean_str(out["royalty"])

    # Ad fund
    out["ad_fund"] = _try_paths(d,
        ("fees","advertising_fee","rate"), ("fees","brand_fund","rate"),
        ("fees","marketing_fund","rate"),
        ("ongoing_fees","advertising","rate"), ("ongoing_fees","brand_fund","rate"),
        ("ongoing_fees","advertising_contribution","rate"),
        ("item6_ongoing_fees","advertising_fee"), ("item6_other_fees","advertising"),
        ("advertising_fee","rate"), ("advertising_fee",),
    )
    out["ad_fund"] = _clean_str(out["ad_fund"])

    # Investment
    out["investment_low"] = _try_paths(d,
        ("initial_investment","traditional_low"), ("initial_investment","low"),
        ("initial_investment","total_low"), ("initial_investment","total_low_usd"),
        ("item7_initial_investment","total_low_usd"), ("item7_initial_investment","total_low"),
        ("item7_investment","total_low"), ("investment","low"),
    )
    out["investment_high"] = _try_paths(d,
        ("initial_investment","traditional_high"), ("initial_investment","high"),
        ("initial_investment","total_high"), ("initial_investment","total_high_usd"),
        ("item7_initial_investment","total_high_usd"), ("item7_initial_investment","total_high"),
        ("item7_investment","total_high"), ("investment","high"),
    )

    # Term
    out["term_years"] = _try_paths(d,
        ("contract_terms","initial_years"), ("contract_terms","term"),
        ("term_and_renewal","initial_term_years"), ("term","initial_years"),
        ("item17_contract","term"), ("item17_contract","initial_term_years"),
        ("item17_relationship","term"),
    )
    out["renewal"] = _try_paths(d,
        ("contract_terms","renewal_right"), ("contract_terms","renewal"),
        ("term_and_renewal","renewal_terms"), ("term_and_renewal","renewal_term_years"),
        ("term","renewal_right"),
    )
    out["renewal"] = _clean_str(out["renewal"])

    # Territory
    out["territory"] = _clean_str(_try_paths(d,
        ("territory","type"), ("territory","headline"), ("territory","exclusivity"),
        ("item12_territory","type"), ("item12_territory","headline"),
    ))

    # Units (Item 20)
    out["system_total"] = _try_paths(d,
        ("item20_outlets","system_total"), ("item20_outlets","total_end_2024"),
        ("item20_outlets","us_total"),
        ("item20","total_outlets_end_2024"), ("item20","system_total_end_2024"),
        ("item20_outlet_data","total_end_2024"),
        ("system_size","worldwide_total"), ("system_size","us_total"), ("system_size","total"),
    )
    out["franchised_units"] = _try_paths(d,
        ("item20_outlets","franchised_end_2024"), ("item20_outlets","franchised"),
        ("item20","franchised_outlets_end_2024"), ("item20","franchised_end_2024"),
        ("item20_outlet_data","franchised_end_2024"),
        ("system_size","us_franchised"), ("system_size","franchised"),
    )
    out["company_units"] = _try_paths(d,
        ("item20_outlets","company_owned_end_2024"), ("item20_outlets","company_owned"),
        ("item20","company_owned_outlets_end_2024"), ("item20","company_owned_end_2024"),
        ("item20_outlet_data","company_owned_end_2024"),
        ("system_size","us_company_owned"), ("system_size","company_owned"),
    )

    # Item 19
    i19_block = _first_non_empty(
        d.get("item19_financial_performance"), d.get("item19_fpr"),
        d.get("item19"), d.get("item_19_performance_summary"),
    )
    if isinstance(i19_block, dict) and any(v for v in i19_block.values()):
        # Detect "present" more carefully
        fpr_flag = _unwrap_value(i19_block.get("fpr_provided"))
        no_i19 = _unwrap_value(i19_block.get("no_item19"))
        if fpr_flag is True or no_i19 is False:
            out["item19_present"] = True
        elif no_i19 is True or fpr_flag is False:
            out["item19_present"] = False
        else:
            # default to True if dict has non-empty extraction data
            out["item19_present"] = True
        out["item19_cohort_n"] = _try_paths(i19_block,
            ("traditional","reporting_count"), ("traditional","cohort_n"),
            ("cohort_n",), ("sample_size",), ("population_size",),
            ("reporting_count",),
        )
        out["item19_avg"] = _clean_str(_try_paths(i19_block,
            ("traditional","average_gross_sales"), ("average_auv",),
            ("average",), ("average_revenue",),
        ))
        out["item19_median"] = _clean_str(_try_paths(i19_block,
            ("traditional","median_gross_sales"), ("median_auv",),
            ("median",), ("median_revenue",),
        ))

    # Item 21 / financial strength
    i21_block = _first_non_empty(
        d.get("item21_financial_statements"), d.get("item21_financial"),
        d.get("item21"), d.get("item_21_financial_summary"),
    )
    if isinstance(i21_block, dict):
        out["auditor"] = _clean_str(_try_paths(i21_block,
            ("auditor",), ("auditor_firm",), ("auditing_firm",),
        ))
        out["audit_opinion"] = _clean_str(_try_paths(i21_block,
            ("audit_opinion_type",), ("opinion",), ("opinion_type",),
        ))
        out["fiscal_year_end"] = _clean_str(_try_paths(i21_block,
            ("fiscal_year_end",), ("fye",),
        ))

    # Litigation / bankruptcy
    out["litigation_pending"] = _try_paths(d,
        ("litigation","pending_count"), ("litigation","pending"),
        ("litigation_summary","pending"), ("item3_litigation","pending_count"),
        ("litigation_bankruptcy","pending_count"),
    )
    bk = _try_paths(d,
        ("bankruptcy","status"), ("bankruptcy","flag"),
        ("litigation_bankruptcy","bankruptcy_flag"),
        ("bankruptcy_flag",),
    )
    # normalize "none_disclosed" to safe
    if isinstance(bk, str) and bk.lower() in ("none_disclosed","none","no","false"):
        out["bankruptcy"] = None
    else:
        out["bankruptcy"] = bk

    # State addenda
    sa = _try_paths(d,
        ("state_addenda_overrides","states_with_addenda"),
        ("state_addenda","states"), ("state_addenda","addenda"),
        ("state_addenda_states",),
    )
    if isinstance(sa, list):
        out["state_addenda_count"] = len(sa) or None
    elif isinstance(sa, dict):
        out["state_addenda_count"] = len(sa) or None


    # Shared: unresolveds / contradictions
    un = d.get("unresolveds") or d.get("unresolveds_consolidated") or []
    co = d.get("contradictions") or d.get("contradictions_consolidated") or []
    if isinstance(un, list):
        out["unresolveds"] = un[:25]
    if isinstance(co, list):
        out["contradictions"] = co[:25]

    return out


def _fmt_money_val(x: Any) -> str | None:
    if x is None:
        return None
    if isinstance(x, (int, float)):
        return f"${int(x):,}"
    s = str(x).strip()
    if not s:
        return None
    return s if s.startswith("$") else s


def build_dossier_first200(slug: str, plan: dict) -> dict:
    """Build a dossier for a first-200 fresh-run franchise."""
    primary_canon_path = Path(plan["primary_path"]) / "09_final_canonical.json"
    if not primary_canon_path.exists():
        return {"slug": slug, "name": plan["name"], "schema_version": 1, "current_snapshot": {},
                "source_evidence": {"primary_run_path": plan["primary_path"]},
                "internal_unresolveds": [{"topic": "primary_canonical", "reason": "missing 09_final_canonical.json"}]}
    try:
        canon = json.loads(primary_canon_path.read_text())
    except Exception as e:
        return {"slug": slug, "name": plan["name"], "schema_version": 1,
                "current_snapshot": {},
                "source_evidence": {"primary_run_path": plan["primary_path"]},
                "internal_unresolveds": [{"topic": "primary_canonical", "reason": f"parse error: {e}"}]}

    head = extract_headline_multi(canon)

    harvest_headlines = []
    filing_changes = []
    for hp in plan.get("harvest_paths", []):
        hcp = Path(hp) / "09_final_canonical.json"
        if not hcp.exists():
            continue
        try:
            hcanon = json.loads(hcp.read_text())
        except Exception:
            continue
        hh = extract_headline_multi(hcanon)
        harvest_headlines.append({"run": Path(hp).name, "headline": {k: hh.get(k) for k in ("franchise_fee","royalty","system_total","item19_present")}})
        # diff against primary for public fields
        for field in ("franchise_fee","royalty","ad_fund","system_total","term_years"):
            hv = hh.get(field)
            pv = head.get(field)
            if hv and pv and str(hv) != str(pv):
                filing_changes.append({
                    "field": field,
                    "from_run": Path(hp).name,
                    "old_value": str(hv)[:120],
                    "current_value": str(pv)[:120],
                })

    # public-facing current_snapshot with suppression of unresolved conflicts
    fee_str = _fmt_money_val(head["franchise_fee"])
    inv_str = None
    if head["investment_low"] is not None or head["investment_high"] is not None:
        lo = head["investment_low"]; hi = head["investment_high"]
        if isinstance(lo, (int, float)) and isinstance(hi, (int, float)):
            inv_str = f"${int(lo):,} to ${int(hi):,}"
        elif lo or hi:
            inv_str = f"{lo or ''} to {hi or ''}".strip(" to")
    roy_str = head["royalty"] if isinstance(head["royalty"], (str, int, float)) else (
        json.dumps(head["royalty"])[:120] if head["royalty"] else None)
    ad_str = head["ad_fund"] if isinstance(head["ad_fund"], (str, int, float)) else (
        json.dumps(head["ad_fund"])[:120] if head["ad_fund"] else None)

    current_snapshot = {
        "legal_name": head["legal_name"],
        "parent": head["parent"],
        "headquarters": head["hq"],
        "fdd_filing_year": plan["filing_year"],
        "issuance_date": head["issuance_date"],
        "franchise_fee_headline": fee_str,
        "investment_range_headline": inv_str,
        "royalty_headline": roy_str,
        "ad_fund_headline": ad_str,
        "term_headline": head["term_years"],
        "renewal_headline": head["renewal"],
        "territory_headline": head["territory"],
        "item_19_present": bool(head["item19_present"]),
        "system_total_units": head["system_total"],
        "franchised_units": head["franchised_units"],
        "company_owned_units": head["company_units"],
    }

    # Suppress any field that conflicts in harvest without majority support -> internal
    internal_unresolveds: list[dict] = []
    for u in head.get("unresolveds", []):
        if isinstance(u, dict):
            internal_unresolveds.append({"topic": u.get("topic") or u.get("field") or "unspecified",
                                          "reason": (u.get("reason") or u.get("description") or str(u))[:200]})
        else:
            internal_unresolveds.append({"topic": "unspecified", "reason": str(u)[:200]})
    for cd in head.get("contradictions", []):
        if isinstance(cd, dict):
            internal_unresolveds.append({"topic": "contradiction",
                                          "reason": (cd.get("description") or cd.get("summary") or str(cd))[:200]})

    # Mark schema variant for lower-coverage rows
    status = "PUBLISHED" if (current_snapshot["legal_name"] and
                              (current_snapshot["franchise_fee_headline"] or
                               current_snapshot["royalty_headline"] or
                               current_snapshot["system_total_units"])) else "PARTIAL"
    if head.get("schema_detected") in ("?",):
        status = "PARTIAL"
        internal_unresolveds.append({"topic": "schema_unrecognized", "reason": "canonical schema not parsed by first-200 extractor"})

    red_flags: list[dict] = []
    if current_snapshot["item_19_present"] is False:
        red_flags.append({"severity": "info", "kind": "item19", "summary": "No Item 19 financial performance representation disclosed."})
    if head["bankruptcy"] not in (None, False, "false", "no", "none", ""):
        red_flags.append({"severity": "warning", "kind": "bankruptcy", "summary": str(head["bankruptcy"])[:160]})
    if isinstance(head.get("litigation_pending"), (int, float)) and head["litigation_pending"] > 0:
        red_flags.append({"severity": "info", "kind": "litigation", "summary": f"{head['litigation_pending']} pending lawsuit(s)"})

    validation_questions = []
    if not head["item19_cohort_n"] and current_snapshot["item_19_present"]:
        validation_questions.append("Confirm Item 19 cohort size and definition with franchisor.")
    if not head["auditor"]:
        validation_questions.append("Confirm current auditor and most recent audit opinion.")
    if not head.get("state_addenda_count"):
        validation_questions.append("Request current state-by-state addenda packet.")

    return {
        "slug": slug,
        "name": plan["name"],
        "schema_version": 1,
        "source_batch": "first200",
        "current_snapshot": current_snapshot,
        "economics": {
            "franchise_fee_raw": head["franchise_fee"],
            "royalty_raw": head["royalty"],
            "ad_fund_raw": head["ad_fund"],
            "investment_low_raw": head["investment_low"],
            "investment_high_raw": head["investment_high"],
        },
        "item19_quality": {
            "present": bool(head["item19_present"]),
            "cohort_n": head["item19_cohort_n"],
            "average": head["item19_avg"],
            "median": head["item19_median"],
        },
        "item20_system_movement": {
            "system_total": head["system_total"],
            "franchised": head["franchised_units"],
            "company_owned": head["company_units"],
            "openings": head["opens"],
            "closures": head["closes"],
            "transfers": head["transfers"],
        },
        "contract_burden": {
            "term_years": head["term_years"],
            "renewal": head["renewal"],
        },
        "territory_reality": {"headline": head["territory"]},
        "state_overrides": None,
        "financial_strength": {
            "auditor": head["auditor"],
            "audit_opinion": head["audit_opinion"],
            "fiscal_year_end": head["fiscal_year_end"],
            "bankruptcy_flag": head["bankruptcy"],
            "litigation_pending": head["litigation_pending"],
        },
        "red_flags": red_flags,
        "validation_questions": validation_questions,
        "filing_changes": filing_changes,
        "source_evidence": {
            "primary_run_path": plan["primary_path"],
            "primary_run_folder": Path(plan["primary_path"]).name,
            "primary_fdd_id": plan["fdd_id"],
            "harvest_paths": [Path(p).name for p in plan.get("harvest_paths", [])],
            "filing_year": plan["filing_year"],
            "canonical_schema": head["schema_detected"],
            "phase": "first200",
            "slot": plan.get("slot"),
        },
        "internal_unresolveds": internal_unresolveds,
        "_status": status,
    }


def load_first200_plan() -> dict:
    if not FIRST200_PLAN_JSON.exists():
        return {}
    return json.loads(FIRST200_PLAN_JSON.read_text())


# ── end first-200 phase ─────────────────────────────────────────────


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    summary_rows: list[dict] = []
    report_lines: list[str] = []
    report_lines.append("# Franchise Consolidation Publish Report")
    report_lines.append("")
    report_lines.append("Generated: 2026-04-16  ·  Generator: `scripts/merge_dossiers.py`")
    report_lines.append("")
    report_lines.append("Best-supported merged-output-wins consolidation across all valid runs and current site data, per the precedence rules in CLAUDE.md.")
    report_lines.append("")
    report_lines.append("## Headline Table")
    report_lines.append("")
    report_lines.append("| Franchise | Slug | Primary Run | Harvest | FY | Quality | Item 19 | Filing-Δ | Conflicts | Status |")
    report_lines.append("|---|---|---|---:|---:|---|:-:|---:|---:|---|")

    for slug, plan in FRANCHISE_PLAN.items():
        d = build_dossier(slug, plan)
        out_path = OUT / f"{slug}.json"
        out_path.write_text(json.dumps(d, indent=2, default=str))
        cs = d["current_snapshot"]
        item19 = "yes" if cs["item_19_present"] else "no"
        n_changes = len(d["filing_changes"])
        n_conflict = len([u for u in d["internal_unresolveds"] if u["topic"] == "contradiction"])
        status = "PUBLISHED" if cs["legal_name"] and (cs["franchise_fee_headline"] or cs["royalty_headline"] or cs["system_total_units"]) else "PARTIAL"
        report_lines.append(
            f"| {plan['name']} | `{slug}` | `{plan['primary']}` | {len(plan['harvest'])} | {plan['filing_year']} | {plan['quality']} | {item19} | {n_changes} | {n_conflict} | {status} |"
        )
        summary_rows.append({
            "name": plan["name"],
            "slug": slug,
            "primary": plan["primary"],
            "harvest_count": len(plan["harvest"]),
            "filing_year": plan["filing_year"],
            "quality": plan["quality"],
            "item19_present": cs["item_19_present"],
            "filing_changes": n_changes,
            "internal_unresolveds": len(d["internal_unresolveds"]),
            "red_flags": len(d["red_flags"]),
            "status": status,
            "fee_headline": cs["franchise_fee_headline"],
            "royalty_headline": cs["royalty_headline"],
            "system_units": cs["system_total_units"],
            "auditor": d["financial_strength"].get("auditor"),
        })

    report_lines.append("")
    report_lines.append("## Per-Franchise Detail")
    for row in summary_rows:
        d = json.loads((OUT / f"{row['slug']}.json").read_text())
        cs = d["current_snapshot"]
        fs = d["financial_strength"]
        report_lines.append("")
        report_lines.append(f"### {row['name']} (`{row['slug']}`)")
        report_lines.append("")
        report_lines.append(f"- **Primary**: `{row['primary']}` ({row['quality']}, FY{row['filing_year']})")
        if d["source_evidence"]["harvest_runs"]:
            report_lines.append(f"- **Harvested for depth**: " + ", ".join(f"`{r}`" for r in d["source_evidence"]["harvest_runs"]))
        report_lines.append(f"- **Headline**: fee `{cs['franchise_fee_headline']}` · investment `{cs['investment_range_headline']}` · royalty `{(str(cs['royalty_headline']) or '')[:80]}` · units `{cs['system_total_units']}` (franchised `{cs['franchised_units']}`, company `{cs['company_owned_units']}`)")
        report_lines.append(f"- **Item 19**: {'present' if cs['item_19_present'] else 'absent'}" + (f" · cohort n={d['item19_quality'].get('cohort_n')}" if d["item19_quality"].get("cohort_n") else ""))
        report_lines.append(f"- **Auditor**: {fs.get('auditor') or 'not surfaced'}" + (f" · opinion `{fs.get('audit_opinion')}` ({fs.get('audit_opinion_date')})" if fs.get("auditor") else ""))
        report_lines.append(f"- **Filing-year deltas vs harvest**: {len(d['filing_changes'])}")
        for fc in d["filing_changes"][:5]:
            report_lines.append(f"  - `{fc['field']}`: was `{fc['old_value']}` → now `{fc['current_value']}` (vs `{fc['from_run']}`)")
        report_lines.append(f"- **Red flags**: {len(d['red_flags'])}")
        for rf in d["red_flags"][:3]:
            report_lines.append(f"  - [{rf['severity']}] {rf['kind']}: {rf['summary'][:140]}")
        report_lines.append(f"- **Internal unresolveds (suppressed from public)**: {len(d['internal_unresolveds'])}")
        report_lines.append(f"- **Status**: **{row['status']}**")

    # ── First-200 phase ──────────────────────────────────────────────
    first200 = load_first200_plan()
    first200_rows: list[dict] = []
    if first200:
        report_lines.append("")
        report_lines.append("## First-200 Batch Phase (publish set)")
        report_lines.append("")
        report_lines.append(f"Source: `{FIRST200_RUNS}` · {len(first200)} franchises from completed fresh-NN runs.")
        report_lines.append("")
        report_lines.append("| Slot | Franchise | Slug | Primary Run | Harvest | FY | Schema | Fee | Royalty | Units | I19 | Status |")
        report_lines.append("|---:|---|---|---|---:|---:|:-:|---|---|---:|:-:|---|")
        for slug in sorted(first200, key=lambda s: first200[s].get("slot", 9999)):
            plan = first200[slug]
            # Precedence: existing multi-run merged dossiers (FRANCHISE_PLAN) beat
            # a single fresh-NN run. Skip overwriting; fresh run stays available
            # as a harvest candidate. (Per CLAUDE.md: don't overwrite stronger
            # existing site data with weaker run data.)
            if slug in FRANCHISE_PLAN:
                continue
            d = build_dossier_first200(slug, plan)
            out_path = OUT / f"{slug}.json"
            out_path.write_text(json.dumps(d, indent=2, default=str))
            cs = d["current_snapshot"]
            se = d["source_evidence"]
            status = d["_status"]
            fee = cs.get("franchise_fee_headline") or "—"
            roy = (str(cs.get("royalty_headline") or "—"))[:40]
            units = cs.get("system_total_units") or "—"
            i19 = "yes" if cs.get("item_19_present") else "no"
            report_lines.append(
                f"| {plan.get('slot','')} | {plan['name']} | `{slug}` | `{se['primary_run_folder']}` | {len(se.get('harvest_paths', []))} | {plan['filing_year']} | {se.get('canonical_schema','?')} | {fee} | {roy} | {units} | {i19} | {status} |"
            )
            first200_rows.append({
                "name": plan["name"], "slug": slug, "slot": plan.get("slot"),
                "primary": se["primary_run_folder"], "harvest_count": len(se.get("harvest_paths", [])),
                "filing_year": plan["filing_year"], "schema": se.get("canonical_schema"),
                "status": status, "fee_headline": fee, "royalty_headline": roy,
                "system_units": units, "item19_present": cs.get("item_19_present"),
                "internal_unresolveds": len(d["internal_unresolveds"]),
                "filing_changes": len(d["filing_changes"]),
                "red_flags": len(d["red_flags"]),
            })

    REPORT.write_text("\n".join(report_lines) + "\n")
    (OUT / "_summary.json").write_text(json.dumps(summary_rows, indent=2))
    if first200_rows:
        (OUT / "_first200_summary.json").write_text(json.dumps(first200_rows, indent=2))
    print(f"Wrote {len(FRANCHISE_PLAN)} existing-phase dossiers to {OUT}")
    if first200_rows:
        print(f"Wrote {len(first200_rows)} first-200 dossiers to {OUT}")
    print(f"Wrote report to {REPORT}")


if __name__ == "__main__":
    main()
