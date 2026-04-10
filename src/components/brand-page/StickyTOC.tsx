import Link from "next/link"
import type { TocEntry } from "@/lib/brand-pages/mappers"

export default function StickyTOC({ entries }: { entries: TocEntry[] }) {
  return (
    <>
      {/* Desktop: sticky rail */}
      <nav
        aria-label="Reading map"
        className="hidden lg:block sticky top-28 self-start pr-8 w-52 shrink-0"
      >
        <div className="text-[9px] uppercase tracking-[0.3em] text-muted/40 font-medium mb-4">
          Reading map
        </div>
        <ol className="space-y-0.5 text-[13px] border-l border-white/[0.04]">
          {entries.map((e, i) => (
            <li key={e.id}>
              <Link
                href={`#${e.id}`}
                className="group block px-4 py-1.5 text-foreground/35 hover:text-foreground/80
                  -ml-px border-l border-transparent hover:border-accent/50
                  transition-all duration-200"
              >
                <span className="text-muted/30 mr-2 tabular-nums text-[11px] group-hover:text-accent/50 transition-colors">
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
        className="lg:hidden sticky top-[60px] z-20 overflow-x-auto -mx-4 px-4 py-2.5 bg-background/90 backdrop-blur-md border-b border-white/[0.04]"
      >
        <ul className="flex gap-1.5 whitespace-nowrap text-[11px]">
          {entries.map((e) => (
            <li key={e.id}>
              <Link
                href={`#${e.id}`}
                className="inline-block rounded-full border border-white/[0.06] px-3 py-1.5 text-foreground/40
                  hover:border-accent/25 hover:text-foreground/70 transition-all duration-200"
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
