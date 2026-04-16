import type { FranchiseBrand, Item19Data } from "@/lib/types"
import { normalizeRevenueType } from "@/lib/types"

/**
 * Item 19 Quality Grader
 * ----------------------
 * Most franchise sites display Item 19 averages as if they were all equal.
 * They are not. A $1.2M average from 28 stratified franchisee units open
 * three or more years is a different number than a $1.2M average from "all
 * units we wanted to include." This module grades the disclosure on the
 * dimensions that actually determine whether the number is decision-useful.
 *
 * Output is a 0-100 score, a letter grade (A/B/C/D/F), and a list of
 * structured concerns the buyer can act on. Pure function, no I/O.
 */

export type Item19Grade = "A" | "B" | "C" | "D" | "F"

export type ConcernSeverity = "info" | "minor" | "major"

export interface QualityConcern {
  id: string
  title: string
  detail: string
  severity: ConcernSeverity
}

export interface QualityDimension {
  id: string
  label: string
  /** 0-100 sub-score for this dimension */
  score: number
  /** Plain-English summary of how the brand fared here */
  summary: string
}

export interface Item19Quality {
  hasItem19: boolean
  /** Composite 0-100 score */
  score: number
  /** Letter grade derived from the composite */
  grade: Item19Grade
  /** Per-dimension breakdown */
  dimensions: QualityDimension[]
  /** Specific things to verify or be cautious about */
  concerns: QualityConcern[]
  /** One-line bottom-line read */
  verdict: string
}

function letterFor(score: number): Item19Grade {
  if (score >= 85) return "A"
  if (score >= 70) return "B"
  if (score >= 55) return "C"
  if (score >= 40) return "D"
  return "F"
}

interface DimResult {
  score: number
  summary: string
  concerns: QualityConcern[]
}

/* ── Dimension 1: sample size ── */
function gradeSampleSize(item19: Item19Data, totalUnits: number): DimResult {
  const concerns: QualityConcern[] = []
  const included = item19.unitsIncluded ?? 0
  const eligible = item19.totalEligibleUnits ?? totalUnits ?? 0
  if (included <= 0) {
    return {
      score: 30,
      summary: "Sample size is not disclosed in the Item 19 report.",
      concerns: [{
        id: "sample-size-undisclosed",
        title: "Sample size not disclosed",
        detail: "The franchisor reports an average without saying how many outlets it is averaged across. A small sample means the average is highly sensitive to outliers.",
        severity: "major",
      }],
    }
  }
  // Score: more is better, asymptote around 100 units = 100 score
  const sampleScore = Math.min(100, Math.round((included / 100) * 100))
  if (included < 20) {
    concerns.push({
      id: "sample-size-small",
      title: `Small sample of ${included} unit${included === 1 ? "" : "s"}`,
      detail: "Averages from small samples can swing wildly with one or two strong or weak outliers. Treat the headline as a wide range, not a point estimate.",
      severity: included < 10 ? "major" : "minor",
    })
  }
  let summary: string
  if (eligible > 0 && included < eligible) {
    const pctIncluded = Math.round((included / eligible) * 100)
    summary = `Reports ${included} of ${eligible} eligible units (${pctIncluded}%).`
    if (pctIncluded < 70) {
      concerns.push({
        id: "sample-size-cherry-pick-risk",
        title: `Excludes ${eligible - included} of ${eligible} eligible units`,
        detail: `Only ${pctIncluded}% of eligible units are in the disclosure. Ask the franchisor what criteria excluded the remaining ${eligible - included} units. A high exclusion rate raises cherry-pick risk.`,
        severity: pctIncluded < 50 ? "major" : "minor",
      })
    }
  } else {
    summary = `Reports ${included} unit${included === 1 ? "" : "s"}.`
  }
  return { score: sampleScore, summary, concerns }
}

/* ── Dimension 2: representativeness (basis) ── */
function gradeBasis(item19: Item19Data): DimResult {
  const concerns: QualityConcern[] = []
  let score = 70
  let summary = ""
  switch (item19.basis) {
    case "all_units":
      score = 100
      summary = "Includes all units (no survivor selection)."
      break
    case "open_over_1yr":
      score = 70
      summary = "Includes only units open for at least one year."
      concerns.push({
        id: "basis-open-1yr",
        title: "Excludes units that closed before reaching one year",
        detail: "Restricting the cohort to units open one year or more removes the early-closure tail. The number you see understates how the typical opening year unfolds.",
        severity: "minor",
      })
      break
    case "subset":
      score = 45
      summary = "Reports a defined subset (cohort, region, format)."
      concerns.push({
        id: "basis-subset",
        title: "Subset cohort, not the whole system",
        detail: "Subset disclosures are common when a portion of the system underperforms. Read the cohort definition carefully and ask why other units were excluded.",
        severity: "major",
      })
      break
    case "geographic":
      score = 50
      summary = "Geographic subset only."
      concerns.push({
        id: "basis-geographic",
        title: "Geographic subset",
        detail: "Local market dynamics drive a meaningful share of franchise unit performance. A geographic subset may not generalize to your territory.",
        severity: "major",
      })
      break
    default:
      summary = "Cohort basis is not clearly classified."
      score = 50
      concerns.push({
        id: "basis-unclear",
        title: "Cohort basis unclear",
        detail: "It is not clear whether the disclosure covers all units, only mature units, or a defined subset. Without that, the number cannot be fairly compared to other brands.",
        severity: "minor",
      })
  }
  return { score, summary, concerns }
}

