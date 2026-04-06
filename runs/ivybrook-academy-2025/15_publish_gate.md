# 15 Publish Gate — Ivybrook Academy 2025 (Shadow Fresh)

## Decision: **Publish-ready with caveats**

Weighted coverage 97.35% with Items 1–20, 22, 23 fully surfaced and all contradictions preserved. The only gap is Exhibit J financial statement line items, which is a source-document / extraction-environment limitation, not a diligence-content failure — and the diligence-relevant financial-condition signal is already directly surfaced through three independent cover/addenda disclosures. A focused recovery pass is **not required** before publish; it would be a nice-to-have to close the Item 21 detail gap but does not materially block buyer trust given the compensating disclosures.

## Family-by-family assessment

### Item 19 — Financial Performance Representation: **Complete**
All five tables (Table 1 revenue streams, Table 2A affiliate EBITDA with full income statement, Tables 2B/2C franchisee average and median income statements, Table 3 gross revenue by classroom count), all notes (1–6 plus sample definitions), benchmarking counts, and exclusion criteria are directly surfaced. Two minor items are preserved as contradictions rather than gaps: the 18-vs-19 school count for the 3Y+ cohort and the definitional difference between Item 6 and Item 19 Gross Revenue. Neither affects the underlying economics. Publish-ready.

### Item 20 — Outlets and Franchise Information: **Complete**
All five Item 20 tables (system-wide summary, transfers, state-by-state franchised status, company-owned status, projected openings) and the full current/unopened/former franchisee list (physical Exhibit L / TOC Exhibit K) are directly surfaced with addresses and phones. Zero-transfer, zero-termination, zero-non-renewal, two-Texas-ceased attrition picture is unambiguous. The 42 signed-not-opened backlog is captured. Publish-ready.

### Item 21 — Financial Statements: **Sufficient for publish with caveats**
The Item 21 body itself (audited periods FY2022/FY2023/FY2024, December fiscal year end) is fully surfaced. The Exhibit J statement content is image-only in this extraction — auditor identity, balance sheet line items, income statement, cash flow, equity roll-forward, and notes are not directly surfaced. Three compensating facts are surfaced independently and carry most of the diligence weight:
1. Stockholder's equity $345,862 at 12/31/2024 (Virginia addendum risk factor).
2. Franchisor 2024 total revenue $2,171,363 (Item 8 body).
3. Cover Special Risk #2 explicitly states financial condition "calls into question" franchisor's ability to support — this is the single most important diligence signal Item 21 would otherwise supply.

Additionally, the Illinois addendum-mandated fee deferral, imposed by the Illinois Attorney General "due to our financial condition," is effectively a regulator-imposed going-concern proxy. Buyers reading the FDD front-to-back will see the financial-condition risk clearly without ever opening Exhibit J. The Item 21 detail gap is therefore a **structural extraction limitation**, not a business-risk blind spot.

Publish-ready with caveat: flag Item 21 as "statement line items not surfaced; see Special Risk #2, IL addendum, VA addendum for financial-condition disclosure."

### State addenda sufficiency: **Sufficient (document-level scope, not extraction gap)**
Only three addenda are present in Exhibit B (Illinois, Minnesota, Virginia). This is a choice of the franchisor, not an extraction gap — the State Effective Dates page confirms that CA/HI/MD/NY/ND/RI/SD/WA are "Not registered" and IL/MI/VA/WI are "Pending." The absence of Wisconsin addendum in a Wisconsin-filed FDD is worth flagging to buyers but is a document characteristic, not an extraction failure. Publish-ready as long as the publish layer surfaces the WI-pending status.

### Key exhibit sufficiency: **Sufficient**
Exhibit A Franchise Agreement (clause-level depth extracted in depth pass), Exhibit C Multi-Unit Development Agreement with Ohio rider, Exhibit F Unlimited Guaranty, Exhibit G General Release, Exhibit H (two separate restrictive-covenant forms), Exhibit I Brand Standards Manual TOC (six sections, 242 pages total, recovered via retry R2), physical Exhibit L / TOC Exhibit K franchisee list, and Exhibit M Receipt are all directly surfaced and structured. Only Exhibit J is a gap.

## Unresolveds — extraction gaps vs business-risk flags

