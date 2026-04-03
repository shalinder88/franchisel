"""
Item Content Rules

Defines what content SHOULD exist in each item and what signals
confirm or contradict that item's identity.

The extractor must know not only where an item starts, but what content
belongs there. This prevents wrong pickups and knows when content is suspicious.

Used by:
  - reader_pass.py: to understand what it's reading
  - content_confirmer.py: to validate section boundaries
  - completion_audit.py: to verify extraction completeness
"""

from typing import Dict, List, Any


# What each item is about — in plain English, then as content signals
ITEM_RULES = {
    1: {
        "about": "Who the franchisor is. Entity, formation, parent, predecessor, affiliates, business model, offering paths.",
        "must_contain": ["franchisor identity", "business description"],
        "content_signals": ["formed", "incorporated", "organized", "parent", "predecessor",
                            "affiliate", "began franchising", "began offering"],
        "typical_length_range": (2000, 30000),
        "is_table_primary": False,
        "importance": "high",
    },
    2: {
        "about": "Business experience of directors/officers. Names, titles, chronology. PII-sensitive.",
        "must_contain": ["officer/director experience"],
        "content_signals": ["business experience", "served as", "officer", "director",
                            "employment history", "position"],
        "typical_length_range": (2000, 30000),
        "is_table_primary": False,
        "importance": "low",  # PII-heavy, don't surface
    },
    3: {
        "about": "Litigation history. Pending/resolved cases, courts, settlements. Or explicit 'no litigation.'",
        "must_contain": ["litigation status"],
        "content_signals": ["litigation", "v.", "case no", "filed", "settlement",
                            "no litigation"],
        "typical_length_range": (100, 30000),
        "is_table_primary": False,
        "importance": "high",
    },
    4: {
        "about": "Bankruptcy disclosure. Chapter 7/11/13 or explicit 'no bankruptcy.' Usually very short.",
        "must_contain": ["bankruptcy status"],
        "content_signals": ["bankruptcy", "chapter 7", "chapter 11", "no bankruptcy"],
        "typical_length_range": (50, 3000),
        "is_table_primary": False,
        "importance": "medium",
    },
    5: {
        "about": "Initial fees. Franchise fee, development fee, non-refundable terms. THE INITIAL FEE TABLE.",
        "must_contain": ["initial franchise fee amount"],
        "content_signals": ["initial franchise fee", "initial fee", "development fee",
                            "non-refundable", "lump sum", "establishment fee"],
        "distinguishes_from": {6: "Item 5 is ONE-TIME fees. Item 6 is ONGOING fees."},
        "typical_length_range": (500, 15000),
        "is_table_primary": True,
        "importance": "critical",
    },
    6: {
        "about": "Ongoing fees. Royalty, ad fund, tech fees, transfer/renewal fees. THE RECURRING FEE TABLE.",
        "must_contain": ["royalty rate", "fee table rows"],
        "content_signals": ["royalty", "advertising", "ad fund", "% of gross", "% of net",
                            "transfer fee", "late fee", "other fees", "continuing fee"],
        "distinguishes_from": {5: "Item 6 is ONGOING fees. Item 5 is ONE-TIME fees.",
                               7: "Item 6 has fee RATES. Item 7 has INVESTMENT line items."},
        "typical_length_range": (2000, 30000),
        "is_table_primary": True,
        "importance": "critical",
    },
    7: {
        "about": "Estimated initial investment. Complete line-item table with TOTAL row. Format variants possible.",
        "must_contain": ["total investment range"],
        "content_signals": ["estimated initial investment", "your estimated", "leasehold",
                            "equipment", "total", "additional funds"],
        "distinguishes_from": {6: "Item 7 has INVESTMENT amounts (big $). Item 6 has fee RATES (%)."},
        "typical_length_range": (2000, 20000),
        "is_table_primary": True,
        "importance": "critical",
    },
    8: {
        "about": "Supplier control. Required/approved suppliers, affiliate economics, software/hardware requirements.",
        "must_contain": ["supplier requirements"],
        "content_signals": ["approved supplier", "designated supplier", "required purchase",
                            "sole source", "rebate", "commission", "software", "hardware"],
        "typical_length_range": (2000, 25000),
        "is_table_primary": False,
        "importance": "high",
    },
    9: {
        "about": "Obligations matrix. Cross-reference table mapping obligations to agreement sections.",
        "must_contain": ["obligations matrix"],
        "content_signals": ["obligation", "section in agreement", "franchisee's obligations"],
        "typical_length_range": (1000, 5000),
        "is_table_primary": True,
        "importance": "medium",
        "warning": "Dense cross-reference table — item mentions here are NOT section starts",
    },
    10: {
        "about": "Financing. Whether franchisor offers financing, terms, guarantees, cross-defaults.",
        "must_contain": ["financing availability"],
        "content_signals": ["financing", "do not offer financing", "guarantee", "sba",
                            "interest rate", "promissory note", "cross-default"],
        "typical_length_range": (200, 15000),
        "is_table_primary": False,
        "importance": "medium",
    },
    11: {
        "about": "Training, site selection, advertising, technology. KILL SWITCHES HIDE HERE.",
        "must_contain": ["training program", "support obligations"],
        "content_signals": ["training", "site selection", "advertising program", "computer",
                            "software", "pos", "operations manual", "opening assistance"],
        "typical_length_range": (5000, 30000),
        "is_table_primary": False,
        "importance": "high",
        "warning": "Kill switches hide here: ADA deadlines, tech cutoffs, site approval delays",
    },
    12: {
        "about": "Territory. Exclusivity, protected area, development rights, encroachment.",
        "must_contain": ["territory rights"],
        "content_signals": ["exclusive territory", "protected area", "territory", "radius",
                            "mile", "non-exclusive", "development area", "encroachment"],
        "typical_length_range": (1000, 15000),
        "is_table_primary": False,
        "importance": "high",
        "warning": "Development deadlines and loss-of-territory triggers hide here",
    },
    13: {
        "about": "Trademarks. Registration status, USPTO numbers, marks used.",
        "must_contain": ["trademark status"],
        "content_signals": ["trademark", "service mark", "registration no", "uspto",
                            "principal register"],
        "typical_length_range": (1000, 15000),
        "is_table_primary": False,
        "importance": "medium",
    },
    14: {
        "about": "Patents, copyrights, proprietary information. Trade secrets, AI/ML restrictions.",
        "must_contain": ["IP protection terms"],
        "content_signals": ["patent", "copyright", "proprietary", "trade secret",
                            "confidential", "operations manual"],
        "typical_length_range": (500, 10000),
        "is_table_primary": False,
        "importance": "medium",
        "warning": "AI/ML prohibition or confidentiality burdens may hide here",
    },
    15: {
        "about": "Owner participation. Full-time required? Absentee allowed? Staffing requirements.",
        "must_contain": ["participation requirements"],
        "content_signals": ["full-time", "full time", "personal supervision",
                            "managing owner", "operating principal", "best efforts"],
        "typical_length_range": (300, 8000),
        "is_table_primary": False,
        "importance": "medium",
        "warning": "Can change the buyer profile entirely",
    },
    16: {
        "about": "Product restrictions. What the franchisee may or may not sell.",
        "must_contain": ["product/service restrictions"],
        "content_signals": ["restrictions on what", "authorized products", "may sell",
                            "only those products", "add or delete"],
        "typical_length_range": (200, 5000),
        "is_table_primary": False,
        "importance": "medium",
    },
    17: {
        "about": "Contract terms. THE NASAA CONTRACT TABLE. Term, renewal, termination, non-compete, venue.",
        "must_contain": ["contract term length", "termination provisions", "non-compete terms"],
        "content_signals": ["renewal", "termination", "transfer", "non-compete",
                            "dispute resolution", "choice of forum", "choice of law",
                            "length of term", "term of franchise", "cure period"],
        "typical_length_range": (3000, 30000),
        "is_table_primary": True,
        "importance": "critical",
        "warning": "Kill-switch engine primary source. Cure periods, cross-defaults, venue burdens.",
    },
    18: {
        "about": "Public figures. Usually 1-2 lines. Either 'no public figure' or a name with compensation.",
        "must_contain": ["public figure status"],
        "content_signals": ["public figure", "do not use", "does not use"],
        "typical_length_range": (50, 2000),
        "is_table_primary": False,
        "importance": "low",
        "warning": "If section is long, content may belong to a different item. Flag for review.",
    },
    19: {
        "about": "FINANCIAL PERFORMANCE. THE HIGHEST PRIORITY ITEM. Revenue, EBITDA, costs, disclaimers.",
        "must_contain": ["FPR status (present or disclaimed)"],
        "content_signals": ["financial performance", "average", "median", "gross sales",
                            "gross revenue", "ebitda", "sold these amounts",
                            "earned these amounts", "your results may differ"],
        "distinguishes_from": {20: "Item 19 is MONEY ($). Item 20 is LOCATIONS (states, outlets)."},
        "typical_length_range": (500, 30000),
        "is_table_primary": True,
        "importance": "critical",
        "special_rules": [
            "Read it TWICE",
            "Import EVERY table, note, definition, exclusion",
            "Even if it says 'no FPR', check for dollar amounts > $1,000",
            "Check bold disclaimer language — it's evidence, not filler",
            "Follow ALL exhibit references immediately",
        ],
    },
    20: {
        "about": "OUTLETS AND SYSTEM HISTORY. Unit counts, openings, closures, transfers, state tables.",
        "must_contain": ["systemwide outlet counts"],
        "content_signals": ["systemwide outlet", "outlets at start", "outlets at end",
                            "opened", "terminated", "non-renewed", "reacquired",
                            "ceased operations", "franchised", "company-owned",
                            "transferred"],
        "distinguishes_from": {19: "Item 20 is LOCATIONS (outlets, states). Item 19 is MONEY (revenue)."},
        "typical_length_range": (3000, 30000),
        "is_table_primary": True,
        "importance": "critical",
    },
    21: {
        "about": "Financial statements. Usually points to a financial exhibit. Parse the exhibit.",
        "must_contain": ["financial exhibit reference"],
        "content_signals": ["financial statement", "audited", "fiscal year", "exhibit"],
        "typical_length_range": (100, 3000),
        "is_table_primary": False,
        "importance": "critical",
        "special_rules": ["Follow the exhibit reference immediately", "Cannot claim financial strength without direct parse"],
    },
    22: {
        "about": "Contracts. Lists which agreements/exhibits must be signed. Document package map.",
        "must_contain": ["agreement/exhibit list"],
        "content_signals": ["contracts", "agreement", "exhibit", "attached"],
        "typical_length_range": (200, 5000),
        "is_table_primary": False,
        "importance": "medium",
    },
    23: {
        "about": "Receipts. Signature/acknowledgment pages. PII-sensitive. Last pages of FDD.",
        "must_contain": ["receipt instructions"],
        "content_signals": ["receipt", "detach", "return", "acknowledg"],
        "typical_length_range": (100, 3000),
        "is_table_primary": False,
        "importance": "low",
        "warning": "PII-blocked. Extract only structural metadata.",
    },
}


def get_rule(item_num: int) -> Dict[str, Any]:
    """Get content rules for an item."""
    return ITEM_RULES.get(item_num, {})


def get_content_signals(item_num: int) -> List[str]:
    """Get the expected content signals for an item."""
    return ITEM_RULES.get(item_num, {}).get("content_signals", [])


def get_importance(item_num: int) -> str:
    """Get the importance level for an item."""
    return ITEM_RULES.get(item_num, {}).get("importance", "medium")


def is_table_primary(item_num: int) -> bool:
    """Whether this item is table-first extraction."""
    return ITEM_RULES.get(item_num, {}).get("is_table_primary", False)


def get_special_rules(item_num: int) -> List[str]:
    """Get special extraction rules for an item."""
    return ITEM_RULES.get(item_num, {}).get("special_rules", [])


def get_warnings(item_num: int) -> List[str]:
    """Get warnings for an item."""
    w = ITEM_RULES.get(item_num, {}).get("warning")
    return [w] if w else []


def score_content_match(item_num: int, text: str) -> int:
    """Score how well text matches expected content for an item.
    Simple word matching, no regex. Returns signal hit count."""
    signals = get_content_signals(item_num)
    text_lower = text[:8000].lower()
    return sum(1 for s in signals if s in text_lower)
