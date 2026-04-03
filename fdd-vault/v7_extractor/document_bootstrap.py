"""
Phase 0: Document Bootstrap

Read and classify bootstrap pages:
  - cover page
  - "How to Use This Franchise Disclosure Document"
  - special-risks page
  - state notice pages
  - table of contents
  - exhibit list

Page 1 always creates the initial archetype object.
The special-risks page always seeds the kill-switch engine.
The exhibit list always creates the exhibit-role map.

Outputs:
  - document_identity
  - brand_identity
  - issue_date / amendment_date
  - early_brand_summary
  - offering_paths
  - risk_flags_early
  - toc_map
  - exhibit_map
  - state_notice_presence
"""

import re
from typing import List, Dict, Any
from .models import PageRead, PageType


def build_bootstrap(page_reads: List[PageRead]) -> Dict[str, Any]:
    """Extract document bootstrap from early pages.

    Reads cover, how-to-use, special-risks, TOC, and exhibit list pages.
    These are identified by page classification, not by position alone.
    """
    # Collect bootstrap pages by type
    cover_pages = [p for p in page_reads if p.page_type == PageType.COVER]
    howto_pages = [p for p in page_reads if p.page_type == PageType.HOW_TO_USE]
    risk_pages = [p for p in page_reads if p.page_type == PageType.SPECIAL_RISKS]
    toc_pages = [p for p in page_reads if p.page_type == PageType.TOC]
    exhibit_list_pages = [p for p in page_reads if p.page_type == PageType.EXHIBIT_LIST]
    state_pages = [p for p in page_reads if p.page_type == PageType.STATE_NOTICE]

    # Also use first ~12 pages as bootstrap text for fallback scanning
    early_pages = [p for p in page_reads if p.page_num <= 12]
    bootstrap_text = "\n".join(p.text for p in early_pages)

    # ══ Cover page ══
    cover_text = cover_pages[0].text if cover_pages else (page_reads[0].text if page_reads else "")

    # Entity name
    entity_match = re.search(r'FRANCHISE DISCLOSURE DOCUMENT\s*\n\s*(.+?)(?:\n|$)', cover_text)
    entity = entity_match.group(1).strip()[:120] if entity_match else ""

    # Issuance date
    date_match = re.search(r'(?:Issuance|Issue|Effective)\s*(?:Date)?[^:]*:\s*(.+?)(?:\n|$)', cover_text, re.I)
    issue_date = date_match.group(1).strip()[:100] if date_match else ""

    # Amendment date
    amend_match = re.search(r'(?:amended|amendment)\s*(?:Date)?[^:]*:\s*(.+?)(?:\n|$)', cover_text, re.I)
    amendment_date = amend_match.group(1).strip()[:100] if amend_match else ""
    if not amendment_date:
        amend_match2 = re.search(r'as\s+amended\s+(.+?)(?:\.|$)', cover_text, re.I)
        amendment_date = amend_match2.group(1).strip()[:100] if amend_match2 else ""

    # Investment range from cover
    inv_vals = re.findall(r'\$([\d,]+)', cover_text[:3000])
    inv_nums = sorted(set(int(v.replace(',', '')) for v in inv_vals if int(v.replace(',', '')) > 10000))

    # Business description
    desc_lines = [l.strip() for l in cover_text.split('\n') if len(l.strip()) > 40 and any(
        w in l.lower() for w in ['offer', 'franchise', 'operate', 'provide', 'service',
                                  'restaurant', 'business', 'studio', 'salon', 'school',
                                  'care', 'training', 'fitness', 'food'])]
    description = desc_lines[0][:300] if desc_lines else ""

    # ══ Offering paths ══
    offering_paths = []
    path_patterns = [
        (r'(?:Standard|Traditional)\s+(?:Franchise|Restaurant|Store|Unit)', "standard"),
        (r'(?:Non[\-\s]?Traditional|Express)', "non_traditional"),
        (r'(?:Small[\-\s]?(?:Town|Box|Format))', "small_format"),
        (r'(?:Development|Area\s+Development|Multi[\-\s]?Unit)', "development"),
        (r'(?:License|Licensing)\s+(?:Agreement|Program)', "license"),
    ]
    for pp, label in path_patterns:
        if re.search(pp, bootstrap_text, re.I):
            offering_paths.append(label)

    # ══ Special risks ══
    risk_flags = []
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
    risk_text = "\n".join(p.text for p in risk_pages) if risk_pages else bootstrap_text
    for rn, rp in risk_checks.items():
        if re.search(rp, risk_text, re.I):
            risk_flags.append(rn)

    # ══ TOC map ══
    # General rule: TOC formats vary. Must handle:
    #   "Item 1  Description ..... 5"  (Papa Johns style)
    #   "1. The Franchisor...  1"       (McDonald's style)
    #   "  1. Description .... 10"      (numbered dotted list)
    toc_map: Dict[int, int] = {}
    toc_text = "\n".join(p.text for p in toc_pages) if toc_pages else bootstrap_text

    # Pattern 1: "Item N ... page" with dots
    for m in re.finditer(r'(?:ITEM|Item)\s+(\d+).*?\.{2,}\s*(\d+)', toc_text):
        n = int(m.group(1))
        p = int(m.group(2))
        if 1 <= n <= 23:
            toc_map[n] = p

    # Pattern 2: "N. Description ... page" (numbered list without "Item")
    if not toc_map:
        for m in re.finditer(r'(?:^|\n)\s*(\d{1,2})\.\s+[A-Z][^.]*?\.{2,}\s*(\d+)', toc_text):
            n = int(m.group(1))
            p = int(m.group(2))
            if 1 <= n <= 23:
                toc_map[n] = p

    # Pattern 3: "Item N\n Description" with page on separate line or after whitespace
    if not toc_map:
        for m in re.finditer(r'(?:ITEM|Item)\s+(\d+)\b.*?(?:\s{3,}|\t)(\d+)\s*$', toc_text, re.MULTILINE):
            n = int(m.group(1))
            p = int(m.group(2))
            if 1 <= n <= 23:
                toc_map[n] = p

    # ══ Page offset calibration ══
    # FDD page numbers != PDF page numbers. Detect offset from TOC + actual content.
    fdd_to_pdf_offset = 0
    if toc_map:
        # Find Item 1's TOC page number and actual PDF page
        toc_item1_page = toc_map.get(1)
        if toc_item1_page:
            # Search for "Item 1" heading in the PDF to find actual page
            for pr in page_reads:
                if re.search(r'(?:^|\n)\s*(?:ITEM|Item)\s+1[\s:\n]', pr.text[:200]):
                    # Found it — compute offset
                    fdd_to_pdf_offset = pr.page_num - toc_item1_page
                    break

        # Apply offset to all TOC entries
        if fdd_to_pdf_offset != 0:
            calibrated_map: Dict[int, int] = {}
            for n, p in toc_map.items():
                calibrated_p = p + fdd_to_pdf_offset
                if 1 <= calibrated_p <= len(page_reads):
                    calibrated_map[n] = calibrated_p
            toc_map = calibrated_map

    # ══ Exhibit map ══
    # General rule: Exhibit list formats vary. Must handle:
    #   "Exhibit A – Financial Statements"  (Papa Johns style)
    #   "A. Financial Statements"           (McDonald's style)
    #   "A  Financial Statements"           (tabular layout)
    exhibit_map: Dict[str, str] = {}
    exhibit_text = "\n".join(p.text for p in exhibit_list_pages) if exhibit_list_pages else ""
    # Also include TOC pages since some FDDs list exhibits on the TOC continuation
    if not exhibit_text:
        exhibit_text = "\n".join(p.text for p in toc_pages) if toc_pages else bootstrap_text

    # Pattern 1: "Exhibit A – Description" (with separator)
    for m in re.finditer(r'(?:EXHIBIT|Exhibit)\s+["\']?([A-Z](?:-?\d)?)["\']?\s*[-–—:]\s*(.+?)(?:\n|$)', exhibit_text):
        desc = m.group(2).strip()[:100]
        if len(desc) >= 3 and not re.match(r'^\d+\.?\s*[A-Z]?$', desc):
            exhibit_map[m.group(1)] = desc

    # Pattern 2: "A. Description" (bare lettered list)
    if not exhibit_map:
        # Look for exhibit section header first
        exhibit_section = re.search(r'(?:Exhibit|EXHIBIT)s?\s*\n((?:.*\n){1,40})', exhibit_text)
        if exhibit_section:
            section_text = exhibit_section.group(1)
            for m in re.finditer(r'(?:^|\n)\s*([A-Z](?:-?\d)?)\.\s+(.+?)(?:\n|$)', section_text):
                code = m.group(1)
                desc = m.group(2).strip()[:100]
                if len(desc) >= 3 and code not in exhibit_map:
                    exhibit_map[code] = desc

    # Pattern 3: Scan how-to-use pages
    for hp in howto_pages:
        for m in re.finditer(r'Exhibit\s+["\']?([A-Z](?:-?\d)?)["\']?\s*[-–—:]\s*(.+?)(?:\n|$)', hp.text):
            desc = m.group(2).strip()[:100]
            if m.group(1) not in exhibit_map and len(desc) >= 3 and not re.match(r'^\d+\.?\s*[A-Z]?$', desc):
                exhibit_map[m.group(1)] = desc

    # ══ State notices ══
    state_notice_present = len(state_pages) > 0
    state_names_noticed = []
    for sp in state_pages:
        for state in ["Michigan", "California", "Illinois", "Maryland", "Minnesota",
                       "New York", "Virginia", "Washington", "Wisconsin", "North Dakota",
                       "Rhode Island", "South Dakota"]:
            if state.lower() in sp.text.lower():
                state_names_noticed.append(state)

    return {
        "entity": entity,
        "issueDate": issue_date,
        "amendmentDate": amendment_date,
        "description": description,
        "offeringPaths": offering_paths,
        "investmentRange": inv_nums[:2] if len(inv_nums) >= 2 else inv_nums,
        "specialRisks": risk_flags,
        "tocMap": toc_map,
        "exhibitMap": exhibit_map,
        "fddToPdfOffset": fdd_to_pdf_offset,
        "stateNoticePresent": state_notice_present,
        "stateNotices": list(set(state_names_noticed)),
    }
