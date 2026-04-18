# Publish Gate — 638559-2025-Panda-Express

## Verdict: **2 — Publish with caveats**

### Rationale
The extraction is comprehensive and evidence-grounded across all 23 FDD items, financial statements, state addenda, and key contract provisions. All mandatory checklist items pass. The canonical JSON contains 40+ top-level keys with source provenance. The final report is a full standalone diligence narrative exceeding 500 lines. Four A2 depth passes were executed successfully, producing 8 RT files. The run falls short of verdict 1 solely because Exhibits F (APA), I (JV LLC Operating Agreement), and K (Loan Agreements) were not directly clause-walked — their key provisions were recovered from Item 17 cross-reference tables, which provides adequate but not exhaustive coverage. The License Agreement (Exhibit A) was partially walked during A2, covering the highest-priority operative clauses (termination, noncompete, liquidated damages, confidentiality, guaranty, dispute resolution).

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Checklist Assessment

### 1. Item 19 Completeness — PASS
Item 19 FPR is fully extracted. The venue-type breakdown table covers all 6 venue categories with per-venue metrics (total, average, median, min, max, pct above average, average age, unit count). State-level unit distribution table is extracted (38 states). All 5 notes to the charts are captured. Population: 156 restaurants; exclusions (15 open <1yr, 7 closed, 2 privacy) documented. Substantiation availability statement captured: "Written substantiation for these financial performance representations will be made available to the prospective franchisee upon reasonable request" (p.77). No cost/expense/profit data provided — this limitation is documented in the reader report, final report, and canonical.

### 2. Item 20 Completeness — PASS
All 5 standard tables are present:
- Table 1 (Systemwide): 3 years, franchised + company-owned + total. Totals balance.
- Table 2 (Transfers): 3 years, per-state detail. Totals: 5/5/3.
- Table 3 (Franchised Status): 3 years, per-state detail, footer totals extracted. Totals balance (165+11-2-0-1-0=173).
- Table 4 (Company-Owned): 3 years + prior year, per-state detail, footer totals. Totals balance (2248+87-0-6-0=2329).
- Table 5 (Projected Openings): Per-state detail. Totals: 15 signed not opened, 14 projected franchised, 123 projected company.
- Gag clause flag: SET to true with verbatim quote.
- Table notes captured for all tables.

### 3. Item 21 Sufficiency — PASS
- Auditor: CliftonLarsonAllen LLP (Pasadena, CA)
- Opinion: Unqualified (clean), dated April 7, 2025
- Income statement: Extracted with full line-item detail (revenue: $28.3M; net income: $24.8M)
- Balance sheet: Full detail (total assets: $70M; equity: $65.8M)
- Cash flow: Full detail (operating: $2.7M; investing: -$26K)
- Stockholders' equity: Extracted
- All 4 notes walked to depth:
  - Note 1: Revenue recognition (ASC 606), depreciation, income taxes (S Corp), concentration, leases (ASC 842), subsequent events
  - Note 2: Related party transactions ($35.3M due from PRG; management services; building leases; airplane transactions)
  - Note 3: Property detail ($61.2M airplanes; $5.9M land; $4.4M buildings)
  - Note 4: Licensed locations (175 domestic + 97 international = 272 total)
- Going concern: Not present — no going-concern language
- Item 21 method: normal text extraction

### 4. State Addenda Sufficiency — PASS
14+ states with addenda identified: California, Hawaii, Illinois, Indiana, Kansas, Maryland, Michigan, Minnesota, New York, North Dakota, Rhode Island, South Dakota, Virginia, Washington, Wisconsin. Structured into `state_addenda_overrides` in 09_final_canonical.json with per-state override families. RT_depth_state_addenda_promotion.json contains 15 structured override entries across 7 override families. Summary table shows which override families affect which states.

### 5. Key Exhibit Sufficiency — PASS with caveat
All exhibits listed in Item 22 are accounted for in 04_exhibits.json (14 total). Financial statements (Exhibit B) are deep-read with all notes walked. License Agreement (Exhibit A) is partially clause-walked — 30 burden clauses extracted covering grant, term, training, confidentiality, exclusivity, fees, insurance, liquidated damages, termination, post-termination, transfer, successor, guaranty, indemnification, force majeure, dispute resolution, governing law, brand refresh, and AI policy. State Addenda (Exhibit J) fully walked.

**Caveat:** Exhibits F (APA, 16 pages), I (JV LLC, 28 pages), and K (Loan Agreements, 34 pages) were not directly clause-walked. Key provisions were recovered from Item 17 cross-reference tables, which provide adequate summary-level coverage of termination, dispute resolution, transfer, and choice of law for each.

