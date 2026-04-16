# Retry Tasks — We Are Crackin' LLC (637908-2025)

## Coverage Audit Result
All 23 items fully covered. All material tables extracted. Financial statements recovered via pdftoppm rendering.

## Retry Tasks

### R1 — Verify Item 20 Table Row Balances
**Status**: SKIP
**Rationale**: Tables extracted directly from PDF text. Systemwide summary totals (Table 1) are consistent with status tables (Tables 3+4) across all three brands. Elmer's: 7 franchised + 13 company = 20 total at end 2024. Egg N' Joe: 0 + 3 = 3. Kitchen: 0 + 2 = 2. System total: 25. All balance.

### R2 — Deep Read Financial Statement Notes
**Status**: EXECUTE
**Target**: Pages 186–190 (Notes 1–5 to financial statements)
**Rationale**: Text layer garbled; notes recovered via pdftoppm image rendering. Key findings extracted:
- Organization: wholly owned subsidiary of ERI; assets pledged as collateral
- CECL adoption (ASU 2016-13) effective Jan 2, 2023; transition adjustment $4,270
- AR allowance: $730 (2024/2023), $5,000 (2022)
- Revenue recognition: IFF at restaurant opening; royalties/advertising monthly
- Contract liabilities (unspent advertising): $609,006 (2024)
- Management fee: 10% of revenue to Parent
- One franchise sale in FY2022 ($40,000 deferred), recognized FY2023. No franchise sales in 2023/2024.
- LLC disregarded entity — no income tax provision
- Related party: advertising revenue from Parent = 57%/48%/48% of total
- Distributions: $1.4M/1.0M/$2.5M (2024/2023/2022)
- Uninsured deposits: $601,700 (2024)
- No subsequent events

**Output**: Findings incorporated into reader report Pass F, tables T13–T15, and canonical item21.

### R3 — Verify Exhibit K State Addenda Completeness
**Status**: EXECUTE
**Target**: Pages 214–236
**Rationale**: State addenda are material for prospective franchisees. Extracted:
- **California**: All proposed agreements delivered with FDD; 10% interest rate cap; noncompete may be unenforceable; Oregon governing law may not apply; liquidated damages may be unenforceable; general release restrictions per §31512/31512.1
- **Illinois**: Illinois law applies (not Oregon); venue outside IL void (arbitration OK); termination/non-renewal rights per IFDA §§19–20; anti-waiver per §41
- **Washington**: Financial condition risk; franchise broker disclosure; no-poach AOD (Case 19-2-26768-2 SEA, Oct 2019); initial fees deferred until pre-opening complete; WA FIPA prevails; arbitration in WA; release excludes Act rights; transfer fees limited to reasonable costs; noncompete void for employees <$100K and contractors <$250K; no-poach void
- **Wisconsin**: General anti-waiver provision (no separate disclosures)
- **Riders**: IL ADA, WA ADA, IL FA, WA FA, WA Consent to Transfer

**Output**: Findings incorporated into reader report and canonical state_addenda.

### R4 — Franchisee List Cross-Reference
**Status**: SKIP
**Rationale**: 7 current franchisees and 6 former franchisees fully extracted. No signed-but-not-opened. Former franchisee list consistent with Item 20 activity (5 reacquired + 1 closure = 6 former).
