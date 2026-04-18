# Publish Gate — 639547-2025-GNC

## Verdict: 2 — Publish with Caveats

**Rationale**: This extraction achieves comprehensive coverage of all 23 FDD items, all 5 standard Item 20 tables, full Item 19 FPR data, Item 21 auditor opinion and financial statement headlines plus 13 note families, 30 structured state addenda overrides across 12 states, 24 contract burden families, and 12 promoted facts from A2 depth passes. Minor gaps remain in subsidiary agreement clause walks (PSA, APSA, Sublease, POS License) and some franchise agreement sections not directly walked (mitigated by Item 17 chart and A2 contract burden depth pass). These gaps do not leave any material buyer-facing hole.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **PASS**: Single FPR table fully extracted with all caveats.
- Average gross sales $475,925 (675 stores), median $443,685.
- No cost/expense data disclosed — noted as caveat.
- No FPR substantiation issue — statement captured.
- No cohort-comparability concern (same 6% royalty for cohort and new franchisees).

### 2. Item 20 Completeness
- **PASS**: All 5 standard tables present (systemwide, transfers, franchised status, company-owned status, projected openings).
- Footer totals extracted for all tables.
- Total rows balance correctly.
- Franchisee list exhibit count captured (92 former, 23 transfers).
- Gag clause flag set: **false** (p. 114).

### 3. Item 21 Sufficiency
- **PASS**: PricewaterhouseCoopers identified. Clean unqualified opinion (June 3, 2025). No going concern.
- Income statement, balance sheet, cash flow extracted with multi-year comparatives.
- 13 financial statement note families walked in A2 depth pass including revenue recognition, depreciation, impairment, leases, debt, related party, subsequent events.
- Going-concern status: No going concern language. However, negative working capital, declining revenue, net losses, and significant debt maturity ($205M in Oct 2025) represent material financial risk.
- Item 21 method: normal text extraction (no image fallback needed).

### 4. State Addenda Sufficiency
- **PASS**: 12 states identified and structured into `state_addenda_overrides` in canonical via A2 depth pass 4.
- 30 structured overrides across 10 override families.
- Summary table of override families × states present in RT_depth_state_addenda_promotion.json.
- Key override families: forum selection (5 states), general release (10 states), noncompete (2 states), termination (5 states), liquidated damages (2 states), no-poach (2 states).

### 5. Key Exhibit Sufficiency
- **ADEQUATE**: All exhibits listed in Item 22 accounted for in 04_exhibits.json.
- Franchise Agreement: 24 burden families extracted via A2 depth pass + Item 17 chart cross-references. Not fully clause-walked page-by-page but operative substance materially covered.
- Financial exhibits (N-1, N-2): N-1 audited statements extracted with 13 note families. N-2 unaudited Q1 2025 identified but not fully extracted (minor gap).

### 6. Unresolveds and Contradictions
- **PASS**: Both `unresolveds` (6 entries) and `contradictions` (1 entry) families present as top-level keys in canonical.
- Unresolveds include 2 high-severity business risk flags (declining revenue/system contraction) and 4 medium/low extraction depth gaps.
- Contradictions: 1 entry (Item 19 vs Item 20 store count — explained as methodological difference).

### 7. Final Report Depth
- **PASS**: 08_final_report.md is a full standalone diligence narrative.
- All required sections present: executive snapshot (14 bullets), fees/investment, supplier/operations, territory, contract burden/legal, Item 19, Item 20, Item 21, state addenda, unresolveds, contradictions, final coverage note.
- Report length is substantive with inline tables and prose analysis.

### 8. Score Gate
- **PASS**: Overall grade A- (upgraded from B+ after A2 depth passes).
- All required items covered. Canonical populated with evidence grounding.

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced exhibit**: Franchise Agreement (Exhibit E, pp. 157–263, 107 pages)
**Page range**: 157–263
**Clause-walk status**: Partial — key operative burdens extracted via Item 17 chart + A2 contract burden depth pass (24 families)

**Verdict decision**: Verdict 2 allowed.
- Key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty, venue, liquidated damages) are adequately covered via Item 17 chart cross-references and A2 contract burden depth pass.
- No material buyer-facing gap identified: guaranty scope (all owners + spouses, unlimited), liquidated damages formula, cross-default trigger, and death/disability provisions are all captured.
- The missing full clause walk does not leave material gaps because the Item 17 chart is exceptionally detailed (rows a through x with section references and summaries) and the A2 depth pass extracted 24 distinct burden families.

**Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.**

---

## Strongest Parts of the Run

1. **Item 20 Tables 1–5 with full state-level detail** (pp. 103–114): All 5 standard tables extracted with per-state rows, footer totals, relocation notes, and transfer activity. The data clearly shows accelerating system contraction.

2. **Item 6 fee stack — 27 fee categories** (pp. 35–41): Every fee category from the multi-page fee table extracted with amounts, timing, and explanatory notes, including the non-obvious Non-compliance Management Fee (25% of gross), Operating Management Fee ($2,000/week), and tiered GNFS pricing.

3. **Item 21 financial statements + 13 note families** (pp. 449–489): PwC audit opinion, full balance sheet and income statement with multi-year comparatives, plus 13 note families including critical debt maturity detail ($205M due Oct 2025), vendor rebate retention ($43.5M), lease structure ($153.5M liabilities), and subsequent events (CNY 1.5B revolving facility).

