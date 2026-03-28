import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { brands, getBrandBySlug } from "@/data/brands";
import {
  getOverallScore,
  formatCurrency,
  formatInvestmentRange,
  categoryLabels,
  type RedFlag,
} from "@/lib/types";
import { BrandDataDisclaimer, DataSourceBadge } from "@/components/DataDisclaimer";

/* ── Static generation ── */
export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand Not Found" };

  const overall = getOverallScore(brand.scores);
  return {
    title: `${brand.name} Franchise Review — Score ${overall}/10 | FDD Analysis | Franchisel`,
    description: `Independent ${brand.fddYear} FDD analysis of ${brand.name}. Overall score: ${overall}/10. Investment: ${formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}. ${brand.redFlags.length} red flag${brand.redFlags.length !== 1 ? "s" : ""} identified. Buyer-aligned, never franchisor-funded.`,
    openGraph: {
      title: `${brand.name} Franchise Review — ${overall}/10`,
      description: `${brand.tagline}. Investment: ${formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}. ${brand.redFlags.length} red flag${brand.redFlags.length !== 1 ? "s" : ""} identified.`,
    },
    alternates: {
      canonical: `https://franchisel.com/brands/${slug}`,
    },
  };
}

/* ── Helpers ── */
function scoreColor(score: number): string {
  if (score >= 8) return "bg-success";
  if (score >= 6) return "bg-accent";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function scoreTextColor(score: number): string {
  if (score >= 8) return "text-success";
  if (score >= 6) return "text-accent";
  if (score >= 4) return "text-warning";
  return "text-danger";
}

function severityStyles(severity: RedFlag["severity"]): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (severity) {
    case "critical":
      return { bg: "bg-danger-light", text: "text-danger", border: "border-danger/20", label: "Critical" };
    case "warning":
      return { bg: "bg-warning-light", text: "text-warning", border: "border-warning/20", label: "Warning" };
    case "info":
      return { bg: "bg-cyan-light", text: "text-cyan", border: "border-cyan/20", label: "Info" };
  }
}

function litigationTypeLabel(type: string): string {
  const map: Record<string, string> = {
    franchisee_vs_franchisor: "Franchisee vs. Franchisor",
    regulatory: "Regulatory",
    employment: "Employment",
    trademark: "Trademark",
    other: "Other",
  };
  return map[type] || type;
}

