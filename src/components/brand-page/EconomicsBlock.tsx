"use client"
import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
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
  "bg-muted/40",
  "bg-accent/40",
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
      // Very short labels for legend
      const shortNames: Record<string, string> = {
        "Royalty (new restaurants, post-2024)": "Royalty 5%",
        "Royalty (legacy pre-2024)": "Legacy 4%",
        "Advertising minimum": "Ad fund",
        "OPNAD (national co-op)": "OPNAD",
        "Percentage rent (Traditional, post-2026-01-14)": "% rent",
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
      {/* ── Investment anatomy — full-width visual ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface/80 shadow-xl shadow-black/20 p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium">Investment by format</h3>
          <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight">
            {formatUsdRange(investment.rangeLow, investment.rangeHigh)}
          </div>
        </div>
        <div className="space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-[11px] text-foreground/40 mb-1.5">
                <span className="font-medium">{b.label}</span>
                <span className="tabular-nums">
                  {formatUsdCompact(b.low)} – {formatUsdCompact(b.high)}
                </span>
              </div>
              <div className="relative h-4 bg-surface-alt/80 rounded-lg overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-gradient-to-r from-accent/40 to-accent/70 rounded-lg"
                  style={{ left: `${b.leftPct}%`, width: `${b.widthPct}%`, animation: `fill-bar 0.8s ease-out both` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fee extraction — the signature visual ── */}
      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-surface/80 shadow-xl shadow-black/20 p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium">Recurring fee extraction</h3>
          <div className="text-2xl font-black text-foreground tabular-nums tracking-tight">
            ~{totalPct.toFixed(0)}%<span className="text-muted/40 text-base">+ of gross</span>
          </div>
        </div>

        {/* Thick segmented bar */}
        <div className="flex h-12 rounded-xl overflow-hidden border border-white/[0.04]">
          {feeSegments.map((seg, i) => (
            <HoverTooltip
              key={`seg-${i}`}
              content={<span><strong>{seg.fullLabel}</strong><br />{seg.value}</span>}
              position="bottom"
            >
              <span
                className={`${seg.color} h-full block transition-all duration-300 hover:brightness-125 cursor-default relative`}
                style={{ width: `${(seg.pct / totalPct) * 100}%` }}
              >
                {/* In-bar label for wide-enough segments */}
                {seg.pct >= 4 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/70 mix-blend-difference">
                    {seg.pct}%
                  </span>
                )}
              </span>
            </HoverTooltip>
          ))}
        </div>

        {/* Compact legend */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {feeSegments.map((seg, i) => (
            <div key={`leg-${i}`} className="flex items-center gap-1.5 text-[10px] text-foreground/40">
              <span className={`h-2 w-2 rounded-sm ${seg.color} shrink-0`} />
              <span>{seg.label}</span>
            </div>
          ))}
        </div>

        {/* Conditional triggers as chips */}
        {conditionalItems.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {conditionalItems.map((c, i) => (
              <HoverTooltip key={i} content={c.value}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1 text-[10px] text-foreground/35 cursor-default hover:text-foreground/50 transition-colors">
                  <span className="h-1 w-1 rounded-full bg-warning/50" />
                  {c.label}
                </span>
              </HoverTooltip>
            ))}
          </div>
        )}
      </div>

      {/* ── Revenue quality — compact trust module ── */}
      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-surface/80 shadow-xl shadow-black/20 p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium">Revenue data quality</h3>
          {item19.headlineMetric && (
            <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight">
              {item19.headlineMetric}
            </div>
          )}
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item19.period && (
            <span className="rounded-full border border-white/[0.06] px-2.5 py-1 text-[10px] text-muted/40">{item19.period}</span>
          )}
          {item19.sampleSize && (
            <HoverTooltip content={item19.sampleSize}>
              <span className="rounded-full border border-white/[0.06] px-2.5 py-1 text-[10px] text-muted/40 cursor-default">
                {item19.sampleSize.split("(")[0].trim()}
              </span>
            </HoverTooltip>
          )}
          {item19.revenueType && (
            <span className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[10px] text-accent/70 font-medium">
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
