import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import SeoFooter from "@/components/SeoFooter";

const SECTEUR_INFO: Record<string, {
  name: string;
  postalCode: string;
  neighborhoods: string;
  description: string;
  tips: string;
  parkBounds: { latMin: number; latMax: number; lngMin: number; lngMax: number };
}> = {
  "centre-ville": {
    name: "Centre-Ville / Mazarin",
    postalCode: "13100",
    neighborhoods: "Centre Historique, Mazarin, Cardeurs, Cours Mirabeau",
    description: "Le cœur historique d'Aix-en-Provence, avec ses fontaines et ses hôtels particuliers. Le secteur est piétonnier mais bien desservi par des espaces canins de proximité. Le Parc Gauffredy à Celony est le plus proche du centre.",
    tips: "Le Parc Gauffredy (Rue Celony, secteur Saint-Eutrope) est LE rendez-vous des propriétaires du centre d'Aix. 900 m², clôturé, 2 zones petits/grands chiens.",
    parkBounds: { latMin: 43.520, latMax: 43.535, lngMin: 5.435, lngMax: 5.455 },
  },
  "celony": {
    name: "Celony / Saint-Eutrope",
    postalCode: "13100",
    neighborhoods: "Celony, Saint-Eutrope, La Torse, Les Infirmeries",
    description: "Le secteur Celony abrite le Parc canin Gauffredy, le principal espace canin d'Aix-en-Provence. Inauguré en septembre 2024, ce parc de 900 m² avec 2 zones petits/grands chiens, fontaine et bancs est devenu la référence pour les propriétaires aixois.",
    tips: "Parc Gauffredy, Rue Celony — 900 m², clôturé, 2 zones séparées, fontaine, sacs fournis. Noté 4.5/5 par la communauté ParcAChien. Accessible depuis le bus ligne 6.",
    parkBounds: { latMin: 43.525, latMax: 43.540, lngMin: 5.435, lngMax: 5.455 },
  },
  "jas-de-bouffan": {
    name: "Jas de Bouffan",
    postalCode: "13090",
    neighborhoods: "Jas de Bouffan, Les Platanes, Encagnane, Saint-Mitre",
    description: "Le Jas de Bouffan, ancien domaine de Cézanne, est un grand quartier résidentiel à l'ouest d'Aix. Avec ses espaces verts et sa proximité avec la campagne aixoise, c'est un secteur très agréable pour les propriétaires de chiens.",
    tips: "Les espaces naturels autour du Jas de Bouffan (vestiges du domaine Cézanne, routes de la campagne aixoise) permettent de belles balades. Les espaces canins du secteur sont accessibles facilement.",
    parkBounds: { latMin: 43.520, latMax: 43.540, lngMin: 5.410, lngMax: 5.435 },
  },
  "les-milles": {
    name: "Les Milles / La Duranne",
    postalCode: "13290",
    neighborhoods: "Les Milles, La Duranne, Rousset, Les Calanques d'Aix",
    description: "Les Milles et La Duranne forment une zone résidentielle moderne au sud d'Aix-en-Provence. En plein développement, ce secteur dispose de grands espaces naturels et de parcs récents pour les propriétaires de chiens.",
    tips: "La campagne provençale autour des Milles est parfaite pour les longues balades. Les chemin vicinaux permettent des promenades loin de la circulation.",
    parkBounds: { latMin: 43.480, latMax: 43.510, lngMin: 5.380, lngMax: 5.430 },
  },
  "puyricard": {
    name: "Puyricard / Luynes",
    postalCode: "13100",
    neighborhoods: "Puyricard, Luynes, Le Tholonet, Palette",
    description: "Au nord d'Aix, Puyricard et Luynes sont des communes résidentielles paisibles au pied de la Sainte-Victoire. La campagne environnante offre des balades exceptionnelles avec votre chien dans un cadre provençal authentique.",
    tips: "Le chemin des Lauves (célèbre atelier de Cézanne) et les sentiers autour de la Sainte-Victoire sont accessibles aux chiens en laisse. Paysages à couper le souffle.",
    parkBounds: { latMin: 43.545, latMax: 43.575, lngMin: 5.405, lngMax: 5.460 },
  },
  "nord": {
    name: "Nord Aix / Bouc-Bel-Air",
    postalCode: "13320",
    neighborhoods: "Bouc-Bel-Air, Gardanne, Gréasque (limite)",
    description: "Le secteur nord d'Aix-en-Provence, vers Bouc-Bel-Air et Gardanne, offre des espaces naturels généreux pour les propriétaires de chiens. L'Espace canin de Gréasque est référencé sur ParcAChien.",
    tips: "L'Espace canin de Gréasque (Rue des Jardins) est accessible depuis le secteur nord d'Aix. Les collines de l'Étoile et les espaces forestiers entre Aix et Gardanne sont idéaux pour les randonnées.",
    parkBounds: { latMin: 43.400, latMax: 43.470, lngMin: 5.490, lngMax: 5.560 },
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

  const title = `Parc à chien Aix-en-Provence ${info.name} (${info.postalCode}) | ParcAChien`;
  const description = `Espaces canins à Aix-en-Provence — ${info.name} (${info.postalCode}). ${info.neighborhoods}. ${info.description.slice(0, 120)}`;

  return {
    title,
    description,
    keywords: [
      `parc à chien Aix-en-Provence ${info.name}`,
      `espace canin Aix ${info.name}`,
      `jardin canin Aix-en-Provence`,
      `parc chien ${info.postalCode}`,
      `espace canin ${info.postalCode}`,
      `caniparc Aix`,
      `sortir son chien Aix-en-Provence`,
      `aire canine Aix ${info.name}`,
      "parc à chien Aix-en-Provence",
    ],
    alternates: { canonical: `https://www.parcachien.com/parcs/aix/${secteur}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function AixSecteurPage({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur } = await params;
  const info = SECTEUR_INFO[secteur];
  if (!info) notFound();

  const allAixParks = PACA_PARKS.filter((p) => p.city === "Aix-en-Provence" || p.city === "Gréasque");
  const bounds = info.parkBounds;
  const sectorParks = allAixParks.filter(
    (p) => p.lat >= bounds.latMin && p.lat <= bounds.latMax && p.lng >= bounds.lngMin && p.lng <= bounds.lngMax
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/aix/${secteur}`,
        "url": `https://www.parcachien.com/parcs/aix/${secteur}`,
        "name": `Parc à chien Aix-en-Provence — ${info.name}`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": "Parcs à chiens à Aix-en-Provence", "item": "https://www.parcachien.com/parcs/aix-en-provence" },
          { "@type": "ListItem", "position": 4, "name": info.name, "item": `https://www.parcachien.com/parcs/aix/${secteur}` },
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
        <a href="/parcs/aix-en-provence" style={{ color: "#7C6EF5", textDecoration: "none" }}>Aix-en-Provence</a>{" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parc à chien Aix-en-Provence — {info.name}
      </h1>
      <p style={{ fontSize: 14, color: "#7C6EF5", fontWeight: 600, marginBottom: 12 }}>
        {info.postalCode} · {info.neighborhoods}
      </p>
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
                  <div style={{ display: "flex", gap: 6 }}>
                    {park.fenced && <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Clôturé</span>}
                    {park.rating && <span style={{ background: "#fff8e1", color: "#f57f17", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>★ {park.rating}/5</span>}
                  </div>
                </div>
                {park.opening_hours && <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>🕐 {park.opening_hours}</p>}
                {park.size && <p style={{ fontSize: 13, color: "#555" }}>📐 {park.size}</p>}
                {park.features && park.features.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {park.features.map((f, i) => <span key={i} style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{f}</span>)}
                  </div>
                )}
                {park.reviews && park.reviews.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: "1px solid #f0eeff", paddingTop: 12 }}>
                    {park.reviews.slice(0, 2).map((r, i) => <p key={i} style={{ fontSize: 13, color: "#555", fontStyle: "italic", marginBottom: 4 }}>"{r}"</p>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
          <p style={{ fontSize: 14, color: "#e65100", fontWeight: 600, marginBottom: 8 }}>💡 Conseil</p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{info.tips}</p>
          <a href="/parcs/aix-en-provence" style={{ display: "inline-block", marginTop: 12, color: "#7C6EF5", fontWeight: 600, fontSize: 14 }}>
            → Voir tous les espaces canins à Aix-en-Provence
          </a>
        </div>
      )}

      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 8 }}>💡 Bon à savoir</p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{info.tips}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Autres secteurs d'Aix-en-Provence</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherSecteurs.map((s) => (
            <a key={s} href={`/parcs/aix/${s}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
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
