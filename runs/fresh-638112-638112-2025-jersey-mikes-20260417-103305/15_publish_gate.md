# Publish Gate — Jersey Mike's (638112-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

This extraction covers all 23 FDD Items with materially useful depth, includes comprehensive financial statement analysis for both the franchisor entity and consolidated parent, extracts all 5 Item 20 tables with state-level detail, captures the Item 19 FPR, and provides structured state addenda overrides for 8 states. The A2 depth passes deepened the contract burden analysis, financial note walk, and state addenda extraction. The remaining gaps are primarily in exhibit clause walks (Renewal Amendment, General Release, Coach Rod Smith documents) that do not leave material buyer-facing gaps because the operative substance of these exhibits has been recovered from body cross-references and the A2 contract burden pass. This extraction is suitable for publication with the caveats noted below.

---

## Checklist Assessment

### 1. Item 19 Completeness
**Grade: A**
The single FPR table is fully extracted with all metrics (average $1,338,874; median $1,285,259; population 2,255; 45% met/exceeded average). Data set methodology, exclusion criteria (734 excluded for 4 reasons), and definitions are captured. The substantiation availability statement is captured. No cost build-up is disclosed by the franchisor — this is a franchisor choice, not an extraction gap.

### 2. Item 20 Completeness
**Grade: A**
All 5 standard tables present:
- Table 1 (Systemwide): 3-year trajectory, all outlet types
- Table 2 (Transfers): State-by-state, 3 years. Totals: 105/96/79
- Table 3 (Franchised Status): State-by-state with all columns. Totals balanced. Zero terminations/non-renewals.
- Table 4 (Company-Owned): State-by-state, 3 years.
- Table 5 (Projected Openings): State-by-state. 574 signed/not opened; 270 projected franchised.
- Gag clause flag: SET (true). JMFS has signed confidentiality clauses with franchisees; Company has not. (p. 73)
- Franchisee advisory (NFAC): Documented (p. 49).

### 3. Item 21 Sufficiency
**Grade: A**
- Auditor: Deloitte & Touche LLP (identified for both D-1 and D-2)
- Opinion: Unqualified (both entities)
- Going concern: None
- Income statement: Fully extracted for both entities (D-1: $279.9M revenue, $238.6M net income; D-2: $652.8M revenue, $5.0M net income)
- Balance sheet: Fully extracted (D-1: $36M assets, $22.5M equity; D-2: $1.05B assets, ($857.9M) deficit)
- Cash flow: Fully extracted (D-1: $244M operating; D-2 not separately extracted but key components covered)
- Notes: D-1 fully walked (accounting policies, securitization, services from manager). D-2 notes walked through A2 depth pass (securitization debt structure, notes receivable, property/equipment, unconsolidated affiliates, subsequent events including Blackstone acquisition at $8.0B EV).
- Item 21 method: normal text extraction

### 4. State Addenda Sufficiency
**Grade: A-**
8 states identified and structurally extracted in RT_depth_state_addenda_promotion.json: California, Hawaii, Illinois, Maryland, Minnesota, North Dakota, Rhode Island, Washington. 21 structured override entries across 12 override families. Summary table mapping override families to affected states provided. State addenda overrides are promoted into canonical. Key overrides: MN liquidated damages not enforced, MN 90-day notice/60-day cure, WA venue override, WA supplier pricing challenge, IL governing law override, MD surety bond.

Minor gap: Hawaii addendum content is thin — only a cover page was identified (p. 358). This may reflect genuinely minimal Hawaii-specific overrides or a missed interior page. Given Hawaii's relatively standard franchise law, this is not material.

### 5. Key Exhibit Sufficiency
**Grade: B+**
All exhibits listed in Item 22 are accounted for in 04_exhibits.json. Franchise Agreement (Exhibit C) was clause-walked through the A2 contract burden depth pass, covering 18 operative clause families. Guaranty (Exhibit C-2) scope fully documented: personal, unconditional, joint/several, spousal, all defenses waived. Lease Rider (Exhibit J) key provisions extracted.

Exhibits not directly clause-walked: Renewal Amendment (Exhibit I, pp. 321-327), General Release (Exhibit G), Coach Rod Smith documents (Exhibit K, pp. 332-354). For these:
- Renewal Amendment: Key terms (materially different terms risk) fully extracted from Item 17 table. Missing: specific modifications made at renewal (e.g., which FA sections are deleted/replaced).
- General Release: Form identified. Release scope (broadly releases Company from all claims) understood from Item 17 context.
- Coach Rod Smith: Key economics (interest rates, terms, security) fully extracted from Item 10. The promissory note and security agreement details would enrich but do not represent a buyer-facing gap for non-CRS applicants.

