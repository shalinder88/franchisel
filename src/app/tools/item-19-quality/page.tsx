import type { Metadata } from "next"
import Link from "next/link"
import { getBrandBySlug, getIndexableBrands } from "@/data/brands"
import { gradeItem19, type Item19Grade } from "@/lib/item19-quality"

export const metadata: Metadata = {
  title: "Item 19 Quality Grader \u2014 Is the Revenue Number Decision-Useful?",
  description:
    "Free tool that grades a franchise's Item 19 financial performance representation on the dimensions that decide whether the number is decision-useful: sample size, cohort basis, metric type, expense coverage, vintage, cohort consistency.",
  alternates: {
    canonical: "https://franchisel.com/tools/item-19-quality",
  },
  openGraph: {
    title: "Item 19 Quality Grader",
    description:
      "Stop treating every Item 19 as equal. Grade the disclosure on what actually makes the number usable.",
    url: "https://franchisel.com/tools/item-19-quality",
  },
}

export const revalidate = 86400

const FEATURED_SLUGS = [
  "mcdonalds",
  "burger-king",
  "subway",
  "chick-fil-a",
  "ivybrook-academy",
  "rocky-rococo-pizza-and-pasta",
]

function gradeStyles(grade: Item19Grade) {
  switch (grade) {
    case "A": return { bg: "bg-success/10", border: "border-success/40", text: "text-success" }
    case "B": return { bg: "bg-success/5", border: "border-success/30", text: "text-success" }
    case "C": return { bg: "bg-warning/10", border: "border-warning/40", text: "text-warning" }
    case "D": return { bg: "bg-warning/15", border: "border-warning/50", text: "text-warning" }
    case "F": return { bg: "bg-danger/10", border: "border-danger/40", text: "text-danger" }
  }
}

function severityChip(severity: "info" | "minor" | "major") {
  if (severity === "major") return "bg-danger-light text-danger border-danger/20"
  if (severity === "minor") return "bg-warning-light text-warning border-warning/20"
  return "bg-cyan-light text-cyan border-cyan/20"
}

function severityLabel(severity: "info" | "minor" | "major") {
  if (severity === "major") return "Major"
  if (severity === "minor") return "Minor"
  return "Info"
}

function dimensionBarColor(score: number) {
  if (score >= 75) return "bg-success/70"
  if (score >= 55) return "bg-warning/70"
  return "bg-danger/60"
}

export default async function Item19QualityPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const params = await searchParams
  const allBrands = getIndexableBrands()
  const slug = (params.slug ?? "").trim().toLowerCase()
  const brand = slug ? getBrandBySlug(slug) : null
  const result = brand ? gradeItem19(brand) : null
  const featured = FEATURED_SLUGS
    .map((s) => allBrands.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
  const sortedBrands = [...allBrands].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
          Free buyer tool
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Item 19 Quality Grader
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl leading-relaxed">
          Most sites display Item 19 averages as if they were all equal. They
          are not. A $1.2M average from 28 stratified franchisee units open
          three or more years is a different number than a $1.2M average from
          a hand-picked subset. This tool grades the disclosure on the
          dimensions that decide whether the headline is actually
          decision-useful.
        </p>
      </header>

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
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition-all whitespace-nowrap"
          >
            Grade Item 19
          </button>
        </form>

        {!brand && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-muted mb-3">
              Or jump to a featured filing
            </p>
            <div className="flex flex-wrap gap-2">
              {featured.map((b) => (
                <Link
                  key={b.slug}
                  href={`/tools/item-19-quality?slug=${b.slug}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface-alt border border-border hover:border-accent text-foreground"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {brand && result && (
        <section className="space-y-8">
          {/* Grade card */}
          {(() => {
            const styles = gradeStyles(result.grade)
            return (
              <div className={`rounded-2xl border ${styles.border} ${styles.bg} p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6`}>
                <div className={`text-7xl font-black tabular-nums ${styles.text} leading-none`}>
                  {result.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">
                    {brand.name} &middot; {brand.fddYear} FDD
                  </p>
                  <h2 className="text-xl font-bold text-foreground leading-tight">
                    {result.verdict}
                  </h2>
                  {result.hasItem19 && (
                    <p className="text-sm text-muted mt-2">
                      Composite quality score: <span className="text-foreground font-semibold">{result.score} / 100</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })()}

          {/* Per-dimension breakdown */}
          {result.dimensions.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-foreground mb-4">
                What the grade is built from
              </h2>
              <div className="space-y-4">
                {result.dimensions.map((d) => (
                  <div key={d.id}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="text-sm font-medium text-foreground">{d.label}</div>
                      <div className="text-xs text-muted tabular-nums">{d.score} / 100</div>
                    </div>
                    <div className="h-2 rounded-full bg-surface-alt overflow-hidden mb-1">
                      <div
                        className={`h-full ${dimensionBarColor(d.score)} rounded-full`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted leading-snug">{d.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concerns */}
          {result.concerns.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">
                Specific things to verify
              </h2>
              <div className="space-y-3">
                {result.concerns.map((c) => (
                  <article key={c.id} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground leading-snug flex-1 min-w-0">
                        {c.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border whitespace-nowrap ${severityChip(c.severity)}`}>
                        {severityLabel(c.severity)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{c.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          <footer className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              href={`/brands/${brand.slug}`}
              className="px-4 py-2 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110"
            >
              Open the full {brand.name} analysis &rarr;
            </Link>
            <Link
              href={`/tools/contradiction-finder?slug=${brand.slug}`}
              className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent"
            >
              Contradiction Finder
            </Link>
            <Link
              href={`/tools/fee-stack?slug=${brand.slug}`}
              className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent"
            >
              True Fee Stack
            </Link>
            <Link
              href="/tools/item-19-quality"
              className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent"
            >
              Grade another brand
            </Link>
          </footer>
        </section>
      )}

      {!brand && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-base font-semibold text-foreground mb-3">
            What we grade for
          </h2>
          <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed max-w-3xl">
            <li>&middot; <strong>Sample size</strong> &mdash; how many units the average covers, and how many were excluded.</li>
            <li>&middot; <strong>Cohort basis</strong> &mdash; all units, only mature units, a subset, or a geographic slice.</li>
            <li>&middot; <strong>Metric type clarity</strong> &mdash; gross sales, net sales, gross profit, EBITDA, operating income, net income? Same number, very different meanings.</li>
            <li>&middot; <strong>Expense coverage</strong> &mdash; revenue only, franchisor fees only, partial OpEx, or full P&amp;L?</li>
            <li>&middot; <strong>Vintage</strong> &mdash; how old the measurement year is relative to the current FDD.</li>
            <li>&middot; <strong>Same-cohort consistency</strong> &mdash; do the revenue and expense figures cover the same units?</li>
            <li>&middot; <strong>Extraction confidence</strong> &mdash; whether our automated read of the disclosure was strong or weak.</li>
          </ul>
        </section>
      )}
    </main>
  )
}
