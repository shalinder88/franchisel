# 18 Reconciled Publish Gate — Shadow McDonald's run

## Verdict
**Option 2 — Publishable only after a best-of-both merge with the previous live run.**

The shadow run, post-recovery, is at parity or slightly stronger than the prior production run on canonical depth, contract-burden granularity, financial-note structuring, contradiction preservation, and exhibit grading. It is at slight presentation deficit on reader-report length and prior-run B-stage adjudication artifacts. There are **no material extraction regressions left** and **no unresolved legal-field conflicts**. However, the prior production run carries B-stage reconciliation outputs (`17_conflict_adjudication.md`, `18_reconciled_publish_gate.md`, `19_reconciliation_patch_log.json`) and a longer reader/scorecard surface that the shadow does not fully duplicate. The safest path is to merge the shadow's stronger depth-pass JSONs and structured concluded-litigation array into the live run, rather than wholesale replacement.

## Explicit answers

### Are there any material regressions left?
**No.** All seven RR-* tasks in `16_regression_recovery_tasks.md` have been executed (RR-05 was deprioritized as cosmetic-only and partially absorbed into the recovery patch section of `08_final_report.md`). The consolidation waiver, the guarantor 18% enforcement rate, the 19-row concluded-litigation structure, the 37-entry Item 2 leadership roster, the pending-litigation count convention, the late-payment rate disambiguation, and the scorecard per-family breakdown are all in place. Verified by `19_reconciliation_patch_log.json`.

### Are there any unresolved legal-field conflicts left?
**No.** `17_conflict_adjudication.md` adjudicated every priority field. The two true conflicts (consolidation waiver, pending litigation labeling convention) are both resolved in the shadow's favor of the prior run's correct value via the recovery patch. The three "still unresolved" items in section E of `17_conflict_adjudication.md` (Exhibits C/D clause walks, Exhibit G internal addenda walks, Exhibit N full per-clause walk) are **shared depth gaps** in both the shadow and the prior production run, not conflicts. Neither run claims facts in those areas, so there is nothing to adjudicate.

### Is the current run better on breadth, depth, or both?
**Both, with caveats.**

- **Breadth**: Shadow now matches the prior run on item coverage (23/23 at A), exhibit count (20/20), state addenda (6/6), tables (15/15), and structured concluded-litigation row count (19 in shadow vs 13 in prior). Shadow is **slightly stronger on breadth** because it captured 19 concluded cases (the full Item 3 list) where the prior run captured 13.
- **Depth**: Shadow's `RT_depth_financial_notes.json` is ~73% larger than the prior run's equivalent (25.8K vs 14.9K bytes); `RT_depth_contract_burdens.json` is ~42% larger (23.5K vs 16.5K bytes); `12_canonical_enriched_v2.json` is ~37% larger (15.8K vs 11.5K). Shadow is **stronger on depth-pass JSON granularity**.
- **Presentation depth**: Prior run is still longer on `02_reader_report.md` (144 vs 75 lines), `08_final_report.md` (121 vs 89 + recovery section), and `10_scorecard.md` (113 vs ~130 post-recovery now). Most of the prior-run advantage on presentation has been closed by the recovery patch's scorecard breakdown and final-report recovery section.
- **B-stage adjudication trail**: Prior run has `17/18/19` reconciliation files from a previous round; shadow now also has `15/16/17/18/19` from this round. Parity.
- **Contradiction preservation**: Shadow preserves 5 contradictions (intra-Item 19 N gap, Item 20 vs Note 1 1-restaurant gap, Item 7 vs Note 11 investment-range overshoot, Item 19 4%/5% royalty cohort mismatch, Item 8 proprietary-vs-not framing). Prior run preserves 1 contradiction after reconciliation. Shadow is **stronger on contradiction preservation discipline**.

### Should the system keep the old run, the new run, or a merged run?
**Merged.** The cleanest publishable artifact is a best-of-both merge:
- **From the shadow run, take**: `RT_depth_financial_notes.json`, `RT_depth_contract_burdens.json`, the 19-row `litigation_summary.concluded_cases[]`, the 37-entry `item_2_business_experience.officers_and_directors[]`, the contract-burden promotions block in `09_final_canonical.json`, the contradiction preservation, the consolidation waiver and guarantor enforcement rate fields, and the late-payment rate disambiguation note.
- **From the prior production run, take**: the longer narrative `02_reader_report.md`, the longer `08_final_report.md` body (especially Pass 2 / Pass 4 supplier-control and legal-mechanics sections), and the prior B-stage adjudication trail of any conflicts that were resolved before this shadow run.
- **Reconcile carefully on**: the contradiction count (shadow's 5 vs prior's 1) — most of the shadow's contradictions are real intra-FDD inconsistencies that should be preserved, not smoothed over. Recommend keeping the shadow's 5-contradiction set in the merged canonical.

