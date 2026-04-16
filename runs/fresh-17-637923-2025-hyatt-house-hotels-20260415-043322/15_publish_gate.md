# Publish Gate — Hyatt House Hotels (637923-2025)

## Verdict: 1 — Publish-ready

No material gaps. All items covered. Evidence grounded. All canonical families populated.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided: Yes
- All 3 FPRs extracted with complete tables (Occupancy/ADR/RevPAR, Smith Travel Indices, World of Hyatt Contribution)
- Channel mix additional data extracted
- High/low/median statistics for all metrics
- Population counts: 115 Covered Hotels (106 franchised, 9 owned/managed), 30 Urban Hotels
- Exclusion rules captured: 4 hotels opened during 2024 excluded
- Substantiation availability statement captured
- Stay length distribution captured
- Caveats captured (revenue-only, unaudited, etc.)

### 2. Item 20 Completeness ✅
- All 5 standard tables present:
  - Table 1: Systemwide Outlet Summary (2022-2024) ✅
  - Table 2: Transfers (2022-2024) ✅
  - Table 3: Status of Franchised Outlets (2022-2024) ✅
  - Table 4: Status of Company-Owned Outlets (2022-2024) ✅
  - Table 5: Projected Openings ✅
- Total rows balance: 118 = 109 franchised + 9 company-owned ✅
- Franchisee list exhibit count captured: 109 hotels in Exhibit G ✅
- Gag clause flag set: false (no confidentiality clauses) ✅
- Franchisee organizations: None ✅

### 3. Item 21 Sufficiency ✅
- Auditor identified: Deloitte & Touche LLP (since 2003) ✅
- Income statement extracted: 2024, 2023, 2022 ✅
- Balance sheet extracted: Dec 31 2024 and 2023 ✅
- Cash flow statement extracted ✅
- Notes to financial statements covered via Depth Pass 1 ✅
- Going concern: None ✅
- Guarantee of Performance: Absolute and unconditional by Hyatt Hotels Corporation ✅

### 4. State Addenda Sufficiency ✅
- All state-specific addenda identified: CA, HI, MD, MN, ND ✅
- Structured into state_addenda_overrides in 09_final_canonical.json ✅
- Override families structured per-state: general_release, forum_selection, governing_law, termination, renewal, damages, anti_waiver, financial_disclosure ✅
- Summary matrix provided ✅

### 5. Key Exhibit Sufficiency ✅
- All exhibits listed in Item 22 accounted for in 04_exhibits.json ✅
- Financial exhibits (A): Deep-read with depth pass ✅
- Franchise Agreement (C): Deep-read with contract burden depth pass ✅
- Guaranty exhibit: Identified within FA internal exhibits ✅

### 6. Unresolveds and Contradictions Assessment ✅
- Unresolveds preserved as structured family in 09_final_canonical.json: 5 entries ✅
- Contradictions preserved as structured family: 0 entries (none identified) ✅
- All unresolveds are genuine business-risk flags (not extraction gaps) ✅
  - U1 (AOP Term negotiability): Business risk — prospective franchisee must negotiate
  - U2 (Guarantor Monetary Threshold): Business risk — per-deal determination
  - U3 (Materially different renewal terms): Business risk — inherent in franchise model
  - U4 (Goodwill impairment): Business observation — parent financial health
  - U5 (Franchisor entity unaudited): Regulatory observation — parent guarantee mitigates

### 7. Final Report Depth ✅
- 08_final_report.md is a full diligence report ✅
- Contains all required sections:
  - A: Executive snapshot (14 numbered bullets) ✅
  - B: Fee stack, entry structure, initial investment ✅
  - C: Supplier control, operations, technology, reporting ✅
  - D: Territory, competition, channels, encroachment ✅
  - E: Contract burden and legal mechanics ✅
  - F: Item 19 detail with all tables and caveats ✅
  - G: Item 20 detail with all tables ✅
  - H: Item 21 financial statements summary ✅
  - I: State addenda summary ✅
  - J: Unresolveds ✅
  - K: Contradictions ✅
  - L: Final coverage note ✅
- Report length: ~450 lines ✅ (exceeds 100-line minimum)

### 8. Score Gate ✅
- Overall grade in 10_scorecard.md: A ✅
- All required items covered ✅
- All canonical fields populated with evidence grounding ✅
- All 4 depth passes completed ✅
- Canonical family enforcement completed ✅

---

## Rationale

This extraction is comprehensive and publish-ready. All 23 FDD items are fully extracted. All 5 Item 20 tables are present and balanced. Item 19 provides three complete FPRs with statistics. Item 21 financial statements are fully extracted with depth pass coverage of notes. State addenda are structured into canonical with per-state override families. The final report is a substantive ~450-line diligence document. Five unresolveds are documented and genuine (not extraction gaps). No material contradictions. No recovery needed.
