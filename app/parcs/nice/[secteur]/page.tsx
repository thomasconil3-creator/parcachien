import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import SeoFooter from "@/components/SeoFooter";

// ── Mapping secteur → IDs de parcs ───────────────────────────────────────────
// Parcs Nice du JSON (city = "Nice") avec leurs coordonnées
// Secteurs approximatifs basés sur les quartiers de Nice

const SECTEUR_PARK_IDS: Record<string, string[]> = {
  // Les IDs des parcs Nice proviennent du JSON — on les filtre par proximity
  "cimiez": [],        // Nord (lat > 43.715)
  "musiciens": [],     // Ouest centre (lng < 7.26)
  "vieux-nice": [],    // Vieux-Nice / Port (lng > 7.275, lat < 43.700)
  "madeleine": [],     // Centre-Sud
  "riquier": [],       // Est (lng > 7.28)
  "gambetta": [],      // Centre-Ouest
  "liberation": [],    // Liberation / Gorbella
  "saint-isidore": [], // Nord-Ouest périphérie
};

// ── Infos par secteur ─────────────────────────────────────────────────────────

const SECTEUR_INFO: Record<string, {
  name: string;
  postalCode: string;
  neighborhoods: string;
  description: string;
  tips: string;
  parkBounds: { latMin: number; latMax: number; lngMin: number; lngMax: number };
}> = {
  "cimiez": {
    name: "Cimiez",
    postalCode: "06000",
    neighborhoods: "Cimiez, Gairaut, Pessicart, Mont Boron (partie nord)",
    description: "Le quartier de Cimiez, avec ses jardins romains et ses villas Belle Époque, est l'un des plus élégants de Nice. La colline de Cimiez offre de nombreuses promenades verdoyantes pour les propriétaires de chiens, avec plusieurs espaces canins bien aménagés.",
    tips: "Les jardins de Cimiez (autour du musée Matisse) permettent les balades en laisse. Plusieurs espaces canins sont accessibles dans les rues environnantes.",
    parkBounds: { latMin: 43.715, latMax: 43.740, lngMin: 7.250, lngMax: 7.290 },
  },
  "musiciens": {
    name: "Musiciens / Gambetta",
    postalCode: "06000",
    neighborhoods: "Musiciens, Gambetta, Carabacel, République",
    description: "Le quartier des Musiciens et Gambetta, entre la gare et le cœur de Nice, est un quartier animé très prisé des familles avec chiens. Plusieurs espaces canins y sont accessibles à pied.",
    tips: "Ce secteur est bien desservi en espaces canins. La proximité du Parc Valrose permet de belles balades en laisse.",
    parkBounds: { latMin: 43.700, latMax: 43.720, lngMin: 7.240, lngMax: 7.265 },
  },
  "vieux-nice": {
    name: "Vieux-Nice / Port",
    postalCode: "06300",
    neighborhoods: "Vieux-Nice, Le Port, Baumettes, Colline du Château",
    description: "Le Vieux-Nice, avec ses ruelles colorées et son port, est un quartier touristique et résidentiel. La colline du Château offre une vue panoramique et des espaces naturels accessibles aux chiens (en laisse).",
    tips: "La promenade du Paillon (Coulée Verte) est accessible aux chiens en laisse. La plage du Port permet les balades côtières hors saison.",
    parkBounds: { latMin: 43.692, latMax: 43.705, lngMin: 7.270, lngMax: 7.295 },
  },
  "madeleine": {
    name: "Madeleine / Pasteur",
    postalCode: "06200",
    neighborhoods: "Madeleine, Saint-Roch, Pasteur, Notre-Dame",
    description: "Le secteur Madeleine-Pasteur, dans le sud de Nice, est un quartier résidentiel dense avec plusieurs espaces canins. Le quartier Saint-Roch abrite des jardins accessibles aux propriétaires de chiens.",
    tips: "Les espaces canins de ce secteur sont fréquentés en fin de journée. Consultez ParcAChien pour voir l'affluence en temps réel avant de vous déplacer.",
    parkBounds: { latMin: 43.695, latMax: 43.710, lngMin: 7.250, lngMax: 7.275 },
  },
  "riquier": {
    name: "Riquier / Baumettes",
    postalCode: "06300",
    neighborhoods: "Riquier, Baumettes, Bon Voyage, L'Ariane",
    description: "Le secteur Riquier-Baumettes, à l'est du Vieux-Nice, est un quartier authentique avec plusieurs espaces canins de proximité. L'accès rapide à la colline du Château permet des balades en nature.",
    tips: "Ce secteur dispose de plusieurs espaces canins à taille humaine. L'accès aux sentiers de la colline du Château est libre pour les chiens en laisse.",
    parkBounds: { latMin: 43.695, latMax: 43.715, lngMin: 7.275, lngMax: 7.310 },
  },
  "liberation": {
    name: "Libération / Gorbella",
    postalCode: "06000",
    neighborhoods: "Libération, Gorbella, Saint-Barthélemy, Les Moulins",
    description: "Le quartier de la Libération est le principal marché de Nice mais aussi un secteur résidentiel dynamique. Gorbella et Saint-Barthélemy offrent des espaces plus calmes avec des accès à la nature.",
    tips: "Les espaces naturels des collines derrière Gorbella sont parfaits pour les longues balades avec votre chien.",
    parkBounds: { latMin: 43.710, latMax: 43.730, lngMin: 7.240, lngMax: 7.265 },
  },
  "saint-isidore": {
    name: "Saint-Isidore / Lingostière",
    postalCode: "06200",
    neighborhoods: "Saint-Isidore, Lingostière, L'Ariane, La Trinité (limite)",
    description: "Ce secteur nord-ouest de Nice, en périphérie, offre des espaces naturels importants pour les propriétaires de chiens. Moins dense, il permet de belles balades dans la campagne niçoise.",
    tips: "La proximité avec la campagne et les collines de l'arrière-pays niçois est un atout majeur pour les propriétaires de grands chiens ayant besoin d'espace.",
    parkBounds: { latMin: 43.725, latMax: 43.755, lngMin: 7.215, lngMax: 7.260 },
  },
  "promenade": {
    name: "Promenade des Anglais / Centre",
    postalCode: "06000",
    neighborhoods: "Promenade des Anglais, Jean Médecin, Masséna",
    description: "Le cœur de Nice, autour de la Promenade des Anglais et de Jean Médecin, est la zone la plus touristique. La plage est accessible aux chiens hors saison (octobre à mai). Le Jardin Albert 1er et l'Espace Masséna permettent les balades en laisse.",
    tips: "En dehors de la saison estivale (juin-septembre), votre chien est toléré sur une partie de la plage niçoise. La Promenade des Anglais est accessible en laisse.",
    parkBounds: { latMin: 43.693, latMax: 43.702, lngMin: 7.240, lngMax: 7.275 },
  },
};

