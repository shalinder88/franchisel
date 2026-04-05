# RT-04: Guarantee of Performance + RT-05: Modern Image Comparison + RT-09: RBILP Financials + RT-10: Canonical Structuring

---

## RT-04: Guarantee of Performance

**Finding:** Pages 852 and 910 are blank pages. No separately-headed Guarantee of Performance documents were found in the scan of Exhibit Q boundary areas (pages 851-853, 909-911). The guarantees are referenced in Item 21 (page 127) as being "also included at Exhibit Q."

**Possible explanations:**
1. The guarantees may be embedded within the financial statement notes (pages 813-851 for RBI or 863-909 for RBILP) rather than as standalone documents.
2. They may appear as short-form pages between the two financial statement sets (page 852 is blank, page 853 starts the RBILP index).
3. The California addendum references an "unaudited consolidated balance sheet of BKC" also at Exhibit Q — there may be additional pages between the RBILP notes and Exhibit R (pages 909-911, of which 910 is blank and 911 is Exhibit R cover).

**Status:** Not located. The guarantee structure is confirmed via Item 21 (RBI for most states, RBILP for CA/IL/MD/ND/RI/VA/WA), but the operative guarantee text, scope, conditions, and limitations remain unsurfaced.

**Recommendation:** Would require a page-by-page scan of every page from 849-911 to definitively locate or confirm absence.

---

## RT-05: Modern Image vs Legacy Image Sales Comparison

**Finding:** Re-read of pages 99-100 confirms the Section A introduction states: "Sales Distributions are also provided for Modern Image 'Traditional Restaurants' compared to Legacy Image 'Traditional Restaurants' as those terms are defined in this Item."

However, **no separate table for this comparison appears on pages 99-100 or in the immediately following pages.** The only tables on these pages are the Traditional/Non-Traditional percentage distribution table and summary statistics table, which do not break down by image type.

**Resolution of UNR-02:** The comparison is referenced in the introductory text but does not appear as a separate table in the pages scanned (99-103). It may exist on a page not yet read — possibly between the Fuel Co-Branded tables (pages 101-103) and Section B (page 104). Or it may have been intended but omitted from this FDD version.

**Status:** Confirmed absent from pages 99-103. The reference exists but the table does not appear in the expected location. This is a definitive finding: **the Modern Image vs. Legacy Image sales comparison is referenced but not delivered as a standalone table in Section A.**

---

## RT-09: RBILP Financial Statement Headlines

**Source:** PDF pages 858-862

RBILP financials are materially identical to RBI consolidated figures because RBI consolidates RBILP. Key differences are in equity structure only.

### RBILP Consolidated Balance Sheet (12/31/2024)

| Line Item | 2024 ($M) | 2023 ($M) |
|---|---|---|
| Total current assets | $2,282 | $2,173 |
| Total assets | $24,632 | $23,391 |
| Total current liabilities | $2,364 | $2,144 |
| Long-term debt | $13,455 | $12,854 |
| Total liabilities | $19,789 | $18,661 |
| Class A common units (208.6M units) | $10,607 | $9,620 |
| Partnership exchangeable units (127.0M units) | ($4,241) | ($3,907) |
| AOCI | ($1,525) | ($985) |
| Total Partners' capital | $4,841 | $4,728 |
| Total equity | $4,843 | $4,730 |

### RBILP Consolidated Income Statement (2024)

| Line Item | 2024 ($M) | 2023 ($M) | 2022 ($M) |
|---|---|---|---|
| Total revenues | $8,406 | $7,022 | $6,505 |
| Income from operations | $2,419 | $2,051 | $1,898 |
| Net income | $1,445 | $1,718 | $1,482 |
| Net income attributable to common unitholders | $1,442 | $1,715 | $1,479 |
| Class A EPS — basic and diluted | $5.00 | $5.89 | $4.99 |

### RBILP Consolidated Cash Flow (2024)

| Line Item | 2024 ($M) | 2023 ($M) | 2022 ($M) |
|---|---|---|---|
| Net cash from operations | $1,503 | $1,323 | $1,490 |
| Net cash from investing | ($660) | $11 | ($64) |
| Net cash from financing | ($625) | ($1,374) | ($1,307) |
| Cash at end of period | $1,334 | $1,139 | $1,178 |

**Conclusion:** RBILP total assets, liabilities, revenues, and cash flows are identical to RBI — confirming RBI consolidates 100% of RBILP. The only difference is equity presentation: RBILP reports Partners' capital (Class A units + exchangeable units) vs. RBI's shareholders' equity. Both entities have identical guarantor capacity.

---

## RT-10: Canonical Structuring of Already-Read Fields

The following families were read in earlier passes but not coded into 05_canonical.json. They should be added:

### Owner Participation (Item 15)
- **Individual/Owner-Operator:** Operating Partner must personally participate in direct on-premises operations, own 50%+ equity, live near the restaurant, devote full time, no other restaurant business.
- **Entity:** Managing Owner must own 25%+ equity, have binding authority, devote full time, live nearby. May designate Managing Director for multi-unit. Managing Director must complete training, devote full time, live nearby, no equity requirement.
- **Corporate Addendum:** Managing Owner may be a parent entity. Managing Director has day-to-day responsibility. Contract Feeders may operate competing businesses.
- **Crown Your Career:** Managing Owner must own 100% of entity. No other business until 5th anniversary or loan repayment.

### Product Restrictions (Item 16)
- Must offer for sale all and only BKC-authorized products.
- Value Menu items subject to BKC maximum price cap.
- Must participate in Royal Perks loyalty program.
- Must offer delivery via approved aggregators in serviced areas.
- No vending machines, ATMs, video games, etc. without BKC written authorization.
- May not sell at wholesale — retail only.
- Drive Thru Only restaurants: sell only to drive-thru customers. Delivery Restaurants: delivery customers only (unless walk-up window or outdoor seating).

### Rent Economics (Item 6, Footnote 4)
- **BKL (BKC owns land + building):** Min annual rent = typically 10% of capitalized site acquisition and construction costs, against a designated percentage of annual Gross Sales. Min rent increases 12% every 5 years.
- **BKL (BKC leases property):** Min annual rent = 125% of BKC's rent + 10% of capitalized costs, against a designated percentage of annual Gross Sales. Escalation: 125% of any underlying master lease escalation.
- **Percentage rent (all BKLs):** 8.5% of monthly Gross Sales up to $133,333.33; 10% above $133,333.33 — in excess of the monthly minimum annual rent installment.
- **Successor BKL rent (BKC-owned):** Greater of 85% of trailing 12 months' rent paid OR 12% increase on current base rent, for 5-year term, then 12% increases every 5 years.
- **Crown Your Career:** Rent will vary.
- **Default:** Full remaining-term rent liability plus re-letting costs and attorneys' fees.

### Insurance Requirements (Item 8)
- CGL: $2M per occurrence. Aggregate: $2M (1-10 restaurants), $5M (11-50), $10M (50+).
- Auto: $1M combined primary and excess.
- Property: Full replacement cost (all risks), including business interruption (12-month indemnity minimum).
- Boiler and Machinery: Full replacement cost.
- Workers Comp: As required by law.
