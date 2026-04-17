"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { Icon } from "./icons"
import { Chip } from "./primitives"

type Props = {
  hero: BrandPageModel["hero"]
  provenance: BrandPageModel["provenance"]
}

export default function HeroLux({ hero, provenance }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section
      id="hero"
      className="scroll-mt-24 lux-hero-mesh -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pt-14 pb-16 rounded-b-[28px] mb-4"
    >
      {/* Ticker strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.24em] uppercase text-[color:var(--lux-ink-mute)] font-medium lux-fade">
        <span>{hero.category}</span>
        <span className="text-[color:var(--lux-ink-faint)]">·</span>
        <span>FDD {hero.filingYear}</span>
        <span className="text-[color:var(--lux-ink-faint)]">·</span>
        <span>File {provenance.fddId}</span>
        <span className="text-[color:var(--lux-ink-faint)]">·</span>
        <span>{provenance.franchisorLegalName}</span>
      </div>

      {/* Two-column hero */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-14">
        {/* Left — wordmark + thesis */}
        <div className="lux-fade lux-fade-1">
          <h1 className="lux-serif text-[64px] sm:text-[104px] lg:text-[120px] leading-[0.92] tracking-[-0.04em] text-[color:var(--lux-ink)] font-medium">
            {hero.brandName}
          </h1>

          {/* Thesis — newly surfaced */}
          <p className="mt-6 lux-serif italic text-[18px] sm:text-[22px] leading-[1.45] text-[color:var(--lux-ink-soft)] max-w-2xl border-l-2 border-[color:var(--lux-gold)] pl-5">
            {hero.thesis}
          </p>

          {/* Verification row */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--lux-good)]/30 bg-[color:var(--lux-good)]/8 px-3.5 py-1.5 text-[11px] text-[color:var(--lux-good)] font-medium">
              <Icon name="shield" width={13} height={13} />
              Government-filed FDD · verified
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-1)] px-3.5 py-1.5 text-[11px] text-[color:var(--lux-ink-mute)]">
              <Icon name="audit" width={13} height={13} />
              Ernst &amp; Young · clean opinion
            </span>
          </div>

          {/* Severity chips (positives + cautions) */}
          <div className="mt-8 flex flex-wrap gap-2 max-w-3xl">
            {hero.positives.map((p, i) => (
              <button
                key={`p${i}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className={`rounded-full border px-3.5 py-2 text-[12px] text-left transition-all duration-220 flex items-center gap-2
                  ${expanded === i
                    ? "border-[color:var(--lux-good)]/40 bg-[color:var(--lux-good)]/10 text-[color:var(--lux-ink)]"
                    : "border-[color:var(--lux-edge)] text-[color:var(--lux-ink-mute)] hover:border-[color:var(--lux-good)]/30 hover:text-[color:var(--lux-ink-soft)]"}`}
              >
                <Icon name="check" width={12} height={12} strokeWidth={2} />
                <span className="truncate max-w-[220px]">{firstClause(p)}</span>
              </button>
            ))}
            {hero.cautions.map((c, i) => {
              const idx = i + hero.positives.length
              return (
                <button
                  key={`c${i}`}
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  className={`rounded-full border px-3.5 py-2 text-[12px] text-left transition-all duration-220 flex items-center gap-2
                    ${expanded === idx
                      ? "border-[color:var(--lux-warn)]/40 bg-[color:var(--lux-warn)]/10 text-[color:var(--lux-ink)]"
                      : "border-[color:var(--lux-edge)] text-[color:var(--lux-ink-mute)] hover:border-[color:var(--lux-warn)]/30 hover:text-[color:var(--lux-ink-soft)]"}`}
                >
                  <Icon name="flag" width={12} height={12} strokeWidth={2} />
                  <span className="truncate max-w-[220px]">{firstClause(c)}</span>
                </button>
              )
            })}
          </div>

          {expanded !== null && (
            <div className="mt-4 lux-card p-5 max-w-2xl lux-fade">
              <p className="text-[14px] leading-relaxed text-[color:var(--lux-ink-soft)]">
                {expanded < hero.positives.length
                  ? hero.positives[expanded]
                  : hero.cautions[expanded - hero.positives.length]}
              </p>
            </div>
          )}
        </div>

        {/* Right — KPI rail */}
        <aside className="lux-card p-7 lux-fade lux-fade-2 h-fit">
          <div className="lux-eyebrow mb-3">Snapshot</div>
          <div className="lux-rule mb-2" />
          {hero.keyMetrics.map((m) => (
            <div key={m.label} className="lux-kpi-row">
              <div>
                <div className="lux-kpi-label">{m.label}</div>
                {m.sublabel && (
                  <div className="text-[10px] text-[color:var(--lux-ink-faint)] mt-1">{m.sublabel}</div>
                )}
              </div>
              <div className="lux-kpi-value lux-num">{m.value}</div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  )
}

/** Keep a chip short — first clause only. */
function firstClause(s: string): string {
  const m = s.match(/^[^.]+\./)
  const first = m ? m[0] : s
  const words = first.split(/\s+/)
  if (words.length > 10) return words.slice(0, 10).join(" ") + "…"
  return first.replace(/\.$/, "")
}
