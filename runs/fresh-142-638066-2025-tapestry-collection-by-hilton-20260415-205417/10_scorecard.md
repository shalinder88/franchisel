# Extraction Scorecard — Tapestry Collection by Hilton (638066-2025)

## Overall Score: PASS

| Metric | Score | Notes |
|--------|-------|-------|
| Items 1-23 Coverage | 23/23 | All items fully extracted |
| Tables Extracted | 9 | Items 5, 6, 7, 9, 11, 20 (5 tables), 21 (2 statements) |
| Exhibits Cataloged | 20 | All 13 exhibit letters (with sub-exhibits D-1 through D-4, H-1 through H-3) |
| Canonical Fields | 42 | All key fields populated with evidence |
| Confidence: High | 42/42 | No low-confidence fields |
| Unresolveds | 3 | U1 (Item 20 anomaly), U2 (Note 9 typo), U3 (debt guarantee implications) |
| Contradictions | 0 | None found |
| Retries Required | 0 | Coverage audit found no material gaps |
| Item 19 FPR | ABSENT | Franchisor explicitly declines FPR |
| Item 20 Trajectory | STRONG GROWTH | 63 → 117 (3yr), zero terminations, 70 pipeline |
| Item 21 Financial Health | STRONG | $1.49B net income, clean audit, minimal operating expenses |

## Key Risk Flags
1. **Non-renewable franchise** — no right to renew. Re-licensing at franchisor's sole discretion.
2. **No FPR** — prospective franchisees have zero visibility into system-level financial performance.
3. **Heavy fee burden** — 9% base + 4.3% Honors + technology/distribution fees = potentially 15%+ of revenue.
4. **Non-exclusive territory** — even with Restricted Area Provision, significant carve-outs reduce protection.
5. **Antitrust litigation exposure** — 4 pending class actions involving Hilton Worldwide and revenue management software.
6. **Debt guarantee** — all franchisor assets pledged as collateral for Hilton's debt (maturing 2025-2033).
7. **Out-of-state dispute resolution** — Virginia/New York venue, New York governing law.

## A2 Depth Pass Results

| Depth Pass | Files Written | Key Findings |
|------------|--------------|--------------|
| 1: Financial Note Depth | RT_depth_financial_notes.json | 9 notes: revenue recognition, amortization, $85M Graduate acquisition, all assets pledged |
| 2: Contract Burden Depth | RT_depth_contract_burdens.json | Non-renewable term, all guest data is franchisor property, mandatory guest fee consent |
| 3: Narrative-to-Canonical Promotion | RT_depth_promotion_audit.json | 10 facts promoted (HSM economics, Restaurant Brands, termination fee spike) |
| 4: State Addenda Structured | RT_depth_state_addenda_promotion.json | 15 states, 34 overrides. Forum voided in 6 states, liq. damages void in 3 |

## Extraction Quality
- All pages visited and classified
- Source map complete with page-level classification
- Reader report covers all 7 narrative passes (A through G)
- Tables are first-class objects with columns, rows, and notes
- Canonical JSON has source_section, source_pages, and confidence for all fields
- No invented data
- Uncertainty preserved (3 unresolveds documented)
- Four depth passes completed; canonical enforced with unresolveds, contradictions, state addenda
