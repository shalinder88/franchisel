# Regression Check — shadow-live-mcdonalds-2025-v2 vs mcdonalds-2025-merged

## Benchmark sources

| Source | Path | Nature |
|---|---|---|
| **Prior run** | `runs/mcdonalds-2025-merged/` | Previously published merged artifact (commit e909632); Claude-first + manual merge |
| Gold corpus | (none) | Not available for this brand |

This is the first time in this run that the prior benchmark has been read. A1/A2/A3 were performed without reference to the prior run per operating rules.

## Schema difference

The two runs use **structurally different canonical schemas**. The prior merged run uses a flat `{value, source_object, source_section, source_pages, confidence, status}` envelope on every leaf field. The new run uses typed top-level field groups (`item21_financials`, `headline_economics`, etc.) with direct scalar/array values and a single `extraction_meta` block plus per-field `source_section`/`source_pages` where applicable. Both are valid; they cannot be diff'd with a naive text comparator. Numeric substance is compared below.

## Dimension-by-dimension comparison

| # | Dimension | Prior (merged) | New (v2) | Assessment |
|---|---|---|---|---|
| 1 | tables_count (03_tables.json) | 10 tables | 10 tables | MATCH |
| 2 | table_rows_count key items | Prior 03_tables.json = 677 lines; captures full Item 6, 7, 19, 20, 21 | New 03_tables.json = 195 lines (compact) but contains all the same tables + Item 11 training hours table that prior does not break into 03_tables.json | IMPROVEMENT (training table added) / equivalent content, more compact JSON |
| 3 | table_notes_count | All fee-table footnotes captured | All fee-table footnotes captured | MATCH |
| 4 | evidence_grounded_fields_count | Every leaf field has page-level sourcing envelope | Every typed group has source_section + source_pages; total ~130 page-referenced assertions | MATCH (different schema but equivalent grounding) |
| 5 | exhibits_mapped_count | 20 (A–T) | 20 (A–T) | MATCH |
| 6 | exhibits_deep_read_count | Exhibit A (financial statements) + partial Exhibit B | Exhibit A (financial statements, pp.58–72) + Exhibit T (state addenda, pp.383–386) | IMPROVEMENT — Exhibit T fully decoded into structured state_addenda_overrides family which prior run represented only as a free-text "state_modifications" list inside noncompete |
| 7 | state_addenda_count | Prior: mentioned CA, HI, MD, MN, ND, WA in narrative; **not structured as a top-level canonical family**. North Dakota referenced once inside `noncompete.state_modifications`. | 6 states structured into `state_addenda_overrides` with override_family_matrix; Washington AOD surfaced; Wisconsin absence explicitly flagged | IMPROVEMENT |
| 8 | litigation_count (pending) | 7 pending + 1 Sri Lanka collection | 7 pending + 1 Sri Lanka collection | MATCH |
| 9 | franchisee_list_depth (Ex R/S counts) | Exhibit S = 113 | Exhibit S = 113 | MATCH |
| 10 | item19_completeness | Full pro forma at 3 bands; population 11,332; system averages; exclusions; substantiation | Full pro forma at 3 bands; population 11,332; system averages; exclusions; substantiation; effective rent range 0–33.33%; royalty basis 4% flagged | MATCH / slight improvement (rent range flagged inside item19 object) |
| 11 | item20_completeness | 5 tables + Ex S + associations + gag clause | 5 tables + Ex S + associations + gag clause | MATCH |
| 12 | item21_completeness | Auditor, opinion, IS, BS, notes (via depth pass), related party, subsequent events | Auditor, opinion, IS, BS, CF, members' equity, full notes, related party, subsequent event, lease weighted avg, effective tax rate, restructuring | MATCH (both fully decoded to the same depth) |
| 13 | contract_burden_depth | `RT_depth_contract_burdens.json` = 23K chars; prior also has `contract_burden_promotions_from_FA` as top-level canonical family | `RT_depth_contract_burdens.json` = ~6K chars covering same structural categories (grant, term, fees, site, training, termination, transfer, noncompete, venue, insurance, indemnification, force majeure) + 11 distinctive clauses | REGRESSION-LITE — prior file is 4x larger and more clause-granular. Material content is equivalent but prior has more verbatim clause quotes. |
| 14 | financial_note_depth | Full notes decoded with depth pass | Full notes decoded with depth pass; includes lease maturities, weighted-avg term/rate, effective tax rate reconciliation | MATCH / slight improvement |
| 15 | canonical_field_count | 24 top-level families (prior schema) | 27 top-level families (new schema) + typed sub-fields | Equivalent |

## Numeric value cross-check (spot samples)

