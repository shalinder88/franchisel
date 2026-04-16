# Publish Gate: Homewood Suites by Hilton FDD (638060-2025)

## VERDICT: 1 — PUBLISH-READY

No material gaps. All items covered. Evidence grounded. All mandatory canonical families present.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR is provided: 4 charts (Room Rate, Occupancy, Occupancy Index, RevPAR Index)
- All tables extracted with averages, medians, ranges, population counts, percentages
- Comparable Hotels definition and exclusion rules captured (437 of 518; open ≥1 full year, no brand/ownership changes, no major renovations)
- 1 hotel excluded from index calculations for insufficient data — noted
- No EBITDA or cost build-up — confirmed as not disclosed in FDD (not an extraction gap)
- Substantiation availability statement captured: "We will make available to you on reasonable request written substantiation"

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - Table 1: Systemwide Hotel Summary (franchised + company-owned) — PRESENT
  - Table 2: Transfers of Franchised Hotels — PRESENT (totals: 28/28/26)
  - Table 3: Status of Franchised Hotels — PRESENT (state-by-state, totals balance: 499→508→511→518)
  - Table 4: Status of Company-Owned Hotels — PRESENT (all zeros)
  - Table 5: Projected Openings — PRESENT (142 signed not open, 17 projected)
- Totals balance correctly
- Exhibit A franchisee list: 518 hotels across 28 pages (pp. 94-121)
- Gag clause flag: SET — "some current and former franchisees have signed provisions restricting their ability to speak"

### 3. Item 21 Sufficiency — PASS
- Auditor: Cherry Bekaert LLP — identified
- Opinion: Unqualified (clean) — identified
- Balance sheet: extracted (2024 and 2023)
- Income statement: extracted (2024, 2023, 2022)
- Cash flow: extracted (2024, 2023, 2022)
- Financial statement notes: fully covered via Depth Pass 1 (RT_depth_financial_notes.json) — 8 accounting policies, 7 material notes
- Going-concern: Entity is NOT a standalone going concern (holds $317K cash, all assets pledged, disregarded entity) — documented

### 4. State Addenda Sufficiency — PASS
- Exhibit J-1 identified in 04_exhibits.json (pp. 271-280)
- 11 states with addenda extracted: CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA
- STRUCTURED into `state_addenda_overrides` in 09_final_canonical.json — CONFIRMED (line 203)
- Override families structured per-state: forum_selection, governing_law, damages, termination, renewal, general_release, noncompete, transfer, jury_waiver, anti_waiver, notice_cure
- Depth Pass 4 (RT_depth_state_addenda_promotion.json) contains 37 structured override entries with summary matrix
- State addenda discussed in 08_final_report.md Section I (full page)

### 5. Key Exhibit Sufficiency — PASS
- Item 22 lists: Exhibits D, D-2, E, F, G, K
- 04_exhibits.json catalogs all 15 exhibits (A through M including sub-exhibits D-1, D-2, J-1, J-2) with page ranges
- Exhibit C (Financial Statements): Deep-read (balance sheet, income statement, cash flow, all notes)
- Exhibit D (Franchise Agreement): Deep-read via Depth Pass 2 — 14 burden categories extracted
- Exhibit E (Guaranty): Referenced and scope documented
- Exhibit J-1 (State Addenda): Deep-read via Depth Pass 4
- Exhibit G (HITS Agreement): Referenced in Items 5, 6, 9, 11, 17

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md: lists 4 gaps (Connected Room fee verified via R1, state addenda completed via R2, financial notes via R3)
- 08_final_report.md: Section J lists 6 unresolveds, Section K lists 1 contradiction
- 09_final_canonical.json: `unresolveds` key PRESENT (6 items) — CONFIRMED at line 192
- 09_final_canonical.json: `contradictions` key PRESENT (1 item, resolved) — CONFIRMED at line 200
- All 6 unresolveds are genuine business-risk flags:
  - U1: Trademark registration risk (HIGH)
  - U2: Antitrust class actions (HIGH)
  - U3: Asset pledge (MEDIUM)
  - U4: QA program changes (MEDIUM)
  - U5: Program fee ceiling (LOW)
  - U6: Note 9 date typo (LOW)
- No extraction gaps remain — all are business risks

### 7. Final Report Depth — PASS
- 08_final_report.md: 425 lines — substantial narrative report
- REQUIRED sections all present:
  - A: Executive snapshot (14 numbered bullets) — PRESENT
  - B: Fee stack, entry structure, initial investment — PRESENT (detailed tables)
  - C: Supplier control, operations, tech, reporting — PRESENT
  - D: Territory, competition, channels, encroachment — PRESENT
  - E: Contract burden and legal mechanics — PRESENT (term, transfer, termination, death, noncompete, dispute resolution, litigation)
  - F: Item 19 detail — PRESENT (4 charts with tables, ranges, caveats)
  - G: Item 20 detail — PRESENT (multi-year trajectory, activity tables, projections, gag clause)
  - H: Item 21 detail — PRESENT (auditor, all 3 statements, 10 key observations)
  - I: State addenda summary — PRESENT (11 states with material overrides)
  - J: Unresolveds — PRESENT (6 items with severity)
  - K: Contradictions — PRESENT (1 item, resolved)
  - L: Final coverage note — PRESENT

### 8. Score Gate — PASS
- 10_scorecard.md: extraction quality metrics strong
  - 23/23 items covered
  - 14 tables extracted
  - 15 exhibits cataloged
  - 3 retries executed, 0 material gaps remaining
  - A2 depth passes: 4 completed
  - Mandatory canonical families: all 3 present
- All canonical fields have source_section and source_pages grounding
- Verdict: EXTRACTION COMPLETE — HIGH CONFIDENCE

---

## Recovery Passes Needed

**None.** This extraction is publish-ready.
