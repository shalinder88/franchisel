# 18 Reconciled Publish Gate — Ivybrook Academy 2025 v2

## Decision: **PUBLISH — merged** (new run with B4 benchmark backfills replaces prior run as live)

## Answers

### 1. Are there any material regressions left?
**No.** B1 identified 6 material regressions (all Item 21 Exhibit J line items due to image-only text layer) and 2 non-material regressions (Exhibit A clause-walk and accounting-policy notes). B4 executed benchmark backfills for RR01–RR06 from `runs/ivybrook-academy-2025/`, closing all 6 material gaps. The 2 non-material regressions were SKIPped: the FA clause-walk is adequately covered at the burden-family level (the prior run also did not extract clause-level full text systematically), and the accounting-policy notes were marked "not surfaced" in the prior run as well — no recoverable source exists.

**Balance-sheet consistency check**: total_assets ($3,894,365) − total_liabilities ($3,548,503) = $345,862 = stockholders_equity from VA addendum. **PASS**. This is a strong cross-source confirmation.

### 2. Are there any unresolved legal-field conflicts left?
**No.** B2/B3 identified zero real conflicts. All differences between v2 and the prior run were pure gaps, not value disagreements. 17_conflict_adjudication.md documents the null result.

### 3. Is the current run better on breadth, depth, or both?
After B4 backfill, v2 matches the prior run on every text-direct dimension and equals it on Exhibit J. v2 adds:
- Explicit **financial_health_summary** derived layer (liabilities/equity ratio 10.26x, deferred franchise fees 97% of liabilities, cash 7.7% of assets, 3-year net-income trend).
- Cleaner structured `state_addenda_overrides` family with 16 entries across 12 override families (matches prior run).
- Explicit balance-sheet consistency check.
- Explicit promoted-fact provenance tags on each backfilled field (prior run does not flag backfill provenance as cleanly).

v2 is slightly thinner on raw FA clause-level text but equivalent on the burden-family abstraction. On balance, **v2 is marginally better on interpretability and provenance tagging**, and equal on raw coverage.

### 4. Old, new, or merged?
**Merged**. Keep v2 as the live run because:
- All v1 Exhibit J data has been backfilled with provenance.
- v2 has explicit financial_health_summary and balance_sheet_consistency_check layers.
- v2's structured state_addenda_overrides is cleaner.
- v1 remains on disk as the benchmark (not overwritten, per operating rules).

## Conflict resolution summary

| ID | Type | Resolution |
|---|---|---|
| C1 (Table 3 n=19 vs Table 2C n=18) | Data contradiction in FDD | Preserved as unresolved U3 (LOW). FDD-internal, not extraction-fault. |
| C2 (40 vs 41 outlets) | Data reconciliation | Likely affiliate exclusion from Item 19 '40' count. Informational only. |
| C3 (Exhibit K TOC vs body) | Labeling contradiction | Preserved as U2 (MEDIUM). FDD publisher error. |
| C4 (cover Special Risk vs Exhibit J) | Unreadable source | Resolved via B4 backfill: auditor clean opinion, no going concern, but $345,862 equity with $3.4M deferred franchise fees fully explains the Special Risk. |

## Recommended actions on publish

1. Replace live with `runs/ivybrook-academy-2025-v2/` artifacts.
2. Preserve `runs/ivybrook-academy-2025/` as the benchmark (DO NOT delete).
3. Brand-page flags to carry forward:
   - Financial Condition Special Risk with numeric anchor ($345,862 equity vs $540,700–$869,860 investment)
   - Deferred franchise fee balance = $3.4M (dominant balance-sheet item)
   - Brand Fund 1% → 2% planned increase in 2026
   - 42 signed-but-unopened franchises (franchisor's own Special Risk #4)
   - Unilateral franchisor data-access right on franchisee tech
   - Customer-evaluation score as non-curable termination trigger (threshold undisclosed)
   - Post-August-2025 PE ownership by Crux I Ivybrook (Aggregator), LP
4. Open-questions list for future manual diligence:
   - Full accounting-policy footnotes (no source recovered)
   - Franchisee Disclosure Questionnaire physical location (labeled as L in TOC, unlabeled in body)

## Final file inventory

| File | Purpose | Produced in |
|---|---|---|
| 00_bootstrap.json | Bootstrap output (207 pp, fitz text layer) | bootstrap |
| 00_item_map.json | TOC anchor map | bootstrap |
| _pagetext/ | 207 text files | bootstrap |
| 01_source_map.md | Per-page classification | A1 |
| 02_reader_report.md | 7-pass narrative A–G | A1 |
| 03_tables.json | 15 material tables with notes | A1 |
| 04_exhibits.json | 13 exhibit entries with label-integrity flag | A1 |
| 05_canonical.json | Initial canonical | A1 |
| 06_coverage_audit.md | Item-by-item coverage | A1 |
| 07_retry_tasks.md | Retry planning | A1 |
| 08_final_report.md | Full diligence report (sections A–L) | A1 |
| 09_final_canonical.json | Final canonical w/ A2 + B4 patches | A1 → A2 → B4 |
| 10_scorecard.md | Weighted completeness scorecard | A1 → A2 |
| 11_canonical_enriched.json | Enrichment v1 | A1 |
| 12_canonical_enriched_v2.json | Enrichment v2 w/ A2 additions | A1 → A2 |
| 14_run_summary.json | Run summary + metrics | A1 → A2 |
| RT_depth_financial_notes.json | A2 depth pass 1 | A2 |
| RT_depth_contract_burdens.json | A2 depth pass 2 | A2 |
| RT_depth_promotion_audit.json | A2 depth pass 3 | A2 |
| RT_depth_state_addenda_promotion.json | A2 depth pass 4 | A2 |
| 15_publish_gate.md | A3 diagnostic publish gate | A3 |
| 15_regression_check.md | B1 regression check vs prior run | B1 |
| 16_regression_recovery_tasks.md | B2 recovery task list | B2 |
| 17_conflict_adjudication.md | B3 null result | B3 |
| 18_reconciled_publish_gate.md | This file | B5 |
| 19_reconciliation_patch_log.json | B4 patch log | B4/B5 |

---

**Decision**: **PUBLISH (merged)**. New run replaces prior run as live. Prior run preserved as benchmark. All material regressions closed. Zero unresolved legal-field conflicts.
