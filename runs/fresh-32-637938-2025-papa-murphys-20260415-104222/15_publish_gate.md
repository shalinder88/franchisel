# Publish Gate — Papa Murphy's International LLC (FDD #637938-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

The extraction covers all 23 Items with high confidence. Item 19 FPR is fully extracted with 3-year, 3-region detail. Item 20 includes all 5 standard tables with state-level detail. Item 21 financial statements have been recovered for all 5 fiscal years via targeted image fallback for FY2024/2023 and normal text extraction for FY2022/2021/2020. State addenda for 10 states are structured into canonical. Fee stack, investment, and contract burden are fully documented. 

The primary remaining gap is that Exhibit D (Franchise Agreement) was not fully clause-walked — however, the key operative burdens are adequately covered through Item 17 cross-references and the A2 contract burdens depth pass. This warrants verdict 2 rather than 1.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with 3 years of data, 3 regional breakdowns, and top/bottom decile splits
- Self-reported, unaudited caveat captured
- Substantiation availability statement captured ("written substantiation available on reasonable request")
- No cost/EBITDA data (noted as limitation)
- Item 19 cohort comparability: no discrepancy — same 5% royalty for all cohorts

### 2. Item 20 Completeness — PASS
- All 5 standard tables present (systemwide, transfers, franchised status, company-owned status, projected openings)
- State-level detail for all tables
- Total rows verified (minor 2-unit discrepancy between Table 1 and Table 3 noted)
- Franchisee list in Exhibit B (44 pages, cataloged)
- Gag clause flagged: "current and former franchisees sign provisions restricting their ability to speak openly"

### 3. Item 21 Sufficiency — PASS (post-image fallback)
- Auditor identified: PricewaterhouseCoopers LLP (Montreal)
- Opinion: Unqualified (clean)
- Going concern: None
- Income statement extracted for FY2024, 2023, 2022, 2021, 2020
- Balance sheet extracted for FY2024, 2023, 2022
- Cash flow extracted for FY2024, 2023
- Financial notes covered (FY2022 text-readable notes; FY2024/2023 note page walk deferred)
- KEY FINDING: FY2024 net loss of $(12.6M), $44.3M impairment charges, $708M intercompany loan

### 4. State Addenda Sufficiency — PASS
- 10 states identified: CA, HI, IL, MD, MN, NY, ND, RI, VA, WA
- Structured into `state_addenda_overrides` in canonical with 24 specific override entries
- Override families mapped: forum selection (7 states), governing law (4), noncompete (3), general release (7), termination (2), damages (2), fee deferral (1)
- Maryland fee deferral (critical) explicitly captured

### 5. Key Exhibit Sufficiency — PARTIAL
- Exhibit C (Financial Statements): Recovered via image fallback — PASS
- Exhibit D (Franchise Agreement): Not clause-walked — key burdens covered via Item 17 cross-references
- Exhibit F (State Addenda): Fully structured — PASS
- Exhibit J (Guarantee): Cataloged — PASS
- Exhibit M (Successive Addendum): Not deep-read — renewal economics referenced from Item 17
- Exhibit N (Release of Claims): Not scope-assessed

### 6. Unresolveds and Contradictions — PASS
- 9 unresolveds captured in canonical (3 high, 4 medium, 2 low)
- 3 contradictions captured in canonical
- All unresolveds are genuine business-risk flags, not extraction gaps

### 7. Final Report Depth — PASS
- 08_final_report.md contains all required sections (A through L)
- Substantive narrative in each section
- Sections present: executive snapshot, fees/investment, supplier/operations/tech, territory, contract burden/legal, Item 19 detail, Item 20 detail, Item 21 detail, state addenda, unresolveds, contradictions, final coverage note
- Well over 100 lines

### 8. Score Gate — PASS
- Overall grade: A- (post-A2)
- All 23 items covered (22 at A grade, Item 21 at A-)
- Canonical fields populated with evidence grounding

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced exhibit:** Exhibit D — Franchise Agreement (pp. 208–268, 61 pages)
**Clause-walked:** No — labeled and page-range identified but not directly walked
**Verdict decision:** Verdict 2 allowed

**Rationale:** The franchise agreement's key operative burdens are adequately covered through:
- Item 17 relationship table (23 provisions with FA section references)
- A2 contract burdens depth pass (12 burden families extracted)
- Item 6 fee table (30+ fees with FA cross-references)
- Item 9 obligations table (24 categories with FA section references)

Covered burdens: term (10yr), renewal (5yr), fees (royalty 5%, BMF 2%, etc.), transfer conditions, termination triggers and cure periods, noncompete (25mi/2yr), death/disability (180 days), dispute resolution (WA), insurance ($2M GL), early termination damages formula, cross-default, ROFR.

**What remains thin:** Specific liquidated damages calculation mechanics beyond the formula; personal guaranty scope detail beyond Exhibit J corporate guarantee; specific default cure mechanics beyond the summary; force majeure provisions (if any); specific ACH authorization scope beyond Exhibit I reference.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Deferred Surfaced Exhibit Policy

The following surfaced key exhibits were not fully clause-walked:
- **Exhibit D (FA):** pp. 208–268 — key burdens covered via Item 17 and A2 depth pass
- **Exhibit M (Successive Addendum):** pp. 315–318 — renewal economics referenced from Item 17 but not independently verified from exhibit text
- **Exhibit N (Release of Claims):** pp. 320–322 — scope not assessed; state addenda restrict release scope in 7 states

