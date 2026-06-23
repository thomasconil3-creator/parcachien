import { MetadataRoute } from "next";
import { PACA_PARKS } from "@/lib/parks-data";

const BASE_URL = "https://www.parcachien.com";

function cityToSlug(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const BLOG_SLUGS = [
  "top-10-parcs-chiens-marseille-2026",
  "preparer-premiere-visite-parc-canin",
  "velox-ia-agence-derriere-parcachien",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = [...new Set(PACA_PARKS.map((p) => cityToSlug(p.city)))];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/parcs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/parcs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BLOG_SLUGS.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
