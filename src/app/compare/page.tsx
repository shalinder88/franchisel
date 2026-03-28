import Link from "next/link";
import { brands, comparisons, getBrandBySlug } from "@/data/brands";
import { getOverallScore, formatCurrency, formatInvestmentRange, categoryLabels } from "@/lib/types";
import type { FranchiseBrand } from "@/lib/types";
import type { Metadata } from "next";
import BrandSelector from "@/components/BrandSelector";

export const metadata: Metadata = {
  title: "Compare Franchise Brands",
  description:
    "Side-by-side franchise comparisons backed by FDD data. Compare investment costs, revenue, royalties, unit growth, and overall scores.",
};

/* ── Score bar component (ScoreAxis-style) ── */
function ScoreBar({ label, scoreA, scoreB, nameA, nameB }: {
  label: string;
  scoreA: number;
  scoreB: number;
  nameA: string;
  nameB: string;
}) {
  const maxScore = 10;
  const pctA = (scoreA / maxScore) * 100;
  const pctB = (scoreB / maxScore) * 100;

  return (
    <div className="hover-score-row">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted">{nameA}: {scoreA}</span>
        <span className="text-[11px] font-semibold text-foreground">{label}</span>
        <span className="text-xs font-medium text-muted">{nameB}: {scoreB}</span>
      </div>
      <div className="flex items-center gap-1">
        {/* Brand A bar (grows right to left) */}
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden flex justify-end">
          <div
            className="h-full bg-accent rounded-full animate-fill"
            style={{ width: `${pctA}%` }}
          />
        </div>
        <div className="w-px h-4 bg-border-strong shrink-0" />
        {/* Brand B bar (grows left to right) */}
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan rounded-full animate-fill"
            style={{ width: `${pctB}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Metric row ── */
function MetricRow({ label, valueA, valueB }: {
  label: string;
  valueA: string;
  valueB: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover-item">
      <span className="text-sm text-foreground font-medium w-1/3 text-left">{valueA}</span>
      <span className="text-[11px] font-semibold text-muted uppercase tracking-wider w-1/3 text-center">{label}</span>
      <span className="text-sm text-foreground font-medium w-1/3 text-right">{valueB}</span>
    </div>
  );
}

/* ── Comparison table row with winner highlight ── */
function CompareRow({
  label,
  valueA,
  valueB,
  winnerSide,
  hint,
}: {
  label: string;
  valueA: string;
  valueB: string;
  winnerSide?: "A" | "B" | "tie" | null;
  hint?: string;
}) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-3 px-4 sm:px-6">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wider">{label}</div>
        {hint && <div className="text-[10px] text-muted/70 mt-0.5">{hint}</div>}
      </td>
      <td
        className={`py-3 px-4 sm:px-6 text-sm font-medium text-center ${
          winnerSide === "A" ? "bg-success/5 text-success font-semibold" : "text-foreground"
        }`}
      >
        {winnerSide === "A" && (
          <span className="inline-block mr-1.5 text-success text-xs">▲</span>
        )}
        {valueA}
      </td>
      <td
        className={`py-3 px-4 sm:px-6 text-sm font-medium text-center ${
          winnerSide === "B" ? "bg-success/5 text-success font-semibold" : "text-foreground"
        }`}
      >
        {winnerSide === "B" && (
          <span className="inline-block mr-1.5 text-success text-xs">▲</span>
        )}
        {valueB}
      </td>
    </tr>
  );
}

/* ── Determine numeric winner ── */
function winner(a: number | null, b: number | null, higherIsBetter: boolean): "A" | "B" | "tie" | null {
  if (a === null || b === null) return null;
  if (a === b) return "tie";
  if (higherIsBetter) return a > b ? "A" : "B";
  return a < b ? "A" : "B";
}

/* ── Full dynamic comparison table ── */
function DynamicComparison({ brandA, brandB }: { brandA: FranchiseBrand; brandB: FranchiseBrand }) {
  const scoreA = getOverallScore(brandA.scores);
  const scoreB = getOverallScore(brandB.scores);

  const investLowA = brandA.totalInvestmentLow;
  const investLowB = brandB.totalInvestmentLow;
  const investHighA = brandA.totalInvestmentHigh;
  const investHighB = brandB.totalInvestmentHigh;
  const investMidA = (investLowA + investHighA) / 2;
  const investMidB = (investLowB + investHighB) / 2;

  const royaltyNumA = parseFloat(brandA.royaltyRate);
  const royaltyNumB = parseFloat(brandB.royaltyRate);
  const marketingNumA = parseFloat(brandA.marketingFundRate);
  const marketingNumB = parseFloat(brandB.marketingFundRate);

  const revenueA = brandA.item19?.grossRevenueAvg ?? null;
  const revenueB = brandB.item19?.grossRevenueAvg ?? null;

  const redFlagCountA = brandA.redFlags.length;
  const redFlagCountB = brandB.redFlags.length;

  return (
    <div className="border border-border rounded-2xl bg-background overflow-hidden hover-glow animate-fade-up">
      {/* Header */}
      <div className="bg-surface-alt border-b border-border px-6 py-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {brandA.name.charAt(0)}
            </div>
            <div>
              <Link href={`/brands/${brandA.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                {brandA.name}
              </Link>
              <p className="text-xs text-muted">{categoryLabels[brandA.category]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-accent">{scoreA}</span>
            <div className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-muted uppercase tracking-wider">
              vs
            </div>
            <span className="text-2xl font-black text-cyan">{scoreB}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <Link href={`/brands/${brandB.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                {brandB.name}
              </Link>
              <p className="text-xs text-muted">{categoryLabels[brandB.category]}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm">
              {brandB.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="py-3 px-4 sm:px-6 text-left text-[11px] font-bold text-muted uppercase tracking-wider w-1/3">Metric</th>
              <th className="py-3 px-4 sm:px-6 text-center text-[11px] font-bold text-accent uppercase tracking-wider w-1/3">
                {brandA.name}
              </th>
              <th className="py-3 px-4 sm:px-6 text-center text-[11px] font-bold text-cyan uppercase tracking-wider w-1/3">
                {brandB.name}
              </th>
            </tr>
          </thead>
          <tbody>
            <CompareRow
              label="Overall Score"
              valueA={`${scoreA} / 10`}
              valueB={`${scoreB} / 10`}
              winnerSide={winner(scoreA, scoreB, true)}
              hint="Weighted composite score"
            />
            <CompareRow
              label="Total Investment"
              valueA={formatInvestmentRange(investLowA, investHighA)}
              valueB={formatInvestmentRange(investLowB, investHighB)}
              winnerSide={winner(investMidA, investMidB, false)}
              hint="Lower midpoint is better"
            />
            <CompareRow
              label="Royalty Rate"
              valueA={brandA.royaltyRate}
              valueB={brandB.royaltyRate}
              winnerSide={
                !isNaN(royaltyNumA) && !isNaN(royaltyNumB)
                  ? winner(royaltyNumA, royaltyNumB, false)
                  : null
              }
              hint="Lower is better"
            />
            <CompareRow
              label="Marketing Fund"
              valueA={brandA.marketingFundRate}
              valueB={brandB.marketingFundRate}
              winnerSide={
                !isNaN(marketingNumA) && !isNaN(marketingNumB)
                  ? winner(marketingNumA, marketingNumB, false)
                  : null
              }
              hint="Lower is better"
            />
            <CompareRow
              label="Item 19 Avg Revenue"
              valueA={revenueA !== null ? formatCurrency(revenueA) : "Not Disclosed"}
              valueB={revenueB !== null ? formatCurrency(revenueB) : "Not Disclosed"}
              winnerSide={winner(revenueA, revenueB, true)}
              hint="Higher is better"
            />
            <CompareRow
              label="Total Units"
              valueA={brandA.totalUnits.toLocaleString()}
              valueB={brandB.totalUnits.toLocaleString()}
              winnerSide={winner(brandA.totalUnits, brandB.totalUnits, true)}
              hint="Larger network = stronger brand"
            />
            <CompareRow
              label="Net Unit Growth"
              valueA={
                brandA.unitEconomics.netGrowth >= 0
                  ? `+${brandA.unitEconomics.netGrowth}`
                  : `${brandA.unitEconomics.netGrowth}`
              }
              valueB={
                brandB.unitEconomics.netGrowth >= 0
                  ? `+${brandB.unitEconomics.netGrowth}`
                  : `${brandB.unitEconomics.netGrowth}`
              }
              winnerSide={winner(brandA.unitEconomics.netGrowth, brandB.unitEconomics.netGrowth, true)}
              hint="Net new units in period"
            />
            <CompareRow
              label="Red Flags"
              valueA={`${redFlagCountA} flag${redFlagCountA !== 1 ? "s" : ""}`}
              valueB={`${redFlagCountB} flag${redFlagCountB !== 1 ? "s" : ""}`}
              winnerSide={winner(redFlagCountA, redFlagCountB, false)}
              hint="Fewer is better"
            />
            <CompareRow
              label="Franchisee Support"
              valueA={`${brandA.scores.franchiseeSupport} / 10`}
              valueB={`${brandB.scores.franchiseeSupport} / 10`}
              winnerSide={winner(brandA.scores.franchiseeSupport, brandB.scores.franchiseeSupport, true)}
            />
            <CompareRow
              label="Financial Transparency"
              valueA={`${brandA.scores.financialTransparency} / 10`}
              valueB={`${brandB.scores.financialTransparency} / 10`}
              winnerSide={winner(brandA.scores.financialTransparency, brandB.scores.financialTransparency, true)}
            />
          </tbody>
        </table>
      </div>

      {/* Score breakdown bars */}
      <div className="px-6 py-6 sm:px-8 border-t border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Score Breakdown</h3>
        <div className="space-y-3">
          <ScoreBar label="Investment Value" scoreA={brandA.scores.investmentValue} scoreB={brandB.scores.investmentValue} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Franchisee Support" scoreA={brandA.scores.franchiseeSupport} scoreB={brandB.scores.franchiseeSupport} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Transparency" scoreA={brandA.scores.financialTransparency} scoreB={brandB.scores.financialTransparency} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Unit Growth" scoreA={brandA.scores.unitGrowth} scoreB={brandB.scores.unitGrowth} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Brand Strength" scoreA={brandA.scores.brandStrength} scoreB={brandB.scores.brandStrength} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Territory" scoreA={brandA.scores.territoryProtection} scoreB={brandB.scores.territoryProtection} nameA={brandA.name} nameB={brandB.name} />
        </div>
      </div>

      {/* Links */}
      <div className="px-6 pb-6 sm:px-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={`/brands/${brandA.slug}`}
          className="text-sm font-semibold text-accent hover:underline"
        >
          View {brandA.name} Profile &rarr;
        </Link>
        <span className="hidden sm:inline text-border">|</span>
        <Link
          href={`/brands/${brandB.slug}`}
          className="text-sm font-semibold text-accent hover:underline"
        >
          View {brandB.name} Profile &rarr;
        </Link>
      </div>
    </div>
  );
}

/* ── Page ── */
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ brandA?: string; brandB?: string }>;
}) {
  const params = await searchParams;
  const slugA = params.brandA ?? "";
  const slugB = params.brandB ?? "";

  const activeBrandA = slugA ? getBrandBySlug(slugA) : null;
  const activeBrandB = slugB ? getBrandBySlug(slugB) : null;
  const hasCustomComparison = !!(activeBrandA && activeBrandB);

  // Build sorted brand list for selectors
  const brandOptions = [...brands]
    .map((b) => ({ slug: b.slug, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            FDD-Backed Comparisons
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Compare Franchise Brands
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Side-by-side comparisons of investment costs, revenue potential, unit growth, and franchisee
            satisfaction — all sourced from actual Franchise Disclosure Documents.
          </p>
        </div>
      </section>

      {/* ── Build Your Own Comparison ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Build Your Own Comparison</h2>
          <p className="mt-2 text-sm text-muted">
            Select any two franchise brands for an instant side-by-side analysis.
          </p>
        </div>
        <BrandSelector
          brands={brandOptions}
          initialA={slugA}
          initialB={slugB}
        />
      </section>

      {/* ── Dynamic comparison result ── */}
      {hasCustomComparison && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DynamicComparison brandA={activeBrandA} brandB={activeBrandB} />
        </section>
      )}

      {/* ── Invalid slug warning ── */}
      {(slugA || slugB) && !hasCustomComparison && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl bg-warning-light border border-warning/20 px-6 py-4 text-sm text-foreground">
            {!activeBrandA && slugA && (
              <p>Could not find brand &ldquo;{slugA}&rdquo;. Please select a valid brand from the dropdowns above.</p>
            )}
            {!activeBrandB && slugB && (
              <p>Could not find brand &ldquo;{slugB}&rdquo;. Please select a valid brand from the dropdowns above.</p>
            )}
          </div>
        </section>
      )}

      {/* ── Pre-built comparisons (only shown when no custom comparison) ── */}
      {!hasCustomComparison && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-foreground">Featured Comparisons</h2>
            <p className="mt-2 text-sm text-muted">Data-driven head-to-head analysis of popular franchise brands.</p>
          </div>

          <div className="space-y-12">
            {comparisons.map((comp, idx) => {
              const brandA = getBrandBySlug(comp.slugA);
              const brandB = getBrandBySlug(comp.slugB);
              if (!brandA || !brandB) return null;

              const scoreA = getOverallScore(brandA.scores);
              const scoreB = getOverallScore(brandB.scores);

              return (
                <div
                  key={idx}
                  className="border border-border rounded-2xl bg-background overflow-hidden hover-glow"
                >
                  {/* Header */}
                  <div className="bg-surface-alt border-b border-border px-6 py-5 sm:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                          {brandA.name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/brands/${brandA.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                            {brandA.name}
                          </Link>
                          <p className="text-xs text-muted">{categoryLabels[brandA.category]}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-accent">{scoreA}</span>
                        <div className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-muted uppercase tracking-wider">
                          vs
                        </div>
                        <span className="text-2xl font-black text-cyan">{scoreB}</span>
                      </div>

                      <div className="flex items-center gap-3 text-center sm:text-right">
                        <div>
                          <Link href={`/brands/${brandB.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                            {brandB.name}
                          </Link>
                          <p className="text-xs text-muted">{categoryLabels[brandB.category]}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm">
                          {brandB.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-6 sm:px-8">
                    {/* Key metrics */}
                    <div className="mb-6">
                      <MetricRow
                        label="Investment"
                        valueA={formatInvestmentRange(brandA.totalInvestmentLow, brandA.totalInvestmentHigh)}
                        valueB={formatInvestmentRange(brandB.totalInvestmentLow, brandB.totalInvestmentHigh)}
                      />
                      <MetricRow
                        label="Avg Revenue"
                        valueA={brandA.item19?.grossRevenueAvg ? formatCurrency(brandA.item19.grossRevenueAvg) : "Not disclosed"}
                        valueB={brandB.item19?.grossRevenueAvg ? formatCurrency(brandB.item19.grossRevenueAvg) : "Not disclosed"}
                      />
                      <MetricRow
                        label="Total Units"
                        valueA={brandA.totalUnits.toLocaleString()}
                        valueB={brandB.totalUnits.toLocaleString()}
                      />
                      <MetricRow
                        label="Royalty"
                        valueA={brandA.royaltyRate}
                        valueB={brandB.royaltyRate}
                      />
                    </div>

                    {/* Score comparison bars */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Score Breakdown</h3>
                      <ScoreBar label="Investment Value" scoreA={brandA.scores.investmentValue} scoreB={brandB.scores.investmentValue} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Franchisee Support" scoreA={brandA.scores.franchiseeSupport} scoreB={brandB.scores.franchiseeSupport} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Transparency" scoreA={brandA.scores.financialTransparency} scoreB={brandB.scores.financialTransparency} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Unit Growth" scoreA={brandA.scores.unitGrowth} scoreB={brandB.scores.unitGrowth} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Brand Strength" scoreA={brandA.scores.brandStrength} scoreB={brandB.scores.brandStrength} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Territory" scoreA={brandA.scores.territoryProtection} scoreB={brandB.scores.territoryProtection} nameA={brandA.name} nameB={brandB.name} />
                    </div>

                    {/* Verdict */}
                    <div className="bg-surface rounded-xl p-4 border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Verdict</p>
                          <p className="text-sm text-foreground leading-relaxed">{comp.verdict}</p>
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    {comp.highlights.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {comp.highlights.map((h, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface text-xs text-muted border border-border/50">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                      <Link
                        href={`/brands/${brandA.slug}`}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        View {brandA.name} Profile &rarr;
                      </Link>
                      <span className="hidden sm:inline text-border">|</span>
                      <Link
                        href={`/brands/${brandB.slug}`}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        View {brandB.name} Profile &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── All brands by category ── */}
      <section className="border-t border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Browse by Category</h2>
          <p className="text-sm text-muted mb-8">Select a brand from any category to begin comparing.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(brands.map((b) => b.category))).map((cat) => {
              const catBrands = brands.filter((b) => b.category === cat);
              return (
                <div key={cat} className="border border-border rounded-xl bg-background p-5 hover-glow">
                  <h3 className="text-sm font-bold text-foreground mb-3">{categoryLabels[cat]}</h3>
                  <div className="space-y-2">
                    {catBrands.map((b) => (
                      <Link
                        key={b.slug}
                        href={`/brands/${b.slug}`}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface transition-colors group"
                      >
                        <span className="text-sm text-foreground group-hover:text-accent transition-colors">{b.name}</span>
                        <span className="text-xs font-mono font-bold text-accent">{getOverallScore(b.scores)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">Want a Custom Comparison?</h2>
          <p className="mt-3 text-muted leading-relaxed">
            Need a detailed side-by-side analysis of two specific franchise brands not shown here?
            Our research team can prepare a custom comparison report based on the latest FDD filings.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:research@franchisel.com?subject=Custom%20Comparison%20Request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Contact Us
            </a>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-semibold text-foreground rounded-xl hover:bg-surface transition-all"
            >
              View Reports
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
