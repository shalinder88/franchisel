"""
Worker 23: Item 21 — Financial Statements

Extracts: financial statements, guaranties, audit opinion type,
balance-sheet highlights, revenue composition, operating cash flow,
related-party dependency.
"""

from typing import Any, Dict, List
from ..item_worker_base import ItemWorkerBase
from ..fact_packet import SourceZone, ObjectType, Importance

import re


class Item21Worker(ItemWorkerBase):
    ITEM_NUM = 21
    ITEM_FAMILY = "performance"
    CRITICAL = True

    def extract_facts(self, section, parsed: Dict) -> List[str]:
        fact_ids = []
        text = section.text if hasattr(section, 'text') else ""
        text_lower = text.lower()

        # ── Deep financial parser ──
        deep_ids = self._run_deep_financial_parser(section, text)
        fact_ids.extend(deep_ids)

        # ── Delegate sub-tasks ──
        from ..ticket_broker import TicketType, TicketPriority
        self.request_help(
            TicketType.EXTRACT_FINANCIAL_SECTION,
            "Parse financial statement exhibit: balance sheet, income, cash flow",
            priority=TicketPriority.HIGH, source_item=21,
        )
        self.request_help(
            TicketType.CHECK_CROSS_ITEM_CONFLICT,
            "Verify Item 21 revenue consistent with Item 8 supplier revenue and Item 19 FPR",
            priority=TicketPriority.NORMAL, source_item=21,
            context={"cross_items": [8, 19]},
        )

        # ── Auditor identification ──
        big_auditors = [
            ("ernst & young", "Ernst & Young"),
            ("deloitte", "Deloitte"),
            ("kpmg", "KPMG"),
            ("pricewaterhouse", "PwC"),
            ("pwc", "PwC"),
            ("bdo", "BDO"),
            ("grant thornton", "Grant Thornton"),
            ("rsm", "RSM"),
            ("moss adams", "Moss Adams"),
            ("baker tilly", "Baker Tilly"),
        ]
        for pattern, name in big_auditors:
            if pattern in text_lower:
                fid = self.emit(
                    fact_type="auditor",
                    fact_payload={"name": name},
                    source_zone=SourceZone.ITEM,
                    source_item=21,
                    source_pages=[section.start_page],
                    family="identity",
                    importance=Importance.CORE,
                    confidence=0.9,
                )
                fact_ids.append(fid)
                break

        # ── Audit opinion type ──
        opinion_patterns = [
            (r'(?:unqualified|clean)\s+(?:audit\s+)?opinion', "unqualified"),
            (r'(?:qualified)\s+(?:audit\s+)?opinion', "qualified"),
            (r'(?:adverse)\s+(?:audit\s+)?opinion', "adverse"),
            (r'(?:going\s+concern)', "going_concern"),
            (r'(?:disclaimer\s+of\s+opinion)', "disclaimer"),
        ]
        for pattern, opinion_type in opinion_patterns:
            if re.search(pattern, text_lower):
                fid = self.emit(
                    fact_type="audit_opinion",
                    fact_payload={"type": opinion_type},
                    source_zone=SourceZone.ITEM,
                    source_item=21,
                    source_pages=[section.start_page],
                    family="risk",
                    importance=Importance.CORE,
                    confidence=0.85,
                )
                fact_ids.append(fid)
                break

        # ── Revenue figures from financial statements ──
        rev_match = re.search(
            r'(?:total\s+)?revenue[s]?\s+(?:was|were|of)\s+(?:approximately\s+)?\$\s*([\d,.]+)\s*(million|billion)?',
            text_lower
        )
        if rev_match:
            amount = float(rev_match.group(1).replace(",", ""))
            multiplier = rev_match.group(2)
            if multiplier == "million":
                amount *= 1_000_000
            elif multiplier == "billion":
                amount *= 1_000_000_000
            fid = self.emit(
                fact_type="franchisor_revenue",
                fact_payload={"amount": amount},
                source_zone=SourceZone.ITEM,
                source_item=21,
                source_pages=[section.start_page],
                object_type=ObjectType.FINANCIAL_LINE,
                family="performance",
                importance=Importance.CORE,
                confidence=0.8,
                raw_evidence=rev_match.group(0)[:200],
            )
            fact_ids.append(fid)

        # ── Related-party transactions ──
        if re.search(r'(?:related.?party|affiliate)\s+(?:transaction|revenue|income)', text_lower):
            m = re.search(r'(?:related.?party|affiliate)[^.]{0,200}', text_lower)
            fid = self.emit(
                fact_type="related_party_dependency",
                fact_payload={"present": True, "detail": m.group(0)[:200] if m else ""},
                source_zone=SourceZone.ITEM,
                source_item=21,
                source_pages=[section.start_page],
                family="risk",
                importance=Importance.SECONDARY,
                confidence=0.75,
                raw_evidence=m.group(0)[:200] if m else "",
            )
            fact_ids.append(fid)

        # ── Financial exhibit reference ──
        for m in re.finditer(r'(?:financial\s+statement|audit\w*\s+report)[^.]{0,100}(?:exhibit|attached)', text_lower):
            fid = self.emit(
                fact_type="financial_exhibit_reference",
                fact_payload={"detail": m.group(0)[:200]},
                source_zone=SourceZone.ITEM,
                source_item=21,
                source_pages=[section.start_page],
                family="document",
                importance=Importance.SECONDARY,
                confidence=0.7,
            )
            fact_ids.append(fid)
            break

        return fact_ids

    def _run_deep_financial_parser(self, section, text: str) -> List[str]:
        """Run the deep financial parser and emit canonical facts."""
        from ..financial_deep_parser import parse_financials_deep

        tables = section.tables if hasattr(section, 'tables') else []
        exhibit_data = self.context.get("exhibit_data", {})
        engines = self.context.get("engines", {})

        deep = parse_financials_deep(text, tables, exhibit_data, engines)
        fact_ids = []

        # Emit every non-None canonical field
        for field in ["hasItem21", "hasAuditedFinancials", "auditOpinionType",
                       "auditorName", "cash", "totalAssets", "totalLiabilities",
                       "equity", "revenue", "netIncome", "operatingCashFlow",
                       "hasParentGuarantee", "hasFinancialConditionWarning",
                       "hasRelatedPartyDependency", "hasGoingConcern",
                       "financialStrengthSignal"]:
            val = deep.get(field)
            if val is not None:
                fid = self.emit(
                    fact_type=field,
                    fact_payload={"value": val},
                    source_zone=SourceZone.ITEM, source_item=21,
                    source_pages=[section.start_page],
                    family="financials",
                    importance=Importance.CORE if field in (
                        "hasItem21", "hasAuditedFinancials", "auditOpinionType",
                        "revenue", "totalAssets", "netIncome"
                    ) else Importance.SECONDARY,
                    confidence=0.85,
                )
                fact_ids.append(fid)

        # Full structured object
        fid = self.emit(
            fact_type="item21_full_object",
            fact_payload=deep,
            source_zone=SourceZone.ITEM, source_item=21,
            source_pages=[section.start_page],
            object_type=ObjectType.COMPOSITE,
            family="financials", importance=Importance.CORE, confidence=0.85,
        )
        fact_ids.append(fid)

        return fact_ids
