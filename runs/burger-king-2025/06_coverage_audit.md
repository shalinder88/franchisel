# Coverage Audit: Burger King FDD (637918-2025)

**Audited artifacts:**
- `01_source_map.md`
- `02_reader_report.md`
- `03_tables.json` (32 tables)
- `04_exhibits.json` (55 exhibits)
- `05_canonical.json` (20 families, 78 surfaced fields, 8 unresolveds, 3 contradictions)

**Audit date:** 2026-04-05

---

## A. Covered Completely

These families have full extraction with source-attributed evidence, table data where applicable, and footnotes/notes preserved.

| Family | Artifacts covering it | Notes |
|---|---|---|
| Franchisor identity | 02, 05 | Legal name, entity type, formation, predecessor, parents, affiliates, address, phone, system size — all from Item 1 directly read |
| Issuance date | 01, 02, 05 | 03/2025 as amended 01/2026, confirmed from cover and multiple internal headers |
| Formats (all 6 types) | 02, 03 (T07-01 through T07-06), 05 | All 6 investment tables with line items, totals, and footnotes |
| Initial fees (Item 5) | 02, 03 (T06-01), 05 | Franchise fee, application fee, deposits, training fee, refundability, incentive programs — all narrated in report and structured in canonical |
| Recurring fees (Item 6) | 02, 03 (T06-01 through T06-07), 05 | Main fee table (36 rows), 6 reduction schedule tables, rent methodology, remodel penalties — fully extracted |
| Supplier control economics (Item 8) | 02, 05 | Approved supplier share, sole-source items, RSI cooperative, BKC revenue from purchases ($227M), supplier rebates (~8.4%), officer stock holdings — all directly read |
| Territory structure (Item 12) | 02, 05 | No exclusivity at any level, alternative channels reserved, affiliate competition, military rights, relocation — all directly read |
| Noncompete | 02, 05 | During-term, post-term (1yr/2mi), CYC enhancement, Corporate Addendum exception — all from Item 17 summary |
| Term / renewal / transfer / default / termination (Item 17) | 02, 05 | Cure periods (5 tiers), non-curable defaults, cross-defaults, post-termination obligations, ROFR, option to purchase, death/disability, forum, governing law — all directly read from Item 17 tables |
| Item 18 public figures | 02, 05 | "Does not use any public figures" — confirmed |
| Item 19 Section A (all 6 sales distribution tables) | 02, 03 (T19-01 through T19-04), 05 | Traditional (consolidated/company/franchisee), Non-Traditional, 4 Fuel Co-Branded categories — all with averages, medians, highs, lows, counts, exclusion notes |
| Item 19 Section B (all 6 uplift tables + multi-year) | 02, 03 (T19-05 through T19-10), 05 | By scope, DT conversion, image type, sales range, RTF enrollment, multi-year — all with row-level data |
| Item 20 Table 1 (systemwide summary) | 02, 03 (T20-01), 05 | Full 3-year data with Carrols note |
| Item 20 Table 3 (franchise outlets — totals) | 02, 03 (T20-03), 05 | National totals for all 7 columns, all 3 years. All footnotes preserved. |
| Item 20 Table 4 (company-owned — totals) | 02, 03 (T20-04), 05 | National totals for all 6 columns, all 3 years |
| Item 20 Table 5 (projected openings — totals) | 02, 03 (T20-05), 05 | Signed-not-opened (0), projected franchised (48), projected company-owned (2) |
| Item 21 auditor, guaranty, financial highlights | 02, 03 (T21-01 through T21-03), 05 | KPMG, clean opinion, guarantor structure (RBI vs RBILP by state), RBI balance sheet/income/cash flow |
| Exhibit structure | 01 (source map), 04 (55 exhibits) | All exhibits identified with page boundaries, categories, priorities, surfacing status |
| Special risks | 01, 02, 05 | Both mandated risks (Florida litigation, development mediation) surfaced |
| Front matter | 01, 02 | Cover page, guide, franchising warnings, Michigan notice, TOC — all mapped |
| Item 20 ceased operations signals | 02, 05 | 1,433 in Exhibit O3, gag clause disclosed, NFA contact info |
| Receipt section | 01 | Pages 1055-1057 mapped (state effective dates + duplicate receipts) |
| Contradictions | 05 | 3 contradictions documented with source attribution and resolution status |

---

## B. Covered Partially

These families have meaningful extraction but identifiable gaps remain.

