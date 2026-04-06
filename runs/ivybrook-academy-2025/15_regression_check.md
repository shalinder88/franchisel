# Regression Check — Ivybrook Academy FDD (637976-2025)

## Benchmark Sources

| Source | Location | Notes |
|--------|----------|-------|
| Normalized gold | `fdd-vault/data/gold_corpus/brands/ivybrook-academy/normalized_gold.jsonl` | 134 records. Families: identity, investment, item19_performance, litigation, bankruptcy. All `manual_extraction` origin, `needs_evidence_linking` status. |
| Learning report | `fdd-vault/v7_extractor/training/learned/reports/ivybrook-franchising-llc_learning.json` | killbill-1.2, 2026-04-04. 238 facts captured, 28 fields normalized. TOC/exhibit grammar both failed. `publish_blocked: true`. |
| Current run | `runs/ivybrook-academy-2025/` | Full pipeline, 2026-04-06. 57 canonical fields, 15 tables, 14 exhibits, 40 contract burdens, 91% coverage. |

No prior production run exists for this brand. The gold corpus and learning report are the sole benchmarks.

---

## Metric Comparison

| Metric | Current run | Gold / learning | Delta |
|--------|-------------|-----------------|-------|
| tables_count | 15 | not tracked in gold | current-only |
| table_rows_count | ~250 (across 15 tables) | not tracked | current-only |
| table_notes_count | ~30 (across all tables) | not tracked | current-only |
| evidence_grounded_fields_count | 52 confirmed | 28 normalized (lane_b) | +24 net new structured fields |
| exhibits_mapped_count | 14 | 0 (exhibit_grammar: failed) | +14 |
| exhibits_deep_read_count | 8 substantively read (FA, MUDA, Guaranty, NDA/NCA x2, Release, Lease Rider, Manual TOC) | 0 | +8 |
| state_addenda_count | 3 (IL, MN, MI) | not tracked | current-only |
| litigation_count | 0 (confirmed none disclosed) | gold says `hasLitigation: true` | **CONFLICT — see E-01** |
| franchisee_list_depth | 35 open + 42 not-opened + 8 former + 3 ceased-comm | not tracked | current-only |
| key_exhibit_coverage | 14/14 text-extractable exhibits | 0 (grammar failed) | +14 |
| financial_statement_depth | not_directly_surfaced (image-only) | not tracked | parity (both blocked) |
| guaranty_depth | Full structure: unlimited, joint/several, irrevocable, scope | not tracked | current-only |
| key_legal_term_coverage | 40 contract burdens structured | 0 | +40 |
| audit_richness | Coverage audit + depth pass + publish gate | not present | current-only |
| scorecard_richness | 91% with 57 fields, 2 contradictions, 5 unresolveds | publish_blocked, 2 blockers | current surpasses |
| item19 field count | ~100 structured data points across 4 tables | ~100 records in gold | parity on data, current adds notes/context |
| item19 table count | 4 (Table 1, 2A, 2B/2C, 3) | 4 (same tables in gold) | parity |

---

## A. Stronger in Current Run

1. **Exhibit coverage.** The learning report's TOC and exhibit grammar both failed, yielding 0 exhibits consumed. Current run maps 14 exhibits and deep-reads 8. This is a total recovery from a previous blocker.

2. **Contract burden depth.** 40 structured burdens from FA walk. Not present in any prior source.

3. **State addenda.** 3 state addenda (IL, MN, MI) identified and extracted. Not tracked in gold.

4. **Franchisee list.** Full extraction: 35 open schools, 42 signed-not-opened, 8 former, 3 ceased communication — all with names, locations, phone numbers. Not tracked in gold.

5. **Guaranty and NDA/NCA.** Full structure extracted. Not in prior sources.

6. **Training table.** 80-hour program, 3 phases, structured. Learning report has `trainingProgram` as a normalized field but without table-level detail.

7. **Promotion depth.** 12 narrative facts promoted in depth pass (FAC, certifications, time-to-open, owner participation, GR definition, reporting obligations, facility profile, former franchisee detail, manual structure, standard of care, damages cap, renewal contradiction).

8. **Publish-readiness.** Current run passes publish gate with caveats. Learning report was `publish_blocked: true` with 2 blockers.

---

## B. Stronger in Previous / Gold Run

