"""
Canonical Export Schema — Single Truth Layer

Every field the extractor produces is defined here ONCE.
The scorer reads ONLY this export. No engine digging. No evidence fishing.

For each field:
  name:           canonical field name in the export
  type:           python type (str, int, float, bool, dict, list, Optional[X])
  source:         where it comes from (evidence, engine, bootstrap, derived)
  source_detail:  specific evidence key, engine name, or derivation function
  null_means:     what None/missing means (not_extracted, not_applicable, absent)
  gold_aliases:   list of field names in gold JSONs that map to this field

The export function build_canonical_export() reads one extraction result
and produces one flat dict. That dict is the ONLY input to the scorer.
"""

from typing import Dict, Any, Optional, List


# ══════════════════════════════════════════════════════════════════════════════
# FIELD REGISTRY — every field in the canonical export
# ══════════════════════════════════════════════════════════════════════════════

FIELD_REGISTRY = {
    # ── Identity ──
    "entity": {
        "type": "str",
        "source": "bootstrap",
        "source_detail": "bootstrap.entity",
        "null_means": "not_extracted",
        "gold_aliases": ["franchisorLegalName"],
    },
    "parentCompany": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.parentCompany",
        "null_means": "not_extracted",
        "gold_aliases": ["parentCompany"],
    },
    "entityType": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.entityType",
        "null_means": "not_extracted",
        "gold_aliases": ["entityType"],
    },
    "publiclyTraded": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.publiclyTraded",
        "null_means": "not_extracted",
        "gold_aliases": ["publiclyTraded"],
    },
    "franchiseSystemStartYear": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.yearEstablished (predecessor-priority extraction)",
        "runtime_key": "yearEstablished",  # brand/evidence uses this name
        "null_means": "not_extracted",
        "gold_aliases": ["yearFranchiseEstablished", "yearFirstFranchised"],
    },
    "entityFormationYear": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.entityFormationYear",
        "runtime_key": "entityFormationYear",
        "null_means": "not_extracted",
        "gold_aliases": ["yearEntityFormed"],
    },
    "description": {
        "type": "str",
        "source": "bootstrap",
        "source_detail": "bootstrap.description",
        "null_means": "not_extracted",
        "gold_aliases": ["businessDescription"],
    },
    # ── Identity depth ──
    "franchiseSystemName": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.franchiseSystemName (short brand name)",
        "null_means": "not_extracted",
        "gold_aliases": ["franchiseSystemName"],
    },
    "stateOfIncorporation": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.stateOfIncorporation",
        "null_means": "not_extracted",
        "gold_aliases": ["stateOfIncorporation"],
    },
    "principalAddress": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.principalAddress",
        "null_means": "not_extracted",
        "gold_aliases": ["principalAddress"],
    },
    "ultimateParent": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.ultimateParent (parent + ticker if public)",
        "null_means": "not_extracted",
        "gold_aliases": ["ultimateParent"],
    },

    # ── Units ──
    "totalUnits": {
        "type": "int",
        "source": "evidence",
        "source_detail": "evidence.totalUnits (blocked from A→B)",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "franchisedUnits": {
        "type": "int",
        "source": "evidence",
        "source_detail": "evidence.franchisedUnits (blocked from A→B)",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "companyOwnedUnits": {
        "type": "int",
        "source": "evidence",
        "source_detail": "evidence.companyOwnedUnits (blocked from A→B)",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Economics ──
    "initialFranchiseFee": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.initialFranchiseFee",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "totalInvestmentLow": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.totalInvestmentLow (blocked from A→B)",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "totalInvestmentHigh": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.totalInvestmentHigh (blocked from A→B)",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "royaltyRate": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.royaltyRate (blocked from A→B, confirm-only)",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "marketingFundRate": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.marketingFundRate (blocked from A→B, confirm-only)",
        "null_means": "not_extracted",
        "gold_aliases": ["advertisingFundRate"],
    },
    "royaltyBasis": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.royaltyBasis",
        "null_means": "not_extracted",
        "gold_aliases": ["royaltyBasis"],
    },
    "refundable": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.refundable",
        "null_means": "not_extracted",
        "gold_aliases": ["refundable"],
    },
    "supplierRevenue": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.supplierRevenue",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Supplier / Item 8 depth ──
    "item8_hasRequiredPurchases": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine (approved or required or sole)",
        "null_means": "not_extracted",
        "gold_aliases": ["hasRequiredPurchases"],
    },
    "item8_requirementType": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine → derived from flags",
        "null_means": "not_extracted",
        "gold_aliases": ["requirementType"],
    },
    "item8_franchisorIsDirectSupplier": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine.affiliate_supplier",
        "null_means": "not_extracted",
        "gold_aliases": ["franchisorIsDirectSupplier"],
    },
    "item8_franchisorReceivesRevenue": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine.rebates_commissions",
        "null_means": "not_extracted",
        "gold_aliases": ["franchisorReceivesRevenue"],
    },
    "item8_approvedSupplierList": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine.approved_supplier",
        "null_means": "not_extracted",
        "gold_aliases": ["approvedSupplierList"],
    },
    "item8_proprietaryProducts": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item8_proprietaryProducts",
        "null_means": "not_extracted",
        "gold_aliases": ["proprietaryProducts"],
    },
    "item8_purchaseCooperative": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item8_purchaseCooperative",
        "null_means": "not_extracted",
        "gold_aliases": ["purchaseCooperative"],
    },
    "item8_requiredPurchasePctEstablishment": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine.setup_required_purchase_pct",
        "null_means": "not_extracted",
        "gold_aliases": ["requiredPurchasePctEstablishment"],
    },
    "item8_requiredPurchasePctOperating": {
        "type": "Optional[Any]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine.ongoing_required_purchase_pct",
        "null_means": "not_extracted",
        "gold_aliases": ["requiredPurchasePctOperating"],
    },
    "item8_lockInScore": {
        "type": "Optional[int]",
        "source": "engine",
        "source_detail": "engine.supplier_restrictions_engine.lock_in_severity",
        "null_means": "not_extracted",
        "gold_aliases": ["lockInScore"],
    },
    "item8_proprietaryProducts": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item8_proprietaryProducts (from FPR_FIELD tag)",
        "null_means": "not_extracted",
        "gold_aliases": ["proprietaryProducts"],
    },
    "item8_purchaseCooperative": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item8_purchaseCooperative (from FPR_FIELD tag)",
        "null_means": "not_extracted",
        "gold_aliases": ["purchaseCooperative"],
    },
    "item8_insuranceRequirements": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item8_insuranceRequirements (from FPR_FIELD tag)",
        "null_means": "not_extracted",
        "gold_aliases": ["insuranceRequirements"],
    },

    # ── Performance ──
    "hasItem19": {
        "type": "bool",
        "source": "evidence",
        "source_detail": "evidence.hasItem19 (blocked from A→B)",
        "null_means": "not_extracted",
        "gold_aliases": ["disclosesFinancialPerformance"],
    },
    "item19_avgRevenue": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.item19_avgRevenue",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "medianGrossSales": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.medianGrossSales",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "fprUnitCount": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.fprUnitCount",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Item 19 depth ──
    "item19_presentation": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.item19_engine (derived from fpr_tables count)",
        "null_means": "not_extracted",
        "gold_aliases": ["presentation"],
    },
    "item19_tableCount": {
        "type": "Optional[int]",
        "source": "engine",
        "source_detail": "engine.item19_engine.fpr_tables length",
        "null_means": "not_extracted",
        "gold_aliases": ["tableCount"],
    },
    "item19_metricType": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.item19_engine.metrics_reported → combined label",
        "null_means": "not_extracted",
        "gold_aliases": ["metricType"],
    },
    "item19_reportingPeriod": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item19_reportingPeriod",
        "null_means": "not_extracted",
        "gold_aliases": ["reportingPeriod"],
    },
    "item19_measurementYear": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.item19_measurementYear",
        "null_means": "not_extracted",
        "gold_aliases": ["measurementYear"],
    },
    "item19_basis": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item19_basis",
        "null_means": "not_extracted",
        "gold_aliases": ["basis"],
    },
    "item19_basisDetail": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item19_basisDetail",
        "null_means": "not_extracted",
        "gold_aliases": ["basisDetail"],
    },
    "item19_includesCompanyUnits": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item19_includesCompanyUnits",
        "null_means": "not_extracted",
        "gold_aliases": ["includesCompanyUnits"],
    },
    "item19_includesFranchisedUnits": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item19_includesFranchisedUnits",
        "null_means": "not_extracted",
        "gold_aliases": ["includesFranchisedUnits"],
    },
    "item19_separateSegments": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item19_separateSegments",
        "null_means": "not_extracted",
        "gold_aliases": ["separateSegments"],
    },
    "item19_expensesIncluded": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "derived from cost_structure_disclosed non-empty",
        "null_means": "not_extracted",
        "gold_aliases": ["expensesIncluded"],
    },
    "item19_expenseCoverage": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item19_expenseCoverage (enum: none/partial_opex/full_pnl)",
        "null_means": "not_extracted",
        "gold_aliases": ["expenseCoverage"],
    },
    "item19_exclusions": {
        "type": "Optional[list]",
        "source": "engine",
        "source_detail": "engine.item19_engine.exclusions",
        "null_means": "not_extracted",
        "gold_aliases": ["exclusions"],
    },
    "item19_sampleCoveragePct": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.item19_sampleCoveragePct",
        "null_means": "not_extracted",
        "gold_aliases": ["sampleCoveragePct"],
    },
    "item19_distributionSkew": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "computed from item19_avgRevenue / medianGrossSales",
        "null_means": "insufficient_source_data",
        "gold_aliases": ["distributionSkew"],
    },
    "item19_companyVsFranchiseeGap": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "computed from segment averages",
        "null_means": "insufficient_source_data",
        "gold_aliases": ["companyVsFranchiseeGap"],
    },
    "item19_investmentToRevenueRatio": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "computed from totalInvestment / medianGrossSales",
        "null_means": "insufficient_source_data",
        "gold_aliases": ["investmentToRevenueRatio"],
    },
    "item19_comparability": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item19_comparability (enum: full/limited/weak)",
        "null_means": "not_extracted",
        "gold_aliases": ["comparability"],
    },

    # ── Contract / Control ──
    "exclusiveTerritory": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.exclusiveTerritory",
        "null_means": "not_extracted",
        "gold_aliases": ["exclusiveTerritory"],
    },
    "encroachmentRisk": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.encroachmentRisk (enum: none/limited/conditional/high)",
        "null_means": "not_extracted",
        "gold_aliases": ["encroachmentRisk"],
    },
    # ── Territory / Item 12 depth ──
    "item12_territoryType": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "derived from exclusiveTerritory (none/exclusive/protected/designated)",
        "null_means": "not_extracted",
        "gold_aliases": ["territoryType"],
    },
    "item12_franchisorMayCompete": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.franchisorMayCompete",
        "null_means": "not_extracted",
        "gold_aliases": ["franchisorMayCompete"],
    },
    "item12_onlineSalesReserved": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item12_onlineSalesReserved",
        "null_means": "not_extracted",
        "gold_aliases": ["onlineSalesReserved"],
    },
    "item12_nationalAccountsReserved": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item12_nationalAccountsReserved",
        "null_means": "not_extracted",
        "gold_aliases": ["nationalAccountsReserved"],
    },
    "item12_relocationRights": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item12_relocationRights",
        "null_means": "not_extracted",
        "gold_aliases": ["relocationRights"],
    },
    "item12_performanceRequirement": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item12_performanceRequirement",
        "null_means": "not_extracted",
        "gold_aliases": ["performanceRequirement"],
    },
    "item12_multiUnitDevelopmentRights": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item12_multiUnitDevelopmentRights",
        "null_means": "not_extracted",
        "gold_aliases": ["multiUnitDevelopmentRights"],
    },
    "item12_territoryDetails": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item12_territoryDetails (summary text from reader)",
        "null_means": "not_extracted",
        "gold_aliases": ["territoryDetails"],
    },
    "item12_encroachmentNote": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item12_encroachmentNote (from reader)",
        "null_means": "not_extracted",
        "gold_aliases": ["encroachmentNote"],
    },
    "renewalAvailable": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.renewalAvailable",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "personalGuaranty": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.personalGuaranty",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "nonCompete": {
        "type": "Optional[dict]",
        "source": "evidence",
        "source_detail": "evidence.nonCompete ({months, years, miles})",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "crossDefault": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.crossDefault",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "financingAvailable": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.financingAvailable",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "operationsManual": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.operationsManual",
        "null_means": "not_extracted",
        "gold_aliases": ["operationsManual"],
    },
    # ── Support / Item 11 depth ──
    "item11_preOpeningAssistance": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.training_support_engine.pre_opening_support non-empty",
        "null_means": "not_extracted",
        "gold_aliases": ["preOpeningAssistance"],
    },
    "item11_siteSelectionHelp": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.training_support_engine.site_selection",
        "null_means": "not_extracted",
        "gold_aliases": ["siteSelectionHelp"],
    },
    "item11_buildoutAssistance": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "derived from pre_opening_support containing buildout",
        "null_means": "not_extracted",
        "gold_aliases": ["buildoutAssistance"],
    },
    "item11_fieldSupport": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item11_fieldSupport",
        "null_means": "not_extracted",
        "gold_aliases": ["fieldSupport"],
    },
    "item11_advertisingCouncil": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item11_advertisingCouncil",
        "null_means": "not_extracted",
        "gold_aliases": ["advertisingCouncil"],
    },
    "item11_advertisingFundTransparency": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item11_advertisingFundTransparency",
        "null_means": "not_extracted",
        "gold_aliases": ["advertisingFundTransparency"],
    },
    "item11_nationalAdFund": {
        "type": "Optional[str]",
        "source": "evidence",
        "source_detail": "evidence.item11_nationalAdFund (fund name)",
        "null_means": "not_extracted",
        "gold_aliases": ["nationalAdFund"],
    },
    "item11_technologyPlatform": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.training_support_engine.mandatory_systems joined",
        "null_means": "not_extracted",
        "gold_aliases": ["technologyPlatform"],
    },
    "item11_operationsManualConfidential": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.item11_operationsManualConfidential",
        "null_means": "not_extracted",
        "gold_aliases": ["operationsManualConfidential"],
    },
    # ── Contract terms / Item 17 depth ──
    "item17_term": {
        "type": "Optional[dict]",
        "source": "engine",
        "source_detail": "composed from contract_burden_engine term fields",
        "null_means": "not_extracted",
        "gold_aliases": ["term"],
    },
    "item17_renewal": {
        "type": "Optional[dict]",
        "source": "engine",
        "source_detail": "composed from contract_burden_engine renewal fields",
        "null_means": "not_extracted",
        "gold_aliases": ["renewal"],
    },
    "item17_termination": {
        "type": "Optional[dict]",
        "source": "engine",
        "source_detail": "composed from contract_burden_engine termination fields",
        "null_means": "not_extracted",
        "gold_aliases": ["termination"],
    },
    "item17_transfer": {
        "type": "Optional[dict]",
        "source": "engine",
        "source_detail": "composed from contract_burden_engine transfer fields",
        "null_means": "not_extracted",
        "gold_aliases": ["transfer"],
    },
    "item17_dispute": {
        "type": "Optional[dict]",
        "source": "engine",
        "source_detail": "composed from contract_burden_engine dispute fields",
        "null_means": "not_extracted",
        "gold_aliases": ["dispute"],
    },
    "item17_additionalBurdens": {
        "type": "Optional[dict]",
        "source": "engine",
        "source_detail": "composed from contract_burden_engine burden fields",
        "null_means": "not_extracted",
        "gold_aliases": ["additionalBurdens"],
    },
    "item17_contractBurdenScore": {
        "type": "Optional[int]",
        "source": "evidence",
        "source_detail": "evidence.item17_contractBurdenScore",
        "null_means": "not_extracted",
        "gold_aliases": ["contractBurdenScore"],
    },
    "mandatoryRemodel": {
        "type": "Optional[bool]",
        "source": "evidence",
        "source_detail": "evidence.mandatoryRemodel",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Contract terms (from engine) ──
    "initialTermYears": {
        "type": "Optional[int]",
        "source": "evidence_or_engine",
        "source_detail": "engine.contract_burden_engine.initial_term_years OR evidence.initialTermYears",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Enriched objects ──
    "systemComposition": {
        "type": "Optional[dict]",
        "source": "evidence",
        "source_detail": "evidence.systemComposition ({franchised_pct})",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "royaltyDetails": {
        "type": "Optional[dict]",
        "source": "evidence",
        "source_detail": "evidence.royaltyDetails",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "rentStructure": {
        "type": "Optional[dict]",
        "source": "evidence",
        "source_detail": "evidence.rentStructure",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "costStructure": {
        "type": "Optional[Any]",
        "source": "evidence",
        "source_detail": "evidence.costStructure",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Derived facts (with provenance) ──
    "totalRecurringEstimate": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "compute_derived_facts() → totalRecurringEstimate",
        "null_means": "insufficient_source_data",
        "gold_aliases": [],
    },
    "biggestCost": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "compute_derived_facts() → biggestCost",
        "null_means": "insufficient_source_data",
        "gold_aliases": [],
    },
    "netChange": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "compute_derived_facts() → netChange",
        "null_means": "insufficient_source_data",
        "gold_aliases": [],
    },

    # ── Outlets / Item 20 depth ──
    "item20_systemwideOutletSummary": {
        "type": "Optional[list]",
        "source": "derived",
        "source_detail": "parsed from outlet_summary table (year-by-year start/end/net change)",
        "null_means": "not_extracted",
        "gold_aliases": ["systemwideOutletSummary"],
    },
    "item20_transfersByYear": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "aggregated from transfer tables",
        "null_means": "not_extracted",
        "gold_aliases": ["transfersByYear"],
    },
    "item20_topTransferStates": {
        "type": "Optional[list]",
        "source": "derived",
        "source_detail": "top states from transfer tables sorted by count",
        "null_means": "not_extracted",
        "gold_aliases": ["topTransferStates2024"],
    },
    "item20_unitEconomics": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "composed from outlet summary + evidence fields",
        "null_means": "not_extracted",
        "gold_aliases": ["unitEconomics"],
    },
    "item20_churnData": {
        "type": "Optional[dict]",
        "source": "derived",
        "source_detail": "composed from outlet detail tables",
        "null_means": "not_extracted",
        "gold_aliases": ["churnData"],
    },

    # ── Financials (from engine) ──
    "auditorName": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.financial_statement_engine.auditorName",
        "null_means": "not_extracted",
        "gold_aliases": ["auditorName"],
    },
    "auditorOpinion": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.financial_statement_engine.auditorOpinion",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "item21_hasAuditedFinancials": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.financial_statement_engine.hasAuditedFinancials",
        "null_means": "not_extracted",
        "gold_aliases": ["hasAuditedFinancials"],
    },
    "item21_auditorTier": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "derived from auditorName (big4/national/regional/local)",
        "null_means": "not_extracted",
        "gold_aliases": ["auditorTier"],
    },
    "item21_goingConcernWarning": {
        "type": "Optional[bool]",
        "source": "engine",
        "source_detail": "engine.financial_statement_engine.goingConcernWarning",
        "null_means": "not_extracted",
        "gold_aliases": ["goingConcernWarning"],
    },
    "item21_financialStrengthSignal": {
        "type": "Optional[str]",
        "source": "engine",
        "source_detail": "engine.financial_statement_engine.financialStrengthSignal",
        "null_means": "not_extracted",
        "gold_aliases": ["financialStrengthSignal"],
    },
    "franchisorRevenue": {
        "type": "Optional[Any]",
        "source": "evidence",
        "source_detail": "evidence.franchisorRevenue",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },

    # ── Document ──
    "offeringPaths": {
        "type": "list",
        "source": "bootstrap",
        "source_detail": "bootstrap.offeringPaths",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
    "specialRisks": {
        "type": "list",
        "source": "bootstrap",
        "source_detail": "bootstrap.specialRisks",
        "null_means": "not_extracted",
        "gold_aliases": [],
    },
}


