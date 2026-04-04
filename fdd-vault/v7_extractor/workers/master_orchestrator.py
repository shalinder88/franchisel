"""
Worker 1: Master Orchestrator

Builds the job graph, assigns work, tracks completion, blocks duplicate parsing,
invokes recovery, invokes reconciliation, and assembles final output.

This is the traffic controller. No worker runs without the orchestrator's
knowledge. No source is parsed twice. No fact is lost.

7-stage execution:
  Stage 1: Structure first (Worker 2: front matter + roadmap)
  Stage 2: Item readers (Workers 3-25, parallel after roadmap stable)
  Stage 3: Global table + exhibit pass (Workers 26-27)
  Stage 4: Assist mode — idle light workers take tickets from heavy workers
  Stage 5: Recovery (Worker 28, only on unresolved)
  Stage 6: Truth building (Workers 29-32)
  Stage 7: Academy writeback (offline, post-extraction)

Workers are TYPES, not permanent agents. Light workers finish fast and become
helpers. The master schedules by predicted workload class.
"""

from typing import Any, Dict, List, Optional, Type
from .base_worker import BaseWorker, WorkerState
from .fact_packet import FactPacketStore
from .source_registry import SourceRegistry
from .blackboard import Blackboard, WorkerMode, WORKLOAD_MAP
from .lease_manager import LeaseManager
from .ticket_broker import TicketBroker
from .consumption_ledger import ConsumptionLedger


