import type { Metadata } from "next";
import Link from "next/link";
import WatchlistEmailForm from "@/components/WatchlistEmailForm";

/* ── Most-watched brands (top 6 by communityReviews) ── */
const popularBrands = [
  { name: "McDonald's", slug: "mcdonalds", category: "Food & Beverage", reviews: 412, investment: "$1.4M – $2.5M" },
  { name: "Great Clips", slug: "great-clips", category: "Hair & Beauty", reviews: 218, investment: "$137K – $259K" },
  { name: "The UPS Store", slug: "the-ups-store", category: "Business Services", reviews: 203, investment: "$138K – $470K" },
  { name: "Planet Fitness", slug: "planet-fitness", category: "Fitness & Wellness", reviews: 147, investment: "$1.1M – $4.9M" },
  { name: "Jersey Mike's Subs", slug: "jersey-mikes", category: "Food & Beverage", reviews: 134, investment: "$194K – $955K" },
  { name: "SERVPRO", slug: "servpro", category: "Home Services", reviews: 112, investment: "$217K – $366K" },
];

export const metadata: Metadata = {
  title: "Franchise Watchlist — Track Brands & Get FDD Alerts | Franchisel",
  description:
    "Save franchise brands to your watchlist and get alerted when FDD data changes, unit counts shift, or litigation increases. Free email alerts for serious franchise buyers.",
};

const watchlistPicks = [
  {
    name: "Jersey Mike's",
    slug: "jersey-mikes",
    category: "Food & Beverage",
    rationale:
      "Fastest-growing sandwich brand in the U.S. with consistently positive net unit growth. Watch for territory saturation signals as expansion accelerates into smaller markets.",
    signal: "Growth",
    signalColor: "text-success",
    signalBg: "bg-success/10",
    investment: "$194K – $955K",
  },
  {
    name: "Wingstop",
    slug: "wingstop",
    category: "Food & Beverage",
    rationale:
      "Strong same-store sales performance with digital ordering mix above 60%. FDD updates are worth watching for any changes to Item 19 financial performance disclosures.",
    signal: "High Interest",
    signalColor: "text-accent",
    signalBg: "bg-accent/10",
    investment: "$334K – $924K",
  },
  {
    name: "Planet Fitness",
    slug: "planet-fitness",
    category: "Fitness & Wellness",
    rationale:
      "Low-price fitness model with proven recession resistance. Watch unit economics closely — rent as a percentage of revenue is the key variable in most markets.",
    signal: "Watch",
    signalColor: "text-warning",
    signalBg: "bg-warning/10",
    investment: "$1.1M – $4.9M",
  },
  {
    name: "Ace Hardware",
    slug: "ace-hardware",
    category: "Home Services",
    rationale:
      "Co-op model provides meaningful independence vs. typical franchise structures. FDD updates often reflect shifts in wholesale pricing and rebate structures — critical to profitability.",
    signal: "Stable",
    signalColor: "text-success",
    signalBg: "bg-success/10",
    investment: "$272K – $2M",
  },
];

const cautionBrands = [
  {
    name: "Kumon",
    slug: "kumon",
    category: "Childcare & Education",
    trend: "Net Unit Decline",
    trendIcon: "↓",
    detail:
      "U.S. system has been shedding locations for several consecutive years. Post-pandemic tutoring demand has shifted toward digital-first competitors. Prospective buyers should study Item 20 unit openings vs. closures carefully.",
    flags: ["Net unit decline", "Enrollment pressures", "Digital disruption"],
  },
  {
    name: "Massage Envy",
    slug: "massage-envy",
    category: "Fitness & Wellness",
    trend: "Declining System Size",
    trendIcon: "↓",
    detail:
      "System count has contracted from its peak. High labor dependency and membership-model churn create structural headwinds. Watch Item 21 financial statements for franchisee profitability trends.",
    flags: ["Unit count shrinkage", "High turnover costs", "Member churn"],
  },
  {
    name: "Subway",
    slug: "subway",
    category: "Food & Beverage",
    trend: "Long-term Contraction",
    trendIcon: "↓",
    detail:
      "Peak system of ~24,000 U.S. units has declined significantly. Remodel requirements have created franchisee financial strain. Recent ownership change may signal course correction — watch FDD disclosures closely.",
    flags: ["Significant unit closures", "Remodel mandates", "Franchisee disputes"],
  },
  {
    name: "Orangetheory Fitness",
    slug: "orangetheory",
    category: "Fitness & Wellness",
    trend: "Slowing Growth",
    trendIcon: "→",
    detail:
      "Growth rate has decelerated meaningfully after rapid 2015–2019 expansion. Boutique fitness faces saturation in core urban markets. Key watch: territory overlap disputes and membership retention rates in mature locations.",
    flags: ["Growth deceleration", "Market saturation", "Retention pressures"],
  },
];

