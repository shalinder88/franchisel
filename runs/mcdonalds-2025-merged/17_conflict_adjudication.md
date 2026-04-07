# 17 Conflict Adjudication — Shadow vs Prior production run
McDonald's USA, LLC FDD (638437-2025, as amended Feb 1 2026)

This file adjudicates conflicting legal/economic fields between `runs/shadow-previous-mcdonalds-2025/` and `runs/mcdonalds-2025/`. Each conflict was checked against the operative PDF page directly before deciding. Both runs extract from the **same** PDF, so most "conflicts" turn out to be naming convention or completeness gaps rather than substantive fact disputes.

Classifications used:
1. different agreement types
2. state override
3. program-specific agreement
4. gold-source / prior-run issue
5. current shadow extraction error

---

## Priority field walk

### Renewal term / no-renewal rights
- **Shadow** (`09_final_canonical.json` `term_renewal_transfer_default_termination.renewal`): "No contractual right to renew or extend; new term governed only by McDonald's discretionary New Term Policy (Exhibit K)."
- **Prior run** (`08_final_report.md` and `09_final_canonical.json`): Same.
- **Source verification** (page 41, Item 17(b)/(c) and FA Sec 28(a) page 88): "Franchisee acknowledges that: (a) The term of this Franchise is set forth in paragraph 2(b) hereof with no promise or representation as to the renewal of this Franchise or the grant of a new franchise."
- **Adjudication**: **No conflict.** Both runs correct.

### Term length by agreement type
- **Shadow**: Traditional 20 yr; STO/STR 10 yr; BFL 3 yr (extendable to 20 on conditional purchase); Satellite varies; MIW Walmart Satellite (term varies).
- **Prior run**: Same.
- **Source verification** (page 9 Item 1; page 40 Item 17(a); page 41 Note 2).
- **Adjudication**: **No conflict.** Both correct. This is a clean example of "different agreement types" properly captured by both runs (classification 1, but no conflict because both runs broke down by agreement type).

### Transfer restrictions
- **Shadow** (`term_renewal_transfer_default_termination.transfer`): "Requires McDonald's prior written consent; royalty resets to current rate (5%); transferring franchisee remains personally liable; no current breach allowed; McDonald's holds right of first refusal."
- **Shadow contract burden promotion** (`transferor_continuing_liability`): "FA Section 15(d): transferring franchisee remains personally liable for all affirmative obligations for the full term (or shorter at McDonald's sole discretion); royalty resets automatically to then-prevailing rate."
- **Prior run**: Same content; no divergence.
- **Source verification** (FA Section 15(d), page 83; reread for this adjudication): "Franchisee and each transferor shall continue to remain personally liable for all affirmative obligations, covenants, and agreements contained herein for the full term of this Franchise or for such shorter period as McDonald's may, in its sole discretion, determine. Upon each assignment or other transfer of this Franchise to any person or persons under the terms and conditions of this paragraph 15(d), the percentage royalty charge owing to McDonald's after the date of such assignment or transfer shall be automatically adjusted to the then prevailing percentage royalty charge required under new Franchises issued by McDonald's for similar McDonald's restaurants at the time of such assignment or transfer."
- **Adjudication**: **No conflict.** Both runs correct, both grounded in the same FA section and page.

### ROFR mechanics
- **Shadow** (`contract_burden_promotions_from_FA.rofr_mechanics`): "FA Section 15(c): 20-day prior written notice with proposed purchaser identity and offer terms; McDonald's has 10 days to elect to match; continuing first option on subsequent offers."
- **Prior run**: Same.
- **Source verification** (FA Section 15(c), page 83 — reread): "Franchisee or Franchisee's representative shall, at least twenty (20) days prior to the proposed effective date, give McDonald's written notice of intent to sell or otherwise transfer this Franchise pursuant to paragraph 15(d). The notice shall set forth the name and address of the proposed purchaser and all the terms and conditions of any offer. McDonald's shall have the first option to purchase the Restaurant by giving written notice to Franchisee of its intention to purchase on the same terms as the offer within ten (10) days following McDonald's receipt of such notice. However, if McDonald's fails to exercise its option and the Restaurant is not subsequently sold to the proposed purchaser for any reason, McDonald's shall continue to have, upon the same conditions, a first option to purchase the Restaurant upon the terms and conditions of any subsequent offer."
- **Adjudication**: **No conflict.** Both runs correct.

