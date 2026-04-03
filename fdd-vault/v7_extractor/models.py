"""
V7 Core Data Models

Every object in the extraction pipeline is defined here.
These are the atoms of the system — nothing exists outside these types.

Layer A (Evidence): PageRead, TableObject, ExhibitObject, CrossReference, NoteLink
Layer B (Normalized): ItemSection, Engine outputs
Layer C (Analysis): Derived from Layer B only

Rule: A field may only be published if it came from a PageRead, TableObject,
or ExhibitObject with provenance. Not from a loose regex hit.
"""

from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List
from enum import Enum


# ══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ══════════════════════════════════════════════════════════════════════════════

class PageType(str, Enum):
    COVER = "cover_page"
    HOW_TO_USE = "how_to_use"
    SPECIAL_RISKS = "special_risks"
    STATE_NOTICE = "state_notice"
    TOC = "table_of_contents"
    EXHIBIT_LIST = "exhibit_list"
    ITEM_NARRATIVE = "item_narrative"
    ITEM_TABLE = "item_table"
    MIXED = "mixed_narrative_table"
    FINANCIAL_STATEMENT = "financial_statement"
    EXHIBIT_AGREEMENT = "exhibit_agreement"
    EXHIBIT_MANUAL_TOC = "exhibit_manual_toc"
    EXHIBIT_FRANCHISEE_LIST = "exhibit_franchisee_list"
    EXHIBIT_RECEIPT = "exhibit_receipt"
    RECEIPT_SIGNATURE = "receipt_signature"
    LOW_VALUE_ADMIN = "low_value_admin"
    APPENDIX_OTHER = "appendix_other"


class EvidenceState(str, Enum):
    """Every field must be one of these. No fake nulls, no fake zeroes."""
    PRESENT = "present"
    EXPLICITLY_ABSENT = "explicitly_absent"
    NOT_FOUND = "not_found"
    NOT_YET_PARSED = "not_yet_parsed"
    BLOCKED_PII = "blocked_pii"
    REFERENCED_MISSING = "referenced_missing_target"
    AMBIGUOUS = "ambiguous_needs_review"


class FailureState(str, Enum):
    """Every item/engine ends in one of these states."""
    COMPLETE = "complete"
    PARTIAL = "partial"
    PRESENT_NO_TABLE = "present_no_table"
    EXHIBIT_MISSING = "referenced_exhibit_missing"
    TABLE_MISSED = "table_missed_needs_review"
    CONTRADICTION = "contradiction_found"
    BLOCKED_PII = "blocked_pii"
    NO_DATA = "no_data_disclosed"
    PARSE_FAILED = "parse_failed"


class TableMethod(str, Enum):
    """How a table was detected. Determines confidence."""
    PYMUPDF = "pymupdf"
    GEOMETRIC = "geometric_reconstruction"
    TEXT_GRID = "text_grid"
    LINE_FALLBACK = "line_fallback"


class ExhibitRole(str, Enum):
    """Every exhibit gets a role. Discovery without follow-through is failure."""
    FINANCIALS = "financials"
    FRANCHISE_AGREEMENT = "franchise_agreement"
    DEVELOPMENT_AGREEMENT = "development_agreement"
    NONTRADITIONAL_AGREEMENT = "nontraditional_agreement"
    SMALLTOWN_AGREEMENT = "smalltown_agreement"
    GUARANTY = "guaranty"
    LEASE_RIDER = "lease_rider"
    EQUIPMENT_LEASE = "equipment_lease"
    SUPPLIER_AGREEMENT = "supplier_agreement"
    ADVERTISING_AGREEMENT = "advertising_agreement"
    PAYMENT_ACH = "payment_or_ach"
    FINANCING_DOC = "financing_doc"
    MANUAL_TOC = "manual_toc"
    ITEM20_SUPPORT = "item20_support"
    FRANCHISEE_LIST = "franchisee_list"
    FORMER_FRANCHISEE_LIST = "former_franchisee_list"
    UNOPENED_UNITS_LIST = "unopened_units_list"
    STATE_ADDENDA_FDD = "state_addenda_fdd"
    STATE_ADDENDA_AGREEMENT = "state_addenda_agreement"
    RECEIPT = "receipt"
    OTHER = "other"


