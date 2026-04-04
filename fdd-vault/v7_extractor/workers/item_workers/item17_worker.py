"""
Worker 19: Item 17 — Renewal, Termination, Transfer, Non-Compete

Extracts: renewal, termination, transfer, ROFR, liquidated damages,
dispute resolution, post-term duties, noncompete, cure windows, default classes.

Gold rule: Do not stop at Item 17 summary prose. Follow the attached
agreements and riders where the real burden lives.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item17Worker(ItemWorkerBase):
    ITEM_NUM = 17
    ITEM_FAMILY = "risk"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Initial term ──
        term_match = re.search(r'(?:initial|franchise)\s+term\s+(?:is|of)\s+(\d+)\s*year', text_lower)
        if not term_match:
            term_match = re.search(r'(\d+)\s*[- ]?year\s+(?:initial\s+)?(?:term|franchise)', text_lower)
        if term_match:
            fid = self.emit(
                fact_type="initial_term",
                fact_payload={"years": int(term_match.group(1))},
                source_zone=SourceZone.ITEM,
                source_item=17,
                source_pages=[section.start_page],
                object_type=ObjectType.CONTRACT_SPEC,
                family="control",
                importance=Importance.CORE,
                confidence=0.9,
                raw_evidence=term_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Renewal ──
        renewal_patterns = [
            (r'(?:no|not)\s+(?:contractual\s+)?(?:right|option)\s+to\s+(?:renew|extend)', "no_renewal_right"),
            (r'(?:renew|extend)\s+(?:for\s+)?(?:an?\s+)?(?:additional|successive)\s+(\d+)\s*year', "renewal_available"),
            (r'(?:unlimited|indefinite)\s+(?:renewal|successive\s+term)', "unlimited_renewal"),
            (r'new\s+(?:franchise\s+)?agreement\s+(?:at|upon)\s+(?:renewal|expiration)', "new_agreement_required"),
        ]
        for pattern, renewal_type in renewal_patterns:
            m = re.search(pattern, text_lower)
            if m:
                payload = {"type": renewal_type}
                if m.lastindex:
                    payload["years"] = int(m.group(1))
                fid = self.emit(
                    fact_type="renewal_terms",
                    fact_payload=payload,
                    source_zone=SourceZone.ITEM,
                    source_item=17,
                    source_pages=[section.start_page],
                    object_type=ObjectType.CONTRACT_SPEC,
                    family="risk",
                    importance=Importance.CORE,
                    confidence=0.85,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)
                break

        # ── Non-compete ──
        nc_match = re.search(
            r'(?:non.?compet|covenant\s+not\s+to\s+compete)[^.]{0,300}',
            text_lower
        )
        if nc_match:
            nc_text = nc_match.group(0)
            years_m = re.search(r'(\d+)\s*(?:year|month)', nc_text)
            miles_m = re.search(r'(\d+)\s*(?:mile|km|kilometer)', nc_text)
            fid = self.emit(
                fact_type="non_compete",
                fact_payload={
                    "years": int(years_m.group(1)) if years_m else None,
                    "miles": int(miles_m.group(1)) if miles_m else None,
                    "detail": nc_text[:200],
                },
                source_zone=SourceZone.ITEM,
                source_item=17,
                source_pages=[section.start_page],
                object_type=ObjectType.CONTRACT_SPEC,
                family="risk",
                importance=Importance.CORE,
                confidence=0.85,
                raw_evidence=nc_text[:200],
            )
            fact_ids.append(fid)

        # ── Transfer conditions ──
        transfer_patterns = [
            (r'(?:right\s+of\s+first\s+refusal|rofr)', "rofr"),
            (r'(?:transfer|assign)\s+(?:fee|charge)\s+(?:of\s+)?\$\s*([\d,]+)', "transfer_fee"),
            (r'(?:prior\s+written\s+consent|our\s+(?:written\s+)?(?:consent|approval))', "consent_required"),
        ]
        for pattern, transfer_type in transfer_patterns:
            m = re.search(pattern, text_lower)
            if m:
                payload = {"type": transfer_type}
                if m.lastindex:
                    payload["amount"] = m.group(1)
                fid = self.emit(
                    fact_type="transfer_condition",
                    fact_payload=payload,
                    source_zone=SourceZone.ITEM,
                    source_item=17,
                    source_pages=[section.start_page],
                    object_type=ObjectType.CONTRACT_SPEC,
                    family="control",
                    importance=Importance.CORE,
                    confidence=0.8,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Default classes and cure windows ──
        cure_match = re.search(r'(\d+)\s*(?:day|business\s+day)s?\s+(?:to\s+)?(?:cure|correct|remedy)', text_lower)
        if cure_match:
            fid = self.emit(
                fact_type="cure_window",
                fact_payload={"days": int(cure_match.group(1))},
                source_zone=SourceZone.ITEM,
                source_item=17,
                source_pages=[section.start_page],
                object_type=ObjectType.CONTRACT_SPEC,
                family="risk",
                importance=Importance.SECONDARY,
                confidence=0.8,
                raw_evidence=cure_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Dispute resolution ──
        dispute_patterns = [
            (r'(?:governing\s+law|choice\s+of\s+law)[^.]{0,150}', "governing_law"),
            (r'(?:mandatory\s+)?(?:arbitration|mediation)[^.]{0,150}', "arbitration"),
            (r'(?:venue|forum|jurisdiction)\s+(?:shall\s+be|is|in)\s+([\w\s,]+?)(?:\.|;)', "venue"),
        ]
        for pattern, dispute_type in dispute_patterns:
            m = re.search(pattern, text_lower)
            if m:
                fid = self.emit(
                    fact_type="dispute_resolution",
                    fact_payload={"type": dispute_type, "detail": m.group(0)[:200]},
                    source_zone=SourceZone.ITEM,
                    source_item=17,
                    source_pages=[section.start_page],
                    object_type=ObjectType.CONTRACT_SPEC,
                    family="control",
                    importance=Importance.SECONDARY,
                    confidence=0.75,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Termination triggers (non-curable defaults) ──
        if re.search(r'(?:non.?curable|immediate\s+terminat|without\s+(?:opportunity\s+to\s+)?cure)', text_lower):
            m = re.search(r'(?:non.?curable|immediate\s+terminat|without\s+(?:opportunity\s+to\s+)?cure)[^.]{0,200}', text_lower)
            fid = self.emit(
                fact_type="non_curable_default",
                fact_payload={"detail": m.group(0)[:200] if m else ""},
                source_zone=SourceZone.ITEM,
                source_item=17,
                source_pages=[section.start_page],
                family="risk",
                importance=Importance.CORE,
                confidence=0.8,
                raw_evidence=m.group(0)[:200] if m else "",
            )
            fact_ids.append(fid)

        return fact_ids
