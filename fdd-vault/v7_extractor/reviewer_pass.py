"""
Reviewer Pass

The reviewer decides:
  - what matters most (surface_priority)
  - what gets surfaced vs backend-only
  - what language needs caution labels
  - whether publish gates are met
  - what data is missing

This is the human-in-the-loop layer between extraction and publication.

Outputs:
  - surface_priority: ordered list of what to show first
  - backend_only_flags: fields that should not appear in public reports
  - caution_labels: fields that need qualification language
  - publish_recommendation: reviewer's publish decision
  - missing_data_list: what the extraction didn't capture
"""

from typing import Dict, List, Any
from .models import ItemSection, FailureState, TABLE_REQUIRED_ITEMS


def build_reviewer_outputs(items: Dict[int, ItemSection],
                           evidence: Dict,
                           coverage: Dict[int, str],
                           engines: Dict[str, Any]) -> Dict[str, Any]:
    """Build all reviewer-facing outputs.

    These help a human reviewer make publish decisions.
    """
    return {
        "surface_priority": _build_surface_priority(evidence, engines),
        "backend_only_flags": _build_backend_flags(evidence),
        "caution_labels": _build_caution_labels(evidence, engines),
        "publish_recommendation": _build_recommendation(coverage, evidence),
        "missing_data_list": _build_missing_list(coverage, evidence),
    }


def _build_surface_priority(evidence: Dict, engines: Dict) -> List[str]:
    """What matters most — ordered by importance for a buyer."""
    priority = []

    # Always surface these if present
    if evidence.get("totalUnits"):
        priority.append("system_size_and_trend")
    if evidence.get("hasItem19"):
        priority.append("revenue_performance_data")
    if evidence.get("totalInvestmentLow"):
        priority.append("total_investment_range")
    if evidence.get("royaltyRate"):
        priority.append("ongoing_fee_burden")

    # Kill switches
    ks = engines.get("kill_switch_engine", {})
    if any(ks.get(k) for k in ["minimum_payments", "sales_performance_requirement",
                                 "immediate_termination_triggers", "cross_default"]):
        priority.append("kill_switch_warnings")

    # Financial health
    fin = engines.get("financial_statement_engine", {})
    if fin.get("goingConcernWarning"):
        priority.insert(0, "going_concern_warning")  # top priority
    if fin.get("financialStrengthSignal") in ("weak", "watch"):
        priority.append("franchisor_financial_condition")

    # Territory
    territory = engines.get("territory_engine", {})
    if territory.get("exclusiveTerritory") is False:
        priority.append("non_exclusive_territory")

    return priority


def _build_backend_flags(evidence: Dict) -> List[str]:
    """Fields that should remain backend-only in public reports."""
    flags = []
    # Raw table data is backend only
    flags.append("fee_rows")
    flags.append("investment_rows")
    flags.append("mapped_rows")
    flags.append("unresolved_rows")
    # Reviewer queue details
    flags.append("reviewer_queues")
    # Internal scoring inputs
    flags.append("evidence_store_raw")
    return flags


def _build_caution_labels(evidence: Dict, engines: Dict) -> List[Dict]:
    """Fields that need qualification language in reports."""
    labels = []

    # Item 19 cautions
    if evidence.get("hasItem19"):
        i19 = engines.get("item19_engine", {})
        if not i19.get("median_revenue"):
            labels.append({
                "field": "item19_avgRevenue",
                "label": "Average only — median not disclosed. Averages can be skewed by outliers.",
            })
        if i19.get("has_ebitda") is False:
            labels.append({
                "field": "item19",
                "label": "Revenue only — operating costs not disclosed. This is not profit.",
            })

    # Financial statement cautions
    fin = engines.get("financial_statement_engine", {})
    if fin.get("auditorOpinion") == "qualified":
        labels.append({
            "field": "financialStrength",
            "label": "Qualified audit opinion — review auditor's basis for qualification.",
        })

    return labels


def _build_recommendation(coverage: Dict[int, str], evidence: Dict) -> str:
    """Build a publish recommendation."""
    not_found = sum(1 for s in coverage.values() if s == "not_found")
    no_table = sum(1 for s in coverage.values() if s == "found_no_table")
    complete = sum(1 for s in coverage.values() if s == "complete")

    if complete >= 20 and not_found <= 2 and no_table == 0:
        return "recommend_gold_publish"
    elif complete >= 15 and not_found <= 5:
        return "recommend_standard_publish"
    elif complete >= 10:
        return "recommend_with_review"
    else:
        return "hold_for_major_review"


def _build_missing_list(coverage: Dict[int, str], evidence: Dict) -> List[Dict]:
    """What the extraction didn't capture."""
    missing = []
    for item_num, state in sorted(coverage.items()):
        if state in ("not_found", "found_no_table", "needs_manual_review"):
            missing.append({"item": item_num, "state": state})

    # Key fields
    if not evidence.get("totalUnits"):
        missing.append({"field": "totalUnits", "reason": "Item 20 units not extracted"})
    if not evidence.get("royaltyRate"):
        missing.append({"field": "royaltyRate", "reason": "Item 6 royalty not extracted"})
    if not evidence.get("totalInvestmentLow"):
        missing.append({"field": "totalInvestment", "reason": "Item 7 total not extracted"})

    return missing
