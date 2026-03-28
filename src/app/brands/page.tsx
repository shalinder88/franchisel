import Link from "next/link";
import { brands, categories } from "@/data/brands";
import {
  getOverallScore,
  formatCurrency,
  formatInvestmentRange,
  categoryLabels,
  type FranchiseCategory,
} from "@/lib/types";

export const metadata = {
  title: "Franchise Directory — Browse & Compare Franchise Brands",
  description:
    "Browse our independent franchise directory. Compare investment costs, FDD scores, red flags, and community reviews across top franchise brands.",
  alternates: { canonical: "https://franchisel.com/brands" },
  openGraph: {
    title: "Franchise Directory — Browse & Compare Franchise Brands",
    description:
      "Browse our independent franchise directory. Compare investment costs, FDD scores, red flags, and community reviews across top franchise brands.",
    url: "https://franchisel.com/brands",
  },
};

/* ── Score color helper ── */
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

/* ── Page ── */
export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "all";
  const searchQuery = (params.q || "").toLowerCase().trim();

  const categoryFiltered =
    activeCategory === "all"
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  const filteredBrands = searchQuery
    ? categoryFiltered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery) ||
          b.description.toLowerCase().includes(searchQuery) ||
          b.tagline.toLowerCase().includes(searchQuery) ||
          b.category.toLowerCase().includes(searchQuery) ||
          (b.subcategory?.toLowerCase().includes(searchQuery) ?? false)
      )
    : categoryFiltered;

  /* Stats */
  const totalBrands = brands.length;
  const usedCategories = new Set(brands.map((b) => b.category));
  const totalCategories = usedCategories.size;

  /* Category Insights — computed from filtered brands */
  let categoryInsights: {
    avgInvestmentLow: number;
    avgInvestmentHigh: number;
    avgOverallScore: number;
    avgRoyaltyPct: number | null;
    item19Count: number;
    noItem19Count: number;
  } | null = null;

  if (activeCategory !== "all" && categoryFiltered.length > 0) {
    const avgInvestmentLow =
      Math.round(
        categoryFiltered.reduce((s, b) => s + b.totalInvestmentLow, 0) /
          categoryFiltered.length
      );
    const avgInvestmentHigh =
      Math.round(
        categoryFiltered.reduce((s, b) => s + b.totalInvestmentHigh, 0) /
          categoryFiltered.length
      );
    const avgOverallScore =
      Math.round(
        (categoryFiltered.reduce((s, b) => s + getOverallScore(b.scores), 0) /
          categoryFiltered.length) *
          10
      ) / 10;

    const pctRoyaltyBrands = categoryFiltered.filter(
      (b) =>
        b.royaltyStructure === "percentage" &&
        /^\d+(\.\d+)?%$/.test(b.royaltyRate.trim())
    );
    const avgRoyaltyPct =
      pctRoyaltyBrands.length > 0
        ? Math.round(
            (pctRoyaltyBrands.reduce(
              (s, b) => s + parseFloat(b.royaltyRate),
              0
            ) /
              pctRoyaltyBrands.length) *
              10
          ) / 10
        : null;

    const item19Count = categoryFiltered.filter((b) => b.hasItem19).length;
    const noItem19Count = categoryFiltered.length - item19Count;

    categoryInsights = {
      avgInvestmentLow,
      avgInvestmentHigh,
      avgOverallScore,
      avgRoyaltyPct,
      item19Count,
      noItem19Count,
    };
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Franchise Directory
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Independent FDD analysis and due diligence intelligence across{" "}
            <span className="font-semibold text-foreground">{totalBrands} brands</span> in{" "}
            <span className="font-semibold text-foreground">{totalCategories} categories</span>.
            Every score backed by public FDD filings.
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-light text-accent font-semibold text-xs">
                {totalBrands}
              </span>
              <span>Brands Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success-light text-success font-semibold text-xs">
                {brands.filter(b => b.dataSource !== "industry_estimate").length}
              </span>
              <span>Officially Sourced</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-light text-cyan font-semibold text-xs">
                {totalCategories}
              </span>
              <span>Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/brands"
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCategory === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted border-border hover:border-accent hover:text-accent"
            }`}
          >
            All Brands
          </Link>
          {categories
            .filter((c) => c.brandCount > 0)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/brands?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat.slug
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted border-border hover:border-accent hover:text-accent"
                }`}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
        </div>

        {/* Category Insights — shown when a specific category is selected */}
        {categoryInsights && (
          <div className="mb-8 rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              {categoryLabels[activeCategory as FranchiseCategory]} — Category Insights
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">Avg Investment Range</p>
                <p className="text-base font-semibold text-foreground">
                  {formatInvestmentRange(
                    categoryInsights.avgInvestmentLow,
                    categoryInsights.avgInvestmentHigh
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Avg Overall Score</p>
                <p className="text-base font-semibold text-foreground">
                  {categoryInsights.avgOverallScore}
                  <span className="text-xs text-muted font-normal"> / 10</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Avg Royalty Rate</p>
                <p className="text-base font-semibold text-foreground">
                  {categoryInsights.avgRoyaltyPct !== null
                    ? `${categoryInsights.avgRoyaltyPct}%`
                    : "Varies"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Item 19 Disclosed</p>
                <p className="text-base font-semibold text-foreground">
                  {categoryInsights.item19Count}
                  <span className="text-xs text-muted font-normal">
                    {" "}/ {categoryInsights.item19Count + categoryInsights.noItem19Count}
                  </span>
                </p>
                {categoryInsights.noItem19Count > 0 && (
                  <p className="text-xs text-warning mt-0.5">
                    {categoryInsights.noItem19Count} without Item 19
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results count + search indicator */}
        <div className="mb-6">
          {searchQuery && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-foreground">
                Results for &ldquo;{params.q}&rdquo;
              </span>
              <a href="/brands" className="text-xs text-accent hover:underline">Clear search</a>
            </div>
          )}
          <p className="text-sm text-muted">
            Showing {filteredBrands.length} brand{filteredBrands.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && (
              <>
                {" "}in{" "}
                <span className="font-medium text-foreground">
                  {categoryLabels[activeCategory as FranchiseCategory]}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Brand grid */}
        {filteredBrands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No brands found in this category yet.</p>
            <Link href="/brands" className="mt-4 inline-block text-accent hover:underline text-sm">
              View all brands
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => {
              const overall = getOverallScore(brand.scores);
              const criticalFlags = brand.redFlags.filter((f) => f.severity === "critical").length;
              const totalFlags = brand.redFlags.length;

              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="hover-glow block rounded-xl border border-border bg-background p-6"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-foreground truncate">
                        {brand.name}
                      </h2>
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface text-muted border border-border">
                        {categoryLabels[brand.category]}
                      </span>
                    </div>

                    {/* Overall score */}
                    <div className="flex flex-col items-center ml-3">
                      <span
                        className={`text-2xl font-bold ${scoreTextColor(overall)}`}
                      >
                        {overall}
                      </span>
                      <span className="text-[10px] text-muted uppercase tracking-wider">
                        Score
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="h-1.5 w-full rounded-full bg-surface">
                      <div
                        className={`h-1.5 rounded-full animate-fill ${scoreColor(overall)}`}
                        style={{ width: `${overall * 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Key metrics */}
                  {brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing" ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted text-xs">Investment</span>
                      <p className="font-medium text-foreground">
                        {formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Royalty</span>
                      <p className="font-medium text-foreground filter blur-[4px] select-none">{brand.royaltyRate}</p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Total Units</span>
                      <p className="font-medium text-foreground">
                        {brand.totalUnits.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Source</span>
                      <p className="font-medium text-xs text-success">Gov FDD ✓</p>
                    </div>
                  </div>
                  ) : (
                  <div className="mt-2 py-3 rounded-lg bg-surface border border-border text-center">
                    <p className="text-xs text-muted">FDD data verification pending</p>
                    <p className="text-xs text-accent mt-0.5">Gov source only</p>
                  </div>
                  )}

                  {/* Red flags & reviews footer */}
                  {(brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing") && totalFlags > 0 && (
                    <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs">
                      {criticalFlags > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-light text-danger font-medium">
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
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                            />
                          </svg>
                          {criticalFlags} critical
                        </span>
                      )}
                      {totalFlags - criticalFlags > 0 && (
                        <span className="text-muted">
                          +{totalFlags - criticalFlags} flag{totalFlags - criticalFlags !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
