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
            if field_name == "auditorName":
                val = eng("financial_statement_engine", "auditorName")
            elif field_name == "auditorOpinion":
                val = eng("financial_statement_engine", "auditorOpinion")
            else:
                val = br(field_name)
            export[field_name] = val

        elif source == "bootstrap":
            val = br(field_name) or bootstrap.get(field_name)
            export[field_name] = val

        elif source == "derived":
            export[field_name] = br(field_name)

        else:
            export[field_name] = br(field_name)

    return export


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
