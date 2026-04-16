# Retry Tasks — Cupbop Franchise, LLC (638043-2025)

## R1: Item 21 Financial Statement OCR — Income Statement Figures
**Status:** EXECUTE — COMPLETED
**Priority:** MEDIUM

**Problem:** OCR on page 59 rendered SG&A as "902,734" and total operating expenses as partially garbled "~798". The arithmetic didn't reconcile with the stated operating income of $1,030,945.

**Resolution:** Cross-validated via arithmetic constraints:
- Revenue $2,027,743 - Operating Income $1,030,945 = Total OpEx $996,798
- Total OpEx $996,798 - Depreciation $4,064 = SG&A $992,734
- Operating Income $1,030,945 - Other Expenses $5,287 = Net Income $1,025,658 ✓
- Further validated via equity statement: Beginning equity $892,301 + Net Income $1,025,658 - Distributions $1,896,607 = Ending equity $21,352 ✓

**Corrected values:**
- SG&A 2024: **$992,734** (not $902,734)
- Total Operating Expenses 2024: **$996,798** (not $906,798)
- Operating Income 2024: **$1,030,945** (confirmed)
- Net Income 2024: **$1,025,658** (confirmed)

## R2: Item 20 Table 1 — System Total Discrepancy
**Status:** SKIP
**Priority:** LOW
**Rationale:** The off-by-one (2023 start total = 44 vs. 2022 end total = 45) is present in the FDD text itself, not an OCR artifact. It may reflect a location that ceased operating between fiscal year-end reporting periods. The discrepancy is immaterial and cannot be resolved from the FDD alone.
