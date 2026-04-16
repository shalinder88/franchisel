# Coverage Audit — Hilton Garden Inn FDD (638057-2025)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| Item 1 | ✅ Complete | Entity structure, predecessors, affiliates, brand description all extracted |
| Item 2 | ✅ Complete | Key personnel identified (CEO, CFO, GC, brand leader, chairman, directors) |
| Item 3 | ✅ Complete | 5 pending actions, 6 concluded actions extracted |
| Item 4 | ✅ Complete | No bankruptcy |
| Item 5 | ✅ Complete | All initial fees extracted with notes |
| Item 6 | ✅ Complete | All ongoing fees extracted — unusually detailed (14 pages). 10 notes extracted. |
| Item 7 | ✅ Complete | Full investment table for 132-room prototype. 22 notes extracted. |
| Item 8 | ✅ Complete | Supplier restrictions, HSM details, affiliate revenues |
| Item 9 | ✅ Complete | Cross-reference table to FA sections |
| Item 10 | ✅ Complete | Development Incentive program, financing details |
| Item 11 | ✅ Complete | Pre-opening assistance, technology stack, training program (12 courses) |
| Item 12 | ✅ Complete | No exclusive territory; Restricted Area concept explained |
| Item 13 | ✅ Complete | Trademarks owned by HIH, licensed to franchisor |
| Item 14 | ✅ Complete | No material patents; Manual copyrighted but not registered |
| Item 15 | ✅ Complete | Management company requirements, Competitor definition, Guaranty |
| Item 16 | ✅ Complete | 24/7 operation, restaurant requirement, amenity requirements |
| Item 17 | ✅ Complete | Term, renewal, termination, transfer, noncompete, dispute resolution |
| Item 18 | ✅ Complete | No public figures |
| Item 19 | ✅ Complete | All 6 FPR tables extracted (rate, occupancy, indices, new gen) |
| Item 20 | ✅ Complete | All 5 standard tables extracted. Gag clause noted. |
| Item 21 | ✅ Complete | All 3 financial statements + 9 notes extracted |
| Item 22 | ✅ Complete | Contract list extracted |
| Item 23 | ✅ Complete | Receipts reference |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | ✅ Cataloged | Franchisee list — page range identified, not deep-read (PII) |
| B | ✅ Cataloged | Former franchisee list — page range identified |
| C | ✅ Deep-read | All financial statements and notes extracted |
| D | ⚠️ Cataloged | FA — page range identified; clause-by-clause reserved for A2 depth pass |
| D-1 | ⚠️ Cataloged | State Addenda to FA — page range identified; deep extraction reserved for A2 |
| D-2 | ✅ Cataloged | Development Incentive Note |
| D-3 | ✅ Cataloged | Restaurant Brand Amendment |
| E | ⚠️ Cataloged | Guaranty — not deep-read |
| F | ✅ Cataloged | Franchise Application |
| G | ⚠️ Cataloged | HITS Agreement — 23 pages; reserved for A2 depth pass |
| H-1 | ✅ Cataloged | Brand Standards TOC |
| H-2 | ✅ Cataloged | Restaurant Brands TOC |
| I | ✅ Cataloged | State Administrators |
| J-1 | ✅ Deep-read | State Addenda to Disclosure Document — all 11 states extracted |
| J-2 | ✅ Cataloged | Restaurant Brands Addendum |
| K | ✅ Cataloged | Lender Comfort Letters |
| L | ✅ Cataloged | State Effective Dates |
| M | ✅ Cataloged | Receipts |

## Identified Gaps

### Material Gaps (requiring retry)
None identified. All 23 items have been read and extracted.

### Minor Gaps (documented, not requiring retry)
1. **Exhibit D clause-by-clause extraction** — Reserved for A2 depth pass (contract burden).
2. **Exhibit D-1 structured state addenda** — Reserved for A2 depth pass (state addenda promotion).
3. **Exhibit E guaranty scope detail** — Cataloged but not deep-read. Guaranty scope described in Item 15.
4. **Exhibit G HITS Agreement clause detail** — Reserved for A2 depth pass.

## Table Verification

| Expected Table | Found | Notes |
|----------------|-------|-------|
| Item 5 Initial Fees table | ✅ | 11 fee types extracted |
| Item 6 Other Fees table | ✅ | 23+ fee types extracted across general, computer, QA, training, distribution, transfer, remedies sections |
| Item 7 Investment table | ✅ | 25 line items; total $21.9M-$32.4M |
| Item 9 Obligations cross-reference | ✅ | 26 obligation categories |
| Item 17 Franchise Relationship table | ✅ | All provisions a-w extracted |
| Item 19 Room Rate (all comparable) | ✅ | 2023-2024 |
| Item 19 Occupancy (all comparable) | ✅ | 2023-2024 |
| Item 19 Occupancy Index | ✅ | 2023-2024 |
| Item 19 RevPAR Index | ✅ | 2023-2024 |
| Item 19 New Gen Room Rate | ✅ | 2023-2024 |
| Item 19 New Gen Occupancy | ✅ | 2023-2024 |
| Item 20 Table 1 (Systemwide) | ✅ | 2022-2024 |
| Item 20 Table 2 (Transfers) | ✅ | 2022-2024, state-by-state |
| Item 20 Table 3 (Franchised Status) | ✅ | 2022-2024, state-by-state |
| Item 20 Table 4 (Company-Owned) | ✅ | All zeros (asset-light) |
| Item 20 Table 5 (Projected Openings) | ✅ | 90 signed/16 projected |
| Item 21 Balance Sheet | ✅ | 2024-2023 |
| Item 21 Income Statement | ✅ | 2022-2024 |
| Item 21 Cash Flow | ✅ | 2022-2024 |

## Unresolveds

1. **Item 19 — No profit/loss data disclosed.** The FPR provides only room rate, occupancy, and competitive indices. No EBITDA, cost build-up, or profit data. This is by design (Hilton's choice), not an extraction gap. Severity: medium (material for prospective franchisee decision-making).

2. **Territory — Restricted Area negotiability unclear.** The standard FA has no protected territory, but some FAs may include a Restricted Area. The FDD does not specify under what conditions a Restricted Area is offered or its typical scope. Severity: medium.

3. **Insurance requirements — not fully disclosed.** Insurance types and minimum levels are "specified in the Manual" but not enumerated in the FDD. Severity: low (standard practice).

4. **Management Company approval criteria — general.** Franchisor evaluates proposed management based on "organizational structure, prior experience and performance" but specific criteria are not published. Severity: low.

5. **Hilton debt guarantee details — opaque.** Note 7 states company assets are pledged for Hilton parent debt (maturing 2025-2033) but does not quantify the total guaranteed amount. Severity: medium (systemic risk).

## Contradictions

1. **Note 9 date error:** Note 9 to financial statements states "We have evaluated all subsequent events through March 18, 2024" — but the audit date is March 18, 2025. This appears to be a typographical error in the financial statements (should read "2025"). Source: page 145. Severity: low (clearly a typo).
