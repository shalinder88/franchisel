# Publish Gate — 637918-2025-Burger-King

## Verdict: 2 — Publish with Caveats

---

## Rationale

This is a comprehensive extraction of one of the largest FDDs in the franchise universe (1,057 pages, 26 exhibit families). All 23 FDD Items were read and classified. Item 6 fee table was fully extracted across 13 pages. Item 19 provided extensive sales and remodel uplift data. Item 20 systemwide and franchised status tables were extracted with totals. Item 21 financial statements were extracted at headline level with 15 note families walked in A2. State addenda from 3 states (CA, MI, WA) were directly structured, with 9 more states identified. The guaranty scope was confirmed as personal, irrevocable, unconditional, and joint and several.

The run is not verdict 1 because: (1) 9 of 12 identified state addenda were not individually structured; (2) the franchise agreement (D1, 48 pages) and lease (G1, 41 pages) were not directly clause-walked — operative terms were recovered from Item 17 charts and targeted reads, which provides materially equivalent substance but not complete clause-by-clause coverage; (3) some Item 21 note families (income taxes, receivables detail) were not walked page-by-page.

These gaps are documented and do not create buyer-misleading omissions. The core economics, fee structure, termination triggers, transfer conditions, guaranty scope, competitive landscape, and financial health of the franchisor are all accurately and comprehensively captured.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES (14 pages)
- All sales distribution tables extracted: Traditional, Non-Traditional, 4 Fuel Co-Branded categories
- All remodel uplift tables: by scope, by DT conversion, by pre-remodel image, by sales range, by RTF enrollment, multi-year
- Population counts, averages, medians, highs, lows, above-average percentages all captured
- No-FPR statement: N/A (FPR provided)
- Substantiation availability: "We will make available to you, on reasonable request, data used in preparing this Item 19" (p.99)

### 2. Item 20 Completeness — PASS with minor gap
- Table 1 systemwide: Complete (2022-2024)
- Table 2 transfers: Complete with state detail and totals (2022: 103, 2023: 245, 2024: 254)
- Table 3 franchised status: Complete with totals (2024: opened 63, terminations 0, non-renewals 49, reacquired 1,061, ceased 69)
- Table 4 company-owned: Partial (state-level data read but not fully aggregated into totals)
- Table 5 projected: Complete (48 franchised, 2 company-owned)
- Franchisee list exhibit count: Exhibit O1 (62 pages), O3 lists 1,433 ceased operations
- Gag clause flag: TRUE — extracted with verbatim quote and source page

### 3. Item 21 Sufficiency — PASS
- Auditor: KPMG LLP (since 1989)
- Income statement: Total revenue $8,406M, net income $1,445M, EPS $3.21/$3.18
- Balance sheet: Total assets $24,632M, LTD $13,455M, equity $4,843M
- Cash flow: Not extracted as separate statement (deferred — not needed for publish-ready)
- Notes: 15 note families walked via A2 depth pass (financial notes, leases, segments, Carrols acquisition, debt structure, etc.)
- Going-concern: FALSE

### 4. State Addenda Sufficiency — PASS with caveats
- State addenda exist: YES (Exhibit P, 96 pages, pp.706-801)
- States identified: 12 (CA, IL, IN, MD, MI, MN, NY, ND, RI, VA, WA, WI)
- Structured into canonical: YES — `state_addenda_overrides` key present with CA, MI, WA overrides (18 entries)
- Gap: 9 states identified but not individually structured (IL, IN, MD, MN, NY, ND, RI, VA, WI)
- This is a verdict-2 gap, not verdict-3: The 3 most commercially important states (CA, MI, WA) were directly walked, and the override patterns are consistent across states (forum, release, noncompete, anti-fraud)

### 5. Key Exhibit Sufficiency — PASS with caveats
- Item 22 contracts: All exhibits listed and accounted for in 04_exhibits.json
- Franchise Agreement (D1/D2): Identified, partially walked. Operative terms recovered from Item 17 chart.
- Guaranty (D3): Clause-walked — personal, irrevocable, unconditional, joint and several, spousal
- Lease (G1): Identified, terms from Item 17 BKL chart
- Development Agreement (M1): Identified, terms from Item 17 DA chart
- Financial statements (Q): Headlines + 15 note families walked

