"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, Chip } from "./primitives"
import { Icon, type IconName } from "./icons"
import {
  formatUsdCompact,
  formatUsdRange,
  investmentBucketBars,
  parseFeePercent,
} from "@/lib/brand-pages/mappers"

const FEE_PALETTE = [
  "#22d3ee", // royalty — accent
  "#67e8f9", // ad fund
  "#a7f3d0", // OPNAD
  "#d4af7a", // % rent — gold
  "#94a3b8", // tech
  "#64748b", // other
]

const FEE_ICON: Record<string, IconName> = {
  royalty: "royalty",
  advertising: "advertising",
  opnad: "advertising",
  rent: "rent",
  tech: "operations",
}

function feeIcon(label: string): IconName {
  const l = label.toLowerCase()
  if (l.includes("royalty")) return FEE_ICON.royalty
  if (l.includes("advertising") || l.includes("ad fund")) return FEE_ICON.advertising
  if (l.includes("opnad") || l.includes("co-op")) return FEE_ICON.opnad
  if (l.includes("rent")) return FEE_ICON.rent
  if (l.includes("tech")) return FEE_ICON.tech
  return "stack"
}

// Hardcoded Item 19 percentile data from mcdonalds.ts model
// (78% franchised > $3M, median $3.80M, mean $3.97M, 96% McOpCo > $3M, etc.)
// These are factual from the FDD; rendering as a distribution visual.
const FRANCHISED_PCT_ABOVE_3M = 78
const FRANCHISED_MEDIAN = 3.8
const FRANCHISED_MEAN = 3.97
const MCOPCO_PCT_ABOVE_3M = 96
const MCOPCO_MEAN = 4.79

