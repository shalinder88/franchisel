import type { Metadata } from "next"
import Link from "next/link"
import { getIndexableBrands } from "@/data/brands"
import {
  computeRevenueChanges,
  topGainers,
  topDecliners,
  droppedItem19,
  coverageCount,
  type RevenueChange,
} from "@/lib/filing-changes"

export const metadata: Metadata = {
  title: "FDD Filing Changes \u2014 Year-over-Year Movement Across Franchises",
  description:
    "Free tool that surfaces the franchises whose unit economics moved the most between FDD filings. Biggest revenue gainers, biggest decliners, and brands that quietly dropped their Item 19 disclosure.",
  alternates: {
    canonical: "https://franchisel.com/tools/filing-changes",
  },
  openGraph: {
    title: "FDD Filing Changes",
    description:
      "Cross-brand year-over-year FDD filing changes \u2014 biggest revenue movers and disclosure changes.",
    url: "https://franchisel.com/tools/filing-changes",
  },
}

export const revalidate = 86400

function fmtUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function fmtPct(n: number): string {
  const sign = n >= 0 ? "+" : ""
  return `${sign}${(n * 100).toFixed(1)}%`
}

function ChangeRow({ row }: { row: RevenueChange }) {
  const isUp = row.pctChange >= 0
  return (
    <tr className="border-t border-border/60 align-top">
      <td className="py-3 pr-3">
        <Link
          href={`/brands/${row.brand.slug}`}
          className="text-sm font-semibold text-foreground hover:text-accent"
        >
          {row.brand.name}
        </Link>
        <div className="text-xs text-muted mt-0.5">
          {row.brand.category.replace(/-/g, " ")}
        </div>
      </td>
      <td className="py-3 pr-3 text-right text-sm tabular-nums text-foreground/85 whitespace-nowrap">
        {fmtUsd(row.priorAvg)}
        <div className="text-xs text-muted mt-0.5">{row.priorYear}</div>
      </td>
      <td className="py-3 pr-3 text-right text-sm tabular-nums text-foreground whitespace-nowrap">
        {fmtUsd(row.currentAvg)}
        <div className="text-xs text-muted mt-0.5">{row.currentYear}</div>
      </td>
      <td className={`py-3 pr-3 text-right text-sm font-bold tabular-nums whitespace-nowrap ${isUp ? "text-success" : "text-danger"}`}>
        {fmtPct(row.pctChange)}
        <div className={`text-xs mt-0.5 ${isUp ? "text-success/70" : "text-danger/70"}`}>
          {isUp ? "+" : ""}{fmtUsd(row.deltaUsd)}
        </div>
      </td>
      <td className="py-3 text-right whitespace-nowrap">
        <Link
          href={`/brands/${row.brand.slug}/diff`}
          className="text-xs text-accent hover:underline"
        >
          See details &rarr;
        </Link>
      </td>
    </tr>
  )
}

function ChangeTable({ rows, emptyText }: { rows: RevenueChange[]; emptyText: string }) {
  if (rows.length === 0) {
    return (
      <div className="text-sm text-muted py-6 text-center border border-border rounded-lg bg-surface">
        {emptyText}
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-muted">
            <th className="text-left py-2.5 px-4">Brand</th>
            <th className="text-right py-2.5 px-3">Prior avg</th>
            <th className="text-right py-2.5 px-3">Current avg</th>
            <th className="text-right py-2.5 px-3">YoY change</th>
            <th className="py-2.5 pr-4"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => <ChangeRow key={r.brand.slug} row={r} />)}
        </tbody>
      </table>
    </div>
  )
}

export default async function FilingChangesPage() {
  const brands = getIndexableBrands()
  const changes = computeRevenueChanges(brands)
  const gainers = topGainers(changes, 10)
  const decliners = topDecliners(changes, 10)
  const dropped = droppedItem19(brands)
  const coverage = coverageCount(brands)

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
          Free buyer tool
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          FDD Filing Changes
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl leading-relaxed">
          Franchise risk often shows up in the year-over-year delta first, not
          the snapshot. A brand whose disclosed average just fell 12% is a
          different investment than the same brand a year ago. So is one that
          quietly stopped publishing Item 19. This tool surfaces both.
        </p>
        <p className="mt-3 text-xs text-muted">
          YoY data available for {coverage} brand{coverage === 1 ? "" : "s"} so far. Coverage grows as new filings are processed.
        </p>
      </header>

      {/* Top gainers */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-3">
          Biggest reported revenue gains
        </h2>
        <p className="text-sm text-muted mb-4 max-w-3xl leading-relaxed">
          Brands whose Item 19 average grew most versus the prior FDD. A jump
          can be real same-store growth, but it can also reflect a cohort
          change (e.g. removing weak units from the disclosure population).
          Always check the basis before celebrating the headline.
        </p>
        <ChangeTable rows={gainers} emptyText="No YoY gainers in the current dataset." />
      </section>

      {/* Top decliners */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-3">
          Biggest reported revenue declines
        </h2>
        <p className="text-sm text-muted mb-4 max-w-3xl leading-relaxed">
          Brands whose Item 19 average fell most versus the prior FDD. This is
          a leading signal worth taking seriously. Confirm with current
          operators whether unit-level performance has eroded or whether the
          disclosure cohort changed.
        </p>
        <ChangeTable rows={decliners} emptyText="No YoY decliners in the current dataset." />
      </section>

      {/* Dropped Item 19 */}
      {dropped.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-3">
            Brands that dropped Item 19 this filing
          </h2>
          <p className="text-sm text-muted mb-4 max-w-3xl leading-relaxed">
            Franchisors are not required to publish an Item 19. When a brand
            had one in the prior FDD and removed it in the current one, ask
            why. Common reasons: numbers no longer flatter the system, a new
            management team, or a regulator question about prior figures.
          </p>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <ul className="space-y-2">
              {dropped.map((b) => (
                <li key={b.slug} className="flex items-baseline gap-3">
                  <span className="text-warning text-xs">&bull;</span>
                  <Link href={`/brands/${b.slug}`} className="text-sm font-semibold text-foreground hover:text-accent">
                    {b.name}
                  </Link>
                  <span className="text-xs text-muted">
                    Prior avg: {fmtUsd(b.item19Prior!.grossRevenueAvg!)} ({b.item19Prior!.fddYear})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-base font-semibold text-foreground mb-3">
          What you&apos;re looking at
        </h2>
        <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed max-w-3xl">
          <li>&middot; Revenue figures come from each brand&apos;s most recent and prior Item 19 disclosures filed with state franchise regulators.</li>
          <li>&middot; A YoY change can reflect real same-store performance change OR a cohort/basis change in how the franchisor defined the included population. The two have very different meanings.</li>
          <li>&middot; Click <em>See details</em> on any row to open the per-brand filing-change page with the full deltas.</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tools/contradiction-finder" className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent">
            Contradiction Finder
          </Link>
          <Link href="/tools/fee-stack" className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent">
            True Fee Stack
          </Link>
          <Link href="/tools/item-19-quality" className="px-4 py-2 rounded-lg border border-border bg-surface text-foreground text-sm hover:border-accent">
            Item 19 Quality Grader
          </Link>
        </div>
      </section>
    </main>
  )
}
