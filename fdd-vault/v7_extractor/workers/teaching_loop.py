"""
Phase D: Teaching Loop

For every gold-standard FDD:
  1. Run all 32 workers
  2. Compare against manual gold
  3. Compare source-consumption coverage
  4. Write lessons into structural rulebook and worker-specific memory
  5. Patch only the failing worker or cross-cutting specialist

Gold teaching protocol mirrors the 5-pass manual reading:
  Pass 1: Front matter and structural map
  Pass 2: Economics core (Items 5, 6, 7, 8)
  Pass 3: Operations and territory (Items 10, 11, 12, 15, 16)
  Pass 4: Legal and contract burden (Items 3, 4, 17, 18 + agreements)
  Pass 5: Performance, system health, financials (Items 19, 20, 21, 22, 23)
"""

import json
import os
from typing import Any, Dict, List, Optional
from datetime import datetime


class WorkerMemory:
    """Per-worker learning memory.

    Each worker accumulates lessons about what it gets right and wrong
    across gold-standard brands. This is not a generic memory —
    it's targeted learning for extraction improvement.
    """

    def __init__(self, worker_id: str, memory_dir: str):
        self.worker_id = worker_id
        self.memory_dir = memory_dir
        self.memory_path = os.path.join(memory_dir, f"{worker_id}_memory.json")
        self.memory = self._load()

    def _load(self) -> Dict:
        if os.path.exists(self.memory_path):
            with open(self.memory_path, "r") as f:
                return json.load(f)
        return {
            "worker_id": self.worker_id,
            "brands_seen": [],
            "total_hits": 0,
            "total_misses": 0,
            "miss_patterns": {},
            "hit_patterns": {},
            "lessons": [],
        }

    def save(self):
        os.makedirs(self.memory_dir, exist_ok=True)
        with open(self.memory_path, "w") as f:
            json.dump(self.memory, f, indent=2)

    def record_hit(self, brand: str, fact_type: str, detail: str = ""):
        self.memory["total_hits"] += 1
        if fact_type not in self.memory["hit_patterns"]:
            self.memory["hit_patterns"][fact_type] = 0
        self.memory["hit_patterns"][fact_type] += 1

    def record_miss(self, brand: str, fact_type: str,
                    gold_value: Any, actual_value: Any,
                    miss_class: str = "MODERATE"):
        self.memory["total_misses"] += 1
        if fact_type not in self.memory["miss_patterns"]:
            self.memory["miss_patterns"][fact_type] = []
        self.memory["miss_patterns"][fact_type].append({
            "brand": brand,
            "gold": str(gold_value)[:100],
            "actual": str(actual_value)[:100],
            "class": miss_class,
            "date": datetime.now().isoformat()[:10],
        })

    def add_lesson(self, lesson: str, brand: str, severity: str = "info"):
        self.memory["lessons"].append({
            "lesson": lesson,
            "brand": brand,
            "severity": severity,
            "date": datetime.now().isoformat()[:10],
        })
        # Cap lessons at 100
        if len(self.memory["lessons"]) > 100:
            self.memory["lessons"] = self.memory["lessons"][-100:]

    def record_brand(self, brand: str):
        if brand not in self.memory["brands_seen"]:
            self.memory["brands_seen"].append(brand)

    def get_accuracy(self) -> float:
        total = self.memory["total_hits"] + self.memory["total_misses"]
        if total == 0:
            return 0.0
        return self.memory["total_hits"] / total

    def get_worst_fact_types(self, n: int = 5) -> List[Dict]:
        """Get the fact types with the most misses."""
        miss_counts = {ft: len(misses) for ft, misses in self.memory["miss_patterns"].items()}
        sorted_types = sorted(miss_counts.items(), key=lambda x: -x[1])
        return [{"fact_type": ft, "miss_count": count} for ft, count in sorted_types[:n]]

    def summary(self) -> Dict:
        return {
            "worker_id": self.worker_id,
            "brands_seen": len(self.memory["brands_seen"]),
            "accuracy": round(self.get_accuracy() * 100, 1),
            "total_hits": self.memory["total_hits"],
            "total_misses": self.memory["total_misses"],
            "worst_fact_types": self.get_worst_fact_types(),
            "lesson_count": len(self.memory["lessons"]),
        }


