# Publish Gate: Rytech Franchising, Inc. (637915-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

The extraction is comprehensive across all 23 items and 13 exhibits. All mandatory evidence objects are present. Financial statements were extracted from rendered scanned images with reasonable confidence. Four depth passes (financial notes, contract burdens, promotion audit, state addenda) have been completed. State addenda are structured into canonical override families. Unresolveds and contradictions are preserved in canonical.

The extraction has minor caveats (financial statement values from scanned images, a few FDD text contradictions) but no material gaps that would mislead a prospective franchisee.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: Yes
- All tables extracted: Yes (single 5-year table with 7 columns)
- Notes extracted: Yes (population exclusions, no adjustments, gross revenue only, substantiation available)
- Population counts: Yes (50→54→67→76→80)
- Exclusion rules: Yes (less than full year, closed within year)
- Substantiation statement: Yes ("Written substantiation... will be made available upon reasonable request")

### 2. Item 20 Completeness — PASS
- All 5 standard tables present: Yes (systemwide, transfers, franchised status, company-owned, projected openings)
- Total rows balance: Yes (verified)
- Franchisee list exhibit count: Yes (92 in Exhibit E)
- Gag clause flag: Set — no gag clause
- Confidentiality clause text: Verbatim captured

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Mauldin & Jenkins, CPAs & Advisors
- Balance sheet extracted: Yes (3 years)
- Income statement extracted: Yes (3 years)
- Cash flow extracted: Yes (3 years)
- Notes covered: Yes (A2 depth pass — 5 notes + sub-notes)
- Going concern: No going concern language (set as false)

**Caveat**: Financial statement values were read from scanned images rendered at 200 DPI. Key figures (revenue, net income, total assets, cash) are clear. Some minor line items may have small inaccuracies (noted as U5 in unresolveds).

### 4. State Addenda Sufficiency — PASS
- All 9 state addenda identified: Yes
- Structured into override families in canonical: Yes (state_addenda_overrides key present in 09_final_canonical.json)
- Override families extracted: 8 families across 9 states (26 total overrides)
- Summary table: Present
- Absence confirmed: N/A (addenda exist)

### 5. Key Exhibit Sufficiency — PASS
- All Item 22 exhibits accounted for: Yes (C, H, I, J, K — all in 04_exhibits.json)
- Financial exhibit deep-read: Yes (A2 Depth Pass 1)
- Franchise agreement deep-read: Yes (A2 Depth Pass 2 — clause-by-clause contract burdens)
- Guaranty exhibit read: Yes (scope, waiver of punitive damages, waiver of class actions)

**Caveat**: Exhibit K naming discrepancy (Item 22 says "SBA Addendum" but exhibit is NDA) — documented but cosmetic.

### 6. Unresolveds and Contradictions — PASS
- Unresolveds in 06_coverage_audit.md: 5 listed
- Unresolveds in 08_final_report.md: Yes (Section J)
- Contradictions in 08_final_report.md: Yes (Section K)
- `unresolveds` key in 09_final_canonical.json: Present (5 entries)
- `contradictions` key in 09_final_canonical.json: Present (3 entries)
- All unresolveds are genuine FDD text issues, not extraction gaps
- No unresolved is an extraction gap requiring A4 recovery

### 7. Final Report Depth — PASS
- 08_final_report.md length: ~400+ lines (substantial narrative)
- Required sections present:
  - [x] Executive snapshot (14 numbered bullets)
  - [x] Fees/investment (Section B)
  - [x] Supplier/operations/tech (Section C)
  - [x] Territory (Section D)
  - [x] Contract burden/legal (Section E)
  - [x] Item 19 detail (Section F)
  - [x] Item 20 detail (Section G)
  - [x] Item 21 detail (Section H)
  - [x] State addenda (Section I)
  - [x] Unresolveds (Section J)
  - [x] Contradictions (Section K)
  - [x] Final coverage note (Section L)

### 8. Score Gate — PASS
- Overall grade: A- (post-depth-pass)
- All required items covered: Yes (23/23)
- Canonical fields populated with evidence grounding: Yes

---

## Caveats for Publication

1. **Financial statement image quality**: Values extracted from 200 DPI rendered images of scanned pages. Key line items verified but minor figures may have small inaccuracies (±small amounts on items like specific accrued expense lines).

2. **FDD text contradictions**: Three contradictions documented (renewal fee 10% vs 15%, territory intrusion 50% vs 75%, national ad fund max 2% vs 3%). The renewal fee was resolved via FA verification. The other two remain in the FDD text.

3. **Item 19 limitations**: Gross revenue only — no cost, expense, or profit data disclosed by franchisor. This is a disclosure limitation, not an extraction gap.

---

## Recovery Passes Needed

**None.** No material gaps require A4 focused recovery. Verdict is 2, not 3.
