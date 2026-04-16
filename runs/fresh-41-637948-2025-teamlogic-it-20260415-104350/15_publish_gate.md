# Publish Gate — TeamLogic IT FDD (637948-2025)

**Verdict: 2 — Publish with caveats**

**Run**: fresh-41-637948-2025-teamlogic-it-20260415-104350
**Brand**: TeamLogic IT
**Gate date**: 2026-04-16

---

## Rationale

This is a high-quality extraction with full 23/23 item coverage, 11/11 exhibits cataloged, 15 material tables extracted, and zero material gaps. The final report is comprehensive (400+ lines, all required sections present). The canonical JSON is richly structured with evidence grounding. Two caveats prevent verdict 1:

1. **Missing RT_depth files**: The scorecard (10_scorecard.md, lines 44–59) references 8 depth-pass output files (RT_depth_financial_notes.json, RT_depth_contract_burdens.json, RT_depth_promotion_audit.json, RT_depth_state_addenda_promotion.json, RT_depth_item21_notes.json, RT_depth_key_exhibits.json, RT_depth_item20_tables.json, RT_depth_thin_items.json), but none exist on disk. The 14_run_summary.json files_created list (lines 52–67) also omits them. The depth-pass substance appears to have been folded into 11_canonical_enriched.json and 12_canonical_enriched_v2.json, so this is a provenance/audit-trail gap rather than a substance gap.

2. **No letter grade in scorecard**: The A3 gate requires evaluating whether the scorecard grade is A or B. The scorecard (10_scorecard.md, line 62) uses `Verdict: PASS — Complete extraction with high confidence` instead of a letter grade. The run is otherwise evaluable: all metrics are present and all checklist items pass. This is called out per task instruction rather than treated as a silent failure.

---

## Item-by-Item Assessment

### 1. Item 19 completeness — PASS

- Quartile table with all 4 quartiles, counts, highest/lowest/average/median/% above average extracted (08_final_report.md lines 218–223; 09_final_canonical.json lines 216–228).
- Population detail: 161 qualified franchisees, 262 businesses, 31 excluded under 24 months, 3 excluded closed (09_final_canonical.json lines 207–214).
- Multi-territory concentration detail per quartile (08_final_report.md lines 226–231).
- 10 notes / critical caveats captured (08_final_report.md lines 240–245).
- Cost/EBITDA non-disclosure explicitly flagged (09_final_canonical.json lines 224–226).
- Substantiation availability not separately extracted verbatim, but the "no CPA audit" caveat is captured (08_final_report.md line 244).

### 2. Item 20 completeness — PASS

- All 5 standard tables present: systemwide summary, transfers, franchised status, company-owned, projected openings (09_final_canonical.json lines 229–237; 08_final_report.md lines 253–258).
- Total rows balance: 282 start + 34 opened − 0 terminated − 2 non-renewed − 3 ceased = 311 end (consistent across all files).
- Franchisee list exhibit count captured: referenced in 06_coverage_audit.md line 27 (Item 20 current/former lists confirmed).
- Gag clause flag set: `confidentiality_clause: true` (09_final_canonical.json line 238).
- Geographic distribution by state provided (08_final_report.md lines 267–268).

### 3. Item 21 sufficiency — PASS

- Auditor identified: CliftonLarsonAllen LLP (09_final_canonical.json line 245).
- Opinion: Unqualified/clean, dated 2025-03-24 (09_final_canonical.json lines 246–247).
- Income statement, balance sheet, cash flow all extracted with 3-year comparatives (08_final_report.md lines 286–318; 09_final_canonical.json lines 249–258).
- Financial notes: 9 notes referenced in 06_coverage_audit.md line 28 and scorecard. Substance is present in 12_canonical_enriched_v2.json (balance sheet highlights, income statement highlights, cash flow highlights, related-party transactions detail at lines 38–59). However, the standalone RT_depth_item21_notes.json is missing from disk.
- Going-concern status: Not explicitly set as a field, but clean audit opinion and strong financials ($5.0M equity, $1.9M cash, no debt) implicitly confirm no going-concern issue.

### 4. State addenda sufficiency — PASS

- 14 states identified with addenda (09_final_canonical.json lines 324–348).
- State overrides structured into `state_addenda_overrides` in canonical with per-state affected families: noncompete, general_release, termination, forum_selection, governing_law, damages, jury_trial, fees (09_final_canonical.json lines 326–343).
- Override families properly structured for CA, MD, ND, NY with specific detail; remaining 10 states have existence confirmed (08_final_report.md lines 346–363).
- Exhibit E (pages 111–125) cataloged in 04_exhibits.json and content extracted.

### 5. Key exhibit sufficiency — PASS

