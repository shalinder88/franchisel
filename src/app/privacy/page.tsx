import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Franchisel",
  description:
    "Franchisel privacy policy. How we collect, use, and protect your personal data. GDPR and CCPA rights included.",
};

export default function PrivacyPage() {
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
            <span className="text-foreground font-medium">Privacy Policy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated: March 2026</p>
        </header>

        <section className="space-y-3 text-sm text-muted leading-relaxed">
          <p>
            Franchisel (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your
            privacy and is committed to protecting your personal data. This Privacy Policy explains
            how we collect, use, disclose, and safeguard information when you visit
            franchisel.com and use our services. Please read this policy carefully. By using
            Franchisel, you acknowledge the practices described here.
          </p>
        </section>

        {/* Information we collect */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Information We Collect</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Information You Provide</h3>
              <div className="space-y-2 text-sm text-muted leading-relaxed">
                <p>
                  When you interact with Franchisel, you may choose to provide us with
                  personal information. This includes:
                </p>
                <ul className="space-y-1.5 ml-4 mt-2">
                  {[
                    "Email address — when signing up for alerts, newsletters, or a free account",
                    "Name — when creating an account or purchasing a report",
                    "Payment information — processed by our third-party payment processor; we do not store full card details",
                    "Franchise ownership details — when submitting community review data (anonymized and never published individually)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Automatically Collected Information</h3>
              <p className="text-sm text-muted leading-relaxed">
                When you visit our site, we collect standard log data including your IP address,
                browser type, operating system, referring URLs, pages viewed, and time on page.
                This data is used in aggregate to understand how the platform is used and to
                improve the user experience. We do not use this data to identify individuals.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Cookies</h3>
              <p className="text-sm text-muted leading-relaxed">
                We use essential cookies necessary for site functionality (session management,
                security). We may use privacy-respecting analytics cookies to understand
                aggregate usage patterns. We do not use third-party advertising trackers,
                behavioral targeting cookies, or share cookie data with advertisers. You can
                control cookie preferences through your browser settings.
              </p>
            </div>
          </div>
        </section>

        {/* How we use your information */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h2>
          <div className="space-y-2 text-sm text-muted leading-relaxed">
            <p>We use collected information for the following purposes:</p>
            <ul className="space-y-2 mt-2 ml-4">
              {[
                "To provide and maintain the Franchisel platform and its features",
                "To process report purchases and deliver purchased content",
                "To send franchise alert emails when you opt in to notifications for tracked brands",
                "To send newsletters or product updates where you have consented",
                "To respond to your support requests, questions, and feedback",
                "To detect and prevent fraud, abuse, or security issues",
                "To analyze aggregate usage patterns and improve the platform",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Data sharing */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Data Sharing</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              We do not sell, rent, or trade your personal information to any third party.
              Period. We will never sell email addresses or user data to franchisors,
              franchise brokers, or marketers.
            </p>
            <p>
              We may share your data with a limited set of trusted service providers who assist
              us in operating our platform — for example, our email delivery provider, payment
              processor, and hosting infrastructure. These providers have access only to the
              data necessary to perform their services and are contractually prohibited from
              using it for any other purpose.
            </p>
            <p>
              We may disclose your information if required to do so by law, court order, or
              government regulation, or to protect the rights, property, or safety of
              Franchisel, our users, or the public.
            </p>
          </div>
        </section>

        {/* Email alerts */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Email Alerts and Communications</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              If you subscribe to Franchisel brand alerts or newsletters, we will send you
              email updates related to franchises you are tracking and platform content you have
              opted into. Every marketing email includes an unsubscribe link. You can unsubscribe
              at any time and we will process your request within 10 business days.
            </p>
            <p>
              Transactional emails (order confirmations, account notifications) are sent as
              necessary to operate the service and cannot be opted out of while you maintain
              an active account.
            </p>
          </div>
        </section>

        {/* Data security */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Data Security</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              We implement commercially reasonable security measures including encryption in
              transit (HTTPS/TLS), access controls, and security monitoring to protect your
              personal information. Community review submissions are handled with additional
              protections given their sensitive nature.
            </p>
            <p>
              No method of transmission over the Internet or electronic storage is 100% secure.
              While we strive to protect your data, we cannot guarantee absolute security.
              If you have reason to believe your account has been compromised, please contact
              us immediately at{" "}
              <a href="mailto:privacy@franchisel.com" className="text-accent hover:underline">
                privacy@franchisel.com
              </a>
              .
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Your Rights</h2>
          <div className="space-y-7">

            {/* California */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">California Residents (CCPA/CPRA)</h3>
              <div className="space-y-3 text-sm text-muted leading-relaxed">
                <ul className="space-y-1.5 ml-4">
                  {[
                    "Right to know what personal information we collect, use, disclose, and sell",
                    "Right to delete personal information (with exceptions)",
                    "Right to opt-out of sale or sharing of personal information (we do not sell personal information)",
                    "Right to non-discrimination for exercising CCPA rights",
                    "Right to correct inaccurate personal information",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  To submit a California rights request:{" "}
                  <a href="mailto:privacy@franchisel.com" className="text-accent hover:underline">
                    privacy@franchisel.com
                  </a>
                </p>
              </div>
            </div>

            {/* EU / UK */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">European Union / UK Residents (GDPR/UK GDPR)</h3>
              <div className="space-y-3 text-sm text-muted leading-relaxed">
                <ul className="space-y-1.5 ml-4">
                  {[
                    "Legal basis for processing: legitimate interests (platform operation), consent (email alerts), contract performance (report delivery)",
                    "Right to access, rectification, erasure (\u201cright to be forgotten\u201d), restriction, portability, and objection",
                    "Right to lodge a complaint with your supervisory authority",
                    "Data transfers outside the EU: we use standard contractual clauses where required",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  To submit a GDPR rights request:{" "}
                  <a href="mailto:privacy@franchisel.com" className="text-accent hover:underline">
                    privacy@franchisel.com
                  </a>{" "}
                  (respond within 30 days)
                </p>
              </div>
            </div>

            {/* All other users */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">All Other Users</h3>
              <div className="space-y-3 text-sm text-muted leading-relaxed">
                <ul className="space-y-1.5 ml-4">
                  {[
                    "Right to request access to your personal information",
                    "Right to request correction or deletion",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  Contact:{" "}
                  <a href="mailto:privacy@franchisel.com" className="text-accent hover:underline">
                    privacy@franchisel.com
                  </a>
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Children */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Children&rsquo;s Privacy</h2>
          <p className="text-sm text-muted leading-relaxed">
            Franchisel is not directed to individuals under 18 years of age. We do not
            knowingly collect personal information from children. If you believe we have
            inadvertently collected information from a minor, please contact us and we will
            promptly delete it.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Changes to This Policy</h2>
          <p className="text-sm text-muted leading-relaxed">
            We may update this Privacy Policy periodically to reflect changes in our practices
            or applicable law. When we make material changes, we will update the &ldquo;Last
            updated&rdquo; date and, where appropriate, notify users by email. Continued use
            of Franchisel after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Privacy Contact</h2>
          <div className="border border-border rounded-xl p-5 bg-surface-alt">
            <p className="text-sm text-muted leading-relaxed">
              For privacy-related questions, requests, or concerns, contact our privacy team at:
            </p>
            <a
              href="mailto:privacy@franchisel.com"
              className="inline-flex items-center gap-2 mt-3 text-sm text-accent hover:underline font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              privacy@franchisel.com
            </a>
          </div>
        </section>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/terms" className="text-sm text-accent hover:underline">
            Terms of Use &rarr;
          </Link>
          <Link href="/disclosure" className="text-sm text-accent hover:underline">
            Advertiser Disclosure &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
