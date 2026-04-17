"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, Chip } from "./primitives"
import { Icon, type IconName } from "./icons"
import { sortRedFlags } from "@/lib/brand-pages/mappers"

const FLAG_ICON: Record<string, IconName> = {
  "No exclusive territory": "territory",
  "Termination buyout excludes goodwill": "scale",
  "Item 19 uses the wrong royalty rate for new operators": "audit",
  "You stay liable after you sell": "transfer",
  "Internal data disagrees by one unit": "info",
}

export default function RedFlagsLux({ flags }: { flags: BrandPageModel["redFlags"] }) {
  const sorted = sortRedFlags(flags)
  const [open, setOpen] = useState<number | null>(0)

  return (
    <SectionLux
      id="red-flags"
      eyebrow="Watch carefully"
      headline="What could go wrong"
      kicker="Ranked by severity. Each flag links back to the section where we show the evidence."
    >
      <div className="lux-card divide-y divide-[color:var(--lux-edge)]">
        {sorted.map((f, i) => {
          const isOpen = open === i
          const isHigh = f.severity === "high"
          const icon = FLAG_ICON[f.title] ?? "flag"
          return (
            <div
              key={i}
              className={`${isHigh ? "lux-rail-high" : "lux-rail-caution"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-4 px-6 sm:px-8 py-5 text-left hover:bg-[color:var(--lux-surface-2)]/60 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="lux-serif text-[color:var(--lux-ink-faint)] text-[18px] tabular-nums w-8">
                  {String(i + 1).padStart(2, "0")}<span className="text-[color:var(--lux-ink-faint)]/60">/{sorted.length}</span>
                </span>
                <Icon name={icon} width={18} height={18} className={isHigh ? "text-[color:var(--lux-danger)]/80" : "text-[color:var(--lux-warn)]/80"} />
                <span className="text-[14px] font-semibold text-[color:var(--lux-ink)]">{f.title}</span>
                <Chip severity={isHigh ? "high" : "caution"}>
                  {isHigh ? "High" : "Watch"}
                </Chip>
                <Icon
                  name="arrowDown"
                  width={13}
                  height={13}
                  className={`text-[color:var(--lux-ink-faint)] transition-transform duration-220 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-6 sm:px-8 pb-5 pt-0 lux-fade grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 pl-20">
                  <div>
                    <div className="lux-eyebrow mb-1.5">What</div>
                    <p className="text-[13px] text-[color:var(--lux-ink-soft)] leading-relaxed">{f.summary}</p>
                  </div>
                  <div>
                    <div className="lux-eyebrow mb-1.5">Impact</div>
                    <p className="text-[13px] text-[color:var(--lux-ink-soft)] leading-relaxed">{f.whyItMatters}</p>
                    {f.linkedSectionId && (
                      <a href={`#${f.linkedSectionId}`} className="lux-link inline-flex items-center gap-1 mt-2 text-[11px]">
                        See evidence <Icon name="arrowRight" width={11} height={11} strokeWidth={2} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionLux>
  )
}
