# 17 Conflict Adjudication — Shadow Fresh Ivybrook 2025

Direct-source adjudication of every legal/economic disagreement between this run (A) and the manual live run (B `runs/ivybrook-academy-2025/`) plus the gold corpus (C) and learning report (D). All decisions grounded in primary PDF page reads from existing artifacts.

---

## CA-01 — Initial term

| Source | Value | Citation |
|---|---|---|
| **A Shadow** | **15 years** | Item 17(a) p38 — A `03_tables.json` table `item17_relationship` row "a. Length of franchise term": "15 years"; A `09_final_canonical.json` `term_renewal_transfer_default.initial_term`: "15 years" |
| B Manual | 10 years | B `14_run_summary.json` `initial_term_years: 10`; B `08_final_report.md` "Term: 10 years + up to 2 renewal terms of 10 years each (FA §4.2 operative; Item 17 summary under-stated)" |
| Gold | not tracked | — |
| Learning | not tracked | — |

**Direct-source verification (from already-extracted PDF text):**
- FA §4.1 p62: "The initial term of this Agreement shall expire on the **15th anniversary** of the date that Franchisee opens the Franchised Business to the public ('Initial Term')."
- Item 17(a) p38 (relationship table summary): row "a. Length of franchise term — FA: 4.1 — **The term is 15 years**."

**Adjudication: A is correct.** Initial term is **15 years**, not 10. B's claim that "Item 17 is under-stated" is false — both Item 17(a) and FA §4.1 say 15 years and agree with each other. B introduced a factual error and then defended it with a fabricated source quotation.
**Classification: 4 — manual extraction error in B.** Recommended upstream correction: change `runs/ivybrook-academy-2025/14_run_summary.json` `initial_term_years` from `10` to `15`, and update B's `08_final_report.md` accordingly.

---

## CA-02 — Renewal contradiction C-02

| Source | Position | Citation |
|---|---|---|
| **A Shadow** | No contradiction exists; Item 17(b) and FA §4.2 agree | A `03_tables.json` table `item17_relationship` row "b. Renewal or extension of term": "Two additional terms of 10 years each" |
| B Manual | Claims contradiction: Item 17(b) says "1 renewal of 10 years", FA §4.2 says "max 2 renewals of 10 years each" — adjudicates in favor of FA | B `17_conflict_adjudication.md` priority field 3, B `09_final_canonical.json` regression annotation |

**Direct-source verification:**
- Item 17(b) p38–39 verbatim: "**You may renew for two (2) additional terms of 10 years each.**"
- FA §4.2 p63: "Franchisee's right to a successor franchise is for a maximum of **two renewal terms of 10 years each** (each a 'Renewal Term')."

**Adjudication: A is correct.** Both Item 17(b) and FA §4.2 say two renewals of 10 years each. They agree. **C-02 is a fabricated contradiction in B** — B's `17_conflict_adjudication.md` quotes Item 17(b) as saying "one additional 10-year term", which does not appear anywhere in the PDF. The corresponding adjudication, regression annotation, and patch entry in B should all be removed upstream.
**Classification: 4 — fabricated contradiction in B.** A correctly preserves no C-02 contradiction.

---

## CA-03 — State addenda list

| Source | Value | Citation |
|---|---|---|
| **A Shadow** | **IL, MN, VA** | A `04_exhibits.json` exhibit B; A `15_publish_gate.md`; direct read of pages 133, 135, 137 |
| B Manual | IL, MN, MI | B `10_scorecard.md` "State Addenda — COMPLETE — IL, MN, MI"; B `14_run_summary.json` does not enumerate |
| Gold | not tracked | — |
| Learning | not tracked | — |

