# Publish Gate — EOS Worldwide (637907-2025)

Generated: 2026-04-14

## Verdict: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. Depth passes complete.

---

## Rationale

This extraction achieved 100% item coverage across all 23 FDD items, with all material tables extracted, all exhibits cataloged, all financial statements rendered and read, and all 15 state addenda analyzed with structured overrides. The four A2 depth passes added financial note detail, contract clause-level burden analysis, 10 promoted facts, and 33 structured state addenda overrides across 7 override families. Mandatory canonical families (unresolveds, contradictions, state_addenda_overrides) are all present in the final canonical.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided with two detailed tables (annual performance + 400K historical)
- All tables fully extracted with population counts, averages, medians, ranges
- All notes and caveats captured (5 critical caveats)
- Substantiation availability statement captured ("Written substantiation...will be made available to prospective franchisees upon reasonable request")
- California FPR cost caveat captured
- Revenue-only limitation explicitly flagged throughout

### 2. Item 20 Completeness ✅
- All 5 standard tables present:
  - Table 1: Systemwide outlet summary ✅
  - Table 2: Transfers ✅ (all zero)
  - Table 3: Status of franchised outlets by state ✅ (50 states + DC + PR, totals extracted)
  - Table 4: Company-owned status ✅ (all zero)
  - Table 5: Projected openings ✅
- Totals balance correctly (389+150-1-13=525, 525+160-0-23=662, 662+122-3-49=732) ✅
- Franchisee list exhibit count: Exhibit F (23 pages), Exhibit G (3 pages) ✅
- Gag clause flag: Set ✅ (identified on page 73)

### 3. Item 21 Sufficiency ✅
- Auditor identified: RSM US LLP ✅
- Income statement extracted: FY2024 and FY2023 with all line items ✅
- Balance sheet extracted: FY2024 and FY2023 ✅
- Cash flow extracted: FY2024 and FY2023 ✅
- Member's equity statement extracted: 2022-2024 ✅
- Notes to financial statements covered: All 4 notes (nature/operations, related party, member's equity, concentration of credit risk) ✅
- Going-concern status: Set to false (no going concern) ✅
- Prior year financials (FY2023/2022): Read and key figures extracted ✅
- Financial notes depth pass complete: Revenue recognition policies, advertising expense, VIE election, tax treatment, subsequent events all documented ✅

### 4. State Addenda Sufficiency ✅
- All 15 state addenda identified and fully read ✅
- Structured into `state_addenda_overrides` in 09_final_canonical.json ✅
- 33 individual overrides extracted across 7 override families ✅
- Override summary table (families × states) present in RT_depth_state_addenda_promotion.json ✅

### 5. Key Exhibit Sufficiency ✅
- All exhibits listed in Item 22 accounted for in 04_exhibits.json ✅
- Franchise Agreement: TOC read, key clauses analyzed in depth pass ✅
- Financial statements: Deep-read (rendered via pdftoppm) ✅
- General Release: Read ✅
- Multi-State Addenda to FA: Read (14 states) ✅
- State Addenda to FDD: Read (15 states) ✅
- Insurance requirements: Read (CGL $1M/$1M, E&O $1M/$1M) ✅

### 6. Unresolveds and Contradictions Assessment ✅
- 06_coverage_audit.md contains 5 unresolveds and 2 contradictions ✅
- 08_final_report.md contains full Unresolveds section (J) and Contradictions section (K) ✅
- Both are preserved as structured families in 09_final_canonical.json ✅
  - `unresolveds` key present with 5 entries ✅
  - `contradictions` key present with 2 entries ✅
- All unresolveds are genuine business-risk flags (not extraction gaps):
  - U1 (attrition) — business risk ✅
  - U2 (cash/intercompany) — business risk ✅
  - U3 (note terms) — business risk / data not in FDD ✅
  - U4 (renewal terms) — inherent FDD ambiguity ✅
  - U5 (warm leads fee) — contractual ambiguity ✅

### 7. Final Report Depth ✅
- 08_final_report.md is a full diligence report (~450 lines) ✅
- Sections present:
  - A. Executive snapshot (13 numbered bullets) ✅
  - B. Fee stack, entry structure, initial investment ✅
  - C. Supplier control, operations, tech, reporting burden ✅
  - D. Territory, competition, channels, encroachment ✅
  - E. Contract burden and legal mechanics ✅
  - F. Item 19 detail (both tables, caveats, distribution analysis) ✅
  - G. Item 20 detail (trajectory, activity, gag clause) ✅
  - H. Item 21 detail (auditor, all statements, key observations) ✅
  - I. State addenda summary (override families, per-state analysis) ✅
  - J. Unresolveds (5 entries with severity) ✅
  - K. Contradictions (2 entries) ✅
  - L. Final coverage note ✅

### 8. Score Gate ✅
- 10_scorecard.md overall grade: A ✅
- All 23 items covered (100%) ✅
- All canonical fields populated with evidence grounding ✅
- A2 depth pass results included ✅

---

## Recovery Passes Needed

None. Verdict is 1 — Publish-Ready.

---

## Files Verified

| File | Present | Complete |
|------|---------|----------|
| 01_source_map.md | ✅ | ✅ |
| 02_reader_report.md | ✅ | ✅ |
| 03_tables.json | ✅ | ✅ |
| 04_exhibits.json | ✅ | ✅ |
| 05_canonical.json | ✅ | ✅ |
| 06_coverage_audit.md | ✅ | ✅ |
| 07_retry_tasks.md | ✅ | ✅ |
| 08_final_report.md | ✅ | ✅ |
| 09_final_canonical.json | ✅ | ✅ (includes unresolveds, contradictions, state_addenda_overrides) |
| 10_scorecard.md | ✅ | ✅ |
| 11_canonical_enriched.json | ✅ | ✅ |
| 12_canonical_enriched_v2.json | ✅ | ✅ |
| 14_run_summary.json | ✅ | ✅ |
| RT_depth_financial_notes.json | ✅ | ✅ |
| RT_depth_contract_burdens.json | ✅ | ✅ |
| RT_depth_promotion_audit.json | ✅ | ✅ |
| RT_depth_state_addenda_promotion.json | ✅ | ✅ |
