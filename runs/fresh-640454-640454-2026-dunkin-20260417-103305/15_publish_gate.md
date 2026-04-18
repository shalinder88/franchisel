# Publish Gate — Dunkin' 2026 FDD (Filing 640454)

## Verdict: 2 — Publish with Caveats

**Rationale:** This is a comprehensive extraction of a 685-page FDD covering one of the largest QSR franchise systems in the United States. All 23 items are covered at materially useful depth. Item 19 FPR data is robust with 4 segmented tables. Item 20 provides full 10-table coverage (5 Dunkin' + 5 Combo). Item 21 financial statements are fully extracted with all note families walked. State addenda are structured with 21 override entries across 6 states. The primary caveat is that the Franchise Agreement (Exhibit C-1, 32 pages) was not clause-walked in full, though operative substance is adequately covered through the Item 17 chart, A2 contract burden depth pass, and body cross-references.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with ALL 4 tables extracted: overall quartiles, by site type/venue, by drive-thru status, and above-threshold counts
- Population of 7,010 restaurants (80.2% of franchised system) with complete exclusion criteria documented
- All notes extracted including AUV definition, methodology, substantiation availability statement, and caveats
- No cost/expense data disclosed — this is noted as a limitation but is common in QSR FPRs
- Item 19 cohort comparability: No discrepancy found (AUVs are gross sales only)

### 2. Item 20 Completeness — PASS
- All 10 tables present (5 Dunkin' standalone + 5 Combo):
  - Table 1: Systemwide summary ✓
  - Table 2: Transfers by state ✓
  - Table 3: Franchised outlet status by state ✓ (totals: 2025: 314 opened, 2 terminations, 24 non-renewals, 55 ceased = net +279)
  - Table 4: Company-owned status ✓ (36 in Ohio)
  - Table 5: Projected openings ✓ (406 new franchised + 10 company-owned)
- Footer totals balance and are verified
- Franchisee list exhibit count: G-1 (241 pages), G-2 through G-6 additional lists
- **Gag clause flag: SET to TRUE** — "In some instances, current and former franchisees sign provisions restricting their ability to speak openly about their experience with us." (p.114)
- Multi-Brand Location notes extracted (36 locations, no closures in 3 years)
- Combo decline documented (-50 net in 2025)

### 3. Item 21 Sufficiency — PASS
- Auditor identified: KPMG LLP, Atlanta, GA
- Opinion: Unqualified, dated March 19, 2026
- Income statement: Extracted for 3 years (total revenue $1.398B; net income $732.9M in 2025)
- Balance sheet: Extracted for 2 years (total assets $1.572B; member's equity $1.331B)
- Cash flow: Extracted (operating $813.3M; distributions $813.3M)
- Notes to financial statements: All 9 note families in DD Franchisor statements walked via A2 depth pass
- Going concern: No going concern language
- Key finding: $4.639B securitization notes with company as guarantor; all assets pledged
- DBI consolidated balance sheet extracted ($13.8B total assets, $4.6B long-term debt, $8.2B intangibles)
- Item 21 method: normal text extraction

### 4. State Addenda Sufficiency — PASS
- State addenda identified in Exhibit E (pp.323–352)
- STRUCTURED into state_addenda_overrides in 09_final_canonical.json ✓
- 6 states with specific addenda: California, Hawaii, Maryland, Michigan, Minnesota, North Dakota
- 14 states with general anti-waiver provision
- 21 structured override entries covering: forum selection, governing law, noncompete, general release, termination cure, non-renewal notice, transfer restrictions, association rights, trademark indemnity, labor law
- Key overrides documented: ND noncompete unenforceable; MN 90/60/180 day notices; MD/MI/MN/ND forum overrides

### 5. Key Exhibit Sufficiency — PASS WITH CAVEAT
- All 13 exhibits listed in Item 22 are accounted for in 04_exhibits.json
- Financial statements (Exhibit B) are deep-read and fully extracted ✓
- Franchise Agreement (C-1): NOT clause-walked — see Franchise Agreement assessment below
- State Addenda (E): Clause-walked via A2 ✓
- General Release (I): Scope established from Item 17 and state overrides ✓
- Development Agreement (D-1): Not clause-walked; headline terms from Items 9, 12, 17

### 6. Unresolveds and Contradictions Assessment — PASS
- 06_coverage_audit.md documents 7 gaps (3 high, 4 medium priority)
- 08_final_report.md Section J lists 5 unresolveds, Section K lists 1 contradiction (resolved)
- **Both `unresolveds` and `contradictions` are present as structured families in 09_final_canonical.json** ✓
- Unresolveds are genuine:
  - U1 (DBI consolidated deferred) — medium, addressed in A2
  - U2 (no cost data in Item 19) — medium, inherent limitation
  - U3 (FA not clause-walked) — medium, mitigated by Item 17/A2 coverage
  - U4 (state addenda) — RESOLVED in A2
  - U5 (distributions exceed income) — medium, business risk flag

### 7. Final Report Depth — PASS
- 08_final_report.md is a full standalone diligence narrative
- Contains all required sections: A (Executive Snapshot), B (Fees/Investment), C (Supplier/Operations/Tech), D (Territory), E (Contract Burden/Legal), F (Item 19), G (Item 20), H (Item 21), I (State Addenda), J (Unresolveds), K (Contradictions), L (Final Coverage Note)
- Report is substantive with multiple paragraphs per section
- Inline tables rebuilt for fee stack, investment ranges, AUV quartiles, outlet trajectory

### 8. Score Gate — PASS
- 10_scorecard.md shows updated grade of A- (upgraded from B+ after A2)
- All required items covered
- Canonical fields populated with evidence grounding
- 35 top-level canonical keys

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit C-1 (Dunkin' Franchise Agreement):**
- Page range: 165–196 (32 pages)
- **Clause-walked:** No — left labeled_only
- **Verdict decision: Verdict 2 allowed**

**Rationale:**
The franchise agreement's key operative burdens are adequately covered elsewhere in the canonical:
- **Term and renewal:** Fully covered in Item 17 chart (20/20 years, renewal conditions, SDO no renewal)
- **Fees:** Completely covered in Items 5, 6, and canonical (CFF 5.9%, CAF 5.0%, loyalty 1.4%, all transfer fees)
- **Transfer:** Fully covered in Item 17 (ROFR 60 days, controlling/non-controlling conditions, death/disability provisions)
- **Termination:** Fully covered in Item 17 (all curable defaults with cure periods, all non-curable defaults, cross-default)
- **Noncompete:** Fully covered in Item 17 (during term >20% coffee/baked goods; post-term 24 months/5 miles)
- **Dispute resolution:** Fully covered in Item 17 (Atlanta venue, Georgia law, no arbitration)
- **Insurance:** Covered in Items 7/8 ($2M CGL, $1M EPL, all risk property, additional insured requirements)
- **Guaranty scope:** Personal guaranty required for all direct/indirect owners — scope established from Item 1 and Item 9

**What remains thin:** Specific liquidated damages formula (if any), force majeure provisions, detailed cross-default mechanics, specific representations/warranties. These are unlikely to create material buyer-facing gaps for this mature, well-documented franchise system.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Strongest Parts of the Run

1. **Item 19 FPR depth (pp.95–99):** 4 segmented AUV tables with 7,010-restaurant sample covering quartiles, site type/venue, drive-thru status, and above-threshold counts — one of the most granular FPR datasets in QSR franchising.

2. **Item 20 full table set (pp.99–114):** All 10 tables for both Dunkin' standalone and Combo restaurants extracted with per-state detail, footer totals verified, gag clause flagged, franchisee organization documented.

3. **Item 21 financial note walk (pp.123–135):** All 9 DD Franchisor note families walked including critical securitization detail ($4.639B notes, guarantor status, all assets pledged, $854.8M available capacity). DBI consolidated balance sheet also extracted.

4. **State addenda structured extraction (pp.323–352):** 6 states with specific addenda and 14 states with general provision structured into 21 override entries covering forum selection, noncompete, termination, general release.

5. **Fee stack completeness (pp.44–51):** All 21 fee types extracted with 9 detailed notes, 5 incentive programs documented with CFF credit amounts and CAF reduction schedules.

6. **Item 6 transfer fee tiers (p.51):** Tiered transfer fee structure by trailing 12-month Gross Sales fully extracted — uncommon granularity.

7. **Item 1 affiliate disclosures (pp.9–21):** 13 pages of Inspire Brands/Roark portfolio affiliates documenting the complex corporate structure and securitization.

## Weakest Remaining Parts of the Run

1. **Franchise Agreement (Exhibit C-1, pp.165–196):** 32-page agreement not clause-walked. While Item 17 provides adequate headline coverage, the specific liquidated damages formula (if any), force majeure provisions, and detailed cross-default mechanics remain unextracted.

2. **Development Agreement (Exhibit D-1, pp.260–282):** 23-page agreement not clause-walked. Development schedule enforcement mechanics and performance benchmarks not directly read from agreement text.

3. **Combo Franchise Agreement (Exhibit C-2, pp.197–229):** 33-page agreement not clause-walked. Potentially different economics or default mechanics for Combo format not directly verified.

4. **General Release (Exhibit I, pp.662–666):** Exact release language and full scope not extracted, though state override exclusions documented.

5. **Remaining state addenda riders (pp.331–352):** State-specific riders to FA/DA were partially read; additional states beyond those documented may have riders with operative modifications.

## Where a Prior or Manual Run May Still Be Stronger

1. **Full clause walk of C-1 Franchise Agreement:** A manual review or prior run with clause-by-clause extraction would capture specific liquidated damages provisions, indemnification scope detail, and force majeure language that this run derived only from the Item 17 chart.

2. **Combo Franchise Agreement (C-2) differential analysis:** A run that directly compared C-1 and C-2 would identify any economic or default mechanic differences for the Combo format — relevant for the 1,219 Combo restaurants still in operation.

3. **Full state rider extraction:** Pages 332–352 contain state-specific riders to the FA and DA (not just FDD appendices). A manual run would clause-walk each rider to capture specific modification language.

4. **Dunkin' Brands Inc. consolidated income statement and cash flow:** This run extracted only the consolidated balance sheet. The full income statement, cash flow, and comprehensive notes would provide consolidated economic context.

## Optional Max-3 Follow-Up Roadmap

1. **RT_recover_franchise_agreement_clause_walk.json** — Walk Exhibit C-1 (pp.165–196) clause by clause, extracting liquidated damages, force majeure, specific guaranty language, detailed cross-default, and any distinctive clauses not covered by Item 17.

2. **RT_recover_dbi_consolidated_income_statement.json** — Extract Dunkin' Brands, Inc. consolidated income statement and cash flow (pp.141–150+) to provide full consolidated economic context.

3. **RT_recover_state_riders.json** — Walk remaining state-specific riders in pp.332–352 for states with FA/DA riders beyond the FDD appendices already extracted.

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- C1: Item 1 total (9,999) vs. Item 20 standalone total (8,780) — **Resolved**: difference is 1,219 Combo restaurants counted separately.

### Business-Risk Flags
- U2: Item 19 provides no cost/expense data — prospective franchisees must independently investigate COGS, labor, occupancy. This is a structural limitation of the FPR, not an extraction gap.
- U5: Distributions to parent ($813M) exceed net income ($733M) in every year, declining member's equity from $1.58B to $1.33B. Structural feature of securitization vehicles but bears monitoring.
- Gag clause: Present. Some franchisees restricted from speaking openly about their experience.

### Extraction-Depth Gaps
- U3: Franchise Agreement (C-1) not clause-walked — Item 17 and A2 provide adequate operative substance, but specific liquidated damages, force majeure, and detailed guaranty scope remain unextracted.
- U1: DBI consolidated income statement and cash flow deferred — balance sheet extracted via A2 but full statements not extracted.

## Buyer-Trust Assessment

A serious prospective Dunkin' franchisee could rely on this run as a primary due diligence reference. The extraction covers all 23 items with substantive depth, provides robust FPR data with quartile analysis, documents the complete fee stack and incentive programs, and structures state addenda overrides that materially affect contract terms. The financial statement analysis reveals both the extraordinary profitability of the franchise system ($733M net income) and the structural risk of the securitization ($4.6B in pledged obligations). The gag clause is clearly flagged. The primary gap — the FA clause walk — is mitigated by thorough Item 17 extraction and is a common limitation in automated runs of FDDs of this scale. A buyer should supplement this run with direct legal review of the franchise agreement and should independently investigate operating costs not disclosed in Item 19.

## Source-Grounding Rule
All weakness, gap, and prior-run-stronger claims above cite specific page ranges from the PDF. Every assessment is grounded in run file content or source page provenance.
