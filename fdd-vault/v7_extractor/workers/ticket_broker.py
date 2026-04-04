"""
Ticket Broker — Structured help requests between workers.

Fast workers help heavy workers via tickets, NOT by self-assigning.
No freeform agent-to-agent dialogue.

Ticket types:
  - parse_continued_table
  - read_table_notes
  - validate_totals
  - parse_addendum_override
  - classify_exhibit
  - extract_outlet_rows
  - extract_financial_statement_section
  - check_cross_item_conflict
  - recover_missing_page_span

Flow:
  1. Heavy worker creates a ticket (help request)
  2. Master assigns idle worker to the ticket
  3. Helper does the sub-work, submits evidence packet to blackboard
  4. Primary owner reviews and optionally incorporates
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from enum import Enum


class TicketType(str, Enum):
    PARSE_CONTINUED_TABLE = "parse_continued_table"
    READ_TABLE_NOTES = "read_table_notes"
    VALIDATE_TOTALS = "validate_totals"
    PARSE_ADDENDUM_OVERRIDE = "parse_addendum_override"
    CLASSIFY_EXHIBIT = "classify_exhibit"
    EXTRACT_OUTLET_ROWS = "extract_outlet_rows"
    EXTRACT_FINANCIAL_SECTION = "extract_financial_statement_section"
    CHECK_CROSS_ITEM_CONFLICT = "check_cross_item_conflict"
    RECOVER_MISSING_PAGE_SPAN = "recover_missing_page_span"
    EXTRACT_FRANCHISEE_LIST = "extract_franchisee_list"
    VALIDATE_NOTE_ALIGNMENT = "validate_note_alignment"
    COMPARE_AGREEMENT_ADDENDUM = "compare_agreement_addendum"
    EXTRACT_STATE_ROWS = "extract_state_rows"
    VALIDATE_ARITHMETIC = "validate_arithmetic"
    CLASSIFY_CLAUSE = "classify_clause"


class TicketPriority(str, Enum):
    CRITICAL = "critical"   # Blocking final truth
    HIGH = "high"           # Important for quality
    NORMAL = "normal"       # Standard help
    LOW = "low"             # Nice to have


class TicketState(str, Enum):
    OPEN = "open"               # Created, awaiting assignment
    ASSIGNED = "assigned"       # Worker assigned
    IN_PROGRESS = "in_progress" # Worker is working on it
    COMPLETED = "completed"     # Evidence submitted
    REVIEWED = "reviewed"       # Primary owner reviewed result
    CANCELLED = "cancelled"     # No longer needed


@dataclass
class Ticket:
    """A structured help request from a heavy worker."""
    ticket_id: str
    ticket_type: TicketType
    created_by: str             # Worker that needs help
    priority: TicketPriority = TicketPriority.NORMAL
    state: TicketState = TicketState.OPEN
    assigned_to: Optional[str] = None
    source_item: Optional[int] = None
    source_pages: List[int] = field(default_factory=list)
    source_table_id: Optional[str] = None
    source_exhibit: Optional[str] = None
    description: str = ""
    context: Dict[str, Any] = field(default_factory=dict)
    evidence_packet_id: Optional[str] = None  # Result from helper
    result: Optional[Dict] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "ticket_id": self.ticket_id,
            "type": self.ticket_type.value,
            "created_by": self.created_by,
            "priority": self.priority.value,
            "state": self.state.value,
            "assigned_to": self.assigned_to,
            "source_item": self.source_item,
            "source_pages": self.source_pages,
            "description": self.description[:200],
            "evidence_packet_id": self.evidence_packet_id,
        }


class TicketBroker:
    """Manages the ticket queue for structured inter-worker help."""

    def __init__(self):
        self._tickets: Dict[str, Ticket] = {}
        self._by_creator: Dict[str, List[str]] = {}
        self._by_assignee: Dict[str, List[str]] = {}
        self._seq = 0

    def create_ticket(self, ticket_type: TicketType,
                       created_by: str,
                       priority: TicketPriority = TicketPriority.NORMAL,
                       source_item: Optional[int] = None,
                       source_pages: Optional[List[int]] = None,
                       source_table_id: Optional[str] = None,
                       source_exhibit: Optional[str] = None,
                       description: str = "",
                       context: Optional[Dict] = None) -> str:
        """Create a help ticket. Returns ticket_id."""
        self._seq += 1
        tid = f"ticket_{ticket_type.value}_{self._seq}"

        ticket = Ticket(
            ticket_id=tid,
            ticket_type=ticket_type,
            created_by=created_by,
            priority=priority,
            source_item=source_item,
            source_pages=source_pages or [],
            source_table_id=source_table_id,
            source_exhibit=source_exhibit,
            description=description,
            context=context or {},
        )
        self._tickets[tid] = ticket

        if created_by not in self._by_creator:
            self._by_creator[created_by] = []
        self._by_creator[created_by].append(tid)

        return tid

    def assign_ticket(self, ticket_id: str, worker_id: str) -> bool:
        """Assign a ticket to an idle worker."""
        ticket = self._tickets.get(ticket_id)
        if not ticket:
            return False
        if ticket.state != TicketState.OPEN:
            return False

        ticket.assigned_to = worker_id
        ticket.state = TicketState.ASSIGNED

        if worker_id not in self._by_assignee:
            self._by_assignee[worker_id] = []
        self._by_assignee[worker_id].append(ticket_id)

        return True

    def start_ticket(self, ticket_id: str, worker_id: str) -> bool:
        """Mark ticket as in progress."""
        ticket = self._tickets.get(ticket_id)
        if not ticket or ticket.assigned_to != worker_id:
            return False
        ticket.state = TicketState.IN_PROGRESS
        return True

    def complete_ticket(self, ticket_id: str, worker_id: str,
                         evidence_packet_id: Optional[str] = None,
                         result: Optional[Dict] = None) -> bool:
        """Complete a ticket with results."""
        ticket = self._tickets.get(ticket_id)
        if not ticket or ticket.assigned_to != worker_id:
            return False

        ticket.state = TicketState.COMPLETED
        ticket.evidence_packet_id = evidence_packet_id
        ticket.result = result
        return True

    def mark_reviewed(self, ticket_id: str):
        """Primary owner marks the ticket result as reviewed."""
        ticket = self._tickets.get(ticket_id)
        if ticket and ticket.state == TicketState.COMPLETED:
            ticket.state = TicketState.REVIEWED

    def cancel_ticket(self, ticket_id: str):
        ticket = self._tickets.get(ticket_id)
        if ticket and ticket.state in (TicketState.OPEN, TicketState.ASSIGNED):
            ticket.state = TicketState.CANCELLED

    # ── Queries ──

    def get_open_tickets(self) -> List[Ticket]:
        """Tickets waiting for assignment."""
        return [t for t in self._tickets.values()
                if t.state == TicketState.OPEN]

    def get_open_by_priority(self) -> List[Ticket]:
        """Open tickets sorted by priority (critical first)."""
        priority_order = {
            TicketPriority.CRITICAL: 0,
            TicketPriority.HIGH: 1,
            TicketPriority.NORMAL: 2,
            TicketPriority.LOW: 3,
        }
        open_tickets = self.get_open_tickets()
        return sorted(open_tickets, key=lambda t: priority_order.get(t.priority, 9))

    def get_tickets_by_creator(self, worker_id: str) -> List[Ticket]:
        ids = self._by_creator.get(worker_id, [])
        return [self._tickets[tid] for tid in ids if tid in self._tickets]

    def get_tickets_for_assignee(self, worker_id: str) -> List[Ticket]:
        ids = self._by_assignee.get(worker_id, [])
        return [self._tickets[tid] for tid in ids if tid in self._tickets]

    def get_incomplete_tickets(self) -> List[Ticket]:
        return [t for t in self._tickets.values()
                if t.state in (TicketState.OPEN, TicketState.ASSIGNED,
                               TicketState.IN_PROGRESS)]

    def auto_assign(self, idle_workers: List[str]) -> List[Dict]:
        """Auto-assign open tickets to idle workers.

        Returns list of assignments made.
        """
        assignments = []
        open_tickets = self.get_open_by_priority()

        available = list(idle_workers)  # Copy — we pop as we assign

        for ticket in open_tickets:
            if not available:
                break

            # Pick the first available worker
            # Could be smarter (match by expertise) but simple is correct first
            worker = available.pop(0)
            if self.assign_ticket(ticket.ticket_id, worker):
                assignments.append({
                    "ticket_id": ticket.ticket_id,
                    "type": ticket.ticket_type.value,
                    "assigned_to": worker,
                    "created_by": ticket.created_by,
                    "priority": ticket.priority.value,
                })

        return assignments

    def summary(self) -> Dict[str, Any]:
        by_state = {}
        by_type = {}
        by_priority = {}
        for t in self._tickets.values():
            s = t.state.value
            by_state[s] = by_state.get(s, 0) + 1
            tp = t.ticket_type.value
            by_type[tp] = by_type.get(tp, 0) + 1
            p = t.priority.value
            by_priority[p] = by_priority.get(p, 0) + 1

        return {
            "total_tickets": len(self._tickets),
            "by_state": by_state,
            "by_type": by_type,
            "by_priority": by_priority,
            "open": len(self.get_open_tickets()),
            "incomplete": len(self.get_incomplete_tickets()),
        }

    def to_dict(self) -> Dict[str, Dict]:
        return {tid: t.to_dict() for tid, t in self._tickets.items()}
