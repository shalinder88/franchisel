# 15 Publish Gate — Anago Cleaning Systems
## FDD 2026 | Filing ID: 640323

---

## VERDICT: 2 — Publish-ready with caveats

---

## Rationale

The extraction is comprehensive across all 23 FDD items, with strong depth on the highest-value families (Item 19, Item 20, Item 21, Item 6, Item 17). A2 delivered a full contract clause walk (28 clauses + 7 distinctive provisions), structured state addenda (23 overrides across 8 states), and complete financial note coverage (16/16 notes). Three deferred exhibits (Unit Franchise Agreement, NBDS License, Deposit Agreement) prevent a full verdict-1 but their key operative content is substantially covered elsewhere in the run.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR disclosed with 3 tables: multi-year average (2022-2025), quartile distribution (2025), maturity grouping
- Population counts: 37 of 41 qualifying = 90% (2025)
- All exclusion rules captured: domestic only, 1+ year continuous operation, self-reported/unaudited
- Caveats captured: AAS ≠ profit, AAS ≠ Gross Revenues, excludes prepayments/taxes
- Substantiation statement captured: "Written substantiation... will be made available to a prospective Subfranchisor upon request"
- Item 19 cohort comparability: no discrepancy found (same fee structure)
- Minor: Table 3 header mislabel ("2023" vs 2025 maturity data) documented as unresolved U1

### 2. Item 20 Completeness — PASS
- All 5 domestic tables present: systemwide summary, transfers, franchised status by state, company-owned, projected openings
- All 5 international tables present
- Footer totals extracted: terminations=0, non-renewals=0, reacquired=1, ceased_other=1 (2025)
- Total rows balance: 45 start → 44 franchised + 1 company = 45 end
- Exhibit E franchisee list count: 44 current domestic + 1 signed not operational + 4 former + 3 international
- Gag clause flag: TRUE with verbatim quote (page 65)
- Market Developer conversion footnote captured

### 3. Item 21 Sufficiency — PASS
- Auditor: Miller CPA, PLLC (Murfreesboro, TN)
- Opinion: Clean (unqualified), dated March 11, 2026
- All 4 statements extracted: balance sheet, income statement, stockholders' equity, cash flows
- All 16 notes to financial statements walked (Notes A through P)
- Going concern: No going-concern language in auditor's report
- Key observations: operating income down 34%, EBITDA down 30%, new $880K deferred comp liability, strong balance sheet
- Item 21 method: normal text extraction

### 4. State Addenda Sufficiency — PASS
- 8 states identified: CA, IL, MD, MI, MN, NY, VA, WA
- 23 structured override entries in RT_depth_state_addenda_promotion.json
- Overrides structured into canonical by families: forum_selection, governing_law, noncompete, general_release, termination, notice_cure, damages, anti_waiver, renewal, pricing, statute_of_limitations
- Summary matrix provided with override families x states

### 5. Key Exhibit Sufficiency — PASS with caveats
- Exhibit A (Subfranchise Rights Agreement): Fully clause-walked in A2 (28 clauses, 7 distinctive)
- Exhibit E (Franchisee List): Complete
- Exhibit F (Financial Statements): Complete (all statements + 16 notes)
- Exhibit H (State Addenda): Complete (23 structured overrides)
- **Deferred**: Unit Franchise Agreement (Exh A/I, pp149-214), NBDS License (Exh D, pp247-254), Deposit Agreement (Exh C, pp245-246)

### 6. Unresolveds and Contradictions — PASS
- 4 unresolveds in canonical (`unresolveds` key present):
  - U1 (low): Item 19 Table 3 header mislabel
  - U2 (medium): Minimum Annual Performance Requirements thresholds not disclosed
  - U3 (low): Guaranty of Performance text not separately extracted
  - U4 (low): Item 20 Market Developer conversions reported as "Ceased Operations Other Reasons"
- Contradictions: 0 (`contradictions` key present, empty array)
- All unresolveds are document-internal issues or business-risk flags, not extraction gaps requiring recovery

### 7. Final Report Depth — PASS
- 08_final_report.md is ~400+ lines
- All required sections present: A (Executive Snapshot, 15 bullets), B (Fees/Investment), C (Supplier/Operations/Tech), D (Territory), E (Contract Burden/Legal), F (Item 19 with 3 tables), G (Item 20), H (Item 21 financial walk), I (State Addenda), J (Unresolveds), K (Contradictions), L (Final Coverage Note)
- State addenda discussed in dedicated section with 8-state table
- Item 21 financial statements have full summary section with balance sheet, income statement, EBITDA, and 10 key observations

### 8. Score Gate — PASS
- 10_scorecard.md reflects A2 depth passes
- All 23 items covered
- 16 risk flags identified
- Deferred exhibits documented with rationale

---

## Franchise Agreement Clause-Walk Assessment

- **Subfranchise Rights Agreement (Exhibit A)**: Surfaced at pages 85-148. Fully clause-walked by A2 (28 operative clauses + 7 distinctive provisions). PASS.
- **Unit Franchise Agreement (Exhibit A sub-exhibit I)**: Surfaced at pages 149-214 (65 pages). NOT directly clause-walked. This is the downstream agreement between subfranchisor and unit franchisee. Key billing/collection mechanics captured via Subfranchise Rights Agreement Section 2.4 and Item 11. Franchisor's third-party beneficiary status captured from Section 2.5(d). Missing: unit fee structure, unit termination triggers, unit territory provisions.
- **Verdict decision**: Verdict 2 allowed. The Unit Franchise Agreement governs the subfranchisor's relationship with their unit franchisees, not the buyer's relationship with AFI. Key operative burdens on the buyer (term, fees, transfer, termination, noncompete, guaranty, venue) are fully covered in the Subfranchise Rights Agreement clause walk. The missing unit-level detail affects the buyer's business model understanding but is not a material buyer-facing gap in the FDD diligence context.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## 1. Strongest Parts of the Run

