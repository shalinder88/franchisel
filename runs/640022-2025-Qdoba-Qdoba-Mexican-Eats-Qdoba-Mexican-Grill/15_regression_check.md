# 15 Regression Check — Qdoba (640022-2025)

**Current run:** `640022-2025-Qdoba-Qdoba-Mexican-Eats-Qdoba-Mexican-Grill/`
**Prior strongest run:** `qdoba-2025/`
**Same PDF:** Yes (640022-2025-Qdoba-Qdoba-Mexican-Eats-Qdoba-Mexican-Grill.pdf, 437 pages)

---

## Metric Comparison

| Metric | Prior | Current | Delta | Regression? |
|--------|-------|---------|-------|-------------|
| tables_count | 12 | 14 | +2 | No |
| table_rows_count | 227 | 130 | **-97** | **YES** |
| table_notes_count | 44 | 22 | **-22** | **YES** |
| evidence_grounded_fields_count | — | 120 | — | Cannot compare (prior used different metric) |
| exhibits_mapped_count | — | 16 | — | Current has exhibit map; prior did not have 04_exhibits.json |
| exhibits_deep_read_count | — | 4 | — | Current has 4 deep-reads; prior had retries but no explicit count |
| state_addenda_count | 10 | 11 | +1 | No (current added Virginia) |
| litigation_count | 2 | 2 | 0 | No |
| canonical top-level keys | 23 | 24 | +1 | No (different schemas) |
| enriched_v2 char count | 109,160 | 38,463 | **-70,697** | **YES** |
| enriched_v2 top-level keys | 32 | 32 | 0 | No (different key names) |
| unresolved_count | 10 | 4 | -6 | No |
| contradictions_count | 1 | 1 | 0 | No |

---

## A. Stronger in Current Run

1. **Exhibit mapping (04_exhibits.json):** 16 exhibits formally mapped with page ranges, priorities, categories, and deep-read flags. Prior run had no equivalent file.
2. **Franchisee list (13_franchisee_list.json):** Structured extraction with current locations, former franchisees, closures, signed-not-opened, and concentration signals. Prior run had no equivalent.
3. **State addenda:** 11 states (added Virginia) with provision-level overrides in `10_retry_state_addenda.md`. Prior run had 10 states.
4. **Qdoba Corp financial line items:** Full balance sheet, income statement, equity, and cash flow from the readable Qdoba Corp statements (pages 100-103). Prior run focused only on the CID-decoded Funding Holdco entity.
5. **Technology agreement deep read (12_digital_services.md):** Full Exhibit K extraction with fee structure, data rights, modification rights, and risk factors. Prior run did not deep-read Exhibit K.
6. **Training Table B (Manager in Training):** Current run has Table B (11 rows). Prior run only had Table A.
7. **Item 9 obligations table:** Current run has full 20-row cross-reference. Prior run did not extract this.
8. **Publish gate assessment:** Formal publish-readiness gate not present in prior run.

## B. Stronger in Previous Run

1. **Item 6 fee table depth:** Prior had 33 rows (every fee line item). Current has 18 rows (summarized). **Loss: 15 fee rows including granular timing and condition details.**
2. **Item 7 non-traditional investment table:** Prior had full 15-row line-item table for non-traditional. Current has total range only. **Loss: non-traditional line-item breakdown.**
3. **Item 19 table notes:** Prior had 19 notes across 3 charts (4+3+12). Current has 11 (1+1+9). **Loss: 8 footnotes including sample-definition detail.**
4. **Item 20 Table 2 (transfers):** Prior had 21 rows (all state/year combinations). Current has 6 rows (summary). **Loss: 15 state-year transfer rows.**
5. **Item 20 Table 5 (projected openings):** Prior had 36 rows (every state). Current has 1 row (totals only). **Loss: 35 state-level projection rows.**
6. **Item 13 trademarks table:** Prior had 6-row registration table. Current mentions trademarks in reader report but no structured table. **Loss: trademark registration table.**
7. **Training Table A depth:** Prior had 22 rows (every individual subject). Current has 14 rows (some subjects aggregated). **Loss: 8 granular training subject rows.**
8. **Noncompete with state overrides:** Prior had structured noncompete object with 5 state-specific override entries. Current has noncompete in contract_terms but without structured state overrides at the canonical level.
9. **Forum state overrides:** Prior had 6 structured state override entries for dispute forum. Current notes overrides in state addenda file but not as structured canonical fields.
10. **Supplier control economics:** Prior had 6 fields (supply chain fee/case, total fee, QRC revenue $50.8M, 13.2%, required purchase percentages 50-90%/~40%). Current says "no revenue received" — **factually wrong** (it paraphrased a general statement but missed the supply chain fee, customer fund fee, and QRC revenue disclosures later in Item 8).
11. **Tech burden detail:** Prior had POS cost ($24K-$35K), annual maintenance (<$17K), upgrade frequency (none), data access (independent). Current has technology fee but not these specific cost estimates.
12. **Item 21 Funding Holdco decoded financials:** Prior decoded full balance sheet (17 fields), income statement (13 fields), cash flows (5 fields), and key ratios (3 fields) via CID font mapping. Current has these via merged `retry_item21.md` file but not integrated into the canonical JSON.
13. **Item 18 public figure:** Prior correctly stated `false` — no public figure used. Current **incorrectly** states John Cywinski is a public figure. **Factual error.**

