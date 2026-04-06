# Comparison Memo — Shadow Fresh vs Manual Ivybrook 2025

Current (shadow): `runs/shadow-fresh-ivybrook-2025/`
Previous strongest manual: `runs/ivybrook-academy-2025/`

Scope: comparison-only. No files modified. No re-extraction. No cross-brand comparison.

---

## 1. Stronger in current (shadow) run

### Factual accuracy on core contract terms
- **Initial term: 15 years (shadow) vs 10 years (manual).** Shadow matches FA §4.1 ("the 15th anniversary of the date that Franchisee opens the Franchised Business") and Item 17(a). Manual records `initial_term_years: 10` in `14_run_summary.json` and "Term: 10 years" in its final report. This is a hard factual miss by the manual, not a convention disagreement.
- **State addenda: IL, MN, VA (shadow) vs IL, MN, MI (manual).** Shadow directly read Exhibit B pages 133–138 and confirmed Virginia (with the stockholder's equity risk factor). Manual lists Michigan, but Michigan appears only as front-matter provisions (pp. 5–6), not as an Exhibit B addendum. Manual hallucinated the MI addendum and missed the VA addendum.
- **Renewal count contradiction C-02 in manual is spurious.** Manual's `17_conflict_adjudication.md` claims Item 17(b) says "one additional 10-year term" and adjudicates against FA §4.2 saying "max 2 renewal terms." Direct read of Item 17(b) in shadow shows "You may renew for two (2) additional terms of 10 years each" — Item 17 and FA §4.2 agree. Manual manufactured a contradiction.

### Canonical / enrichment richness
- `09_final_canonical.json`: shadow **1396 lines** vs manual **241 lines** (~5.8× richer).
- `11_canonical_enriched.json`: shadow **619 lines** vs manual **394 lines**.
- `03_tables.json`: shadow **19 tables / 617 lines** vs manual **15 tables / 465 lines**.
- Shadow preserves **5 contradictions** vs manual **2**.
- Shadow surfaces additional contradictions manual missed: Gross Revenue definitional mismatch between Item 6 Note 2 and Item 19 Note 3; "How to Use" Q&A pointing to Exhibit K for financial statements; stale "once per quarter in 2024" training calendar reference.

### State addenda structure
- Shadow correctly identifies IL (fee-deferral mandated by IL AG for financial-condition reason), MN (80C protections), and **VA (stockholder's equity $345,862 risk factor — materially important indirect signal for Item 21 gap)**. Manual missed the VA stockholder's equity disclosure entirely because it listed Michigan instead.
- Shadow surfaces the State Effective Dates page as a structural object with all 14 states + statuses. Manual does not treat it as a first-class object.

### Exhibit structure
- Shadow catches and confirms the **Exhibit K vs Exhibit L labeling mismatch** between TOC, Item 20 body, How-to-Use Q&A, and physical page headers, with a dedicated retry artifact (`08c_retry_exhibit_label_confirmation.md`). Manual mentions the labeling issue but does not confirm it as a document-level error separate from extraction noise.
- Shadow's exhibit catalog documents the physical-header vs TOC-label mismatch explicitly per exhibit row.

### Item 21 depth (indirect)
- Shadow captures three independent financial-condition signals and promotes **stockholder's equity $345,862** as a surfaced structural field (via the VA addendum), plus franchisor 2024 total revenue **$2,171,363** from Item 8. Manual has the $345,862 figure but because it missed the VA addendum it doesn't attribute it correctly.

### Unresolveds
- Shadow preserves 9 unresolveds vs manual's 5 — the additional 4 are the Gross Revenue definitional mismatch, the stale 2024 training-calendar reference, the post-acquisition parent-guaranty unknown, and the Brand Standards Manual TOC page counts (which shadow then closes via retry R2).

### Item 19 depth
- Parity on table extraction (both have Tables 1, 2A, 2B, 2C, 3). Shadow additionally preserves the **Table 2C cohort-size contradiction (18 vs 19)** as a first-class unresolved; manual notes it as a "low impact" carry-forward but does not structurally preserve it in the canonical.
- Shadow promotes the **constructive-royalty / constructive-Brand-Fund note** on Table 2A (affiliate does not actually pay those lines) as a structured caveat in the enriched canonical. Manual captures the note in narrative but not in the enriched structure.

### Item 20 depth
- Parity on the five tables. Shadow additionally structures the **ceased-communication franchisees** (Gail/Steve Ostroff PA, Kashif Dhukka TX, Annie Starkey TX) as a separate structural list; manual includes them but less explicitly.

---

## 2. Stronger in manual run

### Post-publish validation stages (biggest single gap)
Manual has a full post-publish-gate pipeline that shadow does not:
- `15_regression_check.md` — metric-by-metric comparison against gold corpus and prior learning report, with classification codes (1–5).
- `16_regression_recovery_tasks.md` — structured recovery task list for gold-parity gaps.
- `17_conflict_adjudication.md` — direct-source adjudication of 12 priority legal/economic fields.
- `18_reconciled_publish_gate.md` — decisive verdict ("1 — Replace") with reconciliation scoreboard.
- `19_reconciliation_patch_log.json` — structured patch log of all applied changes.

Shadow stops at `15_publish_gate.md` with a softer "publish-ready with caveats" verdict and no gold-corpus diff.

### Per-expense promotion into enriched canonical
Manual's regression recovery (RR-01) promotes **30 per-expense fields** (15 expense lines × 2 cohorts: 2Y+ and 3Y+) into `11_canonical_enriched.json` at the same path depth as the gold corpus for Item 19 Table 2B/2C. Shadow captures all the same values in `03_tables.json` rows but does not individually promote them to enriched-canonical path depth.

### Executive-format final report
Manual's `08_final_report.md` leads with scannable tables (Brand Profile, Fee Structure, Item 19 Performance, System Growth, Key Contract Terms, Special Risks) and is ~104 lines of mostly tabular content. Shadow's 163-line final report is narrative-heavy and harder to scan. Manual format is clearly more publish-layer-ready.

### Contract burden count granularity
Manual counts **40 discrete contract burdens** from its FA walk; shadow counts **~25 clauses across 9 families**. Both cover the same high-signal clauses (no-fiduciary, unlimited system change, data ownership, remodel right, FMV mechanics, guaranty, dispute resolution), but manual's breakdown is finer-grained.

### Dual-format investment convention
Manual explicitly promotes both `single_unit_investment_high: 869860` and `muda_investment_high: 929860` **plus** a `system_wide_investment_high: 929860` field to match gold corpus convention. Shadow has both values in `05_canonical.json` but does not emit the convention-alignment `system_wide_investment_high` key.

### Gold-corpus regression annotations
Manual flags two gold-corpus errors (`hasLitigation: true` and `hasBankruptcy: true` in gold — both wrong) as regression annotations for upstream correction. Shadow makes no gold-corpus comparison and emits no annotations.

---

## 3. Material regressions in current (shadow) run

None of the manual-run findings represent a factual regression that the shadow is wrong about. The gaps below are structural / pipeline gaps rather than content errors:

1. **No regression-check / conflict-adjudication / reconciled-gate stages** (stages 15–19 in manual). Shadow has none of these.
2. **Per-expense Table 2B/2C promotion into enriched canonical** is shallower. Data is present in `03_tables.json` but not in `11_canonical_enriched.json` at per-expense path depth.
3. **Executive-table format** in the final report is less scannable.
4. **No `system_wide_investment_high` convention key** even though both underlying values are captured.
5. **No gold-corpus delta annotations** — shadow run is standalone.
6. **Shadow publish-gate verdict is softer** than warranted. Given factual accuracy of shadow exceeds manual on two hard contract terms (initial term, state addenda), shadow probably deserves a harder "publish-ready, replace prior" verdict, not "publish-ready with caveats."

No factual content in shadow is worse than the manual. On the two hard contract facts that disagree (initial term and VA-vs-MI addendum), **shadow is correct and manual is wrong.**

---

## 4. Must-fix regressions before automation can be trusted

**There are no content regressions that must be fixed in the shadow automation run for the automation to be trusted.** On factual accuracy shadow strictly beats manual (+2 hard-fact corrections: 15-year term, VA addendum). The trust gap is pipeline-structural, not accuracy-structural.

For the automation flow to match what a full manual run ships, add these three structural must-have stages (none of which change existing extracted content):

1. **Post-publish regression-check stage.** Add a mandatory `15_regression_check.md` / `17_conflict_adjudication.md` / `18_reconciled_publish_gate.md` triad whenever a gold corpus or prior learning-report baseline exists for the brand. This enables gold-error flagging (as manual did for `hasLitigation` / `hasBankruptcy`) and decisive publish verdicts.
2. **Per-expense promotion into `11_canonical_enriched.json`** for Item 19 Table 2B and 2C. Current shadow treats table rows as the promotion layer; gold parity requires each expense line × each cohort (2Y+, 3Y+) × [avg, median] as a discrete promoted field. This is a ~30-field promotion pattern that should run automatically on any FDD with multi-cohort Item 19 tables.
3. **Dual-format investment convention key.** Whenever both single-unit and MUDA totals exist, emit `single_unit_investment_high`, `muda_investment_high`, **and** `system_wide_investment_high` (= max of the two) so downstream products using either convention can read the canonical without transformation.

---

## 5. Five smallest prompt/flow fixes with highest expected impact

### Fix 1 — Add a fixed post-publish validation stage to the pipeline prompt
**Change:** Extend the pipeline prompt so that after `15_publish_gate.md` is written, the pipeline automatically runs (a) a gold-corpus regression check if a gold baseline exists, (b) a conflict adjudication step that reads each conflict source quote directly from the PDF, (c) a reconciled publish gate with a 1–4 decisive verdict, and (d) a reconciliation patch log.
**Expected impact:** Closes the single biggest gap between automation and manual runs. Catches gold-corpus errors (manual found 2). Converts "publish-ready with caveats" into a clear replace/keep decision. Cost: four new files, one extra pipeline stage.

### Fix 2 — Promote Item 19 Table 2B/2C per-expense rows into the enriched canonical by default
**Change:** In the Step 10 enrichment prompt, enforce that every expense line in any Item 19 cohort income-statement table is promoted as a discrete key into `item19_chart_detail.charts[*].lines_avg` / `lines_median` rather than kept only inside the raw `03_tables.json` row arrays. Emit at least `{line_name, avg_usd, median_usd, pct_of_gross_revenue_avg, cohort_n}` per line.
**Expected impact:** Closes the per-expense promotion gap that manual had to recover via a separate regression task. Makes downstream unit-economics widgets render without a second pass. Cost: ~20 extra lines of structured promotion per run, mechanical transformation, no new judgment.

### Fix 3 — Executive-table final report format
**Change:** In the Step 9 final-report prompt, require the opening sections to be tables (Brand Profile, Fee Structure, Item 19 Performance, System Growth, Key Contract Terms, Special Risks). Narrative prose goes after, not before, the tables. Forbid narrative-only sections 1–8.
**Expected impact:** Publish layer can render the final report directly. Cuts review time. No content change — shadow already has all these facts in narrative; the change is layout-only. Cost: ~30 lines of markdown tables, negligible token increase.

### Fix 4 — Enforce direct-read verification of two hard-error-prone fields: initial term and state addenda list
**Change:** In the Step 5 canonical prompt, require two explicit direct-read steps:
- Initial term must quote FA §4.1 verbatim AND Item 17(a) verbatim; canonical records the value only if both match.
- State addenda list must be built by directly reading each addendum's title-block page, not from the TOC or from the State Effective Dates page. Canonical records each addendum with its starting page.
**Expected impact:** This is exactly the pair of errors where the manual run fabricated wrong values (10-year term, MI addendum). A fresh automation pass should never repeat either mistake. Cost: two extra verification quotes per run.

### Fix 5 — Dual-format investment convention key and publish-gate verdict granularity
**Change:** (a) In Step 10, whenever both single-unit and MUDA investment totals exist, mandatorily emit `single_unit_investment_high`, `muda_investment_high`, and `system_wide_investment_high = max(...)` into `11_canonical_enriched.json`. (b) In Step 13 publish-gate, require the verdict to choose explicitly among `publish_ready`, `publish_ready_with_caveats`, `needs_focused_recovery`, `not_production_ready`, and forbid verdicts that hedge without selecting one of the four labels.
**Expected impact:** Resolves the gold-convention mismatch automatically and forces a harder publish decision. Manual had to do both of these by hand. Cost: three extra keys and one verdict enum.
