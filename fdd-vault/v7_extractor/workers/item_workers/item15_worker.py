"""Worker 17: Item 15 — Obligation to Participate in Operation of Franchise."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item15Worker(ItemWorkerBase):
    ITEM_NUM = 15
    ITEM_FAMILY = "control"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        # Owner-operator requirement
        if re.search(r'(?:full.?time|best\s+efforts|personal.*?supervis|owner.?operator)', text_lower):
            fid = self.emit(
                fact_type="owner_operator_requirement",
                fact_payload={"required": True},
                source_zone=SourceZone.ITEM, source_item=15,
                source_pages=[section.start_page],
                family="control", importance=Importance.SECONDARY, confidence=0.85,
            )
            fact_ids.append(fid)

        # Absentee ownership allowed?
        if re.search(r'(?:absentee|passive)\s+(?:owner|operat)', text_lower):
            allowed = not re.search(r'(?:not|no)\s+(?:permit|allow).*?(?:absentee|passive)', text_lower)
            fid = self.emit(
                fact_type="absentee_ownership",
                fact_payload={"allowed": allowed},
                source_zone=SourceZone.ITEM, source_item=15,
                source_pages=[section.start_page],
                family="control", importance=Importance.SECONDARY, confidence=0.75,
            )
            fact_ids.append(fid)

        # GM / managing owner requirement
        if re.search(r'(?:general\s+manager|managing\s+(?:owner|director|principal))', text_lower):
            fid = self.emit(
                fact_type="managing_principal_requirement",
                fact_payload={"required": True},
                source_zone=SourceZone.ITEM, source_item=15,
                source_pages=[section.start_page],
                family="control", importance=Importance.SECONDARY, confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
