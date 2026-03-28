/**
 * ============================================================================
 * FRANCHISEINTEL LEGAL AMENDMENTS — HARDCODED, IMMUTABLE
 * ============================================================================
 *
 * These are the founding rules of this business. Every developer, every agent,
 * every build process, every data pipeline must comply. No exceptions.
 * No "just this once." No shortcuts.
 *
 * If you are reading this and thinking about bypassing any of these rules,
 * stop. Close the file. Go talk to counsel first.
 *
 * Last updated: 2026-03-27
 * ============================================================================
 */

// ==========================================================================
// AMENDMENT I — SOURCE-SPECIFIC RISK POSTURE
// ==========================================================================

export const SOURCE_RISK_POSTURE = {
  mn_cards: {
    source: "Minnesota CARDS",
    url: "https://cards.web.commerce.state.mn.us/franchise-registrations",
    factualExtraction: "MEDIUM_LOW_RISK",
    pdfMirroring: "MEDIUM_RISK",
    chartsFromFacts: "LOW_RISK",
    rules: [
      "Do not imply state endorsement",
      "Preserve source and date context on every data point",
      "Minnesota warns users rely on website info at own risk — our site needs the same disclaimer",
      "Minnesota bars portraying its content falsely or implying state endorsement",
      "Do not frame Minnesota pages or present them misleadingly",
    ],
  },
  wi_dfi: {
    source: "Wisconsin DFI",
    url: "https://apps.dfi.wi.gov/apps/FranchiseSearch/MainSearch.aspx",
    factualExtraction: "MEDIUM_RISK",
    pdfMirroring: "HIGH_RISK",
    chartsFromFacts: "LOW_RISK",
    rules: [
      "Records are public and DFI explicitly offers access to franchise filing details and disclosure documents",
      "Higher risk for hosting copied PDFs or bulk republishing because site asserts copyright",
      "Public-record access is NOT the same as a commercial-republication license",
      "Extract factual metadata only — names, dates, status, numbers",
    ],
  },
  ca_dfpi: {
    source: "California DFPI",
    url: "https://docqnet.dfpi.ca.gov/search/",
    factualExtraction: "MEDIUM_LOW_RISK",
    pdfMirroring: "MEDIUM_RISK",
    chartsFromFacts: "LOW_RISK",
    rules: [
      "DFPI says content is generally public domain unless otherwise indicated",
      "Prohibits attempts to modify information on the system or defeat security features",
      "Disclaims accuracy and completeness",
      "Use factual extraction, preserve provenance, do not bypass technical limits",
      "Do not bypass maintenance blocks — CA DFPI was down Mar 27-31, 2026 and we waited",
    ],
  },
  nasaa_efd: {
    source: "NASAA EFD",
    url: "https://www.nasaaefd.org",
    factualExtraction: "PROHIBITED",
    pdfMirroring: "PROHIBITED",
    chartsFromFacts: "PROHIBITED",
    rules: [
      "CANNOT USE — terms explicitly prohibit commercial exploitation",
      "No copying, redistribution, retransmission, publication, or commercial exploitation",
      "No database creation for sale, lease, license, or free distribution",
      "No subscription services using NASAA data",
      "Get written license first or DO NOT USE",
      "See: nasaa.org/wp-content/uploads/2013/03/Final-EFD-Filer-Terms-of-Use.pdf",
    ],
  },
} as const;

// ==========================================================================
// AMENDMENT II — DATA EXTRACTION RULES
// ==========================================================================

export const EXTRACTION_RULES = {
  /** What we CAN extract (non-copyrightable facts) */
  GREEN_FIELDS: [
    "Filing dates",
    "Effective and expiration dates",
    "Registration status",
    "Franchisor legal name",
    "Franchise trade name",
    "State file number",
    "Initial franchise fee (Item 5 — number only)",
    "Other initial fees (Item 5 — amounts only)",
    "Royalty rate (Item 6 — rate/amount only)",
    "Advertising fund rate (Item 6 — rate/amount only)",
    "Other ongoing fees (Item 6 — names and amounts only)",
    "Total investment range low/high (Item 7 — numbers only)",
    "Item 7 line item amounts (numbers only)",
    "Litigation count and yes/no flags (Item 3 — counts only)",
    "Bankruptcy yes/no flag (Item 4)",
    "Item 19 financial performance numbers (averages, medians — numbers only)",
    "Item 19 yes/no: does franchisor make financial performance representations",
    "Item 20 outlet counts by year (numbers only)",
    "Item 20 openings, closings, transfers (numbers only)",
    "Year franchise system established",
    "Year first franchised",
    "Parent company name",
    "Training duration in days (number only)",
  ],

  /** What we CANNOT extract (copyrightable expression) */
  RED_FIELDS: [
    "Narrative business descriptions",
    "Risk disclosure language",
    "Agreement summaries or contract terms",
    "Financial performance explanatory paragraphs",
    "Item 19 caveats and disclaimer text",
    "Litigation narrative summaries",
    "Franchisor obligation descriptions (Item 11 narrative)",
    "Territory description narrative",
    "Renewal/termination condition narrative",
    "Any explanatory footnotes (verbatim text)",
    "Franchisee personal names from Item 20",
    "Franchisee phone numbers from Item 20",
    "Franchisee addresses from Item 20",
    "Franchisor logos or brand images",
    "Any copyrighted charts, graphs, or diagrams from the FDD",
  ],
} as const;

