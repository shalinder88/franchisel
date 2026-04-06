# Scorecard — Ivybrook Academy FDD (637976-2025)

## Coverage Summary

| Category | Status | Notes |
|----------|--------|-------|
| Identity (Item 1) | COMPLETE | Full entity chain, PE ownership, affiliates |
| Business Experience (Item 2) | COMPLETE | Key personnel identified |
| Litigation (Item 3) | COMPLETE | None disclosed |
| Bankruptcy (Item 4) | COMPLETE | None disclosed |
| Initial Fees (Item 5) | COMPLETE | All fees, MUDA fees, refund policy |
| Other Fees (Item 6) | COMPLETE | 26 fee categories with notes |
| Initial Investment (Item 7) | COMPLETE | Both single and MUDA tables, 13 notes |
| Supplier Control (Item 8) | COMPLETE | Designated suppliers, affiliate supplier, rebates |
| Franchisee Obligations (Item 9) | COMPLETE | Full table |
| Financing (Item 10) | COMPLETE | None offered |
| Training/Technology (Item 11) | COMPLETE | Training table recovered via retry. Tech requirements complete. |
| Territory (Item 12) | COMPLETE | Definition, exclusivity, reserved rights, carveouts |
| Trademarks (Item 13) | COMPLETE | Registrations, no infringement |
| IP (Item 14) | COMPLETE | 7 copyright registrations, innovation assignment |
| Owner Participation (Item 15) | COMPLETE | CEO/School Admin requirements |
| Restrictions (Item 16) | COMPLETE | Channel and product restrictions |
| Legal Burden (Item 17) | COMPLETE | Full relationship table (a–w) |
| Public Figures (Item 18) | COMPLETE | None |
| Performance (Item 19) | COMPLETE | 4 tables with EBITDA detail, notes |
| Outlets (Item 20) | COMPLETE | All 5 tables |
| Financial Statements (Item 21) | PARTIAL | Image-only — no extractable data |
| Contracts (Item 22) | COMPLETE | List identified |
| Receipt (Item 23) | COMPLETE | Both copies |
| Franchise Agreement | COMPLETE | Full 78-page agreement |
| State Addenda | COMPLETE | IL, MN, MI |
| MUDA | COMPLETE | Full agreement |
| Guaranty | COMPLETE | Unlimited personal |
| NDA/NCA | COMPLETE | Both non-solicitation and non-competition |
| General Release | COMPLETE | Sample form |
| Financial Statements (Exhibit J) | NOT EXTRACTABLE | 30 pages scanned images |
| Franchisee List | COMPLETE | Open, not-opened, former |
| Operations Manual TOC | COMPLETE | 242 pages, 6 sections |

## Extraction Metrics

| Metric | Value |
|--------|-------|
| Total canonical fields | ~95 (45 base + 12 depth-promoted + 35 regression-promoted expenses + 5 investment dual-format) |
| Fields confirmed | ~90 |
| Fields not_directly_surfaced | ~5 (all financial statement related) |
| Tables extracted | 15 |
| Exhibits cataloged | 14 |
| Retry tasks generated | 3 |
| Retry tasks resolved | 3 (1 confirmed limitation, 1 success, 1 resolved) |
| Depth pass tasks | 3 (financial notes, contract burdens, promotion audit) |
| Contract burdens structured | 40 |
| Contradictions identified | 2 |
| Unresolveds identified | 5 |

## Quality Assessment

**Strengths:**
- Item 19 is exceptionally rich — 4 tables with full EBITDA breakdown by cohort, revenue streams, and classroom count
- All 5 Item 20 tables fully extracted including state-level detail
- Complete fee stack with 26 categories and all notes
- Full contract burden analysis (term, renewal, transfer, termination, noncompete, guaranty)
- PE ownership chain fully traced
- Training table recovered via targeted retry
- Unmapped pages resolved

**Depth pass additions:**
- 40 contract burdens structured from FA walk (financial obligations, data ownership, system-change exposure, remodel, indemnification, dispute mechanics)
- 12 narrative facts promoted to canonical (FAC, certifications, time-to-open, owner participation, GR definition, reporting, facility profile, former franchisees, manual structure, standard of care, damages cap, renewal contradiction)
- New contradiction C-02: Item 17 says 1 renewal but FA §4.2 says maximum of 2 renewal terms
- Financial notes confirmed not extractable (image-only); partial inferences documented from FA text

**Weaknesses:**
- Financial statements (30 pages) are scanned images — the single most material gap
- This is especially significant given both Special Risk #2 and Illinois AG fee deferral flag financial condition
- Auditor identity, going concern status, and all financial metrics are unknown
- Renewal term count is contradicted between Item 17 summary and FA §4.2 text

**Overall Coverage Score:** ~94% (base 88% + depth pass + regression recovery; financial statements remain sole material gap)

**Regression recovery additions:**
- Promoted 30 per-expense fields (Table 2B/2C, 15 lines × 2 cohorts) to enriched canonical
- Dual-format investment promotion (single-unit + MUDA + system-wide convention)
- 3 regression annotations (2 gold errors flagged + 1 convention resolution)
- Adjudicated C-02 renewal contradiction: FA §4.2 is operative (max 2 renewals of 10 years each)

## Diligence Signals

1. **Financial condition risk** — dual flags (Special Risk + IL AG). Financial statements not readable.
2. **Growth trajectory** — consistent +7/year with zero terminations. Positive.
3. **42 signed-not-opened** — pipeline risk but also growth indicator.
4. **Supplier control** — high, with affiliate software lock-in.
5. **PE acquisition** — Aug 2025. Crux I Ivybrook. May signal growth capital or operational changes.
6. **Brand Fund increase** — 1%→2% in 2026, raising minimum recurring fees to 10%+.
7. **EBITDA range** — $152K–$213K avg depending on maturity, before owner salary. Solid for education concept.
8. **Labor is dominant expense** — 40–41% of GR across all cohorts.
