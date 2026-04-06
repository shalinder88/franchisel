# Regression Recovery Tasks — Ivybrook Academy FDD (637976-2025)

Derived from `15_regression_check.md`. The regression check found **no must-fix regressions** — current run strictly dominates the benchmark. Only one narrow promotion-depth gap and one convention mismatch warrant targeted recovery.

## RR-01 — Promote Table 2C per-expense fields to enriched canonical

- **task_name:** item19_table2c_per_expense_promotion
- **exact_target:** Promote each expense line from Table 2C (3yr+ cohort) as individually-pathed numeric fields in `11_canonical_enriched.json` and `12_canonical_enriched_v2.json`, matching the gold corpus path depth (`item19.table2C_franchisee3YearsPlus.expenses.<line>.avg`, `.median`, `.pctOfRevenue`).
- **why_it_matters:** Gold has 100+ per-expense records for Table 2C; current enriched canonical only carries aggregate cohort stats. Data is fully extracted in `03_tables.json` T19-02BC — this is a promotion gap, not an extraction gap. Downstream economics scoring depends on per-line availability.
- **likely_source_object:** `03_tables.json` table `T19-02BC` (already contains all values)
- **expected_output:** Inline update to `11_canonical_enriched.json` and `12_canonical_enriched_v2.json` under `item19_chart_detail.franchisee_3yr_plus.expenses`; patch logged in `19_reconciliation_patch_log.json`

## RR-02 — Dual-format investmentHigh promotion

- **task_name:** investment_high_dual_format
- **exact_target:** Promote both `single_unit_investment_high` ($869,860) and `muda_investment_high` ($929,860) as distinct canonical fields, plus a `system_wide_investment_high` convention field that aligns with the gold's use of $929,860.
- **why_it_matters:** Gold uses $929,860 (MUDA ceiling) as `investmentHigh`. Current run uses $869,860 (single-unit). Both are in the PDF. Downstream brand-page comparison and scoring rely on a consistent convention. Promoting both eliminates the ambiguity.
- **likely_source_object:** FDD cover (p. 1); Item 7 Table T7-01 and T7-02
- **expected_output:** Inline update to `09_final_canonical.json`, `11_canonical_enriched.json`, `12_canonical_enriched_v2.json`; patch logged in `19_reconciliation_patch_log.json`

## RR-03 — Gold-error flagging (litigation and bankruptcy)

- **task_name:** gold_error_annotation
- **exact_target:** The normalized gold has `hasLitigation: true` and `hasBankruptcy: true`, both of which contradict the PDF. Current run correctly records both as `false` / none disclosed. Add a regression annotation in `09_final_canonical.json` and the run summary documenting that the gold records are in error and should be corrected upstream.
- **why_it_matters:** When a downstream learning loop re-ingests gold for training, the erroneous gold records would degrade extractor performance. Flagging this prevents regression in future runs.
- **likely_source_object:** PDF Item 3 (p. 11) and Item 4 (p. 11)
- **expected_output:** Inline annotation in `09_final_canonical.json` under `regression_annotations`; patch logged in `19_reconciliation_patch_log.json`

---

**No recovery needed for:** operative exhibits (none lost), rent economics (complete in T19-02BC and T7-01), litigation detail (none to recover — gold is wrong), guaranty detail (Exhibit F fully structured), franchisee list depth (88 entries extracted), legal field coverage (40 burdens structured).