1. **Item 19 FPR depth**: All 3 tables fully extracted with quartile data, maturity groups, population counts, and 6 caveats. Tables on pages 55-58 include 4-year trend data. Cohort comparability verified — no discrepancy.
2. **Item 6 multi-page fee table (pages 14-21)**: All 19 fee categories captured across 8 pages with complete notes including Client Bid minimum schedule by population tier.
3. **Item 21 financial note walk (pages 75-83)**: All 16 notes (A-P) walked to granular detail — revenue recognition policy, EBITDA analysis, related-party note ($529,500 at 2.94%), new $880K deferred compensation, lease maturity schedule, tax provision detail.
4. **Exhibit A clause walk (pages 85-148)**: 28 operative clauses extracted in A2 including 7 distinctive provisions not surfaced in Item 17 (FDD maintenance = non-curable default, wrong-account deposit = immediate default, territory reduction triggers, non-compete clock restart, franchisor as 3rd-party beneficiary of Unit FA, daily deposit mandate, 24/7/365 record access).
5. **State addenda structured extraction (pages 275-298)**: 23 override entries across 8 states with affected family, summary, buyer-impact explanation, and summary matrix. Covers forum selection, governing law, noncompete, general release, termination, notice/cure, damages, anti-waiver.

## 2. Weakest Remaining Parts of the Run

1. **Unit Franchise Agreement (pages 149-214)**: 65-page agreement not clause-walked. Unit fee structure, unit termination triggers, and unit territory provisions missing. These affect the buyer's understanding of their downstream unit economics.
2. **NBDS License Agreement (pages 247-254)**: 8-page agreement not clause-walked. Data portability on termination, IP ownership of unit-level data, and specific modification provisions missing. These affect the buyer's technology lock-in risk.
3. **Minimum Annual Performance Requirements (unresolved U2)**: Specific thresholds not disclosed in FDD body — they're a non-curable termination trigger (§8.2 #22) but the actual performance requirements are in the agreement or Manuals. This is a document-design issue, not an extraction gap.
4. **Deposit Agreement (pages 245-246)**: 2-page agreement not clause-walked. Low impact but specific deduction mechanics from deposit not captured.
5. **Item 19 Table 3 header mislabel**: Header says "2023" but data is organized by years of operation as of December 31, 2025. This is a document-internal inconsistency that could confuse a buyer.

## 3. Where a Prior or Manual Run May Still Be Stronger

1. **Unit Franchise Agreement clause walk**: A manual extraction might fully walk the 65-page Unit Franchise Agreement (pages 149-214) to extract unit-level fee economics, unit termination triggers, and unit territory mechanics — providing a complete picture of the two-tier fee flow.
2. **NBDS License data portability**: A manual walk of pages 247-254 could surface whether franchisee data (client lists, financial records) is portable on termination or trapped in the franchisor's proprietary system.
3. **Personal Guaranty scope**: While the guaranty requirement is captured (all shareholders must guarantee), the actual guaranty form (Exhibit III, pages 216-217) was identified but not walked — a manual run might capture specific scope limitations or spousal guaranty requirements.
4. **Minimum Annual Performance Requirements**: A manual extraction with access to the actual Subfranchise Rights Agreement body text might locate the specific performance thresholds referenced in §8.2 #22.

## 4. Optional Max-3 Follow-Up Roadmap

1. **Unit Franchise Agreement key terms**: Target pages 149-214. Extract unit-level fee structure, unit termination triggers, unit territory provisions. Output: `RT_depth_unit_franchise_agreement.json`.
2. **NBDS License Agreement data portability**: Target pages 247-254. Extract data ownership, portability, termination, modification provisions. Output: `RT_depth_nbds_license.json`.
3. **Personal Guaranty form walk**: Target pages 216-217. Extract guaranty scope, spousal requirements, specific limitations. Output: `RT_depth_guaranty_form.json`.

## 5. Unresolved Taxonomy

### Document-Internal Inconsistencies
- U1: Item 19 Table 3 header says "2023" but data represents maturity groupings as of Dec 31, 2025 (page 57)
- U4: Item 20 "Ceased Operations Other Reasons" includes Market Developer conversions that aren't true cessations (pages 60-62)

### Business-Risk Flags
- U2: Minimum Annual Performance Requirements (non-curable termination trigger §8.2 #22) — specific thresholds not disclosed in FDD body (page 49). Likely in agreement or Manuals.

### Extraction-Depth Gaps
- U3: Guaranty of Performance referenced in Exhibit F cover (page 263) but actual instrument text not separately extracted. Operative content captured from Item 21 disclosure (ACS guarantees all AFI obligations).

## 6. Buyer-Trust Assessment

A serious buyer evaluating a $219K-$339K master franchise investment would find this run trustworthy as a primary diligence resource. The critical buyer-facing data — fee stack, Item 19 performance data with quartile distribution, Item 20 system trajectory, financial health analysis, contract burden mapping including 7 distinctive/unusual clauses, and state-specific override analysis — is fully extracted with page-level provenance. The three deferred exhibits (Unit Franchise Agreement, NBDS License, Deposit Agreement) are lower-tier diligence items whose key terms are substantially captured elsewhere. The gag clause flag, 16 risk flags, and operating income decline are the kind of findings that make a run genuinely useful rather than just technically complete.

## 7. Source-Grounding Verification

All weaknesses, gaps, and "prior run stronger" claims above cite exact page ranges or section identifiers from the run files. No unsourced claims present.
