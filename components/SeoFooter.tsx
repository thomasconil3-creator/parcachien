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

export default function SeoFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e8e4f0",
        marginTop: 64,
        paddingTop: 40,
        paddingBottom: 40,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>

          {/* Parcs par ville */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Parcs par ville
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {CITIES.map(({ label, slug }) => (
                <li key={slug} style={{ marginBottom: 8 }}>
                  <a href={`/parcs/${slug}`} style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>
                    🐾 Parcs à chiens à {label}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: 10 }}>
                <a href="/parcs" style={{ fontSize: 13, color: "#7C6EF5", fontWeight: 600, textDecoration: "none" }}>
                  Voir tous les parcs →
                </a>
              </li>
            </ul>
          </div>

          {/* Marseille par arrondissement */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Marseille par arrondissement
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {MARSEILLE_ARRONDISSEMENTS.map(({ code, label }) => (
                <li key={code} style={{ marginBottom: 6 }}>
                  <a href={`/parcs/marseille/${code}`} style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Blog & Guides
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {BLOG_ARTICLES.map(({ slug, label }) => (
                <li key={slug} style={{ marginBottom: 8 }}>
                  <a href={`/blog/${slug}`} style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: 10 }}>
                <a href="/blog" style={{ fontSize: 13, color: "#7C6EF5", fontWeight: 600, textDecoration: "none" }}>
                  Voir tous les articles →
                </a>
              </li>
            </ul>
          </div>

          {/* Départements PACA */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Par département
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {DEPTS.map(({ slug, label }) => (
                <li key={slug} style={{ marginBottom: 8 }}>
                  <a href={`/parcs/departement/${slug}`} style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 10, marginTop: 20 }}>
              Par type
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {THEMES.map(({ slug, label }) => (
                <li key={slug} style={{ marginBottom: 8 }}>
                  <a href={`/parcs/theme/${slug}`} style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vétérinaires & Boutiques */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Vétérinaires & Animaleries
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires/marseille" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>🏥 Vét. & animaleries Marseille</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires/nice" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>🏥 Vét. & animaleries Nice</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires/toulon" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>🏥 Vét. & animaleries Toulon</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires/aix-en-provence" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>🏥 Vét. & animaleries Aix</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires/avignon" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>🏥 Vét. & animaleries Avignon</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires/cannes" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>🏥 Vét. & animaleries Cannes</a>
              </li>
              <li style={{ marginTop: 10 }}>
                <a href="/partenaires/rejoindre" style={{ fontSize: 13, color: "#7C6EF5", fontWeight: 600, textDecoration: "none" }}>
                  Être référencé →
                </a>
              </li>
            </ul>
          </div>

          {/* ParcAChien */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              ParcAChien
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="/" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>🗺️ Carte interactive</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/parcs" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>🐾 Tous les parcs PACA</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/blog" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>📝 Blog & conseils</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/partenaires" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>🏥 Vétérinaires & boutiques</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/login" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>👤 Se connecter</a>
              </li>
            </ul>
            <div style={{ marginTop: 20, padding: "12px 14px", background: "#f0eeff", borderRadius: 10 }}>
              <p style={{ fontSize: 11, color: "#7C6EF5", fontWeight: 700, marginBottom: 4 }}>Mots-clés</p>
              <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, margin: 0 }}>
                parc à chien PACA · espace canin Marseille · jardin canin Nice · aire canine Toulon · chien sans laisse · caniparc · vétérinaire chien Marseille · animalerie croquettes PACA · parc chien 13008
              </p>
            </div>
            <p style={{ fontSize: 12, color: "#bbb", marginTop: 16 }}>
              © 2026 ParcAChien · Velox IA<br />
              contact@parcachien.com
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
