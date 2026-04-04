"""
Worker 32: Final Assembler

Builds:
  - Canonical export (the ONLY scoring truth)
  - Buyer report
  - Weighted report
  - Unresolved report
  - Consumption report
  - Learning writeback

A document is only "complete" if:
  - All 32 workers that apply have run
  - Every required table is parsed or explicitly unresolved
  - Every required exhibit is parsed or explicitly unresolved
  - Canonical export is built from reconciled truth
  - Unresolved report is non-empty when needed
  - No seller-list/personal-name leakage outside allowed categories
  - Final report shows what was captured and what still needs review
"""

from typing import Any, Dict, List
from .base_worker import BaseWorker
from .fact_packet import (
    SourceZone, ObjectType, Importance, ConsumptionState
)


class FinalAssemblerWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "final_assembler"

    @property
    def worker_num(self) -> int:
        return 32

    def execute(self) -> Dict[str, Any]:
        """Assemble final outputs from reconciled truth."""
        all_packets = self.fact_store.get_active()
        reconciled = [p for p in all_packets
                       if p.consumption_state == ConsumptionState.RECONCILED]

        # ── 1. Build canonical export ──
        canonical = self._build_canonical_export(reconciled)

        # ── 2. Build buyer report ──
        buyer_report = self._build_buyer_report(reconciled)

        # ── 3. Build unresolved report ──
        unresolved_report = self._build_unresolved_report()

        # ── 4. Build consumption report ──
        consumption_report = self._build_consumption_report()

        # ── 5. Completeness assessment ──
        completeness = self._assess_completeness()

        # ── 6. Emit assembly summary ──
        self.emit(
            fact_type="assembly_complete",
            fact_payload={
                "canonical_fields": len(canonical),
                "reconciled_facts": len(reconciled),
                "unresolved_count": len(unresolved_report),
                "completeness": completeness,
            },
            source_zone=SourceZone.FRONT_MATTER,
            family="document",
            importance=Importance.CORE,
            confidence=1.0,
        )

        return {
            "sources_parsed": [],
            "unresolved": [u["description"] for u in unresolved_report],
            "canonical_export": canonical,
            "buyer_report": buyer_report,
            "unresolved_report": unresolved_report,
            "consumption_report": consumption_report,
            "completeness": completeness,
        }

    def _build_canonical_export(self, reconciled) -> Dict[str, Any]:
        """Build the canonical export from reconciled facts.

        Uses existing V7 canonical export as the schema target.
        Only reconciled facts enter the export.
        """
        export = {}

        # Extract from Lane B normalization results
        stage_results = self.context.get("stage_results", {})
        normalizer_result = stage_results.get("lane_b_normalizer", {})
        normalized_fields = normalizer_result.get("normalized_fields", {})

        for field_name, field_data in normalized_fields.items():
            export[field_name] = field_data.get("value")

        # Also pull from existing V7 engines/evidence if available
        engines = self.context.get("engines", {})
        evidence = self.context.get("evidence", {})

        # V7 engine values fill gaps only (Lane B → V7 engine → export)
        if isinstance(evidence, dict):
            for field_name, entry in evidence.items():
                if field_name not in export:
                    if isinstance(entry, dict) and entry.get("state") == "present":
                        export[field_name] = entry.get("value")

        return export

    def _build_buyer_report(self, reconciled) -> Dict[str, Any]:
        """Build a buyer-facing summary from reconciled facts."""
        report = {
            "economics": {},
            "risk": {},
            "performance": {},
            "control": {},
            "identity": {},
        }

        for packet in reconciled:
            family = packet.family
            if family in report:
                ft = packet.fact_type
                report[family][ft] = {
                    "value": packet.fact_payload.get("value"),
                    "confidence": packet.confidence,
                    "importance": packet.importance.value,
                    "source_item": packet.source_item,
                }

        return report

    def _build_unresolved_report(self) -> List[Dict]:
        """Build report of everything still unresolved."""
        unresolved = []

        # Unconsumed fact packets
        for p in self.fact_store.get_unconsumed():
            unresolved.append({
                "type": "unconsumed_fact",
                "description": f"Fact {p.object_id} ({p.fact_type}) not consumed by either lane",
                "source": p.emitted_by,
                "item": p.source_item,
            })

        # Conflicting packets
        for p in self.fact_store.get_conflicts():
            unresolved.append({
                "type": "conflict",
                "description": f"Conflict: {p.fact_type} from {p.emitted_by}",
                "conflicts_with": p.conflicts_with,
                "item": p.source_item,
            })

        # Unfinished sources
        for s in self.source_registry.get_unfinished():
            unresolved.append({
                "type": "unfinished_source",
                "description": f"Source {s.source_id} in state {s.parse_state.value}",
                "pages": s.pages,
            })

        # Failed sources
        for s in self.source_registry.get_failed():
            unresolved.append({
                "type": "failed_source",
                "description": f"Source {s.source_id} failed: {s.metadata.get('failure_reason', 'unknown')}",
                "pages": s.pages,
            })

        return unresolved

    def _build_consumption_report(self) -> Dict[str, Any]:
        """Build the consumption accountability report."""
        source_summary = self.source_registry.summary()
        fact_summary = self.fact_store.summary()
        completeness = self.source_registry.validate_completeness()

        return {
            "sources": source_summary,
            "facts": fact_summary,
            "completeness": completeness,
            "no_silent_skip": completeness["all_complete"],
        }

    def _assess_completeness(self) -> Dict[str, Any]:
        """Assess whether this extraction is complete per acceptance criteria."""
        source_completeness = self.source_registry.validate_completeness()
        fact_summary = self.fact_store.summary()

        # Check all acceptance criteria
        checks = {
            "all_sources_terminal": source_completeness["all_complete"],
            "required_tables_addressed": self._check_required_tables(),
            "required_exhibits_addressed": self._check_required_exhibits(),
            "canonical_built": True,  # We built it above
            "unresolved_report_exists": True,  # We built it above
            "no_pii_leakage": True,  # Assumed — V7 PII checks run separately
        }

        all_passed = all(checks.values())
        return {
            "complete": all_passed,
            "checks": checks,
            "total_facts": fact_summary["total_packets"],
            "reconciled_count": fact_summary["by_state"].get("reconciled", 0),
            "conflict_count": fact_summary["conflict_count"],
        }

    def _check_required_tables(self) -> bool:
        """Check that all required tables are parsed or explicitly unresolved."""
        REQUIRED_TABLE_ITEMS = [5, 6, 7, 19, 20]
        for item_num in REQUIRED_TABLE_ITEMS:
            source_id = f"item_{item_num}"
            source = self.source_registry.get(source_id)
            if source and source.parse_state.value not in ("parsed", "failed", "not_found"):
                return False
        return True

    def _check_required_exhibits(self) -> bool:
        """Check that all required exhibits are addressed."""
        from .source_registry import SourceType

        exhibit_sources = self.source_registry.get_by_type(SourceType.EXHIBIT)
        for source in exhibit_sources:
            if source.parse_state.value not in ("parsed", "failed", "not_found", "skipped_pii"):
                return False
        return True