const ALL_SECTEURS = Object.keys(SECTEUR_INFO);

export async function generateStaticParams() {
  return ALL_SECTEURS.map((secteur) => ({ secteur }));
}

export async function generateMetadata({ params }: { params: Promise<{ secteur: string }> }): Promise<Metadata> {
  const { secteur } = await params;
  const info = SECTEUR_INFO[secteur];
  if (!info) return { title: "Secteur introuvable — ParcAChien" };

  const title = `Parc à chien Nice ${info.name} (${info.postalCode}) — Espaces canins | ParcAChien`;
  const description = `Espaces canins à Nice dans le quartier ${info.name} (${info.postalCode}). ${info.neighborhoods}. ${info.description.slice(0, 120)}`;

  return {
    title,
    description,
    keywords: [
      `parc à chien Nice ${info.name}`,
      `espace canin Nice ${info.name}`,
      `jardin canin ${info.name} Nice`,
      `parc chien ${info.postalCode}`,
      `espace canin ${info.postalCode}`,
      `aire canine Nice ${info.name}`,
      `sortir son chien Nice ${info.name}`,
      "parc à chien Nice",
      "espace canin Nice",
      "jardin canin Côte d'Azur",
    ],
    alternates: { canonical: `https://www.parcachien.com/parcs/nice/${secteur}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/parcs/nice/${secteur}`,
    },
  };
}

