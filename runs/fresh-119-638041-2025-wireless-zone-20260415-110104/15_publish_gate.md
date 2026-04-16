# Publish Gate — Wireless Zone LLC (638041-2025)

## Verdict: 1 — Publish-Ready

No material gaps. All items covered with full evidence grounding. All mandatory canonical families populated. Full diligence report is substantive (465 lines).

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: Yes (11 pages)
- Annual quintile table (703 stores): Extracted with all columns, ranges, medians
- Quarterly tables (Q1-Q4): All four extracted
- Monthly tables (Nov, Dec — Current Calculation): Both extracted
- Activations/Upgrades: Overall + top/bottom 10% extracted
- Population counts: 703 (excluded 17 closed, 42 opened during 2024)
- Exclusion rules: Documented
- Calculation change (Former vs Current, Nov 1, 2024): Documented
- Substantiation statement: Captured ("Written substantiation... available upon reasonable request")
- Critical caveats: Documented (no operating expenses, no EBITDA, no net income, sample bias)

### 2. Item 20 Completeness — PASS
- Table 1 (Systemwide summary): Present for WZ + TCC
- Table 2 (Transfers): Present with 3-year state-by-state data, totals: 61/19/77
- Table 3 (Franchised status): Present with 3-year state-by-state data
- Table 4 (Company-owned): Present for WZ (all zeros) + TCC by state
- Table 5 (Projected openings): Present (34 signed not open, 48-83 projected)
- Franchisee roster: Exhibit G cataloged (~20 pages, 745 stores)
- Gag clause flag: SET ("Some of our current and/or former franchisees have signed confidentiality clauses")
- Totals balance: Verified (minor 1-store discrepancy between Table 1 and Table 3 in 2022 — documented as contradiction C1)

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Indianapolis-based firm, opinion dated March 25, 2025 (firm name in image only — low severity, documented as unresolved U2)
- Opinion type: Unqualified (clean)
- Income statement: 3 years, all line items extracted
- Balance sheet: 3 years, all line items extracted
- Cash flows: 3 years, all sections extracted
- Member's equity: 3 years + distributions + accumulated deficit
- Notes to financials: All 11 notes extracted in RT_depth_financial_notes.json
- Going concern: No going-concern language in auditor's report
- Related party transactions: Fully detailed (parent debt, shared expenses, receivable distributions)

### 4. State Addenda Sufficiency — PASS
- 14 states identified with addenda
- All addenda extracted and structured in RT_depth_state_addenda_promotion.json
- 24 override entries across 7 override families
- Structured into `state_addenda_overrides` in 09_final_canonical.json with:
  - `states_with_addenda` list
  - `override_families` mapping (family → states)
- State addenda discussed in 08_final_report.md Section I (material overrides table)

### 5. Key Exhibit Sufficiency — PASS
- Item 22 contracts: Exhibits B, C, D, E, J — all accounted for in 04_exhibits.json
- Franchise Agreement (Exhibit B): Deep-read in A2 Depth Pass 2, key clauses extracted in RT_depth_contract_burdens.json
- Guaranty (Exhibit 2 to FA): Identified — unlimited personal guaranty covering all agreements
- Financial Statements (Exhibit H): Fully extracted
- All 10 exhibits cataloged with page ranges and priority levels

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md: Lists partial coverage items (none requiring retry)
- 08_final_report.md: Section J lists 7 unresolveds, Section K lists 3 contradictions
- 09_final_canonical.json: Contains `unresolveds` key (7 entries) and `contradictions` key (3 entries)
- All unresolveds are genuine business-risk flags:
  - U1 (Provider identity): Business risk, not extraction gap — FDD deliberately omits
  - U2 (Auditor name): Minor — image-only in PDF
  - U3 (Effective royalty rate): Requires modeling, not extractable from FDD
  - U4 (Store profitability): Material business risk — FPR excludes operating costs
  - U5 (Minimum activations): In Operations Manual, not FDD
  - U6 (TCC conversion terms): Not disclosed
  - U7 (Distribution sustainability): Financial analysis observation
- None are extraction gaps requiring A4 recovery

### 7. Final Report Depth — PASS
- 08_final_report.md: 465 lines — full narrative diligence report
- All required sections present:
  - A. Executive snapshot (15 numbered bullets): PRESENT
  - B. Fee stack, entry structure, initial investment: PRESENT (3 sub-sections)
  - C. Supplier control, operations, tech: PRESENT (4 sub-sections)
  - D. Territory, competition, channels, encroachment: PRESENT (3 sub-sections)
  - E. Contract burden and legal mechanics: PRESENT (6 sub-sections)
  - F. Item 19 — Financial performance: PRESENT (with tables, caveats)
  - G. Item 20 — Outlet data: PRESENT (with trajectory, transfers, projections, gag clause)
  - H. Item 21 — Financial statements: PRESENT (with balance sheet, income, observations)
  - I. State addenda summary: PRESENT (with override table)
  - J. Unresolveds: PRESENT (7 items with severity)
  - K. Contradictions: PRESENT (3 items with resolution status)
  - L. Final coverage note: PRESENT (fully surfaced vs partial)

### 8. Score Gate — PASS
- 10_scorecard.md: Overall grade A
- All 23 items: Full coverage
- All canonical fields: Populated with source_section, source_pages, confidence
- Depth pass results: Documented in scorecard
- 13 material tables extracted
- 10 exhibits cataloged
- 14 state addenda with 24 structured overrides

---

## Recovery Passes Needed

**None.** This extraction is publish-ready without recovery.
