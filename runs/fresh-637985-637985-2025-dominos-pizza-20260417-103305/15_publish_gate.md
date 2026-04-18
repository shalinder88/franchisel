# Publish Gate — Domino's Pizza Franchising LLC (637985-2025)

## Verdict: 2 — Publish with Caveats

## Rationale

This extraction covers all 23 FDD items with high depth across the most critical sections (Items 6, 7, 19, 20, 21). The A2 depth passes added substantial financial note detail, franchise agreement clause walk (30 families), and structured state addenda (20 overrides across 6 states). The remaining gaps — primarily the Lease Rider clause walk and Non-Traditional FA variant comparison — are secondary to the core franchise economics and legal burden already extracted. The run is suitable for a serious buyer's first-pass analysis but should be supplemented with Lease Rider review and Non-Traditional FA comparison for full coverage.

---

## Checklist Assessment

### 1. Item 19 Completeness — PASS
- FPR provided for Traditional Stores (franchised and company-owned)
- All AWUS tables extracted (5 years, franchised/company/combined)
- Median weekly unit sales extracted (5 years)
- EBITDA by tier extracted (5 tiers, with store counts and % at/above)
- Population counts: 6,262 of 6,699 stores (93.5% reporting)
- Exclusion rules documented: 256 incomplete P&L + 181 not full year
- Substantiation availability statement captured
- Siting model (SIMMS) supplemental FPR disclosed
- Source: 03_tables.json items item19_awus, item19_median, item19_ebitda; 02_reader_report.md Pass F; 08_final_report.md Section F

### 2. Item 20 Completeness — PASS
- Table 1 (systemwide): Traditional + Non-Traditional + Development Agreements, all 3 years
- Table 2 (transfers): Traditional + Non-Traditional + DA, by state, all 3 years. Totals: 443/523/550
- Table 3 (franchised status): Traditional + Non-Traditional + DA, by state, all 3 years with footer totals
- Table 4 (company-owned status): By state, all 3 years with footer totals
- Table 5 (projected openings): By state, signed-not-opened (20), projected franchised (190), projected company (6)
- Gag clause flag: FALSE (verbatim: "We have not entered into agreements with confidentiality clauses...")
- Franchisee list exhibit count: Exhibit B (~172 pages Traditional), B-1 (Non-Traditional), B-2 (108 franchisees + 27 developers who left)
- Franchisee organizations: 2 independent + 4 sponsored advisory groups
- Source: 03_tables.json, 05_canonical.json item20_outlet_data, 02_reader_report.md Pass F

### 3. Item 21 Sufficiency — PASS
- DPF auditor: PwC, unqualified, March 21, 2025
- DPL auditor: PwC, unqualified
- Balance sheets: DPF ($17.4M assets, $17.3M member's interest) and DPL ($1.74B assets, $(3.95)B member's deficit)
- Income statements: DPF ($487M revenue, $463M net income) and DPL ($4.71B revenue, $584M net income)
- Cash flow statements: Both extracted
- Notes covered via A2 depth pass: DPF 12 note families, DPL 11 note families including debt structure, leases, equity comp, related party
- Going concern: No going-concern language in either set
- Key observation: $1.145B in Notes due for refinancing October 2025 (2018 7.5yr + 2015 10yr)
- Source: RT_depth_financial_notes.json, 09_final_canonical.json item21_financial_statements

### 4. State Addenda Sufficiency — PASS
- 6 states identified: California, Illinois, Hawaii, Maryland, Minnesota, Washington
- 14-state general no-waiver provision captured
- 20 structured overrides in RT_depth_state_addenda_promotion.json
- Summary override table by family × state completed
- State addenda structured into canonical via state_addenda_overrides key
- Source: RT_depth_state_addenda_promotion.json, 09_final_canonical.json state_addenda_overrides

### 5. Key Exhibit Sufficiency — PASS WITH CAVEATS
- All 12 Item 22 contracts accounted for in 04_exhibits.json
- Exhibit C (DPF financials): Fully read, notes depth-walked
- Exhibit D (DPL financials): Fully read, notes depth-walked
- Exhibit E (Traditional FA): Clause-walked — 30 clause families extracted in RT_depth_contract_burdens.json
- Exhibit F (Non-Traditional FA): Not compared to Standard FA — **CAVEAT**: potential variant terms not extracted (only 25 stores in system)
- Exhibit G (Development Agreement): Key terms from Item 17 chart; not independently walked
- Exhibit K (Lease Rider): 17 pages — **CAVEAT**: not clause-walked; material for all franchisees' real estate burden
- Other exhibits (H, I, J, L-R): Labeled/cataloged; key terms summarized in body Items

