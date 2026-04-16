# Publish Gate — Taco Bell Express (Filing 637943)

**Verdict: 2 — Publish with caveats**

**Run ID**: fresh-37-637943-2025-taco-bell-express-taco-bell-20260415-104320
**Brand**: Taco Bell Express
**Franchisor**: Taco Bell Franchisor, LLC
**Gate Date**: 2026-04-16

---

## Rationale

This is a strong extraction with all 23 FDD items fully covered, 16 material tables extracted, financial statements and notes deeply analyzed, state addenda structured into 23 per-state overrides across 9 override families, and a comprehensive 354-line final report covering all required sections. Two targeted retries and 9 A2 depth passes were executed. The License Agreement (Exhibit B-1) was clause-walked with 29 clauses extracted. Six unresolveds and three contradictions are preserved as structured families in the canonical.

Verdict 2 (not 1) for two reasons:
1. **Scorecard grade missing**: 10_scorecard.md states "PASS — Extraction Complete" but does not assign a letter grade (A/B/C/D/F). The run is fully evaluable and the extraction quality is clearly strong, but the absence of a formal letter grade means the score gate check cannot confirm an A or B grade. This is a process gap, not a content gap.
2. **Seven deferred exhibits** (B-1.5, B-2, I, J, K, L, M/N) were not directly clause-walked. Key operative terms for all seven are recovered via Item 17 cross-reference tables, contract burden depth pass, and FDD body text — but some secondary provisions remain thin (see detailed assessment below).

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS

- No FPR made. The no-FPR statement is extracted verbatim in the final report (Section F, lines 179-193) and canonical (`item19.fpr_made: false`).
- Substantiation availability captured: franchisor notes that existing Unit records may be provided for APA purchases; any other financial projections should be reported (08_final_report.md Section F).
- RT_depth_item19_cohort_comparability.json confirms: no cohort, no tables, no charts, no pro-forma — not applicable.
- Source: 09_final_canonical.json lines 83-85; 08_final_report.md lines 179-193; PDF page 57.

### 2. Item 20 Completeness — PASS

- All 5 standard tables present in RT_depth_item20_tables.json:
  - Table 1: Systemwide summary (p. 57) — balances confirmed (258→239→236→238).
  - Table 2: Transfers by state (pp. 57-58) — totals 1/2/7.
  - Table 3: Licensed status by state (pp. 58-61) — 35 states + DC, all activity categories, totals balance.
  - Table 4: Company-owned by state (pp. 61-62) — FL/KY/TX, 7 reacquisitions confirmed.
  - Table 5: Projected openings (p. 62) — 8 licensed, 0 company-owned.
- Total rows balance: Licensed 229→224 (9 opened, 3 non-renewals, 11 ceased-other = net -5). Company-owned 7→14 (7 reacquired). Total 236→238 (+2 net).
- Franchisee list exhibit count: Exhibit F cataloged (pp. 116-121), with note that 12 licensees in closure/transferred section.
- Gag clause flag: Set to false — "No confidentiality clauses signed with current/former licensees in last 3 fiscal years" (RT_depth_item20_tables.json, RT_depth_thin_items.json).
- Source: RT_depth_item20_tables.json; 09_final_canonical.json lines 87-97; 11_canonical_enriched.json lines 9-22.

### 3. Item 21 Sufficiency — PASS

- Auditor: KPMG LLP, Louisville, KY (RT_depth_financial_notes.json line 5).
- Opinion: Unqualified, no going concern (RT_depth_financial_notes.json lines 6-7).
- All 4 statements extracted: Balance sheet, income statement, equity statement, cash flow (08_final_report.md Section H; 12_canonical_enriched_v2.json).
- All 6 note families walked via RT_depth_item21_notes.json and RT_depth_financial_notes.json: (1) Description of Business, (2) Accounting Policies, (3) Member's Equity, (4) Related Party Transactions, (5) Guarantees/Commitments/Contingencies, (6) Subsequent Events.
- Going concern: Not flagged by auditor; not applicable for this SPV with ~100% operating margin.
- Source: RT_depth_financial_notes.json; RT_depth_item21_notes.json; 08_final_report.md lines 228-283; PDF pages 122-138.

### 4. State Addenda Sufficiency — PASS

