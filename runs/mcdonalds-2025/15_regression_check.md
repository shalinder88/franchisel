# 15 — Regression Check
## McDonald's USA, LLC — FDD (638437-2025)

---

## Benchmark Sources

| Source | Type | Fields |
|--------|------|--------|
| `gold_brands/mcdonalds/gold_output.json` | Manual gold (compact) | 20 top-level fields |
| `gold_corpus/brands/mcdonald-s/normalized_gold.jsonl` | Normalized gold (full) | 1,215 field entries across 18 families |
| No prior production run exists | — | — |

This is the first full-pipeline production run for McDonald's. Regression is benchmarked against the normalized gold corpus (1,215 entries), which was a manual extraction from the same PDF.

---

## Dimension-by-Dimension Comparison

### 1. tables_count
- **Current run**: 15 tables in `03_tables.json`
- **Gold**: Does not track table count directly; normalized gold implies ~2 Item 19 tables, 5 Item 20 tables, fee table, investment table, training table, franchise relationship table, lease table
- **Assessment**: Current run **matches or exceeds** gold on table extraction. No regression.

### 2. table_rows_count
- **Current run**: Item 6 fee table: 31 rows. Item 7: 8 rows. Item 19 pro forma: 5 rows. Item 19 sales: 3 segment rows. Item 20 Tables 1–5: full totals.
- **Gold**: Comparable row counts in fee_details (219 entries span all fee rows), item19_performance (101 entries), outlets (68 entries).
- **Assessment**: No regression. Current run has comparable row-level detail.

### 3. table_notes_count
- **Current run**: Item 6: 11 footnotes. Item 7: 6 footnotes. Item 19: 3 notes. Item 20: 4 footnotes across Tables 2–4.
- **Gold**: Notes embedded as individual fields (e.g., `royaltyDetails`, `rentNote`, `effectiveRentRange2024`).
- **Assessment**: No regression. Footnotes fully captured.

### 4. evidence_grounded_fields_count
- **Current run**: 120+ canonical fields, all with source_object/source_section/source_pages/confidence
- **Gold**: 1,215 normalized entries, all with `source_item` but marked `source_status: needs_evidence_linking`
- **Assessment**: **Current run is stronger on evidence grounding.** Gold has more fields but lacks page-level evidence links.

### 5. exhibits_mapped_count
- **Current run**: 20 exhibits cataloged in `04_exhibits.json` with page ranges, categories, priorities
- **Gold**: 20 exhibits listed in `document.moduleM_documentPackage.exhibits[]` with letter, name, function
- **Assessment**: Match. Both have all 20 exhibits.

### 6. exhibits_deep_read_count
- **Current run**: Financial statements (Exhibit A, 15 pages deep-read), Franchise Agreement (Exhibit B, 18 pages deep-read in depth pass), Operator's Lease (key provisions surfaced through Item 17). State addenda (Exhibit T, full read).
- **Gold**: Deep-reads individual exhibits with function tags. Has `document.stateAddenda[]` structured per state.
- **Assessment**: Current run **matches or exceeds** on depth. Contract burden depth pass walked Exhibit B clause-by-clause.

### 7. state_addenda_count
- **Current run**: 6 states covered (CA, HI, MD, MN, ND, WA) in reader report + exhibits + state-specific riders in franchise agreement
- **Gold**: Has `document.stateAddenda[]` with per-state details; checks same 6 states plus notes on state effective dates for 14 registration states
- **Assessment**: **Minor gap**: Current run covers state effective dates in source map (p.386–387) but doesn't structure the 14-state registration list as a separate canonical field. Low impact.

