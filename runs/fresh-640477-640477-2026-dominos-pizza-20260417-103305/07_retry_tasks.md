# 07 Retry Tasks — Domino's Pizza (Filing 640477)

## RT-1: DPL Financial Statements (Exhibit D)
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Pages 296–328
- **Rationale**: DPL is the actual operator providing all franchise services. Its financial statements contain system-level economics (supply chain revenue, consolidated operations, total debt, restaurant counts) that are critical for buyer assessment. DPF is an asset-light securitization vehicle.
- **Expected output**: RT_depth_financial_notes.json (DPL section)

## RT-2: Franchise Agreement Clause Walk (Exhibit E)
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Pages 329–383
- **Rationale**: Item 17 chart provides summary but not operative clause detail. Guaranty scope (personal, spousal, unlimited?), liquidated damages formula, cross-default provisions, indemnification specifics, insurance detail beyond minimums, de-identification cost allocation, and management appointment provisions are not captured from body text alone.
- **Expected output**: RT_depth_contract_burdens.json, RT_depth_key_exhibits.json

## RT-3: Rider to Lease (Exhibit K)
- **Status**: EXECUTE (A2 depth pass)
- **Target**: Pages 500–515
- **Rationale**: Mandatory lease rider with DPF-specified terms. Operative lease burden (renewal rights, assignment restrictions, DPF access rights, de-identification obligations) not yet extracted.
- **Expected output**: RT_depth_key_exhibits.json (Exhibit K section)

## RT-4: State Addenda Structured Promotion
- **Status**: EXECUTE (A2 depth pass)
- **Rationale**: State addenda content extracted in reader report but needs structured JSON promotion with per-state override entries and override family × state matrix.
- **Expected output**: RT_depth_state_addenda_promotion.json

## RT-5: Item 21 Note Walk Enhancement
- **Status**: EXECUTE (A2 depth pass)
- **Rationale**: DPF notes 1-5 extracted but note walk should be deepened — debt covenant detail, management fee allocation methodology, subsequent events evaluated but need formal RT file.
- **Expected output**: RT_depth_item21_notes.json

## Non-Applicable Retries
- Item 20 tables: All 5 tables complete including state-by-state. No retry needed.
- Item 19: FPR complete with AWUS, medians, EBITDA tiers. No retry needed.
- Item 2 leadership: Full roster extracted (27 persons). No retry needed.
- Items 9-16: Operative burdens extracted from body text. Deepening deferred to A2 thin-items pass.
- Item 18: No public figures. No retry needed.
