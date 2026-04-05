# 15 Regression Check — Chick-fil-A License Program (638216-2025) vs Manual Gold Extracts

**Current run:** `chick-fil-a-2025/` (post-self-regression recovery, 20 files, 98.7%)
**Gold sources compared:**
1. `638216-2025-ChickfilA-License-GOLD.json` — manual human-verified gold extraction (670 lines, 14 modules)
2. `gold_corpus/brands/chick-fil-a/normalized_gold.jsonl` — 485 normalized gold fields
3. `v7_extractor/training/learned/reports/chick-fil-a-inc._learning.json` — killbill-1.2 extractor learning report

---

## A. Stronger in Current Run

| Dimension | Current | Gold | Verdict |
|---|---|---|---|
| Exhibit E franchisee list | 384 entries CID-decoded with names/addresses | PII-blocked, counts only | Current much richer |
| Exhibit F former licensees | 5 named entries with locations | Existence flag only | Current richer |
| State addenda | 13 states structured with per-state overrides | Not present in gold | Current has unique data |
| License Agreement deep read | Sections 6.11, 7.3, 8, 9, 10, Addendum C/D extracted | Not present | Current has unique data |
| Table 5 projected openings | Licensed: 3/25/0; Restaurants: 38/183/0 | Not present | Current has data gold lacks |
| Financial statement notes | Key notes (related party, leases, insurance, subsequent events) | Summary only | Current deeper |
| Contradiction tracking | 1 documented contradiction | None | Current more rigorous |
| Unresolved tracking | 3 documented unresolveds | 5 coverage gaps | Current more precise |
| Evidence provenance | Every field has source_object, source_pages, confidence | source_status: "needs_evidence_linking" | Current better grounded |

## B. Stronger in Gold Extract

| Dimension | Current | Gold | Verdict | Severity |
|---|---|---|---|---|
| **Item 19 college HIGH/LOW** | None/None | high=$4,906,963, low=$192,830 | **Gold correct — data IS in PDF (p.53)** | **HIGH** |
| **Item 19 college distribution** | None | 5 buckets (<$500K: 10%, $500K-$750K: 13%, $750K-$1M: 19%, $1M-$2M: 35%, >$2M: 23%) | **Gold correct — data IS in PDF (p.53)** | **HIGH** |
| **Manual replacement fee** | Missing | $500 per replacement set | **Gold correct — in Item 11 (p.32)** | **MEDIUM** |
| **Warehouse markup** | Missing | "Cost plus approximately 2.5% plus shipping" | **Gold correct — in Item 8 (p.28)** | **MEDIUM** |
| **Item 19 sample coverage %** | Not explicit | 96% (409/425) | **Gold correct — derivable but not stated** | **LOW** |
| **Licensee FDD since** | 1998-03-13 | May 4, 1992 | **CONFLICT — both present, different dates** | **MEDIUM** |
| **McDonald's comparison** | Not present | Full comparison table (fees, territory, transfers, equity) | Gold has unique analytical content | LOW (analytical, not extraction) |
| **Red flags / strengths** | 3 business risk flags | 9 red flags + 9 strengths | Gold has richer risk taxonomy | LOW (analytical) |
| **Score taxonomy** | Single composite 98.7% | 6-dimension scores (system health 85, franchisor strength 92, etc.) | Gold has richer scoring | LOW (methodology difference) |
| **PII blocking rules** | Not implemented | Full PII block log | Different purpose — gold is customer-facing | N/A |

## C. Conflict Fields Requiring Adjudication

| # | Field | Current Run | Gold Extract | Source Needed |
|---|---|---|---|---|
| C1 | `bankruptcy_flag` | `true` (disclosure exists) | `hasBankruptcy: false` (not CFA bankruptcy) | **YES** — semantic disagreement |
| C2 | `encroachment_risk` | "High" | "moderate" | **YES** — analytical disagreement |
| C3 | `licensee_FDD_since` | 1998-03-13 | May 4, 1992 | **YES** — factual conflict |

## D. Material Regressions from Gold — Must Fix

1. **R1 (HIGH): Item 19 college high/low** — $4,906,963 highest, $192,830 lowest. Verified in PDF page 53.
2. **R2 (HIGH): Item 19 college distribution** — 5 buckets verified in PDF page 53. Current extraction missed the bottom of page 53 where this data appears.
3. **R3 (MEDIUM): Manual replacement fee** — $500 per replacement set. Verified in Item 11 page 32.
4. **R4 (MEDIUM): Warehouse markup** — "Cost plus approximately 2.5% plus shipping." Verified in Item 8 page 28.
5. **R5 (LOW): Item 19 sample coverage %** — 409/425 = 96.2%. Derivable from existing data.

## E. Non-Regressions (Analytical Differences)

The gold extract contains rich analytical content (McDonald's comparison, red flags, strengths, multi-score taxonomy, PII blocking rules, extractor learnings) that represents a different *purpose* than a pipeline extraction. These are not regressions — they are product-layer analytics built on top of the raw extraction. The current run should focus on getting the raw facts right; the analytical layer is a separate concern.