class StructuralRulebook:
    """Global extraction rules learned from gold comparisons.

    These rules apply across all workers and all brands.
    They are learned by analyzing patterns in gold misses.
    """

    def __init__(self, rulebook_dir: str):
        self.rulebook_dir = rulebook_dir
        self.rulebook_path = os.path.join(rulebook_dir, "structural_rulebook.json")
        self.rules = self._load()

    def _load(self) -> Dict:
        if os.path.exists(self.rulebook_path):
            with open(self.rulebook_path, "r") as f:
                return json.load(f)
        return {
            "version": "1.0",
            "rules": [],
            "table_rules": [],
            "exhibit_rules": [],
            "territory_rules": [],
            "fee_rules": [],
            "year_rules": [],
        }

    def save(self):
        os.makedirs(self.rulebook_dir, exist_ok=True)
        with open(self.rulebook_path, "w") as f:
            json.dump(self.rules, f, indent=2)

    def add_rule(self, category: str, rule: str, source_brand: str,
                 evidence: str = ""):
        entry = {
            "rule": rule,
            "source_brand": source_brand,
            "evidence": evidence[:200],
            "date": datetime.now().isoformat()[:10],
        }
        key = f"{category}_rules"
        if key not in self.rules:
            self.rules[key] = []
        # Avoid duplicates
        existing_rules = [r["rule"] for r in self.rules[key]]
        if rule not in existing_rules:
            self.rules[key].append(entry)

    def get_rules(self, category: str) -> List[Dict]:
        return self.rules.get(f"{category}_rules", [])

    def summary(self) -> Dict:
        return {
            "version": self.rules["version"],
            "total_rules": sum(len(v) for k, v in self.rules.items() if k.endswith("_rules")),
            "by_category": {k: len(v) for k, v in self.rules.items() if k.endswith("_rules") and v},
        }


