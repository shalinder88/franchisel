# Coverage Audit — Great Clips, Inc. (Filing 638054)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| Item 1 | **covered-complete** | Entity structure, system size, franchise structures fully extracted |
| Item 2 | **covered-complete** | 34 named officers/directors with roles and tenure |
| Item 3 | **covered-complete** | No litigation disclosed |
| Item 4 | **covered-complete** | No bankruptcy disclosed |
| Item 5 | **covered-complete** | All fee structures (single, Three Star, MDA, VetFran, Deferral, Expediter) |
| Item 6 | **covered-complete** | Full 29-row fee table across 4 continuation pages (pp.22-25) |
| Item 7 | **covered-complete** | Both investment tables (single franchise + MDA) with all 12 notes |
| Item 8 | **covered-complete** | Supplier restrictions, designated suppliers, required brands, revenue from purchases |
| Item 9 | **covered-complete** | Full obligation chart |
| Item 10 | **covered-complete** | No direct financing; lease guarantees; SBA |
| Item 11 | **covered-complete** | Training program hours, technology stack, advertising fund detail, Operations Manual |
| Item 12 | **covered-complete** | Protected area, non-traditional locations, MDA exclusive DMA, channel restrictions |
| Item 13 | **covered-complete** | Trademark portfolio with registrations |
| Item 14 | **covered-complete** | No patents; AI/ML prohibition |
| Item 15 | **covered-complete** | Owner-operated; guaranty; noncompete |
| Item 16 | **covered-complete** | Haircare/grooming only |
| Item 17 | **covered-complete** | Full provision chart: term, renewal, termination, transfer, ROFR, noncompete, dispute resolution |
| Item 18 | **covered-complete** | No public figures |
| Item 19 | **covered-complete** | All 4 tables with all 24 footnotes, population counts, exclusion rules, non-reporting bias |
| Item 20 | **covered-complete** | All 5 tables with state-by-state detail, footer totals, gag clause |
| Item 21 | **covered-partial** | All financial statements and notes extracted from text layer. Auditor firm name not identified (image-only letterhead). |
| Item 22 | **covered-complete** | All 13 contracts listed |
| Item 23 | **covered-complete** | Receipts referenced |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A (Outlets) | **covered-complete** | Page range identified |
| B (Former) | **covered-complete** | Page range identified |
| C (GC Organizations) | **covered-complete** | |
| D (Independent Orgs) | **covered-complete** | |
| E (Financial Statements) | **covered-complete** | All statements + 11 notes fully extracted |
| F (Franchise Agreement) | **covered-partial** | Labeled only. Key burdens from Item 17 chart. Direct clause walk needed. pp.187-236 |
| G (Three Star) | **covered-partial** | Labeled only. Key terms from Item 5. pp.237-240 |
| H (MDA) | **covered-partial** | Labeled only. Key terms from Items 1, 5, 12, 17. pp.241-249 |
| I (ICS Styleware) | **covered-partial** | Labeled only. Key fees from Item 6. pp.250-260 |
| J (Heartland) | **covered-partial** | Labeled only. Key fees from Item 6. pp.261-296 |
| K (SVS) | **covered-partial** | Labeled only. Key fees from Item 6. pp.297-326 |
| L (Lease Documents) | **covered-partial** | Labeled only. Lease burden terms unknown beyond Item 10. pp.327-358 |
| M (Foundation Tech) | **covered-partial** | Labeled only. Key fees from Item 6. |
| N (ACH) | **covered-partial** | Standard ACH form |
| O (Application) | **covered-complete** | No operative clauses |
| P (State Addenda) | **covered-partial** | Page range identified (pp.359-399, ~41 pages). Per-state overrides not extracted. |
| Q (State Agencies) | **covered-complete** | |
| R (Data Processing) | **covered-partial** | Labeled only. pp.403-409 |
| S (SBA Addendum) | **covered-partial** | Labeled only. pp.410-413 |

## Open Items / Unresolveds

1. **Auditor firm name** (severity: low) — Text layer does not contain the auditor firm name; letterhead appears image-only. PDF page 168. Requires image fallback in A2.
2. **State addenda not structured** (severity: medium) — Exhibit P spans pp.359-399 (~41 pages) but per-state overrides not extracted into structured form.
3. **Franchise Agreement not clause-walked** (severity: medium) — Exhibit F (pp.187-236, ~50 pages) only labeled. Key operative burdens are covered by Item 17 chart (pp.56-59).
4. **Non-reporting salon bias** (severity: high — business risk) — 1,972 of 4,147 eligible salons did not report expenses. Lower-performing salons disproportionately non-reporting. Acknowledged in FDD text.
5. **Ceased operations ambiguity** (severity: medium — business risk) — "Other reasons" includes relocations; 14 closed and relocated/reopened in 2024. True permanent closure count requires adjustment.
6. **Lease documents not reviewed** (severity: low) — Exhibit L (pp.327-358) not clause-walked. Lease guarantee terms from Item 10 are known.

## Depth Assessment
- **08_final_report.md**: Full diligence report with all required sections A-L
- **09_final_canonical.json**: 40+ top-level keys with full evidence grounding
- **11_canonical_enriched.json**: Real enrichment layers added
- **12_canonical_enriched_v2.json**: Per-item structured families
