import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import {
  formatUsdCompact,
  formatUsdRange,
  investmentBucketBars,
} from "@/lib/brand-pages/mappers"

export default function EconomicsBlock({
  economics,
}: {
  economics: BrandPageModel["economics"]
}) {
  const { investment, ongoingFees, item19 } = economics
  const bars = investmentBucketBars(investment.buckets, investment.rangeLow, investment.rangeHigh)
  const recurring = ongoingFees.components.filter((c) => c.type === "recurring")
  const conditional = ongoingFees.components.filter((c) => c.type === "conditional")

  return (
    <SectionShell
      id="economics"
      eyebrow="The money"
      headline="What you pay to get in — and what keeps flowing out"
      takeaway="Upfront cost is a range. The ongoing burden is a stack: royalty, advertising, rent, and tech fees all draw from the same Gross Sales number."
    >
      {/* — Investment range — */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground">Initial investment</h3>
          <div className="text-2xl font-semibold text-foreground tabular-nums">
            {formatUsdRange(investment.rangeLow, investment.rangeHigh)}
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs text-foreground/70 mb-1">
                <span>{b.label}</span>
                <span className="tabular-nums text-muted">
                  {formatUsdCompact(b.low)} – {formatUsdCompact(b.high)}
                </span>
              </div>
              <div className="relative h-2 bg-surface-alt rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-accent/70 rounded-full"
                  style={{ left: `${b.leftPct}%`, width: `${b.widthPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {investment.takeaways.length > 0 ? (
          <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
            {investment.takeaways.map((t, i) => (
              <li key={i}>— {t}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* — Ongoing fees — */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-6">
        <h3 className="text-sm font-semibold text-foreground">Ongoing fees</h3>
        <p className="text-xs text-muted mt-1">Recurring extraction off Gross Sales, then conditional triggers.</p>

        <ul className="mt-5 divide-y divide-border">
          {recurring.map((c) => (
            <li key={c.label} className="py-3 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-foreground">{c.label}</div>
                {c.note ? <div className="text-xs text-muted mt-0.5">{c.note}</div> : null}
              </div>
              <div className="text-sm text-foreground/90 tabular-nums text-right shrink-0">
                {c.value}
              </div>
            </li>
          ))}
        </ul>

        {conditional.length > 0 ? (
          <>
            <div className="mt-6 text-[11px] uppercase tracking-widest text-muted">
              Conditional triggers
            </div>
            <ul className="mt-2 space-y-2">
              {conditional.map((c) => (
                <li key={c.label} className="flex items-start justify-between gap-4 text-xs">
                  <div className="text-foreground/80">{c.label}</div>
                  <div className="text-foreground/70 tabular-nums text-right shrink-0">
                    {c.value}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {ongoingFees.takeaways.length > 0 ? (
          <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
            {ongoingFees.takeaways.map((t, i) => (
              <li key={i}>— {t}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* — Item 19 trust strip — */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Revenue disclosure (Item 19)
            </h3>
            {item19.metricLabel ? (
              <p className="text-xs text-muted mt-1">{item19.metricLabel}</p>
            ) : null}
          </div>
          {item19.headlineMetric ? (
            <div className="text-3xl font-semibold text-foreground tabular-nums">
              {item19.headlineMetric}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {item19.period ? (
            <div className="rounded bg-surface-alt px-3 py-2">
              <div className="text-muted">Period</div>
              <div className="text-foreground mt-0.5">{item19.period}</div>
            </div>
          ) : null}
          {item19.sampleSize ? (
            <div className="rounded bg-surface-alt px-3 py-2">
              <div className="text-muted">Sample</div>
              <div className="text-foreground mt-0.5">{item19.sampleSize}</div>
            </div>
          ) : null}
          {item19.basis ? (
            <div className="rounded bg-surface-alt px-3 py-2">
              <div className="text-muted">Basis</div>
              <div className="text-foreground mt-0.5">{item19.basis}</div>
            </div>
          ) : null}
        </div>

        {/* Can-you-trust-this-number strip */}
        <div className="mt-5">
          <div className="text-[11px] uppercase tracking-widest text-muted mb-2">
            Can you trust this number?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {item19.qualityFlags.map((f) => {
              const dot =
                f.status === "good"
                  ? "bg-success"
                  : f.status === "mixed"
                  ? "bg-warning"
                  : "bg-danger"
              return (
                <div
                  key={f.label}
                  className="flex gap-2 items-start rounded border border-border bg-surface-alt px-3 py-2"
                >
                  <span aria-hidden className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                  <div className="text-xs">
                    <div className="text-foreground">{f.label}</div>
                    {f.note ? <div className="text-muted mt-0.5">{f.note}</div> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {item19.takeaways.length > 0 ? (
          <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
            {item19.takeaways.map((t, i) => (
              <li key={i}>— {t}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </SectionShell>
  )
}
