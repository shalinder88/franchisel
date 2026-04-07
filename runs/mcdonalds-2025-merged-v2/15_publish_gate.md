# 15 Publish Gate (diagnostic) — McDonald's USA, LLC FDD

## Verdict
**Publish-ready with caveats.**

The shadow run is grounded in direct PDF evidence across all 23 items, all material exhibits, all six state addenda actually present in Exhibit T, and the audited financials including notes. A2 (the depth pass) closed the largest remaining depth gaps (financial notes and Franchise Agreement contract burdens). The caveats below are not blocking — they reflect (a) the lessee/lessor row-level state granularity in Item 20 sub-tables that is fully present in `_pagetext` but not yet enumerated row-by-row in `03_tables.json`, and (b) Exhibits C/D/G/N which are present and structurally confirmed but only Exhibit B was walked clause-by-clause in the contract-burden depth pass. A focused recovery pass is **not** required to publish.

## Family-by-family assessment

### Item 19 — Complete
Three cohorts (traditional all, traditional franchised, traditional McOpCo) with full count, percentile, average/median/high/low distributions. Pro-forma at three sales volumes ($3.0M / $3.2M / $3.4M) with COGS, gross profit, other operating expenses, and OIBOC + percentile-above figures. All three notes preserved. Effective rent range 0.00%–33.33% captured. The intra-Item 19 N discrepancy (11,332 vs 11,322) and the 4%-vs-5% royalty cohort mismatch are preserved as contradictions, not errors. No further Item 19 work would change the canonical picture.

### Item 20 — Complete at totals; partial at per-state row level
Tables 1, 3, 4, 5 totals are fully extracted. Table 2 (transfers) totals are extracted; per-state rows are in `_pagetext` for 2022–2024 but not enumerated in `03_tables.json`. Tables 3 and 4 per-state rows are also in `_pagetext` but not enumerated row-by-row. Franchisee organizations (NFLA, AMOA, MHOA, NBMOA, WON, OPN, NOA) and Exhibit R/S pointers are captured. Exhibit S 113 names are extracted directly. Per-state row enumeration is a downstream-consumption nicety, not a canonical-level gap. **Sufficient for publish.**

### Item 21 — Strong after A2
Income statement / balance sheet / cash flow / members' equity all extracted directly. Auditor (E&Y), opinion type (clean), opinion date (March 14, 2025), and fiscal year end captured. The A2 depth pass (`RT_depth_financial_notes.json`) added: parent IP royalty rate (2%) and amount, intercompany payable structure ($2.4B at 12-mo swap + 1%), the Feb 17, 2025 subsequent event (converted to equity), tax exam window (open from 2009), unrecognized tax benefits, effective tax rate, advertising actuals, useful lives, lease accounting depth (operating vs finance, weighted-avg term and discount rate, maturity schedule), the $14.16B undiscounted future minimum rent receivable, the field-office impairment grouping, the "Accelerating the Organization" restructuring, and the Note 1 vs Item 20 1-restaurant gap. **Sufficient for publish.**

### State addenda — Sufficient
All six addenda actually present in Exhibit T (CA, HI, MD, MN, ND, WA) extracted, including the Washington Assurance of Discontinuance on the no-poach clause and the California Fast Food Act disclosure. The 14-state effective-dates registration list is also captured. The eight registration states without specific addenda (IL, IN, NY, RI, SD, VA, WI, plus the MI notice on the FDD cover) are correctly handled — they have no addendum text to extract. **Sufficient for publish.**

### Key exhibits — Sufficient at A; medium-deep on the lease
- Exhibit A (financials): A — full statements + notes deep read.
- Exhibit B (Traditional FA): A — clause-by-clause walk in `RT_depth_contract_burdens.json`.
- Exhibits C/D (Satellite FA, Walmart FA): B — present and structurally confirmed; not walked clause-by-clause in this run. The Walmart MIW form has a Master Lease cross-default that was noted but not deep-read.
- Exhibit G (Operator's Lease, 33 pages): B — present and structurally confirmed including internal addenda (Landlord's Interest, Landlord's Interest – Oil, Co-Branded Development, McDonald's Interest, Excess Property), but per-section terms not extracted. This is the most consequential remaining exhibit gap because the lease bundles with the FA and governs base rent, percentage rent, occupancy costs, and termination. Item 17 captures the lease provision table at the summary level.
- Exhibit N (BoA loan documents, 35 pages): B — promissory note, security agreement, ACH, OAP claim waiver structure extracted from Item 10; per-clause loan-document text not exhaustively walked.
- Exhibits H/I/J/K/L/M/O/P/Q: B — presence and pages confirmed, structural purpose clear, contents not enumerated.
- Exhibits R/S/T: A — directly surfaced and extracted (R sampled at structural level; S full 113 names; T all six state addenda).

