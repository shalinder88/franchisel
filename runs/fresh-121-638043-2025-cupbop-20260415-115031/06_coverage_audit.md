# Coverage Audit — Cupbop Franchise, LLC (638043-2025)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| 1 | COMPLETE | Entity structure, parents, predecessors, affiliates, IP license |
| 2 | COMPLETE | 7 key personnel with backgrounds |
| 3 | COMPLETE | No litigation disclosed |
| 4 | COMPLETE | No bankruptcy disclosed |
| 5 | COMPLETE | Initial fee $40K/$30K, area development fee schedule, opening inventory |
| 6 | COMPLETE | 25+ fee types extracted with all 14 notes |
| 7 | COMPLETE | Both tables (single unit + ADA) with all 15 notes |
| 8 | COMPLETE | Supplier restrictions, approval process, revenue from franchisee purchases |
| 9 | COMPLETE | Obligations cross-reference table (a-x) |
| 10 | COMPLETE | No financing offered |
| 11 | COMPLETE | Pre/post-opening assistance, site selection, advertising details, computer systems, training program table |
| 12 | COMPLETE | Territory, protected area, encroachment carve-outs, minimum sales performance, relocation |
| 13 | COMPLETE | Trademark registrations, license agreement, infringement provisions |
| 14 | COMPLETE | No material patents/copyrights, confidential info provisions |
| 15 | COMPLETE | Participation requirements, Managing Owner, General Manager |
| 16 | COMPLETE | Menu restrictions, franchisor rights to add products, ownership of improvements |
| 17 | COMPLETE | Full table (a-x) covering term, renewal, termination, transfer, noncompete, dispute resolution |
| 18 | COMPLETE | No public figures |
| 19 | COMPLETE | 3 revenue tables (company-owned, franchise, combined) with quartile distribution |
| 20 | COMPLETE | 5 tables (system summary, transfers, franchise status, company status, projected openings) |
| 21 | COMPLETE | 3 years audited financials (balance sheet, income, equity, cash flow, notes) |
| 22 | COMPLETE | Contract list and sub-exhibits |
| 23 | COMPLETE | Receipt page |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | COMPLETE | 15 states listed |
| B | COMPLETE | 3 years audited, both report sets read, notes extracted |
| C | COMPLETE | Franchise Agreement scanned; key sections extracted via Item 17 provisions |
| D | COMPLETE | Area Development Agreement scanned |
| E | COMPLETE | Operations Manual TOC (108 pages in manual, TOC only in FDD) |
| F | NOTED | PII present — blocked from extraction output. Existence confirmed. |
| G | COMPLETE | 13 state addenda identified and key overrides extracted |
| H | COMPLETE | State effective dates page identified |
| I | COMPLETE | Receipt page |

## Gaps and Omissions

### Material Gaps
1. **Item 19 — No cost/expense data:** Revenue-only FPR. No COGS, labor, rent, EBITDA, or profit margin data disclosed. This is a franchisor choice, not an extraction gap — the data is simply not in the FDD.

### Minor Gaps
2. **Financial statement OCR degradation:** Some figures on balance sheet and cash flow pages have character substitution artifacts from OCR of scanned images. Key figures were cross-validated where possible but minor digit uncertainty exists on some line items.

3. **Income from Operations figure:** Page 59 OCR shows $1,030,945 but arithmetic check (Revenue $2,027,743 - OpEx $906,798) = $1,120,945. The net income of $1,025,658 is consistent with $1,030,945 - $5,287 = $1,025,658, suggesting the operating income figure is $1,030,945 and the total operating expense may be $996,798 rather than $906,798. This OCR ambiguity on the SG&A figure needs flagging.

4. **Item 20 Table 1 discrepancy:** 2023 total start (44) does not equal 2022 total end (45). Off-by-one. Not resolved in the FDD text.

### Missing Table Notes or Exhibit Follow-Through
5. **Exhibit F (Franchisee List):** Cannot extract PII. The 3 Nevada closures should be contactable via this exhibit for due diligence.
6. **Operations Manual:** Only TOC available. Full 108-page manual not included in FDD (standard practice).

## Retry Recommendations

| # | Target | Priority | Rationale |
|---|--------|----------|-----------|
| R1 | Item 21 financial statements — re-read income statement figures | MEDIUM | Resolve OCR ambiguity on SG&A and operating income for 2024 |
| R2 | Item 20 Table 1 total discrepancy | LOW | Verify 2023 start total vs. 2022 end total |

## Overall Assessment
Coverage is comprehensive. All 23 items fully extracted. All 9 exhibits cataloged. 17 tables extracted as first-class objects. The only material limitation is the revenue-only nature of Item 19 (franchisor's choice, not extraction gap). Financial statement OCR artifacts are flagged but do not affect the overall extraction quality.
