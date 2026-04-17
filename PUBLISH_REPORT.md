# Franchise Consolidation Publish Report

Generated: 2026-04-16  ·  Generator: `scripts/merge_dossiers.py`

Best-supported merged-output-wins consolidation across all valid runs and current site data, per the precedence rules in CLAUDE.md.

## Headline Table

| Franchise | Slug | Primary Run | Harvest | FY | Quality | Item 19 | Filing-Δ | Conflicts | Status |
|---|---|---|---:|---:|---|:-:|---:|---:|---|
| McDonald's | `mcdonalds` | `mcdonalds-2025-merged-v2` | 6 | 2025 | gold_merged | yes | 2 | 2 | PUBLISHED |
| Ivybrook Academy | `ivybrook-academy` | `ivybrook-academy-2025-v2` | 1 | 2025 | reconciled | yes | 2 | 4 | PUBLISHED |
| Burger King | `burger-king` | `burger-king-2025` | 3 | 2025 | merged | yes | 4 | 3 | PUBLISHED |
| Qdoba Mexican Eats | `qdoba-mexican-eats` | `qdoba-2025` | 2 | 2025 | v2 | no | 0 | 1 | PARTIAL |
| Rocky Rococo Pizza and Pasta | `rocky-rococo-pizza-and-pasta` | `rocky-rococo-2025` | 2 | 2025 | reconciled | yes | 3 | 3 | PUBLISHED |
| Chick-fil-A | `chick-fil-a` | `chick-fil-a-2025` | 0 | 2025 | reconciled | yes | 0 | 1 | PUBLISHED |
| Anago Cleaning Systems | `anago-cleaning-systems` | `anago-cleaning-systems-2026` | 0 | 2026 | publish_gate | yes | 0 | 0 | PUBLISHED |
| Cruise Planners | `cruise-planners` | `cruise-planners-2025` | 0 | 2025 | publish_gate | yes | 0 | 0 | PUBLISHED |
| Cupbop | `cupbop` | `cupbop-2025` | 0 | 2025 | publish_gate | yes | 0 | 0 | PUBLISHED |
| Jiffy Lube | `jiffy-lube` | `jiffy-lube-2025` | 0 | 2025 | publish_gate | yes | 0 | 0 | PUBLISHED |
| The Joint Chiropractic | `the-joint-chiropractic` | `the-joint-chiropractic-2025` | 0 | 2025 | publish_gate | yes | 0 | 0 | PARTIAL |

## Per-Franchise Detail

### McDonald's (`mcdonalds`)

- **Primary**: `mcdonalds-2025-merged-v2` (gold_merged, FY2025)
- **Harvested for depth**: `mcdonalds-2025-merged`, `shadow-final-mcdonalds-2026-04-13`, `shadow-live-mcdonalds-2026-04-07-final`, `shadow-live-mcdonalds-2025-v2`, `mcdonalds-2025`, `shadow-previous-mcdonalds-2025`
- **Headline**: fee `$45,000` · investment `$1,471,000 to $2,728,000` · royalty `5% of Gross Sales (post-Jan 1 2024 new restaurants, McOpCo purchases, post-ROFR ` · units `13559` (franchised `12887`, company `672`)
- **Item 19**: present · cohort n=12572
- **Auditor**: Ernst & Young LLP, Chicago · opinion `Unqualified (clean)` (March 14, 2025)
- **Filing-year deltas vs harvest**: 2
  - `royalty`: was `4% or 5% of Gross Sales` → now `5% of Gross Sales (post-Jan 1 2024 new restaurants, McOpCo purchases, post-ROFR re-sales) or 4% (legacy: family transact` (vs `shadow-final-mcdonalds-2026-04-13`)
  - `royalty`: was `4% or 5% of Gross Sales` → now `5% of Gross Sales (post-Jan 1 2024 new restaurants, McOpCo purchases, post-ROFR re-sales) or 4% (legacy: family transact` (vs `mcdonalds-2025`)