## C. Material Regressions in Current Run

| # | Regression | Severity | Impact |
|---|-----------|----------|--------|
| **R1** | **Noncompete radius: current says 10 miles, actual FDD says 5 miles** | **CRITICAL** | Misrepresents a core legal term. Would mislead a buyer about post-term operating freedom. |
| **R2** | **Transfer fee: current says $25,000, actual FDD says up to $5,000** | **CRITICAL** | 5x overstatement of a key economic term. Would mislead on transfer economics. |
| **R3** | **Item 18: current says public figure (Cywinski), FDD says none** | **HIGH** | Factual error. Item 18 explicitly states no public figure is used. |
| **R4** | **Dispute resolution: current says binding arbitration, FDD says nonbinding mediation + litigation** | **HIGH** | Misrepresents the dispute mechanism. Mediation is nonbinding; litigation (not arbitration) follows in San Diego. |
| **R5** | **Supplier control: current says "no revenue received," prior correctly identified $50.8M / 13.2%** | **HIGH** | Omits material supplier economics. QRC receives supply chain fees, customer fund fees, and supplier rebates. |
| **R6** | Item 6 fee table: 33 rows → 18 rows | MEDIUM | Loss of granular fee conditions. Key fees present but some details lost. |
| **R7** | Item 7 non-traditional table: 15 rows → range only | MEDIUM | Non-traditional operators cannot assess line-item costs. |
| **R8** | Item 20 Tables 2, 5 row depth loss | MEDIUM | State-level transfer and projection data lost. |
| **R9** | Enriched canonical depth: 109K → 38K chars | MEDIUM | Significantly less structured data for downstream consumers. |
| **R10** | Noncompete, forum, supplier state overrides not in canonical structure | MEDIUM | State-level legal nuances present in addenda file but not in machine-readable canonical. |

## D. Must-Fix Regressions Before Publish

1. **R1 — Noncompete radius:** Must correct from 10 miles to 5 miles across all files. Source: Item 17, page 53.
2. **R2 — Transfer fee:** Must correct from $25,000 to up to $5,000 across all files. Source: Item 6 fee table, page 20.
3. **R3 — Item 18 public figure:** Must correct to "no public figure used." Source: Item 18, page 58.
4. **R4 — Dispute resolution:** Must correct from "binding arbitration" to "nonbinding mediation, then litigation in San Diego, CA." Source: Item 17, page 53.
5. **R5 — Supplier control economics:** Must add supply chain fee ($0.25/case, $1.3M total), customer fund fee ($0.03/case), QRC revenue from franchisees ($50.8M, 13.2%), and required purchase estimates (50-90% establishing, ~40% operating). Source: Item 8, page 30.

## E. Conflict Fields Requiring Source Adjudication

| # | Field | Prior Run Value | Current Run Value | Needs Adjudication |
|---|-------|----------------|-------------------|-------------------|
| 1 | noncompete_post_term_miles | 5 miles | 10 miles | **YES — prior correct** |
| 2 | transfer_fee | up to $5,000 | $25,000 | **YES — prior correct** |
| 3 | item18_public_figure | false (no public figure) | true (Cywinski) | **YES — prior correct** |
| 4 | dispute_resolution | nonbinding mediation + litigation | binding arbitration (JAMS) | **YES — prior correct** |
| 5 | supplier_revenue_from_franchisees | $50,845,000 (13.2%) | "No revenue received" | **YES — prior correct** |
| 6 | mandatory_arbitration | false | implied true | **YES — prior correct** |
| 7 | mandatory_mediation | true | not stated separately | **YES — prior correct** |
| 8 | vetfran_discount | $10,000 | not extracted | Prior had it; current missed it |
| 9 | item6_fee_rows | 33 | 18 | Prior richer, both correct |
| 10 | item21_funding_holdco_financials | Decoded (17 BS + 13 IS fields) | Merged file but not in canonical | Prior structurally richer |
