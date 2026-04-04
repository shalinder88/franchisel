"""
Worker 14: Item 12 — Territory

Extracts: protected area, non-exclusive language, reserved rights,
encroachment risk, alternative channels, competition carveouts,
online ordering carveouts.

Gold rule: Territory is enum-first. Never start with exclusiveTerritory=true/false.
Start with: protected area, non-exclusive, exclusive unit location only,
reserved rights heavy, channel carveouts, encroachment risk.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item12Worker(ItemWorkerBase):
    ITEM_NUM = 12
    ITEM_FAMILY = "risk"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Territory type classification (enum-first) ──
        territory_type = "unknown"
        territory_evidence = []

        # Check for no exclusive territory
        if re.search(r'(?:no|not)\s+(?:receive|grant\w*|have)\s+(?:an?\s+)?(?:exclusive|protected)\s+(?:territory|area)', text_lower):
            territory_type = "non_exclusive"
            territory_evidence.append("no_exclusive_grant")

        # Check for protected area
        if re.search(r'(?:protected|designated)\s+(?:territory|area|zone)', text_lower):
            if territory_type == "non_exclusive":
                territory_type = "protected_but_carved_out"
            else:
                territory_type = "protected_area"
            territory_evidence.append("protected_area_mentioned")

        # Check for exclusive unit location only
        if re.search(r'(?:exclusive|protected)\s+(?:only\s+)?(?:at|for|within)\s+(?:your\s+)?(?:location|premises|site)', text_lower):
            territory_type = "exclusive_unit_location_only"
            territory_evidence.append("exclusive_at_location_only")

        # Check reserved rights
        if re.search(r'(?:we|franchisor)\s+(?:reserve|retain)\s+(?:the\s+)?(?:right|ability)', text_lower):
            if "protected" in territory_type:
                territory_type = "reserved_rights_heavy"
            territory_evidence.append("reserved_rights")

        fid = self.emit(
            fact_type="territory_classification",
            fact_payload={
                "territory_type": territory_type,
                "evidence": territory_evidence,
            },
            source_zone=SourceZone.ITEM,
            source_item=12,
            source_pages=[section.start_page],
            object_type=ObjectType.TERRITORY_SPEC,
            family="risk",
            importance=Importance.CORE,
            confidence=0.8,
        )
        fact_ids.append(fid)

        # ── Channel carveouts ──
        channel_patterns = [
            (r'(?:online|internet|e.?commerce|digital)\s+(?:order|sale|channel)', "online_channel"),
            (r'(?:delivery|catering|wholesale|grocery|retail)', "alternative_channel"),
            (r'(?:non.?traditional|airport|stadium|hospital|military|university)', "non_traditional_channel"),
        ]
        for pattern, channel_type in channel_patterns:
            m = re.search(pattern + r'[^.]{0,200}', text_lower)
            if m:
                fid = self.emit(
                    fact_type="channel_carveout",
                    fact_payload={"channel": channel_type, "detail": m.group(0)[:200]},
                    source_zone=SourceZone.ITEM,
                    source_item=12,
                    source_pages=[section.start_page],
                    object_type=ObjectType.TERRITORY_SPEC,
                    family="risk",
                    importance=Importance.CORE,
                    confidence=0.75,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Encroachment risk ──
        encroach = re.search(
            r'(?:we|franchisor)\s+(?:may|can|has\s+the\s+right|reserve)[^.]{0,200}(?:establish|operate|open|develop|grant)',
            text_lower
        )
        if encroach:
            fid = self.emit(
                fact_type="encroachment_risk",
                fact_payload={"present": True, "detail": encroach.group(0)[:200]},
                source_zone=SourceZone.ITEM,
                source_item=12,
                source_pages=[section.start_page],
                family="risk",
                importance=Importance.CORE,
                confidence=0.8,
                raw_evidence=encroach.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Radius / distance ──
        radius_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:-?\s*)?(?:mile|km|kilometer|block|feet|foot)', text_lower)
        if radius_match:
            fid = self.emit(
                fact_type="territory_radius",
                fact_payload={"value": radius_match.group(0)[:100]},
                source_zone=SourceZone.ITEM,
                source_item=12,
                source_pages=[section.start_page],
                family="risk",
                importance=Importance.SECONDARY,
                confidence=0.8,
                raw_evidence=radius_match.group(0)[:100],
            )
            fact_ids.append(fid)

        return fact_ids
