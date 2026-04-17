"use client"
import { useEffect, useState } from "react"
import { Icon, type IconName } from "./icons"

export type LuxMode = "quick" | "guided" | "evidence"

const MODES: Array<{
  id: LuxMode
  label: string
  tag: string
  icon: IconName
}> = [
  { id: "quick", label: "Quick verdict", tag: "30 sec", icon: "eye" },
  { id: "guided", label: "Guided diligence", tag: "~ 8 min", icon: "scale" },
  { id: "evidence", label: "Evidence lab", tag: "Proof first", icon: "stack" },
]

/**
 * ModeSwitcherLux — three pills that toggle the page mode.
 *
 * Mode is persisted as a `data-mode` attribute on the `.mcd-lux` root.
 * Sections opt-out via `data-mode-hide="quick"` / `"evidence"` attributes.
 * CSS in globals.css hides the right sections based on the active mode.
 *
 * Defaults to "guided" on first load. Sticky below the hero.
 */
export default function ModeSwitcherLux({
  defaultMode = "guided",
}: {
  defaultMode?: LuxMode
}) {
  const [mode, setMode] = useState<LuxMode>(defaultMode)

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".mcd-lux")
    if (root) root.dataset.mode = mode
  }, [mode])

  return (
    <div
      className="sticky top-[64px] z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-2.5 bg-[color:var(--lux-surface-0)]/85 backdrop-blur-md border-b border-[color:var(--lux-edge)]"
      data-mode-hide=""
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span className="lux-eyebrow text-[color:var(--lux-ink-faint)]">
          Read mode
        </span>
        <div
          role="tablist"
          aria-label="Page mode"
          className="inline-flex items-center gap-1 p-1 rounded-full border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-1)]"
        >
          {MODES.map((m) => {
            const active = mode === m.id
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m.id)}
                className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] transition-colors duration-220 ${
                  active
                    ? "bg-[color:var(--lux-gold)]/15 text-[color:var(--lux-ink)] shadow-[inset_0_0_0_1px_rgba(212,175,122,0.28)]"
                    : "text-[color:var(--lux-ink-mute)] hover:text-[color:var(--lux-ink-soft)]"
                }`}
              >
                <Icon name={m.icon} width={12} height={12} strokeWidth={1.8} />
                <span className="font-medium">{m.label}</span>
                <span
                  className={`lux-num text-[10px] tracking-wider uppercase ${
                    active
                      ? "text-[color:var(--lux-gold)]"
                      : "text-[color:var(--lux-ink-faint)]"
                  }`}
                >
                  {m.tag}
                </span>
              </button>
            )
          })}
        </div>
        <span className="hidden sm:inline text-[11px] text-[color:var(--lux-ink-faint)]">
          {mode === "quick"
            ? "Verdict only. No walkthrough."
            : mode === "evidence"
              ? "Proof panels expanded. Dossier in focus."
              : "Full walkthrough with teaching layer."}
        </span>
      </div>
    </div>
  )
}
