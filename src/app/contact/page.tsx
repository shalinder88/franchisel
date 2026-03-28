import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Franchisel",
  description:
    "Get in touch with the Franchisel team. Report data errors, request a brand analysis, submit community data, or ask a general question.",
};

const contactChannels = [
  {
    email: "hello@franchisel.com",
    label: "General Inquiries",
    desc: "Questions about the platform, data corrections, brand requests, media inquiries, and general feedback. This is the right address for most things.",
    dotColor: "bg-accent",
  },
  {
    email: "reports@franchisel.com",
    label: "Reports & Billing",
    desc: "Questions about purchasing a due diligence report, accessing a purchased report, billing issues, or refund requests.",
    dotColor: "bg-success",
  },
  {
    email: "submit@franchisel.com",
    label: "Community Data Submissions",
    desc: "Submit your anonymous franchisee performance data to contribute to our community intelligence database. Include the franchise brand and your ownership verification details.",
    dotColor: "bg-cyan",
  },
  {
    email: "privacy@franchisel.com",
    label: "Privacy Requests",
    desc: "GDPR requests, CCPA requests, data deletion, data access, or any other privacy-related matters. We respond to privacy requests within 30 days.",
    dotColor: "bg-warning",
  },
  {
    email: "legal@franchisel.com",
    label: "Legal",
    desc: "Legal notices, terms of use questions, intellectual property matters, or other formal legal correspondence.",
    dotColor: "bg-muted",
  },
];

export default function ContactPage() {
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
            <span className="text-foreground font-medium">Contact</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Us</h1>
          <p className="mt-3 text-base text-muted leading-relaxed">
            We&rsquo;d love to hear from you. Whether you&rsquo;re reporting an error, requesting
            a brand analysis, or submitting franchisee data, use the relevant address below.
            We aim to respond within 1&ndash;2 business days.
          </p>
        </header>

        {/* Contact channels */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-5">Contact Channels</h2>
          <div className="space-y-4">
            {contactChannels.map((channel) => (
              <div
                key={channel.email}
                className="border border-border rounded-xl p-5 bg-background hover-glow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${channel.dotColor} shrink-0 mt-1.5`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{channel.label}</h3>
                      <a
                        href={`mailto:${channel.email}`}
                        className="text-sm text-accent hover:underline font-medium shrink-0"
                      >
                        {channel.email}
                      </a>
                    </div>
                    <p className="text-xs text-muted leading-relaxed mt-1.5">{channel.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data corrections */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Reporting a Data Error</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Accuracy is our highest priority. If you believe any data on Franchisel is
              incorrect — a wrong fee figure, an outdated unit count, a litigation item that
              has since been resolved — please report it. We investigate all error reports and
              correct verified errors within 24 hours with a dated correction notice.
            </p>
            <p>To help us investigate quickly, please include:</p>
            <ul className="space-y-1.5 mt-2 ml-4">
              {[
                "The franchise brand name",
                "The specific data point you believe is incorrect",
                "What you believe the correct figure is",
                "A source for the correct information (FDD Item number, year, page, or URL)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-2">
              Send corrections to{" "}
              <a href="mailto:hello@franchisel.com" className="text-accent hover:underline">
                hello@franchisel.com
              </a>
              {" "}with the subject line &ldquo;Data Correction: [Brand Name].&rdquo;
            </p>
          </div>
        </section>

        {/* Request a brand */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Requesting a Brand Analysis</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Don&rsquo;t see the franchise you&rsquo;re researching in our database? We prioritize
              new brand analyses based on buyer demand. If you&rsquo;re actively evaluating a
              franchise that we haven&rsquo;t yet covered, email us at{" "}
              <a href="mailto:hello@franchisel.com" className="text-accent hover:underline">
                hello@franchisel.com
              </a>{" "}
              with the brand name. High-demand requests are prioritized for our next analysis cycle.
            </p>
          </div>
        </section>

        {/* Submit community data */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Submitting Franchisee Data</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              If you are a current or former franchise owner, your anonymized performance data
              helps future buyers make better decisions. We collect actual investment amounts,
              first-year revenue, operating costs, support quality ratings, and overall
              satisfaction scores.
            </p>
            <p>
              All submissions are verified against FDD Item 20 franchisee lists and aggregated
              — your individual data is never published. Email{" "}
              <a href="mailto:submit@franchisel.com" className="text-accent hover:underline">
                submit@franchisel.com
              </a>{" "}
              to receive our submission form. We recommend reviewing your franchise
              agreement before submitting — this is not legal advice.
            </p>
          </div>
          <div className="mt-4 border border-border rounded-lg p-4 bg-surface-alt">
            <p className="text-xs text-muted leading-relaxed">
              <span className="font-medium text-foreground">Note on non-disparagement:</span>{" "}
              Many franchise agreements include non-disparagement clauses. Our data collection
              focuses on numerical performance metrics (investment amounts, revenue figures,
              satisfaction scores) rather than subjective opinions, which is generally not
              covered by non-disparagement provisions. We recommend seeking legal advice
              specific to your agreement if you have concerns.
            </p>
          </div>
        </section>

        {/* Media */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Media &amp; Research Inquiries</h2>
          <p className="text-sm text-muted leading-relaxed">
            Journalists, researchers, and industry analysts are welcome to contact us for data,
            commentary, or expert perspective on franchise market trends. Email{" "}
            <a href="mailto:hello@franchisel.com" className="text-accent hover:underline">
              hello@franchisel.com
            </a>{" "}
            with the subject line &ldquo;Media Inquiry&rdquo; and we&rsquo;ll respond promptly.
          </p>
        </section>

        {/* Response time notice */}
        <div className="border border-border rounded-xl p-5 bg-surface-alt">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-foreground">Response Times</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                General inquiries: 1&ndash;2 business days.
                Data correction reports: 24 hours.
                Privacy requests: 30 days (as required by GDPR/CCPA).
                Report and billing issues: 1 business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
