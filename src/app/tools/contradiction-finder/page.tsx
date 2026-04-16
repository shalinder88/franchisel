import type { Metadata } from "next"
import Link from "next/link"
import { getBrandBySlug, getIndexableBrands } from "@/data/brands"
import ContradictionList from "@/components/ContradictionList"
import { detectContradictions } from "@/lib/contradictions"

export const metadata: Metadata = {
  title: "FDD Contradiction Finder — Spot Self-Conflicting Disclosures",
  description:
    "Free tool that surfaces contradictions inside a franchise's filed FDD: 'exclusive' territories with reservation carve-outs, Item 19 averages contradicted by Item 20 churn, short termination cures combined with multi-year non-competes, and more.",
  alternates: {
    canonical: "https://franchisel.com/tools/contradiction-finder",
  },
  openGraph: {
    title: "FDD Contradiction Finder",
    description:
      "Surface statements inside a franchise's FDD that disagree with each other or with the franchisor's own marketing.",
    url: "https://franchisel.com/tools/contradiction-finder",
  },
}

// ISR: render on first hit, cache for 24h.
export const revalidate = 86400

const FEATURED_SLUGS = [
  "mcdonalds",
  "burger-king",
  "subway",
  "chick-fil-a",
  "ivybrook-academy",
  "rocky-rococo-pizza-and-pasta",
]

export default async function ContradictionFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const params = await searchParams
  const allBrands = getIndexableBrands()
  const slug = (params.slug ?? "").trim().toLowerCase()
  const brand = slug ? getBrandBySlug(slug) : null
  const featured = FEATURED_SLUGS
    .map((s) => allBrands.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  // Sorted by name for the dropdown.
  const sortedBrands = [...allBrands].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <header className="mb-10">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
          Free buyer tool
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          FDD Contradiction Finder
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl leading-relaxed">
          Most franchise risks are not hidden. They are disclosed, but in two
          different items of the same FDD that disagree with each other. This
          tool surfaces the conflicts so you walk into validation calls and
          attorney review knowing what to ask.
        </p>
      </header>

      {/* What it checks for */}
      <section className="rounded-2xl border border-border bg-surface-alt p-6 mb-10">
        <h2 className="text-base font-semibold text-foreground mb-3">
          What this tool checks for
        </h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground/85">
          <li>&middot; &quot;Exclusive territory&quot; vs reservation-of-rights carve-outs (Item 12)</li>
          <li>&middot; Territory protection vs online/delivery sales reserved by franchisor</li>
          <li>&middot; Item 19 averages vs Item 20 closure and termination rates</li>
          <li>&middot; Net unit growth vs heavy ownership-transfer activity</li>
          <li>&middot; Required suppliers + franchisor-affiliate revenue (markup risk)</li>
          <li>&middot; Short termination cure window combined with post-term non-competes (Item 17)</li>
          <li>&middot; Item 19 reporting revenue with no operating-cost layer disclosed</li>
          <li>&middot; Item 21 audit opinion modifications (going concern, qualified, adverse)</li>
          <li>&middot; Item 19 ambiguity about whether the metric is sales, gross profit, or earnings</li>
          <li>&middot; Year-over-year Item 19 declines that contradict marketing momentum</li>
        </ul>
        <p className="mt-4 text-xs text-muted leading-relaxed">
          Every flagged contradiction cites the FDD items it reads from. The
          tool will only fire a rule when the underlying fields are populated
          for the brand &mdash; missing data is silence, never a false positive.
        </p>
      </section>

      {/* Brand selector */}
      <section className="rounded-2xl border border-border bg-surface p-6 mb-8">
        <form method="get" className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label htmlFor="brand-select" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Choose a franchise
            </label>
            <select
              id="brand-select"
              name="slug"
              defaultValue={brand?.slug ?? ""}
              className="w-full rounded-lg border border-border bg-surface-alt text-foreground text-sm px-3 py-2.5 focus:outline-none focus:border-accent"
            >
              <option value="">— Select a brand —</option>
              {sortedBrands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition-all whitespace-nowrap"
          >
            Run check
          </button>
        </form>

        {!brand && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-muted mb-3">
              Or jump straight to a featured filing
            </p>
            <div className="flex flex-wrap gap-2">
              {featured.map((b) => (
                <Link
                  key={b.slug}
                  href={`/tools/contradiction-finder?slug=${b.slug}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface-alt border border-border hover:border-accent text-foreground"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Results */}
      {brand ? (
        <section>
          <header className="mb-5">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">
              Result &middot; {brand.fddYear} FDD
            </p>
            <h2 className="text-2xl font-bold text-foreground">
              Contradictions in the {brand.name} filing
            </h2>
            <p className="mt-1 text-sm text-muted">
              {(() => {
                const n = detectContradictions(brand).length
                if (n === 0) return "No rules fired on the fields currently extracted for this brand."
                if (n === 1) return "1 contradiction surfaced. Read the source items in the filing before signing."
                return `${n} contradictions surfaced. Read the source items in the filing before signing.`
              })()}
            </p>
          </header>

          <ContradictionList brand={brand} />

          <footer className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/brands/${brand.slug}`}
              className="px-4 py-2 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110"
            >
              Open the full {brand.name} analysis &rarr;
            </Link>
            <Link
              href="/tools/contradiction-finder"
              className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent"
            >
              Check another brand
            </Link>
          </footer>
        </section>
      ) : null}

      {!brand && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-base font-semibold text-foreground mb-3">
            Why we built this
          </h2>
          <p className="text-sm text-foreground/85 leading-relaxed max-w-3xl">
            Most generic FDD analyzers grade a filing on a single risk score or
            extract a list of red flags. That is useful, but it misses the
            specific class of risk that actually destroys franchise investments:
            two disclosures inside the same document that quietly contradict
            each other. Our analysts track these patterns brand by brand, and
            this tool is the public-facing version of that work.
          </p>
        </section>
      )}
    </main>
  )
}
