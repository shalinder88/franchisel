"use client";

import { useState } from "react";
import ReportBrandSelector, { type PricingOverride } from "@/components/ReportBrandSelector";

/* ── Pricing tiers (base prices) ── */
const pricingTiers = [
  {
    id: "standard",
    name: "Standard Report",
    price: 29,
    perReport: null,
    quantity: "1 brand",
    popular: false,
    stripeUrl: "https://buy.stripe.com/franchisel-standard-29",
    mailSubject: null as string | null,
    cta: "Buy Now",
    delivery: "Instant checkout · PDF delivered within 24h",
    features: [
      "Plain-English FDD summary",
      "Fee structure breakdown (Items 5–6)",
      "Red flags identified with explanations",
      "Litigation & bankruptcy summary",
      "Unit growth & churn analysis",
      "Territory protection assessment",
    ],
  },
  {
    id: "premium",
    name: "Premium Report",
    price: 79,
    perReport: null,
    quantity: "1 brand",
    popular: true,
    stripeUrl: "https://buy.stripe.com/franchisel-premium-79",
    mailSubject: "Premium Report Request" as string | null,
    cta: "Buy Now",
    delivery: "Instant checkout · PDF + analyst summary email within 24h",
    features: [
      "Everything in Standard",
      "Item 19 deep dive & comparability analysis",
      "Category benchmarks vs. peer cohort",
      "Year-over-year FDD filing changes",
      "Contract red-flag summary (Item 17)",
      "Franchisee interview prep questions",
    ],
  },
  {
    id: "executive",
    name: "Executive Report",
    price: 199,
    perReport: null,
    quantity: "1 brand",
    popular: false,
    stripeUrl: null as string | null,
    mailSubject: "Executive Report Request — $199",
    cta: "Request Quote",
    delivery: "Custom engagement · 5–7 business days",
    features: [
      "Everything in Premium",
      "Lender-ready diligence pack",
      "Attorney-ready memo format",
      "Investment scenario modeling",
      "Comparable brand recommendations",
      "30-minute expert consultation",
    ],
  },
];

export default function PricingSection() {
  const [override, setOverride] = useState<PricingOverride | null>(null);

  function resolvePrice(tier: (typeof pricingTiers)[number]): number {
    if (!override) return tier.price;
    if (tier.id === "standard") return override.standardPrice;
    if (tier.id === "premium") return override.premiumPrice;
    return tier.price; // executive stays $199
  }

  function resolveNote(tier: (typeof pricingTiers)[number]): string | null {
    if (!override) return null;
    if (tier.id === "standard") return override.standardNote;
    if (tier.id === "premium") return override.premiumNote;
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Report Package</h2>
        <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
          Every package includes independent, franchisor-free analysis. Buy more reports and save
          more per brand.
        </p>
      </div>

      {/* Brand selector */}
      <ReportBrandSelector onPricingChange={setOverride} />

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {pricingTiers.map((tier) => {
          const price = resolvePrice(tier);
          const note = resolveNote(tier);
          const priceChanged = price !== tier.price;

          return (
            <div
              key={tier.id}
              className={`relative border rounded-2xl p-6 sm:p-8 hover-pricing ${
                tier.popular
                  ? "border-accent bg-background shadow-lg shadow-accent/5 ring-1 ring-accent/20"
                  : "border-border bg-background"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-white text-xs font-bold rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  {tier.quantity}
                </p>
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                <div className="mt-3">
                  <div className="flex items-baseline justify-center gap-1">
                    {priceChanged && (
                      <span className="text-sm text-muted line-through mr-1">${tier.price}</span>
                    )}
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    {!tier.perReport && (
                      <span className="text-sm text-muted">/ report</span>
                    )}
                  </div>
                  {tier.perReport && (
                    <p className="text-xs text-success font-medium mt-1">
                      ${tier.perReport} per report
                    </p>
                  )}
                  {note && (
                    <p className="text-xs text-warning font-medium mt-1.5">{note}</p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg
                      className="w-4 h-4 text-success shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.stripeUrl ? (
                <a
                  href={tier.stripeUrl}
                  className={`w-full py-3 text-sm font-semibold rounded-xl transition-all block text-center ${
                    tier.popular
                      ? "bg-accent text-white hover:brightness-110"
                      : "bg-surface text-foreground border border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {tier.cta} — ${price}
                </a>
              ) : (
                <a
                  href={`mailto:reports@franchisel.com?subject=${encodeURIComponent(
                    tier.mailSubject ?? tier.name
                  )}&body=${encodeURIComponent(
                    "Hi,\n\nI'd like to order the " +
                      tier.name +
                      ".\n\nBrand(s) I'm interested in:\n1. \n\nPlease confirm availability and next steps.\n\nThank you"
                  )}`}
                  className="w-full py-3 text-sm font-semibold rounded-xl transition-all block text-center bg-surface text-foreground border border-border hover:border-accent hover:text-accent"
                >
                  {tier.cta}
                </a>
              )}
              <p className="text-[10px] text-muted text-center mt-2">{tier.delivery}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        $29 and $79 reports are instant self-serve checkout via Stripe.{" "}
        $199 Executive Reports are custom engagements — contact{" "}
        <a href="mailto:reports@franchisel.com" className="text-accent hover:underline">
          reports@franchisel.com
        </a>
        . 14-day money-back guarantee on all purchases.
      </p>
    </section>
  );
}
