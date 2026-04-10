import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"

function edge(s: Severity | undefined): string {
  if (s === "high") return "border-l-4 border-l-danger"
  if (s === "caution") return "border-l-4 border-l-warning"
  if (s === "neutral") return "border-l-4 border-l-accent/40"
  return "" // no left edge if severity unset — avoids invisible border noise
}

export default function FinancialStrengthBlock({
  financial,
}: {
  financial: BrandPageModel["financialStrength"]
}) {
  return (
    <SectionShell
      id="financial-strength"
      eyebrow="Franchisor health"
      headline="Can this franchisor support the system?"
      takeaway="McDonald's USA is profitable, audited clean, and well-capitalized. Cash looks low only because all net income flows to the parent company."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {financial.highlights.map((h) => (
          <div
            key={h.label}
            className={`rounded-lg border border-border ${edge(h.severity)} bg-surface p-5`}
          >
            <div className="text-[11px] uppercase tracking-widest text-muted">{h.label}</div>
            <div className="mt-1.5 text-lg font-semibold text-foreground tabular-nums">
              {h.value}
            </div>
            {h.note ? <div className="mt-1 text-xs text-muted">{h.note}</div> : null}
          </div>
        ))}
      </div>
      {financial.takeaways.length > 0 ? (
        <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
          {financial.takeaways.map((t, i) => (
            <li key={i}>— {t}</li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
