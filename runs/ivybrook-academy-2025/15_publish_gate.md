# Publish Gate — Ivybrook Academy FDD (637976-2025)

## Verdict: 2 — Publish-ready with caveats

---

## Family-by-Family Assessment

### Item 19 — Financial Performance Representation
**PASS.** Exceptionally complete. Four tables extracted with full row-level detail: revenue stream ranges (Table 1), affiliate EBITDA (Table 2A), franchisee EBITDA for 2yr+ and 3yr+ cohorts (Tables 2B/2C), and gross revenue by classroom count (Table 3). All six notes captured. Sample sizes, at-or-above counts, and expense-line percentages all structured. This is among the stronger Item 19 disclosures in the pipeline. No recovery needed.

### Item 20 — Outlets and Franchise Information
**PASS.** All five tables fully extracted with state-level detail across three years. Systemwide summary, transfers (zero), franchised status, company-owned status, and projected openings — all complete. Former franchisee detail promoted from Exhibit L (8 entries, 3 ceased communication). Signed-not-opened count (42) confirmed and cross-referenced with Special Risk #4. No recovery needed.

### Item 21 — Financial Statements
**CONDITIONAL PASS.** The 30-page Exhibit J is entirely scanned images. Two separate extraction methods (PyMuPDF, pdfplumber) confirmed zero extractable text on all pages. Auditor identity, financial highlights, going concern language, and all balance sheet / income statement figures are unknown. This is a genuine tooling limitation, not an extraction oversight — the PDF embeds images, not text layers. The pipeline has documented the gap thoroughly and extracted everything inferrable from the FDD text itself: (a) periods covered (FY2022–2024), (b) fiscal year end (Dec 31), (c) audited status confirmed, (d) financial condition dual-flagged by Special Risk #2 and Illinois AG fee deferral, (e) partial related-party and revenue-recognition inferences from FA text.

**Risk assessment:** The financial condition flags are business-risk signals, not extraction gaps — the FDD itself tells the reader the financial condition is concerning. A buyer seeing this brand page will know the franchisor's own disclosure raises the flag. The missing data (auditor name, total assets, net income) would strengthen the page but their absence does not create a false impression because the caveat is explicitly surfaced.

### State Addenda
**PASS.** Illinois (fee deferral, governing law, venue), Minnesota (termination notice, trademark, release, jury trial), and Michigan (front matter provisions) all extracted. State effective dates page captured. The addenda that are present in the PDF are fully covered. No evidence of additional addenda missing from extraction.

### Key Exhibit Sufficiency
**PASS.** All exhibits with extractable text are fully cataloged and structurally read:
- Franchise Agreement (78 pages): full text extracted, 40 contract burdens structured in depth pass
- MUDA: development schedule, default, conditions — complete
- Guaranty: unlimited, irrevocable, joint and several — complete
- NDA/NCA: both non-solicitation and non-competition variants identified and read
- General Release: sample form, California §1542 waiver — complete
- Lease Rider: franchisor cure rights, option to lease, de-identification — complete
- Franchisee List: open (35 entries), not-yet-opened (42), former (8), ceased communication (3) — complete
- Operations Manual TOC: 242 pages, 6 sections — complete

Only Exhibit J (financial statements) is not extractable, and that is a known image-only limitation.

### Unresolveds: Extraction Gaps vs. Business-Risk Flags

| ID | Nature | Publish impact |
|----|--------|---------------|
| U-01 | **Tooling limitation** — Exhibit J image-only | Caveat on page; not an extraction error |
| U-02 | **Document quirk** — Exhibit K label inconsistency | Cosmetic; does not affect data quality |
| U-03 | **Minor text discrepancy** — 19 vs 18 school count in Item 19 | Cosmetic; documented as contradiction |
| U-04 | **Resolved** — Pages 154–160 mapped in RT-03 | No longer unresolved |
| U-05 | **Business-risk flag** — Brand Fund not audited | Surfaced as diligence signal; not an extraction gap |

None of the unresolveds represent extraction failures that would mislead a reader. U-01 is a tooling constraint. U-05 is a legitimate business-risk observation the page should surface.

### Does Any Missing Family Materially Weaken Buyer Trust?

**No.** The brand page will deliver:
- Complete fee economics (Items 5, 6, 7) with structured detail
- Rich unit-level EBITDA data (Item 19) including expense-line breakdown
- Full outlet history with zero terminations (Item 20)
- Complete contract burden profile (40 clauses structured)
- Territory, noncompete, transfer, guaranty mechanics
- Franchisee contact list for diligence calls
- Clear caveat that financial statements are image-only and that the franchisor's own FDD flags financial condition concerns

The single gap (Exhibit J content) is a limitation a buyer can verify independently by requesting the PDF and reading the scanned pages. The page explicitly flags the financial condition risk, which is more useful than silently omitting it.

## Caveats for Publication

1. **Financial statements caveat required.** The brand page must display a clear notice that audited financial statements were not text-extractable from this PDF and that the FDD's own Special Risks page flags franchisor financial condition. Recommended language: *"Financial statements (Exhibit J) are scanned images in this filing. Auditor identity and financial metrics could not be extracted. The FDD discloses a Special Risk regarding the franchisor's financial condition, and the Illinois Attorney General imposed a fee deferral requirement due to this condition. Prospective franchisees should review the financial statements directly."*

2. **Renewal term contradiction caveat.** Item 17 summary says 1 renewal; FA §4.2 says maximum of 2 renewals. The page should present the FA language as the governing provision and note the discrepancy.

3. **Brand Fund increase pending.** The page should note that the 1% Brand Fund contribution is expected to rise to 2% in 2026, which will increase minimum recurring fees from 9% to 10% of Gross Revenue.

## Recovery Pass Needed?

**No.** All three depth tasks are complete. The sole remaining gap (Exhibit J images) cannot be resolved without OCR tooling that is not available in this environment. A recovery pass would not improve coverage. The run is publish-ready with the caveats above.
