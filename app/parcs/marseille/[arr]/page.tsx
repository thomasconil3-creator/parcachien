import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import SeoFooter from "@/components/SeoFooter";

// ── Mapping arrondissement → IDs de parcs ─────────────────────────────────────

const ARR_PARK_IDS: Record<string, string[]> = {
  "13001": [],
  "13002": [],
  "13003": ["13-001"],                        // Belle de Mai
  "13004": ["13-007", "13-008", "13-028"],   // Cinq-Avenues, La Blancarde, Parc Saucisse (Longchamp)
  "13005": ["13-002"],                        // Baille
  "13006": ["13-006", "13-026"],             // Lodi, Pythagore (Vauban)
  "13007": ["13-020"],                        // Roucas-Blanc
  "13008": ["13-012"],                        // Mazargues
  "13009": ["13-011", "13-024", "13-025"],   // Le Cabot, Sainte-Marguerite, Jardins Aiguier
  "13010": ["13-005", "13-010", "13-022", "13-023"], // La Capelette, Saint-Tronc, Delessert, Icard
  "13011": ["13-004"],                        // La Valbarelle
  "13012": ["13-003"],                        // Saint-Barnabé
  "13013": ["13-009"],                        // Saint-Barthélemy
  "13014": [],
  "13015": [],
  "13016": [],
};

// ── Infos par arrondissement ──────────────────────────────────────────────────

