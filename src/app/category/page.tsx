import type { Metadata } from "next";
import Link from "next/link";
import { brands, categories } from "@/data/brands";
import { getOverallScore, formatCurrency } from "@/lib/types";

export const metadata: Metadata = {
  title: "Franchise Categories — Compare Investment, Scores & Unit Economics by Category",
  description:
    "Compare franchise investment requirements, FDD scores, royalty rates, and Item 19 disclosure rates across all 12 franchise categories. Independent data for serious buyers.",
  alternates: { canonical: "https://franchisel.com/category" },
  openGraph: {
    title: "Franchise Categories — Compare Investment, Scores & Unit Economics by Category",
    description:
      "Compare franchise investment requirements, FDD scores, royalty rates, and Item 19 disclosure rates across all 12 franchise categories.",
    url: "https://franchisel.com/category",
  },
};

function scoreTextColor(score: number): string {
  if (score >= 8) return "text-success";
  if (score >= 6) return "text-accent";
  if (score >= 4) return "text-warning";
  return "text-danger";
}

export default function CategoryHubPage() {
  /* Build enriched category data sorted by brand count descending */
  const enrichedCategories = categories
    .map((cat) => {
      const catBrands = brands.filter((b) => b.category === cat.slug);
      const brandCount = catBrands.length;

      /* Average investment range midpoint */
      const avgInvestmentMidpoint =
        brandCount > 0
          ? Math.round(
              catBrands.reduce(
                (sum, b) => sum + (b.totalInvestmentLow + b.totalInvestmentHigh) / 2,
                0
              ) / brandCount
            )
          : 0;

      const avgInvestmentLow =
        brandCount > 0
          ? Math.round(
              catBrands.reduce((sum, b) => sum + b.totalInvestmentLow, 0) / brandCount
            )
          : 0;

      const avgInvestmentHigh =
        brandCount > 0
          ? Math.round(
              catBrands.reduce((sum, b) => sum + b.totalInvestmentHigh, 0) / brandCount
            )
          : 0;

      const avgInvestmentRange =
        brandCount > 0
          ? `${formatCurrency(avgInvestmentLow)} – ${formatCurrency(avgInvestmentHigh)}`
          : "N/A";

      /* Average overall score */
      const avgScore =
        brandCount > 0
          ? Number(
              (
                catBrands.reduce((sum, b) => sum + getOverallScore(b.scores), 0) /
                brandCount
              ).toFixed(1)
            )
          : 0;

      /* Average royalty rate (parseable "X%" format) */
      const royaltyRates = catBrands
        .map((b) => {
          const match = b.royaltyRate.match(/([\d.]+)%/);
          return match ? parseFloat(match[1]) : null;
        })
        .filter((r): r is number => r !== null);

      const avgRoyalty =
        royaltyRates.length > 0
          ? `${(royaltyRates.reduce((a, b) => a + b, 0) / royaltyRates.length).toFixed(1)}%`
          : "Varies";

      /* Item 19 disclosure rate */
      const item19Count = catBrands.filter((b) => b.hasItem19).length;
      const item19Rate =
        brandCount > 0 ? Math.round((item19Count / brandCount) * 100) : 0;

      return {
        ...cat,
        brandCount,
        avgInvestmentRange,
        avgInvestmentMidpoint,
        avgScore,
        avgRoyalty,
        item19Rate,
      };
    })
    .filter((c) => c.brandCount > 0)
    .sort((a, b) => b.brandCount - a.brandCount);

  const totalBrands = brands.length;
  const totalCategories = enrichedCategories.length;

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Categories</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Franchise Categories
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Compare investment requirements, average scores, and growth rates across all{" "}
            {totalCategories} franchise categories
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-foreground">{totalBrands}</span>
              <span>Brands Analyzed</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-foreground">{totalCategories}</span>
              <span>Categories</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-foreground">
                {Math.round(
                  (brands.filter((b) => b.hasItem19).length / totalBrands) * 100
                )}%
              </span>
              <span>Item 19 Disclosure Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-muted mb-6">
          Showing{" "}
          <span className="font-medium text-foreground">{totalCategories}</span>{" "}
          categories with analyzed brands, sorted by brand count
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedCategories.map((cat) => (
            <div
              key={cat.slug}
              className="hover-glow block rounded-xl border border-border bg-background p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label={cat.name}>
                    {cat.icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground leading-tight">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                  </div>
                </div>
              </div>

              {/* Brand count badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-light text-accent text-xs font-medium">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    />
                  </svg>
                  {cat.brandCount} brand{cat.brandCount !== 1 ? "s" : ""} analyzed
                </span>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm flex-1">
                <div>
                  <span className="text-muted text-xs uppercase tracking-wide">
                    Avg Investment
                  </span>
                  <p className="font-medium text-foreground text-xs mt-0.5 leading-snug">
                    {cat.avgInvestmentRange}
                  </p>
                </div>
                <div>
                  <span className="text-muted text-xs uppercase tracking-wide">
                    Avg Score
                  </span>
                  <p
                    className={`font-bold text-lg mt-0.5 leading-none ${scoreTextColor(cat.avgScore)}`}
                  >
                    {cat.avgScore}
                    <span className="text-xs text-muted font-normal">/10</span>
                  </p>
                </div>
                <div>
                  <span className="text-muted text-xs uppercase tracking-wide">
                    Avg Royalty
                  </span>
                  <p className="font-medium text-foreground mt-0.5">{cat.avgRoyalty}</p>
                </div>
                <div>
                  <span className="text-muted text-xs uppercase tracking-wide">
                    Item 19 Rate
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-surface">
                      <div
                        className="h-1.5 rounded-full bg-success"
                        style={{ width: `${cat.item19Rate}%` }}
                      />
                    </div>
                    <span className="font-medium text-foreground text-xs">
                      {cat.item19Rate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 pt-4 border-t border-border">
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-medium"
                >
                  View Category
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-muted text-sm mb-4">
            Looking for a specific brand? Browse the full directory.
          </p>
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            View All Brands
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
