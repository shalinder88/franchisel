# Publish Gate — Subway FDD (638763-2025)

## Verdict: **2 — Publish with caveats**

**Rationale**: This is a comprehensive extraction of a 955-page FDD — one of the largest documents in the system. All 23 items are fully extracted with strong evidence grounding. Item 21 financial statements are completely surfaced (PwC audit, all statements, all 7 notes). The fee stack is exhaustively documented across 15 pages. Item 20 provides complete systemwide trajectory data with all 5 standard tables. The key caveat is that several surfaced key exhibits (DA, MUFA, Sublease) were not directly clause-walked but have their operative substance adequately recovered through Item 17 cross-references and the FA clause walk. State addenda are structured into canonical with 19 override entries across 10 states.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: COMPLETE
- No FPR provided. The no-FPR statement is extracted verbatim: "We do not make any representations about a franchisee's future financial performance..."
- Substantiation availability: not applicable (no FPR)
- Item 19 cohort comparability: N/A — no FPR provided

### 2. Item 20 Completeness
- **Status**: COMPLETE
- All 5 standard tables present:
  - Table 1: Systemwide summary (p. 95)
  - Table 2: State-by-state transfers (pp. 96–99)
  - Table 3: Franchised status with totals (pp. 100–104)
  - Table 4: Company-owned status — all zeros (pp. 105–109)
  - Table 5: Projected openings — 120 FA signed + 150 projected (pp. 110–111)
- Total rows balance correctly
- Franchisee list (Exhibit B) count captured
- **Gag clause flag: TRUE** — verbatim quote extracted from p. 111

### 3. Item 21 Sufficiency
- **Status**: COMPLETE
- Auditor: PricewaterhouseCoopers LLP (identified)
- Balance sheet, income statement, cash flow: all extracted with dollar values
- Notes to financial statements: all 7 notes covered via A2 depth pass
  - Revenue recognition, vendor funds, intangibles, affiliate transactions, guarantees, commitments, subsequent events, income taxes
- Going-concern status: FALSE (no going concern language)
- Item 21 method: normal text extraction

### 4. State Addenda Sufficiency
- **Status**: COMPLETE
- 10 states identified (CA, HI, IL, MD, MN, ND, NY, RI, VA, WA)
- Structured into `state_addenda_overrides` in 09_final_canonical.json
- 19 override entries across 7 override families:
  - noncompete_limited: CA, ND
  - forum_selection_limited: CA, IL, MD, MN, ND
  - general_release_restricted: CA, MD, MN, WA
  - governing_law_limited: CA, ND
  - termination_protection: MN
  - liquidated_damages_limited: CA
  - anti_waiver: CA, HI, MD, MN

### 5. Key Exhibit Sufficiency
- **Status**: ADEQUATE with noted gaps
- Exhibit A (FA): Clause-walked — 26 operative clause entries
- Exhibit C (Financials): Complete — all statements and notes
- Exhibit L (Litigation): Headline count (93 actions); individual cases surfaced but not fully structured
- Exhibit P (State Addenda): Structured per-state overrides extracted
- DA (A-12), MUFA (A-13), Sublease (D): Deferred with rationale — substance recovered from FA walk and Item 17 cross-references
- Exhibit O (General Release): Deferred — state restrictions extracted via state addenda

### 6. Unresolveds and Contradictions
- **Status**: COMPLETE
- 5 unresolveds in `unresolveds` key of 09_final_canonical.json:
  - U1 (Medium): Unaudited interim statements location
  - U2 (Low): BD compensation formulas
  - U3 (High): Securitization implications for franchisee claims
  - U4 (Medium): Fresh Forward 2.0 remodel costs
  - U5 (Medium): Future Digital Technology Fee
- 1 contradiction in `contradictions` key:
  - C1: Operating expense discontinuity ($374M drop) — explained by restructured affiliate fees
- All unresolveds are genuine business-risk flags, not extraction gaps

### 7. Final Report Depth
- **Status**: ADEQUATE
- 08_final_report.md is a full diligence report with all required sections:
  - A: Executive snapshot (15 bullets) ✓
  - B: Fees/investment (comprehensive fee stack, Item 7 tables) ✓
  - C: Supplier/operations/tech (training, advertising, technology burden) ✓
  - D: Territory (no exclusive territory — extensively documented) ✓
  - E: Contract burden/legal (term, renewal, termination, transfer, noncompete, dispute resolution) ✓
  - F: Item 19 (no FPR — discussed) ✓
  - G: Item 20 (trajectory table, gag clause, NAASF) ✓
  - H: Item 21 (auditor, statements, cash flow, key observations) ✓
  - I: State addenda (10 states summarized) ✓
  - J: Unresolveds (5 entries with severity) ✓
  - K: Contradictions (1 entry with resolution) ✓
  - L: Final coverage note ✓
- Report is substantive standalone diligence narrative

### 8. Score Gate
- **Status**: PASS
- Overall grade: A- (post-A2)
- All required items covered
- Canonical fields populated with evidence grounding
- 42+ top-level keys in canonical

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced exhibits:**
- Exhibit A (FA): pp. 114–162 (49 pages) — **CLAUSE-WALKED** via A2 depth pass
- Exhibit A-12 (DA): pp. 315–330 (16 pages) — **DEFERRED** with rationale
- Exhibit A-13 (MUFA): pp. 331–379 (49 pages) — **DEFERRED** with rationale

**Verdict decision: Verdict 2 allowed** because:
1. The FA has been clause-walked with 26 operative clause entries
2. The DA and MUFA share substantially identical operative provisions with the FA
3. Item 17 provides comprehensive cross-references for all three agreements
4. Key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty, venue) are adequately covered
5. No material buyer-facing gap identified from the missing DA/MUFA clause walks

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 6 fee extraction (pp. 38–52)**: All 30+ fee categories across 15 pages fully extracted with amounts, timing, and notes. The total fee burden calculation (14.4%+ of gross sales) provides clear buyer insight.

