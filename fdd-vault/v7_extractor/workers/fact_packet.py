"""
Fact Packet Schema — Uniform emission format for all 32 workers.

Every worker emits FactPackets. This is the atom of the extraction system.
No worker may emit raw dicts or untyped data. If it discovered something,
it wraps it in a FactPacket with full provenance.

Non-negotiable: every worker uses this shape. No exceptions.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from enum import Enum


class SourceZone(str, Enum):
    """Where in the FDD the fact came from."""
    ITEM = "item"
    TABLE = "table"
    EXHIBIT = "exhibit"
    FRONT_MATTER = "front_matter"
    ADDENDUM = "addendum"
    FINANCIAL_STATEMENT = "financial_statement"
    FRANCHISEE_LIST = "franchisee_list"


class ObjectType(str, Enum):
    """What kind of object this fact describes."""
    SCALAR = "scalar"               # Single value (fee amount, rate, year)
    TABLE_ROW = "table_row"         # One row from a parsed table
    TABLE_FULL = "table_full"       # Entire parsed table
    LIST_ITEM = "list_item"         # One item from a list
    AGREEMENT_CLAUSE = "agreement_clause"  # Clause from an agreement
    FINANCIAL_LINE = "financial_line"      # Line from financial statement
    CASE_RECORD = "case_record"     # Litigation case
    OUTLET_RECORD = "outlet_record" # Outlet history row
    ENTITY_RECORD = "entity_record" # Entity/affiliate info
    TERRITORY_SPEC = "territory_spec"     # Territory specification
    FEE_SPEC = "fee_spec"           # Fee specification
    INVESTMENT_LINE = "investment_line"    # Investment table row
    TRAINING_SPEC = "training_spec" # Training program detail
    CONTRACT_SPEC = "contract_spec" # Contract term/condition
    OVERRIDE = "override"           # State addendum override
    COMPOSITE = "composite"         # Multi-field structured object


class Importance(str, Enum):
    """How important is this fact for buyer decision-making."""
    CORE = "core"           # Must-have for any buyer report
    SECONDARY = "secondary" # Important for diligence depth
    CONTEXT = "context"     # Nice to have, not decision-driving


class ConsumptionState(str, Enum):
    """Where this fact is in the pipeline."""
    EMITTED = "emitted"                 # Worker produced it
    VALIDATED = "validated"             # Passed sanity checks
    USED_BY_LANE_A = "used_by_lane_A"  # Lane A synthesizer consumed it
    USED_BY_LANE_B = "used_by_lane_B"  # Lane B normalizer consumed it
    USED_BY_BOTH = "used_by_both"      # Both lanes consumed it
    RECONCILED = "reconciled"           # Reconciler confirmed it
    CONFLICT = "conflict"               # Reconciler found disagreement
    REJECTED = "rejected"               # Failed validation or sanity
    SUPERSEDED = "superseded"           # Replaced by higher-precedence fact


@dataclass
class FactPacket:
    """The universal emission unit for all 32 workers.

    Every fact discovered by any worker MUST be wrapped in this packet.
    No raw dicts. No untyped discoveries. This is the law.
    """
    # ── Identity ──
    brand: str
    object_id: str                      # Unique ID: "{worker_id}_{source_item}_{seq}"

    # ── Source tracking ──
    source_zone: SourceZone
    source_item: Optional[int] = None   # FDD item number (1-23) or None
    source_pages: List[int] = field(default_factory=list)
    source_exhibit: Optional[str] = None
    source_table_id: Optional[str] = None

    # ── What was found ──
    object_type: ObjectType = ObjectType.SCALAR
    family: str = ""                    # economics, control, risk, performance, identity, document
    fact_type: str = ""                 # Specific type from fact ontology
    fact_payload: Dict[str, Any] = field(default_factory=dict)
    raw_evidence: str = ""              # The actual text that supports this fact

    # ── Quality ──
    importance: Importance = Importance.SECONDARY
    confidence: float = 0.0             # 0.0 to 1.0
    needs_review: bool = False
    review_reason: str = ""

    # ── Pipeline state ──
    consumption_state: ConsumptionState = ConsumptionState.EMITTED
    used_by_lane_A: bool = False
    used_by_lane_B: bool = False
    emitted_by: str = ""                # Worker ID that produced this

    # ── Conflict tracking ──
    superseded_by: Optional[str] = None # object_id of the fact that replaced this
    conflicts_with: List[str] = field(default_factory=list)

    def mark_used_by_A(self):
        self.used_by_lane_A = True
        self._update_consumption()

    def mark_used_by_B(self):
        self.used_by_lane_B = True
        self._update_consumption()

    def mark_reconciled(self):
        self.consumption_state = ConsumptionState.RECONCILED

    def mark_conflict(self, conflicting_ids: List[str]):
        self.consumption_state = ConsumptionState.CONFLICT
        self.conflicts_with = conflicting_ids

    def mark_rejected(self, reason: str):
        self.consumption_state = ConsumptionState.REJECTED
        self.review_reason = reason

    def mark_superseded(self, by_id: str):
        self.consumption_state = ConsumptionState.SUPERSEDED
        self.superseded_by = by_id

    def _update_consumption(self):
        if self.consumption_state in (ConsumptionState.CONFLICT,
                                       ConsumptionState.REJECTED,
                                       ConsumptionState.SUPERSEDED):
            return
        if self.used_by_lane_A and self.used_by_lane_B:
            self.consumption_state = ConsumptionState.USED_BY_BOTH
        elif self.used_by_lane_A:
            self.consumption_state = ConsumptionState.USED_BY_LANE_A
        elif self.used_by_lane_B:
            self.consumption_state = ConsumptionState.USED_BY_LANE_B

    def to_dict(self) -> Dict[str, Any]:
        return {
            "brand": self.brand,
            "object_id": self.object_id,
            "source_zone": self.source_zone.value,
            "source_item": self.source_item,
            "source_pages": self.source_pages,
            "source_exhibit": self.source_exhibit,
            "source_table_id": self.source_table_id,
            "object_type": self.object_type.value,
            "family": self.family,
            "fact_type": self.fact_type,
            "fact_payload": self.fact_payload,
            "raw_evidence": self.raw_evidence[:500],  # Cap for serialization
            "importance": self.importance.value,
            "confidence": self.confidence,
            "needs_review": self.needs_review,
            "review_reason": self.review_reason,
            "consumption_state": self.consumption_state.value,
            "used_by_lane_A": self.used_by_lane_A,
            "used_by_lane_B": self.used_by_lane_B,
            "emitted_by": self.emitted_by,
            "superseded_by": self.superseded_by,
            "conflicts_with": self.conflicts_with,
        }


class FactPacketStore:
    """Collects all fact packets from all workers.

    This is the central fact repository. Workers emit into it.
    Lane A, Lane B, and the reconciler read from it.
    """

    def __init__(self):
        self._packets: Dict[str, FactPacket] = {}
        self._by_worker: Dict[str, List[str]] = {}
        self._by_item: Dict[int, List[str]] = {}
        self._by_family: Dict[str, List[str]] = {}
        self._seq = 0

    def emit(self, packet: FactPacket) -> str:
        """Store a fact packet. Returns its object_id."""
        if not packet.object_id:
            self._seq += 1
            packet.object_id = f"{packet.emitted_by}_{packet.source_item or 'x'}_{self._seq}"

        self._packets[packet.object_id] = packet

        # Index by worker
        if packet.emitted_by not in self._by_worker:
            self._by_worker[packet.emitted_by] = []
        self._by_worker[packet.emitted_by].append(packet.object_id)

        # Index by item
        if packet.source_item is not None:
            if packet.source_item not in self._by_item:
                self._by_item[packet.source_item] = []
            self._by_item[packet.source_item].append(packet.object_id)

        # Index by family
        if packet.family:
            if packet.family not in self._by_family:
                self._by_family[packet.family] = []
            self._by_family[packet.family].append(packet.object_id)

        return packet.object_id

    def get(self, object_id: str) -> Optional[FactPacket]:
        return self._packets.get(object_id)

    def get_by_worker(self, worker_id: str) -> List[FactPacket]:
        ids = self._by_worker.get(worker_id, [])
        return [self._packets[oid] for oid in ids if oid in self._packets]

    def get_by_item(self, item_num: int) -> List[FactPacket]:
        ids = self._by_item.get(item_num, [])
        return [self._packets[oid] for oid in ids if oid in self._packets]

    def get_by_family(self, family: str) -> List[FactPacket]:
        ids = self._by_family.get(family, [])
        return [self._packets[oid] for oid in ids if oid in self._packets]

    def get_active(self) -> List[FactPacket]:
        """All packets not rejected or superseded."""
        return [p for p in self._packets.values()
                if p.consumption_state not in (ConsumptionState.REJECTED,
                                                ConsumptionState.SUPERSEDED)]

    def get_unconsumed(self) -> List[FactPacket]:
        """Packets still in EMITTED or VALIDATED state."""
        return [p for p in self._packets.values()
                if p.consumption_state in (ConsumptionState.EMITTED,
                                            ConsumptionState.VALIDATED)]

    def get_conflicts(self) -> List[FactPacket]:
        return [p for p in self._packets.values()
                if p.consumption_state == ConsumptionState.CONFLICT]

    def summary(self) -> Dict[str, Any]:
        by_state = {}
        by_importance = {}
        by_zone = {}
        for p in self._packets.values():
            s = p.consumption_state.value
            by_state[s] = by_state.get(s, 0) + 1
            i = p.importance.value
            by_importance[i] = by_importance.get(i, 0) + 1
            z = p.source_zone.value
            by_zone[z] = by_zone.get(z, 0) + 1

        return {
            "total_packets": len(self._packets),
            "by_state": by_state,
            "by_importance": by_importance,
            "by_zone": by_zone,
            "workers_reporting": len(self._by_worker),
            "items_covered": sorted(self._by_item.keys()),
            "families_covered": sorted(self._by_family.keys()),
            "unconsumed_count": len(self.get_unconsumed()),
            "conflict_count": len(self.get_conflicts()),
        }

    def to_list(self) -> List[Dict]:
        return [p.to_dict() for p in self._packets.values()]
