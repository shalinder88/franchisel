# Publish Gate — Cupbop Franchise, LLC (638043-2025)

## Verdict: 1 — PUBLISH-READY

No material gaps. All items covered. Evidence grounded. Canonical families enforced.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **PASS:** FPR provided with all 3 tables (company-owned, franchise, combined) fully extracted
- All population counts, exclusion rules, percentage at/above average documented
- Substantiation availability statement captured ("Written substantiation... made available upon reasonable request")
- Revenue-only limitation clearly noted throughout

### 2. Item 20 Completeness
- **PASS:** All 5 standard tables present (system-wide, transfers, franchised status, company-owned status, projected openings)
- Total rows verified: 30 franchised + 29 company-owned = 59 total
- Off-by-one discrepancy in 2023 start total (44 vs 45) noted as unresolved
- Franchisee list exhibit (F) confirmed present (pages 158-162)
- Confidentiality clause flag: SET — franchisees restricted from speaking about experience

### 3. Item 21 Sufficiency
- **PASS:** Auditor identified (Forvis Mazars, LLP)
- Income statement, balance sheet, and cash flow extracted for 2022-2024
- Notes to financial statements covered via Depth Pass 1 (RT_depth_financial_notes.json)
- Going-concern status: NOT flagged (no going concern language in auditor's report)
- SG&A corrected via Retry R1 from OCR misread

### 4. State Addenda Sufficiency
- **PASS:** 9 states with addenda in Exhibit G identified and extracted
- Michigan state cover page in front matter also documented
- **STRUCTURED** into `state_addenda_overrides` in 09_final_canonical.json
- 33 override entries across 10 override families (forum_selection, governing_law, noncompete, general_release, termination, damages, notice_cure, interest_rate, anti_waiver, anti_fraud)
- Summary table of override families x states present

### 5. Key Exhibit Sufficiency
- **PASS:** All 9 exhibits listed in TOC accounted for in 04_exhibits.json
- Exhibit B (Financial Statements): deep-read via DP1
- Exhibit C (Franchise Agreement): deep-read via DP2
- Exhibit D (Area Development Agreement): scanned, key provisions extracted
- Exhibit G (State Addenda): deep-read via DP4

### 6. Unresolveds and Contradictions Assessment
- **PASS:** `unresolveds` key present in 09_final_canonical.json with 6 entries
- **PASS:** `contradictions` key present in 09_final_canonical.json with 3 entries
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U1 (HIGH): Nevada closures unexplained
  - U2 (MEDIUM): Thin franchisor capitalization
  - U3 (LOW): Trainer experience brevity
  - U4 (MEDIUM): Confidentiality clause restrictions
  - U5 (LOW): Related-party pricing concern
  - U6 (LOW): Table 1 off-by-one
- No extraction gaps requiring A4 recovery

### 7. Final Report Depth
- **PASS:** 08_final_report.md is a full diligence report (400+ lines)
- All required sections present:
  - A. Executive snapshot (15 numbered items) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operations, training, technology ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 — Financial performance representations ✓
  - G. Item 20 — Outlet data ✓
  - H. Item 21 — Financial statements ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓

### 8. Score Gate
- **PASS:** 10_scorecard.md shows 100% item coverage, 100% exhibit coverage, HIGH confidence across all sections
- A2 depth passes documented
- Canonical families enforced

---

## Recovery Passes Needed
None. Verdict is 1 — Publish-ready.
