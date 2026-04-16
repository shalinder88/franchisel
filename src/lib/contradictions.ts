import type { FranchiseBrand } from "@/lib/types"
import { normalizeRevenueType } from "@/lib/types"

/**
 * Contradiction Finder
 * --------------------
 * Surfaces statements inside a single FDD that disagree with each other,
 * or framing/marketing claims that are contradicted by the underlying
 * disclosures. Every rule cites the FDD items it reads from so the buyer
 * can verify in the original filing.
 *
 * Design constraints:
 *  - Pure function. No side effects, no I/O. Safe to import in server
 *    components and client components.
 *  - Conservative. We only fire a rule when the underlying fields are
 *    actually populated. Missing data is silence, never a contradiction.
 *  - Each Contradiction carries the items involved so the UI can link
 *    back to the source sections on the brand page.
 */

export type ContradictionSeverity = "critical" | "warning" | "info"

export interface Contradiction {
  /** Stable id for keying React lists and analytics */
  id: string
  /** Short headline a buyer can scan in 2 seconds */
  title: string
  /** One-paragraph plain-English explanation of the conflict */
  explanation: string
  /** What a buyer should do about it (verify, ask, etc.) */
  action: string
  /** FDD items the rule reads from, e.g. ["Item 12", "Item 17"] */
  items: string[]
  /** How loudly to surface this in UI */
  severity: ContradictionSeverity
}