- All 11 exhibits (A through K) cataloged in 04_exhibits.json with page ranges, content summaries, and extraction status.
- Exhibit A (Financial Statements, pp 51–67): extracted = true, content reflected in canonical and final report.
- Exhibit D (Franchise Agreement, pp 80–110): extracted = true, key provisions in Item 17 + canonical contract section.
- Exhibit E (Multi-State Addendum, pp 111–125): extracted = true, structured into canonical.
- Exhibit F (Multiple Franchise Amendment, pp 126–129): extracted = true.
- Exhibit G (Conversion Addendum, pp 129–131): extracted = true, CFF waiver detail in enriched v2.
- Exhibit H (Transfer Release, pp 132–134): extracted = true.
- Exhibit J (SBA Addendum, pp 137–139): deferred as low-materiality standard form (noted in scorecard line 59).

### 6. Unresolveds and contradictions — PASS

- 06_coverage_audit.md identifies 0 material gaps and 4 minor observations (lines 72–81).
- 08_final_report.md lists 5 unresolveds (Section J, lines 369–376) and 1 contradiction (Section K, lines 381–383).
- 09_final_canonical.json has structured `unresolveds` array (5 items, lines 314–320) and `contradictions` array (1 item, lines 321–323) as top-level keys.
- All unresolveds are genuine business-risk flags or document-internal issues — none are extraction gaps.

### 7. Final report depth — PASS

- 08_final_report.md is 409 lines — well above the 100-line minimum.
- Required sections present:
  - A. Executive Snapshot (lines 6–37)
  - B. Fee Stack, Entry Structure, Initial Investment (lines 40–99)
  - C. Supplier Control, Operating Control, Technology Burden (lines 103–141)
  - D. Territory, Competition, Channels, Encroachment (lines 143–163)
  - E. Contract Burden and Legal Mechanics (lines 165–200)
  - F. Item 19 Financial Performance Representations (lines 203–245)
  - G. Item 20 Outlet Data (lines 249–275)
  - H. Item 21 Financial Statements (lines 278–340)
  - I. State Addenda Summary (lines 344–363)
  - J. Unresolveds (lines 367–376)
  - K. Contradictions (lines 379–383)
  - L. Final Coverage Note (lines 387–409)

### 8. Score gate — CAVEAT

- 10_scorecard.md lists: 23/23 items, 11/11 exhibits, 145/145 pages, 15 tables, 0 material gaps, 5 unresolveds, 1 contradiction, confidence HIGH.
- The scorecard uses `Verdict: PASS` rather than a letter grade (A/B/C). All underlying metrics support an A-equivalent grade. The scorecard is evaluable despite the missing letter designation.

---

## Franchise Agreement clause-walk assessment

**Exhibit D — Franchise Agreement (pages 80–110)**

- Surfaced in 04_exhibits.json (lines 36–43) with `extracted: true`.
- Page range: 80–110 (~30 pages).
- Clause-walk status: No standalone RT_depth_contract_burdens.json exists on disk, so a dedicated A2 clause walk cannot be confirmed from file provenance alone. However, the run files demonstrate coverage of all key operative burdens:
  - **Term**: 10 years initial, 10-year renewal (09_final_canonical.json lines 156–157; 08_final_report.md line 168).
  - **Fees**: Full fee stack with 22 fee types (09_final_canonical.json lines 62–129; 08_final_report.md lines 48–86).
  - **Transfer**: Conditions, $10,000 fee, ROFR, family exception (09_final_canonical.json lines 164–169; 08_final_report.md lines 174–178).
  - **Termination**: Curable (20 days) and non-curable defaults, 3-defaults-in-12-months rule (09_final_canonical.json lines 161–166; 08_final_report.md lines 180–183).
  - **Non-compete**: During-term (1yr/25mi) and post-term (2yr/25mi) with CA override (09_final_canonical.json lines 174–190; 08_final_report.md lines 186–189).
  - **Default**: Curable and non-curable categories enumerated (08_final_report.md lines 181–183).
  - **Guaranty**: Spousal guarantee required (09_final_canonical.json special_risks; 08_final_report.md line 33).
  - **Venue/dispute**: Arbitration in Orange County, CA; CA governing law; jury trial waiver (09_final_canonical.json lines 192–200; 08_final_report.md lines 192–196).
  - **Death/disability**: May assign to approved buyer (09_final_canonical.json line 170; 08_final_report.md line 184).
  - **Renewal risk**: "Materially different" terms explicitly flagged (09_final_canonical.json line 159; 08_final_report.md lines 170–171).

**Verdict decision**: Verdict 2 allowed. All key operative burdens are covered through Item 17 cross-reference extraction and canonical structuring. No material buyer-facing gap remains. The missing RT_depth_contract_burdens.json is an audit-trail gap, not a substance gap.

