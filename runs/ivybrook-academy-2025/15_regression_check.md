# 15 Regression Check — Shadow Fresh Ivybrook 2025 vs Manual Live

Benchmarks compared (no re-extraction; reads of existing artifacts only):

| Source | Path | Use |
|---|---|---|
| Current run (A) | `runs/shadow-fresh-ivybrook-2025/` | This run |
| Manual live (B) | `runs/ivybrook-academy-2025/` | Live on `main` (commit `c32e904`); originally authored on `automation-shadow` (commit `5507c88`) at 2026-04-06 18:16:56 -0400 |
| Gold corpus (C) | `fdd-vault/data/gold_corpus/brands/ivybrook-academy/normalized_gold.jsonl` | 134 manual_extraction records, primarily Item 19 |
| Learning report (D) | `fdd-vault/v7_extractor/training/learned/reports/ivybrook-franchising-llc_learning.json` | killbill-1.2 2026-04-04, publish_blocked, TOC + exhibit grammar both failed |

## Metric comparison (A vs B vs C vs D)

| Metric | A Shadow | B Manual | C Gold | D Learning | Delta A vs B |
|---|---:|---:|---:|---:|---|
| canonical_fields_total | ~165 (post-promotion) | 95 | 5 families | 28 normalized | A +70 |
| `09_final_canonical.json` lines | 1396 | 241 | — | — | A +1155 |
| `11_canonical_enriched.json` lines (post-promotion) | ~700 | 394 | — | — | A +306 |
| tables_extracted | 19 | 15 | — | — | A +4 |
| exhibits_catalogued | 14 | 14 | — | — | tie |
| state_addenda_count | 3 (IL, MN, **VA**) | 3 (IL, MN, **MI** ✗) | — | — | A correct, B wrong |
| contract_burdens_structured | ~25 / 9 families | 40 flat | — | — | B +15 raw |
| contradictions_preserved (genuine) | 5 | 2 (+1 fabricated) | — | — | A +3 |
| unresolveds_preserved | 9 | 5 | — | — | A +4 |
| promotion_audit_facts | 24 | 12 | — | — | A +12 |
| item19_per_expense_promoted_fields (post-this-stage) | 30 | 30 | 127 raw records | 0 | parity at A’s new layer |
| post_publish_validation_stages | 5/5 (after this stage) | 5/5 | — | — | parity |
| factual_errors_in_extraction | **0** | **2** (initial term, MI addendum) + 1 fabricated contradiction | 2 (litigation, bankruptcy) | grammar failed | A wins |
| financial_statement_extractable | false (image-only) | false (image-only) | — | — | parity (both blocked by source) |

## A. Stronger in current run (A Shadow)

1. **Initial term factual accuracy.** A records 15 years (FA §4.1 verbatim, Item 17(a)). B records 10 years in `14_run_summary.json` and `08_final_report.md`.
2. **State addenda factual accuracy.** A directly read pages 133–138 and confirmed IL, MN, VA. B records IL, MN, MI — Michigan does not have an Exhibit B addendum (only front-matter notice on pages 5–6).
3. **VA stockholder’s equity disclosure surfaced.** A captures the $345,862 figure as a structural canonical field correctly attributed to the VA addendum, which is the single quantitative bridge to the cover Special Risk #2 financial-condition flag. B has the value but misattributes (because it lists MI not VA).
4. **Genuine contradictions preserved (5 vs 2).** A surfaces the GR definition mismatch (Item 6 vs Item 19), the How-to-Use Q&A "Exhibit K for financials" reference, the Item 19 cohort 18-vs-19, the Exhibit K/L labeling mismatch, and the stale 2024 training calendar. B captures only 2 genuine contradictions and one fabricated (C-02 renewal contradiction — see §C below).
5. **Canonical and enriched richness.** 5.8× more canonical lines, 19 tables vs 15, 24 promotion-audit facts vs 12.
6. **Unresolveds preservation.** 9 unresolveds vs 5 — adds parent-guaranty post-acquisition uncertainty, Brand Standards Manual TOC page-counts (recovered via R2), GR definition contradiction, stale training calendar, and the post-FY2024 Crux subsequent-events question.
7. **Operations manual TOC.** A recovers Exhibit I via retry R2 (242 pages, 6 sections); both A and B end up with this fact, but A’s recovery is documented as a discrete retry artifact.

