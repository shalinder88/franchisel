"""
Teaching Loop — Gold comparison + worker memory + structural rulebook.

Scores against ALL gold facts, not just top-level canonical fields.
Gold facts have: field, value, path, family.
Matching priority: path.field > field > alias > V7 sub-object key.
"""

import json
import os
from typing import Any, Dict, List, Optional
from datetime import datetime


class WorkerMemory:
    """Per-worker learning memory."""

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
        if len(self.memory["lessons"]) > 100:
            self.memory["lessons"] = self.memory["lessons"][-100:]

    def record_brand(self, brand: str):
        if brand not in self.memory["brands_seen"]:
            self.memory["brands_seen"].append(brand)

    def get_accuracy(self) -> float:
        total = self.memory["total_hits"] + self.memory["total_misses"]
        return self.memory["total_hits"] / total if total else 0.0

    def get_worst_fact_types(self, n: int = 5) -> List[Dict]:
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
    """Global extraction rules learned from gold comparisons."""

    def __init__(self, rulebook_dir: str):
        self.rulebook_dir = rulebook_dir
        self.rulebook_path = os.path.join(rulebook_dir, "structural_rulebook.json")
        self.rules = self._load()

    def _load(self) -> Dict:
        if os.path.exists(self.rulebook_path):
            with open(self.rulebook_path, "r") as f:
                return json.load(f)
        return {"version": "1.0", "rules": []}

    def save(self):
        os.makedirs(self.rulebook_dir, exist_ok=True)
        with open(self.rulebook_path, "w") as f:
            json.dump(self.rules, f, indent=2)

    def add_rule(self, category: str, rule: str, source_brand: str,
                 evidence: str = ""):
        key = f"{category}_rules"
        if key not in self.rules:
            self.rules[key] = []
        existing = [r["rule"] for r in self.rules[key]]
        if rule not in existing:
            self.rules[key].append({
                "rule": rule, "source_brand": source_brand,
                "evidence": evidence[:200],
                "date": datetime.now().isoformat()[:10],
            })

    def summary(self) -> Dict:
        return {
            "version": self.rules["version"],
            "total_rules": sum(len(v) for k, v in self.rules.items() if k.endswith("_rules")),
        }


