# Publish Gate — 638056-2025 Hampton Inn / Hampton Inn & Suites

## Verdict: 1 — PUBLISH-READY

No material gaps. All items covered. Evidence grounded. All mandatory canonical families present.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided: YES
- All 5 tables extracted (room rates HI, room rates H&S, occupancy combined, occupancy index, RevPAR index)
- Population counts: 2,368 total, 1,960 comparable (15 CM, 1,945 FM)
- Exclusion rules captured (Comparable Hotels definition)
- Ranges extracted for all metrics
- Caveats captured (no cost/EBITDA, STR self-selected competitive sets)
- Substantiation availability statement: YES ("We will make available to you on reasonable request written substantiation")

### 2. Item 20 Completeness ✅
- Systemwide summary tables: YES (both HI and H&S)
- Transfer tables: YES (both brands, 3 years)
- Franchised status tables: YES (state-by-state, 3 years)
- Company-owned tables: YES (all zeros confirmed)
- Projected openings: YES (both brands)
- Total rows balance: YES (verified HI and H&S)
- Franchisee list exhibit count: Exhibit A = 97 pages, Exhibit B = 8 pages — captured
- Gag clause flag: YES — confidentiality_clause = true

### 3. Item 21 Sufficiency ✅
- Auditor identified: CBH, Tysons Corner, Virginia
- Opinion type: Unqualified (clean), dated March 18, 2025
- Balance sheet: YES (2024, 2023)
- Income statement: YES (2024, 2023, 2022)
- Cash flow: YES (2024, 2023, 2022)
- Notes to financial statements: YES — RT_depth_financial_notes.json covers all 9 notes
- Going-concern: No going-concern doubt raised (standard language in auditor report)
- Key depth findings: Asset pledge, tax status, Graduate acquisition, related party details

### 4. State Addenda Sufficiency ✅
- States with addenda identified: 11 (CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA)
- All state addenda extracted: YES — both from Exhibit J-1 reading and RT_depth_state_addenda_promotion.json
- Structured into canonical: YES — `state_addenda` and `state_addenda_overrides` present in 09_final_canonical.json
- Override families structured per-state: YES — 34 structured overrides across 8 families
- Summary table present: YES (in RT_depth_state_addenda_promotion.json)

### 5. Key Exhibit Sufficiency ✅
- Item 22 lists: Exhibits D, D-2, E, F, G, K
- 04_exhibits.json accounts for all 16 exhibits (A through M including sub-exhibits)
- Exhibit C (financials): Deep-read ✅ (depth pass 1)
- Exhibit D (franchise agreement): Deep-read ✅ (depth pass 2)
- Exhibit E (guaranty): Deep-read ✅ (depth pass 2)
- Exhibit J-1 (state addenda): Deep-read ✅ (depth pass 4)

### 6. Unresolveds and Contradictions ✅
- 06_coverage_audit.md contains gaps section: YES
- 08_final_report.md contains unresolveds section (Section J): YES — 8 unresolveds
- 08_final_report.md contains contradictions section (Section K): YES — 2 contradictions
- `unresolveds` key in 09_final_canonical.json: YES — 8 entries
- `contradictions` key in 09_final_canonical.json: YES — 3 entries (includes depth-pass-discovered typo)
- All unresolveds are genuine business-risk flags, not extraction gaps: YES
- No extraction gaps requiring A4 recovery

### 7. Final Report Depth ✅
- 08_final_report.md is 335 lines — adequate depth
- Sections present:
  - A. Executive snapshot (13 numbered bullets) ✅
  - B. Fee stack, entry structure, initial investment ✅
  - C. Supplier control, operations, tech, training ✅
  - D. Territory, competition, channels, encroachment ✅
  - E. Contract burden and legal mechanics ✅
  - F. Item 19 financial performance ✅
  - G. Item 20 outlet data ✅
  - H. Item 21 financial statements ✅
  - I. State addenda summary ✅
  - J. Unresolveds ✅
  - K. Contradictions ✅
  - L. Final coverage note ✅
- All required sections present. Report is a substantive diligence narrative, not a concise metrics table.

### 8. Score Gate ✅
- 10_scorecard.md overall grade: A
- All 23 items covered
- All exhibits cataloged
- 18 tables extracted
- 4 depth passes completed
- 8 facts promoted
- All canonical fields populated with evidence grounding

## Recovery Passes Needed
None. Verdict 1 — publish-ready.
