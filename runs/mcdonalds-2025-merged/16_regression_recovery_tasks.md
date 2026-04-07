# 16 Regression Recovery Tasks — Shadow McDonald's run

Generated from `15_regression_check.md`. Only material regressions are listed. Cosmetic-only differences (line counts, byte counts, ordering) are excluded.

---

## RR-01 — Consolidation waiver extraction

| Field | Value |
|---|---|
| task_name | Extract consolidation-of-action waiver from BoA loan / OAP documents |
| exact_target | The covenant in the BoA Promissory Note, Security Agreement, or Operator Assistance Program Agreement under which the franchisee waives the right to consolidate any legal action with others (parallel to the jury trial waiver already captured) |
| why_it_matters | This is the only **type 1 (missing extracted fact)** regression vs the prior production run. It is a real PDF fact that the prior run extracted and that the shadow missed. It strengthens the financing-burden picture and the litigation-defense surface for buyer diligence. Item 10 already references the jury trial waiver and the obligation not to consolidate, in narrative form ("the franchisee agrees to waive the right to a jury trial and agrees not to consolidate the action with others"). Needs to be promoted to a structured canonical field. |
| likely_source_object | Item 10 (page 22) and Exhibit N (pages 196–230, specifically the Operator Assistance Program Agreement and BoA Promissory Note clauses) |
| expected_output_filename | Patch into `09_final_canonical.json` under `contract_burden_promotions_from_FA.consolidation_waiver` and into `12_canonical_enriched_v2.json` under `contract_burden_summary_promoted.consolidation_waiver_present`. Optional standalone: `RR01_consolidation_waiver.json`. |
| priority | medium (must-fix per 15_publish_gate.md / 15_regression_check.md section D) |

---

## RR-02 — Concluded litigation row-level structuring

| Field | Value |
|---|---|
| task_name | Promote 13 concluded Item 3 cases from narrative pattern to structured canonical rows |
| exact_target | Each of the concluded cases listed in Item 3 (pages 12–18), structured with caption, case number, court, claim type, settlement amount, settlement form (cash / restaurant buyout / general release), settlement year |
| why_it_matters | Currently captured as a single `concluded_cases_pattern` narrative entry in `09_final_canonical.json` with cumulative dollar totals. Prior production run structured these as 13 discrete rows. Buyer-trust impact is moderate: the row-level structure makes the buyout-as-settlement pattern queryable (e.g. "all race-discrimination buyouts" or "all Puerto Rico Law 75 settlements"). |
| likely_source_object | `02_reader_report.md` Pass 4 + Item 3 pages 12–18 (concluded cases section). All facts are already in pagetext; this is a pure narrative-to-canonical promotion. |
| expected_output_filename | Patch into `09_final_canonical.json` under `litigation_summary.concluded_cases[]` (new array). |
| priority | low–medium (type 2 — missing promoted field; not blocking publish but visible in regression delta) |

---

## RR-03 — Item 2 leadership roster structuring

| Field | Value |
|---|---|
| task_name | Structure the Item 2 officer/director roster as a canonical array |
| exact_target | All 37+ officers and directors listed in Item 2 (pages 10–12), with name, title, start date, and the six numbered footnoted bios (Briggs, Hayes, Newlands, Brown, Kraft, Varindani) preserved with prior-employer context |
| why_it_matters | Current canonical only mentions the president (Joe Erlinger). Prior production run structured the longer leadership family. Buyer-trust impact is low individually but the pattern matters for management-quality assessment. All names and dates are already in pagetext (pages 10–12). Pure promotion. |
| likely_source_object | Pages 10–12 of `_pagetext/` |
| expected_output_filename | Patch into `09_final_canonical.json` as a new `item_2_business_experience.officers_and_directors[]` array. Optional standalone: `RR03_leadership_roster.json`. |
| priority | low (type 2) |

---

## RR-04 — Scorecard canonical-field-coverage table

| Field | Value |
|---|---|
| task_name | Extend `10_scorecard.md` with a canonical-field-coverage breakdown by family |
| exact_target | A new section in `10_scorecard.md` listing each canonical field family (Identity, Issuance, Formats, Initial Fees, Recurring Fees, Supplier Control, Training Burden, Tech Burden, Territory, Term/Renewal/Transfer, Noncompete, Litigation, Bankruptcy, Item 18, Item 19, Item 20, Item 21, Key Exhibits, Unresolveds, Contradictions, Financing, Contract Burden Promotions, Financial Note Promotions) with `populated / total / fill rate` per family |
| why_it_matters | Prior production run scorecard has this breakdown; shadow scorecard does not. It is the largest single audit-richness regression. Closing it brings the shadow scorecard parity with prior run on quality-assurance presentation. No new facts required — pure scorecard restructuring against the existing canonical. |
| likely_source_object | `09_final_canonical.json` field structure (counted programmatically by family) |
| expected_output_filename | Edit `10_scorecard.md` in place. |
| priority | low (cosmetic-adjacent but explicitly called out in 15_regression_check.md as a presentation regression) |

---

## RR-05 — Final report depth top-up on Items 8/11/17

