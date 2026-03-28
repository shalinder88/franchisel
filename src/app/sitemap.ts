import type { MetadataRoute } from "next";
import { brands } from "@/data/brands";
import { guides, categories } from "@/data/brands";

const BASE_URL = "https://franchisel.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const brandUrls = brands.map((b) => ({
    url: `${BASE_URL}/brands/${b.slug}`,
    lastModified: new Date(b.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const guideUrls = guides.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryUrls = categories
    .filter((c) => c.brandCount > 0)
    .map((c) => ({
      url: `${BASE_URL}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const staticDate = new Date("2025-03-15");

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/compare`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/reports`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE_URL}/watchlist`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about/methodology`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about/editorial-policy`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/about/source-policy`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/disclosure`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.2 },
    ...brandUrls,
    ...guideUrls,
    ...categoryUrls,
  ];
}
