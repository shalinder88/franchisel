"""
Table Router — Content-Type Classification for All Tables

Tables are routed by WHAT THEY CONTAIN, not which page/item they were assigned to.
This eliminates the class of bugs where a table physically sits on a page boundary
and gets assigned to the wrong item.

Every imported table gets:
  - assigned_item: which item the segmenter put it in
  - content_type: what the table actually contains (by content classification)
  - content_confidence: how sure we are of the content type
  - candidate_items: which items might want to consume this table

Engines then consume by content_type, not only by assigned_item.
"""

import re
from typing import List, Dict, Any, Optional, Tuple
from .models import TableObject


class TableContentType:
    """Canonical table content types."""
    FEE_TABLE = "fee_table"                        # Item 5/6: fee schedules
    INVESTMENT_TABLE = "investment_table"           # Item 7: estimated initial investment
    OUTLET_SUMMARY = "outlet_summary"              # Item 20: systemwide outlet summary
    FRANCHISED_STATE_TABLE = "franchised_state"    # Item 20: status of franchised outlets by state
    COMPANY_STATE_TABLE = "company_state"          # Item 20: status of company-owned by state
    TRANSFER_TABLE = "transfer_table"              # Item 20: transfers by state
    PROJECTED_TABLE = "projected_table"            # Item 20: projected openings
    FPR_TABLE = "fpr_table"                        # Item 19: financial performance data
    OBLIGATIONS_MATRIX = "obligations_matrix"      # Item 9: franchisee obligations cross-ref
    NASAA_TABLE = "nasaa_table"                    # Item 17: renewal/termination/transfer
    LITIGATION_TABLE = "litigation_table"          # Item 3: litigation summary
    FINANCIAL_STATEMENT = "financial_statement"    # Item 21/Exhibit: balance sheet, income stmt
    FRANCHISEE_LIST = "franchisee_list"           # Exhibit: current/former franchisee list
    AGREEMENT_SCHEDULE = "agreement_schedule"      # Item 22: list of agreements
    UNKNOWN = "unknown"


# Content signals for each table type
TABLE_TYPE_SIGNALS = {
    TableContentType.OUTLET_SUMMARY: {
        "positive": ["outlet type", "outlets at", "net change", "franchised", "company-owned",
                      "total outlets", "start of the year", "end of the year"],
        "negative": ["state", "transfer"],
        "min_cols": 3,
        "require_any": ["outlet", "franchised"],
    },
    TableContentType.FRANCHISED_STATE_TABLE: {
        "positive": ["state", "year", "outlets", "opened", "terminated", "non-renewal",
                      "reacquired", "ceased"],
        "negative": ["company-owned", "company owned"],
        "min_cols": 5,
        "require_any": ["state"],
    },
    TableContentType.COMPANY_STATE_TABLE: {
        "positive": ["state", "year", "company", "outlets", "opened", "closed", "sold"],
        "negative": ["franchised"],
        "min_cols": 5,
        "require_any": ["company"],
    },
    TableContentType.TRANSFER_TABLE: {
        "positive": ["state", "year", "transfer", "number of transfers"],
        "negative": ["opened", "terminated"],
        "min_cols": 2,
        "require_any": ["transfer"],
    },
    TableContentType.FEE_TABLE: {
        "positive": ["fee", "amount", "due date", "remarks", "royalty", "advertising",
                      "% of gross", "% of net", "payable"],
        "negative": ["outlet", "state"],
        "min_cols": 2,
        "require_any": ["fee", "royalty", "payable", "% of"],
    },
    TableContentType.INVESTMENT_TABLE: {
        "positive": ["estimated", "initial investment", "low", "high", "to whom paid",
                      "total", "leasehold", "equipment", "pre-opening"],
        "negative": ["outlet", "state", "franchised"],
        "min_cols": 3,
        "require_any": ["investment", "estimated", "to whom"],
    },
    TableContentType.FPR_TABLE: {
        "positive": ["average", "median", "gross sales", "net sales", "royalty sales",
                      "category", "stores in category", "above average", "below average"],
        "negative": ["outlet", "state", "transfer"],
        "min_cols": 2,
        "require_any": ["average", "median", "sales"],
    },
    TableContentType.OBLIGATIONS_MATRIX: {
        "positive": ["obligation", "section in", "agreement", "item"],
        "negative": ["outlet", "sales"],
        "min_cols": 2,
        "require_any": ["obligation", "section in"],
    },
    TableContentType.NASAA_TABLE: {
        "positive": ["renewal", "termination", "transfer", "non-compete", "dispute",
                      "choice of", "venue", "cure period", "term of franchise"],
        "negative": ["outlet", "sales", "state"],
        "min_cols": 2,
        "require_any": ["renewal", "termination", "non-compete"],
    },
}


