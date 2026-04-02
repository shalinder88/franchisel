# Franchisel Platform — Data & Build Report
**Date:** April 2, 2026
**Status:** Production build — TypeScript clean ✓

---

## 1. Database Summary

| Metric | Value |
|---|---|
| **Total Brands** | 2,478 |
| **Data Source** | MN CARDS (Minnesota) + WI DFI (Wisconsin) state-filed FDD documents |
| **MN Archive PDFs** | 547 PDFs |
| **WI Archive PDFs** | ~1,850 PDFs |
| **TypeScript errors** | 0 |

---

## 2. FDD Extraction Coverage

| Item | Field | Brands | Coverage |
|---|---|---|---|
| Item 17 | Contract terms (term, renewals, cure period, non-compete, arbitration, venue) | 1,345 | 54% |
| Item 19 | Revenue disclosure (hasItem19 claim) | 1,147 | 46% |
| Item 19 | Extracted revenue object (avg/median/sample size) | 979 | 39% |
| Item 21 | Financials (auditor, going concern, strength signal) | 923 | 37% |
| Item 2 | Management quality (exec count, franchise exp, stability) | 492 | 19% |
| Item 12 | Territory (exclusive territory, radius/pop, franchisor competition) | 253 | 10% |
| Item 4 | Bankruptcy history | 255 | 10% |
| Item 8 | Supplier restrictions (required purchases, lock-in score) | 241 | 9% |
| Item 11 | Support/training (hours, field support, conference) | 109 | 4% |
| Broker/FSO | Broker/FSO usage, conflict-of-interest risk | 108 | 4% |
| State Concentration | HHI, top state share, coverage type | 103 | 4% |

---

## 3. Key Risk Signals Detected

### Financial Risk
| Signal | Count |
|---|---|
| Going concern warnings (Item 21) | 149 |
| Weak financial strength | 270 |
| Strong financial strength | 8 |
| Clean audit opinion | 172 |

### Contract Risk (Item 17)
| Signal | Count |
|---|---|
| Mandatory arbitration clause | 757 |
| No mandatory arbitration | 388 |
| Non-compete clause present | 1,028 |

### Territory Risk (Item 12)
| Signal | Count |
|---|---|
| Exclusive territory granted | 21 |
| No exclusive territory | 211 |

### Management Quality (Item 2)
| Signal | Count |
|---|---|
| Strong management (score 8+/10) | 269 |
| Franchise-experienced management | 305 |

### Broker/FSO Risk
| Signal | Count |
|---|---|
| Uses franchise brokers/FSOs | 108 |
| High conflict-of-interest risk | 82 |

---

## 4. Derived Decision Layers Built

### ✅ Built (Layers 1–8, 11)

| Layer | Description | Data Coverage |
|---|---|---|
| 1 | **System Health** (Item 20) — churn, net growth, terminations, reacquisitions | 1,499 brands with systemHealth |
| 2 | **Normalized Item 19** — avg/median revenue, basis, sample size, confidence | 979 brands |
| 3 | **Franchisor Financial Quality** (Item 21) — auditor, going concern, strength | 923 brands |
| 4 | **Contract Friction Index** (Item 17) — term, cure, non-compete, arbitration, transfer | 1,345 brands |
| 5 | **Support vs. Take Score** (Item 11) — training vs royalty burden | Scoring built |
| 6 | **Economic Burden** (Items 5-8) — royalty, ad fund, investment/revenue ratio | Scoring built |
| 7 | **Territory/Encroachment Risk** (Item 12) — exclusive territory, franchisor competition | 253 brands; `computeTerritoryRisk()` |
| 8 | **Supplier Dependence** (Item 8) — required purchases, lock-in, franchisor supplier revenue | 241 brands; `computeSupplierRisk()` |
| 11 | **Support Quality Signal** (Item 11) — training hours, OJT, field support, conference | 109 brands; `computeSupportQuality()` |

### ✅ Also Built (Cross-Cutting)
- **Management Quality** (Item 2): `computeManagementSignal()` — 492 brands
- **State Concentration**: `computeStateConcentration()` + `stateConcentrationRisk()` — 103 brands
- **Brand Deterioration Detector**: multi-signal deterioration tracking
- **Churn Anatomy**: decomposed exit types (terminated, non-renewed, reacquired, ceased)
- **Downside Economics**: breakeven, minimum viable revenue scenarios
- **Cohort Benchmarks**: percentile rank across category peers
- **Interview Questions Generator**: category-specific due diligence questions
- **YoY Diff Engine**: tracks changes across FDD filing years

