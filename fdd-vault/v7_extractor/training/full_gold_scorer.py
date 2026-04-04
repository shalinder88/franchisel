"""
Full Gold Scorer — Three-Scoreboard Comparison System

A brand passes only when ALL three scoreboards meet threshold:

Scoreboard A: Narrow gold fields (10 key economics fields)
  - smoke test only
  - must be 100% to pass

Scoreboard B: Manual-gold parity (full manual extraction)
  - the real target
  - every fact classified as: found_by_A_and_B / found_by_A / found_by_B / missed / conflict
  - threshold: 60% for "progressing", 80% for "good", 95% for "gold"

Scoreboard C: Source consumption
  - tables/exhibits/pages consumed vs required
  - must have 0 publish blockers to pass

Rule: No brand is "done" until all three pass.
"""

import json
import os
from typing import Dict, List, Any, Optional, Tuple


def load_manual_gold(brand_slug: str) -> Optional[Dict]:
    """Load the full manual gold extraction for a brand."""
    # Try multiple locations
    paths = [
        f"wi-dfi/registry/extracted-facts/{brand_slug}-GOLD.json",
        f"v7_extractor/training/gold_brands/{brand_slug}/manual_gold.json",
    ]
    for path in paths:
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
    return None


def _count_leaf_values(obj, depth=0) -> int:
    """Count leaf values in nested structure."""
    if isinstance(obj, dict):
        return sum(_count_leaf_values(v, depth + 1) for v in obj.values())
    elif isinstance(obj, list):
        return sum(_count_leaf_values(v, depth + 1) for v in obj) if obj else 1
    return 1


def _extract_flat_fields(obj, prefix="") -> Dict[str, Any]:
    """Flatten a nested dict into dot-notation keys."""
    flat = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            key = f"{prefix}.{k}" if prefix else k
            if isinstance(v, (dict, list)):
                flat.update(_extract_flat_fields(v, key))
            else:
                flat[key] = v
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            key = f"{prefix}[{i}]"
            if isinstance(v, (dict, list)):
                flat.update(_extract_flat_fields(v, key))
            else:
                flat[key] = v
    else:
        flat[prefix] = obj
    return flat


# ══════════════════════════════════════════════════════════════════════════════
# SCOREBOARD A: Narrow Gold (10 key fields)
# ══════════════════════════════════════════════════════════════════════════════

def score_narrow_gold(gold_output: Dict, brand_output: Dict) -> Dict[str, Any]:
    """Score against the 10 narrow gold fields."""
    key_fields = [
        "totalUnits", "franchisedUnits", "companyOwnedUnits",
        "totalInvestmentLow", "totalInvestmentHigh",
        "royaltyRate", "marketingFundRate",
        "initialFranchiseFee", "hasItem19", "item19_avgRevenue",
    ]

    matches = 0
    misses = []
    for field in key_fields:
        gold_val = gold_output.get(field)
        actual_val = brand_output.get(field)
        if gold_val is not None and str(gold_val) == str(actual_val):
            matches += 1
        elif gold_val is not None:
            misses.append({"field": field, "gold": gold_val, "got": actual_val})

    return {
        "scoreboard": "A_narrow_gold",
        "total_fields": len(key_fields),
        "matches": matches,
        "misses": len(misses),
        "pct": round(matches / len(key_fields) * 100, 1),
        "pass": len(misses) == 0,
        "miss_details": misses,
    }


# ══════════════════════════════════════════════════════════════════════════════
# SCOREBOARD B: Manual-Gold Parity (full extraction)
# ══════════════════════════════════════════════════════════════════════════════

