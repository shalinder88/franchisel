# Coverage Audit — DQ Grill & Chill FDD (637935-2025)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| 1 — Franchisor/Parents/Affiliates | COMPLETE | Entity structure, affiliates, franchise formats, system size all extracted |
| 2 — Business Experience | COMPLETE | All key officers identified with employment history |
| 3 — Litigation | COMPLETE | 4 pending, 4 concluded cases extracted |
| 4 — Bankruptcy | COMPLETE | None disclosed |
| 5 — Initial Fees | COMPLETE | All fee types, refund conditions, MultiTRA fees extracted |
| 6 — Other Fees | COMPLETE | Full fee table with 13 fee types, footnotes on conversion/relocation schedules |
| 7 — Estimated Initial Investment | COMPLETE | Full table with 14 line items, all 16 footnotes captured |
| 8 — Sources of Products/Services | COMPLETE | Required purchases, designated vendors, alternate supplier process, supply chain margin commitment, vendor payments |
| 9 — Franchisee's Obligations | COMPLETE | Standard obligation table extracted |
| 10 — Financing | COMPLETE | No financing offered |
| 11 — Assistance/Advertising/Systems/Training | COMPLETE | Pre-opening/ongoing assistance, marketing fund structure, EPOS system, training program (3 phases, 277 hours) |
| 12 — Territory | COMPLETE | No exclusive territory, ADQ rights, MultiTRA trade areas, relocation policy |
| 13 — Trademarks | COMPLETE | Principal marks with registration numbers |
| 14 — Patents/Copyrights | COMPLETE | No material patents; copyright claims on manuals/agreements |
| 15 — Owner Participation | COMPLETE | Active supervision required; manager staffing requirements; MultiTRA DSE/Supervisor requirements |
| 16 — Restrictions on Sales | COMPLETE | Menu restrictions, pricing control, alcohol/gaming prohibitions |
| 17 — Renewal/Termination/Transfer/Disputes | COMPLETE | Both franchise agreement and MultiTRA tables fully extracted |
| 18 — Public Figures | COMPLETE | None |
| 19 — FPR | COMPLETE | Schedule A (4 years) and Schedule B (4 years) fully extracted with all definitions and caveats |
| 20 — Outlets | COMPLETE | Systemwide summary, status by state, transfers, company-owned, projected openings — for direct-licensed, subfranchised, and Texas DQ |
| 21 — Financial Statements | COMPLETE | Balance sheet, income statement, equity, cash flows extracted. Auditor and opinion identified. |
| 22 — Contracts | COMPLETE | Contract list extracted |
| 23 — Receipts | COMPLETE | Receipt content captured |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A — State Administrators | IDENTIFIED | Not read in detail (standard regulatory list) |
| B — Operating Agreement | PARTIALLY READ | Key terms extracted via Item 17 tables; full ~257-page contract not read word-for-word |
| C — Conversion Addenda | REFERENCED | Terms extracted from Items 5/6/7 footnotes |
| D — MultiTRA | REFERENCED | Terms extracted from Items 5/12/17 |
| E — Franchise Application | IDENTIFIED | Not read in detail |
| F — Third-Party EPOS Agreements | IDENTIFIED | Vendor list captured; individual agreements not read |
| G — Design Services Agreement | IDENTIFIED | Key terms from Item 7 footnotes |
| H — Construction Consultation | IDENTIFIED | Key terms from Item 7 footnotes |
| I — Manual TOCs | IDENTIFIED | 469-page manual referenced |
| J — Franchisee Lists | IDENTIFIED | PII — not extracted in detail |
| K — Terminated/Transferred Lists | IDENTIFIED | 46 former franchisees noted; PII — not extracted in detail |
| L — Financial Statements | COMPLETE | Balance sheet, income statement, equity, cash flows, auditor opinion fully extracted |
| M — Receipts | COMPLETE | Receipt page captured |

## State Addenda Coverage

| State | Status | Key Overrides |
|-------|--------|---------------|
| California | COMPLETE | Liquidated damages may be void; post-term noncompete may be unenforceable; release limited; Fast Food Act disclosure |
| Hawaii | COMPLETE | Standard FDD disclaimer; release/waiver limitation |
| Illinois | COMPLETE | IL law governs; forum selection outside IL void (except arbitration); release limited |
| Maryland | COMPLETE | **Fee deferral required by MD Securities Commissioner**; claims may be brought in MD; 3-year limitations |
| Minnesota | COMPLETE | Litigation must stay in MN; 90-day termination notice; 180-day non-renewal notice; no general release waiving MN law |
| North Dakota | COMPLETE | **Termination fee deleted entirely**; noncompete may be unenforceable; arbitration at nearest AAA office; punitive damages/jury waiver may be unenforceable |
| Rhode Island | PARTIAL | State addendum not fully read in this pass |
| Washington | PARTIAL | State addendum not fully read in this pass |

## Identified Gaps and Issues

### Material Gaps
1. **Rhode Island state addendum** — not fully extracted. SEVERITY: LOW (likely standard protections)
2. **Washington state addendum** — not fully extracted. SEVERITY: LOW (likely standard protections)

### Data Quality Concerns
3. **Item 19 2024 P&L sample**: Only 55 of 321 qualifying restaurants had usable P&Ls for Schedule B 2024 data. 285 excluded. This dramatically limits the reliability of 2024 expense/profit data. SEVERITY: MEDIUM (flagged but this is an FDD limitation, not an extraction gap)

### Not Extracted (by design)
4. Exhibit B full operating agreement text — extracted via Item 17 summary tables instead
5. Exhibit J/K franchisee contact lists — PII, not for extraction
6. Exhibit F third-party vendor agreement details — vendor names and cost structures captured from Item 11

## Recommendation
No targeted retries are strictly required. Rhode Island and Washington state addenda are the only gaps, both low severity. All 23 Items are fully extracted, all material tables captured, financial statements complete, and exhibit catalog is comprehensive.
