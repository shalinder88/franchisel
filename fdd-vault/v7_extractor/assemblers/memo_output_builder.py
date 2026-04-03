"""
Memo Output Builder

Produces structured memo blocks for different audiences:
  - lender_memo: financial metrics for lending decisions
  - attorney_memo: contract terms and risk flags for legal review
  - buyer_questions: validation-call question set for prospective buyers

These are Layer C outputs — derived ONLY from Layer B engines.
"""

from typing import Dict, Any, List


def build_lender_memo(engines: Dict[str, Any], evidence: Dict) -> Dict[str, Any]:
    """Build lender-focused memo block."""
    fin = engines.get("financial_statement_engine", {})
    i19 = engines.get("item19_engine", {})
    i20 = engines.get("item20_engine", {})

    return {
        "brand_revenue": fin.get("franchisorRevenue"),
        "brand_assets": fin.get("franchisorTotalAssets"),
        "brand_net_income": fin.get("franchisorNetIncome"),
        "auditor": fin.get("auditorName"),
        "opinion": fin.get("auditorOpinion"),
        "going_concern": fin.get("goingConcernWarning", False),
        "strength_signal": fin.get("financialStrengthSignal"),
        "unit_average_revenue": i19.get("average_revenue"),
        "system_units": i20.get("total_end", 0),
        "net_growth": i20.get("net_growth", 0),
        "investment_low": evidence.get("totalInvestmentLow"),
        "investment_high": evidence.get("totalInvestmentHigh"),
    }


def build_attorney_memo(engines: Dict[str, Any]) -> Dict[str, Any]:
    """Build attorney-focused memo block."""
    contract = engines.get("contract_burden_engine", {})
    ks = engines.get("kill_switch_engine", {})

    return {
        "initial_term": contract.get("initial_term_years"),
        "renewal_term": contract.get("renewal_term_years"),
        "cure_period": contract.get("cure_period_days"),
        "noncompete_years": contract.get("noncompete_years"),
        "noncompete_miles": contract.get("noncompete_miles"),
        "mandatory_arbitration": contract.get("mandatory_arbitration"),
        "dispute_venue": contract.get("dispute_venue"),
        "transfer_fee": contract.get("transfer_fee"),
        "kill_switches": {
            "minimum_payments": ks.get("minimum_payments"),
            "sales_performance": ks.get("sales_performance_requirement"),
            "immediate_termination": ks.get("immediate_termination_triggers"),
            "cross_default": ks.get("cross_default"),
            "spousal_guaranty": ks.get("spousal_guaranty"),
        },
    }


def build_buyer_questions(engines: Dict[str, Any],
                          evidence: Dict,
                          coverage: Dict[int, str]) -> List[str]:
    """Build validation-call question set for prospective buyers.

    Questions are generated from gaps, risks, and notable findings.
    """
    questions = []

    # From Item 19
    if evidence.get("hasItem19"):
        questions.append("What percentage of franchisees meet or exceed the average revenue shown in Item 19?")
        questions.append("Does the Item 19 data include or exclude franchisees who closed during the measurement period?")
    else:
        questions.append("Why does the FDD not include a Financial Performance Representation (Item 19)?")

    # From Item 20
    i20 = engines.get("item20_engine", {})
    net = i20.get("net_growth", 0)
    if net < 0:
        questions.append(f"The system lost {abs(net)} net units last year. What is driving closures?")
    if i20.get("total_end", 0) == 0:
        questions.append("What is the current total unit count? Item 20 data was not fully extracted.")

    # From kill switches
    ks = engines.get("kill_switch_engine", {})
    if ks.get("minimum_payments"):
        questions.append("What happens if I cannot meet the minimum payment requirement?")
    if ks.get("sales_performance_requirement"):
        questions.append("What is the specific sales performance threshold, and what happens if I miss it?")
    if ks.get("cross_default"):
        questions.append("If I default on the loan, does that automatically default the franchise agreement?")

    # From territory
    territory = engines.get("territory_engine", {})
    if territory.get("exclusiveTerritory") is False:
        questions.append("Since the territory is non-exclusive, what prevents the franchisor from opening nearby?")

    # From missing items
    not_found = [n for n, s in coverage.items() if s == "not_found"]
    if not_found:
        questions.append(f"Items {not_found} were not located in this FDD. Can you provide those sections?")

    return questions


def build_all_memos(engines: Dict[str, Any],
                    evidence: Dict,
                    coverage: Dict[int, str]) -> Dict[str, Any]:
    """Build all memo outputs."""
    return {
        "lender_memo": build_lender_memo(engines, evidence),
        "attorney_memo": build_attorney_memo(engines),
        "buyer_questions": build_buyer_questions(engines, evidence, coverage),
    }
