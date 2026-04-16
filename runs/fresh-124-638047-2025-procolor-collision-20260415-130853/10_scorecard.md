# Extraction Scorecard — ProColor Collision (638047-2025)

## Coverage Summary

| Category | Score | Notes |
|----------|-------|-------|
| Items 1-7 (Front Matter + Economics) | 100% | All items fully extracted with tables and notes |
| Items 8-11 (Operations) | 100% | Supplier restrictions, training, tech, marketing fund fully captured |
| Items 12-16 (Territory + Restrictions) | 100% | Territory, trademarks, noncompete, sales restrictions complete |
| Item 17 (Contract Mechanics) | 100% | All 23 provisions (a-w) extracted |
| Items 18-23 (Back Matter) | 100% | Item 19 = no FPR; Item 20 = 5 tables; Item 21 = 3 fiscal years |
| Exhibits | 99% | All 9 exhibits extracted; Exhibit C recovered via image retry |
| Financial Statements | 100% | 3 fiscal years (2022-2024), balance sheets, income, cash flow, all notes |
| Franchise Agreement | 100% | 29 sections + schedules + Personal Guaranty + state addenda |

## Table Extraction

| Table | Status |
|-------|--------|
| Item 5 (Initial Fees) | Extracted |
| Item 6 (Other Fees) | Extracted (18 fee types + 8 notes) |
| Item 7 (Investment - Conversion) | Extracted |
| Item 7 (Investment - New) | Extracted |
| Item 11 (Training Program) | Extracted |
| Item 11 (Marketing Fund Spending) | Extracted |
| Item 19 (FPR) | N/A — No FPR made |
| Item 20 (5 tables) | All extracted |
| Item 21 (Financial Statements) | 5 financial tables extracted |

## Quality Metrics

| Metric | Value |
|--------|-------|
| Pages read | 183/183 |
| Pages classified | 183/183 |
| Items covered | 23/23 |
| Exhibits covered | 9/9 |
| Tables extracted | 16 |
| Retries executed | 1 (Exhibit C image recovery) |
| Retries skipped | 2 (PII, non-material) |
| Unresolveds | 5 |
| Contradictions | 1 (minor — Item 20 Table 4 year label) |
| Confidence: high | 100% of fields |

## A2 Depth Passes

| Depth Pass | Status | Output |
|-----------|--------|--------|
| 1: Financial Note Depth | COMPLETE | RT_depth_financial_notes.json — all accounting policies, 10 material notes, revenue recognition, lease accounting, related party, subsequent events |
| 2: Contract Burden Depth | COMPLETE | RT_depth_contract_burdens.json — all FA sections, 8 distinctive/unusual clauses, guaranty scope, insurance requirements, termination triggers |
| 3: Promotion Audit | COMPLETE | RT_depth_promotion_audit.json — 9 facts promoted to canonical, 1 already present |
| 4: State Addenda | COMPLETE | RT_depth_state_addenda_promotion.json — 21 overrides across 6 states, 9 override families |

## Canonical Family Enforcement

| Family | Status |
|--------|--------|
| unresolveds | PRESENT — 5 items (all medium/low severity) |
| contradictions | PRESENT — 1 item (low severity, typographic) |
| state_addenda_overrides | PRESENT — 6 states, 21 overrides, summary matrix |

## Verdict

**PASS** — Comprehensive extraction with 99%+ coverage. All 23 items, all exhibits, and all financial statements fully captured. One successful image retry for Exhibit C. No material gaps. Five unresolveds documented, all at medium severity or below. Four depth passes complete with full canonical family enforcement.
