# Coverage Audit — Boston's The Gourmet Pizza Restaurant & Sports Bar
## Filing ID: 637917-2025

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| 1 | ✅ Complete | Entity structure, parents, predecessors, affiliates, franchise description, market, industry laws |
| 2 | ✅ Complete | 6 individuals with full background |
| 3 | ✅ Complete | 3 actions, all resolved |
| 4 | ✅ Complete | No bankruptcy |
| 5 | ✅ Complete | All fees, refundability, fee deferral states |
| 6 | ✅ Complete | 30+ fee types extracted with amounts, timing, notes |
| 7 | ✅ Complete | Full investment table with 21 line items + area developer table |
| 8 | ✅ Complete | Supplier percentages, rebates, designated vendors, insurance requirements |
| 9 | ✅ Complete | Cross-reference table |
| 10 | ✅ Complete | No financing offered |
| 11 | ✅ Complete | Pre-opening obligations, training program, brand fund, computer system, advertising |
| 12 | ✅ Complete | Territory definition, encroachment provisions, delivery/catering, development territory |
| 13 | ✅ Complete | TPI ownership, trademark license, registrations |
| 14 | ✅ Complete | No patents; copyrights claimed |
| 15 | ✅ Complete | Responsible Owner, Franchise Manager, spousal guarantee |
| 16 | ✅ Complete | Product restrictions, social media prohibition |
| 17 | ✅ Complete | Full table extracted — term, renewal, termination, transfer, noncompete, dispute resolution |
| 18 | ✅ Complete | No public figures |
| 19 | ✅ Complete | All 4 tables with population counts, averages, medians, ranges, notes |
| 20 | ✅ Complete | All 5 standard tables — systemwide, transfers, franchised status, company-owned, projected |
| 21 | ✅ Complete | Auditor identified, all three financial statements extracted, going concern noted, notes read |
| 22 | ✅ Complete | Contract list cross-referenced |
| 23 | ✅ Complete | Receipt information noted |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | ✅ Cataloged | State administrators listed |
| B | ✅ Deep-read | All financial statements rendered and extracted from images |
| C | ⚠️ Cataloged only | Franchise Agreement not clause-by-clause analyzed (deferred to A2) |
| D | ⚠️ Cataloged only | Area Development Agreement not deep-read (deferred to A2) |
| E | ✅ Cataloged | PII-blocked per rules |
| F | ✅ Cataloged | Operations Manual TOC |
| G | ✅ Deep-read | All 16 state addenda read in full |
| H | ⚠️ Cataloged only | Sub-exhibits H-1 through H-8 identified but not deep-read |
| J | ✅ Cataloged | State effective dates |
| K | ✅ Cataloged | Receipts |

## Identified Gaps

1. **Franchise Agreement clause-by-clause analysis** — Exhibit C (66 pages) not yet deep-read. Key burden clauses (termination triggers, cure periods, default definitions, force majeure, insurance detail) need extraction. → A2 Depth Pass 2
2. **State addenda structured overrides** — All 16 states read narratively but not yet structured into override families for canonical. → A2 Depth Pass 4
3. **Financial statement notes detail** — Read from rendered images; some values approximate. Needs verification pass. → A2 Depth Pass 1
4. **Narrative-to-canonical promotion** — Reader report contains facts not yet in canonical JSON. → A2 Depth Pass 3

## Unresolveds

1. **Partners' capital 2023 balance sheet vs. equity statement discrepancy** — Balance sheet appears to show $906,018 but equity rollforward reconciles to $506,018. Image quality issue; cannot confirm without higher resolution. Severity: low (internally consistent on equity statement).
2. **President on leave** — Jeff Melnick on "temporary" leave since January 2025 with no disclosed return date; Sergio Carvallo serving as Interim President from Mexico operations. Organizational stability unclear. Severity: medium.
3. **Going concern + partner distributions** — Partners extracted $800,000 in 2024 despite operating loss. Cash reserves declining. Five states imposed fee deferral. No disclosed plan to address going concern conditions. Severity: high.
4. **Rebate revenue concentration** — Supplier rebates ($979,786) represent 26.3% of total franchisor revenue. If supplier relationships change, this materially impacts franchisor economics. Severity: medium.
5. **Company-owned unit closed** — The sole company-owned restaurant (Florida) closed in 2024. Franchisor now has zero skin-in-the-game operating units. Severity: medium.

## Contradictions

1. **Item 1 vs. Cover Page investment amounts**: Cover page states $85,000 must be paid to franchisor; Item 5 shows $50,000 franchise fee + $15,000 opening assistance + $20,000 marketing = $85,000. Consistent — no contradiction.
2. **No material contradictions identified between FDD sections.**
