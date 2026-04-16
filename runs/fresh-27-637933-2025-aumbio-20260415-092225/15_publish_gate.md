# Publish Gate — AumBio Franchising, LLC (637933-2025)

## Verdict: **2 — Publish with caveats**

Minor gaps documented but not buyer-misleading. All material items fully extracted. Caveats relate to FDD-internal data inconsistencies (not extraction failures).

---

## Rationale

This extraction covers all 23 FDD items with substantive detail, all 5 Item 20 tables, audited financial statements fully extracted via rendered images, comprehensive state addenda analysis (13 states, 32 structured overrides), clause-by-clause contract burden analysis, and a full narrative diligence report. The extraction identified genuine FDD data inconsistencies (Item 20 Table 3 arithmetic discrepancy, typographical errors) which have been properly flagged as unresolveds rather than silently ignored.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- No FPR provided. The no-FPR statement is extracted verbatim: "We do not make any representations about a Franchisee's future financial performance..."
- Substantiation availability: N/A (no FPR).
- This is complete and accurate.

### 2. Item 20 Completeness — PASS (with caveat)
- All 5 standard tables present: systemwide summary, transfers, franchised status, company-owned status, projected openings.
- **Caveat:** Table 3 has an arithmetic discrepancy (1 at start of 2024, 0 at end, all activity columns 0). Properly flagged as UNRESOLVED. This is a data inconsistency within the FDD, not an extraction gap.
- Franchisee list: Exhibit E — NONE. Confirmed.
- Gag clause flag: No confidentiality clauses signed. ✓
- Table 1 has a typo ("2014" instead of "2024"). Flagged.

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Muhammad Zubairy, CPA PC, Westbury, NY. ✓
- Income statement extracted with all line items. ✓
- Balance sheet extracted with all line items. ✓
- Cash flow statement extracted with all line items. ✓
- Notes to financial statements covered via depth pass 1. ✓
- Going-concern status: Auditor evaluated but opinion is clean (unqualified). ✓
- Financial statements were image-only; rendered via pdftoppm successfully.

### 4. State Addenda Sufficiency — PASS
- 13 states identified and extracted. ✓
- Structured into `state_addenda_overrides` in 09_final_canonical.json. ✓
- 32 structured overrides across 7 override families (forum_selection, governing_law, noncompete, general_release, termination, damages, general). ✓
- Summary table of override families x states included. ✓

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json. ✓
- Franchise Agreement: Deep-read via contract burden depth pass. ✓
- Financial statements: Fully extracted via rendered images. ✓
- Guaranty: Identified in Schedule D; unlimited personal guaranty for all equity holders. ✓
- MUDA: Identified and key provisions extracted. ✓

### 6. Unresolveds and Contradictions Assessment — PASS
- 5 unresolveds identified (1 medium, 4 low). All present as structured `unresolveds` family in 09_final_canonical.json. ✓
- 1 contradiction identified (Table 1 vs Table 3). Present as structured `contradictions` family in 09_final_canonical.json. ✓
- All unresolveds are genuine FDD data inconsistencies, not extraction gaps. No recovery needed.
- No extraction-gap unresolveds requiring A4 recovery.

### 7. Final Report Depth — PASS
- 08_final_report.md is a comprehensive narrative diligence report with all required sections:
  - A. Executive snapshot (14 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operating control, technology burden ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 — Financial performance representations ✓
  - G. Item 20 — Outlet data ✓
  - H. Item 21 — Financial statements ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓
- Report is comprehensive (~400+ lines). Not a concise metrics summary. ✓

### 8. Score Gate — PASS
- 10_scorecard.md shows overall grade B+. ✓
- All 23 items covered. ✓
- All canonical fields populated with evidence grounding. ✓
- Depth passes completed and reflected in scorecard. ✓

---

## Caveats for Publication

1. **Item 20 Table 3 arithmetic discrepancy:** Extraction is accurate — the FDD itself contains this inconsistency. Flagged in unresolveds.
2. **Financial statements are image-only:** Extracted via pdftoppm rendering. Dollar amounts are small and clearly readable but were not machine-parseable from the PDF text layer.

## Recovery Passes Needed

**None.** All identified issues are FDD-internal data inconsistencies, not extraction gaps. No A4 focused recovery is required.
