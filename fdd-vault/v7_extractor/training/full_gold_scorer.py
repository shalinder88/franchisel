"""
Full Gold Scorer — Three-Scoreboard Comparison System

Scoreboard A: Narrow gold (10 key economics fields) — smoke test, must be 100%
Scoreboard B: Manual-gold parity — scored against canonical export only
Scoreboard C: Source consumption — tables/exhibits/pages consumed vs required

Rule: No brand is "done" until all three pass.

IMPORTANT: Scoreboard B reads ONLY from canonical_export.build_canonical_export().
It never digs through engines, evidence, or brand internals.
Alias resolution comes from canonical_export.build_reverse_alias_map().
"""

import json
import os
from typing import Dict, List, Any, Optional, Tuple

from ..canonical_export import build_canonical_export, build_reverse_alias_map


def load_manual_gold(brand_slug: str) -> Optional[Dict]:
    """Load the full manual gold extraction for a brand."""
    paths = [
        f"wi-dfi/registry/extracted-facts/{brand_slug}-GOLD.json",
        f"v7_extractor/training/gold_brands/{brand_slug}/manual_gold.json",
    ]
    for path in paths:
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
    return None


# ══════════════════════════════════════════════════════════════════════════════
# SCOREBOARD A: Narrow Gold (10 key fields)
# ══════════════════════════════════════════════════════════════════════════════

NARROW_GOLD_FIELDS = [
    "totalUnits", "franchisedUnits", "companyOwnedUnits",
    "totalInvestmentLow", "totalInvestmentHigh",
    "royaltyRate", "marketingFundRate",
    "initialFranchiseFee", "hasItem19", "item19_avgRevenue",
]

def score_narrow_gold(gold_output: Dict, canonical: Dict) -> Dict[str, Any]:
    """Score against the 10 narrow gold fields using canonical export."""
    matches = 0
    misses = []
    for field in NARROW_GOLD_FIELDS:
        gold_val = gold_output.get(field)
        actual_val = canonical.get(field)
        if gold_val is not None and str(gold_val) == str(actual_val):
            matches += 1
        elif gold_val is not None:
            misses.append({"field": field, "gold": gold_val, "got": actual_val})

    return {
        "scoreboard": "A_narrow_gold",
        "total_fields": len(NARROW_GOLD_FIELDS),
        "matches": matches,
        "misses": len(misses),
        "pct": round(matches / len(NARROW_GOLD_FIELDS) * 100, 1),
        "pass": len(misses) == 0,
        "miss_details": misses,
    }


# ══════════════════════════════════════════════════════════════════════════════
# SCOREBOARD B: Manual-Gold Parity (canonical export only)
# ══════════════════════════════════════════════════════════════════════════════

# Fields in manual gold that are meta/provenance, not extraction targets
SKIP_FIELDS = {"confidence", "notes", "trend", "extractionConfidence",
               "confidenceNote", "sampleQuality"}


