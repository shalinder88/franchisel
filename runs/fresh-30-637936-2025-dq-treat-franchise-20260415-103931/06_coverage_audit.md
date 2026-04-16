# 06 Coverage Audit — DQ Treat Franchise (637936-2025)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| 1 | ✅ Full | Entity structure, affiliates, concept types, market all extracted |
| 2 | ✅ Full | Key officers listed with tenure. Full roster may extend beyond pages read. |
| 3 | ✅ Full | 1 pending case + 3 settled cases extracted. FY2024: no actions. |
| 4 | ✅ Full | No bankruptcy. |
| 5 | ✅ Full | Initial fee $25,000, refund conditions, MTRA fee, reduced fee circumstances. |
| 6 | ✅ Full | 14 fee types extracted with amounts, timing, and notes. |
| 7 | ✅ Full | Both location types, all 13 line items + total. 16 footnotes captured. |
| 8 | ✅ Full | Supplier restrictions, single-source designations, USCI margin commitment, alternate supplier process, revenue from suppliers. |
| 9 | ✅ Full | 20-row obligation table cross-referenced. |
| 10 | ✅ Full | No financing offered. Third-party referrals only. |
| 11 | ✅ Full | Pre-opening + ongoing assistance, training program (3 phases, 174 hours), advertising/NMF, EPOS/tech, site selection. |
| 12 | ✅ Full | No exclusive territory. Relocation policy. Territory operator encroachment. |
| 13 | ✅ Full | Principal trademarks, registrations. ADQ controls litigation. |
| 14 | ✅ Full | No material patents/copyrights. Confidentiality obligations. |
| 15 | ✅ Full | Active supervision required. Manager requirements. Personal guarantee for entity owners. |
| 16 | ✅ Full | ADQ-approved goods only. Menu restrictions. No alcohol/ATMs/gambling. Smoke-free. |
| 17 | ✅ Full | 22-row franchise relationship table. Term, renewal, termination, transfer, noncompete, dispute resolution all extracted. |
| 18 | ✅ Full | No public figures. |
| 19 | ✅ Full | No FPR. Verbatim statement captured. |
| 20 | ✅ Full | All 5 standard table types for both direct-licensed and subfranchised. State-by-state detail. Gag clause flagged. |
| 21 | ✅ Full | Auditor (Deloitte), opinion (unqualified), balance sheet, income statement, equity, cash flows all extracted. No going concern. Guarantee of Performance confirmed. |
| 22 | ✅ Full | Contract list pointing to Exhibits B, C, E, F, G. |
| 23 | ✅ Full | Receipts in Exhibit L. |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | Labeled | State administrators list — not deep-read (low priority) |
| B | Partial | Operating Agreement TOC and selected clauses read. Key provisions surfaced via Item 17 chart. Not fully clause-walked. |
| C | Labeled | Conversion addenda — not deep-read |
| D | Labeled | Franchise application — not deep-read (low priority) |
| E | Labeled | EPOS third-party agreements (124 pages) — not deep-read. Key vendor terms surfaced via Items 8 and 11. |
| F | Labeled | Design services agreement — not deep-read |
| G | Labeled | Construction consultation agreement — not deep-read |
| H | Labeled | Manuals TOC — not deep-read |
| I | Labeled | Current franchisee list (42 pages) — not deep-read |
| J | Labeled | Former franchisee list (7 pages) — not deep-read |
| K | ✅ Full | Financial statements fully extracted: auditor report, balance sheet, income statement, equity, cash flows, notes sampled. |
| L | Labeled | Receipts — not deep-read (low priority) |

## State Addenda Coverage

All 9 state addenda identified and material overrides extracted:
- California (p69-70): ✅ Full
- Hawaii (p71): ✅ Full
- Illinois (p72): ✅ Full
- Maryland (p73): ✅ Full
- Minnesota (p74): ✅ Full
- North Dakota (p75): ✅ Full
- Rhode Island (p76): ✅ Full
- Virginia (p77): ✅ Full
- Washington (p78-79): ✅ Full

## Omissions and Gaps

1. **Exhibit B clause walk**: The Operating Agreement (62 pages) was not fully clause-walked. Key provisions are surfaced via Item 17 chart and selected page reads, but granular clause-level extraction (e.g., exact liquidated damages formula, personal guarantee scope, cross-default triggers, force majeure, death/disability specifics) may be thin.

2. **Exhibit E (EPOS agreements)**: 124 pages of third-party vendor agreements not directly read. Key terms surfaced via Items 8 and 11, but specific contractual obligations to each vendor (data rights, termination penalties, auto-renewal) are not extracted.

3. **Financial notes depth**: Notes 1-12 were read at summary level. Detailed line-item analysis of note families (lease maturity schedule, tax rate reconciliation, intangible amortization schedule) not fully extracted.

4. **Item 2 completeness**: Officer roster may not be exhaustive — some lower-level officers may have appeared on pages not fully captured.

5. **TOC/Texas addendum**: Texas listed in TOC state addenda but no Texas addendum found in document body. Maryland present but not in TOC. This is a document-internal inconsistency — not an extraction gap.

## Unresolveds

1. **TOC/body Texas/Maryland mismatch** — document-internal inconsistency (severity: medium)
2. **Item 20 systemwide vs. status table numerical discrepancy** — partially explained by concept conversion footnotes (severity: low)
3. **Subfranchised 2022 start/end discrepancy** (289 vs 389 in status table start) — unexplained (severity: low)
4. **ADQ vs IDQ financial separation** — only IDQ consolidated financials provided; ADQ standalone not available (severity: medium, mitigated by IDQ guarantee)
5. **No FPR** — buyer risk flag, not extraction gap (severity: high for buyer)

## Contradictions

1. **TOC lists Texas in state addenda; body contains Maryland instead** — document-internal inconsistency.
2. **Item 20 systemwide start-of-year figures differ from status table start-of-year figures** (789 vs 785 for 2023) — likely mid-year reclassification but not explicitly reconciled.