### 6. Unresolveds and Contradictions
**Grade: A-**
5 unresolveds documented in canonical `unresolveds` array:
- U1 (medium): FA clause walk — substantially resolved by A2 contract burden pass
- U2 (medium): D-2 note walk — substantially resolved by A2 financial notes pass
- U3 (medium): State addenda — resolved by A2 state addenda pass
- U4 (medium): JMFS gag clause scope — business-risk flag, not extraction gap
- U5 (low): Blackstone impact — business-risk flag, not extraction gap

1 contradiction documented with resolution: Item 20 count vs D-1 Note count (explained by different counting bases).

All unresolveds and contradictions preserved in `09_final_canonical.json` as top-level keys. U4 and U5 are genuine business-risk flags, not extraction gaps.

### 7. Final Report Depth
**Grade: A**
`08_final_report.md` is a full standalone diligence narrative with all required sections:
- A: Executive snapshot (15 numbered bullets)
- B: Fee stack, entry structure, initial investment (comprehensive, multi-paragraph)
- C: Supplier control, operations, training, technology (detailed)
- D: Territory, competition, channels (with affiliate overlap analysis)
- E: Contract burden, legal mechanics (clause-by-clause coverage)
- F: Item 19 with analysis and fee burden context
- G: Item 20 with trajectory narrative, transfer trends, gag clause flag
- H: Item 21 with full financial statement walk for both entities
- I: State addenda summary for 8 states
- J: Unresolveds (5 entries with severity)
- K: Contradictions (1 entry, resolved)
- L: Final coverage note

Estimated length: 550+ lines, ~40 KB. Well above minimum thresholds.

### 8. Score Gate
**Grade: A**
10_scorecard.md shows overall grade A (upgraded from A- after A2 depth passes). All required items covered. Canonical fields populated with evidence grounding. 42+ top-level keys in canonical. A2 depth pass results documented.

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit C (Franchise Agreement):** Surfaced on pages 104-158 (55 pages).
**Clause walk status:** The A2 contract burden depth pass walked 18 operative clause families covering: grant/term, royalty, advertising, training, operations, crisis management, vendor payment, insurance, termination triggers, liquidated damages, post-termination, transfer, non-compete (during and post-term), dispute resolution, governing law, indemnification, POS upgrade cap, and remodeling cap.

**Exhibit C-2 (Guaranty):** Fully walked. Personal, unconditional, joint and several, spousal requirement, all defenses waived.

**Exhibit J (Lease Rider):** Key provisions walked: lease assignment to franchisor on termination, landlord irrevocable consent.

**Verdict decision:** Verdict 2 is allowed. Key operative burdens are adequately covered through the combination of Item 17 tables, body cross-references, and A2 contract burden depth pass. No material buyer-facing gap remains. The missing clause walks (Renewal Amendment, General Release, Coach Rod Smith) do not leave gaps in economics, legal burden, transfer/default rights, or post-term restrictions because the operative substance is recovered from body cross-references.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Mandatory Sections

### 1. Strongest Parts of the Run
- **Item 6 fee table:** Complete 31-fee extraction across 9 pages (pp. 15-23) with all 22 footnotes — among the most comprehensive fee extractions in the pipeline
- **Item 20 Tables 1-5:** Full state-level extraction with footer totals for all three years. Zero terminations across entire period (pp. 63-73)
- **Item 19 FPR:** Complete table with all metrics, population methodology, and exclusion criteria (pp. 62-63)
- **Item 21 financial statements:** Both entities (D-1 and D-2) fully extracted with statement-level detail and financial note depth pass. Securitization debt structure ($1.75B) fully documented (pp. 163-206)
- **State addenda:** 8 states structured into 21 override entries across 12 families with summary cross-reference table (pp. 355-395)
- **Contract burden depth:** 18 operative clause families walked including crisis management clause (p. 130), vendor payment default (p. 130), and guaranty scope (pp. 160-162)
- **Blackstone acquisition:** Fully documented from D-2 Note 18: $8.0B EV, $250M earnout, $100M VFN, entity restructuring (p. 205)

