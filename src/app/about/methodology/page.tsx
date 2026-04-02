import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Methodology — How Franchisel Scores Franchises",
  description:
    "Franchisel's scoring methodology explained. Five FDD-derived scores on a 0–100 scale, sourced from primary regulatory filings with full source citations.",
};

const scoreDimensions = [
  {
    name: "System Health",
    weight: "FDD Items 20 + 21",
    color: "bg-accent",
    widthClass: "w-[80%]",
    description:
      "Derived from Item 20 unit count data: net franchise growth over the most recent three-year period, termination and non-renewal rate as a percentage of total system, and closure trajectory. Also incorporates Item 21 audited financials where available — franchisor net worth stability and revenue trend. A system with positive net unit growth, low churn, and a financially stable franchisor scores higher here. This is the most directly observable signal of whether the franchise model works in practice.",
  },
  {
    name: "Franchisor Strength",
    weight: "FDD Items 3, 4, 21",
    color: "bg-success",
    widthClass: "w-[70%]",
    description:
      "Derived from Items 3 and 4 (litigation and bankruptcy history) and Item 21 (audited financial statements). Measures the financial health and legal standing of the franchisor. Franchisors with pending or recurring franchisee lawsuits, unresolved regulatory actions, or declining net worth score lower. A strong franchisor should be financially solvent, litigation-light, and growing — not solely dependent on franchise fees for revenue.",
  },
  {
    name: "Contract Burden",
    weight: "FDD Items 17 + 12",
    color: "bg-cyan",
    widthClass: "w-[60%]",
    description:
      "Derived from Items 12 and 17: territorial protection strength, renewal terms, transfer rights, termination conditions, and post-term non-compete scope. Measures how much contractual risk the franchisee bears relative to the franchisor. Weak territory protection, one-sided termination rights, or aggressive non-competes increase burden. This score reflects the legal risk profile of the agreement, not the investment economics.",
  },
  {
    name: "Economics Coverage",
    weight: "FDD Item 19",
    color: "bg-warning",
    widthClass: "w-[50%]",
    description:
      "Directly reflects the presence, completeness, and comparability of Item 19 (Financial Performance Representations). A franchisor that discloses revenue for all units in a current year using a clear metric scores higher than one that omits Item 19 entirely, discloses only a cherry-picked subset, or provides only non-comparable gross sales without context. This score is null — not penalized — if Item 19 is absent, because absence is itself disclosed as a data gap rather than treated as a negative score.",
  },
  {
    name: "Data Confidence",
    weight: "Source freshness + completeness",
    color: "bg-muted",
    widthClass: "w-[40%]",
    description:
      "A cross-cutting quality score that reflects how complete and current the underlying FDD data is. Higher confidence when: data is extracted directly from a state-filed FDD (not estimated), the filing year is current, key Item sections are populated, and comparability flags are minimal. Lower confidence when: data is sourced from secondary filings, key sections are missing, or the FDD year is more than two years old. This score does not penalize brands for what their FDD discloses — only for the completeness of data we have on file.",
  },
  {
    name: "Territory Protection",
    weight: "10%",
    color: "bg-danger",
    widthClass: "w-[10%]",
    description:
      "Reviews the strength and clarity of territory protection language across Items 12 and 13 of the FDD. We evaluate exclusive territory size, encroachment provisions, digital sales carve-outs, and renewal territory rights. We also review Item 3 (litigation history) for encroachment-related disputes, which are a leading indicator of inadequate or loosely drafted territory protection language.",
  },
];

const dataSources = [
  { label: "FDD Items 1–23", desc: "Primary source for all financial and operational data" },
  { label: "State Regulatory Filings", desc: "Registration states: CA, IL, MD, MN, NY, VA, WA, WI, and others" },
  { label: "SEC EDGAR (10-K / 10-Q)", desc: "Audited financials for publicly traded franchisors" },
  { label: "PACER Court Records", desc: "Federal litigation and class action history" },
  { label: "Franchisee Community Data", desc: "Independently verified, labeled separately from FDD data" },
];

