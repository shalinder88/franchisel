# Publish Gate (A3) — Embassy Suites 2025

## Verdict: **2 — Publish with caveats**

## Rationale
Extraction is materially complete on all high-weight items. All publish-gate critical checks pass: Item 19 fully structured, Item 20 has all 5 tables and a confidentiality flag, Item 21 is deep-read (auditor, opinion, all three statements, all 9 notes), state addenda are STRUCTURED per-state into `state_addenda_overrides` canonical family (not just cataloged), `unresolveds` and `contradictions` are top-level keys in `09_final_canonical.json`, and `08_final_report.md` is a 200+-line diligence narrative with all required sections. Two remaining caveats justify "publish with caveats" rather than "publish ready":
1. **Exhibit D-1** (State Addenda to Franchise Agreement) is NOT deep-read. Legal-family overrides are captured from Exhibit J-1 (disclosure document addenda) but not cross-verified against the FA-level addenda in D-1.
2. **Items 9, 10, 13, 14, 15, 16** remain at structural depth only. This is typical for hotel FDDs where the operational burden is expressed via Items 8, 11, 17 and the Franchise Agreement exhibit — but publish packaging should flag these as "derived" rather than "surfaced."

## Item-by-item checklist

### 1. Item 19 completeness — PASS
- FPR provided. All 5 chart families extracted: All Comparable Room Rate, All Comparable Occupancy, Occupancy Index (STR), RevPAR Index (STR), New Generation (post-2015) subset.
- Populations: 220 Comparable (32 CM + 188 FM), 47 New Generation (3 CM + 44 FM).
- Exclusion rules captured (hotels <1 year, brand/ownership change, substantial damage/capex, large room additions, insufficient data).
- Substantiation-availability statement captured ("written substantiation will be made available on reasonable request, but we are under no obligation to disclose specific information about a particular hotel").
- Caveats block present (sample bias, CM-vs-FM divergence, STR weighting).

### 2. Item 20 completeness — PASS
- Table 1 Systemwide Outlet Summary: present.
- Table 2 Transfers: present (9/5/14 for 2022/2023/2024).
- Table 3 Status of Franchised Hotels: present (per-state 3-year activity).
- Table 4 Status of Company-Owned Hotels: present (all zeros — pure franchise model).
- Table 5 Projected Openings: present (29 signed unopened FAs; 3 projected 2025).
- Totals balance across years.
- Exhibit A franchised hotels list identified (pp 98-110); count 237 matches Item 20 end-of-year 2024.
- **Confidentiality clause flag = TRUE** (captured from p 88 quote).
- Independent franchisee association flag = FALSE.

### 3. Item 21 sufficiency — PASS
- Auditor: **Cherry Bekaert** (Tysons Corner, VA).
- Opinion: **Unqualified (clean)**.
- Opinion date: 2025-03-18.
- Going concern: **No flag**.
- Balance sheets 2024 & 2023 fully transcribed (`retry_R1.json`, `09_final_canonical.json`).
- Income statements 2024, 2023, 2022 fully transcribed.
- Cash flows 2024 fully transcribed (plus 2023 and 2022 totals).
- Equity rollforward present.
- All 9 notes to financial statements extracted in `RT_depth_financial_notes.json`.

### 4. State addenda sufficiency — PASS (with D-1 caveat)
- Exhibit J-1 (pp 266-274) fully read.
- 11 states with addenda: CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA.
- **Structured** into `state_addenda_overrides` canonical family (not merely cataloged). Per-state entries include override families (forum_selection, governing_law, damages, termination, general_release, etc.), summary language, and page citations.
- Override matrix compiled.
- **Caveat**: Exhibit D-1 State Addenda to Franchise Agreement (pp 183-196) not deep-read. FA-level and DD-level addenda typically align, but explicit cross-verification was deferred.

### 5. Key exhibit sufficiency — MOSTLY PASS
- All 18 exhibits (A-M with sub-variants) cataloged in `04_exhibits.json` with page ranges.
- Exhibit A (franchised hotels list) NOT transcribed to row level (structural only) — acceptable for publish as the total count (237) aligns with Item 20.
- Exhibit B NOT transcribed.
- Exhibit C financials: deep-read (Retry R1 + A2 Depth Pass 1 notes).
- Exhibit D FA: deep structural via Item 17 table (not clause-by-clause).
- Exhibit E Guaranty: **structural only — scope (personal/spousal/unlimited) not confirmed**. Noted as a known gap.
- Exhibit G HITS Agreement: structural via Item 17 cross-reference.
- Exhibit J-1: fully read and structured.
- Exhibits D-1, D-2, D-3, F, H-1, H-2, I, J-2, K, L, M: structural only (acceptable for this test scope).

### 6. Unresolveds and contradictions — PASS
- `06_coverage_audit.md` lists material gaps and findings.
- `08_final_report.md` Section J lists 9 unresolveds with severity (3 HIGH / 5 MEDIUM / 1 LOW).
- Both `unresolveds` and `contradictions` are top-level keys in `09_final_canonical.json`.
- `contradictions` is explicitly empty (no contradictions found between items, tables, or narrative).
- All high-severity unresolveds are genuine business-risk flags (active antitrust class actions; forward-looking territorial reduction) — NOT extraction gaps.
- Extraction gaps (D-1 addendum, Guaranty scope) are logged at LOW severity.

### 7. Final report depth — PASS
- `08_final_report.md` is ~330 lines (far above the 100-line threshold).
- Contains all required sections: A Executive snapshot, B Fee stack/investment, C Supplier/operations/tech, D Territory, E Contract burden, F Item 19, G Item 20, H Item 21 with transcribed numbers, I State addenda summary, J Unresolveds, K Contradictions, L Final coverage note.
- State addenda discussed (Section I).
- Item 21 has full numerical summary table (Section H).
- Unresolveds (J) and Contradictions (K) sections both present.

### 8. Score gate — PASS
- `10_scorecard.md` shows weighted coverage ~88-92%.
- Scoring gates (Items 5-7, 19, 20, 21, 22, 23) all PASS.
- Canonical fields populated with page-level evidence grounding throughout.

## Caveats for publish packaging
1. Items 9, 10, 13, 14, 15, 16 should be presented as "derived from contract map" rather than "directly transcribed."
2. Exhibit D-1 FA-level state addenda not cross-verified.
3. Exhibit E Guaranty scope not confirmed.
4. Exhibit A franchised hotel list not row-level transcribed.
5. Exhibit D-2 Development Incentive Promissory Note terms unknown.

## Recovery tasks needed
**None required for publish.** Above caveats are non-blocking for A3 verdict 2.
If a future deeper pass is desired, a focused A4 scope would be:
1. Transcribe Exhibit D-1 per-state FA overrides and reconcile with J-1.
2. Deep-read Exhibit E Guaranty to confirm personal/spousal/unlimited scope.
3. Transcribe Exhibit D-2 Development Incentive Promissory Note.
4. Row-level transcription of Exhibit A franchised hotel list (if per-market analysis is intended).
