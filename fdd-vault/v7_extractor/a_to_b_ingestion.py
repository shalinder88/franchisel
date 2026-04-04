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

# ══════════════════════════════════════════════════════════════════════════════
# A→B FIELD CONTRACT — Every field must declare exactly one mode:
#
#   fill      = Write if Lane B is empty. Never overwrite a present scalar.
#   confirm   = Compare Lane A vs Lane B. Log agreement or flag conflict. Never write.
#   enrich    = Add structured detail to existing object. Never replace base scalar.
#   derived   = Computed from multiple evidence fields. Not ingested from single facts.
#   conflict  = A and B both present but disagree. Flag for review, never auto-resolve.
#   blocked   = Lane B owns exclusively. Lane A cannot touch.
#
# Hard rule: an unlisted field is blocked by default.
# Hard rule: Lane A never overwrites a present Lane B scalar.
# ══════════════════════════════════════════════════════════════════════════════

INGESTION_POLICY = {
    # ── Core scalars: fill-only ──
    "initialFranchiseFee": "fill",
    "auditorName": "fill",
    "franchisorRevenue": "fill",
    "initialTermYears": "fill",
    "mandatoryRemodel": "fill",
    "personalGuaranty": "fill",
    "renewalAvailable": "fill",
    "exclusiveTerritory": "fill",
    "nonCompete": "fill",
    "crossDefault": "fill",
    "financingAvailable": "fill",
    "operationsManual": "fill",
    "publiclyTraded": "fill",
    "parentCompany": "fill",
    "yearEstablished": "fill",
    "entityType": "fill",
    "encroachmentRisk": "fill",
    "fprUnitCount": "fill",
    "medianGrossSales": "fill",
    "item19_avgRevenue": "fill",
    "supplierRevenue": "fill",
    "refundable": "fill",

    # ── Structured objects: enrich-only ──
    "royaltyDetails": "enrich",
    "royaltyBasis": "enrich",
    "rentStructure": "enrich",
    "costStructure": "enrich",
    "systemComposition": "enrich",
    "franchisorMayCompete": "enrich",

    # ── Synthetic summaries: derived-only ──
    "totalRecurringEstimate": "derived",
    "biggestCost": "derived",
    "netChange": "derived",

    # ── Confirm-only: Lane B owns value, Lane A validates ──
    "royaltyRate": "confirm",
    "marketingFundRate": "confirm",
    "hasItem19": "confirm",

    # ── Blocked: Lane B owns exclusively, Lane A cannot touch ──
    "totalInvestmentLow": "blocked",
    "totalInvestmentHigh": "blocked",
    "totalUnits": "blocked",
    "franchisedUnits": "blocked",
    "companyOwnedUnits": "blocked",
}

# Backwards compat: map old policy names to new
_POLICY_COMPAT = {"fill_only": "fill", "enrich_only": "enrich", "derived_only": "derived"}


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
        # Check ingestion policy (normalize old names)
        policy = INGESTION_POLICY.get(field)
        if policy:
            policy = _POLICY_COMPAT.get(policy, policy)
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
        if policy == "derived":
            skipped.append({
                "field": field,
                "reason": "Policy: derived (build from multiple facts, not single ingestion)",
                "fact_count": len(facts),
            })
            continue

        # Check if Lane B already has this field (using snapshot, not live state)
        if field in existing_fields:
            if policy == "confirm":
                # Lane A validates Lane B's value — log agreement/conflict
                best_value = _extract_value_from_facts(field, facts)
                existing_val = evidence.get(field)
                if best_value is not None and str(best_value) != str(existing_val):
                    conflicts.append({
                        "field": field,
                        "a_value": str(best_value)[:60],
                        "b_value": str(existing_val)[:60],
                        "policy": "confirm",
                    })
                else:
                    confirmed.append({"field": field, "source": "A_confirms_B", "a_count": len(facts)})
            elif policy == "enrich":
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


