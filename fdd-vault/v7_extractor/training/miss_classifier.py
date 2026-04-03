"""
Miss Classifier

Classifies extraction misses into the miss taxonomy.
Every miss gets a class, severity, and generalizability assessment.

Used by the reverse training loop to convert brand-specific failures
into general extraction rules.

Rule: Every fix must answer — "Is this a brand patch, or a general extraction lesson?"
Brand patches are rejected or quarantined. General lessons are kept and codified.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum


class MissClass(str, Enum):
    LOCATOR = "locator_miss"
    ITEM_IDENTITY = "item_identity_miss"
    TABLE_DETECTION = "table_detection_miss"
    SPLIT_TABLE = "split_table_miss"
    NOTE_LINKAGE = "note_linkage_miss"
    CROSS_REFERENCE = "cross_reference_miss"
    EXHIBIT_FOLLOWTHROUGH = "exhibit_followthrough_miss"
    STATE_ADDENDUM = "state_addendum_miss"
    ENGINE_MAPPING = "engine_mapping_miss"
    NORMALIZATION = "normalization_miss"
    IMPORTANCE_SCORING = "importance_scoring_miss"
    DISCOVERY_LANE = "discovery_lane_miss"
    OUTPUT_RENDER = "output_render_miss"


class MissSeverity(str, Enum):
    FATAL = "fatal"      # blocks publish
    MAJOR = "major"      # blocks high confidence
    MODERATE = "moderate" # useful but not fatal


@dataclass
class ExtractionMiss:
    """One classified miss from the reverse training loop."""
    brand: str
    fact_expected: str
    fact_actual: Optional[str] = None  # what the extractor produced (if anything)
    miss_class: MissClass = MissClass.DISCOVERY_LANE
    severity: MissSeverity = MissSeverity.MODERATE
    source_page: Optional[int] = None
    source_item: Optional[int] = None
    source_exhibit: Optional[str] = None
    source_table: Optional[str] = None
    source_note: Optional[str] = None
    why_missed: str = ""  # human explanation of root cause
    generalizable_rule: str = ""  # what general lesson this teaches
    is_brand_patch: bool = False  # True if fix only applies to this brand
    test_to_add: str = ""  # regression test to prevent recurrence


# ══════════════════════════════════════════════════════════════════════════════
# FIELD → CLASSIFICATION RULES
# Maps field names to their expected item source, miss class, severity,
# and diagnostic hints for root cause analysis.
# ══════════════════════════════════════════════════════════════════════════════

FIELD_RULES: Dict[str, Dict[str, Any]] = {
    "totalUnits": {
        "source_item": 20,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.TABLE_DETECTION,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Item 20 outlet table not detected or year-row parsing failed",
        "why_wrong": "Item 20 table parsed but wrong row/column selected for unit count",
        "rule": "Item 20 outlet tables must extract current-year end counts with source precedence: direct systemwide > derived from components",
    },
    "franchisedUnits": {
        "source_item": 20,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.TABLE_DETECTION,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Item 20 franchised outlet table not found or not parsed",
        "why_wrong": "Franchised unit count extracted from wrong table type or wrong year",
        "rule": "Franchised unit count comes from 'Status of Franchised Outlets' or 'Systemwide Outlet Summary' table, current year end column",
    },
    "companyOwnedUnits": {
        "source_item": 20,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.TABLE_DETECTION,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Item 20 company-owned outlet table not found or not parsed",
        "why_wrong": "Company-owned unit count extracted from wrong source",
        "rule": "Company-owned count comes from 'Status of Company-Owned Outlets' table or derived from systemwide minus franchised",
    },
    "totalInvestmentLow": {
        "source_item": 7,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.TABLE_DETECTION,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Item 7 investment table TOTAL row not found",
        "why_wrong": "Item 7 TOTAL row parsed but wrong column or format variant selected",
        "rule": "Item 7 must find the TOTAL/ESTIMATED TOTAL row and extract low-high range; pick standard/largest format as primary",
    },
    "totalInvestmentHigh": {
        "source_item": 7,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.TABLE_DETECTION,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Item 7 investment table TOTAL row not found",
        "why_wrong": "Item 7 TOTAL row parsed but wrong column or format variant selected",
        "rule": "Item 7 must find the TOTAL/ESTIMATED TOTAL row and extract low-high range; pick standard/largest format as primary",
    },
    "royaltyRate": {
        "source_item": 6,
        "severity": MissSeverity.MAJOR,
        "miss_class_missing": MissClass.ENGINE_MAPPING,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Fee table royalty row not classified — empty label or label in preceding row; amount text may contain rate without 'royalty' keyword",
        "why_wrong": "Fee table disambiguation mapped royalty rate to wrong fee type or picked wrong format variant",
        "rule": "In fee tables, rows with empty labels inherit fee type from most recent labeled row; amount text '% of Net Sales' is a strong royalty signal",
    },
    "marketingFundRate": {
        "source_item": 6,
        "severity": MissSeverity.MAJOR,
        "miss_class_missing": MissClass.ENGINE_MAPPING,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Marketing/ad fund row not found in fee table",
        "why_wrong": "Marketing fund rate picked wrong format variant or footnote modifies the base rate",
        "rule": "Marketing fund contributions may have footnotes that modify rate; check for NMF initiatives, cooperative overlays, and format-variant differences",
    },
    "initialFranchiseFee": {
        "source_item": 5,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.NORMALIZATION,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "Item 5 parser found franchise_fee but engine builder looked for wrong key, or fee table row not classified as franchise_fee",
        "why_wrong": "Initial fee extracted but wrong amount selected from range (should use high for standard offering)",
        "rule": "Engine builder must check both 'initial_fee' and 'franchise_fee' keys from Item 5 parser; for ranges, use high value as the standard franchise fee",
    },
    "hasItem19": {
        "source_item": 19,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.DISCOVERY_LANE,
        "miss_class_wrong": MissClass.DISCOVERY_LANE,
        "why_missing": "Item 19 not found or no-FPR pattern matched when FPR exists",
        "why_wrong": "Item 19 FPR detection logic gave wrong answer — check no-FPR patterns vs actual content",
        "rule": "Item 19 FPR detection: if section has tables with dollar amounts >= $1,000 and no 'does not make' disclaimer, has_fpr=True",
    },
    "item19_avgRevenue": {
        "source_item": 19,
        "severity": MissSeverity.FATAL,
        "miss_class_missing": MissClass.ENGINE_MAPPING,
        "miss_class_wrong": MissClass.ENGINE_MAPPING,
        "why_missing": "FPR tables exist but average_revenue not extracted — parser didn't look for 'Average Net Royalty Sales' row in Total column",
        "why_wrong": "Average revenue extracted from wrong table section (corporate vs franchised) or wrong column (quartile vs total)",
        "rule": "In FPR tables, find 'Average' rows; use the 'Total' column (last non-empty value) from the franchised-stores section; prefer franchised over combined over corporate",
    },
}


def classify_miss(expected: Dict, actual: Dict, brand: str) -> ExtractionMiss:
    """Classify a single miss by comparing expected vs actual output.

    Returns an ExtractionMiss with classification, root cause, and generalizable rule.
    """
    field_name = expected.get("field", "")
    expected_val = expected.get("value")
    actual_val = actual.get("value") if actual else None
    is_missing = actual is None or actual_val is None
    is_wrong = not is_missing and str(actual_val) != str(expected_val)

    # Look up field-specific rules
    rules = FIELD_RULES.get(field_name, {})

    if rules:
        miss_class = rules.get("miss_class_missing" if is_missing else "miss_class_wrong",
                               MissClass.DISCOVERY_LANE)
        severity = rules.get("severity", MissSeverity.MODERATE)
        why = rules.get("why_missing" if is_missing else "why_wrong", "")
        rule = rules.get("rule", "")
        source_item = rules.get("source_item")
    else:
        # Default classification for unknown fields
        miss_class = MissClass.DISCOVERY_LANE
        severity = MissSeverity.MODERATE
        why = f"Field '{field_name}' {'not found in output' if is_missing else 'has wrong value'}"
        rule = ""
        source_item = None

    miss = ExtractionMiss(
        brand=brand,
        fact_expected=str(expected_val)[:200],
        fact_actual=str(actual_val)[:200] if actual_val is not None else None,
        miss_class=miss_class,
        severity=severity,
        source_item=source_item,
        why_missed=why,
        generalizable_rule=rule,
        is_brand_patch=False,
    )

    return miss


def generate_miss_report(expected_output: Dict, actual_output: Dict,
                          brand: str) -> List[ExtractionMiss]:
    """Generate a miss report by comparing expected vs actual outputs.

    Returns list of classified misses.
    """
    misses = []

    # Compare key fields
    key_fields = [
        "totalUnits", "franchisedUnits", "companyOwnedUnits",
        "totalInvestmentLow", "totalInvestmentHigh",
        "royaltyRate", "marketingFundRate",
        "initialFranchiseFee", "hasItem19", "item19_avgRevenue",
    ]

    for field_name in key_fields:
        expected_val = expected_output.get(field_name)
        actual_val = actual_output.get(field_name)

        if expected_val is not None and actual_val != expected_val:
            miss = classify_miss(
                {"field": field_name, "value": expected_val},
                {"field": field_name, "value": actual_val} if actual_val is not None else None,
                brand,
            )
            misses.append(miss)

    return misses
