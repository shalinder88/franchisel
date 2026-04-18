# Extensive Cross-Run Comparison Report
# McDonald's USA, LLC FDD (638437-2025) — All Runs

**Date:** 2026-04-10
**Subject run:** `shadow-auto-mcdonalds-2025` (this run)

---

## 1. Run Inventory — All McDonald's Runs

| # | Slug | Date | Type | Duration | Files | Total Size | 09_canonical | 08_report | A3 Gate |
|---|------|------|------|----------|-------|------------|--------------|-----------|---------|
| 1 | `mcdonalds-2025` | Apr 5, 14:35-15:11 | Manual/gold base | ~36 min | 22 | 266 KB | 39.9 KB | 9.3 KB | No gate (B1-B5 pipeline) |
| 2 | `shadow-previous-mcdonalds-2025` | Apr 6, 21:17-22:22 | Shadow (pre-merge) | ~65 min | 24 | 351 KB | 48.5 KB | 21.2 KB | Yes (14.4 KB) |
| 3 | `mcdonalds-2025-merged` | Apr 6, 22:38-22:43 | Gold merged v1 | ~5 min (merge only) | 23 | 369 KB | 48.5 KB | 12.6 KB | Yes (14.4 KB) |
| 4 | `shadow-live-mcdonalds-2025-v2` | Apr 6, 22:53-23:28 | Shadow live v2 | ~35 min | 26 | 214 KB | 13.3 KB | 31.0 KB | Yes (7.6 KB) |
| 5 | **`mcdonalds-2025-merged-v2`** | Apr 7, 13:46-13:48 | **GOLD (current champion)** | ~2 min (merge) | 25 | **390 KB** | **64.7 KB** | 12.6 KB | Yes (14.4 KB) |
| 6 | `shadow-bench-mcdonalds-2025-test` | Apr 7, 14:29-14:40 | Shadow bench (test) | ~11 min | 14 | 71 KB | 9.8 KB | 9.5 KB | Yes (10.8 KB) |
| 7 | `shadow-test-mcdonalds-2026-04-07` | Apr 7, 15:13-21:19 | Shadow test (full) | ~6 hrs* | 29 | 239 KB | 7.6 KB | 39.5 KB | Yes (12.7 KB) |
| 8 | `shadow-final-mcdonalds-2026-04-07` | Apr 7, 21:33-22:08 | Shadow final | ~35 min | 24 | 201 KB | 6.0 KB | 37.1 KB | Yes (14.5 KB) |
| 9 | `shadow-live-mcdonalds-2026-04-07-final` | Apr 7, 22:27-22:32 | Shadow live final | ~5 min (copy+patch) | 29 | 234 KB | 6.0 KB | 37.1 KB | Yes (14.5 KB) |
| 10 | `shadow-bench-mcdonalds-2026-04-09` | Apr 9, 21:17-21:59 | Shadow bench (latest) | ~42 min | 27 | 273 KB | 20.2 KB | 48.1 KB | Yes (13.5 KB) |
| 11 | **`shadow-auto-mcdonalds-2025`** | **Apr 9, 22:22-22:46** | **THIS RUN (shadow auto)** | **~24 min** | **25** | **200 KB** | **16.9 KB** | **18.5 KB** | **Yes (11.5 KB)** |

*shadow-test had a long idle gap between A1 and later phases.

---

## 2. Head-to-Head: This Run vs Gold (merged-v2)

### File Size Comparison

| File | Gold (merged-v2) | This Run | Delta | Notes |
|------|-------------------|----------|-------|-------|
| 01_source_map.md | 9,612 | 3,804 | -60% | Gold has more granular page classification |
| 02_reader_report.md | 17,220 | 25,951 | **+51%** | This run is significantly larger |
| 03_tables.json | 27,707 | 18,031 | -35% | Gold has more table rows (per-state Item 20 rows) |
| 04_exhibits.json | 14,132 | 8,750 | -38% | Gold has more exhibit detail |
| 05_canonical.json | 32,562 | 10,792 | -67% | Gold's initial canonical much larger |
| 06_coverage_audit.md | 7,626 | 5,048 | -34% | Similar coverage |
| 08_final_report.md | 12,647 | 18,466 | **+46%** | This run's final report is longer |
| 09_final_canonical.json | **64,728** | 16,858 | **-74%** | Gold canonical is 3.8x larger |
| 10_scorecard.md | 9,169 | 3,888 | -58% | Gold scorecard more detailed |
| 11_canonical_enriched.json | 13,674 | 16,858 | +23% | |
| 12_canonical_enriched_v2.json | 16,177 | 16,858 | +4% | Roughly comparable |
| RT_depth_contract_burdens.json | 23,486 | 9,068 | -61% | Gold has deeper clause walk |
| RT_depth_financial_notes.json | 25,841 | 5,896 | -77% | Gold has substantially deeper note walk |
| RT_depth_promotion_audit.json | 13,263 | 2,530 | -81% | Gold promoted many more facts |
| RT_depth_state_addenda_promotion.json | 6,616 | 6,361 | -4% | Roughly comparable |
| **Total run output** | **390 KB** | **200 KB** | **-49%** | Gold is ~2x larger |

