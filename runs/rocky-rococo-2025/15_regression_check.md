# Regression Check — Rocky Rococo Pizza and Pasta (638785-2025)

**Current run**: `rocky-rococo-2025/` (17 files, 97.8% weighted score)
**Benchmark**: Pipeline best — `chick-fil-a-2025/` (20 files, 100.0% post-gold-regression)
**Gold/learning sources**: None exist for Rocky Rococo. Self-regression against pipeline-demonstrated capabilities only.

---

## Metric Comparison

| Metric | Current Run | CFA Benchmark | Delta | Classification |
|---|---|---|---|---|
| tables_count | 14 | 14 | 0 | Parity |
| table_rows_count | ~130 | 94 | +36 | Current stronger (more outlet tables) |
| table_notes_count | ~25 | 20 | +5 | Current stronger |
| evidence_grounded_fields_count | 104 | 40 top-level | Different schema; current has more atomic fields | N/A — schema difference |
| exhibits_mapped_count | 5 | 10 | -5 | Current weaker — but RR has only 5 exhibits in the FDD |
| exhibits_deep_read_count | 0 | 6 | **-6** | **Current weaker — no FA deep read performed** |
| state_addenda_count | 0 (confirmed absent) | 13 | 0 | N/A — RR has no addenda in PDF |
| litigation_count | 0 | 2 | 0 | N/A — RR has no litigation |
| franchisee_list_depth | 20 entities structured | 384 entries CID-decoded | Different scale | RR smaller system; extraction complete |
| key_exhibit_coverage | FA summarized only | FA deep read (11_fa_deep_read.md) | **Gap** | Missing FA deep read |
| financial_statement_depth | 3 statements + 5 notes, some null cells | 3 statements + notes + key ratios | **Gap** | Missing: accounting policies structured, tax provision split, advertising expense actuals |
| guaranty_depth | Identified location + scope | Structured fields | **Gap** | Missing: guarantor chain detail, subordination provisions |
| key_legal_term_coverage | 17 table (a-w) extracted | 17 table + state overrides + noncompete modifications | **Gap** | Missing: insurance req, security interest/UCC, EFT, system modification, data ownership |
| audit_richness | Auditor, opinion, date | Auditor + opinion + date + subsequent events + key ratios | **Gap** | Missing: computed ratios in canonical |
| scorecard_richness | Weighted % + field counts | 15-category detailed scoring + production usability assessment | Comparable | Minor format differences |

---

## A. Stronger in Current Run

| Dimension | Detail | Classification |
|---|---|---|
| Table extraction volume | 14 tables with ~130 rows vs CFA's 94 rows | Pipeline fit — RR has more Item 20 tables |
| Table notes depth | Comprehensive fee notes (8 Item 6 notes), training notes, outlet table notes | Pipeline fit |
| Contradiction tracking | 3 contradictions with reconciliation notes | Stronger than CFA's 1 |
| Unresolved tracking | 4 unresolveds with severity ratings | Comparable to CFA's 3 |
| Franchisee multi-unit analysis | 5 multi-unit operator groups identified with cross-entity mapping | Not present in CFA run |
| Predecessor-franchised wind-down tracking | Full 3-year tracking of 7→0 predecessor conversion | Unique to RR |

## B. Stronger in Pipeline Benchmark (CFA)

