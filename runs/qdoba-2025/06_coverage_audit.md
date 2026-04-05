# Coverage Audit — Qdoba Franchisor LLC FDD

**PDF:** 640022-2025-Qdoba-Qdoba-Mexican-Eats-Qdoba-Mexican-Grill.pdf

---

## A. Covered Completely

- **Front matter and special risks** — Cover page, How-to-Use, Special Risks (2 risks: California forum, spousal guaranty), Table of Contents all fully surfaced.
- **Item 1 (Franchisor identity)** — Entity, formation, securitization structure, parents/predecessors chain, affiliates, management agreement, all formats, $100K incentive program.
- **Item 2 (Business experience)** — All officers and directors with titles, dates, prior positions.
- **Item 3 (Litigation)** — Both disclosed actions with full procedural history and settlement terms.
- **Item 4 (Bankruptcy)** — No bankruptcy required to be disclosed.
- **Item 5 (Initial fees)** — Development fee, franchise fee (traditional and non-traditional), VetFran, fee ranges, credit-toward provisions.
- **Item 6 (Other fees)** — Complete 32-row fee table with all amounts, timing, and remarks. All footnotes captured.
- **Item 7 (Initial investment)** — Traditional, non-traditional, and development agreement tables with all 14+ footnotes. Totals confirmed.
- **Item 8 (Supplier control)** — Single distributor network, approval process, Supply Chain Fee, Customer Fund Fee, QRC revenue from franchisee purchases ($50.8M / 13.2%), insurance requirements.
- **Item 9 (Franchisee obligations)** — Full obligations matrix with section references.
- **Item 10 (Financing)** — No financing; first-priority security interest disclosed.
- **Item 11 (Training)** — DO/GM/Shift Lead training hours and program structure. Both training tables (A and B) fully extracted. LMS fees, certified training restaurant ratio, refresher obligations.
- **Item 11 (Technology)** — POS specs, KDS, Back Office (Fourth), DMB, network, antivirus, polling, training devices. Cost estimates ($24-35K POS, <$17K/yr maintenance). No contractual upgrade limits. PCI-DSS/P2PE required.
- **Item 11 (Advertising/Marketing Fund)** — 4.5% rate, increase mechanism, fund spend breakdown (17/32/18/19/14%), surplus, not independently audited, contributions not for franchise sales.
- **Item 12 (Territory)** — No exclusive territory, 2-mile Protected Territory, all carveouts (non-traditional, dissimilar channels, internet, pre-existing units), Development Area protections and loss conditions.
- **Item 13 (Trademarks)** — 6 registrations on Principal Register, all registration numbers and dates.
- **Item 14 (Patents/Copyrights)** — No material patents; copyrights claimed but not registered.
- **Item 15 (Participation)** — DO/GM requirements, staffing structure, spousal guaranty, confidentiality/non-competition agreements.
- **Item 16 (Restrictions on sales)** — Approved menu only, tiered pricing, pricing guidance.
- **Item 17 (Contract burden)** — Complete summary tables for Franchise Agreement, Development Agreement, and License Agreement. All provisions: term, renewal, transfer, termination, noncompete, forum, governing law, mediation, ROFR, death/disability.
- **Item 18 (Public figures)** — No public figure used.
- **Item 19 (FPR)** — All three charts fully extracted with all rows, all footnotes, all exclusion criteria, all caveats. Median/high/low for each chart. At-or-above-average percentages. Advertising fee timing note (4.0% → 4.5%).
- **Item 20 (Outlets)** — Tables 1-5 all extracted. Systemwide summary, transfers, state-level franchised outlet detail (all years), state-level company-owned detail, projected openings by state. Refranchising notes. Confidentiality clause warning.
- **Item 21 (Financial statements)** — Auditor identified (Deloitte, unqualified opinion). Guaranty structure explained. Structural gap (QRC not party to franchise agreement) identified.
- **Item 22 (Contracts)** — All 14 exhibits listed.
- **Item 23 (Receipt)** — Referenced.

## B. Covered Partially

