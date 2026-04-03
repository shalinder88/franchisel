"""
Report Order Spec

Default public report order. Downstream rendering follows this sequence.

1. What this business really is
2. Upfront capital and recurring burden
3. Supplier / software / affiliate dependence
4. Territory or development rights
5. Training and operations
6. Kill switches
7. Item 19 teaching section
8. Item 20 system trend
9. Item 21 financial strength
10. Contracts and exhibits
11. Questions to ask next
"""

from typing import List, Dict, Any


# Standard report section order
REPORT_SECTIONS = [
    {
        "id": "business_model",
        "title": "What This Franchise Really Is",
        "description": "Business model, offering paths, format variants",
        "source_items": [1],
        "source_engines": ["brand_identity", "offering_paths", "archetype"],
    },
    {
        "id": "economics",
        "title": "Upfront Capital and Recurring Burden",
        "description": "Initial investment, franchise fee, royalty, ad fund, technology fees",
        "source_items": [5, 6, 7],
        "source_engines": ["initial_fee_engine", "ongoing_fee_engine", "initial_investment_engine"],
    },
    {
        "id": "supplier_dependence",
        "title": "Supplier and Affiliate Dependence",
        "description": "Required purchases, approved suppliers, affiliate economics, lock-in",
        "source_items": [8],
        "source_engines": ["supplier_restrictions_engine"],
    },
    {
        "id": "territory",
        "title": "Territory and Development Rights",
        "description": "Exclusivity, protected area, development obligations, encroachment",
        "source_items": [12],
        "source_engines": ["territory_engine"],
    },
    {
        "id": "operations",
        "title": "Training and Operations",
        "description": "Training, support, technology, owner participation",
        "source_items": [11, 15],
        "source_engines": ["training_support_engine", "owner_participation_engine"],
    },
    {
        "id": "kill_switches",
        "title": "Kill Switches and Default Triggers",
        "description": "Minimum payments, sales performance, termination, non-compete, venue",
        "source_items": [17, 8, 11, 12, 15],
        "source_engines": ["kill_switch_engine", "contract_burden_engine"],
    },
    {
        "id": "item19",
        "title": "Revenue and Financial Performance",
        "description": "Item 19 FPR data, averages, medians, exclusions, what is NOT profit",
        "source_items": [19],
        "source_engines": ["item19_engine"],
    },
    {
        "id": "system_trend",
        "title": "System Growth and Stability",
        "description": "Unit counts, openings, closures, transfers, net growth",
        "source_items": [20],
        "source_engines": ["item20_engine"],
    },
    {
        "id": "financial_strength",
        "title": "Franchisor Financial Strength",
        "description": "Auditor, opinion, going concern, revenue, assets, net income",
        "source_items": [21],
        "source_engines": ["financial_statement_engine"],
    },
    {
        "id": "documents",
        "title": "Contracts and Exhibits",
        "description": "Document package, agreements to sign, state addenda",
        "source_items": [22, 23],
        "source_engines": ["document_package_engine"],
    },
    {
        "id": "questions",
        "title": "Questions to Ask Next",
        "description": "Validation-call questions based on gaps and risks",
        "source_items": [],
        "source_engines": ["buyer_questions"],
    },
]


def get_report_order() -> List[Dict[str, Any]]:
    """Get the default report section order."""
    return REPORT_SECTIONS


def get_section_by_id(section_id: str) -> Dict[str, Any]:
    """Get a specific report section by ID."""
    for s in REPORT_SECTIONS:
        if s["id"] == section_id:
            return s
    return {}
