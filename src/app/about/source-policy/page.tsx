import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Source Policy — Where Franchisel Data Comes From",
  description:
    "Franchisel's source policy. How we use FDD Item citations, state filings, SEC records, and verified community data — and how we label each source on every data point.",
};

const sources = [
  {
    name: "Franchise Disclosure Documents (FDDs)",
    tier: "Primary",
    tierColor: "bg-accent-light text-accent",
    description:
      "The FDD is a legally required pre-sale disclosure document that franchisors must provide to prospective buyers at least 14 days before any agreement is signed. FDDs contain 23 standardized Items covering everything from franchisor background and litigation history to financial performance representations and franchisee contact lists. We obtain FDDs from state regulatory databases, the FTC, and commercial FDD repositories. All data drawn from FDDs cites the specific Item number and FDD year.",
    verification: "Cross-referenced against state regulatory filings and prior-year FDDs. Year, Item number, and page are cited for every data point.",
    link: {
      label: "FTC Guide to FDDs",
      href: "https://www.ftc.gov/tips-advice/business-center/guidance/consumers-guide-buying-franchise",
    },
  },
  {
    name: "State Regulatory Filings",
    tier: "Primary",
    tierColor: "bg-accent-light text-accent",
    description:
      "Fourteen states require franchisors to register their FDD before offering franchises for sale (California, Hawaii, Illinois, Indiana, Maryland, Michigan, Minnesota, New York, North Dakota, Rhode Island, South Dakota, Virginia, Washington, and Wisconsin). These registration filings may contain state-specific amendments, compliance actions, and approval letters that supplement the base FDD. We monitor state databases for registration status, amendments, and enforcement actions.",
    verification: "Filed directly by franchisors with state agencies and publicly available through state regulatory portals.",
  },
  {
    name: "SEC EDGAR Filings",
    tier: "Primary",
    tierColor: "bg-accent-light text-accent",
    description:
      "For publicly traded franchise companies, SEC filings (10-K annual reports, 10-Q quarterly reports, and 8-K current reports) provide audited financial statements, segment-level revenue data, and material event disclosures that often contain more detailed and independently audited financial information than the FDD alone. We use SEC filings to supplement and cross-check FDD financial data for public companies.",
    verification: "Filed under penalty of law with the U.S. Securities and Exchange Commission and available on SEC EDGAR.",
  },
  {
    name: "Federal and State Court Records",
    tier: "Secondary",
    tierColor: "bg-warning-light text-warning",
    description:
      "We research litigation history through PACER (the federal court records system) and state court databases to identify franchisor-franchisee disputes, class actions, regulatory enforcement actions, and settlements. Litigation context is important: a single resolved dispute is evaluated differently from a pattern of repeated franchisee termination suits. Court records allow us to assess whether FDD Item 3 disclosures are complete.",
    verification: "Sourced from PACER, state court public databases, and legal research platforms. Case numbers cited where relevant.",
  },
  {
    name: "Community-Reported Franchisee Data",
    tier: "Community",
    tierColor: "bg-cyan-light text-cyan",
    description:
      "We collect performance data and satisfaction ratings from current and former franchisees through our verified submission process. Submissions are cross-referenced against Item 20 franchisee lists to confirm ownership. Community data includes actual investment figures, first-year revenue, operating cost breakdowns, support quality ratings, and would-do-it-again assessments. Individual submissions are never published — only aggregated metrics enter brand profiles.",
    verification: "Ownership verified against FDD Item 20 franchisee lists. Always labeled as community-reported with verification count displayed. Never presented as FDD data.",
  },
];

