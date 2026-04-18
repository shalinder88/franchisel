# Scorecard — Papa Johns FDD (638092-2025)

## Overall Grade: A-

### Item-by-Item Scores

| Item | Score | Notes |
|------|-------|-------|
| Item 1 | A | Complete entity history, affiliates, market |
| Item 2 | A | Full roster: 22 officers + directors |
| Item 3 | A | All 3 matters with outcomes |
| Item 4 | A | Confirmed: no bankruptcy |
| Item 5 | A | All fee types, all programs |
| Item 6 | A | 20 fee categories + 14 footnotes |
| Item 7 | A | Both tables + 16 notes |
| Item 8 | A | Supplier restrictions, affiliate revenues, cheese program |
| Item 9 | A | Complete cross-reference table |
| Item 10 | A | Equipment lease fully detailed |
| Item 11 | A | Training, marketing, IS, cooperatives |
| Item 12 | A | Territory, online routing, franchisor rights |
| Item 13 | A | All registrations, known users |
| Item 14 | A | IP, data ownership |
| Item 15 | A | PO requirements, personal guarantee |
| Item 16 | A | Product restrictions |
| Item 17 | A | Complete FA + DA tables |
| Item 18 | A | Shaq O'Neal full detail |
| Item 19 | A | All 4 tables + chart + notes |
| Item 20 | A | All 5 tables + state detail + gag clause |
| Item 21 | A | All statements + all 5 notes |
| Item 22 | A | Contract list |
| Item 23 | A | Receipts |

### Exhibit Scores

| Exhibit | Score | Notes |
|---------|-------|-------|
| B (FA) | A | Full clause walk completed in A2 — 18 clauses extracted |
| C (Equip Lease) | B+ | Key terms from Item 10; sufficient for buyer assessment |
| D-1 (NT FA) | B | Key differences noted; parallel to Standard FA |
| D-2 (ST FA) | B | Key differences noted; parallel to Standard FA |
| E (Dev Agreement) | B+ | Partial clause walk in A2 — 5 key clauses; remainder covered in body |
| G (Cheese) | B | Key terms from Item 8; voluntary program |
| K-1 (Owner Agmt) | A- | Guaranty scope confirmed in A2: unlimited, joint/several, no spousal exception |
| O (Fin Statements) | A | Complete — all statements + all 5 notes fully walked |
| P (State Addenda) | A- | Full structured extraction: 7 states, 30+ override entries |

### Depth Assessment

- **Canonical top-level keys:** 43 (exceeds 40 target)
- **Canonical size:** ~25KB (meets 20KB+ threshold for 568-page FDD)
- **Reader report depth:** Full (7 narrative passes + all mandated subsections)
- **Final report depth:** ~650 lines (exceeds 500-line target)
- **Tables extracted:** 17 tables with full structure and notes
- **Item 21 method:** Normal text extraction (excellent text layer)

### A2 Depth Pass Deltas

- **Depth Pass 1 (Financial Notes):** All 5 notes walked in full. RT_depth_financial_notes.json written.
- **Depth Pass 2 (Contract Burden):** Franchise Agreement 18 clauses walked. RT_depth_contract_burdens.json written. Notable finding: no force majeure clause; unlimited indemnification; security interest in all personal property at termination.
- **Depth Pass 3 (Promotion Audit):** 4 facts promoted from reader report to canonical. RT_depth_promotion_audit.json written.
- **Depth Pass 4 (State Addenda):** 7 states, 30+ structured override entries. RT_depth_state_addenda_promotion.json written.
- **Targeted Block 1 (Item 21 Notes):** Complete — all 5 notes, no image fallback needed. RT_depth_item21_notes.json written.
- **Targeted Block 2 (Key Exhibits):** FA clause walk complete, DA partial, OA confirmed unlimited guaranty. RT_depth_key_exhibits.json written.
- **Targeted Block 3 (Item 20):** All 5 tables confirmed complete with footer totals. RT_depth_item20_tables.json written.
- **Targeted Block 4 (Thin Items):** All Items 2, 9-16, 18 confirmed at full depth. RT_depth_thin_items.json written.
- **Item 21 method:** Normal text extraction (excellent text layer, no image fallback needed).

### What Lowers the Grade from A to A-

1. NT FA (Exhibit D-1, ~120 pages) and ST FA (Exhibit D-2, ~50 pages) not directly clause-walked — key differences covered in body items
2. Cheese Purchase Agreement (Exhibit G) not clause-walked beyond Item 8 coverage (voluntary program, lower priority)
3. No Item 19 cost or profitability data available in FDD (sales-only FPR)
