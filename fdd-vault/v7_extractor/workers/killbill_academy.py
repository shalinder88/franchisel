"""
Killbill Academy — Offline teaching subsystem.

NOT a runtime worker. NOT one of the 32 extractors.
Runs AFTER extraction, using manual gold, to teach the workers.

Academy inputs:
  - Manual gold writeups
  - Raw PDF source zones
  - Final extracted packets
  - Diff between runtime and gold
  - Unresolved logs
  - Conflict logs

Academy outputs:
  - Worker-specific playbooks
  - Table parsing recipes
  - Exhibit classification rules
  - Fact extraction checklists
  - Contradiction patterns
  - Gold exemplars for retrieval

The 5-pass gold teaching protocol:
  Pass 1: Structure first (cover, TOC, exhibit list, special risks)
  Pass 2: Economics core (Items 5, 6, 7, 8)
  Pass 3: Operations and territory (Items 10, 11, 12, 15, 16)
  Pass 4: Legal and contract burden (Items 3, 4, 17, 18 + agreements)
  Pass 5: Performance, health, financials (Items 19, 20, 21, 22, 23)
"""

import json
import os
from typing import Any, Dict, List, Optional
from datetime import datetime


# ══════════════════════════════════════════════════════════════════
# GOLD TEACHING PASSES
# ══════════════════════════════════════════════════════════════════

TEACHING_PASSES = {
    1: {
        "name": "Structure First",
        "teaches_workers": [2],
        "gold_sources": ["cover", "special_risks", "toc", "exhibit_list"],
        "lesson_focus": [
            "always start with structure, never begin with field normalization",
            "create item/exhibit/table roadmap first",
            "identify spill warnings before item reading",
        ],
    },
    2: {
        "name": "Economics Core",
        "teaches_workers": [7, 8, 9, 10],
        "gold_sources": ["item_5", "item_6", "item_7", "item_8"],
        "lesson_focus": [
            "capture every table row, not just headlines",
            "capture every note under tables",
            "fee triggers, thresholds, timing, mechanics",
            "affiliate supplier economics and rebates",
            "technology fee stacks",
            "audit and penalty mechanics",
        ],
    },
    3: {
        "name": "Operations and Territory",
        "teaches_workers": [12, 13, 14, 17, 18],
        "gold_sources": ["item_10", "item_11", "item_12", "item_15", "item_16"],
        "lesson_focus": [
            "territory is enum-first, not boolean",
            "channel carveouts must be explicit",
            "training tables are first-class",
            "recordkeeping and tech access are real burdens",
            "operating burden analysis, not yes/no summaries",
        ],
    },
    4: {
        "name": "Legal and Contract Burden",
        "teaches_workers": [5, 6, 19, 20, 27],
        "gold_sources": ["item_3", "item_4", "item_17", "item_18",
                          "state_addenda", "guaranties", "agreements"],
        "lesson_focus": [
            "litigation must be structured, not paraphrased",
            "addenda override body text",
            "guaranties are burden objects",
            "post-term duties matter",
            "dispute resolution is a real commercial term",
            "follow attached agreements where the real burden lives",
        ],
    },
    5: {
        "name": "Performance, Health, Financials",
        "teaches_workers": [21, 22, 23, 24, 25, 26, 27],
        "gold_sources": ["item_19", "item_20", "item_21", "item_22", "item_23",
                          "financials", "franchisee_lists", "all_exhibits"],
        "lesson_focus": [
            "Item 19, 20, and 21 are each separate jobs",
            "parse tables fully, parse notes fully",
            "keep cohort definitions and exclusions",
            "parse outlet history separately from franchisee lists",
            "parse financial highlights separately from audit opinion",
            "never silently skip exhibits",
        ],
    },
}


