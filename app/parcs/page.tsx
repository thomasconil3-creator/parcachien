import { Metadata } from "next";
import { PACA_PARKS } from "@/lib/parks-data";
import SeoFooter from "@/components/SeoFooter";
import ParcsSearch from "@/components/ParcsSearch";
import ContentNav from "@/components/ContentNav";

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

  // Aplatir pour le composant de recherche
  const allCities = Object.entries(byDept).flatMap(([dept, cities]) =>
    cities.map(c => ({ ...c, dept, deptName: DEPT_NAMES[dept] || `Département ${dept}` }))
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--neutral-50)" }}>
      <ContentNav />
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <nav style={{ marginBottom: 24, fontSize: 13, color: "var(--neutral-500)" }}>
          <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>
          {" › "}
          Parcs
        </nav>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--neutral-800)", marginBottom: 8 }}>
          🐾 Parcs à chiens en PACA
        </h1>
        <p style={{ color: "var(--neutral-500)", fontSize: 16, marginBottom: 40 }}>
          {totalParks} espaces canins recensés dans 6 départements. Données issues d'OpenStreetMap et de sources officielles.
        </p>

        <ParcsSearch cities={allCities} totalParks={totalParks} />

        <SeoFooter />
      </main>
    </div>
  );
}
