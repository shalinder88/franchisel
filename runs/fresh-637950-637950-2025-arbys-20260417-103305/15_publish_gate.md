# Publish Gate — 637950-2025-Arbys

## Verdict: 2 — Publish with caveats

**Rationale:** All 23 FDD items are fully extracted. Both sets of financial statements are complete with notes walked. State addenda are structured. Item 19 and Item 20 are complete. The main caveats are: (1) the Franchise Agreement has not been fully clause-walked (39 pages, key operative burdens covered via Item 17 chart and partial A2 walk), and (2) the General Release exhibit scope is known from body references but not independently clause-walked.

---

## Item-by-Item Assessment

### 1. Item 19 completeness
- **Status:** PASS
- FPR provided with 2024 AUV data for 2,219 franchised Traditional Restaurants.
- All tables extracted: quartile breakdown (4 quartiles) and venue breakdown (3 venue types).
- Notes extracted with population counts, exclusion rules, and caveats.
- Revenue-only representation — no cost/expense data. This is a structural FDD design choice, not an extraction gap.
- Substantiation availability statement captured: "Upon your reasonable request, we will provide written substantiation."
- Item 19 cohort comparability check: no discrepancy (revenue-only AUV; royalty rate does not affect reported figures).

### 2. Item 20 completeness
- **Status:** PASS
- All 5 standard tables present:
  - Table 1 (systemwide): 3 years, franchised + company-owned.
  - Table 2 (transfers): 3 years, per-state detail, totals (54/87/41).
  - Table 3 (franchised status): 3 years, per-state detail, footer totals (2024: 33 opened, 0 terminated, 29 non-renewed, 0 reacquired, 34 ceased other).
  - Table 4 (company-owned): 3 years, per-state detail, footer totals (2024: 2 opened, 20 closed).
  - Table 5 (projected): 8 FAs signed but not opened, 13 projected new franchised, 0 company.
- Footer totals balance correctly.
- Franchisee list exhibit count: 122 pages of franchisee lists (A-1 through A-4).
- Gag clause flag: SET. Quote extracted verbatim: "current and former franchisees sign provisions restricting their ability to speak openly about their experience with us" (p.83).

### 3. Item 21 sufficiency
- **Status:** PASS
- Auditor identified: KPMG LLP, Atlanta.
- Opinion: Unqualified (both entities).
- Going-concern status: None (both entities).
- Income statement: Extracted for both Franchisor LLC ($156.5M net income) and ARG ($91.3M net income).
- Balance sheet: Extracted for both entities.
- Cash flows: Extracted for both entities.
- Notes to financial statements: All 7 note families walked for Franchisor LLC; all 7 note families walked for ARG (completed in A2 depth pass).
- Key financial observations documented: securitization structure ($789.9M), parent-level IRB debt (~$4.2B guaranteed by ARG), $380M note receivable from parent, stockholder's deficit.

### 4. State addenda sufficiency
- **Status:** PASS
- 6 states identified and extracted: California, Hawaii, Maryland, Minnesota, North Dakota, Washington.
- Michigan notice also captured (pre-body, not in exhibit).
- Structured overrides promoted into canonical via RT_depth_state_addenda_promotion.json.
- 17 override entries across 9 override families (forum_selection, governing_law, general_release, termination, noncompete, damages, statute_of_limitations, labor_law, trademarks).
- Summary table built mapping override families to affected states.
- State addenda are STRUCTURED in 09_final_canonical.json (via enriched v2) and RT file.

### 5. Key exhibit sufficiency
- **Status:** PASS WITH CAVEATS
- Item 22 lists 8 contracts: DA (C), DA Incentive (C-1), FA (D), FA Incentive (D-1), NT Amendment (D-2), MBA (D-3), State Riders (E), General Release (F).
- All are accounted for in 04_exhibits.json.
- Financial exhibits (Exhibit B): Deep-read, all statements and notes walked.
- Franchise Agreement (Exhibit D): Partial clause walk (transfer, OFAC, anti-disclaimer). Key operative burdens covered via Item 17 chart.
- General Release (Exhibit F): Identified, required at renewal and transfer. Not independently clause-walked.

### 6. Unresolveds and contradictions assessment
- **Status:** PASS
- 06_coverage_audit.md contains 5 unresolveds and 1 contradiction.
- 08_final_report.md contains unresolveds (Section J) and contradictions (Section K).
- `unresolveds` key exists in canonical (5 entries).
- `contradictions` key exists in canonical (1 entry).
- UR-5 (no cost data in Item 19) is a business-risk flag, not an extraction gap.
- All other unresolveds are extraction-depth gaps that have been partially addressed in A2.

