# Publish Gate — Tapestry Collection by Hilton (638066-2025)

## Verdict: 1 — PUBLISH-READY

No material gaps. All items covered. Evidence grounded. Canonical families enforced.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- No FPR provided by franchisor.
- No-FPR statement extracted: "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets."
- Substantiation contact captured: William Fortier, SVP-Development-Americas.
- Report-it-to-management instruction captured.

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - T04: Systemwide Summary (2022–2024) ✓
  - T05: Transfers (2022–2024) ✓
  - Table 3: Franchised Status by State (2022–2024) — extracted in reader report ✓
  - Table 4: Company-Owned Status — extracted (all zeros) ✓
  - T06: Projected Openings ✓
- Totals balance: 63 → 78 → 100 → 117 ✓
- Franchisee list exhibit count: 117 (Exhibit A) ✓
- Gag clause flag: SET ("some current and former franchisees have signed provisions restricting their ability to speak about their experience") ✓
- Anomaly U1 (positive "Ceased Operations" entries) documented as unresolved ✓

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Cherry Bekaert LLP, Tysons Corner, VA ✓
- Audit date: March 18, 2025 ✓
- Opinion: Unqualified (clean) ✓
- Going-concern: No issues raised ✓
- Income statement: 3 years extracted with line items ✓
- Balance sheet: 2 years extracted with line items ✓
- Cash flows: 3 years extracted ✓
- Notes to financial statements: All 9 notes covered via RT_depth_financial_notes.json ✓
- Note 9 typo documented as unresolved U2 ✓

### 4. State Addenda Sufficiency — PASS
- 15 states identified in Exhibit J-1 ✓
- All states with addenda extracted into structured form in RT_depth_state_addenda_promotion.json ✓
- 34 individual overrides extracted across 7 override families ✓
- State addenda overrides promoted to 09_final_canonical.json as `state_addenda_overrides` key ✓
- Summary table of override families × states included ✓
- State addenda discussed in 08_final_report.md Section I ✓

### 5. Key Exhibit Sufficiency — PASS
- Item 22 contracts list: D, D-2, D-3, D-4, E, F, G, K — all accounted for in 04_exhibits.json ✓
- Financial exhibits (Exhibit C): deep-read with all statements and notes ✓
- Franchise Agreement (Exhibit D): sampled, key provisions extracted via Items 8-17 and RT_depth_contract_burdens.json ✓
- Guaranty (Exhibit E): scope documented ✓
- HITS Agreement (Exhibit G): sampled ✓
- All 20 exhibits cataloged in 04_exhibits.json ✓

### 6. Unresolveds and Contradictions Assessment — PASS
- 06_coverage_audit.md: 3 unresolved items documented ✓
- 08_final_report.md Section J: 3 unresolveds (U1-U3) with severity and source ✓
- 08_final_report.md Section K: Contradictions section present, explicitly states none found ✓
- 09_final_canonical.json: `unresolveds` key present with 3 entries ✓
- 09_final_canonical.json: `contradictions` key present (empty array) ✓
- All unresolveds are genuine business-risk or document-quality flags, not extraction gaps ✓

### 7. Final Report Depth — PASS
- 08_final_report.md: 416 lines (exceeds 100-line minimum) ✓
- Required sections present:
  - A. Executive snapshot (13 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment (with sub-sections) ✓
  - C. Supplier control, operations, training, technology burden ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 detail ✓
  - G. Item 20 detail ✓
  - H. Item 21 detail (with key financial observations) ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓

### 8. Score Gate — PASS
- 10_scorecard.md: Overall score PASS ✓
- 23/23 items covered ✓
- 42 canonical fields, all high confidence ✓
- 4 depth passes completed and documented ✓
- Key risk flags identified (7 flags) ✓

---

## Recovery Passes Needed

**None.** This extraction is publish-ready.
