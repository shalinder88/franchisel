// Pure helpers used by BrandPage components.
// Keep this file logic-only — no JSX, no React imports.

import type { BrandPageModel, Severity } from "@/lib/brand-page-model"

export type TocEntry = { id: string; label: string }

/** Build the sticky reading map from whichever sections actually have data. */
export function getTOC(model: BrandPageModel): TocEntry[] {
  const entries: TocEntry[] = [
    { id: "hero", label: "Snapshot" },
    { id: "guided-summary", label: "What this means" },
    { id: "economics", label: "Economics" },
    { id: "stability", label: "System stability" },
    { id: "contract", label: "Contract burden" },
  ]
  if (model.stateAddenda && model.stateAddenda.entries.length > 0) {
    entries.push({ id: "state-addenda", label: "State overrides" })
  }
  entries.push(
    { id: "financial-strength", label: "Financial strength" },
    { id: "red-flags", label: "Red flags" },
    { id: "questions", label: "Questions to ask" },
    { id: "evidence", label: "Source evidence" },
  )
  return entries
}

/** Severity ordering for sorting red flags / contract families. */
export function severityRank(s: Severity | undefined): number {
  if (s === "high") return 0
  if (s === "caution") return 1
  return 2
}

/** Compact USD range for the investment range bar. */
export function formatUsdRange(low: number | null, high: number | null): string {
  if (low == null || high == null) return "—"
  return `${formatUsdCompact(low)} – ${formatUsdCompact(high)}`
}

export function formatUsdCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `$${m.toFixed(m >= 10 ? 1 : 2)}M`
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

/** Compute share-of-total from an ownership-mix array. */
export function ownershipShares(
  mix: Array<{ label: string; value: number }>,
): Array<{ label: string; value: number; pct: number }> {
  const total = mix.reduce((acc, m) => acc + m.value, 0) || 1
  return mix.map((m) => ({ ...m, pct: m.value / total }))
}

/**
 * Bucketise an investment range into a sorted list with relative widths
 * suitable for a horizontal bar visual. Returns null-safe.
 */
export function investmentBucketBars(
  buckets: Array<{ label: string; low?: number | null; high?: number | null }>,
  rangeLow: number | null,
  rangeHigh: number | null,
): Array<{ label: string; low: number; high: number; leftPct: number; widthPct: number }> {
  const lo = rangeLow ?? Math.min(...buckets.map((b) => b.low ?? Infinity))
  const hi = rangeHigh ?? Math.max(...buckets.map((b) => b.high ?? -Infinity))
  const span = hi - lo || 1
  return buckets
    .filter((b) => b.low != null && b.high != null)
    .map((b) => {
      const low = b.low as number
      const high = b.high as number
      return {
        label: b.label,
        low,
        high,
        leftPct: ((low - lo) / span) * 100,
        widthPct: ((high - low) / span) * 100,
      }
    })
}

/** Sort red flags by severity for display. */
export function sortRedFlags<T extends { severity: Severity }>(items: T[]): T[] {
  return [...items].sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
}
