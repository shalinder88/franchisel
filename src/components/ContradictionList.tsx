import type { FranchiseBrand } from "@/lib/types"
import { detectContradictions, sortBySeverity, type Contradiction } from "@/lib/contradictions"

function severityChip(severity: Contradiction["severity"]) {
  if (severity === "critical") {
    return "bg-danger-light text-danger border-danger/20"
  }
  if (severity === "warning") {
    return "bg-warning-light text-warning border-warning/20"
  }
  return "bg-cyan-light text-cyan border-cyan/20"
}

function severityLabel(severity: Contradiction["severity"]) {
  if (severity === "critical") return "Critical"
  if (severity === "warning") return "Warning"
  return "Info"
}

export default function ContradictionList({
  brand,
  className = "",
  emptyMessage,
}: {
  brand: FranchiseBrand
  className?: string
  emptyMessage?: string
}) {
  const contradictions = sortBySeverity(detectContradictions(brand))

  if (contradictions.length === 0) {
    return (
      <div className={`rounded-xl border border-border bg-surface p-5 text-sm text-muted ${className}`}>
        {emptyMessage ??
          `No filing-level contradictions surfaced from the ${brand.fddYear} ${brand.name} FDD with the data we currently extract. This is not the same as "no risks" — it means the rules we run did not fire on the fields available.`}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {contradictions.map((c) => (
        <article
          key={c.id}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
            <h3 className="text-base font-semibold text-foreground leading-snug flex-1 min-w-0">
              {c.title}
            </h3>
            <span
              className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border whitespace-nowrap ${severityChip(c.severity)}`}
            >
              {severityLabel(c.severity)}
            </span>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">{c.explanation}</p>

          <div className="mt-3 rounded-lg border border-border/60 bg-surface-alt px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-0.5">
              What to do
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{c.action}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {c.items.map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 text-[10px] rounded bg-surface-alt border border-border text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
