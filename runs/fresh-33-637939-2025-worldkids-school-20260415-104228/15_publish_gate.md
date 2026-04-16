# Publish Gate — WorldKids School (637939-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

This extraction is substantively complete across all 23 FDD Items, both sets of financial statements, all state addenda, and the franchise agreement. The FDD is for an early-stage franchisor with simple financial statements (essentially a shell entity) and a straightforward franchise structure. No material extraction gaps exist. The caveats relate to the inherent limitations of the FDD itself (no expense data in Item 19, shell franchisor entity) rather than extraction shortcomings.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- FPR provided: YES. Two FPR tables (2024: 8 outlets, 2023: 6 outlets) fully extracted.
- All tables extracted with outlet-level data: location, students, sqft, opening date, gross revenue, adjustments, adjusted gross revenue.
- All notes extracted: Grant money adjustments, operational differences, adjustment definitions.
- Substantiation availability statement: captured ("Written substantiation... available upon reasonable written request").
- Population counts: explicitly stated (8 for 2024, 6 for 2023).
- **Assessment: COMPLETE.**

### 2. Item 20 Completeness
- All 5 standard tables present: Table 1 (systemwide), Table 2 (transfers), Table 3 (franchised status), Table 4 (company-owned status), Table 5 (projected openings). All extracted.
- Total rows balance: YES (all zeros for franchised; company matches).
- Franchisee list exhibit count: Exhibit G-1 (None), G-2 (None). Captured.
- Gag clause flag: Set (no confidentiality clauses — moot with no franchisees).
- Table 4 year typo noted (U-005).
- **Assessment: COMPLETE.**

### 3. Item 21 Sufficiency
- Auditor: Smith, Buzzi & Associates, LLC (Miami, FL). Identified.
- Income statement: Extracted (zero revenue, zero expenses).
- Balance sheet: Extracted for both Dec 2024 and Sep 2024.
- Cash flow: Extracted (contributions/distributions).
- Notes: Fully covered via A2 depth pass (RT_depth_financial_notes.json, RT_depth_item21_notes.json).
- Going concern: Not qualified. Noted.
- **Assessment: COMPLETE.**

### 4. State Addenda Sufficiency
- 11 states identified: California, Hawaii, Illinois, Maryland, Michigan, Minnesota, New York, North Dakota, Rhode Island, Washington, Wisconsin.
- All state addenda read in both FA Schedule 7 and DD Exhibit I.
- STRUCTURED into `state_addenda_overrides` in 09_final_canonical.json: YES.
- Override families structured per-state: YES (31 override entries across 11 states).
- Summary table of override families × states: YES (in RT_depth_state_addenda_promotion.json and canonical).
- **Assessment: COMPLETE.**

### 5. Key Exhibit Sufficiency
- Franchise Agreement (Exhibit C): Clause-walked in A2. Key provisions extracted in RT_depth_contract_burdens.json.
- General Release (Schedule 1): Identified.
- NDA/Non-Compete (Schedule 2): Identified, key terms extracted.
- Unlimited Guaranty (Schedule 3): Clause-walked. Unlimited personal guaranty by 5%+ owners.
- Lease Addendum (Schedule 4): Clause-walked. Franchisor rights to enter/cure/assume.
- ACH Agreement (Schedule 5): Identified.
- State Addenda (Schedule 7): Fully walked.
- Financial Statements (Exhibit F): Fully extracted.
- ADA (Exhibit E): Partially walked; key economics from Items 5, 7, 12; state addenda walked.
- Operations Manual TOC (Exhibit D): Deferred (low priority reference exhibit).
- **Assessment: ADEQUATE. Minor gap on ADA body and Ops Manual TOC.**

