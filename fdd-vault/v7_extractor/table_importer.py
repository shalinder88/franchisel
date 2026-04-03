"""
Table Importer — 4-Method Fallback Hierarchy

Tables are first-class objects. This module detects and imports them.

Method 1: PyMuPDF native table detection (highest confidence)
Method 2: Geometric reconstruction (lines, aligned blocks, repeated x-positions)
Method 3: Text-grid reconstruction (infer columns from repeated alignment)
Method 4: Line-by-line fallback (preserve raw row text, low confidence, queue for review)

Rule: There is no acceptable "0 tables imported" success state in Items 5, 6, 7, 19, 20, or 21
unless the item truly has no table. If find_tables() misses a standard NASAA fee table,
that is a detection failure, not proof the table is absent.
"""

import pymupdf
import re
from typing import List, Optional, Dict
from .models import TableObject, NoteLink, TableMethod, TABLE_REQUIRED_ITEMS, TABLE_EXPECTED_ITEMS


def import_tables_from_page(doc, page_idx: int,
                             item_num: Optional[int] = None) -> List[TableObject]:
    """Extract tables from a single page using the 4-method fallback hierarchy.

    Returns list of TableObject with provenance.
    """
    page = doc[page_idx]
    page_num = page_idx + 1
    tables = []

    # ══ Method 1: PyMuPDF native table detection ══
    try:
        pymupdf_tables = page.find_tables()
        for ti, tab in enumerate(pymupdf_tables.tables):
            if tab.row_count < 2:
                continue
            raw = tab.extract()
            cleaned = []
            for row in raw:
                cleaned.append([str(c).replace('\n', ' ').strip() if c else '' for c in row])

            # Title: first non-empty cell of first row, or nearby heading text
            title = ""
            if cleaned and cleaned[0]:
                title = ' '.join(c for c in cleaned[0] if c)[:80]

            tables.append(TableObject(
                table_id=f"item{item_num}_p{page_num}_t{ti}" if item_num else f"p{page_num}_t{ti}",
                source_page=page_num,
                source_item=item_num,
                detection_method=TableMethod.PYMUPDF,
                title=title,
                columns=cleaned[0] if cleaned else [],
                rows=cleaned[1:] if len(cleaned) > 1 else [],
                raw_data=cleaned,
                row_count=tab.row_count,
                col_count=tab.col_count,
                confidence="very_high",
            ))
    except Exception:
        pass

    # ══ Method 2: Geometric reconstruction ══
    # Use line drawings and text block alignment to detect tables
    # that PyMuPDF's find_tables() misses
    if not tables:
        try:
            drawings = page.get_drawings()
            horiz_lines = [d for d in drawings if d.get("type") == "l" and
                          abs(d["rect"][1] - d["rect"][3]) < 2]  # horizontal lines
            if len(horiz_lines) >= 3:
                # There are ruled lines — likely a table
                # Get text blocks between the lines
                blocks = page.get_text("dict")["blocks"]
                text_blocks = []
                for b in blocks:
                    if b["type"] == 0:
                        for line in b.get("lines", []):
                            text = ""
                            for span in line.get("spans", []):
                                text += span.get("text", "")
                            if text.strip():
                                bbox = line["bbox"]
                                text_blocks.append({"text": text.strip(), "y": bbox[1], "x": bbox[0]})

                # Group by y-coordinate (same row)
                if text_blocks:
                    text_blocks.sort(key=lambda b: (round(b["y"], -1), b["x"]))
                    rows = []
                    current_row = [text_blocks[0]]
                    for tb in text_blocks[1:]:
                        if abs(tb["y"] - current_row[0]["y"]) < 5:
                            current_row.append(tb)
                        else:
                            rows.append([b["text"] for b in sorted(current_row, key=lambda b: b["x"])])
                            current_row = [tb]
                    rows.append([b["text"] for b in sorted(current_row, key=lambda b: b["x"])])

                    if len(rows) >= 3:
                        tables.append(TableObject(
                            table_id=f"item{item_num}_p{page_num}_geom" if item_num else f"p{page_num}_geom",
                            source_page=page_num,
                            source_item=item_num,
                            detection_method=TableMethod.GEOMETRIC,
                            columns=rows[0] if rows else [],
                            rows=rows[1:] if len(rows) > 1 else [],
                            raw_data=rows,
                            row_count=len(rows),
                            col_count=len(rows[0]) if rows else 0,
                            confidence="high",
                        ))
        except Exception:
            pass

    # ══ Method 3: Text-grid reconstruction ══
    # If page has aligned text spans that look columnar
    if not tables:
        try:
            blocks = page.get_text("dict")["blocks"]
            spans_with_pos = []
            for b in blocks:
                if b["type"] != 0:
                    continue
                for line in b.get("lines", []):
                    for span in line.get("spans", []):
                        text = span.get("text", "").strip()
                        if text:
                            spans_with_pos.append({
                                "text": text,
                                "x": round(span["bbox"][0]),
                                "y": round(span["bbox"][1]),
                            })

            if len(spans_with_pos) > 10:
                # Find common x-positions (column alignment)
                from collections import Counter
                x_counts = Counter(s["x"] for s in spans_with_pos)
                # Columns: x-positions that appear on 3+ different y-levels
                column_xs = sorted([x for x, count in x_counts.items() if count >= 3])

                if len(column_xs) >= 3:
                    # Group spans into rows by y-position
                    y_positions = sorted(set(s["y"] for s in spans_with_pos))
                    rows = []
                    for y in y_positions:
                        row_spans = [s for s in spans_with_pos if abs(s["y"] - y) < 3]
                        if row_spans:
                            # Assign each span to nearest column
                            row = [''] * len(column_xs)
                            for s in row_spans:
                                closest_col = min(range(len(column_xs)),
                                                 key=lambda ci: abs(column_xs[ci] - s["x"]))
                                if row[closest_col]:
                                    row[closest_col] += ' ' + s["text"]
                                else:
                                    row[closest_col] = s["text"]
                            if any(row):
                                rows.append(row)

                    if len(rows) >= 3:
                        tables.append(TableObject(
                            table_id=f"item{item_num}_p{page_num}_grid" if item_num else f"p{page_num}_grid",
                            source_page=page_num,
                            source_item=item_num,
                            detection_method=TableMethod.TEXT_GRID,
                            columns=rows[0] if rows else [],
                            rows=rows[1:] if len(rows) > 1 else [],
                            raw_data=rows,
                            row_count=len(rows),
                            col_count=len(column_xs),
                            confidence="medium",
                        ))
        except Exception:
            pass

    # ══ Method 4: Line-by-line fallback ══
    if not tables:
        text = page.get_text()
        table_lines = []
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            dollar_count = len(re.findall(r'\$[\d,]+', line))
            number_groups = len(re.findall(r'\b\d[\d,]+\b', line))
            if dollar_count >= 2 or (number_groups >= 3 and len(line) > 20):
                table_lines.append(line)
        if len(table_lines) >= 3:
            tables.append(TableObject(
                table_id=f"item{item_num}_p{page_num}_fallback" if item_num else f"p{page_num}_fallback",
                source_page=page_num,
                source_item=item_num,
                detection_method=TableMethod.LINE_FALLBACK,
                rows=[[line] for line in table_lines],
                raw_data=[[line] for line in table_lines],
                row_count=len(table_lines),
                confidence="low",
                needs_review=True,
            ))

    return tables


