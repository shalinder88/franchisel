# B1 — Regression Check

**Current run:** `runs/shadow-live-burger-king-2025/` (this run)
**Prior benchmark:** `runs/637918-2025-Burger-King/` (final composite score 9.4 → 9.6 enriched_v2_reconciled)
**Same PDF:** `637918-2025-Burger-King.pdf` (1,057 pages)

## A. Stronger in current run

| Dimension | Current | Benchmark | Verdict |
|-----------|---------|-----------|---------|
| Item 19 Section A — Fuel Co-Branded sub-tables | All 4 categories with averages, medians, highs, lows | Captured in benchmark | Tie / current direct evidence |
| Item 19 Section B — multi-year cohorts | 5 cohorts (scope, DT conversion, image, sales level, multi-year, RTF) all extracted | Captured | Tie |
| Carrols acquisition narrative | -1,116 franchised vs +1,039 company-owned linked, -403 3-year net | Captured | Tie |
| Wisconsin addendum check | Confirmed absent via grep + R1 retry | Not specifically called out | Current better on filing-state precision |
| KPMG critical audit matters | Both extracted (Carrols leases + Firehouse brand) | Both captured | Tie |
| RBI 3-year income statement | All FY2022-2024 lines extracted | Captured | Tie |
| Bottom-quartile risk highlight | 15.9% Non-Trad <$0.7M called out in canonical and final report | Captured | Tie |
| Item 6 fee row count | 35 fee rows extracted | 33-37 in benchmark | Tie |

## B. Stronger in benchmark run

| Dimension | Current | Benchmark | Verdict |
|-----------|---------|-----------|---------|
| D1/D2 Franchise Agreement deep read | Not done — only Item 17 summary captured | Full 90-page deep read with 8 critical findings (data ownership, MOD Manual, 65% media floor, ISP supermajority, successor 4-yr notice, post-transfer liability, BK Foundation mandatory) | **Benchmark significantly better** |
| RTF2 (Exhibit X1) deep read | Reference only | Full 22-page extraction with contribution schedules, default cascade, cross-default, general release | **Benchmark significantly better** |
| Fuel the Flame (Exhibit Y1) deep read | Referenced via Item 6 | Full 10-page extraction with EBITDA calc, $175K/$230K thresholds, rent cap, voting mechanics | **Benchmark better** |
| Crown Your Career deep read | Item 10 summary only | Z1-Z4 with promissory note rate detail, security agreement, addendum non-compete | **Benchmark better** |
| Franchisee list (Exhibit O1) | Count noted, not enumerated | 5,532 entities with concentration data, top operators named | **Benchmark significantly better** |
| Per-state addenda detail | 3 of 11 spot-read (CA, HI, WA); 8 deferred | Per-state override matrix for all 11 states | **Benchmark better** |
| Enrichment passes | Not produced (11_canonical_enriched / 12_canonical_enriched_v2 missing) | Both v1 and v2 enriched canonical present | **Benchmark better** |
| Item 20 Table 3 reconcile | Spot-checked early-alphabet states | Full reconciliation noted | **Benchmark better** |
| 13_franchisee_list.json | Not created | Created with structured data | **Benchmark better** |
| Total tables count | 16 | 26 | **Benchmark better (+10)** |

## C. Material regressions in current run

### R1 (CRITICAL): D1/D2 operative clauses not deep-read
The benchmark D1/D2 deep read produced 8 critical findings. The current run captured Item 17 summary only. Recovery needed.

### R2 (HIGH): RTF2 / Fuel the Flame / Crown Your Career exhibit deep reads not done
These exhibits contain operative contractual terms that affect economics (royalty step-ups, advertising rate triggers, promissory note rates).

### R3 (MEDIUM): Per-state addenda detail incomplete
Only CA, HI, WA spot-read. IL, MD, MN, NY, ND, RI, SD, VA deferred.

### R4 (MEDIUM): Enrichment v1 / v2 passes not produced
Benchmark has 11_canonical_enriched.json and 12_canonical_enriched_v2.json with 30/33 additional fields each.

### R5 (MEDIUM): Franchisee list not enumerated
13_franchisee_list.json structure not produced (current run has page-range pointer only).

### R6 (LOW): Table count -10 vs benchmark
Current: 16 tables; benchmark: 26 tables.

## D. Conflicts to adjudicate

### Conflict C1: Post-term noncompete
- **Current:** "1 year, 2 miles" (canonical, contract_burden.noncompete_post_term)
- **Benchmark (final, after B3 adjudication):** "1 year, 2 miles"
- **Source verification:** FA D1 Section 19 — "for a period of one (1) year... within two (2) miles of the Premises". Item 17(r) FA — "1 year after termination at or within 2 miles". DA Art. VII — "1 year... within 2-mile radius of any of your BK restaurants".
- **Verdict: NO CONFLICT.** Both runs agree on 1 year / 2 miles. Current run captured this correctly in canonical and final report.
- **Sub-distinction preserved:** FA anchors at "the Premises" (your specific location); DA anchors at "any of your BK restaurants" (multi-unit).

No other material legal-field conflicts identified.

## E. Verdict

**B1 result:** Current run is structurally complete and accurate at the canonical and Item-level summary depth, but is **shallower than the benchmark on operative exhibit clause extraction** (D1/D2 FA deep read, RTF2, Fuel the Flame, Crown Your Career, franchisee list enumeration, full per-state addenda detail).

No material legal-field errors. No invented economics. The current run's noncompete fields are correct (1 year / 2 miles) — no regression from benchmark on this critical field.

**Recommendation:** Generate B2 recovery tasks to backfill the 5 medium/high regressions. B3 not required (no real conflicts).
