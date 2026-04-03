"""
Visual-Ready Builder

Produces chart-ready and display-ready objects from Layer B engines.

Outputs:
  - fee_stack: stacked fee breakdown for charts
  - investment_anatomy: investment line items for waterfall charts
  - kill_switch_matrix: risk matrix for kill-switch visualization
  - item19_quality_strip: FPR data quality indicator
  - item20_trend_array: unit growth trend for sparklines
  - document_package_map: document dependency visualization
"""

from typing import Dict, Any, List


def build_fee_stack(engines: Dict[str, Any]) -> List[Dict]:
    """Build a stacked fee breakdown for chart rendering."""
    fee_engine = engines.get("ongoing_fee_engine", {})
    stack = []

    if fee_engine.get("royalty_rate"):
        stack.append({"name": "Royalty", "rate": fee_engine["royalty_rate"], "type": "recurring"})
    if fee_engine.get("ad_fund_rate"):
        stack.append({"name": "Ad Fund", "rate": fee_engine["ad_fund_rate"], "type": "recurring"})
    if fee_engine.get("technology_fee"):
        stack.append({"name": "Technology", "rate": str(fee_engine["technology_fee"]), "type": "recurring"})

    return stack


def build_investment_anatomy(engines: Dict[str, Any]) -> List[Dict]:
    """Build investment line items for waterfall chart."""
    inv_engine = engines.get("initial_investment_engine", {})
    return inv_engine.get("line_items", [])


def build_kill_switch_matrix(engines: Dict[str, Any]) -> List[Dict]:
    """Build kill-switch risk matrix."""
    ks = engines.get("kill_switch_engine", {})
    matrix = []

    fields = [
        ("minimum_payments", "Minimum Payments", "high"),
        ("sales_performance_requirement", "Sales Performance", "high"),
        ("immediate_termination_triggers", "Immediate Termination", "critical"),
        ("cross_default", "Cross-Default", "medium"),
        ("spousal_guaranty", "Spousal Guaranty", "medium"),
        ("noncompete_years", "Post-Term Non-Compete", "medium"),
    ]

    for field, label, severity in fields:
        value = ks.get(field)
        if value:
            matrix.append({"risk": label, "value": value, "severity": severity})

    return matrix


def build_item19_quality(engines: Dict[str, Any]) -> Dict[str, Any]:
    """Build Item 19 data quality indicator."""
    i19 = engines.get("item19_engine", {})
    return {
        "has_fpr": i19.get("has_fpr", False),
        "has_tables": bool(i19.get("fpr_tables")),
        "has_average": bool(i19.get("average_revenue")),
        "has_median": bool(i19.get("median_revenue")),
        "has_ebitda": i19.get("has_ebitda", False),
        "has_population_def": bool(i19.get("units_included")),
        "quality": (
            "gold" if i19.get("has_fpr") and i19.get("average_revenue") and i19.get("fpr_tables") else
            "silver" if i19.get("has_fpr") and i19.get("average_revenue") else
            "bronze" if i19.get("has_fpr") else
            "none"
        ),
    }


def build_item20_trend(engines: Dict[str, Any]) -> Dict[str, Any]:
    """Build Item 20 unit trend data for sparklines."""
    i20 = engines.get("item20_engine", {})
    return {
        "total_end": i20.get("total_end", 0),
        "franchised_end": i20.get("franchised_end", 0),
        "co_end": i20.get("co_end", 0),
        "net_growth": i20.get("net_growth", 0),
        "system_health": i20.get("system_health_signal", "unknown"),
    }


def build_all_visuals(engines: Dict[str, Any]) -> Dict[str, Any]:
    """Build all visual-ready objects from engines."""
    return {
        "fee_stack": build_fee_stack(engines),
        "investment_anatomy": build_investment_anatomy(engines),
        "kill_switch_matrix": build_kill_switch_matrix(engines),
        "item19_quality": build_item19_quality(engines),
        "item20_trend": build_item20_trend(engines),
    }
