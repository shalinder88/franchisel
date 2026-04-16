# Publish Gate — Hyatt Studios FDD (637927-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All depth passes complete. Canonical families enforced.

---

## Rationale

This extraction is comprehensive. All 23 Items were extracted with full data. All 5 standard Item 20 tables are present (though all values are zero — this is correct for a pre-revenue brand). The Item 19 no-FPR statement was captured verbatim. Item 21 financial statements were extracted with income statement, balance sheet, and cash flows. Depth passes covered financial notes, contract burdens, narrative-to-canonical promotion, and state addenda structured promotion. All mandatory canonical families (unresolveds, contradictions, state_addenda_overrides) are present.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: PASS
- No FPR provided — franchisor explicitly declines
- No-FPR statement extracted verbatim in canonical (item19.statement)
- Substantiation availability: Not applicable — no FPR made

### 2. Item 20 Completeness
- **Status**: PASS
- All 5 standard tables present: systemwide summary, transfers, franchised status, company-owned status, projected openings
- Total rows balance (all zeros)
- Franchisee list exhibit count captured: 45 agreements, 20 states
- Gag clause flag: NO confidentiality clauses
- No franchisee organizations

### 3. Item 21 Sufficiency
- **Status**: PASS
- Auditor identified: Deloitte & Touche LLP (since 2003)
- Income statement extracted (3 years)
- Balance sheet extracted (2 years)
- Cash flows extracted (3 years)
- Notes to financial statements covered via depth pass 1
- Going concern: None
- Guarantee of Performance: Confirmed — Hyatt Hotels Corp unconditional guarantee

### 4. State Addenda Sufficiency
- **Status**: PASS
- 14 states identified and extracted
- State addenda structured into `state_addenda_overrides` in canonical
- Override families include: forum selection (6 states), governing law (4 states), general release (5 states), termination/good cause (3 states), liquidated damages (3 states), anti-waiver (14 states), insolvency termination (2 states)
- RT_depth_state_addenda_promotion.json contains 23 structured override entries

### 5. Key Exhibit Sufficiency
- **Status**: PASS
- All 12 exhibits cataloged in 04_exhibits.json
- Financial exhibits (A-1, A-2): Deep-read
- Franchise Agreement (C): Deep-read via depth pass 2
- Franchisee list (J): Complete — 45 franchisees, all not open
- Former franchisees (K): None
- State addenda (L): Deep-read via depth pass 4

### 6. Unresolveds and Contradictions Assessment
- **Status**: PASS
- 6 unresolveds documented in both 06_coverage_audit.md and 08_final_report.md
- 1 contradiction documented
- Both `unresolveds` (6 entries) and `contradictions` (1 entry) families present in 09_final_canonical.json
- All unresolveds are genuine business-risk flags (trademark uncertainty, litigation outcome, per-deal terms) — not extraction gaps

### 7. Final Report Depth
- **Status**: PASS
- 08_final_report.md is a full diligence report (400+ lines)
- Contains all required sections:
  - A. Executive snapshot (14 numbered bullets)
  - B. Fee stack, entry structure, initial investment (complete tables)
  - C. Supplier control, operations, technology, marketing
  - D. Territory, competition, channels, encroachment
  - E. Contract burden and legal mechanics
  - F. Item 19 (no FPR)
  - G. Item 20 (outlet data with all tables)
  - H. Item 21 (financial statements with key data)
  - I. State addenda summary (14 states with override table)
  - J. Unresolveds (6 items with severity)
  - K. Contradictions (1 item)
  - L. Final coverage note

### 8. Score Gate
- **Status**: PASS
- 10_scorecard.md: Overall grade A
- All 23 items covered
- 28/28 canonical families populated (25 base + 3 enforcement)
- All depth passes complete
- All required items covered with evidence grounding

---

## Recovery Passes Needed

**None.** No material gaps requiring recovery.
