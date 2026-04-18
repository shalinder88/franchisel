# Publish Gate — Dunkin' Donuts Franchising LLC (637953-2025)

## Verdict: **2 — Publish with Caveats**

The extraction is substantially complete for all 23 FDD items with comprehensive coverage of the fee stack, investment tables, Item 19 FPR data, Item 20 outlet tables, Item 21 financial statements (including full note walk), contract terms, and state addenda. Minor gaps remain in exhibit-level clause walks for development agreements and some secondary exhibits, but these do not materially weaken buyer confidence.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
All four FPR tables extracted: overall quartiles (7,190 restaurants), by region/division (9 segments), by site type/venue (6 categories), and by drive-thru status. Population counts, medians, ranges, and percentage-above-average all captured. Exclusion rules documented (309 new, 956 closures, 18 multi-brand, 96 closed, 34 company-owned, 1,269 combos). Substantiation availability confirmed. No-FPR cost caveat properly noted. Item 19 provides AUV only — the absence of cost/EBITDA data is a limitation of the FDD itself, not the extraction.

### 2. Item 20 Completeness — PASS
All 5 standard tables present for Dunkin' standalone (systemwide summary, transfers, franchised status by state, company-owned status, projected openings) and all 5 for Combo restaurants. Total rows balance. Footer totals extracted: 137 transfers (2024), 1 termination, 28 non-renewals, 67 ceased operations. Gag clause flag set to true with verbatim quote. Franchisee association (DDIFO) identified. Projected openings: 278 new franchised.

### 3. Item 21 Sufficiency — PASS
KPMG identified as auditor. Unqualified opinion confirmed. No going-concern language. Balance sheet, income statement, cash flows, and member's equity all extracted for three fiscal years (2022-2024). Financial statement Notes 1-11 walked in A2 depth pass: revenue recognition (ASC 606), intangible assets ($8.3B including $6.39B trademarks), securitization notes ($5.0B across 7 tranches with detailed interest rates and maturities), lease accounting (operating + finance, ROU assets, sublease income), income taxes (disregarded entities), guarantees ($136.7M supply chain), related party transactions ($113.5M management fees, $665M affiliate note), and subsequent events (none).

### 4. State Addenda Sufficiency — PASS (with caveat)
Five states with FDD addenda extracted: California (Fast Food Act), Hawaii, Maryland (release limitations, forum override, insolvency limitation), Minnesota (extended cure/notice periods, no out-of-state litigation, no liquidated damages), North Dakota (noncompete unenforceable, forum override). Maryland agreement riders reviewed for FA, Combo FA, SDA, and Combo SDA. Additionally, the Franchise Agreement itself (Section 16.I) embeds a no-waiver/no-disclaimer provision applicable to 14 states. State addenda overrides are structured in `RT_depth_state_addenda_promotion.json` and partially promoted to canonical.

**Caveat**: The Exhibit E state addenda section may contain additional state riders beyond the FDD addenda (e.g., IL, IN, NY, RI, SD, VA, WA, WI riders). However, the most material overrides (forum, noncompete, release, termination notice) are captured for the key states, and the FA's built-in 14-state provision covers anti-waiver broadly.

### 5. Key Exhibit Sufficiency — PASS (with caveat)
All 13 Item 22 contracts accounted for in `04_exhibits.json`. Financial statements (Exhibit B) deep-read with full note walk. Franchise Agreement (Exhibit C-1) clause-walked in A2 with 20 clause families extracted. State addenda (Exhibit E) walked for 5 states plus riders. General Release (Exhibit I) identified but not directly walked — scope is implied from state addenda overrides (MD, MN, ND releases limited).

**Caveat**: Store Development Agreement (Exhibit D-1, 19 pages) not directly clause-walked. Key SDA terms are covered via Item 17 chart cross-references and the FA clause walk. Combo FA (Exhibit C-2), NT Rider (C-3), and incentive addenda (C-4, D-3) were labeled only.