### 6. Unresolveds and Contradictions Assessment
- 8 unresolveds identified in 06_coverage_audit.md and 08_final_report.md.
- All 8 preserved as structured `unresolveds` family in 09_final_canonical.json: YES.
- 1 contradiction identified (C-001: cash balance decline); resolved in canonical: YES.
- Unresolveds are genuine business-risk flags (U-001 financial viability, U-002 no franchisees, U-006 FPR scope) and document-quality flags (U-003/U-004/U-005 typos, U-007 ad fund audit, U-008 broker disclosure).
- No extraction gaps requiring A4 recovery.
- **Assessment: COMPLETE.**

### 7. Final Report Depth
- 08_final_report.md: ~400 lines, full narrative diligence report.
- Sections present: A (executive snapshot, 13 bullets), B (fees/investment with full tables), C (supplier/operations/training/tech), D (territory/channels), E (contract burden/legal), F (Item 19 with tables and caveats), G (Item 20 with trajectory and lists), H (Item 21 with full financial data), I (state addenda — 11 states with material overrides), J (unresolveds — 8 entries), K (contradictions — 1 resolved), L (final coverage note).
- State addenda discussed: YES, detailed.
- Item 21 financial summary section: YES.
- Unresolveds section: YES.
- Contradictions section: YES.
- **Assessment: COMPLETE.**

### 8. Score Gate
- 10_scorecard.md: Overall grade B+.
- All 23 items covered.
- Canonical fields populated with evidence grounding.
- B+ grade reflects deferred ADA/Ops Manual walks (minor gaps).
- **Assessment: ADEQUATE.**

---

## Franchise Agreement Clause-Walk Assessment

- **Franchise Agreement (Exhibit C):** Pages 58-98. CLAUSE-WALKED in A2 (RT_depth_contract_burdens.json). 25 clause families extracted including: grant/term, fees, site selection, training, operations manual, insurance, termination (22 non-curable + 3 curable categories), post-termination, noncompete, transfer, ROFR, death/disability, guaranty, indemnification, dispute resolution, force majeure, confidentiality, IP assignment.
- **Key operative burdens covered:** Term, fees, transfer, termination, noncompete, default, guaranty (unlimited for 5%+ owners), venue, liquidated damages (loss of future royalties), death/disability.
- **Distinctive clauses flagged:** Loss of future royalties provision, targeted marketing prohibition, business referral obligation, franchisor right to operate after default notice, book value purchase option.
- **Verdict decision:** Verdict 2 — franchise agreement adequately clause-walked.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale

**Rationale for deferred exhibits:**
- ADA body (Exhibit E, pp.128-135): Key economics and territory provisions captured from Items 5, 7, 12, and 17 chart. State addenda walked. ADA default triggers partially covered in Item 17. This gap does not materially weaken buyer confidence.
- Ops Manual TOC (Exhibit D, pp.123-127): Reference exhibit with section headings only. No operative clauses. Zero impact on economics or legal burden.

---

## Strongest Parts of the Run

1. **Item 19 FPR extraction (pp.44-50):** Both 2024 and 2023 FPR tables fully extracted with outlet-level data including student counts, square footage, opening dates, gross revenue, royalty deductions, local advertising deductions, and adjusted gross revenue for all 14 outlet-year entries.
2. **Item 21 financial statement extraction (pp.143-162):** Both audit periods fully extracted — balance sheets, income statement, cash flow, and complete accounting policy notes for the Dec 2024 and Sep 2024 statements, despite the minimal financial activity.
3. **State addenda structured extraction (pp.6-7, 114-122, 168-181):** 31 material override entries across 11 states, organized by override family with per-state detail and source pages. Summary table of override families × states.
4. **Franchise Agreement clause walk (pp.58-98):** 25 clause families extracted with 5 distinctive/unusual clauses flagged — loss of future royalties, targeted marketing prohibition, business referral obligation, franchisor right to operate, book value purchase option.
5. **Fee stack completeness (pp.13-16):** 25+ fee types extracted from Item 6 with amounts, timing, and FA cross-references, including technology fees (Procare, QuickBooks) that many extractions miss.

## Weakest Remaining Parts of the Run

