# Retry Tasks — Dunkin' (637953-2025)

## Retry Task 1: Item 21 Financial Statement Notes Walk
- **Status**: EXECUTE (deferred to A2 Depth Pass 1)
- **Target**: Pages 120-163 (DB Master Finance Parent notes + Dunkin' Brands Inc. statements)
- **Rationale**: Only first 2 pages of notes read. Revenue recognition, lease/ROU accounting, intangible asset impairment, tax provision, related party transactions, securitization detail, subsequent events all need extraction.
- **Output**: RT_depth_financial_notes.json, RT_depth_item21_notes.json

## Retry Task 2: Franchise Agreement Clause Walk
- **Status**: EXECUTE (deferred to A2 Depth Pass 2)
- **Target**: Exhibit C-1, pages 164-195
- **Rationale**: 32-page franchise agreement not directly clause-walked. Item 17 chart provides cross-referenced summary but operative clause detail (grant/term, fees, construction, default/cross-default, guaranty, indemnification, liquidated damages, insurance, force majeure) needs direct extraction.
- **Output**: RT_depth_contract_burdens.json

## Retry Task 3: State Addenda Completion
- **Status**: EXECUTE (deferred to A2 Depth Pass 4)
- **Target**: Exhibit E, pages 324-342 (states beyond CA, HI, MD, MN)
- **Rationale**: Only 4 states extracted. Expected additional states: IL, IN, NY, ND, RI, SD, VA, WA, WI. Material overrides for forum selection, noncompete, termination notice, release scope.
- **Output**: RT_depth_state_addenda_promotion.json

## Retry Task 4: Narrative-to-Canonical Promotion
- **Status**: EXECUTE (deferred to A2 Depth Pass 3)
- **Target**: 02_reader_report.md → 09_final_canonical.json comparison
- **Rationale**: Standard A2 depth pass to ensure all reader report facts are promoted to canonical.
- **Output**: RT_depth_promotion_audit.json

## Retry Task 5: Store Development Agreement Walk
- **Status**: EXECUTE (deferred to A2 Targeted Depth Block 2)
- **Target**: Exhibit D-1, pages 256-274
- **Rationale**: 19-page SDA with development schedule, territorial rights, default triggers, renewal conditions. Item 17 chart provides summary but direct walk needed for multi-unit franchisee risk assessment.
- **Output**: RT_depth_key_exhibits.json

## Retry Task 6: General Release Review
- **Status**: EXECUTE (deferred to A2 Targeted Depth Block 2)
- **Target**: Exhibit I, pages 552-556
- **Rationale**: Release form required for renewal and transfer. Scope of release (what claims are waived) is material for franchisee risk assessment, especially given state addenda overrides.
- **Output**: RT_depth_key_exhibits.json

## Retry Task 7: Item 20 Combo Tables Completion
- **Status**: SKIP
- **Rationale**: All 5 combo tables extracted with state-level detail and totals. No material gaps.

## Retry Task 8: Item 19 Cohort Comparability Check
- **Status**: EXECUTE (deferred to A2)
- **Target**: Compare Item 19 cohort economics (AUV basis) with current new-franchisee fee structure
- **Rationale**: Item 19 AUVs are for existing restaurants that may have different CFF/CAF rates (e.g., legacy agreements at different royalty rates vs. current 5.9% CFF). Need to verify whether the reported AUVs include restaurants paying different fee rates.
- **Output**: RT_depth_item19_cohort_comparability.json (if discrepancy found)
