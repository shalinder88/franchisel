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
      {/* Drawer count badge */}
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10px] text-foreground/50 font-medium">
          {evidence.sections.length} FDD sections extracted
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-surface shadow-xl shadow-black/20 overflow-hidden divide-y divide-white/[0.03]">
        {evidence.sections.map((s, si) => (
          <details key={s.title} className="group">
            <summary className="flex items-center gap-4 cursor-pointer px-5 sm:px-6 py-4 list-none hover:bg-surface-alt transition-all duration-200">
              <span className="text-muted/20 tabular-nums text-[11px] font-bold w-5 text-right shrink-0">
                {String(si + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] font-medium text-foreground/70 flex-1">{s.title}</span>
              <span className="text-[10px] text-muted/25 tabular-nums shrink-0">{s.items.length} items</span>
              <svg
                className="w-4 h-4 text-foreground/50 shrink-0 transition-transform duration-200 group-open:rotate-180"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 sm:px-6 pb-5">
              <div className="divide-y divide-white/[0.03]">
                {s.items.map((it, i) => (
                  <div key={i} className="py-3 grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-2">
                    <div className="text-[10px] text-foreground/50 font-medium">{it.label}</div>
                    <div className="text-[13px] text-foreground/65 leading-relaxed">{it.detail}</div>
                    {it.sourceRef && (
                      <div className="text-[10px] text-muted/25 text-right md:whitespace-nowrap tabular-nums">
                        {it.sourceRef}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Provenance — minimal elegant badge row */}
      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-white/[0.05] bg-surface px-3 py-1 text-[10px] text-foreground/50 font-medium">
          {provenance.franchisorLegalName}
        </span>
        <span className="rounded-full border border-white/[0.05] bg-surface px-3 py-1 text-[10px] text-foreground/50 font-medium">
          FDD {provenance.filingYear}
        </span>
        <span className="rounded-full border border-white/[0.05] bg-surface px-3 py-1 text-[10px] text-foreground/50 font-mono">
          {provenance.fddId}
        </span>
      </div>
    </SectionShell>
  )
}
