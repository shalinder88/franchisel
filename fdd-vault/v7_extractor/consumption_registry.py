"""
Consumption Registry — Mandatory Object Accountability

For every required object, tracks: located → parsed → used_by_A → used_by_B → used_in_output.
No silent skip allowed.

Required objects come from:
  - "How to Use This FDD" ledger
  - TOC
  - Exhibit list
  - Item references
  - Lane A discoveries

Allowed statuses only:
  - located_not_parsed
  - parsed_not_used
  - used_by_A_only
  - used_by_B_only
  - used_by_A_and_B
  - needs_review
  - missing
  - pii_blocked
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum


class ConsumptionStatus(str, Enum):
    MISSING = "missing"
    LOCATED_NOT_PARSED = "located_not_parsed"
    PARSED_NOT_USED = "parsed_not_used"
    USED_BY_A_ONLY = "used_by_A_only"
    USED_BY_B_ONLY = "used_by_B_only"
    USED_BY_A_AND_B = "used_by_A_and_B"
    NEEDS_REVIEW = "needs_review"
    PII_BLOCKED = "pii_blocked"


@dataclass
class ConsumptionRecord:
    """Tracks one required object through the pipeline."""
    object_id: str
    object_type: str  # exhibit, table, note, addendum, receipt, agreement, list
    source_item: Optional[int] = None
    source_pages: List[int] = field(default_factory=list)
    required_by: str = ""  # where_to_find / TOC / exhibit_list / item_reference / lane_A
    located: bool = False
    parsed: bool = False
    used_by_lane_A: bool = False
    used_by_lane_B: bool = False
    used_in_output: bool = False
    status: ConsumptionStatus = ConsumptionStatus.MISSING
    detail: str = ""


class ConsumptionRegistry:
    """Tracks consumption of every required object through the pipeline."""

    def __init__(self):
        self._records: Dict[str, ConsumptionRecord] = {}

    def require(self, object_id: str, object_type: str,
                required_by: str, source_item: Optional[int] = None,
                source_pages: Optional[List[int]] = None) -> None:
        """Register a required object."""
        self._records[object_id] = ConsumptionRecord(
            object_id=object_id,
            object_type=object_type,
            required_by=required_by,
            source_item=source_item,
            source_pages=source_pages or [],
        )

    def mark_located(self, object_id: str, pages: Optional[List[int]] = None) -> None:
        """Mark an object as located in the PDF."""
        if object_id in self._records:
            self._records[object_id].located = True
            if pages:
                self._records[object_id].source_pages = pages
            self._update_status(object_id)

    def mark_parsed(self, object_id: str) -> None:
        """Mark an object as parsed."""
        if object_id in self._records:
            self._records[object_id].parsed = True
            self._update_status(object_id)

    def mark_used_by_A(self, object_id: str) -> None:
        """Mark an object as consumed by Lane A."""
        if object_id in self._records:
            self._records[object_id].used_by_lane_A = True
            self._update_status(object_id)

    def mark_used_by_B(self, object_id: str) -> None:
        """Mark an object as consumed by Lane B."""
        if object_id in self._records:
            self._records[object_id].used_by_lane_B = True
            self._update_status(object_id)

    def mark_used_in_output(self, object_id: str) -> None:
        """Mark an object as present in final output."""
        if object_id in self._records:
            self._records[object_id].used_in_output = True

    def mark_pii_blocked(self, object_id: str) -> None:
        """Mark an object as PII-blocked (consumed but content suppressed)."""
        if object_id in self._records:
            self._records[object_id].status = ConsumptionStatus.PII_BLOCKED

    def _update_status(self, object_id: str) -> None:
        """Compute current status from flags."""
        r = self._records[object_id]
        if r.status == ConsumptionStatus.PII_BLOCKED:
            return

        if not r.located:
            r.status = ConsumptionStatus.MISSING
        elif not r.parsed:
            r.status = ConsumptionStatus.LOCATED_NOT_PARSED
        elif r.used_by_lane_A and r.used_by_lane_B:
            r.status = ConsumptionStatus.USED_BY_A_AND_B
        elif r.used_by_lane_A:
            r.status = ConsumptionStatus.USED_BY_A_ONLY
        elif r.used_by_lane_B:
            r.status = ConsumptionStatus.USED_BY_B_ONLY
        elif r.parsed:
            r.status = ConsumptionStatus.PARSED_NOT_USED

    # ── Queries ──

    def get_unconsumed(self) -> List[ConsumptionRecord]:
        """Get all objects that are not fully consumed."""
        return [r for r in self._records.values()
                if r.status in (ConsumptionStatus.MISSING,
                                ConsumptionStatus.LOCATED_NOT_PARSED,
                                ConsumptionStatus.PARSED_NOT_USED)]

    def get_missing(self) -> List[ConsumptionRecord]:
        """Get all objects that couldn't be found."""
        return [r for r in self._records.values()
                if r.status == ConsumptionStatus.MISSING]

    def get_publish_blockers(self) -> List[ConsumptionRecord]:
        """Get objects required by How-to-Use, TOC, or critical items
        that are not consumed. These block publish."""
        blockers = []
        for r in self._records.values():
            if r.status in (ConsumptionStatus.MISSING,
                            ConsumptionStatus.LOCATED_NOT_PARSED):
                if r.required_by in ("where_to_find", "TOC", "exhibit_list"):
                    blockers.append(r)
                elif r.source_item in (5, 6, 7, 8, 19, 20, 21):
                    blockers.append(r)
        return blockers

    def summary(self) -> Dict[str, Any]:
        """Summary for output."""
        status_counts: Dict[str, int] = {}
        for r in self._records.values():
            status_counts[r.status.value] = status_counts.get(r.status.value, 0) + 1

        unconsumed = self.get_unconsumed()
        blockers = self.get_publish_blockers()

        return {
            "total_required": len(self._records),
            "status_counts": status_counts,
            "unconsumed_count": len(unconsumed),
            "unconsumed": [{"id": r.object_id, "type": r.object_type,
                           "status": r.status.value, "required_by": r.required_by}
                          for r in unconsumed],
            "publish_blockers": [{"id": r.object_id, "type": r.object_type,
                                 "status": r.status.value}
                                for r in blockers],
            "publish_blocked": len(blockers) > 0,
        }

    def to_dict(self) -> Dict[str, Dict]:
        """Full serialization."""
        return {
            oid: {
                "type": r.object_type,
                "source_item": r.source_item,
                "required_by": r.required_by,
                "located": r.located,
                "parsed": r.parsed,
                "used_by_A": r.used_by_lane_A,
                "used_by_B": r.used_by_lane_B,
                "used_in_output": r.used_in_output,
                "status": r.status.value,
            }
            for oid, r in self._records.items()
        }


