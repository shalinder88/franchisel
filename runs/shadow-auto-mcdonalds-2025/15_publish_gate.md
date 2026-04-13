# Publish Gate — McDonald's USA, LLC FDD (638437-2025)

## Verdict: 2 — Publish with Caveats

The extraction covers all 23 body items at A-grade depth, includes full financial statement extraction with all note families, complete Item 19 with cohort comparability analysis, complete Item 20 with all 5 tables, complete state addenda structured into canonical, gag clause identified, and full franchise agreement clause walk. Minor caveats relate to variant franchise agreements (Satellite, Walmart) and partial Operator's Lease clause walk.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided:** YES
- **All tables extracted:** YES — pro forma at three sales tiers with population counts, percentages, and distributions
- **Notes extracted:** YES — all 3 notes plus cohort comparability analysis
- **Population counts:** YES — 12,572 all traditional, 12,023 franchised, 549 McOpCo, 11,332 pro forma
- **Exclusion rules:** YES — McOpCo excluded, Satellites excluded, changed-owner restaurants excluded
- **Substantiation availability:** YES — noted as available upon reasonable request
- **Cohort comparability:** IDENTIFIED AND QUANTIFIED — 4% vs 5% royalty, $30-40K/yr impact
- **PASS**

### 2. Item 20 Completeness
- **All 5 tables:** YES (Systemwide, Transfers, Franchised Status, Company-Owned Status, Projected Openings)
- **Total rows balance:** YES — verified across all tables
- **Franchisee list count:** Exhibit S = 113 franchisees who ceased
- **Gag clause flag:** YES — explicitly set and sourced (page 55)
- **State-level detail:** YES — all states extracted for Tables 2-5
- **Footer totals:** YES — all footer totals captured
- **PASS**

### 3. Item 21 Sufficiency
- **Auditor identified:** YES — Ernst & Young LLP
- **Income statement:** YES — all line items for 2022-2024
- **Balance sheet:** YES — all line items for 2023-2024
- **Cash flow:** YES — all sections for 2022-2024
- **Notes to financial statements:** YES — 18 note families walked in A2
- **Going-concern status:** NO going concern language
- **PASS**

### 4. State Addenda Sufficiency
- **All state addenda identified:** YES — 6 states (CA, HI, MD, MN, ND, WA)
- **Structured into canonical:** YES — 16 overrides structured per-state in `state_addenda_overrides` in `09_final_canonical.json`
- **Override families structured:** YES — anti_waiver, forum_selection, governing_law, general_release, termination, transfer, noncompete, no_poach, labor_compliance, trademark_protection
- **PASS**

### 5. Key Exhibit Sufficiency
- **Item 22 exhibits accounted for:** YES — all 10 listed exhibits (B-J, M) identified in 04_exhibits.json
- **Financial exhibits:** Exhibit A complete (statements + all notes)
- **Franchise agreements:** Exhibit B complete clause walk. C and D identified but not walked (variant formats).
- **Guaranty exhibits:** Not a separate exhibit — guaranty is part of loan documents (Exhibit N)
- **PASS with caveat** — Exhibits C, D, N not directly clause-walked

### 6. Unresolveds and Contradictions
- **Unresolveds in audit/report:** YES — 3 unresolveds (UNR-001 high, UNR-002 medium, UNR-003 medium)
- **Unresolveds in canonical:** YES — `unresolveds` key present in 09_final_canonical.json
- **Contradictions in audit/report:** YES — 2 contradictions (CON-001 low, CON-002 high)
- **Contradictions in canonical:** YES — `contradictions` key present in 09_final_canonical.json
- **All unresolveds genuine:** UNR-001 is a business-risk flag (cohort comparability). UNR-002 and UNR-003 are extraction-depth gaps.
- **PASS**

### 7. Final Report Depth
- **Full diligence report:** YES — 08_final_report.md contains sections A through L
- **Executive snapshot:** YES — 13 numbered bullets
- **Fees/investment:** YES — complete fee stack, investment table, co-investment detail
- **Supplier/operations/tech:** YES — supplier controls, training, technology stack
- **Territory:** YES — no territory, encroachment risk
- **Contract burden/legal:** YES — term, renewal, transfer, termination, noncompete, dispute resolution, litigation
- **Item 19 detail:** YES — full sales data, pro forma, cohort comparability with dollar impact
- **Item 20 detail:** YES — all tables, gag clause, organizations
- **Item 21 detail:** YES — auditor, statements, key observations
- **Unresolveds section:** YES — 3 items
- **Contradictions section:** YES — 2 items
- **State addenda:** YES — all 6 states discussed
- **Final coverage note:** YES — what's surfaced, what's missing
- **PASS**

### 8. Score Gate
- **Overall grade:** A-
- **All required items covered:** YES — 23/23
- **Canonical fields populated with evidence:** YES
- **PASS**

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit B (Traditional Franchise Agreement):**
- Pages 73-90 — directly clause-walked in A2
- 30 clause families extracted covering all operative provisions
- Status: COMPLETE

**Exhibit C (Satellite FA) and Exhibit D (Walmart FA):**
- Pages 91-108 and 109-126 respectively
- NOT directly clause-walked
- Verdict 2 rationale: These are variant formats for non-traditional locations. Core operative burdens (term, royalty, advertising, noncompete, termination, transfer) are covered via Item 5/6/7/17 disclosures which address all restaurant types. The main economic differences (variable term, lower initial fee, different rent structure) are captured in the body items. No material buyer-facing gap for standard traditional franchise diligence.

**Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale**

---

## Strongest Parts of the Run

1. **Item 19 cohort comparability analysis** (p43-44, p18-21): Identified 4% vs 5% royalty difference, computed $30-40K/year dollar impact at each sales tier. This is a material buyer-facing insight that most extraction runs miss.

2. **Item 6 complete fee table** (p18-24): All 30+ fee rows extracted across 7 pages with all 11 footnotes, including co-investment policy detail, STO/STR rent tiers, and technology fee aggregate.

3. **Item 20 all 5 tables with state-level detail** (p45-54): Every table extracted with per-state data and footer totals. Gag clause explicitly identified and flagged (p55).

4. **Item 21 financial statements and all 18 note families** (p58-72): Complete auditor opinion, all four financial statements, and every accounting note family walked including related-party transactions, subsequent events, and lease maturity schedules.

5. **State addenda structured promotion** (p383-387, p88-90): All 6 states with 16 structured overrides promoted to canonical per-state. Summary table of override families × states.

6. **Franchise Agreement complete clause walk** (p73-90): 30 clause families including state-specific riders for HI, MD, MN, ND, WA and multi-state anti-waiver rider.

7. **Item 2 full leadership roster** (p10-11): 36 officers/directors with roles, tenure, and biographical footnotes for external hires.

## Weakest Remaining Parts of the Run

1. **Exhibit G Operator's Lease partial walk** (p133-165): Key operative provisions (rent, default, liquidated damages, holding over) captured, but pages 135-144 and 146-165 not individually read. Missing: detailed repair/replacement provisions (Art 6.05), subordination/non-disturbance (Art 7.11), condemnation allocation formulas.

2. **Exhibit C/D variant franchise agreements** (p91-126): Not directly walked. Satellite and Walmart formats may have different default mechanics, death/disability provisions, or unusual clauses not captured via body item cross-references.

3. **Exhibit N Loan Documents** (p196-230): 35 pages not directly walked. Key terms from Item 10 are complete, but ACH authorization, security agreement detail, and OAPA clause-by-clause not extracted.

4. **Assignment forms (Exhibits H, I)** (p166-177): Not directly walked. Transfer conditions captured from FA Section 15 and Item 17, but specific assignment form provisions not extracted.

5. **Franchise Agreement Sections 3-7 fine detail** (p75-76): Training, advertising, Gross Sales definition, and royalty mechanics — operative terms captured at headline level but some procedural nuance (e.g., exact advertising approval process, Gross Sales exclusion mechanics) not individually walked.

## Where a Prior or Manual Run May Still Be Stronger

1. **Exhibit B sentence-level walk:** A manual run with unlimited time could walk every sentence of the 18-page Franchise Agreement and identify unusual subordinate clauses (e.g., specific advertising approval mechanics in Section 5, exact Gross Sales exclusion edge cases in Section 7) that this automated pass captured at clause-family level.

2. **Operator's Lease deep dive (p133-165):** A manual run would walk all 33 pages including the detailed insurance requirements (Art 6), condemnation allocation (Art 7.10), and subordination/non-disturbance provisions (Art 7.11) that affect lease-secured financing.

3. **Exhibit N loan document specifics:** The OAPA (Operator Assistance Program Agreement) waiver-of-claims clause has significant implications for franchisees who use McDonald's-guaranteed financing. A manual run would extract the exact waiver language.

4. **Franchisee list (Exhibit R) analysis:** A manual run could extract and analyze the 144 pages of franchisee restaurant listings to compute geographic concentration, operator size distribution, and multi-unit operator statistics.

## Optional Max-3 Follow-Up Roadmap

1. **Operator's Lease full clause walk** — Target: `RT_recover_exhibit_G_full.json`. Read pages 135-165 for repair/replacement, insurance detail, condemnation allocation, subordination/non-disturbance.

2. **OAPA waiver-of-claims extraction** — Target: `RT_recover_exhibit_N_oapa.json`. Read the Operator Assistance Program Agreement portion of Exhibit N for exact waiver language and scope.

3. **Variant franchise agreement scan** — Target: `RT_recover_exhibit_C_D_scan.json`. Scan Exhibits C and D for provisions that differ materially from Exhibit B (particularly death/disability, default, and rent mechanics).

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- CON-001: Item 20 (13,559 total) vs Item 21 Notes (13,557 total) — 2-restaurant difference. Low severity.

### Business-Risk Flags
- UNR-001 / CON-002: Item 19 cohort comparability — pro forma at 4% royalty, new franchisees pay 5%. HIGH severity. Quantified at $30-40K/year.

### Extraction-Depth Gaps
- UNR-002: Satellite/Walmart FA variant economics not extracted. MEDIUM.
- UNR-003: Operator's Lease partial walk (some procedural detail deferred). MEDIUM.

## Buyer-Trust Assessment

A serious prospective franchisee would find this run trustworthy as a comprehensive starting point for McDonald's franchise diligence. The extraction covers all material items at full depth, surfaces the critical cohort comparability issue that most buyers would miss, identifies the gag clause, and provides structured state-specific override analysis. The main gaps — variant franchise agreements and Operator's Lease procedural detail — are clearly documented and do not undermine the core economic and legal analysis for a traditional McDonald's franchise. A buyer would supplement this with a personal franchise agreement review with their attorney, which the FDD itself recommends.

## Source-Grounding Rule
All weaknesses, gaps, and prior-run-stronger claims cite exact page ranges or section identifiers as shown above.
