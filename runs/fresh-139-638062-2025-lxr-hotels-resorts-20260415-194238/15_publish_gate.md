# Publish Gate: LXR Hotels & Resorts (638062-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

The extraction is thorough and complete across all 23 Items, all material tables, all exhibits, and all depth passes. The caveats relate to inherent FDD limitations (extremely wide investment range, no FPR, ultra-small system) rather than extraction gaps.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: PASS
- No FPR provided. The no-FPR statement is extracted verbatim.
- Substantiation availability statement captured (contact William Fortier for unauthorized FPR).
- No tables, charts, or population data to extract since no FPR exists.

### 2. Item 20 Completeness
- **Status**: PASS
- All 5 standard tables present (systemwide, transfers, franchised status, company-owned status, projected openings).
- Total rows balance (3→3→4 franchised; 0→0→0 company-owned).
- Franchisee list exhibit count: 4 hotels in Exhibit A.
- Gag clause flag: SET — "some current and former franchisees have signed provisions restricting their ability to speak."

### 3. Item 21 Sufficiency
- **Status**: PASS
- Auditor identified: Cherry Bekaert LLP, Tysons Corner, VA.
- Income statement, balance sheet, and cash flow extracted for all 3 years.
- Notes to financial statements covered via Depth Pass 1 (all 9 notes structured).
- Going-concern status: No going-concern modification (set to false).

### 4. State Addenda Sufficiency
- **Status**: PASS
- All 12 state/territory addenda identified and extracted.
- Structured into `state_addenda_overrides` in 09_final_canonical.json with per-state override entries.
- Override families structured: forum_selection, governing_law, termination, renewal, general_release, liquidated_damages, noncompete, damages.
- Summary table built in RT_depth_state_addenda_promotion.json.

### 5. Key Exhibit Sufficiency
- **Status**: PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json.
- Financial statements (Exhibit C) deep-read with all notes.
- Franchise Agreement (Exhibit D) clause-by-clause burden extraction completed via Depth Pass 2.
- Guaranty (Exhibit E) structure captured.
- HITS Agreement (Exhibit G) main terms captured.

### 6. Unresolveds and Contradictions Assessment
- **Status**: PASS
- 9 unresolveds identified and structured as `unresolveds` family in 09_final_canonical.json.
- 2 contradictions identified and structured as `contradictions` family in 09_final_canonical.json.
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U1: Wide investment range (FDD limitation)
  - U2: HPMS migration unknown (FDD limitation)
  - U3: Asset pledge (financial risk)
  - U4: Ultra-small system (market risk)
  - U5: Gag clause (information risk)
  - U6-U8: Undisclosed costs (FDD limitation)
  - U9: Typo (cosmetic)

### 7. Final Report Depth
- **Status**: PASS
- 08_final_report.md is a full diligence report with all required sections:
  - A: Executive snapshot (14 numbered bullets)
  - B: Fee stack, entry structure, initial investment
  - C: Supplier control, operations, training, tech
  - D: Territory, competition, channels
  - E: Contract burden and legal mechanics
  - F: Item 19 detail (no FPR)
  - G: Item 20 outlet data
  - H: Item 21 financial statements
  - I: State addenda summary (all 12 states)
  - J: Unresolveds (9 items)
  - K: Contradictions (2 items)
  - L: Final coverage note
- Report is ~450+ lines of substantive narrative.

### 8. Score Gate
- **Status**: PASS
- Overall grade: B+ (10_scorecard.md).
- All required items covered.
- Canonical fields populated with evidence grounding.
- B+ rather than A due to inherent FDD limitations (wide investment range, no FPR, ultra-small system) rather than extraction quality.

---

## Caveats for Publication

1. **No FPR**: Prospective franchisees have zero franchisor-provided performance data. This is an FDD characteristic, not an extraction gap.

2. **Investment range**: The $5.4M–$845.8M range is too wide for practical investment planning. The franchisor explicitly acknowledges lacking actual LXR data.

3. **Ultra-small system**: With only 4 hotels and zero projected openings, any aggregate metrics or trend analysis would have extremely limited statistical significance.

4. **Entity scope**: Financial statements cover all Hilton US franchise brands (~7,000+ hotels), not just LXR. Revenue and financial health metrics reflect the broader Hilton franchise portfolio.

---

## Recovery Passes Needed

**None.** Verdict is 2 (publish with caveats), not 3. All identified gaps are inherent FDD limitations, not extraction failures.
