import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/data/brands";

export const metadata: Metadata = {
  title: "Franchise Due Diligence Guides",
  description:
    "Free, independent guides to franchise due diligence, FDD analysis, and investment evaluation. Written for buyers, not franchisors.",
  alternates: { canonical: "https://franchisel.com/guides" },
  openGraph: {
    title: "Franchise Due Diligence Guides",
    description:
      "Free, independent guides to franchise due diligence, FDD analysis, and investment evaluation. Written for buyers, not franchisors.",
    url: "https://franchisel.com/guides",
  },
};

const guideCategories = [
  "Due Diligence",
  "FDD Analysis",
  "Investment Guide",
  "Getting Started",
] as const;

const GLOSSARY_SLUG = "franchise-glossary";

function categoryColor(cat: string) {
  switch (cat) {
    case "Due Diligence":
      return "bg-accent-light text-accent";
    case "FDD Analysis":
      return "bg-warning-light text-warning";
    case "Investment Guide":
      return "bg-success-light text-success";
    case "Getting Started":
      return "bg-cyan-light text-cyan";
    default:
      return "bg-surface text-muted";
  }
}

export default function GuidesPage() {
  const featuredGuides = guides.filter(
    (g) => g.featured && g.slug !== GLOSSARY_SLUG
  );
  const nonFeaturedGuides = guides.filter(
    (g) => !g.featured && g.slug !== GLOSSARY_SLUG
  );
  const glossary = guides.find((g) => g.slug === GLOSSARY_SLUG);

  /* Total count excludes the glossary (it's a reference, not a guide) */
  const guideCount = guides.filter((g) => g.slug !== GLOSSARY_SLUG).length;

  return (
    <>
      {/* Hero */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-light text-accent text-sm font-semibold">
                {guideCount} guides
              </span>
              <span className="text-muted text-sm">free &amp; independent</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Franchise Due Diligence Guides
            </h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Independent, data-driven guides to help you evaluate franchise investments
              with confidence. Written for buyers, never influenced by franchisors.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {guideCategories.map((cat) => (
                <span
                  key={cat}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColor(cat)}`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      {featuredGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground">Featured Guides</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-warning-light text-warning text-xs font-medium">
              Start here
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block border border-border rounded-xl p-6 hover-glow bg-background"
              >
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${categoryColor(guide.category)}`}
                >
                  {guide.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                  {guide.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {guide.readingTime} min read
                  </span>
                  <span>
                    {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Guides by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {guideCategories.map((cat) => {
          const catGuides = nonFeaturedGuides.filter((g) => g.category === cat);
          if (catGuides.length === 0) return null;
          return (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold text-foreground">{cat}</h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColor(cat)}`}
                >
                  {catGuides.length} guide{catGuides.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-col border border-border rounded-lg p-5 hover-glow bg-background"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColor(guide.category)}`}
                      >
                        {guide.category}
                      </span>
                      <span className="text-[11px] text-muted">
                        {guide.readingTime} min
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                      {guide.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2 flex-1">
                      {guide.description}
                    </p>
                    <p className="mt-3 text-[11px] text-muted">
                      Updated{" "}
                      {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Glossary Featured Resource */}
      {glossary && (
        <section className="border-t border-border bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-xl border border-border bg-background p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center text-2xl">
                  📖
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface text-muted text-[10px] font-medium mb-2">
                    Reference
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {glossary.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed max-w-xl">
                    {glossary.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {glossary.readingTime} min read
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(glossary.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/guides/${GLOSSARY_SLUG}`}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-white transition-colors"
              >
                View Glossary
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
