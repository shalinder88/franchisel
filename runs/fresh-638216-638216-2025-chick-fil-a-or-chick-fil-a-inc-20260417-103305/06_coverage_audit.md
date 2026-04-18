# Coverage Audit — 638216 Chick-fil-A License Program FDD

## Item-by-Item Coverage Status

| Item | Status | Notes |
|------|--------|-------|
| 1 | **covered-complete** | Entity structure, affiliates, business description fully extracted |
| 2 | **covered-complete** | 50 officers/directors with roles and tenure fully extracted |
| 3 | **covered-complete** | Delivery pricing class action — settled $4.4M |
| 4 | **covered-complete** | Pier 1 bankruptcy (director connection) |
| 5 | **covered-complete** | $0 initial fee; opening inventory estimate |
| 6 | **covered-complete** | All 6 fee rows + 4 footnotes extracted |
| 7 | **covered-complete** | 6-row investment table + 6 footnotes; total $585.5K–$3.437M |
| 8 | **covered-complete** | Supplier restrictions, proprietary items, revenue figures, purchase concentration |
| 9 | **covered-complete** | All 25 obligation categories (a–y) |
| 10 | **covered-complete** | No financing offered |
| 11 | **covered-complete** | Training (2-day + 5-day), POS, advertising, manual, time to opening |
| 12 | **covered-complete** | No exclusive territory; same-site protection; competition sources |
| 13 | **covered-complete** | 80+ marks listed; CFA Properties license structure |
| 14 | **covered-complete** | 10 issued patents, 8 pending apps; proprietary info; confidentiality |
| 15 | **covered-complete** | 2 trained managers per site minimum |
| 16 | **covered-complete** | CFA-approved products only; core menu required |
| 17 | **covered-complete** | All contract provisions (a–w) — renewal, termination, transfer, noncompete, dispute resolution |
| 18 | **covered-complete** | No public figures |
| 19 | **covered-complete** | Two segments: college/university (312 units) and hospital/airport (97 units) with full metrics |
| 20 | **covered-complete** | Tables 1–5 extracted with footer totals for both Licensed Units and Franchised Restaurants |
| 21 | **covered-complete** | Audited by PwC; balance sheet, income, cash flow; key notes extracted |
| 22 | **covered-complete** | Contract listing |
| 23 | **covered-complete** | Receipt |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | **labeled** | State agencies — administrative |
| B-1 | **partial** | License Agreement (Self-Operators) — key provisions summarized from Item 17; full clause walk deferred |
| B-2 | **partial** | License Agreement (Food Service Providers) — same as B-1 with FSP additions; full clause walk deferred |
| C | **covered-complete** | Financial statements fully extracted — balance sheet, income, cash flow, equity, key notes |
| D | **labeled** | Manual TOC — 165 pages referenced |
| E | **labeled** | Licensee/Operator list — 73 pages, directory data |
| F | **labeled** | Former Licensees — 2 pages |
| G | **partial** | State addenda — 13 states identified; key overrides noted; full per-state clause walk deferred |
| H | **labeled** | State effective dates — 1 page |
| I | **labeled** | Receipts — 2 pages |

## Material Gaps Identified

1. **License Agreement clause walk** — Exhibits B-1 and B-2 (65 combined pages) contain the actual operative terms. Item 17 summarizes key provisions, but the full agreements may contain additional terms not surfaced in Item 17. **RETRY RECOMMENDED.**

2. **State addenda detailed overrides** — 13 states, 64 pages. Key overrides to Items 11 and 17 are common (e.g., California's additional disclosures, Illinois/Minnesota modifications to termination/noncompete, New York limitations on forum selection). Full per-state extraction needed. **RETRY RECOMMENDED.**

3. **Item 21 financial statement notes** — 31 pages of notes partially walked. Key notes extracted (revenue recognition, acquisitions, debt, treasury stock, preferred stock). Some note families not fully walked:
   - Note on property and equipment detail
   - Note on investments
   - Note on pension/postretirement obligations detail
   - Note on income taxes
   - Note on commitments and contingencies
   **RETRY RECOMMENDED for remaining note families.**

## Canonical Depth Assessment

- **05_canonical.json** has 40+ top-level keys ✓
- Item 2 leadership roster: 50 entries ✓
- Items 9–16: separate keys with operative burdens ✓
- Item 17: decomposed into renewal, termination, transfer, noncompete, dispute_resolution ✓
- Item 19: two segments with full metrics ✓
- Item 20: gag_clause_flag present with evidence ✓
- Item 20 Table 3/4/5 footer totals: extracted ✓
- Item 21: key financials, auditor, observations ✓
- Unresolveds: 5 identified ✓
- Contradictions: checked, none found ✓
- Special risks: extracted ✓

## Self-Assessment

- **02_reader_report.md**: ~300 lines — substantial but could be deeper on Items 8-16 operative burdens. Meets minimum for a 330-page FDD.
- **03_tables.json**: 15 table objects extracted covering Items 6, 7, 11, 19, 20, 21. All directly surfaced tables captured.
- **05_canonical.json**: ~40 top-level keys with structured data. Meets threshold.
