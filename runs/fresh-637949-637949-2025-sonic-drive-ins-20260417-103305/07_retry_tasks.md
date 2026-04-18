# Retry Tasks — Sonic Drive-Ins 2025 FDD (Filing 637949)

## RT-1: Franchise Agreement Clause Walk (Exhibit B-1)
- **Status**: EXECUTE
- **Target**: Pages 88–140 (~52 pages)
- **Reason**: Key operative terms extracted from Items 5–17 cross-references, but full clause walk of termination triggers, transfer conditions, noncompete scope, insurance requirements, remodeling obligations, and other operative burdens not completed.
- **Expected output**: `retry_R1.json` — structured clause walk with operative terms

## RT-2: State Addenda Detail (Exhibit G)
- **Status**: EXECUTE
- **Target**: Pages 341–362 (~22 pages)
- **Reason**: States with addenda identified (CA, HI, MD, MN, ND, WA) but specific override clauses not individually extracted. Material overrides on venue, governing law, noncompete, renewal protections exist.
- **Expected output**: `retry_R2.json` — per-state override extraction

## RT-3: Item 21 Note Families Depth Pass
- **Status**: SKIP
- **Rationale**: Both entity note families (SFLLC Notes 1–7, SIS Notes 1–11) were fully read during A1. Key notes on securitization, intangibles, debt, leases, revenue recognition, taxes all extracted. No material gaps remaining.

## RT-4: Item 20 Per-State Detail
- **Status**: SKIP
- **Rationale**: Per-state detail was read for all Tables 3 and 4. Footer totals extracted. Georgia anomaly flagged. No additional state-level detail needed.
