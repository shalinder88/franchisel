import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, Chip, type LuxSeverity } from "./primitives"
import { Icon } from "./icons"
import { stateAbbreviation } from "@/lib/brand-pages/mappers"

// Compact grid layout approximating US geography (simplified).
// Each row left-to-right roughly west → east. Used because an accurate US map
// SVG is out of scope; this gives clear visual density without pretending to
// be a geographic map. Empty cells use "·".
const GRID: string[][] = [
  ["·", "·", "·", "·", "·", "·", "·", "·", "·", "·", "ME"],
  ["·", "WA", "·", "·", "MT", "ND", "MN", "WI", "MI", "·", "VT", "NH"],
  ["·", "OR", "ID", "WY", "SD", "IA", "IL", "IN", "OH", "PA", "NY", "MA"],
  ["·", "·", "NV", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "NJ", "CT", "RI"],
  ["·", "·", "CA", "AZ", "NM", "KS", "AR", "TN", "NC", "SC", "MD", "DE"],
  ["·", "·", "·", "·", "·", "OK", "LA", "MS", "AL", "GA", "·"],
  ["HI", "·", "·", "·", "·", "·", "TX", "·", "·", "·", "FL"],
  ["·", "·", "·", "·", "·", "AK", "·", "·", "·", "·", "·"],
]

export default function StateLux({
  addenda,
}: {
  addenda: NonNullable<BrandPageModel["stateAddenda"]>
}) {
  const entriesByAbbr = new Map<string, typeof addenda.entries[number]>()
  for (const e of addenda.entries) entriesByAbbr.set(stateAbbreviation(e.state), e)

  return (
    <SectionLux
      id="state-addenda"
      eyebrow="State by state"
      headline="Where the default contract changes"
      kicker="Six states materially modify the default FA. North Dakota, Minnesota, and Washington deliver the most economically valuable operator protections."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 mb-6">
        {/* Map grid */}
        <div className="lux-card p-7">
          <div className="lux-eyebrow mb-4">Addenda coverage map</div>
          <div className="space-y-1">
            {GRID.map((row, ri) => (
              <div key={ri} className="flex gap-1 justify-start">
                {row.map((st, ci) => {
                  if (st === "·") return <div key={ci} className="w-8 h-8" />
                  const entry = entriesByAbbr.get(st)
                  const sev = (entry?.severity ?? null) as LuxSeverity | null
                  const hasAddendum = !!entry
                  const color =
                    sev === "high" ? "bg-[color:var(--lux-danger)]/15 border-[color:var(--lux-danger)]/35 text-[color:var(--lux-danger)]"
                    : sev === "caution" ? "bg-[color:var(--lux-warn)]/12 border-[color:var(--lux-warn)]/30 text-[color:var(--lux-warn)]"
                    : sev === "neutral" ? "bg-[color:var(--lux-good)]/10 border-[color:var(--lux-good)]/30 text-[color:var(--lux-good)]"
                    : "bg-[color:var(--lux-surface-0)] border-[color:var(--lux-edge)] text-[color:var(--lux-ink-faint)]"
                  return (
                    <div
                      key={ci}
                      title={entry ? `${entry.state} · ${entry.affectedFamily}` : st}
                      className={`w-8 h-8 rounded-md border flex items-center justify-center text-[10px] font-bold tracking-wider ${color} ${hasAddendum ? "shadow-[inset_0_1px_0_var(--lux-highlight)]" : ""}`}
                    >
                      {st}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-[color:var(--lux-edge)] flex flex-wrap gap-2">
            <Chip severity="neutral">Operator-favorable</Chip>
            <Chip severity="caution">Mixed</Chip>
            <Chip severity="high">Operator-adverse</Chip>
            <span className="text-[10px] text-[color:var(--lux-ink-faint)] self-center ml-auto">
              +{addenda.statesWithoutAddendum?.length ?? 0} states with no override
            </span>
          </div>
        </div>

        {/* Overall verdict card */}
        <div className="lux-card p-7">
          <div className="lux-eyebrow mb-3">Overall verdict</div>
          <p className="lux-serif italic text-[17px] leading-[1.5] text-[color:var(--lux-ink-soft)] border-l-2 border-[color:var(--lux-gold)] pl-5">
            {addenda.overallVerdict}
          </p>
          <div className="mt-6 pt-6 border-t border-[color:var(--lux-edge)] text-[12px] text-[color:var(--lux-ink-mute)] leading-relaxed">
            {addenda.takeaways[0]}
          </div>
        </div>
      </div>

      {/* Always-expanded state cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {addenda.entries.map((e) => {
          const sev = (e.severity ?? "neutral") as LuxSeverity
          return (
            <div
              key={e.state}
              className={`lux-card p-6 ${sev === "high" ? "lux-rail-high" : sev === "caution" ? "lux-rail-caution" : "lux-rail-neutral"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="lux-serif text-[22px] text-[color:var(--lux-ink)] font-medium leading-none">{e.state}</div>
                  <div className="mt-1.5 lux-eyebrow">{e.affectedFamily}</div>
                </div>
                <Chip severity={sev}>
                  {sev === "high" ? "Adverse" : sev === "caution" ? "Mixed" : "Favorable"}
                </Chip>
              </div>
              <p className="text-[13px] text-[color:var(--lux-ink-soft)] leading-relaxed">{e.overrideSummary}</p>
              <p className="mt-3 pt-3 border-t border-[color:var(--lux-edge)] text-[12px] text-[color:var(--lux-ink-mute)] leading-relaxed">
                <span className="text-[color:var(--lux-ink-soft)] font-medium">Why it matters — </span>
                {e.whyItMatters}
              </p>
              {e.sourcePages && e.sourcePages.length > 0 && (
                <div className="mt-3 text-[10px] text-[color:var(--lux-ink-faint)] lux-num tracking-wider uppercase">
                  Exhibit T · p. {e.sourcePages.join(", ")}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionLux>
  )
}