1. **Item 19 granularity for Table 2C expenses.** The gold has every expense line for the 3yr+ cohort (Table 2C) individually structured (insurance, janitor, student supplies, utilities, CAM, maintenance, professional services, other, licensing). The current run's `03_tables.json` table T19-02BC captures all these values in the combined 2B/2C table, and `11_canonical_enriched.json` has numeric summaries — but the gold goes deeper on Table 2C expense-by-expense. The data is present in the current run (table T19-02BC rows), but not individually promoted into the enriched canonical at the same path depth as the gold.

    **Classification: 2 — missing promoted field.** The data exists in `03_tables.json` but is not individually promoted to the enriched canonical at the per-expense path level for Table 2C. This is a promotion gap, not an extraction gap.

2. **`correctedFromNoFPR` flag.** Gold line 8 records that the Item 19 finding was "corrected from no FPR" — meaning a prior extractor run incorrectly classified this FDD as having no financial performance representation, and the gold manually corrected it. Current run does not carry this provenance flag.

    **Classification: 4 — gold-source provenance note.** This is historical context about a prior extraction error, not a data point the current run needs to replicate.

---

## C. Material Regressions in Current Run

1. **investmentHigh value.** Gold records `investmentHigh: 929,860`. Current run records `total_initial_investment_high: 869,860`. Both values appear in the FDD: $869,860 is the single-unit high and $929,860 is the MUDA high (cover page: "The total investment necessary to begin operation of your first Ivybrook Academy franchise under the Multi-Unit Development Agreement is $575,700 to $929,860"). The current run correctly separates these into two tables (T7-01 at $869,860, T7-02 adds MUDA fees). The gold appears to use the MUDA figure as the system-wide high.

    **Classification: 3 — interpretive assessment conflict.** Not an extraction error. The current run extracts both figures and labels them clearly. The gold uses the MUDA ceiling as the single investmentHigh. Both are defensible; the question is which convention the product expects. If the product convention is "report the highest possible total initial investment across all formats," the current run should promote $929,860 as the system-wide high. If the convention is "single-unit only," $869,860 is correct.

    **No regression in extraction.** Both values are present. This is a labeling/convention question.

---

## D. Must-Fix Regressions Before Publish

**None.** No data point present in the gold is missing from the current run's extraction. The single value difference (investmentHigh) is an interpretive labeling choice, not a missing fact. All Item 19 values match exactly between gold and current run. Item 20 is fully covered. Exhibits far exceed the failed prior run.

---

## E. Conflict Fields Requiring Source Adjudication

### E-01: Litigation — Gold says true, PDF says false

| Field | Gold value | Current run value | PDF source |
|-------|-----------|-------------------|------------|
| `hasLitigation` | `true` | `false` (no litigation disclosed) | Item 3, p. 11: "No litigation is required to be disclosed in this Item." |

**Assessment:** The gold is wrong. Item 3 on page 11 explicitly states no litigation is required to be disclosed. The current run correctly extracts `false`. This gold record should be corrected.

**Classification: 4 — gold-source error.**

### E-02: Bankruptcy — Gold says true, PDF says false

| Field | Gold value | Current run value | PDF source |
|-------|-----------|-------------------|------------|
| `hasBankruptcy` | `true` | `false` (no bankruptcy disclosed) | Item 4, p. 11: "No bankruptcy information is required to be disclosed in this Item." |

**Assessment:** The gold is wrong. Item 4 on page 11 explicitly states no bankruptcy information is required to be disclosed. The current run correctly extracts `false`. This gold record should be corrected.

**Classification: 4 — gold-source error.**

### E-03: investmentHigh — Convention mismatch

| Field | Gold value | Current run value | PDF source |
|-------|-----------|-------------------|------------|
| `investmentHigh` | `929,860` | `869,860` (single unit) | Cover p. 1: single unit $869,860; MUDA $929,860. Both in FDD. |

**Assessment:** Both values are in the PDF. Gold uses the MUDA figure. Current run uses single-unit. Not an extraction error on either side.

**Classification: 3 — interpretive assessment conflict.** Resolve by adopting a convention: if the product reports the maximum possible initial investment regardless of format, use $929,860. If it reports single-unit only, use $869,860. The current run extracts and labels both.

---

## Summary

| Category | Count |
|----------|-------|
| Stronger in current run | 8 areas |
| Stronger in gold | 1 (Table 2C per-expense promotion depth — data exists, promotion gap only) |
| Material regressions | 0 |
| Must-fix before publish | 0 |
| Conflict fields | 3 (2 gold errors on litigation/bankruptcy, 1 convention mismatch on investmentHigh) |

**Verdict: No regressions detected.** The current run strictly dominates the prior gold/learning baseline on every metric except one narrow promotion-depth gap (Table 2C expense-by-expense promotion to enriched canonical), where the underlying data is fully extracted. The two gold errors on litigation and bankruptcy should be corrected in the gold corpus.
