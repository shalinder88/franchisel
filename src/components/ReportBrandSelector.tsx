"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { brands } from "@/data/brands";
import type { FranchiseBrand } from "@/lib/types";

/* ── Coverage helpers ── */
function hasItem19Data(brand: FranchiseBrand): boolean {
  return !!(brand.hasItem19 && brand.item19?.grossRevenueAvg);
}

function hasYoYData(brand: FranchiseBrand): boolean {
  return !!(
    brand.item19Prior?.grossRevenueAvg ||
    (brand.unitEconomics?.yearlyNetGrowth && brand.unitEconomics.yearlyNetGrowth.length >= 2)
  );
}

function hasCategoryBenchmarks(brand: FranchiseBrand): boolean {
  return brand.dataSource === "state_filing" || brand.dataSource === "fdd_verified";
}

/* ── Exported types ── */
export interface BrandCoverage {
  hasItem19: boolean;
  hasYoY: boolean;
  hasBenchmarks: boolean;
  hasSystemHealth: boolean;
}

export function getBrandCoverage(brand: FranchiseBrand): BrandCoverage {
  return {
    hasItem19: hasItem19Data(brand),
    hasYoY: hasYoYData(brand),
    hasBenchmarks: hasCategoryBenchmarks(brand),
    hasSystemHealth: brand.totalUnits > 0,
  };
}

/* ── Checklist row ── */
function ChecklistRow({
  available,
  label,
}: {
  available: boolean;
  label: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      {available ? (
        <svg
          className="w-4 h-4 text-success shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-muted shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={`text-sm ${available ? "text-foreground" : "text-muted"}`}>{label}</span>
    </li>
  );
}

/* ── Main component ── */
export interface PricingOverride {
  standardPrice: number;
  premiumPrice: number;
  standardNote: string | null;
  premiumNote: string | null;
}

export default function ReportBrandSelector({
  onPricingChange,
}: {
  onPricingChange?: (override: PricingOverride | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FranchiseBrand | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return brands
      .filter((b) => b.name.toLowerCase().includes(q) || b.slug.includes(q))
      .slice(0, 10);
  }, [query]);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selectBrand(brand: FranchiseBrand) {
    setSelected(brand);
    setQuery(brand.name);
    setOpen(false);

    if (!hasItem19Data(brand)) {
      onPricingChange?.({
        standardPrice: 19,
        premiumPrice: 49,
        standardNote: "Item 19 not available",
        premiumNote: "Item 19 not available — all other sections included",
      });
    } else {
      onPricingChange?.(null);
    }
  }

  function clearSelection() {
    setSelected(null);
    setQuery("");
    onPricingChange?.(null);
  }

  const coverage = selected ? getBrandCoverage(selected) : null;
  const noItem19 = selected && !coverage?.hasItem19;

  return (
    <div className="max-w-2xl mx-auto mb-10">
      {/* Search input */}
      <div ref={wrapperRef} className="relative">
        <label className="block text-sm font-semibold text-foreground mb-2">
          Search for your brand to see what&apos;s included
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 16.803z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (!e.target.value) clearSelection();
            }}
            onFocus={() => query && setOpen(true)}
            placeholder="Search for a franchise brand..."
            className="w-full pl-9 pr-9 py-3 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
          />
          {query && (
            <button
              onClick={clearSelection}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              aria-label="Clear"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg overflow-hidden">
            {filtered.map((brand) => (
              <li key={brand.slug}>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-surface transition-colors flex items-center justify-between gap-2"
                  onClick={() => selectBrand(brand)}
                >
                  <span>{brand.name}</span>
                  <span className="text-xs text-muted shrink-0">{brand.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {open && query.trim() && filtered.length === 0 && (
          <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg px-4 py-3 text-sm text-muted">
            No brands found for &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

      {/* Coverage checklist */}
      {selected && coverage && (
        <div className="mt-5 border border-border rounded-xl bg-surface p-5">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
                Coverage for
              </p>
              <h3 className="text-base font-bold text-foreground">{selected.name}</h3>
            </div>
            {noItem19 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold shrink-0">
                No Item 19
              </span>
            )}
          </div>

          <ul className="space-y-2.5">
            <ChecklistRow available={true} label="Fee structure breakdown (Items 5–6)" />
            <ChecklistRow available={true} label="Red flags registry" />
            <ChecklistRow
              available={coverage.hasSystemHealth}
              label="System health & unit growth (Item 20)"
            />
            <ChecklistRow
              available={coverage.hasItem19}
              label="Item 19 revenue data"
            />
            <ChecklistRow
              available={coverage.hasYoY}
              label="Year-over-year filing changes"
            />
            <ChecklistRow
              available={coverage.hasBenchmarks}
              label="Category benchmarks"
            />
          </ul>

          {noItem19 && (
            <p className="mt-4 text-xs text-muted leading-relaxed border-t border-border pt-3">
              This brand did not disclose Item 19 in its FDD. Revenue data is not available
              — your report will cover all other sections. Pricing has been adjusted to
              reflect this.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
