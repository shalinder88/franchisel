# Retry Tasks — Burger King FDD (637918-2025)

Generated from `06_coverage_audit.md`. Only material retries.

---

## Task 1: Litigation Recovery + Item 18 Recovery

- **task_id:** RT-01
- **task_name:** Litigation completion and Item 18 public figures
- **exact_target:** Item 3 (complete truncated matters) + Item 18 (confirm public figures status)
- **why_needed:** Two Item 3 litigation matters had text truncated at page boundaries. Item 18 was not separately extracted — need to confirm whether public figures are disclosed or "none."
- **likely_source_pages:** Pages 20–27 (Item 3), page 97–98 (Item 18 boundary)
- **expected_output_filename:** `08_retry_litigation.md`

## Task 2: Management / Bankruptcy Recovery

- **task_id:** RT-02
- **task_name:** Item 2 management structure and Item 4 bankruptcy confirmation
- **exact_target:** Confirm completeness of Item 2 (business experience) and Item 4 (no bankruptcy)
- **why_needed:** Item 2 was surfaced but some biographies may have been truncated. Item 4 is clean but should be confirmed.
- **likely_source_pages:** Pages 18–19 (Item 2), page 28 (Item 4)
- **expected_output_filename:** `09_retry_management_bankruptcy.md`

## Task 3: State Addenda Recovery

- **task_id:** RT-03
- **task_name:** State addenda deep read
- **exact_target:** Exhibit P — material state-law overrides for 11 states (CA, HI, IL, MD, MN, ND, WA, NY, RI, SD, VA)
- **why_needed:** 96 pages of state-specific overrides not yet extracted. These materially affect termination, noncompete, forum, governing law, nonrenewal, and release provisions depending on franchisee state.
- **likely_source_pages:** Pages 706–801
- **expected_output_filename:** `10_retry_state_addenda.md`

## Task 4: Guaranty and Remaining Gaps Recovery

- **task_id:** RT-04
- **task_name:** Guaranty structure, guarantor chain, and remaining gaps
- **exact_target:** Exhibit D3 (Guaranty), Exhibit Q guarantees (RBI/RBILP Guarantee of Performance), separation between BKC and affiliate/parent obligations
- **why_needed:** Guaranty structure is critical for assessing franchisee risk. Need to understand scope of personal guaranty (D3) and parent guaranty (Q). Also address remaining audit gaps.
- **likely_source_pages:** Pages 275–281 (D3), pages 802–810 (Q header)
- **expected_output_filename:** `11_retry_guarantee_and_remaining.md`

## Task 5: Financial Statement Deep Read

- **task_id:** RT-05
- **task_name:** Exhibit Q financial statement deep read
- **exact_target:** RBI consolidated financial statement notes — debt structure, Carrols acquisition accounting, segment detail, related-party transactions, contingent liabilities
- **why_needed:** Balance sheet and income statement surfaced but notes contain material information about debt covenants, $13.5B long-term debt structure, Carrols acquisition fair value, and contingent liabilities.
- **likely_source_pages:** Pages 808–910 (RBI financial statements)
- **expected_output_filename:** `11_fa_deep_read.md`

## Task 6: Digital Services / Technology Agreement Deep Read

- **task_id:** RT-06
- **task_name:** Exhibit V (Digital App Services Agreement) deep read
- **exact_target:** Operative terms of the Digital App Services Agreement
- **why_needed:** 15-page technology agreement with significant ongoing obligations. Fee structure surfaced ($110/month + 1% digital sales) but operative terms (suspension rights, data access, hosting, compliance, payment mechanics) not extracted. High-priority gap.
- **likely_source_pages:** Pages 942–956
- **expected_output_filename:** `12_digital_services.md`

## Task 7: Franchisee List Extraction

- **task_id:** RT-07
- **task_name:** Franchisee list extraction
- **exact_target:** Exhibits O1, O2, O3 — representative subset for concentration analysis
- **why_needed:** 114 pages of franchisee lists not extracted. Entity-level data needed for concentration analysis and state distribution.
- **likely_source_pages:** Pages 592–705
- **expected_output_filename:** `13_franchisee_list.json`

---

**Total retry tasks: 7**
**Estimated effort: High (large document, multiple deep reads required)**
**Priority order: RT-01 > RT-03 > RT-04 > RT-05 > RT-06 > RT-07 > RT-02**