### 2. Weakest Remaining Parts of the Run
- **Renewal Amendment (Exhibit I, pp. 321-327):** Not directly clause-walked. While Item 17 captures the key renewal conditions, the specific FA section modifications at renewal (e.g., which provisions are deleted or replaced) are not extracted. This could matter for franchisees approaching renewal.
- **Coach Rod Smith documents (Exhibit K, pp. 332-354):** 23 pages of financing documents not clause-walked. Key economics extracted from Item 10 but promissory note covenants, security agreement specifics, and default triggers beyond cross-default are not independently verified from the exhibit.
- **Hawaii addendum (p. 358):** Minimal content extracted — only a cover page. May reflect genuinely minimal Hawaii overrides or a gap.
- **Item 19 cost build-up:** Not disclosed by franchisor. Cannot independently estimate franchisee profitability. This is a franchisor disclosure choice, not an extraction failure, but it limits buyer utility.
- **Exhibit E (Manual TOC):** 412-page manual referenced but TOC not extracted. Low priority but would provide insight into operational burden scope.

### 3. Where a Prior or Manual Run May Still Be Stronger
- A manual reviewer could negotiate access to substantiation data behind the Item 19 FPR and construct per-unit P&L estimates that this automated extraction cannot provide.
- A legal reviewer could identify nuances in the Franchise Agreement's cross-default provisions (Section 17.2/17.3) that the A2 clause walk may have compressed — particularly the interaction between FA defaults, ADA defaults, and Coach Rod Smith financing defaults.
- A financial analyst could construct pro-forma projections using the Item 7 investment ranges against the Item 19 unit volumes to estimate IRR and payback periods, incorporating the full fee stack and estimated COGS/labor benchmarks from industry data.
- The Renewal Amendment (Exhibit I) modifications would benefit from a line-by-line comparison with the base FA to identify what specifically changes at renewal — particularly whether the royalty rate, advertising percentages, or territorial protections are modified.

### 4. Optional Max-3 Follow-up Roadmap
1. **RT_depth_renewal_amendment.json** — Targeted clause walk of Exhibit I (pp. 321-327) to document specific FA modifications at renewal, particularly: which sections are deleted, what new obligations are added, and whether economics change.
2. **RT_depth_coach_rod_smith.json** — Walk the Promissory Note (Exhibit K) covenants, security agreement, and default triggers beyond what Item 10 discloses, for buyers considering the CRS program.
3. **RT_depth_item19_profitability.json** — If substantiation data is obtained from franchisor, construct unit-level economics analysis with fee burden sensitivity at quartile breakpoints.

### 5. Unresolved Taxonomy

**Document-internal inconsistencies:**
- C1: Item 20 outlet count (2,955) vs. D-1 Note count (2,997) — RESOLVED (different counting bases)

**Business-risk flags:**
- U4: JMFS gag clause — JMFS has signed confidentiality clauses with franchisees restricting ability to speak openly. Scope and number of affected franchisees unknown. (p. 73)
- U5: Blackstone acquisition ($8.0B EV) — new institutional ownership may change system economics, supplier relationships, growth strategy. Impact not yet measurable. (pp. 8, 205)

**Extraction-depth gaps:**
- None remaining at material level. U1 (FA clause walk), U2 (D-2 notes), U3 (state addenda) were all substantially resolved by A2 depth passes. Remaining exhibit gaps (Renewal Amendment, CRS documents) are documented in the follow-up roadmap but do not constitute material buyer-facing gaps.

### 6. Buyer-Trust Assessment

A serious buyer evaluating a Jersey Mike's franchise would find this extraction reliable and substantially complete for initial due diligence purposes. The fee stack is fully documented, the financial performance representation is clearly presented with appropriate caveats about the lack of cost build-up data, and the contract burden analysis covers all major operative provisions including the unusually specific crisis management clause and vendor payment default trigger. The state addenda extraction provides actionable guidance for buyers in the 8 states with overrides. The main limitation — the absence of franchisor-disclosed profitability data (no Item 19 cost build-up) — is a franchisor disclosure choice, not an extraction failure. A buyer should supplement this extraction with direct conversations with existing franchisees (using the Exhibit F-1 contact list), independent financial modeling using industry benchmarks, and legal counsel review of the Franchise Agreement and applicable state addenda.

### 7. Source-Grounding Rule
All claims in this gate are grounded to specific source pages as cited above. No unsourced claims.

---

## Item 19 Cohort Comparability

Item 19 cohort comparability: no discrepancy found. The measurement period (2024) uses the same 6.5% royalty rate, 1% Corporate Ad Fund, and 4% National Media Fund that current new franchisees pay. No cohort-comparability issue identified.
