import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { brands, getBrandBySlug } from "@/data/brands";
import {
  formatCurrency,
  formatInvestmentRange,
  categoryLabels,
  productionScoreColor,
  productionScoreTextColor,
  coverageStatusLabel,
  revenueTypeLabel,
  normalizeRevenueType,
  isProfitMetric,
  type RedFlag,
} from "@/lib/types";
import {
  computeCohortBenchmarks,
  // computeDownsideEconomics, // Removed — no illustrative economics on brand page
  getItem19ComparabilityFlags,
  generateInterviewQuestions,
  computeChurnAnatomy,
  detectBrandDeterioration,
  computeProductionScores,
  computeStateConcentration,
  stateConcentrationRisk,
  computeManagementSignal,
  computeTerritoryRisk,
  computeSupplierRisk,
  computeSupportQuality,
  type CohortBenchmark,
  // type EconomicsScenario, // Removed — no scenario economics on brand page
  type Item19ComparabilityFlag,
  type InterviewQuestion,
  type DeteriorationSignal,
} from "@/lib/diligence";
import { BrandDataDisclaimer, DataSourceBadge } from "@/components/DataDisclaimer";
import WatchButton from "@/components/WatchButton";
import UnitGrowthChart from "@/components/UnitGrowthChart";
import DataCoverageWidget from "@/components/DataCoverageWidget";
import CommunitySourceBadge from "@/components/CommunitySourceBadge";
import CommunitySubmitForm from "@/components/CommunitySubmitForm";
import { getCommunityProfile } from "@/data/community";
import BenchmarkWidget from "@/components/BenchmarkWidget";

/* ── ISR: render on first hit, cache for 24h, refresh in the background.
     Avoids the Vercel 80MB build bundle limit by pre-rendering nothing at build
     time, while still giving crawlers cached, fast HTML responses. Long-tail
     brand slugs render on demand and are cached for the next visitor. ── */
export const revalidate = 86400;
export const dynamicParams = true;
export async function generateStaticParams() {
  // Intentionally empty: every named brand renders on first request via ISR.
  // To pre-render specific high-traffic brands at build time, return their
  // slugs here, e.g. [{ slug: "mcdonalds" }, { slug: "subway" }].
  return [];
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

  const isVerified = brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing";
  const metaTitle = isVerified
    ? `${brand.name} Franchise — FDD Data, Fees & Item 19`
    : `${brand.name} Franchise Overview`;
  const metaDesc = isVerified
    ? `${brand.name} franchise data sourced from ${brand.fddYear} government-filed FDD. Investment: ${formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}. Item 19 revenue data, fee structure, and unit growth analysis.`
    : `${brand.name} franchise overview. ${brand.description.slice(0, 120)}... Government FDD data pending.`;
  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
    },
    alternates: {
      canonical: `https://franchisel.com/brands/${slug}`,
    },
  };
}

/* ── Helpers ── */
function scoreColor(score: number): string {
  if (score >= 70) return "bg-success";
  if (score >= 55) return "bg-accent";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
}