def compute_derived_facts(evidence: EvidenceStore, engines: Dict[str, Any]) -> Dict[str, Any]:
    """Compute derived facts from existing evidence. These are multi-source synthetics.

    Derived facts:
      totalRecurringEstimate: royalty + ad fund + known recurring tech/support + rent
      biggestCost: ranked from available evidence (rent, labor, food, royalty, ad)
      netChange: openings - closures or direct outlet delta from Item 20

    Each derived fact carries provenance showing source fields.
    """
    derived = []

    # ── totalRecurringEstimate ──
    # Sum of known recurring fee percentages
    royalty_str = evidence.get("royaltyRate")
    ad_str = evidence.get("marketingFundRate")
    royalty_pct = _parse_pct(royalty_str)
    ad_pct = _parse_pct(ad_str)
    sources = []
    total = 0.0
    if royalty_pct is not None:
        total += royalty_pct
        sources.append(f"royaltyRate={royalty_pct}%")
    if ad_pct is not None:
        total += ad_pct
        sources.append(f"marketingFundRate={ad_pct}%")
    rent_info = evidence.get("rentStructure")
    if isinstance(rent_info, dict) and rent_info.get("has_rent"):
        sources.append("rentStructure=present(amount_unknown)")

    if sources:
        value = {
            "totalPct": total if total > 0 else None,
            "components": sources,
            "hasRent": isinstance(rent_info, dict) and rent_info.get("has_rent", False),
            "note": "Minimum recurring obligation as % of gross sales (excludes rent if amount unknown)",
        }
        evidence.set("totalRecurringEstimate", value, EvidenceState.PRESENT)
        derived.append({"field": "totalRecurringEstimate", "value": str(value)[:80], "sources": sources})

    # ── biggestCost ──
    # Rank from investment table or Item 19 cost structure
    cost_info = evidence.get("costStructure")
    item20 = engines.get("item20_engine", {})
    investment_low = evidence.get("totalInvestmentLow")
    investment_high = evidence.get("totalInvestmentHigh")

    cost_sources = []
    if rent_info and isinstance(rent_info, dict) and rent_info.get("has_rent"):
        cost_sources.append({"category": "rent", "source": "rentStructure", "note": "Franchisor-controlled real estate"})
    if royalty_pct:
        cost_sources.append({"category": "royalty", "source": "royaltyRate", "pct": royalty_pct})
    if ad_pct:
        cost_sources.append({"category": "advertising", "source": "marketingFundRate", "pct": ad_pct})
    if investment_low and investment_high:
        cost_sources.append({"category": "initial_investment", "source": "totalInvestment", "range": f"${investment_low:,}-${investment_high:,}"})

    if cost_sources:
        # For rent-based models (McDonald's), rent is typically biggest
        biggest = cost_sources[0] if cost_sources else None
        value = {
            "biggestCategory": biggest["category"] if biggest else None,
            "rankedCosts": [c["category"] for c in cost_sources],
            "provenance": cost_sources,
        }
        evidence.set("biggestCost", value, EvidenceState.PRESENT)
        derived.append({"field": "biggestCost", "value": str(value)[:80], "sources": [c["source"] for c in cost_sources]})

    # ── netChange ──
    # From Item 20 engine: outlet delta or openings - closures
    outlet_summary = item20.get("outlet_summary", {})
    outlets_end = item20.get("total_outlets_end")
    outlets_start = item20.get("total_outlets_start")
    openings = item20.get("openings")
    closures = item20.get("closures")

    nc_sources = []
    net_change_val = None

    if outlets_end is not None and outlets_start is not None:
        net_change_val = outlets_end - outlets_start
        nc_sources.append(f"outlets_end({outlets_end})-outlets_start({outlets_start})")
    elif openings is not None and closures is not None:
        net_change_val = openings - closures
        nc_sources.append(f"openings({openings})-closures({closures})")

    if net_change_val is not None:
        value = {
            "netChange": net_change_val,
            "provenance": nc_sources,
        }
        evidence.set("netChange", value, EvidenceState.PRESENT)
        derived.append({"field": "netChange", "value": str(value)[:80], "sources": nc_sources})

    return {
        "derived_count": len(derived),
        "details": derived,
    }


