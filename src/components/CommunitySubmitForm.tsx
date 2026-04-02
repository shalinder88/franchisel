"use client";

import { useState } from "react";
import { brands } from "@/data/brands";

interface Props {
  /** Pre-select a brand when embedded on a brand page */
  defaultBrandSlug?: string;
  defaultBrandName?: string;
}

export default function CommunitySubmitForm({ defaultBrandSlug, defaultBrandName }: Props) {
  const [brandSlug, setBrandSlug] = useState(defaultBrandSlug ?? "");
  const [brandName, setBrandName] = useState(defaultBrandName ?? "");
  const [investment, setInvestment] = useState("");
  const [revenue, setRevenue] = useState("");
  const [satisfaction, setSatisfaction] = useState("");
  const [wouldDoAgain, setWouldDoAgain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brandSlug) { setError("Please select a brand."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/community-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug,
          brandName,
          investment,
          revenue,
          satisfaction: satisfaction ? Number(satisfaction) : undefined,
          wouldDoAgain: wouldDoAgain || undefined,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-foreground">Submission received — thank you.</p>
        <p className="text-xs text-muted max-w-xs">
          Your anonymous data will be reviewed and aggregated. It will never be published individually.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Brand */}
      {!defaultBrandSlug && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Franchise Brand</label>
          <select
            value={brandSlug}
            onChange={(e) => {
              const slug = e.target.value;
              const b = brands.find((br) => br.slug === slug);
              setBrandSlug(slug);
              setBrandName(b?.name ?? "");
            }}
            className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="">Select your franchise brand</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Investment */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Total Investment (actual)</label>
        <input
          type="text"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="e.g. $350,000"
          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Revenue */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">First-Year Gross Revenue</label>
        <input
          type="text"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          placeholder="e.g. $800,000"
          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Satisfaction */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Overall Satisfaction (1–10)</label>
        <input
          type="number"
          min={1}
          max={10}
          value={satisfaction}
          onChange={(e) => setSatisfaction(e.target.value)}
          placeholder="8"
          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Would do again */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Would you do it again?</label>
        <div className="flex gap-3">
          {(["yes", "no", "unsure"] as const).map((opt) => (
            <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer transition-colors ${wouldDoAgain === opt ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-surface text-foreground"}`}>
              <input
                type="radio"
                name="wouldDoAgain"
                value={opt}
                checked={wouldDoAgain === opt}
                onChange={() => setWouldDoAgain(opt)}
                className="sr-only"
              />
              <span className="text-sm capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Anonymous Review"}
      </button>

      <p className="text-[11px] text-muted text-center leading-relaxed">
        By submitting, you confirm you are or were a franchise owner/operator. No personally identifiable information is stored.
        Data is aggregated — never published individually.
      </p>
    </form>
  );
}