| Dimension | What CFA Has | What RR Lacks | Severity | Classification |
|---|---|---|---|---|
| **FA deep read** | 11_fa_deep_read.md — sections 6.11, 7.3, 8, 9, 10, Addendum C/D | No FA deep read file. Key provisions (security interest, insurance, EFT, data ownership, system modification, remodel) not structured | **HIGH** | 2 — missing promoted field |
| **Insurance requirements** | Structured `insurance_requirements` field in canonical | Not in canonical | **MEDIUM** | 2 — missing promoted field |
| **Security interest / UCC** | Not applicable (CFA license model) | Exists in RR FA but not extracted | **MEDIUM** | 1 — missing extracted fact |
| **EFT provisions** | Not applicable | Exists in RR FA but not extracted | **MEDIUM** | 1 — missing extracted fact |
| **Data ownership** | Not applicable (different model) | Exists in RR FA but not extracted | **MEDIUM** | 1 — missing extracted fact |
| **System modification rights** | Implied in CFA | Explicit in RR FA Sect. XI but not structured | **MEDIUM** | 1 — missing extracted fact |
| **Remodel obligations** | Not applicable | Explicit in RR FA Sect. X.A — once during term, not in last 4 years — not structured | **MEDIUM** | 1 — missing extracted fact |
| **Advertising expense actuals** | Present in CFA notes | $270,344 / $229,359 / $152,565 not extracted despite being in Note 1 | **MEDIUM** | 1 — missing extracted fact |
| **Note 1 accounting policies structured** | Revenue recognition, receivables, depreciation structured | Present in source but only in narrative reader report, not in canonical | **MEDIUM** | 2 — missing promoted field |
| **Note 4 tax provision split** | Current vs deferred breakdown | Totals captured; split not structured | **LOW** | 2 — missing promoted field |
| **VIE election (ASU 2018-17)** | Not applicable | Material accounting choice not captured | **MEDIUM** | 1 — missing extracted fact |
| **Confidentiality agreement** | Structured field | FDA confidentiality provisions not promoted to canonical | **LOW** | 2 — missing promoted field |
| **Sales reporting** | Structured field (daily, monthly, remittance) | EFT/reporting requirements in FA but not structured | **LOW** | 2 — missing promoted field |
| **Gift card provisions** | Not applicable | FA Sect. X.K — must purchase through franchisor, no own gift cards — not captured | **LOW** | 1 — missing extracted fact |
| **Key financial ratios** | Current ratio, working capital in canonical | Computed in enriched v2 balance sheet section but not in main canonical | **LOW** | 2 — missing promoted field |
| **Computed upgrade cost cap** | Not applicable | FA Sect. IX.D — $10K/5yr cap on required upgrades — not captured | **MEDIUM** | 1 — missing extracted fact |

## C. Material Regressions in Current Run

These are provisions that exist in the Rocky Rococo FDD and that the pipeline has demonstrated (via CFA) it can extract, but which were not extracted:

| # | Regression | Source | Severity |
|---|---|---|---|
| **R1** | No FA deep read — security interest/UCC lien, insurance, EFT, data ownership, system modification, remodel obligations, gift cards, upgrade cost cap all missing | FA pp.98-135 | **HIGH** |
| **R2** | Advertising expense actuals ($270K/$229K/$153K) not extracted — differ from ad fees collected, showing RFC spent more than collected | Note 1 to FS, p.64 | **MEDIUM** |
| **R3** | VIE non-consolidation election (ASU 2018-17) not captured — material: Hester family entities not consolidated | Note 1 to FS, p.64 | **MEDIUM** |
| **R4** | Note 4 income tax provision current/deferred split not structured | Note 4 to FS, p.66 | **LOW** |
| **R5** | Balance sheet ~5 null cells where values exist in source | Balance sheet, p.60 | **LOW** |

## D. Must-Fix Regressions Before Publish

1. **R1 (HIGH)**: FA operative provisions must be extracted and promoted to canonical. The UCC security interest, insurance requirements, EFT/direct debit, data ownership, system modification, and remodel obligations are material franchisee burdens.

2. **R2 (MEDIUM)**: Advertising expense actuals must be captured. The fact that RFC spent $270,344 on advertising vs. collecting $269,344 in fees (2024) is a meaningful signal — RFC is spending essentially 100% of collected ad fees, with slight overspend.

3. **R3 (MEDIUM)**: The VIE election must be noted. The fact that Hester family entities are not consolidated despite common control is material for understanding the financial statements.

## E. Conflict Fields Requiring Source Adjudication

| # | Field | Issue | Source Needed |
|---|---|---|---|
| **C1** | `noncompete_post_term_radius` | FA says 5 miles, FDA says 50 miles — both in same FDD | Both agreements, pp.45-46, 157 |
| **C2** | `computer_access` | Item 11 narrative contradicts itself (no access vs. dedicated line) vs. FA Sect. IX.D which clearly grants access | Item 11 pp.31-32, FA pp.98-99 |
| **C3** | `royalty_reduction_mechanism` | Item 6 Note 1 says "refund within 30 days" vs. Note 1 to FS says "credits the difference to franchisees' balance owed in the future" | Item 6 p.15, Note 1 p.64 |

All three require source adjudication — they represent genuine document-level tensions, not extraction errors.
