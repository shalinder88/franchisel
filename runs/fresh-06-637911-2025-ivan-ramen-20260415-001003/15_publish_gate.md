# Publish Gate — Ivan Ramen Franchising LLC (637911-2025)

## Verdict: 1 — Publish-ready

No material gaps. All 23 items covered. All required sections present in final report. Evidence grounded throughout. Canonical families enforced. State addenda structured.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅ PASS

- **FPR status:** No FPR made — confirmed
- **No-FPR statement extracted:** Yes — "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets" (p. 56)
- **Substantiation availability:** Captured — if purchasing existing outlet, actual records may be provided
- **Final report coverage:** Section F devoted entirely to Item 19, documenting the absence and noting it as material for a $1M+ investment

### 2. Item 20 Completeness ✅ PASS

- **Standard tables:** All 5 present (T05 Systemwide, T06 Transfers, T07 Franchised Status, T08 Company-Owned Status, T09 Projected Openings) — verified in 03_tables.json
- **Balance check:** Totals balance across all tables
- **Franchisee list:** Exhibit F count captured (1 entry: Venetian Las Vegas Gaming LLC)
- **Gag clause flag:** Set to false ("no current or former franchisees have signed confidentiality clauses")
- **Final report coverage:** Section G covers all tables with multi-year trajectory, franchised/company-owned activity, projections, and confidentiality clause flag

### 3. Item 21 Sufficiency ✅ PASS

- **Auditor identified:** BMKR LLP, CPA (Hauppauge, NY)
- **Financial statements extracted:** Balance sheet, income statement, cash flow for all 3 years (FY 2022-2024) — verified in 03_tables.json (T10-T16)
- **Notes to financial statements:** Covered in RT_depth_financial_notes.json (7 accounting policies, 7 material notes)
- **Going-concern status:** Set — unqualified opinion, no going-concern emphasis paragraph (confirmed via image rendering of pp. 275-276)
- **Final report coverage:** Section H covers auditor, opinion type, 3-year financial data table, key observations (leverage, cash trajectory, related party, revenue recognition)

### 4. State Addenda Sufficiency ✅ PASS

- **All state addenda identified:** 8 states (CA, HI, IL, IN, MD, NY, ND, WI) — in 04_exhibits.json and RT_depth_state_addenda_promotion.json
- **Structured into canonical:** Yes — `state_addenda_overrides` family present in 09_final_canonical.json with override_summary_table covering 9 override families across 8 states
- **Override families structured per-state:** Yes — 32 individual overrides with state, affected_family, override_summary, why_it_matters, source_pages
- **Fee deferral states identified:** IL, MD, ND — critical finding documented
- **Final report coverage:** Section I covers all 8 states with material overrides

### 5. Key Exhibit Sufficiency ✅ PASS

- **All exhibits accounted:** 9 FDD-level exhibits (A-I) cataloged in 04_exhibits.json with page ranges and sub-exhibits
- **Financial exhibits deep-read:** Yes — all 3 years of statements + notes extracted + auditor opinion confirmed via image
- **Franchise Agreement:** Structure cataloged; key terms captured from Item 17; contract burdens deep-read in RT_depth_contract_burdens.json
- **Guaranty exhibit:** Scope documented (5%+ owners, spousal exemption)

### 6. Unresolveds and Contradictions ✅ PASS

- **Unresolveds in audit/report:** 4 unresolveds identified in 08_final_report.md Section J
- **Structured in canonical:** Yes — `unresolveds` family present in 09_final_canonical.json with 4 entries (U1-U4), each with id, description, severity, source
- **Contradictions in report:** 3 contradictions identified in Section K
- **Structured in canonical:** Yes — `contradictions` family present with 3 entries (C1-C3), each with id, description, items_involved, resolution_status
- **Genuine business-risk flags:** All 4 unresolveds are business-risk flags, not extraction gaps:
  - U1 (UK franchise status) — information not disclosed in FDD, cannot be extracted
  - U2 (going-concern evaluation) — confirmed no emphasis paragraph; residual uncertainty is interpretive
  - U3 (franchisor's ability to perform) — documented with state regulator corroboration; not an extraction gap
  - U4 (affiliate financial health) — affiliate financials not disclosed; cannot be extracted

### 7. Final Report Depth ✅ PASS

- **Line count:** 335 lines — substantial narrative report
- **Required sections present:**
  - A. Executive snapshot (13 numbered bullets) ✅
  - B. Fee stack, entry structure, investment ✅
  - C. Supplier control, operations, tech, marketing fund ✅
  - D. Territory, competition, channels, encroachment ✅
  - E. Contract burden/legal mechanics ✅
  - F. Item 19 (no FPR — documented) ✅
  - G. Item 20 outlet data ✅
  - H. Item 21 financial statements ✅
  - I. State addenda summary ✅
  - J. Unresolveds ✅
  - K. Contradictions ✅
  - L. Final coverage note ✅
- **Not a concise metrics summary:** Confirmed — full narrative diligence report

### 8. Score Gate ✅ PASS

- **Overall assessment:** 100% item coverage, 16 tables, 9 exhibits, 8 state addenda, 4 depth passes, 32 structured state overrides, 4 unresolveds, 3 contradictions
- **Canonical fields populated with evidence:** All fields have source_section, source_pages, and confidence ratings
- **All required items covered:** 23/23

---

## Recovery Passes Needed

None. Extraction is publish-ready.
