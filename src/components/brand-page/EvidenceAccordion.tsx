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
    <SectionShell
      id="evidence"
      eyebrow="Show your work"
      headline="Source evidence and extracted details"
      takeaway="Every conclusion on this page traces back to specific sections and pages in the FDD. Open any drawer to see the exact facts."
    >
      <div className="rounded-lg border border-border bg-surface divide-y divide-border">
        {evidence.sections.map((s) => (
          <details key={s.title} className="group">
            <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 list-none">
              <span className="text-sm font-semibold text-foreground">{s.title}</span>
              <span
                aria-hidden
                className="text-muted text-xs transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="px-5 pb-5">
              <ul className="divide-y divide-border/60">
                {s.items.map((it, i) => (
                  <li key={i} className="py-3 grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-3">
                    <div className="text-xs text-muted">{it.label}</div>
                    <div className="text-sm text-foreground/85 leading-relaxed">{it.detail}</div>
                    {it.sourceRef ? (
                      <div className="text-[11px] text-muted text-right md:whitespace-nowrap">
                        {it.sourceRef}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface-alt p-5 text-xs text-muted">
        <div className="uppercase tracking-widest mb-2">Provenance</div>
        <div className="text-foreground/80">
          {provenance.franchisorLegalName} · FDD {provenance.filingYear} · File {provenance.fddId}
        </div>
        <ul className="mt-2 space-y-0.5 font-mono text-[11px]">
          {provenance.runArtifacts.map((a) => (
            <li key={a}>{a}</li>
          ))}
          {provenance.sourceMap ? <li>{provenance.sourceMap}</li> : null}
        </ul>
      </div>
    </SectionShell>
  )
}
