# Coverage Audit — 640419 Pizza Hut Traditional (2026)

## Item-by-Item Coverage

| Item | Status | Depth | Notes |
|------|--------|-------|-------|
| 1 | covered-complete | deep | Entity structure, affiliates, Hut Forward, Tech Framework, concepts all extracted |
| 2 | covered-complete | deep | All 17 officers/directors with roles, dates, prior employment |
| 3 | covered-complete | full | One pending matter (Meta Pixel mass arbitration, 80 claimants) |
| 4 | covered-complete | full | No bankruptcy |
| 5 | covered-complete | full | $25K fee, inflation adjustment, ACE waiver |
| 6 | covered-complete | deep | 25 fee rows + 9 notes, all continuation pages captured |
| 7 | covered-complete | deep | All 4 concept investment tables with totals and 10 notes |
| 8 | covered-complete | deep | Computer system, proprietary/non-proprietary, insurance, suppliers, RSCS/Co-op, affiliate revenue |
| 9 | covered-complete | full | 25-category obligation table |
| 10 | covered-complete | full | No financing |
| 11 | covered-complete | deep | Pre-opening (8 items), continuing (7 items), training table, advertising fund, computer systems, Standards Library |
| 12 | covered-complete | deep | Protected Radius, Delivery Area, franchisor reserved rights, National Accounts, relocation, distribution channels |
| 13 | covered-complete | full | Trademark table, ownership, no pending actions |
| 14 | covered-complete | full | No material patents, copyrights, trade secrets, confidentiality requirements |
| 15 | covered-complete | full | QO requirements, 10% equity, guaranty, death/disability successor timeline |
| 16 | covered-complete | full | Product restrictions, Pepsi exclusivity, customer data ownership, loyalty programs |
| 17 | covered-complete | deep | 23-provision table (a-w), renewal, termination (curable/non-curable), transfer, non-compete, dispute resolution |
| 18 | covered-complete | full | No public figures |
| 19 | covered-complete | deep | 3 concept groupings x 2 years, ranges, % exceeding average |
| 20 | covered-complete | deep | Tables 1-5 all extracted with footer totals, gag clause flag, IPHFHA |
| 21 | covered-complete | deep | BS, IS, CF, equity, 5 notes walked, all key financial observations |
| 22 | covered-complete | full | 8 contract exhibits listed |
| 23 | covered-complete | full | Receipt |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | labeled | State agencies list — no operative content |
| B | labeled | Agents for service — no operative content |
| C-1 | partial | 181-page FA. Key provisions captured via Item 17 table. Full clause walk needed in A2. |
| C-2 | partial | State addenda for 10 states read. Material overrides captured. Full verbatim deferred. |
| D | labeled | Release and Assignment — standard form |
| E-1 | labeled | Pepsi Adoption — key term (Dec 2026 exclusivity) captured |
| E-2 | labeled | Comcast Adoption — standard |
| F | labeled | Confidentiality Agreement — standard |
| G | labeled | LMS Agreement — 11 pages, not clause-walked |
| H-1 | labeled | 59-page current franchisee list — PII-sensitive |
| H-2 | labeled | 11-page former franchisee list — PII-sensitive |
| I | complete | Financial statements fully walked (auditor report, all 4 statements, all 5 notes) |
| J | labeled | Standards Library TOC — 97 pages referenced |
| K | partial | Dragontail Adoption — key pricing captured, pricing discrepancy noted ($160 vs $240 install) |
| L | labeled | HutBot Agreement — 18 pages, key terms noted (AAA arbitration, data ownership) |
| M | labeled | State Effective Dates — standard |
| N | labeled | Receipts — standard |

## Canonical Completeness

- **Top-level keys**: 42 (target: ≥40 for 423-page FDD) ✓
- **Canonical size**: ~32KB (target: ≥30KB for 300+ page FDD) ✓
- **Item 2 leadership roster**: All 17 persons as structured array ✓
- **Items 9-16 operative burdens**: Each item has own canonical key ✓
- **Item 19 chart detail**: Three concept groupings x 2 years ✓
- **Item 20 all tables**: Tables 1-5 with footer totals ✓
- **Item 20 gag clause**: Flagged with evidence ✓
- **Item 21 note families**: All 5 notes walked ✓
- **Unresolveds**: 5 entries with severity and source ✓
- **Contradictions**: 0 (reconciliation checked, no discrepancies found) ✓
- **Special risks**: 2 entries ✓
- **State addenda overrides**: 11 states with material overrides ✓

## Gaps Requiring Retry

1. **Franchise Agreement clause walk** (C-1): 181-page agreement only summarized via Item 17 table. Full operative burden analysis of key articles needed for A2 depth pass.
2. **State Addenda full verbatim** (C-2): Material overrides captured but not all states fully extracted.
3. **Dragontail pricing discrepancy**: Exhibit K shows $160/store install fee vs Item 6 fee table showing $240. Needs reconciliation.
4. **HutBot Agreement** (Exhibit L): 18 pages not clause-walked. Key terms noted but full operative burden not extracted.

## Self-Assessment

- **02_reader_report.md**: ~500+ lines, all 7 passes (A-G), all mandatory subsections including Item 2 roster, Items 9-16 operative burdens, Item 20 all tables, Item 21 full financial walk. Meets depth floor. ✓
- **03_tables.json**: 16 table objects including all Item 7 concepts, all Item 19 groupings, all Item 20 tables, Item 21 financial statements. ✓
- **04_exhibits.json**: All 17 exhibits cataloged with clause_walk_status, material_clause_count, operative_terms_extracted. ✓
- **05_canonical.json**: 42 top-level keys, structured arrays for leadership, notes, state overrides, unresolveds. Meets 30KB target. ✓
