"""Worker 11: Item 9 — Franchisee's Obligations. Obligations matrix + cross-reference map."""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

class Item09Worker(ItemWorkerBase):
    ITEM_NUM = 9
    ITEM_FAMILY = "control"
    CRITICAL = False

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        # Item 9 is primarily a cross-reference matrix
        # Emit table rows as obligations routing
        for table in (section.tables if hasattr(section, 'tables') else []):
            for row_idx, row in enumerate(table.rows):
                if not row or not any(cell.strip() for cell in row):
                    continue
                fid = self.emit(
                    fact_type="obligation_matrix_row",
                    fact_payload={"row_idx": row_idx, "cells": row},
                    source_zone=SourceZone.TABLE, source_item=9,
                    source_pages=[table.source_page],
                    source_table_id=table.table_id,
                    object_type=ObjectType.TABLE_ROW,
                    family="control", importance=Importance.CONTEXT,
                    confidence=0.8,
                )
                fact_ids.append(fid)
        return fact_ids
