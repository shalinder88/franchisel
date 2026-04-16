# Extraction Scorecard — Graduate by Hilton (638055-2025)

## Coverage Summary

| Category | Score | Notes |
|---|---|---|
| Items 1–23 | 23/23 FULL | All items extracted |
| Material Tables | 14/14 FULL | All material tables extracted with provenance |
| Financial Statements | FULL | 3-year audited financials + 9 notes |
| Exhibits Cataloged | 16/16 | All exhibits identified with page ranges |
| Exhibits Deeply Extracted | 3/16 | Exhibits A, B, C (franchisee lists and financials) |

## Key Metrics

| Metric | Value |
|---|---|
| Brand | Graduate by Hilton |
| Franchisor | Hilton Franchise Holding LLC |
| Parent | Hilton Worldwide Holdings Inc. (NYSE: HLT) |
| Issuance Date | March 30, 2025 |
| System Size (end 2024) | 32 franchised, 0 company-owned |
| Investment Range (150 rooms) | $18,746,437 – $91,125,745 |
| Royalty Fee | 5% of Gross Rooms Revenue |
| Program Fee | 4% of GRR (+1% max increase over term) |
| Hilton Honors Fee | 4.3% of eligible folio |
| Total Core Fee Burden | ~13.3%+ of GRR (royalty + program + Honors + Advance) |
| Franchise Term | 23 years (new construction) |
| Renewal Right | NONE |
| Item 19 FPR | NONE |
| Territory | Non-exclusive (Restricted Area negotiable) |
| Governing Law | New York |
| Venue | Eastern District of Virginia / Fairfax County VA / New York |
| Post-Term Noncompete | NONE |
| Franchisor Revenue (2024) | $1.50 billion (all brands) |
| Franchisor Net Income (2024) | $1.49 billion (all brands) |
| Auditor | Cherry Bekaert LLP (clean opinion) |

## Extraction Quality

| Dimension | Rating |
|---|---|
| Completeness | HIGH — all 23 items, all material tables, full financials |
| Accuracy | HIGH — all figures sourced with page references |
| Provenance | HIGH — source sections and pages for every field |
| Uncertainty Handling | GOOD — unresolveds documented (FS date typo, brand-specific financials) |
| Contradiction Detection | GOOD — 34 vs 32 outlet discrepancy explained by footnote |

## Retries Executed
None required. All material gaps assessed as non-recoverable from FDD or low-severity.

## A2 Depth Passes

| Pass | Description | Output File | Facts Extracted |
|---|---|---|---|
| Depth Pass 1 | Financial note depth | RT_depth_financial_notes.json | 9 accounting policies, 4 material notes |
| Depth Pass 2 | Contract burden depth | RT_depth_contract_burdens.json | 14 burden categories from FA exhibit |
| Depth Pass 3 | Narrative-to-canonical promotion | RT_depth_promotion_audit.json | 9 facts promoted to canonical |
| Depth Pass 4 | State addenda structured promotion | RT_depth_state_addenda_promotion.json | 18 overrides across 5 states, 12 states with addenda |

## Canonical Family Enforcement

| Family | Status |
|---|---|
| unresolveds | PRESENT — 5 items (U1–U5) |
| contradictions | PRESENT — 2 items (C1–C2) |
| state_addenda_overrides | PRESENT — 12 states, 8 override families |

## Final Verdict
**PASS** — Extraction is complete and ready for publication.
