"""Worker 20: Item 18 — Public Figures. Public figures only."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item18Worker(ItemWorkerBase):
    ITEM_NUM = 18
    ITEM_FAMILY = "identity"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        if re.search(r'(?:no|not)\s+(?:use|using)\s+(?:any\s+)?public\s+figure', text_lower):
            fid = self.emit(
                fact_type="public_figures",
                fact_payload={"present": False},
                source_zone=SourceZone.ITEM, source_item=18,
                source_pages=[section.start_page],
                family="identity", importance=Importance.CONTEXT, confidence=0.9,
            )
            fact_ids.append(fid)
        elif re.search(r'public\s+figure', text_lower):
            fid = self.emit(
                fact_type="public_figures",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=18,
                source_pages=[section.start_page],
                family="identity", importance=Importance.SECONDARY, confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