| Family | What is covered | What is missing or incomplete | Impact |
|---|---|---|---|
| **Item 11 — Training burden** | Training required before opening; location (Miami/designated); fee ($7,500); ServSafe required; BK University ($700/yr) | **No training program table** (Subject / Hours / Classroom / On-the-Job). Training described narratively only. No confirmation of total training hours or duration. | Cannot independently verify training intensity. This is a standard FDD field that most brands disclose in tabular form — its absence is notable and may indicate it is embedded in the FA exhibits rather than Item 11. |
| **Item 11 — Technology burden** | POS ($20K-$25K), digital menu boards (sole source), Digital Services Agreement (Exhibit V, fee structure confirmed), network services (sole source), Royal Perks loyalty (mandatory), delivery platforms (approved only) | **Exhibit V operative text not read** (15 pages). Specific technology platform names, SLAs, data ownership, termination rights, liability caps, and indemnity scope not surfaced. | Digital platform dependency is high. The fee is capped at $4,500/yr but the indemnification obligation and BKC's right to change platforms unilaterally are referenced in Item 9 but not verified in the agreement itself. |
| **Item 20 Tables 2-5 (state detail)** | National totals extracted for all tables. Top states identified for transfers. | **State-by-state rows not extracted** for Tables 2-5 (approximately 150 rows per table x 3 years). Table 3 state detail was read during the source scan but not included in 03_tables.json. | Cannot do state-level analysis of openings, closures, non-renewals, reacquisitions, or transfers without re-reading pages 112-126 at row level. |
| **State addenda (Exhibit P)** | Structure fully mapped: 7 states for agreement amendments, 11 states for FDD addenda. Page locations for each state/agreement combination identified. | **No state addendum text was read.** Which provisions of Florida law are overridden by which states is not surfaced. Specific modifications to noncompete, forum selection, general release, and termination provisions per state are unknown. | High impact for any franchisee in a registration state. State addenda frequently override critical Item 17 provisions (e.g., Illinois and Minnesota may void the post-term noncompete; California and Maryland may require different termination notice periods). |
| **Franchisee lists (Exhibits O1-O3)** | Structure mapped: O1 (62 pages, 5,524 locations), O2 (22 pages, 1,177 locations), O3 (30 pages, 1,433 ceased). Column structures identified. | **No individual records extracted.** Cannot identify specific franchisees, their restaurant counts, geographic concentration, or multi-unit operators. Carrols LLC entries in O3 not quantified. | Franchisee list is a primary due diligence source. Multi-unit operator concentration, largest franchisees, and geographic clustering are not derivable from current extraction. |
| **Item 21 — Financial statements (RBILP set)** | Confirmed present (pages 853-909). RBILP index, audit opinion, and parallel structure to RBI set confirmed. | **RBILP financial statement values not separately transcribed.** Only RBI set was tabulated. | For franchisees in 7 states (CA/IL/MD/ND/RI/VA/WA), RBILP is the guarantor, not RBI. The RBILP balance sheet and income statement should be independently verified, though the entities are closely related. |
| **Guarantee of Performance text** | Item 21 describes the guaranty structure (which entity guarantees for which states). | **Actual guarantee documents within Exhibit Q not located or read.** Source map notes they were not found as separately-headed pages. | Cannot verify guarantee scope, limitations, conditions, or expiration. Item 21 description may not capture all operative terms. |
| **Material exhibits (operative text)** | 55 exhibits mapped with page ranges, categories, priorities, and surfacing status. Key terms from 23 exhibits extracted via Items 5-17 narrative disclosures. | **Zero exhibits were read in their full operative text.** FA (D1: 48 pages, D2: 42 pages), BKL (G1: 41 pages), Development Agreement (M1: 24 pages), RTF2 MPA (X1: 22 pages), Fuel the Flame (Y1: 10 pages), and Digital Services (V: 15 pages) are all unsurfaced at the agreement level. | Item 17 summaries are a useful proxy but are known to simplify. Specific defined terms, calculation mechanics, representations and warranties, limitation of liability, indemnification scope, and BKC discretionary rights are only available in the full agreements. |
| **Item 22 — Contracts list** | Exhibit list from Item 22 was read (pages 128-129). All exhibits cross-referenced. | No analysis of whether all referenced exhibits are actually present. | Minor — the source map independently confirmed all exhibit presence. |
| **Item 10 — Financing** | Crown Your Career financing fully surfaced: interest (Prime + 1-4%), term (up to 10 years), security (all assets), default/cross-default, prepayment without penalty, waiver of jury trial, Miami-Dade forum. Real estate lease financing described. | CYC financing is the only direct financing program. **No independent analysis of whether lease economics (Item 6 Footnote 4) constitute indirect financing** in substance. Rent at 125% of BKC's cost + 10% of site costs is economically a financing arrangement but classified as a lease. | Lease/sublease economics may materially affect unit economics but are not captured as a financing burden. |
| **Development structure** | All 5 entry paths identified with deposits, terms, exclusivity status, and linked exhibits. | **Development Agreement (M1) schedule mechanics not surfaced** — how are specific development targets set? What defines "Excess Restaurant"? What are the cure period specifics? | Franchisees considering multi-unit development cannot assess the binding schedule burden from current extraction. |

