import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "@/data/brands";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://franchisel.com/guides/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://franchisel.com/guides/${slug}`,
      type: "article",
    },
  };
}

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

function renderContent(content: string) {
  // Split into paragraphs on double newline or \n\n patterns
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    // Section headers: ALL CAPS word(s) followed by em dash or colon
    if (/^[A-Z0-9 &/\-—]{4,}[\s—:-]/.test(trimmed) && trimmed.length < 120) {
      const colonIdx = trimmed.search(/[—:-]/);
      if (colonIdx > 0 && colonIdx < 60) {
        const heading = trimmed.slice(0, colonIdx).trim();
        const body = trimmed.slice(colonIdx + 1).trim();
        return (
          <div key={i} className="mt-8 first:mt-0">
            <h2 className="text-base font-semibold text-foreground mb-2 uppercase tracking-wide text-[13px]">{heading}</h2>
            {body && <p className="text-sm text-foreground/80 leading-7">{body}</p>}
          </div>
        );
      }
    }
    return (
      <p key={i} className="text-sm text-foreground/80 leading-7">
        {trimmed}
      </p>
    );
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const relatedGuides = guides.filter((g) => g.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://franchisel.com" },
          { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://franchisel.com/guides" },
          { "@type": "ListItem", "position": 3, "name": guide.title, "item": `https://franchisel.com/guides/${guide.slug}` },
        ],
      },
      {
        "@type": "Article",
        "headline": guide.title,
        "description": guide.description,
        "datePublished": guide.publishedAt,
        "dateModified": guide.updatedAt,
        "author": { "@type": "Organization", "name": "Franchisel", "url": "https://franchisel.com" },
        "publisher": { "@type": "Organization", "name": "Franchisel", "url": "https://franchisel.com" },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/guides" className="hover:text-accent transition-colors">
              Guides
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {guide.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          {/* Main content */}
          <article>
            {/* Header */}
            <header className="mb-10">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${categoryColor(guide.category)}`}
              >
                {guide.category}
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {guide.title}
              </h1>
              <p className="mt-3 text-base text-muted leading-relaxed">{guide.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {guide.readingTime} min read
                </span>
                <span>
                  Published{" "}
                  {new Date(guide.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>
                  Updated{" "}
                  {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </header>

            {/* Guide content */}
            <div className="space-y-5 prose-sm max-w-none">
              {renderContent(guide.content)}
            </div>

            {/* CTA */}
            <div className="mt-12 border border-accent/20 rounded-xl p-6 sm:p-8 bg-accent-light">
              <h3 className="text-lg font-semibold text-foreground">
                Need detailed analysis on a specific brand?
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Get a comprehensive FDD analysis report with financial projections, red flag
                identification, and competitive benchmarking.
              </p>
              <Link
                href="/reports"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
                Get a Full Brand Report
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-20 space-y-6">
              {/* Related Guides */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h3 className="text-sm font-semibold text-foreground mb-4">Related Guides</h3>
                <div className="space-y-3">
                  {relatedGuides.map((rg) => (
                    <Link
                      key={rg.slug}
                      href={`/guides/${rg.slug}`}
                      className="block group"
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColor(rg.category)}`}
                      >
                        {rg.category}
                      </span>
                      <p className="mt-1 text-xs font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
                        {rg.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">{rg.readingTime} min read</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/brands" className="text-xs text-accent hover:underline">
                      Browse Franchise Directory
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="text-xs text-accent hover:underline">
                      Compare Brands
                    </Link>
                  </li>
                  <li>
                    <Link href="/community" className="text-xs text-accent hover:underline">
                      Read Franchisee Reviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/about/methodology" className="text-xs text-accent hover:underline">
                      Our Methodology
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
