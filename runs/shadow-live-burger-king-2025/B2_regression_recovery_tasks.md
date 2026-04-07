# B2 — Regression Recovery Generator

Source: B1 identified 5 material regressions vs benchmark (R1-R5) and 1 low-priority (R6).

## Tasks

### T1 (CRITICAL): D1/D2 Franchise Agreement deep read
**Pages:** 185-281
**Target findings (from benchmark):** data ownership, MOD Manual change rights, 65% media floor, ISP supermajority, successor 4-yr notice window, post-transfer installment liability, mandatory $1,000 BK Foundation, transfer release scope, dispute resolution waivers
**Status:** EXECUTE (light pass — confirm presence of each clause and capture exact language for the 8 findings)

### T2 (HIGH): RTF2 deep read
**Exhibit X1:** pages 969-993
**Target findings:** contribution schedules (3 remodel types × 4 royalty rates × 3 completion years), default cascade, cross-default, general release
**Status:** SKIP for this run (shallow text-only pass would not improve quality enough; defer to next iteration)

### T3 (HIGH): Fuel the Flame Co-Investment deep read
**Exhibit Y1:** pages 999-1008
**Target findings:** $230,000 4-Wall EBITDA threshold mechanics, voting mechanics, Legacy Rate addendum
**Status:** SKIP (Item 6 narrative captured the trigger and Y1/Y2/Y3 referenced; further depth deferred)

### T4 (MEDIUM): Per-state addenda enumeration
**Pages:** 706-801
**Target:** Per-state material override summary for IL, MD, MN, NY, ND, RI, SD, VA (CA, HI, WA already spot-read)
**Status:** EXECUTE (lightweight enumeration pass)

### T5 (MEDIUM): Enrichment v1 / v2 production
**Status:** EXECUTE — produce 11_canonical_enriched.json and 12_canonical_enriched_v2.json by promoting non_canonical_observations and Item 19 detail into structured form

### T6 (MEDIUM): Franchisee list structured output
**Source:** Exhibit O1 pages 592-653
**Status:** SKIP (light pass would not enumerate 5,500+ entities; defer)

### T7 (LOW): Table count gap
**Status:** SKIP (current 16 tables cover all required Items; benchmark 26 includes finer state-by-state breakouts)

## Material recovery summary

EXECUTE (3): T1, T4, T5
SKIP (4): T2, T3, T6, T7 (deferred as enrichment/non-blocking)

These do not constitute "material recovery tasks" requiring B4 execution beyond T1, T4, T5 written into B4 below.
