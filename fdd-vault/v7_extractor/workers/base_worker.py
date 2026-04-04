"""
Base Worker — Abstract base class for all 32 extractors.

Every worker inherits from this. It provides:
  - Access to source registry, consumption ledger, fact packet store
  - Access to blackboard, lease manager, ticket broker
  - 4 modes: primary, assist, validation, idle
  - Standardized emit() for producing fact packets
  - Structured help via tickets (no freeform worker-to-worker talk)
  - Run protocol: setup → execute → finalize

No worker may bypass this base class.

Workers do NOT talk to each other directly. All communication goes through:
  - Blackboard: shared state
  - Lease Manager: ownership
  - Ticket Broker: help requests
  - Evidence Packets: helper results
  - Conflict Packets: disagreements
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, TYPE_CHECKING
from .fact_packet import (
    FactPacket, FactPacketStore, SourceZone, ObjectType,
    Importance, ConsumptionState
)
from .source_registry import SourceRegistry, SourceType

if TYPE_CHECKING:
    from .blackboard import Blackboard, WorkerMode
    from .lease_manager import LeaseManager
    from .ticket_broker import TicketBroker, TicketType, TicketPriority


class WorkerState:
    """Tracks one worker's execution state."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETE = "complete"
    FAILED = "failed"
    SKIPPED = "skipped"


