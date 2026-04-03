"""
Gold Runner — Reverse Training Loop

For each gold brand:
  1. Run extractor fully
  2. Load gold expected output
  3. Compare extractor output to gold
  4. Generate miss report with classified misses
  5. Output actionable lessons

This is the extractor's main learning system.
"""

import json
import os
from typing import Dict, List, Any, Optional
from .miss_classifier import generate_miss_report, ExtractionMiss, MissSeverity


GOLD_BRANDS_DIR = os.path.join(os.path.dirname(__file__), "gold_brands")
MISS_REPORTS_DIR = os.path.join(os.path.dirname(__file__), "miss_reports")


def load_gold_output(brand_slug: str) -> Optional[Dict]:
    """Load the gold expected output for a brand."""
    path = os.path.join(GOLD_BRANDS_DIR, brand_slug, "gold_output.json")
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return None


def save_miss_report(brand_slug: str, misses: List[ExtractionMiss], run_output: Dict):
    """Save the miss report for a brand run."""
    os.makedirs(MISS_REPORTS_DIR, exist_ok=True)
    report = {
        "brand": brand_slug,
        "total_misses": len(misses),
        "fatal_misses": sum(1 for m in misses if m.severity == MissSeverity.FATAL),
        "major_misses": sum(1 for m in misses if m.severity == MissSeverity.MAJOR),
        "moderate_misses": sum(1 for m in misses if m.severity == MissSeverity.MODERATE),
        "misses": [
            {
                "fact_expected": m.fact_expected,
                "fact_actual": m.fact_actual,
                "miss_class": m.miss_class.value,
                "severity": m.severity.value,
                "source_page": m.source_page,
                "source_item": m.source_item,
                "why_missed": m.why_missed,
                "generalizable_rule": m.generalizable_rule,
                "is_brand_patch": m.is_brand_patch,
            }
            for m in misses
        ],
    }
    path = os.path.join(MISS_REPORTS_DIR, f"{brand_slug}_miss_report.json")
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    return report


def run_gold_comparison(brand_slug: str, extractor_output: Dict) -> Dict[str, Any]:
    """Run the full gold comparison for one brand.

    Returns comparison results with miss report.
    """
    gold = load_gold_output(brand_slug)
    if not gold:
        return {"status": "no_gold_output", "brand": brand_slug}

    # Get the brand output from extractor
    brand_output = extractor_output.get("brand", {})

    # Generate miss report
    misses = generate_miss_report(gold, brand_output, brand_slug)

    # Save report
    report = save_miss_report(brand_slug, misses, extractor_output)

    return {
        "status": "compared",
        "brand": brand_slug,
        "total_misses": len(misses),
        "fatal": report["fatal_misses"],
        "major": report["major_misses"],
        "moderate": report["moderate_misses"],
        "pass": report["fatal_misses"] == 0,
    }


def run_all_gold_brands(run_extractor_fn, pdf_dir: str) -> Dict[str, Any]:
    """Run the extractor on all gold brands and compare.

    run_extractor_fn: function that takes a PDF path and returns extraction result
    pdf_dir: directory containing PDFs

    Returns summary of all brand comparisons.
    """
    results = []
    brands_passed = 0
    brands_failed = 0

    # List all gold brand packages
    if os.path.exists(GOLD_BRANDS_DIR):
        brand_slugs = [d for d in os.listdir(GOLD_BRANDS_DIR)
                       if os.path.isdir(os.path.join(GOLD_BRANDS_DIR, d))]
    else:
        brand_slugs = []

    for slug in sorted(brand_slugs):
        # Find PDF for this brand
        gold_meta = load_gold_output(slug)
        if not gold_meta:
            continue

        pdf_name = gold_meta.get("source_pdf", "")
        pdf_path = os.path.join(pdf_dir, pdf_name)
        if not os.path.exists(pdf_path):
            results.append({"brand": slug, "status": "pdf_not_found"})
            continue

        # Run extractor
        try:
            output = run_extractor_fn(pdf_path)
            comparison = run_gold_comparison(slug, output)
            results.append(comparison)
            if comparison.get("pass"):
                brands_passed += 1
            else:
                brands_failed += 1
        except Exception as e:
            results.append({"brand": slug, "status": "error", "error": str(e)[:200]})
            brands_failed += 1

    return {
        "total_brands": len(brand_slugs),
        "passed": brands_passed,
        "failed": brands_failed,
        "results": results,
    }
