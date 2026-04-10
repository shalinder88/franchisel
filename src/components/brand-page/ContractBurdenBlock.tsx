import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import { severityRank } from "@/lib/brand-pages/mappers"

const FAMILY_LABEL: Record<string, string> = {
  territory: "Territory",
  supplier: "Supplier & required purchases",
  capex: "Capex / system upgrades",
  operations: "Operations & standards",
  transfer: "Transfer & resale",
  renewal: "Renewal",
  termination: "Termination",
  post_term: "Post-term obligations",
}

function severityBar(s: Severity): { width: string; color: string; label: string } {
  if (s === "high") return { width: "w-full", color: "bg-danger/70", label: "High" }
  if (s === "caution") return { width: "w-2/3", color: "bg-warning/70", label: "Caution" }
  return { width: "w-1/3", color: "bg-muted/50", label: "Neutral" }
}

export default function ContractBurdenBlock({
  contract,
}: {
  contract: BrandPageModel["contractBurden"]
}) {
  const families = [...contract.familyScores].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity),
  )

  return (
    <SectionShell
      id="contract"
      eyebrow="The contract"
      headline="What you give up when you sign"
      takeaway={contract.overallVerdict}
    >
      <div className="rounded-lg border border-border bg-surface divide-y divide-border">
        {families.map((f) => {
          const bar = severityBar(f.severity)
          return (
            <div key={f.family} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-[180px]">
                  <div className="text-sm font-semibold text-foreground">
                    {FAMILY_LABEL[f.family] ?? f.family}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                    {bar.label}
                  </div>
                </div>
                <p className="flex-1 min-w-[240px] text-sm text-foreground/80 leading-relaxed">
                  {f.summary}
                </p>
              </div>
              <div className="mt-3 h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
                <div className={`${bar.width} h-full ${bar.color} rounded-full`} />
              </div>
              {f.evidencePoints.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.evidencePoints.map((e, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-muted rounded border border-border px-2 py-0.5"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {contract.takeaways.length > 0 ? (
        <ul className="mt-5 space-y-1.5 text-xs text-foreground/70">
          {contract.takeaways.map((t, i) => (
            <li key={i}>— {t}</li>
          ))}
        </ul>
      ) : null}
    </SectionShell>
  )
}