class BaseWorker(ABC):
    """Abstract base for all 32 extractors.

    Subclasses must implement:
      - worker_id: unique string identifier
      - worker_num: integer 1-32
      - execute(): the extraction logic

    Workers communicate ONLY through:
      - blackboard (shared state)
      - lease_manager (ownership)
      - ticket_broker (help requests)

    Workers receive shared registries at construction. They emit
    FactPackets into the shared store. They claim sources from
    the source registry before parsing.

    Worker modes:
      - PRIMARY: doing its own item/role job
      - ASSIST: helping another owner on sub-parses
      - VALIDATION: checking totals, continuity, contradictions
      - IDLE: available for tickets
    """

    def __init__(self,
                 source_registry: SourceRegistry,
                 fact_store: FactPacketStore,
                 brand: str,
                 context: Dict[str, Any]):
        """
        Args:
            source_registry: Shared source registry for claiming/tracking
            fact_store: Shared fact packet store for emitting discoveries
            brand: Brand name/slug
            context: Shared extraction context (bootstrap, items, exhibits, etc.)
                     Also contains: blackboard, lease_manager, ticket_broker
        """
        self.source_registry = source_registry
        self.fact_store = fact_store
        self.brand = brand
        self.context = context
        self.state = WorkerState.PENDING
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self._packet_count = 0
        self._seq = 0

        # ── Coordination objects (set by orchestrator via context) ──
        self.blackboard: Optional['Blackboard'] = context.get("blackboard")
        self.lease_manager: Optional['LeaseManager'] = context.get("lease_manager")
        self.ticket_broker: Optional['TicketBroker'] = context.get("ticket_broker")

    @property
    @abstractmethod
    def worker_id(self) -> str:
        """Unique string identifier for this worker."""
        ...

    @property
    @abstractmethod
    def worker_num(self) -> int:
        """Integer 1-32."""
        ...

    @property
    def worker_label(self) -> str:
        """Human-readable label."""
        return f"Worker {self.worker_num}: {self.worker_id}"

    @abstractmethod
    def execute(self) -> Dict[str, Any]:
        """Run the extraction logic.

        Must return a dict with at least:
          - facts_emitted: int
          - sources_parsed: list of source_ids
          - unresolved: list of unresolved issues

        Workers should NOT catch their own exceptions — let them bubble
        to the orchestrator for centralized error handling.
        """
        ...

    def run(self) -> Dict[str, Any]:
        """Run the worker with standard lifecycle.

        Returns the worker's result dict plus execution metadata.
        """
        self.state = WorkerState.RUNNING
        try:
            result = self.execute()
            self.state = WorkerState.COMPLETE
            return {
                "worker_id": self.worker_id,
                "worker_num": self.worker_num,
                "state": self.state,
                "facts_emitted": self._packet_count,
                "errors": self.errors,
                "warnings": self.warnings,
                **result,
            }
        except Exception as e:
            self.state = WorkerState.FAILED
            self.errors.append(str(e))
            return {
                "worker_id": self.worker_id,
                "worker_num": self.worker_num,
                "state": self.state,
                "facts_emitted": self._packet_count,
                "errors": self.errors,
                "warnings": self.warnings,
                "exception": str(e),
            }

    # ── Emission helpers ──

    def emit(self,
             fact_type: str,
             fact_payload: Dict[str, Any],
             source_zone: SourceZone,
             source_item: Optional[int] = None,
             source_pages: Optional[List[int]] = None,
             source_exhibit: Optional[str] = None,
             source_table_id: Optional[str] = None,
             object_type: ObjectType = ObjectType.SCALAR,
             family: str = "",
             importance: Importance = Importance.SECONDARY,
             confidence: float = 0.7,
             raw_evidence: str = "",
             needs_review: bool = False,
             review_reason: str = "") -> str:
        """Emit a fact packet into the shared store.

        Applies suppression policy before emission.
        Returns the packet's object_id.
        """
        # ── Apply suppression policy ──
        from .suppression_policy import get_suppression_policy
        policy = get_suppression_policy()
        if raw_evidence:
            check = policy.check(raw_evidence, source_item=source_item,
                                  fact_type=fact_type)
            raw_evidence = check["redacted_text"]
            if check["violations"]:
                for v in check["violations"]:
                    if v["action"] == "block":
                        needs_review = True
                        review_reason = f"PII blocked: {v['type']}"

        self._seq += 1
        object_id = f"{self.worker_id}_{source_item or 'x'}_{self._seq}"

        packet = FactPacket(
            brand=self.brand,
            object_id=object_id,
            source_zone=source_zone,
            source_item=source_item,
            source_pages=source_pages or [],
            source_exhibit=source_exhibit,
            source_table_id=source_table_id,
            object_type=object_type,
            family=family,
            fact_type=fact_type,
            fact_payload=fact_payload,
            raw_evidence=raw_evidence[:500],
            importance=importance,
            confidence=confidence,
            needs_review=needs_review,
            review_reason=review_reason,
            emitted_by=self.worker_id,
        )

        self.fact_store.emit(packet)
        self._packet_count += 1
        return object_id

    def emit_table(self,
                   table_data: Dict[str, Any],
                   source_item: Optional[int] = None,
                   source_pages: Optional[List[int]] = None,
                   source_exhibit: Optional[str] = None,
                   table_id: Optional[str] = None,
                   family: str = "",
                   importance: Importance = Importance.CORE,
                   confidence: float = 0.8) -> str:
        """Emit a full table as a fact packet."""
        return self.emit(
            fact_type="table_object",
            fact_payload=table_data,
            source_zone=SourceZone.TABLE,
            source_item=source_item,
            source_pages=source_pages,
            source_exhibit=source_exhibit,
            source_table_id=table_id,
            object_type=ObjectType.TABLE_FULL,
            family=family,
            importance=importance,
            confidence=confidence,
        )

    def emit_unresolved(self, description: str,
                        source_item: Optional[int] = None,
                        source_pages: Optional[List[int]] = None):
        """Emit an unresolved issue for the recovery worker."""
        self.emit(
            fact_type="unresolved",
            fact_payload={"description": description},
            source_zone=SourceZone.ITEM if source_item else SourceZone.FRONT_MATTER,
            source_item=source_item,
            source_pages=source_pages,
            object_type=ObjectType.SCALAR,
            family="document",
            importance=Importance.CONTEXT,
            confidence=0.0,
            needs_review=True,
            review_reason=description,
        )

    # ── Source registry helpers ──

    def claim_source(self, source_id: str) -> bool:
        """Claim a source for primary parsing."""
        return self.source_registry.claim(source_id, self.worker_id)

    def mark_source_parsing(self, source_id: str):
        self.source_registry.mark_parsing(source_id, self.worker_id)

    def mark_source_parsed(self, source_id: str,
                           fact_ids: Optional[List[str]] = None):
        self.source_registry.mark_parsed(source_id, self.worker_id, fact_ids)

    def mark_source_failed(self, source_id: str, reason: str = ""):
        self.source_registry.mark_failed(source_id, self.worker_id, reason)

    def warn(self, message: str):
        self.warnings.append(message)

    def error(self, message: str):
        self.errors.append(message)

    # ══════════════════════════════════════════════════════════════
    # BLACKBOARD COMMUNICATION (the ONLY way workers talk)
    # ══════════════════════════════════════════════════════════════

    def set_mode(self, mode: 'WorkerMode', assisting: Optional[str] = None):
        """Update this worker's mode on the blackboard."""
        if self.blackboard:
            self.blackboard.set_worker_mode(self.worker_id, mode, assisting)

    def mark_primary_complete(self):
        """Signal that primary duty is done. Worker becomes idle for tickets."""
        if self.blackboard:
            self.blackboard.mark_primary_complete(self.worker_id)

    def submit_evidence_to_owner(self, for_owner: str, content_type: str,
                                   content: Dict[str, Any],
                                   ticket_id: Optional[str] = None,
                                   confidence: float = 0.7) -> Optional[str]:
        """Submit evidence to a primary owner via blackboard.

        Helpers use this — NOT emit(). Only primary owners emit authoritative facts.
        """
        if self.blackboard:
            return self.blackboard.submit_evidence(
                produced_by=self.worker_id,
                for_owner=for_owner,
                content_type=content_type,
                content=content,
                ticket_id=ticket_id,
                confidence=confidence,
            )
        return None

    def get_evidence_from_helpers(self) -> List:
        """Primary owner reads evidence submitted by helpers."""
        if self.blackboard:
            return self.blackboard.get_evidence_for_owner(self.worker_id)
        return []

    def report_conflict(self, fact_type: str,
                         source_a: str, source_b: str,
                         value_a: Any = None, value_b: Any = None,
                         source_item: Optional[int] = None,
                         detail: str = "") -> Optional[str]:
        """Report a conflict. NOT smoothed away. Queued for reconciler."""
        if self.blackboard:
            return self.blackboard.report_conflict(
                reporter=self.worker_id,
                fact_type=fact_type,
                source_a=source_a, source_b=source_b,
                value_a=value_a, value_b=value_b,
                source_item=source_item, detail=detail,
            )
        return None

    # ══════════════════════════════════════════════════════════════
    # LEASE MANAGEMENT (ownership of source objects)
    # ══════════════════════════════════════════════════════════════

    def claim_lease_primary(self, object_id: str, object_type: str,
                             source_item: Optional[int] = None,
                             pages: Optional[List[int]] = None) -> bool:
        """Claim primary ownership of a source object via lease."""
        if not self.lease_manager:
            return True  # Graceful fallback when lease_manager not set

        lid = self.lease_manager.create_lease(
            object_id, object_type,
            source_item=source_item, pages=pages,
        )
        return self.lease_manager.claim_primary(lid, self.worker_id)

    def claim_lease_assist(self, object_id: str) -> bool:
        """Attach as helper on an existing lease."""
        if not self.lease_manager:
            return True

        lease = self.lease_manager.get_lease_by_object(object_id)
        if not lease:
            return False
        return self.lease_manager.claim_assist(lease.lease_id, self.worker_id)

    def release_lease(self, object_id: str) -> bool:
        """Release primary ownership after finishing."""
        if not self.lease_manager:
            return True

        lease = self.lease_manager.get_lease_by_object(object_id)
        if not lease:
            return False
        return self.lease_manager.release(lease.lease_id, self.worker_id)

    # ══════════════════════════════════════════════════════════════
    # TICKET SYSTEM (structured help requests)
    # ══════════════════════════════════════════════════════════════

    def request_help(self, ticket_type, description: str,
                      priority=None,
                      source_item: Optional[int] = None,
                      source_pages: Optional[List[int]] = None,
                      source_table_id: Optional[str] = None,
                      source_exhibit: Optional[str] = None,
                      context: Optional[Dict] = None) -> Optional[str]:
        """Create a help ticket for idle workers to pick up."""
        if not self.ticket_broker:
            return None

        from .ticket_broker import TicketPriority
        pri = priority or TicketPriority.NORMAL

        return self.ticket_broker.create_ticket(
            ticket_type=ticket_type,
            created_by=self.worker_id,
            priority=pri,
            source_item=source_item,
            source_pages=source_pages,
            source_table_id=source_table_id,
            source_exhibit=source_exhibit,
            description=description,
            context=context,
        )

    def execute_ticket(self, ticket) -> Optional[Dict]:
        """Execute an assigned ticket (for assist-mode workers).

        Uses the shared dispatch table from assist_handlers.py.
        Light workers call this automatically — no override needed.
        Heavy workers can override for domain-specific ticket handling.
        """
        from .assist_handlers import dispatch_ticket

        # Build context with fact_store reference for cross-item checks
        ticket_context = dict(self.context)
        ticket_context["fact_store_ref"] = self.fact_store

        return dispatch_ticket(ticket, ticket_context)
