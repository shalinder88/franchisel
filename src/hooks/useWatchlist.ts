"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "fdd_watchlist_v1";

export interface WatchlistEntry {
  slug: string;
  name: string;
  addedAt: string; // ISO date
  /** Snapshot of key metrics at time of adding — used to detect changes */
  snapshotScore?: number;
  snapshotRevenue?: number;
  notes?: string;
}

interface WatchlistStore {
  entries: WatchlistEntry[];
}

function read(): WatchlistStore {
  if (typeof window === "undefined") return { entries: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    return JSON.parse(raw) as WatchlistStore;
  } catch {
    return { entries: [] };
  }
}

function write(store: WatchlistStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage quota or private-browsing restriction — fail silently
  }
}

export function useWatchlist() {
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);

  // Hydrate from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    setEntries(read().entries);
  }, []);

  const isWatching = useCallback(
    (slug: string) => entries.some((e) => e.slug === slug),
    [entries]
  );

  const addToWatchlist = useCallback(
    (entry: Omit<WatchlistEntry, "addedAt">) => {
      setEntries((prev) => {
        if (prev.some((e) => e.slug === entry.slug)) return prev;
        const next: WatchlistEntry[] = [
          ...prev,
          { ...entry, addedAt: new Date().toISOString() },
        ];
        write({ entries: next });
        return next;
      });
    },
    []
  );

  const removeFromWatchlist = useCallback((slug: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.slug !== slug);
      write({ entries: next });
      return next;
    });
  }, []);

  const toggleWatchlist = useCallback(
    (entry: Omit<WatchlistEntry, "addedAt">) => {
      if (entries.some((e) => e.slug === entry.slug)) {
        removeFromWatchlist(entry.slug);
      } else {
        addToWatchlist(entry);
      }
    },
    [entries, addToWatchlist, removeFromWatchlist]
  );

  const clearWatchlist = useCallback(() => {
    setEntries([]);
    write({ entries: [] });
  }, []);

  return {
    entries,
    count: entries.length,
    isWatching,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
  };
}
