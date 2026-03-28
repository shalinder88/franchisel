/**
 * FDD Vault — Franchise Disclosure Document Factual Data
 *
 * This file defines types for FACTUAL FIELDS extracted from
 * government-filed FDD records. Every field traces to a specific
 * state database filing.
 *
 * APPROVED SOURCES (with legal posture):
 * - Minnesota CARDS: cards.web.commerce.state.mn.us/franchise-registrations
 *   Risk: medium-low for factual extraction + linking. MN Data Practices Act
 *   treats filed documents as public data. No framing, no implied endorsement.
 *
 * - Wisconsin DFI: apps.dfi.wi.gov/apps/FranchiseSearch/MainSearch.aspx
 *   Risk: medium for factual extraction. Records are public under WI law.
 *   Site asserts copyright — do NOT mirror pages or bulk-republish.
 *   Extract factual metadata only (names, dates, status, numbers).
 *
 * - California DFPI: docqnet.dfpi.ca.gov/search/
 *   Risk: medium-low. DFPI says content is "generally public domain unless
 *   otherwise indicated." Do not bypass security features or maintenance blocks.
 *
 * PROHIBITED SOURCE:
 * - NASAA EFD: CANNOT USE. Terms explicitly prohibit commercial exploitation,
 *   redistribution, database creation for sale, and subscription services.
 *   See: nasaa.org/wp-content/uploads/2013/03/Final-EFD-Filer-Terms-of-Use.pdf
 *
 * LEGAL COMPLIANCE RULES:
 * 1. FACTS ONLY: fees, investment ranges, unit counts, filing dates, registration
 *    status, yes/no flags. These are non-copyrightable facts.
 * 2. NO NARRATIVE TEXT: Do not copy risk disclosures, agreement summaries,
 *    financial performance wording, or explanatory paragraphs from FDDs.
 * 3. NO FRANCHISEE CONTACT INFO: Never extract/index personal names, phone
 *    numbers, or addresses from Item 20 franchisee lists.
 * 4. NO PDF MIRRORING: We link to official state filing pages. We do not
 *    host, serve, cache, or redistribute FDD PDFs.
 * 5. FULL PROVENANCE: Every data point carries source state, file number,
 *    filing date, effective/expiration date, FDD year, and last-checked date.
 * 6. NO IMPLIED ENDORSEMENT: We are not affiliated with any state agency
 *    or franchisor. Disclaimers on every page.
 * 7. STALENESS LABELS: Every record shows FDD year and filing date prominently.
 *    Never flatten old+new into one apparent "current truth."
 * 8. CORRECTION WORKFLOW: Maintain takedown/correction process and retain
 *    extraction audit trail for dispute resolution.
 *
 * GREEN uses: extract fees, investment ranges, filing dates, outlet counts,
 *   litigation/bankruptcy flags, registration status; show our own charts;
 *   deep-link to originals.
 * YELLOW uses: quote short excerpts with commentary; use franchisor names
 *   in neutral listings. Needs tighter review.
 * RED uses: public mirror of full FDD PDFs; bulk republication; scraping
 *   around access controls; surfacing franchisee contact info; designs
 *   that look official or endorsed.
 */

export type FDDSource = "mn_cards" | "wi_dfi" | "ca_dfpi";

export type ExtractionMethod = "automated" | "human_verified" | "pending_review";

/**
 * Filing reference — links to the official state page, does NOT store the PDF.
 * Per legal framework: we link out to originals, never host/mirror documents.
 */
export interface FDDFilingReference {
  /** Which state database this came from */
  source: FDDSource;
  /** State file/registration number */
  stateFileNumber: string;
  /** Date the FDD was received/filed with the state */
  filingDate: string;
  /** FDD effective date (registration period) */
  effectiveDate?: string;
  /** FDD expiration date */
  expirationDate?: string;
  /**
   * Direct deep-link to the SPECIFIC document on the state website.
   * Must go directly to the filing/PDF — NOT a general search page.
   * User clicks this and lands on the exact document we're citing.
   * Examples:
   *   MN CARDS: "https://cards.web.commerce.state.mn.us/franchise-registrations/35596-202503-01.pdf"
   *   WI DFI:   "https://apps.dfi.wi.gov/apps/FranchiseSearch/FilingDetail.aspx?id=638763"
   *   CA DFPI:  "https://docqnet.dfpi.ca.gov/search/filing/12345"
   */
  officialFilingUrl: string;
  /** Date we last verified this filing existed at the official URL */
  lastVerifiedDate: string;
  /** Document type as listed on state site (e.g., "Clean FDD", "Marked FDD") */
  documentType?: string;
  /**
   * INTERNAL ARCHIVE ONLY — not served to public.
   * We keep a private copy of the PDF for legal/audit purposes:
   * - Evidence of what the FDD said at time of extraction
   * - Protection against state site downtime or data purges
   * - Dispute resolution if accuracy is challenged
   * This file is NEVER hosted, served, or made accessible to users.
   * The public-facing link is always `officialFilingUrl` above.
   */
  internalArchivePath?: string;
  /** SHA-256 hash of the archived PDF for integrity verification */
  archiveHash?: string;
}

