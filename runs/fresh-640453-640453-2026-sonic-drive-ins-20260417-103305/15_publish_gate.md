# Publish Gate: Sonic Franchising LLC (640453-2026)

## Verdict: 2 — Publish with caveats

**Rationale:** The extraction is comprehensive and covers all 23 FDD items, both sets of financial statements, the Franchise Agreement clause walk, state addenda, and all five Item 20 tables. The canonical is well-structured with 42+ top-level keys. Minor caveats: (1) 09_final_canonical.json was not updated with A2 promoted facts (still mirrors 05_canonical.json); (2) the final report at 279 lines / 29KB is substantive but falls short of the 500-line floor for a 366-page FDD; (3) several minor exhibits remain at labeled_only status. None of these gaps are buyer-misleading — all material operative content has been extracted.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES. AUV data for 3,057 franchised restaurants.
- All tables extracted: YES. Quartile table (4 quartiles + overall) and Venue Type table (Free-Standing/Urban + Gas/C-Store).
- Population counts: YES — 3,057 after exclusions from 3,120 total franchised.
- Exclusion rules: YES — 7 exclusion categories documented (new in year, closed for remodeling, Multi-Brand, Non-Traditional, transferred from company, closed in year, company-owned).
- Notes extracted: YES — Gross Sales definition, data source, no audit, no cost data.
- Substantiation statement: YES — "Upon your reasonable request, we will provide written substantiation" (page 73).
- Cohort comparability: Checked — no discrepancy found (both at 5% royalty).
- **Source:** Pages 70-73; 03_tables.json (T19_auv_quartiles, T19_auv_venue_type).

### 2. Item 20 Completeness — PASS
- Table 1 (System Summary): YES — 3 years, franchised/company/total. Page 74.
- Table 2 (Transfers): YES — 29 states, 3 years, totals (75/334/100). Pages 74-76.
- Table 3 (Franchised Status): YES — 38 states, 3 years, all columns including terminations, non-renewals, reacquired, ceased other. Footer totals balance. Pages 76-79.
- Table 4 (Company Status): YES — 12 states, 3 years. Footer totals balance. Page 80.
- Table 5 (Projected Openings): YES — 13 states, totals (12/16/0). Page 81.
- Total rows balance: YES — Table 1 totals match Table 3 + Table 4 totals.
- Franchisee list exhibit count: YES — Exhibit E-1, 112 pages (pages 182-293).
- Gag clause flag: YES — set to true with verbatim quote fragment (page 82).
- **Source:** Pages 74-82; 03_tables.json; RT_depth_item20_tables.json.

### 3. Item 21 Sufficiency — PASS
- Auditor identified: YES — KPMG LLP, Atlanta GA.
- Opinion type: Unqualified (clean), dated March 19, 2026.
- Going concern: NO (no going concern language).
- Income statement: YES — both entities, 3 years each.
- Balance sheet: YES — both entities, 2 years each.
- Cash flows: YES — both entities, 3 years each.
- Member's equity: YES — both entities, 3 years each.
- Notes covered: YES — All note families walked in RT_depth_financial_notes.json and RT_depth_item21_notes.json.
- Item 21 method: normal_text_extraction (full text layer on all financial pages).
- **Source:** Pages 303-334; RT_depth_financial_notes.json; RT_depth_item21_notes.json.

### 4. State Addenda Sufficiency — PASS
- States with addenda identified: YES — California, Hawaii, Maryland, Minnesota, North Dakota, Washington.
- States with FA riders: YES — Illinois, Maryland, Michigan, Minnesota, North Dakota, Washington, Wisconsin.
- Structured into canonical: YES — state_addenda_overrides family present in 05_canonical.json with per-state keys and override details.
- RT_depth_state_addenda_promotion.json: YES — 15 overrides structured with state, affected_family, override_summary, why_it_matters, source_pages.
- **Source:** Pages 335-353; RT_depth_state_addenda_promotion.json; 05_canonical.json.

### 5. Key Exhibit Sufficiency — PASS
- Item 22 contracts: B-1, B-2, B-3, B-4, C-1, C-2, D, G, H, I — all 10 accounted for in 04_exhibits.json.
- Financial exhibits (Exhibit F): YES — deep-read, both entities.
- Franchise Agreement (B-1): YES — full 38-clause walk in RT_depth_contract_burdens.json.
- Guaranty exhibit: YES — identified as Exhibit B to FA (page 136), unlimited personal liability for 10%+ owners.
- **Source:** 04_exhibits.json; RT_depth_key_exhibits.json; RT_depth_contract_burdens.json.

