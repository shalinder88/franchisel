"""
Display Tier Tagger

Tags every extracted field with a display tier:
  - top_page: headline numbers shown on brand card
  - report_core: key facts in the main report body
  - report_detail: supporting detail in expandable sections
  - backend_only: stored but not shown in public reports
  - internal_only: used for scoring/comparison, never shown

This allows deep extraction without cluttering reports.
"""

from typing import Dict, Any


# Field → tier mapping
FIELD_TIERS = {
    # Top page (brand card headline)
    "totalUnits": "top_page",
    "franchisedUnits": "top_page",
    "companyOwnedUnits": "top_page",
    "initialFranchiseFee": "top_page",
    "totalInvestmentLow": "top_page",
    "totalInvestmentHigh": "top_page",
    "royaltyRate": "top_page",
    "marketingFundRate": "top_page",
    "hasItem19": "top_page",
    "item19_avgRevenue": "top_page",

    # Report core
    "initialTermYears": "report_core",
    "renewalTermYears": "report_core",
    "hasNonCompete": "report_core",
    "nonCompeteYears": "report_core",
    "nonCompeteMiles": "report_core",
    "mandatoryArbitration": "report_core",
    "disputeVenue": "report_core",
    "curePeriodDays": "report_core",
    "hasAuditedFinancials": "report_core",
    "auditorName": "report_core",
    "auditorOpinion": "report_core",
    "financialStrengthSignal": "report_core",
    "goingConcernWarning": "report_core",
    "specialRisks": "report_core",
    "offeringPaths": "report_core",
    "activeLawsuits": "report_core",
    "litigationTypes": "report_core",

    # Report detail
    "franchisorRevenue": "report_detail",
    "franchisorTotalAssets": "report_detail",
    "franchisorNetIncome": "report_detail",
    "technologyFee": "report_detail",
    "transferFee": "report_detail",
    "renewalFee": "report_detail",
    "lockInScore": "report_detail",
    "hasRequiredPurchases": "report_detail",
    "exclusiveTerritory": "report_detail",
    "territoryType": "report_detail",
    "ownerOperatorRequired": "report_detail",
    "classroomHours": "report_detail",
    "ojtHours": "report_detail",

    # Backend only
    "fee_rows": "backend_only",
    "investment_rows": "backend_only",
    "mapped_rows": "backend_only",
    "unresolved_rows": "backend_only",
    "stateOverrides": "backend_only",
    "crossRefCount": "backend_only",

    # Internal only
    "publishGate": "internal_only",
    "evidenceSummary": "internal_only",
    "failureStates": "internal_only",
    "itemCoverage": "internal_only",
}

DEFAULT_TIER = "report_detail"


def tag_display_tiers(brand_data: Dict[str, Any]) -> Dict[str, Any]:
    """Add display tier tags to every field in the brand output.

    Returns a new dict with _tier suffix for each tagged field.
    Does not modify the original data.
    """
    tagged = {}
    for key, value in brand_data.items():
        tagged[key] = value
        tier = FIELD_TIERS.get(key, DEFAULT_TIER)
        tagged[f"{key}_tier"] = tier

    return tagged


def get_tier_fields(tier: str) -> list:
    """Get all field names belonging to a specific display tier."""
    return [k for k, v in FIELD_TIERS.items() if v == tier]


def filter_by_tier(brand_data: Dict[str, Any], max_tier: str) -> Dict[str, Any]:
    """Filter brand data to only include fields at or above the given tier.

    Tier hierarchy: top_page > report_core > report_detail > backend_only > internal_only
    """
    tier_order = ["top_page", "report_core", "report_detail", "backend_only", "internal_only"]
    max_idx = tier_order.index(max_tier) if max_tier in tier_order else len(tier_order)

    filtered = {}
    for key, value in brand_data.items():
        if key.endswith("_tier"):
            continue
        tier = FIELD_TIERS.get(key, DEFAULT_TIER)
        if tier in tier_order[:max_idx + 1]:
            filtered[key] = value

    return filtered
