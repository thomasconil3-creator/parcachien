import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import { cityToSlug } from "@/lib/utils";
import SeoFooter from "@/components/SeoFooter";

const THEME_INFO: Record<string, {
  name: string;
  title: string;
  description: string;
  longDescription: string;
  keywords: string[];
  filter: (park: typeof PACA_PARKS[0]) => boolean;
}> = {
  "clotured": {
    name: "Espaces canins clôturés",
    title: "Espaces canins clôturés en PACA — Chien sans laisse en sécurité",
    description: "Tous les parcs à chiens clôturés en région PACA : votre chien peut courir librement en toute sécurité. Marseille, Nice, Toulon, Aix.",
    longDescription: "Un espace canin clôturé offre la tranquillité d'esprit aux propriétaires : votre chien peut courir librement sans risque de fugue. En PACA, de nombreux espaces canins sont entièrement clôturés avec des portillons sécurisés. Voici la liste complète, mise à jour régulièrement.",
    keywords: [
      "espace canin clôturé PACA",
      "parc à chien clôturé",
      "parc chien sans laisse clôturé",
      "jardin canin clôturé Marseille",
      "espace canin fermé",
      "parc chien sécurisé PACA",
      "aire canine clôturée",
      "enclos chien PACA",
    ],
    filter: (p) => p.fenced === true,
  },
  "sans-laisse": {
    name: "Chien sans laisse",
    title: "Parcs à chiens sans laisse en PACA — Aires de liberté canine",
    description: "Où laisser son chien sans laisse en PACA ? Espaces canins et zones de liberté à Marseille, Nice, Toulon, Aix-en-Provence et toute la région.",
    longDescription: "Trouver un endroit où votre chien peut évoluer librement sans laisse est parfois difficile en ville. En PACA, les espaces canins clôturés permettent cette liberté en toute légalité. Certains parcs disposent également de zones officiellement désignées \"sans laisse\". Voici notre sélection complète.",
    keywords: [
      "parc chien sans laisse PACA",
      "espace canin sans laisse",
      "aire de liberté canine",
      "zone sans laisse chien",
      "parc chien laisse facultative",
      "liberté chien PACA",
      "chien sans laisse Marseille",
      "ballade chien sans laisse",
    ],
    filter: (p) => p.fenced === true || (p.features?.includes("sans laisse") ?? false),
  },
  "agility": {
    name: "Agility",
    title: "Espaces canins avec agility en PACA — Parcours pour chiens",
    description: "Parcs à chiens avec équipements d'agility en PACA : tunnels, barres, palissades, slalom. Marseille, Toulon (Parc des Lices), Cannes (Espace du Lys) et plus.",
    longDescription: "L'agility est une discipline sportive et ludique qui stimule physiquement et mentalement votre chien. En PACA, plusieurs espaces canins sont équipés de parcours d'agility. Le Parc des Lices à Toulon (90 000 m²) est la référence avec le club Canibest. Voici tous les espaces canins avec agility de la région.",
    keywords: [
      "agility chien PACA",
      "espace canin agility",
      "parcours agility chien",
      "parc chien agility Marseille",
      "parc chien agility Toulon",
      "club agility PACA",
      "agility canin",
      "parc canin sportif PACA",
    ],
    filter: (p) => p.features?.includes("agility") ?? false,
  },
  "gratuit": {
    name: "Gratuit",
    title: "Parcs à chiens gratuits en PACA — Espaces canins sans inscription",
    description: "Tous les espaces canins gratuits en PACA : accès libre, sans abonnement. Marseille, Nice, Toulon, Aix-en-Provence. 308+ parcs accessibles gratuitement.",
    longDescription: "Bonne nouvelle : la quasi-totalité des espaces canins publics en région PACA sont entièrement gratuits ! Financés par les communes, ils sont accessibles à tous les propriétaires de chiens sans inscription ni abonnement. Voici la liste complète des espaces canins gratuits de la région.",
    keywords: [
      "parc à chien gratuit PACA",
      "espace canin gratuit",
      "espace canin gratuit Marseille",
      "jardin canin gratuit",
      "aire canine gratuite",
      "caniparc gratuit",
      "parc chien accès libre",
      "espace canin public PACA",
    ],
    filter: () => true, // Tous les parcs publics sont gratuits
  },
};