# ══════════════════════════════════════════════════════════════════════════════
# BUILD CANONICAL EXPORT — the only function the scorer should call
# ══════════════════════════════════════════════════════════════════════════════

def build_canonical_export(extraction_result: Dict[str, Any]) -> Dict[str, Any]:
    """Build a flat canonical export from an extraction result.

    This is the ONLY truth layer. The scorer reads this and nothing else.
    """
    brand = extraction_result.get("brand", {})
    evidence_raw = extraction_result.get("evidence", {})
    engines = extraction_result.get("engines", {})
    bootstrap = extraction_result.get("bootstrap", {})

    # Helper to get from evidence store format
    def ev(field):
        entry = evidence_raw.get(field, {})
        if isinstance(entry, dict) and "value" in entry:
            return entry["value"]
        return None

    # Helper to get from brand (already assembled)
    def br(field):
        return brand.get(field)

    # Helper to get from engine
    def eng(engine_name, field):
        return engines.get(engine_name, {}).get(field)

    export = {}
    for field_name, spec in FIELD_REGISTRY.items():
        source = spec["source"]
        # runtime_key: the key used in brand/evidence if different from canonical name
        runtime_key = spec.get("runtime_key", field_name)

        if source == "evidence":
            # Try brand first (already resolved), then raw evidence
            val = br(runtime_key)
            if val is None:
                val = ev(runtime_key)
            export[field_name] = val

        elif source == "evidence_or_engine":
            val = br(field_name)
            if val is None:
                val = ev(field_name)
            if val is None and field_name == "initialTermYears":
                val = eng("contract_burden_engine", "initial_term_years")
            export[field_name] = val

        elif source == "engine":
            val = _resolve_engine_field(field_name, engines, brand)
            export[field_name] = val

        elif source == "bootstrap":
            val = br(field_name) or bootstrap.get(field_name)
            export[field_name] = val

        elif source == "derived":
            # Derived fields resolved after all others
            export[field_name] = br(field_name)

        else:
            export[field_name] = br(field_name)

    # Post-pass: compute derived fields
    _compute_item19_derived(export)
    _compute_territory_derived(export)
    _compute_outlet_derived(export, extraction_result)

    return export