// ==========================================================================
// AMENDMENT III — PRESENTATION RULES
// ==========================================================================

export const PRESENTATION_RULES = {
  /** Every record displayed to users MUST show all of these */
  REQUIRED_PROVENANCE_FIELDS: [
    "Source state (e.g., 'Minnesota CARDS')",
    "Filing type (e.g., 'Clean FDD')",
    "Filing date",
    "Effective date (if available)",
    "Expiration date (if available)",
    "Last checked date (when we last verified the filing exists)",
    "Value origin: 'extracted' vs 'calculated by us' vs 'inferred by us'",
  ],

  /** Deep-linking rule */
  LINKING: "Every source link must go DIRECTLY to the specific document or filing page — NOT a general search page. The user clicks and lands on the exact document we are citing.",

  /** Staleness rule */
  STALENESS: "NEVER flatten old and new filings into one apparent 'current truth.' If your UI shows a single number, it MUST show which FDD year it came from. Misrepresentation risk exists even without intentional tampering.",

  /** Trademark rules */
  TRADEMARKS: [
    "Keep franchisor logos OUT unless there is a reason and a clean use rationale",
    "Never present a brand tile or badge in a way that looks official",
    "Minnesota policy explicitly bars portraying content falsely or implying state endorsement",
    "USPTO guidance: trademarks protect brand names and logos",
    "Use franchisor names in neutral text listings only",
  ],

  /** Endorsement rules */
  NO_ENDORSEMENT: [
    "We are not affiliated with any state agency",
    "We are not affiliated with any franchisor",
    "We do not endorse or recommend any franchise",
    "State data is provided as-is with no guarantee of accuracy",
    "Our charts, rankings, and comparisons are our own editorial work",
  ],
} as const;

// ==========================================================================
// AMENDMENT IV — TECHNICAL COMPLIANCE
// ==========================================================================

export const TECHNICAL_COMPLIANCE = {
  /** Scraping rules */
  SCRAPING: [
    "Do NOT bypass logins",
    "Do NOT bypass CAPTCHAs",
    "Do NOT bypass rate limits",
    "Do NOT bypass maintenance blocks",
    "Do NOT bypass security features",
    "California expressly prohibits attempts to defeat security features",
    "Minnesota warns against unauthorized attempts to alter information or access nonpublic systems",
    "If a state site is in maintenance, WAIT — do not try alternate routes",
  ],

  /** Archive rules */
  ARCHIVE: [
    "PDFs are downloaded and stored INTERNALLY ONLY for legal/audit purposes",
    "PDFs are NEVER served to users — we link to official state URLs",
    "PDFs are NEVER hosted on any public-facing server or CDN",
    "Every archived PDF has a SHA-256 hash for integrity verification",
    "Archive directory (fdd-vault/*/archive/) is gitignored — never committed to public repos",
  ],

  /** Privacy rules */
  PRIVACY: [
    "NEVER extract franchisee personal names from Item 20",
    "NEVER extract franchisee phone numbers from Item 20",
    "NEVER extract franchisee addresses from Item 20",
    "NEVER index franchisee contact info into public search",
    "NEVER build a franchisee contact/lead database from FDD data",
  ],
} as const;

// ==========================================================================
// AMENDMENT V — REQUIRED DISCLAIMERS
// ==========================================================================

export const REQUIRED_DISCLAIMERS = {
  /** Must appear on every page */
  SITE_WIDE: "This is an unofficial database. Data is extracted from public franchise filings with state regulatory agencies. We are not affiliated with, endorsed by, or sponsored by any state agency or franchisor. This is not legal, financial, or investment advice. Report errors at [correction URL].",

  /** Must appear on every brand/franchise detail page */
  BRAND_PAGE: "Data shown is extracted from the [YEAR] Franchise Disclosure Document filed with [STATE]. Filing date: [DATE]. Effective: [EFF_DATE] to [EXP_DATE]. Last verified: [LAST_CHECKED]. View the official filing at [DIRECT_LINK].",

  /** Must appear on comparison/ranking pages */
  COMPARISON: "Rankings and comparisons are our own editorial analysis based on factual data extracted from public FDD filings. Different FDD years may be compared. Always verify current data directly with the franchisor or through the official state filing.",

  /** Correction/takedown workflow */
  CORRECTION: "If you believe any data on this site is inaccurate, outdated, or should be removed, contact us at [EMAIL]. We will investigate within [X] business days and correct or remove disputed data. We retain source snapshots for dispute resolution.",
} as const;

