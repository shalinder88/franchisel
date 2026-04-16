# Scorecard: Homewood Suites by Hilton FDD (638060-2025)

## Extraction Quality

| Metric | Value |
|--------|-------|
| Items fully covered | 23/23 |
| Tables extracted | 14 |
| Exhibits cataloged | 15 |
| Retries executed | 3 (R1, R2, R3) |
| Retries skipped | 2 (R4, R5) |
| Material gaps remaining | 0 |
| Unresolveds | 6 |
| Contradictions | 1 (Connected Room fee wording — resolved) |

## Key Brand Metrics

| Metric | Value |
|--------|-------|
| System size (end 2024) | 518 franchised hotels |
| Company-owned | 0 |
| Growth (2024) | +7 net |
| Pipeline | 142 signed not open; 17 projected next year |
| Termination rate (2024) | 5/518 = 0.97% |
| Transfer rate (2024) | 26/518 = 5.02% |
| Avg Room Rate (2024) | $160.03 |
| Avg Occupancy (2024) | 79.4% |
| Avg RevPAR Index (2024) | 123.0 |
| Total Investment (low) | $20,824,955 |
| Total Investment (high) | $32,522,797 |
| Royalty rate (steady state) | 5.5% of GRR |
| Program fee | 3.5% of GRR |
| Combined core fee burden | 9.0% of GRR + 2.5% Hilton Honors |
| Franchise term (new) | 22 years |
| Renewal right | None |
| Franchisor revenue (2024) | $1.502B |
| Franchisor net income (2024) | $1.488B |

## Risk Flags

| Risk | Severity | Source |
|------|----------|--------|
| No renewal right — re-licensing at sole discretion | HIGH | Item 17 |
| "Homewood" mark not federally registered | MEDIUM | Item 13, Special Risks |
| All franchisor assets pledged for Hilton parent debt | MEDIUM | Note 7 |
| No default protected territory | MEDIUM | Item 12 |
| Multiple antitrust class actions pending (IDeaS/STR) | MEDIUM | Item 3 |
| Confidentiality clauses restrict franchisee communication | MEDIUM | Item 20 |
| Liquidated damages formula: up to 60× monthly royalty | MEDIUM | Item 6 |
| Massive carve-outs from any Restricted Area | LOW | Item 12 |
| Monthly Program Fee can increase +1% over term | LOW | Item 6 |

## A2 Depth Pass Results

| Depth Pass | Output File | Items Found |
|------------|-------------|-------------|
| 1: Financial notes | RT_depth_financial_notes.json | 8 accounting policies, 7 material notes |
| 2: Contract burdens | RT_depth_contract_burdens.json | 14 burden categories extracted from FA |
| 3: Narrative-to-canonical promotion | RT_depth_promotion_audit.json | 8 facts promoted to canonical |
| 4: State addenda structured | RT_depth_state_addenda_promotion.json | 11 states, 37 override entries, 11 override families |

## Mandatory Canonical Families

| Family | Status |
|--------|--------|
| unresolveds | PRESENT (6 items) |
| contradictions | PRESENT (1 item, resolved) |
| state_addenda_overrides | PRESENT (11 states, structured) |

## Verdict

**EXTRACTION COMPLETE — HIGH CONFIDENCE**

This is a well-disclosed, institutional-grade FDD from a publicly traded parent (Hilton Worldwide, NYSE: HLT). The fee structure is heavy but transparent. The primary due diligence concerns are: (1) no renewal right — franchisees face re-licensing at franchisor's sole discretion with potentially materially different terms; (2) weak territorial protections by default; (3) the principal mark "Homewood" lacks federal registration; and (4) all franchisor assets are pledged as collateral for Hilton's corporate debt.

The financial performance data (Item 19) shows strong competitive positioning (RevPAR Index 123.0 = 23% above competitive sets), healthy occupancy (79.4%), and steady system growth, but does not include EBITDA or cost build-up data.
