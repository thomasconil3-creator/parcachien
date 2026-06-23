import { Metadata } from "next";
import { PACA_PARKS } from "@/lib/parks-data";

export const metadata: Metadata = {
  title: "Tous les parcs à chiens en PACA — ParcAChien",
  description: "308+ parcs à chiens en région PACA : Marseille, Nice, Toulon, Aix-en-Provence, Avignon, Cannes... Carte interactive, check-in live et communauté de propriétaires.",
  openGraph: {
    title: "Tous les parcs à chiens en PACA — ParcAChien",
    description: "308+ parcs à chiens en région PACA. Carte interactive et check-in live.",
    siteName: "ParcAChien",
    locale: "fr_FR",
    type: "website",
  },
};

function cityToSlug(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const DEPT_NAMES: Record<string, string> = {
  "13": "Bouches-du-Rhône",
  "83": "Var",
  "06": "Alpes-Maritimes",
  "84": "Vaucluse",
  "04": "Alpes-de-Haute-Provence",
  "05": "Hautes-Alpes",
};

export default function ParcsIndexPage() {
  const byDept = PACA_PARKS.reduce<Record<string, { city: string; count: number }[]>>((acc, park) => {
    if (!acc[park.department]) acc[park.department] = [];
    const existing = acc[park.department].find((c) => c.city === park.city);
    if (existing) existing.count++;
    else acc[park.department].push({ city: park.city, count: 1 });
    return acc;
  }, {});

  const totalParks = PACA_PARKS.length;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>
        {" › "}
        Parcs
      </nav>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        🐾 Parcs à chiens en PACA
      </h1>
      <p style={{ color: "#555", fontSize: 16, marginBottom: 40 }}>
        {totalParks} espaces canins recensés dans 6 départements. Données issues d'OpenStreetMap et de sources officielles.
      </p>

      {Object.entries(byDept)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dept, cities]) => (
          <section key={dept} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#7C6EF5", marginBottom: 16, paddingBottom: 8, borderBottom: "2px solid #f0eeff" }}>
              {DEPT_NAMES[dept] || `Département ${dept}`}
              <span style={{ fontSize: 13, fontWeight: 500, color: "#aaa", marginLeft: 10 }}>
                ({cities.reduce((s, c) => s + c.count, 0)} parcs)
              </span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {cities
                .sort((a, b) => b.count - a.count)
                .map(({ city, count }) => (
                  <a
                    key={city}
                    href={`/parcs/${cityToSlug(city)}`}
                    style={{
                      display: "block",
                      background: "#fff",
                      border: "1px solid #e8e4f0",
                      borderRadius: 12,
                      padding: "14px 18px",
                      textDecoration: "none",
                      color: "#1a1a2e",
                      boxShadow: "0 2px 6px rgba(124,110,245,0.06)",
                      transition: "box-shadow 0.2s",
                    }}
                  >
                    <strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>{city}</strong>
                    <span style={{ fontSize: 12, color: "#7C6EF5", fontWeight: 600 }}>
                      {count} parc{count > 1 ? "s" : ""}
                    </span>
                  </a>
                ))}
            </div>
          </section>
        ))}

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
    </main>
  );
}