def build_provenance_audit(extraction_result: Dict[str, Any]) -> Dict[str, Any]:
    """Build a provenance audit showing HOW each canonical field was filled.

    Returns per-field:
      fill_mode: surfaced_from_engine / captured_by_reader / derived / bootstrap / missing
      source_lane: A, B, derived, bootstrap, or None
      source_item: which FDD item the fact came from (if known)
      non_null: True if the canonical field has a value

    Use this to separate genuine extraction from canonical plumbing.
    """
    export = build_canonical_export(extraction_result)
    brand = extraction_result.get("brand", {})
    evidence_raw = extraction_result.get("evidence", {})
    engines = extraction_result.get("engines", {})
    ingestion = extraction_result.get("a_to_b_ingestion", {})

    # Build ingested-field set (came from Lane A)
    ingested_fields = set()
    for item in ingestion.get("details", {}).get("ingested", []):
        ingested_fields.add(item.get("field"))

    audit = {}
    counts = {"surfaced_from_engine": 0, "captured_by_reader": 0,
              "derived": 0, "bootstrap": 0, "missing": 0}

    for field_name, spec in FIELD_REGISTRY.items():
        val = export.get(field_name)
        has_value = val is not None and val != "" and val != {} and val != []
        source = spec["source"]

        if not has_value:
            fill_mode = "missing"
        elif source == "derived":
            fill_mode = "derived"
        elif source == "bootstrap":
            fill_mode = "bootstrap"
        elif source == "engine":
            fill_mode = "surfaced_from_engine"
        elif source in ("evidence", "evidence_or_engine"):
            runtime_key = spec.get("runtime_key", field_name)
            if runtime_key in ingested_fields or field_name in ingested_fields:
                fill_mode = "captured_by_reader"  # Came through A→B from Lane A
            else:
                # Check if it was in Lane B engine originally
                fill_mode = "surfaced_from_engine"
        else:
            fill_mode = "surfaced_from_engine"

        audit[field_name] = {
            "fill_mode": fill_mode,
            "non_null": has_value,
            "source": source,
        }
        counts[fill_mode] = counts.get(fill_mode, 0) + 1

    return {
        "audit": audit,
        "counts": counts,
        "total": len(FIELD_REGISTRY),
        "non_null": sum(1 for a in audit.values() if a["non_null"]),
    }