### ⏳ Pending (Layers 9–12)

| Layer | Description | Blocker |
|---|---|---|
| 9 | **Financing Burden** (Item 10) — APR, collateral, guaranties, cross-default | No item10 extractor built |
| 10 | **Litigation Behavior Profile** (Items 3-4) — franchisee disputes, recency, severity | item3 data = 0 brands; need extractor |
| 12 | **Change Velocity Score** — multi-field diff tracking across years | Historical diff engine exists (`build_historical_diffs.py`); data matching needed |

---

## 5. UI Pages & Features Built

### Brand Directory (`/brands`)
- Grid/list view with 2,478 brands
- **Search**: name, parent company, category
- **Filters**: Revenue Only toggle, Direct Sales Only toggle (excludes broker brands), Investment Max (Any/$150K/$300K/$500K/$1M), Category pills (≥3 brands), Sort (score/investment/turnover/name)
- **Active filter chips** with dismissal
- WatchButton (star) on every card
- Broker conflict badge on cards
- Score color-coded bar

### Brand Detail Page (`/brands/[slug]`)
- **8 FDD analysis sections**:
  - Item 19 revenue (with comparability flags)
  - System health + churn anatomy + YoY diff
  - Franchisor financial quality (Item 21)
  - Contract friction (Item 17)
  - Broker/FSO conflict (Item 5-6)
  - Territory & Encroachment Risk (Item 12) ← NEW Layer 7
  - Supplier Dependence (Item 8) ← NEW Layer 8
  - State Concentration (Item 20 states)
  - Management Quality (Item 2) ← NEW
  - Support Quality (Item 11) ← NEW Layer 11
- Downside economics scenarios
- Interview question generator
- WatchButton (star) in header + pill in tools

### Diligence Memo (`/brands/[slug]/diligence`)
- Full FDD diligence memo with all 8+ sections
- Territory section (Item 12) ← NEW
- Supplier section (Item 8) ← NEW
- Management section (Item 2) ← NEW
- Broker conflict-of-interest section
- Red flags (auto-generated + manual)
- Interview questions by category

### Lender Pack (`/brands/[slug]/lender-pack`)
- SBA-ready 12-section document
- Section 10: Supplier Dependence (Item 8) ← NEW
- Section 8: Territory Analysis (Item 12) ← NEW
- Section 9: Management Team (Item 2) ← NEW

### Compare Page (`/compare`)
- Side-by-side feature matrix with winner badges + verdict cards
- Territory rows: exclusive territory, franchisor competition, online sales reserved
- Management rows: experienced management, franchise-experienced leadership
- Supplier rows: low lock-in, no franchisor supplier revenue ← NEW
- 35+ comparison dimensions

### Category Pages (`/category/[slug]`)
- Per-category brand grid with stats strip (count, avg investment, avg royalty)
- WatchButton on every card
- Badge row: Item 19 ✓, ⚑ Broker, ⚠ Going Concern

### Watchlist (`/watchlist`)
- Real-time alerts for watched brands
- Risk levels: critical → warning → watch → clean
- Score delta since added
- Alert pills: going concern, critical flags, turnover, no Item 19, weak financials, broker risk, no exclusive territory, low management score, high supplier lock-in, franchisor supplier revenue ← NEW
- Empty state with top-rated brand suggestions

### Header
- WatchlistNavBadge: live count badge on nav link

---

## 6. Python Extraction Pipeline

### Extractors
| Script | Items | Output |
|---|---|---|
| `extract_item17.py` | Item 17 contract terms | `/tmp/item17_extraction_results.csv` |
| `extract_item19_normalized.py` | Item 19 revenue | `/tmp/item19_normalized_results.csv` |
| `extract_item19_aggressive.py` | Item 19 (broad patterns) | `/tmp/item19_aggressive_results.csv` |
| `extract_item21.py` | Item 21 financials | `/tmp/item21_extraction_results.csv` |
| `extract_item2_management.py` | Item 2 management | `/tmp/item2_mgmt_results.csv` |
| `extract_broker_data.py` | Broker/FSO (Items 1,5,6) | `/tmp/broker_extraction_results.csv` |
| `extract_item20_states.py` | Item 20 state tables | `/tmp/item20_state_results.csv` |
| `extract_item8.py` | Item 8 supplier | via facts JSON |
| `extract_all_items.py` | Items 3,4,11,12,17,21 | via facts JSON |

