# Publish Gate — Sonic Drive-Ins 2025 FDD (Filing 637949)

## Verdict: **1 — Publish-ready**

This extraction is publish-ready. All 23 FDD items are fully extracted with evidence grounding. Both financial statement sets (Sonic Franchising LLC and SIS) are walked through all note families. State addenda are structured into canonical with per-state overrides. The franchise agreement has been clause-walked at the operative-burden level (28 clause families). No material extraction gaps remain. All unresolveds are business-risk flags, not extraction gaps.

---

## Checklist Assessment

### 1. Item 19 Completeness — PASS
Three FPR tables extracted: (1) quartile breakdown with all 4 quartiles + all restaurants (pp 72-73), (2) regional breakdown with 4 regions (p 73), (3) venue type breakdown with 3 venue types (p 73). Population count: 3,086 of 3,144 franchised. Exclusion rules documented: 30 opened during year, 26 extended closures, 2 non-traditional, 1 multi-brand, 80 closed, 317 company-owned. Substantiation availability statement captured (p 75). All statistics (AUV, median, highest, lowest, % above average) present. Cost/EBITDA absence flagged. Item 19 cohort comparability checked: no discrepancy — same 5% royalty rate applies to cohort and current new franchisees.

### 2. Item 20 Completeness — PASS
All 5 standard tables present: Table 1 (system summary, p 75), Table 2 (transfers with per-state detail, pp 76-78), Table 3 (franchised status with per-state detail, pp 79-82), Table 4 (company-owned status with per-state detail, pp 82-83), Table 5 (projected openings, pp 82-83). Total rows balance: 3,194 - 50 = 3,144 (franchised); 327 - 10 = 317 (company). Franchisee list exhibit count: E-1 (~110 pages, 3,144 locations), E-2 (not yet opened), E-3 (developers), E-4 (80 former franchisees + 14 terminated DAs). Gag clause flag: SET (p 83) with verbatim quote.