def _resolve_engine_field(field_name: str, engines: Dict, brand: Dict) -> Any:
    """Resolve a single engine-sourced field."""
    eng19 = engines.get("item19_engine", {})
    fin = engines.get("financial_statement_engine", {})

    if field_name == "auditorName":
        return fin.get("auditorName")
    elif field_name == "auditorOpinion":
        return fin.get("auditorOpinion")
    elif field_name == "item19_presentation":
        tables = eng19.get("fpr_tables", [])
        if len(tables) > 1:
            return "multi_table"
        elif len(tables) == 1:
            return "single_table"
        return None
    elif field_name == "item19_tableCount":
        tables = eng19.get("fpr_tables", [])
        return len(tables) if tables else None
    elif field_name == "item19_metricType":
        metrics = eng19.get("metrics_reported", [])
        if not metrics:
            return None
        return "_and_".join(sorted(metrics))
    elif field_name == "item19_expensesIncluded":
        cost = eng19.get("cost_structure_disclosed", [])
        return bool(cost) if cost is not None else None
    elif field_name == "item19_exclusions":
        excl = eng19.get("exclusions", [])
        return excl if excl else None

    # Item 8 supplier engine fields
    eng8 = engines.get("supplier_restrictions_engine", {})
    if field_name == "item8_hasRequiredPurchases":
        return eng8.get("approved_supplier") or eng8.get("required_supplier") or eng8.get("sole_supplier") or None
    elif field_name == "item8_requirementType":
        if eng8.get("sole_supplier"):
            return "sole_source"
        if eng8.get("required_supplier"):
            return "required_suppliers"
        if eng8.get("approved_supplier"):
            return "approved_suppliers_only"
        return None
    elif field_name == "item8_franchisorIsDirectSupplier":
        # affiliate_supplier means franchisor/affiliate sells to franchisees
        return eng8.get("affiliate_supplier")
    elif field_name == "item8_franchisorReceivesRevenue":
        return eng8.get("rebates_commissions")
    elif field_name == "item8_approvedSupplierList":
        return eng8.get("approved_supplier")
    elif field_name == "item8_requiredPurchasePctEstablishment":
        val = eng8.get("setup_required_purchase_pct")
        return str(val) if val is not None else None
    elif field_name == "item8_requiredPurchasePctOperating":
        val = eng8.get("ongoing_required_purchase_pct")
        return str(val) if val is not None else None
    elif field_name == "item8_lockInScore":
        return eng8.get("lock_in_severity")

    # Item 21 financial engine fields
    if field_name == "item21_hasAuditedFinancials":
        return fin.get("hasAuditedFinancials")
    elif field_name == "item21_auditorTier":
        auditor = fin.get("auditorName", "")
        if not auditor:
            return None
        BIG4 = ["ernst & young", "deloitte", "kpmg", "pricewaterhousecoopers", "pwc"]
        NATIONAL = ["bdo", "grant thornton", "rsm", "moss adams", "crowe"]
        a_lower = auditor.lower()
        if any(b in a_lower for b in BIG4):
            return "big4"
        if any(n in a_lower for n in NATIONAL):
            return "national"
        return "regional"
    elif field_name == "item21_goingConcernWarning":
        return fin.get("goingConcernWarning")
    elif field_name == "item21_financialStrengthSignal":
        return fin.get("financialStrengthSignal")

    # Item 17 contract engine — compose structured dicts
    eng17 = engines.get("contract_burden_engine", {})
    if field_name == "item17_term":
        ity = eng17.get("initial_term_years")
        if ity:
            return {"initialTermYears": ity}
        return None
    elif field_name == "item17_renewal":
        ra = eng17.get("renewal_available")
        ntp = eng17.get("new_term_policy")
        if ra is not None or ntp is not None:
            return {
                "renewalAvailable": ra,
                "newTermPolicy": ntp,
                "renewalTermYears": eng17.get("renewal_term_years"),
            }
        return None
    elif field_name == "item17_termination":
        triggers = eng17.get("termination_triggers", [])
        cure = eng17.get("cure_period_days")
        if triggers or cure:
            return {
                "franchisorCanTerminateWithCause": bool(triggers),
                "terminationTriggers": triggers,
                "curePeriodDays": cure,
            }
        return None
    elif field_name == "item17_transfer":
        rofr = eng17.get("rofr")
        fee = eng17.get("transfer_fee")
        if rofr is not None or fee is not None:
            return {
                "transferAllowed": True,
                "franchisorApprovalRequired": True,
                "rightOfFirstRefusal": rofr,
                "transferFee": fee,
            }
        return None
    elif field_name == "item17_dispute":
        arb = eng17.get("mandatory_arbitration")
        med = eng17.get("mandatory_mediation")
        law = eng17.get("governing_law")
        if arb is not None or med is not None or law is not None:
            return {
                "mandatoryArbitration": arb,
                "mandatoryMediation": med,
                "choiceOfLaw": law,
                "juryTrialWaiver": eng17.get("jury_waiver"),
                "classActionWaiver": eng17.get("class_action_waiver"),
            }
        return None
    elif field_name == "item17_additionalBurdens":
        pg = eng17.get("personal_guaranty")
        sg = eng17.get("spouse_guaranty")
        if pg is not None or sg is not None:
            return {
                "personalGuaranty": pg,
                "spouseGuaranty": sg,
                "crossDefault": eng17.get("cross_default"),
            }
        return None

    # Item 11 support engine fields
    eng11 = engines.get("training_support_engine", {})
    if field_name == "item11_preOpeningAssistance":
        pre = eng11.get("pre_opening_support", [])
        return bool(pre) if pre is not None else None
    elif field_name == "item11_siteSelectionHelp":
        ss = eng11.get("site_selection")
        return ss is not None and ss != "none"
    elif field_name == "item11_buildoutAssistance":
        pre = eng11.get("pre_opening_support", [])
        return any("buildout" in str(p) for p in pre) if pre else None
    elif field_name == "item11_technologyPlatform":
        sys_list = eng11.get("mandatory_systems", [])
        return ", ".join(sys_list) if sys_list else None

    return brand.get(field_name)


