# Publish Gate — Magnuson Hotels and Magnuson Grand (637940-2025)

## VERDICT: 1 — Publish-Ready

No material gaps. All 23 Items fully covered. All 9 exhibits directly read and clause-walked. Financial statements fully extracted with auditor recovered via image fallback. State addenda structured into canonical. Unresolveds and contradictions preserved as structured families.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: PASS
- No FPR provided. The no-FPR statement is extracted verbatim in 02_reader_report.md and 08_final_report.md (Section F): "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets." (p.34)
- Item 19 cohort comparability: not applicable (no FPR).

### 2. Item 20 Completeness
- **Status**: PASS
- All 5 standard tables present: Table 1 (systemwide), Table 2 (transfers), Table 3 (franchised status by state), Table 4 (company-owned), Table 5 (projected openings).
- Totals balance: 0→4→9→11 confirmed across Table 1 and Table 3 totals.
- Franchisee list exhibit count: 11 current (E-1), 2 former (E-2), 0 signed-not-open.
- Gag clause flag: SET — "In some instances, current and former franchisees sign provisions restricting their ability to speak openly" (p.37).
- Post-FY termination note captured: 1 TX franchisee.
- TX Table 3 OCR anomaly flagged and corrected.

### 3. Item 21 Sufficiency
- **Status**: PASS
- Auditor identified: Citrin Cooperman & Company, LLP (recovered via targeted image fallback, pp.86-87).
- Income statement: 3 years extracted (2022-2024) with all line items (p.89).
- Balance sheet: 2 years extracted (2023-2024) with all line items (p.88).
- Cash flow: 3 years extracted (2022-2024) with all line items (p.90).
- Notes 1-5 fully extracted in RT_depth_financial_notes.json and RT_depth_item21_notes.json (pp.91-94).
- Going-concern status: SET to false (auditor evaluated, no paragraph included).
- Related-party transactions (management fee, license agreement): fully captured.
- Revenue recognition policy: fully detailed (ASC 606/ASU 2021-02).

### 4. State Addenda Sufficiency
- **Status**: PASS
- All state addenda identified: CA, HI, IL, IN, MD, MI, MN, NY, ND, RI, SD, VA, WA, WI.
- Structured into `state_addenda_overrides` in 09_final_canonical.json with 12 override families across 14 states.
- 41 individual override entries in RT_depth_state_addenda_promotion.json.
- Fee deferral states identified and structured: CA, IL, MD, MN, ND, SD, WA.
- Summary table of override families × states present.

### 5. Key Exhibit Sufficiency
- **Status**: PASS
- Item 22 lists 3 exhibits: Exhibit A (Franchise Agreement), Exhibit F (Representations Statement), Exhibit G (Sample General Release). All 3 accounted for in 04_exhibits.json.
- Franchise Agreement: fully clause-walked (21 sections + Guaranty + 8 State-Specific Riders) in RT_depth_contract_burdens.json.
- Financial statements (Exhibit C): fully deep-read with all 5 notes.
- All 9 exhibits cataloged and directly read.

### 6. Unresolveds and Contradictions Assessment
- **Status**: PASS
- 5 unresolveds preserved as structured family in 09_final_canonical.json.
- 3 contradictions preserved as structured family in 09_final_canonical.json.
- All unresolveds are genuine business-risk flags or document-internal issues — none are extraction gaps.
- U1 (license termination risk) is high-severity business risk.
- U2-U5 are medium/low-severity document issues.

### 7. Final Report Depth
- **Status**: PASS
- 08_final_report.md is a full diligence report at ~450 lines.
- All required sections present: A (executive snapshot, 14 bullets), B (fees/investment), C (supplier/operations/tech), D (territory), E (contract burden/legal), F (Item 19), G (Item 20), H (Item 21), I (state addenda), J (unresolveds, 5 items), K (contradictions, 3 items), L (final coverage note).
- State addenda discussed in dedicated Section I with per-state detail.
- Item 21 financial statement summary in dedicated Section H with balance sheet, income statement, cash flow, and key observations.

