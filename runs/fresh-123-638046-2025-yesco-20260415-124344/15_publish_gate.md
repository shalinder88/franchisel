# Publish Gate — YESCO Franchising LLC (638046-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. Depth passes complete.

---

## Rationale

This extraction achieves comprehensive coverage across all 23 FDD items, 12 exhibits, 3-year audited financial statements, 9 state addenda with structured overrides, and a 96-page franchise agreement clause-by-clause burden walk. The canonical JSON includes all required families: unresolveds (5), contradictions (1), and state_addenda_overrides (27 overrides across 9 states).

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with 7 tables covering 50 of 57 franchised businesses
- All tables extracted with full quartile breakdowns, population counts, averages, medians, min/max
- Exclusion rules documented (7 exclusions: 2 late openers, 4 not continuously operating, 2 AR combined)
- No cost/expense data disclosed — this is a limitation of the FDD itself, not the extraction
- Critical caveats captured (no audit of revenue, expenses excluded from analysis)
- Substantiation availability statement captured ("available upon written request")

### 2. Item 20 Completeness — PASS
- All 5 standard tables present: systemwide summary, transfers, franchised status, company-owned status, projected openings
- Total rows balance verified: 57 start + 2 opened - 1 non-renewal - 1 ceased = 57 end (2024)
- Franchisee list exhibit count: Exhibit H (pages 203-209)
- Gag clause flag: No confidentiality clauses in last 3 fiscal years (explicitly stated)
- Notes on non-contiguous territory combinations captured (OK+NH, TN+FL+AL)

### 3. Item 21 Sufficiency — PASS
- Auditor identified: HBME, LLC (Bountiful, UT)
- Balance sheet, income statement, and cash flows extracted for all 3 years
- All 10 notes to financial statements extracted in depth pass (RT_depth_financial_notes.json)
- Going-concern status: No going-concern qualification
- Key financial observations documented: affiliate loan concentration, cash decline, revenue trends

### 4. State Addenda Sufficiency — PASS
- 9 states identified and extracted: IL, IN, MD, MN, NY, ND, RI, VA, WI
- Structured into `state_addenda_overrides` family in 09_final_canonical.json
- Override families: forum_selection, governing_law, noncompete, general_release, termination, notice_cure, damages
- Summary table: 27 total overrides across 9 states
- RT_depth_state_addenda_promotion.json written with per-state, per-family structured data

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 (B, D, E, I, J, K) accounted for in 04_exhibits.json
- Exhibit B (Franchise Agreement): 96-page clause-by-clause walk completed in RT_depth_contract_burdens.json
- Exhibit F (Financial Statements): Full extraction with 10 notes
- Exhibit D (State Addenda): All 9 states fully read and structured
- Exhibit H (Franchisee List): Cataloged (PII not extracted per block)

### 6. Unresolveds and Contradictions — PASS
- 5 unresolveds identified and structured in 09_final_canonical.json `unresolveds` family
- 1 contradiction identified and structured in `contradictions` family
- All unresolveds are genuine business-risk flags (not extraction gaps):
  - U1: Affiliate loan concentration ($7.47M, 78% of assets)
  - U2: TSQ vs. bottom-quartile performance gap
  - U3: National Advertising Fund uncertainty
  - U4: Servizio trademark not registered
  - U5: Materially different renewal terms
- Contradiction C1 (royalty revenue decline vs stable outlet count) is an analytical observation, not an extraction gap

### 7. Final Report Depth — PASS
- 08_final_report.md is a full narrative diligence report (approximately 500+ lines)
- All required sections present:
  - A: Executive snapshot (14 numbered bullets)
  - B: Fee stack, entry structure, initial investment (complete fee stack, tiered royalty, investment table)
  - C: Supplier control, operations, technology, marketing fund
  - D: Territory, competition, channels, encroachment
  - E: Contract burden and legal mechanics
  - F: Item 19 detail (all 7 tables, population, caveats)
  - G: Item 20 detail (trajectory, activity, projections, gag clause)
  - H: Item 21 detail (auditor, BS/IS/CF, key observations)
  - I: State addenda summary (all 9 states with material overrides)
  - J: Unresolveds (5 items with severity)
  - K: Contradictions (1 item)
  - L: Final coverage note (fully surfaced vs. partial)

### 8. Score Gate — PASS
- Overall grade: A-
- All 23 items graded A
- All required items covered
- Canonical fields populated with evidence grounding (source_section, source_pages, confidence on all major families)

---

## Recovery Passes Needed: None

No material gaps requiring A4 focused recovery. All checklist items passed.
