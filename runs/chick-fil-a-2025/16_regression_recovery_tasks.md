# 16 Regression Recovery Tasks — Chick-fil-A (638216-2025) vs Gold

Based on `15_regression_check.md` gold comparison.

---

## RR4: Item 19 College High/Low and Distribution Recovery (HIGH)

- **What:** Gold has college segment high ($4,906,963), low ($192,830), and 5 distribution buckets. Current run has None.
- **Verified in PDF:** Page 53 — data is present at bottom of page, was truncated in initial extraction.
- **Action:** Add high, low, and 5 distribution buckets to `item19_chart_detail.college_university` in all canonical files.
- **Data:**
  - highest: 4906963
  - lowest: 192830
  - distribution: <$500K: ~10%, $500K-$750K: ~13%, $750K-$1M: ~19%, $1M-$2M: ~35%, >$2M: ~23%
- **Files to update:** `12_canonical_enriched_v2.json`, `11_canonical_enriched.json`, `09_final_canonical.json`, `03_tables.json`

## RR5: Manual Replacement Fee (MEDIUM)

- **What:** Gold has $500 manual replacement fee. Current run omitted it from fee stack.
- **Verified in PDF:** Page 32, Item 11 — "Chick-fil-A charges $500 to replace lost or destroyed manuals"
- **Action:** Add to `item6_fee_attributes.fees` array and `recurring_fees`.
- **Files to update:** `12_canonical_enriched_v2.json`

## RR6: Warehouse Markup (MEDIUM)

- **What:** Gold has "Cost plus approximately 2.5% plus shipping." Current run omitted it.
- **Verified in PDF:** Page 28, Item 8 — "cost to Licensees for warehouse goods is our cost plus approximately 2.5%"
- **Action:** Add to `supplier_control_economics`.
- **Files to update:** `12_canonical_enriched_v2.json`

## RR7: Item 19 Sample Coverage % (LOW)

- **What:** 409 qualifying units out of 425 total = 96.2% sample coverage.
- **Action:** Add `sample_coverage_pct: 96.2` to `item19_chart_detail`.
- **Files to update:** `12_canonical_enriched_v2.json`

---

**Total recovery tasks: 4**
**No PDF re-read needed — all data verified during regression check.**