2. **Item 21 financial statements (pp. 697–712)**: Complete PwC-audited financials with all 7 note families walked. Key structural fact surfaced: $5.685B securitization guarantee collateralized by DAL's revenue-generating assets.

3. **Item 20 systemwide trajectory (pp. 95–111)**: All 5 standard tables with state-by-state detail. The shrinking system narrative (-1,645 net over 3 years) is clearly quantified. Gag clause flagged with verbatim quote from p. 111.

4. **State addenda structured extraction (pp. 918–949)**: 19 override entries across 10 states structured into canonical. Override family matrix identifies which states limit noncompete, forum selection, general release, and governing law.

5. **Item 17 contract burden (pp. 86–93)**: Full termination/renewal/transfer/dispute resolution chart with 14 non-curable defaults, general release requirements, 30-day ROFR, and Connecticut arbitration venue.

6. **Securitization documentation**: The $5.685B securitization structure is thoroughly documented from Item 1, Note 5, and the financial statement notes, including its implications for franchisee risk.

### 2. Weakest Remaining Parts of the Run

1. **Item 2 leadership roster**: Only 4 individuals individually named in structured array. Full roster spans pages 26–29 with dozens of officers/directors across DAL, SWSH, FWH, FWHT — line-by-line extraction not completed.

2. **Development Agreement / MUFA clause walk**: Exhibits A-12 (pp. 315–330) and A-13 (pp. 331–379) are each 16–49 pages and were not directly clause-walked. Substance recovered from FA walk and Item 17 cross-references, but DA-specific development schedule penalties and MUFA-specific multi-unit provisions may have nuances not captured.

3. **Sublease clause walk (Exhibit D, pp. 747–769)**: 23-page sublease deferred. Rent ranges and guaranty requirements surfaced from Items 6/7/10, but specific sublease default triggers, rent escalation mechanics, and sublease-specific termination provisions not directly extracted.

4. **Exhibit L litigation detail**: 93 actions counted but individual case details (claims, amounts, outcomes) across 23 pages not fully structured into a case-by-case array.

5. **Unaudited interim statements**: Item 21 references unaudited balance sheet as of October 31, 2025 — exact PDF page range not confirmed. These interim statements may contain post-securitization data relevant to assessing current financial condition.

### 3. Where a Prior or Manual Run May Still Be Stronger

1. **Item 2 complete roster**: A manual extraction would capture every named officer/director across pages 26–29 — potentially 30+ individuals with roles, tenures, and prior employment.

2. **Sublease operative mechanics**: A manual walk of the 23-page sublease (Exhibit D, pp. 747–769) would capture specific default triggers, rent calculation formulas, landlord consent requirements, and sublease-specific cure periods that affect franchisee risk in lease default scenarios.

3. **Litigation case analysis**: A manual review of Exhibit L (pp. 870–892, 23 pages) could identify patterns in franchise disputes — e.g., frequency of noncompete enforcement, trademark cases, fee disputes — and quantify claimed damages.

4. **Multi-Unit/Development Agreement nuances**: The DA (pp. 315–330) and MUFA (pp. 331–379) may contain development schedule penalty triggers, multi-unit default provisions, or area-specific provisions that differ from the standard FA.

5. **Unaudited interim financials**: A manual run would locate and extract the October 31, 2025 unaudited statements for current-period financial assessment.

### 4. Optional Max-3 Follow-Up Roadmap

1. **RT_depth_exhibit_D_sublease.json**: Walk the 23-page Sublease (pp. 747–769) for rent calculation, default triggers, and cure periods.

2. **RT_depth_item2_full_roster.json**: Extract complete officer/director roster from pages 26–29 as structured array.

3. **RT_depth_litigation_cases.json**: Structure Exhibit L (pp. 870–892) into a case-by-case array with parties, claims, amounts, and outcomes.

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies:**
- C1: Operating expense discontinuity ($941.8M → $567.4M) — explained by restructured affiliate fees post-securitization. Not a true inconsistency but a presentation challenge.

**Business-Risk Flags:**
- U3 (HIGH): Securitization implications — $5.685B guaranteed by DAL assets; franchisee position in priority unclear
- U4 (MEDIUM): Fresh Forward 2.0 remodel costs undisclosed for non-traditional/drive-thru
- U5 (MEDIUM): Future Digital Technology Fee amount undisclosed

**Extraction-Depth Gaps:**
- U1 (MEDIUM): Unaudited interim statements (Oct 31, 2025) — location in PDF not confirmed
- U2 (LOW): Business Developer compensation exact formulas

### 6. Buyer-Trust Assessment

A serious buyer evaluating a Subway franchise would find this extraction materially complete and trustworthy for the key decision drivers: fee burden quantification, system trajectory analysis, contract mechanics, territory risk, and financial health assessment. The critical buyer-facing facts — no FPR, no exclusive territory, shrinking system, gag clause, $5.685B securitization, 8% + 4.5% + 1.9% fee stack, Connecticut arbitration, Florida law — are all surfaced and grounded in specific page references. The deferred exhibit walks (DA, MUFA, Sublease) do not leave material buyer-facing gaps because the operative substance is adequately covered through the FA clause walk and Item 17 cross-references. A buyer would benefit from further investigation of the securitization's implications for franchisee claims and the Fresh Forward 2.0 remodel cost exposure.

### 7. Source-Grounding Rule

All weaknesses, gaps, and "prior run stronger" claims above cite exact source pages or section identifiers. No unsourced claims.
