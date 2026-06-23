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
  "centre-croisette": {
    name: "Centre / La Croisette",
    postalCode: "06400",
    neighborhoods: "Centre-Ville, La Croisette, Rue d'Antibes, La Bocca haute",
    description: "Le cœur de Cannes, entre la Croisette et la Rue d'Antibes. Secteur très touristique mais avec des squares et jardins pour les propriétaires de chiens. Les plages hors saison acceptent les chiens tôt le matin.",
    tips: "La plage de la Bocca (à l'ouest du Vieux-Port) est la plus accessible pour les chiens en dehors de la saison. Les squares du centre offrent des espaces pour les balades en laisse.",
    parkBounds: { latMin: 43.545, latMax: 43.560, lngMin: 7.010, lngMax: 7.040 },
  },
  "la-bocca": {
    name: "La Bocca / Ranguin",
    postalCode: "06150",
    neighborhoods: "La Bocca, Ranguin, Coubertin",
    description: "Quartier résidentiel à l'ouest de Cannes, La Bocca est idéal pour les propriétaires de chiens avec ses espaces canins communaux et ses parcs de quartier.",
    tips: "Le Parc Randon (Quartier Ranguin) est le principal espace canin de ce secteur.",
    parkBounds: { latMin: 43.545, latMax: 43.560, lngMin: 6.985, lngMax: 7.015 },
  },
  "le-cannet": {
    name: "Le Cannet / Rocheville",
    postalCode: "06110",
    neighborhoods: "Le Cannet, Rocheville, La Frayère",
    description: "Commune voisine de Cannes, Le Cannet offre un cadre résidentiel calme avec des espaces verts et des vues panoramiques. Les parcs de quartier y sont accessibles aux chiens en laisse.",
    tips: "Le Parc des Eucalyptus au Cannet est un espace agréable pour les balades matinales avec son chien.",
    parkBounds: { latMin: 43.565, latMax: 43.580, lngMin: 6.995, lngMax: 7.020 },
  },
  "mandelieu": {
    name: "Mandelieu-la-Napoule / Théoule",
    postalCode: "06210",
    neighborhoods: "Mandelieu, La Napoule, Les Termes",
    description: "À l'ouest de Cannes, Mandelieu-la-Napoule dispose d'espaces naturels généreux le long de la Siagne et du littoral. Idéal pour les balades avec les chiens.",
    tips: "Les bords de la Siagne à Mandelieu et les sentiers côtiers vers Théoule-sur-Mer sont accessibles aux chiens en laisse.",
    parkBounds: { latMin: 43.530, latMax: 43.555, lngMin: 6.945, lngMax: 6.985 },
  },
  "mougins": {
    name: "Mougins / Valbonne",
    postalCode: "06250",
    neighborhoods: "Mougins, Valbonne, Sophia-Antipolis",
    description: "Les villages perchés de Mougins et Valbonne, en arrière-pays cannois, offrent un cadre provençal magnifique pour les balades avec les chiens. L'espace canin de Mougins est bien entretenu.",
    tips: "Le Parc des Sources à Mougins est très apprécié. Les sentiers de randonnée autour de Valbonne permettent de longues balades avec son chien dans la garrigue.",
    parkBounds: { latMin: 43.590, latMax: 43.630, lngMin: 6.990, lngMax: 7.030 },
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

  const title = `Parc à chien Cannes ${info.name} (${info.postalCode}) — Espaces canins | ParcAChien`;
  const description = `Espaces canins à Cannes dans le quartier ${info.name} (${info.postalCode}). ${info.neighborhoods}. ${info.description.slice(0, 120)}`;

  return {
    title,
    description,
    keywords: [
      `parc à chien Cannes ${info.name}`,
      `espace canin Cannes ${info.name}`,
      `jardin canin ${info.name} Cannes`,
      `parc chien ${info.postalCode}`,
      `espace canin ${info.postalCode}`,
      `aire canine Cannes ${info.name}`,
      `sortir son chien Cannes ${info.name}`,
      "parc à chien Cannes",
      "espace canin Cannes",
      "parc chien Alpes-Maritimes",
      "parc chien 06400",
      "parc chien 06",
      "espace canin Côte d'Azur",
    ],
    alternates: { canonical: `https://www.parcachien.com/parcs/cannes/${secteur}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/parcs/cannes/${secteur}`,
    },
  };
}

export default async function CannesSecteurPage({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur } = await params;
  const info = SECTEUR_INFO[secteur];
  if (!info) notFound();

  // Filtrer les parcs de Cannes dans les bounds du secteur
  const allCannesParks = PACA_PARKS.filter(
    (p) => p.city === "Cannes" || p.city === "Le Cannet" || p.city === "Mandelieu-la-Napoule" || p.city === "Mougins" || p.city === "Valbonne"
  );
  const bounds = info.parkBounds;
  const sectorParks = allCannesParks.filter(
    (p) => p.lat >= bounds.latMin && p.lat <= bounds.latMax && p.lng >= bounds.lngMin && p.lng <= bounds.lngMax
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/cannes/${secteur}`,
        "url": `https://www.parcachien.com/parcs/cannes/${secteur}`,
        "name": `Parc à chien Cannes — ${info.name} (${info.postalCode})`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": "Parcs à chiens à Cannes", "item": "https://www.parcachien.com/parcs/cannes" },
          { "@type": "ListItem", "position": 4, "name": info.name, "item": `https://www.parcachien.com/parcs/cannes/${secteur}` },
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
        <a href="/parcs/cannes" style={{ color: "#7C6EF5", textDecoration: "none" }}>Cannes</a>{" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parc à chien à Cannes — {info.name} ({info.postalCode})
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
          <a href="/parcs/cannes" style={{ display: "inline-block", marginTop: 12, color: "#7C6EF5", fontWeight: 600, fontSize: 14 }}>
            → Voir tous les espaces canins à Cannes
          </a>
        </div>
      )}

      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 8 }}>💡 Bon à savoir</p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{info.tips}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Autres secteurs de Cannes</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherSecteurs.map((s) => (
            <a key={s} href={`/parcs/cannes/${s}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
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