### 7. Final report depth
- **Status:** PASS
- 08_final_report.md is a full diligence narrative (500+ lines, ~25KB).
- All required sections present: Executive snapshot (14 bullets), Fees/Investment (Section B), Supplier/Operations/Tech (Section C), Territory (Section D), Contract burden/legal (Section E), Item 19 detail (Section F), Item 20 detail (Section G), Item 21 detail (Section H), State addenda (Section I), Unresolveds (Section J), Contradictions (Section K), Final coverage note (Section L).
- Unresolveds section present with 5 entries.
- Contradictions section present with 1 entry.
- State addenda discussed with per-state detail.
- Item 21 financial statements summarized with both entities.

### 8. Score gate
- **Status:** PASS
- 10_scorecard.md shows overall grade A-.
- All items covered. All required canonical fields populated with evidence grounding.
- A2 depth pass results documented.

---

## Strongest parts of the run

1. **Item 19 extraction (pp.71-73):** Complete quartile and venue breakdown with population counts, medians, ranges, and above-average percentages. Cohort comparability checked and confirmed no discrepancy.

2. **Item 21 dual-entity financial statements (pp.207-246):** Both Arby's Franchisor LLC (SPV) and ARG (operating entity) fully extracted with all notes walked, including securitization structure ($789.9M notes, $300M VFN), parent-level IRB debt (~$4.2B), and related-party structure ($380M note receivable).

3. **Item 20 complete with gag clause (pp.74-83):** All 5 tables extracted with per-state detail and footer totals. Item 20/21 outlet count reconciliation performed — ARG includes international units, no contradiction. Gag clause flagged with verbatim quote.

4. **State addenda structured promotion (pp.337-346):** All 6 states read, 17 overrides structured into 9 override families, summary table built. Minnesota FA rider clause-walked in full.

5. **Item 6 fee stack depth (pp.31-37):** Complete extraction of NRO royalty ramp (0.5%→4%), relocation ramp (1%→4%), NRO advertising discount (75%→50%→standard), low-sales extension ($1.3M threshold), VetFran ($100K credit cap), Pioneer ($50K credit), DTO ($25K rebate). All fee notes including Gross Sales definition.

6. **Item 2 leadership roster (pp.21-24):** 23-person roster with exact roles, locations, and tenure start dates.

## Weakest remaining parts of the run

1. **Franchise Agreement full clause walk (Exhibit D, pp.267-305):** 39 pages not fully clause-walked. Transfer clause, OFAC clause, and anti-disclaimer clause were directly read. Remaining operative clauses (grant of rights, operations, records/reporting, insurance schedules, confidentiality, default/cross-default) rely on Item 17 chart cross-references. This is a depth gap, not a material buyer-facing gap, because Item 17 provides adequate operative coverage of the key burdens.

2. **Development Agreement clause walk (Exhibit C, pp.247-259):** 13 pages identified but not clause-walked. Territory mechanics and development schedule obligations rely on Item 12 and Item 17 cross-references.

3. **General Release (Exhibit F, pp.347-351):** 5 pages identified. Required at renewal and transfer. Scope known from body references ("release of any and all claims") but the specific carve-outs, state-specific modifications, and execution mechanics are not directly extracted from the exhibit text.

4. **Item 7 note completeness (pp.40-43):** All 19 notes extracted, but the investment table formatting is complex and some note cross-references (e.g., note 5 on Multi-Brand Locations) point to other items rather than providing standalone cost data.

5. **ARG impairment detail:** The ARG financial statements show $3.2M in impairment charges for 2024 ($9.1M in 2023, $11.6M in 2022) but the specific restaurant-level impairment analysis is not available beyond the aggregate figures.

## Where a prior or manual run may still be stronger

1. **Full FA clause walk:** A manual reader or prior run that read all 39 pages of the FA line-by-line would have clause-level detail on grant of rights (Article 1), operations (Articles 3-5), records/reporting (Article 9), and specific default/cross-default triggers that go beyond the Item 17 summary chart. This matters if the FA contains distinctive provisions (e.g., unusual liquidated damages formulas, specific cross-default triggers, equipment lease-back provisions) not captured in the Item 17 chart.

2. **Development Agreement territory mechanics:** A prior run that clause-walked the DA would have exact language on territory definition methodology, development schedule enforcement mechanics, and the interplay between DA rights and FA rights.

