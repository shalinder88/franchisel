"use client"
import { Fragment, useState } from "react"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { Icon, type IconName } from "./icons"

/**
 * CompareTrayLux — persistent compare tray.
 *
 * Floating button bottom-right opens a right-side drawer. Drawer lets the user
 * pick peers and see a compact side-by-side on real decision dimensions.
 * Full compare view lives at /compare — this is the "always available"
 * reconnaissance layer.
 *
 * Peer rows are summary facts (hand-curated from each brand's merged runs);
 * the tray is a UX layer on top of data we already have.
 */

type Dim = {
  key: string
  label: string
  icon: IconName
}

const DIMS: Dim[] = [
  { key: "investment", label: "Initial investment", icon: "stack" },
  { key: "royalty", label: "Royalty", icon: "royalty" },
  { key: "auv", label: "Avg unit revenue", icon: "growth" },
  { key: "growth", label: "Net unit growth", icon: "growth" },
  { key: "contract", label: "Contract burden", icon: "scale" },
  { key: "territory", label: "Exclusive territory", icon: "territory" },
]

type Peer = {
  id: string
  name: string
  values: Record<string, string>
  severity: Record<string, "good" | "watch" | "hard" | "neutral">
}

const MCD: Peer = {
  id: "mcdonalds",
  name: "McDonald's",
  values: {
    investment: "$1.47–2.73M",
    royalty: "5% (4% legacy)",
    auv: "$4.00M",
    growth: "+102 / yr",
    contract: "High",
    territory: "None",
  },
  severity: {
    investment: "watch",
    royalty: "watch",
    auv: "good",
    growth: "good",
    contract: "hard",
    territory: "hard",
  },
}

const PEERS: Peer[] = [
  {
    id: "burger-king",
    name: "Burger King",
    values: {
      investment: "$1.90–4.20M",
      royalty: "4.5%",
      auv: "$1.35M",
      growth: "–40 / yr",
      contract: "Medium",
      territory: "None",
    },
    severity: {
      investment: "watch",
      royalty: "good",
      auv: "hard",
      growth: "hard",
      contract: "watch",
      territory: "hard",
    },
  },
  {
    id: "wendys",
    name: "Wendy's",
    values: {
      investment: "$2.00–3.75M",
      royalty: "4%",
      auv: "$1.98M",
      growth: "+12 / yr",
      contract: "Medium",
      territory: "Limited",
    },
    severity: {
      investment: "watch",
      royalty: "good",
      auv: "watch",
      growth: "good",
      contract: "watch",
      territory: "watch",
    },
  },
  {
    id: "taco-bell",
    name: "Taco Bell",
    values: {
      investment: "$0.57–3.37M",
      royalty: "5.5%",
      auv: "$2.10M",
      growth: "+110 / yr",
      contract: "Medium",
      territory: "None",
    },
    severity: {
      investment: "good",
      royalty: "hard",
      auv: "watch",
      growth: "good",
      contract: "watch",
      territory: "hard",
    },
  },
  {
    id: "subway",
    name: "Subway",
    values: {
      investment: "$0.23–0.68M",
      royalty: "8%",
      auv: "$0.49M",
      growth: "–550 / yr",
      contract: "Medium",
      territory: "None",
    },
    severity: {
      investment: "good",
      royalty: "hard",
      auv: "hard",
      growth: "hard",
      contract: "watch",
      territory: "hard",
    },
  },
]

function sevColor(s: Peer["severity"][string]) {
  return s === "good"
    ? "text-[color:var(--lux-good)]"
    : s === "watch"
      ? "text-[color:var(--lux-warn)]"
      : s === "hard"
        ? "text-[color:var(--lux-danger)]"
        : "text-[color:var(--lux-ink-mute)]"
}

