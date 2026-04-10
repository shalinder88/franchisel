"use client"
import HoverTooltip from "./HoverTooltip"

type Flag = {
  label: string
  status: "good" | "mixed" | "caution"
  note?: string
}

const STATUS_STYLES: Record<string, { bg: string; dot: string; text: string }> = {
  good: { bg: "bg-emerald-500/15 border-emerald-500/30", dot: "bg-emerald-400", text: "text-emerald-300" },
  mixed: { bg: "bg-amber-500/15 border-amber-500/30", dot: "bg-amber-400", text: "text-amber-300" },
  caution: { bg: "bg-red-500/15 border-red-500/30", dot: "bg-red-400", text: "text-red-300" },
}

export default function QualityFlagStrip({ flags }: { flags: Flag[] }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {flags.map((f) => {
        const s = STATUS_STYLES[f.status] ?? STATUS_STYLES.good
        const cell = (
          <div className={`rounded-xl border ${s.bg} px-3 py-4 text-center cursor-default hover:brightness-110 transition-all`}>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.dot} mb-2`} />
            <div className={`text-[11px] font-semibold leading-tight ${s.text}`}>{f.label}</div>
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
