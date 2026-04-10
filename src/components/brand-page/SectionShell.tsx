import type { ReactNode } from "react"

type Props = {
  id: string
  eyebrow: string
  headline: string
  takeaway: string
  children: ReactNode
}

/**
 * Section wrapper that enforces the teaching hierarchy:
 * eyebrow → headline → takeaway → visual/content.
 * Every flagship brand-page section uses this shell so hierarchy stays uniform.
 */
export default function SectionShell({ id, eyebrow, headline, takeaway, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-12 pb-4">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-muted mb-2">{eyebrow}</div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          {headline}
        </h2>
        <p className="mt-3 text-base text-foreground/80 leading-relaxed">{takeaway}</p>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  )
}
