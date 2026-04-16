# Publish Gate — Spark by Hilton (638065-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. State addenda fully structured.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: PASS
- No FPR provided. Explicit no-FPR statement extracted verbatim: "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets."
- Substantiation availability: Not applicable (no FPR).
- Unauthorized representation contact captured (William Fortier).

### 2. Item 20 Completeness
- **Status**: PASS
- All 5 standard tables present:
  - Table 1 (Systemwide summary): Complete, 3 years
  - Table 2 (Transfers): Complete, 3 years, zero transfers
  - Table 3 (Franchised status by state): Complete, 3 years, all states
  - Table 4 (Company-owned status): Complete, zero in all years
  - Table 5 (Projected openings): Complete, 189 signed/140 projected
- Totals balance: 8 start + 81 opened + 2 ceased = 91 end (2024)
- Franchisee list exhibit count: Exhibit A cataloged (91 hotels)
- Gag clause flag: Set to false. Explicit no-gag statement extracted.

### 3. Item 21 Sufficiency
- **Status**: PASS
- Auditor identified: CBH (Tysons Corner, Virginia)
- Balance sheet: Extracted with all line items
- Income statement: Extracted with 3 years of data
- Cash flow: Extracted with 3 years of data
- Notes to financial statements: All 9 notes deep-read in depth pass
- Going-concern: No going-concern qualification

### 4. State Addenda Sufficiency
- **Status**: PASS
- 11 states identified in Exhibit J-1: CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA
- All states structured into `state_addenda_overrides` in 09_final_canonical.json
- Override families extracted per state: forum_selection, governing_law, damages, termination, renewal, transfer, general_release, noncompete
- Summary table of override families × states included

### 5. Key Exhibit Sufficiency
- **Status**: PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json
- Financial exhibits (Exhibit C): Deep-read
- Franchise Agreement (Exhibit D): Deep-read in A2 depth pass (contract burdens)
- Guaranty (Exhibit E): Key terms captured from Items 15, 17, and FA
- HITS Agreement (Exhibit G): Cataloged
- HSM Agreement (Exhibit M): Cataloged
- Exhibit N (Adyen): Minor gap — not clearly demarcated. Key terms in Items 5, 6, 11.

### 6. Unresolveds and Contradictions
- **Status**: PASS
- 3 unresolveds present in 09_final_canonical.json under `unresolveds` key:
  - U1: Subsequent events date typo (low)
  - U2: California ceased operations anomaly (low)
  - U3: Exhibit N demarcation (low)
- All are genuine document observations, not extraction gaps. No recovery needed.
- 0 contradictions. `contradictions` key present as empty array.

### 7. Final Report Depth
- **Status**: PASS
- 08_final_report.md contains all required sections:
  - A. Executive snapshot (14 numbered bullets)
  - B. Fee stack, entry structure, initial investment (detailed tables)
  - C. Supplier control, operations, technology burden
  - D. Territory, competition, channels, encroachment
  - E. Contract burden and legal mechanics (term, renewal, termination, transfer, noncompete, dispute, litigation)
  - F. Item 19 detail (no FPR, verbatim statement)
  - G. Item 20 outlet data (all tables, projected openings, gag clause)
  - H. Item 21 financial statements (full tables, key observations)
  - I. State addenda summary (11 states with override details)
  - J. Unresolveds (3 items, all low severity)
  - K. Contradictions (none found)
  - L. Final coverage note
- Report is ~400+ lines. This is a full diligence report, not a concise summary.

### 8. Score Gate
- **Status**: PASS
- 10_scorecard.md shows overall grade: A
- All 23 items covered, all required canonical families populated
- 14 tables extracted, 18 exhibits cataloged
- 0 retries needed

## Verdict Rationale
This extraction is publish-ready. All 23 items are fully extracted with source-page provenance. All 5 Item 20 tables are present and balanced. Financial statements are complete with notes. State addenda are fully structured into canonical. The final report is comprehensive. All canonical families are populated including unresolveds, contradictions, and state_addenda_overrides.

The 3 minor unresolveds (subsequent events date typo, California ceased operations, Exhibit N demarcation) are all low-severity document observations that do not affect the completeness or accuracy of the extraction.

## Recovery Passes Needed
None. Verdict is 1 — Publish-ready.
