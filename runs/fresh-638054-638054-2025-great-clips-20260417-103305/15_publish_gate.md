# Publish Gate — Great Clips, Inc. (Filing 638054)

## Verdict: **2 — Publish with caveats**

### Rationale
This extraction is comprehensive and substantive across all 23 FDD items, with robust Item 19 data (4 tables), complete Item 20 outlet data (5 tables with state-level detail), thorough Item 21 financial statement extraction (all statements + 11 note families), and structured state addenda overrides across 11 states. The franchise agreement has been clause-walked with 30 clause families extracted. The verdict is 2 rather than 1 due to two remaining caveats: (a) Exhibit L (Lease Documents) was not directly clause-walked — this is a low-severity gap as the lease is between franchisee and landlord (not franchisor); and (b) the enriched canonical files (v1 and v2) could benefit from deeper per-item structured promotion of the A2 depth pass findings.

---

## Item-by-Item Assessment

### 1. Item 19 Completeness — **PASS**
- All 4 tables extracted: Table 1 (all 4,147 eligible salons), Table 2 (operating cash flow of 2,175 reporting salons), Table 3 (8-tier sales range breakdown), Table 4 (state/province location).
- All 24 footnotes captured with population counts, highs/lows, medians, and attainment percentages.
- Non-reporting bias explicitly captured: 1,972 non-reporting salons skewing lower; median would decrease 2.9%.
- Substantiation availability statement captured.
- Item 19 cohort comparability: No discrepancy — same 6% royalty and 5% ad fund for all salons.

### 2. Item 20 Completeness — **PASS**
- All 5 standard tables present: systemwide (Table 1), transfers (Table 2), franchised status (Table 3), company-owned (Table 4), projected openings (Table 5).
- Footer totals for Table 3: 115 opened, 4 terminations, 1 non-renewal, 0 reacquired, 98 ceased operations-other, 4,439 end of year (2024).
- Franchisee list exhibit count referenced (Exhibits A and B).
- Gag clause flag: **TRUE** — explicitly disclosed on p.79: "current and former franchisees sign provisions restricting their ability to speak openly about their experience with Great Clips."
- Transfers total: 207 (2024). ROFR exercised on 3 of 207.

### 3. Item 21 Sufficiency — **PASS**
- Auditor identified: **RSM US LLP** (via targeted image fallback of p.168 letterhead).
- Opinion: Unqualified (clean). No going-concern language.
- All financial statements extracted: balance sheet, income statement, comprehensive income, shareholders' equity, cash flows.
- All 11 note families walked: accounting policies, Ad Fund, leases, goodwill, deferred compensation, financing, commitments/contingencies, shareholders' equity, income taxes, employee benefit plan, related-party transactions.
- Item 21 method: normal text extraction + targeted image fallback (p.168 for auditor identification).

### 4. State Addenda Sufficiency — **PASS**
- 11 states identified: Michigan, California, Hawaii, Illinois, Maryland, Minnesota, New York, North Dakota, Rhode Island, Virginia, Wisconsin.
- Structured into `state_addenda_overrides` in 09_final_canonical.json.
- 29 override entries extracted across 10 override families: forum selection, noncompete, termination, general release, governing law, damages, interest rate, transfer, anti-fraud, renewal.
- Summary table showing states-by-family included.

### 5. Key Exhibit Sufficiency — **PASS with caveat**
- All exhibits listed in Item 22 accounted for in 04_exhibits.json (13 contracts across 19 exhibits).
- Exhibit E (Financial Statements): Fully walked.
- Exhibit F (Franchise Agreement): Fully clause-walked — 30 clause families in RT_depth_contract_burdens.json.
- Exhibit G (Three Star): Key terms from body text; partial clause walk.
- Exhibit H (MDA): Key terms from body text; partial clause walk.
- Exhibit L (Lease Documents): **Deferred** — sample lease forms between franchisee and landlord. Low severity.

### 6. Unresolveds and Contradictions Assessment — **PASS**
- `unresolveds` key present in 09_final_canonical.json with 6 entries (3 resolved via A2, 3 remaining business-risk flags).
- `contradictions` key present with 1 entry (Item 20/21 salon count methodology difference — resolved as explained).
- Remaining business-risk unresolveds:
  - UR-4: Non-reporting salon bias (high severity — inherent to the data, not an extraction gap)
  - UR-5: Ceased operations ambiguity (medium — structural FDD limitation)
  - UR-6: Lease documents not reviewed (low)
