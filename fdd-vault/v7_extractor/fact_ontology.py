"""
Canonical Fact Ontology — Typed, Ranked, Bindable Facts

Every Lane A fact must be typed into this ontology so Lane B can consume it.
Untyped facts are noise. Typed facts are training data.

Three layers:
  1. fact_family — broad domain (economics, control, risk, performance, identity)
  2. fact_type — specific fact kind (rent_structure, renewal_right, termination_trigger)
  3. normalized_candidate — the value Lane B should try to normalize

Priority tiers:
  Tier 1: Primary economics, rent/lock-in, renewal/non-compete/termination,
          Item 19 core, Item 20 system health, financials, state overrides
  Tier 2: Support/training, financing, leadership, litigation categories
  Tier 3: Descriptive context, low-value numeric

Hard rule: Lane A facts without a fact_type are classified as "untyped"
and flagged for review. They exist but cannot flow to Lane B.
"""

import re
from typing import Dict, Any, Optional, List, Tuple
from enum import Enum


class FactFamily(str, Enum):
    ECONOMICS = "economics"
    CONTROL = "control"
    RISK = "risk"
    PERFORMANCE = "performance"
    IDENTITY = "identity"
    DOCUMENT = "document"


class FactTier(int, Enum):
    TIER_1 = 1  # Must-have for buyer decision
    TIER_2 = 2  # Important for diligence
    TIER_3 = 3  # Useful context


# ══════════════════════════════════════════════════════════════════════════════
# FACT TYPE REGISTRY — every known fact type with its family, tier, and
# the Lane B engine field it maps to
# ══════════════════════════════════════════════════════════════════════════════

