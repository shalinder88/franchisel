# Coverage Audit: Rytech Franchising, Inc. (637915-2025)

## Item-by-Item Coverage

| Item | Status | Notes |
|------|--------|-------|
| 1 | COMPLETE | Entity structure, parent, affiliates, agent, business description |
| 2 | COMPLETE | 10 officers/directors with full experience |
| 3 | COMPLETE | None disclosed |
| 4 | COMPLETE | None disclosed |
| 5 | COMPLETE | Fee structure with population-based pricing, veterans discount, expansion fee |
| 6 | COMPLETE | 18+ fee categories extracted with 14 footnotes. Contradictions flagged. |
| 7 | COMPLETE | 16 line items, $166,500-$258,100, all footnotes extracted |
| 8 | COMPLETE | Supplier restrictions, tech stack, IICRC, insurance requirements |
| 9 | COMPLETE | Cross-reference table (25 categories) |
| 10 | COMPLETE | No financing |
| 11 | COMPLETE | Pre/post-opening assistance, training program (hours/subjects), advertising, computer systems |
| 12 | COMPLETE | Territory definition, encroachment risks, work restrictions |
| 13 | COMPLETE | 5 registered marks with registration details |
| 14 | COMPLETE | No patents; copyright on manual |
| 15 | COMPLETE | Majority time required; personal guaranty; spousal consent |
| 16 | COMPLETE | Must offer only approved goods/services |
| 17 | COMPLETE | 23-row table with term, renewal, termination, transfer, noncompete, dispute resolution |
| 18 | COMPLETE | None |
| 19 | COMPLETE | 5-year gross revenue table with all fields |
| 20 | COMPLETE | All 5 standard tables; gag clause status; franchisee list reference |
| 21 | COMPLETE | Audited financials read from rendered images (3 years, all statements) |
| 22 | COMPLETE | Contract list with 5 exhibits identified |
| 23 | COMPLETE | Receipts reference |

## Exhibit Coverage

| Exhibit | Status | Notes |
|---------|--------|-------|
| A | COMPLETE | State administrators |
| B | COMPLETE | Agents for service |
| C | PARTIAL | Franchise agreement identified and key terms extracted through Item 17 table. Clause-by-clause deep read deferred to A2 depth pass. |
| D | PARTIAL | 9 states identified. California fully read. Other states identified by header. Structured extraction deferred to A2 depth pass. |
| E | COMPLETE | 92 franchised locations cataloged |
| F | COMPLETE | Former franchisees cataloged |
| G | COMPLETE | All financial statements read from rendered images |
| H | COMPLETE | Confidentiality agreement identified |
| I | COMPLETE | Guarantee agreement identified — personal guaranty, punitive damages waiver, class action waiver |
| J | COMPLETE | General release — two forms identified |
| K | COMPLETE | NDA identified; naming discrepancy with Item 22 flagged |
| L | COMPLETE | State effective dates |
| M | COMPLETE | Receipts |

## Contradictions Found

1. **Renewal fee discrepancy**: Item 6 fee table (page 11) says "15% of then current Initial Franchise Fee." Note 7 (page 14) says "10% of our then-current Initial Franchise Fee." Item 17 table (page 32) says "15%." The two sources disagree.

2. **Territory intrusion fee discrepancy**: First entry in Item 6 table (page 11) says "Up to 50% of revenue earned from violating Territory Policy." Second entry (page 12) says "Amount equal to 75% of the total invoiced price for the services performed." These appear to describe different scenarios but the distinction is unclear.

3. **National Ad Fund maximum discrepancy**: Item 6 table (page 10) says "May be increased to a maximum of 3% of Gross Revenues." Note 3 (page 13) says "The maximum amount you will be required to pay into the National Fund is 2% of your Monthly Gross Revenues." Then later: "The maximum monthly contribution is 3% of gross revenues." The note contradicts itself internally.

4. **Exhibit K naming**: Item 22 (page 42) calls Exhibit K "SBA Addendum" but the exhibit itself (page 190) is titled "Prospective Franchisee Non-Disclosure Agreement."

## Omissions / Gaps

1. **Franchise Agreement clause-by-clause burden analysis**: Not yet performed. Key clauses identified through Item 17 table but agreement is 70+ pages. → Deferred to A2 depth pass.

2. **State addenda structured extraction**: 9 states identified; California fully read. Remaining 8 states only headers captured. → Deferred to A2 depth pass.

3. **Financial statement notes detail**: Notes read from rendered images. Some detail may be approximate. → Deferred to A2 depth pass.

4. **Item 19 cost build-up**: Not disclosed in FDD (gross revenue only). This is a known limitation of the FDD, not an extraction gap.

## Unresolveds

1. **Renewal fee**: 10% vs 15% — cannot be resolved from FDD text alone. Both figures appear in the document. Severity: **medium** (affects renewal economics).

2. **Territory intrusion fee scope**: 50% vs 75% — may represent different violation types but the FDD does not clearly distinguish them. Severity: **low** (applies only to policy violations).

3. **National Ad Fund max**: 2% vs 3% — the note itself is inconsistent. Severity: **medium** (affects ongoing cost projections).

4. **Exhibit K identity**: Naming mismatch between Item 22 and actual exhibit. Severity: **low** (cosmetic/administrative).

5. **Financial statement precision**: Some values read from scanned images may have minor inaccuracies. Severity: **low** (key figures are clear; minor line items may be +/- small amounts).
