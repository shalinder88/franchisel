"use client"
import { useState } from "react"

type FeeSegment = {
  label: string
  fullLabel: string
  value: string
  pct: number
  color: string
}

type Props = {
  segments: FeeSegment[]
  totalPct: number
  conditionalItems?: Array<{ label: string; value: string }>
}

export default function FeeStackBar({ segments, totalPct, conditionalItems }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
        <h3 className="text-xs uppercase tracking-wider text-foreground/60 font-semibold">Recurring fee extraction</h3>
        <div className="text-3xl font-black text-foreground tabular-nums tracking-tight">
          ~{totalPct.toFixed(0)}%<span className="text-foreground/40 text-lg ml-1">of gross</span>
        </div>
      </div>

      {/* Big colorful segmented bar */}
      <div className="relative">
        <div className="flex h-16 rounded-xl overflow-hidden border border-border">
          {segments.map((seg, i) => (
            <div
              key={`seg-${i}`}
              className={`${seg.color} h-full relative cursor-default transition-all duration-150 ${hoveredIdx === i ? "brightness-125 z-10" : ""}`}
              style={{ width: `${(seg.pct / totalPct) * 100}%` }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-sm font-bold drop-shadow-md">{seg.pct}%</span>
              </span>
            </div>
          ))}
        </div>

        {/* Tooltip for hovered segment */}
        {hoveredIdx !== null && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-lg shadow-black/30 whitespace-nowrap animate-fade-in">
            <strong>{segments[hoveredIdx].fullLabel}</strong>
            <br />
            {segments[hoveredIdx].value}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((seg, i) => (
          <div key={`leg-${i}`} className="flex items-center gap-2 text-[12px] text-foreground/70">
            <span className={`h-3 w-3 rounded ${seg.color} shrink-0`} />
            <span>{seg.label}</span>
          </div>
        ))}
      </div>

      {/* Conditional triggers */}
      {conditionalItems && conditionalItems.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-2">
          <span className="text-[11px] text-foreground/50 mr-1 self-center">Conditional:</span>
          {conditionalItems.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] text-foreground/60" title={c.value}>
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              {c.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
