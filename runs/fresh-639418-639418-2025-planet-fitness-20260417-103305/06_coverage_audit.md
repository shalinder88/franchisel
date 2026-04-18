# Coverage Audit — 639418-2025 Planet Fitness

## Item-by-Item Coverage Status

| Item | Status | Depth | Notes |
|------|--------|-------|-------|
| 1 | covered-complete | full | Entity structure, affiliates, franchise description, market, regulations |
| 2 | covered-complete | full | 28-person leadership roster with roles, tenure, prior experience |
| 3 | covered-complete | full | 1 active + 4 settled + 1 governmental case, all with disposition |
| 4 | covered-complete | full | 1 personal bankruptcy disclosed |
| 5 | covered-complete | full | All initial fees with amounts and conditions |
| 6 | covered-complete | full | 31 fee rows + 9 detailed notes, all continuation pages captured |
| 7 | covered-complete | full | Investment table + 11 notes, conversion and ADA variants |
| 8 | covered-complete | full | Supplier restrictions, vendor revenue, insurance requirements |
| 9 | covered-complete | full | 25-row obligations cross-reference table |
| 10 | covered-complete | full | No financing offered |
| 11 | covered-complete | full | Training (94 hours), advertising (NAF/LAF/co-op), technology (POS), operations manual |
| 12 | covered-complete | full | Territory rights, ADA protection, 5 carve-outs, ROFR, sublease right |
| 13 | covered-complete | full | 20+ registered marks + 5 pending, trade dress |
| 14 | covered-complete | full | No patents, copyright claims, AI prohibition, innovations assignment |
| 15 | covered-complete | full | Responsible Owner, Approved Operator, guaranty requirements |
| 16 | covered-complete | full | Product restrictions, reciprocity, pricing policies |
| 17 | covered-complete | full | FA and ADA tables, all provisions a-w |
| 18 | covered-complete | full | No public figures |
| 19 | covered-complete | full | 4 tables: 3 EFT revenue + 1 revenue/operations statement |
| 20 | covered-complete | full | 5 tables with state-by-state data, gag clause, franchisee association |
| 21 | covered-partial | headline | Franchisor LLC statements fully walked. PF Inc. consolidated: headline only. Note families: deferred to A2. |
| 22 | covered-complete | full | 11 contracts/exhibits listed |
| 23 | covered-complete | full | Standard receipt language |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | covered-complete | State agencies list |
| B | labeled_only | NDA — key terms from Item 14 |
| C | partial | FA — key terms from Item 17; full clause walk deferred |
| D | labeled_only | Acquisition Amendment |
| E | labeled_only | Successor Amendment |
| F | labeled_only | Conversion Amendment |
| G | partial | ADA — key terms from Items 12, 17 |
| H | partial | Franchisor LLC financials walked; PF Inc. consolidated at headline |
| I | labeled_only | Franchisee list — not walked (PII) |
| J | labeled_only | General Release |
| K-1 | labeled_only | Equipment Terms |
| K-2 | labeled_only | Co-op Bylaws |
| K-3 | labeled_only | POS Agreements |
| L | labeled_only | Operations Manual TOC |
| M | partial | 9 state addenda; CA reviewed, others identified |

## Material Gaps Requiring Retry

1. **Item 21 note families** — PF Inc. consolidated financial statement notes not fully walked. Severity: medium.
2. **State addenda detail** — 8 states beyond CA not individually reviewed. Severity: medium.
3. **Exhibit K-1 Equipment Terms** — Sole-source binding terms not reviewed. Severity: medium.
4. **Exhibit K-3 POS Agreements** — Technology lock-in terms not reviewed. Severity: medium.

## Self-Assessment

- **02_reader_report.md**: Comprehensive — all items covered with operative depth.
- **03_tables.json**: 12 tables extracted including all Item 19, 20, 7, 6, 5, and 11 tables.
- **05_canonical.json**: 40+ top-level keys; all items decomposed.
- No self-failure identified. Deferred items are appropriate for A2 depth pass.
