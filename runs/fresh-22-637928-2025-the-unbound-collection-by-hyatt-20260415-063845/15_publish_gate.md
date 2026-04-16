# Publish Gate — The Unbound Collection by Hyatt (637928-2025)

## Verdict: 1 — Publish-Ready

No material gaps. All items covered with evidence grounding. Depth passes complete. State addenda structured.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES, 3 FPRs + channel mix data.
- All tables extracted with population counts (17 total, 9 franchised, 8 owned/managed).
- Statistics extracted: highs, lows, medians, attainment percentages for all segments.
- Exclusion rules documented: 2 hotels opened during 2024 excluded from Covered Hotels.
- Notes and caveats captured: revenue-only, unaudited, small sample, extreme variance.
- Substantiation availability statement: YES, written substantiation available on reasonable request.
- No FPR: N/A (FPR is provided).

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - Table 1: Systemwide outlet summary (2022-2024) ✓
  - Table 2: Transfers (2022-2024) ✓
  - Table 3: Status of franchised outlets by state (2022-2024) ✓
  - Table 4: Status of company-owned outlets by state (2022-2024) ✓
  - Table 5: Projected openings ✓
- Totals balance correctly across all years.
- Franchisee list exhibit count: 10 franchised hotels in Exhibit H (4 pages).
- Gag clause flag: NO — no confidentiality clauses restricting franchisee communication.

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Deloitte & Touche LLP.
- Income statement: extracted with all major line items and 3-year trend.
- Balance sheet: extracted with all major line items.
- Cash flow: extracted (operating, investing, financing activities).
- Notes to financial statements: covered via depth pass — revenue recognition, depreciation, impairments, leases, taxes, loyalty program, acquisitions, stock comp, VIEs, subsequent events.
- Going concern: NO going concern qualification.
- Guarantee of Performance: YES, absolute and unconditional by Hyatt Hotels Corporation.

### 4. State Addenda Sufficiency — PASS
- All state-specific addenda identified: CA, HI, MD, MI (front matter), MN, ND, RI, VA.
- State overrides STRUCTURED into `state_addenda_overrides` in 09_final_canonical.json: YES.
- 20 structured override entries across 7 families (forum_selection, governing_law, general_release, termination, notice_cure, damages, renewal).
- Per-state rider forms identified for MD (FA + CA) and MN (FA).

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json.
- Financial exhibits (Exhibit A): deep-read via depth pass.
- Franchise agreement (Exhibit C): deep-read via contract burden depth pass.
- Guaranty (within Exhibit C): scope and terms extracted.
- State addenda (Exhibit M): structured via state addenda depth pass.

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md and 08_final_report.md both contain unresolveds section.
- 7 unresolveds identified and preserved as structured `unresolveds` family in 09_final_canonical.json: YES.
- All unresolveds are genuine business-risk flags (not extraction gaps):
  - U1: Extreme outlier hotel (7.9% occupancy) — business risk
  - U2: Systematic competitive set underperformance — business risk
  - U3: AOP Term expiration risk — business risk
  - U4: Materially different renewal terms — business risk
  - U5: 150% liquidated damages multiplier — business risk
  - U6: Competing Hyatt brands in AOP — business risk
  - U7: Small system size / statistical fragility — business risk
- No extraction gaps requiring A4 recovery.
- `contradictions` key present in canonical: YES (empty array — no contradictions found).

### 7. Final Report Depth — PASS
- 08_final_report.md is a full diligence report (~400+ lines).
- All required sections present:
  - A. Executive snapshot (14 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operations, technology, training ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 — FPR detail with all 3 representations ✓
  - G. Item 20 — Outlet data with multi-year trajectory ✓
  - H. Item 21 — Financial statements with key observations ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓

### 8. Score Gate — PASS
- 10_scorecard.md: Overall grade A.
- All 23 items graded A.
- All exhibits graded A or B+.
- Depth passes complete with metrics.

---

## Conclusion

This extraction is publish-ready. All material items are covered with evidence grounding. The FPR data is complete with all statistics. State addenda are structured into canonical families. Financial statements have been deep-read with accounting policies extracted. Contract burdens are documented. Seven genuine business-risk unresolveds are preserved in the canonical. No recovery tasks needed.

---

## Recovery Passes Needed
None.