### Guaranty scope
- **Shadow**: Personal guarantee from franchisee + spouse required for the BoA loan program (Item 10, p22); jury trial waiver captured; OAP claim waiver captured. **Consolidation waiver NOT separately structured.**
- **Prior run** (`17_conflict_adjudication.md` Conflict 5): Captured the consolidation waiver from Exhibit N Unlimited Guaranty Section 18 (page 213).
- **Source verification** (Exhibit N, Section 18, page 213 — reread): "JURY WAIVER. EACH OF THE GUARANTOR AND THE LENDER HEREBY IRREVOCABLY WAIVES TRIAL BY JURY ... NEITHER THE GUARANTOR NOR THE LENDER WILL SEEK TO CONSOLIDATE ANY SUCH ACTION, IN WHICH A JURY TRIAL HAS BEEN WAIVED, WITH ANY OTHER ACTION IN WHICH A JURY TRIAL CANNOT BE OR HAS NOT BEEN WAIVED. THE PROVISIONS OF THIS SECTION HAVE BEEN FULLY DISCUSSED BY THE PARTIES AND THESE PROVISIONS SHALL BE SUBJECT TO NO EXCEPTIONS."
- **Adjudication**: **Conflict resolved against shadow.** The consolidation waiver is directly surfaced in the same paragraph as the jury trial waiver. Shadow extraction missed it. **Class: 5 (current shadow extraction error).** Already queued in `16_regression_recovery_tasks.md` as RR-01.

### Forum / governing law
- **Shadow** (`term_renewal_transfer_default_termination` + `litigation_summary` + Special Risks notes): Illinois law; out-of-state forum (IL) is the Special Risk on cover page p4.
- **Prior run**: Same.
- **Source verification** (FA Section 27 page 88 — reread): "The terms and provisions of this Franchise shall be interpreted in accordance with and governed by the laws of the state of Illinois." Cover page Special Risk (p4): "Out-of-State Dispute Resolution. The franchise agreement requires you to resolve disputes with the franchisor by mediation, arbitration and/or litigation only in Illinois."
- **Adjudication**: **No conflict.** Both runs correct.

### State override effects
- **Shadow** (`exhibit T` family + `noncompete.state_modifications`): Six states with addenda (CA, HI, MD, MN, ND, WA) plus the Washington Assurance of Discontinuance on no-poach. North Dakota non-compete unenforceability flagged.
- **Prior run**: Same six states; same WA AOD; same ND non-compete flag.
- **Source verification** (Exhibit T pages 383–385 — already directly read in source map): all six addenda physically present. The 14 registration states list is on page 386 but only six have substantive addendum text.
- **Adjudication**: **No conflict.** Both runs correct. This is a textbook "state override" classification (class 2) properly captured by both runs.

### Rent economics
- **Shadow** (`recurring_fees.rent`): Hybrid Monthly Base + Pass-Thru + Percentage. New traditional Percentage Rent generally 6%–23%; min 11.50% from year 8. STO/STR tiered 9.0%–11.50% by acquisition+development cost. MIW 14%–15.5% Fixed Percentage Rent. Effective rent in 2024 ranged 0.00%–33.33%.
- **Prior run**: Same numbers; same structure.
- **Source verification** (Item 6 footnotes 3, 4, 6, 7 pages 13–16; Item 19 Note 3 page 37). All numbers reread and confirmed.
- **Adjudication**: **No conflict.** Both runs correct. The rent economics are correctly differentiated by agreement type (class 1, but resolved correctly by both runs without conflict).

### Bankruptcy semantics
- **Item 4 (franchisor bankruptcy)**:
  - Shadow (`bankruptcy_flag`): "None — McDonald's USA, LLC discloses no bankruptcy required to be disclosed."
  - Prior run: Same.
  - Source: page 18 ("No bankruptcy is required to be disclosed in this Item.").
  - **Adjudication**: **No conflict.**
