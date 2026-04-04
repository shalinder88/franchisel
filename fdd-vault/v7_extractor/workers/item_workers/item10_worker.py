"""Worker 12: Item 10 — Financing."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance
import re

class Item10Worker(ItemWorkerBase):
    ITEM_NUM = 10
    ITEM_FAMILY = "economics"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        # ── No financing ──
        if re.search(r'(?:we|franchisor)\s+(?:do|does)\s+not\s+(?:offer|provide|arrange)\s+(?:any\s+)?financ', text_lower):
            fid = self.emit(
                fact_type="financing_available",
                fact_payload={"available": False},
                source_zone=SourceZone.ITEM, source_item=10,
                source_pages=[section.start_page],
                family="economics", importance=Importance.SECONDARY,
                confidence=0.9,
            )
            fact_ids.append(fid)
            return fact_ids

        # ── SBA lending ──
        if re.search(r'sba|small\s+business\s+admin', text_lower):
            fid = self.emit(
                fact_type="sba_lending",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=10,
                source_pages=[section.start_page],
                family="economics", importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)

        # ── Cross-default ──
        if re.search(r'cross.?default', text_lower):
            fid = self.emit(
                fact_type="cross_default",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=10,
                source_pages=[section.start_page],
                family="risk", importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        # ── Guaranty requirement ──
        if re.search(r'(?:personal|spousal)\s+guarant', text_lower):
            fid = self.emit(
                fact_type="personal_guaranty_financing",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=10,
                source_pages=[section.start_page],
                family="risk", importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        return fact_ids
