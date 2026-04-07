# B1–B5 Summary — merged-burger-king-2025

This merged artifact inherits the B1–B5 work from both source runs. No new conflicts are introduced by the merge because both sources agree on all critical legal fields.

## B1 — Regression check (merged vs each source)

| Dimension | vs shadow-live | vs 637918-benchmark |
|---|---|---|
| Operative exhibit depth | IMPROVED (inherits benchmark's D1/D2, RTF2, Y1, V, O1) | TIE |
| First-pass legal correctness | TIE (both correct) | IMPROVED (inherits shadow-live's clean noncompete path) |
| Tables count | IMPROVED (16 → 26) | TIE |
| State addenda detail | IMPROVED (3/11 → 11/11) | TIE |
| Enrichment v1/v2 | IMPROVED (3.5 KB → 53 KB; 4.6 KB → 57 KB) | TIE |
| Franchisee list structured | IMPROVED (pointer → 5,532 entities) | TIE |
| Final report narrative | IMPROVED (376 → 499 lines) | IMPROVED |
| Canonical first-pass correctness | TIE | IMPROVED (shadow-live canonical, no B3 fix needed) |

## B2 — Recovery generator
No recovery tasks required. Merge satisfied all 5 of shadow-live's deferred tasks (T1 D1/D2, T2 RTF2, T3 Fuel the Flame, T4 state addenda, T6 franchisee list) by inheriting benchmark artifacts.

## B3 — Conflict adjudication
**NOT REQUIRED.** Both source runs agree on all critical legal fields after the benchmark's own B3 adjudication fixed its predecessor's noncompete error. Shadow-live got noncompete correct on first pass. Verbatim source (FA D1 §19 p220): "one (1) year... within two (2) miles of the Premises". Both runs = 1 yr / 2 mi anchored to Premises (FA) / any BK restaurant (DA).

## B4 — Recovery execution
Not required (see B2). Merge is the recovery execution.

## B5 — Reconciled publish gate

**Verdict: MERGED.**

All mandatory gates pass:
- 23/23 Items fully read
- 26/26 exhibit groups catalogued (55 sub-exhibits)
- 11/11 state addenda enumerated with per-state overrides
- Item 19 Section A (4 sub-tables) + Section B (5 cohorts) fully extracted
- Item 21 KPMG unqualified opinion + RBI consolidated balance sheet + income statement + critical audit matters + guarantor structure
- Operative exhibits: D1/D2 deep read, RTF2, Fuel the Flame, Digital Services V, Crown Your Career cross-references
- Franchisee list: 5,532 entities structured
- First-pass legal correctness: noncompete 1yr/2mi verified verbatim
- Wisconsin addendum: confirmed absent (R1)

Material regressions left: **NONE**.
Unresolved legal-field conflicts left: **NONE**.
