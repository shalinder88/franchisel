import Link from "next/link"
import type { TocEntry } from "@/lib/brand-pages/mappers"

/**
 * Sticky reading map on wide screens; collapses into an inline chip row on mobile.
 * Server component — no scroll-spy. Pure anchor navigation.
 */
export default function StickyTOC({ entries }: { entries: TocEntry[] }) {
  return (
    <>
      {/* Desktop: sticky rail */}
      <nav
        aria-label="Reading map"
        className="hidden lg:block sticky top-24 self-start pr-6 w-56 shrink-0"
      >
        <div className="text-[11px] uppercase tracking-widest text-muted mb-3">Reading map</div>
        <ol className="space-y-1 text-sm border-l border-border">
          {entries.map((e, i) => (
            <li key={e.id}>
              <Link
                href={`#${e.id}`}
                className="block px-3 py-1.5 text-foreground/70 hover:text-foreground hover:border-l-2 hover:border-accent -ml-px transition-colors"
              >
                <span className="text-muted mr-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {e.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile: horizontal chip row */}
      <nav
        aria-label="Reading map (mobile)"
        className="lg:hidden overflow-x-auto -mx-4 px-4 pb-3 mb-4 border-b border-border"
      >
        <ul className="flex gap-2 whitespace-nowrap text-xs">
          {entries.map((e) => (
            <li key={e.id}>
              <Link
                href={`#${e.id}`}
                className="inline-block rounded-full border border-border px-3 py-1.5 text-foreground/80 hover:border-accent/50"
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
