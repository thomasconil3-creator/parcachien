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
    <div className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      <ContentNav />
      <main className="max-w-5xl mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" style={{ color: "var(--neutral-500)" }}>
          <a href="/" className="no-underline hover:underline" style={{ color: "#7C6EF5" }}>
            ParcAChien
          </a>
          <span className="mx-2">›</span>
          <span className="text-neutral-700 dark:text-neutral-300">Annuaire des Parcs</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl font-black mb-4 leading-tight"
            style={{ color: "var(--neutral-800)", fontFamily: "'Nunito', sans-serif" }}
          >
            🐾 Parcs à chiens en PACA
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl text-neutral-500 dark:text-neutral-400">
            Explorez les <strong>{totalParks} espaces canins</strong> recensés dans les 6 départements de la région PACA. Données qualifiées issues d'OpenStreetMap et validées par la communauté.
          </p>
        </div>

        {/* Interactive Search Component */}
        <ParcsSearch cities={allCities} totalParks={totalParks} />

        <SeoFooter />
      </main>
    </div>
  );
}