- **Item 17 / Section 18(b) (franchisee bankruptcy as termination trigger)**:
  - Shadow: "Bankruptcy/insolvency/receiver (involuntary not dismissed in 30 days) = material breach."
  - Prior run: Same.
  - Source: FA Section 18(b) page 85 — reread and confirmed.
  - **Adjudication**: **No conflict.**
- **Maryland addendum bankruptcy carve-out**:
  - Shadow: "Termination upon insolvency might not be enforceable under federal bankruptcy law (11 U.S.C. Section 101 et seq.), but we will enforce it to the extent enforceable" (Exhibit T MD addendum p384).
  - Prior run: Same.
  - **Adjudication**: **No conflict.** Class 2 state override captured by both runs.

### Termination triggers / cure structure
- **Shadow** (`term_renewal_transfer_default_termination.termination_with_cause`): 16 listed material breach categories from FA Sections 18 and 19. No-cure-period for any of the 18(a)–(q) triggers; "other breaches" under 19 may be cured but repeated breaches are termination grounds.
- **Prior run**: Same.
- **Operator's Lease cure period** (Exhibit G Section 7.04): 10 days to cure default of any covenant other than rent / report submission / FA compliance / abandonment / bankruptcy. Both runs captured this from the Item 17 Operator's Lease table on page 33 of the FDD body.
- **Source verification** (FA Section 18(a)–(q) page 85–86; Section 19 page 86; Item 17 Operator's Lease table page 33–34). All reread and confirmed.
- **Adjudication**: **No conflict.** Both runs correctly distinguish FA termination (no cure for material breach categories, except as judicially required) from Operator's Lease termination (10-day cure on non-listed defaults).

### Late payment interest rate (cross-instrument disambiguation)
- **Shadow**: 15% per annum (FA Section 8(c) page 77) for all amounts owed under the Franchise Agreement; separately, BoA loan rate Term SOFR + adjustment + 3% (Item 10 page 22).
- **Prior run**: Same. The prior run's `17_conflict_adjudication.md` adjudicated this against a gold corpus that said "SOFR + 5%" — the prior run resolved that as gold-source error. The prior run also surfaced a third instrument-specific rate: Exhibit N, Unlimited Guaranty Section 2 (page 208) — guarantor enforcement interest at "18% or, if higher, the floating rate."
- **Source verification** (FA Section 8(c) page 77 — reread; Item 10 page 22 — already confirmed; Exhibit N Section 2 page 208 — not reread by shadow but cross-checked against prior run finding).
- **Adjudication**: **No conflict on the FA rate.** Both runs agree the FA rate is 15% per annum or highest legal rate, monthly compounded. **Shadow has a structuring gap** because it does not also surface the Exhibit N guarantor 18% enforcement rate as a separate canonical line. **Class: 5 (shadow extraction depth gap), specifically a missing third instrument disambiguation.** Recommend adding this to canonical alongside the FA rate and the BoA loan rate.

### Agreement-type / program-specific differentiation
- **Shadow**: Three franchise agreement forms (Exhibit B Traditional, Exhibit C Satellite, Exhibit D Walmart MIW). BFL is a rider (Exhibit F) plus underlying Operator's Lease (Exhibit G). Differentiation correctly applied to: initial fee ($45K traditional / $22.5K STO-STR / $500 Satellite / $0 Walmart / $0 McOpCo); rent (Percentage Rent ranges differ; MIW 14%–15.5% Fixed); term (20 / 10 / 3 / varies); investment range (three columns in Item 7); co-investment criteria (different floors for traditional vs STR vs STO).
- **Prior run**: Same differentiation.
- **Adjudication**: **No conflict.** Both runs correctly apply class-1 (different agreement types) differentiation.
- **One asymmetry**: shadow's contract-burden depth pass walked **only Exhibit B (Traditional)** clause-by-clause. Exhibits C and D were not walked. Prior run also did not walk C/D clause-by-clause. So this is **not a conflict**, but it is a shared depth gap on the parallel Walmart MIW form's Master Lease cross-default and any divergent termination/transfer mechanics.

---

## A. True conflicts resolved

1. **Consolidation waiver (Exhibit N Unlimited Guaranty Section 18, page 213)**
   - **Resolution**: Prior run is correct. Shadow missed it.
   - **Direct PDF re-read confirmed**: Exhibit N page 213 contains the explicit consolidation waiver immediately after the jury trial waiver, in the same Section 18 paragraph: *"NEITHER THE GUARANTOR NOR THE LENDER WILL SEEK TO CONSOLIDATE ANY SUCH ACTION, IN WHICH A JURY TRIAL HAS BEEN WAIVED, WITH ANY OTHER ACTION IN WHICH A JURY TRIAL CANNOT BE OR HAS NOT BEEN WAIVED."*
   - **Class**: 5 (current shadow extraction error).
   - **Action**: RR-01 in `16_regression_recovery_tasks.md` will patch this into the canonical.

2. **Pending litigation count convention** ("8 pending federal" in shadow vs "7 pending federal + 1 collection" in prior run)
   - **Resolution**: This is a counting-convention conflict, not a fact conflict. Both runs identify the same 7 federal cases (Deslandes, Turner, Crawford/McPherson, Kytch, Michell, Williams, Le) plus the Pestonjee Sri Lanka collection action. Shadow's "8 pending federal" label is internally inconsistent because Pestonjee is a Sri Lankan state-court case, not a federal case.
   - **Class**: 5 (shadow labeling error, not extraction error).
   - **Action**: RR-07 in `16_regression_recovery_tasks.md` will normalize to "7 pending federal + 1 collection action (Sri Lanka)".

---

## B. Differences that are actually agreement-type or state-override distinctions (not conflicts)

1. **Term length by format** (20 / 10 / 3 / varies) — class 1, both runs correctly differentiated.
2. **Initial franchise fee by format** ($45K / $22.5K / $500 / $0) — class 1, both runs correctly differentiated.
3. **Rent structure by format** (traditional Percentage Rent 6%–23%; STO/STR tier table 9.0%–11.50%; MIW Fixed 14%–15.5%) — class 1, both runs correctly differentiated.
4. **North Dakota non-compete unenforceability** — class 2 (state override), both runs correctly captured under noncompete + state addenda.
5. **Maryland insolvency-as-termination carve-out** — class 2, both runs captured under Exhibit T.
6. **Washington Assurance of Discontinuance on no-poach** — class 2 + class 4 (this is a state-specific regulatory consent decree, not a state law override), both runs captured.
7. **Hawaii Sec 28 acknowledgement deletion via FA Rider** — class 2 (state override implemented via state-specific rider on the franchise agreement, page 88), both runs captured (shadow under Exhibit T; the rider mechanism is on Exhibit B p88 and is parallel to Exhibit T).
8. **Operator's Lease 10-day cure period** vs **Franchise Agreement no-cure-for-listed-breaches** — class 1 (different operative agreements within the bundled FA + Operator's Lease), both runs correctly distinguished.

