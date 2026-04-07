# 15 Publish Gate (diagnostic) — Ivybrook Academy 2025 v2

## Verdict: **2 — Publish with caveats**

**Rationale.** All 23 items + all exhibits (except Exhibit J content) are fully surfaced with evidence-grounded canonical fields. State addenda are fully structured into the `state_addenda_overrides` family (3 states, 16 overrides across 12 families). Unresolveds and contradictions are preserved as structured families. The final report is a full diligence report, not a concise metrics summary. The one material gap — Exhibit J image-only financial statements — is **partially mitigated** by the promoted stockholder's-equity fact ($345,862) from the Virginia addendum, so the financial-condition risk is quantitatively anchored, but the balance sheet, income statement, cash flow, auditor identity, and opinion type are not directly readable. That gap is material for full Item 21 publishability but does not render the rest of the extraction unusable or misleading.

## Item-by-item assessment

| # | Area | Status | Notes |
|---|---|---|---|
| 1 | Item 19 completeness | ✅ Full | Tables 1, 2A, 2B, 2C, 3 captured with populations, distribution counts, and all 6 notes. Substantiation-availability statement captured. |
| 2 | Item 20 completeness | ✅ Full | All 5 tables. Totals balance. Franchisee-list exhibit identified (body label L). Confidentiality-clause/gag flag captured. |
| 3 | Item 21 sufficiency | ⚠️ Partial | Auditor identity NOT captured (Exhibit J image-only). Balance sheet / income statement / cash flow NOT directly captured. Stockholder's equity 2024 **$345,862** recovered via VA addendum. Going-concern status inferred (not confirmed). Partial recovery ~40%. |
| 4 | State addenda sufficiency | ✅ Full | IL, MN, VA present; structured into `state_addenda_overrides` in 09_final_canonical.json with 16 override entries; matrix built in RT_depth_state_addenda_promotion.json. |
| 5 | Key exhibit sufficiency | ✅ Mostly | Exhibits A, B, C, D, E, F, G, H, I, L, M accounted for. Exhibit K label is missing/mislabeled (contradiction C3). Exhibit J present but image-only. |
| 6 | Unresolveds/contradictions | ✅ Full | `unresolveds_consolidated` (7 entries) and `contradictions_consolidated` (4 entries) present as top-level families in 09_final_canonical.json. All flagged as business-risk or extraction-gap with severity. |
| 7 | Final report depth | ✅ Full | 08_final_report.md is a full diligence report with sections A–L. Includes executive snapshot, fees/investment, supplier/operations/tech, territory, contract burden, Item 19, Item 20, Item 21 summary, state addenda, unresolveds, contradictions, final coverage note. |
| 8 | Scorecard gate | ✅ B+ | Weighted coverage ~88% post-A2. Item 21 is the only item below B grade. |

## Caveats to document on publish

1. **Item 21 financial statements**: Exhibit J is image-only in this run. Only the stockholder's equity figure ($345,862 at 12/31/2024, from VA addendum) and aggregate franchisor revenue ($2,171,363, from Item 8) are text-direct. Auditor name, opinion type, and full statements must be recovered via vision OCR before a final publish.
2. **Exhibit K labeling contradiction**: TOC lists K = Current Franchisees, body labels it L. Franchisee Disclosure Questionnaire is not separately labeled in the body. Publish note should say "Exhibit K label absent; franchisee list presented under body label Exhibit L."
3. **Table 3 vs Table 2C 1-unit population mismatch** in Item 19 — trivial but publish note should acknowledge.
4. **Customer-evaluation score termination trigger** with undisclosed threshold (U5) — call out as diligence question.
5. **Brand Fund planned increase** from 1% to 2% in 2026 — call out as near-term fee change.

## Recovery tasks (for B2 if benchmark data can backfill)

- **R-Exhibit-J**: Pull auditor name, opinion type, balance sheet, income statement, cash flow, notes from the prior run benchmark (`runs/ivybrook-academy-2025/`) which used vision OCR. If prior run's 09_final_canonical.json / 12_canonical_enriched_v2.json has these fields, backfill into v2 canonical. If not, flag as persistent U1.

## A4 focused recovery: NOT REQUIRED under verdict 2. Proceed to B1.
