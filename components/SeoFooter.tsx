const CITIES = [
  { label: "Marseille", slug: "marseille" },
  { label: "Nice", slug: "nice" },
  { label: "Toulon", slug: "toulon" },
  { label: "Aix-en-Provence", slug: "aix-en-provence" },
  { label: "Avignon", slug: "avignon" },
  { label: "Cannes", slug: "cannes" },
  { label: "Martigues", slug: "martigues" },
  { label: "Cagnes-sur-Mer", slug: "cagnes-sur-mer" },
];

const MARSEILLE_ARRONDISSEMENTS = [
  { code: "13001", label: "1er — Vieux-Port" },
  { code: "13002", label: "2ème — Joliette" },
  { code: "13003", label: "3ème — Belle de Mai" },
  { code: "13004", label: "4ème — Cinq-Avenues" },
  { code: "13005", label: "5ème — Baille" },
  { code: "13006", label: "6ème — Vauban / Lodi" },
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

const DEPTS = [
  { slug: "bouches-du-rhone", label: "Bouches-du-Rhône (13)" },
  { slug: "var", label: "Var (83)" },
  { slug: "alpes-maritimes", label: "Alpes-Maritimes (06)" },
  { slug: "vaucluse", label: "Vaucluse (84)" },
  { slug: "alpes-de-haute-provence", label: "Alpes-de-Haute-Provence (04)" },
  { slug: "hautes-alpes", label: "Hautes-Alpes (05)" },
];

const THEMES = [
  { slug: "clotured", label: "🔒 Espaces clôturés" },
  { slug: "sans-laisse", label: "🐕 Chien sans laisse" },
  { slug: "agility", label: "🏃 Agility" },
  { slug: "gratuit", label: "✅ Gratuit" },
];

const BLOG_ARTICLES = [
  { slug: "top-10-parcs-chiens-marseille-2026", label: "Top 10 parcs à Marseille" },
  { slug: "preparer-premiere-visite-parc-canin", label: "Préparer la première visite" },
  { slug: "chien-sans-laisse-marseille-ou-aller", label: "Chien sans laisse à Marseille" },
  { slug: "trouver-parc-chien-pres-de-chez-moi-paca", label: "Trouver un parc près de chez moi" },
  { slug: "parc-a-chien-marseille-8eme-arrondissement", label: "Parc chien 13008 — 8ème" },
  { slug: "regles-espaces-canins-marseille", label: "Règles espaces canins Marseille" },
  { slug: "espaces-canins-nice-cote-azur", label: "Parcs chiens Nice & Côte d'Azur" },
  { slug: "velox-ia-agence-derriere-parcachien", label: "Velox IA & ParcAChien" },
];

const linkClass = "text-sm text-gray-500 dark:text-gray-400 hover:text-[#7C6EF5] dark:hover:text-[#a89cf7] no-underline transition-colors leading-relaxed";
const headingClass = "text-[11px] font-bold tracking-widest uppercase text-[#7C6EF5] mb-4";

export default function SeoFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-12 pb-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Parcs par ville */}
          <div className="col-span-1">
            <p className={headingClass}>Villes</p>
            <ul className="space-y-2 list-none p-0 m-0">
              {CITIES.map(({ label, slug }) => (
                <li key={slug}>
                  <a href={`/parcs/${slug}`} className={linkClass}>🐾 {label}</a>
                </li>
              ))}
              <li className="pt-1">
                <a href="/parcs" className="text-sm font-semibold text-[#7C6EF5] no-underline">Tous les parcs →</a>
              </li>
            </ul>
          </div>

          {/* Marseille arrondissements */}
          <div className="col-span-1">
            <p className={headingClass}>Marseille</p>
            <ul className="space-y-1.5 list-none p-0 m-0">
              {MARSEILLE_ARRONDISSEMENTS.map(({ code, label }) => (
                <li key={code}>
                  <a href={`/parcs/marseille/${code}`} className={linkClass}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div className="col-span-1">
            <p className={headingClass}>Blog & Guides</p>
            <ul className="space-y-2 list-none p-0 m-0">
              {BLOG_ARTICLES.map(({ slug, label }) => (
                <li key={slug}>
                  <a href={`/blog/${slug}`} className={linkClass}>{label}</a>
                </li>
              ))}
              <li className="pt-1">
                <a href="/blog" className="text-sm font-semibold text-[#7C6EF5] no-underline">Tous les articles →</a>
              </li>
            </ul>
          </div>

          {/* Départements */}
          <div className="col-span-1">
            <p className={headingClass}>Départements</p>
            <ul className="space-y-2 list-none p-0 m-0">
              {DEPTS.map(({ slug, label }) => (
                <li key={slug}>
                  <a href={`/parcs/departement/${slug}`} className={linkClass}>{label}</a>
                </li>
              ))}
            </ul>
            <p className={`${headingClass} mt-6`}>Par type</p>
            <ul className="space-y-2 list-none p-0 m-0">
              {THEMES.map(({ slug, label }) => (
                <li key={slug}>
                  <a href={`/parcs/theme/${slug}`} className={linkClass}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partenaires */}
          <div className="col-span-1">
            <p className={headingClass}>Vétérinaires</p>
            <ul className="space-y-2 list-none p-0 m-0">
              {["marseille","nice","toulon","aix-en-provence","avignon","cannes"].map(city => (
                <li key={city}>
                  <a href={`/partenaires/${city}`} className={linkClass}>🏥 {city.charAt(0).toUpperCase() + city.slice(1).replace("-", " ")}</a>
                </li>
              ))}
              <li className="pt-1">
                <a href="/partenaires/rejoindre" className="text-sm font-semibold text-[#7C6EF5] no-underline">Être référencé →</a>
              </li>
            </ul>
          </div>

          {/* ParcAChien */}
          <div className="col-span-1">
            <div className="mb-5">
              <span className="text-2xl">🐾</span>
              <p className="font-black text-lg text-[#F59500] mt-1 mb-0" style={{ fontFamily: "'Nunito', sans-serif" }}>ParcAChien</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">par Velox IA · Marseille</p>
            </div>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><a href="/" className={linkClass}>🗺️ Carte interactive</a></li>
              <li><a href="/parcs" className={linkClass}>🐾 Tous les parcs</a></li>
              <li><a href="/blog" className={linkClass}>📝 Blog & conseils</a></li>
              <li><a href="/partenaires" className={linkClass}>🏥 Vétérinaires</a></li>
              <li><a href="/login" className={linkClass}>👤 Se connecter</a></li>
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900">
              <p className="text-[10px] font-bold text-[#7C6EF5] mb-1">Mots-clés</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed m-0">
                parc à chien PACA · espace canin Marseille · jardin canin Nice · caniparc · chien sans laisse
              </p>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
              © 2026 ParcAChien · Velox IA<br />
              contact@parcachien.com
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
