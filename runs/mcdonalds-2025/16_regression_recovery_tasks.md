# 16 — Regression Recovery Tasks
## McDonald's USA, LLC — FDD (638437-2025)

Based on `15_regression_check.md`, the following targeted recoveries are needed.

---

### TASK RR01 — Verify and Extract Missing Fee Items (Insufficient Funds, Transfer Fee)

- **task_name**: Missing fee items from gold
- **exact_target**: Verify whether Item 6 fee table or Franchise Agreement contains: (a) Insufficient Funds / Rejected Payment fee of $200; (b) Transfer Fee. These appear in gold but not in current run.
- **why_it_matters**: If directly surfaced, these are material fee items for prospective franchisee economics.
- **likely_source_object**: Item 6 fee table (pages 18–21), Franchise Agreement Section 15 (transfer), Operator's Lease
- **expected_output_filename**: Inline patch to `09_final_canonical.json`

### TASK RR02 — Verify and Extract Consolidation Waiver from Guaranty

- **task_name**: Consolidation waiver in Exhibit N guaranty
- **exact_target**: Verify whether the Unlimited Guaranty (Exhibit N, pages 208–214) or Promissory Note contains a waiver of right to consolidate legal actions. Gold has `consolidationWaiver: true`.
- **why_it_matters**: Material legal burden for guarantor — prevents combining claims with other franchisees.
- **likely_source_object**: Exhibit N — Unlimited Guaranty (pages 208–214), Promissory Note (pages 196–207)
- **expected_output_filename**: Inline patch to `09_final_canonical.json` and `RT_depth_contract_burdens.json`

### TASK RR03 — Add Computed Fee Aggregates

- **task_name**: Add total recurring fee estimates
- **exact_target**: Compute and add: (a) minimum total percent of Gross Sales (royalty + advertising + minimum percentage rent); (b) typical total percent of Gross Sales including rent.
- **why_it_matters**: Gold has these as derived fields. They are highly useful for prospective franchisee analysis.
- **likely_source_object**: Derived from Item 6 extracted data — no new PDF read needed
- **expected_output_filename**: Inline patch to `09_final_canonical.json` and `12_canonical_enriched_v2.json`

### TASK RR04 — Adjudicate Late Payment Interest Rate Conflict

- **task_name**: Late payment interest rate conflict
- **exact_target**: Determine whether gold's `SOFR + 5%` and current run's `15% per annum` refer to different instruments (franchise agreement vs. loan agreement) or whether gold has an extraction error.
- **why_it_matters**: Material conflict on a key economic term. Must be resolved before publish.
- **likely_source_object**: Franchise Agreement Section 8(c) (page 77), Exhibit N Promissory Note (pages 196–207)
- **expected_output_filename**: `17_conflict_adjudication.md`

---

### Summary

| Task | Priority | Type | New PDF Read Required |
|------|----------|------|----------------------|
| RR01 — Missing fees | MEDIUM | Verify & extract | Yes (re-check Item 6 table, pages 18–21) |
| RR02 — Consolidation waiver | MEDIUM | Verify & extract | Yes (Exhibit N, pages 208–214) |
| RR03 — Fee aggregates | LOW | Compute & promote | No |
| RR04 — Interest rate conflict | HIGH | Adjudicate | Yes (page 77 + pages 196–207) |
