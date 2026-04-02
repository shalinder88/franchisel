/* ══════════════════════════════════════════════════════
   Franchise Due Diligence Intelligence Platform — Types
   ══════════════════════════════════════════════════════ */

/* ── Data Provenance ──
 * CRITICAL: Every data point on this platform must be traceable to a verifiable
 * public source. If data cannot be verified, it MUST be labeled as "estimated"
 * or removed entirely. This is a legal requirement — franchisors WILL send
 * cease-and-desist letters for inaccurate data attributed to their FDD.
 *
 * Data source hierarchy (most to least trustworthy):
 * 1. "fdd_verified"  — Extracted directly from a filed FDD document
 * 2. "sec_filing"    — From SEC 10-K/10-Q for publicly traded franchisors
 * 3. "state_filing"  — From state franchise registration filings
 * 4. "public_record" — From franchisor's public website or press releases
 * 5. "industry_estimate" — From industry reports, analyst estimates, or
 *                          approximate figures based on publicly known ranges.
 *                          MUST be labeled as estimates in the UI.
 *
 * All financial figures labeled "industry_estimate" are approximate and
 * pending verification against actual FDD filings. They should NEVER be
 * presented as FDD-sourced data in the UI.
 */
export type DataSource =
  | "fdd_verified"
  | "sec_filing"
  | "state_filing"
  | "public_record"
  | "industry_estimate";

export interface FranchiseBrand {
  slug: string;
  name: string;
  parentCompany: string;
  logoUrl?: string;
  yearFounded: number;
  yearFranchisingBegan: number;
  headquartersState: string;
  description: string;
  tagline: string;
  category: FranchiseCategory;
  subcategory?: string;

  /* ── Data provenance ── */
  dataSource: DataSource;   // Primary source for this brand's financial data
  fddAccessed?: boolean;    // true ONLY if we have directly reviewed the FDD
  sourceNotes?: string;     // Human-readable note on where data comes from

  /* Unit counts */
  totalUnits: number;
  franchisedUnits: number;
  companyOwnedUnits: number;
  statesOfOperation: number;

  /* Financial structure (FDD Items 5-7) */
  initialFranchiseFee: number;
  totalInvestmentLow: number;
  totalInvestmentHigh: number;
  royaltyRate: string; // e.g. "6%" or "$500/week"
  royaltyStructure: "percentage" | "flat" | "hybrid";
  marketingFundRate: string;
  technologyFee?: number;
  otherOngoingFees?: string[];

  /* Item 19 Financial Performance */
  hasItem19: boolean;
  item19?: Item19Data;
  /** Prior-year Item 19 data for year-over-year comparison */
  item19Prior?: { grossRevenueAvg?: number; fddYear?: number };

  /* Unit Economics (Item 20) */
  unitEconomics: UnitEconomics;

  /* Litigation (Item 3) */
  litigation: LitigationSummary;

  /* Item 4 — Bankruptcy */
  item4?: Item4Data;

  /* Item 11 — Training & Support */
  item11?: Item11Data;

  /* Item 8 — Required Purchases & Supplier Restrictions */
  item8?: Item8Data;

  /* Item 10 — Financing */
  item10?: Item10Data;

  /* Item 12 — Territory */
  item12?: Item12Data;

  /* Item 17 — Renewal, Termination & Transfer */
  item17?: Item17Data;

  /* Item 21 — Franchisor Financial Statements */
  item21?: Item21Data;

  /* State concentration — from Item 20 Table 3 (Outlets by State) */
  stateConcentration?: StateConcentrationData;

  /* Broker / FSO mapping — from Item 1, 5, 6 disclosures */
  brokerData?: BrokerData;

  /* Management quality signals — from FDD Item 2 (Business Experience) */
  managementData?: ManagementData;

  /* Scores (0-10) — editorial analysis, not sourced from FDD */
  scores: FranchiseScores;

  /* FDD-derived composite scores — computed from verified FDD item data */
  compositeScores?: CompositeFDDScores;

  /* Red flags */
  redFlags: RedFlag[];

  /* Community data — set to 0 until real submissions exist */
  communityReviews: number;
  communityAvgSatisfaction?: number;
  communityAvgFirstYearRevenue?: number;

