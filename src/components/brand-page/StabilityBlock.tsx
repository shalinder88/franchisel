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
  const maxGrowth = Math.max(1, ...movement.map((y) => Math.max(y.openings ?? 0, y.closures ?? 0)))

  // Net growth trend
  const latestYear = movement[movement.length - 1]
  const prevYear = movement.length > 1 ? movement[movement.length - 2] : null
  const latestNet = (latestYear?.openings ?? 0) - (latestYear?.closures ?? 0)
  const prevNet = prevYear ? (prevYear.openings ?? 0) - (prevYear.closures ?? 0) : null

  return (
    <SectionShell id="stability" eyebrow="The system" headline="Is it growing?">
      {/* ── Trend summary — 2 cards only (total units already in hero) ── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 p-5 text-center">
          <div className="text-[9px] uppercase tracking-[0.15em] text-muted/60">Net growth {latestYear?.year}</div>
          <div className="mt-1.5 text-3xl font-black tabular-nums text-success tracking-tight">
            +{latestNet}
          </div>
          {prevNet !== null && (
            <div className="mt-1 text-[10px] text-muted/40">
              vs {prevNet >= 0 ? "+" : ""}{prevNet} prior year
            </div>
          )}
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 p-5 text-center">
          <div className="text-[9px] uppercase tracking-[0.15em] text-muted/60">Transfers {latestYear?.year}</div>
          <div className="mt-1.5 text-3xl font-black text-foreground tabular-nums tracking-tight">
            {(latestYear?.transfers ?? 0).toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-muted/40">
            units changed hands
          </div>
        </div>
      </div>

      {/* ── Ownership split bar ── */}
      <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 p-5 mb-4">
        <div className="flex items-center justify-between text-[11px] text-foreground/60 mb-2">
          {mix.map((m, i) => (
            <span key={m.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-sm ${i === 0 ? "bg-accent/70" : "bg-muted/40"}`} />
              {m.label} <span className="text-muted tabular-nums">{(m.pct * 100).toFixed(0)}%</span>
            </span>
          ))}
        </div>
        <div className="flex h-6 rounded-lg overflow-hidden border border-border/30">
          {mix.map((m, i) => (
            <div
              key={m.label}
              className={i === 0 ? "bg-accent/60" : "bg-muted/30"}
              style={{ width: `${m.pct * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* ── Openings vs closures — horizontal paired bars ── */}
      <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Openings vs. closures</h3>
          <div className="flex gap-3 text-[10px] text-foreground/50">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success/70" />Opened</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-danger/60" />Closed</span>
          </div>
        </div>
        <div className="space-y-4">
          {movement.map((y) => {
            const open = y.openings ?? 0
            const closed = y.closures ?? 0
            return (
              <div key={y.year}>
                <div className="flex items-baseline justify-between text-[11px] mb-1.5">
                  <span className="text-foreground font-medium tabular-nums">{y.year}</span>
                  <span className="text-muted/60 tabular-nums">net {open - closed >= 0 ? "+" : ""}{open - closed}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted/50 w-10 text-right tabular-nums">+{open}</span>
                    <div className="flex-1 h-2.5 bg-surface-alt rounded-full overflow-hidden">
                      <div className="h-full bg-success/60 rounded-full" style={{ width: `${(open / maxGrowth) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted/50 w-10 text-right tabular-nums">–{closed}</span>
                    <div className="flex-1 h-2.5 bg-surface-alt rounded-full overflow-hidden">
                      <div className="h-full bg-danger/50 rounded-full" style={{ width: `${(closed / maxGrowth) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
