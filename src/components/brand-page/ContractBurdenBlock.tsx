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
  post_term: { label: "Post-term", icon: "🚫" },
}

const SEV: Record<string, { bar: string; text: string; label: string; bg: string }> = {
  high: { bar: "from-danger/30 to-danger/70", text: "text-danger", label: "HIGH", bg: "bg-danger/8" },
  caution: { bar: "from-warning/25 to-warning/60", text: "text-warning", label: "CAUT", bg: "bg-warning/5" },
  neutral: { bar: "from-accent/15 to-accent/40", text: "text-accent", label: "LOW", bg: "" },
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
      <div className="flex gap-2 mb-6">
        {highCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/8 border border-danger/15 px-3 py-1.5 text-[10px] text-danger font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            {highCount} high burden
          </span>
        )}
        {cautionCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/5 border border-warning/15 px-3 py-1.5 text-[10px] text-warning font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            {cautionCount} caution
          </span>
        )}
      </div>

      {/* ── Signature severity chart ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface/80 shadow-xl shadow-black/20 overflow-hidden">
        {/* Bar chart area */}
        <div className="p-6 sm:p-8 space-y-3">
          {families.map((f, i) => {
            const sev = SEV[f.severity] ?? SEV.neutral
            const meta = FAMILY_META[f.family] ?? { label: f.family, icon: "·" }
            const pct = severityToPercent(f.severity)
            return (
              <div key={f.family} className={`rounded-xl p-3 ${sev.bg} transition-colors`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base">{meta.icon}</span>
                  <span className="text-xs font-semibold text-foreground/80 flex-1">{meta.label}</span>
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${sev.text}`}>
                    {sev.label}
                  </span>
                </div>
                <div className="h-3 bg-surface-alt/60 rounded-lg overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${sev.bar} rounded-lg`}
                    style={{ width: `${pct}%`, animation: `fill-bar 0.7s ease-out ${i * 100}ms both` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Expandable detail rows */}
        <div className="border-t border-white/[0.04] divide-y divide-white/[0.03]">
          {families.map((f) => {
            const meta = FAMILY_META[f.family] ?? { label: f.family, icon: "·" }
            const sev = SEV[f.severity] ?? SEV.neutral
            return (
              <ExpandableRow
                key={f.family}
                severity={f.severity}
                title={meta.label}
                badge={sev.label}
                badgeColor={sev.text}
              >
                <p className="text-sm text-foreground/70 leading-relaxed">{f.summary}</p>
                {f.evidencePoints.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.evidencePoints.map((e, i) => (
                      <span key={i} className="text-[10px] text-muted/40 rounded-full border border-white/[0.06] px-2 py-0.5">
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
