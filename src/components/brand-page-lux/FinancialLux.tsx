import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux, StatFigure, Delta, Chip } from "./primitives"
import { Icon } from "./icons"

// Extracted from Item 21 evidence section of the model. 3-year series $M.
const REV_SERIES = [
  { year: "2022", value: 9588.4 },
  { year: "2023", value: 10568.4 },
  { year: "2024", value: 10630.8 },
]
const OP_INCOME_SERIES = [
  { year: "2022", value: 4311.7 },
  { year: "2023", value: 4554.1 },
  { year: "2024", value: 4663.6 },
]
const NET_INCOME_SERIES = [
  { year: "2022", value: 3095.7 },
  { year: "2023", value: 3394.4 },
  { year: "2024", value: 3461.6 },
]

function deltaPct(series: { year: string; value: number }[]) {
  const last = series[series.length - 1].value
  const prev = series[series.length - 2].value
  const pct = ((last - prev) / prev) * 100
  return { pct, absolute: last - prev, direction: (pct > 0 ? "up" : pct < 0 ? "down" : "flat") as "up" | "down" | "flat" }
}

export default function FinancialLux({
  financial,
}: {
  financial: BrandPageModel["financialStrength"]
}) {
  const revDelta = deltaPct(REV_SERIES)
  const niDelta = deltaPct(NET_INCOME_SERIES)
  const opDelta = deltaPct(OP_INCOME_SERIES)

  return (
    <SectionLux
      id="financial-strength"
      eyebrow="Franchisor health"
      headline="What does the franchisor's financial strength actually tell you?"
      kicker="Audited statements are a backstop, not a promise. Here is what the numbers — and the intercompany structure — really mean for your downside."
    >
      {/* Audit status strip */}
      <div className="lux-card px-6 py-4 mb-4 flex flex-wrap items-center gap-4">
        <Chip severity="neutral" icon="shield">Clean audit</Chip>
        <span className="text-[13px] text-[color:var(--lux-ink-soft)] flex items-center gap-2">
          <Icon name="audit" width={14} height={14} className="text-[color:var(--lux-ink-mute)]" />
          Ernst &amp; Young LLP (Chicago)
        </span>
        <span className="text-[12px] text-[color:var(--lux-ink-mute)]">Unqualified opinion · dated March 14, 2025</span>
        <span className="text-[12px] text-[color:var(--lux-ink-mute)] flex items-center gap-1.5">
          <Icon name="check" width={12} height={12} className="text-[color:var(--lux-good)]" />
          No going concern doubt raised
        </span>
      </div>

      {/* Tier-1 metrics with YoY deltas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="lux-card p-7">
          <StatFigure
            label="Total revenue · 2024"
            value="$10.63B"
            delta={{ direction: revDelta.direction, text: `+$${revDelta.absolute.toFixed(1)}M · ${revDelta.pct.toFixed(1)}%` }}
            sublabel="vs $10.57B in 2023"
            size="lg"
          />
          <MiniBars series={REV_SERIES} />
        </div>
        <div className="lux-card p-7">
          <StatFigure
            label="Net income · 2024"
            value="$3.46B"
            delta={{ direction: niDelta.direction, text: `+$${niDelta.absolute.toFixed(1)}M · ${niDelta.pct.toFixed(1)}%` }}
            sublabel="entire amount dividended to parent"
            size="lg"
          />
          <MiniBars series={NET_INCOME_SERIES} />
        </div>
        <div className="lux-card p-7">
          <StatFigure
            label="Operating income · 2024"
            value="$4.66B"
            delta={{ direction: opDelta.direction, text: `+$${opDelta.absolute.toFixed(1)}M · ${opDelta.pct.toFixed(1)}%` }}
            sublabel="after $1.07B IP royalty to parent"
            size="lg"
          />
          <MiniBars series={OP_INCOME_SERIES} />
        </div>
      </div>

      {/* Balance + intercompany callout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
        <div className="lux-card p-7">
          <div className="flex items-baseline justify-between mb-4">
            <div className="lux-eyebrow">Balance sheet · 2024</div>
            <div className="text-[10px] tracking-wider uppercase text-[color:var(--lux-ink-faint)]">
              $ millions
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0 text-[13px]">
            <div className="py-2.5 border-b border-[color:var(--lux-edge)] flex justify-between">
              <span className="text-[color:var(--lux-ink-mute)]">Total assets</span>
              <span className="lux-num text-[color:var(--lux-ink)]">$22,195</span>
            </div>
            <div className="py-2.5 border-b border-[color:var(--lux-edge)] flex justify-between">
              <span className="text-[color:var(--lux-ink-mute)]">Members&apos; equity</span>
              <span className="lux-num text-[color:var(--lux-ink)]">$10,222</span>
            </div>
            <div className="py-2.5 border-b border-[color:var(--lux-edge)] flex justify-between">
              <span className="text-[color:var(--lux-ink-mute)]">Net P&amp;E</span>
              <span className="lux-num text-[color:var(--lux-ink)]">$13,081</span>
            </div>
            <div className="py-2.5 border-b border-[color:var(--lux-edge)] flex justify-between">
              <span className="text-[color:var(--lux-ink-mute)]">ROU lease</span>
              <span className="lux-num text-[color:var(--lux-ink)]">$5,840</span>
            </div>
            <div className="py-2.5 border-b border-[color:var(--lux-edge)] flex justify-between">
              <span className="text-[color:var(--lux-ink-mute)]">Future min rent receivable</span>
              <span className="lux-num text-[color:var(--lux-ink)]">$14,161</span>
            </div>
            <div className="py-2.5 border-b border-[color:var(--lux-edge)] flex justify-between">
              <span className="text-[color:var(--lux-ink-mute)]">Due to parent</span>
              <span className="lux-num text-[color:var(--lux-ink)]">$2,400</span>
            </div>
          </div>
          <p className="mt-4 pt-4 border-t border-[color:var(--lux-edge)] text-[12px] text-[color:var(--lux-ink-mute)] leading-relaxed">
            $14.16B future minimum rent receivable is the real asset — McDonald&apos;s owns the real estate and
            you pay a stream of rent on it. That is a strength for the franchisor, a burden for operators.
          </p>
        </div>

        <div className="lux-card lux-rail-caution p-7">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="info" width={15} height={15} className="text-[color:var(--lux-warn)]" />
            <div className="lux-eyebrow">Structural cautions</div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="lux-serif text-[16px] text-[color:var(--lux-ink)] leading-snug mb-1">
                2% IP royalty to parent · <span className="lux-num">$1,069M / yr</span>
              </div>
              <p className="text-[11.5px] text-[color:var(--lux-ink-mute)] leading-relaxed">
                Reduces operating income before consolidation. Does not threaten solvency — model explicitly.
              </p>
            </div>
            <div className="border-t border-[color:var(--lux-edge)] pt-4">
              <div className="lux-serif text-[16px] text-[color:var(--lux-ink)] leading-snug mb-1">
                Subsequent event · <span className="lux-num">$2.4B → equity</span>
              </div>
              <p className="text-[11.5px] text-[color:var(--lux-ink-mute)] leading-relaxed">
                Intercompany payable converted to equity on 2025-02-17. Disclosed in notes.
              </p>
            </div>
            <div className="border-t border-[color:var(--lux-edge)] pt-4">
              <div className="lux-serif text-[16px] text-[color:var(--lux-ink)] leading-snug mb-1">
                Guarantor floor · <span className="lux-num">18%</span>{" "}
                <span className="text-[12px] text-[color:var(--lux-ink-mute)]">vs FA delinquency 15%</span>
              </div>
              <p className="text-[11.5px] text-[color:var(--lux-ink-mute)] leading-relaxed">
                Parent can enforce guaranties once delinquencies cross 18% of receivable. Current rate sits 3 pts below — close enough to watch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Effective rent range — compact full-width strip */}
      <div className="mt-4 lux-card px-7 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon name="rent" width={16} height={16} className="text-[color:var(--lux-gold)]" />
          <div>
            <div className="lux-eyebrow mb-1">Effective rent range · operator lens</div>
            <div className="lux-serif text-[18px] text-[color:var(--lux-ink)] leading-tight">
              0% – 33.33% of gross sales
            </div>
          </div>
        </div>
        <p className="text-[12px] text-[color:var(--lux-ink-mute)] max-w-md leading-relaxed">
          Percentage-rent plus base-rent-equivalent can push effective rent above 30% at weak locations.
          It is the single biggest variable in whether a McDonald&apos;s P&amp;L actually works.
        </p>
      </div>
    </SectionLux>
  )
}

function MiniBars({ series }: { series: { year: string; value: number }[] }) {
  const max = Math.max(...series.map((s) => s.value))
  return (
    <div className="mt-5 pt-4 border-t border-[color:var(--lux-edge)]">
      <div className="flex items-end gap-2 h-16">
        {series.map((s, i) => {
          const h = (s.value / max) * 100
          const isLast = i === series.length - 1
          return (
            <div key={s.year} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-full rounded-t-sm ${isLast ? "bg-[color:var(--lux-accent)]" : "bg-[color:var(--lux-ink-faint)]"}`}
                style={{ height: `${h}%` }}
              />
              <div className="text-[10px] text-[color:var(--lux-ink-faint)] lux-num">{s.year}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
