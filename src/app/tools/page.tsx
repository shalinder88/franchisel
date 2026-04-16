import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Free Franchise Buyer Tools",
  description:
    "Free tools that pull directly from the filed FDD: contradiction finder, true fee stack, Item 19 quality grader, and year-over-year filing changes. No signup, no email gate.",
  alternates: {
    canonical: "https://franchisel.com/tools",
  },
  openGraph: {
    title: "Free Franchise Buyer Tools \u2014 Franchisel",
    description:
      "Four buyer-side tools built from filed FDD data. No signup, no email gate.",
    url: "https://franchisel.com/tools",
  },
}

const tools = [
  {
    href: "/tools/contradiction-finder",
    title: "FDD Contradiction Finder",
    blurb:
      "Surfaces statements inside a single FDD that disagree with each other or with the franchisor\u2019s own marketing. 11 detection rules across Items 8, 12, 17, 19, 20, 21.",
    cta: "Find contradictions",
    accent: "border-warning/40 bg-warning/5",
  },
  {
    href: "/tools/fee-stack",
    title: "True Fee Stack",
    blurb:
      "Assembles every disclosed fee from the filed FDD into one stacked view, annualized at $500K / $1M / $2M sample revenue. Includes the long-tail fees most calculators miss.",
    cta: "Build fee stack",
    accent: "border-cyan/40 bg-cyan/5",
  },
  {
    href: "/tools/item-19-quality",
    title: "Item 19 Quality Grader",
    blurb:
      "Grades a brand\u2019s Item 19 financial performance representation A through F based on sample size, cohort basis, metric type clarity, expense coverage, vintage, and same-cohort consistency.",
    cta: "Grade Item 19",
    accent: "border-success/40 bg-success/5",
  },
  {
    href: "/tools/filing-changes",
    title: "FDD Filing Changes",
    blurb:
      "Cross-brand year-over-year view. Biggest reported revenue gainers, biggest decliners, and brands that quietly dropped Item 19 between filings.",
    cta: "See changes",
    accent: "border-accent/40 bg-accent/5",
  },
]

export default function ToolsIndexPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-3">
          Buyer-side tools, no signup
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Free franchise diligence tools
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl leading-relaxed">
          Four tools that pull directly from the filed FDD. None of them ask
          for an email. None of them estimate the answer with sector averages.
          They show you what the filing actually says, and what it
          contradicts.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-5">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`group rounded-2xl border ${t.accent} p-6 hover:border-accent transition-colors block`}
          >
            <h2 className="text-xl font-bold text-foreground mb-2 leading-tight">
              {t.title}
            </h2>
            <p className="text-sm text-foreground/85 leading-relaxed mb-4">
              {t.blurb}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:underline">
              {t.cta} &rarr;
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-base font-semibold text-foreground mb-3">
          Why these tools and not others
        </h2>
        <p className="text-sm text-foreground/85 leading-relaxed max-w-3xl">
          Most franchise sites publish calculators that ask the buyer to type
          in royalty, ad fund, COGS, rent, and labor by hand. Those tools
          model a brand the buyer already had in their head. Ours start from
          what the franchisor disclosed in their actual filing and surface the
          parts a buyer would otherwise miss \u2014 fee long-tail, cohort
          selection bias, in-document contradictions, year-over-year
          deterioration. The data is from public state filings (WI DFI, MN
          CARDS, CA DFPI). The interpretation is ours, written for the buyer.
        </p>
      </section>
    </main>
  )
}
