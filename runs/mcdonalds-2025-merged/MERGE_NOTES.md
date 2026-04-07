# MERGE NOTES — mcdonalds-2025-merged

Best-of-both merge of:
- **OLD** = `runs/mcdonalds-2025/` — prior production / live run
- **NEW** = `runs/shadow-previous-mcdonalds-2025/` — shadow A1 + A2 depth pass + regression recovery patch

Merge policy source: `runs/shadow-previous-mcdonalds-2025/18_reconciled_publish_gate.md`.

Neither OLD nor NEW was overwritten. This merged run is a third independent artifact.

---

## From OLD (verbatim copy or base)

- **`01_source_map.md`** — item-and-exhibit inventory with priorities; same factual content in both runs, OLD version used verbatim.
- **`02_reader_report.md`** — **longer narrative (144 lines)**. Used verbatim. NEW's 75-line version is compact but loses Pass 2/4 supplier-control and legal-mechanics paragraphs; OLD is the fuller reading surface.
- **`03_tables.json`** — 15 tables. Both runs comparable; OLD version used verbatim.
- **`04_exhibits.json`** — richer `why_it_matters` descriptive prose per exhibit. OLD used verbatim.
- **`05_canonical.json`** — original canonical draft. OLD used verbatim; the authoritative canonical is `09_final_canonical.json` below.
- **`06_coverage_audit.md`** — 67 lines, slightly more granular partial-coverage notes. OLD used verbatim.
- **`07_retry_tasks.md`** — original retry plan. OLD used verbatim.
- **`08_final_report.md`** — OLD body verbatim as base; **Merge addendum section appended** summarizing the shadow recovery facts (consolidation waiver, 19 concluded litigation rows, 37 leadership roster, 16 contract burden promotions, 5 contradictions, late-payment rate disambiguation, financial note depth). The OLD body is kept intact as the primary narrative; the addendum is explicitly labeled.
- **`11_canonical_enriched.json`** — OLD base kept verbatim (layered enrichment structure). **Appended** `merged_recovery_enrichments` block with the NEW post-recovery fields and an `interpretive_derived_metrics` block that clearly labels OLD's contract_burden_score=30 and total_recurring_fee aggregate as derived (not PDF-grounded).

---

## From NEW (verbatim copy or structural take)

