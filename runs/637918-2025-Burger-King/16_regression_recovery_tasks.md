# Regression Recovery Tasks — Burger King FDD (637918-2025)

Generated from `15_regression_check.md`. Only material regressions requiring recovery.

---

## RR-01: Noncompete Correction (CRITICAL)

- **task_name:** Fix noncompete across all files
- **exact_target:** All canonical files (05, 09, 11, 12) + 02_reader_report.md + 08_final_report.md
- **why_it_matters:** Current run states "2 years, 5 miles" — source says "1 year, 2 miles." Publishing wrong noncompete terms would mislead franchisees and create legal liability.
- **likely_source_object:** FA D1 Section 19 (page 220), Item 17(r) (page 87), Development Agreement Art. VII (page 94)
- **expected_output:** In-place corrections to existing files + 17_conflict_adjudication.md

## RR-02: D1/D2 Findings Recovery

- **task_name:** Incorporate FA D1/D2 critical findings from previous run
- **exact_target:** 8 findings from previous run's D1/D2 deep read into canonical and final report
- **why_it_matters:** BKC's data ownership, MOD Manual unilateral change power, 65% media floor, ISP supermajority binding, successor 4th-year notice, post-transfer installment liability, and mandatory BK Foundation are all diligence-grade findings not in the current run.
- **likely_source_object:** Previous run's 09_final_canonical.json (franchise_agreement_deep_read section)
- **expected_output:** Updates to 09_final_canonical.json and 12_canonical_enriched_v2.json

## RR-03: RTF2 Deep Read Recovery

- **task_name:** Incorporate RTF2 contribution schedules and default mechanics from previous run
- **exact_target:** Full RTF2 contribution matrices (3 remodel types x 4 royalty rates x 3 completion years), lessor contribution, default/penalty mechanics, cross-default cascade, general release, cure period reductions
- **why_it_matters:** RTF2 is the single most consequential program document in the current BK system. The contribution schedule is critical for investment modeling. Cross-default exposure is material risk.
- **likely_source_object:** Previous run's 12_retry_rtf2.md
- **expected_output:** New file 12_retry_rtf2.md (copied and verified from previous run) + canonical updates

## RR-04: Fuel the Flame Recovery

- **task_name:** Incorporate FTF EBITDA thresholds, voting, and rent cap from previous run
- **exact_target:** EBITDA thresholds ($175K base met, $230K renewal), rent cap methodology (7.4% above 2021), renewal voting mechanics, non-voter counting, TV-only spending restriction, RSI audit right
- **why_it_matters:** FTF is the current advertising-rate increase program affecting all participating franchisees. The EBITDA threshold and voting mechanics determine whether the rate continues.
- **likely_source_object:** Previous run's 13_retry_fuel_the_flame.md
- **expected_output:** New file 13_retry_fuel_the_flame.md (copied and verified from previous run) + canonical updates

## RR-05: Rent Economics Recovery

- **task_name:** Incorporate BKL/BKC lease economics from previous run
- **exact_target:** Min rent formula (10% of capitalized costs / 125% of BKC rent + 10%), percentage rent tiers (8.5%/$133K/10%), 12% escalation every 5 years, default liability (full remaining-term rent)
- **why_it_matters:** Rent is often the largest single cost for BKL-property franchisees. These formulas are essential for unit economics modeling.
- **likely_source_object:** Previous run's 09_final_canonical.json (rent_economics section) + 08_final_report.md
- **expected_output:** Updates to canonical files and final report

## RR-06: Cross-Default and CYC Recovery

- **task_name:** Incorporate cross-default mapping and CYC-specific restrictions from previous run
- **exact_target:** CYC noncompete (5th anniversary or loan repayment), CYC→all FA default cascade, Carrols→transaction FA cascade, RTF2→all DA/TRA/MTRA cascade, D1 vs D2 structural delta
- **why_it_matters:** Cross-default exposure is a material risk factor. CYC noncompete is materially different from standard FA noncompete.
- **likely_source_object:** Previous run's 09_final_canonical.json (cross_defaults, noncompete, owner_participation sections)
- **expected_output:** Updates to canonical files

---

**Total recovery tasks: 6**
**Priority order: RR-01 (critical) > RR-02 > RR-03 > RR-04 > RR-05 > RR-06**