**Remaining thin areas**: Liquidated damages formula not separately extracted from franchise agreement text (though ND addendum deletes liquidated damages per state override). Cross-default trigger language not verbatim-extracted (existence of 3-defaults-in-12-months rule is captured). Personal guaranty scope is confirmed as spousal but exact guaranty exhibit language not separately walked (no standalone guaranty exhibit exists in this FDD — guaranty is embedded in franchise agreement per Item 15/17 disclosures).

---

## Deferred surfaced exhibit assessment

- **Exhibit F (Multiple Franchise Amendment, pp 126–129)**: Labeled extracted. Content summary in 04_exhibits.json describes territory consolidation, coterminous terms, operating requirements, release provisions. Conversion economics captured in enriched v2 (line 69). Economics do not differ from standard agreement. Low risk of material gap.
- **Exhibit G (Conversion Addendum, pp 129–131)**: Labeled extracted. CFF waiver on existing Gross Sales for 12 months captured in enriched v2 fee detail (line 69). Key economic difference (CFF waiver) is surfaced.
- **Exhibit H (Transfer Release, pp 132–134)**: Labeled extracted. Content summary includes mutual release, CA Civil Code 1542 waiver, post-termination obligations survive. Transfer mechanics fully covered in canonical contract section.
- **Exhibit J (SBA Addendum, pp 137–139)**: Deferred as low-materiality standard form. This is reasonable — SBA addenda are federally standardized and do not contain franchise-specific economics.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale

---

## Strongest parts of the run

1. **Item 19 quartile table with multi-territory concentration detail** (08_final_report.md lines 218–231, pages 31–33): All 4 quartiles with 7 metrics each, plus per-quartile multi-territory operator counts — a level of detail that enables genuine economic analysis.
2. **Item 21 three-year financial statements with revenue composition and margin analysis** (08_final_report.md lines 286–340, 12_canonical_enriched_v2.json lines 6–59; Exhibit A pages 51–67): Full balance sheet, income statement, equity, cash flow plus working capital ratios, related-party transaction detail, and distribution analysis.
3. **Fee stack with 22 fee types and combined minimum floor calculation** (09_final_canonical.json lines 62–129; 08_final_report.md lines 48–86, Item 6 pages 11–14): Every fee variant, technology fee, and event-driven fee captured with amounts, timing, and conditions; combined minimum monthly obligation ($3,700+) explicitly calculated.
4. **State addenda structured into per-state override families** (09_final_canonical.json lines 324–348; 08_final_report.md lines 344–363; Exhibit E pages 111–125): 14 states with affected families (noncompete, governing_law, forum_selection, damages, jury_trial, general_release, fees, termination) — not just cataloged but structured for per-state comparison.
5. **Item 20 outlet trajectory with attrition rate calculation and geographic distribution** (08_final_report.md lines 253–268; 09_final_canonical.json lines 229–237; pages 33–40): Three-year growth, zero terminations, attrition rates of 1.4–2.3%, transfer trends, projected openings, and top-10 state distribution.
6. **Managed services revenue analysis as franchisor profit center** (08_final_report.md lines 15, 36–37, 106–108; 12_canonical_enriched_v2.json lines 99–104; Item 8 page 17): $6.8M revenue / $5.04M gross margin / 37% of total revenue from mandatory franchisee purchases — a critical economic insight surfaced across multiple report sections.

---

## Weakest remaining parts of the run

1. **Missing RT_depth files from disk** (referenced in 10_scorecard.md lines 44–59 but absent from directory and from 14_run_summary.json files_created): 8 depth-pass files referenced but not persisted. Substance appears folded into enriched canonicals, but the audit trail is broken — a reviewer cannot independently verify which pages were read during each depth pass.
2. **Item 19 substantiation availability statement not extracted verbatim** (Item 19, page 33 per source map): The standard FDD statement offering written substantiation of FPR data is not quoted in canonical or final report. The "no CPA audit" caveat is captured (08_final_report.md line 244) but the full substantiation offer language is absent.
3. **Going-concern status not explicitly set as a structured field** (09_final_canonical.json Item 21 section, lines 244–258): The clean audit opinion and strong financials imply no going-concern, but no explicit `going_concern: false` field exists in canonical. A downstream consumer relying on structured data would have to infer this.
4. **Exhibit J (SBA Addendum, pages 137–139) deferred without clause walk** (10_scorecard.md line 59; 04_exhibits.json lines 90–96): While SBA addenda are standard federal forms, a buyer using SBA financing would want confirmation that no franchise-specific modifications exist. This was explicitly deferred as low-materiality.
5. **Individual franchisee data from Item 20 not structurally extracted** (06_coverage_audit.md lines 79–80; pages 35–39): Count and structure verified but individual state-level franchisee data not extracted into structured format (PII considerations cited). A manual run would typically include state-level counts from the franchisee list tables.

---

## Where a prior or manual run may still be stronger