export function detectContradictions(brand: FranchiseBrand): Contradiction[] {
  const out: Contradiction[] = []

  /* ── Rule 1: "exclusive territory" but franchisor reserves competition ── */
  if (
    brand.item12?.exclusiveTerritory === true &&
    brand.item12?.franchisorMayCompete === true
  ) {
    out.push({
      id: "territory-exclusive-but-compete",
      title: "Exclusive territory — but the franchisor can still compete in it",
      explanation:
        "Item 12 grants you an exclusive territory and at the same time reserves the franchisor's right to operate, license, or grant competing outlets within or near that territory. The two clauses describe different things — the second one is the operative limit on your protection.",
      action:
        "Read the exact reservation-of-rights paragraph in Item 12 before signing. Ask the franchisor in writing what specific channels and unit types they retain the right to operate in your protected area.",
      items: ["Item 12"],
      severity: "warning",
    })
  }

  /* ── Rule 2: "exclusive territory" but online sales carved out ── */
  if (
    brand.item12?.exclusiveTerritory === true &&
    brand.item12?.onlineSalesReserved === true
  ) {
    out.push({
      id: "territory-exclusive-but-online-reserved",
      title: "Territory is exclusive for storefronts, not for online sales",
      explanation:
        "Item 12 protects you from another physical outlet inside your territory but reserves online, app, delivery-marketplace, and direct-to-consumer sales for the franchisor — including sales to customers who live in your area.",
      action:
        "Find out what share of category demand is moving online. Ask current operators how online order fulfilment and credit are handled in their territories.",
      items: ["Item 12"],
      severity: "warning",
    })
  }

  /* ── Rule 3: Item 19 ambiguous about what it measures ── */
  const rt = normalizeRevenueType(brand.item19?.revenueType)
  if (brand.hasItem19 && (rt === "unknown" || !brand.item19?.revenueType)) {
    out.push({
      id: "item19-revenue-type-unspecified",
      title: "Item 19 reports an average without specifying what it measures",
      explanation:
        "The financial performance representation gives a number but does not clearly label whether it is gross sales, net sales, gross profit, or an earnings figure. The same dollar amount means very different things depending on which one it is.",
      action:
        "Treat the number as gross sales until proven otherwise, and ask the franchisor in writing whether the figure is before or after royalties, advertising fund, rent, and food/COGS.",
      items: ["Item 19"],
      severity: "warning",
    })
  }

  /* ── Rule 4: Item 19 reports revenue with no expense layer ── */
  if (
    brand.hasItem19 &&
    brand.item19?.expenseCoverage === "none" &&
    !["ebitda", "operating_income", "net_income", "gross_profit", "cash_flow"].includes(rt)
  ) {
    out.push({
      id: "item19-no-expense-coverage",
      title: "Item 19 shows revenue but no operating costs",
      explanation:
        "The franchisor discloses average or median revenue but does not show royalties, advertising, rent, labour, or COGS for the same outlets. Decisions made on the headline number systematically overstate what the operator keeps.",
      action:
        "Build your own profit estimate using the royalty (Item 6), ad fund (Item 6), rent (Item 7 or your local market), and category COGS norms. Then compare what's left against the lifestyle the headline implies.",
      items: ["Item 19", "Item 6", "Item 7"],
      severity: "warning",
    })
  }

  /* ── Rule 5: Healthy net growth vs heavy transfer activity ── */
  const ue = brand.unitEconomics
  if (
    ue &&
    ue.netGrowth > 0 &&
    ue.unitsTransferred > 0 &&
    ue.unitsEndOfPeriod > 0 &&
    ue.unitsTransferred / ue.unitsEndOfPeriod >= 0.05
  ) {
    const pct = Math.round((ue.unitsTransferred / ue.unitsEndOfPeriod) * 100)
    out.push({
      id: "growth-positive-but-transfers-heavy",
      title: `Net growth is positive, but ${pct}% of the system changed hands last year`,
      explanation: `Item 20 reports +${ue.netGrowth} net units, which reads as a healthy expanding system. The same table shows ${ue.unitsTransferred.toLocaleString()} ownership transfers — roughly ${pct}% of all open units. Heavy transfer volume can mean operators are getting out, regardless of whether the system is technically growing.`,
      action:
        "On every validation call, ask current and recent operators why they sold (or considered selling). Distinguish lifestyle/retirement transfers from distress sales.",
      items: ["Item 20"],
      severity: "warning",
    })
  }

  /* ── Rule 6: Item 19 strong vs Item 20 churn high ── */
  const closed = (ue?.unitsClosed ?? 0) + (ue?.unitsTerminated ?? 0) + (ue?.unitsCeasedOperations ?? 0) + (ue?.unitsNonRenewed ?? 0)
  if (
    brand.hasItem19 &&
    (brand.item19?.grossRevenueAvg ?? 0) > 0 &&
    ue?.unitsStartOfPeriod &&
    ue.unitsStartOfPeriod > 0 &&
    closed / ue.unitsStartOfPeriod >= 0.08
  ) {
    const pct = Math.round((closed / ue.unitsStartOfPeriod) * 100)
    out.push({
      id: "item19-strong-but-attrition-high",
      title: `Item 19 reports strong revenue, but ~${pct}% of operators exited last year`,
      explanation: `The financial performance representation paints a healthy picture for the included cohort, while Item 20 shows roughly ${pct}% of opening-year units left the system through closures, terminations, non-renewals, or voluntary cessation. The cohort that produced the Item 19 average is, by definition, the survivors.`,
      action:
        "Ask the franchisor for the same Item 19 metrics restricted to the closure/termination cohort. If they decline, treat the headline average as a survivor-bias number.",
      items: ["Item 19", "Item 20"],
      severity: "critical",
    })
  }

  /* ── Rule 7: Required purchases + franchisor receives supplier revenue ── */
  if (
    brand.item8?.hasRequiredPurchases === true &&
    brand.item8?.franchisorReceivesSupplierRevenue === true
  ) {
    out.push({
      id: "item8-required-purchase-franchisor-revenue",
      title: "Mandatory purchases route money back to the franchisor",
      explanation:
        "Item 8 requires you to buy from approved suppliers, and the same item discloses that the franchisor or an affiliate earns revenue from those arrangements. The price you pay is set by a counterparty whose economics improve when your input costs go up.",
      action:
        "Get current operators to share their actual supplier invoices. Compare against open-market pricing for the same SKUs. The gap is a real, recurring tax on your operation.",
      items: ["Item 8"],
      severity: "warning",
    })
  }

  /* ── Rule 8: Short termination cure + post-term non-compete ── */
  const cure = brand.item17?.curePeriodDays
  if (
    brand.item17?.franchisorCanTerminateWithCause === true &&
    typeof cure === "number" &&
    cure > 0 &&
    cure < 30 &&
    brand.item17?.hasNonCompete === true &&
    (brand.item17?.nonCompeteYears ?? 0) >= 1
  ) {
    out.push({
      id: "item17-short-cure-plus-noncompete",
      title: `Short ${cure}-day cure window combined with a ${brand.item17.nonCompeteYears}-year non-compete`,
      explanation: `Item 17 lets the franchisor terminate for cause if you do not fix a default within ${cure} days. The same item bars you from operating a comparable business for ${brand.item17.nonCompeteYears} year(s) after the franchise ends. Together, an operational stumble can both end the franchise and lock you out of the industry you just built experience in.`,
      action:
        "Ask the franchisor's counsel for a list of every default that has triggered termination in the past five years and the cure outcomes. Have your own attorney review the non-compete enforceability in your state before signing.",
      items: ["Item 17"],
      severity: "critical",
    })
  }

  /* ── Rule 9: Item 21 going-concern warning ── */
  if (brand.item21?.goingConcernWarning === true) {
    out.push({
      id: "item21-going-concern",
      title: "Item 21 audited financials include a going-concern warning",
      explanation:
        "The franchisor's auditor flagged substantial doubt about the company's ability to continue as a going concern. This is the most serious modification an auditor can put in a clean opinion short of a qualified opinion.",
      action:
        "Ask for the most recent unaudited interim financials and the franchisor's plan to remediate the going-concern condition before committing capital.",
      items: ["Item 21"],
      severity: "critical",
    })
  }

  /* ── Rule 10: Item 21 audit opinion not clean ── */
  const opinion = brand.item21?.auditorOpinion
  if (opinion && opinion !== "clean" && opinion !== "unknown") {
    const map: Record<string, string> = {
      qualified: "qualified",
      adverse: "adverse",
      disclaimer: "disclaimer of opinion",
    }
    const label = map[opinion] ?? opinion
    out.push({
      id: "item21-non-clean-opinion",
      title: `Item 21 audit opinion is ${label}, not unmodified`,
      explanation: `The auditor declined to issue a clean opinion on the franchisor's most recent financial statements. A ${label} opinion typically means the auditor disagreed with management's accounting, was unable to obtain sufficient evidence, or saw a material misstatement.`,
      action:
        "Read the full auditor's report in Exhibit J. The basis-for-opinion paragraph explains exactly what the auditor flagged. Do not rely on summary financial figures until you understand the issue.",
      items: ["Item 21"],
      severity: "critical",
    })
  }

  /* ── Rule 11: prior-year revenue declined materially but marketed as growing ── */
  const prior = brand.item19Prior?.grossRevenueAvg
  const current = brand.item19?.grossRevenueAvg
  if (
    prior &&
    current &&
    prior > 0 &&
    (current - prior) / prior <= -0.05
  ) {
    const pct = Math.round(((current - prior) / prior) * 100)
    out.push({
      id: "item19-yoy-decline",
      title: `Average unit revenue fell ${Math.abs(pct)}% versus the prior FDD`,
      explanation: `The current Item 19 average is materially below the prior year's disclosed average for the same brand. A YoY decline of this size can reflect cohort changes (new units pulling the average down) or genuine same-store deterioration — and Item 19 typically does not separate the two.`,
      action:
        "Ask the franchisor whether the current Item 19 cohort is comparable to last year's, and whether same-store sales for units open in both years are positive or negative.",
      items: ["Item 19"],
      severity: "warning",
    })
  }

  return out
}

/** Severity helpers for UI consumers */
export function severityRank(s: ContradictionSeverity): number {
  if (s === "critical") return 3
  if (s === "warning") return 2
  return 1
}

export function sortBySeverity(list: Contradiction[]): Contradiction[] {
  return [...list].sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
}