### Key Structural Differences

| Dimension | Gold (merged-v2) | This Run |
|-----------|-------------------|----------|
| Pipeline | Multi-session A1→B1-B5 merge of two runs | Single-session A1→A2→A3 |
| Canonical fields | ~200 | ~80-90 |
| Concluded litigation rows | 19 structured | 12+ described |
| Leadership roster | 37 + L&D head = 38 | 36 (7 in canonical, 36 in report) |
| Financial note families | 11 structured | 18 listed (but shallower per-family) |
| Contract burden clauses | 30 + 16 promotions = 46 | 30 (no additional recovery promotions) |
| Contradictions | 5 preserved | 2 |
| Exhibits at A grade | 14/20 (70%) | 5/20 (25%) |
| State addenda overrides | 6 (from dedicated retry) | 16 (richer structured per-state) |
| Overall grade | A+ | A- |

---

## 3. Head-to-Head: This Run vs Shadow-Bench-2026-04-09 (Same Day Sibling)

The `shadow-bench-mcdonalds-2026-04-09` run was also done on April 9, completing about 20 minutes before this run started.

| Dimension | Shadow-Bench 04-09 | This Run (Auto) |
|-----------|--------------------|-----------------| 
| Start time | 21:17 | 22:22 |
| End time | 21:59 (gate at 21:48) | 22:46 |
| Duration | ~42 min | ~24 min |
| Files | 27 | 25 |
| Total size | 273 KB | 200 KB |
| 09_canonical | 20.2 KB | 16.9 KB |
| 08_final_report | **48.1 KB** | 18.5 KB |
| A2 note families | 19 | 18 |
| A2 contract clauses | 28 | 30 |
| State addenda overrides | 12 | **16** |
| A1 grade | B+ | A- |
| Final grade | A- | A- |
| Verdict | Publish with caveats | Publish with caveats |
| Cohort comparability | Yes | Yes |
| Gag clause | Yes | Yes |
| Unresolveds | 6 | 3 |
| Has A3 head-to-head comparison | Yes (12.8 KB) | No |

**This run was faster** (24 min vs 42 min) but produced a **smaller output** (200 KB vs 273 KB). The bench-09 run's final report was 2.6x larger (48 KB vs 18 KB), indicating substantially deeper narrative.

---

## 4. Head-to-Head: This Run vs Shadow-Final-2026-04-07

| Dimension | Shadow-Final 04-07 | This Run |
|-----------|--------------------|---------| 
| Date | Apr 7 | Apr 9 |
| Duration | ~35 min | ~24 min |
| Total size | 201 KB | 200 KB |
| 02_reader_report | **35.1 KB** | 26.0 KB |
| 08_final_report | **37.1 KB** | 18.5 KB |
| 09_canonical | 6.0 KB | **16.9 KB** |
| Tables extracted | 17 | 11 |
| Items full coverage | 21 | 23 |
| Items partial | 3 | 0 |
| Exhibits complete | 4 | 5 |
| Leadership roster | 37 | 36 |
| Verdict | Published (with B-pipeline) | Publish with caveats |

The Apr 7 final run had a **much larger reader report and final report** but a **much smaller canonical** (6 KB vs 17 KB). This suggests the Apr 7 run invested more in narrative depth at the expense of structured data, while this run prioritized structured canonical output.

---

## 5. Aggregate Comparison Table — All A3 Publish Gates

