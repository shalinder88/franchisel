# 17 Conflict Adjudication — Qdoba (640022-2025)

Adjudicating conflicting legal and economic fields between the current run (`640022-2025-*`) and prior run (`qdoba-2025`). Each conflict resolved by reading the operative source pages directly.

---

## 1. Noncompete Radius

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | 5 miles | 10 miles |
| **Source cited** | Item 17, page 53 | Item 17, page 50 |

**Source verification:** Item 17, page 53, subsection (r) for the Franchise Agreement:

> "within five (5) miles of the Accepted Location, or within five (5) miles of any Qdoba restaurant existing at the time of termination or expiration, for two (2) years past termination."

Item 17, page 56, subsection (r) for the Development Agreement:

> "within five (5) miles of any Qdoba restaurant for a period of two (2) years."

**Adjudication:** Prior run is **correct**. The radius is 5 miles, not 10 miles. The current run's 10-mile figure has no source basis in the FDD. This error appears to have been introduced during the reader report generation (Pass 4) and propagated to all downstream files.

**Agreement type:** Franchise Agreement (Section 30), Development Agreement (Section 16). Both specify 5 miles.

---

## 2. Transfer Fee

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | up to $5,000 | $25,000 (traditional), $10,000 (non-traditional) |
| **Source cited** | Item 17, page 52 | Item 6, page 18 |

**Source verification:** Item 6 fee table, page 20:

> "Transfer — Up to $5,000 — Prior to consummation of transfer"

Item 17, page 52, subsection (m) for the FA lists transfer conditions including "transfer fee paid" but does not specify the dollar amount in the summary row.

**Adjudication:** Prior run is **correct**. The transfer fee is "up to $5,000" per the Item 6 fee table (the authoritative source for fee amounts). The current run's $25,000/$10,000 figures have no basis in this FDD. These figures may have been confused with another brand's FDD or hallucinated during table extraction.

**Agreement type:** Franchise Agreement fee schedule (Item 6).

---

## 3. Item 18 — Public Figure

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | false — no public figure | true — John Cywinski listed |
| **Source cited** | Item 18, page 58 | Item 18, page 58 |

**Source verification:** Item 18, page 58:

> "We do not currently use any public figure to promote our franchise."

**Adjudication:** Prior run is **correct**. The FDD explicitly states no public figure is used. John Cywinski is listed in Item 2 (Business Experience) as CEO of QRC and in Item 1 as a footnote referencing his role — but he is NOT listed in Item 18. The current run incorrectly conflated the Item 2 officer listing with Item 18 public figure disclosure.

**Agreement type:** FDD disclosure (Item 18). Not an agreement term.

---

## 4. Dispute Resolution Mechanism

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | Nonbinding mediation; then litigation in San Diego, CA | Binding arbitration in San Diego, CA (JAMS); waiver of jury trial and punitive damages |
| **Source cited** | Item 17, page 53 | Item 17, page 52 |

**Source verification:** Item 17, page 53, subsection (u) for the Franchise Agreement:

> "Subject to state law, you are required to participate in nonbinding mediation."

Item 17, page 53, subsection (v) for the FA:

> "Subject to applicable state law, litigation must be in San Diego, California."

There is NO reference to JAMS, binding arbitration, or waiver of jury trial in the FA provisions of Item 17. The Development Agreement (page 55-56) also specifies mediation, not arbitration. The License Agreement (page 58) says "Not applicable" for dispute resolution by arbitration.

**Adjudication:** Prior run is **correct**. The dispute mechanism is nonbinding mediation followed by litigation (not arbitration). There is no JAMS reference. There is no jury trial waiver or punitive damages waiver in the base FA provisions — though some state addenda (ND, MN, MI) specifically note that such waivers would be unenforceable, which may have caused the current run to infer they existed.

**Agreement type:** Franchise Agreement (Section 32). Mediation is nonbinding. Litigation (not arbitration) in San Diego. State addenda may modify forum.

---

## 5. Supplier Control — Revenue from Franchisee Purchases

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | QRC received $50,845,000 (13.2% of total revenue) from franchisee purchases | "No revenue received from products/services purchased by franchisees" |
| **Source cited** | Item 8, page 30 | Item 8, page 30 |

