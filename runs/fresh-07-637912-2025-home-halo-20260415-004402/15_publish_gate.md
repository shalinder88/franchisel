# Publish Gate — Home Halo (637912-2025)

## Verdict: 1 — Publish-ready

No material extraction gaps. All items covered. All evidence grounded. Business risks are documented as unresolveds, not as extraction gaps.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided**: YES
- **All tables extracted**: YES — Tables 1 (outlet descriptions), 2 (financial data with 2 years), 3 (operational metrics)
- **All footnotes extracted**: YES — Footnotes 1–6 with full detail
- **Population counts**: YES — 1 Operational Company-Owned Outlet (Urbandale, Iowa), 1 excluded (Albuquerque, NM)
- **Exclusion rules**: YES — NM excluded because not operational full calendar year
- **Caveats documented**: YES — 7 critical caveats including single outlet, market size mismatch, VA client concentration, management advantage, non-GAAP
- **Substantiation statement**: YES — "Written substantiation available upon reasonable request"
- **PASS**

### 2. Item 20 Completeness
- **All 5 tables present**: YES — Systemwide summary, Transfers, Franchised status, Company-owned status, Projected openings
- **Total rows balance**: YES (all zeros for franchised; company-owned math checks)
- **Note**: Table 1 net change for 2024 Total Outlets shows +2 but arithmetic suggests +1 — preserved as unresolved U5
- **Franchisee list exhibit count**: YES — Exhibit F: "There are no franchisees to report"
- **Gag clause flag**: YES — "No confidentiality clauses"
- **PASS**

### 3. Item 21 Sufficiency
- **Auditor identified**: YES — Roos & McNabb CPA's, PC (Fresno, CA)
- **Income statement**: YES — extracted with all line items
- **Balance sheet**: YES — extracted with all line items
- **Cash flow**: YES — extracted with all line items
- **Notes covered**: YES — All 4 notes + accounting policies via depth pass
- **Going concern**: NO going concern language (correctly flagged)
- **Financial observations**: YES — 7 key observations including thin capitalization, cover page risk flag
- **PASS**

### 4. State Addenda Sufficiency
- **All addenda identified**: YES — 13 states
- **Structured into canonical**: YES — `state_addenda_overrides` family present in 09_final_canonical.json and 12_canonical_enriched_v2.json
- **Override families structured per-state**: YES — 7 families (forum_selection, governing_law, noncompete, general_release, termination, damages, interest_rate) with states listed for each
- **33 individual structured overrides**: YES — with state, affected_family, override_summary, why_it_matters, source_pages
- **PASS**

### 5. Key Exhibit Sufficiency
- **All Item 22 exhibits accounted in 04_exhibits.json**: YES — 10 exhibits A–J
- **Financial exhibits deep-read**: YES — Exhibit D fully extracted + depth pass
- **Franchise Agreement deep-read**: YES — Exhibit E read via depth pass 2 (contract burdens)
- **Guaranty exhibit identified**: YES — Exhibit 1 (Owner and Spouse Agreement and Guaranty, pages 143–160)
- **PASS**

### 6. Unresolveds and Contradictions Assessment
- **Unresolveds in 06_coverage_audit.md**: YES — 5 items
- **Unresolveds in 08_final_report.md**: YES — Section J with 5 items
- **Unresolveds in canonical**: YES — 7 items (2 added via depth pass)
- **Contradictions in canonical**: YES — 2 items
- **All as structured families in 09_final_canonical.json**: YES — `unresolveds` and `contradictions` keys present
- **All genuine business-risk flags (not extraction gaps)**: YES
  - U1: Date typo (low) — editorial issue
  - U2: Fee cap contradiction (medium) — source document issue, resolved by FA Article 5.D.
  - U3: Financial viability (high) — business risk, flagged on cover page
  - U4: Unregistered trademarks (high) — business risk, flagged on cover page
  - U5: Table 1 math (low) — source document issue
  - U6: Missing related party note (medium) — potential auditor/disclosure gap
  - U7: Amort/Depreciation inconsistency (low) — minor financial statement issue
- **No extraction gaps requiring A4**: CONFIRMED
- **PASS**

### 7. Final Report Depth
- **08_final_report.md line count**: ~400+ lines
- **Executive snapshot**: YES — 13 numbered bullets
- **Fees/investment**: YES — Section B with complete fee stack, both investment tables
- **Supplier/operations/tech**: YES — Section C covering supplier restrictions, training (108h), technology, marketing fund
- **Territory**: YES — Section D covering protection, reserved rights, channels
- **Contract burden/legal**: YES — Section E covering term/renewal, transfer, termination, noncompete, dispute resolution, litigation
- **Item 19 detail**: YES — Section F with full tables, caveats, cost build-up analysis
- **Item 20 detail**: YES — Section G with trajectory, activity, projections
- **Item 21 detail**: YES — Section H with all statements, key observations
- **State addenda summary**: YES — Section I with material overrides for all 13 states
- **Unresolveds section**: YES — Section J with 5 items
- **Contradictions section**: YES — Section K with 2 items
- **Final coverage note**: YES — Section L with fully surfaced vs. not directly surfaced
- **PASS**

### 8. Score Gate
- **Overall grade**: A
- **All required items covered**: YES (23/23)
- **All canonical fields with evidence grounding**: YES
- **PASS**

---

## Rationale

This extraction is thorough and complete. The Home Halo FDD is a relatively straightforward document — a young franchise system (formed March 2024) with zero franchisees, 2 company-owned outlets, and limited complexity. All material data has been faithfully extracted with page-level provenance. All uncertainties and contradictions have been preserved. The four A2 depth passes added financial note accounting policies, 18-article contract burden analysis, 8 promoted facts, and 33 structured state addenda overrides across 13 states.

The primary risks are business risks (extreme thin capitalization at $29,513 total assets, unregistered trademarks, zero franchisees, sole principal) rather than extraction gaps. These are properly documented as unresolveds.

No recovery passes needed.
