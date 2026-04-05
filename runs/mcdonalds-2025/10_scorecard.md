# 10 — Scorecard
## McDonald's USA, LLC — FDD (638437-2025)

---

## Extraction Quality Scorecard

### Coverage by Item

| Item | Description | Coverage | Notes |
|------|-------------|----------|-------|
| 1 | Franchisor Identity | A | Complete: entity, parent, predecessor, formats, history |
| 2 | Business Experience | A | Officers/directors with dates and prior employment |
| 3 | Litigation | A | 7 pending + 13 concluded cases with amounts |
| 4 | Bankruptcy | A | None — confirmed |
| 5 | Initial Fees | A | All format-specific fees, refund policy |
| 6 | Other Fees | A | 31 fee line items + 11 footnotes + rent schedule + co-investment |
| 7 | Initial Investment | A | All 3 format columns + 11 footnotes + McOpCo outlier data |
| 8 | Supplier Control | A | Purchase percentages, revenue data, rebates |
| 9 | Franchisee Obligations | A | Full table |
| 10 | Financing | A | Bank of America terms, rates, collateral, cross-default |
| 11 | Training/Technology | A | Training program table, Store Systems, POS, data access |
| 12 | Territory | A | No exclusive territory, encroachment documented |
| 13 | Trademarks | A | Marks registered, licensed from Restaurant Brands LLC |
| 14 | Patents/Copyrights | A | O&T Manual, proprietary info |
| 15 | Operator Participation | A | Full time, best efforts |
| 16 | Product Restrictions | A | Authorized products only |
| 17 | Franchise Relationship | A | Both tables (18+23 provisions), 3 notes |
| 18 | Public Figures | A | None |
| 19 | Financial Performance | A | Sales distribution (3 categories), 3 pro formas, all notes |
| 20 | Outlets | A | All 5 tables (totals), organizations, gag clause, Exhibit S count |
| 21 | Financial Statements | A | Auditor, 4 statements, key notes, property/lease detail |
| 22 | Contracts | A | All exhibits listed |
| 23 | Receipts | A | Both copies confirmed |
| — | State Addenda | A | CA, HI, MD, MN, ND, WA covered |
| — | Exhibits | A | All 20 cataloged with page ranges |
| — | Franchisee Lists | A | Exhibit R (144pp) + Exhibit S (2pp) confirmed |
| — | Guaranty | A | Within Exhibit N — Unlimited Guaranty captured |

### Canonical Field Coverage

| Field Category | Fields Populated | Fields Total | Fill Rate |
|----------------|-----------------|--------------|-----------|
| Identity | 10 | 10 | 100% |
| Issuance | 1 | 1 | 100% |
| Formats | 5 | 5 | 100% |
| Development Structure | 2 | 2 | 100% |
| Initial Fees | 6 | 6 | 100% |
| Recurring Fees | 7 | 7 | 100% |
| Supplier Control | 4 | 4 | 100% |
| Training Burden | 5 | 5 | 100% |
| Tech Burden | 3 | 3 | 100% |
| Territory | 3 | 3 | 100% |
| Term/Renewal/Transfer | 8 | 8 | 100% |
| Noncompete | 2 | 2 | 100% |
| Litigation | 3 | 3 | 100% |
| Bankruptcy | 1 | 1 | 100% |
| Item 18 | 1 | 1 | 100% |
| Item 19 | 10 | 10 | 100% |
| Item 20 | 10 | 10 | 100% |
| Item 21 | 8 | 8 | 100% |
| Key Exhibits | 1 | 1 | 100% |
| Unresolveds | 5 | 5 | 100% |
| Contradictions | 1 | 1 | 100% |
| Financing | 6 | 6 | 100% |
| **TOTAL** | **102** | **102** | **100%** |

### Enrichment Coverage

| Enrichment Layer | Status |
|-----------------|--------|
| item19_chart_detail | Complete |
| item20_yearly_activity | Complete |
| exhibit_structure | Complete |
| item21_structural_facts | Complete |
| item1_structural_facts | Complete |
| item6_fee_attributes | Complete |
| item21_financial_structure_detail | Complete |
| item21_statement_detail | Complete |
| item6_fee_detail | Complete |
| financial_note_depth | Complete (depth pass) |
| contract_burden_depth | Complete (depth pass) |
| narrative_promotion_audit | Complete (12 facts promoted) |

### Quality Indicators

| Metric | Value |
|--------|-------|
| Total PDF pages | 389 |
| Items fully covered | 23/23 (100%) |
| Tables extracted | 15 |
| Exhibits cataloged | 20 |
| Retries identified | 2 |
| Retries executed | 1 |
| Retries skipped (low priority) | 1 |
| Depth pass recoveries | 3 (financial notes, contract burdens, promotion audit) |
| Facts promoted from narrative | 12 |
| Contract burden clauses structured | 30+ |
| Financial note policies captured | 10+ |
| Unresolveds documented | 5 |
| Contradictions documented | 1 |
| FDD internal inconsistencies noted | 1 (Item 19 sample size 11,332 vs 11,322) |
| Gold-source errors identified | 4 (SOFR+5% interest, $200 NSF fee, transfer fee, stale lit count) |
| Regression gaps closed | 1 (consolidation waiver) |
| Derived fields added | 1 (total recurring fee estimates) |
| Canonical fields (post-depth) | 120+ |
| Confidence: high | 112/120+ fields |
| Confidence: medium | 8/120+ fields |
| Confidence: low | 0 fields |

### Overall Grade: **A**

This is an exceptionally well-structured FDD from the world's largest franchise system. Item 19 disclosure is comprehensive with sales distribution data across 3 categories and 3 pro forma scenarios. All 5 Item 20 tables are complete. Financial statements are audited with detailed notes. Depth pass added full financial note policies (revenue recognition, depreciation, impairment, tax), 30+ contract burden clauses from the franchise agreement, and promoted 12 previously unstructured facts. The only material caveat for prospective analysis is the royalty rate mismatch (4% in pro forma vs. 5% for new franchisees) and the exclusion of occupancy costs from pro formas.
