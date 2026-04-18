# Retry Tasks — Great Clips, Inc. (Filing 638054)

## RT-1: Auditor Identification via Image Fallback
- **Status**: EXECUTE
- **Target**: PDF page 168 (auditor report letterhead)
- **Rationale**: Text layer did not capture the auditor firm name. The letterhead is likely image-only.
- **Output**: Update `09_final_canonical.json` with auditor name.
- **Note**: Deferred to A2 depth pass (Item 21 targeted image fallback).

## RT-2: State Addenda Structured Extraction
- **Status**: EXECUTE (deferred to A2 Depth Pass 4)
- **Target**: Exhibit P, pp.359-399 (~41 pages)
- **Rationale**: State addenda are directly surfaced. Per-state overrides need structured extraction.
- **Output**: `RT_depth_state_addenda_promotion.json`

## RT-3: Franchise Agreement Clause Walk
- **Status**: EXECUTE (deferred to A2 Depth Pass 2)
- **Target**: Exhibit F, pp.187-236 (~50 pages)
- **Rationale**: Key operative exhibit. Item 17 chart provides summary coverage but direct clause walk will surface guaranty scope, liquidated damages, cross-default triggers, and other detailed provisions.
- **Output**: `RT_depth_contract_burdens.json`

## RT-4: Item 21 Note-Family Deep Walk
- **Status**: EXECUTE (deferred to A2 Depth Block 1)
- **Target**: Financial statement notes pp.175-186
- **Rationale**: All 11 note families have been extracted in A1. A2 will perform structured depth walk.
- **Output**: `RT_depth_item21_notes.json`

## RT-5: Thin-Family Thickening (Items 9-16)
- **Status**: EXECUTE (deferred to A2 Depth Block 4)
- **Target**: Items 9-16 operative burdens
- **Rationale**: These items have narrative coverage in the reader report but need structured per-item burden blocks.
- **Output**: `RT_depth_thin_items.json`

## RT-6: Lease Documents Review
- **Status**: SKIP
- **Rationale**: Exhibit L operative burden is not a high-priority extraction target. Lease guarantee terms are already known from Item 10. The lease is between franchisee and landlord, not between franchisee and franchisor. The lease documents are sample forms that will vary by location.

## RT-7: Key Exhibit Clause Walk (Three Star, MDA)
- **Status**: EXECUTE (deferred to A2 Depth Block 2)
- **Target**: Exhibit G (pp.237-240), Exhibit H (pp.241-249)
- **Rationale**: Key development agreements. Terms summarized in body text but direct clause walk deferred.
- **Output**: `RT_depth_key_exhibits.json`
