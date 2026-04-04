"""
Worker 3: Item 1 — The Franchisor and Any Parents, Predecessors, and Affiliates

Extracts: identity, entity type, parents/predecessors/affiliates,
brand structure, formation year vs system start year, business model.

Gold rule: Suppress personal names unless legally material.
Year fields stay split — do not collapse formation, concept, first-unit, franchising years.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item01Worker(ItemWorkerBase):
    ITEM_NUM = 1
    ITEM_FAMILY = "identity"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Entity type ──
        entity_patterns = [
            (r'(?:we\s+are|is)\s+a\s+(\w+)\s+(?:limited\s+liability|corporation|llc)', "entity_type"),
            (r'(?:organized|formed|incorporated)\s+(?:as\s+)?(?:a\s+)?(\w+\s+(?:limited\s+liability|corporation|llc))', "entity_type"),
        ]
        for pattern, fact_type in entity_patterns:
            m = re.search(pattern, text_lower)
            if m:
                fid = self.emit(
                    fact_type=fact_type,
                    fact_payload={"value": m.group(1)},
                    source_zone=SourceZone.ITEM, source_item=1,
                    source_pages=[section.start_page],
                    family="identity", importance=Importance.SECONDARY,
                    confidence=0.85, raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)
                break

        # ── State of incorporation ──
        from ..models import US_STATES
        for state in US_STATES:
            if re.search(rf'(?:organized|formed|incorporated)\s+(?:under\s+the\s+laws\s+of\s+)?(?:the\s+State\s+of\s+)?{state}', text, re.IGNORECASE):
                fid = self.emit(
                    fact_type="state_of_incorporation",
                    fact_payload={"state": state},
                    source_zone=SourceZone.ITEM, source_item=1,
                    source_pages=[section.start_page],
                    family="identity", importance=Importance.SECONDARY,
                    confidence=0.85,
                )
                fact_ids.append(fid)
                break

        # ── Year splits (franchising since vs entity formed) ──
        franchise_year = re.search(r'(?:began|started|commenced)\s+(?:offer\w*|grant\w*)\s+franchise\w*\s+(?:in\s+)?(\d{4})', text_lower)
        if franchise_year:
            fid = self.emit(
                fact_type="franchise_system_start_year",
                fact_payload={"year": int(franchise_year.group(1))},
                source_zone=SourceZone.ITEM, source_item=1,
                source_pages=[section.start_page],
                family="identity", importance=Importance.SECONDARY,
                confidence=0.85, raw_evidence=franchise_year.group(0)[:200],
            )
            fact_ids.append(fid)

        formed_year = re.search(r'(?:organized|formed|incorporated)\s+(?:on\s+|in\s+)?(?:\w+\s+\d{1,2},?\s+)?(\d{4})', text_lower)
        if formed_year:
            fid = self.emit(
                fact_type="entity_formation_year",
                fact_payload={"year": int(formed_year.group(1))},
                source_zone=SourceZone.ITEM, source_item=1,
                source_pages=[section.start_page],
                family="identity", importance=Importance.SECONDARY,
                confidence=0.85, raw_evidence=formed_year.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Affiliates / predecessors ──
        if re.search(r'(?:affiliate|subsidiary|predecessor|parent\s+company)', text_lower):
            fid = self.emit(
                fact_type="affiliate_structure",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=1,
                source_pages=[section.start_page],
                family="identity", importance=Importance.SECONDARY,
                confidence=0.75,
            )
            fact_ids.append(fid)

        return fact_ids
