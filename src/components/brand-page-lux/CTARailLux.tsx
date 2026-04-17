"use client"
import { Icon } from "./icons"

/**
 * CTARailLux — slim conversion strip directly below the hero.
 *
 * Three calm, editorial CTAs, no loud colors. Each one does real work:
 *   1. Open the full dossier (scrolls to #dossier)
 *   2. Compare vs peers (goes to the compare page pre-filtered)
 *   3. Book a validation call (primary commercial CTA)
 *
 * Visual language matches the lux card family. No pulsing, no gradients.
 */
export default function CTARailLux({
  hasDossier,
}: {
  hasDossier: boolean
}) {
  return (
    <section
      aria-label="Primary actions"
      className="mt-4 mb-2 lux-fade lux-fade-1"
    >
      <div className="lux-card p-1.5 sm:p-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
        {hasDossier ? (
          <a
            href="#dossier"
            className="group flex items-center justify-between gap-3 rounded-[14px] px-5 py-4 bg-[color:var(--lux-surface-0)] border border-[color:var(--lux-edge)] hover:border-[color:var(--lux-gold)]/40 transition-colors duration-220"
          >
            <span className="flex flex-col">
              <span className="lux-eyebrow text-[color:var(--lux-gold)]">Evidence</span>
              <span className="lux-serif text-[16px] text-[color:var(--lux-ink)] mt-1 leading-tight">
                Open the full dossier
              </span>
              <span className="text-[11px] text-[color:var(--lux-ink-faint)] mt-1">
                Clause-level extraction · page cites
              </span>
            </span>
            <Icon
              name="arrowRight"
              width={16}
              height={16}
              className="text-[color:var(--lux-ink-mute)] group-hover:text-[color:var(--lux-gold)] transition-colors"
            />
          </a>
        ) : (
          <a
            href="#economics"
            className="group flex items-center justify-between gap-3 rounded-[14px] px-5 py-4 bg-[color:var(--lux-surface-0)] border border-[color:var(--lux-edge)] hover:border-[color:var(--lux-accent)]/35 transition-colors duration-220"
          >
            <span className="flex flex-col">
              <span className="lux-eyebrow text-[color:var(--lux-accent)]">Start</span>
              <span className="lux-serif text-[16px] text-[color:var(--lux-ink)] mt-1 leading-tight">
                Jump to unit economics
              </span>
              <span className="text-[11px] text-[color:var(--lux-ink-faint)] mt-1">
                Fee stack · Item 19 distribution
              </span>
            </span>
            <Icon
              name="arrowRight"
              width={16}
              height={16}
              className="text-[color:var(--lux-ink-mute)] group-hover:text-[color:var(--lux-accent)] transition-colors"
            />
          </a>
        )}

        <a
          href="/compare?brands=mcdonalds,burger-king,wendys"
          className="group flex items-center justify-between gap-3 rounded-[14px] px-5 py-4 bg-[color:var(--lux-surface-0)] border border-[color:var(--lux-edge)] hover:border-[color:var(--lux-accent)]/35 transition-colors duration-220"
        >
          <span className="flex flex-col">
            <span className="lux-eyebrow text-[color:var(--lux-accent)]">Compare</span>
            <span className="lux-serif text-[16px] text-[color:var(--lux-ink)] mt-1 leading-tight">
              Side-by-side vs QSR peers
            </span>
            <span className="text-[11px] text-[color:var(--lux-ink-faint)] mt-1">
              Burger King · Wendy's · fee stack view
            </span>
          </span>
          <Icon
            name="scale"
            width={16}
            height={16}
            className="text-[color:var(--lux-ink-mute)] group-hover:text-[color:var(--lux-accent)] transition-colors"
          />
        </a>

        <a
          href="#questions"
          className="group flex items-center justify-between gap-3 rounded-[14px] px-5 py-4 bg-[color:var(--lux-gold)]/10 border border-[color:var(--lux-gold)]/30 hover:bg-[color:var(--lux-gold)]/15 hover:border-[color:var(--lux-gold)]/50 transition-colors duration-220"
        >
          <span className="flex flex-col">
            <span className="lux-eyebrow text-[color:var(--lux-gold)]">
              Validation brief
            </span>
            <span className="lux-serif text-[16px] text-[color:var(--lux-ink)] mt-1 leading-tight">
              Questions to ask operators
            </span>
            <span className="text-[11px] text-[color:var(--lux-ink-soft)] mt-1">
              Tied to evidence · ready to send
            </span>
          </span>
          <Icon
            name="cursor"
            width={16}
            height={16}
            className="text-[color:var(--lux-gold)]"
          />
        </a>
      </div>
    </section>
  )
}
