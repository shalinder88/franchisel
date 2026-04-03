"""
Page Classifier

Classifies every page into one of 17 types.
Uses text content, position in document, and geometry hints.
No item-level knowledge — just structural classification.
"""

import re
from .models import PageType


def classify_page(text: str, page_num: int, total_pages: int,
                  has_table_indicators: bool = False) -> PageType:
    """Classify a single page by its structural role in the FDD.

    Uses content patterns and document position.
    Does NOT use item-level knowledge — that's the section layer's job.
    """
    tl = text.lower()
    tlen = len(text.strip())

    # ── Early document pages (bootstrap) ──
    if page_num <= 3 and 'franchise disclosure document' in tl:
        return PageType.COVER
    if 'how to use this franchise disclosure document' in tl:
        return PageType.HOW_TO_USE
    if re.search(r'special\s+risk', tl) and page_num < 20:
        return PageType.SPECIAL_RISKS
    if page_num < 15 and re.search(
        r'(?:state|michigan|california|illinois|maryland|minnesota|new york|virginia|washington)'
        r'\s+(?:notice|cover|page|addend)', tl):
        return PageType.STATE_NOTICE
    if re.search(r'table\s+of\s+contents', tl) and page_num < 15:
        return PageType.TOC
    if re.search(r'list\s+of\s+exhibits', tl) and page_num < 15:
        return PageType.EXHIBIT_LIST

    # ── Financial statement pages (usually in exhibits) ──
    if re.search(r'(?:balance\s+sheet|statement\s+of\s+(?:income|operations|financial\s+position|comprehensive|cash\s+flow))', tl):
        if tlen > 300:
            return PageType.FINANCIAL_STATEMENT

    # ── Receipt/signature pages (usually last) ──
    if re.search(r'receipt\s+of\s+(?:this\s+)?(?:franchise\s+)?disclosure', tl):
        return PageType.RECEIPT_SIGNATURE

    # ── Operations manual TOC (an exhibit) ──
    if re.search(r'(?:operations?\s+manual|table\s+of\s+contents.*?(?:chapter|section|module))', tl) and tlen > 500:
        return PageType.EXHIBIT_MANUAL_TOC

    # ── Agreement pages (exhibits, long text with contract language) ──
    if re.search(r'(?:franchise|development|area)\s+agreement', tl) and tlen > 3000:
        return PageType.EXHIBIT_AGREEMENT

    # ── Franchisee list pages ──
    if re.search(r'(?:list\s+of\s+)?(?:current|former)\s+franchisee', tl) and tlen > 500:
        if 'former' in tl:
            return PageType.EXHIBIT_FRANCHISEE_LIST  # both current and former use same type
        return PageType.EXHIBIT_FRANCHISEE_LIST

    # ── Table vs narrative detection ──
    has_table_content = has_table_indicators or bool(re.search(
        r'(?:\$[\d,]+.*?\$[\d,]+)|(?:(?:Year|State|Type|Fee|Amount|Provision)\s.*?\d)', text[:2000]))
    has_narrative = tlen > 800 and len(re.findall(r'[.!?]\s+[A-Z]', text)) > 2

    if has_table_content and has_narrative:
        return PageType.MIXED
    if has_table_content:
        return PageType.ITEM_TABLE

    # ── Low-value pages ──
    if tlen < 100:
        return PageType.LOW_VALUE_ADMIN

    return PageType.ITEM_NARRATIVE
