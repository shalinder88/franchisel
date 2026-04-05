"""
Extraction Run Log — Structured per-run audit trail

Records which extractors fired, what pages they touched, what objects
they emitted, what survived to final output, and what was dropped.

Usage in pipeline.py:
    from .run_log import ExtractionRunLog

    log = ExtractionRunLog(pdf_path)
    log.phase_start("phase_3_tables")
    ...
    log.object_emitted("TableObject", t.table_id, "phase_3_tables", [t.source_page])
    ...
    log.phase_end("phase_3_tables", {"tables_found": 12})
    ...
    log.finalize(total_pages=437)
    result["run_log"] = log.to_dict()

Design rules:
  1. Zero change to extraction logic — purely observational.
  2. Append-only during run.
  3. Ships in the result dict as result["run_log"].
"""

import time
import os
from typing import Dict, Any, List, Optional, Set


class ExtractionRunLog:
    """Structured per-run audit trail for the V7 extraction pipeline."""

    def __init__(self, pdf_path: str):
        self.pdf = os.path.basename(pdf_path)
        self.pdf_path = pdf_path
        self.start_time = time.time()
        self.end_time: Optional[float] = None
        self.total_duration_s: Optional[float] = None

        # Phase-level records
        self._phases: List[Dict[str, Any]] = []
        self._active_phase: Optional[Dict[str, Any]] = None

        # Parser-level events (one per item parser or exhibit parser that fires)
        self._parser_events: List[Dict[str, Any]] = []

        # Object lifecycle tracking
        self._objects_emitted: Dict[str, Dict[str, Any]] = {}  # keyed by obj_id
        self._survived_ids: Set[str] = set()

        # Page touch tracking: {phase_name: set(page_nums)}
        self._page_touches: Dict[str, Set[int]] = {}

    # ──────────────────────────────────────────────────────────────
    # PHASE RECORDING
    # ──────────────────────────────────────────────────────────────

    def phase_start(self, name: str) -> None:
        """Record the start of a pipeline phase."""
        self._active_phase = {
            "phase": name,
            "started": time.time(),
            "ended": None,
            "duration_s": None,
            "stats": {},
        }
        if name not in self._page_touches:
            self._page_touches[name] = set()

    def phase_end(self, name: str, stats: Optional[Dict[str, Any]] = None) -> None:
        """Record the end of a pipeline phase with optional stats."""
        now = time.time()
        if self._active_phase and self._active_phase["phase"] == name:
            self._active_phase["ended"] = now
            self._active_phase["duration_s"] = round(now - self._active_phase["started"], 3)
            if stats:
                self._active_phase["stats"] = stats
            self._active_phase["pages_touched"] = sorted(self._page_touches.get(name, set()))
            self._phases.append(self._active_phase)
            self._active_phase = None
        else:
            # Phase name mismatch or no active phase — record anyway
            self._phases.append({
                "phase": name,
                "started": None,
                "ended": now,
                "duration_s": None,
                "stats": stats or {},
                "pages_touched": sorted(self._page_touches.get(name, set())),
            })

    def touch_pages(self, phase_name: str, pages: List[int]) -> None:
        """Record that a phase touched specific pages."""
        if phase_name not in self._page_touches:
            self._page_touches[phase_name] = set()
        self._page_touches[phase_name].update(pages)

    # ──────────────────────────────────────────────────────────────
    # PARSER EVENTS
    # ──────────────────────────────────────────────────────────────

    def parser_fired(
        self,
        parser_name: str,
        item_num: Optional[int],
        pages: List[int],
        objects_emitted: Optional[List[str]] = None,
        fields_set: Optional[List[str]] = None,
    ) -> None:
        """Record that an item parser or exhibit parser fired."""
        self._parser_events.append({
            "parser": parser_name,
            "item_num": item_num,
            "pages": pages,
            "objects_emitted": objects_emitted or [],
            "fields_set": fields_set or [],
        })

    # ──────────────────────────────────────────────────────────────
    # OBJECT LIFECYCLE
    # ──────────────────────────────────────────────────────────────

    def object_emitted(
        self,
        obj_type: str,
        obj_id: str,
        source_phase: str,
        source_pages: Optional[List[int]] = None,
        fields: Optional[List[str]] = None,
    ) -> None:
        """Record that a pipeline phase produced an object (table, exhibit, engine, etc.)."""
        self._objects_emitted[obj_id] = {
            "type": obj_type,
            "id": obj_id,
            "source_phase": source_phase,
            "source_pages": source_pages or [],
            "fields": fields or [],
            "survived": None,       # set during finalize
            "drop_reason": None,    # set during finalize if dropped
        }
        # Auto-touch pages
        if source_pages:
            self.touch_pages(source_phase, source_pages)

    def mark_survived(self, obj_id: str) -> None:
        """Mark an object as having contributed to the final output."""
        self._survived_ids.add(obj_id)

    def mark_dropped(self, obj_id: str, reason: str) -> None:
        """Explicitly mark an object as dropped with a reason."""
        if obj_id in self._objects_emitted:
            self._objects_emitted[obj_id]["survived"] = False
            self._objects_emitted[obj_id]["drop_reason"] = reason

    # ──────────────────────────────────────────────────────────────
    # FINALIZATION
    # ──────────────────────────────────────────────────────────────

    def finalize(self, total_pages: int = 0) -> Dict[str, Any]:
        """Compute drops, durations, and summary. Call once at end of pipeline."""
        self.end_time = time.time()
        self.total_duration_s = round(self.end_time - self.start_time, 3)

        # Close any still-open phase
        if self._active_phase:
            self.phase_end(self._active_phase["phase"])

        # Resolve survived vs dropped for all emitted objects
        for obj_id, obj in self._objects_emitted.items():
            if obj["survived"] is None:  # not explicitly marked
                if obj_id in self._survived_ids:
                    obj["survived"] = True
                else:
                    obj["survived"] = False
                    if obj["drop_reason"] is None:
                        obj["drop_reason"] = "not_in_final_output"

        # Compute page coverage
        all_touched = set()
        for pages in self._page_touches.values():
            all_touched.update(pages)

        # Build summary
        objects_list = list(self._objects_emitted.values())
        survived_list = [o for o in objects_list if o["survived"]]
        dropped_list = [o for o in objects_list if not o["survived"]]

        # Type-level breakdown
        type_counts = {}
        for o in objects_list:
            t = o["type"]
            if t not in type_counts:
                type_counts[t] = {"emitted": 0, "survived": 0, "dropped": 0}
            type_counts[t]["emitted"] += 1
            if o["survived"]:
                type_counts[t]["survived"] += 1
            else:
                type_counts[t]["dropped"] += 1

        summary = {
            "phases_run": len(self._phases),
            "parsers_fired": len(self._parser_events),
            "total_objects_emitted": len(objects_list),
            "total_objects_survived": len(survived_list),
            "total_objects_dropped": len(dropped_list),
            "by_type": type_counts,
            "pages_touched": len(all_touched),
            "pages_untouched": max(0, total_pages - len(all_touched)) if total_pages else None,
            "total_duration_s": self.total_duration_s,
        }

        return summary

    def to_dict(self) -> Dict[str, Any]:
        """Return the full structured log as a JSON-serializable dict."""
        objects_list = list(self._objects_emitted.values())

        # Convert page_touches sets to sorted lists
        page_coverage = {
            phase: sorted(pages)
            for phase, pages in self._page_touches.items()
        }

        return {
            "pdf": self.pdf,
            "total_duration_s": self.total_duration_s,
            "phases": self._phases,
            "parser_events": self._parser_events,
            "objects_emitted": objects_list,
            "objects_survived": [o for o in objects_list if o.get("survived")],
            "objects_dropped": [o for o in objects_list if not o.get("survived")],
            "page_coverage": page_coverage,
            "summary": {
                "phases_run": len(self._phases),
                "parsers_fired": len(self._parser_events),
                "total_objects_emitted": len(objects_list),
                "total_objects_survived": sum(1 for o in objects_list if o.get("survived")),
                "total_objects_dropped": sum(1 for o in objects_list if not o.get("survived")),
                "total_duration_s": self.total_duration_s,
            },
        }
