# 15 Publish Gate — H&R Block Tax Services LLC (639774-2025)

## Verdict: 2 — Publish with Caveats

### Rationale

This extraction achieves comprehensive coverage of all 23 FDD Items, with substantive depth on the most buyer-critical elements: fee structure, franchise contraction trajectory, financial statements, state addenda, and contract burdens. The primary caveats are (a) the Franchise Agreement exhibit was clause-walked via cross-references rather than direct page-by-page walk, and (b) the Financial Products Distribution Agreement (33 pages) and certain ancillary exhibits remain labeled-only. Neither gap creates a material buyer-facing information deficit because the operative burdens from these exhibits are adequately covered through body-text cross-references and A2 depth passes.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: Complete
- **Assessment**: No FPR provided. Verbatim refusal statement extracted (p.43). Substantiation availability: not applicable (no FPR). Contact for unauthorized representations identified (Roxane Harris).
- Item 19 cohort comparability: Not applicable — no FPR exists.

### 2. Item 20 Completeness
- **Status**: Complete
- All 5 standard tables present with state-by-state detail and footer totals
- Total rows verified to balance (minor footnoted corrections acknowledged in unresolveds)
- Franchisee list exhibit count: Exhibit E spans pp.126–184 (59 pages)
- Gag clause flag: SET — confirmed with verbatim quote (p.56)
- Transfer totals: 40/42/26 over 3 years
- Projected openings: 0 franchised, 138 company-owned for FY2026

### 3. Item 21 Sufficiency
- **Status**: Complete
- Auditor: Deloitte & Touche LLP (since 2007)
- Opinion: Unqualified on financial statements and internal controls
- Going concern: None
- Income statement: 3-year data extracted
- Balance sheet: 2-year data extracted
- Cash flow: 3-year data extracted
- Financial notes: All 12 note families walked in A2 depth pass
- Item 21 method: normal text extraction
- Key financial observations documented (leverage, revenue trends, goodwill, POM deferred revenue, debt maturities)

### 4. State Addenda Sufficiency
- **Status**: Complete
- 11 states identified and extracted: CA, IL, MD, MI, MN, NY, ND, RI, VA, WA, WI
- Structured into `state_addenda_overrides` in 09_final_canonical.json: Yes
- 36 individual override entries across 8 override families
- Summary table: override families × states constructed
- Per-state operative details documented with source pages

### 5. Key Exhibit Sufficiency
- **Status**: Adequate with noted gaps
- All exhibits listed in Item 22 are accounted for in 04_exhibits.json (16 exhibits)
- Financial statements (Exhibit D): Deep-read with note walk complete
- Franchise Agreement (Exhibit F-1): Partial clause walk via Item 17 cross-references + A2 contract burden depth. Key operative burdens covered. See franchise agreement clause-walk assessment below.
- Guarantee (Exhibit C): Complete
- Loan Agreements (H-1, H-2): Key terms from Item 10 + A2 depth pass
- General Release (G): Labeled with scope identified; state limitations documented
- FDA (I-3): Labeled only (33 pages). Key obligation covered from Items 1, 8.

### 6. Unresolveds and Contradictions Assessment
- **Status**: Complete
- `unresolveds` key present in 09_final_canonical.json: Yes (3 entries)
- `contradictions` key present: Yes (1 entry — informational, not data error)
- All unresolveds are genuine data-quality or reconciliation questions, not extraction gaps
- UR-001 (Table 3 footnote corrections): Medium — document-internal data restatements
- UR-002 (Table 3 vs Table 4 reacquisition reconciliation): Medium — table structure question
- UR-003 (State addenda structure): RESOLVED by A2 depth pass — now fully structured

### 7. Final Report Depth
- **Status**: Complete (34,608 bytes, ~700 lines)
- All required sections present with substantive narrative:
  - A. Executive snapshot (15 numbered bullets)
  - B. Fees/investment (~3,000 words)
  - C. Supplier/operations/tech (~1,500 words)
  - D. Territory/competition (~700 words)
  - E. Contract burden (~2,000 words)
  - F. Item 19 detail (~300 words — limited by no-FPR)
  - G. Item 20 detail (~1,500 words)
  - H. Item 21 detail (~2,000 words)
  - I. State addenda summary (~500 words)
  - J. Unresolveds table
  - K. Contradictions table
  - L. Final coverage note

