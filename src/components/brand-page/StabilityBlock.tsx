import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import { ownershipShares } from "@/lib/brand-pages/mappers"

export default function StabilityBlock({
  stability,
}: {
  stability: BrandPageModel["systemStability"]
}) {
  const mix = ownershipShares(stability.ownershipMix)
  const movement = stability.annualMovement

  // Scale openings + closures only — transfers are shown separately so they
  // don't crush the growth-signal bars.
  const maxGrowth = Math.max(
    1,
    ...movement.map((y) => Math.max(y.openings ?? 0, y.closures ?? 0)),
  )

  return (
    <SectionShell
      id="stability"
      eyebrow="The system"
      headline="Is this network growing, shrinking, or churning?"
      takeaway="Three years of openings, closures, and transfers tell you whether operators are entering, staying, or leaving."
    >
      {/* Ownership mix split bar */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground">Ownership mix</h3>
          <div className="text-xs text-muted tabular-nums">
            {mix.reduce((acc, m) => acc + m.value, 0).toLocaleString()} units
          </div>
        </div>
        <div className="mt-4 flex h-8 rounded overflow-hidden border border-border">
          {mix.map((m, i) => (
            <div
              key={m.label}
              className={i === 0 ? "bg-accent/70" : "bg-muted/40"}
              style={{ width: `${m.pct * 100}%` }}
              title={`${m.label}: ${m.value.toLocaleString()} (${(m.pct * 100).toFixed(1)}%)`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/80">
          {mix.map((m, i) => (
            <div key={m.label} className="flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-sm ${i === 0 ? "bg-accent/70" : "bg-muted/40"}`}
              />
              <span>
                {m.label}{" "}
                <span className="text-muted tabular-nums">
                  {m.value.toLocaleString()} · {(m.pct * 100).toFixed(1)}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Openings vs closures — paired bars per year */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground">Openings vs. closures</h3>
          <div className="text-xs text-muted">3-year window</div>
        </div>
        <div className="mt-6 space-y-5">
          {movement.map((y) => {
            const open = y.openings ?? 0
            const closed = y.closures ?? 0
            const openW = (open / maxGrowth) * 100
            const closedW = (closed / maxGrowth) * 100
            return (
              <div key={y.year}>
                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="text-foreground tabular-nums font-medium">{y.year}</span>
                  <span className="text-muted tabular-nums">
                    net {open - closed >= 0 ? "+" : ""}{open - closed}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted w-16 text-right tabular-nums">+{open}</span>
                    <div className="flex-1 h-3 bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success/70 rounded-full"
                        style={{ width: `${openW}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted w-16 text-right tabular-nums">–{closed}</span>
                    <div className="flex-1 h-3 bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className="h-full bg-danger/60 rounded-full"
                        style={{ width: `${closedW}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-foreground/75">
          <Legend color="bg-success/70" label="Openings" />
          <Legend color="bg-danger/60" label="Closures / terminations / non-renewals" />
        </div>
      </div>

      {/* Transfers — separate, simple row so they don't crush the growth chart */}
      {movement.some((y) => (y.transfers ?? 0) > 0) ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-sm font-semibold text-foreground">Ownership transfers</h3>
            <div className="text-xs text-muted">Existing units that changed hands</div>
          </div>
          <div className="mt-4 flex gap-4">
            {movement.map((y) => {
              const xfer = y.transfers ?? 0
              return (
                <div key={y.year} className="flex-1 rounded bg-surface-alt px-4 py-3 text-center">
                  <div className="text-[11px] text-muted">{y.year}</div>
                  <div className="mt-1 text-lg font-semibold text-foreground tabular-nums">
                    {xfer.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {stability.takeaways.length > 0 ? (
        <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
          {stability.takeaways.map((t, i) => (
            <li key={i}>— {t}</li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={`h-2 w-2 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  )
}
