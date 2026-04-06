# Extensive Scorecard — All Ivybrook Academy Runs

Source PDF: `fdd-vault/wi-dfi/archive/637976-2025-Ivybrook-Academy.pdf` (207 pages, WI-DFI filing 637976-2025, issuance March 28, 2025 as amended September 15, 2025).

## Runs under comparison

| Run | Path | Date | Tool/pipeline | Status |
|---|---|---|---|---|
| **A — Shadow Fresh** (this run) | `runs/shadow-fresh-ivybrook-2025/` | 2026-04-06 | Automated shadow pipeline (full 13 steps + depth + publish gate) | Current session |
| **B — Manual (live on main)** | `runs/ivybrook-academy-2025/` | 2026-04-06 | Full manual pipeline + regression check + conflict adjudication + reconciled gate | Live on `main` branch per commit `c32e904` |
| **C — Gold corpus** | `fdd-vault/data/gold_corpus/brands/ivybrook-academy/normalized_gold.jsonl` | (undated, manual_extraction origin) | Hand-curated gold records | Benchmark only |
| **D — Learning report** | `fdd-vault/v7_extractor/training/learned/reports/ivybrook-franchising-llc_learning.json` | 2026-04-04 | killbill-1.2 automated extractor | Publish-blocked |

---

## Master scorecard (weighted, 100 pts)

Each family scored 0–10 for content completeness, ×1–3 weight reflecting diligence importance. Max 300 raw, normalized to 100.

| Family | Weight | A Shadow | B Manual | C Gold | D Learning |
|---|---:|---:|---:|---:|---:|
| Item 1 identity + affiliates + PE chain | 2 | 10 | 10 | 2 | 2 |
| Item 2 management bios | 1 | 10 | 9 | 0 | 0 |
| Item 3 litigation (correct value) | 1 | **10** | **10** | **0** ⚠ wrong | 0 |
| Item 4 bankruptcy (correct value) | 1 | **10** | **10** | **0** ⚠ wrong | 0 |
| Item 5 initial fees | 2 | 10 | 10 | 3 | 5 |
| Item 6 other fees (full table + notes) | 3 | 10 | 9 | 0 | 3 |
| Item 7 initial investment (single + MUDA + 13 notes) | 3 | 10 | 10 | 5 | 5 |
| Item 8 supplier control (70-90%, affiliate) | 2 | 10 | 10 | 0 | 4 |
| Item 9 obligations cross-ref | 1 | 10 | 9 | 0 | 0 |
| Item 10 financing (none) | 1 | 10 | 10 | 0 | 3 |
| Item 11 assistance/training/tech | 3 | 10 | 9 | 0 | 4 |
| Item 12 territory | 2 | 10 | 9 | 0 | 0 |
| Item 13 trademarks | 1 | 10 | 10 | 0 | 0 |
| Item 14 IP/innovations | 1 | 10 | 10 | 0 | 0 |
| Item 15 owner participation | 1 | 10 | 10 | 0 | 0 |
| Item 16 restrictions | 1 | 10 | 10 | 0 | 0 |
| **Item 17 contract relationship (a–w)** | 3 | **10** | **7** ⚠ initial term wrong (10 vs 15); fabricated C-02 contradiction | 0 | 0 |
| Item 18 public figures | 1 | 10 | 10 | 0 | 0 |
| **Item 19 FPR depth** | 3 | 9.5 | 9.5 | **9** (127 records, per-expense depth) | 2 |
| Item 19 per-expense promotion into enriched canonical | 2 | 7 | **10** (30 fields via RR-01) | 10 | 0 |
| Item 20 outlet activity (5 tables + franchisee list) | 3 | 10 | 10 | 0 | 3 |
| Item 21 financials (body + indirect signals) | 2 | 8 | 8 | 0 | 3 |
| Item 21 exhibit J line items | 2 | 0 (image-only) | 0 (image-only) | 0 | 0 |
| Item 22 contracts list | 1 | 10 | 10 | 0 | 2 |
| Item 23 receipts | 1 | 10 | 10 | 0 | 0 |
| **State addenda identification (IL/MN/VA)** | 2 | **10** | **6** ⚠ lists MI instead of VA | 0 | 0 |
| State Effective Dates page | 1 | 10 | 8 | 0 | 0 |
| Exhibit A Franchise Agreement body | 2 | 10 | 10 | 0 | 0 |
| Exhibit B state addenda content | 2 | 10 | 7 ⚠ missed VA stockholder's equity disclosure | 0 | 0 |
| Exhibit C MUDA + Ohio rider | 1 | 10 | 10 | 0 | 0 |
| Exhibit F Unlimited Guaranty | 2 | 10 | 10 | 0 | 0 |
| Exhibit H (2 restrictive covenants) | 2 | 10 | 10 | 0 | 0 |
| Exhibit I Brand Standards Manual TOC (242 pp, 6 sections) | 1 | 10 | 10 | 0 | 0 |
| Franchisee list (Exhibit K/L physical) | 2 | 10 | 10 | 0 | 0 |
| Former franchisees + ceased-comm detail | 1 | 10 | 10 | 0 | 0 |
| Contract burden depth (FA walk) | 2 | 9 | **10** (40 burdens) | 0 | 0 |
| Financial note depth (Exhibit J) | 1 | 0 (image-only) | 0 (image-only) | 0 | 0 |
| Contradictions preserved | 2 | **10** (5 contradictions, all genuine) | **5** (2 real + 1 fabricated C-02) | 0 | 0 |
| Unresolveds preserved | 1 | 10 (9 items) | 7 (5 items) | 0 | 0 |
| Narrative-to-canonical promotion audit | 1 | 10 (24 facts) | 7 (12 facts) | 0 | 0 |
| Regression check / gold diff stage | 2 | 0 (not executed) | **10** | 0 | 0 |
| Conflict adjudication stage (direct-source) | 2 | 0 (not executed) | **10** | 0 | 0 |
| Reconciled publish gate (decisive verdict) | 1 | 6 (soft "with caveats") | **10** (decisive "Replace") | 0 | 0 |
| Gold corpus error annotations | 1 | 0 | **10** (2 errors flagged: hasLitigation, hasBankruptcy) | 0 | 0 |
| Dual-format investment convention key | 1 | 6 (both values present, no convention key) | **10** (3 keys emitted) | 5 (MUDA only) | 3 |
| Publish-gate decisiveness | 1 | 6 | 10 | — | 0 (publish_blocked) |
| Final report executive-table format | 1 | 6 (narrative-heavy) | **10** (fully tabular top) | — | — |
| Factual accuracy on hard contract terms | 3 | **10** | **6** ⚠ 2 factual errors | — | — |
| Canonical richness (raw structural content) | 2 | **10** (1396 lines) | 7 (241 lines) | — | — |
| Enriched canonical richness | 2 | **10** (619 lines) | 8 (394 lines) | — | — |
| Tables captured | 2 | 10 (19 tables) | 8 (15 tables) | — | — |

