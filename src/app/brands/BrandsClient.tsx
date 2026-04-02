"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatInvestmentRange, categoryLabels, type FranchiseCategory } from "@/lib/types";
import type { FranchiseBrand } from "@/lib/types";
import { computeProductionScores } from "@/lib/diligence";
import WatchButton from "@/components/WatchButton";

type SortKey = "score" | "revenue" | "investment" | "name";

function scoreColor(s: number) {
  if (s >= 70) return "bg-success";
  if (s >= 55) return "bg-accent";
  if (s >= 40) return "bg-warning";
  return "bg-danger";
}
function scoreTextColor(s: number) {
  if (s >= 70) return "text-success";
  if (s >= 55) return "text-accent";
  if (s >= 40) return "text-warning";
  return "text-danger";
}

function getCoreDiligence(brand: FranchiseBrand): number {
  const ps = computeProductionScores(brand);
  return ps.coreDiligence ?? 0;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "score",      label: "Score ↓" },
  { key: "revenue",    label: "Revenue ↓" },
  { key: "investment", label: "Investment ↑" },
  { key: "name",       label: "Name A–Z" },
];

export default function BrandsClient({ brands }: { brands: FranchiseBrand[] }) {
  const [revenueOnly, setRevenueOnly] = useState(true);
  const [directSalesOnly, setDirectSalesOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<FranchiseCategory | "all">("all");
  const [investMax, setInvestMax] = useState<number | null>(null); // null = no max
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("score");

  const withBrokerData = useMemo(() => brands.filter((b) => b.brokerData).length, [brands]);

  const processed = useMemo(() => {
    let list = revenueOnly ? brands.filter((b) => b.item19?.grossRevenueAvg) : brands;

    if (directSalesOnly) {
      list = list.filter((b) => !b.brokerData?.usesBrokers);
    }

    if (categoryFilter !== "all") {
      list = list.filter((b) => b.category === categoryFilter);
    }

    if (investMax !== null) {
      list = list.filter((b) => b.totalInvestmentLow > 0 && b.totalInvestmentLow <= investMax);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.parentCompany?.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }

    // Revenue sort: filter to revenue brands only
    if (sort === "revenue") {
      list = list.filter((b) => b.item19?.grossRevenueAvg);
    }

    switch (sort) {
      case "score":
        // Revenue brands always above non-revenue brands; within each tier sort by score
        list = [...list].sort((a, b) => {
          const aHas = a.item19?.grossRevenueAvg ? 0 : 1;
          const bHas = b.item19?.grossRevenueAvg ? 0 : 1;
          if (aHas !== bHas) return aHas - bHas;
          return getCoreDiligence(b) - getCoreDiligence(a);
        });
        break;
      case "revenue":
        list = [...list].sort((a, b) => {
          const ra = a.item19?.grossRevenueAvg ?? 0;
          const rb = b.item19?.grossRevenueAvg ?? 0;
          return rb - ra;
        });
        break;
      case "investment":
        list = [...list].sort((a, b) => a.totalInvestmentLow - b.totalInvestmentLow);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [brands, revenueOnly, sort, directSalesOnly, categoryFilter, investMax, search]);

  const withRevenue = brands.filter((b) => b.item19?.grossRevenueAvg).length;

  // Category breakdown — only categories with 3+ brands
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<FranchiseCategory, number>> = {};
    for (const b of brands) {
      counts[b.category] = (counts[b.category] ?? 0) + 1;
    }
    return Object.entries(counts)
      .filter(([, n]) => n >= 3)
      .sort((a, b) => (b[1] as number) - (a[1] as number)) as [FranchiseCategory, number][];
  }, [brands]);

  return (
    <>
      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands by name, parent company, or category…"
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Left: Item 19 toggle */}
        <button
          onClick={() => setRevenueOnly((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            revenueOnly
              ? "bg-success text-white border-success"
              : "bg-background text-muted border-border hover:border-accent hover:text-accent"
          }`}
        >
          <span
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
              revenueOnly ? "bg-white text-success" : "bg-surface text-muted border border-border"
            }`}
          >
            {revenueOnly ? "✓" : "○"}
          </span>
          Avg Revenue Only
          <span className={`text-xs font-normal ${revenueOnly ? "text-green-100" : "text-muted"}`}>
            ({withRevenue})
          </span>
        </button>

        {/* Investment max filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted">Max invest:</span>
          {[null, 150000, 300000, 500000, 1000000].map((max) => (
            <button
              key={String(max)}
              onClick={() => setInvestMax(max)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                investMax === max
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted border-border hover:border-accent hover:text-accent"
              }`}
            >
              {max === null ? "Any" : max >= 1000000 ? "$1M" : `$${(max / 1000).toFixed(0)}K`}
            </button>
          ))}
        </div>

        {/* Center: Direct Sales filter (only when broker data exists) */}
        {withBrokerData > 0 && (
          <button
            onClick={() => setDirectSalesOnly((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              directSalesOnly
                ? "bg-accent text-white border-accent"
                : "bg-background text-muted border-border hover:border-accent hover:text-accent"
            }`}
          >
            <span className={`text-xs font-bold ${directSalesOnly ? "text-white" : "text-muted"}`}>
              {directSalesOnly ? "✓" : "⚑"}
            </span>
            Direct Sales Only
          </button>
        )}

        {/* Right: Sort pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted mr-1">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                sort === opt.key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted border-border hover:border-accent hover:text-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category filter pills ── */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
            categoryFilter === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted border-border hover:border-accent hover:text-accent"
          }`}
        >
          All categories
        </button>
        {categoryCounts.map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              categoryFilter === cat
                ? "bg-accent text-white border-accent"
                : "bg-background text-muted border-border hover:border-accent hover:text-accent"
            }`}
          >
            {categoryLabels[cat]} <span className="opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* ── Result count + active filter chips ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-foreground">{processed.length}</span>{" "}
          brand{processed.length !== 1 ? "s" : ""}
        </p>
        {/* Active filter chips */}
        {categoryFilter !== "all" && (
          <button
            onClick={() => setCategoryFilter("all")}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors"
          >
            {categoryLabels[categoryFilter]} ✕
          </button>
        )}
        {investMax !== null && (
          <button
            onClick={() => setInvestMax(null)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors"
          >
            Max ${(investMax / 1000).toFixed(0)}K ✕
          </button>
        )}
        {directSalesOnly && (
          <button
            onClick={() => setDirectSalesOnly(false)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors"
          >
            Direct Sales Only ✕
          </button>
        )}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors"
          >
            &ldquo;{search}&rdquo; ✕
          </button>
        )}
        {(categoryFilter !== "all" || investMax !== null || directSalesOnly || search) && (
          <button
            onClick={() => { setCategoryFilter("all"); setInvestMax(null); setDirectSalesOnly(false); setSearch(""); }}
            className="text-xs text-muted hover:text-danger transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Brand grid ── */}
      {processed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No brands match the current filters.</p>
          <button
            onClick={() => { setCategoryFilter("all"); setInvestMax(null); setDirectSalesOnly(false); setRevenueOnly(false); setSearch(""); }}
            className="mt-4 text-accent hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processed.map((brand) => {
            const overall = getCoreDiligence(brand);
            const criticalFlags = brand.redFlags.filter((f) => f.severity === "critical").length;
            const totalFlags = brand.redFlags.length;
            const avgRevenue = brand.item19?.grossRevenueAvg;

            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="hover-glow block rounded-xl border border-border bg-background p-6"
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-foreground truncate">{brand.name}</h2>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface text-muted border border-border">
                      {categoryLabels[brand.category]}
                    </span>
                  </div>
                  {/* Score + Watch */}
                  <div className="flex flex-col items-center ml-3 gap-1">
                    <span className={`text-2xl font-bold ${scoreTextColor(overall)}`}>{overall}</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">Diligence</span>
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
                {brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing" ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted text-xs">Investment</span>
                      <p className="font-medium text-foreground">
                        {brand.totalInvestmentLow > 0 || brand.totalInvestmentHigh > 0
                          ? formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)
                          : <span className="text-muted">See FDD ↗</span>
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Avg Revenue</span>
                      <p className={`font-medium ${avgRevenue ? "text-success" : "text-muted"}`}>
                        {avgRevenue ? `$${avgRevenue.toLocaleString()}` : "Not disclosed"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Total Units</span>
                      <p className="font-medium text-foreground">{brand.totalUnits.toLocaleString()}</p>
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

                {/* Bottom badges row */}
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                  {brand.hasItem19 ? (
                    <span className="text-xs text-success font-medium">Item 19 ✓</span>
                  ) : (
                    <span className="text-xs text-muted">No Item 19</span>
                  )}
                  {brand.item21?.financialStrengthSignal && (
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      brand.item21.financialStrengthSignal === "strong" ? "bg-success/10 text-success" :
                      brand.item21.financialStrengthSignal === "weak" ? "bg-danger/10 text-danger" :
                      brand.item21.financialStrengthSignal === "watch" ? "bg-warning/10 text-warning" :
                      "bg-surface text-muted"
                    }`}>
                      Fin: {brand.item21.financialStrengthSignal}
                    </span>
                  )}
                  {brand.item21?.goingConcernWarning && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-danger/15 text-danger">⚠ Going Concern</span>
                  )}
                  {brand.brokerData?.usesBrokers && brand.brokerData.conflictRisk === "high" && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">⚑ Broker</span>
                  )}
                  {brand.unitEconomics.turnoverRate > 20 && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">
                      {brand.unitEconomics.turnoverRate}% turnover
                    </span>
                  )}
                  <div className="ml-auto">
                    {criticalFlags > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-light text-danger text-xs font-medium">
                        ⚠ {criticalFlags} critical
                      </span>
                    )}
                    {totalFlags > 0 && criticalFlags === 0 && (
                      <span className="text-xs text-muted">{totalFlags} flag{totalFlags !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
