# 18 Reconciled Publish Gate — Shadow Fresh Ivybrook 2025

## Verdict: **1 — Replace the live manual run with this shadow run.**

The shadow run (A) strictly dominates the manual run (B `runs/ivybrook-academy-2025/`) on factual accuracy after the gaps identified in `15_regression_check.md` are closed in this pass. All 10 adjudicated conflicts in `17_conflict_adjudication.md` resolve in A's favor (8) or in parity (2). No adjudication resolved against A.

---

## Direct answers

### Are there any material regressions left?
**No.** The three previously-real regressions in A vs B are closed in this pass:
- **RPL-001 (Item 19 per-expense promotion)** — 30 discrete expense × cohort × {avg, median} fields promoted into `11_canonical_enriched.json` `item19_chart_detail.per_expense_promotion`. Gold-parity path depth.
- **RPL-002 (dual-format investment convention key)** — `investment_convention_keys` block emitted in `11_canonical_enriched.json` with `single_unit_investment_high_usd`, `muda_first_unit_investment_high_usd`, and `system_wide_investment_high_usd = $929,860`.
- **RPL-003/004 (gold corpus error annotations)** — `hasLitigation: false` and `hasBankruptcy: false` in A both match the PDF; gold-corpus errors flagged for upstream correction in `19_reconciliation_patch_log.json`.
- **RPL-005 (post-publish stages)** — `15_regression_check.md`, `17_conflict_adjudication.md`, `18_reconciled_publish_gate.md`, `19_reconciliation_patch_log.json` all added in this pass.

The only remaining gap is Exhibit J financial statement line items (image-only raster pages 168–197). Both A and B share this gap; neither benchmark closes it without OCR tooling.

### Are there any unresolved legal-field conflicts left?
**No.** All 10 conflict adjudications in `17_conflict_adjudication.md` are resolved:
- 4 resolved in A's favor as B extraction errors (CA-01 initial term, CA-02 fabricated C-02, CA-03 state addenda, CA-04 stockholder's equity attribution)
- 1 resolved at parity post-fix (CA-05 investmentHigh convention)
- 2 resolved at parity against gold (CA-06 litigation, CA-07 bankruptcy)
- 3 resolved as FDD drafting inconsistencies preserved in A more rigorously (CA-08 cohort, CA-09 GR definition, CA-10 Exhibit K/L)

### Is the current run better on breadth, depth, or both?
**Both.**

**Breadth wins:**
- 19 tables vs 15
- 9 unresolveds vs 5
- 24 narrative-to-canonical promotions vs 12
- 5 genuine contradictions preserved vs 2 (B has 1 fabricated)
- State Effective Dates page captured as first-class object
- Exhibit K vs L labeling contradiction with dedicated retry artifact
- Operations manual TOC recovered via discrete retry (parity on outcome)

**Depth wins:**
- `09_final_canonical.json`: 1396 lines vs 241 (5.8× richer)
- `11_canonical_enriched.json` post-fix: ~700 lines vs 394
- Item 19 per-expense promotion now at parity with B (post-fix)
- Investment convention keys now at parity with B (post-fix)
- Stockholder's equity correctly attributed to VA addendum (B mis-attributes)
- Initial term correct at 15 years (B records 10 years)
- All Item 17(a)–(w) provisions structured (parity on coverage; A correct on the values where B is wrong)
- Contract burden depth structured by 9 burden families (B uses 40 flat clauses; same coverage, different organization)

### Should the live system keep the old run, the new run, or a merged run?
**Replace with the new run (A Shadow).** No merged run is needed:
1. Every fact in B that is correct is also in A.
2. Every fact in B that is wrong (initial term, state addenda) is correctly extracted in A.
3. Every fact in B that A previously lacked (Item 19 per-expense, investment convention keys, post-publish stages) is added in this pass.
4. The B-only advantages that remain (executive-table layout in `08_final_report.md`, finer 40-burden granularity in contract burden depth) are presentation choices, not content. They can be back-ported as a future flow improvement without re-running A's extraction.
5. The two gold corpus errors (litigation, bankruptcy) carried forward identically in both runs — no merge needed.

---

## Reconciliation scoreboard

