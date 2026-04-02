/**
 * Diligence memo generation — pure functions that turn FDD structured data
 * into interpretive text with citations. No AI, no estimates: every sentence
 * either comes from a filed FDD item or is labeled as editorial analysis.
 */

import type { FranchiseBrand, CompositeFDDScores, StateConcentrationData, ManagementData, Item19Comparable } from "./types";
import { formatCurrency, formatInvestmentRange, normalizeRevenueType, revenueTypeLabel, isProfitMetric } from "./types";

export interface DiligenceFlag {
  severity: "critical" | "warning" | "positive";
  item: string;        // e.g. "Item 19", "Item 3"
  title: string;
  detail: string;
}

export interface YoYDiff {
  /** Revenue change — only present when prior-year Item 19 data exists */
  revenueChange: {
    priorYear: number;
    priorAvg: number;
    currentAvg: number;
    changePct: number;
    direction: "up" | "down" | "flat";
  } | null;
  /** Unit trajectory from Item 20 (always available when unitEconomics has data) */
  unitTrajectory: {
    opened: number;
    closed: number;
    net: number;
    direction: "growing" | "shrinking" | "flat";
    turnoverRate: number;
  } | null;
  hasPriorData: boolean;
}

export interface DiligenceMemo {
  brand: string;
  slug: string;
  fddYear: number;
  dataSource: string;
  generatedDate: string;

  investmentSummary: string;
  investmentBreakeven: string | null;

  item19Analysis: {
    headline: string;
    detail: string;
    sampleQuality: "strong" | "partial" | "weak" | "none";
    impliedRoiYears: number | null;
    citations: string[];
  };

  item20Analysis: {
    trend: "growing" | "stable" | "contracting" | "unknown";
    headline: string;
    detail: string;
    citations: string[];
  };

  yoyDiff: YoYDiff;

  contractHighlights: {
    label: string;
    value: string;
    flag: boolean;
  }[];

