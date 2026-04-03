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
    for pr in page_reads:
        for m in re.finditer(r'(?:^|\n)\s*EXHIBIT\s+["\']?([A-Z](?:-?\d)?)["\']?', pr.text, re.MULTILINE):
            code = m.group(1)
            if code in exhibits and exhibits[code].start_page == 0:
                exhibits[code].start_page = pr.page_num
            elif code not in exhibits:
                # Exhibit not in the bootstrap map — create a new one
                exhibits[code] = ExhibitObject(
                    exhibit_id=f"exhibit_{code}",
                    code=code,
                    raw_name=f"Exhibit {code}",
                    role=ExhibitRole.OTHER,
                    start_page=pr.page_num,
                )

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