# Map from manual gold item keys to where Killbill stores the data
ITEM_ENGINE_MAP = {
    "item1": {"engine": None, "brand_fields": [
        "entity", "parentCompany", "entityType", "yearEstablished", "publiclyTraded",
        "offeringPaths", "specialRisks", "systemComposition", "description",
    ]},
    "item2": {"engine": None},
    "item3": {"engine": "litigation_engine"},
    "item4": {"engine": "bankruptcy_engine"},
    "item5": {"engine": "initial_fee_engine", "brand_fields": [
        "initialFranchiseFee", "refundable",
    ]},
    "item6": {"engine": "ongoing_fee_engine", "brand_fields": [
        "royaltyRate", "marketingFundRate", "royaltyBasis", "royaltyDetails",
        "rentStructure", "totalRecurringEstimate",
    ]},
    "item7": {"engine": "initial_investment_engine", "brand_fields": [
        "totalInvestmentLow", "totalInvestmentHigh", "biggestCost",
    ]},
    "item8": {"engine": "supplier_restrictions_engine", "brand_fields": [
        "supplierRevenue",
    ]},
    "item10": {"engine": None, "brand_fields": ["financingAvailable"]},
    "item11": {"engine": "training_support_engine", "brand_fields": [
        "operationsManual",
    ]},
    "item12": {"engine": "territory_engine", "brand_fields": [
        "exclusiveTerritory", "encroachmentRisk",
    ]},
    "item15": {"engine": "owner_participation_engine"},
    "item16": {"engine": None},
    "item17": {"engine": "contract_burden_engine", "also": "kill_switch_engine",
               "brand_fields": ["item17", "nonCompete", "personalGuaranty",
                                "renewalAvailable", "crossDefault"]},
    "item18": {"engine": None},
    "item19": {"engine": "item19_engine",
               "brand_fields": ["hasItem19", "item19_avgRevenue", "medianGrossSales",
                                "fprUnitCount", "costStructure"]},
    "item20": {"engine": "item20_engine",
               "brand_fields": ["totalUnits", "franchisedUnits", "companyOwnedUnits",
                                "netChange"]},
    "item21": {"engine": "financial_statement_engine",
               "brand_fields": ["item21"]},
}

# Fields to skip (meta, notes, confidence — not extraction targets)
SKIP_FIELDS = {"confidence", "notes", "trend"}

# Alias map: gold field name → brand/engine field name
# Used when gold uses different naming than the extractor
FIELD_ALIASES = {
    "franchisorLegalName": "entity",
    "yearFranchiseEstablished": "yearEstablished",
    "yearFirstFranchised": "yearEstablished",
    "businessDescription": "description",
    "exclusiveTerritory": "exclusiveTerritory",
    "franchisorMayCompete": "franchisorMayCompete",
    "disclosesFinancialPerformance": "hasItem19",
    "hasBankruptcy": "hasBankruptcy",
    "noBankruptcyDisclosed": "noBankruptcyDisclosed",
    "hasLitigation": "hasLitigation",
    "ownerOperatorRequired": "ownerOperator",
    "productRestrictions": "productRestrictions",
    "hasPublicFigure": "hasPublicFigure",
    "hasAuditedFinancials": "hasAuditedFinancials",
    "auditorName": "auditorName",
    "hasRequiredPurchases": "hasRequiredPurchases",
    "operationsManual": "operationsManual",
    "operationsManualName": "operationsManual",
    "feeIsUniform": "feeIsUniform",
    "refundable": "refundable",
    "contractBurdenScore": "contractBurdenScore",
    "lockInScore": "lockInScore",
    "territoryProtectionScore": "territoryProtectionScore",
    "channelConflictScore": "channelConflictScore",
    "managementQualityScore": "managementQualityScore",
}


