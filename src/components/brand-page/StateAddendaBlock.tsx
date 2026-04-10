"use client"
import type { BrandPageModel, Severity } from "@/lib/brand-page-model"
import SectionShell from "./SectionShell"
import ExpandableRow from "./ExpandableRow"
import { stateAbbreviation } from "@/lib/brand-pages/mappers"

const TILE_BG: Record<string, string> = {
  high: "bg-danger/15 border-danger/30 text-danger",
  caution: "bg-warning/12 border-warning/30 text-warning",
  neutral: "bg-success/10 border-success/30 text-success",
}

export default function StateAddendaBlock({
  addenda,
}: {
  addenda: NonNullable<BrandPageModel["stateAddenda"]>
}) {
  return (
    <SectionShell
      id="state-addenda"
      eyebrow="State by state"
      headline="State-by-state overrides"
    >
      {/* State tile strip — instant visual read */}
      <div className="flex flex-wrap gap-2 mb-6">
        {addenda.entries.map((e) => {
          const sev = e.severity ?? "neutral"
          return (
            <div
              key={e.state}
              className={`w-12 h-10 rounded-lg border flex items-center justify-center text-xs font-bold
                ${TILE_BG[sev]} transition-transform hover:scale-105`}
            >
              {stateAbbreviation(e.state)}
            </div>
          )
        })}
        {/* No-addendum states as muted tiles */}
        {addenda.statesWithoutAddendum?.map((s) => (
          <div
            key={s}
            className="w-12 h-10 rounded-lg border border-border/40 bg-surface-alt flex items-center justify-center text-[10px] text-muted/60 font-medium"
          >
            {stateAbbreviation(s.replace(/\s*\(.*$/, ""))}
          </div>
        ))}
      </div>

      {/* Expandable detail rows */}
      <div className="rounded-xl border border-border bg-surface divide-y divide-border/60">
        {addenda.entries.map((e) => (
          <ExpandableRow
            key={e.state}
            severity={e.severity}
            title={e.state}
            subtitle={e.affectedFamily}
          >
            <p className="text-sm text-foreground/80 leading-relaxed">{e.overrideSummary}</p>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              <span className="text-foreground/50 font-medium">Why it matters</span> — {e.whyItMatters}
            </p>
            {e.sourcePages && e.sourcePages.length > 0 && (
              <div className="mt-2 text-[10px] text-muted/60 tabular-nums">
                Exhibit T · p. {e.sourcePages.join(", ")}
              </div>
            )}
          </ExpandableRow>
        ))}
      </div>
    </SectionShell>
  )
}