  /* Metadata */
  fddYear: number;
  lastUpdated: string;
  dataVerified: string;
  reportAvailable: boolean;
  featured?: boolean;
}

/**
 * Expanded revenue type taxonomy.
 * Controls what labels are safe to display and what derived metrics are allowed.
 * "gross" and "net" are legacy values — normalizeRevenueType() maps them forward.
 */
export type Item19RevenueType =
  | "gross_sales"       // Top-line gross sales/revenue
  | "net_sales"         // Sales after returns/discounts but before operating costs
  | "gross_profit"      // Revenue minus COGS
  | "ebitda"            // Earnings before interest, taxes, depreciation, amortization
  | "operating_income"  // Revenue minus all operating expenses
  | "net_income"        // Bottom-line profit after all expenses and taxes
  | "cash_flow"         // Cash flow from operations
  | "unknown"           // FDD does not clearly specify
  | "gross"             // Legacy — treat as gross_sales
  | "net";              // Legacy — treat as net_sales

/**
 * What expense layers the FDD actually discloses for the Item 19 population.
 * Controls whether profit-like language is legally defensible.
 */
export type Item19ExpenseCoverage =
  | "none"                  // Revenue only, no expense breakdown
  | "franchisor_fees_only"  // Revenue minus royalty/ad (Tier 2 safe)
  | "partial_opex"          // Some operating expenses disclosed but not complete P&L
  | "full_pnl";             // Full income statement or profit/loss in Item 19

/**
 * Cross-brand comparability classification.
 * Auto-derived from data quality flags; also used to gate rankings.
 */
export type Item19Comparable = "full" | "limited" | "weak";

export interface Item19Data {
  grossRevenueAvg?: number;
  grossRevenueMedian?: number;
  grossRevenue25th?: number;
  grossRevenue75th?: number;
  cogsPercent?: number;
  netIncomeAvg?: number;
  unitsIncluded: number;
  /** Total outlets eligible (e.g. 800 total, 650 open >1yr = 650 included) */
  totalEligibleUnits?: number;
  basis: "all_units" | "open_over_1yr" | "subset" | "geographic";
  /**
   * What the Item 19 metric actually measures.
   * CRITICAL: Only use profit/earnings labels when this is ebitda, operating_income,
   * net_income, or gross_profit. For gross_sales/net_sales, use "Sales" labels only.
   */
  revenueType?: Item19RevenueType;
  timePeriod: string;
  /** Calendar or fiscal year the data covers (e.g. 2024) */
  measurementYear?: number;
  /** Note on company-unit exclusion (e.g. "excludes 12 company-owned outlets") */
  excludedNote?: string;
  /** Extraction confidence: high = regex hit on numbers, medium = inferred, low = weak signal */
  extractionConfidence?: "high" | "medium" | "low";
  notes?: string;
  /** true ONLY if these numbers were extracted from the actual filed FDD.
   *  If false/absent, these are industry estimates and MUST be labeled as such. */
  verifiedFromFDD?: boolean;

  /* ── New taxonomy fields (FTC-defensibility layer) ── */

  /** What expense layers the FDD actually discloses for this Item 19 population */
  expenseCoverage?: Item19ExpenseCoverage;
  /** True when revenue and expense figures refer to the same outlets and period */
  sameCohort?: boolean;
  /** Cross-brand comparability — auto-derived or manually set */
  comparable?: Item19Comparable;
}

/** Normalize legacy "gross"/"net" values to expanded taxonomy */
export function normalizeRevenueType(rt: Item19RevenueType | undefined): Item19RevenueType {
  if (!rt) return "unknown";
  if (rt === "gross") return "gross_sales";
  if (rt === "net") return "net_sales";
  return rt;
}

/** Human-readable label for the disclosed metric type */
export function revenueTypeLabel(rt: Item19RevenueType | undefined): string {
  switch (normalizeRevenueType(rt)) {
    case "gross_sales": return "Reported Gross Sales";
    case "net_sales": return "Reported Net Sales";
    case "gross_profit": return "Reported Gross Profit";
    case "ebitda": return "Reported EBITDA";
    case "operating_income": return "Reported Operating Income";
    case "net_income": return "Reported Net Income";
    case "cash_flow": return "Reported Cash Flow";
    case "unknown": return "Reported Revenue (Type Unspecified)";
    default: return "Reported Revenue";
  }
}

