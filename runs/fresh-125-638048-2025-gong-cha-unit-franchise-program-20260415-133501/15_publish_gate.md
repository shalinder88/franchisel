# Publish Gate — Gong cha (638048-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All mandatory canonical families populated.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided: YES
- All tables extracted: YES (Table 1 — Net Sales by quartile for 203 stores)
- Population counts: YES (203 stores; 51/50/50/52 by quartile)
- Exclusion rules: YES (29 stores excluded for incomplete year; 3 closed stores included with full data)
- Notes extracted: YES (data source, non-verification, geographic scope, substantiation availability)
- No cost data disclosed: Correctly noted (revenue-only FPR)
- Substantiation statement: YES ("We will, upon reasonable request, provide written substantiation")

### 2. Item 20 Completeness — PASS
- All 5 standard tables present: YES for franchisor-direct (Tables 1-5) and systemwide combined (Tables 1a-5a) — 10 tables total
- Total rows balance: YES (verified franchised + company-owned = total for each year)
- Franchisee list exhibit count: YES (Exhibit D for direct franchisees, Exhibit E for subfranchisees)
- Gag clause flag: SET — "During the last 3 fiscal years, we have not signed any confidentiality clauses with current or former unit franchisees." Some master franchisees may have restrictions. Correctly captured.

### 3. Item 21 Sufficiency — PASS
- Auditor identified: YES (Melville, NY; firm name not in text layer — LOW severity gap)
- Balance sheet: YES (Dec 31, 2024 and 2023)
- Income statement: YES (2024 and inception-2023)
- Cash flow: YES (2024 and inception-2023)
- Notes to FS: YES (Notes 1-8, structured in RT_depth_financial_notes.json)
- Going-concern: NO going-concern language (positive — correctly flagged)
- Unaudited stub: YES (Jan 1–Feb 28, 2025)

### 4. State Addenda Sufficiency — PASS
- All state addenda identified: YES (CA, HI, MI, MN, WI — 5 states)
- Structured into canonical: YES — `state_addenda_overrides` family in 09_final_canonical.json with 20 overrides across 10 override families
- Per-state override families extracted: YES (forum_selection, governing_law, noncompete, general_release, termination, notice_cure, damages, interest_rate, anti_waiver, renewal)
- Summary table included: YES

### 5. Key Exhibit Sufficiency — PASS
- All exhibits from Item 22 accounted for in 04_exhibits.json: YES (A through J)
- Financial exhibits deep-read: YES (Exhibit F — audited + unaudited, all 8 notes)
- Franchise agreement deep-read: YES (Exhibit G — clause-by-clause in RT_depth_contract_burdens.json)
- Guaranty exhibit identified: YES (Exhibit G, Exhibit C — Guaranty, Indemnification, and Acknowledgment)

### 6. Unresolveds and Contradictions — PASS
- Coverage audit contains unresolveds: YES (5 items)
- Final report contains unresolveds: YES (Section J, 5 items with severity)
- Structured in canonical: YES — `unresolveds` family in 09_final_canonical.json with 5 entries (U1-U5)
- Contradictions in canonical: YES — `contradictions` family with 1 entry (C1, immaterial)
- All unresolveds are genuine business-risk flags: YES — tariff uncertainty, revenue concentration, growth deceleration, acquisition disclosure, auditor name
- No extraction gaps requiring A4 recovery

### 7. Final Report Depth — PASS
- Full diligence report: YES (08_final_report.md)
- Required sections present:
  - A. Executive snapshot (15 numbered items): YES
  - B. Fees/investment: YES (detailed fee stack, investment table, financing)
  - C. Supplier/operations/tech: YES (supplier restrictions, training, technology, marketing fund)
  - D. Territory: YES (carve-outs, reservations, channel restrictions)
  - E. Contract burden/legal: YES (term, renewal, transfer, termination, noncompete, dispute resolution, litigation)
  - F. Item 19 detail: YES (quartile table, caveats, exclusions, methodology)
  - G. Item 20 detail: YES (growth trajectory, franchisor-direct, projections, master franchisee transitions)
  - H. Item 21 detail: YES (auditor, BS/IS/CF highlights, financial observations)
  - I. State addenda summary: YES (CA, HI, MI, MN, WI with key overrides)
  - J. Unresolveds: YES (5 items with severity)
  - K. Contradictions: YES (1 item, immaterial)
  - L. Final coverage note: YES (fully surfaced vs. partial vs. recovered)
- Report is substantive narrative: YES (well over 400 lines)

### 8. Score Gate — PASS
- Overall grade: A (upgraded from A- after A2 depth passes)
- All required items covered: YES (23/23)
- Canonical fields populated with evidence grounding: YES
- All mandatory canonical families present: YES (unresolveds, contradictions, state_addenda_overrides, operations)

---

## Recovery Passes Needed
None. All checklist items pass. Extraction is publish-ready.
