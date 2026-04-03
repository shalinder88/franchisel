"""
Exhibit Role Parser with Precedence

Assigns roles to exhibits and enforces precedence ordering.

For any conflicting clause or field:
  1. state-specific addendum (highest precedence)
  2. exhibit-specific rider/amendment
  3. agreement exhibit
  4. main item narrative
  5. cover-page summary (lowest precedence)

This module is separate from exhibit_locator (which finds exhibits)
and exhibit_parser (which reads exhibit content).

This module assigns roles AND determines which exhibit takes priority
when multiple sources provide conflicting data for the same field.
"""

import re
from typing import Dict, List, Optional, Any
from .models import ExhibitObject, ExhibitRole


# Precedence levels (lower = higher priority)
ROLE_PRECEDENCE = {
    ExhibitRole.STATE_ADDENDA_FDD: 1,
    ExhibitRole.STATE_ADDENDA_AGREEMENT: 1,
    ExhibitRole.LEASE_RIDER: 2,
    ExhibitRole.FRANCHISE_AGREEMENT: 3,
    ExhibitRole.DEVELOPMENT_AGREEMENT: 3,
    ExhibitRole.NONTRADITIONAL_AGREEMENT: 3,
    ExhibitRole.SMALLTOWN_AGREEMENT: 3,
    ExhibitRole.GUARANTY: 3,
    ExhibitRole.FINANCIALS: 3,
    ExhibitRole.EQUIPMENT_LEASE: 3,
    ExhibitRole.SUPPLIER_AGREEMENT: 3,
    ExhibitRole.ADVERTISING_AGREEMENT: 3,
    ExhibitRole.PAYMENT_ACH: 3,
    ExhibitRole.FINANCING_DOC: 3,
    ExhibitRole.MANUAL_TOC: 4,
    ExhibitRole.ITEM20_SUPPORT: 4,
    ExhibitRole.FRANCHISEE_LIST: 5,
    ExhibitRole.FORMER_FRANCHISEE_LIST: 5,
    ExhibitRole.UNOPENED_UNITS_LIST: 5,
    ExhibitRole.RECEIPT: 6,
    ExhibitRole.OTHER: 6,
}

# Importance classification
CRITICAL_ROLES = {
    ExhibitRole.FINANCIALS,
    ExhibitRole.FRANCHISE_AGREEMENT,
    ExhibitRole.STATE_ADDENDA_FDD,
    ExhibitRole.STATE_ADDENDA_AGREEMENT,
}

NORMAL_ROLES = {
    ExhibitRole.DEVELOPMENT_AGREEMENT,
    ExhibitRole.GUARANTY,
    ExhibitRole.EQUIPMENT_LEASE,
    ExhibitRole.SUPPLIER_AGREEMENT,
    ExhibitRole.MANUAL_TOC,
    ExhibitRole.ITEM20_SUPPORT,
}


def assign_precedence(exhibits: Dict[str, ExhibitObject]) -> None:
    """Assign precedence levels and importance to all exhibits.

    Mutates ExhibitObject instances in place.
    """
    for code, exhibit in exhibits.items():
        exhibit.precedence_level = ROLE_PRECEDENCE.get(exhibit.role, 6)
        if exhibit.role in CRITICAL_ROLES:
            exhibit.importance = "critical"
        elif exhibit.role in NORMAL_ROLES:
            exhibit.importance = "normal"
        else:
            exhibit.importance = "low"


def resolve_field_conflict(field_name: str,
                           sources: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """When multiple sources provide a value for the same field, pick by precedence.

    Each source dict must have: value, precedence_level, source_type, source_id

    Returns the winning source, or None if no sources.
    """
    if not sources:
        return None

    # Sort by precedence (lower = higher priority)
    sorted_sources = sorted(sources, key=lambda s: s.get("precedence_level", 99))
    return sorted_sources[0]


def get_processing_order(exhibits: Dict[str, ExhibitObject]) -> List[str]:
    """Return exhibit codes in the order they should be processed.

    Priority:
      1. financial exhibits (critical)
      2. franchise/development agreements
      3. state addenda
      4. item-specific support
      5. manual TOC
      6. franchisee lists / receipts with PII blocking
    """
    PROCESSING_ORDER = {
        ExhibitRole.FINANCIALS: 1,
        ExhibitRole.FRANCHISE_AGREEMENT: 2,
        ExhibitRole.DEVELOPMENT_AGREEMENT: 2,
        ExhibitRole.STATE_ADDENDA_FDD: 3,
        ExhibitRole.STATE_ADDENDA_AGREEMENT: 3,
        ExhibitRole.GUARANTY: 4,
        ExhibitRole.EQUIPMENT_LEASE: 4,
        ExhibitRole.SUPPLIER_AGREEMENT: 4,
        ExhibitRole.ADVERTISING_AGREEMENT: 4,
        ExhibitRole.PAYMENT_ACH: 4,
        ExhibitRole.FINANCING_DOC: 4,
        ExhibitRole.MANUAL_TOC: 5,
        ExhibitRole.ITEM20_SUPPORT: 5,
        ExhibitRole.FRANCHISEE_LIST: 6,
        ExhibitRole.FORMER_FRANCHISEE_LIST: 6,
        ExhibitRole.UNOPENED_UNITS_LIST: 6,
        ExhibitRole.RECEIPT: 7,
        ExhibitRole.OTHER: 8,
    }

    sorted_codes = sorted(
        exhibits.keys(),
        key=lambda c: PROCESSING_ORDER.get(exhibits[c].role, 99)
    )
    return sorted_codes


def summarize_exhibit_roles(exhibits: Dict[str, ExhibitObject]) -> Dict[str, Any]:
    """Produce a summary of exhibit roles for the QA output."""
    role_counts: Dict[str, int] = {}
    parsed_count = 0
    unparsed_critical = []

    for code, ex in exhibits.items():
        role_counts[ex.role.value] = role_counts.get(ex.role.value, 0) + 1
        if ex.parsed:
            parsed_count += 1
        elif ex.role in CRITICAL_ROLES and ex.start_page > 0:
            unparsed_critical.append(code)

    return {
        "total_exhibits": len(exhibits),
        "parsed": parsed_count,
        "unparsed_critical": unparsed_critical,
        "role_counts": role_counts,
    }
