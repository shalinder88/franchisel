"""
Worker 28: Recovery / Backfill Extractor

Runs ONLY when required objects are still unresolved after item workers
and cross-cutting specialists have completed.

Handles:
  - Missing required tables
  - Missing required exhibits
  - Conflicting source objects
  - Multi-page continuations (spill pages)
  - Broken table carries
  - Missing exhibit pages
  - Contradiction recovery
"""

from typing import Any, Dict, List
from .base_worker import BaseWorker
from .fact_packet import SourceZone, ObjectType, Importance
from .source_registry import SourceType, ParseState


class RecoveryWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "recovery_worker"

    @property
    def worker_num(self) -> int:
        return 28

    def execute(self) -> Dict[str, Any]:
        sources_parsed = []
        recoveries = []

        # ── 1. Find unfinished sources ──
        unfinished = self.source_registry.get_unfinished()
        failed = self.source_registry.get_failed()

        # ── 2. Find unresolved fact packets ──
        unresolved_packets = [
            p for p in self.fact_store.get_unconsumed()
            if p.fact_type == "unresolved"
        ]

        # ── 3. Find conflicting packets ──
        conflicts = self.fact_store.get_conflicts()

        # ── 4. Attempt recovery for unfinished sources ──
        for source in unfinished:
            recovery = self._attempt_source_recovery(source)
            if recovery:
                recoveries.append(recovery)
                sources_parsed.append(source.source_id)

        # ── 5. Attempt recovery for failed sources ──
        for source in failed:
            recovery = self._attempt_failed_recovery(source)
            if recovery:
                recoveries.append(recovery)

        # ── 6. Attempt resolution for unresolved packets ──
        for packet in unresolved_packets:
            resolution = self._attempt_packet_resolution(packet)
            if resolution:
                recoveries.append(resolution)

        # ── 7. Attempt conflict resolution ──
        for packet in conflicts:
            resolution = self._attempt_conflict_resolution(packet)
            if resolution:
                recoveries.append(resolution)

        # ── 8. Check for spill pages ──
        spill_warnings = self.context.get("spill_warnings", [])
        for spill in spill_warnings:
            recovery = self._check_spill(spill)
            if recovery:
                recoveries.append(recovery)

        return {
            "sources_parsed": sources_parsed,
            "unresolved": [r for r in recoveries if not r.get("resolved")],
            "recoveries_attempted": len(recoveries),
            "recoveries_resolved": len([r for r in recoveries if r.get("resolved")]),
            "unfinished_sources": len(unfinished),
            "failed_sources": len(failed),
            "conflict_packets": len(conflicts),
        }

    def _attempt_source_recovery(self, source) -> Dict:
        """Try to recover an unfinished source."""
        result = {
            "source_id": source.source_id,
            "type": source.source_type.value,
            "action": "source_recovery",
            "resolved": False,
        }

        # If the source has pages, it was located but not parsed
        if source.pages:
            # Emit a placeholder fact noting the gap
            self.emit(
                fact_type="recovery_gap",
                fact_payload={
                    "source_id": source.source_id,
                    "pages": source.pages,
                    "reason": "located_not_parsed",
                },
                source_zone=SourceZone.ITEM if source.item_num else SourceZone.EXHIBIT,
                source_item=source.item_num,
                source_pages=source.pages,
                source_exhibit=source.exhibit_code,
                importance=Importance.CONTEXT,
                confidence=0.3,
                needs_review=True,
                review_reason=f"Source {source.source_id} was located but not parsed",
            )
            # Mark as failed rather than leaving unfinished
            self.source_registry.mark_failed(
                source.source_id, self.worker_id,
                "recovery_attempted_but_no_primary_parser"
            )
            result["action"] = "marked_as_gap"

        else:
            # Source was registered but never located
            self.source_registry.mark_not_found(source.source_id)
            result["action"] = "marked_not_found"

        return result

    def _attempt_failed_recovery(self, source) -> Dict:
        """Try to re-parse a failed source."""
        result = {
            "source_id": source.source_id,
            "type": source.source_type.value,
            "action": "failed_recovery",
            "resolved": False,
        }

        # Emit the gap for audit trail
        self.emit(
            fact_type="recovery_failed_source",
            fact_payload={
                "source_id": source.source_id,
                "failure_reason": source.metadata.get("failure_reason", "unknown"),
            },
            source_zone=SourceZone.ITEM if source.item_num else SourceZone.EXHIBIT,
            source_item=source.item_num,
            source_pages=source.pages,
            importance=Importance.CONTEXT,
            confidence=0.2,
            needs_review=True,
            review_reason=f"Source {source.source_id} failed: {source.metadata.get('failure_reason', 'unknown')}",
        )

        return result

    def _attempt_packet_resolution(self, packet) -> Dict:
        """Try to resolve an unresolved fact packet."""
        description = packet.fact_payload.get("description", "")
        return {
            "packet_id": packet.object_id,
            "description": description,
            "action": "packet_resolution",
            "resolved": False,
        }

    def _attempt_conflict_resolution(self, packet) -> Dict:
        """Try to resolve a conflicting fact packet."""
        conflicting_ids = packet.conflicts_with
        return {
            "packet_id": packet.object_id,
            "conflicts_with": conflicting_ids,
            "action": "conflict_resolution",
            "resolved": False,
        }

    def _check_spill(self, spill: Dict) -> Dict:
        """Check if a spill warning indicates lost content."""
        return {
            "item": spill.get("item"),
            "pages": spill.get("pages"),
            "warning": spill.get("warning"),
            "action": "spill_check",
            "resolved": False,
        }
