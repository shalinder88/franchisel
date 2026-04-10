"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import HoverTooltip from "./HoverTooltip"
import { truncateToLabel } from "@/lib/brand-pages/mappers"

const CAT_META: Record<string, { icon: string; label: string; color: string }> = {
  economics: { icon: "💰", label: "Economics", color: "border-accent/20 bg-accent/4" },
  operations: { icon: "⚙️", label: "Operations", color: "border-warning/15 bg-warning/3" },
  contract_exit: { icon: "📋", label: "Contract & exit", color: "border-danger/15 bg-danger/3" },
  support: { icon: "🤝", label: "Support", color: "border-success/15 bg-success/3" },
}

export default function QuestionList({
  questions,
}: {
  questions: BrandPageModel["franchiseeQuestions"]
}) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const grouped = questions.reduce<Record<string, (typeof questions[0] & { globalIdx: number })[]>>((acc, q, i) => {
    acc[q.category] = acc[q.category] ?? []
    acc[q.category].push({ ...q, globalIdx: i })
    return acc
  }, {})

  return (
    <SectionShell id="questions" eyebrow="Your next call" headline="What to ask operators">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(grouped).map(([cat, items]) => {
          const meta = CAT_META[cat] ?? { icon: "?", label: cat, color: "border-border/40" }
          return (
            <div key={cat} className={`rounded-xl border ${meta.color} p-5`}>
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">{meta.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">
                  {meta.label} · {items.length} questions
                </span>
              </div>
              {/* Questions as compact expandable chips */}
              <div className="space-y-1.5">
                {items.map((q) => {
                  const isOpen = expanded === q.globalIdx
                  return (
                    <div key={q.globalIdx}>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : q.globalIdx)}
                        className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-all text-[12px]
                          ${isOpen
                            ? "bg-surface-alt/80 text-foreground"
                            : "text-foreground/60 hover:bg-surface-alt/40 hover:text-foreground/80"
                          }`}
                      >
                        <span className="text-muted/30 font-bold tabular-nums shrink-0 w-4 text-right">
                          {q.globalIdx + 1}
                        </span>
                        <span className="flex-1 min-w-0 truncate">
                          {isOpen ? "" : truncateToLabel(q.question, 8)}
                        </span>
                        <svg
                          className={`w-3 h-3 text-muted shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 animate-fade-up">
                          <p className="text-[13px] text-foreground/80 leading-relaxed">{q.question}</p>
                          <HoverTooltip content={q.basedOn}>
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted/40 cursor-default hover:text-muted transition-colors">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                              </svg>
                              Source
                            </span>
                          </HoverTooltip>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