/* ── Dimension 3: revenue type clarity ── */
function gradeRevenueType(item19: Item19Data): DimResult {
  const concerns: QualityConcern[] = []
  const rt = normalizeRevenueType(item19.revenueType)
  if (rt === "unknown") {
    return {
      score: 30,
      summary: "What the number actually measures is not disclosed.",
      concerns: [{
        id: "revenue-type-unknown",
        title: "Metric type unspecified",
        detail: "Item 19 reports an average without labeling whether it is gross sales, net sales, gross profit, EBITDA, operating income, or net income. Same number, very different meanings.",
        severity: "major",
      }],
    }
  }
  // Profit-like metrics are more decision-useful than gross-only
  const isProfit = ["ebitda", "operating_income", "net_income", "gross_profit", "cash_flow"].includes(rt)
  return {
    score: isProfit ? 100 : 80,
    summary: isProfit
      ? `Reports a profit-layer metric (${rt.replace("_", " ")}).`
      : `Reports a sales-layer metric (${rt.replace("_", " ")}).`,
    concerns,
  }
}

/* ── Dimension 4: expense coverage ── */
function gradeExpenseCoverage(item19: Item19Data): DimResult {
  const concerns: QualityConcern[] = []
  const ec = item19.expenseCoverage
  switch (ec) {
    case "full_pnl":
      return {
        score: 100,
        summary: "Full income statement disclosed in Item 19.",
        concerns,
      }
    case "partial_opex":
      return {
        score: 75,
        summary: "Some operating expenses disclosed (not a full P&L).",
        concerns: [{
          id: "expense-partial",
          title: "Operating costs only partially disclosed",
          detail: "Item 19 shows some expense lines but not a full income statement. Build the missing layers using your local market for rent, labor, and category COGS norms.",
          severity: "minor",
        }],
      }
    case "franchisor_fees_only":
      return {
        score: 55,
        summary: "Only franchisor fees (royalty/ad) disclosed; no operating costs.",
        concerns: [{
          id: "expense-fees-only",
          title: "Only franchisor fees, no operating costs",
          detail: "Item 19 nets out royalty and ad fund but no rent, labor, or COGS. The 'after-fees' figure overstates what the operator actually keeps.",
          severity: "major",
        }],
      }
    case "none":
      return {
        score: 30,
        summary: "Revenue disclosed; no operating costs disclosed.",
        concerns: [{
          id: "expense-none",
          title: "Revenue only, no operating-cost layer",
          detail: "The number is sales, not earnings. Any decision built on it will systematically overstate operator take-home.",
          severity: "major",
        }],
      }
    default:
      return {
        score: 50,
        summary: "Expense coverage unspecified.",
        concerns: [{
          id: "expense-unknown",
          title: "Expense coverage unspecified",
          detail: "We could not determine which operating expense layers (if any) are disclosed alongside the revenue figure.",
          severity: "minor",
        }],
      }
  }
}

/* ── Dimension 5: vintage (measurement year freshness) ── */
function gradeVintage(item19: Item19Data, fddYear: number): DimResult {
  const my = item19.measurementYear
  const concerns: QualityConcern[] = []
  if (!my) {
    return {
      score: 70,
      summary: "Measurement year not explicitly stated.",
      concerns: [{
        id: "vintage-unstated",
        title: "Measurement year unstated",
        detail: "Item 19 should clearly state the calendar or fiscal year the data covers. Verify in the filing whether it is the most recent completed year.",
        severity: "minor",
      }],
    }
  }
  const lag = fddYear - my
  if (lag <= 1) return { score: 100, summary: `Measurement year ${my} (current).`, concerns }
  if (lag === 2) {
    return {
      score: 75,
      summary: `Measurement year ${my} (one cycle stale).`,
      concerns: [{
        id: "vintage-1-stale",
        title: `Data is from ${my}, FDD year is ${fddYear}`,
        detail: "Conditions can change quickly in franchising. Ask current operators whether the unit-economic shape has held up since the measurement year.",
        severity: "minor",
      }],
    }
  }
  return {
    score: 45,
    summary: `Measurement year ${my} (multiple cycles stale).`,
    concerns: [{
      id: "vintage-stale",
      title: `Data is ${lag} years old`,
      detail: `Item 19 reports ${my} performance in a ${fddYear} FDD. Treat the numbers as historical reference, not as a current operating picture.`,
      severity: "major",
    }],
  }
}

