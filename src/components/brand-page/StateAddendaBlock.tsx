import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"

function dot(s: Severity | undefined): string {
  if (s === "high") return "bg-danger"
  if (s === "caution") return "bg-warning"
  return "bg-success/80"
}

export default function StateAddendaBlock({
  addenda,
}: {
  addenda: NonNullable<BrandPageModel["stateAddenda"]>
}) {
  return (
    <SectionShell
      id="state-addenda"
      eyebrow="State by state"
      headline="The contract changes depending on where you operate"
      takeaway={addenda.overallVerdict}
    >
      <div className="rounded-lg border border-border bg-surface divide-y divide-border">
        {addenda.entries.map((e) => (
          <div key={e.state} className="p-5">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span aria-hidden className={`h-2 w-2 rounded-full ${dot(e.severity)}`} />
                <h3 className="text-sm font-semibold text-foreground">{e.state}</h3>
              </div>
              <div className="text-[11px] uppercase tracking-widest text-muted">
                {e.affectedFamily}
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{e.overrideSummary}</p>
            <p className="mt-2 text-xs text-foreground/60 leading-relaxed">
              <span className="text-muted">Why it matters — </span>
              {e.whyItMatters}
            </p>
            {e.sourcePages && e.sourcePages.length > 0 ? (
              <div className="mt-2 text-[11px] text-muted tabular-nums">
                Exhibit T · pages {e.sourcePages.join(", ")}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {addenda.statesWithoutAddendum && addenda.statesWithoutAddendum.length > 0 ? (
        <div className="mt-5 rounded-lg border border-border bg-surface-alt p-4">
          <div className="text-[11px] uppercase tracking-widest text-muted mb-2">
            No Exhibit T addendum filed
          </div>
          <div className="flex flex-wrap gap-1.5">
            {addenda.statesWithoutAddendum.map((s) => (
              <span
                key={s}
                className="text-[11px] text-foreground/70 rounded border border-border px-2 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {addenda.takeaways.length > 0 ? (
        <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
          {addenda.takeaways.map((t, i) => (
            <li key={i}>— {t}</li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
