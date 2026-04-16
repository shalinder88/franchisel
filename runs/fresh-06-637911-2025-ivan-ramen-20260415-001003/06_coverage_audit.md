# Coverage Audit — Ivan Ramen Franchising LLC (637911-2025)

## Item-by-Item Coverage

| Item | Status | Coverage | Notes |
|------|--------|----------|-------|
| 1 | ✅ Complete | Full | Entity, affiliates, formation, address, concept, history |
| 2 | ✅ Complete | Full | 3 key personnel with full biography |
| 3 | ✅ Complete | Full | None required |
| 4 | ✅ Complete | Full | None required |
| 5 | ✅ Complete | Full | IFF, ADA fee, refund policy, reduced fee history |
| 6 | ✅ Complete | Full | 23 fee types extracted with 5 detailed notes |
| 7 | ✅ Complete | Full | Single-unit table (15 line items), ADA table (3 line items), 14 notes |
| 8 | ✅ Complete | Full | Proprietary products, POS, OpenTable, insurance, supplier approval, gift cards |
| 9 | ✅ Complete | Full | Both FA and ADA cross-reference tables |
| 10 | ✅ Complete | Full | No financing offered |
| 11 | ✅ Complete | Full | Pre/post-opening obligations, advertising (brand fund not yet formed), POS/computer specs, training table (14 subjects, 106 hours), time to open |
| 12 | ✅ Complete | Full | FA territory, ADA territory, all reservations (alt channels, nontraditional, national accounts, acquisition rights), minimum sales quota |
| 13 | ✅ Complete | Full | 4 registrations + 1 pending application; IP licensing structure |
| 14 | ✅ Complete | Full | No patents; copyright claims; artwork license; confidentiality requirements |
| 15 | ✅ Complete | Full | Operations Manager, Trainer, Area Business Manager; personal guarantee (5%+ owners) |
| 16 | ✅ Complete | Full | Product restrictions, co-branding, pricing rights, delivery through approved aggregators only, minimum hours |
| 17 | ✅ Complete | Full | FA table (23 provisions a-w) and ADA table (23 provisions a-w); comprehensive termination, transfer, renewal, noncompete, dispute resolution |
| 18 | ✅ Complete | Full | No public figures |
| 19 | ✅ Complete | Full | No FPR made |
| 20 | ✅ Complete | Full | All 5 tables with footnotes; franchisee list cross-referenced |
| 21 | ✅ Complete | Partial | 3 years of statements extracted; auditor opinion pages are image-only |
| 22 | ✅ Complete | Full | Contracts list |
| 23 | ✅ Complete | Full | Receipt reference |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A (FA) | ✅ Cataloged | Structure identified; key terms captured from Item 17 cross-references |
| B (ADA) | ✅ Cataloged | Structure identified; key terms captured from Item 17 cross-references |
| C (Financials) | ⚠️ Partial | All statement data extracted; auditor report text NOT extractable (image-only pp. 275-276, 288-289, 301-302) |
| D (State Admins) | ✅ Cataloged | Low priority |
| E (Agents) | ✅ Cataloged | Low priority |
| F (Franchisee List) | ✅ Complete | Single entry fully extracted |
| G (State Addenda) | ⚠️ Partial | 8 states identified; California fully read; other 7 states identified by page location but not line-by-line extracted |
| H (Effective Dates) | ✅ Cataloged | Low priority |
| I (Receipt) | ✅ Cataloged | Low priority |

## Table Coverage

| Table | Source | Status |
|-------|--------|--------|
| Item 6 Other Fees | Item 6 | ✅ Complete — 23 fees + 5 notes |
| Item 7 Single Unit Investment | Item 7 | ✅ Complete — 15 items + 14 notes |
| Item 7 ADA Multi-Unit Investment | Item 7 | ✅ Complete — 3 items + 3 notes |
| Item 9 FA Obligations | Item 9 | ✅ Noted (cross-reference only) |
| Item 9 ADA Obligations | Item 9 | ✅ Noted (cross-reference only) |
| Item 11 Brand Standards TOC | Item 11 | ✅ Complete — 9 topics, 166 pages |
| Item 11 Start Up Manual TOC | Item 11 | ✅ Complete — 5 topics, 45 pages |
| Item 11 Training Program | Item 11 | ✅ Complete — 14 subjects, 106 hours |
| Item 17 FA Relationship | Item 17 | ✅ Complete — provisions a through w |
| Item 17 ADA Relationship | Item 17 | ✅ Complete — provisions a through w |
| Item 20 Table 1 (Systemwide) | Item 20 | ✅ Complete |
| Item 20 Table 2 (Transfers) | Item 20 | ✅ Complete |
| Item 20 Table 3 (Franchised Status) | Item 20 | ✅ Complete |
| Item 20 Table 4 (Company-Owned) | Item 20 | ✅ Complete |
| Item 20 Table 5 (Projected) | Item 20 | ✅ Complete |
| Item 21 BS/IS/CF 2024 | Exhibit C | ✅ Complete |
| Item 21 BS/IS 2023 | Exhibit C | ✅ Complete |
| Item 21 BS/IS 2022 | Exhibit C | ✅ Complete |

## Identified Gaps

### Gap 1: Auditor's Opinion Type (MATERIAL)
- **Location:** Exhibit C, pages 275–276 (2024), 288–289 (2023), 301–302 (2022)
- **Issue:** Auditor's report pages are image-only scans; text layer is empty. Cannot confirm whether the auditor issued a clean opinion, qualified opinion, or going-concern emphasis paragraph.
- **Impact:** Given the state-mandated "financial condition" special risk flag and the franchisor's near-zero cash and equity, a going-concern opinion is likely but unconfirmed.
- **Retry recommendation:** EXECUTE — use pdftoppm to render auditor report pages as images and read them visually.

### Gap 2: State Addenda Detail (7 states) (MODERATE)
- **Location:** Exhibit G — Hawaii (p322), Illinois (p323), Indiana (p324), Maryland (pp325-329), New York (pp330-331), North Dakota (pp332-338), Wisconsin (p339)
- **Issue:** Only California addendum was fully read. Other 7 state addenda were identified but not line-by-line extracted.
- **Impact:** Material overrides on termination, noncompete, venue, choice of law, and other provisions may exist in these states.
- **Retry recommendation:** EXECUTE — read remaining state addenda for material overrides.

### Gap 3: Trademark Design Mark Descriptions (MINOR)
- **Location:** Item 13, pages 39-40
- **Issue:** Two registration numbers (5110334 and 6737311) appear to have design mark descriptions that are partially image-based.
- **Impact:** Descriptions are missing but registration numbers and dates are captured. Does not materially affect diligence assessment.
- **Retry recommendation:** SKIP — registration data sufficient for canonical.

## Summary

- **Items fully covered:** 23/23
- **Tables extracted:** 16 material tables
- **Exhibits cataloged:** 9/9 (all exhibits)
- **Material gaps:** 2 (auditor opinion, state addenda detail)
- **Minor gaps:** 1 (trademark descriptions)
- **Recommended retries:** 2 (auditor opinion, state addenda)
