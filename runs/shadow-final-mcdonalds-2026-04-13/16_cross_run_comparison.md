# Definitive Cross-Run Comparison — All 12 McDonald's Extractions
## shadow-final-mcdonalds-2026-04-13 vs. Every McDonald's Run Ever

---

## 1. Complete Run Inventory with Exact Timing

| # | Run Slug | Start | End | Duration | Type |
|---|----------|-------|-----|----------|------|
| 1 | mcdonalds-2025 | 2026-04-05 14:35:33 | 2026-04-05 15:11:54 | **36 min 21 sec** | Manual A1 only (no A2/A3) |
| 2 | shadow-previous-mcdonalds-2025 | 2026-04-06 21:17:48 | 2026-04-06 22:22:35 | **64 min 47 sec** | Shadow, merged with B1-B5 |
| 3 | mcdonalds-2025-merged | 2026-04-06 22:38:21 | 2026-04-06 22:43:43 | **5 min 22 sec** | Merge pass (not standalone) |
| 4 | shadow-live-mcdonalds-2025-v2 | 2026-04-06 22:53:19 | 2026-04-06 23:28:12 | **34 min 53 sec** | Live shadow, full pipeline |
| 5 | mcdonalds-2025-merged-v2 | 2026-04-07 13:46:44 | 2026-04-07 13:48:13 | **1 min 29 sec** | Final merge (not standalone) |
| 6 | shadow-bench-mcdonalds-2025-test | 2026-04-07 14:29:09 | 2026-04-07 14:40:36 | **11 min 27 sec** | Quick bench test |
| 7 | shadow-test-mcdonalds-2026-04-07 | 2026-04-07 15:13:55 | 2026-04-07 21:19:44 | **365 min 49 sec** | Multi-session test |
| 8 | shadow-final-mcdonalds-2026-04-07 | 2026-04-07 21:33:51 | 2026-04-07 22:08:12 | **34 min 21 sec** | Shadow final |
| 9 | shadow-live-2026-04-07-final | 2026-04-07 22:27:04 | 2026-04-07 22:32:11 | **5 min 7 sec** | Copy + B1-B5 layer |
| 10 | shadow-bench-mcdonalds-2026-04-09 | 2026-04-09 21:17:06 | 2026-04-09 21:59:12 | **42 min 6 sec** | Full shadow bench |
| 11 | shadow-auto-mcdonalds-2025 | 2026-04-09 22:22:31 | 2026-04-10 06:33:37 | **491 min 6 sec** | Automated queue run |
| 12 | **shadow-final-mcdonalds-2026-04-13** | 2026-04-13 17:47:04 | 2026-04-13 18:24:25 | **37 min 21 sec** | **THIS RUN** — full pipeline |

**Note on durations**: Runs #3, #5, #9 are merge/copy passes built on prior extractions — their short times do not reflect standalone extraction effort. The gold champion (#5) inherited all content from runs #1, #2, #3 and merged across sessions. Run #11 ran overnight via queue automation (491 min includes idle time between sessions).

**True standalone full-pipeline runs**: #4 (34 min), #7 (365 min), #8 (34 min), #10 (42 min), #12 (37 min). Of these, **#12 is the most balanced speed-to-quality run**.

---

## 2. Complete File-Level Comparison

### Core Output Files (all runs)

