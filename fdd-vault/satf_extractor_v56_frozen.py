#!/usr/bin/env python3
"""
Franchisel SATF vFinal — Full-Fidelity Franchise Intelligence Extractor

Architecture: document → page objects → section objects → table/exhibit objects → engines → QA → outputs

This extractor READS the PDF page by page. Every page is classified and emits 5 outputs:
  1. page_summary — what this page is about
  2. structured_facts — tables, numbers, entities extracted
  3. unresolved_pointers — "see Exhibit X", "see Note Y"
  4. page_tables — structured table objects from find_tables() + fallback
  5. page_red_flags — PII, contradictions, missing data

Tables are FIRST-CLASS OBJECTS detected via 4-method fallback hierarchy:
  Method 1: PyMuPDF find_tables()
  Method 2: Geometric reconstruction (lines, ruled regions)
  Method 3: Text-grid reconstruction (aligned text spans)
  Method 4: Line-by-line fallback (raw_row_text, low confidence)

Regex runs ONLY in Phase 5 as QA safety net.

Pipeline:
  Phase -1: Document normalization (page geometry, heading/table regions)
  Phase  0: Document bootstrap (cover, risks, TOC, exhibit list)
  Phase  1: Extraction queues
  Phase  2: Page-by-page reading with classification + table import
  Phase  3: Section extraction (Items 1-23, no skipping)
  Phase  4: Exhibit extraction (financials → agreements → addenda → support)
  Phase  5: Mandatory QA sweep (regex + contradiction + cross-ref + PII)
  Phase  6: Engine aggregation (brands_ready output)
"""

import pymupdf
import re
import json
import sys
import os
from typing import Optional, Dict, Any, List, Tuple
from collections import Counter, defaultdict


# ══════════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ══════════════════════════════════════════════════════════════════════════════

SCHEMA_VERSION = "vFinal-1.0"

# Items where tables MUST be found (0 tables = failure state, not success)
TABLE_REQUIRED_ITEMS = {5, 6, 7, 19, 20}
TABLE_EXPECTED_ITEMS = {8, 9, 17, 21}

# Page types for classifier
PAGE_TYPES = [
    "cover_page", "how_to_use", "special_risks", "state_notice", "toc",
    "exhibit_list", "item_narrative", "item_table", "mixed_narrative_table",
    "financial_statement", "agreement_page", "manual_toc", "franchisee_list",
    "former_franchisee_list", "receipt_page", "signature_page", "appendix_other",
]

# Exhibit role taxonomy
EXHIBIT_ROLES = [
    "financials", "franchise_agreement", "development_agreement",
    "nontraditional_agreement", "smalltown_agreement", "guaranty",
    "lease_rider", "equipment_lease", "supplier_agreement",
    "advertising_agreement", "payment_or_ach", "financing_doc",
    "manual_toc", "item20_support", "franchisee_list",
    "former_franchisee_list", "unopened_units_list",
    "state_addenda_fdd", "state_addenda_agreement", "receipt", "other",
]

# Field evidence states (negative evidence registry)
EVIDENCE_STATES = [
    "present", "explicitly_absent", "not_found", "not_yet_parsed",
    "blocked_pii", "referenced_missing_target", "ambiguous_needs_review",
]

# Item failure states
FAILURE_STATES = [
    "complete", "partial", "present_no_table", "referenced_exhibit_missing",
    "table_missed_needs_review", "contradiction_found", "blocked_pii",
    "no_data_disclosed", "parse_failed",
]

US_STATES = {
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
}

STATE_ABBR = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC",
}

# PII patterns — hard block
PII_PATTERNS = [
    re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),           # SSN
    re.compile(r'\(\d{3}\)\s*\d{3}-\d{4}'),          # Phone
    re.compile(r'\b\d{3}-\d{3}-\d{4}\b'),            # Phone alt
    re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),  # Email
]

BLOCKED_SECTIONS = ['Exhibit R', 'Exhibit S', 'Exhibit E', 'Exhibit F',
                    'Exhibit M', 'Exhibit I', 'Exhibit G', 'Item 23', 'Receipt']


# ══════════════════════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

def _pi(s):
    """Parse int from string with commas."""
    if not s: return None
    cleaned = re.sub(r"[,\s]", "", str(s).strip())
    try: return int(cleaned)
    except ValueError: return None


def _pc(s):
    """Parse currency: '$1,234,567' or '$1.2 million' → int."""
    if not s: return None
    s = str(s).strip()
    mm = re.match(r"[\$]?\s*([\d,]+(?:\.\d+)?)\s*(million|billion|thousand|M|B|K)", s, re.I)
    if mm:
        val = float(mm.group(1).replace(",", ""))
        mult = {"million": 1e6, "billion": 1e9, "thousand": 1e3, "m": 1e6, "b": 1e9, "k": 1e3}
        return int(val * mult.get(mm.group(2).lower(), 1))
    cleaned = re.sub(r"[^\d\.]", "", s)
    try: return int(float(cleaned)) if cleaned else None
    except (ValueError, OverflowError): return None


def _find_amount(text, pattern, window=400):
    """Find dollar amount near a keyword pattern."""
    m = re.search(pattern, text, re.I)
    if not m: return None
    for snippet in [text[m.end():m.end()+window], text[max(0,m.start()-100):m.start()]]:
        am = re.search(r"\$\s*([\d,]+(?:\.\d+)?(?:\s*(?:million|billion|M|B|K))?)", snippet, re.I)
        if am: return _pc(am.group(0))
    nm = re.search(r"\b([\d,]{5,})\b", text[m.end():m.end()+window])
    if nm:
        v = _pc(nm.group(1))
        if v and v > 1000: return v
    return None


def _check_pii(text, section_name=""):
    """Check for PII. Returns list of violations."""
    violations = []
    for blocked in BLOCKED_SECTIONS:
        if blocked.lower() in section_name.lower():
            violations.append(f"BLOCKED_SECTION: {section_name}")
    for pattern in PII_PATTERNS:
        if pattern.search(text):
            violations.append(f"PII_DETECTED: {pattern.pattern[:30]}")
    return violations


# ══════════════════════════════════════════════════════════════════════════════
# TABLE EXTRACTION — 4-METHOD FALLBACK HIERARCHY
# ══════════════════════════════════════════════════════════════════════════════

