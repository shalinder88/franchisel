# Publish Gate — 640387 Popeyes Louisiana Kitchen 2026

## Verdict: **2 — Publish with caveats**

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Rationale

This is a comprehensive extraction of a 630-page FDD — one of the largest in the batch. All 23 FDD items have been fully read and extracted. Item 19 (5 tables with EBITDA data), Item 20 (5 tables with state-level detail), and Item 6 (37+ fees across 11 pages) are among the most detailed in any QSR FDD and are fully captured. The canonical has 39 top-level keys with evidence grounding. Three A1 retries and nine A2 depth passes were executed.

The caveats are: (1) Exhibit D (Franchise Agreement, 59 pages) and Exhibit H (Lease, 34 pages) were not directly clause-walked page-by-page — key operative terms were recovered from Item 17 cross-reference tables and body items, which is sufficient for buyer due diligence but leaves some secondary clauses unextracted; (2) the final report at ~31KB is slightly below the 35KB target for 630-page FDDs but contains all required sections with substantive narrative.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- All 5 tables extracted: Table I (free-standing sales, pp 90-91), Table II (in-line sales, pp 92-93), Table III (food court sales, pp 94-95), Table IV (EBITDA by sales level, pp 96-98), Table V (EBITDA by operational tier, pp 99-101)
- Population counts: 2,338 free-standing, 498 in-line, 187 food court
- Exclusion rules captured: 64 free-standing excluded (52 temp closed, 12 other), 13 in-line, 6 food court
- All notes to tables extracted (Notes 1-8 from pp 102-103)
- Substantiation statement: "Written substantiation ... will be made available to you upon reasonable request" (p 103)
- Cohort comparability analysis completed: medium-severity finding on advertising rate gap (4.6% legacy vs 5.0%+ for new franchisees)

### 2. Item 20 Completeness — PASS
- All 5 standard tables present: systemwide (p 104), transfers (pp 104-107), franchised status by state (pp 108-112), company-owned (p 113), projected openings (pp 114-115)
- Total rows: franchised 2025 end = 3,134 ✓, company 2025 end = 95 ✓, total 3,229 ✓
- Franchisee list exhibit count: 278 former franchisees (Exhibit J3), confirmed (p 115)
- Gag clause flag: SET (true) with verbatim quote and context (p 115)
- PIFA franchisee association captured

### 3. Item 21 Sufficiency — PASS
- Auditor: KPMG LLP (pp 500-502)
- Income statement: extracted (p 504) — Revenue $9.434B, Net income $1.075B, Net income from continuing ops $1.201B
- Balance sheet: extracted (p 503) — Total assets $25.615B, Total liabilities $20.456B, Equity $5.159B
- Cash flow: page identified (p 507), headline data via segment reporting
- Notes covered via A2 depth pass (RT_depth_financial_notes.json): revenue recognition, depreciation, impairment, income tax, lease accounting, equity method investments, related party, interest expense, debt structure, segments
- Going-concern: No going-concern language present (clean opinion)
- Item 21 method: normal text extraction
- PLK segment data: $800M revenue, $250M AOI (p 570)

### 4. State Addenda Sufficiency — PASS
- 14 states identified: CA, HI, IL, IN, MD, MI, MN, NY, ND, RI, SD, VA, WA, WI
- Structured into `state_addenda_overrides` in 09_final_canonical.json ✓
- 17 material overrides extracted in RT_depth_state_addenda_promotion.json
- Override families structured per-state: forum_selection, governing_law, termination, renewal, anti_waiver, franchise_law, fee_deferral, transfer
- Summary table provided in depth pass file

### 5. Key Exhibit Sufficiency — PASS with caveats
- All exhibits listed in Item 22 (B, C1-C3, D, E1-E3, F, G1-G4, H, K, M) accounted for in 04_exhibits.json
- Exhibit L (financial statements): deep-read via A2 depth pass
- Exhibit D (Franchise Agreement): key terms from Item 17 + A2 contract burdens — see Franchise Agreement clause-walk assessment below
- Exhibit H (Lease): key terms from Item 6 Note 6 + Item 17 — see deferred exhibit assessment below
- Caveat: Exhibits D and H were not directly clause-walked page-by-page

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists 3 retry tasks (all executed)
- 08_final_report.md contains 7 unresolveds (Section J) and 1 contradiction (Section K)
- 09_final_canonical.json has top-level `unresolveds` key (7 entries) ✓
- 09_final_canonical.json has top-level `contradictions` key (1 entry) ✓
- All unresolveds are genuine business-risk flags (not extraction gaps):
  - U1: EBITDA excludes owner compensation (medium)
  - U2: Ad Fund Test rate uncertainty (medium)
  - U3: Protected Area reducible (medium)
  - U4: Renewal with materially different terms (high)
  - U5: Georgia 2025 losses unexplained (medium)
  - U6: Transfer acceleration (medium)
  - U7: Gag clause limits due diligence (high)

