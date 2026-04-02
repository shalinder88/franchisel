import Link from "next/link";
import { brands } from "@/data/brands";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franchise Due Diligence Reports | Franchisel",
  description:
    "Independent franchise due diligence reports from $29. Full FDD analysis, Item 19 deep dive, red flag registry, category benchmarks, and interview prep — all sourced from government-filed FDDs.",
};

/* ── Pricing tiers ── */
const pricingTiers = [
  {
    id: "standard",
    name: "Standard Report",
    price: 29,
    perReport: null,
    quantity: "1 brand",
    popular: false,
    // Replace with your Stripe Payment Link URL
    stripeUrl: "https://buy.stripe.com/franchisel-standard-29",
    mailSubject: null,
    cta: "Buy Now — $29",
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
    // Replace with your Stripe Payment Link URL
    stripeUrl: "https://buy.stripe.com/franchisel-premium-79",
    mailSubject: "Premium Report Request — $79",
    cta: "Buy Now — $79",
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
    stripeUrl: null,
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

/* ── What's included details ── */
const reportIncludes = [
  {
    title: "Full FDD Analysis — All 23 Items",
    desc: "We translate every mandatory disclosure item into plain English. From litigation history (Item 3) to territory rights (Item 12) to financial statements (Item 21) — every item explained and flagged.",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  },
  {
    title: "Item 19 Deep Dive",
    desc: "Financial performance representations decoded. We identify what the franchisor chose to disclose, what they excluded, and how the numbers compare to independent benchmarks in the same category.",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  },
  {
    title: "Investment Model & Break-Even Calculator",
    desc: "A complete financial model built from Item 7 and Item 19 data. Includes a break-even calculator with adjustable revenue and cost assumptions — so you can stress-test the economics before you commit.",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
  },
  {
    title: "Red Flag Registry",
    desc: "Every concern identified and rated by severity. Each red flag includes the specific FDD item it appears in, why it matters, and questions to ask the franchisor or existing franchisees during validation.",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  },
  {
    title: "Competitor Benchmarking",
    desc: "How does this brand compare to the top 3–5 competitors in its category? Investment range, royalty burden, unit economics, growth trajectory, and franchisee satisfaction — side by side.",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "Public-Source Sentiment Context",
    desc: "Where available: publicly sourced sentiment data from FBR surveys, industry ratings, and Glassdoor — clearly labeled by source and date. Kept separate from FDD data. Not blended into scores.",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
  {
    title: "Territory Analysis",
    desc: "We evaluate the exclusivity language in Item 12, identify carve-outs that may allow encroachment, and assess the commercial viability of the territory structure in context of market saturation.",
    icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  },
  {
    title: "Validation Call Question Guide",
    desc: "A tailored list of the most important questions to ask during franchisee validation calls — based on the specific red flags and concerns identified in your brand's report.",
    icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
  },
];

/* ── FAQ ── */
const faqs = [
  {
    q: "How current is the data?",
    a: "Every report is built from the brand's most recently filed FDD. Franchisors are required to update their FDD annually (typically Q1–Q2). We flag the FDD year prominently in each report and note when a new filing is expected. If a new FDD is filed within 60 days of your purchase, we'll send you an update at no additional charge.",
  },
  {
    q: "What format are reports delivered in?",
    a: "Reports are delivered as professionally formatted PDFs, typically 30–50 pages depending on the complexity of the brand. PDF format means you can annotate, share with your attorney, and keep a permanent reference copy. We also include a one-page summary sheet designed to be printed for franchisee validation calls.",
  },
  {
    q: "Is this legal or financial advice?",
    a: "No. Franchisel reports are research and analysis tools, not legal or financial advice. We strongly recommend hiring a qualified franchise attorney to review the franchise agreement and FDD, and working with a financial advisor on the investment decision. Our reports are designed to make those professional conversations more productive — not to replace them.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If you're not satisfied with the depth or quality of a report within 14 days of delivery, we'll issue a full refund — no questions asked. We stand behind the quality of our analysis. In practice, refund requests are rare because we review each order before starting to confirm the brand has an available FDD.",
  },
  {
    q: "How does this differ from a franchise broker?",
    a: "A franchise broker is paid a commission — typically 40–50% of the franchise fee — when you buy a franchise they recommend. Their financial incentive is for you to buy, not to help you buy the right thing. Franchisel has no financial relationship with any franchisor. We earn revenue only from report sales, and our analysis is designed to help you make an informed decision — including the decision not to buy.",
  },
  {
    q: "Can I request a report for a brand not in your directory?",
    a: "Yes. We can prepare a custom report for any franchise brand with a publicly filed FDD. Email us the brand name at reports@franchisel.com and we'll confirm availability and timeline. Custom reports outside our directory typically take 5–7 business days.",
  },
];

/* ── Mock sample report data (fictional brand) ── */
const sampleReportSections = [
  { label: "Executive Summary", status: "preview", score: null },
  { label: "FDD Item Analysis (All 23)", status: "preview", score: null },
  { label: "Red Flag Registry — 3 flags identified", status: "preview", score: null },
  { label: "Item 19 Deep Dive", status: "locked", score: null },
  { label: "Break-Even Calculator", status: "locked", score: null },
  { label: "Public-Source Sentiment Context", status: "locked", score: null },
  { label: "Competitor Benchmarking", status: "locked", score: null },
  { label: "Territory Analysis", status: "locked", score: null },
  { label: "Validation Call Questions", status: "locked", score: null },
];

const sampleRedFlags = [
  { severity: "High", label: "Item 3: 14 franchisee-initiated lawsuits in 5 years" },
  { severity: "Medium", label: "Item 12: No exclusivity — online & non-traditional carve-outs" },
  { severity: "Low", label: "Item 7: Working capital likely understated by ~30%" },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            Independent Research
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Franchise Due Diligence Reports
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Before you invest $79K–$2M in a franchise, read an independent analysis built from
            the actual FDD — not a broker&apos;s sales pitch.
          </p>
        </div>
      </section>

      {/* ── Trust signals bar ── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { text: "Not affiliated with any franchise system", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { text: "Verified FDD data — not marketing materials", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
              { text: "Used by franchise attorneys and buyers", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
              { text: "14-day money-back guarantee", icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-xs text-muted">
                <svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">Choose Your Report Package</h2>
          <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
            Every package includes independent, franchisor-free analysis. Buy more reports and save more per brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
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
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">{tier.quantity}</p>
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                <div className="mt-3">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                    {!tier.perReport && <span className="text-sm text-muted">/ report</span>}
                  </div>
                  {tier.perReport && (
                    <p className="text-xs text-success font-medium mt-1">${tier.perReport} per report</p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
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
                  {tier.cta}
                </a>
              ) : (
                <a
                  href={`mailto:reports@franchisel.com?subject=${encodeURIComponent(tier.mailSubject ?? tier.name)}&body=${encodeURIComponent("Hi,\n\nI'd like to order the " + tier.name + ".\n\nBrand(s) I'm interested in:\n1. \n\nPlease confirm availability and next steps.\n\nThank you")}`}
                  className="w-full py-3 text-sm font-semibold rounded-xl transition-all block text-center bg-surface text-foreground border border-border hover:border-accent hover:text-accent"
                >
                  {tier.cta}
                </a>
              )}
              <p className="text-[10px] text-muted text-center mt-2">{tier.delivery}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          $29 and $79 reports are instant self-serve checkout via Stripe.{" "}
          $199 Executive Reports are custom engagements — contact{" "}
          <a href="mailto:reports@franchisel.com" className="text-accent hover:underline">
            reports@franchisel.com
          </a>.
          14-day money-back guarantee on all purchases.
        </p>
      </section>

      {/* ── What's included ── */}
      <section className="border-t border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">What&apos;s Included in Every Report</h2>
            <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
              Every report component is designed to answer the questions franchise buyers actually have — and that franchisors rarely volunteer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reportIncludes.map((item) => (
              <div key={item.title} className="p-5 border border-border rounded-xl bg-background hover-glow">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample report ── */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Sample Report Excerpt</h2>
            <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
              This is a mock excerpt for a fictional brand &ldquo;Meridian Fresh Co.&rdquo; — illustrating the depth of analysis in every report.
            </p>
          </div>

          <div className="border border-border rounded-2xl bg-background shadow-sm overflow-hidden">
            {/* Report header */}
            <div className="bg-surface border-b border-border px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">M</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Meridian Fresh Co.</p>
                    <p className="text-xs text-muted">FDD Year: 2025 · Fast Casual Food &amp; Beverage · 312 units</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">6.4</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-warning">Proceed with Caution</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Recommendation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Left: Red flags */}
              <div className="p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  Red Flag Registry (3 identified)
                </h3>
                <div className="space-y-3">
                  {sampleRedFlags.map((flag) => (
                    <div key={flag.label} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
                      <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        flag.severity === "High" ? "bg-destructive/10 text-destructive" :
                        flag.severity === "Medium" ? "bg-warning/10 text-warning" :
                        "bg-muted/20 text-muted"
                      }`}>
                        {flag.severity}
                      </span>
                      <span className="text-xs text-foreground leading-relaxed">{flag.label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-muted italic">
                  Full report includes detailed explanations and recommended validation questions for each flag.
                </p>
              </div>

              {/* Right: Section list */}
              <div className="p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">Report Contents</h3>
                <div className="space-y-1">
                  {sampleReportSections.map((section) => (
                    <div key={section.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${section.status === "preview" ? "bg-accent" : "bg-border"}`} />
                        <span className="text-xs text-foreground">{section.label}</span>
                      </div>
                      {section.status === "preview" ? (
                        <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Preview</span>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-surface rounded-lg text-center border border-border">
                  <p className="text-[11px] text-muted">Full report: 38 pages + appendices</p>
                </div>
              </div>
            </div>

            {/* Item 19 teaser */}
            <div className="border-t border-border px-6 py-5 bg-surface/50">
              <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Item 19 Excerpt — Financial Performance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Median Gross Sales", value: "$684K", note: "Based on 89 reporting units" },
                  { label: "25th Percentile", value: "$421K", note: "Lower quartile performers" },
                  { label: "Est. Break-Even", value: "$510K", note: "At avg cost structure" },
                  { label: "Royalty Burden", value: "8.5%", note: "Royalty + fund + tech" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-background rounded-lg border border-border">
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[11px] font-medium text-foreground mt-0.5">{stat.label}</p>
                    <p className="text-[10px] text-muted mt-0.5">{stat.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted text-center">
                Fictional data for illustration purposes. Real reports use actual FDD Item 19 disclosures.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={`mailto:reports@franchisel.com?subject=${encodeURIComponent("Sample Report Request")}&body=${encodeURIComponent("Hi,\n\nI'd like to see a sample report before ordering. Could you send one over?\n\nThank you")}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Request a Full Sample Report
            </a>
          </div>
        </div>
      </section>

      {/* ── Available reports ── */}
      <section className="border-t border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Reports Available For</h2>
          <p className="text-sm text-muted mb-8">
            Our directory covers <strong className="text-foreground">{brands.length.toLocaleString()}</strong> franchise brands total. Reports are available for the <strong className="text-foreground">{brands.filter((b) => b.totalUnits > 0).length}</strong> brands where we have extracted Item 20 unit count data from the FDD filing — the minimum needed for a meaningful diligence report. A selection of commonly requested brands:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands
              .filter((b) => b.totalUnits > 0 && b.totalInvestmentLow > 0)
              .sort((a, b) => b.totalUnits - a.totalUnits)
              .slice(0, 12)
              .map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background hover-glow group"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    {brand.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {brand.name}
                    </p>
                    <p className="text-xs text-muted">FDD {brand.fddYear} · Updated {brand.lastUpdated}</p>
                  </div>
                  <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl p-5 bg-background hover-glow">
                <h3 className="text-sm font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border bg-surface-alt">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">Know What You&apos;re Buying Before You Buy It</h2>
          <p className="mt-3 text-muted leading-relaxed">
            A $29 Standard report is the cheapest insurance policy available for a $79K–$2M investment.
            Our only incentive is your success &mdash; not a commission.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:reports@franchisel.com?subject=${encodeURIComponent("Standard Report Request — $29")}&body=${encodeURIComponent("Hi,\n\nI'd like to order a Standard Report ($29).\n\nBrand I'm interested in:\n\nPlease confirm availability and next steps.\n\nThank you")}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              Order Your First Report — $29
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-semibold text-foreground rounded-xl hover:bg-surface transition-all"
            >
              Browse Franchise Directory
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted">
            Questions? Email{" "}
            <a href="mailto:reports@franchisel.com" className="text-accent hover:underline">
              reports@franchisel.com
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
