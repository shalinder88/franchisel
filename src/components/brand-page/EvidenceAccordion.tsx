import type { BrandPageModel } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"

export default function EvidenceAccordion({
  evidence,
  provenance,
}: {
  evidence: BrandPageModel["evidence"]
  provenance: BrandPageModel["provenance"]
}) {
  return (
    <SectionShell id="evidence" eyebrow="Show your work" headline="Source evidence">
      <div className="rounded-xl border border-border bg-surface divide-y divide-border/60">
        {evidence.sections.map((s) => (
          <details key={s.title} className="group">
            <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 list-none hover:bg-surface-alt/50 transition-colors">
              <span className="text-sm font-medium text-foreground">{s.title}</span>
              <svg
                className="w-4 h-4 text-muted shrink-0 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5">
              <ul className="divide-y divide-border/40">
                {s.items.map((it, i) => (
                  <li key={i} className="py-3 grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-2">
                    <div className="text-[11px] text-muted font-medium">{it.label}</div>
                    <div className="text-sm text-foreground/80 leading-relaxed">{it.detail}</div>
                    {it.sourceRef && (
                      <div className="text-[10px] text-muted/60 text-right md:whitespace-nowrap tabular-nums">
                        {it.sourceRef}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      {/* Provenance — clean, no internal run paths */}
      <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] text-muted/60">
        <span className="rounded border border-border px-2 py-0.5">
          {provenance.franchisorLegalName}
        </span>
        <span className="rounded border border-border px-2 py-0.5">
          FDD {provenance.filingYear}
        </span>
        <span className="rounded border border-border px-2 py-0.5">
          File {provenance.fddId}
        </span>
      </div>
    </SectionShell>
  )
}
