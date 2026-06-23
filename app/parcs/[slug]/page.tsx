import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACA_PARKS } from "@/lib/parks-data";
import { cityToSlug } from "@/lib/utils";
import SeoFooter from "@/components/SeoFooter";

const CITY_META: Record<string, { title: string; description: string; dept: string }> = {
  marseille: {
    title: "Parcs à chiens à Marseille — ParcAChien",
    description: "Découvrez tous les espaces canins à Marseille : Longchamp, Belle de Mai, Lodi, Saint-Barnabé... Carte interactive, check-in live et avis de la communauté.",
    dept: "13",
  },
  nice: {
    title: "Parcs à chiens à Nice — ParcAChien",
    description: "Trouvez les meilleurs espaces canins à Nice : Parc Carol de Roumanie, Valrose, Batterie Russe... Carte interactive et communauté de propriétaires.",
    dept: "06",
  },
  toulon: {
    title: "Parcs à chiens à Toulon — ParcAChien",
    description: "Espaces canins à Toulon : Parc Raoulx, Parc des Lices, Pont du Las... Informations, horaires et check-in live sur ParcAChien.",
    dept: "83",
  },
  "aix-en-provence": {
    title: "Parcs à chiens à Aix-en-Provence — ParcAChien",
    description: "Caniparcs à Aix-en-Provence : espace Gauffredy et plus. 2 zones petits/grands chiens, fontaine, bacs à sable. Carte et check-in live.",
    dept: "13",
  },
  avignon: {
    title: "Parcs à chiens à Avignon — ParcAChien",
    description: "Caniparcs à Avignon : Chico Mendes (2000m²), Champfleury, Campo Bello... Carte des espaces canins en Vaucluse avec check-in live.",
    dept: "84",
  },
  cannes: {
    title: "Parcs à chiens à Cannes — ParcAChien",
    description: "Espace canin du Lys à Cannes (400m², agility, fontaine canine) et plus. Inauguré décembre 2024. Carte et avis sur ParcAChien.",
    dept: "06",
  },
  martigues: {
    title: "Parcs à chiens à Martigues — ParcAChien",
    description: "Espaces canins à Martigues : Canto Perdrix, Saint-Julien, Colonel Fabien. Carte interactive et communauté ParcAChien.",
    dept: "13",
  },
  "cagnes-sur-mer": {
    title: "Parcs à chiens à Cagnes-sur-Mer — ParcAChien",
    description: "Jardins canins à Cagnes-sur-Mer : Lucayas, Allée des Saules, Cagnes Plage. Trouvez votre espace canin sur ParcAChien.",
    dept: "06",
  },
};

