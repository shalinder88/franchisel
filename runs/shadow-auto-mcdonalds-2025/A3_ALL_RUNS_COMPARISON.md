# A3 Publish Gate — All McDonald's Runs Compared
**Analysis date:** 2026-04-10

---

## Master Ranking Table

All 11 McDonald's extraction runs, ranked by overall quality. Times are wall-clock from first file written to last file written (not including idle gaps).

| Rank | Run Slug | Date | Start → End | Wall Clock | Verdict | Grade | Canonical KB | Report KB | Total KB | Files |
|------|----------|------|-------------|------------|---------|-------|-------------|-----------|----------|-------|
| **1** | `mcdonalds-2025-merged-v2` | Apr 7 | 13:46→13:48 | 2 min (merge) | Publish w/ caveats | **A+** | **63.2** | 12.3 | **380.8** | 25 |
| **2** | `mcdonalds-2025-merged` | Apr 6 | 22:38→22:43 | 5 min (merge) | Publish w/ caveats | **A+** | 47.3 | 12.3 | 360.3 | 23 |
| **3** | `shadow-previous-mcdonalds-2025` | Apr 6 | 21:17→22:22 | 65 min | Publish w/ caveats | A (all items) | 47.3 | 20.7 | 343.0 | 24 |
| **4** | `shadow-bench-mcdonalds-2026-04-09` | Apr 9 | 21:17→21:59 | 42 min | Publish w/ caveats | A- | 19.7 | **46.9** | 266.2 | 27 |
| **5** | `mcdonalds-2025` | Apr 5 | 14:35→15:11 | 36 min | Publish (B5 gate) | A | 38.9 | 9.0 | 259.7 | 22 |
| **6** | `shadow-test-mcdonalds-2026-04-07` | Apr 7 | 15:13→15:51 | 38 min | Publish w/ caveats | A- | 7.4 | 38.6 | 233.6 | 29 |
| **7** | `shadow-live-mcdonalds-2026-04-07-final` | Apr 7 | 22:27→22:32 | 5 min (copy) | Publish w/ caveats | A- | 5.8 | 36.2 | 228.8 | 29 |
| **8** | `shadow-live-mcdonalds-2025-v2` | Apr 6 | 22:53→23:28 | 35 min | **Publish-ready (1)** | A- | 12.9 | 30.3 | 208.9 | 26 |
| **9** | **`shadow-auto-mcdonalds-2025`** | **Apr 9** | **22:22→22:46** | **24 min** | **Publish w/ caveats** | **A-** | **16.4** | **18.0** | **210.9** | **26** |
| **10** | `shadow-final-mcdonalds-2026-04-07` | Apr 7 | 21:33→22:08 | 35 min | Publish w/ caveats | A- | 5.8 | 36.2 | 196.4 | 24 |
| **11** | `shadow-bench-mcdonalds-2025-test` | Apr 7 | 14:29→14:40 | 11 min | Publish w/ caveats | B+ | 9.5 | 9.2 | 69.5 | 14 |

---

## Tier Classification

### Tier 1 — Gold (Merged Multi-Pass)
| Run | Why it wins |
|-----|------------|
| `merged-v2` | 63 KB canonical, 200 fields, 14/20 exhibits at A, 5 contradictions, best-of-both merge of two independent extractions. The champion. |
| `merged` | Predecessor merge. Slightly smaller canonical (47 KB) but same A+ structure. |

These two runs are not comparable to single-session runs because they combined two independent extraction passes. They represent what a two-pass system can achieve.

### Tier 2 — Strong Single-Session
| Run | Why it's here |
|-----|-------------|
| `shadow-previous` | 47 KB canonical (matching merged), 65 min. The "NEW" half of the gold merge. Deepest single-session canonical ever achieved. |
| `shadow-bench-04-09` | 47 KB final report (!), 20 KB canonical, 42 min. Strongest narrative of any single-session. |
| `mcdonalds-2025` | Original gold base ("OLD" half of merge). 39 KB canonical, 36 min. Strong on structured data. |

### Tier 3 — Solid A-
| Run | Why it's here |
|-----|-------------|
| `shadow-test-04-07` | 39 KB report, 7.4 KB canonical. Very long report, thin canonical. Narrative-heavy approach. |
| `shadow-live-04-07-final` | Copy of shadow-final with B-pipeline patches. 36 KB report, 6 KB canonical. |
| `shadow-live-v2` | Only run to achieve **Verdict 1** (no caveats). 30 KB report, 13 KB canonical. Fastest to Verdict 1. |
| **`shadow-auto` (THIS)** | **24 min. 18 KB report, 16.4 KB canonical. Fastest full pipeline. Best state addenda. Thinnest narrative.** |
| `shadow-final-04-07` | 36 KB report, 6 KB canonical. Report-heavy, canonical-thin. |

### Tier 4 — Minimal
| Run | Why it's here |
|-----|-------------|
| `shadow-bench-test` | 11 min, 70 KB total. Proof of concept only. Missing enrichments, thin everything. |

---

## This Run's Rank: #9 of 11

### Where it lands among single-session runs only (excluding merges): #7 of 9