| Unresolved | Classification | Action |
|---|---|---|
| Exhibit J financial statement line items | **Extraction gap** (image-only raster) | OCR recovery pass would close it |
| Auditor identity, audit opinion text | **Extraction gap** | Same as above |
| Going-concern language in Exhibit J | **Hybrid** — extraction gap for the exact wording, but the indirect signals (cover Special Risk #2, IL fee deferral, VA equity disclosure) are already strong business-risk flags surfaced directly | No action required for publish |
| Parent guaranty of franchisor performance post-Crux acquisition | **Business-risk flag** (not surfaced because it may not exist; cannot be inferred) | Note as unresolved; do not block publish |
| Whether Aug 29, 2025 Crux acquisition appears in Exhibit J subsequent events | **Extraction gap** | Cannot be verified without OCR; note as unresolved |
| Exhibit K vs Exhibit L labeling mismatch | **Document-quality flag** (not an extraction artifact) | Preserve as contradiction; document it in the publish layer |
| Item 19 3Y+ cohort size 18 vs 19 | **Document-quality flag** | Preserve |
| Gross Revenue definition mismatch Item 6 vs Item 19 | **Document-quality flag** | Preserve |

## Missing families that could weaken buyer trust: **None material**
- Litigation (Item 3): directly surfaced as "none" — definitive.
- Bankruptcy (Item 4): directly surfaced as "none" — definitive.
- Management bios (Item 2): surfaced.
- Guaranty chain (Exhibit F): surfaced.
- Franchisee list (physical Exhibit L / TOC K): surfaced with full contact detail.
- Contract burden: clause-level depth structured in `RT_depth_contract_burdens.json`.
- Restrictive covenants: both Exhibit H forms surfaced.
- Item 11 technology, manual, online presence, Brand Fund, advertising cooperative: all surfaced.

No family is materially missing. The only reason a buyer would open a second source (Exhibit J itself, or state filings) is to read the raw audited statements — which is a documentation completeness preference, not a trust-weakening gap.

## Focused recovery pass: **Optional, not required**

If a focused recovery pass is later executed, scope it to a maximum of **one task**:

### Optional RP1 — Exhibit J OCR
- **Target**: pages 168–197 of the Ivybrook Academy 2025 PDF.
- **Tool**: server-side tesseract (or equivalent OCR) applied to rasterized pages via poppler/pdftoppm or PyMuPDF's `get_pixmap` render.
- **Expected recovery**: auditor firm name and city; signed audit opinion text including any going-concern modification; balance sheet line items (cash, receivables, fixed assets, total assets, total liabilities reconciling to the $345,862 members' equity); full income statement (reconciling to the $2,171,363 total revenue); cash flow statement; statement of members' equity roll-forward; Note 1 accounting policies (revenue recognition mechanics, depreciation method and useful life, impairment policy, receivable allowance); tax note; advertising expense actual; subsequent-events note and its signature date (which would determine whether the August 29, 2025 Crux acquisition is referenced).
- **Expected output filename**: `RP1_exhibit_j_ocr_recovery.md`.
- **Not required for publish** — the compensating disclosures already carry the diligence signal.

No other recovery tasks are warranted. Contract burden depth, operations manual TOC, and exhibit label contradiction are already resolved. State addenda scope is a document characteristic, not a recovery target. Litigation, bankruptcy, management, franchisee list, guaranty, and restrictive covenants are all fully surfaced.

## Final gate verdict
**PUBLISH-READY WITH CAVEATS.** Publish with the following explicit publish-layer flags:
1. Item 21 statement line items and auditor identity not surfaced due to Exhibit J image-only content; financial-condition signals are surfaced directly via cover Special Risk #2, Illinois addendum fee deferral, and Virginia addendum stockholder's equity disclosure.
2. Document-quality contradictions preserved (Exhibit K/L labeling; 3Y+ cohort 18 vs 19; Gross Revenue definition; "Exhibit K" referenced in How-to-Use Q&A for financials).
3. Post-FDD corporate event (August 29, 2025 Crux acquisition) disclosed in Item 1 but not reflected in FY2024 Exhibit J.
4. State addenda scope limited to IL, MN, VA (document characteristic).
5. Unopened backlog (42 signed vs 40 operating) flagged per cover Special Risk #4.
