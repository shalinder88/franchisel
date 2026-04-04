"""
Worker 26: Essential Table Extractor

Parses EVERY important table globally: fee tables, investment tables,
obligations matrices, training tables, FPR tables, outlet tables,
financial tables, state tables.

Tables are NOT secondary. They are first-class evidence.
Notes under tables are often as important as the table itself.

This worker's output can OVERRIDE weak item-worker table parsing
but NOT erase item-worker evidence.
"""

from typing import Any, Dict, List, Optional
from .base_worker import BaseWorker
from .fact_packet import SourceZone, ObjectType, Importance
from .source_registry import SourceType

import re


class TableExtractorWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "table_extractor"

    @property
    def worker_num(self) -> int:
        return 26

    def execute(self) -> Dict[str, Any]:
        """Global table pass across all items and exhibits."""
        items = self.context.get("items", {})
        exhibits = self.context.get("exhibits", {})
        all_tables = self.context.get("all_tables", [])
        sources_parsed = []

        # ── Pass 1: Collect all tables from items ──
        item_tables = []
        for item_num, section in items.items():
            if hasattr(section, 'tables'):
                for table in section.tables:
                    item_tables.append((item_num, table))

        # ── Pass 2: Collect tables from exhibits ──
        exhibit_tables = []
        for code, ex in exhibits.items():
            if hasattr(ex, 'tables'):
                for table in ex.tables:
                    exhibit_tables.append((code, table))

        # ── Pass 3: Process each table ──
        for source_id, table in item_tables:
            table_source_id = table.table_id if hasattr(table, 'table_id') else f"table_item{source_id}"

            # Classify table type
            table_class = self._classify_table(table)

            # Register and claim
            self.source_registry.register(
                table_source_id, SourceType.TABLE,
                pages=[table.source_page] if hasattr(table, 'source_page') else [],
                item_num=source_id if isinstance(source_id, int) else None,
            )
            self.mark_source_parsing(table_source_id)

            # Emit full table with classification
            table_data = self._build_table_data(table, table_class)
            fid = self.emit_table(
                table_data=table_data,
                source_item=source_id if isinstance(source_id, int) else None,
                source_pages=[table.source_page] if hasattr(table, 'source_page') else [],
                table_id=table_source_id,
                family=table_class.get("family", "economics"),
                importance=Importance.CORE if table_class.get("critical") else Importance.SECONDARY,
            )

            # Emit individual notes as separate facts
            self._emit_table_notes(table, source_id)

            self.mark_source_parsed(table_source_id, [fid])
            sources_parsed.append(table_source_id)

        # ── Pass 4: Process exhibit tables ──
        for exhibit_code, table in exhibit_tables:
            table_source_id = table.table_id if hasattr(table, 'table_id') else f"table_ex{exhibit_code}"
            self.source_registry.register(
                table_source_id, SourceType.TABLE,
                pages=[table.source_page] if hasattr(table, 'source_page') else [],
                exhibit_code=exhibit_code if isinstance(exhibit_code, str) else None,
            )
            self.mark_source_parsing(table_source_id)

            table_class = self._classify_table(table)
            table_data = self._build_table_data(table, table_class)
            fid = self.emit_table(
                table_data=table_data,
                source_exhibit=exhibit_code if isinstance(exhibit_code, str) else None,
                source_pages=[table.source_page] if hasattr(table, 'source_page') else [],
                table_id=table_source_id,
                family=table_class.get("family", "document"),
            )
            self.mark_source_parsed(table_source_id, [fid])
            sources_parsed.append(table_source_id)

        return {
            "sources_parsed": sources_parsed,
            "unresolved": [w for w in self.warnings],
            "tables_processed": len(item_tables) + len(exhibit_tables),
        }

    def _classify_table(self, table) -> Dict[str, Any]:
        """Classify a table by its content type."""
        title = (table.title or "").lower() if hasattr(table, 'title') else ""
        table_type = (table.table_type or "").lower() if hasattr(table, 'table_type') else ""

        # Check columns and first few rows for classification signals
        cols = " ".join(table.columns).lower() if hasattr(table, 'columns') and table.columns else ""
        first_rows = ""
        if hasattr(table, 'rows') and table.rows:
            first_rows = " ".join(" ".join(r) for r in table.rows[:3]).lower()

        combined = f"{title} {table_type} {cols} {first_rows}"

        if any(kw in combined for kw in ["franchise fee", "initial fee", "establishment fee"]):
            return {"type": "fee_table", "family": "economics", "critical": True, "item": 5}
        if any(kw in combined for kw in ["royalty", "advertising", "continuing", "recurring"]):
            return {"type": "fee_table", "family": "economics", "critical": True, "item": 6}
        if any(kw in combined for kw in ["estimated initial investment", "total investment", "expenditure"]):
            return {"type": "investment_table", "family": "economics", "critical": True, "item": 7}
        if any(kw in combined for kw in ["training", "program", "instruction"]):
            return {"type": "training_table", "family": "control", "critical": False, "item": 11}
        if any(kw in combined for kw in ["obligation", "franchisee obligation"]):
            return {"type": "obligations_matrix", "family": "control", "critical": False, "item": 9}
        if any(kw in combined for kw in ["financial performance", "fpr", "average", "median", "gross sales"]):
            return {"type": "fpr_table", "family": "performance", "critical": True, "item": 19}
        if any(kw in combined for kw in ["outlet", "systemwide", "franchise", "company-owned", "transfer"]):
            return {"type": "outlet_table", "family": "performance", "critical": True, "item": 20}
        if any(kw in combined for kw in ["balance sheet", "income statement", "cash flow", "revenue"]):
            return {"type": "financial_table", "family": "performance", "critical": True, "item": 21}
        if any(kw in combined for kw in ["state", "addend", "effective date"]):
            return {"type": "state_table", "family": "document", "critical": False}

        return {"type": "unknown", "family": "document", "critical": False}

    def _build_table_data(self, table, table_class: Dict) -> Dict[str, Any]:
        """Build a rich table data dict for emission."""
        return {
            "table_id": table.table_id if hasattr(table, 'table_id') else "",
            "title": table.title if hasattr(table, 'title') else "",
            "table_type": table_class.get("type", "unknown"),
            "classified_item": table_class.get("item"),
            "columns": table.columns if hasattr(table, 'columns') else [],
            "row_count": table.row_count if hasattr(table, 'row_count') else len(table.rows) if hasattr(table, 'rows') else 0,
            "rows": table.rows[:100] if hasattr(table, 'rows') else [],
            "note_count": len(table.table_notes) if hasattr(table, 'table_notes') else 0,
            "detection_method": table.detection_method.value if hasattr(table, 'detection_method') else "unknown",
            "confidence": table.confidence if hasattr(table, 'confidence') else "medium",
        }

    def _emit_table_notes(self, table, source_id):
        """Emit each table note as a separate fact (notes are critical evidence)."""
        if not hasattr(table, 'table_notes'):
            return
        for note in table.table_notes:
            note_text = note.text if hasattr(note, 'text') else str(note)
            if len(note_text) > 15:
                self.emit(
                    fact_type="table_note",
                    fact_payload={
                        "note_num": note.note_num if hasattr(note, 'note_num') else 0,
                        "text": note_text[:400],
                        "table_id": table.table_id if hasattr(table, 'table_id') else "",
                    },
                    source_zone=SourceZone.TABLE,
                    source_item=source_id if isinstance(source_id, int) else None,
                    source_pages=[table.source_page] if hasattr(table, 'source_page') else [],
                    source_table_id=table.table_id if hasattr(table, 'table_id') else None,
                    family="economics",
                    importance=Importance.SECONDARY,
                    confidence=0.75,
                    raw_evidence=note_text[:200],
                )
