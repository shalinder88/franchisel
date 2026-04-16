# Publish Gate — Hyatt Place Hotels FDD (637925-2025)

Generated: 2026-04-15

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All depth passes complete.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES (3 FPRs + reservation channel mix)
- All tables extracted: YES (6 tables with full statistics — high/low/median/count exceeding)
- Population counts: YES (348 Covered Hotels, 323 Franchised, 25 Owned/Managed, 77 Urban)
- Exclusion rules: YES (4 opened during 2024 excluded from Covered Hotels, none closed)
- Substantiation statement: YES ("We will provide written substantiation...upon your reasonable request")
- Notes and caveats: YES (revenue only, no cost/expense data, unaudited internal data, converted hotel note)

### 2. Item 20 Completeness — PASS
- Table 1 (Systemwide summary): YES — all 3 years, franchised + company-owned
- Table 2 (Transfers): YES — by state, all 3 years, totals (27/14/19)
- Table 3 (Franchised status): YES — by state, all 3 years, all columns
- Table 4 (Company-owned status): YES — by state, all 3 years, all columns
- Table 5 (Projected openings): YES — by state, 72 signed/7 projected
- Totals balance: YES — 318 franchised + 24 company = 342 total
- Franchisee list exhibit count: YES — Exhibits G and H identified
- Gag clause flag: YES — "No franchisees have signed confidentiality clauses"

### 3. Item 21 Sufficiency — PASS
- Auditor identified: YES — Deloitte & Touche LLP (since 2003)
- Income statement extracted: YES — 3 years, all key lines
- Balance sheet extracted: YES — 2 years, all key lines
- Cash flow extracted: YES — 3 years with supplemental disclosures
- Notes to financial statements: YES — depth pass covered revenue recognition, D&A, impairment, leases, loyalty program, tax, related party, investing activities, share repurchases
- Going concern: NO going concern language (PASS)

### 4. State Addenda Sufficiency — PASS
- State addenda identified: YES — Exhibit L, pages 399-419
- States extracted: YES — 6 states (CA, HI, MD, MI, MN, ND)
- Structured into canonical: YES — `state_addenda_overrides` family with 16 overrides across 5 families
- Override families structured per-state: YES — forum_selection, governing_law, general_release, termination, damages
- No-waiver states: YES — 14 states identified

### 5. Key Exhibit Sufficiency — PASS
- All Item 22 exhibits accounted for in 04_exhibits.json: YES
- Financial exhibits deep-read: YES (Exhibit A-1 — audited financials + notes depth pass)
- Franchise Agreement deep-read: YES (Exhibit C — contract burden depth pass)
- Guaranty: Covered in Item 15 and contract burden depth pass

### 6. Unresolveds and Contradictions — PASS
- Unresolveds in audit/report: YES — 8 identified in reader report and final report
- Preserved in canonical: YES — `unresolveds` key with 8 entries (2 high, 4 medium, 2 low)
- Contradictions in audit/report: YES — 2 identified
- Preserved in canonical: YES — `contradictions` key with 2 entries
- All unresolveds are genuine business-risk flags, not extraction gaps: YES

### 7. Final Report Depth — PASS
- 08_final_report.md line count: ~400+ lines
- Required sections present:
  - A. Executive snapshot (14 numbered bullets): YES
  - B. Fee stack, entry structure, initial investment: YES (detailed)
  - C. Supplier control, operations, tech, reporting: YES
  - D. Territory, competition, channels: YES
  - E. Contract burden and legal mechanics: YES
  - F. Item 19 detail: YES (all 3 FPRs, statistics, caveats)
  - G. Item 20 detail: YES (all tables, trajectory, transfers, projections)
  - H. Item 21 detail: YES (auditor, income statement, balance sheet, cash flow, key observations)
  - I. State addenda summary: YES (6 states, override families)
  - J. Unresolveds: YES (8 entries with severity)
  - K. Contradictions: YES (2 entries with resolution)
  - L. Final coverage note: YES (fully surfaced vs. pending vs. not disclosed)

### 8. Score Gate — PASS
- Scorecard grade: A
- All required items covered: YES (23/23)
- Canonical fields populated with evidence grounding: YES
- Depth passes complete: 4/4

---

## Rationale

This extraction is publish-ready. All 23 FDD items have been fully extracted with evidence grounding. Three FPRs with complete statistics, all 5 standard Item 20 tables, and comprehensive financial statements with depth-pass notes analysis have been captured. State addenda from 6 states have been structured into canonical with 16 overrides across 5 families. The franchise agreement has been analyzed clause-by-clause. Eight business-risk unresolveds and 2 non-material contradictions have been identified and preserved in canonical. The final report is a substantive 400+ line diligence document with all required sections.

No recovery tasks needed.
