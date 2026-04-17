"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, Chip, type LuxSeverity } from "./primitives"
import { Icon, type IconName } from "./icons"

const ROW_ICON: Record<string, IconName> = {
  "cost-to-enter": "stack",
  "revenue-quality": "audit",
  stability: "growth",
  contract: "scale",
  fit: "handshake",
}

export default function GuidedLux({ items }: { items: BrandPageModel["guidedSummary"] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)

  return (
    <SectionLux
      id="guided-summary"
      eyebrow="At a glance"
      headline="Five questions, answered"
      kicker="The decisions you actually need to make — each one supported by evidence in its own section below."
    >
      <div className="lux-card divide-y divide-[color:var(--lux-edge)]">
        {items.map((item, i) => {
          const isOpen = open === item.id
          const sev = (item.severity ?? "neutral") as LuxSeverity
          return (
            <div
              key={item.id}
              className={`${sev === "high" ? "lux-rail-high" : sev === "caution" ? "lux-rail-caution" : "lux-rail-neutral"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="w-full text-left grid grid-cols-[auto_1fr_auto] items-start gap-4 lg:gap-6 px-6 sm:px-8 py-6 hover:bg-[color:var(--lux-surface-2)]/60 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 pt-0.5">
                  <span className="lux-serif text-[color:var(--lux-ink-faint)] text-[20px] tabular-nums w-7">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon name={ROW_ICON[item.id] ?? "info"} width={18} height={18} className="text-[color:var(--lux-ink-mute)]" />
                </div>
                <div className="min-w-0">
                  <div className="lux-eyebrow mb-2">{item.title}</div>
                  <p className="text-[15px] sm:text-[16px] leading-[1.55] text-[color:var(--lux-ink)]">
                    {item.verdict}
                  </p>
                  {isOpen && (
                    <p className="mt-3 text-[13px] text-[color:var(--lux-ink-mute)] leading-relaxed lux-fade">
                      <span className="text-[color:var(--lux-ink-soft)] font-medium">Why it matters — </span>
                      {item.whyItMatters}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Chip severity={sev}>
                    {sev === "high" ? "High" : sev === "caution" ? "Watch" : "OK"}
                  </Chip>
                  <Icon
                    name="arrowDown"
                    width={14}
                    height={14}
                    className={`text-[color:var(--lux-ink-faint)] transition-transform duration-220 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </SectionLux>
  )
}