| Run | Date | Verdict | Final Report (KB) | Canonical (KB) | Total (KB) | Duration |
|-----|------|---------|--------------------|-----------------|-----------|-----------| 
| mcdonalds-2025-merged | Apr 6 | Publish gate (via B5) | 12.6 | 48.5 | 369 | merge only |
| mcdonalds-2025-merged-v2 | Apr 7 | **A+ (gold)** | 12.6 | **64.7** | **390** | merge only |
| shadow-previous-mcdonalds-2025 | Apr 6 | Publish (via B5) | 21.2 | 48.5 | 351 | ~65 min |
| shadow-live-mcdonalds-2025-v2 | Apr 6 | Publish (via B5) | 31.0 | 13.3 | 214 | ~35 min |
| shadow-bench-mcdonalds-2025-test | Apr 7 | Publish (A3) | 9.5 | 9.8 | 71 | ~11 min |
| shadow-test-mcdonalds-2026-04-07 | Apr 7 | Publish (A3) | 39.5 | 7.6 | 239 | ~38 min* |
| shadow-final-mcdonalds-2026-04-07 | Apr 7 | Publish (A3) | 37.1 | 6.0 | 201 | ~35 min |
| shadow-bench-mcdonalds-2026-04-09 | Apr 9 | Publish w/ caveats (A3) | **48.1** | 20.2 | 273 | ~42 min |
| **shadow-auto-mcdonalds-2025** | **Apr 9** | **Publish w/ caveats** | **18.5** | **16.9** | **200** | **~24 min** |

---

## 6. Where This Run Is Strongest

1. **Speed:** Fastest full A1→A2→A3 pass at 24 minutes. Previous fastest single-session was shadow-bench-test at 11 min but that produced only 71 KB (minimal depth).

2. **State addenda depth:** 16 structured overrides across 6 states — more override entries than any other single-session run (bench-09 had 12, shadow-final had narrative only).

3. **Item 19 cohort comparability:** Dollar impact computed at every tier. Dedicated RT file. Stronger than shadow-final (which flagged it narratively) and comparable to bench-09.

4. **Reader report size:** 26 KB — larger than the gold base (17.2 KB) and bench-test (13.2 KB). Covers all 23 items with operative burden summaries.

