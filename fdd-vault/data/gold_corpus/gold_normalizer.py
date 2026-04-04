"""
Gold Corpus Normalizer — Convert any gold schema into canonical per-fact records.

Input: raw GOLD JSON file (any of the 3 schemas: item-based, module-based, lightweight)
Output: list of canonical gold fact records with family assignment

The normalizer flattens nested structures into individual facts while preserving:
- source item/module provenance
- value type
- evidence mode (direct text, table, derived, etc.)
- family assignment for teaching corpus
"""

import json
import os
import glob
from typing import Dict, Any, List, Optional


# ══════════════════════════════════════════════════════════════════════════════
# FAMILY MAPPING — which gold keys map to which teaching families
# ══════════════════════════════════════════════════════════════════════════════

# Module → family mapping (for Schema B)
MODULE_FAMILY_MAP = {
    "moduleA_counterpartyAndSystem": "identity",
    "moduleB_entryAndCapex": "investment",  # contains item5 + item7
    "moduleC_feeStackEngine": "fee_details",
    "moduleD_supplierControl": "supplier",
    "moduleE_killSwitch": "contract_terms",
    "moduleF_financing": "financing",
    "moduleG_supportAndOperations": "support",
    "moduleH_territoryIPControl": "territory",
    "moduleJ_item19TeachingEngine": "item19_performance",
    "moduleK_item20TrendEngine": "outlets",
    "moduleL_financialStrengthEngine": "financials",
    "moduleM_documentPackage": "document",
}

# Item → family mapping (for Schema A and C)
ITEM_FAMILY_MAP = {
    "item1": "identity",
    "item2": "leadership",
    "item3": "litigation",
    "item3_litigation": "litigation",
    "item4": "bankruptcy",
    "item4_bankruptcy": "bankruptcy",
    "item5": "investment",
    "item6": "fee_details",
    "item7": "investment",
    "item8": "supplier",
    "item10": "financing",
    "item11": "support",
    "item12": "territory",
    "item15": "participation",
    "item16": "product",
    "item17": "contract_terms",
    "item18": "public_figure",
    "item19": "item19_performance",
    "item20": "outlets",
    "item21": "financials",
}

# Keys to skip (meta, computed, non-extractable)
SKIP_KEYS = {
    "meta", "redFlags", "strengths", "scores", "extractorLearnings",
    "coverageGaps", "brandExtension", "confidence", "confidenceNote",
    "notes", "trend", "keyInsight", "keyInsights",
}


# ══════════════════════════════════════════════════════════════════════════════
# CORE NORMALIZER
# ══════════════════════════════════════════════════════════════════════════════

def normalize_gold_file(gold_path: str) -> Dict[str, Any]:
    """Normalize a single gold file into canonical facts.

    Returns:
        {
            "brand_id": str,
            "brand_name": str,
            "fdd_id": str,
            "fdd_year": int,
            "gold_schema": "item_based" | "module_based" | "lightweight",
            "source_file": str,
            "facts": [canonical fact records],
            "fact_count": int,
            "family_counts": {family: count},
        }
    """
    with open(gold_path) as f:
        raw = json.load(f)

    meta = raw.get("meta", {})
    brand_name = meta.get("brandName", os.path.basename(gold_path).split("-GOLD")[0])
    brand_id = _slugify(brand_name)
    fdd_id = meta.get("fddId", os.path.basename(gold_path).split("-")[0])
    fdd_year = meta.get("fddYear", 2025)

    # Detect schema type
    has_items = any(k.startswith("item") and k[4:].split("_")[0].isdigit() for k in raw.keys())
    has_modules = any(k.startswith("module") for k in raw.keys())
    item_count = sum(1 for k in raw.keys() if k.startswith("item"))

    if item_count >= 10 and has_modules:
        schema = "item_based"  # McDonald's-style: deep items + modules
    elif has_modules:
        schema = "module_based"  # CFA/Jersey Mike's style
    else:
        schema = "lightweight"  # Small brands

    facts = []
    for key, value in raw.items():
        if key in SKIP_KEYS:
            continue
        if not isinstance(value, (dict, list, str, int, float, bool)):
            continue

        # Determine family
        family = ITEM_FAMILY_MAP.get(key) or MODULE_FAMILY_MAP.get(key)
        if not family:
            if key.startswith("item"):
                family = "other"
            elif key.startswith("module"):
                family = "other"
            elif key == "specialRisks":
                family = "identity"
            else:
                continue  # Skip unknown top-level keys

        # Determine source item
        source_item = _extract_item_number(key)

        # Flatten into facts
        if isinstance(value, dict):
            _flatten_dict(value, key, family, source_item, brand_id, fdd_year, facts)
        elif isinstance(value, list):
            _flatten_list(value, key, family, source_item, brand_id, fdd_year, facts)
        else:
            facts.append(_make_fact(
                brand_id=brand_id, fdd_year=fdd_year, family=family,
                field=key, value=value, source_item=source_item,
                path=key,
            ))

    # Count by family
    family_counts = {}
    for fact in facts:
        fam = fact["family"]
        family_counts[fam] = family_counts.get(fam, 0) + 1

    return {
        "brand_id": brand_id,
        "brand_name": brand_name,
        "fdd_id": fdd_id,
        "fdd_year": fdd_year,
        "gold_schema": schema,
        "source_file": gold_path,
        "facts": facts,
        "fact_count": len(facts),
        "family_counts": family_counts,
    }


