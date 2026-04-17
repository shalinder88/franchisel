import type { ReactNode } from "react"
import { Icon, type IconName } from "./icons"

/* ── Section shell ─────────────────────────────────────────────── */
export function SectionLux({
  id,
  eyebrow,
  headline,
  kicker,
  children,
}: {
  id: string
  eyebrow: string
  headline: string
  kicker?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-20 pb-6">
      <div className="lux-rule mb-12" />
      <header className="mb-10 max-w-3xl">
        <div className="lux-eyebrow mb-3">{eyebrow}</div>
        <h2 className="lux-section-title lux-serif">{headline}</h2>
        {kicker && (
          <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--lux-ink-soft)]">
            {kicker}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}

/* ── Severity chip ─────────────────────────────────────────────── */
export type LuxSeverity = "high" | "caution" | "neutral"

export function Chip({
  severity = "neutral",
  children,
  icon,
  muted = false,
}: {
  severity?: LuxSeverity
  children: ReactNode
  icon?: IconName
  muted?: boolean
}) {
  const cls = muted
    ? "lux-chip lux-chip-muted"
    : `lux-chip lux-chip-${severity}`
  return (
    <span className={cls}>
      {icon ? <Icon name={icon} width={11} height={11} strokeWidth={1.75} /> : <span className="lux-dot" />}
      {children}
    </span>
  )
}

/* ── Delta indicator (YoY) ─────────────────────────────────────── */
export function Delta({
  direction,
  children,
}: {
  direction: "up" | "down" | "flat"
  children: ReactNode
}) {
  const icon = direction === "up" ? "arrowUp" : direction === "down" ? "arrowDown" : "minus"
  const cls = direction === "up" ? "lux-delta-up" : direction === "down" ? "lux-delta-down" : "lux-delta-flat"
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium tabular-nums ${cls}`}>
      <Icon name={icon} width={11} height={11} strokeWidth={2} />
      {children}
    </span>
  )
}

/* ── Data line (evidence row with source cite) ─────────────────── */
export function DataLine({
  label,
  value,
  source,
}: {
  label: string
  value: ReactNode
  source?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-[color:var(--lux-edge)] last:border-b-0">
      <span className="text-[12px] text-[color:var(--lux-ink-mute)] uppercase tracking-wider">{label}</span>
      <span className="text-[14px] text-[color:var(--lux-ink)] text-right lux-num">
        {value}
        {source && (
          <span className="ml-2 text-[10px] text-[color:var(--lux-ink-faint)] tracking-wider uppercase">{source}</span>
        )}
      </span>
    </div>
  )
}

/* ── Stat figure (big number + label + optional delta) ─────────── */
export function StatFigure({
  label,
  value,
  sublabel,
  delta,
  size = "md",
}: {
  label: string
  value: ReactNode
  sublabel?: ReactNode
  delta?: { direction: "up" | "down" | "flat"; text: string }
  size?: "sm" | "md" | "lg"
}) {
  const sizeCls =
    size === "lg" ? "text-[40px] sm:text-[52px]"
    : size === "sm" ? "text-[24px]"
    : "text-[32px] sm:text-[38px]"
  return (
    <div>
      <div className="lux-eyebrow mb-2">{label}</div>
      <div className={`lux-serif font-medium tracking-tight leading-none lux-num text-[color:var(--lux-ink)] ${sizeCls}`}>
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[color:var(--lux-ink-faint)]">
        {delta && <Delta direction={delta.direction}>{delta.text}</Delta>}
        {sublabel && <span>{sublabel}</span>}
      </div>
    </div>
  )
}
