# Franchisel.com — Project Status & Direction (April 1, 2026)

## What Is This Project
An independent franchise due diligence platform at franchisel.com (Next.js 16 + Tailwind, deployed on Vercel). Currently has 400 unique franchise brands with data extracted from government-filed FDDs (Minnesota CARDS, Wisconsin DFI).

## Current Technical State
- **Live at**: https://franchisel.com (DNS working, SSL working)
- **Also at**: https://franchiese.vercel.app
- **Brands**: 400 unique in src/data/brands.ts
- **Build**: Clean, 447 static pages
- **Repo**: github.com/shalinder88/franchisel.git, branch: main

## Current Issues

### 1. Admin auth broken on brand pages
- Middleware at src/middleware.ts handles Basic Auth for /admin routes and sets a cookie
- Brand pages are STATICALLY GENERATED (SSG) — server-side cookie check runs at BUILD TIME, not request time
- Fix needed: Convert paywall bypass to CLIENT-SIDE approach (check cookie in a client component wrapper, not in the server component)
- Env vars ADMIN_USER/ADMIN_PASS are set on Vercel

### 2. Data quality is poor
- 194 brands claim hasItem19: true but only 17 actually have revenue data
- 126 brands have zero/placeholder unit growth numbers
- 377 extracted fact files sitting in fdd-vault/ that were NEVER written back into brands.ts
- Most brand pages show almost nothing useful — a visitor would not pay for this

### 3. DataDisclaimer text is wrong
- Says "actual FDD has not been directly reviewed" — but for state_filing brands, the FDD WAS directly reviewed
- File: src/components/DataDisclaimer.tsx and src/app/brands/[slug]/page.tsx
- Fix: Conditional text based on dataSource field

### 4. No educational content
- Pages show data without explaining what it means
- No "What is Item 19?" or "How to read an FDD" content
- A first-time franchise buyer gets no value from the current pages

## Competitive Landscape

### FRANdata (frandata.com)
- Dominant player, 30+ years, $220/FDD report
- Operates SBA Franchise Registry under government contract (unfair advantage)
- Serves LENDERS (banks), not buyers. 9,000+ lender relationships
- 60,000+ FDDs, 7,500+ brands. FUND Score (0-950) used in 60% of SBA franchise loans
- Not a direct competitor — different audience (B2B institutional)

### Vetted Biz (vettedbiz.com) — PRIMARY COMPETITOR
- Best buyer-facing tool. $80/month or $768/year
- Shows SBA default rates, estimated earnings, payback periods, 200K+ franchisee contacts
- CONFLICT: Founders are active franchise brokers earning $20-50K commissions per deal
- Cannot publish negative franchise reviews — would kill their broker pipeline
- Polished product, years of development — DO NOT try to out-feature them

### Franchise Business Review (franchisebusinessreview.com)
- DOCUMENTED pay-to-play: Promoted MODE as "Top Franchise 2017" after CEO knew 50%+ units closed
- Sells consulting to fix bad survey scores, then scores improve
- Threatened legal action against critics. BBB won't rate them.
- Only covers ~1,300 brands that voluntarily participate

### FranchiseHelp (franchisehelp.com)
- Pure lead gen. Sells buyer inquiries to franchisors. 200K cold emails/day.
- Ripoff Reports, Yelp complaints about fake leads
- Buyers are the product, not the customer

### Franchise Grade (franchisegrade.com)
- Letter grades for 3,000+ systems, hidden pricing
- Zero community presence — no Reddit mentions, no reviews
- Essentially invisible to buyers

## Strategic Direction — The Path Forward

### Core Positioning
**"The only franchise research platform paid by buyers, not franchisors."**

Don't compete with Vetted Biz on data aggregation. Compete on TRUST. Think Consumer Reports, not Bloomberg Terminal.

### What To Build (3 pillars)

**Pillar 1: FDD Decoder / Educational Tools (zero lawsuit risk)**
- Teach buyers HOW to read their own FDD
- Generic calculators: plug in YOUR brand's numbers, see estimated take-home
- "What Item 19 means" / "What Item 20 closure rates mean" / "Red flags in Item 3"
- Never name a brand negatively — let the buyer apply the tools to their situation

**Pillar 2: FDD Data Comparison Tool (facts only, public documents)**
- Side-by-side FDD data across brands — no opinions, no ratings, just numbers
- All sourced from public government filings with citations
- "Brand A: 12% total fees. Brand B: 8% total fees." — let user sort/filter
- Facts from public regulatory filings are NOT defamation

