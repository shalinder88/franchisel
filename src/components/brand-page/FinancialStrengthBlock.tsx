"use client"
import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import HoverTooltip from "./HoverTooltip"

const SIGNAL: Record<string, string> = {
  high: "bg-danger/50",
  caution: "bg-warning/40",
  neutral: "bg-success/30",
}
const ICON: Record<string, string> = {
  Auditor: "🔍",
  "Audit opinion": "✓",
  "Going concern doubt": "✓",
  "Total revenue 2024": "📊",
  "Net income 2024": "💵",
  "Total assets 2024": "🏦",
  "Members' equity 2024": "📐",
  "Intercompany payable to parent": "🔄",
  "IP royalty paid to parent": "⚠",
}

export default function FinancialStrengthBlock({
  financial,
}: {
  financial: BrandPageModel["financialStrength"]
}) {
  // Group into primary (first 3-4 with severity) and secondary
  const primary = financial.highlights.filter((h) => h.severity)
  const secondary = financial.highlights.filter((h) => !h.severity)

  return (
    <SectionShell
      id="financial-strength"
      eyebrow="Franchisor health"
      headline="Franchisor financials"
    >
      {/* Health signal strip */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-surface-alt mb-6">
        {financial.highlights.map((h, i) => (
          <div key={i} className={`flex-1 ${SIGNAL[h.severity ?? "neutral"]}`} />
        ))}
      </div>

      {/* Primary health cards — icon-led with visual weight */}
      {primary.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {primary.map((h) => {
            const card = (
              <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 p-4 hover:bg-surface-alt/60 transition-colors">
                <div className="text-lg mb-2">{ICON[h.label] ?? "◆"}</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-muted/60">{h.label}</div>
                <div className="mt-1 text-sm font-bold text-foreground tabular-nums">{h.value}</div>
              </div>
            )
            return h.note ? (
              <HoverTooltip key={h.label} content={h.note} position="bottom">{card}</HoverTooltip>
            ) : (
              <div key={h.label}>{card}</div>
            )
          })}
        </div>
      )}

      {/* Secondary metrics — compact row */}
      {secondary.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 divide-y divide-border/30">
          {secondary.map((h) => {
            const row = (
              <div className="flex items-center justify-between px-5 py-3 hover:bg-surface-alt/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{ICON[h.label] ?? "·"}</span>
                  <span className="text-xs text-foreground/70">{h.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums">{h.value}</span>
              </div>
            )
            return h.note ? (
              <HoverTooltip key={h.label} content={h.note} position="bottom">{row}</HoverTooltip>
            ) : (
              <div key={h.label}>{row}</div>
            )
          })}
        </div>
      )}
    </SectionShell>
  )
}