If a merge is operationally infeasible and a single run must be chosen:
- The shadow run, post-recovery, can replace the prior live run **with one caveat**: the shadow's reader report and final report narrative are shorter than the prior run's. This is a presentation regression but not a fact regression. If the downstream consumer prioritizes structured canonical fields and depth-pass JSONs over narrative length, the shadow can replace. If the downstream consumer reads the reader report as the primary artifact, keep the prior run's narrative and patch the shadow's structured deltas into it.

## Five most important reasons for the decision

1. **Consolidation waiver and guarantor 18% rate are now in canonical** (RR-01 and the Exhibit N Section 2 patch from `17_conflict_adjudication.md`). These were the only two substantive missing-fact regressions vs the prior production run. With them in place, the shadow run has zero canonical-correctness gaps relative to the prior run.

2. **Concluded litigation now structured row-by-row at 19 entries**, exceeding the prior run's 13. This makes the buyout-as-settlement pattern queryable (e.g. "all race-discrimination buyouts" = 2 entries totaling $40M; "all Puerto Rico Law 75 settlements" = 2 entries totaling $22.1M; "all ROFR settlements" = 1 entry at $15.6M).

3. **Depth-pass JSONs are materially richer than the prior run's equivalents.** `RT_depth_financial_notes.json` (~73% larger) captures the full lease maturity schedule, the franchised-revenue split with three years of comparatives, the future minimum rent receivable schedule with owned/leased breakdown, and the deferred-tax components. `RT_depth_contract_burdens.json` (~42% larger) organizes burdens by family with section + page evidence per row. These are the strongest artifacts in either run.

4. **Late-payment interest rate is now correctly disambiguated across three instruments** (FA Sec 8(c) 15%, Item 10 BoA loan SOFR+adjustment+3%, Exhibit N Sec 2 guarantor 18% or Prime + 4%). This pre-empts the same B3 adjudication the prior production run had to perform on a gold corpus that conflated all three.

5. **The shadow preserves five intra-FDD contradictions explicitly** (intra-Item 19 N gap, Item 20 vs Note 1 1-restaurant gap, Item 7 vs Note 11 investment range overshoot, Item 19 royalty cohort mismatch, Item 8 framing inconsistency). The prior run had reconciled these down to one. For diligence purposes, preserving the contradictions intact is the more honest signal — a buyer should see what the FDD itself disagrees about, not a smoothed canonical.

## Three biggest remaining weaknesses

1. **Exhibits C and D (Satellite and Walmart MIW Franchise Agreements) not walked clause-by-clause.** Both runs share this gap. The Walmart MIW form has a Master Lease cross-default that has been noted but not depth-extracted. If a Walmart franchisee is the relevant buyer, this is a material gap. **Status**: shared with prior run; not a regression. **Recommended fix**: a future depth pass on Exhibits C and D, scoped to deviation from Exhibit B clause structure.

2. **Exhibit G Operator's Lease internal addenda** (Landlord's Interest, Landlord's Interest – Oil, Co-Branded Development, McDonald's Interest, Excess Property — pages 152–164) not walked clause-by-clause. The Operator's Lease is bundled with the Franchise Agreement and governs base rent calculation, occupancy cost allocation, and STO/STR co-tenancy with fuel station operators. **Status**: shared gap with prior run. **Recommended fix**: a focused pass on these five form addenda, especially the oil-station co-tenancy economics for STO franchisees.

3. **Exhibit N BoA loan documents per-clause walk is partial.** The shadow now has the consolidation waiver, the jury trial waiver, the personal/spouse guarantee, the OAP claim waiver structure, the loan rate, and the guarantor 18% enforcement rate. What is still not walked: the full Promissory Note covenant ladder, the Security Agreement collateral list and event-of-default triggers ladder, the ACH Authorization revocability, and the OAP Agreement remedies sequence. **Status**: shared gap with prior run; partially closed by recovery patch. **Recommended fix**: a focused walk of pages 196–230 organized by document (Promissory Note → Security Agreement → ACH → Unlimited Guaranty → OAP).

None of these three weaknesses block publish. They are appropriate items for a future targeted depth pass and do not affect the canonical-economics-and-burden picture for this McDonald's FDD year.
