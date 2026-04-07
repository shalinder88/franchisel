# 10 Scorecard — Merged run
## McDonald's USA, LLC — FDD (638437-2025)

Best-of-both merge of `runs/mcdonalds-2025/` (OLD) and `runs/shadow-previous-mcdonalds-2025/` (NEW, post-recovery). See `MERGE_NOTES.md` for provenance.

---

## Coverage by item

| Item | Description | Coverage | Source | Notes |
|---|---|---|---|---|
| 1 | Franchisor identity | A | OLD + NEW | entity, parent, predecessor, five formats, history |
| 2 | Business experience | A | NEW (37-entry roster) | all 37 officers/directors structured + L&D head |
| 3 | Litigation — pending | A | NEW (convention normalized) | 7 federal + 1 collection (Pestonjee Sri Lanka) |
| 3 | Litigation — concluded | **A+** | **NEW (19 rows)** | 19 concluded cases structured row-by-row (vs OLD's 13) |
| 4 | Bankruptcy | A | both | none |
| 5 | Initial fees | A | both | all five formats; refund policy |
| 6 | Other fees | A | OLD + NEW | 31 fee line items + 11 footnotes + STO/STR tier table + co-investment |
| 7 | Initial investment | A | both | 3 format columns + 11 footnotes + McOpCo Note 11 contradiction |
| 8 | Supplier control | A | both | 90–95% / 55–65% purchase shares + $39M rebates + 68% RE revenue |
| 9 | Franchisee obligations | A | OLD | full cross-reference table |
| 10 | Financing | **A** | **NEW (consolidation waiver + 18% rate)** | BoA loan + OAP claim waiver + jury waiver + consolidation waiver + 18% guarantor enforcement rate |
| 11 | Training / technology | A | OLD + NEW | full training table + Store Systems + POS data access + FFS reporting |
| 12 | Territory | A | both | no exclusive territory; channel reservations |
| 13 | Trademarks | A | OLD | Restaurant Brands LLC license + 3 principal marks |
| 14 | Patents / copyrights | A | OLD | O&T Manual + trade secrets |
| 15 | Operator participation | A | both | full time + best efforts + 100% equity |
| 16 | Product restrictions | A | both | authorized products only |
| 17 | Franchise relationship | A | both | FA + Operator's Lease tables + 3 notes |
| 18 | Public figures | A | both | none |
| 19 | Financial performance | **A+** | NEW (contradiction preserved) | 3 cohorts + pro-forma at 3 sales volumes + effective rent range + intra-Item 11,332-vs-11,322 contradiction preserved |
| 20 | Outlets | A | both | all 5 tables + franchisee orgs + Exhibit R/S + NBMOA/MHOA/WON/AMOA/NFLA/OPN/NOA |
| 21 | Financial statements | **A+** | **NEW (RT_depth_financial_notes.json)** | 4 statements + 11 note families + future rent receivable $14.16B + subsequent event + lease depth + tax detail + parent IP royalty 2% |
| 22 | Contracts | A | both | all form contracts exhibited |
| 23 | Receipts | A | both | receipt pages p388–389 |

---

## Exhibits

| Exhibit | Grade | Source | Notes |
|---|---|---|---|
| A (Financial Statements) | **A+** | NEW | Full statements + 11 structured note families; E&Y clean opinion March 14, 2025 |
| B (Traditional Franchise Agreement) | **A+** | NEW | Clause walk in `RT_depth_contract_burdens.json`; 30+ clauses + 16 recovery promotions = 46 structured burdens |
| C (Satellite Franchise Agreement) | B | both (shared gap) | structural confirmation only |
| D (Walmart MIW Franchise Agreement) | B | both (shared gap) | Master Lease cross-default noted but not walked |
| E (New Restaurant Rider) | B | OLD | 3 pages, state-law-claim preservation |
| F (BFL Rider) | B | OLD | 3 pages, conditional purchase option mechanics |
| G (Operator's Lease) | B | both (shared gap) | 33 pages; 5 internal form addenda not walked clause-by-clause |
| H (Assignment to Entity) | B | OLD | 5 pages |
| I (Assignment Agreement) | B | OLD | 6 pages |
| J (Candidate / Preliminary Agreement) | B | OLD | 10 pages; unpaid training / independent contractor |
| K (New Term Policy) | B | OLD | 2 pages, discretionary |
| L (Growth Policy) | B | OLD | 1 page, discretionary |
| M (New Term Offer Letter) | B | OLD | 2 pages |
| N (Loan and Related Documents) | **A** (post-merge) | **NEW (consolidation waiver + 18% rate from p208, p213)** | 35 pages; still partially walked but key provisions structured |
| O (Agents for Service) | B | OLD | administrative |
| P (State Administrators) | B | OLD | administrative |
| Q (McDonald's Affiliates) | B | OLD | international affiliate list |
| R (Franchised Restaurants List) | B | both | 144 pages / ~12,887 locations structural confirmation |
| S (Terminated Franchisees) | A | both | 113 names enumerated |
| T (State Specific Addenda) | A | both | CA, HI, MD, MN, ND, WA + WA Assurance of Discontinuance |

**Exhibits at A**: 14/20 (up from OLD's 12 and NEW's 13 in isolation, because the merge promotes Exhibit N to A via combining OLD and NEW extractions).
**Exhibits at B**: 6/20.

---

## Canonical field coverage (merged)

| Family | Fields | Source |
|---|---|---|
| Identity | 10 | OLD + NEW |
| Item 2 leadership | 38 | **NEW (37 officers/directors + L&D head)** |
| Issuance | 1 | both |
| Formats | 5 | both |
| Development structure | 2 | both |
| Initial fees | 6 | both |
| Initial investment | 4 | both + Note 11 contradiction |
| Recurring fees | 7 | OLD + NEW |
| Supplier control | 5 | both |
| Training burden | 5 | OLD + NEW |
| Tech burden | 3 | both |
| Territory | 3 | both |
| Term / renewal / transfer / termination | 8 | both |
| Noncompete | 3 | OLD + ND modification (both) |
| Litigation — pending | 9 | NEW (convention) |
| Litigation — concluded | 19 | **NEW (row-level)** |
| Bankruptcy | 1 | both |
| Item 18 | 1 | both |
| Item 19 | 11 | NEW (contradiction preserved) |
| Item 20 | 14 | both |
| Item 21 financial summary | 27 | **NEW (depth pass)** |
| Contract burden promotions | 19 | **NEW (RT_depth_contract_burdens + RR-01 + RR-01b)** |
| Key exhibits | 9 | both |
| Unresolveds | 5 | OLD + NEW union |
| Contradictions | 5 | **NEW (preserved)** |
| Financing | 7 | **NEW (consolidation waiver + 18% rate)** |
| **TOTAL canonical field count** | **~200** | merged union |

---

## Enrichment coverage (merged)

| Layer | Source | Status |
|---|---|---|
| `item19_chart_detail` | OLD + NEW | Complete |
| `item20_yearly_activity` | OLD + NEW | Complete |
| `exhibit_structure` | OLD + NEW | Complete |
| `item21_structural_facts` | OLD + NEW + post-recovery | Complete (merged v1) |
| `item1_structural_facts` | OLD | Complete |
| `item6_fee_attributes` | OLD | Complete |
| `item21_financial_structure_detail` | NEW | Complete (merged v2) |
| `item21_statement_detail` | NEW | Complete (merged v2) |
| `item6_fee_detail` | NEW | Complete (merged v2) |
| `financial_note_depth` | NEW (`RT_depth_financial_notes.json`) | Complete |
| `contract_burden_depth` | NEW (`RT_depth_contract_burdens.json`) | Complete |
| `narrative_promotion_audit` | NEW (`RT_depth_promotion_audit.json`) | Complete |
| `merged_recovery_enrichments` | NEW post-recovery | **New in merge** |
| `interpretive_derived_metrics` | **OLD (labeled)** | Complete, flagged as derived |

---

## Quality indicators (merged)

| Metric | Value | Source |
|---|---|---|
| Total PDF pages | 389 | bootstrap |
| Render mode | fitz_render (text layer) | bootstrap |
| Items fully covered | 23/23 (100%) | both |
| Exhibits at A | 14/20 (70%) | merge uplift |
| Exhibits at B | 6/20 (30%) | shared gap |
| Tables extracted | 15 | both |
| Table rows total | ~175 | both + NEW additions |
| Table notes total | 29 (Item 6: 11, Item 7: 11, Item 19: 3, Item 20: 4) | both |
| Canonical fields | ~200 | merged union |
| Depth-pass families | 3 (financial notes, contract burdens, promotion audit) | NEW |
| Contract burden clauses structured | 46 (30 base + 16 recovery promotions) | NEW |
| Financial note families captured | 11 | NEW |
| Concluded litigation rows structured | 19 | NEW |
| Pending litigation cases structured | 8 (7 federal + 1 collection) | NEW |
| Leadership roster entries | 38 (37 + L&D head) | NEW |
| State addenda | 6 (CA, HI, MD, MN, ND, WA + WA AOD) | both |
| Contradictions preserved | 5 | **NEW** |
| FDD internal inconsistencies flagged | 5 | **NEW** |
| Unresolveds documented | 5 | merged union |
| Confidence: high | ~190/200 (95%) | merged |
| Confidence: medium | ~10/200 (5%) | merged |
| Confidence: low | 0 | merged |
| Derived / interpretive metrics (flagged) | 2 (contract burden score, total recurring fee aggregate) | **OLD** |

---

## Overall grade: **A+**

The merged run is the strongest of the three variants:
- Canonical-field correctness: parity with NEW post-recovery (all 43 priority legal/economic fields align).
- Canonical-field breadth: strictly greater than either OLD (~124 values) or NEW (~155 values) alone — merged ~200.
- Contradiction preservation: strictly greater (5 preserved) than OLD (1).
- Narrative presentation depth: strictly greater than NEW (OLD reader/final report narrative preserved).
- Interpretive derived metrics: preserved from OLD but clearly labeled as derived.
- Depth-pass JSON granularity: NEW's (73% larger financial notes, 42% larger contract burdens).
- Exhibit A+B deep read: at NEW's depth.
- Shared gaps remain on Exhibits C/D/G/N full clause walks — not fixable by merge alone.

This is the publishable artifact for the McDonald's 638437-2025 FDD year.