- All 11 states identified: CA, IL, IN, MD, MI, MN, NY, ND, RI, WA, WI (04_exhibits.json Exhibit H, pp. 139-157).
- Structured into `state_addenda_overrides` in 09_final_canonical.json (lines 143-156) with 9 override families: forum_selection_voided, governing_law_overridden, liquidated_damages_void_or_limited, general_release_prohibited_or_limited, termination_notice_extended, licensee_termination_right_restored, anti_waiver_protection, trademark_indemnification, attorneys_fees_limited.
- RT_depth_state_addenda_promotion.json contains 23 structured overrides with per-state detail, affected families, source pages, and buyer-impact explanations.
- Final report Section I (lines 285-307) discusses all 11 states with material overrides.
- Source: 09_final_canonical.json lines 113-156; RT_depth_state_addenda_promotion.json; retry_R1.json.

### 5. Key Exhibit Sufficiency — PASS WITH CAVEATS

- All 18 exhibits (A through P) cataloged in 04_exhibits.json with page ranges.
- Three exhibits deep-walked: B-1 (License Agreement, pp. 70-100, 29 clauses), G (Financial Statements, pp. 122-138, fully walked), H (State Addenda, pp. 139-157, all 11 states).
- Seven exhibits deferred with explicit rationale and recovery documentation in RT_depth_key_exhibits.json: B-1.5, B-2, I, J, K, L, M/N.
- Caveat: Deferred exhibits have key terms recovered via cross-references but secondary provisions remain thin (see Franchise Agreement clause-walk assessment and Deferred surfaced exhibit policy below).
- Source: 04_exhibits.json; RT_depth_key_exhibits.json; RT_depth_contract_burdens.json.

### 6. Unresolveds and Contradictions — PASS

- 06_coverage_audit.md identifies 3 material gaps (state addenda, licensee list, FS notes) — first and third resolved by R1/R2 retries.
- 08_final_report.md Section J lists 6 unresolveds (U1-U6) and Section K lists 3 contradictions (C1-C3).
- 09_final_canonical.json contains structured `unresolveds` array (6 entries, lines 130-137) and `contradictions` array (3 entries, lines 138-142) as top-level keys.
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U1: No FPR — inherent to the document
  - U2: Franchise incentive growth — notes explain purpose but not Express-specific breakdown
  - U3: Revenue breakdown Traditional vs Express — not disclosed in the FDD
  - U4: Integrated Expansion Policy — referenced but not included in FDD
  - U5: Texas reacquisitions — reason not disclosed
  - U6: 2025 securitization planned — not yet executed
- No extraction gaps requiring A4 recovery.
- Source: 09_final_canonical.json lines 130-142; 08_final_report.md lines 309-328.

### 7. Final Report Depth — PASS

- 08_final_report.md is 354 lines — well above the 100-line minimum.
- All required sections present:
  - A. Executive Snapshot (13 numbered findings, lines 12-38)
  - B. Fee Stack, Entry Structure, Initial Investment (lines 40-99)
  - C. Supplier Control, Operating Control, Technology Burden, Reporting Burden (lines 101-126)
  - D. Territory, Competition, Channels, Encroachment (lines 128-143)
  - E. Contract Burden and Legal Mechanics (lines 144-178)
  - F. Item 19 Detail (lines 179-193)
  - G. Item 20 Detail (lines 195-226)
  - H. Item 21 Detail (lines 228-283)
  - I. State Addenda Summary (lines 285-307)
  - J. Unresolveds (lines 309-322)
  - K. Contradictions (lines 323-330)
  - L. Final Coverage Note (lines 332-354)
- State addenda discussed with material overrides for all 11 states.
- Financial statement summary includes 10 key observations.
- Source: 08_final_report.md (full file).

### 8. Score Gate — CAVEAT

- 10_scorecard.md provides comprehensive coverage summary, key metrics, confidence assessment, and A2 depth pass results.
- All required items covered (23/23).
- Canonical fields populated with evidence grounding (all confidence ratings "HIGH").
- **However**: The scorecard states "PASS — Extraction Complete" but does not assign a letter grade (A/B/C/D/F). The run is clearly evaluable and extraction quality is strong, but the formal letter grade is absent.
- This is called out explicitly per gate instructions: the scorecard grade is missing but the run is otherwise evaluable. Based on coverage (23/23 items, 16/16 tables, 4/4 financial statements, 6/6 notes, 11/11 state addenda, 2/2 retries, 9 depth passes), the implicit quality level is A-range, but no explicit grade was assigned.
- Source: 10_scorecard.md (full file).

---

## Franchise Agreement Clause-Walk Assessment

### Exhibits surfaced
- **B-1 License Agreement** (pp. 70-100): Primary franchise agreement governing Express Units.
- **B-1.5 KT Successor License Agreement** (pp. 100-105): Variant agreement for KFC/Taco Bell successor units.
- **B-2 Assignment/Release/Personal Guaranty** (pp. 105-110): Transfer/assignment mechanics.
- **B-3 Amendment to License Agreement** (pp. 110-113): Amendment template.

