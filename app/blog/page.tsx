import { Metadata } from "next";
import SeoFooter from "@/components/SeoFooter";
import ContentNav from "@/components/ContentNav";

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
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
  },
  {
    slug: "preparer-premiere-visite-parc-canin",
    title: "Comment préparer la première visite de votre chien dans un parc canin ?",
    excerpt: "Socialisation, équipement, règles à respecter… Tout ce qu'il faut savoir avant d'emmener votre compagnon pour la première fois.",
    date: "3 juin 2026",
    readTime: "4 min",
    category: "Conseils",
    categoryColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
  },
  {
    slug: "velox-ia-agence-derriere-parcachien",
    title: "Velox IA : l'agence derrière ParcAChien",
    excerpt: "Découvrez l'histoire de Velox IA, l'agence marseillaise qui a conçu ParcAChien et révolutionne la présence digitale des PME en PACA.",
    date: "28 mai 2026",
    readTime: "3 min",
    category: "À propos",
    categoryColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      <ContentNav />
      <main className="max-w-4xl mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" style={{ color: "var(--neutral-500)" }}>
          <a href="/" className="no-underline hover:underline" style={{ color: "#7C6EF5" }}>ParcAChien</a>
          <span className="mx-2">›</span>
          <span>Blog</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-3" style={{ color: "var(--neutral-800)", fontFamily: "'Nunito', sans-serif" }}>
            Blog & Guides 📝
          </h1>
          <p className="text-lg" style={{ color: "var(--neutral-500)" }}>
            Conseils, guides et actualités sur les parcs à chiens en région PACA.
          </p>
        </div>

        {/* Articles */}
        <div className="flex flex-col gap-6">
          {ARTICLES.map((article) => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group no-underline rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "var(--neutral-100)",
                border: "1px solid var(--neutral-200)",
                boxShadow: "0 2px 12px rgba(124,110,245,0.06)",
              }}
            >
              {/* Image */}
              <div className="sm:w-56 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${article.categoryColor}`}>
                      {article.category}
                    </span>
                    <span className="text-xs" style={{ color: "var(--neutral-500)" }}>
                      {article.date} · {article.readTime} de lecture
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 transition-colors duration-200 group-hover:text-[#7C6EF5]" style={{ color: "var(--neutral-800)", fontFamily: "'Nunito', sans-serif" }}>
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--neutral-500)" }}>
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#7C6EF5]">
                  Lire l'article
                  <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #7C6EF5 0%, #F59500 100%)" }}>
          <p className="text-white font-black text-2xl mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
            🗺️ Trouvez votre parc maintenant
          </p>
          <p className="text-white/80 text-sm mb-6">308+ espaces canins en PACA sur la carte interactive</p>
          <a
            href="/"
            className="inline-block bg-white text-[#7C6EF5] font-bold px-8 py-3 rounded-full no-underline text-sm hover:shadow-lg transition-shadow"
          >
            Explorer la carte →
          </a>
        </div>

        <SeoFooter />
      </main>
    </div>
  );
}
