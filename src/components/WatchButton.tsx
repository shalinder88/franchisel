"use client";

import { useWatchlist } from "@/hooks/useWatchlist";

interface WatchButtonProps {
  slug: string;
  name: string;
  snapshotScore?: number;
  snapshotRevenue?: number;
  /** "icon" = star only, "pill" = star + label (default) */
  variant?: "icon" | "pill";
  className?: string;
}

export default function WatchButton({
  slug,
  name,
  snapshotScore,
  snapshotRevenue,
  variant = "pill",
  className = "",
}: WatchButtonProps) {
  const { isWatching, toggleWatchlist } = useWatchlist();
  const watching = isWatching(slug);

  function handleClick(e: React.MouseEvent) {
    // Prevent parent <Link> navigation on brand cards
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ slug, name, snapshotScore, snapshotRevenue });
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label={watching ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`}
        title={watching ? "Remove from watchlist" : "Add to watchlist"}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${
          watching
            ? "text-accent bg-accent/10 hover:bg-accent/20"
            : "text-muted bg-surface hover:text-accent hover:bg-accent/10"
        } ${className}`}
      >
        {watching ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        )}
      </button>
    );
  }

  // Pill variant
  return (
    <button
      onClick={handleClick}
      aria-label={watching ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        watching
          ? "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20"
          : "bg-surface text-muted border-border hover:border-accent hover:text-accent"
      } ${className}`}
    >
      {watching ? (
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )}
      {watching ? "Watching" : "Watch"}
    </button>
  );
}