### Clause-walk status
- **B-1**: Clause-walked — 29 clauses extracted in RT_depth_contract_burdens.json covering: grant (§1), term (§2), operations (§3.0-3.8), training (§4), maintenance/modernization (§5), fees (§7), records/reporting (§8), inspection/audit (§9), indemnification (§10), insurance (§11), transfer/ROFR/guaranty (§13), trademarks (§14), termination/post-term/cross-default/liquidated damages (§15), governing law/venue/integration (§16).
- **B-1.5**: Labeled only — not directly clause-walked. Key provisions recovered via Item 17 tables (term, minimum sales requirements, KFC cross-default as incurable breach).
- **B-2**: Labeled only — not directly clause-walked. Transfer conditions, ROFR, and guaranty scope recovered via Item 17 and contract burden depth pass.
- **B-3**: Labeled only — amendment template, low operative significance.

### Key operative burden coverage
All critical burdens for the primary License Agreement (B-1) are covered:
- **Term**: §2 — 10 years Express, no renewal rights (confirmed)
- **Fees**: §7 — 10% royalty on Gross Sales (confirmed, cross-referenced to Item 6)
- **Transfer**: §13 — prior written consent, ROFR, $7,500 fee, personal guarantee (confirmed)
- **Termination**: §15 — voluntary termination = default, non-curable defaults listed, 30-day cure for others (confirmed)
- **Noncompete**: §3.8 — during term + 1 year/10 miles post-term for breach (confirmed)
- **Cross-default**: §15.1 — breach of any agreement = breach of all (confirmed)
- **Liquidated damages**: §15.4 — greater of $100K or 11% of last 12 months Gross Sales (confirmed)
- **Guaranty scope**: §13 — all equity holders personally guarantee, spousal exception, unlimited (confirmed via RT_depth_contract_burdens.json guaranty_scope)
- **Death/disability**: Heirs must notify within 120 days, franchisor approval needed, 6 months to sell if disapproved (confirmed via 08_final_report.md Section E)
- **Force majeure**: Not present in License Agreement (confirmed)
- **Modernization**: §5.1 — 25% threshold protection (confirmed)

### B-1.5 KT Successor assessment
Key provisions are covered through Item 17 tables. The remaining gaps are: exact KFC cross-default trigger language and successor-specific fee schedule if different from B-1. These are secondary provisions — the primary economics, term, and default mechanics are captured. This does not leave a material buyer-facing gap.

### Verdict decision
**Verdict 2 allowed**. The primary License Agreement (B-1) is fully clause-walked with all key operative burdens documented. B-1.5, B-2, and B-3 are labeled only but their material provisions are recovered through Item 17 cross-reference tables and the contract burden depth pass. No material buyer-facing gap in guaranty scope, liquidated damages, cross-default, or death/disability — all are covered in the run.

---

## Deferred Surfaced Exhibit Policy Assessment

Seven key operative exhibits were surfaced but not directly clause-walked:

| Exhibit | Pages | Operative Area | Recovery Source | Material Gap? |
|---------|-------|---------------|-----------------|---------------|
| B-1.5 KT Successor LA | 100-105 | Contract (variant economics/default) | Item 17 tables | No — primary terms recovered |
| B-2 Assignment/Guaranty | 105-110 | Transfer, guaranty | Item 17 + contract burden pass | No — guaranty scope confirmed |
| I Asset Purchase Agreement | 158-250 | Acquisition economics | Items 5, 7, 12, 17 | Minor — reps/warranties/indemnification thin |
| J Market Build Out Agreement | 251-280 | Development commitment | Items 6, 12 | Minor — milestone definitions thin |
| K Relationship Agreement | 281-315 | Large operator terms | Item 17 second table | Minor — financial covenants, LOC terms thin |
| L Development Services Agreement | 316-325 | Construction services | Items 5, 8, 11 | No — service scope/fees recovered |
| M/N YUM Financing Guaranty | 326-348 | Financing terms | Item 10 | Minor — loan covenants thin |

For each deferred exhibit, the missing clause walk is named as an extraction-depth gap with exact page ranges above. The key operative burdens (economics, default, transfer, termination, noncompete, guaranty, venue) are covered through body cross-references and the B-1 clause walk. The remaining thin areas are secondary provisions (reps/warranties in APA, milestone definitions in MBOA, financial covenants in RA, loan covenants in M/N) that do not materially weaken confidence for a serious buyer evaluating the core franchise relationship.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale

---

