"""
Worker 8: Item 6 — Recurring Fees

Extracts: royalty, ad fund, technology fee, transfer fee, renewal fee,
variable fees, EFT rules, thresholds, liquidated damages, audit/interest/default costs.

Gold rule: Do not stop at royalty and franchise fee. Capture the optional
technology-service stack, audit rules, supplier economics, remodel obligations.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item06Worker(ItemWorkerBase):
    ITEM_NUM = 6
    ITEM_FAMILY = "economics"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Delegate sub-tasks to idle workers ──
        self._create_help_tickets(section)

        # ── Fee mechanics (not just the rate, but how it's calculated) ──
        mechanics_patterns = [
            (r'(?:royalt\w*|fee)\s+(?:is|of)\s+(\d+(?:\.\d+)?%)\s+of\s+([\w\s]+?)(?:\.|,|;)', "royalty_mechanics"),
            (r'(?:minimum|floor)\s+(?:royalt\w*|fee)\s+(?:of\s+)?\$\s*([\d,]+)', "minimum_royalty"),
            (r'(?:technology|software|pos)\s+(?:fee|charge)\s+(?:of\s+)?\$\s*([\d,]+)', "technology_fee_amount"),
            (r'(?:audit|inspection)\s+(?:fee|charge|cost).*?\$\s*([\d,]+)', "audit_fee"),
            (r'(?:interest|late)\s+(?:charge|fee|payment).*?(\d+(?:\.\d+)?%)', "late_fee_rate"),
            (r'(?:liquidated\s+damages?|early\s+termination\s+fee).*?\$\s*([\d,]+)', "liquidated_damages"),
        ]

        for pattern, fact_type in mechanics_patterns:
            m = re.search(pattern, text_lower)
            if m:
                fid = self.emit(
                    fact_type=fact_type,
                    fact_payload={"match": m.group(0)[:150], "groups": list(m.groups())},
                    source_zone=SourceZone.ITEM,
                    source_item=6,
                    source_pages=[section.start_page],
                    object_type=ObjectType.FEE_SPEC,
                    family="economics",
                    importance=Importance.CORE if "royalty" in fact_type else Importance.SECONDARY,
                    confidence=0.8,
                    raw_evidence=m.group(0)[:200],
                )
                fact_ids.append(fid)

        # ── EFT / electronic payment requirements ──
        if re.search(r'(?:eft|electronic\s+fund|ach|auto\w*\s+debit)', text_lower):
            m = re.search(r'(?:eft|electronic\s+fund|ach|auto\w*\s+debit)[^.]{0,200}', text_lower)
            fid = self.emit(
                fact_type="eft_requirement",
                fact_payload={"present": True, "detail": m.group(0)[:200] if m else ""},
                source_zone=SourceZone.ITEM,
                source_item=6,
                source_pages=[section.start_page],
                family="control",
                importance=Importance.SECONDARY,
                confidence=0.8,
                raw_evidence=m.group(0)[:200] if m else "",
            )
            fact_ids.append(fid)

        # ── Table notes (often as important as the table) ──
        for table in (section.tables if hasattr(section, 'tables') else []):
            for note in (table.table_notes if hasattr(table, 'table_notes') else []):
                note_text = note.text if hasattr(note, 'text') else str(note)
                if len(note_text) > 20:
                    fid = self.emit(
                        fact_type="fee_table_note",
                        fact_payload={
                            "note_num": note.note_num if hasattr(note, 'note_num') else 0,
                            "text": note_text[:300],
                            "table_id": table.table_id,
                        },
                        source_zone=SourceZone.TABLE,
                        source_item=6,
                        source_pages=[table.source_page],
                        source_table_id=table.table_id,
                        object_type=ObjectType.SCALAR,
                        family="economics",
                        importance=Importance.SECONDARY,
                        confidence=0.75,
                        raw_evidence=note_text[:200],
                    )
                    fact_ids.append(fid)

        return fact_ids

    def _create_help_tickets(self, section):
        from ..ticket_broker import TicketType, TicketPriority
        tables = section.tables if hasattr(section, 'tables') else []
        notes_count = sum(len(t.table_notes) if hasattr(t, 'table_notes') else 0
                          for t in tables)
        if notes_count > 2:
            self.request_help(
                TicketType.READ_TABLE_NOTES,
                f"Deep-read {notes_count} fee table notes for triggers/thresholds/mechanics",
                priority=TicketPriority.HIGH, source_item=6,
                context={"notes_count": notes_count},
            )
        if len(tables) > 1:
            self.request_help(
                TicketType.VALIDATE_TOTALS,
                "Validate fee table arithmetic and cross-table consistency",
                priority=TicketPriority.NORMAL, source_item=6,
                context={"table_count": len(tables)},
            )
