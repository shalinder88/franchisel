"""
Worker 22: Item 20 — Outlets and Franchisee Information

Sprint 2: Deep outlet parser with table family splitting.

Table families parsed separately:
  - systemwide_summary: Franchised/Company/Total by year
  - franchised_state: state-level franchised detail
  - company_state: state-level company-owned detail
  - transfers: separate from closures/terminations
  - projected_openings: separate from signed-not-opened
  - franchisee_lists: exhibit linkage

Year-aware: detects years, maps latest-year to canonical fields.
Transfers separate from closures. Reacquisitions separate from terminations.
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

        # ── Delegate sub-tasks ──
        from ..ticket_broker import TicketType, TicketPriority
        tables = section.tables if hasattr(section, 'tables') else []
        if tables:
            self.request_help(
                TicketType.EXTRACT_OUTLET_ROWS,
                f"Extract outlet rows across {len(tables)} tables",
                priority=TicketPriority.HIGH, source_item=20,
            )
            self.request_help(
                TicketType.VALIDATE_TOTALS,
                "Validate outlet totals: franchised + company = systemwide",
                priority=TicketPriority.NORMAL, source_item=20,
            )
        self.request_help(
            TicketType.EXTRACT_FRANCHISEE_LIST,
            "Parse current/former franchisee list exhibits",
            priority=TicketPriority.NORMAL, source_item=20,
        )

        # ── DEEP OUTLET PARSER ──
        deep_ids = self._run_deep_outlet_parser(section, text)
        fact_ids.extend(deep_ids)

        return fact_ids

    def _run_deep_outlet_parser(self, section, text: str) -> List[str]:
        """Run the deep outlet parser and emit canonical facts."""
        from ..outlet_deep_parser import parse_outlet_tables_deep

        tables = section.tables if hasattr(section, 'tables') else []
        exhibits = self.context.get("exhibits", {})
        all_items = self.context.get("items", {})

        deep = parse_outlet_tables_deep(tables, text, exhibits, all_items)

        fact_ids = []

        if not deep.get("hasItem20"):
            return fact_ids

        # ── Emit hasItem20 ──
        fid = self.emit(
            fact_type="hasItem20",
            fact_payload={"value": True},
            source_zone=SourceZone.TABLE, source_item=20,
            source_pages=[section.start_page],
            family="performance", importance=Importance.CORE, confidence=0.95,
        )
        fact_ids.append(fid)

        # ── Emit top-level canonical fields ──
        canonical = deep.get("canonical", {})
        for field, value in canonical.items():
            if value is not None:
                fid = self.emit(
                    fact_type=field,
                    fact_payload={"value": value},
                    source_zone=SourceZone.TABLE, source_item=20,
                    source_pages=[section.start_page],
                    family="performance",
                    importance=Importance.CORE if field.startswith("current") else Importance.SECONDARY,
                    confidence=0.9,
                )
                fact_ids.append(fid)

        # ── Emit systemwide summary (structured yearly data) ──
        systemwide = deep.get("systemwide", {})
        for outlet_type in ["franchised", "companyOwned", "total"]:
            type_data = systemwide.get(outlet_type, {})
            for year, entry in type_data.items():
                if not isinstance(year, int):
                    continue
                fid = self.emit(
                    fact_type=f"item20.systemwide.{outlet_type}.{year}",
                    fact_payload={"year": year, "outletType": outlet_type, **entry},
                    source_zone=SourceZone.TABLE, source_item=20,
                    source_pages=[section.start_page],
                    object_type=ObjectType.OUTLET_RECORD,
                    family="performance", importance=Importance.CORE, confidence=0.9,
                )
                fact_ids.append(fid)

        # ── Emit transfers separately ──
        transfers = deep.get("transfers", {})
        if transfers.get("totals"):
            fid = self.emit(
                fact_type="item20.transfers",
                fact_payload=transfers,
                source_zone=SourceZone.TABLE, source_item=20,
                source_pages=[section.start_page],
                object_type=ObjectType.COMPOSITE,
                family="performance", importance=Importance.SECONDARY, confidence=0.85,
            )
            fact_ids.append(fid)

        # ── Emit state-level totals for franchised ──
        fran_state = deep.get("franchisedState", {})
        if fran_state.get("totals"):
            for year, entry in fran_state["totals"].items():
                if isinstance(year, int):
                    fid = self.emit(
                        fact_type=f"item20.franchisedState.total.{year}",
                        fact_payload={"year": year, **entry},
                        source_zone=SourceZone.TABLE, source_item=20,
                        source_pages=[section.start_page],
                        object_type=ObjectType.OUTLET_RECORD,
                        family="performance", importance=Importance.SECONDARY, confidence=0.85,
                    )
                    fact_ids.append(fid)

        # ── Emit state-level totals for company-owned ──
        comp_state = deep.get("companyOwnedState", {})
        if comp_state.get("totals"):
            for year, entry in comp_state["totals"].items():
                if isinstance(year, int):
                    fid = self.emit(
                        fact_type=f"item20.companyOwnedState.total.{year}",
                        fact_payload={"year": year, **entry},
                        source_zone=SourceZone.TABLE, source_item=20,
                        source_pages=[section.start_page],
                        object_type=ObjectType.OUTLET_RECORD,
                        family="performance", importance=Importance.SECONDARY, confidence=0.85,
                    )
                    fact_ids.append(fid)

        # ── Emit projected openings ──
        projected = deep.get("projected", {})
        if projected:
            fid = self.emit(
                fact_type="item20.projected",
                fact_payload=projected,
                source_zone=SourceZone.ITEM, source_item=20,
                source_pages=[section.start_page],
                family="performance", importance=Importance.SECONDARY, confidence=0.75,
            )
            fact_ids.append(fid)

        # ── Emit franchisee list linkage ──
        fl = deep.get("franchiseeLists", {})
        if fl.get("hasFranchiseeListCurrent") or fl.get("hasFranchiseeListFormer"):
            fid = self.emit(
                fact_type="item20.franchiseeLists",
                fact_payload=fl,
                source_zone=SourceZone.ITEM, source_item=20,
                source_pages=[section.start_page],
                family="document", importance=Importance.SECONDARY, confidence=0.8,
            )
            fact_ids.append(fid)

        # ── Full structured object for reconciliation ──
        fid = self.emit(
            fact_type="item20_full_object",
            fact_payload=deep,
            source_zone=SourceZone.TABLE, source_item=20,
            source_pages=[section.start_page],
            object_type=ObjectType.COMPOSITE,
            family="performance", importance=Importance.CORE, confidence=0.85,
        )
        fact_ids.append(fid)

        return fact_ids
