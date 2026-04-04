"""
Assist Handlers — Ticket execution logic for helpers.

Light workers import these handlers to execute tickets in assist mode.
Each handler produces evidence packets (NOT final truth).

Helpers may:
  - extract raw rows
  - summarize notes
  - classify clauses
  - validate arithmetic
  - compare agreement/addendum differences

Helpers may NOT:
  - publish final item truth
  - publish final canonical truth
  - erase another worker's packet
"""

import re
from typing import Any, Dict, List, Optional


def handle_read_table_notes(ticket, context: Dict) -> Optional[Dict]:
    """Read and classify table notes for an item.

    Returns evidence packet with structured note summaries.
    """
    items = context.get("items", {})
    source_item = ticket.source_item
    section = items.get(source_item) if source_item else None
    if not section:
        return None

    notes_found = []
    for table in (section.tables if hasattr(section, 'tables') else []):
        for note in (table.table_notes if hasattr(table, 'table_notes') else []):
            note_text = note.text if hasattr(note, 'text') else str(note)
            if len(note_text) < 10:
                continue

            note_lower = note_text.lower()
            # Classify note type
            note_type = "general"
            if any(kw in note_lower for kw in ["exclud", "not include", "does not"]):
                note_type = "exclusion"
            elif any(kw in note_lower for kw in ["assum", "based on", "estimate"]):
                note_type = "assumption"
            elif any(kw in note_lower for kw in ["%", "percent", "rate"]):
                note_type = "threshold"
            elif any(kw in note_lower for kw in ["fee", "charge", "cost"]):
                note_type = "fee_mechanic"
            elif any(kw in note_lower for kw in ["defined as", "means", "consist"]):
                note_type = "definition"

            # Extract dollar amounts
            dollars = re.findall(r'\$\s*([\d,]+)', note_text)
            # Extract percentages
            pcts = re.findall(r'(\d+(?:\.\d+)?)\s*%', note_text)

            notes_found.append({
                "note_num": note.note_num if hasattr(note, 'note_num') else 0,
                "table_id": table.table_id if hasattr(table, 'table_id') else "",
                "text": note_text[:400],
                "type": note_type,
                "dollar_amounts": [float(d.replace(",", "")) for d in dollars],
                "percentages": [float(p) for p in pcts],
            })

    if not notes_found:
        return None

    return {
        "content_type": "table_notes",
        "source_item": source_item,
        "notes_count": len(notes_found),
        "notes": notes_found,
        "exclusions": [n for n in notes_found if n["type"] == "exclusion"],
        "assumptions": [n for n in notes_found if n["type"] == "assumption"],
        "thresholds": [n for n in notes_found if n["type"] == "threshold"],
    }


def handle_validate_totals(ticket, context: Dict) -> Optional[Dict]:
    """Validate table arithmetic — do row totals match stated totals?"""
    items = context.get("items", {})
    source_item = ticket.source_item
    section = items.get(source_item) if source_item else None
    if not section:
        return None

    validations = []
    for table in (section.tables if hasattr(section, 'tables') else []):
        rows = table.rows if hasattr(table, 'rows') else []
        for row_idx, row in enumerate(rows):
            row_text = " ".join(row).lower() if row else ""
            if "total" not in row_text:
                continue

            # Extract all dollar amounts from the total row
            amounts = re.findall(r'\$\s*([\d,]+)', " ".join(row) if row else "")
            cleaned = [float(a.replace(",", "")) for a in amounts]

            # Sum non-total rows above
            preceding_sums = []
            for prev_idx in range(max(0, row_idx - 20), row_idx):
                prev_row = rows[prev_idx] if prev_idx < len(rows) else []
                prev_text = " ".join(prev_row).lower() if prev_row else ""
                if "total" in prev_text or not any(c.strip() for c in prev_row):
                    continue
                prev_amounts = re.findall(r'\$\s*([\d,]+)', " ".join(prev_row))
                if prev_amounts:
                    preceding_sums.append([float(a.replace(",", "")) for a in prev_amounts])

            validations.append({
                "table_id": table.table_id if hasattr(table, 'table_id') else "",
                "total_row_idx": row_idx,
                "stated_totals": cleaned,
                "preceding_row_count": len(preceding_sums),
                "validation": "checked",
            })

    if not validations:
        return None

    return {
        "content_type": "total_validation",
        "source_item": source_item,
        "validations": validations,
    }


def handle_extract_outlet_rows(ticket, context: Dict) -> Optional[Dict]:
    """Extract and classify all outlet table rows."""
    items = context.get("items", {})
    section = items.get(20)
    if not section:
        return None

    classified_rows = []
    for table in (section.tables if hasattr(section, 'tables') else []):
        for row_idx, row in enumerate(table.rows if hasattr(table, 'rows') else []):
            if not row or not any(c.strip() for c in row):
                continue
            row_text = " ".join(row).lower()

            row_type = "data"
            if any(kw in row_text for kw in ["total", "systemwide"]):
                row_type = "total"
            elif any(kw in row_text for kw in ["transfer"]):
                row_type = "transfer"
            elif any(kw in row_text for kw in ["terminat", "cancel", "non-renew"]):
                row_type = "termination"
            elif any(kw in row_text for kw in ["ceas", "close", "reacquir"]):
                row_type = "closure"
            elif any(kw in row_text for kw in ["open", "new"]):
                row_type = "opening"

            # Extract numbers
            numbers = re.findall(r'(?<!\$)\b(\d{1,6})\b', " ".join(row))

            classified_rows.append({
                "table_id": table.table_id if hasattr(table, 'table_id') else "",
                "row_idx": row_idx,
                "row_type": row_type,
                "cells": row,
                "numbers": [int(n) for n in numbers[:10]],
            })

    if not classified_rows:
        return None

    return {
        "content_type": "outlet_rows",
        "row_count": len(classified_rows),
        "rows": classified_rows,
        "by_type": {
            t: len([r for r in classified_rows if r["row_type"] == t])
            for t in ["total", "transfer", "termination", "closure", "opening", "data"]
        },
    }