### 6. Unresolveds and Contradictions — PASS
Six unresolveds identified and preserved in canonical:
- UR-001: No cost/profitability data in Item 19 (high severity — FDD limitation)
- UR-002: FA clause walk completed in A2 (resolved)
- UR-003: State addenda largely completed in A2 (reduced severity)
- UR-004: Financial notes fully walked in A2 (resolved)
- UR-005: Cup with D' trademark unregistered (low severity)
- UR-006: Securitization debt complexity (medium severity — deepened in A2)

One contradiction identified: TOC pagination mismatch (resolved — cosmetic only).

`unresolveds` and `contradictions` arrays present as top-level keys in `09_final_canonical.json`.

### 7. Final Report Depth — PASS
`08_final_report.md` is 28KB/~550 lines with substantive narrative in all required sections: Executive Snapshot (14 bullets), Fee Stack/Investment (detailed inline tables and prose), Supplier/Operations/Training/Tech, Territory, Contract Burden/Legal Mechanics, Item 19 (four-table walkthrough with critical caveats), Item 20 (trajectory, transfers, projections, gag clause), Item 21 (financial statement walk with 5 key observations), State Addenda (5 states with key overrides), Unresolveds (6 with severity), Contradictions (1), Final Coverage Note.

### 8. Score Gate — PASS
Overall grade: A- (upgraded from B+ after A2 depth passes). All 23 items covered at A grade. Item 21 upgraded to A- after full note walk. Exhibits upgraded to B+. State addenda upgraded to A-.

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit C-1 (Dunkin' Franchise Agreement)**: Surfaced at pages 164-195 (32 pages). Clause-walked in A2 with 20 operative clause families extracted to `RT_depth_contract_burdens.json`.

Key operative burdens covered: grant/term (20 years), required opening (15 months), remodel/refurbishment (10/5/15-year cycles), royalty, advertising, proprietary marks, confidential information, innovations (all become franchisor property), repairs/maintenance, insurance ($2M CGL, $1M EPL), indemnification (unlimited, survives termination), transfers, termination triggers and cure periods, additional remedies (franchisor entry rights), enforcement expenses, injunctive relief, no-related-party-liability, and 14-state no-waiver provision.

**Verdict for FA clause walk: Verdict 2 allowed.** Key operative burdens are adequately covered. The missing depth is in the development/construction sections (FA Sections 3-4) and detailed fee calculation mechanics (FA Section 5), which are adequately covered in Items 7 and 11 of the FDD body.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Strongest Parts of the Run

1. **Item 19**: Four complete FPR tables with full population data (7,190 restaurants), quartile analysis, regional breakdown (9 segments), site type analysis (6 venue categories), and drive-thru premium analysis (39% AUV premium). Source: pp.86-91.
2. **Item 6 Fee Stack**: 22+ fee rows with full transfer fee tiers, 5 incentive CFF/CAF schedules (Brewed for Growth, SDM, Go West, Early Opening, VetFran), loyalty program economics, and advertising fund spending breakdown. Source: pp.40-48.
3. **Item 20**: Both Dunkin' standalone (8,465 end-of-2024) and Combo (1,269) tables fully extracted at state level for 3 years, with transfers (137 in 2024), gag clause identified, and 278 projected openings. Source: pp.91-106.
4. **Item 21 Financial Notes**: Full walk of Notes 1-11 including securitization detail (7 tranches, $5.0B, rates 2.05%-4.35%), $6.39B indefinite-lived trademarks, $136.7M supply chain guarantees, $113.5M management fees, net lease income of $47.8M, and no subsequent events. Source: pp.114-134.
5. **Item 2 Leadership**: 28 named officers/directors with roles, locations, and tenure dates — complete roster. Source: pp.21-24.
6. **State Addenda**: 5 states extracted with operative overrides structured per-family. Key finding: ND noncompete unenforceable, MN extended cure periods, MD release limitations. Source: pp.320-342.

## Weakest Remaining Parts of the Run

1. **Store Development Agreement (Exhibit D-1, pp.256-274)**: 19-page agreement not directly clause-walked. Development schedule obligations, territorial rights during SDA term, and SDA-specific default triggers covered only via Item 17 cross-references. Impact: moderate — SDA terms are parallel to FA but with development-specific obligations.
2. **Combo Franchise Agreement (Exhibit C-2, pp.196-228)**: 33-page agreement not clause-walked. Likely parallel to Exhibit C-1 with Baskin-Robbins-specific terms. Impact: low for Dunkin'-only prospective franchisees; moderate for combo prospects.
3. **General Release (Exhibit I, pp.552-556)**: Not directly walked. Release scope inferred from state addenda overrides (MD, MN, ND limit release scope). A prospective franchisee approaching renewal or transfer should review this document independently.
4. **Canonical enrichment depth**: `09_final_canonical.json` is 25KB, which is adequate but below the 30KB target for a 574-page FDD. Some financial statement note detail and contract clause depth could be more aggressively promoted.
5. **Item 19 cost/profitability gap**: No cost data in FDD — this is a document limitation, not an extraction gap, but it means a buyer cannot assess profitability from this run alone.

## Where a Prior or Manual Run May Still Be Stronger

1. **SDA clause walk**: A manual review would directly walk Exhibit D-1's development schedule mechanics, SDA-specific defaults, territorial protection triggers, and conditional extension terms — particularly important for multi-unit operators.
2. **General Release scope**: A manual reviewer would directly parse Exhibit I's release language to identify exact claims being waived, carve-outs, and interaction with state addenda exceptions.
3. **Incentive program mechanics**: The FDD contains extensive incentive program detail (Brewed for Growth, Pacific Northwest, SDM, Go West, Multi-Brand, VetFran) across Items 5-6 and Exhibits C-4/D-3. A manual reviewer could trace the complete economic impact of each program through IFF rebate, CFF reduction, CAF reduction, and promotional reimbursement for a specific market scenario.
4. **NDCP cooperative economics**: A manual reviewer with access to NDCP membership terms could assess the cooperative's pricing structure, patronage dividends, and effective cost impact — none of which is disclosed in the FDD.

## Optional Max-3 Follow-Up Roadmap

1. **RT_depth_sda_clause_walk.json** — Walk Exhibit D-1 (pp.256-274) for development schedule obligations, SDA-specific defaults, territorial protection mechanics, and conditional extension terms.
2. **RT_depth_general_release.json** — Walk Exhibit I (pp.552-556) for release scope, carve-outs, and interaction with state addenda exceptions.
3. **RT_depth_thin_items.json** — Thicken Items 9-16 operative burden summaries with structured obligations/restrictions/rights arrays from the FA clause walk.

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- CD-001: TOC pagination mismatch (resolved — cosmetic)

### Business-Risk Flags
- UR-001: No cost/profitability data in Item 19 — buyers cannot determine EBITDA or cash-on-cash returns from FDD alone
- UR-005: Cup with D' trademark at application status only — reduced IP protection
- UR-006: $5.0B securitization debt with franchise revenues as collateral — complex structure creates subordination risk

### Extraction-Depth Gaps
- SDA (Exhibit D-1) not directly clause-walked
- General Release (Exhibit I) not directly walked
- Combo FA (Exhibit C-2) not clause-walked

## Buyer-Trust Assessment

A serious buyer would find this run substantially trustworthy as a primary reference document. The extraction covers all 23 FDD items at high depth, with particularly strong coverage of the fee stack (including 5 incentive programs), Item 19 AUV data (four representations with full population detail), Item 20 outlet trajectory (accelerating net growth with declining closures), and Item 21 financials (including full note walk revealing the securitization structure). The contract terms are well-documented via both the Item 17 chart and the A2 FA clause walk. State addenda for the most protective states (MD, MN, ND) are extracted with specific override detail. The primary gaps — SDA clause walk and General Release — are relevant mainly to multi-unit operators approaching renewal or transfer, and do not undermine the core diligence value. A buyer should independently review Exhibit I (General Release) before signing any renewal or transfer, and multi-unit prospects should review Exhibit D-1 (SDA) directly.

## Source-Grounding Rule

All weakness, gap, and "prior run stronger" claims above cite specific exhibit letters, page ranges, and section identifiers from the run files and source PDF.
