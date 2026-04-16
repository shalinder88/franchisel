# Extraction Scorecard — Extended Stay America Select Suites FDD (637932-2025)

## Document Metrics
| Metric | Value |
|--------|-------|
| PDF Pages | 341 |
| Text Pages Extracted | 341 |
| Render Mode | pdftoppm |
| Text Layer | Available |
| Items Covered | 23/23 (100%) |
| Tables Extracted | 17 |
| Exhibits Cataloged | 11/11 (100%) |
| Retries Executed | 1 (State Addenda) |
| Retries Skipped | 3 |

## Item Coverage Score
| Item | Score | Notes |
|------|-------|-------|
| 1 | 10/10 | Full entity structure, ownership, business description |
| 2 | 10/10 | All executives with history |
| 3 | 10/10 | Pending + prior litigation fully described |
| 4 | 10/10 | None |
| 5 | 10/10 | All initial fees with amounts |
| 6 | 10/10 | Complete fee table (37+ rows) with 5 notes |
| 7 | 10/10 | Both investment tables (new build + conversion) with all notes |
| 8 | 10/10 | Supplier restrictions, sole suppliers, insurance minimums |
| 9 | 9/10 | Cross-reference table; minor: FA section detail not verified |
| 10 | 10/10 | No financing |
| 11 | 10/10 | Full pre/post-opening, computer, training, advertising detail |
| 12 | 10/10 | Non-exclusive territory, all reserved rights |
| 13 | 10/10 | Trademark registrations, license terms |
| 14 | 10/10 | No patents, data ownership |
| 15 | 10/10 | Management Company + GM requirements |
| 16 | 10/10 | All restrictions captured |
| 17 | 10/10 | Complete Item 17 table with all provisions |
| 18 | 10/10 | No public figures |
| 19 | 10/10 | All 4 tables with populations and caveats |
| 20 | 10/10 | All 5 tables with footnotes |
| 21 | 10/10 | Balance sheet, income statement, cash flow, notes |
| 22 | 10/10 | Contract list |
| 23 | 10/10 | Receipt reference |

**Average Item Score: 9.96/10**

## Exhibit Coverage Score
| Exhibit | Score | Notes |
|---------|-------|-------|
| A | 6/10 | Cataloged, key provisions captured via Items; not fully extracted |
| B | 6/10 | Cataloged, key terms captured; not fully extracted |
| C | 10/10 | Both sets of financials fully extracted |
| D | 10/10 | All franchisees captured |
| E | 10/10 | "None" |
| F | 5/10 | TOC only (actual Standards not in FDD) |
| G | 5/10 | Regulatory reference only |
| H | 8/10 | All 12 states identified with material overrides summarized |
| I | 6/10 | Cataloged; key provisions noted from special risks |
| J | 5/10 | Cataloged |
| K | 5/10 | Cataloged; relevance to pending sales noted |

**Average Exhibit Score: 6.9/10**

## Key Extraction Quality Indicators
- All fee amounts verified against source text: YES
- All investment table totals verified: YES
- Item 19 population count confirmed: YES (127 hotels)
- Item 20 system totals cross-checked: YES (211 total)
- Financial statement figures cross-referenced: YES
- State addenda identified and summarized: YES (12 states)
- Unresolveds documented: YES (9 items)
- Contradictions found: NONE

## A2 Depth Pass Results

| Depth Pass | Status | Output File | Key Findings |
|-----------|--------|-------------|--------------|
| 1: Financial Note Depth | COMPLETE | RT_depth_financial_notes.json | 7 accounting policies, 6 material notes. Related party reimbursements $6.6M. |
| 2: Contract Burden Depth | COMPLETE | RT_depth_contract_burdens.json | 14 burden categories. Business judgment deference, punitive damages waiver, class action waiver. |
| 3: Promotion Audit | COMPLETE | RT_depth_promotion_audit.json | 9 facts promoted to canonical. |
| 4: State Addenda Promotion | COMPLETE | RT_depth_state_addenda_promotion.json | 29 overrides across 12 states, 8 override families. |

## Canonical Family Enforcement
- unresolveds: 9 items
- contradictions: 1 item
- state_addenda_overrides: 12 states, 29 overrides
- distinctive_clauses: 5 clauses

## Overall Extraction Grade: A
Full coverage of all 23 Items and material exhibits. One retry + four A2 depth passes completed. 9 facts promoted, 29 state overrides structured. Key limitation is the FDD itself — minimal franchisee performance data (126/127 hotels company-owned), no cost/EBITDA disclosure.
