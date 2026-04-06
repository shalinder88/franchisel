# RP1 — Exhibit J OCR Recovery (via Vision Cascade)

## Status: **FULLY RECOVERED**

## Render cascade applied (per new policy)
1. `pdftoppm` (poppler) — **not installed in this environment**
2. **`fitz` page-to-image render** at 200 DPI — **used**. 30 pages (PDF p168–197) rendered to PNG (~28 MB).
3. OCR fallback: tesseract binary not installed, but the multimodal Read tool natively reads rendered PNG images. Used Read on each rendered page to extract structured text.

Cascade output staged at `_render_cascade/p168.png` … `p197.png`.

## Auditor identity (newly surfaced)
- **Firm**: Reese CPA LLC
- **Address**: 2580 East Harmony Road, Ste 301-10, Ft. Collins, CO 80528
- **Phone**: (303) 999-6485
- **Audit report signed**: Ft. Collins, Colorado, **March 13, 2025**
- **Subsequent events evaluated through**: March 13, 2025

## Audit opinion (newly surfaced)
**Unmodified ("clean") opinion.** Standard GAAS language. The auditor explicitly evaluated going concern and concluded "Ivybrook Franchising, LLC's ability to continue as a going concern for a reasonable period of time" — **no going-concern modification was issued**. This materially softens the qualitative reading of cover Special Risk #2: the financial-condition flag in the FDD is driven by quantitative thinness (low members' equity vs initial-investment range) and the IL AG–imposed fee deferral, **not** by an auditor going-concern opinion.

## Balance Sheet (newly surfaced)

| | **Dec 31 2024** | **Dec 31 2023** |
|---|---:|---:|
| Cash and equivalents | $300,274 | $313,981 |
| Accounts receivable | $138,336 | $108,995 |
| Deferred license commissions, current | $10,000 | $10,000 |
| Deferred franchise acquisition costs, current | $498,567 | $372,879 |
| **Total current assets** | **$947,177** | **$805,855** |
| Property and equipment, net | $443,787 | $461,831 |
| Franchise acquisition costs | $2,083,043 | $1,622,552 |
| Deferred license commissions | $10,000 | $20,000 |
| Due from affiliates | $410,358 | — |
| **TOTAL ASSETS** | **$3,894,365** | **$2,910,238** |
| Accounts payable and accrued expenses | $36,978 | $22,611 |
| Due to affiliates | — | $32,642 |
| Due to members | $27,500 | $27,500 |
| Deferred non-refundable license fees, current | $25,000 | $25,000 |
| Deferred non-refundable franchise fees, current | $710,067 | $531,567 |
| **Total current liabilities** | **$799,545** | **$639,320** |
| Deferred non-refundable franchise fees, long-term | $2,723,958 | $2,172,911 |
| Deferred non-refundable license fees, long-term | $25,000 | $50,000 |
| **TOTAL LIABILITIES** | **$3,548,503** | **$2,862,231** |
| **MEMBERS' EQUITY** | **$345,862** ✓ matches VA addendum | **$48,007** |
| **TOTAL LIABILITIES AND MEMBERS' EQUITY** | **$3,894,365** | **$2,910,238** |

## Statements of Operations (newly surfaced)

| | **2024** | **2023** | **2022** |
|---|---:|---:|---:|
| Royalty fees | $1,361,217 | $1,111,492 | $695,500 |
| Franchise fees | $517,953 | $493,396 | $470,350 |
| License fees | $25,000 | $25,000 | $25,000 |
| Other revenues | $267,193 | $203,543 | $184,888 |
| **Total revenues** | **$2,171,363** ✓ matches Item 8 | **$1,833,431** | **$1,375,738** |
| Cost of sales | $524,698 | $676,948 | $451,723 |
| **Gross profit** | **$1,646,665** | **$1,156,483** | **$924,015** |
| Payroll and related costs | $655,157 | $394,407 | $363,903 |
| General and administrative | $311,224 | $221,004 | $157,072 |
| Professional services | $134,062 | $52,672 | $44,515 |
| Advertising expense | $128,504 | $30,889 | $31,065 |
| Depreciation | $18,044 | $22,006 | $18,221 |
| **Total operating expenses** | **$1,236,991** | **$720,978** | **$614,776** |
| **Operating income** | **$409,674** | **$435,505** | **$309,239** |
| Interest expense | ($138) | — | — |
| Tax expense | ($96,481) | — | — |
| **Net income** | **$313,055** | **$435,505** | **$309,239** |

