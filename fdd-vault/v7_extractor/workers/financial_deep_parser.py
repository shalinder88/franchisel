"""
Deep Financial Parser — Sprint 3.1

Parses Item 21 financial statements into structured objects.

Extracts:
  - audit opinion type
  - balance-sheet headlines (cash, assets, liabilities, equity)
  - revenue composition
  - net income / loss
  - operating cash flow
  - related-party dependency
  - guaranty presence
  - financial-condition / going-concern warnings

Does NOT try to parse every footnote. Starts with high-signal fields.
"""

import re
from typing import Any, Dict, List, Optional


def parse_financials_deep(section_text: str, tables: List,
                           exhibit_data: Dict,
                           engines: Dict) -> Dict[str, Any]:
    """Parse Item 21 financial data from text + exhibits + V7 engines.

    Sources (precedence):
    1. V7 financial_statement_engine (already parsed exhibits)
    2. Item 21 section text (narrative references)
    3. Financial tables (if any in Item 21)
    """
    result = {
        "hasItem21": True,
        "hasAuditedFinancials": False,
        "auditOpinionType": None,
        "auditorName": None,
        "cash": None,
        "totalAssets": None,
        "totalLiabilities": None,
        "equity": None,
        "revenue": None,
        "netIncome": None,
        "operatingCashFlow": None,
        "hasParentGuarantee": False,
        "hasFinancialConditionWarning": False,
        "hasRelatedPartyDependency": False,
        "hasGoingConcern": False,
    }

    text = section_text or ""
    text_lower = text.lower()

    # ── Pull from V7 engines first (highest precedence) ──
    fin_engine = engines.get("financial_statement_engine", {})
    if fin_engine:
        if fin_engine.get("hasAuditedFinancials"):
            result["hasAuditedFinancials"] = True
        if fin_engine.get("auditorName"):
            result["auditorName"] = fin_engine["auditorName"]
        if fin_engine.get("goingConcernWarning"):
            result["hasGoingConcern"] = True
            result["hasFinancialConditionWarning"] = True
        if fin_engine.get("financialStrengthSignal"):
            result["financialStrengthSignal"] = fin_engine["financialStrengthSignal"]

    # ── Pull from exhibit data ──
    fin_exhibit = exhibit_data.get("financials", {})
    if isinstance(fin_exhibit, dict):
        for key in ["auditorName", "auditorOpinion", "franchisorRevenue",
                     "franchisorTotalAssets", "franchisorNetIncome",
                     "franchisorTotalLiabilities", "franchisorEquity",
                     "franchisorCashAndEquivalents", "operatingCashFlow"]:
            val = fin_exhibit.get(key)
            if val is not None:
                # Map exhibit keys to canonical keys
                canonical_key = {
                    "franchisorRevenue": "revenue",
                    "franchisorTotalAssets": "totalAssets",
                    "franchisorNetIncome": "netIncome",
                    "franchisorTotalLiabilities": "totalLiabilities",
                    "franchisorEquity": "equity",
                    "franchisorCashAndEquivalents": "cash",
                }.get(key, key)
                if result.get(canonical_key) is None:
                    result[canonical_key] = val

    # ── Audit opinion from text ──
    if result["auditOpinionType"] is None:
        opinion_patterns = [
            (r'(?:unqualified|unmodified|clean)\s+(?:audit\s+)?opinion', "unqualified"),
            (r'(?:qualified)\s+(?:audit\s+)?opinion', "qualified"),
            (r'(?:adverse)\s+(?:audit\s+)?opinion', "adverse"),
            (r'(?:disclaimer\s+of\s+opinion)', "disclaimer"),
            (r'(?:going\s+concern)', "going_concern"),
        ]
        for pattern, opinion_type in opinion_patterns:
            if re.search(pattern, text_lower):
                result["auditOpinionType"] = opinion_type
                if opinion_type == "going_concern":
                    result["hasGoingConcern"] = True
                    result["hasFinancialConditionWarning"] = True
                break

    # ── Auditor from text (if not from engine) ──
    if not result["auditorName"]:
        big_firms = [
            ("ernst & young", "Ernst & Young"), ("deloitte", "Deloitte"),
            ("kpmg", "KPMG"), ("pricewaterhouse", "PwC"), ("pwc", "PwC"),
            ("bdo", "BDO"), ("grant thornton", "Grant Thornton"),
            ("rsm", "RSM"), ("moss adams", "Moss Adams"),
            ("baker tilly", "Baker Tilly"), ("marcum", "Marcum"),
            ("cherry bekaert", "Cherry Bekaert"),
        ]
        for pattern, name in big_firms:
            if pattern in text_lower:
                result["auditorName"] = name
                result["hasAuditedFinancials"] = True
                break

    # ── Financial numbers from tables ──
    for table in tables:
        rows = table.rows if hasattr(table, 'rows') else []
        for row in rows:
            if not row:
                continue
            row_text = " ".join(row).lower()
            row_full = " ".join(row)

            # Revenue
            if result["revenue"] is None:
                if any(kw in row_text for kw in ["total revenue", "net revenue", "total sales"]):
                    amt = _extract_largest_dollar(row_full)
                    if amt and amt > 100000:
                        result["revenue"] = amt

            # Total assets
            if result["totalAssets"] is None:
                if "total assets" in row_text:
                    amt = _extract_largest_dollar(row_full)
                    if amt and amt > 10000:
                        result["totalAssets"] = amt

            # Total liabilities
            if result["totalLiabilities"] is None:
                if "total liabilities" in row_text and "equity" not in row_text:
                    amt = _extract_largest_dollar(row_full)
                    if amt and amt > 10000:
                        result["totalLiabilities"] = amt

            # Net income
            if result["netIncome"] is None:
                if any(kw in row_text for kw in ["net income", "net loss", "net (loss)"]):
                    amt = _extract_largest_dollar(row_full)
                    if amt:
                        result["netIncome"] = amt

            # Cash
            if result["cash"] is None:
                if any(kw in row_text for kw in ["cash and cash equivalents", "cash and equivalents"]):
                    amt = _extract_largest_dollar(row_full)
                    if amt:
                        result["cash"] = amt

    # ── Guaranty detection ──
    if re.search(r'(?:parent|corporate|personal)\s+guarant', text_lower):
        result["hasParentGuarantee"] = True
    if re.search(r'(?:guaranty|guarantee)\s+(?:of|by)\s+(?:performance|payment|obligation)', text_lower):
        result["hasParentGuarantee"] = True

    # ── Related-party dependency ──
    if re.search(r'(?:related.?party|affiliate)\s+(?:transaction|receivable|payable|balance|revenue)', text_lower):
        result["hasRelatedPartyDependency"] = True

    # ── Financial condition warning ──
    if re.search(r'(?:financial\s+condition|material\s+uncertainty|substantial\s+doubt|going\s+concern)', text_lower):
        result["hasFinancialConditionWarning"] = True

    return result


def _extract_largest_dollar(text: str) -> Optional[int]:
    """Extract the largest dollar amount from text."""
    amounts = re.findall(r'\$?\s*([\d,]+(?:\.\d+)?)', text)
    if not amounts:
        return None
    cleaned = []
    for a in amounts:
        try:
            v = float(a.replace(",", ""))
            if v >= 100:  # Skip tiny numbers
                cleaned.append(int(v))
        except ValueError:
            pass
    return max(cleaned) if cleaned else None
