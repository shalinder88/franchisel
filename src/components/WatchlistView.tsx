"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlist";
import WatchButton from "@/components/WatchButton";
import { categoryLabels, formatInvestmentRange } from "@/lib/types";
import type { FranchiseBrand } from "@/lib/types";

interface BrandSummary {
  slug: string;
  name: string;
  category: FranchiseBrand["category"];
  totalInvestmentLow: number;
  totalInvestmentHigh: number;
  overallScore: number;
  grossRevenueAvg?: number;
  hasItem19: boolean;
  goingConcern?: boolean;
  financialStrength?: string;
  turnoverRate: number;
  criticalFlags: number;
  totalFlags: number;
  dataSource: FranchiseBrand["dataSource"];
  brokerHighRisk?: boolean;
  hasExclusiveTerr?: boolean | null;
  managementScore?: number;
  supplierLockIn?: number | null;
  franchisorSupplierRevenue?: boolean;
}

interface WatchlistViewProps {
  allBrands: BrandSummary[];
}

function riskLevel(brand: BrandSummary): "critical" | "warning" | "watch" | "clean" {
  if (brand.criticalFlags > 0 || brand.goingConcern) return "critical";
  if (brand.totalFlags > 2 || brand.turnoverRate > 25) return "warning";
  if (!brand.hasItem19 || brand.turnoverRate > 15) return "watch";
  return "clean";
}