### 6. Unresolveds and Contradictions — PASS
- 5 unresolveds in canonical `unresolveds` array: securities litigation, servicer replacement, tech cap ambiguity, insurance ceiling, DPL leverage
- All are genuine business-risk flags, not extraction gaps
- 0 contradictions identified (internally consistent outlet counts confirmed)
- Unresolveds discussed in 08_final_report.md Section J and 06_coverage_audit.md
- Source: 09_final_canonical.json unresolveds, contradictions

### 7. Final Report Depth — PASS
- 08_final_report.md is a full standalone diligence report
- All required sections present: A (exec snapshot, 15 bullets), B (fees/investment with inline tables), C (supplier/ops/training/tech), D (territory), E (contract burden/legal), F (Item 19 with tier analysis), G (Item 20 with trajectory narrative), H (Item 21 with full financial walk), I (state addenda with per-state detail), J (unresolveds), K (contradictions), L (coverage note)
- Report depth: ~600+ lines, well above 500-line minimum
- Source: 08_final_report.md

### 8. Score Gate — PASS
- Overall grade: A- (upgraded from B+ after A2 depth passes)
- All items A or A-
- Canonical has 42+ top-level keys with evidence grounding
- Source: 10_scorecard.md

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit E (Traditional Store Standard Franchise Agreement):**
- Page range: 329–386 (58 pages)
- Clause-walked: YES — 30 clause families extracted in RT_depth_contract_burdens.json
- Key operative burdens covered: grant/term, royalty, advertising, site selection, construction, training, operations, insurance, technology, reporting, inspections, termination triggers (immediate + curable), post-termination, purchase option, noncompete (during + post), confidentiality, transfer, right of first refusal, death/disability, indemnification, independent contractor, governing law, integration, guaranty, force majeure
- Verdict: No material gaps from franchise agreement clause walk

**Exhibit F (Non-Traditional Store Franchise Agreement):**
- Page range: 387–445 (59 pages)
- Clause-walked: NO
- Reason: Item 17 states sections are "the same in each one of these agreements" — only 25 Non-Traditional stores in system
- Impact: Low — Standard FA terms apply unless noted; material deviations unlikely given Item 17 disclosure
- Verdict 2 allowed: Adequate for non-priority variant

**Exhibit G (Development Agreement):**
- Page range: 446–462 (17 pages)
- Clause-walked: NO (key terms from Item 17 DA chart)
- Impact: Moderate — development area, termination triggers, noncompete during term all captured from Item 17 chart
- Verdict 2 allowed: Key terms captured cross-referentially

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Mandatory Sections

### 1. Strongest Parts of the Run
1. **Item 19 EBITDA tier analysis** (pp.66-67): Five tiers with store counts, variable/fixed cost breakdowns, and % achieving — provides granular profitability picture rare among franchise FPRs
2. **Item 6 fee table** (pp.22-28): Complete 27+ row fee table across 8 pages with all 8 footnotes — every fee component captured including hardware bundles
3. **Item 20 systemwide tables** (pp.68-87): All 5 standard tables plus Non-Traditional and DA tables with full state-by-state data; 550 transfers captured
4. **DPL financial statement notes** (pp.308-328): Securitization debt structure ($4.97B total), lease structure ($91.2M rent expense), equity compensation ($43.3M), and $1.145B refinancing event documented
5. **Franchise Agreement clause walk** (pp.329-386): 30 clause families extracted covering all material operative burdens including the purchase option formula (Section 19) and guaranty scope
6. **State addenda structured extraction** (pp.89-95): 20 overrides across 6 states with per-override why-it-matters assessment; California Fast Food Act impact on store economics highlighted
7. **Item 2 leadership roster**: Complete 21-person roster with roles and tenure

### 2. Weakest Remaining Parts of the Run
1. **Lease Rider (Exhibit K, pp.502-518)**: 17-page rider not clause-walked. This rider affects every franchisee's real estate relationship and may contain franchisor access rights, assignment-on-default provisions, and relocation obligations not captured elsewhere.
2. **Non-Traditional FA variant comparison (Exhibit F, pp.387-445)**: 59-page agreement not compared to Standard FA. While only 25 stores operate under this agreement, potential variant economics (different investment ranges, territory, operating requirements) are not captured.
3. **Development Agreement clause walk (Exhibit G, pp.446-462)**: Key terms captured from Item 17 chart but direct clause-level detail not extracted. Development obligations, milestone defaults, and area modification procedures not independently verified.
4. **DPL income tax note**: Full tax provision structure (current vs. deferred, rate reconciliation) not extracted from DPL notes. DPL paid $161M in cash taxes in 2024; effective rate detail would clarify tax efficiency.
5. **Item 19 cohort comparability**: No comparability gap identified (royalty rate in Item 19 EBITDA calculation appears to use current 5.5% rate), but this was not independently verified against Item 6 footnote detail. The EBITDA computation includes supply chain profit sharing/volume discounts which current new franchisees may not immediately qualify for.