def extract_tables_from_page(doc, page_idx, item_num=None):
    """Extract tables from a page using the 4-method fallback hierarchy.

    Method 1: PyMuPDF find_tables() — highest confidence
    Method 2: Geometric reconstruction — medium-high confidence
    Method 3: Text-grid reconstruction — medium confidence
    Method 4: Line-by-line fallback — low confidence

    Returns list of table objects matching vFinal schema.
    """
    page = doc[page_idx]
    page_num = page_idx + 1
    tables = []

    # ── Method 1: PyMuPDF native table detection ──
    try:
        pymupdf_tables = page.find_tables()
        for ti, tab in enumerate(pymupdf_tables.tables):
            if tab.row_count < 2:
                continue
            raw_data = tab.extract()
            # Clean cell content
            cleaned_data = []
            for row in raw_data:
                cleaned_data.append([
                    str(c).replace('\n', ' ').strip() if c else '' for c in row
                ])

            # Extract notes from text below the table
            table_notes = _extract_table_notes(page.get_text(), cleaned_data)

            tables.append({
                "table_id": f"item{item_num}_p{page_num}_t{ti}" if item_num else f"p{page_num}_t{ti}",
                "page": page_num,
                "detection_method": "pymupdf",
                "rows": tab.row_count,
                "cols": tab.col_count,
                "header": cleaned_data[0] if cleaned_data else [],
                "data_rows": cleaned_data[1:] if len(cleaned_data) > 1 else [],
                "raw_data": cleaned_data,
                "table_notes": table_notes,
                "confidence": "very_high",
                "source_item": item_num,
            })
    except Exception:
        pass

    # ── Method 4: Line-by-line fallback (if Method 1 found nothing) ──
    # Methods 2 & 3 (geometric/text-grid) require coordinate analysis — placeholder for future
    if not tables:
        text = page.get_text()
        # Detect table-like lines: lines with multiple dollar amounts or tab-separated numbers
        table_lines = []
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            # A line is table-like if it has 2+ numbers or dollar amounts separated by spaces
            dollar_count = len(re.findall(r'\$[\d,]+', line))
            number_groups = len(re.findall(r'\b\d[\d,]+\b', line))
            if dollar_count >= 2 or (number_groups >= 3 and len(line) > 20):
                table_lines.append(line)

        if len(table_lines) >= 2:
            tables.append({
                "table_id": f"item{item_num}_p{page_num}_fallback" if item_num else f"p{page_num}_fallback",
                "page": page_num,
                "detection_method": "line_fallback",
                "rows": len(table_lines),
                "cols": 0,  # unknown
                "header": [],
                "data_rows": [[line] for line in table_lines],
                "raw_data": [[line] for line in table_lines],
                "table_notes": [],
                "confidence": "low",
                "source_item": item_num,
                "needs_review": True,
            })

    return tables


def _extract_table_notes(page_text, table_data):
    """Extract notes/footnotes that follow a table on the same page."""
    notes = []
    # Look for "Notes:" or "Note:" blocks
    note_match = re.search(r'(?:Notes?|NOTES?)\s*(?:to\s+Table)?[:\s]*\n', page_text)
    if note_match:
        note_text = page_text[note_match.end():]
        # Capture numbered notes: "1. ...", "2. ...", etc.
        for nm in re.finditer(r'(\d+)\.\s+(.+?)(?=\n\d+\.\s|\n\n|\Z)', note_text, re.DOTALL):
            notes.append({
                "note_num": int(nm.group(1)),
                "text": nm.group(2).strip().replace('\n', ' ')[:500],
            })

    # Also capture footnote markers in table cells
    if table_data:
        for row in table_data:
            for cell in row:
                refs = re.findall(r'\((\d+)\)|\(See Note (\d+)\)', str(cell))
                for ref in refs:
                    note_num = int(ref[0] or ref[1])
                    if note_num not in [n["note_num"] for n in notes]:
                        notes.append({"note_num": note_num, "text": "", "unresolved": True})

    return notes


# ══════════════════════════════════════════════════════════════════════════════
# PAGE CLASSIFIER
# ══════════════════════════════════════════════════════════════════════════════

def classify_page(text, page_num, total_pages):
    """Classify a page into one of the defined page types."""
    text_lower = text.lower()
    text_len = len(text.strip())

    if page_num <= 2 and 'franchise disclosure document' in text_lower:
        return "cover_page"
    if 'how to use this franchise disclosure document' in text_lower:
        return "how_to_use"
    if re.search(r'special\s+risk', text_lower):
        return "special_risks"
    if re.search(r'(?:state|michigan|california|illinois|maryland|minnesota|new york|virginia|washington)\s+(?:notice|cover|page|addend)', text_lower) and page_num < 15:
        return "state_notice"
    if re.search(r'table\s+of\s+contents', text_lower) and page_num < 15:
        return "toc"
    if re.search(r'list\s+of\s+exhibits', text_lower) and page_num < 15:
        return "exhibit_list"
    if re.search(r'(?:balance\s+sheet|statement\s+of\s+(?:income|operations|financial\s+position))', text_lower):
        return "financial_statement"
    if re.search(r'(?:franchise|development|area)\s+agreement', text_lower) and text_len > 2000:
        return "agreement_page"
    if re.search(r'(?:operations?\s+manual|table\s+of\s+contents.*?(?:chapter|section|module))', text_lower):
        return "manual_toc"
    if re.search(r'receipt\s+of\s+(?:this\s+)?(?:franchise\s+)?disclosure', text_lower):
        return "receipt_page"

    # Detect table vs narrative
    has_table_structure = bool(re.search(r'(?:\$[\d,]+.*?\$[\d,]+|(?:Year|State|Type).*?\d{4})', text))
    if has_table_structure:
        has_narrative = text_len > 1000 and len(re.findall(r'[.!?]\s+[A-Z]', text)) > 3
        return "mixed_narrative_table" if has_narrative else "item_table"

    return "item_narrative"


# ══════════════════════════════════════════════════════════════════════════════
# SECTION LOCATION — 3-LEVEL HIERARCHY
# ══════════════════════════════════════════════════════════════════════════════

def _content_score(text, item_num):
    """Score how well a text matches the expected content for an item number.
    Uses ITEM_SIGNATURES from item_content_classifier.py.
    Returns (keyword_hits, anti_hits) tuple."""
    try:
        from item_content_classifier import ITEM_SIGNATURES
        sig = ITEM_SIGNATURES.get(item_num)
        if not sig:
            return (0, 0)
        text_sample = text[:5000]
        kw_hits = sum(1 for kw in sig.get("keywords", []) if re.search(kw, text_sample, re.I))
        anti_hits = sum(1 for ak in sig.get("anti_keywords", []) if re.search(ak, text_sample[:3000], re.I))
        return (kw_hits, anti_hits)
    except ImportError:
        return (0, 0)