5. **A1 completeness:** All 23 items at A coverage (vs shadow-final's 21 full + 3 partial).

6. **Franchise Agreement clause walk:** 30 clause families — comparable to bench-09 (28) and more than shadow-final (limited to key sections).

---

## 7. Where This Run Is Weakest

1. **Canonical size (16.9 KB vs 64.7 KB gold):** The gold merged-v2 canonical has ~200 fields vs this run's ~80-90. The gap is structural: gold benefited from two separate extraction passes (OLD + NEW) then a best-of-both merge. Critical missing canonical fields:
   - Full leadership roster not promoted to canonical (only 7 of 36 in canonical JSON)
   - Concluded litigation not structured row-by-row (gold has 19 rows)
   - Item 10 financing detail thinner (missing consolidation waiver, 18% guarantor enforcement rate from p208/p213)
   - Enrichment layers (item19_chart_detail, item6_fee_attributes, item1_structural_facts) not present as separate enrichment families

2. **Final report (18.5 KB vs 48.1 KB bench-09, 37.1 KB shadow-final):** The final report is the shortest of any full-pipeline run. Gold's merged report is even shorter (12.6 KB) but gold's depth lives in the canonical, not the report. For a standalone diligence document, this report is thin compared to shadow-final and bench-09.

3. **RT depth files are thin:**
   - `RT_depth_financial_notes.json`: 5.9 KB vs gold's 25.8 KB (4.4x smaller)
   - `RT_depth_contract_burdens.json`: 9.1 KB vs gold's 23.5 KB (2.6x smaller)
   - `RT_depth_promotion_audit.json`: 2.5 KB vs gold's 13.3 KB (5.3x smaller)
   These are the biggest gaps. The gold run walked every financial note family with operative detail. This run listed families with summaries.

4. **Tables JSON (18 KB vs 27.7 KB gold):** Gold has per-state rows for Item 20 Tables 2-5 extracted as structured data. This run captured footer totals but not per-state row data in 03_tables.json (they were read for the reader report but not promoted to tables JSON).

5. **Exhibits at A (5/20 vs 14/20 gold):** This run still has most exhibits at labeled/partial. Gold promoted many more exhibits to A via the merge of two independent extraction passes.

6. **Source map (3.8 KB vs 9.6 KB gold):** Gold's source map has more granular per-page classification.

7. **No B-pipeline (regression check, conflict adjudication, reconciliation):** This was by design (A1→A2→A3 only), but it means no cross-run regression check was performed as part of this run.

---

## 8. Evolution Over Time

| Metric | Apr 5 (Gold base) | Apr 6 (Shadow-prev) | Apr 7 (Merged-v2 gold) | Apr 7 (Shadow-final) | Apr 9 (Bench-09) | Apr 9 (THIS) |
|--------|-------|--------|--------|--------|--------|-------|
| Canonical KB | 39.9 | 48.5 | **64.7** | 6.0 | 20.2 | 16.9 |
| Report KB | 9.3 | 21.2 | 12.6 | 37.1 | **48.1** | 18.5 |
| Total KB | 266 | 351 | **390** | 201 | 273 | 200 |
| Grade | A (post-B5) | A+ (merged) | **A+** | A- | A- | A- |
| Duration | ~36 min | ~65 min | merge | ~35 min | ~42 min | **~24 min** |

The gold champion (merged-v2) achieved A+ by combining two independent runs. Single-session runs consistently hit A- ceiling.

---

## 9. Specific Improvements for Next Run

### Priority 1 — Canonical field density (biggest gap)
**Problem:** 16.9 KB canonical vs 64.7 KB gold.
**Fix:**
- Promote ALL 36 leadership roster entries to canonical (not just top 7)
- Structure all 12+ concluded litigation as individual row objects with amount, case number, settlement type
- Add per-state Item 20 data as canonical structured arrays (not just footer totals)
- Add Item 6 individual fee attributes as separate canonical array objects
- Add Item 1 structural facts (formation history, five franchise types with details)
- Add Item 10 financing deep attributes (consolidation waiver language from p208, guarantor enforcement rate 18% from p213)

### Priority 2 — RT depth file depth (second biggest gap)
**Problem:** Financial notes 5.9 KB vs 25.8 KB; contract burdens 9.1 KB vs 23.5 KB.
**Fix:**
- Financial notes: instead of listing families with one-sentence summaries, extract the actual numbers and mechanics for each policy (e.g., exact depreciation rates, exact lease discount rates, exact tax rate reconciliation table rows, exact restructuring accrual table)
- Contract burdens: instead of one entry per clause family, walk each subsection with exact money amounts, formulas, and trigger conditions quoted from the text

### Priority 3 — Final report depth (narrative gap)
**Problem:** 18.5 KB vs 48.1 KB (bench-09).
**Fix:**
- Each section should have 3-5 paragraphs minimum, not 1-2
- Item 19 section should walk through each sales distribution statistic individually
- Item 3 litigation section should have a dedicated paragraph per pending case
- Item 21 financial section should have a full financial ratio analysis paragraph
- Contract burden section should walk key clauses with exact provisions rather than summary bullets

### Priority 4 — Tables JSON completeness
**Problem:** 18 KB vs 27.7 KB.
**Fix:**
- Extract Item 20 Tables 2-5 per-state rows into tables JSON (not just footer totals)
- Include the STO/STR rent tier table from Item 6 Note 7 as a structured table
- Include the training program table from Item 11 as a structured table

### Priority 5 — Source map granularity
**Problem:** 3.8 KB vs 9.6 KB.
**Fix:**
- Classify every single page individually (page X = Item Y continuation, Exhibit Z section A)
- Include exhibit sub-section markers (e.g., "pages 133-134 = Lease TOC, pages 135-140 = Lease Articles 1-3")

### Priority 6 — Enrichment differentiation
**Problem:** 11_canonical_enriched.json and 12_canonical_enriched_v2.json are identical copies of 09_final_canonical.json.
**Fix:**
- v1 enrichment should add: item19_chart_detail, item20_yearly_activity by state, exhibit_structure, item21_structural_facts, item1_structural_facts, item6_fee_attributes
- v2 enrichment should add: item21_financial_structure_detail (line-item balance sheet/income statement), item21_statement_detail, item6_fee_detail per fee with attributes
- These should be ADDITIVE layers, not just copies

---

## 10. Bottom Line

**This run (shadow-auto) is the fastest single-session McDonald's extraction at 24 minutes and achieves an honest A- with complete item coverage.** However, it reaches only ~52% of the gold champion's output volume (200 KB vs 390 KB) and ~26% of the gold canonical density (16.9 KB vs 64.7 KB). The main gaps are in canonical field count, RT depth file depth, final report length, and per-state table data.

The A- ceiling for single-session runs appears structural: without a second independent extraction pass and a best-of-both merge, the run cannot match the gold's field count and contradiction preservation. The most impactful improvements for a single-session run would be:

1. **Deeper canonical promotion** (promote everything from the reader report into canonical, not just headlines)
2. **Deeper RT files** (extract actual numbers and tables from financial notes, not just family summaries)
3. **Longer final report** (3-5 paragraphs per section instead of 1-2)

These changes would not change the grade but would close the gap from 200 KB to approximately 300-320 KB and from 16.9 KB canonical to approximately 35-40 KB, putting a single-session run within 80% of gold quality.
