"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatInvestmentRange, categoryLabels, type FranchiseCategory } from "@/lib/types";
import type { FranchiseBrand } from "@/lib/types";
import { computeProductionScores } from "@/lib/diligence";
import WatchButton from "@/components/WatchButton";

type SortKey =
  | "popular"
  | "score-desc"
  | "score-asc"
  | "revenue-desc"
  | "investment-asc"
  | "investment-desc"
  | "units-desc"
  | "name-asc";

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
  return computeProductionScores(brand).coreDiligence ?? 0;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "popular",        label: "Most Popular" },
  { key: "score-desc",     label: "Score ↓" },
  { key: "score-asc",      label: "Score ↑" },
  { key: "revenue-desc",   label: "Revenue ↓" },
  { key: "investment-asc", label: "Investment ↑" },
  { key: "investment-desc",label: "Investment ↓" },
  { key: "units-desc",     label: "Most Units" },
  { key: "name-asc",       label: "A – Z" },
];

const SCORE_MIN_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "≥ 40", value: 40 },
  { label: "≥ 55", value: 55 },
  { label: "≥ 70", value: 70 },
];

export default function BrandsClient({ brands }: { brands: FranchiseBrand[] }) {
  const [search, setSearch]               = useState("");
  const [sort, setSort]                   = useState<SortKey>("popular");
  const [categoryFilter, setCategoryFilter] = useState<FranchiseCategory | "all">("all");
  const [item19Only, setItem19Only]       = useState(false);
  const [fddVerifiedOnly, setFddVerifiedOnly] = useState(false);
  const [hideNoData, setHideNoData]       = useState(true);  // hide 0-unit brands by default
  const [investMax, setInvestMax]         = useState<number | null>(null);
  const [scoreMin, setScoreMin]           = useState(0);
  const [filtersOpen, setFiltersOpen]     = useState(false);

  const processed = useMemo(() => {
    let list = [...brands];

    // Always hide 0-unit brands when toggle is on
    if (hideNoData) {
      list = list.filter((b) => b.totalUnits > 0 && b.totalInvestmentLow > 0);
    }

    if (item19Only) {
      list = list.filter((b) => b.item19?.grossRevenueAvg);
    }

    if (fddVerifiedOnly) {
      list = list.filter(
        (b) => b.dataSource === "fdd_verified" || b.dataSource === "state_filing"
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter((b) => b.category === categoryFilter);
    }

    if (investMax !== null) {
      list = list.filter((b) => b.totalInvestmentLow > 0 && b.totalInvestmentLow <= investMax);
    }

    if (scoreMin > 0) {
      list = list.filter((b) => getCoreDiligence(b) >= scoreMin);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.parentCompany?.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    // Revenue sort: filter to revenue brands only
    if (sort === "revenue-desc") {
      list = list.filter((b) => b.item19?.grossRevenueAvg);
    }

    switch (sort) {
      case "popular":
        // Sort by totalUnits desc (most well-known brands first), then score
        list = list.sort((a, b) => {
          if (b.totalUnits !== a.totalUnits) return b.totalUnits - a.totalUnits;
          return getCoreDiligence(b) - getCoreDiligence(a);
        });
        break;
      case "score-desc":
        list = list.sort((a, b) => getCoreDiligence(b) - getCoreDiligence(a));
        break;
      case "score-asc":
        list = list.sort((a, b) => getCoreDiligence(a) - getCoreDiligence(b));
        break;
      case "revenue-desc":
        list = list.sort((a, b) => (b.item19?.grossRevenueAvg ?? 0) - (a.item19?.grossRevenueAvg ?? 0));
        break;
      case "investment-asc":
        list = list.sort((a, b) => a.totalInvestmentLow - b.totalInvestmentLow);
        break;
      case "investment-desc":
        list = list.sort((a, b) => b.totalInvestmentLow - a.totalInvestmentLow);
        break;
      case "units-desc":
        list = list.sort((a, b) => b.totalUnits - a.totalUnits);
        break;
      case "name-asc":
        list = list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [brands, hideNoData, item19Only, fddVerifiedOnly, categoryFilter, investMax, scoreMin, search, sort]);

  // Stats
  const withRevenue = brands.filter((b) => b.item19?.grossRevenueAvg).length;
  const withData    = brands.filter((b) => b.totalUnits > 0 && b.totalInvestmentLow > 0).length;
  const fddVerified = brands.filter((b) => b.dataSource === "fdd_verified" || b.dataSource === "state_filing").length;

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

  const activeFilterCount =
    (item19Only ? 1 : 0) +
    (fddVerifiedOnly ? 1 : 0) +
    (!hideNoData ? 1 : 0) +
    (investMax !== null ? 1 : 0) +
    (scoreMin > 0 ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0);

  function clearAll() {
    setCategoryFilter("all");
    setInvestMax(null);
    setItem19Only(false);
    setFddVerifiedOnly(false);
    setHideNoData(true);
    setScoreMin(0);
    setSearch("");
    setSort("popular");
  }

  return (
    <>
      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by brand name, category, or parent company…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
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

      {/* ── Sort + Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Sort */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted shrink-0">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                sort === opt.key
                  ? "bg-accent text-white border-accent"
                  : "bg-surface text-muted border-border hover:border-accent hover:text-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Filters toggle button */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            filtersOpen || activeFilterCount > 0
              ? "bg-accent/10 text-accent border-accent/30"
              : "bg-surface text-muted border-border hover:border-accent hover:text-accent"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591L15.75 12.5v6.75a.75.75 0 0 1-.475.694l-3 1.125a.75.75 0 0 1-1.025-.694V12.5L4.659 7.409A2.25 2.25 0 0 1 4 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Expanded filters panel ── */}
      {filtersOpen && (
        <div className="mb-4 p-4 rounded-xl border border-border bg-surface space-y-4">
          {/* Row 1: Quick toggles */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted self-center shrink-0 w-24">Quick filters:</span>
            <button
              onClick={() => setItem19Only((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                item19Only ? "bg-success text-white border-success" : "bg-background text-muted border-border hover:border-success hover:text-success"
              }`}
            >
              <span className="font-bold">{item19Only ? "✓" : "+"}</span>
              Item 19 Disclosed
              <span className="opacity-70">({withRevenue})</span>
            </button>
            <button
              onClick={() => setFddVerifiedOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                fddVerifiedOnly ? "bg-accent text-white border-accent" : "bg-background text-muted border-border hover:border-accent hover:text-accent"
              }`}
            >
              <span className="font-bold">{fddVerifiedOnly ? "✓" : "+"}</span>
              FDD Verified
              <span className="opacity-70">({fddVerified})</span>
            </button>
            <button
              onClick={() => setHideNoData((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                !hideNoData ? "bg-warning text-white border-warning" : "bg-background text-muted border-border hover:border-warning hover:text-warning"
              }`}
            >
              <span className="font-bold">{!hideNoData ? "✓" : "+"}</span>
              {hideNoData ? "Hiding" : "Show"} incomplete data
              <span className="opacity-70">({brands.length - withData})</span>
            </button>
          </div>

          {/* Row 2: Score minimum */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted shrink-0 w-24">Min score:</span>
            {SCORE_MIN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setScoreMin(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  scoreMin === opt.value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted border-border hover:border-accent hover:text-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Row 3: Max investment */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted shrink-0 w-24">Max invest:</span>
            {[null, 100000, 250000, 500000, 1000000].map((max) => (
              <button
                key={String(max)}
                onClick={() => setInvestMax(max)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  investMax === max
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted border-border hover:border-accent hover:text-accent"
                }`}
              >
                {max === null ? "Any" : max >= 1000000 ? "≤ $1M" : max >= 100000 ? `≤ $${(max / 1000).toFixed(0)}K` : `≤ $${max.toLocaleString()}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Category pills ── */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            categoryFilter === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-surface text-muted border-border hover:border-accent hover:text-accent"
          }`}
        >
          All
        </button>
        {categoryCounts.map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              categoryFilter === cat
                ? "bg-accent text-white border-accent"
                : "bg-surface text-muted border-border hover:border-accent hover:text-accent"
            }`}
          >
            {categoryLabels[cat]} <span className="opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* ── Result count + active chips ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">{processed.length}</span>{" "}
          brand{processed.length !== 1 ? "s" : ""}
        </p>

        {categoryFilter !== "all" && (
          <button onClick={() => setCategoryFilter("all")} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors">
            {categoryLabels[categoryFilter]} ✕
          </button>
        )}
        {investMax !== null && (
          <button onClick={() => setInvestMax(null)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors">
            ≤ ${(investMax / 1000).toFixed(0)}K ✕
          </button>
        )}
        {scoreMin > 0 && (
          <button onClick={() => setScoreMin(0)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors">
            Score ≥ {scoreMin} ✕
          </button>
        )}
        {item19Only && (
          <button onClick={() => setItem19Only(false)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors">
            Item 19 only ✕
          </button>
        )}
        {fddVerifiedOnly && (
          <button onClick={() => setFddVerifiedOnly(false)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors">
            FDD verified only ✕
          </button>
        )}
        {search && (
          <button onClick={() => setSearch("")} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-colors">
            &ldquo;{search}&rdquo; ✕
          </button>
        )}
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-muted hover:text-danger transition-colors ml-1">
            Clear all
          </button>
        )}
      </div>

      {/* ── Brand grid ── */}
      {processed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No brands match these filters.</p>
          <button onClick={clearAll} className="mt-4 text-accent hover:underline text-sm">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processed.map((brand) => {
            const overall = getCoreDiligence(brand);
            const criticalFlags = brand.redFlags.filter((f) => f.severity === "critical").length;
            const totalFlags = brand.redFlags.length;
            const avgRevenue = brand.item19?.grossRevenueAvg;

            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="hover-glow block rounded-xl border border-border bg-surface p-5 group"
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="text-base font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                      {brand.name}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs text-muted">{categoryLabels[brand.category]}</span>
                      {(brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing") && (
                        <span className="text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-full">FDD ✓</span>
                      )}
                      {brand.hasItem19 && (
                        <span className="text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">Item 19</span>
                      )}
                    </div>
                  </div>
                  {/* Score */}
                  <div className="flex flex-col items-center shrink-0 gap-0.5">
                    <span className={`text-2xl font-bold tabular-nums ${scoreTextColor(overall)}`}>{overall}</span>
                    <span className="text-[9px] text-muted uppercase tracking-wider">score</span>
                    <WatchButton slug={brand.slug} name={brand.name} snapshotScore={overall} snapshotRevenue={brand.item19?.grossRevenueAvg} variant="icon" />
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-1 w-full rounded-full bg-border mb-4">
                  <div className={`h-1 rounded-full animate-fill ${scoreColor(overall)}`} style={{ width: `${overall}%` }} />
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-muted">Investment</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {brand.totalInvestmentLow > 0
                        ? formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)
                        : <span className="text-muted italic">Not disclosed</span>}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">Avg Revenue</span>
                    <p className={`font-medium mt-0.5 ${avgRevenue ? "text-success" : "text-muted"}`}>
                      {avgRevenue ? `$${(avgRevenue / 1000).toFixed(0)}K` : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">Total Units</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {brand.totalUnits > 0 ? brand.totalUnits.toLocaleString() : <span className="text-muted italic">—</span>}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">Royalty</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {brand.royaltyRate || <span className="text-muted italic">—</span>}
                    </p>
                  </div>
                </div>

                {/* Bottom: flags */}
                {(criticalFlags > 0 || totalFlags > 0 || brand.item21?.goingConcernWarning) && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                    {brand.item21?.goingConcernWarning && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-danger/15 text-danger">⚠ Going Concern</span>
                    )}
                    {criticalFlags > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-danger/15 text-danger">⚠ {criticalFlags} critical flag{criticalFlags !== 1 ? "s" : ""}</span>
                    )}
                    {totalFlags > 0 && criticalFlags === 0 && (
                      <span className="text-[10px] text-muted">{totalFlags} flag{totalFlags !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
