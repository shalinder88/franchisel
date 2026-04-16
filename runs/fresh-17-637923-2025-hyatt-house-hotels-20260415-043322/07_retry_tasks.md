# Retry Tasks — Hyatt House Hotels FDD (637923-2025)

## Tasks from Coverage Audit

### R1: Franchisor Entity Balance Sheet (California Addendum)
- **Status**: EXECUTE
- **Rationale**: The California state pages (page 364) include the unaudited balance sheet of Hyatt House Franchising, L.L.C. itself, which provides insight into the actual franchisor entity's financial position (as opposed to parent consolidated).
- **Target pages**: 364
- **Output**: retry_R1.json

### R2: Financial Notes Depth
- **Status**: SKIP — Deferred to A2 Depth Pass 1
- **Rationale**: Full note extraction spans 55+ pages (116-171). This is better handled as a structured depth pass in A2.

### R3: Contract Burden Depth
- **Status**: SKIP — Deferred to A2 Depth Pass 2
- **Rationale**: Franchise Agreement clause-by-clause extraction spans 70 pages (188-258). Better handled in A2.

### R4: State Addenda Structured Overrides
- **Status**: SKIP — Deferred to A2 Depth Pass 4
- **Rationale**: State-by-state override extraction across multiple riders. Better handled in A2.

## Executed Retries

### R1: Franchisor Entity Balance Sheet
Reading page 364 for the Hyatt House Franchising, L.L.C. unaudited balance sheet...