class ItemPlaybook:
    """A teaching document for one worker, compiled from gold comparisons."""

    def __init__(self, worker_id: str):
        self.worker_id = worker_id
        self.entries: List[Dict] = []
        self.extraction_rules: List[str] = []
        self.table_recipes: List[Dict] = []
        self.common_misses: List[Dict] = []
        self.exemplars: List[Dict] = []

    def add_rule(self, rule: str, source_brand: str, evidence: str = ""):
        self.extraction_rules.append(rule)

    def add_table_recipe(self, table_type: str, columns_pattern: List[str],
                          extraction_steps: List[str], source_brand: str):
        self.table_recipes.append({
            "table_type": table_type,
            "columns_pattern": columns_pattern,
            "extraction_steps": extraction_steps,
            "source_brand": source_brand,
        })

    def add_common_miss(self, field: str, miss_pattern: str,
                         fix_recipe: str, brands_affected: List[str]):
        self.common_misses.append({
            "field": field,
            "miss_pattern": miss_pattern,
            "fix_recipe": fix_recipe,
            "brands_affected": brands_affected,
        })

    def add_exemplar(self, brand: str, gold_fact: Dict, extraction_path: str):
        self.exemplars.append({
            "brand": brand,
            "gold_fact": gold_fact,
            "extraction_path": extraction_path,
        })

    def to_dict(self) -> Dict:
        return {
            "worker_id": self.worker_id,
            "extraction_rules": self.extraction_rules,
            "table_recipes": self.table_recipes,
            "common_misses": self.common_misses,
            "exemplar_count": len(self.exemplars),
        }

    def save(self, output_dir: str):
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, f"playbook_{self.worker_id}.json")
        with open(path, "w") as f:
            json.dump(self.to_dict(), f, indent=2)


