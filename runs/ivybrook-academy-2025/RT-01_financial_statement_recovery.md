# RT-01: Financial Statement Deep Read — Ivybrook Academy

## Attempt Summary

All 30 pages of Exhibit J (pp. 168–197) were examined using multiple extraction methods:
- PyMuPDF text extraction: Only header text ("FINANCIAL STATEMENTS" on p. 168) extracted. All other pages return zero text characters.
- PyMuPDF block extraction: Each page has 3–5 blocks, but all are image blocks, not text.
- Image detection: Every page contains 2–5 embedded images (scanned page images).
- pdfplumber extraction: Returns only exhibit headers — no financial data.

## Conclusion

**The financial statements are fully image-based (scanned).** No text is extractable via any available Python library. OCR would be required to extract content, but no OCR tools are available in this environment.

## What Is Known From FDD Text (Not From Exhibit J Itself)

- **Periods covered:** FY2022, FY2023, FY2024 (Item 21, p. 53)
- **Fiscal year end:** December 31
- **Audited:** Item 21 says "audited financial statements" — auditor identity unknown
- **Financial condition concern:** Special Risk #2 states financial condition "calls into question the Franchisor's financial ability to provide services and support to you" (p. 4)
- **Illinois fee deferral:** Illinois Attorney General imposed fee deferral "due to Franchisor's financial condition" (Exhibit B, p. 133)

## Fields Not Directly Surfaced

- Auditor name and opinion type
- Going concern language
- Total revenue / franchise fee revenue / royalty revenue
- Net income or net loss
- Total assets
- Total liabilities
- Members' equity or deficit
- Cash and cash equivalents
- Deferred revenue
- Notes to financial statements
- Any material contingencies

## Status

**not_directly_surfaced** — Documented as limitation. Requires OCR or manual review.