- **Financial statement numerical content (Exhibit A)** — Auditor's opinion letter is readable. Balance sheets, income statements, cash flows, member's equity statements, and all notes are present in the PDF but use CID-encoded embedded fonts that cannot be text-extracted. No revenue, asset, liability, or cash flow figures were surfaced.
- **Item 20 Table 3 (Franchised outlets by state)** — FY2025 state-level detail fully in 03_tables.json. FY2023 and FY2024 state-level detail mentioned in reader report but not fully structured as JSON rows.
- **Item 20 Table 4 (Company-owned outlets by state)** — Extracted in reader report but not structured as JSON in 03_tables.json.
- **Exhibit A auditor report** — Opinion paragraph and basis-for-opinion paragraph surfaced. Responsibilities sections partially visible.

## C. Not Covered

- **State-Specific Addenda (Exhibit H)** — Listed in TOC but not read. May contain material overrides to noncompete, termination cure periods, forum selection, and governing law for registration states.
- **Franchise Agreement full text (Exhibit E-1)** — Only Item 17 summary tables surfaced. Operative clauses not directly read.
- **Development Agreement full text (Exhibit F)** — Only Item 17 summary tables surfaced.
- **License Agreement full text (Exhibit E-2)** — Only Item 17 summary tables surfaced.
- **General Release (Exhibit J)** — Scope of release not surfaced. Required at transfer and renewal.
- **Master Technology Agreement (Exhibit K)** — Not read. Governs IT obligation details.
- **Authorization for Prearranged Payments (Exhibit L)** — Not read.
- **Non-Disclosure Agreement (Exhibit M)** — Not read.
- **Stored Value Card Service Agreement (Exhibit N)** — Not read.
- **Certification of Entity Structure (Exhibit I)** — Not read.
- **Manual Table of Contents (Exhibit G)** — Not read. 466 pages referenced.
- **Franchisee List (Exhibit D)** — Current locations, former franchisees, and signed-not-open list not read.
- **State Administrators (Exhibit B)** — Not read.
- **Agents for Service of Process (Exhibit C)** — Not read.
- **Qdoba Corporation financial statements** — Present in Exhibit A but not readable (CID encoding).

## D. Contradictions and Unresolveds Preserved

1. **Item 19 sample discrepancy** — Chart 2 (464 restaurants, avg $1,697,254) vs Chart 3 (397 restaurants, avg $1,661,277). Different samples and trailing periods. Not a true contradiction but flagged as unresolved for transparency.
2. **Advertising fee timing** — Chart 3 uses 4.0% combined advertising fee for FY2025; actual rate increased to 4.5% on September 29, 2025. Current EBITDA margin is ~0.5pp lower than Chart 3 shows.
3. **64 restaurants not loaded** — Chart 3 excludes 64 restaurants that haven't loaded P&L data. Selection bias concern preserved.
4. **Litigation settlement not signed** — Fiesta Ventures settlement approved but not yet signed/dismissed.
5. **Structural guaranty gap** — QRC performs franchisor services but does not guarantee franchise agreement obligations. Qdoba Funding Holdco LLC guarantees the franchise agreement; Qdoba Corporation guarantees QRC's management agreement.

## E. Highest-Risk Omissions

1. **Financial statement numbers (HIGH)** — No balance sheet, income, or cash flow figures were extracted. Cannot assess franchisor financial health, debt levels, or liquidity. This is the single largest gap.
2. **State-Specific Addenda (HIGH)** — Multiple Item 17 provisions are explicitly "subject to state law." Without reading Exhibit H, cannot determine what overrides apply in specific states (e.g., California, Illinois, Maryland, Minnesota).
3. **Franchise Agreement operative text (MEDIUM)** — Item 17 summary is comprehensive but the actual agreement language may contain additional material provisions (e.g., specific remodel cost obligations at renewal, liquidated damages formula, exact security interest scope).
4. **General Release scope (MEDIUM)** — Required at transfer and renewal but operative language not read. A broad release may waive material claims.
5. **Franchisee list (LOW-MEDIUM)** — Cannot validate reference calls or identify concentration patterns without Exhibit D.

## F. Targeted Retry Tasks Needed

1. **Financial statement recovery (HIGH priority)** — Attempt OCR or alternative extraction of Exhibit A pages 79-85+.
2. **State addenda recovery (HIGH priority)** — Read Exhibit H for material state-specific overrides.
3. **Item 20 Tables 3-4 full structuring (LOW priority)** — FY2023 and FY2024 state-level rows and company-owned table should be structured as JSON.
