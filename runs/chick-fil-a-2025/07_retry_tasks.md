# Retry Tasks — Chick-fil-A, Inc. License Program FDD (638216-2025)

Based on `06_coverage_audit.md`.

---

## Task 1: Franchisee-List Extraction (CID Decode)

- **task_id:** RT01
- **task_name:** Franchisee-list extraction — CID-encoded Licensed Unit pages
- **exact_target:** Exhibit E, pages ~189-200+ (Licensed Unit listing with CID font encoding)
- **why_needed:** The Licensed Unit entries are the primary contact list for diligence. CID encoding makes them unreadable. Attempting decode via pdfplumber with alternative extraction methods.
- **likely_source_pages:** 189-200
- **expected_output_filename:** `13_franchisee_list.json`

## Task 2: State Addenda Recovery

- **task_id:** RT02
- **task_name:** State addenda structured extraction
- **exact_target:** Exhibit G, pages 263-326 — all 14 state addenda (CA, HI, IL, IN, MD, MI, MN, NY, ND, RI, SD, VA, WA, WI)
- **why_needed:** State addenda contain material modifications to venue, choice of law, non-compete enforceability, termination rights, and integration clauses. Need structured summary.
- **likely_source_pages:** 263-326
- **expected_output_filename:** `10_retry_state_addenda.md`

## Task 3: License Agreement Deep Read

- **task_id:** RT03
- **task_name:** License Agreement deep read — remaining contract terms
- **exact_target:** Exhibits B-1 (pages 81-102) and B-2 (pages 103-144) — insurance, indemnification, confidentiality, POS specifications
- **why_needed:** Several contract terms are referenced but not yet structured: insurance requirements (Section 6.11), indemnification details (Section 10.3), Confidentiality Agreement (Exhibit 1), Addendum B (Core Menu), Addendum D (Sales Reporting).
- **likely_source_pages:** 81-102, 103-144
- **expected_output_filename:** `11_fa_deep_read.md`

## Task 4: Item 20 State-Level Structuring

- **task_id:** RT04
- **task_name:** Item 20 Table 3 state-by-state data structuring
- **exact_target:** Table 3 Licensed Units (pages 58-61) and Franchised Restaurants (pages 62-66)
- **why_needed:** State-level outlet data is essential for geographic diligence. Only totals currently in canonical.
- **likely_source_pages:** 58-66
- **expected_output_filename:** `retry_item20.json`

---

**Total retry tasks: 4**
**Priority order: RT01 (franchisee list) > RT02 (state addenda) > RT03 (FA deep read) > RT04 (Item 20 state detail)**
