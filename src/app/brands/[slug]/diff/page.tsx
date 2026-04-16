import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBrandBySlug } from "@/data/brands";
import { formatCurrency } from "@/lib/types";
import UnitGrowthChart from "@/components/UnitGrowthChart";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Not Found" };
  return {
    title: `${brand.name} \u2014 Filing Year Changes`,
    description: `Year-over-year FDD filing changes for ${brand.name}: revenue trends, unit growth, fee changes. Sourced from government-filed FDDs.`,
    alternates: { canonical: `https://franchisel.com/brands/${slug}/diff` },
  };
}

function DiffArrow({ pct, direction = "up_is_good" }: { pct: number; direction?: "up_is_good" | "down_is_good" }) {
  const isPositive = pct >= 0;
  const isGood = direction === "up_is_good" ? isPositive : !isPositive;
  return (
    <span className={`inline-flex items-center gap-1 font-bold tabular-nums ${isGood ? "text-success" : "text-danger"}`}>
      {isPositive ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function DiffCard({ label, prior, current, priorYear, currentYear, unit = "$", direction = "up_is_good" }: {
  label: string;
  prior: number;
  current: number;
  priorYear: number | string;
  currentYear: number | string;
  unit?: "$" | "%" | "units";
  direction?: "up_is_good" | "down_is_good";
}) {
  const pct = prior > 0 ? ((current - prior) / prior) * 100 : 0;
  const isPositive = pct >= 0;
  const isGood = direction === "up_is_good" ? isPositive : !isPositive;

  function fmt(v: number) {
    if (unit === "$") return formatCurrency(v);
    if (unit === "%") return `${v}%`;
    return v > 0 ? `+${v}` : `${v}`;
  }

  return (
    <div className={`rounded-xl border p-5 ${isGood ? "border-success/20 bg-success/5" : "border-danger/20 bg-danger/5"}`}>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">{label}</p>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-center min-w-[80px]">
          <p className="text-[11px] text-muted mb-0.5">{priorYear} FDD</p>
          <p className="text-xl font-bold text-foreground">{fmt(prior)}</p>
        </div>
        <div className={`text-3xl font-bold ${isGood ? "text-success" : "text-danger"}`}>
          {isPositive ? "→" : "→"}
        </div>
        <div className="text-center min-w-[80px]">
          <p className="text-[11px] text-muted mb-0.5">{currentYear} FDD</p>
          <p className="text-xl font-bold text-foreground">{fmt(current)}</p>
        </div>
        <div className={`ml-auto rounded-lg px-4 py-2 ${isGood ? "bg-success/10 border border-success/20" : "bg-danger/10 border border-danger/20"}`}>
          <p className={`text-2xl font-bold ${isGood ? "text-success" : "text-danger"}`}>
            {isPositive ? "+" : "−"}{Math.abs(pct).toFixed(1)}%
          </p>
          <p className="text-xs text-muted text-center">YoY change</p>
        </div>
      </div>
    </div>
  );
}

export default async function FilingDiffPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const isGovVerified = brand.dataSource === "state_filing" || brand.dataSource === "fdd_verified";
  if (!isGovVerified) notFound(); // diff page only for verified brands

  const hasRevenueDiff = !!(brand.item19Prior?.grossRevenueAvg && brand.item19?.grossRevenueAvg);
  const hasUnitGrowth = !!(brand.unitEconomics?.yearlyNetGrowth && brand.unitEconomics.yearlyNetGrowth.length >= 2);

  if (!hasRevenueDiff && !hasUnitGrowth) notFound();

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const unitData = brand.unitEconomics?.yearlyNetGrowth ?? [];

  // Compute unit totals for diff if we have at least 2 years
  const unitDiff = unitData.length >= 2 ? {
    prior: unitData[0],
    current: unitData[unitData.length - 1],
  } : null;

  const trend = unitData.length >= 2
    ? (unitData[unitData.length - 1].net > unitData[0].net ? "improving" : unitData[unitData.length - 1].net < unitData[0].net ? "declining" : "stable")
    : null;

  return (
    <div className="min-h-screen">
      {/* Print header */}
      <div className="hidden print:block px-8 py-4 border-b">
        <p className="text-lg font-bold">{brand.name} — FDD Filing Changes</p>
        <p className="text-sm text-gray-600">Source: {brand.fddYear} government-filed FDD · Generated {today}</p>
      </div>

      {/* Nav */}
      <div className="border-b border-border bg-surface-alt print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-accent">Brands</Link>
            <span>/</span>
            <Link href={`/brands/${slug}`} className="hover:text-accent">{brand.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Filing Changes</span>
          </nav>
          <PrintButton />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20">
              Filing Year Comparison
            </span>
            <span className="text-xs text-muted">Source: government-filed FDDs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{brand.name} — What Changed</h1>
          <p className="text-muted mt-1 text-sm">
            Year-over-year changes across FDD filings. Every figure is sourced from government-filed Franchise Disclosure Documents.
            Changes flagged here reflect actual disclosed data — not estimates.
          </p>
        </div>

        {/* Revenue diff */}
        {hasRevenueDiff && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Item 19 — Revenue Performance</h2>
            <DiffCard
              label="Average Gross Revenue (Item 19)"
              prior={brand.item19Prior!.grossRevenueAvg!}
              current={brand.item19!.grossRevenueAvg!}
              priorYear={brand.item19Prior!.fddYear ?? "Prior"}
              currentYear={brand.fddYear}
              unit="$"
              direction="up_is_good"
            />
            <div className="rounded-lg border border-border bg-surface p-4 text-xs text-muted leading-relaxed">
              <strong className="text-foreground">What this means:</strong> A rising average revenue figure suggests the system is performing better at the unit level, though it may also reflect closures of underperforming units rather than improvement. Verify the Item 19 basis and sample size in both filing years.
            </div>
          </section>
        )}

        {/* Unit growth chart */}
        {hasUnitGrowth && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Item 20 — Net Unit Growth</h2>
              {trend && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  trend === "improving" ? "text-success bg-success/10 border-success/20" :
                  trend === "declining" ? "text-danger bg-danger/10 border-danger/20" :
                  "text-muted bg-surface border-border"
                }`}>
                  {trend === "improving" ? "↑ Trend improving" : trend === "declining" ? "↓ Trend declining" : "→ Stable"}
                </span>
              )}
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs text-muted mb-4">Net units opened minus closed per year. Positive = system grew. Negative = system shrank.</p>
              <div className="flex items-end gap-4">
                <UnitGrowthChart data={unitData} height={100} />
                <div className="ml-auto text-right shrink-0 space-y-2">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Most recent</p>
                    <p className={`text-2xl font-bold ${unitData[unitData.length-1].net > 0 ? "text-success" : unitData[unitData.length-1].net < 0 ? "text-danger" : "text-muted"}`}>
                      {unitData[unitData.length-1].net > 0 ? "+" : ""}{unitData[unitData.length-1].net}
                    </p>
                    <p className="text-xs text-muted">net units {unitData[unitData.length-1].year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted uppercase tracking-wider">Year</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted uppercase tracking-wider">Opened</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted uppercase tracking-wider">Closed</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted uppercase tracking-wider">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {[...unitData].reverse().map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-foreground">{row.year}</td>
                      <td className="px-5 py-3 text-right text-success font-medium">+{row.opened}</td>
                      <td className="px-5 py-3 text-right text-danger font-medium">−{row.closed}</td>
                      <td className={`px-5 py-3 text-right font-bold ${row.net > 0 ? "text-success" : row.net < 0 ? "text-danger" : "text-muted"}`}>
                        {row.net > 0 ? "+" : ""}{row.net}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 text-xs text-muted leading-relaxed">
              <strong className="text-foreground">What this means:</strong> Consistent net positive growth indicates franchisees are renewing and new units are opening — a sign of system health. Consecutive years of negative net growth (closures exceeding openings) is a key red flag. Review Item 20 in the FDD for transfers, reacquisitions, and non-renewals which this summary does not capture.
            </div>
          </section>
        )}

        {/* Guidance */}
        <section className="rounded-xl border border-border bg-background p-6 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">How to Use This Data in Diligence</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted leading-relaxed">
            <div>
              <p className="font-semibold text-foreground mb-1">Revenue trend questions to ask franchisees</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Did your revenue grow or decline last year vs. the FDD average?</li>
                <li>Has the franchisor changed the Item 19 reporting basis between years?</li>
                <li>Are more or fewer units included in the current Item 19 vs. prior year?</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Unit growth questions for validation calls</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Why did units close in [year]? Underperformance, territory conflicts, or exits?</li>
                <li>Are franchisees renewing at end of term, or exiting?</li>
                <li>Is the franchisor reacquiring units from franchisees?</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-4 border-t border-border print:hidden">
          <Link href={`/brands/${slug}`} className="text-sm text-accent hover:underline">
            ← Back to {brand.name} profile
          </Link>
          <div className="flex gap-3">
            <Link href={`/brands/${slug}/diligence`} className="text-sm text-accent hover:underline">
              Full Diligence Memo →
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-muted border-t border-border pt-4">
          Filing change data sourced from {brand.fddYear} and prior government-filed FDDs (MN CARDS, WI DFI, CA DFPI).
          All figures are from official filings and have not been independently audited. Changes between filing years may reflect
          methodology changes in the FDD itself, not only actual operational changes. Generated {today}.
        </p>
      </div>
    </div>
  );
}
