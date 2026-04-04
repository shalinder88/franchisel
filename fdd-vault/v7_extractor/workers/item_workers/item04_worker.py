"""Worker 6: Item 4 — Bankruptcy."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item04Worker(ItemWorkerBase):
    ITEM_NUM = 4
    ITEM_FAMILY = "risk"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        if re.search(r'no\s+(?:person|individual).*?(?:has\s+been|is).*?(?:bankrupt|petition)', text_lower):
            fid = self.emit(
                fact_type="bankruptcy_status",
                fact_payload={"status": "none_disclosed"},
                source_zone=SourceZone.ITEM, source_item=4,
                source_pages=[section.start_page],
                family="risk", importance=Importance.SECONDARY,
                confidence=0.9,
            )
            fact_ids.append(fid)
        elif re.search(r'(?:chapter\s+(?:7|11|13)|bankrupt|reorganiz)', text_lower):
            fid = self.emit(
                fact_type="bankruptcy_status",
                fact_payload={"status": "disclosed"},
                source_zone=SourceZone.ITEM, source_item=4,
                source_pages=[section.start_page],
                family="risk", importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        return fact_ids
