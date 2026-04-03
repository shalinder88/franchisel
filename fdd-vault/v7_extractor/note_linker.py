"""
Note Linker

Creates a dedicated note_linker module.

Rules:
  - Capture footnotes below table bbox
  - Capture numbered notes after tables
  - Capture next-page continuation notes
  - Map note references to rows/cells
  - Distinguish table-level notes from row-level notes

Every table stores: table_notes, row_note_refs, cell_note_refs

No Item 19 table is full fidelity without note linkage.
Same for many Item 7 and Item 21 tables.
"""

import re
from typing import List, Dict, Optional
from .models import NoteLink, TableObject


def extract_notes_from_text(text: str, source_page: int,
                             linked_table_id: Optional[str] = None) -> List[NoteLink]:
    """Extract numbered notes/footnotes from text.

    Looks for patterns like:
      "Notes:" or "NOTES:" followed by numbered items
      "(1) Some note text"
      "1. Some note text"
      "Note 1: Some note text"
    """
    notes = []

    # Find "Notes:" or "NOTES:" block
    note_block_match = re.search(r'(?:Notes?|NOTES?)\s*(?:to\s+(?:Table|the\s+Table))?[:\s]*\n', text)
    if note_block_match:
        note_text = text[note_block_match.end():]

        # Numbered notes: "1. ...", "2. ...", etc.
        for nm in re.finditer(r'(\d+)\.\s+(.+?)(?=\n\d+\.\s|\n\n|\Z)', note_text, re.DOTALL):
            note_num = int(nm.group(1))
            note_body = nm.group(2).strip().replace('\n', ' ')[:500]
            notes.append(NoteLink(
                note_id=f"note_{linked_table_id}_{note_num}" if linked_table_id else f"note_p{source_page}_{note_num}",
                note_num=note_num,
                text=note_body,
                source_page=source_page,
                linked_table_id=linked_table_id,
            ))

    # Also capture inline footnote references like "(1)", "(See Note 2)"
    # These create unresolved note links
    for fm in re.finditer(r'\((\d+)\)', text):
        note_num = int(fm.group(1))
        if note_num > 0 and note_num <= 50:  # reasonable footnote range
            # Check if we already have this note
            existing = [n for n in notes if n.note_num == note_num]
            if not existing:
                notes.append(NoteLink(
                    note_id=f"noteref_p{source_page}_{note_num}",
                    note_num=note_num,
                    text="",
                    source_page=source_page,
                    linked_table_id=linked_table_id,
                    unresolved=True,
                ))

    return notes


def link_notes_to_table(table: TableObject, page_text: str,
                         next_page_text: Optional[str] = None) -> None:
    """Link notes/footnotes to a table object.

    Mutates the table's table_notes, row_note_refs, and cell_note_refs.

    Steps:
    1. Extract notes from text below the table on the same page
    2. Extract notes from the next page (continuation)
    3. Scan table cells for note references like "(1)", "(See Note 2)"
    4. Link references to note objects
    """
    # Extract notes from page text
    notes = extract_notes_from_text(page_text, table.source_page, table.table_id)
    if next_page_text:
        next_notes = extract_notes_from_text(next_page_text, table.source_page + 1, table.table_id)
        notes.extend(next_notes)

    # Deduplicate by note_num
    seen = set()
    unique_notes = []
    for n in notes:
        if n.note_num not in seen:
            seen.add(n.note_num)
            unique_notes.append(n)

    table.table_notes = unique_notes

    # Scan table cells for note references
    for row_idx, row in enumerate(table.rows):
        for cell_idx, cell in enumerate(row):
            refs = re.findall(r'\((\d+)\)', str(cell))
            for ref in refs:
                ref_num = int(ref)
                # Row-level note ref
                if row_idx not in table.row_note_refs:
                    table.row_note_refs[row_idx] = []
                if ref_num not in table.row_note_refs[row_idx]:
                    table.row_note_refs[row_idx].append(ref_num)
                # Cell-level note ref
                cell_key = f"{row_idx}_{cell_idx}"
                if cell_key not in table.cell_note_refs:
                    table.cell_note_refs[cell_key] = []
                if ref_num not in table.cell_note_refs[cell_key]:
                    table.cell_note_refs[cell_key].append(ref_num)


def link_all_notes(page_reads, items: dict) -> None:
    """Run note linking across all tables in all items.

    Mutates TableObject instances in-place.
    """
    # Build page index for next-page lookups
    page_index = {pr.page_num: pr for pr in page_reads}

    for item_num, section in items.items():
        for table in section.tables:
            page_text = page_index.get(table.source_page, None)
            next_page = page_index.get(table.source_page + 1, None)
            if page_text:
                link_notes_to_table(
                    table,
                    page_text.text,
                    next_page.text if next_page else None,
                )