## Statement of Changes in Members' Equity (newly surfaced)

| | Members' Contributions | Accumulated Earnings | Total Members' Equity |
|---|---:|---:|---:|
| Balance Dec 31, 2021 | $79,222 | $56,885 | **$136,107** |
| 2022 distributions | — | ($300,000) | ($300,000) |
| 2022 net income | — | $309,239 | $309,239 |
| **Balance Dec 31, 2022** | **$79,222** | **$66,124** | **$145,346** |
| 2023 distributions | — | ($532,844) | ($532,844) |
| 2023 net income | — | $435,505 | $435,505 |
| **Balance Dec 31, 2023** | **$79,222** | **($31,215)** | **$48,007** |
| 2024 distributions | — | ($15,200) | ($15,200) |
| 2024 net income | — | $313,055 | $313,055 |
| **Balance Dec 31, 2024** | **$79,222** | **$266,640** | **$345,862** |

## Statements of Cash Flows (newly surfaced)

| | **2024** | **2023** | **2022** |
|---|---:|---:|---:|
| Net income | $313,055 | $435,505 | $309,239 |
| Depreciation | $18,044 | $22,006 | $18,221 |
| Recognition of deferred license commissions | $10,000 | $10,000 | $10,000 |
| Recognition of franchise development costs | $331,221 | $464,555 | $380,553 |
| Recognition of non-refundable deferred license fees | ($25,000) | ($25,000) | ($25,000) |
| Recognition of non-refundable deferred franchise fees | ($517,953) | ($518,396) | ($470,350) |
| Δ Accounts receivable | ($29,341) | ($48,995) | ($10,000) |
| Δ Franchise development costs | ($917,400) | ($923,000) | ($783,400) |
| Δ Accounts payable | $14,367 | $6,275 | $7,815 |
| Δ Non-refundable deferred franchise fees | $1,247,500 | $1,155,000 | $875,000 |
| **Cash from operating activities** | **$444,493** | **$577,950** | **$312,078** |
| Purchases of P&E | — | ($264,250) | ($83,918) |
| **Cash from investing activities** | **0** | **($264,250)** | **($83,918)** |
| Due from affiliate | ($443,000) | $211,448 | ($37,156) |
| Member distributions | ($15,200) | ($532,844) | ($300,000) |
| **Cash from financing activities** | **($458,200)** | **($321,396)** | **($337,156)** |
| Net increase in cash | ($13,707) | ($7,696) | ($108,996) |
| Cash, beginning of year | $313,981 | $321,677 | $430,673 |
| **Cash, end of year** | **$300,274** | **$313,981** | **$321,677** |
| Cash paid for interest | — | — | — |
| Cash paid for taxes | — | — | — |

## Notes to Financial Statements (newly surfaced)

### Note 1 — Nature of Business and Significant Accounting Policies
- Ivybrook Franchising, LLC formed March 26, 2015 in NC; perpetual LLC.
- Operates as a comprehensive children's preschool franchisor.
- **Affiliates as disclosed in audit notes**:
  - **McWilliams Education Services, LLC (MES)** — formed July 27, 2007, NC LLC; affiliate operating school; never offered franchises.
  - **McWilliams Properties, LLC (MP)** — formed June 14, 2005, NC LLC. Owns the principal trademark "Ivybrook Academy" and licenses it to Ivybrook Franchising under an initial 20-year term auto-renewing for successive 20-year terms.
  - **Catapult Industries, LLC (CI)** — formed October 25, **2022**, VA LLC. Develops software, exclusive supplier of The Student Hub. **CONFLICT**: Item 1 body (p8) says Catapult was formed October 25, **2019**; the audited Note 1 says October 25, 2022. Two-year discrepancy. Preserved.
