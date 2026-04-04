"""
Blackboard — Single shared state object for the full document.

Workers do NOT write final truth directly. They write to the blackboard.
Workers do NOT talk to each other. They read from and write to the blackboard.

The blackboard holds:
  - page registry
  - item windows
  - table registry
  - exhibit registry
  - leases (via LeaseManager)
  - tickets (via TicketBroker)
  - evidence packets
  - unresolved queue
  - conflict queue
  - completion states
  - worker states (primary/assist/validation/idle)

This is the ONLY communication channel between workers.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set
from enum import Enum
from .fact_packet import FactPacket, FactPacketStore


class WorkerMode(str, Enum):
    """Every worker is in exactly one of these modes."""
    PRIMARY = "primary"         # Doing its own item/role job
    ASSIST = "assist"           # Helping another owner on sub-parses
    VALIDATION = "validation"   # Checking totals, continuity, contradictions
    IDLE = "idle"               # Available for tickets


class WorkloadClass(str, Enum):
    """Predicted workload for scheduling."""
    LIGHT = "light"         # Items 2, 4, 9, 10, 13, 14, 15, 16, 18, 23
    MEDIUM = "medium"       # Items 1, 3, 5, 11, 12, 17, 22
    HEAVY = "heavy"         # Items 6, 7, 8, 19, 20, 21
    VERY_HEAVY = "very_heavy"  # Table extractor, Exhibit extractor


# Map worker_id → workload class
WORKLOAD_MAP = {
    "front_matter": WorkloadClass.MEDIUM,
    "item_01": WorkloadClass.MEDIUM,
    "item_02": WorkloadClass.LIGHT,
    "item_03": WorkloadClass.MEDIUM,
    "item_04": WorkloadClass.LIGHT,
    "item_05": WorkloadClass.MEDIUM,
    "item_06": WorkloadClass.HEAVY,
    "item_07": WorkloadClass.HEAVY,
    "item_08": WorkloadClass.HEAVY,
    "item_09": WorkloadClass.LIGHT,
    "item_10": WorkloadClass.LIGHT,
    "item_11": WorkloadClass.MEDIUM,
    "item_12": WorkloadClass.MEDIUM,
    "item_13": WorkloadClass.LIGHT,
    "item_14": WorkloadClass.LIGHT,
    "item_15": WorkloadClass.LIGHT,
    "item_16": WorkloadClass.LIGHT,
    "item_17": WorkloadClass.MEDIUM,
    "item_18": WorkloadClass.LIGHT,
    "item_19": WorkloadClass.HEAVY,
    "item_20": WorkloadClass.HEAVY,
    "item_21": WorkloadClass.HEAVY,
    "item_22": WorkloadClass.MEDIUM,
    "item_23": WorkloadClass.LIGHT,
    "table_extractor": WorkloadClass.VERY_HEAVY,
    "exhibit_extractor": WorkloadClass.VERY_HEAVY,
    "recovery_worker": WorkloadClass.MEDIUM,
    "lane_a_synthesizer": WorkloadClass.MEDIUM,
    "lane_b_normalizer": WorkloadClass.MEDIUM,
    "reconciler": WorkloadClass.MEDIUM,
    "final_assembler": WorkloadClass.MEDIUM,
}


@dataclass
class WorkerState:
    """Tracks one worker's runtime state."""
    worker_id: str
    mode: WorkerMode = WorkerMode.IDLE
    workload_class: WorkloadClass = WorkloadClass.LIGHT
    primary_complete: bool = False
    assisting: Optional[str] = None  # worker_id being helped
    tickets_completed: int = 0
    facts_emitted: int = 0
    errors: List[str] = field(default_factory=list)


@dataclass
class EvidencePacket:
    """A helper's sub-parse result. NOT final truth — only the primary owner
    can promote this to final truth.

    Helpers produce these. Primary owners consume them.
    """
    packet_id: str
    produced_by: str            # Helper worker_id
    for_owner: str              # Primary owner worker_id
    ticket_id: Optional[str] = None
    content_type: str = ""      # "table_rows", "note_text", "validation_check", etc.
    content: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 0.0
    needs_owner_review: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return {
            "packet_id": self.packet_id,
            "produced_by": self.produced_by,
            "for_owner": self.for_owner,
            "ticket_id": self.ticket_id,
            "content_type": self.content_type,
            "content": self.content,
            "confidence": self.confidence,
            "needs_owner_review": self.needs_owner_review,
        }


