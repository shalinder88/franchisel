"""
Brand JSON Assembler

Builds the final brands_ready output from Layer B engines.
This maps directly to the brands.ts TypeScript interface.

Rule: every value here must trace back to an evidence entry.
"""

from typing import Dict, Any
from ..models import EvidenceStore


def assemble_brand_json(engines: Dict[str, Any],
                        bootstrap: Dict[str, Any],
                        evidence: EvidenceStore,
                        qa_results: Dict[str, Any]) -> Dict[str, Any]:
    """Assemble the final brand JSON from engines.

    This is the output that feeds brands.ts.
    """
    i17 = engines.get("contract_burden_engine", {})
    fin = engines.get("financial_statement_engine", {})

    brand = {
        # Identity — evidence first, bootstrap fallback
        "entity": bootstrap.get("entity", ""),
        "parentCompany": evidence.get("parentCompany") or None,
        "entityType": evidence.get("entityType") or None,
        # Year fields — split schema. A→B stores best-guess in yearEstablished.
        # Canonical export maps these to franchiseSystemStartYear / entityFormationYear.
        "yearEstablished": evidence.get("yearEstablished") or None,
        "entityFormationYear": evidence.get("entityFormationYear") or None,
        "publiclyTraded": evidence.get("publiclyTraded") or None,
        "description": bootstrap.get("description", ""),
        "issuanceDate": bootstrap.get("issueDate", ""),
        "amendmentDate": bootstrap.get("amendmentDate", ""),
        "offeringPaths": bootstrap.get("offeringPaths", []),
        "specialRisks": bootstrap.get("specialRisks", []),
        "specialRisksCount": len(bootstrap.get("specialRisks", [])),
        "risks": bootstrap.get("specialRisks", []),
        "count": len(bootstrap.get("specialRisks", [])),

        "totalUnits": evidence.get("totalUnits") or 0,
        "franchisedUnits": evidence.get("franchisedUnits") or 0,
        "companyOwnedUnits": evidence.get("companyOwnedUnits") or 0,

        "initialFranchiseFee": evidence.get("initialFranchiseFee"),
        "totalInvestmentLow": evidence.get("totalInvestmentLow"),
        "totalInvestmentHigh": evidence.get("totalInvestmentHigh"),
        "royaltyRate": evidence.get("royaltyRate"),
        "marketingFundRate": evidence.get("marketingFundRate"),

        "hasItem19": evidence.get("hasItem19") or False,
        "item19_avgRevenue": evidence.get("item19_avgRevenue"),
        "medianGrossSales": evidence.get("medianGrossSales"),
        "fprUnitCount": evidence.get("fprUnitCount"),

        # Control and risk scalars from A→B
        "exclusiveTerritory": evidence.get("exclusiveTerritory"),
        "encroachmentRisk": evidence.get("encroachmentRisk"),
        "operationsManual": evidence.get("operationsManual"),
        "renewalAvailable": evidence.get("renewalAvailable"),
        "personalGuaranty": evidence.get("personalGuaranty"),
        "nonCompete": evidence.get("nonCompete"),
        "financingAvailable": evidence.get("financingAvailable"),
        "supplierRevenue": evidence.get("supplierRevenue"),

        # Enriched objects
        "systemComposition": evidence.get("systemComposition"),
        "royaltyBasis": evidence.get("royaltyBasis"),
        "royaltyDetails": evidence.get("royaltyDetails"),
        "rentStructure": evidence.get("rentStructure"),
        "costStructure": evidence.get("costStructure"),

        # Derived facts (multi-source synthetics with provenance)
        "totalRecurringEstimate": evidence.get("totalRecurringEstimate"),
        "biggestCost": evidence.get("biggestCost"),
        "netChange": evidence.get("netChange"),

        "unitEconomics": engines.get("item20_engine", {}),

        "item17": {
            "initialTermYears": i17.get("initial_term_years") or evidence.get("initialTermYears"),
            "renewalTermYears": i17.get("renewal_term_years"),
            "curePeriodDays": i17.get("cure_period_days"),
            "hasNonCompete": i17.get("has_noncompete"),
            "nonCompeteYears": i17.get("noncompete_years"),
            "nonCompeteMiles": i17.get("noncompete_miles"),
            "mandatoryArbitration": i17.get("mandatory_arbitration"),
            "disputeVenue": i17.get("dispute_venue"),
        },

        "item21": {
            "hasAuditedFinancials": fin.get("hasAuditedFinancials", False),
            "auditorName": fin.get("auditorName"),
            "auditorOpinion": fin.get("auditorOpinion"),
            "goingConcernWarning": fin.get("goingConcernWarning", False),
            "franchisorRevenue": fin.get("franchisorRevenue"),
            "franchisorTotalAssets": fin.get("franchisorTotalAssets"),
            "franchisorNetIncome": fin.get("franchisorNetIncome"),
            "financialStrengthSignal": fin.get("financialStrengthSignal"),
        },

        "hasLitigation": engines.get("litigation_engine", {}).get("hasLitigation"),
        "hasBankruptcy": engines.get("bankruptcy_engine", {}).get("hasBankruptcy"),
        "litigation": engines.get("litigation_engine", {}),
        "supplierControl": engines.get("supplier_restrictions_engine", {}),
        "territory": engines.get("territory_engine", {}),

        # Sprint 2: Item 20 canonical outlet fields
        "hasItem20": True,

        "publishGate": qa_results.get("publish_gate", "draft"),
        "evidenceSummary": evidence.summary(),
    }

    # Sprint 2: Add outlet counts referencing the brand dict itself
    brand["currentFranchisedOutlets"] = brand.get("franchisedUnits")
    brand["currentCompanyOwnedOutlets"] = brand.get("companyOwnedUnits")
    brand["currentTotalOutlets"] = brand.get("totalUnits")

    return brand