- **NEW AFFILIATE NOT DISCLOSED IN ITEM 1**: McWilliams Properties, LLC (MP) is the trademark-owning entity. Item 1 body says "Ivybrook Franchising, LLC owns the principal trademarks" (p33) — but the audit note says MP owns the marks and licenses them to Ivybrook. **MATERIAL CONTRADICTION**: trademark ownership.
- Single-member or multi-member LLC; members not personally liable for debts.
- **Cash equivalents**: highly liquid investments with original maturity ≤3 months. No cash equivalents at Dec 31, 2024 or 2023.
- **Accounts receivable**: net of allowance for uncollectible accounts; **no allowance recorded** as of Dec 31, 2024 and 2023.
- **Property, plant & equipment**: ASC 360, historical cost, straight-line depreciation over estimated useful lives of related assets (generally 5–30 years).
- **Revenue recognition**: ASC 606 "Contracts with Customers". Contract price allocated to performance obligations. **50% of franchise fee allocated to pre-opening services; balance recognized over the 15-year franchise term** beginning at school opening. Royalties recognized monthly as earned.
- **Franchise acquisition costs**: amortized over 15-year term of franchise agreement.
- **Brand Fund**: 1% of total gross revenue, collected monthly.
- **Advertising costs** (newly surfaced — was unresolved): expensed as incurred. **$118,504 (2024), $30,889 (2023), $31,065 (2022)** for years ended Dec 31. The $118,504 in 2024 is a 4× jump and matches the $128,504 in the income statement within $10K (likely splits between brand-fund-funded advertising and other; or a typo in one of the two figures — preserve as a soft inconsistency).
- **Income taxes**: Company elected to be treated as Subchapter S corporation. Income passes to members. Adopted ASC 740-10-25-6 ("Accounting for Uncertainty in Income Taxes"). No uncertain tax positions. Open tax years: 2024, 2023, 2022 for U.S. federal and NC state. **Beginning year ending December 31, 2024, members have pushed down to the Company the amount of income taxes that would be paid by the Company if the Company reported as a 'C Corporation' for income tax purposes.** This explains the new $96,481 2024 tax expense.

### Note 2 — Contract Balances
**Franchise Acquisition Costs**:
- Beginning of year 2024: $1,995,431 (vs 2023 begin: $1,536,986)
- Deferral of franchise acquisition costs 2024: $917,400 (2023: $923,000)
- Recognition of franchise acquisition costs 2024: ($331,221) (2023: ($464,555))
- End of year 2024: **$2,581,610** (2023: $1,995,431)

**Deferred Non-refundable Franchise Fees**:
- Beginning 2024: $2,704,478 (2023 begin: $2,067,874)
- Deferral 2024: $1,247,500 (2023: $1,155,000)
- Recognition 2024: ($517,953) (2023: ($518,396))
- End 2024: **$3,434,025** (2023: $2,704,478)

**Deferred License Commissions**: 30,000 → 20,000

**Deferred License Fees**: 75,000 → 50,000

**Disaggregation of Revenue**:
| | 2024 | 2023 | 2022 |
|---|---:|---:|---:|
| Performance obligations earned at a point in time | $2,098,410 | $1,617,535 | $1,257,888 |
| Performance obligations earned through passage of time | $72,953 | $215,896 | $117,850 |
| **Total revenues** | **$2,171,363** | **$1,833,431** | **$1,375,738** |

**Estimated future recognition of non-refundable deferred franchise fees** as of Dec 31, 2024:

| Year ending Dec 31 | Franchise Acquisition Costs | Non-refundable Franchise Fees |
|---|---:|---:|
| 2025 | $498,567 | $710,067 |
| 2026 | $392,134 | $502,467 |
| 2027 | $284,181 | $397,800 |
| 2028 | $175,863 | $225,633 |
| 2029 | $136,685 | $183,133 |
| Thereafter | $1,094,390 | $1,414,925 |
| **Total** | **$2,581,820** | **$3,434,025** |

### Note 3 — Licensing Agreement (newly surfaced)
During 2017, the Company entered into a licensing agreement with a licensor (McWilliams Properties, LLC, the trademark-owning affiliate). The licensee paid a fee of **$250,000** for use of the Company's curriculum, daily lesson plans, operation manuals, administrative forms, paperwork, and parent communication letters. **Term is 10 years.** Commission is paid to a third party in securing the agreement of $100,000. Consistent with the Company's accounting policy, the revenue and commission paid will be recognized on a straight-line basis over the 10-year term of the agreement.

### Note 4 — Property and Equipment

| | 2024 | 2023 |
|---|---:|---:|
| Building and leasehold improvements | $160,799 | $160,799 |
| Operating equipment and furniture | $382,471 | $382,471 |
| Subtotal | $543,270 | $543,270 |
| Accumulated depreciation | ($99,483) | ($81,439) |
| **Net P&E** | **$443,787** | **$461,831** |

Depreciation expense: **$18,044 (2024), $22,006 (2023), $18,221 (2022)**.

