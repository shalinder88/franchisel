# Extraction Scorecard — 640387 Popeyes Louisiana Kitchen 2026

## Run Metrics
| Metric | Value |
|---|---|
| Filing ID | 640387 |
| Brand | Popeyes Louisiana Kitchen |
| FDD Year | 2026 |
| PDF Pages | 630 |
| Items Read | 23/23 |
| Items Complete | 22/23 (Item 21 partial — notes walk done via RT1) |
| Tables Extracted | 15 |
| Exhibits Cataloged | 22 |
| Retry Tasks | 3 (all executed) |
| Unresolveds | 7 |
| Contradictions | 1 |
| Top-Level Canonical Keys | 42+ |

## Coverage Summary
| Category | Status |
|---|---|
| Items 1-23 | Complete |
| Item 19 FPR (5 tables) | Complete |
| Item 20 Outlet Data (5 tables) | Complete |
| Item 6 Fee Stack (37+ fees) | Complete |
| Item 7 Investment Tables | Complete |
| Item 17 (4 agreement types) | Complete |
| Item 21 Financial Statements | Complete with RT1 note walkthrough |
| Exhibit D Franchise Agreement | Partial (key terms from Item 17) |
| Exhibit H Lease | Partial (key terms from Item 6/17) |
| Exhibit K State Addenda (14 states) | Complete with RT3 |
| Exhibit L Financial Statements | Complete with RT1 |

## Key Brand Metrics
| Metric | Value |
|---|---|
| System Size (US total) | 3,229 |
| Franchised (US) | 3,134 |
| Company-Owned (US) | 95 |
| International | 2,112 |
| Net Growth 2025 | +52 |
| Franchise Fee | $50,000 |
| Royalty | 5% of Gross Sales |
| Advertising | 4.6%–5.0% + co-op |
| Total Investment (freestanding) | $1,222,045–$3,923,245 |
| Total Investment (in-line) | $504,545–$1,968,245 |
| Term | 20 years + 10 renewal + 10 supplemental |
| Avg Sales (freestanding consolidated) | $1,893,880 |
| Median Sales (freestanding consolidated) | $1,788,529 |
| Avg EBITDA @ $2.0M-$2.5M sales | 14.9% ($331,499) |
| Gag Clause | Present |
| Protected Area | ≤1 mile radius or ≤50K population |

## A2 Depth Pass Results
| Pass | Files Created | Key Finding |
|---|---|---|
| DP1: Financial Notes | RT_depth_financial_notes.json | Full note walk: revenue recognition, lease accounting, debt structure, tax, impairment. Item 21 method: normal text extraction. |
| DP2: Contract Burdens | RT_depth_contract_burdens.json | Franchise Agreement operative burdens extracted: 16 non-curable defaults, AI restrictions, operational tier requirement, liquidated damages |
| DP3: Promotion Audit | RT_depth_promotion_audit.json | 10 facts audited; 7 already in canonical; 3 newly promoted |
| DP4: State Addenda | RT_depth_state_addenda_promotion.json | 17 material overrides across 14 states. Key: MI (termination/renewal/forum), IL/WA/ND (forum), HI/MN/NY (anti-waiver) |
| TDB1: Item 21 Notes | Updated RT_depth_item21_notes.json | Complete walk of RBI and RBILP notes |
| TDB2: Key Exhibits | RT_depth_key_exhibits.json | 4 exhibits assessed; key terms recovered via Item cross-references |
| TDB3: Item 20 | RT_depth_item20_tables.json | All 5 tables fully extracted with state-level detail and footer totals |
| TDB4: Thin Items | Already complete from A1 RT2 | Items 9-16 structured burden blocks |
| Item 19 Cohort | RT_depth_item19_cohort_comparability.json | Medium severity: advertising cohort includes legacy 4.6% payers while new franchisees pay 5.0%+; ~$7.6K/yr gap at average sales |

## Deferred Exhibits
- Exhibit D (Franchise Agreement, pp 185-243): Key terms recovered from Item 17 and body items. Remaining: force majeure, exact indemnification language, specific remodeling triggers.
- Exhibit H (Lease/Sublease, pp 290-323): Key economic terms recovered from Item 6 Note 6 and Item 17. Remaining: environmental detail, casualty provisions, subordination.
- Exhibit G4 (Ad Fund Test Amendment, pp 277-289): EBITDA test mechanism recovered from Item 6 Note 4. Remaining: exact EBITDA thresholds.

## Verdict
**EXTRACTION COMPLETE** — All 23 items fully read, 15 material tables extracted, 3 A1 retries + 9 A2 depth passes executed. 42+ top-level canonical keys. Item 21 method: normal text extraction. Key exhibits partially walked via Item cross-references; deferred clause walks documented.
