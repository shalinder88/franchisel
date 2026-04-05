# Conflict Adjudication — Burger King FDD (637918-2025)

**Purpose:** Adjudicate conflicting legal fields between current and previous runs using actual operative source text.

---

## Conflict 1: Post-Term Noncompete Duration

| Run | Value |
|-----|-------|
| **Current (637918-2025-Burger-King)** | "2 years, within 5 miles of any BURGER KING restaurant" |
| **Previous (burger-king-2025)** | "1 year, 2 miles" |

### Source Verification

**FA D1 Section 19 — Restrictive Covenant (page 220):**
> "Franchisee further covenants and agrees that for a period of one (1) year after any sale, assignment, transfer, termination or expiration of this Agreement, Franchisee will not own, operate or have any interest in any hamburger business, except other franchised BURGER KING Restaurants, either at or within two (2) miles of the Premises."

**Item 17(r) — Franchise Agreement summary (page 87):**
> "For 1 year after termination at or within 2 miles of your restaurant, you may not own, operate or have any interest in any other hamburger business."

**Item 17(r) — Development Agreement summary (page 94):**
> "Same as above, lasting for 1 year (on business activities within 2-mile radius of any of your Burger King restaurants) following termination."

### Adjudication

| Dimension | Correct Value | Source |
|-----------|--------------|--------|
| Duration | **1 year** | FA D1 Section 19: "one (1) year" |
| Radius | **2 miles** | FA D1 Section 19: "two (2) miles" |
| Anchor point | **"the Premises" (FA) / "any of your Burger King restaurants" (DA)** | FA = your restaurant location; DA = any of your BK locations |
| Scope | Hamburger business only | FA D1 Section 19: "any hamburger business" |

**Verdict: Previous run was CORRECT. Current run was WRONG.**

The current run's "2 years, 5 miles" has no basis in the FDD. The source is unambiguous: 1 year, 2 miles. The error appears to have been introduced during the reader report (Pass 4) — likely a hallucination or confusion with another franchise system.

---

## Conflict 2: Noncompete Anchor Point (FA vs DA)

The FA noncompete measures from "the Premises" (your specific restaurant location), while the Development Agreement noncompete measures from "any of your Burger King restaurants." This is a meaningful distinction for multi-unit operators.

| Agreement | Anchor | Practical Effect |
|-----------|--------|-----------------|
| Franchise Agreement (D1 Sec. 19) | "at or within two (2) miles of the Premises" | Restricted only near your specific restaurant |
| Development Agreement (Art. VII) | "2-mile radius of any of your Burger King restaurants" | Restricted near ALL your BK locations |

**Verdict:** Both runs partially surfaced this. Previous run noted the DA variant. Neither run highlighted the FA-vs-DA distinction explicitly. This should be preserved in the merged canonical.

---

## Conflict 3: Crown Your Career Noncompete / Loan-Linked Restriction

| Run | Value |
|-----|-------|
| **Current** | Not extracted |
| **Previous** | "No other business until later of 5th anniversary or loan repayment" |

### Source Verification

**Exhibit Z1 — Crown Your Career Addendum (Entity), Section 2 (page 1020):**
> "until the fifth (5th) anniversary of the commencement date of the first BURGER KING franchise agreement entered into between Franchisee and BKC [** If financing offered: or until the Promissory Note is paid in full, whichever is later**], Managing Owner shall not (A) engage in or own any interest in any other business activity, (B) be employed by any other business, or (C) engage in any activity which may impair Franchisee's ability to fulfill its obligations under this Agreement."

**Exception:** Does not apply to ownership of <5% beneficial interest in publicly traded securities.

### Adjudication

| Dimension | Value | Source |
|-----------|-------|--------|
| Duration | 5th anniversary of first BK FA, OR loan repayment (whichever later, if financing) | Exhibit Z1 Sec. 2, page 1020 |
| Scope | **Any business activity** (not limited to hamburgers) | Exhibit Z1: "any other business activity" |
| Who is restricted | Managing Owner only | Exhibit Z1: "Managing Owner shall not" |
| Exception | <5% publicly traded securities | Exhibit Z1 |

**Verdict: Previous run was CORRECT. Current run missed this entirely.**

This is a materially broader restriction than the standard FA noncompete (which is hamburger-only). CYC Managing Owners cannot engage in ANY other business for 5 years (or until loan repaid), not just hamburger businesses.

---

## Conflict 4: During-Term Noncompete

| Run | Value |
|-----|-------|
| **Current** | "Not directly surfaced" |
| **Previous** | "No hamburger business interest. No use of BK System/marks/secrets outside BK operations." |

### Source Verification

**FA D1 Section 19 — Restrictive Covenant (page 220):**
> "Franchisee covenants and agrees that during the Term of this Agreement Franchisee will not own, operate or have any interest in any hamburger business except other franchised BURGER KING Restaurants."

**FA D1 Section 12 — Unfair Competition (page 203):**
> "during the Term hereof and at all times thereafter will not directly or indirectly engage in the operation of any restaurant... which utilizes or duplicates the BURGER KING System, any trade secrets of BKC, the BURGER KING Marks or the present or any former BURGER KING Current Image."

### Adjudication

| Dimension | Value | Source |
|-----------|-------|--------|
| During-term restriction | No hamburger business except other BK franchises | FA D1 Section 19 |
| Perpetual restriction | No use of BK System/marks/secrets in any other restaurant, ever | FA D1 Section 12 |

**Verdict: Previous run was CORRECT. Current run failed to extract this.**

---

## Conflict 5: State Noncompete Overrides

| State | Current Run | Previous Run | Reconciled |
|-------|------------|--------------|------------|
| California | "Post-term noncompete may not be enforceable under CA law" | "CA: may not be enforceable" | Consistent |
| Minnesota | "MN law governs; no specific noncompete override noted in current" | "MN: prohibited" | Previous more specific |
| North Dakota | "ND: extensive protections, noncompete limited" | "ND: subject to N.D.C.C. 9-08-06 (heavily restricted)" | Consistent |

**Verdict:** Both runs substantively agree. Previous run was more concise in the canonical; current run has more detailed state addenda tables. Merge both.

---

## Summary of Adjudications

| Field | Previous Run | Current Run | Correct Value | Action |
|-------|-------------|-------------|---------------|--------|
| Post-term noncompete | 1 year, 2 miles | 2 years, 5 miles | **1 year, 2 miles** | Fix current |
| CYC noncompete | 5th anniversary or loan repayment, any business | Not extracted | **5th anniversary or loan repayment, any business** | Add to current |
| During-term noncompete | No hamburger business interest | Not extracted | **No hamburger business interest** | Add to current |
| FA vs DA anchor | FA = your premises; DA = any of your BK restaurants | Not distinguished | **Preserve both** | Add to current |
| State overrides | CA/MN/ND noted | CA/MN/ND + 8 more states | **Merge both** | Keep current + add previous specifics |

### Three-Tier Noncompete Structure (Reconciled)

1. **During term (FA Section 19):** No ownership/interest in any hamburger business (except other BK franchises).
2. **Post-term (FA Section 19):** 1 year, 2 miles from the Premises, no hamburger business. DA variant: 2 miles from any of your BK restaurants.
3. **CYC enhancement (Exhibit Z1):** No ANY business activity until 5th anniversary or loan repayment (whichever later). Managing Owner only. Much broader than standard FA noncompete.

Plus:
- **Perpetual (FA Section 12):** No use of BK System/marks/secrets in any other restaurant, ever.
- **State overrides:** CA likely unenforceable, MN prohibited, ND heavily restricted.