**Sufficient for publish, with the caveat that Exhibit G Operator's Lease and Exhibits C/D parallel franchise agreements are at depth B.**

### Unresolveds — Mostly extraction-gap-flavored, not business-risk gaps
- The intra-Item 19 N gap (11,332 vs 11,322), the Item 20 Table 1 vs Note 1 1-restaurant gap, and the Item 8 "Cashless not proprietary / Sesame proprietary" framing are **document-internal inconsistencies**, not extraction errors.
- The Item 7 disclosed range vs Note 11 ($2.04M overshoot on 9 of 31 McOpCo refranchise sales) and the Item 19 4%-vs-5% royalty cohort mismatch are **business-risk flags** (the FDD discloses them but the reader needs to interpret them).
- The unsurfaced families (notes to financial statements full text — now resolved by A2; full Operator's Lease clauses; full Exhibit C/D/N clause-by-clause) are **extraction-depth gaps**, not business-risk gaps. None of them, if walked, would change the canonical economics or burden picture beyond marginal refinement.

### Buyer-trust impact
No missing family materially weakens buyer trust. The diligence-critical surfaces are all covered: who the franchisor is, the fee stack, the rent structure, the supplier control, the no-renewal-right structure, the litigation density, the buyout-as-settlement pattern, the audited financial position, the parent IP royalty drain, the field-office impairment grouping, the in-term-includes-landlord non-compete, the FMV-no-intangibles termination put, the mandatory ACH and 15% delinquency interest, and the 2024 outlet history. A buyer reading the canonical + final report would have a complete economic-and-burden picture for an investment decision.

### Did A2 close the biggest depth gaps
**Yes.** Before A2, the largest grade-B exhibits were Exhibit A notes (resolved in `RT_depth_financial_notes.json`) and Exhibit B Franchise Agreement (resolved in `RT_depth_contract_burdens.json`). The 30 facts in `RT_depth_promotion_audit.json` substantially upgraded the canonical contract-burden surface from a Item-17-table summary to a clause-grounded structure. The remaining grade-B exhibits (C, D, G, H, I, J, K, L, M, N, O, P, Q) are either parallel forms of B (C/D), administrative (O/P/Q), policy documents (K/L/M), training-side (J), or transfer-side mechanics (H/I) — none materially change the canonical.

## Verdict mechanics

Publish-ready with caveats. **No focused recovery pass required.** If a single optional follow-up were to be queued (not blocking), it would be the Operator's Lease (Exhibit G) clause walk — see "weakest remaining parts" below.

If the user *wants* one focused recovery pass anyway, the maximum-3 list would be:
1. **Operator's Lease clause walk (Exhibit G, p133–165)** — extract base rent calc, occupancy cost allocation, default cure, termination on default, transfer/assignment, the five internal lease addenda (Landlord's Interest, Landlord's Interest – Oil, Co-Branded Development, McDonald's Interest, Excess Property), and confirm that Item 17 lease provision table is consistent with the actual lease text. Output: `RT_depth_operator_lease.json`.
2. **Walmart MIW Franchise Agreement delta walk (Exhibit D, p109–126)** — capture Master Lease cross-default mechanics, the 14%–15.5% Fixed Percentage Rent disclosure inside the FA, and any deviations from Exhibit B's clause structure (especially around termination, ROFR, and post-term restrictions). Output: `RT_depth_walmart_fa_delta.json`.
3. **Exhibit N loan-document clause walk (p196–230)** — capture the BoA Promissory Note rate-reset language, the Security Agreement collateral list and event-of-default triggers, the ACH Authorization revocability, and the OAP Agreement claim-waiver scope. Already partially extracted from Item 10. Output: `RT_depth_loan_docs.json`.

These three would close the last remaining grade-B exhibits in the run, but **none is needed for publish**.

