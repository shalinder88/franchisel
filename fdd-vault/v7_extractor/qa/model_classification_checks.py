"""
Model Classification Checks

Verifies the archetype classification against actual extracted data.
If the classified model doesn't match what was found, flags for review.
"""

from typing import Dict, List, Any


def check_model_classification(archetype: Dict[str, Any],
                                evidence: Dict,
                                engines: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Check if the archetype classification is consistent with extracted data.

    Returns list of findings.
    """
    findings = []
    arch = archetype.get("archetype", "other")

    # ── Fee shape consistency ──
    expected_fee = archetype.get("expected_fee_shape", "")
    royalty = evidence.get("royaltyRate")
    if royalty and "percentage" in expected_fee and "%" not in str(royalty):
        findings.append({
            "type": "fee_shape_mismatch",
            "detail": f"Archetype {arch} expects percentage fees but royalty is '{royalty}'",
            "severity": "info",
        })

    # ── Item 19 type consistency ──
    expected_i19 = archetype.get("expected_item19", "")
    has_fpr = evidence.get("hasItem19")
    if arch == "captive_site_license" and has_fpr:
        findings.append({
            "type": "unexpected_fpr",
            "detail": "Captive-site license models rarely have traditional FPR",
            "severity": "info",
        })

    # ── Restaurant without food-related supplier data ──
    if arch in ("qsr_restaurant", "full_service_restaurant"):
        i8 = engines.get("supplier_restrictions_engine", {})
        categories = i8.get("mandatoryCategories", [])
        if categories and "food_ingredients" not in categories:
            findings.append({
                "type": "missing_food_supplier",
                "detail": "Restaurant archetype but no food/ingredient supplier requirements found",
                "severity": "info",
            })

    return findings
