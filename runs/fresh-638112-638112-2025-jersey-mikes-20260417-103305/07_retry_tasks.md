# Retry Tasks — Jersey Mike's (638112-2025)

## R1: Franchise Agreement Clause Walk
**Status:** EXECUTE (in A2)
**Target:** Exhibit C, pp. 104-158
**Rationale:** Key operative terms extracted from Item 17 chart, but direct clause walk needed for guaranty scope, liquidated damages application mechanics, cross-default triggers, death/disability provisions, insurance specifics, indemnification scope, and any unusual/distinctive clauses not captured in Item 17 summary.
**Output:** RT_depth_contract_burdens.json, RT_depth_key_exhibits.json

## R2: Item 21 Financial Statement Notes — D-2 Consolidated
**Status:** EXECUTE (in A2)
**Target:** Exhibit D-2 notes, pp. 190-206
**Rationale:** Statement headlines extracted. Need depth pass for: securitization debt structure ($1.7B), related party transactions, lease accounting (ROU assets $11.2M), advertising fund accounting, deferred revenue, subsequent events (Blackstone acquisition), revenue recognition details.
**Output:** RT_depth_financial_notes.json, RT_depth_item21_notes.json

## R3: State Addenda Structured Extraction
**Status:** EXECUTE (in A2)
**Target:** Exhibit M, pp. 355-395
**Rationale:** 8 states identified (CA, HI, IL, MD, MN, ND, RI, WA) across FDD addenda, FA amendments, and ADA amendments. Need per-state structured extraction of override families: forum selection, governing law, noncompete, termination, notice/cure, general release, damages, interest rate, fair market value.
**Output:** RT_depth_state_addenda_promotion.json

## R4: Narrative-to-Canonical Promotion
**Status:** EXECUTE (in A2)
**Target:** 02_reader_report.md → 09_final_canonical.json
**Rationale:** Standard A2 pass to identify facts in reader report not yet in canonical.
**Output:** RT_depth_promotion_audit.json

## R5: Item 20 Table Detail Completion
**Status:** SKIP
**Rationale:** All 5 Item 20 tables extracted with footer totals and state-level detail. No material gaps.

## R6: ADA Guaranty and Lease Rider
**Status:** EXECUTE (in A2)
**Target:** Exhibit B-1 (pp. 102-103), Exhibit J (pp. 328-331)
**Rationale:** Guaranty scope (personal, spousal, unlimited) and lease rider assignment/subordination provisions affect buyer risk.
**Output:** RT_depth_key_exhibits.json

## R7: Renewal Amendment (Exhibit I)
**Status:** EXECUTE (in A2)
**Target:** Exhibit I, pp. 321-327
**Rationale:** Renewal terms may differ materially from initial FA. Need to understand what changes at renewal.
**Output:** RT_depth_key_exhibits.json