class TeachingLoop:
    """Runs the gold comparison loop across all 32 workers.

    For each gold-standard brand:
      1. Load the gold JSONL
      2. Load the worker extraction output
      3. Compare field by field
      4. Write lessons to per-worker memory and structural rulebook
      5. Generate a teaching report
    """

    def __init__(self, gold_dir: str, memory_dir: str):
        self.gold_dir = gold_dir
        self.memory_dir = memory_dir
        self.worker_memories: Dict[str, WorkerMemory] = {}
        self.rulebook = StructuralRulebook(memory_dir)

    def get_worker_memory(self, worker_id: str) -> WorkerMemory:
        if worker_id not in self.worker_memories:
            self.worker_memories[worker_id] = WorkerMemory(
                worker_id, self.memory_dir
            )
        return self.worker_memories[worker_id]

    def load_gold(self, brand_slug: str) -> List[Dict]:
        """Load gold JSONL for a brand."""
        gold_path = os.path.join(self.gold_dir, brand_slug, "normalized_gold.jsonl")
        if not os.path.exists(gold_path):
            return []
        facts = []
        with open(gold_path, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        facts.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
        return facts

    def run_comparison(self, brand_slug: str,
                       orchestrator_result: Dict) -> Dict[str, Any]:
        """Compare orchestrator output against gold standard.

        Returns a teaching report with per-worker scores and lessons.
        """
        gold_facts = self.load_gold(brand_slug)
        if not gold_facts:
            return {"error": f"No gold found for {brand_slug}"}

        # ── Patch C: Canonical-first scoring ──
        # Score against canonical objects, not raw worker fact types.
        # Precedence:
        #   1. V7 canonical export (the real scoring truth layer)
        #   2. Gold alias bridge (gold field name → canonical field)
        #   3. Worker fact types as fallback

        # Index gold by field name
        gold_by_field: Dict[str, Dict] = {}
        for gf in gold_facts:
            field = gf.get("field", "")
            if field:
                gold_by_field[field] = gf

        # Build the extracted fields map — canonical first
        extracted_fields: Dict[str, Dict] = {}

        # Layer 1: V7 brand/canonical export (highest precedence)
        v7_brand = orchestrator_result.get("v7_brand", {})
        for k, v in v7_brand.items():
            if v is not None and not isinstance(v, dict):
                extracted_fields[k] = {"value": v, "worker": "v7_canonical"}

        # Layer 1b: V7 engine sub-objects
        for engine_key in ("item17", "item19", "item21"):
            engine_data = v7_brand.get(engine_key, {})
            if isinstance(engine_data, dict):
                for ek, ev in engine_data.items():
                    if ev is not None and ek not in extracted_fields:
                        extracted_fields[ek] = {"value": ev, "worker": f"v7_{engine_key}"}

        # Layer 2: Build reverse alias map (gold field → canonical field)
        # Use V7's canonical_export FIELD_REGISTRY gold_aliases
        try:
            from ..canonical_export import FIELD_REGISTRY
            gold_alias_map = {}
            for canonical_name, spec in FIELD_REGISTRY.items():
                for alias in spec.get("gold_aliases", []):
                    gold_alias_map[alias] = canonical_name
                # Also map canonical name to itself
                gold_alias_map[canonical_name] = canonical_name
        except ImportError:
            gold_alias_map = {}

        # Layer 3: Worker fact packets as fallback
        fact_packets = orchestrator_result.get("fact_store", [])
        if isinstance(fact_packets, list):
            worker_fields = self._flatten_packets(fact_packets)
            for k, v in worker_fields.items():
                if k not in extracted_fields:
                    extracted_fields[k] = v

        # Compare — canonical-first with alias resolution
        hits = []
        misses = []
        extras = []

        for field, gold_entry in gold_by_field.items():
            gold_value = gold_entry.get("value")

            # Try to find the extracted value through multiple paths
            actual = None

            # Path 1: Direct field name match
            if field in extracted_fields:
                actual = extracted_fields[field]

            # Path 2: Gold alias → canonical field name
            if actual is None and field in gold_alias_map:
                canonical = gold_alias_map[field]
                if canonical in extracted_fields:
                    actual = extracted_fields[canonical]

            # Path 3: Reverse — canonical name might be in extracted
            if actual is None:
                for canonical_name, spec in (FIELD_REGISTRY.items() if 'FIELD_REGISTRY' in dir() else []):
                    if field in spec.get("gold_aliases", []):
                        if canonical_name in extracted_fields:
                            actual = extracted_fields[canonical_name]
                            break

            if actual is not None:
                if self._values_match(gold_value, actual.get("value")):
                    hits.append({
                        "field": field,
                        "family": gold_entry.get("family", ""),
                        "worker": actual.get("worker", ""),
                    })
                else:
                    misses.append({
                        "field": field,
                        "family": gold_entry.get("family", ""),
                        "gold_value": gold_value,
                        "actual_value": actual.get("value"),
                        "worker": actual.get("worker", ""),
                        "source_item": gold_entry.get("source_item"),
                    })
            else:
                misses.append({
                    "field": field,
                    "family": gold_entry.get("family", ""),
                    "gold_value": gold_value,
                    "actual_value": None,
                    "worker": "none",
                    "source_item": gold_entry.get("source_item"),
                    "miss_type": "not_extracted",
                })

        # Extra fields not in gold
        for field in extracted_fields:
            if field not in gold_by_field:
                extras.append({"field": field})

        # ── Record lessons in worker memories ──
        for hit in hits:
            wid = hit.get("worker", "unknown")
            mem = self.get_worker_memory(wid)
            mem.record_hit(brand_slug, hit["field"])
            mem.record_brand(brand_slug)

        for miss in misses:
            wid = miss.get("worker", "unknown")
            mem = self.get_worker_memory(wid)
            severity = "FATAL" if miss.get("family") in ("economics", "performance") else "MAJOR"
            mem.record_miss(
                brand_slug, miss["field"],
                miss["gold_value"], miss["actual_value"],
                miss_class=severity,
            )
            mem.record_brand(brand_slug)

            # Add structural rules for systematic misses
            if miss.get("miss_type") == "not_extracted":
                self.rulebook.add_rule(
                    miss.get("family", "general"),
                    f"Field '{miss['field']}' must be extracted from Item {miss.get('source_item', '?')}",
                    brand_slug,
                    f"Gold value: {str(miss['gold_value'])[:100]}",
                )

        # ── Save all memories ──
        for mem in self.worker_memories.values():
            mem.save()
        self.rulebook.save()

        # ── Build report ──
        total = len(hits) + len(misses)
        score = len(hits) / max(total, 1)

        # Per-family breakdown
        family_scores = {}
        for h in hits:
            fam = h.get("family", "other")
            if fam not in family_scores:
                family_scores[fam] = {"hits": 0, "misses": 0}
            family_scores[fam]["hits"] += 1
        for m in misses:
            fam = m.get("family", "other")
            if fam not in family_scores:
                family_scores[fam] = {"hits": 0, "misses": 0}
            family_scores[fam]["misses"] += 1

        # Per-worker breakdown
        worker_scores = {}
        for h in hits:
            wid = h.get("worker", "unknown")
            if wid not in worker_scores:
                worker_scores[wid] = {"hits": 0, "misses": 0}
            worker_scores[wid]["hits"] += 1
        for m in misses:
            wid = m.get("worker", "unknown")
            if wid not in worker_scores:
                worker_scores[wid] = {"hits": 0, "misses": 0}
            worker_scores[wid]["misses"] += 1

        return {
            "brand": brand_slug,
            "gold_facts": len(gold_facts),
            "extracted_fields": len(extracted_fields),
            "hits": len(hits),
            "misses": len(misses),
            "extras": len(extras),
            "score": round(score * 100, 1),
            "family_scores": {
                fam: round(s["hits"] / max(s["hits"] + s["misses"], 1) * 100, 1)
                for fam, s in family_scores.items()
            },
            "worker_scores": {
                wid: round(s["hits"] / max(s["hits"] + s["misses"], 1) * 100, 1)
                for wid, s in worker_scores.items()
            },
            "top_misses": misses[:20],
            "structural_rules_added": self.rulebook.summary()["total_rules"],
        }

    def _flatten_packets(self, packets: List) -> Dict[str, Dict]:
        """Flatten fact packets into field → value mapping."""
        fields = {}
        for p in packets:
            if isinstance(p, dict):
                ft = p.get("fact_type", "")
                payload = p.get("fact_payload", {})
                worker = p.get("emitted_by", "")

                if isinstance(payload, dict):
                    # Direct value
                    if "value" in payload:
                        fields[ft] = {"value": payload["value"], "worker": worker}
                    # Or the payload itself is the value
                    elif ft and ft not in fields:
                        fields[ft] = {"value": payload, "worker": worker}
        return fields

    def _values_match(self, gold_value: Any, actual_value: Any) -> bool:
        """Compare gold and actual values with tolerance."""
        if gold_value is None or actual_value is None:
            return gold_value == actual_value

        # String comparison (case-insensitive, whitespace-normalized)
        gold_str = str(gold_value).strip().lower()
        actual_str = str(actual_value).strip().lower()

        if gold_str == actual_str:
            return True

        # Numeric comparison with tolerance
        try:
            gold_num = float(str(gold_value).replace(",", "").replace("$", "").replace("%", ""))
            actual_num = float(str(actual_value).replace(",", "").replace("$", "").replace("%", ""))
            if gold_num == 0:
                return actual_num == 0
            return abs(gold_num - actual_num) / abs(gold_num) < 0.05  # 5% tolerance
        except (ValueError, TypeError):
            pass

        # Boolean comparison
        if isinstance(gold_value, bool) or isinstance(actual_value, bool):
            return bool(gold_value) == bool(actual_value)

        # Substring match for longer strings
        if len(gold_str) > 10 and len(actual_str) > 10:
            if gold_str in actual_str or actual_str in gold_str:
                return True

        return False

    def run_all_brands(self, orchestrator_results: Dict[str, Dict]) -> Dict:
        """Run teaching loop across all gold brands.

        Args:
            orchestrator_results: brand_slug → orchestrator result dict
        """
        brand_reports = {}
        total_score = 0
        brands_run = 0

        # Find all gold brands
        gold_brands = []
        if os.path.exists(self.gold_dir):
            for entry in os.listdir(self.gold_dir):
                gold_path = os.path.join(self.gold_dir, entry, "normalized_gold.jsonl")
                if os.path.exists(gold_path):
                    gold_brands.append(entry)

        for brand in gold_brands:
            if brand in orchestrator_results:
                report = self.run_comparison(brand, orchestrator_results[brand])
                brand_reports[brand] = report
                total_score += report.get("score", 0)
                brands_run += 1

        avg_score = total_score / max(brands_run, 1)

        # ── Worker accuracy report ──
        worker_summaries = {}
        for wid, mem in self.worker_memories.items():
            worker_summaries[wid] = mem.summary()

        return {
            "brands_run": brands_run,
            "gold_brands_available": len(gold_brands),
            "average_score": round(avg_score, 1),
            "brand_reports": brand_reports,
            "worker_summaries": worker_summaries,
            "structural_rulebook": self.rulebook.summary(),
        }
