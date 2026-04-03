"""
Page Reader — Layer 1

Reads every page and produces a PageRead object.
Knows nothing about franchise law, items, fees, or royalties.
Its only job: read pages, preserve structure, detect headings and cross-references.

Every page emits 5 outputs:
  1. summary — what this page is about (one line)
  2. structured_facts — headings, dollar amounts, entities detected
  3. unresolved_pointers — "see Exhibit X", "see Item Y"
  4. tables — list of TableObject (populated later by table_importer)
  5. red_flags — PII violations, anomalies
"""

import re
from typing import List, Dict, Any
from .models import PageRead, PageType, CrossReference
from .page_classifier import classify_page


def detect_item_headings(text: str, page_num: int) -> List[Dict]:
    """Detect ITEM X headings on a page.

    Returns list of {item_num, position, is_real, title}.

    Filtering rules:
    - TOC entries (dots + page numbers) are excluded
    - Cross-references mid-sentence are excluded
    - Only headings where ITEM X starts the line and is followed by a title are real
    """
    headings = []
    for m in re.finditer(r'(?:^|\n)\s*(?:ITEM|Item)\s+(\d+)\s*[:\.\s\n]', text, re.MULTILINE):
        item_num = int(m.group(1))
        if not (1 <= item_num <= 23):
            continue

        after = text[m.end():m.end() + 200]
        first_line = after.split('\n')[0].strip() if after else ""

        # Filter: TOC entry (trailing dots + page number)
        if re.search(r'[\.\…]{3,}\s*\d+', first_line):
            continue
        if re.match(r'^[\.\…\s\d]+$', first_line):
            continue

        # Filter: cross-reference (followed by lowercase prose, not a title)
        if first_line and first_line[0].islower():
            continue

        # Filter: mid-sentence mention (preceded by substantial text on same line)
        line_start = text.rfind('\n', max(0, m.start() - 200), m.start())
        before_on_line = text[line_start + 1:m.start()].strip() if line_start >= 0 else ""
        if len(before_on_line) > 20 and not re.match(r'^[-–—\s\d\.]*$', before_on_line):
            continue

        headings.append({
            "item_num": item_num,
            "position": m.start(),
            "title": first_line[:80],
            "page": page_num,
        })

    return headings


def detect_cross_references(text: str, page_num: int) -> List[CrossReference]:
    """Find all cross-references on a page: 'see Exhibit X', 'see Item Y', etc."""
    refs = []
    for cr in re.finditer(
        r'[Ss]ee\s+((?:Exhibit|Item|Note|Table|Attachment|Schedule|Appendix)\s+[A-Z0-9\-]+)',
        text
    ):
        ref_text = cr.group(1).strip()
        # Determine target type
        target_type = "unknown"
        if ref_text.lower().startswith("exhibit"):
            target_type = "exhibit"
        elif ref_text.lower().startswith("item"):
            target_type = "item"
        elif ref_text.lower().startswith("note"):
            target_type = "note"
        elif ref_text.lower().startswith("table"):
            target_type = "table"

        refs.append(CrossReference(
            text=ref_text,
            source_page=page_num,
            target_type=target_type,
            target_id=ref_text,
        ))

    return refs


def check_pii(text: str, context: str = "") -> List[str]:
    """Check for PII patterns. Returns list of violation descriptions."""
    from .models import PII_PATTERNS, PII_BLOCKED_SECTIONS

    violations = []
    for blocked in PII_BLOCKED_SECTIONS:
        if blocked.lower() in context.lower():
            violations.append(f"BLOCKED_SECTION: {blocked}")
    for pattern in PII_PATTERNS:
        if re.search(pattern, text):
            violations.append(f"PII_DETECTED")
            break  # one PII flag is enough
    return violations


def read_all_pages(doc, geometry: Dict[str, Any] = None) -> List[PageRead]:
    """Layer 1: Read every page in the PDF.

    Returns a list of PageRead objects, one per page.
    Each PageRead has all 5 required outputs populated.

    The reader knows NOTHING about franchise law.
    It reads, classifies, detects headings, finds cross-references, flags PII.
    Tables are NOT populated here — that's table_importer's job.
    """
    total_pages = doc.page_count
    page_geom = (geometry or {}).get("page_geometry", [])
    page_reads = []

    for i in range(total_pages):
        text = doc[i].get_text()
        page_num = i + 1

        # Geometry hints
        geom = page_geom[i] if i < len(page_geom) else {}
        has_table_ind = geom.get("has_table_indicators", False)

        # 1. Classification
        page_type = classify_page(text, page_num, total_pages, has_table_ind)

        # 2. Headings
        headings = detect_item_headings(text, page_num)

        # 3. Cross-references
        pointers = detect_cross_references(text, page_num)

        # 4. PII check
        flags = check_pii(text, f"page {page_num} {page_type.value}")

        # 5. Summary
        first_line = text.strip().split('\n')[0][:80] if text.strip() else ""
        summary = f"p{page_num} [{page_type.value}] {first_line}"

        # 6. Structured facts (basic: dollar amounts, percentages, state names found)
        facts = {}
        dollar_amounts = re.findall(r'\$([\d,]+)', text)
        if dollar_amounts:
            facts["dollar_count"] = len(dollar_amounts)
        pct_amounts = re.findall(r'(\d+(?:\.\d+)?)\s*%', text)
        if pct_amounts:
            facts["percentage_count"] = len(pct_amounts)

        pr = PageRead(
            page_num=page_num,
            page_type=page_type,
            text=text,
            text_length=len(text),
            summary=summary,
            structured_facts=facts,
            unresolved_pointers=pointers,
            tables=[],  # populated by table_importer
            red_flags=flags,
            item_headings=headings,
            has_table_regions=has_table_ind,
        )

        page_reads.append(pr)

    return page_reads
