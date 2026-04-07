# 15 Regression Check — Shadow vs Prior production run
McDonald's USA, LLC FDD (638437-2025, as amended Feb 1 2026)

## Benchmarks consulted

| Source | Path | Type |
|---|---|---|
| Current shadow run | `runs/shadow-previous-mcdonalds-2025/` | Shadow A1 + depth pass |
| Prior production run | `runs/mcdonalds-2025/` | Manual/live, post-depth, post-reconciliation |
| Prior run gold benchmark (already reconciled) | `runs/mcdonalds-2025/15_regression_check.md` and `17_conflict_adjudication.md` referenced normalized gold corpus | Read indirectly via prior run's regression artifacts |

The prior production run was previously reconciled against a normalized gold corpus and a compact manual gold; this regression check therefore inherits the prior run's gold-source-error findings rather than re-deriving them. The point of comparison is the prior production run **as it stands today**, not the gold corpus directly.

## Dimension-by-dimension comparison

| Dimension | Shadow run | Prior production run | Stronger | Class |
|---|---|---|---|---|
| 02_reader_report.md (lines) | 75 | 144 | Prior | type 2 (missing promoted detail in narrative) |
| 06_coverage_audit.md (lines) | 53 | 67 | Prior (slightly) | type 2 |
| 08_final_report.md (lines, post-depth) | 89 | 121 | Prior | type 2 |
| 09_final_canonical.json (`"value"` count) | 107 | 124 | Prior | type 2 |
| 10_scorecard.md (lines) | 50 | 113 | Prior | type 2 |
| 11_canonical_enriched.json (bytes) | 9,114 | 11,471 | Prior (slightly) | type 2 |
| 12_canonical_enriched_v2.json (bytes) | 15,770 | 11,477 | Shadow | type 2 (in shadow's favor) |
| 03_tables.json (bytes) | 29,044 | 27,707 | Roughly even | — |
| 04_exhibits.json (bytes) | 12,307 | 14,132 | Prior (slightly) | type 2 |
| RT_depth_financial_notes.json (bytes) | 25,841 | 14,911 | Shadow | type 2 (in shadow's favor) |
| RT_depth_contract_burdens.json (bytes) | 23,486 | 16,539 | Shadow | type 2 (in shadow's favor) |
| tables_count | 15 | 15 | Match | — |
| table_rows_count | Comparable (Item 6: 31; Item 7: 9; Item 19 cohorts: 3; Item 19 pro-forma: 5; Item 20: all 5 totals) | Same | Match | — |
| table_notes_count | Item 6: 11; Item 7: 11 (incl Note 11); Item 19: 3; Item 20: 4 | Same | Match | — |
| evidence_grounded_fields_count | 107 | 120+ | Prior | type 2 |
| exhibits_mapped_count | 20 | 20 | Match | — |
| exhibits_deep_read_count | A: Exhibit A (full + notes), Exhibit B clause walk, Exhibit T full read | Same set | Match | — |
| state_addenda_count | 6 (CA, HI, MD, MN, ND, WA) + WA Assurance of Discontinuance | Same 6 | Match | — |
| litigation_count | 7 pending federal + 1 collection (Sri Lanka) = 8 named pending; concluded preserved | 7 pending + 13 concluded with amounts | Roughly even (prior structures concluded count, shadow doesn't) | type 2 |
| franchisee_list depth | Exhibit R presence + 113-name Exhibit S full extract | Same — Exhibit R structurally confirmed; Exhibit S 113 names not row-enumerated | Match | — |
| key exhibit coverage | A, B, T at A; C/D/G/H/I/J/K/L/M/N/O/P/Q at B | Same grading | Match | — |
| financial_statement_depth | Income, balance, cash flow, equity + 11 note families incl revenue recognition, P&E, leasing, restructuring, tax, employee benefits, related party, subsequent events | Same scope | Match | — |
| guaranty_depth | Item 10 BoA loan structure + Exhibit N references; jury trial waiver + personal/spouse guarantee + claim waiver via OAP captured | Same plus **consolidation waiver** explicitly structured | Prior | type 1 (missing extracted fact) |
| key_legal_term_coverage (FA clauses) | 16 promoted clauses including Sec 7 Gross Sales, Sec 8(b) EFT, Sec 8(c) 15% delinquency interest, Sec 10 reporting cadence, Sec 11(a) landlord prohibition, Sec 12(g) hours, Sec 15(c)/(d) ROFR/transfer, Sec 17 insurance minimums, Sec 18(a)–(q) breach triggers, Sec 20(b)/(c) FMV option, Sec 23 attorneys' fees, Sec 24 indemnification, Sec 25 severability termination, Sec 28 acknowledgements | Same set + computed `contractBurdenScore` (interpretive) | Roughly even | type 2 (shadow lacks the interpretive score) |
| audit_richness (process artifacts) | source map, coverage audit, retry tasks, depth pass, promotion audit, publish gate | Same set + adjudication (17), reconciled gate (18), patch log (19) | Prior (post-reconciliation) | type 2 (shadow has not run B-stage reconciliation) |
| scorecard_richness | 50 lines, 23 items at A, exhibit grades, contradiction count | 113 lines, full canonical-field-coverage table, enrichment layer table, quality indicators table | Prior | type 2 |
| unresolveds | 4 listed | 5 listed | Roughly even | — |
| contradictions | 5 preserved | 1 preserved | Shadow | type 2 (in shadow's favor) |
| Item 19 depth | 3-cohort distributions + pro-forma 3 sales volumes + 3 notes + effective rent range + intra-Item N gap preserved | Same | Match | — |
| Item 20 depth | All 5 tables at totals; Exhibit S 113 names; franchisee orgs (NFLA/AMOA/MHOA/NBMOA/WON/OPN/NOA); per-state row enumeration not in JSON | Same | Match | — |
| Item 21 depth | Income/balance/cash flow/equity + RT depth pass | Same | Match | — |
| contract_burden_depth | RT_depth_contract_burdens.json with 30+ promoted clauses + insurance minimums + 15% delinquency interest + Sec 11(a) landlord-prohibition extension + Sec 18(o) political carve-out + FMV option no-intangibles | Same 30+ clauses; prior also captured **consolidation waiver** in financing/guaranty detail (extra) | Prior (slightly — by 1 clause) | type 1 |

## A. Stronger in current shadow run

1. **`12_canonical_enriched_v2.json` is materially larger and more structured** (15,770 vs 11,477 bytes) — the depth-pass promotion of contract burden + financial-notes summary blocks is more thoroughly itemized.
2. **`RT_depth_financial_notes.json` is ~73% larger** (25,841 vs 14,911 bytes) — the shadow run captured more granular detail on the lease maturity schedule, the franchised-revenue split with three years of comparatives, the future minimum rent receivable schedule with owned/leased breakdown, the income tax provision split, the deferred tax components, the related-party intercompany line structure, and the Note 1 vs Item 20 1-restaurant gap explicitly cross-flagged.
3. **`RT_depth_contract_burdens.json` is ~42% larger** (23,486 vs 16,539 bytes) — the shadow run organized burdens by family (financial obligation / lien / data access / system change / EFT / remodel / FMV transfer / tax-permit / estoppel / entity guarantor) with section + page evidence per row, plus a separate cross-reference block to the canonical.
4. **More contradictions explicitly preserved** (5 in shadow vs 1 in prior run): intra-Item 19 N gap, Item 20 vs Note 1 1-restaurant gap, Item 7 vs Note 11 investment-range overshoot, Item 19 4%-vs-5% royalty cohort mismatch, Item 8 proprietary-vs-not framing. The prior run reduced these to one tracked contradiction after reconciliation.
5. **Italicized risk-flag block in 08_final_report.md** — the shadow's "Diligence-material risk flags" section is more compact and reader-targeted than the prior run's equivalent.

## B. Stronger in prior production run

1. **Reader report is ~2× longer** (144 vs 75 lines). The prior run's narrative covers leadership family structure, additional Pass 2/3 detail, and a more thorough Item 8 supplier-control treatment.
2. **Final report is ~36% longer** (121 vs 89 lines) and includes additional context paragraphs around the franchise model and economic flow.
3. **Scorecard is ~2.3× longer** (113 vs 50 lines) and contains a full canonical-field-coverage table broken down by field family (Identity / Issuance / Formats / Initial Fees / Recurring Fees / etc. — 22 categories at 100% fill rate), a full enrichment layer table, and a Quality Indicators section. The shadow scorecard is shorter and item-grade focused.
4. **Coverage audit slightly longer** (67 vs 53 lines) with more granular partial-coverage notes.
5. **More canonical evidence-grounded fields** (124 `"value"` entries vs 107). The prior run promoted more fields into structured canonical form.
6. **Consolidation waiver explicitly structured in financing/guaranty depth** — the prior run extracted both the jury trial waiver AND the consolidation waiver from the Operator Assistance Program / loan documents. The shadow only extracted the jury trial waiver.
7. **Concluded litigation case count structured** (13 cases with amounts) — the shadow preserved the concluded case pattern as a single narrative entry rather than as 13 structured rows.
8. **Leadership roster** — the prior run structured a longer Item 2 leadership family (still not full 37-person, but more than shadow which only put Joe Erlinger in canonical narrative).
9. **B-stage reconciliation artifacts present** (17_conflict_adjudication.md, 18_reconciled_publish_gate.md, 19_reconciliation_patch_log.json) — the prior run has been through B-stage; the shadow has not (and is not supposed to at this stage per instructions).
10. **Computed `contractBurdenScore` and computed fee aggregates** (`totalMinimumPctOfGross`, `totalTypicalPctOfGross`) — interpretive derived fields the shadow does not produce.
11. **Insufficient Funds fee ($200) and Transfer Fee** — the prior run's regression check flags these as fields that exist in the gold corpus but were absent in the prior run too; the prior run reconciled them as gold-source errors. The shadow run does not surface them either, but also has not adjudicated them.
12. **Better Item 6 fee total derivation**: prior run had $10,605/yr derived total (later refined to $11,379.40 after reconciliation including Store Mail). Shadow has $10,500–$11,500 estimated range without a single derived number.

## C. Material regressions in current shadow run

1. **Consolidation waiver not extracted** — the shadow's contract-burden walk captured the jury trial waiver and personal/spouse guarantee from Item 10 + Exhibit N, but did not separately structure the consolidation waiver. Prior production run captured it. **Class: type 1 (missing extracted fact).** Fix scope: re-read Exhibit N pages 196–230 (or the Operator Assistance Program section thereof) and add a `consolidation_waiver: true` field under `contract_burden_promotions_from_FA` or under the financing canonical entry.
2. **Concluded litigation cases not structured row-by-row** — the shadow captured the buyout-as-settlement *pattern* with cumulative dollar totals but did not enumerate all 13 concluded cases as discrete canonical rows. Prior run did. **Class: type 2 (missing promoted field).** All underlying facts are in 02_reader_report.md and 09_final_canonical.json `concluded_cases_pattern`, so this is a promotion gap rather than an extraction gap.
3. **Leadership roster not structured beyond president** — Item 2 has 37+ executive entries in the FDD (pages 10–12) but the shadow canonical only structures the president (Joe Erlinger). Prior run structured more. **Class: type 2 (missing promoted field).** All names/dates were read into pagetext.
4. **Reader report is materially shorter** — Pass 2 and Pass 4 sections in shadow are more compressed than prior run. **Class: type 2 (missing promoted detail in narrative).** Not a fact-loss regression because the underlying facts are in the depth-pass JSONs and canonical, but a presentation depth regression.
5. **Scorecard lacks canonical-field-coverage breakdown table** — the prior run's scorecard breaks 102/124 fields into 22 named families with fill rate per family. The shadow scorecard does not. **Class: type 2.**
6. **No derived `contractBurdenScore` or aggregate `totalRecurringFeePct`** — the shadow does not produce interpretive derived metrics. **Class: type 2.** This is intentional per A1 discipline (no invented facts) but is a functional gap relative to the prior run.

## D. Must-fix regressions before publish

Only one item rises to "must-fix" before publish:

1. **Consolidation waiver field** — verify in Exhibit N (pages 196–230, specifically the Operator Assistance Program Agreement and the BoA promissory note loan documents) and add to canonical. Already adjudicated as a real fact in the prior run; current shadow's omission is a clean regression. Estimated effort: read pages 200–215; add one field. **Priority: MEDIUM.**

The other regressions in section C are presentation-depth and structuring issues, not extraction errors. They should be queued for B-stage but do not block publish at A2 quality.

## E. Conflict fields requiring source adjudication

1. **Late payment interest rate basis**: Shadow says `15% per annum or highest legal rate` from Franchise Agreement Section 8(c) (page 77). Prior run's gold corpus said `SOFR + 5%`. Prior production run already adjudicated this as a gold-source error: the FA Section 8(c) text is the authoritative late-payment-interest rate for franchisee-to-franchisor obligations, while SOFR-based rates apply to the BoA loan program (Item 10) — different instruments. **Adjudication: shadow is correct on the FA clause; the SOFR-based rate is a separate Item 10 / Exhibit N loan-program rate (Term SOFR + adjustment + 3%, APR 7.42% as of 3/17/2025), which the shadow also captured under `recurring_fees`/Item 10. No conflict, but worth a one-line clarifying note in canonical.**
2. **Pending litigation count**: Shadow lists 8 named pending including the Pestonjee Sri Lanka collection action. Prior run says 7 pending + 13 concluded (and counts Pestonjee separately as a 2024 collection action). **Adjudication: numbering conventions differ; both are correct on the underlying case set. Shadow's 8 = 7 federal pending + 1 Sri Lanka collection. Prior run's 7 = 7 federal pending, with Pestonjee separate. Recommend standardizing to "7 pending federal + 1 collection action (Sri Lanka)" in shadow canonical to match prior run convention.**
3. **Pro-forma sample size 11,332 vs 11,322**: This is an FDD-internal inconsistency, not a regression. Shadow preserves both numbers with explicit flag. Prior run preserves both as well. **No adjudication needed.**
4. **Item 6 technology fee aggregate total**: Shadow gives a range ($10,500–$11,500); prior run gives a single derived number ($11,379.40 post-reconciliation). **Adjudication: this is a derivation choice, not a fact conflict. Shadow's range is conservative because some fees are optional. Prior run's single number is the sum of all annual fees including optional. Both are defensible.**
5. **Insufficient Funds fee $200 / Transfer Fee**: Prior run's gold corpus listed these; prior run found neither in the PDF and adjudicated both as gold-source errors. Shadow also did not surface either. **No conflict — both runs are aligned on these being absent from the FDD.**
6. **Consolidation waiver**: See section D. Not a conflict — it is an extraction gap in the shadow that needs filling.

## Net assessment

The shadow run is **functionally equivalent to the prior production run on the canonical-economic-and-burden picture**, with one material extraction gap (consolidation waiver) and several presentation-depth gaps (reader report length, scorecard fill-rate table, leadership roster structure, concluded-litigation row-level enumeration). The shadow run is **stronger** on contradiction preservation and on the `RT_depth_*` JSON depth (financial notes and contract burdens).

This regression check is consistent with `15_publish_gate.md`'s "publish-ready with caveats" verdict. The single must-fix is the consolidation waiver. Everything else in section C is appropriate for B-stage (reconciliation) work, not for a blocking A2 fix.

The likely pattern: a prior/manual run will continue to be stronger on (a) leadership-roster structuring, (b) Item 2 + Item 17 cross-reference depth, and (c) full row-level concluded-litigation enumeration; a shadow run will continue to be stronger on (a) contradiction preservation discipline and (b) depth-pass JSON granularity for financial notes and contract burdens.