### 3. Where a Prior or Manual Run May Still Be Stronger
1. **Lease Rider operative burden**: A manual review of Exhibit K (pp.502-518) would surface franchisor real estate rights (access, assignment on default, collateral assignment, signage control) that affect every franchisee's occupancy security. This run identifies the gap but does not fill it.
2. **Operating Manual scope**: Exhibit M lists 28 pages of Operating Standards TOC and 57 pages of Product Standards TOC (pp.525-530). A manual review could assess the breadth and specificity of operational requirements not visible from the FDD body alone.
3. **Sale of Assets Agreement (Exhibit I, pp.469-491)**: For franchisees buying existing stores, the 23-page agreement contains representations, warranties, indemnifications, and purchase price mechanics not extracted. A manual review would benefit store-acquisition prospects.
4. **DPC Dash investment context**: DPL's $82.7M investment in DPC Dash (Domino's China master franchisee) is noted but not analyzed for financial risk implications. A manual review would assess China-specific risk.

### 4. Optional Max-3 Follow-Up Roadmap
1. **RT_depth_lease_rider.json**: Walk Exhibit K (pp.502-518) clause by clause — franchisor access rights, assignment on default, collateral assignment, signage, relocation obligations, lease approval requirements.
2. **RT_depth_item19_cohort_comparability.json**: Verify that Item 19 EBITDA tiers use current 5.5% royalty rate and current advertising contribution; check if supply chain profit sharing included in EBITDA is available to new franchisees on day one.
3. **RT_depth_dpl_tax_structure.json**: Extract full DPL income tax note — current vs. deferred breakdown, effective tax rate reconciliation, state tax allocation.

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies:**
- None identified

**Business-Risk Flags:**
- U1: Securities class action against DPI officers (medium severity, Item 3 pp.18-20)
- U2: DPL securitization servicer replacement mechanism untested (low severity, Item 1 pp.10-11)
- U3: Brand Technology cost cap excludes initial PULSE and renewal requirements (medium severity, Items 8/11 pp.34/39)
- U4: Insurance cost estimate may be "significantly higher" with no disclosed maximum (medium severity, Item 7 note 6 p.32)
- U5: DPL member's deficit $(3.95)B with $1.145B refinancing needed October 2025 (medium severity, Exhibit D p.303, DPF Note 3 p.297)

**Extraction-Depth Gaps:**
- Lease Rider (Exhibit K) not clause-walked
- Non-Traditional FA variant terms not compared
- Development Agreement not independently walked
- DPL income tax detailed note structure not extracted

### 6. Buyer-Trust Assessment

A serious buyer considering a Domino's franchise would find this run materially useful for understanding the franchise's economic structure, fee burden, performance data, and legal framework. The extraction captures every major financial metric, all operative contract terms from the franchise agreement, and structured state addenda overrides. The Item 19 EBITDA tier analysis alone provides more actionable economic insight than most franchise dossiers. The main limitation is the unwalked Lease Rider, which a buyer should request and review with their attorney before signing any lease. The DPL leverage ($5B debt, member's deficit) is not a franchise-system risk per se — it's a capital structure feature of the securitization — but the October 2025 $1.145B refinancing event warrants monitoring. Overall, this run would serve as a strong foundation for a buyer's due diligence, supplemented by franchisee conversations (facilitated by the no-gag-clause policy) and real estate attorney review.

### 7. Source-Grounding Rule
All weaknesses, gaps, and prior-run claims above cite exact source pages or section identifiers from the run files.

---

## Final File Inventory

| File | Status |
|------|--------|
| 00_bootstrap.json | Complete |
| 00_item_map.json | Complete |
| 01_source_map.md | Complete |
| 02_reader_report.md | Complete |
| 03_tables.json | Complete (12 tables) |
| 04_exhibits.json | Complete (20 exhibits) |
| 05_canonical.json | Complete |
| 06_coverage_audit.md | Complete |
| 07_retry_tasks.md | Complete |
| 08_final_report.md | Complete (~600+ lines) |
| 09_final_canonical.json | Complete (42+ keys) |
| 10_scorecard.md | Complete (A-) |
| 11_canonical_enriched.json | Complete |
| 12_canonical_enriched_v2.json | Complete |
| 14_run_summary.json | Complete |
| 15_publish_gate.md | Complete |
| RT_depth_financial_notes.json | Complete |
| RT_depth_contract_burdens.json | Complete (30 families) |
| RT_depth_promotion_audit.json | Complete (10 facts) |
| RT_depth_state_addenda_promotion.json | Complete (20 overrides) |
