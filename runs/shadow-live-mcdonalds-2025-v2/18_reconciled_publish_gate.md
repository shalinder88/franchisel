# Reconciled Publish Gate — shadow-live-mcdonalds-2025-v2

## Verdict: **1 — Publish-ready (reconciled)**

The B1 regression check surfaced 3 additive recovery items (no conflicts). B2 generated the recovery tasks, B3 was skipped because no factual values disagreed, and B4 applied all three patches to `09_final_canonical.json` and `12_canonical_enriched_v2.json`. The run is now publish-ready with the prior benchmark's surfacing structure fully preserved.

## B-side summary

| Stage | Outcome |
|---|---|
| B1 — Regression check | 27 dimensions matched, 4 improvements vs prior, 3 surfacing regressions (all additive) |
| B2 — Recovery generator | 3 additive tasks (1 unresolved + 2 contradictions) |
| B3 — Conflict adjudication | SKIPPED — no factual-value disagreements |
| B4 — Recovery execution | All 3 patches applied to 09_final_canonical.json and 12_canonical_enriched_v2.json |

## Old / New / Merged comparison

| Side | Source | Status |
|---|---|---|
| **Old** | `runs/mcdonalds-2025-merged/09_final_canonical.json` (prior published, commit e909632) | Live — untouched this run |
| **New** | `runs/shadow-live-mcdonalds-2025-v2/09_final_canonical.json` (post-A2, pre-reconciliation) | Superseded |
| **Merged/Reconciled** | `runs/shadow-live-mcdonalds-2025-v2/09_final_canonical.json` (post-B4) | Current canonical |

## Verification that all prior-run legal-field substance is preserved

- ✓ Initial fees (all 5 variants) — match
- ✓ Royalty bifurcation (5% new vs 4% legacy) — match
- ✓ Advertising minimum (4%) — match
- ✓ Term structure (20/10/3/Satellite-varies) — match
- ✓ No renewal right — match
- ✓ No exclusive territory — match
- ✓ 18-month / 10-mile post-term non-compete — match
- ✓ Illinois venue + Illinois governing law — match
- ✓ Item 19 pro forma bands + population n + averages — match exactly
- ✓ Item 20 outlet counts (13,559/12,887/672) — match
- ✓ Exhibit S count (113) — match
- ✓ Item 21 auditor, opinion, dates, all top-line financials — match
- ✓ Litigation pending count (7 + 1 collection) — match
- ✓ State addenda inventory (6 states) — match; new run has structured override_family_matrix that prior lacked
- ✓ Pending contradictions (C-01, C-02, C-03, C-04, C-05, C-06) — all surfaced
- ✓ Unresolveds (U-02 through U-06) — all surfaced

## Material regressions remaining

**NONE.** All three B1-identified regressions were resolved in B4 execution.

## Material unresolved legal-field conflicts remaining

**NONE.** No factual-value conflicts existed between old and new; all differences were surfacing/structure only.

## Final counts

- Unresolveds: **6** (U-01 resolved-in-A2, U-02 through U-06 preserved)
- Contradictions: **6** (C-01 through C-06 preserved/added)
- Coverage score: **99.2** (post-A2, unchanged by additive B-side patches)
- State addenda states structured: **6** (California, Hawaii, Maryland, Minnesota, North Dakota, Washington)
- Wisconsin addendum present: **false** (material finding, preserved)
- Washington AOD surfaced: **yes**

## Publish recommendation

**SHIP.** The `runs/shadow-live-mcdonalds-2025-v2/` artifact set is a valid standalone canonical extraction and, after B-side reconciliation, also matches the prior merged benchmark on every factual value while adding structured state addenda overrides, Washington AOD surfacing, Item 21 lease/tax/restructuring depth, and Item 1 formation detail that the prior merged run did not carry.

This run does NOT overwrite `runs/mcdonalds-2025-merged/`. The user can review this run as a test of the full-automation path and compare against old/new/merged at their discretion.
