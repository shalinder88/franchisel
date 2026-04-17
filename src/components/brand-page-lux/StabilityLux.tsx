import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, StatFigure, Delta } from "./primitives"
import { Icon } from "./icons"
import { ownershipShares } from "@/lib/brand-pages/mappers"

export default function StabilityLux({
  stability,
}: {
  stability: BrandPageModel["systemStability"]
}) {
  const mix = ownershipShares(stability.ownershipMix)
  const movement = stability.annualMovement
  const latest = movement[movement.length - 1]
  const prev = movement.length > 1 ? movement[movement.length - 2] : null
  const latestNet = (latest?.openings ?? 0) - (latest?.closures ?? 0)
  const prevNet = prev ? (prev.openings ?? 0) - (prev.closures ?? 0) : null

  // Sparkline data for net growth
  const years = movement.map((y) => y.year)
  const netSeries = movement.map((y) => (y.openings ?? 0) - (y.closures ?? 0))
  const transferSeries = movement.map((y) => y.transfers ?? 0)

  return (
    <SectionLux
      id="stability"
      eyebrow="The system"
      headline="Is it growing?"
      kicker="Three-year movement across 13,559 U.S. restaurants. The signal worth watching is transfer volume — how often operators sell."
    >
      {/* Headline row: two stats + ownership split */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-4 mb-4">
        <div className="lux-card p-6">
          <StatFigure
            label={`Net growth ${latest?.year ?? ""}`}
            value={<span className="text-[color:var(--lux-good)]">+{latestNet}</span>}
            delta={prevNet !== null ? {
              direction: latestNet > prevNet ? "up" : latestNet < prevNet ? "down" : "flat",
              text: `${latestNet - (prevNet ?? 0) >= 0 ? "+" : ""}${latestNet - (prevNet ?? 0)} vs ${prev?.year}`,
            } : undefined}
            sublabel={`openings − closures · strongest in 3 years`}
            size="lg"
          />
        </div>

        <div className="lux-card p-6">
          <StatFigure
            label={`Ownership transfers ${latest?.year ?? ""}`}
            value={(latest?.transfers ?? 0).toLocaleString()}
            sublabel="~1 in 15 franchised units sold"
            size="lg"
          />
          <div className="mt-4 flex items-baseline gap-4 text-[11px] text-[color:var(--lux-ink-faint)] lux-num">
            <span>{movement[0]?.year}: {(movement[0]?.transfers ?? 0).toLocaleString()}</span>
            <span>→</span>
            <span>{prev?.year}: {(prev?.transfers ?? 0).toLocaleString()}</span>
            <span>→</span>
            <span className="text-[color:var(--lux-ink-mute)]">{latest?.year}: {(latest?.transfers ?? 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="lux-card p-6">
          <div className="lux-eyebrow mb-3">Ownership mix</div>
          <div className="flex items-baseline gap-4 mb-4">
            <div className="lux-serif text-[36px] text-[color:var(--lux-ink)] lux-num leading-none">
              {Math.round(mix[0].pct * 100)}%
            </div>
            <div className="text-[11px] text-[color:var(--lux-ink-mute)]">franchised of 13,559 U.S. units</div>
          </div>
          <div className="flex h-4 rounded-lg overflow-hidden border border-[color:var(--lux-edge)]">
            <div className="bg-[color:var(--lux-accent)]/70" style={{ width: `${mix[0].pct * 100}%` }} />
            <div className="bg-[color:var(--lux-ink-faint)]" style={{ width: `${mix[1].pct * 100}%` }} />
          </div>
          <div className="mt-3 flex gap-4 text-[11px] text-[color:var(--lux-ink-mute)]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[color:var(--lux-accent)]/70" />Franchised · {mix[0].value.toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[color:var(--lux-ink-faint)]" />McOpCo · {mix[1].value.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Two trend charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Openings vs closures */}
        <div className="lux-card p-7">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="lux-eyebrow mb-2">Openings vs closures</div>
              <div className="flex gap-4 text-[11px] text-[color:var(--lux-ink-mute)]">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 bg-[color:var(--lux-good)] rounded-sm" />Opened</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 bg-[color:var(--lux-danger)]/70 rounded-sm" />Closed</span>
              </div>
            </div>
          </div>
          <PairedBarChart movement={movement} />
        </div>

        {/* Transfer trend */}
        <div className="lux-card p-7">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="lux-eyebrow mb-2">Transfer volume · 3-year</div>
              <div className="text-[11px] text-[color:var(--lux-ink-mute)]">Ownership changes per year</div>
            </div>
            <Delta direction={transferSeries[2] > transferSeries[1] ? "up" : "down"}>
              {transferSeries[2] - transferSeries[1] >= 0 ? "+" : ""}{transferSeries[2] - transferSeries[1]}
            </Delta>
          </div>
          <TrendLineChart years={years} values={transferSeries} color="var(--lux-gold)" />
        </div>
      </div>

      {/* Takeaway */}
      <p className="mt-6 text-[13px] text-[color:var(--lux-ink-mute)] leading-relaxed max-w-3xl">
        {stability.takeaways[1]}
      </p>
    </SectionLux>
  )
}

function PairedBarChart({ movement }: { movement: BrandPageModel["systemStability"]["annualMovement"] }) {
  const max = Math.max(1, ...movement.map((y) => Math.max(y.openings ?? 0, y.closures ?? 0)))
  return (
    <div className="space-y-5">
      {movement.map((y) => {
        const open = y.openings ?? 0
        const closed = y.closures ?? 0
        const net = open - closed
        return (
          <div key={y.year}>
            <div className="flex items-baseline justify-between text-[12px] mb-2">
              <span className="text-[color:var(--lux-ink)] font-medium lux-num">{y.year}</span>
              <span className="lux-num text-[color:var(--lux-ink-mute)]">
                net {net >= 0 ? "+" : ""}{net}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="lux-num text-[11px] text-[color:var(--lux-ink-soft)] w-10 text-right">+{open}</span>
                <div className="flex-1 h-3 bg-[color:var(--lux-surface-0)] rounded-md overflow-hidden border border-[color:var(--lux-edge)]">
                  <div
                    className="h-full bg-[color:var(--lux-good)]/80"
                    style={{ width: `${(open / max) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="lux-num text-[11px] text-[color:var(--lux-ink-soft)] w-10 text-right">−{closed}</span>
                <div className="flex-1 h-3 bg-[color:var(--lux-surface-0)] rounded-md overflow-hidden border border-[color:var(--lux-edge)]">
                  <div
                    className="h-full bg-[color:var(--lux-danger)]/60"
                    style={{ width: `${(closed / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TrendLineChart({
  years,
  values,
  color,
}: {
  years: string[]
  values: number[]
  color: string
}) {
  const W = 320
  const H = 140
  const PAD_X = 26
  const PAD_Y = 20
  const maxV = Math.max(...values) * 1.1
  const minV = 0
  const xStep = (W - PAD_X * 2) / (values.length - 1)
  const points = values.map((v, i) => {
    const x = PAD_X + i * xStep
    const y = H - PAD_Y - ((v - minV) / (maxV - minV)) * (H - PAD_Y * 2)
    return { x, y, v }
  })
  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ")
  const areaD = `${pathD} L${points[points.length - 1].x},${H - PAD_Y} L${points[0].x},${H - PAD_Y} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-[140px]">
        <defs>
          <linearGradient id="lux-trend-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PAD_X} y1={H - PAD_Y} x2={W - PAD_X} y2={H - PAD_Y} className="lux-trend-axis" />
        <path d={areaD} fill="url(#lux-trend-grad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={color} stroke="var(--lux-surface-1)" strokeWidth={2} />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="var(--lux-ink)"
              className="lux-num"
              fontFamily="system-ui"
            >
              {p.v.toLocaleString()}
            </text>
            <text
              x={p.x}
              y={H - PAD_Y + 14}
              textAnchor="middle"
              fontSize="10"
              fill="var(--lux-ink-mute)"
              className="lux-num"
              fontFamily="system-ui"
            >
              {years[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
