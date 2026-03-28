import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Methodology — How Franchisel Scores Franchises",
  description:
    "Franchisel's scoring methodology explained. Six weighted dimensions, FDD-verified data, and a transparent process for evaluating franchise investment quality.",
};

const scoreDimensions = [
  {
    name: "Investment Value",
    weight: "25%",
    color: "bg-accent",
    widthClass: "w-[25%]",
    description:
      "Compares total investment requirement (Item 7 midpoint) against FDD-disclosed revenue benchmarks (Item 19 median revenue where available) and against comparable franchises in the same category. This dimension produces an estimated payback range and cost-per-revenue-dollar metric. Franchises with investment requirements significantly above category peers without commensurate revenue justification score lower here. This is the highest-weighted dimension because investment sizing is the single most consequential variable in franchise due diligence.",
  },
  {
    name: "Franchisee Support",
    weight: "20%",
    color: "bg-success",
    widthClass: "w-[20%]",
    description:
      "Measures franchisee satisfaction and support quality based on independently collected community data, including would-you-do-it-again rates and support quality scores. Also assesses the depth of initial training (Item 11), field support frequency, technology platform quality, and marketing fund transparency. Unlike paid satisfaction surveys, our community data is collected without franchisor involvement and labeled with its verification status.",
  },
  {
    name: "Financial Transparency",
    weight: "20%",
    color: "bg-cyan",
    widthClass: "w-[20%]",
    description:
      "Evaluates the completeness and clarity of Item 19 (Financial Performance Representations), the quality of fee disclosures across Items 5 and 6, and whether the FDD gives prospective buyers a realistic picture of unit economics. Franchises that omit Item 19 entirely, provide only partial representations, or bury key costs in footnotes score significantly lower on this dimension.",
  },
  {
    name: "Unit Growth",
    weight: "15%",
    color: "bg-warning",
    widthClass: "w-[15%]",
    description:
      "Analyzes net unit growth rate over three and five years, franchisee turnover (terminations plus non-renewals as a percentage of the total system), closure rates, and the ratio of company-owned to franchisee-owned units. A healthy franchise system should be growing, retaining franchisees, and not relying on company stores to prop up reported unit counts. Declining systems or those with high churn receive a materially lower score here.",
  },
  {
    name: "Brand Strength",
    weight: "10%",
    color: "bg-accent-dark",
    widthClass: "w-[10%]",
    description:
      "Evaluates consumer brand recognition, national advertising effectiveness, digital presence, marketing fund management, and competitive positioning within the category. Strong brand recognition reduces customer acquisition costs for franchisees and provides a measurable advantage in competitive markets. We review marketing fund audits (Item 11) and compare brand investment levels against demonstrated consumer awareness.",
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
              The Franchisel Score is a composite metric calculated across six weighted
              dimensions. Each dimension is scored on a 1&ndash;10 scale using quantitative inputs
              derived from primary regulatory filings. The composite score is a weighted average
              of the six dimension scores, yielding a single number on a 1&ndash;10 scale that
              summarizes investment quality.
            </p>
            <p>
              Scores are not static. Every franchise profile shows the FDD year the score is based
              on, and scores are updated annually as new FDDs are filed. If a franchise materially
              changes its fee structure, support model, or litigation posture between annual
              updates, we flag the change and expedite a score review.
            </p>
          </div>
        </section>

        {/* Six dimensions */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">The Six Scoring Dimensions</h2>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Weights reflect each dimension&rsquo;s relative importance to buyer outcomes based on
            our analysis of franchise failure and success research.
          </p>

          {/* Weight summary bar */}
          <div className="mb-8 border border-border rounded-xl p-5 bg-surface-alt">
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Score Weight Distribution</p>
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