### Push Scripts
| Script | Inserts |
|---|---|
| `update_brands_item17.py` | `item17: { ... }` |
| `update_brands_revenue.py` | `item19: { ... }` + `hasItem19`, `grossRevenueAvg` |
| `update_brands_item21.py` | `item21: { ... }` |
| `update_brands_item2_management.py` | `managementData: { ... }` |
| `update_brands_broker.py` | `brokerData: { ... }` |
| `update_brands_item20_states.py` | `stateConcentration: { ... }` |
| `add_missing_brands.py` | New brand stub entries |

### Known Issue: Orphaned State Concentration Fragments
When the same file_num appears twice in extraction CSVs (duplicate PDF entries), the push script can leave orphaned `{ state: "XX", units: N }` fragments after the closing `},` of the replaced block. Fixed with Python regex cleanup:
- April 2 run: removed 26 orphaned fragments total (24 by first pass + 2 by second pass)
- Root cause: duplicate file_nums in state CSV (same brand in multiple state registries)

---

## 7. Architecture

### Tech Stack
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Data**: Static TypeScript `brands.ts` (133,966 lines, 2,478 brands)
- **Scoring**: All derived scores in `src/lib/diligence.ts`
- **State**: localStorage for watchlist (`fdd_watchlist_v1`)

### Key Files
| File | Purpose |
|---|---|
| `src/data/brands.ts` | Master brand database (all FDD data) |
| `src/lib/types.ts` | TypeScript interfaces for all 20+ FDD items |
| `src/lib/diligence.ts` | All scoring functions (~2,100 lines) |
| `src/hooks/useWatchlist.ts` | localStorage watchlist hook |
| `src/components/WatchButton.tsx` | Star watch button (icon + pill variants) |
| `src/components/WatchlistView.tsx` | Watchlist page component with alerts |
| `src/components/WatchlistNavBadge.tsx` | Nav badge with count |

### Scoring Functions in diligence.ts
| Function | Layer |
|---|---|
| `scoreSystemHealth()` | Layer 1 |
| `scoreFranchisorStrength()` | Layer 3 |
| `scoreEconomicBurden()` | Layer 6 |
| `scoreSupportVsTake()` | Layer 5 |
| `scoreContractFriction()` | Layer 4 |
| `scoreChange()` | Layer 12 (partial) |
| `computeCompositeScores()` | All layers → composite |
| `computeTerritoryRisk()` | Layer 7 |
| `computeSupplierRisk()` | Layer 8 |
| `computeManagementSignal()` | Cross-cutting |
| `computeSupportQuality()` | Layer 11 |
| `computeStateConcentration()` | Cross-cutting |
| `stateConcentrationRisk()` | Cross-cutting |
| `computeDownsideEconomics()` | Scenario analysis |
| `computeChurnAnatomy()` | Item 20 decomposition |
| `detectBrandDeterioration()` | Multi-signal deterioration |
| `computeCohortBenchmarks()` | Category percentiles |
| `generateInterviewQuestions()` | Due diligence questions |
| `getItem19ComparabilityFlags()` | Item 19 quality flags |
| `generateMemo()` | Full diligence memo |

---

## 8. Next Session Priorities

1. **Layer 9: Financing Burden (Item 10)** — Build extractor + push + scoring
2. **Layer 10: Litigation Profile (Items 3-4)** — Build extractor; item4 has 255 brands, item3 = 0
3. **Layer 12: Change Velocity** — Run `build_historical_diffs.py` on 95 WI multi-year brands + MN multi-year PDFs
4. **Expand Item 12 coverage** — Currently 10% (253 brands). Consider re-running `extract_all_items.py` on broader PDF set
5. **Expand Item 11 coverage** — Currently 4% (109 brands). Consider dedicated extractor
6. **Fix category taxonomy** — Several new stub brands got incorrect/raw category names
7. **Competitor analysis refresh** — FRANdata, Vetted Biz, FBR, Franchise Grade (see competitive_intel memory)

---

*Generated automatically by Franchisel build pipeline — April 2, 2026*
