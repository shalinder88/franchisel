"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, Chip, type LuxSeverity } from "./primitives"
import { Icon, type IconName } from "./icons"
import { severityRank } from "@/lib/brand-pages/mappers"

const FAMILY_META: Record<string, { label: string; icon: IconName; tag: string }> = {
  territory: { label: "Territory", icon: "territory", tag: "Item 12 · FA" },
  supplier: { label: "Supplier & purchases", icon: "supplier", tag: "Item 8 · Item 6" },
  capex: { label: "Capex / upgrades", icon: "capex", tag: "FA" },
  operations: { label: "Operations & standards", icon: "operations", tag: "FA §7 · Item 11" },
  transfer: { label: "Transfer & resale", icon: "transfer", tag: "FA §15 · Ex N" },
  renewal: { label: "Renewal", icon: "renewal", tag: "Ex K" },
  termination: { label: "Termination", icon: "termination", tag: "FA §16–17" },
  post_term: { label: "Post-term", icon: "post_term", tag: "FA §18–19" },
}

export default function ContractLux({
  contract,
}: {
  contract: BrandPageModel["contractBurden"]
}) {
  const families = [...contract.familyScores].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity),
  )
  const high = families.filter((f) => f.severity === "high").length
  const caution = families.filter((f) => f.severity === "caution").length
  const [open, setOpen] = useState<string | null>(null)

  return (
    <SectionLux
      id="contract"
      eyebrow="The contract"
      headline="What you give up"
      kicker="Most of the burden traces to one fact: McDonald's owns the real estate and you don't. That shapes territory, rent, transfer, and termination."
    >
      {/* Severity count row */}
      <div className="flex gap-2 mb-6">
        <Chip severity="high">{high} High burden</Chip>
        <Chip severity="caution">{caution} Caution</Chip>
      </div>

      {/* Dense matrix */}
      <div className="lux-card divide-y divide-[color:var(--lux-edge)]">
        {families.map((f) => {
          const meta = FAMILY_META[f.family] ?? { label: f.family, icon: "info" as IconName, tag: "" }
          const sev = f.severity as LuxSeverity
          const isOpen = open === f.family
          return (
            <div
              key={f.family}
              className={`${sev === "high" ? "lux-rail-high" : sev === "caution" ? "lux-rail-caution" : "lux-rail-neutral"}`}
            >
              <div className="px-6 sm:px-8 py-5">
                <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
                  <div className="pt-0.5">
                    <Icon name={meta.icon} width={18} height={18} className="text-[color:var(--lux-ink-mute)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                      <span className="text-[14px] font-semibold text-[color:var(--lux-ink)]">{meta.label}</span>
                      <span className="lux-eyebrow">{meta.tag}</span>
                    </div>
                    <p className="text-[13px] text-[color:var(--lux-ink-soft)] leading-relaxed">{f.summary}</p>

                    {isOpen && f.evidencePoints.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 lux-fade">
                        {f.evidencePoints.map((e, ei) => (
                          <span
                            key={ei}
                            className="text-[10px] text-[color:var(--lux-ink-mute)] rounded-full border border-[color:var(--lux-edge)] px-2.5 py-0.5 bg-[color:var(--lux-surface-0)]"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <Chip severity={sev}>
                      {sev === "high" ? "High" : sev === "caution" ? "Watch" : "OK"}
                    </Chip>
                    {f.evidencePoints.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : f.family)}
                        className="text-[color:var(--lux-ink-faint)] hover:text-[color:var(--lux-ink-mute)] transition-colors"
                        aria-label={isOpen ? "Hide evidence" : "Show evidence"}
                      >
                        <Icon
                          name="arrowDown"
                          width={13}
                          height={13}
                          className={`transition-transform duration-220 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionLux>
  )
}
