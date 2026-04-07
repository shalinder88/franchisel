# 15 Publish Gate — Cupbop 2025 (test run)

## Verdict: **2 — Publish with caveats**

## Rationale

The extraction is substantively complete and evidence-grounded across all 23 items, all 5 mandatory Item 20 tables, all 3 Item 19 tables, full balance sheet / income statement / cash flow / member-equity statements, all 9 financial-statement notes, exhibit catalog covering A through I, FA Guaranty exhibit (Exhibit H), and structured `unresolveds`, `contradictions`, and `state_addenda_overrides` families in `09_final_canonical.json`. The final report (`08_final_report.md`) is a full narrative diligence report (12 sections A through L, well over 100 lines) covering executive snapshot, fees/investment, supplier/operations/tech, territory, contract burden, Item 19 detail with quartile bands, Item 20 detail, Item 21 financial-statement summary including the equity-collapse and 185% payout ratio, state addenda summary, unresolveds, contradictions, and final coverage note. The depth-pass artifacts (RT_depth_*.json) are present and the 13 promoted facts are reflected in the canonical patches.

The caveats that prevent a clean Verdict 1 are explicit and acknowledged as test-run scope decisions, not extraction gaps:
1. **FA body (pp 80–126) was not clause-walked in full.** Item 17's cross-walk table plus the Guaranty exhibit (pp 143–144) provide enough for the canonical and the final report, but a non-test run should produce a complete clause-by-clause FA extract.
2. **State addenda for IL, MD, ND, RI, VA were enumerated by location but not clause-extracted.** CA, MN, NY, WA were clause-extracted (the four most material override states). The remaining 5 are flagged in `state_addenda_overrides.states_enumerated_but_not_clause_extracted` for follow-up.
3. **ADA body (pp 145–155)** was treated similarly to the FA body — known scope but not deeply extracted in the test run.

None of these caveats are buyer-misleading. The canonical does not invent or assert any state-specific override that wasn't extracted from the addendum text actually read. The unresolveds list (9 items) preserves the open questions discovered during reading, and the contradictions list (0 items) is honest — no contradictions were identified.

## Item-by-item assessment

### 1. Item 19 completeness — PASS
- All 3 tables (company-owned n=26, franchised n=24, all n=50) extracted with avg, median, high, low, plus quartile bands.
- All exclusion rules captured (newly-opened, seasonal UVU location, closed franchised units).
- Substantiation availability statement captured: "Written substantiation for the financial performance representation will be made available to you upon reasonable request."
- Critical caveats logged: unaudited, Gross Revenues only (no costs/margin/EBITDA), survivorship-bias risk from 3 closed franchised exclusions.

### 2. Item 20 completeness — PASS
- All 5 tables present:
  - Table 1 (system-wide summary FY2022–2024)
  - Table 2 (transfers — all 0)
  - Table 3 (franchised status by state, 6 states)
  - Table 4 (company-owned status by state, 3 states)
  - Table 5 (projected openings, 9 states)
- Total rows balance: 30 franchised + 29 company = 59 total (matches Table 1 EOY 2024).
- Franchisee list captured (Exhibit F, 30 current addresses + 3 ceased).
- Gag clause flag set: confidentiality clauses present in some franchisee agreements (canonical `item20_outlets.confidentiality_clause_present = true`).
- Concentration to Gold Bowl LLC and dual-role director-franchisees captured.

