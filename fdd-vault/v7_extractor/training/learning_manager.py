"""
Learning Manager — Persistent Learning Writeback and Readback

Coordinates what the extractor learns from each brand run.
After every run, writes lessons into persistent stores.
Before each new brand, loads accumulated knowledge.

Four layers of memory:
  A. Runtime — used during one document run (brand memory, ledger, fact store)
  B. Persistent — written after each brand, reused on later brands (rulebooks)
  C. Brand-specific — what this exact brand taught (quirks, patterns)
  D. Cross-brand — what generalizes (TOC grammars, table schemas, clause patterns)
"""

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime


LEARNING_DIR = os.path.join(os.path.dirname(__file__), "learned")


def _ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def _load_json(path: str, default=None):
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return default if default is not None else {}


def _save_json(path: str, data):
    _ensure_dir(os.path.dirname(path))
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)


# ══════════════════════════════════════════════════════════════════════════════
# STRUCTURAL RULEBOOK — cross-brand structure patterns
# ══════════════════════════════════════════════════════════════════════════════

def load_structural_rules() -> Dict[str, Any]:
    """Load the structural rulebook (TOC grammars, offset patterns, etc.)."""
    return _load_json(os.path.join(LEARNING_DIR, "structural_rulebook.json"), {
        "toc_grammars": [],
        "exhibit_grammars": [],
        "offset_patterns": [],
        "shared_page_rules": [],
        "table_continuation_rules": [],
    })


def save_structural_lesson(lesson: Dict[str, Any]) -> None:
    """Add a structural lesson to the rulebook."""
    rules = load_structural_rules()
    category = lesson.get("category", "general")
    if category not in rules:
        rules[category] = []
    # Deduplicate by rule text
    existing = {r.get("rule", "") for r in rules[category]}
    if lesson.get("rule", "") not in existing:
        lesson["learned_date"] = datetime.now().isoformat()
        rules[category].append(lesson)
        _save_json(os.path.join(LEARNING_DIR, "structural_rulebook.json"), rules)


# ══════════════════════════════════════════════════════════════════════════════
# LANE A TRAINING MEMORY — important-fact patterns from reader pass
# ══════════════════════════════════════════════════════════════════════════════

def load_lane_a_memory() -> Dict[str, Any]:
    """Load Lane A training memory."""
    return _load_json(os.path.join(LEARNING_DIR, "lane_a_memory.json"), {
        "fact_patterns": [],
        "important_clause_types": [],
        "false_positive_patterns": [],
        "brand_count": 0,
    })


def save_lane_a_lessons(brand: str, archetype: str,
                        facts: List[Dict], misses: List[Dict]) -> None:
    """Write Lane A lessons from a brand run."""
    memory = load_lane_a_memory()
    entry = {
        "brand": brand,
        "archetype": archetype,
        "learned_date": datetime.now().isoformat(),
        "facts_captured": len(facts),
        "fact_types": list(set(f.get("fact_category", "other") for f in facts)),
        "top_facts": [{"text": f.get("fact_text", "")[:200],
                       "importance": f.get("importance_score", 0),
                       "category": f.get("fact_category", "other")}
                      for f in sorted(facts, key=lambda x: x.get("importance_score", 0), reverse=True)[:10]],
        "a_only_count": len([m for m in misses if m.get("type") == "A_only"]),
    }
    memory["fact_patterns"].append(entry)
    memory["brand_count"] = len(memory["fact_patterns"])
    _save_json(os.path.join(LEARNING_DIR, "lane_a_memory.json"), memory)


# ══════════════════════════════════════════════════════════════════════════════
# LANE B TRAINING MEMORY — normalization lessons
# ══════════════════════════════════════════════════════════════════════════════

def load_lane_b_memory() -> Dict[str, Any]:
    """Load Lane B training memory."""
    return _load_json(os.path.join(LEARNING_DIR, "lane_b_memory.json"), {
        "field_lessons": {},
        "failed_normalizations": [],
        "brand_count": 0,
    })


