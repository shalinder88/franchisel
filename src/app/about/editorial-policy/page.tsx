import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy — Franchisel Independence Commitment",
  description:
    "Franchisel's editorial independence policy. How we maintain strict separation between commercial relationships and our analysis, scoring, and content.",
};

export default function EditorialPolicyPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface-alt">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium">Editorial Policy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Editorial Policy</h1>
          <p className="mt-3 text-base text-muted leading-relaxed">
            Our commitment to editorial independence — and the specific, structural ways we
            maintain that independence regardless of commercial pressures.
          </p>
        </header>

        {/* Independence commitment */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Independence Commitment</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel is editorially independent. All analysis, scores, rankings, and red
              flag assessments are produced by our research team based on publicly available
              regulatory filings, court records, and independently verified community data. No
              franchisor, franchise broker, investor, or advertiser has any input into, review
              of, or approval over any editorial content on our platform.
            </p>
            <p>
              This independence is not simply a policy statement. It is built into our revenue
              model. We do not accept payment from franchisors for any purpose — not for
              inclusion in our database, not for sponsored listings, not for &ldquo;featured
              brand&rdquo; placement, not for removal of red flags, and not for higher scores.
              We have zero franchisor revenue streams by design.
            </p>
          </div>
        </section>

        {/* What never influences our content */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            What Never Influences Our Content
          </h2>
          <div className="border border-accent/20 rounded-xl p-6 bg-accent-light">
            <p className="text-sm text-foreground mb-4">
              The following are absolute rules that cannot be overridden by any commercial
              relationship, advertiser request, or franchisor objection:
            </p>
            <ul className="space-y-2.5">
              {[
                "Franchise scores, dimension ratings, and Core Diligence scores",
                "Red flag identification, categorization, or severity levels",
                "Report content, analysis sections, or written recommendations",
                "Guide content, educational articles, or category comparisons",
                "Search result ordering and featured placement on the platform",
                "The decision to include, exclude, or deprioritize coverage of any brand",
                "Corrections — errors are corrected regardless of how corrections affect a franchisor",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Revenue model and disclosures */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Revenue Model and Disclosures</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel earns revenue from buyer-side products: paid due diligence reports,
              premium analysis features, and educational content. We do not earn referral fees,
              commissions, or any other compensation from franchisors for any reason.
            </p>
            <p>
              We believe the entity paying for the analysis should be the entity the analysis
              serves. Because buyers pay us for reports and research tools, we serve buyers —
              not franchisors.
            </p>
          </div>
        </section>

        {/* No franchisor advertising */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">No Franchisor Advertising</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel does not accept advertising revenue from franchisors. We do not
              offer &ldquo;featured brand&rdquo; placements, sponsored content, or promotional
              articles that benefit individual franchise systems. This is a permanent policy,
              not a current-state description that may change.
            </p>
            <p>
              If Franchisel introduces third-party advertising in the future — such as
              advertising for professional services relevant to franchise buyers (attorneys,
              accountants, lenders) — all such advertising will be clearly labeled as paid
              content and visually distinct from editorial analysis. Such advertising will
              never influence scores, rankings, or editorial coverage of franchise brands.
            </p>
          </div>
        </section>

        {/* Community reviews */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Community Reviews Policy</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel collects performance data and satisfaction ratings from current
              and former franchisees through our verified submission process. Community
              submissions are published in aggregate — individual reviews are never published
              verbatim, preserving contributor anonymity.
            </p>
            <p>
              We do not edit, moderate for tone, or selectively suppress community data based
              on whether it reflects favorably or unfavorably on a franchise system.
              Submissions are validated for authenticity (cross-referenced against Item 20
              franchisee lists) but never filtered for sentiment. The aggregate scores reflect
              what verified franchisees actually report.
            </p>
            <p>
              Franchisors may not request removal of unfavorable community data. They may,
              however, submit a factual response that we will publish alongside the community
              data, clearly labeled as the franchisor&rsquo;s response.
            </p>
          </div>
        </section>

        {/* Corrections policy */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Corrections Policy</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              We strive for accuracy in every data point, analysis, and editorial statement.
              When errors are identified — by our team, by readers, or by franchisors
              themselves — we investigate and correct them promptly. Corrections are published
              with a dated notice explaining what changed and why. We do not quietly edit
              published content without acknowledging the change.
            </p>
            <p>
              To report a factual error, contact us at{" "}
              <a href="mailto:hello@franchisel.com" className="text-accent hover:underline">
                hello@franchisel.com
              </a>{" "}
              with the specific brand, data point, and a source reference for the correction.
              We target a 24-hour response for error reports and correct verified errors
              within the same business day where possible.
            </p>
            <p>
              A correction request from a franchisor receives the same treatment as one from
              any other source — we investigate the claim against the original source documents
              and correct it if it is factually wrong. We do not correct accurate data simply
              because a franchisor prefers we present it differently.
            </p>
          </div>
        </section>

        {/* Franchisor right of response */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Franchisor Right of Response</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisors are welcome to submit factual corrections, updated data, or official
              responses to our analysis. We review all submissions against source documents.
              Verified factual corrections are incorporated. Context statements that do not
              contradict our data may be published alongside analysis at our discretion,
              clearly labeled as the franchisor&rsquo;s statement.
            </p>
            <p>
              We do not grant editorial approval rights, allow prepublication review, or modify
              scores based on franchisor requests that are not supported by documentary evidence.
            </p>
          </div>
        </section>

        {/* Related links */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/about/methodology" className="text-sm text-accent hover:underline">
            &larr; Methodology
          </Link>
          <Link href="/about/source-policy" className="text-sm text-accent hover:underline">
            Source Policy &rarr;
          </Link>
          <Link href="/disclosure" className="text-sm text-accent hover:underline">
            Advertiser Disclosure &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
