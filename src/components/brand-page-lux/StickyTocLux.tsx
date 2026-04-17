import Link from "next/link"

type Entry = { id: string; label: string }

export default function StickyTocLux({ entries }: { entries: Entry[] }) {
  return (
    <>
      {/* Desktop: sticky rail */}
      <nav
        aria-label="Reading map"
        className="hidden lg:block sticky top-28 self-start pr-8 w-56 shrink-0"
      >
        <div className="lux-eyebrow mb-5">Reading map</div>
        <ol className="space-y-0.5 text-[12px] border-l border-[color:var(--lux-edge)]">
          {entries.map((e, i) => (
            <li key={e.id}>
              <Link
                href={`#${e.id}`}
                className="group block pl-5 pr-2 py-1.5 -ml-px border-l border-transparent text-[color:var(--lux-ink-mute)] hover:text-[color:var(--lux-ink)] hover:border-[color:var(--lux-gold)] transition-all duration-220"
              >
                <span className="lux-num text-[10px] text-[color:var(--lux-ink-faint)] mr-2 group-hover:text-[color:var(--lux-gold)] transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {e.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile: horizontal chip row */}
      <nav
        aria-label="Reading map"
        className="lg:hidden sticky top-[60px] z-20 overflow-x-auto -mx-4 px-4 py-2.5 bg-[color:var(--lux-surface-0)]/90 backdrop-blur-md border-b border-[color:var(--lux-edge)]"
      >
        <ul className="flex gap-1.5 whitespace-nowrap text-[11px]">
          {entries.map((e) => (
            <li key={e.id}>
              <Link
                href={`#${e.id}`}
                className="inline-block rounded-full border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-1)] px-3 py-1.5 text-[color:var(--lux-ink-mute)] hover:text-[color:var(--lux-ink)] hover:border-[color:var(--lux-gold)]/40 transition-all duration-220"
              >
                {e.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
