# Publish Gate — Novus Franchising 2 LLC (638049-2025)

## Verdict: 1 — PUBLISH-READY

No material gaps. All items covered. Evidence grounded. Full narrative report with all required sections.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES (gross sales only)
- All 4 tables extracted with distribution data (Tables 1a/b, 2, 3a/b, 4)
- Population counts: 128 total, 67 included
- Exclusion rules: All 4 exclusion categories documented (Repair Only, incomplete reporting, partial year, multi-concept)
- Substantiation statement: Captured ("Written substantiation...will be made available upon reasonable request")
- All caveats documented (5 specific caveats in canonical)

### 2. Item 20 Completeness — PASS
- Table 1A (Systemwide Summary): Present with 3-year data ✓
- Table 1B (Including Speedy affiliate): Present ✓
- Table 2 (Transfers): Present with state-by-state detail ✓
- Table 3 (Franchised Status by State): Present with full state-by-state 3-year data ✓
- Table 4 (Company-Owned Status): Present ✓
- Table 5 (Projected Openings): Present ✓
- Totals balance: 2024 openings (7) - terminations (2) - non-renewals (0) - ceased (2) = +3 net ✓ (125 + 3 = 128) ✓
- Franchisee list count: Exhibit B confirmed; 8 discontinued in Exhibit C ✓
- Gag clause flag: SET — "Franchisees and/or former franchisees have signed confidentiality clauses" ✓

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Ernst & Young LLP ✓
- Opinion type: Unqualified ✓
- Income statement: Extracted with 2024 and 2023 comparatives ✓
- Balance sheet: Extracted with 2024 and 2023 comparatives ✓
- Cash flow: Extracted with 2024 and 2023 comparatives ✓
- Financial notes: All 10 notes extracted in depth pass 1 ✓
- Going-concern: No going-concern issues mentioned in auditor's report ✓
- Key ratios computed (current ratio, net margin, revenue per unit) ✓

### 4. State Addenda Sufficiency — PASS
- 13 states identified with addenda ✓
- All states read and material overrides extracted ✓
- Structured into `state_addenda_overrides` in 09_final_canonical.json: YES ✓
- Override families mapped: 12 families across all applicable states ✓
- Summary table in RT_depth_state_addenda_promotion.json ✓
- State addenda discussed in full detail in Section I of 08_final_report.md ✓

### 5. Key Exhibit Sufficiency — PASS
- All exhibits from Item 22 accounted for in 04_exhibits.json ✓
- Financial statements (Exhibit A): Deep read with all notes ✓
- Franchise agreements (D-2, D-3): Summarized via Item 17; key provisions confirmed ✓
- Vehicle Lease (E): Key terms extracted from Items 6, 10; subordination risk identified ✓
- State addenda (A-1): Fully read and structured ✓

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md: Lists material gaps and unresolveds ✓
- 08_final_report.md: Section J (Unresolveds) and Section K (Contradictions) present ✓
- 09_final_canonical.json: Has `unresolveds` key (7 items) and `contradictions` key (2 items) ✓
- All unresolveds are genuine business-risk flags:
  - U1 (2023 contraction root cause) — business risk ✓
  - U2 (reporting exclusion bias) — analysis caveat ✓
  - U3 (unaudited marketing fund) — governance risk ✓
  - U4 (vehicle lease subordination) — systemic risk ✓
  - U5 (materially different renewal terms) — contract risk ✓
  - U6 (AI restriction) — operational risk ✓
  - U7 (declining per-unit economics) — economic risk ✓
- No extraction gaps disguised as unresolveds ✓

### 7. Final Report Depth — PASS
- 08_final_report.md: 448 lines ✓ (well above 100-line minimum)
- Sections present:
  - A. Executive Snapshot (15 numbered bullets) ✓
  - B. Fee Stack, Entry Structure, Initial Investment ✓
  - C. Supplier Control, Operations, Training, Tech ✓
  - D. Territory, Competition, Channels, Encroachment ✓
  - E. Contract Burden and Legal Mechanics ✓
  - F. Item 19 — Financial Performance Representations ✓
  - G. Item 20 — Outlet Data ✓
  - H. Item 21 — Financial Statements ✓
  - I. State Addenda Summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final Coverage Note ✓
- All sections contain substantive narrative, not just metrics tables ✓

### 8. Score Gate — PASS
- 10_scorecard.md: All required items covered ✓
- 23/23 items extracted
- 18 tables extracted
- 24 exhibits cataloged
- 4 depth passes completed
- All canonical fields have source_section, source_pages, confidence ✓

---

## Recovery Passes Needed: NONE

Extraction is complete and publish-ready. No A4 focused recovery required.
