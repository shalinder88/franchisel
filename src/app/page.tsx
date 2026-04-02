import Link from "next/link";
import {
  brands,
  categories,
  comparisons,
  getFeaturedBrands,
  getTopBrandsByScore,
  getActiveBrandCount,
  getTotalCommunityReviews,
  getLatestVerifiedDate,
} from "@/data/brands";
import {
  formatCurrency,
  formatInvestmentRange,
  categoryLabels,
} from "@/lib/types";
import { computeProductionScores } from "@/lib/diligence";

/* ── Helper: find a brand by slug (local) ── */
function brand(slug: string) {
  return brands.find((b) => b.slug === slug);
}

/* ── Score color helper (0-100 scale) ── */
function scoreColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 55) return "text-accent";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

export default function HomePage() {
  const featuredBrands = getFeaturedBrands();
  const topScoredBrands = getTopBrandsByScore()
    .filter(b => b.totalUnits > 0 && b.totalInvestmentLow > 0)
    .slice(0, 6);
  const recentlyAdded = [...brands]
    .sort((a, b) => (b.lastUpdated > a.lastUpdated ? 1 : -1))
    .slice(0, 6);
  const brandCount = getActiveBrandCount();
  const reviewCount = getTotalCommunityReviews();
  const verifiedDate = getLatestVerifiedDate();
  const allCategories = categories;

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. HERO
          ═══════════════════════════════════════════════════ */}
      <section className="hero-mesh border-b border-border relative overflow-hidden">
        {/* Orbital decoration */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-orbit absolute -top-48 -left-48 w-96 h-96 rounded-full border border-border/40" />
            <div className="animate-orbit-reverse absolute -top-64 -left-64 w-[32rem] h-[32rem] rounded-full border border-border/20" />
            <div className="animate-pulse-soft absolute -top-8 -left-8 w-16 h-16 rounded-full bg-accent/10" />
            <div className="animate-pulse-soft absolute top-24 left-36 w-8 h-8 rounded-full bg-cyan/10" />
            <div className="animate-pulse-soft absolute -top-32 left-20 w-12 h-12 rounded-full bg-success/10" />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-16 text-center">
          <p className="text-sm font-medium text-accent tracking-wide uppercase mb-4">
            Franchise Due Diligence Intelligence
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] max-w-4xl mx-auto">
            Know your franchise{" "}
            <span className="text-accent">before you sign.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Most franchise buyers rely on a 300-page legal document written by
            the franchisor&apos;s lawyers. We provide plain-English analysis of fees,
            obligations, red flags, and unit economics — with no franchisor funding.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition-all"
            >
              Browse Franchise Brands
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-accent/10 border border-accent text-accent font-semibold text-sm hover:bg-accent/20 transition-colors"
            >
              Compare Brands
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:border-accent hover:text-accent transition-colors"
            >
              Read Guides
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted tracking-wide">
            Independent · Buyer-aligned · No franchisor advertising
          </p>

          {/* Stats bar — horizontal inline with dividers */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-0 border border-border rounded-xl bg-surface-alt divide-x divide-border overflow-hidden max-w-2xl mx-auto">
            <div className="flex-1 min-w-[120px] px-5 py-4 text-center">
              <p className="text-xl font-bold text-foreground">{brandCount}</p>
              <p className="text-xs text-muted mt-0.5">Brands Analyzed</p>
            </div>
            <div className="flex-1 min-w-[120px] px-5 py-4 text-center">
              <p className="text-xl font-bold text-accent">
                {brands.filter(b => b.dataSource !== "industry_estimate").length}
              </p>
              <p className="text-xs text-muted mt-0.5">FDD-Sourced</p>
            </div>
            <div className="flex-1 min-w-[120px] px-5 py-4 text-center">
              <p className="text-xl font-bold text-success">{categories.length}</p>
              <p className="text-xs text-muted mt-0.5">Categories</p>
            </div>
            <div className="flex-1 min-w-[120px] px-5 py-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <p className="text-xl font-bold text-foreground">
                  {new Date(verifiedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </div>
              <p className="text-xs text-muted mt-0.5">Data Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. HOW IT WORKS
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Franchise intelligence in three steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "We analyze the FDD",
                description:
                  "Every franchise has a 200–400 page Franchise Disclosure Document. We read every line and translate it into a plain-English breakdown — fees, obligations, restrictions, and fine print.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We estimate unit economics",
                description:
                  "We compile investment ranges, fee structures, and unit growth data from public filings and industry sources. Where data is estimated rather than extracted from an FDD, we label it clearly.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "You decide with confidence",
                description:
                  "Red flags surfaced, benchmarks compared, community insights shared. Everything you need to negotiate smarter — or walk away informed.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative border border-border rounded-xl p-8 bg-surface-alt hover-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-light text-accent">
                    {item.icon}
                  </span>
                  <span className="text-xs font-bold text-muted tracking-widest uppercase">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. TOP BRANDS BY SCORE
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
                Highest Rated
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Top 6 franchises by overall score
              </h2>
              <p className="mt-2 text-sm text-muted">
                Ranked by our composite score across investment value, brand strength, support, growth, and transparency.
              </p>
            </div>
            <Link
              href="/brands"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all brands
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topScoredBrands.map((b) => {
              const overall = computeProductionScores(b).coreDiligence ?? 0;
              const criticalFlags = b.redFlags.filter(
                (f) => f.severity === "critical"
              ).length;
              const warningFlags = b.redFlags.filter(
                (f) => f.severity === "warning"
              ).length;
              const totalFlags = criticalFlags + warningFlags;

              return (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="block border border-border rounded-xl p-5 hover-glow bg-background"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {b.name}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
                        {categoryLabels[b.category]}
                      </p>
                    </div>
                    <span
                      className={`text-2xl font-bold ${scoreColor(overall)}`}
                    >
                      {overall}
                    </span>
                  </div>

                  <p className="text-sm text-muted mb-4">{b.tagline}</p>

                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="font-medium text-foreground">
                      {formatInvestmentRange(
                        b.totalInvestmentLow,
                        b.totalInvestmentHigh
                      )}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      {totalFlags > 0 ? (
                        <>
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              criticalFlags > 0 ? "bg-danger" : "bg-warning"
                            }`}
                          />
                          {totalFlags} red flag{totalFlags !== 1 && "s"}
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-success" />
                          No red flags
                        </>
                      )}
                    </span>
                    <span>
                      {b.totalUnits.toLocaleString()} units
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/brands"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all brands
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3b. RECENTLY ADDED / UPDATED
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
                Recently Updated
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Latest franchise intelligence
              </h2>
              <p className="mt-2 text-sm text-muted">
                Profiles updated from the most recent public data available.
              </p>
            </div>
            <Link
              href="/brands"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Full directory
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyAdded.map((b) => {
              const overall = computeProductionScores(b).coreDiligence ?? 0;
              const updatedLabel = new Date(b.lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
              return (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="block border border-border rounded-xl p-5 hover-glow bg-background"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{b.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{categoryLabels[b.category]}</p>
                    </div>
                    <span className={`text-2xl font-bold ${overall >= 70 ? "text-success" : overall >= 40 ? "text-warning" : "text-danger"}`}>
                      {overall}
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-4">{b.tagline}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="font-medium text-foreground">
                      {formatInvestmentRange(b.totalInvestmentLow, b.totalInvestmentHigh)}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                      </span>
                      Updated {updatedLabel}
                    </span>
                    <span>{b.totalUnits.toLocaleString()} units</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/brands" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Full directory
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. FEATURED COMPARISONS
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
              Head-to-Head
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Brand comparisons backed by data
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {comparisons.slice(0, 3).map((comp, i) => {
              const brandA = brand(comp.slugA);
              const brandB = brand(comp.slugB);
              if (!brandA || !brandB) return null;

              const scoreA = computeProductionScores(brandA).coreDiligence ?? 0;
              const scoreB = computeProductionScores(brandB).coreDiligence ?? 0;

              return (
                <Link
                  key={i}
                  href="/compare"
                  className="block border border-border rounded-xl p-6 bg-background hover-glow"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-center flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        {brandA.name}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${scoreColor(scoreA)}`}
                      >
                        {scoreA}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-muted px-3">
                      VS
                    </span>
                    <div className="text-center flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        {brandB.name}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${scoreColor(scoreB)}`}
                      >
                        {scoreB}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {comp.verdict}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Build your own comparison
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. CATEGORIES
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
              Browse by Category
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Franchise categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="block border border-border rounded-xl p-5 hover-glow bg-background text-center"
              >
                <span className="text-3xl" role="img" aria-label={cat.name}>
                  {cat.icon}
                </span>
                <h3 className="mt-3 font-semibold text-sm text-foreground">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted mt-1">
                  {cat.brandCount} brand{cat.brandCount !== 1 && "s"}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {cat.avgInvestment}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. RED FLAGS SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-surface-alt">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-danger tracking-wide uppercase mb-3">
              Red Flag Intelligence
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              What we catch that franchisors don&apos;t tell you
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Buried in hundreds of pages of legal language are the details that
              can make or break your investment. We surface them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Hidden Fee Escalation",
                description:
                  "Technology fees, marketing fund increases, and required vendor purchases that inflate your ongoing costs well beyond the royalty rate.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: "Unit Closure Trends",
                description:
                  "High turnover rates and accelerating closures that suggest franchisees are failing — data the franchisor won't volunteer in a sales pitch.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                ),
                title: "Litigation Patterns",
                description:
                  "Recurring lawsuits from franchisees — especially around earnings misrepresentation, territory encroachment, and unfair termination.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                ),
                title: "Missing Item 19",
                description:
                  "When a franchisor chooses not to disclose financial performance data, it often means the numbers don't look good. We flag the absence.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: "Territory Encroachment",
                description:
                  "Weak territory protections that allow the franchisor to open competing units — or sell online — inside your designated area.",
              },
            ].map((flag) => (
              <div
                key={flag.title}
                className="border border-border rounded-xl p-6 bg-background"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-danger-light text-danger mb-4">
                  {flag.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {flag.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {flag.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. COMMUNITY CTA
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent-light text-accent mx-auto mb-6">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Are you a franchise owner?
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            We are building a database of anonymous franchisee performance data.
            Your experience helps future buyers evaluate investment decisions with real numbers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition-all"
            >
              Share Your Experience
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:border-accent hover:text-accent transition-colors"
            >
              How verification works
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted">
            Submissions are anonymous. We do not store personally identifiable information.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. FREE TOOLS
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">Free Tools</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Run the numbers before you talk to a franchisor
            </h2>
            <p className="mt-2 text-muted max-w-xl">
              Free, independent tools to help you evaluate franchise economics. No signup required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Calculator card */}
            <Link
              href="/fdd-calculator"
              className="group flex gap-5 border border-border rounded-xl p-6 hover-glow bg-background"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center text-accent">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm2.25-4.5h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5V13.5Zm0 2.25h.008v.008H10.5v-.008Zm2.25-4.5h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75V13.5Zm0 2.25h.008v.008H12.75v-.008Zm2.25-4.5h.008v.008H15v-.008Zm0 2.25h.008v.008H15V13.5Zm0 2.25h.008v.008H15v-.008Zm2.25-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.611 4.5 4.687V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.687c0-1.076-.207-1.987-1.407-2.114A48.89 48.89 0 0 0 12 2.25Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                    FDD Financial Calculator
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-light text-success text-[10px] font-semibold">Free</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Model your own assumptions using any franchise's fee structure. Enter your revenue
                  target and cost inputs to see illustrated break-even, payback period, and cash-on-cash
                  scenarios. All outputs are assumption-based — not FDD-reported results.
                </p>
                <p className="mt-3 text-xs font-medium text-accent flex items-center gap-1">
                  Open calculator
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </p>
              </div>
            </Link>

            {/* Guides card */}
            <Link
              href="/guides"
              className="group flex gap-5 border border-border rounded-xl p-6 hover-glow bg-background"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-warning-light flex items-center justify-center text-warning">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                    FDD Due Diligence Guides
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-light text-success text-[10px] font-semibold">Free</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  8 independent guides covering how to read an FDD, what Item 19 really means, how
                  to spot litigation red flags, territorial protection, and a 50-question due
                  diligence checklist.
                </p>
                <p className="mt-3 text-xs font-medium text-accent flex items-center gap-1">
                  Read the guides
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. REPORT PRICING
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-surface-alt">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
              Due Diligence Reports
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Know what you&apos;re buying before you sign
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Every report is independently researched. No franchisor
              influence, no affiliate commissions, no conflicts of interest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Standard Report",
                price: 99,
                popular: false,
                features: [
                  "Plain-English FDD summary",
                  "Fee structure breakdown",
                  "Red flags identified",
                  "Litigation summary",
                  "Unit growth/churn analysis",
                  "Territory analysis",
                ],
              },
              {
                name: "Premium Report",
                price: 199,
                popular: true,
                features: [
                  "Everything in Standard",
                  "Item 19 financial analysis",
                  "Community performance data",
                  "Category benchmarks & comparison",
                  "Year-over-year FDD changes",
                  "Franchisee satisfaction data",
                ],
              },
              {
                name: "Executive Report",
                price: 249,
                popular: false,
                features: [
                  "Everything in Premium",
                  "Personalized risk assessment",
                  "Investment scenario modeling",
                  "Exit strategy analysis",
                  "Comparable brand recommendations",
                  "30-minute expert consultation",
                ],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`relative border rounded-xl p-8 hover-pricing ${
                  tier.popular
                    ? "border-accent bg-background shadow-sm"
                    : "border-border bg-background"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-muted ml-1">per brand</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <svg
                        className="w-4 h-4 text-success mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/reports"
                  className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-all ${
                    tier.popular
                      ? "bg-accent text-white hover:brightness-110"
                      : "border border-border text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  Get This Report
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          10. TRUST SECTION
          ═══════════════════════════════════════════════════ */}
      <section>
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-success tracking-wide uppercase mb-3">
              Data Integrity
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Our commitment to franchise buyers
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "FDD-Sourced Data",
                description:
                  "Every data point traces back to an actual Franchise Disclosure Document filed with state regulators. No estimates, no projections.",
              },
              {
                title: "No Franchisor Influence",
                description:
                  "We don't accept advertising, sponsorships, or referral fees from franchisors. Our revenue comes from reports purchased by buyers.",
              },
              {
                title: "Community-Reported Labels",
                description:
                  "Performance data tagged as community-reported is always clearly labeled. You know exactly where every number comes from.",
              },
              {
                title: "Independent Verification",
                description:
                  "Community submissions are verified against Item 20 unit counts and public filings. Unverified data is flagged accordingly.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success-light text-success shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/disclosure"
              className="text-sm text-accent font-medium hover:underline"
            >
              Read our full disclosure and methodology
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
