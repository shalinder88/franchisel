# Conflict Adjudication — Rocky Rococo Pizza and Pasta (638785-2025)

---

## C1: Noncompete Post-Term Radius — FA (5 miles) vs. FDA (50 miles)

**Source A — Franchise Agreement, Sect. XVI.D (p.122, disclosed in Item 17 pp.45-46):**
"for a period of one (1) year ... FRANCHISEE shall not have any direct or indirect interest ... in any business ... within a radius of 5 miles of the designated area or within a radius of 5 miles of the location of any other business using FRANCHISOR's system"

**Source B — Franchise Deposit Agreement, Sect. 5/8 (p.157, disclosed in Item 17 p.46):**
"APPLICANT agrees that APPLICANT will not directly or indirectly engage in any other type of pan style pizza and pasta restaurant during the term of this Agreement and for a period of one (1) year thereafter, within a fifty (50) mile radius of the area set forth in this Agreement, or within a fifty (50) mile radius of the location of any other business using FRANCHISOR's system"

**Adjudication:**
This is **not an extraction error or a gold error**. It is a **different-agreement-type** conflict (#1). The FA and FDA are separate agreements with separate noncompete provisions. The FDA governs the pre-site-selection period and its 50-mile radius applies to applicants who have deposited but not yet signed a franchise agreement. The FA governs the operating franchise and its 5-mile radius applies post-termination/expiration.

**Adjudicated canonical value:**
```json
{
  "noncompete_post_term": {
    "fa_radius": "5 miles of designated area or any system location",
    "fda_radius": "50 miles of designated area or any system location",
    "duration": "1 year (both agreements)",
    "reconciliation": "Different agreements govern different phases. FDA 50-mile radius applies to pre-franchise applicants. FA 5-mile radius applies to operating franchisees post-termination. Both are subject to state law.",
    "which_governs_operating_franchisee": "FA — 5 miles",
    "status": "adjudicated"
  }
}
```

---

## C2: Computer Access — Item 11 Contradiction vs. FA Sect. IX.D

**Source A — Item 11, p.32:**
"RFC does not have access to your computer information."

**Source B — Item 11, p.31:**
"you shall establish and maintain at the Franchised Business, a) a dedicated line RFC may use to access the computer system"

**Source C — FA Sect. IX.D (p.98-99, from deep read):**
"FRANCHISOR shall have at all times the right to retrieve information from any data processed on the computer system with respect to the RESTAURANT, and FRANCHISEE shall take such action as may be necessary to provide such access to FRANCHISOR."

**Adjudication:**
This is a **current extraction error** (#5) in the original canonical. The Item 11 p.32 statement ("does not have access") is contradicted by both the same Item 11 (p.31) and the operative FA language (p.98-99). The FA is the governing agreement and it **clearly grants RFC full data retrieval rights**. The p.32 statement appears to be poorly drafted FDD language — it likely was intended to say RFC does not *currently* access the data, not that RFC has no *right* to access it.

**Adjudicated canonical value:**
```json
{
  "data_access": {
    "value": "RFC has the right at all times to retrieve information from franchisee's computer system. Franchisee must maintain a dedicated line/broadband connection for RFC access.",
    "governing_source": "FA Sect. IX.D",
    "contradicting_statement": "Item 11 p.32 states 'RFC does not have access to your computer information' — this is contradicted by the operative FA language and by Item 11 p.31",
    "resolution": "FA language controls. RFC has full data access rights.",
    "status": "adjudicated"
  }
}
```

---

## C3: Royalty Reduction Mechanism — Refund vs. Credit

**Source A — Item 6, Note 1 (p.15):**
"the weekly Royalty and Service Fee for that RESTAURANT shall be retroactively reduced for that fiscal year to Three and one-half percent (3 1/2%). RFC shall refund the excess to you within thirty (30) days of the end of the fiscal year."

**Source B — Note 1 to Financial Statements, Revenue Recognition (p.64):**
"If franchisees do not reach a gross sales threshold during the fiscal year as defined in each franchise agreement, the Company retroactively reduces the percentage to 3.5% and credits the difference to the franchisees' balance owed in the future."

**Adjudication:**
This is a **different-context** distinction, not a true conflict. The FDD Item 6 describes the contractual obligation to the franchisee (a "refund within 30 days"). The financial statement note describes the *accounting treatment* — how RFC records it on its books (a credit to the franchisee's balance). In practice, the credit may function as either a cash refund or an offset against future fees owed.

However, there is a meaningful nuance: Item 6 says "refund" (cash return); the FS note says "credits the difference to the franchisees' balance owed in the future" (offset). These have different economic effects for the franchisee. Item 6 also conditions the refund on being "current on all Royalty and Service Fees due RFC, and any other accounts payable due RFC, or one of RFC's affiliates."

**Adjudicated canonical value:**
```json
{
  "royalty_conditional_reduction": {
    "threshold_52_week": 425000,
    "threshold_53_week": 433173,
    "reduced_rate": 3.5,
    "mechanism_per_fdd": "Retroactive reduction; RFC shall refund excess within 30 days of fiscal year-end",
    "mechanism_per_fs_note": "Company credits the difference to the franchisees' balance owed in the future",
    "eligibility_condition": "Must be current on all royalty fees and other accounts payable to RFC or affiliates",
    "reconciliation": "FDD describes contractual obligation (refund). FS note describes accounting treatment (credit to future balance). In practice, the mechanism may function as either cash refund or fee offset depending on franchisee's account status.",
    "status": "adjudicated"
  }
}
```

---

## Summary

| Conflict | Root Cause | Resolution |
|---|---|---|
| C1: Noncompete radius | Different agreement types (#1) | FA 5-mile governs operating franchisees; FDA 50-mile governs pre-franchise applicants |
| C2: Computer access | FDD drafting inconsistency; FA controls (#5 — original extraction should have caught FA language) | RFC has full data access rights per FA Sect. IX.D |
| C3: Royalty reduction | Different contexts — contractual vs. accounting (#3 — interpretive) | Both values preserved; reconciliation note added |
