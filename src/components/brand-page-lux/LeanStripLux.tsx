"use client"
import { useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { Icon, type IconName } from "./icons"

/**
 * LeanStripLux — the "Should I keep reading?" decision barrier.
 *
 * Sits between Hero and the Five Questions. Compresses the positives / cautions
 * from the hero into ultra-short scannable lines, each with a jump-to-evidence
 * anchor. The goal is to make the decision visible in ~10 seconds.
 */

type Side = "lean" | "hesitate"

type Row = {
  // 8–12 word punchline (no period)
  punchline: string
  // Which section the evidence lives in (scroll anchor id)
  jumpTo: string
  // What section label to show next to the arrow
  jumpLabel: string
  // Expanded detail — 1-2 sentences max
  detail: string
  // Small line icon
  icon: IconName
}

// These are hand-tuned short punchlines derived from the hero model.
// Each anchor matches a section id on the page so the CTA does real work.
const LEAN: Row[] = [
  {
    punchline: "78% of franchised units top $3M in annual sales",
    jumpTo: "economics",
    jumpLabel: "See distribution",
    detail:
      "Median franchised AUV is $3.80M across 12,023 units. Sample size and percentile disclosure are unusual for the category.",
    icon: "growth",
  },
  {
    punchline: "$10.6B revenue, $3.46B net income, clean EY audit",
    jumpTo: "financial-strength",
    jumpLabel: "Open financials",
    detail:
      "Ernst & Young unqualified opinion. No going-concern doubt. Balance sheet has $22.2B assets and $10.2B members' equity.",
    icon: "audit",
  },
  {
    punchline: "Large, mature system — +102 net units in 2024",
    jumpTo: "stability",
    jumpLabel: "See movement",
    detail:
      "13,559 U.S. units, 95% franchised. First real net growth year after two flat years. Closures remain low.",
    icon: "building",
  },
]

const HESITATE: Row[] = [
  {
    punchline: "No exclusive territory — protection is impossible",
    jumpTo: "contract",
    jumpLabel: "Read clause",
    detail:
      "The franchise agreement explicitly reserves McDonald's right to locate new restaurants anywhere. You cannot bargain this away.",
    icon: "territory",
  },
  {
    punchline: "Rent stacks on royalty — percentage rent up to 23%",
    jumpTo: "economics",
    jumpLabel: "See fee stack",
    detail:
      "Base rent plus percentage rent (6%–23%) sits on top of 5% royalty, 4% ad fund, and 2.25% OPNAD. Real extraction is usually above 17% of gross sales.",
    icon: "rent",
  },
  {
    punchline: "Item 19 math uses 4% royalty — new operators pay 5%",
    jumpTo: "economics",
    jumpLabel: "See basis gap",
    detail:
      "The pro forma understates ongoing cost by roughly $30K–$40K a year at median revenue. Re-do the unit economics at the true 5% rate.",
    icon: "flag",
  },
]

export default function LeanStripLux({
  hero,
}: {
  hero: BrandPageModel["hero"]
}) {
  const [open, setOpen] = useState<{ side: Side; index: number } | null>(null)

  const isOpen = (side: Side, i: number) =>
    open?.side === side && open.index === i

  function toggle(side: Side, i: number) {
    setOpen(isOpen(side, i) ? null : { side, index: i })
  }

  return (
    <section
      id="lean-strip"
      aria-label="Should I keep reading?"
      className="scroll-mt-24 pt-8 pb-4 lux-fade lux-fade-1"
    >
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-baseline gap-3">
          <span className="lux-eyebrow">Thirty-second read</span>
          <span className="lux-serif text-[color:var(--lux-ink-faint)] text-[13px] italic">
            — keep reading, or don't
          </span>
        </div>
        <span className="text-[10px] tracking-[0.22em] uppercase text-[color:var(--lux-ink-faint)]">
          Tap any line for evidence
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lux-card overflow-hidden">
        {/* Lean in */}
        <div className="lux-rail-neutral p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-[color:var(--lux-edge)]">
          <div className="flex items-center gap-2 mb-5">
            <Icon
              name="check"
              width={14}
              height={14}
              strokeWidth={2.2}
              className="text-[color:var(--lux-good)]"
            />
            <span className="lux-eyebrow text-[color:var(--lux-good)]">
              Reasons to lean in
            </span>
          </div>
          <ul className="space-y-1">
            {LEAN.map((r, i) => (
              <RowItem
                key={i}
                row={r}
                index={i}
                open={isOpen("lean", i)}
                onToggle={() => toggle("lean", i)}
                side="lean"
              />
            ))}
          </ul>
        </div>

        {/* Hesitate */}
        <div className="lux-rail-caution p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-5">
            <Icon
              name="pause"
              width={14}
              height={14}
              strokeWidth={2.2}
              className="text-[color:var(--lux-warn)]"
            />
            <span className="lux-eyebrow text-[color:var(--lux-warn)]">
              Reasons to hesitate
            </span>
          </div>
          <ul className="space-y-1">
            {HESITATE.map((r, i) => (
              <RowItem
                key={i}
                row={r}
                index={i}
                open={isOpen("hesitate", i)}
                onToggle={() => toggle("hesitate", i)}
                side="hesitate"
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function RowItem({
  row,
  index,
  open,
  onToggle,
  side,
}: {
  row: Row
  index: number
  open: boolean
  onToggle: () => void
  side: Side
}) {
  const accent =
    side === "lean" ? "var(--lux-good)" : "var(--lux-warn)"

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`w-full text-left grid grid-cols-[18px_1fr_auto] items-start gap-3 py-3 border-b border-[color:var(--lux-edge)] last:border-b-0 transition-colors duration-220 ${
          open ? "" : "hover:bg-[color:var(--lux-surface-2)]/50"
        }`}
      >
        <span
          className="lux-serif text-[12px] tabular-nums mt-0.5"
          style={{ color: accent, opacity: 0.7 }}
        >
          0{index + 1}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon
              name={row.icon}
              width={13}
              height={13}
              className="text-[color:var(--lux-ink-mute)] shrink-0"
            />
            <span className="text-[14px] sm:text-[15px] leading-snug text-[color:var(--lux-ink)] truncate">
              {row.punchline}
            </span>
          </div>
          {open && (
            <p className="mt-2 text-[12px] text-[color:var(--lux-ink-soft)] leading-relaxed pr-4 lux-fade">
              {row.detail}
            </p>
          )}
        </div>

        <a
          href={`#${row.jumpTo}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--lux-ink-faint)] hover:text-[color:var(--lux-ink-soft)] inline-flex items-center gap-1.5 pt-1 shrink-0 transition-colors"
        >
          <span className="hidden sm:inline">{row.jumpLabel}</span>
          <Icon
            name="arrowRight"
            width={11}
            height={11}
            strokeWidth={2}
          />
        </a>
      </button>
    </li>
  )
}
