"""
Worker 9: Item 7 — Estimated Initial Investment

Extracts: full investment tables, notes, landlord allowance assumptions,
extra funding periods, capex footnotes, optional systems.

Gold rule: Pull every table row. Notes under investment tables are
often as important as the table itself.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item07Worker(ItemWorkerBase):
    ITEM_NUM = 7
    ITEM_FAMILY = "economics"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Delegate sub-tasks ──
        from ..ticket_broker import TicketType, TicketPriority
        tables = section.tables if hasattr(section, 'tables') else []
        if len(tables) > 1:
            self.request_help(
                TicketType.VALIDATE_TOTALS,
                "Validate investment table low/high totals match line items",
                priority=TicketPriority.HIGH, source_item=7,
                context={"table_count": len(tables)},
            )
        notes_count = sum(len(t.table_notes) if hasattr(t, 'table_notes') else 0 for t in tables)
        if notes_count > 2:
            self.request_help(
                TicketType.READ_TABLE_NOTES,
                f"Deep-read {notes_count} investment table notes for assumptions/exclusions",
                priority=TicketPriority.HIGH, source_item=7,
                context={"notes_count": notes_count},
            )

        # ── Investment line items from tables ──
        for table in (section.tables if hasattr(section, 'tables') else []):
            for row_idx, row in enumerate(table.rows):
                if not row or not any(cell.strip() for cell in row):
                    continue
                row_text = " ".join(row)
                row_lower = row_text.lower()

                # Skip header rows
                if any(h in row_lower for h in ["type of expenditure", "low", "high", "your estimated"]):
                    if "total" not in row_lower:
                        continue

                # Parse dollar amounts
                amounts = re.findall(r'\$\s*([\d,]+)', row_text)
                if amounts:
                    cleaned = [float(a.replace(",", "")) for a in amounts]
                    line_data = {
                        "row_idx": row_idx,
                        "label": row[0].strip() if row else "",
                        "amounts": cleaned,
                        "raw_cells": row,
                    }

                    # Classify line item
                    if "total" in row_lower and ("investment" in row_lower or "estimated" in row_lower):
                        line_data["line_type"] = "total_investment"
                    elif any(k in row_lower for k in ["real property", "leasehold", "build"]):
                        line_data["line_type"] = "real_property"
                    elif "equipment" in row_lower:
                        line_data["line_type"] = "equipment"
                    elif "inventory" in row_lower:
                        line_data["line_type"] = "inventory"
                    elif any(k in row_lower for k in ["additional fund", "working capital", "start-up"]):
                        line_data["line_type"] = "working_capital"
                    elif "training" in row_lower:
                        line_data["line_type"] = "training"
                    elif any(k in row_lower for k in ["technology", "software", "computer"]):
                        line_data["line_type"] = "technology"
                    elif any(k in row_lower for k in ["insurance", "permit", "license"]):
                        line_data["line_type"] = "insurance_permits"
                    elif any(k in row_lower for k in ["sign", "signage", "decor"]):
                        line_data["line_type"] = "signage"
                    else:
                        line_data["line_type"] = "other"

                    fid = self.emit(
                        fact_type="investment_line_item",
                        fact_payload=line_data,
                        source_zone=SourceZone.TABLE,
                        source_item=7,
                        source_pages=[table.source_page],
                        source_table_id=table.table_id,
                        object_type=ObjectType.INVESTMENT_LINE,
                        family="economics",
                        importance=Importance.CORE if line_data["line_type"] == "total_investment" else Importance.SECONDARY,
                        confidence=0.85,
                        raw_evidence=row_text[:200],
                    )
                    fact_ids.append(fid)

        # ── Investment assumptions from notes ──
        assumption_patterns = [
            (r'(?:assumes?\s+(?:a\s+)?(?:landlord|tenant)\s+(?:allowance|improvement))', "landlord_allowance"),
            (r'(?:3|three|6|six)\s+months?\s+(?:of\s+)?(?:additional|operating|working)', "funding_period"),
            (r'(?:does\s+not\s+include|exclud\w*)\s+(?:real\s+estate|land|property)', "excludes_real_estate"),
            (r'(?:remodel|renovation|refresh)', "remodel_cost"),
        ]
        for pattern, assumption_type in assumption_patterns:
            m = re.search(pattern, text_lower)
            if m:
                fid = self.emit(
                    fact_type="investment_assumption",
                    fact_payload={"type": assumption_type, "evidence": m.group(0)[:200]},
                    source_zone=SourceZone.ITEM,
                    source_item=7,
                    source_pages=[section.start_page],
                    family="economics",
                    importance=Importance.SECONDARY,
                    confidence=0.75,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        return fact_ids
