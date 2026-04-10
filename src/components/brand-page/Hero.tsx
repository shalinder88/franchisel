"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { truncateToLabel } from "@/lib/brand-pages/mappers"

type Props = {
  hero: BrandPageModel["hero"]
  summaryItems?: BrandPageModel["guidedSummary"]
}

const SEV_COLOR: Record<string, string> = {
  high: "bg-danger/60",
  caution: "bg-warning/50",
  neutral: "bg-accent/40",
}

export default function Hero({ hero, summaryItems }: Props) {
  const [expandedChip, setExpandedChip] = useState<number | null>(null)

  return (
    <section id="hero" className="scroll-mt-24 hero-mesh -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pt-12 pb-16 rounded-b-3xl mb-4">
      {/* Category pill */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center rounded-full border border-border/40 bg-surface/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted backdrop-blur-sm">
          {hero.category}
        </span>
        <span className="text-[10px] text-muted/40">·</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted/50">FDD {hero.filingYear}</span>
      </div>

      {/* Brand name */}
      <h1 className="mt-5 text-6xl sm:text-8xl font-black text-foreground tracking-tighter leading-[0.9]">
        {hero.brandName}
      </h1>

      {/* Verification + ribbon */}
      <div className="mt-6 flex items-center gap-4 flex-wrap">
        <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3.5 py-1.5 text-[10px] text-success/90 font-medium backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Government-filed FDD verified
        </span>
        {summaryItems && summaryItems.length > 0 && (
          <div className="flex h-2 rounded-full overflow-hidden bg-surface-alt/60 flex-1 min-w-[100px] max-w-[180px] shadow-inner">
            {summaryItems.map((s) => (
              <div key={s.id} className={`flex-1 ${SEV_COLOR[s.severity ?? "neutral"]}`} />
            ))}
          </div>
        )}
      </div>

      {/* Metric strip — premium glass effect */}
      <div className="mt-10 grid grid-cols-3 lg:grid-cols-6 gap-px rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/40">
        {hero.keyMetrics.map((m) => (
          <div
            key={m.label}
            className="bg-surface/80 backdrop-blur-sm p-5 lg:p-6 hover:bg-surface-alt/80 transition-all duration-300"
          >
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted/50 leading-tight">
              {m.label}
            </div>
            <div className="mt-2.5 text-2xl sm:text-3xl font-black text-foreground tabular-nums tracking-tight leading-none">
              {m.value}
            </div>
            {m.sublabel && (
              <div className="mt-2 text-[10px] text-muted/40 leading-tight">{m.sublabel}</div>
            )}
          </div>
        ))}
      </div>

      {/* Verdict chips */}
      <div className="mt-8 flex flex-wrap gap-1.5">
        {hero.positives.map((p, i) => (
          <button
            key={`p${i}`}
            onClick={() => setExpandedChip(expandedChip === i ? null : i)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-all duration-200 backdrop-blur-sm
              ${expandedChip === i
                ? "border-success/30 bg-success/10 text-foreground/90 shadow-md shadow-success/10"
                : "border-white/[0.06] text-foreground/50 hover:border-success/20 hover:text-foreground/70"
              }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success/70 shrink-0" />
            {truncateToLabel(p)}
          </button>
        ))}
        {hero.cautions.map((c, i) => {
          const idx = i + hero.positives.length
          return (
            <button
              key={`c${i}`}
              onClick={() => setExpandedChip(expandedChip === idx ? null : idx)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-all duration-200 backdrop-blur-sm
                ${expandedChip === idx
                  ? "border-warning/30 bg-warning/10 text-foreground/90 shadow-md shadow-warning/10"
                  : "border-white/[0.06] text-foreground/50 hover:border-warning/20 hover:text-foreground/70"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-warning/70 shrink-0" />
              {truncateToLabel(c)}
            </button>
          )
        })}
      </div>

      {/* Expanded chip detail */}
      {expandedChip !== null && (
        <div className="mt-3 rounded-xl border border-white/[0.06] bg-surface/80 backdrop-blur-md px-5 py-4 text-sm text-foreground/70 leading-relaxed animate-fade-up max-w-2xl shadow-lg shadow-black/20">
          {expandedChip < hero.positives.length
            ? hero.positives[expandedChip]
            : hero.cautions[expandedChip - hero.positives.length]}
        </div>
      )}
    </section>
  )
}
