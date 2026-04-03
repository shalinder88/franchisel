"""Completeness checks — verify all required data is extracted."""

from typing import Dict, List
from ..models import (ItemSection, FailureState, PublishGate,
                      TABLE_REQUIRED_ITEMS, TABLE_EXPECTED_ITEMS)


def check_completeness(items: Dict[int, ItemSection],
                       evidence: Dict) -> Dict[str, any]:
    """Check extraction completeness and determine publish gate.

    Returns:
      - missing_items: items not found at all
      - missing_tables: items that require tables but have none
      - failure_states: count by failure state
      - publish_gate: draft / backend_complete / review_needed / publishable / gold
    """
    missing_items = [n for n in range(1, 24) if n not in items]

    missing_tables = []
    for n in TABLE_REQUIRED_ITEMS:
        if n in items and items[n].failure_state == FailureState.TABLE_MISSED:
            missing_tables.append(n)

    failure_counts = {}
    for s in items.values():
        state = s.failure_state.value
        failure_counts[state] = failure_counts.get(state, 0) + 1

    # Publish gate determination
    complete = sum(1 for s in items.values() if s.failure_state == FailureState.COMPLETE)
    has_19 = 19 in items and items[19].failure_state != FailureState.PARSE_FAILED
    has_20 = 20 in items and items[20].failure_state != FailureState.PARSE_FAILED
    has_21 = 21 in items
    has_financials = evidence.get("hasAuditedFinancials") is not None
    no_unresolved = not missing_tables

    if (complete >= 20 and has_19 and has_20 and has_financials
            and no_unresolved and len(missing_items) <= 2):
        gate = PublishGate.GOLD
    elif complete >= 15 and (has_19 or has_20):
        gate = PublishGate.PUBLISHABLE_STANDARD
    elif complete >= 10:
        gate = PublishGate.REVIEW_NEEDED
    elif complete >= 5:
        gate = PublishGate.BACKEND_COMPLETE
    else:
        gate = PublishGate.DRAFT

    return {
        "missing_items": missing_items,
        "missing_tables": missing_tables,
        "failure_states": failure_counts,
        "complete_count": complete,
        "publish_gate": gate.value,
    }