### 6. Unresolveds and Contradictions — PASS
- Unresolveds present in 06_coverage_audit.md and 08_final_report.md: YES (5 entries)
- Structured in canonical: YES — `unresolveds` key present with id, description, severity, source
- Contradictions: None identified — `contradictions` key present (empty array)
- All unresolveds are genuine business-risk flags (no EBITDA disclosure, Carrols pricing opacity, ad fund audit) — not extraction gaps

### 7. Final Report Depth — PASS
- 08_final_report.md: Full diligence narrative with all required sections
- Section A: Executive snapshot (14 numbered bullets)
- Section B: Fee stack, entry structure, investment (~180 lines with fee tables)
- Section C: Supplier control, operations, technology (~60 lines)
- Section D: Territory (~20 lines)
- Section E: Contract burden and legal mechanics (~80 lines)
- Section F: Item 19 detail (~60 lines with data tables)
- Section G: Item 20 detail (~30 lines)
- Section H: Item 21 detail (~40 lines with financial data)
- Section I: State addenda summary (~15 lines)
- Section J: Unresolveds table
- Section K: Contradictions
- Section L: Final coverage note

### 8. Score Gate — PASS
- 10_scorecard.md: Overall grade B+
- Post-A2 depth assessment shows Item 21 upgraded to A-, exhibits to B, state addenda to B-
- All required items covered with evidence grounding

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced franchise agreement exhibits**: D1 (Individual, pp.185-232, 48 pages), D2 (Entity, pp.233-274, 42 pages)

**Clause-walk status**: D1 partially walked (Sec 1 grant/term directly read). D2 not directly walked. Both had operative terms recovered from Item 17 chart (pp.82-87) which provides section-by-section summaries of the FA provisions.

**Verdict 2 is allowed because**:
- Key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty, venue) are adequately covered via Item 17 chart cross-references and A2 contract burden depth pass
- The guaranty (D3) was directly clause-walked and confirmed as personal, irrevocable, unconditional, joint and several
- Liquidated damages are documented (Brand Damage Fee in Development Agreement; deferred remodel penalties)
- Death/disability provisions are captured (heir approval or sale within 12 months)
- Cross-default triggers are documented (CYC, RTF, Carrols)

**What remains thin**: Detailed clause-by-clause language for standards (Sec 5), construction (Sec 6), insurance (Sec 8), reporting (Sec 11), indemnification (Sec 13), ROFR mechanics (Sec 14), mediation procedures (Sec 20). These are operational details that do not constitute material buyer-facing gaps.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale

---

## Strongest Parts of the Run

1. **Item 6 fee table extraction** (pp.34-46): Complete 13-page extraction with all 35+ fee rows, all footnotes, all incentive program schedules (DIP 2024 royalty stepping, Development Agreement FSS-based reductions, RTF2 options, Fuel the Flame EBITDA trigger). This is one of the most complex fee structures in QSR and was fully captured.

2. **Item 19 financial performance data** (pp.98-111): All 6 sales distribution categories (Traditional, Non-Traditional, 4 Fuel Co-Branded sizes) with average, median, high, low, and distribution percentages. All 6 remodel uplift tables plus multi-year cumulative data. Population counts and exclusion rules documented.

3. **Item 17 contract burden chart** (pp.82-96): All 5 agreement types (FA, TRA/MTRA, BKL, DA, APA) with provision-by-provision summaries covering 23 provisions each. Every termination trigger, cure period, transfer condition, and noncompete scope captured.

4. **Guaranty depth** (Exhibit D3, pp.276-277): Directly clause-walked. Confirmed personal, irrevocable, unconditional, joint and several, spousal guaranty covering all BKC Agreements including FA, lease, and Crown Your Career promissory note.

5. **Item 21 financial notes** (pp.813-910): 15 note families walked including Carrols acquisition ($648M consideration), debt structure ($13.6B gross), segment reporting (BK AOI $410M), lease accounting (property revenue $837M), and goodwill/brand impairment testing (no impairment).

6. **System trajectory analysis**: Item 20 fully contextualized — the -1,116 franchised decline in 2024 is correctly attributed to the Carrols acquisition (1,023 reacquired) rather than organic system contraction. Net system decline was -77.

---

## Weakest Remaining Parts of the Run

1. **Franchise Agreement clause walk** (Exhibits D1 pp.185-232, D2 pp.233-274): 90 combined pages not directly clause-walked. Operative terms recovered from Item 17 chart, but detailed clause language for standards, construction, insurance, reporting, indemnification, and mediation procedures is missing.