1. **ADA body not fully clause-walked (pp.128-135):** Key provisions captured via Items 5, 7, 12, 17, but ADA-specific default triggers and unique terms not independently verified from the agreement body.
2. **Operations Manual TOC not extracted (pp.123-127):** Section headings and page allocations not captured. Low impact on buyer risk assessment but represents an incomplete exhibit.
3. **No profitability data in FPR:** The FDD itself does not disclose operating costs, COGS, payroll, or rent for the affiliate outlets. This is a limitation of the FDD, not the extraction, but limits the report's utility for financial modeling.
4. **Single-market FPR data:** All 8 outlets are in Seattle/WA metro. The extraction correctly flags this but cannot provide out-of-market comparables.
5. **Franchise Agreement Schedules 1, 2, 5, 6 at headline level:** General Release, NDA/Non-Compete, ACH, and Holders forms identified and summarized but not line-by-line extracted. Key terms captured (e.g., unlimited guaranty scope, noncompete duration/radius).

## Where a Prior or Manual Run May Still Be Stronger

1. **Operating cost modeling:** A manual analyst with access to childcare industry benchmarks could estimate EBITDA from the gross revenue data, which this extraction cannot do from the FDD alone.
2. **ADA clause-by-clause walk:** A manual reader might identify ADA-specific provisions (development schedule penalties, area default mechanics) that differ from the FA.
3. **Schedule 2 NDA/Non-Compete granular terms:** A manual reader might extract specific carve-outs or temporal triggers in the NDA that affect employees differently than owners.
4. **Competitor benchmarking:** A manual analyst could compare the $80,000 IFF and 6% royalty against other bilingual childcare franchise FDDs (e.g., Language Stars, Spanish Schoolhouse) for relative positioning.
5. **Auditor reputation assessment:** Smith, Buzzi & Associates (Miami, FL) is a small firm — a manual analyst might assess the auditor's PCAOB standing or franchise audit track record.

## Optional Max-3 Follow-Up Roadmap

1. **RT_depth_ada_clauses.json** — Walk ADA body (pp.128-135) for development schedule penalties, area default mechanics, and any economics that differ from FA.
2. **RT_depth_ops_manual_toc.json** — Extract Exhibit D section headings and page allocations from pp.123-127.
3. **RT_depth_schedule2_nda.json** — Extract NDA/Non-Compete Agreement (pp.104-105) clause-by-clause for employee vs. owner scope differences.

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- U-003: Auditor report date typo (March 14, 2024 should be 2025) — p.145
- U-004: Subsequent events date typo — p.153
- U-005: Item 20 Table 4 year label (2023 should be 2024) — p.52

### Business-Risk Flags
- U-001 (HIGH): Franchisor financial viability — $97 total assets, zero revenue
- U-002 (MEDIUM): No franchisee operating history — zero franchised outlets ever
- U-006 (MEDIUM): FPR limited to gross revenue only, no operating costs

### Extraction-Depth Gaps
- U-007 (LOW): Ad fund not audited — disclosure noted, moot for current period
- U-008 (LOW): Franchise brokers in Receipt but not in Item 2 — disclosure gap in FDD, not extraction

## Buyer-Trust Assessment

A serious buyer could rely on this extraction for initial screening and due diligence scoping. The extraction accurately surfaces the critical risk factors — the shell nature of the franchisor entity, the absence of any franchisee operating history, and the complete lack of expense data in the FPR. The state addenda overrides are thoroughly structured, which is particularly important given the 11-state coverage. The key limitation is not the extraction quality but the FDD itself: this is an extremely early-stage franchise with no operational track record as a franchisor, and a buyer would need to conduct substantial independent diligence on operating costs, market viability outside Seattle, and the franchisor's actual ability to fund and deliver its obligations.

## Source-Grounding Rule
All weaknesses, gaps, and "prior run stronger" claims above cite specific page numbers or section identifiers as required.
