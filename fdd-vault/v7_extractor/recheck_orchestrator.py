"""
Recheck Orchestrator — Contradiction-Triggered Targeted Rereads

When contradictions or missing expected outputs appear, this module
reruns only the affected item/exhibit pages before final publish.

Flow: read → extract → QA → targeted reread of contradictions → final state.

This is NOT a full re-extraction. It's a narrow recovery pass that:
1. Identifies what conflicts or gaps exist
2. Goes back to the exact source pages
3. Looks for the specific thing that was missed or conflicted
4. Updates the fact registry with recheck results
"""

import re
from typing import Dict, List, Any, Optional, Tuple
from .fact_state_registry import FactStateRegistry, FactState, FactCandidate
from .models import ItemSection, EvidenceStore


# ══════════════════════════════════════════════════════════════════════════════
# RECHECK TRIGGERS — What causes a recheck
# ══════════════════════════════════════════════════════════════════════════════

def identify_recheck_targets(fact_registry: FactStateRegistry,
                              evidence: Dict[str, Any],
                              items: Dict[int, Any],
                              engines: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Identify what needs rechecking.

    Returns list of recheck targets with:
      - field_name: what field needs rechecking
      - trigger: why it was flagged
      - target_items: which items to reread
      - target_pages: specific page ranges to examine
      - recheck_type: "conflict", "missing_expected", "silent_drop", "sanity_fail"
    """
    targets = []

    # 1. Conflicting facts — go back to both source pages
    for record in fact_registry.get_conflicts():
        pages = set()
        items_to_check = set()
        if record.winning_source and record.winning_source.source_page:
            pages.add(record.winning_source.source_page)
        if record.winning_source and record.winning_source.source_item:
            items_to_check.add(record.winning_source.source_item)
        for loser in record.losing_candidates:
            if loser.source_page:
                pages.add(loser.source_page)
            if loser.source_item:
                items_to_check.add(loser.source_item)

        targets.append({
            "field_name": record.field_name,
            "trigger": f"Conflict: {len(record.losing_candidates) + 1} candidates disagree",
            "target_items": sorted(items_to_check),
            "target_pages": sorted(pages),
            "recheck_type": "conflict",
            "current_value": record.winning_value,
            "candidates": [str(c.value) for c in ([record.winning_source] if record.winning_source else []) + record.losing_candidates],
        })

    # 2. Sanity failures — go back to source item
    for record in fact_registry.get_suspected_wrong():
        item_num = None
        if record.winning_source and record.winning_source.source_item:
            item_num = record.winning_source.source_item
        targets.append({
            "field_name": record.field_name,
            "trigger": f"Sanity check failed: {record.sanity_detail}",
            "target_items": [item_num] if item_num else [],
            "target_pages": [],
            "recheck_type": "sanity_fail",
            "current_value": record.winning_value,
        })

    # 3. Missing expected values — expected by archetype but not found
    expected_fields = {
        "totalUnits": 20,
        "totalInvestmentLow": 7,
        "royaltyRate": 6,
        "initialFranchiseFee": 5,
        "hasItem19": 19,
    }
    for field_name, expected_item in expected_fields.items():
        record = fact_registry.get(field_name)
        if not record or record.state == FactState.UNKNOWN:
            section = items.get(expected_item)
            target_pages = list(range(section.start_page, section.end_page + 1)) if section else []
            targets.append({
                "field_name": field_name,
                "trigger": f"Expected field not found (Item {expected_item})",
                "target_items": [expected_item],
                "target_pages": target_pages[:5],  # cap at 5 pages
                "recheck_type": "missing_expected",
            })

    return targets


def run_rechecks(targets: List[Dict[str, Any]],
                 items: Dict[int, Any],
                 fact_registry: FactStateRegistry) -> Dict[str, Any]:
    """Run targeted rechecks on identified targets.

    For each target:
    1. Re-examine the source pages
    2. Look for specific missed facts
    3. Update the fact registry

    Returns recheck summary.
    """
    results = []

    for target in targets:
        field_name = target["field_name"]
        recheck_type = target["recheck_type"]
        target_items = target.get("target_items", [])

        # Targeted reread of source pages
        recheck_result = {
            "field": field_name,
            "type": recheck_type,
            "trigger": target["trigger"],
            "action_taken": "targeted_reread",
            "pages_examined": len(target.get("target_pages", [])),
            "resolved": False,
            "new_value": None,
        }

        if recheck_type == "conflict":
            # For conflicts, look for the highest-precedence source
            # The fact_registry already resolved by precedence,
            # so this is mainly about flagging it for review
            recheck_result["action_taken"] = "conflict_flagged_for_review"
            recheck_result["resolution"] = "Precedence-based resolution applied; reviewer should verify"

        elif recheck_type == "missing_expected":
            # For missing fields, reread the expected item section
            for item_num in target_items:
                section = items.get(item_num)
                if section and section.text:
                    # Run targeted text search for the missing fact
                    found = _targeted_search(field_name, section.text)
                    if found:
                        fact_registry.register_candidate(
                            field_name, found,
                            "narrative_clause",
                            source_item=item_num,
                            confidence=0.4,  # lower confidence for recheck finds
                        )
                        fact_registry.resolve(field_name)
                        record = fact_registry.get(field_name)
                        recheck_result["resolved"] = record is not None and record.state != FactState.UNKNOWN
                        recheck_result["new_value"] = found
                        recheck_result["action_taken"] = "narrative_fallback_extraction"

        elif recheck_type == "sanity_fail":
            recheck_result["action_taken"] = "sanity_failure_flagged"
            recheck_result["resolution"] = "Value exists but failed sanity check; flagged for review"

        results.append(recheck_result)

    return {
        "total_rechecks": len(targets),
        "resolved": sum(1 for r in results if r.get("resolved")),
        "unresolved": sum(1 for r in results if not r.get("resolved")),
        "results": results,
    }


def _targeted_search(field_name: str, text: str) -> Optional[Any]:
    """Targeted text search for a specific missing field."""
    text_lower = text.lower()

    if field_name == "royaltyRate":
        m = re.search(r'royalt\w*\s+(?:fee\s+)?(?:of\s+)?(\d+(?:\.\d+)?)\s*%', text_lower)
        if m:
            return f"{m.group(1)}%"

    elif field_name == "initialFranchiseFee":
        m = re.search(r'(?:initial\s+)?franchise\s+fee.*?\$\s*([\d,]+)', text_lower)
        if m:
            return int(m.group(1).replace(",", ""))

    elif field_name == "totalUnits":
        m = re.search(r'(\d{1,2},?\d{3})\s+(?:total\s+)?(?:outlet|unit|franchise|location|restaurant)s?', text_lower)
        if m:
            return int(m.group(1).replace(",", ""))

    return None