/** Whether the revenue type represents a profit-like metric (expense-adjusted) */
export function isProfitMetric(rt: Item19RevenueType | undefined): boolean {
  const normalized = normalizeRevenueType(rt);
  return ["gross_profit", "ebitda", "operating_income", "net_income", "cash_flow"].includes(normalized);
}

export interface UnitEconomics {
  unitsStartOfPeriod: number;
  unitsEndOfPeriod: number;
  unitsOpened: number;
  unitsClosed: number;
  unitsTransferred: number;
  netGrowth: number;
  threeYearGrowthRate?: number;
  fiveYearGrowthRate?: number;
  turnoverRate: number; // percentage
  /** NASAA Item 20 detailed exit breakdown (when extracted from FDD) */
  unitsTerminated?: number;       // forced termination by franchisor
  unitsNonRenewed?: number;       // franchisor declined to renew
  unitsReacquired?: number;       // franchisor bought back
  unitsCeasedOperations?: number; // franchisee voluntarily closed
  /** Signed agreements but not yet open (pipeline backlog) */
  signedNotOpened?: number;
  /** Company-owned unit changes (separate NASAA table) */
  companyUnitsOpened?: number;
  companyUnitsClosed?: number;
  companyUnitsReacquired?: number;
  /** Multi-year history: array of [year, netGrowth] for sparkline */
  yearlyNetGrowth?: Array<{ year: number; net: number; opened: number; closed: number }>;
}

export interface LitigationSummary {
  activeLawsuits: number;
  types: LitigationType[];
  trend: "increasing" | "stable" | "decreasing";
  notes?: string;
}

export type LitigationType =
  | "franchisee_vs_franchisor"
  | "regulatory"
  | "employment"
  | "trademark"
  | "other";

export interface Item4Data {
  hasBankruptcy: boolean;
  bankruptcyType?: "chapter_7" | "chapter_11" | "other";
  bankruptcyYear?: number;
  notes?: string;
}

export interface Item11Data {
  classroomHours?: number;
  ojtHours?: number;
  totalTrainingHours?: number;
  trainingWeeks?: number;
  trainingLocation?: string;
  hasAnnualConference?: boolean;
  hasOngoingTraining?: boolean;
  hasFieldSupport?: boolean;
  hasTechnologySystem?: boolean;
}

export interface Item8Data {
  /** Whether franchisee must purchase from franchisor or approved suppliers */
  hasRequiredPurchases?: boolean;
  /** Whether franchisor or affiliate receives revenue from supplier arrangements */
  franchisorReceivesSupplierRevenue?: boolean;
  /** Must purchase from a defined approved supplier list */
  approvedSupplierList?: boolean;
  /** Franchisee may use alternative suppliers with franchisor approval */
  alternativeSupplierPossible?: boolean;
  /** Only specifications required — franchisee can source freely if specs met */
  specificationsOnly?: boolean;
  /** Categories of mandatory purchasing (e.g. food_ingredients, technology) */
  mandatoryCategories?: string[];
  /** Description of franchisor/affiliate revenue from supplier arrangements */
  supplierRevenueNote?: string;
  /** Supplier lock-in score: 0 = fully open, 10 = fully locked to franchisor */
  lockInScore?: number;
  extractionConfidence?: "high" | "medium" | "low";
}

export interface Item10Data {
  /** Whether franchisor directly offers financing (vs no financing or referral only) */
  offersFinancing?: boolean;
  /** True when franchisor only refers to third-party lenders (SBA, banks, etc.) */
  thirdPartyOnly?: boolean;
  /** Maximum loan amount in dollars */
  loanAmount?: number;
  /** Annual interest rate (%) — from FDD Item 10 */
  interestRate?: number;
  /** Loan repayment term in months */
  termMonths?: number;
  /** Whether collateral is required for franchisor financing */
  collateral?: boolean;
  /** Whether cross-default clause exists (default on franchise = default on loan) */
  crossDefault?: boolean;
  /** Whether personal guarantee is required */
  personalGuarantee?: boolean;
  extractionConfidence?: "high" | "medium" | "low";
}

