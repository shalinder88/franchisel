# Publish Gate — Hyatt Regency 2025-2026 FDD

Filing ID: 637926-2025
Brand: Hyatt Regency
Gate Date: 2026-04-15

---

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. Depth passes complete.

---

## Rationale

This extraction is comprehensive and publish-ready. All 23 FDD Items have been fully read and extracted. Three financial performance representations with complete statistics are captured. All 5 standard Item 20 tables are present with 3-year history. Financial statements are identified with auditor, opinion type, and key line items. State addenda are structured into per-state override families. Four depth passes (financial notes, contract burdens, narrative promotion, state addenda) have been completed. Unresolveds and contradictions are documented in canonical.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: Yes (3 FPRs)
- All tables extracted: Yes (6 tables)
- Notes and population counts: Yes (103 Covered Hotels, 41 franchised, 62 owned/managed)
- Exclusion rules: None excluded — full population
- Substantiation availability: Captured ("written substantiation available on reasonable request")
- Statistics (ranges, medians, % exceeding): All captured

### 2. Item 20 Completeness — PASS
- All 5 standard tables present: Yes (systemwide, transfers, franchised status, company-owned status, projected openings)
- Total rows balance: Yes (franchised: 40+2-1=41 ✓; company-owned: 63+0-2-2=59 ✓; total: 41+59=100 ✓)
- Franchisee list exhibit count: 41 franchisees in Exhibit H
- Gag clause flag: Set — no confidentiality clauses restricting discussion

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Deloitte & Touche LLP (since 2003)
- Income statement: Extracted (3 years)
- Balance sheet: Extracted (2 years)
- Cash flow: Extracted (3 years)
- Notes to financial statements: Covered via Depth Pass 1 (revenue recognition, leases, loyalty, goodwill, tax, acquisitions)
- Going concern: Not qualified — set to false
- Parent guarantee: Captured (absolute and unconditional)

### 4. State Addenda Sufficiency — PASS
- States identified: California, Hawaii, Maryland, Minnesota, North Dakota
- Structured into canonical: Yes — `state_addenda_overrides` family with per-state entries and summary table
- Override families extracted: general_release, forum_selection, governing_law, termination, damages, limitations_period, financial_disclosure, general_disclosure
- 17 individual overrides across 5 states

### 5. Key Exhibit Sufficiency — PASS
- All 14 exhibits cataloged with page ranges and categories
- Financial exhibits (A-1, A-2): Deep-read
- Franchise agreement (C): Contract burdens depth pass completed
- State addenda (M): Structured extraction completed

### 6. Unresolveds and Contradictions — PASS
- 4 unresolveds documented in canonical with severity and source
- All are genuine business-risk flags (RevPAR gap, AOP variability, goodwill impairment, outlet decline) — not extraction gaps
- 0 contradictions identified
- `unresolveds` and `contradictions` keys present in 09_final_canonical.json and 12_canonical_enriched_v2.json

### 7. Final Report Depth — PASS
- 08_final_report.md is a full diligence report (~400+ lines)
- All required sections present: executive snapshot (15 bullets), fees/investment, supplier/operations/tech, territory, contract burden/legal, Item 19 detail, Item 20 detail, Item 21 detail, state addenda, unresolveds, contradictions, final coverage note
- Substantive narrative in each section

### 8. Score Gate — PASS
- Overall grade: A-
- All 23 items scored A
- All canonical fields populated with evidence grounding
- Depth passes complete

---

## Recovery Passes Needed

None. Verdict is 1 — Publish-ready.
