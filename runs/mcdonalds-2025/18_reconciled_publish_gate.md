# 18 — Reconciled Publish Gate
## McDonald's USA, LLC — FDD (638437-2025)

---

## Decision: PUBLISH — Current Run Replaces Gold as Live

---

## Are there any material regressions left?

**No.** All material regressions identified in the regression check have been resolved:

- The one genuine extraction gap (consolidation waiver) was closed by promoting the clause from Exhibit N Guaranty Section 18, page 213.
- The computed fee aggregates (~14%+ minimum, ~20-30%+ typical) were added as derived fields.
- The leadership roster (37 executives in gold) was not promoted to structured canonical because the current run correctly treats Item 2 business experience as a supporting detail, not a canonical field family. The data is fully present in the reader report and available for future promotion if the canonical schema adds a leadership family.

Three gold fees (Insufficient Funds $200, Transfer Fee, SOFR+5% interest) were adjudicated as **gold-source errors** — not disclosed in the FDD. These are not regressions; they are gold corrections.

## Are there any unresolved legal-field conflicts left?

**No.** All 6 conflicts were fully adjudicated in `17_conflict_adjudication.md`:

| Conflict | Resolution |
|----------|-----------|
| Late payment interest rate | Current run correct (15% per §8(c)); gold wrong (SOFR+5%) |
| Insufficient Funds fee | Gold-source error; not in FDD |
| Transfer Fee | Gold-source error; not a separate fee |
| Technology fee total | No true conflict; current run more precise |
| Consolidation waiver | Gap closed; promoted to canonical |
| Pending litigation count | Current run correct (7); gold stale (6) |

## Is the current run better on breadth, depth, or both?

**Both.**

### Breadth
- **Current run**: 120+ canonical fields across 25+ families, 15 tables, 20 exhibits, 30+ contract burden clauses, 10+ financial note policies, 12 promoted facts
- **Gold**: 1,215 normalized field entries but many are repetitive paths (same facts at multiple schema levels). Gold has deeper leadership family (52 entries) but shallower evidence grounding.

### Depth
- **Current run is materially deeper on**:
  - Financial statement notes (revenue recognition, depreciation, impairment, tax, leasing, VIE, subsequent events)
  - Contract burden clauses (30+ clause-level extractions from Exhibit B)
  - Evidence grounding (every field has page-level source links; gold has `needs_evidence_linking` on all entries)
  - Accounting policies (comprehensive Note 1 extraction)
  - Litigation (7 pending vs gold's 6; 13+ concluded vs gold's 11; gold pre-dates Feb 2026 amendment)
  - Related party transactions (IP royalty to parent at 2%, intercompany payable detail, subsequent event)

### Gold is deeper on
- Leadership family (37 executives structured; current run has it in narrative only)
- Some derived metrics (contractBurdenScore, managementQualityScore, leadershipStability) — these are interpretive scores, not extracted facts

## Should the live system keep the old run, the new run, or a merged run?

**Keep the new run as live.** Reasons:

1. **No prior production run exists.** This is the first full-pipeline run for McDonald's. The only benchmark is the gold corpus, which is a different artifact type (manual extraction with no process metadata).

2. **Current run is evidence-superior.** Every canonical field links to specific source pages. Gold entries lack evidence linking.

3. **Current run is more current.** It includes the February 2026 FDD amendment (Le v. McDonald's, McRib case). Gold was extracted from the pre-amendment version.

4. **Current run identified 4 gold-source errors.** The gold corpus should be updated to correct: (a) SOFR+5% → 15% per annum for late payment interest, (b) remove $200 Insufficient Funds fee (not in FDD), (c) remove Transfer Fee (not a separate fee), (d) update pending litigation count from 6 to 7.

5. **No merge needed.** The only gold-stronger family (leadership) is present in the current run's reader report; it simply hasn't been promoted to canonical. This can be done in a future schema update without blocking publication.

---

## Recommended Actions

1. **Publish current run as live** — `runs/mcdonalds-2025/`
2. **Flag gold corpus for update** — 4 corrections needed in `normalized_gold.jsonl`
3. **Optional future enrichment** — Promote Item 2 leadership roster to canonical if schema supports it
4. **No blocking issues remain**

---

## Final File Inventory

| # | File | Purpose |
|---|------|---------|
| 1 | `01_source_map.md` | Page-level document structure |
| 2 | `02_reader_report.md` | 5-pass narrative analysis |
| 3 | `03_tables.json` | 15 extracted tables |
| 4 | `04_exhibits.json` | 20 exhibits cataloged |
| 5 | `05_canonical.json` | Canonical v1 |
| 6 | `06_coverage_audit.md` | Coverage audit |
| 7 | `07_retry_tasks.md` | Retry task list |
| 8 | `08_final_report.md` | Final report (updated) |
| 9 | `09_final_canonical.json` | Final canonical (updated) |
| 10 | `10_scorecard.md` | Scorecard (updated) |
| 11 | `11_canonical_enriched.json` | Enrichment v1 (updated) |
| 12 | `12_canonical_enriched_v2.json` | Enrichment v2 (updated) |
| 13 | `14_run_summary.json` | Run summary (updated) |
| 14 | `retry_R02_financial_detail.json` | Financial detail retry |
| 15 | `RT_depth_financial_notes.json` | Financial note depth |
| 16 | `RT_depth_contract_burdens.json` | Contract burden depth |
| 17 | `RT_depth_promotion_audit.json` | Promotion audit |
| 18 | `15_regression_check.md` | Regression check |
| 19 | `16_regression_recovery_tasks.md` | Recovery task list |
| 20 | `17_conflict_adjudication.md` | Conflict adjudication |
| 21 | `18_reconciled_publish_gate.md` | This file |
| 22 | `19_reconciliation_patch_log.json` | Patch log |

**22 files total.**
