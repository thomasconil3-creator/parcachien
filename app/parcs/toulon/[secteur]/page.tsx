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
  "centre": {
    name: "Centre-Ville / Haute-Ville",
    postalCode: "83000",
    neighborhoods: "Centre-Ville, Haute-Ville, Vieille Ville, Préfecture",
    description: "Le centre de Toulon, animé et commerçant, dispose d'espaces canins accessibles à pied. La Haute-Ville offre un cadre plus calme avec des jardins de proximité pour les propriétaires de chiens.",
    tips: "Le Parc Raoulx et le Parc des Lices sont accessibles en quelques minutes à pied depuis le centre-ville. Les places et jardins publics du centre permettent les balades en laisse.",
    parkBounds: { latMin: 43.105, latMax: 43.120, lngMin: 5.925, lngMax: 5.950 },
  },
  "pont-du-las": {
    name: "Pont du Las / La Loubière",
    postalCode: "83200",
    neighborhoods: "Pont du Las, La Loubière, Saint-Jean-du-Var, Siblas",
    description: "Le secteur Pont du Las est l'un des mieux dotés en espaces canins à Toulon. Il abrite l'Espace canin Pont du Las (Rue Curie) et l'Espace canin La Loubière (Boulevard de la Démocratie). Deux équipements complémentaires pour les propriétaires du nord-ouest toulonnais.",
    tips: "L'Espace Pont du Las et La Loubière sont tous deux accessibles depuis les quartiers résidentiels du nord de Toulon. Idéaux pour les sorties matinales et du soir.",
    parkBounds: { latMin: 43.125, latMax: 43.145, lngMin: 5.900, lngMax: 5.935 },
  },
  "mourillon": {
    name: "Le Mourillon",
    postalCode: "83000",
    neighborhoods: "Le Mourillon, Sainte-Anne, Tour Blanche",
    description: "Le Mourillon, quartier balnéaire de Toulon avec ses plages, est très apprécié des propriétaires de chiens. En dehors de la saison estivale, les plages du Mourillon sont accessibles aux chiens. Le quartier dispose également de jardins et d'espaces verts.",
    tips: "Les plages du Mourillon autorisent les chiens hors saison (octobre à mai). La Tour Royale et ses environs offrent de belles promenades avec vue sur la rade de Toulon.",
    parkBounds: { latMin: 43.100, latMax: 43.115, lngMin: 5.940, lngMax: 5.965 },
  },
  "parc-raoulx": {
    name: "Parc Raoulx / La Rode",
    postalCode: "83000",
    neighborhoods: "Parc Raoulx, La Rode, Brunet, Les Arènes",
    description: "Ce secteur abrite le Parc Raoulx, le plus grand parc canin de Toulon avec 11 000 m². Clôturé, il accueille chaque jour de nombreux propriétaires de chiens. L'Espace canin La Loubière (Boulevard de la Démocratie) complète l'offre du secteur.",
    tips: "Le Parc Raoulx (Impasse Docteur Henri Raoulx) est la référence des propriétaires toulonnais. 11 000 m² clôturés — le plus grand espace canin de la ville.",
    parkBounds: { latMin: 43.105, latMax: 43.120, lngMin: 5.938, lngMax: 5.960 },
  },
  "parc-lices": {
    name: "Parc des Lices / Le Bôme",
    postalCode: "83100",
    neighborhoods: "Parc des Lices, Le Bôme, La Poudrière, Saint-Antoine",
    description: "Le Parc des Lices à Toulon est un espace exceptionnel de 90 000 m² avec une zone canine agility de premier plan. C'est la base du club Canibest avec des éducateurs canins sur place. Idéal pour les chiens sportifs et leurs propriétaires.",
    tips: "Le Parc des Lices (Avenue de la Victoire) dispose d'équipements d'agility professionnels. Les éducateurs du club Canibest y proposent des cours réguliers.",
    parkBounds: { latMin: 43.110, latMax: 43.125, lngMin: 5.928, lngMax: 5.945 },
  },
  "la-valette": {
    name: "La Valette-du-Var",
    postalCode: "83160",
    neighborhoods: "La Valette-du-Var, Saint-Jean-du-Var, Claret",
    description: "La Valette-du-Var, commune de l'agglomération toulonnaise, dispose de l'Espace canin La Valette (Avenue François Duchatel). Quartier résidentiel calme, idéal pour les familles avec chiens.",
    tips: "L'Espace canin La Valette est accessible depuis Toulon en voiture en quelques minutes. Alternative moins fréquentée au Parc Raoulx.",
    parkBounds: { latMin: 43.130, latMax: 43.155, lngMin: 5.980, lngMax: 6.010 },
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

  const title = `Parc à chien Toulon — ${info.name} (${info.postalCode}) | ParcAChien`;
  const description = `Espaces canins à Toulon dans le secteur ${info.name} (${info.postalCode}). ${info.neighborhoods}. ${info.description.slice(0, 120)}`;

  return {
    title,
    description,
    keywords: [
      `parc à chien Toulon ${info.name}`,
      `espace canin Toulon ${info.name}`,
      `jardin canin Toulon`,
      `parc chien ${info.postalCode}`,
      `espace canin ${info.postalCode}`,
      `caniparc Toulon`,
      `sortir son chien Toulon`,
      `aire canine Toulon`,
      "parc à chien Toulon",
      "espace canin Var",
    ],
    alternates: { canonical: `https://www.parcachien.com/parcs/toulon/${secteur}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function ToulonSecteurPage({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur } = await params;
  const info = SECTEUR_INFO[secteur];
  if (!info) notFound();

  const allToulonParks = PACA_PARKS.filter((p) => p.city === "Toulon" || p.city === "La Valette-du-Var");
  const bounds = info.parkBounds;
  const sectorParks = allToulonParks.filter(
    (p) => p.lat >= bounds.latMin && p.lat <= bounds.latMax && p.lng >= bounds.lngMin && p.lng <= bounds.lngMax
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/toulon/${secteur}`,
        "url": `https://www.parcachien.com/parcs/toulon/${secteur}`,
        "name": `Parc à chien Toulon — ${info.name}`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": "Parcs à chiens à Toulon", "item": "https://www.parcachien.com/parcs/toulon" },
          { "@type": "ListItem", "position": 4, "name": info.name, "item": `https://www.parcachien.com/parcs/toulon/${secteur}` },
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
        <a href="/parcs/toulon" style={{ color: "#7C6EF5", textDecoration: "none" }}>Toulon</a>{" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parc à chien à Toulon — {info.name}
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
          <a href="/parcs/toulon" style={{ display: "inline-block", marginTop: 12, color: "#7C6EF5", fontWeight: 600, fontSize: 14 }}>
            → Voir tous les espaces canins à Toulon
          </a>
        </div>
      )}

      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 8 }}>💡 Bon à savoir</p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{info.tips}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Autres secteurs de Toulon</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherSecteurs.map((s) => (
            <a key={s} href={`/parcs/toulon/${s}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
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
