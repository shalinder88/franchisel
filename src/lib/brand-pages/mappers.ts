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

/** First sentence of a string (split on '. '). */
export function firstSentence(text: string): string {
  const idx = text.indexOf(". ")
  return idx >= 0 ? text.slice(0, idx + 1) : text
}

/** First N words, ellipsized. */
export function truncateToLabel(text: string, maxWords = 5): string {
  const words = text.split(/\s+/)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ") + "…"
}

/** Severity to bar width percentage. */
export function severityToPercent(s: Severity): number {
  if (s === "high") return 100
  if (s === "caution") return 66
  return 33
}

/** State full name → 2-letter abbreviation. */
const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
}
export function stateAbbreviation(name: string): string {
  return STATE_ABBR[name] ?? name.slice(0, 2).toUpperCase()
}

/** Parse "vs $10,568.4M in 2023" → trend direction. */
export function extractYoYTrend(
  note: string | undefined,
): { direction: "up" | "down" | "flat" } | null {
  if (!note) return null
  const m = note.match(/vs\s+\$?([\d,.]+)/i)
  if (!m) return null
  const prev = parseFloat(m[1].replace(/,/g, ""))
  // We can't easily extract current from context, so just check phrasing
  // The note format is "vs $X in YYYY" — if current > prev, it's up
  // This is a heuristic; the caller should override if needed
  return null // Caller computes direction from value comparison
}

/** Parse leading percentage from fee value string like "5% of Gross Sales". */
export function parseFeePercent(value: string): number | null {
  const m = value.match(/^([\d.]+)%/)
  return m ? parseFloat(m[1]) : null
}