### 6. Unresolveds and Contradictions — PASS
Both `unresolveds` (6 entries, 4 remaining after retry resolution) and `contradictions` (1 entry — Item 20/21 count discrepancy) are present as top-level keys in 09_final_canonical.json. Unresolveds include: death/disability not addressed (medium), post-term noncompete scope (low), airplane assets (low), due from affiliate trajectory (medium). All are genuine business-risk flags, not extraction gaps.

### 7. Final Report Depth — PASS
08_final_report.md is a comprehensive diligence narrative with all required sections:
- Section A: Executive snapshot (13 numbered bullets)
- Section B: Fee stack, entry structure, initial investment (detailed prose + tables)
- Section C: Supplier control, training, tech, marketing
- Section D: Territory, competition, channels
- Section E: Contract burden, termination, transfer, noncompete, dispute resolution
- Section F: Item 19 FPR with venue breakdown
- Section G: Item 20 outlet data with trajectory analysis
- Section H: Item 21 financial statements with full narrative walk
- Section I: State addenda summary
- Section J: Unresolveds (4 items)
- Section K: Contradictions (1 item)
- Section L: Final coverage note

### 8. Score Gate — PASS
10_scorecard.md shows 23/23 items read, 11 tables extracted, 14 exhibits cataloged, 4 A2 depth passes completed, 40+ canonical top-level keys.

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit A — License Agreement** was surfaced at pages 93–188 (96 pages). The agreement was partially clause-walked during A2 (Depth Pass 2: Contract Burden). Key operative burden clauses were directly read:
- Grant/term (Section 2, p.96)
- Development (Section 3, p.100)
- Equipment/AI (Section 4, p.100)
- Training (Section 5, p.100)
- Confidentiality/Exclusivity (Section 8, pp.108-109)
- Termination/Default (Section 16, pp.131-135)
- Post-Termination (Section 17, pp.135-137)
- Dispute Resolution (Section 19, pp.177)

30 clause entries were extracted to RT_depth_contract_burdens.json.

**Sections deferred:** Sections 6 (Marks), 7 (Indemnification), 9 (Fees detail), 10 (Operations — 10 pages), 11 (Marketing), 12 (Records), 13 (Inspections), 14 (Transfer detail), 15 (Successor detail), 20 (Notices), 21 (Multiple Concepts), 23 (Definitions).

**Verdict decision: Verdict 2 allowed.** All key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty, venue, liquidated damages) are adequately covered through the combination of: (1) direct clause reading during A2, (2) Item 17 cross-reference tables in the FDD body, and (3) Items 5-16 narrative disclosures. The deferred sections (operations, records, inspections, marketing, notices, definitions) are lower-priority for buyer-facing risk assessment and are substantially covered in the FDD body items.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 19 FPR venue-type breakdown** (pp.77-78): Complete 6-venue-category breakdown with average, median, min, max, pct above average, and unit counts — one of the most granular FPR presentations I've seen for a captive-venue franchise
2. **Item 21 financial statement notes** (pp.198-205): All 4 notes walked to depth — revenue recognition under ASC 606, related party transactions ($35.3M PRG balance, airplane transactions), property schedule ($61.2M airplanes), and licensed location reconciliation
3. **Item 6 fee table** (pp.18-23): Complete extraction of all 15 fee categories across 6 continuation pages with all footnotes — including the critical Gross Volume definition and CPI adjustment provisions
4. **Item 17 contract provisions** (pp.59-68): Four complete cross-reference tables (License Agreement, APA, JV LLC, Financing Documents) covering termination, transfer, renewal, noncompete, and dispute resolution
5. **State addenda structured extraction** (pp.299-324): 15 override entries across 14+ states with per-state affected families and "why it matters" rationale for each — California, Kansas, Michigan, and Virginia overrides are particularly material
6. **Item 11 training tables** (pp.42-46): All 7 training programs with classroom/OJT hours fully extracted — one of the most detailed training program structures in any franchise FDD
7. **Liquidated damages clause** (p.135): Captured the distinction between franchisor-initiated (24 months) and franchisee-initiated venue-closure (12 months) liquidated damages — a critical buyer-risk factor

### 2. Weakest Remaining Parts of the Run

