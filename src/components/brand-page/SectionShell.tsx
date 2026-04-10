import type { ReactNode } from "react"

type Props = {
  id: string
  eyebrow: string
  headline: string
  children: ReactNode
}

/**
 * Section wrapper — visual-first, editorial feel.
 * Eyebrow + headline. Visual transition between sections.
 */
export default function SectionShell({ id, eyebrow, headline, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 pt-16 pb-8">
      {/* Section divider — subtle gradient line */}
      <div className="mb-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.25em] text-accent/80 font-semibold mb-2.5">
          {eyebrow}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-[1.1]">
          {headline}
        </h2>
      </div>
      {children}
    </section>
  )
}
