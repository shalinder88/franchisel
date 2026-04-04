"""
Item 17 Parser — Renewal, Termination, Transfer, and Dispute Resolution

THE CONTRACT TABLE (NASAA lettered rows a-w). Extracts: initial term,
renewal count/term, termination triggers, cure periods, transfer restrictions/fees,
non-compete duration/radius, forum, mandatory arbitration, ROFR,
cross-default, spouse guaranty.
"""

import re
from typing import Dict, Any, List, Optional

from ..models import ItemSection, Provenance, EvidenceState, TableMethod


# NASAA standard provision labels (letters a through w)
NASAA_PROVISIONS = {
    "a": "length_of_franchise_term",
    "b": "renewal_or_extension",
    "c": "requirements_to_renew",
    "d": "termination_by_franchisee",
    "e": "termination_by_franchisor_with_cause",
    "f": "termination_by_franchisor_without_cause",
    "g": "franchisees_obligations_on_termination",
    "h": "assignment_of_contract_by_franchisor",
    "i": "transfer_by_franchisee",
    "j": "conditions_for_transfer",
    "k": "franchisor_right_of_first_refusal",
    "l": "franchisor_option_to_purchase",
    "m": "death_or_disability",
    "n": "non_competition_covenants_during_term",
    "o": "non_competition_covenants_after_term",
    "p": "modification_of_agreement",
    "q": "integration_merger_clause",
    "r": "dispute_resolution",
    "s": "choice_of_forum",
    "t": "choice_of_law",
    "u": "jury_waiver",
    "v": "class_action_waiver",
    "w": "mediation_arbitration",
}


def _extract_years(text: str) -> Optional[int]:
    """Extract year count from text like '10 years' or 'ten (10) years'."""
    m = re.search(r'(\d{1,3})\s*(?:year|yr)', text.lower())
    return int(m.group(1)) if m else None


def _extract_months(text: str) -> Optional[int]:
    """Extract month count."""
    m = re.search(r'(\d{1,3})\s*month', text.lower())
    return int(m.group(1)) if m else None


def _extract_miles(text: str) -> Optional[int]:
    """Extract mile radius."""
    m = re.search(r'(\d{1,3})\s*(?:mile|mi)', text.lower())
    return int(m.group(1)) if m else None


