# Retry Tasks — AumBio Franchising, LLC (637933-2025)

## Retry Assessment

Based on the coverage audit, the extraction is substantially complete. Three minor unresolveds were identified, none requiring PDF re-reads since they represent FDD data inconsistencies rather than extraction gaps.

### R1: Item 20 Table 3 Discrepancy — SKIP
**Rationale:** The discrepancy (1 at start of 2024, 0 at end, with all activity columns at 0) is a data inconsistency within the FDD itself, not an extraction gap. The table was accurately extracted as printed. No additional PDF pages would resolve this.

### R2: Item 20 Table 5 Year Label — SKIP
**Rationale:** The header says "Current Fiscal Year (2024)" but the FDD was issued March 2025. This is a labeling issue within the FDD. The projected opening of 1 franchised outlet in Wisconsin was accurately captured.

### R3: Renewal Fee Amount — SKIP
**Rationale:** The fee table in Item 6 does not contain a separate renewal fee line item. Footnote 3 references "The Renewal Fee" in the context of renewal processing costs, but no specific dollar amount is disclosed. This appears to be subsumed within the requirement to sign a new franchise agreement at renewal. The FDD does not provide a separate renewal fee amount to extract.

## Summary
- Retries marked EXECUTE: 0
- Retries marked SKIP: 3
- All skips are due to FDD data inconsistencies or non-disclosure, not extraction gaps.
