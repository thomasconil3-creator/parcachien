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

const NICE_SECTEURS = [
  "cimiez", "musiciens", "vieux-nice", "madeleine",
  "riquier", "liberation", "saint-isidore", "promenade",
];

const AIX_SECTEURS = [
  "centre-ville", "celony", "jas-de-bouffan",
  "les-milles", "puyricard", "nord",
];

const TOULON_SECTEURS = [
  "centre", "pont-du-las", "mourillon",
  "parc-raoulx", "parc-lices", "la-valette",
];

const DEPTS = [
  "bouches-du-rhone", "var", "alpes-maritimes",
  "vaucluse", "alpes-de-haute-provence", "hautes-alpes",
];

const THEMES = ["clotured", "sans-laisse", "agility", "gratuit"];

const PARTNER_CITIES = [
  "marseille", "nice", "toulon", "aix-en-provence", "avignon", "cannes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = [...new Set(PACA_PARKS.map((p) => cityToSlug(p.city)))];
  const now = new Date();

  return [
    // ── Pages principales ──────────────────────────────────────────────────
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/parcs`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // ── Pages par ville ────────────────────────────────────────────────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/parcs/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: slug === "marseille" ? 0.95 : slug === "nice" || slug === "toulon" || slug === "aix-en-provence" ? 0.90 : 0.80,
    })),

    // ── Pages par département ──────────────────────────────────────────────
    ...DEPTS.map((dept) => ({
      url: `${BASE_URL}/parcs/departement/${dept}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),

    // ── Marseille : arrondissements ────────────────────────────────────────
    ...MARSEILLE_ARRONDISSEMENTS.map((arr) => ({
      url: `${BASE_URL}/parcs/marseille/${arr}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),

    // ── Nice : quartiers ───────────────────────────────────────────────────
    ...NICE_SECTEURS.map((s) => ({
      url: `${BASE_URL}/parcs/nice/${s}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // ── Aix-en-Provence : secteurs ─────────────────────────────────────────
    ...AIX_SECTEURS.map((s) => ({
      url: `${BASE_URL}/parcs/aix/${s}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // ── Toulon : secteurs ──────────────────────────────────────────────────
    ...TOULON_SECTEURS.map((s) => ({
      url: `${BASE_URL}/parcs/toulon/${s}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // ── Pages thématiques ──────────────────────────────────────────────────
    ...THEMES.map((theme) => ({
      url: `${BASE_URL}/parcs/theme/${theme}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.80,
    })),

    // ── Articles blog ──────────────────────────────────────────────────────
    ...BLOG_SLUGS.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),

    // ── Annuaire partenaires ───────────────────────────────────────────────
    { url: `${BASE_URL}/partenaires`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE_URL}/partenaires/rejoindre`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.90 },
    ...PARTNER_CITIES.map((ville) => ({
      url: `${BASE_URL}/partenaires/${ville}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
  ];
}