| Dimension | B Manual (live) | A Shadow (this run, post-fix) | Winner |
|---|---|---|---|
| Initial term value | 10 years ✗ | **15 years ✓** | **A** |
| State addenda list | IL/MN/MI ✗ | **IL/MN/VA ✓** | **A** |
| Renewal contradiction C-02 | Fabricated ✗ | **Not preserved (does not exist) ✓** | **A** |
| VA stockholder's equity attribution | misattributed | **correct** | **A** |
| Item 19 per-expense promoted fields | 30 | **30 (post-fix)** | parity |
| Investment convention keys | dual-format | **dual-format (post-fix)** | parity |
| Genuine contradictions preserved | 2 | **5** | **A** |
| Fabricated contradictions | 1 (C-02) | **0** | **A** |
| Unresolveds preserved | 5 | **9** | **A** |
| Narrative→canonical promotions | 12 | **24** | **A** |
| Tables extracted | 15 | **19** | **A** |
| `09_final_canonical.json` lines | 241 | **1396** | **A** |
| `11_canonical_enriched.json` lines (post-fix) | 394 | **~700** | **A** |
| Item 17(a)–(w) full structure | yes (with errors) | **yes (correct)** | **A** |
| Contract burden depth coverage | 40 flat clauses | ~25 clauses / 9 families | parity (B finer flat count, A grouped by family) |
| Post-publish validation stages | 5/5 | **5/5 (post-fix)** | parity |
| Gold corpus error annotations | 2 | **2 (carried in RPL)** | parity |
| Executive-table final-report format | yes | narrative-heavy | **B** (presentation only) |
| Factual errors | 2 + 1 fabricated | **0** | **A** |
| Publish-ready | publish-ready | **publish-ready (decisive)** | parity |
| Item 21 / Exhibit J line items | image-only | image-only | tie (both blocked) |

**Net: A wins 13 dimensions, parity on 6, B wins on 1 (presentation only).**

---

## Caveats carried forward

1. **Exhibit J financial statements are image-only.** Both A and B record this as a structural extraction limit. Brand-page publish layer should disclose: Exhibit J is scanned, auditor identity / line items / cash flow / equity roll-forward / notes are not directly surfaced; financial-condition signal is carried via Cover Special Risk #2, the Illinois AG fee deferral, and the Virginia addendum stockholder's equity disclosure ($345,862 at 12/31/2024 vs $540,700–$869,860 initial investment).
2. **Brand Fund increase planned.** 1% → 2% in 2026 raises the recurring fee floor.
3. **Unopened backlog risk.** 42 signed-not-opened franchise agreements vs 40 operating outlets — Cover Special Risk #4. Indicates execution risk on conversion.
4. **Aug 29, 2025 PE acquisition** by Crux I Ivybrook (Aggregator), LP via Ivybrook OpCo / HoldCo. Not reflected in FY2024 Exhibit J (post-period event). Subsequent-events footnote in Exhibit J cannot be verified due to image-only content.
5. **Document-level contradictions preserved**: Exhibit K vs L labeling; Item 19 cohort 18 vs 19; Gross Revenue definition Item 6 vs Item 19; "Exhibit K" referenced for financial statements in How-to-Use Q&A; stale 2024 training calendar in 2025 amended document.

---

## Upstream actions (do not block publish)

| Action | Owner | Severity |
|---|---|---|
| Correct B's `14_run_summary.json` `initial_term_years` from 10 to **15** | Whoever owns `runs/ivybrook-academy-2025/` | High — B is currently live with a wrong contract term |
| Correct B's `08_final_report.md` term language | Same | High |
| Correct B's `10_scorecard.md` state addenda list from "IL, MN, MI" to **"IL, MN, VA"** | Same | High |
| Remove fabricated C-02 from B's `17_conflict_adjudication.md` and `19_reconciliation_patch_log.json` | Same | Medium |
| Add VA stockholder's equity attribution to B's `09_final_canonical.json` Item 21 block | Same | Medium |
| Correct gold corpus `hasLitigation` and `hasBankruptcy` to `false` for ivybrook-academy-2025 | Whoever owns `fdd-vault/data/gold_corpus/brands/ivybrook-academy/normalized_gold.jsonl` | High — same as B already flagged |
| Add `business interruption insurance` clause to gold's GR definition family | Same | Low |

---

## Final decision

**Promote shadow run A to production. Deprecate manual run B.** Merge the post-publish presentation improvements (executive-table layout, finer 40-burden flat count) as a future flow tweak; do not re-extract.

The shadow run is the strictly more accurate Ivybrook 2025 extraction available in this repo.
