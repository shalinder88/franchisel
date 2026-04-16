# Publish Gate — Hilton Garden Inn FDD (638057-2025)

## Verdict: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. Depth passes complete.

---

## Rationale

This extraction is comprehensive across all 23 FDD Items, all 18 exhibits, and all 4 depth passes. The FPR (Item 19), outlet data (Item 20), financial statements (Item 21), and state addenda are all fully extracted and structured. Contract burden language has been walked clause-by-clause. Unresolveds and contradictions are identified and preserved in canonical form.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided: YES
- All 6 FPR tables extracted (room rate, occupancy, occ index, RevPAR index, new gen rate, new gen occupancy)
- Population counts: 630 Comparable Hotels (4 CM, 626 FM), 198 New Generation
- Ranges, medians, averages all captured
- Exclusion rules documented (hotels open <1 year, brand changes, substantial damage, room count changes)
- Substantiation availability statement captured: "We will make available to you on reasonable request written substantiation"
- No EBITDA/profit data — by design (Hilton's choice), documented as unresolved U1

### 2. Item 20 Completeness ✅
- All 5 standard tables present:
  - Table 1 (Systemwide): ✅ — 3 years, franchised + company-owned
  - Table 2 (Transfers): ✅ — 3 years, state-by-state, totals balance (45/36/21)
  - Table 3 (Franchised Status): ✅ — 3 years, state-by-state, all columns
  - Table 4 (Company-Owned): ✅ — All zeros (asset-light)
  - Table 5 (Projected Openings): ✅ — 90 signed/16 projected
- Total rows balance: 747+6-3-2+2 = 750 ✅
- Franchisee list exhibit count: Exhibit A (750 hotels), Exhibit B (former franchisees) ✅
- Gag clause flag: SET ✅ ("some current and former franchisees have signed provisions restricting their ability to speak")

### 3. Item 21 Sufficiency ✅
- Auditor identified: Cherry Bekaert (cbh.com), Tysons Corner, VA ✅
- Income statement: ✅ (3 years, all line items)
- Balance sheet: ✅ (2 years, all line items)
- Cash flow: ✅ (3 years, all line items)
- Notes to financial statements: ✅ (9 notes, all extracted in depth pass 1)
- Going concern: NOT present ✅
- Financial structure detail (enrichment): complete

### 4. State Addenda Sufficiency ✅
- State addenda exist: YES (Exhibit J-1 and D-1)
- States identified: 11 (CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA) ✅
- Structured into `state_addenda_overrides` in 09_final_canonical.json: YES ✅
- Override families extracted per-state: 35 total overrides across 7 families ✅
- Summary table included in RT_depth_state_addenda_promotion.json ✅

### 5. Key Exhibit Sufficiency ✅
- All exhibits listed in Item 22 accounted for in 04_exhibits.json: YES ✅
- Financial exhibits (C): deep-read ✅
- Franchise Agreement (D): clause-by-clause in depth pass 2 ✅
- Guaranty (E): scope described in Item 15 text; form cataloged ✅
- HITS Agreement (G): cataloged; key terms captured in contract burden ✅

### 6. Unresolveds and Contradictions ✅
- 06_coverage_audit.md contains 5 unresolveds + 1 contradiction ✅
- 08_final_report.md Section J contains 7 unresolveds ✅
- 08_final_report.md Section K contains 1 contradiction ✅
- 09_final_canonical.json has `unresolveds` key: YES (7 entries) ✅
- 09_final_canonical.json has `contradictions` key: YES (1 entry) ✅
- All unresolveds are genuine business-risk flags (not extraction gaps) ✅

### 7. Final Report Depth ✅
- 08_final_report.md: Full diligence report ✅
- Line count: ~400+ lines ✅
- Sections present:
  - A. Executive snapshot (14 numbered bullets) ✅
  - B. Fee stack, entry structure, initial investment ✅
  - C. Supplier control, operating control, technology burden ✅
  - D. Territory, competition, channels, encroachment ✅
  - E. Contract burden and legal mechanics ✅
  - F. Item 19 detail ✅
  - G. Item 20 detail ✅
  - H. Item 21 detail ✅
  - I. State addenda summary ✅
  - J. Unresolveds ✅
  - K. Contradictions ✅
  - L. Final coverage note ✅

### 8. Score Gate ✅
- 10_scorecard.md overall grade: A ✅
- All 23 items covered: YES ✅
- All canonical fields populated with evidence grounding: YES ✅

---

## Recovery Passes Needed

None. Verdict is 1 — Publish-Ready.
