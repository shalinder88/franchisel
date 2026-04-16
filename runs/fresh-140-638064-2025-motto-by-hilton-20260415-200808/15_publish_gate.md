# Publish Gate — Motto by Hilton (638064-2025)

## Verdict: 2 — Publish with Caveats

## Rationale
The extraction is comprehensive and evidence-grounded. All 23 items are fully covered. All material tables are extracted. Financial statements are complete with notes. State addenda are structured into canonical. Depth passes have added contract burden analysis, financial note depth, narrative promotions, and state addenda overrides. The remaining gaps are minor and do not constitute buyer-misleading omissions.

## Item-by-Item Assessment

### 1. Item 19 Completeness ✓
- No FPR provided. The no-FPR statement is extracted verbatim.
- Substantiation contact (William Fortier) is captured.
- This is complete.

### 2. Item 20 Completeness ✓
- All 5 standard tables present: systemwide summary, transfers, franchised status, company-owned status, projected openings.
- Total rows balance across all tables.
- Franchisee list exhibit count captured (13 hotels in Exhibit A).
- Gag clause flag set: YES.
- This is complete.

### 3. Item 21 Sufficiency ✓
- Auditor identified: Cherry Bekaert (CBH).
- Income statement, balance sheet, cash flow all extracted.
- Notes to financial statements covered (9 notes, via depth pass 1).
- Going-concern status: None.
- Key observation: entity covers ALL Hilton brands, not just Motto. This is clearly noted.
- This is complete.

### 4. State Addenda Sufficiency ✓
- State addenda exist in Exhibits D-1 and J-1.
- 11 states identified with addenda.
- Addenda are STRUCTURED into `state_addenda_overrides` in 09_final_canonical.json.
- 30 overrides across 7 override families are structured per-state.
- Summary table of override families × states is present.
- This is complete.

### 5. Key Exhibit Sufficiency ✓
- All exhibits from Item 22 are accounted for in 04_exhibits.json.
- Financial statements (Exhibit C) fully deep-read.
- Franchise Agreement (Exhibit D) key provisions extracted via cross-references and depth pass 2.
- Guaranty (Exhibit E) scope extracted in depth pass 2.
- This is complete.

### 6. Unresolveds and Contradictions ✓
- 06_coverage_audit.md lists 7 unresolveds and 1 contradiction.
- 08_final_report.md has dedicated sections J (Unresolveds, 7 items) and K (Contradictions, 2 items).
- 09_final_canonical.json has `unresolveds` key (7 entries) and `contradictions` key (2 entries).
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - Marketing fund transparency
  - No FPR
  - Early-stage brand risk
  - Debt guarantee
  - Boilerplate inconsistency
  - Date typo
  - Gag clause
- No extraction gap retries needed.
- This is complete.

### 7. Final Report Depth ✓
- 08_final_report.md is a full diligence report (400+ lines).
- Contains all required sections: A (executive snapshot), B (fees/investment), C (supplier/ops/tech), D (territory), E (contract/legal), F (Item 19), G (Item 20), H (Item 21), I (state addenda), J (unresolveds), K (contradictions), L (coverage note).
- Not a concise metrics summary — substantive narrative throughout.
- This is complete.

### 8. Score Gate ✓
- 10_scorecard.md overall grade: A- (upgraded from B+ after depth passes).
- All required items covered.
- Canonical fields populated with evidence grounding.
- This is complete.

## Caveats (minor, not buyer-misleading)
1. **Exhibit B content:** Exhibit B (terminated/cancelled list) was cataloged but not deep-read for individual entries. Given Item 20 tables show zero terminations/cancellations in 2024, this is not material.
2. **HITS Agreement detail:** Exhibit G (35-page HITS Agreement) was not walked clause-by-clause. Key technology terms are captured via Items 9/11 cross-references. Full HITS detail is rarely buyer-relevant.
3. **Lender Comfort Letter detail:** Exhibit K (25 pages) was cataloged but not extracted. This is a template document, not buyer-critical data.

## Recovery Passes Needed
**None.** No material gaps require focused recovery.
