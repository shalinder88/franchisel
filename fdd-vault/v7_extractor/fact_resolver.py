"""
Fact Resolver — Precedence-Based Winner Selection

For many fields, multiple candidates appear:
  - cover page investment
  - Item 7 total row
  - state addendum override
  - exhibit amendment
  - narrative clause vs table row

This module populates the FactStateRegistry from extraction outputs,
runs sanity checks, and produces the resolved fact set.

Precedence order (highest → lowest):
  1. state addendum / amendment
  2. governing exhibit clause
  3. direct item table cell + linked note
  4. direct narrative clause
  5. cover-page summary
  6. derived value
  7. weak inference
"""

from typing import Dict, Any, Optional, Tuple
from .fact_state_registry import FactStateRegistry, FactState
from .models import EvidenceStore


# ══════════════════════════════════════════════════════════════════════════════
# SANITY RULES — Impossible-value checks
# ══════════════════════════════════════════════════════════════════════════════

def _check_units_total(value) -> Tuple[bool, str]:
    """Total units must be positive and reasonable."""
    if not isinstance(value, (int, float)):
        return False, f"Units is not a number: {type(value)}"
    if value <= 0:
        return False, f"Units <= 0: {value}"
    if value > 100000:
        return False, f"Units implausibly high: {value}"
    return True, ""


def _check_investment(value) -> Tuple[bool, str]:
    """Investment must be positive and between $1K and $50M."""
    if not isinstance(value, (int, float)):
        return False, f"Investment is not a number: {type(value)}"
    if value < 1000:
        return False, f"Investment < $1,000: ${value:,.0f}"
    if value > 50_000_000:
        return False, f"Investment > $50M: ${value:,.0f}"
    return True, ""


def _check_fee_rate(value) -> Tuple[bool, str]:
    """Fee rate must be parseable percentage between 0.1% and 50%."""
    if value is None:
        return False, "Fee rate is None"
    if isinstance(value, str):
        import re
        m = re.search(r'(\d+(?:\.\d+)?)', value)
        if m:
            pct = float(m.group(1))
            if 0.1 <= pct <= 50:
                return True, ""
            return False, f"Fee rate outside 0.1%-50%: {pct}%"
        return False, f"Cannot parse percentage from: {value}"
    return False, f"Fee rate is not string: {type(value)}"


def _check_franchise_fee(value) -> Tuple[bool, str]:
    """Initial franchise fee must be between $0 and $500K."""
    if not isinstance(value, (int, float)):
        return False, f"Franchise fee is not a number: {type(value)}"
    if value < 0:
        return False, f"Franchise fee negative: {value}"
    if value > 500_000:
        return False, f"Franchise fee > $500K: ${value:,.0f}"
    return True, ""


def _check_avg_revenue(value) -> Tuple[bool, str]:
    """Average revenue must be >= $10K (plausible annual sales)."""
    if not isinstance(value, (int, float)):
        return False, f"Average revenue not a number: {type(value)}"
    if value < 10_000:
        return False, f"Average revenue < $10K: ${value:,.0f}"
    if value > 100_000_000:
        return False, f"Average revenue > $100M: ${value:,.0f}"
    return True, ""


# ══════════════════════════════════════════════════════════════════════════════
# CROSS-FIELD SANITY RULES
# ══════════════════════════════════════════════════════════════════════════════

def check_cross_field_sanity(registry: FactStateRegistry) -> list:
    """Check impossible value combinations across fields.

    Returns list of violation dicts.
    """
    violations = []

    # Rule 1: total >= franchised + company
    total_rec = registry.get("totalUnits")
    fran_rec = registry.get("franchisedUnits")
    co_rec = registry.get("companyOwnedUnits")
    if total_rec and fran_rec and co_rec:
        total = total_rec.winning_value or 0
        fran = fran_rec.winning_value or 0
        co = co_rec.winning_value or 0
        if isinstance(total, (int, float)) and isinstance(fran, (int, float)) and isinstance(co, (int, float)):
            if total < fran + co:
                violations.append({
                    "rule": "total_units_less_than_components",
                    "severity": "stop_ship",
                    "detail": f"Total {total} < franchised {fran} + company {co} = {fran + co}",
                })

    # Rule 2: investment_low <= investment_high
    low_rec = registry.get("totalInvestmentLow")
    high_rec = registry.get("totalInvestmentHigh")
    if low_rec and high_rec:
        lo = low_rec.winning_value
        hi = high_rec.winning_value
        if isinstance(lo, (int, float)) and isinstance(hi, (int, float)):
            if lo > hi:
                violations.append({
                    "rule": "investment_low_exceeds_high",
                    "severity": "stop_ship",
                    "detail": f"Investment low ${lo:,.0f} > high ${hi:,.0f}",
                })

    # Rule 3: hasItem19=True requires either avg_revenue or FPR tables
    fpr_rec = registry.get("hasItem19")
    avg_rec = registry.get("item19_avgRevenue")
    if fpr_rec and fpr_rec.winning_value and not avg_rec:
        violations.append({
            "rule": "item19_present_but_no_revenue",
            "severity": "major_caution",
            "detail": "Item 19 FPR present but no average revenue extracted",
        })

    # Rule 4: fee rates should not exceed royalty
    royalty_rec = registry.get("royaltyRate")
    mktg_rec = registry.get("marketingFundRate")
    if royalty_rec and mktg_rec:
        import re
        r_match = re.search(r'(\d+(?:\.\d+)?)', str(royalty_rec.winning_value))
        m_match = re.search(r'(\d+(?:\.\d+)?)', str(mktg_rec.winning_value))
        if r_match and m_match:
            r_pct = float(r_match.group(1))
            m_pct = float(m_match.group(1))
            if m_pct > r_pct * 3:
                violations.append({
                    "rule": "marketing_exceeds_3x_royalty",
                    "severity": "reviewer_visible",
                    "detail": f"Marketing fund {m_pct}% > 3× royalty {r_pct}%",
                })

    return violations


