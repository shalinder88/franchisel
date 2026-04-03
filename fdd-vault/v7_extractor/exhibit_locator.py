"""
Exhibit Locator

Finds exhibit boundaries in the PDF and assigns roles.
Every exhibit gets: raw_name, code, role, page_range, trigger_items,
parsed_flag, importance, precedence_level.

Exhibits are processed in priority order:
  1. financial exhibits (critical)
  2. franchise/development agreements
  3. state addenda
  4. item-specific support exhibits
  5. manual TOC
  6. franchisee lists / receipts with PII blocking
"""

import re
from typing import List, Dict
from .models import PageRead, PageType, ExhibitObject, ExhibitRole


# Role classification keywords
ROLE_KEYWORDS = {
    ExhibitRole.FINANCIALS: ["financial statement", "audited", "balance sheet", "income statement"],
    ExhibitRole.FRANCHISE_AGREEMENT: ["franchise agreement"],
    ExhibitRole.DEVELOPMENT_AGREEMENT: ["development agreement", "area development"],
    ExhibitRole.NONTRADITIONAL_AGREEMENT: ["non-traditional", "nontraditional", "non traditional"],
    ExhibitRole.SMALLTOWN_AGREEMENT: ["small-town", "small town", "smalltown"],
    ExhibitRole.GUARANTY: ["guaranty", "guarantee", "personal guarantee"],
    ExhibitRole.LEASE_RIDER: ["lease", "sublease"],
    ExhibitRole.EQUIPMENT_LEASE: ["equipment lease", "equipment pack"],
    ExhibitRole.SUPPLIER_AGREEMENT: ["supplier", "purchase agreement", "cheese purchase"],
    ExhibitRole.ADVERTISING_AGREEMENT: ["advertising", "ad fund", "marketing"],
    ExhibitRole.PAYMENT_ACH: ["payment", "ach", "auto-withdrawal", "eft", "electronic fund"],
    ExhibitRole.FINANCING_DOC: ["financing", "promissory note", "loan"],
    ExhibitRole.MANUAL_TOC: ["operations manual", "manual table of contents"],
    ExhibitRole.ITEM20_SUPPORT: ["item 20", "franchisee list", "developer"],
    ExhibitRole.FRANCHISEE_LIST: ["current franchisee", "list of franchisee"],
    ExhibitRole.FORMER_FRANCHISEE_LIST: ["former franchisee"],
    ExhibitRole.UNOPENED_UNITS_LIST: ["unopened", "signed but not opened"],
    ExhibitRole.STATE_ADDENDA_FDD: ["state addend", "state specific", "state cover"],
    ExhibitRole.STATE_ADDENDA_AGREEMENT: ["state rider", "state amendment"],
    ExhibitRole.RECEIPT: ["receipt"],
}


def classify_exhibit_role(description: str) -> ExhibitRole:
    """Classify an exhibit's role based on its description."""
    desc_lower = description.lower()
    for role, keywords in ROLE_KEYWORDS.items():
        for kw in keywords:
            if kw in desc_lower:
                return role
    return ExhibitRole.OTHER


