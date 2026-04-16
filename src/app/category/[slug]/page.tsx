import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, categories } from "@/data/brands";
import WatchButton from "@/components/WatchButton";
import {
  formatCurrency,
  formatInvestmentRange,
  categoryLabels,
  type FranchiseCategory,
} from "@/lib/types";
import { computeProductionScores } from "@/lib/diligence";

/* ── Score color helpers (0-100 scale) ── */
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

/* ── Static params ── */
export async function generateStaticParams() {
  const usedCategories = new Set(brands.map((b) => b.category));
  return Array.from(usedCategories).map((slug) => ({ slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  const categoryBrands = brands.filter((b) => b.category === slug);
  const desc = `Browse ${categoryBrands.length} ${category.name.toLowerCase()} franchise brands. Compare investment costs, FDD scores, red flags, and community reviews.`;
  return {
    title: `${category.name} Franchises`,
    description: desc,
    alternates: { canonical: `https://franchisel.com/category/${slug}` },
    openGraph: {
      title: `${category.name} Franchises`,
      description: desc,
      url: `https://franchisel.com/category/${slug}`,
    },
  };
}

/* ── Page ── */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryBrands = brands.filter((b) => b.category === slug);

  /* Compute stats */
  const brandCount = categoryBrands.length;
  const avgInvestment =
    brandCount > 0
      ? formatCurrency(
          Math.round(
            categoryBrands.reduce(
              (sum, b) => sum + (b.totalInvestmentLow + b.totalInvestmentHigh) / 2,
              0
            ) / brandCount
          )
        )
      : "N/A";

  const royaltyRates = categoryBrands
    .map((b) => {
      const match = b.royaltyRate.match(/([\d.]+)%/);
      return match ? parseFloat(match[1]) : null;
    })
    .filter((r): r is number => r !== null);
  const avgRoyalty =
    royaltyRates.length > 0
      ? `${(royaltyRates.reduce((a, b) => a + b, 0) / royaltyRates.length).toFixed(1)}%`
      : "Varies";

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/brands" className="hover:text-accent transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-4xl mb-4">{category.icon}</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {category.name} Franchises
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-light text-accent font-semibold text-xs">
                {brandCount}
              </span>
              <span>Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success-light text-success font-semibold text-xs">
                ~
              </span>
              <span>Avg Investment: {avgInvestment}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-light text-cyan font-semibold text-xs">
                %
              </span>
              <span>Avg Royalty: {avgRoyalty}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-muted mb-6">
          Showing {brandCount} brand{brandCount !== 1 ? "s" : ""} in{" "}
          <span className="font-medium text-foreground">{category.name}</span>
        </p>

        {brandCount === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">
              No brands analyzed in this category yet.
            </p>
            <Link
              href="/brands"
              className="mt-4 inline-block text-accent hover:underline text-sm"
            >
              View all brands
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryBrands.map((brand) => {
              const overall = (computeProductionScores(brand).coreDiligence ?? 0);
              const criticalFlags = brand.redFlags.filter(
                (f) => f.severity === "critical"
              ).length;
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
                      <p className="mt-1 text-xs text-muted line-clamp-2">
                        {brand.tagline}
                      </p>
                    </div>

                    {/* Overall score + watch */}
                    <div className="flex flex-col items-center ml-3 gap-1">
                      <span
                        className={`text-2xl font-bold ${scoreTextColor(overall)}`}
                      >
                        {overall}
                      </span>
                      <span className="text-[10px] text-muted uppercase tracking-wider">
                        Score
                      </span>
                      <WatchButton
                        slug={brand.slug}
                        name={brand.name}
                        snapshotScore={overall}
                        snapshotRevenue={brand.item19?.grossRevenueAvg}
                        variant="icon"
                      />
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="h-1.5 w-full rounded-full bg-surface">
                      <div
                        className={`h-1.5 rounded-full animate-fill ${scoreColor(overall)}`}
                        style={{ width: `${overall}%` }}
                      />
                    </div>
                  </div>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted text-xs">Investment</span>
                      <p className="font-medium text-foreground">
                        {formatInvestmentRange(
                          brand.totalInvestmentLow,
                          brand.totalInvestmentHigh
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Royalty</span>
                      <p className="font-medium text-foreground">
                        {brand.royaltyRate}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Total Units</span>
                      <p className="font-medium text-foreground">
                        {brand.totalUnits.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Reviews</span>
                      <p className="font-medium text-foreground">
                        {brand.communityReviews}
                      </p>
                    </div>
                  </div>

                  {/* Badges footer */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs flex-wrap">
                    {brand.hasItem19 && (
                      <span className="text-success font-medium">Item 19 ✓</span>
                    )}
                    {brand.brokerData?.usesBrokers && brand.brokerData.conflictRisk === "high" && (
                      <span className="font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">⚑ Broker</span>
                    )}
                    {brand.item21?.goingConcernWarning && (
                      <span className="font-medium px-1.5 py-0.5 rounded-full bg-danger/15 text-danger">⚠ Going Concern</span>
                    )}
                  </div>

                  {/* Red flags footer */}
                  {totalFlags > 0 && (
                    <div className="mt-1 flex items-center gap-2 text-xs">
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
                          +{totalFlags - criticalFlags} flag
                          {totalFlags - criticalFlags !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Back to directory */}
        <div className="mt-12 text-center">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to full directory
          </Link>
        </div>
      </div>
    </div>
  );
}
