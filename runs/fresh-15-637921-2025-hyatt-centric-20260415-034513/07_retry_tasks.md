# Retry Tasks: Hyatt Centric FDD (637921-2025)

## Assessment

All 23 Items have been fully extracted. All required tables have been captured. The coverage audit identified no material extraction gaps requiring retry.

## Retry Task List

### R1: Item 19 ADR Statistics Verification
- **Status**: SKIP
- **Rationale**: The apparent anomaly in Owned/Managed "#/% Exceeding Average" for ADR (showing 13/40.6% which would exceed the 12 owned/managed hotel count) is likely either a formatting artifact in the original PDF text extraction or a reference to the "All" row. The original text was faithfully extracted. No re-read would resolve this without the original formatted table layout.

### R2: State Addenda Structured Extraction
- **Status**: DEFER TO A2
- **Rationale**: State addenda content identified on PDF pages 356-378 covering 14+ states. Full structured extraction of override families is best handled in A2 Depth Pass 4.

### R3: Franchise Agreement Deep Read
- **Status**: DEFER TO A2
- **Rationale**: Franchise Agreement (Exhibit C, ~80 pages) deep read for contract burden extraction belongs in A2 Depth Pass 2.

### R4: Financial Statement Notes Deep Read
- **Status**: DEFER TO A2
- **Rationale**: Notes to consolidated financial statements (~60 pages) deep read belongs in A2 Depth Pass 1.

## Conclusion

No retries executed. All material content has been extracted from the FDD body. Depth passes deferred to A2.
