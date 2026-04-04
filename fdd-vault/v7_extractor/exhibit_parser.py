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
        (r"Marcum(?:\s+LLP)?", "Marcum"),
        (r"Wipfli(?:\s+LLP)?", "Wipfli"),
        (r"Eide\s+Bailly(?:\s+LLP)?", "Eide Bailly"),
        (r"Armanino(?:\s+LLP)?", "Armanino"),
        (r"Forvis\s+Mazars|FORVIS|Dixon\s+Hughes\s+Goodman", "Forvis Mazars"),
        (r"Carr\s+Riggs\s+(?:&\s+)?Ingram|CRI\b", "Carr Riggs & Ingram"),
        (r"Citrin\s+Cooperman", "Citrin Cooperman"),
        (r"Weaver(?:\s+and\s+Tidwell)?(?:\s+LLP)?", "Weaver"),
        (r"Withum(?:\s+Smith\s+(?:&\s+)?Brown)?", "Withum"),
        (r"Cherry\s+Bekaert(?:\s+LLP)?", "Cherry Bekaert"),
    ]
    for pattern, name in AUDITORS:
        if re.search(pattern, text[:12000], re.I):
            data["auditorName"] = name
            data["hasAuditedFinancials"] = True
            break
    if "hasAuditedFinancials" not in data:
        if re.search(r"independent\s+(?:registered\s+public\s+)?(?:accounting\s+firm|auditor|accountant)", text[:8000], re.I):
            data["hasAuditedFinancials"] = True
        elif re.search(r"(?:balance\s+sheet|statements?\s+of\s+(?:financial\s+position|operations|income))", text[:8000], re.I):
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