export default async function NiceSecteurPage({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur } = await params;
  const info = SECTEUR_INFO[secteur];
  if (!info) notFound();

  // Filtrer les parcs de Nice dans les bounds du secteur
  const allNiceParks = PACA_PARKS.filter((p) => p.city === "Nice");
  const bounds = info.parkBounds;
  const sectorParks = allNiceParks.filter(
    (p) => p.lat >= bounds.latMin && p.lat <= bounds.latMax && p.lng >= bounds.lngMin && p.lng <= bounds.lngMax
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/nice/${secteur}`,
        "url": `https://www.parcachien.com/parcs/nice/${secteur}`,
        "name": `Parc à chien Nice — ${info.name} (${info.postalCode})`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": "Parcs à chiens à Nice", "item": "https://www.parcachien.com/parcs/nice" },
          { "@type": "ListItem", "position": 4, "name": info.name, "item": `https://www.parcachien.com/parcs/nice/${secteur}` },
        ],
      },
    ],
  };

  const otherSecteurs = ALL_SECTEURS.filter((s) => s !== secteur);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>{" › "}
        <a href="/parcs" style={{ color: "#7C6EF5", textDecoration: "none" }}>Parcs</a>{" › "}
        <a href="/parcs/nice" style={{ color: "#7C6EF5", textDecoration: "none" }}>Nice</a>{" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parc à chien à Nice — {info.name} ({info.postalCode})
      </h1>
      <p style={{ fontSize: 14, color: "#7C6EF5", fontWeight: 600, marginBottom: 12 }}>{info.neighborhoods}</p>
      <p style={{ color: "#555", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>{info.description}</p>

      {sectorParks.length > 0 ? (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>
            {sectorParks.length} espace{sectorParks.length > 1 ? "s" : ""} canin{sectorParks.length > 1 ? "s" : ""} dans ce secteur
          </h2>
          <div style={{ display: "grid", gap: 14, marginBottom: 40 }}>
            {sectorParks.map((park) => (
              <div key={park.id} style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 14, padding: "18px 22px", boxShadow: "0 2px 8px rgba(124,110,245,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{park.name}</h3>
                    {park.address && <p style={{ fontSize: 13, color: "#777" }}>📍 {park.address}</p>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {park.fenced && <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Clôturé</span>}
                    {park.rating && <span style={{ background: "#fff8e1", color: "#f57f17", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>★ {park.rating}/5</span>}
                  </div>
                </div>
                {park.opening_hours && <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>🕐 {park.opening_hours}</p>}
                {park.size && <p style={{ fontSize: 13, color: "#555" }}>📐 {park.size}</p>}
                {park.features && park.features.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {park.features.map((f, i) => (
                      <span key={i} style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{f}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: "#7C6EF5", fontWeight: 600, marginBottom: 8 }}>💡 Conseil</p>
          <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{info.tips}</p>
          <a href="/parcs/nice" style={{ display: "inline-block", marginTop: 12, color: "#7C6EF5", fontWeight: 600, fontSize: 14 }}>
            → Voir tous les espaces canins à Nice
          </a>
        </div>
      )}

      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 8 }}>💡 Bon à savoir</p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{info.tips}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Autres quartiers de Nice</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherSecteurs.map((s) => (
            <a key={s} href={`/parcs/nice/${s}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
              {SECTEUR_INFO[s].name}
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
