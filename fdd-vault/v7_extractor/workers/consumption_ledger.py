"""
Consumption Ledger — Refined version with full object accountability.

Every required object must end in one of:
  - located_not_parsed
  - parsed_not_used
  - used_by_item
  - used_by_table
  - used_by_exhibit
  - used_by_A
  - used_by_B
  - used_by_multiple
  - needs_review
  - missing

No silent skip. This is mandatory.

Required objects:
  - cover, special risks, TOC, exhibit list
  - all tables in Items 5-8, 19-21
  - current/former franchisee list exhibits
  - financial statement exhibits
  - state addenda
  - franchise/development agreements
  - guaranties, lease riders
  - ACH/payment agreements
  - software/technology agreements
  - manual TOCs
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from enum import Enum


class ConsumptionState(str, Enum):
    """Every required object must end in one of these."""
    LOCATED_NOT_PARSED = "located_not_parsed"
    PARSED_NOT_USED = "parsed_not_used"
    USED_BY_ITEM = "used_by_item"
    USED_BY_TABLE = "used_by_table"
    USED_BY_EXHIBIT = "used_by_exhibit"
    USED_BY_A = "used_by_A"
    USED_BY_B = "used_by_B"
    USED_BY_MULTIPLE = "used_by_multiple"
    NEEDS_REVIEW = "needs_review"
    MISSING = "missing"
    PII_BLOCKED = "pii_blocked"


@dataclass
class ConsumptionEntry:
    """One required object being tracked."""
    object_id: str
    object_type: str            # table, exhibit, page, agreement, addendum, list
    required: bool = True       # Is this a required object?
    critical: bool = False      # Does missing this block publish?
    state: ConsumptionState = ConsumptionState.MISSING
    source_item: Optional[int] = None
    pages: List[int] = field(default_factory=list)
    located: bool = False
    parsed: bool = False
    used_by: List[str] = field(default_factory=list)  # Which workers/lanes consumed it
    lease_id: Optional[str] = None
    detail: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "object_id": self.object_id,
            "object_type": self.object_type,
            "required": self.required,
            "critical": self.critical,
            "state": self.state.value,
            "source_item": self.source_item,
            "pages": self.pages,
            "located": self.located,
            "parsed": self.parsed,
            "used_by": self.used_by,
            "detail": self.detail,
        }


class ConsumptionLedger:
    """Tracks every required object through the full pipeline.

    No silent skip allowed. Every object must reach a terminal state.
    """

    def __init__(self):
        self._entries: Dict[str, ConsumptionEntry] = {}

    def require(self, object_id: str, object_type: str,
                critical: bool = False,
                source_item: Optional[int] = None,
                pages: Optional[List[int]] = None):
        """Register a required object."""
        self._entries[object_id] = ConsumptionEntry(
            object_id=object_id,
            object_type=object_type,
            critical=critical,
            source_item=source_item,
            pages=pages or [],
        )

    def mark_located(self, object_id: str, pages: Optional[List[int]] = None):
        e = self._entries.get(object_id)
        if e:
            e.located = True
            if pages:
                e.pages = pages
            self._update_state(object_id)

    def mark_parsed(self, object_id: str):
        e = self._entries.get(object_id)
        if e:
            e.parsed = True
            self._update_state(object_id)

    def mark_used_by(self, object_id: str, consumer: str):
        """Mark object as consumed by a specific worker or lane."""
        e = self._entries.get(object_id)
        if e:
            if consumer not in e.used_by:
                e.used_by.append(consumer)
            self._update_state(object_id)

    def mark_pii_blocked(self, object_id: str):
        e = self._entries.get(object_id)
        if e:
            e.state = ConsumptionState.PII_BLOCKED

    def mark_needs_review(self, object_id: str, detail: str = ""):
        e = self._entries.get(object_id)
        if e:
            e.state = ConsumptionState.NEEDS_REVIEW
            e.detail = detail

    def _update_state(self, object_id: str):
        e = self._entries.get(object_id)
        if not e:
            return
        if e.state == ConsumptionState.PII_BLOCKED:
            return

        if not e.located:
            e.state = ConsumptionState.MISSING
        elif not e.parsed:
            e.state = ConsumptionState.LOCATED_NOT_PARSED
        elif not e.used_by:
            e.state = ConsumptionState.PARSED_NOT_USED
        elif len(e.used_by) > 1:
            e.state = ConsumptionState.USED_BY_MULTIPLE
        else:
            consumer = e.used_by[0]
            if consumer.startswith("item_"):
                e.state = ConsumptionState.USED_BY_ITEM
            elif consumer == "table_extractor":
                e.state = ConsumptionState.USED_BY_TABLE
            elif consumer == "exhibit_extractor":
                e.state = ConsumptionState.USED_BY_EXHIBIT
            elif consumer == "lane_a_synthesizer":
                e.state = ConsumptionState.USED_BY_A
            elif consumer == "lane_b_normalizer":
                e.state = ConsumptionState.USED_BY_B
            else:
                e.state = ConsumptionState.USED_BY_ITEM

    # ── Bulk registration for common FDD objects ──

    def register_standard_requirements(self, exhibit_codes: List[str],
                                         item_windows: Dict[int, Dict]):
        """Register all standard required objects for an FDD."""

        # Front matter
        for fm in ["cover", "special_risks", "toc", "exhibit_list"]:
            self.require(fm, "front_matter", critical=True)

        # Tables in critical items
        CRITICAL_TABLE_ITEMS = [5, 6, 7, 8, 19, 20, 21]
        for item_num in CRITICAL_TABLE_ITEMS:
            self.require(
                f"item_{item_num}_tables", "table",
                critical=True, source_item=item_num,
            )

        # All items as narrative
        for item_num in range(1, 24):
            self.require(
                f"item_{item_num}_narrative", "item",
                critical=item_num in {5, 6, 7, 8, 17, 19, 20, 21},
                source_item=item_num,
            )

        # All exhibits
        for code in exhibit_codes:
            self.require(f"exhibit_{code}", "exhibit", critical=True)

    # ── Queries ──

    def get_missing(self) -> List[ConsumptionEntry]:
        return [e for e in self._entries.values()
                if e.state == ConsumptionState.MISSING]

    def get_critical_missing(self) -> List[ConsumptionEntry]:
        return [e for e in self._entries.values()
                if e.state == ConsumptionState.MISSING and e.critical]

    def get_unconsumed(self) -> List[ConsumptionEntry]:
        terminal = {ConsumptionState.USED_BY_ITEM, ConsumptionState.USED_BY_TABLE,
                     ConsumptionState.USED_BY_EXHIBIT, ConsumptionState.USED_BY_A,
                     ConsumptionState.USED_BY_B, ConsumptionState.USED_BY_MULTIPLE,
                     ConsumptionState.PII_BLOCKED}
        return [e for e in self._entries.values()
                if e.state not in terminal]

    def get_publish_blockers(self) -> List[ConsumptionEntry]:
        """Critical objects that are missing or not parsed."""
        return [e for e in self._entries.values()
                if e.critical and e.state in (ConsumptionState.MISSING,
                                               ConsumptionState.LOCATED_NOT_PARSED)]

    def validate_no_silent_skip(self) -> Dict[str, Any]:
        """Verify every required object reached a terminal state.

        Fix 7: Split violations into real categories:
          - not_loaded: source never appeared in the context
          - loaded_not_assigned: source present but no worker claimed it
          - assigned_not_parsed: worker claimed but never parsed
          - parsed_not_used: parsed but no lane consumed the output
          - missing_expected: expected by checklist but never found
        """
        violations = []
        by_category = {
            "not_loaded": 0,
            "loaded_not_assigned": 0,
            "assigned_not_parsed": 0,
            "parsed_not_used": 0,
            "missing_expected": 0,
        }

        for e in self._entries.values():
            if not e.required:
                continue

            category = None
            if e.state == ConsumptionState.MISSING:
                if not e.located:
                    category = "not_loaded"
                else:
                    category = "missing_expected"
            elif e.state == ConsumptionState.LOCATED_NOT_PARSED:
                if e.located and not e.parsed:
                    category = "assigned_not_parsed" if e.used_by else "loaded_not_assigned"
                else:
                    category = "loaded_not_assigned"
            elif e.state == ConsumptionState.PARSED_NOT_USED:
                category = "parsed_not_used"

            if category:
                by_category[category] += 1
                violations.append({
                    "object_id": e.object_id,
                    "type": e.object_type,
                    "state": e.state.value,
                    "category": category,
                    "critical": e.critical,
                })

        return {
            "all_consumed": len(violations) == 0,
            "violation_count": len(violations),
            "by_category": by_category,
            "violations": violations,
        }

    def summary(self) -> Dict[str, Any]:
        by_state = {}
        for e in self._entries.values():
            s = e.state.value
            by_state[s] = by_state.get(s, 0) + 1

        return {
            "total_tracked": len(self._entries),
            "by_state": by_state,
            "missing_count": len(self.get_missing()),
            "critical_missing": len(self.get_critical_missing()),
            "unconsumed": len(self.get_unconsumed()),
            "publish_blockers": len(self.get_publish_blockers()),
            "no_silent_skip": self.validate_no_silent_skip()["all_consumed"],
        }

    def to_dict(self) -> Dict[str, Dict]:
        return {oid: e.to_dict() for oid, e in self._entries.items()}
