# Publish Gate — Sweat440 FDD 2025

**Filing**: 637910-2025 | **Brand**: Sweat440  
**Gate Date**: 2026-04-15

---

## VERDICT: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. All mandatory canonical families present.

---

## Rationale

This extraction is comprehensive. All 23 FDD items are fully extracted. Item 19 is rich with 5 parts including revenue data, parent P&L, member counts, pricing tiers, and presale member counts — all with computed statistics. Item 20 has all 5 tables. Item 21 financial statements are fully extracted with all 8 notes depth-analyzed. Seven state addenda are structured into 27 overrides across 13 override families. The final report is 491 lines with all required sections. Five unresolveds and four contradictions are properly documented and promoted to canonical.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅

- **FPR provided**: Yes — 5 parts
- **Part 1**: 17 studios with annual revenue, monthly average, min, max, median. All rows extracted.
- **Part 2**: 2 parent studios with full P&L (16 line items each including imputed royalty and adjusted EBITDA). All 15 notes extracted.
- **Part 3**: 22 studios with member counts. All rows extracted.
- **Part 4**: 3 pricing tiers across 6 member-count brackets. Full table extracted.
- **Part 5**: 22 studios with members at opening. Full table extracted.
- **Population counts**: 17 (Part 1), 22 (Parts 3, 5). Exclusion rules documented (1 temporarily closed, 5 opened in 2024, 1 closed in 2024).
- **Substantiation statement**: Captured — "Written substantiation...will be made available...upon reasonable request."
- **Aggregate statistics**: Computed in retry_R3.json (mean, median, quartiles, franchisee-only stats).
- **Notes**: All 4 Item 19 notes captured verbatim.

### 2. Item 20 Completeness ✅

- **Table 1 (System Summary)**: ✅ Present with 3 years, all studio types
- **Table 2 (Transfers)**: ✅ Present — 0 transfers in all years
- **Table 3 (Franchised Status)**: ✅ Present — 6 states × 3 years with all columns
- **Table 4 (Company-Owned Status)**: ✅ Present (via retry_R1.json) — 3 states × 3 years
- **Table 5 (Projected Openings)**: ✅ Present — 4 states with signed-not-open and projected
- **Total rows balance**: ✅ Verified — Table 1 totals match Tables 3+4 aggregates
- **Franchisee list exhibit**: ✅ 17 open locations + 5 signed-not-open groups + 1 former franchisee
- **Gag clause flag**: ✅ Set to false — "no current or former franchisees have signed confidentiality clauses"

### 3. Item 21 Sufficiency ✅

- **Auditor identified**: Location confirmed (Melville, NY). Firm name not captured from text layer (letterhead image) — documented as low-severity unresolved. Not a material gap.
- **Income statement**: ✅ Extracted with 3 periods (14-mo 2024, FY 2023, FY 2022)
- **Balance sheet**: ✅ Extracted with 2 periods (Dec 31 2024, Oct 31 2023)
- **Cash flow**: ✅ Extracted with 3 periods
- **Notes to financials**: ✅ All 8 notes depth-extracted in RT_depth_financial_notes.json
- **Going concern**: ✅ Set — no going concern language in audit report
- **Opinion type**: ✅ Unqualified (clean)
- **Fiscal year change**: ✅ Documented (Oct 31 → Dec 31)

### 4. State Addenda Sufficiency ✅

- **States identified**: 7 (CA, IL, MD, MN, NY, VA, WA)
- **Structured into canonical**: ✅ `state_addenda_overrides` present in 09_final_canonical.json and 12_canonical_enriched_v2.json
- **27 individual overrides** across **13 override families**: forum_selection, governing_law, noncompete, general_release, termination, notice_cure, damages, fee_deferral, fair_pricing, buyback, indemnification, anti_waiver, limitation_of_actions
- **Per-state detail**: ✅ Each state's material overrides individually documented with source pages in RT_depth_state_addenda_promotion.json
- **Summary table**: ✅ Override families × states matrix provided

### 5. Key Exhibit Sufficiency ✅

- **Item 22 references**: Franchise Agreement (Exhibit B), Multi-Unit Development Agreement (Exhibit C), State Addenda (Exhibit F). All accounted for.
- **Exhibit A (Financial)**: ✅ Deep-read (17 pages, all statements and notes)
- **Exhibit B (Franchise Agreement)**: ✅ Substantively extracted via Item 17 tables and targeted reads; contract burdens depth-analyzed in RT_depth_contract_burdens.json (14 categories, 6 distinctive clauses)
- **Exhibit C (MUD)**: ✅ Key terms via Item 17 MUD table; Sections 12-15 read for non-compete, transfer, termination
- **Exhibit D (Franchisee List)**: ✅ Current and former franchisees extracted
- **Exhibit E (State Administrators)**: ✅ Cataloged
- **Exhibit F (State Addenda)**: ✅ All 7 states depth-analyzed
- **Exhibit G (Effective Dates/Receipts)**: ✅ Effective dates for 9 states extracted

### 6. Unresolveds and Contradictions ✅

- **Unresolveds in 08_final_report.md**: 5 items documented (Section J)
- **Contradictions in 08_final_report.md**: 4 items documented (Section K)
- **Structured in canonical**: ✅ Both `unresolveds` (5 entries) and `contradictions` (4 entries) present as top-level keys in 09_final_canonical.json
- **Business-risk flags vs extraction gaps**:
  - U01 (auditor name): Extraction gap but low severity — available from image
  - U02 (TN table discrepancy): Business interpretation issue, not extraction gap
  - U03 (fees receivable netting): Business risk flag — broker arrangement unclear
  - U04 (parent salary costs): Business risk flag — may not reflect franchisee reality
  - U05 (NJ pipeline concentration): Business risk flag — high severity
- **A4 needed**: No. U01 is the only extraction gap and is low severity (auditor location confirmed).

### 7. Final Report Depth ✅

- **Line count**: 491 lines — substantive
- **Sections present**:
  - A. Executive Snapshot (14 numbered bullets) ✅
  - B. Fee Stack, Entry Structure, Initial Investment ✅
  - C. Supplier Control, Operations, Training, Tech ✅
  - D. Territory, Competition, Channels, Encroachment ✅
  - E. Contract Burden and Legal Mechanics ✅
  - F. Item 19 — Financial Performance Representations ✅
  - G. Item 20 — Outlet Data ✅
  - H. Item 21 — Financial Statements ✅
  - I. State Addenda Summary ✅
  - J. Unresolveds ✅
  - K. Contradictions ✅
  - L. Final Coverage Note ✅
- **All required sections present and substantive**: Yes

### 8. Score Gate ✅

- **Coverage score**: 98/100
- **All 23 items**: Covered
- **All 7 exhibits**: Covered
- **Depth passes**: 4 completed
- **Canonical families enforced**: unresolveds, contradictions, state_addenda_overrides all present
- **Evidence grounding**: All canonical fields have source_section and source_pages in 05_canonical.json

---

## Recovery Passes Needed

**None.** Verdict is 1 (Publish-Ready).

The one minor gap (auditor firm name, U01) is documented as a low-severity unresolved. The auditor's location (Melville, NY) and audit date (March 11, 2025) are confirmed. The opinion type (unqualified) is fully extracted. This does not rise to a material gap requiring A4 recovery.