// ==========================================================================
// AMENDMENT VI — PRE-LAUNCH REQUIREMENTS
// ==========================================================================

export const PRE_LAUNCH = {
  /** Must be completed before going live */
  REQUIREMENTS: [
    "Have counsel review source terms for MN CARDS, WI DFI, CA DFPI",
    "Have counsel review PDF-hosting policy (internal archive only)",
    "Have counsel review privacy handling for Item 20 contact fields",
    "Implement takedown/correction workflow with defined SLA",
    "Implement error reporting mechanism on every page",
    "Verify all deep-links actually resolve to specific documents",
    "Verify no franchisee PII is exposed in any public-facing data",
    "Verify all provenance fields display correctly on every record",
    "Verify disclaimer appears on every page",
  ],
} as const;

// ==========================================================================
// AMENDMENT VII — FRANCHISEE PRIVACY (expanded)
// ==========================================================================

export const FRANCHISEE_PRIVACY = {
  rules: [
    "Do NOT publish franchisee contact data as a lead database",
    "FDDs contain contact info for current and former franchisees in Item 20 — FTC points buyers to it",
    "Wisconsin says certain personal data in filed records is NOT public: SSNs, residential addresses (unless used as business), residential phone numbers (unless used as business)",
    "Public availability is NOT the same as a green light to mass-index for lead generation",
    "NEVER build a franchisee contact search feature",
    "NEVER scrape, index, or expose franchisee names/phones/addresses",
  ],
} as const;

// ==========================================================================
// AMENDMENT VIII — FINANCIAL CLAIMS & EARNINGS
// ==========================================================================

export const FINANCIAL_CLAIMS = {
  rules: [
    "Do NOT create your own earnings, ROI, payback, or 'best franchise returns' claims unless fully supportable",
    "FTC requires objective claims to have a reasonable basis",
    "Under the Franchise Rule, financial performance representations must have written substantiation and be stated in Item 19",
    "If restating or summarizing financial claims, keep EXACT source, date range, outlet subset, and assumptions visible",
    "Do NOT blend Item 19 figures with your own projections and present them as fact",
    "Earnings-style rankings: ONLY with strict sourcing and visible methodology",
  ],
  /** Value origin types — every displayed value must be one of these */
  VALUE_TYPES: [
    "source_extracted",   // Directly from the FDD filing — number/date/fact
    "source_quoted",      // Short factual quote from filing (use sparingly, <15 words)
    "platform_calculated", // We computed this from extracted facts — methodology must be visible
  ],
} as const;

// ==========================================================================
// AMENDMENT IX — MONETIZATION TRANSPARENCY
// ==========================================================================

export const MONETIZATION_DISCLOSURE = {
  rules: [
    "Do NOT bury monetization disclosures",
    "If ranking franchises, attorneys, brokers, lenders, consultants, or vendors AND receiving referral fees, sponsored placement, or paid inclusion — disclosure must be clear and conspicuous NEAR the claim or placement",
    "FTC guidance: needed disclosures should NOT be relegated to terms of use",
    "If disclosure cannot be made clearly and conspicuously, the ad should not run in that form",
    "Every ranked/compared list must state whether any commercial relationship exists with listed entities",
  ],
} as const;

// ==========================================================================
// AMENDMENT X — NO OFFICIAL APPEARANCE
// ==========================================================================

export const NO_OFFICIAL_APPEARANCE = {
  rules: [
    "No state seals",
    "No regulator-like branding",
    "No 'approved', 'verified by state', or similar wording unless literally true and sourced",
    "Minnesota policy: may not portray subjects falsely or misleadingly",
    "Minnesota policy: may not use framing or visual-altering tools around Commerce pages",
    "Minnesota policy: may not imply Minnesota endorses your product or services",
    "No franchisor logos unless there is a reason and clean use rationale",
    "Never present a brand tile or badge in a way that looks official",
  ],
} as const;

// ==========================================================================
// AMENDMENT XI — TERMS MONITORING
// ==========================================================================

export const TERMS_MONITORING = {
  rules: [
    "Assume source terms can change — re-check on a schedule",
    "NASAA expressly reserves the right to modify terms at any time",
    "Treat all source access as permission-dependent",
    "Monitor for term changes BEFORE launch and PERIODICALLY after launch",
    "If MN/WI/CA terms change to restrict commercial use, pause extraction immediately and seek counsel",
    "Calendar: review all source terms quarterly at minimum",
  ],
} as const;

// ==========================================================================
// AMENDMENT XII — ACCESSIBILITY
// ==========================================================================

export const ACCESSIBILITY = {
  rules: [
    "Build for accessibility from day one — not optional cleanup",
    "DOJ guidance: ADA applies to businesses open to the public and goods/services on the web",
    "Common breakpoints for our use case:",
    "  - Charts without text alternatives",
    "  - Poor contrast in comparison tables",
    "  - Inaccessible filters and forms",
    "  - Mouse-only navigation",
    "  - PDFs or images without accessible alternatives",
    "All charts must have text-based data tables as alternatives",
    "All interactive elements must be keyboard-navigable",
    "Target WCAG 2.1 AA compliance minimum",
  ],
} as const;