def parse_agreement_exhibit(exhibit: ExhibitObject,
                            page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse an agreement exhibit — extract key clauses.

    Handles: franchise agreement, development agreement, lease rider,
    supplier agreement, advertising agreement, equipment lease, ACH, financing.
    """
    pages = [p for p in page_reads
             if exhibit.start_page <= p.page_num <= exhibit.end_page]
    if not pages:
        return {"role": exhibit.role.value, "start_page": exhibit.start_page, "consumed": True}

    text = "\n".join(p.text for p in pages[:40])
    text_lower = text.lower()
    data: Dict[str, Any] = {
        "role": exhibit.role.value,
        "start_page": exhibit.start_page,
        "end_page": exhibit.end_page,
        "page_count": len(pages),
        "consumed": True,
        "clauses_found": [],
    }

    # Extract key clause domains
    CLAUSE_PATTERNS = [
        (r"term\s+(?:of\s+)?(?:this\s+)?agreement.*?(\d+)\s*(?:year|yr)", "term", "economics"),
        (r"(?:right\s+of\s+first\s+refusal|first\s+refusal)", "right_of_first_refusal", "control"),
        (r"(?:non[- ]?compete|covenant\s+not\s+to\s+compete)", "non_compete", "risk"),
        (r"(?:personal|individual)\s+guarant", "personal_guaranty", "risk"),
        (r"spousal\s+guarant", "spousal_guaranty", "risk"),
        (r"(?:cross[- ]?default)", "cross_default", "risk"),
        (r"(?:liquidated|stipulated)\s+damage", "liquidated_damages", "risk"),
        (r"(?:mandatory|binding)\s+(?:arbitration|mediation)", "mandatory_arbitration", "control"),
        (r"(?:exclusive|protected)\s+territory", "exclusive_territory", "control"),
        (r"(?:transfer|assignment).*?(?:approval|consent)", "transfer_restrictions", "control"),
        (r"(?:renewal|extension)\s+(?:of|for)\s+(?:this\s+)?(?:agreement|term)", "renewal_terms", "economics"),
        (r"(?:terminat(?:ion|e)).*?(?:cause|default|breach)", "termination_for_cause", "risk"),
        (r"(?:terminat(?:ion|e)).*?without\s+cause", "termination_without_cause", "risk"),
        (r"(?:remodel|renovation|upgrade)\s+(?:requirement|obligation)", "remodel_obligation", "economics"),
        (r"(?:minimum\s+(?:sales|revenue|performance))", "minimum_performance", "risk"),
        (r"(?:indemnif(?:y|ication))", "indemnification", "risk"),
        (r"(?:insurance\s+(?:requirement|coverage|policy))", "insurance_requirements", "economics"),
        (r"(?:venue|jurisdiction|governing\s+law)", "venue_jurisdiction", "control"),
    ]

    for pattern, clause_name, category in CLAUSE_PATTERNS:
        if re.search(pattern, text_lower):
            data["clauses_found"].append({
                "clause": clause_name,
                "category": category,
            })

    return data


def parse_guaranty_exhibit(exhibit: ExhibitObject,
                           page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse a guaranty exhibit — extract guaranty scope and terms."""
    pages = [p for p in page_reads
             if exhibit.start_page <= p.page_num <= exhibit.end_page]
    text = "\n".join(p.text for p in pages[:10])
    text_lower = text.lower()

    data: Dict[str, Any] = {
        "role": exhibit.role.value,
        "start_page": exhibit.start_page,
        "consumed": True,
        "guaranty_type": "personal",
        "spousal_included": "spousal" in text_lower or "spouse" in text_lower,
        "scope": "all_obligations" if "all obligations" in text_lower else "partial",
    }
    return data


def parse_manual_toc_exhibit(exhibit: ExhibitObject,
                             page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse a manual TOC exhibit — count sections and extract topics."""
    pages = [p for p in page_reads
             if exhibit.start_page <= p.page_num <= exhibit.end_page]
    text = "\n".join(p.text for p in pages[:10])

    sections = re.findall(r'(?:^|\n)\s*(?:Section|Chapter|Part)\s+\d+', text, re.I)
    topics = re.findall(r'(?:^|\n)\s*(?:\d+\.?\s+)?([A-Z][a-z]+(?:\s+[A-Za-z]+){1,5})', text)

    return {
        "role": "manual_toc",
        "start_page": exhibit.start_page,
        "consumed": True,
        "page_count": len(pages),
        "section_count": len(sections),
        "topic_sample": [t.strip() for t in topics[:20]],
    }


def parse_list_exhibit(exhibit: ExhibitObject,
                       page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse a franchisee/developer list exhibit.

    Note: PII content (names, addresses, phones) is tracked but not exported.
    """
    pages = [p for p in page_reads
             if exhibit.start_page <= p.page_num <= exhibit.end_page]
    text = "\n".join(p.text for p in pages)

    # Count entries by looking for state names or city/state patterns
    state_pattern = re.compile(r'\b([A-Z]{2})\s+\d{5}\b')  # state + zip
    state_matches = state_pattern.findall(text)

    return {
        "role": exhibit.role.value,
        "start_page": exhibit.start_page,
        "consumed": True,
        "page_count": len(pages),
        "pii_blocked": True,
        "estimated_entries": len(state_matches) if state_matches else None,
        "states_represented": sorted(set(state_matches)) if state_matches else [],
    }


def parse_unknown_exhibit(exhibit: ExhibitObject,
                          page_reads: List[PageRead]) -> Dict[str, Any]:
    """Parse an unknown/other exhibit — basic content analysis.

    No exhibit type should be silently skipped. This catch-all
    extracts enough to understand what the exhibit contains.
    """
    pages = [p for p in page_reads
             if exhibit.start_page <= p.page_num <= exhibit.end_page]
    if not pages:
        return {"role": "other", "start_page": exhibit.start_page, "consumed": True}

    text = "\n".join(p.text for p in pages[:5])
    text_lower = text.lower()

    # Detect content type from first few pages
    content_signals = []
    if any(kw in text_lower for kw in ["financial statement", "balance sheet", "auditor"]):
        content_signals.append("financial_content")
    if any(kw in text_lower for kw in ["franchise agreement", "grant of franchise"]):
        content_signals.append("agreement_content")
    if any(kw in text_lower for kw in ["state addend", "additional disclosure"]):
        content_signals.append("state_addenda_content")
    if any(kw in text_lower for kw in ["receipt", "acknowledge"]):
        content_signals.append("receipt_content")
    if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text):
        content_signals.append("contains_phone_numbers")
    if "@" in text and "." in text:
        content_signals.append("contains_emails")

    return {
        "role": "other",
        "start_page": exhibit.start_page,
        "consumed": True,
        "page_count": len(pages),
        "content_signals": content_signals,
        "first_100_chars": text[:100].strip(),
    }


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

        elif exhibit.role in (ExhibitRole.FRANCHISE_AGREEMENT, ExhibitRole.DEVELOPMENT_AGREEMENT,
                              ExhibitRole.NONTRADITIONAL_AGREEMENT, ExhibitRole.SMALLTOWN_AGREEMENT):
            data = parse_agreement_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        elif exhibit.role in (ExhibitRole.STATE_ADDENDA_FDD, ExhibitRole.STATE_ADDENDA_AGREEMENT):
            exhibit.parsed = True
            results[exhibit.code] = {"role": exhibit.role.value, "start_page": exhibit.start_page,
                                     "page_count": (exhibit.end_page - exhibit.start_page + 1) if exhibit.end_page else 0}

        elif exhibit.role == ExhibitRole.GUARANTY:
            data = parse_guaranty_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        elif exhibit.role in (ExhibitRole.SUPPLIER_AGREEMENT,):
            data = parse_agreement_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        elif exhibit.role in (ExhibitRole.ADVERTISING_AGREEMENT,):
            data = parse_agreement_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        elif exhibit.role == ExhibitRole.MANUAL_TOC:
            data = parse_manual_toc_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        elif exhibit.role in (ExhibitRole.FRANCHISEE_LIST, ExhibitRole.FORMER_FRANCHISEE_LIST,
                              ExhibitRole.UNOPENED_UNITS_LIST, ExhibitRole.ITEM20_SUPPORT):
            data = parse_list_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        elif exhibit.role == ExhibitRole.RECEIPT:
            exhibit.parsed = True
            results[exhibit.code] = {"role": "receipt", "start_page": exhibit.start_page,
                                     "consumed": True, "pii_blocked": True}

        elif exhibit.role in (ExhibitRole.LEASE_RIDER, ExhibitRole.EQUIPMENT_LEASE,
                              ExhibitRole.PAYMENT_ACH, ExhibitRole.FINANCING_DOC):
            data = parse_agreement_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

        else:
            # Catch-all: no exhibit type should be silently skipped
            data = parse_unknown_exhibit(exhibit, page_reads)
            exhibit.parsed = True
            results[exhibit.code] = data

    # Fallback: if no financial exhibit found, scan all pages for auditor/financial signals
    if "financials" not in results:
        fin_data = _scan_all_pages_for_financials(page_reads)
        if fin_data:
            results["financials"] = fin_data

    return results


def _scan_all_pages_for_financials(page_reads: List[PageRead]) -> Dict[str, Any]:
    """Scan all pages for financial statement signals when no labeled exhibit found.

    Looks for auditor signatures, balance sheet / income statement labels, and
    key financial figures. Used as fallback for brands that don't label their
    financial exhibit correctly.
    """
    # Scan pages likely to contain financial statements (last third of doc typically)
    n = len(page_reads)
    scan_pages = page_reads[max(0, n // 2):]  # scan second half of document
    if not scan_pages:
        return {}

    data: Dict[str, Any] = {}

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
        (r"Marcum(?:\s+LLP)?", "Marcum"),
        (r"Wipfli(?:\s+LLP)?", "Wipfli"),
        (r"Eide\s+Bailly(?:\s+LLP)?", "Eide Bailly"),
        (r"Armanino(?:\s+LLP)?", "Armanino"),
        (r"Forvis\s+Mazars|FORVIS|Dixon\s+Hughes\s+Goodman", "Forvis Mazars"),
        (r"Carr\s+Riggs\s+(?:&\s+)?Ingram|CRI\b", "Carr Riggs & Ingram"),
        (r"Citrin\s+Cooperman", "Citrin Cooperman"),
        (r"Weaver(?:\s+and\s+Tidwell)?(?:\s+LLP)?", "Weaver"),
        (r"Withum(?:\s+Smith\s+(?:&\s+)?Brown)?", "Withum"),
    ]

    # Find pages with auditor or financial statement keywords
    fin_pages = []
    for pr in scan_pages:
        txt = pr.text[:3000]
        for pattern, name in AUDITORS:
            if re.search(pattern, txt, re.I):
                data["auditorName"] = name
                data["hasAuditedFinancials"] = True
                fin_pages.append(pr)
                break
        if not fin_pages:
            if re.search(r"(?:balance\s+sheet|statements?\s+of\s+(?:financial\s+position|operations|income)|"
                         r"independent\s+(?:auditor|accountant))", txt, re.I):
                data["hasAuditedFinancials"] = True
                fin_pages.append(pr)

    if not fin_pages:
        return {}

    # Extract financial figures from found pages
    combined = "\n".join(pr.text for pr in fin_pages[:10])

    def _find_amount(pattern, window=500):
        m = re.search(pattern, combined, re.I)
        if not m:
            return None
        for snippet in [combined[m.end():m.end()+window], combined[max(0,m.start()-100):m.start()]]:
            am = re.search(r"\$?\s*([\d,]+(?:\.\d+)?)\s*(million|billion|thousand|M|B|K)?", snippet, re.I)
            if am and am.group(1):
                raw_str = am.group(1).replace(",", "").strip()
                if not raw_str:
                    continue
                raw = float(raw_str)
                if am.group(2):
                    mult = {"million":1e6,"billion":1e9,"thousand":1e3,"m":1e6,"b":1e9,"k":1e3}
                    raw *= mult.get(am.group(2).lower(), 1)
                return int(raw) if raw >= 1000 else None
        return None

    rev = _find_amount(r"(?:total\s+)?(?:net\s+)?revenues?")
    if rev and rev > 100000:
        data["franchisorRevenue"] = rev
    assets = _find_amount(r"total\s+assets")
    if assets and assets > 10000:
        data["franchisorTotalAssets"] = assets
    liab = _find_amount(r"total\s+liabilities")
    if liab:
        data["franchisorTotalLiabilities"] = liab
    ni = _find_amount(r"net\s+(?:income|loss)")
    if ni is not None:
        data["franchisorNetIncome"] = ni

    if re.search(r"present\s+fairly.*?in\s+all\s+material\s+respects|in\s+our\s+opinion.*fairly", combined, re.I):
        data["auditorOpinion"] = "clean"

    data["goingConcernWarning"] = bool(re.search(
        r"substantial\s+doubt.{0,80}(?:going\s+concern|ability\s+to\s+continue)", combined, re.I))

    if data.get("goingConcernWarning") or data.get("auditorOpinion") in ("adverse", "disclaimer"):
        data["financialStrengthSignal"] = "weak"
    elif data.get("auditorOpinion") == "clean":
        data["financialStrengthSignal"] = "strong"
    else:
        data["financialStrengthSignal"] = "adequate"

    return data
