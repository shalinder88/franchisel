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
    toc_map: Dict[int, int] = {}
    toc_text = "\n".join(p.text for p in toc_pages) if toc_pages else bootstrap_text
    for m in re.finditer(r'(?:ITEM|Item)\s+(\d+).*?\.{2,}\s*(\d+)', toc_text):
        n = int(m.group(1))
        p = int(m.group(2))
        if 1 <= n <= 23 and 1 <= p <= len(page_reads):
            toc_map[n] = p

    # ══ Exhibit map ══
    exhibit_map: Dict[str, str] = {}
    exhibit_text = "\n".join(p.text for p in exhibit_list_pages) if exhibit_list_pages else bootstrap_text
    for m in re.finditer(r'(?:EXHIBIT|Exhibit)\s+["\']?([A-Z](?:-?\d)?)["\']?\s*[-–—:]\s*(.+?)(?:\n|$)', exhibit_text):
        desc = m.group(2).strip()[:100]
        # Reject false positives: descriptions that are too short, numeric, or look like TOC artifacts
        if len(desc) >= 3 and not re.match(r'^\d+\.?\s*[A-Z]?$', desc):
            exhibit_map[m.group(1)] = desc
    # Also scan how-to-use page for exhibit references
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
        "stateNoticePresent": state_notice_present,
        "stateNotices": list(set(state_names_noticed)),
    }
