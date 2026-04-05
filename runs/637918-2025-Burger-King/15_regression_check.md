# Regression Check — Burger King FDD (637918-2025)

**Current run:** `637918-2025-Burger-King/` (Apr 5, 2026, ~9am)
**Previous run:** `burger-king-2025/` (Apr 5, 2026, ~1am)
**Same PDF:** `637918-2025-Burger-King.pdf` (1,057 pages)

---

## A. Stronger in Current Run

| Dimension | Current | Previous | Verdict |
|-----------|---------|----------|---------|
| State addenda count | 11 (+ SD, VA) | 9 | Current better |
| State addenda depth | Per-state override tables with cross-state theme matrix | Narrative summaries | Current significantly better |
| Litigation matters | 21 (12 pending + 1 franchisor-initiated + 8 concluded) | 19 (10 pending + 1 + 8) | Current found 2 more |
| Franchisee list | ~5,532 entities with concentration data, top operators named | 604 entities | Current far better |
| Guaranty structure | D3 fully extracted (scope, waivers, transfer release) + RBI/RBILP dual guarantor with signatory detail | Guaranty existence noted but text not fully extracted | Current significantly better |
| Financial statement depth | Debt wall ($13.8B across tranches), Carrols acquisition ($648M consideration, $481M goodwill), segment detail, CAMs | RBI consolidated summary only | Current better |
| Digital services depth | Fee adjustability (unilateral, no cap), AS IS warranty, suspension rights, Cloud Data ownership, audit rights | Fee structure confirmed but operative terms noted as unsurfaced | Current better |
| Enrichment layers | Two enrichment passes (v1: 30 fields, v2: 33 fields) | No enrichment passes | Current better |
| Final report size | 43KB (merged with all retries) | 24KB | Current more comprehensive |
| Item 18 | Confirmed: "no public figures" | Unresolved | Current resolved it |
| Overall score | 9.4/10 | 9.1/10 | Current higher |

## B. Stronger in Previous Run

| Dimension | Current | Previous | Verdict |
|-----------|---------|----------|---------|
| Tables count | 26 | 32 | **Previous better (+6)** |
| Table rows | 263 | 334 | **Previous better (+71)** |
| Table notes | 85 | 110 | **Previous better (+25)** |
| Evidence-grounded fields | 90 | 118 | **Previous better (+28)** |
| D1/D2 franchise agreement | Not deep-read | **Fully read (90 pages). 8 critical findings** surfaced (data ownership, MOD Manual, 65% media floor, ISP supermajority, successor notice timing, post-transfer liability, BK Foundation mandatory) | **Previous significantly better** |
| RTF2 (Exhibit X1) | Referenced in reader report, fee schedule extracted | **Full 22-page deep read** with contribution schedules (3 remodel types x 4 royalty rates x 3 completion years), default/penalty mechanics, cross-default cascade, general release, cure periods | **Previous significantly better** |
| Fuel the Flame (Exhibit Y1) | Not extracted | **Full 10-page deep read** with EBITDA calculation, $175K/$230K thresholds, rent cap (7.4% above 2021 base), renewal voting mechanics, non-voter rules, TV-only restriction | **Previous significantly better** |
| Rent economics (BKL/BKC) | "Varies, payable monthly" | **Full detail:** min rent 10% of capitalized costs (owned) / 125% of BKC rent + 10% (leased); percentage rent 8.5%/$133K threshold/10% above; 12% escalation/5yr; default = full remaining-term rent | **Previous significantly better** |
| Crown Your Career noncompete | Mentioned in Item 5/6 but CYC-specific noncompete not extracted | **Fully surfaced:** "No other business until 5th anniversary or loan repayment" from Item 17 + Exhibit Z1 | **Previous better** |
| Noncompete terms | **WRONG:** stated "2 years, 5 miles" | **CORRECT:** "1 year, 2 miles" (per FA D1 Section 19 and Item 17(r)) | **Previous correct, current has error** |
| Coverage audit depth | 9KB (6 sections) | 24KB (detailed gap analysis with per-family tables) | **Previous more granular** |
| Scorecard depth | 6KB (summary table) | 15KB (per-category detailed justifications) | **Previous more detailed** |
| Retry tasks | 7 generated, 7 executed | 10 generated, 10 executed (included RTF2 + FtF) | **Previous targeted more exhibits** |
| D1 vs D2 delta | Not analyzed | Documented: D1 Operating Partner 50%+ vs D2 Managing Owner 25%+, entity conversion provisions | **Previous better** |
| Cross-default mapping | Noted in reader report | Fully mapped: CYC→all FA, Carrols→transaction FA, RTF2→all DA/TRA/MTRA | **Previous better** |