## Strongest parts of the current run
- **Item 6 fee stack**: All 23 itemized recurring tech fees, all one-time deployment fees, all 11 footnotes, the STO/STR percentage rent tier table, the co-investment policy with both 2026 options, and the MIW 14%–15.5% Fixed Percentage Rent disclosure are extracted with full evidence grounding.
- **Item 19 multi-cohort**: Three cohort distributions, pro-forma at three sales volumes, and the effective rent range 0.00%–33.33% are fully captured. The intra-Item discrepancy is preserved rather than smoothed over.
- **Item 21 + financial notes (post-A2)**: This is now the strongest section in the run. The notes deep read added 14 canonical fields including the parent IP royalty, the $2.4B intercompany subsequent event, the lease accounting depth, the future minimum rent receivable schedule, the tax exam window, and the field-office impairment grouping. This goes beyond what the FDD body alone reveals.
- **Item 3 litigation**: All 8 pending federal cases plus the Sri Lanka collection action are captured with case numbers, courts, plaintiffs, claims, and current procedural posture. The recurring buyout-as-settlement pattern (totaling ~$99.7M across six discrimination/Law-75/ROFR cases) is structured as a separate canonical entry.
- **Exhibit B Franchise Agreement clause walk (post-A2)**: Sections 7, 8, 10, 11, 12, 15, 17, 18, 20, 23, 24, 25, 28 walked with section-level evidence pages. The in-term-includes-landlord non-compete, the 15% delinquency interest, the mandatory ACH, the 60-day pre-expiration no-removal freeze + FMV option (no intangibles), and the political-activity carve-out from the public-conduct termination clause are now structured.
- **Contradiction preservation**: 5 contradictions are preserved across files (canonical, reader report, scorecard, run summary).

## Weakest remaining parts of the current run
- **Exhibit G Operator's Lease (33 pages)** — the most material grade-B exhibit. The Item 17 lease provision table summarizes it but the actual base rent calculation method, the occupancy cost allocation between McDonald's and franchisee at the lease level, the default and cure mechanics, and the five internal lease addenda are not walked clause-by-clause.
- **Exhibit C / Exhibit D parallel franchise agreements** — present and structurally confirmed as parallel to Exhibit B but not walked. The Walmart MIW form in particular has a Master Lease cross-default and a different rent structure (14%–15.5% Fixed Percentage Rent) that would benefit from clause-level confirmation.
- **Exhibit N BoA loan documents (35 pages)** — Item 10 captures the loan-program economic structure (rate, security, OAP claim waiver, personal guarantee, jury trial waiver) but the per-clause loan-document text is not walked. Of these, the OAP claim-waiver scope and the security agreement collateral list are the most consequential.
- **Item 20 sub-table per-state row enumeration** — Tables 2/3/4 per-state rows are in `_pagetext` for 2022–2024 but not enumerated in `03_tables.json`. Useful for downstream consumers wanting state-level outlet history but not material at the canonical level.
- **Exhibit R franchisee directory row-level enumeration** — 12,887-restaurant universe confirmed; per-row name/address not enumerated. Sampled across multiple regions to confirm structure.

## Likely areas where a prior/manual run may still be stronger
This is a shadow A1+A2 run that did not consult prior or manual McDonald's runs. Areas where a prior or manual run may still be stronger include:

- **Operator's Lease clause-level extraction**: A manual reviewer with time to walk Exhibit G p133–165 in detail would likely have a better-structured lease burden picture, including the lease default cure window, the percentage-rent base sales calculation method, and the five internal lease addenda.
- **Walmart MIW Franchise Agreement deltas**: A manual reviewer comparing Exhibits B/C/D side-by-side would catch any non-obvious deviations in the Walmart form (Master Lease cross-default, Master Lease rent obligations carve-out, the limited applicability of certain Section 11 provisions).
- **Item 20 per-state enumeration**: A manual run focused on per-state outlet history (especially the Florida 47-restaurant 2022 reacquisition spike, the Texas 2024 28-opening surge, the New York 16-non-renewal 2023 spike, the Indiana 17-sold-to-franchisee 2024 transaction) would have row-level state tables in canonical form.
- **Litigation case-level deep read**: A manual reviewer might consult Pacer or news to enrich the procedural posture of Deslandes/Turner (post-7th Cir remand), Crawford/McPherson, Michell, and Williams beyond what the FDD body discloses. The shadow run is grounded only in the FDD text.
- **Franchisee organization outreach data**: A prior run may have linked Exhibit S 113 names to Exhibit R or to the franchisee organizations (NFLA/AMOA/MHOA/NBMOA/WON/OPN/NOA) for outreach planning.
- **Cross-run trend deltas**: Any prior-year McDonald's run would let the reader compare outlet history, AUV, fee stack changes (especially the new tech fees), and litigation status year-over-year. The shadow run is single-year by design.
- **Exhibit N loan-document specifics**: A manual reviewer might have walked the BoA promissory note and security agreement clause-by-clause, surfacing the precise event-of-default ladder, the cure provisions, and the relationship between OAP signing and the underlying franchise agreement.

None of these gaps weaken the publish decision, but they are the most likely places where a prior or manual run would still have an edge over this shadow.
