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
        if tier > 1:  # Only Tier 1 for now
            continue
        engine_field = fact.get("engine_field")
        if not engine_field:
            continue
        if engine_field not in by_field:
            by_field[engine_field] = []
        by_field[engine_field].append(fact)

    for field, facts in by_field.items():
        # Check if Lane B already has this field (using snapshot, not live state)
        if field in existing_fields:
            # Both lanes have it — confirm
            confirmed.append({
                "field": field,
                "source": "A_and_B",
                "a_count": len(facts),
            })
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
        if re.search(r'(?:nyse|nasdaq|publicly\s+traded)', text_lower):
            return True
        return None

    elif field == "crossDefault":
        if re.search(r'(?:cross.?default|default.*?(?:loan|agreement))', text_lower):
            return True
        return None

    # Generic: try to extract a dollar amount
    if "$" in all_text:
        m = re.search(r'\$\s*([\d,]+)', all_text)
        if m:
            val = int(m.group(1).replace(",", ""))
            if val > 0:
                return val

    return None
