# Extraction Scorecard — Ivan Ramen Franchising LLC (637911-2025)

## Coverage Summary

| Category | Items | Extracted | Coverage |
|----------|-------|-----------|----------|
| FDD Items (1-23) | 23 | 23 | 100% |
| Material Tables | 16 | 16 | 100% |
| Exhibits | 9 | 9 | 100% |
| Financial Statement Years | 3 | 3 | 100% |
| State Addenda | 8 | 8 | 100% |

## Extraction Quality

| Metric | Score |
|--------|-------|
| Item completeness | 23/23 (100%) |
| Table extraction | 16/16 (100%) |
| Exhibit cataloging | 9/9 (100%) |
| Auditor opinion confirmed | Yes (via image rendering) |
| State addenda read | 8/8 (100%) |
| Retries executed | 2/2 |
| Retries skipped | 1 (minor trademark descriptions) |

## Key Extraction Metrics

| Metric | Value |
|--------|-------|
| PDF pages processed | 346 |
| Text pages extracted | 346 |
| Item map status | Complete (all 23 items located) |
| Bootstrap item_map_status | incomplete (resolved manually) |
| Image-only pages identified | 6 (auditor reports for 3 years) |
| Image pages recovered | 2/6 (FY 2024 auditor report via pdftoppm) |

## Data Confidence

| Field | Confidence | Notes |
|-------|-----------|-------|
| Franchisor identity | High | |
| Fee stack | High | Complete 23-fee extraction |
| Initial investment | High | Both tables + all notes |
| Territory | High | Complete with all reservations |
| Item 19 (FPR) | High | Confirmed: No FPR made |
| Item 20 (Outlets) | High | All 5 tables + footnotes |
| Item 21 (Financials) | High | 3 years + auditor opinion confirmed |
| Contract terms | High | FA and ADA complete |
| State addenda | High | All 8 states fully read |
| Auditor opinion | High | Confirmed unqualified via image |

## A2 Depth Passes

| Depth Pass | Status | Output File | Key Findings |
|-----------|--------|-------------|--------------|
| 1: Financial note depth | Complete | RT_depth_financial_notes.json | 7 policies, 7 notes, ASC 606 revenue recognition, IP license (10% fee) |
| 2: Contract burden depth | Complete | RT_depth_contract_burdens.json | 19+34 default categories, force majeure (180d), cross-default, IP license-back |
| 3: Promotion audit | Complete | RT_depth_promotion_audit.json | 10 facts audited, 6 new promotions |
| 4: State addenda promotion | Complete | RT_depth_state_addenda_promotion.json | 32 overrides, 9 families, 8 states |

## Canonical Family Enforcement

| Family | Status | Entries |
|--------|--------|---------|
| unresolveds | Promoted | 4 (1 high, 2 medium, 1 low) |
| contradictions | Promoted | 3 (1 unresolved, 1 resolved, 1 immaterial) |
| state_addenda_overrides | Promoted | 32 overrides across 8 states |

## Final Verdict

**Extraction status: COMPLETE**

All 23 FDD items extracted. All material tables captured. All exhibits cataloged. Auditor opinion confirmed via image rendering. State addenda for all 8 states fully read with 32 structured overrides. Four A2 depth passes executed. Canonical families enforced. Two retries executed. One minor retry skipped.