def save_lane_b_lessons(brand: str, evidence: Dict,
                        engines: Dict, misses: List[Dict]) -> None:
    """Write Lane B lessons from a brand run."""
    memory = load_lane_b_memory()

    fields_normalized = [k for k, v in evidence.items()
                         if isinstance(v, dict) and v.get("state") == "present"]
    fields_missed = [m.get("field", "") for m in misses if m.get("lane") == "B"]

    entry = {
        "brand": brand,
        "learned_date": datetime.now().isoformat(),
        "fields_normalized": fields_normalized,
        "fields_missed": fields_missed,
    }

    for field in fields_normalized:
        if field not in memory["field_lessons"]:
            memory["field_lessons"][field] = {"success_count": 0, "fail_count": 0, "brands": []}
        memory["field_lessons"][field]["success_count"] += 1
        memory["field_lessons"][field]["brands"].append(brand)

    for field in fields_missed:
        if field not in memory["field_lessons"]:
            memory["field_lessons"][field] = {"success_count": 0, "fail_count": 0, "brands": []}
        memory["field_lessons"][field]["fail_count"] += 1

    memory["failed_normalizations"].append(entry)
    memory["brand_count"] += 1
    _save_json(os.path.join(LEARNING_DIR, "lane_b_memory.json"), memory)


# ══════════════════════════════════════════════════════════════════════════════
# RECONCILIATION HISTORY
# ══════════════════════════════════════════════════════════════════════════════

def load_reconciliation_history() -> List[Dict]:
    """Load reconciliation history."""
    return _load_json(os.path.join(LEARNING_DIR, "reconciliation_history.json"), [])


def save_reconciliation(brand: str, recon: Dict) -> None:
    """Write reconciliation results from a brand run."""
    history = load_reconciliation_history()
    history.append({
        "brand": brand,
        "date": datetime.now().isoformat(),
        "aligned": recon.get("aligned_count", 0),
        "a_only": recon.get("discovery_only_count", 0),
        "b_only": recon.get("engine_only_count", 0),
        "material_disagreement": recon.get("material_disagreement", False),
    })
    _save_json(os.path.join(LEARNING_DIR, "reconciliation_history.json"), history)


# ══════════════════════════════════════════════════════════════════════════════
# NEGATIVE MEMORY — what NOT to trust
# ══════════════════════════════════════════════════════════════════════════════

def load_negative_memory() -> List[Dict]:
    """Load negative memory (false positives, traps)."""
    return _load_json(os.path.join(LEARNING_DIR, "negative_memory.json"), [])


def save_negative_lesson(lesson: Dict[str, Any]) -> None:
    """Store a negative lesson — something the extractor should NOT trust."""
    memory = load_negative_memory()
    lesson["learned_date"] = datetime.now().isoformat()
    memory.append(lesson)
    _save_json(os.path.join(LEARNING_DIR, "negative_memory.json"), memory)


# ══════════════════════════════════════════════════════════════════════════════
# LEARNING REPORT — end-of-run summary
# ══════════════════════════════════════════════════════════════════════════════

