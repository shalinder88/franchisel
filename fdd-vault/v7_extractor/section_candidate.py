"""
Section Candidate — First-Class Object

A candidate location for an FDD item section.
Multiple candidates may exist per item. The path resolver picks the best one.

Separate from CrossReference — obligations matrix mentions are document graph
edges, not section starts.

Fields:
  item_number, page_pdf, page_fdd, bbox,
  source_type (toc_anchor / heading_candidate / content_match / recovery),
  heading_text, title_text, font_features, whitespace_features,
  in_table_region, toc_distance, confidence, rejection_reasons[]
"""

from dataclasses import dataclass, field
from typing import List, Optional, Tuple


@dataclass
class SectionCandidate:
    """A candidate start location for an FDD item."""
    item_number: int
    page_pdf: int  # 1-indexed PDF page number
    page_fdd: Optional[int] = None  # FDD page number (from footer)

    # Source
    source_type: str = "unknown"  # toc_anchor / heading_candidate / content_match / recovery
    heading_text: str = ""  # raw text of the heading if found
    title_text: str = ""  # the title after "ITEM X:" (e.g., "INITIAL FEES")

    # Geometry (from layout index)
    bbox: Optional[Tuple[float, float, float, float]] = None
    font_size: float = 0.0
    is_bold: bool = False
    is_centered: bool = False
    block_boundary: bool = False  # starts its own text block

    # Table context
    in_table_region: bool = False  # candidate is inside a detected table
    in_obligations_matrix: bool = False  # specifically in Item 9 table

    # TOC relationship
    toc_distance: int = 999  # absolute page distance from TOC target
    toc_page_target: Optional[int] = None  # what the TOC says

    # Scoring
    confidence: float = 0.0
    rejection_reasons: List[str] = field(default_factory=list)
    accepted: bool = False


def score_candidate(cand: SectionCandidate) -> float:
    """Score a section candidate. Higher = more likely to be the real item start.

    Positive signals:
      - near TOC page target
      - block boundary (starts own text block)
      - bold or display font
      - centered or heading-aligned
      - title text present after heading
      - content matches expected item type

    Negative signals:
      - inside table region
      - inside obligations matrix
      - body font (not bold/display)
      - too far from TOC target
      - dense page with many item mentions
    """
    score = 0.0

    # Positive
    if cand.source_type == "toc_anchor":
        score += 30
    if cand.toc_distance <= 1:
        score += 20
    elif cand.toc_distance <= 3:
        score += 10
    elif cand.toc_distance <= 5:
        score += 5
    if cand.block_boundary:
        score += 15
    if cand.is_bold:
        score += 10
    if cand.is_centered:
        score += 5
    if cand.title_text:
        score += 10
    if cand.source_type == "content_match":
        score += 15

    # Negative
    if cand.in_table_region:
        score -= 40
    if cand.in_obligations_matrix:
        score -= 50
    if cand.toc_distance > 10:
        score -= 15
    if not cand.is_bold and cand.font_size < 11:
        score -= 5

    cand.confidence = max(0, min(100, score)) / 100.0
    return score
