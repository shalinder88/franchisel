# Retry Tasks — Spark by Hilton (638065-2025)

## Based on Coverage Audit

### R1 — Exhibit N (Adyen Agreement)
- **Task**: Locate and extract Exhibit N terms from PDF text layer
- **Status**: SKIP
- **Rationale**: Key terms (transaction fees, payment processing) already described in Items 5, 6, and 11. The exhibit is a sample contract. Low materiality for extraction purposes.

### R2 — Insurance Requirements
- **Task**: Extract specific insurance coverage requirements
- **Status**: SKIP
- **Rationale**: Requirements are in the confidential Manual (Exhibit H), not disclosed in the FDD text. Item 7 Note 15 states premiums "cannot be estimated" due to variation. No actionable content to extract.

### R3 — Franchise Agreement Deep-Read
- **Task**: Clause-by-clause extraction of Exhibit D
- **Status**: SKIP (reserved for A2 depth pass)
- **Rationale**: A2 depth pass will handle contract burden extraction.

### R4 — Full Exhibit A Verification
- **Task**: Count all hotels in Exhibit A and verify against Item 20 total
- **Status**: SKIP
- **Rationale**: Sampled data is consistent. Item 20 totals are authoritative. Full hotel-by-hotel listing adds limited value to the canonical.

## Summary
No retries executed. All material data is fully extracted from Items 1-23 and exhibits. No material gaps requiring targeted re-reading.
