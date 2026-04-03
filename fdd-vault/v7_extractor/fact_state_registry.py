"""
Fact State Registry — Per-Fact Uncertainty Tracking

Every extracted fact ends in one of these states:
  direct           — table cell, explicit clause, direct narrative statement
  direct_with_note — direct value modified by a linked footnote
  derived          — computed from other facts (e.g., total = franchised + company)
  conflicting      — multiple sources disagree
  suspected_wrong  — sanity check failed but value exists
  unknown          — expected but not found despite trying
  not_applicable   — item/field doesn't apply to this brand/archetype
  abstain          — evidence exists but is ambiguous; extractor refuses to choose

This is the layer that prevents fake precision.
A field without a fact_state is a silent lie.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum


class FactState(str, Enum):
    DIRECT = "direct"
    DIRECT_WITH_NOTE = "direct_with_note"
    DERIVED = "derived"
    CONFLICTING = "conflicting"
    SUSPECTED_WRONG = "suspected_wrong"
    UNKNOWN = "unknown"
    NOT_APPLICABLE = "not_applicable"
    ABSTAIN = "abstain"


@dataclass
class FactCandidate:
    """One candidate value for a fact, from one source."""
    value: Any
    source_type: str       # "table_cell", "narrative_clause", "exhibit_clause", "cover_page", "state_addendum", "derived", "note_modified"
    source_page: Optional[int] = None
    source_item: Optional[int] = None
    source_exhibit: Optional[str] = None
    source_table_id: Optional[str] = None
    confidence: float = 0.5
    note_dependency: Optional[str] = None  # linked footnote that modifies value


@dataclass
class FactRecord:
    """The full story of one extracted fact."""
    field_name: str
    state: FactState = FactState.UNKNOWN
    winning_value: Any = None
    winning_source: Optional[FactCandidate] = None
    losing_candidates: List[FactCandidate] = field(default_factory=list)
    resolution_reason: str = ""
    changed_after_recheck: bool = False
    sanity_check_passed: bool = True
    sanity_detail: str = ""


class FactStateRegistry:
    """Tracks fact-level state for every important field.

    Usage:
        registry = FactStateRegistry()
        registry.register_candidate("royaltyRate", value="5%", source_type="table_cell", ...)
        registry.register_candidate("royaltyRate", value="6%", source_type="state_addendum", ...)
        registry.resolve_all()
        record = registry.get("royaltyRate")
        # record.state = DIRECT, record.winning_value = "6%" (state addendum wins)
    """

    # Source precedence order (highest to lowest)
    SOURCE_PRECEDENCE = [
        "state_addendum",
        "exhibit_clause",
        "table_cell",
        "note_modified",
        "narrative_clause",
        "cover_page",
        "derived",
        "weak_inference",
    ]

    def __init__(self):
        self._candidates: Dict[str, List[FactCandidate]] = {}
        self._records: Dict[str, FactRecord] = {}
        self._sanity_rules: Dict[str, Any] = {}

    def register_candidate(self, field_name: str, value: Any,
                           source_type: str, **kwargs) -> None:
        """Register a candidate value for a field."""
        if field_name not in self._candidates:
            self._candidates[field_name] = []
        self._candidates[field_name].append(
            FactCandidate(value=value, source_type=source_type, **kwargs)
        )

    def register_sanity_rule(self, field_name: str, check_fn, description: str) -> None:
        """Register a sanity check function for a field.
        check_fn(value) -> (bool, str): returns (passed, detail)
        """
        self._sanity_rules[field_name] = (check_fn, description)

    def resolve(self, field_name: str) -> FactRecord:
        """Resolve a single field from its candidates."""
        candidates = self._candidates.get(field_name, [])

        if not candidates:
            return FactRecord(field_name=field_name, state=FactState.UNKNOWN,
                              resolution_reason="No candidates found")

        if len(candidates) == 1:
            c = candidates[0]
            state = FactState.DIRECT
            if c.note_dependency:
                state = FactState.DIRECT_WITH_NOTE
            elif c.source_type == "derived":
                state = FactState.DERIVED

            record = FactRecord(
                field_name=field_name,
                state=state,
                winning_value=c.value,
                winning_source=c,
                resolution_reason=f"Single source: {c.source_type}",
            )
        else:
            # Multiple candidates — check for agreement
            values = set(str(c.value) for c in candidates)
            if len(values) == 1:
                # All agree — pick highest-precedence source
                best = self._pick_best(candidates)
                record = FactRecord(
                    field_name=field_name,
                    state=FactState.DIRECT,
                    winning_value=best.value,
                    winning_source=best,
                    losing_candidates=[c for c in candidates if c is not best],
                    resolution_reason=f"All {len(candidates)} sources agree; winner: {best.source_type}",
                )
            else:
                # Conflict — pick by precedence but mark as conflicting
                best = self._pick_best(candidates)
                losers = [c for c in candidates if c is not best]

                # If highest-precedence source is clear winner, use it but note conflict
                state = FactState.CONFLICTING
                if best.source_type in ("state_addendum", "exhibit_clause"):
                    state = FactState.DIRECT  # overrides resolve conflicts

                record = FactRecord(
                    field_name=field_name,
                    state=state,
                    winning_value=best.value,
                    winning_source=best,
                    losing_candidates=losers,
                    resolution_reason=f"Conflict: {len(values)} different values from {len(candidates)} sources; winner: {best.source_type} by precedence",
                )

        # Run sanity check
        if field_name in self._sanity_rules:
            check_fn, desc = self._sanity_rules[field_name]
            passed, detail = check_fn(record.winning_value)
            record.sanity_check_passed = passed
            record.sanity_detail = detail
            if not passed:
                record.state = FactState.SUSPECTED_WRONG

        self._records[field_name] = record
        return record

    def resolve_all(self) -> Dict[str, FactRecord]:
        """Resolve all registered fields."""
        for field_name in self._candidates:
            if field_name not in self._records:
                self.resolve(field_name)
        return self._records

    def get(self, field_name: str) -> Optional[FactRecord]:
        """Get the resolved record for a field."""
        return self._records.get(field_name)

    def _pick_best(self, candidates: List[FactCandidate]) -> FactCandidate:
        """Pick the best candidate by source precedence, then confidence."""
        def precedence_key(c: FactCandidate):
            try:
                idx = self.SOURCE_PRECEDENCE.index(c.source_type)
            except ValueError:
                idx = len(self.SOURCE_PRECEDENCE)
            return (idx, -c.confidence)
        return min(candidates, key=precedence_key)

    def get_conflicts(self) -> List[FactRecord]:
        """Return all fields with conflicting state."""
        return [r for r in self._records.values() if r.state == FactState.CONFLICTING]

    def get_suspected_wrong(self) -> List[FactRecord]:
        """Return all fields that failed sanity checks."""
        return [r for r in self._records.values() if r.state == FactState.SUSPECTED_WRONG]

    def get_abstentions(self) -> List[FactRecord]:
        """Return all fields where the extractor abstained."""
        return [r for r in self._records.values() if r.state == FactState.ABSTAIN]

    def summary(self) -> Dict[str, Any]:
        """Summary statistics."""
        states = {}
        for r in self._records.values():
            states[r.state.value] = states.get(r.state.value, 0) + 1

        conflicts = self.get_conflicts()
        wrong = self.get_suspected_wrong()
        abstained = self.get_abstentions()

        return {
            "total_facts": len(self._records),
            "state_counts": states,
            "conflicts": [{"field": r.field_name, "value": str(r.winning_value),
                          "candidates": len(r.losing_candidates) + 1,
                          "reason": r.resolution_reason} for r in conflicts],
            "suspected_wrong": [{"field": r.field_name, "value": str(r.winning_value),
                                "detail": r.sanity_detail} for r in wrong],
            "abstentions": [r.field_name for r in abstained],
        }

    def to_dict(self) -> Dict[str, Dict]:
        """Serialize all records for output."""
        result = {}
        for name, rec in self._records.items():
            result[name] = {
                "state": rec.state.value,
                "winning_value": rec.winning_value,
                "winning_source": rec.winning_source.source_type if rec.winning_source else None,
                "candidates": len(rec.losing_candidates) + (1 if rec.winning_source else 0),
                "resolution_reason": rec.resolution_reason,
                "sanity_passed": rec.sanity_check_passed,
                "sanity_detail": rec.sanity_detail or None,
                "changed_after_recheck": rec.changed_after_recheck,
            }
        return result