- No extraction-gap unresolveds remaining.

### 7. Final Report Depth — **PASS**
- 08_final_report.md is 32KB, well over the 10KB minimum.
- All required sections present: A (executive snapshot), B (fees/investment), C (supplier/operations/tech), D (territory), E (contract burden), F (Item 19), G (Item 20), H (Item 21), I (state addenda), J (unresolveds), K (contradictions), L (final coverage note).
- Substantive narrative in each section with specific page references.
- Unresolveds section present and populated.
- Contradictions section present and populated.
- State addenda discussed.
- Item 21 financial statement summary section present with full walk.

### 8. Score Gate — **PASS**
- Overall grade: A (upgraded from A- after A2 depth passes).
- All required items covered with evidence grounding.
- 40+ canonical top-level keys.

---

## Franchise Agreement Clause-Walk Assessment

Exhibit F (Franchise Agreement, pp.187-236, ~50 pages) was fully clause-walked in A2. 30 clause families were extracted into RT_depth_contract_burdens.json, covering: grant of license, protected area, term, renewal, trademark standards, fees, training, site selection, opening deadline, standards of operation, technology/security, advertising, financial reporting, insurance, indemnification, ROFR, assignment, death/disability, dispute resolution, immediate termination, termination with cure, repeated breaches, post-termination, purchase option, confidentiality, non-competition, designated operator, anti-terrorism, guaranty, and general release.

Key operative burdens confirmed: unlimited personal guaranty from all equity holders, 3-day abandonment trigger, AI/ML prohibition, waiver of jury trial and punitive damages, prevailing party gets costs/fees, all salon data is GC proprietary property.

No liquidated damages formula or force majeure provision was found.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale — Exhibit L (Lease Documents) was deferred as sample lease forms between franchisee and landlord. Lease guarantee terms are fully covered from Item 10 and Note 7.

---

## Strongest Parts of the Run

1. **Item 19 data depth** (pp.59-68) — All 4 tables with 24 footnotes, 8-tier sales range breakdown, complete state/province distribution of reporting salons, and explicit non-reporting bias disclosure. The cash flow analysis from $-3,635 (bottom tier) to $193,727 (top tier) provides genuine decision-support data.

2. **Item 21 full financial walk** (pp.168-186) — Complete extraction of auditor report (RSM US LLP), all 4 financial statements with 3 years of comparative data, and all 11 note families including lease maturity schedule, debt structure, deferred compensation plans, commitments/contingencies, and related-party transactions.

3. **Franchise Agreement clause walk** (pp.187-236) — 30 clause families extracted with operative substance. Distinctive clauses identified: AI/ML prohibition, 3-day abandonment trigger, unlimited guaranty, waiver of punitive damages.

4. **State addenda structured extraction** (pp.6-7, 359-399) — 11 states with 29 override entries across 10 override families. Summary matrix of forum selection (8 states), noncompete (2 states), termination protections (6 states), and general release limitations (4 states).

5. **Item 6 complete fee table** (pp.22-25) — Full 29-row fee table read across all 4 continuation pages including technology fees, gift card fees, late charges, salon upgrades, and maintenance costs. Total fee load quantified at approximately 14-16% of gross sales.

6. **Item 20 with gag clause flag** (pp.69-79) — All 5 standard tables with state-level detail. Gag clause explicitly captured with verbatim quote. Transfer trends quantified (325→164→207). ROFR exercise noted (3 of 207 in 2024).

7. **Item 2 complete leadership roster** (pp.12-17) — All 34 named officers and directors with roles and tenure dates.

---

## Weakest Remaining Parts of the Run

1. **Exhibit L (Lease Documents) not clause-walked** (pp.327-358) — Sample lease forms not directly read. Lease guarantee terms are known from Item 10 and Note 7, but specific sublease terms, assignment restrictions, and renewal options in the sample lease are unknown.

