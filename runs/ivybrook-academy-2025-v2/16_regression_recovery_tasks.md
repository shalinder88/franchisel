# 16 Regression Recovery Tasks — Ivybrook Academy 2025 v2

Generated from `15_regression_check.md`. Prior run benchmark: `runs/ivybrook-academy-2025/09_final_canonical.json`.

## RR01 — Exhibit J auditor identity
- **exact_target**: `item21_financial_statements.auditor_name`
- **why_it_matters**: Auditor identity is a minimum-publishable Item 21 field. Absence breaks publish gate for a diligence-quality extraction.
- **likely_source_object**: Prior run canonical `item21_auditor_guaranty_financial_summary.auditor_identity` → "Reese CPA LLC, Ft. Collins, CO" (p170 of PDF). Cannot re-read image-only Exhibit J in v2 without vision OCR.
- **expected_output_filename**: patch 09_final_canonical.json and 12_canonical_enriched_v2.json; append to retry_log.
- **decision**: **EXECUTE** via benchmark backfill with provenance label "recovered from prior run (runs/ivybrook-academy-2025) vision-OCR pass."

## RR02 — Exhibit J audit opinion language
- **exact_target**: `item21_financial_statements.opinion_type`
- **why_it_matters**: Distinguishes between clean, qualified, and going-concern opinions. Critical for financial-health layer.
- **likely_source_object**: Prior run "Unmodified (clean) opinion. Going concern explicitly evaluated; no modification issued" (p170–171).
- **decision**: **EXECUTE** via benchmark backfill.

## RR03 — Exhibit J going-concern flag
- **exact_target**: `item21_financial_statements.going_concern_language`
- **why_it_matters**: Directly tests whether the cover-page Financial Condition Special Risk means going-concern. Prior run shows auditor evaluated and found no going-concern issue.
- **likely_source_object**: Prior run going_concern_flag field.
- **decision**: **EXECUTE** via benchmark backfill.

## RR04 — Exhibit J income statement (net income by year)
- **exact_target**: `item21_financial_statements.income_statement.net_income_{2022,2023,2024}`
- **why_it_matters**: Three-year profitability is the central Item 21 signal. Prior run has 2024 $313,055, 2023 $435,505, 2022 $309,239.
- **decision**: **EXECUTE** via benchmark backfill.

## RR05 — Exhibit J balance sheet (total assets, liabilities, cash 2024)
- **exact_target**: `item21_financial_statements.balance_sheet.{total_assets,total_liabilities,cash}_2024`
- **why_it_matters**: Leverage, liquidity, and equity composition cannot be assessed without this. Prior run has total assets $3,894,365, total liabilities $3,548,503, cash $300,274.
- **decision**: **EXECUTE** via benchmark backfill.

## RR06 — Exhibit J deferred franchise fees
- **exact_target**: `item21_financial_statements.balance_sheet.deferred_franchise_fees_2024`
- **why_it_matters**: Deferred franchise fees of $3,434,025 on total liabilities of $3,548,503 = 97% of total liabilities. This is the dominant balance-sheet item and explains the stockholder-equity ($345,862) vs total-revenue ($2.17M) gap. Prior run found it on p172 and p180.
- **decision**: **EXECUTE** via benchmark backfill.

## RR07 — Franchise Agreement clause-level depth
- **exact_target**: Clause-level text capture for FA §16 (Default/Termination), §17 (Post-term Rights), §21 (Indemnification), §23 (Dispute Resolution).
- **why_it_matters**: Burden-family level is captured; clause-level nuance is not. Not critical for publish but is a polishing task.
- **decision**: **SKIP** — non-material; Item 17 table already captures the relationship-level facts with section references.

## RR08 — Financial statement accounting policies
- **exact_target**: Revenue recognition policy, depreciation method, impairment policy, income-tax provision notes, lease accounting notes, related-party footnote.
- **why_it_matters**: Second-order financial-health detail.
- **likely_source_object**: Prior run `financial_notes_depth` actually marked these as "not surfaced" — they were not captured even in the vision-OCR run.
- **decision**: **SKIP** — benchmark also lacks these; no recoverable source.

## Conflicts to adjudicate in B3

**None.** There are no cases where v2 and the prior run disagree on a surfaced value. All differences are pure gaps (v2 missing fields that the prior run captured). No contradictions requiring adjudication.

## Summary

| Task | Target | Priority | Decision |
|---|---|---|---|
| RR01 | Auditor identity | HIGH | EXECUTE |
| RR02 | Opinion language | HIGH | EXECUTE |
| RR03 | Going-concern flag | HIGH | EXECUTE |
| RR04 | Income statement (net income × 3 years) | HIGH | EXECUTE |
| RR05 | Balance sheet (assets/liab/cash 2024) | HIGH | EXECUTE |
| RR06 | Deferred franchise fees | HIGH | EXECUTE |
| RR07 | FA clause-level walk | LOW | SKIP |
| RR08 | Accounting policies | LOW | SKIP (benchmark also lacks) |

**Material recovery tasks for B4**: 6 (RR01–RR06). All EXECUTE via benchmark backfill from `runs/ivybrook-academy-2025/09_final_canonical.json`.

**Real conflicts for B3**: 0.
