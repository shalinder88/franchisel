# Source Map — Embassy Suites by Hilton 2025 FDD

filing_id: 638053-2025
brand: Embassy Suites by Hilton
franchisor_legal_name: Hilton Franchise Holding LLC
state_filed: WI
issuance_date: 2025-03-30
pdf_filename: 638053-2025-Embassy-Suites-Hotels.pdf
pdf_pages: 305 (bootstrap; trusted)
render_mode: fitz_render (text layer present, all 305 pages extracted)
body_start_page: 9

## Document identity
- Franchisor: Hilton Franchise Holding LLC (Delaware LLC, formed Sep 2007)
- Address: 7930 Jones Branch Drive, Suite 1100, McLean, VA 22102 / 703-883-1000
- Parent: Hilton Domestic Operating Company Inc. → Hilton Worldwide Holdings Inc. (NYSE: HLT)
- Predecessors: Embassy Suites Franchise LLC (2007–2015); Promus Hotels Inc. (1995–2007); HHC predecessors (1984–1995)
- Became franchisor of Embassy Suites brand in US: 2015-03-30

## Front matter (pp 1–8)
| Page | Content |
|---|---|
| 1 | Cover / state cover — investment range $50,082,670–$82,170,820 (176-suite new build, ex real property); affiliate portion up to $326,179 |
| 2 | How to Use this FDD |
| 3 | What You Need to Know About Franchising Generally |
| 4–6 | State cover material / risk factors (state notices) |
| 7 | TABLE OF CONTENTS — Items 1–23 |
| 8 | TABLE OF EXHIBITS A–M |

## Body item map (verified by ITEM heading grep + TOC)
| Item | Title | First page | Notes |
|---|---|---|---|
| 1 | Franchisor, Parents, Predecessors, Affiliates | 9 | |
| 2 | Business Experience | 15 | |
| 3 | Litigation | 19 | |
| 4 | Bankruptcy | 22 | |
| 5 | Initial Fees | 22 | continues |
| 6 | Other Fees | 27 | large fee table |
| 7 | Estimated Initial Investment | 41 | |
| 8 | Restrictions on Sources | 45 | |
| 9 | Franchisee's Obligations | 50 | |
| 10 | Financing | 52 | |
| 11 | Franchisor's Assistance, Advertising, Computer Systems, Training | 53 | spans 67 |
| 12 | Territory | 67 | |
| 13 | Trademarks | 70 | |
| 14 | Patents, Copyrights, Proprietary Information | 72 | |
| 15 | Obligation to Participate in Operation | 74 | |
| 16 | Restrictions on What Franchisee May Sell | 75 | |
| 17 | Renewal, Termination, Transfer, Dispute Resolution | 77 | |
| 18 | Public Figures | 87 | |
| 19 | Financial Performance Representations | 87 | |
| 20 | Outlets and Franchisee Information | 92 | |
| 21 | Financial Statements | 97 (cross-ref Exhibit C) | |
| 22 | Contracts | 97 | |
| 23 | Receipts | 97 (cross-ref Exhibit M) | |

## Exhibit map
| Exhibit | Title | Pages |
|---|---|---|
| A | Franchised Hotels list (as of 2024-12-31) | 98–110 |
| B | Terminated/Cancelled/Not-Renewed/Changes-in-Control 2024 | 111–113 |
| C | Financial Statements (Hilton Franchise Holding LLC) | 114–126 |
| D | Franchise Agreement (with addendum) | 127–182 |
| D-1 | State Addenda to Franchise Agreement | 183–196 |
| D-2 | Development Incentive Promissory Note | 197–199 |
| D-3 | Eforea Spa Amendment | 200–204 |
| E | Guaranty of Franchise Agreement | 205–209 |
| F | Franchise Application | 210–222 |
| G | Information Technology System (HITS) Agreement | 223–249 |
| H-1 | Manual TOC — Brand Standards | 250–259 |
| H-2 | Manual TOC — Eforea Spa Operating Standards | 260–261 |
| I | State Administrators / Agents for Service | 262–265 |
| J-1 | State Addenda to Disclosure Document | 266–274 |
| J-2 | Restaurant Brands Addendum | 275–276 |
| K | Lender Comfort Letter Forms | 277–298 |
| L | State Effective Dates | 299–300 |
| M | Receipts | 301–305 |

## Page classification (305 pages, all visited)
- pp 1–8: front matter (cover, How-to-Use, risk factors, TOC, exhibit list)
- pp 9–97: Items 1–23 disclosure body
- pp 98–305: Exhibits A–M (with several mid-FA "EXHIBIT _" placeholder pages inside Exhibit D agreement at 181, 184–195, 198 — these are intra-FA schedule placeholders, not standalone exhibits)
- Auditor: page 117 references audit report (Item 21 / Exhibit C)
- Receipts: pp 301–305 (Exhibit M, 2 receipt forms)

## Risk flags (early)
- Hotel franchise — capital-intense ($50M–$82M new build)
- Large brand under public parent (Hilton Worldwide, NYSE: HLT)
- Eforea Spa amendment (D-3) — optional product line
- Multi-tier exhibits (D, D-1, D-2, D-3) — fragmented contract surface
- Restaurant Brands sub-system (J-2) — adds optional licensing layer
- State addenda exist (D-1, J-1, L) — material state overrides expected

## Notes / unknowns at source-map stage
- bootstrap toc_map only had {11:45} populated; body item starts here are recovered from ITEM grep on text layer + TOC parse, not from bootstrap verification
- "EXHIBIT _" pages at 181, 184–195, 198 are inside Franchise Agreement / D-1 schedules; they are NOT standalone top-level exhibits and are not in the front-matter exhibit list
- Item 19, 20, 21 page anchors verified by bootstrap (verified set)