export interface Item12Data {
  exclusiveTerritory?: boolean;
  territoryType?: "radius" | "zip" | "population" | "geographic" | "none";
  territoryRadius?: number;       // miles
  territoryPopulation?: number;
  franchisorMayCompete?: boolean;
  onlineSalesReserved?: boolean;
  hasPerformanceRequirement?: boolean;
}

export interface Item17Data {
  initialTermYears?: number;
  renewalCount?: number;
  renewalTermYears?: number;
  renewalFee?: number | "varies";
  transferFee?: number | "varies";
  franchisorCanTerminateWithCause?: boolean;
  curePeriodDays?: number;
  hasNonCompete?: boolean;
  nonCompeteYears?: number;
  nonCompeteMiles?: number;
  mandatoryArbitration?: boolean;
  disputeVenue?: string;
}

export interface Item21Data {
  hasAuditedFinancials?: boolean;
  auditorName?: string;
  fiscalYearEnd?: string;
  /** Auditor opinion: clean = unqualified, qualified = with exception, adverse, disclaimer */
  auditorOpinion?: "clean" | "qualified" | "adverse" | "disclaimer" | "unknown";
  goingConcernWarning?: boolean;
  /** Key financial figures (most recent audited year) */
  franchisorRevenue?: number;
  franchisorTotalAssets?: number;
  franchisorTotalLiabilities?: number;
  franchisorEquity?: number;
  franchisorNetIncome?: number;
  franchisorCashAndEquivalents?: number;
  /** Simple ratios for strength scoring */
  currentRatio?: number;           // current assets / current liabilities
  debtToEquityRatio?: number;      // total debt / equity
  /** Year-over-year revenue trend */
  revenueYoYPct?: number;          // % change vs prior year
  /** Extracted financial health signal */
  financialStrengthSignal?: "strong" | "adequate" | "watch" | "weak";
}

/**
 * @deprecated Legacy editorial scores — being replaced by ProductionScores.
 * Kept temporarily for backward compatibility during migration.
 */
export interface FranchiseScores {
  investmentValue: number;
  franchiseeSupport: number;
  financialTransparency: number;
  unitGrowth: number;
  brandStrength: number;
  territoryProtection: number;
}

/**
 * @deprecated Legacy composite scores — replaced by ProductionScores.
 */
export interface CompositeFDDScores {
  systemHealth?: number | null;
  franchisorStrength?: number | null;
  economicBurden?: number | null;
  supportVsTake?: number | null;
  contractFriction?: number | null;
  changeScore?: number | null;
}

/* ══════════════════════════════════════════════════════
   PRODUCTION SCORING METHODOLOGY
   ══════════════════════════════════════════════════════
   Five separate scores + optional composite, grounded in
   FTC Franchise Rule's 23-item FDD framework.

   Core principle: Missing data = incomplete evidence, NOT bad score.
   No economics data = no economics score ≠ bad economics.
*/

/**
 * Coverage status describes WHY economics may or may not be scored.
 * This distinction is legally important — "not disclosed" is different
 * from "not yet extracted from our corpus."
 */
export type EconomicsCoverageStatus =
  | "economics-rated"                    // Normalized Item 19 exists, economics scored
  | "economics-not-in-corpus"            // Brand may have Item 19 but not in MN/WI filings we cover
  | "economics-disclosed-not-normalized" // hasItem19=true but no normalized revenue extracted
  | "economics-not-disclosed";           // hasItem19=false — franchisor chose not to include

export type CompositeGrade = "A" | "B" | "C" | "D" | "F";

/**
 * Production scores — the sole scoring system shown to users.
 * Computed at render time from FDD-extracted data. Never stored in brands.ts.
 */
export interface ProductionScores {
  /* ── Core Diligence (available for all brands with data) ── */

  /** System Health (0-100): Item 20 churn, growth, closures, transfers.
   *  null = insufficient Item 20 data. */
  systemHealth: number | null;

  /** Franchisor Strength (0-100): Item 21 financials + Items 3-4 litigation/bankruptcy.
   *  null = no Item 21 and no Item 4 data. */
  franchisorStrength: number | null;