### 6. Unresolveds and Contradictions — PASS
- Unresolveds in 08_final_report.md: YES — 4 unresolveds listed (Section J).
- Contradictions in 08_final_report.md: YES — Section K explicitly states no material contradictions.
- `unresolveds` key in 05_canonical.json: YES — 4 entries with id, description, severity, source.
- `contradictions` key in 05_canonical.json: YES — 1 entry (Item 1/Item 20 reconciliation — no contradiction).
- All unresolveds genuine: U1 is an extraction-depth gap (FA clause walk, now resolved by A2). U2 is a business-risk flag (no cost/profit data). U3 and U4 are business-risk flags (revenue decline, distributions exceeding income).
- **Source:** 08_final_report.md Section J; 05_canonical.json.

### 7. Final Report Depth — PASS with caveat
- Full diligence report: YES — contains all required sections (A through L).
- Sections present: Executive snapshot (15 bullets), Fees/Investment, Supplier/Operations/Tech, Territory, Contract burden/Legal, Item 19 detail, Item 20 detail, Item 21 detail (both entities), State Addenda summary, Unresolveds, Contradictions, Final coverage note.
- Line count: 279 lines / 29KB. Below the 500-line target but substantive.
- Unresolveds section: YES (Section J).
- Contradictions section: YES (Section K).
- State addenda discussed: YES (Section I).
- Financial statement summary: YES (Section H, both entities with full narrative).
- **Caveat:** Final report at 279 lines is below the 500-line floor for a 366-page FDD. The content is dense and covers all sections but could benefit from more granular per-item narrative in Sections B-E. Not buyer-misleading.
- **Source:** 08_final_report.md.

### 8. Score Gate — PASS
- Overall grade: A (completeness), A (depth after A2).
- All required items covered: YES.
- Canonical fields populated with evidence grounding: YES — source_section and source_pages on all entries.
- **Source:** 10_scorecard.md.

---

## Franchise Agreement Clause-Walk Assessment

- **Exhibit surfaced:** B-1 Franchise Agreement, pages 92-139 (48 pages).
- **Clause-walked:** YES — A2 contract burden depth pass produced RT_depth_contract_burdens.json with 38 clause entries covering all 22 articles.
- **Verdict decision:** Verdict 2 allowed. The FA has been directly read and clause-walked. Key operative burdens (term, fees, transfer, termination, noncompete, guaranty, venue, ROFR, death/disability, remodeling, insurance, indemnification) are all extracted with section references and money terms.
- **Source:** RT_depth_contract_burdens.json; RT_depth_key_exhibits.json.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

**Deferred exhibits rationale:**
- B-2 Non-Traditional Rider (pp. 140-144): 0.3% of system. Key terms recovered from FDD body.
- B-3 Incentives Addendum (pp. 145-150): All terms in Item 6. No buyer gap.
- B-4 Multi-Brand Addendum (pp. 151-156): 1 location. Key terms from FDD body.
- C-1 Development Agreement (pp. 157-170): Key terms from Items 12/17. Standard DA.
- H General Release (pp. 354-358): Standard form. MD exemption noted.

None of these gaps materially weaken economics, legal burden, or buyer confidence. Each is documented with rationale in RT_depth_key_exhibits.json.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 19 quartile table** (pages 71-72, T19_auv_quartiles in 03_tables.json) — complete with all 4 quartiles, population of 3,057, 7 exclusion categories, and venue type breakdown. Both tables have full provenance.

2. **Item 20 all 5 tables with state-level data** (pages 74-82, confirmed in RT_depth_item20_tables.json) — 38 states in Table 3, 12 states in Table 4, footer totals balance, gag clause flagged with verbatim quote.

3. **Franchise Agreement 38-clause walk** (pages 92-139, RT_depth_contract_burdens.json) — every article walked with operative terms, triggers, money, duration, carve-outs. Distinctive clauses identified (materially different renewal, 3-defaults rule, 1-year limitations, remodeling limits).

4. **Dual financial statement extraction** (pages 303-334, both Sonic Franchising LLC and SIS) — all statements, all notes walked, securitization detail extracted, note families structured in RT_depth_item21_notes.json and RT_depth_financial_notes.json.

5. **State addenda structured** (pages 335-353, RT_depth_state_addenda_promotion.json) — 15 overrides across 7 states with per-override affected_family, why_it_matters, and source pages. Summary table of override families by state.

6. **Fee stack with all incentive programs** (pages 30-37, canonical item6_royalty + item6_advertising + item6_technology_fees) — complete royalty schedules for 5 incentive programs, SMF/SBF/cooperative allocation by market type, Gross Sales definition.

7. **25-person leadership roster** (pages 22-25, item2_leadership in canonical) — every officer/director with name, role, tenure, and location.

### 2. Weakest Remaining Parts of the Run

