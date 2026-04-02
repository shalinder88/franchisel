"use client";

import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlist";

/**
 * Nav link for the Watchlist with a live count badge.
 * Drop-in replacement for the plain "Watchlist" nav item in Header.tsx.
 */
export default function WatchlistNavBadge() {
  const { count } = useWatchlist();

  return (
    <Link
      href="/watchlist"
      className="relative px-3.5 py-1.5 text-[13px] font-medium text-muted hover:text-foreground rounded-md hover:bg-surface transition-colors inline-flex items-center gap-1"
    >
      Watchlist
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
