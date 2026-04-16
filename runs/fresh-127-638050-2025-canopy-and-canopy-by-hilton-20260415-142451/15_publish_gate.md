# Publish Gate — Canopy by Hilton (638050-2025)

## Verdict: 1 — Publish-ready

---

## Rationale

This extraction is comprehensive and publish-ready. All 23 FDD items have been fully extracted with material substance. Financial statements are deep-read with all notes. Contract burdens are extracted clause-by-clause. State addenda for 11 states are structured into override families. Unresolveds and contradictions are preserved in canonical. The final report is a full diligence narrative (~400 lines) suitable for standalone reading.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided:** No
- **No-FPR statement extracted verbatim:** Yes — "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets."
- **Substantiation availability:** Yes — Contact information for reporting unauthorized FPR extracted
- **Status:** PASS

### 2. Item 20 Completeness
- **All 5 standard tables present:** Yes
  - Table 1: Systemwide summary (2022-2024) ✓
  - Table 2: Transfers (2022-2024) ✓
  - Table 3: Franchised status by state (2022-2024) ✓
  - Table 4: Company-owned status (2022-2024) ✓
  - Table 5: Projected openings ✓
- **Total rows balance:** Yes — 27 franchised, 0 company-owned at end 2024
- **Franchisee list exhibit count:** 27 open + 10 signed not opened = 37 total listed in Exhibit A
- **Gag clause flag:** Yes — set and documented
- **Status:** PASS

### 3. Item 21 Sufficiency
- **Auditor identified:** Yes — Cherry Bekaert (CBH)
- **Income statement extracted:** Yes — 3 years (2022-2024)
- **Balance sheet extracted:** Yes — 2 years (2024, 2023)
- **Cash flow extracted:** Yes — 3 years (2022-2024)
- **Notes covered via depth pass:** Yes — all 9 notes extracted (RT_depth_financial_notes.json)
- **Going-concern status set:** Yes — no going concern issues
- **Status:** PASS

### 4. State Addenda Sufficiency
- **All state-specific addenda identified:** Yes — 11 states (CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA)
- **Structured into state_addenda_overrides:** Yes — 36 overrides across 7 families in canonical
- **Override families covered:** forum_selection, governing_law, general_release, termination, damages, renewal, noncompete
- **Summary table present:** Yes — in RT_depth_state_addenda_promotion.json
- **Status:** PASS

### 5. Key Exhibit Sufficiency
- **All Item 22 contracts accounted for:** Yes — D, D-2, D-3, E, F, G, K all cataloged in 04_exhibits.json
- **Financial exhibit deep-read:** Yes — Exhibit C fully extracted
- **Franchise agreement deep-read:** Yes — via Item 17 + RT_depth_contract_burdens.json
- **Guaranty exhibit:** Referenced in contract burden pass; scope documented
- **Status:** PASS

### 6. Unresolveds and Contradictions
- **Unresolveds in canonical:** Yes — 6 items with severity and source
- **Contradictions in canonical:** Yes — 2 items with resolution status
- **All unresolveds are genuine business-risk flags:** Yes
  - U1 (territory negotiability): genuine business risk
  - U2 (management fee): undisclosed range
  - U3 (PIP requirements): undisclosed
  - U4 (insurance requirements): in confidential Manual
  - U5 (Restaurant Brand details): deferred to exhibit
  - U6 (date discrepancy): likely typo in source
- **No extraction gaps requiring A4 recovery**
- **Status:** PASS

### 7. Final Report Depth
- **Full diligence report:** Yes — 08_final_report.md is a comprehensive narrative
- **Required sections present:**
  - A. Executive snapshot (13 numbered bullets) ✓
  - B. Fees/investment (fee stack, initial investment table) ✓
  - C. Supplier/operations/tech (restrictions, training, technology stack) ✓
  - D. Territory (protected territory, channels, encroachment) ✓
  - E. Contract burden/legal (term, renewal, transfer, termination, noncompete, disputes) ✓
  - F. Item 19 detail (no FPR, verbatim statement) ✓
  - G. Item 20 detail (multi-year trajectory, activity, projected openings, gag clause) ✓
  - H. Item 21 detail (auditor, BS/IS/CF, key observations) ✓
  - I. State addenda summary ✓
  - J. Unresolveds (6 items with severity) ✓
  - K. Contradictions (2 items with resolution status) ✓
  - L. Final coverage note ✓
- **Report length:** ~400+ lines — adequate depth
- **Status:** PASS

### 8. Score Gate
- **Overall grade:** A- (upgraded from B+ after A2 depth passes)
- **All required items covered:** Yes — 23/23
- **Canonical fields populated with evidence grounding:** Yes — all fields have source_section, source_pages, confidence
- **Status:** PASS

---

## Recovery Passes Needed

**None.** All checklist items pass. No material gaps identified that require A4 focused recovery.