---

## Detailed Dimension-by-Dimension Scoring

Scoring each run on 10 dimensions, 1-10 scale.

| Dimension | merged-v2 | s-prev | s-bench-09 | mcd-2025 | s-test-07 | s-live-07f | s-live-v2 | **s-auto** | s-final-07 | s-bench-test |
|-----------|-----------|--------|------------|----------|-----------|------------|-----------|------------|------------|--------------|
| **Canonical depth** | 10 | 9 | 6 | 8 | 3 | 3 | 5 | **5** | 3 | 4 |
| **Report depth** | 5 | 7 | 10 | 4 | 9 | 8 | 8 | **5** | 8 | 4 |
| **Tables completeness** | 9 | 9 | 6 | 9 | 7 | 7 | 7 | **6** | 7 | 4 |
| **Exhibit walk depth** | 9 | 8 | 5 | 7 | 4 | 4 | 4 | **5** | 4 | 2 |
| **Financial notes** | 9 | 9 | 5 | 7 | 4 | 3 | 5 | **4** | 3 | 2 |
| **State addenda** | 7 | 6 | 5 | 5 | 8 | 7 | 7 | **8** | 7 | 3 |
| **Cohort comparability** | 6 | 6 | 8 | 3 | 5 | 5 | 5 | **8** | 5 | 3 |
| **Contradiction preservation** | 10 | 8 | 6 | 4 | 5 | 5 | 4 | **6** | 5 | 2 |
| **Speed (inverse)** | 10* | 3 | 5 | 6 | 5 | 10* | 6 | **9** | 6 | 8 |
| **Gate quality** | 9 | 8 | 8 | 7 | 7 | 8 | 5 | **7** | 8 | 6 |
| **TOTAL /100** | **84** | **73** | **64** | **60** | **57** | **60** | **56** | **63** | **56** | **38** |
| **RANK** | **1** | **2** | **3** | **4t** | **7** | **4t** | **8t** | **5** | **8t** | **11** |

*Speed score for merges reflects the efficiency of the merge step, not the source run duration.

### Rescored excluding merges (single-session only):

| Rank | Run | Score /100 |
|------|-----|-----------|
| 1 | `shadow-previous-mcdonalds-2025` | 73 |
| 2 | `shadow-bench-mcdonalds-2026-04-09` | 64 |
| **3** | **`shadow-auto-mcdonalds-2025` (THIS)** | **63** |
| 4 | `mcdonalds-2025` (gold base) | 60 |
| 5t | `shadow-live-mcdonalds-2026-04-07-final` | 60 |
| 6 | `shadow-test-mcdonalds-2026-04-07` | 57 |
| 7t | `shadow-live-mcdonalds-2025-v2` | 56 |
| 7t | `shadow-final-mcdonalds-2026-04-07` | 56 |
| 9 | `shadow-bench-mcdonalds-2025-test` | 38 |

---

## This Run Is #3 Among Single-Session Runs

**It is NOT the winner.** It trails `shadow-previous` by 10 points and `shadow-bench-09` by 1 point.