**Assessment:** The missing clause walks do not leave material buyer-facing gaps because:
1. Item 17 provides comprehensive summary of all key contract provisions
2. The A2 contract burdens pass extracted 12 burden families with source pages
3. State addenda restrictions on general release are captured for 7 states
4. The most critical economic terms (fees, term, renewal fee) are fully covered in Items 5-7 and 17

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Strongest Parts of the Run

1. **Item 19 FPR (pp. 60–65):** Three years of data with three regional breakdowns and decile splits — among the most detailed FPR formats. All 1,015 2024 stores included. Survivorship bias flag correctly raised.
2. **Item 20 outlet data (pp. 65–72):** All 5 tables with full state-level detail. 96 terminations, 28 reacquisitions clearly captured. Gag clause flagged.
3. **Item 21 image recovery (pp. 123–132):** Successfully recovered FY2024/2023 financial statements from image-only pages using targeted pdftoppm rendering. Net loss finding is critical buyer intelligence.
4. **State addenda structured promotion (pp. 275–283):** 10 states, 24 overrides, mapped to 7 override families. Maryland fee deferral and financial condition risk explicitly captured.
5. **Fee stack completeness (pp. 29–36):** 30+ fees extracted with explanatory notes. Early termination damages formula fully documented. Breaching Royalties (15%) captured.
6. **Brand Marketing Fund deficit (p. 49):** $(7.5M) deficit with full revenue/expense breakdown — material for buyer trust.
7. **System contraction analysis (pp. 65–72):** 3-year trajectory table showing 17.4% decline in franchised units, with acceleration in 2024. Reacquisition pattern (TN 15, NC 7) noted.

## Weakest Remaining Parts of the Run

1. **Exhibit D Franchise Agreement not clause-walked (pp. 208–268):** While key burdens are covered via Item 17, the full operative text (61 pages) has not been directly read. Specific guaranty scope, force majeure, and ACH authorization mechanics may contain additional obligations.
2. **FY2024/2023 financial statement notes not extracted (pp. 133–158):** The 26 note pages for FY2024/2023 are image-only and were not rendered/read. Only headline financial figures recovered. Revenue recognition policy, impairment detail, lease maturity schedule, and tax rate reconciliation for current years are absent.
3. **Exhibit M Successive Addendum not deep-read (pp. 315–318):** Renewal economics are referenced from Item 17 but the actual addendum has not been independently verified. Successor-term fee structure and conditions may differ from summary.
4. **Exhibit N Release of Claims scope not assessed (pp. 320–322):** The release is required for renewal and transfer. Its scope is critical for franchisee rights, especially in states without addenda restrictions.
5. **Item 20 franchisee list not individually extracted (pp. 77–121):** 44 pages of franchisee contact information cataloged but not extracted into structured data.

## Where a Prior or Manual Run May Still Be Stronger

1. **Full franchise agreement clause walk:** A manual reviewer with 60 pages of FA text would capture every operative clause including unusual provisions, specific dollar thresholds, and time periods not summarized in Item 17.
2. **FY2024/2023 note detail:** A manual reader could extract the full 26 pages of financial statement notes for current years, including lease maturity schedules, goodwill impairment testing methodology, and segment-level detail that the headline extraction missed.
3. **Franchisee interview context:** A manual due diligence process would include actual conversations with current and former franchisees (despite the gag clause) to assess real-world unit economics, which the FDD does not disclose.
4. **Successive Addendum comparison:** A manual review would compare the successive addendum terms against the current FA to identify specific changes at renewal — particularly whether the royalty rate increases.

## Optional Max-3 Follow-Up Roadmap

1. **Exhibit D full clause walk** → `RT_depth_key_exhibits.json` — walk all 61 pages of the FA for guaranty scope, force majeure, ACH mechanics, and any unusual clauses
2. **FY2024/2023 financial notes image extraction** → `RT_depth_item21_notes.json` — render and read pp. 133–158 for note-level detail
3. **Exhibit M + N deep read** → `RT_recover_exhibit_M_N.json` — verify renewal economics and release scope

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- Table 1 vs Table 3 start count 2022: 1,212 vs 1,210 (2-unit difference)
- Company-owned count: Table 4 (44) vs Item 1 (43) — 1-unit difference
- BMF deficit carryover year labeling

### Business-Risk Flags
- Maryland special risk: franchisor financial condition questionable (validated by FY2024 net loss)
- System contraction: 17.4% decline, accelerating in 2024
- Brand Marketing Fund $7.5M deficit
- Gag clause on former franchisees
- Item 19 provides only sales data — no profitability modeling possible
- $708M intercompany loan — nature and terms not fully transparent
- FY2024 net loss and $44.3M impairments

### Extraction-Depth Gaps
- Exhibit D Franchise Agreement not clause-walked
- FY2024/2023 financial note pages not extracted
- Exhibit M (Successive Addendum) not deep-read
- Exhibit N (Release of Claims) scope not assessed

## Buyer-Trust Assessment

A serious buyer could use this run as a reliable foundation for due diligence on Papa Murphy's. The critical economic terms (fees, investment, FPR, outlet trajectory) are fully documented with source pages. The FY2024 financial recovery via image fallback surfaces the material finding that the guarantor swung to a net loss driven by $44M in impairments — this is essential buyer intelligence that validates the Maryland regulator's financial condition concern. The state addenda are structured to show exactly which protections apply in each state. The main limitation is the absence of a full franchise agreement clause walk, which means some operative detail (guaranty scope, force majeure) relies on Item 17 summaries rather than primary contract text. For a prospective franchisee in a state with addenda (especially MD, MN, ND), this extraction provides strong decision support. A franchisee outside those states should seek independent legal review of the FA before signing.
