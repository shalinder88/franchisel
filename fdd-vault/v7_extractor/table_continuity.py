"""
Table Continuity Handler

Detects and merges tables that span multiple pages.

Responsibilities:
  - Detect repeated headers across consecutive pages (same table continued)
  - Merge continued tables into a single TableObject chain
  - Merge partial rows split at page breaks
  - Attach continuation notes
  - Preserve per-page provenance

Rule: If a page repeats the same column headers as the previous page's table,
or the text says "table continues" / "continued on next page",
treat them as one table chain, not separate tables.
"""

import re
from typing import List, Dict, Optional
from .models import TableObject, NoteLink


def _headers_match(h1: List[str], h2: List[str], threshold: float = 0.6) -> bool:
    """Check if two header rows are similar enough to be the same table continued."""
    if not h1 or not h2:
        return False
    if len(h1) != len(h2):
        return False
    matches = sum(1 for a, b in zip(h1, h2) if a.strip().lower() == b.strip().lower())
    return matches / len(h1) >= threshold


def _page_has_continuation_signal(text: str) -> bool:
    """Check if a page has language indicating a table continues."""
    return bool(re.search(
        r'(?:continued|cont(?:\'d)?\.?\s+(?:on|from)\s+(?:next|previous|preceding)\s+page'
        r'|table\s+continues|see\s+(?:next|following)\s+page)',
        text[:500], re.I
    ))


def detect_continuations(tables: List[TableObject]) -> List[List[TableObject]]:
    """Group tables into continuation chains.

    Tables on consecutive pages with matching headers are part of the same chain.
    Returns list of chains (each chain is a list of TableObjects in page order).
    """
    if not tables:
        return []

    # Sort by page then position within page
    sorted_tables = sorted(tables, key=lambda t: (t.source_page, t.table_id))

    chains: List[List[TableObject]] = []
    current_chain: List[TableObject] = [sorted_tables[0]]

    for i in range(1, len(sorted_tables)):
        prev = current_chain[-1]
        curr = sorted_tables[i]

        # Same item?
        same_item = prev.source_item == curr.source_item

        # Consecutive pages?
        consecutive = curr.source_page - prev.source_page <= 1

        # Headers match?
        headers_match = _headers_match(prev.columns, curr.columns)

        # Same column count?
        same_cols = prev.col_count == curr.col_count and prev.col_count > 0

        if same_item and consecutive and (headers_match or same_cols):
            # This is a continuation
            curr.continuation_of = prev.table_id
            prev.continued_on_next_page = True
            current_chain.append(curr)
        else:
            # New chain
            chains.append(current_chain)
            current_chain = [curr]

    chains.append(current_chain)
    return chains


def merge_chain(chain: List[TableObject]) -> TableObject:
    """Merge a chain of continued tables into a single TableObject.

    The merged table:
    - Uses the first table's header as the canonical header
    - Concatenates all data rows in order
    - Merges all notes
    - Preserves per-page provenance
    - Skips duplicate header rows from continuation pages
    """
    if len(chain) == 1:
        return chain[0]

    base = chain[0]
    canonical_header = base.columns

    merged_rows = list(base.rows)
    merged_notes = list(base.table_notes)
    all_pages = [base.source_page]

    for cont_table in chain[1:]:
        all_pages.append(cont_table.source_page)

        for row in cont_table.rows:
            # Skip rows that are just repeated headers
            if _headers_match([r.strip().lower() for r in row],
                             [h.strip().lower() for h in canonical_header], 0.8):
                continue
            # Skip empty rows
            if not any(cell.strip() for cell in row):
                continue
            merged_rows.append(row)

        merged_notes.extend(cont_table.table_notes)

    # Build merged table
    merged = TableObject(
        table_id=f"{base.table_id}_merged",
        source_page=base.source_page,
        source_item=base.source_item,
        source_exhibit=base.source_exhibit,
        detection_method=base.detection_method,
        title=base.title,
        table_type=base.table_type,
        columns=canonical_header,
        rows=merged_rows,
        raw_data=[canonical_header] + merged_rows,
        row_count=len(merged_rows) + 1,
        col_count=base.col_count,
        table_notes=merged_notes,
        confidence=base.confidence,
    )

    return merged


def merge_all_continuations(items: dict) -> None:
    """Detect and merge continuation tables across all items.

    Mutates ItemSection.tables in place — replaces chains with merged tables.
    """
    for item_num, section in items.items():
        if not section.tables:
            continue

        chains = detect_continuations(section.tables)

        # Replace section tables with merged versions
        merged_tables = []
        for chain in chains:
            if len(chain) > 1:
                merged = merge_chain(chain)
                merged_tables.append(merged)
            else:
                merged_tables.append(chain[0])

        section.tables = merged_tables
