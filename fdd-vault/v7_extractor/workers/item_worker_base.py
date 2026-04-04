"""
Item Worker Base — Shared logic for all item workers (Workers 3-25).

Each item worker:
  1. Claims its item window from the source registry
  2. Reads every page in its window
  3. Summarizes page-by-page
  4. Extracts raw facts
  5. Pulls on-page tables
  6. Notes exhibit references
  7. Emits unresolveds
  8. Does NOT normalize too early

The existing V7 item parsers (item_parsers/item01.py through item23.py)
are reused as the extraction core. This wrapper adds:
  - Source registry integration
  - FactPacket emission
  - Table/note/exhibit reference tracking
  - Unresolved pointer emission
"""

import re
from typing import Any, Dict, List, Optional
from .base_worker import BaseWorker
from .fact_packet import SourceZone, ObjectType, Importance
from .source_registry import SourceType


class ItemWorkerBase(BaseWorker):
    """Base class for item workers 3-25.

    Subclasses must set:
      - ITEM_NUM: the FDD item number (1-23)
      - ITEM_FAMILY: primary fact family (economics, control, risk, etc.)
      - CRITICAL: whether this is a high-yield item

    Subclasses must implement:
      - extract_facts(): the item-specific extraction logic
    """

    ITEM_NUM: int = 0
    ITEM_FAMILY: str = ""
    CRITICAL: bool = False

    @property
    def worker_id(self) -> str:
        return f"item_{self.ITEM_NUM:02d}"

    @property
    def worker_num(self) -> int:
        return self.ITEM_NUM + 2  # Workers 3-25 map to Items 1-23

    def execute(self) -> Dict[str, Any]:
        """Standard item worker execution flow."""
        items = self.context.get("items", {})
        section = items.get(self.ITEM_NUM)

        if not section:
            self.warn(f"Item {self.ITEM_NUM} not found in segmentation")
            return {
                "sources_parsed": [],
                "unresolved": [f"Item {self.ITEM_NUM} not found"],
                "item_num": self.ITEM_NUM,
            }

        source_id = f"item_{self.ITEM_NUM}"
        sources_parsed = []

        # ── Claim the item window ──
        if not self.claim_source(source_id):
            self.warn(f"Item {self.ITEM_NUM} already claimed by another worker")
            # Still proceed — we may be cross-cutting

        self.mark_source_parsing(source_id)

        # ── Run the existing V7 parser ──
        parsed = self._run_v7_parser(section)

        # ── Emit fact packets from parsed results ──
        fact_ids = self._emit_parsed_facts(parsed, section)

        # ── Extract on-page tables ──
        table_ids = self._emit_tables(section)

        # ── Extract exhibit references ──
        exhibit_refs = self._extract_exhibit_refs(section)

        # ── Extract cross-references ──
        xref_ids = self._emit_cross_refs(section)

        # ── Detect and report contradictions ──
        self._detect_and_report_conflicts(parsed, section)

        # ── Fix 4: Generate tickets from structure, not just facts ──
        self._generate_structural_tickets(section)

        # ── Item-specific extraction ──
        custom_ids = self.extract_facts(section, parsed)

        all_fact_ids = fact_ids + table_ids + xref_ids + custom_ids

        # ── Patch B: Zero-output fallback ──
        # A hydrated item must NEVER end with zero facts, zero unresolveds,
        # zero tickets. That is illegal.
        text_len = len(section.text) if hasattr(section, 'text') and section.text else 0
        if text_len > 50 and len(all_fact_ids) == 0:
            fallback_id = self._emit_thin_item_fallback(section)
            all_fact_ids.append(fallback_id)

        self.mark_source_parsed(source_id, all_fact_ids)
        sources_parsed.append(source_id)

        # Mark consumption
        ledger = self.context.get("consumption_ledger")
        if ledger:
            oid = f"item_{self.ITEM_NUM}_narrative"
            if oid in ledger._entries:
                ledger.mark_parsed(oid)
                ledger.mark_used_by(oid, self.worker_id)

        return {
            "sources_parsed": sources_parsed,
            "unresolved": [w for w in self.warnings],
            "item_num": self.ITEM_NUM,
            "facts_from_parser": len(fact_ids),
            "tables_emitted": len(table_ids),
            "exhibit_refs": exhibit_refs,
            "cross_refs": len(xref_ids),
            "custom_facts": len(custom_ids),
        }

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        """Override in subclass for item-specific extraction.

        Returns list of emitted fact packet IDs.
        """
        return []

    def _run_v7_parser(self, section) -> Dict[str, Any]:
        """Run the existing V7 item parser."""
        from ..item_parsers import parse_item
        try:
            return parse_item(section)
        except Exception as e:
            self.error(f"V7 parser failed for Item {self.ITEM_NUM}: {e}")
            return {"item": self.ITEM_NUM}

    def _emit_parsed_facts(self, parsed: Dict, section) -> List[str]:
        """Convert V7 parser output into fact packets."""
        fact_ids = []

        for key, entry in parsed.items():
            if key == "item":
                continue
            if not isinstance(entry, dict):
                continue
            if entry.get("state") not in ("present", "explicitly_absent"):
                continue

            value = entry.get("value")
            state = entry.get("state")
            prov = entry.get("provenance", {})

            source_page = prov.get("source_page", section.start_page) if prov else section.start_page
            table_id = prov.get("source_table_id") if prov else None

            importance = Importance.CORE if self.CRITICAL else Importance.SECONDARY
            confidence = 0.85 if state == "present" else 0.7

            # Determine source zone
            zone = SourceZone.TABLE if table_id else SourceZone.ITEM

            fid = self.emit(
                fact_type=key,
                fact_payload={"value": value, "state": state},
                source_zone=zone,
                source_item=self.ITEM_NUM,
                source_pages=[source_page],
                source_table_id=table_id,
                object_type=self._infer_object_type(value),
                family=self.ITEM_FAMILY,
                importance=importance,
                confidence=confidence,
                raw_evidence=str(value)[:200] if value else "",
            )
            fact_ids.append(fid)

        return fact_ids

    def _emit_tables(self, section) -> List[str]:
        """Emit all tables in this item section as fact packets."""
        fact_ids = []
        if not hasattr(section, 'tables'):
            return fact_ids

        for table in section.tables:
            table_data = {
                "table_id": table.table_id,
                "title": table.title,
                "table_type": table.table_type,
                "columns": table.columns,
                "row_count": table.row_count,
                "rows": table.rows[:50],  # Cap for packet size
                "notes": [{"num": n.note_num, "text": n.text[:200]}
                          for n in table.table_notes] if hasattr(table, 'table_notes') else [],
            }

            fid = self.emit_table(
                table_data=table_data,
                source_item=self.ITEM_NUM,
                source_pages=[table.source_page],
                table_id=table.table_id,
                family=self.ITEM_FAMILY,
            )
            fact_ids.append(fid)

        return fact_ids

    def _extract_exhibit_refs(self, section) -> List[str]:
        """Find exhibit references in this item's text."""
        refs = []
        text = section.text if hasattr(section, 'text') else ""
        # Find "see Exhibit X", "Exhibit X attached", etc.
        for m in re.finditer(r'[Ee]xhibit\s+([A-Z](?:-\d+)?)', text):
            refs.append(m.group(1))
        return list(set(refs))

    def _emit_cross_refs(self, section) -> List[str]:
        """Emit cross-references as fact packets."""
        fact_ids = []
        if not hasattr(section, 'cross_refs'):
            return fact_ids

        for xref in section.cross_refs:
            fid = self.emit(
                fact_type="cross_reference",
                fact_payload={
                    "text": xref.text[:200] if hasattr(xref, 'text') else str(xref),
                    "target_type": xref.target_type if hasattr(xref, 'target_type') else "",
                    "target_id": xref.target_id if hasattr(xref, 'target_id') else "",
                    "status": xref.status if hasattr(xref, 'status') else "unresolved",
                },
                source_zone=SourceZone.ITEM,
                source_item=self.ITEM_NUM,
                source_pages=[xref.source_page] if hasattr(xref, 'source_page') else [],
                object_type=ObjectType.SCALAR,
                family="document",
                importance=Importance.CONTEXT,
                confidence=0.6,
            )
            fact_ids.append(fid)

        return fact_ids

    def _emit_thin_item_fallback(self, section) -> str:
        """Patch B: Emit a fallback fact when a hydrated item produces zero facts.

        This prevents silent zero-output items. Every hydrated item must
        emit at least one fact, unresolved, or ticket.
        """
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # Try weak pattern detection before giving up
        import re
        weak_facts = {}

        # Dollar amounts
        dollars = re.findall(r'\$\s*([\d,]+)', text)
        if dollars:
            weak_facts["dollar_amounts_found"] = len(dollars)

        # Percentages
        pcts = re.findall(r'(\d+(?:\.\d+)?)\s*%', text)
        if pcts:
            weak_facts["percentages_found"] = len(pcts)

        # Year references
        years = re.findall(r'\b(19|20)\d{2}\b', text)
        if years:
            weak_facts["year_references"] = len(set(years))

        # Item 21-specific weak patterns
        if self.ITEM_NUM == 21:
            if re.search(r'(?:audit|opinion|independent|financial\s+statement)', text_lower):
                weak_facts["audit_language_present"] = True
            if re.search(r'(?:balance\s+sheet|assets?|liabilit|equity|revenue|income|cash\s+flow)', text_lower):
                weak_facts["financial_keywords_present"] = True
            if re.search(r'(?:guarant|indemnif)', text_lower):
                weak_facts["guaranty_references"] = True

        # Item 2-specific: count officer mentions
        if self.ITEM_NUM == 2:
            officers = re.findall(r'(?:principal|officer|director|president|ceo|cfo)', text_lower)
            if officers:
                weak_facts["officer_mentions"] = len(officers)

        fact_type = "thin_item_summary" if weak_facts else "item_present_no_material_facts"

        return self.emit(
            fact_type=fact_type,
            fact_payload={
                "item_num": self.ITEM_NUM,
                "text_length": len(text),
                "weak_signals": weak_facts,
                "needs_review": not bool(weak_facts),
            },
            source_zone=SourceZone.ITEM,
            source_item=self.ITEM_NUM,
            source_pages=[section.start_page],
            family=self.ITEM_FAMILY,
            importance=Importance.CONTEXT,
            confidence=0.3 if not weak_facts else 0.5,
            needs_review=True,
            review_reason=f"Item {self.ITEM_NUM}: {len(text)} chars, 0 strong facts, {len(weak_facts)} weak signals",
        )

    def _generate_structural_tickets(self, section):
        """Fix 4: Generate tickets based on structural presence, not just facts.

        Ticket creation triggers:
          - table presence in this item
          - exhibit references in this item
          - continuation markers (spill flags)
          - unresolved required objects
          - page spill flags from front matter
        """
        from .ticket_broker import TicketType, TicketPriority

        tables = section.tables if hasattr(section, 'tables') else []
        text = section.text if hasattr(section, 'text') else ""

        # Tables with notes → read_table_notes ticket
        notes_count = sum(len(t.table_notes) if hasattr(t, 'table_notes') else 0
                          for t in tables)
        if notes_count > 0 and self.CRITICAL:
            self.request_help(
                TicketType.READ_TABLE_NOTES,
                f"Parse {notes_count} table notes in Item {self.ITEM_NUM}",
                priority=TicketPriority.HIGH if self.CRITICAL else TicketPriority.NORMAL,
                source_item=self.ITEM_NUM,
                context={"notes_count": notes_count},
            )

        # Tables needing continuation check
        for t in tables:
            if hasattr(t, 'continued_on_next_page') and t.continued_on_next_page:
                self.request_help(
                    TicketType.PARSE_CONTINUED_TABLE,
                    f"Stitch continued table {t.table_id} in Item {self.ITEM_NUM}",
                    priority=TicketPriority.HIGH,
                    source_item=self.ITEM_NUM,
                    source_table_id=t.table_id,
                )

        # Exhibit references → classify_exhibit ticket
        import re
        exhibit_refs = list(set(re.findall(r'[Ee]xhibit\s+([A-Z](?:-\d+)?)', text)))
        for ref in exhibit_refs[:3]:
            self.request_help(
                TicketType.CLASSIFY_EXHIBIT,
                f"Classify Exhibit {ref} referenced by Item {self.ITEM_NUM}",
                priority=TicketPriority.NORMAL,
                source_item=self.ITEM_NUM,
                source_exhibit=ref,
            )

        # Spill warnings from front matter
        spill_warnings = self.context.get("spill_warnings", [])
        for spill in spill_warnings:
            if spill.get("item") == self.ITEM_NUM:
                self.request_help(
                    TicketType.RECOVER_MISSING_PAGE_SPAN,
                    f"Check spill: Item {self.ITEM_NUM} spans {spill.get('pages', '?')} pages",
                    priority=TicketPriority.NORMAL,
                    source_item=self.ITEM_NUM,
                )

    def _detect_and_report_conflicts(self, parsed: Dict, section):
        """Detect contradictions within this item and report to blackboard.

        Checks for: table vs narrative disagreements, duplicate values
        with different amounts, cross-reference mismatches.
        """
        if not self.blackboard:
            return

        # Compare table-sourced values vs narrative-sourced values
        table_facts = {}
        narrative_facts = {}

        for key, entry in parsed.items():
            if key == "item" or not isinstance(entry, dict):
                continue
            if entry.get("state") != "present":
                continue
            prov = entry.get("provenance", {})
            if prov and prov.get("source_table_id"):
                table_facts[key] = entry.get("value")
            else:
                narrative_facts[key] = entry.get("value")

        # Report conflicts where table and narrative disagree
        for key in set(table_facts) & set(narrative_facts):
            tv = str(table_facts[key])
            nv = str(narrative_facts[key])
            if tv and nv and tv != nv:
                self.report_conflict(
                    fact_type=key,
                    source_a=f"item_{self.ITEM_NUM}_table",
                    source_b=f"item_{self.ITEM_NUM}_narrative",
                    value_a=table_facts[key],
                    value_b=narrative_facts[key],
                    source_item=self.ITEM_NUM,
                    detail=f"Table says '{tv[:50]}', narrative says '{nv[:50]}'",
                )

        # Post cross-item facts for other workers to validate
        if self.blackboard:
            for key, entry in parsed.items():
                if key == "item" or not isinstance(entry, dict):
                    continue
                if entry.get("state") == "present" and entry.get("value") is not None:
                    self.blackboard.post_cross_item_fact(
                        self.ITEM_NUM, key, entry["value"], self.worker_id
                    )

    def _infer_object_type(self, value) -> ObjectType:
        """Infer ObjectType from the value shape."""
        if isinstance(value, list):
            if value and isinstance(value[0], dict):
                return ObjectType.TABLE_ROW
            return ObjectType.LIST_ITEM
        if isinstance(value, dict):
            return ObjectType.COMPOSITE
        return ObjectType.SCALAR
