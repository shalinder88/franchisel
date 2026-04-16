# Publish Gate — Caption by Hyatt (637920-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered with evidence grounding. Depth passes complete.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided**: No
- **No-FPR statement extracted verbatim**: Yes — "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets." (p81)
- **Substantiation contact captured**: Yes — Dan Hansen, Head of Americas Development, (312) 750-1234
- **Status**: PASS

### 2. Item 20 Completeness
- **All 5 standard tables present**: Yes (Systemwide, Transfers, Franchised Status, Company-Owned Status, Projected Openings)
- **Total rows balance**: Yes — Franchised: 0→1, Company-owned: 1→1, Total: 1→2 (end 2024). Consistent across tables.
- **Franchisee list exhibit count**: 4 franchisees in Exhibit G
- **Gag clause flag**: Set — No confidentiality clauses
- **Status**: PASS

### 3. Item 21 Sufficiency
- **Auditor identified**: Yes — Deloitte & Touche LLP (since 2003)
- **Income statement extracted**: Yes (2022–2024)
- **Balance sheet extracted**: Yes (2023–2024)
- **Cash flow extracted**: Yes (2022–2024)
- **Notes to financial statements covered**: Yes — depth pass completed with 7 accounting policies, 2 critical audit matters
- **Going-concern status**: Set — No going concern
- **Guarantee of Performance**: Captured — Hyatt Hotels Corporation
- **Franchisor unaudited balance sheet**: Extracted
- **Status**: PASS

### 4. State Addenda Sufficiency
- **State addenda exist**: Yes — Exhibit L, 6 states (Hawaii, Maryland, Michigan, Minnesota, North Dakota, Rhode Island)
- **Structured into canonical**: Yes — `state_addenda_overrides` family present in 09_final_canonical.json with 21 overrides across 6 override families (forum_selection, governing_law, general_release, termination, damages, renewal)
- **Per-state detail**: Present for all 6 states
- **Status**: PASS

### 5. Key Exhibit Sufficiency
- **Item 22 exhibits accounted for**: Yes — B, C, F, I, J, K, L all in 04_exhibits.json
- **Financial exhibits deep-read**: Yes (Exhibit A-1 and A-2 with depth pass)
- **Franchise agreement deep-read**: Yes (Exhibit C with contract burden depth pass)
- **Guaranty**: Addressed in contract burdens (personal guaranty of all obligations)
- **Status**: PASS

### 6. Unresolveds and Contradictions Assessment
- **06_coverage_audit.md contains unresolveds**: Yes — 7 identified
- **08_final_report.md contains unresolveds**: Yes — Section J with 7 items
- **Contradictions present**: Yes — 2 identified (both resolved/noted)
- **Structured families in canonical**: Yes — `unresolveds` key (7 items) and `contradictions` key (2 items) present in 09_final_canonical.json
- **All unresolveds are genuine business-risk flags**: Yes — U1 (no FPR) is highest severity; all others are real business risks, not extraction gaps
- **Status**: PASS

### 7. Final Report Depth
- **08_final_report.md line count**: ~400+ lines — full narrative diligence report
- **Required sections present**:
  - A. Executive snapshot (13 numbered bullets): PRESENT
  - B. Fees/investment detail: PRESENT
  - C. Supplier/operations/tech: PRESENT
  - D. Territory: PRESENT
  - E. Contract burden/legal: PRESENT
  - F. Item 19 detail: PRESENT
  - G. Item 20 detail: PRESENT
  - H. Item 21 detail: PRESENT
  - I. State addenda summary: PRESENT
  - J. Unresolveds: PRESENT (7 items with severity)
  - K. Contradictions: PRESENT (2 items)
  - L. Final coverage note: PRESENT
- **Status**: PASS

### 8. Score Gate
- **10_scorecard.md overall grade**: A
- **All required items covered**: Yes (23/23)
- **Canonical fields populated with evidence grounding**: Yes (21 top-level families)
- **Depth passes complete**: 4/4
- **Status**: PASS

---

## Verdict Rationale

All 8 checklist items pass. The extraction is comprehensive:
- 23/23 FDD items fully extracted
- 14 tables extracted with full provenance
- 14 exhibits cataloged
- 4 depth passes completed (financial notes, contract burdens, narrative promotion, state addenda)
- 7 unresolveds preserved (all genuine business risks)
- 2 contradictions documented (both resolved)
- 6 states with 21 overrides structured into canonical
- Full narrative diligence report with all required sections

**No recovery passes needed.**