1. **Franchise Agreement verbatim clause extraction** (Exhibit D, pages 80–110): A manual run would typically produce a clause-by-clause walk with exact section numbers, verbatim operative language for guaranty scope, liquidated damages formula, and cross-default triggers. This run relies on Item 17 summary table cross-references rather than direct clause extraction.
2. **Item 20 franchisee list with state-level outlet counts** (pages 35–39): A manual run would typically extract the per-state franchise count from Item 20 Table 3, enabling geographic concentration analysis. This run confirms the list was read but does not structure individual state rows.
3. **Item 19 cost build-up estimation from Item 6/7 data**: A manual analyst would typically cross-reference the fee stack (Item 6) and initial investment (Item 7) against Item 19 quartile revenue to produce an illustrative cost build-up and break-even estimate. This run flags the absence of cost data but does not construct the cross-reference analysis.
4. **Exhibit F/G operative clause differences**: A manual run would compare the Multiple Franchise Amendment (Exhibit F, pp 126–129) and Conversion Addendum (Exhibit G, pp 129–131) against the standard Franchise Agreement to identify economic or legal differences beyond what is disclosed in Item 5/6. This run captures the high-level economic differences (CFF waiver for conversions) but not clause-level comparison.

---

## Optional max-3 follow-up roadmap

1. **Reconstruct RT_depth files from enriched canonicals** → `RT_depth_contract_burdens.json`
   Recover the depth-pass audit trail by extracting the contract burden families, financial note detail, and state addenda promotion data currently embedded in 11/12 enriched canonicals into standalone RT_depth files. This restores provenance without re-reading the PDF.

2. **Clause-walk Exhibit D franchise agreement** → `RT_depth_exhibit_D_clause_walk.json`
   Perform a targeted clause walk of Exhibit D (pages 80–110) to extract verbatim guaranty scope, liquidated damages formula, cross-default triggers, and any provisions not covered by the Item 17 summary table.

3. **Structure Item 20 Table 3 per-state outlet counts** → `RT_depth_item20_state_counts.json`
   Extract the per-state franchised outlet counts from Item 20 Table 3 (pages 35–39) into structured format for geographic concentration analysis.

---

## Unresolved taxonomy

### Document-internal inconsistencies

- **U5** (Low): Page 6 header shows "FDD TLI 03/2024" while all other pages show "03/2025". Content on page 6 references December 31, 2024 data consistent with 2025 issuance. Typographical carryover from prior year FDD. (Source: 09_final_canonical.json line 322; 08_final_report.md line 383)

### Business-risk flags

- **U1** (Medium): Item 19 does not disclose costs, expenses, EBITDA, or profitability — franchisee net income cannot be estimated from FDD data alone. (Source: Item 19 pages 31–33; 09_final_canonical.json line 315)
- **U2** (Medium): Multi-territory operators dominate Q1 Item 19 data (27 of 41); single-territory performance not separately reported. First-time single-territory franchisee should benchmark against Q2–Q3, not Q1. (Source: Item 19 notes 5 and 9, pages 31–33; 09_final_canonical.json line 316)
- **U3** (Medium): Renewal may require signing "materially different" terms — scope of potential changes unspecified. (Source: Item 17 page 29; 09_final_canonical.json line 317)
- **U4** (Medium): Mandatory minimum floor payments ($1,000 CFF + $200 Ad Fund + $2,500 local marketing = $3,700/month) may strain Q3/Q4 performers whose median gross revenue is $450K and $222K respectively. (Source: Items 6 and 19; 09_final_canonical.json line 318)

### Extraction-depth gaps

(None. All unresolveds are business-risk or document-internal issues, not extraction failures.)

---

## Buyer-trust assessment

A serious buyer evaluating the TeamLogic IT franchise opportunity would find this extraction reliable and comprehensive. The run captures the full economic picture — fee stack with combined floor calculations, Item 19 quartile data with multi-territory concentration caveats, franchisor financials with related-party analysis, and contract burden mechanics with state-specific overrides. The five unresolveds are genuine business-risk flags inherent to the FDD itself (cost data non-disclosure, multi-territory skew, renewal terms uncertainty, minimum payment burden), not artifacts of incomplete extraction. The two caveats (missing depth-pass file provenance and absent letter grade) are process-level gaps that do not affect the substance available to the buyer. A buyer would need to supplement this extraction only with their own cost build-up analysis and direct franchisee validation calls — both of which are expected due diligence steps beyond the scope of FDD extraction.

---

## Contradiction log

| ID | Description | Status | Source |
|----|-------------|--------|--------|
| C1 | Page 6 header "03/2024" vs all other pages "03/2025" | Unresolved — typographical error, low impact | 09_final_canonical.json line 322; 08_final_report.md line 383 |

---

*Gate completed 2026-04-16. Verdict 2 — Publish with caveats.*
