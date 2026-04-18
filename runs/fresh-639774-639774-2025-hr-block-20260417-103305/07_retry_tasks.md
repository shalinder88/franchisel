# 07 Retry Tasks — H&R Block Tax Services LLC (639774-2025)

## Retry R1: Item 21 Financial Note Walk
**Status**: EXECUTE (A2 Depth Pass 1)
**Target**: RT_depth_financial_notes.json
**Scope**: Pages 103-124 — walk all note families in H&R Block, Inc. consolidated financial statements
**Rationale**: Note headers identified during A1 but content not fully walked. Key notes include: Note 1 (accounting policies), Note 4 (receivables), Note 6 (goodwill/intangibles), Note 8 (long-term debt), Note 9 (income taxes), Note 11 (leases), and segment reporting.
**What to extract**: Revenue recognition, depreciation methods, goodwill impairment ($802M total, $159M Wave), lease structure (ROU $521M), income tax detail, loss contingencies, POM deferred revenue ($149.3M).

## Retry R2: State Addenda Structured Extraction
**Status**: EXECUTE (A2 Depth Pass 4)
**Target**: RT_depth_state_addenda_promotion.json
**Scope**: Pages 60-89 — all 11 state amendments
**Rationale**: Override themes identified but per-state operative details not structured. States: CA, IL, MD, MI, MN, NY, ND, RI, VA, WA, WI.
**What to extract**: Per-state override entries for forum selection, general release, noncompete, termination, governing law, damages, fair market value compensation.

## Retry R3: Franchise Agreement Clause Walk
**Status**: EXECUTE (A2 Depth Pass 2)
**Target**: RT_depth_contract_burdens.json
**Scope**: Pages 185-225 — FLA 39 sections
**Rationale**: Key provisions covered via Item 17 cross-references but direct clause walk not performed. Particularly important: §12 noncompete detail, §13/14 termination triggers, §15 franchisee termination payment formula, §16 post-termination duties, §18 transfer conditions, §21 indemnification, §29 applicable law, §39 litigation limitations.

## Retry R4: Loan Agreement Depth
**Status**: EXECUTE (A2 Depth Pass 2)
**Target**: RT_depth_contract_burdens.json (included)
**Scope**: Pages 233-264 — Term Loan (H-1) and Short-Term Loan (H-2)
**Rationale**: Key terms extracted from Item 10, but detailed security interest, default triggers, remedies, and acceleration provisions not fully walked.

## Retry R5: Narrative-to-Canonical Promotion
**Status**: EXECUTE (A2 Depth Pass 3)
**Target**: RT_depth_promotion_audit.json
**Rationale**: Standard A2 pass to identify facts in reader report not yet promoted to canonical.

## No Retries Marked SKIP
All identified gaps are material and appropriate for A2 depth passes.
