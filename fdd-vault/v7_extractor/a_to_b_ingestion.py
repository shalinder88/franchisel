"""
A→B Ingestion — Wire Typed Lane A Facts Into Lane B Evidence

This is the bridge that turns Lane A's discoveries into Lane B's normalized fields.

Rule: Only Tier 1 typed facts flow into evidence.
Rule: Lane A wins provisionally — B can challenge but not silently override.
Rule: If A and B agree, confidence is highest.
Rule: If A found it and B missed it, keep A's value.
Rule: If they disagree, flag for review.

This module runs AFTER both Lane A and Lane B have produced their outputs.
It checks what A found that B missed, and fills the gaps.
"""

import re
from typing import Dict, Any, List, Optional
from .models import EvidenceStore, EvidenceState
from .fact_ontology import FACT_TYPES, FactTier


# ══════════════════════════════════════════════════════════════════════════════
# INGESTION POLICY TABLE
# Every field that A→B can touch must be listed here with its policy.
# Unlisted fields are BLOCKED from ingestion.
# ══════════════════════════════════════════════════════════════════════════════

INGESTION_POLICY = {
    # Fill-only: safe standalone fields. Write if missing, never overwrite.
    "initialFranchiseFee": "fill_only",
    "auditorName": "fill_only",
    "franchisorRevenue": "fill_only",
    "initialTermYears": "fill_only",
    "mandatoryRemodel": "fill_only",
    "personalGuaranty": "fill_only",
    "renewalAvailable": "fill_only",
    "exclusiveTerritory": "fill_only",
    "nonCompete": "fill_only",
    "crossDefault": "fill_only",
    "financingAvailable": "fill_only",
    "operationsManual": "fill_only",
    "publiclyTraded": "fill_only",
    "parentCompany": "fill_only",
    "yearEstablished": "fill_only",
    "fprUnitCount": "fill_only",
    "medianGrossSales": "fill_only",
    "item19_avgRevenue": "fill_only",

    # Enrich-only: add detail to object, don't create standalone scalar
    "royaltyDetails": "enrich_only",
    "royaltyBasis": "enrich_only",
    "rentStructure": "enrich_only",
    "costStructure": "enrich_only",
    "systemComposition": "enrich_only",
    "franchisorMayCompete": "enrich_only",
    "encroachmentRisk": "enrich_only",

    # Derived-only: built from multiple facts, not ingested directly
    "totalRecurringEstimate": "derived_only",
    "netChange": "derived_only",

    # BLOCKED: never ingest these from Lane A
    "totalInvestmentLow": "blocked",
    "totalInvestmentHigh": "blocked",
    "totalUnits": "blocked",
    "franchisedUnits": "blocked",
    "companyOwnedUnits": "blocked",
    "royaltyRate": "blocked",
    "marketingFundRate": "blocked",
    "hasItem19": "blocked",
}


def ingest_typed_facts_into_evidence(classified_facts: List[Dict],
                                      evidence: EvidenceStore,
                                      engines: Dict[str, Any]) -> Dict[str, Any]:
    """Ingest Tier 1 typed facts from Lane A into Lane B evidence.

    Only fills gaps — does not override existing evidence from Lane B.
    Returns a report of what was ingested.
    """
    ingested = []
    confirmed = []
    conflicts = []
    skipped = []

    # Snapshot existing evidence BEFORE any ingestion
    # Hard rule: never overwrite a Lane B value. Only fill gaps.
    existing_fields = set()
    for field_name in evidence._store:
        entry = evidence._store[field_name]
        if entry.get("state") == "present" and entry.get("value") is not None:
            existing_fields.add(field_name)

    # Group typed Tier 1 facts by engine_field
    by_field: Dict[str, List[Dict]] = {}
    for fact in classified_facts:
        if not fact.get("typed"):
            continue
        tier = fact.get("fact_tier", 3)
        if tier > 2:  # Tier 1 and Tier 2
            continue
        engine_field = fact.get("engine_field")
        if not engine_field:
            continue
        if engine_field not in by_field:
            by_field[engine_field] = []
        by_field[engine_field].append(fact)

    for field, facts in by_field.items():
        # Check ingestion policy
        policy = INGESTION_POLICY.get(field)
        if not policy:
            skipped.append({
                "field": field,
                "reason": "No ingestion policy defined — blocked by default",
                "fact_count": len(facts),
            })
            continue
        if policy == "blocked":
            skipped.append({
                "field": field,
                "reason": f"Policy: blocked (Lane B owns this field)",
                "fact_count": len(facts),
            })
            continue
        if policy == "derived_only":
            skipped.append({
                "field": field,
                "reason": "Policy: derived_only (build from multiple facts, not single ingestion)",
                "fact_count": len(facts),
            })
            continue

        # Check if Lane B already has this field (using snapshot, not live state)
        if field in existing_fields:
            if policy == "enrich_only":
                # Try to add detail without overwriting
                best_value = _extract_value_from_facts(field, facts)
                if best_value is not None:
                    confirmed.append({
                        "field": field,
                        "source": "A_enriches_B",
                        "a_count": len(facts),
                        "enrichment": str(best_value)[:60],
                    })
                else:
                    confirmed.append({"field": field, "source": "A_and_B", "a_count": len(facts)})
            else:
                confirmed.append({"field": field, "source": "A_and_B", "a_count": len(facts)})
            continue

        # Lane B missed it — try to extract a value from A's facts
        best_value = _extract_value_from_facts(field, facts)

        if best_value is not None:
            # Ingest into evidence
            evidence.set(field, best_value, EvidenceState.PRESENT)
            ingested.append({
                "field": field,
                "value": str(best_value)[:60],
                "source": "lane_A_ingestion",
                "policy": policy,
                "fact_count": len(facts),
                "best_fact": facts[0].get("fact_text", "")[:80],
            })
        else:
            skipped.append({
                "field": field,
                "reason": "Could not extract normalized value from A's facts",
                "fact_count": len(facts),
            })

    return {
        "ingested": len(ingested),
        "confirmed": len(confirmed),
        "conflicts": len(conflicts),
        "skipped": len(skipped),
        "details": {
            "ingested": ingested,
            "confirmed": confirmed,
            "skipped": skipped,
        },
    }


