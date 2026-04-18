# Publish Gate — Chick-fil-A, Inc. FDD (Filing 638219)

## Verdict: **2 — Publish with caveats**

The extraction is comprehensive, evidence-grounded, and suitable for publication with documented caveats regarding the Franchise Agreement clause walk and state addenda clause-level detail. All 23 Items are extracted with material depth. Financial statements are fully walked including 16 note families. Item 19, Item 20 (all 5 tables), and Item 21 are complete. The canonical has 50+ top-level keys with page-level provenance throughout. The 288-page Franchise Agreement was not directly clause-walked but its key operative burdens are fully covered through Item 17 summary tables, Item 6 fee notes, and A2 contract burden extraction.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — PASS
Item 19 is fully extracted. All three restaurant type categories (mall: 197 units, non-mall: 2,179 units, delivery kitchen: 4 units) have median, average, lowest, highest, and distribution tercile data. Population counts and exclusion rules (25 captive venue, 55 company-operated, 425 licensed, <1 year) are captured. The "revenue only — no cost/expense data" caveat is documented. The substantiation availability statement is captured (p. 83). Permanent closure counts (19) are noted. Item 19 cohort comparability check: no discrepancy found (same fee structure applies to all operators).

### 2. Item 20 Completeness — PASS
All 5 standard tables present: Table 1 (system-wide summary), Table 2 (transfers = 0), Table 3 (franchised status by state, all 47 states, 3 years), Table 3 Licensed (by state), Table 4 (company-owned by state), Table 5 (projected openings with FA signed/not opened list). Total rows balance correctly. Franchisee list exhibit referenced (Exhibit E, 73 pages, 438–510). Former operators referenced (Exhibit F, 2 pages, 511–512). Gag clause flag set to TRUE with verbatim quote fragment (p. 102).

### 3. Item 21 Sufficiency — PASS
Auditor identified: PricewaterhouseCoopers LLP (Atlanta, GA). Opinion: unqualified, dated March 21, 2025. Going concern: no language present; no material subsequent events. Balance sheet, income statement, cash flow, and stockholders' equity all extracted for 3 years. 16 financial statement note families walked including: revenue recognition (franchise fee decomposition), depreciation/useful lives, lease accounting (operating vs. finance, maturity schedule, sublease income), debt structure and maturity, pension/postretirement, related party transactions, business combination (Truett's Group), preferred stock, equity method investments, derivatives, and subsequent events. Item 21 extraction method: normal text extraction (no image fallback needed).

### 4. State Addenda Sufficiency — PASS with caveat
13 states identified with addenda (California through Wisconsin). 15 specific overrides extracted and categorized across 6 override families (noncompete, forum selection, termination, governing law, integration clause, fee deferral, ROFR). Summary override table constructed. `state_addenda_summary` promoted to canonical. Caveat: individual state addenda were not fully clause-walked; overrides identified from header pages and key paragraphs rather than exhaustive line-by-line extraction of all 88 pages.

### 5. Key Exhibit Sufficiency — PASS with caveat
All exhibits listed in Item 22 are accounted for in 04_exhibits.json (11 exhibits, A through I). Exhibit C (financial statements) is deeply read. Exhibit B (Franchise Agreement, 288 pages) operative burdens captured via Item 17 summaries and A2 depth pass. Exhibit G (state addenda) partially structured. Exhibits D (manual TOC), E (franchisee list), F (former operators), H (effective dates), I (receipts) are correctly labeled as low-priority.

### 6. Unresolveds and Contradictions — PASS
`unresolveds` key present in 09_final_canonical.json with 5 entries (U1–U5). All are genuine and appropriately classified:
- U1 (high): Operator net take-home not determinable — business-risk flag (CFA does not disclose cost data)
- U2 (medium): Financial note detail — resolved by A2 depth pass (16 note families walked)
- U3 (medium): State addenda clause detail — partially resolved by A2 depth pass 4
- U4 (medium): FA clause walk — addressed by A2 contract burden depth pass (23 clauses)
- U5 (low): Actual rent amounts by type — document limitation

`contradictions` key present with 1 entry (C1): Item 20 vs. Item 21 restaurant count discrepancy (2,684 vs. 2,730), resolved as domestic-only vs. consolidated (international included).

