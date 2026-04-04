"""
Worker 24: Item 22 — Contracts

Extracts: contracts inventory, exhibit package classification,
agreement stack, what governs what.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item22Worker(ItemWorkerBase):
    ITEM_NUM = 22
    ITEM_FAMILY = "document"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Agreement inventory ──
        agreement_types = [
            ("franchise agreement", "franchise_agreement"),
            ("development agreement", "development_agreement"),
            ("area development", "area_development_agreement"),
            ("guaranty", "guaranty"),
            ("personal guaranty", "personal_guaranty"),
            ("lease rider", "lease_rider"),
            ("sublease", "sublease"),
            ("equipment lease", "equipment_lease"),
            ("software agreement", "software_agreement"),
            ("confidentiality", "confidentiality_agreement"),
            ("non-disclosure", "nda"),
            ("release", "release"),
            ("acknowledgment", "acknowledgment"),
            ("promissory note", "promissory_note"),
        ]

        found_agreements = []
        for pattern, agreement_type in agreement_types:
            if pattern in text_lower:
                found_agreements.append(agreement_type)

        if found_agreements:
            fid = self.emit(
                fact_type="agreement_inventory",
                fact_payload={"agreements": found_agreements},
                source_zone=SourceZone.ITEM,
                source_item=22,
                source_pages=[section.start_page],
                family="document",
                importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        # ── Exhibit cross-references ──
        for m in re.finditer(r'(?:exhibit|attachment)\s+([A-Z](?:-?\d+)?)', text):
            code = m.group(1)
            fid = self.emit(
                fact_type="contract_exhibit_reference",
                fact_payload={"exhibit_code": code},
                source_zone=SourceZone.ITEM,
                source_item=22,
                source_pages=[section.start_page],
                family="document",
                importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
