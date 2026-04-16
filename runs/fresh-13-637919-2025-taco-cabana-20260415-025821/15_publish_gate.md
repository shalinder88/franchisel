# Publish Gate — Taco Cabana FDD 2025

Filing ID: 637919-2025
Gate Date: 2026-04-15

---

## VERDICT: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. Full diligence report present.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS

- FPR provided: YES (company-operated units, 143 units)
- All tables extracted: YES — quartile table (4 segments) and high/median/low table (5 metrics)
- Population count: 143 units, all open 12+ months
- Exclusion rules: 6 franchised units excluded (none provided data)
- Notes under tables: Captured (unaudited, company-operated, no rent/EBITDA disclosed)
- Substantiation statement: Captured ("Written substantiation... will be made available to the prospective franchisee upon reasonable request")
- Caveats documented: YES (6 critical caveats in reader report and final report)

### 2. Item 20 Completeness — PASS

- Table 1 (Systemwide): Present, totals balance (149→149→146)
- Table 2 (Transfers): Present (0/0/0)
- Table 3 (Franchised Status): Present (NM only, 6/6/6)
- Table 4 (Company Status): Present (TX only, 143/143/140)
- Table 5 (Projected): Present (0 franchise, 1 company in TX)
- Franchisee list count: 6 units in Exhibit G, captured
- Gag clause flag: Set — "no confidentiality agreements restricting franchisees"

### 3. Item 21 Sufficiency — PASS

- Auditor identified: Partially (Los Angeles, CA firm; firm name not in text layer)
- Opinion type: Unmodified/clean for both periods
- Balance sheet: Extracted (FY2024 and FY2023)
- Income statement: Extracted (FY2024 and FY2023)
- Cash flow: Extracted (FY2024 and FY2023)
- Financial notes: Comprehensively covered via RT_depth_financial_notes.json
- Going concern: Not raised (explicitly set to false)
- Related-party transactions: Fully documented
- Subsequent events: Captured ($700K additional advances)

### 4. State Addenda Sufficiency — PASS

- All 15 states identified: YES (CA, HI, IL, IN, MD, MI, MN, NY, ND, OH, RI, SD, VA, WA, WI)
- Structured into canonical: YES — `state_addenda_overrides` family present in 09_final_canonical.json
- Override families structured per state: YES — 26 overrides across 11 families
- RT_depth_state_addenda_promotion.json written: YES
- Summary table present: YES (families × states)

### 5. Key Exhibit Sufficiency — PASS

- Item 22 lists Exhibits B and C: Both accounted for in 04_exhibits.json
- Exhibit E (Financial): Deep-read with full notes extraction
- Exhibit C (Franchise Agreement): Key clauses read; contract burden depth pass completed
- Exhibit B (Development Agreement): Key clauses read; jury waiver found
- Exhibit D (Manual TOC): Extracted
- Exhibit F (State Addenda): 15 states extracted with structured overrides
- Exhibit G (Franchisee List): 6 units captured
- Exhibit H (Former Franchisees): NONE captured

### 6. Unresolveds and Contradictions — PASS

- Reader report: 6 unresolveds listed in Section J, 1 contradiction in Section K
- Coverage audit: Gaps section lists 3 items (all non-material)
- Canonical 09: `unresolveds` family present with 6 entries (U01–U06)
- Canonical 09: `contradictions` family present with 1 entry (C01)
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U01: Fee rate discrepancy (medium)
  - U02: Related-party cash drain (high)
  - U03: Zero franchise growth (medium)
  - U04: Brand Fund never activated (low)
  - U05: Ghost kitchen encroachment (medium)
  - U06: Nick the Greek cross-brand competition (medium)
- No extraction gaps requiring A4 recovery

### 7. Final Report Depth — PASS

- File: 08_final_report.md
- Length: 446 lines (well above 100-line minimum)
- Required sections present:
  - [x] A. Executive snapshot (15 numbered bullets)
  - [x] B. Fee stack, entry structure, initial investment
  - [x] C. Supplier control, operating control, technology, training
  - [x] D. Territory, competition, channels, encroachment
  - [x] E. Contract burden and legal mechanics
  - [x] F. Item 19 — Financial performance representations
  - [x] G. Item 20 — Outlet data
  - [x] H. Item 21 — Financial statements
  - [x] I. State addenda summary
  - [x] J. Unresolveds
  - [x] K. Contradictions
  - [x] L. Final coverage note

### 8. Score Gate — PASS

- 10_scorecard.md present
- Items extracted: 23/23
- Tables: 14
- Exhibits: 10
- Confidence: HIGH
- A2 depth passes: 4/4
- Facts promoted: 9
- State addenda overrides: 26

---

## Recovery Passes Needed

**None.** Extraction is comprehensive. No material gaps identified. Verdict is publish-ready.
