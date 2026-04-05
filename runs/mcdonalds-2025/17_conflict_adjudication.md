# 17 — Conflict Adjudication
## McDonald's USA, LLC — FDD (638437-2025)

---

## Conflict 1: Late Payment Interest Rate

### Gold value
`item6.otherFees[3].name = "Interest on Late Payments"`, `item6.otherFees[3].rate = "SOFR + 5%"`

### Current run value
`recurring_fees.interest_on_delinquencies.value = "Highest rate allowed by law, or 15% per annum if no maximum. Monthly compounding, actual/365."`

### Source verification
- **Franchise Agreement Section 8(c), page 77**: "pay interest on the past due amount to McDonald's for the period beginning with the original due date for payment to the date of actual payment at an annual rate equal to the highest rate allowed by law or, if there is no maximum rate permitted by law, then fifteen percent (15%). Such interest will be calculated on the basis of monthly compounding and the actual number of days elapsed divided by 365."
- **Exhibit N, Promissory Note, page 199**: Default interest on the **loan** is described separately in the promissory note context but uses different language — references Maximum Rate under applicable law.
- **Exhibit N, Unlimited Guaranty Section 2, page 208**: Guarantor interest at "18% or, if higher, the floating rate" on guaranty enforcement.

### Adjudication
The gold's `SOFR + 5%` for late payment interest is **not found anywhere in the FDD**. The franchise agreement clearly states 15% per annum (or highest legal rate). The loan documents reference SOFR + 3% as the base loan rate, and the guaranty references 18% for guarantor enforcement. `SOFR + 5%` appears to be a **gold-source error** — possibly confused with the loan rate formula (Term SOFR + SOFR adjustment 0.10% + 3.00%) or an inference.

**Resolution: Current run is correct. Gold value is a gold-source error (classification 4).**

---

## Conflict 2: Insufficient Funds / Rejected Payment Fee ($200)

### Gold value
`item6.otherFees[4].name = "Insufficient Funds / Rejected Payment"`, `item6.otherFees[4].amount = 200`

### Current run value
Not present.

### Source verification
Full-text search of all 389 pages for "insufficient funds", "rejected payment", "NSF", "returned check" found no line-item fee of $200 in the Item 6 fee table or anywhere else in the FDD. The Item 6 fee table (pages 18–21) was comprehensively extracted with 31 line items and 11 footnotes. No insufficient funds fee appears.

### Adjudication
The $200 insufficient funds fee is **not directly surfaced in this FDD**. This may exist in an operational policy or the iReceivables system but is not disclosed as an Item 6 fee.

**Resolution: Gold-source error (classification 4). Not extractable from this FDD.**

---

## Conflict 3: Transfer Fee

### Gold value
`item6.otherFees[5].name = "Transfer Fee"`, `item6.otherFees[5].amount = "varies"`

### Current run value
Not present as a separate fee line item. Transfer conditions are captured in contract terms (royalty reset to current rate on transfer, per Section 15(d), page 81).

### Source verification
The Item 6 fee table does not list a "Transfer Fee" as a separate line item. Item 17 describes transfer conditions including royalty adjustment but no separate transfer fee. The franchise agreement Section 15 describes transfer mechanics without mentioning a separate fee.

### Adjudication
There is no standalone "Transfer Fee" disclosed in the McDonald's FDD. The gold may have inferred this from the royalty reset provision (which increases the royalty to the then-current rate on transfer). This is an economic consequence of transfer, not a separate fee.

**Resolution: Gold-source error (classification 4). The royalty reset on transfer is correctly captured in contract terms.**

---

## Conflict 4: Technology Fee Total

### Gold value
`item6.technologyFees.totalAnnualTechFees = 10605`

### Current run value
`recurring_fees.technology_fees_annual_total_estimate = ~$11,379.40` (mandatory only)

### Source verification
Both are computed from the same Item 6 fee table. The difference of ~$774 is due to:
- Gold appears to exclude some fees: Store Mail ($56.40), and may classify GRNT differently
- Current run includes all mandatory fees listed in the table

### Adjudication
Both are reasonable computations. The exact total depends on which fees are classified as mandatory vs. optional. The Item 6 table marks HHOT, PDW, McD Connect, Survey, and Pricing Engine as optional. The current run correctly separates mandatory ($11,379.40) from optional ($793).

**Resolution: Not a true conflict. Current run's methodology (mandatory/optional split) is more precise. Gold total of $10,605 likely excludes 2-3 minor fees. No change needed.**

---

## Conflict 5: Consolidation Waiver

### Gold value
`financing.moduleF_financing.guaranteedLoanProgram.consolidationWaiver = true`

### Current run value
Not separately structured (jury trial waiver captured but consolidation waiver was not separately called out).

### Source verification
**Exhibit N, Unlimited Guaranty Section 18, page 213**: "NEITHER THE GUARANTOR NOR THE LENDER WILL SEEK TO CONSOLIDATE ANY SUCH ACTION, IN WHICH A JURY TRIAL HAS BEEN WAIVED, WITH ANY OTHER ACTION IN WHICH A JURY TRIAL CANNOT BE OR HAS NOT BEEN WAIVED."

### Adjudication
The consolidation waiver is **directly surfaced** in Section 18 of the Unlimited Guaranty, within the same paragraph as the jury trial waiver. Current run captured the jury trial waiver but did not separately structure the consolidation waiver. This is a **missing extracted fact (classification 1)**.

**Resolution: Promote consolidation waiver to canonical. Current run extraction gap — gold is correct.**

---

## Conflict 6: Pending Litigation Count

### Gold value
`item3.pendingCaseCount = 6`

### Current run value
`litigation_summary.pending_cases_count = "7+ named cases"`

### Source verification
Current run identifies 7 named pending cases: Deslandes, Turner, Crawford, Kytch, Michell, Williams, Le. The Le v. McDonald's (McRib) case was filed December 23, 2025 and appears in the FDD as amended February 1, 2026. Gold's count of 6 likely predates the February 2026 amendment.

**Resolution: Current run is correct. Gold is stale (classification 4) — extracted before Feb 2026 amendment added the Le case.**

---

## Summary of Adjudications

| Conflict | Resolution | Classification | Action |
|----------|-----------|----------------|--------|
| Late payment interest rate | Current run correct; gold says SOFR+5%, FDD says 15% | Gold-source error (4) | No change to current run |
| Insufficient Funds fee $200 | Not in FDD | Gold-source error (4) | No change |
| Transfer Fee | Not a separate fee in FDD | Gold-source error (4) | No change |
| Technology fee total | Both reasonable; current more precise | No conflict | No change |
| Consolidation waiver | Gold correct; current run missed it | Missing extracted fact (1) | Promote to canonical |
| Pending litigation count | Current run correct (7); gold stale (6) | Gold stale (4) | No change |