const ARR_INFO: Record<string, {
  ordinal: string;
  name: string;
  neighborhoods: string;
  description: string;
  tips: string;
}> = {
  "13001": {
    ordinal: "1er",
    name: "1er arrondissement",
    neighborhoods: "Vieux-Port, Noailles, Belsunce, Centre-Ville",
    description: "Le 1er arrondissement est le cœur historique de Marseille. Dense et urbain, il ne possède pas encore d'espace canin officiel. Les propriétaires de chiens du centre se rendent souvent au 4ème (Longchamp) ou au 6ème (Lodi).",
    tips: "Les espaces canins les plus proches sont le Parc Saucisse (Longchamp, 13004) et l'Espace Lodi (13006), à moins de 20 minutes à pied.",
  },
  "13002": {
    ordinal: "2ème",
    name: "2ème arrondissement",
    neighborhoods: "La Joliette, Saint-Charles, Arenc",
    description: "Le 2ème arrondissement abrite le quartier en pleine mutation d'Arenc et le port de La Joliette. Pas encore d'espace canin officiel, mais le quartier bénéficie de sa proximité avec le 3ème (Belle de Mai).",
    tips: "L'Espace canin Belle de Mai (13003) est accessible depuis le 2ème en quelques minutes.",
  },
  "13003": {
    ordinal: "3ème",
    name: "3ème arrondissement",
    neighborhoods: "Belle de Mai, Saint-Mauront, Château-Gombert (partie)",
    description: "Le 3ème arrondissement dispose de l'Espace canin Belle de Mai, clôturé et bien entretenu. Idéal pour les propriétaires du quartier culturel et créatif de la Belle de Mai.",
    tips: "L'espace est clôturé, parfait pour laisser votre chien courir librement. Accessible depuis le métro Belle de Mai.",
  },
  "13004": {
    ordinal: "4ème",
    name: "4ème arrondissement",
    neighborhoods: "Cinq-Avenues, Longchamp, La Blancarde, Saint-Barnabé (partie)",
    description: "Le 4ème est l'un des arrondissements les mieux dotés en espaces canins de Marseille. Il abrite le célèbre Parc Saucisse dans l'enceinte du Palais Longchamp — le plus grand espace canin du centre-ville avec 6 000 m², clôturé et sans laisse obligatoire.",
    tips: "Le Parc Saucisse (Longchamp) est le must des propriétaires du 4ème. L'Espace Cinq-Avenues et La Blancarde complètent l'offre du quartier.",
  },
  "13005": {
    ordinal: "5ème",
    name: "5ème arrondissement",
    neighborhoods: "Baille, Vieux-Marseille, Capucins, Saint-Pierre",
    description: "Le 5ème arrondissement dispose de l'Espace canin Baille, clôturé et situé rue Saint-Pierre. Très pratique pour les habitants du secteur Baille, à deux pas des grandes artères commerçantes.",
    tips: "L'Espace Baille est clôturé. Si vous cherchez un espace plus grand, le Parc Saucisse (13004) est accessible à pied en 15 minutes.",
  },
  "13006": {
    ordinal: "6ème",
    name: "6ème arrondissement",
    neighborhoods: "Vauban, Notre-Dame du Mont, Castellane, Cours Julien",
    description: "Le 6ème arrondissement est l'un des plus animés de Marseille. Il dispose de l'Espace canin Lodi (Boulevard Delpuech, zone sans laisse) et du Parc Pythagore (rue Pythagore, Vauban). Ces deux espaces sont très fréquentés le matin et en fin de journée.",
    tips: "L'Espace Lodi est l'un des rares espaces 'sans laisse' en centre-ville. Ambiance très conviviale entre propriétaires du 6ème.",
  },
  "13007": {
    ordinal: "7ème",
    name: "7ème arrondissement",
    neighborhoods: "Roucas-Blanc, Catalans, Endoume, Vallon des Auffes",
    description: "Le 7ème arrondissement, quartier résidentiel au bord de la mer, dispose de l'Espace canin Roucas-Blanc (Rue du Bois Sacré). Cadre magnifique, proche du littoral et des calanques, idéal pour une sortie en nature.",
    tips: "Roucas-Blanc offre un cadre naturel exceptionnel. Les sentiers côtiers à proximité permettent également de belles balades.",
  },
  "13008": {
    ordinal: "8ème",
    name: "8ème arrondissement",
    neighborhoods: "Périer, Sainte-Anne, Bonneveine, Redon, Vieille Chapelle, Pointe-Rouge",
    description: "Le 8ème arrondissement est l'un des quartiers les plus prisés de Marseille, avec une forte densité de propriétaires de chiens. L'Espace canin Mazargues dessert cette zone. Pour le secteur Pointe-Rouge, les propriétaires ont accès aux espaces canins du 9ème.",
    tips: "En attendant un futur espace canin sur la rive sud, l'Espace canin Mazargues est le plus proche du 8ème. La plage de la Pointe-Rouge permet aussi les balades.",
  },
  "13009": {
    ordinal: "9ème",
    name: "9ème arrondissement",
    neighborhoods: "Mazargues, Sainte-Marguerite, Les Baumettes, La Cayolle, Les Goudes",
    description: "Le 9ème est le plus grand arrondissement de Marseille en superficie. Il dispose de plusieurs espaces canins : Le Cabot, Sainte-Marguerite (Ave de la Magalone) et les Jardins Aiguier (Boulevard Urbain Sud). Idéal pour les propriétaires du secteur.",
    tips: "Le 9ème offre également l'accès aux calanques, un paradis pour les chiens qui adorent la nature et les baignades.",
  },
  "13010": {
    ordinal: "10ème",
    name: "10ème arrondissement",
    neighborhoods: "La Capelette, Saint-Loup, Hauts de Mazargues, La Fourragère",
    description: "Le 10ème arrondissement est bien desservi avec l'Espace canin La Capelette (clôturé), l'Espace Saint-Tronc, l'Espace Benjamin Delessert et l'Espace Icard. Un des arrondissements avec la plus forte densité d'espaces canins au m² à Marseille.",
    tips: "L'Espace La Capelette est le plus populaire du 10ème. Clôturé, bien entretenu, parfait pour les chiens de toutes tailles.",
  },
  "13011": {
    ordinal: "11ème",
    name: "11ème arrondissement",
    neighborhoods: "La Valbarelle, Saint-Marcel, La Penne-sur-Huveaune (limite)",
    description: "Le 11ème arrondissement, en périphérie est de Marseille, dispose de l'Espace canin La Valbarelle (Avenue Noël Coll). Quartier calme avec de belles promenades en nature possibles à proximité.",
    tips: "La Valbarelle est un espace spacieux adapté aux grandes races. Les espaces naturels autour du Parc de la Pinède de Montolivet complètent l'offre.",
  },
  "13012": {
    ordinal: "12ème",
    name: "12ème arrondissement",
    neighborhoods: "Saint-Barnabé, La Rosière, Saint-Tronc (partie)",
    description: "Le 12ème arrondissement dispose de l'Espace canin Saint-Barnabé (Avenue d'Haïti). Quartier résidentiel calme, avec de bonnes connexions au centre-ville. L'espace est spacieux et bien apprécié des familles.",
    tips: "L'Espace Saint-Barnabé est ouvert et adapté aux chiens qui aiment les grands espaces. Le quartier est calme, agréable pour les balades.",
  },
  "13013": {
    ordinal: "13ème",
    name: "13ème arrondissement",
    neighborhoods: "Les Olives, Saint-Barthélemy, Plan d'Aou, Air Bel",
    description: "Le 13ème arrondissement dispose de l'Espace canin Saint-Barthélemy (Avenue Raimu). Quartier populaire au nord de Marseille, avec des espaces verts accessibles pour les propriétaires de chiens.",
    tips: "L'Espace Saint-Barthélemy est le point de rendez-vous des propriétaires du 13ème et des arrondissements nord.",
  },
  "13014": {
    ordinal: "14ème",
    name: "14ème arrondissement",
    neighborhoods: "Les Crottes, Verduron, Savine, Consolat",
    description: "Le 14ème arrondissement ne dispose pas encore d'espace canin officiel répertorié. Les propriétaires de chiens se rendent généralement au 13ème (Saint-Barthélemy) ou au 15ème (La Rose).",
    tips: "La proximité avec les espaces naturels du nord de Marseille permet de belles balades avec votre chien.",
  },
  "13015": {
    ordinal: "15ème",
    name: "15ème arrondissement",
    neighborhoods: "Les Arnavaux, Saint-Lazare, La Viste, Frais-Vallon",
    description: "Le 15ème arrondissement bénéficie d'espaces naturels importants dans le nord de Marseille. Pas encore d'espace canin officiel répertorié dans cet arrondissement.",
    tips: "Les espaces naturels du massif de l'Étoile, accessibles depuis le 15ème, sont parfaits pour les balades avec votre chien.",
  },
  "13016": {
    ordinal: "16ème",
    name: "16ème arrondissement",
    neighborhoods: "L'Estaque, Saint-Henri, La Madrague, Niolon",
    description: "Le 16ème arrondissement, au bord de la mer entre Marseille et Martigues, offre des accès aux calanques du nord et aux plages pour les balades. Pas encore d'espace canin officiel répertorié.",
    tips: "Les criques et chemins côtiers de L'Estaque et Niolon sont accessibles aux chiens en dehors des périodes de baignade. Un cadre naturel exceptionnel.",
  },
};

