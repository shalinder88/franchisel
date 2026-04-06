# Retry R1 — Exhibit J Financial Statements Deep Read

## Status: NOT RECOVERED — tool limitation

## Attempted path
1. PyMuPDF (`fitz`) text extraction on pages 168–197 — returns only the running header "EXHIBIT J TO THE DISCLOSURE DOCUMENT" and the document reference string "4421206v3.RWT.30864.G56954". All numeric line items and statement text reside in embedded raster images, not in the text layer.
2. Structural inspection of page objects:
   - p168: 4 embedded images, 176 characters of text layer content, 2 drawings
   - p169: 4 embedded images, 70 characters of text layer content, 1 drawing
   - p170: 5 embedded images, 72 characters of text layer content, 1 drawing
   - p171: 4 embedded images, 72 characters of text layer content, 1 drawing
   - p172: 3 embedded images, 72 characters of text layer content, 1 drawing
   - p180: 3 embedded images, 68 characters of text layer content, 1 drawing
   - p197: 3 embedded images, 70 characters of text layer content, 1 drawing
   This confirms the financial statements were rendered as raster images rather than searchable text.
3. OCR fallback: neither the `tesseract` binary nor the `pytesseract` Python binding is installed in this environment; `poppler-utils` (`pdftoppm`) is also not available. No OCR path is available in-session.
4. Indirect recovery: the Virginia addendum (p137) discloses stockholder's equity of $345,862 as of December 31, 2024, and Item 8 body (p22) discloses franchisor 2024 total revenue of $2,171,363. These two structural figures are the only quantitative financial facts directly surfaced; no other balance sheet, income statement, or cash flow line items can be confirmed from extracted text.

## What remains not directly surfaced
- Auditor firm identity, city, and license information
- Audit opinion language (standard unqualified / qualified / going-concern modification)
- Signature date of audit report
- Balance sheet line items (cash and equivalents, accounts receivable, fixed assets, total assets, liabilities breakdown, members' equity reconciliation)
- Full income statement (revenue breakdown, operating expenses, non-operating items, net income)
- Statement of cash flows
- Statement of members' equity (roll-forward)
- Notes to financial statements including accounting policies, related-party transactions (affiliate activity), subsequent events
- Any reference in subsequent events to the August 29, 2025 Crux/OpCo acquisition (note: acquisition post-dates the fiscal period ending December 31, 2024, so may or may not appear depending on audit report signature date)

## Indirect signals preserved
- Cover Special Risk #2: "The Franchisor's financial condition as reflected in its financial statements (see Item 21) calls into question the Franchisor's financial ability to provide services and support to you."
- Illinois addendum (p134): franchisor must defer collection of initial franchise and development fees "due to our financial condition" — explicitly imposed by the Illinois Attorney General's Office.
- Virginia addendum (p137) risk factor: initial investment $540,700–$869,860 exceeds stockholder's equity of $345,862 as of December 31, 2024.
- Private-equity acquisition of Ivybrook Franchising on August 29, 2025 by Crux I Ivybrook (Aggregator), LP via Ivybrook HoldCo and Ivybrook OpCo — disclosed in Item 1 body but not yet reflected in the FY2024 financial statements.

## Disposition
This retry is documented as an unrecoverable limitation in this extraction environment. The financial condition-related conclusions surface through the direct cover Special Risk, the Illinois deferral, the Virginia stockholder's equity disclosure, and the Item 8 revenue disclosure. A production pipeline with tesseract or a server-side OCR microservice should rerun R1 against pages 168–197 to complete this retry.
