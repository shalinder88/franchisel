"""Worker 25: Item 23 — Receipts. Receipt and timing disclosures only. Suppress seller names."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item23Worker(ItemWorkerBase):
    ITEM_NUM = 23
    ITEM_FAMILY = "document"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        # Receipt timing
        if re.search(r'(?:at\s+least\s+)?(?:14|10)\s+(?:calendar\s+)?(?:business\s+)?days?', text_lower):
            m = re.search(r'(\d+)\s+(?:calendar\s+)?(?:business\s+)?days?', text_lower)
            if m:
                fid = self.emit(
                    fact_type="receipt_timing",
                    fact_payload={"days": int(m.group(1))},
                    source_zone=SourceZone.ITEM, source_item=23,
                    source_pages=[section.start_page],
                    family="document", importance=Importance.CONTEXT, confidence=0.8,
                )
                fact_ids.append(fid)

        # Five business day right
        if re.search(r'(?:5|five)\s+(?:business\s+)?days?\s+(?:to\s+)?(?:cancel|rescind)', text_lower):
            fid = self.emit(
                fact_type="cancellation_right",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=23,
                source_pages=[section.start_page],
                family="document", importance=Importance.CONTEXT, confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
