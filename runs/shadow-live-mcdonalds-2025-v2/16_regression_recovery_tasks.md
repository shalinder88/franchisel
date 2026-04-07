# Regression Recovery Tasks — shadow-live-mcdonalds-2025-v2

Generated from `15_regression_check.md`. All three tasks are **ADDITIONS** (no conflict adjudication needed); B3 is SKIPPED.

## Task RR-1 — Add unresolved: BoA guarantee program disclosure gap

**Type:** add new entry to `unresolveds` family

**Content to add:**
```json
{
  "id": "U-06",
  "description": "BoA guarantee-program loan loss/default rates and franchisee uptake of the BoA loan program are not disclosed in the FDD. Item 10 describes terms and pricing but provides no visibility into the realized default or utilization experience of franchisees using the program.",
  "severity": "low",
  "source": "Item 10 (page 30) — descriptive only; no performance metrics disclosed",
  "carried_forward_from": "runs/mcdonalds-2025-merged unresolveds U-4"
}
```

**Patch targets:** `09_final_canonical.json` (unresolveds array), `12_canonical_enriched_v2.json` (unresolveds array)

## Task RR-2 — Promote royalty-mismatch to contradiction family

**Type:** add new entry to `contradictions` family

**Content to add:**
```json
{
  "id": "C-05",
  "description": "Item 19 pro forma is derived from a restaurant cohort whose royalty during the covered period was 4% of Gross Sales. However, as of January 1, 2024, new restaurants, McOpCo-sale purchases, and franchisor ROFR resales pay 5%. The pro forma therefore understates the royalty burden for new franchisees by 1 percentage point of Gross Sales. At the $3.4M sales band, this is ~$34,000 less OIBO than the table presents for any new-franchise buyer.",
  "items_involved": [6, 19],
  "resolution_status": "flagged_disclosed_in_source",
  "carried_forward_from": "runs/mcdonalds-2025-merged contradictions C-4"
}
```

**Patch targets:** `09_final_canonical.json` (contradictions array), `12_canonical_enriched_v2.json` (contradictions array)

## Task RR-3 — Add contradiction: Item 20 vs Exhibit A year-end 2024 franchised count

**Type:** add new entry to `contradictions` family

**Content to add:**
```json
{
  "id": "C-06",
  "description": "Item 20 Table 1 reports 12,887 franchised outlets at year-end 2024. Exhibit A Nature of Business note reports 12,886 franchised outlets at year-end 2024. One-outlet gap. Both sources are from the same filing. Not material to any economic conclusion.",
  "items_involved": [20, 21],
  "resolution_status": "flagged_immaterial",
  "carried_forward_from": "runs/mcdonalds-2025-merged contradictions C-2"
}
```

**Patch targets:** `09_final_canonical.json` (contradictions array), `12_canonical_enriched_v2.json` (contradictions array)

## Summary

| Task | Type | Target | Priority |
|---|---|---|---|
| RR-1 | add unresolved U-06 | 09, 12 | LOW |
| RR-2 | add contradiction C-05 | 09, 12 | MEDIUM |
| RR-3 | add contradiction C-06 | 09, 12 | LOW |

**B3 conflict adjudication:** NOT REQUIRED. All three recoveries are additions; neither the prior run nor the new run disagrees on any factual value. The regressions are purely about surfacing structure.

## B4 execution

The three patches below will be applied directly to the canonical files.
