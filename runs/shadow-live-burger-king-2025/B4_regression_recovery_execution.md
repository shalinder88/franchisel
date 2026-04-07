# B4 — Regression Recovery Execution

## T1 (CRITICAL): D1/D2 Franchise Agreement deep read — EXECUTED

**Pages read:** 220-222 (Sections 19, 20, 21 of FA D1) + structural confirmation across pp 185-281.

### Findings

**FA D1 Section 19 — Restrictive Covenant (verbatim, p220):**
> "Franchisee covenants and agrees that during the Term of this Agreement Franchisee will not own, operate or have any interest in any hamburger business except other franchised BURGER KING Restaurants. Franchisee further covenants and agrees that for a period of one (1) year after any sale, assignment, transfer, termination or expiration of this Agreement, Franchisee will not own, operate or have any interest in any hamburger business, except other franchised BURGER KING Restaurants, either at or within two (2) miles of the Premises."

**Confirmed: noncompete is 1 year, 2 miles, anchored to "the Premises" (FA) — current run canonical and final report are CORRECT.**

**FA D1 Section 20.A — Non-Binding Mediation:** Mandatory non-binding mediation for Development Disputes only. FAC must approve material modifications to mediation Procedures. Voluntary binding arbitration option under Sec 20.B. Confirmed.

**FA D1 Section 21.C — Governing Law / Forum:** Confirmed Florida law and Miami-Dade venue, with state-law severability.

**FA D1 Section 21.E — Notices:** BKC notice address is P.O. Box 020783, General Mail Facility, Miami, FL 33102-0783, Attention: General Counsel. Notices deemed delivered on the earlier of actual receipt or the 3rd day after deposit in U.S. Mail.

### Benchmark findings status (8 critical findings)
1. **Data ownership** — not separately verified in this pass; Item 14 captured AI/ML restriction
2. **MOD Manual unilateral changes** — confirmed in Item 11 narrative ("we may amend the components or requirements of the MOD Manual and implement changes to the BURGER KING® System in our sole discretion") p65
3. **65% media floor** — confirmed Item 11 p70 (`spend no less than 65% of annual advertising contributions on working media`)
4. **ISP supermajority** — confirmed Item 11 p71 (66.7% for IS Program termination/Majority Clause binding)
5. **Successor 4-year notice window** — not separately captured
6. **Post-transfer installment liability** — not separately captured
7. **Mandatory $1,000 BK Foundation** — confirmed Item 6 p38
8. **Transfer release scope** — confirmed Item 17 (general release required)

**Recovery 5 of 8 → captured in current run; 3 of 8 deferred (data ownership detail, successor 4-year notice, post-transfer installment liability).**

## T4 (MEDIUM): Per-state addenda enumeration — EXECUTED (light)

11 states confirmed in Exhibit P pp 706-801: CA, HI, IL, MD, MN, NY, ND, RI, SD, VA, WA.

Per-state material override summaries:

| State | Material Override Summary |
|-------|---------------------------|
| CA | FL forum void (Cal FRA §20040.5); release waivers limited (Corp Code §31512); 10% max late charge; BKC unaudited standalone balance sheet added to Exhibit Q |
| HI | Filed-not-approved; 7-day pre-execution; transfer release excludes HI law claims; HI Commissioner of Securities registered agent |
| IL | (deferred — addendum present; full overrides not enumerated) |
| MD | (deferred — addendum present) |
| MN | (deferred — addendum present; covers 4 separate amendments incl. TRA/MTRA/FA) |
| NY | (deferred — addendum present) |
| ND | (deferred — addendum present and amendment) |
| RI | (deferred — addendum present) |
| SD | (deferred — addendum present) |
| VA | (deferred — addendum present) |
| WA | Indemnity carve-out for franchisor negligence/willful misconduct; attorneys' fees only if franchisor prevails; non-compete void against employees per RCW 49.62.020; September 2018 No-Poach Assurance of Discontinuance with WA AG acknowledged |

**Enumeration complete (11/11 states identified). Per-state material overrides captured for 3/11 (CA, HI, WA); 8/11 deferred to next iteration.**

## T5 (MEDIUM): Enrichment v1 / v2 — EXECUTED (lightweight)

Created `11_canonical_enriched.json` and `12_canonical_enriched_v2.json` by promoting non_canonical_observations and Item 19 sub-detail into structured fields.

## Tasks not executed (per B2)

T2 (RTF2 deep read), T3 (Fuel the Flame deep read), T6 (franchisee list), T7 (table count) — deferred per B2 triage.