export default function EconomicsLux({ economics }: { economics: BrandPageModel["economics"] }) {
  const { investment, ongoingFees, item19 } = economics
  const bars = investmentBucketBars(investment.buckets, investment.rangeLow, investment.rangeHigh)

  // Fee segments (recurring only, with a parsed % and a short label)
  const feeSegments = ongoingFees.components
    .filter((c) => c.type === "recurring")
    .map((c, i) => {
      const pct = parseFeePercent(c.value) ?? 0
      // Use lower bound of % rent range for the visible stack
      const rentMatch = c.value.match(/([\d.]+)\s*%\s*–\s*([\d.]+)\s*%/)
      const usePct = rentMatch ? parseFloat(rentMatch[1]) : pct
      const shortNames: Record<string, string> = {
        "Royalty (new restaurants, post-2024)": "Royalty 5%",
        "Royalty (legacy pre-2024)": "Legacy 4%",
        "Advertising minimum": "Ad fund 4%",
        "OPNAD (national co-op)": "OPNAD 2.25%",
        "Percentage rent (Traditional, post-2026-01-14)": "% rent ≥6%",
        "Required tech fees": "Tech ~$10.5K",
      }
      return {
        key: c.label,
        label: shortNames[c.label] ?? c.label.split("(")[0].trim(),
        fullLabel: c.label,
        value: c.value,
        pct: usePct,
        color: FEE_PALETTE[i % FEE_PALETTE.length],
        icon: feeIcon(c.label),
      }
    })
    .filter((s) => s.pct > 0 && !s.fullLabel.includes("legacy"))

  const totalPct = feeSegments.reduce((a, s) => a + s.pct, 0)

  // Translate each % into dollars @ $3.8M median unit
  const medianRev = 3_800_000
  const feesInDollars = feeSegments.map((s) => ({
    ...s,
    dollars: Math.round((s.pct / 100) * medianRev),
  }))
  const totalDollars = feesInDollars.reduce((a, s) => a + s.dollars, 0)

  const conditional = ongoingFees.components.filter((c) => c.type === "conditional")

  // Traditional bucket for the primary rail
  const traditional = bars.find((b) => b.label === "Traditional") ?? bars[0]

  return (
    <SectionLux
      id="economics"
      eyebrow="The money"
      headline="What do you actually pay every year?"
      kicker="Initial outlay, ongoing extraction, and revenue quality — translated into dollars a new operator will actually see."
    >
      {/* ══ PANEL 1 — Investment anatomy ══ */}
      <div className="lux-card p-7 sm:p-10 mb-5 lux-fade">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-8">
          <div>
            <div className="lux-eyebrow mb-2">Initial investment · all formats</div>
            <div className="lux-serif font-medium text-[40px] sm:text-[52px] leading-none text-[color:var(--lux-ink)] lux-num tracking-tight">
              {formatUsdRange(investment.rangeLow, investment.rangeHigh)}
            </div>
            <div className="mt-2 text-[12px] text-[color:var(--lux-ink-mute)]">
              $45K franchise fee is <span className="text-[color:var(--lux-gold)]">less than 3%</span> of total outlay.
              Construction and equipment carry the cost.
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            {investment.buckets.map((b) => (
              <div key={b.label} className="lux-card-tight px-3 py-2.5 min-w-[110px]">
                <div className="lux-eyebrow mb-1">{b.label}</div>
                <div className="lux-num text-[12px] text-[color:var(--lux-ink)]">
                  {b.low != null && b.high != null ? formatUsdRange(b.low, b.high) : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked ranges on a single axis */}
        <div className="space-y-5">
          {bars.map((b, i) => (
            <div key={b.label}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[13px] text-[color:var(--lux-ink-soft)] font-medium">{b.label}</span>
                <span className="lux-num text-[12px] text-[color:var(--lux-ink-mute)]">
                  {formatUsdCompact(b.low)} – {formatUsdCompact(b.high)}
                </span>
              </div>
              <div className="lux-rail">
                <div
                  className={i === 0 ? "lux-rail-fill" : "lux-rail-muted"}
                  style={{ left: `${b.leftPct}%`, width: `${b.widthPct}%` }}
                />
              </div>
            </div>
          ))}
          {/* Axis ticks */}
          <div className="flex justify-between text-[10px] text-[color:var(--lux-ink-faint)] lux-num pt-1">
            <span>$525K</span>
            <span>$1.0M</span>
            <span>$1.5M</span>
            <span>$2.0M</span>
            <span>$2.7M</span>
          </div>
        </div>

        <p className="mt-7 pt-6 border-t border-[color:var(--lux-edge)] text-[13px] text-[color:var(--lux-ink-mute)] leading-relaxed max-w-3xl">
          {investment.takeaways[0]}
        </p>
      </div>

      {/* ══ PANEL 2 — Recurring fee extraction (pct + dollars) ══ */}
      <div className="lux-card p-7 sm:p-10 mb-5 lux-fade lux-fade-1">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-6">
          <div>
            <div className="lux-eyebrow mb-2">Recurring fee extraction</div>
            <div className="flex items-baseline gap-3">
              <span className="lux-serif font-medium text-[40px] sm:text-[52px] leading-none text-[color:var(--lux-ink)] lux-num tracking-tight">
                ~{Math.round(totalPct)}%
              </span>
              <span className="text-[14px] text-[color:var(--lux-ink-mute)]">of gross sales, before rent uplift</span>
            </div>
          </div>
          <div className="text-right">
            <div className="lux-eyebrow mb-2">@ $3.8M median unit</div>
            <div className="lux-serif font-medium text-[22px] text-[color:var(--lux-gold)] lux-num tracking-tight">
              ≈ ${Math.round(totalDollars / 1000).toLocaleString()}K
            </div>
            <div className="text-[11px] text-[color:var(--lux-ink-faint)] mt-1">per year extracted</div>
          </div>
        </div>

        {/* Stacked % bar */}
        <div className="lux-stack mb-4">
          {feeSegments.map((s) => (
            <div
              key={s.key}
              className="lux-stack-seg"
              style={{ width: `${(s.pct / totalPct) * 100}%`, background: s.color }}
              title={`${s.fullLabel}: ${s.value}`}
            >
              {s.pct >= 3 ? `${s.pct}%` : ""}
            </div>
          ))}
        </div>

        {/* Legend with icon + dollar translation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 mt-5">
          {feesInDollars.map((s) => (
            <div key={s.key} className="flex items-baseline gap-3 text-[12px] py-1.5 border-b border-[color:var(--lux-edge)]">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
              <Icon name={s.icon} width={13} height={13} className="text-[color:var(--lux-ink-mute)] shrink-0" />
              <span className="text-[color:var(--lux-ink-soft)] flex-1 min-w-0 truncate">{s.label}</span>
              <span className="lux-num text-[color:var(--lux-ink)]">${(s.dollars / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>

        {/* Conditional triggers row */}
        {conditional.length > 0 && (
          <div className="mt-6 pt-5 border-t border-[color:var(--lux-edge)]">
            <div className="lux-eyebrow mb-3">Conditional triggers</div>
            <div className="flex flex-wrap gap-2">
              {conditional.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--lux-warn)]/25 bg-[color:var(--lux-warn)]/6 px-3 py-1 text-[11px] text-[color:var(--lux-ink-soft)]"
                  title={c.value}
                >
                  <Icon name="flag" width={11} height={11} className="text-[color:var(--lux-warn)]" />
                  {c.label} <span className="text-[color:var(--lux-ink-mute)] ml-1">· {c.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 pt-5 border-t border-[color:var(--lux-edge)] text-[13px] text-[color:var(--lux-ink-mute)] leading-relaxed max-w-3xl">
          Percentage rent — not royalty — is the largest variable cost. It is driven by the real estate deal, not the franchise agreement.
        </p>
      </div>

      {/* ══ PANEL 3 — Item 19 distribution ══ */}
      <div className="lux-card p-7 sm:p-10 lux-fade lux-fade-2">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-8">
          <div>
            <div className="lux-eyebrow mb-2">Revenue — {item19.period}</div>
            <div className="lux-serif font-medium text-[40px] sm:text-[52px] leading-none text-[color:var(--lux-ink)] lux-num tracking-tight">
              {item19.headlineMetric}
            </div>
            <div className="mt-2 text-[12px] text-[color:var(--lux-ink-mute)]">
              {item19.metricLabel} · {item19.sampleSize?.split("(")[0].trim()}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Chip severity="neutral" icon="check">Large sample</Chip>
            <Chip severity="neutral" icon="check">Breakdown shown</Chip>
            <Chip severity="caution" icon="flag">4% royalty basis</Chip>
          </div>
        </div>

        {/* Distribution rail — percentile visualization */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-3 text-[12px] text-[color:var(--lux-ink-mute)] lux-num">
            <span>$0</span>
            <span>$2M</span>
            <span>$4M</span>
            <span>$6M</span>
            <span>$8M+</span>
          </div>
          <div className="relative h-14 rounded-xl border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-0)] overflow-visible">
            {/* Density heat — hand-shaded bins approximating a right-skewed distribution */}
            {[0.04, 0.08, 0.16, 0.26, 0.22, 0.14, 0.06, 0.03, 0.01].map((d, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(i / 9) * 100}%`,
                  width: `${100 / 9}%`,
                  background: `linear-gradient(180deg, rgba(34, 211, 238, ${d * 1.1}), rgba(34, 211, 238, ${d * 0.4}))`,
                }}
              />
            ))}
            {/* $3M floor marker (78% of franchised above this) */}
            <div className="absolute top-[-10px] bottom-[-10px] w-[2px] bg-[color:var(--lux-good)]" style={{ left: "37.5%" }}>
              <div className="absolute -top-5 -translate-x-1/2 text-[10px] text-[color:var(--lux-good)] whitespace-nowrap">
                $3.0M floor
              </div>
            </div>
            {/* Median marker */}
            <div className="absolute top-[-10px] bottom-[-10px] w-[2px] bg-[color:var(--lux-gold)]" style={{ left: "47.5%" }}>
              <div className="absolute -bottom-5 -translate-x-1/2 text-[10px] text-[color:var(--lux-gold)] whitespace-nowrap">
                Median $3.80M
              </div>
            </div>
            {/* Mean marker */}
            <div className="absolute top-[-10px] bottom-[-10px] w-[1px] bg-[color:var(--lux-ink-mute)]" style={{ left: "50%" }}>
              <div className="absolute -top-5 -translate-x-1/2 text-[10px] text-[color:var(--lux-ink-mute)] whitespace-nowrap">
                Mean $4.00M
              </div>
            </div>
          </div>

          {/* Sub-stat row */}
          <div className="mt-12 grid grid-cols-3 gap-3">
            <div className="lux-card-tight p-4">
              <div className="lux-eyebrow mb-1">Franchised &gt; $3M</div>
              <div className="lux-serif text-[22px] text-[color:var(--lux-good)] lux-num">{FRANCHISED_PCT_ABOVE_3M}%</div>
              <div className="text-[10px] text-[color:var(--lux-ink-faint)] mt-0.5">12,023 units · median ${FRANCHISED_MEDIAN}M · mean ${FRANCHISED_MEAN}M</div>
            </div>
            <div className="lux-card-tight p-4">
              <div className="lux-eyebrow mb-1">McOpCo &gt; $3M</div>
              <div className="lux-serif text-[22px] text-[color:var(--lux-good)] lux-num">{MCOPCO_PCT_ABOVE_3M}%</div>
              <div className="text-[10px] text-[color:var(--lux-ink-faint)] mt-0.5">549 units · mean ${MCOPCO_MEAN}M</div>
            </div>
            <div className="lux-card-tight p-4">
              <div className="lux-eyebrow mb-1">Royalty basis gap</div>
              <div className="lux-serif text-[22px] text-[color:var(--lux-warn)] lux-num">–$38K</div>
              <div className="text-[10px] text-[color:var(--lux-ink-faint)] mt-0.5">pro forma uses 4%; new operators pay 5%</div>
            </div>
          </div>
        </div>

        <p className="pt-6 mt-2 border-t border-[color:var(--lux-edge)] text-[13px] text-[color:var(--lux-ink-mute)] leading-relaxed max-w-3xl">
          {item19.takeaways[1]}
        </p>
      </div>
    </SectionLux>
  )
}
