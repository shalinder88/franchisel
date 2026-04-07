# Retry Tasks — shadow-live-mcdonalds-2025-v2

## R1 — Exhibit T state addenda inventory [EXECUTE]

**Why:** WI is the state of filing; default canonical assumed no material state overrides because Exhibit T was not decoded. Need to confirm WI-specific modifications (if any) and capture the full state-addendum inventory.

**Action taken:** Read pages 383–386 of the PDF (Exhibit T header + all state sections + Washington AOD).

**Finding:** Exhibit T contains addenda for **only 6 states**: California, Hawaii, Maryland, Minnesota, North Dakota, Washington. **There is NO Wisconsin-specific addendum** — the default Illinois-venue / Illinois-governing-law / 18-month-10-mile non-compete stands for WI franchisees.

Additional material finding: a separate **Washington Assurance of Discontinuance (AOD)** with the Washington Attorney General is included after the Washington addendum. It requires McDonald's to cease enforcing no-hire/no-poach provisions in franchise agreements and to notify Washington franchisees. No monetary penalty.

Output: `retry_R1_exhibit_t_state_addenda.json`

## R2 — Exhibit A cash flow + notes [SKIP]

**Why skipped:** IS + BS already captured for FY2024/2023/2022. Cash flow and notes are supplementary. Context/time budget better spent on B1 regression. Flagged in coverage audit as MEDIUM gap.

## R3 — Item 20 Table 3 state-level [SKIP]

**Why skipped:** Totals captured. State-level granular roll is not required for canonical scoring and is preserved in raw page text for future enrichment.

## R4 — Exhibit S departed franchisee list [SKIP]

**Why skipped:** Count = 113 is the only material fact. Names are PII and not published.

## R5 — Item 2 officer start-date normalization [SKIP]

**Why skipped:** Captured narratively; not a diligence-material data field.
