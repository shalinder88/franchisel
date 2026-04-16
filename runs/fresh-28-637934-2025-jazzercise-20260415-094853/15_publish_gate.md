# Publish Gate — Jazzercise, Inc. (637934-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All depth passes completed.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **No FPR provided.** Jazzercise explicitly declines to make any financial performance representation.
- The no-FPR statement is extracted verbatim in canonical: "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised businesses."
- Substantiation availability: Not applicable (no FPR made).
- **Status: ✅ Complete**

### 2. Item 20 Completeness
- All 5 standard tables present:
  - Systemwide outlet information: ✅ (3 years)
  - Transfers: ✅ (3 years, all zero)
  - Franchised status by state: ✅ (49 states + DC, 3 years, totals verified)
  - Company-owned status: ✅ (3 years, all zero)
  - Projected openings: ✅ (all states + totals)
- Total rows balance: ✅ Verified (5,253 start → 385 new − 24 term − 363 ceased = 5,251 end)
- Franchisee list exhibit count: ✅ Exhibit H cataloged (pages 277–288)
- Gag clause flag: ✅ Set to false — "no current or former franchisees have signed confidentiality clauses"
- **Status: ✅ Complete**

### 3. Item 21 Sufficiency
- Auditor identified: ✅ RSM US LLP
- Income statement: ✅ Extracted (3 years)
- Balance sheet: ✅ Extracted (3 years)
- Cash flow: ✅ Extracted (3 years)
- Notes: ✅ All 13 notes deep-read and structured (RT_depth_financial_notes.json)
- Going-concern status: ✅ Set to false (clean/unqualified opinion)
- **Status: ✅ Complete**

### 4. State Addenda Sufficiency
- All 11 states identified and read: ✅
- Structured into `state_addenda_overrides` in 09_final_canonical.json: ✅
- Override families extracted per-state: ✅ (27 overrides across 6 families)
- RT_depth_state_addenda_promotion.json written: ✅
- Summary table of override families × states: ✅
- **Status: ✅ Complete**

### 5. Key Exhibit Sufficiency
- Item 22 contracts all accounted for in 04_exhibits.json: ✅
  - Exhibit D (Class Owner FA): ✅ Cataloged + clause-by-clause via depth pass
  - Exhibit E (Associate FA): ✅ Cataloged
  - Exhibit F (Business Owner FA): ✅ Cataloged
  - Exhibit I (Junior/LO addenda): ✅ Cataloged
  - Exhibit J (General Release): ✅ Cataloged
  - Exhibit L (Training Agreement): ✅ Cataloged
  - Exhibit M (SBA Addendum): ✅ Cataloged
- Financial exhibits (Exhibit C): ✅ Deep read
- Franchise agreement (Exhibit D): ✅ Deep read via Depth Pass 2
- **Status: ✅ Complete**

### 6. Unresolveds and Contradictions Assessment
- 06_coverage_audit.md contains 5 unresolveds: ✅
- 08_final_report.md Section J contains 5 unresolveds with severity ratings: ✅
- 08_final_report.md Section K confirms no contradictions: ✅
- 09_final_canonical.json has `unresolveds` top-level key: ✅ (5 entries)
- 09_final_canonical.json has `contradictions` top-level key: ✅ (empty array)
- All 5 unresolveds are genuine business-risk flags, not extraction gaps:
  1. Revenue recognition timing change — business/accounting matter
  2. Stock conversion purpose — governance matter
  3. Related party Trust receivable — related-party risk
  4. Revel Dance Fitness competitive risk — competitive risk
  5. Negative operating cash flow — financial health concern
- **Status: ✅ Complete**

### 7. Final Report Depth
- 08_final_report.md is a full diligence report (~400+ lines)
- Required sections present:
  - A. Executive snapshot (13 numbered bullets): ✅
  - B. Fees/investment (detailed breakdown): ✅
  - C. Supplier/operations/tech (4 subsections): ✅
  - D. Territory (channels, encroachment, Revel): ✅
  - E. Contract burden/legal (term, renewal, termination, transfer, noncompete, dispute, litigation): ✅
  - F. Item 19 detail (no FPR + substantiation): ✅
  - G. Item 20 detail (trajectory table, activity, projections, gag clause): ✅
  - H. Item 21 detail (auditor, BS, IS, CF, key observations): ✅
  - I. State addenda summary (11 states, material overrides): ✅
  - J. Unresolveds (5 items with severity): ✅
  - K. Contradictions (none found): ✅
  - L. Final coverage note (fully surfaced vs. not): ✅
- **Status: ✅ Complete**

### 8. Score Gate
- 10_scorecard.md overall grade: B+ (appropriate — strong extraction with noted financial weakness)
- All required items covered: ✅
- All canonical families populated with evidence grounding: ✅
- Depth passes all completed: ✅
- **Status: ✅ Pass**

---

## Rationale

This extraction is publish-ready. All 23 Items were fully read and extracted. All 14 material tables were captured. Financial statements were deep-read with all 13 notes structured. The franchise agreement was read clause-by-clause. State addenda for all 11 states were structured into override families in canonical. Five genuine business-risk unresolveds are preserved. No contradictions were found. The final report is a full narrative diligence report with all required sections.

No recovery passes are needed.
