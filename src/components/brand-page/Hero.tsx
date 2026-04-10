"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { truncateToLabel } from "@/lib/brand-pages/mappers"

type Props = {
  hero: BrandPageModel["hero"]
  summaryItems?: BrandPageModel["guidedSummary"]
}

export default function Hero({ hero, summaryItems }: Props) {
  const [expandedChip, setExpandedChip] = useState<number | null>(null)

  return (
    <section id="hero" className="scroll-mt-24 hero-mesh -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pt-12 pb-16 rounded-b-3xl mb-4">
      {/* Category pill */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/60">
          {hero.category}
        </span>
        <span className="text-border">·</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">FDD {hero.filingYear}</span>
      </div>

      {/* Brand name */}
      <h1 className="mt-5 text-6xl sm:text-8xl font-black text-foreground tracking-tighter leading-[0.9]">
        {hero.brandName}
      </h1>

      {/* Verification badge */}
      <div className="mt-6 flex items-center gap-4 flex-wrap">
        <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5 text-[11px] text-success font-medium">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Government-filed FDD verified
        </span>
      </div>

      {/* ── Metric strip ── */}
      <div className="mt-10 grid grid-cols-3 lg:grid-cols-6 gap-[1px] rounded-2xl overflow-hidden border border-border bg-border">
        {hero.keyMetrics.map((m) => (
          <div
            key={m.label}
            className="bg-surface p-5 lg:p-6 hover:bg-surface-alt transition-colors"
          >
            <div className="text-[10px] uppercase tracking-wider text-foreground/50">
              {m.label}
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-foreground tabular-nums tracking-tight leading-none">
              {m.value}
            </div>
            {m.sublabel && (
              <div className="mt-1.5 text-[10px] text-foreground/30">{m.sublabel}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Verdict chips ── */}
      <div className="mt-8 flex flex-wrap gap-2">
        {hero.positives.map((p, i) => (
          <button
            key={`p${i}`}
            onClick={() => setExpandedChip(expandedChip === i ? null : i)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition-all duration-200
              ${expandedChip === i
                ? "border-success/40 bg-success/15 text-foreground"
                : "border-border text-foreground/60 hover:border-success/30 hover:bg-success/5"
              }`}
          >
            <span className="h-2 w-2 rounded-full bg-success shrink-0" />
            {truncateToLabel(p)}
          </button>
        ))}
        {hero.cautions.map((c, i) => {
          const idx = i + hero.positives.length
          return (
            <button
              key={`c${i}`}
              onClick={() => setExpandedChip(expandedChip === idx ? null : idx)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition-all duration-200
                ${expandedChip === idx
                  ? "border-warning/40 bg-warning/15 text-foreground"
                  : "border-border text-foreground/60 hover:border-warning/30 hover:bg-warning/5"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-warning shrink-0" />
              {truncateToLabel(c)}
            </button>
          )
        })}
      </div>

      {/* Expanded chip detail */}
      {expandedChip !== null && (
        <div className="mt-3 rounded-xl border border-border bg-surface px-5 py-4 text-sm text-foreground/80 leading-relaxed animate-fade-up max-w-2xl">
          {expandedChip < hero.positives.length
            ? hero.positives[expandedChip]
            : hero.cautions[expandedChip - hero.positives.length]}
        </div>
      )}
    </section>
  )
}
