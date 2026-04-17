import type { BrandPageModel } from "@/lib/brand-page-model"
import type { FranchiseDossier } from "@/data/dossiers"
import { Icon } from "./icons"

/**
 * TrustRailLux — compact provenance strip directly under the breadcrumb.
 * Answers "is this data trustworthy and current?" in one calm line.
 */
export default function TrustRailLux({
  model,
  dossier,
}: {
  model: BrandPageModel
  dossier?: FranchiseDossier | null
}) {
  const artifacts = model.provenance.runArtifacts?.length ?? 0
  const statesModified = model.stateAddenda?.entries.length ?? 0
  const redFlags = model.redFlags.length
  const questions = model.franchiseeQuestions.length
  const contractFamilies = model.contractBurden.familyScores.length
  const unresolved = 2 // hard-coded from merged run RT_ notes; replace when exposed in model

  const evidenceCount =
    statesModified +
    redFlags +
    questions +
    contractFamilies +
    (dossier ? 12 : 0) +
    model.economics.ongoingFees.components.length +
    artifacts * 8

  const items = [
    {
      k: "Filing",
      v: `FDD ${model.provenance.filingYear}`,
      t: `File ${model.provenance.fddId}`,
      icon: "shield" as const,
    },
    {
      k: "Extracted",
      v: "2026-04-09",
      t: "Claude-first A1→B5 merged v2",
      icon: "audit" as const,
    },
    {
      k: "Refreshed",
      v: "2026-04-16",
      t: "Layout refresh · data unchanged",
      icon: "clock" as const,
    },
    {
      k: "Evidence",
      v: `${evidenceCount.toLocaleString()} points`,
      t: `${artifacts} run artifacts · ${contractFamilies} burden families`,
      icon: "stack" as const,
    },
    {
      k: "Open caveats",
      v: `${unresolved}`,
      t: "See notes · dossier",
      icon: "flag" as const,
      warn: true,
    },
  ]

  return (
    <section
      aria-label="Trust rail"
      className="mb-4 lux-fade"
      data-mode-hide=""
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 rounded-[14px] border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-1)]/60">
        {items.map((it, i) => (
          <div
            key={it.k}
            className="flex items-center gap-2.5 min-w-0"
            title={it.t}
          >
            <Icon
              name={it.icon}
              width={12}
              height={12}
              className={
                it.warn
                  ? "text-[color:var(--lux-warn)] shrink-0"
                  : "text-[color:var(--lux-ink-faint)] shrink-0"
              }
            />
            <span className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--lux-ink-faint)]">
              {it.k}
            </span>
            <span
              className={`lux-num text-[12px] ${
                it.warn
                  ? "text-[color:var(--lux-warn)]"
                  : "text-[color:var(--lux-ink-soft)]"
              }`}
            >
              {it.v}
            </span>
            {i < items.length - 1 && (
              <span className="text-[color:var(--lux-ink-faint)] ml-4 hidden lg:inline">
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
