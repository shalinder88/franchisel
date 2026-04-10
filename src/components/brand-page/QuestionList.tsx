import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"

const CATEGORY_LABEL: Record<string, string> = {
  economics: "Economics",
  operations: "Operations",
  contract_exit: "Contract & exit",
  support: "Support",
}

export default function QuestionList({
  questions,
}: {
  questions: BrandPageModel["franchiseeQuestions"]
}) {
  const grouped = questions.reduce<Record<string, typeof questions>>((acc, q) => {
    const key = q.category
    acc[key] = acc[key] ?? []
    acc[key].push(q)
    return acc
  }, {})

  return (
    <SectionShell
      id="questions"
      eyebrow="Your next call"
      headline="What to ask operators before you commit"
      takeaway="These questions are not generic. Each one targets a specific risk or gap surfaced in this FDD."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="rounded-lg border border-border bg-surface p-5">
            <div className="text-[11px] uppercase tracking-widest text-muted mb-3">
              {CATEGORY_LABEL[cat] ?? cat}
            </div>
            <ul className="space-y-4">
              {items.map((q, i) => (
                <li key={i}>
                  <p className="text-sm text-foreground leading-relaxed">{q.question}</p>
                  <p className="mt-1.5 text-[11px] text-muted">Based on: {q.basedOn}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
