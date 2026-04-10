import type { BrandPageModel } from "@/lib/brand-page-model"

// Source: runs/mcdonalds-2025-merged-v2/
//   09_final_canonical.json (Item 5, 7)
//   11_canonical_enriched.json (Item 1, 6, 19, 20, 21, contract burden depth)
//   12_canonical_enriched_v2.json (depth-pass promoted: contract burden, financial notes, Item 21 detail, Item 6 fee detail)
// FDD ID: 638437-2025. Filing year 2025. All facts traceable to FDD; no derived/illustrative economics.

export const mcdonaldsBrandPage: BrandPageModel = {
  provenance: {
    fddId: "638437-2025",
    filingYear: "2025",
    franchisorLegalName: "McDonald's USA, LLC",
    runArtifacts: [
      "runs/mcdonalds-2025-merged-v2/09_final_canonical.json",
      "runs/mcdonalds-2025-merged-v2/11_canonical_enriched.json",
      "runs/mcdonalds-2025-merged-v2/12_canonical_enriched_v2.json",
      "runs/mcdonalds-2025-merged-v2/RT_depth_state_addenda_promotion.json",
      "runs/mcdonalds-2025-merged-v2/RT_depth_contract_burdens.json",
      "runs/mcdonalds-2025-merged-v2/RT_depth_financial_notes.json",
    ],
    sourceMap: "runs/mcdonalds-2025-merged-v2/01_source_map.md",
  },

  hero: {
    brandName: "McDonald's",
    category: "Quick Service Restaurant",
    filingYear: "2025",
    verificationLabel: "Government-filed FDD · McDonald's USA, LLC · 638437-2025",
    thesis:
      "You are buying operational scale on someone else's real estate. Revenue is strong and well-disclosed, but the contract gives McDonald's broad control and limited exit options.",
    keyMetrics: [
      { label: "Initial investment (Traditional)", value: "$1.47M – $2.73M", sublabel: "Item 7" },
      { label: "Initial franchise fee", value: "$45,000", sublabel: "Traditional · Item 5" },
      { label: "Royalty (new restaurants)", value: "5% of Gross Sales", sublabel: "4% legacy pre-2024" },
      { label: "Avg. unit revenue", value: "$4.00M", sublabel: "12,572 traditional units · Item 19" },
      { label: "Total U.S. units", value: "13,559", sublabel: "12,887 franchised / 672 company" },
      { label: "Net unit growth 2024", value: "+102", sublabel: "vs +2 in 2023" },
    ],
    positives: [
      "78% of franchised units top $3M in annual sales. Median: $3.80M. This is one of the most transparent revenue disclosures in any FDD.",
      "The franchisor is financially sound — $10.6B revenue, $3.46B net income, clean audit opinion from Ernst & Young.",
      "13,559 U.S. units with 95% franchised. The system is large, mature, and added 102 net units in 2024 after two flat years.",
    ],
    cautions: [
      "No exclusive territory. McDonald's can open another location near yours at any time, and the contract cannot change that.",
      "You don't own the real estate. Rent — base plus pass-through plus percentage rent — stacks on top of royalty, advertising, and tech fees.",
      "Item 19 math uses the old 4% royalty. New operators pay 5%. That gap understates your ongoing costs by roughly $30K–$40K a year at median revenue.",
    ],
  },

  guidedSummary: [
    {
      id: "cost-to-enter",
      title: "Cost to enter",
      verdict: "$1.47M–$2.73M total. The $45K franchise fee is a small slice — most of the cash goes to build-out, equipment, and signage.",
      whyItMatters:
        "This is the high end of QSR investment. The real gate is construction capital, not the initial fee.",
      severity: "caution",
    },
    {
      id: "revenue-quality",
      title: "Can you trust the revenue numbers?",
      verdict: "Yes, with one caveat. McDonald's discloses averages, medians, and percentile bands across 12,572 units — unusually transparent. But the pro forma uses a 4% royalty that no longer applies to new entrants.",
      whyItMatters:
        "The data is real and the sample is large. Just adjust for the 5% royalty rate you will actually pay.",
      severity: "neutral",
    },
    {
      id: "stability",
      title: "Is the system growing?",
      verdict: "Yes. Net +102 units in 2024 after two near-flat years. Closures are low. But 843 ownership transfers in one year means operators sell frequently.",
      whyItMatters:
        "Growth is healthy. Transfer volume is the signal to investigate — ask operators why they sold.",
      severity: "neutral",
    },
    {
      id: "contract",
      title: "How much control do you give up?",
      verdict: "Nearly all of it. No exclusive territory. McDonald's owns the real estate, sets the standards, and can buy you out at fair market value with no payment for goodwill.",
      whyItMatters:
        "You operate a proven system, but your exit options are narrow and your leverage is limited.",
      severity: "high",
    },
    {
      id: "fit",
      title: "Who should consider this franchise?",
      verdict: "Operators who want scale and brand power and are comfortable following a strict playbook on someone else's property. Not suited for passive investors or independent operators.",
      whyItMatters:
        "The FA requires 100% equity ownership, full-time involvement, and best-efforts operation. This is a hands-on commitment.",
    },
  ],

  economics: {
    investment: {
      rangeLow: 1471000,
      rangeHigh: 2728000,
      buckets: [
        { label: "Traditional", low: 1471000, high: 2728000 },
        { label: "STO / STR", low: 1014500, high: 1793500 },
        { label: "Satellite", low: 525000, high: 1193500 },
      ],
      takeaways: [
        "Traditional is the main format. Most prospective operators should plan around the $1.47M–$2.73M range.",
        "The $45K franchise fee is less than 3% of the total outlay. Equipment, construction, and signage are where the money goes.",
      ],
    },
    ongoingFees: {
      components: [
        { label: "Royalty (new restaurants, post-2024)", value: "5% of Gross Sales", type: "recurring" },
        { label: "Royalty (legacy pre-2024)", value: "4% of Gross Sales", type: "recurring" },
        { label: "Advertising minimum", value: "4% of Gross Sales", type: "recurring" },
        { label: "OPNAD (national co-op)", value: "2.25% of sales", type: "recurring" },
        {
          label: "Percentage rent (Traditional, post-2026-01-14)",
          value: "6% – 23% of Gross Sales",
          type: "recurring",
          note: "Year-8 minimum 11.5%; payable only above base threshold.",
        },
        {
          label: "Required tech fees",
          value: "≈ $10,544 / year",
          type: "recurring",
          note: "Sum of non-optional annual technology fees from the Item 6 fee schedule.",
        },
        {
          label: "Audit cost shift",
          value: "Triggered at 2% understatement of Gross Sales",
          type: "conditional",
        },
        {
          label: "Default interest",
          value: "15% per annum, monthly compounding",
          type: "conditional",
        },
      ],
      takeaways: [
        "Before you even pay rent, royalty + advertising + OPNAD takes ~11% of every dollar. Add percentage rent and tech fees, and recurring extraction reaches 20–30%+ of Gross Sales.",
        "Percentage rent — not royalty — is the largest variable cost. It is driven by the real estate deal, not the franchise agreement.",
      ],
    },
    item19: {
      headlineMetric: "$4,002,000",
      metricLabel: "Average annual sales (all traditional)",
      period: "2024",
      sampleSize: "12,572 traditional restaurants (12,023 franchised + 549 McOpCo)",
      revenueType: "gross",
      basis: "All traditional U.S. restaurants open ≥ 1 year",
      qualityFlags: [
        { label: "Sample size", status: "good", note: "12,572 units. One of the largest samples in any FDD." },
        { label: "Breakdown", status: "good", note: "Franchised and company-owned are reported separately, so you can compare." },
        { label: "Revenue type", status: "good", note: "Gross sales — clearly defined in the franchise agreement." },
        { label: "Profit level shown", status: "mixed", note: "Shows operating income before occupancy (OIBOC), not net profit. Rent, debt, and depreciation are excluded." },
        { label: "Royalty rate used", status: "caution", note: "Uses 4% (legacy). You will pay 5%. That understates costs by ~$30K–$40K/year at median revenue." },
      ],
      takeaways: [
        "Median franchised revenue is $3.80M. 78% of franchised units clear $3.0M. The data is strong.",
        "The $734K OIBOC at $3.0M sales is not take-home income. Rent, royalty, advertising, debt service, and depreciation come out of that number.",
      ],
    },
  },

  systemStability: {
    ownershipMix: [
      { label: "Franchised", value: 12887 },
      { label: "Company-owned (McOpCo)", value: 672 },
    ],
    annualMovement: [
      { year: "2022", openings: 86, closures: 51, transfers: 1169 },
      { year: "2023", openings: 131, closures: 111, transfers: 672 },
      { year: "2024", openings: 181, closures: 47, transfers: 843 },
    ],
    topStates: [
      { state: "TX", units: Math.round(13559 * 0.088) },
    ],
    takeaways: [
      "181 openings vs. 47 closures in 2024 — the strongest year in this three-year window.",
      "843 transfers in one year means roughly 1 in 15 franchised units changed hands. That is normal for this system, but ask operators what drove their decision to sell.",
    ],
  },

  contractBurden: {
    overallVerdict:
      "The contract is heavily franchisor-favored. McDonald's controls the real estate, the standards, and most exit mechanics. Operator autonomy is narrow by design.",
    familyScores: [
      {
        family: "territory",
        severity: "high",
        summary: "No exclusive territory. McDonald's can open or approve a new location near you at any time, with no obligation to consult or compensate.",
        evidencePoints: ["Item 12", "FA territory clauses"],
      },
      {
        family: "supplier",
        severity: "caution",
        summary: "Approved suppliers and approved products only. The tech stack alone runs ~$10.5K/year in mandatory fees across 22 line items.",
        evidencePoints: ["Item 8", "Item 6 tech fee schedule"],
      },
      {
        family: "operations",
        severity: "high",
        summary: "Open 7 days, 7am–11pm minimum. McDonald's can change the system — manuals, equipment, technology — at any time, with no cap on cost or frequency.",
        evidencePoints: ["FA §7 (operations)", "Item 11 (manual)"],
      },
      {
        family: "transfer",
        severity: "high",
        summary: "When you sell, McDonald's gets 20 days' notice and 10 days to match. Your royalty rate resets to current on transfer, and you remain liable for the full original term even after selling.",
        evidencePoints: ["FA §15 (transfer)", "Exhibit N (guaranty)"],
      },
      {
        family: "termination",
        severity: "high",
        summary: "If you are terminated, McDonald's can buy your restaurant at fair market value — but pays nothing for goodwill or brand value. A $5,000 judgment or 30 days overdue can trigger default.",
        evidencePoints: ["FA §16 (termination)", "FA §17 (default)"],
      },
      {
        family: "post_term",
        severity: "caution",
        summary: "After you leave, the non-compete covers 18 months / 10 miles and extends to your landlord relationships. McDonald's can recover its legal fees from you, but not the reverse.",
        evidencePoints: ["FA §18 (non-compete)", "FA §19 (indemnification)"],
      },
    ],
    takeaways: [
      "Most of the burden traces to one fact: McDonald's owns the real estate and you don't. That shapes territory, rent, transfer, and termination.",
      "Exit is the weakest point. Fair market value with no goodwill means your upside at sale or termination is structurally capped.",
    ],
  },

  stateAddenda: {
    overallVerdict:
      "Six states materially modify the default Franchise Agreement. The most economically valuable overrides are North Dakota (post-term non-compete largely unenforceable), Minnesota (cure rights and reasonableness on transfer), and Washington (no-poach removed under AG enforcement).",
    entries: [
      {
        state: "California",
        affectedFamily: "Operational compliance cost shift",
        overrideSummary:
          "Items 1, 5, 6, 7, 11 modified for the California Fast Food Act (AB 1228). Franchisee solely responsible for AB 1228 compliance. Franchisor provides no related training, assistance, or fee adjustment.",
        whyItMatters:
          "California operators absorb the entire AB 1228 labor-cost increase without subsidy. Materially raises Item 19 pro-forma downside for CA locations.",
        sourcePages: [383],
        severity: "high",
      },
      {
        state: "Hawaii",
        affectedFamily: "Anti-waiver / anti-fraud",
        overrideSummary:
          "Item 17 anti-waiver: no questionnaire or acknowledgement signed at commencement can waive Hawaii Franchise Investment Law claims, including fraud in the inducement.",
        whyItMatters:
          "Preserves the right to bring fraud-in-inducement claims regardless of any 'nothing was promised' acknowledgement — a meaningful exception to the standard release regime.",
        sourcePages: [383, 384],
        severity: "caution",
      },
      {
        state: "Maryland",
        affectedFamily: "Release / forum / limitations period",
        overrideSummary:
          "Releases required for renewal/transfer do not apply to Maryland Franchise Registration and Disclosure Law claims. MD-law claims may be brought in Maryland subject to arbitration. 3-year limitations period for MD-law claims after grant.",
        whyItMatters:
          "Statutory rights survive the otherwise-strict Illinois venue and release regime, but the 3-year clock is shorter than the 20-year FA term.",
        sourcePages: [384],
        severity: "caution",
      },
      {
        state: "Minnesota",
        affectedFamily: "Termination notice / cure / transfer",
        overrideSummary:
          "Minn. Stat. 80C.14 applies: 90 days' notice of termination, 60 days to cure, 180 days' notice for non-renewal, and consent to transfer cannot be unreasonably withheld. Item 13 adds franchisor trademark defense.",
        whyItMatters:
          "Significantly stronger due-process protection than the default — structured cure rights, 6-month non-renewal notice, and a reasonableness standard on transfer denials.",
        sourcePages: [384, 385],
        severity: "neutral",
      },
      {
        state: "North Dakota",
        affectedFamily: "Non-compete / governing law",
        overrideSummary:
          "Post-term non-compete covenants are generally unenforceable under North Dakota law. North Dakota law governs ND Franchise Investment Law claims.",
        whyItMatters:
          "The single most economically valuable override — restores the right to operate any future QSR business in North Dakota after term, neutralizing the default 18-month / 10-mile post-term non-compete.",
        sourcePages: [385],
        severity: "neutral",
      },
      {
        state: "Washington",
        affectedFamily: "Relationship law / no-poach removal",
        overrideSummary:
          "Washington Franchise Investment Protection Act prevails over inconsistent FA/FDD provisions. Per a Washington AOD, no-hire/no-poach provisions are removed from the form FA, will not be enforced in existing FAs, and franchisees must be notified.",
        whyItMatters:
          "Only state with on-record AG enforcement against McDonald's no-poach provisions. Strongly protects employee mobility between WA McDonald's restaurants.",
        sourcePages: [385],
        severity: "neutral",
      },
    ],
    statesWithoutAddendum: [
      "Wisconsin (no Exhibit T addendum present)",
      "New York",
      "Illinois",
      "Virginia",
      "Indiana",
      "Rhode Island",
      "South Dakota",
    ],
    takeaways: [
      "Default contract is built around Illinois venue and a strict release regime — state addenda are the main vehicle for any operator-favorable carve-outs.",
      "If you are looking at a California unit, model the Item 19 economics with explicit Fast Food Act labor-cost loading; the FDD does not.",
    ],
  },

  financialStrength: {
    highlights: [
      { label: "Auditor", value: "Ernst & Young LLP (Chicago)", severity: "neutral" },
      { label: "Audit opinion", value: "Unqualified (clean)", note: "Report dated March 14, 2025", severity: "neutral" },
      { label: "Going concern doubt", value: "None raised", severity: "neutral" },
      { label: "Total revenue 2024", value: "$10,630.8M", note: "vs $10,568.4M in 2023" },
      { label: "Net income 2024", value: "$3,461.6M", note: "vs $3,394.4M in 2023" },
      { label: "Total assets 2024", value: "$22,195.3M" },
      { label: "Members' equity 2024", value: "$10,222.0M", note: "Flat YoY: all net income dividended to parent" },
      {
        label: "Intercompany payable to parent",
        value: "$2,400M converted to equity 2/17/2025",
        note: "Disclosed as subsequent event",
        severity: "neutral",
      },
      {
        label: "IP royalty paid to parent",
        value: "2% of restaurant sales (~$1,069.4M in 2024)",
        note: "Reduces McDonald's USA operating income before consolidation",
        severity: "caution",
      },
    ],
    takeaways: [
      "The franchisor is financially sound. $10.6B in revenue, clean audit, no going-concern warning.",
      "Cash balance looks small ($34.6M) only because 100% of net income is dividended upstream to McDonald's Corporation every year.",
    ],
  },

  redFlags: [
    {
      title: "No exclusive territory",
      severity: "high",
      summary: "McDonald's can open or approve a new restaurant near yours at any time. No consent required, no compensation owed.",
      whyItMatters: "This is not a hypothetical risk — it is how the contract is written. You cannot negotiate territorial exclusivity in the standard franchise agreement.",
      linkedSectionId: "contract",
    },
    {
      title: "Termination buyout excludes goodwill",
      severity: "high",
      summary: "If terminated, McDonald's can buy your restaurant at fair market value but pays nothing for goodwill, brand value, or any other intangible.",
      whyItMatters: "Years of building a customer base are worth zero at termination. This caps your downside protection and gives the franchisor the leverage.",
      linkedSectionId: "contract",
    },
    {
      title: "Item 19 uses the wrong royalty rate for new operators",
      severity: "caution",
      summary: "The pro-forma economics assume a 4% royalty. Since January 2024, new operators pay 5%.",
      whyItMatters: "At $3.8M median revenue, that 1% gap is roughly $38K/year less cash flow than Item 19 implies. Adjust any scenario math accordingly.",
      linkedSectionId: "economics",
    },
    {
      title: "You stay liable after you sell",
      severity: "caution",
      summary: "Selling the franchise does not release you from the original contract. Royalty also resets to the current rate on transfer.",
      whyItMatters: "Both the resale price and your ongoing liability move against you as the seller. Factor this into any long-term exit plan.",
      linkedSectionId: "contract",
    },
    {
      title: "Internal data disagrees by one unit",
      severity: "caution",
      summary: "Item 20 counts 12,887 franchised + 672 company-owned. The audited financial statements say 12,886 + 671.",
      whyItMatters: "The difference is trivial. We preserve it rather than silently picking one — it is a minor transparency marker, not a material concern.",
      linkedSectionId: "stability",
    },
  ],

  franchiseeQuestions: [
    {
      category: "economics",
      question: "After royalty, advertising, rent, and tech fees, what percentage of your gross sales do you actually keep?",
      basedOn: "The FDD shows recurring extraction of 20–30%+ of Gross Sales, but the exact split varies by location and rent deal.",
    },
    {
      category: "economics",
      question: "The Item 19 pro forma assumes a 4% royalty. You pay 5%. How much did that difference actually affect your first-year cash flow?",
      basedOn: "New-entrant royalty is 5% since January 2024; pro forma still models 4%.",
    },
    {
      category: "economics",
      question: "What was your total tech-fee bill last year? Were there any surprise line items or mid-year additions?",
      basedOn: "Item 6 lists 22 technology fee components totaling ~$10.5K required + optional.",
    },
    {
      category: "operations",
      question: "How many times in the past two years did McDonald's require a new piece of equipment, a remodel, or a system upgrade? What did it cost you?",
      basedOn: "The FA allows unlimited unilateral system changes — no cap on frequency or cost.",
    },
    {
      category: "contract_exit",
      question: "When you or a peer tried to sell, what did McDonald's ROFR and the royalty reset do to the sale price?",
      basedOn: "McDonald's has a 20-day notice / 10-day match right of first refusal, and royalty resets on transfer.",
    },
    {
      category: "contract_exit",
      question: "Do you know anyone who went through a non-renewal? How did the FMV buyout work in practice — especially the 'no goodwill' part?",
      basedOn: "The FMV purchase option on termination explicitly excludes intangibles.",
    },
    {
      category: "support",
      question: "When McDonald's mandates a change you have to pay for, how much advance notice and support do you get?",
      basedOn: "System-change costs flow directly to franchisees under the unilateral modification clause.",
    },
  ],

  evidence: {
    sections: [
      {
        title: "Item 5 — Initial fees",
        items: [
          { label: "Traditional initial fee", detail: "$45,000", sourceRef: "Item 5, p.18" },
          { label: "STO / STR initial fee", detail: "$22,500", sourceRef: "Item 5, p.18" },
          { label: "Satellite initial fee", detail: "$500 (Walmart $0)", sourceRef: "Item 5, p.18" },
          { label: "Refund terms", detail: "Refunded only if construction not completed within 1 year of FA signing.", sourceRef: "Item 5, p.18" },
        ],
      },
      {
        title: "Item 7 — Initial investment ranges",
        items: [
          { label: "Traditional", detail: "$1,471,000 – $2,728,000", sourceRef: "Item 7, p.17" },
          { label: "STO / STR", detail: "$1,014,500 – $1,793,500", sourceRef: "Item 7, p.17" },
          { label: "Satellite", detail: "$525,000 – $1,193,500", sourceRef: "Item 7, p.17" },
        ],
      },
      {
        title: "Item 19 — Sales distribution",
        items: [
          { label: "All traditional", detail: "12,572 units · avg $4.00M · median $3.84M · 79% > $3.0M", sourceRef: "Item 19" },
          { label: "Franchised only", detail: "12,023 units · avg $3.97M · median $3.80M · 78% > $3.0M", sourceRef: "Item 19" },
          { label: "McOpCo only", detail: "549 units · avg $4.79M · median $4.61M · 96% > $3.0M", sourceRef: "Item 19" },
          { label: "Pro forma sample", detail: "11,332 franchised traditional restaurants open ≥ 1 year, excluding McOpCo, satellites, and 2024 ownership changes.", sourceRef: "Item 19 pro forma" },
        ],
      },
      {
        title: "Item 20 — System movement",
        items: [
          { label: "Franchised end-2024", detail: "12,887 (started 2024 at 12,772; +167 opened, –29 terminated, –15 non-renewed, –8 reacquired)", sourceRef: "Item 20" },
          { label: "Company-owned end-2024", detail: "672 (started at 685; +14 opened, +8 reacquired, –32 sold to franchisee, –3 closed)", sourceRef: "Item 20" },
          { label: "Transfers 2024", detail: "843 (vs 672 in 2023, 1,169 in 2022)", sourceRef: "Item 20" },
          { label: "Projected 2025 openings", detail: "181 franchised + 14 company = 195", sourceRef: "Item 20" },
        ],
      },
      {
        title: "Item 21 — Financial statements",
        items: [
          { label: "Auditor", detail: "Ernst & Young LLP (Chicago); report dated March 14, 2025; unqualified opinion.", sourceRef: "Item 21 / Exhibit A" },
          { label: "Total revenue 2024", detail: "$10,630.8M (vs $10,568.4M in 2023, $9,588.4M in 2022)", sourceRef: "Income statement" },
          { label: "Operating income 2024", detail: "$4,663.6M (after $1,069.4M royalty to parent)", sourceRef: "Income statement" },
          { label: "Net income 2024", detail: "$3,461.6M; entire amount dividended to parent.", sourceRef: "Cash flow statement" },
          { label: "Subsequent event", detail: "$2,400M intercompany payable converted to equity on February 17, 2025.", sourceRef: "Notes to financial statements" },
        ],
      },
      {
        title: "Item 6 — Technology fee detail (22 components)",
        items: [
          { label: "Required annual tech fees (sum)", detail: "≈ $10,544 / year", sourceRef: "Item 6 fee schedule" },
          { label: "All annual tech fees incl. optional", detail: "≈ $11,287 / year", sourceRef: "Item 6 fee schedule" },
          { label: "One-time tech fees (sum)", detail: "≈ $5,475 (Sesame $2,600 + Kiosk $1,500 + HHOT $500 + DMB 2.0 $264 + GRNT $491 + Edge $120)", sourceRef: "Item 6 fee schedule" },
          { label: "Largest required line item", detail: "Deployment / OTP / execution / support — $2,529 / year", sourceRef: "Item 6 fee schedule" },
          { label: "Other notable required lines", detail: "Restaurant Network Management $1,134; Sesame POS maintenance $1,133; Restaurant Hardware/Data $951; Payments and Fraud Management $740; Microsoft license $707; Restaurant File Maintenance $690; Global Mobile App $664; McDelivery POS Integration $620; Self-Ordering Kiosk $558; Back Office Integration $545", sourceRef: "Item 6 fee schedule" },
          { label: "Optional lines", detail: "HHOT software $50; PDW reporting $167; McD Connect $250; REES platform $62; Pricing Engine $264", sourceRef: "Item 6 fee schedule" },
        ],
      },
      {
        title: "Item 6 — Rent structure detail",
        items: [
          { label: "Percentage rent (Traditional, post-2026-01-14)", detail: "6% – 23% of Gross Sales; year-8 minimum 11.5%; payable only above base threshold; max change over term 3.5%.", sourceRef: "Item 6 rent detail" },
          { label: "Co-investment policy", detail: "Increment 0.25%; minimum $30,000/quarter; up to 10-year term; McDonald's retains title; tax benefits to franchisee.", sourceRef: "Item 6 rent detail" },
          { label: "STO/STR tier table", detail: "Tiered percentage rent from 9.0%/9.5% (cost up to $640K) up to 11.0%/11.5% (cost $940K–$1M); above $1M is case-by-case.", sourceRef: "Item 6 rent detail" },
          { label: "MIW fixed percentage rent range", detail: "14.0% – 15.5%", sourceRef: "Item 6 rent detail" },
          { label: "Effective rent observed in 2024", detail: "0% – 33.33% across the system", sourceRef: "Item 6 rent detail" },
        ],
      },
      {
        title: "Item 21 — Statement detail (2024, $M)",
        items: [
          { label: "Revenues", detail: "Company-owned sales $3,196.9 + franchised $7,210.6 + other $223.3 = total $10,630.8", sourceRef: "Income statement" },
          { label: "Operating costs", detail: "Food & paper $925.7; payroll $1,107.5; company-owned occupancy $746.5; franchised occupancy $1,294.1; SG&A $654.2; other restaurant $162.6; net other op $7.2 = $4,897.8", sourceRef: "Income statement" },
          { label: "Operating income", detail: "$5,733.0 before royalty to parent; $4,663.6 after the $1,069.4 IP royalty", sourceRef: "Income statement" },
          { label: "Net income", detail: "$3,461.6 (vs $3,394.4 in 2023, $3,095.7 in 2022)", sourceRef: "Income statement" },
          { label: "Balance sheet — assets", detail: "Cash $34.6; receivables $775.6; inventory $18.1; goodwill $1,498.7; ROU lease $5,841.4; net P&E $13,080.4; total assets $22,195.3", sourceRef: "Balance sheet" },
          { label: "Balance sheet — liabilities & equity", detail: "Due to parent $3,310.6; current lease $195.9; long-term lease $5,849.0; deferred income tax $1,416.7; total members' equity $10,222.0", sourceRef: "Balance sheet" },
          { label: "Cash flow", detail: "Operations $4,552.4; capex −$1,055.2; investing −$1,060.7; dividends to parent −$3,461.6; cash end of year $34.6", sourceRef: "Cash flow statement" },
          { label: "Lease accounting", detail: "ROU operating $4,821.4; ROU finance $1,020.0; total undiscounted payments $9,002.2; imputed interest $2,957.3; PV $6,044.9; WA term operating 17 yrs / finance 28 yrs", sourceRef: "Lease note" },
        ],
      },
      {
        title: "Exhibit map (20 exhibits)",
        items: [
          { label: "Exhibit A", detail: "Financial Statements (pages 58–72)", sourceRef: "Exhibit A" },
          { label: "Exhibit B", detail: "Franchise Agreement (Traditional) — pages 73–90", sourceRef: "Exhibit B" },
          { label: "Exhibits C–D", detail: "Satellite FA (91–108) and Walmart FA (109–126)", sourceRef: "Exhibits C, D" },
          { label: "Exhibit G", detail: "Operator's Lease — pages 133–165", sourceRef: "Exhibit G" },
          { label: "Exhibit J", detail: "Candidate Agreements — pages 180–190", sourceRef: "Exhibit J" },
          { label: "Exhibit K", detail: "McDonald's New Term Policy — pages 191–192 (discretionary, no contractual renewal right)", sourceRef: "Exhibit K" },
          { label: "Exhibit N", detail: "Loan and Related Documents incl. Unlimited Guaranty — pages 196–230", sourceRef: "Exhibit N" },
          { label: "Exhibit R", detail: "List of Franchised Restaurants — pages 237–380", sourceRef: "Exhibit R" },
          { label: "Exhibit S", detail: "Franchisees Who Ceased Doing Business — pages 381–382 (113 ceased)", sourceRef: "Exhibit S" },
          { label: "Exhibit T", detail: "State-Specific Addenda — pages 383–387", sourceRef: "Exhibit T" },
        ],
      },
      {
        title: "Disclosed contradictions (preserved)",
        items: [
          { label: "Unit count gap", detail: "Item 20 Table 1 shows 12,887 franchised + 672 company-owned. Note 1 to the financial statements shows 12,886 + 671. One-unit difference in each.", sourceRef: "Item 20 vs. FA Note 1" },
          { label: "Item 19 royalty cohort", detail: "Pro forma OIBOC scenarios use a 4% royalty rate. Post-2024 new entrants pay 5%.", sourceRef: "Item 6 Note 2 / Item 19" },
          { label: "Item 19 sample sentence vs. table", detail: "Pro forma basis cited as 11,332 in the table and 11,322 in the percentile sentence. 10-restaurant intra-item gap.", sourceRef: "Item 19 narrative vs. Item 19 table" },
          { label: "Item 7 vs. Note 11", detail: "Item 7 high end of disclosed investment differs from Note 11's disclosure of 9 of 31 McOpCo refranchise sales exceeding it (by up to $2,035,816).", sourceRef: "Item 7 vs. FA Note 11" },
        ],
      },
      {
        title: "Contract burden — high-impact clauses",
        items: [
          { label: "Default interest", detail: "15% per annum or highest legal rate, monthly compounding.", sourceRef: "FA Section 8(c)" },
          { label: "Insurance — CGL", detail: "$5M per occurrence / $5M aggregate; carrier A.M. Best A or A+, FSC IX+.", sourceRef: "FA insurance section" },
          { label: "Operating hours floor", detail: "7 days/week, 7:00 AM – 11:00 PM minimum.", sourceRef: "FA operations" },
          { label: "Material breach threshold", detail: "$5,000 judgment or 30 days overdue.", sourceRef: "FA default section" },
          { label: "Guarantor enforcement rate", detail: "18% floor, or Lender Prime + 4% if higher (capped at usury max).", sourceRef: "Exhibit N §2, p.208" },
          { label: "Consolidation waiver", detail: "Present in Unlimited Guaranty.", sourceRef: "Exhibit N §18, p.213" },
        ],
      },
    ],
  },
}
