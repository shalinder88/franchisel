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
  high: { bar: "bg-gradient-to-r from-red-700 to-red-500", text: "text-red-400", label: "HIGH", bg: "bg-red-500/8" },
  caution: { bar: "bg-gradient-to-r from-amber-700 to-amber-500", text: "text-amber-400", label: "CAUT", bg: "bg-amber-500/6" },
  neutral: { bar: "bg-gradient-to-r from-cyan-700 to-cyan-500", text: "text-cyan-400", label: "LOW", bg: "" },
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
      {/* Severity summary */}
      <div className="flex gap-2 mb-6">
        {highCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[11px] text-red-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {highCount} high burden
          </span>
        )}
        {cautionCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[11px] text-amber-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {cautionCount} caution
          </span>
        )}
      </div>

      {/* ── Severity chart ── */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="p-6 sm:p-8 space-y-3">
          {families.map((f, i) => {
            const sev = SEV[f.severity] ?? SEV.neutral
            const meta = FAMILY_META[f.family] ?? { label: f.family, icon: "·" }
            const pct = severityToPercent(f.severity)
            return (
              <div key={f.family} className={`rounded-xl p-4 ${sev.bg}`}>
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-lg">{meta.icon}</span>
                  <span className="text-sm font-semibold text-foreground flex-1">{meta.label}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${sev.text}`}>
                    {sev.label}
                  </span>
                </div>
                <div className="h-4 bg-surface-alt rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${sev.bar} rounded-lg`}
                    style={{ width: `${pct}%`, animation: `fill-bar 0.7s ease-out ${i * 100}ms both` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Expandable details */}
        <div className="border-t border-border divide-y divide-border/50">
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
                    {f.evidencePoints.map((e, ei) => (
                      <span key={ei} className="text-[10px] text-foreground/40 rounded-full border border-border px-2.5 py-0.5">
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
