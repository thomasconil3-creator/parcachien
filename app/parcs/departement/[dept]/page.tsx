import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import { cityToSlug } from "@/lib/utils";
import SeoFooter from "@/components/SeoFooter";

const DEPT_INFO: Record<string, {
  slug: string;
  name: string;
  fullName: string;
  number: string;
  mainCities: string[];
  description: string;
  keywords: string[];
}> = {
  "bouches-du-rhone": {
    slug: "bouches-du-rhone",
    name: "Bouches-du-Rhône",
    fullName: "Bouches-du-Rhône (13)",
    number: "13",
    mainCities: ["Marseille", "Aix-en-Provence", "Martigues", "Arles", "Aubagne", "La Ciotat", "Miramas", "Tarascon"],
    description: "Le département des Bouches-du-Rhône concentre la majorité des espaces canins de la région PACA. Marseille seule en compte plus de 28. De la Camargue aux calanques en passant par la Sainte-Victoire, les propriétaires de chiens ont l'embarras du choix.",
    keywords: ["parc à chien Bouches-du-Rhône", "espace canin 13", "parc chien 13000", "jardin canin Bouches-du-Rhône", "aire canine 13", "espace canin PACA", "sortir son chien Bouches-du-Rhône"],
  },
  "var": {
    slug: "var",
    name: "Var",
    fullName: "Var (83)",
    number: "83",
    mainCities: ["Toulon", "Fréjus", "Saint-Raphaël", "Bandol", "La Valette-du-Var", "Le Pradet", "Draguignan", "Sainte-Maxime", "Le Lavandou", "Ramatuelle"],
    description: "Le Var offre un cadre idéal pour les propriétaires de chiens entre mer et arrière-pays provençal. Toulon dispose de plusieurs espaces canins majeurs dont le Parc des Lices (90 000 m² d'agility). La côte varoise et le massif des Maures complètent l'offre.",
    keywords: ["parc à chien Var", "espace canin 83", "parc chien Toulon", "jardin canin Var", "aire canine Var", "espace canin Toulon", "parc chien Fréjus", "caniparc Var"],
  },
  "alpes-maritimes": {
    slug: "alpes-maritimes",
    name: "Alpes-Maritimes",
    fullName: "Alpes-Maritimes (06)",
    number: "06",
    mainCities: ["Nice", "Cannes", "Antibes", "Cagnes-sur-Mer", "Le Cannet", "Valbonne", "Villeneuve-Loubet", "Isola"],
    description: "Les Alpes-Maritimes proposent des espaces canins sur la Côte d'Azur et en montagne. Nice dispose de nombreux jardins canins répartis dans ses quartiers. Cannes a inauguré l'Espace du Lys en 2024. L'arrière-pays niçois offre des randonnées exceptionnelles avec votre chien.",
    keywords: ["parc à chien Alpes-Maritimes", "espace canin 06", "parc chien Nice", "jardin canin Côte d'Azur", "aire canine Nice", "parc chien Cannes", "espace canin Antibes", "caniparc Alpes-Maritimes"],
  },
  "vaucluse": {
    slug: "vaucluse",
    name: "Vaucluse",
    fullName: "Vaucluse (84)",
    number: "84",
    mainCities: ["Avignon", "Orange", "Mazan", "Pernes-les-Fontaines", "Saint-Saturnin-lès-Avignon", "Châteauneuf-de-Gadagne"],
    description: "Le Vaucluse, terre de lavande et de vignobles, offre des espaces canins dans ses principales villes. Avignon dispose notamment du Parc Chico Mendes (2000 m²). La campagne vauclusienne et le Mont Ventoux offrent des balades exceptionnelles.",
    keywords: ["parc à chien Vaucluse", "espace canin 84", "parc chien Avignon", "jardin canin Vaucluse", "aire canine 84", "espace canin Avignon", "caniparc Vaucluse"],
  },
  "alpes-de-haute-provence": {
    slug: "alpes-de-haute-provence",
    name: "Alpes-de-Haute-Provence",
    fullName: "Alpes-de-Haute-Provence (04)",
    number: "04",
    mainCities: ["Digne-les-Bains", "Manosque", "Sisteron", "Forcalquier", "La Brillanne", "Cadenet", "Seyne-les-Alpes", "Volx"],
    description: "Les Alpes-de-Haute-Provence offrent un cadre naturel exceptionnel pour les propriétaires de chiens. Entre Verdon, lavande et sommets alpins, les balades sont infinies. Les espaces canins y sont moins nombreux mais la nature compense largement.",
    keywords: ["parc à chien Alpes-de-Haute-Provence", "espace canin 04", "parc chien Manosque", "jardin canin Haute-Provence", "sortir son chien Alpes Haute-Provence", "balades chien Verdon"],
  },
  "hautes-alpes": {
    slug: "hautes-alpes",
    name: "Hautes-Alpes",
    fullName: "Hautes-Alpes (05)",
    number: "05",
    mainCities: ["Gap", "Briançon", "Embrun"],
    description: "Les Hautes-Alpes, avec leurs stations de ski et leurs vallées alpines, offrent un territoire unique pour les propriétaires de chiens en PACA. Les espaces canins officiels sont rares mais les espaces naturels compensent par leur beauté.",
    keywords: ["parc à chien Hautes-Alpes", "espace canin 05", "parc chien Gap", "sortir son chien Hautes-Alpes", "balades chien montagne PACA"],
  },
};

