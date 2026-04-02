import Link from "next/link";
import { brands, categories } from "@/data/brands";
import {
  formatInvestmentRange,
  categoryLabels,
  type FranchiseCategory,
} from "@/lib/types";
import { computeProductionScores } from "@/lib/diligence";
import BrandsClient from "./BrandsClient";

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

/* ── Page ── */
export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; hasYoY?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "all";
  const searchQuery = (params.q || "").toLowerCase().trim();
  const initialHasYoY = params.hasYoY === "true";

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
        (categoryFiltered.reduce((s, b) => s + (computeProductionScores(b).coreDiligence ?? 0), 0) /
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
                  <span className="text-xs text-muted font-normal"> / 100</span>
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

        {/* Search result indicator */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-foreground">
              Results for &ldquo;{params.q}&rdquo;
            </span>
            <a href="/brands" className="text-xs text-accent hover:underline">Clear search</a>
          </div>
        )}

        {/* Interactive filter/sort + brand grid */}
        <BrandsClient brands={filteredBrands} initialHasYoY={initialHasYoY} />
      </div>
    </div>
  );
}
