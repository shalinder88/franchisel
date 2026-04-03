"""
State Override Engine

First-class engine for state-specific addenda.

For each state addendum:
  - detect which agreement it modifies
  - extract overridden fields
  - attach override to affected engines
  - store state-specific precedence rule

Most common domains overridden:
  - venue / arbitration
  - termination / cure
  - renewal
  - transfer
  - repurchase
  - release / waiver language
  - compensation rights

Precedence order:
  1. state-specific addenda (highest)
  2. exhibit-specific rider/amendment
  3. agreement exhibit
  4. main item narrative
  5. cover-page summary (lowest)
"""

import re
from typing import List, Dict
from .models import StateOverride, ExhibitObject, ExhibitRole, PageRead, US_STATES


OVERRIDE_DOMAINS = [
    "venue_arbitration",
    "termination_cure",
    "renewal",
    "transfer",
    "repurchase",
    "release_waiver",
    "compensation_rights",
    "liquidated_damages",
    "noncompete",
]

# Patterns that indicate a specific domain is being overridden
DOMAIN_PATTERNS = {
    "venue_arbitration": [r"venue|arbitrat|mediat|forum|choice\s+of\s+(?:law|forum)", r"litigation.*?(?:state|county)"],
    "termination_cure": [r"terminat|cure\s+period|default|(?:right\s+to\s+)?(?:cure|remedy)"],
    "renewal": [r"renew|extension\s+of\s+(?:the\s+)?term"],
    "transfer": [r"transfer|assign|(?:right\s+of\s+)?first\s+refusal"],
    "repurchase": [r"repurchas|buy[\-\s]?back"],
    "release_waiver": [r"release|waiv|general\s+release|mutual\s+release"],
    "noncompete": [r"non[\-\s]?compet|covenant\s+not\s+to\s+compete"],
}


def parse_state_addenda(exhibits: Dict[str, ExhibitObject],
                        page_reads: List[PageRead]) -> List[StateOverride]:
    """Parse state addenda exhibits into override objects.

    Scans state addenda exhibits for override language and extracts:
    - which state
    - which agreement is modified
    - which domain (venue, termination, transfer, etc.)
    - the override text
    """
    overrides = []

    state_exhibits = [ex for ex in exhibits.values()
                      if ex.role in (ExhibitRole.STATE_ADDENDA_FDD, ExhibitRole.STATE_ADDENDA_AGREEMENT)]

    for exhibit in state_exhibits:
        if exhibit.start_page == 0:
            continue

        # Collect exhibit text
        exhibit_pages = [p for p in page_reads
                         if exhibit.start_page <= p.page_num <= exhibit.end_page]
        text = "\n".join(p.text for p in exhibit_pages[:20])  # cap

        # Detect states mentioned
        states_found = []
        for state in US_STATES:
            if state.lower() in text.lower():
                states_found.append(state)

        # Detect which agreement is modified
        target_doc = "franchise_agreement"
        if re.search(r"development\s+agreement", text, re.I):
            target_doc = "development_agreement"

        # Detect override domains
        for domain, patterns in DOMAIN_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text, re.I):
                    # Extract the override text (first 200 chars near the domain keyword)
                    m = re.search(pattern, text, re.I)
                    if m:
                        override_text = text[max(0, m.start()-50):m.end()+200].strip()[:300]
                        for state in states_found:
                            overrides.append(StateOverride(
                                state=state,
                                target_document=target_doc,
                                clause_domain=domain,
                                override_text=override_text,
                            ))
                    break

    return overrides