class KillbillAcademy:
    """Offline teaching subsystem.

    NOT a runtime worker. Runs after extraction using manual gold.
    Produces worker playbooks, table recipes, and extraction rules.
    """

    def __init__(self, gold_dir: str, output_dir: str):
        self.gold_dir = gold_dir
        self.output_dir = output_dir
        self.playbooks: Dict[str, ItemPlaybook] = {}
        self.contradiction_patterns: List[Dict] = []
        self.exhibit_classification_rules: List[Dict] = []

    def get_playbook(self, worker_id: str) -> ItemPlaybook:
        if worker_id not in self.playbooks:
            self.playbooks[worker_id] = ItemPlaybook(worker_id)
        return self.playbooks[worker_id]

    def load_gold_brand(self, brand_slug: str) -> List[Dict]:
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

    def teach_from_comparison(self, brand_slug: str,
                               gold_facts: List[Dict],
                               extraction_result: Dict,
                               conflict_log: List[Dict] = None,
                               unresolved_log: List[Dict] = None):
        """Run the full 5-pass teaching protocol on one brand.

        Compares gold against extraction, generates lessons for each worker.
        """
        # Index gold by source_item for pass-based teaching
        gold_by_item = {}
        for gf in gold_facts:
            item = gf.get("source_item")
            if item is not None:
                if item not in gold_by_item:
                    gold_by_item[item] = []
                gold_by_item[item].append(gf)

        # Index gold by family
        gold_by_family = {}
        for gf in gold_facts:
            fam = gf.get("family", "other")
            if fam not in gold_by_family:
                gold_by_family[fam] = []
            gold_by_family[fam].append(gf)

        # ── Run each teaching pass ──
        for pass_num, pass_config in TEACHING_PASSES.items():
            self._run_pass(pass_num, pass_config, brand_slug,
                          gold_by_item, gold_by_family, extraction_result)

        # ── Mine contradiction patterns ──
        if conflict_log:
            for conflict in conflict_log:
                self.contradiction_patterns.append({
                    "brand": brand_slug,
                    **conflict,
                    "date": datetime.now().isoformat()[:10],
                })

        # ── Mine unresolved patterns ──
        if unresolved_log:
            for entry in unresolved_log:
                reporter = entry.get("reporter", "unknown")
                pb = self.get_playbook(reporter)
                pb.add_common_miss(
                    field=entry.get("description", "")[:50],
                    miss_pattern="unresolved_at_end",
                    fix_recipe="Check if source was located but not parsed",
                    brands_affected=[brand_slug],
                )

    def _run_pass(self, pass_num: int, config: Dict,
                   brand_slug: str,
                   gold_by_item: Dict, gold_by_family: Dict,
                   extraction_result: Dict):
        """Execute one teaching pass."""
        worker_nums = config["teaches_workers"]
        lessons = config["lesson_focus"]
        sources = config["gold_sources"]

        # Map worker nums to worker IDs
        worker_ids = []
        for wn in worker_nums:
            if wn == 2:
                worker_ids.append("front_matter")
            elif 3 <= wn <= 25:
                worker_ids.append(f"item_{wn - 2:02d}")
            elif wn == 26:
                worker_ids.append("table_extractor")
            elif wn == 27:
                worker_ids.append("exhibit_extractor")

        # Write pass-level lessons to each worker's playbook
        for wid in worker_ids:
            pb = self.get_playbook(wid)
            for lesson in lessons:
                pb.add_rule(
                    f"[Pass {pass_num}: {config['name']}] {lesson}",
                    source_brand=brand_slug,
                )

        # Compare gold facts for relevant items against extraction
        for source in sources:
            if source.startswith("item_"):
                try:
                    item_num = int(source.split("_")[1])
                except (ValueError, IndexError):
                    continue
                item_gold = gold_by_item.get(item_num, [])
                self._compare_item_gold(item_num, item_gold,
                                         extraction_result, brand_slug)

    def _compare_item_gold(self, item_num: int, gold_facts: List[Dict],
                            extraction_result: Dict, brand_slug: str):
        """Compare gold facts for one item against extraction output."""
        # Get extracted facts for this item
        fact_store = extraction_result.get("fact_store", [])
        extracted_for_item = [
            f for f in (fact_store if isinstance(fact_store, list) else [])
            if isinstance(f, dict) and f.get("source_item") == item_num
        ]

        extracted_types = {f.get("fact_type", "") for f in extracted_for_item}

        worker_id = f"item_{item_num:02d}"
        pb = self.get_playbook(worker_id)

        for gf in gold_facts:
            field = gf.get("field", "")
            value = gf.get("value")

            # Check if this gold fact was captured
            matched = False
            for ef in extracted_for_item:
                if ef.get("fact_type") == field:
                    matched = True
                    break
                # Check payload values too
                payload = ef.get("fact_payload", {})
                if isinstance(payload, dict) and payload.get("value") == value:
                    matched = True
                    break

            if not matched and value is not None:
                pb.add_common_miss(
                    field=field,
                    miss_pattern=f"gold_has_but_runtime_missed",
                    fix_recipe=f"Extract '{field}' from Item {item_num}",
                    brands_affected=[brand_slug],
                )
                pb.add_exemplar(brand_slug, gf,
                                f"Item {item_num}, field={field}")

    def run_full_academy(self, brands_and_results: Dict[str, Dict]) -> Dict:
        """Run the full Academy across all gold brands.

        Args:
            brands_and_results: brand_slug → orchestrator result
        """
        brands_taught = 0

        for brand_slug, result in brands_and_results.items():
            gold_facts = self.load_gold_brand(brand_slug)
            if not gold_facts:
                continue

            conflict_log = []
            bb_data = result.get("blackboard", {})
            if isinstance(bb_data, dict):
                conflict_log = bb_data.get("conflicts", [])

            unresolved_log = []
            if isinstance(bb_data, dict):
                unresolved_log = bb_data.get("unresolved", [])

            self.teach_from_comparison(
                brand_slug, gold_facts, result,
                conflict_log=conflict_log,
                unresolved_log=unresolved_log,
            )
            brands_taught += 1

        # ── Save all playbooks ──
        for wid, pb in self.playbooks.items():
            pb.save(self.output_dir)

        # ── Save contradiction patterns ──
        if self.contradiction_patterns:
            path = os.path.join(self.output_dir, "contradiction_patterns.json")
            os.makedirs(self.output_dir, exist_ok=True)
            with open(path, "w") as f:
                json.dump(self.contradiction_patterns, f, indent=2)

        return {
            "brands_taught": brands_taught,
            "playbooks_generated": len(self.playbooks),
            "contradiction_patterns": len(self.contradiction_patterns),
            "playbook_summaries": {
                wid: pb.to_dict() for wid, pb in self.playbooks.items()
            },
        }
