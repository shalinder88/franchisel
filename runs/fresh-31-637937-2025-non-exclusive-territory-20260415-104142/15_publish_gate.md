# Publish Gate — Pillar To Post, Inc. (637937-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

This extraction achieves comprehensive coverage of all 23 FDD items, all material tables, all exhibits including full franchise agreement clause walk, state addenda structured into canonical, and PwC-audited financial statements deep-walked through all 16 note families. The run produces a full-length diligence report with all required sections, a complete canonical with unresolveds/contradictions/state addenda override families, and comprehensive depth passes. Minor caveats exist around Item 21 being FS Brands consolidated (not Pillar To Post standalone) and Item 19 providing sales only without cost data — both are structural limitations of the FDD itself, not extraction gaps.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with 6 tables covering sales and job size by inspector group, sales thresholds, selling prices, and seasonality
- Population counts: 293 NE units (8 excluded) for 2024, 294 (12 excluded) for 2023
- Exclusion rules documented: started during year, terminated/ceased, failed to report
- Ranges disclosed for all groups ($33,875–$3,515,315)
- No cost/EBITDA data — this is the FDD's limitation, not an extraction gap
- Substantiation availability statement captured: "Written substantiation for the financial performance representation will be made available to the prospective franchisee upon reasonable request" (p. 60)
- Item 19 cohort comparability: no discrepancy found — same fee structure as current new franchisees

### 2. Item 20 Completeness — PASS
- All 10 standard tables present (5 NE + 5 exclusive): systemwide, transfers, franchised status, company-owned status, projected openings
- Total rows balance (verified: 407 start + 12 opened - 21 terminated - 22 non-renewed = 376 end for NE 2024)
- Franchisee list exhibit count: Exhibit A (~34 pages, pp. 86-120), Exhibit B (pp. 121-123)
- Gag clause flag: false (no confidentiality clauses signed in last 3 fiscal years, explicitly stated p. 84)
- Projected openings: zero across all states, both territory types

### 3. Item 21 Sufficiency — PASS
- Auditor identified: PricewaterhouseCoopers LLP (Toronto)
- Opinion type: Unqualified (clean)
- Going-concern: No going-concern language
- Income statement extracted: Total revenue $850.4M, operating income $82.7M, net income $60.1M
- Balance sheet extracted: Total assets $591.2M, total equity $237.5M
- Cash flows extracted: Operating $71.3M, investing ($29.8M), financing ($33.7M)
- Notes to financial statements: 16 note families deep-walked
- Item 21 method: normal text extraction
- Caveat: Financials are for FS Brands (parent), not Pillar To Post standalone — standard for multi-brand parent FDDs

### 4. State Addenda Sufficiency — PASS
- 15 states identified with addenda in Exhibit I
- 7 states with agreement riders in Exhibit J
- All addenda read and structured into `state_addenda_overrides` in 09_final_canonical.json
- 9 override families identified: forum_selection, governing_law, noncompete, general_release, termination, transfer, damages, renewal, no_poach
- Per-state override detail documented in RT_depth_state_addenda_promotion.json

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json
- Franchise agreement (Exhibit G, pp. 188-231) fully clause-walked — 18 clause families
- All sub-exhibits (G-1 through G-5) clause-walked
- Financial statements (Exhibit E) deep-read with 16-note walk
- State addenda (Exhibits I and J) structured
- Guarantees of Performance (Exhibit F) confirmed — FS Brands guarantees

### 6. Unresolveds and Contradictions — PASS
- 4 unresolveds in canonical: system shrinkage (HIGH), standalone financials (MEDIUM), no cost data (MEDIUM), table formatting (LOW)
- 2 contradictions in canonical: Item 20 Table 1 count issue (resolved), PTP360 fee discrepancy (resolved)
- All are genuine business-risk flags or FDD structural limitations, not extraction gaps
- `unresolveds` and `contradictions` keys present in 09_final_canonical.json

### 7. Final Report Depth — PASS
- 08_final_report.md is a full diligence report (~400+ lines)
- Contains all required sections: A (executive snapshot, 15 bullets), B (fees/investment), C (supplier/operations/tech), D (territory), E (contract burden/legal), F (Item 19 detail with 5 sub-tables), G (Item 20 detail), H (Item 21 financials), I (state addenda), J (unresolveds), K (contradictions), L (final coverage note)
- Not a concise metrics summary
- State addenda discussed substantively in Section I

### 8. Score Gate — PASS
- Overall grade: B+ (10_scorecard.md)
- All required items covered at A grade (Item 21 at A-)
- Canonical fields populated with evidence grounding
- A2 depth passes documented with per-block counts

---

## Franchise Agreement Clause-Walk Assessment

All franchise agreement exhibits were directly clause-walked:
- **Exhibit G** (Standard Franchise Agreement, pp. 188-231): 18 clause families extracted including grant/term, fees, opening, training, duties, marks, operations manual/technology, confidentiality, accounting, advertising, insurance, transfer, termination, post-termination, noncompete, indemnification, dispute resolution
- **Exhibit G-1** (Guaranty, pp. 232-234): Unconditional, joint and several personal guarantee
- **Exhibit G-2** (Friendship Agreement, pp. 235-236): Cross-territory referral rules
- **Exhibit G-3** (Good Neighbor Agreement, pp. 237-239): Co-opetition rules
- **Exhibit G-4** (General Release, pp. 240-241): Broad release required at renewal/transfer
- **Exhibit G-5** (Confidentiality/Non-Competition, pp. 242-244): Perpetual confidentiality + 2-year post-term noncompete

**Verdict: No deferred exhibits.** All surfaced franchise agreement exhibits were clause-walked.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale — all key exhibits were directly clause-walked and no material buyer-facing gaps remain.

---