- **Red flags**: 3
  - [warning] contradiction: Item 19 pro forma is derived from a restaurant cohort whose royalty during the covered period was 4% of Gross Sales. As of January 1, 2024, 
  - [info] fee: Delinquency interest rate >= 12%/yr
  - [warning] bankruptcy: None
- **Internal unresolveds (suppressed from public)**: 7
- **Status**: **PUBLISHED**

### Ivybrook Academy (`ivybrook-academy`)

- **Primary**: `ivybrook-academy-2025-v2` (reconciled, FY2025)
- **Harvested for depth**: `ivybrook-academy-2025`
- **Headline**: fee `$50,000` · investment `$540,700 to $869,860` · royalty `7.0` · units `{'franchised': 40, 'company': 1, 'total': 41}` (franchised `None`, company `None`)
- **Item 19**: present
- **Auditor**: not surfaced
- **Filing-year deltas vs harvest**: 2
  - `franchise_fee`: was `$50,000 (non-refundable)` → now `$50,000` (vs `ivybrook-academy-2025`)
  - `royalty`: was `7% of Gross Revenue, paid monthly by the 6th of the month` → now `7.0` (vs `ivybrook-academy-2025`)
- **Red flags**: 4
  - [warning] contradiction: Table 3 n=19 vs Table 2C n=18
  - [warning] contradiction: 40 vs 41 outlets at 2024 year-end
  - [warning] contradiction: Exhibit K label vs body label L
- **Internal unresolveds (suppressed from public)**: 11
- **Status**: **PUBLISHED**

### Burger King (`burger-king`)

- **Primary**: `burger-king-2025` (merged, FY2025)
- **Harvested for depth**: `merged-burger-king-2025`, `shadow-live-burger-king-2025`, `637918-2025-Burger-King`
- **Headline**: fee `$50,000 for 20-year term` · investment `None` · royalty `4.5% of Gross Sales` · units `None` (franchised `None`, company `None`)
- **Item 19**: present
- **Auditor**: not surfaced
- **Filing-year deltas vs harvest**: 4
  - `franchise_fee`: was `$50,000 standard (20-year term). Prorated for shorter terms, minimum $15,000. Fully earned at signing, nonrefundable.` → now `$50,000 for 20-year term` (vs `merged-burger-king-2025`)
  - `royalty`: was `4.5% of monthly Gross Sales (standard)` → now `4.5% of Gross Sales` (vs `merged-burger-king-2025`)
  - `franchise_fee`: was `$50,000 standard (20-year term). Prorated for shorter terms, minimum $15,000. Fully earned at signing, nonrefundable.` → now `$50,000 for 20-year term` (vs `637918-2025-Burger-King`)
  - `royalty`: was `4.5% of monthly Gross Sales (standard)` → now `4.5% of Gross Sales` (vs `637918-2025-Burger-King`)
- **Red flags**: 3
  - [warning] contradiction: Cover page investment range ($348K-$4.7M) spans all 6 formats without format-level clarification.
  - [warning] contradiction: 38-unit gap: Carrols 1,023 vs. reacquisition column 1,061.
  - [warning] contradiction: Base Fee definition allows future royalty increase above 4.5%.
- **Internal unresolveds (suppressed from public)**: 9
- **Status**: **PUBLISHED**

### Qdoba Mexican Eats (`qdoba-mexican-eats`)

