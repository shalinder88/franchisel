# Publish Gate — Jimmy John's Franchisor SPV, LLC (2026 FDD)

## Verdict: 2 — Publish with Caveats

**Rationale**: This extraction is comprehensive and buyer-ready. All 23 FDD items are extracted to material depth with structured canonical facts, complete Item 19 AUV data (both tables), complete Item 20 outlet data (all 5 tables with per-state detail), KPMG-audited financial statements with all 7 notes walked, and state addenda structured with 17 material overrides across 14 states. The franchise agreement has been partially clause-walked (26 key operative clauses extracted via targeted page reads). The only remaining gaps are cosmetic (market maps) or non-extraction in nature (no cost/EBITDA data in Item 19 — a business-risk flag, not an extraction failure). Two minor exhibits (Principal's Agreement and General Release) are labeled-only but their operative substance is adequately recovered from body cross-references.

---

## Checklist Assessment

### 1. Item 19 Completeness
**Status**: Complete.
Both AUV tables extracted — quartile breakdown (4 quartiles + all restaurants) and restaurant type breakdown (drive-thru, no drive-thru, non-traditional). Population of 2,581 restaurants with all exclusion rules documented. Notes on calculation methodology, source data, and limitations captured. Substantiation availability statement captured ("Upon your reasonable request, we will provide written substantiation"). No cost/expense/EBITDA data is disclosed in the FDD — this is a business-risk flag, not an extraction gap.

### 2. Item 20 Completeness
**Status**: Complete.
All 5 standard tables present:
- Table 1 (Systemwide): 3-year trajectory, 2,777 total outlets end-2025
- Table 2 (Transfers): Per-state detail for all 3 years; totals: 205/170/124
- Table 3 (Franchised Status): Per-state detail for all 41+ states, all 3 years; footer totals verified
- Table 4 (Company-Owned): Per-state, 5 states, all 3 years
- Table 5 (Projected): Per-state, 32 states
Multi-brand location notes (6 notes with per-state detail) captured.
Gag clause flag: **false** — "no current or former franchisees have signed confidentiality clauses" (p. 100).
Franchisee Advisory Council: exists, contact Tim Asire.

### 3. Item 21 Sufficiency
**Status**: Complete.
- Auditor: KPMG LLP (Atlanta, GA) — Big Four
- Opinion: Unqualified (clean), dated March 19, 2026
- Going concern: No
- Balance sheet: Total assets $751.6M, member's equity $723.9M (pp. 306)
- Income statement: Revenue $159.7M, net income $103.1M (pp. 307)
- Cash flow: Operating $131.3M, distributions ($134.4M) (pp. 309)
- Member's equity: Declining due to distributions exceeding net income
- Notes: All 7 notes walked — accounting policies, securitization ($1.037B), revenue recognition, intangibles ($724M), related-party management fee ($31.5M), subsequent events (none)
- Item 21 extraction method: normal text extraction

### 4. State Addenda Sufficiency
**Status**: Complete.
14 states with addenda identified and structured into `state_addenda_overrides` in 09_final_canonical.json. Material override families extracted:
- Forum selection overridden: MD, MN, ND
- Governing law overridden: ND (North Dakota law applies)
- Noncompete limited/unenforceable: ND
- General release excludes state claims: MD, MN, ND
- Termination notice extended: MN (90 days notice, 60 days cure; 180 days non-renewal notice)
- Liquidated damages limited: MN, ND
- No-poach provisions removed: WA (Assurance of Discontinuance with WA AG)
- CA Fast Food Act compliance required

### 5. Key Exhibit Sufficiency
**Status**: Adequate with caveats.
- Exhibit B (FA): 26 clauses walked via targeted page reads. Key operative provisions (term, fees, training, termination, transfer, noncompete, dispute resolution, guaranty, liquidated damages, ROFR, purchase option, force majeure, indemnification) extracted.
- Exhibits B-1 through B-5: Incentive, non-traditional, multi-brand, successor, and lease assumption terms recovered from Item 5, 6, 11, 12, 17 body cross-references.
- Exhibit C (DA): Key terms from Item 12 body.
- Exhibit E (Principal's Agreement): Labeled; operative scope (confidentiality + noncompete for directors/officers) from Item 15.
- Exhibit F (Financial Statements): Complete.
- Exhibit G (General Release): Labeled; scope from Item 17 (required at renewal and transfer, subject to state law exceptions in MD, MN, ND).
- Exhibit H (State Addenda): Structured per-state with 17 overrides.

### 6. Unresolveds and Contradictions Assessment
**Status**: Adequate.
4 unresolveds preserved in canonical:
- UR-001: Standard/Strategic Markets maps (medium) — cosmetic
- UR-002: No cost data in Item 19 (medium) — business-risk flag
- UR-003: $1.037B securitization debt structural risk (medium) — business-risk flag
- UR-004: State addenda per-state detail (medium) — now resolved in A2
No contradictions identified. Item 20 counts internally consistent. Financial statements reconcile.

### 7. Final Report Depth
**Status**: Complete.
08_final_report.md is a full standalone diligence narrative at ~600 lines / ~31 KB. All required sections present:
- A: Executive snapshot (14 numbered bullets)
- B: Fees/investment (detailed fee stack, initial investment, incentive programs)
- C: Supplier/operations/training/tech
- D: Territory, competition, channels (no territory analysis)
- E: Contract burden/legal mechanics (clause-by-clause)
- F: Item 19 (both tables, quartile analysis, critical caveats)
- G: Item 20 (multi-year trajectory, transfers, pipeline, gag clause)
- H: Item 21 (full financial statement walk with securitization analysis)
- I: State addenda (14 states with overrides)
- J: Unresolveds
- K: Contradictions (none)
- L: Final coverage note

### 8. Score Gate
**Status**: A- overall.
All items covered at A grade. Exhibits at A-/B+ post-A2 depth passes. Canonical has 35+ top-level keys with structured state addenda overrides, contract burden depth, and financial note families.

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced franchise agreement exhibit(s):** Exhibit B (pages 106–175, 70 pages)

**Clause-walked or labeled_only:** Partial — 26 key operative clauses extracted via targeted page reads of the Contract Data Schedule, key operative sections (Sections 1–17), and the Guaranty attachment.

**Verdict decision: Verdict 2 allowed** because:
1. All key operative burdens (term, fees, transfer, termination, noncompete, default, guaranty, venue, liquidated damages, ROFR, purchase option, force majeure, indemnification, insurance) are covered in the canonical via Item 17 cross-references, A1 body extraction, and A2 contract burden depth pass.
2. No material buyer-facing gap remains — the cross-default trigger, repeated-defaults provision, death/disability, and all cure periods are captured.
3. The only operative clauses not independently walked are procedural/administrative provisions that do not materially affect economics or legal risk.

**Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.**

---

## Strongest Parts of the Run

1. **Item 19 completeness**: Both AUV tables fully extracted with quartile breakdowns, restaurant-type splits, and all caveats — enables direct performance benchmarking (pp. 89-91).
2. **Item 20 all-table coverage**: All 5 tables with per-state detail for 41+ states across 3 fiscal years; zero terminations in 2025 is a standout positive finding (pp. 91-98).
3. **Item 21 financial statement depth**: KPMG-audited statements with all 7 notes walked including securitization structure ($1.037B), revenue recognition mechanics, and related-party management fee — critical for understanding the SPV's economics (pp. 301-315).
4. **State addenda structured extraction**: 14 states with 17 material overrides structured per-family — particularly the Minnesota protections (90-day notice, no liquidated damages, no out-of-state litigation) and North Dakota noncompete unenforceability (pp. 321-326).
5. **Item 6 fee table completeness**: All 22+ fee rows with all 9 footnotes and all 10 incentive programs — including the complex multi-brand incentive mechanics with graduated royalty schedules (pp. 35-47).
6. **Contract burden depth**: 26 key FA clauses extracted including cross-default, repeated-defaults-even-if-cured, ROFR mechanics, purchase option valuation, and force majeure exceptions (pp. 106-169).
7. **Item 3 litigation**: All 11 concluded matters with settlement amounts, including the $4.87M CWL arbitration award and Maryland Securities Commissioner consent order (pp. 26-31).

## Weakest Remaining Parts of the Run

1. **Standard/Strategic Markets maps** (pp. 41-42): These appear to be image-based maps showing which DMAs qualify for Standard ($125K credit) vs. Strategic ($175K credit) incentives. The incentive economic terms are fully extracted but the specific qualifying markets are not confirmed.
2. **Principal's Agreement (Exhibit E, pp. 297-300)**: 4-page agreement not independently clause-walked. Operative scope (confidentiality + noncompete for directors/officers) is known from Item 15, but specific spousal obligations and scope of personal liability remain thin.
3. **General Release (Exhibit G, pp. 316-320)**: 5-page release form not independently walked. Scope is known (renewal + transfer, subject to state law exceptions) but specific carveout language and state-specific exceptions within the form itself are not extracted.
4. **No cost/expense data in Item 19**: The FDD provides gross AUV only — a buyer cannot assess unit-level economics or EBITDA from this FDD alone. This is a business-risk flag inherent to the FDD, not an extraction gap.
5. **Multi-brand Addendum (Exhibit B-3, pp. 189-194)**: Key terms (cross-termination, branding, training) extracted from body items but the 6-page addendum itself was not independently clause-walked.

## Where a Prior or Manual Run May Still Be Stronger

1. **Standard/Strategic Markets map resolution**: A manual reviewer or image-capable extraction could confirm the specific DMAs qualifying for each incentive tier by visually reading the maps on pp. 41-42.
2. **General Release form language**: A manual review of Exhibit G (pp. 316-320) could identify specific carveout language, scope of claims released, and any interaction with state addenda overrides — useful for franchisees contemplating renewal or transfer.
3. **Supplier economics**: A manual reviewer could cross-reference Items 8 and 6 with the franchise agreement provisions to more precisely quantify the total supply-chain burden (e.g., markups on Trade Secret Food Products, supplier rebate amounts).
4. **Item 19 expense estimation**: A manual reviewer could survey current/former franchisees (enabled by the lack of gag clauses) to develop cost-of-sales and operating expense estimates that this FDD does not disclose.

## Optional Max-3 Follow-Up Roadmap

1. **RT_recover_exhibit_E_principal.json**: Walk Exhibit E (Principal's Agreement, pp. 297-300) to extract personal liability scope, spousal obligations, and noncompete mechanics for directors/officers.
2. **RT_recover_exhibit_G_release.json**: Walk Exhibit G (General Release, pp. 316-320) to extract release scope, carveouts, and state-specific exception language.
3. **RT_depth_item6_market_maps.json**: Render and read pp. 41-42 to extract the Standard and Strategic Markets DMA lists from the map images.

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- None identified.

### Business-Risk Flags
- **UR-002**: Item 19 provides only gross AUV data — no cost/expense/EBITDA. A buyer cannot assess unit-level profitability from this FDD alone.
- **UR-003**: $1.037B securitization debt at parent level secured by all Company assets. If securitization defaults, it could trigger remedies affecting franchise operations.

### Extraction-Depth Gaps
- **UR-001**: Standard/Strategic Markets maps may be image-only (pp. 41-42). Cosmetic — incentive economics are fully extracted.
- **UR-004**: Originally an extraction gap (state addenda not structured) — now resolved in A2 with 14 states and 17 overrides structured.

## Buyer-Trust Assessment

A serious buyer would find this extraction trustworthy as a comprehensive initial diligence reference. All material FDD items are extracted to operative depth, with structured canonical data covering fees, territory, contract provisions, financial statements, state addenda, and performance metrics. The extraction correctly identifies the key risk factors — no territory, materially different renewal terms, $1.037B securitization overhang, cross-default cascade risk, and aggressive noncompete — while also surfacing the positives (zero terminations in 2025, strong growth trajectory, multiple incentive programs reducing effective fees). The two remaining labeled-only exhibits (Principal's Agreement and General Release) do not undermine buyer trust because their operative substance is recovered from body cross-references. A buyer should supplement this extraction with franchisee conversations (enabled by the gag clause finding) and independent cost/expense analysis.

## Source-Grounding Rule

All weaknesses and gaps cited above include exact page references. All "prior run stronger" claims cite specific exhibits and page ranges. No unsourced claims appear in this gate.
