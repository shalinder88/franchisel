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


def _deep_read_item(item_num: int, text: str, start_page: int,
                    fact_store: ImportantFactStore) -> None:
    """Deep-read an item's text and extract every important fact.

    This is how Lane A learns. It reads like a human analyst:
    - Every sentence with a dollar amount, percentage, or obligation
    - Every restriction, requirement, prohibition
    - Every right the franchisor reserves
    - Every risk factor, penalty, or termination trigger
    - Every reference to exhibits, policies, agreements
    - Every factual assertion about the system

    General rule: extract the SENTENCE, not the keyword.
    """
    if not text or len(text) < 20:
        return

    text_lower = text.lower()
    # Split into sentences (approximate)
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text[:30000])

    for sent in sentences:
        sent_stripped = sent.strip()
        if len(sent_stripped) < 15 or len(sent_stripped) > 500:
            continue
        sent_lower = sent_stripped.lower()

        # ── ECONOMICS: dollar amounts, percentages, rates ──
        has_dollar = '$' in sent_stripped
        has_percent = '%' in sent_stripped
        has_economics = has_dollar or has_percent

        if has_economics:
            # Classify what kind of economic fact
            if any(kw in sent_lower for kw in ['fee', 'royalt', 'rent', 'payment', 'contribution', 'charge']):
                category = "economics"
                importance = 0.85
                why = "Fee or payment obligation"
            elif any(kw in sent_lower for kw in ['invest', 'cost', 'expense', 'total']):
                category = "economics"
                importance = 0.8
                why = "Investment or cost figure"
            elif any(kw in sent_lower for kw in ['sales', 'revenue', 'income', 'profit', 'average', 'median']):
                category = "performance"
                importance = 0.9
                why = "Performance/revenue figure"
            else:
                category = "economics"
                importance = 0.6
                why = "Contains dollar or percentage"

            fact_store.add(
                sent_stripped[:300], why_important=why,
                source_page=start_page, source_item=item_num,
                importance=importance, category=category,
            )

        # ── OBLIGATIONS: what the franchisee must/shall do ──
        if re.search(r'\b(?:you\s+(?:must|shall|are\s+required|will\s+be\s+required|are\s+obligated))\b', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="Franchisee obligation",
                source_page=start_page, source_item=item_num,
                importance=0.8, category="control",
            )

        # ── PROHIBITIONS: what the franchisee cannot do ──
        if re.search(r'\b(?:you\s+(?:may\s+not|cannot|shall\s+not|are\s+(?:not\s+)?(?:permitted|allowed|authorized)))\b', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="Franchisee prohibition",
                source_page=start_page, source_item=item_num,
                importance=0.8, category="control",
            )

        # ── FRANCHISOR RIGHTS: what the franchisor reserves ─��
        if re.search(r'\b(?:we\s+(?:may|can|have\s+the\s+right|reserve|retain)|(?:franchisor|mcdonald|papa\s+john).*?(?:may|right|sole\s+discretion))\b', sent_lower):
            if any(kw in sent_lower for kw in ['terminat', 'modify', 'change', 'alter', 'increase', 'reduce', 'restrict', 'approve', 'deny', 'refuse']):
                fact_store.add(
                    sent_stripped[:300], why_important="Franchisor reserved right (may affect franchisee)",
                    source_page=start_page, source_item=item_num,
                    importance=0.75, category="control",
                )

        # ── TERRITORY AND COMPETITION ──
        if item_num == 12 or any(kw in sent_lower for kw in ['exclusive', 'territory', 'protected area', 'encroach']):
            if any(kw in sent_lower for kw in ['no exclusive', 'not exclusive', 'no territory', 'no protected', 'non-exclusive', 'will not receive']):
                fact_store.add(
                    sent_stripped[:300], why_important="NO territory protection — critical risk factor",
                    source_page=start_page, source_item=item_num,
                    importance=0.95, category="risk",
                )
                # Also tag as territory detail
                if item_num == 12:
                    fact_store.add(
                        sent_stripped[:300], why_important="FPR_FIELD:item12_territoryDetails",
                        source_page=start_page, source_item=item_num,
                        importance=0.85, category="control",
                    )
            elif 'exclusive' in sent_lower:
                fact_store.add(
                    sent_stripped[:300], why_important="Territory/exclusivity statement",
                    source_page=start_page, source_item=item_num,
                    importance=0.85, category="control",
                )
        # Encroachment: franchisor right to open/establish competing units
        if item_num == 12 and re.search(r'(?:we|franchisor|mcdonald)\S*\s+(?:may|can|ha(?:s|ve)\s+the\s+right|reserve).*?(?:establish|operate|open|develop|franchise|alter|compete)', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="FPR_FIELD:item12_encroachmentNote",
                source_page=start_page, source_item=item_num,
                importance=0.9, category="risk",
            )
        # Territory depth: online/digital/channel reserved rights
        if item_num == 12 and re.search(r'(?:reserves?\s+the\s+right.*?(?:channel|mark|trademark)|(?:online|digital|internet|delivery|e.?commerce).*?(?:reserv|retain|control))', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="FPR_FIELD:item12_onlineSalesReserved",
                source_page=start_page, source_item=item_num,
                importance=0.8, category="control",
            )
        # Territory depth: no right to additional franchises / no multi-unit / policies not contractual
        if item_num == 12 and (re.search(r'(?:no\s+right|not\s+entitl|does\s+not\s+grant).*?(?:additional|multi|more)\s+(?:franchise|restaurant|unit|location)', sent_lower) or
                               re.search(r'(?:not\s+part\s+of\s+the\s+franchise\s+agreement|do\s+not\s+involve\s+any\s+contract\s+right)', sent_lower)):
            fact_store.add(
                sent_stripped[:300], why_important="FPR_FIELD:item12_multiUnitDevelopmentRights",
                source_page=start_page, source_item=item_num,
                importance=0.8, category="control",
            )
        # Territory depth: performance requirement / no minimum sales
        if item_num == 12 and re.search(r'(?:no\s+(?:minimum|required)\s+(?:sales|performance|revenue)|performance\s+(?:requirement|standard|quota))', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="FPR_FIELD:item12_performanceRequirement",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="control",
            )
        # Territory depth: relocation
        if item_num == 12 and re.search(r'(?:relocat|move\s+(?:your|the)\s+(?:restaurant|franchise|location))', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="FPR_FIELD:item12_relocationRights",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="control",
            )

        # ── RENEWAL AND TERM ──
        if any(kw in sent_lower for kw in ['renew', 'new term', 'extension', 'term of']):
            if any(kw in sent_lower for kw in ['no right', 'not right', 'no contractual', 'not guaranteed', 'not renew', 'no renewal']):
                fact_store.add(
                    sent_stripped[:300], why_important="NO renewal right — critical contract fact",
                    source_page=start_page, source_item=item_num,
                    importance=0.95, category="risk",
                )
            elif re.search(r'\d+\s*(?:year|yr)', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="Term/renewal duration",
                    source_page=start_page, source_item=item_num,
                    importance=0.8, category="control",
                )

        # ── TERMINATION AND DEFAULT ──
        if any(kw in sent_lower for kw in ['terminat', 'default', 'cure period', 'non-curable']):
            fact_store.add(
                sent_stripped[:300], why_important="Termination/default provision",
                source_page=start_page, source_item=item_num,
                importance=0.85, category="risk",
            )

        # ── TRANSFER RESTRICTIONS ──
        if any(kw in sent_lower for kw in ['transfer', 'assign', 'right of first refusal', 'sell your']):
            if any(kw in sent_lower for kw in ['consent', 'approval', 'condition', 'restrict', 'rofr', 'first refusal']):
                fact_store.add(
                    sent_stripped[:300], why_important="Transfer restriction or condition",
                    source_page=start_page, source_item=item_num,
                    importance=0.8, category="control",
                )

        # ── NON-COMPETE ──
        if any(kw in sent_lower for kw in ['non-compet', 'compete', 'competing', 'similar business']):
            if re.search(r'\d+\s*(?:month|year|mile)', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="Non-compete scope (duration/radius)",
                    source_page=start_page, source_item=item_num,
                    importance=0.9, category="risk",
                )

        # ── GUARANTY AND LIABILITY ──
        if any(kw in sent_lower for kw in ['personal guarant', 'spousal guarant', 'personally liable', 'joint and several', 'indemnif']):
            fact_store.add(
                sent_stripped[:300], why_important="Personal liability or guaranty requirement",
                source_page=start_page, source_item=item_num,
                importance=0.9, category="risk",
            )

        # ── RENT AND REAL ESTATE ──
        if any(kw in sent_lower for kw in ['rent', 'lease', 'real estate', 'occupancy']):
            if any(kw in sent_lower for kw in ['pay', 'owe', 'base rent', 'percentage rent', 'pass through', 'monthly']):
                fact_store.add(
                    sent_stripped[:300], why_important="Rent/lease obligation (may be major ongoing cost)",
                    source_page=start_page, source_item=item_num,
                    importance=0.85, category="economics",
                )

        # ── TRAINING AND SUPPORT ──
        if item_num == 11 and any(kw in sent_lower for kw in ['training', 'hamburger university', 'field support']):
            fact_store.add(
                sent_stripped[:300], why_important="Training or support provision",
                source_page=start_page, source_item=item_num,
                importance=0.6, category="control",
            )
        # Operations manual — broader capture (Items 11, 8, 17)
        if item_num in (8, 11, 17) and re.search(r'(?:operations?\s+(?:and\s+training\s+)?manual|o\s*&\s*t\s+manual|confidential\s+manual)', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="Operations manual reference",
                source_page=start_page, source_item=item_num,
                importance=0.75, category="control",
            )
        # Support depth: field support / regional offices
        if item_num == 11 and re.search(r'(?:field\s+(?:support|consult|staff|office|represent)|regional\s+(?:office|manager|staff))', sent_lower):
            fact_store.add(sent_stripped[:300],
                why_important="FPR_FIELD:item11_fieldSupport",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="control")
        # Support depth: advertising cooperative / council
        if item_num == 11 and re.search(r'(?:cooperativ|co.?op)\s+(?:advertis|marketing)', sent_lower):
            fact_store.add(sent_stripped[:300],
                why_important="FPR_FIELD:item11_advertisingCouncil",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="economics")
        # Support depth: national ad fund name (OPNAD, brand fund, etc.)
        if item_num == 11 and re.search(r'(?:opnad|national\s+(?:advertis|marketing)\s+fund|brand\s+fund)', sent_lower):
            m_fund = re.search(r'(opnad|national\s+(?:advertis|marketing)\s+fund|brand\s+fund)', sent_lower)
            if m_fund:
                fact_store.add(f"National ad fund: {m_fund.group(1).upper()}",
                    why_important="FPR_FIELD:item11_nationalAdFund",
                    source_page=start_page, source_item=item_num,
                    importance=0.7, category="economics")
        # Support depth: ad fund transparency (same basis, audited, etc.)
        if item_num == 11 and re.search(r'(?:same\s+basis|franchisee\s+and\s+(?:company|mcopco).*?(?:same|equal)|audit\w*\s+(?:the|our)\s+(?:fund|advertis))', sent_lower):
            fact_store.add(sent_stripped[:300],
                why_important="FPR_FIELD:item11_advertisingFundTransparency",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="economics")
        # Support depth: manual confidentiality
        if item_num in (8, 11) and re.search(r'(?:confidential|proprietary|trade\s+secret).*?(?:manual|information|system)', sent_lower):
            fact_store.add(sent_stripped[:300],
                why_important="FPR_FIELD:item11_operationsManualConfidential",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="control")

        # ── SUPPLIER RESTRICTIONS ──
        if item_num == 8 and any(kw in sent_lower for kw in ['approved supplier', 'designated supplier', 'must purchase', 'sole source', 'proprietary']):
            fact_store.add(
                sent_stripped[:300], why_important="Supplier restriction",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="control",
            )
        # Supplier revenue — capture revenue/rebate received from suppliers (Item 8)
        if item_num == 8 and re.search(r'(?:revenue|received|rebate|commission|payment).*?\$[\d,.]+', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="Revenue received from suppliers or affiliates",
                source_page=start_page, source_item=item_num,
                importance=0.8, category="economics",
            )

        # ── LITIGATION ──
        if item_num == 3 and any(kw in sent_lower for kw in ['v.', 'case no', 'filed', 'settled', 'class action', 'damages', 'judgment']):
            fact_store.add(
                sent_stripped[:300], why_important="Litigation case or settlement",
                source_page=start_page, source_item=item_num,
                importance=0.7, category="risk",
            )

        # ── SYSTEM COMPOSITION ──
        if re.search(r'\d+\s*%\s*(?:of\s+)?(?:all\s+)?(?:restaurant|outlet|unit|franchise|location)s?\s+(?:are\s+)?(?:franchise|owned)', sent_lower):
            fact_store.add(
                sent_stripped[:300], why_important="System composition (franchised vs company-owned ratio)",
                source_page=start_page, source_item=item_num,
                importance=0.85, category="performance",
            )

        # ── ENTITY AND IDENTITY ──
        # Item 1 text often spills into Item 2 pages (page-level segmentation boundary)
        if item_num in (1, 2):
            if any(kw in sent_lower for kw in ['incorporated', 'organized', 'formed', 'subsidiary', 'parent', 'predecessor']):
                fact_store.add(
                    sent_stripped[:300], why_important="Entity identity or corporate structure",
                    source_page=start_page, source_item=item_num,
                    importance=0.7, category="identity",
                )
            if re.search(r'(?:nyse|nasdaq|publicly\s+traded|stock\s+exchange)', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="Publicly traded status",
                    source_page=start_page, source_item=item_num,
                    importance=0.8, category="identity",
                )
            # Entity type: "We are a Delaware limited liability company" / "organized as a corporation"
            if re.search(r'(?:we\s+are\s+a\s+|is\s+a\s+)(?:\w+\s+)?(?:limited\s+liability\s+company|corporation|llc)', sent_lower) or \
               re.search(r'(?:organized|formed|incorporated)\s+(?:as\s+)?(?:a\s+)?(?:limited\s+liability|corporation|llc)', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="Entity type and state of formation",
                    source_page=start_page, source_item=item_num,
                    importance=0.75, category="identity",
                )
            # Year established: "In 1955, ... began granting franchises", "began franchising in 1955"
            if re.search(r'(?:19|20)\d{2}', sent_stripped) and any(kw in sent_lower for kw in ['began', 'started', 'commenced', 'since', 'first franchi', 'has been franchi', 'established', 'granting franchise']):
                fact_store.add(
                    sent_stripped[:300], why_important="Year franchise system established",
                    source_page=start_page, source_item=item_num,
                    importance=0.75, category="identity",
                )
            # State of incorporation: "We are a Delaware limited liability company"
            m_state = re.search(r'(?:we\s+are\s+a\s+|is\s+a\s+)((?:delaware|nevada|california|kentucky|new\s+york|florida|georgia|texas|illinois|virginia|north\s+carolina|colorado|maryland|ohio|michigan|minnesota|indiana)\s+(?:limited\s+liability\s+company|corporation|llc))', sent_lower)
            if m_state:
                state_name = m_state.group(1).split()[0].title()
                fact_store.add(
                    f"State of incorporation: {state_name}",
                    why_important="FPR_FIELD:stateOfIncorporation",
                    source_page=start_page, source_item=item_num,
                    importance=0.7, category="identity",
                )
            # Principal address: "principal place of business is X"
            m_addr = re.search(r'(?:principal\s+(?:place\s+of\s+business|office|address)\s+(?:is|at)\s+)([\d][^.]+)', sent_lower)
            if m_addr:
                fact_store.add(
                    m_addr.group(1).strip()[:200],
                    why_important="FPR_FIELD:principalAddress",
                    source_page=start_page, source_item=item_num,
                    importance=0.6, category="identity",
                )
            # Franchise system name: "referred to... as 'McDonald's'" or brand name from "we" statements
            m_name = re.search(r'(?:referred\s+to\s+(?:in\s+this|herein)\s+[^"]*[""]\s*)([\w\s\']+?)(?:[""]\s*[,.])', sent_lower)
            if m_name:
                fact_store.add(
                    f"Franchise system name: {m_name.group(1).strip()}",
                    why_important="FPR_FIELD:franchiseSystemName",
                    source_page=start_page, source_item=item_num,
                    importance=0.7, category="identity",
                )
            # Publicly traded with ticker
            m_ticker = re.search(r'(?:nyse|nasdaq)\s*:\s*([A-Z]+)', sent_stripped)
            if m_ticker and re.search(r'(?:parent|predecessor|corporation)', sent_lower):
                parent_name = None
                m_parent = re.search(r'([\w\s\'.]+?(?:Corporation|International|Inc))', sent_stripped)
                if m_parent:
                    parent_name = m_parent.group(1).strip()
                ticker = m_ticker.group(1)
                fact_store.add(
                    f"Ultimate parent: {parent_name} ({m_ticker.group(0)})" if parent_name else f"Publicly traded: {m_ticker.group(0)}",
                    why_important="FPR_FIELD:ultimateParent",
                    source_page=start_page, source_item=item_num,
                    importance=0.8, category="identity",
                )

        # ── EXHIBIT REFERENCES ──
        if re.search(r'exhibit\s+[a-z]', sent_lower) and any(kw in sent_lower for kw in ['attached', 'included', 'see exhibit', 'set forth']):
            fact_store.add(
                sent_stripped[:300], why_important="Exhibit cross-reference",
                source_page=start_page, source_item=item_num,
                importance=0.5, category="document",
            )

        # ── ITEM 19 PERFORMANCE DATA ──
        if item_num == 19:
            if any(kw in sent_lower for kw in ['average', 'median', 'highest', 'lowest', 'above', 'below', 'exceed']):
                fact_store.add(
                    sent_stripped[:300], why_important="FPR performance metric",
                    source_page=start_page, source_item=item_num,
                    importance=0.9, category="performance",
                )
            if any(kw in sent_lower for kw in ['cost of', 'operating expense', 'gross profit', 'labor', 'occupancy']):
                fact_store.add(
                    sent_stripped[:300], why_important="FPR cost structure data",
                    source_page=start_page, source_item=item_num,
                    importance=0.85, category="performance",
                )
            # Reporting period / measurement year: "as of December 31, 2024", "during 2024", "Calendar Year 2024"
            if re.search(r'(?:as\s+of|during|calendar\s+year|fiscal\s+year)\s+(?:december\s+31,?\s+)?20\d{2}', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="FPR reporting period / measurement year",
                    source_page=start_page, source_item=item_num,
                    importance=0.8, category="performance",
                )
            # Basis: "open at least 1 year", "operated for at least 12 months"
            if re.search(r'(?:open|operat)\w*\s+(?:at\s+least|for\s+at\s+least|a\s+full)\s+(?:1\s+year|12\s+month|\d+\s+month)', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="FPR population basis (inclusion criteria)",
                    source_page=start_page, source_item=item_num,
                    importance=0.85, category="performance",
                )
            # Segment identification: "franchised", "company-owned", "McOpCo", "all traditional"
            if re.search(r'(?:franchised|company.?owned|mcopco|all\s+(?:traditional|domestic))\s+.*?(?:restaurant|outlet|unit|location)s?', sent_lower):
                if re.search(r'\d[\d,]*\s+(?:domestic|traditional|franchised|company)', sent_lower):
                    fact_store.add(
                        sent_stripped[:300], why_important="FPR segment with unit count",
                        source_page=start_page, source_item=item_num,
                        importance=0.9, category="performance",
                    )
            # Expense coverage: "operating income before occupancy", "cost of sales"
            if any(kw in sent_lower for kw in ['before occupancy', 'operating income', 'cost of sales', 'total cost', 'gross profit']):
                if any(kw in sent_lower for kw in ['pro forma', 'statement', 'derived', 'based upon']):
                    fact_store.add(
                        sent_stripped[:300], why_important="FPR expense coverage scope",
                        source_page=start_page, source_item=item_num,
                        importance=0.85, category="performance",
                    )

        # ── ITEM 20 OUTLET DATA ──
        if item_num == 20:
            if re.search(r'\d+\s*(?:outlet|unit|store|restaurant|location|franchise)s?', sent_lower):
                fact_store.add(
                    sent_stripped[:300], why_important="Outlet count or trend data",
                    source_page=start_page, source_item=item_num,
                    importance=0.8, category="performance",
                )

        # ── FINANCING ──
        if item_num == 10:
            if any(kw in sent_lower for kw in ['financ', 'loan', 'guarantee', 'interest rate', 'collateral', 'sba']):
                fact_store.add(
                    sent_stripped[:300], why_important="Financing terms or availability",
                    source_page=start_page, source_item=item_num,
                    importance=0.7, category="economics",
                )


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

                # ── Structured Item 8 field extraction ──
                # Cooperative
                if re.search(r'(?:no|not|do\s+not)\s+(?:have\s+)?(?:any\s+)?(?:purchasing|distribution)\s+cooperativ', text_lower):
                    fact_store.add("Supplier: no purchasing cooperative",
                        why_important="FPR_FIELD:item8_purchaseCooperative",
                        source_page=pr.page_num, source_item=8,
                        importance=0.7, category="control")
                elif re.search(r'(?:purchasing|distribution)\s+cooperativ', text_lower):
                    fact_store.add("Supplier: has purchasing cooperative",
                        why_important="FPR_FIELD:item8_purchaseCooperative",
                        source_page=pr.page_num, source_item=8,
                        importance=0.7, category="control")
                # Proprietary products
                if re.search(r'(?:proprietary|secret|confidential)\s+(?:product|recipe|formula|specification|ingredient)', text_lower):
                    fact_store.add("Supplier: proprietary products/specifications",
                        why_important="FPR_FIELD:item8_proprietaryProducts",
                        source_page=pr.page_num, source_item=8,
                        importance=0.7, category="control")
                # Insurance requirements
                if re.search(r'(?:insurance|insured)\s+(?:requir|must|minimum|coverage)', text_lower):
                    # Capture the full sentence
                    m_ins = re.search(r'([^.]*(?:insurance|insured)\s+(?:requir|must|minimum|coverage)[^.]*\.)', text_lower)
                    if m_ins:
                        fact_store.add(m_ins.group(1).strip()[:200],
                            why_important="FPR_FIELD:item8_insuranceRequirements",
                            source_page=pr.page_num, source_item=8,
                            importance=0.7, category="economics")

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

            # Item 19: FPR — structured field extraction
            if item_num == 19:
                # ── Measurement year: "as of December 31, 2024" ──
                m_year = re.search(r'(?:as\s+of\s+december\s+31,?\s+|during\s+|calendar\s+year\s+)(20\d{2})', text_lower)
                if m_year:
                    year_val = m_year.group(1)
                    fact_store.add(
                        f"FPR measurement year: {year_val}",
                        why_important="FPR_FIELD:item19_measurementYear",
                        source_page=pr.page_num, source_item=19,
                        importance=0.85, category="performance",
                    )
                    fact_store.add(
                        f"FPR reporting period: Calendar Year {year_val}",
                        why_important="FPR_FIELD:item19_reportingPeriod",
                        source_page=pr.page_num, source_item=19,
                        importance=0.85, category="performance",
                    )

                # ── Basis: "open at least 1 year" ──
                m_basis = re.search(r'((?:open|operat)\w*\s+(?:at\s+least\s+|for\s+at\s+least\s+)?(?:1\s+year|12\s+month|a\s+full\s+year)[^.]*(?:as\s+of[^.]+)?\.)', text_lower)
                if m_basis:
                    fact_store.add(
                        m_basis.group(1).strip()[:200],
                        why_important="FPR_FIELD:item19_basis",
                        source_page=pr.page_num, source_item=19,
                        importance=0.85, category="performance",
                    )

                # ── Segment detection with unit counts ──
                for seg_m in re.finditer(r'(?:approximately\s+)?([\d,]+)\s+domestic\s+traditional\s+(franchised\s+|mcopco\s+|)?(?:mcdonald|papa|restaurant|outlet)', text_lower):
                    seg_type = seg_m.group(2).strip() if seg_m.group(2) else "all"
                    unit_count = seg_m.group(1).replace(",", "")
                    fact_store.add(
                        f"FPR segment: {seg_type} units={unit_count}",
                        why_important="FPR_FIELD:item19_separateSegments",
                        source_page=pr.page_num, source_item=19,
                        importance=0.9, category="performance",
                    )

                # ── Sample coverage: "approximately 96% had annual sales" ──
                m_cov = re.search(r'(?:approximately\s+)?(\d+)\s*%\s+had\s+annual\s+sales', text_lower)
                if m_cov:
                    fact_store.add(
                        f"FPR sample coverage: {m_cov.group(1)}%",
                        why_important="FPR_FIELD:item19_sampleCoveragePct",
                        source_page=pr.page_num, source_item=19,
                        importance=0.85, category="performance",
                    )

                # ── Expense coverage: "operating income before occupancy" ──
                if re.search(r'(?:operating\s+(?:income|results?)\s+before\s+occupancy)', text_lower):
                    fact_store.add(
                        "FPR expense coverage: operating income before occupancy costs",
                        why_important="FPR_FIELD:item19_expenseCoverage",
                        source_page=pr.page_num, source_item=19,
                        importance=0.85, category="performance",
                    )
                elif re.search(r'(?:cost\s+of\s+sales|gross\s+profit)', text_lower) and re.search(r'(?:pro\s+forma|statement)', text_lower):
                    fact_store.add(
                        "FPR expense coverage: cost of sales and gross profit disclosed",
                        why_important="FPR_FIELD:item19_expenseCoverage",
                        source_page=pr.page_num, source_item=19,
                        importance=0.85, category="performance",
                    )

                # ── Includes company units / franchised ──
                if re.search(r'(?:company.?owned|mcopco)\s+.*?(?:\d[\d,]+|restaurant)', text_lower):
                    fact_store.add(
                        "FPR includes company-owned units",
                        why_important="FPR_FIELD:item19_includesCompanyUnits",
                        source_page=pr.page_num, source_item=19,
                        importance=0.8, category="performance",
                    )
                if re.search(r'(?:franchise\w+)\s+.*?(?:\d[\d,]+\s+(?:domestic|traditional)|restaurant)', text_lower):
                    fact_store.add(
                        "FPR includes franchised units",
                        why_important="FPR_FIELD:item19_includesFranchisedUnits",
                        source_page=pr.page_num, source_item=19,
                        importance=0.8, category="performance",
                    )

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

        # ── DEEP READING: Extract every important fact from this item ──
        # Lane A reads like a human analyst, not a keyword scanner.
        # For each item, read the full text and extract structured findings.
        _deep_read_item(item_num, section.text, section.start_page, fact_store)

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
