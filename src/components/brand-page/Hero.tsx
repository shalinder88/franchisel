"use client"
import { useState } from "react"
import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
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
    <section id="hero" className="scroll-mt-24 pt-4 pb-14">
      {/* Top line */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted font-medium">
        <span>{hero.category}</span>
        <span className="text-border">·</span>
        <span>FDD {hero.filingYear}</span>
      </div>

      {/* Brand name — cinematic */}
      <h1 className="mt-2 text-5xl sm:text-7xl font-extrabold text-foreground tracking-tighter leading-none">
        {hero.brandName}
      </h1>

      {/* Verification + severity ribbon in one row */}
      <div className="mt-5 flex items-center gap-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Gov-filed FDD verified
        </span>
        {summaryItems && summaryItems.length > 0 && (
          <div className="flex h-1.5 rounded-full overflow-hidden bg-surface-alt flex-1 min-w-[120px] max-w-[200px]">
            {summaryItems.map((s) => (
              <div
                key={s.id}
                className={`flex-1 ${SEV_COLOR[s.severity ?? "neutral"]}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Premium metric strip ── */}
      <div className="mt-8 grid grid-cols-3 lg:grid-cols-6 gap-px bg-border/30 rounded-2xl overflow-hidden border border-border/40">
        {hero.keyMetrics.map((m) => (
          <div key={m.label} className="bg-surface p-5 hover:bg-surface-alt/60 transition-colors">
            <div className="text-[9px] uppercase tracking-[0.15em] text-muted/70 leading-tight">{m.label}</div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums tracking-tight leading-none">
              {m.value}
            </div>
            {m.sublabel && (
              <div className="mt-1.5 text-[10px] text-muted/50">{m.sublabel}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Verdict chip row — replaces paragraphs ── */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {hero.positives.map((p, i) => (
          <button
            key={`p${i}`}
            onClick={() => setExpandedChip(expandedChip === i ? null : i)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-all
              ${expandedChip === i
                ? "border-success/40 bg-success/8 text-foreground shadow-sm shadow-success/10"
                : "border-border/50 text-foreground/60 hover:border-success/25"
              }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success/80 shrink-0" />
            {truncateToLabel(p)}
          </button>
        ))}
        {hero.cautions.map((c, i) => {
          const idx = i + hero.positives.length
          return (
            <button
              key={`c${i}`}
              onClick={() => setExpandedChip(expandedChip === idx ? null : idx)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-all
                ${expandedChip === idx
                  ? "border-warning/40 bg-warning/8 text-foreground shadow-sm shadow-warning/10"
                  : "border-border/50 text-foreground/60 hover:border-warning/25"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-warning/80 shrink-0" />
              {truncateToLabel(c)}
            </button>
          )
        })}
      </div>

      {/* Expanded detail — only shows for selected chip */}
      {expandedChip !== null && (
        <div className="mt-3 rounded-xl border border-border/40 bg-surface px-5 py-4 text-sm text-foreground/75 leading-relaxed animate-fade-up max-w-2xl">
          {expandedChip < hero.positives.length
            ? hero.positives[expandedChip]
            : hero.cautions[expandedChip - hero.positives.length]}
        </div>
      )}
    </section>
  )
}
