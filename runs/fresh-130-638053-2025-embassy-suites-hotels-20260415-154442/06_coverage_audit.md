# Coverage Audit — Embassy Suites Hotels (638053-2025)

## Item-by-Item Coverage

| Item | Status | Coverage | Notes |
|------|--------|----------|-------|
| 1 | FULL | Entity structure, predecessors, affiliates, brand portfolio, market/competition, laws | All key data extracted |
| 2 | FULL | All named officers/directors with roles and dates | 20+ executives/directors listed |
| 3 | FULL | 5 pending actions, 6 concluded actions, 0 collection suits | All cases extracted with detail |
| 4 | FULL | None disclosed | |
| 5 | FULL | All initial fees with amounts, timing, notes | 12 fee categories, 5 detailed notes |
| 6 | FULL | All ongoing fees with amounts, timing, notes | 30+ fee categories, 10 notes |
| 7 | FULL | Complete investment table for 176-suite prototype | 26 line items, 23 notes |
| 8 | FULL | Source restrictions, HSM details, revenue figures, approval process | HSM revenue data for 2024 |
| 9 | FULL | Cross-reference table | 25 obligation categories |
| 10 | FULL | Development incentive program, installment plans, rare financing | |
| 11 | FULL | Pre-opening obligations, computer systems, training programs, advertising, opening timeline | 8 pre-opening obligations, 7 computer systems, 13 training programs |
| 12 | FULL | Non-exclusive license, optional Restricted Area, exclusions, Strategic Partnerships | Key risk: no standard territory protection |
| 13 | FULL | All registered and pending marks, principal mark risk | "Embassy" unregistered flag captured |
| 14 | FULL | No patents, unregistered copyrights, data ownership | |
| 15 | FULL | Management requirements, Competitor definition, guaranty | |
| 16 | FULL | Operational requirements, mandatory programs, restrictions | |
| 17 | FULL | Term, renewal (none), termination (16 non-curable defaults), transfer, noncompete, dispute resolution | Complete extraction of all provisions |
| 18 | FULL | None | |
| 19 | FULL | All 4 performance charts (rate, occupancy, indices) + New Gen data | Both years, both management types, ranges |
| 20 | FULL | Tables 1-5 + eforea spa count + confidentiality clause flag | |
| 21 | FULL | Balance sheet, income statement, cash flow, auditor, opinion | 3 years of data |
| 22 | FULL | Contract exhibits listed | |
| 23 | FULL | Receipts reference | |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | CATALOGED | Franchisee list, 237 hotels, page range identified |
| B | CATALOGED | Terminated/not renewed list, page range identified |
| C | EXTRACTED | Full financial statements: BS, IS, CF extracted with key line items |
| D | CATALOGED | 56-page FA; key terms summarized via Item 17 |
| D-1 | CATALOGED | State addenda to FA; Michigan provisions explicitly extracted from pages 5-6 |
| D-2 | CATALOGED | Development incentive note |
| D-3 | CATALOGED | Eforea spa amendment |
| E | CATALOGED | Guaranty form |
| F | CATALOGED | Franchise application |
| G | CATALOGED | HITS Agreement (IT systems) |
| H-1 | CATALOGED | Brand Standards manual TOC |
| H-2 | CATALOGED | Eforea Spa manual TOC |
| I | CATALOGED | State administrators |
| J-1 | UNRESOLVED | State Addenda to Disclosure Document — listed in TOC but not clearly paginated in text extraction |
| J-2 | CATALOGED | Restaurant Brands Addendum (page 276) |
| K | CATALOGED | Lender Comfort Letter forms |
| L | CATALOGED | State effective dates |
| M | CATALOGED | Receipts |

## Table Coverage

| Table | Status | Source |
|-------|--------|--------|
| Item 5 Initial Fees | EXTRACTED | Full table with all rows and notes |
| Item 6 Other Fees | EXTRACTED | Full table with all rows and notes |
| Item 7 Investment | EXTRACTED | Full table with totals and notes |
| Item 9 Obligations | NOTED | Cross-reference table summarized |
| Item 11 Training | EXTRACTED | All 13 programs with hours, location, cost |
| Item 19 Room Rate (All) | EXTRACTED | 2023 and 2024 with ranges |
| Item 19 Occupancy (All) | EXTRACTED | 2023 and 2024 with ranges |
| Item 19 Occ Index | EXTRACTED | 2023 and 2024 with ranges |
| Item 19 RevPAR Index | EXTRACTED | 2023 and 2024 with ranges |
| Item 19 New Gen Rate | EXTRACTED | 2023 and 2024 |
| Item 19 New Gen Occ | EXTRACTED | 2023 and 2024 |
| Item 20 Table 1 (Systemwide) | EXTRACTED | 3 years |
| Item 20 Table 2 (Transfers) | EXTRACTED | 3 years by state |
| Item 20 Table 3 (Franchised Activity) | EXTRACTED | 3 years by state (in source map; key totals in canonical) |
| Item 20 Table 4 (Company-Owned) | EXTRACTED | All zeros |
| Item 20 Table 5 (Projected) | EXTRACTED | By state |
| Item 21 Balance Sheet | EXTRACTED | 2024 and 2023 |
| Item 21 Income Statement | EXTRACTED | 2024, 2023, 2022 |
| Item 21 Cash Flow | EXTRACTED | 2024, 2023, 2022 |

## Identified Gaps

### Material Gaps (requiring retry)
1. **Exhibit J-1 location:** State Addenda to Disclosure Document listed in TOC at page 8 but not clearly identified in page text. Need to verify whether it is embedded within pages 262-275 (which show as Exhibit I pages) or is a separate section.

### Non-Material Gaps (acceptable as-is)
1. **Item 19:** No cost/profit/EBITDA data disclosed — this is by franchisor design, not an extraction gap
2. **Insurance requirements:** Referenced to Manual (not in FDD) — standard for Hilton FDDs
3. **FRCM renovation schedules:** Referenced to Standards/Manual — not extractable from FDD
4. **FA deep provisions:** 56-page FA not line-by-line extracted; key terms captured via Item 17 summary table
5. **Item 20 Table 3 by-state detail:** All states read but not all individually tabulated in 03_tables.json (totals captured)

## Contradictions Found
None identified. The FDD is internally consistent.

## Confidence Assessment
- **Overall extraction confidence:** HIGH
- **Items with highest confidence:** 1, 5, 6, 7, 17, 19, 20, 21 (all fully structured data)
- **Items with moderate confidence:** 8, 11, 12 (extensive narrative, all key facts extracted but some Manual-referenced details unavailable)
- **Unresolved:** Exhibit J-1 pagination only