FACT_TYPES: Dict[str, Dict[str, Any]] = {
    # === TIER 1: PRIMARY ECONOMICS ===
    "initial_franchise_fee": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "initialFranchiseFee", "source_items": [5],
        "signals": [r'\$[\d,]+.*?(?:initial|franchise)\s+fee', r'(?:initial|franchise)\s+fee.*?\$[\d,]+'],
    },
    "royalty_rate": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "royaltyRate", "source_items": [6],
        "signals": [r'royalt\w*.*?\d+(?:\.\d+)?%', r'\d+(?:\.\d+)?%.*?(?:of\s+)?(?:gross|net)\s+sales'],
    },
    "royalty_basis": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "royaltyBasis", "source_items": [6],
        "signals": [r'(?:gross|net)\s+sales', r'(?:of|on)\s+(?:gross|net)\s+sales'],
    },
    "royalty_conditions": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "royaltyDetails", "source_items": [6],
        "signals": [r'royalt\w*.*?(?:applies|continue|depend|circumstance|scenario|following)',
                    r'(?:4%|5%).*?(?:applies|continue|will\s+(?:apply|continue))',
                    r'(?:on\s+and\s+after|after)\s+(?:january|february|march).*?(?:royalt|rate)',
                    r'royalt\w*\s+of\s+\d+%\s+of\s+gross\s+sales\s+(?:applies|will\s+continue)'],
    },
    "advertising_fund_rate": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "marketingFundRate", "source_items": [6],
        "signals": [r'(?:advertis|marketing|ad\s+fund|opnad).*?\d+%'],
    },
    "rent_structure": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "rentStructure", "source_items": [6],
        "signals": [r'(?:base\s+rent|percentage\s+rent|pass.?thr\w+\s+rent|occupancy)', r'rent.*?(?:payable|monthly|annual)'],
    },
    "rent_component": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "rentComponents", "source_items": [6],
        "signals": [r'(?:base|percentage|pass.?thr\w+)\s+rent'],
    },
    "total_investment_range": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "totalInvestmentLow", "source_items": [7],
        "signals": [r'total.*?\$[\d,]+.*?to.*?\$[\d,]+', r'estimated\s+initial\s+investment'],
    },
    "investment_line_item": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": None, "source_items": [7],
        "signals": [r'\$[\d,]+.*?(?:equipment|leasehold|inventory|training|additional\s+funds)'],
    },
    "technology_fee": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "technologyFees", "source_items": [6],
        "signals": [r'(?:technology|software|pos|digital|kiosk).*?\$[\d,]+', r'\$[\d,]+.*?(?:technology|software)'],
    },
    "fee_variation": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "feeVariations", "source_items": [5, 6],
        "signals": [r'(?:except|prorated|varies|waived|reduced)', r'(?:satellite|sto|str|bfl|non.?traditional).*?\$'],
    },
    "total_recurring_burden": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "totalRecurringEstimate", "source_items": [6],
        "signals": [r'(?:total|combined|aggregate).*?(?:fee|obligation|burden|cost)'],
    },

    # === TIER 1: CONTRACT / RENEWAL / TERMINATION ===
    "initial_term": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_1,
        "engine_field": "initialTermYears", "source_items": [1, 17],
        "signals": [r'(?:initial|franchise)\s+term.*?\d+\s*year', r'\d+\s*year\s*(?:term|franchise)',
                    r'term\s+of\s+(?:the\s+)?franchise.*?\d+\s*year',
                    r'term.*?(?:is|of)\s+(?:usually\s+)?\d+\s*year',
                    r'(?:sto|str|bfl|satellite|traditional).*?\d+\s*year'],
    },
    "renewal_right": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "renewalAvailable", "source_items": [17],
        "signals": [r'(?:no|not)\s+(?:contractual\s+)?(?:right|option)\s+to\s+(?:renew|extend)',
                    r'renew.*?\d+\s*(?:year|term)', r'new\s+term\s+policy'],
    },
    "termination_trigger": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "terminationTriggers", "source_items": [17],
        "signals": [r'(?:terminat|default).*?(?:cause|breach|fail)', r'(?:non.?curable|immediate\s+terminat)'],
    },
    "non_compete": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "nonCompete", "source_items": [17],
        "signals": [r'non.?compet.*?\d+\s*(?:month|year|mile)', r'\d+\s*(?:month|year).*?(?:mile|radius)',
                    r'(?:compet|similar\s+business).*?(?:\d+\s*(?:month|year)|radius)',
                    r'covenant\s+not\s+to\s+compete'],
    },
    "transfer_restriction": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_1,
        "engine_field": "transferConditions", "source_items": [17],
        "signals": [r'transfer.*?(?:consent|approval|condition)', r'right\s+of\s+first\s+refusal'],
    },
    "personal_guaranty": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "personalGuaranty", "source_items": [9, 10, 17],
        "signals": [r'personal\s+guarant', r'spousal\s+guarant', r'personally\s+liable',
                    r'joint\s+and\s+several', r'indemnif'],
    },
    "mandatory_remodel": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_1,
        "engine_field": "mandatoryRemodel", "source_items": [9, 11, 17],
        "signals": [r'(?:remodel|renovati|refurbish).*?(?:requir|oblig|must|shall)',
                    r'(?:maintenance|appearance).*?(?:requir|standard)',
                    r'(?:requir|must).*?(?:remodel|renovati|refurbish|upgrade)'],
    },

    # === TIER 1: TERRITORY ===
    "territory_exclusivity": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "exclusiveTerritory", "source_items": [12],
        "signals": [r'(?:no|not)\s+(?:exclusive|protected)\s+(?:territory|area)',
                    r'exclusive\s+(?:territory|area)'],
    },
    "encroachment_risk": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "encroachmentRisk", "source_items": [12],
        "signals": [r'(?:we|franchisor)\s+(?:may|can|right).*?(?:establish|operate|open|develop)'],
    },

    # === TIER 1: PERFORMANCE (Item 19) ===
    "fpr_average_revenue": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "item19_avgRevenue", "source_items": [19],
        "signals": [r'average.*?(?:sales|revenue).*?\$[\d,]+',
                    r'average\s+(?:annual\s+)?(?:gross\s+)?sales\s+volume',
                    r'\$[\d,]+.*?average'],
    },
    "fpr_median_revenue": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "medianGrossSales", "source_items": [19],
        "signals": [r'median.*?(?:sales|revenue).*?\$[\d,]+',
                    r'median\s+(?:annual\s+)?(?:gross\s+)?sales',
                    r'\$[\d,]+.*?median'],
    },
    "fpr_unit_count": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "fprUnitCount", "source_items": [19],
        "signals": [r'\d[\d,]+\s+(?:domestic\s+)?(?:traditional\s+)?(?:restaurant|outlet|unit|store|location)s?\s+(?:open|operat)',
                    r'(?:restaurant|outlet|unit|store)s?\s+open.*?(?:at\s+least|as\s+of)'],
    },
    "fpr_cost_structure": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "costStructure", "source_items": [19],
        "signals": [r'(?:cost\s+of\s+(?:sales|goods)|labor|crew|occupancy|operating\s+(?:expense|income))'],
    },
    "fpr_segment": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "fprSegments", "source_items": [19],
        "signals": [r'(?:franchised|company.?owned|mcopco|all\s+(?:traditional|domestic))'],
    },

    # === TIER 1: OUTLETS (Item 20) ===
    "total_units": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "totalUnits", "source_items": [20],
        "signals": [r'(?:total|systemwide)\s+(?:outlet|unit|store|restaurant|location)s?.*?\d[\d,]+'],
    },
    "unit_trend": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "netChange", "source_items": [20],
        "signals": [r'(?:net\s+change|open\w*|clos\w*|terminat\w*).*?\d+'],
    },

    # === TIER 1: FINANCIALS (Item 21) ===
    "auditor": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_1,
        "engine_field": "auditorName", "source_items": [21],
        "signals": [r'(?:audited|independent\s+auditor|independent\s+registered)',
                    r'(?:ernst\s+&\s+young|deloitte|kpmg|pwc|pricewaterhouse|bdo|grant\s+thornton|rsm)',
                    r'financial\s+statement.*?(?:exhibit|attached)'],
    },
    "franchisor_revenue": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "franchisorRevenue", "source_items": [8, 21],
        "signals": [r'(?:total\s+)?revenue.*?\$[\d,.]+\s*(?:million|billion)',
                    r'(?:revenue|income).*?\$[\d,]+',
                    r'\$[\d,.]+\s*(?:million|billion).*?revenue',
                    r'revenue\s+(?:received|from\s+franchisee)'],
    },

    # === TIER 2: SUPPLIER / SUPPORT ===
    "supplier_restriction": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "supplierRestrictions", "source_items": [8],
        "signals": [r'(?:approved|designated)\s+supplier', r'must\s+purchase', r'sole\s+source'],
    },
    "supplier_revenue": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "supplierRevenue", "source_items": [8],
        "signals": [r'(?:revenue|received|rebate|commission).*?\$[\d,]+\s*(?:million)?'],
    },
    "required_purchase_pct": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "requiredPurchasePct", "source_items": [8],
        "signals": [r'\d+\s*%\s*(?:of\s+)?(?:your\s+)?(?:total\s+)?(?:purchase|establish|operat)'],
    },
    "training_program": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "trainingProgram", "source_items": [11],
        "signals": [r'(?:training|hamburger\s+university|classroom|field\s+support)'],
    },
    "site_selection": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "siteSelection", "source_items": [11],
        "signals": [r'(?:site\s+selection|location.*?(?:select|choose|determine))'],
    },

    # === TIER 2: FINANCING ===
    "financing_available": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "financingAvailable", "source_items": [10],
        "signals": [r'(?:financ|loan|guarantee|sba|bank)', r'(?:interest\s+rate|collateral|amortiz)'],
    },
    "cross_default_loan": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "crossDefault", "source_items": [10, 17],
        "signals": [r'cross.?default', r'default.*?(?:loan|franchise\s+agreement)',
                    r'default\s+under.*?(?:also|constitute|deemed)',
                    r'(?:loan|financing).*?(?:default|breach).*?(?:franchise|agreement)'],
    },

    # === TIER 2: IDENTITY ===
    "parent_company": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "parentCompany", "source_items": [1],
        "signals": [r'(?:parent|subsidiary|wholly.?owned)', r'(?:parent\s+company|corporation)'],
    },
    "publicly_traded": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "publiclyTraded", "source_items": [1],
        "signals": [r'(?:nyse|nasdaq|publicly\s+traded|stock\s+exchange)'],
    },
    "system_composition": {
        "family": FactFamily.PERFORMANCE, "tier": FactTier.TIER_1,
        "engine_field": "systemComposition", "source_items": [1, 20],
        "signals": [r'\d+\s*%\s*(?:of\s+)?(?:all\s+)?(?:(?:u\.?s\.?\s+)?restaurant|outlet|unit)s?\s+(?:are\s+)?franchise',
                    r'(?:about|approximately|currently)\s+\d+\s*%.*?franchise'],
    },
    "year_established": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "yearEstablished", "source_items": [1, 2],
        "signals": [r'(?:began|started|commenced|since)\s+(?:franchis|offer|granting)',
                    r'(?:established|has\s+been\s+franchis)',
                    r'first\s+franchise',
                    r'(?:19|20)\d{2}.*?(?:began|started|granting\s+franchise)'],
    },
    "entity_type": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "entityType", "source_items": [1, 2],
        "signals": [r'(?:we\s+are|is)\s+a\s+(?:\w+\s+)?(?:limited\s+liability|corporation|llc)',
                    r'(?:organized|formed|incorporated)\s+(?:as\s+)?(?:a\s+)?(?:limited|corporation|llc)',
                    r'(?:delaware|nevada|california|kentucky|new\s+york|florida)\s+(?:limited\s+liability|corporation|llc)'],
    },

    # === TIER 2: LITIGATION ===
    "litigation_case": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_2,
        "engine_field": "litigationCases", "source_items": [3],
        "signals": [r'\bv\.\b', r'case\s+no', r'filed\s+(?:in\s+)?(?:20|19)\d{2}'],
    },
    "litigation_settlement": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_2,
        "engine_field": "settlements", "source_items": [3],
        "signals": [r'(?:settle|resolution|judgment|paid|award).*?\$[\d,]+'],
    },

    # === NEW TYPES FROM UNTYPED BUCKET ===
    "insurance_requirement": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "insuranceRequirements", "source_items": [8, 11, 17],
        "signals": [r'(?:insurance|insur\w+)\s+(?:requir|must|minimum|coverage|policy)',
                    r'(?:a\.?\s*m\.?\s*best|financial\s+(?:size|rating))'],
    },
    "operations_manual": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "operationsManual", "source_items": [11],
        "signals": [r'(?:operations?\s+(?:and\s+training\s+)?manual|o\s*&\s*t\s+manual)',
                    r'(?:confidential|proprietary).*?manual'],
    },
    "death_disability_succession": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "deathDisability", "source_items": [17],
        "signals": [r'(?:death|disability|incapacit).*?(?:assign|transfer|spouse|heir)',
                    r'(?:spouse|heir|estate).*?(?:death|disability)'],
    },
    "product_restriction": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "productRestrictions", "source_items": [16],
        "signals": [r'(?:only\s+(?:products?|items?)\s+(?:authorized|approved))',
                    r'(?:may\s+sell\s+only|authorized\s+products?)'],
    },
    "owner_operator_requirement": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "ownerOperator", "source_items": [15],
        "signals": [r'(?:full.?time|best\s+efforts|personal.*?supervision|owner.?operator)',
                    r'(?:absentee.*?(?:not|prohibit)|must\s+(?:devote|dedicate))'],
    },
    "confidentiality_restriction": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "confidentialityRestrictions", "source_items": [14, 17],
        "signals": [r'(?:confidential|trade\s+secret|proprietary).*?(?:restrict|not\s+disclose|prohibit)',
                    r'(?:not\s+disclose|must\s+(?:not|keep)).*?(?:confidential|secret)'],
    },
    "dispute_resolution": {
        "family": FactFamily.CONTROL, "tier": FactTier.TIER_2,
        "engine_field": "disputeResolution", "source_items": [17],
        "signals": [r'(?:choice\s+of\s+(?:law|forum)|governing\s+law|jurisdiction)',
                    r'(?:illinois|kentucky|state\s+of).*?(?:law|forum|jurisdiction)',
                    r'(?:mediat|arbitrat).*?(?:not\s+(?:required|mandatory)|common\s+practice)'],
    },
    "technology_system_requirement": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "technologySystems", "source_items": [6, 11],
        "signals": [r'(?:store\s+systems?|pos\s+system|cashless|kiosk|digital\s+menu)',
                    r'(?:technology|software|hardware).*?\$[\d,]+',
                    r'\$[\d,]+.*?(?:technology|software|system)'],
    },
    "franchisor_affiliate_entity": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "affiliates", "source_items": [1],
        "signals": [r'(?:affiliate|subsidiary|related\s+(?:entity|company))',
                    r'(?:wholly.?owned|parent\s+company|predecessor)'],
    },
    "business_description": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "businessDescription", "source_items": [1],
        "signals": [r'(?:quick\s+service|fast\s+food|restaurant\s+franchise|limited\s+menu)',
                    r'(?:operate|franchise).*?(?:system|restaurant|business).*?(?:of|that)'],
    },
    "offering_format": {
        "family": FactFamily.IDENTITY, "tier": FactTier.TIER_2,
        "engine_field": "offeringFormats", "source_items": [1, 5, 7],
        "signals": [r'(?:traditional|satellite|sto|str|bfl|non.?traditional|small.?town|express|kiosk)',
                    r'(?:format|type\s+of\s+(?:restaurant|franchise|outlet))'],
    },
    "franchisor_may_compete": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_1,
        "engine_field": "franchisorMayCompete", "source_items": [12],
        "signals": [r'(?:we|franchisor)\s+(?:may|can|has\s+the\s+right|reserve).*?(?:establish|operate|open|develop)',
                    r'(?:no|not).*?(?:exclusive|protected).*?(?:territory|area)'],
    },
    "fee_refundable": {
        "family": FactFamily.ECONOMICS, "tier": FactTier.TIER_2,
        "engine_field": "refundable", "source_items": [5],
        "signals": [r'(?:refund|non.?refundable|return)', r'(?:fee|amount).*?(?:refund|return)'],
    },
    "state_risk_disclosure": {
        "family": FactFamily.RISK, "tier": FactTier.TIER_2,
        "engine_field": "stateRisks", "source_items": [1],
        "signals": [r'(?:out.?of.?state|michigan|california|illinois).*?(?:dispute|resolution|law)',
                    r'(?:state\s+(?:risk|specific|cover\s+page))'],
    },
}


