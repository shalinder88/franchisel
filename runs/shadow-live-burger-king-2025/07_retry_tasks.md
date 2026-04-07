# 07 — Retry Tasks

## R1: Wisconsin addendum check — EXECUTE

**Question:** Does the WI 637918 filing PDF contain a state-specific Wisconsin addendum?

**Method:** grep all _pagetext/*.txt for "Wisconsin" and "WISCONSIN", then enumerate.

**Finding:** No "State of Wisconsin Addendum" or "Wisconsin Amendment" found in Exhibit P (pages 706-801) or anywhere in the FDD body. Wisconsin appears only in:
- p138 (Item 23 receipt or related front matter)
- p653 (end of Exhibit O1 franchised list)
- p786 (Hawaii addendum's reference list of states where BK is registered)
- p1055 (last pages — likely receipt)

The state addenda block (Exhibit P) contains addenda/amendments for: **California, Hawaii, Illinois, Maryland, Minnesota, New York, North Dakota, Rhode Island, South Dakota, Virginia, Washington**.

**Resolution:** Wisconsin requires registration (BK is registered in WI) but the franchisor has not included a separate Wisconsin-specific addendum to override the FA. WI's franchise law (Wisconsin Fair Dealership Law applies to dealerships, not franchises specifically) is implemented via filing/registration rather than per-state addendum. **Marked: confirmed absence is not a gap.**

Output: written into 09_final_canonical.json `exhibits_present.wisconsin_addendum.present = false` with explanatory note.

## R2: State addenda full enumeration — EXECUTE

**States with addenda in Exhibit P (pp 706-801):** CA, HI, IL, MD, MN, NY, ND, RI, SD, VA, WA (11 states).

**Material per-state observations** (from spot reads of CA pp 783-784 and WA pp 800-801):
- **California:** Florida choice of forum void per CA Franchise Relations Act §20040.5; general release waivers limited per Corp Code §31512; 10% max late charge; BKC unaudited standalone balance sheet must be added to Exhibit Q.
- **Washington:** Indemnity carve-out for franchisor negligence/willful misconduct; attorneys' fees only if franchisor is prevailing party; non-compete void against employees per RCW 49.62.020; Sept 2018 No-Poach Assurance of Discontinuance with WA AG noted.
- **Hawaii:** Filed-not-approved disclosure; transfer release excludes HI law claims.
- (IL, MD, MN, NY, ND, RI, SD, VA addenda present but per-state material overrides not enumerated in this pass — deferred to A2.)

## R3: Item 20 Table 3 reconciliation — SKIP (deferred to A2)

Spot-checked early-alphabet states; full reconcile to Table 1 totals deferred.

## R4: Operations Manual TOC body — SKIP (deferred)

Only the 639-page count is captured from Item 11 narrative. Full TOC text is in Exhibit U pp 936-941 and not extracted.

## R5: Crown Your Career promissory note rate — SKIP

Item 10 captured: WSJ Prime + 1%-4%. Note text in Z3 not separately extracted.

## R6: Litigation status update on Mister Crab — SKIP (out of scope)

The hearing date 1/27/2026 falls in the past relative to today; any update would be outside this PDF.
