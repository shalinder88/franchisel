"""
Worker 7: Item 5 — Initial Fees

Extracts: every fee row from tables, franchise fee, development fee,
technology fee, deposits, optional setup fees, refundability, due dates.

Gold rule: Do not just take headline numbers. Pull every table row,
all table notes, fee triggers, fee mechanics.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item05Worker(ItemWorkerBase):
    ITEM_NUM = 5
    ITEM_FAMILY = "economics"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        """Item 5-specific: fee refundability is fee-scoped, not global."""
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Fee-scoped refundability (not a single global boolean) ──
        fee_rows = parsed.get("fee_rows", {}).get("value", [])
        for fr in fee_rows:
            fee_type = fr.get("fee_type", "other")
            row_text = " ".join(fr.get("raw_cells", [])).lower()

            refund_status = None
            if "non-refundable" in row_text or "nonrefundable" in row_text:
                refund_status = "non_refundable"
            elif "refundable" in row_text:
                refund_status = "refundable"

            if refund_status:
                fid = self.emit(
                    fact_type="fee_refundability",
                    fact_payload={
                        "fee_type": fee_type,
                        "refundable": refund_status == "refundable",
                        "scope": fee_type,
                    },
                    source_zone=SourceZone.TABLE,
                    source_item=5,
                    source_pages=[fr.get("provenance", {}).get("source_page", section.start_page)],
                    object_type=ObjectType.FEE_SPEC,
                    family="economics",
                    importance=Importance.CORE,
                    confidence=0.85,
                    raw_evidence=row_text[:200],
                )
                fact_ids.append(fid)

        # ── Due dates / payment timing ──
        due_patterns = [
            (r'(?:due|payable)\s+(?:upon|at)\s+(?:signing|execution)', "at_signing"),
            (r'(?:due|payable)\s+(?:upon|at)\s+(?:opening|grand\s+opening)', "at_opening"),
            (r'(?:due|payable)\s+(?:within|no\s+later\s+than)\s+(\d+)\s+days?', "within_days"),
        ]
        for pattern, timing in due_patterns:
            m = re.search(pattern, text_lower)
            if m:
                fid = self.emit(
                    fact_type="fee_due_date",
                    fact_payload={"timing": timing, "match": m.group(0)[:100]},
                    source_zone=SourceZone.ITEM,
                    source_item=5,
                    source_pages=[section.start_page],
                    family="economics",
                    importance=Importance.SECONDARY,
                    confidence=0.8,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Development fee (separate from franchise fee) ──
        dev_fee = None
        for fr in fee_rows:
            if fr.get("fee_type") == "development_fee" and fr.get("amount"):
                dev_fee = fr["amount"]
                break
        if not dev_fee:
            m = re.search(r'(?:development|area\s+development)\s+fee[^$]{0,100}\$\s*([\d,]+)', text_lower)
            if m:
                dev_fee = {"amount": float(m.group(1).replace(",", ""))}

        if dev_fee:
            fid = self.emit(
                fact_type="development_fee",
                fact_payload=dev_fee,
                source_zone=SourceZone.ITEM,
                source_item=5,
                source_pages=[section.start_page],
                object_type=ObjectType.FEE_SPEC,
                family="economics",
                importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
