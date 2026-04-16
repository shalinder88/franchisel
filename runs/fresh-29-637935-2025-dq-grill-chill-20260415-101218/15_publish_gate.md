# Publish Gate — DQ Grill & Chill FDD (637935-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All mandatory canonical families present.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES
- Schedule A: 4 years extracted (2021-2024) with count, average, median, high, low, % at/above for each year
- Schedule B: 4 years extracted (2021-2024) with 5 expense/profit categories for each year
- Population criteria captured: newly constructed freestanding, opened Jan 2014-Dec 2023, all 12 months
- Exclusion rules captured: Texas DQ, conversions, fuel centers, non-traditional, territory operator subfranchised
- Schedule B exclusion counts captured: 91 (2021), 101 (2022), 106 (2023), 285 (2024)
- Definitions captured: Gross Sales, Cost of Goods, Labor, Restaurant Controllables, Manageable Profit, Adjustments
- Substantiation statement captured: "Written substantiation for the FPR will be made available at ADQ's office in Minneapolis"
- Warning statement captured: "Some Restaurants have earned the amounts reflected in this FPR. Your individual results will differ."

### 2. Item 20 Completeness — PASS
- Systemwide outlet summary: YES (direct-licensed, subfranchised, Texas DQ)
- Transfers: YES (by state, 3-year history)
- Franchised outlet status: YES (by state, 3 years, with all columns)
- Company-owned outlet status: YES (2 in MN, stable)
- Projected openings: YES (26 signed/not open, 38 projected, 0 company-owned)
- Franchisee list exhibit count: YES (Exhibit J current, Exhibit K: 46 former)
- Gag clause flag: YES ("In some instances, during the last three fiscal years, current and former franchisees have signed provisions restricting their ability to speak openly")
- Total rows balance: Checked — 1967 + 30 - 28 = 1969 ✓

### 3. Item 21 Sufficiency — PASS
- Auditor: Deloitte & Touche LLP ✓
- Opinion: Clean/unqualified, signed Feb 7, 2025 ✓
- Income statement: Extracted (3 years, all line items) ✓
- Balance sheet: Extracted (2 years, all line items) ✓
- Cash flows: Extracted (3 years) ✓
- Equity changes: Extracted (3 years) ✓
- Notes to financial statements: Covered via RT_depth_financial_notes.json (12 note categories) ✓
- Going concern: No going concern issue — clean opinion ✓
- Guarantee of Performance: Captured (IDQ unconditional guarantee) ✓

### 4. State Addenda Sufficiency — PASS
- States identified: CA, HI, IL, MD, MI (front matter), MN, ND, RI, WA — 9 states ✓
- All extracted: YES ✓
- Structured into canonical: YES — `state_addenda_overrides` family in 09_final_canonical.json with per-state override entries ✓
- Override families covered: forum_selection, governing_law, noncompete, general_release, termination/notice_cure, damages/termination_fee, transfer, anti_waiver, trademark_defense, fee_deferral, no_poach ✓
- RT_depth_state_addenda_promotion.json: 30 structured override entries with summary table ✓

### 5. Key Exhibit Sufficiency — PASS
- Item 22 contracts (B, C, D, F, G, H): All accounted for in 04_exhibits.json ✓
- All 13 exhibits (A-M) cataloged ✓
- Financial statements (Exhibit L): Deep-read with notes ✓
- Franchise agreement (Exhibit B): Structure read, key terms extracted via Item 17 + depth pass ✓
- Guarantee: Captured (Undertaking and Guarantee in Exhibit B; IDQ Guarantee of Performance in Exhibit L) ✓

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists gaps: YES ✓
- 08_final_report.md has Unresolveds section (J) with 7 items: YES ✓
- 08_final_report.md has Contradictions section (K) with 3 items: YES ✓
- 09_final_canonical.json has `unresolveds` key: YES (7 entries) ✓
- 09_final_canonical.json has `contradictions` key: YES (3 entries) ✓
- All unresolveds are genuine business-risk flags, not extraction gaps ✓
- No extraction gaps requiring A4 recovery ✓

### 7. Final Report Depth — PASS
- 08_final_report.md: 401 lines ✓ (exceeds 100-line minimum)
- Sections present:
  - A. Executive snapshot (14 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operations, tech, training ✓
  - D. Territory, competition, channels ✓
  - E. Contract burden, legal mechanics ✓
  - F. Item 19 detail (Schedule A + B with caveats) ✓
  - G. Item 20 detail (trajectory, projected, confidentiality) ✓
  - H. Item 21 detail (auditor, balance sheet, income, cash flows, key observations) ✓
  - I. State addenda summary (9 states with key overrides table) ✓
  - J. Unresolveds (7 items with severity) ✓
  - K. Contradictions (3 items with resolution) ✓
  - L. Final coverage note ✓

### 8. Score Gate — PASS
- 10_scorecard.md overall grade: A ✓
- All 23 items covered: YES ✓
- All tables extracted: 15 ✓
- All exhibits cataloged: 13 ✓
- Canonical fields populated with evidence grounding (source_section, source_pages, confidence) ✓

---

## Recovery Passes Needed
None. This extraction is publish-ready.