class PublishGate(str, Enum):
    DRAFT = "draft"
    BACKEND_COMPLETE = "backend_complete"
    REVIEW_NEEDED = "review_needed"
    PUBLISHABLE_STANDARD = "publishable_standard"
    GOLD = "gold_publishable"


# ══════════════════════════════════════════════════════════════════════════════
# LAYER A: EVIDENCE OBJECTS
# These are the truth source. Everything traces back here.
# ══════════════════════════════════════════════════════════════════════════════

@dataclass
class Provenance:
    """Where a fact came from. Attached to every extracted value."""
    source_item: Optional[int] = None
    source_exhibit: Optional[str] = None
    source_page: Optional[int] = None
    source_page_end: Optional[int] = None
    source_table_id: Optional[str] = None
    source_note_id: Optional[str] = None
    extraction_method: str = "reading"  # reading / table_cell / exhibit_clause / note / qa_regex
    confidence: str = "high"  # very_high / high / medium / low / very_low
    needs_review: bool = False


@dataclass
class NoteLink:
    """A footnote or note linked to a table or cell."""
    note_id: str
    note_num: int
    text: str
    source_page: int
    linked_table_id: Optional[str] = None
    linked_row_idx: Optional[int] = None
    linked_cell_idx: Optional[int] = None
    unresolved: bool = False


@dataclass
class TableObject:
    """A table extracted from a PDF page. First-class object with provenance."""
    table_id: str
    source_page: int
    source_item: Optional[int] = None
    source_exhibit: Optional[str] = None
    detection_method: TableMethod = TableMethod.PYMUPDF
    title: str = ""
    table_type: str = ""  # fee_table / investment_table / outlet_summary / fpr_table / contract_table / etc
    currency: str = "USD"
    columns: List[str] = field(default_factory=list)
    rows: List[List[str]] = field(default_factory=list)
    raw_data: List[List[str]] = field(default_factory=list)
    row_count: int = 0
    col_count: int = 0
    table_notes: List[NoteLink] = field(default_factory=list)
    row_note_refs: Dict[int, List[int]] = field(default_factory=dict)
    cell_note_refs: Dict[str, List[int]] = field(default_factory=dict)
    population: Dict[str, Any] = field(default_factory=dict)
    continuation_of: Optional[str] = None
    continued_on_next_page: bool = False
    confidence: str = "high"
    needs_review: bool = False
    provenance: Provenance = field(default_factory=Provenance)


@dataclass
class CrossReference:
    """A cross-reference: 'see Exhibit X', 'see Item Y', 'see Note Z'."""
    text: str
    source_page: int
    source_item: Optional[int] = None
    status: str = "unresolved"  # unresolved / resolved / blocked / missing_target
    target_type: str = ""  # exhibit / item / note / table / attachment / schedule
    target_id: str = ""
    resolution_page: Optional[int] = None


@dataclass
class PageRead:
    """One page read from the PDF. The reader layer's output.
    Every page must emit these 5 outputs:
      1. summary
      2. structured_facts
      3. unresolved_pointers
      4. tables
      5. red_flags
    """
    page_num: int
    page_type: PageType = PageType.ITEM_NARRATIVE
    text: str = ""
    text_length: int = 0
    # 5 required outputs
    summary: str = ""
    structured_facts: Dict[str, Any] = field(default_factory=dict)
    unresolved_pointers: List[CrossReference] = field(default_factory=list)
    tables: List[TableObject] = field(default_factory=list)
    red_flags: List[str] = field(default_factory=list)
    # Heading detection
    item_headings: List[Dict] = field(default_factory=list)
    # Geometry hints from Phase -1
    has_table_regions: bool = False
    has_heading_regions: bool = False


