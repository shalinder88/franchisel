"""Worker 16: Item 14 — Patents, Copyrights, Proprietary Information."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance
import re

class Item14Worker(ItemWorkerBase):
    ITEM_NUM = 14
    ITEM_FAMILY = "control"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text_lower = (section.text if hasattr(section, 'text') else "").lower()

        if re.search(r'(?:no\s+)?patent', text_lower):
            has_patents = not re.search(r'no\s+patent', text_lower)
            fid = self.emit(
                fact_type="patent_status",
                fact_payload={"has_patents": has_patents},
                source_zone=SourceZone.ITEM, source_item=14,
                source_pages=[section.start_page],
                family="control", importance=Importance.CONTEXT, confidence=0.8,
            )
            fact_ids.append(fid)

        if re.search(r'(?:confidential|trade\s+secret|proprietary)', text_lower):
            fid = self.emit(
                fact_type="confidentiality_system",
                fact_payload={"present": True},
                source_zone=SourceZone.ITEM, source_item=14,
                source_pages=[section.start_page],
                family="control", importance=Importance.SECONDARY, confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
