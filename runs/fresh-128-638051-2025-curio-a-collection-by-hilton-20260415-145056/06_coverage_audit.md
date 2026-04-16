# Coverage Audit — Curio Collection by Hilton (638051-2025)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| 1 | ✅ Full | Entity structure, parents, predecessors, affiliates, brands, subsidiaries all extracted |
| 2 | ✅ Adequate | Officer roster referenced. Not extracted line-by-line (low-value for diligence) |
| 3 | ✅ Adequate | Litigation exists, referenced. Not case-by-case extracted (standard enforcement actions noted) |
| 4 | ✅ Full | No bankruptcy disclosed |
| 5 | ✅ Full | All initial fees extracted with notes 1-6 |
| 6 | ✅ Full | All ongoing fees extracted with notes 1-9. 40+ fee line items captured |
| 7 | ✅ Full | Initial investment table with 27 line items and 24 notes. Total: $4.7M-$143.5M |
| 8 | ✅ Full | Supplier control, HSM structure, rebates/admin fees quantified, approval process |
| 9 | ✅ Full | Cross-reference table covered |
| 10 | ✅ Full | Financing/incentive program, development incentive note, rare circumstances |
| 11 | ✅ Full | Pre-opening obligations, computer systems (7 systems), training program (11+ courses), advertising/program fee |
| 12 | ✅ Full | Territory/restricted area, carve-outs, strategic partnerships, encroachment risks |
| 13 | ✅ Full | Trademark registrations, license structure, enforcement rights |
| 14 | ✅ Full | No patents. Proprietary Information defined |
| 15 | ✅ Full | GM requirement, management company, guaranty |
| 16 | ✅ Full | Lodging services, gaming prohibition, facility sharing restrictions |
| 17 | ✅ Full | All provisions a-w extracted: term, renewal, termination, transfer, noncompete, dispute resolution |
| 18 | ✅ Full | No public figures |
| 19 | ✅ Full | FPR provided. Room rate, occupancy, conversion data extracted. Population counts, ranges, medians, attainment percentages all captured |
| 20 | ✅ Full | All 5 standard tables extracted. Gag clause flagged. Eforea/Restaurant Brand counts included |
| 21 | ✅ Full | Auditor (CBH), clean opinion, 3-year financials (BS, IS, CF) extracted |
| 22 | ✅ Full | All contract exhibits listed |
| 23 | ✅ Full | Receipts noted |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | ✅ Identified | Franchisee list by state. Not line-by-line extracted (PII concern) |
| B | ✅ Identified | Former franchisees. 2 entries noted (CA, FL) |
| C | ✅ Deep read | Balance sheet, income statement, cash flows, notes through Note 8 |
| D | ✅ Section-level | FA read at TOC and major section level. Full clause-by-clause deferred to A2 |
| D-1 | ⚠️ Located | State addenda to FA — page range identified but not detail-extracted |
| D-2 | ✅ Identified | Development Incentive Note |
| D-3 | ✅ Identified | Eforea Spa Amendment (3 pages) |
| D-4 | ✅ Identified | Restaurant Brand Amendment (6 pages) |
| E | ⚠️ Located | Guaranty — 4 pages, not detail-extracted |
| F | ✅ Identified | Franchise Application |
| G | ✅ Identified | HITS Agreement — 25+ pages |
| H-1/2/3 | ✅ Identified | Manual TOCs |
| I | ✅ Identified | State administrators |
| J-1 | ⚠️ Read partially | FDD state addenda — 8 pages. States identified but overrides not fully structured |
| J-2 | ✅ Identified | Restaurant Brands list |
| K | ✅ Identified | Lender comfort letters |
| L | ✅ Identified | State effective dates |
| M | ✅ Identified | Receipts |

## Missing Tables
- No tables missing from Items 5, 6, 7, 19, 20, 21, 22, 23.

## Missing Exhibit Follow-Through
1. **Exhibit D-1 (State Addenda to FA)**: Located but not structured. Needs depth pass.
2. **Exhibit E (Guaranty)**: Not detail-extracted. Scope/limitations unknown.
3. **Exhibit J-1 (State Addenda to FDD)**: Partially read. Override families not structured per-state.

## Unresolveds

1. **Item 19 Room Rate range anomaly**: 2024 range top ($266.58) appears inconsistent with average ($257.42). 2023 range ($146.86-$221.25) with average $255.91 is arithmetically problematic — average exceeds range max. This suggests the "range" may represent an interquartile range or different metric, not the full min-max. **Severity: medium**

2. **Item 20 "Ceased Operations - Other Reasons" positive values**: 4 entries in 2024 show positive values (+1 each in AZ, CO, FL, MA, VT) in a column labeled for cessations. Likely represents hotel reclassifications or state transfers into system. **Severity: low**

3. **Exhibit D-1 vs. J-1 interplay**: Both contain state addenda but for different documents (FA vs FDD). Material overrides to franchise law provisions need structured extraction. **Severity: medium**

## Contradictions
- None identified at this stage.

## Coverage Grade: A-
All 23 Items fully or adequately covered. All 5 Item 20 tables present. Item 19 FPR fully extracted. Financial statements deep-read. Primary gaps are in exhibit detail extraction (state addenda, guaranty, FA clause-by-clause), which are depth pass targets.
