# Publish Gate: Hyatt Centric FDD (637921-2025)

## Verdict: 1 — Publish-Ready

No material gaps. All items covered. Evidence grounded. State addenda structurally extracted.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- FPR provided with 3 representations (Occupancy/ADR/RevPAR, Smith Travel Indices, World of Hyatt Contribution) plus reservation channel mix.
- All tables extracted with population counts (32 Covered Hotels, 20 Franchised, 12 Owned/Managed).
- High/low/median/exceeding-average statistics extracted for all FPRs.
- Exclusion rule stated: 1 hotel opened during 2024, excluded.
- No cost build-up or EBITDA disclosed — this is the franchisor's disclosure choice, not an extraction gap.
- Substantiation availability: "We will provide written substantiation...upon your reasonable request" — captured.
- Revenue-only caveat extracted verbatim.

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - Table 1: Systemwide outlet summary (2022-2024) ✓
  - Table 2: Transfers ✓
  - Table 3: Franchised outlet status by state (2022-2024) ✓
  - Table 4: Company-owned outlet status by state (2022-2024) ✓
  - Table 5: Projected openings ✓
- Total rows balance: 20+11=31 start 2024, 21+11=32 end 2024 ✓
- Franchisee list exhibit count: Exhibit H (franchisees), Exhibit I (former) — noted.
- Gag clause flag: NO gag clause — explicitly stated "no franchisees have signed confidentiality clauses." ✓

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Deloitte & Touche LLP ✓
- Income statement: 3-year data extracted (revenue, net income, EPS) ✓
- Balance sheet: 2-year data extracted (assets, liabilities, equity, cash, debt) ✓
- Cash flow: FY2024 extracted (operating, investing, financing) ✓
- Notes to financial statements: 17 material notes extracted in depth pass ✓
- Going concern: No going concern ✓
- Performance guarantee: Absolute and unconditional by Hyatt Hotels Corporation ✓
- Critical audit matter: Loyalty program deferred revenue ($1.333B) noted ✓

### 4. State Addenda Sufficiency — PASS
- All state-specific addenda identified: 14 states ✓
- Structured into `state_addenda_overrides` in 09_final_canonical.json ✓
- Override families extracted: forum_selection, governing_law, termination, renewal, general_release, damages, transfer ✓
- 18 individual overrides with per-state detail ✓
- RT_depth_state_addenda_promotion.json written with full structured data ✓

### 5. Key Exhibit Sufficiency — PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json ✓
- Financial exhibits (A-1, A-2): Deep-read in A2 Depth Pass 1 ✓
- Franchise Agreement (C): Deep-read in A2 Depth Pass 2 ✓
- Guaranty: Noted in contract burdens ✓
- State riders (M): Deep-read in A2 Depth Pass 4 ✓

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists 4 unresolveds and 0 contradictions ✓
- 08_final_report.md contains Sections J (Unresolveds) and K (Contradictions) ✓
- 09_final_canonical.json contains `unresolveds` key with 4 entries ✓
- 09_final_canonical.json contains `contradictions` key (empty array — no contradictions found) ✓
- All unresolveds are genuine business-risk flags or standard disclosure gaps, not extraction gaps ✓
- No extraction gaps requiring A4 recovery ✓

### 7. Final Report Depth — PASS
- 08_final_report.md is a full diligence report (~400+ lines).
- All required sections present:
  - A. Executive snapshot (13 numbered bullets) ✓
  - B. Fee stack, entry structure, initial investment ✓
  - C. Supplier control, operating control, technology, marketing ✓
  - D. Territory, competition, channels, encroachment ✓
  - E. Contract burden and legal mechanics ✓
  - F. Item 19 — Financial performance representations (detailed) ✓
  - G. Item 20 — Outlet data ✓
  - H. Item 21 — Financial statements ✓
  - I. State addenda summary ✓
  - J. Unresolveds ✓
  - K. Contradictions ✓
  - L. Final coverage note ✓

### 8. Score Gate — PASS
- 10_scorecard.md: Overall grade A- ✓
- All required items covered ✓
- All depth passes complete ✓
- Canonical fields populated with evidence grounding ✓

---

## Rationale

This extraction is publish-ready. All 23 Items have been fully extracted with evidence grounding. The three FPRs plus channel data provide comprehensive performance context. The five Item 20 tables show zero terminations and steady growth. Financial statements from a strong publicly-traded parent (Hyatt Hotels Corporation) with performance guarantee. State addenda are structurally extracted with per-state override families. Contract burdens have been cataloged from the franchise agreement. Unresolveds and contradictions are properly promoted to canonical.

The only limitation is that Item 19 provides revenue-only data (no cost/EBITDA), which is the franchisor's disclosure choice and not an extraction gap.

## Recovery Passes Needed

None. Verdict is 1 — Publish-Ready.
