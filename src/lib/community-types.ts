/**
 * Community data types — COMPLETELY SEPARATE from FDD data.
 * Community data is user/press/survey sourced. It never flows into
 * FDD scores, brand pages, or any FDD-derived section of the site.
 */

export type CommunitySourceType =
  | "fbr_survey"        // Franchise Business Review annual franchisee satisfaction survey
  | "news_article"      // Published press article
  | "reddit"            // Reddit thread (r/franchises, r/entrepreneur, etc.)
  | "glassdoor"         // Glassdoor company review aggregate
  | "bbb"               // Better Business Bureau rating/complaint count
  | "owner_forum"       // Franchisee association or forum post
  | "youtube"           // YouTube interview or documentary
  | "podcast";          // Podcast episode

export interface CommunitySource {
  type: CommunitySourceType;
  label: string;        // e.g. "Franchise Business Review 2024 Survey"
  url: string;          // direct URL to source
  dateAccessed: string; // ISO date this was retrieved
  datePublished?: string; // ISO date the source was published
}

export interface CommunitySentimentEntry {
  brandSlug: string;
  brandName: string;
  source: CommunitySource;
  /** Rating out of 5 if source provides one, else null */
  rating: number | null;
  /** Number of responses/reviews the rating is based on, if known */
  sampleSize: number | null;
  /** Short verbatim quote or factual summary — max 100 chars, in quotes if verbatim */
  excerpt: string;
  /** Category of the insight */
  category: "satisfaction" | "training" | "support" | "profitability" | "culture" | "general";
}

export interface CommunityNewsEntry {
  brandSlug: string;
  brandName: string;
  source: CommunitySource;
  headline: string;
  /** 1–2 sentence factual summary in original wording — never reproduce full article */
  summary: string;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
}

export interface CommunityBrandProfile {
  brandSlug: string;
  brandName: string;
  lastUpdated: string; // ISO date
  sentiment: CommunitySentimentEntry[];
  news: CommunityNewsEntry[];
}