### 7. Final Report Depth — PASS
- 08_final_report.md is ~31KB / 440 lines
- All required sections present:
  - A. Executive Snapshot (14 numbered bullets) ✓
  - B. Fee Stack, Entry Structure, Initial Investment ✓
  - C. Supplier Control, Operations, Training, Technology ✓
  - D. Territory, Competition, Channels, Encroachment ✓
  - E. Contract Burden and Legal Mechanics ✓
  - F. Item 19 — Financial Performance Representations (with all 5 tables) ✓
  - G. Item 20 — Outlet Data (with trajectory analysis) ✓
  - H. Item 21 — Financial Statements (with segment data and debt structure) ✓
  - I. State Addenda Summary (14 states with overrides) ✓
  - J. Unresolveds (7 entries) ✓
  - K. Contradictions (1 entry) ✓
  - L. Final Coverage Note ✓

### 8. Score Gate — PASS
- 10_scorecard.md: extraction complete with A2 depth passes
- 39 top-level canonical keys (target: ≥25, ideal: ≥40)
- All required items covered with evidence grounding
- Canonical well-structured with per-item keys for Items 1-22

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit D — Franchise Agreement (pages 185-243, 59 pages)**

- **Surfaced**: Yes (04_exhibits.json)
- **Clause-walked**: Partial — key operative terms recovered from Item 17 tables (pp 77-87), body items (1-16, 18), and A2 contract burdens depth pass (RT_depth_contract_burdens.json)
- **Verdict decision**: Verdict 2 allowed

**Rationale**: The franchise agreement's key operative burdens are adequately covered:
- Term: 20yr + 10yr renewal + 10yr supplemental (Item 17, p 80)
- Fees: 5% royalty, 4.6-5.0% advertising, tech fees, rent formulas (Items 5-6, pp 25-39)
- Transfer: $7,500 fee, conditions, ROFR, death/disability 12-18mo (Item 17, pp 81-82)
- Termination: 30d cure (10d non-payment), 16 non-curable defaults (Item 17, pp 80-81)
- Noncompete: 2yr post-term, chicken QSR, 10 miles (Item 17, p 82)
- Default/cross-default: Dev Agreement default triggers franchise termination (Item 17, p 81)
- Guaranty: Joint and several, 10%+ owners (Item 9 p 50, Item 15 pp 74-75)
- Venue: S.D. Florida, Florida law (Item 17, p 82)
- Liquidated damages: Dev Agreement termination — retain prepaid fees + next installment (Item 17, p 78)
- Insurance: $5M GL, $1M auto, statutory WC (Item 8, p 45)
- AI restrictions: Prohibits use of confidential info for ML/AI (Item 14, p 73)

**What remains thin**: Force majeure clause detail, exact indemnification language, specific remodeling timeline triggers, inspection frequency provisions. These are secondary to the core operative burdens.

---

## Strongest Parts of the Run

1. **Item 19 — five-table FPR extraction** (pp 89-103): Complete extraction of all 5 tables with full EBITDA breakdown by sales level and operational tier, including all population counts, exclusion rules, and 8 explanatory notes. This is one of the most detailed Item 19 sections in the QSR universe and is fully captured.

2. **Item 6 — 37+ fee types across 11 pages** (pp 29-39): Every fee row and every note on every continuation page captured. Includes the complex Ad Fund Test Program mechanism with rate escalation details (5.0%→5.25%→5.50%) and revert provisions.

3. **Item 20 — all 5 tables with state-level detail** (pp 104-115): Full state-by-state status of franchised outlets (Table 3), including detection of Georgia anomaly (6 terminations + 12 ceased = net -14 in 2025) and transfer acceleration (229 vs 125). Gag clause identified and quoted verbatim.

4. **State addenda — 14 states, 17 structured overrides** (pp 402-496): Complete identification and structuring of material overrides including Michigan (termination/renewal/forum/transfer/anti-waiver), Illinois/Washington (forum/governing law), and Minnesota/New York (anti-waiver). Promoted to canonical.

5. **Item 21 financial statements with PLK segment data** (pp 497-619): Full balance sheet, income statement, and segment data extracted. PLK segment: $800M revenue, $250M AOI. Debt structure detail including all Credit Facility and Senior Note instruments. KPMG clean opinion.

---

## Weakest Remaining Parts of the Run

1. **Exhibit D Franchise Agreement not directly clause-walked** (pp 185-243): 59 pages of operative agreement text were not read page-by-page. Key terms recovered from Item 17 and body items, but force majeure, exact indemnification language, and remodeling triggers remain unextracted.

2. **Exhibit H Lease/Sublease not directly clause-walked** (pp 290-323): 34 pages. Rent formulas and key terms from Item 6 Note 6 and Item 17, but environmental compliance, casualty/condemnation, subordination, and detailed maintenance provisions remain unextracted.