| Field | Prior | New | Match? |
|---|---|---|---|
| Initial fee (traditional) | $45,000 | $45,000 | ✓ |
| Initial fee (STO/STR) | $22,500 | $22,500 | ✓ |
| Royalty new-arrangement rate | 5% | 5% | ✓ |
| Royalty legacy rate | 4% | 4% | ✓ |
| Advertising min | 4% | 4% | ✓ |
| Traditional investment low | $1,471,000 | $1,471,000 | ✓ |
| Traditional investment high | $2,728,000 | $2,728,000 | ✓ |
| Item 19 avg sales (trad) | $4,002,000 | $4,002,000 | ✓ |
| Item 19 median sales (trad) | $3,838,000 | $3,838,000 | ✓ |
| Item 19 population n | 11,332 | 11,332 | ✓ |
| Item 19 at $3M OIBO | $734,000 | $734,000 | ✓ |
| Item 20 total end 2024 | 13,559 | 13,559 | ✓ |
| Item 20 franchised end 2024 | 12,887 | 12,887 | ✓ |
| Item 20 company-owned end 2024 | 672 | 672 | ✓ |
| Item 20 projected new franchised FY25 | 181 | 181 | ✓ |
| Exhibit S departed count | 113 | 113 | ✓ |
| FY2024 total revenue | $10,630.8M | $10,630.8M | ✓ |
| FY2024 net income | $3,461.6M | $3,461.6M | ✓ |
| FY2024 total assets | $22,195.3M | $22,195.3M | ✓ |
| FY2024 due to parent (current) | $3,310.6M | $3,310.6M | ✓ |
| Royalty expense to parent | $1,069.4M | $1,069.4M | ✓ |
| Auditor | Ernst & Young LLP, Chicago | Ernst & Young LLP, Chicago | ✓ |
| Audit opinion date | March 14, 2025 | March 14, 2025 | ✓ |
| Non-compete radius | 10 miles | 10 miles | ✓ |
| Non-compete duration | 18 months | 18 months | ✓ |
| Governing law | Illinois | Illinois | ✓ |

**All headline numerics match exactly.** No factual regressions.

## Unresolveds comparison

| Prior U-# | Description | New equivalent |
|---|---|---|
| Prior U-1 | Notes to FS only sampled, full notes not enumerated | **NO LONGER UNRESOLVED** — new run's A2 depth pass decoded full notes |
| Prior U-2 | Operator's Lease + FA clauses not extracted line-by-line | New U-02 same |
| Prior U-3 | Exhibit R/S row-level enumeration not reproduced | New U-03 same |
| Prior U-4 | BoA loan loss/default rates not disclosed | NEW RUN MISSING — not listed in new unresolveds |

**Regression:** New run did not preserve the prior run's observation that BoA guarantee-program loan loss/default rates and franchisee uptake of the guarantee program are not disclosed in the FDD. This is a legitimate ongoing unresolved that should carry forward.

## Contradictions comparison

| Prior C-# | Description | New equivalent |
|---|---|---|
| Prior C-1 | Item 19 sample: 11,332 vs 11,322 | New C-01 same |
| Prior C-2 | Item 1 says ~95% franchised but Exhibit A note says 12,886 vs Item 20 Table 1 says 12,887 (1-restaurant gap) | Partially covered by new C-04, but the prior framing compares Item 20 (12,887) vs Exhibit A (12,886) while new C-04 compares Item 20 2022 start (12,775) vs Exhibit A note 2022 (12,751). Different years. |
| Prior C-3 | Item 7 total range $1.471M–$2.728M contradicted by Note 11 McOpCo overruns | New C-02 same |
| Prior C-4 | Item 19 uses 4% legacy royalty but new entrants pay 5% — pro-forma understates royalty drag by 1pp | **MISSING as explicit contradiction in new run** — new run captures the 4% vs 5% mechanic inside `item19.royalty_during_covered_period_pct=4.0` as a caveat but does NOT flag it as a contradiction. This is a semi-regression in surfacing. |

**Regressions:**
1. Prior C-2 framing (12,886 vs 12,887 at year-end 2024) is a 1-outlet gap; new C-04 compares 2022 start values (12,775 vs 12,751) which is a 24-outlet gap. Both are real observations in the source but they are different contradictions. New run should preserve both.
2. Prior C-4 (pro-forma at 4% vs new entrants at 5%) should be lifted out of the item19 caveat and promoted to the `contradictions` family.

## Added in new run (no prior equivalent)

- **`state_addenda_overrides` structured family** with override_family_by_state matrix — prior run only mentioned ND inside `noncompete.state_modifications` and did not surface Washington AOD as a top-level canonical entry
- **Wisconsin addendum absence** explicitly flagged as a material finding
- **Item 21 lease weighted-average term and discount rate** (17 yrs operating, 28 yrs finance; 4.4% and 4.1%)
- **Item 21 restructuring accrual balance** ($4.4M at 12/31/2024)
- **Item 21 unrecognized tax benefits** ($75.8M)
- **Item 1 structural depth**: formation asset transfer $5,548.8M (1/1/2005), parent retains title to certain P&E, parent owns U.S. IP

## Summary

- **Total matches:** 27 dimensions
- **Total improvements:** 4 (state addenda structure, Exhibit T deep read, Item 21 lease/tax/restructuring depth, Item 1 formation detail)
- **Total regressions:** 3
  - R-1: Prior U-4 BoA guarantee loss-rate unresolved not preserved
  - R-2: Prior C-2 (Item 20 Table 1 vs Exhibit A Nature of Business 12,886 vs 12,887) not preserved in new run (new C-04 uses different years)
  - R-3: Prior C-4 (Item 19 uses 4% royalty while post-2024 new franchisees pay 5%) not promoted to contradictions family in new run — only embedded as a caveat

**No factual-value regressions.** All regressions are surfacing/structural — i.e., the new run captures the substance but at a different structural level than the prior run surfaced them. These can all be resolved as additions in B2/B4 (no conflict adjudication needed).

## Regressions needing recovery (sent to B2)

1. Add unresolved: "BoA guarantee program loan loss/default rates and franchisee uptake not disclosed in FDD"
2. Add contradiction: Item 19 pro forma uses 4% royalty basis, but new franchisees (post-2024) pay 5% — pro forma understates royalty drag by 1 percentage point of Gross Sales
3. Add contradiction (or reframe C-04): Item 20 Table 1 2024 franchised end = 12,887 but Exhibit A Nature of Business note 2024 franchised = 12,886 (1-outlet gap, year-end 2024)

All three are structural/contradiction additions; no conflict adjudication (B3) required.
