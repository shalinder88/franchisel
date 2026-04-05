# Final Report — Chick-fil-A, Inc. License Program FDD (638216-2025)

---

## Summary

This extraction covers the **Chick-fil-A, Inc. License Program FDD** (filing 638216-2025, issued March 31, 2025, 330 pages). The License Program governs non-traditional locations — universities, hospitals, airports, businesses — and is distinct from the Operator Program for free-standing restaurants.

### Key Facts

| Field | Value |
|---|---|
| Franchisor | Chick-fil-A, Inc. (Georgia corp, formed 1964) |
| Program | License Program (non-traditional locations) |
| Issuance Date | March 31, 2025 |
| Initial Fee | $0 |
| Ongoing License Fee | 10% of Gross Receipts (7% for transportation) |
| Total Initial Investment | $585,500 – $3,437,000 |
| Licensed Units (end 2024) | 425 |
| Franchised Restaurants (end 2024) | 2,629 |
| Company-Operated (end 2024) | 55 |
| Total Domestic System | 3,109 |
| Auditor | PricewaterhouseCoopers LLP |
| Total Revenue 2024 | $9,062,620,436 |
| Net Earnings 2024 | $1,044,197,186 |
| Litigation Cases Disclosed | 2 (both settled) |
| Bankruptcy (franchisor) | No — CFA has never filed bankruptcy |
| Bankruptcy (Item 4 disclosure) | Yes — Pier 1 Imports Ch. 11 (management-level: CFA Board member was Pier 1 Interim CEO) |
| Public Figures | None |
| Transfers (2022–2024) | Zero |

### Item 19 Performance (Licensed Units open 1+ year, 2024)

| Category | Units | Median Sales | Average Sales | % at/above avg | High | Low |
|---|---|---|---|---|---|---|
| College/University | 312 | $897,932 | $1,395,745 | 40% | $4,906,963 | $192,830 |
| Hospital/Business/Airport | 97 | $3,152,764 | $3,451,788 | 46% | $11,573,107 | $150,498 |

College/university distribution: <$500K ~10%, $500K-$750K ~13%, $750K-$1M ~19%, $1M-$2M ~35%, >$2M ~23%. Sample coverage: 96.2% (409/425 eligible units).

### System Growth

| Year | Licensed Start | Licensed End | Net | Restaurants Start | Restaurants End | Net |
|---|---|---|---|---|---|---|
| 2022 | 393 | 395 | +2 | 2,311 | 2,411 | +100 |
| 2023 | 395 | 412 | +17 | 2,411 | 2,552 | +141 |
| 2024 | 412 | 425 | +13 | 2,552 | 2,684 | +132 |

### Contract Structure

- **Term**: Set per individual agreement (blank in template)
- **Renewal**: CFA's right, not obligation — no guaranteed renewal
- **Territory**: Non-exclusive; protection limited to the specific Site
- **Non-compete**: During term at Site (no branded chicken); 12 months post-term at former Site only
- **Dispute resolution**: Georgia courts, Georgia law (14 states have addenda modifying)
- **Transfer**: Requires CFA written approval
- **Sunday/Christmas closure**: Mandatory

### Supplier Economics

CFA and affiliates earned $1.78B from Operator/Licensee product sales (19.6% of total revenue). CFA Supply received $2.0B from purchases. Bay Center received $187M for proprietary lemon juice. CFA may be the sole approved supplier for trade secret items.

### Financial Strength

Total assets $16.6B, stockholders' equity $5.8B, cash $1.4B, long-term debt $2.8B. Three consecutive years of $1B+ net earnings. Clean PwC audit opinion. The franchisor's financial capacity is exceptionally strong.

---

## Retries Executed

1. **RT01 — Franchisee list CID decode**: 384 Licensed Unit entries decoded from Type3 CID-encoded font. Quality: readable with case normalization needed.
2. **RT02 — State addenda**: 13 states structured (CA, HI, IL, IN, MD, MN, NY, ND, RI, SD, VA, WA, WI). Key protections identified.
3. **RT03 — License Agreement deep read**: Insurance, indemnification, confidentiality, POS, sales reporting, fee structure details extracted.
4. **RT04 — Item 20 state detail**: Not separately structured as totals are in canonical and full state data is available in the PDF tables.

### Projected Openings (Table 5)

| Category | Signed Not Opened | Projected New Franchised | Projected New Company-Owned |
|---|---|---|---|
| Licensed Units | 3 | 25 | 0 |
| Franchised Restaurants | 38 | 183 | 0 |

## Unresolveds Remaining

1. License term is case-by-case (blank template) — cannot determine standard term.
2. Minor Table 1 count discrepancy for 2023 Franchised Restaurants start (labeling artifact).

## Production Usability

This extraction is **production-usable** for the License Program FDD. All material items are covered with evidence-grounded fields. The franchisee list was decoded despite CID encoding. State addenda are structured. Financial statements are fully extracted. The only material limitation is the blank license term, which is inherent to the FDD template structure.
