"use client"
import { useState } from "react"
import { Icon, type IconName } from "./icons"

/**
 * WhatChangedLux — single compact strip for return visits.
 *
 * Not a diff engine. Five hand-curated signals that materially changed from
 * the prior McDonald's filing or from the prior merge. Each has a short
 * summary, a jump-to-evidence anchor, and optional detail on expand.
 *
 * Keep tight: 5 rows max, single-line default, expand-on-click for proof.
 */

type Delta = {
  kind: "fee" | "burden" | "movement" | "evidence" | "caveat"
  label: string
  headline: string
  detail: string
  jumpTo: string
  direction: "up" | "down" | "new"
  icon: IconName
}

// Sourced from: MERGE_NOTES.md, 19_reconciliation_patch_log.json,
// 07_retry_tasks.md vs shadow-previous-mcdonalds-2025.
const DELTAS: Delta[] = [
  {
    kind: "fee",
    label: "Fee logic",
    headline: "Royalty basis split — legacy 4%, post-2024 5%",
    detail:
      "Item 19 pro forma still uses the 4% basis; new operators pay 5%. The ~$38K/yr understatement per unit is now surfaced in the Economics panel.",
    jumpTo: "economics",
    direction: "up",
    icon: "royalty",
  },
  {
    kind: "burden",
    label: "Burden flag",
    headline: "Guarantor enforcement floor added — 18%",
    detail:
      "Promoted from shadow-previous: parent can enforce guaranties once delinquencies exceed 18% of receivable. FA delinquency currently 15%.",
    jumpTo: "contract",
    direction: "new",
    icon: "scale",
  },
  {
    kind: "movement",
    label: "Movement",
    headline: "Net growth +102 after two flat years",
    detail:
      "2022: +2. 2023: +2. 2024: +102. 843 transfers in 2024 is the signal worth investigating — operators are selling.",
    jumpTo: "stability",
    direction: "up",
    icon: "growth",
  },
  {
    kind: "evidence",
    label: "Evidence",
    headline: "46 contract clauses structured (up from 30)",
    detail:
      "Merge promoted 16 additional clause families, including territory carve-outs, transfer conditions, and post-term noncompete (18 mo / 10 mi).",
    jumpTo: "contract",
    direction: "up",
    icon: "stack",
  },
  {
    kind: "caveat",
    label: "Caveat",
    headline: "5 contradictions and 5 unresolveds preserved",
    detail:
      "Merge policy preserves disagreement rather than collapsing it. See the Evidence dossier for each contradiction and its current status.",
    jumpTo: "dossier",
    direction: "new",
    icon: "flag",
  },
]

export default function WhatChangedLux() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      aria-label="What changed since prior filing"
      className="mt-4 mb-2 lux-fade"
      data-mode-hide="quick"
    >
      <div className="lux-card overflow-hidden">
        <header className="flex items-baseline justify-between gap-3 px-5 py-3 border-b border-[color:var(--lux-edge)]">
          <div className="flex items-baseline gap-3">
            <span className="lux-eyebrow text-[color:var(--lux-gold)]">
              What changed
            </span>
            <span className="text-[11px] text-[color:var(--lux-ink-mute)]">
              Signals worth re-reading since the prior filing
            </span>
          </div>
          <span className="lux-num text-[10px] tracking-wider uppercase text-[color:var(--lux-ink-faint)]">
            {DELTAS.length} signals
          </span>
        </header>
        <ul>
          {DELTAS.map((d, i) => {
            const isOpen = open === i
            const tint =
              d.direction === "up"
                ? "text-[color:var(--lux-good)]"
                : d.direction === "down"
                  ? "text-[color:var(--lux-danger)]"
                  : "text-[color:var(--lux-gold)]"
            const arrow =
              d.direction === "up"
                ? "arrowUp"
                : d.direction === "down"
                  ? "arrowDown"
                  : "arrowRight"
            return (
              <li
                key={i}
                className="border-b border-[color:var(--lux-edge)] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 px-5 py-3 hover:bg-[color:var(--lux-surface-2)]/40 transition-colors"
                >
                  <Icon
                    name={arrow as IconName}
                    width={12}
                    height={12}
                    strokeWidth={2}
                    className={`${tint} shrink-0`}
                  />
                  <span
                    className={`lux-eyebrow ${tint} shrink-0 w-[92px]`}
                  >
                    {d.label}
                  </span>
                  <span className="text-[13px] text-[color:var(--lux-ink)] leading-snug truncate">
                    {d.headline}
                  </span>
                  <Icon
                    name={d.icon}
                    width={12}
                    height={12}
                    className="text-[color:var(--lux-ink-faint)] shrink-0"
                  />
                  <a
                    href={`#${d.jumpTo}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--lux-ink-faint)] hover:text-[color:var(--lux-ink-soft)] transition-colors shrink-0"
                  >
                    See →
                  </a>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 lux-fade">
                    <p className="text-[12px] text-[color:var(--lux-ink-soft)] leading-relaxed max-w-3xl pl-[104px]">
                      {d.detail}
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
