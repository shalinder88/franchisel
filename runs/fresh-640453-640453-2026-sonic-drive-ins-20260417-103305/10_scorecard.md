# Extraction Scorecard: Sonic Franchising LLC (640453-2026)

## Summary Metrics

| Metric | Value |
|--------|-------|
| Filing ID | 640453 |
| Brand | Sonic Drive-In |
| Franchisor | Sonic Franchising LLC |
| PDF Pages | 366 |
| Issuance Date | March 26, 2026 |
| Fiscal Year End | December 28, 2025 |
| Items Extracted | 23/23 |
| Tables Extracted | 12 |
| Exhibits Cataloged | 19 |
| Retries Executed | 3 (R2, R3, R4 deferred to A2) |
| Canonical Top-Level Keys | 42+ |
| Unresolveds | 4 |
| Contradictions | 0 (1 checked, reconciled) |

## Key Brand Metrics

| Metric | Value |
|--------|-------|
| System Size (End 2025) | 3,412 total (3,120 franchised, 292 company-owned) |
| Net Change (3-Year) | (134) — system shrinking |
| Average AUV (2025) | $1,552,145 |
| Median AUV (2025) | $1,465,090 |
| Q4 Average AUV | $919,629 |
| Lowest AUV | $225,308 |
| Investment Range (Traditional) | $1,485,200–$2,522,900 |
| Royalty | 5% of Gross Sales (incentives: 1%-2.5% early years) |
| Total Fee Burden | 9.15%–10.90% of Gross Sales |
| Term | 10 years + 2 renewals of 10 years |
| Noncompete | 18 months / 3 miles post-term |
| Gag Clause | YES |
| Franchise Fee | $15,000 (Traditional) |
| Renewal Fee | $15,000 |
| Materially Different Terms at Renewal | YES |
| Auditor | KPMG LLP — unqualified |
| Franchisor Net Income | $2,820K (declining from $8,056K in 2023) |
| SIS Total Debt | $1,402,563K |

## A2 Depth Pass Results

| Pass | Files Written | Key Findings |
|------|--------------|-------------|
| Depth Pass 1: Financial Notes | RT_depth_financial_notes.json | All note families for both entities walked; no image fallback needed |
| Depth Pass 2: Contract Burdens | RT_depth_contract_burdens.json | 38 clauses extracted from 48-page FA; distinctive clauses identified |
| Depth Pass 3: Promotion Audit | RT_depth_promotion_audit.json | 10 facts promoted from reader report to canonical |
| Depth Pass 4: State Addenda | RT_depth_state_addenda_promotion.json | 15 overrides across 7 states structured |
| Item 19 Cohort Comparability | RT_depth_item19_cohort_comparability.json | No discrepancy — both cohort and new franchisees at 5% royalty |
| Item 20 Completion | RT_depth_item20_tables.json | All 5 tables confirmed complete with footer totals |
| Key Exhibits | RT_depth_key_exhibits.json | FA fully walked; 5 exhibits deferred with rationale |
| Item 21 Method | normal_text_extraction | Full text layer on all financial statement pages |

### Deferred Exhibits
- B-2 Non-Traditional Rider (5 pages) — 0.3% of system; key terms from FDD body
- B-3 Incentives Addendum (6 pages) — all terms fully in Item 6
- B-4 Multi-Brand Addendum (6 pages) — 1 location in system; key terms from FDD body
- C-1 Development Agreement (14 pages) — key terms from Items 12/17
- H General Release (5 pages) — standard form; MD exemption noted

## Extraction Quality

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Completeness | A | All 23 items, all tables, both financial statement sets, FA clause walk |
| Depth | A | Deep extraction on all items; FA fully walked in A2; all notes walked |
| Accuracy | High | All figures verified against source pages |
| Structure | A | 42+ canonical keys, decomposed per rules |
| Output Volume | Strong | 25+ output files including all RT depth files |

Item 21 method: normal text extraction.
Item 19 cohort comparability: no discrepancy found.

## Verdict

**PASS — Ready for A3 publish gate.** Full extraction with depth passes complete. FA clause-walked, financial notes walked, state addenda structured, contract burdens extracted.
