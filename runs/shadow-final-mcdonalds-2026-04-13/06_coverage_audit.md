# Coverage Audit — McDonald's USA, LLC (638437-2025)

## Coverage by Item

| Item | Status | Notes |
|------|--------|-------|
| 1 | covered-complete | Entity, predecessor, types, system description |
| 2 | covered-complete | Full 37-person roster with roles, tenures, bios |
| 3 | covered-complete | 8 pending, 12 concluded, settlement amounts |
| 4 | covered-complete | No bankruptcy |
| 5 | covered-complete | All fee tiers (traditional, STO/STR, Satellite, BFL, Walmart) |
| 6 | covered-complete | Full fee table (31 rows), all 12 footnotes, all continuation pages |
| 7 | covered-complete | Investment table with 3 tiers, 11 footnotes |
| 8 | covered-complete | Supplier restrictions, revenue disclosure, purchase percentages |
| 9 | covered-complete | 24-item obligations table |
| 10 | covered-complete | No direct financing; Bank of America guarantee terms |
| 11 | covered-complete | Training program tables, computer systems, site selection, advertising |
| 12 | covered-complete | No territory, no exclusivity, channel rights reserved |
| 13 | covered-complete | 3 principal marks, licensed from Restaurant Brands LLC |
| 14 | covered-complete | No patents, copyrights claimed in O&T Manual, trade secrets |
| 15 | covered-complete | Full-time personal supervision required |
| 16 | covered-complete | Only authorized products, no customer restrictions |
| 17 | covered-complete | Both FA and Operator's Lease tables, all provisions |
| 18 | covered-complete | No public figures |
| 19 | covered-complete | 3 population tiers, 3 pro forma levels, all notes/caveats |
| 20 | covered-complete | All 5 tables with footer totals, gag clause, franchisee orgs |
| 21 | covered-complete | Auditor report, all 4 statements, 14 note families walked |
| 22 | covered-complete | Reference to Exhibits B-J, M |
| 23 | covered-complete | Receipts noted |

## Coverage by Exhibit

| Exhibit | Status | Notes |
|---------|--------|-------|
| A (Financial Statements) | covered-complete | Full read of all 15 pages |
| B (FA Traditional) | partial | Key provisions via Item 17; full clause walk deferred |
| C (FA Satellite) | labeled_only | Parallel to Exhibit B |
| D (FA Walmart) | labeled_only | Parallel to Exhibit B |
| E (New Restaurant Rider) | labeled_only | 3 pages, referenced in Items 6/7 |
| F (BFL Rider) | labeled_only | 3 pages, referenced in Items 1/5/6/10 |
| G (Operator's Lease) | partial | Key provisions via Items 9/17; full 33-page walk deferred |
| H (Assignment to Entity) | labeled_only | Referenced in Item 17 |
| I (Assignment Agreement) | labeled_only | Referenced in Item 17 |
| J (Candidate Agreements) | labeled_only | Referenced in Item 11 |
| K (New Term Policy) | partial | Key terms surfaced; discretionary policy |
| L (Growth Policy) | labeled_only | 1 page; discretionary policy |
| M (New Term Offer Letter) | labeled_only | Template letter |
| N (Loan Documents) | partial | Key terms via Item 10; 35-page set deferred |
| O (Agents for Service) | covered-complete | Administrative |
| P (State Administrators) | covered-complete | Administrative |
| Q (Affiliates) | covered-complete | Administrative |
| R (Franchisee List) | covered-complete | 144 pages, PII — per-entry extraction not appropriate |
| S (Ceased Operations List) | covered-complete | 113 franchisees noted |
| T (State Addenda) | covered-complete | 5 states + effective dates |

## Gaps Identified

1. **Exhibit B full clause walk** — Franchise Agreement (Traditional) has 28 operative sections. Key provisions surfaced via Item 17, but individual clause-level detail would improve depth. Priority: medium (A2 candidate).
2. **Exhibit G full clause walk** — Operator's Lease is 33 pages. Key provisions surfaced via cross-reference. Priority: medium (A2 candidate).
3. **Item 20 state-level detail** — All 5 tables extracted with footer totals. Per-state rows captured for Tables 3 and 4 in full read but not individually structured in tables JSON. Priority: low.

## Contradictions Found
1. Outlet count discrepancy: Item 20 (13,559) vs Item 21 notes (13,557). Difference of 2 outlets. Severity: low.

## Self-Assessment
- All 23 items fully read and classified
- All 20 exhibits cataloged with page ranges and status
- Item 6 fee table read through ALL continuation pages (7 pages, 31 fee rows, 12 footnotes)
- Item 19 all three population tiers + all three pro forma statements + all notes
- Item 20 all 5 tables with footer totals
- Item 21 all 4 financial statements + all 14 note families walked
- State addenda fully read (5 states)
- Gag clause identified and flagged
- Output depth floor: 02_reader_report.md is 500+ lines, comprehensive narrative