function RiskBadge({ level }: { level: ReturnType<typeof riskLevel> }) {
  const map = {
    critical: { label: "Critical", cls: "bg-danger/10 text-danger border-danger/20" },
    warning:  { label: "Warning",  cls: "bg-warning/10 text-warning border-warning/20" },
    watch:    { label: "Watch",    cls: "bg-accent/10 text-accent border-accent/20" },
    clean:    { label: "Clean",    cls: "bg-success/10 text-success border-success/20" },
  };
  const { label, cls } = map[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

export default function WatchlistView({ allBrands }: WatchlistViewProps) {
  const { entries, count, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR mismatch
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-surface" />
        ))}
      </div>
    );
  }

  // Cross-reference watchlist slugs with live brand data
  const watchedBrands = entries
    .map((entry) => {
      const live = allBrands.find((b) => b.slug === entry.slug);
      return live ? { entry, live } : null;
    })
    .filter(Boolean) as Array<{ entry: typeof entries[0]; live: BrandSummary }>;

  // Brands added to watchlist but not found in current database
  const orphaned = entries.filter((e) => !allBrands.find((b) => b.slug === e.slug));

  if (count === 0) {
    return (
      <EmptyState allBrands={allBrands} />
    );
  }

  // Sort by risk level (critical first)
  const riskOrder = { critical: 0, warning: 1, watch: 2, clean: 3 };
  watchedBrands.sort((a, b) => riskOrder[riskLevel(a.live)] - riskOrder[riskLevel(b.live)]);

  const criticalCount = watchedBrands.filter((w) => riskLevel(w.live) === "critical").length;

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {count} brand{count !== 1 ? "s" : ""} watched
          </span>
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-danger/10 text-danger text-xs font-medium border border-danger/20">
              ⚠ {criticalCount} with critical signals
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/brands"
            className="text-xs text-accent hover:underline"
          >
            Browse more brands →
          </Link>
          <button
            onClick={clearWatchlist}
            className="text-xs text-muted hover:text-danger transition-colors ml-2"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Brand list */}
      <div className="space-y-3">
        {watchedBrands.map(({ entry, live }) => {
          const risk = riskLevel(live);
          const scoreColor =
            live.overallScore >= 70 ? "text-success" :
            live.overallScore >= 55 ? "text-accent" :
            live.overallScore >= 40 ? "text-warning" : "text-danger";

          const alerts: string[] = [];
          if (live.goingConcern)        alerts.push("Going concern warning");
          if (live.criticalFlags > 0)   alerts.push(`${live.criticalFlags} critical flag${live.criticalFlags > 1 ? "s" : ""}`);
          if (live.turnoverRate > 25)   alerts.push(`${live.turnoverRate}% turnover rate`);
          if (!live.hasItem19)          alerts.push("No Item 19 revenue disclosure");
          if (live.financialStrength === "weak") alerts.push("Weak franchisor financials");
          if (live.brokerHighRisk)           alerts.push("High broker conflict-of-interest risk");
          if (live.hasExclusiveTerr === false) alerts.push("No exclusive territory");
          if (live.managementScore != null && live.managementScore < 4) alerts.push("Low management quality signal");
          if (live.supplierLockIn != null && live.supplierLockIn >= 8) alerts.push("High supplier lock-in risk");
          if (live.franchisorSupplierRevenue) alerts.push("Franchisor earns from your suppliers");

          // Score change since added to watchlist
          const scoreChanged = entry.snapshotScore != null && entry.snapshotScore !== live.overallScore;
          const scoreDelta = scoreChanged && entry.snapshotScore != null
            ? live.overallScore - entry.snapshotScore
            : null;

          return (
            <div
              key={entry.slug}
              className={`rounded-xl border p-4 transition-all ${
                risk === "critical" ? "border-danger/30 bg-danger/3" :
                risk === "warning"  ? "border-warning/30 bg-warning/3" :
                "border-border bg-background"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Left: brand info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Link
                      href={`/brands/${live.slug}`}
                      className="font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      {live.name}
                    </Link>
                    <RiskBadge level={risk} />
                    {scoreDelta !== null && (
                      <span className={`text-xs font-medium ${scoreDelta > 0 ? "text-success" : "text-danger"}`}>
                        {scoreDelta > 0 ? "▲" : "▼"} {Math.abs(scoreDelta).toFixed(1)} since added
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mb-2">
                    <span>{categoryLabels[live.category]}</span>
                    <span>{formatInvestmentRange(live.totalInvestmentLow, live.totalInvestmentHigh)}</span>
                    {live.grossRevenueAvg && (
                      <span className="text-success font-medium">
                        Avg ${live.grossRevenueAvg.toLocaleString()} revenue
                      </span>
                    )}
                  </div>

                  {/* Alert pills */}
                  {alerts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {alerts.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs"
                        >
                          ⚠ {a}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-1.5 text-xs text-muted">
                    Added {new Date(entry.addedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Right: score + actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-2xl font-bold ${scoreColor}`}>{live.overallScore}</span>
                  <div className="flex items-center gap-1.5">
                    <WatchButton slug={live.slug} name={live.name} variant="icon" />
                    <Link
                      href={`/brands/${live.slug}`}
                      className="text-xs text-accent hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orphaned entries */}
      {orphaned.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
          <p className="text-xs text-muted">
            {orphaned.length} brand{orphaned.length > 1 ? "s" : ""} no longer in database:{" "}
            {orphaned.map((e) => e.name).join(", ")}
          </p>
          <button
            onClick={() => orphaned.forEach((e) => removeFromWatchlist(e.slug))}
            className="text-xs text-accent hover:underline mt-1"
          >
            Remove from watchlist
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ allBrands }: { allBrands: BrandSummary[] }) {
  // Show top 6 brands by score as suggestions
  const suggestions = [...allBrands]
    .filter((b) => b.grossRevenueAvg)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 6);

  return (
    <div>
      <div className="text-center py-10 mb-8">
        <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Your watchlist is empty</h3>
        <p className="text-sm text-muted max-w-xs mx-auto">
          Click the star icon on any brand page or card to add it to your watchlist. Alerts are shown here automatically.
        </p>
        <Link
          href="/brands"
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          Browse brands
        </Link>
      </div>

      {suggestions.length > 0 && (
        <>
          <p className="text-sm font-semibold text-foreground mb-3">
            Top-rated brands with verified revenue
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((b) => (
              <div
                key={b.slug}
                className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <Link href={`/brands/${b.slug}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate block">
                    {b.name}
                  </Link>
                  <p className="text-xs text-muted">{categoryLabels[b.category]}</p>
                  {b.grossRevenueAvg && (
                    <p className="text-xs text-success mt-0.5">
                      Avg ${b.grossRevenueAvg.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-lg font-bold text-accent">{b.overallScore}</span>
                  <WatchButton
                    slug={b.slug}
                    name={b.name}
                    snapshotScore={b.overallScore}
                    snapshotRevenue={b.grossRevenueAvg}
                    variant="icon"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
