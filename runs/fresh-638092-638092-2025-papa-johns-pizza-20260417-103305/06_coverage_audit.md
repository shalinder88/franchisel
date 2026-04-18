# Coverage Audit — Papa Johns FDD (638092-2025)

## Item-by-Item Coverage Assessment

| Item | Status | Detail |
|------|--------|--------|
| Item 1 | ✅ Covered-complete | Entity, history, affiliates, market, CA AB 1228 |
| Item 2 | ✅ Covered-complete | Full roster: 15 executives + 7 directors with roles and tenure |
| Item 3 | ✅ Covered-complete | 3 litigation matters with outcomes |
| Item 4 | ✅ Covered-complete | No bankruptcy |
| Item 5 | ✅ Covered-complete | All fee types for Standard, NT, ST |
| Item 6 | ✅ Covered-complete | Full fee table (20 fee categories) + all 14 footnotes |
| Item 7 | ✅ Covered-complete | Both investment tables + 16 explanatory notes |
| Item 8 | ✅ Covered-complete | Supplier restrictions, cheese program, affiliate revenues |
| Item 9 | ✅ Covered-complete | Full cross-reference table |
| Item 10 | ✅ Covered-complete | Equipment lease terms, SBA policy |
| Item 11 | ✅ Covered-complete | Training (all levels), marketing fund, cooperatives, IS |
| Item 12 | ✅ Covered-complete | Territory definition, franchisor rights, online routing |
| Item 13 | ✅ Covered-complete | Trademark registrations, known users |
| Item 14 | ✅ Covered-complete | Patents, copyrights, data ownership |
| Item 15 | ✅ Covered-complete | PO requirements, personal guarantee |
| Item 16 | ✅ Covered-complete | Product restrictions |
| Item 17 | ✅ Covered-complete | FA + DA tables fully extracted |
| Item 18 | ✅ Covered-complete | Shaq O'Neal full detail |
| Item 19 | ✅ Covered-complete | All 4 tables + chart + notes |
| Item 20 | ✅ Covered-complete | All 5 tables with state-level detail, gag clause |
| Item 21 | ✅ Covered-complete | All statements + 5 notes walked |
| Item 22 | ✅ Covered-complete | Contract list |
| Item 23 | ✅ Covered-complete | Receipts |

## Exhibit Coverage

| Exhibit | Status | Detail |
|---------|--------|--------|
| A (State Agencies) | ✅ Labeled | Low priority |
| B (FA Standard) | ⚠️ Partial | Key provisions via Item 17. Clause walk deferred to A2. |
| C (Equipment Lease) | ⚠️ Partial | Key terms from Item 10. Clause walk deferred. |
| D-1 (NT FA) | ⚠️ Partial | Key differences noted. Clause walk deferred. |
| D-2 (ST FA) | ⚠️ Partial | Key differences noted. Clause walk deferred. |
| E (Development Agreement) | ⚠️ Partial | Key provisions from Item 17. Clause walk deferred. |
| F (ACH Authorization) | ✅ Labeled | Standard form |
| G (Cheese Purchase) | ⚠️ Partial | Key terms from Item 8. |
| H (Advertising Agreement) | ⚠️ Partial | Key terms from Items 6, 11. |
| I (Manual TOC) | ✅ Labeled | Content described in Item 11 |
| J (Coop By-Laws) | ✅ Labeled | Key terms in Items 6, 11 |
| K-1 (Owner Agreement) | ⚠️ Partial | Key provisions from Items 15, 17. Clause walk deferred. |
| K-2 (Relationship Agreement) | ⚠️ Partial | Key provisions from Items 15, 17. |
| L (Transfer Authorization) | ✅ Labeled | Standard form |
| M (Franchisee List) | ✅ Labeled (PII block) | 61 pages |
| N (Departed List) | ✅ Labeled (PII block) | 10 pages |
| O (Financial Statements) | ✅ Complete | All statements + notes walked |
| P (State Addenda) | ⚠️ Partial | States identified, headline overrides. Full structured extraction deferred. |
| Q (Effective Dates) | ✅ Labeled | |
| R (Receipts) | ✅ Labeled | |

## Identified Gaps

1. **Franchise Agreement clause walk** — Exhibit B (~65 pages) not directly walked. Key operative burdens covered via Item 17 table, but granular clause detail (especially liquidated damages formula, guaranty scope, cross-default, force majeure) requires direct reading. Retry: EXECUTE in A2.

2. **State addenda structured extraction** — 7 states identified with headline overrides. Need per-state structured override families. Retry: EXECUTE in A2.

3. **Development Agreement clause walk** — Key provisions covered via Item 17 table. Direct reading of cross-default, development schedule penalties needed. Retry: EXECUTE in A2.

4. **Owner Agreement / Guaranty scope** — Personal guarantee scope (unlimited? spousal?) not fully confirmed from body items alone. Retry: EXECUTE in A2.

## Unresolveds (6 items)
See canonical `unresolveds` array. All are business-risk flags or document-internal questions, not extraction gaps.

## Contradictions (1 item)
CT-01: Zero terminations + 26 ceased-operations-other classification ambiguity.