### 8. Score Gate
- **Status**: PASS
- 10_scorecard.md provides complete risk assessment with all metrics populated.
- Overall risk: HIGH (appropriate given the brand's characteristics).
- All canonical fields populated with evidence grounding (source_section, source_pages, confidence).
- A2 depth pass notes included in scorecard.

---

## Franchise Agreement Clause-Walk Assessment

- **Exhibit surfaced**: Exhibit A — Franchise Agreement (pp.39-78)
- **Status**: FULLY CLAUSE-WALKED
- All 21 sections of the Terms and Conditions directly read and extracted.
- Guaranty and Assumption of Obligations directly read (pp.65-67).
- State-Specific Riders for 8 states directly read (pp.68-78).
- Key operative burdens all captured: term (§3), fees (§10), territory (§5), brand standards (§7.A), PMS/distribution (§8), inspections (§11), confidentiality (§12.A), non-disparagement (§12.B), non-interference (§12.C), indemnification (§14), guaranty (§15), transfer (§16), renewal (§17), termination (§18), dispute resolution (§20).
- **Verdict decision**: No gap. Franchise Agreement fully clause-walked.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale — not needed, as NO exhibits were deferred; all surfaced exhibits were directly clause-walked.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 21 financial statement extraction** (pp.88-94): All three statements extracted line by line for all available years, plus all 5 notes walked. Auditor (Citrin Cooperman) recovered via targeted image fallback (pp.86-87). Related-party management fee quantified at $127K/49% of revenue.
2. **Franchise Agreement clause walk** (pp.39-78): Full 24-page Terms and Conditions plus Guaranty plus 8 State-Specific Riders directly read and structured into 23 clause families with 14 distinctive/unusual items identified in RT_depth_contract_burdens.json.
3. **State addenda depth** (pp.5-6, 68-78, 112-126): 41 structured override entries across 14 states with 12 override families. Fee deferral in 7 states explicitly linked to financial condition findings by state regulators.
4. **Item 20 outlet tables** (pp.35-37): All 5 tables fully extracted with state-level data for 8 states across 3 years. OCR anomaly (TX "21") identified and corrected with cross-reference justification. Post-FY termination flagged. Franchisee lists (E-1 p.101, E-2 p.104) captured with all 11+2 entries.
5. **Item 6 fee table** (pp.11-14): All 21 fee types extracted with amounts, due dates, escalation provisions, and notes. Distinctive fee structures highlighted (minimum invoice revenue, 110% GRR penalty, $9,995 de-identification fee).

### 2. Weakest Remaining Parts of the Run

1. **Auditor name recovery required image fallback** (pp.86-87): Text extraction did not capture the Citrin Cooperman letterhead — required PDF image read. This is a text-layer limitation, not an extraction process gap.
2. **Operating expense disaggregation limited** (p.89): Only the management fee ($127K) is disclosed in the notes; the remaining ~$77K of 2024 operating expenses is not disaggregated. This is a limitation of the source document, not the extraction.
3. **Formation state ambiguity unresolved** (p.8 vs p.91): Item 1 says Wyoming LLC; Note 1 says formed as Washington LLC. The actual formation/redomiciliation history is not fully explained in the FDD. Classified as low-severity open question.
4. **Brand Standards Manual and PMS Manual content not available** (pp.79-82): Only TOCs are included in the FDD. The actual manuals (12 pages + 40 pages) are not accessible. This is by design of the FDD, not an extraction gap.
5. **Affiliate Hotel competition mechanism not specified** (p.25): Item 12 states franchisor will "analyze the conflict and take any action it deems appropriate" for Affiliate Hotel vs. Branded Hotel conflicts, but no formal protocol or criteria are disclosed.

### 3. Where a Prior or Manual Run May Still Be Stronger

- **Auditor firm name**: A manual reader would have seen the Citrin Cooperman letterhead immediately on p.86 without needing image fallback. Our automated text extraction missed it entirely.
- **TX Table 3 count interpretation**: A manual reader would likely have recognized "21" as an OCR error on first read, rather than needing cross-reference validation against Table 1 and E-1 to confirm.
- **Formation state research**: A manual reader might investigate whether the entity was originally formed in Washington and later redomiciled to Wyoming, potentially checking the WY Secretary of State records — which is beyond the scope of this single-PDF extraction.

### 4. Optional Max-3 Follow-Up Roadmap

1. **Auditor confirmation**: Verify Citrin Cooperman & Company, LLP is a registered CPA firm via public lookup. Target: `RT_verify_auditor.json`.
2. **Formation state clarification**: If WY/WA SOS records are accessible, confirm formation/redomiciliation history. Target: `RT_verify_formation_state.json`.
3. **Affiliate Hotel count**: If Magnuson Company's Affiliate Hotel count is publicly available, quantify the competitive overlap. Target: `RT_research_affiliate_hotels.json`.

### 5. Unresolved Taxonomy

**Document-internal inconsistencies:**
- U4: Formation state ambiguity — WA (Note 1) vs WY (Item 1) (low severity)
- U5: TX outlet count OCR artifact — "21" vs "2" (low severity, corrected)
- C2: Formation state contradiction (open)

**Business-risk flags:**
- U1: Parent license termination risk — 6 months' notice without cause (high severity)
- U2: Affiliate Hotel competition — no formal conflict resolution protocol (medium severity)
- U3: Former franchisee confidentiality restrictions — scope unclear (medium severity)

**Extraction-depth gaps:**
- None.

### 6. Buyer-Trust Assessment

A serious buyer evaluating a Magnuson Hotels or Magnuson Grand franchise would find this run comprehensive and reliable as a standalone diligence resource. All 23 Items and all 9 exhibits have been read in full; the franchise agreement has been clause-walked in detail; financial statements have been extracted to the note level with the auditor confirmed; and state addenda have been structured into actionable override families. The run surfaces the high-risk characteristics of this early-stage system — a $31K balance sheet, 7-state fee deferral, no territory, no FPR, and a terminable trademark license — in a clear, evidence-grounded manner. The three open business-risk flags (license risk, affiliate competition, former-franchisee gag) are genuine disclosed risks rather than extraction failures. A buyer would still want to independently contact existing franchisees and verify the franchisor's financial condition, but this run provides a solid foundation for that diligence.

### 7. Source-Grounding Compliance

All weaknesses, gaps, and "prior run stronger" claims above cite exact source pages or section identifiers. No unsourced claims.