function trendBadge(trend: "increasing" | "stable" | "decreasing") {
  const styles = {
    increasing: "bg-danger-light text-danger",
    stable: "bg-surface text-muted",
    decreasing: "bg-success-light text-success",
  };
  const labels = { increasing: "Increasing", stable: "Stable", decreasing: "Decreasing" };
  const arrows = { increasing: "\u2191", stable: "\u2192", decreasing: "\u2193" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[trend]}`}>
      {arrows[trend]} {labels[trend]}
    </span>
  );
}

/* ── Page ── */
export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const overall = getOverallScore(brand.scores);

  const scoreBreakdown: { label: string; key: keyof typeof brand.scores; weight: string }[] = [
    { label: "Investment Value", key: "investmentValue", weight: "25%" },
    { label: "Franchisee Support", key: "franchiseeSupport", weight: "20%" },
    { label: "Financial Transparency", key: "financialTransparency", weight: "20%" },
    { label: "Unit Growth", key: "unitGrowth", weight: "15%" },
    { label: "Brand Strength", key: "brandStrength", weight: "10%" },
    { label: "Territory Protection", key: "territoryProtection", weight: "10%" },
  ];

  /* ── JSON-LD Structured Data ── */

  /* Organization (franchisor) node */
  const organizationNode: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `https://franchisel.com/brands/${brand.slug}#organization`,
    "name": brand.name,
    "description": brand.description,
    "foundingDate": String(brand.yearFounded),
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "description": `${brand.totalUnits.toLocaleString()} franchise units`,
    },
  };

  /* Conditionally add AggregateRating when community reviews exist */
  if (brand.communityReviews > 0 && brand.communityAvgSatisfaction) {
    organizationNode["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": String(brand.communityAvgSatisfaction),
      "bestRating": "10",
      "worstRating": "1",
      "reviewCount": String(brand.communityReviews),
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      /* Organization / franchisor */
      organizationNode,

      /* Review by Franchisel */
      {
        "@type": "Review",
        "name": `${brand.name} Franchise Review`,
        "reviewBody": brand.description,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(overall),
          "bestRating": "10",
          "worstRating": "0",
        },
        "author": { "@type": "Organization", "name": "Franchisel", "url": "https://franchisel.com" },
        "datePublished": brand.dataVerified,
        "url": `https://franchisel.com/brands/${brand.slug}`,
        "itemReviewed": { "@id": `https://franchisel.com/brands/${brand.slug}#organization` },
      },

      /* BreadcrumbList */
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://franchisel.com" },
          { "@type": "ListItem", "position": 2, "name": "Brands", "item": "https://franchisel.com/brands" },
          { "@type": "ListItem", "position": 3, "name": brand.name, "item": `https://franchisel.com/brands/${brand.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Data Provenance Banner ── */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <BrandDataDisclaimer
          brandName={brand.name}
          dataSource={brand.dataSource}
          fddYear={brand.fddYear}
          fddAccessed={brand.fddAccessed}
          sourceNotes={brand.sourceNotes}
        />
      </div>

      {/* ── Breadcrumb ── */}
      <nav className="max-w-6xl mx-auto px-6 pt-4 pb-2">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/brands" className="hover:text-accent transition-colors">
              Brands
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{brand.name}</li>
        </ol>
      </nav>

      {/* ── Brand Header ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: name + meta */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface text-muted border border-border">
                  {categoryLabels[brand.category]}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-light text-accent border border-accent/20">
                  {brand.fddYear} FDD
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                  brand.dataSource === "industry_estimate"
                    ? "bg-warning-light text-warning border-warning/20"
                    : "bg-success-light text-success border-success/20"
                }`}>
                  {brand.dataSource === "industry_estimate" ? "Estimated" : "Sourced"} {brand.dataVerified}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
                {brand.name}
              </h1>
              <p className="mt-2 text-lg text-muted max-w-2xl">{brand.tagline}</p>
              <p className="mt-4 text-sm text-muted leading-relaxed max-w-2xl">
                {brand.description}
              </p>
            </div>

            {/* Right: overall score */}
            <div className="flex flex-col items-center justify-center bg-background border border-border rounded-2xl p-6 min-w-[160px] shadow-sm">
              <span className="text-xs text-muted uppercase tracking-wider mb-1">Overall Score</span>
              <span className={`text-5xl font-bold ${scoreTextColor(overall)}`}>
                {overall}
              </span>
              <span className="text-sm text-muted mt-1">out of 10</span>
              <div className="w-full mt-3 h-2 rounded-full bg-surface">
                <div
                  className={`h-2 rounded-full animate-fill ${scoreColor(overall)}`}
                  style={{ width: `${overall * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="lg:grid lg:grid-cols-[1fr_296px] lg:gap-12 lg:items-start">
      {/* ── Main column ── */}
      <div className="space-y-12">
        {/* ── 1. Key Metrics Grid ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Investment */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Total Investment</p>
              <p className="text-lg font-semibold text-foreground">
                {formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}
              </p>
              <p className="text-xs text-muted mt-1">Initial fee: {formatCurrency(brand.initialFranchiseFee)}</p>
            </div>

            {/* Average Revenue */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Avg Revenue (Item 19)</p>
              {brand.hasItem19 && brand.item19?.grossRevenueAvg ? (
                <>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(brand.item19.grossRevenueAvg)}
                  </p>
                  <p className="text-xs text-muted mt-1">{brand.item19.timePeriod}</p>
                </>
              ) : (
                <p className="text-lg font-semibold text-warning">Not Disclosed</p>
              )}
            </div>

            {/* Royalty */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Royalty Rate</p>
              <p className="text-lg font-semibold text-foreground">{brand.royaltyRate}</p>
              <p className="text-xs text-muted mt-1 capitalize">{brand.royaltyStructure} structure</p>
            </div>

            {/* Total Units */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Total Units</p>
              <p className="text-lg font-semibold text-foreground">
                {brand.totalUnits.toLocaleString()}
              </p>
              <p className="text-xs text-muted mt-1">
                {brand.franchisedUnits.toLocaleString()} franchised &middot;{" "}
                {brand.companyOwnedUnits.toLocaleString()} company
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Score Breakdown ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Score Breakdown</h2>
          <div className="rounded-xl border border-border bg-background p-6 space-y-4">
            {scoreBreakdown.map(({ label, key, weight }) => {
              const value = brand.scores[key];
              return (
                <div key={key} className="hover-score-row">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <span className="text-[10px] text-muted">({weight})</span>
                    </div>
                    <span className={`text-sm font-bold ${scoreTextColor(value)}`}>
                      {value}/10
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface">
                    <div
                      className={`h-2 rounded-full animate-fill ${scoreColor(value)}`}
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3. Red Flags ── */}
        {brand.redFlags.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-foreground">Red Flags</h2>
              <span className="text-xs text-muted bg-surface px-2.5 py-0.5 rounded-full border border-border">
                {brand.redFlags.length} identified
              </span>
            </div>
            <div className="space-y-3">
              {brand.redFlags.map((flag, i) => {
                const s = severityStyles(flag.severity);
                return (
                  <div
                    key={i}
                    className={`rounded-xl border ${s.border} ${s.bg} p-5 ${
                      flag.severity === "critical" ? "animate-red-flag" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {flag.severity === "critical" ? (
                          <svg className={`w-5 h-5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                          </svg>
                        ) : flag.severity === "warning" ? (
                          <svg className={`w-5 h-5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                          </svg>
                        ) : (
                          <svg className={`w-5 h-5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${s.text}`}>
                            {s.label}
                          </span>
                          <span className="text-xs text-muted">{flag.category}</span>
                          {flag.fddReference && (
                            <span className="text-xs text-muted font-mono">({flag.fddReference})</span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">{flag.title}</h3>
                        <p className="text-sm text-muted mt-1 leading-relaxed">{flag.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 4. Item 19 Financial Data ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Item 19 — Financial Performance Representation
          </h2>
          {brand.hasItem19 && brand.item19 ? (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {brand.item19.grossRevenueAvg != null && (
                    <tr className="table-row-hover border-b border-border">
                      <td className="px-5 py-3 text-muted font-medium">Average Gross Revenue</td>
                      <td className="px-5 py-3 text-foreground font-semibold text-right">
                        {formatCurrency(brand.item19.grossRevenueAvg)}
                      </td>
                    </tr>
                  )}
                  {brand.item19.grossRevenueMedian != null && (
                    <tr className="table-row-hover border-b border-border">
                      <td className="px-5 py-3 text-muted font-medium">Median Gross Revenue</td>
                      <td className="px-5 py-3 text-foreground font-semibold text-right">
                        {formatCurrency(brand.item19.grossRevenueMedian)}
                      </td>
                    </tr>
                  )}
                  {brand.item19.grossRevenue25th != null && (
                    <tr className="table-row-hover border-b border-border">
                      <td className="px-5 py-3 text-muted font-medium">25th Percentile</td>
                      <td className="px-5 py-3 text-foreground font-semibold text-right">
                        {formatCurrency(brand.item19.grossRevenue25th)}
                      </td>
                    </tr>
                  )}
                  {brand.item19.grossRevenue75th != null && (
                    <tr className="table-row-hover border-b border-border">
                      <td className="px-5 py-3 text-muted font-medium">75th Percentile</td>
                      <td className="px-5 py-3 text-foreground font-semibold text-right">
                        {formatCurrency(brand.item19.grossRevenue75th)}
                      </td>
                    </tr>
                  )}
                  <tr className="table-row-hover border-b border-border">
                    <td className="px-5 py-3 text-muted font-medium">Units Included</td>
                    <td className="px-5 py-3 text-foreground font-semibold text-right">
                      {brand.item19.unitsIncluded.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="table-row-hover border-b border-border">
                    <td className="px-5 py-3 text-muted font-medium">Basis</td>
                    <td className="px-5 py-3 text-foreground text-right capitalize">
                      {brand.item19.basis.replace(/_/g, " ")}
                    </td>
                  </tr>
                  <tr className="table-row-hover">
                    <td className="px-5 py-3 text-muted font-medium">Time Period</td>
                    <td className="px-5 py-3 text-foreground text-right">
                      {brand.item19.timePeriod}
                    </td>
                  </tr>
                </tbody>
              </table>
              {brand.item19.notes && (
                <div className="px-5 py-3 bg-surface text-xs text-muted border-t border-border">
                  Note: {brand.item19.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-warning/20 bg-warning-light p-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-warning mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Item 19 Not Provided</h3>
                  <p className="text-sm text-muted mt-1">
                    This franchisor chose not to include a Financial Performance Representation in their FDD.
                    Without Item 19, prospective franchisees cannot evaluate expected revenue from the disclosure document alone.
                    This is a significant transparency gap.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── 5. Fee Structure ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Fee Structure</h2>
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Initial Franchise Fee</td>
                  <td className="px-5 py-3 text-foreground font-semibold text-right">
                    {formatCurrency(brand.initialFranchiseFee)}
                  </td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Total Investment Range</td>
                  <td className="px-5 py-3 text-foreground font-semibold text-right">
                    {formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}
                  </td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Royalty</td>
                  <td className="px-5 py-3 text-foreground font-semibold text-right">
                    {brand.royaltyRate}
                  </td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Marketing / Ad Fund</td>
                  <td className="px-5 py-3 text-foreground font-semibold text-right">
                    {brand.marketingFundRate}
                  </td>
                </tr>
                {brand.technologyFee != null && (
                  <tr className="table-row-hover border-b border-border">
                    <td className="px-5 py-3 text-muted font-medium">Technology Fee</td>
                    <td className="px-5 py-3 text-foreground font-semibold text-right">
                      {formatCurrency(brand.technologyFee)}/mo
                    </td>
                  </tr>
                )}
                {brand.otherOngoingFees && brand.otherOngoingFees.length > 0 && (
                  <tr className="table-row-hover">
                    <td className="px-5 py-3 text-muted font-medium align-top">Other Ongoing Fees</td>
                    <td className="px-5 py-3 text-foreground text-right">
                      <ul className="space-y-1 text-right">
                        {brand.otherOngoingFees.map((fee, i) => (
                          <li key={i} className="text-xs text-muted leading-relaxed">{fee}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 6. Unit Economics (Item 20) ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Unit Economics — Item 20 (Outlets &amp; Franchisee Information)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Units Opened</p>
              <p className="text-2xl font-bold text-success">
                +{brand.unitEconomics.unitsOpened}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Units Closed</p>
              <p className="text-2xl font-bold text-danger">
                -{brand.unitEconomics.unitsClosed}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Units Transferred</p>
              <p className="text-2xl font-bold text-foreground">
                {brand.unitEconomics.unitsTransferred}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Net Growth</td>
                  <td className="px-5 py-3 text-right font-semibold">
                    <span className={brand.unitEconomics.netGrowth >= 0 ? "text-success" : "text-danger"}>
                      {brand.unitEconomics.netGrowth >= 0 ? "+" : ""}
                      {brand.unitEconomics.netGrowth} units
                    </span>
                  </td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Turnover Rate</td>
                  <td className="px-5 py-3 text-foreground font-semibold text-right">
                    {brand.unitEconomics.turnoverRate}%
                  </td>
                </tr>
                {brand.unitEconomics.threeYearGrowthRate != null && (
                  <tr className="table-row-hover border-b border-border">
                    <td className="px-5 py-3 text-muted font-medium">3-Year Growth Rate</td>
                    <td className="px-5 py-3 text-foreground font-semibold text-right">
                      {brand.unitEconomics.threeYearGrowthRate}%
                    </td>
                  </tr>
                )}
                {brand.unitEconomics.fiveYearGrowthRate != null && (
                  <tr className="table-row-hover">
                    <td className="px-5 py-3 text-muted font-medium">5-Year Growth Rate</td>
                    <td className="px-5 py-3 text-foreground font-semibold text-right">
                      {brand.unitEconomics.fiveYearGrowthRate}%
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 7. Litigation Summary (Item 3) ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Litigation Summary — Item 3
          </h2>
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Active Lawsuits</p>
                <p className={`text-3xl font-bold ${brand.litigation.activeLawsuits > 20 ? "text-danger" : brand.litigation.activeLawsuits > 5 ? "text-warning" : "text-foreground"}`}>
                  {brand.litigation.activeLawsuits}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Trend</p>
                <div className="mt-1">{trendBadge(brand.litigation.trend)}</div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-2">Lawsuit Types</p>
              <div className="flex flex-wrap gap-2">
                {brand.litigation.types.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-surface text-muted border border-border"
                  >
                    {litigationTypeLabel(type)}
                  </span>
                ))}
              </div>
            </div>

            {brand.litigation.notes && (
              <p className="text-sm text-muted mt-4 pt-4 border-t border-border">
                {brand.litigation.notes}
              </p>
            )}
          </div>
        </section>

        {/* ── 8. Community Data ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Community Intelligence</h2>
          <div className="rounded-xl border border-border bg-background p-6">
            {brand.communityReviews > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  {brand.communityAvgSatisfaction != null && (
                    <div className="text-center">
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">Avg Satisfaction</p>
                      <p className={`text-3xl font-bold ${scoreTextColor(brand.communityAvgSatisfaction)}`}>
                        {brand.communityAvgSatisfaction}/10
                      </p>
                    </div>
                  )}
                  {brand.communityAvgFirstYearRevenue != null && (
                    <div className="text-center">
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">Avg First-Year Revenue</p>
                      <p className="text-3xl font-bold text-foreground">
                        {formatCurrency(brand.communityAvgFirstYearRevenue)}
                      </p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Reviews</p>
                    <p className="text-3xl font-bold text-accent">{brand.communityReviews}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 text-center">
                  <p className="text-sm text-muted mb-3">
                    Are you a {brand.name} franchisee? Share your experience anonymously.
                  </p>
                  <a
                    href={`mailto:submit@franchisel.com?subject=${encodeURIComponent(`Franchisee Review: ${brand.name}`)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:brightness-110 transition-all"
                  >
                    Submit Your Review
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted mb-4">
                  No community data yet. If you are a current or former {brand.name} franchisee,
                  your anonymous submission helps future buyers make informed decisions.
                </p>
                <a
                  href={`mailto:submit@franchisel.com?subject=${encodeURIComponent(`Franchisee Review: ${brand.name}`)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:brightness-110 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  Submit Your Experience
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ── 9. Get Full Report CTA ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Get the Full Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Standard */}
            <div className="hover-pricing rounded-xl border border-border bg-background p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-foreground">Standard</h3>
              <p className="text-3xl font-bold text-foreground mt-2">$29</p>
              <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Full score breakdown & analysis
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Red flag deep dive
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  FDD summary (Items 1-23)
                </li>
              </ul>
              <a
                href={`mailto:reports@franchisel.com?subject=${encodeURIComponent(`Standard Report Request: ${brand.name}`)}`}
                className="mt-6 block w-full py-2.5 rounded-full border border-border text-sm font-medium text-center text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Get Standard Report
              </a>
            </div>

            {/* Premium (popular) */}
            <div className="hover-pricing rounded-xl border-2 border-accent bg-background p-6 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="text-lg font-semibold text-foreground">Premium</h3>
              <p className="text-3xl font-bold text-accent mt-2">$79</p>
              <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Everything in Standard
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Item 19 financial modeling
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Competitor comparison
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Community data overlay
                </li>
              </ul>
              <a
                href={`mailto:reports@franchisel.com?subject=${encodeURIComponent(`Premium Report Request: ${brand.name}`)}`}
                className="mt-6 block w-full py-2.5 rounded-full bg-accent text-white text-sm font-medium text-center hover:brightness-110 transition-all"
              >
                Get Premium Report
              </a>
            </div>

            {/* Executive */}
            <div className="hover-pricing rounded-xl border border-border bg-background p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-foreground">Executive</h3>
              <p className="text-3xl font-bold text-foreground mt-2">$199</p>
              <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Everything in Premium
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  10-year pro forma model
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Litigation deep dive
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Territory analysis & map
                </li>
              </ul>
              <a
                href={`mailto:reports@franchisel.com?subject=${encodeURIComponent(`Executive Report Request: ${brand.name}`)}`}
                className="mt-6 block w-full py-2.5 rounded-full border border-border text-sm font-medium text-center text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Get Executive Report
              </a>
            </div>
          </div>
        </section>

        {/* ── 10. Franchise Overview ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Franchise Overview</h2>
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Parent Company</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.parentCompany}</td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Year Founded</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.yearFounded}</td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Franchising Since</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.yearFranchisingBegan}</td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Headquarters</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.headquartersState}</td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Category</td>
                  <td className="px-5 py-3 text-foreground text-right">
                    <Link href={`/category/${brand.category}`} className="text-accent hover:underline">
                      {categoryLabels[brand.category]}
                    </Link>
                    {brand.subcategory && <span className="text-muted ml-1">· {brand.subcategory}</span>}
                  </td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">States of Operation</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.statesOfOperation}</td>
                </tr>
                <tr className="table-row-hover">
                  <td className="px-5 py-3 text-muted font-medium">FDD Year</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.fddYear}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 11. Data Provenance ── */}
        <section className="border-t border-border pt-8">
          <div className="flex items-start gap-3 text-sm text-muted">
            <svg className="w-5 h-5 text-muted mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <div>
              <p>
                {brand.dataSource === "fdd_verified"
                  ? `Data extracted directly from the ${brand.fddYear} Franchise Disclosure Document filed by ${brand.parentCompany}.`
                  : brand.dataSource === "sec_filing"
                  ? `Data sourced from SEC EDGAR filings (10-K/10-Q) for ${brand.parentCompany} and the ${brand.fddYear} FDD.`
                  : brand.dataSource === "public_record"
                  ? `Data sourced from official franchisor website and published ${brand.fddYear} FDD summaries for ${brand.parentCompany}.`
                  : `Data estimated from public sources referencing the ${brand.fddYear} Franchise Disclosure Document filed by ${brand.parentCompany}. Financial figures are editorial estimates pending verification against the actual FDD.`}
                {" "}Last updated <strong>{brand.dataVerified}</strong>.
              </p>
              {brand.sourceNotes && (
                <p className="mt-2 text-xs text-muted/80 italic">{brand.sourceNotes}</p>
              )}
              <p className="mt-2">
                Franchisel is independent and does not accept payments from franchisors. Scores reflect editorial analysis, not franchisor endorsement.
              </p>
            </div>
          </div>
        </section>
      </div>{/* end main column */}

      {/* ── Sticky Sidebar ── */}
      <aside className="hidden lg:block mt-0">
        <div className="sticky top-20 space-y-4">

          {/* Score card */}
          <div className="rounded-2xl border border-border bg-background p-5 text-center shadow-sm">
            <p className="text-[11px] text-muted uppercase tracking-wider mb-1">{brand.fddYear} FDD Score</p>
            <p className={`text-6xl font-bold ${scoreTextColor(overall)}`}>{overall}</p>
            <p className="text-xs text-muted mt-0.5">out of 10</p>
            <div className="w-full mt-3 h-2 rounded-full bg-surface">
              <div className={`h-2 rounded-full ${scoreColor(overall)}`} style={{ width: `${overall * 10}%` }} />
            </div>
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-left">
              {scoreBreakdown.slice(0, 4).map(({ label, key }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-semibold ${scoreTextColor(brand.scores[key])}`}>
                    {brand.scores[key]}
                  </span>
                  <span className="text-[10px] text-muted leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key stats */}
          <div className="rounded-2xl border border-border bg-background p-5 space-y-3">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Quick Stats</p>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Investment</span>
              <span className="font-medium text-foreground">{formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Royalty</span>
              <span className="font-medium text-foreground">{brand.royaltyRate}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Total Units</span>
              <span className="font-medium text-foreground">{brand.totalUnits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">FDD Year</span>
              <span className="font-medium text-foreground">{brand.fddYear}</span>
            </div>
            {brand.redFlags.length > 0 && (
              <div className="flex justify-between text-xs pt-2 border-t border-border">
                <span className="text-muted">Red Flags</span>
                <span className={`font-semibold ${brand.redFlags.some(f => f.severity === "critical") ? "text-danger" : "text-warning"}`}>
                  {brand.redFlags.length} identified
                </span>
              </div>
            )}
          </div>

          {/* Get Report CTA */}
          <div className="rounded-2xl border border-accent/20 bg-accent-light p-5">
            <p className="text-sm font-semibold text-foreground mb-1">Get the Full Report</p>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              Complete FDD analysis, financial modeling, red flag deep dive, and competitor benchmarks.
            </p>
            <a
              href={`mailto:reports@franchisel.com?subject=${encodeURIComponent(`Premium Report Request: ${brand.name}`)}`}
              className="block w-full text-center py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Get Premium Report — $79
            </a>
            <a
              href="/reports"
              className="block w-full text-center py-2 text-xs text-accent hover:underline mt-2"
            >
              See all report tiers →
            </a>
          </div>

          {/* Watchlist CTA */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Track FDD Updates</p>
              <p className="text-[11px] text-muted mt-0.5 leading-relaxed">Get alerted when this brand files a new FDD.</p>
              <Link href="/watchlist" className="text-[11px] text-accent hover:underline mt-1 inline-block">
                Add to Watchlist →
              </Link>
            </div>
          </div>

          {/* Trust badge */}
          <div className="rounded-xl bg-surface border border-border p-3 flex items-center gap-2">
            <svg className={`w-4 h-4 shrink-0 ${brand.dataSource === "industry_estimate" ? "text-warning" : "text-success"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-[11px] text-muted leading-tight">
              {brand.dataSource === "industry_estimate"
                ? <>Estimated from public sources · <span className="font-medium text-foreground">{brand.fddYear} FDD</span> · Pending verification</>
                : brand.dataSource === "public_record"
                ? <>Sourced from official data · <span className="font-medium text-foreground">{brand.fddYear} FDD</span> · Buyer-aligned</>
                : <>Verified from <span className="font-medium text-foreground">{brand.fddYear} FDD</span> · Buyer-aligned · Never franchisor-funded</>
              }
            </p>
          </div>

        </div>
      </aside>

      </div>{/* end grid */}
      </div>{/* end max-w wrapper */}
    </div>
  );
}