**Direct-source verification (page-header titles read from PyMuPDF text layer):**
- p133: "EXHIBIT B TO THE DISCLOSURE DOCUMENT — MULTI-STATE ADDENDA TO FRANCHISE AGREEMENT, MULTI-UNIT DEVELOPMENT AGREEMENT, AND DISCLOSURE DOCUMENT — **ILLINOIS ADDENDUM**"
- p135: "**MINNESOTA ADDENDUM** TO FRANCHISE AGREEMENT, MULTI-UNIT DEVELOPMENT AGREEMENT, AND DISCLOSURE DOCUMENT"
- p137: "**VIRGINIA ADDENDUM** TO FRANCHISE AGREEMENT, MULTI-UNIT DEVELOPMENT AGREEMENT, AND DISCLOSURE DOCUMENT — Risk Factor: Estimated Initial Investment. The franchisee will be required to make an estimated initial investment ranging from $540,700 to $869,860. This amount exceeds the franchisor's stockholder's equity as of December 31, 2024, which is $345,862."
- Pages 5–6: "THE FOLLOWING PROVISIONS APPLY ONLY TO TRANSACTIONS GOVERNED BY THE MICHIGAN FRANCHISE INVESTMENT LAW" — Michigan provisions are **front-matter notice text only**, not an Exhibit B addendum.

**Adjudication: A is correct.** The three Exhibit B addenda are Illinois, Minnesota, and Virginia. Michigan does not have an Exhibit B addendum in this FDD. B's "MI" entry is an extraction error.
**Classification: 4 — manual extraction error in B.**

**Material downstream impact**: B's MI mistake caused B to miss the VA stockholder's equity disclosure ($345,862), which is the single quantitative anchor for the cover Special Risk #2 financial-condition flag. B has the $345,862 number elsewhere but does not attribute it to the VA addendum.

---

## CA-04 — Item 21 stockholder's equity attribution

| Source | Value | Source attribution |
|---|---|---|
| **A Shadow** | $345,862 as of 12/31/2024 | Virginia addendum risk factor (p137) |
| B Manual | $345,862 (present in narrative) | Source unclear in B's artifacts because B records addenda as IL/MN/MI |
| Gold | not tracked | — |

**Adjudication: A is correct.** $345,862 is disclosed in the Virginia addendum, which B does not list as present. A's attribution is the only correct one.
**Classification: 4 — attribution error in B (consequence of CA-03).**

---

## CA-05 — investmentHigh convention

| Source | Value | Convention |
|---|---|---|
| A Shadow (pre-fix) | $869,860 | single-unit only |
| A Shadow (post-fix in this pass) | both: $869,860 single-unit + $929,860 MUDA + system_wide=$929,860 | dual-format |
| B Manual | both: $869,860 + $929,860 + system_wide=$929,860 | dual-format |
| Gold | $929,860 | MUDA only |

**Direct-source verification (cover p1):**
- "The total investment necessary to begin operation of an Ivybrook Academy franchise is $540,700 to $869,860."
- "The total investment necessary to begin operation of your first Ivybrook Academy franchise under the Multi-Unit Development Agreement is $575,700 to $929,860."

**Adjudication: Both values are real; A and B agree post-fix.** Gold uses MUDA convention which is one defensible choice; both values should be exposed for any downstream consumer.
**Classification: 3 — convention difference, not extraction error.** Resolved in this pass via RPL-002 (`investment_convention_keys` block in `11_canonical_enriched.json`).

---

## CA-06 — Litigation flag

| Source | Value | Citation |
|---|---|---|
| **A Shadow** | false | Item 3 p11: "No litigation is required to be disclosed in this Item." |
| **B Manual** | false (run); flagged as gold-error annotation | B `19_reconciliation_patch_log.json` |
| Gold | **true** ✗ | `normalized_gold.jsonl` |

**Adjudication: A and B agree; gold is wrong.**
**Classification: 4 — gold-source error.** A inherits B's annotation in `19_reconciliation_patch_log.json` (RPL-003).

---

## CA-07 — Bankruptcy flag

| Source | Value | Citation |
|---|---|---|
| **A Shadow** | false | Item 4 p11: "No bankruptcy information is required to be disclosed in this Item." |
| **B Manual** | false (run); flagged as gold-error annotation | B `19_reconciliation_patch_log.json` |
| Gold | **true** ✗ | `normalized_gold.jsonl` |

**Adjudication: A and B agree; gold is wrong.**
**Classification: 4 — gold-source error.** A inherits B's annotation in `19_reconciliation_patch_log.json` (RPL-004).

