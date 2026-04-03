"""
Confidence Engine

Assigns confidence scores to extracted fields based on extraction method.

Hierarchy (from highest to lowest):
  1. table_cell_with_note — exact table cell with linked footnote (very_high)
  2. direct_narrative — direct statement in main item text (high)
  3. exhibit_clause — clause from cross-referenced exhibit (high)
  4. reconstructed_row — table row from geometric/text-grid reconstruction (medium)
  5. line_fallback — raw row text from line fallback (low)
  6. qa_regex — found only by regex QA sweep (very_low)
  7. unresolved — ambiguous, needs review (very_low)

No regex-based extraction can have confidence above "low".
"""

from typing import Dict, Any, Optional
from .models import EvidenceStore, Provenance, TableMethod


CONFIDENCE_MAP = {
    "table_cell_with_note": "very_high",
    "table_cell": "very_high",
    "direct_narrative": "high",
    "exhibit_clause": "high",
    "reconstructed_row": "medium",
    "line_fallback": "low",
    "qa_regex": "very_low",
    "inference": "very_low",
    "unresolved": "very_low",
}

CONFIDENCE_ORDER = ["very_high", "high", "medium", "low", "very_low"]


def get_confidence(extraction_method: str) -> str:
    """Get confidence level for a given extraction method."""
    return CONFIDENCE_MAP.get(extraction_method, "low")


def confidence_from_table_method(method: TableMethod) -> str:
    """Map table detection method to confidence level."""
    return {
        TableMethod.PYMUPDF: "very_high",
        TableMethod.GEOMETRIC: "high",
        TableMethod.TEXT_GRID: "medium",
        TableMethod.LINE_FALLBACK: "low",
    }.get(method, "low")


def is_higher_confidence(a: str, b: str) -> bool:
    """Returns True if confidence 'a' is higher than confidence 'b'."""
    a_idx = CONFIDENCE_ORDER.index(a) if a in CONFIDENCE_ORDER else len(CONFIDENCE_ORDER)
    b_idx = CONFIDENCE_ORDER.index(b) if b in CONFIDENCE_ORDER else len(CONFIDENCE_ORDER)
    return a_idx < b_idx


def compute_overall_confidence(evidence: EvidenceStore) -> Dict[str, Any]:
    """Compute overall extraction confidence from all evidence entries.

    Returns summary with counts by confidence level and overall score.
    """
    counts: Dict[str, int] = {level: 0 for level in CONFIDENCE_ORDER}
    total = 0

    for field_name, entry in evidence._store.items():
        prov = entry.get("provenance")
        if prov:
            conf = prov.get("confidence", "low")
            if conf in counts:
                counts[conf] += 1
            total += 1

    # Overall score: weighted average
    weights = {"very_high": 5, "high": 4, "medium": 3, "low": 2, "very_low": 1}
    if total > 0:
        weighted_sum = sum(counts.get(level, 0) * weights.get(level, 1)
                          for level in CONFIDENCE_ORDER)
        overall_score = round(weighted_sum / total, 2)
    else:
        overall_score = 0

    return {
        "counts": counts,
        "total_fields": total,
        "overall_score": overall_score,
        "overall_label": (
            "very_high" if overall_score >= 4.5 else
            "high" if overall_score >= 3.5 else
            "medium" if overall_score >= 2.5 else
            "low" if overall_score >= 1.5 else "very_low"
        ),
    }