def classify_fact(fact_text: str, source_item: int) -> Tuple[Optional[str], Dict[str, Any]]:
    """Classify a fact into the ontology.

    Returns (fact_type, metadata) or (None, {}) if untyped.
    """
    text_lower = fact_text.lower()

    best_type = None
    best_score = 0

    for fact_type, spec in FACT_TYPES.items():
        # Source item match boosts score significantly
        item_match = source_item in spec.get("source_items", [])
        base_bonus = 4 if item_match else 0  # Strong item-match bonus

        # Signal pattern matching
        signal_hits = 0
        for pattern in spec.get("signals", []):
            if re.search(pattern, text_lower):
                signal_hits += 1

        # More specific types (more signals matched) should win over general
        # Also: longer type names tend to be more specific
        specificity_bonus = min(signal_hits * 0.5, 2.0)
        score = signal_hits + base_bonus + specificity_bonus

        if score > best_score and signal_hits > 0:
            best_score = score
            best_type = fact_type

    if best_type:
        spec = FACT_TYPES[best_type]
        return best_type, {
            "family": spec["family"].value,
            "tier": spec["tier"].value,
            "engine_field": spec.get("engine_field"),
        }

    return None, {}


def classify_all_facts(facts: List[Dict]) -> List[Dict]:
    """Classify all Lane A facts into the ontology.

    Returns enriched facts with fact_type, family, tier, engine_field.
    """
    classified = []
    for fact in facts:
        if not isinstance(fact, dict):
            continue

        text = fact.get("fact_text", fact.get("text", ""))
        item = fact.get("source_item", fact.get("item", 0))

        fact_type, metadata = classify_fact(text, item or 0)

        enriched = dict(fact)
        enriched["fact_type"] = fact_type
        enriched["fact_family"] = metadata.get("family", "untyped")
        enriched["fact_tier"] = metadata.get("tier", 3)
        enriched["engine_field"] = metadata.get("engine_field")
        enriched["typed"] = fact_type is not None
        classified.append(enriched)

    return classified


