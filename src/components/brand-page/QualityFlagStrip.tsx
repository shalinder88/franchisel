"use client"
import HoverTooltip from "./HoverTooltip"

type Flag = {
  label: string
  status: "good" | "mixed" | "caution"
  note?: string
}

const STATUS_BG: Record<string, string> = {
  good: "bg-success/10 border-success/30",
  mixed: "bg-warning/10 border-warning/30",
  caution: "bg-danger/10 border-danger/30",
}
const STATUS_DOT: Record<string, string> = {
  good: "bg-success",
  mixed: "bg-warning",
  caution: "bg-danger",
}

export default function QualityFlagStrip({ flags }: { flags: Flag[] }) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {flags.map((f) => {
        const cell = (
          <div
            className={`rounded-md border ${STATUS_BG[f.status]} px-2 py-3 text-center
              transition-colors hover:brightness-110 cursor-default`}
          >
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[f.status]} mb-1.5`}
            />
            <div className="text-[11px] font-medium text-foreground leading-tight">{f.label}</div>
          </div>
        )

        return f.note ? (
          <HoverTooltip key={f.label} content={f.note} position="bottom">
            {cell}
          </HoverTooltip>
        ) : (
          <div key={f.label}>{cell}</div>
        )
      })}
    </div>
  )
}