/** Item 1: The Franchisor and Any Parents, Predecessors, and Affiliates */
export interface FDDItem1 {
  franchiseSystemName: string;
  franchisorLegalName: string;
  franchisorState: string;
  franchisorAddress: string;
  parentCompany: string | null;
  predecessors: string[];
  affiliates: string[];
  /** DO NOT store narrative business description — copyrightable. Factual category only. */
  businessCategory: string | null;
  yearFranchiseEstablished: number | null;
  yearFirstFranchised: number | null;
}

/** Item 3: Litigation */
export interface FDDItem3 {
  hasLitigation: boolean;
  pendingActions: number | null;
  priorActions: number | null;
  /** DO NOT store litigation narrative — copyrightable. Count + yes/no flags only. */
}

/** Item 5: Initial Fees */
export interface FDDItem5 {
  initialFranchiseFee: number | null;
  initialFranchiseFeeHigh: number | null;
  feeIsUniform: boolean | null;
  feeNotes: string | null;
  /** Other initial fees listed */
  otherInitialFees: Array<{
    feeName: string;
    amount: string;
    notes: string | null;
  }>;
}

/** Item 6: Other Fees */
export interface FDDItem6 {
  royaltyRate: string | null;
  royaltyNotes: string | null;
  advertisingFundRate: string | null;
  advertisingNotes: string | null;
  localAdvertisingRate: string | null;
  technologyFee: string | null;
  transferFee: string | null;
  renewalFee: string | null;
  /** All other ongoing fees listed in Item 6 table */
  otherOngoingFees: Array<{
    feeName: string;
    amount: string;
    dueDate: string | null;
    notes: string | null;
  }>;
}

/** Item 7: Estimated Initial Investment */
export interface FDDItem7 {
  totalInvestmentLow: number | null;
  totalInvestmentHigh: number | null;
  /** Individual line items from the Item 7 table */
  lineItems: Array<{
    category: string;
    amountLow: number | null;
    amountHigh: number | null;
    methodOfPayment: string | null;
    whenDue: string | null;
    toWhomPaid: string | null;
  }>;
  /** Whether Item 7 includes additional notes/footnotes (flag only — do NOT copy text) */
  hasNotes: boolean;
}

/**
 * Item 11: Franchisor's Obligations — FACTUAL FLAGS ONLY.
 * The actual obligation descriptions are copyrightable narrative.
 * We store only yes/no presence flags.
 */
export interface FDDItem11 {
  providesPreOpeningAssistance: boolean;
  providesOngoingAssistance: boolean;
  hasTrainingProgram: boolean;
  trainingDurationDays: number | null;
}

/** Item 19: Financial Performance Representations */
export interface FDDItem19 {
  hasItem19: boolean;
  /** If false, this means the franchisor chose NOT to make financial performance representations */
  disclosesFinancialPerformance: boolean;
  /**
   * FACTUAL NUMBERS ONLY from Item 19 tables.
   * DO NOT store narrative text, disclaimers, or explanatory paragraphs —
   * those are copyrightable expression. Extract only the numbers.
   */
  averageGrossSales: number | null;
  medianGrossSales: number | null;
  averageNetIncome: number | null;
  numberOfUnitsReported: number | null;
  reportingPeriod: string | null;
  /** Whether the Item 19 includes caveats (yes/no flag — do NOT copy the text) */
  hasCaveats: boolean;
}

/** Item 20: Outlets and Franchisee Information */
export interface FDDItem20 {
  /** Table 1: Systemwide Outlet Summary for years ended... */
  systemwideOutletSummary: Array<{
    year: number;
    outletType: string;
    beginningOfYear: number | null;
    opened: number | null;
    terminated: number | null;
    nonRenewed: number | null;
    reacquiredByFranchisor: number | null;
    ceasedOperations: number | null;
    endOfYear: number | null;
  }>;
  /** Table 3: Status of Franchised Outlets for years ended... */
  franchisedOutletStatus: Array<{
    year: number;
    beginningOfYear: number | null;
    opened: number | null;
    terminated: number | null;
    nonRenewed: number | null;
    reacquiredByFranchisor: number | null;
    ceasedOperations: number | null;
    endOfYear: number | null;
  }>;
  /** Table 4: Status of Company-Owned Outlets */
  companyOwnedOutletStatus: Array<{
    year: number;
    beginningOfYear: number | null;
    opened: number | null;
    closedOrSold: number | null;
    endOfYear: number | null;
  }>;
}

/** Complete FDD record — one per franchisor per filing */
export interface FDDRecord {
  /** Unique ID: source-fileNumber-year (e.g., "mn_cards-35596-2025") */
  id: string;
  /** Filing provenance — links directly to the specific document, not a general search page */
  filing: FDDFilingReference;
  /** FDD year (the year the FDD covers) */
  fddYear: number;
  /** Extraction metadata */
  extractedDate: string;
  extractedBy: ExtractionMethod;
  /** The 23 Items (we extract the most critical ones) */
  item1: FDDItem1 | null;
  item3: FDDItem3 | null;
  item5: FDDItem5 | null;
  item6: FDDItem6 | null;
  item7: FDDItem7 | null;
  item11: FDDItem11 | null;
  item19: FDDItem19 | null;
  item20: FDDItem20 | null;
}

/** Registry of all cataloged FDD filings across state databases */
export interface FDDFilingRegistry {
  /** When this registry was last updated */
  lastUpdated: string;
  /** Total filings cataloged */
  totalFilings: number;
  /** Total unique franchisors */
  totalFranchisors: number;
  /** All cataloged filings — each links directly to the specific document on the state site */
  filings: FDDFilingReference[];
}
