import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franchise Glossary — 60+ Terms Defined | Franchisel",
  description:
    "Plain-English definitions of every key franchise term — from FDD Item 19 to royalty structures to post-term non-competes. 60+ terms every buyer must know before signing.",
  alternates: { canonical: "https://franchisel.com/guides/franchise-glossary" },
  openGraph: {
    title: "Franchise Glossary — 60+ Terms Defined",
    description:
      "Plain-English definitions of every key franchise term — from FDD Item 19 to royalty structures to post-term non-competes.",
    url: "https://franchisel.com/guides/franchise-glossary",
  },
};

const glossaryTerms: { letter: string; terms: { term: string; definition: string }[] }[] = [
  {
    letter: "A",
    terms: [
      {
        term: "Area Development Agreement",
        definition:
          "A contract giving a franchisee the right to open multiple units within a defined territory over a set schedule — for example, three units in four years. The developer pays a larger upfront fee and commits to the development timeline. Failure to hit the schedule typically results in losing the development rights for unbuilt locations, so the growth commitment must be financially realistic before signing.",
      },
      {
        term: "Area Representative",
        definition:
          "A third-party individual or entity that sells and supports franchises within a defined region under a sub-franchise or representative agreement with the franchisor. Area representatives typically receive a portion of initial franchise fees and ongoing royalties in exchange for recruiting and supporting franchisees in their territory. Their role can range from pure marketing support to full operational oversight — research the area representative's track record as carefully as the franchisor itself.",
      },
      {
        term: "Arbitration Clause",
        definition:
          "A provision in the franchise agreement requiring disputes to be resolved through binding arbitration rather than in court. Most franchise agreements require arbitration, which limits your ability to join class-action suits and often requires proceedings in the franchisor's home state. Review the venue, governing law, and cost-allocation provisions with a franchise attorney before signing.",
      },
    ],
  },
  {
    letter: "B",
    terms: [
      {
        term: "Brand Standards",
        definition:
          "The documented operational, design, and service requirements that every franchisee must follow to maintain consistency across the system. Brand standards govern everything from store appearance and approved menu items to employee uniforms and customer service scripts. Violations can trigger default notices, and franchisors can inspect your location at any time to audit compliance.",
      },
      {
        term: "Break-Even Analysis",
        definition:
          "A financial projection estimating the revenue level at which total costs are exactly covered — meaning the business neither profits nor loses money. For franchise evaluation, break-even analysis should incorporate all ongoing fees (royalty, marketing fund, technology fees), fixed lease obligations, staffing costs, and debt service on any financed portion of the investment. Many FDD Item 19 disclosures do not include a break-even figure, making franchisee interviews essential.",
      },
      {
        term: "Build-Out Costs",
        definition:
          "The expenses required to physically prepare a space for the franchise operation, including construction, fixtures, equipment installation, signage, and interior finishing. Build-out costs are included in Item 7 of the FDD but are often estimated broadly. Actual build-out costs depend heavily on the condition of the leased space, local construction labor rates, and landlord tenant improvement allowances — obtain independent contractor bids before committing.",
      },
    ],
  },
  {
    letter: "C",
    terms: [
      {
        term: "COGS (Cost of Goods Sold)",
        definition:
          "The direct cost of the products or materials the franchise sells — food ingredients, retail inventory, cleaning supplies, or similar inputs. COGS is expressed as a percentage of revenue and is one of the primary variables determining whether a franchise concept can be profitable. When evaluating Item 19 disclosures that show gross revenue only, you must independently estimate COGS to project net income.",
      },
      {
        term: "Conversion Franchise",
        definition:
          "A franchise model that converts an existing independent business into a branded franchise location rather than building a new unit from scratch. Conversion franchises are common in real estate, cleaning, and professional services. The investment is often lower than a greenfield build, but the franchisee must adapt their existing operations to meet the franchisor's brand standards.",
      },
      {
        term: "Cooperating Advertising Fund",
        definition:
          "A pooled marketing fund, typically funded by a percentage of each franchisee's gross revenue, used to develop and place national or regional advertising. The fund contribution rate is disclosed in Item 6 of the FDD. Franchisees generally have no direct control over how fund money is allocated. Item 11 should describe how the fund is administered and whether franchisees have any advisory input into spending decisions.",
      },
    ],
  },
  {
    letter: "D",
    terms: [
      {
        term: "Default and Cure Provisions",
        definition:
          "The contract language specifying what actions or inactions constitute a default under the franchise agreement and how much time (if any) the franchisee has to correct the problem before the franchisor can terminate. Some defaults — such as non-payment of royalties — may allow 30 days to cure; others, such as certain criminal convictions, may trigger immediate termination without any cure period. Understanding the default triggers in your specific agreement is critical risk management.",
      },
      {
        term: "Discovery Day",
        definition:
          "An event hosted by the franchisor — typically at corporate headquarters — where qualified prospective franchisees meet the leadership team, tour company operations, and receive a more detailed overview of the system. Discovery Day is designed to build enthusiasm and commitment, not to replace due diligence. Treat information shared on Discovery Day as marketing unless it is backed by FDD data or verified through independent franchisee conversations.",
      },
      {
        term: "Dual Distribution",
        definition:
          "A system in which the franchisor sells products or services through both franchisee-operated locations and its own company-owned channels — including online, company stores, or alternative retail formats — that may compete directly with franchisees. Dual distribution arrangements are disclosed in Item 12 and are a common source of encroachment disputes. Evaluate whether the franchisor's direct sales channels compete with your territory before investing.",
      },
    ],
  },
  {
    letter: "E",
    terms: [
      {
        term: "EBITDA",
        definition:
          "Earnings Before Interest, Taxes, Depreciation, and Amortization — a common proxy for operating cash flow used to value and compare businesses. Franchise resale valuations are typically expressed as a multiple of EBITDA. When evaluating whether a franchise investment makes financial sense, project realistic EBITDA and divide by your total investment to estimate a return on investment multiple.",
      },
      {
        term: "Encroachment",
        definition:
          "The opening of a competing outlet — by the franchisor, another franchisee, or a different brand owned by the same parent — within or near a franchisee's territory. Encroachment is one of the most common sources of franchisee-franchisor conflict. Online sales channels, non-traditional locations (airports, campuses, hospitals), and affiliated brands are frequent encroachment vectors that may not be restricted by territory provisions. Item 12 of the FDD governs territorial rights.",
      },
      {
        term: "Exclusive Territory",
        definition:
          "A geographic zone within which the franchisor commits not to grant another franchise of the same brand. In its strongest legal form, an exclusive territory has no carve-outs — but most agreements that use the word 'exclusive' include exceptions for company-owned units, non-traditional locations, online sales, and affiliated brands. Read Item 12 carefully or have a franchise attorney do so; the actual protection granted frequently differs from what was described in the sales process.",
      },
    ],
  },
  {
    letter: "F",
    terms: [
      {
        term: "FDD (Franchise Disclosure Document)",
        definition:
          "The legally mandated disclosure document that franchisors must provide to prospective franchisees at least 14 days before any agreement is signed or money changes hands. The FDD contains 23 Items covering every material aspect of the franchise relationship — from the franchisor's background and litigation history to fees, territory rights, and financial performance data. The FDD is regulated by the FTC and is the cornerstone of franchise due diligence.",
      },
      {
        term: "Franchise Agreement",
        definition:
          "The legally binding contract between the franchisor and franchisee that governs the entire franchise relationship. The franchise agreement is attached as an exhibit to the FDD but is what you actually sign — and it controls in the event of any conflict with FDD disclosures. Have a franchise attorney review the agreement before signing; the differences between the FDD summary and the agreement language are often significant.",
      },
      {
        term: "Franchise Fee",
        definition:
          "The upfront, one-time fee paid to the franchisor for the right to use the brand, system, and intellectual property for the term of the agreement. Disclosed in Item 5 of the FDD, franchise fees typically range from $10,000 to $60,000 for most concepts. This fee is generally non-refundable once paid, and it is separate from your total investment — it represents only the cost of the license, not the cost to open and operate.",
      },
      {
        term: "Franchise Registry",
        definition:
          "A database maintained by the SBA and private services listing franchise brands that have completed the lender review process, confirming their franchise agreement does not conflict with SBA loan program requirements. When a brand is on the SBA Franchise Registry, lenders can process SBA 7(a) loans more quickly. If a brand you are evaluating is not on the registry, SBA financing may still be available but will take longer to approve.",
      },
      {
        term: "Franchisee Association",
        definition:
          "An independent organization formed by franchisees within a system to represent their collective interests in dealing with the franchisor. Active, well-organized franchisee associations are a positive signal — they indicate franchisees are engaged and have a channel for raising concerns. Ask whether a franchisee association exists in the system you are evaluating and, if so, whether the franchisor engages constructively with it.",
      },
      {
        term: "Franchisor",
        definition:
          "The company that grants franchisees the right to use its brand, system, and operating methods in exchange for fees and compliance with its standards. The franchisor owns the intellectual property, sets system-wide standards, provides training and support, and earns revenue through royalties and fees. The franchisor's financial health, management experience, and commitment to franchisee support are critical factors in your investment decision.",
      },
      {
        term: "FTC Franchise Rule",
        definition:
          "The Federal Trade Commission's Franchise Rule (16 C.F.R. Part 436), which requires franchisors to provide prospective franchisees with the FDD at least 14 days before signing any agreement or paying any fee. The rule establishes the 23-item FDD format, governs earnings claims, and prohibits material misrepresentations in the franchise sales process. The FTC does not pre-screen or approve FDDs — it sets the requirements and investigates violations.",
      },
    ],
  },
  {
    letter: "G",
    terms: [
      {
        term: "Gross Sales (vs. Net Sales)",
        definition:
          "Gross sales is the total revenue a franchise location collects before any deductions — returns, discounts, or voids. Net sales is gross sales minus deductions. Most franchise royalty calculations are based on gross sales, which means you pay royalties on revenue you collected but may have subsequently refunded or discounted. Always confirm whether your royalty obligation is calculated on gross or net sales, as this can be a significant difference in high-return-rate businesses.",
      },
      {
        term: "Gross Margin",
        definition:
          "The difference between revenue and the direct cost of delivering that revenue (COGS or cost of services), expressed as a percentage. A franchise with $1M in revenue and $400K in COGS has a 60% gross margin. Gross margin is the starting point for all profitability analysis — after paying royalties, marketing fees, labor, and rent from gross margin, whatever remains is your net income. Concepts with gross margins below 50% typically leave very little room for franchisee profit after total fees and operating costs.",
      },
      {
        term: "Growth Rate (Unit Growth)",
        definition:
          "The net change in total franchise units over a given period, expressed as a percentage. Calculate it from the Item 20 unit count tables: (units at end of period minus units at start of period) divided by units at start of period. A system with strong unit growth signals franchisee demand and brand momentum. A shrinking system signals problems — whether financial, operational, or competitive — and warrants deep investigation before investing.",
      },
    ],
  },
  {
    letter: "H",
    terms: [
      {
        term: "Home-Based Franchise",
        definition:
          "A franchise concept that can be operated from the franchisee's home without requiring a commercial retail or office location. Home-based franchises typically have lower total investment requirements and ongoing overhead, making them accessible to buyers with less capital. Service categories — cleaning, consulting, lawn care, tutoring — dominate this segment. Lower overhead does not mean lower effort; income is still directly tied to client acquisition and service delivery.",
      },
      {
        term: "Hold Harmless Clause",
        definition:
          "A contractual provision in which one party agrees not to hold the other liable for specified losses or damages. In franchise agreements, hold harmless clauses typically protect the franchisor from liability related to the franchisee's business operations, employees, and customers. Review these provisions carefully with a franchise attorney — broad hold harmless language can limit your ability to recover damages even when the franchisor's decisions directly contributed to your losses.",
      },
    ],
  },
  {
    letter: "I",
    terms: [
      {
        term: "Initial Training Program",
        definition:
          "The training the franchisor provides to new franchisees and their key staff before opening. Described in Item 11 of the FDD, initial training typically covers the franchisor's operating systems, brand standards, product preparation or service delivery, and administrative processes. Training quality varies enormously across systems — ask current franchisees whether the initial training prepared them adequately, and ask what ongoing training and support looks like after the first 90 days.",
      },
      {
        term: "In-Term Non-Compete",
        definition:
          "A restriction prohibiting the franchisee from owning, operating, or having a financial interest in any competing business while the franchise agreement is in effect. In-term non-competes are standard in franchise agreements and are generally enforceable. They prevent you from hedging your investment by running a competing independent business simultaneously — factor this into your evaluation of the concept's exclusivity and opportunity cost.",
      },
      {
        term: "Item 19",
        definition:
          "The optional Financial Performance Representation section of the FDD, and the only legally sanctioned place where a franchisor can disclose data about franchisee earnings. If included, Item 19 provides factual data about actual financial performance of franchise outlets — gross revenue, expenses, or net income. Approximately 60% of franchise systems include Item 19. When evaluating an Item 19, focus on median performance rather than averages, and check how many units are included in the sample versus the total unit count.",
      },
      {
        term: "Item 20",
        definition:
          "The FDD disclosure showing unit count tables — openings, closings, transfers, and terminations — for each of the past three fiscal years, broken down by state. Item 20 also lists the names and contact information of current franchisees and franchisees who left the system in the past year. Use this list to initiate your own franchisee validation calls — contact franchisees randomly from the full list, not just the references provided by the franchisor's sales team.",
      },
      {
        term: "Item 21",
        definition:
          "The FDD section containing the franchisor's audited financial statements for the most recent three fiscal years. Item 21 is critical for evaluating the franchisor's financial health — a financially weak franchisor cannot sustain the training, support, and marketing infrastructure it promises. Look for declining revenue, growing losses, high debt loads, or going-concern qualifications from the auditors.",
      },
    ],
  },
  {
    letter: "J",
    terms: [
      {
        term: "Joint Employer",
        definition:
          "A legal standard under which both a franchisor and franchisee could be held liable as employers of the franchisee's workers, despite the franchisee legally being an independent contractor. Joint employer liability is an evolving area of labor law with significant financial implications — if a franchisor is deemed a joint employer, it may share liability for wage violations, discrimination claims, or labor law violations at the franchisee level. Review any joint employer risk disclosures in the FDD and consult legal counsel.",
      },
    ],
  },
  {
    letter: "L",
    terms: [
      {
        term: "Liquidated Damages",
        definition:
          "A pre-agreed sum specified in the franchise agreement that the franchisee must pay if they terminate the agreement early or breach certain provisions. Liquidated damages clauses are intended to compensate the franchisor for lost royalties and are common in franchise agreements. Courts will enforce them if the amount is a reasonable pre-estimate of actual damages — if the figure is punitive, enforceability varies by state.",
      },
      {
        term: "Litigation History (Item 3)",
        definition:
          "The FDD's disclosure of all material legal actions involving the franchisor, its predecessors, affiliates, and current officers. Item 3 covers active and recently concluded lawsuits, arbitrations, and criminal proceedings. The nature of the litigation matters as much as the count — franchisee-initiated suits alleging misrepresentation of earnings potential or fraud during the sales process are far more significant warning signs than third-party slip-and-fall cases.",
      },
    ],
  },
  {
    letter: "M",
    terms: [
      {
        term: "Marketing Fund",
        definition:
          "A pooled advertising fund, typically funded by a percentage of franchisee gross revenue, used to develop and distribute national or regional marketing materials. The marketing fund rate is disclosed in Item 6. Franchisees typically have no direct control over how marketing fund money is spent, though some systems have franchisee advisory councils. Verify whether the franchisor's marketing fund expenditures are audited and whether results are reported to franchisees.",
      },
      {
        term: "Master Franchise",
        definition:
          "An arrangement in which a master franchisee acquires the rights to sub-franchise a brand within a defined territory — often a country or large region. The master franchisee recruits unit franchisees, collects fees, and provides support, sharing a portion with the original franchisor. If you are buying from a master franchisee rather than the original franchisor, conduct thorough due diligence on both — your direct contractual relationship is with the master franchisee, not the brand owner.",
      },
      {
        term: "Material Change",
        definition:
          "Any significant change to the FDD or the franchise system that requires the franchisor to amend its FDD filing and, in many cases, provide an updated FDD to prospective franchisees. Material changes include new litigation, changes to key officers, significant fee changes, and major system modifications. If you received a prior version of the FDD and the franchisor has filed a material amendment, request the updated document before signing.",
      },
      {
        term: "Median Revenue (vs. Average)",
        definition:
          "The median is the midpoint of reported unit performance — half of units are above it, half are below. The average (mean) is pulled upward by top-performing outliers. If Item 19 shows only average revenue, the figure may significantly overstate what a typical franchisee earns. Always request median figures and, when only averages are provided, use the 25th percentile figure as your conservative planning assumption.",
      },
    ],
  },
  {
    letter: "N",
    terms: [
      {
        term: "Net Worth Requirement",
        definition:
          "The minimum personal net worth a prospective franchisee must demonstrate to qualify for a franchise. Net worth requirements are disclosed in Item 5 or Item 7 of the FDD and represent the franchisor's assessment of the financial cushion required to absorb early losses. Meeting the minimum net worth requirement does not mean the investment is right for your financial situation — build your own independent financial model.",
      },
      {
        term: "Non-Compete Clause (Post-Term)",
        definition:
          "A provision prohibiting the franchisee from operating a competing business for a defined period after the franchise agreement ends, whether by expiration, termination, or sale. Post-term non-competes typically cover one to two years and a defined geographic radius. Enforceability varies by state — California, Minnesota, and several other states restrict or invalidate post-term franchise non-competes. Review Item 17 for the specific terms and consult a franchise attorney about enforceability in your state.",
      },
      {
        term: "Non-Traditional Location",
        definition:
          "A franchise unit operating in a captive-audience or alternative venue — airports, hospitals, universities, stadiums, military bases, hotels — rather than a standard commercial retail location. Non-traditional locations are typically carved out of territorial exclusivity provisions, meaning the franchisor can license a non-traditional unit within your territory without your consent. Evaluate the density of non-traditional location carve-outs relative to your specific territory.",
      },
    ],
  },
  {
    letter: "O",
    terms: [
      {
        term: "Operations Manual",
        definition:
          "The confidential document provided to franchisees after signing that details all required operating procedures, brand standards, supplier requirements, staffing guidelines, and administrative processes. You are generally not permitted to review the full Operations Manual before signing — franchisors provide a table of contents or summary in the FDD. Ask to review the table of contents carefully; it reveals how prescriptive and burdensome the system's operating requirements are.",
      },
      {
        term: "Owner-Operator",
        definition:
          "A franchisee who works actively in the day-to-day operations of their franchise location rather than hiring a manager to run it. Many franchise agreements require owner-operator involvement, particularly for newer units. Owner-operator models typically produce better financial results than absentee or semi-absentee ownership — but they also require a personal time commitment that amounts to a full-time job, which buyers sometimes underestimate in the evaluation process.",
      },
    ],
  },
  {
    letter: "P",
    terms: [
      {
        term: "Per-Unit Fee",
        definition:
          "An alternative to percentage-based royalties in which the franchisee pays a flat fee per transaction, per customer, or per unit sold rather than a percentage of gross revenue. Per-unit fee structures are common in tutoring, fitness, and subscription-based franchise models. They provide cost predictability at low volume but can become expensive relative to percentage royalties as revenue scales — run the math at multiple revenue scenarios to compare the total fee burden.",
      },
      {
        term: "Personal Guarantee",
        definition:
          "A provision requiring the franchisee's principal owners to personally guarantee the obligations of the franchise entity — meaning if the business cannot pay its debts or meet its contractual obligations, the individuals are personally liable. Personal guarantees are standard in franchise agreements and most commercial leases. Your personal assets — home, savings, retirement accounts — may be at risk if the franchise fails and the entity has outstanding obligations.",
      },
      {
        term: "Post-Term Non-Compete",
        definition:
          "See Non-Compete Clause (Post-Term) above. This term is used interchangeably with post-term non-compete and refers specifically to the restrictions on the franchisee's ability to compete after the franchise relationship ends.",
      },
      {
        term: "Protected Territory",
        definition:
          "A softer form of territorial protection compared to an exclusive territory. A protected territory typically means the franchisor agrees not to establish additional franchisees of the same brand within your area while you are in good standing, but it may still allow company-owned units, alternative channel sales, and affiliated brands to operate within the territory. Read the specific language in Item 12 rather than relying on this term's common-use meaning.",
      },
    ],
  },
  {
    letter: "Q",
    terms: [
      {
        term: "QSR (Quick Service Restaurant)",
        definition:
          "A food service franchise category characterized by counter service, standardized menus, and fast preparation times — commonly known as fast food. QSR franchises represent the largest single category in franchising by unit count and total investment. QSR investments typically require $200,000 to $2.5 million and involve complex operations with high COGS, significant labor management requirements, and tight margins. Research unit economics carefully before entering this category.",
      },
      {
        term: "Qualified Buyer",
        definition:
          "A prospective franchisee who meets the franchisor's financial and experiential requirements to purchase a franchise. Qualifying criteria typically include minimum liquid capital, minimum net worth, and sometimes specific industry or management experience. Meeting the qualified buyer threshold means the franchisor will engage with you in the sales process — it does not mean the investment is suitable for your personal financial situation.",
      },
    ],
  },
  {
    letter: "R",
    terms: [
      {
        term: "Registered State",
        definition:
          "One of approximately 14 states — including California, New York, Illinois, Maryland, Virginia, and others — that require franchisors to register their FDD with a state agency and receive approval before offering franchises to state residents. Registration states may impose conditions on FDD content beyond FTC minimums. Confirm the franchisor is currently registered in your state before investing — an unregistered offering in a registration state is illegal.",
      },
      {
        term: "Renewal Rights",
        definition:
          "The franchisee's contractual right to continue operating after the initial franchise agreement term expires, subject to meeting conditions. Renewal conditions typically require the franchisee to be in good standing, sign the then-current form of franchise agreement (which may have materially different terms than the original), pay a renewal fee, and potentially complete system remodels. Review renewal conditions in Item 17 carefully — what you sign today may not be what you renew into.",
      },
      {
        term: "Right of First Refusal",
        definition:
          "A contractual right allowing the franchisor to match any third-party offer to purchase a franchisee's unit before the franchisee can sell to that third party. When the franchisor holds this right, it can effectively control the resale market for your business. If exercised, the franchisor acquires your unit at the negotiated price — which may be beneficial or detrimental depending on whether it is exercised strategically to block your preferred buyer.",
      },
      {
        term: "Royalty Fee",
        definition:
          "The ongoing fee paid by the franchisee to the franchisor, typically calculated as a percentage of gross revenue. Royalty fees are disclosed in Item 6 and generally range from 4% to 10% of gross sales. Some franchises charge flat weekly or monthly royalties instead of percentage-based fees. The royalty is the primary ongoing revenue source for the franchisor and the largest single ongoing cost for most franchisees — add it to all other recurring fees to understand your total ongoing cost burden.",
      },
    ],
  },
  {
    letter: "S",
    terms: [
      {
        term: "SBA Loan",
        definition:
          "A small business loan partially guaranteed by the U.S. Small Business Administration, making lenders more willing to extend financing to franchise buyers who might not qualify for conventional loans. The SBA 7(a) loan is the most common franchise financing vehicle — up to $5 million, typically 10-year terms for working capital or 25-year terms for real estate, at rates currently in the 7–9% range. SBA loans require the franchisor to be on the SBA Franchise Registry and require personal guarantees.",
      },
      {
        term: "SBA Franchise Registry",
        definition:
          "A database of franchise brands that have been reviewed and approved for SBA loan eligibility. Registration means the SBA has determined the franchise agreement does not vest excessive control in the franchisor in ways that would compromise the franchisee's independence as a business owner. Lenders can process SBA loans faster for registered brands. Check the registry before assuming SBA financing is available for a specific concept.",
      },
      {
        term: "SDI (Seller's Discretionary Income)",
        definition:
          "A measure of franchise profitability representing the total earnings available to a working owner — including net income plus the owner's salary, depreciation, interest, and any one-time or non-recurring expenses. SDI is a standard metric for franchise and small business valuation. Resale valuations are typically expressed as 2–4x SDI. When evaluating a franchise resale, verify that the SDI figure is based on actual historical financials, not projections.",
      },
      {
        term: "State Registration",
        definition:
          "The process by which a franchisor files its FDD with a state franchise regulator in one of approximately 14 registration states. State registration is distinct from FTC compliance — the FTC's Franchise Rule applies nationally, while state registration is an additional layer of oversight. Registration states may require additional disclosures, impose escrow requirements on franchise fees, or condition registration on the franchisor meeting minimum financial standards.",
      },
      {
        term: "Sub-Franchisor",
        definition:
          "An entity that has been granted the right by the original franchisor to sell and support unit franchises within a defined territory, functioning as the effective franchisor for unit-level buyers in that area. Also called a master franchisee or area representative depending on the structure. If you are buying from a sub-franchisor, your primary contractual relationship and support structure flows from that entity — vet them as thoroughly as the original brand.",
      },
      {
        term: "Supplier Rebates",
        definition:
          "Payments made by approved suppliers to the franchisor in exchange for the right to supply required goods or services to franchisees. Supplier rebates are a form of revenue to the franchisor that is separate from royalties and fees. They must be disclosed in Item 8 of the FDD, though exact dollar amounts are often not provided. High supplier rebate revenue can create a conflict of interest if the franchisor selects suppliers based on the size of the rebate rather than price or quality for franchisees.",
      },
    ],
  },
  {
    letter: "T",
    terms: [
      {
        term: "Technology Fee",
        definition:
          "A recurring fee charged by the franchisor for required technology systems — POS platforms, ordering software, scheduling tools, or proprietary operations management systems. Technology fees are disclosed in Item 6 and have become an increasingly significant cost center in franchise operations over the past decade. Watch for agreements that grant the franchisor sole discretion to implement new technology systems and charge franchisees at rates it determines unilaterally — this is an uncapped cost exposure.",
      },
      {
        term: "Territory Protection",
        definition:
          "The contractual right giving a franchisee some degree of exclusivity or preference within a defined geographic area. The actual strength of territory protection depends entirely on the specific language in Item 12 — carve-outs for online sales, non-traditional locations, affiliated brands, and company-owned units can substantially reduce the real protection provided. Do not rely on verbal descriptions of territorial protection; read the FDD language.",
      },
      {
        term: "Total Investment Range",
        definition:
          "The estimated range of capital required to open and operate a franchise unit for the first three months, as disclosed in Item 7 of the FDD. The range includes the franchise fee, build-out, equipment, initial inventory, training costs, and working capital. The low end of most Item 7 ranges is optimistic — current franchisees report spending 20–40% more than the FDD minimum in many systems. Use the high end as your planning assumption and verify with existing franchisees.",
      },
      {
        term: "Transfer Fee",
        definition:
          "The fee charged by the franchisor when a franchisee sells their business to a new buyer, triggering a transfer of the franchise agreement. Transfer fees typically range from $5,000 to $25,000 and are paid at closing. The incoming buyer must also be approved by the franchisor and complete the standard training program. Transfer fees are disclosed in Item 6 and should be factored into your exit strategy financial modeling.",
      },
      {
        term: "Transfer Rights",
        definition:
          "The franchisee's ability to sell the franchise to a qualified third party. Transfer rights are one of the most important provisions in any franchise agreement because they determine your ability to exit and recoup your investment. Review the approval criteria for incoming buyers, the franchisor's right of first refusal, the form of agreement the new buyer must sign, and whether transfer requires completion of system remodels as conditions.",
      },
      {
        term: "Turnover Rate",
        definition:
          "The percentage of franchise units that close or change ownership in a given year, calculated from Item 20 unit count tables: units closed plus transfers out, divided by total units at the start of the period. A healthy system typically has a turnover rate below 5–6% annually. Rates above 10% annually indicate meaningful franchisee dissatisfaction or financial failure. High turnover rates combined with no Item 19 disclosure are a significant red flag.",
      },
      {
        term: "Two-Tier Franchise",
        definition:
          "A franchise structure involving an intermediate layer between the brand owner and unit franchisees — typically a master franchisee or area representative who recruits, sells to, and supports individual unit operators. Unit franchisees in a two-tier system are effectively franchisees of the master, not the original brand. Due diligence must cover both the original franchisor and the intermediate party, whose financial health and quality of support directly affect your business.",
      },
    ],
  },
  {
    letter: "U",
    terms: [
      {
        term: "Unit Economics",
        definition:
          "The revenue, cost, and profit characteristics of a single franchise location. Strong unit economics — sufficient gross margin, manageable operating costs, and reasonable total fees — are the foundation of any good franchise investment. A brand with 500 units and weak unit economics is a worse investment than a brand with 50 units and strong unit economics. Use Item 19 data, franchisee interviews, and independent cost benchmarks to build an accurate unit economics model.",
      },
      {
        term: "Unit Franchise Agreement",
        definition:
          "The standard franchise agreement for a single-location franchise — as opposed to an area development agreement covering multiple units. Most first-time franchise buyers sign a unit franchise agreement. The unit franchise agreement is the binding contract that governs your rights, obligations, fees, territory, renewal terms, transfer rights, and exit options for the entire term of your investment.",
      },
    ],
  },
  {
    letter: "V",
    terms: [
      {
        term: "Validation (Franchisee Validation Calls)",
        definition:
          "The process of contacting current and former franchisees directly to verify the franchisor's claims and gather candid assessments of the system. Franchisee validation calls using the Item 20 contact list — not references provided by the franchisor — are the single highest-value due diligence step available. Ask franchisees about actual investment costs, actual financial performance, quality of support, franchisor responsiveness, and whether they would invest again knowing what they know now.",
      },
    ],
  },
  {
    letter: "W",
    terms: [
      {
        term: "Working Capital",
        definition:
          "The liquid funds required to cover operating expenses during the period between when a business incurs costs and when it collects sufficient revenue to cover them. Working capital requirements are included in Item 7 of the FDD, but estimates are frequently understated. Franchisees should model working capital based on realistic ramp-up timelines and ensure their total available capital covers both the opening investment and at least 12–18 months of operating expenses at below-projected revenue levels.",
      },
    ],
  },
];

