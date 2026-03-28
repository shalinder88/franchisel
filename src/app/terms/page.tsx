import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — Franchisel",
  description:
    "Franchisel terms of use. Rules for using our platform, data accuracy disclaimers, user content licensing, and liability limitations.",
};

export default function TermsPage() {
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
            <span className="text-foreground font-medium">Terms of Use</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Use</h1>
          <p className="mt-2 text-sm text-muted">Last updated: March 2026</p>
        </header>

        {/* Acceptance */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Acceptance of Terms</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              By accessing or using Franchisel (franchisel.com), you agree to be bound
              by these Terms of Use and our{" "}
              <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
              If you do not agree to these terms, please do not use our service. We may update
              these terms at any time; continued use constitutes acceptance of the revised terms.
            </p>
          </div>
        </section>

        {/* Service description */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Description of Service</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel provides franchise investment intelligence including FDD analysis,
              composite scoring, red flag identification, community franchisee data, educational
              guides, comparison tools, and paid due diligence reports. Our platform is designed
              to assist prospective franchise buyers in their research and due diligence process.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the service
              at any time. We will provide reasonable notice of material changes where practical.
            </p>
          </div>
        </section>

        {/* Not financial advice — prominent */}
        <section>
          <div className="border border-warning/30 rounded-xl p-6 bg-warning-light">
            <h2 className="text-base font-bold text-foreground mb-3">Not Financial or Legal Advice</h2>
            <div className="space-y-3 text-sm text-foreground leading-relaxed">
              <p>
                The information, analysis, scores, and reports provided by Franchisel are for
                educational and informational purposes only. Nothing on this platform constitutes
                financial advice, investment advice, legal advice, or a recommendation to invest
                in or avoid any specific franchise.
              </p>
              <p>
                Franchise investing involves substantial financial risk, including the possible
                loss of your entire investment. Past performance data, historical franchisee
                revenue figures, and satisfaction scores do not guarantee future results. Every
                franchise investment is different, and outcomes vary materially based on location,
                operator skill, market conditions, financing, and other factors we cannot measure.
              </p>
              <p>
                <strong>We strongly recommend consulting a qualified franchise attorney, certified
                public accountant, and independent financial advisor before making any franchise
                investment decision.</strong> Our analysis is a starting point for due diligence,
                not a substitute for it.
              </p>
            </div>
          </div>
        </section>

        {/* Data accuracy */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Data Accuracy and Limitations</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel makes substantial efforts to ensure the accuracy of all data on
              the platform. Our primary data sources are Franchise Disclosure Documents and
              regulatory filings, which are compiled based on the accuracy of those original
              filings. We cannot independently audit the truthfulness of disclosures made by
              franchisors in regulatory filings.
            </p>
            <p>
              We do not guarantee that all information is complete, current, or error-free.
              FDD data may lag behind the latest franchise developments by up to one year
              between annual FDD updates. Community-reported data reflects the experiences of
              a subset of franchisees and may not be representative of the full franchise system.
            </p>
            <p>
              We encourage users to verify critical data points independently, including by
              requesting and reading the current FDD directly, speaking with current and former
              franchisees, and reviewing court records. Our{" "}
              <Link href="/about/source-policy" className="text-accent hover:underline">
                Source Policy
              </Link>{" "}
              explains how to trace any data point to its original source.
            </p>
          </div>
        </section>

        {/* Intellectual property */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Intellectual Property</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              All content on Franchisel — including text, analysis, scoring methodology,
              data compilations, graphics, user interface elements, and software — is the
              property of Franchisel or its licensors and is protected by copyright,
              trademark, and other intellectual property laws.
            </p>
            <p>
              You may view, print, and download content for your personal, non-commercial
              use. You may not reproduce, distribute, publish, modify, create derivative
              works from, or commercially exploit any content without our prior written
              permission. Franchise brand names and trademarks referenced on this platform
              are the property of their respective owners.
            </p>
          </div>
        </section>

        {/* User conduct */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">User Conduct</h2>
          <div className="space-y-2 text-sm text-muted leading-relaxed">
            <p>By using Franchisel, you agree not to:</p>
            <ul className="space-y-2 mt-2 ml-4">
              {[
                "Scrape, crawl, or use automated means to access, copy, or index our content without written permission",
                "Misrepresent your identity or franchise ownership status when submitting community data",
                "Submit false, misleading, or fabricated data, reviews, or information",
                "Attempt to interfere with, disrupt, or degrade the platform or its infrastructure",
                "Use the service for any purpose that violates applicable laws or regulations",
                "Redistribute, resell, or commercially exploit our reports, data, or analysis without authorization",
                "Circumvent technical measures we use to protect our content or service",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Community submissions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">User-Submitted Content</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              By submitting franchise performance data, reviews, or other content to
              Franchisel through our community submission process, you grant us a
              perpetual, non-exclusive, royalty-free, worldwide license to use, display,
              aggregate, and distribute that content in connection with our service.
            </p>
            <p>
              You represent and warrant that (a) you are or were a legitimate franchise owner
              or operator for the brand you are submitting data about, (b) your submission
              is truthful and based on your genuine experience, and (c) submitting the
              information does not violate any confidentiality obligation you may have under
              your franchise agreement. We recommend reviewing your franchise agreement before
              submitting. This is not legal advice.
            </p>
            <p>
              We aggregate submissions and never publish individual reviews verbatim. If
              we receive a credible report that a submission contains false or fabricated
              data, we will investigate and may remove the submission from our aggregates.
            </p>
          </div>
        </section>

        {/* Section 230 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Platform as Intermediary (47 U.S.C. § 230)</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel operates as an interactive computer service provider under 47 U.S.C. § 230 (the Communications Decency Act). Community-submitted content, including franchisee reviews, performance data submissions, and ratings, is information provided by third-party information content providers. Franchisel is not the publisher or speaker of third-party content and is not liable for content submitted by franchisees or third parties. Franchisel does not edit the substantive content of community submissions, though it may decline to publish submissions that violate these Terms. The fact that Franchisel verifies submission authenticity (e.g., confirming the submitter is listed in FDD Item 20) does not make Franchisel the &ldquo;information content provider&rdquo; of that submission for purposes of Section 230.
            </p>
          </div>
        </section>

        {/* Paid reports */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Paid Reports</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Purchased due diligence reports are licensed for personal, non-commercial use
              by the individual purchaser. Reports may not be shared, reproduced, posted
              online, redistributed, or resold without our written consent. Reports are
              delivered electronically. Refund eligibility is stated at the time of purchase.
            </p>
            <p>
              Reports reflect data as of the FDD year and update date stated in the report.
              We do not guarantee that reports reflect changes to a franchise system that
              occurred after the stated data date.
            </p>
          </div>
        </section>

        {/* Limitation of liability */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Limitation of Liability</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              To the fullest extent permitted by applicable law, Franchisel, its
              owners, officers, employees, and affiliates shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising
              from your use of, or inability to use, the service or any information
              provided — including any franchise investment decision made in reliance
              on our analysis, scores, or reports.
            </p>
            <p>
              Our total aggregate liability for any claim arising from your use of the
              service shall not exceed the amount you paid to Franchisel in the 12
              months immediately preceding the claim. If you have not made any payment,
              our liability is limited to $100.
            </p>
          </div>
        </section>

        {/* Governing law */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Governing Law</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              These Terms are governed by the laws of the State of Delaware, without regard to its conflict of laws principles. Any disputes shall be resolved in the state or federal courts located in Wilmington, Delaware.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
          <div className="border border-border rounded-xl p-5 bg-surface-alt">
            <p className="text-sm text-muted leading-relaxed">
              Questions about these Terms? Contact our legal team at:
            </p>
            <a
              href="mailto:legal@franchisel.com"
              className="inline-flex items-center gap-2 mt-3 text-sm text-accent hover:underline font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              legal@franchisel.com
            </a>
          </div>
        </section>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/privacy" className="text-sm text-accent hover:underline">
            Privacy Policy &rarr;
          </Link>
          <Link href="/disclosure" className="text-sm text-accent hover:underline">
            Advertiser Disclosure &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
