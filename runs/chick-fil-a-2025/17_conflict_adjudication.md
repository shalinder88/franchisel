# 17 Conflict Adjudication — Chick-fil-A (638216-2025) vs Gold

---

## C1: Bankruptcy Flag — `true` (Current) vs `false` (Gold)

**Current run:** `bankruptcy_flag.value = true` — "Pier 1 Imports, Inc. filed Chapter 11... This is a management-level bankruptcy disclosure, not a franchisor bankruptcy."

**Gold:** `item4_bankruptcy.hasBankruptcy = false`, `disclosedBankruptcy = "Pier 1 Imports bankruptcy — disclosed because a Chick-fil-A board member previously served there"`, `franchisorOrAffiliateRelated = false`

**PDF says (p.22):** Pier 1 Imports Ch. 11 is disclosed. "Pier 1 is not the franchisor nor an affiliate of the franchisor." Cheryl Bachelder (CFA Board) was Interim CEO Dec 2018–Nov 2019.

**Adjudication:** Both extractions capture the same fact. The disagreement is semantic:
- Gold uses `hasBankruptcy: false` to mean "the franchisor itself has no bankruptcy" — which is correct.
- Current uses `value: true` to mean "an Item 4 disclosure exists" — which is also correct.

**Resolution:** Adopt a **two-field structure** that captures both truths:
- `franchisor_bankruptcy: false` — CFA itself has never filed bankruptcy
- `item4_disclosure_exists: true` — Item 4 contains a management-level bankruptcy disclosure
- `detail:` Pier 1 Imports Ch. 11, Cheryl Bachelder, not CFA/affiliate

This prevents the initial extraction error (saying "no bankruptcy" when a disclosure exists) while preserving the gold's correct assessment that CFA itself is not bankrupt.

---

## C2: Encroachment Risk — "High" (Current) vs "moderate" (Gold)

**Current run:** `territory_structure.encroachment_risk = "High"` — "CFA can open Operator Restaurants, other Licensed Units, Captive Venue units, and company-operated locations anywhere with no obligation to licensee."

**Gold:** `encroachmentRisk = "moderate"`, `encroachmentNote = "Less relevant than McDonald's because these are captive-venue locations. Competition is mostly from other food options within the same site, not nearby Chick-fil-A restaurants."`

**Adjudication:** Both are defensible analytical judgments, not factual errors:
- Current is correct that the legal protection is minimal (same-site only).
- Gold is correct that practical encroachment risk is moderated by the captive-venue nature of the locations (a hospital cafeteria doesn't compete with a nearby free-standing CFA).

**Resolution:** Adopt the gold's nuanced framing. Set `encroachment_risk: "moderate"` with note: "Legal protection is minimal (same-site only, non-exclusive license), but practical encroachment risk is moderated by the captive-venue model — a university food court CFA does not directly compete with a nearby free-standing Operator restaurant."

---

## C3: Licensee FDD Since — 1998-03-13 (Current) vs May 4, 1992 (Gold)

**Current run:** `licensing_disclosure_since: "1998-03-13"`

**Gold:** `licenseeFDDSince: "May 4, 1992"`

**PDF says (p.12-13):** "Chick-fil-A commenced offering prospective Licensees the opportunity to become Licensees pursuant to a Disclosure Document on May 4, 1992." Also: "Chick-fil-A has owned and operated Chick-fil-A Restaurants similar to the type of Chick-fil-A Licensed Unit to be operated by you as a Licensee, since 1992."

The current run's "1998-03-13" date appears to be from a different sentence about a different disclosure milestone. The Item 1 text explicitly states "May 4, 1992" for the Licensee FDD.

**Resolution:** **Gold is correct.** Set `licensing_disclosure_since: "1992-05-04"`. Source: Item 1, page 13.

---

## Summary

| Conflict | Resolution | Winner |
|---|---|---|
| C1 Bankruptcy flag | Two-field structure: franchisor_bankruptcy=false + item4_disclosure=true | **Reconciled** (both partially correct) |
| C2 Encroachment risk | "moderate" with nuanced note | **Gold** |
| C3 Licensee FDD since | 1992-05-04 | **Gold** |
