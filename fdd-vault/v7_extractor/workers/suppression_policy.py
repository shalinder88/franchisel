"""
Person Suppression Policy — Centralized PII enforcement.

Default suppression zones:
  - Item 1 (identity — suppress personal names)
  - Item 2 (business experience — suppress personal names)
  - Item 23 (receipts — suppress seller names)
  - Receipt/seller lists
  - Routine signatory blocks

Allowed exceptions:
  - Litigation parties and matters (Item 3)
  - Item 18 public figures
  - Named counterparties when the legal/economic fact requires it

Workers MUST check this policy before emitting facts that may contain names.
"""

import re
from typing import Optional, List, Dict, Any


# ══════════════════════════════════════════════════════════════
# SUPPRESSION ZONES
# ══════════════════════════════════════════════════════════════

# Items where personal names are suppressed by default
SUPPRESS_NAMES_ITEMS = {1, 2, 23}

# Items where names are allowed (litigation, public figures)
ALLOW_NAMES_ITEMS = {3, 18}

# Exhibit roles where names are suppressed
SUPPRESS_NAMES_EXHIBITS = {
    "receipt", "franchisee_list", "former_franchisee_list",
    "unopened_units_list",
}

# Exhibit roles where names are allowed
ALLOW_NAMES_EXHIBITS = {"financials"}  # Auditor names are OK

# PII patterns that are ALWAYS blocked regardless of zone
PII_HARD_BLOCK = [
    r'\b\d{3}-\d{2}-\d{4}\b',           # SSN
    r'\(\d{3}\)\s*\d{3}-\d{4}',          # Phone
    r'\b\d{3}-\d{3}-\d{4}\b',            # Phone alt
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',  # Email
]

# Name-like patterns (for soft suppression)
NAME_PATTERNS = [
    r'\b(?:Mr|Mrs|Ms|Dr|Jr|Sr)\.?\s+[A-Z][a-z]+',
    r'\b[A-Z][a-z]+\s+(?:[A-Z]\.?\s+)?[A-Z][a-z]{2,}(?:\s+(?:Jr|Sr|III?|IV)\.?)?',
]


class SuppressionPolicy:
    """Enforces person name / PII suppression across all workers.

    Workers call check() before emitting facts. The policy returns
    either the original text (safe) or a redacted version.
    """

    def __init__(self):
        self._hard_block_patterns = [re.compile(p) for p in PII_HARD_BLOCK]
        self._name_patterns = [re.compile(p) for p in NAME_PATTERNS]

    def check(self, text: str,
              source_item: Optional[int] = None,
              source_exhibit_role: Optional[str] = None,
              fact_type: Optional[str] = None) -> Dict[str, Any]:
        """Check text against suppression policy.

        Returns:
            {
                "allowed": True/False,
                "redacted_text": cleaned text (if needed),
                "violations": list of what was found,
                "zone": suppression zone that applies,
            }
        """
        violations = []

        # ── Hard PII blocks (always) ──
        for pattern in self._hard_block_patterns:
            matches = pattern.findall(text)
            for m in matches:
                violations.append({
                    "type": "hard_pii",
                    "pattern": str(m)[:20],
                    "action": "block",
                })

        if violations:
            redacted = self._redact_hard_pii(text)
            return {
                "allowed": False,
                "redacted_text": redacted,
                "violations": violations,
                "zone": "hard_pii",
            }

        # ── Zone-based name suppression ──
        in_suppress_zone = False
        zone = "open"

        if source_item in SUPPRESS_NAMES_ITEMS:
            in_suppress_zone = True
            zone = f"item_{source_item}_suppress"
        elif source_exhibit_role in SUPPRESS_NAMES_EXHIBITS:
            in_suppress_zone = True
            zone = f"exhibit_{source_exhibit_role}_suppress"

        # Check exceptions
        if source_item in ALLOW_NAMES_ITEMS:
            in_suppress_zone = False
            zone = f"item_{source_item}_allowed"
        if source_exhibit_role in ALLOW_NAMES_EXHIBITS:
            in_suppress_zone = False
            zone = f"exhibit_{source_exhibit_role}_allowed"

        # Fact-type exceptions
        if fact_type in ("litigation_case", "regulatory_action", "public_figures"):
            in_suppress_zone = False
            zone = f"exception_{fact_type}"

        if in_suppress_zone:
            name_matches = []
            for pattern in self._name_patterns:
                name_matches.extend(pattern.findall(text))

            if name_matches:
                violations = [{
                    "type": "name_in_suppress_zone",
                    "count": len(name_matches),
                    "action": "redact",
                }]
                redacted = self._redact_names(text)
                return {
                    "allowed": True,  # Allowed but redacted
                    "redacted_text": redacted,
                    "violations": violations,
                    "zone": zone,
                }

        return {
            "allowed": True,
            "redacted_text": text,
            "violations": [],
            "zone": zone,
        }

    def should_suppress_names(self, source_item: Optional[int] = None,
                               source_exhibit_role: Optional[str] = None,
                               fact_type: Optional[str] = None) -> bool:
        """Quick check: should names be suppressed for this source?"""
        if fact_type in ("litigation_case", "regulatory_action", "public_figures"):
            return False
        if source_item in ALLOW_NAMES_ITEMS:
            return False
        if source_item in SUPPRESS_NAMES_ITEMS:
            return True
        if source_exhibit_role in SUPPRESS_NAMES_EXHIBITS:
            return True
        return False

    def _redact_hard_pii(self, text: str) -> str:
        """Remove hard PII (SSN, phone, email)."""
        result = text
        for pattern in self._hard_block_patterns:
            result = pattern.sub("[PII_REDACTED]", result)
        return result

    def _redact_names(self, text: str) -> str:
        """Remove personal names from text."""
        result = text
        for pattern in self._name_patterns:
            result = pattern.sub("[NAME_REDACTED]", result)
        return result


# Singleton for all workers to share
_policy_instance = None


def get_suppression_policy() -> SuppressionPolicy:
    """Get the shared suppression policy instance."""
    global _policy_instance
    if _policy_instance is None:
        _policy_instance = SuppressionPolicy()
    return _policy_instance