class TeachingLoop:
    """Scores against ALL gold facts — every field, every path, every tier."""

    def __init__(self, gold_dir: str, memory_dir: str):
        self.gold_dir = gold_dir
        self.memory_dir = memory_dir
        self.worker_memories: Dict[str, WorkerMemory] = {}
        self.rulebook = StructuralRulebook(memory_dir)

    def get_worker_memory(self, worker_id: str) -> WorkerMemory:
        if worker_id not in self.worker_memories:
            self.worker_memories[worker_id] = WorkerMemory(worker_id, self.memory_dir)
        return self.worker_memories[worker_id]

    def load_gold(self, brand_slug: str) -> List[Dict]:
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
        """Score against ALL gold facts — every path, every tier, every field."""
        gold_facts = self.load_gold(brand_slug)
        if not gold_facts:
            return {"error": f"No gold found for {brand_slug}"}

        # ── Build master extracted index ──
        extracted = self._build_extracted_index(orchestrator_result)

        # ── Compare EVERY gold fact ──
        hits = []
        misses = []

        for gf in gold_facts:
            field = gf.get("field", "")
            gold_value = gf.get("value")
            gold_path = gf.get("path", "")
            family = gf.get("family", "")

            if gold_value is None:
                continue

            actual = self._find_match(field, gold_path, family, extracted)

            if actual is not None:
                if self._values_match(gold_value, actual.get("value")):
                    hits.append({
                        "field": field, "path": gold_path,
                        "family": family, "worker": actual.get("worker", ""),
                    })
                else:
                    misses.append({
                        "field": field, "path": gold_path,
                        "family": family,
                        "gold_value": gold_value,
                        "actual_value": actual.get("value"),
                        "worker": actual.get("worker", ""),
                        "source_item": gf.get("source_item"),
                    })
            else:
                misses.append({
                    "field": field, "path": gold_path,
                    "family": family,
                    "gold_value": gold_value,
                    "actual_value": None,
                    "worker": "none",
                    "source_item": gf.get("source_item"),
                    "miss_type": "not_extracted",
                })

        # ── Record lessons ──
        for hit in hits:
            wid = hit.get("worker", "unknown")
            self.get_worker_memory(wid).record_hit(brand_slug, hit["field"])
            self.get_worker_memory(wid).record_brand(brand_slug)

        for miss in misses:
            wid = miss.get("worker", "unknown")
            mem = self.get_worker_memory(wid)
            severity = "FATAL" if miss.get("family") in ("item19_performance", "financials", "investment") else "MAJOR"
            mem.record_miss(brand_slug, miss["field"], miss["gold_value"],
                           miss["actual_value"], miss_class=severity)
            mem.record_brand(brand_slug)

        # Save
        for mem in self.worker_memories.values():
            mem.save()
        self.rulebook.save()

        # ── Build report ──
        total = len(hits) + len(misses)
        score = len(hits) / max(total, 1)

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
            "extracted_fields": len(extracted),
            "hits": len(hits),
            "misses": len(misses),
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

    def _build_extracted_index(self, result: Dict) -> Dict[str, Dict]:
        """Build master index of all extracted values, keyed by every addressable name."""
        extracted: Dict[str, Dict] = {}

        # Layer 1: V7 brand flat fields + sub-objects
        v7_brand = result.get("v7_brand", {})
        for k, v in v7_brand.items():
            if v is None:
                continue
            if isinstance(v, dict):
                for sk, sv in v.items():
                    if sv is not None:
                        extracted[sk] = {"value": sv, "worker": f"v7_{k}"}
                        extracted[f"{k}.{sk}"] = {"value": sv, "worker": f"v7_{k}"}
            else:
                extracted[k] = {"value": v, "worker": "v7_canonical"}

        # Layer 2: Gold aliases from canonical export
        try:
            from ..canonical_export import FIELD_REGISTRY
            for cn, spec in FIELD_REGISTRY.items():
                if cn in extracted:
                    for alias in spec.get("gold_aliases", []):
                        if alias not in extracted:
                            extracted[alias] = extracted[cn]
        except ImportError:
            pass

        # Layer 3: Worker fact packets — keyed by fact_type and path-style
        fact_packets = result.get("fact_store", [])
        if isinstance(fact_packets, list):
            for p in fact_packets:
                if not isinstance(p, dict):
                    continue
                ft = p.get("fact_type", "")
                payload = p.get("fact_payload", {})
                worker = p.get("emitted_by", "")

                if not ft:
                    continue

                # Key by fact_type (the path for deep parsers)
                val = payload.get("value") if isinstance(payload, dict) else payload
                if val is not None and ft not in extracted:
                    extracted[ft] = {"value": val, "worker": worker}

                # For composite payloads, also index sub-keys
                if isinstance(payload, dict):
                    for pk, pv in payload.items():
                        if pv is not None and pk not in ("value",):
                            composite = f"{ft}.{pk}"
                            if composite not in extracted:
                                extracted[composite] = {"value": pv, "worker": worker}

        return extracted

    def _find_match(self, field: str, gold_path: str, family: str,
                    extracted: Dict) -> Optional[Dict]:
        """Find a match for a gold fact in the extracted index."""
        # Priority 1: path.field composite (most specific)
        if gold_path:
            composite = f"{gold_path}.{field}"
            if composite in extracted:
                return extracted[composite]
            # Priority 2: path alone
            if gold_path in extracted:
                return extracted[gold_path]

        # Priority 3: direct field name
        if field in extracted:
            return extracted[field]

        # Priority 4: family.field
        fam_key = f"{family}.{field}"
        if fam_key in extracted:
            return extracted[fam_key]

        return None

    def _values_match(self, gold_value: Any, actual_value: Any) -> bool:
        if gold_value is None or actual_value is None:
            return gold_value == actual_value

        gold_str = str(gold_value).strip().lower()
        actual_str = str(actual_value).strip().lower()

        if gold_str == actual_str:
            return True

        # Numeric tolerance (5%)
        try:
            gold_num = float(str(gold_value).replace(",", "").replace("$", "").replace("%", ""))
            actual_num = float(str(actual_value).replace(",", "").replace("$", "").replace("%", ""))
            if gold_num == 0:
                return actual_num == 0
            return abs(gold_num - actual_num) / abs(gold_num) < 0.05
        except (ValueError, TypeError):
            pass

        # Boolean
        if isinstance(gold_value, bool) or isinstance(actual_value, bool):
            return bool(gold_value) == bool(actual_value)

        # Substring match for longer strings
        if len(gold_str) > 10 and len(actual_str) > 10:
            if gold_str in actual_str or actual_str in gold_str:
                return True

        # List comparison
        if isinstance(gold_value, list) and isinstance(actual_value, list):
            return set(str(x).lower() for x in gold_value) == set(str(x).lower() for x in actual_value)

        return False

    def run_all_brands(self, orchestrator_results: Dict[str, Dict]) -> Dict:
        """Run teaching loop across all gold brands."""
        brand_reports = {}
        total_score = 0
        brands_run = 0

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

        return {
            "brands_run": brands_run,
            "gold_brands_available": len(gold_brands),
            "average_score": round(total_score / max(brands_run, 1), 1),
            "brand_reports": brand_reports,
            "structural_rulebook": self.rulebook.summary(),
        }
