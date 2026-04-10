import type { ReactNode } from "react"

type Props = {
  id: string
  eyebrow: string
  headline: string
  children: ReactNode
}

export default function SectionShell({ id, eyebrow, headline, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 pt-16 pb-8">
      {/* Section divider */}
      <div className="mb-10 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
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
