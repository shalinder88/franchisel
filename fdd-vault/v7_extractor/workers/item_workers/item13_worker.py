"""Worker 15: Item 13 — Trademarks."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item13Worker(ItemWorkerBase):
    ITEM_NUM = 13
    ITEM_FAMILY = "identity"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        # Registration status
        if re.search(r'(?:principal|supplemental)\s+register', text_lower):
            fid = self.emit(
                fact_type="trademark_registration",
                fact_payload={"registered": True},
                source_zone=SourceZone.ITEM, source_item=13,
                source_pages=[section.start_page],
                family="identity", importance=Importance.SECONDARY, confidence=0.85,
            )
            fact_ids.append(fid)

        # Pending proceedings
        if re.search(r'(?:pending|opposition|cancellation)\s+(?:proceeding|action)', text_lower):
            fid = self.emit(
                fact_type="trademark_pending_proceedings",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=13,
                source_pages=[section.start_page],
                family="risk", importance=Importance.SECONDARY, confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