---

## C. Prior/manual run wrong

**None** in this comparison. All adjudicated divergences either favor the prior run (consolidation waiver) or are conventions (pending count). The prior run's prior adjudications against the gold corpus (SOFR+5%, $200 NSF fee, Transfer Fee) are inherited as gold-source errors (class 4) and shadow agrees with the prior run on those.

---

## D. Current shadow run wrong

1. **Consolidation waiver missing** (Exhibit N Section 18 p213). Class 5. Recoverable via RR-01.
2. **Pending litigation labeled "8 federal"** when correct convention is "7 federal + 1 international collection". Class 5. Recoverable via RR-07.
3. **Exhibit N Unlimited Guaranty Section 2 — guarantor enforcement interest "18% or, if higher, the floating rate" (page 208) NOT separately structured.** Shadow has the 15% FA delinquency rate and the BoA loan SOFR+adjustment+3% rate but not the third instrument-specific rate. Class 5 (depth gap). Recoverable via a small canonical addition.

These three are the only adjudicated errors in the shadow run on the priority field set.

---

## E. Conflicts still unresolved and why

1. **Exhibit C (Satellite Franchise Agreement) and Exhibit D (Walmart MIW Franchise Agreement) clause-by-clause walks not performed by either run.** Whether the Walmart MIW Master Lease cross-default, the Satellite term language, and the FA Section 11 (in-term non-compete) Section 18 (material breaches) clauses match Exhibit B verbatim is **not conflict-adjudicated** because neither run walked them. This is not a conflict — it is a **shared unsurfaced depth**. Recommend a B-stage RR-08 task: walk Exhibits C and D for any clause-level deviation from Exhibit B, especially around (a) Walmart Master Lease cross-default, (b) Section 18 material breach list parity, (c) Section 17 insurance minimum parity. Until that walk is performed, no conflict can be adjudicated, and there is no evidence of a conflict either.