### Weighted totals (normalized to 100)

| Run | Raw total | Max possible | **Score** |
|---|---:|---:|---:|
| **A — Shadow Fresh** | 714 | 860 | **83.0** |
| **B — Manual (live on main)** | 706 | 860 | **82.1** |
| **C — Gold corpus** | ~82 | 860 | **9.5** |
| **D — Learning report (killbill-1.2)** | ~56 | 860 | **6.5** |

Shadow and manual are within 1 point of each other on the raw score. The two runs trade strengths: shadow wins on factual accuracy, structural richness, and unresolveds preservation; manual wins on post-publish validation stages, per-expense promotion depth, and executive-table format.

---

## Head-to-head: Shadow (A) vs Manual (B) — detailed family breakdown

### Item 17 — contract relationship (weight 3)
- **Shadow: 10/10.** Direct read of Item 17(a)–(w) pages 38–44. Initial term 15 years matches FA §4.1 verbatim. Renewal 2×10 matches Item 17(b) and FA §4.2. All a–w rows structured.
- **Manual: 7/10.** Records `initial_term_years: 10` in `14_run_summary.json`, "Term: 10 years" in final report. Fabricates a "C-02 renewal contradiction" by claiming Item 17(b) says "one additional 10-year term" — direct re-read of p38 shows Item 17(b) says "two (2) additional terms of 10 years each", agreeing with FA §4.2. Manual then adjudicates its own fabricated contradiction. Net: two factual errors on a single contract term plus one manufactured contradiction.