### 3. Item 21 sufficiency — PASS
- Auditor: Forvis Mazars LLP (Salt Lake City, UT).
- Opinion: unqualified (clean) on FY2022, FY2023, FY2024.
- Income statement, balance sheet, cash flow, member-equity statement all extracted (4 tables in 03_tables.json).
- Notes covered via depth pass (RT_depth_financial_notes.json — 9 notes structured).
- Going-concern: not flagged in auditor report. Implied concern from data (member's equity $21,352 vs $636,503 liabilities) raised in unresolveds U2 and final report Section H.
- Related-party detail captured (related-party A/R $133,826 in 2024 down from $892,586).
- PTET payments separated from pure profit-extraction distributions.

### 4. State addenda sufficiency — PARTIAL (caveat-level, not blocker)
- 9 states with addenda identified and listed in `state_addenda_overrides.states_with_addenda`.
- 4 states clause-extracted with structured override families (CA, MN, NY, WA) — covering forum_selection, governing_law, noncompete, termination, general_release, anti_fraud, transfer, jury_trial, ld_unenforceable, interest_rate.
- 5 states (IL, MD, ND, RI, VA) located by page but not clause-extracted; flagged in canonical as `states_enumerated_but_not_clause_extracted`.
- Summary table mapping override families × states is present in canonical.
- Item 22 acknowledgement language (anti-disclaimer / anti-fraud-waiver) captured.
- Verdict consequence: this is documented as a test-run scope decision, not silent dropping. The structure is correct; only the per-state coverage is incomplete. Verdict 2, not Verdict 3.

### 5. Key exhibit sufficiency — PASS
- All 9 exhibits (A through I) cataloged with letter, name, category, priority, page range.
- Exhibit B (financials) deep-read pp 52–66.
- Exhibit C (FA) located + Item 17 cross-walk + Guaranty exhibit (Exhibit H) deep-read pp 143–144.
- Exhibit D (ADA) located + Item 12/17 cross-references.
- Exhibit E (Manual TOC) located, header captured (108 manual pages, version 03-01-2023).
- Exhibit F (franchisee list) deep-read pp 167–169 with concentration analysis.
- Exhibit G (state addenda) located + 4 states clause-extracted.
- Exhibit H (state effective dates) deep-read p 199 — all 10 listed states PENDING.
- Exhibit I (receipts) located.

### 6. Unresolveds and contradictions — PASS
- `unresolveds` family present in canonical with **9 entries** (id, description, severity, source).
- `contradictions` family present with **0 entries** — the audit and final report explicitly identify no contradictions.
- All 9 unresolveds are genuine business-risk flags, not extraction gaps:
  - U1: cash flow quality / one-time related-party collection
  - U2: going-concern question from balance sheet
  - U3: cross-default scope ambiguity
  - U4: ROFR mechanics not detailed
  - U5: FMV methodology not detailed
  - U6: Las Vegas closures cause not disclosed
  - U7: marketing fund admin allocation comparison
  - U8: customer concentration identity not disclosed
  - U9: all state effective dates PENDING (registration not effective at issuance — high severity)
- No A4 retry needed.

### 7. Final report depth — PASS
- `08_final_report.md` is a full narrative diligence report, well over 100 lines.
- All required sections present:
  - A. Executive snapshot (15 numbered bullets)
  - B. Fee stack, entry structure, initial investment
  - C. Supplier control, operating control, tech burden, reporting burden
  - D. Territory, competition, channels, encroachment
  - E. Contract burden and legal mechanics
  - F. Item 19 — FPR
  - G. Item 20 — outlet data
  - H. Item 21 — financial statements (with full BS/IS/CF tables and key observations)
  - I. State addenda summary
  - J. Unresolveds (9 items)
  - K. Contradictions (none)
  - L. Final coverage note
- Item 21 financial statement summary section present and substantive.
- State addenda discussed in Section I.
- Unresolveds and contradictions sections both present (Sections J and K).

### 8. Score gate — PASS
- 10_scorecard.md shows 23/23 items covered, 16/16 tables captured, all coverage gates PASS.
- Quality flags / risk markers are documented in scorecard (equity collapse, 40% admin, sales-performance kill switch, 20-mile non-compete, all states PENDING, concentration risk, 3 LV closures).

## Caveats reproduced (for the run summary)

1. FA body (pp 80–126) clause-by-clause extraction deferred. Captured at Item 17 cross-walk + Guaranty exhibit depth.
2. ADA body (pp 145–155) clause-by-clause extraction deferred. Captured at Item 12/17 cross-walk depth.
3. State addenda for IL, MD, ND, RI, VA enumerated by page but not clause-extracted. CA, MN, NY, WA fully clause-extracted.
4. Operations Manual TOC chapter map (pp 160–166) not extracted. Manual referenced as 108 pages, version 03-01-2023.
5. PDF render via fitz_render text layer only — pdftoppm/poppler not installed in this environment. No image/visual rendering performed.
6. B1–B5 phases not run because no prior cupbop benchmark run exists in `runs/`.

## Recovery passes needed
**None.** Verdict is 2 (publish with caveats), not 3.

The 5 caveats above are explicit, structured in the canonical, and not buyer-misleading. A subsequent non-test run should pick up the FA full clause walk and the IL/MD/ND/RI/VA addenda; this run is fit for purpose as a test of the new A3 prompt.
