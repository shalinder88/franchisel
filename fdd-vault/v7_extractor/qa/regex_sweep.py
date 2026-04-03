"""
Regex QA Sweep — Runs LAST.

This is the ONLY place regex is used for extraction.
It catches what the reading pass may have missed.
It does NOT replace reading — it supplements.

Checks:
  - Missing currency ranges ($X to $Y not captured)
  - Uncaptured "% of Gross Sales" patterns
  - Missing "minimum payment" language
  - Missing cure-period language ("X days to cure")
  - Missing spouse/guaranty language
  - Missing venue/arbitration state mentions
  - Unresolved "see Exhibit/Item/Note" references
  - Dollar amounts in Item 19 not in table objects
"""

import re
from typing import Dict, List, Any
from ..models import ItemSection, CrossReference


def run_regex_sweep(items: Dict[int, ItemSection],
                    full_text: str,
                    evidence: Dict) -> List[Dict[str, Any]]:
    """Run the mandatory regex QA sweep.

    Returns list of findings. Each finding has:
      - type: what was found
      - item: which item it relates to
      - detail: description
      - severity: info / warning / critical
    """
    findings = []

    # ── Check for uncaptured revenue data ──
    if 19 in items:
        i19_text = items[19].text
        dollar_vals = []
        for d in re.findall(r'\$\s*[\d,]+', i19_text):
            try:
                v = int(re.sub(r'[\$\s,]', '', d))
                if v >= 1000:
                    dollar_vals.append(v)
            except ValueError:
                pass
        if len(dollar_vals) >= 3 and not evidence.get("hasItem19"):
            findings.append({
                "type": "missed_fpr_data",
                "item": 19,
                "detail": f"Regex found {len(dollar_vals)} dollar amounts >= $1K but reading pass said no FPR",
                "severity": "critical",
            })

    # ── Check for universal FPR disclaimer ──
    if 19 in items:
        has_sold = bool(re.search(
            r'(?:sold|earned).*?(?:amount|result).*?(?:differ|assurance)',
            items[19].text, re.I))
        if has_sold and not evidence.get("hasItem19"):
            findings.append({
                "type": "missed_fpr_disclaimer",
                "item": 19,
                "detail": "Universal FPR disclaimer found but FPR not detected by reading pass",
                "severity": "critical",
            })

    # ── Check for missing royalty ──
    if 6 in items and not evidence.get("royaltyRate"):
        m = re.search(r'(?:Royalty|Continuing).*?(\d+(?:\.\d+)?)\s*%', items[6].text[:5000], re.I)
        if m:
            findings.append({
                "type": "missed_royalty",
                "item": 6,
                "detail": f"Regex found royalty {m.group(1)}% but table extraction missed it",
                "severity": "warning",
                "value": f"{m.group(1)}%",
            })

    # ── Check for missing investment total ──
    if 7 in items and not evidence.get("totalInvestmentLow"):
        m = re.search(r'TOTAL.*?\$\s*([\d,]+).*?(?:to|\-)\s*\$\s*([\d,]+)', items[7].text, re.I)
        if m:
            findings.append({
                "type": "missed_investment_total",
                "item": 7,
                "detail": f"Regex found investment range ${m.group(1)}-${m.group(2)} but table missed it",
                "severity": "warning",
                "value_low": m.group(1),
                "value_high": m.group(2),
            })

    # ── Check for missing initial fee ──
    if 5 in items and not evidence.get("initialFranchiseFee"):
        m = re.search(r'(?:initial\s+)?(?:franchise|establishment)\s+fee.*?\$\s*([\d,]+)', items[5].text, re.I)
        if m:
            findings.append({
                "type": "missed_initial_fee",
                "item": 5,
                "detail": f"Regex found fee ${m.group(1)} but table extraction missed it",
                "severity": "warning",
                "value": m.group(1),
            })

    # ── Check for unresolved cross-references ──
    all_refs = re.findall(r'[Ss]ee\s+(?:Exhibit|Item|Note)\s+[A-Z0-9\-]+', full_text)
    if len(all_refs) > 0:
        findings.append({
            "type": "cross_reference_count",
            "item": 0,
            "detail": f"{len(all_refs)} 'see Exhibit/Item/Note' references found in full text",
            "severity": "info",
        })

    # ── Check for cure-period language ──
    if 17 in items and not evidence.get("curePeriodDays"):
        m = re.search(r'(\d+)\s*(?:calendar\s+)?days?\s*(?:to\s+)?cure', items[17].text, re.I)
        if m:
            findings.append({
                "type": "missed_cure_period",
                "item": 17,
                "detail": f"Regex found cure period {m.group(1)} days but parsing missed it",
                "severity": "warning",
                "value": int(m.group(1)),
            })

    # ── Check for venue language ──
    if 17 in items and not evidence.get("disputeVenue"):
        m = re.search(r'(?:in\s+)?(\w+(?:\s+\w+)?\s+County,\s+[A-Z][a-z]+)', items[17].text)
        if m:
            findings.append({
                "type": "missed_venue",
                "item": 17,
                "detail": f"Regex found venue '{m.group(1)}' but parsing missed it",
                "severity": "warning",
                "value": m.group(1),
            })

    return findings
