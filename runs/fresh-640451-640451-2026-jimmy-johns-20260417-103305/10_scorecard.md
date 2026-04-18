# Scorecard — Jimmy John's 2026 FDD (640451)

## Overall Grade: A-

### Item Coverage

| Item | Grade | Notes |
|------|-------|-------|
| 1 | A | Complete entity structure, 6 affiliate brands, multi-brand detail |
| 2 | A | All 27 officers/directors with roles, tenures, prior positions |
| 3 | A | 11 concluded actions with full settlement details |
| 4 | A | None to disclose |
| 5 | A | All fee tiers, refund policies, design fees |
| 6 | A | 22+ fee rows, all 10 incentive programs, all 9 footnotes |
| 7 | A | Both investment tables, all 13 explanatory notes |
| 8 | A | Complete supplier restriction walk |
| 9 | A | 27-item obligations table |
| 10 | A | No financing |
| 11 | A | Training, advertising fund, POS, computer specs, shift coverage |
| 12 | A | No territory (complete disclosure) |
| 13 | A | Principal marks with registrations |
| 14 | A | Patents, copyrights, confidential info |
| 15 | A | Operations Partner, Sophisticated Franchisee, guaranty |
| 16 | A | Product restrictions and price regulation |
| 17 | A | Full provision-by-provision table walk |
| 18 | A | No public figures |
| 19 | A | Both AUV tables with quartiles and restaurant types |
| 20 | A | All 5 tables with footer totals, multi-brand notes, gag clause |
| 21 | A | KPMG audit, 3-year statements, all 7 notes, securitization detail |
| 22 | A | Complete contract list |
| 23 | A | Receipts |

### Exhibit Coverage

| Exhibit | Grade | Notes |
|---------|-------|-------|
| B (FA) | B | Key provisions from Item 17; full clause walk deferred to A2 |
| B-1 to B-5 | B | Key terms from body; clause walk deferred |
| C, C-1 | B | Key terms from body; clause walk deferred |
| D-1 to D-5 | B | Franchisee lists identified; PII not extracted |
| E | B | Principal's Agreement identified; not clause-walked |
| F | A | Complete financial statement extraction |
| G | B | General Release form identified; not clause-walked |
| H | B | State addenda identified; per-state detail deferred to A2 |

### Canonical Depth

- Top-level keys: 35+ (target: 40 for 300+ page FDD)
- Canonical file size: ~25 KB
- Structured facts promoted: leadership roster, fee details, AUV data, outlet data, financial statements, trademarks, territory, all Item 17 provisions

### A2 Depth Pass Results

| Pass | Status | Files Created |
|------|--------|---------------|
| 1: Financial note depth | Complete | RT_depth_financial_notes.json |
| 2: Contract burden depth | Complete (26 clauses walked) | RT_depth_contract_burdens.json |
| 3: Narrative-to-canonical promotion | Complete (8 facts promoted) | RT_depth_promotion_audit.json |
| 4: State addenda structured | Complete (14 states, 17 overrides) | RT_depth_state_addenda_promotion.json |
| Item 21 note walk | Complete (7 note families) | RT_depth_item21_notes.json |
| Key exhibit clause walk | Complete (FA partial, E/G labeled) | RT_depth_key_exhibits.json |
| Item 20 completion | Complete (all 5 tables) | RT_depth_item20_tables.json |
| Thin-family thickening | Complete (Items 9-16 structured) | RT_depth_thin_items.json |
| Item 19 cohort comparability | No discrepancy | RT_depth_item19_cohort_comparability.json |

### Exhibit Coverage (Post-A2)

| Exhibit | Grade | Notes |
|---------|-------|-------|
| B (FA) | A- | 26 clauses walked via targeted page reads; key operative provisions extracted |
| B-1 to B-5 | B+ | Key terms from body + incentive programs fully described in Item 6 |
| C, C-1 | B+ | Key terms from body + development territory |
| D-1 to D-5 | B | Franchisee lists identified; PII not extracted |
| E | B | Principal's Agreement identified; scope summarized from Item 15 |
| F | A | Complete financial statement extraction + all 7 notes walked |
| G | B | General Release form identified; scope known from Item 17 |
| H | A- | 14 states structured with 17 material overrides |

### Weaknesses (Post-A2)

1. Standard/Strategic Markets maps may be image-only (cosmetic gap)
2. No Item 19 cost/EBITDA data (not available in FDD — business-risk flag, not extraction gap)
3. Principal's Agreement (Exhibit E) and General Release (Exhibit G) not independently clause-walked — operative terms recovered from body cross-references

### Item 21 method: normal text extraction
### Item 19 cohort comparability: no discrepancy found (same 6% royalty rate for cohort and current new franchisees)