def parse_item17(section: ItemSection) -> Dict[str, Any]:
    """Parse Item 17: Renewal, Termination, Transfer, and Dispute Resolution."""
    result: Dict[str, Any] = {
        "item": 17,
        "contract_rows": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "initial_term_years": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "renewal_count": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "renewal_term_years": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "termination_triggers": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "cure_period_days": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "transfer_restrictions": {"value": [], "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "transfer_fee": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "non_compete_during_term": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "non_compete_post_term_duration": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "non_compete_post_term_radius": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "forum": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "governing_law": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "mandatory_arbitration": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "mandatory_mediation": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "rofr": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "cross_default": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "spouse_guaranty": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "jury_waiver": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
        "class_action_waiver": {"value": None, "state": EvidenceState.NOT_FOUND.value, "provenance": None},
    }

    text_lower = section.text.lower()
    prov_base = {"source_page": section.start_page}

    # --- TABLES FIRST: THE CONTRACT TABLE (NASAA a-w) ---
    contract_rows: List[Dict[str, Any]] = []

    for table in section.tables:
        tprov = {"source_page": table.source_page, "source_table_id": table.table_id}
        cols_lower = [c.lower() for c in table.columns]

        # Identify columns: provision | section in agreement | summary
        provision_idx = next(
            (i for i, c in enumerate(cols_lower) if "provision" in c or "item" in c or "subject" in c), 0
        )
        section_idx = next(
            (i for i, c in enumerate(cols_lower) if "section" in c or "agreement" in c), None
        )
        summary_idx = next(
            (i for i, c in enumerate(cols_lower) if "summary" in c or "requirement" in c or "description" in c), None
        )
        # Fallback: last column is often summary
        if summary_idx is None and len(cols_lower) > 1:
            summary_idx = len(cols_lower) - 1

        for row in table.rows:
            if not row or not any(cell.strip() for cell in row):
                continue

            contract_row: Dict[str, Any] = {
                "raw_cells": row,
                "provenance": tprov,
            }

            provision_text = row[provision_idx].strip() if provision_idx < len(row) else ""
            summary_text = row[summary_idx].strip() if summary_idx is not None and summary_idx < len(row) else ""
            contract_row["provision"] = provision_text
            contract_row["summary"] = summary_text

            if section_idx is not None and section_idx < len(row):
                contract_row["agreement_section"] = row[section_idx].strip()

            # Detect NASAA letter
            letter_match = re.match(r'^([a-w])[\.\)\s]', provision_text.lower().strip())
            if letter_match:
                letter = letter_match.group(1)
                contract_row["nasaa_letter"] = letter
                contract_row["nasaa_provision"] = NASAA_PROVISIONS.get(letter, "unknown")

            contract_rows.append(contract_row)

            # --- Extract specific fields from contract rows ---
            provision_lower = provision_text.lower()
            summary_lower = summary_text.lower()
            combined = provision_lower + " " + summary_lower

            # Initial term
            if "term" in provision_lower and ("length" in provision_lower or "initial" in provision_lower or "franchise term" in provision_lower):
                years = _extract_years(summary_text)
                if years:
                    result["initial_term_years"] = {
                        "value": years,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }

            # Renewal
            if "renew" in provision_lower or "extension" in provision_lower:
                years = _extract_years(summary_text)
                count_match = re.search(r'(\d+)\s*(?:additional|successive|renewal)', summary_lower)

                # Detect NO renewal right — critical for McDonald's-type brands
                no_renewal_patterns = [
                    r'no\s+(?:contractual\s+)?(?:right|option)\s+to\s+(?:renew|extend)',
                    r'(?:not|no)\s+(?:a\s+)?(?:renew|renewal|extension)',
                    r'renewal\s+(?:is\s+)?not\s+(?:guaranteed|automatic|assured)',
                    r'new\s+term\s+(?:policy|agreement)',
                    r'(?:subject\s+to|at)\s+(?:our|franchisor)',
                ]
                is_no_renewal = any(re.search(p, summary_lower) for p in no_renewal_patterns)

                if is_no_renewal:
                    result["renewal_available"] = {
                        "value": False,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                    # Check for New Term Policy
                    if "new term" in summary_lower:
                        result["new_term_policy"] = {
                            "value": True,
                            "state": EvidenceState.PRESENT.value,
                            "provenance": tprov,
                        }
                elif years:
                    result["renewal_term_years"] = {
                        "value": years,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                    result["renewal_available"] = {
                        "value": True,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }

                if count_match:
                    result["renewal_count"] = {
                        "value": int(count_match.group(1)),
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif "unlimited" in summary_lower:
                    result["renewal_count"] = {
                        "value": -1,
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }

            # Non-compete post-term
            if "non-compet" in combined and ("after" in combined or "post" in combined or contract_row.get("nasaa_letter") == "o"):
                years = _extract_years(summary_text)
                months = _extract_months(summary_text)
                miles = _extract_miles(summary_text)
                if years:
                    result["non_compete_post_term_duration"] = {
                        "value": {"years": years},
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                elif months:
                    result["non_compete_post_term_duration"] = {
                        "value": {"months": months},
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }
                if miles:
                    result["non_compete_post_term_radius"] = {
                        "value": {"miles": miles},
                        "state": EvidenceState.PRESENT.value,
                        "provenance": tprov,
                    }

            # Forum / choice of forum
            if "forum" in provision_lower or "venue" in provision_lower or contract_row.get("nasaa_letter") == "s":
                from ..models import US_STATES
                for state in US_STATES:
                    if state.lower() in summary_lower:
                        result["forum"] = {
                            "value": state,
                            "state": EvidenceState.PRESENT.value,
                            "provenance": tprov,
                        }
                        break

            # Governing law
            if "choice of law" in provision_lower or "governing law" in provision_lower or contract_row.get("nasaa_letter") == "t":
                from ..models import US_STATES
                for state in US_STATES:
                    if state.lower() in summary_lower:
                        result["governing_law"] = {
                            "value": state,
                            "state": EvidenceState.PRESENT.value,
                            "provenance": tprov,
                        }
                        break

            # Arbitration
            if "arbitration" in combined or contract_row.get("nasaa_letter") == "w":
                has_arb = not re.search(r'\b(?:no|not|neither)\b.*arbitration', summary_lower)
                result["mandatory_arbitration"] = {
                    "value": has_arb,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

            # Mediation
            if "mediation" in combined:
                result["mandatory_mediation"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

            # ROFR
            if "first refusal" in combined or contract_row.get("nasaa_letter") == "k":
                result["rofr"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

            # Jury waiver
            if "jury" in combined and "waiver" in combined or contract_row.get("nasaa_letter") == "u":
                result["jury_waiver"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

            # Class action waiver
            if "class action" in combined and "waiver" in combined or contract_row.get("nasaa_letter") == "v":
                result["class_action_waiver"] = {
                    "value": True,
                    "state": EvidenceState.PRESENT.value,
                    "provenance": tprov,
                }

    if contract_rows:
        result["contract_rows"] = {
            "value": contract_rows,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # --- TEXT fallback for fields not found in tables ---

    # Cure period
    cure_match = re.search(r'(\d+)\s*(?:day|calendar day|business day).*?(?:cure|remedy|correct)', text_lower)
    if not cure_match:
        cure_match = re.search(r'(?:cure|remedy|correct).*?(\d+)\s*(?:day|calendar day)', text_lower)
    if cure_match:
        result["cure_period_days"] = {
            "value": int(cure_match.group(1)),
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Cross-default
    if re.search(r'cross[- ]?default', text_lower):
        result["cross_default"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Spouse guaranty
    if re.search(r'spous(?:e|al).*(?:guarant|sign|execute|join|required)', text_lower):
        result["spouse_guaranty"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Personal guaranty
    if re.search(r'personal(?:ly)?\s+(?:guarant|liable|liabilit)', text_lower):
        result["personal_guaranty"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Mandatory remodel
    if re.search(r'(?:remodel|renovati|refurbish|upgrade).*?(?:requir|oblig|must|shall)', text_lower) or \
       re.search(r'(?:requir|oblig|must|shall).*?(?:remodel|renovati|refurbish|upgrade)', text_lower):
        result["mandatory_remodel"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Termination triggers from text
    triggers = []
    TRIGGER_PATTERNS = [
        (r'(?:terminat\w+|default).*?(?:bankrupt|insolv)', "bankruptcy"),
        (r'(?:terminat\w+|default).*?(?:non[- ]?payment|fail.*?pay)', "non_payment"),
        (r'(?:terminat\w+|default).*?(?:abandon|desert)', "abandonment"),
        (r'(?:terminat\w+|default).*?(?:conviction|felon)', "conviction"),
        (r'(?:terminat\w+|default).*?(?:misrepresent|fraud)', "misrepresentation"),
        (r'(?:terminat\w+|default).*?(?:health|safety|sanitation)', "health_safety"),
        (r'(?:terminat\w+|default).*?(?:transfer|assign).*?(?:without|unauthorized)', "unauthorized_transfer"),
        (r'(?:terminat\w+|default).*?(?:trademark|brand).*?(?:misuse|violat)', "trademark_misuse"),
        (r'(?:terminat\w+|default).*?(?:under[- ]?report|misstat)', "underreporting"),
        (r'(?:repeated|material).*?(?:breach|default|violat)', "repeated_breach"),
    ]
    for pattern, trigger_type in TRIGGER_PATTERNS:
        if re.search(pattern, text_lower, re.DOTALL):
            triggers.append(trigger_type)
    if triggers:
        result["termination_triggers"] = {
            "value": triggers,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Renewal from text (fallback for when table doesn't have clear row)
    if result.get("renewal_available", {}).get("state") != EvidenceState.PRESENT.value:
        no_renewal = re.search(
            r'(?:no\s+(?:contractual\s+)?(?:right|option)\s+to\s+(?:renew|extend)'
            r'|(?:not|no)\s+(?:right\s+to\s+)?(?:renew|renewal|extension)'
            r'|renewal\s+(?:is\s+)?not\s+(?:guaranteed|automatic))',
            text_lower
        )
        if no_renewal:
            result["renewal_available"] = {
                "value": False,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }
        elif re.search(r'(?:may|right\s+to)\s+(?:renew|extend)', text_lower):
            result["renewal_available"] = {
                "value": True,
                "state": EvidenceState.PRESENT.value,
                "provenance": prov_base,
            }

    # Indemnification
    if re.search(r'indemnif', text_lower):
        result["indemnification"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    # Confidentiality restrictions
    if re.search(r'confidential.*(?:restrict|prohibit|not\s+disclose)', text_lower):
        result["confidentiality_restrictions"] = {
            "value": True,
            "state": EvidenceState.PRESENT.value,
            "provenance": prov_base,
        }

    return result
