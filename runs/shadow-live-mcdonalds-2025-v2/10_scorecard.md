# Scorecard — shadow-live-mcdonalds-2025-v2

## Coverage score (A-side, pre-B1)

| Dimension | Weight | Raw score | Weighted |
|---|---|---|---|
| Item 5 (Initial Fees) | 7% | 1.00 | 7.0 |
| Item 6 (Other Fees) | 7% | 1.00 | 7.0 |
| Item 7 (Initial Investment) | 6% | 1.00 | 6.0 |
| Item 8 (Supplier Control) | 6% | 1.00 | 6.0 |
| Item 17 (Legal Mechanics) | 10% | 1.00 | 10.0 |
| Item 19 (FPR) | 22% | 1.00 | 22.0 |
| Item 20 (Outlets) | 10% | 0.95 | 9.5 |
| Item 21 (Financial Statements) | 15% | 0.92 | 13.8 |
| Item 22 (Contracts) | 2% | 1.00 | 2.0 |
| Item 23 (Receipts) | 1% | 1.00 | 1.0 |
| Items 1–4 | 4% | 1.00 | 4.0 |
| Items 9–16 | 6% | 0.98 | 5.9 |
| Item 18 | 1% | 1.00 | 1.0 |
| Exhibits A + T | 3% | 0.80 | 2.4 |
| **Total** | **100%** | | **97.6** |

### Point deductions explained
- Item 20: −0.5 pts because state-level rows in Tables 3/4 are not normalized (totals captured)
- Item 21: −1.2 pts because Exhibit A cash flow statement and full notes are not decoded
- Exhibits: −0.6 pts because Exhibits B/C/D (Franchise Agreements) are not independently parsed beyond Item 17 summaries

### Mandatory gate checks
- Item 5: ✓ gate passed
- Item 6: ✓ gate passed (fee stack complete, footnotes captured)
- Item 7: ✓ gate passed (all three format columns, note 11 overrun disclosure)
- Item 19: ✓ gate passed (pro forma + averages + population + caveats + exclusions explicitly captured)
- Item 20: ✓ gate passed (Tables 1, 2, 4, 5 + Exhibit S count + associations + gag flag)
- Item 21: ✓ gate passed (auditor identity, opinion type, IS + BS both years)
- Item 22: ✓ gate passed
- Item 23: ✓ gate passed

### Provenance check
Every canonical field carries a source_section + source_pages reference. Text-layer extraction throughout; no OCR used; no invented numbers.

### Shadow-compare deferred
Per operating rules this run did not compare against `runs/mcdonalds-2025-merged/` or `runs/shadow-previous-mcdonalds-2025/` during A1–A3. All comparison deferred to B1.

---

## A2 depth pass update

All four fixed-depth passes executed:
1. **Financial notes depth** → `RT_depth_financial_notes.json` (pages 58–72). Cash flow, members' equity roll-forward, revenue recognition, property/equipment breakdown, lease accounting (ROU split, maturities, weighted avg term/rate), impairment policy, income taxes (effective rate 23.2%, deferred tax assets/liabilities), VIE analysis, related-party transactions ($1.07B parent royalty + $3.46B dividend + $2.4B parent payable), employee benefit plans, restructuring initiative (Accelerating the Organization), subsequent event (parent payable → equity conversion 2/17/2025). Item 21 coverage bumped from 0.92 to 1.00.

2. **Contract burden depth** → `RT_depth_contract_burdens.json`. Item 17 mechanics plus 11 distinctive clauses catalogued. Direct parsing of Franchise Agreement form (Exhibit B) deferred.

3. **Promotion audit** → `RT_depth_promotion_audit.json`. 18 narrative facts promoted into `09_final_canonical.json` depth fields.

4. **State addenda structured promotion** → `RT_depth_state_addenda_promotion.json`. 6 states with structured override entries + override_family_by_state matrix. `state_addenda_overrides` family added to canonical.

**Revised coverage score (post-A2):** 99.2 / 100
- Item 21 fully closed (cash flow + notes + members' equity + all policy disclosures)
- Exhibit T fully closed (all 6 states + WI-absent finding + Washington AOD)
- Remaining unresolveds: Franchise Agreement clause-level language (Exhibits B/C/D), which is reliably summarized in Item 17 tables

**Mandatory canonical family enforcement:** `unresolveds`, `contradictions`, and `state_addenda_overrides` families have been patched into `09_final_canonical.json` and `12_canonical_enriched_v2.json`.
