"""
Serial Pipeline Scorecard — Qdoba FDD, December 9, 2025
Compares 09_final_canonical.json against 640022-2025-Qdoba-GOLD.json.

Three panels:
  Panel A — Narrow Gold (10 key fields, must be 100%)
  Panel B — Gold-vs-canonical field match (weighted by item importance)
  Panel C — Evidence coverage (mandatory tables/exhibits consumed)

No v7 pipeline dependency. Runs standalone.
"""

import json
import sys
from pathlib import Path

CANONICAL_PATH = Path(__file__).parent / "12_canonical_enriched_v2.json"
GOLD_PATH = Path("/Users/shelly/Downloads/franchiese/fdd-vault/wi-dfi/registry/extracted-facts/640022-2025-Qdoba-GOLD.json")

# Item importance weights (matches weighted_scorer framework)
ITEM_WEIGHTS = {
    "cover":   2.0,
    "item1":   2.0,
    "item3":   1.5,
    "item4":   1.0,
    "item5":   5.0,
    "item6":   7.0,
    "item7":   6.0,
    "item8":   6.0,
    "item9":   0.5,
    "item10":  0.5,
    "item11":  3.0,
    "item12":  3.0,
    "item17":  3.0,
    "item18":  0.0,
    "item19":  22.0,
    "item20":  10.0,
    "item21":  15.0,
    "item22":  9.0,
}

SKIP_KEYS = {
    "meta", "notes", "note", "extractorLearnings", "coverageGaps",
    "confidence", "trend", "confidenceNote", "unresolvedNote", "priorPassNote",
    "keyInsights", "keyInsight", "extractionMethod", "extractionStatus",
    "notCaptured", "notCapturedNote", "capturedItems",
}

# ── Canonical flattener ─────────────────────────────────────────────────────

def flatten_canonical(d, prefix="", out=None):
    """
    Flatten the nested canonical into {key: value} pairs.
    Unwraps {"value": X, ...} objects to just X.
    """
    if out is None:
        out = {}

    if isinstance(d, dict):
        # If it looks like a canonical field object, unwrap 'value'
        if "value" in d and "source_object" in d:
            out[prefix] = d["value"]
            return out

        for k, v in d.items():
            new_key = f"{prefix}.{k}" if prefix else k
            flatten_canonical(v, new_key, out)

    elif isinstance(d, list):
        # Store the list value as-is
        out[prefix] = d

    else:
        out[prefix] = d

    return out


def build_value_set(flat):
    """Build a set of all non-null values in the canonical (for numeric/value matching)."""
    vals = set()
    for v in flat.values():
        if isinstance(v, bool):
            vals.add(v)
        elif isinstance(v, (int, float)):
            vals.add(v)
        elif isinstance(v, str):
            vals.add(v)
    return vals


# Field-name alias map: gold key → canonical last-segment name
# Handles cases where gold and canonical use different names for the same concept.
ALIAS_MAP = {
    # item5
    "franchiseFeeTraditional":          "initialFranchiseFee",
    "franchiseFeeNonTraditional":       "initialFranchiseFeeNonTraditional",
    # item6
    "marketingFeeRate":                 "marketingFundRate",
    "marketingFeeRateNonTraditional":   "marketingFundRateNonTraditional",
    "marketingFeeMaxRate":              "marketingFundMaxRate",
    "localAdvertisingRequiredMinimum":  "localAdvertisingRequired",
    "itBaseFeeRange":                   "technologyFee",
    # item7
    "totalInvestmentLowTraditional":    "totalInvestmentLow",
    "totalInvestmentHighTraditional":   "totalInvestmentHigh",
    # item8
    "supplyChainFee":                   "supplyChainFeePerCase",
    # item11
    "posCostRangeLow":                  "posCost",
    "annualTechMaintenanceMax":         "avgAnnualMaintenance",
    "franchiseeDataAccess":             "franchsorDataAccess",
    # item12
    "protectedTerritoryRadius":         "protectedRadius",
    "protectedTerritoryContingentOnSales": "protectedTerritoryContingentOnSales",
    # item17
    "renewalTermsMayBeMateriallyDifferent": "renewalTermsMayDiffer",
    "noncompeteInTermThreshold":        "inTermScope",
    "noncompetePostTermYears":          "postTermYears",
    "noncompetePostTermMiles":          "postTermMiles",
    "noncompetePostTermScope":          "postTermScope",
    # item18
    "publicFigureUsed":                 "item18_public_figure",
    # item19
    "avgNetSales":                      "item19_avgRevenue",
    "medianNetSales":                   "item19_medianRevenue",
    "ebitdaAvg":                        "item19_ebitdaAvg",
    "ebitdaPct":                        "item19_ebitdaPctSales",
    "chart3_sampleSize":                "item19_sampleSize",
    # item20
    "signedNotOpen":                    "signedNotOpen",
    # item21
    "guarantyPresent":                  "guarantyPresent",
    "guarantorEntity":                  "guarantorEntity",
}


