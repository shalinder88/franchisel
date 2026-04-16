# Publish Gate: Cookie Advantage, Inc. — 637906-2025

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All mandatory canonical families present.

---

## Rationale

This extraction is comprehensive and complete. All 23 FDD items have been fully read and extracted. All 10 exhibits have been cataloged and their material contents processed. Financial statements were rendered from scanned images and all values cross-verified. Four depth passes have been completed (financial notes, contract burdens, narrative-to-canonical promotion, state addenda structured promotion). All mandatory canonical families (unresolveds, contradictions, state_addenda_overrides) are present in 09_final_canonical.json.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **FPR provided**: Yes
- **All tables extracted**: Yes — single FPR table with 5 metrics
- **Notes extracted**: Yes — all 3 notes including Gross Revenue definition, calculation methodology, no-cost-data caveat
- **Population counts**: Yes — 17 Franchised Outlets, calendar year 2024
- **Exclusion rules**: None — all franchised outlets included
- **Substantiation statement**: Yes — "Written substantiation available upon reasonable request"
- **Assessment**: PASS

### 2. Item 20 Completeness
- **5 standard tables**: Yes — Systemwide Summary, Transfers, Franchised Status, Affiliate-Owned Status, Projected Openings
- **Total rows balance**: Yes — franchised: 19→17 (2 reacquired). Company: 4→6 (2 reacquired). Total: 23→23.
- **Franchisee list exhibit count**: Yes — 8 current franchisees (17 outlets), 2 former franchisees. Referenced in Exhibit F.
- **Gag clause flag**: Yes — "No confidentiality provisions restricting franchisee speech in last 3 fiscal years."
- **Assessment**: PASS

### 3. Item 21 Sufficiency
- **Auditor identified**: Yes — Morse & Co., Tulsa, Oklahoma
- **Income statement extracted**: Yes — 3 years (2024, 2023, 2022)
- **Balance sheet extracted**: Yes — 2 years (2024, 2023)
- **Cash flow extracted**: Yes — 3 years (2024, 2023, 2022)
- **Notes covered**: Yes — all 5 notes extracted in depth pass (RT_depth_financial_notes.json)
- **Going concern**: Not present (clean opinion)
- **Assessment**: PASS

### 4. State Addenda Sufficiency
- **All state addenda identified**: Yes — 16 states in Exhibit G
- **Structured into canonical**: Yes — `state_addenda_overrides` family present in 09_final_canonical.json with 42 overrides across 9 override families
- **Per-state detail**: Yes — RT_depth_state_addenda_promotion.json contains state, affected_family, override_summary, why_it_matters, source_pages for each override
- **Assessment**: PASS

### 5. Key Exhibit Sufficiency
- **All Item 22 exhibits accounted for**: Yes — Exhibit C (FA), Exhibit G (State Addenda), Exhibit H (Contracts) all cataloged in 04_exhibits.json
- **Financial exhibits deep-read**: Yes — Exhibit B rendered and extracted
- **Franchise agreement deep-read**: Yes — key provisions extracted in RT_depth_contract_burdens.json
- **Guaranty exhibit deep-read**: Yes — Attachment 3 (Owners Agreement) addressed
- **Assessment**: PASS

### 6. Unresolveds and Contradictions
- **Unresolveds in audit/report**: Yes — 5 unresolveds identified
- **Structured in canonical**: Yes — `unresolveds` key present in 09_final_canonical.json with 5 entries
- **Contradictions in audit/report**: Yes — 1 contradiction (cosmetic)
- **Structured in canonical**: Yes — `contradictions` key present in 09_final_canonical.json with 1 entry
- **All genuine business-risk flags**: Yes — no extraction gaps among unresolveds
- **Assessment**: PASS

### 7. Final Report Depth
- **08_final_report.md line count**: ~450+ lines
- **Required sections present**:
  - A. Executive snapshot (14 bullets): Yes
  - B. Fees/investment: Yes (detailed fee stack, investment breakdown)
  - C. Supplier/operations/tech: Yes
  - D. Territory: Yes
  - E. Contract burden/legal: Yes (term, renewal, termination, transfer, noncompete, dispute)
  - F. Item 19 detail: Yes (table, distribution analysis, caveats)
  - G. Item 20 detail: Yes (trajectory, activity tables, projected openings, gag clause)
  - H. Item 21 detail: Yes (auditor, all statements, key observations)
  - I. State addenda summary: Yes (16 states, per-state overrides)
  - J. Unresolveds: Yes (5 entries with severity)
  - K. Contradictions: Yes (1 entry)
  - L. Final coverage note: Yes
- **Assessment**: PASS

### 8. Score Gate
- **10_scorecard.md grade**: A
- **All required items covered**: Yes (23/23)
- **Canonical fields populated with evidence**: Yes
- **Depth passes complete**: Yes (4/4)
- **Assessment**: PASS

---

## Recovery Passes Needed
None. All checklist items pass.