def import_tables_for_items(doc, page_reads, items: dict) -> List[TableObject]:
    """Run table extraction on all pages belonging to table-sensitive items.

    Mutates page_reads (adds tables to each page) and items (updates table lists).
    Returns the global table registry.
    """
    from .models import PageType

    all_tables = []

    # Build page → item mapping
    page_to_item: Dict[int, int] = {}
    for item_num, section in items.items():
        for pn in range(section.start_page, section.end_page + 1):
            page_to_item[pn] = item_num

    for pr in page_reads:
        item_num = page_to_item.get(pr.page_num)
        if item_num is None:
            continue

        # Extract tables from pages in table-sensitive items or pages with table indicators
        should_extract = (
            item_num in TABLE_REQUIRED_ITEMS or
            item_num in TABLE_EXPECTED_ITEMS or
            pr.page_type in (PageType.ITEM_TABLE, PageType.MIXED, PageType.FINANCIAL_STATEMENT) or
            pr.has_table_regions
        )
        if not should_extract:
            continue

        page_tables = import_tables_from_page(doc, pr.page_num - 1, item_num)

        # Attach tables to page and item
        pr.tables = page_tables
        all_tables.extend(page_tables)

        if item_num in items:
            items[item_num].tables.extend(page_tables)

    return all_tables