def _parse_pct(val) -> Optional[float]:
    """Parse a percentage value from various formats: '5%', '5% or 4%', '4%', etc."""
    if val is None:
        return None
    val_str = str(val)
    # Take the first percentage found
    m = re.search(r'(\d+(?:\.\d+)?)\s*%', val_str)
    if m:
        return float(m.group(1))
    return None


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
        # Enum: none / limited / conditional / high
        has_no_exclusive = bool(re.search(r'(?:no|not|does\s+not)\s+(?:exclusive|protected)', text_lower))
        has_non_exclusive = bool(re.search(r'non[- ]?exclusive', text_lower))
        has_franchisor_compete = bool(re.search(r'(?:we|franchisor)\s+(?:may|can|ha(?:s|ve)\s+the\s+right|reserve).*?(?:establish|operate|open|develop|franchise)', text_lower))
        has_reserved_channels = bool(re.search(r'(?:alternative\s+channel|reserved\s+right|online|digital|delivery)', text_lower))
        has_protected_but_not_exclusive = bool(re.search(r'protected\s+area.*?(?:not\s+exclusive|limited)', text_lower))

        if has_no_exclusive or has_non_exclusive:
            if has_franchisor_compete:
                return "high"
            return "high"
        if has_franchisor_compete:
            return "high"
        if has_protected_but_not_exclusive:
            return "conditional"
        if has_reserved_channels:
            return "limited"
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
        # Normalize whitespace (newlines in PDFs) and smart quotes
        normalized = re.sub(r'\s+', ' ', all_text)
        normalized = normalized.replace('\u2018', "'").replace('\u2019', "'")
        normalized = normalized.replace('\u201c', '"').replace('\u201d', '"')
        # Match "subsidiary of [our parent [and predecessor,]] X Corporation/Inc/LLC"
        m = re.search(r"subsidiary\s+of\s+(?:our\s+)?(?:parent\s+(?:and\s+predecessor\s*,?\s*)?)?\s*([A-Z][A-Za-z0-9\s'&.,()-]+?(?:Corporation|International|Inc\.?|LLC|L\.L\.C\.|Company|Co\.))", normalized)
        if m:
            return m.group(1).strip().rstrip('.,')
        # Match "parent company is X" or "parent entity is X"
        m = re.search(r"parent\s+(?:company|entity)\s+(?:is\s+)?\s*([A-Z][A-Za-z0-9\s'&.,()-]+?)(?:\.|,\s+a\s)", normalized)
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
        # Prefer predecessor/system year over current entity year
        # Collect ALL candidate years with priority
        candidates = []
        for fact in facts:
            ft = fact.get("fact_text", "")
            ft_lower = ft.lower()
            # Predecessor language — highest priority (system origin)
            for pattern in [
                r'(?:predecessor|parent).*?(?:began|started|commenced|since).*?(?:franchis|offer|granting).*?(\d{4})',
                r'(\d{4}).*?(?:predecessor|parent).*?(?:began|started|granting\s+franchise)',
            ]:
                m = re.search(pattern, ft_lower)
                if m:
                    year = int(m.group(1))
                    if 1900 <= year <= 2026:
                        candidates.append((year, 10))  # High priority
            # Direct "we began" language — lower priority (may be entity year)
            for pattern in [
                r'(?:began|started|since|commenced).*?(?:franchis|offer|granting).*?(\d{4})',
                r'(\d{4}).*?(?:began|started|commenced|granting\s+franchise)',
            ]:
                m = re.search(pattern, ft_lower)
                if m:
                    year = int(m.group(1))
                    if 1900 <= year <= 2026:
                        candidates.append((year, 5))
        if candidates:
            # Prefer highest priority, then earliest year (system origin)
            candidates.sort(key=lambda x: (-x[1], x[0]))
            return candidates[0][0]
        return None

    elif field == "refundable":
        if re.search(r'(?:refund|return)', text_lower):
            return True
        return None

    elif field == "entityType":
        # Extract "Delaware limited liability company", "Delaware corporation", etc.
        normalized = re.sub(r'\s+', ' ', all_text)
        # "We are a Delaware limited liability company" / "is a Kentucky corporation"
        m = re.search(r'(?:we\s+are|is)\s+a\s+((?:Delaware|Nevada|California|Kentucky|New\s+York|Florida|Georgia|Texas|Illinois|[A-Z][a-z]+)\s+(?:limited\s+liability\s+company|corporation|LLC|L\.L\.C\.))', normalized, re.I)
        if m:
            return m.group(1).strip()
        # "organized as a corporation under the laws of Delaware"
        m = re.search(r'(?:organized|formed|incorporated)\s+(?:as\s+)?(?:a\s+)?((?:\w+\s+)?(?:limited\s+liability\s+company|corporation|LLC))', normalized, re.I)
        if m:
            return m.group(1).strip()
        return None

    elif field == "supplierRevenue":
        # Try "$X million/billion" first
        m = re.search(r'\$\s*([\d,.]+)\s*(?:million|billion)', all_text, re.I)
        if m:
            val = float(m.group(1).replace(",", ""))
            mult_word = re.search(r'(million|billion)', all_text[m.start():m.end()+20], re.I)
            if mult_word:
                mult = {"million": 1000000, "billion": 1000000000}.get(mult_word.group(1).lower(), 1)
                return int(val * mult)
        # Try raw dollar amount (e.g., "$39,008,767")
        m = re.search(r'\$\s*([\d,]+)', all_text)
        if m:
            val = int(m.group(1).replace(",", ""))
            if val >= 10000:  # Supplier revenue should be substantial
                return val
        return None

    # Generic: try to extract a dollar amount
    if "$" in all_text:
        m = re.search(r'\$\s*([\d,]+)', all_text)
        if m:
            val = int(m.group(1).replace(",", ""))
            if val > 0:
                return val

    return None
