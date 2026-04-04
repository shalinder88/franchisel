"""
Lease Manager — Source object ownership.

Every important object gets a lease. Only one primary lease per object.
Helpers may attach assist leases. No worker may overwrite another
worker's primary packet. Reconciler sees all versions.

Lease states:
  - unclaimed: no worker has taken responsibility
  - owned_primary: one worker owns it for authoritative extraction
  - owned_assist: a helper is doing sub-work on it
  - released: primary owner finished and released the lease
  - needs_recovery: failed or abandoned — recovery worker should pick up

Rules:
  1. Only one primary lease per object
  2. Helpers may attach assist leases (multiple allowed)
  3. No worker may overwrite another worker's primary packet
  4. Reconciler sees all versions
  5. Primary owner must explicitly release or the lease expires
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set
from enum import Enum


class LeaseState(str, Enum):
    UNCLAIMED = "unclaimed"
    OWNED_PRIMARY = "owned_primary"
    OWNED_ASSIST = "owned_assist"
    RELEASED = "released"
    NEEDS_RECOVERY = "needs_recovery"


@dataclass
class Lease:
    """One lease on a source object."""
    lease_id: str
    object_id: str              # What is leased (table_id, exhibit_code, page range, etc.)
    object_type: str            # "table", "exhibit", "page_cluster", "addendum", "financial_section"
    state: LeaseState = LeaseState.UNCLAIMED
    primary_owner: Optional[str] = None   # Worker ID of primary owner
    assist_workers: List[str] = field(default_factory=list)  # Workers helping
    source_item: Optional[int] = None
    pages: List[int] = field(default_factory=list)
    fact_packet_ids: List[str] = field(default_factory=list)  # Facts produced under this lease
    evidence_packet_ids: List[str] = field(default_factory=list)  # Helper evidence
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "lease_id": self.lease_id,
            "object_id": self.object_id,
            "object_type": self.object_type,
            "state": self.state.value,
            "primary_owner": self.primary_owner,
            "assist_workers": self.assist_workers,
            "source_item": self.source_item,
            "pages": self.pages,
            "fact_count": len(self.fact_packet_ids),
            "evidence_count": len(self.evidence_packet_ids),
        }


class LeaseManager:
    """Manages ownership of all source objects.

    Core invariant: every important object has exactly one primary owner
    or is explicitly unclaimed/needs_recovery.
    """

    def __init__(self):
        self._leases: Dict[str, Lease] = {}
        self._by_owner: Dict[str, Set[str]] = {}    # worker_id → set of lease_ids
        self._by_type: Dict[str, List[str]] = {}     # object_type → list of lease_ids
        self._seq = 0

    def create_lease(self, object_id: str, object_type: str,
                      source_item: Optional[int] = None,
                      pages: Optional[List[int]] = None,
                      metadata: Optional[Dict] = None) -> str:
        """Create a lease for a source object. Starts as unclaimed."""
        # Idempotent — return existing lease if one exists for this object
        for lid, lease in self._leases.items():
            if lease.object_id == object_id:
                return lid

        self._seq += 1
        lid = f"lease_{object_type}_{self._seq}"

        lease = Lease(
            lease_id=lid,
            object_id=object_id,
            object_type=object_type,
            source_item=source_item,
            pages=pages or [],
            metadata=metadata or {},
        )
        self._leases[lid] = lease

        if object_type not in self._by_type:
            self._by_type[object_type] = []
        self._by_type[object_type].append(lid)

        return lid

    def claim_primary(self, lease_id: str, worker_id: str) -> bool:
        """Claim primary ownership. Returns False if already owned by another."""
        lease = self._leases.get(lease_id)
        if not lease:
            return False

        if lease.state == LeaseState.OWNED_PRIMARY and lease.primary_owner != worker_id:
            return False  # Already owned by another

        lease.state = LeaseState.OWNED_PRIMARY
        lease.primary_owner = worker_id

        if worker_id not in self._by_owner:
            self._by_owner[worker_id] = set()
        self._by_owner[worker_id].add(lease_id)

        return True

    def claim_assist(self, lease_id: str, worker_id: str) -> bool:
        """Attach an assist lease. Multiple helpers allowed."""
        lease = self._leases.get(lease_id)
        if not lease:
            return False

        # Can't assist yourself
        if lease.primary_owner == worker_id:
            return False

        if worker_id not in lease.assist_workers:
            lease.assist_workers.append(worker_id)

        if worker_id not in self._by_owner:
            self._by_owner[worker_id] = set()
        self._by_owner[worker_id].add(lease_id)

        return True

    def release(self, lease_id: str, worker_id: str) -> bool:
        """Primary owner releases the lease after finishing."""
        lease = self._leases.get(lease_id)
        if not lease:
            return False
        if lease.primary_owner != worker_id:
            return False  # Only owner can release

        lease.state = LeaseState.RELEASED
        return True

    def mark_needs_recovery(self, lease_id: str, reason: str = ""):
        """Mark a lease as needing recovery (failed or abandoned)."""
        lease = self._leases.get(lease_id)
        if lease:
            lease.state = LeaseState.NEEDS_RECOVERY
            lease.metadata["recovery_reason"] = reason

    def add_fact_to_lease(self, lease_id: str, fact_packet_id: str):
        """Record that a fact was produced under this lease."""
        lease = self._leases.get(lease_id)
        if lease:
            lease.fact_packet_ids.append(fact_packet_id)

    def add_evidence_to_lease(self, lease_id: str, evidence_packet_id: str):
        """Record helper evidence submitted under this lease."""
        lease = self._leases.get(lease_id)
        if lease:
            lease.evidence_packet_ids.append(evidence_packet_id)

    # ── Queries ──

    def get_lease(self, lease_id: str) -> Optional[Lease]:
        return self._leases.get(lease_id)

    def get_lease_by_object(self, object_id: str) -> Optional[Lease]:
        for lease in self._leases.values():
            if lease.object_id == object_id:
                return lease
        return None

    def get_unclaimed(self) -> List[Lease]:
        return [l for l in self._leases.values()
                if l.state == LeaseState.UNCLAIMED]

    def get_needs_recovery(self) -> List[Lease]:
        return [l for l in self._leases.values()
                if l.state == LeaseState.NEEDS_RECOVERY]

    def get_owned_by(self, worker_id: str) -> List[Lease]:
        """Get all leases where this worker is primary owner."""
        return [self._leases[lid] for lid in self._by_owner.get(worker_id, set())
                if lid in self._leases and self._leases[lid].primary_owner == worker_id]

    def get_by_type(self, object_type: str) -> List[Lease]:
        ids = self._by_type.get(object_type, [])
        return [self._leases[lid] for lid in ids if lid in self._leases]

    def is_owned(self, object_id: str) -> bool:
        """Check if an object has a primary owner."""
        lease = self.get_lease_by_object(object_id)
        return lease is not None and lease.state == LeaseState.OWNED_PRIMARY

    def get_primary_owner(self, object_id: str) -> Optional[str]:
        """Get the primary owner of an object."""
        lease = self.get_lease_by_object(object_id)
        if lease and lease.state == LeaseState.OWNED_PRIMARY:
            return lease.primary_owner
        return None

    def validate_no_orphans(self) -> Dict[str, Any]:
        """Check that no important object is unowned."""
        orphans = [l for l in self._leases.values()
                   if l.state == LeaseState.UNCLAIMED]
        abandoned = [l for l in self._leases.values()
                     if l.state == LeaseState.NEEDS_RECOVERY]

        return {
            "all_owned": len(orphans) == 0 and len(abandoned) == 0,
            "orphan_count": len(orphans),
            "abandoned_count": len(abandoned),
            "orphans": [l.to_dict() for l in orphans],
            "abandoned": [l.to_dict() for l in abandoned],
        }

    def summary(self) -> Dict[str, Any]:
        by_state = {}
        by_type = {}
        for l in self._leases.values():
            s = l.state.value
            by_state[s] = by_state.get(s, 0) + 1
            t = l.object_type
            by_type[t] = by_type.get(t, 0) + 1

        return {
            "total_leases": len(self._leases),
            "by_state": by_state,
            "by_type": by_type,
            "owners_active": len(self._by_owner),
        }

    def to_dict(self) -> Dict[str, Dict]:
        return {lid: l.to_dict() for lid, l in self._leases.items()}