// ==========================================================================
// AMENDMENT XIII — TAKEDOWN PROCESS (DMCA)
// ==========================================================================

export const TAKEDOWN_PROCESS = {
  rules: [
    "Have a takedown process BEFORE launch",
    "If users can upload files, comments, screenshots, or notes: set up copyright complaint workflow immediately",
    "Copyright Office: online service providers seeking DMCA safe-harbor must:",
    "  1. Designate an agent",
    "  2. Publish that contact information on their site",
    "  3. Register it with the Copyright Office",
    "Implement correction request workflow with defined SLA",
    "Retain raw-source snapshots (internal archive) for dispute resolution",
  ],
} as const;

// ==========================================================================
// AMENDMENT XIV — DATA FIELD CLASSIFICATION
// ==========================================================================

export const FIELD_CLASSIFICATION = {
  /** Every field displayed to users must be marked as exactly one of these */
  types: {
    SOURCE_EXTRACTED: "Factual field directly from the government FDD filing. Number, date, name, or yes/no flag.",
    SOURCE_QUOTED: "Short factual reference (<15 words) from filing. Use sparingly. Always with attribution.",
    PLATFORM_CALCULATED: "We computed this from extracted facts. Methodology must be visible on the page. Users must not treat our calculations as regulator-certified facts.",
  },
  rules: [
    "Separate source facts from derived data — always",
    "Calculated visuals need visible methodology",
    "Otherwise users treat inferences as regulator-certified facts, raising deception risk",
    "FTC advertising guidance: claims must be truthful, not deceptive, and evidence-based",
    "Rankings driven by platform_calculated values must show the formula/weighting",
  ],
} as const;

// ==========================================================================
// AMENDMENT XV — VERSION CONTROL & CURRENCY
// ==========================================================================

export const VERSION_CONTROL = {
  rules: [
    "Do NOT display a single 'current FDD' badge unless you KNOW it is the current effective filing for that state",
    "Show: filing date, amendment status, state, source URL, last-checked date",
    "FTC: the disclosure document is a structured 23-item package for prospective franchisees — users will assume your versioning is reliable if you present it as a decision tool",
    "FDDs must be current as of close of most recent fiscal year, revised within 120 days after year-end",
    "State sites disclaim completeness and timeliness — so must we",
    "If comparing across years or states, make the difference visible and prominent",
  ],
} as const;

// ==========================================================================
// AMENDMENT XVI — PROHIBITED PRODUCT SHAPES
// ==========================================================================

export const PROHIBITED_PRODUCT_SHAPES = {
  /** The highest-risk product shape is not 'franchise intelligence' */
  HIGHEST_RISK: "Public-record mirror + lead-gen + earnings claims",

  SAFE: [
    "Facts database: YES",
    "Source links: YES",
    "Your own charts: YES",
  ],
  AVOID: [
    "Full FDD mirror: AVOID",
    "Franchisee contact search: AVOID",
    "Earnings-style rankings: ONLY with strict sourcing and methodology",
    "NASAA commercial reuse: DO NOT assume permission",
  ],
  BEST_PRACTICE:
    "Build a facts-and-metadata database, not a mirrored PDF repository. " +
    "Store the official source URL, filing state, filing date, and document hash for auditability. " +
    "Extract only factual fields and your own normalized summaries. " +
    "Generate your own charts, rankings, and comparisons from those facts. " +
    "Link out to the official PDF or filing page for the source document.",
} as const;

// ==========================================================================
// AMENDMENT XVII — FTC COMPLIANCE FRAMEWORK (CORE BUSINESS CONSTRAINT)
// ==========================================================================
//
// This is not optional compliance. This is the business model.
// The FTC Franchise Rule and FTC advertising law define what we can
// and cannot say on our own site. Source-site terms are only half the
// risk. The other half is OUR OWN CLAIMS.
//

