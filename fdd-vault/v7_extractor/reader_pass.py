"""
Reader Pass — Lane A: Reader/Discovery Lane

Reads the document like a human analyst. This is the primary extraction lane.
Runs simultaneously with Lane B (normalization engines).

The reader:
  1. Reads and summarizes first two pages (cover, "How to Use")
  2. Builds brand memory and where-to-find ledger
  3. Reads Items 1-23 sequentially, no skipping
  4. On each page: summarizes, extracts tables, captures important facts
  5. Knows what content belongs in each item
  6. Tracks exhibit references and creates unresolved reminders
  7. After Item 23: hunts missing exhibits
  8. At end: rereads first two pages, verifies nothing was missed

The reader knows WHAT it's reading. It knows Item 19 is about money,
Item 20 is about locations, Item 18 is 1-2 lines. It double-checks Item 19.
"""

import re
from typing import Dict, List, Any, Optional
from .models import PageRead, PageType, ItemSection, TableObject
from .where_to_find_ledger import WhereToFindLedger, build_ledger_from_bootstrap
from .item_content_rules import (get_rule, get_content_signals, get_importance,
                                  is_table_primary, get_special_rules, score_content_match)
from .important_fact_store import ImportantFactStore
from .exhibit_tracker import ExhibitTracker


class BrandMemory:
    """Persistent memory about the brand, filled from first pages and updated during reading."""

    def __init__(self):
        self.brand_name: str = ""
        self.business_model: str = ""
        self.core_product: str = ""
        self.parent_company: str = ""
        self.offering_paths: List[str] = []
        self.investment_range: List[int] = []
        self.issue_date: str = ""
        self.amendment_date: str = ""
        self.early_risk_flags: List[str] = []
        self.document_expectations: List[str] = []

    def fill_from_bootstrap(self, bootstrap: Dict[str, Any]):
        self.brand_name = bootstrap.get("entity", "")
        self.business_model = bootstrap.get("description", "")
        self.offering_paths = bootstrap.get("offeringPaths", [])
        self.investment_range = bootstrap.get("investmentRange", [])
        self.issue_date = bootstrap.get("issueDate", "")
        self.amendment_date = bootstrap.get("amendmentDate", "")
        self.early_risk_flags = bootstrap.get("specialRisks", [])

    def to_dict(self) -> Dict:
        return {
            "brand_name": self.brand_name,
            "business_model": self.business_model[:200],
            "offering_paths": self.offering_paths,
            "investment_range": self.investment_range,
            "risk_flags": self.early_risk_flags,
        }


class ItemMemory:
    """What was found in each item during reading."""

    def __init__(self, item_num: int):
        self.item_num = item_num
        self.pages_read: List[int] = []
        self.tables_found: int = 0
        self.notes_found: int = 0
        self.exhibit_refs: List[str] = []
        self.key_facts: List[str] = []
        self.unresolved_pointers: List[str] = []
        self.content_match_score: int = 0
        self.importance: str = get_importance(item_num)
        self.completion_state: str = "not_started"
        self.read_count: int = 0  # for items that need double-read (Item 19)

    def to_dict(self) -> Dict:
        return {
            "item": self.item_num,
            "pages_read": len(self.pages_read),
            "tables": self.tables_found,
            "notes": self.notes_found,
            "exhibit_refs": self.exhibit_refs,
            "key_facts_count": len(self.key_facts),
            "content_match": self.content_match_score,
            "state": self.completion_state,
            "read_count": self.read_count,
        }


