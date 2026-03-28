import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.teaser,
    alternates: { canonical: `https://franchisel.com/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.teaser,
      url: `https://franchisel.com/blog/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

const categoryColors: Record<string, string> = {
  "Market Analysis": "bg-blue-50 text-blue-700 border-blue-200",
  "Due Diligence": "bg-amber-50 text-amber-700 border-amber-200",
  "Brand Analysis": "bg-purple-50 text-purple-700 border-purple-200",
  "Category Report": "bg-teal-50 text-teal-700 border-teal-200",
  "Legal": "bg-red-50 text-red-700 border-red-200",
  "Comparison": "bg-green-50 text-green-700 border-green-200",
};

function renderContent(content: string) {
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    // Section headers: ALL CAPS word(s) followed by colon
    if (/^[A-Z0-9 &/\-—]{4,}[\s—:-]/.test(trimmed) && trimmed.length < 120) {
      const colonIdx = trimmed.search(/[—:-]/);
      if (colonIdx > 0 && colonIdx < 60) {
        const heading = trimmed.slice(0, colonIdx).trim();
        const body = trimmed.slice(colonIdx + 1).trim();
        return (
          <div key={i} className="mt-8 first:mt-0">
            <h2 className="text-base font-semibold text-foreground mb-2 uppercase tracking-wide text-[13px]">
              {heading}
            </h2>
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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const relatedArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://franchisel.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://franchisel.com/blog" },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `https://franchisel.com/blog/${article.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: article.title,
        description: article.teaser,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
          "@type": "Organization",
          name: "Franchisel",
          url: "https://franchisel.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Franchisel",
          url: "https://franchisel.com",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {article.title}
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
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  categoryColors[article.category] ?? "bg-surface-alt text-muted border-border"
                }`}
              >
                {article.category}
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {article.title}
              </h1>
              <p className="mt-3 text-base text-muted leading-relaxed">{article.teaser}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
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
                  {article.readingTime} min read
                </span>
                <span>
                  Published{" "}
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </header>

            {/* Article content */}
            <div className="space-y-5 prose-sm max-w-none">{renderContent(article.content)}</div>

            {/* CTA */}
            <div className="mt-12 border border-accent/20 rounded-xl p-6 sm:p-8 bg-accent-light">
              <h3 className="text-lg font-semibold text-foreground">
                Research franchise brands in our directory
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Browse FDD-sourced data on hundreds of franchise brands — investment requirements,
                unit economics, litigation history, and franchisee satisfaction scores.
              </p>
              <Link
                href="/brands"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"
                  />
                </svg>
                Browse Franchise Directory
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-20 space-y-6">
              {/* Related Articles */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h3 className="text-sm font-semibold text-foreground mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((ra) => (
                    <Link key={ra.slug} href={`/blog/${ra.slug}`} className="block group">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          categoryColors[ra.category] ?? "bg-surface-alt text-muted border-border"
                        }`}
                      >
                        {ra.category}
                      </span>
                      <p className="mt-1 text-xs font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
                        {ra.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {ra.readingTime} min read &middot; {ra.date}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/brands" className="text-xs text-accent hover:underline">
                      Browse Directory
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="text-xs text-accent hover:underline">
                      Compare Brands
                    </Link>
                  </li>
                  <li>
                    <Link href="/about/methodology" className="text-xs text-accent hover:underline">
                      Methodology
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
