/* ══════════════════════════════════════════════════════
   Data Provenance & Legal Disclaimer Components

   CRITICAL: These components MUST appear on every page that
   displays financial data. Removing them exposes the company
   to litigation from franchisors and regulatory action.
   ══════════════════════════════════════════════════════ */

import type { DataSource } from "@/lib/types";

/** Inline badge showing data source — appears next to financial figures */
export function DataSourceBadge({ source }: { source: DataSource }) {
  const config: Record<DataSource, { label: string; color: string; title: string }> = {
    fdd_verified: {
      label: "FDD Verified",
      color: "bg-green-50 text-green-700 border-green-200",
      title: "This data was extracted directly from a filed Franchise Disclosure Document.",
    },
    sec_filing: {
      label: "SEC Filing",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      title: "This data comes from SEC 10-K or 10-Q filings for publicly traded companies.",
    },
    state_filing: {
      label: "State Filing",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      title: "This data comes from state franchise registration filings.",
    },
    public_record: {
      label: "Public Record",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
      title: "This data comes from the franchisor's public website or press releases.",
    },
    industry_estimate: {
      label: "Estimated",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      title:
        "This figure is an industry estimate based on publicly available information. It has NOT been verified against the actual FDD filing and may differ from the franchisor's official disclosure.",
    },
  };

  const { label, color, title } = config[source];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${color}`}
      title={title}
    >
      {source === "industry_estimate" && (
        <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      )}
      {source === "fdd_verified" && (
        <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {label}
    </span>
  );
}

/** Full-width disclaimer banner — MUST appear on every brand detail page */
export function BrandDataDisclaimer({
  brandName,
  dataSource,
  fddYear,
  fddAccessed,
  sourceNotes,
}: {
  brandName: string;
  dataSource: DataSource;
  fddYear: number;
  fddAccessed?: boolean;
  sourceNotes?: string;
}) {
  const isEstimate = dataSource === "industry_estimate";

  return (
    <div
      className={`rounded-lg border p-4 text-xs leading-relaxed ${
        isEstimate
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-green-50 border-green-200 text-green-900"
      }`}
    >
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isEstimate ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <div>
          <p className="font-semibold mb-1">
            {isEstimate ? "Data Verification Status: Estimated" : "Data Verification Status: Verified"}
          </p>
          {isEstimate ? (
            <p>
              Financial figures for {brandName} shown on this page are <strong>industry estimates</strong> based
              on publicly available information including franchisor websites, press releases, and industry
              reports. They have <strong>not been verified</strong> against the {fddYear} Franchise
              Disclosure Document. Actual FDD figures may differ materially. Always request and review the
              current FDD directly from the franchisor before making any investment decision.
            </p>
          ) : dataSource === "public_record" ? (
            <p>
              Data for {brandName} was sourced from <strong>government-filed Franchise Disclosure Documents</strong> and official public records.
              {sourceNotes ? ` ${sourceNotes}` : ""}{" "}
              Always verify current figures by requesting the most recent FDD directly from the franchisor.
            </p>
          ) : dataSource === "sec_filing" ? (
            <p>
              Data for {brandName} includes figures from <strong>SEC EDGAR filings</strong> (10-K/10-Q) for the publicly traded parent company,
              supplemented by {fddYear} FDD data where available.
              {sourceNotes ? ` ${sourceNotes}` : ""}{" "}
              Always verify current figures by requesting the most recent FDD directly from the franchisor.
            </p>
          ) : (
            <p>
              Data for {brandName} was extracted from the <strong>{fddYear} Franchise Disclosure Document filed with state regulators</strong> (MN CARDS, WI DFI).
              {sourceNotes ? ` ${sourceNotes}` : ""}{" "}
              Always verify current figures by requesting the most recent FDD directly from the franchisor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Site-wide legal disclaimer — appears in footer or on data-heavy pages */
export function LegalDisclaimer() {
  return (
    <div className="border-t border-border bg-surface-alt">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-[11px] text-muted leading-relaxed">
          <strong>Important Notice:</strong> Franchisel provides franchise research and analysis for
          informational purposes only. This is not financial, legal, or investment advice. All financial
          data labeled &ldquo;Estimated&rdquo; is approximate and has not been verified against actual FDD filings.
          Data labeled &ldquo;FDD Verified&rdquo; has been extracted from publicly filed Franchise Disclosure
          Documents but may not reflect the most recent filing. Unit counts, revenue figures, and other
          metrics change frequently. Always request and independently verify the current FDD from the
          franchisor before making any investment decision. Consult a qualified franchise attorney and
          accountant before investing. Franchisel is not affiliated with, endorsed by, or sponsored
          by any franchise system listed on this platform. Scores reflect our editorial analysis
          methodology and are not endorsed by any franchisor.
        </p>
      </div>
    </div>
  );
}