function slugAnchor(letter: string) {
  return `section-${letter.toLowerCase()}`;
}

export default function FranchiseGlossaryPage() {
  const allLetters = glossaryTerms.map((g) => g.letter);
  const totalTerms = glossaryTerms.reduce((n, g) => n + g.terms.length, 0);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-accent transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Franchise Glossary</span>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-light text-cyan mb-4">
            Getting Started
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Franchise Glossary
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">
            Plain-English definitions of every franchise term you will encounter during due
            diligence — from FDD basics to contract provisions to unit economics. Focused on
            what each term means for your money and your rights as a buyer.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted">
            <span>8 min read</span>
            <span>·</span>
            <span>Updated March 25, 2025</span>
            <span>·</span>
            <span>{totalTerms} terms defined</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* A–Z quick-nav */}
        <nav className="flex flex-wrap gap-1.5 mb-10 p-4 bg-surface rounded-lg border border-border">
          <span className="text-xs text-muted font-medium mr-1 self-center">Jump to:</span>
          {allLetters.map((letter) => (
            <a
              key={letter}
              href={`#${slugAnchor(letter)}`}
              className="inline-flex items-center justify-center w-7 h-7 rounded text-xs font-semibold border border-border bg-background text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Intro note */}
        <div className="mb-10 p-4 rounded-lg border border-accent bg-accent-light">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">How to use this glossary:</span> Every definition
            focuses on what the term means for your money and your rights — not legal theory.
            Where applicable, the relevant FDD Item is noted. When in doubt, the franchise
            agreement is the controlling document — not verbal representations from franchise
            sales staff.
          </p>
        </div>

        {/* Term sections */}
        <div className="space-y-12">
          {glossaryTerms.map(({ letter, terms }) => (
            <section key={letter} id={slugAnchor(letter)}>
              <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">
                {letter}
              </h2>
              <dl className="space-y-8">
                {terms.map(({ term, definition }) => (
                  <div key={term} className="scroll-mt-20">
                    <dt className="text-base font-semibold text-foreground mb-2">{term}</dt>
                    <dd className="text-sm text-muted leading-relaxed">{definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ready to Research Specific Brands?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/brands"
              className="block p-4 rounded-lg border border-border bg-background hover-glow"
            >
              <p className="text-sm font-medium text-foreground">
                Browse All Franchise Brands
              </p>
              <p className="mt-1 text-xs text-muted">
                Research investment requirements, fees, and unit economics for 50+ franchise brands.
              </p>
            </Link>
            <Link
              href="/about/methodology"
              className="block p-4 rounded-lg border border-border bg-background hover-glow"
            >
              <p className="text-sm font-medium text-foreground">
                Our Research Methodology
              </p>
              <p className="mt-1 text-xs text-muted">
                How we verify franchise data and what sources we use to build every brand profile.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
