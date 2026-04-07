# Coverage Audit — shadow-live-mcdonalds-2025-v2

## Coverage by item

| Item | Coverage | Notes |
|---|---|---|
| 1 — Franchisor | FULL | Entity, parent, formats, mix |
| 2 — Business Experience | PARTIAL | Officer titles captured structurally; individual start dates not normalized into canonical (tracked in reader report) |
| 3 — Litigation | FULL | 7 pending cases + collection action + concluded-case summary |
| 4 — Bankruptcy | FULL | None |
| 5 — Initial Fees | FULL | All fee variants with refund policy |
| 6 — Other Fees | FULL | Full fee table extracted to 03_tables.json; technology stack complete |
| 7 — Initial Investment | FULL | All three format columns + McOpCo overrun disclosure |
| 8 — Supply Chain | FULL | Required-purchase %, Sesame/Cashless/Gift Card, $39M rebate line, 68% real estate revenue line |
| 9 — Franchisee Obligations | FULL | Obligation matrix captured in reader report (not duplicated in canonical) |
| 10 — Financing | FULL | BOA program, APR, guarantee fee, waiver mechanics |
| 11 — Assistance/Training/Tech | FULL | Training hours table + advertising + computer systems + site selection |
| 12 — Territory | FULL | No protected territory |
| 13 — Trademarks | FULL | 3 principal marks + affiliate ownership + license mechanics |
| 14 — Copyrights/Proprietary | PARTIAL | Key confidentiality clause captured; copyrighted works list not itemized (no registration; low priority) |
| 15 — Owner Operation | FULL | Full time + on-premises |
| 16 — Restrictions on Sales | FULL | Only authorized products, franchisor may modify |
| 17 — Renewal/Term/Transfer | FULL | Full FA and Operator's Lease provision tables |
| 18 — Public Figures | FULL | None |
| 19 — FPR | FULL | Pro forma at 3 sales bands + system-wide averages by cohort |
| 20 — Outlets | FULL | Tables 1, 2, 4, 5 totals + Exhibit R/S references + association list + gag-clause flag. State-level granular tables 3 summarized not row-level extracted (low value for canonical scoring) |
| 21 — Financial Statements | FULL | Audit opinion + IS + BS complete; cash flow and notes not decoded |
| 22 — Contracts | FULL | Exhibit letters |
| 23 — Receipts | FULL | Presence noted |

## Exhibits coverage

| Exhibit | Coverage | Rationale |
|---|---|---|
| A (Financial Statements) | PARTIAL | Audit opinion + IS + BS decoded; Cash Flow statement + full footnotes not decoded |
| B–I, M (contracts) | CATALOG ONLY | Referenced via Item 17 provision summaries, not parsed |
| J (Candidate/Preliminary Agreement) | PARTIAL | Terms summarized from Item 11 references (no compensation, no employment, at-will removal) |
| K (New Term Policy) | PARTIAL | Key economic mechanic (Percentage Rent floor 8.50%) captured |
| L (Growth Policy) | CATALOG ONLY | Item 17 Note 3 reference only |
| N (Loan docs) | PARTIAL | BOA terms captured from Item 10 |
| O (Agents) / P (State Admins) / Q (Affiliates) | CATALOG ONLY | Reference only |
| R (Franchised list) | CATALOG ONLY | Item 20 count only |
| S (Departed franchisees) | PARTIAL | Count = 113 captured |
| T (State Specific Addenda) | GAP | Individual state overrides NOT decoded; potential source of state-level FPR/non-compete/venue modifications that would supersede default provisions |

## Material gaps (candidates for retry)

1. **Exhibit T — State Specific Addenda.** Individual state addenda are not decoded. For any state-level diligence query (e.g., WI-specific, CA-specific modifications), this is the authoritative source. Recommended retry: scan pages after Exhibit S for state-by-state addendum headings and capture any modifications to venue, non-compete, governing law, or FPR that differ from defaults. **Priority: MEDIUM**. Wisconsin is the state of filing (638437 WI DFI), so a WI-specific override check is the minimum recovery.

2. **Exhibit A — Cash flow statement + notes.** Operating cash flow, investing, financing sections not captured. Notes would contain lease commitments, related-party detail, tax detail, commitments/contingencies. Recommended retry: read ~pages 61–70 for cash flow statement and key notes. **Priority: MEDIUM** — enough for basic diligence is already in the IS/BS, but cash flow provides leverage/liquidity color.

3. **Item 20 Table 3 — Status of Franchised Outlets by state.** State-level granular roll-up not normalized. **Priority: LOW** — totals (franchised end-2024 = 12,887) already captured; state-level detail is mostly used for secondary state-heatmap features.

4. **Exhibit S — list of 113 departed franchisees.** Count and existence captured but no individual entries. **Priority: LOW** — names are PII; only count is relevant for diligence.

5. **Item 2 — Business Experience.** Officer start dates not normalized. **Priority: LOW** — minor structural field.

## Omissions to explicitly not retry

- Full Exhibit R (franchised list): PII-like; not diligence-relevant.
- Individual footnotes on officers (Item 2): not material to the 12-layer decision framework.
- Exhibit O / P / Q detailed content: reference-only.

## Audit conclusion

Core diligence-material coverage is **complete or near-complete** for Items 1–23 and Exhibit A (BS+IS). The two substantive remaining gaps are Exhibit T (state addenda) and Exhibit A cash flow statement / notes. Neither is a blocker for a valid canonical publication; both are eligible for targeted Step 7 retries.
