# Scorecard — McDonald's USA, LLC (638437-2025)

## Extraction Metrics

| Metric | Value |
|--------|-------|
| PDF pages | 389 |
| Pages classified | 389 (100%) |
| Items covered | 23/23 (100%) |
| Exhibits cataloged | 20/20 (100%) |
| Tables extracted | 12 (Item 6, 7, 19x2, 20x5, 21x2) |
| Financial statement years | 3 (2022-2024) |
| Note families walked | 14/14 (100%) |
| State addenda | 5 (CA, MD, MN, ND, WA) |
| Leadership roster entries | 37 |
| Pending litigation cases | 8 |
| Concluded litigation cases | 12 |
| Contradictions identified | 1 (low severity) |
| Retry tasks | 0 executed / 5 reviewed |
| Gag clause | Yes |

## Key Brand Metrics

| Metric | Value |
|--------|-------|
| Total outlets (end 2024) | 13,559 |
| Franchised outlets | 12,887 (95%) |
| Company-owned outlets | 672 (5%) |
| Net growth 2024 | +102 |
| Average sales (all traditional) | $4,002,000 |
| Median sales (all traditional) | $3,838,000 |
| Average sales (franchised) | $3,966,000 |
| Initial investment range | $1,471,000-$2,728,000 |
| Franchise fee | $45,000 |
| Royalty rate | 4-5% |
| Term | 20 years (traditional) |
| Total franchisor revenue | $10.63B |
| Net income | $3.46B |
| Total assets | $22.2B |

## A2 Depth Pass Results

| Depth Pass | Files Written | Key Findings |
|------------|--------------|--------------|
| 1. Financial note depth | RT_depth_financial_notes.json, RT_depth_item21_notes.json | All 14 note families confirmed. Item 21 method: normal text extraction. |
| 2. Contract burden depth | RT_depth_contract_burdens.json | Exhibit B (Traditional FA) fully clause-walked: 28 sections, all operative burdens extracted. |
| 3. Narrative-to-canonical promotion | RT_depth_promotion_audit.json | 8 facts promoted (delinquency interest, immediate possession, operating hours, insurance minimums, political activity carveout, reporting detail, severability termination right, cost of enforcement). |
| 4. State addenda promotion | RT_depth_state_addenda_promotion.json | 12 structured overrides across 5 states. Summary table of 11 override families. |
| Item 19 cohort comparability | RT_depth_item19_cohort_comparability.json | HIGH severity: Pro forma uses 4% royalty but new franchisees pay 5%. 100bp gap = ~$40K/year overstatement at average sales. |
| Item 20 completion | RT_depth_item20_tables.json | All 5 tables fully extracted in A1. No additional work needed. |
| Key exhibit clause walk | RT_depth_key_exhibits.json | Exhibit B fully walked. Exhibits C, D, G, N deferred with rationale. |
| Thin item thickening | RT_depth_thin_items.json | No thin items found; all items at operative depth from A1. |

**Item 21 method**: normal text extraction
**Deferred exhibits**: C (Satellite FA), D (Walmart FA), G (Operator's Lease), N (Loan Documents) — all with explicit deferral rationale and cross-reference recovery documentation.
**Contradictions**: 2 total — (1) outlet count discrepancy (low), (2) Item 19 cohort comparability warning (high)

## Coverage Quality Assessment
- **Items 1-23**: All fully extracted with operative detail
- **Item 6**: Complete multi-page fee table (7 pages, 31 rows, 12 footnotes)
- **Item 19**: Full FPR with 3 population tiers and 3 pro forma levels
- **Item 20**: All 5 tables with state-level detail and footer totals
- **Item 21**: All 4 financial statements + 14 note families walked
- **Exhibits**: Financial statements fully extracted; key franchise agreement provisions surfaced via Item 17
- **State addenda**: All 5 states extracted