export async function generateStaticParams() {
  const cities = [...new Set(PACA_PARKS.map((p) => cityToSlug(p.city)))];
  return cities.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CITY_META[slug];
  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `https://www.parcachien.com/parcs/${slug}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        siteName: "ParcAChien",
        locale: "fr_FR",
        type: "website",
        url: `https://www.parcachien.com/parcs/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.description,
      },
    };
  }
  const city = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `Parcs à chiens à ${city} — ParcAChien`,
    description: `Trouvez tous les espaces canins à ${city} en région PACA. Carte interactive, check-in live et communauté sur ParcAChien.`,
    alternates: { canonical: `https://www.parcachien.com/parcs/${slug}` },
    openGraph: {
      title: `Parcs à chiens à ${city} — ParcAChien`,
      description: `Tous les parcs à chiens à ${city} — ParcAChien`,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function ParcsCityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parks = PACA_PARKS.filter((p) => cityToSlug(p.city) === slug);

  if (parks.length === 0) notFound();

  const cityName = parks[0].city;
  const fencedCount = parks.filter((p) => p.fenced).length;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.parcachien.com/parcs/${slug}`,
        "url": `https://www.parcachien.com/parcs/${slug}`,
        "name": `Parcs à chiens à ${cityName} — ParcAChien`,
        "description": `${parks.length} espaces canins recensés à ${cityName} en PACA. Carte interactive, check-in live.`,
        "inLanguage": "fr-FR",
        "isPartOf": { "@id": "https://www.parcachien.com" },
      },
      {
        "@type": "ItemList",
        "name": `Espaces canins à ${cityName}`,
        "numberOfItems": parks.length,
        "itemListElement": parks.map((park, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Park",
            "name": park.name,
            "address": park.address
              ? {
                  "@type": "PostalAddress",
                  "streetAddress": park.address,
                  "addressLocality": park.city,
                  "addressCountry": "FR",
                }
              : undefined,
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": park.lat,
              "longitude": park.lng,
            },
            ...(park.fenced ? { "amenityFeature": [{ "@type": "LocationFeatureSpecification", "name": "Clôturé", "value": true }] } : {}),
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ParcAChien", "item": "https://www.parcachien.com" },
          { "@type": "ListItem", "position": 2, "name": "Parcs", "item": "https://www.parcachien.com/parcs" },
          { "@type": "ListItem", "position": 3, "name": `Parcs à chiens à ${cityName}`, "item": `https://www.parcachien.com/parcs/${slug}` },
        ],
      },
    ],
  };

  // Arrondissement links for Marseille
  const MARSEILLE_ARRONDISSEMENTS = [
    { code: "13001", label: "1er — Vieux-Port" },
    { code: "13002", label: "2ème — Joliette" },
    { code: "13003", label: "3ème — Belle de Mai" },
    { code: "13004", label: "4ème — Cinq-Avenues" },
    { code: "13005", label: "5ème — Baille" },
    { code: "13006", label: "6ème — Vauban" },
    { code: "13007", label: "7ème — Roucas-Blanc" },
    { code: "13008", label: "8ème — Périer" },
    { code: "13009", label: "9ème — Mazargues" },
    { code: "13010", label: "10ème — La Capelette" },
    { code: "13011", label: "11ème — La Valbarelle" },
    { code: "13012", label: "12ème — Saint-Barnabé" },
    { code: "13013", label: "13ème — Les Olives" },
    { code: "13014", label: "14ème — Les Crottes" },
    { code: "13015", label: "15ème — Saint-Lazare" },
    { code: "13016", label: "16ème — L'Estaque" },
  ];

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
        {cityName}
      </nav>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parcs à chiens à {cityName}
      </h1>
      <p style={{ color: "#555", fontSize: 16, marginBottom: 32 }}>
        {parks.length} espace{parks.length > 1 ? "s" : ""} canin{parks.length > 1 ? "s" : ""} recensé{parks.length > 1 ? "s" : ""} —
        dont {fencedCount} clôturé{fencedCount > 1 ? "s" : ""}. Données vérifiées, mises à jour régulièrement.
      </p>

      {/* Marseille arrondissement nav */}
      {slug === "marseille" && (
        <div style={{ background: "#f0eeff", borderRadius: 16, padding: "20px 24px", marginBottom: 40 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#7C6EF5", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
            🏙️ Chercher par arrondissement à Marseille
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MARSEILLE_ARRONDISSEMENTS.map(({ code, label }) => (
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
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
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
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                  {park.name}
                </h2>
                {park.address && (
                  <p style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>📍 {park.address}</p>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {park.fenced && (
                  <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                    ✓ Clôturé
                  </span>
                )}
                {park.rating && (
                  <span style={{ background: "#fff8e1", color: "#f57f17", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                    ★ {park.rating}/5
                  </span>
                )}
              </div>
            </div>

            {park.opening_hours && (
              <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>🕐 {park.opening_hours}</p>
            )}
            {park.size && (
              <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>📐 {park.size}</p>
            )}
            {park.features && park.features.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {park.features.map((f, i) => (
                  <span key={i} style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
            {park.warning && (
              <p style={{ background: "#fff3e0", border: "1px solid #ffcc02", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#e65100", marginTop: 10 }}>
                {park.warning}
              </p>
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

      {/* FAQ block for SEO */}
      <div style={{ marginTop: 48, background: "#fafafa", borderRadius: 16, padding: "32px 28px", border: "1px solid #f0eeff" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Questions fréquentes</h2>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
            Combien y a-t-il d'espaces canins à {cityName} ?
          </h3>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
            ParcAChien recense <strong>{parks.length} espaces canins</strong> à {cityName}, dont {fencedCount} clôturé{fencedCount > 1 ? "s" : ""}. Ces données sont issues d'OpenStreetMap et de sources officielles, mises à jour régulièrement.
          </p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
            Comment trouver un parc à chien près de chez moi à {cityName} ?
          </h3>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
            Utilisez la <a href="/" style={{ color: "#7C6EF5" }}>carte interactive ParcAChien</a> et activez la géolocalisation pour voir les espaces canins les plus proches de votre position. Vous pouvez également filtrer par arrondissement ou quartier.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
            Peut-on laisser son chien sans laisse à {cityName} ?
          </h3>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
            Oui, dans les espaces canins clôturés, votre chien peut évoluer librement sans laisse. Les espaces marqués "sans laisse" sur ParcAChien sont des zones dédiées et sécurisées.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 48, textAlign: "center" }}>
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
