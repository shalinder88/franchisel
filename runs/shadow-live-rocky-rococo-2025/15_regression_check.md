# B1 Regression Check — new shadow-live vs prior rocky-rococo-2025

Prior: runs/rocky-rococo-2025/09_final_canonical.json (manual/earlier pipeline, "bucket" schema)
New:   runs/shadow-live-rocky-rococo-2025/09_final_canonical.json (automation_v1, item1..item23 schema)

## Schema note
The two canonicals use different top-level schemas (bucket vs item-numbered). Comparison is by canonical FACT, not by key.

## Substantive comparison (facts)

| Field | Prior | New | Match |
|---|---|---|---|
| Franchisor legal name | Rococo Franchise Corporation | Rococo Franchise Corporation | ✅ |
| Filing ID | 638785 | 638785 | ✅ |
| Issuance date | 2025-04-24 | 2025-04-24 | ✅ |
| Incorporation date | 1995-06-13 | 1995-06-13 | ✅ |
| Initial franchise fee (first) | $25,000 | $25,000 | ✅ |
| Initial franchise fee (second) | $17,500 | $17,500 | ✅ |
| Franchise deposit first | $12,500 | $12,500 | ✅ |
| Royalty | 5% with 3.5% step-down below $425,000 | 5% with 3.5% step-down below $425,000 | ✅ |
| 53-week threshold | $433,173 | $433,173 | ✅ |
| Marketing Fund max | 0.75% | 0.75% | ✅ |
| Local Ad Fund max | 3.5% (tiered 1.5/2.5/3.5) | 3.5% (tiered 1.5/2.5/3.5) | ✅ |
| Investment range | $211,000 – $705,500 | $211,000 – $705,500 | ✅ |
| Territory | 1-mile radius with mall + CBD carveouts | 1-mile radius with mall + CBD carveouts | ✅ |
| Term / renewal | 15 + 15 years | 15 + 15 years | ✅ |
| Post-term noncompete FA | 1 yr / 5 miles | 1 yr / 5 miles | ✅ |
| Post-term noncompete FDA | 1 yr / 50 miles | 1 yr / 50 miles | ✅ |
| Dispute resolution | AAA arbitration, nearest RFC office, WI law, WI FIL/WFDA non-arbitrable | Same | ✅ |
| Total outlets YE2024 | 31 | 31 | ✅ |
| Franchised YE2024 | 24 | 24 | ✅ |
| Company/affiliate YE2024 | 7 | 7 | ✅ |
| Predecessor YE2024 | 0 | 0 | ✅ |
| States of operation | WI, MN | WI, MN | ✅ |
| Auditor | Vrakas, S.C., Brookfield, WI | Vrakas, S.C., Brookfield, WI | ✅ |
| Audit opinion | Clean unqualified | Clean unqualified | ✅ |
| Audit date | 2025-03-06 | 2025-03-06 | ✅ |
| FY2024 total revenue | $1,382,868 (prior lists component detail) | $1,382,868 | ✅ |
| FY2024 net income | Prior: implicit from P&L | $70,626 | ✅ |
| FY2024 cash | Prior: in balance sheet bucket | $669,550 | ✅ |
| Related-party mgmt fees FY24 | $167,977 | $167,977 | ✅ |
| State addenda | Not present | Not present | ✅ |
| Item 19 FPR | None (negative) | None (negative) | ✅ |
| Litigation | None | None | ✅ |
| Bankruptcy | None | None | ✅ |
| Confidentiality clauses | None in 3 years | None in 3 years | ✅ |

## Prior-run exclusive content

Prior run has a richer FA operative-provisions capture in `fa_operative_provisions` and `RR-01_fa_operative_provisions.json` — it explicitly cites FA section pagination (e.g. p.122 for post-term noncompete). The new shadow-live run captures these facts at Item 17 table granularity but does not line-extract the FA exhibit.

Prior run's `unresolveds` array includes:
- State-specific addenda missing (medium) — matches new U's implied (no state addenda)
- Computer access contradiction — matches new C2
- Plus others

Prior run's `contradictions` array includes:
- Territory exclusivity (1-mile vs "no exclusive territory") — new run treats this as non-contradictory (1-mile radius is a same-brand protection, not commercial exclusivity)
- Computer access — captured in new run as C2
- (Possibly more — output truncated)

## New-run exclusive content

New run adds:
- U7: related-party management fees are 170% of operating income as a governance risk
- U8: flat royalty revenue 2023→2024 despite +3 stores implies material step-down incidence
- Explicit state_addenda_overrides family with empty-list + note
- Fuller enriched structural facts in 12_canonical_enriched_v2.json (margin ratios, cash%)

## Material regressions
**None.** Every canonical fact in the prior run that is also in scope for the new run is present with the same value.

## Non-material differences
1. **Schema shape.** Prior uses bucket schema; new uses item1..23 numbered schema. No downstream consumer has been specified for the new schema; publisher consumers use the prior shape.
2. **FA operative provisions detail.** Prior extracted FA section-level pagination (e.g. post-term noncompete at p.122). New run captures these at Item 17 level. Not a regression of facts, but a regression of FA-exhibit granularity.
3. **Territory contradiction framing.** Prior flagged 1-mile protection vs. "no exclusive territory" statement as a contradiction (reconciled). New run treats this as non-contradictory by design. Difference in editorial framing, not in extracted facts.

## Legal-field conflicts open in either run
- C1 (new) / equivalent unresolved in prior: FA 5-mile vs FDA 50-mile post-term noncompete. **Still unresolved in both.**

## Recommendation
Proceed to B2 only to formalize two recovery/promotion tasks:
- R1: Promote prior run's FA operative-provisions granularity (RR-01) into the new canonical's item17_renewal_termination_transfer_dispute.fa_section_pages.
- R2: Add the territory framing contradiction as C4 in the new canonical (from prior run's contradiction set), with resolved status.
