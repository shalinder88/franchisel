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
  "bg-cyan-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-slate-500",
]

export default function EconomicsBlock({
  economics,
}: {
  economics: BrandPageModel["economics"]
}) {
  const { investment, ongoingFees, item19 } = economics
  const bars = investmentBucketBars(investment.buckets, investment.rangeLow, investment.rangeHigh)

  const feeSegments = ongoingFees.components
    .filter((c) => c.type === "recurring")
    .map((c, i) => {
      const m = c.value.match(/^([\d.]+)%/)
      const pct = m ? parseFloat(m[1]) : 0
      const shortNames: Record<string, string> = {
        "Royalty (new restaurants, post-2024)": "Royalty 5%",
        "Royalty (legacy pre-2024)": "Legacy 4%",
        "Advertising minimum": "Ad fund 4%",
        "OPNAD (national co-op)": "OPNAD 2.25%",
        "Percentage rent (Traditional, post-2026-01-14)": "% rent 6%",
        "Required tech fees": "Tech fees",
      }
      return { label: shortNames[c.label] ?? c.label.split("(")[0].trim(), fullLabel: c.label, value: c.value, pct, color: FEE_COLORS[i % FEE_COLORS.length] }
    })
    .filter((s) => s.pct > 0)

  const totalPct = feeSegments.reduce((a, s) => a + s.pct, 0)

  const conditionalItems = ongoingFees.components
    .filter((c) => c.type === "conditional")
    .map((c) => ({ label: c.label, value: c.value }))

  return (
    <SectionShell id="economics" eyebrow="The money" headline="What you pay">
      {/* ── Investment anatomy ── */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
          <h3 className="text-xs uppercase tracking-wider text-foreground/60 font-semibold">Investment by format</h3>
          <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight">
            {formatUsdRange(investment.rangeLow, investment.rangeHigh)}
          </div>
        </div>
        <div className="space-y-5">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-sm text-foreground/70 mb-2">
                <span className="font-medium">{b.label}</span>
                <span className="tabular-nums text-foreground/50">
                  {formatUsdCompact(b.low)} – {formatUsdCompact(b.high)}
                </span>
              </div>
              <div className="relative h-5 bg-surface-alt rounded-lg overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-lg"
                  style={{ left: `${b.leftPct}%`, width: `${b.widthPct}%`, animation: `fill-bar 0.8s ease-out both` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fee extraction ── */}
      <div className="mt-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <FeeStackBar segments={feeSegments} totalPct={totalPct} conditionalItems={conditionalItems} />
      </div>

      {/* ── Revenue quality ── */}
      <div className="mt-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <h3 className="text-xs uppercase tracking-wider text-foreground/60 font-semibold">Revenue data quality</h3>
          {item19.headlineMetric && (
            <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight">
              {item19.headlineMetric}
            </div>
          )}
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {item19.period && (
            <span className="rounded-full border border-border px-3 py-1 text-[11px] text-foreground/60">{item19.period}</span>
          )}
          {item19.sampleSize && (
            <HoverTooltip content={item19.sampleSize}>
              <span className="rounded-full border border-border px-3 py-1 text-[11px] text-foreground/60 cursor-default">
                {item19.sampleSize.split("(")[0].trim()}
              </span>
            </HoverTooltip>
          )}
          {item19.revenueType && (
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] text-accent font-semibold">
              {item19.revenueType}
            </span>
          )}
        </div>

        {/* Quality strip */}
        <QualityFlagStrip flags={item19.qualityFlags} />
      </div>
    </SectionShell>
  )
}
