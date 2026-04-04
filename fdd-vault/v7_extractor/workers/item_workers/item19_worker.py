"""
Worker 21: Item 19 — Financial Performance Representations

Extracts: all FPR tables, notes, exclusions, unit counts, cohort logic,
averages/medians/highs/lows, disclaimer text, metric definitions.

Gold rule: Item 19 is almost a separate job. Treat it as one.
Do not just take headline numbers. Pull every table row and all table notes.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item19Worker(ItemWorkerBase):
    ITEM_NUM = 19
    ITEM_FAMILY = "performance"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Create tickets for assist work (heavy worker delegation) ──
        self._create_help_tickets(section, parsed)

        # ── DEEP FPR PARSER — full cohort/tier extraction ──
        deep_ids = self._run_deep_fpr_parser(section, text)
        fact_ids.extend(deep_ids)

        # ── FPR format classification ──
        fpr_format = "unknown"
        if parsed.get("has_fpr", {}).get("value") is False:
            fpr_format = "no_fpr"
        elif parsed.get("has_ebitda", {}).get("value"):
            fpr_format = "full_income_statement"
        elif parsed.get("has_pro_forma", {}).get("value"):
            fpr_format = "pro_forma"
        elif parsed.get("cost_structure_disclosed", {}).get("value"):
            fpr_format = "revenue_plus_costs"
        elif parsed.get("fpr_tables", {}).get("value"):
            fpr_format = "revenue_only"
        elif parsed.get("average_revenue", {}).get("value"):
            fpr_format = "narrative_average"

        fid = self.emit(
            fact_type="fpr_format",
            fact_payload={"format": fpr_format},
            source_zone=SourceZone.ITEM,
            source_item=19,
            source_pages=[section.start_page],
            family="performance",
            importance=Importance.CORE,
            confidence=0.85,
        )
        fact_ids.append(fid)

        # ── Reporting period ──
        period_match = re.search(
            r'(?:(?:fiscal|calendar)\s+year\s+(?:end(?:ed|ing)\s+)?)?'
            r'(?:(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+)?'
            r'(20\d{2})',
            text_lower
        )
        if period_match:
            fid = self.emit(
                fact_type="fpr_reporting_period",
                fact_payload={"year": period_match.group(1), "context": period_match.group(0)[:100]},
                source_zone=SourceZone.ITEM,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.8,
                raw_evidence=period_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── FPR basis / population ──
        basis_match = re.search(
            r'(?:open|operat)\w*\s+(?:for\s+)?(?:at\s+least\s+)?(?:a\s+full\s+)?(\d+)\s+month',
            text_lower
        )
        if basis_match:
            fid = self.emit(
                fact_type="fpr_basis",
                fact_payload={"months": int(basis_match.group(1))},
                source_zone=SourceZone.ITEM,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.8,
                raw_evidence=basis_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Company-owned units inclusion/exclusion ──
        if re.search(r'(?:company.?owned|mcopco|franchisor.?owned).*?(?:included|are\s+included)', text_lower):
            fid = self.emit(
                fact_type="fpr_includes_company_units",
                fact_payload={"included": True},
                source_zone=SourceZone.ITEM,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)
        elif re.search(r'(?:does\s+not\s+include|exclud).*?(?:company|mcopco|franchisor)', text_lower):
            fid = self.emit(
                fact_type="fpr_includes_company_units",
                fact_payload={"included": False},
                source_zone=SourceZone.ITEM,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)

        # ── Attainment data (X% achieved/exceeded $Y) ──
        buckets = parsed.get("threshold_buckets", {}).get("value", [])
        for bucket in buckets:
            fid = self.emit(
                fact_type="fpr_attainment_bucket",
                fact_payload=bucket,
                source_zone=SourceZone.TABLE,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        # ── All FPR table notes (critical evidence) ──
        for table in (section.tables if hasattr(section, 'tables') else []):
            for note in (table.table_notes if hasattr(table, 'table_notes') else []):
                note_text = note.text if hasattr(note, 'text') else str(note)
                if len(note_text) > 20:
                    fid = self.emit(
                        fact_type="fpr_table_note",
                        fact_payload={
                            "note_num": note.note_num if hasattr(note, 'note_num') else 0,
                            "text": note_text[:400],
                            "table_id": table.table_id,
                        },
                        source_zone=SourceZone.TABLE,
                        source_item=19,
                        source_pages=[table.source_page],
                        source_table_id=table.table_id,
                        family="performance",
                        importance=Importance.CORE,
                        confidence=0.8,
                        raw_evidence=note_text[:200],
                    )
                    fact_ids.append(fid)

        return fact_ids

    def _create_help_tickets(self, section, parsed: Dict):
        """Create tickets for sub-tasks that idle workers can pick up."""
        from ..ticket_broker import TicketType, TicketPriority

        tables = section.tables if hasattr(section, 'tables') else []

        # Ticket: validate table row totals and continuity
        if len(tables) > 1:
            self.request_help(
                TicketType.VALIDATE_TOTALS,
                "Validate FPR table row totals and cross-table continuity",
                priority=TicketPriority.HIGH,
                source_item=19,
                source_pages=[section.start_page],
                context={"table_count": len(tables)},
            )

        # Ticket: read and classify all table notes
        notes_count = sum(len(t.table_notes) if hasattr(t, 'table_notes') else 0
                          for t in tables)
        if notes_count > 3:
            self.request_help(
                TicketType.READ_TABLE_NOTES,
                f"Deep-read {notes_count} FPR table notes for exclusion/basis definitions",
                priority=TicketPriority.HIGH,
                source_item=19,
                context={"notes_count": notes_count},
            )

        # Ticket: check for cross-item conflicts (FPR vs Item 6 fees)
        self.request_help(
            TicketType.CHECK_CROSS_ITEM_CONFLICT,
            "Verify FPR revenue figures consistent with Item 6 fee structure",
            priority=TicketPriority.NORMAL,
            source_item=19,
            context={"cross_items": [6, 20]},
        )

    def _run_deep_fpr_parser(self, section, text: str) -> List[str]:
        """Run the deep FPR parser and emit canonical facts."""
        from ..item19_deep_parser import parse_fpr_tables_deep

        tables = section.tables if hasattr(section, 'tables') else []
        deep = parse_fpr_tables_deep(tables, text)

        fact_ids = []

        if not deep.get("hasItem19"):
            return fact_ids

        # Emit richData
        if deep.get("richData"):
            fid = self.emit(
                fact_type="richData",
                fact_payload={"value": True},
                source_zone=SourceZone.TABLE,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.CORE,
                confidence=0.9,
            )
            fact_ids.append(fid)

        # Emit each parsed FPR table as a structured object
        for tbl in deep.get("tables", []):
            table_id = tbl.get("table_id", "")
            cohort = tbl.get("cohort_type", "all")

            # Overall stats — emit as individual canonical facts
            for metric in ["overallAvg", "overallMedian", "overallHigh", "overallLow"]:
                val = tbl.get(metric)
                if val is not None:
                    fid = self.emit(
                        fact_type=metric,
                        fact_payload={"value": val, "table": table_id, "cohort": cohort},
                        source_zone=SourceZone.TABLE,
                        source_item=19,
                        source_pages=[section.start_page],
                        family="performance",
                        importance=Importance.CORE,
                        confidence=0.85,
                    )
                    fact_ids.append(fid)

            # Restaurant count
            if tbl.get("restaurants"):
                fid = self.emit(
                    fact_type="restaurants",
                    fact_payload={"value": tbl["restaurants"], "table": table_id, "cohort": cohort},
                    source_zone=SourceZone.TABLE,
                    source_item=19,
                    source_pages=[section.start_page],
                    family="performance",
                    importance=Importance.CORE,
                    confidence=0.85,
                )
                fact_ids.append(fid)

            # Attainment percentages
            for metric in ["metOrExceededAvgPct", "metOrExceededMedianPct"]:
                val = tbl.get(metric)
                if val is not None:
                    fid = self.emit(
                        fact_type=metric,
                        fact_payload={"value": val, "table": table_id, "cohort": cohort},
                        source_zone=SourceZone.TABLE,
                        source_item=19,
                        source_pages=[section.start_page],
                        family="performance",
                        importance=Importance.CORE,
                        confidence=0.85,
                    )
                    fact_ids.append(fid)

            # Exclusions
            if tbl.get("excludes"):
                fid = self.emit(
                    fact_type="excludes",
                    fact_payload={"value": tbl["excludes"], "table": table_id, "cohort": cohort},
                    source_zone=SourceZone.TABLE,
                    source_item=19,
                    source_pages=[section.start_page],
                    family="performance",
                    importance=Importance.SECONDARY,
                    confidence=0.75,
                )
                fact_ids.append(fid)

            # Tiers
            for tier_idx, tier in enumerate(tbl.get("tiers", [])):
                fid = self.emit(
                    fact_type=f"fpr_tier",
                    fact_payload={
                        "table": table_id,
                        "cohort": cohort,
                        "tier_index": tier_idx,
                        **tier,
                    },
                    source_zone=SourceZone.TABLE,
                    source_item=19,
                    source_pages=[section.start_page],
                    object_type=ObjectType.TABLE_ROW,
                    family="performance",
                    importance=Importance.CORE,
                    confidence=0.8,
                )
                fact_ids.append(fid)

            # Full table object for reconciliation
            fid = self.emit(
                fact_type="fpr_table_object",
                fact_payload=tbl,
                source_zone=SourceZone.TABLE,
                source_item=19,
                source_pages=[section.start_page],
                object_type=ObjectType.COMPOSITE,
                family="performance",
                importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        # Metric definition
        if deep.get("metric_definition"):
            fid = self.emit(
                fact_type="fpr_metric_definition",
                fact_payload={"value": deep["metric_definition"]},
                source_zone=SourceZone.TABLE,
                source_item=19,
                source_pages=[section.start_page],
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)

        return fact_ids