### What made shadow-previous (#1 single-session) so strong:
- 47.3 KB canonical (2.9x this run's 16.4 KB)
- 65 minutes vs 24 minutes — it simply read more pages more deeply
- Full B-pipeline (regression check, conflict adjudication, reconciliation) added structured patches
- 25.8 KB financial notes depth file (4.4x this run's 5.9 KB)
- 23.5 KB contract burdens (2.6x this run's 9.1 KB)

### What made shadow-bench-09 (#2 single-session) score 1 point higher:
- 46.9 KB final report (2.6x this run's 18 KB) — the single deepest narrative of any run
- 19.7 KB canonical (1.2x this run's 16.4 KB)
- 6 unresolveds vs this run's 3
- Had a head-to-head comparison doc (A3_HEAD_TO_HEAD.md, 12.8 KB)
- Took 42 min vs 24 min

### Why this run still scored close to bench-09:
- Best state addenda of any single-session (16 overrides vs 12)
- Best cohort comparability analysis (dedicated RT file with dollar impact at every tier)
- Fastest pipeline (24 min vs 42 min — 43% faster)
- Higher A1 completeness (23/23 items at A vs bench-09's starting B+)

---

## Timeline: All McDonald's Runs Chronologically

```
Apr 5 14:35  mcdonalds-2025 (gold base)              36 min   A     260 KB
Apr 6 21:17  shadow-previous-mcdonalds-2025           65 min   A     343 KB
Apr 6 22:38  mcdonalds-2025-merged (gold merge v1)     5 min   A+    360 KB
Apr 6 22:53  shadow-live-mcdonalds-2025-v2            35 min   A-    209 KB
Apr 7 13:46  mcdonalds-2025-merged-v2 (GOLD CHAMPION)  2 min   A+    381 KB
Apr 7 14:29  shadow-bench-mcdonalds-2025-test         11 min   B+     70 KB
Apr 7 15:13  shadow-test-mcdonalds-2026-04-07         38 min   A-    234 KB
Apr 7 21:33  shadow-final-mcdonalds-2026-04-07        35 min   A-    196 KB
Apr 7 22:27  shadow-live-mcdonalds-2026-04-07-final    5 min   A-    229 KB
Apr 9 21:17  shadow-bench-mcdonalds-2026-04-09        42 min   A-    266 KB
Apr 9 22:22  shadow-auto-mcdonalds-2025 (THIS)        24 min   A-    211 KB
```

### Trend observations:
- **Canonical size peaked Apr 6-7** (shadow-previous 47 KB, merged-v2 63 KB) and has been declining since. The Apr 9 runs produce 16-20 KB canonicals vs the 47 KB standard.
- **Report size peaked Apr 9** (bench-09 at 47 KB). The pipeline is shifting toward narrative over structured canonical.
- **Speed has improved** — from 65 min (shadow-previous) down to 24 min (this run). But speed came at the expense of depth.
- **Every single-session run hits A-**. No single-session run has achieved A or A+ without a merge step or a B-pipeline regression pass.

---

## How Bad Is This Run Compared to Each?

| vs. Run | Gap | Severity | What's missing |
|---------|-----|----------|----------------|
| vs. merged-v2 (gold) | -170 KB, -46.8 KB canonical | **Large** | Per-row litigation, full roster in canonical, 200-field breadth, enrichment differentiation |
| vs. shadow-previous | -132 KB, -30.9 KB canonical | **Large** | Same gap — shadow-previous was the gold's stronger half |
| vs. bench-09 | -55 KB, -3.3 KB canonical | **Small** | Mostly report depth (28.9 KB gap). Canonical is close. |
| vs. gold base (mcd-2025) | -49 KB, -22.5 KB canonical | **Medium** | Structured litigation rows, enrichment layers, larger initial canonical |
| vs. shadow-test-07 | -23 KB, +9 KB canonical | **Even/Slight win** | This run has better canonical; test-07 has better report |
| vs. shadow-live-v2 | +2 KB, +3.5 KB canonical | **Slight win** | This run is marginally better on both axes |
| vs. shadow-final-07 | +14 KB, +10.6 KB canonical | **Win** | This run has 2.8x the canonical and is faster |
| vs. bench-test | +141 KB, +6.9 KB canonical | **Clear win** | This run is a full pipeline; bench-test was minimal |

### Summary: This run beats 4, ties 1, and loses to 5 (plus the 2 merges).

---

## Specific A3 Gate Quality Comparison

| Dimension | This Run | Best Single-Session | Gap |
|-----------|----------|--------------------|----- |
| Gate file size | 11.2 KB | 14.4 KB (shadow-previous) | -22% |
| Has strongest-parts section | Yes (7 bullets) | Yes (all runs) | — |
| Has weakest-parts section | Yes (5 bullets) | Yes (all runs) | — |
| Has buyer-trust paragraph | Yes | Yes (all except shadow-live-v2) | — |
| Has unresolved taxonomy | Yes | Yes (bench-09, shadow-final, shadow-test) | — |
| Has FA clause-walk assessment | Yes | Yes (bench-09, shadow-final) | — |
| Has deferred-exhibit policy line | Yes | Yes (bench-09, shadow-final) | — |
| Has max-3 roadmap | Yes | Yes (bench-09, merged-v2) | — |
| Source-grounding | Yes | Yes (all post-Apr-7 runs) | — |

The A3 gate **structure** is complete and matches the best runs. The gate **substance** is adequate but not the deepest — bench-09's gate at 13.5 KB had more specific per-item analysis.

---

## What Would Make This Run #1 Single-Session

To beat shadow-previous's 73 points, this run would need +11 points. Estimated impact of each fix:

| Fix | Effort | Point gain | New score |
|-----|--------|-----------|-----------|
| Promote all 36 roster + 19 litigation rows to canonical | +15 min | +3 (canonical depth) | 66 |
| Deepen financial notes RT to 20+ KB with actual numbers | +10 min | +3 (financial notes) | 69 |
| Deepen contract burdens RT to 20+ KB with quoted clauses | +10 min | +2 (exhibit walk) | 71 |
| Write 35+ KB final report with per-item paragraphs | +15 min | +3 (report depth) | 74 |
| Add per-state Item 20 rows to tables JSON | +5 min | +2 (tables) | 76 |
| **Total** | **+55 min** | **+13** | **76 (new #1)** |

This would push the run to ~79 min total (24+55) and ~320 KB total output — competitive with shadow-previous's 65 min / 343 KB but with better prompts and more structured output.

---

## Bottom Line

**This run is #3 of 9 single-session runs and #9 of 11 overall.** It is not the winner. It is a fast, structurally complete extraction that hits the A- ceiling in 24 minutes but sacrifices depth for speed. The canonical is 74% smaller than gold, the financial notes depth file is 77% smaller, and the final report is 62% smaller than the best single-session narrative.

The run's strengths — speed (fastest), state addenda (deepest), cohort comparability (most quantified), and A1 completeness (only run with 23/23 A from A1) — are real but don't compensate for the depth deficits. To win, it needs to spend another ~55 minutes deepening canonical, RT files, and the narrative — at which point it would match shadow-previous's duration but produce a better-structured output.