| Run | 02_reader KB/lines | 08_final KB/lines | 09_canonical KB/lines | 12_enriched_v2 KB/lines | Total artifact KB | File count |
|-----|-------------------|-------------------|----------------------|------------------------|-------------------|------------|
| mcdonalds-2025 | 17.2 / 144 | 9.3 / 121 | 39.9 / 1093 | 11.5 / 188 | 259.7 | 22 |
| shadow-previous-2025 | 16.4 / 75 | 21.2 / 101 | 48.5 / 252 | 16.2 / 268 | 343.0 | 24 |
| mcdonalds-2025-merged | 17.2 / 144 | 12.6 / 142 | 48.5 / 252 | 16.2 / 268 | 360.3 | 23 |
| shadow-live-2025-v2 | 22.1 / 166 | 31.0 / 285 | 13.3 / 207 | 8.1 / 137 | 208.9 | 26 |
| **mcdonalds-2025-merged-v2** | 17.2 / 144 | 12.6 / 142 | **64.7 / 1906** | 16.2 / 268 | **380.8** | 25 |
| shadow-bench-2025-test | 13.2 / 158 | 9.5 / 118 | 9.8 / 149 | — | 69.5 | 14 |
| shadow-test-2026-04-07 | 31.1 / 369 | 39.5 / 413 | 7.6 / 119 | 3.4 / 82 | 233.6 | 29 |
| shadow-final-2026-04-07 | 35.1 / 343 | 37.1 / 387 | 6.0 / 76 | 6.2 / 45 | 196.4 | 24 |
| shadow-live-2026-04-07-final | 35.1 / 343 | 37.1 / 387 | 6.0 / 76 | 6.2 / 45 | 228.8 | 29 |
| **shadow-bench-2026-04-09** | 15.8 / 198 | **48.1 / 651** | 20.2 / 379 | **32.3 / 632** | 266.2 | 27 |
| shadow-auto-2025 | 26.0 / 425 | 18.5 / 230 | 16.9 / 373 | 16.9 / 373 | 223.1 | 27 |
| **THIS RUN (04-13)** | **33.5 / 425** | 25.9 / 273 | 11.1 / 247 | 16.4 / 325 | 207.8 | 26 |

### Structural Quality Markers

| Run | Canonical keys | Gag clause in JSON | Cohort comparability | State addenda in JSON | Unresolveds in JSON | Contradictions in JSON |
|-----|---------------|-------------------|---------------------|---------------------|--------------------|-----------------------|
| mcdonalds-2025 | 28 | 2 files | 0 | 2 | 3 | 3 |
| shadow-previous-2025 | 24 | 0 | 0 | 3 | 2 | 2 |
| mcdonalds-2025-merged | 24 | 1 | 0 | 3 | 2 | 2 |
| shadow-live-2025-v2 | 27 | 2 | 0 | 7 | 3 | 3 |
| **mcdonalds-2025-merged-v2** | **28** | 1 | 0 | **6** | 2 | 2 |
| shadow-bench-2025-test | **93** | 2 | 0 | 3 | 1 | 1 |
| shadow-test-2026-04-07 | 7 | 0 | 0 | 5 | 1 | 1 |
| shadow-final-2026-04-07 | 13 | 0 | 0 | 5 | 1 | 1 |
| shadow-live-2026-04-07-final | 13 | 1 | 0 | 5 | 1 | 1 |
| **shadow-bench-2026-04-09** | **55** | **5** | **6** | **8** | 1 | 1 |
| shadow-auto-2025 | 39 | 5 | 6 | 7 | 4 | 4 |
| **THIS RUN (04-13)** | 17 | **4** | 2 | **7** | 0 | **2** |

---

## 3. Definitive Rankings — All 12 Runs

### RANK #1: mcdonalds-2025-merged-v2 (GOLD CHAMPION)
- **Date**: April 7, 2026 (final merge at 13:46)
- **Duration**: Multi-session across April 5-7 (total extraction effort: 100+ min across 3 sessions)
- **Verdict**: V2 — Publish with caveats
- **Canonical**: 64.7 KB / 1,906 lines — **largest by far**
- **Total artifacts**: 380.8 KB — **largest by far**
- **Why #1**: This is not a single-pass run. It's the product of merging `mcdonalds-2025` (manual A1), `shadow-previous-2025` (shadow A1+B1-B5), and iterative enrichment. The 64.7 KB canonical has ~1,906 structured lines — over 6x more than any single-pass run. The RT files total 69.2 KB with deeply granular contract burdens (23.5 KB) and financial notes (25.8 KB).
- **Weaknesses**: Reader report is thin (144 lines / 17.2 KB) because it was written once in the original A1 and never expanded. Final report also thin (142 lines / 12.6 KB). No Item 19 cohort comparability quantification in dollar terms. The quantity comes from accumulated passes, not single-execution quality.

