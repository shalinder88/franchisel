"""
Unmodeled Fact Store — Preserve Important Discoveries No Engine Models Yet

This is the biggest gap filler. The reader-first lane will notice important things
that no current engine models. If those facts are only summarized on pages and never
promoted, the best part of extraction is lost.

Every serious fact gets stored with:
  - what it says
  - why it matters
  - what engine domain might own it
  - review priority

This keeps unusual but important content from disappearing just because
no engine exists yet. It also feeds the training loop — unmodeled facts
that appear across 3+ brands become candidates for new engines.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum


class ReviewPriority(str, Enum):
    STOP_SHIP = "stop_ship"           # blocks publish
    MAJOR_CAUTION = "major_caution"   # blocks high confidence
    REVIEWER_VISIBLE = "reviewer_visible"  # shown to reviewer
    BACKEND_ONLY = "backend_only"     # logged but not surfaced


@dataclass
class UnmodeledFact:
    """An important fact discovered by the reader that no engine captures."""
    fact_text: str
    why_it_matters: str
    source_page: int
    source_item: Optional[int] = None
    source_exhibit: Optional[str] = None
    candidate_engine_domain: str = "unknown"  # which engine SHOULD own this
    review_priority: ReviewPriority = ReviewPriority.REVIEWER_VISIBLE
    importance_score: float = 0.5
    fact_category: str = "other"  # economics, risk, control, performance, document


# Domains that have engines vs domains that don't yet
MODELED_DOMAINS = {
    "initial_fee", "ongoing_fee", "investment", "units", "fpr",
    "contract", "kill_switch", "supplier", "territory", "training",
    "litigation", "bankruptcy", "financial_statements",
}

# Known important fact patterns that should be promoted
PROMOTION_PATTERNS = {
    # Pattern → (candidate_engine_domain, review_priority, why_it_matters)
    r"right\s+of\s+first\s+refusal": ("agreement_clauses", ReviewPriority.MAJOR_CAUTION,
                                       "ROFR restricts franchisee exit options"),
    r"cross[- ]default": ("kill_switch", ReviewPriority.STOP_SHIP,
                          "Cross-default means one breach kills all agreements"),
    r"personal\s+guarant": ("agreement_clauses", ReviewPriority.MAJOR_CAUTION,
                            "Personal guaranty exposes individual assets"),
    r"spousal\s+guarant": ("agreement_clauses", ReviewPriority.STOP_SHIP,
                           "Spousal guaranty extends liability to spouse"),
    r"remodel|renovation\s+(?:requirement|obligation)": ("capital_obligations", ReviewPriority.MAJOR_CAUTION,
                                                          "Mandatory remodel creates unplanned capital expenditure"),
    r"minimum\s+(?:sales|revenue|performance)": ("kill_switch", ReviewPriority.STOP_SHIP,
                                                  "Minimum sales requirement is a termination trigger"),
    r"(?:exclusive|protected)\s+territory": ("territory", ReviewPriority.REVIEWER_VISIBLE,
                                              "Territory protection affects competitive position"),
    r"(?:non-?compete|covenant\s+not\s+to\s+compete)": ("kill_switch", ReviewPriority.MAJOR_CAUTION,
                                                          "Non-compete restricts post-termination activity"),
    r"mandatory\s+(?:arbitration|mediation)": ("agreement_clauses", ReviewPriority.REVIEWER_VISIBLE,
                                                "Mandatory arbitration limits legal options"),
    r"(?:liquidated|stipulated)\s+damage": ("kill_switch", ReviewPriority.STOP_SHIP,
                                             "Liquidated damages create preset termination penalty"),
    r"(?:source|supplier)\s+(?:restriction|requirement|approved)": ("supplier", ReviewPriority.REVIEWER_VISIBLE,
                                                                     "Supplier restrictions affect operating costs"),
    r"(?:technology|software|POS)\s+(?:fee|requirement|system)": ("technology_obligations", ReviewPriority.REVIEWER_VISIBLE,
                                                                    "Technology requirements add ongoing costs"),
}


class UnmodeledFactStore:
    """Stores and manages unmodeled facts across the extraction."""

    def __init__(self):
        self._facts: List[UnmodeledFact] = []
        self._dropped_objects: List[Dict[str, Any]] = []  # Silent-drop detector

    def add(self, fact_text: str, why_it_matters: str,
            source_page: int, source_item: Optional[int] = None,
            source_exhibit: Optional[str] = None,
            candidate_engine_domain: str = "unknown",
            review_priority: ReviewPriority = ReviewPriority.REVIEWER_VISIBLE,
            importance_score: float = 0.5,
            fact_category: str = "other") -> None:
        """Add an unmodeled fact."""
        self._facts.append(UnmodeledFact(
            fact_text=fact_text[:500],
            why_it_matters=why_it_matters[:300],
            source_page=source_page,
            source_item=source_item,
            source_exhibit=source_exhibit,
            candidate_engine_domain=candidate_engine_domain,
            review_priority=review_priority,
            importance_score=importance_score,
            fact_category=fact_category,
        ))

    def auto_classify(self, fact_text: str, source_page: int,
                      source_item: Optional[int] = None) -> Optional[UnmodeledFact]:
        """Auto-classify a fact using PROMOTION_PATTERNS.
        Returns the fact if it matches a known pattern, None if not important.
        """
        import re
        text_lower = fact_text.lower()
        for pattern, (domain, priority, why) in PROMOTION_PATTERNS.items():
            if re.search(pattern, text_lower):
                fact = UnmodeledFact(
                    fact_text=fact_text[:500],
                    why_it_matters=why,
                    source_page=source_page,
                    source_item=source_item,
                    candidate_engine_domain=domain,
                    review_priority=priority,
                    importance_score=0.8,
                    fact_category="risk" if priority in (ReviewPriority.STOP_SHIP, ReviewPriority.MAJOR_CAUTION) else "control",
                )
                self._facts.append(fact)
                return fact
        return None

    # ── Silent-Drop Detection ──

    def register_object_seen(self, object_type: str, object_id: str,
                             source: str, detail: str = "") -> None:
        """Register an object seen upstream (table, exhibit, note, etc.)
        Call register_object_consumed() when it's used by an engine.
        If not consumed, it becomes a dropped object.
        """
        self._dropped_objects.append({
            "type": object_type,
            "id": object_id,
            "source": source,
            "detail": detail,
            "consumed": False,
        })

    def register_object_consumed(self, object_id: str) -> None:
        """Mark an upstream object as consumed by an engine."""
        for obj in self._dropped_objects:
            if obj["id"] == object_id:
                obj["consumed"] = True

    def get_dropped_objects(self) -> List[Dict[str, Any]]:
        """Get all objects seen upstream but never consumed downstream."""
        return [obj for obj in self._dropped_objects if not obj["consumed"]]

    # ── Queries ──

    def get_stop_ship(self) -> List[UnmodeledFact]:
        """Get all stop-ship priority facts."""
        return [f for f in self._facts if f.review_priority == ReviewPriority.STOP_SHIP]

    def get_by_domain(self, domain: str) -> List[UnmodeledFact]:
        """Get facts for a candidate engine domain."""
        return [f for f in self._facts if f.candidate_engine_domain == domain]

    def get_unmodeled_domains(self) -> List[str]:
        """Get domains that have facts but no engine."""
        domains = set(f.candidate_engine_domain for f in self._facts)
        return sorted(domains - MODELED_DOMAINS)

    def summary(self) -> Dict[str, Any]:
        """Summary for output."""
        by_priority = {}
        by_domain = {}
        for f in self._facts:
            by_priority[f.review_priority.value] = by_priority.get(f.review_priority.value, 0) + 1
            by_domain[f.candidate_engine_domain] = by_domain.get(f.candidate_engine_domain, 0) + 1

        dropped = self.get_dropped_objects()
        return {
            "total_unmodeled": len(self._facts),
            "by_priority": by_priority,
            "by_domain": by_domain,
            "stop_ship_count": len(self.get_stop_ship()),
            "unmodeled_domains": self.get_unmodeled_domains(),
            "dropped_objects": len(dropped),
            "dropped_detail": [{"type": d["type"], "id": d["id"], "source": d["source"]}
                               for d in dropped[:20]],
        }

    def to_list(self) -> List[Dict[str, Any]]:
        """Serialize all facts for output."""
        return [
            {
                "fact_text": f.fact_text,
                "why_it_matters": f.why_it_matters,
                "source_page": f.source_page,
                "source_item": f.source_item,
                "candidate_engine_domain": f.candidate_engine_domain,
                "review_priority": f.review_priority.value,
                "importance_score": f.importance_score,
                "fact_category": f.fact_category,
            }
            for f in self._facts
        ]
