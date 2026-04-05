# 16 Regression Recovery Tasks — Qdoba (640022-2025)

## Task 1: Correct critical legal field errors (R1, R2, R3, R4)

- **task_name:** Legal field corrections across all output files
- **exact_target:** Noncompete radius (10→5 miles), transfer fee ($25,000→up to $5,000), Item 18 public figure (true→false), dispute resolution (binding arbitration→nonbinding mediation + litigation)
- **why_it_matters:** Four factual errors in core legal/economic terms. Each would mislead a buyer on a material franchise obligation. These are the highest-severity regressions.
- **likely_source_object:** Item 17 page 53 (noncompete, dispute resolution), Item 6 page 20 (transfer fee), Item 18 page 58 (public figure)
- **expected_output_filename:** In-place corrections to `02_reader_report.md`, `03_tables.json`, `05_canonical.json`, `08_final_report.md`, `09_final_canonical.json`, `11_canonical_enriched.json`, `12_canonical_enriched_v2.json`

## Task 2: Restore supplier control economics (R5)

- **task_name:** Supplier control economics recovery
- **exact_target:** Supply chain fee ($0.25/case, $1,304,194 total FY2025), customer fund fee ($0.03/case, ~$85K remaining), QRC revenue from franchisees ($50,845,000, 13.2% of total revenue), required purchase percentages (50-90% establishing, ~40% operating), supplier rebate disclosure
- **why_it_matters:** Current run says "no revenue received" which misrepresents Item 8. QRC receives $50.8M from franchisee purchases. This is a material supplier economics field.
- **likely_source_object:** Item 8, pages 29-30
- **expected_output_filename:** In-place corrections to `05_canonical.json`, `09_final_canonical.json`, `11_canonical_enriched.json`, `12_canonical_enriched_v2.json`

## Task 3: Restore VetFran discount and noncompete/forum state overrides to canonical (R8, R10)

- **task_name:** Restore missing canonical fields from prior run
- **exact_target:** VetFran $10,000 discount (Item 5, page 17), noncompete state overrides (5 states: CA, MI, MN, ND, NY), forum state overrides (6 states: IL, MN, ND, RI, NY, WA)
- **why_it_matters:** VetFran discount is a meaningful fee incentive. State overrides to noncompete and forum selection are material for franchisees in those states and were richly structured in the prior run.
- **likely_source_object:** Item 5 page 17, Exhibit H pages 335-409 (already extracted in `10_retry_state_addenda.md`)
- **expected_output_filename:** In-place additions to `09_final_canonical.json`, `12_canonical_enriched_v2.json`

## Notes

- Recovery tasks focus only on material regressions that affect legal/economic accuracy (R1-R5) and structurally lost canonical fields (R8, R10).
- Table row-count regressions (R6, R7, R8) are noted but NOT recovery targets — the prior run's tables are available via the `qdoba-2025/` provenance directory and the key data points are in the canonical.
- Enriched canonical size regression (R9) will partially resolve as Tasks 1-3 add corrected and new fields.
