# 06 Coverage Audit — H&R Block Tax Services LLC (639774-2025)

## Coverage Summary

### Fully Covered (complete extraction)
| Family | Status | Evidence |
|--------|--------|----------|
| Item 1 — Entity structure | covered-complete | Full entity chain, affiliates, franchise description |
| Item 2 — Leadership roster | covered-complete | All 9 officers with roles and tenure |
| Item 3 — Litigation | covered-complete | All 7 matters with outcomes |
| Item 4 — Bankruptcy | covered-complete | None disclosed |
| Item 5 — Initial fees | covered-complete | $2,500 |
| Item 6 — Fee stack | covered-complete | Tiered royalty, POM, transfer, audit, training, loan default |
| Item 7 — Initial investment | covered-complete | Full table with 16 components and 17 notes |
| Item 8 — Supplier restrictions | covered-complete | Required products/services, insurance minimums |
| Item 9 — Obligations table | covered-complete | All 25 obligation categories |
| Item 10 — Financing | covered-complete | Term Loan, Short-Term Loan, cross-default, collateral |
| Item 11 — Training | covered-complete | Initial (42+19 hrs), ongoing (19 hrs/yr), ITC, computer standards |
| Item 12 — Territory | covered-complete | Non-exclusive, franchisor reservation of rights |
| Item 13 — Trademarks | covered-complete | 9 principal marks, license agreement |
| Item 14 — Patents/copyrights | covered-complete | Patent portfolio, copyright claims, Developments assignment |
| Item 15 — Participation | covered-complete | Full-time best efforts |
| Item 16 — Restrictions | covered-complete | Approved products only, no internet sales |
| Item 17 — Contract chart | covered-complete | All 23 provisions extracted |
| Item 18 — Public figures | covered-complete | None used |
| Item 19 — FPR | covered-complete | No FPR (verbatim refusal) |
| Item 20 — Tables 1-5 | covered-complete | All tables with state-by-state detail and footer totals |
| Item 20 — Gag clause | covered-complete | Confirmed with verbatim quote |
| Item 21 — Auditor/opinion | covered-complete | Deloitte, unqualified, no going concern |
| Item 21 — Income statement | covered-complete | 3-year data |
| Item 21 — Balance sheet | covered-complete | 2-year data |
| Item 21 — Cash flow | covered-complete | 3-year data |
| Item 22 — Contracts | covered-complete | All 16 exhibits listed |
| Item 23 — Receipts | covered-complete | Standard |
| Special risks | covered-complete | 2 risks identified |
| Exhibit C — Guarantee | covered-complete | Unconditional parent guarantee |

### Partial Coverage (requiring depth pass)
| Family | Status | Reason | Pages |
|--------|--------|--------|-------|
| Item 21 — Financial notes | partial | Note headers identified but detailed walk deferred to A2 | 103-124 |
| Exhibit B — State amendments | partial | 11 states identified, override themes noted, structured per-state detail deferred to A2 | 60-89 |
| Exhibit F-1 — Franchise Agreement | partial | TOC and key provisions via Item 17 cross-reference; full clause walk deferred to A2 | 185-225 |
| Exhibit G — General Release | partial | Identified as release form; operative scope not walked | 231-232 |
| Exhibit H-1 — Term Loan | partial | Key terms from Item 10; detailed clause walk deferred | 233-248 |
| Exhibit H-2 — Short-Term Loan | partial | Key terms from Item 10; detailed clause walk deferred | 249-264 |
| Exhibit I-1 — E-filing Agreement | partial | Identified; not clause-walked | 265-274 |
| Exhibit I-3 — FDA | partial | Identified; 33-page agreement not walked | 278-310 |

### Not Extracted (by design)
| Family | Reason |
|--------|--------|
| Exhibit E — Franchisee list | PII-sensitive; standard pipeline handling |

## Unresolveds
1. **UR-001** (medium): Table 3 footnote corrections for multiple states — data restatement nature unclear
2. **UR-002** (medium): Table 3 vs Table 4 reacquisition reconciliation unclear
3. **UR-003** (medium): State addenda operative details not yet structured

## Contradictions
1. **CONTRA-001** (informational): Franchise contraction alongside company-owned growth — consistent across tables, appears to be strategic reacquisition program

## Output File Depth Assessment
- `02_reader_report.md`: Comprehensive 7-pass narrative covering all 23 items with substantive detail
- `03_tables.json`: 11 table objects extracted with full structure
- `04_exhibits.json`: 16 exhibits cataloged with clause_walk_status
- `05_canonical.json`: 40+ top-level keys with per-item decomposition

## Self-Assessment
Overall A1 extraction is materially complete for a 315-page FDD. The primary gaps are depth-pass items (financial note walk, franchise agreement clause walk, state addenda structured extraction) that are standard A2 scope.
