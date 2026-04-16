import type { FranchiseBrand } from "@/lib/types"

/**
 * True Fee Stack
 * --------------
 * Builds a clause-level view of every fee a franchisee can be charged across
 * the life of an agreement. Combines the structured fields on FranchiseBrand
 * with the unstructured otherOngoingFees strings the team has extracted.
 *
 * Why this exists: most "affordability calculators" only model royalty and
 * ad fund. The real cash drag on franchise units comes from the long tail —
 * technology, training travel, mandated upgrades, transfer/renewal fees,
 * supplier markups, local marketing floors. This module surfaces every line
 * the FDD discloses, so the buyer's number is the actual number, not a
 * brochure estimate.
 *
 * Pure function. No I/O. Safe for server and client components.
 */

export type FeeCategory =
  | "one_time"            // Paid once at signing or build-out
  | "recurring_pct"       // Recurring as a % of gross sales
  | "recurring_fixed"     // Recurring fixed dollar (monthly / annual)
  | "event_triggered"    // Only if you renew, transfer, audit, etc.
  | "lock_in"             // Required suppliers / mandated purchases
  | "other"               // Catch-all for fees we couldn't auto-classify

export interface FeeLine {
  /** Stable id for keying React lists */
  id: string
  /** Short label */
  label: string
  /** Raw text as disclosed in the FDD (preferred over our parse when present) */
  raw: string
  category: FeeCategory
  /** Numeric % of gross sales when known (e.g. 0.05 for 5%) */
  pctOfSales?: number
  /** Numeric one-time or annual dollar amount when known */
  amountUsd?: number
  /** Item the fee comes from, e.g. "Item 5", "Item 6", "Item 17" */
  sourceItem: string
  /** Optional buyer-facing note */
  note?: string
}

export interface FeeStack {
  oneTime: FeeLine[]
  recurring: FeeLine[]
  eventTriggered: FeeLine[]
  /** Combined recurring percent of gross sales (where parseable) */
  totalRecurringPct: number
  /** Sum of fixed-dollar one-time fees we can name */
  totalOneTimeUsd: number
}

/**
 * Parse a percent value out of an arbitrary disclosure string.
 * Examples we handle:
 *   "5%"
 *   "Up to 3.5%"
 *   "1% of Gross Revenue"
 *   "6\u201323% of Gross Sales" -> we take the lower bound (6)
 */
function parsePct(raw: string): number | undefined {
  const m = raw.match(/(\d+(?:\.\d+)?)\s*[\u2013-]\s*(\d+(?:\.\d+)?)\s*%/)
  if (m) return Number(m[1]) / 100
  const single = raw.match(/(\d+(?:\.\d+)?)\s*%/)
  if (single) return Number(single[1]) / 100
  return undefined
}

/** Parse a $ amount. Returns undefined when not a clean number. */
function parseUsd(raw: string): number | undefined {
  const m = raw.match(/\$\s*([\d,]+(?:\.\d+)?)/)
  if (!m) return undefined
  const n = Number(m[1].replace(/,/g, ""))
  return Number.isFinite(n) ? n : undefined
}

/** Heuristic: classify an "other ongoing fee" string into a category. */
function classifyOther(raw: string): FeeCategory {
  const lc = raw.toLowerCase()
  if (/transfer|renewal|assignment|reinstatement|audit|inspection/.test(lc)) {
    return "event_triggered"
  }
  if (/local|advertising|marketing|brand fund|coop/.test(lc)) {
    return "recurring_pct"
  }
  if (/rent|percentage rent|sublease/.test(lc)) {
    return "recurring_pct"
  }
  if (/technology|software|pos|cloud|saas|license/.test(lc)) {
    return "recurring_fixed"
  }
  if (/training|travel|conference|annual meeting/.test(lc)) {
    return "event_triggered"
  }
  if (/supplier|product|inventory|food|beverage|approved purchas/.test(lc)) {
    return "lock_in"
  }
  return "other"
}

