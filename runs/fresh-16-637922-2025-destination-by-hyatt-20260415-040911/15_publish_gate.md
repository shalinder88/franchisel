# Publish Gate — Destination by Hyatt (637922-2025)

## Verdict: **1 — Publish-ready**

No material gaps. All items covered. Evidence grounded. Depth passes complete. Canonical families enforced.

---

## Rationale

This extraction is thorough across all 23 FDD Items, 13 Exhibits, and all mandatory depth passes. The document is a well-structured Hyatt Hotels Corporation FDD with clear formatting, consistent data, and no internal contradictions. The no-FPR status is accurately captured and flagged. All standard tables are present and balanced. State addenda are structured into canonical override families. Financial statements are fully extracted at key-line-item level with notes depth pass complete.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided**: No
- **No-FPR statement extracted**: Yes, verbatim — "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets."
- **Substantiation statement**: Not applicable (no FPR)
- **Assessment**: PASS

### 2. Item 20 Completeness
- **Table 1 (Systemwide)**: Present, 3 years, totals balance ✓
- **Table 2 (Transfers)**: Present, 3 years, all zeros ✓
- **Table 3 (Franchised Status)**: Present, 3 years, state-level, totals balance ✓
- **Table 4 (Company-Owned Status)**: Present, 3 years, state-level, totals balance ✓
- **Table 5 (Projected Openings)**: Present ✓
- **Franchisee list exhibit count**: 4 franchised outlets in Exhibit H ✓
- **Gag clause flag**: Set — no confidentiality clauses ✓
- **Assessment**: PASS

### 3. Item 21 Sufficiency
- **Auditor identified**: Deloitte & Touche LLP, Chicago, IL, since 2003 ✓
- **Income statement**: Extracted with key line items (2022-2024) ✓
- **Balance sheet**: Extracted (Dec 31, 2024 and 2023) ✓
- **Cash flow**: Extracted (2022-2024) ✓
- **Notes covered via depth pass**: Yes — RT_depth_financial_notes.json covers revenue recognition, depreciation, impairment, income taxes, leases, advertising fund, loyalty program, key money assets, real estate dispositions, debt, share repurchases ✓
- **Going-concern status**: Set — no going concern ✓
- **LLC entity balance sheet**: Extracted (California requirement) ✓
- **Assessment**: PASS

### 4. State Addenda Sufficiency
- **States identified**: 8 states (CA, HI, MD, MI, MN, ND, RI, VA) + 14-state multi-state provision ✓
- **Structured into state_addenda_overrides**: Yes — 24 override entries across 8 override families ✓
- **Per-state override families**: forum_selection, governing_law, general_release, termination, renewal, damages, transfer, financial_disclosure ✓
- **Summary table**: Present in RT_depth_state_addenda_promotion.json ✓
- **In canonical**: Yes — state_addenda_overrides family present in 09_final_canonical.json ✓
- **Assessment**: PASS

### 5. Key Exhibit Sufficiency
- **All Item 22 exhibits accounted for**: Yes — B, C, G, J, K, L, M all in 04_exhibits.json ✓
- **Financial exhibits deep-read**: Exhibit A key figures extracted + depth pass ✓
- **Franchise Agreement deep-read**: Contract burden depth pass completed ✓
- **Guaranty**: Described in Item 15 and contract burden pass ✓
- **Assessment**: PASS

### 6. Unresolveds and Contradictions
- **Unresolveds in 06_coverage_audit.md**: 7 items listed ✓
- **Unresolveds in 08_final_report.md**: 7 items listed ✓
- **Unresolveds in 09_final_canonical.json**: Populated — 7 structured entries with id, description, severity, source ✓
- **Contradictions in 09_final_canonical.json**: Populated — empty array (none found) ✓
- **All unresolveds are genuine business-risk flags**: Yes — AOP dimensions, Guarantor Monetary Threshold, revenue management trigger, cost allocation, legacy subsidies, tech upgrade limits, no FPR. None are extraction gaps. ✓
- **Assessment**: PASS

### 7. Final Report Depth
- **08_final_report.md line count**: ~500+ lines (full diligence report) ✓
- **Sections present**:
  - A. Executive snapshot (15 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operations, technology, marketing ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 detail (no FPR) ✓
  - G. Item 20 detail ✓
  - H. Item 21 detail ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓
- **Assessment**: PASS

### 8. Score Gate
- **10_scorecard.md overall grade**: A ✓
- **All required items covered**: 23/23 ✓
- **Canonical fields with evidence grounding**: Yes ✓
- **Assessment**: PASS

---

## Recovery Passes Needed

None. All 8 checklist items pass. No material gaps identified.
