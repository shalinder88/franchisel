# Coverage Audit — Rocky Rococo Pizza and Pasta (638785-2025)

---

## A. Covered Completely

- **Front matter and special risks**: Cover page, FTC info, How to Use, general franchising info, special risks (out-of-state dispute resolution), state cover page, state effective dates — all fully extracted.
- **Item 1 (Franchisor identity)**: Legal name, incorporation, address, predecessor, all 5 affiliates with restaurant counts, trademark licensing structure — complete.
- **Item 2 (Business experience)**: All 6 key personnel with titles, dates, roles — complete.
- **Item 3 (Litigation)**: No litigation. Complete.
- **Item 4 (Bankruptcy)**: No bankruptcy. Complete.
- **Item 5 (Initial fees)**: $25,000/$17,500 fee structure, deposit agreement terms, refundability — complete.
- **Item 6 (Other fees)**: All 9 fee rows extracted with all 8 notes. Royalty conditional reduction to 3.5%, marketing fund, local ad tiering, transfer fee, interest, indemnification, audit — complete.
- **Item 7 (Estimated initial investment)**: All 10 line items with ranges, all 10 notes, total range $211K–$705.5K — complete.
- **Item 8 (Restrictions on sources)**: Soft drink only designated supplier, no RFC revenue from purchases, 100% purchasing freedom otherwise, spec compliance requirements — complete.
- **Item 9 (Franchisee obligations)**: Full 25-row obligations table — complete.
- **Item 10 (Financing)**: No financing offered. Complete.
- **Item 11 (Training)**: Training table (7 subjects), training location, duration (10 weeks), OJT structure, additional 20-week OJT, opening assistance, operations manual TOC (6 chapters), advertising programs, marketing fund administration, computer system requirements — complete.
- **Item 12 (Territory)**: 1-mile radius, all carveouts (mall, CBD), non-exclusive disclaimer, no contingencies, no option for additional, RFC rights retained — complete.
- **Item 13 (Trademarks)**: Registration details (US #1,186,029; Canada #TMA328045; design #2681017), licensing agreement structure, Wisconsin state registration — complete.
- **Item 14 (Patents)**: No patents. Proprietary rights in advertising designs. Copyright claim on Operations Manual (unregistered). Complete.
- **Item 15 (Participation)**: Owner or designated partner/member/officer full-time recommended. Manager/assistant manager must be on premises. Complete.
- **Item 16 (Restrictions on sales)**: Pizza, pasta, food and beverage required. RFC may add/remove products. Location used only for franchised business. Complete.
- **Item 17 (Renewal/termination/transfer/dispute resolution)**: Full table with all provisions (a through w). Complete.
- **Item 18 (Public figures)**: No public figures. Complete.
- **Item 19 (FPR)**: No FPR made. Complete.
- **Item 20 (Outlets)**: Systemwide summary, transfers, status of franchised outlets, status of company-owned outlets, projected openings, full franchisee list (20 entities), no former franchisees, no confidentiality clauses, no franchisee organizations — complete.
- **Item 21 (Financial statements)**: 3-year audited financials, auditor report, balance sheets, income statements, cash flows, 5 notes — complete.
- **Item 22 (Contracts)**: FA, FDA, CAL listed — complete.
- **Item 23 (Receipt)**: Both copies — complete.
- **Franchise Agreement (Exhibit FA)**: Full TOC mapped, key provisions extracted for canonical fields, guaranty and SBA addendum identified — complete at summary level.
- **Franchise Deposit Agreement (Exhibit FDA)**: Key terms extracted — complete.
- **Collateral Assignment of Lease (Exhibit CAL)**: Structure understood — complete.
- **Financial statements notes**: Revenue recognition, co-op ad fund activity, location information, income taxes, related party transactions — complete.

## B. Covered Partially

- **Item 20 status of franchised outlets table (p.49)**: OCR degradation makes sub-column parsing difficult. The "Outlets Opened/Predecessor Affiliated Transferred" column structure is unclear. Total row values cross-validated against systemwide summary. Partial.
- **Balance sheet (p.60)**: Some 2022 and 2023 individual line items did not extract cleanly due to OCR. Key totals (total assets, equity, retained earnings, cash) extracted. Partial.
- **Franchise Agreement detailed clause-level extraction**: The FA is 82 pages. Key provisions (grant, fees, territory, training, termination, transfer, noncompete, arbitration, guaranty) are extracted. Deep clause-level extraction of all 35+ sections not performed. Partial.
- **Operations Manual TOC**: 6 chapters and section headers extracted from Item 11 (pp.32–36). Actual page counts noted. The TOC is itself from the FDD disclosure, not the actual manual. Partial.

## C. Not Covered

- **State-specific addenda**: Referenced by the document but not found in the TOC or as separate exhibits. This is either an omission in the filing or vestigial boilerplate. Not covered because the content does not appear to exist in this PDF.
- **Insurance specification detail**: Item 6 references insurance and Item 7 provides a $5,000 annual estimate, but specific coverage requirements, limits, and carriers are not detailed in the FDD body. They likely reside in the Operations Manual. Not covered.
- **Item 11 advertising fund audit detail**: The marketing fund is explicitly stated to be unaudited. An unaudited statement is available on request but not included in the FDD. Not covered.
- **Technology/digital services exhibit**: No separate technology agreement exists. Requirements are in Item 11 narrative only. Not covered (because no exhibit exists to cover).

## D. Contradictions and Unresolveds Preserved Correctly

All identified contradictions and unresolveds from the reader report and canonical v1 are preserved:

1. **Territory exclusivity vs. non-exclusive disclaimer** — preserved in canonical as a contradiction with reconciliation note.
2. **Computer access vs. no access** — preserved as a contradiction.
3. **Noncompete radius FA (5 miles) vs. FDA (50 miles)** — preserved as a contradiction.
4. **Missing state addenda** — preserved as an unresolved.

## E. Highest-Risk Omissions

1. **State addenda absence** (medium risk): If state-specific addenda exist and were omitted, material state-law protections (e.g., Illinois relationship law, Minnesota termination protections) may be missing from the extraction. However, this appears to be a document-level issue, not an extraction failure.

2. **Item 20 franchised outlet sub-column detail** (low risk): The exact split between "newly opened" vs. "predecessor affiliated/transferred" in the 2023 and 2024 franchised outlet table is partially degraded. The totals are correct; the sub-categorization is uncertain.

3. **FA deep clause extraction** (low risk): Not all 35+ FA sections were extracted at full depth. The key diligence-relevant provisions are covered. The remaining sections (e.g., force majeure, severability, waiver, estoppel certificates) are standard franchise agreement boilerplate.

## F. Targeted Retry Tasks Needed

1. **Item 20 franchised outlet table repair** — Re-read p.49 with pdfplumber table extraction to resolve sub-column parsing.
2. **Balance sheet repair** — Re-read p.60 with pdfplumber to fill in missing 2022/2023 cell values.
3. **Franchisee list deep extraction** — Extract structured data (entity name, address, contact, phone) for all 20 franchisees into a structured format.
4. **State addenda investigation** — Confirm whether state addenda exist elsewhere in the document (possibly embedded in the Franchise Agreement or as unnumbered pages).