4. **State addenda — 30 structured overrides across 12 states** (pp. 135–156): Every state addendum read and structured into override families with per-state detail and summary table. Minnesota's extended notice periods (90 days termination + 180 days non-renewal), California's interest rate cap and liquidated damages limitation, and Washington's fee impound and noncompete earnings threshold all captured.

5. **Item 17 tables (FA + ADA)** (pp. 84–100): Both the Franchise Agreement and Development Agreement Item 17 tables fully extracted with rows a through x, providing comprehensive cross-references for all contract burden families.

6. **Item 19 with full caveats** (pp. 101–102): Single FPR table extracted with population, percentage at/above average, exclusion criteria, data source limitations, and substantiation availability.

## Weakest Remaining Parts of the Run

1. **Franchise Agreement page-by-page clause walk not completed** (pp. 157–263): While 24 burden families were extracted and Item 17 provides comprehensive cross-references, a page-by-page walk of the 107-page FA would potentially surface unusual or distinctive clauses not covered by the Item 17 chart. The A2 contract burden depth pass mitigates this significantly.

2. **Subsidiary agreements not directly clause-walked** (PSA pp. 340–347, APSA pp. 348–361, Sublease pp. 362–373, POS License pp. 374–380, General Release pp. 381–383): These are labeled with key terms referenced in body items but not independently analyzed. The PSA security interest and credit terms are extracted from Item 10; Sublease terms from Items 6/8; POS License from Items 6/8/11.

3. **Unaudited Q1 2025 financials** (Exhibit N-2, pp. 490–513): Identified but not fully extracted. These interim statements could provide more current financial data than the audited FY 2024 statements.

4. **Item 7 ADA investment table notes** (pp. 49–55): The ADA investment notes largely mirror the single-unit notes. Fully extracted but some ADA-specific nuances may be thin.

5. **Canonical slightly below 40 top-level key target**: 38 keys at A1 completion. A2 enrichment added structured depth but did not increase top-level key count in 09_final_canonical.json.

## Where a Prior or Manual Run May Still Be Stronger

1. **Franchise Agreement specific clause language**: A manual review of the full 107-page FA (Exhibit E) would capture exact clause language, section numbering, and potentially unusual or distinctive provisions (e.g., specific cure language, acceleration clauses, specific conditions for remodeling requirements) that the Item 17 chart + A2 depth pass may present in summarized rather than verbatim form.

2. **Product Sales Agreement revolving credit mechanics**: The PSA (Exhibit G, pp. 340–347) contains the detailed revolving credit terms, UCC security interest language, and default acceleration provisions. Item 10 summarizes these, but a manual review of the agreement itself could surface nuances in the credit hold mechanism and acceleration triggers.

3. **Sublease operative rent formulas**: The Sublease (Exhibit I, pp. 362–373) would contain the specific rent calculation methodology, CAM allocation, and termination-for-default provisions that are only summarized in the body items.

4. **Q1 2025 unaudited financial data**: The most recent quarter's financial data could show whether the revenue decline and net losses continued into 2025 — particularly important given the $205M debt maturity in October 2025.

## Optional Max-3 Follow-Up Roadmap

1. **RT_depth_fa_clause_walk.json** — Page-by-page walk of Franchise Agreement (Exhibit E, pp. 157–263) focusing on distinctive clauses not covered by Item 17 chart, particularly remodeling trigger language, technology upgrade obligations, and lease assignment provisions.

2. **RT_depth_q1_2025_financials.json** — Extract key headlines from unaudited Q1 2025 financial statements (Exhibit N-2, pp. 490–513) to assess whether financial trajectory has stabilized or worsened.

3. **RT_depth_subsidiary_agreements.json** — Walk PSA (security interest, acceleration, credit hold), Sublease (rent formula, termination), and General Release (scope of release, exclusions) for operative detail.

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- C1: Item 19 uses 675 stores vs. Item 20 shows 703 at YE 2024 — explained as methodological difference (stores not operating full year excluded from FPR).

### Business-Risk Flags
- U5: Revenue declining 20% over 2 years with net losses of $141M (2024), $32M (2023) — franchisor financial stability risk (pp. 455–456)
- U6: System shrinking rapidly — 165 net closures in 2024, only 5 projected new outlets (p. 103, 114)

### Extraction-Depth Gaps
- U1: Item 21 financial statement notes — **RESOLVED in A2** (13 note families walked)
- U2: State addenda overrides — **RESOLVED in A2** (30 overrides across 12 states)
- U3: Franchise Agreement clause walk — **PARTIALLY RESOLVED** in A2 (24 burden families; full page-by-page walk not completed)
- U4: Predecessor litigation status unknown for 4 cases (pp. 19–20) — low severity; predecessor bankruptcy plan handles these claims

## Buyer-Trust Assessment

A serious buyer reviewing this extraction would have sufficient information to make an informed diligence decision about a GNC franchise investment. The extraction comprehensively covers the fee structure, investment requirements, system trajectory (clearly declining), financial health (concerning), territorial limitations (significant channel competition), contractual obligations (onerous), and state-specific overrides. The two highest-risk findings — the franchisor's deteriorating financial position and the system's accelerating contraction — are prominently surfaced with supporting data. The absence of a page-by-page franchise agreement walk is a genuine depth gap but does not create a material blind spot, as the Item 17 chart and A2 contract burden analysis collectively cover all key operative families. A buyer would want to independently review the actual franchise agreement language before signing, as they should for any franchise investment.

## Source-Grounding Rule
All weaknesses, gaps, and "prior run stronger" claims above cite exact source pages or section identifiers.