### 8. Score Gate
- **Status**: B+ overall grade in 10_scorecard.md
- All required items covered
- Canonical fields populated with evidence grounding
- 42 top-level keys in canonical (meets ≥40 target for 200+ page FDD)
- Canonical size 27KB (meets ≥20KB target)

---

## Franchise Agreement Clause-Walk Assessment

**Exhibit F-1 — Franchise License Agreement (pp.185–225, 39 sections)**

The FLA was partially clause-walked:
- Page ranges: pp.185–225 (41 pages)
- Walk method: Item 17 cross-references + FLA TOC analysis + A2 contract burden depth pass
- Clauses walked: 21 of 39 sections (54%)
- Key operative burdens covered: term (§4), royalty (§6), noncompete (§12), termination incurable (§13), termination curable (§14), termination by franchisee (§15), post-termination (§16), ROFR (§17), transfer (§18), death/disability (§20), indemnification (§21), applicable law/venue (§29)
- Deferred sections: definitions (§1), licensed marks (§3), training (§7), computer/supplies (§8-9), conduct of business (§10), books/records (§11), miscellaneous (§22-38)

**Verdict 2 assessment**: The FLA's key operative burdens are adequately covered through Item 17 chart cross-references and A2 contract-burden depth pass. The missing clause walk does not leave a material buyer-facing gap:
- Term, fees, transfer, termination, noncompete, default, guaranty (via loan agreements), and venue are all covered
- The deferred sections (definitions, marks, training, computers, conduct, misc) are substantively covered through Items 8, 11, 13, 14, 15, 16 body text
- No evidence of unusual liquidated-damages formula, personal-guaranty scope, cross-default trigger, or death/disability provision beyond what is captured

**Remaining thin areas**: §39 (Limitations in the Event of Litigation) — specific limitations not fully extracted. This is a known gap but not buyer-critical.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 20 completeness** (pp.44–56): All 5 tables extracted with full state-by-state detail, footer totals, footnote corrections, gag clause verbatim quote, independent association contact, and leadership council identification. This is the most complete Item 20 extraction possible.

2. **Fee structure depth** (pp.17–19): The uniquely complex tiered royalty structure (60%/40%/20% with early-pay discounts and Product-Specific Royalties) is fully decomposed with all conditions, thresholds, eligibility requirements, and reporting period definitions.

3. **Financial statements** (pp.91–124): Complete extraction of H&R Block, Inc. consolidated financials with all 12 note families walked in A2. Revenue disaggregation (Note 2, p.107) reveals US royalty revenue at $192.9M — directly relevant to franchise economics.

4. **State addenda** (pp.60–89): 36 structured override entries across 11 states and 8 override families. Summary table of override families × states constructed. CA interest rate cap at 10% identified as potentially conflicting with disclosed 10.5% FPI loan rate.

5. **Franchise contraction narrative** (pp.44–55): The strategic reacquisition pattern is fully documented with quantitative analysis (438 outlets reacquired over 3 years, 68–83% of annual decline). Reacquired franchise rights as largest intangible ($172M net, Note 6, p.112) independently confirms the reacquisition strategy from the financial statements.

6. **Item 7 investment table** (pp.19–21): Complete 16-component breakdown with all 17 footnotes. Space requirements, lease cost ranges, and working capital estimates documented.

### 2. Weakest Remaining Parts of the Run

1. **Franchise Agreement full clause walk** (pp.185–225): Only 21 of 39 sections directly walked. §39 (Litigation Limitations) content not fully extracted. While operative burdens are covered via cross-references, a direct walk would surface any unusual clause language.

2. **Financial Products Distribution Agreement** (pp.278–310): 33-page agreement left labeled-only. Key obligation identified (exclusive use of approved banking partner), but detailed compliance requirements, termination provisions, and liability allocation not extracted.

