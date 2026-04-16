# Publish Gate — Boston's The Gourmet Pizza Restaurant & Sports Bar
## Filing ID: 637917-2025

---

## Verdict: 2 — Publish with Caveats

---

## Rationale

The extraction is substantially complete. All 23 items are covered. All critical tables, financial statements, and state addenda have been extracted. The franchise agreement has been deep-read for contract burdens. The canonical JSON contains all mandatory families (unresolveds, contradictions, state_addenda_overrides). Minor caveats exist around financial statement image quality and Exhibit H sub-documents not being deep-read, but these do not materially affect the completeness or accuracy of the extraction for a prospective franchisee's evaluation.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided: Yes
- All 4 tables extracted with population counts, averages, medians, ranges
- Notes and exclusion rules captured
- Substantiation availability statement captured
- No cost/profit data disclosed (documented as limitation, not extraction gap)

### 2. Item 20 Completeness ✅
- All 5 standard tables present (systemwide, transfers, franchised status, company-owned, projected)
- Totals verified internally consistent
- Franchisee list exhibit count: 8 pages (Exhibit E)
- Gag clause: No (explicitly stated)

### 3. Item 21 Sufficiency ✅
- Auditor: Moss Adams LLP, identified
- Income statement: Extracted
- Balance sheet: Extracted
- Cash flow: Extracted
- Notes to financial statements: Covered via A2 Depth Pass 1
- Going concern: Flagged — high severity

### 4. State Addenda Sufficiency ✅
- 16 states identified and read
- All overrides structured into `state_addenda_overrides` family in 09_final_canonical.json
- 45 individual overrides across 13 override families
- Fee deferral states (5) explicitly identified with reason (financial condition)

### 5. Key Exhibit Sufficiency ✅
- All exhibits listed in Item 22 accounted for in 04_exhibits.json
- Financial statements (Exhibit B): Deep-read via rendered images
- Franchise Agreement (Exhibit C): Deep-read via A2 Depth Pass 2
- State Addenda (Exhibit G): Deep-read via A2 Depth Pass 4
- **Caveat**: Exhibit H sub-documents (H-1 through H-8) cataloged but not deep-read. These contain the Franchise Owners Agreement (guaranty), System Protection Agreement, and other ancillary contracts. Key provisions are already summarized in Items 15 and 17.

### 6. Unresolveds and Contradictions ✅
- 5 unresolveds identified (1 high, 3 medium, 1 low)
- All present as structured `unresolveds` family in 09_final_canonical.json
- `contradictions` family present (empty — no material contradictions found)
- All unresolveds are genuine business-risk flags, not extraction gaps

### 7. Final Report Depth ✅
- 08_final_report.md is a full diligence report (~450+ lines)
- Contains all required sections: A (executive snapshot), B (fees/investment), C (supplier/operations/tech), D (territory), E (contract burden/legal), F (Item 19 detail), G (Item 20 detail), H (Item 21 detail), I (state addenda), J (unresolveds), K (contradictions), L (final coverage note)
- Item 21 financial statement summary section present and detailed
- State addenda discussed substantively

### 8. Score Gate ✅
- Overall grade: B- (appropriate given going concern and financial condition)
- All required items covered
- Canonical fields populated with evidence grounding

---

## Caveats

1. **Financial statement image quality**: Exhibit B pages are image-based. Key figures extracted from pdftoppm-rendered images at 200 DPI. Some values may be approximate, though internally consistent. The 2023 partners' capital figure shows minor ambiguity between balance sheet and equity rollforward.

2. **Exhibit H sub-documents**: H-1 through H-8 (Franchise Owners Agreement, System Protection Agreement, Confidentiality/Noncompete, ACH, lease addendum, technology agreements) cataloged but not deep-read. Key provisions already captured from Items 15, 17, and the franchise agreement depth pass. Not buyer-misleading.

3. **Exhibit D (Area Development Agreement)**: Cataloged but not clause-by-clause analyzed. Key provisions captured from Item 17 tables. Most prospective franchisees are single-unit operators.

---

## Recovery Passes Needed: None

No material gaps requiring focused recovery. Verdict is 2 (publish with caveats), not 3 (needs recovery).
