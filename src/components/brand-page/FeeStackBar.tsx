"use client"
import HoverTooltip from "./HoverTooltip"

type FeeSegment = {
  label: string
  value: string
  pct: number // percentage of gross sales (best guess)
  color: string // tailwind bg class
}

type Props = {
  segments: FeeSegment[]
  conditionalItems?: Array<{ label: string; value: string }>
}

export default function FeeStackBar({ segments, conditionalItems }: Props) {
  const total = segments.reduce((a, s) => a + s.pct, 0)

  return (
    <div>
      {/* Total label */}
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Recurring fee extraction</h3>
        <span className="text-xs text-muted tabular-nums">
          ~{total.toFixed(0)}%+ of Gross Sales
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-10 rounded-lg overflow-hidden border border-border">
        {segments.map((seg, i) => (
          <HoverTooltip
            key={`${seg.label}-${i}`}
            content={
              <span>
                <strong>{seg.label}</strong>
                <br />
                {seg.value}
              </span>
            }
            position="bottom"
          >
            <span
              className={`${seg.color} h-full block transition-all duration-300 hover:brightness-125`}
              style={{ width: `${(seg.pct / total) * 100}%` }}
            />
          </HoverTooltip>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg, i) => (
          <div key={`leg-${i}`} className="flex items-center gap-1.5 text-[11px] text-foreground/70">
            <span aria-hidden className={`h-2 w-2 rounded-sm ${seg.color} shrink-0`} />
            <span>
              {seg.label}{" "}
              <span className="text-muted tabular-nums">{seg.pct}%</span>
            </span>
          </div>
        ))}
      </div>

      {/* Conditional triggers (compact) */}
      {conditionalItems && conditionalItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {conditionalItems.map((c) => (
            <HoverTooltip key={c.label} content={c.value}>
              <span className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-[11px] text-foreground/70 cursor-default">
                <span className="h-1 w-1 rounded-full bg-warning/70" />
                {c.label}
              </span>
            </HoverTooltip>
          ))}
        </div>
      )}
    </div>
  )
}