def handle_check_cross_item_conflict(ticket, context: Dict) -> Optional[Dict]:
    """Check for conflicts between items (e.g., Item 6 fees vs Item 19 FPR)."""
    cross_items = ticket.context.get("cross_items", [])
    source_item = ticket.source_item

    # Get fact store from context
    fact_store = context.get("fact_store_ref")
    if not fact_store:
        return None

    source_facts = fact_store.get_by_item(source_item) if source_item else []
    cross_facts = {}
    for ci in cross_items:
        cross_facts[ci] = fact_store.get_by_item(ci)

    conflicts_found = []
    # Look for overlapping fact types with different values
    source_by_type = {p.fact_type: p for p in source_facts}
    for ci, facts in cross_facts.items():
        for p in facts:
            if p.fact_type in source_by_type:
                sp = source_by_type[p.fact_type]
                sv = str(sp.fact_payload.get("value", ""))
                cv = str(p.fact_payload.get("value", ""))
                if sv and cv and sv != cv:
                    conflicts_found.append({
                        "fact_type": p.fact_type,
                        "source_item": source_item,
                        "cross_item": ci,
                        "source_value": sv[:100],
                        "cross_value": cv[:100],
                    })

    return {
        "content_type": "cross_item_check",
        "source_item": source_item,
        "cross_items": cross_items,
        "conflicts_found": len(conflicts_found),
        "conflicts": conflicts_found,
    }


def handle_classify_exhibit(ticket, context: Dict) -> Optional[Dict]:
    """Classify an exhibit by reading its content."""
    exhibits = context.get("exhibits", {})
    code = ticket.source_exhibit
    if not code or code not in exhibits:
        return None

    ex = exhibits[code]
    text = ex.text[:2000] if hasattr(ex, 'text') and ex.text else ""
    text_lower = text.lower()

    # Classify by content
    classifications = []
    if any(kw in text_lower for kw in ["franchise agreement", "grant of franchise"]):
        classifications.append("franchise_agreement")
    if any(kw in text_lower for kw in ["guaranty", "guarantee", "personally liable"]):
        classifications.append("guaranty")
    if any(kw in text_lower for kw in ["addendum", "state-specific", "supplemental"]):
        classifications.append("state_addendum")
    if any(kw in text_lower for kw in ["financial statement", "balance sheet", "independent auditor"]):
        classifications.append("financial_statements")
    if any(kw in text_lower for kw in ["lease", "sublease", "premises"]):
        classifications.append("lease_related")
    if any(kw in text_lower for kw in ["receipt", "acknowledgment of receipt"]):
        classifications.append("receipt")
    if not classifications:
        classifications.append("other")

    return {
        "content_type": "exhibit_classification",
        "exhibit_code": code,
        "classifications": classifications,
        "text_length": len(text),
    }


def handle_parse_addendum_override(ticket, context: Dict) -> Optional[Dict]:
    """Parse a state addendum for overrides to base agreement."""
    exhibits = context.get("exhibits", {})
    code = ticket.source_exhibit
    if not code:
        return None

    ex = exhibits.get(code)
    if not ex or not (hasattr(ex, 'text') and ex.text):
        return None

    text = ex.text
    text_lower = text.lower()

    overrides = []
    # Find override patterns
    override_patterns = [
        (r'(?:section|paragraph|clause)\s+[\d.]+\s+(?:is|shall\s+be)\s+(?:amended|modified|replaced|deleted)', "amendment"),
        (r'(?:notwithstanding|in\s+lieu\s+of|instead\s+of)', "replacement"),
        (r'(?:the\s+following\s+(?:is|shall\s+be)\s+added|add\s+the\s+following)', "addition"),
    ]
    for pattern, override_type in override_patterns:
        for m in re.finditer(pattern, text_lower):
            # Get surrounding context
            start = max(0, m.start() - 50)
            end = min(len(text), m.end() + 200)
            overrides.append({
                "type": override_type,
                "context": text[start:end][:300],
            })

    return {
        "content_type": "addendum_overrides",
        "exhibit_code": code,
        "override_count": len(overrides),
        "overrides": overrides[:20],
    }


# ══════════════════════════════════════════════════════════════
# TICKET TYPE → HANDLER DISPATCH
# ══════════════════════════════════════════════════════════════

TICKET_HANDLERS = {
    "read_table_notes": handle_read_table_notes,
    "validate_totals": handle_validate_totals,
    "extract_outlet_rows": handle_extract_outlet_rows,
    "check_cross_item_conflict": handle_check_cross_item_conflict,
    "classify_exhibit": handle_classify_exhibit,
    "parse_addendum_override": handle_parse_addendum_override,
}


def dispatch_ticket(ticket, context: Dict) -> Optional[Dict]:
    """Dispatch a ticket to the appropriate handler."""
    handler = TICKET_HANDLERS.get(ticket.ticket_type.value)
    if handler:
        return handler(ticket, context)
    return None