## Strongest Parts of the Run

1. **License Agreement clause walk (Exhibit B-1, pp. 70-100)**: 29 operative clauses extracted with section-level granularity including the distinctive §5.1 modernization threshold (25% company-operated units) and the §15.5 voluntary termination = default trap. Source: RT_depth_contract_burdens.json.

2. **Item 21 financial statement depth (Exhibit G, pp. 122-138)**: All 4 statements fully extracted plus all 6 note families walked, including the complete $3.74B securitization structure across 5 tranches with covenant thresholds, the $12.8M 53rd-week impact, and franchise incentive accounting mechanics ($43.4M capitalized). Source: RT_depth_financial_notes.json, RT_depth_item21_notes.json.

3. **State addenda structured overrides (Exhibit H, pp. 139-157)**: 23 discrete overrides across 11 states organized into 9 override families with per-state buyer-impact explanations. MN liquidated damages void, IL governing law override, NY licensee termination right restoration, and CA liquidated damages limitation are all individually surfaced. Source: RT_depth_state_addenda_promotion.json.

4. **Item 20 full table extraction (pp. 57-62)**: All 5 tables with state-level detail across 35 states + DC. Transfer acceleration pattern (1→2→7) and dominant closure category ("ceased operations — other") identified. 7 Texas reacquisitions flagged as significant. Source: RT_depth_item20_tables.json.

5. **Fee stack completeness (Item 6, pp. 15-18)**: 20+ fee types fully extracted including the alcohol restriction law workaround (non-alcohol royalty rate increases to compensate), the $0.19 digital transaction fee, and the technology fee breakdown ($6,500/yr franchisor + $16,600/yr third party + $83,500 one-time). Source: 12_canonical_enriched_v2.json item6_fee_detail; 08_final_report.md Section B.

6. **Securitization structure mapping**: Complete chain from TBC → Taco Bell Funding (Issuer) → Franchisor Holdings → Franchisor, with IP Holder parallel entity. $937.5M first tranche due May 2026 flagged as imminent refinancing event. Covenant structure (DSCR 1.75:1 / 1.1:1, leverage 5.0:1) documented. Source: RT_depth_financial_notes.json securitization_notes; 08_final_report.md Section H observations 3, 6, 7.

---

## Weakest Remaining Parts of the Run

1. **Exhibit I Asset Purchase Agreement (pp. 158-250)**: ~90 pages of complex acquisition contract not directly read. Key economic terms (purchase price, deposit, ROFR, 5-year lock) recovered via Items 5/7/12/17, but detailed representations and warranties, conditions precedent, and indemnification mechanics remain unextracted. For a buyer acquiring existing units, these are important secondary protections. Source: RT_depth_key_exhibits.json exhibits_deferred[2].

2. **Exhibit K Relationship Agreement (pp. 281-315)**: Governs operators with 25+ units. Key provisions (broad noncompete, 95% FMV buyout, acquisition moratorium) recovered via Item 17 second table, but financial covenants, letter of credit terms, and principal operator designation mechanics are thin. Relevant to any buyer entering at scale. Source: RT_depth_key_exhibits.json exhibits_deferred[4].

3. **Exhibit F Licensee List (pp. 116-121)**: Not fully extracted — names, addresses, and phone numbers of 224 current licensees and closed/transferred licensees are cataloged but not structured. The 06_coverage_audit.md rates this as LOW severity since it is reference data, but a buyer would use this list for due diligence calls. Source: 06_coverage_audit.md Material Gap 2.

4. **Scorecard letter grade absent**: 10_scorecard.md provides thorough coverage metrics but does not assign a formal letter grade. The implicit quality is A-range based on 23/23 items, 16/16 tables, complete financials, and structured state addenda — but the process gap means the score gate cannot mechanically confirm A or B. Source: 10_scorecard.md Final Verdict section.

5. **Exhibit J Market Build Out Agreement (pp. 251-280)**: Development commitment agreement not directly read. Fee structure ($22,500/unit) and penalties ($4,231/period) recovered via Items 6/12, but exact development milestone definitions and MBOA-specific termination triggers are thin. Relevant to buyers required to commit to multi-unit development. Source: RT_depth_key_exhibits.json exhibits_deferred[3].

---

## Where a Prior or Manual Run May Still Be Stronger

1. **APA clause detail (Exhibit I, pp. 158-250)**: A manual review would walk all ~90 pages of the Asset Purchase Agreement, extracting representations/warranties tables, indemnification caps/baskets, conditions precedent checklists, and the exact mechanics of the 2% deposit refundability. This run recovered key terms via cross-references but lacks the granular clause-level detail a deal attorney would expect.