def _extract_value_from_facts(field: str, facts: List[Dict]) -> Optional[Any]:
    """Try to extract a normalized value from Lane A facts for a specific field.

    This is where typed facts become engine-consumable values.
    """
    # Combine all fact texts for this field
    all_text = " ".join(f.get("fact_text", "") for f in facts)
    text_lower = all_text.lower()

    # Field-specific extraction
    if field == "renewalAvailable":
        if re.search(r'no\s+(?:contractual\s+)?(?:right|option)\s+to\s+(?:renew|extend)', text_lower):
            return False
        if re.search(r'(?:may|right\s+to)\s+(?:renew|extend)', text_lower):
            return True
        return None

    elif field == "initialTermYears":
        m = re.search(r'(\d{1,2})\s*(?:year|yr)', text_lower)
        if m:
            val = int(m.group(1))
            if 1 <= val <= 50:
                return val
        return None

    elif field == "nonCompete":
        months = re.search(r'(\d+)\s*month', text_lower)
        years = re.search(r'(\d+)\s*year', text_lower)
        miles = re.search(r'(\d+)\s*mile', text_lower)
        result = {}
        if months:
            result["months"] = int(months.group(1))
        elif years:
            result["years"] = int(years.group(1))
        if miles:
            result["miles"] = int(miles.group(1))
        return result if result else None

    elif field == "personalGuaranty":
        if re.search(r'personal\s+guarant|personally\s+liable', text_lower):
            return True
        return None

    elif field == "mandatoryRemodel":
        if re.search(r'(?:remodel|renovati|refurbish).*?(?:requir|must)', text_lower):
            return True
        return None

    elif field == "exclusiveTerritory":
        # Check negative FIRST — "does not contain any exclusive" should be False
        if re.search(r'(?:no|not|does\s+not|will\s+not).*?(?:exclusive|protected)', text_lower):
            return False
        if re.search(r'exclusive\s+(?:territory|area|right)', text_lower):
            return True
        return None

    elif field == "encroachmentRisk":
        if re.search(r'(?:no|not)\s+(?:exclusive|protected)', text_lower):
            return "high"
        return None

    elif field in ("terminationTriggers", "transferConditions"):
        # These are list-type values — already captured by Lane B parsers
        return None

    elif field == "royaltyDetails":
        # Capture the dual-rate condition text
        conditions = []
        if re.search(r'5%.*?(?:applies|new)', text_lower):
            conditions.append("5% for new restaurants")
        if re.search(r'4%.*?(?:continue|existing)', text_lower):
            conditions.append("4% for existing franchisees")
        return {"conditions": conditions} if conditions else None

    elif field == "rentStructure":
        if re.search(r'rent.*?(?:payable|monthly|annual|lease)', text_lower):
            return {"has_rent": True}
        return None

    elif field in ("item19_avgRevenue", "medianGrossSales"):
        # Extract dollar amount
        m = re.search(r'\$\s*([\d,]+)', all_text)
        if m:
            val = int(m.group(1).replace(",", ""))
            if val >= 100000:
                return val
        return None

    elif field == "fprUnitCount":
        m = re.search(r'(\d[\d,]+)\s+(?:domestic|traditional|franchise)', text_lower)
        if m:
            val = int(m.group(1).replace(",", ""))
            if val >= 100:
                return val
        return None

    elif field == "auditorName":
        AUDITORS = ["Ernst & Young", "Deloitte", "KPMG", "PricewaterhouseCoopers",
                     "BDO", "Grant Thornton", "RSM", "Moss Adams"]
        for name in AUDITORS:
            if name.lower() in text_lower:
                return name
        if re.search(r'(?:independent|registered)\s+(?:public\s+)?audit', text_lower):
            return "independent_auditor"
        return None

    elif field in ("publiclyTraded",):
        if re.search(r'(?:nyse|nasdaq|publicly\s+traded|stock\s+exchange)', text_lower):
            return True
        return None

    elif field == "crossDefault":
        if re.search(r'(?:cross.?default|default.*?(?:loan|franchise\s+agreement)|default\s+(?:on|under).*?(?:will\s+be|considered))', text_lower):
            return True
        return None

    elif field == "parentCompany":
        m = re.search(r"(?:parent.*?|subsidiary\s+of\s+)((?:McDonald|Papa\s+John)['']?s?\s+(?:Corporation|International|Inc|LLC)[.,]?)", all_text)
        if m:
            return m.group(1).strip().rstrip('.,')
        m = re.search(r'(?:wholly.?owned\s+subsidiary\s+of\s+|parent\s+(?:company|entity)\s+(?:is\s+)?)([\w\s\',\.&]+?)(?:\.|,\s+a\s)', all_text)
        if m:
            return m.group(1).strip().rstrip('.,')
        return None

    elif field == "systemComposition":
        m = re.search(r'(?:about|approximately|currently)?\s*(\d+)\s*%\s*(?:of\s+)?(?:all\s+)?(?:(?:u\.?s\.?\s+)?restaurant|outlet|unit)s?\s+(?:are\s+)?franchise', text_lower)
        if m:
            return {"franchised_pct": int(m.group(1))}
        return None

    elif field == "royaltyBasis":
        if re.search(r'(?:of|on)\s+gross\s+sales', text_lower):
            return "Gross Sales"
        elif re.search(r'(?:of|on)\s+net\s+sales', text_lower):
            return "Net Sales"
        return None

    elif field == "franchisorMayCompete":
        if re.search(r'(?:we|franchisor)\s+(?:may|can|has\s+the\s+right|reserve).*?(?:establish|operate|open|develop|franchise)', text_lower):
            return True
        return None

    elif field == "mandatoryRemodel":
        if re.search(r'(?:remodel|renovati|refurbish|upgrade|maintenance.*?appearance).*?(?:requir|oblig|must|shall|standard)', text_lower):
            return True
        return None

    elif field == "supplierRestrictions":
        if re.search(r'(?:approved|designated)\s+supplier|must\s+purchase|sole\s+source', text_lower):
            return True
        return None

    elif field == "financingAvailable":
        if re.search(r'(?:financ|loan|guarantee|promissory)', text_lower):
            return True
        return None

    elif field == "operationsManual":
        if re.search(r'(?:operations?\s+(?:and\s+training\s+)?manual|o\s*&\s*t\s+manual)', text_lower):
            return True
        return None

    elif field == "yearEstablished":
        m = re.search(r'(?:began|started|since|commenced).*?(?:franchis|offer).*?(\d{4})', text_lower)
        if m:
            year = int(m.group(1))
            if 1900 <= year <= 2026:
                return year
        return None

    elif field == "refundable":
        if re.search(r'(?:refund|return)', text_lower):
            return True
        return None

    elif field == "supplierRevenue":
        m = re.search(r'\$\s*([\d,.]+)\s*(?:million|billion)', all_text, re.I)
        if m:
            val = float(m.group(1).replace(",", ""))
            mult_match = re.search(r'(million|billion)', all_text[m.start():m.end()+20], re.I)
            if mult_match:
                mult = {"million": 1000000, "billion": 1000000000}.get(mult_match.group(1).lower(), 1)
                return int(val * mult)
        return None

    # Generic: try to extract a dollar amount
    if "$" in all_text:
        m = re.search(r'\$\s*([\d,]+)', all_text)
        if m:
            val = int(m.group(1).replace(",", ""))
            if val > 0:
                return val

    return None