---

## C. Not Covered

| Family | What exists in the FDD | Why it matters | Pages |
|---|---|---|---|
| **Item 2 — Business Experience** | Key management biographies (pages 18-19, 2 pages) | Identifies who leads the system — CEO, VP Development, etc. Material for assessing management stability and experience depth. | 18-19 |
| **Item 3 — Litigation** | 8 pages of litigation history (pages 20-27) | One of the largest Item 3 sections seen. Likely contains material franchise relationship disputes, class actions, or regulatory proceedings. Critical for legal risk assessment. | 20-27 |
| **Item 4 — Bankruptcy** | 1 page (page 28) | Standard check. Usually "no bankruptcy" but should be confirmed. | 28 |
| **Item 13 — Trademarks** | Registration table with mark names, serial/registration numbers, dates (pages 75-77) | 12+ marks listed. Registration status and any known infringement proceedings affect brand value. | 75-77 |
| **Item 14 — Patents, copyrights, proprietary info** | 1 page (page 78) | Establishes what proprietary rights BKC claims and any restrictions on franchisee use post-term. | 78 |
| **Item 15 — Obligation to participate** | 2 pages (pages 79-80) read during extraction but **not structured into a canonical field** | Operating Partner (50% equity, full time, nearby) and Managing Owner (25% equity, full time, nearby) requirements were read but not formally coded into 05_canonical.json as an "owner_participation" family. | 79-80 |
| **Item 16 — Restrictions on what franchisee may sell** | 1 page (page 81) read during extraction but **not structured into a canonical field** | Value Menu maximum pricing cap, mandatory delivery, mandatory loyalty, no vending machines/ATMs — read but not coded. | 81 |
| **Exhibit D1 — Franchise Agreement (Individual)** | 48 pages (185-232) | The core operating contract. Item 17 summary was used as proxy. | 185-232 |
| **Exhibit D2 — Franchise Agreement (Entity)** | 42 pages (233-274) | Entity counterpart. Same proxy concern. | 233-274 |
| **Exhibit G1 — Lease/Sublease (BKL)** | 41 pages (358-398) | Real estate economics for BKC-controlled locations. | 358-398 |
| **Exhibit M1 — Development Agreement** | 24 pages (540-563) | Multi-unit development mechanics. | 540-563 |
| **Exhibit V — Digital App Services Agreement** | 15 pages (942-956) | Technology dependency and ongoing fee. | 942-956 |
| **Exhibit X1 — RTF2 Master Program Agreement** | 22 pages (969-990) | Current remodel program — cash contributions, penalties, cross-defaults. | 969-990 |
| **Exhibit Y1 — Fuel the Flame Co-Investment Agreement** | 10 pages (999-1008) | Advertising rate contingency mechanics, EBITDA definition. | 999-1008 |
| **Exhibit U — Operations Manual TOC** | 7 pages (935-941) | Scope of operational control BKC exercises. | 935-941 |
| **Exhibit W — Midterm Remodel Forbearance Agreement** | 12 pages (957-968) | Penalty mechanics for midterm remodel non-compliance. | 957-968 |
| **RBI financial statement notes** | ~39 pages (813-851) for RBI set | Segment reporting, debt covenants, lease obligations, contingencies. | 813-851 |
| **RBILP financial statements** | ~57 pages (853-909) | Parallel to RBI but the operative guarantor for 7 states. | 853-909 |

---

## D. Contradictions and Unresolveds Preserved Correctly

### Contradictions (3 documented in 05_canonical.json)

| ID | Description | Assessment |
|---|---|---|
| CON-01 | Cover page investment range ($348K-$4.7M) spans all 6 formats without clarification | **Correctly preserved.** Noted as "not a true contradiction" but potentially misleading. Source attribution is accurate. |
| CON-02 | 38-unit gap between Carrols count (1,023) and reacquisition total (1,061) | **Correctly preserved.** Identified as unresolved. The gap is real and could be resolved by reading Table 4 state detail — some non-Carrols reacquisitions occurred (e.g., MT 12 in 2023, UT 17 in 2023 were pre-Carrols). Whether additional 2024 non-Carrols reacquisitions occurred is unconfirmed. |
| CON-03 | Base Fee definition allows future royalty increase above 4.5% | **Correctly preserved.** Noted as forward-looking risk, not a current contradiction. |

