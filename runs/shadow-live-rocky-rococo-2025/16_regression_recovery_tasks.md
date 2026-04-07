# B2 Regression Recovery Tasks

| ID | Task | Severity | Source | Action |
|---|---|---|---|---|
| R1 | Promote FA operative-provisions section pagination from prior run RR-01 into new canonical item17 family | low | runs/rocky-rococo-2025/RR-01_fa_operative_provisions.json | EXECUTE in B4 — attach fa_section_pages subfield to item17 |
| R2 | Add territory framing contradiction (1-mile protection vs "no exclusive territory") as C4 with resolved status | low | runs/rocky-rococo-2025/09_final_canonical.json contradictions[0] | EXECUTE in B4 — append to contradictions array |
| R3 | Surface prior-run's guaranty detail ("Owner's Guarantee and Assumption of Franchisee's Obligations") into item21 or RT_depth_contract_burdens | medium | runs/rocky-rococo-2025/09_final_canonical.json item21_auditor_guaranty_financial_summary.guaranty | EXECUTE in B4 — add to RT_depth_contract_burdens guaranty subfield |
| R4 | Surface prior-run's FA jury waiver clause | low | runs/rocky-rococo-2025/09_final_canonical.json dispute_resolution.jury_waiver | EXECUTE in B4 — add to item17 dispute_resolution |
| R5 | Legal-field conflict adjudication: FA 5-mile vs FDA 50-mile post-term noncompete | high | Both runs | ADJUDICATE in B3 |

## Notes
- No factual regressions. All recovery tasks are enrichment-promotions from the prior run's deeper FA/exhibit extraction.
- R5 is the only true legal-field conflict and is unresolved in both runs.
