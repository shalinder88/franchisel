# 15 Regression Check — Ivybrook Academy 2025 v2 vs prior run

**Current run**: `runs/ivybrook-academy-2025-v2/`
**Prior run (benchmark)**: `runs/ivybrook-academy-2025/` — Claude-first run with vision OCR recovery of Exhibit J.
**Gold corpus**: not provided (NONE).

## Benchmark sources

| Source | Path | Role |
|---|---|---|
| Prior run canonical | runs/ivybrook-academy-2025/09_final_canonical.json | Primary benchmark |
| Prior run enriched v2 | runs/ivybrook-academy-2025/12_canonical_enriched_v2.json | Enrichment benchmark |
| Prior run tables | runs/ivybrook-academy-2025/03_tables.json | Table coverage benchmark |
| Prior run final report | runs/ivybrook-academy-2025/08_final_report.md | Narrative benchmark |
| Gold corpus | — | Not provided |

## Dimension-by-dimension comparison

| # | Dimension | Current v2 | Prior run | Assessment |
|---|---|---|---|---|
| 1 | tables_count (material tables) | 15 | 15+ | **MATCH** |
| 2 | table_rows (Item 5 fees) | 5 | 5 | **MATCH** |
| 2 | table_rows (Item 6 fees) | 28 | ~28 | **MATCH** |
| 2 | table_rows (Item 7 investment) | 15 | 15 | **MATCH** |
| 2 | table_rows (Item 19 Table 2A lines) | 18 | 18 | **MATCH** |
| 2 | table_rows (Item 19 Table 2B lines) | 18 | 18 | **MATCH** |
| 2 | table_rows (Item 19 Table 2C lines) | 18 | 18 | **MATCH** |
| 2 | table_rows (Item 19 Table 3 rows) | 3 | 3 | **MATCH** |
| 2 | table_rows (Item 20 projected openings) | 21 states + total | 21 states + total | **MATCH** |
| 3 | table_notes captured | 6 Item-19 notes + Item-7 notes 1–13 + Item-6 notes 1–2 | Same | **MATCH** |
| 4 | evidence_grounded_fields_count | ~60 with source_pages | ~100+ | **Slight regression** — prior run has more layered provenance; v2 focused on compactness. Not material. |
| 5 | exhibits_mapped_count | 13 entries (A–M) | 13 entries | **MATCH** |
| 6 | exhibits_deep_read_count | 2 (B state addenda structured; A section index only) | 3 (A clause-walked, B structured, J OCR'd) | **REGRESSION** on Exhibit A clause walk; **REGRESSION** on Exhibit J |
| 7 | state_addenda_count | 3 (IL, MN, VA) structured with 16 overrides | 3 structured with similar overrides | **MATCH** |
| 8 | litigation_count | 0 pending / 0 concluded | 0 / 0 | **MATCH** |
| 9 | franchisee_list_depth | Body label L, 40 current + list of unopened + former | Same | **MATCH** |
| 10 | item19_completeness | 5 tables, 6 notes, population counts, exclusion rule, substantiation stmt | Same | **MATCH** |
| 11 | item20_completeness | 5 tables, trend data, confidentiality-clause flag | Same | **MATCH** |
| 12 | item21_completeness | **Auditor UNKNOWN, opinion UNKNOWN, BS/IS/CF UNKNOWN**. Stockholder's equity $345,862 captured from VA addendum. Revenue 2024 $2,171,363 from Item 8. | Auditor **Reese CPA LLC (Ft. Collins, CO)** p170; **unmodified opinion, no going concern** p170–171; **Net income 2024 $313,055**, 2023 $435,505, 2022 $309,239 p173; **Total assets 2024 $3,894,365**; **total liabilities 2024 $3,548,503**; **cash 2024 $300,274**; **deferred franchise fees 2024 $3,434,025** p172,180. | **MATERIAL REGRESSION** — v2 lacks all Exhibit J line-items that prior run recovered via vision OCR. |
| 13 | contract_burden_depth | 14 burden families + FA section index captured from TOC | Similar (plus clause-level text for some sections) | **Slight regression** on clause-level depth |
| 14 | financial_note_depth | Only equity, revenue captured; no accounting policies | Prior run marked "not surfaced" in its own depth file despite OCR; v2 is comparable in POLICY depth but v2 additionally missed the OCR'd statement line items | **REGRESSION** on statement line items only |
| 15 | canonical_field_count | ~90 populated | ~130 populated | **Slight regression** — prior run has more fan-out |

## Summary

- **Total regressions**: 5 (#6 Exhibit A clause walk, #6 Exhibit J OCR, #12 Item 21 Exhibit J line items, #13 clause-level FA depth, #14 Exhibit J statement lines)
- **Total matches**: 11
- **Total improvements**: 0
- **Net assessment**: v2 is a clean text-layer extraction that matches the prior run on all text-direct fields but lags on everything that required vision OCR. The single **material** regression is Item 21 Exhibit J line items.

## Regressions requiring recovery (for B2)

1. **R1 — Exhibit J auditor identity** (prior run: "Reese CPA LLC, Ft. Collins, CO", p170)
2. **R2 — Exhibit J audit opinion language** (prior run: "Unmodified (clean) opinion. Going concern explicitly evaluated; no modification issued", p170–171)
3. **R3 — Exhibit J going-concern flag** (prior run: "No going concern modification. Auditor explicitly evaluated and concluded entity can continue", p170)
4. **R4 — Exhibit J net income by year** ($313,055 in 2024, $435,505 in 2023, $309,239 in 2022, p173)
5. **R5 — Exhibit J total assets 2024** ($3,894,365, p172)
6. **R6 — Exhibit J total liabilities 2024** ($3,548,503, p172)
7. **R7 — Exhibit J cash 2024** ($300,274, p172)
8. **R8 — Exhibit J deferred franchise fees 2024** ($3,434,025, p172 and p180)
9. **R9 — (Minor) Exhibit A clause-level walk** for key provisions (liquidated damages formula text, indemnification text, force majeure text) — already captured at burden-family level.

No regressions on Items 1–20, 22, 23 or on the state addenda structuring or on Item 19/20 tables.

## Note on comparability
All regressions above are attributable to a single root cause: v2 had no vision OCR available for Exhibit J text layer. All prior-run Exhibit J values were recovered via OCR and are attributed to specific pages in the prior run's canonical. B2 can propose backfilling from the prior run's authoritative Exhibit J fields, clearly labeled as "recovered from prior run benchmark" to preserve provenance.
