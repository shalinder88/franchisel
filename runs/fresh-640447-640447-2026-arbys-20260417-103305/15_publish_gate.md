# Publish Gate — Arby's Franchisor, LLC — 2026 FDD (Filing 640447)

## Verdict: **2 — Publish with Caveats**

### Rationale

This extraction covers all 23 FDD items with operative depth, both sets of financial statements with notes, complete Item 19 and Item 20 tables, a structured state addenda extraction for 6 states, and a partial FA clause walk revealing key operative provisions. The run produces a comprehensive, evidence-grounded diligence package that a prospective franchisee could use as a substantive foundation for investment decision-making. The remaining gaps — primarily the incomplete FA clause walk and unread FA riders for additional states — are documented as extraction-depth gaps and do not create buyer-misleading conditions, as the key operative terms are covered through Item 17 chart cross-references and the partial A2 clause walk.

---

## Checklist Assessment

### 1. Item 19 Completeness ✅
All FPR tables are extracted: quartile distribution (4 quartiles + total), venue type breakdown (3 venue types). Population count of 2,182 (from 2,344) clearly stated with all 6 exclusion categories. Substantiation availability statement captured ("Upon your reasonable request, we will provide written substantiation"). All notes and caveats extracted including the important caveat that no cost/expense data is disclosed.

### 2. Item 20 Completeness ✅
All 5 standard tables present:
- Table 1: Systemwide summary (3 years × 3 types) — totals balance
- Table 2: Transfers by state (3 years) — total 57 in 2025
- Table 3: Franchised outlets by state (3 years) — footer totals 2,286→2,344 (net +58)
- Table 4: Company-owned by state (3 years) — footer totals 1,079→921 (net -158)
- Table 5: Projected openings — 9 signed not opened, 11 projected franchised, 0 company
- Gag clause flag: SET TO TRUE with verbatim quote from p. 83
- Multi-brand location notes captured

### 3. Item 21 Sufficiency ✅
- Auditor: KPMG LLP (identified)
- Opinion: Unqualified (clean) for both entities
- Going concern: No going-concern language
- Income statement: Fully extracted for both Franchisor LLC ($186.1M revenue, $153.0M net income) and ARG ($1.654B revenue, $52.0M net income)
- Balance sheet: Fully extracted for both entities
- Cash flows: Extracted for Franchisor LLC
- Notes: Franchisor LLC Notes 1-7 fully walked; ARG key notes (property/equipment, goodwill, securitization) partially walked

### 4. State Addenda Sufficiency ✅ (with caveats)
- 6 states identified and structured: California, Hawaii, Maryland, Minnesota, North Dakota, Washington
- Override families structured in `state_addenda_overrides` in canonical: forum selection, governing law, general release, noncompete, termination, non-renewal, jury trial, damages, statute of limitations, no-poaching, operating compliance
- No-waiver disclaimer applicable in 14 states
- **Caveat**: FA riders (pp. 302-312) covering additional states' modifications to the Franchise Agreement itself are surfaced but not fully structured. The FDD addenda are complete; the FA rider details for individual states beyond the FDD addenda level are partial.

### 5. Key Exhibit Sufficiency ⚠️ (partial)
- Exhibit B (Financial Statements): Deep-read ✅
- Exhibit D (Franchise Agreement): Partially clause-walked — Contract Data Schedule, Articles 10, 15, 20, 21 extracted; Articles 1-9, 12-14, 16, 18-19 not clause-walked but covered via Item 17
- Exhibit C (Development Agreement): Labeled only — key terms via Item 17
- Exhibit F (General Release): Labeled only — scope known from state addenda context
- Franchise Agreement clause walk assessment follows below

### 6. Unresolveds and Contradictions ✅
- 6 unresolveds present in canonical with id, description, severity, source
- No contradictions identified (no Item 20/21 count discrepancy)
- All unresolveds are genuine business-risk flags or data-gap flags, not extraction failures