def classify_table_content(table: TableObject) -> Tuple[str, float, List[int]]:
    """Classify a table's content type based on its columns, title, and first rows.

    Returns:
        content_type: the classified type
        confidence: 0.0-1.0
        candidate_items: list of item numbers that might want this table
    """
    # Build the classification text from columns + title + first rows
    cols_text = " ".join(table.columns).lower()
    title_text = table.title.lower() if table.title else ""

    first_rows_text = ""
    for row in table.rows[:5]:
        if isinstance(row, list):
            first_rows_text += " " + " ".join(str(c) for c in row).lower()

    all_text = f"{title_text} {cols_text} {first_rows_text}"

    # Score each type
    best_type = TableContentType.UNKNOWN
    best_score = 0.0
    best_items: List[int] = []

    for content_type, signals in TABLE_TYPE_SIGNALS.items():
        pos_hits = sum(1 for s in signals["positive"] if s in all_text)
        neg_hits = sum(1 for s in signals["negative"] if s in all_text)
        require_hit = any(r in all_text for r in signals.get("require_any", []))

        if not require_hit:
            continue

        col_count = table.col_count if hasattr(table, 'col_count') else len(table.columns)
        min_cols = signals.get("min_cols", 1)
        if col_count < min_cols:
            continue

        score = (pos_hits * 2 - neg_hits * 3)
        if score > best_score:
            best_score = score
            best_type = content_type

    # Map content type to candidate items
    TYPE_TO_ITEMS = {
        TableContentType.FEE_TABLE: [5, 6],
        TableContentType.INVESTMENT_TABLE: [7],
        TableContentType.OUTLET_SUMMARY: [20],
        TableContentType.FRANCHISED_STATE_TABLE: [20],
        TableContentType.COMPANY_STATE_TABLE: [20],
        TableContentType.TRANSFER_TABLE: [20],
        TableContentType.PROJECTED_TABLE: [20],
        TableContentType.FPR_TABLE: [19],
        TableContentType.OBLIGATIONS_MATRIX: [9],
        TableContentType.NASAA_TABLE: [17],
        TableContentType.LITIGATION_TABLE: [3],
        TableContentType.FINANCIAL_STATEMENT: [21],
    }
    best_items = TYPE_TO_ITEMS.get(best_type, [])
    confidence = min(1.0, best_score / 6.0) if best_score > 0 else 0.0

    return best_type, confidence, best_items


def route_all_tables(all_tables: List[TableObject],
                     items: Dict[int, Any]) -> Dict[str, List[TableObject]]:
    """Route all tables by content type.

    Returns dict of content_type → list of tables.
    This allows engines to consume tables by what they contain,
    not by which item the segmenter assigned them to.
    """
    routed: Dict[str, List[TableObject]] = {}

    for table in all_tables:
        content_type, confidence, candidate_items = classify_table_content(table)

        # Attach routing metadata to table
        table.content_type = content_type
        table.content_confidence = confidence
        table.candidate_items = candidate_items

        if content_type not in routed:
            routed[content_type] = []
        routed[content_type].append(table)

    return routed


def get_tables_for_item(routed: Dict[str, List[TableObject]],
                        item_num: int,
                        content_types: Optional[List[str]] = None) -> List[TableObject]:
    """Get all tables that should be consumed by a specific item.

    Uses content_type routing — returns tables whose content belongs to this item,
    regardless of which page/section they were assigned to.
    """
    result = []

    TYPE_TO_ITEMS = {
        TableContentType.FEE_TABLE: [5, 6],
        TableContentType.INVESTMENT_TABLE: [7],
        TableContentType.OUTLET_SUMMARY: [20],
        TableContentType.FRANCHISED_STATE_TABLE: [20],
        TableContentType.COMPANY_STATE_TABLE: [20],
        TableContentType.TRANSFER_TABLE: [20],
        TableContentType.PROJECTED_TABLE: [20],
        TableContentType.FPR_TABLE: [19],
        TableContentType.OBLIGATIONS_MATRIX: [9],
        TableContentType.NASAA_TABLE: [17],
    }

    for ctype, tables in routed.items():
        target_items = TYPE_TO_ITEMS.get(ctype, [])
        if item_num in target_items:
            if content_types is None or ctype in content_types:
                result.extend(tables)

    return result