def generate_learning_report(brand: str,
                              extraction_result: Dict,
                              gold_comparison: Optional[Dict] = None) -> Dict[str, Any]:
    """Generate the end-of-run learning report.

    Hard rule: No brand run is finished unless a learning report is written.
    """
    report = {
        "brand": brand,
        "date": datetime.now().isoformat(),
        "extractor_version": "killbill-1.2",
    }

    # Structural learning
    roadmap = extraction_result.get("roadmap_validation", {})
    report["structural"] = {
        "toc_grammar": roadmap.get("toc_status"),
        "exhibit_grammar": roadmap.get("exhibit_list_status"),
        "offset": roadmap.get("page_offset"),
        "trust": roadmap.get("segmentation_trust"),
        "warnings": roadmap.get("warnings", []),
    }

    # Lane A learning
    reader = extraction_result.get("reader_discovery", {})
    facts = reader.get("fact_store", {})
    report["lane_a"] = {
        "facts_captured": facts.get("total_facts", 0),
        "uncaptured": facts.get("uncaptured", 0),
        "ledger_resolved": reader.get("ledger", {}).get("resolved", 0),
        "exhibits_consumed": extraction_result.get("lane_contributions", {}).get("lane_A", {}).get("exhibits_consumed", 0),
    }

    # Lane B learning
    evidence = extraction_result.get("evidence", {})
    fields_present = [k for k, v in evidence.items()
                      if isinstance(v, dict) and v.get("state") == "present"]
    report["lane_b"] = {
        "fields_normalized": len(fields_present),
        "fields": fields_present,
        "engines_populated": extraction_result.get("lane_contributions", {}).get("lane_B", {}).get("engines_populated", 0),
    }

    # Reconciliation
    recon = extraction_result.get("reconciliation", {})
    report["reconciliation"] = {
        "aligned": recon.get("aligned_count", 0),
        "a_only": recon.get("discovery_only_count", 0),
        "b_only": recon.get("engine_only_count", 0),
        "material_disagreement": recon.get("material_disagreement", False),
    }

    # Gold comparison
    if gold_comparison:
        report["gold"] = gold_comparison

    # Gaps
    gaps = extraction_result.get("lane_contributions", {}).get("gaps", {})
    report["gaps"] = gaps

    # Consumption
    consumption = extraction_result.get("consumption_summary", {})
    report["consumption"] = {
        "total_required": consumption.get("total_required", 0),
        "unconsumed": consumption.get("unconsumed_count", 0),
        "publish_blocked": consumption.get("publish_blocked", False),
    }

    return report


def write_full_learning(brand: str,
                         extraction_result: Dict,
                         gold_comparison: Optional[Dict] = None) -> Dict[str, Any]:
    """Write ALL learning from a brand run — the main entry point.

    Hard rules:
    1. No brand run is finished unless a learning report is written.
    2. No important Lane A fact may silently disappear.
    3. Every conflict must be stored in reconciliation history.
    """
    report = generate_learning_report(brand, extraction_result, gold_comparison)

    # Save learning report
    _save_json(os.path.join(LEARNING_DIR, "reports", f"{brand}_learning.json"), report)

    # Save structural lessons from roadmap
    roadmap = extraction_result.get("roadmap_validation", {})
    if roadmap.get("warnings"):
        for warning in roadmap["warnings"]:
            save_structural_lesson({
                "category": "structural",
                "brand": brand,
                "rule": warning,
                "scope": "cross_brand",
                "confidence": "medium",
            })

    # Save reconciliation
    recon = extraction_result.get("reconciliation", {})
    save_reconciliation(brand, recon)

    # Save Lane A facts
    reader = extraction_result.get("reader_discovery", {})
    fact_list = reader.get("fact_store", {}).get("facts", [])
    if isinstance(fact_list, list):
        save_lane_a_lessons(brand,
                            extraction_result.get("archetype", {}).get("archetype", "unknown"),
                            fact_list, [])

    # Save Lane B evidence
    save_lane_b_lessons(brand,
                        extraction_result.get("evidence", {}),
                        extraction_result.get("engines", {}),
                        [])

    # Save negative lessons from misses
    if gold_comparison and gold_comparison.get("total_misses", 0) > 0:
        miss_report_path = os.path.join(os.path.dirname(__file__),
                                        "miss_reports", f"{brand}_miss_report.json")
        if os.path.exists(miss_report_path):
            misses = _load_json(miss_report_path, {}).get("misses", [])
            for miss in misses:
                if miss.get("generalizable_rule"):
                    save_structural_lesson({
                        "category": miss.get("miss_class", "general"),
                        "brand": brand,
                        "rule": miss["generalizable_rule"],
                        "scope": "cross_brand" if not miss.get("is_brand_patch") else "brand",
                        "confidence": "high" if miss.get("severity") == "fatal" else "medium",
                    })

    return report