class MasterOrchestrator:
    """Orchestrates all 32 workers through the 7-stage pipeline.

    The orchestrator is NOT a worker itself — it's the controller.
    It owns the blackboard, lease manager, ticket broker, source registry,
    fact packet store, and consumption ledger.
    """

    def __init__(self, brand: str, context: Dict[str, Any]):
        self.brand = brand
        self.context = context

        # ── Core registries ──
        self.source_registry = SourceRegistry()
        self.fact_store = FactPacketStore()

        # ── Coordination layer (the refinement) ──
        self.blackboard = Blackboard(brand)
        self.lease_manager = LeaseManager()
        self.ticket_broker = TicketBroker()
        self.consumption_ledger = ConsumptionLedger()

        # Inject coordination objects into context for workers
        self.context["blackboard"] = self.blackboard
        self.context["lease_manager"] = self.lease_manager
        self.context["ticket_broker"] = self.ticket_broker
        self.context["consumption_ledger"] = self.consumption_ledger

        # Worker registry
        self._worker_classes: Dict[str, Type[BaseWorker]] = {}
        self._workers: Dict[str, BaseWorker] = {}
        self._results: Dict[str, Dict] = {}
        self._stage_results: Dict[int, Dict] = {}

    def register_worker(self, worker_class: Type[BaseWorker]):
        temp = worker_class.__new__(worker_class)
        wid = temp.worker_id
        self._worker_classes[wid] = worker_class
        # Register on blackboard with workload class
        self.blackboard.register_worker(wid, WORKLOAD_MAP.get(wid))

    def register_workers(self, worker_classes: List[Type[BaseWorker]]):
        for wc in worker_classes:
            self.register_worker(wc)

    def _create_worker(self, worker_class: Type[BaseWorker]) -> BaseWorker:
        return worker_class(
            source_registry=self.source_registry,
            fact_store=self.fact_store,
            brand=self.brand,
            context=self.context,
        )

    def run(self) -> Dict[str, Any]:
        """Execute the full 7-stage pipeline."""
        print(f"\n{'='*60}")
        print(f"  MASTER ORCHESTRATOR: {self.brand}")
        print(f"  Workers registered: {len(self._worker_classes)}")
        print(f"  Coordination: blackboard + leases + tickets")
        print(f"{'='*60}")

        # ═══════════════════════════════════════════════════════════
        # STAGE 1: STRUCTURE FIRST
        # ═══════════════════════════════════════════════════════════
        stage1 = self._run_stage(1, "Structure Discovery", ["front_matter"])
        self._stage_results[1] = stage1

        fm_result = stage1.get("front_matter", {})
        self.context["page_map"] = fm_result.get("page_map", {})
        self.context["required_checklist"] = fm_result.get("required_checklist", [])
        self.context["table_candidates"] = fm_result.get("table_candidates", [])
        self.context["spill_warnings"] = fm_result.get("spill_warnings", [])

        # Register standard consumption requirements
        exhibit_codes = list(self.context.get("bootstrap", {}).get("exhibitMap", {}).keys())
        self.consumption_ledger.register_standard_requirements(
            exhibit_codes, self.context.get("page_map", {})
        )

        # ═══════════════════════════════════════════════════════════
        # STAGE 2: ITEM READERS (by workload class)
        # Fix 8: Only run if items are hydrated
        # ═══════════════════════════════════════════════════════════
        hydration = self.context.get("hydration", {})
        items_hydrated = hydration.get("items_with_text", 0) > 0

        if items_hydrated:
            item_workers = [wid for wid in self._worker_classes
                            if wid.startswith("item_")]
            # Sort by workload: light first so they finish and become helpers
            item_workers.sort(key=lambda w: {
                "light": 0, "medium": 1, "heavy": 2, "very_heavy": 3
            }.get(WORKLOAD_MAP.get(w, "medium").value, 1))

            stage2 = self._run_stage(2, "Item Reading", item_workers)
        else:
            print(f"\n  Stage 2: Item Reading — SKIPPED (items not hydrated)")
            stage2 = {"skipped": True, "reason": "items not hydrated"}
        self._stage_results[2] = stage2

        # ═══════════════════════════════════════════════════════════
        # STAGE 3: GLOBAL TABLE + EXHIBIT PASS
        # Fix 8: Run if tables/exhibits exist, even if item workers skipped
        # ═══════════════════════════════════════════════════════════
        has_tables = hydration.get("tables_count", 0) > 0 or hydration.get("items_with_tables", 0) > 0
        has_exhibits = hydration.get("exhibits_count", 0) > 0

        if has_tables or has_exhibits:
            global_workers = [wid for wid in self._worker_classes
                              if wid in ("table_extractor", "exhibit_extractor")]
            stage3 = self._run_stage(3, "Global Table + Exhibit Pass", global_workers)
        else:
            print(f"\n  Stage 3: Global Table + Exhibit — SKIPPED (no tables/exhibits)")
            stage3 = {"skipped": True, "reason": "no tables or exhibits"}
        self._stage_results[3] = stage3

        # ═══════════════════════════════════════════════════════════
        # STAGE 4: ASSIST MODE — idle workers take tickets
        # ═══════════════════════════════════════════════════════════
        stage4 = self._run_assist_stage()
        self._stage_results[4] = stage4

        # ═══════════════════════════════════════════════════════════
        # STAGE 5: RECOVERY
        # ═══════════════════════════════════════════════════════════
        needs_recovery = self._check_recovery_needed()
        if needs_recovery:
            recovery_workers = [wid for wid in self._worker_classes
                                if wid == "recovery_worker"]
            stage5 = self._run_stage(5, "Recovery", recovery_workers)
        else:
            stage5 = {"skipped": True, "reason": "no unresolved sources"}
            print(f"\n  Stage 5: Recovery — SKIPPED (no unresolved sources)")
        self._stage_results[5] = stage5

        # ═══════════════════════════════════════════════════════════
        # STAGE 6: TRUTH BUILDING
        # ═══════════════════════════════════════════════════════════
        stage6 = self._run_stage_sequential(
            6, "Truth Building",
            ["lane_a_synthesizer", "lane_b_normalizer", "reconciler", "final_assembler"]
        )
        self._stage_results[6] = stage6

        # ═══════════════════════════════════════════════════════════
        # FINAL VALIDATION
        # ═══════════════════════════════════════════════════════════
        source_completeness = self.source_registry.validate_completeness()
        consumption_check = self.consumption_ledger.validate_no_silent_skip()
        lease_check = self.lease_manager.validate_no_orphans()
        fact_summary = self.fact_store.summary()
        bb_summary = self.blackboard.summary()
        ticket_summary = self.ticket_broker.summary()

        print(f"\n{'='*60}")
        print(f"  ORCHESTRATION COMPLETE")
        print(f"  Sources: {self.source_registry.summary()['total_sources']}")
        print(f"  Facts: {fact_summary['total_packets']}")
        print(f"  Leases: {self.lease_manager.summary()['total_leases']}")
        print(f"  Tickets: {ticket_summary['total_tickets']} ({ticket_summary.get('open', 0)} open)")
        print(f"  Conflicts: {len(self.blackboard.get_all_conflicts())}")
        print(f"  Source completeness: {'PASS' if source_completeness['all_complete'] else 'VIOLATIONS'}")
        cons_msg = "PASS" if consumption_check["all_consumed"] else f"{consumption_check['violation_count']} violations"
        lease_msg = "PASS" if lease_check["all_owned"] else f"{lease_check['orphan_count']} orphans"
        print(f"  Consumption check: {cons_msg}")
        print(f"  Lease check: {lease_msg}")
        print(f"{'='*60}\n")

        return {
            "brand": self.brand,
            "stages": self._stage_results,
            "workers": self._results,
            "source_registry": self.source_registry.to_dict(),
            "source_summary": self.source_registry.summary(),
            "source_completeness": source_completeness,
            "fact_store": self.fact_store.to_list(),
            "fact_summary": fact_summary,
            "blackboard": self.blackboard.to_dict(),
            "blackboard_summary": bb_summary,
            "lease_summary": self.lease_manager.summary(),
            "lease_check": lease_check,
            "ticket_summary": ticket_summary,
            "consumption_summary": self.consumption_ledger.summary(),
            "consumption_check": consumption_check,
            "conflicts": [c.to_dict() for c in self.blackboard.get_all_conflicts()],
        }

    # ══════════════════════════════════════════════════════════════
    # STAGE RUNNERS
    # ══════════════════════════════════════════════════════════════

    def _run_stage(self, stage_num: int, stage_name: str,
                   worker_ids: List[str]) -> Dict[str, Any]:
        """Run a set of workers. Light workers that finish become idle for assist."""
        print(f"\n  Stage {stage_num}: {stage_name} ({len(worker_ids)} workers)")
        results = {}

        for wid in worker_ids:
            if wid not in self._worker_classes:
                continue

            worker = self._create_worker(self._worker_classes[wid])
            self._workers[wid] = worker

            # Set to primary mode
            self.blackboard.set_worker_mode(wid, WorkerMode.PRIMARY)
            print(f"    Running {worker.worker_label}...")

            result = worker.run()
            self._results[wid] = result
            results[wid] = result

            # Mark primary complete → worker becomes idle
            self.blackboard.mark_primary_complete(wid)

            state_icon = "✓" if result["state"] == WorkerState.COMPLETE else "✗"
            print(f"    {state_icon} {wid}: {result['facts_emitted']} facts | {result['state']}")
            if result.get("errors"):
                for err in result["errors"][:3]:
                    print(f"      ❌ {err[:80]}")

        return results

    def _run_stage_sequential(self, stage_num: int, stage_name: str,
                               worker_ids: List[str]) -> Dict[str, Any]:
        """Run workers in strict sequential order."""
        print(f"\n  Stage {stage_num}: {stage_name} (sequential, {len(worker_ids)} workers)")
        results = {}

        for wid in worker_ids:
            if wid not in self._worker_classes:
                continue

            worker = self._create_worker(self._worker_classes[wid])
            self._workers[wid] = worker
            worker.context["stage_results"] = results

            self.blackboard.set_worker_mode(wid, WorkerMode.PRIMARY)
            print(f"    Running {worker.worker_label}...")

            result = worker.run()
            self._results[wid] = result
            results[wid] = result
            self.blackboard.mark_primary_complete(wid)

            state_icon = "✓" if result["state"] == WorkerState.COMPLETE else "✗"
            print(f"    {state_icon} {wid}: {result['facts_emitted']} facts | {result['state']}")

            if result["state"] == WorkerState.FAILED:
                print(f"    ❌ {wid} failed — halting chain")
                break

        return results

    # ══════════════════════════════════════════════════════════════
    # STAGE 4: ASSIST MODE
    # ══════════════════════════════════════════════════════════════

    def _run_assist_stage(self) -> Dict[str, Any]:
        """Stage 4: Finished light workers take tickets from heavy workers.

        Flow:
        1. Get all idle workers (finished primary)
        2. Get all open tickets
        3. Auto-assign tickets to idle workers
        4. Each helper executes their ticket
        5. Evidence submitted to blackboard for primary owner
        """
        print(f"\n  Stage 4: Assist Mode")

        idle = self.blackboard.get_idle_workers()
        open_tickets = self.ticket_broker.get_open_tickets()

        if not open_tickets:
            print(f"    No tickets — skipping assist mode")
            return {"skipped": True, "reason": "no tickets", "idle_workers": len(idle)}

        print(f"    Idle workers: {len(idle)}")
        print(f"    Open tickets: {len(open_tickets)}")

        # Auto-assign
        assignments = self.ticket_broker.auto_assign(idle)
        print(f"    Assignments: {len(assignments)}")

        completed_tickets = 0
        evidence_submitted = 0

        for assignment in assignments:
            wid = assignment["assigned_to"]
            tid = assignment["ticket_id"]
            ticket = self.ticket_broker._tickets.get(tid)

            if not ticket or wid not in self._workers:
                continue

            # Set worker to assist mode
            self.blackboard.set_worker_mode(wid, WorkerMode.ASSIST,
                                             assisting=ticket.created_by)

            # Start ticket
            self.ticket_broker.start_ticket(tid, wid)

            # Execute ticket via the worker
            worker = self._workers[wid]
            result = worker.execute_ticket(ticket)

            if result:
                # Submit evidence to blackboard
                ev_id = self.blackboard.submit_evidence(
                    produced_by=wid,
                    for_owner=ticket.created_by,
                    content_type=ticket.ticket_type.value,
                    content=result,
                    ticket_id=tid,
                )
                self.ticket_broker.complete_ticket(tid, wid,
                                                     evidence_packet_id=ev_id,
                                                     result=result)
                completed_tickets += 1
                evidence_submitted += 1
                print(f"    ✓ {wid} completed ticket {tid} → evidence for {ticket.created_by}")
            else:
                self.ticket_broker.complete_ticket(tid, wid)
                print(f"    ~ {wid} completed ticket {tid} (no evidence)")

            # Return to idle
            self.blackboard.set_worker_mode(wid, WorkerMode.IDLE)

        return {
            "idle_workers": len(idle),
            "open_tickets": len(open_tickets),
            "assignments": len(assignments),
            "completed_tickets": completed_tickets,
            "evidence_submitted": evidence_submitted,
        }

    # ══════════════════════════════════════════════════════════════
    # RECOVERY CHECK
    # ══════════════════════════════════════════════════════════════

    def _check_recovery_needed(self) -> bool:
        if self.source_registry.has_unfinished():
            print(f"    Recovery trigger: {len(self.source_registry.get_unfinished())} unfinished sources")
            return True

        unresolved = [p for p in self.fact_store.get_unconsumed() if p.fact_type == "unresolved"]
        if unresolved:
            print(f"    Recovery trigger: {len(unresolved)} unresolved facts")
            return True

        conflicts = self.blackboard.get_all_conflicts()
        if conflicts:
            print(f"    Recovery trigger: {len(conflicts)} conflicts on blackboard")
            return True

        # Check lease orphans
        orphans = self.lease_manager.get_unclaimed()
        if orphans:
            print(f"    Recovery trigger: {len(orphans)} unclaimed leases")
            return True

        return False

    # ══════════════════════════════════════════════════════════════
    # QUERY INTERFACE
    # ══════════════════════════════════════════════════════════════

    def get_worker_result(self, worker_id: str) -> Optional[Dict]:
        return self._results.get(worker_id)

    def get_stage_result(self, stage_num: int) -> Optional[Dict]:
        return self._stage_results.get(stage_num)

    def get_all_facts_for_item(self, item_num: int) -> List:
        return self.fact_store.get_by_item(item_num)

    def get_source_coverage(self) -> Dict[str, Any]:
        total = self.source_registry.summary()["total_sources"]
        parsed = len([s for s in self.source_registry._sources.values()
                       if s.parse_state.value == "parsed"])
        failed = len(self.source_registry.get_failed())
        return {
            "total_sources": total,
            "parsed": parsed,
            "failed": failed,
            "coverage_pct": round(parsed / max(total, 1) * 100, 1),
        }