@dataclass
class ConflictPacket:
    """A disagreement between two workers or two sources.

    NOT smoothed away. Emitted to the conflict queue for the reconciler.
    """
    conflict_id: str
    reporter: str               # Worker that detected the conflict
    fact_type: str
    source_a: str               # Worker or source ID
    source_b: str
    value_a: Any = None
    value_b: Any = None
    source_item: Optional[int] = None
    detail: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "conflict_id": self.conflict_id,
            "reporter": self.reporter,
            "fact_type": self.fact_type,
            "source_a": self.source_a,
            "source_b": self.source_b,
            "value_a": str(self.value_a)[:100] if self.value_a else None,
            "value_b": str(self.value_b)[:100] if self.value_b else None,
            "source_item": self.source_item,
            "detail": self.detail,
        }


class Blackboard:
    """The single shared state object for the full document.

    All worker communication goes through here.
    No direct worker-to-worker messaging.
    """

    def __init__(self, brand: str):
        self.brand = brand

        # ── Worker states ──
        self._worker_states: Dict[str, WorkerState] = {}

        # ── Page & structure registries ──
        self.page_count: int = 0
        self.item_windows: Dict[int, Dict] = {}     # item_num → {start_page, end_page}
        self.table_registry: Dict[str, Dict] = {}    # table_id → table metadata
        self.exhibit_registry: Dict[str, Dict] = {}  # exhibit_code → exhibit metadata

        # ── Evidence packets (helper → owner) ──
        self._evidence_packets: Dict[str, EvidencePacket] = {}
        self._evidence_by_owner: Dict[str, List[str]] = {}

        # ── Conflict queue ──
        self._conflicts: Dict[str, ConflictPacket] = {}
        self._conflict_seq = 0

        # ── Unresolved queue ──
        self._unresolved: List[Dict] = []

        # ── Completion states ──
        self._completion: Dict[str, str] = {}  # object_id → completion state

        # ── Evidence packet sequence ──
        self._evidence_seq = 0

        # ── Cross-item fact registry (for cross-validation) ──
        self._cross_item_facts: Dict[str, List[Dict]] = {}

        # ── Validation requests ──
        self._validation_requests: List[Dict] = []

    # ══════════════════════════════════════════════════════════════
    # WORKER STATE MANAGEMENT
    # ══════════════════════════════════════════════════════════════

    def register_worker(self, worker_id: str,
                         workload_class: Optional[WorkloadClass] = None):
        """Register a worker on the blackboard."""
        wc = workload_class or WORKLOAD_MAP.get(worker_id, WorkloadClass.LIGHT)
        self._worker_states[worker_id] = WorkerState(
            worker_id=worker_id,
            mode=WorkerMode.IDLE,
            workload_class=wc,
        )

    def set_worker_mode(self, worker_id: str, mode: WorkerMode,
                         assisting: Optional[str] = None):
        """Update a worker's mode."""
        ws = self._worker_states.get(worker_id)
        if ws:
            ws.mode = mode
            ws.assisting = assisting
            if mode == WorkerMode.PRIMARY:
                ws.primary_complete = False

    def mark_primary_complete(self, worker_id: str):
        """Mark a worker's primary duty as finished."""
        ws = self._worker_states.get(worker_id)
        if ws:
            ws.primary_complete = True
            ws.mode = WorkerMode.IDLE

    def get_idle_workers(self) -> List[str]:
        """Workers that finished primary and are available for tickets."""
        return [ws.worker_id for ws in self._worker_states.values()
                if ws.mode == WorkerMode.IDLE and ws.primary_complete]

    def get_worker_state(self, worker_id: str) -> Optional[WorkerState]:
        return self._worker_states.get(worker_id)

    def get_workers_by_mode(self, mode: WorkerMode) -> List[str]:
        return [ws.worker_id for ws in self._worker_states.values()
                if ws.mode == mode]

    # ══════════════════════════════════════════════════════════════
    # STRUCTURE REGISTRIES
    # ══════════════════════════════════════════════════════════════

    def set_item_window(self, item_num: int, start_page: int, end_page: int):
        self.item_windows[item_num] = {
            "start_page": start_page,
            "end_page": end_page,
            "page_count": end_page - start_page + 1,
        }

    def register_table(self, table_id: str, metadata: Dict):
        self.table_registry[table_id] = metadata

    def register_exhibit(self, exhibit_code: str, metadata: Dict):
        self.exhibit_registry[exhibit_code] = metadata

    # ══════════════════════════════════════════════════════════════
    # EVIDENCE PACKETS (helper → owner communication)
    # ══════════════════════════════════════════════════════════════

    def submit_evidence(self, produced_by: str, for_owner: str,
                         content_type: str, content: Dict,
                         ticket_id: Optional[str] = None,
                         confidence: float = 0.7) -> str:
        """Helper submits evidence packet for a primary owner."""
        self._evidence_seq += 1
        pid = f"ev_{produced_by}_{self._evidence_seq}"

        packet = EvidencePacket(
            packet_id=pid,
            produced_by=produced_by,
            for_owner=for_owner,
            ticket_id=ticket_id,
            content_type=content_type,
            content=content,
            confidence=confidence,
        )
        self._evidence_packets[pid] = packet

        if for_owner not in self._evidence_by_owner:
            self._evidence_by_owner[for_owner] = []
        self._evidence_by_owner[for_owner].append(pid)

        return pid

    def get_evidence_for_owner(self, owner_id: str) -> List[EvidencePacket]:
        """Primary owner reads evidence submitted by helpers."""
        ids = self._evidence_by_owner.get(owner_id, [])
        return [self._evidence_packets[pid] for pid in ids
                if pid in self._evidence_packets]

    def mark_evidence_reviewed(self, packet_id: str):
        ep = self._evidence_packets.get(packet_id)
        if ep:
            ep.needs_owner_review = False

    # ══════════════════════════════════════════════════════════════
    # CONFLICT QUEUE
    # ══════════════════════════════════════════════════════════════

    def report_conflict(self, reporter: str, fact_type: str,
                         source_a: str, source_b: str,
                         value_a: Any = None, value_b: Any = None,
                         source_item: Optional[int] = None,
                         detail: str = "") -> str:
        """Report a conflict. NOT smoothed away. Queued for reconciler."""
        self._conflict_seq += 1
        cid = f"conflict_{self._conflict_seq}"

        conflict = ConflictPacket(
            conflict_id=cid,
            reporter=reporter,
            fact_type=fact_type,
            source_a=source_a,
            source_b=source_b,
            value_a=value_a,
            value_b=value_b,
            source_item=source_item,
            detail=detail,
        )
        self._conflicts[cid] = conflict
        return cid

    def get_all_conflicts(self) -> List[ConflictPacket]:
        return list(self._conflicts.values())

    def get_conflicts_for_item(self, item_num: int) -> List[ConflictPacket]:
        return [c for c in self._conflicts.values()
                if c.source_item == item_num]

    # ══════════════════════════════════════════════════════════════
    # UNRESOLVED QUEUE
    # ══════════════════════════════════════════════════════════════

    def add_unresolved(self, worker_id: str, description: str,
                        source_item: Optional[int] = None,
                        source_pages: Optional[List[int]] = None):
        self._unresolved.append({
            "reporter": worker_id,
            "description": description,
            "source_item": source_item,
            "source_pages": source_pages or [],
        })

    def get_unresolved(self) -> List[Dict]:
        return list(self._unresolved)

    # ══════════════════════════════════════════════════════════════
    # COMPLETION TRACKING
    # ══════════════════════════════════════════════════════════════

    def mark_complete(self, object_id: str, state: str = "complete"):
        self._completion[object_id] = state

    def is_complete(self, object_id: str) -> bool:
        return self._completion.get(object_id) == "complete"

    def get_incomplete(self) -> List[str]:
        return [oid for oid, state in self._completion.items()
                if state != "complete"]

    # ══════════════════════════════════════════════════════════════
    # CROSS-ITEM EVIDENCE QUERIES (Gap 5 fix)
    # ══════════════════════════════════════════════════════════════

    def post_cross_item_fact(self, source_item: int, fact_type: str,
                              value: Any, worker_id: str):
        """Post a fact to the cross-item registry so other items can see it.

        This is NOT for final truth — it's for validation and consistency.
        Workers use this to share facts that cross item boundaries.
        """
        key = f"item_{source_item}"
        if key not in self._cross_item_facts:
            self._cross_item_facts[key] = []
        self._cross_item_facts[key].append({
            "fact_type": fact_type,
            "value": value,
            "posted_by": worker_id,
            "source_item": source_item,
        })

    def get_cross_item_facts(self, item_num: int) -> List[Dict]:
        """Get all facts posted about a specific item (for cross-validation)."""
        return self._cross_item_facts.get(f"item_{item_num}", [])

    def get_cross_item_fact(self, item_num: int, fact_type: str) -> Optional[Dict]:
        """Get a specific fact type from another item."""
        for f in self._cross_item_facts.get(f"item_{item_num}", []):
            if f["fact_type"] == fact_type:
                return f
        return None

    def get_all_cross_item_facts(self) -> Dict[str, List[Dict]]:
        """Get all cross-item facts for validation."""
        return dict(self._cross_item_facts)

    # ══════════════════════════════════════════════════════════════
    # VALIDATION REQUESTS (Gap 4 fix)
    # ══════════════════════════════════════════════════════════════

    def request_validation(self, worker_id: str, check_type: str,
                            details: Dict[str, Any]):
        """Request a validation check (workers enter VALIDATION mode for this).

        Check types:
          - total_consistency: do row sums match stated totals
          - cross_item_consistency: do values agree across items
          - note_alignment: do table notes match extracted values
          - continuity_check: do multi-page tables carry correctly
        """
        self._validation_requests.append({
            "requested_by": worker_id,
            "check_type": check_type,
            "details": details,
            "resolved": False,
            "result": None,
        })

    def get_pending_validations(self) -> List[Dict]:
        return [v for v in self._validation_requests if not v["resolved"]]

    def resolve_validation(self, index: int, result: Dict):
        if 0 <= index < len(self._validation_requests):
            self._validation_requests[index]["resolved"] = True
            self._validation_requests[index]["result"] = result

    # ══════════════════════════════════════════════════════════════
    # SUMMARY
    # ══════════════════════════════════════════════════════════════

    def summary(self) -> Dict[str, Any]:
        worker_modes = {}
        for ws in self._worker_states.values():
            m = ws.mode.value
            worker_modes[m] = worker_modes.get(m, 0) + 1

        return {
            "brand": self.brand,
            "workers_registered": len(self._worker_states),
            "worker_modes": worker_modes,
            "idle_available": len(self.get_idle_workers()),
            "item_windows": len(self.item_windows),
            "tables_registered": len(self.table_registry),
            "exhibits_registered": len(self.exhibit_registry),
            "evidence_packets": len(self._evidence_packets),
            "conflicts": len(self._conflicts),
            "unresolved": len(self._unresolved),
            "completion_tracked": len(self._completion),
            "incomplete": len(self.get_incomplete()),
            "cross_item_facts": sum(len(v) for v in self._cross_item_facts.values()),
            "pending_validations": len(self.get_pending_validations()),
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "brand": self.brand,
            "worker_states": {
                wid: {"mode": ws.mode.value, "primary_complete": ws.primary_complete,
                       "assisting": ws.assisting, "workload": ws.workload_class.value}
                for wid, ws in self._worker_states.items()
            },
            "item_windows": self.item_windows,
            "table_count": len(self.table_registry),
            "exhibit_count": len(self.exhibit_registry),
            "evidence_packets": [ep.to_dict() for ep in self._evidence_packets.values()],
            "conflicts": [c.to_dict() for c in self._conflicts.values()],
            "unresolved": self._unresolved,
            "completion": self._completion,
            "cross_item_facts": {k: len(v) for k, v in self._cross_item_facts.items()},
            "validation_requests": len(self._validation_requests),
            "pending_validations": len(self.get_pending_validations()),
        }
