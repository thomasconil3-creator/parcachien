import { MetadataRoute } from "next";
import { PACA_PARKS } from "@/lib/parks-data";
import { cityToSlug } from "@/lib/utils";

const BASE_URL = "https://www.parcachien.com";

const BLOG_SLUGS = [
  "top-10-parcs-chiens-marseille-2026",
  "preparer-premiere-visite-parc-canin",
  "velox-ia-agence-derriere-parcachien",
  "parc-a-chien-marseille-8eme-arrondissement",
  "chien-sans-laisse-marseille-ou-aller",
  "trouver-parc-chien-pres-de-chez-moi-paca",
  "espaces-canins-nice-cote-azur",
  "regles-espaces-canins-marseille",
];

const MARSEILLE_ARRONDISSEMENTS = [
  "13001", "13002", "13003", "13004", "13005", "13006",
  "13007", "13008", "13009", "13010", "13011", "13012",
  "13013", "13014", "13015", "13016",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = [...new Set(PACA_PARKS.map((p) => cityToSlug(p.city)))];
  const now = new Date();

  return [
    // Pages principales
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/parcs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Pages par ville
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/parcs/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: slug === "marseille" ? 0.95 : 0.8,
    })),

    // Pages par arrondissement Marseille
    ...MARSEILLE_ARRONDISSEMENTS.map((arr) => ({
      url: `${BASE_URL}/parcs/marseille/${arr}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // Articles blog
    ...BLOG_SLUGS.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