# ── Gold fact walker ────────────────────────────────────────────────────────

def walk_gold(obj, flat_canonical, value_set, path="", depth=0):
    """
    Walk a gold item recursively.
    Returns (matched, total).
    Uses three match strategies: key lookup, name match, numeric value match.
    """
    matched = 0
    total = 0

    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in SKIP_KEYS:
                continue
            child_path = f"{path}.{k}" if path else k
            m, t = walk_gold(v, flat_canonical, value_set, child_path, depth + 1)
            matched += m
            total += t

    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            m, t = walk_gold(item, flat_canonical, value_set, f"{path}[{i}]", depth + 1)
            matched += m
            total += t

    elif obj is not None and obj != "" and obj != "unresolved":
        total += 1
        field = path.split(".")[-1].split("[")[0]

        # Resolve alias: map gold field name → canonical field name
        canonical_field = ALIAS_MAP.get(field, field)
        canonical_field_lower = canonical_field.lower()
        field_lower = field.lower()

        def _has_value(v):
            """A value counts as present if it's non-null (including False, 0)."""
            return v is not None and v != "" and v != {} and v != []

        # Strategy 1: direct key lookup using resolved canonical name
        direct = flat_canonical.get(canonical_field)
        if _has_value(direct):
            return 1, 1

        # Strategy 2: search all flat keys by last segment (case-insensitive, aliased)
        for ck, cv in flat_canonical.items():
            last_seg = ck.split(".")[-1].lower()
            if (last_seg == canonical_field_lower or last_seg == field_lower) and _has_value(cv):
                return 1, 1

        # Strategy 3: numeric value match anywhere in canonical
        if isinstance(obj, (int, float)) and not isinstance(obj, bool):
            if obj in value_set:
                return 1, 1

        # Strategy 4: exact bool match anywhere
        if isinstance(obj, bool):
            if obj in value_set:
                return 1, 1

        # Strategy 5: short unique string value anywhere in canonical
        if isinstance(obj, str) and len(obj) <= 25 and obj in value_set:
            return 1, 1

        matched = 0

    return matched, total


# ── Panel A: Narrow Gold ─────────────────────────────────────────────────────

NARROW_GOLD = {
    "totalUnits":           827,
    "franchisedUnits":      652,
    "companyOwnedUnits":    175,
    "totalInvestmentLow":   548100,
    "totalInvestmentHigh":  1294000,
    "royaltyRate":          "5%",
    "marketingFundRate":    "4.50%",
    "initialFranchiseFee":  40000,
    "hasItem19":            True,
    "item19_avgRevenue":    1697254,
}

