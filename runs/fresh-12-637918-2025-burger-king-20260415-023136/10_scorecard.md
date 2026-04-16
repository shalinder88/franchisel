# Extraction Scorecard: Burger King FDD (637918-2025)

## Coverage Summary

| Category | Score | Notes |
|----------|-------|-------|
| Items 1-23 Body Text | 23/23 | All items fully read and extracted |
| Fee Tables (Items 5, 6, 7) | COMPLETE | 35+ fees, 6 facility types, all footnotes |
| Item 19 Financial Performance | COMPLETE | 6 sales distributions, 5 remodel uplift tables, multi-year |
| Item 20 Outlet Data | COMPLETE | Tables 1-5, all 50 states, projected openings |
| Item 17 Contract Mechanics | COMPLETE | 5 agreement types fully tabled |
| Item 21 Financial Statements | COMPLETE | Balance sheet, income statement, cash flows, auditor |
| Exhibits Catalogued | 54/54 | All exhibits A-Z catalogued with priorities |
| Tables Extracted | 16 | All material tables as JSON objects |
| Retries Executed | 1/3 | R1 (financials) executed; R2, R3 skipped |

## Key Metrics

| Metric | Value |
|--------|-------|
| US System Size | 6,701 restaurants |
| Franchise Fee | $50,000 |
| Royalty | 4.5% |
| Advertising | 4.5% |
| Traditional Investment | $2.05M - $4.71M |
| Traditional Avg Sales | $1,671,613 |
| Traditional Median Sales | $1,579,183 |
| Term | 20 years |
| Exclusive Territory | No |
| Renewal Right | No (successor option only) |

## Confidence Assessment

| Area | Confidence | Reason |
|------|-----------|--------|
| Identity & Structure | HIGH | Direct from Items 1-2, clear text |
| Fee Stack | HIGH | Complete table with all footnotes |
| Investment | HIGH | All 6 facility types extracted |
| Item 19 | HIGH | All sales distributions and uplift tables |
| Item 20 | HIGH | All 5 tables extracted |
| Item 21 | HIGH | Full financial statements via retry |
| Contract Terms | HIGH | All 5 agreement types via Item 17 |
| Exhibits | MEDIUM | Catalogued but not all individually read |
| State Addenda | MEDIUM | MI, MN, WA extracted; 11 others catalogued only |

## A2 Depth Passes

| Depth Pass | Status | Output | Items |
|------------|--------|--------|-------|
| 1: Financial Notes | COMPLETE | RT_depth_financial_notes.json | Revenue recognition, depreciation, impairment, tax, leases, Carrols, debt, SBC |
| 2: Contract Burdens | COMPLETE | RT_depth_contract_burdens.json | All FA clauses extracted |
| 3: Promotion Audit | COMPLETE | RT_depth_promotion_audit.json | 10 facts promoted |
| 4: State Addenda | COMPLETE | RT_depth_state_addenda_promotion.json | 15 overrides, 3 states, 11 families |

## Canonical Families Enforced
- unresolveds: 10 entries
- contradictions: 4 entries
- state_addenda_overrides: 15 overrides across MI, MN, WA

## Verdict: PASS — Full Extraction (A1 + A2)
All 23 items extracted. 1 retry + 4 depth passes completed. Canonical families enforced.