## Strongest Parts of the Run

1. **Item 19 extraction** — All 6 FPR tables with population counts, ranges, and exclusion rules fully captured (pp. 54-60). Group-level breakdowns enable prospective franchisee to assess sales potential by business scale.

2. **Item 20 complete extraction** — All 10 tables (5 NE + 5 exclusive) with state-by-state activity data for 3 years (pp. 60-84). Net unit trajectory clearly surfaced: -73 units over 3 years with zero projected openings.

3. **Franchise agreement full clause walk** — Exhibit G (pp. 188-231) walked clause by clause. All 6 sub-exhibits (G-1 through G-5) also walked. Distinctive clauses identified: AI policy, domain/social media irrevocable assignment, minimum revenue default triggers.

4. **State addenda structured promotion** — 15 states with addenda structured into 9 override families in canonical. Per-state override detail with source pages. Cross-reference matrix of override families by state.

5. **Financial statement note walk** — 16 note families from FS Brands consolidated financials (pp. 134-148). Revenue recognition, lease structure ($84.9M undiscounted maturity), NCI structure ($72.5M redemption), tax detail (27.9% effective rate), acquisition activity all documented.

6. **Fee stack completeness** — 19 fee categories extracted with escalating minimum royalties, per-inspection fees, and all adjustment mechanisms. Per-inspection minimum calculated at $46.55 before EZBook.

7. **Guaranty depth** — Exhibit G-1 scope fully documented: unconditional, joint and several, all shareholders/members/partners, Florida law, waiver of proceed-first rights.

---

## Weakest Remaining Parts of the Run

1. **Pillar To Post standalone financials** — Only FS Brands consolidated available. Cannot isolate Pillar To Post's revenue, profitability, or financial position. This is a structural FDD limitation, not recoverable. (Item 21, p. 85)

2. **Item 19 cost data** — FPR provides sales only, no cost/EBITDA data. Prospective franchisee cannot assess expected profitability from FDD alone. This is a structural FDD limitation. (Item 19, pp. 54-60)

3. **Exhibits A & B individual extraction** — Franchisee and former franchisee lists (pp. 86-123) identified by page range but not individually extracted. ~34 pages of contact data in Exhibit A. This is a bulk data extraction issue, not a material analytical gap.

4. **System shrinkage cause** — The FDD documents the decline (-73 units, zero projected openings) but provides no explanation. A prospective franchisee would need to contact current and former franchisees directly. (Item 20, pp. 60-85)

5. **Exhibit C/D brevity** — Operations Manual TOC (p. 123) is described as 13 pages with links. Computer specifications (p. 123) are brief. Both covered substantively in Item 11 text but the actual exhibit pages are minimal.

---

## Where a Prior or Manual Run May Still Be Stronger

1. **Franchisee list individual extraction** — A manual run might extract individual franchisee names and contact info from Exhibit A (pp. 87-120) to enable direct outreach, which this automated run did not do.

2. **Item 19 profitability estimation** — A manual analyst might estimate unit-level profitability by combining Item 19 sales data with Item 6/7 cost structures and industry benchmarks, producing a pro-forma P&L. This run reports what the FDD says without constructing estimates.

3. **Item 20 state-by-state trend analysis** — A manual run might analyze which specific states show the worst termination/non-renewal trends and correlate with market conditions. This run captures all the data but does not produce that cross-analysis.

---

## Optional Max-3 Follow-up Roadmap

1. **`RT_recover_franchisee_list_sample.json`** — Extract a representative sample of 20-30 franchisee contacts from Exhibit A for due diligence outreach, prioritizing states with highest activity.

2. **`RT_depth_item19_profitability_estimate.json`** — Construct a pro-forma unit-level P&L using Item 19 Group A median sales, Item 6 fee schedule, Item 7 investment table, and disclosed insurance/operating costs.

3. **`RT_depth_item20_state_trends.json`** — Cross-tabulate Item 20 state-by-state data to identify geographic patterns in terminations, non-renewals, and transfers.

---

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- C1: Item 20 Table 1 (Exclusive) shows 2024 ending count as "2" but Table 3 shows 36. Resolved as text extraction artifact.
- C2: PTP360 fee $3.00 in agreement vs. $3.10 in FDD. Resolved as current adjusted fee.

### Business-Risk Flags
- U1 (HIGH): System shrinkage — 73 units lost in 3 years, zero projected openings
- U3 (MEDIUM): No cost data in Item 19 — cannot assess profitability

### Extraction-Depth Gaps
- U2 (MEDIUM): Pillar To Post standalone financials not available — structural FDD limitation, not recoverable
- U4 (LOW): Item 20 Table 1 formatting — resolved by Table 3 cross-reference

---

## Buyer-Trust Assessment

A serious buyer could trust this run as the foundation for their due diligence. The extraction is comprehensive across all 23 items, captures every material table with population counts and ranges, walks the franchise agreement clause by clause, structures state addenda into actionable override families, and deep-walks the financial statement notes. The run clearly flags the two highest-risk findings — the significant system shrinkage with zero growth pipeline, and the heavy fee burden relative to median single-inspector earnings — in both the executive snapshot and the unresolveds. A buyer would need to supplement this with direct franchisee interviews (facilitated by the confirmed absence of gag clauses) and an independent profitability model, but the factual foundation for those conversations is fully surfaced.

---

## Source-Grounding Rule

All weaknesses, gaps, and claims in this gate cite exact source pages:
- Item 19 sales only: pp. 54-60
- Item 21 parent only: p. 85
- System shrinkage: pp. 60-85
- Exhibit A/B: pp. 86-123
- Exhibit C/D: p. 123
- Franchise agreement clause walk: pp. 188-231
- State addenda: pp. 251-284
- Financial notes: pp. 134-148