**Source verification:** Item 8, page 30:

The FDD contains a nuanced two-part disclosure:
1. First, it states: "Other than the Supply Chain Fee, Customer Fund Fee, and the supplier rebates each described below, our predecessor, QRC, did not receive any revenue from products and services purchased or leased by franchisees."
2. Then it discloses: "QRC's total revenue from all required purchases and leases by franchisees (which includes IT fees, supply chain fees, sublease rent, and advertising contributions) in fiscal year 2025 was $50,845,000 or 13.2% of QRC's total revenues."

Additional detail:
- Supply Chain Fee: $0.25/case, total $1,304,194 in FY2025
- Customer Fund Fee: $0.03/case, ~$85,000 remaining at fiscal year end
- Supplier rebates: received from certain suppliers based on volume

**Adjudication:** Prior run is **correct**. The current run paraphrased only the first qualifying clause ("did not receive any revenue") without reading the subsequent disclosures that reveal $50.8M in revenue from franchisee-related activities. This is a critical omission — the first clause is a narrowly qualified statement that is immediately contradicted by the detailed disclosures that follow.

**Agreement type:** FDD disclosure (Item 8). Relates to QRC management services, not the Franchise Agreement directly.

---

## 6. VetFran Discount

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | $10,000 franchise fee reduction for honorably discharged veterans | Not extracted |
| **Source cited** | Item 5, page 17 | — |

**Source verification:** Item 5, page 17:

> "If you provide us with adequate documentation demonstrating an honorable discharge from the United States military, we will reduce your Initial Franchise Fee by $10,000."

**Adjudication:** Prior run is **correct**. The VetFran discount is directly surfaced in Item 5 and is a meaningful fee incentive for a specific buyer segment. The current run missed it entirely.

**Agreement type:** FDD disclosure (Item 5). Entry economics.

---

## 7. Noncompete State Overrides

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | 5 states structured in canonical (CA, MI, MN, ND, NY) | Present in `10_retry_state_addenda.md` but not in canonical JSON |

**Source verification:** Exhibit H state addenda confirm:
- CA: may be unenforceable (page 335)
- MI: reasonable time/area; court may revise (page 364)
- MN: limited to 2 years within area of franchise (page 367)
- ND: generally unenforceable (page 383)
- NY: enforceable only if reasonable (page 375)
- WA: buyback provisions limited; good faith required (pages 395-396) — prior run missed WA

**Adjudication:** Prior run is **structurally stronger** — overrides were machine-readable canonical fields. Current run has the data in a markdown file but not in the canonical JSON. Current run adds WA override not present in prior run. Neither run is wrong; prior run is better structured for downstream use.

---

## 8. Forum State Overrides

| | Prior Run | Current Run |
|---|-----------|-------------|
| **Value** | 6 states structured (IL, MN, ND, RI, NY, WA) | Present in addenda file, not in canonical |

**Adjudication:** Same as #7 — prior run structurally richer. Both runs have the correct override data. Prior run promoted it to the canonical; current run left it in the retry file.

---

## Summary of Adjudicated Values

| Field | Correct Value | Correct Run | Error Type in Current Run |
|-------|--------------|-------------|---------------------------|
| noncompete_post_term_miles | 5 | Prior | Hallucinated (no 10-mile reference exists) |
| transfer_fee | up to $5,000 | Prior | Hallucinated ($25,000 from another brand) |
| item18_public_figure | false | Prior | Conflation of Item 2 officers with Item 18 |
| dispute_resolution | Nonbinding mediation + litigation | Prior | Hallucinated (no arbitration/JAMS reference) |
| supplier_revenue | $50,845,000 (13.2%) | Prior | Selective reading (used qualifier, missed disclosure) |
| vetfran_discount | $10,000 | Prior | Omission |
| noncompete_state_overrides | 5-6 states with specific limits | Both (prior structured) | Not promoted to canonical |
| forum_state_overrides | 6 states with specific limits | Both (prior structured) | Not promoted to canonical |