const ALL_DEPTS = Object.keys(DEPT_INFO);

export async function generateStaticParams() {
  return ALL_DEPTS.map((dept) => ({ dept }));
}

export async function generateMetadata({ params }: { params: Promise<{ dept: string }> }): Promise<Metadata> {
  const { dept } = await params;
  const info = DEPT_INFO[dept];
  if (!info) return { title: "Département introuvable — ParcAChien" };

  const title = `Parcs à chiens en ${info.name} — Espaces canins ${info.fullName} | ParcAChien`;
  const description = `Tous les espaces canins du département ${info.name} (${info.number}) : ${info.mainCities.slice(0, 4).join(", ")}... Carte interactive, check-in live et communauté. ${info.description.slice(0, 100)}`;

  return {
    title,
    description,
    keywords: info.keywords,
    alternates: { canonical: `https://www.parcachien.com/parcs/departement/${dept}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/parcs/departement/${dept}`,
    },
  };
}

export default async function DeptPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = await params;
  const info = DEPT_INFO[dept];
  if (!info) notFound();

  const parks = PACA_PARKS.filter((p) => p.department === info.number);
  const cities = [...new Set(parks.map((p) => p.city))].sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/departement/${dept}`,
        "url": `https://www.parcachien.com/parcs/departement/${dept}`,
        "name": `Parcs à chiens en ${info.name}`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": `${info.name}`, "item": `https://www.parcachien.com/parcs/departement/${dept}` },
        ],
      },
      {
        "@type": "ItemList",
        "name": `Villes avec espaces canins en ${info.name}`,
        "numberOfItems": cities.length,
        "itemListElement": cities.map((city, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": `Parcs à chiens à ${city}`,
          "url": `https://www.parcachien.com/parcs/${cityToSlug(city)}`,
        })),
      },
    ],
  };

  const otherDepts = ALL_DEPTS.filter((d) => d !== dept);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>
        {" › "}
        <a href="/parcs" style={{ color: "#7C6EF5", textDecoration: "none" }}>Parcs</a>
        {" › "}
        {info.name}
      </nav>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parcs à chiens en {info.name}
      </h1>
      <p style={{ fontSize: 13, color: "#7C6EF5", fontWeight: 600, marginBottom: 16 }}>
        Département {info.number} · {parks.length} espaces canins · {cities.length} villes
      </p>
      <p style={{ color: "#555", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
        {info.description}
      </p>

      {/* Cities grid */}
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 20 }}>
        Espaces canins par ville
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 48 }}>
        {cities.map((city) => {
          const cityParks = parks.filter((p) => p.city === city);
          return (
            <a
              key={city}
              href={`/parcs/${cityToSlug(city)}`}
              style={{
                display: "block",
                background: "#fff",
                border: "1px solid #e8e4f0",
                borderRadius: 12,
                padding: "16px 20px",
                textDecoration: "none",
                color: "#1a1a2e",
                boxShadow: "0 2px 6px rgba(124,110,245,0.06)",
              }}
            >
              <strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                🐾 Parcs à chiens à {city}
              </strong>
              <span style={{ fontSize: 12, color: "#7C6EF5", fontWeight: 600 }}>
                {cityParks.length} espace{cityParks.length > 1 ? "s" : ""} canin{cityParks.length > 1 ? "s" : ""}
              </span>
              {cityParks.filter((p) => p.fenced).length > 0 && (
                <span style={{ display: "block", fontSize: 11, color: "#2e7d32", marginTop: 4 }}>
                  ✓ {cityParks.filter((p) => p.fenced).length} clôturé{cityParks.filter((p) => p.fenced).length > 1 ? "s" : ""}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* Top parks */}
      {parks.filter((p) => p.rating && p.rating >= 4).length > 0 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>
            ⭐ Les mieux notés en {info.name}
          </h2>
          <div style={{ display: "grid", gap: 12, marginBottom: 48 }}>
            {parks.filter((p) => p.rating && p.rating >= 4).map((park) => (
              <div key={park.id} style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 14, padding: "18px 22px", boxShadow: "0 2px 8px rgba(124,110,245,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{park.name}</h3>
                    <p style={{ fontSize: 13, color: "#777" }}>📍 {park.city}{park.address ? ` — ${park.address}` : ""}</p>
                  </div>
                  <span style={{ background: "#fff8e1", color: "#f57f17", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, alignSelf: "flex-start" }}>
                    ★ {park.rating}/5
                  </span>
                </div>
                {park.size && <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>📐 {park.size}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Other departments */}
      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          Autres départements PACA
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherDepts.map((d) => (
            <a key={d} href={`/parcs/departement/${d}`} style={{ display: "inline-block", background: "#fff", border: "1px solid #e0d9ff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#7C6EF5", textDecoration: "none" }}>
              {DEPT_INFO[d].name}
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