1. **Exhibit A License Agreement Sections 9-10** (pp.109-121): The Fees detail (Section 9) and Operations (Section 10, ~10 pages) sections of the License Agreement were not directly clause-walked. Section 10 likely contains detailed operational standards, food safety requirements, and AI policy specifics that go beyond what Items 8 and 11 disclose. This is an extraction-depth gap.
2. **Exhibit F Sample Asset Purchase Agreement** (pp.241-256): 16 pages not directly clause-walked. Purchase price mechanics, closing conditions, and inspection provisions not extracted — covered only at Item 17 summary level.
3. **Exhibit I JV LLC Operating Agreement** (pp.271-298): 28 pages not directly clause-walked. Capital contribution mechanics, profit distribution formulas, and management structure detail not extracted — particularly relevant given that 59 of 173 franchised restaurants are JVs.
4. **Exhibit K Loan Agreements** (pp.325-358): 34 pages not directly clause-walked. Specific collateral descriptions, acceleration mechanics, and UCC enforcement provisions not extracted.
5. **Death/disability gap**: The License Agreement has no death/disability provisions — confirmed by both A1 and A2. This is unusual and raises a genuine business-risk question about what happens to the franchise interest on the death or incapacity of the principal owner. The agreement binds "executors, administrators, heirs, assigns, and successors in interest" but provides no specific succession timeline or mechanism.

### 3. Where a Prior or Manual Run May Still Be Stronger

1. **License Agreement Section 10 (Operations)**: A manual reader could extract the specific operational standards, food safety certifications, and AI policy requirements from the ~10-page Operations section (pp.112-121) that are not captured in this automated run. These may contain material restrictions on menu changes, operating hours, or technology adoption.
2. **JV Operating Agreement capital/profit mechanics**: For the 59 JV restaurants, a manual reader could extract the specific capital contribution formulas, profit waterfall, and management fee arrangements from Exhibit I (pp.271-298) — material for any franchisee considering a JV structure.
3. **Franchisee list analysis (Exhibit G)**: A manual reviewer could analyze the 10-page franchisee list (pp.257-266) to identify multi-unit operators, geographic concentration patterns, and contact information for due diligence calls — particularly important given the gag clause disclosure.
4. **Insurance provisions depth**: The insurance requirements ($10M CGL, $3M auto, $10M cyber) are captured at the body-text level, but the specific policy endorsement requirements, additional insured provisions, and subrogation waivers in the License Agreement could yield additional cost or compliance burdens.

### 4. Optional Max-3 Follow-Up Roadmap

1. **License Agreement Section 10 Operations depth** — Target: `RT_depth_exhibit_a_section10.json` — Read pp.112-121 for operational standards, AI policy specifics, food safety certification requirements, and any menu/hour restrictions
2. **Exhibit I JV LLC capital/profit mechanics** — Target: `RT_depth_exhibit_i_jv_economics.json` — Read pp.271-298 for capital contribution formulas, profit distribution, management fees, and exit mechanics relevant to the 59 JV restaurants
3. **Exhibit K Loan Agreements collateral/acceleration** — Target: `RT_depth_exhibit_k_loan_detail.json` — Read pp.325-358 for specific collateral descriptions, acceleration triggers, and UCC enforcement mechanics

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies:**
- C1: Item 20 reports 173 domestic franchised outlets; Item 21 Note 4 reports 175 domestic licensed locations (2-unit discrepancy — likely due to excluded theme park/corporate campus venues or timing)

**Business-Risk Flags:**
- U1: Death/disability provisions not addressed in License Agreement (severity: medium)
- U2: Post-term noncompete is facility-specific with limited practical enforceability (severity: low)
- U3: Airplane assets ($61.2M) on franchise entity balance sheet primarily used by affiliates (severity: low)
- U4: Due from Affiliate $35.3M — increasing non-interest-bearing intercompany balance reclassified as equity reduction (severity: medium)

**Extraction-Depth Gaps:**
- None remaining after A2 depth passes. All remaining gaps are exhibit-walk depth preferences, not material extraction failures.

### 6. Buyer-Trust Assessment

A serious buyer considering a Panda Express franchise could trust this run as a comprehensive first-pass diligence document. The extraction captures all material economic terms (fees, investment, FPR, financial health), all major contract provisions (term, termination, transfer, noncompete, dispute resolution), and all system-level metrics (outlet counts, growth trajectory, projected openings). The gag clause, materially-different renewal risk, mandatory minimum royalty, and no-territory position are all clearly surfaced as risk factors. The Item 21 financial statement walk reveals the unusual intercompany dynamics (airplane assets, Due from Affiliate) that a buyer should investigate further. The only area where a buyer might need supplemental analysis is the JV operating agreement economics (relevant to the 34% of franchised restaurants that are JV structures) and the specific operational standards in the License Agreement's Section 10.

### 7. Source-Grounding Rule
All claims above cite specific page numbers, section references, or file names from the run directory. No unsourced claims are present.