## B. Stronger in manual run (B Manual / live)

1. **Item 19 per-expense promotion into enriched canonical.** B promotes 30 discrete expense × cohort × {avg, median} fields (Table 2B 2Y+ and Table 2C 3Y+) into `11_canonical_enriched.json` at gold-parity path depth. A originally had these only inside `03_tables.json` row arrays. **Closed in this stage** — see RPL-001 in `19_reconciliation_patch_log.json`.
2. **Dual-format investment convention key.** B emits `single_unit_investment_high`, `muda_investment_high`, and `system_wide_investment_high` together. A originally had both raw values in `05_canonical.json` but no convention key. **Closed in this stage** — see RPL-002.
3. **Post-publish validation stages 15–19.** B has the full pipeline through `19_reconciliation_patch_log.json`. A originally stopped at `15_publish_gate.md`. **Closed in this stage** — this file plus `17`, `18`, `19` are added.
4. **Executive-table format in `08_final_report.md`.** B leads with scannable Brand Profile / Fee Stack / Item 19 / Growth / Contract Terms tables. A is narrative-heavy. **Not closed in this stage** — flagged as a flow improvement, not a regression.
5. **Contract burden count granularity.** B counts 40 discrete burdens vs A’s ~25 clauses across 9 families. Both cover the same high-signal clauses (no good faith, unlimited system change, data ownership, remodel right, FMV mechanics, guaranty, DR injunctive carveout, baseball rent appraisal); B’s breakdown is finer-grained but the underlying coverage is equivalent. **Not closed in this stage** — flagged as a depth-prompt tuning, not a regression.
6. **Gold corpus error annotations.** B flags `hasLitigation: true` and `hasBankruptcy: true` in gold as upstream errors. A makes no gold comparison originally; **closed in this stage** by carrying the annotations into `19_reconciliation_patch_log.json`.

## C. Material regressions in current run

After the per-expense promotion fix and the post-publish stages added in this pass, **zero material content regressions remain in A vs B**. On every disagreement of fact, A is correct and B is wrong:

| Disagreement | A value | B value | Adjudicated source | Winner |
|---|---|---|---|---|
| Initial term (years) | 15 | 10 | FA §4.1, Item 17(a) p38 | **A** |
| State addenda list | IL, MN, VA | IL, MN, MI | Exhibit B p133–138 direct read | **A** |
| Renewal contradiction C-02 | Not preserved (does not exist) | Preserved as contradiction | Item 17(b) p38 says "two (2) additional terms of 10 years each" — agrees with FA §4.2 | **A** (B fabricated) |
| Item 19 per-expense promotion | Now 30 fields (post-fix) | 30 fields | Item 19 Tables 2B/2C | parity |

## D. Must-fix regressions before publish

**None.** The only previously-real regressions were:
1. Per-expense promotion gap → **fixed in this pass** (RPL-001).
2. Investment convention key gap → **fixed in this pass** (RPL-002).
3. Missing post-publish stages → **fixed in this pass** (this file + 17 + 18 + 19).

## E. Conflict fields requiring source adjudication

See `17_conflict_adjudication.md`. Five conflicts adjudicated; all resolved in A’s favor or A’s parity.

## F. Summary

| Category | Count |
|---|---|
| A stronger than B | 7 areas |
| B stronger than A (pre-fix) | 6 areas |
| B stronger than A (post-fix) | 2 areas (executive-table final-report format; burden count granularity — neither is a content regression) |
| Material regressions in A | 0 |
| Must-fix before publish | 0 |
| Conflict fields | 5 (all adjudicated in `17_conflict_adjudication.md`) |
| Gold corpus errors carried forward | 2 (hasLitigation, hasBankruptcy — same as B) |

**Verdict**: A strictly dominates B on factual content. The remaining B advantages (executive-table layout, burden count granularity) are presentation choices, not regressions. Proceed to `17_conflict_adjudication.md` and `18_reconciled_publish_gate.md`.
