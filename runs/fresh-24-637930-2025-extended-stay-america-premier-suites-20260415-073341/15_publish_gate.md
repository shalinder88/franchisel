# Publish Gate — Extended Stay America Premier Suites FDD (2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. State addenda structured. Unresolveds documented and justified.

---

## Rationale

This extraction is comprehensive across all 23 FDD items, 11 exhibits, and 4 depth passes. The franchise system is young and growing (49 total hotels, 17 franchised), with clean performance data and financial statements audited by Deloitte & Touche LLP. All required canonical families are populated.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with 4 tables: operating metrics, channel mix, length of stay, B2B revenue
- All tables extracted with population counts (41 Brand Hotels), averages, medians, and percentages at/exceeding average
- Population methodology documented: combined owned + franchised (9 too small to report separately, "not materially different")
- No cost/expense data disclosed — this is the FDD's limitation, not an extraction gap
- Substantiation availability statement captured: "Written substantiation... will be made available upon reasonable request"

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - Table 1: System-wide summary (3 years)
  - Table 2: Transfers (zero across all years)
  - Table 3: Franchised status by state (14 states, 3 years)
  - Table 4: Company-owned status by state (10 states, 3 years)
  - Table 5: Projected openings (41 signed/12 projected)
- Total rows verified and consistent
- Franchisee list exhibit count: Exhibit J (4 pages, 297-300)
- Gag clause flag: No confidentiality clauses signed in last 3 fiscal years

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Deloitte & Touche LLP (recovered via image rendering)
- Balance sheet, income statement, cash flow, member's capital all extracted
- Financial statement notes covered (7 notes from FY2024/2023 set, 8 notes from FY2023/2022 set)
- Financial note depth pass complete (RT_depth_financial_notes.json)
- Going concern status: No going concern
- Revenue recognition, intangibles, leases, brand launch expenses, contract liabilities, related party transactions all documented

### 4. State Addenda Sufficiency — PASS
- 13 states identified with addenda (12 in Exhibit G + Michigan in front matter)
- All state addenda read and extracted
- Structured into `state_addenda_overrides` in 09_final_canonical.json
- 32 overrides across 10 override families (forum_selection, governing_law, general_release, termination, damages, interest_rate, noncompete, jury_trial, transfer_fee, renewal)
- Summary table of override families × states produced in RT_depth_state_addenda_promotion.json

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json
- Exhibits A, B, C (contracts): cataloged with page ranges; key burden provisions extracted via depth pass
- Exhibit D (financial statements): fully extracted
- Exhibit H (guaranty): cataloged
- Exhibit I (general release): cataloged
- Franchise Agreement deep-read via RT_depth_contract_burdens.json

### 6. Unresolveds and Contradictions — PASS
- 4 unresolveds documented in 09_final_canonical.json:
  - U1: Exhibit K not found (low severity — zero departures)
  - U2: Digital Marketing Commission timing (low)
  - U3: Antitrust litigation outcome (medium — genuine business risk)
  - U4: SSF denominator ambiguity (low)
- 2 contradictions documented:
  - C1: FDD year typo (resolved)
  - C2: SSF spending denominator (unresolved, low impact)
- All unresolveds are genuine business-risk flags or minor documentation issues, not extraction gaps
- `unresolveds` and `contradictions` keys present as structured families in canonical

### 7. Final Report Depth — PASS
- 08_final_report.md is a full diligence report (~400+ lines)
- All required sections present:
  - A: Executive snapshot (15 numbered bullets)
  - B: Fee stack, entry structure, initial investment
  - C: Supplier control, operations, technology, marketing
  - D: Territory, competition, channels, encroachment
  - E: Contract burden and legal mechanics
  - F: Item 19 detail (all tables, caveats)
  - G: Item 20 detail (trajectory, state data, projections)
  - H: Item 21 detail (auditor, statements, observations)
  - I: State addenda summary (12 states + Michigan)
  - J: Unresolveds (5 items with severity)
  - K: Contradictions (2 items)
  - L: Final coverage note

### 8. Score Gate — PASS
- Overall grade: A-
- All 23 items covered with grade A
- All required items covered with evidence grounding
- Canonical fields populated with source pages and confidence levels

---

## Recovery Passes Needed
None. Verdict is 1 — publish-ready.