---

## CA-08 — Item 19 cohort size for 3Y+ (Table 2C vs Table 3)

| Source | Position |
|---|---|
| **A Shadow** | Preserves contradiction explicitly: Table 2C header says 18; Table 3 narrative + row sum = 19 |
| B Manual | Notes as "low impact" carry-forward in `08_final_report.md`; not preserved as structural unresolved |

**Direct-source verification:**
- Table 2C header p47: "TABLE 2C: EBITDA OF FRANCHISEES OPEN THREE OR MORE YEARS (OPENED BEFORE JAN 1, 2022)" with cohort labeled "18 franchisee-owned schools".
- Table 3 narrative p49: "the **19** franchisee-owned schools who have been operating 3 Years +".
- Table 3 rows: 5 classrooms (n=4) + 6 classrooms (n=13) + 7 classrooms (n=2) = **19**.

**Adjudication: A is correct to preserve as a structural document-level contradiction.** Both numbers are directly surfaced; the document itself is internally inconsistent. No extraction can reconcile it.
**Classification: 5 — FDD drafting inconsistency, no extraction error on either side.**

---

## CA-09 — Gross Revenue definition

| Source | Position |
|---|---|
| **A Shadow** | Preserves as contradiction: Item 6 Note 2 includes business interruption insurance proceeds; Item 19 Note 3 omits this |
| B Manual | Not preserved as a contradiction |

**Direct-source verification:**
- Item 6 Note 2 p17: "'Gross Revenues' means all revenue generated from the Franchised Business and from any operations at the accepted location, whether for check, cash, credit or otherwise **including, without limitation, all proceeds from any business interruption insurance**, but excluding (a) any revenue you refund to a customer (b) any sales and equivalent taxes..."
- Item 19 Note 3 p49: "'Gross Revenues' means all the revenue received (including tuition for services, grant revenue, and product sales), less any sales and equivalent taxes."

**Adjudication: A is correct to preserve.** The two definitions in the same FDD differ on whether business interruption insurance proceeds are included. Material when running royalty/Brand Fund calculations on insurance recoveries.
**Classification: 5 — FDD drafting inconsistency, surfaced in A only.** Recommend B add this contradiction.

---

## CA-10 — Exhibit K vs Exhibit L labeling

| Source | Position |
|---|---|
| **A Shadow** | Preserves as document-level contradiction with dedicated retry artifact `08c_retry_exhibit_label_confirmation.md`; explicitly attributes which sources say which |
| B Manual | Notes "Exhibit K labeling — Referenced in text but actual exhibits use different labels (J for financials, L for franchisees)" as low-impact carry-forward |

**Adjudication: A is more rigorous; both runs identify the issue. Parity on coverage, A wins on structural preservation.**
**Classification: 5 — FDD drafting inconsistency, no extraction error.**

---

## Summary of adjudications

| ID | Field | Winner | Classification |
|---|---|---|---|
| CA-01 | Initial term (15 vs 10 years) | **A** | B extraction error |
| CA-02 | Renewal C-02 contradiction | **A** | B fabricated contradiction |
| CA-03 | State addenda list (IL/MN/VA vs IL/MN/MI) | **A** | B extraction error |
| CA-04 | Stockholder's equity attribution | **A** | B attribution error (consequence of CA-03) |
| CA-05 | investmentHigh convention | tie post-fix | Convention difference; resolved by dual-format keys |
| CA-06 | Litigation flag | A=B; **gold wrong** | Gold-source error |
| CA-07 | Bankruptcy flag | A=B; **gold wrong** | Gold-source error |
| CA-08 | Item 19 3Y+ cohort 18 vs 19 | **A** preserves; B does not | FDD drafting inconsistency |
| CA-09 | Gross Revenue definition | **A** preserves; B does not | FDD drafting inconsistency |
| CA-10 | Exhibit K/L labeling | A more rigorous | FDD drafting inconsistency |

**Net**: A wins 8 of 10 adjudications (CA-01 through CA-04, CA-08 through CA-10). CA-05 ties post-fix. CA-06/CA-07 tie against a wrong gold. **No adjudication resolved against A.**
