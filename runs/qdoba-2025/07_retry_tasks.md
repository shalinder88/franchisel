# Retry Tasks — Qdoba Franchisor LLC FDD

Generated from `06_coverage_audit.md` omission analysis.

---

## Task 1: Financial Statement Recovery

- **Task name:** Item 21 / Exhibit A financial statement extraction
- **Exact target:** Consolidated balance sheets, income statements, cash flows, member's equity, and notes for Qdoba Funding Holdco LLC and Qdoba Corporation
- **Why needed:** The single largest coverage gap. Financial statement pages (79-85+) use CID-encoded embedded fonts that pdfplumber cannot text-extract. No revenue, assets, liabilities, debt, or cash flow figures were surfaced. Cannot assess franchisor financial health without this data.
- **Likely source pages:** 79-100+ (Exhibit A)
- **Approach:** Try PyMuPDF direct text extraction, OCR via pdf2image + pytesseract, or manual reading of the PDF in a viewer.
- **Expected output file:** `retry_item21.md`

## Task 2: State Addenda Recovery

- **Task name:** Exhibit H state-specific addenda extraction
- **Exact target:** All state-specific overrides to the Franchise Agreement, Development Agreement, and License Agreement
- **Why needed:** Multiple Item 17 provisions are explicitly "subject to state law." Key states with large franchisee presence (California, Colorado, Illinois, Indiana, Maryland, Minnesota, Wisconsin, Virginia) may have material overrides to noncompete scope, termination cure periods, forum/venue, and governing law.
- **Likely source pages:** Deep in Exhibit H section (likely pages 200-300+ based on exhibit ordering)
- **Expected output file:** `retry_state_addenda.md`

## Task 3: Item 20 Tables 3-4 Full JSON Structuring

- **Task name:** Complete Item 20 state-level table structuring
- **Exact target:** FY2023 and FY2024 state-level rows for Table 3 (franchised outlets) and all years of Table 4 (company-owned outlets)
- **Why needed:** FY2025 state rows are in `03_tables.json` but FY2023/2024 rows and Table 4 are only in the reader report as narrative. Structured JSON needed for scoring and comparison.
- **Likely source pages:** 64-71
- **Expected output file:** `retry_item20_full_tables.json`

---

## Tasks NOT Recommended

The following were identified as not-covered but are not worth retry effort:

- **Franchise/Development/License Agreement full text** — Item 17 summary tables are comprehensive. Full agreement text is 100+ pages and the marginal value of deep reading is low for initial extraction.
- **Franchisee list (Exhibit D)** — Important for due diligence calls but not for field extraction. Would require separate tooling (address/phone parsing).
- **Manual TOC (Exhibit G)** — Low extraction value; 466 pages is informational only.
- **NDA, ACH authorization, Entity Certification, Stored Value Card Agreement** — Standard form agreements with low extraction value.
