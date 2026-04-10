import type { ReactNode } from "react"

type Props = {
  id: string
  eyebrow: string
  headline: string
  children: ReactNode
}

/**
 * Section wrapper — visual-first. Eyebrow + headline only.
 * No takeaway paragraph — the visual speaks first, text supports.
 */
export default function SectionShell({ id, eyebrow, headline, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border/60 pt-14 pb-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">
          {eyebrow}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight leading-tight">
          {headline}
        </h2>
      </div>
      {children}
    </section>
  )
}
