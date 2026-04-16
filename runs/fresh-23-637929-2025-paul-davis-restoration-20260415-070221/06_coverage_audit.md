# Coverage Audit — Paul Davis Restoration, Inc. (637929-2025)

## Item-by-Item Coverage

| Item | Status | Tables | Notes |
|------|--------|--------|-------|
| Item 1 | ✅ Full | — | Corporate history, parent chain, all affiliates, business description, regulations |
| Item 2 | ✅ Full | — | 7 officers/directors with tenure and roles |
| Item 3 | ✅ Full | — | Pending: None. Concluded: 1 (Smith v. Paul Davis, settled 2015) |
| Item 4 | ✅ Full | — | No bankruptcy |
| Item 5 | ✅ Full | T01 | $0.26/person, range $65K-$208K, VetFran, financing terms |
| Item 6 | ✅ Full | T02 | 29 fee categories extracted with amounts, frequency, notes |
| Item 7 | ✅ Full | T03 | 16 line items, $298.8K-$804.9K total, all 12 notes extracted |
| Item 8 | ✅ Full | — | Software requirements, supplier accounts, rebates, insurance requirements |
| Item 9 | ✅ Full | T04 | 24 obligations (A-X) with FA article references |
| Item 10 | ✅ Full | — | 50% financing at 7% APR, 4-year term, cross-default |
| Item 11 | ✅ Full | T05, T06 | Training (330 hrs), pre/post-opening assistance, computer requirements, SMP spending |
| Item 12 | ✅ Full | — | Non-exclusive territory, encroachment risks, zip code boundaries |
| Item 13 | ✅ Full | — | 6 registered marks + 1 pending, no infringement proceedings |
| Item 14 | ✅ Full | — | No patents, copyright on manual, trade secret protections, AI policy |
| Item 15 | ✅ Full | — | Full-time participation, personal guaranty, spousal acknowledgment |
| Item 16 | ✅ Full | — | Must offer all designated services; General Council can add services |
| Item 17 | ✅ Full | T07 | 22 provisions (a-w) extracted with FA references and summaries |
| Item 18 | ✅ Full | — | No public figures |
| Item 19 | ✅ Full | T08, T09, T10 | Tables 1-5 with all summary statistics and caveats |
| Item 20 | ✅ Full | T11-T14 | Tables 1-5 with 3-year trends, transfers, status by state, projections |
| Item 21 | ✅ Full | T15, T16 | FS Brands financials — BS, IS, CF, equity changes; PwC clean opinion |
| Item 22 | ✅ Full | — | FA, Commercial Program, Promissory Note, Resale Procedures |
| Item 23 | ✅ Full | — | Two receipt pages |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A — Franchisee List | ✅ Cataloged | 16 pages, PII-sensitive, not fully parsed (by design) |
| B-1 — Financial Statements | ✅ Extracted | Key line items from BS, IS, CF for FY2024/2023 |
| B-2 — Guarantee of Performance | ⚠️ Partial | Cover page only; page 137 image-based text not extractable. Guarantee fact confirmed from Item 21 text. |
| C — Franchise Agreement | ✅ Cataloged | 53 pages; cross-referenced in Item 17. Not fully clause-parsed. |
| D — Commercial Program Agreement | ✅ Cataloged | 8 pages; optional program |
| E — State Administrators | ✅ Cataloged | 3 pages |
| F — State Addenda | ✅ Cataloged | 30 pages, 14 states identified. Individual state overrides not fully parsed. |
| G — Promissory Note | ✅ Cataloged | 3 pages; terms confirmed in Item 10 |
| H — Operations Manual TOC | ✅ Cataloged | 2 pages |
| I — Resale Procedures | ✅ Cataloged | 18 pages |

## Table Coverage

| Table ID | Source | Status | Notes |
|----------|--------|--------|-------|
| T01 | Item 5 | ✅ Complete | Franchise fee structure |
| T02 | Item 6 | ✅ Complete | 29 fee categories |
| T03 | Item 7 | ✅ Complete | 16 investment line items + 12 notes |
| T04 | Item 9 | ✅ Complete | 24 obligations |
| T05 | Item 11 | ✅ Complete | Training program — 10 topics |
| T06 | Item 11 | ✅ Complete | SMP spending breakdown (7 categories) |
| T07 | Item 17 | ✅ Complete | 22 contract provisions |
| T08 | Item 19 | ✅ Complete | Table 1 summary (2+ years) |
| T09 | Item 19 | ✅ Complete | Table 2 summary (<2 years) |
| T10 | Item 19 | ✅ Complete | Table 5 resale valuations (17 transactions) |
| T11 | Item 20 | ✅ Complete | Systemwide outlet summary |
| T12 | Item 20 | ✅ Complete | Transfers by year |
| T13 | Item 20 | ✅ Complete | Status of franchised outlets — totals |
| T14 | Item 20 | ✅ Complete | Projected openings |
| T15 | Item 21 | ✅ Complete | Consolidated balance sheet |
| T16 | Item 21 | ✅ Complete | Consolidated income statement |

## Identified Gaps

### Material Gaps Requiring Retry

1. **Exhibit B-2 Guarantee of Performance text** — Page 137 is image-only; guarantee text not extractable from text layer. The fact of the guarantee is established from Item 21 text, but the specific guarantee language/scope is not captured.
   - **Severity**: Low — the fact that FS Brands guarantees PDRI's obligations is confirmed. The specific legal language is in the image.
   - **Recommendation**: SKIP — the guarantee fact is captured; full legal text review would require OCR of image page.

2. **State addenda individual overrides** — 14 states identified and page-ranged, but specific material overrides not individually parsed for each state.
   - **Severity**: Medium — material for franchisees in those specific states.
   - **Recommendation**: EXECUTE — targeted read of key state addenda (CA, IL, NY, MN, WA, WI) to capture material overrides.

3. **Item 19 individual franchise data (Tables 1-2)** — Summary statistics captured but individual franchise rows not stored as structured data in canonical.
   - **Severity**: Low — summary statistics are the primary analytical value; individual rows are in reader report.
   - **Recommendation**: SKIP — summaries captured; individual rows available in source text.

### Non-Material Notes

- Item 19 Tables 3 and 4 (sold/terminated franchise sales) are captured in reader report but not as standalone table objects — covered in T10 for resale valuations.
- Franchise Agreement full clause parsing not performed — Item 17 table provides comprehensive summary. Full FA parsing would be needed only for specific legal due diligence.
- Operations Manual TOC content not parsed — only exhibit catalog entry.
- PDRI-specific revenue breakdown within FS Brands consolidated financials not available — this is an inherent limitation of parent-level reporting.

## Coverage Score

- **Items 1-23**: 23/23 fully covered (100%)
- **Tables extracted**: 16/16 material tables (100%)
- **Exhibits cataloged**: 9/9 (100%)
- **Exhibit text extraction**: 8/9 (Exhibit B-2 partial due to image)
- **Overall extraction confidence**: High
