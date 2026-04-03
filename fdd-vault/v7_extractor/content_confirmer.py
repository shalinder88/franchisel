"""
Content Confirmer

Validates that a located section actually contains the expected content
for its claimed item number. This is the MAIN confidence source.

Uses item-content definitions to distinguish:
  Item 18 from 19 (18 = 1-2 lines, 19 = money)
  Item 19 from 20 (19 = revenue/EBITDA, 20 = locations/states)
  Item 5 from 6 from 7 (5 = lump sum, 6 = % of gross, 7 = TOTAL investment)

Outputs:
  confirmed: bool
  confidence: float (0-1)
  content_score: int (number of positive signals)
  matched_signals: list of matched signal words
  contradictory_signals: list of matched anti-signals
  confirmation_basis: str (explanation)
"""

from typing import Dict, Any, List


# Content signals per item — simple word matching, NO regex
# These are what each item's content should contain
ITEM_SIGNALS = {
    5: {
        "positive": ["initial franchise fee", "initial fee", "development fee", "non-refundable", "lump sum"],
        "negative": ["% of gross sales", "systemwide outlet"],
        "min_length": 300, "max_length": 999999,
    },
    6: {
        "positive": ["royalty", "advertising", "ad fund", "% of gross", "% of net", "transfer fee", "other fees"],
        "negative": ["estimated initial investment", "systemwide outlet"],
        "min_length": 500, "max_length": 999999,
    },
    7: {
        "positive": ["estimated initial investment", "your estimated", "leasehold", "equipment", "total"],
        "negative": ["systemwide outlet"],
        "min_length": 1000, "max_length": 999999,
    },
    18: {
        "positive": ["public figure"],
        "negative": ["average", "median", "ebitda", "systemwide"],
        "min_length": 0, "max_length": 5000,
    },
    19: {
        "positive": ["financial performance", "average", "median", "gross sales", "gross revenue", "ebitda"],
        "negative": ["systemwide outlet summary", "outlets at start"],
        "min_length": 400, "max_length": 999999,
    },
    20: {
        "positive": ["systemwide outlet", "outlets at start", "outlets at end", "opened", "terminated", "franchised", "company-owned"],
        "negative": ["ebitda", "average revenue"],
        "min_length": 1000, "max_length": 999999,
    },
    21: {
        "positive": ["financial statement", "audited", "fiscal year", "exhibit"],
        "negative": ["systemwide outlet"],
        "min_length": 0, "max_length": 8000,
    },
}


def confirm_section_content(item_num: int, text: str) -> Dict[str, Any]:
    """Confirm whether text matches expected content for the given item.

    Returns rich confirmation with matched/contradictory signals and score.
    """
    signals = ITEM_SIGNALS.get(item_num)
    if not signals:
        # No specific rules — accept with moderate confidence
        return {
            "confirmed": True,
            "confidence": 0.5,
            "content_score": 0,
            "matched_signals": [],
            "contradictory_signals": [],
            "confirmation_basis": "no_rules_defined",
        }

    text_lower = text[:8000].lower()
    text_len = len(text.strip())

    # Match positive signals
    matched = [s for s in signals["positive"] if s in text_lower]
    content_score = len(matched)

    # Match negative signals
    contradictory = [s for s in signals["negative"] if s in text_lower[:4000]]

    # Length check
    min_len = signals.get("min_length", 0)
    max_len = signals.get("max_length", 999999)
    length_ok = min_len <= text_len <= max_len

    # Scoring
    total_positive = len(signals["positive"])
    if total_positive > 0:
        match_ratio = content_score / total_positive
    else:
        match_ratio = 1.0

    # Determine confirmation
    if len(contradictory) > 0 and content_score < 2:
        confirmed = False
        confidence = 0.2
        basis = f"contradictory_signals: {contradictory}"
    elif match_ratio >= 0.4 and length_ok and len(contradictory) == 0:
        confirmed = True
        confidence = min(1.0, 0.5 + match_ratio * 0.5)
        basis = f"matched {content_score}/{total_positive} signals, length ok"
    elif match_ratio >= 0.4 and len(contradictory) == 0:
        confirmed = True
        confidence = 0.6
        basis = f"matched {content_score}/{total_positive} signals, length unusual ({text_len})"
    elif content_score >= 1 and len(contradictory) == 0:
        confirmed = True
        confidence = 0.4
        basis = f"weak match: {content_score}/{total_positive} signals"
    else:
        confirmed = False
        confidence = 0.2
        basis = f"only {content_score}/{total_positive} signals, {len(contradictory)} contradictory"

    return {
        "confirmed": confirmed,
        "confidence": round(confidence, 2),
        "content_score": content_score,
        "matched_signals": matched,
        "contradictory_signals": contradictory,
        "confirmation_basis": basis,
        "text_length": text_len,
    }