### 7. Final Report Depth ✅
- 08_final_report.md is 29KB, approximately 550+ lines
- All required sections present: A (executive snapshot, 14 bullets), B (fees/investment), C (supplier/operations/tech), D (territory/competition), E (contract burden/legal), F (Item 19), G (Item 20), H (Item 21), I (state addenda), J (unresolveds), K (contradictions), L (final coverage note)
- Substantive narrative throughout — not a metrics summary

### 8. Score Gate ✅
- Overall grade: B+ (appropriate given partial FA clause walk)
- All items covered with evidence grounding
- Canonical fields populated with source_section, source_pages, confidence

---

## Franchise Agreement Clause-Walk Assessment

**Exhibits surfaced**: Exhibit D (FA, pp. 235-275, ~40 pages)

**Clause walk status**: Partial — A2 walked Contract Data Schedule (p. 236-237), Article 10 Advertising (p. 250), Article 15 Post-Termination/Self-Help (p. 260), Article 20 Acknowledgement (p. 265), Article 21 Governing Law/Forum/Jury Waiver (p. 265).

**What's covered elsewhere**: Item 17 chart (pp. 65-71) provides comprehensive summaries of term, renewal, termination (curable/non-curable), transfer, noncompete, dispute resolution, and death/disability. A2 contract burden depth pass confirmed jury waiver, self-help rights, advertising minimums, and acknowledgement provisions.

**What remains thin**: Articles 1-9 (grant, definitions, fees, site, operations, manual, suppliers, insurance), Articles 12-14 (confidentiality, noncompete detail, trademarks), Article 16 (transfer detail), Articles 18-19 (DA coordination, litigation provisions). However, these are standard franchise agreement provisions whose substance is adequately covered in the FDD body items.

**Verdict decision**: **Verdict 2 allowed** — key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty scope, venue) are adequately covered through Item 17 cross-references and A2 partial clause walk. The missing detailed walk of Articles 1-9 does not leave a material buyer-facing gap because these provisions are standard and their substance is disclosed in Items 5-11 of the FDD body. The guaranty scope is disclosed in Item 15 (principals only, not spouses). No unusual liquidated-damages formula, personal-guaranty scope beyond what's disclosed, or cross-default trigger was identified in the walked portions that suggests a hidden material burden.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 19 complete AUV extraction** (pp. 71-74): Both quartile and venue-type tables fully extracted with all 5 exclusion categories, population counts, and all notes including the substantiation availability statement.

2. **Item 20 all 5 tables with state-level detail** (pp. 74-83): Complete state-by-state data for all 3 years across Tables 1-5, including the critical gag clause disclosure (p. 83) and multi-brand location notes.

3. **Item 21 dual-entity financial statements** (pp. 174-216): Both Arby's Franchisor LLC and ARG financial statements read with notes, revealing the securitization structure, declining revenue trends, and ARG's significant operating income compression.

4. **Item 17 full chart extraction** (pp. 65-71): All 23 provisions (a through w) extracted with complete summaries, including the critical "materially different terms" renewal language and the narrow roast-beef-only noncompete scope.

5. **State addenda structured extraction** (pp. 293-301): 6 states with 19 structured overrides across 11 families, identifying material protections in Maryland (forum, release), Minnesota (termination cure, jury waiver), and North Dakota (noncompete, damages, jury waiver, release, forum, governing law).

6. **Item 6 complete fee table** (pp. 31-38): All 16 fee types extracted with 4 incentive royalty ramp schedules and advertising discount structure.

7. **Item 2 leadership roster** (pp. 21-24): 22 officers/directors with roles and tenure — complete roster.

### 2. Weakest Remaining Parts of the Run

1. **FA clause walk incomplete** (Exhibit D, pp. 235-275): Articles 1-9, 12-14, 16, 18-19 not directly walked. While key terms are covered via Item 17, unusual standard-form provisions or hidden burdens in these articles remain unverified.

2. **FA riders for additional states** (pp. 302-312): State-specific riders to the Franchise Agreement itself cover operational modifications for specific states. These pages were surfaced but not fully walked — potentially material modifications to FA terms for specific states beyond the FDD addenda.

3. **Development Agreement** (Exhibit C, pp. 217-228): Labeled only — full operative clause walk not performed. Key terms covered via Item 17 but DA-specific development schedule mechanics, cure provisions, and Territory detail not directly verified.

