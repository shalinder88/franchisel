# 07 Retry Tasks — Ivybrook Academy 2025 v2

## R1: Exhibit J vision OCR — Item 21 financial statements
- **Scope**: pp 168–197 (30 pages). Recover auditor name, opinion type, balance sheet, income statement, cash flow, notes, going-concern language, related-party disclosures, distributions.
- **Status**: **SKIP** (this automation run has no vision OCR capability available).
- **Rationale**: Text layer is empty on these pages. Without a vision/OCR path this cannot be executed in-run. Leave as unresolved U1 (severity high) to be recovered by B2/B4 if benchmark run has authoritative data. Prior run (`runs/ivybrook-academy-2025`) recovered Exhibit J via vision OCR and identified Reese CPA — that will be used as the B1 benchmark.

## R2: Exhibit K label confirmation
- **Scope**: p 7 (TOC) vs p 168 (Exhibit J header) and pp 197–198 (transition from J to L body label).
- **Status**: **EXECUTE — no action**. Already confirmed during A1 source-map pass. TOC says K=Current Franchisees, body labels that content Exhibit L; no exhibit in the body is labeled K. Recorded in 04_exhibits.json and 05_canonical.json U2.

## R3: Franchisee-disclosure questionnaire location
- **Scope**: locate the Franchisee Disclosure Questionnaire referenced in Item 22 and TOC as Exhibit L.
- **Status**: **SKIP (unresolved)**. Body pages 198–204 are labeled Exhibit L but contain the Current-and-Former-Franchisees list, not a questionnaire. The Questionnaire exhibit is either absent or consolidated. Leave as U2 medium-severity unresolved.

## R4: Table 2C vs Table 3 population mismatch
- **Scope**: Item 19 pp 47–49.
- **Status**: **EXECUTE — no recoverable answer**. Re-read confirmed the numbers: Table 2C text says "18 franchisee-owned schools that have been open three or more years"; Table 3 by classroom count sums to 19 (4+13+2). Difference = 1 franchisee. Most likely explanation is that the classroom-count segmentation uses a slightly different criterion (a school opened between 1/1/2022 and 1/1/2023 that has 3+ years by a different reference date) but this is not explained in the notes. Left as U3 low-severity.

## R5: Item 19 "40 total schools" vs Item 20 "41 outlets" mismatch
- **Scope**: Item 19 p 45 vs Item 20 p 50.
- **Status**: **EXECUTE — resolved explanation**. Item 19 says "40 total schools were in operation as of December 31, 2024" (franchisees only context). Item 20 Table 1 reports 40 franchised + 1 company-owned = 41 total. Reconciliation: Item 19's "40" appears to exclude the company-owned/affiliate school from the "total schools in operation" count, then adds it back via Table 2A. Left as U4 low-severity informational; not a factual contradiction.

**Executed retries**: R4 (confirmation, no data change), R5 (reconciliation note).
**Skipped with documented reason**: R1, R3.
**Action on canonical**: no updates required beyond the unresolveds already captured in 05_canonical.json.

(Because no new data was recovered, there is no retry_R*.json artifact — nothing to write.)