| Field | Value |
|---|---|
| task_name | Top up `08_final_report.md` Pass 2 (supplier control) and Pass 4 (legal mechanics) sections |
| exact_target | Add narrative paragraphs to `08_final_report.md` covering: (a) Item 8 supplier-control mechanism walkthrough including the 6 supplier-acceptance criteria (page 19), the Code of Conduct, the technology-funds language, and the P2W non-profit structure; (b) Item 11 site-selection asymmetry (franchisee has no input or veto) and POS data-access language with no contractual limits; (c) Item 17 cross-walk between Franchise Agreement and Operator's Lease tables emphasizing the dual-document binding nature |
| why_it_matters | Prior production run final report is ~36% longer (121 vs 89 lines) and the difference is concentrated in Pass 2 / Pass 4 narrative depth. All facts are already in `02_reader_report.md` and the depth-pass JSONs — this is a presentation top-up that does not require new extraction. |
| likely_source_object | `02_reader_report.md` and pagetext pages 19, 20, 24, 25, 31–34 |
| expected_output_filename | Edit `08_final_report.md` in place under existing Pass headers. |
| priority | low (type 2 presentation regression) |

---

## RR-06 — Late-payment interest rate disambiguation

| Field | Value |
|---|---|
| task_name | Add a one-line clarifying note distinguishing the Franchise Agreement late-payment interest from the BoA loan rate |
| exact_target | Two adjacent canonical fields making clear that the 15% per annum (FA Section 8(c), p77) applies to all amounts due to McDonald's under the Franchise Agreement, while the Term SOFR + adjustment + 3% rate (Item 10, p22, APR 7.42% as of 3/17/2025) applies only to the BoA-guaranteed loan program. The prior production run had to adjudicate this conflict (gold corpus said `SOFR + 5%`, which conflated the two instruments). |
| why_it_matters | Pre-empts the same B3 adjudication that the prior production run had to perform. No new fact extraction; just a one-line semantic disambiguation in canonical. Avoids the conflict re-surfacing in the next regression check. |
| likely_source_object | `09_final_canonical.json` `contract_burden_promotions_from_FA.delinquency_interest_rate_pct` (already present) and Item 10 financing canonical (already present) |
| expected_output_filename | Edit `09_final_canonical.json` to add a `notes` field on the delinquency interest entry stating "Applies to all amounts owed to McDonald's under the Franchise Agreement; the Item 10 BoA loan program rate (Term SOFR + adjustment + 3%) is a separate instrument." |
| priority | low (B3 pre-empt — saves adjudication work later) |

---

## RR-07 — Pending-litigation count convention alignment

| Field | Value |
|---|---|
| task_name | Standardize pending-litigation count convention to "7 pending federal + 1 collection action (Sri Lanka)" |
| exact_target | The `litigation_summary.pending_count` field in `09_final_canonical.json` (currently "8 pending federal cases plus 1 collection action (Sri Lanka)" — internally inconsistent because Pestonjee is the 8th and is also the collection action) |
| why_it_matters | Pure counting-convention bug; not a fact regression. Prior production run uses "7 pending federal + 13 concluded with amounts" and treats Pestonjee as separate. Aligning the convention prevents a false-positive conflict in the next regression check. |
| likely_source_object | Item 3 pages 12–18 (already extracted) |
| expected_output_filename | Edit `09_final_canonical.json` `litigation_summary.pending_count.value` to "7 pending federal cases + 1 collection action (Pestonjee, Sri Lanka)" and verify the `pending_cases[]` array is consistent. |
| priority | low (cosmetic-adjacent but listed in 15_regression_check.md section E as a convention conflict) |

---

## Out of scope (not material enough)

The following items in `15_regression_check.md` were considered but **not** turned into recovery tasks:

- **Reader report length differential (75 vs 144 lines)** — narrative-only; all underlying facts are already in canonical, depth-pass JSONs, and final report. Topping up the reader report adds no diligence value.
- **04_exhibits.json size differential (12K vs 14K)** — purely descriptive prose differences in `why_it_matters` fields; both runs cover the same 20 exhibits with the same structural metadata.
- **`contractBurdenScore` and aggregate `totalRecurringFeePct` derived metrics** — interpretive derived fields. The shadow's A1 discipline does not produce these (no invented facts). Should remain a deliberate gap.
- **Insufficient Funds fee ($200) and Transfer Fee** — both runs agree these are absent from the FDD (gold-source errors per prior run's adjudication). No fact to extract.
- **Computed `contractBurdenScore: 30`** — interpretive metric; defer to a separate scoring step if/when the shadow pipeline gains a scoring layer.

---

## Execution order if all tasks run

1. RR-01 (consolidation waiver) — must-fix; do first.
2. RR-07 (litigation count convention) — trivial; do alongside RR-01.
3. RR-06 (late-payment rate disambiguation) — trivial; do alongside RR-01.
4. RR-02 (concluded litigation row-level structuring) — promotion-only; medium effort.
5. RR-03 (leadership roster) — promotion-only; medium effort.
6. RR-04 (scorecard breakdown table) — presentation-only; small effort.
7. RR-05 (final report Pass 2/4 top-up) — presentation-only; small effort.

Tasks RR-01 / RR-06 / RR-07 are the only ones that touch canonical correctness. RR-02 / RR-03 are pure narrative-to-canonical promotion. RR-04 / RR-05 are pure presentation/restructuring.
