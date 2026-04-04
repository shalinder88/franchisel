"""
Worker 31: Reconciler / Auditor

Compares item workers, table worker, exhibit worker, Lane A, and Lane B.

Allowed statuses only:
  - confirm: both lanes agree
  - enrich: one lane adds to the other
  - conflict: lanes disagree
  - missing: expected but not found
  - needs_review: uncertain

No one-worker truth. Final truth only comes after reconciliation.
"""

from typing import Any, Dict, List, Optional, Tuple
from .base_worker import BaseWorker
from .fact_packet import (
    SourceZone, ObjectType, Importance, ConsumptionState, FactPacket
)


class ReconciliationStatus:
    CONFIRM = "confirm"
    ENRICH = "enrich"
    CONFLICT = "conflict"
    MISSING = "missing"
    NEEDS_REVIEW = "needs_review"


class ReconcilerWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "reconciler"

    @property
    def worker_num(self) -> int:
        return 31

    def execute(self) -> Dict[str, Any]:
        """Compare all lanes and resolve truth."""
        all_packets = self.fact_store.get_active()

        # Separate by source
        item_worker_facts = [p for p in all_packets if p.emitted_by.startswith("item_")]
        table_facts = [p for p in all_packets if p.emitted_by == "table_extractor"]
        exhibit_facts = [p for p in all_packets if p.emitted_by == "exhibit_extractor"]
        lane_a_facts = [p for p in all_packets if p.used_by_lane_A]
        lane_b_facts = [p for p in all_packets if p.used_by_lane_B]

        reconciliation_results = []
        confirmed = 0
        enriched = 0
        conflicted = 0
        missing = 0
        needs_review = 0

        # ── 1. Compare item workers vs table extractor ──
        # Table extractor's parsed data should confirm or enrich item worker findings
        item_table_comparisons = self._compare_sources(
            item_worker_facts, table_facts, "item_vs_table"
        )
        for comp in item_table_comparisons:
            reconciliation_results.append(comp)
            if comp["status"] == ReconciliationStatus.CONFIRM:
                confirmed += 1
            elif comp["status"] == ReconciliationStatus.ENRICH:
                enriched += 1
            elif comp["status"] == ReconciliationStatus.CONFLICT:
                conflicted += 1

        # ── 2. Compare item workers vs exhibit extractor ──
        item_exhibit_comparisons = self._compare_sources(
            item_worker_facts, exhibit_facts, "item_vs_exhibit"
        )
        for comp in item_exhibit_comparisons:
            reconciliation_results.append(comp)
            if comp["status"] == ReconciliationStatus.CONFIRM:
                confirmed += 1
            elif comp["status"] == ReconciliationStatus.ENRICH:
                enriched += 1

        # ── 3. Compare Lane A vs Lane B ──
        lane_comparisons = self._compare_lanes(lane_a_facts, lane_b_facts)
        for comp in lane_comparisons:
            reconciliation_results.append(comp)
            if comp["status"] == ReconciliationStatus.CONFIRM:
                confirmed += 1
            elif comp["status"] == ReconciliationStatus.ENRICH:
                enriched += 1
            elif comp["status"] == ReconciliationStatus.CONFLICT:
                conflicted += 1

        # ── 4. Check required-source checklist ─���
        checklist = self.context.get("required_checklist", [])
        for item in checklist:
            if item.get("critical") and not item.get("found"):
                reconciliation_results.append({
                    "comparison": "required_checklist",
                    "object": item["object"],
                    "status": ReconciliationStatus.MISSING,
                    "detail": f"Critical required object {item['object']} not found",
                })
                missing += 1

        # ── 4b. Report conflicts to blackboard ──
        for comp in reconciliation_results:
            if comp["status"] == ReconciliationStatus.CONFLICT:
                self.report_conflict(
                    fact_type=comp.get("fact_type", "unknown"),
                    source_a=comp.get("primary_id", comp.get("comparison", "")),
                    source_b=comp.get("secondary_id", ""),
                    value_a=comp.get("detail", "")[:50],
                    source_item=None,
                    detail=comp.get("detail", ""),
                )

        # ── 5. Mark reconciled packets ──
        for packet in all_packets:
            if packet.consumption_state not in (
                ConsumptionState.CONFLICT,
                ConsumptionState.REJECTED,
                ConsumptionState.SUPERSEDED,
            ):
                if packet.used_by_lane_A or packet.used_by_lane_B:
                    packet.mark_reconciled()

        # ── 6. Source completeness check ──
        source_completeness = self.source_registry.validate_completeness()

        # ── Emit reconciliation summary ──
        self.emit(
            fact_type="reconciliation_summary",
            fact_payload={
                "confirmed": confirmed,
                "enriched": enriched,
                "conflicted": conflicted,
                "missing": missing,
                "needs_review": needs_review,
                "source_completeness": source_completeness["all_complete"],
                "source_violations": source_completeness["violation_count"],
            },
            source_zone=SourceZone.FRONT_MATTER,
            family="document",
            importance=Importance.CORE,
            confidence=1.0,
        )

        material_disagreement = conflicted > 0 or not source_completeness["all_complete"]

        return {
            "sources_parsed": [],
            "unresolved": [r["detail"] for r in reconciliation_results
                          if r["status"] in (ReconciliationStatus.CONFLICT,
                                              ReconciliationStatus.MISSING)],
            "confirmed": confirmed,
            "enriched": enriched,
            "conflicted": conflicted,
            "missing": missing,
            "needs_review": needs_review,
            "material_disagreement": material_disagreement,
            "source_completeness": source_completeness,
            "reconciliation_details": reconciliation_results[:50],
        }

    def _compare_sources(self, primary: List[FactPacket],
                          secondary: List[FactPacket],
                          comparison_name: str) -> List[Dict]:
        """Compare two sets of fact packets for agreement/conflict."""
        results = []

        # Index secondary by fact_type
        secondary_by_type = {}
        for p in secondary:
            ft = p.fact_type
            if ft not in secondary_by_type:
                secondary_by_type[ft] = []
            secondary_by_type[ft].append(p)

        # Check each primary fact against secondary
        seen_types = set()
        for p in primary:
            ft = p.fact_type
            if ft in seen_types:
                continue
            seen_types.add(ft)

            sec_matches = secondary_by_type.get(ft, [])
            if not sec_matches:
                continue  # No corresponding secondary fact — not a conflict

            # Compare values
            p_val = str(p.fact_payload.get("value", ""))
            for s in sec_matches:
                s_val = str(s.fact_payload.get("value", ""))
                if p_val == s_val:
                    results.append({
                        "comparison": comparison_name,
                        "fact_type": ft,
                        "status": ReconciliationStatus.CONFIRM,
                        "detail": f"{ft}: primary and secondary agree",
                        "primary_id": p.object_id,
                        "secondary_id": s.object_id,
                    })
                elif s_val and p_val:
                    results.append({
                        "comparison": comparison_name,
                        "fact_type": ft,
                        "status": ReconciliationStatus.CONFLICT,
                        "detail": f"{ft}: primary='{p_val[:50]}' vs secondary='{s_val[:50]}'",
                        "primary_id": p.object_id,
                        "secondary_id": s.object_id,
                    })
                else:
                    results.append({
                        "comparison": comparison_name,
                        "fact_type": ft,
                        "status": ReconciliationStatus.ENRICH,
                        "detail": f"{ft}: secondary enriches primary",
                        "primary_id": p.object_id,
                        "secondary_id": s.object_id,
                    })

        return results

    def _compare_lanes(self, lane_a: List[FactPacket],
                        lane_b: List[FactPacket]) -> List[Dict]:
        """Compare Lane A (discovery) vs Lane B (normalization)."""
        results = []

        a_types = {p.fact_type for p in lane_a}
        b_types = {p.fact_type for p in lane_b}

        # A-only facts
        a_only = a_types - b_types
        for ft in a_only:
            results.append({
                "comparison": "lane_a_vs_b",
                "fact_type": ft,
                "status": ReconciliationStatus.ENRICH,
                "detail": f"{ft}: found by Lane A only (discovery-side)",
            })

        # B-only facts
        b_only = b_types - a_types
        for ft in b_only:
            results.append({
                "comparison": "lane_a_vs_b",
                "fact_type": ft,
                "status": ReconciliationStatus.ENRICH,
                "detail": f"{ft}: found by Lane B only (normalization-side)",
            })

        # Shared facts — check for value agreement
        shared = a_types & b_types
        a_by_type = {p.fact_type: p for p in lane_a}
        b_by_type = {p.fact_type: p for p in lane_b}
        for ft in shared:
            a_p = a_by_type.get(ft)
            b_p = b_by_type.get(ft)
            if a_p and b_p:
                a_val = str(a_p.fact_payload.get("value", ""))
                b_val = str(b_p.fact_payload.get("value", ""))
                if a_val == b_val:
                    results.append({
                        "comparison": "lane_a_vs_b",
                        "fact_type": ft,
                        "status": ReconciliationStatus.CONFIRM,
                        "detail": f"{ft}: Lane A and B agree",
                    })

        return results
