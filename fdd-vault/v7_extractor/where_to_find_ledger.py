"""
Where-To-Find Ledger

Built from page 2 ("How to Use This FDD") and TOC.
Acts as the extractor's persistent self-reminder list.

Stores expected source locations for key information:
  - Where to find earnings → Item 19 / specific exhibit
  - Where to find fees → Items 5, 6
  - Where to find investment → Item 7
  - Where to find suppliers → Item 8
  - Where to find outlet trends → Item 20
  - Where to find financials → Item 21 / financial exhibit
  - Where to find agreements → Item 22 / exhibits
  - Where to find receipts → Item 23

At end of run, the ledger is re-checked to ensure everything promised
by the document was actually extracted. Unresolved entries block publish.
"""

from typing import Dict, List, Any, Optional


class WhereToFindEntry:
    """One expected information source."""

    def __init__(self, topic: str, expected_items: List[int] = None,
                 expected_exhibits: List[str] = None, source_page: int = 0):
        self.topic = topic
        self.expected_items = expected_items or []
        self.expected_exhibits = expected_exhibits or []
        self.source_page = source_page
        self.resolved = False
        self.resolution_source: Optional[str] = None  # "item_19" / "exhibit_O" etc
        self.resolution_page: Optional[int] = None

    def resolve(self, source: str, page: int = 0):
        self.resolved = True
        self.resolution_source = source
        self.resolution_page = page

    def to_dict(self) -> Dict:
        return {
            "topic": self.topic,
            "expected_items": self.expected_items,
            "expected_exhibits": self.expected_exhibits,
            "source_page": self.source_page,
            "resolved": self.resolved,
            "resolution_source": self.resolution_source,
        }


class WhereToFindLedger:
    """Persistent self-reminder list for the extractor."""

    def __init__(self):
        self.entries: List[WhereToFindEntry] = []

    def add(self, topic: str, items: List[int] = None,
            exhibits: List[str] = None, source_page: int = 0):
        self.entries.append(WhereToFindEntry(topic, items, exhibits, source_page))

    def resolve(self, topic: str, source: str, page: int = 0):
        for e in self.entries:
            if e.topic == topic:
                e.resolve(source, page)

    def unresolved(self) -> List[WhereToFindEntry]:
        return [e for e in self.entries if not e.resolved]

    def all_resolved(self) -> bool:
        return all(e.resolved for e in self.entries)

    def to_dict(self) -> Dict:
        return {
            "entries": [e.to_dict() for e in self.entries],
            "total": len(self.entries),
            "resolved": sum(1 for e in self.entries if e.resolved),
            "unresolved": sum(1 for e in self.entries if not e.resolved),
        }

    def unresolved_summary(self) -> List[str]:
        return [f"{e.topic}: expected in Items {e.expected_items} / Exhibits {e.expected_exhibits}"
                for e in self.unresolved()]


def build_ledger_from_bootstrap(bootstrap: Dict[str, Any]) -> WhereToFindLedger:
    """Build the where-to-find ledger from bootstrap data.

    Uses TOC, exhibit map, and page 2 "How to Use" information.
    """
    ledger = WhereToFindLedger()

    toc = bootstrap.get("tocMap", {})
    exhibit_map = bootstrap.get("exhibitMap", {})

    # Standard FDD information sources
    ledger.add("earnings_performance", items=[19], source_page=2)
    ledger.add("fees_initial", items=[5], source_page=2)
    ledger.add("fees_ongoing", items=[6], source_page=2)
    ledger.add("investment_total", items=[7], source_page=2)
    ledger.add("supplier_restrictions", items=[8], source_page=2)
    ledger.add("outlet_trends", items=[20], source_page=2)
    ledger.add("financial_statements", items=[21], source_page=2)
    ledger.add("contracts_agreements", items=[22], source_page=2)
    ledger.add("receipts", items=[23], source_page=2)
    ledger.add("litigation", items=[3], source_page=2)
    ledger.add("bankruptcy", items=[4], source_page=2)
    ledger.add("territory", items=[12], source_page=2)
    ledger.add("training_support", items=[11], source_page=2)
    ledger.add("contract_terms", items=[17], source_page=2)

    # Add exhibit-specific entries from exhibit map
    for code, desc in exhibit_map.items():
        desc_lower = desc.lower()
        exhibits = [code]
        if "financial" in desc_lower or "statement" in desc_lower:
            ledger.add(f"financial_exhibit_{code}", items=[21], exhibits=exhibits)
        elif "franchise agreement" in desc_lower:
            ledger.add(f"franchise_agreement_{code}", items=[22], exhibits=exhibits)
        elif "franchisee" in desc_lower:
            ledger.add(f"franchisee_list_{code}", items=[20], exhibits=exhibits)
        elif "addend" in desc_lower or "state" in desc_lower:
            ledger.add(f"state_addendum_{code}", exhibits=exhibits)

    return ledger
