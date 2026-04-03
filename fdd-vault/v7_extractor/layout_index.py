"""
Layout Index — Phase -1 Geometry/Layout Pass

Structural layer for robust section finding and table detection.
Uses PyMuPDF block/span geometry, NOT flattened text.

Outputs:
  - heading_candidate_index: blocks that look like item headings (bold, large font, isolated)
  - table_region_index: page regions where tables were detected
  - repeated_header_footer_index: text patterns repeated across pages
  - font_profile_index: font sizes and styles used across the document
  - page_geometry_index: per-page structural metadata
  - page_class_flags: likely financial/agreement/list/receipt pages
"""

import pymupdf
from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass, field


@dataclass
class LayoutBlock:
    """A text block with geometry from the PDF."""
    page_num: int
    bbox: Tuple[float, float, float, float]  # x0, y0, x1, y1
    text: str
    font_size: float
    is_bold: bool
    is_centered: bool  # relative to page width
    line_count: int
    block_idx: int


@dataclass
class HeadingLikeBlock:
    """A block that looks like an item heading based on layout features."""
    page_num: int
    bbox: Tuple[float, float, float, float]
    text: str
    font_size: float
    is_bold: bool
    is_centered: bool
    item_number: Optional[int] = None  # if we can identify which item
    confidence: float = 0.0
    in_table_region: bool = False


@dataclass
class TableRegion:
    """A page region where a table was detected."""
    page_num: int
    bbox: Tuple[float, float, float, float]
    has_ruled_lines: bool
    has_column_alignment: bool
    row_count_estimate: int = 0


@dataclass
class LayoutIndex:
    """Complete layout index for the document."""
    heading_candidates: List[HeadingLikeBlock] = field(default_factory=list)
    table_regions: List[TableRegion] = field(default_factory=list)
    header_footer_patterns: List[Dict] = field(default_factory=list)
    font_profile: Dict[float, int] = field(default_factory=dict)  # font_size → count
    page_geometry: List[Dict] = field(default_factory=list)
    page_count: int = 0

    def pages_with_tables(self) -> set:
        return set(tr.page_num for tr in self.table_regions)

    def heading_pages(self) -> Dict[int, List[HeadingLikeBlock]]:
        """Group heading candidates by page."""
        by_page: Dict[int, List[HeadingLikeBlock]] = {}
        for h in self.heading_candidates:
            by_page.setdefault(h.page_num, []).append(h)
        return by_page


def index_document_layout(doc) -> LayoutIndex:
    """Build the complete layout index for a PDF document.

    Reads block/span geometry from every page.
    Does NOT extract content — only structure.
    """
    total_pages = doc.page_count
    index = LayoutIndex(page_count=total_pages)

    page_width = doc[0].rect.width if total_pages > 0 else 612  # default letter width

    for i in range(total_pages):
        page = doc[i]
        page_num = i + 1

        # Get text blocks with geometry
        blocks_dict = page.get_text("dict", flags=pymupdf.TEXT_PRESERVE_WHITESPACE)
        blocks = blocks_dict.get("blocks", [])

        page_blocks: List[LayoutBlock] = []
        page_has_table = False

        for bi, b in enumerate(blocks):
            if b["type"] != 0:  # skip image blocks
                continue

            bbox = tuple(b["bbox"])
            lines = b.get("lines", [])
            if not lines:
                continue

            # Extract text and font features from first span
            full_text = ""
            max_font_size = 0
            has_bold = False
            for line in lines:
                for span in line.get("spans", []):
                    full_text += span.get("text", "")
                    size = span.get("size", 0)
                    if size > max_font_size:
                        max_font_size = size
                    flags = span.get("flags", 0)
                    if flags & 16:  # bold flag
                        has_bold = True
                full_text += "\n"

            full_text = full_text.strip()
            if not full_text:
                continue

            # Is this block centered?
            block_center = (bbox[0] + bbox[2]) / 2
            is_centered = abs(block_center - page_width / 2) < page_width * 0.15

            lb = LayoutBlock(
                page_num=page_num,
                bbox=bbox,
                text=full_text[:300],
                font_size=max_font_size,
                is_bold=has_bold,
                is_centered=is_centered,
                line_count=len(lines),
                block_idx=bi,
            )
            page_blocks.append(lb)

            # Track font profile
            if max_font_size > 0:
                index.font_profile[max_font_size] = index.font_profile.get(max_font_size, 0) + 1

            # Check if this block looks like an item heading
            text_upper = full_text.upper().strip()
            if text_upper.startswith("ITEM") and max_font_size >= 10:
                # Try to parse item number
                import re
                m = re.match(r'ITEM\s+(\d+)', text_upper)
                item_num = int(m.group(1)) if m and 1 <= int(m.group(1)) <= 23 else None

                heading = HeadingLikeBlock(
                    page_num=page_num,
                    bbox=bbox,
                    text=full_text[:100],
                    font_size=max_font_size,
                    is_bold=has_bold,
                    is_centered=is_centered,
                    item_number=item_num,
                )

                # Score confidence based on layout features
                conf = 0.3
                if has_bold: conf += 0.2
                if is_centered: conf += 0.1
                if max_font_size >= 12: conf += 0.2
                if lb.line_count <= 3: conf += 0.1  # short block = likely heading
                heading.confidence = min(1.0, conf)

                index.heading_candidates.append(heading)

        # Detect table regions on this page
        drawings = page.get_drawings()
        horiz_lines = [d for d in drawings if d.get("type") == "l"
                       and abs(d["rect"][1] - d["rect"][3]) < 2]
        if len(horiz_lines) >= 3:
            page_has_table = True
            # Use page bbox as table region (rough)
            index.table_regions.append(TableRegion(
                page_num=page_num,
                bbox=(0, 0, page_width, page.rect.height),
                has_ruled_lines=True,
                has_column_alignment=False,
            ))

        # Check column alignment (multiple blocks at similar x-positions)
        if len(page_blocks) >= 3:
            x_positions = [lb.bbox[0] for lb in page_blocks]
            from collections import Counter
            x_counts = Counter(round(x, -1) for x in x_positions)
            if len([x for x, c in x_counts.items() if c >= 3]) >= 2:
                if not page_has_table:
                    index.table_regions.append(TableRegion(
                        page_num=page_num,
                        bbox=(0, 0, page_width, page.rect.height),
                        has_ruled_lines=False,
                        has_column_alignment=True,
                    ))

        # Page geometry
        index.page_geometry.append({
            "page_num": page_num,
            "block_count": len(page_blocks),
            "has_table": page_has_table or page_num in index.pages_with_tables(),
            "max_font_size": max(lb.font_size for lb in page_blocks) if page_blocks else 0,
        })

    # Mark heading candidates that are inside table regions
    table_pages = index.pages_with_tables()
    for h in index.heading_candidates:
        if h.page_num in table_pages:
            h.in_table_region = True
            h.confidence *= 0.3  # heavy penalty

    # Detect repeated headers/footers
    from collections import Counter
    first_lines = []
    for pg in index.page_geometry[:min(30, total_pages)]:
        pn = pg["page_num"]
        if pn <= total_pages:
            text = doc[pn - 1].get_text()
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            if lines:
                first_lines.append(lines[0][:50])
    fl_counts = Counter(first_lines)
    for text, count in fl_counts.items():
        if count >= max(3, len(first_lines) // 3):
            index.header_footer_patterns.append({"type": "header", "text": text, "count": count})

    return index
