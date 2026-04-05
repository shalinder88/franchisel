# Regression Recovery Tasks — Rocky Rococo Pizza and Pasta (638785-2025)

Based on `15_regression_check.md` regressions R1–R5 and conflict fields C1–C3.

---

## RR-01: FA Operative Provisions Deep Read
- **task_name**: Franchise Agreement operative provisions recovery
- **exact_target**: FA Sections IX.D (data ownership/computerize), IX.E (credit cards), X.A-X.B (remodel), X.I (insurance), X.K (gift cards), XI (system modification), XII.E (EFT), XXI (security interest/UCC)
- **why_it_matters**: These sections create material franchisee burdens: UCC first lien on all property, mandatory insurance with franchisor as additional insured, EFT direct debit authorization, data ownership by franchisor, system modification compliance obligation, remodel once during term, $10K/5yr upgrade cost cap. None were structured in canonical.
- **likely_source_object**: Exhibit FA, pp.98–135
- **expected_output_filename**: RR-01_fa_operative_provisions.json

## RR-02: Financial Statement Notes Recovery (Advertising Actuals + VIE + Tax Split)
- **task_name**: Note 1 and Note 4 structured recovery
- **exact_target**: (a) Advertising expense actuals: $270,344 / $229,359 / $152,565 from Note 1. (b) VIE election under ASU 2018-17. (c) Note 4 income tax current/deferred split. (d) Key accounting policies: depreciation method (straight-line, 5-7yr), receivables (no allowance, no write-offs), subsequent events (through March 6, 2025), revenue recognition (franchise fees recognized at opening, royalty reduction credited to future balance).
- **why_it_matters**: Advertising actuals show RFC spends ~100% of collected ad fees. VIE election means Hester family entities are NOT consolidated — material for understanding financial statements. Tax split and accounting policies are standard depth the pipeline has demonstrated.
- **likely_source_object**: Notes to Financial Statements, pp.63–67
- **expected_output_filename**: RR-02_fs_notes_recovery.json

## RR-03: Conflict Adjudication Source Reads
- **task_name**: Resolve 3 conflict fields from source
- **exact_target**: (C1) Noncompete radius: FA p.45-46 vs FDA p.157. (C2) Computer access: Item 11 pp.31-32 vs FA pp.98-99. (C3) Royalty reduction mechanism: Item 6 p.15 vs Note 1 p.64.
- **why_it_matters**: These are genuine document-level tensions that need adjudicated values for the canonical.
- **likely_source_object**: FA, FDA, Item 6, Item 11, Note 1
- **expected_output_filename**: Part of 17_conflict_adjudication.md
