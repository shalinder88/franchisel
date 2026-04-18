# Retry Tasks — 639418-2025 Planet Fitness

## R1 — Item 21 PF Inc. Consolidated Note Families
- **Status**: EXECUTE
- **Target**: Walk Planet Fitness, Inc. consolidated financial statement notes (pages 300-391)
- **Reason**: PF Inc. financials provide parent-level balance sheet, leverage, and related-party context
- **Output**: `RT_depth_item21_notes.json`

## R2 — State Addenda Detail Walk
- **Status**: EXECUTE
- **Target**: Walk state addenda for IL, MD, MN, NY, ND, RI, VA, WI (pages 501-534)
- **Reason**: Material overrides to noncompete, termination, dispute resolution, release provisions
- **Output**: `RT_state_addenda.json`

## R3 — Exhibit K-1 Equipment Terms
- **Status**: SKIP
- **Rationale**: Equipment Terms detail is operational not diligence-critical. Key economics captured in Items 6, 7, 8. Appropriate for A2 depth pass.

## R4 — Exhibit K-3 POS Agreements
- **Status**: SKIP
- **Rationale**: POS fee structure captured in Items 6, 11. Billing mechanics are operational. Appropriate for A2 depth pass.

## Executing R1 and R2 below.
