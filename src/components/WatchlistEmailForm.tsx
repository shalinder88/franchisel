"use client";

import { useState } from "react";

const popularBrandHints = [
  "McDonald's", "Great Clips", "The UPS Store", "Planet Fitness",
  "Jersey Mike's", "SERVPRO", "Wingstop", "Chick-fil-A",
  "Dunkin'", "Subway", "Anytime Fitness", "Ace Hardware",
];

export default function WatchlistEmailForm() {
  const [email, setEmail] = useState("");
  const [brands, setBrands] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showBrandInput, setShowBrandInput] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  function addBrandHint(brand: string) {
    setBrands((prev) => {
      if (!prev.trim()) return brand;
      const existing = prev.split(",").map((b) => b.trim());
      if (existing.includes(brand)) return prev;
      return prev + ", " + brand;
    });
    setShowBrandInput(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-foreground">You&apos;re on the list</p>
        <p className="text-xs text-muted text-center max-w-xs">
          We&apos;ll email you at <span className="font-medium text-foreground">{email}</span> when your watched brands have FDD updates, score changes, or new alerts.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto" aria-label="Watchlist email signup">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all shrink-0"
        >
          Get Alerts
        </button>
      </div>

      {/* Brand hints */}
      <div>
        <button
          type="button"
          onClick={() => setShowBrandInput((v) => !v)}
          className="text-xs text-accent hover:underline"
        >
          {showBrandInput ? "Hide brand selection" : "+ Add brands to watch (optional)"}
        </button>
        {showBrandInput && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={brands}
              onChange={(e) => setBrands(e.target.value)}
              placeholder="e.g. McDonald's, Jersey Mike's, Planet Fitness"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              aria-label="Brands to watch"
            />
            <div>
              <p className="text-[11px] text-muted mb-2">Popular brands to watch:</p>
              <div className="flex flex-wrap gap-1.5">
                {popularBrandHints.map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => addBrandHint(hint)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                      brands.includes(hint)
                        ? "bg-accent/10 text-accent border-accent/30"
                        : "bg-surface text-muted border-border hover:border-accent hover:text-accent"
                    }`}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