  /** Contract Burden (0-100): Item 17 terms + Item 12 territory.
   *  100 = lightest burden / most franchisee-friendly. null = no Item 17. */
  contractBurden: number | null;

  /** Confidence (0-100): data completeness, extraction quality, recency.
   *  Always computed — never null. */
  confidence: number;

  /* ── Economics (ONLY when normalized Item 19 exists) ── */

  /** Economics Score (0-100): Item 19 performance + fee burden + downside stress.
   *  null = no normalized Item 19 → "Economics: Not Rated". */
  economics: number | null;

  /* ── Composite (only when conditions met) ── */

  /** Composite grade A-F. null = insufficient data for composite. */
  compositeGrade: CompositeGrade | null;
  /** Raw composite score 0-100 before grade banding. */
  compositeRaw: number | null;

  /* ── Coverage ── */
  coverageStatus: EconomicsCoverageStatus;

  /** Core Diligence Score: average of available core scores (systemHealth,
   *  franchisorStrength, contractBurden). 0-100. Always available if any
   *  core score exists. */
  coreDiligence: number | null;
}

export interface RedFlag {
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  description: string;
  fddReference?: string; // e.g. "Item 19, Page 142"
}

/**
 * Broker / Franchise Sales Organization (FSO) data extracted from FDD Items 1, 5, and 6.
 *
 * Many franchisors sell franchises through broker networks (e.g. FranChoice, FranServe,
 * Fransquare, The Entrepreneur's Source). These brokers are paid by the franchisor — a
 * conflict of interest that franchise buyers should understand.
 */
export interface BrokerData {
  /** True if the FDD discloses use of franchise brokers or FSOs for sales */
  usesBrokers?: boolean;
  /** Named broker networks or FSOs disclosed in Item 1 */
  brokerNetworks?: string[];
  /** Broker fee paid by franchisor (% of initial fee, or flat) */
  brokerFeeNote?: string;
  /** Whether the franchisor pays a referral fee to any third-party for leads */
  paysReferralFee?: boolean;
  /** Direct link/note from Item 5 or 6 about broker/referral fee */
  feeDisclosureNote?: string;
  /**
   * Conflict-of-interest risk level:
   * - "high"   — FSO network used, franchisor pays commission
   * - "medium" — referral fees mentioned but limited scope
   * - "low"    — direct sales only, no broker involvement
   * - "unknown" — no data
   */
  conflictRisk?: "high" | "medium" | "low" | "unknown";
  extractionConfidence?: "high" | "medium" | "low";
}

/**
 * Management quality signals extracted from FDD Item 2 (Business Experience).
 * Item 2 lists the name, position, and 5-year employment history for each
 * officer, director, and manager of the franchisor.
 */
export interface ManagementData {
  /** Number of distinct senior executive roles identified in Item 2 */
  execCount?: number;
  /** True if any listed executive has prior franchise system experience */
  hasFranchiseExp?: boolean;
  /** True if leadership team includes executives with 5+ year tenures */
  hasStableLeadership?: boolean;
  /** True if there were 2+ recent leadership hires (within 2 yrs of FDD date) */
  hasLeadershipChanges?: boolean;
  /** Derived management quality score 0-10 (10 = strongest management signal) */
  managementQualityScore?: number;
  extractionConfidence?: "high" | "medium" | "low";
}

/** State concentration data derived from Item 20 Table No. 3 (Outlets by State) */
export interface StateConcentrationData {
  /** Per-state unit breakdown extracted from FDD Item 20 Table 3 */
  byState?: Array<{ state: string; units: number }>;
  /** Number of states with at least one franchise unit */
  stateCount: number;
  /** Herfindahl-Hirschman Index (0–1); higher = more geographically concentrated */
  hhi?: number;
  /** Share of all units in the single largest state (%) */
  topStateSharePct?: number;
  /** State with the most units */
  topState?: string;
  /** True if any single state holds >50% of all units */
  highlyConcentrated: boolean;
  /**
   * Coverage classification:
   * national    = 25+ states
   * regional    = 6–24 states
   * local       = 2–5 states
   * single_state = 1 state
   * unknown     = no state data
   */
  coverageType: "national" | "regional" | "local" | "single_state" | "unknown";
  extractionConfidence?: "high" | "medium" | "low";
}