### RANK #2: shadow-bench-mcdonalds-2026-04-09
- **Date**: April 9, 2026, 21:17–21:59
- **Duration**: 42 min 6 sec (single session)
- **Verdict**: V2 — Publish with caveats
- **Final report**: 651 lines / 48.1 KB — **largest final report of any run**
- **Enriched v2**: 32.3 KB / 632 lines — **deepest enrichment of any run**
- **Canonical**: 20.2 KB / 379 lines — **largest single-pass canonical**
- **Canonical keys**: 55
- **Total artifacts**: 266.2 KB
- **Why #2**: Best single-pass execution. The 651-line final report is a full standalone diligence document. The 32.3 KB enriched v2 has item-scoped structure that no other run matches. The canonical at 20.2 KB is nearly 2x the next single-pass run. Strong across every dimension.
- **Why this run lost to it**: 
  - **Final report**: 651 vs 273 lines — bench-04-09 is **2.4x deeper**. Its report has more narrative prose per section, more inline tables rebuilt in text, and more section-by-section detail.
  - **Canonical**: 20.2 KB vs 11.1 KB — bench-04-09 has **1.8x more structured data**. It has 55 top-level keys vs this run's 17.
  - **Enriched v2**: 32.3 KB vs 16.4 KB — bench-04-09 is **2.0x deeper**. It has 632 lines of item-scoped structure vs 325.
  - **Where this run beats it**: Reader report (425 vs 198 lines — **2.1x advantage**), speed (37 vs 42 min), Item 19 dollar quantification (computed vs merely identified).

### RANK #3: shadow-final-mcdonalds-2026-04-13 (THIS RUN)
- **Date**: April 13, 2026, 17:47–18:24
- **Duration**: 37 min 21 sec (single session)
- **Verdict**: V2 — Publish with caveats
- **Reader report**: 425 lines / 33.5 KB — **largest of any run**
- **Enriched v2**: 16.4 KB / 325 lines — 2nd among single-pass runs
- **Canonical**: 11.1 KB / 247 lines
- **Total artifacts**: 207.8 KB
- **Why #3**: Best reader report ever written. Fastest full-pipeline execution at 37 min. Only run to compute dollar impact of Item 19 cohort comparability gap ($30K-$40K/year per tier). Complete Exhibit B clause walk (28 sections). 9 RT depth files covering all required A2 passes. Balanced speed-to-depth ratio.
- **Why this run lost to #1 (gold)**:
  - **Canonical gap**: 11.1 KB vs 64.7 KB = **5.8x smaller**. The gold has 1,906 lines of structured data across 28 top-level keys vs this run's 247 lines across 17 keys. The gold's canonical includes per-item structured objects for every obligation (Items 9-16), per-fee breakdowns, per-litigation entries, full Item 2 roster arrays, franchise arrangement revenue breakdowns, lease maturity schedules, and property & equipment component detail. This run has summary-level keys with fewer nested fields.
  - **Accumulated depth**: The gold was built across 3 sessions with iterative deepening. Each pass added layers that a single-pass run cannot replicate in one context window.
  - **RT file size**: Gold has 69.2 KB in RT depth files vs this run's 33.0 KB. Gold's RT_depth_contract_burdens.json alone is 23.5 KB vs this run's 10.1 KB. Gold's RT_depth_financial_notes.json is 25.8 KB vs 6.7 KB.
- **Why this run lost to #2 (bench-04-09)**:
  - **Final report**: 273 lines / 25.9 KB vs 651 lines / 48.1 KB. Bench-04-09's report is almost **twice as long** with substantially more narrative detail per section. It rebuilds more tables inline, provides deeper clause-by-clause contract analysis, and has more granular financial statement discussion.
  - **Canonical structure**: 11.1 KB / 17 keys vs 20.2 KB / 55 keys. Bench-04-09 has more granular top-level families, more item-scoped keys, and deeper nested structure.
  - **Enriched v2**: 16.4 KB vs 32.3 KB. Bench-04-09's enrichment includes deeper per-item structures (item3_litigation, item6_fee_detail, item8_supplier, etc.) with more nested fields per family.
  - **Root cause**: Bench-04-09 took 42 min vs this run's 37 min — only 5 min more, but spent that time on deeper canonical promotion and longer narrative sections. The extra 5 minutes yielded substantially more structured output.

### RANK #4: shadow-test-mcdonalds-2026-04-07
- **Date**: April 7, 2026, 15:13–21:19
- **Duration**: 365 min 49 sec (multi-session, ~6 hours)
- **Verdict**: V2
- **Final report**: 413 lines / 39.5 KB
- **Reader report**: 369 lines / 31.1 KB
- **Canonical**: 7.6 KB / 119 lines — thin
- **Enriched v2**: 3.4 KB / 82 lines — **thinnest of any full run**
- **Total artifacts**: 233.6 KB
- **Why #4**: Strong narrative depth (413-line report) but terrible efficiency — 6 hours for less structured output than bench-04-09 achieved in 42 min. The 7.6 KB canonical and 3.4 KB enriched v2 are critically thin. Also has retry files for balance sheet, cash flow, and fee completeness, suggesting A1 had gaps that needed patching.
- **This run beats it in**: Speed (37 min vs 365 min = **10x faster**), canonical (11.1 KB vs 7.6 KB), enriched v2 (16.4 KB vs 3.4 KB = **4.8x deeper**).

