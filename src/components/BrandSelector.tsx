"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface BrandOption {
  slug: string;
  name: string;
}

interface BrandSelectorProps {
  brands: BrandOption[];
  initialA?: string;
  initialB?: string;
}

export default function BrandSelector({ brands, initialA = "", initialB = "" }: BrandSelectorProps) {
  const router = useRouter();
  const [brandA, setBrandA] = useState(initialA);
  const [brandB, setBrandB] = useState(initialB);

  function navigate(a: string, b: string) {
    if (a && b && a !== b) {
      router.push(`/compare?brandA=${encodeURIComponent(a)}&brandB=${encodeURIComponent(b)}`);
    }
  }

  function handleChangeA(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setBrandA(val);
    navigate(val, brandB);
  }

  function handleChangeB(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setBrandB(val);
    navigate(brandA, val);
  }

  return (
    <div className="border border-border rounded-2xl bg-background p-6 sm:p-8 hover-glow">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Brand A dropdown */}
        <div className="flex-1">
          <label htmlFor="brand-a-select" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Brand A
          </label>
          <div className="relative">
            <select
              id="brand-a-select"
              value={brandA}
              onChange={handleChangeA}
              className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors cursor-pointer"
            >
              <option value="">Select a franchise brand…</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug} disabled={b.slug === brandB}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-end pb-0.5 sm:pb-0 sm:items-center justify-center sm:mt-5">
          <div className="px-4 py-2 rounded-full bg-surface border border-border text-xs font-bold text-muted uppercase tracking-wider">
            vs
          </div>
        </div>

        {/* Brand B dropdown */}
        <div className="flex-1">
          <label htmlFor="brand-b-select" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Brand B
          </label>
          <div className="relative">
            <select
              id="brand-b-select"
              value={brandB}
              onChange={handleChangeB}
              className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors cursor-pointer"
            >
              <option value="">Select a franchise brand…</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug} disabled={b.slug === brandA}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Compare button — only shown when both selected */}
        {brandA && brandB && brandA !== brandB && (
          <div className="flex items-end pb-0.5 sm:mt-5">
            <button
              onClick={() => navigate(brandA, brandB)}
              className="w-full sm:w-auto px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all whitespace-nowrap"
            >
              Compare
            </button>
          </div>
        )}
      </div>

      {brandA && brandB && brandA === brandB && (
        <p className="mt-3 text-xs text-danger font-medium">Please select two different brands to compare.</p>
      )}

      {(!brandA || !brandB) && (
        <p className="mt-3 text-xs text-muted">Select both brands above to generate an instant side-by-side comparison.</p>
      )}
    </div>
  );
}
