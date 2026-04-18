# Retry Tasks — Anytime Fitness FDD (638153-2025)

## R1 — Item 21 Note Walk (EXECUTE)
**Target**: AFLLC consolidated financial statement notes (p.186-203)
**Rationale**: 18 pages of notes covering revenue recognition, securitization debt structure, lease accounting, deferred revenue, related party transactions, and income taxes. Headlines extracted but detailed note walk needed for A2.
**Output**: RT_depth_item21_notes.json

## R2 — Franchise Agreement Clause Walk (EXECUTE)
**Target**: Exhibit E Franchise Agreement (p.205-263)
**Rationale**: 59 pages. Key terms extracted via Item 17 chart but direct clause-level extraction of operative burdens needed — especially guaranty scope, liquidated damages, cross-default triggers, death/disability, insurance, indemnification.
**Output**: RT_depth_key_exhibits.json

## R3 — State Addenda Structured Extraction (EXECUTE)
**Target**: State addenda in Exhibit E (p.252-263), Exhibit F (p.276-285), Exhibit G (p.287-305)
**Rationale**: 11 states with addenda identified. Need structured per-state override extraction for forum selection, noncompete, termination, general release, governing law, transfer fees.
**Output**: RT_depth_state_addenda_promotion.json

## R4 — Item 21 Financial Notes Deep Walk (EXECUTE)
**Target**: SFG notes (p.174-176) + AFLLC notes (p.186-203)
**Rationale**: Revenue recognition policy, securitization note structure, lease/ROU detail, deferred franchise fee accounting, related party transactions, income tax treatment.
**Output**: RT_depth_financial_notes.json

## R5 — Thin Items Thickening (EXECUTE)
**Target**: Items 9-16 operative burdens
**Rationale**: Obligations table and body text extracted at summary level. Need structured burden blocks per item.
**Output**: RT_depth_thin_items.json

All retry tasks are deferred to A2 depth passes.
