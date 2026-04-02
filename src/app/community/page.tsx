import Link from "next/link";
import { brands, getTotalCommunityReviews } from "@/data/brands";
import { communityData } from "@/data/community";
import CommunitySourceBadge from "@/components/CommunitySourceBadge";
import CommunitySubmitForm from "@/components/CommunitySubmitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franchisee Community Intelligence",
  description:
    "Anonymous franchise owner performance data. We are building a database of real investment costs, revenue figures, and satisfaction ratings from franchisees.",
};

/* ── Stat card ── */
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="text-center p-6 border border-border rounded-xl bg-background hover-glow">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 text-accent">
        {icon}
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}

/* ── Step card ── */
function StepCard({ step, title, description, icon }: {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative p-6 border border-border rounded-xl bg-background hover-glow">
      <div className="absolute -top-3 left-6 px-2.5 py-0.5 bg-accent text-white text-xs font-bold rounded-full">
        Step {step}
      </div>
      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mb-4 text-accent">
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

export default function CommunityPage() {
  const totalReviews = getTotalCommunityReviews();
  const brandsWithReviews = brands.filter((b) => b.communityReviews > 0);
  const brandsWithSatisfaction = brands.filter((b) => b.communityAvgSatisfaction != null && b.communityReviews > 0);
  const avgSatisfaction =
    brandsWithSatisfaction.length > 0
      ? (
          brandsWithSatisfaction.reduce((sum, b) => sum + (b.communityAvgSatisfaction ?? 0), 0) /
          brandsWithSatisfaction.length
        ).toFixed(1)
      : "N/A";
  const brandsWith20PlusReviews = brands.filter((b) => b.communityReviews >= 20).length;

  const topByRating = [...brandsWithSatisfaction]
    .sort((a, b) => (b.communityAvgSatisfaction ?? 0) - (a.communityAvgSatisfaction ?? 0))
    .slice(0, 8);

  const topByReviews = [...brands]
    .sort((a, b) => b.communityReviews - a.communityReviews)
    .slice(0, 8);

  const dataPoints = [
    "Actual total investment (vs. FDD estimate)",
    "First-year gross revenue",
    "Monthly operating costs breakdown",
    "Franchisor support quality rating",
    "Would-do-it-again assessment",
    "Time to break even",
    "Biggest surprise after opening",
    "Exit plan and timeline",
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
            Building This Database
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Franchisee Community Intelligence
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            We are building a database of anonymous franchisee performance data — actual
            investment costs, revenue, and satisfaction. If you are a franchise owner,
            your contribution helps future buyers make informed decisions.
          </p>
        </div>
      </section>

      {/* ── Current Status ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="border border-border rounded-xl bg-background p-6 text-center">
          <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto">
            We currently have <strong className="text-foreground">0 community submissions</strong> across{" "}
            <strong className="text-foreground">{brands.length} tracked brands</strong>.
            This database is new. If you are a current or former franchise owner, your anonymous
            data directly improves the quality of information available to prospective buyers.
          </p>
          <a
            href="mailto:submit@franchisel.com?subject=Anonymous%20Franchisee%20Review%20Submission"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:brightness-110 transition-all"
          >
            Submit Your Data
          </a>
        </div>
      </section>

      {/* ── PUBLIC SOURCES section ── */}
      {communityData.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Public Sources</h2>
            <p className="text-sm text-muted mt-0.5">
              Publicly available surveys, reviews, and news — with direct source links. Not from FDDs.
            </p>
          </div>
          <div className="ml-auto shrink-0 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-[11px] font-semibold">
            Not FDD data
          </div>
        </div>

        <div className="space-y-6">
          {communityData.map((profile) => (
            <div key={profile.brandSlug} className="rounded-xl border border-border bg-background overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/brands/${profile.brandSlug}`} className="font-semibold text-foreground hover:text-accent transition-colors text-sm">
                    {profile.brandName}
                  </Link>
                  <span className="text-[10px] text-muted">Updated {profile.lastUpdated}</span>
                </div>
                <Link href={`/brands/${profile.brandSlug}`} className="text-xs text-accent hover:underline shrink-0">
                  FDD Data →
                </Link>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.sentiment.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                    {entry.rating !== null && (
                      <div className="shrink-0 text-center min-w-[40px]">
                        <p className="text-xl font-bold text-foreground leading-none">{entry.rating}</p>
                        <p className="text-[10px] text-muted">/5</p>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-xs text-foreground leading-snug">{entry.excerpt}</p>
                      {entry.sampleSize && (
                        <p className="text-[10px] text-muted">{entry.sampleSize.toLocaleString()} responses</p>
                      )}
                      <CommunitySourceBadge source={entry.source} />
                    </div>
                  </div>
                ))}
                {profile.news.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-xs font-medium text-foreground">{entry.headline}</p>
                      <p className="text-[11px] text-muted">{entry.summary}</p>
                      <div className="flex items-center gap-2">
                        <CommunitySourceBadge source={entry.source} />
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          entry.sentiment === "positive" ? "text-success bg-success/10" :
                          entry.sentiment === "negative" ? "text-danger bg-danger/10" : "text-muted bg-surface"
                        }`}>{entry.sentiment}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── How Verification Works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">How Community Verification Will Work</h2>
          <p className="mt-2 text-sm text-muted max-w-xl mx-auto">
            Once we begin receiving submissions, each data point will be verified against public franchise records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            step={1}
            title="Submit Anonymous Review"
            description="Share your franchise performance data through our encrypted submission form. Your identity is never stored or shared."
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
          />
          <StepCard
            step={2}
            title="Verify Ownership"
            description="We cross-reference submissions with FDD Item 20 franchisee lists — the public registry of all franchise owners for each brand."
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            }
          />
          <StepCard
            step={3}
            title="Help Future Buyers"
            description="Your anonymized data is aggregated into brand profiles, helping prospective franchise buyers make informed investment decisions."
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── Community Status ── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Community Data Status</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            We have not yet received community submissions. Once franchisee data begins arriving,
            this page will display satisfaction rankings, review counts by brand, and aggregated
            performance metrics. All data will be verified before publication.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            If you are a current or former franchise owner, your anonymous data helps future
            buyers. We collect numerical performance data only — no subjective reviews that
            could conflict with non-disparagement clauses.
          </p>
        </div>
      </section>

      {/* ── Data Methodology ── */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Planned Community Data Methodology</h2>
            <p className="mt-2 text-sm text-muted max-w-2xl mx-auto">
              How we will collect, verify, and report franchisee performance data once submissions
              begin. This methodology is designed to produce more reliable data than traditional review platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Ownership Verification via Item 20",
                body: "Every submission is cross-referenced against FDD Item 20, which lists all current and former franchisees for each brand. Only confirmed owners or former operators are included in our dataset. This eliminates submissions from non-owners, competitors, or bad actors.",
                badge: "Core Process",
              },
              {
                title: "Minimum Threshold Reporting",
                body: "We only publish aggregated satisfaction scores when a brand has at least 5 verified submissions. Brands with fewer responses are listed with review counts but no satisfaction score, preventing misleading data from small samples.",
                badge: "Quality Control",
              },
              {
                title: "Outlier Detection",
                body: "Statistical outlier detection removes submissions that deviate more than 2.5 standard deviations from the brand mean. This prevents coordinated rating manipulation — both artificially high and artificially low submissions are flagged for manual review.",
                badge: "Anti-Manipulation",
              },
              {
                title: "Quantitative Data Only",
                body: "We collect numerical performance data (revenue, costs, satisfaction scores on a 1–10 scale) rather than subjective text reviews. This approach is generally not covered by non-disparagement clauses common in franchise agreements and produces more comparable data.",
                badge: "Legal Design",
              },
              {
                title: "Annual Re-Verification",
                body: "The franchise landscape changes. We re-verify submissions annually and remove data older than 3 years, or data from units that have closed. This ensures satisfaction scores reflect the current franchisee experience, not historical conditions.",
                badge: "Data Freshness",
              },
              {
                title: "Weighted Averages",
                body: "Satisfaction scores use a weighted average that gives more weight to recent submissions and to submissions from multi-unit operators (who have broader experience with the brand). Single-unit operators and multi-unit operators are both included, with transparent labeling.",
                badge: "Scoring Model",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 border border-border rounded-xl bg-background hover-glow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold bg-accent/10 text-accent rounded-full">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Coverage Grid ── */}
      <section className="border-t border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Brands Accepting Community Submissions</h2>
          <p className="text-sm text-muted mb-8">All {brands.length} brands in our database. No community data received yet.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands
              .sort((a, b) => b.communityReviews - a.communityReviews)
              .map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="flex items-center justify-between p-4 border border-border rounded-xl bg-background hover-glow group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                        {brand.name}
                      </p>
                      {brand.communityAvgSatisfaction && (
                        <p className="text-xs text-muted">
                          Avg satisfaction: {brand.communityAvgSatisfaction}/10
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">No data yet</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── What We Collect ── */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What We Collect</h2>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                We gather the data points that actually matter when evaluating a franchise investment — the numbers you
                can&apos;t find in a glossy brochure.
              </p>
              <div className="space-y-3">
                {dataPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 hover-item">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy commitment */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Privacy Commitment</h2>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                We take contributor privacy seriously. Your data helps others, but it never exposes you.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Zero personal data stored", desc: "We never store names, emails, or any personally identifiable information linked to reviews." },
                  { title: "Encrypted submissions", desc: "All review data is transmitted and stored with end-to-end encryption." },
                  { title: "Aggregated reporting only", desc: "Individual reviews are never published. Data is always aggregated at the brand level." },
                  { title: "Non-disparagement protection", desc: "Our data collection methodology is designed to comply with non-disparagement clauses common in franchise agreements. We report aggregate metrics, not individual opinions." },
                ].map((item, i) => (
                  <div key={i} className="p-4 border border-border rounded-xl bg-surface-alt hover-glow">
                    <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Submit a Review (form placeholder) ── */}
      <section className="border-t border-border bg-surface-alt">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Share Your Experience</h2>
            <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
              Your anonymized data helps future franchise buyers make better decisions.
              All submissions are verified and aggregated — never published individually.
            </p>
          </div>

          <div className="border border-border rounded-2xl bg-background p-6 sm:p-8">
            <CommunitySubmitForm />
          </div>

          {/* Non-disparagement notice */}
          <div className="mt-6 p-4 border border-border rounded-xl bg-background">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-warning-light flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1">Non-Disparagement Clause Protection</p>
                <p className="text-[11px] text-muted leading-relaxed">
                  Many franchise agreements include non-disparagement clauses. Our platform collects numerical
                  performance data (revenue, costs, satisfaction scores) rather than subjective opinions, which
                  is generally not covered by non-disparagement provisions. We recommend reviewing your franchise
                  agreement. This is not legal advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
