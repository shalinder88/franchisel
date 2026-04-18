# Retry Tasks — Subway FDD (638763-2025)

## Retry Task 1: Item 21 Note Walk Depth
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Financial statement notes 1–7 at pp. 705–712
- **Rationale**: Notes extracted at headline level; need structured per-note-family extraction with accounting policy mechanics
- **Output**: RT_depth_item21_notes.json

## Retry Task 2: Franchise Agreement Clause Walk
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Exhibit A (FA) at pp. 114–162
- **Rationale**: 49-page agreement; Item 17 chart provides operative summary but direct clause walk needed for termination triggers, default mechanics, guaranty scope, liquidated damages
- **Output**: RT_depth_contract_burdens.json

## Retry Task 3: State Addenda Structured Promotion
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Exhibit P at pp. 918–949 (10 states)
- **Rationale**: States identified but per-state override families (forum, noncompete, termination, governing law) need structured extraction
- **Output**: RT_depth_state_addenda_promotion.json

## Retry Task 4: Item 2 Leadership Roster Completion
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Pages 26–29
- **Rationale**: Full officer/director roster with names, roles, and tenure needs structured array
- **Output**: RT_depth_thin_items.json

## Retry Task 5: Items 9–16 Operative Burden Thickening
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Pages 65–86
- **Rationale**: Cross-reference table provides structure but per-item operative burden blocks need deepening
- **Output**: RT_depth_thin_items.json

## Retry Task 6: Narrative-to-Canonical Promotion
- **Status**: EXECUTE (A2 depth pass)
- **Target**: 02_reader_report.md vs. 09_final_canonical.json
- **Rationale**: Ensure all structured facts from reader report are promoted to canonical
- **Output**: RT_depth_promotion_audit.json