export function buildFeeStack(brand: FranchiseBrand): FeeStack {
  const oneTime: FeeLine[] = []
  const recurring: FeeLine[] = []
  const eventTriggered: FeeLine[] = []

  /* ── Item 5 — initial franchise fee ── */
  if (brand.initialFranchiseFee && brand.initialFranchiseFee > 0) {
    oneTime.push({
      id: "initial-franchise-fee",
      label: "Initial franchise fee",
      raw: `$${brand.initialFranchiseFee.toLocaleString()}`,
      category: "one_time",
      amountUsd: brand.initialFranchiseFee,
      sourceItem: "Item 5",
    })
  }

  /* ── Item 6 — royalty ── */
  if (brand.royaltyRate) {
    const pct = parsePct(brand.royaltyRate)
    const usd = parseUsd(brand.royaltyRate)
    recurring.push({
      id: "royalty",
      label: "Royalty",
      raw: brand.royaltyRate,
      category: "recurring_pct",
      pctOfSales: pct,
      amountUsd: usd,
      sourceItem: "Item 6",
    })
  }

  /* ── Item 6 — ad / brand fund ── */
  if (brand.marketingFundRate) {
    const pct = parsePct(brand.marketingFundRate)
    recurring.push({
      id: "marketing-fund",
      label: "Brand / ad fund",
      raw: brand.marketingFundRate,
      category: "recurring_pct",
      pctOfSales: pct,
      sourceItem: "Item 6",
    })
  }

  /* ── Item 6 — technology fee ── */
  if (brand.technologyFee && brand.technologyFee > 0) {
    recurring.push({
      id: "technology-fee",
      label: "Technology fee",
      raw: `$${brand.technologyFee.toLocaleString()} / year`,
      category: "recurring_fixed",
      amountUsd: brand.technologyFee,
      sourceItem: "Item 6",
    })
  }

  /* ── Item 6 — extracted "other ongoing fees" strings ── */
  for (let i = 0; i < (brand.otherOngoingFees?.length ?? 0); i++) {
    const raw = brand.otherOngoingFees![i]
    const category = classifyOther(raw)
    const line: FeeLine = {
      id: `other-${i}`,
      label: raw.split(":")[0].slice(0, 60),
      raw,
      category,
      pctOfSales: parsePct(raw),
      amountUsd: parseUsd(raw),
      sourceItem: "Item 6",
    }
    if (category === "event_triggered") {
      eventTriggered.push(line)
    } else if (category === "lock_in" || category === "recurring_pct" || category === "recurring_fixed") {
      recurring.push(line)
    } else {
      // "other" lands in recurring as a default — buyers should see it
      recurring.push(line)
    }
  }

  /* ── Item 17 — renewal & transfer fees ── */
  if (brand.item17?.renewalFee !== undefined) {
    const rf = brand.item17.renewalFee
    eventTriggered.push({
      id: "renewal-fee",
      label: "Renewal fee",
      raw: typeof rf === "number" ? `$${rf.toLocaleString()}` : "Varies",
      category: "event_triggered",
      amountUsd: typeof rf === "number" ? rf : undefined,
      sourceItem: "Item 17",
      note: brand.item17.renewalTermYears
        ? `Charged at end of every ${brand.item17.renewalTermYears}-year term.`
        : undefined,
    })
  }
  if (brand.item17?.transferFee !== undefined) {
    const tf = brand.item17.transferFee
    eventTriggered.push({
      id: "transfer-fee",
      label: "Transfer fee",
      raw: typeof tf === "number" ? `$${tf.toLocaleString()}` : "Varies",
      category: "event_triggered",
      amountUsd: typeof tf === "number" ? tf : undefined,
      sourceItem: "Item 17",
      note: "Charged when you sell or assign the franchise. Often a real exit cost.",
    })
  }

  /* ── Item 8 — supplier lock-in flag (qualitative) ── */
  if (brand.item8?.hasRequiredPurchases === true) {
    recurring.push({
      id: "supplier-lock-in",
      label: "Required-supplier purchases",
      raw: brand.item8.franchisorReceivesSupplierRevenue
        ? "Mandatory purchases from approved suppliers; franchisor or affiliate earns revenue from these arrangements."
        : "Mandatory purchases from approved suppliers.",
      category: "lock_in",
      sourceItem: "Item 8",
      note: brand.item8.franchisorReceivesSupplierRevenue
        ? "Counterparty markup. Compare invoices against open-market pricing."
        : "Verify spec-only vs. closed list with the franchisor.",
    })
  }

  /* ── Aggregates ── */
  const totalRecurringPct = recurring
    .filter((l) => l.category === "recurring_pct" && typeof l.pctOfSales === "number")
    .reduce((s, l) => s + (l.pctOfSales ?? 0), 0)

  const totalOneTimeUsd = oneTime
    .filter((l) => typeof l.amountUsd === "number")
    .reduce((s, l) => s + (l.amountUsd ?? 0), 0)

  return { oneTime, recurring, eventTriggered, totalRecurringPct, totalOneTimeUsd }
}

/** Annualized recurring cost at a given gross sales level. */
export function annualizedAtRevenue(stack: FeeStack, grossSales: number): {
  pctCost: number
  fixedCost: number
  total: number
} {
  const pctCost = stack.totalRecurringPct * grossSales
  const fixedCost = stack.recurring
    .filter((l) => l.category === "recurring_fixed" && typeof l.amountUsd === "number")
    .reduce((s, l) => s + (l.amountUsd ?? 0), 0)
  return { pctCost, fixedCost, total: pctCost + fixedCost }
}
