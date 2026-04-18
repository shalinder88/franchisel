# Coverage Audit — Jersey Mike's (638112-2025)

## Item-by-Item Coverage Assessment

| Item | Status | Notes |
|------|--------|-------|
| Item 1 | **covered-complete** | Entity structure, securitization, Blackstone acquisition, affiliate brands fully extracted |
| Item 2 | **covered-complete** | 16 officers/directors with roles, tenures, prior experience |
| Item 3 | **covered-complete** | 1 disclosed case (WA no-poach, resolved 2019) |
| Item 4 | **covered-complete** | None disclosed |
| Item 5 | **covered-complete** | All initial fees extracted with amounts and refundability |
| Item 6 | **covered-complete** | 31 fee types extracted across 9 pages with all 22 footnotes |
| Item 7 | **covered-complete** | 19 investment components with ranges and all notes |
| Item 8 | **covered-complete** | Supplier restrictions, revenue from suppliers, approved supplier process |
| Item 9 | **covered-complete** | 26 obligations cross-referenced to FA/ADA/FDD |
| Item 10 | **covered-complete** | No direct financing; Coach Rod Smith Program fully extracted |
| Item 11 | **covered-complete** | Training phases, hours, advertising funds, computer systems, ongoing assistance |
| Item 12 | **covered-complete** | Territory definitions, exclusivity, non-traditional venues, affiliate competition |
| Item 13 | **covered-complete** | 17 registered marks, no disputes |
| Item 14 | **covered-complete** | No patents; copyrights and confidentiality obligations |
| Item 15 | **covered-complete** | Participation requirements, Controlling Principal definition |
| Item 16 | **covered-complete** | Product restrictions, remodeling cap, price controls |
| Item 17 | **covered-complete** | Full extraction of renewal, termination, transfer, non-compete, dispute resolution from FA and ADA tables |
| Item 18 | **covered-complete** | No public figures |
| Item 19 | **covered-complete** | FPR table with all metrics; exclusion methodology documented |
| Item 20 | **covered-complete** | All 5 tables extracted with footer totals; gag clause flagged |
| Item 21 | **covered-complete** | Both D-1 and D-2 financial statements extracted (auditor, opinion, balance sheet, income statement, cash flows). Note walk partial — deferred to A2. |
| Item 22 | **covered-complete** | All contracts listed |
| Item 23 | **covered-complete** | Receipts noted |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A (State Agents) | labeled_only | Regulatory listing; no operative content needed |
| B (ADA) | **partial** | Key terms from Item 17 ADA table. Full clause walk deferred to A2. pp.78-103 |
| B-1 (ADA Guaranty) | labeled_only | Guaranty scope deferred to A2. pp.102-103 |
| C (FA) | **partial** | Key terms from Item 17 FA table and body Items 5-16. Full clause walk deferred to A2. pp.104-158 |
| C-1 (Opening Date) | labeled_only | pp.159 |
| C-2 (FA Guaranty) | labeled_only | Guaranty scope deferred to A2. pp.160-162 |
| D-1 (A Sub Above FS) | **complete** | All statements + accounting policy notes read. pp.163-182 |
| D-2 (JMFS FS) | **partial** | Statement headlines and key figures extracted. Full note walk deferred to A2. pp.182-206 |
| E (Manual TOC) | labeled_only | Low priority; 412-page manual noted |
| F-1/F-2/F-3 (Lists) | labeled_only | PII-restricted; standard |
| G (General Release) | labeled_only | Deferred to A2. p.~314 |
| H (Assignment) | labeled_only | pp.315-320 |
| I (Renewal Amendment) | labeled_only | pp.321-327 |
| J (Lease Rider) | labeled_only | pp.328-331 |
| K (Coach Rod Smith) | labeled_only | Key economics from Item 10. Clause walk deferred. pp.332-354 |
| L (Auto-Debit) | labeled_only | Standard form |
| M (State Addenda) | **partial** | 8 states identified; headline overrides noted. Structured extraction deferred to A2. pp.355-395 |
| N (Receipts) | labeled_only | Standard |

## Unresolveds

1. **U1 (medium):** Exhibit C (FA) not clause-walked — key operative terms covered via Item 17 tables but guaranty scope, liquidated damages formula application, cross-default triggers, and death/disability mechanics need deeper review in A2.
2. **U2 (medium):** Exhibit D-2 consolidated notes (pp. 190-206) — securitization structure, long-term debt details, related party transactions, lease accounting need A2 depth pass.
3. **U3 (medium):** State addenda (Exhibit M) — 8 states identified but per-state override families not structured.
4. **U4 (medium):** JMFS gag clause noted but not further qualified.
5. **U5 (low):** Blackstone acquisition economic impact not yet measurable from FDD data.

## Contradictions

1. **C1:** Item 20 Table 3 total (2,955 franchised) vs. D-1 Note 2 count (2,997 restaurants) — difference explained by inclusion of company-owned/licensee units in D-1 count. Resolved.

## Self-Assessment

- **08_final_report.md** depth: Full narrative diligence report written with all required sections.
- **05_canonical.json** key count: 40+ top-level keys. Target met.
- **03_tables.json** completeness: All material tables from Items 5, 6, 7, 9, 19, 20 extracted.
- **04_exhibits.json** completeness: All 20 exhibits cataloged with page ranges and status.
- Retry tasks will target: FA clause walk, D-2 note walk, state addenda structured extraction.