## C. Material Regressions in Current Run

### Regression 1: NONCOMPETE — INCORRECT VALUE (CRITICAL)
- **Current run says:** "2 years, within 5 miles of any BURGER KING restaurant"
- **Actual source (FA D1 Section 19):** "for a period of one (1) year... within two (2) miles of the Premises"
- **Item 17(r) confirms:** "For 1 year after termination at or within 2 miles of your restaurant"
- **Development Agreement (Art. VII):** "1 year, 2-mile radius of any of your Burger King restaurants"
- **Impact:** This is a materially wrong legal field. Publishing "2 years, 5 miles" would mislead prospective franchisees.

### Regression 2: D1/D2 FRANCHISE AGREEMENT DEEP READ LOST
- Previous run extracted 8 critical findings from 90 pages of operative FA text
- Current run did not read D1/D2 operative clauses
- **Lost findings:** Data ownership (BKC owns all POS/ordering/digital data + third-party sale profits), MOD Manual unilateral changes, 65% media floor, ISP 66.7% supermajority binding, aggregated data publication, successor 4th-year notice window, post-transfer installment liability, mandatory $1,000 BK Foundation

### Regression 3: RTF2 DEEP READ LOST
- Previous run fully extracted Exhibit X1 (22 pages) with contribution schedules, default cascade, cross-default, general release
- Current run only referenced RTF2 at summary level
- **Lost data:** 3 remodel type x 4 royalty rate x 3 completion year contribution matrices, lessor contribution ($150K-$300K), cure period mechanics ($10K-$50K reduction), FSS grade dependency, reversion clause

### Regression 4: FUEL THE FLAME DEEP READ LOST
- Previous run fully extracted Exhibit Y1 (10 pages)
- Current run did not extract FTF
- **Lost data:** EBITDA thresholds ($175K met, $230K renewal), rent cap methodology (7.4% above 2021), renewal voting mechanics, non-voter counting rules, TV-only spending restriction, RSI audit right

### Regression 5: RENT ECONOMICS DETAIL LOST
- Previous run surfaced BKL/BKC lease economics (10% capitalized costs, 125% formula, 8.5%/10% percentage rent tiers, 12% escalation, full remaining-term default liability)
- Current run only noted "Varies" for rent
- **Impact:** Rent is often the largest single cost for BKL-property franchisees

### Regression 6: TABLE DEPTH REDUCED
- 6 fewer tables, 71 fewer rows, 25 fewer notes
- Previous run likely extracted additional sub-tables or more granular Item 19 data
- **Impact:** Medium — core tables are present but some supporting detail lost

### Regression 7: EVIDENCE FIELD COUNT REDUCED
- 28 fewer evidence-grounded fields (90 vs 118)
- Previous canonical had more individually-tracked fields with source support
- **Impact:** Medium — enrichment layers partially compensate

## D. Must-Fix Regressions Before Publish

1. **NONCOMPETE CORRECTION** — Fix "2 years, 5 miles" to "1 year, 2 miles" in all canonical and report files. Add CYC-specific restriction ("no other business until 5th anniversary or loan repayment").

2. **D1/D2 FINDINGS RECOVERY** — Incorporate the 8 critical findings from previous run's D1/D2 deep read into the canonical and final report.

3. **RTF2 CONTRIBUTION DATA RECOVERY** — Incorporate the full RTF2 contribution schedules and default mechanics from previous run.

4. **FUEL THE FLAME DATA RECOVERY** — Incorporate the FTF EBITDA thresholds, voting mechanics, and rent cap methodology from previous run.

5. **RENT ECONOMICS RECOVERY** — Incorporate BKL/BKC lease formula detail from previous run.

## E. Conflict Fields Requiring Source Adjudication

| Field | Current Run | Previous Run | Source Adjudication Needed |
|-------|------------|--------------|---------------------------|
| **Post-term noncompete duration** | 2 years | 1 year | **YES — critical** |
| **Post-term noncompete radius** | 5 miles of any BK restaurant | 2 miles of your restaurant | **YES — critical** |
| CYC noncompete | Not extracted | 5th anniversary or loan repayment | Recovery needed |
| During-term noncompete | Not separately extracted | No hamburger business interest | Recovery needed |
| Development Agreement noncompete | Not separately extracted | 1 year, 2-mile radius of any of your BK restaurants | Recovery needed |
| State noncompete overrides | 11 states surfaced | 9 states surfaced but with CA/MN/ND override detail | Merge both |