const ALL_THEMES = Object.keys(THEME_INFO);

export async function generateStaticParams() {
  return ALL_THEMES.map((theme) => ({ theme }));
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }): Promise<Metadata> {
  const { theme } = await params;
  const info = THEME_INFO[theme];
  if (!info) return { title: "Thème introuvable — ParcAChien" };

  return {
    title: `${info.title} | ParcAChien`,
    description: info.description,
    keywords: info.keywords,
    alternates: { canonical: `https://www.parcachien.com/parcs/theme/${theme}` },
    openGraph: {
      title: `${info.title} | ParcAChien`,
      description: info.description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/parcs/theme/${theme}`,
    },
  };
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const info = THEME_INFO[theme];
  if (!info) notFound();

  const matchingParks = PACA_PARKS.filter(info.filter);
  const byCity = matchingParks.reduce<Record<string, typeof matchingParks>>((acc, park) => {
    if (!acc[park.city]) acc[park.city] = [];
    acc[park.city].push(park);
    return acc;
  }, {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/theme/${theme}`,
        "url": `https://www.parcachien.com/parcs/theme/${theme}`,
        "name": info.title,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": info.name, "item": `https://www.parcachien.com/parcs/theme/${theme}` },
        ],
      },
      {
        "@type": "ItemList",
        "name": info.name,
        "numberOfItems": matchingParks.length,
        "itemListElement": matchingParks.slice(0, 30).map((park, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Park",
            "name": park.name,
            "address": park.address ? {
              "@type": "PostalAddress",
              "streetAddress": park.address,
              "addressLocality": park.city,
              "addressCountry": "FR",
            } : undefined,
            "geo": { "@type": "GeoCoordinates", "latitude": park.lat, "longitude": park.lng },
          },
        })),
      },
    ],
  };

  const otherThemes = ALL_THEMES.filter((t) => t !== theme);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>{" › "}
        <a href="/parcs" style={{ color: "#7C6EF5", textDecoration: "none" }}>Parcs</a>{" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 {info.name} en PACA
      </h1>
      <p style={{ fontSize: 13, color: "#7C6EF5", fontWeight: 600, marginBottom: 16 }}>
        {matchingParks.length} espace{matchingParks.length > 1 ? "s" : ""} · {Object.keys(byCity).length} villes
      </p>
      <p style={{ color: "#555", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
        {info.longDescription}
      </p>

      {/* By city */}
      {Object.entries(byCity)
        .sort(([, a], [, b]) => b.length - a.length)
        .map(([city, cityParks]) => (
          <div key={city} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#7C6EF5", marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid #f0eeff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <a href={`/parcs/${cityToSlug(city)}`} style={{ color: "#7C6EF5", textDecoration: "none" }}>
                {city}
              </a>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#aaa" }}>
                {cityParks.length} parc{cityParks.length > 1 ? "s" : ""}
              </span>
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {cityParks.map((park) => (
                <div key={park.id} style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 6px rgba(124,110,245,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{park.name}</h3>
                      {park.address && <p style={{ fontSize: 13, color: "#777" }}>📍 {park.address}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {park.fenced && <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Clôturé</span>}
                      {park.rating && <span style={{ background: "#fff8e1", color: "#f57f17", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>★ {park.rating}/5</span>}
                    </div>
                  </div>
                  {park.size && <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>📐 {park.size}</p>}
                  {park.features && park.features.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {park.features.map((f, i) => <span key={i} style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{f}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Other themes */}
      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 12 }}>Autres catégories</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherThemes.map((t) => (
            <a key={t} href={`/parcs/theme/${t}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
              {THEME_INFO[t].name}
            </a>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <a href="/" style={{ display: "inline-block", background: "#7C6EF5", color: "#fff", padding: "14px 32px", borderRadius: 50, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
          🗺️ Voir la carte interactive
        </a>
      </div>
      <SeoFooter />
    </main>
  );
}