const ALL_CODES = Object.keys(ARR_INFO);

export async function generateStaticParams() {
  return ALL_CODES.map((arr) => ({ arr }));
}

export async function generateMetadata({ params }: { params: Promise<{ arr: string }> }): Promise<Metadata> {
  const { arr } = await params;
  const info = ARR_INFO[arr];
  if (!info) return { title: "Arrondissement introuvable — ParcAChien" };

  const parks = PACA_PARKS.filter((p) => ARR_PARK_IDS[arr]?.includes(p.id));
  const hasParks = parks.length > 0;

  const title = `Parc à chien ${arr} Marseille — ${info.ordinal} arrondissement | ParcAChien`;
  const description = hasParks
    ? `${parks.length} espace${parks.length > 1 ? "s" : ""} canin${parks.length > 1 ? "s" : ""} dans le ${info.ordinal} arrondissement de Marseille (${arr}). ${info.neighborhoods}. Carte, horaires et check-in live.`
    : `Espaces canins proches du ${info.ordinal} arrondissement de Marseille (${arr}). ${info.neighborhoods}. Trouvez le parc à chien le plus proche sur ParcAChien.`;

  return {
    title,
    description,
    keywords: [
      `parc à chien ${arr}`,
      `espace canin ${arr}`,
      `parc chien marseille ${info.ordinal} arrondissement`,
      `jardin canin ${arr}`,
      `parc à chien marseille ${arr.replace("130", "")}`,
      `espace canin marseille ${info.ordinal}`,
      `${info.neighborhoods.split(", ")[0]} parc chien`,
      "parc à chien proche de moi marseille",
      "espace canin PACA",
    ],
    alternates: { canonical: `https://www.parcachien.com/parcs/marseille/${arr}` },
    openGraph: {
      title,
      description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/parcs/marseille/${arr}`,
    },
  };
}

export default async function MarseillArrPage({ params }: { params: Promise<{ arr: string }> }) {
  const { arr } = await params;
  const info = ARR_INFO[arr];
  if (!info) notFound();

  const parks = PACA_PARKS.filter((p) => ARR_PARK_IDS[arr]?.includes(p.id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/marseille/${arr}`,
        "url": `https://www.parcachien.com/parcs/marseille/${arr}`,
        "name": `Parc à chien ${arr} Marseille — ${info.ordinal} arrondissement`,
        "description": info.description,
        "inLanguage": "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": "Parcs à chiens à Marseille", "item": "https://www.parcachien.com/parcs/marseille" },
          { "@type": "ListItem", "position": 4, "name": `${info.ordinal} arrondissement (${arr})`, "item": `https://www.parcachien.com/parcs/marseille/${arr}` },
        ],
      },
      ...(parks.length > 0 ? [{
        "@type": "ItemList",
        "name": `Espaces canins — Marseille ${info.ordinal} (${arr})`,
        "numberOfItems": parks.length,
        "itemListElement": parks.map((park, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Park",
            "name": park.name,
            "address": park.address ? {
              "@type": "PostalAddress",
              "streetAddress": park.address,
              "addressLocality": "Marseille",
              "postalCode": arr,
              "addressCountry": "FR",
            } : undefined,
            "geo": { "@type": "GeoCoordinates", "latitude": park.lat, "longitude": park.lng },
          },
        })),
      }] : []),
    ],
  };

  const otherCodes = ALL_CODES.filter((c) => c !== arr);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>
        {" › "}
        <a href="/parcs" style={{ color: "#7C6EF5", textDecoration: "none" }}>Parcs</a>
        {" › "}
        <a href="/parcs/marseille" style={{ color: "#7C6EF5", textDecoration: "none" }}>Marseille</a>
        {" › "}
        {info.ordinal} ({arr})
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parc à chien {arr} — {info.name}
      </h1>
      <p style={{ fontSize: 14, color: "#7C6EF5", fontWeight: 600, marginBottom: 12 }}>
        {info.neighborhoods}
      </p>
      <p style={{ color: "#555", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        {info.description}
      </p>

      {parks.length > 0 ? (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>
            {parks.length} espace{parks.length > 1 ? "s" : ""} canin{parks.length > 1 ? "s" : ""} dans le {info.ordinal}
          </h2>
          <div style={{ display: "grid", gap: 16, marginBottom: 40 }}>
            {parks.map((park) => (
              <div
                key={park.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8e4f0",
                  borderRadius: 14,
                  padding: "20px 24px",
                  boxShadow: "0 2px 8px rgba(124,110,245,0.06)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                      {park.name}
                    </h3>
                    {park.address && (
                      <p style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>📍 {park.address}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {park.fenced && (
                      <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Clôturé</span>
                    )}
                    {park.rating && (
                      <span style={{ background: "#fff8e1", color: "#f57f17", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>★ {park.rating}/5</span>
                    )}
                  </div>
                </div>
                {park.opening_hours && <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>🕐 {park.opening_hours}</p>}
                {park.size && <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>📐 {park.size}</p>}
                {park.features && park.features.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {park.features.map((f, i) => (
                      <span key={i} style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{f}</span>
                    ))}
                  </div>
                )}
                {park.reviews && park.reviews.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: "1px solid #f0eeff", paddingTop: 12 }}>
                    {park.reviews.slice(0, 2).map((r, i) => (
                      <p key={i} style={{ fontSize: 13, color: "#555", fontStyle: "italic", marginBottom: 4 }}>"{r}"</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: "#e65100", fontWeight: 600, marginBottom: 8 }}>
            ℹ️ Pas encore d'espace canin officiel dans le {info.ordinal}
          </p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
            {info.tips}
          </p>
          <a href="/parcs/marseille" style={{ display: "inline-block", marginTop: 12, color: "#7C6EF5", fontWeight: 600, fontSize: 14 }}>
            → Voir tous les espaces canins à Marseille
          </a>
        </div>
      )}

      {/* Conseil SEO */}
      <div style={{ background: "#f0eeff", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 8 }}>
          💡 Bon à savoir
        </p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>
          {info.tips}
        </p>
      </div>

      {/* Navigation autres arrondissements */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>
          Autres arrondissements de Marseille
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherCodes.map((code) => (
            <a
              key={code}
              href={`/parcs/marseille/${code}`}
              style={{
                display: "inline-block",
                background: "#fff",
                border: "1px solid #e0d9ff",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "#7C6EF5",
                textDecoration: "none",
              }}
            >
              {ARR_INFO[code].ordinal} — {code}
            </a>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#7C6EF5",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          🗺️ Voir la carte interactive
        </a>
      </div>
      <SeoFooter />
    </main>
  );
}