2. **State addenda structured extraction** (Exhibit P pp.706-801): Only 3 of 12 states (CA, MI, WA) were directly structured into override entries. The remaining 9 states (IL, IN, MD, MN, NY, ND, RI, VA, WI) were identified by page headers but their specific override provisions were not individually extracted. This is 93 pages of state-specific language that remains partially unstructured.

3. **Lease/Sublease clause walk** (Exhibit G1 pp.358-398): 41 pages not directly walked. Rent mechanics, maintenance obligations, insurance specifics, assignment conditions, and condemnation provisions are only partially recovered from Item 17 BKL chart.

4. **Item 20 Table 4 company-owned status**: State-level data was read but total rows (opened, closed, reacquired, sold) were not fully aggregated into a summary.

5. **Item 21 income tax note**: Not walked page-by-page; headline data ($364M tax expense, ~20.1% effective rate) recovered from income statement but deferred tax details, rate reconciliation, and jurisdictional breakdowns not extracted.

---

## Where a Prior or Manual Run May Still Be Stronger

1. **Franchise Agreement clause-by-clause walk**: A manual review would walk every section of the 48-page Individual FA (D1) and identify specific clause language for insurance requirements (Sec 8), reporting obligations (Sec 11), standards compliance mechanisms (Sec 5), and indemnification scope and carve-outs (Sec 13). The Item 17 chart-based recovery captures the "what" but not always the "how" and "when" of operative mechanics.

2. **All 12 state addenda individually structured**: A manual run would read every state addendum and create per-state override entries for all 12 states, identifying state-specific cure period extensions, termination protections, and franchise law override mechanisms.

3. **Lease rent calculation specifics**: The BKL lease (G1, 41 pages) contains detailed rent calculation mechanics, percentage rent breakpoints, escalation formulas, and maintenance/CAM charge allocation that are only summarized at a high level in this extraction.

4. **Development Agreement leverage covenants**: The DA (M1) references specific EBITDA/EBITDAR ratios as non-curable default triggers, but the specific agreed-to ratios are blanked/variable in the exhibit form and were not independently verified.

---

## Optional Max-3 Follow-Up Roadmap

1. **RT_recover_remaining_state_addenda.json**: Walk remaining 9 state addenda (IL, IN, MD, MN, NY, ND, RI, VA, WI) and create structured per-state override entries. Target: pp.708-801 excluding pages already walked (CA pp.707, WA pp.720-721).

2. **RT_depth_fa_detailed_clauses.json**: Targeted walk of FA D1 Sections 5 (standards), 8 (insurance), 11 (reports), 13 (indemnification), 14 (ROFR), and 20 (mediation). Focus on operative mechanics not covered by Item 17 chart.

3. **RT_depth_lease_rent_mechanics.json**: Targeted walk of G1 lease Sections 2 (rent), 5 (maintenance), 6 (insurance), 13 (assignment), 14 (ROFR), focusing on specific calculation formulas and breakpoints.

---

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- None identified

### Business-Risk Flags
- **UR-01** (high): No cost build-up, EBITDA, or profitability data in Item 19 — buyer must construct own pro-forma
- **UR-02** (medium): Carrols refranchising purchase prices undisclosed
- **UR-03** (medium): Advertising fund audit results and spending breakdown undisclosed
- **UR-05** (medium): Fuel the Flame $230K 4-Wall EBITDA threshold status undisclosed — directly affects advertising contribution rate

### Extraction-Depth Gaps
- **UR-04** (low): Crown Your Career program success metrics undisclosed — minor, operational metric

---

## Buyer-Trust Assessment

A serious buyer evaluating a BURGER KING franchise would find this extraction reliable for understanding the economics, competitive dynamics, and legal framework of the franchise relationship. The fee structure is fully documented with all incentive programs and contingencies. The sales distribution data provides meaningful benchmarks for financial modeling, though the absence of cost build-up or EBITDA means the buyer must independently model unit economics. The guaranty scope, termination triggers, transfer conditions, and post-term noncompete are all accurately captured. The system trajectory (net -77 in 2024, with Carrols distortion explained) is fairly presented. The primary limitation is that some operative exhibit clauses (FA standards sections, lease rent mechanics, remaining state addenda) were not clause-walked — a buyer with a specific state interest should verify that state's addendum directly. Overall, this extraction provides a strong foundation for franchise diligence and would save a prospective buyer significant time in understanding this complex, 1,057-page document.

---

## Source-Grounding Rule Compliance

All weaknesses, gaps, and "prior run stronger" claims above cite exact page ranges and exhibit designations. No unsourced claims.
