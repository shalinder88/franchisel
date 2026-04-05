# 07 — Retry Tasks
## McDonald's USA, LLC — FDD (638437-2025)

---

Based on the coverage audit, this FDD extraction is substantially complete. The McDonald's FDD is exceptionally well-structured with comprehensive Item 19 disclosure, complete Item 20 tables, and audited financials. Only minor optional retries are identified below.

---

### TASK R01 — Item 20 Top-10 State Detail (OPTIONAL)

- **task_id**: R01
- **task_name**: Item 20 Table 3 Top-10 States Franchised Status Detail
- **exact_target**: Extract 2024 franchised outlet status for the 10 largest states (TX, CA, FL, IL, OH, NY, GA, MI, PA, NC)
- **why_it_is_needed**: Enrichment layer for item20_yearly_activity. Total-level data already captured; state detail adds geographic granularity.
- **likely_source_pages**: 49–55
- **expected_output_filename**: retry_R01_item20_state_detail.json
- **priority**: LOW
- **decision**: SKIP — totals are sufficient for canonical completeness.

### TASK R02 — Financial Statement Lease Maturity Detail (OPTIONAL)

- **task_id**: R02
- **task_name**: Financial Statement Lease Maturity and Property Detail
- **exact_target**: Extract lease maturity table (operating vs. finance by year), property and equipment detail by category
- **why_it_is_needed**: Item 21 structural facts enrichment. Key data already captured in tables JSON (T13, T14).
- **likely_source_pages**: 66–68
- **expected_output_filename**: retry_R02_financial_detail.json
- **priority**: LOW
- **decision**: EXECUTE — modest effort, adds value for item21_financial_structure_detail enrichment.

---

### Summary

| Task | Priority | Decision | Reason |
|------|----------|----------|--------|
| R01 — Item 20 state detail | LOW | SKIP | Totals sufficient |
| R02 — Financial statement detail | LOW | EXECUTE | Adds enrichment value, data already read |

**Total retries to execute: 1 (R02)**