/* ── Dimension 6: same-cohort consistency ── */
function gradeSameCohort(item19: Item19Data): DimResult {
  if (item19.sameCohort === false) {
    return {
      score: 40,
      summary: "Revenue and expense figures cover different outlet sets.",
      concerns: [{
        id: "same-cohort-no",
        title: "Mixed cohorts for revenue and expenses",
        detail: "If the revenue figure is averaged over one set of units and the expense figures are taken from another, the implied 'profit' arithmetic is not actually for the same business.",
        severity: "major",
      }],
    }
  }
  if (item19.sameCohort === true) {
    return { score: 100, summary: "Revenue and expenses cover the same units.", concerns: [] }
  }
  return { score: 70, summary: "Cohort consistency not explicitly stated.", concerns: [] }
}

/* ── Dimension 7: extraction confidence ── */
function gradeExtractionConfidence(item19: Item19Data): DimResult {
  const ec = item19.extractionConfidence
  if (ec === "high") return { score: 100, summary: "Numbers extracted with high confidence.", concerns: [] }
  if (ec === "medium") return { score: 80, summary: "Numbers extracted with medium confidence.", concerns: [] }
  if (ec === "low") {
    return {
      score: 50,
      summary: "Numbers extracted with low confidence.",
      concerns: [{
        id: "extraction-low-confidence",
        title: "Lower-confidence extraction",
        detail: "Our automated extraction had a weak signal on this Item 19. Verify the headline number against the filing before relying on it.",
        severity: "minor",
      }],
    }
  }
  return { score: 80, summary: "Extraction confidence not flagged.", concerns: [] }
}

export function gradeItem19(brand: FranchiseBrand): Item19Quality {
  if (!brand.hasItem19 || !brand.item19) {
    return {
      hasItem19: false,
      score: 0,
      grade: "F",
      dimensions: [],
      concerns: [
        {
          id: "no-item19",
          title: "No financial performance representation disclosed",
          detail: `${brand.name} chose not to provide an Item 19. Per FTC rule, franchisors are not required to. The absence is not in itself a red flag, but it does mean the only sources of unit-economic data are validation calls with current operators and your own market analysis.`,
          severity: "major",
        },
      ],
      verdict: "No Item 19 disclosed. Build your own unit economics from operator interviews and market data.",
    }
  }

  const i19 = brand.item19
  const dims: Array<{ id: string; label: string; weight: number; result: DimResult }> = [
    { id: "sample-size", label: "Sample size", weight: 0.15, result: gradeSampleSize(i19, brand.totalUnits) },
    { id: "basis", label: "Cohort basis", weight: 0.20, result: gradeBasis(i19) },
    { id: "revenue-type", label: "Metric type clarity", weight: 0.15, result: gradeRevenueType(i19) },
    { id: "expense-coverage", label: "Expense coverage", weight: 0.20, result: gradeExpenseCoverage(i19) },
    { id: "vintage", label: "Vintage", weight: 0.10, result: gradeVintage(i19, brand.fddYear) },
    { id: "same-cohort", label: "Same-cohort consistency", weight: 0.10, result: gradeSameCohort(i19) },
    { id: "confidence", label: "Extraction confidence", weight: 0.10, result: gradeExtractionConfidence(i19) },
  ]

  const composite = Math.round(
    dims.reduce((s, d) => s + d.result.score * d.weight, 0)
  )
  const grade = letterFor(composite)
  const concerns = dims.flatMap((d) => d.result.concerns)

  let verdict: string
  if (grade === "A") verdict = "Decision-useful Item 19. Cross-check with operator interviews."
  else if (grade === "B") verdict = "Generally usable, but one or two specific cautions to verify."
  else if (grade === "C") verdict = "Useful as a starting point. Do not make a buying decision on this number alone."
  else if (grade === "D") verdict = "Significant disclosure gaps. Treat the headline as marketing until validated."
  else verdict = "Disclosure quality is poor enough that the number should not anchor any decision."

  return {
    hasItem19: true,
    score: composite,
    grade,
    dimensions: dims.map((d) => ({
      id: d.id,
      label: d.label,
      score: d.result.score,
      summary: d.result.summary,
    })),
    concerns,
    verdict,
  }
}
