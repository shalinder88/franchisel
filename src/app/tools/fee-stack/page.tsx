import type { Metadata } from "next"
import Link from "next/link"
import { getBrandBySlug, getIndexableBrands } from "@/data/brands"
import { buildFeeStack, annualizedAtRevenue, type FeeLine } from "@/lib/fee-stack"

export const metadata: Metadata = {
  title: "True Fee Stack — Every Franchise Fee in One View",
  description:
    "Free tool that assembles every fee a franchise charges \u2014 royalty, ad fund, technology, training travel, transfer, renewal, supplier markup, mandated upgrades, local marketing floor \u2014 from the filed FDD. Annualized at sample revenue.",
  alternates: {
    canonical: "https://franchisel.com/tools/fee-stack",
  },
  openGraph: {
    title: "True Fee Stack \u2014 Every Franchise Fee in One View",
    description:
      "Pull every disclosed fee from a franchise FDD into one stacked view, annualized at the revenue you want to model.",
    url: "https://franchisel.com/tools/fee-stack",
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

const SAMPLE_REVENUES = [500_000, 1_000_000, 2_000_000]

function fmtUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function fmtPct(n: number, digits = 1): string {
  return (n * 100).toFixed(digits) + "%"
}

function categoryBadge(category: FeeLine["category"]) {
  const map: Record<FeeLine["category"], { label: string; cls: string }> = {
    one_time: { label: "One-time", cls: "bg-cyan-light text-cyan border-cyan/20" },
    recurring_pct: { label: "% of sales", cls: "bg-warning-light text-warning border-warning/20" },
    recurring_fixed: { label: "Recurring", cls: "bg-warning-light text-warning border-warning/20" },
    event_triggered: { label: "If triggered", cls: "bg-cyan-light text-cyan border-cyan/20" },
    lock_in: { label: "Lock-in", cls: "bg-danger-light text-danger border-danger/20" },
    other: { label: "Other", cls: "bg-surface-alt text-muted border-border" },
  }
  return map[category]
}

function FeeRow({ line }: { line: FeeLine }) {
  const badge = categoryBadge(line.category)
  return (
    <tr className="border-t border-border/60 align-top">
      <td className="py-2.5 pr-3">
        <div className="text-sm font-medium text-foreground leading-snug">{line.label}</div>
        {line.note && (
          <div className="text-xs text-muted mt-0.5 leading-snug">{line.note}</div>
        )}
      </td>
      <td className="py-2.5 pr-3 text-sm text-foreground/85 leading-snug">
        {line.raw}
      </td>
      <td className="py-2.5 pr-3 whitespace-nowrap">
        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border ${badge.cls}`}>
          {badge.label}
        </span>
      </td>
      <td className="py-2.5 text-xs text-muted whitespace-nowrap">{line.sourceItem}</td>
    </tr>
  )
}

export default async function FeeStackPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const params = await searchParams
  const allBrands = getIndexableBrands()
  const slug = (params.slug ?? "").trim().toLowerCase()
  const brand = slug ? getBrandBySlug(slug) : null
  const stack = brand ? buildFeeStack(brand) : null
  const featured = FEATURED_SLUGS
    .map((s) => allBrands.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
  const sortedBrands = [...allBrands].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
          Free buyer tool
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          True Fee Stack
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl leading-relaxed">
          Most franchise affordability calculators model royalty and ad fund
          and stop. The cash drag on real units comes from the long tail:
          technology, training travel, mandated upgrades, transfer and
          renewal fees, supplier markup, local marketing floors. This tool
          pulls every disclosed line from the filed FDD into one stacked view.
        </p>
      </header>

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
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition-all whitespace-nowrap"
          >
            Build fee stack
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
                  href={`/tools/fee-stack?slug=${b.slug}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface-alt border border-border hover:border-accent text-foreground"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {brand && stack && (
        <section className="space-y-8">
          {/* Headline numbers */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Recurring % of sales</div>
              <div className="text-3xl font-black text-foreground tabular-nums">
                {fmtPct(stack.totalRecurringPct, 2)}
              </div>
              <div className="text-xs text-muted mt-1">Sum of all percent-of-sales fees we could parse from the FDD.</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">One-time at signing</div>
              <div className="text-3xl font-black text-foreground tabular-nums">
                {fmtUsd(stack.totalOneTimeUsd)}
              </div>
              <div className="text-xs text-muted mt-1">Initial fees we can name. Build-out and equipment are separate (Item 7).</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Lines surfaced</div>
              <div className="text-3xl font-black text-foreground tabular-nums">
                {stack.oneTime.length + stack.recurring.length + stack.eventTriggered.length}
              </div>
              <div className="text-xs text-muted mt-1">Distinct fee lines we found in the {brand.fddYear} {brand.name} FDD.</div>
            </div>
          </div>

          {/* Annualized at sample revenue */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-foreground mb-3">
              Annualized recurring cost at sample revenue
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted">
                    <th className="text-left py-2">Gross sales</th>
                    <th className="text-right py-2">% of sales fees</th>
                    <th className="text-right py-2">Fixed recurring</th>
                    <th className="text-right py-2">Total / year</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_REVENUES.map((rev) => {
                    const a = annualizedAtRevenue(stack, rev)
                    return (
                      <tr key={rev} className="border-t border-border/60 tabular-nums">
                        <td className="py-2.5 text-foreground">{fmtUsd(rev)}</td>
                        <td className="py-2.5 text-right text-foreground/85">{fmtUsd(a.pctCost)}</td>
                        <td className="py-2.5 text-right text-foreground/85">{fmtUsd(a.fixedCost)}</td>
                        <td className="py-2.5 text-right font-semibold text-foreground">{fmtUsd(a.total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-3 leading-relaxed">
              Excludes one-time fees, event-triggered fees, supplier markup
              (often material but not numerically disclosed), and any
              percent-of-sales line we could not parse to a number.
            </p>
          </div>

          {/* One-time */}
          {stack.oneTime.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-foreground mb-3">One-time fees at signing</h2>
              <table className="w-full">
                <tbody>
                  {stack.oneTime.map((l) => <FeeRow key={l.id} line={l} />)}
                </tbody>
              </table>
            </div>
          )}

          {/* Recurring */}
          {stack.recurring.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-foreground mb-3">
                Recurring fees ({stack.recurring.length})
              </h2>
              <table className="w-full">
                <tbody>
                  {stack.recurring.map((l) => <FeeRow key={l.id} line={l} />)}
                </tbody>
              </table>
            </div>
          )}

          {/* Event-triggered */}
          {stack.eventTriggered.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-foreground mb-3">
                If triggered ({stack.eventTriggered.length})
              </h2>
              <p className="text-xs text-muted mb-3">
                You don&apos;t pay these every year. You do pay them at the moments
                that matter most: renewing, selling, training a new manager,
                resolving a default.
              </p>
              <table className="w-full">
                <tbody>
                  {stack.eventTriggered.map((l) => <FeeRow key={l.id} line={l} />)}
                </tbody>
              </table>
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
              Run the Contradiction Finder
            </Link>
            <Link
              href="/tools/fee-stack"
              className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent"
            >
              Check another brand
            </Link>
          </footer>
        </section>
      )}

      {!brand && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-base font-semibold text-foreground mb-3">
            What this tool does, exactly
          </h2>
          <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed max-w-3xl">
            <li>&middot; Pulls structured fee fields directly from the filed FDD: royalty, ad fund, technology fee, initial fee, renewal fee, transfer fee, required-supplier flag.</li>
            <li>&middot; Pulls and classifies the long-tail &ldquo;other ongoing fees&rdquo; strings the franchisor itemizes in Item 6 (local marketing floors, percentage rent, brand fund increases, training fees per added employee, audit fees, etc.).</li>
            <li>&middot; Sums every percent-of-sales line so you can see the real ongoing rate, not just the headline royalty.</li>
            <li>&middot; Annualizes everything at three sample revenue levels so the dollar number is concrete.</li>
            <li>&middot; Separates &ldquo;you always pay this&rdquo; from &ldquo;you only pay this when you trigger it&rdquo; (renewal, transfer, training new staff). The triggers are real cash exits a buyer rarely models.</li>
          </ul>
        </section>
      )}
    </main>
  )
}