### Note 5 — Related Party Transactions (newly surfaced)
**Amounts Due to/from Affiliates**: Company and affiliates may advance amounts to each other on a short-term, zero-interest, no-due-date basis.
- Due **from** affiliates: **$410,358 at Dec 31, 2024**, **$32,642 at Dec 31, 2023**.
- Due to affiliates: **0 at Dec 31, 2024**, included in liabilities at Dec 31, 2023 ($32,642).

**Due to Member**: During 2022, members advanced funds in support of operations. Amount due on demand, bears no interest, not collateralized. **Outstanding $27,500 at Dec 31, 2024 and 2023**.

### Note 6 — Commitments and Contingencies
**Litigation**: The Company may be subject to various claims, legal actions, and complaints arising in the ordinary course of business. In the opinion of management, all matters are of such kind, or involve such amounts, that unfavorable disposition, if any, would not have a material effect on the financial position of the Company. (Consistent with Item 3 disclosure of no required litigation.)

### Note 7 — Subsequent Events
**Date of Management's Evaluation**: Management has evaluated subsequent events through **March 13, 2025**, the date on which the financial statements were available to be issued.

**No subsequent events disclosed.** The August 29, 2025 acquisition by Ivybrook OpCo / Crux I Ivybrook (Aggregator), LP is **not referenced** in Note 7 because it occurred after the March 13, 2025 evaluation cutoff. The acquisition is disclosed in Item 1 body of the FDD (which was amended September 15, 2025) but is not reflected in the audited statements.

## Newly surfaced material findings

1. **Auditor**: Reese CPA LLC, Ft. Collins CO. Standard unmodified opinion. **No going-concern modification.**
2. **Members' equity 2023→2024**: $48,007 → $345,862 (+$297,855), driven by $313,055 net income with only $15,200 distributions. The 2023 number was depressed by $532,844 in 2023 distributions.
3. **Cash position**: Stable at ~$300K across 3 years. Operating cash flow positive in all 3 years ($312K, $578K, $444K). Healthy.
4. **Deferred franchise fees** reach **$3.43M** at end-2024 (current $710K + LT $2.72M) — this is unearned cash from the 42 signed-not-opened backlog. As those schools open, the franchise fees will be recognized into revenue over the 15-year term.
5. **Tax push-down 2024**: New $96,481 tax expense in 2024 because members elected to push C-corp-equivalent tax down to the company starting in 2024. This depressed net income from what otherwise would have been ~$409,536.
6. **Trademark ownership contradiction**: Item 1 body says Ivybrook Franchising owns the marks; Note 1 says **McWilliams Properties, LLC** owns them and licenses them to Ivybrook under a 20-year license. **MATERIAL** — preserved as new contradiction.
7. **Catapult formation date contradiction**: Item 1 body says October 25, **2019**; Note 1 says October 25, **2022**. Preserved.
8. **Advertising expense actuals** newly surfaced: $118,504 (2024), $30,889 (2023), $31,065 (2022). The 4× jump in 2024 is consistent with deploying the Brand Fund as 2024 was the first year significant Brand Fund balances accumulated.
9. **Affiliate not disclosed in Item 1**: McWilliams Properties, LLC (NC, formed June 14, 2005) — owns the trademarks. Item 1 lists only MES, Catapult, OpCo, HoldCo, Crux. MP is structurally important because trademark ownership sits at MP, not Ivybrook Franchising.
10. **Subsequent-events evaluation cutoff (March 13, 2025) pre-dates the August 29, 2025 PE acquisition**, confirming the acquisition is not in Exhibit J.

## Item 21 status update
**Item 21 is now FULLY SURFACED.** The image-only blocker is resolved. All balance sheet, income statement, equity statement, cash flow statement, and notes are extracted and structured.

## Cover Special Risk #2 reassessment
The "financial condition calls into question" language is **structurally accurate** but the auditor signed a clean opinion. The IL fee deferral and VA stockholder's-equity disclosure are driven by:
- **Low absolute equity** ($345,862 at end-2024) relative to franchisee initial investment ($540K-$869K). True.
- **Heavy unearned revenue** ($3.43M deferred franchise fees) representing future obligations to deliver pre-opening and ongoing services. True.
- **Negative working capital trend** has resolved: 2024 current assets $947K vs current liab $800K — positive working capital of $148K (compared to slightly positive in 2023).

The financial-condition risk is REAL but **less severe than the qualitative cover language alone implies**. The auditor's clean opinion is the most important qualitative anchor, and Item 21 should be re-presented in the brand publish layer with the auditor's clean opinion alongside the IL/VA risk language.