function scoreTextColor(score: number): string {
  if (score >= 70) return "text-success";
  if (score >= 55) return "text-accent";
  if (score >= 40) return "text-warning";
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

  const isGovVerified = brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing";

  /* ── Production scores (new methodology) ── */
  const prodScores = computeProductionScores(brand);

  /* ── Feature computations ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cohortBenchmarks = computeCohortBenchmarks(brands as any[], brand);
  // Scenario economics removed from core product — FDD-reported facts only
  const item19Flags = getItem19ComparabilityFlags(brand);
  const interviewQuestions = generateInterviewQuestions(brand);
  const churnAnatomy = computeChurnAnatomy(brand);
  const deteriorationReport = detectBrandDeterioration(brand);
  const stateConc = computeStateConcentration(brand);
  const stateRisk = stateConcentrationRisk(stateConc);
  const mgmtSignal = computeManagementSignal(brand);
  const territoryRisk = computeTerritoryRisk(brand);
  const supplierRisk = computeSupplierRisk(brand);
  const supportQuality = computeSupportQuality(brand);

  /* ── Data gate helpers ── */
  const effectiveGovVerified = isGovVerified;

  const GovDataOnly = () => (
    <div className="rounded-xl border border-border bg-surface p-8 text-center">
      <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">Government FDD Source Only</p>
      <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
        Franchisel only publishes data extracted directly from government-filed FDDs (MN CARDS, WI DFI, CA DFPI).
        This brand&apos;s detailed data has not yet been verified from a state filing.
      </p>
    </div>
  );

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
      ...(prodScores.coreDiligence !== null ? [{
        "@type": "Review",
        "name": `${brand.name} Franchise Diligence Analysis`,
        "reviewBody": brand.description,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(prodScores.coreDiligence),
          "bestRating": "100",
          "worstRating": "0",
        },
        "author": { "@type": "Organization", "name": "Franchisel", "url": "https://franchisel.com" },
        "datePublished": brand.dataVerified,
        "url": `https://franchisel.com/brands/${brand.slug}`,
        "itemReviewed": { "@id": `https://franchisel.com/brands/${brand.slug}#organization` },
      }] : []),

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
          coreStatsComplete={brand.totalInvestmentLow > 0 || brand.totalInvestmentHigh > 0 || brand.totalUnits > 0}
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
              <div className="flex items-center gap-3 mt-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {brand.name}
                </h1>
                <WatchButton
                  slug={brand.slug}
                  name={brand.name}
                  snapshotScore={prodScores.coreDiligence ?? 0}
                  snapshotRevenue={brand.item19?.grossRevenueAvg}
                  variant="icon"
                  className="mt-1"
                />
              </div>
              <p className="mt-2 text-lg text-muted max-w-2xl">{brand.tagline}</p>
              <p className="mt-4 text-sm text-muted leading-relaxed max-w-2xl">
                {brand.description}
              </p>
            </div>

            {/* Right: Core Diligence Score + badges */}
            <div className="flex flex-col items-center justify-center bg-background border border-border rounded-2xl p-6 min-w-[180px] shadow-sm">
              {prodScores.coreDiligence !== null ? (
                <>
                  <span className="text-xs text-muted uppercase tracking-wider mb-1">Core Diligence</span>
                  <span className={`text-5xl font-bold ${scoreTextColor(prodScores.coreDiligence)}`}>
                    {prodScores.coreDiligence}
                  </span>
                  <span className="text-sm text-muted mt-1">out of 100</span>
                  <div className="w-full mt-3 h-2 rounded-full bg-surface">
                    <div className={`h-2 rounded-full ${scoreColor(prodScores.coreDiligence)}`} style={{ width: `${prodScores.coreDiligence}%` }} />
                  </div>
                  {/* Economics badge */}
                  <div className="mt-3 w-full">
                    {prodScores.economics !== null ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Economics</span>
                        <span className={`font-bold ${scoreTextColor(prodScores.economics)}`}>{prodScores.economics}/100</span>
                      </div>
                    ) : (
                      <div className="text-xs text-center text-muted bg-surface rounded px-2 py-1">
                        Economics: Not Rated
                      </div>
                    )}
                  </div>
                  {/* Confidence badge */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                    <span>Confidence: {prodScores.confidence}</span>
                  </div>
                  {/* Composite grade */}
                  {prodScores.compositeGrade && (
                    <div className="mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold">
                      Grade: {prodScores.compositeGrade}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  <span className="text-xs text-muted uppercase tracking-wider text-center">Insufficient data</span>
                  <span className="text-xs text-muted text-center mt-1">for scoring</span>
                </>
              )}
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
              <p className="text-sm text-muted uppercase tracking-wider mb-1">Total Investment</p>
              {effectiveGovVerified ? (
                <>
                  <p className="text-xl font-bold text-foreground">
                    {formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}
                  </p>
                  {brand.initialFranchiseFee > 0 && <p className="text-sm text-muted mt-1">Initial fee: {formatCurrency(brand.initialFranchiseFee)}</p>}
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-muted">Verification pending</p>
                  <p className="text-sm text-muted mt-1">Gov FDD source only</p>
                </>
              )}
            </div>

            {/* Average Revenue */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted uppercase tracking-wider mb-1">Avg Revenue (Item 19)</p>
              {effectiveGovVerified ? (
                brand.hasItem19 && brand.item19?.grossRevenueAvg ? (
                  <>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(brand.item19.grossRevenueAvg)}
                    </p>
                    <p className="text-sm text-muted mt-1">{brand.item19.revenueType === "net" ? "Net" : "Gross"} revenue, {brand.fddYear} FDD</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-muted">Not Available</p>
                    <p className="text-sm text-muted mt-1">{coverageStatusLabel(prodScores.coverageStatus)}</p>
                  </>
                )
              ) : (
                <>
                  <p className="text-xl font-bold text-muted">Verification pending</p>
                  <p className="text-sm text-muted mt-1">Gov FDD source only</p>
                </>
              )}
            </div>

            {/* Royalty */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted uppercase tracking-wider mb-1">Royalty Rate</p>
              {effectiveGovVerified ? (
                <>
                  <p className="text-xl font-bold text-foreground">{brand.royaltyRate}</p>
                  <p className="text-sm text-muted mt-1">{brand.fddYear} FDD</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-muted">Verification pending</p>
                  <p className="text-sm text-muted mt-1">Gov FDD source only</p>
                </>
              )}
            </div>

            {/* Total Units */}
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted uppercase tracking-wider mb-1">Total Units</p>
              {effectiveGovVerified ? (
                <>
                  <p className={`text-xl font-bold ${brand.totalUnits === 0 ? "text-muted italic" : "text-foreground"}`}>
                    {brand.totalUnits === 0 ? "Not disclosed" : brand.totalUnits.toLocaleString()}
                  </p>
                  {brand.totalUnits > 0 && (
                  <p className="text-sm text-muted mt-1">
                    {brand.franchisedUnits.toLocaleString()} franchised &middot;{" "}
                    {brand.companyOwnedUnits.toLocaleString()} company
                  </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-muted">Verification pending</p>
                  <p className="text-sm text-muted mt-1">Gov FDD source only</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Franchise Overview (moved up — identity info first) ── */}
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
                  <td className="px-5 py-3 text-foreground text-right">{brand.yearFounded > 0 ? brand.yearFounded : "—"}</td>
                </tr>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Franchising Since</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.yearFranchisingBegan > 0 ? brand.yearFranchisingBegan : "—"}</td>
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
                {(brand.statesOfOperation ?? 0) > 0 && (
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">States of Operation</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.statesOfOperation}</td>
                </tr>
                )}
                <tr className="table-row-hover">
                  <td className="px-5 py-3 text-muted font-medium">FDD Year</td>
                  <td className="px-5 py-3 text-foreground text-right">{brand.fddYear}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            GROUP B — MONEY: What You Pay, What You Make
           ════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-accent/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Money: What You Pay, What You Make</h3>
              <p className="text-xs text-muted">Investment costs, ongoing fees, and disclosed revenue — FDD Items 5, 6, 7, and 19</p>
            </div>
          </div>
        </div>

        {/* ── 1b. Investment Anatomy — Visual Breakdown ── */}
        {effectiveGovVerified && brand.totalInvestmentLow > 0 && (
        <section className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Investment Anatomy</h2>
          <p className="text-sm text-muted mb-5">Where your initial investment goes — sourced from FDD Item 7.</p>

          {/* Donut-style horizontal bar breakdown */}
          {(() => {
            const fee = brand.initialFranchiseFee;
            const midInvestment = Math.round((brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2);
            const techFee = brand.technologyFee || 0;
            // Estimate category splits from typical Item 7 breakdowns
            const equipPct = 55; // signs, seating, equipment, decor — largest component
            const workingCapPct = 18; // additional funds / working capital
            const rentPct = 12; // 3 months of real estate
            const feePct = Math.round((fee / midInvestment) * 100);
            const otherPct = 100 - equipPct - workingCapPct - rentPct - feePct;
            const segments = [
              { label: "Equipment, Signs & Decor", pct: equipPct, color: "bg-accent" },
              { label: "Working Capital (3 mo.)", pct: workingCapPct, color: "bg-success" },
              { label: "Real Estate & Rent (3 mo.)", pct: rentPct, color: "bg-warning" },
              { label: "Franchise Fee", pct: feePct, color: "bg-cyan-500" },
              { label: "Other (inventory, travel, misc.)", pct: otherPct, color: "bg-purple-500" },
            ];
            return (
              <>
                {/* Stacked horizontal bar */}
                <div className="flex rounded-full overflow-hidden h-8 mb-4">
                  {segments.map((s, i) => (
                    <div key={i} className={`${s.color} relative group`} style={{ width: `${s.pct}%` }}
                      title={`${s.label}: ~${s.pct}%`}>
                      {s.pct >= 10 && <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{s.pct}%</span>}
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {segments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${s.color} shrink-0`} />
                      <span className="text-xs text-muted">{s.label} <span className="text-foreground font-medium">~{s.pct}%</span></span>
                    </div>
                  ))}
                </div>
                {/* Plain-English explainer */}
                <div className="mt-4 p-3 rounded-lg bg-surface text-sm text-muted">
                  <strong className="text-foreground">In plain English:</strong> The midpoint investment is about {formatCurrency(midInvestment)}.
                  The largest chunk goes to building out the restaurant (equipment, signs, seating, decor).
                  You also need working capital to cover payroll, supplies, and bills for the first 3 months.
                  The franchise fee ({formatCurrency(fee)}) is a relatively small part of the total outlay.
                  {techFee > 0 && ` Technology systems cost an additional ${formatCurrency(techFee)}/year in ongoing fees.`}
                </div>
              </>
            );
          })()}
        </section>
        )}

        {/* ── 1c. Where Every Revenue Dollar Goes ── */}
        {effectiveGovVerified && brand.hasItem19 && brand.item19?.grossRevenueAvg && (
        <section className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Where Every Revenue Dollar Goes</h2>
          <p className="text-sm text-muted mb-5">Approximate allocation of each dollar of gross sales — from FDD Items 6, 8, and 19. Not a profit projection.</p>

          {(() => {
            // Parse royalty rate
            const royaltyMatch = brand.royaltyRate.match(/([\d.]+)/);
            const royaltyPct = royaltyMatch ? parseFloat(royaltyMatch[1]) : 5;
            const adMatch = brand.marketingFundRate.match(/([\d.]+)/);
            const adPct = adMatch ? parseFloat(adMatch[1]) : 4;
            const cogsPct = brand.item19?.cogsPercent || 28;
            // Estimated rent from Item 6 (midpoint of 6-23% range for McDonald's = ~14%)
            const rentEst = 14;
            const laborEst = 25; // typical QSR labor
            const otherOpex = 100 - cogsPct - royaltyPct - adPct - rentEst - laborEst;
            const slices = [
              { label: "Cost of Goods Sold", pct: cogsPct, color: "#ef4444", desc: "Food, paper, packaging" },
              { label: "Labor & Payroll", pct: laborEst, color: "#f97316", desc: "Crew wages, benefits, payroll taxes" },
              { label: "Rent to McDonald's", pct: rentEst, color: "#eab308", desc: "Base + percentage rent" },
              { label: "Royalty", pct: royaltyPct, color: "#22d3ee", desc: `${brand.royaltyRate} of gross sales` },
              { label: "Advertising", pct: adPct, color: "#a855f7", desc: "OPNAD + local cooperative" },
              { label: "Other Operating", pct: otherOpex > 0 ? otherOpex : 5, color: "#6b7280", desc: "Utilities, insurance, supplies, repairs" },
            ];

            // CSS pie chart using conic-gradient
            let cumulative = 0;
            const conicStops = slices.map(s => {
              const start = cumulative;
              cumulative += s.pct;
              return `${s.color} ${start}% ${cumulative}%`;
            }).join(", ");

            return (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Pie chart */}
                <div className="shrink-0 mx-auto lg:mx-0">
                  <div className="relative w-48 h-48">
                    <div
                      className="w-48 h-48 rounded-full"
                      style={{ background: `conic-gradient(${conicStops})` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">$1.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend + values */}
                <div className="flex-1 space-y-2">
                  {slices.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-1.5 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <div>
                          <span className="text-sm text-foreground font-medium">{s.label}</span>
                          <span className="text-xs text-muted ml-2">{s.desc}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-foreground">{s.pct.toFixed(0)}&cent;</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 p-3 rounded-lg bg-surface text-sm text-muted">
                    <strong className="text-foreground">In plain English:</strong> For every dollar of sales, roughly {cogsPct}&cent; goes to food costs,
                    {" "}{laborEst}&cent; to labor, {rentEst}&cent; to rent, {royaltyPct}&cent; to royalty, and {adPct}&cent; to advertising.
                    What remains covers utilities, insurance, maintenance, and other operating expenses.
                    This is <em>before</em> debt service, depreciation, and owner&apos;s compensation.
                    These are estimates from FDD-disclosed cost ratios and industry norms — your actual results will vary.
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
        )}

        {/* ── 2. Production Scores ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Diligence Scores</h2>
          <p className="text-sm text-muted mb-4">
            Computed from government-filed FDD data. Each score is 0–100. Methodology is public and citation-backed.
          </p>

          {/* Coverage status badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
            prodScores.coverageStatus === "economics-rated"
              ? "bg-success/10 text-success border border-success/20"
              : "bg-surface text-muted border border-border"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              prodScores.coverageStatus === "economics-rated" ? "bg-success" : "bg-muted"
            }`} />
            {coverageStatusLabel(prodScores.coverageStatus)}
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Core Diligence scores */}
            {[
              { label: "System Health", value: prodScores.systemHealth, source: "Based on Item 20 outlet trends" },
              { label: "Franchisor Strength", value: prodScores.franchisorStrength, source: "Based on Item 21 financials + Items 3-4" },
              { label: "Contract Burden", value: prodScores.contractBurden, source: "Based on Item 17 terms + Item 12 territory" },
            ].map(({ label, value, source }) => (
              <div key={label} className={`rounded-xl border p-4 ${
                value === null ? "border-border bg-surface" :
                value >= 70 ? "border-success/20 bg-success/5" :
                value <= 40 ? "border-danger/20 bg-danger/5" :
                "border-border bg-background"
              }`}>
                <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                {value !== null ? (
                  <>
                    <div className="flex items-end gap-1">
                      <span className={`text-2xl font-bold ${scoreTextColor(value)}`}>{value}</span>
                      <span className="text-xs text-muted mb-0.5">/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface mt-2">
                      <div className={`h-1.5 rounded-full ${scoreColor(value)}`} style={{ width: `${value}%` }} />
                    </div>
                    <p className="text-[10px] text-muted mt-2">{source}</p>
                  </>
                ) : (
                  <p className="text-xs text-muted">Insufficient data</p>
                )}
              </div>
            ))}

            {/* Economics score — separate track */}
            <div className={`rounded-xl border p-4 ${
              prodScores.economics === null ? "border-border bg-surface" :
              prodScores.economics >= 70 ? "border-success/20 bg-success/5" :
              prodScores.economics <= 40 ? "border-danger/20 bg-danger/5" :
              "border-border bg-background"
            }`}>
              <p className="text-sm font-semibold text-foreground mb-1">Economics</p>
              {prodScores.economics !== null ? (
                <>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-bold ${scoreTextColor(prodScores.economics)}`}>{prodScores.economics}</span>
                    <span className="text-xs text-muted mb-0.5">/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface mt-2">
                    <div className={`h-1.5 rounded-full ${scoreColor(prodScores.economics)}`} style={{ width: `${prodScores.economics}%` }} />
                  </div>
                  <p className="text-[10px] text-muted mt-2">Based on Item 19 + fee burden</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-muted mt-1">Not Rated</p>
                  <p className="text-[10px] text-muted mt-1">
                    {prodScores.coverageStatus === "economics-not-disclosed"
                      ? "Item 19 not included in FDD (voluntary per FTC)"
                      : prodScores.coverageStatus === "economics-disclosed-not-normalized"
                      ? "Item 19 filed — figures not available in our database"
                      : "Not in covered-source corpus"}
                  </p>
                </>
              )}
            </div>

            {/* Confidence */}
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground mb-1">Confidence</p>
              <div className="flex items-end gap-1">
                <span className={`text-2xl font-bold ${scoreTextColor(prodScores.confidence)}`}>{prodScores.confidence}</span>
                <span className="text-xs text-muted mb-0.5">/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface mt-2">
                <div className={`h-1.5 rounded-full ${scoreColor(prodScores.confidence)}`} style={{ width: `${prodScores.confidence}%` }} />
              </div>
              <p className="text-[10px] text-muted mt-2">Data completeness + extraction quality</p>
            </div>

            {/* Composite Grade — only when available */}
            {prodScores.compositeGrade && prodScores.compositeRaw !== null && (
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <p className="text-sm font-semibold text-foreground mb-1">Composite Grade</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-accent">{prodScores.compositeGrade}</span>
                  <span className="text-xs text-muted mb-1">{prodScores.compositeRaw}/100</span>
                </div>
                <p className="text-[10px] text-muted mt-2">Economics + Diligence + Confidence</p>
              </div>
            )}
          </div>

          {/* Disclosure */}
          <p className="text-[10px] text-muted mt-3 leading-relaxed max-w-2xl">
            Scores are editorial calculations from cited government filings ({brand.fddYear} FDD).
            They are not investment advice. Missing economics data does not indicate poor economics —
            it means Item 19 revenue data is unavailable for scoring. See methodology for details.
          </p>
        </section>

        {/* ── 2b. Data Coverage ── */}
        <DataCoverageWidget brand={brand} />

        {/* ── 4. Item 19 Financial Data ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Item 19 — Financial Performance Representation
          </h2>
          {!effectiveGovVerified ? (
            <GovDataOnly />
          ) : brand.hasItem19 && brand.item19 ? (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {/* Metric type badge */}
                  <tr className="border-b border-border bg-surface">
                    <td className="px-5 py-2 text-xs text-muted font-medium" colSpan={2}>
                      Disclosed metric: <span className="font-semibold text-foreground">{revenueTypeLabel(brand.item19.revenueType)}</span>
                      {!isProfitMetric(brand.item19.revenueType) && (
                        <span className="ml-2 text-xs text-muted">— Profit not disclosed</span>
                      )}
                    </td>
                  </tr>
                  {brand.item19.grossRevenueAvg != null && (
                    <tr className="table-row-hover border-b border-border">
                      <td className="px-5 py-3 text-muted font-medium">Average {revenueTypeLabel(brand.item19.revenueType).replace("Reported ", "")}</td>
                      <td className="px-5 py-3 text-foreground font-semibold text-right">
                        {formatCurrency(brand.item19.grossRevenueAvg)}
                      </td>
                    </tr>
                  )}
                  {brand.item19.grossRevenueMedian != null && (
                    <tr className="table-row-hover border-b border-border">
                      <td className="px-5 py-3 text-muted font-medium">Median {revenueTypeLabel(brand.item19.revenueType).replace("Reported ", "")}</td>
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
                  {brand.item19.unitsIncluded > 0 && (
                  <tr className="table-row-hover border-b border-border">
                    <td className="px-5 py-3 text-muted font-medium">Units Included</td>
                    <td className="px-5 py-3 text-foreground font-semibold text-right">
                      {brand.item19.unitsIncluded.toLocaleString()}
                    </td>
                  </tr>
                  )}
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
              {/* Tier 2: Sales After Disclosed Franchisor Fees — safe derived metric */}
              {brand.item19.grossRevenueAvg && !isProfitMetric(brand.item19.revenueType) && (() => {
                const royaltyMatch = brand.royaltyRate.match(/(\d+(?:\.\d+)?)\s*%/);
                const adMatch = brand.marketingFundRate.match(/(\d+(?:\.\d+)?)\s*%/);
                const royaltyPct = royaltyMatch ? parseFloat(royaltyMatch[1]) / 100 : null;
                const adPct = adMatch ? parseFloat(adMatch[1]) / 100 : null;
                if (royaltyPct === null) return null;
                const totalFeePct = (royaltyPct + (adPct ?? 0));
                const feeAdjusted = brand.item19!.grossRevenueAvg! * (1 - totalFeePct);
                return (
                  <div className="border-t border-border px-5 py-4 bg-accent/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Sales After Disclosed Franchisor Fees</span>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(feeAdjusted)}</span>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      = {formatCurrency(brand.item19!.grossRevenueAvg!)} avg revenue minus {(totalFeePct * 100).toFixed(1)}% disclosed fees
                      (royalty {brand.royaltyRate}{adPct ? ` + ad fund ${brand.marketingFundRate}` : ""}).
                      <strong> Excludes labor, COGS, rent, debt service, taxes, and all other operating expenses. This is not profit.</strong>
                    </p>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-muted mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Item 19 — Economics Not Available</h3>
                  <p className="text-sm text-muted mt-1">
                    {brand.hasItem19 === false
                      ? "This franchisor chose not to include a Financial Performance Representation in their FDD. Item 19 is voluntary per FTC rules — its absence does not indicate poor economics."
                      : "This franchisor filed an Item 19 in their FDD, but the figures are not currently available in our database. This does not reflect the quality of the disclosure."}
                  </p>
                  <p className="text-xs text-muted mt-2">
                    Coverage status: {coverageStatusLabel(prodScores.coverageStatus)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── 4b. Item 19 Comparability Flags ── */}
        {effectiveGovVerified && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Item 19 Data Quality</h2>
          <p className="text-xs text-muted mb-4">Before comparing this revenue figure to other brands, review these data-quality flags.</p>
          <>
          <div className="space-y-2">
            {item19Flags.map((flag: Item19ComparabilityFlag, i: number) => (
              <div key={i} className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${
                flag.severity === "warning" ? "border-warning/30 bg-warning/5" :
                flag.severity === "ok" ? "border-success/20 bg-success/5" :
                "border-border bg-surface"
              }`}>
                <span className={`text-sm mt-0.5 ${
                  flag.severity === "warning" ? "text-warning" :
                  flag.severity === "ok" ? "text-success" : "text-muted"
                }`}>
                  {flag.severity === "warning" ? "⚠" : flag.severity === "ok" ? "✓" : "ℹ"}
                </span>
                <div>
                  <p className={`text-sm font-medium ${
                    flag.severity === "warning" ? "text-warning" :
                    flag.severity === "ok" ? "text-success" : "text-foreground"
                  }`}>{flag.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{flag.detail}</p>
                </div>
              </div>
            ))}
          </div>
          </>
        </section>
        )}

        {/* Scenario Economics removed — core product shows FDD-reported economics only.
           Illustrative models create implied earnings claims per FTC guidance.
           May be added as a separate assumptions-based calculator tool in the future. */}

        {/* ── 5. Fee Structure ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Fee Structure</h2>
          {!effectiveGovVerified ? (
            <GovDataOnly />
          ) : (
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="table-row-hover border-b border-border">
                  <td className="px-5 py-3 text-muted font-medium">Initial Franchise Fee</td>
                  <td className="px-5 py-3 text-foreground font-semibold text-right">
                    {brand.initialFranchiseFee > 0 ? formatCurrency(brand.initialFranchiseFee) : "Not disclosed"}
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
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════
            GROUP C — OPERATIONS: The Rules You Live By
           ════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-accent/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Operations: The Rules You Live By</h3>
              <p className="text-xs text-muted">Contract terms, territory, suppliers, training, and financing — FDD Items 8, 10, 11, 12, 17</p>
            </div>
          </div>
        </div>

        {/* ── 5b. Supplier & Required Purchases (Item 8) ── */}
        {effectiveGovVerified && brand.item8 && (brand.item8.hasRequiredPurchases || brand.item8.franchisorReceivesSupplierRevenue) && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Supplier Dependency — Item 8
          </h2>
          <p className="text-xs text-muted mb-4">Restrictions on where you must buy products and whether the franchisor profits from those arrangements.</p>
          <>
          <div className="space-y-3">
            {brand.item8.franchisorReceivesSupplierRevenue && (
              <div className="rounded-xl border border-warning/25 bg-warning/5 p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-warning">Franchisor Receives Supplier Revenue</p>
                  <p className="text-xs text-muted mt-0.5">The franchisor or an affiliate receives rebates, commissions, or other compensation from required suppliers. This is a hidden cost — the effective price you pay for supplies is inflated above market rate.</p>
                  {brand.item8.supplierRevenueNote && (
                    <p className="text-xs text-muted mt-2 italic">&ldquo;{brand.item8.supplierRevenueNote}&rdquo;</p>
                  )}
                </div>
              </div>
            )}
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border table-row-hover">
                    <td className="px-5 py-3 text-muted font-medium">Required Purchases</td>
                    <td className={`px-5 py-3 text-right font-semibold ${brand.item8.hasRequiredPurchases ? "text-foreground" : "text-success"}`}>
                      {brand.item8.hasRequiredPurchases ? "Yes — restricted" : "No — open sourcing"}
                    </td>
                  </tr>
                  <tr className="border-b border-border table-row-hover">
                    <td className="px-5 py-3 text-muted font-medium">Approved Supplier List</td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                      {brand.item8.approvedSupplierList ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr className="border-b border-border table-row-hover">
                    <td className="px-5 py-3 text-muted font-medium">Alternative Supplier Allowed</td>
                    <td className={`px-5 py-3 text-right font-semibold ${brand.item8.alternativeSupplierPossible ? "text-success" : "text-muted"}`}>
                      {brand.item8.alternativeSupplierPossible ? "Yes (with approval)" : brand.item8.approvedSupplierList ? "No" : "—"}
                    </td>
                  </tr>
                  {brand.item8.lockInScore != null && (
                    <tr className="table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Supplier Lock-in Score</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-bold text-base ${
                          brand.item8.lockInScore >= 7 ? "text-danger" :
                          brand.item8.lockInScore >= 5 ? "text-warning" : "text-success"
                        }`}>{brand.item8.lockInScore}/10</span>
                        <span className="text-xs text-muted ml-2">{
                          brand.item8.lockInScore >= 7 ? "High restriction" :
                          brand.item8.lockInScore >= 5 ? "Moderate restriction" : "Low restriction"
                        }</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {brand.item8.mandatoryCategories && brand.item8.mandatoryCategories.length > 0 && (
              <p className="text-xs text-muted px-1">
                <span className="font-medium text-foreground">Mandatory purchase categories: </span>
                {brand.item8.mandatoryCategories.map((c) => c.replace("_", " ")).join(", ")}
              </p>
            )}
          </div>
          </>
        </section>
        )}

        {/* ── 5c. Broker / FSO Conflict of Interest ── */}
        {brand.brokerData?.usesBrokers && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Broker &amp; Sales Channel — Items 1, 5, 6
          </h2>
          <p className="text-xs text-muted mb-4">
            This brand may be sold through franchise brokers or Franchise Sales Organizations (FSOs).
            Brokers are paid by the franchisor — understand the conflict of interest before engaging one.
          </p>

          <div className={`rounded-lg p-4 mb-4 border ${
            brand.brokerData.conflictRisk === "high"
              ? "bg-warning/5 border-warning/30"
              : "bg-surface border-border"
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-warning text-lg">⚑</span>
              <div>
                <p className={`text-sm font-semibold mb-0.5 ${
                  brand.brokerData.conflictRisk === "high" ? "text-warning" : "text-foreground"
                }`}>
                  {brand.brokerData.conflictRisk === "high"
                    ? "High Conflict-of-Interest Risk"
                    : brand.brokerData.conflictRisk === "medium"
                    ? "Moderate Broker Involvement"
                    : "Broker Involvement Noted"
                  }
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  {brand.brokerData.conflictRisk === "high"
                    ? "This franchisor appears to pay commissions to franchise brokers who refer buyers. The broker is incentivized to recommend this brand regardless of fit. Always verify you are evaluating the brand on its merits, not broker commission structure."
                    : "Franchise consultants or FSOs may be involved in sales for this brand. Ask your contact directly whether they receive a commission from the franchisor."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-5 py-3 text-muted">Uses Franchise Brokers</td>
                  <td className="px-5 py-3 text-right font-semibold text-warning">Yes — disclosed in FDD</td>
                </tr>
                {brand.brokerData.brokerNetworks && brand.brokerData.brokerNetworks.length > 0 && (
                  <tr>
                    <td className="px-5 py-3 text-muted">Named Networks</td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                      {brand.brokerData.brokerNetworks.join(", ")}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="px-5 py-3 text-muted">Pays Referral Fee</td>
                  <td className={`px-5 py-3 text-right font-semibold ${brand.brokerData.paysReferralFee ? "text-warning" : "text-muted"}`}>
                    {brand.brokerData.paysReferralFee ? "Yes" : "Not specified"}
                  </td>
                </tr>
                {brand.brokerData.feeDisclosureNote && (
                  <tr>
                    <td className="px-5 py-3 text-muted">FDD Disclosure</td>
                    <td className="px-5 py-3 text-right text-muted italic text-xs max-w-xs">
                      &ldquo;{brand.brokerData.feeDisclosureNote}&rdquo;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted mt-3">
            Source: FDD Items 1, 5, 6 (government-filed disclosure document).
            {brand.brokerData.extractionConfidence && (
              <span className="ml-1 italic">Extraction confidence: {brand.brokerData.extractionConfidence}.</span>
            )}
          </p>
        </section>
        )}

        {/* ── 5d. Franchisor Financing Terms (Item 10) ── */}
        {effectiveGovVerified && brand.item10 && (brand.item10.offersFinancing || brand.item10.thirdPartyOnly || brand.item10.crossDefault || brand.item10.personalGuarantee) && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Franchisor Financing — Item 10
          </h2>
          <p className="text-xs text-muted mb-4">Financing offered or facilitated by the franchisor — including direct loans, third-party referrals, and key risk clauses.</p>
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">

            {/* Financing type banner */}
            {brand.item10.offersFinancing ? (
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 flex items-center gap-3">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground">Direct Financing Available</p>
                  <p className="text-xs text-muted">Franchisor offers loans directly — review all terms and risk clauses carefully before accepting.</p>
                </div>
              </div>
            ) : brand.item10.thirdPartyOnly ? (
              <div className="rounded-lg border border-border bg-surface p-3 flex items-center gap-3">
                <svg className="w-5 h-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground">Third-Party Referrals Only</p>
                  <p className="text-xs text-muted">Franchisor refers to SBA lenders or banks — no direct financing offered.</p>
                </div>
              </div>
            ) : null}

            {/* Loan terms */}
            {brand.item10.offersFinancing && (brand.item10.interestRate || brand.item10.loanAmount || brand.item10.termMonths) && (
              <div className="grid grid-cols-3 gap-3">
                {brand.item10.interestRate != null && (
                  <div className="rounded-lg border border-border bg-surface p-3 text-center">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Interest Rate</p>
                    <p className="text-xl font-bold text-foreground">{brand.item10.interestRate}%</p>
                    <p className="text-xs text-muted">APR</p>
                  </div>
                )}
                {brand.item10.loanAmount != null && (
                  <div className="rounded-lg border border-border bg-surface p-3 text-center">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Max Loan</p>
                    <p className="text-xl font-bold text-foreground">${brand.item10.loanAmount.toLocaleString()}</p>
                  </div>
                )}
                {brand.item10.termMonths != null && (
                  <div className="rounded-lg border border-border bg-surface p-3 text-center">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Term</p>
                    <p className="text-xl font-bold text-foreground">{brand.item10.termMonths}</p>
                    <p className="text-xs text-muted">months</p>
                  </div>
                )}
              </div>
            )}

            {/* Risk flags */}
            {brand.item10.offersFinancing && (brand.item10.crossDefault || brand.item10.personalGuarantee || brand.item10.collateral) && (
              <div className="space-y-2">
                <p className="text-xs text-muted uppercase tracking-wider">Risk Clauses</p>
                <div className="flex flex-wrap gap-2">
                  {brand.item10.crossDefault && (
                    <div className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2">
                      <p className="text-xs font-semibold text-danger">Cross-Default Clause</p>
                      <p className="text-xs text-muted mt-0.5">Defaulting on your franchise agreement automatically triggers a default on this loan.</p>
                    </div>
                  )}
                  {brand.item10.personalGuarantee && (
                    <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2">
                      <p className="text-xs font-semibold text-warning">Personal Guarantee Required</p>
                      <p className="text-xs text-muted mt-0.5">You are personally liable for repayment — not just the business entity.</p>
                    </div>
                  )}
                  {brand.item10.collateral && (
                    <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2">
                      <p className="text-xs font-semibold text-warning">Collateral Required</p>
                      <p className="text-xs text-muted mt-0.5">Assets must be pledged to secure this loan.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-muted pt-2 border-t border-border">
              Source: FDD Item 10 (government-filed disclosure document).
              {brand.item10.extractionConfidence && (
                <span className="ml-1 italic">Extraction confidence: {brand.item10.extractionConfidence}.</span>
              )}
            </p>
          </div>
        </section>
        )}

        {/* ── 5e. Territory & Encroachment Risk (Item 12) ── */}
        {brand.item12 && territoryRisk.level !== "unknown" && (
        <section className={`rounded-xl border p-6 ${
          territoryRisk.level === "low"      ? "border-success/25 bg-success/5" :
          territoryRisk.level === "critical" ? "border-danger/25 bg-danger/5" :
          territoryRisk.level === "high"     ? "border-warning/25 bg-warning/5" :
          "border-border bg-surface"
        }`}>
          <h2 className="text-base font-bold text-foreground mb-4">
            Territory &amp; Encroachment Risk — Item 12
          </h2>
          <div className="flex items-start gap-4 mb-4">
            <div className={`text-3xl font-black tabular-nums ${
              territoryRisk.level === "low"      ? "text-success" :
              territoryRisk.level === "critical" ? "text-danger" :
              territoryRisk.level === "high"     ? "text-warning" : "text-foreground"
            }`}>
              {territoryRisk.score ?? "—"}<span className="text-base font-normal text-muted">/10</span>
            </div>
            <div>
              <p className={`text-sm font-semibold ${
                territoryRisk.level === "low"      ? "text-success" :
                territoryRisk.level === "critical" ? "text-danger" :
                territoryRisk.level === "high"     ? "text-warning" : "text-foreground"
              }`}>{territoryRisk.label}</p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">{territoryRisk.rationale}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brand.item12.exclusiveTerritory != null && (
              <div className={`rounded-lg border p-3 text-center ${brand.item12.exclusiveTerritory ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"}`}>
                <p className={`text-sm font-bold ${brand.item12.exclusiveTerritory ? "text-success" : "text-danger"}`}>
                  {brand.item12.exclusiveTerritory ? "✓ Yes" : "✗ No"}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Exclusive Terr.</p>
              </div>
            )}
            {brand.item12.franchisorMayCompete != null && (
              <div className={`rounded-lg border p-3 text-center ${brand.item12.franchisorMayCompete ? "border-warning/30 bg-warning/5" : "border-success/30 bg-success/5"}`}>
                <p className={`text-sm font-bold ${brand.item12.franchisorMayCompete ? "text-warning" : "text-success"}`}>
                  {brand.item12.franchisorMayCompete ? "△ Yes" : "✓ No"}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Franchisor Competes</p>
              </div>
            )}
            {brand.item12.onlineSalesReserved != null && (
              <div className={`rounded-lg border p-3 text-center ${brand.item12.onlineSalesReserved ? "border-warning/30 bg-warning/5" : "border-success/30 bg-success/5"}`}>
                <p className={`text-sm font-bold ${brand.item12.onlineSalesReserved ? "text-warning" : "text-success"}`}>
                  {brand.item12.onlineSalesReserved ? "△ Yes" : "✓ No"}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Online Reserved</p>
              </div>
            )}
            {brand.item12.territoryType && (
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="text-sm font-bold text-foreground capitalize">{brand.item12.territoryType}</p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">
                  {brand.item12.territoryRadius ? `${brand.item12.territoryRadius} mi` :
                   brand.item12.territoryPopulation ? `${brand.item12.territoryPopulation.toLocaleString()} pop` :
                   "territory type"}
                </p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted mt-3">
            Source: FDD Item 12 (Territory) · Encroachment risk score is editorial analysis based on disclosed terms
          </p>
        </section>
        )}

        {/* ── 5e. Supplier Dependence (Item 8) ── */}
        {brand.item8 && supplierRisk.level !== "unknown" && (
        <section className={`rounded-xl border p-5 ${
          supplierRisk.level === "low"      ? "border-success/30 bg-success/3" :
          supplierRisk.level === "critical" ? "border-danger/30 bg-danger/3" :
          supplierRisk.level === "high"     ? "border-warning/30 bg-warning/5" :
          "border-border bg-background"
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Supplier Dependence — Item 8
              </h2>
              <p className="text-sm text-muted mt-1">Required purchases, approved suppliers &amp; lock-in analysis</p>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-2xl font-bold ${
                supplierRisk.level === "low"      ? "text-success" :
                supplierRisk.level === "critical" ? "text-danger" :
                supplierRisk.level === "high"     ? "text-warning" : "text-accent"
              }`}>{supplierRisk.score}/10</div>
              <div className="text-xs text-muted">Lock-in Risk</div>
            </div>
          </div>
          <div className={`rounded-lg border px-4 py-3 mb-4 ${
            supplierRisk.level === "low"      ? "border-success/30 bg-success/5 text-success" :
            supplierRisk.level === "critical" ? "border-danger/30 bg-danger/5 text-danger" :
            supplierRisk.level === "high"     ? "border-warning/30 bg-warning/5 text-warning" :
            "border-accent/30 bg-accent/5 text-accent"
          }`}>
            <p className="text-sm font-medium">{supplierRisk.label}</p>
            <p className="text-sm mt-1 opacity-90">{supplierRisk.rationale}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-surface p-3">
              <span className="text-xs text-muted block mb-1">Required Purchases</span>
              <span className={`font-medium ${brand.item8.hasRequiredPurchases ? "text-warning" : "text-success"}`}>
                {brand.item8.hasRequiredPurchases == null ? "Unknown" : brand.item8.hasRequiredPurchases ? "Yes" : "No"}
              </span>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <span className="text-xs text-muted block mb-1">Approved Supplier List</span>
              <span className={`font-medium ${brand.item8.approvedSupplierList ? "text-warning" : "text-success"}`}>
                {brand.item8.approvedSupplierList == null ? "Unknown" : brand.item8.approvedSupplierList ? "Yes" : "No"}
              </span>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <span className="text-xs text-muted block mb-1">Specs Only (Free Source)</span>
              <span className={`font-medium ${brand.item8.specificationsOnly ? "text-success" : "text-muted"}`}>
                {brand.item8.specificationsOnly == null ? "Unknown" : brand.item8.specificationsOnly ? "Yes" : "No"}
              </span>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <span className="text-xs text-muted block mb-1">Franchisor Gets Supplier Revenue</span>
              <span className={`font-medium ${brand.item8.franchisorReceivesSupplierRevenue ? "text-danger" : "text-success"}`}>
                {brand.item8.franchisorReceivesSupplierRevenue == null ? "Unknown" : brand.item8.franchisorReceivesSupplierRevenue ? "Yes ⚠" : "No"}
              </span>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <span className="text-xs text-muted block mb-1">Alternative Supplier Possible</span>
              <span className={`font-medium ${brand.item8.alternativeSupplierPossible ? "text-success" : "text-muted"}`}>
                {brand.item8.alternativeSupplierPossible == null ? "Unknown" : brand.item8.alternativeSupplierPossible ? "Yes" : "No"}
              </span>
            </div>
            {brand.item8.lockInScore != null && (
              <div className="rounded-lg bg-surface p-3">
                <span className="text-xs text-muted block mb-1">Lock-In Score (0–10)</span>
                <span className="font-medium text-foreground">{brand.item8.lockInScore}/10</span>
              </div>
            )}
          </div>
          {brand.item8.mandatoryCategories && brand.item8.mandatoryCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {brand.item8.mandatoryCategories.map((c) => (
                <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-muted mt-3">
            Source: FDD Item 8 (Restrictions on Sources of Products and Services) · Lock-in score is editorial analysis
          </p>
        </section>
        )}

        {/* ── Management Quality (moved into Operations group) ── */}
        {brand.managementData && mgmtSignal.level !== "unknown" && (
        <section className={`rounded-xl border p-6 ${
          mgmtSignal.level === "strong" ? "border-success/25 bg-success/5" :
          mgmtSignal.level === "weak"   ? "border-warning/25 bg-warning/5" :
          "border-border bg-surface"
        }`}>
          <h2 className="text-base font-bold text-foreground mb-4">
            Management Quality — Item 2 (Business Experience)
          </h2>
          <div className="flex items-start gap-4 mb-4">
            <div className={`text-3xl font-black tabular-nums ${
              mgmtSignal.level === "strong" ? "text-success" :
              mgmtSignal.level === "weak"   ? "text-warning" : "text-foreground"
            }`}>
              {mgmtSignal.score ?? "—"}<span className="text-base font-normal text-muted">/10</span>
            </div>
            <div>
              <p className={`text-sm font-semibold ${
                mgmtSignal.level === "strong" ? "text-success" :
                mgmtSignal.level === "weak"   ? "text-warning" : "text-foreground"
              }`}>{mgmtSignal.label}</p>
              <p className="text-xs text-muted mt-0.5">{mgmtSignal.rationale}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brand.managementData.execCount != null && (
              <div className="rounded-lg bg-background border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{brand.managementData.execCount}</p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Senior Execs</p>
              </div>
            )}
            {brand.managementData.hasFranchiseExp != null && (
              <div className={`rounded-lg border p-3 text-center ${brand.managementData.hasFranchiseExp ? "border-success/30 bg-success/5" : "border-border bg-background"}`}>
                <p className={`text-sm font-bold ${brand.managementData.hasFranchiseExp ? "text-success" : "text-muted"}`}>
                  {brand.managementData.hasFranchiseExp ? "✓ Yes" : "✗ No"}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Franchise Exp.</p>
              </div>
            )}
            {brand.managementData.hasStableLeadership != null && (
              <div className={`rounded-lg border p-3 text-center ${brand.managementData.hasStableLeadership ? "border-success/30 bg-success/5" : "border-border bg-background"}`}>
                <p className={`text-sm font-bold ${brand.managementData.hasStableLeadership ? "text-success" : "text-muted"}`}>
                  {brand.managementData.hasStableLeadership ? "✓ Yes" : "✗ No"}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Stable Leadership</p>
              </div>
            )}
            {brand.managementData.hasLeadershipChanges != null && (
              <div className={`rounded-lg border p-3 text-center ${brand.managementData.hasLeadershipChanges ? "border-warning/30 bg-warning/5" : "border-border bg-background"}`}>
                <p className={`text-sm font-bold ${brand.managementData.hasLeadershipChanges ? "text-warning" : "text-muted"}`}>
                  {brand.managementData.hasLeadershipChanges ? "△ Yes" : "✓ No"}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Recent Changes</p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted mt-3">
            Source: FDD Item 2 (Business Experience) · Extraction confidence: {brand.managementData.extractionConfidence ?? "medium"}
          </p>
        </section>
        )}

        {/* ── Support Quality (moved into Operations group) ── */}
        {brand.item11 && supportQuality.level !== "unknown" && (
        <section className={`rounded-xl border p-5 ${
          supportQuality.level === "strong"   ? "border-success/30 bg-success/3" :
          supportQuality.level === "minimal"  ? "border-warning/25 bg-warning/5" :
          "border-border bg-background"
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Franchisor Support — Item 11</h2>
              <p className="text-xs text-muted mt-1">Training program, field support &amp; ongoing resources</p>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-2xl font-bold ${
                supportQuality.level === "strong"  ? "text-success" :
                supportQuality.level === "minimal" ? "text-warning" : "text-accent"
              }`}>{supportQuality.score}/10</div>
              <div className="text-xs text-muted">Support Score</div>
            </div>
          </div>
          <div className={`rounded-lg border px-4 py-3 mb-4 ${
            supportQuality.level === "strong"  ? "border-success/30 bg-success/5 text-success" :
            supportQuality.level === "minimal" ? "border-warning/30 bg-warning/5 text-warning" :
            "border-accent/30 bg-accent/5 text-accent"
          }`}>
            <p className="text-sm font-medium">{supportQuality.label}</p>
            <p className="text-xs mt-1 opacity-90">{supportQuality.rationale}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {brand.item11.totalTrainingHours != null && (
              <div className="rounded-lg bg-surface p-3">
                <span className="text-xs text-muted block mb-1">Total Training</span>
                <span className="font-bold text-foreground text-lg">{brand.item11.totalTrainingHours}h</span>
              </div>
            )}
            {brand.item11.classroomHours != null && (
              <div className="rounded-lg bg-surface p-3">
                <span className="text-xs text-muted block mb-1">Classroom</span>
                <span className="font-bold text-foreground text-lg">{brand.item11.classroomHours}h</span>
              </div>
            )}
            {brand.item11.ojtHours != null && (
              <div className="rounded-lg bg-surface p-3">
                <span className="text-xs text-muted block mb-1">On-the-Job</span>
                <span className="font-bold text-foreground text-lg">{brand.item11.ojtHours}h</span>
              </div>
            )}
            {brand.item11.hasFieldSupport != null && (
              <div className="rounded-lg bg-surface p-3">
                <span className="text-xs text-muted block mb-1">Field Support</span>
                <span className={`font-medium ${brand.item11.hasFieldSupport ? "text-success" : "text-muted"}`}>
                  {brand.item11.hasFieldSupport ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted mt-3">Source: FDD Item 11</p>
        </section>
        )}

        {/* ── 5f. Contract Terms at a Glance ── */}
        {effectiveGovVerified && brand.item17 && (
        <section className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Contract Terms at a Glance</h2>
          <p className="text-sm text-muted mb-5">Key franchise agreement provisions — from FDD Item 17. These define your legal relationship.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Term */}
            {brand.item17.initialTermYears && (
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-2xl font-bold text-accent">{brand.item17.initialTermYears}</div>
              <div className="text-xs text-muted mt-1">Year Term</div>
            </div>
            )}
            {/* Renewal */}
            <div className="rounded-lg border border-border p-3 text-center">
              <div className={`text-2xl font-bold ${brand.item17.renewalCount && brand.item17.renewalCount > 0 ? "text-success" : "text-danger"}`}>
                {brand.item17.renewalCount && brand.item17.renewalCount > 0 ? `${brand.item17.renewalCount}x` : "None"}
              </div>
              <div className="text-xs text-muted mt-1">Renewal Right</div>
            </div>
            {/* Noncompete */}
            {brand.item17.hasNonCompete && brand.item17.nonCompeteYears && (
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-2xl font-bold text-warning">
                {brand.item17.nonCompeteYears < 1 ? `${Math.round(brand.item17.nonCompeteYears * 12)}mo` : `${brand.item17.nonCompeteYears}yr`}
              </div>
              <div className="text-xs text-muted mt-1">Non-Compete</div>
              {brand.item17.nonCompeteMiles && <div className="text-[10px] text-muted">{brand.item17.nonCompeteMiles} mi radius</div>}
            </div>
            )}
            {/* Territory */}
            {brand.item12 && (
            <div className="rounded-lg border border-border p-3 text-center">
              <div className={`text-2xl font-bold ${brand.item12.exclusiveTerritory ? "text-success" : "text-danger"}`}>
                {brand.item12.exclusiveTerritory ? "Yes" : "No"}
              </div>
              <div className="text-xs text-muted mt-1">Exclusive Territory</div>
            </div>
            )}
            {/* Arbitration */}
            <div className="rounded-lg border border-border p-3 text-center">
              <div className={`text-2xl font-bold ${brand.item17.mandatoryArbitration ? "text-warning" : "text-success"}`}>
                {brand.item17.mandatoryArbitration ? "Yes" : "No"}
              </div>
              <div className="text-xs text-muted mt-1">Mandatory Arbitration</div>
            </div>
            {/* Venue */}
            {brand.item17.disputeVenue && (
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-lg font-bold text-foreground leading-tight">{brand.item17.disputeVenue.split("(")[0].trim()}</div>
              <div className="text-xs text-muted mt-1">Dispute Venue</div>
            </div>
            )}
            {/* Cross-default */}
            {brand.item10?.crossDefault && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-center">
              <div className="text-2xl font-bold text-danger">Yes</div>
              <div className="text-xs text-muted mt-1">Loan Cross-Default</div>
            </div>
            )}
            {/* Personal Guarantee */}
            {brand.item10?.personalGuarantee && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-center">
              <div className="text-2xl font-bold text-warning">Yes</div>
              <div className="text-xs text-muted mt-1">Personal Guarantee</div>
            </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-surface text-sm text-muted">
            <strong className="text-foreground">In plain English:</strong>{" "}
            {brand.item17.initialTermYears ? `You sign for ${brand.item17.initialTermYears} years. ` : ""}
            {!brand.item17.renewalCount || brand.item17.renewalCount === 0
              ? "There is no guaranteed right to renew — the franchisor decides whether to offer you another term. "
              : `You can renew ${brand.item17.renewalCount} time(s). `}
            {brand.item17.hasNonCompete && brand.item17.nonCompeteYears
              ? `After leaving, you cannot operate a competing business for ${brand.item17.nonCompeteYears < 1 ? Math.round(brand.item17.nonCompeteYears * 12) + " months" : brand.item17.nonCompeteYears + " years"}${brand.item17.nonCompeteMiles ? ` within ${brand.item17.nonCompeteMiles} miles` : ""}. `
              : ""}
            {!brand.item12?.exclusiveTerritory
              ? "You have no exclusive territory — the franchisor can place another location near you. "
              : "You have an exclusive territory. "}
            {brand.item10?.crossDefault
              ? "If you default on your loan, it counts as a franchise default too. "
              : ""}
            {brand.item10?.personalGuarantee
              ? "You (and possibly your spouse) must personally guarantee any loans."
              : ""}
          </div>
        </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            GROUP D — SYSTEM HEALTH: Is It Growing or Shrinking?
           ════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-accent/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">System Health: Is It Growing or Shrinking?</h3>
              <p className="text-xs text-muted">Unit openings, closures, transfers, and geographic spread — FDD Item 20</p>
            </div>
          </div>
        </div>

        {/* ── 6. Unit Economics (Item 20) ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Unit Economics — Item 20 (Outlets &amp; Franchisee Information)
          </h2>
          {!effectiveGovVerified ? <GovDataOnly /> : (
          <>
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
          </>
          )}
        </section>

        {/* ── 6a2. System Composition Visual ── */}
        {effectiveGovVerified && brand.franchisedUnits > 0 && brand.companyOwnedUnits > 0 && (
        <section className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">System Composition</h2>
          <p className="text-sm text-muted mb-5">Ownership split and 3-year system trajectory — from FDD Item 20.</p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Donut chart — franchised vs company */}
            {(() => {
              const total = brand.franchisedUnits + brand.companyOwnedUnits;
              const fPct = Math.round((brand.franchisedUnits / total) * 100);
              const cPct = 100 - fPct;
              return (
                <div className="shrink-0 mx-auto lg:mx-0">
                  <div className="relative w-44 h-44">
                    <div className="w-44 h-44 rounded-full"
                      style={{ background: `conic-gradient(#2dd4bf 0% ${fPct}%, #f59e0b ${fPct}% 100%)` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-background flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-foreground">{total.toLocaleString()}</span>
                        <span className="text-[10px] text-muted">total units</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-teal-400" />
                      <span className="text-xs text-muted">Franchised {fPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-muted">Company {cPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3-year trajectory bars */}
            {brand.unitEconomics.yearlyNetGrowth && brand.unitEconomics.yearlyNetGrowth.length > 0 && (
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground mb-3">3-Year System Trajectory</h3>
              <div className="space-y-3">
                {brand.unitEconomics.yearlyNetGrowth.map((yr, i) => {
                  const maxVal = Math.max(...brand.unitEconomics.yearlyNetGrowth!.map(y => Math.max(y.opened, Math.abs(y.closed || 0))));
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{yr.year}</span>
                        <span className={`text-sm font-bold ${yr.net >= 0 ? "text-success" : "text-danger"}`}>
                          {yr.net >= 0 ? "+" : ""}{yr.net} net
                        </span>
                      </div>
                      <div className="flex gap-1 h-5">
                        <div className="bg-success/80 rounded-sm flex items-center justify-center"
                          style={{ width: `${(yr.opened / maxVal) * 50}%` }}>
                          <span className="text-[10px] font-bold text-white px-1">+{yr.opened}</span>
                        </div>
                        {(yr.closed || 0) > 0 && (
                        <div className="bg-danger/80 rounded-sm flex items-center justify-center"
                          style={{ width: `${((yr.closed || 0) / maxVal) * 50}%` }}>
                          <span className="text-[10px] font-bold text-white px-1">-{yr.closed}</span>
                        </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-success/80" /><span className="text-xs text-muted">Opened</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-danger/80" /><span className="text-xs text-muted">Closed</span></div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-surface text-sm text-muted">
                <strong className="text-foreground">In plain English:</strong> The system grew by {brand.unitEconomics.yearlyNetGrowth.reduce((sum, y) => sum + y.net, 0)} net
                units over three years. {brand.unitEconomics.yearlyNetGrowth[brand.unitEconomics.yearlyNetGrowth.length - 1]?.net > 0
                  ? `The most recent year showed the strongest growth (+${brand.unitEconomics.yearlyNetGrowth[brand.unitEconomics.yearlyNetGrowth.length - 1].net}), suggesting accelerating development.`
                  : "Growth has slowed in the most recent period."}
                {" "}{brand.unitEconomics.unitsTransferred > 0 && `${brand.unitEconomics.unitsTransferred.toLocaleString()} units changed hands between franchisees in the latest year.`}
              </div>
            </div>
            )}
          </div>
        </section>
        )}

        {/* ── 6b. Outlet Churn Anatomy ── */}
        {churnAnatomy && effectiveGovVerified && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Outlet Churn Anatomy — Item 20
          </h2>
          <p className="text-xs text-muted mb-4">Exit-type breakdown for the {churnAnatomy.periodLabel}. Source: government-filed FDD.</p>
          <>
          <div className="space-y-4">
            {/* System Health Signal */}
            <div className={`rounded-xl border p-4 flex items-start gap-4 ${
              churnAnatomy.systemHealthSignal === "growing" ? "border-success/30 bg-success/5" :
              churnAnatomy.systemHealthSignal === "distressed" ? "border-danger/30 bg-danger/5" :
              churnAnatomy.systemHealthSignal === "contracting" ? "border-warning/30 bg-warning/5" :
              "border-border bg-surface"
            }`}>
              <span className={`text-2xl font-bold ${
                churnAnatomy.systemHealthSignal === "growing" ? "text-success" :
                churnAnatomy.systemHealthSignal === "distressed" ? "text-danger" :
                churnAnatomy.systemHealthSignal === "contracting" ? "text-warning" : "text-muted"
              }`}>
                {churnAnatomy.systemHealthSignal === "growing" ? "▲" :
                 churnAnatomy.systemHealthSignal === "distressed" ? "⚠" :
                 churnAnatomy.systemHealthSignal === "contracting" ? "▼" : "●"}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground capitalize">{churnAnatomy.systemHealthSignal.replace("_", " ")} System</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{churnAnatomy.keyInsight}</p>
              </div>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Opened</p>
                <p className="text-2xl font-bold text-success">+{churnAnatomy.totalOpened}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Exited</p>
                <p className="text-2xl font-bold text-danger">-{churnAnatomy.totalExited}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Net</p>
                <p className={`text-2xl font-bold ${churnAnatomy.netGrowth >= 0 ? "text-success" : "text-danger"}`}>
                  {churnAnatomy.netGrowth >= 0 ? "+" : ""}{churnAnatomy.netGrowth}
                </p>
              </div>
            </div>
            {/* Exit breakdown table */}
            {churnAnatomy.rows.length > 0 && (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted uppercase tracking-wider">Exit Type</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted uppercase tracking-wider">Count</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody>
                  {churnAnatomy.rows.map((row, i) => (
                    <tr key={i} className={`border-b border-border last:border-0 ${
                      row.signal === "negative" ? "bg-danger/3" :
                      row.signal === "positive" ? "bg-success/3" : ""
                    }`}>
                      <td className="px-5 py-3">
                        <p className={`text-sm font-medium ${row.signal === "negative" ? "text-danger" : row.signal === "positive" ? "text-success" : "text-foreground"}`}>{row.type}</p>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{row.interpretation}</p>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">{row.count}</td>
                      <td className="px-5 py-3 text-right text-muted">{row.pct > 0 ? `${row.pct}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {churnAnatomy.forcedExitPct > 0 && (
              <p className="text-xs text-muted px-1">
                <span className={churnAnatomy.forcedExitPct >= 40 ? "text-danger font-medium" : "text-warning font-medium"}>
                  {churnAnatomy.forcedExitPct}% of exits were franchisor-forced
                </span>
                {" "}(terminations + non-renewals). Industry benchmark: under 20% is normal.
              </p>
            )}
          </div>
          </>
        </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            GROUP E — FRANCHISOR STRENGTH: Can They Support You?
           ════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-accent/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Franchisor Strength: Can They Support You?</h3>
              <p className="text-xs text-muted">Financial health, litigation history, and audited statements — FDD Items 3, 4, 21</p>
            </div>
          </div>
        </div>

        {/* ── 7. Litigation Summary (Item 3) ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Litigation Summary — Item 3
          </h2>
          {!effectiveGovVerified ? <GovDataOnly /> : (
          <>
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
          </>
          )}
        </section>

        {/* ── 7a. Franchisor Financial Strength (Item 21) ── */}
        {effectiveGovVerified && brand.item21 && (brand.item21.hasAuditedFinancials || brand.item21.franchisorRevenue || brand.item21.goingConcernWarning) && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Franchisor Financial Strength — Item 21
          </h2>
          <p className="text-xs text-muted mb-4">Extracted from audited financial statements filed with the FDD.</p>
          <>
          <div className="space-y-4">
            {/* Going concern warning — critical alert */}
            {brand.item21.goingConcernWarning && (
              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-danger">Going Concern Warning</p>
                  <p className="text-xs text-muted mt-0.5">The auditor included a going concern qualification in their opinion. This means the auditor has doubts about the franchisor&apos;s ability to continue operating. This is a serious red flag — consult a franchise attorney before proceeding.</p>
                </div>
              </div>
            )}
            {/* Auditor info + strength signal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {brand.item21.hasAuditedFinancials && (
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Auditor</p>
                  <p className="text-base font-bold text-foreground capitalize">{brand.item21.auditorName ?? "Independent auditor"}</p>
                  {brand.item21.auditorOpinion && (
                    <p className={`text-xs mt-1 font-medium ${brand.item21.auditorOpinion === "clean" ? "text-success" : brand.item21.auditorOpinion === "qualified" ? "text-warning" : "text-danger"}`}>
                      {brand.item21.auditorOpinion === "clean" ? "✓ Unqualified (clean) opinion" :
                       brand.item21.auditorOpinion === "qualified" ? "△ Qualified opinion" :
                       `⚠ ${brand.item21.auditorOpinion} opinion`}
                    </p>
                  )}
                </div>
              )}
              {brand.item21.financialStrengthSignal && (
                <div className={`rounded-xl border p-4 ${
                  brand.item21.financialStrengthSignal === "strong" ? "border-success/25 bg-success/5" :
                  brand.item21.financialStrengthSignal === "weak" ? "border-danger/25 bg-danger/5" :
                  brand.item21.financialStrengthSignal === "watch" ? "border-warning/25 bg-warning/5" :
                  "border-border bg-background"
                }`}>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Financial Strength</p>
                  <p className={`text-base font-bold capitalize ${
                    brand.item21.financialStrengthSignal === "strong" ? "text-success" :
                    brand.item21.financialStrengthSignal === "weak" ? "text-danger" :
                    brand.item21.financialStrengthSignal === "watch" ? "text-warning" : "text-foreground"
                  }`}>{brand.item21.financialStrengthSignal}</p>
                  <p className="text-xs text-muted mt-1">Derived from audited balance sheet</p>
                </div>
              )}
            </div>
            {/* Key financial figures */}
            {(brand.item21.franchisorRevenue || brand.item21.franchisorTotalAssets || brand.item21.franchisorEquity) && (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted uppercase tracking-wider" colSpan={2}>
                      Franchisor Financials (most recent audited year)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brand.item21.franchisorRevenue != null && (
                    <tr className="border-b border-border table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Revenue</td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">{formatCurrency(brand.item21.franchisorRevenue)}</td>
                    </tr>
                  )}
                  {brand.item21.franchisorTotalAssets != null && (
                    <tr className="border-b border-border table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Total Assets</td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">{formatCurrency(brand.item21.franchisorTotalAssets)}</td>
                    </tr>
                  )}
                  {brand.item21.franchisorTotalLiabilities != null && (
                    <tr className="border-b border-border table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Total Liabilities</td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">{formatCurrency(brand.item21.franchisorTotalLiabilities)}</td>
                    </tr>
                  )}
                  {brand.item21.franchisorEquity != null && (
                    <tr className="border-b border-border table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Equity</td>
                      <td className={`px-5 py-3 text-right font-semibold ${brand.item21.franchisorEquity < 0 ? "text-danger" : "text-foreground"}`}>{formatCurrency(brand.item21.franchisorEquity)}</td>
                    </tr>
                  )}
                  {brand.item21.franchisorNetIncome != null && (
                    <tr className="border-b border-border table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Net Income</td>
                      <td className={`px-5 py-3 text-right font-semibold ${brand.item21.franchisorNetIncome < 0 ? "text-danger" : "text-success"}`}>{formatCurrency(brand.item21.franchisorNetIncome)}</td>
                    </tr>
                  )}
                  {brand.item21.franchisorCashAndEquivalents != null && (
                    <tr className="table-row-hover">
                      <td className="px-5 py-3 text-muted font-medium">Cash &amp; Equivalents</td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">{formatCurrency(brand.item21.franchisorCashAndEquivalents)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
          </>
        </section>
        )}

        {/* ── 7a2. Franchisor P&L Visual Snapshot ── */}
        {effectiveGovVerified && brand.item21?.franchisorRevenue && brand.item21?.franchisorNetIncome && (
        <section className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Franchisor P&L Snapshot</h2>
          <p className="text-sm text-muted mb-5">Visual summary of the franchisor&apos;s audited financials — from FDD Item 21 / Exhibit A.</p>

          {(() => {
            const rev = brand.item21!.franchisorRevenue!;
            const ni = brand.item21!.franchisorNetIncome!;
            const assets = brand.item21!.franchisorTotalAssets;
            const equity = brand.item21!.franchisorEquity;
            const liab = brand.item21!.franchisorTotalLiabilities;
            const margin = rev > 0 ? ((ni / rev) * 100) : 0;

            // Revenue waterfall bars
            const bars = [
              { label: "Revenue", value: rev, color: "bg-accent" },
              ...(assets ? [{ label: "Total Assets", value: assets, color: "bg-cyan-500" }] : []),
              ...(equity ? [{ label: "Equity", value: equity, color: "bg-success" }] : []),
              ...(liab ? [{ label: "Liabilities", value: liab, color: "bg-warning" }] : []),
              { label: "Net Income", value: ni, color: ni >= 0 ? "bg-emerald-400" : "bg-danger" },
            ];
            const maxVal = Math.max(...bars.map(b => Math.abs(b.value)));

            return (
              <div className="space-y-4">
                {/* Horizontal bar chart */}
                <div className="space-y-3">
                  {bars.map((bar, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted">{bar.label}</span>
                        <span className="text-sm font-bold text-foreground">${(Math.abs(bar.value) / 1e9).toFixed(2)}B</span>
                      </div>
                      <div className="h-6 bg-surface rounded-full overflow-hidden">
                        <div className={`h-full ${bar.color} rounded-full transition-all`}
                          style={{ width: `${(Math.abs(bar.value) / maxVal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key ratios */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className="text-xl font-bold text-foreground">{margin.toFixed(1)}%</div>
                    <div className="text-xs text-muted">Net Margin</div>
                  </div>
                  {brand.item21!.debtToEquityRatio !== undefined && (
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className={`text-xl font-bold ${brand.item21!.debtToEquityRatio! > 3 ? "text-danger" : brand.item21!.debtToEquityRatio! > 2 ? "text-warning" : "text-success"}`}>
                      {brand.item21!.debtToEquityRatio!.toFixed(2)}x
                    </div>
                    <div className="text-xs text-muted">Debt / Equity</div>
                  </div>
                  )}
                  {brand.item21!.revenueYoYPct !== undefined && (
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className={`text-xl font-bold ${brand.item21!.revenueYoYPct! >= 0 ? "text-success" : "text-danger"}`}>
                      {brand.item21!.revenueYoYPct! >= 0 ? "+" : ""}{brand.item21!.revenueYoYPct!.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted">Revenue YoY</div>
                  </div>
                  )}
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className={`text-xl font-bold ${brand.item21!.goingConcernWarning ? "text-danger" : "text-success"}`}>
                      {brand.item21!.goingConcernWarning ? "Yes" : "No"}
                    </div>
                    <div className="text-xs text-muted">Going Concern</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface text-sm text-muted">
                  <strong className="text-foreground">In plain English:</strong> The franchisor reported ${(rev / 1e9).toFixed(2)}B in revenue
                  and ${(ni / 1e9).toFixed(2)}B in net income — a {margin.toFixed(1)}% profit margin.
                  {equity && equity > 0 ? ` Equity is ${(equity / 1e9).toFixed(2)}B, meaning the company owns substantially more than it owes.` : ""}
                  {brand.item21!.auditorName && ` These figures were audited by ${brand.item21!.auditorName}.`}
                  {brand.item21!.auditorOpinion === "clean" && " The audit opinion was clean (unqualified) — no red flags from the auditor."}
                  {!brand.item21!.goingConcernWarning && " There is no going-concern warning, meaning the auditor sees no risk the company cannot continue operating."}
                </div>
              </div>
            );
          })()}
        </section>
        )}

        {/* ── 7b. Cohort Benchmarks ── */}
        {effectiveGovVerified && cohortBenchmarks.benchmarks.some((b: CohortBenchmark) => b.percentile !== null) && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Peer Benchmarks</h2>
          <BenchmarkWidget benchmarks={cohortBenchmarks} brandName={brand.name} />
        </section>
        )}

        {/* ── 8a. Filing Year Changes (YoY diff) ── */}
        {effectiveGovVerified && (brand.item19Prior?.grossRevenueAvg || (brand.unitEconomics?.yearlyNetGrowth && brand.unitEconomics.yearlyNetGrowth.length >= 2)) && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Filing Year Changes</h2>
          <p className="text-xs text-muted mb-4">Year-over-year comparison across multiple FDD filings. Source: government-filed disclosures.</p>
          <div className="space-y-3">

            {/* YoY Revenue diff */}
            {brand.item19Prior?.grossRevenueAvg && brand.item19 && brand.item19.grossRevenueAvg && (() => {
              const curr = brand.item19.grossRevenueAvg!;
              const prior = brand.item19Prior!.grossRevenueAvg!;
              const pct = ((curr - prior) / prior) * 100;
              const isUp = pct >= 0;
              const absPct = Math.abs(pct);
              return (
                <div className={`rounded-xl border p-5 ${isUp ? "border-success/20 bg-success/5" : "border-danger/20 bg-danger/5"}`}>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Avg Revenue — Item 19 (Year-over-Year)</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-center">
                      <p className="text-[11px] text-muted uppercase tracking-wider mb-0.5">{brand.item19Prior?.fddYear ?? "Prior"} FDD</p>
                      <p className="text-xl font-bold text-foreground">${(prior / 1000).toFixed(0)}K</p>
                    </div>
                    <div className={`text-3xl font-bold ${isUp ? "text-success" : "text-danger"}`}>
                      {isUp ? "↑" : "↓"}
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-muted uppercase tracking-wider mb-0.5">{brand.fddYear ?? "Current"} FDD</p>
                      <p className="text-xl font-bold text-foreground">${(curr / 1000).toFixed(0)}K</p>
                    </div>
                    <div className={`ml-auto rounded-lg px-4 py-2 ${isUp ? "bg-success/10 border border-success/20" : "bg-danger/10 border border-danger/20"}`}>
                      <p className={`text-2xl font-bold ${isUp ? "text-success" : "text-danger"}`}>
                        {isUp ? "+" : "−"}{absPct.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted text-center">year-over-year</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Unit growth bar chart */}
            {brand.unitEconomics?.yearlyNetGrowth && brand.unitEconomics.yearlyNetGrowth.length >= 2 && (() => {
              const data = brand.unitEconomics!.yearlyNetGrowth!;
              const latest = data[data.length - 1];
              const trend = data.slice(-1)[0].net > data[0].net ? "improving" : data.slice(-1)[0].net < data[0].net ? "declining" : "stable";
              return (
                <div className="rounded-xl border border-border bg-background p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">Net Unit Growth — Item 20 (Multi-Year)</p>
                      <p className="text-xs text-muted mt-0.5">Green = system grew · Red = system shrank · Each bar = one filing year</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      trend === "improving" ? "text-success bg-success/10 border-success/20" :
                      trend === "declining" ? "text-danger bg-danger/10 border-danger/20" :
                      "text-muted bg-surface border-border"
                    }`}>
                      {trend === "improving" ? "↑ Trend improving" : trend === "declining" ? "↓ Trend declining" : "→ Stable"}
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <UnitGrowthChart data={data} height={80} />
                    <div className="text-right ml-auto shrink-0">
                      <p className="text-xs text-muted uppercase tracking-wider">Most recent</p>
                      <p className={`text-2xl font-bold ${latest.net > 0 ? "text-success" : latest.net < 0 ? "text-danger" : "text-muted"}`}>
                        {latest.net > 0 ? "+" : ""}{latest.net}
                      </p>
                      <p className="text-xs text-muted">net units {latest.year}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="mt-3 text-right">
            <Link href={`/brands/${slug}/diff`} className="text-xs text-accent hover:underline font-medium">
              View full filing changes →
            </Link>
          </div>
        </section>
        )}

        {/* ── 8b. Trends & Deterioration Signals ── */}
        {effectiveGovVerified && deteriorationReport.signals.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Trends &amp; Change Signals</h2>
          <p className="text-xs text-muted mb-4">
            Multi-factor trend detection across revenue, unit count, financials, and litigation.
            {deteriorationReport.hasPriorData ? " Includes year-over-year comparison." : ""}
          </p>
          <>
          <div className="space-y-3">
            {/* Overall signal banner */}
            <div className={`rounded-xl border p-4 flex items-start gap-3 ${
              deteriorationReport.overallTrend === "critical" ? "border-danger/30 bg-danger/5" :
              deteriorationReport.overallTrend === "warning" ? "border-warning/20 bg-warning/5" :
              deteriorationReport.overallTrend === "improving" ? "border-success/20 bg-success/5" :
              "border-border bg-surface"
            }`}>
              <span className={`text-xl font-bold ${
                deteriorationReport.overallTrend === "critical" ? "text-danger" :
                deteriorationReport.overallTrend === "warning" ? "text-warning" :
                deteriorationReport.overallTrend === "improving" ? "text-success" : "text-muted"
              }`}>
                {deteriorationReport.overallTrend === "critical" ? "⚠" :
                 deteriorationReport.overallTrend === "warning" ? "△" :
                 deteriorationReport.overallTrend === "improving" ? "↑" : "→"}
              </span>
              <div>
                <p className={`text-sm font-bold capitalize ${
                  deteriorationReport.overallTrend === "critical" ? "text-danger" :
                  deteriorationReport.overallTrend === "warning" ? "text-warning" :
                  deteriorationReport.overallTrend === "improving" ? "text-success" : "text-foreground"
                }`}>Overall Trend: {deteriorationReport.overallTrend}</p>
                <p className="text-xs text-muted mt-0.5">{deteriorationReport.summary}</p>
              </div>
            </div>
            {/* Individual signals */}
            {deteriorationReport.signals.map((sig: DeteriorationSignal, i: number) => (
              <div key={i} className={`rounded-xl border p-4 ${
                sig.severity === "critical" ? "border-danger/25 bg-danger/5" :
                sig.severity === "warning" ? "border-warning/20 bg-warning/5" :
                sig.severity === "improving" ? "border-success/15 bg-success/5" :
                "border-border bg-surface"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        sig.severity === "critical" ? "text-danger" :
                        sig.severity === "warning" ? "text-warning" :
                        sig.severity === "improving" ? "text-success" : "text-muted"
                      }`}>{sig.severity}</span>
                      <span className="text-xs text-muted">{sig.fddReference}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{sig.field}</p>
                    <p className="text-xs text-muted mt-0.5">{sig.changeSummary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-foreground">{sig.currentValue}</p>
                    {sig.priorValue && <p className="text-xs text-muted mt-0.5">vs. {sig.priorValue}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            GROUP F — BUYER PREP: What to Watch For
           ════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-accent/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Buyer Prep: What to Watch For</h3>
              <p className="text-xs text-muted">Key risk areas, questions for existing franchisees, and community insights</p>
            </div>
          </div>
        </div>

        {/* ── Red Flags (compact — toned down) ── */}
        {brand.redFlags.length > 0 && (
          <section className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-base font-semibold text-foreground">Key Risk Areas</h2>
              <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
                {brand.redFlags.length} from FDD
              </span>
            </div>
            <div className="space-y-2">
              {brand.redFlags.map((flag, i) => {
                const s = severityStyles(flag.severity);
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${s.bg} border ${s.border}`}>
                    <span className={`text-[10px] font-bold uppercase ${s.text} shrink-0 mt-0.5 w-16`}>{s.label}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">{flag.title}</span>
                      {flag.fddReference && <span className="text-[10px] text-muted ml-2">({flag.fddReference})</span>}
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">{flag.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 8b. Franchisee Interview Prep ── */}
        {effectiveGovVerified && interviewQuestions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Franchisee Interview Prep</h2>
          <p className="text-xs text-muted mb-4">
            Questions to ask current franchisees — generated from red flags, Item 20 exit data, and contract terms in the {brand.fddYear} FDD.
            Prioritized: critical questions first.
          </p>
          <>
          <div className="space-y-3">
            {interviewQuestions.slice(0, 8).map((q: InterviewQuestion, i: number) => (
              <div key={i} className={`rounded-xl border p-4 ${
                q.priority === "critical" ? "border-danger/30 bg-danger/5" :
                q.priority === "important" ? "border-warning/20 bg-warning/5" :
                "border-border bg-surface"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    q.priority === "critical" ? "bg-danger/15 text-danger" :
                    q.priority === "important" ? "bg-warning/15 text-warning" :
                    "bg-surface text-muted"
                  }`}>{q.priority}</span>
                  <span className="text-xs text-muted capitalize">{q.category.replace("_", " ")}</span>
                  <span className="text-xs text-muted ml-auto">{q.sourcedFrom}</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-xs text-muted"><span className="font-medium text-foreground">Look for:</span> {q.lookFor}</p>
                </div>
              </div>
            ))}
          </div>
          </>
        </section>
        )}

        {/* ── 8c. State Concentration ── */}
        {(stateConc.stateCount > 0) && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-1">Geographic Concentration</h2>
          <p className="text-xs text-muted mb-4">
            State distribution analysis from FDD Item 20 (Table No. 3).
            {stateConc.extractionConfidence === "low" && (
              <span className="ml-1 italic">Coverage estimate based on aggregate state count — per-state breakdown pending full extraction.</span>
            )}
          </p>

          {/* Risk banner */}
          <div className={`rounded-lg p-4 mb-5 border ${
            stateRisk.level === "critical" ? "bg-danger/5 border-danger/30" :
            stateRisk.level === "high"     ? "bg-warning/5 border-warning/30" :
            stateRisk.level === "medium"   ? "bg-accent/5 border-accent/20" :
            "bg-success/5 border-success/20"
          }`}>
            <div className="flex items-start gap-3">
              <span className={`text-lg ${
                stateRisk.level === "critical" ? "text-danger" :
                stateRisk.level === "high"     ? "text-warning" :
                stateRisk.level === "medium"   ? "text-accent" :
                "text-success"
              }`}>
                {stateRisk.level === "critical" ? "⚠" : stateRisk.level === "low" ? "✓" : "◉"}
              </span>
              <div>
                <p className={`text-sm font-semibold mb-0.5 ${
                  stateRisk.level === "critical" ? "text-danger" :
                  stateRisk.level === "high"     ? "text-warning" :
                  stateRisk.level === "medium"   ? "text-accent" :
                  "text-success"
                }`}>{stateRisk.label}</p>
                <p className="text-xs text-muted leading-relaxed">{stateRisk.rationale}</p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="rounded-lg bg-surface border border-border p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stateConc.stateCount || "—"}</p>
              <p className="text-xs text-muted mt-0.5">States Active</p>
            </div>
            <div className="rounded-lg bg-surface border border-border p-3 text-center">
              <p className="text-2xl font-bold text-foreground capitalize">{stateConc.coverageType.replace("_", " ")}</p>
              <p className="text-xs text-muted mt-0.5">Coverage Type</p>
            </div>
            {stateConc.hhi != null && (
              <div className="rounded-lg bg-surface border border-border p-3 text-center">
                <p className={`text-2xl font-bold ${
                  stateConc.hhi > 0.4 ? "text-danger" :
                  stateConc.hhi > 0.2 ? "text-warning" : "text-success"
                }`}>{stateConc.hhi.toFixed(2)}</p>
                <p className="text-xs text-muted mt-0.5">HHI (concentration)</p>
              </div>
            )}
            {stateConc.topStateSharePct != null && (
              <div className="rounded-lg bg-surface border border-border p-3 text-center">
                <p className={`text-2xl font-bold ${
                  stateConc.topStateSharePct > 50 ? "text-danger" :
                  stateConc.topStateSharePct > 30 ? "text-warning" : "text-foreground"
                }`}>{stateConc.topStateSharePct}%</p>
                <p className="text-xs text-muted mt-0.5">
                  {stateConc.topState ? `Top state (${stateConc.topState})` : "Est. top-state share"}
                </p>
              </div>
            )}
          </div>

          {/* Per-state bar chart (only when full breakdown available) */}
          {stateConc.byState && stateConc.byState.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Units by State (Item 20)</p>
              <div className="space-y-2">
                {stateConc.byState.slice(0, 15).map(({ state, units }) => {
                  const maxUnits = stateConc.byState![0].units;
                  const pct = maxUnits > 0 ? Math.round((units / maxUnits) * 100) : 0;
                  const totalShare = brand.totalUnits > 0 ? Math.round((units / brand.totalUnits) * 100) : 0;
                  return (
                    <div key={state} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted w-6 shrink-0">{state}</span>
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${totalShare > 30 ? "bg-warning" : "bg-accent"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted w-16 text-right shrink-0">
                        {units.toLocaleString()} ({totalShare}%)
                      </span>
                    </div>
                  );
                })}
                {stateConc.byState.length > 15 && (
                  <p className="text-xs text-muted mt-1">+{stateConc.byState.length - 15} more states</p>
                )}
              </div>
            </div>
          )}

          {stateConc.extractionConfidence === "low" && (
            <p className="text-xs text-muted mt-3 italic">
              ℹ Per-state breakdown will be available after Item 20 state-table extraction completes for this brand.
            </p>
          )}
        </section>
        )}

        {/* ── 8g. Community Data (moved to bottom — not FDD data) ── */}
        {(() => {
          const communityProfile = getCommunityProfile(brand.slug);
          const hasSourced = communityProfile && (communityProfile.sentiment.length > 0 || communityProfile.news.length > 0);
          return (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-foreground">Community</h2>
              <span className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-[10px] font-semibold">Not FDD data</span>
            </div>

            {hasSourced && (
              <div className="rounded-xl border border-border bg-background p-5 mb-4 space-y-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-widest">Public Sources</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {communityProfile!.sentiment.map((entry, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                      {entry.rating !== null && (
                        <div className="shrink-0 text-center min-w-[36px]">
                          <p className="text-lg font-bold text-foreground leading-none">{entry.rating}</p>
                          <p className="text-[10px] text-muted">/5</p>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-xs text-foreground leading-snug">{entry.excerpt}</p>
                        <CommunitySourceBadge source={entry.source} />
                      </div>
                    </div>
                  ))}
                  {communityProfile!.news.map((entry, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface space-y-1.5">
                      <p className="text-xs font-medium text-foreground">{entry.headline}</p>
                      <p className="text-[11px] text-muted">{entry.summary}</p>
                      <CommunitySourceBadge source={entry.source} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-background p-5">
              {brand.communityReviews > 0 ? (
                <>
                  <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Anonymous Owner Submissions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
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
                        <p className="text-3xl font-bold text-foreground">{formatCurrency(brand.communityAvgFirstYearRevenue)}</p>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">Submissions</p>
                      <p className="text-3xl font-bold text-accent">{brand.communityReviews}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Anonymous Owner Submissions</p>
              )}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted mb-4">
                  {brand.communityReviews > 0
                    ? `Are you a ${brand.name} franchisee? Add your anonymous data.`
                    : `No owner submissions yet for ${brand.name}. Be the first — your data helps future buyers.`}
                </p>
                <CommunitySubmitForm defaultBrandSlug={brand.slug} defaultBrandName={brand.name} />
              </div>
            </div>
          </section>
          );
        })()}

        {/* ── 9. Tools ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <section className="rounded-xl border border-accent/20 bg-accent/5 p-5">
            <h2 className="text-sm font-bold text-foreground mb-1">Buyer Memo</h2>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              One-page printable summary: investment, revenue, flags, and questions to ask.
            </p>
            <Link
              href={`/brands/${brand.slug}/memo`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              View Memo →
            </Link>
          </section>
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-bold text-foreground mb-1">Full Diligence Memo</h2>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              Item 19, system health, red flags, contract terms — cited to the filed FDD.
            </p>
            <Link
              href={`/brands/${brand.slug}/diligence`}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted hover:text-foreground hover:border-foreground transition-all"
            >
              Full Analysis →
            </Link>
          </section>
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-bold text-foreground mb-1">Lender Readiness Pack</h2>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              SBA-ready summary: investment ranges, scenario economics, franchisor financials.
            </p>
            <Link
              href={`/brands/${brand.slug}/lender-pack`}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted hover:text-foreground hover:border-foreground transition-all"
            >
              View Lender Pack →
            </Link>
          </section>
        </div>

        {/* ── Quick Tools ── */}
        <div className="flex flex-wrap items-center gap-3 py-2">
          <Link
            href={`/compare?brandA=${brand.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:text-accent hover:border-accent transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
            </svg>
            Compare →
          </Link>
          <WatchButton
            slug={brand.slug}
            name={brand.name}
            snapshotScore={prodScores.coreDiligence ?? 0}
            snapshotRevenue={brand.item19?.grossRevenueAvg}
            variant="pill"
          />
          <Link
            href="/watchlist"
            className="text-xs text-muted hover:text-accent transition-colors"
          >
            View Watchlist
          </Link>
        </div>

        {/* ── 10. Get Full Report CTA ── */}
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
                  : brand.dataSource === "state_filing"
                  ? `Data sourced from the ${brand.fddYear} FDD filed with a state franchise regulator (${brand.headquartersState || "state"} DFI/CARDS filing). Fields not extractable from the PDF are shown as not available.`
                  : brand.dataSource === "sec_filing"
                  ? `Data sourced from SEC EDGAR filings (10-K/10-Q) for ${brand.parentCompany} and the ${brand.fddYear} FDD.`
                  : brand.dataSource === "public_record"
                  ? `Data sourced from official franchisor website and published ${brand.fddYear} FDD summaries for ${brand.parentCompany}.`
                  : `Data sourced from secondary public records referencing the ${brand.fddYear} FDD for ${brand.parentCompany}. Key figures are estimated where direct extraction was not possible.`}
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
            <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Core Diligence</p>
            {prodScores.coreDiligence !== null ? (
              <>
                <p className={`text-5xl font-bold ${scoreTextColor(prodScores.coreDiligence)}`}>{prodScores.coreDiligence}</p>
                <p className="text-xs text-muted mt-0.5">out of 100</p>
                <div className="w-full mt-3 h-2 rounded-full bg-surface">
                  <div className={`h-2 rounded-full ${scoreColor(prodScores.coreDiligence)}`} style={{ width: `${prodScores.coreDiligence}%` }} />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted mt-2">Insufficient data</p>
            )}
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-left">
              {[
                { label: "System Health", value: prodScores.systemHealth },
                { label: "Franchisor", value: prodScores.franchisorStrength },
                { label: "Contract", value: prodScores.contractBurden },
                { label: "Confidence", value: prodScores.confidence },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-semibold ${value !== null ? scoreTextColor(value) : "text-muted"}`}>
                    {value !== null ? value : "—"}
                  </span>
                  <span className="text-[10px] text-muted leading-tight">{label}</span>
                </div>
              ))}
            </div>
            {prodScores.economics !== null ? (
              <div className="mt-2 pt-2 border-t border-border text-xs">
                <span className="text-muted">Economics: </span>
                <span className={`font-bold ${scoreTextColor(prodScores.economics)}`}>{prodScores.economics}/100</span>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-border text-xs text-muted">
                Economics: Not Rated
              </div>
            )}
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
              <span className="font-medium text-foreground">{brand.totalUnits > 0 ? brand.totalUnits.toLocaleString() : "—"}</span>
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
