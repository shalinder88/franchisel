import type { BrandPageModel } from "@/lib/brand-page-model"
import type { FranchiseDossier } from "@/data/dossiers"
import { Icon } from "./icons"

/**
 * TrustRailLux — provenance strip under the breadcrumb.
 *
 * Real counts come from runs/mcdonalds-2025-merged-v2/14_run_summary.json.
 * The strip answers: is the data trustworthy, current, and how deep did we go.
 */

// Sourced from 14_run_summary.json — merged_best_of_both_v1
const GOLD = {
  itemsCovered: 23,
  itemsTotal: 23,
  exhibits: 20,
  tables: 15,
  clausesStructured: 46,
  financialNoteFamilies: 11,
  stateAddenda: 6,
  contradictions: 5,
  unresolveds: 5,
  overallGrade: "A+",
  filingIssued: "May 1, 2025",
  filingAmended: "Feb 1, 2026",
  mergeDate: "2026-04-06",
  layoutRefresh: "2026-04-17",
}

// Evidence count = every discrete extracted record in the merged canonical
// (clauses + note families + state addenda + exhibits + tables + contradictions
// + unresolveds + financial+contract data points in the dossier layer).
const EVIDENCE_COUNT =
  GOLD.clausesStructured +
  GOLD.financialNoteFamilies +
  GOLD.stateAddenda +
  GOLD.exhibits +
  GOLD.tables +
  GOLD.contradictions +
  GOLD.unresolveds +
  190 // high-confidence canonical fields from run summary

export default function TrustRailLux({
  model,
}: {
  model: BrandPageModel
  dossier?: FranchiseDossier | null
}) {
  const items = [
    {
      k: "Filing",
      v: `FDD ${model.provenance.filingYear}`,
      t: `Issued ${GOLD.filingIssued} · amended ${GOLD.filingAmended} · file ${model.provenance.fddId}`,
      icon: "shield" as const,
    },
    {
      k: "Merged",
      v: GOLD.mergeDate,
      t: "Best-of-both merge of two independent Claude-first extractions",
      icon: "audit" as const,
    },
    {
      k: "Refreshed",
      v: GOLD.layoutRefresh,
      t: "Layout refresh · data unchanged",
      icon: "clock" as const,
    },
    {
      k: "Coverage",
      v: `${GOLD.itemsCovered}/${GOLD.itemsTotal} items`,
      t: `Overall grade ${GOLD.overallGrade}`,
      icon: "check" as const,
      good: true,
    },
    {
      k: "Evidence",
      v: `${EVIDENCE_COUNT.toLocaleString()} points`,
      t: `${GOLD.exhibits} exhibits · ${GOLD.tables} tables · ${GOLD.clausesStructured} clauses · ${GOLD.financialNoteFamilies} note families · ${GOLD.stateAddenda} state addenda`,
      icon: "stack" as const,
    },
    {
      k: "Open caveats",
      v: `${GOLD.contradictions + GOLD.unresolveds}`,
      t: `${GOLD.contradictions} contradictions · ${GOLD.unresolveds} unresolveds preserved`,
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
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 rounded-[14px] border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-1)]/60">
        {items.map((it, i) => (
          <div
            key={it.k}
            className="flex items-center gap-2 min-w-0"
            title={it.t}
          >
            <Icon
              name={it.icon}
              width={12}
              height={12}
              className={
                it.warn
                  ? "text-[color:var(--lux-warn)] shrink-0"
                  : it.good
                    ? "text-[color:var(--lux-good)] shrink-0"
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
                  : it.good
                    ? "text-[color:var(--lux-good)]"
                    : "text-[color:var(--lux-ink-soft)]"
              }`}
            >
              {it.v}
            </span>
            {i < items.length - 1 && (
              <span className="text-[color:var(--lux-ink-faint)] ml-3 hidden xl:inline">
                ·
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Secondary counts row — compact, restrained */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-4 text-[10px] tracking-[0.14em] uppercase text-[color:var(--lux-ink-faint)]">
        <span>
          <span className="lux-num text-[color:var(--lux-ink-mute)]">
            {GOLD.exhibits}
          </span>{" "}
          exhibits
        </span>
        <span>·</span>
        <span>
          <span className="lux-num text-[color:var(--lux-ink-mute)]">
            {GOLD.tables}
          </span>{" "}
          tables
        </span>
        <span>·</span>
        <span>
          <span className="lux-num text-[color:var(--lux-ink-mute)]">
            {GOLD.clausesStructured}
          </span>{" "}
          contract clauses
        </span>
        <span>·</span>
        <span>
          <span className="lux-num text-[color:var(--lux-ink-mute)]">
            {GOLD.financialNoteFamilies}
          </span>{" "}
          note families
        </span>
        <span>·</span>
        <span>
          <span className="lux-num text-[color:var(--lux-ink-mute)]">
            {GOLD.stateAddenda}
          </span>{" "}
          state addenda
        </span>
      </div>
    </section>
  )
}
