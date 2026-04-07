# B1 Regression Check — Embassy Suites 2025

## Benchmark sources
| Source | Path | Status |
|---|---|---|
| Prior run | `runs/embassy-suites*` (any prior Embassy run) | **NOT FOUND** — only `embassy-suites-2025-test` exists |
| Gold corpus per-brand | `fdd-vault/data/gold_corpus/brands/embassy-suites/` | **NOT FOUND** |
| Gold corpus families | `fdd-vault/data/gold_corpus/families/` | exists but no Embassy Suites brand entry under any family |
| Any `*embassy*` / `*hilton*` artifact in repo | `find . -iname "*embassy*"` | **NOT FOUND** outside the source PDF and this run dir |

Confirmed via filesystem search (post-second-look with broader tools): the gold corpus brands folder contains chick-fil-a, cookie-advantage, cupbop, drybar, grabbagreen, great-clips, hallmark-homecare, home-halo, i9-sports, ivybrook-academy, jersey-mike-s, mcdonald-s, planet-fitness, servpro, sweat440, ziggis-coffee — **no Embassy Suites or Hilton brand entry**. No Hilton-family hotel brand exists in the gold corpus at all.

Per B1 rules, when neither prior run nor gold corpus is available, the task degrades to **self-audit**.

## Self-audit of current run

### Internal consistency
| Check | Result |
|---|---|
| Source map body items align with Item 17 TOC pages | PASS |
| Item 20 end-of-year 2024 (237) matches Exhibit A list scope (hotels as of 2024-12-31) | PASS |
| Item 19 220 Comparable Hotels = 32 CM + 188 FM | PASS |
| Item 21 auditor in `09_final_canonical.json` matches `retry_R1.json` and `RT_depth_financial_notes.json` (Cherry Bekaert) | PASS |
| Fee stack in `03_tables.json` consistent with `05_canonical.json` and `12_canonical_enriched_v2.json` | PASS |
| `state_addenda_overrides` count (11) matches `RT_depth_state_addenda_promotion.json` | PASS |
| Balance sheet totals (2024: $1,269,897K assets = $692,892K liab + $577,005K equity) | PASS |

### Completeness (weighted)
- Weighted canonical coverage ≈ 90% (per `10_scorecard.md`).
- All scoring gates PASS (Items 5-7, 19, 20, 21, 22, 23).
- All publish-gate critical checks PASS (per `15_publish_gate.md` verdict 2).

### Evidence grounding
- Every high-severity canonical field has page-level provenance.
- Exhibit C financial numbers cross-verified across `retry_R1.json` and `RT_depth_financial_notes.json`.
- State addenda overrides cited to pages 266-274.

## Dimension-by-dimension (self-audit only, no benchmark)
| Dimension | Current run value | Benchmark | Assessment |
|---|---|---|---|
| tables_count | 13 (in 03_tables.json) | — | self-audit: adequate |
| table_rows_count | ~150 across Items 5/6/7/19/20 | — | self-audit: adequate |
| table_notes_count | ~25 (captured in table_notes arrays) | — | self-audit: adequate |
| evidence_grounded_fields_count | ~120+ in canonical | — | self-audit: strong |
| exhibits_mapped_count | 18 | — | self-audit: complete |
| exhibits_deep_read_count | 2 (C fully, J-1 fully) + 1 structural-deep (D via Item 17) | — | self-audit: moderate |
| state_addenda_count | 11 (structured) | — | self-audit: strong |
| litigation_count | 5 pending + 4 concluded | — | self-audit: complete |
| franchisee_list_depth | structural (count 237 confirmed) | — | self-audit: adequate for publish, not row-level |
| item19_completeness | 5 chart families + New Generation + caveats | — | self-audit: complete |
| item20_completeness | 5 tables + gag flag + association flag | — | self-audit: complete |
| item21_completeness | auditor + opinion + BS + IS + CF + 9 notes | — | self-audit: complete |
| contract_burden_depth | ~48 clauses (Item 17 + fee map + non-curable grounds) | — | self-audit: moderate (FA not raw-read) |
| financial_note_depth | 9 notes | — | self-audit: complete |
| canonical_field_count | ~120+ populated | — | self-audit: strong |

## Regressions
**None identified** (no external benchmark against which to regress).

## Improvements
**None identified** (no external benchmark against which to improve).

## Matches
**None identified** (no external benchmark).

## Summary
- Total regressions: 0
- Total improvements: 0
- Total matches: 0
- Self-audit: **PASS**
- B1 effective outcome: no-op; no prior baseline exists for this PDF in this repo.