def locate_exhibits(page_reads: List[PageRead],
                    exhibit_map: Dict[str, str]) -> Dict[str, ExhibitObject]:
    """Locate exhibit sections in the PDF.

    Uses:
    1. exhibit_map from bootstrap (letter → description)
    2. Page classification (exhibit types)
    3. Exhibit heading detection on pages

    Returns dict of exhibit_code → ExhibitObject.
    """
    exhibits: Dict[str, ExhibitObject] = {}

    # Create ExhibitObjects from the bootstrap exhibit map
    for code, description in exhibit_map.items():
        role = classify_exhibit_role(description)
        importance = "critical" if role in (ExhibitRole.FINANCIALS, ExhibitRole.FRANCHISE_AGREEMENT,
                                            ExhibitRole.STATE_ADDENDA_FDD) else "normal"
        precedence = 1 if role in (ExhibitRole.STATE_ADDENDA_FDD, ExhibitRole.STATE_ADDENDA_AGREEMENT) else (
                     3 if role in (ExhibitRole.FRANCHISE_AGREEMENT, ExhibitRole.DEVELOPMENT_AGREEMENT) else 4)

        exhibits[code] = ExhibitObject(
            exhibit_id=f"exhibit_{code}",
            code=code,
            raw_name=description,
            role=role,
            importance=importance,
            precedence_level=precedence,
        )

    # Find exhibit page boundaries
    # Scan all pages for "EXHIBIT X" headings
    # General rule: Extract the FULL heading text, not just the code.
    # "EXHIBIT O: FINANCIAL STATEMENTS" → code=O, heading_text="Financial Statements"
    exhibit_heading_re = re.compile(
        r'(?:^|\n)\s*EXHIBIT\s+["\']?([A-Z](?:-?\d)?)["\']?'
        r'(?:\s*[-–—:]\s*(.+?))?'  # optional separator + description
        r'(?:\n|$)',
        re.MULTILINE
    )
    for pr in page_reads:
        for m in exhibit_heading_re.finditer(pr.text):
            code = m.group(1)
            heading_text = m.group(2) or ""

            if code in exhibits and exhibits[code].start_page == 0:
                exhibits[code].start_page = pr.page_num
                # If we now have heading text, try to improve role classification
                if heading_text.strip() and exhibits[code].role == ExhibitRole.OTHER:
                    new_role = classify_exhibit_role(heading_text)
                    if new_role != ExhibitRole.OTHER:
                        exhibits[code].role = new_role
                        exhibits[code].raw_name = heading_text.strip()
            elif code not in exhibits:
                role = classify_exhibit_role(heading_text) if heading_text else ExhibitRole.OTHER
                exhibits[code] = ExhibitObject(
                    exhibit_id=f"exhibit_{code}",
                    code=code,
                    raw_name=heading_text.strip() or f"Exhibit {code}",
                    role=role,
                    start_page=pr.page_num,
                )

        # Fallback: broader heading detection for exhibits without separator
        # Catches "EXHIBIT O\nFINANCIAL STATEMENTS" (two lines)
        for m in re.finditer(r'(?:^|\n)\s*EXHIBIT\s+([A-Z](?:-?\d)?)\s*\n\s*(.+)', pr.text, re.MULTILINE):
            code = m.group(1)
            next_line = m.group(2).strip()
            if code in exhibits and exhibits[code].role == ExhibitRole.OTHER and next_line:
                new_role = classify_exhibit_role(next_line)
                if new_role != ExhibitRole.OTHER:
                    exhibits[code].role = new_role
                    exhibits[code].raw_name = next_line

    # Content-based role recovery: if exhibit is still "other", check its page content
    # General rule: don't rely solely on headings. Check what the pages actually contain.
    for code, ex in exhibits.items():
        if ex.role == ExhibitRole.OTHER and ex.start_page > 0:
            # Check first few pages of the exhibit for financial content
            for pr in page_reads:
                if pr.page_num < ex.start_page or pr.page_num > min(ex.start_page + 3, ex.end_page or ex.start_page + 3):
                    continue
                text_lower = pr.text.lower()
                if any(kw in text_lower for kw in ["balance sheet", "income statement",
                       "statement of operations", "statement of financial position",
                       "auditor", "independent auditor", "audit report",
                       "total assets", "total liabilities", "net income",
                       "cash flow", "stockholder"]):
                    ex.role = ExhibitRole.FINANCIALS
                    if not ex.raw_name or ex.raw_name == f"Exhibit {code}":
                        ex.raw_name = "Financial Statements (content-detected)"
                    break
                elif any(kw in text_lower for kw in ["franchise agreement",
                        "franchisor and franchisee", "grant of franchise"]):
                    ex.role = ExhibitRole.FRANCHISE_AGREEMENT
                    break
                elif any(kw in text_lower for kw in ["state-specific", "state addend",
                        "additional disclosures"]):
                    ex.role = ExhibitRole.STATE_ADDENDA_FDD
                    break

    # Set end pages: each exhibit ends where the next exhibit starts
    sorted_exhibits = sorted(exhibits.values(), key=lambda e: e.start_page if e.start_page else 9999)
    for i, ex in enumerate(sorted_exhibits):
        if ex.start_page == 0:
            continue
        if i + 1 < len(sorted_exhibits) and sorted_exhibits[i + 1].start_page > 0:
            ex.end_page = sorted_exhibits[i + 1].start_page - 1
        else:
            ex.end_page = len(page_reads)

    return exhibits
