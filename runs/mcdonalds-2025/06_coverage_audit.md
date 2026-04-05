# 06 — Coverage Audit
## McDonald's USA, LLC — FDD (638437-2025)

---

## A. Covered Completely

- **Front matter and special risks** — Cover page, How to Use, General Disclosures, Special Risks (IL dispute resolution), Michigan notice all captured.
- **Item 1 — Identity** — Franchisor entity, parent, predecessor, address, business description, franchise history, formats, all confirmed.
- **Item 2 — Business Experience** — Officers/directors with start dates and prior employment captured.
- **Item 3 — Litigation** — 7 pending cases, 13+ concluded cases with settlement amounts extracted. Joint-employer lawsuits referenced.
- **Item 4 — Bankruptcy** — None to disclose. Confirmed.
- **Item 5 — Initial Fees** — All format-specific fees, refund policy, rebuild/relocate credit captured.
- **Item 6 — Other Fees** — Complete fee table with 31 line items and 11 footnotes. Rent structure for traditional, STO/STR, Satellite, BFL, and co-investment policy all captured. STO/STR rent schedule table extracted.
- **Item 7 — Estimated Initial Investment** — All 3 format columns, all line items, all 11 footnotes. McOpCo outlier data captured (9 of 31 exceeded high end).
- **Item 8 — Supplier Control** — Approved supplier requirements, purchase percentages (90-95%/55-65%), franchisor revenue from franchisees ($7.21B/68%), rebates/incentives ($39M).
- **Item 9 — Franchisee's Obligations** — Full table extracted.
- **Item 10 — Financing** — Bank of America guaranteed lending terms, rates (SOFR + 3.10%, APR 7.42%), collateral, personal guarantee, cross-default, Operator Assistance Program Agreement.
- **Item 11 — Training and Technology** — Candidate Development Program, training table, duration (6 months–2 years), HU details, Store Systems ($150K–$250K), Sesame POS, Cashless 3.0, Gift Card System, data access, reporting requirements.
- **Item 12 — Territory** — No exclusive territory confirmed. Encroachment exposure documented.
- **Item 13 — Trademarks** — Golden Arches Logo, McDonald's name, sign design registered. Licensed from Restaurant Brands, LLC.
- **Item 14 — Patents/Copyrights** — O&T Manual copyright, proprietary info, Financial Information confidentiality.
- **Item 15 — Operator Participation** — Full time and best efforts required.
- **Item 16 — Product Restrictions** — Authorized products only. McDonald's can add/delete/change.
- **Item 17 — All tables** — Franchise Agreement relationship table (18 provisions) and Operator's Lease relationship table (23 provisions) fully extracted. 3 notes captured.
- **Item 18 — Public Figures** — None. Confirmed.
- **Item 19 — All material tables and notes** — Sales summary (all traditional, franchised, McOpCo); pro forma at 3 sales levels; OIBOC percentages; cost of sales; operating expense detail; all 3 notes; effective rent range. Distribution percentages captured.
- **Item 20 — All 5 tables** — Table 1 (systemwide), Table 2 (transfers totals), Table 3 (franchised status totals), Table 4 (company-owned totals), Table 5 (projected openings totals). Franchisee organizations (7). Gag clause flag. Exhibit S count (113).
- **Item 21 — Auditor, financial statements** — Ernst & Young LLP, unqualified opinion, 3-year income statement, balance sheet, cash flows, members' equity. Key financial notes (property, leasing, contingencies, restructuring, income taxes).
- **Item 22 — Contracts** — All 10 exhibit forms listed.
- **Item 23 — Receipt** — Both copies confirmed (pp.388–389).
- **State Addenda** — CA (Fast Food Act), HI (filing notice), MD (release/bankruptcy/forum), MN (trademark/termination/non-renewal notice), ND (non-compete), WA (AOD + franchise protection act). State effective dates.
- **Franchisee Lists** — Exhibit R (pp.237–380, ~12,887 locations). Exhibit S (pp.381–382, 113 ceased).
- **Guaranty** — Unlimited Guaranty within Exhibit N captured. Entity certificates covered.
- **Material Exhibits** — All 20 exhibits (A–T) cataloged with page ranges and key functions.

## B. Covered Partially

- **Item 20 — State-level detail for Tables 2, 3, 4, 5** — Total-level data fully captured. Individual state rows read during source extraction but not transcribed row-by-row into tables JSON (document is extremely large with 50+ states × 3 years). Top-line totals and footnotes are complete.
- **Financial Statement Notes** — Key notes captured (property detail, leasing maturities, income taxes, contingencies, restructuring). Some granular notes (segment detail, related party detail beyond what's already in items) summarized rather than fully transcribed.
- **Franchise Agreement detail** — Key provisions surfaced through Item 17 tables. Full 18-page agreement text not transcribed clause-by-clause (available in Exhibits B, C, D).

## C. Not Covered

- **Individual restaurant financial data** — Not disclosed in FDD (only aggregate/pro forma provided).
- **Specific percentage rent rates for individual locations** — Case-specific, not systematically disclosed.
- **O&T Manual content detail** — Only generically described in Item 11.
- **Internal development policies** — Explicitly stated as not part of Franchise Agreement (Item 12).

## D. Contradictions and Unresolveds Preserved Correctly

1. **Royalty rate mismatch in Item 19 pro forma** — Pro forma uses 4% royalty (legacy rate for existing restaurants), but new franchisees from Jan 1, 2024 pay 5%. Material impact: ~1% of sales ($30K–$34K at pro forma levels) should be subtracted from OIBOC for prospective analysis. Preserved in canonical contradictions field.
2. **No renewal right vs. New Term Policy** — Franchise Agreement provides no renewal right, but Exhibit K describes a discretionary New Term Policy. This is not a contradiction but a deliberate structural feature: continuity depends entirely on McDonald's satisfaction with franchisee performance. Preserved in unresolveds.
3. **Gag clauses** — Some franchisees have signed provisions restricting their ability to speak about experience with McDonald's. This limits the utility of the franchisee list for due diligence. Preserved in canonical.
4. **Internal development policies** — McDonald's internal policies on new restaurant placement are not part of the Franchise Agreement and create no contract rights for franchisees, despite potentially affecting existing franchisee sales. Preserved in unresolveds.

## E. Highest-Risk Omissions

1. **State-level Item 20 detail not transcribed row-by-row** — Risk: LOW. Totals are correct and footnotes captured. Individual state data is available in source PDF for any targeted query.
2. **No occupancy cost breakdown in Item 19** — Risk: MEDIUM for prospective analysis. Explicitly excluded by McDonald's due to wide variation (0%–33.33%). This is a McDonald's FDD design choice, not an extraction gap.
3. **No Exhibit R parsing** — The 144-page franchisee list was not parsed into structured data. Risk: LOW for extraction purposes (list exists and is complete).

## F. Targeted Retry Tasks Needed

1. **Item 20 state-level table detail** — OPTIONAL. Could extract top-10 states for Table 3 (franchised status) if needed for enrichment. Not critical for canonical.
2. **Financial statement note detail** — Could deep-read remaining financial notes for lease maturity schedule detail and property segment breakdown. Priority: LOW.
3. **No other material retries needed.** This is a well-structured, comprehensive FDD with strong Item 19 disclosure. The extraction is substantially complete.