3. **General Release scope:** A manual reader would know the exact scope of claims released, any carve-outs for state law claims, and the specific language of the release form.

## Optional max-3 follow-up roadmap

1. **RT_depth_fa_full_clause_walk.json:** Full 39-page FA clause walk targeting grant of rights, operations, default/cross-default, records/reporting, insurance schedules. Moderate priority — Item 17 provides adequate coverage but some edge cases may be missed.

2. **RT_depth_general_release.json:** Read Exhibit F (5 pages) to extract exact release scope, state carve-outs, and execution mechanics. Low-to-moderate priority.

3. **RT_depth_da_clause_walk.json:** Read Exhibit C (13 pages) for territory definition mechanics and development schedule enforcement. Low priority — Item 12 provides adequate coverage.

## Unresolved taxonomy

### Document-internal inconsistencies
- (None identified)

### Business-risk flags
- **UR-5:** No cost/expense data in Item 19 — structural FDD design choice. Prospective franchisees must independently investigate unit economics from current/former franchisees.
- **C-1:** Gag clause — some franchisees may not be able to communicate freely during due diligence.
- System contraction: -48 total units in 2024, with only 13 projected new openings.
- Materially different successor FA at renewal — terms can change substantially.
- Securitization encumbrance — franchise agreements pledged as collateral for $789.9M in notes.

### Extraction-depth gaps
- **UR-1:** FA not fully clause-walked (39 pages). Partially addressed in A2.
- **UR-2:** DA not clause-walked (13 pages).
- **UR-3:** General Release not clause-walked (5 pages).

## Buyer-trust assessment

A serious buyer reviewing this extraction would have a comprehensive and accurate picture of the Arby's franchise opportunity. All material terms — investment range, fee burden, territory protections, renewal conditions, non-compete scope, financial performance data, outlet trajectory, and financial health of both the SPV franchisor and the operating parent — are fully surfaced with source provenance. The state addenda are structured and actionable. The main gap (FA clause walk) is mitigated by the comprehensive Item 17 chart and the partial A2 walk, which together cover the key operative burdens a buyer needs to evaluate. A buyer in a registration state (MD, MN, ND) would find their specific protections clearly documented. This run is trustworthy as a primary due diligence reference, with the caveat that legal review of the actual FA, DA, and General Release text should still be performed before signing.

## Franchise Agreement clause-walk assessment

- **Surfaced exhibit:** Franchise Agreement (Exhibit D, pp.267-305, 39 pages)
- **Clause-walk status:** Partial. Transfer clause (Article 16:2:1, p.290), OFAC clause (Article 21.11, p.295), and anti-disclaimer clause (Article 21.13, p.295) were directly walked.
- **Verdict decision:** Verdict 2 allowed.
- **Rationale:** The FA's key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty, venue) are adequately covered via the Item 17 chart (pp.63-71) and the partial A2 walk. The guaranty scope (unconditional, principals only, no spousal) is confirmed from Item 15 (p.62). The non-compete scope (roast beef sandwiches within Protected Area, 15% threshold) is confirmed from Items 15 and 17. Transfer conditions and ROFR mechanics are confirmed from the FA text (p.290). No evidence of unusual liquidated damages formulas, personal-guaranty scope beyond what Item 15/17 describe, or cross-default triggers beyond what Item 17 lists.
- **Sources:** Item 17 chart (pp.63-71), Item 15 (p.62), FA Article 16:2:1 (p.290), FA Article 21.11 (p.295), FA Article 21.13 (p.295).

## Deferred surfaced exhibit policy

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

- **FA (Exhibit D):** Partially clause-walked. Key operative burdens covered via Item 17 chart + A2 partial walk. Missing: detailed default/cross-default triggers, insurance schedules, records/reporting obligations. These do not materially weaken buyer confidence given Item 17 coverage.
- **DA (Exhibit C):** Not clause-walked. Territory and development schedule mechanics covered via Item 12. Missing: exact DA territory definition language, enforcement mechanics. Low buyer impact.
- **General Release (Exhibit F):** Not clause-walked. Required at renewal/transfer. Scope known from body ("release of any and all claims"). State addenda carve-outs documented. Missing: exact release language, specific carve-out provisions. Moderate buyer impact — but all franchise buyers should have legal counsel review the General Release before signing anyway.

---

## Source-grounding rule compliance

All weakness claims, gap assessments, and "prior run stronger" items above cite exact page numbers, exhibit letters, or section identifiers from the run files. No unsourced claims.