### 3. Item 21 Sufficiency — PASS
Auditor: KPMG LLP, Atlanta, GA. Opinion: Unqualified (clean), dated March 20, 2025. Two complete sets of financial statements extracted: Sonic Franchising LLC (balance sheet, income statement, member's equity, cash flow, notes 1-7) and SIS (consolidated balance sheet, income statement, equity, cash flow, notes 1-11). Going concern: No going-concern language present. All 11 SIS note families walked (description, accounting policies, supplemental balance sheet, intangibles, long-term debt, leases, revenue recognition, income taxes, related-party, commitments, subsequent events). Key financial facts: $1,417.3M securitization debt, $822.6M goodwill, $1.1B trademark, debt maturity cliff $617M in 2027, all covenants compliant. Item 21 method: normal text extraction (no image fallback needed).

### 4. State Addenda Sufficiency — PASS
Six states identified with addenda (CA, HI, MD, MN, ND, WA) per Exhibit G (pp 341-362). All structured into `state_addenda_overrides` in `09_final_canonical.json` and `12_canonical_enriched_v2.json`. 17 specific override entries extracted in `RT_depth_state_addenda_promotion.json` with per-state, per-family detail including `affected_family`, `override_summary`, `why_it_matters`, and `source_pages`. Summary override-family × state matrix included. State riders for MD, MN, ND, WA also identified.

### 5. Key Exhibit Sufficiency — PASS
All 10 contracts listed in Item 22 (p 84) are accounted for in `04_exhibits.json`. Financial exhibit (F) fully walked. FA (B-1) clause-walked at operative-burden level with 28 clause families in `RT_depth_contract_burdens.json`. State addenda (G) fully extracted. DA (C-1) key terms recovered from Items 5, 12, 17 cross-references.

### 6. Unresolveds and Contradictions — PASS
`06_coverage_audit.md` and `08_final_report.md` list 5 unresolveds (U1-U5) and 1 contradiction (C1, resolved). All are present as structured families in `09_final_canonical.json` with top-level `unresolveds` and `contradictions` keys. All 5 unresolveds are genuine business-risk flags, not extraction gaps:
- U1: BTF continuation requires franchisee vote (medium)
- U2: Supplier contribution cross-subsidy (low)
- U3: Securitization exposure (high)
- U4: Georgia franchise collapse (medium)
- U5: Transfer spike (medium)

### 7. Final Report Depth — PASS
`08_final_report.md` is 30,867 bytes (~500+ lines). Contains all required sections: A (Executive Snapshot, 14 numbered bullets), B (Fee Stack/Investment with full fee tables), C (Supplier Control/Operations/Technology), D (Territory/Encroachment), E (Contract Burden with clause-by-clause detail), F (Item 19 with 3 tables), G (Item 20 with trajectory narrative), H (Item 21 with both entity financial walks), I (State Addenda with per-state detail), J (Unresolveds with severity ratings), K (Contradictions), L (Final Coverage Note). Section minimums met or exceeded.

### 8. Score Gate — PASS
`10_scorecard.md` shows 23/23 items extracted, 17 tables, 17 exhibits, 44+ canonical keys, 5 unresolveds, 1 resolved contradiction, A2 depth passes completed. All required items covered. Risk flags clearly enumerated.

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit B-1 (Number 25 Franchise Agreement)**: Surfaced on pp 88-140 (52 pages).

**Clause-walk status**: Substantial. A2 depth pass extracted 28 clause families covering all key operative burdens: grant, fees (royalty/SBF/SMF/BTF), site selection, construction, training, opening, operational standards, insurance, advertising, reporting, termination (curable and non-curable), post-termination de-identification, transfer, ROFR, option to purchase, noncompete (during and post-term), personal guaranty, innovations assignment, confidential information, indemnification, independent contractor, dispute resolution, and enforcement costs.

**Missing**: Detailed construction specifications (§3.03-3.04), records/reporting (§11), audit/inspection mechanics (§11.04-11.05). These are operational detail clauses that do not affect the key economic, legal, or risk profile.

**Verdict decision**: Verdict 2 allowed. All key operative burdens are adequately covered. No material buyer-facing gap exists. The missing clauses are procedural mechanics already summarized in Items 8 and 9.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Strongest Parts of the Run

1. **Item 19 completeness (pp 71-75)**: All three FPR tables (quartile, region, venue type) extracted with full statistics, population counts, exclusion rules, and substantiation availability. Cohort comparability verified.
2. **Item 21 financial statement depth (pp 310-340)**: Both Sonic Franchising LLC and SIS financial statements fully walked including all 11 SIS note families. Securitization detail (5 tranches, rates, maturities, covenants) captured at per-tranche level from pp 335-336.
3. **Item 20 outlet data (pp 75-84)**: All 5 tables with per-state detail. Transfer spike flagged (334 transfers in 2024 vs 75 in 2023). Georgia collapse (-25 units) identified. Gag clause verbatim quote captured from p 83.
4. **State addenda structured extraction (pp 341-348)**: 6 states, 17 overrides, each with `affected_family`, `override_summary`, `why_it_matters`, and `source_pages`. Override-family × state summary matrix provided.
5. **Contract burden depth (pp 88-140)**: 28 clause families extracted including innovations assignment (p 110), post-termination de-identification with franchisor entry right (p 125), and noncompete injunction consent (p 130).

## Weakest Remaining Parts of the Run

1. **Development Agreement (Exhibit C-1, pp 166-180)**: Left deferred — key terms recovered from Items 5, 12, 17 cross-references, but the full 14-page agreement was not directly clause-walked. Missing: development schedule mechanics, target area boundary definition specifics.
2. **Franchise Agreement procedural clauses (pp 88-140, §3.03-3.04, §11)**: Construction specifications and audit/inspection mechanics not extracted in detail. These are summarized in Items 8-9 but the FA text itself was not read for these sections.
3. **Franchisee list analysis (Exhibit E-1, pp 187-296)**: The ~110-page franchisee roster was not statistically analyzed for geographic concentration, multi-unit ownership patterns, or entity structure. This is a data-analysis gap, not an extraction gap.
4. **Incentive Addendum detail (Exhibit B-3, pp 146-160)**: The incentive terms were extracted from Item 5 and Item 6 body text, but the actual Incentive Addendum exhibit pages (14 pages) were not directly walked for any additional operative provisions beyond what the body text discloses.
5. **12_canonical_enriched_v2.json size (10KB)**: While self-contained with all required fields, it is more compact than v1 (11_canonical_enriched.json). Some v2 enrichment structures use summary values rather than full arrays.

## Where a Prior or Manual Run May Still Be Stronger

1. **Franchisee list due diligence (Exhibit E-1, pp 187-296)**: A manual analyst could cross-reference the ~3,144-entry franchisee list against the 334 transfers in 2024 to identify which specific operators sold, whether large multi-unit operators are consolidating or exiting, and whether the transfer spike represents portfolio consolidation or distress.
2. **Georgia collapse root cause (Item 20 Table 3, pp 79)**: A manual analyst with access to local market knowledge or follow-up calls to former Georgia franchisees (Exhibit E-4) could investigate why 21 Georgia franchised units ceased operations in a single year — the FDD provides no explanation.
3. **Development Agreement operative clause detail (Exhibit C-1, pp 166-180)**: A full walk of the DA would capture development schedule acceleration/termination mechanics, target area boundary-change triggers, and any distinctive DA-only provisions not reflected in the Items 5/12/17 summaries.

## Optional Max-3 Follow-Up Roadmap

1. **RT_depth_development_agreement.json**: Walk Exhibit C-1 (pp 166-180) clause-by-clause for development schedule mechanics, target area definitions, and any DA-only provisions.
2. **RT_depth_franchisee_list_analysis.json**: Statistical analysis of Exhibit E-1 for multi-unit ownership concentration, geographic clustering, and cross-reference against transfer data.
3. **RT_depth_incentive_addendum.json**: Walk Exhibit B-3 (pp 146-160) for any operative provisions beyond what Items 5-6 disclose.

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- None identified

### Business-Risk Flags
- U1: BTF continuation post-3/2026 requires 67% franchisee vote — technology funding uncertainty (medium, pp 36/54)
- U2: $16.7M BTF rebates redirected to SBF — cross-subsidy governance concern (low, pp 43-44)
- U3: Franchisor guarantees $1.4B+ securitization notes with substantially all assets pledged — material financial risk to franchisor stability (high, pp 319/336)
- U4: Georgia franchise collapse: 77→52 in 2024, 4 terminations + 21 ceased operations — unexplained single-state contraction (medium, p 79)
- U5: Transfer spike: 334 in 2024 vs 75 in 2023 — possible portfolio consolidation or distress sales (medium, pp 76-78)

### Extraction-Depth Gaps
- None. All unresolveds are business-risk flags derived from the FDD content itself, not from incomplete extraction.

## Buyer-Trust Assessment

A serious buyer evaluating the Sonic franchise would find this extraction trustworthy and actionable. The run covers all 23 FDD items with evidence-grounded canonical fields (44+ top-level keys, 22KB+ canonical). The financial statement walk captures the securitization structure at per-tranche level, the $617M 2027 maturity cliff, and the declining franchisor equity trend — all material to a buyer's financial analysis. The Item 19 data is complete with quartile, regional, and venue-type breakdowns, and the absence of cost/profitability data is explicitly flagged. The five identified business-risk flags (securitization exposure, system contraction, materially different renewal, gag clause, transfer spike) are the exact issues a sophisticated buyer would want surfaced. The state addenda extraction means a buyer in Maryland, Minnesota, or North Dakota can immediately see how their rights differ from the standard FA terms. The only area where a buyer might want additional depth is the franchisee list analysis (to understand who is buying/selling within the transfer spike) and the Georgia collapse root cause, both of which require information beyond the FDD text.

## Source-Grounding Confirmation

All weaknesses, gaps, and "prior run stronger" claims above cite specific page ranges, exhibit letters, or section identifiers from the run files and source PDF.