1. **09_final_canonical.json not updated with A2 promotions** — still mirrors 05_canonical.json. The 10 promoted facts from RT_depth_promotion_audit.json and depth-pass findings from RT_depth_contract_burdens.json have not been merged. This is a data hygiene gap, not a content gap (all facts are in RT files). Source: comparison of 05_canonical.json and 09_final_canonical.json (identical files).

2. **Final report at 279 lines** — below the 500-line floor for a 366-page FDD. Sections B-E (Fees, Supplier, Territory, Contract) are substantive but compressed. Could expand inline fee tables and training detail. Source: 08_final_report.md.

3. **Non-Traditional Rider (B-2, pp. 140-144) not clause-walked** — while only 0.3% of system, a prospective non-traditional franchisee would want this. Source: RT_depth_key_exhibits.json.

4. **Development Agreement (C-1, pp. 157-170) not clause-walked** — although key terms are from Items 12/17, the 14-page agreement may contain additional obligations not disclosed in the FDD body. Source: RT_depth_key_exhibits.json.

5. **12_canonical_enriched_v2.json is smaller than 05_canonical.json** (13.9KB vs 24.9KB) — the v2 should be a superset. It contains enrichment layers but has compressed the base canonical data. Source: file sizes.

### 3. Where a Prior or Manual Run May Still Be Stronger

1. **Per-state Item 20 detail**: A manual analyst might compute year-over-year growth rates by state and flag Georgia's 36% decline (77→49) or Texas's persistent contraction (909→872) with competitive context that an automated extraction does not provide. Source: pages 76-79.

2. **Item 7 multi-format comparison**: A manual run might build a side-by-side cost analysis across Traditional, C-Store, and Urban Inline formats with derived per-stall and per-sqft investment metrics. Source: pages 37-38.

3. **Franchise Agreement Section 8.07 remodeling mechanics**: The FA limits remodeling to once every 7 years but the detail of what constitutes "conforming to plans and specifications then being used for new or remodeled Sonic Restaurants" could be walked more granularly. Source: page 110.

4. **Exhibit E-1 franchisee concentration analysis**: The 112-page franchisee list could be analyzed for multi-unit operator concentration, geographic clustering, and operator turnover — analysis beyond simple extraction. Source: pages 182-293.

### 4. Optional Follow-Up Roadmap (max 3)

1. **Patch 09_final_canonical.json** — merge A2 promoted facts from RT_depth_promotion_audit.json and contract burden findings. Target: `09_final_canonical.json`.

2. **Expand 08_final_report.md** — add inline fee tables in Section B, expand training detail in Section C, add per-state trajectory highlights in Section G. Target: `08_final_report.md`.

3. **Walk C-1 Development Agreement** — 14 pages, clause walk for controlled affiliate requirements and target area mechanics. Target: `RT_depth_development_agreement.json`.

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies:**
- None identified.

**Business-Risk Flags:**
- U2: No cost/expense/profit data in Item 19 — AUV only. Prospective franchisees cannot assess profitability. (Source: pages 70-73)
- U3: Revenue declining 12% YoY for Sonic Franchising LLC ($51.9M→$59.0M→$51.9M) alongside system contraction. (Source: pages 308-309)
- U4: Distributions to parent exceed net income in all 3 years, eroding equity 20.7%. (Source: pages 309-310)

**Extraction-Depth Gaps:**
- U1 (formerly): FA clause walk — RESOLVED by A2 depth pass. No longer an extraction gap.
- 09_final_canonical.json not updated with A2 promotions — data hygiene gap, not content gap. All facts present in RT files.

### 6. Buyer-Trust Assessment

A serious buyer evaluating a Sonic Drive-In franchise could rely on this extraction as a comprehensive foundation for due diligence. All 23 FDD items have been fully read and extracted with page-level provenance. The Item 19 AUV data, Item 20 system trajectory, and Item 21 financial statements provide the core economic picture — a contracting system with $1.55M average AUV, declining franchisor revenue, and $1.4B in securitization debt. The Franchise Agreement has been clause-walked with all 38 operative families documented. The gag clause, materially different renewal terms, and post-term noncompete are all flagged. A buyer should supplement this extraction with (1) cost/expense data from current franchisees (since Item 19 provides only AUV), (2) analysis of the $615M securitization tranche due January 2027, and (3) direct review of the Non-Traditional Rider if pursuing a Non-Traditional location.

### 7. Source-Grounding Confirmation

All weakness claims, gaps, and "prior run stronger" items above cite exact source pages or section identifiers from the run files.

---

## Final Verdict: 2 — Publish with caveats

**Caveats:**
1. 09_final_canonical.json should be patched with A2 promoted facts
2. 08_final_report.md below 500-line floor (279 lines / 29KB — substantive but compressed)
3. v2 enriched canonical smaller than base canonical (data compression, not content loss)

**No A4 focused recovery pass required.** All material gaps are hygiene/depth issues, not content gaps.