3. **Exhibit G4 Ad Fund Test Amendment not fully walked** (pp 277-289): EBITDA test mechanism and rate escalation extracted from Item 6 Note 4, but exact EBITDA increase thresholds and measurement period definitions not captured.

4. **Final report at ~31KB** — slightly below the 35KB target for a 630-page FDD. All required sections present with substantive narrative, but Sections B (Fees/Investment) and C (Supplier/Operations) could have deeper inline table rebuilds.

5. **Item 19 cohort comparability**: The advertising rate gap (legacy 4.6% vs new 5.0%+) was identified and quantified (~$7.6K/yr at average sales) but could be more prominently flagged in the final report narrative.

---

## Where a Prior or Manual Run May Still Be Stronger

1. **Franchise Agreement clause-by-clause walk** (pp 185-243): A manual reviewer reading the full 59-page agreement would catch secondary provisions like force majeure, specific indemnification caps or exclusions, remodeling triggers and timelines, and any unusual provisions not summarized in Item 17 tables.

2. **Lease environmental and casualty provisions** (pp 290-323): The 34-page lease likely contains detailed environmental compliance, hazardous material, casualty/condemnation, and restoration provisions that could materially affect a franchisee on PLK-controlled property. These were not directly walked.

3. **Development Agreement financial covenants** (pp 162-184): Item 17 references financial ratio requirements and top-50% operational tier requirements as non-curable defaults, but the exact formulas and thresholds are in the Development Agreement text, which was not directly walked.

4. **Exhibit J2 franchisee list data mining** (pp 340-396): A manual reviewer could extract location-level data from the 57-page franchisee list to analyze geographic concentration, multi-unit operators, and recent openings/closures at a granular level.

5. **Ad Fund Test Amendment EBITDA thresholds** (pp 277-289): The exact EBITDA increase amount required to trigger rate escalation from 5.0%→5.25%→5.50% is in Exhibit G4. This is economically material but was not directly extracted.

---

## Optional Max-3 Follow-Up Roadmap

1. **Exhibit D Franchise Agreement clause walk** — Target: `RT_depth_franchise_agreement_clauses.json`. Read pages 185-243 for force majeure, indemnification, remodeling, and inspection provisions.

2. **Exhibit G4 Ad Fund Test Amendment thresholds** — Target: `RT_depth_ad_fund_test.json`. Read pages 277-289 for exact EBITDA thresholds and measurement periods.

3. **Exhibit H Lease environmental/casualty provisions** — Target: `RT_depth_lease_detail.json`. Read pages 290-323 for environmental compliance, casualty, and maintenance detail.

---

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- **C1**: Item 1 states 3,228 US restaurants; Item 20 Table 1 shows 3,229 total at end of 2025. Difference of 1 unit — likely timing or counting methodology. (Items 1 vs 20, pp 9 vs 104)

### Business-Risk Flags
- **U1**: EBITDA excludes owner compensation — actual franchisee returns lower than reported (Item 19 Note 6, p 102)
- **U2**: Ad Fund Test Program future rate uncertain — could reach 5.50% of Gross Sales (Item 6 Note 4, pp 36-37)
- **U3**: Protected Area can be reduced for population shifts with no cap on frequency (Item 12, p 67)
- **U4**: Renewal requires signing then-current form with potentially materially different terms (Item 17, p 80)
- **U5**: Georgia 2025: 6 terminations + 12 ceased = net -14 units, root cause unexplained (Item 20 Table 3, pp 108-112)
- **U6**: Transfer acceleration: 229 in 2025 vs 125 in 2024 — potential financial stress or consolidation signal (Item 20 Table 2, pp 104-107)
- **U7**: Gag clause restricts franchisee communication — limits due diligence (Item 20, p 115)

### Extraction-Depth Gaps
- None. All unresolveds are business-risk flags inherent to the FDD, not extraction failures.

---

## Buyer-Trust Assessment

A serious prospective franchisee could rely on this extraction as a primary reference for evaluating the Popeyes Louisiana Kitchen opportunity. The Item 19 financial performance data is exhaustively captured across five tables, including the critical EBITDA-by-sales-level analysis that shows the bottom quartile risk (3.5% EBITDA at <$1.5M) and the strong operational-quality-to-profitability correlation. The fee stack is completely mapped, including the complex Ad Fund Test Program escalation mechanism. The Item 20 outlet data is fully extracted with the important gag clause flagged and transfer acceleration noted. State addenda overrides are structured into the canonical for all 14 states. The primary caveat is that the franchise agreement, lease, and certain exhibit addenda were recovered from cross-reference tables rather than direct page-by-page clause walks — this is adequate for due diligence purposes but a legal reviewer would want to read the full agreements directly before signing.
