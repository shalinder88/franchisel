# Publish Gate — Trend Hotels and Suites by My Place (638045-2025)

## Verdict: 1 — Publish-Ready

---

## Rationale

This extraction is comprehensive and evidence-grounded. All 23 Items are fully covered. All five Item 20 tables are extracted (all zeros, confirmed). No FPR is provided (confirmed with verbatim statement). Financial statements are fully extracted with all 9 notes structured. State addenda are structured into 30 per-state overrides across 7 override families. Franchise agreement has been analyzed clause-by-clause. Unresolveds and contradictions are preserved as structured families in canonical. The final report is a full narrative diligence document exceeding 400 lines.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided**: No
- **No-FPR statement extracted verbatim**: Yes (page 48-49)
- **Substantiation availability**: N/A (no FPR)
- **Assessment**: PASS — correctly identified as no-FPR brand. Zero Trend outlets have ever operated.

### 2. Item 20 Completeness
- **Table 1 (Systemwide)**: Present, all zeros confirmed
- **Table 2 (Transfers)**: Present, all zeros confirmed
- **Table 3 (Franchised Status)**: Present, all zeros confirmed
- **Table 4 (Company-Owned Status)**: Present, all zeros confirmed
- **Table 5 (Projected Openings)**: Present, all zeros confirmed
- **Total rows balance**: Yes (all zero)
- **Franchisee list exhibit count**: 0 (confirmed from Exhibit D)
- **Gag clause flag**: Set to false (no confidentiality clauses)
- **Assessment**: PASS

### 3. Item 21 Sufficiency
- **Auditor identified**: Yes — Eide Bailly LLP, Aberdeen, SD
- **Income statement extracted**: Yes (3 years)
- **Balance sheet extracted**: Yes (3 years)
- **Cash flow extracted**: Yes (3 years)
- **Notes covered via depth pass**: Yes — 9 notes fully structured in RT_depth_financial_notes.json
- **Going concern status**: Set to false (no going concern language)
- **Assessment**: PASS

### 4. State Addenda Sufficiency
- **State addenda identified**: Yes — 9 states + Michigan Notice (11 total)
- **Absence confirmed**: N/A — addenda exist
- **Structured into canonical**: Yes — `state_addenda_overrides` in 09_final_canonical.json contains override_count, override_families_affected with per-state detail
- **Per-state structured overrides**: Yes — 30 overrides in RT_depth_state_addenda_promotion.json
- **Override families mapped**: Yes — forum_selection, governing_law, noncompete, general_release, termination, damages, renewal
- **Assessment**: PASS

### 5. Key Exhibit Sufficiency
- **Exhibit list from Item 22**: 4 exhibits (C, F, G, H) — all accounted for in 04_exhibits.json
- **All exhibits cataloged**: Yes — 11 exhibits (A through K) in 04_exhibits.json
- **Financial statements deep-read**: Yes
- **Franchise agreement deep-read**: Yes (Depth Pass 2)
- **Guaranty deep-read**: Yes (Depth Pass 2)
- **Assessment**: PASS

### 6. Unresolveds and Contradictions Assessment
- **06_coverage_audit.md contains unresolveds**: Yes (7 items)
- **08_final_report.md contains unresolveds**: Yes (Section J, 7 items)
- **08_final_report.md contains contradictions**: Yes (Section K, 2 items)
- **Canonical has `unresolveds` key**: Yes — 7 entries with id, description, severity, source
- **Canonical has `contradictions` key**: Yes — 2 entries with id, description, items_involved, resolution_status
- **All unresolveds are genuine business-risk flags**: Yes — U1 (zero outlets), U2 (brand viability), U3 (marketing fund), U4 (encroachment), U5 (related parties), U6 (NY investment figure), U7 (Item 3 reference). None are extraction gaps.
- **Assessment**: PASS

### 7. Final Report Depth
- **08_final_report.md line count**: ~400+ lines (full narrative diligence report)
- **Executive snapshot**: Present (15 bullets)
- **Fees/investment**: Present (full fee stack, initial investment table)
- **Supplier/operations/tech**: Present (supplier restrictions, training, technology, marketing fund)
- **Territory**: Present (PA provisions, encroachment)
- **Contract burden/legal**: Present (term, renewal, transfer, termination, noncompete, dispute resolution, litigation)
- **Item 19 detail**: Present (no-FPR confirmed)
- **Item 20 detail**: Present (all tables, trajectory, gag clause)
- **Item 21 detail**: Present (auditor, opinion, key line items, observations)
- **State addenda summary**: Present (Section I, material overrides by state)
- **Unresolveds section**: Present (Section J, 7 items)
- **Contradictions section**: Present (Section K, 2 items)
- **Final coverage note**: Present (Section L)
- **Assessment**: PASS

### 8. Score Gate
- **Overall grade**: A- (10_scorecard.md)
- **All required items covered**: Yes (23/23)
- **Canonical fields populated with evidence grounding**: Yes — all fields have source_section, source_pages, confidence
- **Depth passes completed**: Yes (4/4)
- **Assessment**: PASS

---

## Verdict: 1 — Publish-Ready

No material gaps. All items covered with evidence grounding. All required sections present in the final report with substantive narrative. State addenda structured into canonical. Unresolveds and contradictions preserved. Financial statements fully extracted with depth-pass notes. Contract burdens analyzed clause-by-clause.

No recovery passes needed.
