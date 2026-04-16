# Publish Gate — Curio Collection by Hilton (638051-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

This extraction is thorough and substantially complete. All 23 FDD Items are fully covered. All material tables are extracted. Item 19 FPR is fully extracted with population counts, attainment percentages, and conversion data. Item 20 has all 5 standard tables. Financial statements are deep-read including all 9 notes. State addenda are structured with 32 overrides across 11 states. The Franchise Agreement has been read at clause-by-clause level for contract burdens. Two contradictions and three unresolveds are identified and documented.

The caveats are minor and relate to inherent FDD limitations (no cost/profit data in FPR) and two data anomalies in the FDD itself (Item 19 range and Note 9 date) that are recording issues in the source document, not extraction gaps.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness ✅
- FPR provided with room rate, occupancy, and conversion data
- All tables extracted with population counts (88 comparable, 7 company-managed, 81 franchisee-managed)
- Averages, medians, ranges, and attainment percentages for both company-managed and franchisee-managed
- Conversion data with 16 comparable conversion hotels, ADR/occupancy/RevPAR pre/post with medians
- Exclusion rules documented (cool-down and ramp-up periods)
- Substantiation availability statement captured
- **Caveat**: One data anomaly (C01) — 2023 range inconsistent with average. This is an FDD text issue, not an extraction gap.

### 2. Item 20 Completeness ✅
- All 5 standard tables present:
  1. Systemwide Hotel Summary (3 years) ✅
  2. Transfers (3 years, by state) ✅
  3. Status of Franchised Hotels (3 years, by state, all activity columns) ✅
  4. Status of Company-Owned Hotels (3 years — all zeros) ✅
  5. Projected Openings (by state) ✅
- Total rows verified: 62→67→71→80
- Franchisee list exhibit: Exhibit A ✅
- Gag clause flag: Set ✅
- **Minor caveat**: U02 — positive values in "Ceased Operations" column likely represent reclassifications, not cessations.

### 3. Item 21 Sufficiency ✅
- Auditor: Cherry Bekaert (CBH) ✅
- Clean (unqualified) opinion ✅
- Income statement: 3 years ✅
- Balance sheet: 2 years ✅
- Cash flows: 3 years ✅
- Notes to financial statements: All 9 notes extracted via depth pass ✅
- Going concern: No ✅
- **Minor caveat**: Note 9 evaluation date appears to contain typo (C02).

### 4. State Addenda Sufficiency ✅
- 11 states with addenda identified ✅
- All addenda extracted from Exhibit J-1 ✅
- Structured into `state_addenda_overrides` in canonical ✅
- 32 overrides across 7 override families ✅
- Summary table with families × states ✅
- Exhibit D-1 (FA state addenda) page range identified but shares content with Exhibit J-1 ✅

### 5. Key Exhibit Sufficiency ✅
- All 20 exhibits cataloged in 04_exhibits.json ✅
- Financial exhibits (C): Deep-read ✅
- Franchise Agreement (D): Clause-by-clause in depth pass ✅
- Guaranty (E): Scope, release conditions extracted in depth pass ✅
- HITS Agreement (G): Identified and key terms noted ✅
- State Addenda (J-1): Fully structured ✅

### 6. Unresolveds and Contradictions ✅
- 3 unresolveds documented (U01-U03), all with severity ratings
- 2 contradictions documented (C01-C02)
- Both preserved as structured families in `09_final_canonical.json` ✅
- All unresolveds are genuine business-risk flags or FDD source-document issues, NOT extraction gaps ✅
- No extraction gap unresolveds requiring A4 recovery

### 7. Final Report Depth ✅
- 08_final_report.md is a full diligence report (400+ lines)
- Contains ALL required sections:
  - A. Executive snapshot (14 numbered bullets) ✅
  - B. Fee stack, entry structure, initial investment ✅
  - C. Supplier control, operations, tech, reporting ✅
  - D. Territory, competition, channels, encroachment ✅
  - E. Contract burden and legal mechanics ✅
  - F. Item 19 detail ✅
  - G. Item 20 detail ✅
  - H. Item 21 financial statements ✅
  - I. State addenda summary ✅
  - J. Unresolveds ✅
  - K. Contradictions ✅
  - L. Final coverage note ✅

### 8. Score Gate ✅
- Scorecard grade: A-
- All 23 items covered
- Canonical fields populated with evidence grounding and source pages
- Depth passes: 4 completed with results documented

---

## Recovery Passes Needed: None

All identified unresolveds are either:
- FDD source-document anomalies (C01, C02) — cannot be resolved by re-reading
- Low-severity data conventions (U02) — not material
- Already addressed in depth pass (U03 — state addenda now structured)

No material extraction gaps exist that would require A4 focused recovery.