export type FranchiseCategory =
  | "food-beverage"
  | "fitness-wellness"
  | "home-services"
  | "automotive"
  | "childcare-education"
  | "business-services"
  | "health-beauty"
  | "retail"
  | "cleaning-maintenance"
  | "pet-services"
  | "senior-care"
  | "real-estate"
  | "technology"
  | "travel-hospitality";

export interface CategoryInfo {
  slug: FranchiseCategory;
  name: string;
  description: string;
  icon: string;
  brandCount: number;
  avgInvestment: string;
  avgRoyalty: string;
}

export interface CommunityReview {
  id: string;
  brandSlug: string;
  state: string;
  metro?: string;
  yearOpened: number;
  totalInvestmentActual: number;
  firstYearGrossRevenue?: number;
  firstYearNetIncome?: number;
  currentYearGrossRevenue?: number;
  supportQuality: number; // 1-10
  wouldDoAgain: "yes" | "no" | "unsure";
  biggestSurprise?: string;
  biggestRegret?: string;
  exitPlan: "staying" | "selling" | "closing";
  verified: boolean;
  verificationMethod?: "item20_match" | "document_upload" | "unverified";
  submittedAt: string;
}

export interface FranchiseComparison {
  slugA: string;
  slugB: string;
  verdict: string;
  highlights: string[];
}

export interface FranchiseGuide {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  content: string;
  featured?: boolean;
}

export interface ReportTier {
  id: "standard" | "premium" | "executive";
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

/**
 * @deprecated Use computeProductionScores().coreDiligence instead.
 */
export function getOverallScore(scores: FranchiseScores): number {
  const weights = {
    investmentValue: 0.25,
    franchiseeSupport: 0.20,
    financialTransparency: 0.20,
    unitGrowth: 0.15,
    brandStrength: 0.10,
    territoryProtection: 0.10,
  };
  return Number(
    (
      scores.investmentValue * weights.investmentValue +
      scores.franchiseeSupport * weights.franchiseeSupport +
      scores.financialTransparency * weights.financialTransparency +
      scores.unitGrowth * weights.unitGrowth +
      scores.brandStrength * weights.brandStrength +
      scores.territoryProtection * weights.territoryProtection
    ).toFixed(1)
  );
}

/* ── Production score display helpers ── */

/** Grade band label for 0-100 scores */
export function gradeFromScore(score: number): CompositeGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

/** Color class for 0-100 production scores */
export function productionScoreColor(score: number | null): string {
  if (score === null) return "bg-surface";
  if (score >= 70) return "bg-success";
  if (score >= 55) return "bg-accent";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
}

export function productionScoreTextColor(score: number | null): string {
  if (score === null) return "text-muted";
  if (score >= 70) return "text-success";
  if (score >= 55) return "text-accent";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

/** Human-readable coverage status label */
export function coverageStatusLabel(status: EconomicsCoverageStatus): string {
  switch (status) {
    case "economics-rated": return "Economics Rated";
    case "economics-not-in-corpus": return "Not in Covered-Source Corpus";
    case "economics-disclosed-not-normalized": return "Item 19 — Figures Not Available";
    case "economics-not-disclosed": return "Not Disclosed in Reviewed Filing";
  }
}

/* Format currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* Format investment range */
export function formatInvestmentRange(low: number, high: number): string {
  if (low === 0 && high === 0) return "Not disclosed";
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

/* Category display names */
export const categoryLabels: Record<FranchiseCategory, string> = {
  "food-beverage": "Food & Beverage",
  "fitness-wellness": "Fitness & Wellness",
  "home-services": "Home Services",
  "automotive": "Automotive",
  "childcare-education": "Childcare & Education",
  "business-services": "Business Services",
  "health-beauty": "Health & Beauty",
  "retail": "Retail",
  "cleaning-maintenance": "Cleaning & Maintenance",
  "pet-services": "Pet Services",
  "senior-care": "Senior Care",
  "real-estate": "Real Estate",
  "technology": "Technology",
  "travel-hospitality": "Travel & Hospitality",
};
