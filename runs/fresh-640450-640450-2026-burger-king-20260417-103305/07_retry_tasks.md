# Retry Tasks — Burger King 2026 FDD (640450)

## RT-1: Item 21 Financial Statement Notes Depth Pass
**Status**: EXECUTE (deferred to A2)
**Pages**: 758–798 (RBI notes), 801–998 (RBILP notes)
**Reason**: 40+ pages of financial statement notes not walked in A1. Key note families needed: revenue recognition, goodwill/impairment (including Carrols BK reporting unit critical audit matter), long-term debt structure, lease accounting, segment reporting, advertising fund, discontinued operations (BK China/Pangaea Foods), related party transactions.
**Expected output**: RT_depth_financial_notes.json

## RT-2: State Addenda Structured Extraction
**Status**: EXECUTE (deferred to A2)
**Pages**: 652–747 (~95 pages)
**Reason**: State addenda exist with material overrides for 15+ states. Per-state override families (venue, noncompete, termination, governing law, release, damages) not yet structured into canonical.
**Expected output**: RT_depth_state_addenda_promotion.json

## RT-3: Contract Burden Depth Pass
**Status**: EXECUTE (deferred to A2)
**Pages**: D1 (221–280), D2 (281–340), G1 (456–500), M (535–548)
**Reason**: Key operative terms from franchise agreements, lease, and development agreement extracted via Item 17 tables, but full clause-by-clause walks not performed.
**Expected output**: RT_depth_contract_burdens.json

## RT-4: Canonical Promotion Audit
**Status**: EXECUTE (deferred to A2)
**Pages**: N/A (all existing files)
**Reason**: Verify every structured fact from 02_reader_report.md exists in canonical JSON. Promote any missing Item 2 roster details, Item 6 fee details, Item 19 chart details, Item 20 yearly activity into canonical.
**Expected output**: RT_depth_promotion_audit.json

## RT-5: Item 7 Real Property Ambiguity Resolution
**Status**: EXECUTE (deferred to A2 if image fallback available)
**Pages**: 50
**Reason**: Traditional Freestanding "Real Property / Occupancy" shows $300,000 (low) and $90,000 (high) — these appear reversed. Need image verification of actual column alignment.
**Expected output**: Resolution noted in RT_depth_promotion_audit.json
