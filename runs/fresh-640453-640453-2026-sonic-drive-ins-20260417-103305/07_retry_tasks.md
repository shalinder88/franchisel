# Retry Tasks: Sonic Franchising LLC (640453-2026)

## R1 — Franchise Agreement Depth Pass
- **Target:** Exhibit B-1 (pages 92-139), 48 pages
- **Action:** Full clause walk of operative terms — grant, territory, fees, operations, transfer, termination, noncompete, dispute resolution
- **Status:** EXECUTE (deferred to A2 depth pass)
- **Rationale:** Core contract — Item 17 table provides summary but operative clause detail needed for complete extraction.

## R2 — Item 21 Note Families Depth
- **Target:** SIS Notes (pages 325-334) — property detail, goodwill, intangible assets, long-term debt, leases, revenue recognition, income taxes, related-party
- **Action:** Extract structured note families with key facts
- **Status:** EXECUTE
- **Rationale:** Notes already read in A1 but structured extraction of note families needs formalization.
- **Output:** `RT_depth_item21_notes.json`

## R3 — Items 9-16 Operative Burden Depth
- **Target:** Items 9-16 operative burdens
- **Action:** Structured extraction of obligations, restrictions, rights, triggers per item
- **Status:** EXECUTE
- **Rationale:** Items extracted at narrative level; structured burden objects need formalization.
- **Output:** `RT_depth_thin_items.json`

## R4 — State Addenda Detail
- **Target:** Exhibit G state-specific riders to FA (pages 344-353)
- **Action:** Walk each state rider for operative overrides to FA terms
- **Status:** EXECUTE (deferred to A2)
- **Rationale:** FDD addenda extracted; FA riders contain operative modifications that affect franchise obligations.

## R5 — Development Agreement Depth
- **Target:** Exhibit C-1 (pages 157-170), 14 pages
- **Action:** Clause walk of development agreement operative terms
- **Status:** SKIP
- **Rationale:** Key DA terms adequately extracted from Items 12 and 17. Development Agreement structure is standard for Sonic system and does not contain material additional obligations beyond what Items 12/17 disclose.