def _flatten_dict(obj: Dict, parent_key: str, family: str, source_item: Optional[int],
                  brand_id: str, fdd_year: int, facts: List, depth: int = 0):
    """Recursively flatten a dict into facts."""
    if depth > 4:
        # Too deep — store as object
        facts.append(_make_fact(
            brand_id=brand_id, fdd_year=fdd_year, family=family,
            field=parent_key, value=obj, source_item=source_item,
            path=parent_key, value_type="object",
        ))
        return

    for k, v in obj.items():
        if k in ("confidence", "confidenceNote", "notes", "trend", "keyInsight", "keyInsights"):
            continue
        path = f"{parent_key}.{k}"

        # Sub-family override: item5 vs item7 inside moduleB
        sub_family = family
        if "item5" in k.lower():
            sub_family = "investment"
        elif "item7" in k.lower():
            sub_family = "investment"
        elif "item3" in k.lower():
            sub_family = "litigation"
        elif "item4" in k.lower():
            sub_family = "bankruptcy"

        sub_item = _extract_item_number(k) or source_item

        if isinstance(v, dict):
            _flatten_dict(v, path, sub_family, sub_item, brand_id, fdd_year, facts, depth + 1)
        elif isinstance(v, list):
            _flatten_list(v, path, sub_family, sub_item, brand_id, fdd_year, facts, depth + 1)
        elif v is not None:
            facts.append(_make_fact(
                brand_id=brand_id, fdd_year=fdd_year, family=sub_family,
                field=k, value=v, source_item=sub_item,
                path=path,
            ))


def _flatten_list(lst: list, parent_key: str, family: str, source_item: Optional[int],
                  brand_id: str, fdd_year: int, facts: List, depth: int = 0):
    """Flatten a list into facts."""
    if not lst:
        return

    # If list of simple values, store as single fact
    if all(isinstance(v, (str, int, float, bool)) for v in lst):
        facts.append(_make_fact(
            brand_id=brand_id, fdd_year=fdd_year, family=family,
            field=parent_key.split(".")[-1], value=lst, source_item=source_item,
            path=parent_key, value_type="list",
        ))
        return

    # If list of objects, flatten each with index
    for i, item in enumerate(lst):
        if isinstance(item, dict):
            _flatten_dict(item, f"{parent_key}[{i}]", family, source_item,
                         brand_id, fdd_year, facts, depth + 1)
        elif item is not None:
            facts.append(_make_fact(
                brand_id=brand_id, fdd_year=fdd_year, family=family,
                field=f"{parent_key.split('.')[-1]}[{i}]", value=item,
                source_item=source_item, path=f"{parent_key}[{i}]",
            ))


def _make_fact(brand_id: str, fdd_year: int, family: str, field: str,
               value: Any, source_item: Optional[int] = None,
               path: str = "", value_type: str = None) -> Dict:
    """Create a single canonical gold fact record."""
    if value_type is None:
        if isinstance(value, bool):
            value_type = "boolean"
        elif isinstance(value, int):
            value_type = "integer"
        elif isinstance(value, float):
            value_type = "float"
        elif isinstance(value, str):
            value_type = "string"
        elif isinstance(value, list):
            value_type = "list"
        elif isinstance(value, dict):
            value_type = "object"
        else:
            value_type = "unknown"

    return {
        "brand_id": brand_id,
        "fdd_year": fdd_year,
        "family": family,
        "field": field,
        "value": value,
        "value_type": value_type,
        "source_item": source_item,
        "path": path,
        "gold_origin": "manual_extraction",
        "source_status": "needs_evidence_linking",
    }