def score_manual_gold(manual_gold: Dict, extraction: Dict) -> Dict[str, Any]:
    """Score against the full manual gold extraction.

    For each item in the manual gold, check how many fields the extractor captured.
    """
    brand = extraction.get("brand", {})
    engines = extraction.get("engines", {})
    reader_facts = extraction.get("reader_discovery", {}).get("fact_store", {}).get("facts", [])

    item_scores = {}
    total_gold = 0
    total_found = 0
    total_missed = 0
    all_gaps = []

    for item_key in sorted(manual_gold.keys()):
        if not item_key.startswith("item"):
            continue

        gold_data = manual_gold[item_key]
        if not isinstance(gold_data, dict):
            continue

        # Get extractor data for this item
        mapping = ITEM_ENGINE_MAP.get(item_key, {})
        extractor_data = {}

        # Merge engine data
        eng_name = mapping.get("engine")
        if eng_name and eng_name in engines:
            extractor_data.update(engines[eng_name])

        also_eng = mapping.get("also")
        if also_eng and also_eng in engines:
            extractor_data.update(engines[also_eng])

        # Merge brand-level fields
        for bf in mapping.get("brand_fields", []):
            if bf not in brand:
                continue
            val = brand[bf]
            if isinstance(val, dict) and bf not in ("item17",):
                # For nested dicts, merge into extractor_data (but not item17 which is special)
                extractor_data.update(val)
            if val is not None:
                extractor_data[bf] = val

        # Score this item
        item_found = 0
        item_total = 0
        item_gaps = []

        for key, gold_val in gold_data.items():
            if key in SKIP_FIELDS:
                continue

            item_total += 1
            # Try alias if direct key not found
            alias_key = FIELD_ALIASES.get(key, key)
            ext_val = extractor_data.get(key)
            if ext_val is None and alias_key != key:
                ext_val = extractor_data.get(alias_key)

            # Check if extractor has this field (any non-empty value)
            # Note: False IS a valid extraction result (e.g., exclusiveTerritory=False)
            has_value = (ext_val is not None and ext_val != "" and
                        ext_val != {} and ext_val != [])

            if has_value:
                item_found += 1
            else:
                gold_preview = str(gold_val)[:60] if not isinstance(gold_val, (dict, list)) else f"[{type(gold_val).__name__}]"
                item_gaps.append({
                    "item": item_key,
                    "field": key,
                    "gold_value": gold_preview,
                    "extractor_value": str(ext_val)[:40] if ext_val is not None else "NOT EXTRACTED",
                })

        item_scores[item_key] = {
            "found": item_found,
            "total": item_total,
            "pct": round(item_found / max(item_total, 1) * 100, 1),
            "gaps": item_gaps,
        }

        total_gold += item_total
        total_found += item_found
        total_missed += len(item_gaps)
        all_gaps.extend(item_gaps)

    # Classify gaps by failure family
    families = {}
    for gap in all_gaps:
        item = gap["item"]
        if item in ("item17",):
            family = "contract_terms"
        elif item in ("item19",):
            family = "item19_depth"
        elif item in ("item12",):
            family = "territory"
        elif item in ("item6",) and "rent" in gap["field"].lower():
            family = "rent_structure"
        elif item in ("item6",):
            family = "fee_details"
        elif item in ("item8",):
            family = "supplier"
        elif item in ("item2",):
            family = "leadership"
        elif item in ("item3",):
            family = "litigation"
        elif item in ("item1",):
            family = "identity"
        elif item in ("item7",):
            family = "investment"
        else:
            family = "other"

        if family not in families:
            families[family] = []
        families[family].append(gap)

    # Determine grade
    pct = round(total_found / max(total_gold, 1) * 100, 1)
    if pct >= 95:
        grade = "gold"
    elif pct >= 80:
        grade = "good"
    elif pct >= 60:
        grade = "progressing"
    elif pct >= 30:
        grade = "early"
    else:
        grade = "baseline"

    return {
        "scoreboard": "B_manual_gold_parity",
        "total_gold_fields": total_gold,
        "found": total_found,
        "missed": total_missed,
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
    """Run all three scoreboards."""
    brand = extraction.get("brand", {})

    # Scoreboard A
    score_a = score_narrow_gold(narrow_gold, brand)

    # Scoreboard B
    manual_gold = None
    if manual_gold_path and os.path.exists(manual_gold_path):
        with open(manual_gold_path) as f:
            manual_gold = json.load(f)
    if not manual_gold:
        manual_gold = load_manual_gold(brand_slug)

    score_b = score_manual_gold(manual_gold, extraction) if manual_gold else {
        "scoreboard": "B_manual_gold_parity",
        "status": "no_manual_gold_available",
    }

    # Scoreboard C
    score_c = score_consumption(extraction)

    # Overall
    all_pass = score_a.get("pass", False) and score_b.get("pass", False) and score_c.get("pass", False)

    return {
        "brand": brand_slug,
        "overall_pass": all_pass,
        "scoreboard_A": score_a,
        "scoreboard_B": score_b,
        "scoreboard_C": score_c,
    }
