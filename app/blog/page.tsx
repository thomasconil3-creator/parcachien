import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — ParcAChien",
  description: "Conseils, guides et actualités sur les parcs à chiens en PACA. Découvrez les meilleurs espaces canins de Marseille, Nice, Toulon et toute la région.",
  openGraph: {
    title: "Blog — ParcAChien",
    description: "Conseils et guides sur les parcs à chiens en PACA.",
    siteName: "ParcAChien",
    locale: "fr_FR",
    type: "website",
  },
};

const ARTICLES = [
  {
    slug: "top-10-parcs-chiens-marseille-2026",
    title: "Top 10 des parcs à chiens à Marseille en 2026",
    excerpt: "De Longchamp à Belle de Mai en passant par le Parc Saucisse, voici notre sélection des meilleurs espaces canins de la cité phocéenne.",
    date: "10 juin 2026",
    readTime: "5 min",
    category: "Guide",
  },
  {
    slug: "preparer-premiere-visite-parc-canin",
    title: "Comment préparer la première visite de votre chien dans un parc canin ?",
    excerpt: "Socialisation, équipement, règles à respecter… Tout ce qu'il faut savoir avant d'emmener votre compagnon pour la première fois.",
    date: "3 juin 2026",
    readTime: "4 min",
    category: "Conseils",
  },
  {
    slug: "velox-ia-agence-derriere-parcachien",
    title: "Velox IA : l'agence derrière ParcAChien",
    excerpt: "Découvrez l'histoire de Velox IA, l'agence marseillaise qui a conçu ParcAChien et révolutionne la présence digitale des PME en PACA.",
    date: "28 mai 2026",
    readTime: "3 min",
    category: "À propos",
  },
];

export default function BlogPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 860, margin: "0 auto", padding: "40px 20px" }}>
      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>
        {" › "}
        Blog
      </nav>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        📝 Blog ParcAChien
      </h1>
      <p style={{ color: "#555", fontSize: 16, marginBottom: 40 }}>
        Conseils, guides et actualités sur les parcs à chiens en région PACA.
      </p>

      <div style={{ display: "grid", gap: 24 }}>
        {ARTICLES.map((article) => (
          <a
            key={article.slug}
            href={`/blog/${article.slug}`}
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid #e8e4f0",
              borderRadius: 16,
              padding: "28px 32px",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 2px 8px rgba(124,110,245,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <span style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                {article.category}
              </span>
              <span style={{ fontSize: 12, color: "#aaa" }}>{article.date} · {article.readTime} de lecture</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
              {article.title}
            </h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
              {article.excerpt}
            </p>
            <span style={{ display: "inline-block", marginTop: 16, color: "#7C6EF5", fontSize: 13, fontWeight: 600 }}>
              Lire l'article →
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
