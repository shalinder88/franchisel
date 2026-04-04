"""
Worker 22: Item 20 — Outlets and Franchisee Information

Extracts: outlet history tables, transfers, closures, reacquisitions,
sold-not-opened, projected openings, current/former franchisee exhibit references.

Gold rule: Item 20 is almost a separate job. Every outlet table and note matters.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item20Worker(ItemWorkerBase):
    ITEM_NUM = 20
    ITEM_FAMILY = "performance"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Delegate sub-tasks ──
        from ..ticket_broker import TicketType, TicketPriority
        tables = section.tables if hasattr(section, 'tables') else []
        if tables:
            self.request_help(
                TicketType.EXTRACT_OUTLET_ROWS,
                f"Extract and classify all outlet table rows across {len(tables)} tables",
                priority=TicketPriority.HIGH, source_item=20,
                context={"table_count": len(tables)},
            )
            self.request_help(
                TicketType.VALIDATE_TOTALS,
                "Validate outlet table totals: franchised + company = systemwide",
                priority=TicketPriority.NORMAL, source_item=20,
            )
        self.request_help(
            TicketType.EXTRACT_FRANCHISEE_LIST,
            "Parse current/former franchisee list exhibits referenced by Item 20",
            priority=TicketPriority.NORMAL, source_item=20,
        )

        # ── Outlet table rows (every row is important) ──
        for table in (section.tables if hasattr(section, 'tables') else []):
            for row_idx, row in enumerate(table.rows):
                if not row or not any(cell.strip() for cell in row):
                    continue
                row_text = " ".join(row).lower()

                # Classify row type
                row_type = "data"
                if any(kw in row_text for kw in ["total", "systemwide"]):
                    row_type = "total"
                elif any(kw in row_text for kw in ["transfer", "assignment"]):
                    row_type = "transfer"
                elif any(kw in row_text for kw in ["terminat", "cancel", "non-renew"]):
                    row_type = "termination"
                elif any(kw in row_text for kw in ["ceas", "close", "reacquir"]):
                    row_type = "closure"
                elif any(kw in row_text for kw in ["open", "new"]):
                    row_type = "opening"

                fid = self.emit(
                    fact_type="outlet_table_row",
                    fact_payload={
                        "row_idx": row_idx,
                        "row_type": row_type,
                        "cells": row,
                        "table_title": table.title,
                    },
                    source_zone=SourceZone.TABLE,
                    source_item=20,
                    source_pages=[table.source_page],
                    source_table_id=table.table_id,
                    object_type=ObjectType.OUTLET_RECORD,
                    family="performance",
                    importance=Importance.CORE if row_type in ("total", "closure", "termination") else Importance.SECONDARY,
                    confidence=0.85,
                )
                fact_ids.append(fid)

        # ── Projected openings ──
        proj_match = re.search(
            r'(?:project\w*|estimat\w*|plan\w*)\s+(?:to\s+)?(?:open|add)\s+(?:approximately\s+)?(\d+)',
            text_lower
        )
        if proj_match:
            fid = self.emit(
                fact_type="projected_openings",
                fact_payload={"count": int(proj_match.group(1))},
                source_zone=SourceZone.ITEM,
                source_item=20,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.75,
                raw_evidence=proj_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Franchisee list references ──
        if re.search(r'(?:exhibit|attachment)\s+\w+\s+(?:contain|list|identif)', text_lower):
            for m in re.finditer(r'(?:exhibit|attachment)\s+(\w+)', text_lower):
                code = m.group(1).upper()
                fid = self.emit(
                    fact_type="franchisee_list_reference",
                    fact_payload={"exhibit_code": code},
                    source_zone=SourceZone.ITEM,
                    source_item=20,
                    source_pages=[section.start_page],
                    family="document",
                    importance=Importance.SECONDARY,
                    confidence=0.7,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        return fact_ids
