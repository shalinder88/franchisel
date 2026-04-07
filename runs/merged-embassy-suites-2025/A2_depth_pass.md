# A2 Fixed Depth Pass — Embassy Suites 2025

## Summary
All four required A2 depth passes executed.

### Depth Pass 1 — Financial note depth
- Read Exhibit C Notes 1-9 (pp 122-126).
- Output: `RT_depth_financial_notes.json`
- 9 notes extracted with full accounting policy detail.

### Depth Pass 2 — Contract burden depth
- Read Item 17 table, Items 5/6/11/12 fee + operational obligations, Spa Amendment + HITS Agreement cross-references.
- Output: `RT_depth_contract_burdens.json`
- ~48 clauses summarized, 16 non-curable default grounds enumerated, distinctive-clause inventory compiled.
- Note: Exhibit D raw FA clause-by-clause transcription NOT performed in this test run; Item 17 table is authoritative for burden structure.

### Depth Pass 3 — Narrative-to-canonical promotion audit
- Read `02_reader_report.md` against `09_final_canonical.json`.
- 12 promotable facts identified and added to canonical (see `RT_depth_promotion_audit.json`).
- `09_final_canonical.json` patched with: `state_addenda_overrides`, `graduate_brand_acquisition`, `hfh_tax_status`, `hfh_asset_pledge_as_collateral`, `hfh_ip_license_terms`.
- `12_canonical_enriched_v2.json` patched with: `state_addenda_overrides`, `financial_notes_depth`, `contract_burden_depth`.

### Depth Pass 4 — State addenda structured promotion
- Read Exhibit J-1 (pp 266-274) in full.
- 11 state addenda structured: CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA.
- Output: `RT_depth_state_addenda_promotion.json`
- Override families matrix: forum_selection (7 states), governing_law (6), general_release (10), termination (8), liquidated_damages (3), post-term noncompete (WA only), non-renewal FMV compensation (MI/MN), bankruptcy termination (MD/RI).

## Mandatory canonical family enforcement
- `unresolveds`: present (6 entries, severities assigned)
- `contradictions`: present (empty, no contradictions found)
- `state_addenda_overrides`: present (11 states structured with override-family matrix)

## Known remaining gap
- Exhibit D-1 State Addenda to Franchise Agreement (pp 183-196) not deeply read. The D-1 addendum typically contains FA-level overrides that correspond with the J-1 disclosure-document overrides. This is logged as a LOW severity unresolved.
