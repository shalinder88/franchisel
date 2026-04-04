"""
Worker 4: Item 2 — Business Experience

Extracts: business experience only as structured role/history, not biography.
Gold rule: Suppress names by default.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, Importance


class Item02Worker(ItemWorkerBase):
    ITEM_NUM = 2
    ITEM_FAMILY = "identity"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Officer count ──
        # Count "Principal" or "Officer" headings/sections
        import re
        officer_sections = re.findall(r'(?:principal|officer|director|manager|president|ceo|cfo|coo)', text_lower)
        if officer_sections:
            fid = self.emit(
                fact_type="leadership_count",
                fact_payload={"approximate_count": min(len(set(officer_sections)), 20)},
                source_zone=SourceZone.ITEM, source_item=2,
                source_pages=[section.start_page],
                family="identity", importance=Importance.CONTEXT,
                confidence=0.6,
            )
            fact_ids.append(fid)

        # ── Experience depth (years in franchising) ──
        exp_match = re.search(r'(\d+)\s+years?\s+(?:of\s+)?(?:experience|in\s+(?:the\s+)?(?:franchise|food\s+service|restaurant))', text_lower)
        if exp_match:
            fid = self.emit(
                fact_type="management_experience_depth",
                fact_payload={"years": int(exp_match.group(1))},
                source_zone=SourceZone.ITEM, source_item=2,
                source_pages=[section.start_page],
                family="identity", importance=Importance.CONTEXT,
                confidence=0.7, raw_evidence=exp_match.group(0)[:200],
            )
            fact_ids.append(fid)

        return fact_ids
