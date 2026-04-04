"""
Source Registry — Every source object gets a typed ID.

Before any worker reads anything, the source must be registered here.
This is how we prevent duplicate parsing, track what was consumed,
and ensure no source is silently skipped.

Source types:
  - page: a single PDF page
  - item_window: contiguous pages for one FDD item
  - table: a detected table object
  - exhibit: an exhibit section
  - addendum: a state addendum
  - financial_statement: financial statement section
  - franchisee_list: current/former franchisee list
  - agreement: an agreement exhibit
  - note: a footnote or endnote
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set
from enum import Enum


class SourceType(str, Enum):
    PAGE = "page"
    ITEM_WINDOW = "item_window"
    TABLE = "table"
    EXHIBIT = "exhibit"
    ADDENDUM = "addendum"
    FINANCIAL_STATEMENT = "financial_statement"
    FRANCHISEE_LIST = "franchisee_list"
    AGREEMENT = "agreement"
    NOTE = "note"
    COVER = "cover"
    TOC = "toc"
    EXHIBIT_LIST = "exhibit_list"
    HOW_TO_USE = "how_to_use"
    SPECIAL_RISKS = "special_risks"


class ParseState(str, Enum):
    REGISTERED = "registered"       # Known to exist
    LOCATED = "located"             # Page boundaries found
    CLAIMED = "claimed"             # A worker has claimed it for parsing
    PARSING = "parsing"             # Currently being parsed
    PARSED = "parsed"               # Parsing complete
    FAILED = "failed"               # Parse attempt failed
    SKIPPED_PII = "skipped_pii"     # Skipped due to PII policy
    NOT_FOUND = "not_found"         # Expected but not located in PDF


@dataclass
class SourceObject:
    """One registered source in the PDF."""
    source_id: str                  # Unique: "{type}_{identifier}"
    source_type: SourceType
    pages: List[int] = field(default_factory=list)
    item_num: Optional[int] = None  # If this source is within an FDD item
    exhibit_code: Optional[str] = None
    parse_state: ParseState = ParseState.REGISTERED
    claimed_by: Optional[str] = None  # Worker ID that claimed this source
    parsed_by: List[str] = field(default_factory=list)  # Workers that parsed it
    fact_packet_ids: List[str] = field(default_factory=list)  # Facts extracted from it
    content_hash: Optional[str] = None  # For dedup detection
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source_id": self.source_id,
            "source_type": self.source_type.value,
            "pages": self.pages,
            "item_num": self.item_num,
            "exhibit_code": self.exhibit_code,
            "parse_state": self.parse_state.value,
            "claimed_by": self.claimed_by,
            "parsed_by": self.parsed_by,
            "fact_count": len(self.fact_packet_ids),
            "metadata": self.metadata,
        }


class SourceRegistry:
    """Central registry of all source objects in a PDF.

    Rules:
    1. Every source must be registered before any worker reads it
    2. A source can only be claimed by one primary worker (prevents duplicate parsing)
    3. Cross-cutting specialists (table/exhibit extractors) can read any source
       but must not overwrite primary worker findings
    4. Every registered source must end in a terminal state (parsed, failed, skipped, not_found)
    """

    # Workers that can read any source without claiming
    CROSS_CUTTING_WORKERS = {"table_extractor", "exhibit_extractor", "recovery_worker"}

    def __init__(self):
        self._sources: Dict[str, SourceObject] = {}
        self._by_type: Dict[str, List[str]] = {}
        self._by_item: Dict[int, List[str]] = {}
        self._by_worker: Dict[str, Set[str]] = {}

    def register(self, source_id: str, source_type: SourceType,
                 pages: Optional[List[int]] = None,
                 item_num: Optional[int] = None,
                 exhibit_code: Optional[str] = None,
                 metadata: Optional[Dict] = None) -> SourceObject:
        """Register a source object. Idempotent — returns existing if already registered."""
        if source_id in self._sources:
            existing = self._sources[source_id]
            # Update pages if newly discovered
            if pages and not existing.pages:
                existing.pages = pages
                existing.parse_state = ParseState.LOCATED
            return existing

        obj = SourceObject(
            source_id=source_id,
            source_type=source_type,
            pages=pages or [],
            item_num=item_num,
            exhibit_code=exhibit_code,
            parse_state=ParseState.LOCATED if pages else ParseState.REGISTERED,
            metadata=metadata or {},
        )
        self._sources[source_id] = obj

        # Index
        t = source_type.value
        if t not in self._by_type:
            self._by_type[t] = []
        self._by_type[t].append(source_id)

        if item_num is not None:
            if item_num not in self._by_item:
                self._by_item[item_num] = []
            self._by_item[item_num].append(source_id)

        return obj

    def claim(self, source_id: str, worker_id: str) -> bool:
        """Claim a source for primary parsing. Returns False if already claimed."""
        obj = self._sources.get(source_id)
        if not obj:
            return False

        # Cross-cutting workers don't need to claim
        if worker_id in self.CROSS_CUTTING_WORKERS:
            return True

        if obj.claimed_by and obj.claimed_by != worker_id:
            return False  # Already claimed by another worker

        obj.claimed_by = worker_id
        obj.parse_state = ParseState.CLAIMED

        if worker_id not in self._by_worker:
            self._by_worker[worker_id] = set()
        self._by_worker[worker_id].add(source_id)

        return True

    def mark_parsing(self, source_id: str, worker_id: str):
        """Mark source as currently being parsed."""
        obj = self._sources.get(source_id)
        if obj:
            obj.parse_state = ParseState.PARSING
            if worker_id not in obj.parsed_by:
                obj.parsed_by.append(worker_id)

    def mark_parsed(self, source_id: str, worker_id: str,
                    fact_packet_ids: Optional[List[str]] = None):
        """Mark source as successfully parsed."""
        obj = self._sources.get(source_id)
        if obj:
            obj.parse_state = ParseState.PARSED
            if worker_id not in obj.parsed_by:
                obj.parsed_by.append(worker_id)
            if fact_packet_ids:
                obj.fact_packet_ids.extend(fact_packet_ids)

    def mark_failed(self, source_id: str, worker_id: str, reason: str = ""):
        """Mark source as failed to parse."""
        obj = self._sources.get(source_id)
        if obj:
            obj.parse_state = ParseState.FAILED
            obj.metadata["failure_reason"] = reason
            if worker_id not in obj.parsed_by:
                obj.parsed_by.append(worker_id)

    def mark_not_found(self, source_id: str):
        """Mark source as expected but not found in PDF."""
        obj = self._sources.get(source_id)
        if obj:
            obj.parse_state = ParseState.NOT_FOUND

    def mark_pii_blocked(self, source_id: str):
        """Mark source as skipped due to PII policy."""
        obj = self._sources.get(source_id)
        if obj:
            obj.parse_state = ParseState.SKIPPED_PII

    # ── Queries ──

    def get(self, source_id: str) -> Optional[SourceObject]:
        return self._sources.get(source_id)

    def get_by_type(self, source_type: SourceType) -> List[SourceObject]:
        ids = self._by_type.get(source_type.value, [])
        return [self._sources[sid] for sid in ids]

    def get_by_item(self, item_num: int) -> List[SourceObject]:
        ids = self._by_item.get(item_num, [])
        return [self._sources[sid] for sid in ids]

    def get_unclaimed(self) -> List[SourceObject]:
        """Sources that no worker has claimed yet."""
        return [s for s in self._sources.values()
                if s.parse_state in (ParseState.REGISTERED, ParseState.LOCATED)
                and s.claimed_by is None]

    def get_unparsed(self) -> List[SourceObject]:
        """Sources that are claimed or located but not yet parsed."""
        return [s for s in self._sources.values()
                if s.parse_state in (ParseState.REGISTERED, ParseState.LOCATED,
                                      ParseState.CLAIMED)]

    def get_failed(self) -> List[SourceObject]:
        return [s for s in self._sources.values()
                if s.parse_state == ParseState.FAILED]

    def get_worker_sources(self, worker_id: str) -> List[SourceObject]:
        ids = self._by_worker.get(worker_id, set())
        return [self._sources[sid] for sid in ids if sid in self._sources]

    def has_unfinished(self) -> bool:
        """Any source still in non-terminal state?"""
        terminal = {ParseState.PARSED, ParseState.FAILED,
                    ParseState.SKIPPED_PII, ParseState.NOT_FOUND}
        return any(s.parse_state not in terminal for s in self._sources.values())

    def get_unfinished(self) -> List[SourceObject]:
        terminal = {ParseState.PARSED, ParseState.FAILED,
                    ParseState.SKIPPED_PII, ParseState.NOT_FOUND}
        return [s for s in self._sources.values() if s.parse_state not in terminal]

    def summary(self) -> Dict[str, Any]:
        by_state = {}
        by_type = {}
        for s in self._sources.values():
            st = s.parse_state.value
            by_state[st] = by_state.get(st, 0) + 1
            tp = s.source_type.value
            by_type[tp] = by_type.get(tp, 0) + 1

        return {
            "total_sources": len(self._sources),
            "by_state": by_state,
            "by_type": by_type,
            "items_covered": sorted(self._by_item.keys()),
            "workers_active": len(self._by_worker),
            "unfinished_count": len(self.get_unfinished()),
            "failed_count": len(self.get_failed()),
            "unclaimed_count": len(self.get_unclaimed()),
        }

    def to_dict(self) -> Dict[str, Dict]:
        return {sid: s.to_dict() for sid, s in self._sources.items()}

    def validate_completeness(self) -> Dict[str, Any]:
        """Check that no source was silently skipped.

        Returns a report of any sources that are still in non-terminal state.
        This is the 'no silent skip' enforcement.
        """
        violations = []
        for sid, s in self._sources.items():
            if s.parse_state in (ParseState.REGISTERED, ParseState.LOCATED):
                violations.append({
                    "source_id": sid,
                    "type": s.source_type.value,
                    "state": s.parse_state.value,
                    "pages": s.pages,
                    "violation": "never_claimed" if not s.claimed_by else "claimed_not_parsed",
                })
            elif s.parse_state == ParseState.CLAIMED:
                violations.append({
                    "source_id": sid,
                    "type": s.source_type.value,
                    "state": "claimed_not_parsed",
                    "claimed_by": s.claimed_by,
                    "pages": s.pages,
                    "violation": "worker_abandoned",
                })

        return {
            "all_complete": len(violations) == 0,
            "violation_count": len(violations),
            "violations": violations,
        }
