# Publish Gate — LivSmart Studios by Hilton (638061-2025)

## Verdict: 2 — Publish with Caveats

---

## Rationale

This extraction is comprehensive and well-grounded. All 23 FDD items are fully extracted with evidence. The four depth passes are complete. All mandatory canonical families (unresolveds, contradictions, state_addenda_overrides) are populated. The final report is a full narrative diligence report covering all required sections. The caveats relate to the inherent nature of the FDD (brand-new concept with zero operating history) rather than extraction gaps.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness
- **Status**: PASS
- No FPR provided. The no-FPR statement is extracted verbatim: "We do not make any representations about a franchisee's future financial performance or the past financial performance of company-owned or franchised outlets."
- Contact for unauthorized representations captured (William Fortier).
- This is expected for a brand with zero operating hotels.

### 2. Item 20 Completeness
- **Status**: PASS
- All 5 standard tables present (systemwide summary, transfers, franchised status, company-owned status, projected openings).
- Total rows balance (all zeros for Tables 1-4, consistent with zero operating hotels).
- Table 5: 73 signed not opened, 2 projected openings, 0 company-owned. State-by-state breakdown present.
- Exhibit A franchisee count: 73 (matches Table 5).
- Exhibit B: None (consistent with zero operating history).
- Gag clause flag: Set. Statement captured verbatim.
- Confidentiality clause flag: No restrictions signed in last 3 fiscal years.

### 3. Item 21 Sufficiency
- **Status**: PASS
- Auditor identified: Cherry Bekaert LLP, Tysons Corner, VA
- Opinion: Unqualified (clean), dated March 18, 2025
- Going concern: No
- Balance sheet, income statement, cash flow: All extracted for 2024, 2023, 2022
- Notes to financial statements: All 9 notes extracted via Depth Pass 1
- Key financials: Revenue $1.502B, net income $1.488B, distributions $1.5B, total assets $1.27B

### 4. State Addenda Sufficiency
- **Status**: PASS
- 12 states identified with addenda (CA, HI, IL, MD, MI, MN, NY, ND, PR, RI, VA, WA)
- Both Exhibit D-1 (FA addenda) and Exhibit J-1 (FDD addenda) fully read
- Structured into `state_addenda_overrides` in 09_final_canonical.json with 30 override entries across 6 families
- Summary table of override families x states included

### 5. Key Exhibit Sufficiency
- **Status**: PASS
- All exhibits listed in Item 22 accounted for in 04_exhibits.json
- Financial exhibit (Exhibit C): Deep-read with all notes
- Franchise Agreement (Exhibit D): Deep-read via Depth Pass 2 with clause-by-clause burden extraction
- Guaranty (Exhibit E): Scope extracted via Retry R3
- HITS Agreement (Exhibit G): Cataloged; key terms well-covered by Items 5/6/11

### 6. Unresolveds and Contradictions Assessment
- **Status**: PASS
- 6 unresolveds documented (3 HIGH, 2 MEDIUM, 1 LOW)
- 1 contradiction documented (Note 9 date typo)
- Both families present as structured keys in 09_final_canonical.json
- All unresolveds are genuine business-risk flags, not extraction gaps:
  - U1: Trademark registration uncertainty (HIGH) — inherent to brand, not extractable
  - U2: Zero operating history (HIGH) — inherent to brand
  - U3: No FPR data (HIGH) — inherent to brand
  - U4: Program Fee spending breakdown (MEDIUM) — not disclosed in FDD
  - U5: Debt guarantee exposure (MEDIUM) — structural feature of entity
  - U6: Note 9 date error (LOW) — typographical error

### 7. Final Report Depth
- **Status**: PASS
- 08_final_report.md is a full narrative diligence report (~400+ lines)
- Contains all required sections: A (executive snapshot, 14 bullets), B (fees/investment), C (supplier/operations/tech), D (territory), E (contract burden/legal), F (Item 19), G (Item 20), H (Item 21 with key financial observations), I (state addenda summary with material overrides per state), J (unresolveds table), K (contradictions table), L (final coverage note)
- State addenda discussed in dedicated section I with overrides by state
- Item 21 financial statement summary included with 7 key financial observations
- Unresolveds and contradictions sections present

### 8. Score Gate
- **Status**: PASS
- Overall grade: B+
- All required items covered with A grades
- Exhibit coverage mostly A/B+
- Canonical fields populated with evidence grounding
- Depth passes complete with mandatory families enforced

---

## Caveats

1. **This is a brand with zero operating history.** All Item 20 tables show zeros. There are no operating franchisees to survey, no performance data to analyze, and no track record to evaluate. This is an inherent limitation of the FDD, not an extraction gap.

2. **Trademark registration pending.** The primary brand marks are unregistered. This is accurately documented but represents an ongoing business risk for any prospective franchisee.

3. **Note 9 date discrepancy.** Minor typographical error ("2024" vs "2025") in subsequent events note. Does not affect financial figures or audit opinion.

---

## Recovery Passes Needed

**None.** No material extraction gaps identified. All assessment items pass. Verdict is 2 (Publish with Caveats), not 3.
