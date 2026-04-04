"""
Worker 10: Item 8 — Restrictions on Sources of Products and Services

Extracts: required purchases, supplier restrictions, affiliate economics,
rebates, commissions, markups, required purchase percentages, approval process,
insurance/vendor control.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item08Worker(ItemWorkerBase):
    ITEM_NUM = 8
    ITEM_FAMILY = "control"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Delegate sub-tasks ──
        from ..ticket_broker import TicketType, TicketPriority
        self.request_help(
            TicketType.CHECK_CROSS_ITEM_CONFLICT,
            "Verify supplier revenue in Item 8 consistent with Item 21 financials",
            priority=TicketPriority.NORMAL, source_item=8,
            context={"cross_items": [21]},
        )

        # ── Affiliate revenue / rebate economics ──
        rev_patterns = [
            (r'(?:we|franchisor|our\s+affiliate)\s+(?:received|derived|earned)\s+(?:approximately\s+)?\$\s*([\d,.]+)\s*(?:million|billion)?', "affiliate_revenue"),
            (r'(?:rebate|commission|markup|kickback).*?\$\s*([\d,]+)', "rebate_amount"),
            (r'(?:rebate|commission|markup)\s+(?:of\s+)?(\d+(?:\.\d+)?%)', "rebate_rate"),
        ]
        for pattern, fact_type in rev_patterns:
            for m in re.finditer(pattern, text_lower):
                fid = self.emit(
                    fact_type=fact_type,
                    fact_payload={"match": m.group(0)[:200], "value": m.group(1)},
                    source_zone=SourceZone.ITEM,
                    source_item=8,
                    source_pages=[section.start_page],
                    family="economics",
                    importance=Importance.CORE,
                    confidence=0.8,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Required purchase percentage ──
        pct_match = re.search(
            r'(?:approximately\s+)?(\d+)\s*%\s+(?:of\s+)?(?:your\s+)?(?:total\s+)?(?:purchase|expenditure|cost)',
            text_lower
        )
        if pct_match:
            fid = self.emit(
                fact_type="required_purchase_percentage",
                fact_payload={"percentage": int(pct_match.group(1))},
                source_zone=SourceZone.ITEM,
                source_item=8,
                source_pages=[section.start_page],
                family="control",
                importance=Importance.CORE,
                confidence=0.85,
                raw_evidence=pct_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Supplier approval process ──
        if re.search(r'(?:submit|request)\s+(?:for\s+)?(?:our\s+)?(?:written\s+)?(?:approval|consent)', text_lower):
            m = re.search(r'(?:submit|request)[^.]{0,200}', text_lower)
            fid = self.emit(
                fact_type="supplier_approval_process",
                fact_payload={"present": True, "detail": m.group(0)[:200] if m else ""},
                source_zone=SourceZone.ITEM,
                source_item=8,
                source_pages=[section.start_page],
                family="control",
                importance=Importance.SECONDARY,
                confidence=0.8,
                raw_evidence=m.group(0)[:200] if m else "",
            )
            fact_ids.append(fid)

        # ── Insurance requirements ──
        ins_match = re.search(r'(?:insurance|coverage)\s+(?:requirement|must|minimum)[^.]{0,300}', text_lower)
        if ins_match:
            fid = self.emit(
                fact_type="insurance_requirement",
                fact_payload={"detail": ins_match.group(0)[:300]},
                source_zone=SourceZone.ITEM,
                source_item=8,
                source_pages=[section.start_page],
                family="economics",
                importance=Importance.SECONDARY,
                confidence=0.75,
                raw_evidence=ins_match.group(0)[:200],
            )
            fact_ids.append(fid)

        return fact_ids