**Pillar 3: Franchisee Review Platform (Section 230 protection)**
- Like Glassdoor for franchise ownership
- Franchisees post their own experiences — actual earnings, hours, regrets
- Section 230 protects the platform (you host, you don't author)
- This is what Vetted Biz can NEVER build (negative reviews kill broker revenue)
- This is the long-term moat

### Revenue Model
- Buyer subscriptions ($15-30/month for full access)
- Franchise attorney referral fees (attorneys need clients, you have the audience)
- Deep-dive research reports per brand
- NEVER take franchisor money — this IS the brand

## Possible Complications & How to Overcome

### 1. Cease & desist from franchisors
- **Risk**: Publishing negative brand data invites legal threats
- **Solution**: Never write opinions. Only show FDD numbers from public filings. Let franchisees write their own reviews (Section 230). Facts from government documents are protected speech.

### 2. Slow data pipeline
- **Risk**: Extracting FDDs manually from state portals is labor-intensive
- **Solution**: Already have AI extraction pipeline (PyMuPDF + Python scripts). Focus on 50 deep brands, not 3,000. Quality over quantity.

### 3. Getting franchisee reviews
- **Risk**: Current franchisees fear retaliation. Former franchisees are NDA'd.
- **Solution**: Start with FTC complaint data (public), court records (public), Reddit/forum posts. Build trust over time. Former franchisees who've already spoken publicly are safe to approach.

### 4. Can't match Vetted Biz's data platform
- **Risk**: They have years of dev and a massive database
- **Solution**: Don't try. Build the TRUST brand instead. Be the Consumer Reports to their Amazon. Different value proposition entirely.

### 5. Copyright / data sourcing
- **Risk**: Cannot scrape or redistribute competitor data (FranChimp, Vetted Biz, etc.)
- **Solution**: Only use government portals (CA, IN, MN, WI — all free, public record), FDDs requested directly from franchisors (legally required under FTC rule), SBA public data, and original research.

## Legal Data Sources (What We CAN Use)

| Source | Cost | Legal Basis |
|---|---|---|
| California DFPI portal | Free | Public regulatory filing |
| Indiana Secretary of State | Free | Public regulatory filing |
| Minnesota Commerce (CARDS) | Free | Public regulatory filing |
| Wisconsin DFI | Free | Public regulatory filing |
| SBA Franchise Directory | Free | Public government data |
| FDDs direct from franchisors | Free | FTC Franchise Rule requires it |
| Court records (PACER, state) | Free/cheap | Public record |
| FTC complaint filings | Free | Public record |
| Your own franchisee surveys | Your time | Original research |

## What We CANNOT Use
- FranChimp, Vetted Biz, FRANdata, FDD Exchange structured data (copyright)
- Any scraped competitor database
- Any paid data service repackaged as our own

## Existing Data Assets
- 377 extracted FDD fact files in fdd-vault/ (273 MN CARDS + 104 WI DFI)
- 364 downloaded FDD PDFs
- 141 new MN CARDS 2026 filing targets identified
- 16 new WI DFI filing targets identified
- Indiana and California portals NOT YET tapped

## Scheduled Tasks
- 2:00 PM EDT today — Auto-start FDD extraction from IN/CA, fix admin/paywall, enrich brands
- 7:00 PM EDT today — Continue if 2PM session hits context limits

## Key Files
- src/data/brands.ts — Main data file (400 brands)
- src/app/brands/[slug]/page.tsx — Brand detail pages with paywall logic
- src/middleware.ts — Admin auth (Basic Auth + cookie)
- src/components/DataDisclaimer.tsx — Data source disclaimer
- src/lib/types.ts — TypeScript interfaces (FranchiseBrand, RedFlag, etc.)
- fdd-vault/mn-cards/add_brands_to_ts.py — Script to insert brands into brands.ts
- fdd-vault/mn-cards/registry/extracted-facts/ — 273 MN CARDS fact files
- fdd-vault/wi-dfi/registry/extracted-facts/ — 104 WI DFI fact files

## Goal: Maximum Monetization
The franchise research market charges $80-220 per report/subscription. Our edge is trust — zero franchisor money. Revenue targets:
- Phase 1: Free educational content drives SEO traffic
- Phase 2: $19/month buyer subscription for FDD comparison tools + franchisee reviews
- Phase 3: $99 deep-dive brand reports (50 brands, each thoroughly researched)
- Phase 4: Franchise attorney referral network (attorneys pay for qualified leads)