2. **Exhibit G Operator's Lease internal addenda** (Landlord's Interest, Landlord's Interest – Oil, Co-Branded Development, McDonald's Interest, Excess Property — pages 152–164). These are present in both runs' source maps, but neither run walked them clause-by-clause. There may be agreement-type (STO oil-station co-tenancy) or program-specific (co-branded development) economic burdens that diverge from the Item 6/Item 7 disclosed economics. Until walked, no conflict can be adjudicated. Recommend a B-stage RR-09 task scoped to these addenda.

3. **Exhibit N BoA loan documents per-clause walk** (pages 196–230). Beyond the consolidation waiver and the 18% guarantor rate already adjudicated above, neither run has walked the full Promissory Note, Security Agreement, ACH Authorization, and OAP Agreement clause-by-clause. The covenants ladder, security interest scope, event-of-default triggers, and Lender remedies are all unsurfaced at the clause level. No conflict to adjudicate, but the remaining depth gap is real.

These three unresolved areas are not B3-blocking. They are appropriate for B-stage planning if a deeper depth pass is desired.

---

## Summary table

| Field | Shadow | Prior run | Class | Resolution |
|---|---|---|---|---|
| Renewal right | none | none | — | No conflict |
| Term by format | 20/10/3/varies | 20/10/3/varies | 1 | No conflict |
| Transfer | consent + ROFR + royalty reset + transferor liability | same | — | No conflict |
| ROFR mechanics | 20-day notice / 10-day match / continuing | same | — | No conflict |
| Guaranty jury waiver | captured | captured | — | No conflict |
| Guaranty consolidation waiver | **MISSING** | captured (p213) | 5 | Shadow wrong; RR-01 |
| Forum / governing law | IL law / IL forum | same | — | No conflict |
| State override (CA, HI, MD, MN, ND, WA) | captured | captured | 2 | No conflict |
| Rent economics | tiered + co-invest + MIW Fixed + 0–33.33% effective | same | 1 | No conflict |
| Bankruptcy (Item 4) | none | none | — | No conflict |
| Bankruptcy (FA Sec 18(b)) | termination trigger | termination trigger | — | No conflict |
| MD insolvency carve-out | captured | captured | 2 | No conflict |
| Termination triggers | 16 categories + Operator Lease 10-day cure | same | — | No conflict |
| FA late-payment rate | 15% (Sec 8(c)) | 15% (Sec 8(c)) | — | No conflict |
| BoA loan rate | SOFR + adj + 3% | same | — | No conflict |
| Guarantor enforcement rate (Ex N Sec 2) | **MISSING** | captured | 5 | Shadow wrong; small canonical addition |
| Pending litigation count | "8 federal" (mislabeled) | "7 federal + 1 collection" | 5 | Shadow labeling wrong; RR-07 |
| Walmart MIW Master Lease cross-default | not walked | not walked | — | Unresolved (not a conflict) |
| Operator's Lease internal addenda | not walked | not walked | — | Unresolved (not a conflict) |
| Exhibit N full clause walk | partial | partial | — | Unresolved (not a conflict) |

**Net result**: 3 shadow extraction errors confirmed (consolidation waiver, guarantor 18% rate, pending litigation labeling). 0 prior-run errors found. 0 substantive priority-field conflicts between the two runs. The prior production run is correct on every adjudicated priority field. The shadow run is correct on every priority field except the three listed above, all of which are recoverable without re-running the pipeline.
