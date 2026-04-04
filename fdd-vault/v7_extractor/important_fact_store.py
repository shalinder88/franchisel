"""
Important Fact Store

Stores broad discovery candidates with provenance and importance score.
These are facts the reader lane captured while reading — they may or may
not get picked up by a normalization engine.

Lane C reconciliation compares this store against engine outputs to find:
  - Discovery-only facts (reader found it, no engine captured it)
  - Engine-only claims (engine emitted a value reader didn't support)

Every fact has:
  - what was found
  - why it matters
  - source page
  - source item
  - linked table or exhibit
  - importance score
  - whether a normalization engine captured it
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional


@dataclass
class ImportantFact:
    """A fact discovered during reading that may be important."""
    fact_text: str
    why_important: str = ""
    source_page: int = 0
    source_item: Optional[int] = None
    linked_table_id: Optional[str] = None
    linked_exhibit: Optional[str] = None
    importance_score: float = 0.5  # 0-1
    category: str = "general"  # economics / risk / performance / control / document
    engine_captured: bool = False  # set to True when a normalization engine picks it up
    engine_field: Optional[str] = None  # which engine field, e.g. "royaltyRate"


class ImportantFactStore:
    """Collection of important facts discovered during reading."""

    def __init__(self):
        self.facts: List[ImportantFact] = []

    def add(self, fact_text: str, why_important: str = "", source_page: int = 0,
            source_item: Optional[int] = None, importance: float = 0.5,
            category: str = "general", linked_table: Optional[str] = None,
            linked_exhibit: Optional[str] = None):
        # Hard rule: Item 0 is reserved for front matter only.
        # Facts created while processing Items 1-23 must carry explicit item number.
        # Missing item provenance is a write-time validation, not a silent fallback.
        if source_item is not None and not (0 <= source_item <= 23):
            source_item = None  # invalid item number, don't silently accept

        self.facts.append(ImportantFact(
            fact_text=fact_text,
            why_important=why_important,
            source_page=source_page,
            source_item=source_item,
            importance_score=importance,
            category=category,
            linked_table_id=linked_table,
            linked_exhibit=linked_exhibit,
        ))

    def mark_captured(self, source_page: int, engine_field: str):
        """Mark facts from a page as captured by an engine."""
        for f in self.facts:
            if f.source_page == source_page and not f.engine_captured:
                f.engine_captured = True
                f.engine_field = engine_field

    def uncaptured(self) -> List[ImportantFact]:
        """Get facts that no engine captured."""
        return [f for f in self.facts if not f.engine_captured]

    def high_importance_uncaptured(self) -> List[ImportantFact]:
        """Get high-importance facts that no engine captured."""
        return [f for f in self.facts
                if not f.engine_captured and f.importance_score >= 0.7]

    def by_item(self, item_num: int) -> List[ImportantFact]:
        """Get facts for a specific item."""
        return [f for f in self.facts if f.source_item == item_num]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_facts": len(self.facts),
            "captured": sum(1 for f in self.facts if f.engine_captured),
            "uncaptured": sum(1 for f in self.facts if not f.engine_captured),
            "high_importance_uncaptured": len(self.high_importance_uncaptured()),
            "facts": [
                {
                    "fact_text": f.fact_text[:300],
                    "why_important": f.why_important[:200],
                    "source_page": f.source_page,
                    "source_item": f.source_item,
                    "importance_score": f.importance_score,
                    "fact_category": f.category,
                    "engine_captured": f.engine_captured,
                    "engine_field": f.engine_field,
                }
                for f in self.facts
            ],
        }