2. **Enriched canonical files could be deeper** — 11_canonical_enriched.json (5KB) and 12_canonical_enriched_v2.json (10KB) could benefit from deeper promotion of A2 depth pass structured findings, especially the 30-clause FA walk and 29-entry state addenda.

3. **Item 20 Table 2 (transfers)** — State-by-state transfer data was captured but not analyzed for geographic patterns or concentration risk beyond noting Indiana's 82 transfers in 2022.

4. **Three Star and MDA Agreements** (Exhibits G and H) — Only partially clause-walked. Key economic terms are from body text. Specific default/termination triggers unique to these agreements may not be fully captured.

5. **Technology agreements** (Exhibits I, J, K, M) — Labeled only. While key fees are in Item 6, specific service-level agreements, termination provisions, and data handling terms are unknown.

---

## Where a Prior or Manual Run May Still Be Stronger

1. **Exhibit L lease document walk** — A manual review would read the specific GC-drafted lease/sublease forms to identify landlord assignment restrictions, GC's ongoing lease guarantee obligations, and any unusual lease provisions that could create financial exposure for franchisees.

2. **Technology agreement operative terms** — Exhibits I (ICS), J (Heartland), K (SVS), and M (Foundation Technologies) total ~88 pages of technology agreements. A manual review might surface non-obvious data ownership, service interruption liability, or automatic renewal/price escalation terms.

3. **Item 20 qualitative analysis** — A manual reviewer with franchise industry experience might provide deeper analysis of the cessation/relocation dynamics (128→89→98 "ceased operations-other" vs. the 14 confirmed relocations in 2024) and what this implies about true system health.

4. **Guaranty document** — The guaranty form at the end of Exhibit F was identified as unlimited but a manual review would confirm whether it includes spousal guaranty requirements, community property provisions, or other state-specific variations.

---

## Optional Max-3 Follow-Up Roadmap

1. **RT_depth_exhibit_L_lease.json** — Targeted read of Exhibit L (pp.327-358) to extract key lease provisions including: personal guarantee scope, sublease terms, assignment restrictions, tenant improvement requirements, and default/termination triggers.

2. **RT_depth_technology_agreements.json** — Targeted read of Exhibits I, J, K, M for operative terms beyond fee amounts: data ownership, service-level commitments, term/renewal, and termination provisions.

3. **RT_depth_enrichment_v3.json** — Promote A2 depth pass findings (30-clause FA walk, 29-entry state addenda, 11-note financial walk) into a comprehensive v3 enriched canonical.

---

## Unresolved Taxonomy

### Document-Internal Inconsistencies
- **CONTRA-1**: Item 20/21 salon count methodology difference (116 vs. 117 opened in 2022). Resolved — methodological difference, not substantive.

### Business-Risk Flags
- **UR-4**: Non-reporting salon bias — 47.5% of eligible salons did not report expenses. Lower-performing salons disproportionately non-reporting. Acknowledged by franchisor. Severity: high.
- **UR-5**: Ceased operations ambiguity — "Other reasons" includes relocations (14 of 98 in 2024). True permanent closure count understated. Severity: medium.
- **Gag clause** — Some current/former franchisees restricted from speaking openly about their experience. Severity: medium.

### Extraction-Depth Gaps
- **UR-6**: Exhibit L (Lease Documents) not reviewed. Severity: low.
- Enriched canonical files could be more comprehensive. Severity: low.

---

## Buyer-Trust Assessment

A serious buyer would find this extraction reliable for initial due diligence. The core economic disclosure (Item 19 with 8-tier cash flow analysis), system trajectory data (Item 20 with 5 tables), franchisor financial health (Item 21 with complete financial walk), and contract burden analysis (30-clause FA walk + 11-state addenda) provide a solid foundation for investment evaluation. The key business-risk flags — non-reporting salon bias, gag clause, no right to renew, and modest protected territory — are all clearly surfaced. The main gap is in technology agreement terms and lease document specifics, which a buyer should review independently with legal counsel. This run would meaningfully reduce the time and cost of a buyer's own due diligence process.

---

## Source-Grounding Rule
All weaknesses, gaps, and "prior run stronger" claims above cite exact source pages or section identifiers. No unsourced claims.

Deferred surfaced exhibit policy applied: verdict 2 allowed with explicit rationale.
