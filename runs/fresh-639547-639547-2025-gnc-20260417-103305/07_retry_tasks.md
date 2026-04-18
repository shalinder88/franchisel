# Retry Tasks — 639547-2025-GNC

## Retry Task R1 — Item 21 Financial Statement Notes
- **Status**: EXECUTE (A2 Depth Pass 1)
- **Target**: Pages 462–489
- **Rationale**: 28 pages of financial statement notes contain revenue recognition, depreciation, impairment, lease/ROU, income tax, related party, and other material policies. Headline figures extracted; note-family detail needed.
- **Output**: RT_depth_financial_notes.json

## Retry Task R2 — Franchise Agreement Clause Walk
- **Status**: EXECUTE (A2 Depth Pass 2)
- **Target**: Pages 157–263
- **Rationale**: 107-page franchise agreement contains all operative burdens. Item 17 chart provides cross-references but direct clause language not extracted.
- **Output**: RT_depth_contract_burdens.json

## Retry Task R3 — State Addenda Structured Extraction
- **Status**: EXECUTE (A2 Depth Pass 4)
- **Target**: Pages 135–156
- **Rationale**: 12 states with addenda. Override families (forum, noncompete, termination, governing law, release, damages, interest rate, no-poach) need structured per-state extraction.
- **Output**: RT_depth_state_addenda_promotion.json

## Retry Task R4 — Narrative-to-Canonical Promotion
- **Status**: EXECUTE (A2 Depth Pass 3)
- **Target**: 02_reader_report.md vs 09_final_canonical.json
- **Rationale**: Ensure all structured facts from reader report are promoted to canonical.
- **Output**: RT_depth_promotion_audit.json

## Retry Task R5 — Unaudited Q1 2025 Financial Statements
- **Status**: SKIP
- **Rationale**: Unaudited interim statements (Exhibit N-2, pp. 490–513) provide supplementary but not materially essential data. Audited FY 2024 statements are the primary financial evidence. If A2 has capacity, may extract headlines.

## Retry Task R6 — Subsidiary Agreement Clause Walks (PSA, APSA, Sublease, POS License, General Release)
- **Status**: EXECUTE (A2 Targeted Depth Block 2)
- **Target**: Pages 340–383
- **Rationale**: Product Sales Agreement (security interest, credit terms), Asset Purchase Agreement, Sublease, POS License, and General Release contain operative clauses affecting economics and legal burden.
- **Output**: RT_depth_key_exhibits.json
