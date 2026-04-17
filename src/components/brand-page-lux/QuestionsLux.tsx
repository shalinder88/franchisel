"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux } from "./primitives"
import { Icon, type IconName } from "./icons"

const CAT_META: Record<string, { label: string; icon: IconName }> = {
  economics: { label: "Economics", icon: "royalty" },
  operations: { label: "Operations", icon: "operations" },
  contract_exit: { label: "Contract & exit", icon: "scale" },
  support: { label: "Support", icon: "handshake" },
}

export default function QuestionsLux({
  questions,
}: {
  questions: BrandPageModel["franchiseeQuestions"]
}) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <SectionLux
      id="questions"
      eyebrow="Your next call"
      headline="What should you ask existing operators?"
      kicker="Seven questions mapped directly to this FDD. Click a question to see the clause it's based on."
    >
      <CopyQuestionsButton questions={questions} />
      <div className="lux-card overflow-hidden">
        <ol>
          {questions.map((q, i) => {
            const isOpen = open === i
            const meta = CAT_META[q.category] ?? { label: q.category, icon: "info" as IconName }
            return (
              <li
                key={i}
                className={`grid grid-cols-[auto_1fr_auto] items-start gap-4 px-6 sm:px-8 py-5 border-b border-[color:var(--lux-edge)] last:border-b-0 transition-colors ${isOpen ? "bg-[color:var(--lux-surface-2)]/60" : "hover:bg-[color:var(--lux-surface-2)]/40"}`}
              >
                <span className="lux-serif text-[color:var(--lux-ink-faint)] text-[20px] tabular-nums w-7 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] sm:text-[15px] text-[color:var(--lux-ink)] leading-[1.55]">{q.question}</p>
                  {isOpen && (
                    <p className="mt-3 text-[12px] text-[color:var(--lux-ink-mute)] leading-relaxed lux-fade pl-3 border-l border-[color:var(--lux-gold)]/40">
                      <span className="text-[color:var(--lux-gold)] lux-eyebrow mr-2">Based on</span>
                      {q.basedOn}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[color:var(--lux-ink-faint)] hover:text-[color:var(--lux-ink-mute)] transition-colors pt-0.5"
                  aria-expanded={isOpen}
                >
                  <Icon name={meta.icon} width={12} height={12} />
                  {meta.label}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </SectionLux>
  )
}

/** Module-level action: copy the full validation question list as plain text.
 *  Useful for pasting into a call script or email to operators. */
function CopyQuestionsButton({
  questions,
}: {
  questions: BrandPageModel["franchiseeQuestions"]
}) {
  const [copied, setCopied] = useState(false)

  async function copyAll() {
    const body = questions
      .map((q, i) => `${String(i + 1).padStart(2, "0")}. ${q.question}`)
      .join("\n\n")
    const text = `Validation questions for McDonald's operators\n${"=".repeat(46)}\n\n${body}\n\n— Generated from Franchisel diligence\n`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // silent fail — user can still read the list on-page
    }
  }

  return (
    <div className="flex justify-end mb-4 -mt-4">
      <button
        type="button"
        onClick={copyAll}
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] tracking-wider uppercase border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-1)] text-[color:var(--lux-ink-mute)] hover:border-[color:var(--lux-gold)]/40 hover:text-[color:var(--lux-ink-soft)] transition-colors"
      >
        <Icon
          name={copied ? "check" : "stack"}
          width={12}
          height={12}
          strokeWidth={1.75}
          className={
            copied
              ? "text-[color:var(--lux-good)]"
              : "text-[color:var(--lux-ink-faint)]"
          }
        />
        {copied ? "Copied to clipboard" : "Copy all questions"}
      </button>
    </div>
  )
}