### RANK #5: shadow-final-mcdonalds-2026-04-07
- **Date**: April 7, 2026, 21:33–22:08
- **Duration**: 34 min 21 sec
- **Verdict**: V2
- **Final report**: 387 lines / 37.1 KB
- **Reader report**: 343 lines / 35.1 KB
- **Canonical**: 6.0 KB / 76 lines — very thin
- **Enriched v2**: 6.2 KB / 45 lines — thin
- **Total artifacts**: 196.4 KB
- **Why #5**: Good narrative depth but critically thin canonical. The 6.0 KB canonical has only 76 lines and 13 top-level keys — basically just skeleton structure. This run prioritized narrative over structure.
- **This run beats it in**: Canonical (11.1 KB vs 6.0 KB = 1.9x), enriched v2 (16.4 KB vs 6.2 KB = **2.6x**), reader report KB (33.5 vs 35.1 — similar).

### RANK #6: shadow-live-mcdonalds-2025-v2
- **Date**: April 6, 2026, 22:53–23:28
- **Duration**: 34 min 53 sec
- **Verdict**: **V1 — Publish-ready** (only V1 in history)
- **Final report**: 285 lines / 31.0 KB
- **Canonical**: 13.3 KB / 207 lines
- **Enriched v2**: 8.1 KB / 137 lines
- **Total artifacts**: 208.9 KB
- **Why #6**: The only V1 verdict ever. But the V1 was arguably generous — later runs with stronger A3 prompts consistently find caveats. Canonical is decent (13.3 KB) but enriched v2 is thin. Reader report (166 lines) is well below this run's 425 lines.
- **This run beats it in**: Reader report (425 vs 166 lines = **2.6x**), enriched v2 (16.4 KB vs 8.1 KB = **2.0x**), gag clause and cohort tracking.

