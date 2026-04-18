# 15 Publish Gate — Domino's Pizza (Filing 640477)

## Verdict: 2 — Publish with Caveats

---

## Rationale

This extraction achieves comprehensive coverage of all 23 FDD items, both sets of financial statements (DPF and DPL), the franchise agreement clause walk, and state addenda for 6 states. The Item 19 FPR is fully extracted with 5-year AWUS, medians, and EBITDA tiers. Item 20 includes all 5 standard tables with complete state-by-state data. The canonical contains 35+ top-level keys with structured families for all material items.

The verdict is 2 rather than 1 due to:
1. Exhibit F (Non-Traditional FA) and Exhibit G (Development Agreement) were not independently clause-walked — operative terms were extracted from Item 17 charts and are substantially similar to Exhibit E, but independent verification was not performed.
2. Exhibit K (Rider to Lease) operative terms remain labeled only.
3. DPL financial statement note walk was selective (key families only), not exhaustive page-by-page.

None of these gaps are buyer-misleading. The core economic, legal, and operational picture is complete.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with 5-year AWUS (2020–2024), median weekly sales, and EBITDA tiers across 5 AWUS bands.
- Store population counts provided for each year (e.g., 6,788 in 2024 for AWUS, 6,262 for EBITDA).
- Exclusion rules: 256 stores with incomplete P&L + 181 not operational full year = 437 excluded from EBITDA analysis.
- Variable cost, fixed cost, and EBITDA components defined with clear methodology.
- Substantiation statement captured: "Written substantiation will be made available upon reasonable request."
- Supplemental siting model disclosure captured.
- **No cohort comparability gap**: FPR uses actual franchised store data at current 5.5% royalty rate.

### 2. Item 20 Completeness — PASS
- All 5 standard tables present: Table 1 (systemwide summary for Traditional, Non-Traditional, and DAs), Table 2 (transfers by state), Table 3 (franchised outlet status by state), Table 4 (company-owned outlets), Table 5 (projected openings).
- Total rows balance: 6,948 franchised + 262 company = 7,210 Traditional.
- Franchisee list exhibit count captured: Exhibit B (Traditional), B-1 (Non-Traditional), B-2 (Former), with 103 former franchisees + 59 former developers.
- **Gag clause flag set**: false. Verbatim quote: "We have not entered into agreements with confidentiality clauses that would prevent franchisees from discussing their experience with Domino's." (p. 88)