def _compute_item19_derived(export: Dict) -> None:
    """Post-pass: compute Item 19 derived fields from other canonical fields."""
    avg = export.get("item19_avgRevenue")
    med = export.get("medianGrossSales")
    inv_low = export.get("totalInvestmentLow")
    inv_high = export.get("totalInvestmentHigh")

    # distributionSkew
    if avg and med and med > 0:
        ratio = round(avg / med, 3)
        assessment = ("minimal" if ratio < 1.05 else
                      "moderate" if ratio < 1.15 else "significant")
        export["item19_distributionSkew"] = {
            "average": avg,
            "median": med,
            "skewRatio": ratio,
            "skewAssessment": assessment,
        }

    # investmentToRevenueRatio
    if med and med > 0 and inv_high:
        ratio_high = round(inv_high / med, 2)
        ratio_low = round(inv_low / med, 2) if inv_low else None
        assessment = ("strong" if ratio_high < 1.0 else
                      "moderate" if ratio_high < 2.0 else "heavy")
        export["item19_investmentToRevenueRatio"] = {
            "usingMedianFranchised": ratio_low,
            "usingHighInvestment": ratio_high,
            "assessment": assessment,
        }


def _compute_outlet_derived(export: Dict, extraction_result: Dict) -> None:
    """Post-pass: parse outlet tables into structured objects."""
    import re
    tables = extraction_result.get("table_registry", [])
    if not isinstance(tables, list):
        return

    # Find outlet summary table (has columns: Outlet Type, Year, Start, End, Net Change)
    outlet_summary_table = None
    transfer_tables = []
    for t in tables:
        if not isinstance(t, dict):
            continue
        cols = t.get("columns", [])
        cols_lower = " ".join(str(c).lower() for c in cols)
        if "outlet type" in cols_lower and "net change" in cols_lower:
            outlet_summary_table = t
        elif "number of transfers" in cols_lower:
            transfer_tables.append(t)

    # Parse outlet summary → systemwideOutletSummary
    if outlet_summary_table:
        rows = outlet_summary_table.get("rows", [])
        summary = []
        current_type = ""
        year_data = {}
        for row in rows:
            cells = row.get("cells", row) if isinstance(row, dict) else row
            if not isinstance(cells, list) or len(cells) < 5:
                continue
            otype = str(cells[0]).strip()
            if otype:
                current_type = otype.lower()
            year = str(cells[1]).strip()
            start = _parse_int(cells[2])
            end = _parse_int(cells[3])
            nc = _parse_int(cells[4])

            if not year or start is None:
                continue

            if year not in year_data:
                year_data[year] = {"year": int(year) if year.isdigit() else year}

            if "franchise" in current_type:
                year_data[year]["franchisedStart"] = start
                year_data[year]["franchisedEnd"] = end
                year_data[year]["franchisedNetChange"] = nc
            elif "company" in current_type:
                year_data[year]["companyStart"] = start
                year_data[year]["companyEnd"] = end
                year_data[year]["companyNetChange"] = nc
            elif "total" in current_type:
                year_data[year]["totalStart"] = start
                year_data[year]["totalEnd"] = end
                year_data[year]["totalNetChange"] = nc

        if year_data:
            summary = sorted(year_data.values(), key=lambda x: x.get("year", 0))
            export["item20_systemwideOutletSummary"] = summary

            # Derive unitEconomics from the latest year
            latest = summary[-1] if summary else {}
            total_end = latest.get("totalEnd")
            f_end = latest.get("franchisedEnd")
            c_end = latest.get("companyEnd")
            nc = latest.get("totalNetChange")

            if total_end:
                ue = {
                    "unitsEndOfPeriod": total_end,
                    "franchisedUnits": f_end,
                    "companyOwnedUnits": c_end,
                    "franchisedPct": round(f_end / total_end * 100, 1) if f_end and total_end else None,
                    "netGrowth2024": nc,
                }
                # 3-year trend
                if len(summary) >= 3:
                    first = summary[0]
                    total_start = first.get("totalStart")
                    if total_start:
                        ue["threeYearNetGrowth"] = total_end - total_start
                        ue["threeYearGrowthRate"] = round((total_end - total_start) / total_start * 100, 2)
                    # Trajectory
                    changes = [y.get("totalNetChange", 0) for y in summary]
                    if all(c > 0 for c in changes if c is not None):
                        ue["systemTrajectory"] = "growing"
                    elif all(c < 0 for c in changes if c is not None):
                        ue["systemTrajectory"] = "declining"
                    else:
                        ue["systemTrajectory"] = "stable_growing" if nc and nc > 0 else "stable"
                export["item20_unitEconomics"] = ue

            # Also update netChange derived fact
            if nc is not None and export.get("netChange") is None:
                export["netChange"] = {"netChange": nc, "provenance": ["outlet_summary_table"]}

    # Parse transfer tables → transfersByYear + topTransferStates
    if transfer_tables:
        transfers_by_state_year = {}
        current_state = ""
        for t in transfer_tables:
            for row in t.get("rows", []):
                cells = row.get("cells", row) if isinstance(row, dict) else row
                if not isinstance(cells, list) or len(cells) < 3:
                    continue
                state = str(cells[0]).strip()
                if state:
                    current_state = state
                year = str(cells[1]).strip()
                count = _parse_int(cells[2])
                if not year or count is None:
                    continue
                key = (current_state, year)
                transfers_by_state_year[key] = count

        if transfers_by_state_year:
            # Aggregate by year
            by_year = {}
            for (state, year), count in transfers_by_state_year.items():
                by_year[year] = by_year.get(year, 0) + count
            export["item20_transfersByYear"] = by_year

            # Top states for most recent year
            years = sorted(by_year.keys())
            latest_year = years[-1] if years else None
            if latest_year:
                state_counts = {}
                for (state, year), count in transfers_by_state_year.items():
                    if year == latest_year:
                        state_counts[state] = count
                top_states = sorted(state_counts.items(), key=lambda x: -x[1])[:7]
                export["item20_topTransferStates"] = [
                    {"state": s, "count": c} for s, c in top_states
                ]


