# Retry Tasks — Ivybrook Academy FDD (637976-2025)

## Task 1: Financial Statement Deep Read

- **task_id:** RT-01
- **task_name:** financial_statement_deep_read
- **exact_target:** Exhibit J, pages 168–197 (30 pages of scanned financial statements)
- **why_it_is_needed:** Financial statements are image-only (no extractable text via PyMuPDF or pdfplumber). The Special Risk page and Illinois addendum both flag franchisor financial condition concerns. Without financial data, auditor identity, going concern language, revenue/income/equity figures are unknown. This is the highest-risk gap in the extraction.
- **likely_source_pages:** 168–197
- **expected_output_filename:** RT-01_financial_statement_recovery.md

## Task 2: Item 11 Training Table Recovery

- **task_id:** RT-02
- **task_name:** item11_training_table_recovery
- **exact_target:** Item 11, pages 24–31 — check for a structured training program table (subjects, hours, instructors, locations)
- **why_it_is_needed:** The coverage audit noted that training information was extracted in narrative form but a formal training program table may exist and was not captured as a structured table.
- **likely_source_pages:** 30–31
- **expected_output_filename:** RT-02_training_table_recovery.md

## Task 3: Pages 154–160 Content Verification

- **task_id:** RT-03
- **task_name:** unmapped_pages_recovery
- **exact_target:** Pages 154–160 (between Exhibit G ending and Exhibit H beginning)
- **why_it_is_needed:** These pages are not mapped in the source map. They may contain additional exhibits, state addenda continuation, or blank pages. Need to confirm.
- **likely_source_pages:** 154–160
- **expected_output_filename:** RT-03_unmapped_pages_recovery.md
