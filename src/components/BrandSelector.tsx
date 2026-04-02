"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

interface BrandOption {
  slug: string;
  name: string;
}

interface BrandSelectorProps {
  brands: BrandOption[];
  initialA?: string;
  initialB?: string;
}

function BrandCombobox({
  id,
  label,
  brands,
  value,
  disabledSlug,
  onChange,
}: {
  id: string;
  label: string;
  brands: BrandOption[];
  value: string;
  disabledSlug: string;
  onChange: (slug: string) => void;
}) {
  const selectedBrand = brands.find((b) => b.slug === value);
  const [inputValue, setInputValue] = useState(selectedBrand?.name ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync inputValue when external value changes (e.g. initialA/B from URL)
  useEffect(() => {
    const b = brands.find((b) => b.slug === value);
    setInputValue(b?.name ?? "");
  }, [value, brands]);

  const filtered = inputValue.length >= 1
    ? brands
        .filter((b) => b.name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 40)
    : brands.slice(0, 40);

  function handleSelect(b: BrandOption) {
    setInputValue(b.name);
    setOpen(false);
    onChange(b.slug);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    setOpen(true);
    if (e.target.value === "") onChange("");
  }

  function handleBlur(e: React.FocusEvent) {
    // Close if focus leaves the container
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      // If input doesn't match a selection, revert to current selected name
      const b = brands.find((b) => b.slug === value);
      setInputValue(b?.name ?? "");
    }
  }

  const labelId = `${id}-label`;

  return (
    <div className="flex-1" ref={containerRef} onBlur={handleBlur}>
      <label id={labelId} htmlFor={id} className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Type to search 2,500+ brands…"
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          aria-labelledby={labelId}
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {value ? (
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          )}
        </div>

        {open && filtered.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-50 top-full mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-border bg-background shadow-lg"
          >
            {filtered.map((b) => (
              <li
                key={b.slug}
                role="option"
                aria-selected={b.slug === value}
                aria-disabled={b.slug === disabledSlug}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur before click registers
                  if (b.slug !== disabledSlug) handleSelect(b);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  b.slug === value
                    ? "bg-accent/10 text-accent font-medium"
                    : b.slug === disabledSlug
                    ? "text-muted cursor-not-allowed opacity-50"
                    : "text-foreground hover:bg-surface"
                }`}
              >
                {b.name}
              </li>
            ))}
            {filtered.length === 40 && (
              <li className="px-4 py-2 text-xs text-muted border-t border-border">
                Showing top 40 matches — type more to narrow results
              </li>
            )}
          </ul>
        )}

        {open && filtered.length === 0 && inputValue.length >= 1 && (
          <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-border bg-background shadow-lg px-4 py-3 text-sm text-muted">
            No brands match &ldquo;{inputValue}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
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

  function handleChangeA(slug: string) {
    setBrandA(slug);
    navigate(slug, brandB);
  }

  function handleChangeB(slug: string) {
    setBrandB(slug);
    navigate(brandA, slug);
  }

  return (
    <div className="border border-border rounded-2xl bg-background p-6 sm:p-8 hover-glow">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
        <BrandCombobox
          id="brand-a-select"
          label="Brand A"
          brands={brands}
          value={brandA}
          disabledSlug={brandB}
          onChange={handleChangeA}
        />

        {/* VS divider */}
        <div className="flex items-center justify-center sm:mt-7">
          <div className="px-4 py-2 rounded-full bg-surface border border-border text-xs font-bold text-muted uppercase tracking-wider">
            vs
          </div>
        </div>

        <BrandCombobox
          id="brand-b-select"
          label="Brand B"
          brands={brands}
          value={brandB}
          disabledSlug={brandA}
          onChange={handleChangeB}
        />

        {/* Compare button */}
        {brandA && brandB && brandA !== brandB && (
          <div className="flex items-end sm:mt-7">
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
        <p className="mt-3 text-xs text-muted">Search and select both brands above to generate an instant side-by-side comparison.</p>
      )}
    </div>
  );
}
