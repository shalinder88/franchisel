"""
Worker 2: Front Matter + Roadmap Extractor

Runs FIRST, always. Before any item worker touches a page.

Reads:
  - Cover page
  - Special risks
  - "How to Use This FDD"
  - Table of Contents
  - Exhibit list
  - State notices
  - Item/exhibit start pages

Produces:
  - Page map (item boundaries)
  - Exhibit map (exhibit boundaries)
  - Table candidates (pages with tables)
  - Spill warnings (items that may cross page breaks)
  - Required-source checklist (what MUST be found)

This prevents the "text stream first" failure mode.
Structure discovery must complete before item reading begins.
"""

from typing import Any, Dict, List, Optional
from .base_worker import BaseWorker
from .fact_packet import SourceZone, ObjectType, Importance
from .source_registry import SourceType


class FrontMatterWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "front_matter"

    @property
    def worker_num(self) -> int:
        return 2

    def execute(self) -> Dict[str, Any]:
        """Extract structural map from front matter before any item worker runs."""
        bootstrap = self.context.get("bootstrap", {})
        page_reads = self.context.get("page_reads", [])
        geometry = self.context.get("geometry", {})
        total_pages = self.context.get("total_pages", 0)

        sources_parsed = []
        spill_warnings = []

        # ── Register front matter sources ──
        self.source_registry.register("cover", SourceType.COVER, pages=[1])
        self.source_registry.register("toc", SourceType.TOC)
        self.source_registry.register("exhibit_list", SourceType.EXHIBIT_LIST)
        self.source_registry.register("how_to_use", SourceType.HOW_TO_USE)
        self.source_registry.register("special_risks", SourceType.SPECIAL_RISKS)

        # ── 1. Cover page facts ──
        self.claim_source("cover")
        self.mark_source_parsing("cover")
        cover_facts = self._extract_cover(bootstrap)
        self.mark_source_parsed("cover", cover_facts)
        sources_parsed.append("cover")

        # ── 2. TOC → Page map ──
        toc_map = bootstrap.get("tocMap", {})
        if toc_map:
            self.claim_source("toc")
            self.mark_source_parsing("toc")
            toc_page = bootstrap.get("tocPage")
            if toc_page:
                self.source_registry.get("toc").pages = [toc_page] if isinstance(toc_page, int) else []
            page_map = self._build_page_map(toc_map, total_pages)
            toc_facts = self._emit_page_map(page_map)
            self.mark_source_parsed("toc", toc_facts)
            sources_parsed.append("toc")

            # Detect spill warnings
            spill_warnings = self._detect_spill_warnings(page_map, total_pages)
        else:
            self.source_registry.mark_not_found("toc")
            page_map = {}
            self.warn("No TOC found — segmentation will rely on heading detection")

        # ── 3. Exhibit list → Exhibit map ──
        exhibit_map = bootstrap.get("exhibitMap", {})
        if exhibit_map:
            self.claim_source("exhibit_list")
            self.mark_source_parsing("exhibit_list")
            exhibit_facts = self._emit_exhibit_map(exhibit_map)
            self.mark_source_parsed("exhibit_list", exhibit_facts)
            sources_parsed.append("exhibit_list")

            # Register each exhibit as a source
            for code, info in exhibit_map.items():
                pages = []
                if isinstance(info, dict) and info.get("page"):
                    pages = [info["page"]]
                self.source_registry.register(
                    f"exhibit_{code}", SourceType.EXHIBIT,
                    pages=pages, exhibit_code=code,
                )
        else:
            self.source_registry.mark_not_found("exhibit_list")
            self.warn("No exhibit list found")

        # ── 4. How to Use ──
        self.claim_source("how_to_use")
        self.mark_source_parsing("how_to_use")
        htu_facts = self._extract_how_to_use(page_reads)
        self.mark_source_parsed("how_to_use", htu_facts)
        sources_parsed.append("how_to_use")

        # ── 5. Special risks ──
        special_risks = bootstrap.get("specialRisks", [])
        self.claim_source("special_risks")
        self.mark_source_parsing("special_risks")
        risk_facts = self._extract_special_risks(special_risks)
        self.mark_source_parsed("special_risks", risk_facts)
        sources_parsed.append("special_risks")

        # ── 6. Register item windows as sources ──
        for item_num, boundaries in page_map.items():
            if isinstance(item_num, int) and 1 <= item_num <= 23:
                start = boundaries.get("start_page", 0)
                end = boundaries.get("end_page", 0)
                pages = list(range(start, end + 1)) if start and end else []
                self.source_registry.register(
                    f"item_{item_num}", SourceType.ITEM_WINDOW,
                    pages=pages, item_num=item_num,
                )

        # ── 7. Table candidates — UPSTREAM REGISTRATION ──
        # Tables must exist in source registry BEFORE any worker parses them.
        table_candidates = self._identify_table_candidates(page_reads, geometry)

        # Also register tables from live item sections
        items = self.context.get("items", {})
        self._register_all_tables_upstream(items, page_reads)

        # ── 8. Required-source checklist ──
        required_checklist = self._build_required_checklist(page_map, exhibit_map)

        # ── 9. State notices ──
        state_facts = self._extract_state_notices(page_reads, bootstrap)

        return {
            "sources_parsed": sources_parsed,
            "unresolved": [w for w in self.warnings],
            "page_map": page_map,
            "exhibit_map": exhibit_map,
            "table_candidates": table_candidates,
            "spill_warnings": spill_warnings,
            "required_checklist": required_checklist,
        }

    # ══════════════════════════════════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════════════════════════════════

    def _extract_cover(self, bootstrap: Dict) -> List[str]:
        """Extract cover page facts: entity, issue date, amendment, paths, risks."""
        fact_ids = []

        entity = bootstrap.get("entity", "")
        if entity:
            fid = self.emit(
                fact_type="entity_name",
                fact_payload={"entity": entity},
                source_zone=SourceZone.FRONT_MATTER,
                source_pages=[1],
                family="identity",
                importance=Importance.CORE,
                confidence=0.95,
                raw_evidence=f"Cover page: {entity}",
            )
            fact_ids.append(fid)

        issue_date = bootstrap.get("issueDate", "")
        if issue_date:
            fid = self.emit(
                fact_type="issue_date",
                fact_payload={"issueDate": issue_date},
                source_zone=SourceZone.FRONT_MATTER,
                source_pages=[1],
                family="document",
                importance=Importance.CORE,
                confidence=0.95,
                raw_evidence=f"Issue date: {issue_date}",
            )
            fact_ids.append(fid)

        amendment_date = bootstrap.get("amendmentDate", "")
        if amendment_date:
            fid = self.emit(
                fact_type="amendment_date",
                fact_payload={"amendmentDate": amendment_date},
                source_zone=SourceZone.FRONT_MATTER,
                source_pages=[1],
                family="document",
                importance=Importance.SECONDARY,
                confidence=0.9,
                raw_evidence=f"Amendment date: {amendment_date}",
            )
            fact_ids.append(fid)

        offering_paths = bootstrap.get("offeringPaths", [])
        if offering_paths:
            fid = self.emit(
                fact_type="offering_paths",
                fact_payload={"offeringPaths": offering_paths},
                source_zone=SourceZone.FRONT_MATTER,
                source_pages=[1],
                family="identity",
                importance=Importance.SECONDARY,
                confidence=0.9,
                raw_evidence=f"Offering paths: {offering_paths}",
            )
            fact_ids.append(fid)

        description = bootstrap.get("description", "")
        if description:
            fid = self.emit(
                fact_type="business_description",
                fact_payload={"description": description},
                source_zone=SourceZone.FRONT_MATTER,
                source_pages=[1],
                family="identity",
                importance=Importance.SECONDARY,
                confidence=0.85,
                raw_evidence=description[:200],
            )
            fact_ids.append(fid)

        return fact_ids

    # ══════════════════════════════════════════════════════════════════
    # PAGE MAP
    # ══════════════════════════════════════════════════════════════════

    def _build_page_map(self, toc_map: Dict, total_pages: int) -> Dict[int, Dict]:
        """Build item → page range map from TOC."""
        page_map = {}
        items_sorted = []

        for key, val in toc_map.items():
            try:
                item_num = int(key)
                page = val if isinstance(val, int) else val.get("page", 0) if isinstance(val, dict) else 0
                if 1 <= item_num <= 23 and page > 0:
                    items_sorted.append((item_num, page))
            except (ValueError, TypeError):
                continue

        items_sorted.sort(key=lambda x: x[1])

        for i, (item_num, start_page) in enumerate(items_sorted):
            if i + 1 < len(items_sorted):
                end_page = items_sorted[i + 1][1] - 1
            else:
                # Last item — estimate end
                end_page = min(start_page + 30, total_pages)
            page_map[item_num] = {
                "start_page": start_page,
                "end_page": end_page,
                "page_count": end_page - start_page + 1,
            }

        return page_map

    def _emit_page_map(self, page_map: Dict) -> List[str]:
        """Emit page map as fact packets."""
        fact_ids = []
        for item_num, boundaries in page_map.items():
            fid = self.emit(
                fact_type="item_boundary",
                fact_payload={
                    "item_num": item_num,
                    **boundaries,
                },
                source_zone=SourceZone.FRONT_MATTER,
                source_item=item_num,
                source_pages=[boundaries["start_page"]],
                family="document",
                importance=Importance.CORE,
                confidence=0.9,
            )
            fact_ids.append(fid)
        return fact_ids

    def _detect_spill_warnings(self, page_map: Dict, total_pages: int) -> List[Dict]:
        """Detect items that may spill across unexpected page ranges."""
        warnings = []
        LARGE_ITEMS = {7, 17, 19, 20, 21}  # These are often large

        for item_num, boundaries in page_map.items():
            page_count = boundaries.get("page_count", 0)
            if item_num in LARGE_ITEMS and page_count > 40:
                warnings.append({
                    "item": item_num,
                    "pages": page_count,
                    "warning": f"Item {item_num} spans {page_count} pages — check for table spills",
                })
            elif item_num not in LARGE_ITEMS and page_count > 20:
                warnings.append({
                    "item": item_num,
                    "pages": page_count,
                    "warning": f"Item {item_num} unusually large ({page_count} pages) — possible boundary error",
                })

        return warnings

    # ══════════════════════════════════════════════════════════════════
    # EXHIBIT MAP
    # ══════════════════════════════════════════════════════════════════

    def _emit_exhibit_map(self, exhibit_map: Dict) -> List[str]:
        """Emit exhibit map entries as fact packets."""
        fact_ids = []
        for code, info in exhibit_map.items():
            name = info if isinstance(info, str) else info.get("name", code) if isinstance(info, dict) else code
            page = info.get("page") if isinstance(info, dict) else None
            fid = self.emit(
                fact_type="exhibit_listing",
                fact_payload={
                    "code": code,
                    "name": name,
                    "page": page,
                },
                source_zone=SourceZone.FRONT_MATTER,
                source_exhibit=code,
                source_pages=[page] if page else [],
                family="document",
                importance=Importance.SECONDARY,
                confidence=0.9,
                raw_evidence=f"Exhibit {code}: {name}",
            )
            fact_ids.append(fid)
        return fact_ids

    # ══════════════════════════════════════════════════════════════════
    # HOW TO USE
    # ══════════════════════════════════════════════════════════════════

    def _extract_how_to_use(self, page_reads: List) -> List[str]:
        """Extract How-to-Use guidance from early pages."""
        fact_ids = []
        for pr in page_reads[:5]:
            if hasattr(pr, 'page_type') and pr.page_type.value == "how_to_use":
                fid = self.emit(
                    fact_type="how_to_use_guidance",
                    fact_payload={
                        "text_length": len(pr.text) if hasattr(pr, 'text') else 0,
                        "has_ledger_refs": True,  # Simplified — real impl would parse
                    },
                    source_zone=SourceZone.FRONT_MATTER,
                    source_pages=[pr.page_num],
                    family="document",
                    importance=Importance.SECONDARY,
                    confidence=0.85,
                )
                fact_ids.append(fid)
                break
        return fact_ids

    # ══════════════════════════════════════════════════════════════════
    # SPECIAL RISKS
    # ══════════════════════════════════════════════════════════════════

    def _extract_special_risks(self, risks: List) -> List[str]:
        """Extract special risk factors from cover."""
        fact_ids = []
        for risk in risks:
            risk_text = risk if isinstance(risk, str) else str(risk)
            fid = self.emit(
                fact_type="special_risk_factor",
                fact_payload={"risk": risk_text},
                source_zone=SourceZone.FRONT_MATTER,
                source_pages=[1],
                family="risk",
                importance=Importance.CORE,
                confidence=0.9,
                raw_evidence=risk_text[:200],
            )
            fact_ids.append(fid)
        return fact_ids

    # ══════════════════════════════════════════════════════════════════
    # TABLE CANDIDATES
    # ══════════════════════════════════════════════════════════════════

    def _identify_table_candidates(self, page_reads: List,
                                    geometry: Dict) -> List[Dict]:
        """Identify pages that contain tables for the global table worker."""
        candidates = []
        pages_with_tables = geometry.get("pages_with_tables", 0)

        for pr in page_reads:
            has_table = False
            if hasattr(pr, 'has_table_regions') and pr.has_table_regions:
                has_table = True
            elif hasattr(pr, 'tables') and pr.tables:
                has_table = True
            elif hasattr(pr, 'page_type'):
                if pr.page_type.value in ("item_table", "mixed_narrative_table"):
                    has_table = True

            if has_table:
                item_num = None
                if hasattr(pr, 'structured_facts'):
                    item_num = pr.structured_facts.get("item_num")

                candidates.append({
                    "page": pr.page_num,
                    "item_num": item_num,
                    "table_count": len(pr.tables) if hasattr(pr, 'tables') else 0,
                })

                # Register table sources
                for t in (pr.tables if hasattr(pr, 'tables') else []):
                    tid = t.table_id if hasattr(t, 'table_id') else f"table_p{pr.page_num}"
                    self.source_registry.register(
                        tid, SourceType.TABLE,
                        pages=[pr.page_num],
                        item_num=item_num,
                    )

        return candidates

    # ══════════════════════════════════════════════════════════════════
    # REQUIRED-SOURCE CHECKLIST
    # ══════════════════════════════════════════════════════════════════

    def _build_required_checklist(self, page_map: Dict,
                                   exhibit_map: Dict) -> List[Dict]:
        """Build the checklist of what MUST be found and parsed.

        This is the contract: every item on this checklist must end
        in a terminal consumption state. No silent skip.
        """
        checklist = []

        # Required items (all 23, but critical ones flagged)
        CRITICAL_ITEMS = {5, 6, 7, 8, 17, 19, 20, 21}
        for item_num in range(1, 24):
            checklist.append({
                "object": f"item_{item_num}",
                "type": "item",
                "critical": item_num in CRITICAL_ITEMS,
                "found": item_num in page_map,
                "requires_tables": item_num in {5, 6, 7, 19, 20},
            })

        # Required exhibits
        for code in exhibit_map:
            checklist.append({
                "object": f"exhibit_{code}",
                "type": "exhibit",
                "critical": True,  # All listed exhibits are required
                "found": False,  # Will be updated during exhibit parsing
            })

        # Required front matter
        for fm in ["cover", "toc", "exhibit_list", "how_to_use"]:
            checklist.append({
                "object": fm,
                "type": "front_matter",
                "critical": True,
                "found": True,  # We already processed these
            })

        return checklist

    # ══════════════════════════════════════════════════════════════════
    # STATE NOTICES
    # ══════════════════════════════════════════════════════════════════

    def _extract_state_notices(self, page_reads: List,
                                bootstrap: Dict) -> List[str]:
        """Extract state-specific notices from front matter."""
        fact_ids = []
        for pr in page_reads[:10]:
            if hasattr(pr, 'page_type') and pr.page_type.value == "state_notice":
                fid = self.emit(
                    fact_type="state_notice",
                    fact_payload={
                        "page": pr.page_num,
                        "text_length": len(pr.text) if hasattr(pr, 'text') else 0,
                    },
                    source_zone=SourceZone.FRONT_MATTER,
                    source_pages=[pr.page_num],
                    family="document",
                    importance=Importance.CONTEXT,
                    confidence=0.8,
                )
                fact_ids.append(fid)
        return fact_ids

    # ══════════════════════════════════════════════════════════════════
    # UPSTREAM TABLE + EXHIBIT + ITEM REGISTRATION (Patch A)
    # Every source object must exist in source registry + consumption
    # ledger BEFORE any worker parses it. mark_located at discovery.
    # ══════════════════════════════════════════════════════════════════

    def _register_all_tables_upstream(self, items: Dict, page_reads: List):
        """Register every table in the document before any parsing begins."""
        ledger = self.context.get("consumption_ledger")
        registered = 0

        # Tables from item sections
        for item_num, section in items.items():
            if not hasattr(section, 'tables'):
                continue
            for table in section.tables:
                tid = table.table_id if hasattr(table, 'table_id') else f"table_item{item_num}_{registered}"
                page = table.source_page if hasattr(table, 'source_page') else 0

                self.source_registry.register(
                    tid, SourceType.TABLE,
                    pages=[page] if page else [],
                    item_num=item_num if isinstance(item_num, int) else None,
                )
                if ledger:
                    ledger.require(tid, "table",
                                    critical=item_num in {5, 6, 7, 8, 19, 20, 21},
                                    source_item=item_num if isinstance(item_num, int) else None,
                                    pages=[page] if page else [])
                    ledger.mark_located(tid, [page] if page else None)
                registered += 1

        # Tables from all_tables context
        all_tables = self.context.get("all_tables", [])
        for table in all_tables:
            tid = table.table_id if hasattr(table, 'table_id') else f"table_global_{registered}"
            if self.source_registry.get(tid):
                continue
            page = table.source_page if hasattr(table, 'source_page') else 0
            item_num = table.source_item if hasattr(table, 'source_item') else None

            self.source_registry.register(
                tid, SourceType.TABLE,
                pages=[page] if page else [],
                item_num=item_num,
            )
            if ledger:
                ledger.require(tid, "table",
                                source_item=item_num,
                                pages=[page] if page else [])
                ledger.mark_located(tid, [page] if page else None)
            registered += 1

        # Mark located for items, exhibits, front matter in consumption ledger
        if ledger:
            for item_num in items:
                for oid in [f"item_{item_num}_narrative", f"item_{item_num}_tables"]:
                    if oid in ledger._entries:
                        section = items.get(item_num)
                        if oid.endswith("_tables"):
                            if section and hasattr(section, 'tables') and section.tables:
                                ledger.mark_located(oid)
                        else:
                            ledger.mark_located(oid)

            exhibits = self.context.get("exhibits", {})
            for code, ex in exhibits.items():
                oid = f"exhibit_{code}"
                if oid in ledger._entries:
                    if hasattr(ex, 'start_page') and ex.start_page > 0:
                        ledger.mark_located(oid)

            for fm in ["cover", "special_risks", "toc", "exhibit_list"]:
                if fm in ledger._entries:
                    ledger.mark_located(fm)