def score_manual_gold(manual_gold: Dict, canonical: Dict) -> Dict[str, Any]:
    """Score against the full manual gold using canonical export ONLY.

    For each gold field: look up in canonical export via alias map.
    No engine digging. No evidence fishing. Just lookup.
    """
    alias_map = build_reverse_alias_map()

    item_scores = {}
    total_gold = 0
    total_found = 0
    all_gaps = []

    for item_key in sorted(manual_gold.keys()):
        if not item_key.startswith("item"):
            continue

        gold_data = manual_gold[item_key]
        if not isinstance(gold_data, dict):
            continue

        item_found = 0
        item_total = 0
        item_gaps = []

        for key, gold_val in gold_data.items():
            if key in SKIP_FIELDS:
                continue

            item_total += 1

            # Resolve through alias map → canonical field name
            canonical_key = alias_map.get(key, key)
            ext_val = canonical.get(canonical_key)

            # Also try direct key if alias didn't resolve differently
            if ext_val is None and canonical_key == key:
                ext_val = canonical.get(key)

            # False IS a valid value. Only None, "", {}, [] are "not found".
            has_value = (ext_val is not None and ext_val != "" and
                        ext_val != {} and ext_val != [])

            if has_value:
                item_found += 1
            else:
                gold_preview = str(gold_val)[:60] if not isinstance(gold_val, (dict, list)) else f"[{type(gold_val).__name__}]"
                item_gaps.append({
                    "item": item_key,
                    "field": key,
                    "canonical_key": canonical_key if canonical_key != key else None,
                    "gold_value": gold_preview,
                    "extractor_value": str(ext_val)[:40] if ext_val is not None else "NOT_IN_CANONICAL",
                })

        item_scores[item_key] = {
            "found": item_found,
            "total": item_total,
            "pct": round(item_found / max(item_total, 1) * 100, 1),
            "gaps": item_gaps,
        }

        total_gold += item_total
        total_found += item_found
        all_gaps.extend(item_gaps)

    # Classify gaps by item family
    families = {}
    FAMILY_MAP = {
        "item1": "identity", "item2": "leadership", "item3": "litigation",
        "item4": "bankruptcy", "item5": "initial_fees", "item6": "fee_details",
        "item7": "investment", "item8": "supplier", "item10": "financing",
        "item11": "support", "item12": "territory", "item15": "participation",
        "item16": "product", "item17": "contract_terms", "item18": "public_figure",
        "item19": "item19_depth", "item20": "outlets", "item21": "financials",
    }
    for gap in all_gaps:
        family = FAMILY_MAP.get(gap["item"], "other")
        families.setdefault(family, []).append(gap)

    pct = round(total_found / max(total_gold, 1) * 100, 1)
    grade = ("gold" if pct >= 95 else "good" if pct >= 80 else
             "progressing" if pct >= 60 else "early" if pct >= 30 else "baseline")

    return {
        "scoreboard": "B_manual_gold_parity",
        "total_gold_fields": total_gold,
        "found": total_found,
        "missed": total_gold - total_found,
        "pct": pct,
        "grade": grade,
        "pass": pct >= 60,
        "item_scores": item_scores,
        "failure_families": {k: len(v) for k, v in sorted(families.items(), key=lambda x: -len(x[1]))},
        "top_gaps": all_gaps[:20],
    }


# ══════════════════════════════════════════════════════════════════════════════
# SCOREBOARD C: Source Consumption
# ══════════════════════════════════════════════════════════════════════════════

def score_consumption(extraction: Dict) -> Dict[str, Any]:
    """Score source consumption from the consumption registry."""
    consumption = extraction.get("consumption_summary", {})

    return {
        "scoreboard": "C_source_consumption",
        "total_required": consumption.get("total_required", 0),
        "unconsumed": consumption.get("unconsumed_count", 0),
        "publish_blocked": consumption.get("publish_blocked", False),
        "status_counts": consumption.get("status_counts", {}),
        "pass": consumption.get("unconsumed_count", 999) == 0,
    }


# ══════════════════════════════════════════════════════════════════════════════
# MASTER SCORER
# ══════════════════════════════════════════════════════════════════════════════

def run_full_scoring(brand_slug: str,
                     narrow_gold: Dict,
                     extraction: Dict,
                     manual_gold_path: Optional[str] = None) -> Dict[str, Any]:
    """Run all three scoreboards.

    Builds canonical export ONCE, then all scoreboards read from it.
    """
    # Build canonical export — the ONLY truth layer
    canonical = build_canonical_export(extraction)

    # Scoreboard A: narrow gold
    score_a = score_narrow_gold(narrow_gold, canonical)

    # Scoreboard B: manual-gold parity
    manual_gold = None
    if manual_gold_path and os.path.exists(manual_gold_path):
        with open(manual_gold_path) as f:
            manual_gold = json.load(f)
    if not manual_gold:
        manual_gold = load_manual_gold(brand_slug)

    score_b = score_manual_gold(manual_gold, canonical) if manual_gold else {
        "scoreboard": "B_manual_gold_parity",
        "status": "no_manual_gold_available",
    }

    # Scoreboard C: source consumption
    score_c = score_consumption(extraction)

    all_pass = (score_a.get("pass", False) and
                score_b.get("pass", False) and
                score_c.get("pass", False))

    return {
        "brand": brand_slug,
        "overall_pass": all_pass,
        "scoreboard_A": score_a,
        "scoreboard_B": score_b,
        "scoreboard_C": score_c,
        "canonical_field_count": len(canonical),
        "canonical_non_null": sum(1 for v in canonical.values()
                                  if v is not None and v != "" and v != {} and v != []),
    }
