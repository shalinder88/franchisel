"use client"
import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import ExpandableRow from "./ExpandableRow"
import { severityRank, severityToPercent } from "@/lib/brand-pages/mappers"

const FAMILY_META: Record<string, { label: string; icon: string }> = {
  territory: { label: "Territory", icon: "📍" },
  supplier: { label: "Supplier & purchases", icon: "🔒" },
  capex: { label: "Capex / upgrades", icon: "🔧" },
  operations: { label: "Operations & standards", icon: "⚙️" },
  transfer: { label: "Transfer & resale", icon: "🔄" },
  renewal: { label: "Renewal", icon: "📅" },
  termination: { label: "Termination", icon: "⛔" },
  post_term: { label: "Post-term obligations", icon: "🚫" },
}

const SEV_BAR: Record<string, { color: string; text: string; label: string }> = {
  high: { color: "bg-danger/60", text: "text-danger", label: "HIGH" },
  caution: { color: "bg-warning/50", text: "text-warning", label: "CAUT" },
  neutral: { color: "bg-accent/30", text: "text-accent", label: "LOW" },
}

export default function ContractBurdenBlock({
  contract,
}: {
  contract: BrandPageModel["contractBurden"]
}) {
  const families = [...contract.familyScores].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity),
  )
  const highCount = families.filter((f) => f.severity === "high").length
  const cautionCount = families.filter((f) => f.severity === "caution").length

  return (
    <SectionShell id="contract" eyebrow="The contract" headline="What you give up">
      {/* Severity count summary */}
      <div className="flex gap-2 mb-5">
        {highCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/8 border border-danger/20 px-3 py-1 text-[10px] text-danger font-medium">
            {highCount} high burden
          </span>
        )}
        {cautionCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/8 border border-warning/20 px-3 py-1 text-[10px] text-warning font-medium">
            {cautionCount} caution
          </span>
        )}
      </div>

      {/* ── Severity bar chart with icons ── */}
      <div className="rounded-xl border border-white/[0.06] bg-surface/80 shadow-lg shadow-black/10 overflow-hidden">
        <div className="px-5 pt-5 pb-3 space-y-3">
          {families.map((f, i) => {
            const bar = SEV_BAR[f.severity] ?? SEV_BAR.neutral
            const meta = FAMILY_META[f.family] ?? { label: f.family, icon: "·" }
            const pct = severityToPercent(f.severity)
            return (
              <div key={f.family} className="grid grid-cols-[24px_140px_1fr_48px] sm:grid-cols-[28px_180px_1fr_56px] items-center gap-2">
                <span className="text-sm text-center">{meta.icon}</span>
                <span className="text-[11px] font-medium text-foreground/80 truncate">{meta.label}</span>
                <div className="h-5 bg-surface-alt rounded overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded`}
                    style={{ width: `${pct}%`, animation: `fill-bar 0.6s ease-out ${i * 80}ms both` }}
                  />
                </div>
                <span className={`text-[9px] uppercase tracking-widest font-bold text-right ${bar.text}`}>
                  {bar.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Expandable detail rows */}
        <div className="border-t border-border/30 divide-y divide-border/20">
          {families.map((f) => {
            const meta = FAMILY_META[f.family] ?? { label: f.family, icon: "·" }
            return (
              <ExpandableRow
                key={f.family}
                severity={f.severity}
                title={meta.label}
                badge={SEV_BAR[f.severity]?.label}
                badgeColor={SEV_BAR[f.severity]?.text}
              >
                <p className="text-sm text-foreground/75 leading-relaxed">{f.summary}</p>
                {f.evidencePoints.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.evidencePoints.map((e, i) => (
                      <span key={i} className="text-[10px] text-muted/60 rounded border border-border/40 px-2 py-0.5">
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </ExpandableRow>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
