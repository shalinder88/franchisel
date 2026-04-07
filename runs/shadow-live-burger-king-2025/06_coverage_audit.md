# 06 — Coverage Audit

Run: shadow-live-burger-king-2025

## Item-by-item coverage

| Item | Read | Captured | Notes |
|------|------|----------|-------|
| Cover/How to Use/Special Risks/State notices | ✓ | ✓ | |
| TOC + Exhibit list | ✓ | ✓ | |
| Item 1 Franchisor/parents/predecessors/affiliates | ✓ | ✓ full | |
| Item 2 Business experience | ✓ | ✓ | board + execs captured by name+title |
| Item 3 Litigation | ✓ | ✓ | 6 pending + 1 franchisor + 6 concluded |
| Item 4 Bankruptcy | ✓ | ✓ | none |
| Item 5 Initial fees | ✓ | ✓ full | including all incentive programs |
| Item 6 Other fees | ✓ | ✓ full | full table extracted |
| Item 7 Initial investment | ✓ | ✓ full | all 6 facility tables |
| Item 8 Sources of products/services | ✓ | ✓ full | supplier economics captured |
| Item 9 Franchisee obligations | ✓ | ✓ | obligations table captured |
| Item 10 Financing | ✓ | ✓ full | Crown Your Career terms detail |
| Item 11 Assistance/advertising/computer/training | ✓ | ✓ full | training, MOD, POS, ad fund breakdown |
| Item 12 Territory | ✓ | ✓ full | NO exclusive territory; AAFES carve-out |
| Item 13 Trademarks | ✓ | ✓ | Mattoon IL 20-mile carve-out flagged |
| Item 14 Patents/copyrights/proprietary | ✓ | ✓ | AI/ML restriction noted |
| Item 15 Personal participation | ✓ | ✓ full | Operating Partner / Managing Owner / Crown Your Career |
| Item 16 Restrictions on what franchisee may sell | ✓ | ✓ | ROYAL PERKS mandatory |
| Item 17 Renewal/termination/transfer/dispute resolution | ✓ | ✓ full | all 5 agreements (FA, TRA/MTRA, BKL, Dev Agmt, Carrols APA) |
| Item 18 Public figures | ✓ | ✓ | none |
| Item 19 FPR | ✓ | ✓ full | Section A (4 sub-tables) + Section B (5 cohorts) |
| Item 20 Outlets and franchisee info | ✓ | ✓ full | Tables 1, 2 totals, 3 spot-checked, 4, 5; O3 count 1,433 |
| Item 21 Financial statements | ✓ | ✓ full | KPMG / RBI consolidated; balance sheet + income stmt extracted; CA addendum unaudited BKC noted |
| Item 22 Contracts | ✓ | ✓ | A-Z list |
| Item 23 Receipts | ✓ | ✓ | |

## Exhibit coverage

| Exhibit | Located | Notes |
|---------|---------|-------|
| A/A1 Service of Process | ✓ p131 | |
| B1/B2 Applications | ✓ pp139, 151 | |
| C1/C2 TRA/MTRA | ✓ pp163, 173 | |
| D1/D2/D3 FA + Guaranty | ✓ pp185, 233, 275 | full clause text not read; summarized via Item 17 |
| E1/E2 Non-traditional | ✓ pp282, 300 | |
| F1/F2/F3 Carrols Refranchise | ✓ pp317, 322, 351 | |
| G1/G2/G3 Lease/Sublease/APA | ✓ pp358, 399, 406 | |
| H1/H2/H3 Successor | ✓ pp440, 445, 449 | |
| I1 Investment Spending | ✓ p453 | |
| J1/J2/J3 FA Addenda | ✓ pp474, 485, 492 | |
| K1/K2 DIP 2024 | ✓ pp499, 504 | |
| L1/L2/L3 BKoT | ✓ pp509, 521, 534 | |
| M1/M2 Development | ✓ pp540, 564 | |
| N1/N2 Reclaim the Flame | ✓ pp569, 588 | |
| O1 Franchised list | ✓ pp592-653 | not enumerated |
| O2 Company-owned | ✓ pp654-675 | not enumerated |
| O3 Ceased/silent | ✓ pp676-705 | count 1,433 captured |
| P State Addenda | ✓ pp706-801 | states present include CA, HI, IL, MD, MN, NY, ND, RI, SD, VA, WA; full enumeration deferred |
| Q Financial Statements | ✓ pp802-910 | KPMG opinion + RBI consolidated extracted; RBILP subset not separately enumerated |
| R Potential Sellers | ✓ p911 | |
| S1/S2 Prior DIP | ✓ pp914, 918 | |
| T1/T2 Prior Successor | ✓ pp923, 929 | |
| U Operations Manual TOC | partial | only 639-page count noted (Item 11) |
| V Digital App Services | ✓ p942 | |
| W Midterm Remodel Forbearance | ✓ p957 | |
| X1/X2/X3 RTF2 | ✓ pp969, 991, 995 | |
| Y1/Y2/Y3 Fuel the Flame | ✓ pp999, 1009, 1013 | |
| Z1-Z4 Crown Your Career | ✓ pp1018, 1024, 1029, 1037 | |

## Material gaps for retry consideration

1. **Wisconsin addendum.** WI is the registration state for this filing (637918), and BK is registered in WI per the Hawaii addendum's state list. Yet no separate "State of Wisconsin Addendum" was found in the Exhibit P range (706-801) by grep. **Action: targeted retry** to scan the full state addenda block and either (a) confirm WI override exists, or (b) confirm WI is registered without state-specific clause overrides.
2. **State addenda enumeration.** Need a complete list of states with addenda and a one-line per-state summary of material override.
3. **Exhibit O3 ceased franchisee list.** Count of 1,433 captured but state-by-state distribution not extracted.
4. **Item 20 Table 3 reconciliation.** Spot-checked early-alphabet states; full per-state status table for franchised outlets across 50 states should be reconciled against Table 1 totals.
5. **Crown Your Career promissory note rate / collateral specifics.** Captured in summary but not enumerated.
6. **Franchise Agreement clause-level reads.** D1/D2 (pp 185-281) summary captured via Item 17 only; full clause text not extracted. Acceptable for canonical purposes.
7. **Operations Manual TOC.** Only the page count (~639) is captured.
8. **Litigation outcome status check on Mister Crab Italy hearing 1/27/2026.** The hearing date is in the past relative to today (2026-04-07), so an update may exist outside this PDF.

## Triage

Will EXECUTE in Step 7:
- R1: Wisconsin addendum confirmation (high priority, this is the WI registration filing)
- R2: State addenda enumeration (high priority for diligence completeness)

Will SKIP (deferred to A2 or post-publish):
- R3-R8 above (medium/low priority; not blocking publish)
