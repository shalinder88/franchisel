import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Browse our franchise directory, read our guides, or compare brands.",
};

const suggestions = [
  {
    href: "/brands",
    label: "Browse Brand Directory",
    desc: "Search and filter 80+ franchise brands with FDD data and scores.",
    icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
  },
  {
    href: "/guides",
    label: "Read Our Guides",
    desc: "In-depth guides on FDD analysis, due diligence, and franchise investing.",
    icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    href: "/compare",
    label: "Compare Brands",
    desc: "Side-by-side comparison of franchise brands across investment, fees, and scores.",
    icon: "M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-border mb-6 mx-auto">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Heading */}
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted leading-relaxed max-w-md mx-auto">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
          Here are some helpful starting points.
        </p>

        {/* Search hint */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-muted">
          <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Looking for a specific franchise?{" "}
          <Link href="/brands" className="text-accent font-medium hover:underline">
            Try searching on our brands page
          </Link>
        </div>

        {/* Suggestion cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="p-5 border border-border rounded-xl bg-background hover-glow group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3">
                <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                {s.label}
              </p>
              <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>

        {/* Back to home */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}