### Unresolveds (8 documented in 05_canonical.json)

| ID | Description | Assessment |
|---|---|---|
| UNR-01 | No training table found | **Correctly identified.** This is a genuine omission from Item 11. May exist in FA exhibits. |
| UNR-02 | Modern Image vs Legacy Image comparison in Section A | **Correctly identified.** The Section A narrative on page 99 mentions this comparison is "also provided" but no separate table was located. May be embedded in the percentage distribution table itself (the Traditional table may implicitly include this breakdown). |
| UNR-03 | Guarantee of Performance documents not located in Exhibit Q | **Correctly identified.** Should be retried — they likely follow the financial statement notes or are interleaved. |
| UNR-04 | Items 2, 3, 4 not read | **Correctly identified.** Item 3 at 8 pages is the highest-risk gap. |
| UNR-05 | BKC standalone revenue ($1.427B) vs RBI consolidated figures | **Correctly identified.** The $1.427B appears only in Item 8 from unaudited internal statements. |
| UNR-06 | Full agreement texts not read | **Correctly identified.** Acknowledged as partial proxy. |
| UNR-07 | Fuel the Flame EBITDA calculation methodology unknown | **Correctly identified.** Material gap — the $230K threshold determines a 0.5% advertising rate swing. |
| UNR-08 | Value Menu pricing caps not disclosed | **Correctly identified.** Though this may be intentionally undisclosed in the FDD (set in MOD Manual). |

**Audit finding:** All contradictions and unresolveds are accurately described, source-attributed, and impact-assessed. No contradictions were normalized away. No unresolveds were prematurely resolved.

### Additional unresolveds not captured in 05_canonical.json

| Missed unresolved | Description |
|---|---|
| **Item 15 not coded** | Owner participation requirements (Operating Partner 50% equity/full-time/nearby; Managing Owner 25%/full-time/nearby) were read and described in 02_reader_report.md but never structured into 05_canonical.json. This is a canonical field omission, not an extraction omission. |
| **Item 16 not coded** | Restrictions on products/services (mandatory delivery, mandatory loyalty, Value Menu cap, no vending/ATMs) were read but not structured. |
| **Rent economics not modeled** | Item 6 Footnote 4 describes complex rent formulas (10% of capitalized costs, 125% of BKC rent, 8.5-10% percentage rent, 12% escalation). These were narrated in 02_reader_report.md but not structured as a separate canonical field. For BKL locations, rent is a major economic burden. |
| **Insurance requirements not coded** | Item 8 describes specific insurance minimums ($2M CGL, tiered aggregates, $1M auto, full replacement property, boiler/machinery, workers comp). These were narrated but not structured. |
| **Remodel CAPEX not estimated** | Item 19 Section B references "$650,000 or more" as the remodel sample threshold. Item 7 Footnote 10 references "$80,000-$120,000" for Double Drive Thru addition. But the expected remodel cost for a typical RTF2 participant is not disclosed or estimated. |
| **Item 19 — company-owned Non-Traditional not separately broken out** | The Non-Traditional sales distribution table shows "Franchisee-Owned" only (741 restaurants). 34 company-owned non-traditional restaurants were in the system but are not separately reported, only noted in footnotes. |
| **Exhibit I1 not characterized** | DMA Program Agreements (Investment Spending) — 21 pages — governs up to 2.0% of Gross Sales in local marketing. Category and fee structure confirmed but voting mechanics, opt-out rights, and DMA boundary definitions not surfaced. |

---

## E. Highest-Risk Omissions

Ranked by diligence impact:

### 1. Item 3 — Litigation (CRITICAL)
Eight pages of litigation history not read. For a 70-year-old system with 6,701 US restaurants, this likely contains material franchise relationship disputes, class actions, government enforcement, and potentially Carrols-related litigation. This is the single most important unsurfaced Item for legal risk assessment.

### 2. State addenda operative provisions (HIGH)
Structure mapped but no text read. For any franchisee in CA, IL, MD, MN, ND, WA, or NY, the state addenda may override the post-term noncompete, forum selection, general release requirements, and termination cure periods. These overrides are not theoretical — they are routine in franchise law.

### 3. Franchise Agreement full text — D1/D2 (HIGH)
Item 17 summaries are a useful proxy but are explicitly "summaries." The full FA likely contains: specific Gross Sales definition details, BKC's unilateral modification rights (MOD Manual changes), specific remodel trigger language, detailed default cure mechanics, and the exact scope of the indemnification obligation. 90 pages total across both forms.