4. **General Release** (Exhibit F, pp. 313-317): Not clause-walked. The scope of claims released upon renewal and transfer is material — known to be limited by state addenda in MD, MN, ND, but the standard form's breadth is unknown.

5. **ARG financial statement note detail** (pp. 200-216): Key notes (property/equipment, goodwill, securitization) partially read. Lease accounting detail, revenue recognition for company-owned restaurants, segment reporting, and impairment methodology notes not fully walked.

### 3. Where a Prior or Manual Run May Still Be Stronger

1. **FA Articles 1-9 clause-by-clause detail**: A manual review would walk every operative clause in the FA, potentially surfacing unusual provisions regarding site selection timing requirements, landlord consent mechanics, proprietary supplier obligations, or insurance coverage minimums that are summarized but not fully detailed in the FDD body.

2. **ARG lease accounting and operating lease maturity schedule**: ARG has $435.8M in operating lease assets and $483.5M in lease liabilities — a manual review would extract the maturity schedule and identify the annual rent burden, which directly impacts company-owned restaurant economics and any future refranchising terms.

3. **Cross-default mechanics between FA and DA**: The interaction between FA termination triggers and DA termination is disclosed at summary level in Item 17 but the detailed cross-default cascade — particularly whether DA termination automatically terminates all underlying FAs — would be verified through direct clause reading.

4. **ARCOP cooperative governance and pricing mechanics**: The FDD body describes ARCOP at a high level but the cooperative agreement governing supply chain pricing, membership obligations, and exit provisions is not extracted.

### 4. Optional Max-3 Follow-Up Roadmap

1. **RT_depth_fa_full_clause_walk.json**: Complete clause walk of FA Articles 1-9, 12-14, 16, 18-19 (pp. 238-268). Focus on site selection timing, insurance minimums, proprietary supplier obligations, and cross-default with DA.

2. **RT_depth_fa_state_riders.json**: Walk FA riders (pp. 302-312) for state-specific modifications to the Franchise Agreement terms. Identify which states modify royalty, territory, termination, or transfer provisions at the agreement level.

3. **RT_depth_general_release.json**: Walk General Release (Exhibit F, pp. 313-317). Extract the scope of claims released, carve-outs, and interaction with state addenda limitations.

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies:**
- None identified.

**Business-Risk Flags:**
- U1: 115 refranchised units excluded from Item 19 — performance under franchise operation unknown (medium)
- U2: Royalty rate variation in Item 19 cohort — restaurants at different rate tiers may distort AUV comparability (medium)
- U4: DA terminates immediately on death of individual developer — no disability provision (medium)
- U6: ARG operating income declined 57% (2023-2025) — management fee to affiliate nearly doubled (medium)

**Extraction-Depth Gaps:**
- U3: ARG's non-party status vs. management role — structural risk documented but not fully analyzed (low)
- U5: FA clause walk incomplete — deferred, key terms covered via Item 17 (low)

### 6. Buyer-Trust Assessment

A serious buyer reviewing this run would find a substantive, well-structured extraction that accurately captures the core economics, legal mechanics, and risk profile of the Arby's franchise opportunity. The Item 19 AUV tables, complete Item 20 outlet data, dual-entity financial statements, and structured state addenda provide the quantitative foundation for investment analysis. The identified gaps — primarily the incomplete FA clause walk and select exhibit details — are clearly documented as extraction-depth gaps rather than omissions, and the key operative burdens are adequately covered through Item 17 cross-references. The run would serve as a reliable starting point for detailed due diligence, though a buyer should independently verify FA clause specifics before signing.

### 7. Source-Grounding Rule

All weaknesses, gaps, and "prior run stronger" claims above cite exact source page ranges:
- FA clause walk: Exhibit D, pp. 235-275 (specific articles and pages cited)
- FA state riders: pp. 302-312
- DA: Exhibit C, pp. 217-228
- General Release: Exhibit F, pp. 313-317
- ARG notes: pp. 200-216
- State addenda: pp. 293-301
- All strength claims cite specific page numbers from the extraction
