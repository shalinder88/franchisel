# Publish Gate — We Are Crackin' LLC (637908-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. Depth passes complete.

---

## Rationale

This extraction meets all publish gate criteria. All 23 FDD items are fully extracted with evidence-grounded data. The financial statements were recovered via pdftoppm rendering. State addenda are fully structured. Unresolveds are genuine business-risk flags, not extraction gaps.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided: YES — Gross Sales for all three brand concepts (Egg N' Joe, Elmer's, Elmer's Kitchen).
- All tables extracted: 4 tables across 3 parts with all units, both years (2023 and 2024).
- Notes extracted: definition of Gross Sales, population counts, exclusion rules (1 franchised excluded for ceased operations, 1 company-owned excluded for <1 year), varying fiscal year ends.
- Substantiation availability statement: captured verbatim ("Written substantiation of the data used in preparing the financial performance representation will be made available to a prospective franchisee on reasonable request.").
- No FPR gap.

### 2. Item 20 Completeness ✅
- All 5 standard tables present for all 3 brand concepts (15 tables total): systemwide summary, transfers, franchised status, company-owned status, projected openings.
- Totals balance: Elmer's 7 franchised + 13 company = 20 total ✓. Egg N' Joe 0 + 3 = 3 ✓. Kitchen 0 + 2 = 2 ✓.
- Franchisee list exhibit count: 7 current (Exhibit E), 6 former (Exhibit F) ✓.
- Gag clause flag: SET — "franchisees have signed confidentiality clauses in last 3 fiscal years" ✓.

### 3. Item 21 Sufficiency ✅
- Auditor identified: Jones & Roth, P.C., Eugene, Oregon ✓.
- Income statement, balance sheet, and cash flow: all extracted with line-item detail ✓.
- Notes to financial statements: covered via depth pass (RT_depth_financial_notes.json) — 5 notes, 14 sub-topics ✓.
- Going-concern status: no going-concern qualification (set to false) ✓.

### 4. State Addenda Sufficiency ✅
- State addenda exist for CA, IL, WA, WI — all identified and extracted ✓.
- Structured into state_addenda_overrides in 09_final_canonical.json: YES ✓.
- Override families covered: forum_selection, governing_law, noncompete, general_release, termination, interest_rate, damages ✓.
- Per-state overrides: CA (6), IL (4), WA (6), WI (1) = 16 total ✓.
- RT_depth_state_addenda_promotion.json written with full detail ✓.

### 5. Key Exhibit Sufficiency ✅
- All exhibits listed in Item 22 accounted for in 04_exhibits.json: YES ✓.
- Financial statements (Exhibit G): deep-read via pdftoppm ✓.
- Franchise Agreement (Exhibit C): key provisions extracted in contract burden depth pass ✓.
- Guaranty: scope identified (personal, joint and several, spousal consent, unlimited) ✓.

### 6. Unresolveds and Contradictions Assessment ✅
- 08_final_report.md contains unresolveds section: YES (8 items listed) ✓.
- 06_coverage_audit.md contains unresolveds: YES (5 items) ✓.
- 09_final_canonical.json has `unresolveds` key: YES (8 structured entries) ✓.
- 09_final_canonical.json has `contradictions` key: YES (empty array — no contradictions found) ✓.
- All unresolveds are genuine business-risk flags (not extraction gaps): YES ✓.
  - U1: Kitchen revenue collapse (business risk)
  - U2: Assets pledged as collateral (business risk)
  - U3: Equity adequacy (business risk)
  - U4: No EBITDA (FDD limitation, not extraction gap)
  - U5: Gag clause (business risk)
  - U6: No franchised growth (business risk)
  - U7: WA financial condition flag (regulatory flag)
  - U8: BPF admin overhead (business risk)

### 7. Final Report Depth ✅
- 08_final_report.md is a full diligence report: YES ✓.
- Line count: ~400+ lines ✓ (not a concise metrics summary).
- Required sections present:
  - A. Executive snapshot (14 numbered bullets) ✓
  - B. Fees/investment ✓
  - C. Supplier/operations/tech ✓
  - D. Territory ✓
  - E. Contract burden/legal ✓
  - F. Item 19 detail ✓
  - G. Item 20 detail ✓
  - H. Item 21 detail ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓

### 8. Score Gate ✅
- 10_scorecard.md grade: A- ✓.
- All required items covered ✓.
- All canonical fields populated with evidence grounding ✓.
- Depth passes recorded ✓.

---

## Recovery Passes Needed
None. Verdict 1 — Publish-ready.