const faqItems = [
  {
    q: "What is the Franchisel Watchlist?",
    a: "The Watchlist is a free tool that lets you save franchise brands you're actively researching. You choose the brands; we monitor FDD filings, unit count data, and litigation updates and notify you when something changes.",
  },
  {
    q: "What triggers an FDD Update Alert?",
    a: "Franchisors are required to update their FDD annually (typically in the spring). We track when new FDD registrations are filed in registration states and alert you when a brand you're watching has published a new disclosure document — often months before the information is widely noticed.",
  },
  {
    q: "What is a price change alert?",
    a: "FDDs disclose franchise fees, royalty rates, and initial investment ranges. Year-over-year fee increases are a significant data point. If a brand on your watchlist increases its franchise fee or royalty rate in its new FDD, you'll receive an alert.",
  },
  {
    q: "What are community review notifications?",
    a: "When a verified franchisee posts a new review on Franchisel for a brand on your watchlist, you'll receive a notification. Franchisee sentiment is one of the most reliable leading indicators of system health.",
  },
  {
    q: "How is this different from just bookmarking a brand page?",
    a: "Bookmarks are static — they capture a moment in time. The Watchlist is active monitoring. You don't need to revisit the site to know when something has changed. Franchises are living systems; the FDD you read in January may look meaningfully different by April.",
  },
  {
    q: "Is the Watchlist free?",
    a: "Basic Watchlist access with email alerts is free. Franchisel Pro subscribers receive priority alerts, year-over-year FDD comparison reports, and access to the full item-by-item change log when a new FDD is filed.",
  },
];

