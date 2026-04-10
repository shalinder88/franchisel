import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"

function edge(severity: Severity | undefined): string {
  if (severity === "high") return "border-l-danger"
  if (severity === "caution") return "border-l-warning"
  return "border-l-accent"
}

export default function GuidedSummary({
  items,
}: {
  items: BrandPageModel["guidedSummary"]
}) {
  return (
    <SectionShell
      id="guided-summary"
      eyebrow="Before you read further"
      headline="Five things to know first"
      takeaway="Each card is a conclusion. The rest of this page is the evidence."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((card) => (
          <div
            key={card.id}
            className={`rounded-lg bg-surface border border-border border-l-4 ${edge(card.severity)} p-5`}
          >
            <div className="text-[11px] uppercase tracking-widest text-muted">{card.title}</div>
            <p className="mt-2 text-sm text-foreground leading-relaxed">{card.verdict}</p>
            <p className="mt-3 text-xs text-foreground/60 leading-relaxed">
              <span className="text-muted">Why it matters — </span>
              {card.whyItMatters}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