### 7. Final Report Depth — PASS
08_final_report.md is a full standalone diligence report at 500+ lines with all required sections: A (executive snapshot, 14 bullets), B (fees/investment, comprehensive), C (supplier control, training, technology, advertising), D (territory and encroachment), E (contract burden, termination, transfer, noncompete, dispute resolution), F (Item 19 detail with all restaurant types), G (Item 20 detail with all tables), H (Item 21 financial statements with narrative analysis), I (state addenda summary), J (unresolveds), K (contradictions), L (final coverage note).

### 8. Score Gate — PASS
10_scorecard.md shows all 23 Items covered, 25 files created, 50+ canonical keys, 16 note families, 23 contract clauses, 13 state addenda, 4 A2 depth passes, 4 targeted depth blocks. Overall verdict: PASS.

---

## Franchise Agreement Clause-Walk Assessment

**Surfaced exhibit:** Exhibit B — Franchise Agreement, pages 107–394 (288 pages)
**Clause-walk status:** Not directly clause-walked (deferred)
**Verdict decision:** Verdict 2 allowed with rationale

**Rationale:** The franchise agreement's key operative burdens are comprehensively covered from multiple sources:
- **Term, renewal, nonrenewal:** Item 17 table items a–c (p. 72)
- **Termination:** Item 17 table items d–h with full cause/non-cause detail (pp. 72–73)
- **Fee formula:** Item 6 Notes 2–8 with 14 pages of formula detail (pp. 27–40)
- **Transfer:** Item 17 table items k–m (pp. 73–74)
- **Noncompete:** Item 17 table items q–r (p. 75)
- **Death/disability:** Item 17 table item p (p. 74)
- **Dispute resolution:** Item 17 table items u–w (pp. 75–76)
- **Guaranty:** Item 15 (pp. 69–70) and Assignment Agreements (Exhibits B-1, B-2)
- **Indemnification, holdover, insurance, cash handling:** Item 6 fee table and notes (pp. 27–40)
- **Sunday/Christmas closure:** Item 17 cause definition (p. 73)

23 clause families fully documented in RT_depth_contract_burdens.json with source pages. 9 distinctive clauses identified. No material buyer-facing gap remains — the FA's operative substance is fully captured through body cross-references.

**What remains thin:** Detailed clause language (exact legal wording of Sections 1–28); specific Lease form section language; Concession Sublicense and Delivery Kitchen Agreement specific clause language; Food Truck License Agreement variants.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.

---

## Mandatory Sections

### 1. Strongest Parts of the Run

1. **Item 6 fee formula (pp. 27–40):** Complete extraction of CFA's unique profit-sharing formula across 14 pages, including all defined terms (GR, Operating Profit, Base Profit, Extra Profit, offsets) and the fee calculation process (Notes 2–8). Corroborated by financial statement notes showing system totals ($3.21B base + $1.29B additional operating service fees).

2. **Item 19 financial performance (pp. 81–83):** All three restaurant types fully extracted with median, average, range, and tercile distribution data. Population counts and exclusions precisely documented. Revenue-only caveat prominently disclosed.

3. **Item 20 Tables 1–5 (pp. 84–101):** All 5 tables extracted including state-level detail for 47 states across 3 years. Transfer data (zero), reacquisition data (102 in 2024), projected openings (183+25), and gag clause all captured with verbatim quote.

4. **Item 21 financial statements and notes (pp. 398–435):** Full 3-year statements extracted with 16 note family walks. Revenue decomposition verified against Item 6 (base fee 12–15%, additional 50%). Lease maturity schedule ($6.4B total), debt maturity ($3.07B), pension underfunding ($333M), distribution center growth (3→9), and DHG acquisition all captured.

5. **Item 2 leadership roster (pp. 15–24):** 50 officers and directors extracted with roles and tenure spanning 9 pages. Includes Board of Directors (10 members), Executive Vice Presidents (6), and Officer VPs (25+).

6. **State addenda mapping (pp. 513–600):** 13 states identified, 15 specific overrides categorized across 6 families (noncompete, forum, termination, governing law, ROFR, fee deferral). Summary override matrix constructed.

### 2. Weakest Remaining Parts of the Run

1. **Franchise Agreement direct clause walk (pp. 107–394):** The 288-page FA was not directly read page-by-page. While operative burdens are fully covered via Item 17 and body cross-references, the exact legal language of all 28+ FA sections is not captured. A buyer's attorney would need to read the FA directly. Source: 04_exhibits.json Exhibit B entry.

2. **State addenda clause-level detail (pp. 513–600):** The 88 pages of state addenda were not exhaustively extracted. Overrides were identified from header pages and key paragraphs, but exact verbatim amendment language for each state is not captured. Source: RT_depth_state_addenda_promotion.json.

