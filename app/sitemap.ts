import { MetadataRoute } from "next";
import { PACA_PARKS } from "@/lib/parks-data";
import { cityToSlug } from "@/lib/utils";

const BASE_URL = "https://www.parcachien.com";

const BLOG_SLUGS = [
  "top-10-parcs-chiens-marseille-2026",
  "preparer-premiere-visite-parc-canin",
  "velox-ia-agence-derriere-parcachien",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = [...new Set(PACA_PARKS.map((p) => cityToSlug(p.city)))];
  const now = new Date();

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/parcs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/parcs/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BLOG_SLUGS.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
