import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, Chip, type LuxSeverity } from "./primitives"
import { Icon } from "./icons"
import { stateAbbreviation } from "@/lib/brand-pages/mappers"

// Compact tile-map approximating US geography. Each row is exactly 12 columns
// so the grid lines up as a clean institutional surface (no ragged edges).
// Row order is roughly north → south, left → right = west → east.
// Empty slots use null so spacing stays deterministic.
const COLS = 12
type Cell = string | null
const GRID: Cell[][] = [
  [null, null, null, null, null, null, null, null, null, null, null, "ME"],
  ["AK", "WA", null, "MT", "ND", "MN", null, "WI", null, "MI", "VT", "NH"],
  [null, "OR", "ID", "WY", "SD", "IA", "IL", "IN", "OH", "PA", "NY", "MA"],
  [null, "NV", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "NJ", "CT", "RI"],
  [null, "CA", "AZ", "NM", "KS", "AR", "TN", "NC", "SC", "DC", "MD", "DE"],
  ["HI", null, null, null, "OK", "LA", "MS", "AL", "GA", null, null, null],
  [null, null, null, null, "TX", null, null, null, "FL", null, null, null],
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
      headline="Which states change the deal?"
      kicker="Six states materially modify the default FA. North Dakota, Minnesota, and Washington deliver the most economically valuable operator protections."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 mb-6">
        {/* Map grid */}
        <div className="lux-card p-7">
          <div className="flex items-baseline justify-between mb-4">
            <div className="lux-eyebrow">Addenda coverage map</div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--lux-ink-faint)]">
              {addenda.entries.length} states modified
            </div>
          </div>
          <div
            className="grid gap-[5px]"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {GRID.flatMap((row, ri) =>
              row.map((st, ci) => {
                if (st === null) {
                  return <div key={`${ri}-${ci}`} className="aspect-square" />
                }
                const entry = entriesByAbbr.get(st)
                const sev = (entry?.severity ?? null) as LuxSeverity | null
                const hasAddendum = !!entry
                const color =
                  sev === "high"
                    ? "bg-[color:var(--lux-danger)]/15 border-[color:var(--lux-danger)]/35 text-[color:var(--lux-danger)]"
                    : sev === "caution"
                    ? "bg-[color:var(--lux-warn)]/12 border-[color:var(--lux-warn)]/30 text-[color:var(--lux-warn)]"
                    : sev === "neutral"
                    ? "bg-[color:var(--lux-good)]/10 border-[color:var(--lux-good)]/30 text-[color:var(--lux-good)]"
                    : "bg-[color:var(--lux-surface-0)] border-[color:var(--lux-edge)] text-[color:var(--lux-ink-faint)]"
                return (
                  <a
                    key={`${ri}-${ci}`}
                    href={hasAddendum ? `#state-${st}` : undefined}
                    title={
                      entry ? `${entry.state} · ${entry.affectedFamily}` : st
                    }
                    className={`aspect-square rounded-md border flex items-center justify-center text-[10px] font-bold tracking-wider transition-transform duration-220 ${color} ${
                      hasAddendum
                        ? "shadow-[inset_0_1px_0_var(--lux-highlight)] hover:scale-[1.08] cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    {st}
                  </a>
                )
              }),
            )}
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
              id={`state-${stateAbbreviation(e.state)}`}
              className={`scroll-mt-28 lux-card p-6 ${sev === "high" ? "lux-rail-high" : sev === "caution" ? "lux-rail-caution" : "lux-rail-neutral"}`}
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