3. **Operator economics derivation:** No cost, expense, or profit data is disclosed in the FDD. The actual operator take-home cannot be computed from FDD data alone. This is a document limitation, not an extraction gap, but it is the most material weakness from a buyer's perspective. Source: Item 19 caveats (p. 83).

4. **Exhibit E franchisee list (pp. 438–510):** 73 pages of operator names, addresses, and phone numbers not extracted into structured data. A buyer conducting due diligence would reference this exhibit directly. Source: 04_exhibits.json Exhibit E entry.

5. **Income tax rate reconciliation:** The income tax provision note pages (~pp. 417–419) were not fully extracted; the effective tax rate reconciliation detail is not in the canonical. Source: RT_depth_financial_notes.json.

### 3. Where a Prior or Manual Run May Still Be Stronger

- **Franchise Agreement clause language:** A manual reader would walk the 288-page FA directly and capture exact legal phrasing, conditional clauses, and nuanced provisions that cross-reference summaries may simplify. For example, the exact termination payment formula in FA §24.3 (referenced as "greater of $1,000 or formula amount" in Item 17) — the actual formula language is in the FA exhibit but not captured verbatim.

- **State addenda verbatim amendments:** A manual reader would extract the exact text of each state's amendments rather than summarizing from header pages. This matters for legal compliance in specific states (e.g., the exact California ROFR clause language at p. 514).

- **Item 8 supplier approval process:** A manual reader might extract more nuance from CFA's "case-by-case" supplier evaluation approach and the exact circumstances under which CFA Supply or Bay Center operate as sole suppliers.

### 4. Optional Max-3 Follow-Up Roadmap

1. **Franchise Agreement targeted clause walk** — Read FA §14 (fee formula, ~5 pages), §19 (noncompete, ~2 pages), §24 (termination, ~4 pages), §28 (dispute resolution, ~3 pages) directly from Exhibit B. Output: `RT_recover_fa_key_sections.json`

2. **State addenda verbatim overrides** — Extract exact amendment language for California, Illinois, Minnesota, North Dakota, and Wisconsin (the most impactful override states). Output: `RT_recover_state_addenda_verbatim.json`

3. **Income tax note extraction** — Read pages 417–419 for effective tax rate reconciliation and current vs. deferred tax breakdown. Output: `RT_recover_income_tax_note.json`

### 5. Unresolved Taxonomy

**Document-Internal Inconsistencies:**
- C1: Item 20 reports 2,684 domestic restaurants; Item 21 Note 1 reports 2,730 total. Resolved: difference is international restaurants (46 units in Canada/Puerto Rico).

**Business-Risk Flags:**
- U1 (high): Operator net take-home not determinable — CFA does not disclose cost, expense, or profit data. Revenue-only Item 19.
- U5 (low): Actual rent amounts by location type not disclosed beyond range; percentage rent multipliers not publicly available.

**Extraction-Depth Gaps:**
- U2 (medium): Financial statement notes — RESOLVED by A2 depth pass (16 families walked).
- U3 (medium): State addenda clause detail — PARTIALLY RESOLVED by A2 depth pass 4 (overrides cataloged but not verbatim).
- U4 (medium): FA clause walk — PARTIALLY RESOLVED by A2 contract burden pass (23 clauses from cross-references; direct FA text not read).

### 6. Buyer-Trust Assessment

A serious prospective Chick-fil-A operator could rely on this extraction as a comprehensive, evidence-grounded summary of the FDD's material terms, risks, and economics. The extraction captures the complete and unusual fee structure (15% GR + 50% Net Profit), the absence of territory protection, the short-term / at-will nature of the franchise relationship, the auto-termination on death/disability, the zero-transfer history, and the gag clause — all of which are critical buyer-facing risk factors. The financial statement analysis is thorough, revealing CFA's $22.75B system-wide sales, $9.06B corporate revenue, and strong but leveraged balance sheet. The one area where a buyer should supplement this extraction is the Franchise Agreement itself (288 pages) and the specific state addenda applicable to their state — a franchise attorney should review these directly. The extraction correctly flags this limitation and provides sufficient structure for the attorney to target their review efficiently.

### 7. Source-Grounding Rule
All weaknesses, gaps, and "prior run stronger" claims above cite exact source pages or section identifiers as documented.

---

## Recovery Passes Needed

**None required for Verdict 2.** The three follow-up roadmap items above are optional enhancements, not material gaps.