### 3. Item 21 Sufficiency — PASS
- **DPF Auditor**: PricewaterhouseCoopers LLP, Detroit, Michigan.
- **Opinion**: Unqualified, dated March 23, 2026. No going-concern.
- Income statement, balance sheet, member's interest, cash flows all extracted with line-item detail.
- Notes to DPF financial statements covered (5 note families walked).
- **DPL auditor**: PricewaterhouseCoopers LLP, unqualified. Income statement ($4.94B revenue, $601.7M net income), balance sheet ($1.72B assets, $5.62B liabilities, ($3.90B) member's deficit), and cash flows ($792M operating) extracted.
- Note walk covers revenue recognition, debt structure, leases, profit-sharing, litigation.
- Item 21 method: normal text extraction (no image fallback needed).

### 4. State Addenda Sufficiency — PASS
- 6 individual states (CA, HI, IL, MD, MN, WA) + 14-state multi-state provision identified and structured.
- State addenda embedded in body (pp. 89–95), not in a separate exhibit.
- **Structured into canonical**: `state_addenda_overrides` present in 09_final_canonical.json with per-state entries.
- RT_depth_state_addenda_promotion.json contains 20 structured override entries and override family × state matrix.
- Key override families: forum selection, governing law, noncompete, general release, termination, renewal, transfer, fee deferral, labor minimum wage, no-poach.

### 5. Key Exhibit Sufficiency — PASS with Caveats
- Item 22 lists 12 contracts (Exhibits E–R); all accounted for in 04_exhibits.json with page ranges.
- **Exhibit C (DPF Financials)**: Complete — full walk.
- **Exhibit D (DPL Financials)**: Complete for headline statements and key notes; selective note walk.
- **Exhibit E (Traditional FA)**: Clause-walked via A2 (18 clause families including guaranty, noncompete, cross-default, ROFR, death/disability, management appointment).
- **Exhibit F (Non-Traditional FA)**: Not independently walked; substantially similar per Item 17. Caveat: some Non-Traditional-specific terms (e.g., territory = premises only, advertising credit up to 3.5%) are captured from body text.
- **Exhibit G (Development Agreement)**: Not independently walked; key provisions from Item 17 DA chart.
- **Exhibit K (Rider to Lease)**: Labeled only. Operative lease burden terms not extracted.
- **Exhibits H, I, J, O**: Operational agreements; key economic terms extracted from Items 6/8/11.

### 6. Unresolveds and Contradictions — PASS
- 5 unresolveds in canonical: DPL financials (now substantially resolved), FA clause walk (resolved via A2), Lease Rider (low severity), securities litigation (pending — genuine business risk), joint employer litigation (pending — genuine business risk).
- 1 contradiction entry (Item 20/21 store count reconciliation): resolved — DPF is securitization vehicle; no store counts in DPF notes; DPL notes also don't break out U.S. counts.
- Unresolveds and contradictions are preserved as structured families in 09_final_canonical.json.
- Remaining unresolveds are genuine business-risk flags (pending litigation), not extraction gaps.

### 7. Final Report Depth — PASS
- 08_final_report.md is ~550 lines, ~28KB.
- All required sections present: A (executive snapshot, 14 bullets), B (fees/investment with full inline tables), C (supplier/operations/training), D (territory), E (contract burden/legal), F (Item 19 detail), G (Item 20 detail), H (Item 21 detail), I (state addenda), J (unresolveds), K (contradictions), L (final coverage note).
- Report is a standalone diligence narrative suitable for a prospective franchisee.

### 8. Score Gate — PASS
- Overall grade: A- (post-A2).
- All required items covered.
- Canonical fields populated with evidence grounding (source_pages and confidence for all entries).

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced franchise agreements:**
- Exhibit E (Traditional Store Standard FA): Pages 329–383 (~54 pages). Clause-walked via A2 depth pass. 18 clause families extracted including grant/term, renewal, royalty, advertising, brand technology, noncompete, termination, transfer, ROFR, death/disability, management appointment, indemnification, insurance, confidentiality, choice of law, purchase option.
- Exhibit F (Non-Traditional Store FA): Pages 384–440 (~56 pages). Not independently clause-walked. Item 17 states the chart applies to both Standard and Non-Traditional FAs (sections referenced are the same).
- Development Agreement (Exhibit G): Pages 441–461 (~20 pages). Key provisions from Item 17 DA chart.

**Verdict decision for Exhibit F and G:**
- Verdict 2 allowed because: (a) Exhibit F is stated to use the same section numbering as Exhibit E per Item 17 (provisions c through w reference the same sections); (b) key economic and legal differences between Traditional and Non-Traditional (territory = premises only, advertising credit, different investment range) are captured in body text; (c) the missing clause walk does not leave a material buyer-facing gap for the key operative burdens.
- Exhibit G (DA): Key provisions (termination triggers, no transfer, no renewal, noncompete during term only) captured from Item 17 DA chart. The DA is a development tool, not the ongoing operating agreement.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## 1. Strongest Parts of the Run

1. **Item 6 fee table walk** (pp. 22–27): Complete extraction of 30 fee types across 6 pages with all 7 footnotes. Every technology, advertising, and operational fee captured with amounts, timing, and detailed remarks.
2. **Item 19 FPR** (pp. 65–68): 5-year AWUS and median data, plus EBITDA tier analysis across 5 bands with 6,262-store population. One of the most robust FPRs in the extraction corpus.
3. **Item 20 full state-by-state data** (pp. 68–88): All 5 standard tables extracted with per-state detail. Transfer data, company-owned activity, and projected openings all captured with notes.
4. **DPF financial statement walk** (pp. 285–295): All four statements plus 5 note families. Clean PwC opinion, no going concern, complete income statement and balance sheet line items.
5. **DPL financial statement extraction** (pp. 297–325): $4.94B revenue, $601.7M net income, $4.81B long-term debt, ($3.9B) member's deficit, $792M operating cash flow. Supply chain profit-sharing rebates ($193M) and advertising economics captured.
6. **Franchise agreement clause walk** (pp. 329–370): 18 clause families including guaranty scope, substantial compliance definition, cross-default, ROFR mechanics, death/disability management fee.
7. **State addenda structured extraction** (pp. 89–95): 20 override entries across 6 states with override family × state matrix. CA Fast Food Act, MD fee deferral, MN comprehensive protections, WA noncompete/no-poach all captured.

## 2. Weakest Remaining Parts of the Run

1. **Exhibit F (Non-Traditional FA)**: Not independently clause-walked. While substantially similar to Exhibit E per Item 17, Non-Traditional-specific provisions (territory = premises only, advertising credit structure) deserve direct verification from exhibit pages 384–440.
2. **Exhibit K (Rider to Lease)**: Pages 500–515 remain labeled only. Operative lease provisions (renewal rights, assignment restrictions, de-identification costs, DPF access rights) are important for franchisees who will sign leases with this mandatory rider.
3. **Exhibit G (Development Agreement)**: Pages 441–461 not independently clause-walked. Development fee structure ($25K reservation fee per store) and termination mechanics extracted from body text but not verified against exhibit.
4. **DPL note walk selectivity**: DPL notes walk covered key families (revenue recognition, debt, leases, profit-sharing, litigation) but did not exhaustively walk all note pages (pp. 306–328). Some note families (goodwill impairment, software capitalization, investment in DPC Dash) were not deeply extracted.
5. **Canonical enriched v2 does not contain DPL financials**: The enrichment v2 file was written during A1 before DPL data was extracted. The A2 depth pass data exists in RT_depth_financial_notes.json and 09_final_canonical.json but was not fully merged into 12_canonical_enriched_v2.json.

## 3. Where a Prior or Manual Run May Still Be Stronger

1. **Non-Traditional FA-specific provisions**: A manual reader would identify any Non-Traditional-specific clauses in Exhibit F that differ from the Standard FA (Exhibit E). The automated run relied on Item 17's representation that both agreements share the same section numbering.
2. **Lease Rider detail**: A manual reader would extract the operative terms of the Rider to Lease (Exhibit K), which affects every franchisee's most significant non-franchise contractual obligation (the commercial lease).
3. **DPL note-level detail**: A manual reader might extract the DPC Dash investment detail ($36.1M book value), software capitalization policy ($159.3M net), and goodwill assessment ($10.7M) from DPL notes.
4. **Item 19 siting model nuance**: The FDD references a supplemental siting model ("Domino's Strategic Integrated Mapping and Modeling System") that may be provided for specific locations. A manual analyst might probe how this model's assumptions compare to the system-level AWUS data.

## 4. Optional Max-3 Follow-Up Roadmap

1. **RT_depth_exhibit_F_nontrad.json**: Independent clause walk of Exhibit F (pp. 384–440) to verify Non-Traditional-specific provisions.
2. **RT_depth_exhibit_K_lease.json**: Extract operative terms from Rider to Lease (pp. 500–515).
3. **RT_depth_dpl_notes_deep.json**: Exhaustive walk of DPL note pages 306–328 for remaining note families.

## 5. Unresolved Taxonomy

### Document-Internal Inconsistencies
- None identified. The FDD is internally consistent.

### Business-Risk Flags
- **U4**: Securities class action (State of Rhode Island v. DPI) — outcome pending. Potential reputational and financial impact to parent entity. (pp. 18–20)
- **U5**: Joint employer lawsuits — outcome pending. If adversely decided, could change franchisor-franchisee labor dynamics and increase franchisee costs. (p. 20)

### Extraction-Depth Gaps
- **U3**: Exhibit K (Rider to Lease) operative terms not extracted. Low severity — lease terms are important but the rider's existence and requirement are documented. (pp. 500–515)
- **Canonical enrichment v2 synchronization**: DPL financial data not fully merged into enrichment v2 file.

## 6. Buyer-Trust Assessment

A serious buyer evaluating a Domino's Pizza franchise would find this extraction reliable and comprehensive for making an informed decision. The core economic picture is complete: a mature, 7,200+ unit system with steady growth, a 5.5% royalty + 4% advertising fee load, EBITDA ranging from marginal (<$15K tier) to healthy (>$30K tier), and a securitized franchisor entity backed by PwC-audited financials. The franchise agreement terms, territorial provisions, and state-by-state addenda are thoroughly documented. The remaining gaps (Non-Traditional FA independent walk, lease rider detail, DPL note completeness) are supplementary — they refine the picture but do not change the fundamental assessment. A buyer should independently verify the Rider to Lease terms with their attorney before signing.

## 7. Source-Grounding Rule

All weaknesses, gaps, and "prior run stronger" claims above cite specific exhibit letters, page ranges, and section numbers from the run files. No unsourced claims.