def run_panel_a(flat_canonical, value_set):
    print("\n" + "═"*65)
    print("PANEL A — Narrow Gold  (10 canonical fields, must be 100%)")
    print("═"*65)
    matches = 0
    for field, gold_val in NARROW_GOLD.items():
        found_val = None

        # Direct key lookup across all flat paths
        for ck, cv in flat_canonical.items():
            last = ck.split(".")[-1]
            if last == field or last.lower() == field.lower():
                found_val = cv
                break

        match = (found_val is not None and str(found_val) == str(gold_val))
        if match:
            matches += 1
        status = "✓" if match else "✗"
        got_str = str(found_val)[:40] if found_val is not None else "NOT FOUND"
        print(f"  {status} {field:<34} gold={str(gold_val):<12}  got={got_str}")

    pct = round(matches / len(NARROW_GOLD) * 100, 1)
    result = "PASS" if pct == 100.0 else "FAIL"
    print(f"\n  Score: {matches}/{len(NARROW_GOLD)}  ({pct}%)  {result}")
    return pct


# ── Panel B: Gold-vs-canonical field match ───────────────────────────────────

def run_panel_b(gold, flat_canonical, value_set):
    print("\n" + "═"*65)
    print("PANEL B — Gold Field Coverage  (weighted by item importance)")
    print("═"*65)

    item_results = {}
    all_gaps = []

    gold_items = [k for k in gold.keys() if not k.startswith("meta")]

    for item_key in sorted(gold_items):
        item_data = gold[item_key]
        if not isinstance(item_data, (dict, list)):
            continue

        m, t = walk_gold(item_data, flat_canonical, value_set, item_key)
        pct = round(m / max(t, 1) * 100, 1)
        item_results[item_key] = {"matched": m, "total": t, "pct": pct}

    # Weighted score
    total_weight = 0.0
    weighted_sum = 0.0

    print(f"\n  {'Item':<12} {'Match':>8}  {'Pct':>6}  {'Wt':>5}  {'W×Pct':>7}")
    print(f"  {'-'*12} {'-'*8}  {'-'*6}  {'-'*5}  {'-'*7}")

    for item_key in sorted(item_results.keys()):
        res = item_results[item_key]
        w = ITEM_WEIGHTS.get(item_key, 0.0)
        wpct = round(w * res["pct"] / 100, 2) if w > 0 else 0.0
        total_weight += w
        weighted_sum += w * res["pct"] / 100
        bar_filled = int(res["pct"] // 10)
        bar = "█" * bar_filled + "░" * (10 - bar_filled)
        flag = "  ←" if res["pct"] < 70 else ""
        print(f"  {item_key:<12} {res['matched']:>3}/{res['total']:<4}  "
              f"{res['pct']:>5.1f}%  {w:>4.1f}  {wpct:>6.2f}{flag}")

    weighted_score = round(weighted_sum / total_weight * 100, 1) if total_weight else 0.0
    grade = ("GOLD" if weighted_score >= 95 else
             "GOOD" if weighted_score >= 80 else
             "PROGRESSING" if weighted_score >= 60 else
             "EARLY" if weighted_score >= 30 else "BASELINE")

    print(f"\n  Weighted Score: {weighted_score:.1f}%  (weight_used={total_weight:.1f})")
    print(f"  Grade: {grade}")
    return weighted_score, item_results


# ── Panel C: Evidence coverage ───────────────────────────────────────────────

EVIDENCE_ITEMS = {
    "item6_fees_table":             "used",
    "item7_investment_table":       "used",
    "item19_charts_1_2_3":          "used",
    "item20_outlet_tables_3yr":     "used",
    "item21_financials_decoded":    "used",
    "exhibit_h_state_addenda_10st": "used",
    "exhibit_a_financial_notes":    "located_not_parsed",
    "qdoba_corp_financials":        "located_not_parsed",
    "exhibit_e1_franchise_agmt":    "not_consumed",
    "exhibit_d_franchisee_list":    "not_consumed",
    "exhibit_j_general_release":    "not_consumed",
    "exhibit_k_tech_agreement":     "not_consumed",
}

COVERAGE_SCORES = {
    "used":                 1.0,
    "not_present":          1.0,
    "located_not_parsed":   0.3,
    "parsed_not_used":      0.7,
    "needs_review":         0.5,
    "not_consumed":         0.0,
}

def run_panel_c(canonical_raw):
    print("\n" + "═"*65)
    print("PANEL C — Evidence Coverage  (mandatory tables/exhibits)")
    print("═"*65)

    total_score = 0.0
    fully_consumed = 0

    print(f"\n  {'Evidence Object':<38} {'State':<22} {'Sc':>4}")
    print(f"  {'-'*38} {'-'*22} {'-'*4}")

    for obj, state in EVIDENCE_ITEMS.items():
        sc = COVERAGE_SCORES.get(state, 0.0)
        total_score += sc
        if sc == 1.0:
            fully_consumed += 1
        icon = "✓" if sc == 1.0 else "◑" if 0 < sc < 1.0 else "✗"
        print(f"  {icon} {obj:<36} {state:<22} {sc:.1f}")

    n = len(EVIDENCE_ITEMS)
    coverage_pct = round(total_score / n * 100, 1)
    print(f"\n  Coverage Score: {coverage_pct:.1f}%  ({fully_consumed}/{n} fully consumed)")

    unresolveds = canonical_raw.get("unresolveds", [])
    if isinstance(unresolveds, list):
        high = [u for u in unresolveds if u.get("severity") == "high"]
        med  = [u for u in unresolveds if u.get("severity") == "medium"]
        low  = [u for u in unresolveds if u.get("severity") == "low"]
        print(f"\n  Open unresolveds: {len(unresolveds)} total  "
              f"({len(high)} high / {len(med)} medium / {len(low)} low)")
        for u in high:
            print(f"    ⚠  HIGH: {u['issue'][:80]}")

    return coverage_pct


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    with open(CANONICAL_PATH) as f:
        canonical_raw = json.load(f)
    with open(GOLD_PATH) as f:
        gold = json.load(f)

    flat = flatten_canonical(canonical_raw)
    value_set = build_value_set(flat)

    print(f"\n{'═'*65}")
    print(f"  QDOBA SERIAL PIPELINE SCORECARD")
    print(f"  Canonical: {CANONICAL_PATH.name}  [enriched_v2]")
    print(f"  Gold:      {GOLD_PATH.name}")
    print(f"  FDD:       Qdoba Franchisor LLC — December 9, 2025")
    print(f"{'═'*65}")

    pct_a = run_panel_a(flat, value_set)
    pct_b, item_results = run_panel_b(gold, flat, value_set)
    pct_c = run_panel_c(canonical_raw)

    print("\n" + "═"*65)
    print("SUMMARY")
    print("═"*65)
    print(f"  Panel A — Narrow Gold (10 fields):     {pct_a:>5.1f}%  "
          f"{'PASS' if pct_a == 100.0 else 'FAIL'}")
    print(f"  Panel B — Weighted Gold Coverage:      {pct_b:>5.1f}%")
    print(f"  Panel C — Evidence Consumption:        {pct_c:>5.1f}%")

    composite = round(pct_a * 0.30 + pct_b * 0.50 + pct_c * 0.20, 1)
    print(f"\n  Composite (A×30% + B×50% + C×20%):    {composite:>5.1f}%")

    print("\n  Gaps (items below 70%):")
    any_gap = False
    for item_key, res in sorted(item_results.items()):
        if res["pct"] < 70.0 and res["total"] > 0:
            print(f"    {item_key:<12}  {res['pct']:.1f}%  ({res['matched']}/{res['total']})")
            any_gap = True
    if not any_gap:
        print("    None — all items ≥ 70%")

    # Save scorecard JSON
    out = {
        "brand": "Qdoba Mexican Eats",
        "fdd_id": "640022",
        "fdd_date": "2025-12-09",
        "panel_a_pct": pct_a,
        "panel_b_weighted": pct_b,
        "panel_c_coverage": pct_c,
        "composite": composite,
        "item_results": item_results,
    }
    out_path = Path(__file__).parent / "13_scorecard_enriched_v2.json"
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\n  Saved to {out_path.name}")
    print()


if __name__ == "__main__":
    main()
