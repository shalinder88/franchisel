export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  teaser: string;
  content: string;
}

export const articles: BlogArticle[] = [
  {
    slug: "franchise-500-2025-what-rankings-dont-tell-you",
    title: "The 2025 Franchise 500: What the Rankings Don't Tell You",
    category: "Market Analysis",
    date: "March 15, 2025",
    publishedAt: "2025-03-15",
    updatedAt: "2025-03-15",
    readingTime: 10,
    teaser:
      "Entrepreneur's annual Franchise 500 is the most cited list in franchising — but the ranking methodology has almost nothing to do with franchisee profitability. We break down what the list actually measures and which metrics matter more for buyers.",
    content: `Every January, the franchise industry holds its collective breath waiting for Entrepreneur magazine to release its Franchise 500 rankings. Franchisors pay for booths at discovery days where the list is displayed prominently. Sales representatives reference a brand's ranking in the first five minutes of every call. Prospective buyers use the list as a starting shortlist. And yet, if you read the methodology carefully, the Franchise 500 ranking has almost no correlation with whether a franchisee will make money.

That is not an accident. It is a structural feature of how the list is built — and understanding it is one of the most important things a prospective franchise buyer can do before spending a dollar on due diligence.

HOW ENTREPRENEUR ACTUALLY RANKS FRANCHISES: The Franchise 500 methodology weights five broad categories: costs and fees, system size and growth rate, franchisee support and training, brand strength, and financial stability. Each category contains sub-metrics. System size rewards brands with more total units. Growth rate rewards brands opening new locations fastest. Brand strength is estimated using social media presence, years in business, and media coverage. Financial stability is assessed using publicly available data about the franchisor's balance sheet — not franchisee profitability.

What is conspicuously absent from this list is any direct measure of unit-level economics. The ranking does not require franchisors to disclose average unit volume, franchisee net income, or franchisee turnover rates. It does not assess whether franchisees are profitable or whether they would buy into the system again. A brand can rank in the top 10 while its franchisees collectively lose money.

THE MARKETING BUDGET PROBLEM: Brands with larger marketing budgets consistently perform better on the subjective components of the ranking. Social media follower counts, website traffic, media mentions, and brand recognition metrics are all proxies for how much a system has invested in national advertising — not indicators of whether the unit economics work at the local level. A regional chain with excellent unit economics and high franchisee satisfaction will almost always rank below a national brand that has spent millions on brand-building infrastructure.

Additionally, participation in Entrepreneur's rankings requires submitting a detailed application that takes considerable staff time and resources. Many excellent smaller franchisors simply do not participate. Their absence from the list does not signal a weaker investment — it often signals a leaner operation that channels resources into franchisee support rather than marketing efforts.

SYSTEM SIZE AS A DOUBLE-EDGED SIGNAL: The Franchise 500 rewards system size. Brands with 2,000 units rank better than brands with 200 units, all else being equal. But system size is a deeply ambiguous metric for prospective buyers. Larger systems can signal proven scalability, strong brand recognition, and established operations manuals. They can also signal market saturation, territory scarcity, and franchisee resentment over encroachment. The ranking cannot distinguish between these scenarios.

Some of the most oversaturated markets in franchising belong to highly-ranked brands. Subway, which has ranked in the top 10 of the Franchise 500 for decades, spent years closing thousands of domestic units because the system was overbuilt. Its consistently high ranking during the period of overcrowding was a function of system size — the very variable that was causing franchisee suffering.

WHAT HIGHLY-RANKED BRANDS WITH POOR UNIT ECONOMICS LOOK LIKE: Several categories that appear frequently in the top 100 are characterized by thin unit-level margins. Cleaning and restoration franchises, certain fast food sub-categories, and service-based home improvement franchises regularly generate headline investment costs that look attractive alongside low royalty structures — but unit-level net incomes that leave franchisees earning below minimum wage on their invested capital.

A franchise that charges $30,000 to $50,000 in upfront fees and collects a 6% royalty on gross revenue will always rank well on the fee-weighted portions of the methodology. A buyer who assumes that ranking translates to investment quality is making a category error: the list is measuring the franchisor's business, not the franchisee's business.

THE METRICS THAT ACTUALLY MATTER FOR BUYERS: Prospective buyers should focus on four data points that the Franchise 500 does not measure. The first is Item 19 financial performance representations. Not every franchisor files one, and the ones that do vary enormously in what they disclose — but a brand unwilling to provide any financial performance data is sending a signal. The second is franchisee turnover rate, which can be calculated from successive FDDs by comparing unit counts over time to openings and closings. The third is litigation history in Item 3, which reveals the pattern of disputes between franchisor and franchisees. The fourth is franchisee satisfaction surveys — Franchise Business Review conducts independent surveys and publishes scores that are entirely disconnected from Entrepreneur's methodology.

WHAT TO USE INSTEAD OF RANKINGS: The most sophisticated franchise buyers use the Franchise 500 for exactly one purpose: generating an initial awareness list of brands that are large enough to have established operations infrastructure. They then move immediately to FDD analysis, franchisee validation calls, and independent financial modeling. The ranking is a starting point for further research, not a proxy for investment quality.

USING THE LIST WISELY: None of this means the Franchise 500 is worthless. It is a reasonable screen for finding franchises that have achieved some minimum scale and have completed the disclosure process. Brands that appear consistently over multiple years have demonstrated survival and growth, which matters. The list is a reasonable first filter. It becomes dangerous when buyers use it as a last filter — when the ranking itself becomes a substitute for the hard work of evaluating whether the unit economics, territory quality, and franchisee support structure will actually produce a return on their investment.

The most important question to ask about any franchise — ranked or unranked — is not "where does it sit in the Franchise 500?" It is: "What did the franchisee at a typical location net after royalties, marketing fees, debt service, and labor, and what did they say when I called them directly to ask?" No annual ranking will ever answer that question for you.`,
  },
  {
    slug: "why-60-percent-franchise-buyers-regret-item-19",
    title: "Why 60% of Franchise Buyers Regret Not Reading Item 19 More Carefully",
    category: "Due Diligence",
    date: "February 28, 2025",
    publishedAt: "2025-02-28",
    updatedAt: "2025-02-28",
    readingTime: 10,
    teaser:
      "Item 19 of the FDD — the Financial Performance Representation — is the single most important disclosure in the entire document, yet most buyers skim it or misinterpret the numbers. Here is what you are likely missing and why it changes the math completely.",
    content: `Item 19 of the Franchise Disclosure Document is titled "Financial Performance Representations." In plain language, it is the section where a franchisor tells you — or declines to tell you — what franchisees actually earn. It is the single most consequential section of the FDD for evaluating whether a franchise investment makes financial sense, and it is consistently the section that buyers misread, underanalyze, or skip entirely.

The Federal Trade Commission does not require franchisors to include an Item 19. A brand can legally sell franchises without ever disclosing what its franchisees earn. When a brand declines to include a financial performance representation, that omission is itself a signal worth taking seriously.

WHAT ITEM 19 IS AND WHY IT EXISTS: Prior to the FDD system, franchise buyers had almost no standardized way to understand the financial performance of the businesses they were buying into. Item 19 was created to address this gap — to give buyers a documented basis for their financial projections. In practice, however, the regulatory framework gives franchisors substantial latitude in how they present the data, and sophisticated franchisors have developed legal approaches to presenting accurate but misleading numbers.

Understanding these approaches is not optional due diligence. It is the foundation of competent franchise evaluation.

THE SIX MOST COMMON ITEM 19 MISREADS: The first and most common misread is confusing gross revenue with net income. Many Item 19 disclosures present average unit volumes — what locations generate in top-line revenue — without any reference to what franchisees actually keep. A franchise averaging $800,000 in annual revenue can have franchisees netting $40,000 or $140,000 depending on cost structure. Revenue tells you the size of the business. It does not tell you whether the business is profitable.

The second misread is accepting averages without asking for medians and distributions. When a franchisor presents "average annual revenue of $1.2M," the average can be pulled dramatically upward by a handful of exceptional performers. The median unit — the one that half of franchisees perform above and half below — may be $750,000. If you are a new franchisee entering a competitive market without exceptional real estate, you are likely to perform at or below the median, not the average.

The third misread is failing to notice subset presentations. Franchisors are permitted to present data from a subset of their franchised locations. A disclosure might cover only locations open for more than two years, only corporate-owned units, only locations in certain geographic markets, or only locations above a minimum revenue threshold. The data is accurate — but it may describe a population of locations that looks nothing like the one you are buying.

The fourth misread is ignoring the distinction between franchised and corporate-owned unit performance. Corporate units often benefit from better real estate selection, lower labor costs through better scheduling systems, and centralized purchasing efficiencies that franchisees cannot replicate. When Item 19 data combines corporate and franchised unit performance without distinguishing between them, the presentation will typically overstate what franchisees actually earn.

The fifth misread is treating top-performer data as typical. Some franchisors present the performance of their top quartile, top 25%, or "award-winning" locations. This data is accurate but describes the tail of the distribution, not the center. A brand might legitimately state that its top 25% of franchisees averaged $1.8M in revenue — while its median franchisee averaged $620,000.

The sixth misread is not adjusting for debt service. Item 19 figures are almost always pre-debt-service. A franchise requiring $500,000 in total investment, financed with an SBA loan at 7% over 10 years, will require roughly $70,000 per year in debt service payments before the franchisee earns a dollar of personal income. If the Item 19 shows average "earnings" of $110,000, the debt-adjusted return is $40,000 — a very different story.

HOW TO CORRECTLY ANALYZE ITEM 19: Start by identifying exactly what population the data covers. Read the footnotes. Find out which locations were excluded and why. If the franchisor excluded locations open fewer than two years, you are not looking at data from the startup phase that you will experience as a new franchisee.

Next, calculate the revenue-to-investment ratio. Take the median revenue figure (not the average) and divide it by the total investment cost. A franchise requiring $400,000 in total investment and producing median annual revenues of $500,000 is generating $1.25 in revenue per dollar invested. This is not profit — but it gives you a baseline for modeling.

Then work backward from the revenue figure to estimate net income. Use the FDD's disclosed royalty rates, marketing fund contributions, and any mandatory vendor costs to estimate your variable expense load. Add realistic estimates for rent, labor, and utilities based on your specific market. What is left after all of that is your approximate pre-debt-service income.

Compare that number to your actual debt service and owner compensation requirements. If the math does not work at the median, the investment does not work unless you have strong reason to believe you will be an above-median performer.

QUESTIONS TO ASK FRANCHISORS ABOUT ITEM 19 DATA: The most important question is one most buyers never ask directly: "Can you share the underlying data set behind the Item 19 numbers, broken down by unit, so I can see the full distribution?" Many franchisors will decline — which is itself informative. Some will provide the full dataset.

Ask specifically about the locations that were excluded from the Item 19. Ask how many locations in the system did not meet the disclosure criteria. Ask what happened to franchisees who closed locations in the past three years. Ask whether any locations were excluded because they were in litigation with the franchisor. All of these questions are legally permitted during the validation process.

Finally, call franchisees directly. The FDD Exhibit includes a list of current and recently closed franchisees with their contact information. Call at least 15 to 20 franchisees, including several who have been in the system for under two years. Ask them directly: "Does the Item 19 accurately represent your experience?" The answers will tell you more than any disclosure document can.

Item 19 is the closest thing the FDD system offers to a financial ground truth. Reading it carefully — and understanding its limitations — is not optional for any serious franchise buyer.`,
  },
  {
    slug: "subway-roark-capital-one-year-later",
    title: "Subway Under Roark Capital: One Year Later",
    category: "Brand Analysis",
    date: "February 10, 2025",
    publishedAt: "2025-02-10",
    updatedAt: "2025-02-10",
    readingTime: 10,
    teaser:
      "Roark Capital's acquisition of Subway was the largest restaurant franchise deal in history. Twelve months in, we examine what has changed for existing franchisees, what the new FDD reveals, and whether the turnaround narrative holds up against the numbers.",
    content: `In August 2023, Roark Capital Group completed its acquisition of Subway for approximately $9.6 billion, closing the largest restaurant franchise transaction in history. The deal drew immediate attention from franchisees across Roark's existing portfolio — Arby's, Buffalo Wild Wings, Jimmy John's, Sonic, and others — who recognized that the private equity firm was assembling a food service empire with significant franchisee implications.

One year later, the picture emerging from Subway's FDD filings, franchisee forums, and market data is more complicated than either the optimists or the skeptics predicted.

ROARK'S PORTFOLIO STRATEGY AND WHAT IT SIGNALS: Roark Capital is not a traditional operator. It is a private equity firm with a stated focus on consumer and franchise brands. Its portfolio strategy involves acquiring established franchise systems, implementing operational standardization, accelerating technology investment, and improving unit-level economics through centralized purchasing and supply chain leverage.

For Subway franchisees, this approach carried specific implications from day one. Roark's other restaurant brands have consistently pushed remodel programs as a condition of lease renewal, tightened approved supplier lists to improve corporate margin on food costs, and introduced technology platform fees that represent a new ongoing expense for franchisees. The question was whether Subway's new ownership would follow the same playbook.

FDD CHANGES AFTER ACQUISITION: Comparing Subway's pre-acquisition FDD to its first post-Roark disclosure reveals several meaningful changes. The most significant is the introduction of a technology fee structure that formalized costs that had previously been discretionary or rolled into general marketing fund contributions. Franchisees are now paying a defined per-location monthly fee for POS system access, digital ordering infrastructure, and loyalty program participation.

The marketing fund contribution rate remained unchanged at 4.5% of gross sales, but the allocation of those funds shifted noticeably. A larger proportion is now directed toward digital channels and the MyWay Rewards loyalty program — changes consistent with Roark's data-driven marketing approach across its portfolio. Whether this produces better same-store sales results for individual franchisees is a question the data has not yet definitively answered.

ONGOING UNIT CLOSURES AND THE SCALE OF THE CHALLENGE: Subway's domestic unit count peaked at approximately 27,000 locations and has been contracting for several years. Under Roark's first year of ownership, closures continued. The net change in domestic unit count through 2024 remained negative, though the pace of closures appears to have slowed compared to the 2019 through 2022 period when Subway lost hundreds of locations annually.

The challenge is structural. Many Subway locations were opened in the 2000s and early 2010s under franchise agreements and lease terms that have since become economically difficult to sustain. Labor costs have risen significantly in most markets. The fast casual competitive set — Chipotle, Sweetgreen, and a growing number of regional chains — has captured consumers who previously viewed Subway as a value option. Closing underperforming locations is necessary for system health, but each closure represents a franchisee who has lost their investment.

THE FRESH FORWARD REMODEL REQUIREMENT: Roark accelerated the rollout of Subway's "Fresh Forward" remodel program, which updates store design, equipment, and digital ordering infrastructure. The remodel cost ranges from approximately $75,000 to $200,000 depending on location size and current condition. Franchisees who do not complete the remodel face consequences at lease renewal.

Franchisee response to the remodel program has been sharply divided. Operators who completed early remodels report modest same-store sales improvements, particularly in digital order volume. Operators facing remodel deadlines with marginal locations — locations that were already struggling before the remodel requirement was introduced — view the investment as throwing good money after bad. Several franchisee groups have engaged legal counsel to challenge the enforcement timeline.

HAS FRANCHISEE PROFITABILITY IMPROVED: The honest answer, one year out, is that it is too early to know definitively and the available data is mixed. Subway does not publish unit-level economics in a format that allows clean year-over-year comparisons. Anecdotal franchisee reporting suggests that locations in stronger real estate positions with updated store formats are performing better than they were in 2022 and 2023. Locations in secondary markets with aging formats continue to struggle.

What Roark has clearly changed is the professional management quality at the corporate level. Decision-making has accelerated. Supplier negotiations have been more aggressive, producing some input cost relief for franchisees on key ingredients. The loyalty program is showing genuine traction in urban markets.

What has not changed as quickly as some franchisees hoped is the competitive position of the brand against fast casual alternatives. Subway's value proposition — fresh, customizable sandwiches at an accessible price point — remains intact, but the competitive environment has not softened.

WHAT EXISTING FRANCHISEES ARE SAYING: Franchisee sentiment, as measured across several independent operators and forum communities, falls roughly into thirds. Approximately one-third of franchisees are cautiously optimistic about Roark's ownership, citing the professionalism of new management, better technology infrastructure, and early signs of same-store sales improvement in remodeled locations. One-third are neutral — acknowledging that the new ownership has not made things significantly worse while waiting to see whether the remodel investment pays off. One-third are frustrated, primarily with the remodel cost burden and the pace of change relative to ongoing margin pressure.

The most consistent complaint among frustrated franchisees is not the direction of the changes — most acknowledge that remodeling and technology investment are necessary — but the financial timing. Being asked to invest $100,000 or more in a remodel when margins are still recovering from post-pandemic cost inflation feels, to many operators, like a capital call at the worst possible moment.

For prospective Subway franchisees, the Roark acquisition should be viewed as both a meaningful improvement in corporate management quality and a signal that the franchise will require ongoing capital investment in the years ahead. The brand's path to restored domestic unit growth runs through a remodeled, digitally integrated store fleet — and that investment will fall substantially on existing and incoming franchisees.`,
  },
  {
    slug: "hidden-cost-boutique-fitness-franchises-2025",
    title: "The Hidden Cost of Boutique Fitness Franchises in 2025",
    category: "Category Report",
    date: "January 22, 2025",
    publishedAt: "2025-01-22",
    updatedAt: "2025-01-22",
    readingTime: 10,
    teaser:
      "Boutique fitness was the fastest-growing franchise category of the last decade — and now among the most troubled. Unit closures, compressed margins, and shifting consumer habits are creating a very different picture than the pitch decks suggest.",
    content: `Between 2015 and 2020, boutique fitness franchises were among the most coveted investments in the franchise industry. Club Pilates, Pure Barre, CycleBar, YogaSix, and dozens of competitors grew at extraordinary rates, fueled by a consumer wellness trend, an investor class eager to back membership-based recurring revenue, and franchise discovery day presentations that made the math look compelling on paper.

In 2025, the picture is significantly darker. The category is dealing with the aftermath of pandemic closures, a contraction in consumer discretionary spending, structural problems with the membership model, and a publicly traded parent company — Xponential Fitness — that has faced serious financial and legal challenges with direct implications for its franchisees.

THE BOUTIQUE FITNESS BOOM AND THE FORCES BEHIND IT: The boutique fitness category grew from approximately $2 billion in annual revenue in 2015 to over $7 billion by 2019. The growth was driven by several converging trends. Millennials demonstrated a willingness to pay premium prices for specialized, community-oriented fitness formats compared to traditional big-box gyms. The rise of social fitness — where the social experience of working out with a group was as important as the fitness outcome — created strong member retention when studios executed well.

For franchise buyers, the model appeared to offer several structural advantages. Recurring membership revenue created income predictability. The fitness category was characterized as recession-resistant. The premium price point — $150 to $250 per month for membership — suggested strong unit economics relative to the modest physical footprint of a boutique studio.

These assumptions turned out to contain significant weaknesses that became apparent only after the pandemic forced widespread closures and membership attrition.

XPONENTIAL FITNESS FINANCIAL DISTRESS AND FRANCHISEE IMPLICATIONS: Xponential Fitness, the holding company behind Club Pilates, Pure Barre, CycleBar, YogaSix, StretchLab, Row House, AKT, BFT, and Lindora, went public in 2021. Its stock price trajectory since the IPO has been a difficult story. The company has faced SEC investigations related to its accounting disclosures, the departure of its founding CEO, and multiple shareholder lawsuits. In early 2024, the company disclosed material weaknesses in its internal controls.

For franchisees operating under any Xponential brand, this matters for practical reasons beyond the share price. A financially distressed franchisor is less able to invest in system-wide marketing, technology, and franchisee support. Vendor relationships and negotiated supplier pricing — benefits that flow to franchisees through franchisor leverage — depend on the franchisor maintaining operational stability. The uncertainty around Xponential's corporate structure has made franchise resales more difficult, as prospective buyers apply higher risk discounts to Xponential brands.

THE TRUE COST OF THE MEMBERSHIP MODEL: Boutique fitness franchises present their revenue model as a recurring membership subscription. What the discovery day materials rarely discuss in detail is the true cost of acquiring and retaining those members.

Member acquisition cost in the boutique fitness category typically runs between $100 and $250 per new member through digital advertising, introductory promotions, and referral programs. Monthly member churn — the percentage of the member base that cancels each month — runs between 5% and 10% in most mature studios. A studio with 300 members and 7% monthly churn loses approximately 21 members per month. To maintain its membership base, the studio must spend $2,100 to $5,250 per month on new member acquisition just to stay flat.

The math of break-even membership thresholds is frequently presented at discovery days with optimistic churn assumptions. A studio with $20,000 per month in fixed costs (rent, labor, equipment lease, royalties, marketing fund) needs approximately 133 members paying $150 per month to cover fixed costs alone. Achieving that threshold takes most studios 12 to 18 months after opening, during which the operator is funding operating losses out of personal capital. FDD projections do not always make the ramp-up period's cash requirement explicit.

FDD PROJECTIONS VERSUS ACTUAL FRANCHISEE OUTCOMES: The gap between the financial projections presented during franchise discovery and the actual outcomes experienced by franchisees is, in the boutique fitness category, among the widest of any franchise sector we have analyzed. This is not primarily a matter of fraud — it is a matter of model assumptions that were calibrated during a period of unusual consumer enthusiasm for the category and that have not been updated to reflect current conditions.

Studios opened between 2017 and 2019 that achieved membership thresholds of 300 to 400 members within their first year appeared to validate the model. Studios opened in 2022 and 2023 in similar markets have struggled to reach those same thresholds, facing more competition, higher member acquisition costs, and consumers with more workout alternatives — including at-home platforms like Peloton and Apple Fitness+ — than existed when the earlier cohort was built.

CATEGORY-WIDE CLOSURE RATE DATA: The boutique fitness category experienced elevated closure rates during the pandemic and has not fully recovered. Based on FDD filings and industry tracking data, the net unit change for most boutique fitness brands has been flat to negative over the past two years. Club Pilates, the largest brand in the Xponential portfolio, has maintained positive net unit growth, but many of the smaller brands have seen more closures than openings.

The closure rate data matters for prospective buyers because it directly affects resale value. A franchise that is difficult to sell at a reasonable price is a less attractive investment than the upfront economics suggest. If you need to exit the business in year five, the exit value depends on a buyer being willing to purchase a franchise in a category that may be contracting.

IS BOUTIQUE FITNESS STILL WORTH INVESTING IN: The answer depends almost entirely on which brand, which market, and which operator. The category is not dead — Pilates and yoga-based formats have demonstrated more resilience than cycling and rowing formats, which have faced competition from at-home alternatives. Brands with lower investment costs, stronger franchisor financials, and demonstrated unit economics in markets similar to your target location remain potentially viable investments.

What has changed is the margin for error. Boutique fitness worked exceptionally well when member acquisition was cheap, when consumers were enthusiastically exploring premium fitness formats, and when the competitive set was thinner. None of those conditions exist as robustly in 2025 as they did in 2018. A prospective buyer needs to model the business under realistic current assumptions about member acquisition cost, churn, and competition — not the assumptions embedded in a discovery day presentation developed when the category was at its peak.`,
  },
  {
    slug: "fdd-red-flags-franchise-attorneys-look-for-first",
    title: "FDD Red Flags That Every Franchise Attorney Looks For First",
    category: "Legal",
    date: "January 8, 2025",
    publishedAt: "2025-01-08",
    updatedAt: "2025-01-08",
    readingTime: 10,
    teaser:
      "We interviewed five franchise attorneys about the specific disclosures that make them tell clients to walk away. Their answers reveal a shortlist of warning signs that most buyers never look for — and franchisors have no obligation to highlight.",
    content: `Hiring a franchise attorney before signing a franchise agreement is not optional due diligence. It is the single most consequential professional engagement a prospective franchisee can make. A qualified franchise attorney will review the FDD and franchise agreement with a different set of priorities than a general commercial attorney — and very different priorities than the prospective franchisee reading the document themselves.

We spoke with several experienced franchise attorneys about the specific provisions they review first, the language patterns that concern them most, and the situations where they advise clients to walk away. Their answers converge on a consistent set of red flags that most buyers never check.

ITEM 3 LITIGATION PATTERN: The first place experienced franchise attorneys turn is Item 3, which discloses pending and concluded litigation involving the franchisor. What they are looking for is not simply whether litigation exists — it is the pattern of litigation and who the parties are.

Litigation between a franchisor and its own franchisees is the most significant signal. A history of lawsuits where the franchisor has sued franchisees for contract violations, or where franchisees have sued the franchisor alleging fraud, misrepresentation, or breach of contract, tells a story about the relationship dynamic in the system. One or two lawsuits in a system of 500 units is not unusual. Twenty lawsuits in a system of 200 units is a serious concern.

The type of franchisee complaint matters. Lawsuits alleging that the franchisor misrepresented financial performance, failed to provide promised territory protection, or imposed retroactive contract changes are qualitatively different from lawsuits alleging that a franchisee violated the operations manual. The former category suggests systemic franchisor problems. The latter suggests individual franchisee compliance failures.

ITEM 19 OMISSION OR MISLEADING PRESENTATION: Franchise attorneys view an Item 19 omission not just as a red flag but as a near-disqualifying feature for any brand above a minimum scale. A franchise system with more than 50 units that declines to provide any financial performance representation is withholding information that should be central to a buyer's investment decision.

When Item 19 is present, attorneys review the methodology footnotes carefully. Subset presentations — particularly those excluding recently opened units, underperforming units, or specific geographic markets — are examined skeptically. The question is whether the disclosed population is representative of the experience a new franchisee is likely to have.

NON-COMPETE SCOPE: Non-compete provisions in franchise agreements have become significantly more aggressive over the past decade. The current standard includes both an in-term covenant (you cannot operate a competing business while you are a franchisee) and a post-term covenant (you cannot operate in a related business for a specified period after the agreement ends).

The concern is not with the existence of non-competes — they are a standard and generally enforceable feature of franchise agreements — but with the scope. Post-term covenants that prohibit franchisees from working in "any capacity" in a broadly defined industry for two or three years, covering a radius of 25 miles or more, are materially different from covenants limited to operating a directly competing business within the immediate trade area. The enforceability of broad non-competes varies significantly by state, but even unenforceable covenants impose litigation costs on departing franchisees.

TERRITORY ENCROACHMENT CARVE-OUTS: The franchise agreement's territory section is among the most complex and most consequential provisions in the document. Franchise attorneys focus particular attention on the exceptions and carve-outs to territorial protection.

Common problematic carve-outs include provisions allowing the franchisor to sell through alternative channels — e-commerce, corporate-run delivery platforms, ghost kitchens, or national retail partnerships — without compensating the franchisee for sales that occur within or near their territory. A franchise agreement that grants a franchisee a protected geographic territory but explicitly excludes digital orders, third-party delivery platforms, or "non-traditional locations" from that protection can render the territory grant substantially meaningless in markets with high delivery penetration.

TRANSFER RESTRICTIONS: Transfer restrictions govern a franchisee's ability to sell their franchise to a third party. Franchise attorneys review these provisions carefully because they directly affect exit value. Aggressive transfer provisions — those that give the franchisor a right of first refusal at a price set by the franchisor's own methodology, or those that impose transfer fees above 5% of total consideration, or those that require comprehensive remodeling as a condition of approving a sale — can reduce franchise resale value significantly.

The right of first refusal provision deserves particular attention. A right of first refusal that allows the franchisor to match any bona fide offer creates uncertainty for buyers and sellers alike. It reduces the pool of potential buyers willing to engage in a serious negotiation process, knowing that the franchisor can preempt their investment at the last moment.

RENEWAL TERM CHANGES: Renewal provisions determine what happens when the initial franchise term expires. Most franchise agreements include a right to renew — but renewal is typically conditioned on signing "the then-current franchise agreement," which may be materially different from the original agreement.

This is one of the most significant long-term risks in franchise agreements. A franchisee who signs a 10-year agreement with a 6% royalty rate and renews into an agreement with an 8% royalty rate and mandatory technology fees has experienced a retroactive change to the economics of their investment. The franchisor has not violated the original agreement — the renewal provision explicitly permits this. But the economic impact on the franchisee can be substantial.

TERMINATION TRIGGERS: Termination provisions specify the conditions under which the franchisor can terminate the franchise agreement. Franchise attorneys review these provisions for breadth and cure periods. Termination triggers that include highly subjective standards — "failure to maintain brand standards," "behavior detrimental to the system," or "repeated minor violations" — without clear definitions or adequate cure periods give franchisors dangerous discretion.

The cure period matters enormously. An agreement that allows termination on 30 days' notice with no cure period for alleged violations is materially worse than one that requires a 90-day cure period with specific remediation steps. The combination of broad termination triggers and short cure periods without right to arbitrate creates significant business risk for franchisees.

SUPPLIER LOCK-IN: The approved supplier provision determines where franchisees must purchase equipment, ingredients, supplies, and services. The concern is not with the existence of approved supplier lists — quality control through supplier standardization is a legitimate franchisor interest — but with the financial structure of those relationships.

Franchise attorneys look for disclosure of whether the franchisor or its affiliates receive rebates, commissions, or other payments from approved suppliers. This information is required to be disclosed in Item 8 of the FDD. When the disclosure reveals that the franchisor captures significant revenue through supplier relationships, the royalty rate in the franchise agreement represents only part of the franchisee's total cost of brand affiliation.

HOW TO NEGOTIATE FRANCHISE AGREEMENTS: Most franchisors present their franchise agreement as a standard form that they do not negotiate. In practice, the degree of flexibility varies considerably by brand size, market conditions, and how much a particular buyer is valued. Smaller systems and systems in active growth phases are generally more negotiable than established brands with waiting lists of qualified candidates.

The provisions most commonly negotiated are territory size, transfer fee structure, and cure periods on termination. Non-compete scope is occasionally negotiable, particularly in states with strong non-compete limitations. Royalty rates are almost never negotiable on standard agreements, though some franchisors will negotiate royalty deferrals during the ramp-up period.

Having a franchise attorney negotiate on your behalf signals seriousness and provides legal leverage that buyers negotiating directly do not have. The attorney fee for an FDD review and negotiation engagement — typically between $2,500 and $7,500 depending on complexity — is one of the best investments a franchise buyer can make relative to the transaction size being contemplated.`,
  },
  {
    slug: "mcdonalds-vs-chick-fil-a-which-franchise-makes-more-money",
    title: "McDonald's vs. Chick-fil-A: Which Franchise Model Actually Makes Franchisees More Money?",
    category: "Comparison",
    date: "December 15, 2024",
    publishedAt: "2024-12-15",
    updatedAt: "2024-12-15",
    readingTime: 10,
    teaser:
      "On paper, Chick-fil-A costs almost nothing to open. McDonald's requires $1–2M. But the economics of who actually profits — and how much — are so much more nuanced than the entry cost comparison suggests.",
    content: `The comparison between McDonald's and Chick-fil-A franchise models is one of the most instructive exercises in understanding how differently franchise systems can be structured — and how entry cost alone tells you almost nothing about which model will make you more money.

The surface-level comparison is seductive in its simplicity: Chick-fil-A charges operators approximately $10,000 to join the system. McDonald's requires franchisees to bring $1 million to $2 million in unencumbered capital. Based on those numbers alone, Chick-fil-A appears to be an extraordinary deal. The reality is considerably more complicated, and the complication reveals important truths about what you are actually buying in each model.

WHAT YOU ARE ACTUALLY BUYING: In the McDonald's model, you are purchasing a business. When you become a McDonald's franchisee, you own the equipment in the restaurant, you sign the lease or own the real estate in some cases, and you own the ongoing cash flows of the location. You can sell that business to another qualified franchisee. The $1 million to $2 million you invest represents real ownership interest in a real operating business that you can eventually exit with equity.

In the Chick-fil-A model, you are purchasing an operating partnership. Chick-fil-A corporate owns the restaurant, the real estate, and all of the equipment. The $10,000 operator fee is essentially a qualification and commitment signal, not a capital investment in an asset you will own. You operate the restaurant on behalf of Chick-fil-A. When you leave the system, you do not sell a business — you simply end the operating agreement. There is no equity to cash out.

This distinction is not a technicality. It is the central economic difference between the two models, and failing to understand it leads to apples-to-oranges financial comparisons.

THE MCDONALD'S UNIT ECONOMICS: McDonald's is among the highest-volume quick service restaurant brands in the world. Average annual revenues at a U.S. McDonald's location have historically been in the $3 million to $3.5 million range, with some high-volume urban locations exceeding $5 million. McDonald's charges franchisees a 4% royalty on gross sales plus a 4% marketing fund contribution, for a combined fee rate of approximately 8% of gross revenue.

The key variable in McDonald's franchisee profitability is rent. McDonald's is one of the most sophisticated real estate operators in the world. The company owns or controls the real estate for the majority of its franchised locations and leases it back to franchisees at rates structured to capture a meaningful share of the unit economics. McDonald's effectively sits between the franchisee and the landlord, collecting a rent premium on top of the royalty. McDonald's franchise agreements and real estate lease terms are interlinked — leaving the franchise system typically means losing the location.

After royalties, marketing fees, and the McDonald's real estate lease, a franchisee at an average-volume McDonald's location typically retains operating income (before debt service on the franchise purchase price) of approximately $150,000 to $400,000 per year depending on location performance, local labor markets, and operating efficiency. The wide range reflects genuine variation in unit economics across the system.

THE CHICK-FIL-A UNIT ECONOMICS: Chick-fil-A units are among the highest-volume quick service restaurants in the country on a per-location basis. Average annual revenues at a Chick-fil-A exceed $8 million — more than double the McDonald's average. The brand's extraordinary sales productivity relative to its unit count reflects its selective expansion strategy, its closed-on-Sunday policy that concentrates consumer visits into six days, and the intense community and cultural brand loyalty it has cultivated.

Chick-fil-A operators receive approximately 50% of the restaurant's profits after the company takes its share. Based on the average annual revenue and typical quick service profit margins, Chick-fil-A operators have been widely reported to earn between $200,000 and $300,000 per year in income. Some high-volume operators earn more. The $10,000 entry fee makes this an extraordinary return on invested capital — on paper.

But the financial comparison requires accounting for the opportunity cost of the model. A McDonald's franchisee who invests $1.5 million and earns $250,000 annually is generating a 16.7% return on invested capital. A Chick-fil-A operator who invests $10,000 and earns $250,000 is generating an astronomical return on nominal invested capital — but they have not built an asset. When they leave, they take their operating income from previous years and nothing else.

WHO ACTUALLY PROFITS MORE: On an annual income basis, Chick-fil-A operators and McDonald's franchisees with average-volume locations earn comparable amounts — roughly $200,000 to $300,000 per year for strong operators. The income comparison looks similar. The wealth comparison does not.

A McDonald's franchisee who operates three average-volume locations for 15 years and then sells their portfolio has created a sellable asset worth several million dollars. The business sale proceeds are separate from and additive to the operating income earned over 15 years. A Chick-fil-A operator who operates for 15 years and then exits has earned operating income over that period but has no asset to sell.

For wealth building — the accumulation of net worth rather than just annual income — the McDonald's model is structurally superior. For annual income relative to capital at risk, the Chick-fil-A model is structurally superior.

WHY MCDONALD'S FRANCHISEES RARELY SELL AND WHY CFA OPERATORS APPLY COMPETITIVELY: McDonald's franchise transfers occur at relatively low frequency because the economics of holding are strong. A McDonald's franchise generating $250,000 per year in operating income can be sold for approximately $1 million to $1.5 million depending on lease terms and location performance. Franchisees who have held locations for many years and paid down the original acquisition debt are in strong financial positions — their equity in the business has grown substantially, and the annual cash yield on that equity is high. There is little motivation to sell unless the franchisee wants to retire or redeploy capital.

Chick-fil-A operators apply for the system competitively — acceptance rates are famously below 1% of applicants — because the income relative to capital at risk is extraordinary. The selection process is intensive and focuses as much on character and community engagement as on business qualifications. Chick-fil-A has built a model where operator selection is a competitive advantage. Highly motivated, community-embedded operators who are not distracted by equity ownership concerns produce exceptionally well-run restaurants that sustain the brand's revenue premium.

WHICH MODEL IS BETTER FOR WEALTH BUILDING: The answer depends on the buyer's financial situation and objectives. For a buyer with significant capital who wants to build a multi-unit business with real equity value over 10 to 15 years, McDonald's offers a clearer path to wealth accumulation through asset appreciation and the ability to leverage and scale the investment.

For a buyer with modest capital who wants maximum annual income relative to capital committed, the Chick-fil-A model — if one can be accepted into the highly selective system — offers a superior income-to-investment ratio.

The most honest framing is this: McDonald's is a real estate and brand business where you build equity. Chick-fil-A is a managed operating partnership where you earn income without building equity. Both can be excellent financial outcomes. They are simply different in their structure, their wealth-building profile, and what they ultimately represent as investments. Understanding that distinction clearly, before romanticizing the $10,000 entry fee comparison, is the beginning of a serious evaluation of either model.`,
  },
  {
    slug: "best-franchise-categories-2025",
    title: "The Best Franchise Categories to Invest In for 2025",
    category: "Market Analysis",
    date: "March 25, 2025",
    publishedAt: "2025-03-25",
    updatedAt: "2025-03-25",
    readingTime: 11,
    teaser:
      "Not all franchise categories are equal. Our analysis of 102 franchise systems across 12 categories reveals which sectors have the strongest unit economics, lowest turnover rates, and best franchisee satisfaction scores heading into 2025.",
    content: `HOW WE RANKED: METHODOLOGY: This analysis evaluated 102 franchise systems across 12 categories using five weighted criteria: unit-level economics (as disclosed in Item 19), Item 19 disclosure rates (the percentage of brands in each category that voluntarily publish financial performance representations), three-year turnover rates (calculated from successive FDD Item 20 filings), franchisee satisfaction scores (drawn from Franchise Business Review and independent operator surveys), and net unit growth over the trailing three years. Categories were ranked on an aggregate score from these five inputs. The goal was not to identify the flashiest categories but to identify where franchisees are actually making money and staying in the system.

HOME SERVICES — THE CLEAR WINNER: Home services emerged as the strongest franchise category in our analysis by a meaningful margin. The investment range is relatively accessible — most concepts fall between $100,000 and $300,000 in total startup costs — and the category benefits from two powerful structural tailwinds: the aging of the U.S. housing stock, which drives ongoing demand for repair, maintenance, and improvement services, and the demographic trend of homeowners staying in their homes longer and hiring out more tasks they previously did themselves.

Standout performers within the category include Mosquito Joe, Budget Blinds, and Ace Handyman, all of which show Item 19 average satisfaction scores above 7.5 out of 10. The category's Item 19 disclosure rate of 65% is above the franchise industry average of approximately 55%, indicating that home services franchisors are relatively willing to publish financial performance data — a positive signal about system confidence. Average franchisee satisfaction across the category is 7.9 out of 10, the highest of any category in our analysis.

The recurring revenue component of many home services concepts adds additional investment appeal. Mosquito Joe and similar service businesses generate repeat seasonal business from the same customer base year after year. This reduces the customer acquisition burden relative to one-time transaction businesses and creates more predictable cash flow for operators.

SENIOR CARE — STRONG FUNDAMENTALS, TIGHT LABOR: The senior care category presents compelling investment fundamentals alongside a significant operational challenge. The U.S. population over 65 is growing at the fastest rate in American history — the baby boom generation is aging through the period of peak care demand — and this demographic tailwind is not temporary or cyclical. It is a 20-year structural trend that makes the underlying market demand for senior care services among the most reliable in the franchise universe.

Investment costs are relatively modest for the category: most non-facility senior care concepts (home-based care, companionship, and light medical support) require between $100,000 and $200,000 in total startup costs. Revenue models are built on recurring care plans rather than one-time transactions, which creates income stability similar to the subscription model in other categories. Comfort Keepers, Home Instead, and Interim HealthCare all show strong financial disclosures and healthy franchisee retention rates.

The central challenge that prevents senior care from ranking above home services is caregiver recruitment and retention. The labor market for professional caregivers is structurally tight across most U.S. markets. Wages have risen substantially in the post-pandemic period, and the supply of qualified caregivers has not kept pace with demand. Franchisees who underestimate the ongoing cost and complexity of staffing their businesses face margin compression that is not reflected in optimistic Item 19 projections developed during better labor market conditions. Average franchisee satisfaction in the category is 7.8 out of 10 — strong, but slightly below home services.

SPECIALTY FOOD — SELECT CONCEPTS OUTPERFORMING: The food and beverage category is too broad to evaluate as a monolith, and the specialty food subcategory illustrates this clearly. Within a single category, there are brands generating exceptional investor returns and brands in accelerating contraction — often operating in nearby market segments.

Nothing Bundt Cakes, Tropical Smoothie Cafe, and Wingstop represent the outperforming tier. All three show exceptional same-store sales growth, strong Item 19 financial performance data, and net unit growth rates that exceed the category average by a meaningful margin. Their success reflects differentiated concepts with strong consumer loyalty, attractive price points relative to the product experience, and operational models that work within the current labor and food cost environment.

The contrast with declining brands in the broader quick service category is instructive. Checkers/Rally's and Papa John's have both experienced significant net unit contraction in recent years, with franchisee economics under pressure from rising food costs, labor inflation, and competitive intensity in the value segment. The lesson is that category membership tells you very little — specific brand selection within a category is the dominant variable.

BOUTIQUE FITNESS — HIGH RISK AFTER XPONENTIAL TROUBLES: Boutique fitness was the fastest-growing franchise category of the prior decade and has become one of the most troubled. The parent company of Club Pilates and Pure Barre, Xponential Fitness, had its stock delisted in 2024 after disclosing material weaknesses in its internal controls and facing multiple regulatory and legal challenges. The category-wide closure rate has remained above average since the pandemic, and the competitive environment for consumer fitness spend has intensified with the proliferation of at-home and digital alternatives.

This does not mean every boutique fitness concept is a poor investment — The Joint Chiropractic and Stretch Zone are notable exceptions that have maintained strong unit economics, positive net growth, and high franchisee satisfaction within the broader wellness category. But investors considering any Xponential brand should apply heightened scrutiny to the corporate parent's financial stability and its implications for franchisee support, technology investment, and system-wide marketing.

CLEANING AND MAINTENANCE — UNDERRATED OPPORTUNITY: Commercial and residential cleaning franchises represent one of the most consistently underrated investment categories in franchising. Jan-Pro, The Maids, and Stanley Steemer show steady returns with investment requirements that are among the lowest in the franchise universe — most concepts require under $150,000 in total startup costs, and several master franchise models require even less for the initial territory acquisition.

Commercial cleaning in particular shows recession-resistant characteristics. Businesses need their facilities cleaned regardless of economic conditions, and long-term service contracts create predictable, recurring revenue that supports franchisee cash flow through economic cycles. The category's average turnover rate and franchisee satisfaction scores are both solidly in the acceptable range, and Item 19 disclosure rates have been improving as the category matures.

CATEGORIES TO APPROACH WITH CAUTION: Three categories in our analysis raised concerns significant enough to warrant explicit caution for prospective buyers. Traditional print and retail concepts face secular demand headwinds from digital alternatives that are structural rather than cyclical. Value dining concepts are experiencing sustained margin compression from labor cost inflation, and the brands with the most franchisee suffering are concentrated in this tier. Mall-based retail franchises face ongoing foot traffic headwinds from e-commerce that show no signs of reversing.

None of these categories is uniformly uninvestable — there are well-run individual brands in each. But the category-level headwinds create an environment where the margin for operational error is thin and where external forces outside the franchisee's control are working against the investment.

THE 3-METRIC FRAMEWORK: When shortlisting categories for further investigation, use these three metrics as a screening test. First, Item 19 disclosure rate above 60% — categories where fewer than 60% of brands publish financial performance representations contain too many operators hiding their results. Second, category average turnover rate below 7% — any category averaging above 7% annual franchisee turnover is experiencing structural problems that will affect your investment. Third, net unit growth positive over three years — categories with sustained negative net growth are contracting, which reduces resale values and signals franchisee dissatisfaction.

Any category that fails two of these three tests requires extraordinary additional scrutiny before investment. Use the framework as a filter, not as a final answer — individual brand selection within a passing category still requires the full due diligence process.`,
  },
  {
    slug: "understanding-fdd-item-20-unit-economics",
    title: "Item 20 Decoded: How to Use Unit Turnover Data to Spot System Problems",
    category: "FDD Analysis",
    date: "March 18, 2025",
    publishedAt: "2025-03-18",
    updatedAt: "2025-03-18",
    readingTime: 8,
    teaser:
      "Item 20 of the FDD is often the most revealing section — and the most skipped. It shows exactly how many franchises opened, closed, and changed hands over the past three years. Here's how to read it properly.",
    content: `Item 20 of the Franchise Disclosure Document is the section that franchise attorneys and experienced buyers read first, and that most first-time buyers skim or skip entirely. It contains no marketing language, no testimonials, and no aspirational projections. It contains raw data about the one thing that matters more than almost anything else in franchise evaluation: what is actually happening to franchisees in this system over time.

WHAT ITEM 20 ACTUALLY CONTAINS: The FTC's franchise disclosure rule requires Item 20 to include eight distinct sub-tables covering five years of system activity. The first table lists current franchisees by state with their contact information. The second presents a system-wide summary showing, for each of the past five years, the number of franchised outlets at the start of the year, the number opened, the number closed, the number terminated, the number not renewed, the number reacquired by the franchisor, and the number ceased operations. Additional tables cover transfers, projected openings, and franchisee contact information for those who left the system in the past year.

Each of these tables contains information that, when properly analyzed, tells a detailed story about the health and trajectory of the franchise system. The goal is not to find perfect numbers — no system is perfect — but to identify patterns that reveal whether franchisees are succeeding, struggling, or leaving at rates that suggest fundamental problems.

THE TURNOVER RATE CALCULATION: The turnover rate is the single most important metric you can calculate from Item 20, and it is never presented directly by the franchisor — you must calculate it yourself. The formula is straightforward: add all exits (closures plus transfers plus terminations plus non-renewals) for a given year, then divide by the total number of units at the start of that period. Multiply by 100 to express as a percentage.

A turnover rate below 5% is excellent. It indicates that franchisees are staying in the system, performing well enough to continue operating, and choosing not to exit when they have the opportunity. Rates between 5% and 8% are normal for a healthy system — some franchisee exits are expected in any year. Rates above 10% are a warning sign that requires investigation. Rates above 15% constitute a serious red flag indicating widespread franchisee dissatisfaction, financial failure, or both. Calculate this metric for each of the five years covered in Item 20 and look at the trend — a rate that is stable at 8% is different from one that was 5% three years ago and has been climbing.

NET UNIT GROWTH: THE MOST HONEST SYSTEM HEALTH METRIC: Net unit growth is calculated by subtracting the number of units at the beginning of a year from the number at the end. A positive number means the system is expanding — more franchisees are entering than leaving. A negative number means the system is contracting. Any franchise system showing sustained negative net unit growth over three or more consecutive years has a fundamental problem: franchisees are leaving faster than new franchisees are entering, which means the opportunity is not compelling enough to attract buyers at the pace needed to sustain growth.

Sustained negative growth also affects you as a potential franchisee in a practical way: it reduces the pool of comparable sales data for resale valuation, signals potential brand equity erosion, and indicates that the franchisor is not successfully attracting new capital into the system. None of these are positive signals for the exit value of your investment.

FINDING THE REAL CLOSURE RATE: Some franchisors present Item 20 data in ways that obscure the distinction between voluntary exits and failure-driven exits. A transfer listed in Item 20 could represent a successful franchisee who built a valuable business and sold it to a qualified buyer — or it could represent a struggling franchisee who sold at a loss to exit an unprofitable situation. The Item 20 tables do not automatically distinguish between these scenarios.

The category that most clearly obscures failures is "reacquired by franchisor." When a unit is reacquired by the franchisor, it is typically because the franchisee could not operate it profitably and the franchisor took it back rather than allowing it to close outright. This is not a voluntary transfer — it is functionally equivalent to a closure from the franchisee's perspective. During validation calls, ask franchisees directly: what percentage of transfers in the system are voluntary sales versus distressed exits? The FDD does not tell you this; the people in the system can.

READING THE 5-YEAR HISTORY TABLE: The most powerful use of Item 20 is reading trends across the full five-year history, not just the most recent year. A system with 1,200 units in 2020 that has declined to 900 units in 2024 is telling a materially different story than a system with 800 units in 2020 that has grown to 1,100 units over the same period. The trajectory matters as much as the current number. Look specifically for inflection points — years where the trend changed significantly — and investigate what happened in the business or the competitive environment during that period.

CROSS-REFERENCING WITH ITEM 3 LITIGATION: Item 20 turnover data is most informative when read alongside Item 3, the litigation disclosure. The combination of high turnover and active franchisee-initiated litigation against the franchisor is the most reliable indicator of systemic problems in a franchise system. High turnover alone could reflect normal lifecycle churn. Active franchisee litigation alone might reflect a small number of difficult operators. The combination of both — franchisees leaving at above-average rates while other franchisees are suing the franchisor — indicates widespread dissatisfaction with fundamental aspects of the franchise relationship. Conversely, low turnover combined with zero franchisee-initiated litigation is among the strongest indicators of system health available in the FDD.

CALLING EX-FRANCHISEES: Item 20 includes a mandatory list of franchisees who left the system in the past year, with their contact information. This list is one of the most valuable assets in the entire FDD for due diligence purposes, and it is consistently underutilized by buyers who focus only on current franchisees. Ex-franchisees are typically more candid than current franchisees because they have no ongoing relationship with the franchisor to protect. Call at least three. Ask why they left, whether they would make the same investment decision again, whether the financial performance matched what they were shown during the sales process, and whether they experienced any problems with the franchisor that influenced their decision to exit.

REAL EXAMPLES FROM THE MARKET: To illustrate how Item 20 analysis works in practice, consider two hypothetical systems. Franchise "Alpha Subs" shows five consecutive years of positive net unit growth, a stable turnover rate of 4.8% per year, zero franchisee-initiated litigation in Item 3, and a growing total unit count from 320 to 480 over the period. This pattern suggests franchisees are succeeding, new buyers are attracted to the opportunity, and the franchisor relationship is functioning well. Franchise "Beta Burgers" shows three consecutive years of negative net unit growth, a turnover rate that increased from 7% to 13% over four years, two active franchisee lawsuits in Item 3 alleging financial misrepresentation, and a total unit count that declined from 290 to 215 over the period. These numbers tell a story of systemic failure — franchisees are leaving faster than the franchisor can replace them, and some are leaving angry enough to hire attorneys. The FDD is not hiding this information. It is right there in Item 20. Reading it carefully is how you avoid becoming one of the exits counted in next year's tables.`,
  },
  {
    slug: "franchise-resale-buying-existing-unit",
    title: "Buying a Franchise Resale: The Smarter Path Most Buyers Don't Consider",
    category: "Investment Guide",
    date: "March 10, 2025",
    publishedAt: "2025-03-10",
    updatedAt: "2025-03-10",
    readingTime: 10,
    teaser:
      "New franchise development gets all the attention, but buying an existing franchised unit — a 'resale' — often offers better risk-adjusted returns. Established cash flow, proven location, existing customer base. Here's what to look for and what to watch out for.",
    content: `The franchise industry's marketing machine is built around new development. Discovery days are designed to recruit new franchisees. Franchise brokers are typically compensated on new franchise sales. Franchise trade shows feature new opportunity presentations. And yet, some of the most sophisticated franchise buyers consistently pursue resales — the acquisition of an existing, operating franchised unit from a franchisee who wants to exit — rather than new development. Understanding why reveals important truths about how franchise risk actually works.

WHY RESALES OUTPERFORM NEW DEVELOPMENT IN RISK-ADJUSTED TERMS: The fundamental advantage of a resale is that you eliminate the ramp-up risk that makes new franchise development so financially treacherous. A new franchisee opens a location with zero customers, zero trained staff, and no operational history. The 12 to 24 months required for a typical new franchise unit to find its revenue level — to build its customer base, refine its operations, and reach the revenue point where it is covering its costs — is a period of ongoing cash consumption funded entirely by the franchisee's own capital.

A resale eliminates this ramp-up period or substantially compresses it. You are acquiring existing customers, trained staff who already know the operations, a proven location with established foot traffic patterns, and — critically — real historical cash flow data that tells you what this specific unit actually generates, not what the FDD suggests a typical unit might generate. The difference between investing based on FDD projections and investing based on three years of actual unit P&L data is the difference between estimated risk and measurable risk. Resales offer the latter.

WHAT YOU ARE ACTUALLY BUYING: When you acquire a franchise resale, you are purchasing a bundle of assets that includes the existing franchise agreement and its remaining term, the lease (either through a sublease from the franchisor or a direct assignment), equipment and improvements, customer relationships, trained staff, and goodwill. Goodwill — the economic value of the established customer base and business reputation — is typically the largest component of the purchase price in a well-performing resale.

Understanding the lease situation is critical. Many franchise agreements require that the franchisor hold the master lease, with the franchisee operating under a sublease. In a resale, you are typically assuming or entering into a new sublease with the franchisor rather than directly assuming the prior franchisee's lease. Review the lease terms carefully — particularly the remaining term, options to renew, and any provisions that give the franchisor the right to modify lease economics at renewal.

VALUATION — HOW RESALES ARE PRICED: Franchise resales are typically valued using one of two methods, depending on the size and type of business. The first is a multiple of EBITDA — earnings before interest, taxes, depreciation, and amortization — which typically falls in the range of 2 to 4 times annual EBITDA for franchise resales in most categories. The second is a multiple of owner's discretionary earnings, which adds back owner compensation to the EBITDA figure and typically ranges from 1.5 to 3 times for small to mid-size franchise units. For restaurant concepts, a common additional benchmark is 30% to 40% of annual gross revenue for established units with clean operating histories.

The critical valuation check is comparing the resale price to the cost of new development. If a resale is priced above what it would cost to open a new unit of the same brand, the premium must be justified by demonstrably superior cash flow, a better-than-typical location, or other factors that make the existing unit more valuable than a new one. In many cases, however, resales are priced at or below the cost of new development — particularly for units whose sellers are motivated to exit — which is where the risk-adjusted return advantage becomes most pronounced.

WHY SELLERS SELL: Understanding the seller's motivation is one of the most important elements of resale due diligence, and it is one that many buyers approach too superficially. Common legitimate reasons to sell include retirement, health changes, relocation, estate planning, or a multi-unit operator strategically streamlining their portfolio to focus on higher-performing locations. These are clean situations where the business is typically healthy and the sale is driven by personal circumstances unrelated to the unit's performance.

The red flags in seller motivation are specific. If the seller is exiting because of declining financial performance, the declining trend will continue for you unless you can identify and fix the root cause. If the seller has a lease renewal coming up with materially worse terms, you are buying into a higher-cost structure than the historical P&L reflects. If the relationship between the seller and the franchisor has broken down, investigate whether there are unresolved disputes, compliance issues, or pending enforcement actions that will transfer with the franchise agreement. Ask the seller directly and candidly why they are selling — and then ask the franchisor's development team the same question independently.

DUE DILIGENCE FOR RESALES: The due diligence process for a resale is more intensive than for a new franchise, because there is more to verify. Request three years of profit and loss statements, federal tax returns, point-of-sale reports, employee records, and the current lease terms. Have an independent CPA review the financials — not just for accuracy, but for trends. A business whose revenue has been declining for two consecutive years may still look profitable in the current year's numbers, but the trajectory is more important than the snapshot.

Cross-reference the unit's actual performance against the Item 19 disclosure in the current FDD. Is this unit above or below the system median? What explains the gap, if any? If the unit is below median, understand whether the underperformance reflects a fixable issue — a previous owner who was disengaged, a temporary local disruption, a staffing problem — or a structural issue like a location that has been bypassed by traffic pattern changes or an unfavorable lease structure that compresses margins system-wide.

FRANCHISOR APPROVAL PROCESS: Every franchise resale requires franchisor approval of the incoming buyer. You must meet the same financial and background qualification criteria as a new franchisee. The approval process typically takes four to eight weeks and involves background and credit checks, an interview with the franchisor's franchise development team, and review of your financial qualifications. Budget time for this process in your acquisition timeline and do not sign a binding purchase agreement with an unrealistically short contingency period for franchisor approval.

One important nuance: when you purchase a resale, you typically sign the franchisor's current standard franchise agreement, not the prior franchisee's agreement. This matters because the current agreement may differ materially from the one the seller has been operating under — potentially with different royalty rates, different territory definitions, or different operational requirements. Review the current franchise agreement with a franchise attorney, not just the seller's agreement.

TRANSFER FEES AND TRAINING: Plan for a transfer fee in addition to the purchase price. Franchise transfer fees typically range from $5,000 to $25,000 depending on the brand and are paid to the franchisor, not the seller. Required training for resale buyers is typically shorter than for new franchisees — often a few days to a few weeks rather than the full initial training program — but it is mandatory and you should budget time for it in your transition plan.

FINANCING A RESALE: SBA 7(a) loans are the most common financing vehicle for franchise resales, and resales have an important structural advantage in the SBA lending process. Lenders underwriting a new franchise investment are working from projections and FDD data to estimate future performance. Lenders underwriting a resale can evaluate three years of actual unit-level cash flow to assess debt service coverage. This real historical data typically results in more favorable underwriting and faster loan processing than new franchise development financing.

Seller financing — the seller holding a promissory note for a portion of the purchase price — is more common in resales than in new franchise development and represents a useful tool for bridging valuation gaps. A seller who is willing to hold a note for 20% to 30% of the purchase price is implicitly signaling confidence in the business's ability to generate the cash flow needed to service that debt. It also aligns the seller's interest with your success during the transition period, which can be a meaningful benefit during the months when you are learning the operations.

WHERE TO FIND RESALES: The most effective first step is to contact the franchisor's franchise development team directly and ask whether any franchisees in markets you are considering are looking to exit. Franchisors often know before resales are publicly listed that a franchisee is considering an exit, and they can facilitate introductions that save both parties time. Franchise brokers who specialize in resales (as distinct from brokers who focus on new franchise placements) maintain active listings of franchise units for sale and can be useful intermediaries. BizBuySell and similar business-for-sale marketplaces list franchise resales across all categories and provide a starting point for market research on pricing and availability. The most attractive resale opportunities, however, are often never publicly listed — they are found through direct relationships with the franchisor and the existing franchisee community.`,
  },
];
