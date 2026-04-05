# Retry Tasks: Burger King FDD (637918-2025)

**Source:** `06_coverage_audit.md` Sections B, C, E, F
**Date:** 2026-04-05

Only material gaps included. Low-value omissions (Item 13 trademarks, Item 14 patents, Exhibit U ops manual TOC, RBI financial statement notes detail) are excluded.

---

## RT-01: Item 3 — Litigation History

**Priority:** CRITICAL
**Target:** PDF pages 20–27 (8 pages)
**Why needed:** Largest uncovered Item. An 8-page Item 3 for a 70-year system with 6,701 US restaurants almost certainly contains material franchise relationship disputes, class actions, government enforcement proceedings, and potentially Carrols-related litigation. This is the single highest-risk gap for legal diligence.
**Expected output:** `08_retry_litigation.md` — structured summary of each material litigation matter: parties, forum, nature of claims, amounts at issue, status, settlement terms if disclosed. Preserve any matters involving franchise termination disputes, class or collective actions, government enforcement, or amounts exceeding $1M.

---

## RT-02: Item 2 — Business Experience + Item 4 — Bankruptcy

**Priority:** HIGH
**Target:** PDF pages 18–19 (Item 2, 2 pages) and page 28 (Item 4, 1 page)
**Why needed:** Item 2 identifies BKC's key officers and directors with their 5-year business experience — needed to assess management stability and tenure. Item 4 is a standard bankruptcy check that should be confirmed as clean or flagged.
**Expected output:** `09_retry_management_bankruptcy.md` — officer roster (name, title, tenure, prior roles) and bankruptcy confirmation/denial.

---

## RT-03: State Addenda — Operative Provisions for Key States

**Priority:** HIGH
**Target:** FDD addenda pages from Exhibit P for CA (782–784), IL (787), MD (788), MN (789–790), NY (791–793), ND (794–795), WA (799–801). Approximately 18 pages.
**Why needed:** State addenda routinely override critical Item 17 provisions including post-term noncompete enforceability, forum selection, general release requirements, termination notice periods, and franchisee rights on non-renewal. For any franchisee in a registration state, these overrides define the actual legal relationship — not the Florida-law defaults.
**Expected output:** `10_retry_state_addenda.md` — per-state structured summary of each provision that modifies or overrides the standard FDD/FA terms. Focus on: noncompete modifications, forum/governing law changes, termination/non-renewal protections, release requirement limitations, and any additional franchisee rights.

---

## RT-04: Guarantee of Performance — Locate and Read

**Priority:** HIGH
**Target:** Scan Exhibit Q more carefully — likely at pages 852, 910, or interleaved between the two financial statement sets. May also be at the very end of Exhibit Q before Exhibit R (page 911).
**Why needed:** Item 21 states that RBI and RBILP Guarantees of Performance are "included at Exhibit Q," but the source map scan did not locate them as separately-headed pages. The guarantee scope, conditions, limitations, and expiration are critical — they are the only assurance that BKC's obligations to franchisees are backed by a parent entity.
**Expected output:** Append to `09_retry_management_bankruptcy.md` or create `11_retry_guarantee.md` — full text or structured summary of both guarantees (RBI and RBILP versions), including scope, conditions, limitations, and which states each covers.

---

## RT-05: Item 19 — Modern Image vs Legacy Image Sales Comparison

**Priority:** HIGH
**Target:** Re-read PDF pages 99–100 with focus on any inline data, sub-table, or paragraph that compares Modern Image Traditional Restaurant sales to Legacy/Non-Modern Image Traditional Restaurant sales. The Section A narrative on page 99 states that Sales Distributions are "also provided for Modern Image 'Traditional Restaurants' compared to Legacy Image 'Traditional Restaurants'."
**Why needed:** If this comparison exists, it directly quantifies the AUV penalty for operating a non-Modern Image restaurant. This is the core economic justification for the remodel thesis — the gap between Modern Image and Legacy Image AUV, combined with the Section B uplift data, defines the remodel ROI case. If the comparison is missing from the FDD, that is itself a material finding.
**Expected output:** Append to `03_tables.json` as a new table (T19-11) if data found, or add a definitive unresolved to `05_canonical.json` if confirmed absent.

---

## RT-06: Exhibit X1 — Reclaim the Flame 2 Master Program Agreement