export default function SourcePolicyPage() {
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
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium">Source Policy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Source Policy</h1>
          <p className="mt-3 text-base text-muted leading-relaxed">
            Where our data comes from, how we verify it, and how every data point on the
            platform is labeled so you always know what you are looking at.
          </p>
        </header>

        {/* Source hierarchy intro */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Source Hierarchy</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel maintains a strict hierarchy of data sources. Primary sources
              (regulatory filings) carry the highest confidence and are used for all scored
              metrics. Secondary sources (court records, press releases, independent research)
              supplement primary data. Community sources (franchisee-reported data) are
              collected and labeled separately, and are never used as the sole basis for
              a scored dimension.
            </p>
            <p>
              When data from different sources conflicts, we default to the most recent
              primary source and flag the discrepancy for manual review. We never smooth over
              conflicts by averaging or selecting the more favorable figure.
            </p>
          </div>
        </section>

        {/* Sources */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-5">Our Data Sources</h2>
          <div className="space-y-5">
            {sources.map((src) => (
              <div key={src.name} className="border border-border rounded-xl p-6 bg-surface-alt hover-glow">
                <div className="flex items-center gap-2.5 mb-3">
                  <h3 className="text-sm font-bold text-foreground">{src.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${src.tierColor}`}>
                    {src.tier}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">{src.description}</p>
                <div className="flex items-start gap-2 pt-3 border-t border-border">
                  <svg className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-muted leading-relaxed">
                    <span className="font-medium text-foreground">Verification: </span>
                    {src.verification}
                  </p>
                </div>
                {src.link && (
                  <div className="mt-3">
                    <a
                      href={src.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      {src.link.label} &rarr;
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Data labeling standards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Data Labeling Standards</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed mb-5">
            <p>
              Every data point on Franchisel carries a source label so you can trace it
              to its origin. Source labels follow a standard format that identifies the source
              type, year, and specific reference. You will see labels such as:
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "FDD 2025, Item 19", meaning: "Financial Performance Representation from the 2025 FDD" },
              { label: "FDD 2025, Item 20", meaning: "Outlet count and franchisee data from the 2025 FDD" },
              { label: "FDD 2025, Item 7", meaning: "Estimated initial investment range from the 2025 FDD" },
              { label: "FDD 2025, Item 3", meaning: "Litigation disclosures from the 2025 FDD" },
              { label: "SEC 10-K 2024", meaning: "Annual report filed with the SEC for fiscal year 2024" },
              { label: "Community-Reported (n=47)", meaning: "Aggregated from 47 verified franchisee submissions" },
            ].map((item) => (
              <div key={item.label} className="border border-border rounded-lg p-4 bg-background">
                <code className="text-xs font-mono text-accent block mb-1">{item.label}</code>
                <p className="text-[11px] text-muted">{item.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What we don't use */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">What We Don&rsquo;t Use</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              We do not source scored data from franchisor marketing materials, franchise broker
              listings, franchisor-commissioned satisfaction surveys, anonymous online review
              platforms, or press releases. These sources carry inherent bias or lack sufficient
              verifiability to serve as the basis for investment analysis.
            </p>
            <p>
              We also do not use FDD data provided directly by franchisors outside of official
              regulatory filings. If a franchisor shares updated data with us directly, we
              verify it against the filed FDD before incorporating it and note the discrepancy
              if the filed document has not yet been updated.
            </p>
          </div>
        </section>

        {/* FTC resource */}
        <section>
          <div className="border border-border rounded-xl p-5 bg-surface-alt">
            <h3 className="text-sm font-semibold text-foreground mb-2">FTC Resource: Understanding FDDs</h3>
            <p className="text-xs text-muted leading-relaxed mb-3">
              The Federal Trade Commission publishes guidance for prospective franchise buyers
              explaining what an FDD contains and what to look for. We recommend reading it as
              context for understanding the data on our platform.
            </p>
            <a
              href="https://www.ftc.gov/tips-advice/business-center/guidance/consumers-guide-buying-franchise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              FTC Consumer&rsquo;s Guide to Buying a Franchise &rarr;
            </a>
          </div>
        </section>

        {/* Related links */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/about/editorial-policy" className="text-sm text-accent hover:underline">
            &larr; Editorial Policy
          </Link>
          <Link href="/about/methodology" className="text-sm text-accent hover:underline">
            Methodology &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
