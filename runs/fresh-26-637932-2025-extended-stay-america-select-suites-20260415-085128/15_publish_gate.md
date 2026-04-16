# Publish Gate — Extended Stay America Select Suites FDD (637932-2025)

## VERDICT: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All mandatory canonical families present.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES (4 tables)
- Table 19-1 (Operating Metrics): Extracted with averages, medians, % at/above avg, counts for all 4 metrics (occupancy, ADR, RevPAR, EsOcc) ✓
- Table 19-2 (Reservation Channels): All 6 channels with percentages ✓
- Table 19-3 (Length of Stay): All 3 duration buckets ✓
- Table 19-4 (B2B Revenue): Extracted with average, median, counts ✓
- Population count: 127 hotels (126 company-owned + 1 franchised) ✓
- Exclusion rules: Hotels not open full 12 months excluded ✓
- Notes/definitions: All 6 notes captured ✓
- Substantiation availability: "Written substantiation...will be made available to the prospective franchisee upon reasonable request" captured ✓
- Caveats: 5 critical caveats documented ✓

### 2. Item 20 Completeness — PASS
- Table 1 (Systemwide Summary): Present ✓
- Table 2 (Transfers): Present (all zeros) ✓
- Table 3 (Franchised Status): Present with state detail ✓
- Table 4 (Company-Owned Status): Present with summary totals and state detail ✓
- Table 5 (Projected Openings): Present (2 projected) ✓
- Totals balance: 2024 end = 5 franchised + 206 company-owned = 211 total ✓
- Franchisee list: Exhibit D captured (5 operational + 2 signed not open) ✓
- Gag clause: "No" — no confidentiality clauses ✓
- Footnotes on rebrandings: Captured (43 in 2023, 80 in 2024) ✓
- Pending sales: 22 hotels noted ✓

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Deloitte & Touche LLP, Charlotte, NC ✓
- Opinion type: Unqualified with Emphasis of Matter ✓
- Income statement: Extracted for FY2024 and FY2023 ✓
- Balance sheet: Extracted for FY2024 and FY2023 ✓
- Cash flow: Extracted for FY2024 and FY2023 ✓
- Notes to financial statements: Covered in RT_depth_financial_notes.json (7 accounting policies, 6 material notes) ✓
- Going concern: No going-concern doubt ✓
- Related party transactions: Detailed in financial notes ✓
- Second set of financials (FY2023/2022): Referenced ✓

### 4. State Addenda Sufficiency — PASS
- States identified: 12 states (CA, HI, IL, IN, MD, MN, NY, ND, RI, VA, WA, WI) ✓
- Structured into canonical: YES — `state_addenda_overrides` family present in 09_final_canonical.json with summary table ✓
- RT_depth_state_addenda_promotion.json: 29 structured overrides with state, affected_family, override_summary, why_it_matters, source_pages ✓
- Override families mapped: governing_law, forum_selection, general_release, notice_cure, termination, damages, interest_rate, anti_waiver ✓
- Discussed in final report: YES — Section I with state-by-state table ✓

### 5. Key Exhibit Sufficiency — PASS
- Item 22 contracts listed: FA (A), HTA (B), Riders (H), Guaranty (I), Release (J), APA (K) ✓
- All 11 exhibits cataloged in 04_exhibits.json ✓
- Financial exhibits (C): Deep-read with both statement sets ✓
- Franchise Agreement (A): Key provisions captured through Items + depth pass 2 ✓
- Guaranty (I): Cataloged; spousal liability noted as special risk ✓
- HTA (B): Key terms captured ✓

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists unresolveds: YES (9 items) ✓
- 08_final_report.md Section J lists unresolveds: YES (9 items with severity) ✓
- 08_final_report.md Section K lists contradictions: YES (1 item) ✓
- Canonical `unresolveds` key present: YES (9 entries) ✓
- Canonical `contradictions` key present: YES (1 entry) ✓
- All unresolveds are genuine business-risk flags, not extraction gaps ✓
- No extraction gaps requiring A4 recovery

### 7. Final Report Depth — PASS
- File: 08_final_report.md — 444 lines ✓ (well above 100-line threshold)
- Section A: Executive snapshot (14 numbered bullets) ✓
- Section B: Fee stack, entry structure, initial investment (detailed) ✓
- Section C: Supplier control, operations, tech, training, advertising (detailed) ✓
- Section D: Territory, competition, channels, encroachment ✓
- Section E: Contract burden and legal mechanics (term, renewal, termination, transfer, noncompete, dispute resolution, litigation) ✓
- Section F: Item 19 FPR detail (all tables, population, caveats) ✓
- Section G: Item 20 outlet data (trajectory table, activity, projections) ✓
- Section H: Item 21 financial statements (auditor, balance sheet, income statement, observations) ✓
- Section I: State addenda summary (12 states with table) ✓
- Section J: Unresolveds (9 items with severity and source) ✓
- Section K: Contradictions (1 item) ✓
- Section L: Final coverage note (fully surfaced, not surfaced, recovered) ✓

### 8. Score Gate — PASS
- Overall grade in 10_scorecard.md: A ✓
- Average item score: 9.96/10 ✓
- All 23 items covered ✓
- 17 tables extracted ✓
- 11 exhibits cataloged ✓
- 4 depth passes completed ✓
- Canonical fields populated with evidence grounding (source_section, source_pages, confidence) ✓

---

## Recovery Passes Needed
None. Verdict is 1 — Publish-ready.
