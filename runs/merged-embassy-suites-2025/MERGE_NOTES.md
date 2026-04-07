# Merge Notes — Embassy Suites 2025

## Merge type
**Single-source merge** (not a true two-source reconciliation).

## Sources
- **New (A-track)**: `runs/embassy-suites-2025-test/` — Claude-first automation pass, bootstrap + A1 Steps 0-7 + A2 depth + A3 publish gate, executed 2026-04-07 against `fdd-vault/wi-dfi/archive/638053-2025-Embassy-Suites-Hotels.pdf`
- **Old/prior**: **NOT FOUND**. Searched `runs/*embassy*`, `fdd-vault/data/gold_corpus/brands/*embassy*`, full-repo find for `*embassy*` / `*hilton*`. Gold corpus contains 16 brands, none Hilton-family. No baseline Embassy Suites run exists in this repo as of 2026-04-07.

## Merge decision
- Because no old/prior run exists, there is nothing to reconcile clause-by-clause. The merged directory is a byte-for-byte copy of the A-track run, relabeled as `merged-embassy-suites-2025/` to follow the repo's naming convention.
- B5 verdict from the A-track run stands as the merged verdict.

## Verdict
**2 — Publish with caveats** (unchanged from A3 and B5 in the source run).

## Residual open items (non-blocking)
1. Exhibit D-1 State Addenda to Franchise Agreement (pp 183-196) not deep-read. Exhibit J-1 disclosure-document addenda are fully structured for 11 states.
2. Exhibit E Guaranty scope (personal/spousal/unlimited) not confirmed.
3. Exhibit A franchised hotel list (pp 98-110) not row-level transcribed.
4. Exhibit D-2 Development Incentive Promissory Note terms not extracted.
5. Items 9, 10, 13, 14, 15, 16 at structural depth only (covered implicitly via Item 17 and Item 8).

## Material regressions left
**None.** No baseline to regress against.

## Unresolved legal-field conflicts
**None.** `contradictions` is empty in `09_final_canonical.json`.

## When a true merge becomes possible
The next time this PDF is extracted (either via a new automation run, a manual pass, or a gold-corpus ingest of the Hilton family), run B1-B5 with both runs and produce a real reconciled `merged-embassy-suites-2025/` overwriting this directory.
