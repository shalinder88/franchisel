# 10 Scorecard — Cupbop 2025 (test run)

## Per-item coverage (23 items)
| Item | Surfaced | Tables captured | Notes captured |
|---|---|---|---|
| 1 | Y | n/a | Y |
| 2 | Y | n/a | Y |
| 3 | Y | n/a | Y |
| 4 | Y | n/a | Y |
| 5 | Y | n/a | Y |
| 6 | Y | 26-row fee table | 14 notes |
| 7 | Y | 16-row investment table + ADA table | 15 notes |
| 8 | Y | n/a | Insurance limits, supplier process, parent-supplied items |
| 9 | Y | 24-obligation cross-walk | n/a |
| 10 | Y | n/a | None offered |
| 11 | Y | Training hours table (115.5h total) | Marketing fund spend split, POS costs |
| 12 | Y | n/a | Sales-performance kill-switch, channels reserved |
| 13 | Y | Trademarks table | License from parent |
| 14 | Y | n/a | n/a |
| 15 | Y | n/a | n/a |
| 16 | Y | n/a | n/a |
| 17 | Y | Relationship cross-walk (24 provisions) | Curable/noncurable defaults; non-compete 2yr/20mi |
| 18 | Y | n/a | None used |
| 19 | Y | 3 tables (n=26, 24, 50) | Quartile bands; bias caveats |
| 20 | Y | 5 tables | Confidentiality clause; concentration to Gold Bowl LLC |
| 21 | Y | Balance sheet, income statement, cash flow, member equity | Forvis Mazars unqualified; equity collapse flagged |
| 22 | Y | FA + ADA exhibit list | Anti-disclaimer language |
| 23 | Y | n/a | Receipt form |

**Items with full coverage: 23 / 23**
**Tables captured: 16**
**Exhibits cataloged: 9 (A through I)**

## Coverage gates
| Gate | Status | Evidence |
|---|---|---|
| Item 5 fee anchors | PASS | $40K initial, $30K subsequent, ADA fee schedule |
| Item 6 fee table complete | PASS | All 26 fee categories with notes |
| Item 7 totals reconcile | PASS | $296,400–$664,400 totals match line-item sum |
| Item 19 every chart with n/avg/median | PASS | Tables 1, 2, 3 each with n + avg + median + high + low + bands |
| Item 19 caveats | PASS | Sample exclusions and Gross-Revenues-only flagged |
| Item 20 multi-year trajectory | PASS | 3 years FY2022–FY2024 |
| Item 20 transfers + status by state | PASS | Tables 2, 3, 4 captured |
| Item 21 auditor + opinion | PASS | Forvis Mazars LLP unqualified |
| Item 21 BS + IS + CF | PASS | All three statements + member equity |
| Item 22 contracts list | PASS | FA + ADA + sub-exhibits |
| Item 23 receipts | PASS | Exhibit I |

## Quality flags / risk markers
- **Equity collapse 97.6% YoY** — distributions $1,896,607 vs net income $1,025,658 (185% payout)
- **Marketing fund 40% admin** — high vs casual-dining benchmarks
- **Sales performance 50% rule** — 2-year window default trigger
- **20-mile post-term non-compete from any Cupbop** — broader than typical (typical is from your own location)
- **All state registrations PENDING at issuance** — not actually effective for sale yet in any registration state
- **Concentration risk** — Gold Bowl LLC (Kevin Santiago, also a director) operates ~26 of 30 franchised units
- **3 Las Vegas Gold Bowl closures in 2024** — first closures in 3-year history

## Numeric scorecard (informational, not gate)
| Dimension | Score |
|---|---|
| Item coverage (23/23) | 100% |
| Mandatory tables captured | 16 / 16 |
| Auditor identified + opinion | Y |
| FPR captured at chart granularity | Y |
| Litigation/bankruptcy resolved | Y / Y |
| State addenda enumerated | 9 / 9 |
| Provenance present on canonical fields | Y |

## A2 Depth Pass results
| Pass | Output | Status |
|---|---|---|
| 1 — Financial notes | RT_depth_financial_notes.json | Done — 4 notes structured (Nature/Policies, Related Party, Revenue, Subsequent Events) |
| 2 — Contract burdens | RT_depth_contract_burdens.json | Done — Item 17 cross-walk + Guaranty exhibit; FA full clause walk deferred (test run) |
| 3 — Promotion audit | RT_depth_promotion_audit.json | Done — 13 facts promoted to canonical |
| 4 — State addenda | RT_depth_state_addenda_promotion.json | Partial — CA/MN/NY/WA clause-extracted; IL/MD/ND/RI/VA enumerated only |

## Mandatory canonical families
| Family | Status | Count |
|---|---|---|
| unresolveds | PRESENT | 9 |
| contradictions | PRESENT | 0 |
| state_addenda_overrides | PRESENT | 9 states (4 clause-extracted, 5 enumerated only) |
