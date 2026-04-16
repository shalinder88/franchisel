import Link from "next/link"
import type { FranchiseBrand } from "@/lib/types"
import { detectContradictions } from "@/lib/contradictions"
import { buildFeeStack } from "@/lib/fee-stack"
import { gradeItem19 } from "@/lib/item19-quality"

/**
 * Brand-page tool callout
 * -----------------------
 * Renders four small cards on a brand page that link this brand to each
 * of the four free buyer tools, pre-populated with the brand's slug.
 * Each card shows a one-line summary of what the tool found for THIS
 * brand so the user has a reason to click rather than a generic CTA.
 */
export default function BrandToolsCallout({
  brand,
  className = "",
}: {
  brand: FranchiseBrand
  className?: string
}) {
  const contradictions = detectContradictions(brand)
  const stack = buildFeeStack(brand)
  const item19 = gradeItem19(brand)
  const recurringPctLabel =
    stack.totalRecurringPct > 0
      ? `${(stack.totalRecurringPct * 100).toFixed(2)}% recurring`
      : `${stack.recurring.length} recurring lines`
  const item19Label = item19.hasItem19
    ? `Item 19 grade ${item19.grade}`
    : "No Item 19 disclosed"
  const hasYoY =
    typeof brand.item19Prior?.grossRevenueAvg === "number" &&
    typeof brand.item19?.grossRevenueAvg === "number"

  const tools = [
    {
      href: `/tools/contradiction-finder?slug=${brand.slug}`,
      label: "Contradiction Finder",
      detail:
        contradictions.length === 0
          ? "No rules fired"
          : `${contradictions.length} surfaced`,
      accent: "border-warning/30 hover:border-warning/60",
    },
    {
      href: `/tools/fee-stack?slug=${brand.slug}`,
      label: "True Fee Stack",
      detail: recurringPctLabel,
      accent: "border-cyan/30 hover:border-cyan/60",
    },
    {
      href: `/tools/item-19-quality?slug=${brand.slug}`,
      label: "Item 19 Quality Grader",
      detail: item19Label,
      accent: "border-success/30 hover:border-success/60",
    },
    hasYoY
      ? {
          href: `/brands/${brand.slug}/diff`,
          label: "Filing-year changes",
          detail: "YoY deltas vs prior FDD",
          accent: "border-accent/30 hover:border-accent/60",
        }
      : {
          href: `/tools/filing-changes`,
          label: "Cross-brand filing changes",
          detail: "See biggest movers across filings",
          accent: "border-accent/30 hover:border-accent/60",
        },
  ]

  return (
    <section
      className={`max-w-7xl mx-auto px-6 py-8 ${className}`}
      aria-label={`Free buyer tools for ${brand.name}`}
    >
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
          Run the {brand.name} FDD through our free tools
        </h2>
        <Link href="/tools" className="text-xs text-accent hover:underline">
          See all tools &rarr;
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`group rounded-xl border ${t.accent} bg-surface p-4 transition-colors block`}
          >
            <div className="text-sm font-semibold text-foreground mb-1 leading-snug group-hover:text-accent">
              {t.label}
            </div>
            <div className="text-xs text-muted leading-snug">{t.detail}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
