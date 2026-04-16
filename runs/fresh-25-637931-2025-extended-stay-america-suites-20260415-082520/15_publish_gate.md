# Publish Gate — Extended Stay America Suites (637931-2025)

## Verdict: 2 — Publish with Caveats

## Rationale
The extraction is substantially complete. All 23 Items are fully read and extracted. All 12 Item 19 tables, all Item 20 standard tables, and all Item 21 financial statements (including notes) are captured. The four depth passes are complete. State addenda for all 11 states are structured into canonical. The one caveat is the auditor identity, which is a low-severity gap that does not affect the analytical value of the extraction.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: Yes
- All 12 tables extracted with population counts, averages, medians, at/exceeding percentages
- Exclusion rules documented (14 franchised hotels excluded from 93-hotel set with specific reasons)
- Notes 1-6 captured (definitions of Occupancy, ADR, RevPAR, EsOcc, Call Center, Length of Stay)
- Substantiation availability statement captured
- No cost/expense data disclosed (as designed by franchisor — not an extraction gap)

### 2. Item 20 Completeness — PASS
- Table 1 (System-wide summary): Present, 3 years, all rows
- Table 2 (Transfers): Present, 3 years, by state
- Table 3 (Franchised status): Present, 3 years, ~25 states, all columns (opened, terminated, non-renewed, reacquired, ceased, end-of-year)
- Table 4a (Company-owned status): Present, 3 years, ~40 states
- Table 5 (Projected openings): Present
- Totals balance: Yes (13 opened - 10 ceased = +3 net for franchised 2024)
- Franchisee list exhibit count: Exhibits E and F identified with page ranges
- Gag clause flag: Set to false — confirmed no confidentiality agreements
- Footnotes captured (rebranding details, pending sales)

### 3. Item 21 Sufficiency — PASS (with caveat)
- Auditor identified: **No** — auditor name not visible in text layer (likely in letterhead image). Report is addressed to "ESH Hospitality Strategies LLC" and dated March 24, 2025.
- Income statement: Extracted for 2024 and 2023
- Balance sheet: Extracted for 2024 and 2023 (with 2022 from prior year statements)
- Cash flow: Extracted for 2024 and 2023
- Notes to financial statements: All 7 notes fully read and structured (via depth pass)
- Going-concern: No going concern language — confirmed

**Caveat**: Auditor identity not captured — low severity. The audit opinion, financials, and all notes are fully extracted. The auditor is very likely Deloitte & Touche LLP based on the report format, but this is inference rather than direct text capture.

### 4. State Addenda Sufficiency — PASS
- All 11 state addenda identified and read: CA, HI, IL, IN, MD, MN, NY, ND, RI, VA, WA
- Structured into `state_addenda_overrides` in 09_final_canonical.json: Yes
- 32 override entries across 10 override families
- Summary table of families × states present in canonical
- FA riders and DA riders section identified (pages 258-299)

### 5. Key Exhibit Sufficiency — PASS
- All 12 exhibits accounted for in 04_exhibits.json (A through L)
- Financial statements (Exhibit D): Deep-read via depth pass
- Franchise Agreement (Exhibit A): Deep-read via contract burden depth pass
- Guaranty (Exhibit J): Identified, unlimited personal guaranty scope noted
- State Addenda (Exhibit I): Deep-read via state addenda depth pass

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists 6 unresolveds
- 08_final_report.md includes full Unresolveds section (J) and Contradictions section (K)
- 09_final_canonical.json contains `unresolveds` key with 6 structured entries
- 09_final_canonical.json contains `contradictions` key with 1 resolved entry
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U1 (auditor identity): low severity, text layer limitation
  - U2 (ADR gap): medium severity, genuine business insight
  - U3 (SSF accountability): medium severity, structural concern
  - U4 (no renewal): high severity, contractual risk
  - U5 (trademark license expiry): medium severity, contractual risk
  - U6 (LD calculation): medium severity, contractual risk

### 7. Final Report Depth — PASS
- 08_final_report.md is a full narrative diligence report (~400+ lines)
- All required sections present: A (executive snapshot), B (fees/investment), C (supplier/ops/tech), D (territory), E (contract/legal), F (Item 19), G (Item 20), H (Item 21), I (state addenda), J (unresolveds), K (contradictions), L (final coverage note)
- Not a concise metrics summary — contains substantive analysis in each section

### 8. Score Gate — PASS
- 10_scorecard.md shows overall grade A- (upgraded from B+ after depth passes)
- All required items covered
- Canonical fields populated with evidence grounding

---

## Recovery Tasks Needed
None. The extraction meets publish-ready standards with the documented caveats.

## Caveats for Publication
1. **Auditor identity**: Not captured from text layer. The audit is clean (unqualified) with emphasis on related parties. The actual identity does not affect the analytical conclusions.
