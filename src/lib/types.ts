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

  /* Unit Economics (Item 20) */
  unitEconomics: UnitEconomics;

  /* Litigation (Item 3) */
  litigation: LitigationSummary;

  /* Scores (0-10) — editorial analysis, not sourced from FDD */
  scores: FranchiseScores;

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

export interface Item19Data {
  grossRevenueAvg?: number;
  grossRevenueMedian?: number;
  grossRevenue25th?: number;
  grossRevenue75th?: number;
  cogsPercent?: number;
  netIncomeAvg?: number;
  unitsIncluded: number;
  basis: "all_units" | "subset" | "geographic";
  timePeriod: string;
  notes?: string;
  /** true ONLY if these numbers were extracted from the actual filed FDD.
   *  If false/absent, these are industry estimates and MUST be labeled as such. */
  verifiedFromFDD?: boolean;
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

export interface FranchiseScores {
  investmentValue: number;      // 0-10: Is investment worth it?
  franchiseeSupport: number;    // 0-10: Quality of franchisor support
  financialTransparency: number;// 0-10: How transparent is the FDD?
  unitGrowth: number;           // 0-10: Health of unit growth
  brandStrength: number;        // 0-10: Brand recognition & strength
  territoryProtection: number;  // 0-10: How well are territories protected?
}

export interface RedFlag {
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  description: string;
  fddReference?: string; // e.g. "Item 19, Page 142"
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

/* Helper to calculate overall franchise score */
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
