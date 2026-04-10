"use client"
import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import HoverTooltip from "./HoverTooltip"

const SIGNAL: Record<string, string> = {
  high: "bg-danger/50",
  caution: "bg-warning/40",
  neutral: "bg-success/30",
}

// Audit-related labels that get merged into a single status badge
const AUDIT_LABELS = new Set(["Auditor", "Audit opinion", "Going concern doubt"])

export default function FinancialStrengthBlock({
  financial,
}: {
  financial: BrandPageModel["financialStrength"]
}) {
  const auditItems = financial.highlights.filter((h) => AUDIT_LABELS.has(h.label))
  const metricItems = financial.highlights.filter((h) => !AUDIT_LABELS.has(h.label))

  // Build audit status line
  const auditorName = auditItems.find((h) => h.label === "Auditor")?.value ?? ""
  const opinion = auditItems.find((h) => h.label === "Audit opinion")?.value ?? ""
  const concern = auditItems.find((h) => h.label === "Going concern doubt")?.value ?? ""

  return (
    <SectionShell id="financial-strength" eyebrow="Franchisor health" headline="Franchisor financials">
      {/* Audit status — single compact line instead of 3 cards */}
      {auditItems.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/5 px-3 py-1.5 text-[10px] text-success/90 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Clean audit
          </span>
          <span className="text-[11px] text-muted/40">
            {auditorName} · {opinion} · {concern}
          </span>
        </div>
      )}

      {/* Health signal strip */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-surface-alt/60 mb-5">
        {metricItems.map((h, i) => (
          <div key={i} className={`flex-1 ${SIGNAL[h.severity ?? "neutral"]}`} />
        ))}
      </div>

      {/* Metric cards — only non-audit items */}
      <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 divide-y divide-border/20">
        {metricItems.map((h) => {
          const row = (
            <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-all duration-200">
              <span className="text-xs text-foreground/60">{h.label}</span>
              <span className="text-sm font-bold text-foreground tabular-nums">{h.value}</span>
            </div>
          )
          return h.note ? (
            <HoverTooltip key={h.label} content={h.note} position="bottom">{row}</HoverTooltip>
          ) : (
            <div key={h.label}>{row}</div>
          )
        })}
      </div>
    </SectionShell>
  )
}
