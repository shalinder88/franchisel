import Link from "next/link";

const footerSections = [
  {
    title: "Discover",
    links: [
      { href: "/brands", label: "Franchise Directory" },
      { href: "/compare", label: "Compare Brands" },
      { href: "/category/food-beverage", label: "Food & Beverage" },
      { href: "/category/fitness-wellness", label: "Fitness & Wellness" },
      { href: "/category/home-services", label: "Home Services" },
      { href: "/category/childcare-education", label: "Childcare & Education" },
      { href: "/category/senior-care", label: "Senior Care" },
      { href: "/watchlist", label: "Watchlist & Alerts" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/guides", label: "Due Diligence Guides" },
      { href: "/guides/franchise-due-diligence-checklist", label: "Due Diligence Checklist" },
      { href: "/guides/understanding-item-19", label: "Understanding Item 19" },
      { href: "/guides/franchise-red-flags", label: "FDD Red Flags" },
      { href: "/guides/best-low-cost-franchises", label: "Low-Cost Franchises" },
      { href: "/guides/franchise-vs-independent-business", label: "Franchise vs. Independent" },
      { href: "/guides/franchise-territory-protection", label: "Territory Protection" },
    ],
  },
  {
    title: "Top Brands",
    links: [
      { href: "/brands/mcdonalds", label: "McDonald's Analysis" },
      { href: "/brands/chick-fil-a", label: "Chick-fil-A Analysis" },
      { href: "/brands/jersey-mikes", label: "Jersey Mike's Analysis" },
      { href: "/brands/planet-fitness", label: "Planet Fitness Analysis" },
      { href: "/brands/wingstop", label: "Wingstop Analysis" },
      { href: "/brands/servpro", label: "SERVPRO Analysis" },
      { href: "/brands/the-ups-store", label: "UPS Store Analysis" },
    ],
  },
  {
    title: "Reports",
    links: [
      { href: "/reports", label: "Get a Report" },
      { href: "/reports", label: "Standard ($99)" },
      { href: "/reports", label: "Premium ($199)" },
      { href: "/reports", label: "Executive ($249)" },
      { href: "/community", label: "Community Reviews" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/about", label: "About Franchisel" },
      { href: "/about/methodology", label: "Methodology" },
      { href: "/about/editorial-policy", label: "Editorial Policy" },
      { href: "/about/source-policy", label: "Source Policy" },
      { href: "/disclosure", label: "Advertiser Disclosure" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Brand + nav grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 mb-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm font-bold">Franchise<span className="text-accent">Intel</span></span>
            </Link>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Independent franchise due diligence intelligence. Buyer-aligned, FDD-verified, never franchisor-funded.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Data verified from public FDD filings
            </div>
          </div>

          {footerSections.map((s) => (
            <div key={s.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{s.title}</h4>
              <ul className="space-y-1.5">
                {s.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-xs text-muted hover:text-accent transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Data integrity disclaimer */}
        <div className="border-t border-border pt-6">
          <div className="bg-surface-alt rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Data Integrity Promise</p>
                <p className="text-[11px] text-muted leading-relaxed">
                  All FDD data is sourced from actual Franchise Disclosure Documents with source year and item number cited. Community data is clearly labeled &ldquo;community-reported.&rdquo; Franchisor advertising never influences report content, scoring, or community data. Franchisel is permanently aligned with the franchise buyer.{" "}
                  <Link href="/about/methodology" className="text-accent hover:underline">Learn about our methodology →</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="bg-warning-light border border-warning/20 rounded-lg p-3 mb-4">
            <p className="text-[11px] text-muted leading-relaxed">
              <strong className="text-foreground">Not Financial Advice.</strong> Franchisel provides educational information and independent analysis. Nothing on this site constitutes financial, legal, or investment advice. Always consult qualified professionals before making any franchise investment decision.{" "}
              <Link href="/disclosure" className="text-accent hover:underline">Full disclosure →</Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[11px] text-muted">&copy; {new Date().getFullYear()} Franchisel. All rights reserved. Independent franchise intelligence.</p>
            <p className="text-[11px] text-muted">
              FDD data sourced from public filings · Community data is self-reported · <Link href="/about/source-policy" className="hover:text-accent transition-colors">Source Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
