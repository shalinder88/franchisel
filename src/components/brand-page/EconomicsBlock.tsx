"use client"
import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import FeeStackBar from "./FeeStackBar"
import QualityFlagStrip from "./QualityFlagStrip"
import HoverTooltip from "./HoverTooltip"
import {
  formatUsdCompact,
  formatUsdRange,
  investmentBucketBars,
} from "@/lib/brand-pages/mappers"

const FEE_COLORS = [
  "bg-accent/80",
  "bg-cyan/60",
  "bg-success/50",
  "bg-warning/50",
  "bg-muted/50",
  "bg-accent/40",
]

export default function EconomicsBlock({
  economics,
}: {
  economics: BrandPageModel["economics"]
}) {
  const { investment, ongoingFees, item19 } = economics
  const bars = investmentBucketBars(investment.buckets, investment.rangeLow, investment.rangeHigh)

  // Build fee segments for the stacked bar
  const feeSegments = ongoingFees.components
    .filter((c) => c.type === "recurring")
    .map((c, i) => {
      const m = c.value.match(/^([\d.]+)%/)
      const pct = m ? parseFloat(m[1]) : 0
      const shortLabel = c.label.replace(/\s*of Gross Sales.*$/i, "").replace(/\s*per annum.*$/i, "")
      return { label: shortLabel, value: c.value, pct, color: FEE_COLORS[i % FEE_COLORS.length] }
    })
    .filter((s) => s.pct > 0)

  const conditionalItems = ongoingFees.components
    .filter((c) => c.type === "conditional")
    .map((c) => ({ label: c.label, value: c.value }))

  return (
    <SectionShell id="economics" eyebrow="The money" headline="What you pay">
      {/* ── Investment anatomy ── */}
      <div className="rounded-xl border border-white/[0.06] bg-surface/80 p-6 shadow-lg shadow-black/10">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Investment by format</h3>
        </div>
        <div className="space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-[11px] text-foreground/50 mb-1">
                <span>{b.label}</span>
                <span className="tabular-nums text-muted">
                  {formatUsdCompact(b.low)} – {formatUsdCompact(b.high)}
                </span>
              </div>
              <div className="relative h-3 bg-surface-alt rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-accent/50 rounded-full"
                  style={{ left: `${b.leftPct}%`, width: `${b.widthPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fee extraction stack ── */}
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-surface/80 p-6 shadow-lg shadow-black/10">
        <FeeStackBar segments={feeSegments} conditionalItems={conditionalItems} />
      </div>

      {/* ── Item 19 revenue trust ── */}
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-surface/80 p-6 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Revenue data quality</h3>
          <div className="flex gap-1.5">
            {item19.period && (
              <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-muted">{item19.period}</span>
            )}
            {item19.revenueType && (
              <span className="rounded-full border border-accent/25 bg-accent/5 px-2 py-0.5 text-[10px] text-accent">{item19.revenueType}</span>
            )}
          </div>
        </div>
        <QualityFlagStrip flags={item19.qualityFlags} />
      </div>
    </SectionShell>
  )
}
