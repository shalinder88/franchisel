# 07 Retry Tasks — Qdoba Franchisor LLC (640022-2025)

## Task List

### RT-01: Financial Statement Deep Read (Qdoba Corporation)
- **task_id:** RT-01
- **task_name:** Qdoba Corporation financial statement line-item extraction
- **exact_target:** Pages 100-103 (balance sheet, income statement, stockholder's equity, cash flows)
- **why_it_is_needed:** Qdoba Corp financials are readable but key line items not yet reproduced in extraction. Total revenue ($383M) and net loss ($9.2M) captured but full line-item detail needed for completeness.
- **likely_source_pages:** 100, 101, 102, 103
- **expected_output_filename:** 08_retry_financial_statements.md

### RT-02: State Addenda Recovery
- **task_id:** RT-02
- **task_name:** State-specific addenda material overrides extraction
- **exact_target:** Exhibit H, pages 333-409 (11 states: CA, HI, IL, MD, MI, MN, NY, ND, RI, VA, WA)
- **why_it_is_needed:** State addenda may materially modify termination, renewal, transfer, dispute resolution, and other provisions. Without extraction, state-specific risk assessment is incomplete.
- **likely_source_pages:** 333-409
- **expected_output_filename:** 10_retry_state_addenda.md

### RT-03: Franchisee List Extraction
- **task_id:** RT-03
- **task_name:** Structured franchisee list extraction from Exhibit D
- **exact_target:** Pages 132-163 (current locations, former franchisees, closures, signed-not-opened)
- **why_it_is_needed:** Franchisee list data needed for concentration analysis, multi-unit operator identification, and geographic distribution assessment.
- **likely_source_pages:** 132-163
- **expected_output_filename:** 13_franchisee_list.json

### RT-04: Franchise Agreement Deep Read
- **task_id:** RT-04
- **task_name:** Key franchise agreement provisions deep extraction
- **exact_target:** Exhibit E-1, pages 164-237 (focus on operating standards, default definitions, cure periods, franchisor discretion, security interest, ACH terms)
- **why_it_is_needed:** Detailed contract provisions beyond Item 17 summary needed for full contract burden assessment.
- **likely_source_pages:** 164-237
- **expected_output_filename:** 11_fa_deep_read.md

### RT-05: Master Technology Agreement Deep Read
- **task_id:** RT-05
- **task_name:** Technology agreement detailed extraction
- **exact_target:** Exhibit K, pages 417-424
- **why_it_is_needed:** Fee structure partially extracted; need full scope of technology requirements, modification rights, data ownership, termination terms, and compliance obligations.
- **likely_source_pages:** 417-424
- **expected_output_filename:** 12_digital_services.md

## Priority Order

1. RT-01 (financial statements) — high priority, directly readable
2. RT-03 (franchisee list) — high priority, directly readable, large dataset
3. RT-02 (state addenda) — medium priority, material for state-specific diligence
4. RT-04 (franchise agreement) — medium priority, supplements Item 17
5. RT-05 (technology agreement) — medium priority, supplements Item 11

## Notes

- Funding Holdco financial statement CID decoding (pages 79-96) is NOT included as a retry task because the encoding issue is a structural limitation of text extraction, not a coverage gap that can be resolved by re-reading. The auditor's report and key structural facts have been captured. The Qdoba Corp financials (RT-01) provide alternative visibility into the system's financial health.
- Litigation recovery is NOT needed — both matters fully extracted in initial pass.
- Management/bankruptcy recovery is NOT needed — both fully surfaced in initial pass.
- Guaranty text recovery deferred — existence and function captured; full text decoding would require CID font mapping work beyond standard extraction.
