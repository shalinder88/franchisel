"""
Worker 5: Item 3 — Litigation

Extracts: case type, jurisdiction, date, counterparty type, amount,
outcome, settlement terms, injunctions, regulator actions.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item03Worker(ItemWorkerBase):
    ITEM_NUM = 3
    ITEM_FAMILY = "risk"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── No litigation disclosure ──
        if re.search(r'no\s+(?:pending\s+)?litigation', text_lower):
            fid = self.emit(
                fact_type="litigation_status",
                fact_payload={"status": "none_disclosed"},
                source_zone=SourceZone.ITEM, source_item=3,
                source_pages=[section.start_page],
                family="risk", importance=Importance.CORE,
                confidence=0.9,
            )
            fact_ids.append(fid)
            return fact_ids

        # ── Case detection ──
        # Look for "v." pattern indicating case citations
        cases = list(re.finditer(r'(\w[\w\s,\.]+?)\s+v\.\s+(\w[\w\s,\.]+?)(?:\s*,\s*(?:Case|Civil|No))', text))
        for m in cases:
            fid = self.emit(
                fact_type="litigation_case",
                fact_payload={
                    "plaintiff_type": "unknown",
                    "defendant_type": "unknown",
                    "citation": m.group(0)[:200],
                },
                source_zone=SourceZone.ITEM, source_item=3,
                source_pages=[section.start_page],
                object_type=ObjectType.CASE_RECORD,
                family="risk", importance=Importance.SECONDARY,
                confidence=0.75, raw_evidence=m.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Settlement amounts ──
        for m in re.finditer(r'(?:settle|paid|judgment|award)\w*[^.]{0,100}\$\s*([\d,]+)', text_lower):
            amount = float(m.group(1).replace(",", ""))
            if amount >= 10000:
                fid = self.emit(
                    fact_type="litigation_settlement",
                    fact_payload={"amount": amount},
                    source_zone=SourceZone.ITEM, source_item=3,
                    source_pages=[section.start_page],
                    family="risk", importance=Importance.SECONDARY,
                    confidence=0.75, raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Regulatory actions ──
        if re.search(r'(?:ftc|federal\s+trade|state\s+attorney|regulatory|cease\s+and\s+desist)', text_lower):
            fid = self.emit(
                fact_type="regulatory_action",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=3,
                source_pages=[section.start_page],
                family="risk", importance=Importance.CORE,
                confidence=0.8,
            )
            fact_ids.append(fid)

        # ── Case count ──
        case_count = len(cases)
        if case_count > 0:
            fid = self.emit(
                fact_type="litigation_case_count",
                fact_payload={"count": case_count},
                source_zone=SourceZone.ITEM, source_item=3,
                source_pages=[section.start_page],
                family="risk", importance=Importance.SECONDARY,
                confidence=0.7,
            )
            fact_ids.append(fid)

        return fact_ids
