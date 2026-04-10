"use client"
import { useState } from "react"
import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import { firstSentence } from "@/lib/brand-pages/mappers"

const ICONS: Record<string, string> = {
  "cost-to-enter": "💰",
  "revenue-quality": "📊",
  stability: "📈",
  contract: "📋",
  fit: "👤",
}

const SEV_BG: Record<string, string> = {
  high: "border-danger/30 bg-danger/5",
  caution: "border-warning/25 bg-warning/4",
  neutral: "border-accent/20 bg-accent/4",
}
const SEV_BADGE: Record<string, { text: string; color: string }> = {
  high: { text: "HIGH", color: "text-danger bg-danger/10" },
  caution: { text: "CAUTION", color: "text-warning bg-warning/10" },
  neutral: { text: "OK", color: "text-accent bg-accent/10" },
}

export default function GuidedSummary({
  items,
}: {
  items: BrandPageModel["guidedSummary"]
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const active = items.find((c) => c.id === selected)

  return (
    <SectionShell
      id="guided-summary"
      eyebrow="At a glance"
      headline="Five things to know first"
    >
      {/* ── Icon tile grid — the primary visual ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {items.map((card) => {
          const sev = card.severity ?? "neutral"
          const badge = SEV_BADGE[sev]
          const isActive = selected === card.id
          return (
            <button
              key={card.id}
              onClick={() => setSelected(isActive ? null : card.id)}
              className={`rounded-xl border p-4 text-left transition-all duration-200
                ${isActive
                  ? `${SEV_BG[sev]} ring-1 ring-inset ring-white/5 shadow-lg shadow-black/20`
                  : "border-border/40 bg-surface hover:bg-surface-alt hover:border-border"
                }`}
            >
              <div className="text-2xl mb-3">{ICONS[card.id] ?? "◆"}</div>
              <div className="text-xs font-semibold text-foreground leading-snug mb-2">
                {card.title}
              </div>
              <span className={`inline-block text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${badge.color}`}>
                {badge.text}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Expanded detail for selected tile ── */}
      {active && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 p-5 animate-fade-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{ICONS[active.id] ?? "◆"}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{active.title}</div>
              <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{active.verdict}</p>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                <span className="text-foreground/40 font-medium">Why it matters</span> — {active.whyItMatters}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  )
}