### 4. RTF2 Master Program Agreement — Exhibit X1 (HIGH)
The current mandatory remodel program. The +3.0% royalty surcharge, FSS Remodel Grade cash contribution schedule, and cross-default mechanics are described in Items 5-6 but the full 22-page agreement governs how remodel deadlines are set, what constitutes "successful completion," and how BKC's discretion operates. This is the most consequential current program for existing franchisees.

### 5. Item 19 — Modern Image vs Legacy Image sales comparison (MEDIUM)
Referenced on page 99 as being "also provided" within Section A but not located as a separate table. If this data exists, it would directly quantify the sales penalty for operating a non-Modern Image restaurant — critical for evaluating the remodel ROI thesis.

### 6. Fuel the Flame EBITDA methodology — Exhibit Y1 (MEDIUM)
The $230,000 4-Wall EBITDA benchmark determines whether advertising drops from 4.5% to 4.0% for the entire system. How EBITDA is calculated (what costs are included, whether rent is included, how company-owned stores are treated) is entirely within Exhibit Y1's 10 pages.

### 7. Lease/Sublease economics — Exhibit G1 (MEDIUM)
For BKL locations, the lease is often the largest single cost. The 41-page agreement contains the actual rent calculation mechanics, escalation provisions, default remedies, and BKC's rights on termination. Item 6 Footnote 4 provides the formula outline but the operative language is in G1.

### 8. Franchisee list analysis — Exhibit O1 (MEDIUM)
62 pages of franchisee/location data. Multi-unit operator concentration, largest franchisees, and geographic clustering are derivable only from this exhibit. For competitive intelligence and territory assessment, this is a primary source.

---

## F. Targeted Retry Tasks Needed

Each task is scoped to a specific gap, with estimated page reads.

| Priority | Task | Pages to read | Expected output |
|---|---|---|---|
| 1 | **Read Item 3 — Litigation** | 20-27 (8 pages) | Summary of material litigation matters, parties, amounts, status. Add to canonical as `litigation` family. |
| 2 | **Read Item 4 — Bankruptcy** | 28 (1 page) | Confirm no bankruptcy or surface details. Add to canonical. |
| 3 | **Read state addenda for key states** (at minimum: CA, IL, MN, NY) | ~20-30 pages from Exhibit P | Structured summary of which Item 17 provisions are overridden per state. Add to canonical as `state_addenda_overrides` family. |
| 4 | **Find and read the Guarantee of Performance documents** within Exhibit Q | Scan pages 851-853 and 909-911 more carefully | Confirm scope, conditions, and limitations of the guarantee. |
| 5 | **Find the Modern Image vs Legacy Image sales comparison** in Item 19 | Re-read pages 99-100 more carefully, looking for inline data or a merged table | Either extract the comparison or confirm it does not exist as a separate table. |
| 6 | **Read Item 2 — Business Experience** | 18-19 (2 pages) | Key officer names and tenures. Add to canonical. |
| 7 | **Structure Item 15 and Item 16 into canonical** | Already read; just needs coding | Add `owner_participation` and `product_restrictions` families to 05_canonical.json. |
| 8 | **Structure rent economics and insurance requirements into canonical** | Already read; just needs coding | Add `rent_economics` and `insurance_requirements` families to 05_canonical.json. |
| 9 | **Extract Item 20 Table 3 state-by-state detail** | Pages 116-121, already scanned | Full 50-state rows for franchise outlet status (2022-2024). Enables state-level attrition analysis. |
| 10 | **Read Exhibit X1 — RTF2 MPA** (highest-priority exhibit) | 969-990 (22 pages) | Remodel deadline mechanics, FSS Remodel Grade cash contribution schedule, completion criteria, BKC discretionary rights. |

Tasks 7-8 require no additional PDF reading — only restructuring of already-extracted data into 05_canonical.json.

---

## Summary

| Category | Count |
|---|---|
| Covered completely | 22 families |
| Covered partially | 12 families |
| Not covered | 17 items/exhibits |
| Contradictions preserved | 3 (all correctly handled) |
| Unresolveds preserved | 8 in canonical + 7 additional identified in this audit |
| Highest-risk omissions | 8 ranked |
| Targeted retry tasks | 10 scoped |

**Overall assessment:** The extraction is strong on economic structure (fees, investment, FPR, outlet history) and contract mechanics (Item 17 summaries). The principal gaps are: (1) litigation history (Item 3), (2) state addenda operative provisions, (3) full agreement texts for the 6 most consequential exhibits, and (4) several already-read fields not yet coded into canonical form. No evidence of invented data, normalized contradictions, or premature resolution of uncertainties.