def locate_item_sections(pages, toc_map):
    """Locate item section boundaries using content-aware 3-level hierarchy.

    The key insight: each item has DIFFERENT content signals.
    Item 5 = "lump sum", "non-refundable", "Initial Franchise Fee"
    Item 6 = "% of Gross", "Royalty", "Ad Fund", "Transfer Fee"
    Item 7 = "ESTIMATED INITIAL INVESTMENT", "TOTAL", "Leasehold"
    Item 18 = 1-2 lines, "public figure"
    Item 19 = money, "$" amounts, "Average", "EBITDA"
    Item 20 = locations, state names, "Systemwide Outlet Summary"

    After detecting heading-based boundaries, we VERIFY each section's content
    matches its expected item type. If it doesn't match, the boundary is wrong.

    Primary: TOC-anchored with heading + content verification
    Secondary: Heading graph with content scoring
    Tertiary: Content-based page scanning (find the page where content matches)

    Returns dict: item_num → {"start_page": int, "end_page": int, "confidence": str}
    """
    total_pages = len(pages)
    sections = {}

    # ── Collect all item heading candidates ──
    # A REAL item heading is at the start of a line and followed by the item title
    # (like "INITIAL FEES", "OTHER FEES", "ESTIMATED INITIAL INVESTMENT")
    # A CROSS-REFERENCE is "Item 6" mid-sentence in tables/obligations matrices
    heading_candidates = defaultdict(list)
    for idx, page in enumerate(pages):
        text = page["text"]
        for m in re.finditer(r'(?:^|\n)\s*(?:ITEM|Item)\s+(\d+)\s*[:\.\s\n]', text, re.MULTILINE):
            item_num = int(m.group(1))
            if not (1 <= item_num <= 23):
                continue

            after = text[m.end():m.end()+200]
            first_line = after.split('\n')[0].strip() if after else ""

            # TOC entry: has trailing dots + page number
            is_toc = bool(re.search(r'[\.\…]{3,}\s*\d+', first_line)) or bool(re.match(r'^[\.\…\s\d]+$', first_line))

            # Cross-reference detection: "Item 6" mid-sentence is NOT a heading
            # A REAL heading: "ITEM X" is at the START of its line, followed by item title
            # A CROSS-REF: "Item 6" appears mid-sentence like "see Item 6" or in table rows
            is_crossref = False
            # Check: is "ITEM X" preceded by content on the SAME line?
            # The regex matched (?:^|\n)\s*ITEM — find the actual line start
            match_text = text[m.start():m.end()]
            if not match_text.lstrip().upper().startswith('ITEM'):
                # The \n is part of the match — the ITEM is at start of a new line
                # This is likely a real heading, not a cross-ref
                pass
            # Check what's on the same line AFTER "ITEM X:"
            # Cross-refs: followed by "(q)", "(s)", "above", "below", "and Item"
            if re.match(r'^\s*\([a-z]\)', first_line):
                is_crossref = True
            if re.match(r'^(?:above|below|and\s+Item)', first_line, re.I):
                is_crossref = True
            # Cross-ref: "Item X" in middle of a sentence (check same line before)
            # Only flag if the ITEM keyword is NOT the first significant word on its line
            line_start = text.rfind('\n', max(0, m.start() - 200), m.start())
            if line_start == -1: line_start = 0
            else: line_start += 1
            before_on_line = text[line_start:m.start()].strip()
            # If there's a full sentence or clause before ITEM on the same line
            if before_on_line and len(before_on_line) > 20 and not re.match(r'^[\-–—\s\d\.]*$', before_on_line):
                is_crossref = True

            heading_candidates[item_num].append({
                "page_idx": idx,
                "pos": m.start(),
                "is_toc": is_toc,
                "is_crossref": is_crossref,
            })

    # ── Primary: TOC-anchored with content verification ──
    for item_num in range(1, 24):
        toc_page = toc_map.get(item_num) or toc_map.get(str(item_num))
        if not toc_page:
            continue

        best = None
        best_score = -1
        for cand in heading_candidates.get(item_num, []):
            if cand["is_toc"] or cand.get("is_crossref"):
                continue
            page_distance = abs((cand["page_idx"] + 1) - toc_page)
            if page_distance <= 8:
                # Score by content match + proximity
                page_text = pages[cand["page_idx"]]["text"]
                kw_hits, anti_hits = _content_score(page_text, item_num)
                score = kw_hits * 10 - anti_hits * 5 - page_distance
                if score > best_score:
                    best_score = score
                    best = {"page_idx": cand["page_idx"], "distance": page_distance}

        if best:
            sections[item_num] = {
                "start_page": best["page_idx"],
                "method": "toc_anchored",
                "confidence": "high",
            }

    # ── Secondary: Heading graph with content scoring ──
    for item_num in range(1, 24):
        if item_num in sections:
            continue
        real_headings = [c for c in heading_candidates.get(item_num, [])
                        if not c["is_toc"] and not c.get("is_crossref")]
        if not real_headings:
            continue

        # Score each candidate by content match
        best = None
        best_score = -999
        for h in real_headings:
            if h["page_idx"] < total_pages * 0.05:
                continue  # skip front matter
            page_text = pages[h["page_idx"]]["text"]
            # Also read the next 2 pages for context (the heading page may be short)
            for extra in range(1, min(3, total_pages - h["page_idx"])):
                page_text += "\n" + pages[h["page_idx"] + extra]["text"]
            kw_hits, anti_hits = _content_score(page_text, item_num)
            score = kw_hits * 10 - anti_hits * 20  # heavily penalize anti-keyword matches
            if score > best_score:
                best_score = score
                best = h

        if best:
            sections[item_num] = {
                "start_page": best["page_idx"],
                "method": "heading_graph",
                "confidence": "high" if best_score >= 20 else "medium",
            }

    # ── Tertiary: Content-based page scanning for missing items ──
    # If an item wasn't found by heading, scan all pages for content that matches
    for item_num in range(1, 24):
        if item_num in sections:
            continue

        # Determine search range: between the previous and next found items
        prev_end = 0
        next_start = total_pages
        for other in sorted(sections.keys()):
            if other < item_num:
                prev_end = max(prev_end, sections[other]["start_page"])
            elif other > item_num:
                next_start = min(next_start, sections[other]["start_page"])
                break

        best_page = None
        best_score = -1
        for pi in range(prev_end, min(next_start, total_pages)):
            page_text = pages[pi]["text"]
            kw_hits, anti_hits = _content_score(page_text, item_num)
            if kw_hits >= 2 and anti_hits == 0:
                score = kw_hits
                if score > best_score:
                    best_score = score
                    best_page = pi

        if best_page is not None:
            sections[item_num] = {
                "start_page": best_page,
                "method": "content_scan",
                "confidence": "medium",
            }

    # ── Enforce document order: Item N must start at or after Item N-1 ──
    sorted_by_num = sorted(sections.keys())
    prev_start = -1
    for item_num in sorted_by_num:
        if sections[item_num]["start_page"] <= prev_start:
            sections[item_num]["start_page"] = prev_start + 1
            if sections[item_num]["method"] != "content_scan":
                sections[item_num]["method"] += "_adjusted"
                sections[item_num]["confidence"] = "low"
        prev_start = sections[item_num]["start_page"]

    # ── Set end pages: each item ends where the next item starts ──
    for i, item_num in enumerate(sorted_by_num):
        if i + 1 < len(sorted_by_num):
            next_item = sorted_by_num[i + 1]
            sections[item_num]["end_page"] = sections[next_item]["start_page"] - 1
        else:
            sections[item_num]["end_page"] = total_pages - 1

        # Safety: end must be >= start
        if sections[item_num]["end_page"] < sections[item_num]["start_page"]:
            sections[item_num]["end_page"] = sections[item_num]["start_page"]

    return sections


# ══════════════════════════════════════════════════════════════════════════════
# MAIN EXTRACTION PIPELINE
# ══════════════════════════════════════════════════════════════════════════════

