"""
Phase -1: Document Normalization

Before bootstrap, run a geometry/layout pass on the whole PDF.
For each page, capture:
  - text blocks with coordinates
  - line/drawing objects
  - repeated headers/footers
  - candidate heading regions
  - candidate table regions
  - whether page is text-native or image-heavy
  - reading-order hints

This phase is essential because PyMuPDF table detection alone
will miss many standard FDD tables.
"""

import pymupdf
import re
from typing import List, Dict, Any, Tuple
from .models import PageType


def normalize_document(doc) -> Dict[str, Any]:
    """Run Phase -1 geometry/layout pass on the whole PDF.

    Returns document-level metadata and per-page geometry index.
    The doc object stays open — caller is responsible for closing.
    """
    total_pages = doc.page_count
    page_geometry = []
    heading_candidates = []
    table_region_candidates = []
    header_footer_patterns = []

    for i in range(total_pages):
        page = doc[i]
        page_num = i + 1
        text = page.get_text()
        text_len = len(text.strip())

        # ── Text blocks with coordinates ──
        blocks = page.get_text("dict", flags=pymupdf.TEXT_PRESERVE_WHITESPACE)["blocks"]
        text_blocks = []
        for b in blocks:
            if b["type"] == 0:  # text block
                bbox = b["bbox"]  # (x0, y0, x1, y1)
                block_text = ""
                for line in b.get("lines", []):
                    for span in line.get("spans", []):
                        block_text += span.get("text", "")
                    block_text += "\n"
                text_blocks.append({
                    "bbox": bbox,
                    "text": block_text.strip()[:200],
                    "font_size": b["lines"][0]["spans"][0]["size"] if b.get("lines") and b["lines"][0].get("spans") else 0,
                })

        # ── Detect heading regions ──
        # Headings are text blocks with larger font size or ALL CAPS "ITEM X" pattern
        for tb in text_blocks:
            if re.search(r'(?:ITEM|Item)\s+\d+\s*[:\.\s]', tb["text"]):
                heading_candidates.append({
                    "page": page_num,
                    "text": tb["text"][:100],
                    "bbox": tb["bbox"],
                    "font_size": tb["font_size"],
                })

        # ── Detect table regions ──
        # Tables show as multiple text blocks aligned in columns
        # Also check for line/drawing objects (ruled tables)
        drawings = page.get_drawings()
        has_ruled_lines = len([d for d in drawings if d["type"] == "l"]) > 3

        # Check for aligned text blocks (column-like structure)
        x_positions = [tb["bbox"][0] for tb in text_blocks if tb["text"]]
        has_column_alignment = len(set(round(x, -1) for x in x_positions)) >= 3 if x_positions else False

        has_table_indicators = has_ruled_lines or has_column_alignment

        if has_table_indicators:
            table_region_candidates.append({
                "page": page_num,
                "has_ruled_lines": has_ruled_lines,
                "has_column_alignment": has_column_alignment,
            })

        # ── Image-heavy detection ──
        image_blocks = [b for b in blocks if b["type"] == 1]
        is_image_heavy = len(image_blocks) > 0 and text_len < 200

        page_geometry.append({
            "page_num": page_num,
            "text_length": text_len,
            "block_count": len(text_blocks),
            "has_table_indicators": has_table_indicators,
            "has_ruled_lines": has_ruled_lines,
            "has_column_alignment": has_column_alignment,
            "is_image_heavy": is_image_heavy,
            "heading_count": sum(1 for h in heading_candidates if h["page"] == page_num),
        })

    # ── Detect repeated headers/footers ──
    # Sample first lines of pages to find patterns
    first_lines = []
    last_lines = []
    for i in range(min(20, total_pages)):
        text = doc[i].get_text()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines:
            first_lines.append(lines[0][:50])
        if len(lines) >= 2:
            last_lines.append(lines[-1][:50])

    # Repeated patterns (appearing on >50% of sampled pages)
    from collections import Counter
    fl_counts = Counter(first_lines)
    ll_counts = Counter(last_lines)
    threshold = max(3, len(first_lines) // 2)
    header_footer_patterns = [
        {"type": "header", "text": text, "count": count}
        for text, count in fl_counts.items() if count >= threshold
    ] + [
        {"type": "footer", "text": text, "count": count}
        for text, count in ll_counts.items() if count >= threshold
    ]

    return {
        "total_pages": total_pages,
        "page_geometry": page_geometry,
        "heading_candidates": heading_candidates,
        "table_region_candidates": table_region_candidates,
        "header_footer_patterns": header_footer_patterns,
        "pages_with_tables": sum(1 for pg in page_geometry if pg["has_table_indicators"]),
        "pages_image_heavy": sum(1 for pg in page_geometry if pg["is_image_heavy"]),
    }