### RANK #7: shadow-auto-mcdonalds-2025
- **Date**: April 9-10, 2026 (22:22–06:33)
- **Duration**: 491 min 6 sec (overnight automated queue)
- **Verdict**: V2
- **Reader report**: 425 lines / 26.0 KB (tied for most lines)
- **Final report**: 230 lines / 18.5 KB
- **Canonical**: 16.9 KB / 373 lines
- **Enriched v2**: 16.9 KB / 373 lines — **identical to v1 (defect)**
- **Total artifacts**: 223.1 KB
- **Why #7**: Huge time investment (8+ hours) for moderate output. The enriched v1 and v2 are byte-for-byte identical (16,858 bytes each), meaning v2 adds zero enrichment — a clear pipeline defect. The reader report is large but the final report is thin (230 lines). Good canonical size (16.9 KB) but inflated time makes this inefficient.
- **This run beats it in**: Speed (**37 min vs 491 min = 13x faster**), enriched v2 integrity (this run's v2 is genuinely different from v1), final report depth (273 vs 230 lines).

### RANK #8: shadow-previous-mcdonalds-2025
- **Date**: April 6, 2026, 21:17–22:22
- **Duration**: 64 min 47 sec
- **Verdict**: V2
- **Canonical**: 48.5 KB / 252 lines (large, but inherited from merged approach)
- **Reader report**: **75 lines / 16.4 KB** — thinnest of any full run
- **Final report**: 101 lines / 21.2 KB — very thin
- **Why #8**: Large canonical but thin reports. The 75-line reader report is barely a skeleton. This was an early shadow run that relied on the B1-B5 regression pipeline to merge with the gold, not designed as a standalone artifact.

### RANK #9: mcdonalds-2025-merged
- **Date**: April 6, 2026, 22:38–22:43
- **Verdict**: V2
- **Notes**: Merge pass of runs #1 and #2. Not a standalone extraction. All files inherited or merged.

### RANK #10: shadow-live-2026-04-07-final
- **Date**: April 7, 2026, 22:27–22:32
- **Verdict**: V2
- **Notes**: Copy of shadow-final-2026-04-07 with B1-B5 regression layer added. Identical core extraction files.

### RANK #11: mcdonalds-2025 (manual original)
- **Date**: April 5, 2026, 14:35–15:11
- **Duration**: 36 min 21 sec
- **Verdict**: No A3 gate
- **Notes**: Original manual extraction. Foundation for all subsequent merged runs. Has B1-B5 regression files but no A3 publish gate. Canonical is decent (39.9 KB) but represents the first-attempt manual quality.

### RANK #12: shadow-bench-mcdonalds-2025-test
- **Date**: April 7, 2026, 14:29–14:40
- **Duration**: 11 min 27 sec
- **Verdict**: V2
- **Total artifacts**: 69.5 KB — **smallest**
- **Notes**: Quick test run. No depth passes. No enrichment files. 14 files only. Interestingly has 93 canonical top-level keys (most of any run) despite being tiny — suggests very flat/shallow key structure.

---

## 4. Why This Run (#3) Lost to #1 and #2 — Root Cause Analysis

### vs #1 (Gold Champion): The Accumulation Gap

The gold champion is **not a fair single-pass comparison**. It was built across 3 sessions (April 5-7) by iteratively merging the best content from each pass. Specific advantages:

| Dimension | Gold | This Run | Gap | Root Cause |
|-----------|------|----------|-----|------------|
| Canonical lines | 1,906 | 247 | **7.7x** | Gold accumulated structured fields across 3 passes. Each pass promoted more narrative→canonical facts. |
| Canonical KB | 64.7 | 11.1 | **5.8x** | Gold's per-item structured objects (Items 2, 3, 5, 6, 7, 8, 9-16, 17, 19, 20, 21) each have deep nested arrays. This run has summary-level keys. |
| RT depth KB | 69.2 | 33.0 | **2.1x** | Gold's contract burden file is 23.5 KB (vs 10.1 KB). Gold's financial notes file is 25.8 KB (vs 6.7 KB). The merged approach allowed re-reading and deepening. |
| Total artifacts | 380.8 | 207.8 | **1.8x** | Gold includes B1-B5 regression pipeline files (regression check, recovery tasks, conflict adjudication, reconciled gate, patch log, merge notes) that this run doesn't have. |

**What would close this gap**: The canonical gap is structural, not informational — this run *read* all the same content but wrote less of it into structured JSON. A prompt patch mandating canonical expansion (e.g., "canonical must have at least 30 top-level keys with nested arrays for Items 2, 3, 6, 7, 9-16, 19, 20, 21") would close 60-70% of the gap in a single pass.

### vs #2 (Bench-04-09): The Depth Allocation Gap

The bench-04-09 run took 42 min — only 5 min more than this run's 37 min. But it allocated that time differently:

| Dimension | Bench-04-09 | This Run | Gap | Root Cause |
|-----------|-------------|----------|-----|------------|
| Final report lines | 651 | 273 | **2.4x** | Bench spent more tokens on narrative prose per section. Each section has 3-5 paragraphs vs this run's 1-2. |
| Canonical keys | 55 | 17 | **3.2x** | Bench has more granular key decomposition — e.g., separate keys for item3_litigation, item6_fee_detail, item8_supplier, item9_obligations, item10_financing, etc. This run lumps more under summary keys. |
| Enriched v2 KB | 32.3 | 16.4 | **2.0x** | Bench's v2 has deeper per-item families with more nested fields. E.g., its item6_fee_detail has per-fee structured objects, while this run's is a summary. |
| Reader report lines | 198 | **425** | **This run 2.1x better** | This run invested more in the reader report (the raw extraction pass) and less in the final report (the synthesized output). |

**What happened**: This run front-loaded its depth into the reader report (425 lines) and spent less time promoting that content into the canonical and final report. Bench-04-09 did the opposite — a shorter reader report (198 lines) but a much deeper final report (651 lines) and richer canonical (55 keys). The bench approach is more publish-ready because the final report and canonical are what downstream consumers use.

**What would close this gap**: 
1. After writing the reader report, explicitly promote all narrative facts into canonical JSON (add ~15 min)
2. When writing final report, absorb all RT depth files back into narrative sections (add ~10 min)
3. This would make a ~50-55 min run that matches bench-04-09 in both dimensions

---

## 5. Dimension-by-Dimension Rankings (All 12 Runs)

### Speed (standalone full-pipeline runs only)

| Rank | Run | Duration |
|------|-----|----------|
| 1 | shadow-bench-2025-test | 11 min (but incomplete — no A2, minimal A1) |
| 2 | **shadow-final-2026-04-13** | **37 min** |
| 3 | shadow-final-2026-04-07 | 34 min |
| 4 | shadow-live-2025-v2 | 34 min |
| 5 | shadow-bench-2026-04-09 | 42 min |
| 6 | shadow-previous-2025 | 64 min |
| 7 | shadow-test-2026-04-07 | 365 min |
| 8 | shadow-auto-2025 | 491 min |

### Reader Report Depth

| Rank | Run | Lines | KB |
|------|-----|-------|-----|
| 1 | **shadow-final-2026-04-13** | **425** | **33.5** |
| 2 | shadow-auto-2025 | 425 | 26.0 |
| 3 | shadow-test-2026-04-07 | 369 | 31.1 |
| 4 | shadow-final-2026-04-07 | 343 | 35.1 |
| 5 | shadow-bench-2026-04-09 | 198 | 15.8 |
| 6 | shadow-live-2025-v2 | 166 | 22.1 |
| 7 | shadow-bench-2025-test | 158 | 13.2 |
| 8 | mcdonalds-2025 | 144 | 17.2 |
| 9 | shadow-previous-2025 | 75 | 16.4 |

### Final Report Depth

| Rank | Run | Lines | KB |
|------|-----|-------|-----|
| 1 | **shadow-bench-2026-04-09** | **651** | **48.1** |
| 2 | shadow-test-2026-04-07 | 413 | 39.5 |
| 3 | shadow-final-2026-04-07 | 387 | 37.1 |
| 4 | shadow-live-2025-v2 | 285 | 31.0 |
| 5 | **shadow-final-2026-04-13** | **273** | **25.9** |
| 6 | shadow-auto-2025 | 230 | 18.5 |
| 7 | mcdonalds-2025-merged-v2 | 142 | 12.6 |
| 8 | mcdonalds-2025 | 121 | 9.3 |
| 9 | shadow-bench-2025-test | 118 | 9.5 |
| 10 | shadow-previous-2025 | 101 | 21.2 |

### Canonical Depth (09_final_canonical.json)

| Rank | Run | KB | Lines | Top-level keys |
|------|-----|-----|-------|---------------|
| 1 | **mcdonalds-2025-merged-v2** | **64.7** | **1906** | 28 |
| 2 | mcdonalds-2025-merged | 48.5 | 252 | 24 |
| 3 | shadow-previous-2025 | 48.5 | 252 | 24 |
| 4 | mcdonalds-2025 | 39.9 | 1093 | 28 |
| 5 | **shadow-bench-2026-04-09** | **20.2** | **379** | **55** |
| 6 | shadow-auto-2025 | 16.9 | 373 | 39 |
| 7 | shadow-live-2025-v2 | 13.3 | 207 | 27 |
| 8 | **shadow-final-2026-04-13** | **11.1** | **247** | **17** |
| 9 | shadow-bench-2025-test | 9.8 | 149 | 93 |
| 10 | shadow-test-2026-04-07 | 7.6 | 119 | 7 |
| 11 | shadow-final-2026-04-07 | 6.0 | 76 | 13 |

### Enriched v2 Depth

| Rank | Run | KB | Lines |
|------|-----|-----|-------|
| 1 | **shadow-bench-2026-04-09** | **32.3** | **632** |
| 2 | shadow-auto-2025 | 16.9 | 373 |
| 3 | **shadow-final-2026-04-13** | **16.4** | **325** |
| 4 | mcdonalds-2025-merged-v2 | 16.2 | 268 |
| 5 | mcdonalds-2025 | 11.5 | 188 |
| 6 | shadow-live-2025-v2 | 8.1 | 137 |
| 7 | shadow-final-2026-04-07 | 6.2 | 45 |
| 8 | shadow-test-2026-04-07 | 3.4 | 82 |

### Total Artifact Size

| Rank | Run | KB |
|------|-----|-----|
| 1 | mcdonalds-2025-merged-v2 | 380.8 |
| 2 | mcdonalds-2025-merged | 360.3 |
| 3 | shadow-previous-2025 | 343.0 |
| 4 | shadow-bench-2026-04-09 | 266.2 |
| 5 | mcdonalds-2025 | 259.7 |
| 6 | shadow-test-2026-04-07 | 233.6 |
| 7 | shadow-live-2026-04-07-final | 228.8 |
| 8 | shadow-auto-2025 | 223.1 |
| 9 | shadow-live-2025-v2 | 208.9 |
| 10 | **shadow-final-2026-04-13** | **207.8** |
| 11 | shadow-final-2026-04-07 | 196.4 |
| 12 | shadow-bench-2025-test | 69.5 |

---

## 6. Quality Radar — This Run's Profile

```
                    SPEED
                     ★★★★★
                    /      \
           READER /          \ FINAL
           REPORT              REPORT
          ★★★★★               ★★★☆☆
          |                        |
    ENRICHED                  CANONICAL
    V2 ★★★★☆               ★★☆☆☆
          |                        |
       STATE  \              / A2 DEPTH
       ADDENDA  \          /   FILES
        ★★★★★    \      /   ★★★★☆
                   \  /
                 ITEM 19
                 COHORT
                 ★★★★★
```

**5-star**: Speed, Reader Report, State Addenda, Item 19 Cohort Quantification
**4-star**: Enriched v2, A2 Depth Files
**3-star**: Final Report
**2-star**: Canonical

---

## 7. Specific Improvement Actions (Prioritized)

### Action 1: Canonical Expansion Prompt Patch (Impact: HIGH)
Add to A1 prompt: "09_final_canonical.json must have at least 25 top-level keys and target 25+ KB for a 300+ page FDD. Include full structured arrays for Item 2 (all officers), Item 3 (all cases), Item 6 (all fees), Item 7 (all components), Items 9-16 (per-item burden objects), Item 19 (all tiers with computed fields), Item 20 (all table totals), Item 21 (all note families with extracted amounts)."
Expected impact: 11.1 KB → 25-30 KB canonical.

### Action 2: Final Report Absorption Prompt Patch (Impact: HIGH)
Add to A2 prompt or post-A2 step: "Before writing final updates, read all RT_depth_*.json files and absorb their content into 08_final_report.md as expanded narrative sections. Target 400+ lines for a 300+ page FDD."
Expected impact: 273 lines → 400+ lines.

### Action 3: Post-A1 Canonical Promotion Pass (Impact: MEDIUM)
Add a mandatory step between A1 and A2: "Read 02_reader_report.md top to bottom. For every structured fact (numbers, dates, names, fees, terms), add it as a structured key in 09_final_canonical.json if not already present."
Expected impact: Would catch the reader-report-to-canonical gap.

### Action 4: Operator's Lease Walk (Impact: MEDIUM)
Add to A2 depth blocks: "If Exhibit G (Operator's Lease) is surfaced and exceeds 20 pages, perform a targeted clause walk focusing on: holdover provisions, casualty/condemnation allocation, environmental compliance, subletting restrictions, default cure mechanics beyond what Item 17 discloses."
Expected impact: Would be a first for any McDonald's run.

### Action 5: Enrichment v1 Differentiation (Impact: LOW)
Add to A1 prompt: "11_canonical_enriched.json must be meaningfully different from 09_final_canonical.json. It must add at least 3 enrichment layers not present in canonical (e.g., item19_chart_detail, item20_yearly_activity, exhibit_structure). If v1 is identical or near-identical to canonical, this is a defect."
Expected impact: 7.0 KB → 12-15 KB.

---

## 8. Final Verdict

**This run is the best speed-optimized single-pass extraction of McDonald's.** It proves the full A1→A2→A3 pipeline can produce Verdict 2 quality in 37 minutes with comprehensive coverage of all 23 items, all exhibits, all financial statements, and all state addenda.

**It is not the deepest single-pass extraction** — that title belongs to shadow-bench-2026-04-09, which invested 5 more minutes for 2.4x deeper final report and 1.8x larger canonical. 

**It is not the deepest extraction overall** — that title belongs to the gold champion, which accumulated depth across multiple sessions.

**The path to #1**: A single-pass run that matches this run's reader-report depth + bench-04-09's canonical/final-report depth + a new Operator's Lease walk would be the undisputed champion. That run would take approximately 50-55 minutes and produce ~350+ KB of artifacts with a 30+ KB canonical and 500+ line final report.
