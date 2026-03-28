import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Franchisel — Independent Franchise Due Diligence",
  description:
    "Franchisel is a buyer-aligned franchise intelligence platform. Independent analysis from public sources, no franchisor funding.",
};

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Transparent Sources",
    description:
      "Financial figures, fee ranges, and unit counts are currently estimated from public sources including franchise directories, press releases, and industry databases. Where we have directly reviewed a filed FDD, we cite the year and item number. Where data is estimated, we label it as such.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Buyer Aligned",
    description:
      "We earn revenue from buyers purchasing reports and using our platform — not from franchisors paying for placement or favorable ratings. Our financial incentives are structurally aligned with yours. We succeed when you make better decisions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
    title: "Independent",
    description:
      "We have zero franchisor revenue streams. No franchisors advertise on our platform. No franchisor can pay to improve their score, remove red flags, or influence our analysis in any way. Independence is not a marketing claim — it is our business model.",
  },
];

export default function AboutPage() {
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
            <span className="text-foreground font-medium">About</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            About Franchisel
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            An independent franchise intelligence platform. We exist to give franchise
            buyers structured analysis of fees, obligations, and risk factors before
            they commit $50K&ndash;$2M of their savings.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Mission */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p className="text-sm text-muted leading-relaxed">
            Franchisel was founded on a single conviction: franchise buyers deserve the same
            quality of due diligence that sophisticated investors apply to any major financial
            decision. Buying a franchise is one of the largest investments most people will ever
            make, yet the industry&rsquo;s information ecosystem is dominated by sources that earn
            commissions from franchisors, accept advertising from the brands they review, or serve
            up dense legal documents with no translation layer.
          </p>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            We built Franchisel to be permanently, structurally buyer-aligned. Our analysis is
            drawn from public sources, industry databases, and independent research. As we grow,
            we are working toward direct FDD extraction and verified franchisee submissions.
            We do not accept franchisor advertising, do not earn referral fees from
            franchise sales, and do not allow any commercial relationship to influence our scoring
            or editorial content. When we say independent, we mean it at the business model level.
          </p>
        </section>

        {/* Three pillars */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Three Pillars</h2>
          <div className="space-y-4">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="border border-border rounded-xl p-6 bg-surface-alt hover-glow">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{pillar.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Problem */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">The Problem We Solve</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchise investing suffers from a fundamental information asymmetry. The franchisor
              has spent years building their system and knows every number in their FDD. The buyer
              typically reads their first FDD ever, under time pressure, with limited context for
              what the numbers actually mean.
            </p>
            <p>
              Franchise brokers earn commissions from franchisors — typically 40&ndash;60% of the
              initial franchise fee — creating a structural incentive to recommend brands that pay
              the highest commission, not brands that best fit the buyer. Review platforms accept
              advertising from the same brands they claim to evaluate objectively. FDD analysis
              services sell data to both franchisors and lenders, serving no side exclusively.
            </p>
            <p>
              The result is that buyers make six- and seven-figure decisions with access to
              marketing materials dressed up as research. Franchisel exists to change that
              equation. We analyze public data, flag potential risks, and present it in plain
              English — with no commercial interest in which franchise you choose, or whether
              you choose one at all.
            </p>
          </div>
        </section>

        {/* How we&rsquo;re different */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">How We&rsquo;re Different</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "vs. Franchise Brokers",
                description:
                  "Brokers earn commissions on franchise sales and represent the franchisor in the transaction. We represent the buyer. We earn nothing from which franchise you choose.",
              },
              {
                title: "vs. Franchise Review Sites",
                description:
                  "Most review sites accept advertising from the brands they evaluate. Advertising revenue creates editorial pressure. We have zero franchisor advertising revenue.",
              },
              {
                title: "vs. FDD Aggregators",
                description:
                  "Aggregator sites earn referral fees from franchise inquiries. We earn from buyer-purchased reports. The difference in incentives is fundamental.",
              },
              {
                title: "vs. Paid Survey Programs",
                description:
                  "Industry satisfaction surveys are paid for by franchisors, meaning only brands willing to pay participate — and results are marketed as independent data. We are building a community data program that accepts no franchisor funding.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-border rounded-lg p-5 bg-background hover-glow"
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Team</h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              Franchisel is built by a small team that believes franchise buyers have been
              systematically underserved by existing information sources. We bring backgrounds in
              financial analysis and research to a market where most content is franchisor-funded.
            </p>
            <p>
              Each brand profile is researched from public data and structured to surface the most
              decision-relevant information — fee structures, growth trends, litigation history,
              and potential red flags. As we scale, we are working toward full FDD extraction and
              direct franchisee data collection. Our team is not compensated on a per-franchise
              basis — our incentives are accuracy, not volume.
            </p>
          </div>
        </section>

        {/* Data integrity promise */}
        <section>
          <div className="border border-accent/20 rounded-xl p-6 bg-accent-light">
            <h3 className="text-sm font-semibold text-foreground mb-3">Our Data Integrity Commitment</h3>
            <ul className="space-y-2 text-xs text-muted leading-relaxed">
              {[
                "Where data is sourced from a filed FDD, we cite the year and Item number. Where data is estimated from public sources, we label it as estimated.",
                "Community-reported data, once collected, will be labeled as such and never mixed with FDD data without clear distinction.",
                "We have no advertising or financial relationships with any franchisor. If that changes, it will be disclosed and will never influence scores or editorial content.",
                "Factual errors are corrected publicly within 24 hours with a dated correction notice.",
                "We are permanently aligned with the franchise buyer — never the franchisor.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Learn more links */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Learn More</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { href: "/about/methodology", label: "Methodology", desc: "How we score and analyze franchises" },
              { href: "/about/editorial-policy", label: "Editorial Policy", desc: "Our independence commitment" },
              { href: "/about/source-policy", label: "Source Policy", desc: "Where our data comes from" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-border rounded-lg p-4 hover-glow bg-background group"
              >
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {item.label} &rarr;
                </p>
                <p className="text-xs text-muted mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
