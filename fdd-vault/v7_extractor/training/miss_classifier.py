"""
Miss Classifier

Classifies extraction misses into the miss taxonomy.
Every miss gets a class, severity, and generalizability assessment.

Used by the reverse training loop to convert brand-specific failures
into general extraction rules.
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


def classify_miss(expected: Dict, actual: Dict, brand: str) -> ExtractionMiss:
    """Classify a single miss by comparing expected vs actual output.

    Returns an ExtractionMiss with classification.
    """
    miss = ExtractionMiss(
        brand=brand,
        fact_expected=str(expected.get("value", ""))[:200],
        fact_actual=str(actual.get("value", ""))[:200] if actual else None,
    )

    field_name = expected.get("field", "")

    # Classify by field type
    if field_name in ("totalUnits", "franchisedUnits", "companyOwnedUnits"):
        miss.miss_class = MissClass.TABLE_DETECTION if actual is None else MissClass.ENGINE_MAPPING
        miss.severity = MissSeverity.FATAL
    elif field_name in ("totalInvestmentLow", "totalInvestmentHigh"):
        miss.miss_class = MissClass.TABLE_DETECTION if actual is None else MissClass.ENGINE_MAPPING
        miss.severity = MissSeverity.FATAL
    elif field_name in ("royaltyRate", "marketingFundRate"):
        miss.miss_class = MissClass.ENGINE_MAPPING
        miss.severity = MissSeverity.MAJOR
    elif field_name == "hasItem19":
        miss.miss_class = MissClass.DISCOVERY_LANE
        miss.severity = MissSeverity.FATAL
    elif "exhibit" in field_name.lower():
        miss.miss_class = MissClass.EXHIBIT_FOLLOWTHROUGH
        miss.severity = MissSeverity.MAJOR
    elif "state" in field_name.lower() or "addend" in field_name.lower():
        miss.miss_class = MissClass.STATE_ADDENDUM
        miss.severity = MissSeverity.MAJOR

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
                {"field": field_name, "value": actual_val} if actual_val else None,
                brand,
            )
            misses.append(miss)

    return misses
