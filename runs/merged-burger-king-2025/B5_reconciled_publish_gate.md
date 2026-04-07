# B5 — Reconciled Publish Gate

## Inputs
- A1 outputs: 01-10, 14, 11_canonical_enriched, 12_canonical_enriched_v2
- A2 fixed depth pass: clean, no discrepancies
- A3 diagnostic publish gate: PASS
- B1 regression check: 5 medium/high regressions vs benchmark; no legal-field conflicts
- B2 recovery generator: 3 EXECUTE (T1, T4, T5), 4 SKIP
- B3 conflict adjudication: NOT REQUIRED (no real conflicts)
- B4 recovery execution: T1 partial (5/8 benchmark findings recovered), T4 partial (3/11 states detailed), T5 complete (enrichment v1 + v2 produced)

## Reconciliation outcome

### Critical legal fields (verified against direct source)
| Field | Value | Source | Status |
|-------|-------|--------|--------|
| Term | 20 years (freestanding) | FA D1 Sec 1; Item 17(a) | CONFIRMED |
| Renewal right | None | FA Sec 17; Item 17(b) | CONFIRMED |
| Successor terms may differ materially | TRUE | Item 17(c) | CONFIRMED |
| No successor for Big-Box / Delivery | TRUE | Item 17(b) | CONFIRMED |
| Post-term noncompete | 1 year, 2 miles | FA D1 Sec 19 (p220 verbatim) | CONFIRMED |
| Noncompete anchor | "the Premises" (FA) / "any of your BK restaurants" (DA) | FA D1 Sec 19 / DA Art VII | CONFIRMED |
| Venue | S.D. Fla / 11th Judicial Court Miami-Dade | FA Sec 21 | CONFIRMED |
| Governing law | Florida (subject to state law) | FA Sec 21 | CONFIRMED |
| Royalty | 4.5% | Item 6 | CONFIRMED |
| Advertising | up to 4.5% (currently 4.5%) | Item 6 | CONFIRMED |
| Investment Spending | up to 2.0% | Item 6 | CONFIRMED |
| Standard franchise fee | $50,000 | Item 5 | CONFIRMED |
| Training fee per trainee | $7,500 | Item 5 | CONFIRMED |
| Investment range | $348,400 - $4,705,600 | Item 7 | CONFIRMED |
| US franchised outlets EOY 2024 | 5,524 | Item 20 Table 1 | CONFIRMED |
| US company-owned EOY 2024 | 1,177 | Item 20 Table 1 | CONFIRMED |
| Carrols acquisition impact | -1,116 franchised / +1,039 company | Item 20 Table 1 + footnote | CONFIRMED |
| Item 19 Traditional avg consolidated | $1,671,613 | Item 19 Section A | CONFIRMED |
| Item 19 Section B avg uplift | +12.3% (n=893) | Item 19 Section B | CONFIRMED |
| Auditor | KPMG LLP, Miami, since 1989 | Exhibit Q p805 | CONFIRMED |
| Audit opinion | Unqualified, 2/21/2025 | Exhibit Q p805 | CONFIRMED |
| Critical audit matters | 2 (Carrols leases + Firehouse brand) | Exhibit Q p805-806 | CONFIRMED |
| RBI 2024 total revenues | $8,406M | Exhibit Q p809 | CONFIRMED |
| RBI 2024 net income | $1,445M | Exhibit Q p809 | CONFIRMED |
| BKC standalone audited | FALSE (only RBI/RBILP consolidated audited) | CA addendum p783-784 | CONFIRMED |
| Default guarantor | RBI | Item 21 | CONFIRMED |
| RBILP guarantor states | CA, IL, MD, ND, RI, VA, WA | Item 21 | CONFIRMED |
| Exhibit O3 ceased/silent count | 1,433 | Item 20 p126 | CONFIRMED |
| State addenda count | 11 (CA, HI, IL, MD, MN, NY, ND, RI, SD, VA, WA) | Exhibit P pp706-801 | CONFIRMED |
| Wisconsin addendum present | FALSE | Grep all 1057 pages (R1) | CONFIRMED |

### Material regressions resolved
- T1 (FA deep read): 5 of 8 benchmark findings recovered (noncompete confirmed verbatim, MOD Manual change rights, 65% media floor, 66.7% IS supermajority, $1,000 BK Foundation mandatory). 3 deferred (data ownership detail, successor 4-yr notice, post-transfer installment liability).
- T4 (state addenda): All 11 states enumerated; 3 of 11 (CA, HI, WA) per-state material override summarized; 8 deferred.
- T5 (enrichment): v1 and v2 produced.

### Material regressions remaining (deferred — not blocking)
- T2 (RTF2 deep read): Reference + Item 6 narrative captured. Full 22-page exhibit deep read deferred.
- T3 (Fuel the Flame deep read): Item 6 narrative + EBITDA threshold captured. Full 10-page exhibit deep read deferred.
- T6 (franchisee list): Page range + count captured. Structured 5,500-entity enumeration deferred.
- T7 (table count gap): Current 16 tables cover all required Items; benchmark 26 includes finer state breakouts.

### Material legal-field conflicts left
**NONE.** The benchmark's noncompete adjudication (1 year / 2 miles) is consistent with the current run's canonical and verified verbatim against FA D1 Sec 19 p220.

## Verdict

**B5: NEW** — the new run is **production-usable as a new artifact**, with no critical legal-field errors and 100% Item coverage. It is **shallower than the benchmark** on operative exhibit clauses (D1/D2 5/8 found, RTF2/Y1 deferred) and on franchisee list/per-state addenda granularity, but does not contradict the benchmark on any critical legal field.

**Recommendation:** Use the new run (`runs/shadow-live-burger-king-2025/`) as the publish target for this iteration. The benchmark run (`runs/637918-2025-Burger-King/`) remains the deeper reference for operative-clause-level work and should be preserved.

**Final B5 verdict: NEW (with deferred enrichment back to benchmark depth on T2/T3/T6).**

Material regressions left: T2 (RTF2 deep read), T3 (Fuel the Flame deep read), T6 (franchisee list enumeration), T7 (finer state table breakouts), partial T1 (3/8 FA findings deferred), partial T4 (8/11 state addenda overrides deferred). None block publish.

Unresolved legal-field conflicts left: NONE.
