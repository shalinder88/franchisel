# 07 Retry Tasks — Ivybrook Academy 2025 (Shadow Fresh)

## task_id: R1
- **task_name**: Financial statement deep read (Exhibit J OCR)
- **family**: financial statement deep read
- **exact target**: Exhibit J — audited financial statements for periods ending December 31, 2022, December 31, 2023, and December 31, 2024. Need auditor identity, audit opinion text (including any going-concern modification), balance sheet line items (particularly cash, total assets, total liabilities, members' equity reconciling to the $345,862 disclosed in the Virginia addendum), income statement (reconciling to the $2,171,363 total revenue disclosed in Item 8), statement of cash flows, statement of members' equity, and all notes including any subsequent events note that may reference the August 29, 2025 Crux/OpCo acquisition.
- **why it is needed**: The cover Special Risks call out financial condition as one of four highlighted risks. The Illinois addendum imposes fee deferral "due to our financial condition" at the explicit direction of the Illinois Attorney General's Office. The Virginia addendum discloses stockholder's equity ($345,862) substantially below the estimated initial investment ($540,700–$869,860). An August 29, 2025 private-equity acquisition by Crux I Ivybrook (Aggregator), LP is disclosed in Item 1 but likely post-dates the signed audit opinion and should appear only in a subsequent-events footnote if at all. These converging signals make Exhibit J's actual content materially diligence-relevant, but the PDF pages 168–197 are image-only in the PyMuPDF text layer and produce no extractable text in this pass.
- **likely source pages or source objects**: pages 168–197 of the PDF (Exhibit J)
- **expected output filename**: `08a_retry_exhibit_j_financials.md`

## task_id: R2
- **task_name**: Operations manual TOC deep read (Exhibit I detail)
- **family**: high-priority exhibit deep read
- **exact target**: Exhibit I, page 167 — the Table of Contents of the Confidential Brand Standards Manual, specifically the enumerated section list with "number of pages devoted to each section" referenced in the Item 11 body text ("The Table of Contents of the Confidential Brand Standards Manual, along with number of pages devoted to each section, is included as Exhibit I").
- **why it is needed**: Operations manual scope is one of the harder-to-compare diligence signals across brands, and the body text explicitly promises a page-count breakdown in Exhibit I. The cover page of Exhibit I is directly surfaced but the detailed section list is not extracted in structured form in this pass. May be extractable from the text layer but was not captured on initial scan.
- **likely source pages or source objects**: page 167 (Exhibit I)
- **expected output filename**: `08b_retry_exhibit_i_manual_toc.md`

## task_id: R3
- **task_name**: Exhibit K/L labeling confirmation (other material gap recovery — exhibit structure)
- **family**: other material gap recovery
- **exact target**: Confirm by re-reading pages 198–204 physical headers, TOC listing at page 7, Item 20 body text at page 53, and the "How to Use" Q&A at page 2 that the Exhibit K vs Exhibit L labeling inconsistency is a document-level error rather than an extraction artifact.
- **why it is needed**: The contradiction is already preserved in canonical output, but a labeling mismatch on a franchisee-list exhibit is itself a meaningful document-quality red flag for diligence purposes and should be confirmed, not silently merged.
- **likely source pages or source objects**: pages 2, 7, 53, 198, 199, 200, 201, 202, 203, 204
- **expected output filename**: `08c_retry_exhibit_label_confirmation.md`

No other retry tasks are needed. Litigation (R-none) is directly surfaced as empty per Item 3. Bankruptcy (R-none) is directly surfaced as empty per Item 4. State addenda recovery is not needed because only three addenda exist and they are fully surfaced. Guaranty chain recovery is not needed because Exhibit F is fully surfaced. Franchisee list extraction is not needed because physical Exhibit L franchisee list is fully surfaced. Item 19 and Item 20 repair are not needed because all tables are surfaced with only one small cohort-size contradiction which is preserved, not repairable. Management bio recovery is not needed because Item 2 is directly surfaced.
