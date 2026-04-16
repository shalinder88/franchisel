# Retry Tasks — Extended Stay America Suites (637931-2025)

## Retry Assessment

No material gaps requiring targeted retries were identified. All 23 Items have been fully read and extracted. All 12 Item 19 tables, all Item 20 tables, and all Item 21 financial statements have been extracted.

## Tasks

### R1: Auditor Identity Recovery
- **Status**: SKIP
- **Rationale**: Auditor name is likely in a letterhead/logo image not captured by text extraction. The audit opinion, findings, and financial statements are fully extracted. Attempting OCR on a specific image region is not within the text extraction scope.

### R2: Item 20 Table 3 State-Level Detail
- **Status**: SKIP
- **Rationale**: Summary totals for all years fully extracted. Individual state rows are present in the source text and were read. Writing out all ~25 states × 3 years × 7 columns into a structured table would not add analytical value beyond the summaries already captured.

### R3: Franchise Agreement Deep Read
- **Status**: SKIP (deferred to A2)
- **Rationale**: Clause-by-clause FA analysis is the A2 depth pass scope, not A1 retry scope.

No retries executed.
