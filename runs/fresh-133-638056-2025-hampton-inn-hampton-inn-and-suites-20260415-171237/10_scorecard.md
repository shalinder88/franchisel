# Scorecard — 638056-2025 Hampton Inn / Hampton Inn & Suites

## Extraction Metrics

| Metric | Value |
|--------|-------|
| PDF Pages | 390 |
| Pages Classified | 390 (100%) |
| Items Extracted | 23/23 (100%) |
| Exhibits Cataloged | 16/16 (100%) |
| Tables Extracted | 18 |
| Retries Executed | 1 (state addenda recovery) |
| Retries Skipped | 3 (structural limitations of FDD) |
| Canonical Fields | All populated with evidence |
| Fields Without Evidence | 0 |

## Coverage Grades

| Section | Grade | Notes |
|---------|-------|-------|
| Entity Structure (Item 1) | A | Complete entity chain, predecessors, affiliates |
| Litigation (Item 3) | A | 5 pending + 6 concluded extracted |
| Fees (Items 5-6) | A | 40+ fee types with amounts and notes |
| Investment (Item 7) | A | Both brand tables with all line items |
| Supplier Control (Item 8) | A | Revenue figures, approval process |
| Training (Item 11) | A | All 7+ programs with costs/formats |
| Territory (Item 12) | A | Non-exclusive confirmed, Restricted Area details |
| Contract Mechanics (Item 17) | A | All 23 provisions extracted |
| Item 19 (FPR) | A | 5 data tables, ranges, caveats |
| Item 20 (Outlets) | A | Both brands, 3 years, projections |
| Item 21 (Financials) | A | 3 statements, 3 years, auditor |
| State Addenda | A | 11 states, material overrides extracted |
| Exhibits | B+ | All cataloged; A/B not individually extracted |

## Key Risk Indicators

| Risk | Severity | Source |
|------|----------|--------|
| No renewal right — relicensing at franchisor discretion with materially different terms | HIGH | Item 17 |
| No exclusive territory in standard FA | HIGH | Item 12 |
| Liquidated damages = 60× avg monthly royalty (5 years of royalty) | HIGH | Item 6 |
| Total fee burden 10%+ of GRR before loyalty, tech, and QA fees | MEDIUM | Items 5-6 |
| Multiple pending antitrust class actions (IDeaS, Amadeus, STR) | MEDIUM | Item 3 |
| Only 33% of franchisee-managed hotels exceed average room rate | MEDIUM | Item 19 |
| No cost/EBITDA data disclosed | MEDIUM | Item 19 |
| Confidentiality clause restricts former franchisee communication | MEDIUM | Item 20 |
| Hampton Inn brand flat (-1 net in 2024) | LOW | Item 20 |
| Out-of-state dispute resolution (VA/NY) | LOW | Items 4, 17 |

## A2 Depth Passes

| Depth Pass | Files Written | Key Findings |
|------------|--------------|--------------|
| 1: Financial Notes | RT_depth_financial_notes.json | 9 notes extracted. ALL assets pledged as Hilton parent debt collateral. Disregarded entity (no US tax). Graduate brand acquired May 2024 for $85M. |
| 2: Contract Burdens | RT_depth_contract_burdens.json | Full FA clause walk. Guaranty is unlimited, joint/several, irrevocable. 13 non-curable termination triggers. |
| 3: Promotion Audit | RT_depth_promotion_audit.json | 8 facts promoted to canonical. |
| 4: State Addenda | RT_depth_state_addenda_promotion.json | 34 structured overrides across 11 states and 8 override families. |

## Verdict
**PASS — Full extraction achieved.** All 23 items, 16 exhibits, 18 material tables, 4 depth passes completed. State addenda recovered via retry. 8 facts promoted from depth passes. One structural gap (no cost/EBITDA in Item 19) is inherent to the FDD. No invented data. All uncertainties preserved.