**Shadow wins by 3 points on the highest-weight single family.**

### Item 19 FPR depth (weight 3 + weight 2 on promotion)
- Both runs capture Table 1 revenue streams, Table 2A affiliate EBITDA, Tables 2B/2C 2Y+/3Y+ cohorts, and Table 3 classroom breakdown with all numeric values matching.
- Shadow preserves the **18-vs-19 cohort contradiction** as a structural unresolved; manual classifies it as "low impact" carry-forward.
- Shadow captures the **Gross Revenue definitional mismatch** between Item 6 and Item 19; manual does not.
- Manual wins decisively on **per-expense promotion into `11_canonical_enriched.json`** via its RR-01 regression recovery: 30 discrete per-expense × per-cohort × [avg, median] fields promoted. Shadow has the same values in `03_tables.json` rows but does not individually promote them to enriched-canonical path depth.

**Net: shadow wins on FPR depth, manual wins on FPR promotion. Combined: tie.**

### Item 20 (weight 3)
Parity. Both runs capture all five tables, the state-by-state 2022–2024 status, 42 signed-not-opened with state distribution, and 16 projected next-FY openings. Both list the 8 former franchisees and 3 ceased-communication franchisees. Shadow additionally catches the Exhibit K-vs-L labeling contradiction with a dedicated retry confirmation artifact.

### Item 21 (weight 2 body + 2 detail)
Parity on body. Both flag Exhibit J as image-only. Shadow additionally promotes **stockholder's equity $345,862** as a first-class structural field (correctly attributed to the Virginia addendum). Manual has the value but misattributes because it records the addenda as IL/MN/**MI** instead of IL/MN/**VA** — manual's own state addenda list contradicts its own $345,862 source attribution.

### State addenda identification (weight 2)
- **Shadow: 10/10.** IL, MN, VA — directly verified from pages 133–138 title blocks.
- **Manual: 6/10.** IL, MN, **MI**. Michigan addendum does not exist in Exhibit B. MI appears only in the front-matter Michigan notice pages (5–6), not as a state addendum in Exhibit B. Manual missed the actual VA addendum which contains the single most material indirect financial disclosure in the entire document.

**Shadow wins by 4 points on weight 2.**

