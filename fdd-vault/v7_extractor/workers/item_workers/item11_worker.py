"""
Worker 13: Item 11 — Franchisor's Assistance, Advertising, Computer Systems, Training

Extracts: support, training tables, advertising funds, computer systems,
timelines to open, pre-opening milestones, manual size/TOC.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item11Worker(ItemWorkerBase):
    ITEM_NUM = 11
    ITEM_FAMILY = "control"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Training program details ──
        training_patterns = [
            (r'(\d+)\s+(?:hour|day|week)s?\s+(?:of\s+)?(?:initial\s+)?(?:class\w*|on.?site|training)', "training_duration"),
            (r'(?:training\s+(?:at|in)\s+)([\w\s,]+?)(?:\.|,|;)', "training_location"),
            (r'(?:additional\s+training|ongoing\s+training|annual\s+(?:training|convention))', "ongoing_training"),
        ]
        for pattern, fact_type in training_patterns:
            m = re.search(pattern, text_lower)
            if m:
                fid = self.emit(
                    fact_type=fact_type,
                    fact_payload={"match": m.group(0)[:200], "value": m.group(1) if m.lastindex else ""},
                    source_zone=SourceZone.ITEM,
                    source_item=11,
                    source_pages=[section.start_page],
                    object_type=ObjectType.TRAINING_SPEC,
                    family="control",
                    importance=Importance.SECONDARY,
                    confidence=0.8,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── Training table rows ──
        for table in (section.tables if hasattr(section, 'tables') else []):
            if any(kw in (table.title or "").lower() for kw in ["training", "program"]):
                for row_idx, row in enumerate(table.rows):
                    if not row or not any(cell.strip() for cell in row):
                        continue
                    fid = self.emit(
                        fact_type="training_table_row",
                        fact_payload={"row_idx": row_idx, "cells": row},
                        source_zone=SourceZone.TABLE,
                        source_item=11,
                        source_pages=[table.source_page],
                        source_table_id=table.table_id,
                        object_type=ObjectType.TABLE_ROW,
                        family="control",
                        importance=Importance.SECONDARY,
                        confidence=0.8,
                    )
                    fact_ids.append(fid)

        # ── Pre-opening timeline ──
        timeline_match = re.search(
            r'(?:estimated|typical|expect)\s+(?:time\s+)?(?:to\s+)?(?:open|opening)[^.]{0,200}',
            text_lower
        )
        if timeline_match:
            fid = self.emit(
                fact_type="pre_opening_timeline",
                fact_payload={"detail": timeline_match.group(0)[:200]},
                source_zone=SourceZone.ITEM,
                source_item=11,
                source_pages=[section.start_page],
                family="control",
                importance=Importance.SECONDARY,
                confidence=0.75,
                raw_evidence=timeline_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Computer/technology systems ──
        tech_patterns = [
            r'(?:pos\s+system|point.of.sale)',
            r'(?:proprietary\s+software|our\s+(?:software|system|platform))',
            r'(?:computer|technology)\s+(?:system|hardware|software)',
        ]
        for pattern in tech_patterns:
            m = re.search(pattern + r'[^.]{0,200}', text_lower)
            if m:
                fid = self.emit(
                    fact_type="technology_system",
                    fact_payload={"detail": m.group(0)[:200]},
                    source_zone=SourceZone.ITEM,
                    source_item=11,
                    source_pages=[section.start_page],
                    family="control",
                    importance=Importance.SECONDARY,
                    confidence=0.75,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)
                break  # One tech system fact is enough

        # ── Operations manual reference ──
        manual_match = re.search(
            r'(?:operations?\s+(?:and\s+training\s+)?manual|o\s*&\s*t\s+manual)[^.]{0,200}',
            text_lower
        )
        if manual_match:
            fid = self.emit(
                fact_type="operations_manual",
                fact_payload={"detail": manual_match.group(0)[:200]},
                source_zone=SourceZone.ITEM,
                source_item=11,
                source_pages=[section.start_page],
                family="control",
                importance=Importance.CONTEXT,
                confidence=0.7,
                raw_evidence=manual_match.group(0)[:200],
            )
            fact_ids.append(fid)

        return fact_ids
