"""
Exhibit Tracker

Tracks the lifecycle of every exhibit throughout the extraction run:
  - Scheduled: known from exhibit list/TOC
  - Triggered: referenced by an item during reading
  - Found: located in the PDF
  - Parsed: content extracted
  - Missing: referenced but never found
  - Blocked: PII-blocked (franchisee lists, receipts)

The tracker is the extractor's exhibit memory. After Item 23,
it drives the exhibit hunt to find everything still missing.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Set


@dataclass
class ExhibitEntry:
    """One exhibit tracked through the extraction run."""
    code: str
    description: str = ""
    role: str = "other"
    # Lifecycle states
    scheduled: bool = False  # known from exhibit list
    triggered_by: List[int] = field(default_factory=list)  # which items referenced it
    trigger_pages: List[int] = field(default_factory=list)
    found: bool = False
    found_page: int = 0
    parsed: bool = False
    blocked: bool = False  # PII-blocked
    missing: bool = False
    # Priority
    priority: str = "normal"  # critical / normal / low
    hard_priority: bool = False  # must parse before publish


class ExhibitTracker:
    """Tracks all exhibits throughout the extraction run."""

    def __init__(self):
        self.exhibits: Dict[str, ExhibitEntry] = {}

    def schedule(self, code: str, description: str = "", role: str = "other"):
        """Register an exhibit from the exhibit list/TOC."""
        if code not in self.exhibits:
            self.exhibits[code] = ExhibitEntry(code=code, description=description, role=role)
        self.exhibits[code].scheduled = True
        # Set priority based on role
        if role in ("financials", "franchise_agreement", "state_addenda_fdd"):
            self.exhibits[code].priority = "critical"
            self.exhibits[code].hard_priority = True

    def trigger(self, code: str, from_item: int, from_page: int = 0):
        """Record that an item referenced this exhibit."""
        if code not in self.exhibits:
            self.exhibits[code] = ExhibitEntry(code=code)
        entry = self.exhibits[code]
        if from_item not in entry.triggered_by:
            entry.triggered_by.append(from_item)
        if from_page:
            entry.trigger_pages.append(from_page)
        # Items 19, 20, 21 trigger hard priority
        if from_item in (19, 20, 21):
            entry.hard_priority = True
            entry.priority = "critical"

    def mark_found(self, code: str, page: int):
        """Record that the exhibit was located in the PDF."""
        if code not in self.exhibits:
            self.exhibits[code] = ExhibitEntry(code=code)
        self.exhibits[code].found = True
        self.exhibits[code].found_page = page

    def mark_parsed(self, code: str):
        """Record that the exhibit content was extracted."""
        if code in self.exhibits:
            self.exhibits[code].parsed = True

    def mark_blocked(self, code: str):
        """Record that the exhibit is PII-blocked."""
        if code in self.exhibits:
            self.exhibits[code].blocked = True

    def missing_exhibits(self) -> List[ExhibitEntry]:
        """Get exhibits that were scheduled or triggered but never found."""
        return [e for e in self.exhibits.values()
                if (e.scheduled or e.triggered_by) and not e.found and not e.blocked]

    def unparsed_exhibits(self) -> List[ExhibitEntry]:
        """Get exhibits that were found but not parsed."""
        return [e for e in self.exhibits.values()
                if e.found and not e.parsed and not e.blocked]

    def hard_priority_unparsed(self) -> List[ExhibitEntry]:
        """Get hard-priority exhibits that haven't been parsed yet."""
        return [e for e in self.exhibits.values()
                if e.hard_priority and not e.parsed and not e.blocked]

    def hunt_list(self) -> List[ExhibitEntry]:
        """Get the list of exhibits to hunt for after Item 23.
        Ordered by priority."""
        to_hunt = [e for e in self.exhibits.values()
                   if not e.parsed and not e.blocked and (e.scheduled or e.triggered_by)]
        return sorted(to_hunt, key=lambda e: (0 if e.hard_priority else 1, e.code))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total": len(self.exhibits),
            "scheduled": sum(1 for e in self.exhibits.values() if e.scheduled),
            "triggered": sum(1 for e in self.exhibits.values() if e.triggered_by),
            "found": sum(1 for e in self.exhibits.values() if e.found),
            "parsed": sum(1 for e in self.exhibits.values() if e.parsed),
            "blocked": sum(1 for e in self.exhibits.values() if e.blocked),
            "missing": len(self.missing_exhibits()),
            "unparsed_critical": [e.code for e in self.hard_priority_unparsed()],
            "entries": {code: {
                "description": e.description, "role": e.role,
                "scheduled": e.scheduled, "triggered_by": e.triggered_by,
                "found": e.found, "parsed": e.parsed, "blocked": e.blocked,
                "priority": e.priority,
            } for code, e in self.exhibits.items()},
        }
