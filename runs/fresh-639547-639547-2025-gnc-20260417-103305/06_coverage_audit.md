# Coverage Audit — 639547-2025-GNC

## Item-by-Item Coverage Assessment

| Item | Status | Notes |
|---|---|---|
| 1 | covered-complete | Entity structure, parents, predecessors, franchise concept, competition, regulations fully extracted |
| 2 | covered-complete | All 11 officers/directors with roles and tenure |
| 3 | covered-complete | 3 pending, 4 predecessor pending, 12+ prior actions, 3 governmental actions, no actions against franchisees in 2024 |
| 4 | covered-complete | Predecessor Ch.11, GNC Ireland, Conn's disclosure |
| 5 | covered-complete | All fee tiers, ADA fees, security deposit, VetFran, refund policy |
| 6 | covered-complete | All 27 fee categories extracted with amounts, timing, and notes |
| 7 | covered-complete | Both investment tables (single unit + ADA) with all components and notes; lease cost table |
| 8 | covered-complete | 95%/100% required purchases, supplier approval, revenue from required purchases |
| 9 | covered-complete | Full obligation table (a-z) |
| 10 | covered-complete | No direct financing, revolving credit, security interest, guarantee, confession of judgment |
| 11 | covered-complete | 3-phase training, advertising fund breakdown, technology requirements, manual (419 pages), site selection |
| 12 | covered-complete | Territory sizing, protective period, ROFR, extensive reservation of rights, Rite Aid agreement |
| 13 | covered-complete | Principal marks, registration, no infringement |
| 14 | covered-complete | No patents/copyrights, confidentiality obligations |
| 15 | covered-complete | Supervision requirements, personal guarantee |
| 16 | covered-complete | Product restrictions, no alternative distribution, min/max pricing |
| 17 | covered-complete | Full FA and ADA tables (a-x); term, renewal, termination, transfer, noncompete, dispute resolution, liquidated damages |
| 18 | covered-complete | No public figures |
| 19 | covered-complete | Single FPR table fully extracted; all caveats |
| 20 | covered-complete | All 5 standard tables extracted with state-level detail and footer totals; gag clause flag; franchisee list info |
| 21 | partial | Auditor, opinion, statement headlines extracted. Financial statement notes (pp. 462-489) deferred to A2. |
| 22 | covered-complete | All 7 contracts listed |
| 23 | covered-complete | Receipts |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---|---|---|
| D (State Addenda) | partial | 12 states identified. Per-state structured overrides deferred to A2. |
| E (Franchise Agreement) | partial | Key terms via Item 17 chart. Direct 107-page clause walk deferred to A2. |
| F (Area Development Agreement) | partial | Key terms via Item 17 chart. Direct 76-page clause walk deferred to A2. |
| G (Product Sales Agreement) | labeled_only | Key terms referenced in Items 8, 10, 17. Direct walk deferred to A2. |
| H (Asset Purchase Agreement) | labeled_only | Deferred to A2. |
| I (Sublease) | labeled_only | Deferred to A2. |
| J (POS License Agreement) | labeled_only | Deferred to A2. |
| K (General Release) | labeled_only | Deferred to A2. |
| M (Franchisee Lists) | covered-complete | Current and former franchisee lists identified with counts. |
| N-1 (Audited Financials) | partial | Headline figures extracted. Note families deferred to A2. |
| N-2 (Unaudited Q1 2025) | labeled_only | Identified but not fully extracted. Deferred to A2. |

## Canonical Coverage Assessment

- **Top-level keys in 05_canonical.json**: 38 (target: 40+ for 518-page FDD)
- **Canonical size**: Approximately 18KB (target: 20KB+ for 500+ page FDD — slightly below threshold)
- **All Item 2 officers extracted**: Yes (11 entries)
- **Item 20 all 5 tables**: Yes, with footer totals
- **Gag clause flag**: Set (false)
- **Unresolveds family**: Present (6 entries)
- **Contradictions family**: Present (1 entry)
- **Special risks family**: Present (4 entries)

## Material Gaps Requiring A2 Depth

1. **Item 21 financial notes** — 28 pages of notes (pp. 462-489) not yet walked
2. **State addenda structured overrides** — 12 states identified but not structured per-state
3. **Franchise Agreement direct clause walk** — 107 pages; Item 17 chart provides cross-references but direct operative clauses not extracted
4. **Unaudited Q1 2025 financials** — not extracted
5. **Subsidiary agreements** — Product Sales, Asset Purchase, Sublease, POS License, General Release not directly walked