3. **General Release operative scope** (pp.231–232): Release form identified but specific operative language not extracted. State limitations documented from amendments but actual release text not walked.

4. **Loan agreement detailed schedules** (pp.233–264): Key terms from Item 10 and A2, but detailed security agreement schedules, specific collateral descriptions, and exhaustive event-of-default definitions not walked.

5. **Item 20 Table 3 footnote corrections**: Corrections to prior-year counts acknowledged but specific nature of corrections (what changed, why) not determinable from the FDD text alone.

### 3. Where a Prior or Manual Run May Still Be Stronger

1. **FLA §39 Litigation Limitations**: A manual review reading every page of the franchise agreement would surface the specific litigation limitations (waiver of jury trial, waiver of consequential damages, statute of limitations shortening, etc.) that an automated cross-reference approach may miss. The FLA's §39 is specifically titled "Limitations in the Event of Litigation" — this section may contain unusual provisions worth surfacing.

2. **FDA (Exhibit I-3) liability allocation**: A manual review of the 33-page Financial Products Distribution Agreement would surface how liability is allocated between the franchisee, the franchisor, and the banking partner for customer complaints about financial products. Given the FTC settlement ($7M) related to DIY products, understanding product liability allocation is buyer-relevant.

3. **Loan agreement acceleration mechanics**: A manual review would surface the specific mechanics of how FPI can exercise its remedies upon default — particularly the interplay between franchise termination, loan acceleration, and property foreclosure. The cross-default between FLA and loan agreements creates a potential cascade that a manual review would trace more precisely.

4. **Exhibit E franchisee contact analysis**: A manual review could analyze the franchisee list to identify geographic concentration, multi-unit operators, and recent departures — useful for due diligence calls.

### 4. Optional Max-3 Follow-Up Roadmap

1. **RT_depth_fla_section39.json** — Walk FLA §39 (Limitations in the Event of Litigation) to extract specific litigation limitations, waivers, and restrictions. Target: pp.216-217.

2. **RT_depth_fda_exhibit_I3.json** — Walk Exhibit I-3 (Financial Products Distribution Agreement) to extract liability allocation, termination provisions, and compliance obligations. Target: pp.278-310.

3. **RT_depth_loan_acceleration.json** — Walk H-1 and H-2 loan agreements focusing on acceleration mechanics, foreclosure procedures, and cross-default cascade with FLA. Target: pp.233-264.

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies**:
- UR-001: Table 3 footnote corrections for AL, IN, KY, PA, VI — prior-year count restatements of unclear nature

**Business-Risk Flags**:
- CONTRA-001: Franchise contraction + company-owned growth = strategic reacquisition (not a contradiction but a significant buyer risk signal)
- Gag clause: Franchisees restricted from speaking openly — limits due diligence

**Extraction-Depth Gaps**:
- UR-002: Table 3 vs Table 4 reacquisition column reconciliation — column structure question, not a material data gap
- UR-003: Resolved — state addenda now fully structured

### 6. Buyer-Trust Assessment

A serious buyer would find this run substantially trustworthy for making an informed decision about an H&R Block franchise investment. The core economics (fee structure, investment range), system trajectory (franchise contraction, reacquisition pattern), contract burdens (term, noncompete, termination), and financial health (parent-level statements with note walk) are all thoroughly documented with page-level provenance. The key buyer concern — that the franchise system is being strategically wound down with zero new franchise openings projected — is clearly and repeatedly surfaced. The primary limitation is the absence of an Item 19 FPR, which is a document limitation (the franchisor chooses not to provide one), not an extraction gap. A buyer relying on this run would have the information needed to make a go/no-go decision and to formulate specific questions for existing franchisees, the franchisor, and legal counsel.

### 7. Source-Grounding Rule

All weaknesses, gaps, and "prior run stronger" claims above cite exact page ranges:
- FLA full clause walk gap: pp.185-225 (specifically §39 at pp.216-217)
- FDA gap: pp.278-310
- General Release gap: pp.231-232
- Loan agreement gap: pp.233-264
- Table 3 footnote corrections: pp.47-51
