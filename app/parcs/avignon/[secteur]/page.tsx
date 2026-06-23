import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import SeoFooter from "@/components/SeoFooter";

// ── Infos par secteur ─────────────────────────────────────────────────────────

const SECTEUR_INFO: Record<string, {
  name: string;
  postalCode: string;
  neighborhoods: string;
  description: string;
  tips: string;
  parkBounds: { latMin: number; latMax: number; lngMin: number; lngMax: number };
}> = {
  "intra-muros": {
    name: "Intra-muros",
    postalCode: "84000",
    neighborhoods: "Intra-muros, Palais des Papes, Rocher des Doms, Place de l'Horloge",
    description: "Le centre historique d'Avignon, classé UNESCO, est un secteur dense mais proche du Rhône et de ses berges. Les promenades en bord de Rhône (Île de la Barthelasse accessible) sont idéales pour les propriétaires de chiens.",
    tips: "L'Île de la Barthelasse (accessible à pied ou en bac) offre des espaces verts immenses, parfaits pour les chiens.",
    parkBounds: { latMin: 43.940, latMax: 43.960, lngMin: 4.795, lngMax: 4.820 },
  },
  "saint-chamand": {
    name: "Saint-Chamand",
    postalCode: "84000",
    neighborhoods: "Saint-Chamand, Croix des Oiseaux, La Barbière",
    description: "Quartier résidentiel au sud d'Avignon. Dispose d'espaces canins communaux accessibles.",
    tips: "L'espace canin du square Henri Duffaut est le plus proche de ce secteur.",
    parkBounds: { latMin: 43.920, latMax: 43.940, lngMin: 4.800, lngMax: 4.830 },
  },
  "monclar": {
    name: "Monclar / Cap Sud",
    postalCode: "84000",
    neighborhoods: "Monclar, Font de Rouet, Les Amandiers",
    description: "Grand quartier populaire d'Avignon avec plusieurs aires de jeux et espaces verts. Secteur bien desservi pour les propriétaires de chiens.",
    tips: "Le Parc des Libertés (Avenue de Monclar) offre un grand espace vert avec espace canin délimité.",
    parkBounds: { latMin: 43.930, latMax: 43.950, lngMin: 4.820, lngMax: 4.850 },
  },
  "les-angles": {
    name: "Les Angles / Villeneuve-lès-Avignon",
    postalCode: "30133",
    neighborhoods: "Les Angles, Villeneuve-lès-Avignon, Fort Saint-André",
    description: "De l'autre côté du Rhône, les communes du Gard (Les Angles, Villeneuve-lès-Avignon) offrent des espaces verts généreux et des espaces canins tranquilles.",
    tips: "Les bords du Rhône côté Villeneuve et le Fort Saint-André offrent de belles balades avec vue sur Avignon.",
    parkBounds: { latMin: 43.955, latMax: 43.980, lngMin: 4.775, lngMax: 4.800 },
  },
  "montfavet": {
    name: "Montfavet / Vedène",
    postalCode: "84140",
    neighborhoods: "Montfavet, Vedène, Morières-lès-Avignon",
    description: "En périphérie est d'Avignon, Montfavet dispose de parcs et d'un cadre semi-rural idéal pour les chiens. Le parc des Sources à Montfavet est très apprécié.",
    tips: "Le Parc des Sources à Montfavet est un grand espace arboré très prisé des propriétaires de chiens de l'agglomération avignonnaise.",
    parkBounds: { latMin: 43.920, latMax: 43.960, lngMin: 4.855, lngMax: 4.920 },
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

  const title = `Parc à chien Avignon ${info.name} (${info.postalCode}) — Espaces canins | ParcAChien`;
  const description = `Espaces canins à Avignon dans le quartier ${info.name} (${info.postalCode}). ${info.neighborhoods}. ${info.description.slice(0, 120)}`;

  return {
    title,
    description,
    keywords: [
      `parc à chien Avignon ${info.name}`,
      `espace canin Avignon ${info.name}`,
      `jardin canin ${info.name} Avignon`,
      `parc chien ${info.postalCode}`,
      `espace canin ${info.postalCode}`,
      `aire canine Avignon ${info.name}`,
      `sortir son chien Avignon ${info.name}`,
      "parc à chien Avignon",
      "espace canin Avignon",
      "parc chien Vaucluse",
      "parc chien 84000",
      "espace canin Vaucluse",
    ],
    alternates: { canonical: `https://www.parcachien.com/parcs/avignon/${secteur}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/parcs/avignon/${secteur}`,
    },
  };
}

export default async function AvignonSecteurPage({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur } = await params;
  const info = SECTEUR_INFO[secteur];
  if (!info) notFound();

  // Filtrer les parcs d'Avignon dans les bounds du secteur
  const allAvignonParks = PACA_PARKS.filter(
    (p) => p.city === "Avignon" || p.city === "Villeneuve-lès-Avignon" || p.city === "Les Angles" || p.city === "Montfavet"
  );
  const bounds = info.parkBounds;
  const sectorParks = allAvignonParks.filter(
    (p) => p.lat >= bounds.latMin && p.lat <= bounds.latMax && p.lng >= bounds.lngMin && p.lng <= bounds.lngMax
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/avignon/${secteur}`,
        "url": `https://www.parcachien.com/parcs/avignon/${secteur}`,
        "name": `Parc à chien Avignon — ${info.name} (${info.postalCode})`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": "Parcs à chiens à Avignon", "item": "https://www.parcachien.com/parcs/avignon" },
          { "@type": "ListItem", "position": 4, "name": info.name, "item": `https://www.parcachien.com/parcs/avignon/${secteur}` },
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
        <a href="/parcs/avignon" style={{ color: "#7C6EF5", textDecoration: "none" }}>Avignon</a>{" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parc à chien à Avignon — {info.name} ({info.postalCode})
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
          <a href="/parcs/avignon" style={{ display: "inline-block", marginTop: 12, color: "#7C6EF5", fontWeight: 600, fontSize: 14 }}>
            → Voir tous les espaces canins à Avignon
          </a>
        </div>
      )}

      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 8 }}>💡 Bon à savoir</p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{info.tips}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Autres secteurs d'Avignon</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherSecteurs.map((s) => (
            <a key={s} href={`/parcs/avignon/${s}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
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