export default function CompareTrayLux() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([
    "burger-king",
    "wendys",
  ])

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  const selectedPeers = PEERS.filter((p) => selected.includes(p.id))
  const cols = [MCD, ...selectedPeers]

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="compare-tray"
        className="fixed bottom-6 right-6 z-40 group inline-flex items-center gap-2.5 rounded-full px-4 py-3 bg-[color:var(--lux-surface-1)] border border-[color:var(--lux-gold)]/30 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_var(--lux-highlight)] hover:border-[color:var(--lux-gold)]/60 transition-colors"
      >
        <Icon
          name="scale"
          width={15}
          height={15}
          className="text-[color:var(--lux-gold)]"
        />
        <span className="text-[12px] font-medium text-[color:var(--lux-ink)] tracking-wide">
          Compare
        </span>
        <span className="lux-num text-[10px] text-[color:var(--lux-ink-faint)] ml-0.5">
          {selected.length} peer{selected.length === 1 ? "" : "s"}
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-220"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <aside
        id="compare-tray"
        aria-label="Compare McDonald's against peers"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[520px] bg-[color:var(--lux-surface-1)] border-l border-[color:var(--lux-edge)] shadow-[-24px_0_48px_rgba(0,0,0,0.35)] transform transition-transform duration-240 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-[color:var(--lux-edge)]">
          <div>
            <div className="lux-eyebrow mb-1.5">Compare tray</div>
            <h3 className="lux-serif text-[22px] text-[color:var(--lux-ink)] leading-tight">
              McDonald's vs selected QSR peers
            </h3>
            <p className="mt-1 text-[12px] text-[color:var(--lux-ink-mute)]">
              Decision dimensions only. Tap a peer to add or remove.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[color:var(--lux-ink-mute)] hover:text-[color:var(--lux-ink)] p-1"
            aria-label="Close compare tray"
          >
            <Icon name="arrowRight" width={18} height={18} />
          </button>
        </header>

        {/* Peer picker */}
        <div className="px-6 pt-4 pb-5 border-b border-[color:var(--lux-edge)]">
          <div className="lux-eyebrow mb-2.5">Peers on file</div>
          <div className="flex flex-wrap gap-1.5">
            {PEERS.map((p) => {
              const on = selected.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                  className={`text-[12px] rounded-full px-3 py-1.5 border transition-colors ${
                    on
                      ? "border-[color:var(--lux-gold)]/45 bg-[color:var(--lux-gold)]/12 text-[color:var(--lux-ink)]"
                      : "border-[color:var(--lux-edge)] text-[color:var(--lux-ink-mute)] hover:border-[color:var(--lux-edge-strong)] hover:text-[color:var(--lux-ink-soft)]"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Matrix */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div
            className="grid gap-x-3 gap-y-1 text-[12px]"
            style={{
              gridTemplateColumns: `180px repeat(${cols.length}, minmax(0, 1fr))`,
            }}
          >
            <div />
            {cols.map((c, i) => (
              <div
                key={c.id}
                className={`lux-eyebrow text-right ${i === 0 ? "text-[color:var(--lux-gold)]" : "text-[color:var(--lux-ink-mute)]"}`}
              >
                {c.name}
              </div>
            ))}

            {DIMS.map((dim) => (
              <Fragment key={dim.key}>
                <div className="flex items-center gap-2 py-2.5 border-t border-[color:var(--lux-edge)] text-[color:var(--lux-ink-soft)]">
                  <Icon
                    name={dim.icon}
                    width={12}
                    height={12}
                    className="text-[color:var(--lux-ink-faint)]"
                  />
                  {dim.label}
                </div>
                {cols.map((c, i) => (
                  <div
                    key={`${c.id}-${dim.key}`}
                    className={`text-right py-2.5 border-t border-[color:var(--lux-edge)] lux-num ${sevColor(c.severity[dim.key])} ${i === 0 ? "font-medium" : ""}`}
                  >
                    {c.values[dim.key]}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <footer className="px-6 py-4 border-t border-[color:var(--lux-edge)] flex items-center justify-between gap-3 bg-[color:var(--lux-surface-0)]">
          <div className="text-[11px] text-[color:var(--lux-ink-faint)] leading-snug">
            Peer values from each brand's merged FDD extraction.
          </div>
          <a
            href={`/compare?brands=mcdonalds${selected.length ? "," + selected.join(",") : ""}`}
            className="inline-flex items-center gap-2 text-[12px] px-3.5 py-2 rounded-full bg-[color:var(--lux-gold)]/15 border border-[color:var(--lux-gold)]/35 text-[color:var(--lux-ink)] hover:bg-[color:var(--lux-gold)]/22 transition-colors"
          >
            Full compare
            <Icon name="arrowRight" width={12} height={12} strokeWidth={2} />
          </a>
        </footer>
      </aside>
    </>
  )
}