2. **Relationship Agreement financial covenants (Exhibit K, pp. 281-315)**: A prior manual run could extract the specific leverage, liquidity, and net worth covenants that large operators must maintain. This run captures the headline provisions (95% FMV buyout, broad noncompete) but not the ongoing financial compliance requirements.

3. **Licensee list structuring (Exhibit F, pp. 116-121)**: A manual run might structure the full licensee directory into a searchable table with name/address/phone/unit count, enabling geographic analysis and due diligence outreach planning. This run catalogs its existence but does not extract the data.

4. **OneSource manual TOC analysis (Exhibit D, p. 114)**: A manual run might analyze the ~4,500-page operations manual table of contents to identify unusual operational requirements, training module specifics, or compliance burden indicators. This run notes its existence only.

5. **KT Successor LA differences (Exhibit B-1.5, pp. 100-105)**: A manual run would compare B-1.5 clause-by-clause against B-1 to identify any economic differences specific to KFC/Taco Bell multi-brand units. This run recovered key provisions via Item 17 but did not perform the comparative walk.

---

## Optional Max-3 Follow-Up Roadmap

1. **APA clause walk** — Target: Exhibit I, pp. 158-250. Extract representations/warranties, conditions precedent, indemnification mechanics, and deposit refundability detail. Output: `RT_recover_exhibit_I_apa.json`.

2. **Relationship Agreement depth** — Target: Exhibit K, pp. 281-315. Extract financial covenants, letter of credit terms, principal operator designation mechanics. Output: `RT_recover_exhibit_K_ra.json`.

3. **Licensee list structuring** — Target: Exhibit F, pp. 116-121. Structure current licensee names/locations and closed/transferred licensee reasons into searchable table. Output: `RT_recover_exhibit_F_licensees.json`.

---

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- None identified. All three contradictions (C1: royalty rate differential, C2: system trajectory vs projected growth, C3: no renewal rights vs successor policy) are confirmed consistent or legally distinct upon examination. Source: 09_final_canonical.json contradictions array.

### Business-Risk Flags
- **U1**: No FPR — zero financial performance disclosure for Express Units. Prospective licensees have no official guidance on revenues, costs, or profitability. Severity: HIGH. Source: Item 19, PDF p. 57.
- **U2**: Franchise incentives growing ($34M→$43M) — are Express units specifically receiving incentives to stay open? Not broken down by unit type. Severity: MEDIUM. Source: Exhibit G notes, PDF p. 134.
- **U3**: Revenue breakdown between Traditional ($663M total) and Express not disclosed. Express is ~3.6% of system units. Severity: MEDIUM. Source: Exhibit G Note 1, PDF pp. 131-132.
- **U4**: Integrated Expansion Policy content not in FDD body. Referenced as source of possible temporary impact protection but the policy itself is not included. Severity: MEDIUM. Source: Items 1, 12, PDF pp. 10, 44.
- **U5**: 7 company-owned units reacquired in Texas in 2024 — reason for licensee exit not disclosed. Severity: LOW. Source: Item 20 Table 4, PDF p. 62.
- **U6**: 2025 follow-on securitization planned but not yet executed. May affect fee structures or covenant requirements. Severity: LOW. Source: Item 1, PDF p. 8; Exhibit G Note 6, PDF p. 138.

### Extraction-Depth Gaps
- None. All unresolveds reflect information the FDD itself does not disclose (no FPR, no revenue breakdown, no Integrated Expansion Policy text, no explanation for Texas reacquisitions, planned-but-not-executed securitization). These are inherent document limitations, not extraction failures.

---

## Buyer-Trust Assessment

A serious buyer would trust this run as a comprehensive first-pass diligence tool for evaluating a Taco Bell Express license opportunity. The extraction covers all 23 FDD items with evidence grounding, surfaces the critical red flags (10% royalty vs 5.5% Traditional, no renewal rights, no FPR, declining system, no territory protection, $100K liquidated damages floor), and provides structured state-by-state addenda analysis that would be difficult to assemble manually. The securitization structure is thoroughly documented including covenant triggers. The primary gap — unwalked APA and Relationship Agreement exhibits — matters most for buyers acquiring existing units or entering at scale; a new single-unit Express licensee would find this run sufficient for investment decision-making. The absence of a formal scorecard letter grade is a process artifact that does not affect the substantive completeness of the extraction.

---

## Source-Grounding Compliance

All weaknesses, gaps, and "prior run stronger" claims above cite exact source pages, section identifiers, exhibit letters, or run file names. No unsourced claims are present in this gate.
