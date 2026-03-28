import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Franchise Intelligence Blog — FDD Analysis & Market Trends",
  description:
    "Independent franchise market analysis, FDD deep-dives, due diligence guides, and industry trend reporting from Franchisel.",
  alternates: {
    canonical: "https://franchisel.com/blog",
  },
};

const categoryColors: Record<string, string> = {
  "Market Analysis": "bg-blue-50 text-blue-700 border-blue-200",
  "Due Diligence": "bg-amber-50 text-amber-700 border-amber-200",
  "Brand Analysis": "bg-purple-50 text-purple-700 border-purple-200",
  "Category Report": "bg-teal-50 text-teal-700 border-teal-200",
  "Legal": "bg-red-50 text-red-700 border-red-200",
  "Comparison": "bg-green-50 text-green-700 border-green-200",
};

export default function BlogPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface-alt">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-surface-alt border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent bg-accent-light px-3 py-1 rounded-full mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
            Independent Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Franchise Market Intelligence
          </h1>
          <p className="text-base text-muted max-w-2xl mx-auto leading-relaxed">
            In-depth franchise analysis grounded in FDD data — not press releases. We cover brand performance, industry trends, and the due diligence details that determine whether a franchise investment succeeds or fails.
          </p>
        </div>
      </div>

      {/* Article grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col border border-border rounded-xl bg-surface hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      categoryColors[article.category] ?? "bg-surface-alt text-muted border-border"
                    }`}
                  >
                    {article.category}
                  </span>
                  <time className="text-xs text-muted">{article.date}</time>
                </div>

                <h2 className="text-sm font-semibold text-foreground leading-snug mb-3 flex-1">
                  {article.title}
                </h2>

                <p className="text-xs text-muted leading-relaxed mb-4">
                  {article.teaser}
                </p>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline mt-auto"
                >
                  Read Article
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="mt-12 text-center border border-border rounded-xl p-8 bg-surface-alt">
          <p className="text-sm font-semibold text-foreground mb-2">More analysis coming soon</p>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            We publish new franchise market intelligence regularly. Sign up for brand alerts to get notified when new analysis is available for franchises you are researching.
          </p>
          <Link
            href="/watchlist"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-semibold bg-accent text-white rounded-lg hover:brightness-110 transition-all"
          >
            Set Up Brand Alerts
          </Link>
        </div>
      </div>
    </>
  );
}