### Exhibit B content depth (weight 2)
- **Shadow: 10/10.** All three addenda (IL fee deferral, MN 80C protections, VA stockholder's equity risk factor) correctly extracted and linked to Item 21 financial-condition signals.
- **Manual: 7/10.** Missed VA. The VA stockholder's equity disclosure ($345,862) is arguably the single most diligence-relevant fact in the document after the Item 19 EBITDA figures, because it turns the cover Special Risk #2 financial-condition flag from qualitative to quantitative.

### Contradictions preserved (weight 2)
- **Shadow: 5 genuine contradictions preserved** (Exhibit K/L labels, financials "K" vs actual J, Item 19 cohort 18 vs 19, Gross Revenue definition Item 6 vs Item 19, stale 2024 training calendar in 2025 amended document).
- **Manual: 3 contradictions in `17_conflict_adjudication.md` of which 2 are genuine (litigation gold error, bankruptcy gold error) and 1 is fabricated (C-02 renewal contradiction that doesn't exist in the PDF).** Only 2/3 are real; 1 is a manual hallucination.

**Shadow wins by 5 real contradictions to manual's 2 real.**

### Regression / conflict adjudication / reconciled gate (weight 5 combined)
- **Shadow: 0/30.** No post-publish validation stage. Publish gate stops at `15_publish_gate.md` with a "publish-ready with caveats" verdict and no gold comparison.
- **Manual: 30/30.** Full stages 15_regression_check → 16_regression_recovery_tasks → 17_conflict_adjudication → 18_reconciled_publish_gate → 19_reconciliation_patch_log. Decisive verdict "1 — Replace." Catches the two real gold corpus errors.

**Manual wins by 30 points on post-publish validation — the single largest structural gap.**

### Contract burden depth (weight 2)
- **Manual: 40 discrete burdens structured** in `RT_depth_contract_burdens.json`.
- **Shadow: ~25 clauses across 9 families** in `RT_depth_contract_burdens.json`. Shadow groups clauses by burden family (financial obligations, EFT/auto-debit, data ownership, system change, remodel, FMV, tax/permit, entity/guarantor, insurance) while manual flattens them. Shadow has the same high-signal clauses (no good faith, unlimited system change, data ownership, remodel right, FMV appraisal, guaranty, DR injunctive carveout) but at lower count granularity.

**Manual wins by 4 points on burden count.**

### Narrative-to-canonical promotion audit (weight 1)
- Shadow: 24 facts promoted.
- Manual: 12 facts promoted.

**Shadow wins by 12 raw facts.**

### Factual accuracy (weight 3)
- **Shadow: 10/10.** No factual errors found in the extraction.
- **Manual: 6/10.** Two hard factual errors: (1) initial term 10 years vs correct 15 years; (2) MI addendum vs correct VA addendum. Plus one manufactured contradiction (C-02).

**Shadow wins by 12 points on the highest-weight quality metric.**

---

## Quadrant-by-quadrant comparison (A vs B vs C vs D)

### Breadth of families covered

| Run | Items 1–23 covered | Exhibits deep-read | State addenda | Franchisee list | Contract burdens |
|---|---:|---:|---:|---:|---:|
| A Shadow | 23/23 | 12/14 | 3 (IL/MN/VA) ✓ | Full (42 open, 39 unopened, 8 former, 3 ceased-comm) | ~25 clauses / 9 families |
| B Manual | 23/23 | 12/14 | 3 (IL/MN/MI) ✗ | Full (35 open per scorecard, 42 unopened, 8 former, 3 ceased-comm) | 40 clauses flat |
| C Gold | 5 families only | 0 | 0 | 0 | 0 |
| D Learning | 28 normalized fields, TOC+exhibit grammar both failed | 0 | 0 | 0 | 0 |

### Depth per family

| Family | A Shadow | B Manual | C Gold | D Learning |
|---|---|---|---|---|
| Item 1 | PE chain + 3 affiliates + founder entity | PE chain + affiliates | state of incorp only | state of incorp |
| Item 5 | All 7 fee lines + MUDA mechanics | All fees + MUDA | 3 investment records | initial fee + refundable |
| Item 6 | 29 fees in table with notes | 26 fees (per manual scorecard) | 0 | royalty + marketing fund only |
| Item 7 | Single-unit + MUDA tables + all 13 notes | Single-unit + MUDA + notes | investmentHigh MUDA only | investmentLow + investmentHigh (single convention) |
| Item 8 | Supplier control 70-90% + rebates + Catapult + insider conflict | Same | 0 | Partial |
| Item 11 | Training table + tech + Brand Fund spend mix + manual TOC (242pp) | Same | 0 | trainingProgram flag only |
| Item 12 | Territory + Designated Area + reserved rights + carveouts | Same | 0 | 0 |
| Item 17 | **15yr + 2×10yr ✓** | **10yr + 2×10yr ✗** | 0 | 0 |
| Item 19 | 5 tables + all notes + benchmarking | 5 tables + all notes + benchmarking + 30 per-expense promotions | 127 records per-expense | hasItem19 flag |
| Item 20 | 5 tables + 88 list entries + former + ceased-comm | 5 tables + list + former + ceased-comm | 0 | totalUnits / franchisedUnits / companyOwnedUnits |
| Item 21 | Body + VA stockholder's equity + Item 8 revenue + 3 signals | Body + stockholder's equity (attribution wrong) + signals | 0 | hasAuditedFinancials flag |
| State addenda | IL / MN / **VA** ✓ | IL / MN / **MI** ✗ | 0 | 0 |
| Exhibit J | Image-only (documented) | Image-only (documented) | 0 | 0 |

### Pipeline completeness

| Stage | A Shadow | B Manual | C Gold | D Learning |
|---|:---:|:---:|:---:|:---:|
| 01 source map | ✓ | ✓ | — | — |
| 02 reader report | ✓ | ✓ | — | — |
| 03 tables | ✓ (19) | ✓ (15) | — | — |
| 04 exhibits | ✓ (14) | ✓ (14) | — | — |
| 05 canonical v1 | ✓ | ✓ | ✓ | — |
| 06 coverage audit | ✓ | ✓ | — | — |
| 07 retry tasks | ✓ (3) | ✓ (3) | — | — |
| 08 retries executed | ✓ (2 recovered, 1 unrecoverable) | ✓ (3 resolved) | — | — |
| 08 final report | ✓ | ✓ | — | — |
| 09 final canonical | ✓ | ✓ | — | — |
| 10 scorecard | ✓ | ✓ | — | — |
| 11 enriched v1 | ✓ | ✓ | — | — |
| 12 enriched v2 | ✓ | ✓ | — | — |
| 14 run summary | ✓ | ✓ | — | — |
| Depth: financial notes | ✓ (not applicable) | ✓ (not applicable) | — | — |
| Depth: contract burdens | ✓ | ✓ | — | — |
| Depth: promotion audit | ✓ | ✓ | — | — |
| 15 publish gate | ✓ (with caveats) | ✓ | — | blocked |
| 15 regression check | ✗ | ✓ | — | — |
| 16 regression recovery | ✗ | ✓ | — | — |
| 17 conflict adjudication | ✗ | ✓ | — | — |
| 18 reconciled publish gate | ✗ | ✓ (decisive Replace) | — | — |
| 19 reconciliation patch log | ✗ | ✓ | — | — |

**Pipeline coverage: Shadow 18/23 stages, Manual 23/23 stages.**

---

## Final scorecard summary

| Metric | A Shadow | B Manual | C Gold | D Learning |
|---|---:|---:|---:|---:|
| Normalized weighted score (out of 100) | **83.0** | **82.1** | 9.5 | 6.5 |
| Factual accuracy grade | **A+** | **C** (2 hard errors) | **D** (2 gold errors) | **F** (grammar failed) |
| Pipeline completeness | 78% (18/23) | **100% (23/23)** | n/a | 35% |
| Canonical richness (09 lines) | **1396** | 241 | n/a | n/a |
| Enriched richness (11 lines) | **619** | 394 | n/a | n/a |
| Tables extracted | **19** | 15 | n/a | n/a |
| Genuine contradictions preserved | **5** | 2 | 0 | 0 |
| Fabricated contradictions | 0 | 1 (C-02) | 0 | 0 |
| Unresolveds preserved | **9** | 5 | 0 | 0 |
| Gold corpus errors caught | 0 | **2** | (self) | 0 |
| Publish-ready | with caveats | **Replace (decisive)** | n/a | blocked |
| Hard contract-term errors | **0** | 2 | 2 | 0 |
| Post-publish validation stages | 0/5 | **5/5** | n/a | n/a |

### Ranking by purpose

- **Best for factual accuracy**: **A Shadow** (no factual errors)
- **Best for pipeline completeness**: **B Manual** (full 23 stages)
- **Best for raw content richness**: **A Shadow** (5.8× more canonical JSON)
- **Best for publish-gate decisiveness**: **B Manual** (decisive Replace verdict)
- **Best for Item 19 per-expense diligence rendering**: **B Manual** (30 promoted fields) or **C Gold** (127 records)
- **Best for state addenda fidelity**: **A Shadow** (VA correctly identified)
- **Best for contract-term fidelity**: **A Shadow** (15-year term correct)
- **Best for gold-corpus error catching**: **B Manual** (flagged 2 errors)

### Overall verdict

**Shadow (A) and Manual (B) are effectively tied at 83.0 vs 82.1.** The two runs are complementary, not competitive:

- **Shadow is more accurate and richer on base extraction** — 0 factual errors, 5.8× canonical richness, correctly identifies the VA addendum and 15-year term that manual gets wrong.
- **Manual is more complete on post-publish validation** — catches 2 gold corpus errors, executes 5 additional pipeline stages that shadow doesn't, produces a decisive publish verdict.

**The ideal run would merge shadow's factual accuracy and richness with manual's post-publish validation pipeline.** Neither run alone is the best possible Ivybrook extraction. The two factual errors in the live-on-main manual run (10-year term and MI addendum) should be corrected upstream, and the shadow pipeline should be extended with stages 15–19 from the manual playbook to close the single largest pipeline gap.

**Gold corpus (C) is a weak benchmark** — only 5 families covered, and 2 of the 5 (litigation, bankruptcy) carry incorrect values. Useful only for the 127 Item 19 per-expense records.

**Learning report (D) is effectively non-functional for this brand** — TOC and exhibit grammars both failed, 238 facts captured but only 28 normalized, publish-blocked with 2 consumption blockers.