def _extract_item_number(key: str) -> Optional[int]:
    """Extract FDD item number from a key like 'item17' or 'item3_litigation'."""
    import re
    m = re.match(r'item(\d+)', key)
    if m:
        return int(m.group(1))
    return None


def _slugify(name: str) -> str:
    """Convert brand name to slug."""
    import re
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug


# ══════════════════════════════════════════════════════════════════════════════
# BATCH NORMALIZER — process all GOLD files
# ══════════════════════════════════════════════════════════════════════════════

def normalize_all_gold(gold_dir: str = "wi-dfi/registry/extracted-facts") -> Dict[str, Any]:
    """Find and normalize all GOLD files.

    Returns corpus summary with per-brand results.
    """
    gold_files = sorted(glob.glob(os.path.join(gold_dir, "*GOLD*")))
    if not gold_files:
        return {"error": "No GOLD files found", "searched": gold_dir}

    brands = []
    all_facts = []
    family_totals = {}

    for gf in gold_files:
        result = normalize_gold_file(gf)
        brands.append({
            "brand_id": result["brand_id"],
            "brand_name": result["brand_name"],
            "fdd_id": result["fdd_id"],
            "gold_schema": result["gold_schema"],
            "fact_count": result["fact_count"],
            "family_counts": result["family_counts"],
            "source_file": gf,
        })
        all_facts.extend(result["facts"])
        for fam, count in result["family_counts"].items():
            family_totals[fam] = family_totals.get(fam, 0) + count

    return {
        "total_brands": len(brands),
        "total_facts": len(all_facts),
        "family_totals": dict(sorted(family_totals.items(), key=lambda x: -x[1])),
        "brands": brands,
        "all_facts": all_facts,
    }


# ══════════════════════════════════════════════════════════════════════════════
# FAMILY CORPUS BUILDER
# ══════════════════════════════════════════════════════════════════════════════

def build_family_corpora(corpus_result: Dict) -> Dict[str, Any]:
    """Split normalized facts into per-family teaching corpora.

    For each family, produces:
    - examples: facts with non-null values (positive teaching)
    - negatives: facts with False/None/0/"not disclosed" values
    - brand_coverage: which brands contribute examples
    """
    all_facts = corpus_result.get("all_facts", [])

    families = {}
    for fact in all_facts:
        fam = fact["family"]
        if fam not in families:
            families[fam] = {"examples": [], "negatives": [], "brand_coverage": set()}

        families[fam]["brand_coverage"].add(fact["brand_id"])

        # Classify as positive or negative
        val = fact["value"]
        is_negative = (
            val is False or
            val is None or
            val == 0 or
            (isinstance(val, str) and any(neg in val.lower() for neg in
                ["not disclosed", "none", "no ", "does not", "n/a"]))
        )

        if is_negative:
            families[fam]["negatives"].append(fact)
        else:
            families[fam]["examples"].append(fact)

    # Summarize
    summary = {}
    for fam, data in sorted(families.items()):
        summary[fam] = {
            "examples": len(data["examples"]),
            "negatives": len(data["negatives"]),
            "brand_count": len(data["brand_coverage"]),
            "brands": sorted(data["brand_coverage"]),
        }

    return {
        "family_count": len(families),
        "summary": summary,
        "families": {fam: {
            "examples": data["examples"],
            "negatives": data["negatives"],
            "brand_coverage": sorted(data["brand_coverage"]),
        } for fam, data in families.items()},
    }


if __name__ == "__main__":
    result = normalize_all_gold()
    print(f"Normalized {result['total_brands']} brands, {result['total_facts']} facts")
    print(f"\nFamily totals:")
    for fam, count in result["family_totals"].items():
        print(f"  {fam}: {count}")

    print(f"\nPer-brand:")
    for b in result["brands"]:
        print(f"  {b['brand_name']}: {b['fact_count']} facts ({b['gold_schema']})")