def fact_coverage_report(classified_facts: List[Dict]) -> Dict[str, Any]:
    """Report on fact coverage by type and tier."""
    typed = [f for f in classified_facts if f.get("typed")]
    untyped = [f for f in classified_facts if not f.get("typed")]

    by_type = {}
    by_family = {}
    by_tier = {1: 0, 2: 0, 3: 0}

    for f in typed:
        ft = f["fact_type"]
        by_type[ft] = by_type.get(ft, 0) + 1
        fam = f["fact_family"]
        by_family[fam] = by_family.get(fam, 0) + 1
        tier = f.get("fact_tier", 3)
        by_tier[tier] = by_tier.get(tier, 0) + 1

    # Which fact types are present vs expected
    expected = set(FACT_TYPES.keys())
    found_types = set(by_type.keys())
    missing_types = expected - found_types

    # Tier 1 coverage
    tier1_types = {k for k, v in FACT_TYPES.items() if v["tier"] == FactTier.TIER_1}
    tier1_found = tier1_types & found_types
    tier1_missing = tier1_types - found_types

    return {
        "total_facts": len(classified_facts),
        "typed": len(typed),
        "untyped": len(untyped),
        "typed_pct": round(len(typed) / max(len(classified_facts), 1) * 100, 1),
        "by_type": dict(sorted(by_type.items(), key=lambda x: -x[1])),
        "by_family": dict(sorted(by_family.items(), key=lambda x: -x[1])),
        "by_tier": by_tier,
        "tier1_coverage": f"{len(tier1_found)}/{len(tier1_types)}",
        "tier1_found": sorted(tier1_found),
        "tier1_missing": sorted(tier1_missing),
        "missing_types": sorted(missing_types),
    }
