# Publish Gate — Graduate by Hilton (638055-2025)

## VERDICT: 1 — PUBLISH-READY

No material gaps. All items covered. Evidence grounded. Canonical families enforced.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
- No FPR provided — confirmed and extracted.
- No-FPR statement extracted verbatim in reader report and canonical: "We do not make any representations about a franchisee's future financial performance..."
- Substantiation availability statement captured (contact William Fortier, SVP Development Americas).
- `item19_financial_performance.fpr_provided = false` in canonical.

### 2. Item 20 Completeness — PASS
- All 5 standard tables present:
  - Table 1 (Systemwide Summary): Present. 2022/2023/2024 data.
  - Table 2 (Transfers): Present. Zero transfers across all years.
  - Table 3 (Franchised Status by State): Present. 24 states, 32 hotels at end 2024.
  - Table 4 (Company-Owned Status): Present. Zero across all years.
  - Table 5 (Projected Openings): Present. 2 signed/not-opened, 1 projected (Texas).
- Totals balance: 32 franchised at end of 2024, 0 company-owned, 32 total.
- Franchisee list exhibit count captured: 34 hotels in Exhibit A (2 not yet open).
- Gag clause flag set: `confidentiality_clauses: false` — no franchisees signed restrictions on speaking.

### 3. Item 21 Sufficiency — PASS
- Auditor identified: Cherry Bekaert LLP.
- Opinion type: Clean / Unqualified.
- Income statement: Extracted for 2024, 2023, 2022 with all line items.
- Balance sheet: Extracted for 2024 and 2023 with all line items.
- Cash flows: Extracted for 2024, 2023, 2022 with key line items.
- Notes to financial statements: All 9 notes covered in RT_depth_financial_notes.json.
- Going-concern status: No going-concern issues raised. Clean opinion.
- Key observations documented: debt guarantee, cash sweep, intercompany dominance, Graduate intangible.

### 4. State Addenda Sufficiency — PASS
- 12 states with addenda identified: CA, HI, IL, MD, MI, MN, ND, NY, PR, RI, VA, WA.
- Structured overrides in `state_addenda_overrides` in 09_final_canonical.json: PRESENT.
- 18 individual overrides extracted across 5 deeply-read states (CA, HI, IL, MD, MI).
- 8 override families mapped: forum_selection, governing_law, termination, renewal, general_release, anti_waiver, damages, transfer.
- RT_depth_state_addenda_promotion.json contains full structured data.
- State addenda discussed in final report Section I (7 states summarized in table).

### 5. Key Exhibit Sufficiency — PASS
- Item 22 lists: Exhibits D, D-2, E, F, G, K — all 6 accounted for in 04_exhibits.json.
- All 16 exhibits cataloged with letter, name, category, priority, page range.
- Financial exhibits (Exhibit C): Deep-read — 3-year statements + 9 notes.
- Franchise Agreement (Exhibit D): Deep-read for contract burden depth pass.
- Guaranty (Exhibit E): Identified, scope captured in RT_depth_contract_burdens.json.

### 6. Unresolveds and Contradictions — PASS
- 06_coverage_audit.md lists 5 identified gaps (3 medium, 2 low severity).
- 08_final_report.md Section J lists 5 unresolveds with severity and source.
- 08_final_report.md Section K lists 2 contradictions with resolution status.
- 09_final_canonical.json contains `unresolveds` (5 items) and `contradictions` (2 items) as top-level families.
- All unresolveds are genuine business-risk flags (not extraction gaps):
  - U1: FS date typo (low, informational)
  - U2: 34 vs 32 outlet count (low, explained by footnote)
  - U3: Graduate-specific financials not disclosed (medium, structural)
  - U4: Program fee spending not audited (medium, structural)
  - U5: No actual Graduate investment data (medium, structural)
- No extraction gaps requiring A4 recovery.

### 7. Final Report Depth — PASS
- 08_final_report.md is 359 lines — full diligence report.
- All 12 required sections present:
  - A: Executive Snapshot (14 numbered bullets) ✓
  - B: Fee stack, entry structure, initial investment ✓
  - C: Supplier control, operations, tech, reporting ✓
  - D: Territory, competition, channels, encroachment ✓
  - E: Contract burden and legal mechanics ✓
  - F: Item 19 — Financial performance representations ✓
  - G: Item 20 — Outlet data ✓
  - H: Item 21 — Financial statements ✓
  - I: State addenda summary ✓
  - J: Unresolveds (5 items) ✓
  - K: Contradictions (2 items) ✓
  - L: Final coverage note ✓
- Report is standalone-readable for a prospective franchisee.

### 8. Score Gate — PASS
- 10_scorecard.md: All 23 items covered. 14 tables extracted. 16 exhibits cataloged.
- Completeness: HIGH. Accuracy: HIGH. Provenance: HIGH.
- A2 depth passes documented with counts.
- Canonical family enforcement confirmed.

---

## Recovery Passes Needed
**NONE** — Verdict is 1 (Publish-ready). No A4 recovery required.