export const FTC_COMPLIANCE = {
  /** The Franchise Rule (16 CFR Parts 436-437) */
  FRANCHISE_RULE: {
    summary:
      "The FTC Franchise Rule requires franchisors to provide a Franchise Disclosure " +
      "Document with 23 items to prospective franchisees. Item 19 financial performance " +
      "representations must be substantiated and included in Item 19. We are NOT a " +
      "franchisor, but we restate FDD data — so accuracy, context, and sourcing matter.",
    requirements: [
      "Item 19 financial performance representations must be substantiated by the franchisor",
      "If a franchisor does NOT make Item 19 representations, we do NOT invent them",
      "We never fill in missing Item 19 data with estimates, projections, or averages from other sources",
      "When displaying Item 19 numbers, we show EXACTLY what the FDD states — year, outlet subset, assumptions",
      "We never blend multiple franchisors' Item 19 data to create composite 'industry' earnings claims",
    ],
  },

  /** FTC Advertising Law (applies to OUR site, not just franchisors) */
  ADVERTISING_LAW: {
    summary:
      "FTC advertising law requires claims to be truthful, non-deceptive, and " +
      "evidence-based. This applies to US — our editorial content, rankings, " +
      "comparisons, and any claim we make on our site. The moment we say 'best " +
      "returns,' 'top franchise,' 'low risk,' or similar without tight methodology " +
      "and support, we create our own exposure independent of any source-site terms.",
    PROHIBITED_CLAIMS: [
      "'Best returns' — unless we have complete, current, comparable Item 19 data across all listed franchises AND a visible, defensible methodology",
      "'Top franchise' — unless explicitly defined (top by what metric? over what period? from which filing year?)",
      "'Low risk' — franchise investment involves inherent risk; blanket low-risk claims are per se misleading",
      "'Guaranteed ROI' or 'guaranteed payback period' — never, under any circumstances",
      "'Safe investment' or 'recession-proof' — unsupportable generalization",
      "'#1 franchise' — only if literally verifiable by a specific, sourced metric",
      "'Proven system' — editorial opinion must be clearly labeled as opinion, not fact",
      "'Average earnings of $X' — only if directly from Item 19, with full context visible",
    ],
    REQUIRED_METHODOLOGY: [
      "Every ranking must show: what metric, what data source, what filing year, what calculation",
      "Every comparison must show: what is being compared, from which FDD years, caveats on comparability",
      "Every 'best of' or 'top' list must disclose: selection criteria, whether any listed entity has a commercial relationship with us",
      "Every financial figure must show: source FDD year, number of outlets reporting, whether it is gross or net",
      "If we calculate a derived metric (e.g., cost-per-unit, growth rate), the formula must be visible",
    ],
  },

  /** Our own claims are our own liability */
  OWN_SITE_LIABILITY: {
    principle:
      "The danger is not just source-site terms. It is what we claim on our own site. " +
      "Even if we extract data perfectly and comply with every source term, we can still " +
      "face FTC enforcement or private litigation if our own editorial claims are " +
      "misleading, unsubstantiated, or deceptive.",
    rules: [
      "Source accuracy is necessary but NOT sufficient — our presentation must also be truthful",
      "Extracted facts are raw material; how we frame them is our responsibility",
      "A truthful number in a misleading context is still misleading",
      "Omitting material context (e.g., showing average revenue without showing the number of units or time period) can be deceptive",
      "Comparative claims require comparable data — do not compare a 2024 FDD to a 2026 FDD without disclosure",
      "If data is stale (filing more than 18 months old), label it prominently",
      "If data is incomplete (e.g., franchisor did not make Item 19 representations), say so — do not hide the absence",
    ],
  },
} as const;

// ==========================================================================
// AMENDMENT XVIII — VERSION A BUSINESS MODEL (THE ONLY APPROVED MODEL)
// ==========================================================================
//
// We chose Version A. This is locked in. Version B is prohibited.
//

export const BUSINESS_MODEL = {
  /** Version A: What we ARE building — legally defensible */
  VERSION_A: {
    name: "Independent Franchise Due-Diligence Intelligence",
    description:
      "FDD intelligence built on extracted facts, original analysis, " +
      "source citations, and links back to the official filing.",
    components: [
      "Extracted factual fields from government FDD filings (fees, dates, unit counts, investment ranges)",
      "Our own normalized database with full provenance on every field",
      "Original visualizations, charts, and comparison tools",
      "Longitudinal analysis (year-over-year trends from sequential FDD filings)",
      "Original editorial analysis and red-flag commentary (clearly labeled as our analysis)",
      "Deep-links to official state filing pages for every cited document",
      "Community data layer (reviews, experiences) clearly separated from government data",
      "Transparent methodology for every ranking, comparison, and derived metric",
    ],
    risk_level: "LOW_TO_MODERATE — legally defensible with proper execution",
  },

  /** Version B: What we are NOT building — prohibited */
  VERSION_B: {
    name: "Public FDD Library + Scraped Content + Monetized Rankings",
    description:
      "A public mirror of raw FDD PDFs, copied narrative text, " +
      "anonymous complaints, and monetized rankings without methodology.",
    PROHIBITED_COMPONENTS: [
      "Public hosting or CDN serving of FDD PDFs",
      "Bulk republication of FDD narrative text",
      "Anonymous unmoderated fraud accusations",
      "Franchisee contact info as a searchable public database",
      "Rankings influenced by paid placement without disclosure",
      "Earnings claims not directly traceable to a specific Item 19 filing",
      "NASAA-derived data in any commercial capacity",
      "Composite 'industry average' earnings from blended sources",
    ],
    risk_level: "HIGH — needlessly exposed, do NOT build this",
  },

  /** Risk stack — from the legal analysis */
  RISK_STACK: {
    LOW_TO_MODERATE: [
      "Extracted factual fields from FDDs",
      "Our own normalized database",
      "Original visualizations and longitudinal comparisons",
      "Links to official filings",
    ],
    MODERATE: [
      "Our own editorial summaries and red-flag writeups (must be accurate, sourced, non-deceptive)",
      "Calculated metrics and derived rankings (must show methodology)",
    ],
    MODERATE_TO_HIGH: [
      "Anonymous franchisee reviews (Section 230 helps for third-party content but does not cover our own authored reports)",
    ],
    HIGH: [
      "Hosting or bulk-republishing FDD PDFs",
      "NASAA-derived data republication",
      "Unmoderated accusations of fraud",
      "Surfacing franchisee contact details as a searchable public database",
    ],
  },
} as const;