@dataclass
class ExhibitObject:
    """An exhibit section parsed from the PDF. Role-tagged, not just listed."""
    exhibit_id: str
    code: str  # letter code: A, B, C, etc.
    raw_name: str = ""
    role: ExhibitRole = ExhibitRole.OTHER
    start_page: int = 0
    end_page: int = 0
    trigger_items: List[int] = field(default_factory=list)
    parsed: bool = False
    importance: str = "normal"  # critical / normal / low
    precedence_level: int = 4  # 1=state addenda, 2=rider, 3=agreement, 4=narrative, 5=cover
    text: str = ""
    tables: List[TableObject] = field(default_factory=list)
    parsed_data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class StateOverride:
    """A state-specific override from state addenda."""
    state: str
    target_document: str  # which agreement this modifies
    clause_domain: str  # venue/arbitration, termination/cure, renewal, transfer, etc
    override_text: str = ""
    override_effect: str = ""
    precedence_status: str = "active"


@dataclass
class ItemSection:
    """An FDD item section (1-23) assembled from page reads."""
    item_num: int
    start_page: int = 0
    end_page: int = 0
    pages: List[PageRead] = field(default_factory=list)
    text: str = ""
    text_length: int = 0
    tables: List[TableObject] = field(default_factory=list)
    notes: List[NoteLink] = field(default_factory=list)
    cross_refs: List[CrossReference] = field(default_factory=list)
    red_flags: List[str] = field(default_factory=list)
    failure_state: FailureState = FailureState.PARSE_FAILED
    page_count: int = 0


# ══════════════════════════════════════════════════════════════════════════════
# EVIDENCE STORE
# Tracks what's present, absent, not found, or blocked for every field.
# No fake nulls. No fake zeroes.
# ══════════════════════════════════════════════════════════════════════════════

class EvidenceStore:
    """The truth source for all extracted fields.

    Every field records its value, evidence state, and provenance.
    A field with state NOT_FOUND is different from a field with state EXPLICITLY_ABSENT.
    """

    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}

    def set(self, field_name: str, value: Any, state: EvidenceState,
            provenance: Optional[Provenance] = None):
        self._store[field_name] = {
            "value": value,
            "state": state.value,
            "provenance": {
                "source_page": provenance.source_page,
                "source_table_id": provenance.source_table_id,
                "extraction_method": provenance.extraction_method,
                "confidence": provenance.confidence,
            } if provenance else None,
        }

    def get(self, field_name: str) -> Optional[Any]:
        entry = self._store.get(field_name)
        if entry and entry["state"] == EvidenceState.PRESENT.value:
            return entry["value"]
        return None

    def get_state(self, field_name: str) -> Optional[str]:
        entry = self._store.get(field_name)
        return entry["state"] if entry else None

    def get_entry(self, field_name: str) -> Optional[Dict]:
        return self._store.get(field_name)

    def to_dict(self) -> Dict:
        return dict(self._store)

    def summary(self) -> Dict[str, int]:
        """Count fields by evidence state."""
        counts: Dict[str, int] = {}
        for entry in self._store.values():
            s = entry["state"]
            counts[s] = counts.get(s, 0) + 1
        return counts


# ══════════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ══════════════════════════════════════════════════════════════════════════════

# Items where tables MUST be found (0 tables = TABLE_MISSED failure state)
TABLE_REQUIRED_ITEMS = {5, 6, 7, 19, 20}
TABLE_EXPECTED_ITEMS = {8, 9, 17, 21}

# PII hard-block patterns
PII_PATTERNS = [
    r'\b\d{3}-\d{2}-\d{4}\b',           # SSN
    r'\(\d{3}\)\s*\d{3}-\d{4}',          # Phone
    r'\b\d{3}-\d{3}-\d{4}\b',            # Phone alt
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',  # Email
]

PII_BLOCKED_SECTIONS = [
    'Exhibit R', 'Exhibit S', 'Exhibit E', 'Exhibit F',
    'Exhibit M', 'Exhibit I', 'Exhibit G', 'Item 23', 'Receipt',
]

US_STATES = {
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
}

STATE_ABBR = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC",
}
