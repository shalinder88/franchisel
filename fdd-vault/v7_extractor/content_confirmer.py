"""
Content Confirmer

Validates that a located section actually contains the expected content
for its claimed item number.

Uses the item-content definitions to distinguish:
  Item 18 from 19 (18 = 1-2 lines, 19 = money)
  Item 19 from 20 (19 = revenue/EBITDA, 20 = locations/states)
  Item 5 from 6 from 7 (5 = lump sum, 6 = % of gross, 7 = TOTAL investment)

This is a confirmation layer, not a locator. The item_locator finds candidates;
this module confirms or rejects them.
"""

import re
from typing import Dict, Any, Optional, Tuple


# Content signals per item (what MUST be present, what MUST NOT be present)
CONTENT_RULES = {
    5: {
        "must_have": [r"(?:initial|franchise|establishment)\s+fee", r"(?:lump\s+sum|non[\-\s]refundable)"],
        "must_not_have": [r"% of (?:Gross|Net)\s+Sales", r"Systemwide Outlet"],
        "min_length": 300,
    },
    6: {
        "must_have": [r"(?:Royalty|Continuing)", r"(?:% of|percent)"],
        "must_not_have": [r"ESTIMATED INITIAL INVESTMENT", r"Systemwide Outlet"],
        "min_length": 500,
    },
    7: {
        "must_have": [r"ESTIMATED INITIAL INVESTMENT|YOUR ESTIMATED", r"TOTAL"],
        "must_not_have": [r"Systemwide Outlet"],
        "min_length": 1000,
    },
    18: {
        "must_have": [r"public figure"],
        "must_not_have": [r"\$[\d,]{4,}", r"Average|Median", r"EBITDA", r"Systemwide"],
        "max_length": 3000,
    },
    19: {
        "must_have": [r"(?:Financial Performance|financial performance)", r"\$[\d,]{4,}"],
        "must_not_have": [r"Systemwide Outlet Summary", r"(?:Opened|Terminated).*(?:Outlet|Restaurant)"],
        "min_length": 400,
    },
    20: {
        "must_have": [r"(?:Systemwide|System[\-\s]wide).*(?:Outlet|Summary|Studio|Restaurant)",
                      r"(?:Franchised|Company[\-\s]Owned)"],
        "must_not_have": [r"EBITDA", r"Average.*Revenue.*\$"],
        "min_length": 1000,
    },
    21: {
        "must_have": [r"(?:Financial Statement|Exhibit\s+[A-Z]|audited)"],
        "must_not_have": [r"Systemwide Outlet", r"EBITDA"],
        "max_length": 5000,
    },
}


def confirm_section_content(item_num: int, text: str) -> Dict[str, Any]:
    """Confirm whether text matches expected content for the given item number.

    Returns:
      confirmed: bool — does the content match?
      confidence: float — how confident (0.0 to 1.0)
      must_have_hits: int — how many required patterns found
      must_not_have_hits: int — how many forbidden patterns found
      reason: str — explanation
    """
    rules = CONTENT_RULES.get(item_num)
    if not rules:
        return {"confirmed": True, "confidence": 0.5, "reason": "no rules defined"}

    sample = text[:8000]
    must_have = rules.get("must_have", [])
    must_not = rules.get("must_not_have", [])
    min_len = rules.get("min_length", 0)
    max_len = rules.get("max_length", 999999)

    # Check must-have patterns
    mh_hits = sum(1 for p in must_have if re.search(p, sample, re.I))
    mh_total = len(must_have)

    # Check must-not-have patterns
    mn_hits = sum(1 for p in must_not if re.search(p, sample[:3000], re.I))

    # Check length
    text_len = len(text.strip())
    length_ok = min_len <= text_len <= max_len

    # Score
    if mh_total > 0:
        mh_ratio = mh_hits / mh_total
    else:
        mh_ratio = 1.0

    if mn_hits > 0:
        confirmed = False
        confidence = 0.2
        reason = f"Anti-patterns found ({mn_hits}), content may belong to wrong item"
    elif mh_ratio >= 0.5 and length_ok:
        confirmed = True
        confidence = min(1.0, 0.5 + mh_ratio * 0.5)
        reason = f"Content matches: {mh_hits}/{mh_total} must-have patterns, length ok"
    elif mh_ratio >= 0.5:
        confirmed = True
        confidence = 0.6
        reason = f"Content matches but length unusual ({text_len})"
    else:
        confirmed = False
        confidence = 0.3
        reason = f"Only {mh_hits}/{mh_total} must-have patterns found"

    return {
        "confirmed": confirmed,
        "confidence": round(confidence, 2),
        "must_have_hits": mh_hits,
        "must_not_have_hits": mn_hits,
        "text_length": text_len,
        "reason": reason,
    }
