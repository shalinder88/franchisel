"""
Worker 27: Essential Exhibit Extractor

Parses ALL exhibits globally: agreements, addenda, guaranties, lease riders,
ACH/payment forms, software agreements, financial statements,
current/former franchisee lists, manual TOCs, questionnaire/release docs.

Exhibits are NOT appendices. They are first-class sources.
Agreements, addenda, and guaranties are where the real burden lives.
"""

from typing import Any, Dict, List
from .base_worker import BaseWorker
from .fact_packet import SourceZone, ObjectType, Importance
from .source_registry import SourceType


class ExhibitExtractorWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "exhibit_extractor"

    @property
    def worker_num(self) -> int:
        return 27

    def execute(self) -> Dict[str, Any]:
        exhibits = self.context.get("exhibits", {})
        exhibit_data = self.context.get("exhibit_data", {})
        sources_parsed = []

        for code, ex in exhibits.items():
            source_id = f"exhibit_{code}"

            # Register source
            pages = []
            if hasattr(ex, 'start_page') and ex.start_page > 0:
                pages = list(range(ex.start_page, (ex.end_page or ex.start_page) + 1))
            self.source_registry.register(
                source_id, SourceType.EXHIBIT,
                pages=pages, exhibit_code=code,
            )

            if not (hasattr(ex, 'parsed') and ex.parsed):
                if hasattr(ex, 'start_page') and ex.start_page > 0:
                    self.source_registry.mark_failed(source_id, self.worker_id, "not_parsed")
                else:
                    self.source_registry.mark_not_found(source_id)
                continue

            self.mark_source_parsing(source_id)

            # Classify and emit based on role
            role = ex.role.value if hasattr(ex, 'role') else "other"
            fact_ids = self._emit_by_role(code, ex, role, exhibit_data)

            self.mark_source_parsed(source_id, fact_ids)
            sources_parsed.append(source_id)

        return {
            "sources_parsed": sources_parsed,
            "unresolved": [w for w in self.warnings],
            "exhibits_processed": len(sources_parsed),
            "exhibits_skipped": len(exhibits) - len(sources_parsed),
        }

    def _emit_by_role(self, code: str, ex, role: str,
                       exhibit_data: Dict) -> List[str]:
        """Emit facts based on exhibit role."""
        fact_ids = []
        pages = [ex.start_page] if hasattr(ex, 'start_page') and ex.start_page > 0 else []

        if role == "financials":
            # Financial statements exhibit
            fin_data = exhibit_data.get("financials", {})
            if fin_data:
                fid = self.emit(
                    fact_type="financial_statements",
                    fact_payload=fin_data if isinstance(fin_data, dict) else {"raw": str(fin_data)[:500]},
                    source_zone=SourceZone.EXHIBIT,
                    source_exhibit=code,
                    source_pages=pages,
                    object_type=ObjectType.FINANCIAL_LINE,
                    family="performance",
                    importance=Importance.CORE,
                    confidence=0.85,
                )
                fact_ids.append(fid)

        elif role == "franchise_agreement":
            fid = self.emit(
                fact_type="franchise_agreement_exhibit",
                fact_payload={
                    "code": code,
                    "page_count": (ex.end_page - ex.start_page + 1) if hasattr(ex, 'end_page') and ex.end_page else 0,
                    "has_parsed_data": bool(ex.parsed_data) if hasattr(ex, 'parsed_data') else False,
                },
                source_zone=SourceZone.EXHIBIT,
                source_exhibit=code,
                source_pages=pages,
                object_type=ObjectType.AGREEMENT_CLAUSE,
                family="control",
                importance=Importance.CORE,
                confidence=0.8,
            )
            fact_ids.append(fid)

        elif role == "guaranty":
            fid = self.emit(
                fact_type="guaranty_exhibit",
                fact_payload={"code": code, "present": True},
                source_zone=SourceZone.EXHIBIT,
                source_exhibit=code,
                source_pages=pages,
                object_type=ObjectType.AGREEMENT_CLAUSE,
                family="risk",
                importance=Importance.CORE,
                confidence=0.85,
            )
            fact_ids.append(fid)

        elif role in ("state_addenda_fdd", "state_addenda_agreement"):
            fid = self.emit(
                fact_type="state_addendum",
                fact_payload={
                    "code": code,
                    "target": "fdd" if "fdd" in role else "agreement",
                },
                source_zone=SourceZone.ADDENDUM,
                source_exhibit=code,
                source_pages=pages,
                object_type=ObjectType.OVERRIDE,
                family="document",
                importance=Importance.CORE,
                confidence=0.8,
            )
            fact_ids.append(fid)

        elif role in ("franchisee_list", "former_franchisee_list"):
            fid = self.emit(
                fact_type="franchisee_list",
                fact_payload={
                    "code": code,
                    "list_type": "current" if "former" not in role else "former",
                },
                source_zone=SourceZone.EXHIBIT,
                source_exhibit=code,
                source_pages=pages,
                object_type=ObjectType.LIST_ITEM,
                family="performance",
                importance=Importance.SECONDARY,
                confidence=0.8,
            )
            fact_ids.append(fid)

        elif role == "manual_toc":
            fid = self.emit(
                fact_type="operations_manual_toc",
                fact_payload={"code": code},
                source_zone=SourceZone.EXHIBIT,
                source_exhibit=code,
                source_pages=pages,
                family="control",
                importance=Importance.CONTEXT,
                confidence=0.7,
            )
            fact_ids.append(fid)

        elif role == "lease_rider":
            fid = self.emit(
                fact_type="lease_rider_exhibit",
                fact_payload={"code": code},
                source_zone=SourceZone.EXHIBIT,
                source_exhibit=code,
                source_pages=pages,
                object_type=ObjectType.AGREEMENT_CLAUSE,
                family="economics",
                importance=Importance.SECONDARY,
                confidence=0.75,
            )
            fact_ids.append(fid)

        else:
            # Generic exhibit
            fid = self.emit(
                fact_type="exhibit_generic",
                fact_payload={
                    "code": code,
                    "role": role,
                    "parsed": True,
                },
                source_zone=SourceZone.EXHIBIT,
                source_exhibit=code,
                source_pages=pages,
                family="document",
                importance=Importance.CONTEXT,
                confidence=0.7,
            )
            fact_ids.append(fid)

        # ── Exhibit notes/disclaimers as first-class facts ──
        if hasattr(ex, 'text') and ex.text:
            self._emit_exhibit_notes(code, ex, pages)

        # ── Tables within this exhibit ──
        if hasattr(ex, 'tables') and ex.tables:
            for table in ex.tables:
                tid = table.table_id if hasattr(table, 'table_id') else f"extable_{code}"
                fid = self.emit_table(
                    table_data={
                        "table_id": tid,
                        "title": table.title if hasattr(table, 'title') else "",
                        "columns": table.columns if hasattr(table, 'columns') else [],
                        "rows": table.rows[:50] if hasattr(table, 'rows') else [],
                        "row_count": table.row_count if hasattr(table, 'row_count') else 0,
                    },
                    source_exhibit=code,
                    source_pages=[table.source_page] if hasattr(table, 'source_page') else pages,
                    table_id=tid,
                    family="document",
                )
                fact_ids.append(fid)

        return fact_ids

    def _emit_exhibit_notes(self, code: str, ex, pages: List[int]):
        """Emit exhibit disclaimers, definitions, and key clauses as first-class facts.

        Exhibit notes are NOT secondary. Governing clauses, disclaimers,
        definitions, and conditions in exhibits are first-class evidence.
        """
        import re
        text = ex.text if hasattr(ex, 'text') else ""
        if len(text) < 50:
            return

        text_lower = text.lower()

        # ── Key clause patterns ──
        clause_patterns = [
            (r'(?:notwithstanding|provided\s+(?:however|that)|except\s+as)', "exception_clause"),
            (r'(?:shall\s+not|may\s+not|prohibited|restricted)', "restriction_clause"),
            (r'(?:terminated|termination|default|breach)', "termination_clause"),
            (r'(?:indemnif|hold\s+harmless|liability)', "indemnification_clause"),
            (r'(?:non.?compet|covenant\s+not\s+to)', "non_compete_clause"),
            (r'(?:confidential|trade\s+secret|proprietary)', "confidentiality_clause"),
            (r'(?:arbitrat|mediat|governing\s+law|choice\s+of\s+(?:law|forum))', "dispute_clause"),
            (r'(?:transfer|assign|consent|right\s+of\s+first)', "transfer_clause"),
            (r'(?:guarant|jointly\s+and\s+severally|personal\s+liability)', "guaranty_clause"),
        ]

        for pattern, clause_type in clause_patterns:
            matches = list(re.finditer(pattern + r'[^.]{0,300}\.', text_lower))
            for m in matches[:3]:  # Cap at 3 per type
                self.emit(
                    fact_type=f"exhibit_clause_{clause_type}",
                    fact_payload={
                        "exhibit_code": code,
                        "clause_type": clause_type,
                        "text": m.group(0)[:300],
                    },
                    source_zone=SourceZone.EXHIBIT,
                    source_exhibit=code,
                    source_pages=pages,
                    object_type=ObjectType.AGREEMENT_CLAUSE,
                    family="control",
                    importance=Importance.SECONDARY,
                    confidence=0.7,
                    raw_evidence=m.group(0)[:200],
                )