- **`09_final_canonical.json`** — NEW post-recovery used verbatim. This is the authoritative canonical in the merged run. It contains:
  - 37-entry `item_2_business_experience.officers_and_directors[]`
  - 19-entry `litigation_summary.concluded_cases[]`
  - 16-field `contract_burden_promotions_from_FA`, including `consolidation_waiver = true` and `guarantor_enforcement_interest_rate` (18% / Prime+4%)
  - 14+ Item 21 financial summary fields including parent IP royalty, intercompany payables, subsequent event, tax examination window, future minimum rent receivable, lease weighted-avg terms, advertising actuals, depreciation useful lives, field-office impairment grouping, restructuring initiative
  - 5 preserved contradictions (vs OLD's 1)
  - Late-payment rate disambiguation note on FA Section 8(c) entry
  - Pending litigation count normalized to "7 federal + 1 collection (Pestonjee Sri Lanka)"
- **`12_canonical_enriched_v2.json`** — NEW used verbatim (~37% larger than OLD's v2; organizes contract burden summary + financial notes summary in dense structured form).
- **`RT_depth_financial_notes.json`** — NEW's version used verbatim. ~73% larger than OLD's equivalent. Full lease maturity schedule, franchised-revenue three-year split, future minimum rent receivable with owned/leased breakdown, deferred tax components, related-party intercompany line structure, Note 1 vs Item 20 1-restaurant gap cross-flag.
- **`RT_depth_contract_burdens.json`** — NEW's version used verbatim. ~42% larger than OLD's equivalent. Organized by burden family with section + page evidence per row.
- **`RT_depth_promotion_audit.json`** — NEW used verbatim.
- **`15_publish_gate.md`** — NEW's diagnostic publish gate (OLD did not have a standalone diagnostic gate; went straight to regression check). Used verbatim.
- **`15_regression_check.md`** — NEW's regression check (benchmarked against OLD directly). Used verbatim.
- **`16_regression_recovery_tasks.md`** — NEW's RR-01..RR-07 task list. Used verbatim.
- **`17_conflict_adjudication.md`** — NEW's conflict adjudication. Used verbatim. Covers the 43-field priority legal/economic parity check.
- **`18_reconciled_publish_gate.md`** — NEW's reconciled publish gate. Used verbatim. This is the authority for the merge policy applied here.

---

## New in merged run (written during merge)

- **`10_scorecard.md`** — merged scorecard combining NEW's per-family breakdown (via post-recovery patch) with OLD's quality-indicator style. New overall grade **A+** justified by: canonical-field count ~200 (merge union of OLD ~124 and NEW ~155), exhibit grade uplift (14 at A post-merge vs 12 OLD / 13 NEW), contract burden count 46, financial note families 11, concluded litigation rows 19, contradiction count 5, preserved interpretive derived metrics 2 (clearly labeled).
- **`14_run_summary.json`** — merged run summary with explicit `source_provenance` block distinguishing `from_OLD`, `from_NEW`, and `new_in_merge` artifact sets.
- **`MERGE_NOTES.md`** — this file.
- **`19_reconciliation_patch_log.json`** — merge-specific patch log documenting every cross-run decision.

---

## Fields that required judgment

1. **`litigation_summary.pending_count` labeling convention**. OLD said "7 pending" (federal). NEW originally said "8 pending federal" (internally inconsistent because Pestonjee is Sri Lankan state court), then normalized to "7 federal + 1 collection (Pestonjee Sri Lanka)". **Merge decision**: use NEW's normalized convention. Rationale: more precise; Pestonjee is not a federal case.

2. **`contradictions_preserved`**. OLD had 1 contradiction post-reconciliation. NEW has 5. **Merge decision**: keep NEW's 5. Rationale: all five are real intra-FDD inconsistencies; smoothing them down to 1 loses diligence signal. Documented in both `09_final_canonical.json` and `11_canonical_enriched.json merged_recovery_enrichments.contradictions_list`.

3. **`contract_burden_score` and `total_recurring_fee_aggregate`** (OLD interpretive metrics). **Merge decision**: preserve under a new `interpretive_derived_metrics` block in `11_canonical_enriched.json` with an explicit note that they are derived, not directly extracted. Rationale: they add diligence value but must not be mistaken for PDF-grounded facts.

4. **`08_final_report.md`** — whether to use OLD body or NEW body. **Merge decision**: use OLD body verbatim and append a "Merge addendum" section listing the NEW recovery facts. Rationale: OLD narrative is fuller and there is no narrative-level conflict; the new facts are structured-canonical in nature and belong in the canonical JSON more than in free-text narrative.

5. **`11_canonical_enriched.json`** — whether to rewrite or append. **Merge decision**: use OLD base verbatim and append two new top-level blocks (`merged_recovery_enrichments` and `interpretive_derived_metrics`). Rationale: keeps OLD enrichment structure intact while explicitly attributing new facts to the merge.

6. **`09_final_canonical.json`** — whether to take OLD or NEW as base. **Merge decision**: use NEW post-recovery as base. Rationale: NEW post-recovery is a strict superset of OLD on structured canonical fields (155 vs 124 values) AND has all recovery patches applied. Taking NEW is lossless on fact count; taking OLD would have required re-adding 31+ fields manually.

7. **`late-payment rate disambiguation`** — where to put the three-instrument clarification. **Merge decision**: inline the disambiguation as a `notes` field on `contract_burden_promotions_from_FA.delinquency_interest_rate_pct` in `09_final_canonical.json` (already done in NEW) AND surface it as a top-level block in `11_canonical_enriched.json merged_recovery_enrichments.late_payment_rate_disambiguation`. Rationale: pre-empts future B3 re-adjudication.

---

## Remaining shared gaps (not closable by merge alone)

1. **Exhibits C (Satellite Franchise Agreement) and D (Walmart MIW Franchise Agreement) not walked clause-by-clause**. Both runs share this gap. The Walmart MIW form has a Master Lease cross-default that has been noted but not depth-extracted. Not a regression — shared in both source runs. Recommended for a future targeted depth pass scoped to clause-level deviation from Exhibit B.

2. **Exhibit G Operator's Lease five internal form addenda** (Landlord's Interest, Landlord's Interest – Oil, Co-Branded Development, McDonald's Interest, Excess Property — pages 152–164). Both runs share this gap. Particularly material for STO franchisees because the Oil variant governs fuel-station co-tenancy economics.

3. **Exhibit N BoA loan documents per-clause walk is partial**. The merged run now captures (from NEW) the consolidation waiver (Section 18 p213), the jury trial waiver, the personal/spouse guarantee, the 18% guarantor enforcement rate (Section 2 p208), the OAP claim waiver structure, and the loan rate. Not yet walked: the full Promissory Note covenant ladder, the Security Agreement collateral list and event-of-default triggers ladder, the ACH Authorization revocability, and the OAP Agreement remedies sequence.

4. **Per-state row enumeration of Item 20 Tables 2/3/4**. Both runs capture totals and 2022-2024 movements at the grand-total level but do not enumerate per-state rows in structured canonical form (the rows are in `_pagetext` for consumption).

5. **Exhibit R franchisee directory row-level enumeration**. Both runs confirm the 12,887-restaurant universe structurally but do not enumerate per-row name/address/telephone in structured canonical form.

None of these gaps block publish. They are appropriate for a future targeted depth pass.

---

## Publish status

This merged run is the **publish artifact** for the McDonald's 638437-2025 FDD year. It supersedes both OLD and NEW for production consumption, while preserving both source runs as-is on disk for audit traceability.