// ==========================================================================
// RUNTIME VALIDATION — Call this during build to enforce compliance
// ==========================================================================

/**
 * Validate that a data source is approved for use.
 * Throws if the source is prohibited (e.g., NASAA).
 */
export function validateSource(source: string): void {
  if (source === "nasaa_efd" || source === "nasaa") {
    throw new Error(
      "LEGAL VIOLATION: NASAA EFD data cannot be used commercially. " +
      "Terms prohibit commercial exploitation, redistribution, and database creation. " +
      "See Amendment I — SOURCE_RISK_POSTURE.nasaa_efd"
    );
  }

  const approved = ["mn_cards", "wi_dfi", "ca_dfpi"];
  if (!approved.includes(source)) {
    throw new Error(
      `UNAPPROVED SOURCE: "${source}" is not in the approved source list. ` +
      `Approved sources: ${approved.join(", ")}. ` +
      "Add source to legal-amendments.ts only after counsel review."
    );
  }
}

/**
 * Validate that a field name is in the GREEN extraction list.
 * Warns (does not throw) if the field looks like it might contain narrative.
 */
export function validateFieldExtraction(fieldName: string, value: unknown): void {
  if (typeof value === "string" && value.length > 500) {
    console.warn(
      `WARNING: Field "${fieldName}" contains ${value.length} characters. ` +
      "This may be narrative text (copyrightable). " +
      "See Amendment II — EXTRACTION_RULES.RED_FIELDS. " +
      "Only factual numbers, dates, names, and flags should be extracted."
    );
  }
}

/**
 * Validate that an editorial claim is FTC-compliant.
 * Call this before displaying any ranking, comparison, or superlative claim.
 * See Amendment XVII — FTC_COMPLIANCE.ADVERTISING_LAW
 */
