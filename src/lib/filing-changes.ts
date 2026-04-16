import type { FranchiseBrand } from "@/lib/types"

/**
 * Filing Changes
 * --------------
 * Cross-brand year-over-year analysis using item19Prior data the team has
 * extracted. Surfaces the brands whose unit economics moved the most
 * between FDD filings, and the brands whose disclosure quality changed
 * (e.g. dropped Item 19 entirely between filings).
 *
 * Pure functions only. No I/O.
 */

export interface RevenueChange {
  brand: FranchiseBrand
  /** Prior FDD year-over-year base */
  priorYear: number
  /** Current FDD measurement year (or fddYear if not specified) */
  currentYear: number
  priorAvg: number
  currentAvg: number
  /** Decimal change, e.g. -0.07 = down 7% */
  pctChange: number
  /** Dollar change */
  deltaUsd: number
}

/** Brands whose Item 19 average changed between filings. */
export function computeRevenueChanges(brands: FranchiseBrand[]): RevenueChange[] {
  const out: RevenueChange[] = []
  for (const b of brands) {
    const prior = b.item19Prior?.grossRevenueAvg
    const priorYear = b.item19Prior?.fddYear
    const current = b.item19?.grossRevenueAvg
    if (
      typeof prior === "number" &&
      typeof current === "number" &&
      typeof priorYear === "number" &&
      prior > 0
    ) {
      out.push({
        brand: b,
        priorYear,
        currentYear: b.item19?.measurementYear ?? b.fddYear,
        priorAvg: prior,
        currentAvg: current,
        pctChange: (current - prior) / prior,
        deltaUsd: current - prior,
      })
    }
  }
  return out
}

export function topGainers(changes: RevenueChange[], n = 10): RevenueChange[] {
  return [...changes].sort((a, b) => b.pctChange - a.pctChange).slice(0, n)
}

export function topDecliners(changes: RevenueChange[], n = 10): RevenueChange[] {
  return [...changes].sort((a, b) => a.pctChange - b.pctChange).slice(0, n)
}

/** Brands whose Item 19 disclosure status changed (had it last year, dropped it now). */
export function droppedItem19(brands: FranchiseBrand[]): FranchiseBrand[] {
  return brands.filter(
    (b) => !b.hasItem19 && typeof b.item19Prior?.grossRevenueAvg === "number" && (b.item19Prior?.grossRevenueAvg ?? 0) > 0
  )
}

/** Total brands we have YoY signal on. */
export function coverageCount(brands: FranchiseBrand[]): number {
  return brands.filter(
    (b) =>
      typeof b.item19Prior?.grossRevenueAvg === "number" &&
      typeof b.item19?.grossRevenueAvg === "number"
  ).length
}