# ══════════════════════════════════════════════════════════════════════════════
# MAIN RESOLVER
# ══════════════════════════════════════════════════════════════════════════════

def build_fact_registry(engines: Dict[str, Any],
                        bootstrap: Dict[str, Any],
                        evidence: EvidenceStore,
                        state_overrides: list) -> FactStateRegistry:
    """Build and resolve the fact registry from all extraction sources.

    Registers candidates from: bootstrap (cover), engines (items), state overrides.
    Applies sanity rules. Resolves all facts by precedence.
    """
    registry = FactStateRegistry()

    # ── Register sanity rules ──
    registry.register_sanity_rule("totalUnits", _check_units_total, "Units must be positive and < 100K")
    registry.register_sanity_rule("franchisedUnits", _check_units_total, "Franchised units check")
    registry.register_sanity_rule("companyOwnedUnits", _check_units_total, "Company units check")
    registry.register_sanity_rule("totalInvestmentLow", _check_investment, "Investment low check")
    registry.register_sanity_rule("totalInvestmentHigh", _check_investment, "Investment high check")
    registry.register_sanity_rule("royaltyRate", _check_fee_rate, "Royalty rate check")
    registry.register_sanity_rule("marketingFundRate", _check_fee_rate, "Marketing rate check")
    registry.register_sanity_rule("initialFranchiseFee", _check_franchise_fee, "Franchise fee check")
    registry.register_sanity_rule("item19_avgRevenue", _check_avg_revenue, "Average revenue check")

    # ── Register candidates from bootstrap (cover page) ──
    cover_inv = bootstrap.get("coverInvestmentRange")
    if cover_inv:
        if isinstance(cover_inv, dict):
            if cover_inv.get("low"):
                registry.register_candidate("totalInvestmentLow", cover_inv["low"],
                                            "cover_page", source_page=1)
            if cover_inv.get("high"):
                registry.register_candidate("totalInvestmentHigh", cover_inv["high"],
                                            "cover_page", source_page=1)

    # ── Register candidates from engines (table cells / items) ──
    inv_engine = engines.get("initial_investment_engine", {})
    if inv_engine.get("investment_low"):
        registry.register_candidate("totalInvestmentLow", inv_engine["investment_low"],
                                    "table_cell", source_item=7)
    if inv_engine.get("investment_high"):
        registry.register_candidate("totalInvestmentHigh", inv_engine["investment_high"],
                                    "table_cell", source_item=7)

    fee_engine = engines.get("ongoing_fee_engine", {})
    if fee_engine.get("royalty_rate"):
        registry.register_candidate("royaltyRate", fee_engine["royalty_rate"],
                                    "table_cell", source_item=6)
    if fee_engine.get("ad_fund_rate"):
        registry.register_candidate("marketingFundRate", fee_engine["ad_fund_rate"],
                                    "table_cell", source_item=6)

    init_fee_engine = engines.get("initial_fee_engine", {})
    if init_fee_engine.get("initial_franchise_fee"):
        registry.register_candidate("initialFranchiseFee", init_fee_engine["initial_franchise_fee"],
                                    "table_cell", source_item=5)

    i20_engine = engines.get("item20_engine", {})
    if i20_engine.get("total_end"):
        registry.register_candidate("totalUnits", i20_engine["total_end"],
                                    "table_cell", source_item=20)
    if i20_engine.get("franchised_end"):
        registry.register_candidate("franchisedUnits", i20_engine["franchised_end"],
                                    "table_cell", source_item=20)
    if i20_engine.get("co_end"):
        registry.register_candidate("companyOwnedUnits", i20_engine["co_end"],
                                    "table_cell", source_item=20)

    i19_engine = engines.get("item19_engine", {})
    if i19_engine.get("has_fpr") is not None:
        registry.register_candidate("hasItem19", i19_engine["has_fpr"],
                                    "table_cell", source_item=19)
    if i19_engine.get("average_revenue"):
        registry.register_candidate("item19_avgRevenue", i19_engine["average_revenue"],
                                    "table_cell", source_item=19)

    # ── Register candidates from state overrides (highest precedence) ──
    for override in state_overrides:
        domain = override.state if hasattr(override, 'state') else override.get('domain', '')
        text = override.override_text if hasattr(override, 'override_text') else override.get('text', '')
        # State overrides that modify specific fields would be registered here
        # with source_type="state_addendum"

    # ── Resolve all ──
    registry.resolve_all()

    return registry
