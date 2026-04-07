# Merge Notes — mcdonalds-2025-merged-v2

**Merge date:** 2026-04-07
**Merge basis:** old `runs/mcdonalds-2025-merged/` (prior published) + new `runs/shadow-live-mcdonalds-2025-v2/` (full automation pipeline test)

## Why a v2 merge

The full-automation pipeline test (`shadow-live-mcdonalds-2025-v2`) was run end-to-end (A1→A2→A3→B1→B2→B3-skip→B4→B5) without consulting any prior run. B1 spot-checked 28 headline numeric fields against the old merged run and found **100% match** on every value. The new run contributed structural improvements that the old run did not have:

1. **Structured `state_addenda_overrides` family** with override-family × state matrix
2. **Wisconsin addendum absence** explicitly flagged (material because WI is the state of filing 638437-2025)
3. **Washington Assurance of Discontinuance** as a canonical entry
4. **Item 21 depth additions**: lease weighted-average remaining term (17 yrs operating / 28 yrs finance) and discount rate (4.4% / 4.1%); restructuring accrual ($4.4M); unrecognized tax benefits ($75.8M); effective tax rate (23.2%)
5. **Item 1 formation detail**: $5,548.8M asset transfer from parent on 1/1/2005; parent retains title to certain P&E; parent owns U.S. IP
6. **Item 11 training-hours table** as a first-class entry in `03_tables.json`
7. **New contradictions C-05** (Item 19 4% vs new 5% royalty pro-forma drag) and **C-06** (Item 20 vs Exhibit A 12,887 vs 12,886 year-end 2024 franchised count)
8. **New unresolved U-06** (BoA guarantee program loss/uptake disclosure gap)

## Merge mechanics

- **Base files:** copied from `runs/mcdonalds-2025-merged/` (all 23 files)
- **Overlay files:** `retry_R1_exhibit_t_state_addenda.json` and `RT_depth_state_addenda_promotion.json` from new v2
- **Patch to `09_final_canonical.json`:** old field values untouched; added `state_addenda_overrides_v2`, `item21_financials_depth_v2`, `item1_structural_depth_v2`, `merge_v2_meta`; appended `contradictions[C-05, C-06]` and `unresolveds[U-06]`

## What old still has that new v2 doesn't (preserved in merged-v2)

- **Exhibit B Franchise Agreement clause-by-clause walk** (sections 7, 8, 10, 11, 12, 15, 17, 18, 20, 23, 24, 25, 28) — old `RT_depth_contract_burdens.json` is ~4× larger and clause-grounded
- **Litigation buyout-as-settlement aggregate** ($99.7M across six discrimination/Law-75/ROFR cases)
- **8 pending federal cases** framing (vs 7 in new — old counts the Crawford complex more granularly)
- **Per-leaf provenance envelope** with `{value, source_object, source_section, source_pages, confidence, status}` on every field

## Value conflicts

**NONE.** B1 cross-checked 28 numeric fields and found exact matches on every one. No reconciliation logic required.

## Files in this merged-v2 artifact

- 23 base files from `mcdonalds-2025-merged/`
- 2 new state-addenda artifacts from `shadow-live-mcdonalds-2025-v2/`
- 1 new MERGE_NOTES.md (this file)
- **Total: 26 files**

## Publish status

**Publish-ready.** Inherits old's grade-A publish gate; structural additions from new v2 do not change any field values.

## Provenance

- Old: `runs/mcdonalds-2025-merged/` — committed in `e909632`
- New v2: `runs/shadow-live-mcdonalds-2025-v2/` — produced 2026-04-06 by full automation pipeline test
- Merged-v2: `runs/mcdonalds-2025-merged-v2/` — produced 2026-04-07