- **Primary**: `qdoba-2025` (v2, FY2025)
- **Harvested for depth**: `shadow-fresh-qdoba-2025`, `640022-2025-Qdoba-Qdoba-Mexican-Eats-Qdoba-Mexican-Grill`
- **Headline**: fee `$40,000` · investment `None` · royalty `` · units `None` (franchised `None`, company `None`)
- **Item 19**: absent
- **Auditor**: not surfaced
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 1
  - [warning] contradiction: {'issue': 'Item 19 Chart 2 uses 464 restaurants and reports avg net sales of $1,697,254. Chart 3 uses 397 restaurants and reports avg net sa
- **Internal unresolveds (suppressed from public)**: 11
- **Status**: **PARTIAL**

### Rocky Rococo Pizza and Pasta (`rocky-rococo-pizza-and-pasta`)

- **Primary**: `rocky-rococo-2025` (reconciled, FY2025)
- **Harvested for depth**: `shadow-live-rocky-rococo-2025`, `rocky-rococo-2025-shadow`
- **Headline**: fee `$25,000 (first unit); $17,500 (second unit)` · investment `None` · royalty `5% of gross sales weekly` · units `31` (franchised `24`, company `7`)
- **Item 19**: present
- **Auditor**: Vrakas, S.C., Brookfield, Wisconsin · opinion `None` (2025-03-06)
- **Filing-year deltas vs harvest**: 3
  - `franchise_fee`: was `$25,000` → now `$25,000 (first unit); $17,500 (second unit)` (vs `shadow-live-rocky-rococo-2025`)
  - `franchise_fee`: was `$25,000` → now `$25,000 (first unit); $17,500 (second unit)` (vs `rocky-rococo-2025-shadow`)
  - `royalty`: was `{'rate': '5%', 'base': 'gross sales', 'frequency': 'weekly', 'reduced_rate': '3.5% if annual sales below $425,000', 'sou` → now `5% of gross sales weekly` (vs `rocky-rococo-2025-shadow`)
- **Red flags**: 4
  - [warning] contradiction: {'field': 'territory_exclusivity', 'value_a': '1-mile radius protection during term', 'value_b': 'You will not receive an exclusive territor
  - [warning] contradiction: {'field': 'computer_access', 'value_a': 'RFC does not have access to your computer information', 'value_b': 'Franchisee must establish dedic
  - [warning] contradiction: {'field': 'noncompete_radius', 'value_a': '5 miles (FA)', 'value_b': '50 miles (FDA)', 'source_a': 'Item 17, FA Sect. XVI.D', 'source_b': 'I
- **Internal unresolveds (suppressed from public)**: 7
- **Status**: **PUBLISHED**

### Chick-fil-A (`chick-fil-a`)

- **Primary**: `chick-fil-a-2025` (reconciled, FY2025)
- **Headline**: fee `$0` · investment `None` · royalty `` · units `None` (franchised `None`, company `None`)
- **Item 19**: present
- **Auditor**: not surfaced
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 2
  - [warning] contradiction: Item 20 Table 1 shows 2023 Franchised Restaurants starting at 2,331 but Table 3 2023 totals show start of 2,331 — however Table 1 shows 2022
  - [warning] bankruptcy: {'franchisor_bankruptcy': False, 'item4_disclosure_exists': True, 'description': 'Pier 1 Imports, Inc. filed Chapter 11 on February 17, 2020
- **Internal unresolveds (suppressed from public)**: 4
- **Status**: **PUBLISHED**

### Anago Cleaning Systems (`anago-cleaning-systems`)

- **Primary**: `anago-cleaning-systems-2026` (publish_gate, FY2026)
- **Headline**: fee `$98,000` · investment `$219,000 to $339,000` · royalty `` · units `None` (franchised `None`, company `None`)
- **Item 19**: present
- **Auditor**: Miller CPA, PLLC · opinion `Clean (unqualified)` (2026-03-11)
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 1
  - [warning] bankruptcy: {'disclosed': 'None', 'source_pages': [13], 'confidence': 'high'}
- **Internal unresolveds (suppressed from public)**: 4
- **Status**: **PUBLISHED**

### Cruise Planners (`cruise-planners`)

- **Primary**: `cruise-planners-2025` (publish_gate, FY2025)
- **Headline**: fee `$695 to $10,995` · investment `None` · royalty `` · units `None` (franchised `None`, company `None`)
- **Item 19**: present
- **Auditor**: not surfaced
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 0
- **Internal unresolveds (suppressed from public)**: 6
- **Status**: **PUBLISHED**

### Cupbop (`cupbop`)

- **Primary**: `cupbop-2025` (publish_gate, FY2025)
- **Headline**: fee `$40,000` · investment `None` · royalty `` · units `None` (franchised `None`, company `None`)
- **Item 19**: present
- **Auditor**: not surfaced
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 1
  - [warning] bankruptcy: {'required_disclosure': False, 'evidence_pages': [11]}
- **Internal unresolveds (suppressed from public)**: 9
- **Status**: **PUBLISHED**

### Jiffy Lube (`jiffy-lube`)

- **Primary**: `jiffy-lube-2025` (publish_gate, FY2025)
- **Headline**: fee `$35,000` · investment `$211,000 to $510,000` · royalty `0.04` · units `2075` (franchised `1721`, company `354`)
- **Item 19**: present
- **Auditor**: Ernst & Young LLP · opinion `unqualified` (None)
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 1
  - [warning] bankruptcy: {'disclosure': 'None required', 'source_pages': [26], 'confidence': 'high'}
- **Internal unresolveds (suppressed from public)**: 5
- **Status**: **PUBLISHED**

### The Joint Chiropractic (`the-joint-chiropractic`)

- **Primary**: `the-joint-chiropractic-2025` (publish_gate, FY2025)
- **Headline**: fee `$39,900` · investment `$245,250 to $543,000` · royalty `{'rate': 0.07, 'minimum': 700, 'minimum_unit': 'per month', 'calculation_basis':` · units `970` (franchised `845`, company `125`)
- **Item 19**: present
- **Auditor**: BDO USA, P.C. · opinion `unqualified` (2025-03-11)
- **Filing-year deltas vs harvest**: 0
- **Red flags**: 1
  - [warning] bankruptcy: {'franchisor_bankruptcy': False, 'officer_bankruptcy': {'person': 'Craig Sherwood (SVP Development)', 'entity': "GGI Holdings, LLC (Gold's G
- **Internal unresolveds (suppressed from public)**: 6
- **Status**: **PARTIAL**

## First-200 Batch Phase (publish set)

Source: `/Users/shelly/Franchiese/runs` · 63 franchises from completed fresh-NN runs.

| Slot | Franchise | Slug | Primary Run | Harvest | FY | Schema | Fee | Royalty | Units | I19 | Status |
|---:|---|---|---|---:|---:|:-:|---|---|---:|:-:|---|
| 1 | Cookie Advantage | `cookie-advantage` | `fresh-01-637906-2025-cookie-advantage-20260414-215751` | 3 | 2025 | ? | $34,900 | 6% of Gross Revenue | 23 | yes | PARTIAL |
| 2 | EOS Worldwide | `eos-worldwide` | `fresh-02-637907-2025-eos-worldwide-20260414-222422` | 3 | 2025 | B | $5,000 | — | — | yes | PUBLISHED |
| 3 | Elmer's Breakfast Lunch Dinner | `elmers-breakfast-lunch-dinner-restaurant-egg-n-joe` | `fresh-03-637908-2025-elmers-breakfast-lunch-dinner-restaurant-egg-n-joe-20260414-225128` | 1 | 2025 | B | — | — | — | yes | PARTIAL |
| 5 | Sweat440 Franchise Systems, LLC | `sweat440` | `fresh-05-637910-2025-sweat440-20260414-234304` | 1 | 2025 | B | — | — | — | yes | PARTIAL |
| 6 | Ivan Ramen Franchising LLC | `ivan-ramen` | `fresh-06-637911-2025-ivan-ramen-20260415-001003` | 1 | 2025 | B | $35,000 | — | — | no | PUBLISHED |
| 7 | Home Halo | `home-halo` | `fresh-07-637912-2025-home-halo-20260415-004402` | 1 | 2025 | C | $49,000 | 5% of Gross Sales | — | yes | PARTIAL |
| 10 | Rytech | `rytech` | `fresh-10-637915-2025-rytech-20260415-014020` | 1 | 2025 | B | — | 8% | 94 | yes | PUBLISHED |
| 11 | Bostons The Gourmet Pizza Restaurant Sports Bar | `bostons-the-gourmet-pizza-restaurant-sports-bar` | `fresh-11-637917-2025-bostons-the-gourmet-pizza-restaurant-sports-bar-20260415-020523` | 0 | 2025 | F | — | — | — | yes | PARTIAL |
| 13 | Taco Cabana Franchising, Inc. | `taco-cabana` | `fresh-13-637919-2025-taco-cabana-20260415-025821` | 0 | 2025 | B | $45,000 (standalone); $35,000 (DA subsequent) | 5% of Gross Sales, weekly | — | yes | PUBLISHED |
| 14 | Caption by Hyatt | `caption-by-hyatt` | `fresh-14-637920-2025-caption-by-hyatt-20260415-032153` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 15 | Hyatt Franchising, L.L.C. | `hyatt-centric` | `fresh-15-637921-2025-hyatt-centric-20260415-034513` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 16 | Destination by Hyatt | `destination-by-hyatt` | `fresh-16-637922-2025-destination-by-hyatt-20260415-040911` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 17 | Hyatt House Franchising, L.L.C. | `hyatt-house-hotels` | `fresh-17-637923-2025-hyatt-house-hotels-20260415-043322` | 0 | 2025 | B | — | 5% | — | yes | PUBLISHED |
| 18 | JdV by Hyatt | `jdv-by-hyatt` | `fresh-18-637924-2025-jdv-by-hyatt-20260415-045854` | 0 | 2025 | B | Greater of $100,000 or $400 per guest room | 7% | — | yes | PUBLISHED |
| 19 | Hyatt Place | `hyatt-place-hotels` | `fresh-19-637925-2025-hyatt-place-hotels-20260415-052748` | 0 | 2025 | B | — | 5% | — | no | PUBLISHED |
| 20 | Hyatt Franchising, L.L.C. | `hyatt-regency` | `fresh-20-637926-2025-hyatt-regency-20260415-055135` | 0 | 2025 | B | — | — | 100 | yes | PUBLISHED |
| 21 | Hyatt Franchising, L.L.C. | `hyatt-studios` | `fresh-21-637927-2025-hyatt-studios-20260415-061338` | 0 | 2025 | B | — | 5% | — | no | PUBLISHED |
| 22 | Hyatt Franchising, L.L.C. | `the-unbound-collection-by-hyatt` | `fresh-22-637928-2025-the-unbound-collection-by-hyatt-20260415-063845` | 0 | 2025 | B | Greater of $100,000 or $400 per guest room | 7% | 18 | yes | PUBLISHED |
| 23 | Paul Davis Restoration | `paul-davis-restoration` | `fresh-23-637929-2025-paul-davis-restoration-20260415-070221` | 0 | 2025 | D | — | — | — | yes | PARTIAL |
| 24 | ESH Strategies Franchise LLC | `extended-stay-america-premier-suites` | `fresh-24-637930-2025-extended-stay-america-premier-suites-20260415-073341` | 0 | 2025 | B | $50,000 | 5.5% | — | yes | PUBLISHED |
| 25 | Extended Stay America Suites | `extended-stay-america-suites` | `fresh-25-637931-2025-extended-stay-america-suites-20260415-082520` | 0 | 2025 | F | $50,000 | 0.055 | — | yes | PUBLISHED |
| 26 | ESH Strategies Franchise LLC | `extended-stay-america-select-suites` | `fresh-26-637932-2025-extended-stay-america-select-suites-20260415-085128` | 0 | 2025 | B | $50,000 | 5.5% | 211 | yes | PUBLISHED |
| 27 | Aumbio | `aumbio` | `fresh-27-637933-2025-aumbio-20260415-092225` | 0 | 2025 | C | $50,000 | — | — | no | PARTIAL |
| 28 | Jazzercise | `jazzercise` | `fresh-28-637934-2025-jazzercise-20260415-094853` | 0 | 2025 | ? | $1,250 | 20% of gross member enrollment | — | no | PARTIAL |
| 29 | DQ Grill & Chill | `dq-grill-chill` | `fresh-29-637935-2025-dq-grill-chill-20260415-101218` | 0 | 2025 | B | — | 4% of Gross Sales | — | no | PUBLISHED |
| 30 | DQ Treat | `dq-treat-franchise` | `fresh-30-637936-2025-dq-treat-franchise-20260415-103931` | 0 | 2025 | E | — | 5% of Gross Sales | — | no | PUBLISHED |
| 31 | Pillar To Post Home Inspectors | `pillar-to-post-home-inspectors` | `fresh-31-637937-2025-non-exclusive-territory-20260415-104142` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 32 | Papa Murphy's International LLC | `papa-murphys` | `fresh-32-637938-2025-papa-murphys-20260415-104222` | 0 | 2025 | B | $25,000 | 0.05 | 1079 | yes | PUBLISHED |
| 33 | WorldKids School | `worldkids-school` | `fresh-33-637939-2025-worldkids-school-20260415-104228` | 0 | 2025 | F | — | 0.06 | — | yes | PUBLISHED |
| 34 | Magnuson Franchising, LLC | `magnuson-hotels-and-magnuson-grand` | `fresh-34-637940-2025-magnuson-hotels-and-magnuson-grand-20260415-104249` | 0 | 2025 | B | $10,000 | — | — | no | PUBLISHED |
| 35 | Fish & Chips Gordon Ramsay | `fish-chips` | `fresh-35-637941-2025-fish-chips-20260415-104259` | 0 | 2025 | B | $50,000 | 5% | — | yes | PUBLISHED |
| 36 | Taco Bell | `taco-bell-taco-bell-express-traditional` | `fresh-36-637942-2025-taco-bell-taco-bell-express-traditional-20260415-104313` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 37 | Taco Bell Express | `taco-bell-express-taco-bell` | `fresh-37-637943-2025-taco-bell-express-taco-bell-20260415-104320` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 38 | Street Pizza | `street-pizza` | `fresh-38-637944-2025-street-pizza-20260415-104330` | 0 | 2025 | E | $50,000 | 5% | — | no | PUBLISHED |
| 39 | New York Fries | `new-york-fries` | `fresh-39-637945-2025-new-york-fries-20260415-104337` | 0 | 2025 | ? | $30,000 | 6% | — | no | PARTIAL |
| 40 | NaturaLawn of America, Inc. | `naturalawn-of-america` | `fresh-40-637946-2025-naturalawn-of-america-20260415-104343` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 41 | Teamlogic IT | `teamlogic-it` | `fresh-41-637948-2025-teamlogic-it-20260415-104350` | 0 | 2025 | ? | $49,500 | — | — | yes | PARTIAL |
| 119 | Wireless Zone | `wireless-zone` | `fresh-119-638041-2025-wireless-zone-20260415-110104` | 0 | 2025 | ? | — | — | — | yes | PARTIAL |
| 120 | Regal Nails, Salon & Spa | `regal-nails-salon-spa` | `fresh-120-638042-2025-regal-nails-salon-spa-20260415-112648` | 0 | 2025 | ? | — | — | — | no | PARTIAL |
| 122 | Trend Hotels and Suites by My Place | `trend-hotels` | `fresh-122-638045-2025-trend-hotels-20260415-121720` | 0 | 2025 | F | — | — | — | no | PARTIAL |
| 123 | YESCO | `yesco` | `fresh-123-638046-2025-yesco-20260415-124344` | 0 | 2025 | B | $50,000 | Greater of $1,000 or 6% of Gross Revenue | — | yes | PUBLISHED |
| 124 | ProColor Collision USA LLC | `procolor-collision` | `fresh-124-638047-2025-procolor-collision-20260415-130853` | 0 | 2025 | B | $20,000 | — | — | no | PUBLISHED |
| 125 | Gong cha | `gong-cha-unit-franchise-program` | `fresh-125-638048-2025-gong-cha-unit-franchise-program-20260415-133501` | 0 | 2025 | B | $34,500 | 6% | — | yes | PUBLISHED |
| 126 | Novus Glass | `novus-novus-glass` | `fresh-126-638049-2025-novus-novus-glass-20260415-135918` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 127 | Canopy by Hilton | `canopy-and-canopy-by-hilton` | `fresh-127-638050-2025-canopy-and-canopy-by-hilton-20260415-142451` | 0 | 2025 | F | — | — | — | no | PARTIAL |
| 128 | Curio Collection by Hilton | `curio-a-collection-by-hilton` | `fresh-128-638051-2025-curio-a-collection-by-hilton-20260415-145056` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 129 | Hilton Franchise Holding LLC | `doubletree-by-hilton` | `fresh-129-638052-2025-doubletree-by-hilton-20260415-151437` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 130 | Hilton Franchise Holding LLC | `embassy-suites-hotels` | `fresh-130-638053-2025-embassy-suites-hotels-20260415-154442` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 131 | Great Clips, Inc. | `great-clips` | `fresh-131-638054-2025-great-clips-20260415-161606` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 132 | Hilton Franchise Holding LLC | `graduate-by-hilton` | `fresh-132-638055-2025-graduate-by-hilton-20260415-163939` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 133 | Hampton Inn Hampton Inn And Suites | `hampton-inn-hampton-inn-and-suites` | `fresh-133-638056-2025-hampton-inn-hampton-inn-and-suites-20260415-171237` | 0 | 2025 | C | — | 6% of GRR | 2369 | yes | PARTIAL |
| 134 | Hilton Garden Inn | `hilton-garden-inn` | `fresh-134-638057-2025-hilton-garden-inn-20260415-173936` | 0 | 2025 | B | — | — | — | yes | PARTIAL |
| 135 | Hilton Hotels & Resorts | `hilton-hotels-resorts` | `fresh-135-638058-2025-hilton-hotels-resorts-20260415-180210` | 0 | 2025 | ? | $85,000 + $400/room over 250 | — | — | yes | PARTIAL |
| 136 | Hilton Franchise Holding LLC | `home2-suites-by-hilton` | `fresh-136-638059-2025-home2-suites-by-hilton-20260415-182504` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 137 | Hilton Franchise Holding LLC | `homewood-suites-by-hilton` | `fresh-137-638060-2025-homewood-suites-by-hilton-20260415-184817` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 138 | Hilton Franchise Holding LLC | `livsmart-studios-by-hilton` | `fresh-138-638061-2025-livsmart-studios-by-hilton-20260415-191912` | 0 | 2025 | B | — | 6% | — | no | PUBLISHED |
| 139 | Hilton Franchise Holding LLC | `lxr-hotels-resorts` | `fresh-139-638062-2025-lxr-hotels-resorts-20260415-194238` | 0 | 2025 | B | — | 5% | — | no | PUBLISHED |
| 140 | Motto by Hilton | `motto-by-hilton` | `fresh-140-638064-2025-motto-by-hilton-20260415-200808` | 0 | 2025 | F | — | — | — | no | PARTIAL |
| 141 | Hilton Franchise Holding LLC | `spark-by-hilton` | `fresh-141-638065-2025-spark-by-hilton-20260415-203051` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 142 | Hilton Franchise Holding LLC | `tapestry-collection-by-hilton` | `fresh-142-638066-2025-tapestry-collection-by-hilton-20260415-205417` | 0 | 2025 | B | — | — | — | no | PARTIAL |
| 143 | Tempo by Hilton | `tempo-by-hilton` | `fresh-143-638068-2025-tempo-by-hilton-20260415-212039` | 0 | 2025 | B | — | — | — | no | PARTIAL |
