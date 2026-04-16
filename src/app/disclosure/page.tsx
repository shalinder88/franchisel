import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertiser Disclosure",
  description:
    "Franchisel advertiser disclosure. How we earn revenue, what referral relationships exist, and the firm separation between commercial arrangements and our editorial analysis.",
};

export default function DisclosurePage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface-alt">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium">Advertiser Disclosure</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Advertiser Disclosure</h1>
          <p className="mt-2 text-sm text-muted">Last updated: March 2026</p>
        </header>

        {/* Summary box */}
        <div className="border border-accent/20 rounded-xl p-5 bg-accent-light">
          <h2 className="text-sm font-semibold text-foreground mb-2">Summary</h2>
          <p className="text-sm text-muted leading-relaxed">
            Franchisel earns revenue from buyer-paid reports and platform subscriptions.
            We do not earn referral fees, commissions, or any compensation from franchisors —
            for any purpose. We serve buyers, not franchisors. Our scoring methodology is applied
            identically to all brands regardless of any commercial relationship.
          </p>
        </div>

        {/* Data source disclosure */}
        <div className="border border-warning/20 rounded-xl p-5 bg-warning-light">
          <h2 className="text-sm font-semibold text-foreground mb-2">Data Source Disclosure</h2>
          <ul className="space-y-2 text-sm text-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 mt-1.5" />
              <span>Financial data on this platform is sourced from a combination of <strong className="text-foreground">official franchisor websites, published FDD summaries, SEC EDGAR filings, and industry databases</strong>. Brands with data confirmed from official sources are labeled &ldquo;Sourced&rdquo; in green. Brands with data estimated from secondary sources are labeled &ldquo;Estimated&rdquo; in amber. We are actively expanding our coverage of directly verified FDD data. Each brand page includes a provenance note explaining the specific source of that brand&apos;s data.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 mt-1.5" />
              <span>Scores and rankings are <strong className="text-foreground">editorial analysis</strong> produced by Franchisel. They are not endorsed, verified, or approved by any franchisor.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 mt-1.5" />
              <span>As of March 2026, Franchisel has <strong className="text-foreground">no financial relationships with any franchisor</strong>. No franchisor pays us for placement, advertising, favorable coverage, or any other purpose.</span>
            </li>
          </ul>
        </div>

        {/* How we make money */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How We Earn Revenue</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>Franchisel generates revenue through the following channels:</p>
            <div className="space-y-3 mt-2">
              {[
                {
                  title: "Buyer-Paid Due Diligence Reports",
                  desc: "Prospective franchise buyers can purchase Standard, Premium, and Executive tier reports that provide deeper analysis than what is available on free brand profiles. Report purchases are the primary revenue source for Franchisel and align our financial incentives with delivering value to buyers.",
                },
                {
                  title: "No Franchisor Referral Fees",
                  desc: "Franchisel does not earn referral fees, commissions, placement fees, or any other compensation from franchisors — for any reason, at any time. No franchisor pays for inclusion, favorable placement, or user referrals. This is a permanent policy, not a temporary status.",
                },
                {
                  title: "Premium Platform Features",
                  desc: "We offer premium subscription features including advanced comparison tools, watchlist alerts, and expanded data access. Premium subscriptions are paid by users, not franchisors.",
                },
              ].map((item) => (
                <div key={item.title} className="border border-border rounded-lg p-5 bg-background">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What commercial relationships never influence */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            What Commercial Relationships Never Influence
          </h2>
          <div className="border border-border rounded-xl p-6 bg-surface-alt">
            <p className="text-sm text-muted leading-relaxed mb-4">
              No commercial relationship — including report partner affiliates — influences the following:
            </p>
            <ul className="space-y-2.5">
              {[
                "Franchisel Scores and dimension ratings",
                "Red flag identification, severity classification, or display",
                "Report content, analysis, or written commentary",
                "Rankings and ordering in search results or category pages",
                "Inclusion or exclusion of any brand from our coverage",
                "The editorial team's access to or awareness of referral arrangements",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted leading-relaxed">
                Our editorial analysts are not informed of, and are not compensated based on,
                referral relationships for any franchise brand they analyze. The analytical and
                commercial functions of Franchisel are structurally separated.
              </p>
            </div>
          </div>
        </section>

        {/* What we don't do */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">What We Don&rsquo;t Do</h2>
          <div className="space-y-2">
            {[
              "Accept fees from franchisors for higher scores, better rankings, or favorable reviews",
              "Accept fees for the removal of red flags from any brand profile",
              "Sell leads to franchise brokers or earn broker commissions",
              "Allow franchisors to purchase &ldquo;featured brand&rdquo; editorial placements",
              "Accept advertising that influences editorial coverage",
              "Earn commissions from franchise sales in the traditional broker sense",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                <svg className="w-4 h-4 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span
                  className="text-sm text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* FTC compliance */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">FTC Compliance</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              This disclosure is provided in compliance with the Federal Trade Commission&rsquo;s
              guidelines on endorsements and testimonials (16 CFR Part 255). The FTC requires
              that material connections between publishers and the products or services they
              discuss be clearly disclosed. We have provided this disclosure to ensure you
              understand the commercial relationships that exist alongside our editorial content.
            </p>
          </div>
        </section>

        {/* Questions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Questions</h2>
          <div className="text-sm text-muted leading-relaxed">
            <p>
              If you have questions about any commercial relationship or how it is managed
              relative to our editorial content, contact us at{" "}
              <a href="mailto:hello@franchisel.com" className="text-accent hover:underline">
                hello@franchisel.com
              </a>
              .
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/about/editorial-policy" className="text-sm text-accent hover:underline">
            Editorial Policy &rarr;
          </Link>
          <Link href="/about/source-policy" className="text-sm text-accent hover:underline">
            Source Policy &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