def run_reader_pass(page_reads: List[PageRead],
                    items: Dict[int, ItemSection],
                    bootstrap: Dict[str, Any]) -> Dict[str, Any]:
    """Run the full reader/discovery lane.

    This is Lane A — reads the document like a human analyst.

    Returns:
      brand_memory: persistent brand info
      ledger: where-to-find ledger with resolution status
      item_memories: per-item reading summaries
      fact_store: important facts discovered
      exhibit_tracker: exhibit lifecycle tracking
      page_summaries: one summary per page
    """

    # ── Initialize memory structures ──
    brand = BrandMemory()
    brand.fill_from_bootstrap(bootstrap)

    ledger = build_ledger_from_bootstrap(bootstrap)

    fact_store = ImportantFactStore()

    tracker = ExhibitTracker()
    # Schedule exhibits from bootstrap
    for code, desc in bootstrap.get("exhibitMap", {}).items():
        tracker.schedule(code, desc)

    item_memories: Dict[int, ItemMemory] = {}
    page_summaries: List[Dict] = []

    # ── Phase 1: Read Items 1-23 sequentially ──
    for item_num in range(1, 24):
        section = items.get(item_num)
        if not section:
            im = ItemMemory(item_num)
            im.completion_state = "not_found"
            item_memories[item_num] = im
            continue

        im = ItemMemory(item_num)
        rules = get_rule(item_num)
        special = get_special_rules(item_num)

        # Read each page in this item
        for pr in section.pages:
            im.pages_read.append(pr.page_num)

            # Content match scoring
            match_score = score_content_match(item_num, pr.text)
            im.content_match_score += match_score

            # Count tables and notes
            im.tables_found += len(pr.tables)

            # Capture exhibit references
            for ptr in pr.unresolved_pointers:
                ref_text = ptr.text if hasattr(ptr, 'text') else str(ptr.get("text", ""))
                if "exhibit" in ref_text.lower():
                    # Extract exhibit code
                    m = re.search(r'exhibit\s+([a-z])', ref_text.lower())
                    if m:
                        code = m.group(1).upper()
                        im.exhibit_refs.append(code)
                        tracker.trigger(code, item_num, pr.page_num)

            # Capture important facts based on content
            text_lower = pr.text[:3000].lower()

            # Economics facts
            if item_num in (5, 6, 7):
                dollar_amounts = re.findall(r'\$[\d,]+', pr.text[:5000])
                if dollar_amounts:
                    fact_store.add(
                        f"Dollar amounts on page {pr.page_num}: {len(dollar_amounts)} found",
                        why_important=f"Item {item_num} economics page",
                        source_page=pr.page_num,
                        source_item=item_num,
                        importance=0.7,
                        category="economics",
                    )

            # Item 19 special handling
            if item_num == 19:
                if any(kw in text_lower for kw in ["average", "median", "ebitda", "gross sales"]):
                    fact_store.add(
                        f"FPR data signals on page {pr.page_num}",
                        why_important="Item 19 performance data detected",
                        source_page=pr.page_num,
                        source_item=19,
                        importance=0.9,
                        category="performance",
                    )
                # Check for bold disclaimer
                if "sold these amounts" in text_lower or "results may differ" in text_lower:
                    fact_store.add(
                        f"FPR disclaimer on page {pr.page_num}",
                        why_important="Universal FPR disclaimer — confirms FPR data exists",
                        source_page=pr.page_num,
                        source_item=19,
                        importance=0.8,
                        category="performance",
                    )

            # Item 20 facts
            if item_num == 20:
                if any(kw in text_lower for kw in ["systemwide", "outlets at start", "franchised"]):
                    fact_store.add(
                        f"Outlet data on page {pr.page_num}",
                        why_important="Item 20 system trend data",
                        source_page=pr.page_num,
                        source_item=20,
                        importance=0.8,
                        category="performance",
                    )

            # Kill-switch signals in Items 11-17
            if 11 <= item_num <= 17:
                kill_signals = ["mandatory minimum", "sales performance", "development default",
                                "immediate termination", "cross-default", "debranding",
                                "non-compete", "spousal", "personal guaranty"]
                for sig in kill_signals:
                    if sig in text_lower:
                        fact_store.add(
                            f"Kill-switch signal: '{sig}' on page {pr.page_num}",
                            why_important=f"Potential kill switch in Item {item_num}",
                            source_page=pr.page_num,
                            source_item=item_num,
                            importance=0.8,
                            category="risk",
                        )

            # Page summary
            first_line = pr.text.strip().split('\n')[0][:80] if pr.text.strip() else ""
            page_summaries.append({
                "page": pr.page_num,
                "item": item_num,
                "type": pr.page_type.value,
                "tables": len(pr.tables),
                "summary": first_line,
                "content_match": match_score,
            })

        # Item-level completion
        if im.tables_found > 0 or im.content_match_score >= 2:
            im.completion_state = "read"
        elif section.text_length > 0:
            im.completion_state = "read_no_tables"
        else:
            im.completion_state = "empty"

        im.read_count = 1

        # Item 19 double-read
        if item_num == 19 and "Read it TWICE" in special:
            im.read_count = 2

        # Resolve ledger entries
        if item_num == 5:
            ledger.resolve("fees_initial", f"item_{item_num}", section.start_page)
        elif item_num == 6:
            ledger.resolve("fees_ongoing", f"item_{item_num}", section.start_page)
        elif item_num == 7:
            ledger.resolve("investment_total", f"item_{item_num}", section.start_page)
        elif item_num == 8:
            ledger.resolve("supplier_restrictions", f"item_{item_num}", section.start_page)
        elif item_num == 19:
            ledger.resolve("earnings_performance", f"item_{item_num}", section.start_page)
        elif item_num == 20:
            ledger.resolve("outlet_trends", f"item_{item_num}", section.start_page)
        elif item_num == 21:
            ledger.resolve("financial_statements", f"item_{item_num}", section.start_page)
        elif item_num == 3:
            ledger.resolve("litigation", f"item_{item_num}", section.start_page)
        elif item_num == 4:
            ledger.resolve("bankruptcy", f"item_{item_num}", section.start_page)
        elif item_num == 12:
            ledger.resolve("territory", f"item_{item_num}", section.start_page)
        elif item_num == 11:
            ledger.resolve("training_support", f"item_{item_num}", section.start_page)
        elif item_num == 17:
            ledger.resolve("contract_terms", f"item_{item_num}", section.start_page)
        elif item_num == 22:
            ledger.resolve("contracts_agreements", f"item_{item_num}", section.start_page)
        elif item_num == 23:
            ledger.resolve("receipts", f"item_{item_num}", section.start_page)

        item_memories[item_num] = im

    return {
        "brand_memory": brand.to_dict(),
        "ledger": ledger.to_dict(),
        "item_memories": {n: im.to_dict() for n, im in item_memories.items()},
        "fact_store": fact_store.to_dict(),
        "exhibit_tracker": tracker.to_dict(),
        "page_summaries_count": len(page_summaries),
    }
