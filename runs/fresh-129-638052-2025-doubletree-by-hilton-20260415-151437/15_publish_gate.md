# Publish Gate: DoubleTree by Hilton FDD (638052-2025)

## VERDICT: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. State addenda structured. Financial statements deep-read. Contract burdens extracted. All canonical families populated.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES (4 charts: Room Rate, Occupancy, Occupancy Index, RevPAR Index)
- All tables extracted with 2023 and 2024 data
- Population counts: 304 Comparable Hotels (23 Company-Managed, 281 Franchisee-Managed), 382 total
- Exclusion rules: 2-3 franchisee-managed excluded from index calculations for insufficient data
- Ranges captured for all metrics
- Substantiation availability statement captured: "We will make available to you on reasonable request written substantiation for the above financial performance representations"
- No-cost-buildup / no-EBITDA explicitly noted
- Key caveat: Only 32.4% of franchisee-managed met/exceeded average rate — properly flagged

### 2. Item 20 Completeness — PASS
- Table 1 (Systemwide Summary): Present. 3 years. Balances verified.
- Table 2 (Transfers): Present. 3 years. Totals: 21/16/11.
- Table 3 (Franchised Status): Present. State-by-state. Multi-year.
- Table 4 (Company-Owned Status): Present. All zeros confirmed.
- Table 5 (Projected Openings): Present. 31 signed/21 projected.
- Franchisee list exhibit count: 359 hotels in Exhibit A (18 pages).
- Gag clause flag: SET. "Some current and former franchisees have signed provisions restricting their ability to speak about their experience with us."

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Cherry Bekaert (cbh.com), Tysons Corner, Virginia
- Opinion: Unqualified (clean), signed March 18, 2025
- Income statement: Extracted (3 years, all line items)
- Balance sheet: Extracted (2 years, all line items)
- Cash flow: Extracted (3 years)
- Notes: All 9 notes covered in RT_depth_financial_notes.json (revenue recognition, franchise contracts, acquisition, fair value, income taxes, commitments/contingencies, related party, subsequent events)
- Going concern: No going-concern doubt raised

### 4. State Addenda Sufficiency — PASS
- 14 states with addenda identified: CA, HI, IL, IN, MD, MI, MN, NY, ND, RI, SD, VA, WA, WI
- State addenda STRUCTURED into `state_addenda_overrides` in 09_final_canonical.json with:
  - Per-state override entries
  - Override family summary table (forum, governing law, jury waiver, damages, general release, termination, transfer, noncompete)
- 42 individual overrides structured in RT_depth_state_addenda_promotion.json
- State addenda section present in 08_final_report.md (Section I)

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json
- Exhibit C (Financial Statements): Deep-read via Depth Pass 1
- Exhibit D (Franchise Agreement): Deep-read via Depth Pass 2
- Exhibit E (Guaranty): Cataloged, guaranty scope captured in canonical
- Exhibit G (HITS Agreement): Key terms captured via Items 9, 17
- Exhibits D-4 and H-3: Listed in TOC but not found as standalone pages — documented as low-severity unresolveds

### 6. Unresolveds and Contradictions — PASS
- `unresolveds` key present in 09_final_canonical.json with 4 entries (all low severity):
  - U1: Exhibit D-4 not found (low)
  - U2: Exhibit H-3 not found (low)
  - U3: Note 9 date typo confirmed (low)
  - U4: Cover/Item 7 $50K discrepancy (low)
- `contradictions` key present with 1 entry:
  - C1: Cover page vs Item 7 Suites total ($50K discrepancy, unresolved)
- All unresolveds are genuine documentation issues, not extraction gaps
- No extraction gaps requiring A4 recovery

### 7. Final Report Depth — PASS
- 08_final_report.md: 387 lines (well above 100-line minimum)
- Sections present:
  - A. Executive snapshot (14 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operations, training, tech ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 — Financial performance representations ✓
  - G. Item 20 — Outlet data ✓
  - H. Item 21 — Financial statements ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓
- All required sections substantive with narrative detail

### 8. Score Gate — PASS
- 10_scorecard.md present with coverage metrics, brand metrics, depth pass results
- All 23 items: 100%
- All material tables: 19 extracted
- Financial statements: complete
- Depth passes: 4 completed
- State addenda: 14 states, 42 overrides structured
- Overall grade: HIGH

---

## Recovery Passes Needed

**None.** Extraction is publish-ready. No A4 focused recovery required.