### 8. litigation_count
- **Current run**: 7 pending named + 13 concluded with amounts. Also notes "numerous additional labor/joint-employer lawsuits."
- **Gold**: `pendingCaseCount: 6`, `resolvedCaseCount: 11`
- **Assessment**: **Current run is stronger.** Gold undercounts: we found 7 pending (gold says 6, likely missing Le v. McDonald's McRib case filed Dec 2025 which was in the amended FDD) and 13+ concluded (gold says 11). Gold was likely extracted before the Feb 2026 amendment.

### 9. franchisee_list depth
- **Current run**: Exhibit R confirmed (pp.237–380, ~12,887 locations), Exhibit S confirmed (pp.381–382, 113 ceased). Not parsed to structured data.
- **Gold**: `outlets.franchiseeListExhibit: R`, `outlets.terminatedListExhibit: S`. Also not parsed to structured data.
- **Assessment**: Match. Neither parses the 144-page list.

### 10. key exhibit coverage
- **Current run**: Exhibit A (financial statements deep-read), Exhibit B (franchise agreement deep-read), Exhibit G (Operator's Lease key provisions), Exhibit K (New Term Policy), Exhibit L (Growth Policy), Exhibit N (Loan/Guaranty), Exhibit T (State Addenda)
- **Gold**: Similar coverage. Tags exhibits by function (disclosure_financial, signing_document, etc.)
- **Assessment**: Match.

### 11. financial statement depth
- **Current run**: Full income statement, balance sheet, cash flows, members' equity. 10+ financial notes captured (revenue recognition, depreciation, impairment, tax provision, deferred taxes, uncertain positions, leasing, goodwill, contingencies, restructuring, related party, subsequent events). Franchise revenue disaggregation. Future rent receivable $14.16B.
- **Gold**: `financials` family has 152 entries covering similar ground.
- **Assessment**: **Current run is stronger after depth pass.** Revenue disaggregation, future rent receivable, subsequent event, and related party detail are all captured.

### 12. guaranty depth
- **Current run**: Unlimited Guaranty within Exhibit N captured. Bank of America loan terms, personal + spousal guarantee, cross-default, jury trial waiver (captured in contract burden depth), Operator Assistance Program.
- **Gold**: Has `juryTrialWaiver: true`, `consolidationWaiver: true`.
- **Assessment**: **Minor gap**: Gold has `consolidationWaiver: true` — franchisee agrees not to consolidate legal action with others. Current run captured jury trial waiver but **missed the consolidation waiver** in the guaranty. Need to verify in PDF.

### 13. key legal term coverage
- **Current run**: Noncompete (18 months/10 miles), no renewal right, New Term Policy, ROFR, transfer conditions, termination triggers, choice of law (IL), 30+ contract burden clauses.
- **Gold**: 89 contract_terms entries covering same ground. Has `contractBurdenScore: 30`.
- **Assessment**: Match on substantive terms. Gold has a computed `contractBurdenScore` (derived/interpretive, not extracted from PDF).

### 14. audit richness
- **Current run**: Full coverage audit (06), depth pass promotion audit, FDD inconsistency noted (11,332 vs 11,322).
- **Gold**: No audit artifacts (gold is output-only, no process metadata).
- **Assessment**: **Current run is stronger** — has full audit trail.

### 15. scorecard richness
- **Current run**: Full scorecard with coverage by item, canonical field coverage, enrichment layers, quality indicators.
- **Gold**: No scorecard.
- **Assessment**: **Current run is stronger.**

---

## A. Stronger in Current Run

1. **Evidence grounding**: Every field has source_object, source_section, source_pages, confidence. Gold has `needs_evidence_linking` on all 1,215 entries.
2. **Litigation count**: 7 pending (vs gold's 6) and 13+ concluded (vs gold's 11). Current run includes Le v. McDonald's (Dec 2025, McRib case) which may postdate gold extraction.
3. **Financial statement depth**: Revenue disaggregation ($5.17B rents/$2.01B royalties/$25.4M fees), future rent receivable ($14.16B), subsequent event ($2.4B debt-to-equity), related party detail, advertising actuals, tax provision split, uncertain tax positions — all structured.
4. **Contract burden depth**: 30+ clauses structured from Exhibit B franchise agreement, including mandatory EFT, indemnification, fee-shifting, severability termination right, single financial arrangement doctrine.
5. **Accounting policy depth**: Revenue recognition, depreciation, impairment, leasing, VIE/consolidation, capitalized software — all structured.
6. **Process artifacts**: Source map, coverage audit, retry tasks, depth pass recoveries, promotion audit, regression check — full audit trail.
7. **Technology fee total**: Current run has $11,379.40 mandatory annual (gold has $10,605 — current is more accurate, includes Store Mail $56.40 and some fees gold may have counted differently).

## B. Stronger in Gold

1. **Leadership family depth**: Gold has 52 entries for Item 2 (all 37 executives with titles, start dates, tenure calculations, recent hires with prior roles, leadership stability assessment, management quality score). Current run surfaced Joe Erlinger as president but did not structure the full 37-person executive roster.
2. **Fee computed totals**: Gold has `totalRecurringFeeEstimate.totalMinimumPctOfGross: 14%+` and `totalTypicalPctOfGross: 20-30%+`. Current run has individual fee components but not these computed aggregate estimates.
3. **Specific fee items**: Gold has 3 additional fees not in current run's canonical: (a) `Interest on Late Payments: SOFR + 5%` — **this conflicts** with the franchise agreement Section 8(c) which says 15% per annum. (b) `Insufficient Funds / Rejected Payment: $200`. (c) `Transfer Fee: varies`.
4. **Financing consolidation waiver**: Gold has `consolidationWaiver: true`. Current run has jury trial waiver but did not separately structure the consolidation waiver.
5. **State addenda as structured array**: Gold has individual state addenda entries. Current run has narrative coverage.
6. **Contract burden score**: Gold has a computed `contractBurdenScore: 30`. This is an interpretive/derived metric, not directly extracted from PDF.

## C. Material Regressions in Current Run

1. **Leadership roster not structured**: Gold has all 37 executives. Current run has only the president in canonical. The data is in the reader report narrative (pages 10–12 were read) but was not promoted to structured canonical fields. **Classification: missing promoted field (type 2).**

2. **Insufficient Funds fee ($200) not extracted**: Not present in current run. Need to verify in PDF. **Classification: missing extracted fact (type 1) — pending PDF verification.**

3. **Transfer Fee not extracted**: Not present in current run. Need to verify in PDF. **Classification: missing extracted fact (type 1) — pending PDF verification.**

4. **Consolidation waiver not structured**: Present in gold's financing/guaranty detail but not in current run's contract burden depth. **Classification: missing extracted fact (type 1) — pending PDF verification.**

5. **Computed fee aggregates missing**: Gold has `totalMinimumPctOfGross: 14%+` and `totalTypicalPctOfGross: 20-30%+`. These are useful derived fields. **Classification: missing promoted field (type 2).**

## D. Must-Fix Regressions Before Publish

1. **Insufficient Funds fee** — Verify in PDF. If directly surfaced, add to canonical. (Priority: MEDIUM)
2. **Transfer Fee** — Verify in PDF. If directly surfaced, add to canonical. (Priority: MEDIUM)
3. **Consolidation waiver** — Verify in Exhibit N guaranty. If present, add to canonical. (Priority: MEDIUM)

## E. Conflict Fields Requiring Source Adjudication

1. **Late payment interest rate**: Gold says `SOFR + 5%`. Current run says `15% per annum or highest legal rate` (from Franchise Agreement Section 8(c), page 77). These may refer to different instruments — the franchise agreement late-payment clause vs. the loan late-payment clause. **Requires source adjudication.**

2. **Technology fee total**: Gold says `$10,605/year`. Current run says `$11,379.40/year`. Difference of $774.40 likely due to: (a) gold may not include GRNT $185 or Store Mail $56.40; (b) gold may count differently. **Requires reconciliation, not adjudication — both are plausible.**

3. **Pro forma sample size**: FDD itself is inconsistent (p.43: 11,332 vs p.44: 11,322). Gold uses 11,332. Current run preserves both and flags the inconsistency. **No adjudication needed — current run handling is correct.**

4. **Pending litigation count**: Current run says 7. Gold says 6. Difference is likely Le v. McDonald's (McRib case filed Dec 2025, added in Feb 2026 amendment). **Current run is correct — gold likely pre-dates amendment.**
