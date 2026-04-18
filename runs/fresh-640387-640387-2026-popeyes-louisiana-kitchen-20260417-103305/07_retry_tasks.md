# Retry Tasks — 640387 Popeyes Louisiana Kitchen 2026

## RT1: Item 21 Note Families Walkthrough
**Status**: EXECUTE
**Target**: Pages 508–549 (RBI notes) and 560–609 (RBILP notes)
**Rationale**: Financial statement notes contain critical information about debt structure, commitments, contingencies, segment detail, lease obligations, and goodwill/intangible composition. Balance sheet and income statement data extracted but note-level detail needed for complete Item 21 coverage.
**Output**: `RT_depth_item21_notes.json`

## RT2: Thin Items Depth — Items 9–16 Operative Burdens
**Status**: EXECUTE
**Target**: Pages 48–76 (Items 9–16) — re-read for structured obligations/restrictions/rights
**Rationale**: Items 9–16 extracted with key terms but operative burden structure (what franchisee must do, what franchisor controls, what is forbidden) needs explicit structuring for each item.
**Output**: `RT_depth_thin_items.json`

## RT3: State Addenda Material Overrides
**Status**: EXECUTE
**Target**: Pages 402–496 (Exhibit K)
**Rationale**: 14 states with addenda; material overrides to venue, choice of law, termination, relationship law needed for complete extraction. Key states: CA, IL, MD, MN, NY, WA.
**Output**: `RT_depth_state_addenda.json`