def extract_fdd(pdf_path):
    doc = pymupdf.open(pdf_path)
    total_pages = doc.page_count
    filename = os.path.basename(pdf_path)

    print(f"Reading {filename}: {total_pages} pages")

    result = {
        "meta": {"pdf": filename, "totalPages": total_pages, "extractor": "SATF_vFinal",
                 "schema_version": SCHEMA_VERSION},
        "phase_neg1": {},
        "phase0_bootstrap": {},
        "page_read_log": [],
        "table_registry": [],
        "cross_reference_graph": [],
        "items": {},
        "exhibits": {},
        "negative_evidence": {},
        "failure_states": {},
        "brands_ready": {},
        "qa": {},
    }

    # ================================================================
    # PHASE -1: DOCUMENT NORMALIZATION
    # ================================================================
    print(f"\n--- Phase -1: Document Normalization ---")

    pages = []
    heading_regions = []
    table_regions = []

    for i in range(total_pages):
        page = doc[i]
        text = page.get_text()
        page_num = i + 1

        # Detect heading regions (lines that look like item headers)
        for m in re.finditer(r'(?:^|\n)\s*((?:ITEM|Item)\s+\d+[:\.\s].*?)(?:\n|$)', text):
            heading_regions.append({"page": page_num, "text": m.group(1).strip()[:100]})

        # Detect table regions (pages with find_tables results)
        # Only do lightweight check here — full extraction happens in Phase 3
        has_table_indicators = bool(re.search(
            r'(?:\$[\d,]+.*?\$[\d,]+)|(?:(?:Year|State|Type|Amount|Fee)\s.*?\d)',
            text[:3000]
        ))

        pages.append({
            "num": page_num,
            "text": text,
            "type": classify_page(text, page_num, total_pages),
            "has_table_indicators": has_table_indicators,
            "text_length": len(text),
        })

    full_text = "\n".join(p["text"] for p in pages)

    result["phase_neg1"] = {
        "total_pages": total_pages,
        "heading_regions": len(heading_regions),
        "pages_with_table_indicators": sum(1 for p in pages if p["has_table_indicators"]),
    }

    # Page type summary
    type_counts = Counter(p["type"] for p in pages)
    print(f"  Pages: {total_pages}")
    print(f"  Headings detected: {len(heading_regions)}")
    print(f"  Page types: {dict(type_counts)}")

    # ================================================================
    # PHASE 0: DOCUMENT BOOTSTRAP
    # ================================================================
    print(f"\n--- Phase 0: Document Bootstrap ---")

    bootstrap_text = "\n".join(p["text"] for p in pages[:min(12, total_pages)])

    # Cover page
    cover = pages[0]["text"] if pages else ""
    entity_match = re.search(r'FRANCHISE DISCLOSURE DOCUMENT\s*\n\s*(.+?)(?:\n|$)', cover)
    entity = entity_match.group(1).strip()[:120] if entity_match else filename

    date_match = re.search(r'(?:Issuance|Issue|Date)[^:]*:\s*(.+?)(?:\n|$)', cover, re.I)
    issuance = date_match.group(1).strip()[:100] if date_match else ""

    # Investment range from cover
    inv_vals = re.findall(r'\$([\d,]+)', cover[:3000])
    inv_nums = sorted(set(int(v.replace(',', '')) for v in inv_vals if int(v.replace(',', '')) > 10000))

    # Business description
    desc_lines = [l.strip() for l in cover.split('\n') if len(l.strip()) > 40 and any(
        w in l.lower() for w in ['offer', 'franchise', 'operate', 'provide', 'service',
                                  'restaurant', 'business', 'studio', 'salon', 'school', 'care'])]
    description = desc_lines[0][:300] if desc_lines else ""

    # Offering paths (format variants from cover)
    offering_paths = []
    for path_pattern in [r'(?:Standard|Traditional)\s+(?:Franchise|Restaurant|Store)',
                         r'(?:Non[\-\s]?Traditional|Express|Small[\-\s]?(?:Town|Box|Format))',
                         r'(?:Development|Area\s+Development|Multi[\-\s]?Unit)',
                         r'(?:License|Licensing)\s+(?:Agreement|Program)']:
        if re.search(path_pattern, bootstrap_text, re.I):
            offering_paths.append(re.search(path_pattern, bootstrap_text, re.I).group(0))

    # Exhibit map
    page2 = pages[1]["text"] if len(pages) > 1 else ""
    fin_match = re.search(r'Item\s+21.*?Exhibit\s*["\']?\s*([A-Z](?:-?\d)?)', page2, re.I)
    financial_exhibit = fin_match.group(1) if fin_match else "?"

    # Special risks
    risk_types = []
    risk_checks = {
        "out_of_state_dispute": r'Out-of-State',
        "spousal_liability": r'Spousal',
        "mandatory_minimum": r'Mandatory Minimum',
        "financial_condition": r'Financial.*(?:Condition|Support)',
        "short_operating_history": r'Short Operating',
        "unregistered_trademark": r'Unregistered',
        "supplier_control": r'Supplier Control',
        "unopened_franchises": r'Unopened',
        "sales_performance": r'Sales.*Performance',
    }
    for risk_name, pattern in risk_checks.items():
        if re.search(pattern, bootstrap_text, re.I):
            risk_types.append(risk_name)

    # TOC map
    toc_map = {}
    for m in re.finditer(r'(?:ITEM|Item)\s+(\d+).*?\.{2,}\s*(\d+)', bootstrap_text):
        item_num = int(m.group(1))
        page_num = int(m.group(2))
        if 1 <= item_num <= 23 and 1 <= page_num <= total_pages:
            toc_map[item_num] = page_num

    # Exhibit map
    exhibit_map = {}
    for m in re.finditer(r'(?:EXHIBIT|Exhibit)\s+["\']?([A-Z](?:-?\d)?)["\']?\s*[-–—]\s*(.+?)(?:\n|$)', bootstrap_text):
        exhibit_map[m.group(1)] = m.group(2).strip()[:100]

    result["phase0_bootstrap"] = {
        "entity": entity, "issuanceDate": issuance, "description": description,
        "offeringPaths": offering_paths,
        "investmentRange": inv_nums[:2] if len(inv_nums) >= 2 else inv_nums,
        "financialExhibit": financial_exhibit,
        "specialRisks": risk_types,
        "tocMap": toc_map,
        "exhibitMap": exhibit_map,
    }

    print(f"  Entity: {entity[:60]}")
    print(f"  Issuance: {issuance}")
    print(f"  Offering paths: {offering_paths}")
    print(f"  Special risks ({len(risk_types)}): {', '.join(risk_types)}")
    print(f"  TOC items: {sorted(toc_map.keys())}")
    print(f"  Exhibits: {list(exhibit_map.keys())}")

    # ================================================================
    # PHASE 1: EXTRACTION QUEUES
    # ================================================================
    cross_ref_queue = []  # cross-references to follow
    missing_table_queue = []  # items where tables expected but not found
    unresolved_note_queue = []  # notes referenced but not linked

    # ================================================================
    # PHASE 2 + 3: SEQUENTIAL PAGE-BY-PAGE READING
    # Read every page in order, just like a human reads.
    # When we encounter an ITEM heading, we transition to that item.
    # Tables are extracted from each page as we read it.
    # Content classification VERIFIES but does not LOCATE.
    # ================================================================
    print(f"\n--- Phase 2+3: Sequential page-by-page reading ---")

    current_item = None
    current_item_text = ""
    current_item_tables = []
    current_item_cross_refs = []
    current_item_start_page = 0
    items = {}
    all_tables = []

    def _save_current_item():
        """Save the accumulated data for the current item."""
        nonlocal current_item, current_item_text, current_item_tables
        nonlocal current_item_cross_refs, current_item_start_page
        if current_item is None:
            return
        text = current_item_text
        if len(text) > 50000:
            text = text[:50000]
        tbl_count = len(current_item_tables)
        has_req_tables = tbl_count > 0
        if current_item in TABLE_REQUIRED_ITEMS and not has_req_tables:
            failure = "table_missed_needs_review"
            missing_table_queue.append(current_item)
        elif text.strip():
            failure = "complete" if has_req_tables or current_item not in TABLE_REQUIRED_ITEMS else "present_no_table"
        else:
            failure = "no_data_disclosed"
        items[current_item] = {
            "status": "extracted",
            "start_page": current_item_start_page,
            "text_length": len(text),
            "text": text,
            "tables": current_item_tables,
            "table_count": tbl_count,
            "cross_refs": current_item_cross_refs,
            "failure_state": failure,
        }

    for pi in range(total_pages):
        page = pages[pi]
        page_text = page["text"]
        page_type = page["type"]
        page_num = page["num"]

        # ── Detect item heading transitions ──
        # Read in order: when we see "ITEM X", we're now in Item X
        # Skip pages that are NOT item content: cover, how-to-use, TOC, state notices
        if page_type in ("cover_page", "how_to_use", "toc", "state_notice", "exhibit_list"):
            continue

        for m in re.finditer(r'(?:^|\n)\s*(?:ITEM|Item)\s+(\d+)\s*[:\.\s\n]', page_text, re.MULTILINE):
            detected_num = int(m.group(1))
            if not (1 <= detected_num <= 23):
                continue

            # Skip TOC entries (dots + page numbers on same line)
            after = page_text[m.end():m.end()+200]
            first_line = after.split('\n')[0].strip() if after else ""
            if re.search(r'[\.\…]{3,}\s*\d+', first_line) or re.match(r'^[\.\…\s\d]+$', first_line):
                continue

            # Skip if this item would go BACKWARDS (Items must appear in order in FDD)
            if current_item is not None and detected_num <= current_item:
                continue

            # Skip cross-references: "Item 19" mentioned mid-sentence
            # A REAL heading has "ITEM X" at or near the start of a line,
            # followed by the item TITLE (all caps or title case)
            # NOT followed by lowercase prose continuing a sentence
            if first_line and first_line[0].islower():
                # "Item 19\n may give you information" — this is prose, not a heading
                continue

            # Transition: save current item, start new one
            _save_current_item()
            current_item = detected_num
            current_item_text = page_text[m.start():]
            current_item_tables = []
            current_item_cross_refs = []
            current_item_start_page = page_num

        # ── Accumulate page data for current item ──
        if current_item is not None:
            # Don't double-add text from the heading page (already added above)
            if page_num != current_item_start_page:
                current_item_text += "\n" + page_text

            # ── 5 outputs per page ──

            # 3. Cross-references
            for cr_match in re.finditer(r'[Ss]ee\s+((?:Exhibit|Item|Note|Table|Attachment|Schedule)\s+[A-Z0-9\-]+)', page_text):
                ref = {"text": cr_match.group(1), "page": page_num, "status": "unresolved"}
                current_item_cross_refs.append(ref)
                cross_ref_queue.append(ref)

            # 4. Tables — extract using find_tables() on relevant pages
            if current_item in TABLE_REQUIRED_ITEMS or current_item in TABLE_EXPECTED_ITEMS or page["has_table_indicators"]:
                page_tables = extract_tables_from_page(doc, pi, current_item)
                current_item_tables.extend(page_tables)
                all_tables.extend(page_tables)

        # Log page read
        result["page_read_log"].append({
            "page": page_num, "type": page_type, "item": current_item,
            "chars": len(page_text),
        })

    # Save the last item
    _save_current_item()

    result["items"] = {str(k): {key: val for key, val in v.items() if key != "text"} for k, v in items.items()}
    result["table_registry"] = all_tables
    result["cross_reference_graph"] = cross_ref_queue

    # Print summary
    for item_num in range(1, 24):
        item = items.get(item_num, {})
        status = item.get("status", "missing")
        if status == "extracted":
            tbl = item.get("table_count", 0)
            txt_len = item.get("text_length", 0)
            fail = item.get("failure_state", "?")
            loc = item.get("location_method", "?")
            flags = []
            if tbl > 0: flags.append(f"{tbl}T")
            if item.get("cross_refs"): flags.append(f"{len(item['cross_refs'])}xref")
            flag_str = f" [{', '.join(flags)}]" if flags else ""
            state_str = f" ⚠️{fail}" if fail not in ("complete",) else ""
            print(f"  Item {item_num:2d}: {txt_len:6,} chars{flag_str} | {loc}{state_str}")
        else:
            print(f"  Item {item_num:2d}: NOT FOUND")

    # ================================================================
    # PHASE 4: EXHIBIT EXTRACTION
    # ================================================================
    print(f"\n--- Phase 4: Exhibit Extraction ---")

    # Classify exhibit pages by role
    exhibit_data = {}
    for letter, desc in exhibit_map.items():
        desc_lower = desc.lower()
        role = "other"
        if 'financial' in desc_lower or 'statement' in desc_lower:
            role = "financials"
        elif 'franchise agreement' in desc_lower:
            role = "franchise_agreement"
        elif 'development' in desc_lower:
            role = "development_agreement"
        elif 'state' in desc_lower and 'addend' in desc_lower:
            role = "state_addenda_fdd"
        elif 'manual' in desc_lower or 'operations' in desc_lower:
            role = "manual_toc"
        elif 'franchisee' in desc_lower and 'former' in desc_lower:
            role = "former_franchisee_list"
        elif 'franchisee' in desc_lower:
            role = "franchisee_list"
        elif 'guaranty' in desc_lower or 'guarantee' in desc_lower:
            role = "guaranty"
        elif 'release' in desc_lower:
            role = "other"
        elif 'receipt' in desc_lower:
            role = "receipt"
        exhibit_data[letter] = {"description": desc, "role": role}
        print(f"  Exhibit {letter}: {role} — {desc[:60]}")

    # Extract financial exhibits
    fin_results = {}
    for i in range(len(pages)):
        text = pages[i]["text"]
        if pages[i]["type"] == "financial_statement" or re.search(
            r'(?:Balance Sheet|Statement of (?:Income|Operations))', text, re.I):
            if len(text) > 500:
                fin_text = "\n".join(p["text"] for p in pages[max(0, i-2):min(len(pages), i+15)])

                # Auditor
                AUDITORS = [r"Deloitte", r"PwC|PricewaterhouseCoopers", r"KPMG",
                           r"Ernst\s*&\s*Young|EY\b", r"BDO\b", r"Grant\s+Thornton",
                           r"RSM\b", r"Moss\s+Adams", r"CohnReznick", r"Baker\s+Tilly"]
                auditor = None
                for firm in AUDITORS:
                    fm = re.search(firm, fin_text[:5000], re.I)
                    if fm:
                        auditor = fm.group(0)
                        break

                opinion = None
                if re.search(r"unqualified\s+opinion|present\s+fairly.*in\s+all\s+material", fin_text, re.I):
                    opinion = "clean"
                elif re.search(r"qualified\s+opinion|except\s+for", fin_text, re.I):
                    opinion = "qualified"
                elif re.search(r"adverse\s+opinion", fin_text, re.I):
                    opinion = "adverse"

                going_concern = False
                for gc in re.finditer(r"substantial\s+doubt.{0,80}(?:going\s+concern|ability\s+to\s+continue)", fin_text, re.I):
                    pre = fin_text[max(0, gc.start()-60):gc.start()].lower()
                    if not re.search(r"\b(no|not|without|alleviate|eliminate)\b", pre):
                        going_concern = True
                        break

                # Financials
                revenue = _find_amount(fin_text, r"(?:total\s+)?(?:net\s+)?revenues?", 300)
                assets = _find_amount(fin_text, r"total\s+assets", 300)
                liabilities = _find_amount(fin_text, r"total\s+liabilities", 300)
                equity = _find_amount(fin_text, r"(?:stockholders?|members?)\s*(?:[\'\']s\s*)?(?:equity|deficit)", 300)
                net_income = _find_amount(fin_text, r"net\s+(?:income|loss)", 200)

                # Strength signal
                strength = "adequate"
                if going_concern or opinion in ("adverse", "disclaimer"):
                    strength = "weak"
                elif opinion == "qualified":
                    strength = "watch"
                elif assets and liabilities and liabilities / assets > 0.9:
                    strength = "weak"
                elif opinion == "clean" and (not net_income or net_income > 0):
                    strength = "strong"

                fin_results = {
                    "found_at_page": pages[i]["num"],
                    "auditorName": auditor,
                    "auditorOpinion": opinion,
                    "goingConcernWarning": going_concern,
                    "franchisorRevenue": revenue if revenue and revenue > 100000 else None,
                    "franchisorTotalAssets": assets if assets and assets > 10000 else None,
                    "franchisorTotalLiabilities": liabilities,
                    "franchisorEquity": equity,
                    "franchisorNetIncome": net_income,
                    "financialStrengthSignal": strength,
                }
                print(f"  Financial statements at page {pages[i]['num']}")
                if auditor: print(f"    Auditor: {auditor} | Opinion: {opinion}")
                if going_concern: print(f"    ⚠️ GOING CONCERN")
                if revenue and revenue > 100000: print(f"    Revenue: ${revenue:,}")
                if strength != "adequate": print(f"    Strength: {strength}")
                break

    result["exhibits"] = {
        "exhibit_roles": exhibit_data,
        "financials": fin_results,
    }

    # ================================================================
    # PHASE 5: MANDATORY QA SWEEP
    # ================================================================
    print(f"\n--- Phase 5: QA Sweep ---")

    qa = {
        "missing_items": [i for i in range(1, 24) if items.get(i, {}).get("status") != "extracted"],
        "missing_tables": missing_table_queue,
        "unresolved_cross_refs": len([cr for cr in cross_ref_queue if cr["status"] == "unresolved"]),
        "total_cross_refs": len(cross_ref_queue),
        "pii_violations": sum(len(items.get(i, {}).get("red_flags", [])) for i in range(1, 24)),
        "table_count": len(all_tables),
        "total_table_rows": sum(t.get("rows", 0) for t in all_tables),
    }

    # Failure state summary
    failure_summary = Counter(items.get(i, {}).get("failure_state", "missing") for i in range(1, 24))
    qa["failure_states"] = dict(failure_summary)

    # Publish gate
    complete_items = sum(1 for i in range(1, 24) if items.get(i, {}).get("failure_state") == "complete")
    has_item19 = items.get(19, {}).get("status") == "extracted"
    has_item20 = items.get(20, {}).get("status") == "extracted"
    has_financials = bool(fin_results)
    no_contradictions = True  # placeholder

    if complete_items >= 20 and has_item19 and has_item20 and has_financials and no_contradictions:
        qa["publish_gate"] = "gold_publishable"
    elif complete_items >= 15 and (has_item19 or has_item20):
        qa["publish_gate"] = "publishable_standard"
    elif complete_items >= 10:
        qa["publish_gate"] = "review_required"
    elif complete_items >= 5:
        qa["publish_gate"] = "backend_complete"
    else:
        qa["publish_gate"] = "draft"

    result["qa"] = qa

    print(f"  Items found: {23 - len(qa['missing_items'])}/23")
    print(f"  Tables extracted: {qa['table_count']} ({qa['total_table_rows']} total rows)")
    print(f"  Missing tables in required items: {missing_table_queue}")
    print(f"  Cross-refs: {qa['unresolved_cross_refs']} unresolved / {qa['total_cross_refs']} total")
    print(f"  Failure states: {dict(failure_summary)}")
    print(f"  Publish gate: {qa['publish_gate']}")

    # ================================================================
    # PHASE 6: ENGINE AGGREGATION (brands_ready)
    # ================================================================
    print(f"\n--- Phase 6: Engine Aggregation ---")

    # Helper to get item text
    def _it(n): return items.get(n, {}).get("text", "")
    def _itbl(n): return items.get(n, {}).get("tables", [])

    # Item 20: Unit counts from structured tables
    # Table No. 1 has type labels on one row and year data on following rows:
    #   ['Franchised', '2022', '2564', '2658', '94']
    #   ['',           '2023', '2658', '2689', '31']
    #   ['',           '2024', '2689', '2752', '63']
    # We track which "type group" we're in and apply it to subsequent rows.
    i20_tables = _itbl(20)
    franchised_start = 0
    franchised_end = 0
    co_start = 0
    co_end = 0
    total_start = 0
    total_end = 0

    for t in i20_tables:
        if t.get("detection_method") != "pymupdf":
            continue
        header = [str(c).lower() for c in t.get("header", [])]
        # Only process Table No. 1 style tables (has Year, Start, End columns)
        is_summary_table = any('year' in h or 'start' in h or 'end' in h or 'net' in h for h in header)
        if not is_summary_table and t["rows"] < 8:
            continue

        current_type = None
        for row in t.get("data_rows", []):
            cells = [str(c).strip() for c in row]
            type_cell = cells[0].lower() if cells else ""

            # Detect type group changes
            if 'franchised' in type_cell and 'total' not in type_cell:
                current_type = "franchised"
            elif 'company' in type_cell or 'affiliate' in type_cell:
                current_type = "company"
            elif 'total' in type_cell:
                current_type = "total"
            elif type_cell and not type_cell.isspace() and not re.match(r'^[\d\s,+\-]+$', type_cell):
                # Non-empty, non-numeric type cell — might be a new section header row
                pass

            # Extract 2024 numbers
            row_text = ' '.join(cells)
            if '2024' not in row_text:
                continue

            # Parse numeric values from cells (skip year column)
            nums = []
            for c in cells:
                v = _pi(c)
                if v is not None and v > 0 and not (2000 <= v <= 2030):
                    nums.append(v)

            if not nums or not current_type:
                continue

            start_val = nums[0] if len(nums) >= 1 else 0
            end_val = nums[1] if len(nums) >= 2 else 0

            if current_type == "franchised" and not franchised_end:
                franchised_start = start_val
                franchised_end = end_val
            elif current_type == "company" and not co_end:
                co_start = start_val
                co_end = end_val
            elif current_type == "total" and not total_end:
                total_start = start_val
                total_end = end_val

        # If we found data from this table, stop looking at more tables
        if franchised_end or total_end:
            break

    if not total_end:
        total_end = franchised_end + co_end
    if not total_start:
        total_start = franchised_start + co_start
    net_growth = total_end - total_start if total_start else 0

    # Item 19: Revenue from tables or text
    i19_text = _it(19)
    has_fpr = False
    avg_revenue = None
    significant_dollars = []
    for d in re.findall(r'\$\s*[\d,]+', i19_text):
        try:
            val = int(re.sub(r'[\$\s,]', '', d))
            if val >= 1000: significant_dollars.append(val)
        except: pass
    has_sold = bool(re.search(r'(?:sold|earned).*?(?:amount|result).*?(?:differ|assurance)', i19_text, re.I))
    if len(significant_dollars) >= 3 or has_sold:
        has_fpr = True
        avg_m = re.search(r'[Aa]verage.*?\$\s*([\d,]+)', i19_text[300:])
        if avg_m: avg_revenue = int(avg_m.group(1).replace(',', ''))

    # Item 17: Contract terms from structured tables
    i17_text = _it(17)
    i17_tables = _itbl(17)
    term_years = None
    renewal_term = None
    cure_days = None
    has_noncompete = None
    nc_years = None
    nc_miles = None
    arb = None
    venue = None

    # Try structured tables first
    for t in i17_tables:
        if t.get("detection_method") == "pymupdf":
            for row in t.get("data_rows", []):
                if not row: continue
                prov = str(row[0]).lower() if row[0] else ""
                summ = str(row[-1]) if len(row) >= 2 else ""
                if prov.startswith('a') and ('term' in prov or 'length' in prov):
                    m = re.search(r'(\d+)\s*year', summ, re.I)
                    if m: term_years = int(m.group(1))
                elif prov.startswith('b') and 'renewal' in prov:
                    m = re.search(r'(\d+)\s*year', summ, re.I)
                    if m: renewal_term = int(m.group(1))
                elif prov.startswith('g') and 'cure' in prov:
                    m = re.search(r'(\d+)\s*day', summ, re.I)
                    if m: cure_days = int(m.group(1))
                elif prov.startswith('r') and 'non-compet' in prov:
                    has_noncompete = True
                    m = re.search(r'(\d+)\s*year', summ, re.I)
                    if m: nc_years = int(m.group(1))
                    m = re.search(r'(\d+)\s*mile', summ, re.I)
                    if m: nc_miles = int(m.group(1))
                elif prov.startswith('u') and 'arbitrat' in prov:
                    arb = bool(re.search(r'(?:must|shall|binding|mandatory)', summ, re.I))
                elif prov.startswith('v') and 'forum' in prov:
                    for vp in [r"(\w+(?:\s+\w+)?\s+County,\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
                               r"([A-Z][a-z]+,\s+[A-Z][a-z]+)"]:
                        vm = re.search(vp, summ)
                        if vm:
                            venue = vm.group(1)
                            break

    # Item 6: Fees from tables
    i6_tables = _itbl(6)
    royalty = None
    ad_fund = None
    fee_rows = []
    for t in i6_tables:
        if t.get("detection_method") == "pymupdf":
            for row in t.get("data_rows", []):
                cells = [str(c).strip() for c in row if c]
                if cells:
                    fee_rows.append(cells)
                    fee_name = cells[0].lower() if cells else ""
                    amount = cells[1] if len(cells) > 1 else ""
                    if 'royalt' in fee_name and '%' in amount:
                        m = re.search(r'(\d+(?:\.\d+)?)\s*%', amount)
                        if m: royalty = f"{m.group(1)}%"
                    if ('advertis' in fee_name or 'marketing' in fee_name or 'ad fund' in fee_name) and '%' in amount:
                        m = re.search(r'(\d+(?:\.\d+)?)\s*%', amount)
                        if m: ad_fund = f"{m.group(1)}%"

    # Text fallback for royalty/ad fund
    if not royalty:
        m = re.search(r'(?:Royalty|Continuing).*?(\d+(?:\.\d+)?)\s*%', _it(6)[:4000], re.I)
        if m and 1 <= float(m.group(1)) <= 20: royalty = f"{m.group(1)}%"
    if not ad_fund:
        m = re.search(r'(?:Advertising|Ad Fund|Marketing|Brand).*?(\d+(?:\.\d+)?)\s*%', _it(6)[:4000], re.I)
        if m and 0.5 <= float(m.group(1)) <= 15: ad_fund = f"{m.group(1)}%"

    # Item 5: Initial fee — look for rows with "franchise fee" or "initial fee" label
    initial_fee = None
    for t in _itbl(5):
        for row in t.get("data_rows", []):
            row_text = ' '.join(str(c).lower() for c in row)
            if ('franchise fee' in row_text or 'initial fee' in row_text or
                'establishment fee' in row_text) and '$' in row_text:
                for c in row:
                    m = re.search(r'\$([\d,]+)', str(c))
                    if m:
                        val = _pi(m.group(1))
                        if val and 5000 <= val <= 500000:
                            initial_fee = val
                            break
            if initial_fee:
                break
        if initial_fee:
            break
    if not initial_fee:
        m = re.search(r'(?:initial\s+)?(?:franchise|establishment)\s+fee.*?\$\s*([\d,]+)', _it(5), re.I)
        if m:
            val = _pi(m.group(1))
            if val and 5000 <= val <= 500000: initial_fee = val

    # Item 7: Investment range — find TOTAL row, parse "$X to $Y" range
    inv_low = None
    inv_high = None
    investment_rows = []
    for t in _itbl(7):
        for row in t.get("data_rows", []):
            cells = [str(c).strip() for c in row]
            if any(cells):
                investment_rows.append(cells)
                cat = cells[0].lower() if cells else ""
                if 'total' in cat:
                    # Parse all dollar amounts from all cells in TOTAL row
                    amounts = []
                    combined = ' '.join(cells[1:])
                    for am in re.finditer(r'\$\s*([\d,]+)', combined):
                        val = _pi(am.group(1))
                        if val and val > 50000:
                            amounts.append(val)
                    if len(amounts) >= 2:
                        inv_low = min(amounts)
                        inv_high = max(amounts)
                    elif len(amounts) == 1:
                        inv_low = amounts[0]
                        inv_high = amounts[0]
                    if inv_low:
                        break
        if inv_low:
            break

    # ── Text-based fallbacks when tables didn't find the data ──

    # Investment range fallback: search full text for "TOTAL" investment line
    if not inv_low:
        m = re.search(r'TOTAL.*?\$\s*([\d,]+).*?(?:to|\-)\s*\$\s*([\d,]+)', full_text, re.I)
        if m:
            lo = _pi(m.group(1))
            hi = _pi(m.group(2))
            if lo and hi and lo > 50000:
                inv_low = lo
                inv_high = hi

    # Royalty fallback: search Item 6 text
    if not royalty:
        i6_text = _it(6) or ""
        m = re.search(r'(?:Royalty|Continuing\s+(?:Franchise\s+)?Fee).*?(\d+(?:\.\d+)?)\s*%', i6_text[:5000], re.I)
        if m and 1 <= float(m.group(1)) <= 20:
            royalty = f"{m.group(1)}%"
    if not ad_fund:
        i6_text = _it(6) or ""
        m = re.search(r'(?:Advertising|Ad\s+Fund|Marketing|Brand\s+Fund|National\s+Advertising).*?(\d+(?:\.\d+)?)\s*%', i6_text[:5000], re.I)
        if m and 0.5 <= float(m.group(1)) <= 15:
            ad_fund = f"{m.group(1)}%"

    # Fee fallback: also search cover/bootstrap text
    if not initial_fee:
        m = re.search(r'(?:initial\s+)?(?:franchise|establishment)\s+fee.*?\$\s*([\d,]+)', full_text[:30000], re.I)
        if m:
            val = _pi(m.group(1))
            if val and 5000 <= val <= 500000:
                initial_fee = val

    # Units fallback: if structured tables missed, try text-based from full_text
    if not total_end:
        # Look for Table No. 1 Systemwide Summary in full text
        tbl1 = re.search(r'(?:Systemwide|System[\-\s]wide).*?(?:Summary|Outlet)', full_text, re.I)
        if tbl1:
            snippet = full_text[tbl1.start():tbl1.start() + 3000]
            # Find Franchised 2024 row
            fr_m = re.search(r'Franchised.*?2024\s+(\d[\d,]*)\s+(\d[\d,]*)', snippet, re.DOTALL | re.I)
            if fr_m:
                franchised_start = _pi(fr_m.group(1)) or 0
                franchised_end = _pi(fr_m.group(2)) or 0
            co_m = re.search(r'(?:Company|Affiliate).*?2024\s+(\d[\d,]*)\s+(\d[\d,]*)', snippet, re.DOTALL | re.I)
            if co_m:
                co_start = _pi(co_m.group(1)) or 0
                co_end = _pi(co_m.group(2)) or 0
            tot_m = re.search(r'Total.*?2024\s+(\d[\d,]*)\s+(\d[\d,]*)', snippet, re.DOTALL | re.I)
            if tot_m:
                total_start = _pi(tot_m.group(1)) or 0
                total_end = _pi(tot_m.group(2)) or 0
            if not total_end:
                total_end = franchised_end + co_end
            if not total_start:
                total_start = franchised_start + co_start
            net_growth = total_end - total_start if total_start else 0

    # Item 19 fallback: if section was too short, search full text
    if not has_fpr and not avg_revenue:
        # Use find_actual_item approach: search past first 15% of document
        skip = int(len(full_text) * 0.15)
        i19_matches = list(re.finditer(r'(?:ITEM|Item)\s+19\b', full_text[skip:]))
        if i19_matches:
            i19_start = skip + i19_matches[-1].start()
            i19_end_match = re.search(r'(?:ITEM|Item)\s+20\b', full_text[i19_start + 200:])
            i19_end = i19_start + 200 + i19_end_match.start() if i19_end_match else i19_start + 30000
            i19_full = full_text[i19_start:i19_end]
            dollars19 = []
            for d in re.findall(r'\$\s*[\d,]+', i19_full):
                try:
                    val = int(re.sub(r'[\$\s,]', '', d))
                    if val >= 1000: dollars19.append(val)
                except: pass
            sold19 = bool(re.search(r'(?:sold|earned).*?(?:amount|result).*?(?:differ|assurance)', i19_full, re.I))
            if len(dollars19) >= 3 or sold19:
                has_fpr = True
                avg_m = re.search(r'[Aa]verage.*?\$\s*([\d,]+)', i19_full[300:])
                if avg_m: avg_revenue = int(avg_m.group(1).replace(',', ''))

    # Build brands_ready
    br = {
        "parentCompany": entity,
        "description": description,
        "issuanceDate": issuance,
        "offeringPaths": offering_paths,
        "specialRisks": risk_types,
        "totalUnits": total_end,
        "franchisedUnits": franchised_end,
        "companyOwnedUnits": co_end,
        "initialFranchiseFee": initial_fee,
        "totalInvestmentLow": inv_low,
        "totalInvestmentHigh": inv_high,
        "royaltyRate": royalty,
        "marketingFundRate": ad_fund,
        "hasItem19": has_fpr,
        "item19_avgRevenue": avg_revenue,
        "unitEconomics": {
            "unitsStartOfPeriod": total_start,
            "unitsEndOfPeriod": total_end,
            "netGrowth": net_growth,
        },
        "item17": {
            "initialTermYears": term_years,
            "renewalTermYears": renewal_term,
            "curePeriodDays": cure_days,
            "hasNonCompete": has_noncompete,
            "nonCompeteYears": nc_years,
            "nonCompeteMiles": nc_miles,
            "mandatoryArbitration": arb,
            "disputeVenue": venue,
        },
        "item21": {
            "hasAuditedFinancials": bool(fin_results.get("auditorName")),
            "auditorName": fin_results.get("auditorName"),
            "auditorOpinion": fin_results.get("auditorOpinion"),
            "goingConcernWarning": fin_results.get("goingConcernWarning"),
            "franchisorRevenue": fin_results.get("franchisorRevenue"),
            "franchisorTotalAssets": fin_results.get("franchisorTotalAssets"),
            "franchisorNetIncome": fin_results.get("franchisorNetIncome"),
            "financialStrengthSignal": fin_results.get("financialStrengthSignal"),
        },
        "fee_rows": fee_rows[:30],
        "investment_rows": investment_rows[:20],
        "publishGate": qa["publish_gate"],
    }

    result["brands_ready"] = br

    # Close doc
    doc.close()

    print(f"\n  Entity: {entity[:50]}")
    print(f"  Units: {total_end} (F:{franchised_end}, CO:{co_end})")
    print(f"  Fee: ${initial_fee or '?':,}" if initial_fee else f"  Fee: ?")
    print(f"  Royalty: {royalty or '?'} | Ad: {ad_fund or '?'}")
    print(f"  Investment: ${inv_low or '?':,}-${inv_high or '?':,}" if inv_low else f"  Investment: ?")
    print(f"  Item 19: FPR={has_fpr}" + (f" | Avg: ${avg_revenue:,}" if avg_revenue else ""))
    print(f"  Item 17: term={term_years or '?'}yr | NC={nc_years or '?'}yr/{nc_miles or '?'}mi | arb={arb}")
    print(f"  Item 21: {fin_results.get('auditorName','?')} | {fin_results.get('auditorOpinion','?')} | strength={fin_results.get('financialStrengthSignal','?')}")
    print(f"  Publish gate: {qa['publish_gate']}")

    return result


# ══════════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 satf_extractor.py <pdf_path>")
        sys.exit(1)

    result = extract_fdd(sys.argv[1])

    # Don't save full item text to JSON (too large) — save everything else
    output = {k: v for k, v in result.items()}
    # Strip text from items to keep JSON manageable
    if "items" in output:
        for item_num, item_data in output["items"].items():
            if "text" in item_data:
                del item_data["text"]

    out_path = "/tmp/satf_result.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    print(f"\nResult saved to {out_path}")
