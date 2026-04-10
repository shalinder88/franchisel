import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import { sortRedFlags } from "@/lib/brand-pages/mappers"

export default function RedFlagList({
  flags,
}: {
  flags: BrandPageModel["redFlags"]
}) {
  const sorted = sortRedFlags(flags)
  return (
    <SectionShell
      id="red-flags"
      eyebrow="Watch carefully"
      headline="What could go wrong"
      takeaway="These are the disclosed facts most likely to affect your decision. Ranked by severity, each one links to the evidence behind it."
    >
      <div className="space-y-3">
        {sorted.map((f, i) => {
          const severity =
            f.severity === "high"
              ? { edge: "border-l-danger", tag: "text-danger", label: "High" }
              : { edge: "border-l-warning", tag: "text-warning", label: "Caution" }
          return (
            <div
              key={i}
              className={`rounded-lg border border-border border-l-4 ${severity.edge} bg-surface p-5`}
            >
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <span className={`text-[11px] uppercase tracking-widest ${severity.tag}`}>
                  {severity.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{f.summary}</p>
              <p className="mt-2 text-xs text-foreground/60">
                <span className="text-muted">Why it matters — </span>
                {f.whyItMatters}
              </p>
              {f.linkedSectionId ? (
                <a
                  href={`#${f.linkedSectionId}`}
                  className="mt-3 inline-block text-[11px] text-accent hover:underline"
                >
                  Jump to source section →
                </a>
              ) : null}
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