**Priority:** HIGH
**Target:** PDF pages 969–990 (22 pages)
**Why needed:** RTF2 is the current mandatory remodel program. Items 5-6 describe the fee consequences (reduced successor franchise fee, royalty rate election, +3.0% surcharge on failure) but the operative agreement governs: how remodel deadlines are set, what constitutes "successful completion," the FSS Remodel Grade cash contribution schedule (amounts not disclosed in Items 5-6), BKC's discretion to modify deadlines, and the full cross-default mechanics. This is the single most consequential exhibit for existing franchisees.
**Expected output:** `12_retry_rtf2.md` — structured extraction of: remodel deadline mechanics, FSS Remodel Grade tiers and cash contribution amounts, completion criteria, BKC discretionary rights, cross-default scope, termination triggers, and any caps or limitations on BKC's remodel demands.

---

## RT-07: Exhibit Y1 — Fuel the Flame Co-Investment Agreement (EBITDA Definition)

**Priority:** MEDIUM-HIGH
**Target:** PDF pages 999–1008 (10 pages)
**Why needed:** The $230,000 4-Wall EBITDA benchmark (as of 12/31/2026) determines whether the systemwide advertising rate stays at 4.5% or drops to 4.0%. This is a 0.5% swing on Gross Sales for every restaurant in the system. How "4-Wall EBITDA" is defined — which costs are included/excluded, how company-owned stores are treated, how the "average" is calculated — is entirely within this agreement and was not surfaced.
**Expected output:** `13_retry_fuel_the_flame.md` — structured extraction of: 4-Wall EBITDA definition, calculation methodology, franchisee voting mechanics, rate adjustment timeline (2026/2028 milestones), and interaction with RTF2 MPA for post-2028 legacy rate path.

---

## RT-08: Item 20 Table 3 — State-by-State Franchise Outlet Status

**Priority:** MEDIUM-HIGH
**Target:** PDF pages 116–121 (6 pages, already scanned during source mapping)
**Why needed:** Table 3 is the most analytically rich Item 20 table — it contains opened, terminated, non-renewed, reacquired, and ceased-other columns for every state across 3 years. The national totals are extracted but state-level data enables: identification of high-attrition states, states where BKC is actively non-renewing, states where Carrols reacquisitions are concentrated, and states with net organic growth vs. contraction.
**Expected output:** Append to `03_tables.json` as `T20-03-FULL` with all ~150 state-year rows. This data was already read during the source scan — the text is in the persisted tool output files.

---

## RT-09: RBILP Financial Statements — Headline Numbers

**Priority:** MEDIUM
**Target:** PDF pages 858–862 (balance sheet, income statement, cash flow — approximately 5 pages)
**Why needed:** RBILP is the guarantor for franchisees in 7 states (CA, IL, MD, ND, RI, VA, WA). Only the RBI financial statements were tabulated. While RBILP consolidates similarly to RBI, the guarantor entity's specific balance sheet, income, and cash position should be independently confirmed.
**Expected output:** Append to `03_tables.json` as `T21-04`, `T21-05`, `T21-06` (RBILP balance sheet, income, cash flow summaries paralleling T21-01 through T21-03).

---

## RT-10: Canonical Structuring — Already-Read Fields

**Priority:** MEDIUM
**Target:** No new PDF reading required. Structure data already in `02_reader_report.md` into `05_canonical.json`.
**Why needed:** The coverage audit identified 4 families that were fully read and narrated in the reader report but never coded into canonical form: owner participation (Item 15), product restrictions (Item 16), rent economics (Item 6 Footnote 4), and insurance requirements (Item 8). These are material diligence fields.
**Expected output:** Patch `05_canonical.json` with new families: `owner_participation`, `product_restrictions`, `rent_economics`, `insurance_requirements`. Each field with value, source_object, source_section, source_pages, confidence, and status.

---

## Execution Priority Matrix

| Tier | Tasks | Total pages to read | Rationale |
|---|---|---|---|
| **Tier 1 — Do first** | RT-01 (Litigation), RT-03 (State addenda), RT-05 (Modern Image comparison) | ~28 pages | Highest diligence impact. Litigation and state addenda are standard diligence requirements. Modern Image comparison resolves a key unresolved. |
| **Tier 2 — Do next** | RT-06 (RTF2 MPA), RT-07 (Fuel the Flame), RT-08 (Table 3 state detail) | ~38 pages | RTF2 and FtF are the two most consequential current programs. Table 3 state detail unlocks geographic analysis. |
| **Tier 3 — Cleanup** | RT-02 (Management/Bankruptcy), RT-04 (Guarantee), RT-09 (RBILP financials), RT-10 (Canonical structuring) | ~11 pages + structuring | Important but lower marginal value. RT-10 requires zero PDF reads. |

**Total new PDF pages to read across all retry tasks:** approximately 77 pages (out of 1,057 total).