export function validateClaim(claim: {
  text: string;
  metric?: string;
  methodology?: string;
  sourceFddYear?: number;
  sourceState?: string;
  outletsReported?: number;
  hasCommercialRelationship?: boolean;
}): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for prohibited superlatives without methodology
  const dangerousTerms = [
    "best returns",
    "top franchise",
    "low risk",
    "guaranteed",
    "safe investment",
    "recession-proof",
    "#1 franchise",
    "proven system",
    "no risk",
    "sure thing",
    "can't lose",
    "easy money",
  ];

  const lowerText = claim.text.toLowerCase();
  for (const term of dangerousTerms) {
    if (lowerText.includes(term)) {
      if (!claim.methodology) {
        warnings.push(
          `PROHIBITED CLAIM: "${term}" requires visible, defensible methodology. ` +
          "See Amendment XVII — FTC_COMPLIANCE.ADVERTISING_LAW.PROHIBITED_CLAIMS"
        );
      }
    }
  }

  // Rankings and comparisons require methodology
  const rankingTerms = ["rank", "best", "top", "worst", "highest", "lowest", "compare"];
  const isRanking = rankingTerms.some((t) => lowerText.includes(t));
  if (isRanking && !claim.methodology) {
    warnings.push(
      "RANKING/COMPARISON without methodology. " +
      "See Amendment XVII — FTC_COMPLIANCE.ADVERTISING_LAW.REQUIRED_METHODOLOGY"
    );
  }

  // Financial figures require full context
  const hasFinancialFigure = /\$[\d,]+/.test(claim.text) || /\d+%/.test(claim.text);
  if (hasFinancialFigure) {
    if (!claim.sourceFddYear) {
      warnings.push("Financial figure without source FDD year — potentially misleading");
    }
    if (!claim.sourceState) {
      warnings.push("Financial figure without source state — missing provenance");
    }
    if (claim.outletsReported === undefined) {
      warnings.push("Financial figure without outlet count — may lack material context");
    }
  }

  // Commercial relationship disclosure
  if (claim.hasCommercialRelationship === true && !lowerText.includes("sponsor") && !lowerText.includes("partner") && !lowerText.includes("paid") && !lowerText.includes("affiliate")) {
    warnings.push(
      "Commercial relationship exists but no disclosure in claim text. " +
      "See Amendment IX — MONETIZATION_DISCLOSURE"
    );
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Validate that a value origin type is properly set.
 * Every displayed value must be one of: source_extracted, source_quoted, platform_calculated
 * See Amendment XIV — FIELD_CLASSIFICATION
 */
export type ValueOrigin = "source_extracted" | "source_quoted" | "platform_calculated";

export function validateValueOrigin(
  fieldName: string,
  origin: ValueOrigin,
  metadata: {
    sourceFddYear?: number;
    sourceState?: string;
    methodology?: string;
  }
): void {
  if (origin === "source_extracted" && (!metadata.sourceFddYear || !metadata.sourceState)) {
    throw new Error(
      `Field "${fieldName}" marked as source_extracted but missing FDD year or source state. ` +
      "Every extracted value must have full provenance. See Amendment III — PRESENTATION_RULES"
    );
  }

  if (origin === "platform_calculated" && !metadata.methodology) {
    throw new Error(
      `Field "${fieldName}" marked as platform_calculated but no methodology provided. ` +
      "Users must not treat our calculations as regulator-certified facts. " +
      "See Amendment XIV — FIELD_CLASSIFICATION"
    );
  }

  if (origin === "source_quoted") {
    console.warn(
      `Field "${fieldName}" uses source_quoted — ensure quote is <15 words with attribution. ` +
      "See Amendment XIV — FIELD_CLASSIFICATION"
    );
  }
}

// ==========================================================================
// AMENDMENT XIX — LAUNCH SEQUENCE & PRODUCT ROADMAP (LOCKED)
// ==========================================================================
//
// This is the only approved product sequence. No shortcuts. No skipping phases.
//

export const LAUNCH_SEQUENCE = {
  /** Phase 1: Months 1-3 — Foundation (CURRENT PHASE) */
  PHASE_1: {
    name: "State-Source Factual Database + Official Links + Paid Reports",
    months: "1-3",
    components: [
      "Direct state-source ingestion (MN CARDS, WI DFI, CA DFPI only)",
      "Factual field extraction (fees, investment ranges, unit counts, dates, flags)",
      "Full provenance on every data point (source, filing year, date, page, last-checked)",
      "Deep-links to official state filing pages (never general search pages)",
      "Original visualizations and comparison tools",
      "Paid brand reports as first revenue product",
      "No UGC, no reviews, no user-submitted content",
      "No NASAA commercial republication",
      "No public PDF hosting",
    ],
    risk: "LOW_TO_MODERATE",
  },

  /** Phase 2: Months 4-6 — Professional Tools */
  PHASE_2: {
    name: "Professional Subscriptions + Comparison Tools",
    months: "4-6",
    components: [
      "Professional subscription tier for franchise attorneys, consultants, lenders",
      "Advanced comparison tools (cross-brand, cross-year, cross-state)",
      "Longitudinal analysis (year-over-year trends from sequential FDD filings)",
      "API access for institutional users (B2B data product foundation)",
      "Bulk data exports for professional subscribers",
      "Email alerts for new filings in tracked brands",
    ],
    risk: "LOW_TO_MODERATE",
    prerequisite: "Phase 1 stable with 200+ brands and clean extraction pipeline",
  },

  /** Phase 3: Later — Scaled Intelligence */
  PHASE_3: {
    name: "Verified Community Layer + Institutional Data Licensing",
    months: "7+",
    components: [
      "Verified anonymous reviews ONLY after moderation + takedown + privacy systems are mature",
      "Institutional data licensing (PE firms, franchise research, academic)",
      "Longitudinal dataset product (3+ years of sequential FDD filings)",
      "Industry trend reports (original editorial, clearly labeled as our analysis)",
    ],
    risk: "MODERATE — requires review moderation, DMCA agent, privacy compliance",
    prerequisite: "Moderation system, DMCA agent designated, corrections workflow live, counsel review of UGC policy",
  },

  /** What we NEVER build — regardless of phase */
  NEVER: [
    "Public FDD PDF hosting or CDN serving",
    "NASAA data republication without written license",
    "Paid ranking boosts (rankings must never be influenced by payment)",
    "Franchisee contact search/lead-gen database",
    "Unmoderated anonymous complaints or fraud accusations",
    "Composite earnings claims blended from multiple sources",
    "Any feature that makes us look like a government or regulatory site",
  ],
} as const;

// ==========================================================================
// AMENDMENT XX — B2B DATA STRATEGY (THE REAL GROWTH ENGINE)
// ==========================================================================
//
// B2C reports are the launch product. B2B data is where this business scales.
// The longitudinal dataset is the moat. Nobody else is building this from
// primary government sources with full provenance.
//

export const B2B_STRATEGY = {
  /** Why B2B is the growth engine */
  THESIS:
    "B2C paid reports can reach low-to-mid six figures with strong execution. " +
    "B2B subscriptions + longitudinal data + institutional licensing is where this " +
    "moves into high six figures or better. The biggest bottleneck is not market size. " +
    "It is trust, defensibility, and distribution.",

  /** Target B2B customer segments */
  CUSTOMER_SEGMENTS: [
    {
      segment: "Franchise attorneys",
      need: "Due diligence data for client advisory, competitor analysis, FDD benchmarking",
      willingness_to_pay: "HIGH — saves hours of manual FDD review per engagement",
    },
    {
      segment: "Franchise consultants/brokers",
      need: "Comparative data to guide prospective franchisees, market analysis",
      willingness_to_pay: "MEDIUM-HIGH — differentiates their advisory service",
    },
    {
      segment: "Franchise lenders/SBA lenders",
      need: "Unit economics, system health metrics, default risk indicators",
      willingness_to_pay: "HIGH — directly informs lending decisions",
    },
    {
      segment: "PE / M&A diligence teams",
      need: "Longitudinal system performance, growth trends, fee benchmarking across systems",
      willingness_to_pay: "VERY HIGH — saves weeks of manual extraction per deal",
    },
    {
      segment: "Franchise research / academic",
      need: "Clean structured dataset for franchise industry analysis",
      willingness_to_pay: "MODERATE — institutional licensing model",
    },
  ],

  /** The longitudinal data moat */
  MOAT:
    "Once we have 3+ years of sequential FDD filings from MN/WI/CA, we can show " +
    "year-over-year unit growth/churn, fee trend lines, investment range inflation, " +
    "and Item 19 performance shifts. That longitudinal dataset — extracted from primary " +
    "government sources with full provenance and audit trail — is the defensible moat. " +
    "Competitors would need years to replicate it.",

  /** Revenue model priority order */
  REVENUE_PRIORITY: [
    "1. Paid brand intelligence reports (B2C — launch revenue)",
    "2. Professional subscriptions with comparison tools (prosumer/B2B)",
    "3. API access for institutional users (B2B data product)",
    "4. Institutional data licensing (PE, research, academic — bulk deals)",
    "5. Advertising from franchise service providers (with strict separation from editorial — Amendment IX applies)",
  ],

  /** What we NEVER monetize */
  NEVER_MONETIZE: [
    "Rankings influenced by payment (Amendment IX)",
    "Franchisee contact data as leads (Amendment VII)",
    "Raw FDD PDFs or bulk document access (Amendment XVI)",
    "Suppression of negative data in exchange for payment",
    "Pay-to-remove or pay-to-boost franchise scores",
  ],
} as const;

// ==========================================================================
// AMENDMENT XXI — 12-POINT SAFEST LAUNCH CHECKLIST
// ==========================================================================

export const SAFEST_LAUNCH_CHECKLIST = {
  items: [
    {
      number: 1,
      rule: "Launch from direct state sources only — skip NASAA for commercial republication unless written permission obtained",
      status: "ENFORCED", // In SOURCE_RISK_POSTURE + validateSource()
    },
    {
      number: 2,
      rule: "Do not publicly host PDFs at launch — deep-link to official filing page instead",
      status: "ENFORCED", // In TECHNICAL_COMPLIANCE.ARCHIVE + fdd-archive.ts
    },
    {
      number: 3,
      rule: "Extract facts only — do not copy prose or narrative expression",
      status: "ENFORCED", // In EXTRACTION_RULES + validateFieldExtraction()
    },
    {
      number: 4,
      rule: "No public user reviews at launch",
      status: "ENFORCED", // In LAUNCH_SEQUENCE.PHASE_1
    },
    {
      number: 5,
      rule: "No paid ranking boosts — no hidden affiliate bias",
      status: "ENFORCED", // In MONETIZATION_DISCLOSURE + B2B_STRATEGY.NEVER_MONETIZE
    },
    {
      number: 6,
      rule: "No ROI/profit/best-returns/expected-earnings claims unless fully supported with visible methodology",
      status: "ENFORCED", // In FTC_COMPLIANCE + FINANCIAL_CLAIMS + validateClaim()
    },
    {
      number: 7,
      rule: "Visible provenance on every data point — source state, filing year, document date, last-checked",
      status: "ENFORCED", // In PRESENTATION_RULES + validateValueOrigin()
    },
    {
      number: 8,
      rule: "Do not publish franchisee personal contact details as a public dataset",
      status: "ENFORCED", // In FRANCHISEE_PRIVACY + TECHNICAL_COMPLIANCE.PRIVACY
    },
    {
      number: 9,
      rule: "Takedown machinery in place before any uploads or comments go live",
      status: "ENFORCED", // In TAKEDOWN_PROCESS + PRE_LAUNCH
    },
    {
      number: 10,
      rule: "Accessible and plainly unofficial — no state seals, no regulator branding",
      status: "ENFORCED", // In ACCESSIBILITY + NO_OFFICIAL_APPEARANCE
    },
    {
      number: 11,
      rule: "Separate editorial from commerce — no franchisor can buy a better score or suppress a negative page",
      status: "ENFORCED", // In MONETIZATION_DISCLOSURE + B2B_STRATEGY.NEVER_MONETIZE
    },
    {
      number: 12,
      rule: "Staged rollout — facts database first, then pro subs, then verified reviews only after systems are mature",
      status: "ENFORCED", // In LAUNCH_SEQUENCE phases 1-3
    },
  ],
} as const;
