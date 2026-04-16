# Publish Gate — Hilton Hotels & Resorts FDD (638058-2025)

## Verdict: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. Depth passes complete.

---

## Rationale

This extraction is comprehensive across all 23 Items, all material tables, financial statements, exhibits, and state addenda. Four depth passes were completed (financial notes, contract burdens, narrative-to-canonical promotion, state addenda structured overrides). All mandatory canonical families are present (unresolveds, contradictions, state_addenda_overrides). The final report is a full narrative diligence report with all required sections.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR is provided with 4 charts (room rate, occupancy, occupancy index, RevPAR index)
- All tables extracted with population counts (199 Comparable Hotels, 46 company-managed, 153 franchisee-managed)
- Exclusion rules documented (43 non-comparable hotels excluded for brand/ownership changes, damage, room count changes)
- Averages, medians, and ranges captured for all metrics
- No cost/EBITDA data disclosed — this is an FDD limitation, not an extraction gap
- Substantiation availability statement captured: "available on reasonable request"

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - Table 1: Systemwide summary (3 years) ✓
  - Table 2: Transfers (3 years, by state) ✓
  - Table 3: Franchised status (3 years, by state) ✓
  - Table 4: Company-owned status (3 years — all zeros) ✓
  - Table 5: Projected openings ✓
- Total rows balance (verified: 187 end-of-year matches across tables)
- Franchisee list exhibit count: 187 hotels in Exhibit A
- Gag clause flag: SET — "some current and former franchisees have signed provisions restricting their ability to speak"

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Cherry Bekaert, Tysons Corner, VA
- Income statement: Extracted (3 years) ✓
- Balance sheet: Extracted (2 years) ✓
- Cash flow: Extracted (3 years) ✓
- Notes to financial statements: Covered via Depth Pass 1 (9 notes) ✓
- Going-concern: None (clean opinion)

### 4. State Addenda Sufficiency — PASS
- 11 states identified in Exhibit J-1 ✓
- All state addenda STRUCTURED into state_addenda_overrides in 09_final_canonical.json ✓
- 34 override entries across 8 override families ✓
- Override summary table present in RT_depth_state_addenda_promotion.json ✓
- Per-state detail present in canonical ✓

### 5. Key Exhibit Sufficiency — PASS
- All exhibits from Item 22 accounted for in 04_exhibits.json ✓
- Financial exhibits (Exhibit C): Deep-read ✓
- Franchise Agreement (Exhibit D): Deep-read via Depth Pass 2 ✓
- Guaranty (Exhibit E): Cataloged, scope described in Item 15 ✓
- HITS Agreement (Exhibit G): Cataloged, key terms in Items 5/6/11 ✓

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists 7 unresolveds ✓
- 08_final_report.md Section J lists 7 unresolveds with severity levels ✓
- 09_final_canonical.json contains `unresolveds` key with 8 structured entries ✓
- 09_final_canonical.json contains `contradictions` key (empty array — document is consistent) ✓
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U1: No renewal right (structural risk)
  - U2: Assets pledged as debt collateral (structural risk)
  - U3: Pending antitrust litigation (business risk)
  - U4: Gag clause (due diligence limitation)
  - U5: No protected territory (business risk)
  - U6: No cost data in FPR (underwriting limitation)
  - U7: Liquidated damages formula (contract risk)
  - U8: Subsequent events note date error (minor)

### 7. Final Report Depth — PASS
- 08_final_report.md is a full narrative diligence report
- All required sections present:
  - A: Executive snapshot (13 numbered bullets) ✓
  - B: Fee stack, entry structure, initial investment ✓
  - C: Supplier control, operations, technology, training ✓
  - D: Territory, competition, channels, encroachment ✓
  - E: Contract burden and legal mechanics ✓
  - F: Item 19 — Financial performance representations ✓
  - G: Item 20 — Outlet data ✓
  - H: Item 21 — Financial statements ✓
  - I: State addenda summary ✓
  - J: Unresolveds ✓
  - K: Contradictions ✓
  - L: Final coverage note ✓
- Report is approximately 400+ lines of narrative content

### 8. Score Gate — PASS
- 10_scorecard.md overall grade: A-
- All 23 Items graded A
- All required items covered
- Canonical fields populated with evidence grounding (source_section + source_pages)
- All 4 depth passes completed and reflected in scorecard

---

## Recovery Passes Needed

None. Verdict is 1 — Publish-Ready.