export default function WatchlistPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold uppercase tracking-wider">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              Franchise Watchlist
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Track the brands you&rsquo;re researching.{" "}
            <span className="text-accent">Get alerted when it matters.</span>
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">
            FDD data changes every year. Units open and close every quarter. Litigation
            gets added and settled. The Watchlist keeps you informed on every brand
            you&rsquo;re evaluating — automatically.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#alerts"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Set Up Alerts
            </a>
            <a
              href="#caution"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-sm font-semibold text-foreground rounded-lg hover:bg-surface-alt transition-colors"
            >
              <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Early Warning Brands
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* What the watchlist does */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">What the Watchlist monitors</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Franchise research is a months-long process. The Watchlist ensures that new
            information reaches you the moment it becomes available — so you&rsquo;re never
            making a decision based on stale data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
                title: "FDD Update Alerts",
                desc: "Get notified the moment a brand files a new annual FDD — before most buyers know it exists. Compare year-over-year changes in fees, unit economics, and litigation.",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                title: "Franchisee Review Alerts",
                desc: "Get notified when a verified franchisee posts a new review for a brand you&rsquo;re tracking. Real operator opinions are the most underused signal in franchise research.",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Fee & Investment Alerts",
                desc: "Franchise fees, royalty rates, and required investments change year-over-year. When a brand increases its entry costs on your watchlist, you&rsquo;ll know immediately.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-surface border border-border rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Watchlist Picks */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-foreground">Featured Watchlist Picks</h2>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wider">Editor&rsquo;s Selection</span>
          </div>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Brands our analysts consider worth watching closely right now — for both opportunity
            and risk reasons. Adding these to your watchlist puts all future data changes in your inbox.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {watchlistPicks.map((brand) => (
              <div key={brand.slug} className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="text-base font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      {brand.name}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">{brand.category}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${brand.signalBg} ${brand.signalColor}`}>
                    {brand.signal}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{brand.rationale}</p>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-[11px] text-muted">Est. Investment: <span className="font-medium text-foreground">{brand.investment}</span></span>
                  <Link href={`/brands/${brand.slug}`} className="text-[11px] text-accent font-medium hover:underline">
                    View analysis →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FDD Update Alerts explanation */}
        <section id="alerts" className="bg-surface border border-border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">FDD Update Alerts: Why They Matter</h2>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                Franchisors are legally required to update their Franchise Disclosure Document at least
                annually. These updates can include material changes that dramatically affect the investment
                thesis — and most buyers don&rsquo;t read them carefully.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Fee Increases", desc: "Royalty rate and franchise fee changes quietly embedded in updated Item 6 disclosures." },
              { label: "New Litigation", desc: "Item 3 additions can signal systemic franchisee-franchisor disputes that weren't there last year." },
              { label: "Unit Count Shifts", desc: "Year-over-year Item 20 changes reveal whether the system is growing, stable, or contracting." },
              { label: "Earnings Changes", desc: "Item 19 financial performance representations may be narrowed, expanded, or removed entirely." },
            ].map((item) => (
              <div key={item.label} className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-foreground mb-1.5">{item.label}</p>
                <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Early Warning System */}
        <section id="caution">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Early Warning System</h2>
          </div>
          <p className="text-sm text-muted mb-2 max-w-2xl">
            These brands are showing data patterns that warrant heightened scrutiny. This is not
            a recommendation to avoid them — it is a signal to investigate further before committing.
          </p>
          <p className="text-[11px] text-muted mb-8 max-w-2xl italic">
            Adding a caution brand to your watchlist ensures you receive any new data — positive or negative — the moment it&rsquo;s available.
          </p>
          <div className="space-y-4">
            {cautionBrands.map((brand) => (
              <div key={brand.slug} className="bg-surface border border-warning/30 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        {brand.name}
                      </Link>
                      <span className="text-xs text-muted">&middot; {brand.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-warning font-bold text-sm">{brand.trendIcon}</span>
                      <span className="text-xs font-medium text-warning">{brand.trend}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {brand.flags.map((flag) => (
                      <span key={flag} className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-medium border border-warning/20">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">{brand.detail}</p>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted">Watch this brand for reversal signals or further deterioration</span>
                  <Link href={`/brands/${brand.slug}`} className="text-[11px] text-accent font-medium hover:underline shrink-0">
                    Full analysis →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alert types */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">Five types of alerts — all automated</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Every alert type is driven by actual FDD data and verified community activity.
            No noise. No marketing emails. Only signals that matter to a serious buyer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: "New FDD Filing",
                desc: "Franchisor publishes a new annual FDD. First to know means first to spot changes.",
                color: "text-accent",
                bg: "bg-accent/10",
                icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
              },
              {
                title: "Score Change",
                desc: "A brand&rsquo;s Franchisel score moves up or down based on new data.",
                color: "text-accent",
                bg: "bg-accent/10",
                icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
              },
              {
                title: "Red Flag Added",
                desc: "A new concern identified in the FDD or from franchisee reports.",
                color: "text-destructive",
                bg: "bg-destructive/10",
                icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
              },
              {
                title: "Litigation Update",
                desc: "New lawsuit filed, case settled, or regulatory action disclosed in Item 3.",
                color: "text-warning",
                bg: "bg-warning/10",
                icon: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
              },
              {
                title: "Unit Count Change",
                desc: "Significant opening or closure trend detected in Item 20 data.",
                color: "text-success",
                bg: "bg-success/10",
                icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z",
              },
            ].map((alertType) => (
              <div key={alertType.title} className="bg-surface border border-border rounded-xl p-4">
                <div className={`w-8 h-8 rounded-lg ${alertType.bg} flex items-center justify-center mb-3`}>
                  <svg className={`w-4 h-4 ${alertType.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={alertType.icon} />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-foreground mb-1">{alertType.title}</h3>
                <p className="text-[11px] text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: alertType.desc }} />
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-surface border border-border rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">How the Watchlist Works</h2>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            Set it up once. We handle the monitoring every week.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {[
              {
                step: "1",
                title: "Enter your email",
                desc: "Sign up below and tell us which brands you&rsquo;re researching. No account required — just an email address.",
              },
              {
                step: "2",
                title: "We scan new FDD filings weekly",
                desc: "Our system monitors FDD registrations, litigation databases, and community submissions across all 80+ brands in our directory.",
              },
              {
                step: "3",
                title: "Get alerts when brands change",
                desc: "When a brand you follow files a new FDD, adds litigation, shifts its score, or shows a unit trend, you get an email within 24 hours.",
              },
            ].map((s, i) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  {i < 2 && <div className="w-px flex-1 bg-border mt-2 hidden sm:block" />}
                </div>
                <div className="pb-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: s.desc }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular brands to watch */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-foreground">Most-Watched Brands</h2>
            <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-muted text-[10px] font-medium">By community activity</span>
          </div>
          <p className="text-sm text-muted mb-8 max-w-2xl">
            These are the brands generating the most research activity in our community.
            High interest means more franchisee data, more reviews, and more signal.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface hover-glow group"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                  {brand.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">{brand.name}</p>
                  <p className="text-xs text-muted">{brand.reviews} community reviews · {brand.investment}</p>
                </div>
                <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Email Capture */}
        <section id="get-alerts" className="bg-surface-alt border border-border rounded-2xl p-8 text-center">
          <div className="max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Get Watchlist Alerts</h2>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Enter your email to receive alerts when FDD data changes, franchisee reviews post,
              or concerning trends emerge for the brands you&rsquo;re researching. No spam &mdash; only
              data-driven signals that matter.
            </p>
            <WatchlistEmailForm />
            <p className="mt-3 text-[11px] text-muted">
              Free for basic alerts. Pro subscribers get full year-over-year FDD comparison reports.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-8">Watchlist FAQ</h2>
          <div className="space-y-5">
            {faqItems.map((item) => (
              <div key={item.q} className="border-b border-border pb-5 last:border-0">
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA footer */}
        <section className="border-t border-border pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Ready to start researching?</p>
              <p className="text-sm text-muted">Browse the franchise directory and add brands to your watchlist as you research.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/brands"
                className="px-4 py-2 bg-surface border border-border text-sm font-medium text-foreground rounded-lg hover:bg-surface-alt transition-colors"
              >
                Browse Brands
              </Link>
              <Link
                href="/compare"
                className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
              >
                Compare Brands
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
