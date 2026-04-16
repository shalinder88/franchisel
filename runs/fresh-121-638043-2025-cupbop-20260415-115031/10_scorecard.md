# Extraction Scorecard — Cupbop Franchise, LLC (638043-2025)

## Coverage Metrics

| Metric | Value |
|--------|-------|
| Items extracted (of 23) | 23/23 (100%) |
| Exhibits cataloged (of 9) | 9/9 (100%) |
| Tables extracted | 17 |
| Pages read | 202/202 (100%) |
| Retry tasks identified | 2 |
| Retries executed | 1 (R1: financial OCR fix) |
| Retries skipped | 1 (R2: immaterial discrepancy in FDD text) |

## Confidence Assessment

| Section | Confidence | Notes |
|---------|-----------|-------|
| Document Identity | HIGH | All fields confirmed from cover and Item 1 |
| Fee Stack | HIGH | All 25+ fees extracted with notes |
| Initial Investment | HIGH | Both tables complete |
| Supplier Control | HIGH | Proprietary product requirements documented |
| Training | HIGH | Full program table with hours and locations |
| Territory | HIGH | Protected territory with all carve-outs documented |
| Contract Terms | HIGH | Complete Item 17 table (a-x) |
| Item 19 FPR | HIGH | All 3 tables with quartile data; revenue-only limitation noted |
| Item 20 Outlets | HIGH | All 5 tables with 3-year data; off-by-one noted |
| Financial Statements | HIGH | 3 years audited; SG&A corrected via R1 |
| State Addenda | HIGH | 9 states with addenda in Exhibit G + Michigan state cover page |

## Key Risk Flags

1. **Franchisor entity thinly capitalized:** Member's equity $21,352 after $1.9M distributions on $1.03M net income
2. **Revenue gap:** Franchise units average 17% lower revenue than company-owned ($658K vs $794K)
3. **Growth decelerating:** Net +5 in 2024 vs. +9 in 2023 vs. +16 in 2022
4. **Encroachment exposure:** Non-Traditional Venues + online delivery carve-outs erode protected territory
5. **Confidentiality clauses:** Limit franchisee due diligence capability
6. **Nevada closures:** 3 of 5 franchised units ceased operations in 2024 — no explanation
7. **Ad fund transparency:** 40% administrative spend, no independent audit

## Final Verdict

**EXTRACTION: COMPLETE — HIGH CONFIDENCE**

All 23 items, 9 exhibits, and 17 material tables extracted. One targeted retry executed (OCR correction). Coverage is comprehensive. The revenue-only nature of Item 19 and the confidentiality clause limiting franchisee contact are the primary limitations for prospective franchisee diligence, but these are FDD content limitations, not extraction gaps.

## A2 Depth Pass Results

| Depth Pass | Status | Output File |
|-----------|--------|-------------|
| DP1: Financial Note Depth | COMPLETE | RT_depth_financial_notes.json |
| DP2: Contract Burden Depth | COMPLETE | RT_depth_contract_burdens.json |
| DP3: Narrative-to-Canonical Promotion | COMPLETE | RT_depth_promotion_audit.json (10 facts promoted) |
| DP4: State Addenda Structured Promotion | COMPLETE | RT_depth_state_addenda_promotion.json (33 overrides across 9 states) |

### Canonical Family Enforcement
- `unresolveds`: 6 entries (1 high, 2 medium, 3 low)
- `contradictions`: 3 entries (1 resolved, 2 noted)
- `state_addenda_overrides`: 9 states with structured overrides across 10 override families