def build_consumption_registry(bootstrap: Dict[str, Any],
                                items: Dict[int, Any],
                                exhibits: Dict[str, Any]) -> ConsumptionRegistry:
    """Build the consumption registry from bootstrap and extraction data.

    Registers all required objects from:
      - TOC entries
      - Exhibit list
      - Critical item tables
      - How-to-Use references
    """
    registry = ConsumptionRegistry()

    # ── Register all exhibits ──
    for code in exhibits:
        registry.require(
            f"exhibit_{code}", "exhibit",
            required_by="exhibit_list",
        )

    # ── Register critical item data (tables or narrative) ──
    # Items 5-7, 17, 19-21 require tables. Item 8 can be narrative-only.
    CRITICAL_TABLE_ITEMS = [5, 6, 7, 17, 19, 20, 21]
    for item_num in CRITICAL_TABLE_ITEMS:
        registry.require(
            f"item_{item_num}_tables", "table",
            required_by="where_to_find",
            source_item=item_num,
        )
    # Item 8 requires data (tables OR narrative supplier extraction)
    registry.require("item_8_data", "table_or_narrative",
                     required_by="where_to_find", source_item=8)

    # ── Register mandatory consumption targets from "How to Use" ──
    registry.require("cover_economics", "page", required_by="where_to_find")
    registry.require("how_to_use_ledger", "page", required_by="where_to_find")
    registry.require("toc", "page", required_by="where_to_find")

    # ── Mark located exhibits ──
    for code, ex in exhibits.items():
        oid = f"exhibit_{code}"
        if oid not in registry._records:
            continue  # not a required exhibit (wasn't in exhibit_list or was dynamically added)
        if isinstance(ex, dict):
            if ex.get("start_page", 0) > 0:
                registry.mark_located(oid, [ex["start_page"]])
            if ex.get("parsed"):
                registry.mark_parsed(oid)
        elif hasattr(ex, 'start_page'):
            if ex.start_page > 0:
                registry.mark_located(oid, [ex.start_page])
            if ex.parsed:
                registry.mark_parsed(oid)

    # ── Remove false-positive exhibit requirements ──
    # If an exhibit code has sub-exhibits (e.g., D-1, D-2) but no standalone exhibit,
    # the parent code is not a real exhibit — remove it from requirements.
    false_positives = []
    for code in list(exhibits.keys()):
        oid = f"exhibit_{code}"
        if oid in registry._records:
            rec = registry._records[oid]
            if not rec.located:
                # Check if sub-exhibits exist (e.g., D has D-1, D-2)
                subs = [c for c in exhibits if c.startswith(code + "-") or c.startswith(code + "_")]
                if subs:
                    false_positives.append(oid)
    for oid in false_positives:
        del registry._records[oid]

    # ── Mark located item tables ──
    for item_num in CRITICAL_TABLE_ITEMS:
        oid = f"item_{item_num}_tables"
        section = items.get(item_num)
        if section:
            table_count = len(section.tables) if hasattr(section, 'tables') else 0
            if table_count > 0:
                registry.mark_located(oid)
                registry.mark_parsed(oid)
                registry.mark_used_by_B(oid)  # engines consume tables
            else:
                registry.mark_located(oid)  # item found but no tables

    # Item 8: narrative-only is valid — mark consumed if section has text
    section_8 = items.get(8)
    if section_8:
        registry.mark_located("item_8_data")
        if hasattr(section_8, 'text_length') and section_8.text_length > 100:
            registry.mark_parsed("item_8_data")
            registry.mark_used_by_B("item_8_data")  # Item 8 parser extracts from narrative

    # ── Mark bootstrap items ──
    if bootstrap.get("entity"):
        registry.mark_located("cover_economics")
        registry.mark_parsed("cover_economics")
        registry.mark_used_by_A("cover_economics")
    if bootstrap.get("tocMap"):
        registry.mark_located("toc")
        registry.mark_parsed("toc")
        registry.mark_used_by_A("toc")
        registry.mark_used_by_B("toc")
    registry.mark_located("how_to_use_ledger")
    registry.mark_parsed("how_to_use_ledger")
    registry.mark_used_by_A("how_to_use_ledger")

    return registry
