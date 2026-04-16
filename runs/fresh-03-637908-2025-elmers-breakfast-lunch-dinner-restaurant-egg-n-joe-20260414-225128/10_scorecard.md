# Extraction Scorecard — We Are Crackin' LLC (637908-2025)

## Overall Grade: A-

## Item Coverage

| Item | Coverage | Grade | Notes |
|------|----------|-------|-------|
| 1 | Full | A | Entity structure, parent, affiliates, history, financial requirements |
| 2 | Full | A | 9 personnel |
| 3 | Full | A | None |
| 4 | Full | A | None |
| 5 | Full | A | All fees with amounts and refundability |
| 6 | Full | A | 20 fee categories + 4 notes |
| 7 | Full | A | 3 investment tables + 16 notes |
| 8 | Full | A | Supplier restrictions, rebates, insurance requirements |
| 9 | Full | A | Cross-reference table |
| 10 | Full | A | No financing |
| 11 | Full | A | Pre-opening, ongoing, BPF, training, computer |
| 12 | Full | A | ADA and FA territory provisions |
| 13 | Full | A | 14 marks + 1 pending |
| 14 | Full | A | No patents, 3 copyrights |
| 15 | Full | A | Managing Owner, Designated Managers, guaranty |
| 16 | Full | A | Product restrictions, pricing |
| 17 | Full | A | All provisions extracted |
| 18 | Full | A | None |
| 19 | Full | A | All 3 parts, all units, both years |
| 20 | Full | A | 15 tables, franchisee lists, gag clause |
| 21 | Full | A | All statements + 5 notes via pdftoppm |
| 22 | Full | A | Contracts list |
| 23 | Full | A | Receipt reference |

## Exhibit Coverage

| Exhibit | Status | Grade |
|---------|--------|-------|
| A–D | Cataloged | B |
| E–F | Full extraction | A |
| G | Full extraction (pdftoppm) | A |
| H | Cataloged | B |
| I–J | Cataloged | B |
| K | Full extraction | A |
| L | Cataloged | B |

## Key Metrics

| Metric | Value |
|--------|-------|
| Items fully covered | 23/23 |
| Tables extracted | 15 |
| Exhibits deep-read | 5 (E, F, G, K + partial others) |
| Unresolveds identified | 8 |
| Contradictions | 0 |
| Retries executed | 2 (financial notes, state addenda) |
| Pages read | 240/240 |
| Render mode | pdftoppm (financial statements) |

## Depth Pass Results (A2)

| Depth Pass | Output File | Items Extracted |
|------------|-------------|-----------------|
| Financial Notes | RT_depth_financial_notes.json | 5 notes, 14 sub-topics |
| Contract Burdens | RT_depth_contract_burdens.json | 13 categories, 25 provisions |
| Narrative-to-Canonical Promotion | RT_depth_promotion_audit.json | 10 facts promoted |
| State Addenda Structured | RT_depth_state_addenda_promotion.json | 16 overrides across 4 states |

## Deductions
- Minor deduction for Exhibits B, C, H, I, J not clause-by-clause extracted (deferred to A2 depth pass)
- Financial statement text layer required pdftoppm fallback — all data successfully recovered

## Confidence Assessment
- Document identity: HIGH
- Fee and investment data: HIGH
- Item 19 data: HIGH
- Item 20 data: HIGH
- Item 21 data: HIGH (recovered via image rendering)
- State addenda: HIGH
- Unresolveds: HIGH (all genuine business-risk flags)
