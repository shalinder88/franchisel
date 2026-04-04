"""Worker 18: Item 16 — Restrictions on What the Franchisee May Sell."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item16Worker(ItemWorkerBase):
    ITEM_NUM = 16
    ITEM_FAMILY = "control"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        if re.search(r'(?:only\s+(?:products?|items?|services?)\s+(?:authorized|approved))', text_lower):
            fid = self.emit(
                fact_type="product_restriction",
                fact_payload={"restricted": True},
                source_zone=SourceZone.ITEM, source_item=16,
                source_pages=[section.start_page],
                family="control", importance=Importance.SECONDARY, confidence=0.85,
            )
            fact_ids.append(fid)

        if re.search(r'(?:may\s+not\s+sell|prohibit|outside.*?product)', text_lower):
            fid = self.emit(
                fact_type="outside_product_prohibition",
                fact_payload={"prohibited": True},
                source_zone=SourceZone.ITEM, source_item=16,
                source_pages=[section.start_page],
                family="control", importance=Importance.SECONDARY, confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
