# Retry Tasks — Rocky Rococo Pizza and Pasta (638785-2025)

---

## RT-01: Item 20 Franchised Outlet Table Repair
- **task_id**: RT-01
- **task_name**: Item 20 franchised outlet table repair
- **exact_target**: Status of Franchised Outlets table on page 49
- **why_it_is_needed**: OCR degradation made sub-column parsing unreliable. The "Outlets Opened / Predecessor Affiliated Transferred" sub-columns could not be cleanly separated. Total row values are correct but the breakdown between new openings and predecessor conversions is uncertain for WI 2023 and 2024.
- **likely_source_pages**: 49
- **expected_output_filename**: RT-01_item20_franchised_repair.json

## RT-02: Balance Sheet Cell Repair
- **task_id**: RT-02
- **task_name**: Balance sheet cell repair
- **exact_target**: Balance Sheets on page 60
- **why_it_is_needed**: Several 2022 and 2023 individual line items (property/equipment, some liability items) extracted as null due to OCR quality. Key totals are clean but individual cell values need recovery for complete financial data.
- **likely_source_pages**: 60
- **expected_output_filename**: RT-02_balance_sheet_repair.json

## RT-03: Franchisee List Structured Extraction
- **task_id**: RT-03
- **task_name**: Franchisee list structured extraction
- **exact_target**: Current franchisee list on pages 50–53
- **why_it_is_needed**: The 20 franchisee entities need to be extracted into a structured format with entity name, address, contact person, and phone number for the enriched canonical.
- **likely_source_pages**: 50, 51, 52, 53
- **expected_output_filename**: RT-03_franchisee_list.json

## RT-04: State Addenda Investigation
- **task_id**: RT-04
- **task_name**: State addenda investigation
- **exact_target**: Search entire document for state-specific addenda language
- **why_it_is_needed**: The FDD references state-specific addenda (p.4, p.6) but none are found as exhibits or TOC entries. Need to confirm whether they exist elsewhere in the document or are genuinely absent.
- **likely_source_pages**: Entire document (167 pages), particularly any pages between exhibits
- **expected_output_filename**: RT-04_state_addenda_investigation.md
