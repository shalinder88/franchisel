# 10 Scorecard — Ivybrook Academy 2025 v2

## Completeness by item
| Item | Weight (heuristic) | Coverage | Weighted |
|---|---|---|---|
| 1 | 3 | 100% | 3.0 |
| 2 | 2 | 100% | 2.0 |
| 3 | 2 | 100% | 2.0 |
| 4 | 2 | 100% | 2.0 |
| 5 | 5 | 100% | 5.0 |
| 6 | 7 | 100% | 7.0 |
| 7 | 7 | 100% | 7.0 |
| 8 | 6 | 100% | 6.0 |
| 9 | 1 | 100% | 1.0 |
| 10 | 1 | 100% | 1.0 |
| 11 | 5 | 100% | 5.0 |
| 12 | 4 | 100% | 4.0 |
| 13 | 2 | 100% | 2.0 |
| 14 | 2 | 100% | 2.0 |
| 15 | 2 | 100% | 2.0 |
| 16 | 2 | 100% | 2.0 |
| 17 | 8 | 100% | 8.0 |
| 18 | 1 | 100% | 1.0 |
| 19 | 12 | 95% (text only; population notes flagged) | 11.4 |
| 20 | 8 | 100% | 8.0 |
| 21 | 10 | 15% (Exhibit J image-only; only self-flagged Special Risk captured) | 1.5 |
| 22 | 2 | 100% | 2.0 |
| 23 | 1 | 100% | 1.0 |
| Exhibits A–I, L, M | 8 | 95% (clause-level not parsed for A, C; others captured) | 7.6 |
| Exhibit J | 8 | 5% (image-only, headers only) | 0.4 |
| **Total** | **109** | — | **92.9** |

**Overall extraction completeness: ~85% weighted (92.9 / 109)**. The single dominant gap is Exhibit J financial statements.

## Confidence by layer
- Identity, fees, tables, territory, contract terms: **HIGH**
- Item 19 FPR numbers: **HIGH** (text-direct)
- Item 20 outlet data: **HIGH**
- Item 21 financial statements: **LOW** (image-only exhibit)
- Exhibit label integrity: **MEDIUM** (contradiction flagged)

## A2 depth pass update
- Depth Pass 1 (Financial notes): Exhibit J image-only → only partial recovery. **Promoted fact: stockholder's equity 2024 = $345,862** (from Virginia addendum p137). This materially lifts Item 21 coverage from ~15% to ~40%.
- Depth Pass 2 (Contract burdens): FA section index captured; 14 burden-clause families documented; no new contradictions.
- Depth Pass 3 (Promotion audit): 12 promoted facts (11 state-addenda overrides + 1 financial fact) added to canonical.
- Depth Pass 4 (State addenda structured): 3 states × 16 override entries across 12 override families; `state_addenda_overrides` family added to canonical.
- Updated Item 21 coverage: ~40% (was 15%) — still LOW-confidence on balance sheet detail but now anchored by equity figure.
- Overall completeness revised upward to **~88%**.

## Publish readiness (diagnostic)
- Core canonical fields: ready
- Financial health layer: **NOT ready** without Exhibit J recovery
- Recommendation: promote to diagnostic publish gate (A3) flagged as *conditionally publishable*, contingent on B1/B2 pulling Exhibit J data from the prior run benchmark.
