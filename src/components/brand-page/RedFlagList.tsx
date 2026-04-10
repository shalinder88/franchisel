"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import { sortRedFlags } from "@/lib/brand-pages/mappers"

const FLAG_ICONS: Record<string, string> = {
  "No exclusive territory": "📍",
  "Termination buyout excludes goodwill": "💰",
  "Item 19 uses the wrong royalty rate for new operators": "📊",
  "You stay liable after you sell": "⚖️",
  "Internal data disagrees by one unit": "🔢",
}

export default function RedFlagList({
  flags,
}: {
  flags: BrandPageModel["redFlags"]
}) {
  const sorted = sortRedFlags(flags)
  const [expanded, setExpanded] = useState<number | null>(null)
  const highCount = sorted.filter((f) => f.severity === "high").length
  const cautionCount = sorted.filter((f) => f.severity === "caution").length

  return (
    <SectionShell id="red-flags" eyebrow="Watch carefully" headline="What could go wrong">
      {/* Severity count pills */}
      <div className="flex gap-2 mb-5">
        {highCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/8 border border-danger/20 px-3 py-1 text-[10px] text-danger font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            {highCount} high risk
          </span>
        )}
        {cautionCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/8 border border-warning/20 px-3 py-1 text-[10px] text-warning font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            {cautionCount} caution
          </span>
        )}
      </div>

      {/* Flag cards */}
      <div className="space-y-2">
        {sorted.map((f, i) => {
          const isHigh = f.severity === "high"
          const isOpen = expanded === i
          const icon = FLAG_ICONS[f.title] ?? (isHigh ? "🔴" : "🟡")

          return (
            <div
              key={i}
              className={`rounded-xl border transition-all ${
                isHigh
                  ? "border-danger/20 bg-danger/4"
                  : "border-warning/15 bg-warning/3"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <span className="text-lg shrink-0">{icon}</span>
                <span className="text-sm font-semibold text-foreground flex-1">{f.title}</span>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${isHigh ? "text-danger" : "text-warning"}`}>
                  {isHigh ? "HIGH" : "CAUTION"}
                </span>
                <svg
                  className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 animate-fade-up">
                  <p className="text-sm text-foreground/75 leading-relaxed">{f.summary}</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    <span className="text-foreground/40 font-medium">Why it matters</span> — {f.whyItMatters}
                  </p>
                  {f.linkedSectionId && (
                    <a href={`#${f.linkedSectionId}`} className="mt-2 inline-block text-[10px] text-accent hover:underline">
                      See evidence →
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
