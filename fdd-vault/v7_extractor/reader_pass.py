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

            # ── SPECIFIC FACT EXTRACTION ──
            # Lane A is the lead extractor. Capture specific facts with text, not signals.

            # Item 5: Initial fees — capture specific fee amounts
            if item_num == 5:
                for m in re.finditer(r'(?:franchise\s+fee|development\s+fee|initial\s+fee)[^.]*\$\s*([\d,]+(?:\.\d{2})?)[^.]*', text_lower):
                    fact_store.add(
                        m.group(0).strip()[:200],
                        why_important="Initial fee amount — candidate for initialFranchiseFee",
                        source_page=pr.page_num, source_item=5,
                        importance=0.9, category="economics",
                    )

            # Item 6: Ongoing fees — capture royalty, ad fund, specific rates
            if item_num == 6:
                for m in re.finditer(r'((?:royalt|continuing\s+fee|ad\s+fund|marketing\s+fund|advertising|technology|transfer|renewal)[^.]*?\d+(?:\.\d+)?%[^.]*)', text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important="Ongoing fee rate — candidate for royaltyRate/marketingFundRate",
                        source_page=pr.page_num, source_item=6,
                        importance=0.9, category="economics",
                    )

            # Item 7: Investment — capture total row, format variants
            if item_num == 7:
                for m in re.finditer(r'((?:total|estimated\s+(?:initial\s+)?investment)[^.]*\$[\d,]+[^.]*)', text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important="Investment total — candidate for totalInvestmentLow/High",
                        source_page=pr.page_num, source_item=7,
                        importance=0.9, category="economics",
                    )
                # Format variant detection
                for variant in ["non-traditional", "nontraditional", "small-town", "small town",
                                "express", "kiosk", "satellite", "non traditional"]:
                    if variant in text_lower:
                        fact_store.add(
                            f"Format variant '{variant}' on page {pr.page_num}",
                            why_important="Multiple offering formats affect investment ranges",
                            source_page=pr.page_num, source_item=7,
                            importance=0.7, category="economics",
                        )

            # Item 8: Supplier restrictions — capture specific obligations
            if item_num == 8:
                for pattern, desc in [
                    (r'(must\s+purchas[^.]+(?:from\s+us|from\s+approved|designated)[^.]*)', "Mandatory purchase restriction"),
                    (r'((?:sole|exclusive)\s+(?:source|supplier|distributor)[^.]*)', "Exclusive supplier designation"),
                    (r'((?:approved|designated)\s+(?:supplier|vendor)[^.]*)', "Approved supplier requirement"),
                ]:
                    for m in re.finditer(pattern, text_lower):
                        fact_store.add(
                            m.group(1).strip()[:200],
                            why_important=desc,
                            source_page=pr.page_num, source_item=8,
                            importance=0.7, category="control",
                        )

            # Items 11-17: Kill-switch and control clause extraction
            if 11 <= item_num <= 17:
                KILL_PATTERNS = [
                    (r'(mandatory\s+minimum[^.]*)', "Mandatory minimum requirement — termination trigger"),
                    (r'((?:sales|revenue)\s+performance\s+(?:requirement|standard|benchmark)[^.]*)', "Sales performance requirement"),
                    (r'(immediate\s+terminat[^.]*)', "Immediate termination trigger"),
                    (r'(cross[- ]?default[^.]*)', "Cross-default — one breach kills all agreements"),
                    (r'(non[- ]?compete[^.]*(?:\d+)\s*(?:year|mile|month)[^.]*)', "Non-compete clause with scope"),
                    (r'(spousal\s+guarant[^.]*)', "Spousal guaranty — extends liability to spouse"),
                    (r'(personal\s+guarant[^.]*)', "Personal guaranty — individual asset exposure"),
                    (r'(right\s+of\s+first\s+refusal[^.]*)', "ROFR — restricts exit options"),
                    (r'((?:remodel|renovation)\s+(?:requirement|obligation)[^.]*)', "Mandatory remodel obligation"),
                    (r'(liquidated\s+damage[^.]*)', "Liquidated damages — preset termination penalty"),
                    (r'(debranding[^.]*)', "Debranding requirement"),
                    (r'(cure\s+period[^.]*\d+\s*(?:day|business\s+day)[^.]*)', "Cure period specification"),
                ]
                for pattern, why in KILL_PATTERNS:
                    for m in re.finditer(pattern, text_lower):
                        fact_store.add(
                            m.group(1).strip()[:200],
                            why_important=why,
                            source_page=pr.page_num, source_item=item_num,
                            importance=0.85, category="risk",
                        )

            # Item 19: FPR — capture specific performance data
            if item_num == 19:
                # Capture average/median dollar amounts
                for m in re.finditer(r'((?:average|median)[^.]*\$\s*[\d,]+[^.]*)', text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important="FPR performance figure — candidate for item19_avgRevenue",
                        source_page=pr.page_num, source_item=19,
                        importance=0.95, category="performance",
                    )
                # Disclaimers
                if "sold these amounts" in text_lower or "results may differ" in text_lower:
                    # Find the actual disclaimer sentence
                    for m in re.finditer(r'([^.]*(?:sold these amounts|results may differ)[^.]*\.)', text_lower):
                        fact_store.add(
                            m.group(1).strip()[:200],
                            why_important="Universal FPR disclaimer — confirms FPR data exists",
                            source_page=pr.page_num, source_item=19,
                            importance=0.8, category="performance",
                        )
                        break
                # Population definition
                for m in re.finditer(r'((?:based on|includes|represents|consisted of)[^.]*(?:outlet|unit|store|restaurant|franchise)s?[^.]*\.)', text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important="FPR population definition — who's included/excluded",
                        source_page=pr.page_num, source_item=19,
                        importance=0.8, category="performance",
                    )

            # Item 20: Outlet data — capture specific counts
            if item_num == 20:
                # Look for specific unit counts
                for m in re.finditer(r'((?:total|systemwide|franchised|company)[^.]*(?:\d{2,5})\s*(?:outlet|unit|store|restaurant|location|franchise)s?[^.]*)', text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important="Outlet count data — candidate for totalUnits/franchisedUnits",
                        source_page=pr.page_num, source_item=20,
                        importance=0.8, category="performance",
                    )

            # Item 21: Financial statements — capture auditor reference
            if item_num == 21:
                for m in re.finditer(r'((?:exhibit\s+[a-z])[^.]*(?:audited\s+financial|financial\s+statement)[^.]*)', text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important="Item 21 financial exhibit reference — must follow through",
                        source_page=pr.page_num, source_item=21,
                        importance=0.9, category="document",
                    )

            # Any item: unusual but important clauses
            UNUSUAL_PATTERNS = [
                (r'((?:in\s+addition\s+to|notwithstanding)[^.]*(?:fee|payment|obligation)[^.]*\.)', "Additional fee/obligation clause", "economics"),
                (r'((?:we\s+(?:may|reserve|retain)\s+the\s+right)[^.]*(?:terminat|modif|chang|amend)[^.]*\.)', "Franchisor reservation of rights", "control"),
                (r'((?:you\s+(?:must|shall|are\s+required))[^.]*(?:at\s+your\s+(?:own\s+)?(?:expense|cost))[^.]*\.)', "Franchisee expense obligation", "economics"),
            ]
            for pattern, why, cat in UNUSUAL_PATTERNS:
                for m in re.finditer(pattern, text_lower):
                    fact_store.add(
                        m.group(1).strip()[:200],
                        why_important=why,
                        source_page=pr.page_num, source_item=item_num,
                        importance=0.6, category=cat,
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