export default function MethodologyPage() {
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
            <span className="text-foreground font-medium">Methodology</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Our Methodology</h1>
          <p className="mt-3 text-base text-muted leading-relaxed">
            How we analyze and score franchise opportunities. Every score is derived from
            publicly verifiable data using a transparent, repeatable process — not editorial
            opinion or commercial relationships.
          </p>
        </header>

        {/* Overview */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Scoring Overview</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel uses five independent scores, each on a <strong className="text-foreground">0&ndash;100 scale</strong>, derived entirely from primary FDD data — not editorial judgment or commercial relationships. There is no single &ldquo;Franchisel Score.&rdquo; Instead, every brand page shows the five component scores so buyers can weight what matters most to their decision.
            </p>
            <p>
              The <strong className="text-foreground">Core Diligence</strong> figure shown on brand cards and rankings is the average of System Health, Franchisor Strength, and Contract Burden — the three scores that do not depend on optional disclosures like Item 19. Economics Coverage is shown separately and may be null for brands that did not file an Item 19. Data Confidence is always present and reflects how complete and fresh the underlying source data is.
            </p>
            <p>
              Scores are tied to a specific FDD filing year, which is cited on every brand page. When a newer filing is processed, scores update and the prior year is archived.
            </p>
          </div>
        </section>

        {/* Five scores */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">The Five Production Scores</h2>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Weights reflect each dimension&rsquo;s relative importance to buyer outcomes based on
            our analysis of franchise failure and success research.
          </p>

          {/* Weight summary bar */}
          <div className="mb-8 border border-border rounded-xl p-5 bg-surface-alt">
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">FDD Source — Each Score</p>
            <div className="space-y-2">
              {scoreDimensions.map((dim) => (
                <div key={dim.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-44 shrink-0">{dim.name}</span>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${dim.color} ${dim.widthClass}`} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{dim.weight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {scoreDimensions.map((dim) => (
              <div key={dim.name} className="border border-border rounded-xl p-6 bg-background hover-glow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">{dim.name}</h3>
                  <span className="text-xs font-semibold text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
                    {dim.weight}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{dim.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data sources */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Data Sources</h2>
          <p className="text-sm text-muted leading-relaxed mb-5">
            Our scoring uses only verifiable primary and secondary sources. We do not use
            franchisor marketing materials, broker listings, or unverified online reviews as
            inputs to any scored dimension.
          </p>
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {dataSources.map((src) => (
              <div key={src.label} className="flex items-start gap-4 px-5 py-4 bg-background hover:bg-surface-alt transition-colors">
                <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-foreground">{src.label}</p>
                  <p className="text-xs text-muted mt-0.5">{src.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FDD Verification Process */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">FDD Verification Process</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              When we process a new or updated FDD, our analysts extract data from all 23 Items,
              with particular focus on Items 5 (Fees), 6 (Other Fees), 7 (Estimated Initial
              Investment), 11 (Franchisor&rsquo;s Obligations), 12 (Territory), 19 (Financial
              Performance Representations), 20 (Outlets and Franchisee Information), and 21
              (Financial Statements).
            </p>
            <p>
              Each extracted data point is cross-referenced against at least one independent
              source — typically state filings, SEC disclosures, or prior-year FDD comparisons
              to identify material changes. Data points that cannot be independently corroborated
              are flagged with a lower confidence indicator on the platform.
            </p>
            <p>
              Community-reported data undergoes a separate verification process: submissions are
              matched against Item 20 franchisee lists to confirm ownership, then aggregated at
              the brand level. Individual submissions are never published. Only verified aggregates
              enter brand profiles, and they are always labeled as &ldquo;community-reported&rdquo;
              with the verification count displayed.
            </p>
          </div>
        </section>

        {/* Annual update cycle */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Annual Update Cycle</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              FDDs are required to be updated annually, with most franchisors filing in Q1 or Q2.
              We monitor regulatory databases and update brand profiles within 30 days of a new FDD
              filing. When an update contains material changes — new litigation, significant fee
              increases, notable changes to territory rights or support structure — we highlight
              the changes and recalculate the affected dimension scores.
            </p>
            <p>
              Every brand profile displays the FDD year the data is drawn from and the date of our
              last update, so you always know the age of the information you are reviewing.
            </p>
          </div>
        </section>

        {/* Red Flag Detection */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Red Flag Detection</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              In addition to the composite score, we systematically scan each FDD for patterns
              associated with higher investment risk. Red flags are categorized by severity
              (Critical, Warning, or Informational) and displayed separately from the composite
              score so that a single severe issue is never obscured by a strong overall average.
            </p>
            <p>
              Our detection logic checks for: omission of Item 19, franchisee turnover above
              category average, active class action litigation, regulatory enforcement actions,
              declining net unit count over three years, royalty rates materially above category
              norms, territory encroachment provisions, unreasonable non-compete durations, and
              unusual restrictions on transfer and renewal rights.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <section>
          <div className="border border-warning/30 rounded-xl p-5 bg-warning-light">
            <h3 className="text-sm font-semibold text-foreground mb-2">Methodology Limitations</h3>
            <p className="text-sm text-muted leading-relaxed">
              No scoring system can capture every factor relevant to a franchise investment
              decision. Our scores are a starting point for due diligence, not a substitute for
              it. Local market conditions, individual operator skills, financing terms, real estate
              quality, and personal risk tolerance all matter and are not reflected in our scores.
              We always recommend consulting a qualified franchise attorney and accountant before
              investing.
            </p>
          </div>
        </section>

        {/* Related links */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/about/editorial-policy" className="text-sm text-accent hover:underline">
            Editorial Policy &rarr;
          </Link>
          <Link href="/about/source-policy" className="text-sm text-accent hover:underline">
            Source Policy &rarr;
          </Link>
          <Link href="/about" className="text-sm text-accent hover:underline">
            About Franchisel &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