def _parse_int(val) -> Optional[int]:
    """Parse an integer from table cell, handling commas and +/- signs."""
    if val is None:
        return None
    s = str(val).strip().replace(",", "").replace("+", "")
    try:
        return int(s)
    except (ValueError, TypeError):
        return None


def _compute_territory_derived(export: Dict) -> None:
    """Post-pass: derive territory type from exclusiveTerritory."""
    excl = export.get("exclusiveTerritory")
    if excl is False:
        export["item12_territoryType"] = "none"
    elif excl is True:
        export["item12_territoryType"] = "exclusive"
    # franchisorMayCompete from evidence
    fmc = export.get("item12_franchisorMayCompete")
    if fmc is None:
        # If we have evidence of no exclusive territory, franchisor likely may compete
        if excl is False:
            export["item12_franchisorMayCompete"] = True


def build_reverse_alias_map() -> Dict[str, str]:
    """Build gold_field_name → canonical_field_name lookup.

    Used by the scorer to translate gold fields into canonical fields.
    """
    reverse = {}
    for field_name, spec in FIELD_REGISTRY.items():
        # The canonical name maps to itself
        reverse[field_name] = field_name
        # Plus all gold aliases
        for alias in spec.get("gold_aliases", []):
            reverse[alias] = field_name
    return reverse


def get_field_names() -> List[str]:
    """Return all canonical field names."""
    return list(FIELD_REGISTRY.keys())
