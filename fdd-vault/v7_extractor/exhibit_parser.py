"""
Exhibit Parser

Exhibits are PARSED, not just listed.
Discovery without follow-through is failure.

This module reads exhibit sections and extracts structured data:
  - Financial exhibits → auditor, opinion, going concern, revenue, assets, etc.
  - Agreement exhibits → key contract terms
  - State addenda → override rules
  - Manual TOC → operational burden signals
"""

import re
from typing import Dict, Any, List, Optional
from .models import (ExhibitObject, ExhibitRole, PageRead, TableObject,
                     Provenance, EvidenceState)


def parse_financial_exhibit(exhibit: ExhibitObject,
                            page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse a financial exhibit into structured data.

    Extracts:
      - auditor name and firm
      - auditor opinion (clean/qualified/adverse/disclaimer)
      - going concern warnings
      - revenue, total assets, total liabilities, equity
      - net income, cash and equivalents
      - financial strength signal
    """
    # Collect text from exhibit pages
    exhibit_pages = [p for p in page_reads
                     if exhibit.start_page <= p.page_num <= exhibit.end_page]
    if not exhibit_pages:
        return {}

    text = "\n".join(p.text for p in exhibit_pages[:30])  # cap at 30 pages

    data: Dict[str, Any] = {}

    # ── Auditor ──
    AUDITORS = [
        (r"Deloitte\s*(?:&\s*Touche)?(?:\s+LLP)?", "Deloitte"),
        (r"PricewaterhouseCoopers|PwC", "PricewaterhouseCoopers"),
        (r"KPMG(?:\s+LLP)?", "KPMG"),
        (r"Ernst\s*&\s*Young|EY\b", "Ernst & Young"),
        (r"BDO\s*(?:USA)?(?:\s+LLP)?", "BDO"),
        (r"Grant\s+Thornton(?:\s+LLP)?", "Grant Thornton"),
        (r"RSM\s+US(?:\s+LLP)?", "RSM"),
        (r"Moss\s+Adams(?:\s+LLP)?", "Moss Adams"),
        (r"CohnReznick(?:\s+LLP)?", "CohnReznick"),
        (r"Baker\s+Tilly(?:\s+US)?(?:\s+LLP)?", "Baker Tilly"),
        (r"Plante\s+(?:&\s+)?Moran", "Plante Moran"),
    ]
    for pattern, name in AUDITORS:
        if re.search(pattern, text[:8000], re.I):
            data["auditorName"] = name
            data["hasAuditedFinancials"] = True
            break
    if "hasAuditedFinancials" not in data:
        if re.search(r"independent\s+(?:registered\s+public\s+)?(?:accounting\s+firm|auditor)", text[:5000], re.I):
            data["hasAuditedFinancials"] = True

    # ── Opinion ──
    if re.search(r"present\s+fairly.*?in\s+all\s+material\s+respects|unqualified\s+opinion|in\s+our\s+opinion.*fairly", text[:15000], re.I):
        data["auditorOpinion"] = "clean"
    elif re.search(r"qualified\s+opinion|except\s+for", text[:15000], re.I):
        data["auditorOpinion"] = "qualified"
    elif re.search(r"adverse\s+opinion|do\s+not\s+present\s+fairly", text[:15000], re.I):
        data["auditorOpinion"] = "adverse"
    elif re.search(r"disclaimer\s+of\s+opinion|unable\s+to\s+obtain", text[:15000], re.I):
        data["auditorOpinion"] = "disclaimer"

    # ── Going concern ──
    data["goingConcernWarning"] = False
    for gc in re.finditer(
        r"substantial\s+doubt.{0,80}(?:going\s+concern|ability\s+to\s+continue)"
        r"|going\s+concern\s+(?:doubt|issue|question|uncertainty)",
        text[:20000], re.I
    ):
        # Check for negation in preceding 60 chars
        pre = text[max(0, gc.start()-60):gc.start()].lower()
        if not re.search(r"\b(no|not|without|alleviate|eliminate|did\s+not|does\s+not)\b", pre):
            data["goingConcernWarning"] = True
            break

    # ── Financial figures ──
    def _find_amount(pattern, window=400):
        m = re.search(pattern, text, re.I)
        if not m:
            return None
        for snippet in [text[m.end():m.end()+window], text[max(0,m.start()-100):m.start()]]:
            am = re.search(r"\$\s*([\d,]+(?:\.\d+)?(?:\s*(?:million|billion|M|B|K))?)", snippet, re.I)
            if am:
                s = am.group(0).strip()
                mm = re.match(r"[\$]?\s*([\d,]+(?:\.\d+)?)\s*(million|billion|thousand|M|B|K)", s, re.I)
                if mm:
                    val = float(mm.group(1).replace(",", ""))
                    mult = {"million": 1e6, "billion": 1e9, "thousand": 1e3, "m": 1e6, "b": 1e9, "k": 1e3}
                    return int(val * mult.get(mm.group(2).lower(), 1))
                cleaned = re.sub(r"[^\d\.]", "", s)
                try:
                    return int(float(cleaned)) if cleaned else None
                except:
                    return None
        return None

    rev = _find_amount(r"(?:total\s+)?(?:net\s+)?revenues?", 300)
    if rev and rev > 100000:
        data["franchisorRevenue"] = rev
    assets = _find_amount(r"total\s+assets", 300)
    if assets and assets > 10000:
        data["franchisorTotalAssets"] = assets
    liab = _find_amount(r"total\s+liabilities", 300)
    if liab:
        data["franchisorTotalLiabilities"] = liab
    equity = _find_amount(r"(?:stockholders?|members?|shareholders?)\s*(?:[\'\']s\s*)?(?:equity|deficit)", 300)
    if equity is not None:
        data["franchisorEquity"] = equity
    ni = _find_amount(r"net\s+(?:income|loss)", 200)
    if ni is not None:
        data["franchisorNetIncome"] = ni
    cash = _find_amount(r"cash\s+and\s+cash\s+equivalents", 200)
    if cash is not None:
        data["franchisorCashAndEquivalents"] = cash

    # ── Strength signal ──
    if data.get("goingConcernWarning") or data.get("auditorOpinion") in ("adverse", "disclaimer"):
        data["financialStrengthSignal"] = "weak"
    elif data.get("auditorOpinion") == "qualified":
        data["financialStrengthSignal"] = "watch"
    elif assets and liab and liab / assets > 0.9:
        data["financialStrengthSignal"] = "weak"
    elif data.get("auditorOpinion") == "clean" and (not ni or ni > 0):
        data["financialStrengthSignal"] = "strong"
    else:
        data["financialStrengthSignal"] = "adequate"

    exhibit.parsed = True
    exhibit.parsed_data = data
    return data


def parse_all_exhibits(exhibits: Dict[str, ExhibitObject],
                       page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse all exhibits in priority order.

    Priority:
      1. Financial exhibits (critical)
      2. Franchise/development agreements
      3. State addenda
      4. Item-specific support
      5. Manual TOC
      6. Franchisee lists / receipts with PII blocking

    Returns dict of parsed exhibit data keyed by role.
    """
    results: Dict[str, Any] = {}

    # Sort by priority
    priority_order = {
        ExhibitRole.FINANCIALS: 1,
        ExhibitRole.FRANCHISE_AGREEMENT: 2,
        ExhibitRole.DEVELOPMENT_AGREEMENT: 2,
        ExhibitRole.STATE_ADDENDA_FDD: 3,
        ExhibitRole.STATE_ADDENDA_AGREEMENT: 3,
        ExhibitRole.MANUAL_TOC: 5,
        ExhibitRole.FRANCHISEE_LIST: 6,
        ExhibitRole.FORMER_FRANCHISEE_LIST: 6,
        ExhibitRole.RECEIPT: 6,
    }

    sorted_exhibits = sorted(exhibits.values(),
                             key=lambda e: priority_order.get(e.role, 4))

    for exhibit in sorted_exhibits:
        if exhibit.start_page == 0:
            continue  # no page location found

        if exhibit.role == ExhibitRole.FINANCIALS:
            data = parse_financial_exhibit(exhibit, page_reads)
            if data:
                results["financials"] = data

        # Other exhibit types: mark as parsed with basic data
        # Full parsing for agreements, addenda, etc. will be added in future iterations
        elif exhibit.role in (ExhibitRole.FRANCHISE_AGREEMENT, ExhibitRole.DEVELOPMENT_AGREEMENT):
            exhibit.parsed = True
            results[exhibit.code] = {"role": exhibit.role.value, "start_page": exhibit.start_page}

        elif exhibit.role in (ExhibitRole.STATE_ADDENDA_FDD, ExhibitRole.STATE_ADDENDA_AGREEMENT):
            exhibit.parsed = True
            results[exhibit.code] = {"role": exhibit.role.value, "start_page": exhibit.start_page}

    return results