  autoFlags: DiligenceFlag[];
  overallScore: number;
  scoreRationale: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function pct(n: number, d: number): string {
  if (!d) return "N/A";
  return `${Math.round((n / d) * 100)}%`;
}

function yrs(n: number | undefined): string {
  if (!n) return "—";
  return `${n} year${n !== 1 ? "s" : ""}`;
}

// ── Item 19 analysis ───────────────────────────────────────────────────────

function analyzeItem19(brand: FranchiseBrand): DiligenceMemo["item19Analysis"] {
  const i19 = brand.item19;
  const citations: string[] = [];

  if (!brand.hasItem19 || !i19?.grossRevenueAvg) {
    return {
      headline: "Economics not rated — Item 19 not available.",
      detail:
        brand.hasItem19 === false
          ? "This franchisor chose not to include a Financial Performance Representation. " +
            "Item 19 is voluntary per FTC rules. This does not indicate bad economics — " +
            "it means revenue projections cannot be sourced from the disclosure document."
          : "This franchisor filed an Item 19, but the figures are not currently available in our database. " +
            "This reflects a data coverage gap — not a judgment on the quality of the disclosure.",
      sampleQuality: "none",
      impliedRoiYears: null,
      citations: [brand.hasItem19 === false
        ? "Item 19 — not included in filed FDD (voluntary per FTC Franchise Rule)"
        : "Item 19 — filed, figures not available in database"],
    };
  }

  citations.push(
    `Item 19 — ${brand.fddYear} FDD (${brand.dataSource === "state_filing" ? "government-filed" : "verified"})`
  );

  // Sample quality
  const unitsIncluded = i19.unitsIncluded ?? 0;
  const systemPct = brand.totalUnits > 0 ? unitsIncluded / brand.totalUnits : 0;
  let sampleQuality: DiligenceMemo["item19Analysis"]["sampleQuality"];
  let sampleNote: string;

  if (unitsIncluded === 0 || systemPct === 0) {
    sampleQuality = "weak";
    sampleNote = "The FDD does not specify how many units were included in this figure.";
  } else if (systemPct >= 0.8) {
    sampleQuality = "strong";
    sampleNote = `${unitsIncluded.toLocaleString()} units (${pct(unitsIncluded, brand.totalUnits)} of system) — highly representative sample.`;
  } else if (systemPct >= 0.5) {
    sampleQuality = "partial";
    sampleNote = `${unitsIncluded.toLocaleString()} units (${pct(unitsIncluded, brand.totalUnits)} of system) — moderate sample, check whether top performers are over-represented.`;
  } else {
    sampleQuality = "weak";
    sampleNote = `Only ${unitsIncluded.toLocaleString()} units (${pct(unitsIncluded, brand.totalUnits)} of system) — small sample. Average may not reflect typical unit performance.`;
  }

  // Distribution skew
  let skewNote = "";
  if (i19.grossRevenueMedian && i19.grossRevenueMedian > 0) {
    const skewRatio = i19.grossRevenueAvg / i19.grossRevenueMedian;
    citations.push("Item 19 — median/average comparison");
    if (skewRatio > 1.15) {
      skewNote = ` The average (${formatCurrency(i19.grossRevenueAvg)}) is ${Math.round((skewRatio - 1) * 100)}% above the median (${formatCurrency(i19.grossRevenueMedian)}), which suggests top performers are pulling the average up. The median is the more reliable benchmark for a typical new unit.`;
    } else if (skewRatio < 0.87) {
      skewNote = ` The average (${formatCurrency(i19.grossRevenueAvg)}) is below the median (${formatCurrency(i19.grossRevenueMedian)}), which is unusual and may indicate a few very low-revenue units dragging the average down.`;
    } else {
      skewNote = ` Average (${formatCurrency(i19.grossRevenueAvg)}) and median (${formatCurrency(i19.grossRevenueMedian)}) are close — the distribution appears relatively even.`;
    }
  }

  // Implied ROI
  let impliedRoiYears: number | null = null;
  let roiNote = "";
  const investMid = (brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2;
  if (investMid > 0 && i19.grossRevenueAvg > 0) {
    // Investment-to-revenue ratio only (no assumed margins — FDD-reported facts only)
    const investToRevRatio = Math.round((investMid / i19.grossRevenueAvg) * 100) / 100;
    roiNote = ` Investment-to-disclosed-revenue ratio: ${investToRevRatio}x (${formatCurrency(investMid)} midpoint investment vs ${formatCurrency(i19.grossRevenueAvg)} avg revenue).`;
  }

  const headline = `Item 19 discloses avg revenue of ${formatCurrency(i19.grossRevenueAvg)}${i19.timePeriod ? ` (${i19.timePeriod})` : ""}.`;
  const detail = `${sampleNote}${skewNote}${roiNote}`;

  return { headline, detail, sampleQuality, impliedRoiYears, citations };
}

// ── Item 20 analysis ───────────────────────────────────────────────────────

function analyzeItem20(brand: FranchiseBrand): DiligenceMemo["item20Analysis"] {
  const ue = brand.unitEconomics;
  const citations = [`Item 20 — ${brand.fddYear} FDD`];

  const netGrowth = ue.netGrowth;
  const turnover = ue.turnoverRate;
  const closed = ue.unitsClosed;
  const total = brand.totalUnits;

  let trend: DiligenceMemo["item20Analysis"]["trend"] = "unknown";
  let headline = "";
  let detail = "";

  if (netGrowth > 10) {
    trend = "growing";
    headline = `System growing — net +${netGrowth} units in reporting period.`;
    detail = `Strong expansion: ${ue.unitsOpened ?? 0} opened vs ${closed} closed/transferred. `;
  } else if (netGrowth > 0) {
    trend = "stable";
    headline = `Modest growth — net +${netGrowth} units.`;
    detail = `System is expanding slowly. `;
  } else if (netGrowth === 0 || (netGrowth >= -5 && netGrowth <= 0)) {
    trend = "stable";
    headline = `System flat — net ${netGrowth} units in reporting period.`;
    detail = `Unit count essentially unchanged. `;
  } else {
    trend = "contracting";
    headline = `System contracting — net ${netGrowth} units in reporting period.`;
    detail = `${Math.abs(netGrowth)} more units closed or left the system than opened. `;
  }

  // Turnover / closure commentary
  if (turnover > 0) {
    if (turnover >= 20) {
      detail += `Closure/transfer rate of ${turnover}% is high — industry benchmark is typically 5–10%. This warrants investigation into why franchisees are exiting.`;
    } else if (turnover >= 10) {
      detail += `Closure/transfer rate of ${turnover}% is above average. Ask the franchisor for reasons behind exits.`;
    } else {
      detail += `Closure/transfer rate of ${turnover}% is within normal range.`;
    }
  } else if (closed > 0) {
    const closurePct = total > 0 ? Math.round((closed / total) * 100) : 0;
    detail += `${closed} units closed (${closurePct}% of system).`;
  }

  return { trend, headline, detail, citations };
}

// ── Auto-generated flags ───────────────────────────────────────────────────

function buildAutoFlags(brand: FranchiseBrand): DiligenceFlag[] {
  const flags: DiligenceFlag[] = [];

  // Item 19 — missing is NOT a critical flag; it's an info/coverage issue
  if (!brand.hasItem19 || !brand.item19?.grossRevenueAvg) {
    flags.push({
      severity: "warning",
      item: "Item 19",
      title: "Economics not rated",
      detail: brand.hasItem19 === false
        ? "Franchisor chose not to include a Financial Performance Representation. Item 19 is voluntary per FTC rules. This is not automatically a negative signal — it means economics cannot be scored from the disclosure."
        : "Item 19 revenue data has not yet been normalized from covered-source filings. Economics score is unavailable.",
    });
  } else {
    const i19 = brand.item19!;
    const samplePct = brand.totalUnits > 0 && i19.unitsIncluded
      ? i19.unitsIncluded / brand.totalUnits
      : null;
    if (samplePct !== null && samplePct < 0.3 && i19.unitsIncluded! > 0) {
      flags.push({
        severity: "warning",
        item: "Item 19",
        title: "Small sample in revenue disclosure",
        detail: `Only ${pct(i19.unitsIncluded!, brand.totalUnits)} of units are represented. Revenue figure may not reflect typical performance.`,
      });
    }
    if (i19.grossRevenueMedian && i19.grossRevenueAvg && i19.grossRevenueAvg / i19.grossRevenueMedian > 1.2) {
      flags.push({
        severity: "warning",
        item: "Item 19",
        title: "Average revenue skewed above median",
        detail: `Average (${formatCurrency(i19.grossRevenueAvg!)}) is ${Math.round((i19.grossRevenueAvg! / i19.grossRevenueMedian - 1) * 100)}% above median (${formatCurrency(i19.grossRevenueMedian)}). Top performers may be pulling the headline number up.`,
      });
    } else if (brand.hasItem19 && i19.grossRevenueAvg) {
      flags.push({
        severity: "positive",
        item: "Item 19",
        title: "Revenue disclosed in FDD",
        detail: `Avg ${formatCurrency(i19.grossRevenueAvg)} from government-filed FDD. Transparent disclosure is a positive signal.`,
      });
    }
  }

  // Item 20 — unit contraction
  if (brand.unitEconomics.netGrowth < -10) {
    flags.push({
      severity: "critical",
      item: "Item 20",
      title: "System shrinking significantly",
      detail: `Net unit loss of ${brand.unitEconomics.netGrowth} in reporting period. Declining networks may signal franchisee dissatisfaction or weak economics.`,
    });
  } else if (brand.unitEconomics.netGrowth < 0) {
    flags.push({
      severity: "warning",
      item: "Item 20",
      title: "System lost net units",
      detail: `Net unit loss of ${brand.unitEconomics.netGrowth}. Monitor whether this is a one-year anomaly or a trend.`,
    });
  }
  if (brand.unitEconomics.turnoverRate >= 20) {
    flags.push({
      severity: "critical",
      item: "Item 20",
      title: `High unit turnover — ${brand.unitEconomics.turnoverRate}%`,
      detail: "More than 1 in 5 units closed or transferred. Industry benchmark is typically 5–10%. Request Item 20 detail for prior years.",
    });
  } else if (brand.unitEconomics.turnoverRate >= 10) {
    flags.push({
      severity: "warning",
      item: "Item 20",
      title: `Above-average unit turnover — ${brand.unitEconomics.turnoverRate}%`,
      detail: "Turnover exceeds the typical 5–10% range. Ask for reasons behind exits.",
    });
  }

  // Item 4 — bankruptcy
  if (brand.item4?.hasBankruptcy) {
    flags.push({
      severity: "critical",
      item: "Item 4",
      title: `Bankruptcy disclosed — ${(brand.item4.bankruptcyType ?? "unknown type").replace("_", " ")}`,
      detail: `The franchisor or a principal disclosed a prior bankruptcy. Read the full Item 4 narrative for context and timing.`,
    });
  }

  // Item 3 — litigation
  const lit = brand.litigation;
  if (lit.activeLawsuits >= 10) {
    flags.push({
      severity: "critical",
      item: "Item 3",
      title: `High litigation volume — ${lit.activeLawsuits} active cases`,
      detail: "Double-digit active lawsuits is unusual. Review whether franchisee-initiated cases dominate (signals system dissatisfaction) vs regulatory actions.",
    });
  } else if (lit.activeLawsuits >= 3) {
    flags.push({
      severity: "warning",
      item: "Item 3",
      title: `Active litigation — ${lit.activeLawsuits} cases`,
      detail: "Review Item 3 narrative for claim types. Franchisee-vs-franchisor suits are a stronger red flag than third-party disputes.",
    });
  }
  if (lit.trend === "increasing") {
    flags.push({
      severity: "warning",
      item: "Item 3",
      title: "Litigation trend increasing",
      detail: "Litigation is growing year over year. Request prior FDD filings to see the trajectory.",
    });
  }

  // Item 17 — unfavorable contract terms
  if (brand.item17?.mandatoryArbitration) {
    flags.push({
      severity: "warning",
      item: "Item 17",
      title: "Mandatory arbitration required",
      detail: "You waive the right to sue in court. Arbitration typically favors the franchisor. Review the venue and arbitrator selection process.",
    });
  }
  if (brand.item17?.hasNonCompete) {
    const ncYears = brand.item17.nonCompeteYears ?? "?";
    const ncMiles = brand.item17.nonCompeteMiles ?? "?";
    flags.push({
      severity: "warning",
      item: "Item 17",
      title: `Post-term non-compete — ${ncYears}yr / ${ncMiles}mi`,
      detail: "After leaving the franchise, you cannot operate a competing business in this radius. Evaluate the real-world impact on your exit options.",
    });
  }
  if (brand.item12?.exclusiveTerritory === false) {
    flags.push({
      severity: "warning",
      item: "Item 12",
      title: "No exclusive territory",
      detail: "Franchisor is not obligated to protect your market area. Encroachment from company-owned units or other franchisees is possible.",
    });
  }
  if (brand.item12?.franchisorMayCompete) {
    flags.push({
      severity: "warning",
      item: "Item 12",
      title: "Franchisor may compete in your territory",
      detail: "The FDD explicitly reserves the franchisor's right to operate competing channels (e.g. online, other brands) within your market.",
    });
  }

  // Item 21 — going concern
  if (brand.item21?.goingConcernWarning) {
    flags.push({
      severity: "critical",
      item: "Item 21",
      title: "Going concern warning in audit",
      detail: "Auditors raised doubt about the franchisor's ability to continue as a going concern. This is a serious financial red flag — the franchisor may not be able to support the system.",
    });
  }

  // Item 2 — management quality
  if (brand.managementData && (brand.managementData.extractionConfidence ?? "low") !== "low") {
    const mgmt = brand.managementData;
    if (mgmt.hasLeadershipChanges) {
      flags.push({
        severity: "warning",
        item: "Item 2",
        title: "Recent leadership changes detected",
        detail: "Item 2 shows multiple executives hired within 2 years of this FDD filing. Leadership instability can affect franchisee support quality during transitions.",
      });
    }
    if (mgmt.hasFranchiseExp) {
      flags.push({
        severity: "positive",
        item: "Item 2",
        title: "Management has franchise system experience",
        detail: "At least one key executive has disclosed prior franchise system experience — associated with better franchisee support and system discipline.",
      });
    }
    if ((mgmt.execCount ?? 0) <= 1) {
      flags.push({
        severity: "warning",
        item: "Item 2",
        title: "Thin executive team (key-person risk)",
        detail: "Only one senior executive role identified in Item 2. If a key person departs, franchisee support and leadership continuity may be at risk.",
      });
    }
  }

  // Positive signals
  if (brand.item12?.exclusiveTerritory === true) {
    flags.push({
      severity: "positive",
      item: "Item 12",
      title: "Exclusive territory granted",
      detail: "The franchise agreement grants a protected territory. Encroachment risk is contractually limited.",
    });
  }
  if (brand.item21?.hasAuditedFinancials && !brand.item21?.goingConcernWarning) {
    flags.push({
      severity: "positive",
      item: "Item 21",
      title: "Audited financials — no going concern",
      detail: `Franchisor financial statements are audited${brand.item21.auditorName ? ` by ${brand.item21.auditorName}` : ""} with no going concern warning.`,
    });
  }

  // Sort: critical first, then warning, then positive; limit to 8
  const order = { critical: 0, warning: 1, positive: 2 };
  return flags.sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 8);
}

// ── Contract highlights ────────────────────────────────────────────────────

function buildContractHighlights(brand: FranchiseBrand): DiligenceMemo["contractHighlights"] {
  const rows: DiligenceMemo["contractHighlights"] = [];
  const i17 = brand.item17;

  rows.push({ label: "Initial Term", value: yrs(i17?.initialTermYears), flag: false });

  if (i17?.renewalCount != null && i17.renewalTermYears != null) {
    rows.push({
      label: "Renewals",
      value: `${i17.renewalCount}× ${yrs(i17.renewalTermYears)}`,
      flag: false,
    });
  }

  rows.push({
    label: "Royalty Rate",
    value: brand.royaltyRate,
    flag: parseFloat(brand.royaltyRate) >= 8,
  });

  rows.push({
    label: "Marketing Fund",
    value: brand.marketingFundRate,
    flag: false,
  });

  rows.push({
    label: "Mandatory Arbitration",
    value: i17?.mandatoryArbitration ? "Yes" : i17 ? "No" : "—",
    flag: i17?.mandatoryArbitration === true,
  });

  rows.push({
    label: "Post-term Non-compete",
    value: i17?.hasNonCompete
      ? `${i17.nonCompeteYears ?? "?"}yr / ${i17.nonCompeteMiles ?? "?"}mi`
      : i17 ? "None" : "—",
    flag: i17?.hasNonCompete === true,
  });

  rows.push({
    label: "Exclusive Territory",
    value: brand.item12?.exclusiveTerritory === true
      ? "Yes"
      : brand.item12?.exclusiveTerritory === false
      ? "No"
      : "—",
    flag: brand.item12?.exclusiveTerritory === false,
  });

  return rows;
}

// ── Score rationale ────────────────────────────────────────────────────────

function buildScoreRationale(brand: FranchiseBrand, score: number): string {
  const parts: string[] = [];
  const s = brand.scores;

  if (s.financialTransparency >= 8) parts.push("high financial transparency");
  else if (s.financialTransparency <= 4) parts.push("low financial transparency");

  if (s.investmentValue >= 8) parts.push("strong investment value");
  else if (s.investmentValue <= 4) parts.push("weak investment-to-revenue ratio");

  if (s.unitGrowth >= 8) parts.push("strong unit growth");
  else if (s.unitGrowth <= 4) parts.push("declining unit count");

  if (s.franchiseeSupport >= 8) parts.push("strong franchisee support");
  if (s.territoryProtection >= 8) parts.push("strong territory protection");
  else if (s.territoryProtection <= 4) parts.push("limited territory protection");

  if (parts.length === 0) return "Composite score based on six FDD-derived dimensions.";
  return `Score of ${score}/10 driven by: ${parts.join(", ")}.`;
}

// ── YoY diff ───────────────────────────────────────────────────────────────

function buildYoYDiff(brand: FranchiseBrand): YoYDiff {
  // Revenue change — only if prior year data exists
  let revenueChange: YoYDiff["revenueChange"] = null;
  const prior = brand.item19Prior;
  const current = brand.item19?.grossRevenueAvg;
  if (prior?.grossRevenueAvg && current && prior.fddYear) {
    const changePct = Math.round(((current - prior.grossRevenueAvg) / prior.grossRevenueAvg) * 100);
    revenueChange = {
      priorYear: prior.fddYear,
      priorAvg: prior.grossRevenueAvg,
      currentAvg: current,
      changePct,
      direction: changePct > 2 ? "up" : changePct < -2 ? "down" : "flat",
    };
  }

  // Unit trajectory from Item 20
  const ue = brand.unitEconomics;
  let unitTrajectory: YoYDiff["unitTrajectory"] = null;
  if (ue.unitsStartOfPeriod > 0 || ue.unitsOpened > 0 || ue.unitsClosed > 0) {
    unitTrajectory = {
      opened: ue.unitsOpened,
      closed: ue.unitsClosed,
      net: ue.netGrowth,
      direction: ue.netGrowth > 5 ? "growing" : ue.netGrowth < -5 ? "shrinking" : "flat",
      turnoverRate: ue.turnoverRate,
    };
  }

  return {
    revenueChange,
    unitTrajectory,
    hasPriorData: !!revenueChange,
  };
}

// ── Composite FDD Scores ───────────────────────────────────────────────────
// Each score is 0-10, derived purely from verified FDD item data.
// Returns null for any dimension with insufficient data.

export function computeCompositeScores(brand: FranchiseBrand): CompositeFDDScores {
  return {
    systemHealth:       scoreSystemHealth(brand),
    franchisorStrength: scoreFranchisorStrength(brand),
    economicBurden:     scoreEconomicBurden(brand),
    supportVsTake:      scoreSupportVsTake(brand),
    contractFriction:   scoreContractFriction(brand),
    changeScore:        scoreChange(brand),
  };
}

/**
 * System Health (Item 20): net growth, churn, closures, reacquisition pressure, backlog.
 * 10 = fast growing, low churn. 0 = shrinking, high churn.
 */
function scoreSystemHealth(brand: FranchiseBrand): number | null {
  const ue = brand.unitEconomics;
  if (!ue.unitsStartOfPeriod && !ue.unitsOpened && !ue.unitsClosed) return null;

  let score = 5; // baseline

  // Net growth signal (+/- 2 pts)
  const totalUnits = Math.max(ue.unitsStartOfPeriod, brand.totalUnits, 1);
  const netPct = (ue.netGrowth / totalUnits) * 100;
  if (netPct >= 10) score += 2;
  else if (netPct >= 3) score += 1;
  else if (netPct < -3) score -= 1;
  else if (netPct < -8) score -= 2;

  // Turnover rate (+/- 2 pts)
  const turnover = ue.turnoverRate;
  if (turnover <= 3) score += 2;
  else if (turnover <= 7) score += 1;
  else if (turnover >= 15) score -= 2;
  else if (turnover >= 10) score -= 1;

  // Terminations / reacquisitions (Item 20 extended data, -1 each)
  if (ue.unitsTerminated && ue.unitsStartOfPeriod) {
    const termPct = (ue.unitsTerminated / ue.unitsStartOfPeriod) * 100;
    if (termPct >= 5) score -= 1;
  }
  if (ue.unitsReacquired && ue.unitsStartOfPeriod) {
    const reacqPct = (ue.unitsReacquired / ue.unitsStartOfPeriod) * 100;
    if (reacqPct >= 3) score -= 1;
  }

  // Signed-not-opened backlog (pipeline strength, +1)
  if (ue.signedNotOpened && ue.signedNotOpened > 10) score += 1;

  return Math.max(0, Math.min(10, Math.round(score)));
}

/**
 * Franchisor Strength (Items 21, 3, 4): financial quality, going concern,
 * auditor opinion, litigation severity, bankruptcy history.
 * 10 = clean financials, no red flags. 0 = multiple serious red flags.
 */
function scoreFranchisorStrength(brand: FranchiseBrand): number | null {
  const i21 = brand.item21;
  const i4  = brand.item4;
  if (!i21 && !i4) return null;

  let score = 6; // baseline: if they filed audited statements, start above midpoint

  if (i21) {
    // Audited financials available
    if (i21.hasAuditedFinancials) score += 1;

    // Going concern is a major red flag
    if (i21.goingConcernWarning) score -= 3;

    // Auditor opinion
    if (i21.auditorOpinion === "clean") score += 1;
    else if (i21.auditorOpinion === "qualified") score -= 1;
    else if (i21.auditorOpinion === "adverse" || i21.auditorOpinion === "disclaimer") score -= 3;

    // Financial strength signal (from extract_item21 if available)
    if (i21.financialStrengthSignal === "strong") score += 1;
    else if (i21.financialStrengthSignal === "watch") score -= 1;
    else if (i21.financialStrengthSignal === "weak") score -= 2;
  }

  // Bankruptcy history (Item 4)
  if (i4?.hasBankruptcy) {
    score -= i4.bankruptcyType === "chapter_7" ? 3 : 2;
  }

  // Litigation (Item 3): each active lawsuit is a deduction
  const activeLitigation = brand.litigation.activeLawsuits;
  if (activeLitigation >= 10) score -= 2;
  else if (activeLitigation >= 3) score -= 1;
  if (brand.litigation.trend === "increasing") score -= 1;

  return Math.max(0, Math.min(10, Math.round(score)));
}

/**
 * Economic Burden (Items 5-8): total ongoing fees relative to category norms.
 * 10 = lightest burden (low royalty, low ad fund, minimal fees).
 * 0 = heavy burden.
 */
function scoreEconomicBurden(brand: FranchiseBrand): number | null {
  // Needs at least a parseable royalty rate
  if (!brand.royaltyRate || brand.royaltyRate === "—") return null;

  let score = 7; // most franchises are in the normal range

  // Parse royalty percentage
  const royaltyMatch = brand.royaltyRate.match(/(\d+(?:\.\d+)?)\s*%/);
  if (royaltyMatch) {
    const pct = parseFloat(royaltyMatch[1]);
    if (pct <= 4) score += 2;
    else if (pct <= 6) score += 1;
    else if (pct >= 9) score -= 2;
    else if (pct >= 7) score -= 1;
  } else if (brand.royaltyStructure === "flat") {
    // Flat fee can be good or bad — neutral
  }

  // Marketing fund
  const adMatch = brand.marketingFundRate.match(/(\d+(?:\.\d+)?)\s*%/);
  if (adMatch) {
    const pct = parseFloat(adMatch[1]);
    if (pct <= 1) score += 1;
    else if (pct >= 3) score -= 1;
    else if (pct >= 4) score -= 2;
  }

  // Tech fee
  if (brand.technologyFee && brand.technologyFee > 1000) score -= 1;

  // Initial investment relative to implied revenue potential
  if (brand.item19?.grossRevenueAvg && brand.totalInvestmentHigh > 0) {
    const investmentToRevRatio = brand.totalInvestmentHigh / brand.item19.grossRevenueAvg;
    if (investmentToRevRatio <= 0.5) score += 1;  // fast payback potential
    else if (investmentToRevRatio >= 3) score -= 1; // very long payback
  }

  // Item 8 supplier lock-in (when extracted)
  const i8 = brand.item8;
  if (i8) {
    if (i8.lockInScore != null) {
      if (i8.lockInScore >= 8) score -= 2;       // heavily locked in
      else if (i8.lockInScore >= 6) score -= 1;
      else if (i8.lockInScore <= 3) score += 1;  // free sourcing
    }
    if (i8.franchisorReceivesSupplierRevenue) score -= 1; // hidden margin from purchases
  }

  return Math.max(0, Math.min(10, Math.round(score)));
}

/**
 * Support vs Take (Item 11 + fee burden): how much support vs how much franchisor takes.
 * 10 = strong support, light fees. 0 = poor support, heavy fees.
 */
function scoreSupportVsTake(brand: FranchiseBrand): number | null {
  const i11 = brand.item11;
  if (!i11) return null;

  let score = 5;

  // Training depth
  const totalHours = (i11.classroomHours ?? 0) + (i11.ojtHours ?? 0);
  if (totalHours >= 200) score += 2;
  else if (totalHours >= 100) score += 1;
  else if (totalHours > 0 && totalHours < 40) score -= 1;

  if (i11.hasFieldSupport) score += 1;
  if (i11.hasAnnualConference) score += 0.5;
  if (i11.hasOngoingTraining) score += 0.5;

  // Management quality from Item 2 (max ±1.5 adjustment)
  const mgmt = brand.managementData;
  if (mgmt && mgmt.extractionConfidence !== "low") {
    if (mgmt.hasFranchiseExp) score += 1;
    if (mgmt.hasStableLeadership) score += 0.5;
    if (mgmt.hasLeadershipChanges) score -= 0.5;
    if ((mgmt.execCount ?? 0) <= 1) score -= 0.5;
  }

  // Adjust for royalty/fee burden (high take reduces the value of support)
  const royaltyMatch = brand.royaltyRate.match(/(\d+(?:\.\d+)?)\s*%/);
  if (royaltyMatch) {
    const pct = parseFloat(royaltyMatch[1]);
    if (pct >= 8) score -= 1;
    else if (pct >= 6) score -= 0.5;
  }

  return Math.max(0, Math.min(10, Math.round(score)));
}

/**
 * Contract Friction (Item 17): renewal, transfer, termination, non-compete, arbitration.
 * 10 = franchisee-friendly. 0 = heavily one-sided.
 */
function scoreContractFriction(brand: FranchiseBrand): number | null {
  const i17 = brand.item17;
  if (!i17) return null;

  let score = 6; // most FDD contracts are somewhat franchisor-favorable; start above midpoint

  // Term length: longer initial term = franchisee-friendly
  if (i17.initialTermYears && i17.initialTermYears >= 10) score += 1;
  else if (i17.initialTermYears && i17.initialTermYears <= 5) score -= 1;

  // Renewal rights
  if (i17.renewalCount && i17.renewalCount >= 2) score += 1;

  // Transfer fee (numeric — lower is better)
  if (typeof i17.transferFee === "number") {
    if (i17.transferFee <= 0) score += 1;
    else if (i17.transferFee >= 25000) score -= 1;
  }

  // Cure period (days to fix a default before termination)
  if (i17.curePeriodDays && i17.curePeriodDays >= 30) score += 1;
  else if (i17.curePeriodDays !== undefined && i17.curePeriodDays < 10) score -= 1;

  // Non-compete terms (post-termination)
  if (i17.hasNonCompete) {
    if ((i17.nonCompeteYears ?? 0) >= 3) score -= 2;
    else if ((i17.nonCompeteYears ?? 0) >= 2) score -= 1;
  }

  // Mandatory arbitration can limit franchisee rights
  if (i17.mandatoryArbitration) score -= 1;

  return Math.max(0, Math.min(10, Math.round(score)));
}

/**
 * Change Score: year-over-year delta across key indicators.
 * Positive = improving. Negative = deteriorating.
 * Range: -10 to +10.
 */
function scoreChange(brand: FranchiseBrand): number | null {
  if (!brand.item19Prior?.grossRevenueAvg && !brand.unitEconomics.yearlyNetGrowth) return null;

  let score = 0;

  // Revenue trend
  const prior = brand.item19Prior;
  const current = brand.item19?.grossRevenueAvg;
  if (prior?.grossRevenueAvg && current && prior.fddYear) {
    const changePct = ((current - prior.grossRevenueAvg) / prior.grossRevenueAvg) * 100;
    if (changePct >= 10) score += 3;
    else if (changePct >= 3) score += 1;
    else if (changePct < -10) score -= 3;
    else if (changePct < -3) score -= 1;
  }

  // Unit growth trend (from yearlyNetGrowth if available)
  const yearly = brand.unitEconomics.yearlyNetGrowth;
  if (yearly && yearly.length >= 2) {
    const recent  = yearly[yearly.length - 1].net;
    const previous = yearly[yearly.length - 2].net;
    if (recent > previous + 5) score += 2;
    else if (recent > previous) score += 1;
    else if (recent < previous - 5) score -= 2;
    else if (recent < previous) score -= 1;
  }

  return Math.max(-10, Math.min(10, score));
}

// ── Main export ────────────────────────────────────────────────────────────

export function generateMemo(brand: FranchiseBrand): DiligenceMemo {
  const score = computeProductionScores(brand).coreDiligence ?? 0;
  const investMid = (brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2;

  let breakevenNote: string | null = null;
  if (brand.item19?.grossRevenueAvg && investMid > 0) {
    const investToRevRatio = (investMid / brand.item19.grossRevenueAvg).toFixed(2);
    breakevenNote = `Investment-to-disclosed-revenue ratio: ${investToRevRatio}x. This is the ratio of midpoint investment (${formatCurrency(investMid)}) to disclosed avg revenue (${formatCurrency(brand.item19.grossRevenueAvg)}). No profit assumptions are applied.`;
  }

  return {
    brand: brand.name,
    slug: brand.slug,
    fddYear: brand.fddYear,
    dataSource: brand.dataSource,
    generatedDate: new Date().toISOString().split("T")[0],

    investmentSummary: `Total investment range: ${formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}. Initial fee: ${formatCurrency(brand.initialFranchiseFee)}. Royalty: ${brand.royaltyRate}. Marketing fund: ${brand.marketingFundRate}.`,
    investmentBreakeven: breakevenNote,

    item19Analysis: analyzeItem19(brand),
    item20Analysis: analyzeItem20(brand),
    yoyDiff: buildYoYDiff(brand),
    contractHighlights: buildContractHighlights(brand),
    autoFlags: buildAutoFlags(brand),
    overallScore: score,
    scoreRationale: buildScoreRationale(brand, score),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 1 — COHORT BENCHMARKING
// Peer percentile rank for key metrics within category + investment tier.
// All numbers come from FDD-extracted data in brands.ts; no estimates.
// ═══════════════════════════════════════════════════════════════════════════

export interface CohortBenchmark {
  metric: string;
  value: number | null;
  unit: string;
  percentile: number | null;      // 0-100; null if too few peers
  peerCount: number;
  peerLabel: string;              // e.g. "food franchises with Item 19"
  direction: "higher_is_better" | "lower_is_better";
  verdict: "top_quartile" | "above_avg" | "average" | "below_avg" | "bottom_quartile" | "no_data";
}

export interface CohortBenchmarks {
  category: string;
  investmentTier: string;
  benchmarks: CohortBenchmark[];
}

function verdictFromPercentile(
  p: number | null,
  dir: "higher_is_better" | "lower_is_better"
): CohortBenchmark["verdict"] {
  if (p === null) return "no_data";
  // For lower_is_better, invert so "top quartile" = lowest 25%
  const effective = dir === "lower_is_better" ? 100 - p : p;
  if (effective >= 75) return "top_quartile";
  if (effective >= 55) return "above_avg";
  if (effective >= 45) return "average";
  if (effective >= 25) return "below_avg";
  return "bottom_quartile";
}

function percentileRank(value: number, allValues: number[]): number {
  const below = allValues.filter((v) => v < value).length;
  return Math.round((below / allValues.length) * 100);
}

export function computeCohortBenchmarks(
  allBrands: FranchiseBrand[],
  brand: FranchiseBrand
): CohortBenchmarks {
  const cat = brand.category;
  const investMid = (brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2;

  // Investment tier ($0-150K low / $150K-500K mid / $500K+ high)
  const tier =
    investMid < 150_000 ? "low" :
    investMid < 500_000 ? "mid" : "high";

  const tierLabel =
    tier === "low" ? "under $150K" :
    tier === "mid" ? "$150K–$500K" : "over $500K";

  // Peer groups
  const catPeers = allBrands.filter((b) => b.category === cat && b.slug !== brand.slug);
  const tierPeers = catPeers.filter((b) => {
    const m = (b.totalInvestmentLow + b.totalInvestmentHigh) / 2;
    if (tier === "low")  return m < 150_000;
    if (tier === "mid")  return m >= 150_000 && m < 500_000;
    return m >= 500_000;
  });

  function buildBenchmark(
    metric: string,
    value: number | null,
    unit: string,
    peers: FranchiseBrand[],
    peerLabel: string,
    getter: (b: FranchiseBrand) => number | null | undefined,
    dir: "higher_is_better" | "lower_is_better"
  ): CohortBenchmark {
    const peerVals = peers.map(getter).filter((v): v is number => v != null && isFinite(v) && v > 0);
    if (value == null || peerVals.length < 5) {
      return { metric, value, unit, percentile: null, peerCount: peerVals.length, peerLabel, direction: dir, verdict: "no_data" };
    }
    const p = percentileRank(value, peerVals);
    return { metric, value, unit, percentile: p, peerCount: peerVals.length, peerLabel, direction: dir, verdict: verdictFromPercentile(p, dir) };
  }

  const benchmarks: CohortBenchmark[] = [];

  // 1. Avg revenue vs category peers with Item 19
  const revPeers = catPeers.filter((b) => b.hasItem19 && b.item19?.grossRevenueAvg);
  benchmarks.push(buildBenchmark(
    "Avg Revenue (Item 19)",
    brand.item19?.grossRevenueAvg ?? null,
    "$",
    revPeers,
    `${cat} franchises with Item 19`,
    (b) => b.item19?.grossRevenueAvg,
    "higher_is_better"
  ));

  // 2. Initial franchise fee vs category peers
  benchmarks.push(buildBenchmark(
    "Initial Franchise Fee",
    brand.initialFranchiseFee || null,
    "$",
    catPeers.filter((b) => b.initialFranchiseFee > 0),
    `${cat} franchises`,
    (b) => b.initialFranchiseFee || null,
    "lower_is_better"
  ));

  // 3. Royalty rate vs category peers
  const parseRoyalty = (b: FranchiseBrand): number | null => {
    const m = b.royaltyRate.match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) : null;
  };
  const brandRoyalty = parseRoyalty(brand);
  benchmarks.push(buildBenchmark(
    "Royalty Rate",
    brandRoyalty,
    "%",
    catPeers.filter((b) => parseRoyalty(b) != null),
    `${cat} franchises`,
    parseRoyalty,
    "lower_is_better"
  ));

  // 4. Turnover rate vs category peers with Item 20
  const turnPeers = catPeers.filter((b) => b.unitEconomics.turnoverRate > 0);
  benchmarks.push(buildBenchmark(
    "Annual Unit Turnover",
    brand.unitEconomics.turnoverRate || null,
    "%",
    turnPeers,
    `${cat} franchises with Item 20`,
    (b) => b.unitEconomics.turnoverRate || null,
    "lower_is_better"
  ));

  // 5. Net unit growth vs tier peers with Item 20
  const growthTierPeers = tierPeers.filter((b) => b.unitEconomics.unitsStartOfPeriod > 0);
  benchmarks.push(buildBenchmark(
    "Net Unit Growth",
    brand.unitEconomics.netGrowth || null,
    "units",
    growthTierPeers,
    `${cat} franchises (${tierLabel} investment)`,
    (b) => b.unitEconomics.netGrowth,
    "higher_is_better"
  ));

  // 6. Investment midpoint vs category + tier
  benchmarks.push(buildBenchmark(
    "Total Investment (midpoint)",
    investMid || null,
    "$",
    tierPeers,
    `${cat} franchises (${tierLabel} investment)`,
    (b) => (b.totalInvestmentLow + b.totalInvestmentHigh) / 2 || null,
    "lower_is_better"
  ));

  return {
    category: cat,
    investmentTier: tierLabel,
    benchmarks,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 2 — DOWNSIDE-CASE ECONOMICS (3 SCENARIOS)
// Uses actual disclosed Item 19 figures + real fee structure.
// Labeled clearly as editorial projection — not FDD data.
// ═══════════════════════════════════════════════════════════════════════════

export interface EconomicsScenario {
  label: "optimistic" | "base" | "downside";
  revenueMultiplier: number;         // applied to Item 19 avg
  grossRevenue: number;
  royaltyDollars: number;
  adFundDollars: number;
  estimatedCOGS: number;
  estimatedLabor: number;
  estimatedOccupancy: number;
  otherOperating: number;
  /** Illustrative model output — NOT FDD-reported. Label as assumption-based. */
  illustrativeOperatingIncome: number;
  illustrativeMarginPct: number;
  paybackYears: number | null;       // vs total investment midpoint
  note: string;
}

export interface DownsideEconomics {
  hasItem19: boolean;
  revenueSource: string;
  scenarios: EconomicsScenario[];
  /** Key caveats to show below the table */
  caveats: string[];
}

export function computeDownsideEconomics(brand: FranchiseBrand): DownsideEconomics {
  const avgRev = brand.item19?.grossRevenueAvg;
  const investMid = (brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2;

  const caveats: string[] = [
    "All scenarios are editorial projections based on FDD-disclosed fees and industry cost benchmarks.",
    "Cost percentages are approximate; your actual results will vary based on location, staffing, and operations.",
    "These are NOT guarantees of performance — no franchisor can guarantee revenue.",
  ];

  if (!avgRev || !brand.hasItem19) {
    return {
      hasItem19: false,
      revenueSource: "No Item 19 — revenue not disclosed in FDD",
      scenarios: [],
      caveats: [
        "This franchisor did not include an Item 19 Financial Performance Representation.",
        "Without disclosed revenue data, scenario modeling cannot be based on actual FDD figures.",
        ...caveats,
      ],
    };
  }

  // Parse royalty %
  const royaltyPct = (() => {
    const m = brand.royaltyRate.match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) / 100 : 0.06;
  })();
  const adPct = (() => {
    const m = brand.marketingFundRate.match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) / 100 : 0.02;
  })();

  // COGS/labor/occupancy estimates by category
  const catCosts: Record<string, { cogs: number; labor: number; occupancy: number }> = {
    food: { cogs: 0.30, labor: 0.28, occupancy: 0.08 },
    fitness: { cogs: 0.05, labor: 0.35, occupancy: 0.12 },
    home_services: { cogs: 0.20, labor: 0.40, occupancy: 0.03 },
    automotive: { cogs: 0.35, labor: 0.25, occupancy: 0.07 },
    education: { cogs: 0.10, labor: 0.42, occupancy: 0.10 },
    health: { cogs: 0.15, labor: 0.38, occupancy: 0.12 },
    retail: { cogs: 0.40, labor: 0.20, occupancy: 0.10 },
    services: { cogs: 0.10, labor: 0.35, occupancy: 0.06 },
  };
  const costs = catCosts[brand.category as string] ?? { cogs: 0.25, labor: 0.32, occupancy: 0.08 };
  const otherPct = 0.04; // misc operating

  function buildScenario(
    label: EconomicsScenario["label"],
    multiplier: number,
    note: string
  ): EconomicsScenario {
    const rev = Math.round(avgRev! * multiplier);
    const royalty = Math.round(rev * royaltyPct);
    const adFund = Math.round(rev * adPct);
    const cogs = Math.round(rev * costs.cogs);
    const labor = Math.round(rev * costs.labor);
    const occupancy = Math.round(rev * costs.occupancy);
    const other = Math.round(rev * otherPct);
    const illustrative = rev - royalty - adFund - cogs - labor - occupancy - other;
    const illustrativeMargin = rev > 0 ? Math.round((illustrative / rev) * 100 * 10) / 10 : 0;
    const payback = investMid > 0 && illustrative > 0 ? Math.round((investMid / illustrative) * 10) / 10 : null;
    return {
      label, revenueMultiplier: multiplier,
      grossRevenue: rev, royaltyDollars: royalty, adFundDollars: adFund,
      estimatedCOGS: cogs, estimatedLabor: labor, estimatedOccupancy: occupancy,
      otherOperating: other, illustrativeOperatingIncome: illustrative, illustrativeMarginPct: illustrativeMargin,
      paybackYears: payback, note,
    };
  }

  const revenueType = brand.item19?.revenueType ?? "unknown";
  const basis = brand.item19?.basis ?? "all_units";
  const basisLabel = basis === "open_over_1yr" ? "franchises open >1 year" : "all units";
  const revSource = `${formatCurrency(avgRev)} avg ${revenueType === "net" ? "net" : "gross"} revenue from ${basisLabel} (Item 19, ${brand.fddYear} FDD)`;

  caveats.unshift("ILLUSTRATIVE MODEL ONLY — not FDD-reported results. Uses category-benchmark cost assumptions, not actual unit-level expenses.");
  if (brand.item19?.revenueType === "gross") {
    caveats.unshift("Item 19 discloses gross revenue. Illustrative model subtracts assumed costs (royalty, ad fund, COGS, labor, occupancy). These expense percentages are category benchmarks, not FDD data.");
  } else if (brand.item19?.revenueType === "net") {
    caveats.unshift("Item 19 discloses net revenue — COGS deduction may not apply. Illustrative model may overstate expense deductions.");
  }

  return {
    hasItem19: true,
    revenueSource: revSource,
    scenarios: [
      buildScenario("optimistic", 1.20, `120% of disclosed avg — top-quartile performer`),
      buildScenario("base",       1.00, `100% of disclosed avg — as reported in FDD`),
      buildScenario("downside",   0.70, `70% of disclosed avg — below-median outcome`),
    ],
    caveats,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 3 — ITEM 19 COMPARABILITY FLAGS
// Lists specific caveats that limit comparability of this brand's Item 19.
// Based on normalized metadata: basis, revenue type, sample size, year.
// ═══════════════════════════════════════════════════════════════════════════

export interface Item19ComparabilityFlag {
  severity: "warning" | "info" | "ok";
  label: string;
  detail: string;
}

export function getItem19ComparabilityFlags(brand: FranchiseBrand): Item19ComparabilityFlag[] {
  const flags: Item19ComparabilityFlag[] = [];
  const i19 = brand.item19;

  if (brand.hasItem19 === false) {
    return [{ severity: "warning", label: "No Item 19", detail: "This franchisor did not include a Financial Performance Representation in their FDD. Item 19 is voluntary per FTC rules — absence does not indicate poor economics." }];
  }
  if (!i19?.grossRevenueAvg) {
    return [{ severity: "info", label: "Item 19 Filed — Figures Not Available", detail: "This franchisor filed an Item 19, but the figures are not currently in our database. This flag reflects a data coverage gap, not a judgment on the disclosure." }];
  }

  // 1. Revenue type (expanded taxonomy)
  const rt = normalizeRevenueType(i19.revenueType);
  switch (rt) {
    case "gross_sales":
      flags.push({ severity: "ok", label: "Gross sales", detail: "Figure represents gross sales — standard basis for cross-brand comparison." });
      break;
    case "net_sales":
      flags.push({ severity: "info", label: "Net sales (not gross)", detail: "This Item 19 reports net sales (after returns/discounts). Gross sales figures from other brands will appear higher — not directly comparable." });
      break;
    case "gross_profit":
      flags.push({ severity: "info", label: "Gross profit reported", detail: "Item 19 reports gross profit (revenue minus COGS). This is a profit metric, not top-line sales. Not comparable to brands reporting gross sales." });
      break;
    case "ebitda":
      flags.push({ severity: "info", label: "EBITDA reported", detail: "Item 19 reports EBITDA. This is a profit-like metric. Not comparable to brands reporting gross sales." });
      break;
    case "operating_income":
      flags.push({ severity: "info", label: "Operating income reported", detail: "Item 19 reports operating income. Not comparable to brands reporting gross sales." });
      break;
    case "net_income":
      flags.push({ severity: "info", label: "Net income reported", detail: "Item 19 reports net income (bottom-line profit). Not comparable to brands reporting gross sales." });
      break;
    case "cash_flow":
      flags.push({ severity: "info", label: "Cash flow reported", detail: "Item 19 reports cash flow from operations. Not comparable to brands reporting gross sales." });
      break;
    default:
      flags.push({ severity: "warning", label: "Revenue type unclear", detail: "The FDD does not clearly specify whether figures are gross sales, net sales, or a profit metric. This limits comparability." });
  }

  // 2. Expense coverage
  const ec = i19.expenseCoverage ?? "none";
  if (ec === "full_pnl") {
    flags.push({ severity: "ok", label: "Full P&L disclosed", detail: "Item 19 includes a full income statement or profit/loss breakdown for the disclosed cohort." });
  } else if (ec === "partial_opex") {
    flags.push({ severity: "info", label: "Partial expenses disclosed", detail: "Some operating expenses are disclosed but not a complete P&L. Profit figures should be interpreted with caution." });
  } else if (ec === "franchisor_fees_only") {
    flags.push({ severity: "info", label: "Franchisor fees only", detail: "Only franchise fees (royalty, ad fund) are disclosed. Labor, COGS, rent, and other operating costs are not included — profit cannot be determined from this disclosure." });
  } else {
    flags.push({ severity: "info", label: "Profit not disclosed", detail: "Item 19 reports revenue only. No expense breakdown is provided. Profit cannot be determined from this disclosure alone." });
  }

  // 3. Same cohort
  if (i19.sameCohort === false) {
    flags.push({ severity: "warning", label: "Revenue and costs from different populations", detail: "The revenue and expense figures in this Item 19 may not refer to the same outlets or time period, which limits the accuracy of any derived calculations." });
  }

  // 4. Sample basis
  if (i19.basis === "subset" || i19.basis === "geographic") {
    flags.push({ severity: "warning", label: "Subset of units reported", detail: `Item 19 samples may be limited to defined subsets (${i19.basis === "geographic" ? "geographic subset" : "subset meeting stated criteria"}), which affects comparability.` });
  } else if (i19.basis === "open_over_1yr") {
    flags.push({ severity: "info", label: "Excludes ramp-up units", detail: "Includes only units open longer than 1 year — which excludes the below-average ramp-up period. Actual first-year revenue is typically lower." });
  } else {
    flags.push({ severity: "ok", label: "All units included", detail: "Revenue figure includes all reporting units — broadest, most conservative sample basis." });
  }

  // 5. Sample size
  const included = i19.unitsIncluded ?? 0;
  const eligible = i19.totalEligibleUnits ?? brand.totalUnits;
  if (included > 0 && eligible > 0) {
    const coverage = included / eligible;
    if (coverage < 0.5) {
      flags.push({ severity: "warning", label: `Small sample (${included} of ${eligible} units)`, detail: `Only ${Math.round(coverage * 100)}% of eligible units are represented. Average may not reflect typical unit performance.` });
    } else if (coverage >= 0.8) {
      flags.push({ severity: "ok", label: `Strong sample (${included} of ${eligible} units)`, detail: `${Math.round(coverage * 100)}% of eligible units included — highly representative.` });
    } else {
      flags.push({ severity: "info", label: `Moderate sample (${included} of ${eligible} units)`, detail: `${Math.round(coverage * 100)}% of eligible units included — adequate but check whether top performers are over-represented.` });
    }
  } else if (included === 0) {
    flags.push({ severity: "warning", label: "Sample size not specified", detail: "The FDD does not state how many units contributed to this figure." });
  }

  // 6. Data freshness
  const measureYear = i19.measurementYear ?? brand.fddYear;
  const currentYear = 2026;
  const age = currentYear - measureYear;
  if (age >= 3) {
    flags.push({ severity: "warning", label: `Data is ${age} years old`, detail: `Revenue figures cover ${measureYear} operations — may not reflect current market conditions.` });
  } else if (age === 2) {
    flags.push({ severity: "info", label: `Data from ${measureYear}`, detail: `Revenue covers ${measureYear} — 2 years old. Reasonably current but worth confirming recent trends with existing franchisees.` });
  } else {
    flags.push({ severity: "ok", label: `Current data (${measureYear})`, detail: `Revenue figures are from ${measureYear} — recent and relevant.` });
  }

  // 7. Mean vs median skew
  if (i19.grossRevenueMedian && i19.grossRevenueMedian > 0) {
    const skewRatio = i19.grossRevenueAvg / i19.grossRevenueMedian;
    if (skewRatio > 1.2) {
      flags.push({ severity: "warning", label: `Average inflated by top performers (${Math.round((skewRatio - 1) * 100)}% above median)`, detail: `The median (${formatCurrency(i19.grossRevenueMedian)}) is significantly lower than the average (${formatCurrency(i19.grossRevenueAvg)}). Top locations pull the average up — the median is a more realistic target for a new unit.` });
    } else if (skewRatio < 0.85) {
      flags.push({ severity: "info", label: "Average below median (unusual distribution)", detail: "The average is below the median, suggesting a few very low-performing units drag the average down." });
    } else {
      flags.push({ severity: "ok", label: "Average and median close", detail: `Average (${formatCurrency(i19.grossRevenueAvg)}) and median (${formatCurrency(i19.grossRevenueMedian)}) are within 15% — reasonably even distribution.` });
    }
  }

  // 8. Extraction confidence
  if (i19.extractionConfidence === "low") {
    flags.push({ severity: "warning", label: "Low extraction confidence", detail: "This figure was extracted with low confidence from the FDD — verify against the original document." });
  } else if (i19.extractionConfidence === "medium") {
    flags.push({ severity: "info", label: "Medium extraction confidence", detail: "Revenue figure extracted with medium confidence. Cross-check with source FDD before relying on this number." });
  }

  return flags;
}

/** Auto-derive comparability classification from flags */
export function deriveComparability(flags: Item19ComparabilityFlag[]): Item19Comparable {
  const warnings = flags.filter((f) => f.severity === "warning").length;
  if (warnings >= 3) return "weak";
  if (warnings >= 1) return "limited";
  return "full";
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 4 — FRANCHISEE INTERVIEW PREP ENGINE
// Generates prioritized questions based on actual red flags, Item 20 data,
// Item 17 contract terms, Item 21 financials, and litigation.
// ═══════════════════════════════════════════════════════════════════════════

export interface InterviewQuestion {
  priority: "critical" | "important" | "standard";
  category: "unit_economics" | "operations" | "contract" | "support" | "financials" | "exit" | "management";
  question: string;
  /** What to listen for — context for the prospective franchisee */
  lookFor: string;
  /** FDD item that prompted this question */
  sourcedFrom: string;
}

export function generateInterviewQuestions(brand: FranchiseBrand): InterviewQuestion[] {
  const qs: InterviewQuestion[] = [];
  const ue = brand.unitEconomics;
  const i17 = brand.item17;
  const i19 = brand.item19;
  const i21 = brand.item21;

  // ── Unit economics questions ────────────────────────────────────────────

  if (ue.unitsClosed > 0 || ue.unitsTerminated != null) {
    const closed = ue.unitsClosed;
    const terminated = ue.unitsTerminated ?? 0;
    qs.push({
      priority: terminated >= 3 ? "critical" : "important",
      category: "unit_economics",
      question: `${closed} units closed in the most recent FDD period${terminated > 0 ? ` (${terminated} were forced terminations)` : ""}. Ask franchisees: what actually drove those closures — was it market conditions, operations, or franchisor decisions?`,
      lookFor: "Franchisees who left voluntarily vs. those terminated. Any pattern by region, years in system, or franchisee profile.",
      sourcedFrom: `Item 20 — ${brand.fddYear} FDD`,
    });
  }

  if (ue.turnoverRate > 15) {
    qs.push({
      priority: ue.turnoverRate > 25 ? "critical" : "important",
      category: "unit_economics",
      question: `Turnover rate is ${ue.turnoverRate}% — above industry average. Ask existing franchisees: do they plan to renew? Would they buy this franchise again?`,
      lookFor: "Unprompted enthusiasm vs. measured or reluctant responses. Ask about year-2 and year-3 revenue vs. projections.",
      sourcedFrom: `Item 20 — ${brand.fddYear} FDD`,
    });
  }

  if (brand.item19Prior?.grossRevenueAvg && i19?.grossRevenueAvg) {
    const change = ((i19.grossRevenueAvg - brand.item19Prior.grossRevenueAvg) / brand.item19Prior.grossRevenueAvg) * 100;
    if (change < -5) {
      qs.push({
        priority: "critical",
        category: "unit_economics",
        question: `Disclosed avg revenue fell ${Math.abs(Math.round(change))}% from ${brand.item19Prior.fddYear} to ${brand.fddYear}. Ask franchisees: what changed in your revenue over this period and what caused it?`,
        lookFor: "Whether the decline is system-wide or location-specific. COVID recovery lag, competition, or franchisor pricing changes.",
        sourcedFrom: `Item 19 — ${brand.fddYear} vs ${brand.item19Prior.fddYear} FDD`,
      });
    }
  }

  // Always ask about ramp-up
  qs.push({
    priority: "standard",
    category: "unit_economics",
    question: "What did your revenue look like in year 1 vs. year 2 vs. now? When did you reach breakeven?",
    lookFor: "Year 1 revenue is typically well below Item 19 averages (which often exclude ramp-up units). Expect 12-24 months to reach average.",
    sourcedFrom: `Item 19 — ${brand.fddYear} FDD`,
  });

  // ── Contract questions ──────────────────────────────────────────────────

  if (i17?.mandatoryArbitration) {
    qs.push({
      priority: "important",
      category: "contract",
      question: "The agreement requires mandatory arbitration. Ask: have you ever had a dispute with the franchisor — how was it handled? Did you feel you had recourse?",
      lookFor: "Franchisees who've been through disputes. Understand if the arbitration process felt fair or heavily stacked toward the franchisor.",
      sourcedFrom: `Item 17 — ${brand.fddYear} FDD`,
    });
  }

  if (i17?.hasNonCompete && (i17.nonCompeteYears ?? 0) >= 2) {
    qs.push({
      priority: "important",
      category: "contract",
      question: `The agreement includes a ${i17.nonCompeteYears}-year, ${i17.nonCompeteMiles ?? "N/A"}-mile post-termination non-compete. Ask franchisees: did you fully understand this when you signed — and do you feel it's fair?`,
      lookFor: "Whether franchisees feel trapped. High non-compete terms reduce exit flexibility.",
      sourcedFrom: `Item 17 — ${brand.fddYear} FDD`,
    });
  }

  if (i17?.curePeriodDays != null && i17.curePeriodDays < 15) {
    qs.push({
      priority: "important",
      category: "contract",
      question: `Cure period is only ${i17.curePeriodDays} days. Ask: have you ever received a default notice? How did the franchisor handle it — were they reasonable?`,
      lookFor: "A short cure period combined with aggressive enforcement is a serious risk. Look for franchisees who feel supported vs. managed by threat.",
      sourcedFrom: `Item 17 — ${brand.fddYear} FDD`,
    });
  }

  // ── Support questions ───────────────────────────────────────────────────

  qs.push({
    priority: "important",
    category: "support",
    question: "How responsive is your franchisor rep — do they actually help when you have a problem, or are they just checking boxes?",
    lookFor: "Specific stories (not just vague positives). Ask about a time they needed help urgently — response time matters.",
    sourcedFrom: "Item 11 — training & support",
  });

  qs.push({
    priority: "standard",
    category: "support",
    question: "What did the training actually cover vs. what you needed on day 1? What do you wish you'd learned before opening?",
    lookFor: "Gap between training content and operational reality. New franchisees often report the training covered theory but not real-world situations.",
    sourcedFrom: "Item 11 — training & support",
  });

  // ── Franchisor financials questions ────────────────────────────────────

  if (i21?.goingConcernWarning) {
    qs.push({
      priority: "critical",
      category: "financials",
      question: `The franchisor's audited financials include a going-concern warning. Ask franchisees: have you heard anything about the franchisor's financial stability? Any changes to support or services recently?`,
      lookFor: "Signs of reduced headquarters staffing, delayed tech updates, or reduced field support — early indicators of a financially stressed franchisor.",
      sourcedFrom: `Item 21 — ${brand.fddYear} FDD`,
    });
  }

  if (i21?.franchisorEquity != null && i21.franchisorEquity < 0) {
    qs.push({
      priority: "critical",
      category: "financials",
      question: `The franchisor has negative equity (${formatCurrency(Math.abs(i21.franchisorEquity))} deficit). Ask existing franchisees: have there been any changes to required contributions, tech fees, or support levels in the past year?`,
      lookFor: "Cost-cutting at headquarters, franchise fee increases, or reduction in territory enforcement — signs of financial stress.",
      sourcedFrom: `Item 21 — ${brand.fddYear} FDD`,
    });
  }

  if (!i21?.hasAuditedFinancials) {
    qs.push({
      priority: "important",
      category: "financials",
      question: "The FDD does not include audited financial statements. Ask: do you have any visibility into the franchisor's financial health? Have you ever been concerned about the company's stability?",
      lookFor: "Even anecdotal signals — changes in leadership, delays in royalty statement processing, reduced marketing fund activity.",
      sourcedFrom: `Item 21 — ${brand.fddYear} FDD`,
    });
  }

  // ── Exit questions ──────────────────────────────────────────────────────

  qs.push({
    priority: "important",
    category: "exit",
    question: "If you decided to sell your franchise tomorrow, how easy would that be? Has the franchisor ever blocked or delayed a transfer you wanted?",
    lookFor: "Transfer fee surprises, right-of-first-refusal complications, or franchisor demanding upgrades before approving a sale.",
    sourcedFrom: `Item 17 — ${brand.fddYear} FDD`,
  });

  qs.push({
    priority: "standard",
    category: "exit",
    question: "Knowing everything you know now, would you sign this franchise agreement again? What would you negotiate differently?",
    lookFor: "This is the single highest-signal question. Listen for hesitation. Franchisees rarely criticize their decision publicly; even mild reservations are meaningful.",
    sourcedFrom: "Item 20 — franchisee contact list",
  });

  // ── Management quality questions (Item 2) ──────────────────────────────────

  if (brand.managementData) {
    const mgmt = brand.managementData;

    if (mgmt.hasLeadershipChanges) {
      qs.push({
        priority: "important",
        category: "management",
        question: `Item 2 shows recent leadership changes. Ask current franchisees: has the change in leadership affected support quality, speed of decisions, or the culture of the system?`,
        lookFor: "Whether the new leadership has franchise operations experience. Disruption in field support after leadership transitions is common.",
        sourcedFrom: `Item 2 — ${brand.fddYear} FDD (Business Experience)`,
      });
    }

    if (!mgmt.hasFranchiseExp) {
      qs.push({
        priority: "important",
        category: "management",
        question: `The Item 2 business experience section doesn't show prior franchise system experience in leadership. Ask: how does the corporate team support franchisees who are struggling operationally?`,
        lookFor: "Whether they have franchise-specific field support, franchise advisory councils, or prior experience navigating the franchisor-franchisee relationship.",
        sourcedFrom: `Item 2 — ${brand.fddYear} FDD (Business Experience)`,
      });
    }

    if ((mgmt.execCount ?? 0) <= 1) {
      qs.push({
        priority: "important",
        category: "management",
        question: `Item 2 lists very few senior executives. Ask: what happens to franchisee support if a key person leaves? Is there a succession plan?`,
        lookFor: "Key-person risk is highest at early-stage or family-run franchisors. Look for documented processes vs. personality-driven operations.",
        sourcedFrom: `Item 2 — ${brand.fddYear} FDD (Business Experience)`,
      });
    }
  }

  // Always include management question regardless of Item 2 data
  qs.push({
    priority: "standard",
    category: "management",
    question: "How responsive is corporate support when you have an operational problem? Can you give me an example of when you needed help and how they responded?",
    lookFor: "Same-day response vs. days-long wait. Whether field support visits are proactive or only reactive. Quality of the franchisee hotline.",
    sourcedFrom: "Item 11 — Training & Support",
  });

  // Sort: critical first, then important, then standard
  const priorityOrder = { critical: 0, important: 1, standard: 2 };
  qs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return qs;
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 5 — OUTLET CHURN ANATOMY
// Detailed breakdown of Item 20 exit types and system health signal.
// ═══════════════════════════════════════════════════════════════════════════

export interface ChurnAnatomyRow {
  type: string;
  count: number;
  pct: number;          // % of total closures
  signal: "positive" | "neutral" | "negative";
  interpretation: string;
}

export interface ChurnAnatomy {
  periodLabel: string;
  totalOpened: number;
  totalExited: number;
  netGrowth: number;
  systemHealthSignal: "growing" | "stable" | "contracting" | "distressed";
  forcedExitPct: number;    // % of exits that were franchisor-forced (terminations + non-renewals)
  rows: ChurnAnatomyRow[];
  keyInsight: string;
}

export function computeChurnAnatomy(brand: FranchiseBrand): ChurnAnatomy | null {
  const ue = brand.unitEconomics;
  if (ue.unitsStartOfPeriod === 0 && ue.unitsOpened === 0 && ue.unitsClosed === 0) return null;

  const opened = ue.unitsOpened ?? 0;
  const closed = ue.unitsClosed ?? 0;
  const transferred = ue.unitsTransferred ?? 0;
  const terminated = ue.unitsTerminated ?? 0;
  const nonRenewed = ue.unitsNonRenewed ?? 0;
  const reacquired = ue.unitsReacquired ?? 0;
  const ceased = ue.unitsCeasedOperations ?? 0;

  // Total exits (all types)
  // Note: closed in brands.ts = sum of all exits; if detailed breakdown available, use it
  const hasDetailedBreakdown = (terminated + nonRenewed + reacquired + ceased) > 0;
  const totalExits = hasDetailedBreakdown ? terminated + nonRenewed + reacquired + ceased : closed;
  const forcedExits = terminated + nonRenewed;
  const forcedPct = totalExits > 0 ? Math.round((forcedExits / totalExits) * 100) : 0;

  const rows: ChurnAnatomyRow[] = [];

  if (hasDetailedBreakdown) {
    if (terminated > 0) {
      rows.push({ type: "Terminations (forced by franchisor)", count: terminated, pct: Math.round((terminated / totalExits) * 100), signal: "negative", interpretation: "Franchisor forced closure. Can indicate unit non-performance or relationship breakdown." });
    }
    if (nonRenewed > 0) {
      rows.push({ type: "Non-renewals (not offered renewal)", count: nonRenewed, pct: Math.round((nonRenewed / totalExits) * 100), signal: "negative", interpretation: "Franchisor declined to renew. Similar signal to termination — unit was not retained." });
    }
    if (reacquired > 0) {
      rows.push({ type: "Reacquisitions (franchisor bought back)", count: reacquired, pct: Math.round((reacquired / totalExits) * 100), signal: "neutral", interpretation: "Franchisor bought the unit. May indicate strategic consolidation or failing unit rescue." });
    }
    if (ceased > 0) {
      rows.push({ type: "Voluntary closures (franchisee-initiated)", count: ceased, pct: Math.round((ceased / totalExits) * 100), signal: "negative", interpretation: "Franchisee chose to close — often because unit was uneconomical. A high count is concerning." });
    }
  } else if (closed > 0) {
    rows.push({ type: "Units Closed (type breakdown not available)", count: closed, pct: 100, signal: "neutral", interpretation: "Total closures without exit-type detail. Review Item 20 in the full FDD for breakdown." });
  }

  if (transferred > 0) {
    rows.push({ type: "Transfers (franchisee-to-franchisee)", count: transferred, pct: 0, signal: "positive", interpretation: "Units changed hands but remained in the system. High transfers can indicate a healthy resale market." });
  }

  // System health signal
  const turnover = ue.turnoverRate;
  let signal: ChurnAnatomy["systemHealthSignal"];
  if (ue.netGrowth > 10 && turnover < 10) signal = "growing";
  else if (ue.netGrowth >= 0 && forcedPct < 30 && turnover < 20) signal = "stable";
  else if (ue.netGrowth < 0 || turnover > 25) signal = "contracting";
  else signal = "stable";
  if (forcedPct > 50 && totalExits >= 5) signal = "distressed";

  // Key insight
  let insight = "";
  if (signal === "growing") insight = `System is expanding — net +${ue.netGrowth} units with ${turnover}% turnover. New unit openings outpace closures.`;
  else if (signal === "distressed") insight = `Warning: ${forcedPct}% of exits were franchisor-forced (terminations + non-renewals). This is a high-stress signal.`;
  else if (signal === "contracting") insight = `System is shrinking — net ${ue.netGrowth} units. Closures exceed openings. Verify whether this is temporary or structural.`;
  else insight = `System is stable — net ${ue.netGrowth > 0 ? "+" : ""}${ue.netGrowth} units. Normal turnover for the category.`;

  return {
    periodLabel: `${brand.fddYear} FDD reporting period`,
    totalOpened: opened,
    totalExited: totalExits,
    netGrowth: ue.netGrowth,
    systemHealthSignal: signal,
    forcedExitPct: forcedPct,
    rows,
    keyInsight: insight,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 6 — BRAND DETERIORATION DETECTOR
// Multi-field change detector: revenue, unit count, turnover, going concern.
// Uses item19Prior (historical diff engine), yearlyNetGrowth, item21 signals.
// ═══════════════════════════════════════════════════════════════════════════

export type DeteriorationSeverity = "critical" | "warning" | "stable" | "improving";

export interface DeteriorationSignal {
  field: string;
  severity: DeteriorationSeverity;
  currentValue: string;
  priorValue?: string;
  changeSummary: string;
  fddReference: string;
}

export interface BrandDeteriorationReport {
  overallTrend: DeteriorationSeverity;
  signals: DeteriorationSignal[];
  hasPriorData: boolean;
  summary: string;
}

export function detectBrandDeterioration(brand: FranchiseBrand): BrandDeteriorationReport {
  const signals: DeteriorationSignal[] = [];
  const ue = brand.unitEconomics;
  const i21 = brand.item21;
  const i19 = brand.item19;
  const prior = brand.item19Prior;

  // 1. Revenue trend (requires prior-year data)
  if (prior?.grossRevenueAvg && i19?.grossRevenueAvg && prior.fddYear) {
    const changePct = Math.round(((i19.grossRevenueAvg - prior.grossRevenueAvg) / prior.grossRevenueAvg) * 100);
    signals.push({
      field: "Average Revenue (Item 19)",
      severity: changePct <= -15 ? "critical" : changePct <= -5 ? "warning" : changePct >= 5 ? "improving" : "stable",
      currentValue: `${formatCurrency(i19.grossRevenueAvg)} (${brand.fddYear} FDD)`,
      priorValue: `${formatCurrency(prior.grossRevenueAvg)} (${prior.fddYear} FDD)`,
      changeSummary: `${changePct > 0 ? "+" : ""}${changePct}% year-over-year`,
      fddReference: "Item 19",
    });
  }

  // 2. Unit count trend (yearlyNetGrowth or single period)
  const yearly = ue.yearlyNetGrowth;
  if (yearly && yearly.length >= 2) {
    const recent = yearly[yearly.length - 1].net;
    const previous = yearly[yearly.length - 2].net;
    const trending = recent - previous;
    signals.push({
      field: "Unit Growth Trajectory",
      severity: recent < -10 ? "critical" : recent < 0 ? "warning" : trending < -10 ? "warning" : trending >= 5 ? "improving" : "stable",
      currentValue: `Net ${recent >= 0 ? "+" : ""}${recent} units (${yearly[yearly.length - 1].year})`,
      priorValue: `Net ${previous >= 0 ? "+" : ""}${previous} units (${yearly[yearly.length - 2].year})`,
      changeSummary: trending > 0 ? `Growth improved by ${trending} units` : `Growth declined by ${Math.abs(trending)} units`,
      fddReference: "Item 20",
    });
  } else if (ue.netGrowth !== 0 || ue.unitsClosed > 0) {
    const turnover = ue.turnoverRate;
    signals.push({
      field: "Unit Count (Current Period)",
      severity: ue.netGrowth < -10 ? "critical" : ue.netGrowth < 0 ? "warning" : ue.netGrowth > 10 ? "improving" : "stable",
      currentValue: `Net ${ue.netGrowth >= 0 ? "+" : ""}${ue.netGrowth} units; turnover ${turnover}%`,
      changeSummary: ue.netGrowth >= 0 ? `System expanding or stable` : `System contracting`,
      fddReference: "Item 20",
    });
  }

  // 3. Turnover rate
  if (ue.turnoverRate > 0) {
    signals.push({
      field: "Unit Turnover Rate",
      severity: ue.turnoverRate >= 25 ? "critical" : ue.turnoverRate >= 15 ? "warning" : ue.turnoverRate <= 5 ? "improving" : "stable",
      currentValue: `${ue.turnoverRate}% annual turnover`,
      changeSummary: ue.turnoverRate >= 25 ? "Critically high — 1 in 4 units changing hands or closing" :
                     ue.turnoverRate >= 15 ? "Above industry average (5–10% is typical)" :
                     ue.turnoverRate <= 5 ? "Below average — healthy retention" : "Normal range",
      fddReference: "Item 20",
    });
  }

  // 4. Going concern warning
  if (i21?.goingConcernWarning) {
    signals.push({
      field: "Franchisor Financial Health",
      severity: "critical",
      currentValue: "Going concern warning in audited financials",
      changeSummary: `Auditor (${i21.auditorName ?? "independent"}) raised going concern doubts in the ${brand.fddYear} FDD`,
      fddReference: "Item 21",
    });
  }

  // 5. Auditor opinion
  if (i21?.auditorOpinion && i21.auditorOpinion !== "clean" && i21.auditorOpinion !== "unknown") {
    signals.push({
      field: "Auditor Opinion",
      severity: i21.auditorOpinion === "adverse" || i21.auditorOpinion === "disclaimer" ? "critical" : "warning",
      currentValue: `${i21.auditorOpinion.charAt(0).toUpperCase() + i21.auditorOpinion.slice(1)} opinion`,
      changeSummary: `Non-clean audit opinion from ${i21.auditorName ?? "auditor"} — indicates significant accounting concerns`,
      fddReference: "Item 21",
    });
  }

  // 6. Negative equity
  if (i21?.franchisorEquity != null && i21.franchisorEquity < 0) {
    signals.push({
      field: "Franchisor Equity",
      severity: i21.franchisorEquity < -500_000 ? "critical" : "warning",
      currentValue: formatCurrency(i21.franchisorEquity),
      changeSummary: `Negative equity of ${formatCurrency(Math.abs(i21.franchisorEquity))} — liabilities exceed assets`,
      fddReference: "Item 21",
    });
  }

  // 7. Litigation trend
  if (brand.litigation.trend === "increasing") {
    signals.push({
      field: "Litigation Trend",
      severity: brand.litigation.activeLawsuits >= 20 ? "critical" : "warning",
      currentValue: `${brand.litigation.activeLawsuits} active lawsuits, trend: increasing`,
      changeSummary: "Lawsuit count growing — verify nature of disputes",
      fddReference: "Item 3",
    });
  }

  // Overall trend: worst signal wins
  const severities: DeteriorationSeverity[] = signals.map((s) => s.severity);
  let overallTrend: DeteriorationSeverity = "stable";
  if (severities.includes("critical")) overallTrend = "critical";
  else if (severities.includes("warning")) overallTrend = "warning";
  else if (severities.filter((s) => s === "improving").length >= 2) overallTrend = "improving";

  const hasPriorData = !!(prior?.grossRevenueAvg || (yearly && yearly.length >= 2));

  let summary = "";
  if (overallTrend === "critical") summary = "One or more critical deterioration signals detected. Review carefully before proceeding.";
  else if (overallTrend === "warning") summary = "Some warning signals present. No critical issues, but trends warrant close monitoring.";
  else if (overallTrend === "improving") summary = "Multiple improving signals. Positive trajectory across revenue and/or unit count.";
  else summary = "No significant deterioration signals. Data is stable across tracked dimensions.";

  return { overallTrend, signals, hasPriorData, summary };
}

/* ══════════════════════════════════════════════════════
   STATE CONCENTRATION  (Feature #9)
   Source: FDD Item 20, Table No. 3 — Outlets by State
   ══════════════════════════════════════════════════════ */

/**
 * Compute state concentration metrics for a brand.
 *
 * When per-state unit data (`stateConcentration.byState`) is available from
 * the extractor, it computes a full HHI and per-state share breakdown.
 * When only the aggregate `statesOfOperation` count is known it falls back to
 * a uniform distribution estimate so the UI always has something to display.
 */
export function computeStateConcentration(brand: FranchiseBrand): StateConcentrationData {
  const stored = brand.stateConcentration;

  // ── Case 1: full per-state breakdown extracted from FDD ──────────────────
  if (stored?.byState && stored.byState.length > 0) {
    const byState = [...stored.byState].sort((a, b) => b.units - a.units);
    const totalUnits = byState.reduce((s, r) => s + r.units, 0);

    // HHI = sum of (share_i)^2, range 0-1
    const hhi = totalUnits > 0
      ? byState.reduce((s, r) => s + Math.pow(r.units / totalUnits, 2), 0)
      : undefined;

    const topState       = byState[0]?.state;
    const topStateUnits  = byState[0]?.units ?? 0;
    const topSharePct    = totalUnits > 0 ? Math.round((topStateUnits / totalUnits) * 100) : 0;
    const stateCount     = byState.length;
    const highlyConc     = topSharePct > 50;

    let coverageType: StateConcentrationData["coverageType"] = "unknown";
    if (stateCount >= 25)     coverageType = "national";
    else if (stateCount >= 6) coverageType = "regional";
    else if (stateCount >= 2) coverageType = "local";
    else if (stateCount === 1) coverageType = "single_state";

    return {
      byState,
      stateCount,
      hhi,
      topState,
      topStateSharePct: topSharePct,
      highlyConcentrated: highlyConc,
      coverageType,
      extractionConfidence: stored.extractionConfidence ?? "high",
    };
  }

  // ── Case 2: fall back to aggregate statesOfOperation ─────────────────────
  const stateCount = stored?.stateCount ?? brand.statesOfOperation ?? 0;
  const totalUnits = brand.totalUnits ?? 0;

  if (stateCount === 0) {
    return {
      stateCount: 0,
      highlyConcentrated: false,
      coverageType: "unknown",
      extractionConfidence: "low",
    };
  }

  // Assume uniform distribution across states for HHI estimate
  const uniformHHI = 1 / stateCount; // each state gets 1/n share → HHI = n × (1/n)² = 1/n
  const estimatedTopSharePct = Math.round(100 / stateCount);

  let coverageType: StateConcentrationData["coverageType"] = "unknown";
  if (stateCount >= 25)      coverageType = "national";
  else if (stateCount >= 6)  coverageType = "regional";
  else if (stateCount >= 2)  coverageType = "local";
  else if (stateCount === 1) coverageType = "single_state";

  const highlyConcentrated = stateCount === 1 || (totalUnits > 0 && estimatedTopSharePct > 50);

  return {
    stateCount,
    hhi: uniformHHI,
    topStateSharePct: estimatedTopSharePct,
    highlyConcentrated,
    coverageType,
    extractionConfidence: "low", // derived from aggregate only
  };
}

/**
 * Human-readable concentration risk label + colour bucket.
 */
export function stateConcentrationRisk(data: StateConcentrationData): {
  label: string;
  level: "low" | "medium" | "high" | "critical";
  rationale: string;
} {
  const { coverageType, highlyConcentrated, hhi, stateCount } = data;

  if (coverageType === "single_state" || highlyConcentrated) {
    return {
      label: "High Concentration",
      level: "critical",
      rationale: stateCount === 1
        ? "All units located in a single state — full exposure to one state's regulatory changes and economic conditions."
        : `One state holds the majority of units — significant regulatory and economic concentration risk.`,
    };
  }

  if (coverageType === "local") {
    return {
      label: "Regional Concentration",
      level: "high",
      rationale: `Operating in only ${stateCount} states — limited geographic diversification increases regional risk exposure.`,
    };
  }

  if (hhi != null && hhi > 0.25) {
    return {
      label: "Moderate Concentration",
      level: "medium",
      rationale: `HHI of ${hhi.toFixed(2)} indicates moderately uneven distribution across ${stateCount} states.`,
    };
  }

  if (coverageType === "national") {
    return {
      label: "Well Distributed",
      level: "low",
      rationale: `Present in ${stateCount}+ states — strong geographic diversification reduces single-state risk.`,
    };
  }

  return {
    label: "Moderate Distribution",
    level: "medium",
    rationale: `Present in ${stateCount} states — moderate geographic diversification.`,
  };
}

/**
 * Interprets management quality signals from Item 2.
 * Returns a human-readable signal with a risk level.
 */
export function computeManagementSignal(brand: FranchiseBrand): {
  label: string;
  level: "strong" | "adequate" | "weak" | "unknown";
  rationale: string;
  score: number | null;
} {
  const mgmt: ManagementData | undefined = brand.managementData;

  if (!mgmt || mgmt.extractionConfidence === "low") {
    return {
      label: "No Data",
      level: "unknown",
      rationale: "Item 2 (Business Experience) was not extracted for this brand.",
      score: null,
    };
  }

  const score = mgmt.managementQualityScore ?? 5;

  const bullets: string[] = [];
  if (mgmt.hasFranchiseExp) {
    bullets.push("leadership has prior franchise system experience");
  }
  if (mgmt.hasStableLeadership) {
    bullets.push("long-tenured executives (5+ years)");
  }
  if (mgmt.hasLeadershipChanges) {
    bullets.push("recent leadership changes detected");
  }
  if ((mgmt.execCount ?? 0) >= 3) {
    bullets.push(`${mgmt.execCount} senior roles identified`);
  } else if ((mgmt.execCount ?? 0) <= 1) {
    bullets.push("thin executive bench (≤1 senior role identified)");
  }

  const rationale = bullets.length > 0
    ? bullets.map((b, i) => (i === 0 ? b[0].toUpperCase() + b.slice(1) : b)).join("; ") + "."
    : "Limited management signals in Item 2.";

  let level: "strong" | "adequate" | "weak";
  let label: string;
  if (score >= 7) {
    level = "strong";
    label = "Strong Management Signal";
  } else if (score >= 5) {
    level = "adequate";
    label = "Adequate Management Signal";
  } else {
    level = "weak";
    label = "Weak Management Signal";
  }

  return { label, level, rationale, score };
}

/**
 * Territory encroachment risk — Layer 7 (Item 12).
 * Returns a risk assessment based on territory type, exclusivity, and franchisor competition rights.
 */
export function computeTerritoryRisk(brand: FranchiseBrand): {
  label: string;
  level: "low" | "medium" | "high" | "critical" | "unknown";
  rationale: string;
  score: number | null; // 0-10, 10 = best (lowest risk)
} {
  const i12 = brand.item12;
  if (!i12) {
    return {
      label: "No Data",
      level: "unknown",
      rationale: "Item 12 (Territory) was not extracted for this brand.",
      score: null,
    };
  }

  let score = 5; // baseline
  const bullets: string[] = [];

  if (i12.exclusiveTerritory === true) {
    score += 2;
    bullets.push("exclusive territory granted");
  } else if (i12.exclusiveTerritory === false) {
    score -= 3;
    bullets.push("NO exclusive territory — encroachment risk exists");
  }

  if (i12.franchisorMayCompete === true) {
    score -= 2;
    bullets.push("franchisor may operate competing channels in your market");
  }

  if (i12.onlineSalesReserved === true) {
    score -= 1;
    bullets.push("franchisor reserves online/ecommerce sales");
  }

  if (i12.territoryType === "population") {
    score += 1;
    bullets.push(`population-based territory (${i12.territoryPopulation?.toLocaleString() ?? "defined"} pop.)`);
  } else if (i12.territoryType === "radius") {
    score += 0.5;
    bullets.push(`radius-based territory (${i12.territoryRadius ?? "defined"} mi.)`);
  } else if (i12.territoryType === "none") {
    score -= 1;
    bullets.push("no defined territory type");
  }

  if (i12.hasPerformanceRequirement === true) {
    score -= 0.5;
    bullets.push("territory contingent on performance requirements");
  }

  score = Math.max(0, Math.min(10, Math.round(score)));

  const rationale = bullets.length > 0
    ? bullets.map((b, i) => (i === 0 ? b[0].toUpperCase() + b.slice(1) : b)).join("; ") + "."
    : "Minimal territory data in Item 12.";

  let level: "low" | "medium" | "high" | "critical";
  let label: string;
  if (score >= 7) {
    level = "low";
    label = "Low Encroachment Risk";
  } else if (score >= 5) {
    level = "medium";
    label = "Moderate Encroachment Risk";
  } else if (score >= 3) {
    level = "high";
    label = "High Encroachment Risk";
  } else {
    level = "critical";
    label = "Critical Encroachment Risk";
  }

  return { label, level, rationale, score };
}

/* ── Layer 8: Supplier Dependence (Item 8) ───────────────────────────────── */
export function computeSupplierRisk(brand: FranchiseBrand): {
  label: string;
  level: "low" | "medium" | "high" | "critical" | "unknown";
  rationale: string;
  score: number | null;
  lockInScore: number | null;
} {
  const i8 = brand.item8;
  if (!i8 || i8.extractionConfidence === "low") {
    return {
      label: "Supplier Data Unavailable",
      level: "unknown",
      rationale: "Item 8 data not extracted from this FDD.",
      score: null,
      lockInScore: null,
    };
  }

  // Use lockInScore if present (0 = free, 10 = fully locked = high risk)
  let riskScore = i8.lockInScore ?? 5;
  const bullets: string[] = [];

  if (i8.specificationsOnly === true) {
    bullets.push("franchisee may source freely if specifications are met");
    riskScore = Math.max(0, riskScore - 1);
  }
  if (i8.alternativeSupplierPossible === true) {
    bullets.push("alternative suppliers may be approved with permission");
    riskScore = Math.max(0, riskScore - 1);
  }
  if (i8.hasRequiredPurchases === true) {
    bullets.push("mandatory purchases required from approved sources");
  }
  if (i8.approvedSupplierList === true) {
    bullets.push("defined approved supplier list exists");
  }
  if (i8.franchisorReceivesSupplierRevenue === true) {
    riskScore = Math.min(10, riskScore + 1);
    bullets.push("franchisor or affiliate receives revenue from supplier arrangements");
  }
  if (i8.mandatoryCategories && i8.mandatoryCategories.length > 0) {
    bullets.push("mandatory categories: " + i8.mandatoryCategories.slice(0, 3).join(", ") + (i8.mandatoryCategories.length > 3 ? "…" : ""));
  }

  riskScore = Math.max(0, Math.min(10, Math.round(riskScore)));

  const rationale = bullets.length > 0
    ? bullets.map((b, i) => (i === 0 ? b[0].toUpperCase() + b.slice(1) : b)).join("; ") + "."
    : "Standard supplier arrangement — no notable lock-in restrictions identified.";

  let level: "low" | "medium" | "high" | "critical";
  let label: string;
  if (riskScore <= 3) {
    level = "low";
    label = "Low Supplier Lock-In";
  } else if (riskScore <= 5) {
    level = "medium";
    label = "Moderate Supplier Dependence";
  } else if (riskScore <= 7) {
    level = "high";
    label = "High Supplier Lock-In";
  } else {
    level = "critical";
    label = "Critical Supplier Dependence";
  }

  return { label, level, rationale, score: riskScore, lockInScore: i8.lockInScore ?? null };
}

/* ── Layer 11: Support Quality Signal (Item 11) ─────────────────────────── */
export function computeSupportQuality(brand: FranchiseBrand): {
  label: string;
  level: "strong" | "adequate" | "minimal" | "unknown";
  rationale: string;
  score: number | null;
} {
  const i11 = brand.item11;
  if (!i11) {
    return { label: "Support Data Unavailable", level: "unknown", rationale: "Item 11 support data not extracted from this FDD.", score: null };
  }

  let score = 5; // baseline
  const bullets: string[] = [];

  // Training hours analysis
  const totalHrs = i11.totalTrainingHours ?? ((i11.classroomHours ?? 0) + (i11.ojtHours ?? 0));
  if (totalHrs > 0) {
    if (totalHrs >= 120) { score += 2; bullets.push(`${totalHrs}h comprehensive training program`); }
    else if (totalHrs >= 80) { score += 1.5; bullets.push(`${totalHrs}h training program`); }
    else if (totalHrs >= 40) { score += 1; bullets.push(`${totalHrs}h training program`); }
    else if (totalHrs >= 20) { bullets.push(`${totalHrs}h initial training`); }
    else { score -= 1; bullets.push(`only ${totalHrs}h initial training`); }
  }

  // OJT vs classroom split
  if (i11.ojtHours && i11.classroomHours) {
    if (i11.ojtHours > i11.classroomHours) {
      score += 0.5;
      bullets.push(`${i11.ojtHours}h hands-on OJT plus ${i11.classroomHours}h classroom`);
    }
  }

  // Support features
  if (i11.hasAnnualConference === true) { score += 1; bullets.push("annual franchisee conference"); }
  if (i11.hasOngoingTraining === true)  { score += 1; bullets.push("ongoing training program"); }
  if (i11.hasFieldSupport === true)     { score += 1; bullets.push("field support team"); }
  if (i11.hasTechnologySystem === true) { score += 0.5; bullets.push("technology/POS system provided"); }

  score = Math.max(0, Math.min(10, Math.round(score)));

  let level: "strong" | "adequate" | "minimal";
  let label: string;
  if (score >= 7) { level = "strong"; label = "Strong Franchisor Support"; }
  else if (score >= 5) { level = "adequate"; label = "Adequate Support Package"; }
  else { level = "minimal"; label = "Minimal Support Disclosed"; }

  const rationale = bullets.length > 0
    ? bullets.map((b, i) => (i === 0 ? b[0].toUpperCase() + b.slice(1) : b)).join("; ") + "."
    : "Limited Item 11 support data disclosed.";

  return { label, level, rationale, score };
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION SCORING ENGINE
// Five separate scores + optional composite. Grounded in FTC Franchise Rule.
// Core principle: Missing data = incomplete evidence, NOT bad score.
// ═══════════════════════════════════════════════════════════════════════════

import type {
  ProductionScores,
  EconomicsCoverageStatus,
  CompositeGrade,
} from "./types";
import { gradeFromScore } from "./types";

/* ── Helper: clamp to 0-100 ── */
function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/* ── Score 1: System Health (0-100) — Item 20 ── */
function productionSystemHealth(brand: FranchiseBrand): number | null {
  const ue = brand.unitEconomics;
  if (!ue.unitsStartOfPeriod && !ue.unitsOpened && !ue.unitsClosed) return null;

  let score = 50;

  // Net growth quality (20%)
  const totalUnits = Math.max(ue.unitsStartOfPeriod, brand.totalUnits, 1);
  const netPct = (ue.netGrowth / totalUnits) * 100;
  if (netPct >= 10) score += 20;
  else if (netPct >= 5) score += 15;
  else if (netPct >= 3) score += 10;
  else if (netPct >= 0) score += 5;
  else if (netPct > -3) score -= 5;
  else if (netPct > -8) score -= 10;
  else score -= 20;

  // Closure + termination + ceased operations (35%)
  const turnover = ue.turnoverRate;
  if (turnover <= 3) score += 20;
  else if (turnover <= 5) score += 15;
  else if (turnover <= 7) score += 10;
  else if (turnover <= 10) score += 0;
  else if (turnover <= 15) score -= 10;
  else if (turnover <= 20) score -= 15;
  else score -= 20;

  if (ue.unitsTerminated && ue.unitsStartOfPeriod) {
    const termPct = (ue.unitsTerminated / ue.unitsStartOfPeriod) * 100;
    if (termPct >= 5) score -= 10;
    else if (termPct >= 2) score -= 5;
  }
  if (ue.unitsCeasedOperations && ue.unitsStartOfPeriod) {
    const ceasedPct = (ue.unitsCeasedOperations / ue.unitsStartOfPeriod) * 100;
    if (ceasedPct >= 5) score -= 5;
  }

  // Signed-not-opened discipline (15%)
  if (ue.signedNotOpened && ue.signedNotOpened > 20) score += 10;
  else if (ue.signedNotOpened && ue.signedNotOpened > 10) score += 5;

  // Non-renewal (10%)
  if (ue.unitsNonRenewed && ue.unitsStartOfPeriod) {
    const nrPct = (ue.unitsNonRenewed / ue.unitsStartOfPeriod) * 100;
    if (nrPct >= 3) score -= 8;
    else if (nrPct >= 1) score -= 4;
  }

  // Transfer + reacquisition interpretation (10%)
  if (ue.unitsReacquired && ue.unitsStartOfPeriod) {
    const reacqPct = (ue.unitsReacquired / ue.unitsStartOfPeriod) * 100;
    if (reacqPct >= 5) score -= 5;
  }

  return clamp100(score);
}

/* ── Score 2: Franchisor Strength (0-100) — Items 21, 3, 4 ── */
function productionFranchisorStrength(brand: FranchiseBrand): number | null {
  const i21 = brand.item21;
  const i4 = brand.item4;
  if (!i21 && !i4) return null;

  let score = 55;

  if (i21) {
    if (i21.hasAuditedFinancials) score += 10;
    if (i21.goingConcernWarning) score -= 30;
    if (i21.auditorOpinion === "clean") score += 8;
    else if (i21.auditorOpinion === "qualified") score -= 8;
    else if (i21.auditorOpinion === "adverse" || i21.auditorOpinion === "disclaimer") score -= 25;

    if (i21.financialStrengthSignal === "strong") score += 10;
    else if (i21.financialStrengthSignal === "adequate") score += 3;
    else if (i21.financialStrengthSignal === "watch") score -= 8;
    else if (i21.financialStrengthSignal === "weak") score -= 15;

    if (i21.franchisorEquity != null && i21.franchisorEquity < 0) score -= 10;
  }

  if (i4?.hasBankruptcy) {
    score -= i4.bankruptcyType === "chapter_7" ? 25 : 18;
  }

  const lit = brand.litigation;
  if (lit.activeLawsuits >= 20) score -= 15;
  else if (lit.activeLawsuits >= 10) score -= 10;
  else if (lit.activeLawsuits >= 3) score -= 5;
  if (lit.trend === "increasing") score -= 5;

  return clamp100(score);
}

/* ── Score 3: Contract Burden (0-100) — Items 17, 12 ── */
function productionContractBurden(brand: FranchiseBrand): number | null {
  const i17 = brand.item17;
  if (!i17) return null;

  let score = 55;

  // Termination/default/cure (25%)
  if (i17.curePeriodDays != null) {
    if (i17.curePeriodDays >= 30) score += 12;
    else if (i17.curePeriodDays >= 15) score += 5;
    else if (i17.curePeriodDays < 10) score -= 10;
  }

  // Territory/encroachment (25%)
  if (brand.item12) {
    if (brand.item12.exclusiveTerritory === true) score += 12;
    else if (brand.item12.exclusiveTerritory === false) score -= 10;
    if (brand.item12.franchisorMayCompete) score -= 8;
    if (brand.item12.onlineSalesReserved) score -= 3;
  }

  // Transfer/renewal (20%)
  if (i17.initialTermYears && i17.initialTermYears >= 15) score += 8;
  else if (i17.initialTermYears && i17.initialTermYears >= 10) score += 5;
  else if (i17.initialTermYears && i17.initialTermYears <= 5) score -= 8;

  if (i17.renewalCount && i17.renewalCount >= 2) score += 5;
  if (typeof i17.transferFee === "number") {
    if (i17.transferFee <= 0) score += 5;
    else if (i17.transferFee >= 25000) score -= 5;
  }

  // Guaranty/non-compete (20%)
  if (i17.hasNonCompete) {
    if ((i17.nonCompeteYears ?? 0) >= 3) score -= 15;
    else if ((i17.nonCompeteYears ?? 0) >= 2) score -= 8;
    else score -= 4;
  }

  // Dispute/arbitration (10%)
  if (i17.mandatoryArbitration) score -= 8;

  return clamp100(score);
}

/* ── Score 4: Confidence (0-100) — always computed ── */
function productionConfidence(brand: FranchiseBrand): number {
  let score = 0;

  // Data completeness (25%)
  const hasItem20 = brand.unitEconomics.unitsStartOfPeriod > 0 || brand.unitEconomics.unitsOpened > 0;
  const hasItem21 = !!brand.item21;
  const hasItem17 = !!brand.item17;
  const hasItem19 = brand.hasItem19 && !!brand.item19?.grossRevenueAvg;
  const hasItem12 = !!brand.item12;
  const hasItem11 = !!brand.item11;
  const hasItem8 = !!brand.item8;

  const items = [hasItem20, hasItem21, hasItem17, hasItem19, hasItem12, hasItem11, hasItem8];
  const presentCount = items.filter(Boolean).length;
  score += Math.round((presentCount / items.length) * 25);

  // Comparability quality (25%)
  if (brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing") score += 15;
  else if (brand.dataSource === "public_record") score += 8;
  else score += 3;

  if (brand.fddAccessed) score += 5;
  if (brand.item19?.basis === "all_units") score += 5;
  else if (brand.item19?.basis === "subset" || brand.item19?.basis === "geographic") score += 2;

  // Extraction confidence (20%)
  const confFields = [
    brand.item19?.extractionConfidence,
    brand.item8?.extractionConfidence,
    brand.managementData?.extractionConfidence,
    brand.stateConcentration?.extractionConfidence,
  ].filter(Boolean);
  if (confFields.length > 0) {
    const highCount = confFields.filter((c) => c === "high").length;
    const medCount = confFields.filter((c) => c === "medium").length;
    score += Math.round(((highCount * 20 + medCount * 12) / confFields.length));
  } else {
    score += 8;
  }

  // Filing recency (10%)
  const currentYear = 2026;
  const age = currentYear - brand.fddYear;
  if (age <= 1) score += 10;
  else if (age === 2) score += 7;
  else if (age === 3) score += 4;
  else score += 1;

  // Sample quality (5%)
  if (brand.item19?.unitsIncluded && brand.totalUnits > 0) {
    const coverage = brand.item19.unitsIncluded / brand.totalUnits;
    if (coverage >= 0.8) score += 5;
    else if (coverage >= 0.5) score += 3;
    else score += 1;
  }

  // Manual review status (15%)
  if (brand.dataSource === "state_filing" || brand.dataSource === "fdd_verified") score += 10;

  // Comparability penalty: weak comparable reduces confidence
  if (brand.item19?.comparable === "weak") score -= 8;
  else if (brand.item19?.comparable === "limited") score -= 3;

  // Hard cap
  const hasCoreValidation = hasItem20 && hasItem21 && hasItem17 &&
    (brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing");
  if (!hasCoreValidation && score > 85) score = 85;

  return clamp100(score);
}

/* ── Score 5: Economics (0-100) — ONLY when normalized Item 19 exists ── */
function productionEconomics(brand: FranchiseBrand): number | null {
  const i19 = brand.item19;
  if (!brand.hasItem19 || !i19?.grossRevenueAvg) return null;

  let score = 50;

  // Revenue type adjustment: profit metrics have inherently lower absolute values
  // so the same investment-to-revenue ratio means different things
  const rt = normalizeRevenueType(i19.revenueType);
  const isProfit = isProfitMetric(rt);

  // Item 19 performance (45%)
  const investMid = (brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2;
  if (investMid > 0 && i19.grossRevenueAvg > 0) {
    // For profit metrics, the ratio thresholds shift because the denominator is smaller
    const ratio = investMid / i19.grossRevenueAvg;
    if (ratio <= 0.3) score += 25;
    else if (ratio <= 0.5) score += 20;
    else if (ratio <= 1.0) score += 10;
    else if (ratio <= 2.0) score += 0;
    else if (ratio <= 3.0) score -= 10;
    else score -= 15;
  }

  if (i19.extractionConfidence === "high") score += 5;
  else if (i19.extractionConfidence === "medium") score += 2;

  if (i19.unitsIncluded && brand.totalUnits > 0) {
    const coverage = i19.unitsIncluded / brand.totalUnits;
    if (coverage >= 0.8) score += 5;
    else if (coverage >= 0.5) score += 3;
  }

  // Fee burden (20%)
  const royaltyMatch = brand.royaltyRate.match(/(\d+(?:\.\d+)?)\s*%/);
  if (royaltyMatch) {
    const pctVal = parseFloat(royaltyMatch[1]);
    if (pctVal <= 4) score += 10;
    else if (pctVal <= 6) score += 5;
    else if (pctVal >= 9) score -= 8;
    else if (pctVal >= 7) score -= 4;
  }

  const adMatch = brand.marketingFundRate.match(/(\d+(?:\.\d+)?)\s*%/);
  if (adMatch) {
    const pctVal = parseFloat(adMatch[1]);
    if (pctVal <= 1) score += 3;
    else if (pctVal >= 4) score -= 5;
    else if (pctVal >= 3) score -= 3;
  }

  // Supplier burden (10%)
  if (brand.item8) {
    if (brand.item8.lockInScore != null) {
      if (brand.item8.lockInScore >= 8) score -= 8;
      else if (brand.item8.lockInScore >= 6) score -= 4;
      else if (brand.item8.lockInScore <= 3) score += 5;
    }
    if (brand.item8.franchisorReceivesSupplierRevenue) score -= 3;
  }

  // Support vs fee take (15%)
  if (brand.item11) {
    const totalHours = (brand.item11.classroomHours ?? 0) + (brand.item11.ojtHours ?? 0);
    if (totalHours >= 200) score += 8;
    else if (totalHours >= 100) score += 4;
    else if (totalHours > 0 && totalHours < 40) score -= 3;
    if (brand.item11.hasFieldSupport) score += 3;
  }

  // Investment-to-revenue ratio stress (10%) — uses only FDD-disclosed figures
  if (investMid > 0 && i19.grossRevenueAvg > 0) {
    const ratio = investMid / i19.grossRevenueAvg;
    if (ratio <= 0.5) score += 5;       // investment < half of annual revenue
    else if (ratio <= 1.0) score += 2;   // investment < 1 year revenue
    else if (ratio >= 3.0) score -= 5;   // investment > 3x annual revenue
  }

  return clamp100(score);
}

/* ── Coverage Status ── */
function computeCoverageStatus(brand: FranchiseBrand): EconomicsCoverageStatus {
  if (brand.hasItem19 && brand.item19?.grossRevenueAvg) return "economics-rated";
  if (brand.hasItem19 === true) return "economics-disclosed-not-normalized";
  if (brand.hasItem19 === false) return "economics-not-disclosed";
  return "economics-not-in-corpus";
}

/* ── Composite Grade ── */
function computeCompositeGradeFromScores(
  scores: { systemHealth: number | null; franchisorStrength: number | null;
            contractBurden: number | null; confidence: number; economics: number | null }
): { grade: CompositeGrade | null; raw: number | null } {
  if (scores.economics === null || scores.confidence < 40) return { grade: null, raw: null };

  const core = [scores.systemHealth, scores.franchisorStrength, scores.contractBurden].filter((v): v is number => v !== null);
  if (core.length < 2) return { grade: null, raw: null };

  const coreAvg = core.reduce((a, b) => a + b, 0) / core.length;
  const raw = scores.economics * 0.30 + coreAvg * 0.60 + scores.confidence * 0.10;

  let multiplier: number;
  if (scores.confidence >= 85) multiplier = 0.99;
  else if (scores.confidence >= 70) multiplier = 0.95;
  else if (scores.confidence >= 55) multiplier = 0.86;
  else multiplier = 0.72;

  const adjusted = raw * multiplier;
  return { grade: gradeFromScore(adjusted), raw: Math.round(adjusted) };
}

/* ── Main Production Score Function ── */
export function computeProductionScores(brand: FranchiseBrand): ProductionScores {
  const systemHealth = productionSystemHealth(brand);
  const franchisorStrength = productionFranchisorStrength(brand);
  const contractBurden = productionContractBurden(brand);
  const confidence = productionConfidence(brand);
  const economics = productionEconomics(brand);
  const coverageStatus = computeCoverageStatus(brand);

  const coreScores = [systemHealth, franchisorStrength, contractBurden].filter((v): v is number => v !== null);
  const coreDiligence = coreScores.length > 0
    ? Math.round(coreScores.reduce((a, b) => a + b, 0) / coreScores.length)
    : null;

  const { grade: compositeGrade, raw: compositeRaw } = computeCompositeGradeFromScores({
    systemHealth, franchisorStrength, contractBurden, confidence, economics,
  });

  return {
    systemHealth, franchisorStrength, contractBurden, confidence, economics,
    compositeGrade, compositeRaw, coverageStatus, coreDiligence,
  };
}
