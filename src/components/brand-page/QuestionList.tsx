"use client"
import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import HoverTooltip from "./HoverTooltip"

const CAT_META: Record<string, { icon: string; label: string; color: string }> = {
  economics: { icon: "💰", label: "Economics", color: "border-accent/25 bg-accent/4" },
  operations: { icon: "⚙️", label: "Operations", color: "border-warning/20 bg-warning/4" },
  contract_exit: { icon: "📋", label: "Contract & exit", color: "border-danger/20 bg-danger/4" },
  support: { icon: "🤝", label: "Support", color: "border-success/20 bg-success/4" },
}

export default function QuestionList({
  questions,
}: {
  questions: BrandPageModel["franchiseeQuestions"]
}) {
  const grouped = questions.reduce<Record<string, typeof questions>>((acc, q) => {
    acc[q.category] = acc[q.category] ?? []
    acc[q.category].push(q)
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
                  {meta.label}
                </span>
              </div>
              {/* Questions */}
              <div className="space-y-3">
                {items.map((q, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-base font-bold text-muted/15 tabular-nums leading-snug shrink-0 w-5 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-foreground/80 leading-relaxed">{q.question}</p>
                      <HoverTooltip content={q.basedOn}>
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted/50 cursor-default hover:text-muted transition-colors">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                          Why this question
                        </span>
                      </HoverTooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
