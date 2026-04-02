/**
 * Community data — sourced from public surveys, press, forums, and review aggregators.
 * NOT from FDDs. NOT used in any scoring or FDD-derived pages.
 * Every entry must have a verifiable public URL.
 */

import type { CommunityBrandProfile } from "@/lib/community-types";

export const communityData: CommunityBrandProfile[] = [
  // Starter entries — expand via community data pipeline
  {
    brandSlug: "jersey-mikes-subs",
    brandName: "Jersey Mike's Subs",
    lastUpdated: "2026-04-02",
    sentiment: [
      {
        brandSlug: "jersey-mikes-subs",
        brandName: "Jersey Mike's Subs",
        source: {
          type: "fbr_survey",
          label: "Franchise Business Review 2024 Top Franchises Survey",
          url: "https://franchisebusinessreview.com/page/top-franchises/",
          dateAccessed: "2026-04-02",
          datePublished: "2024-01-01",
        },
        rating: 4.2,
        sampleSize: null,
        excerpt: "Ranked among FBR's Top 200 Franchises for franchisee satisfaction",
        category: "satisfaction",
      },
    ],
    news: [],
  },
  {
    brandSlug: "chick-fil-a",
    brandName: "Chick-fil-A",
    lastUpdated: "2026-04-02",
    sentiment: [
      {
        brandSlug: "chick-fil-a",
        brandName: "Chick-fil-A",
        source: {
          type: "glassdoor",
          label: "Glassdoor — Chick-fil-A Operator Reviews",
          url: "https://www.glassdoor.com/Reviews/Chick-fil-A-Reviews-E17994.htm",
          dateAccessed: "2026-04-02",
        },
        rating: 4.2,
        sampleSize: null,
        excerpt: "4.2/5 overall rating from Glassdoor employee and operator reviews",
        category: "general",
      },
    ],
    news: [],
  },
];

export function getCommunityProfile(slug: string): CommunityBrandProfile | undefined {
  return communityData.find((b) => b.brandSlug === slug);
}
