import { Metadata } from "next";
import SeoFooter from "@/components/SeoFooter";
import ContentNav from "@/components/ContentNav";
import BlogContent from "@/components/BlogContent";

export const metadata: Metadata = {
  title: "Blog & Conseils Canins — ParcAChien PACA",
  description: "Retrouvez nos guides complets pour promener votre chien en PACA : plages autorisées aux chiens, vétérinaires d'urgence, réglementation et sélection de parcs à Marseille, Nice, Toulon.",
  openGraph: {
    title: "Blog & Conseils Canins — ParcAChien PACA",
    description: "Guides, astuces et conseils pratiques pour sortir votre chien en Provence-Alpes-Côte d'Azur.",
    siteName: "ParcAChien",
    locale: "fr_FR",
    type: "website",
  },
};

const ARTICLES = [
  {
    slug: "les-plus-belles-plages-autorisees-aux-chiens-en-paca",
    title: "Les plus belles plages autorisées aux chiens en PACA (2026)",
    excerpt: "Où baigner votre chien en région PACA ? Guide complet des plages autorisées aux chiens dans les Bouches-du-Rhône, le Var et les Alpes-Maritimes.",
    date: "24 juin 2026",
    readTime: "5 min",
    category: "Guide",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    slug: "comment-declarer-et-retrouver-un-chien-perdu-en-paca",
    title: "Comment déclarer et retrouver un chien perdu en PACA ?",
    excerpt: "Votre chien s'est sauvé en PACA ? Pas de panique. Voici les étapes clés : déclaration I-CAD, réseaux d'entraide, contact des fourrières et SPA de Marseille et Nice.",
    date: "22 juin 2026",
    readTime: "6 min",
    category: "Conseils & Santé",
    categoryColor: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
  },
  {
    slug: "top-10-parcs-chiens-marseille-2026",
    title: "Top 10 des parcs à chiens à Marseille en 2026",
    excerpt: "De Longchamp à Belle de Mai en passant par le Parc Saucisse, voici notre sélection des meilleurs espaces canins de la cité phocéenne.",
    date: "10 juin 2026",
    readTime: "5 min",
    category: "Guide",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
  },
  {
    slug: "preparer-premiere-visite-parc-canin",
    title: "Comment préparer la première visite de votre chien dans un parc canin ?",
    excerpt: "Socialisation, équipement, règles à respecter… Tout ce qu'il faut savoir avant d'emmener votre compagnon pour la première fois.",
    date: "3 juin 2026",
    readTime: "4 min",
    category: "Conseils",
    categoryColor: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
  },
  {
    slug: "velox-ia-agence-derriere-parcachien",
    title: "Velox IA : l'agence derrière ParcAChien",
    excerpt: "Découvrez l'histoire de Velox IA, l'agence marseillaise qui a conçu ParcAChien et révolutionne la présence digitale des PME en PACA.",
    date: "28 mai 2026",
    readTime: "3 min",
    category: "À propos",
    categoryColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  },
  {
    slug: "parc-a-chien-marseille-8eme-arrondissement",
    title: "Parc à chien dans le 8ème arrondissement de Marseille (13008)",
    excerpt: "Où promener son chien dans le 8ème arrondissement de Marseille ? Espaces canins, alternatives et bons plans pour les propriétaires du 13008.",
    date: "20 juin 2026",
    readTime: "4 min",
    category: "Guide local",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
  },
  {
    slug: "chien-sans-laisse-marseille-ou-aller",
    title: "Où laisser son chien sans laisse à Marseille ?",
    excerpt: "Liste complète des espaces canins sans laisse à Marseille : Parc Saucisse, Lodi, Capelette, et tous les lieux où votre chien peut courir librement.",
    date: "15 juin 2026",
    readTime: "5 min",
    category: "Guide",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80",
  },
  {
    slug: "trouver-parc-chien-pres-de-chez-moi-paca",
    title: "Comment trouver un parc à chien près de chez moi en PACA ?",
    excerpt: "Guide pratique pour localiser les espaces canins les plus proches : géolocalisation, carte interactive, conseils pour chaque ville de la région PACA.",
    date: "10 juin 2026",
    readTime: "4 min",
    category: "Guide",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    image: "https://images.unsplash.com/photo-1477884213984-7a4d22934a33?w=800&q=80",
  },
  {
    slug: "espaces-canins-nice-cote-azur",
    title: "Les meilleurs espaces canins à Nice et sur la Côte d'Azur",
    excerpt: "Guide complet des parcs à chiens à Nice, Cannes, Antibes, Cagnes-sur-Mer et toute la Côte d'Azur. Carte, horaires et avis de la communauté.",
    date: "5 juin 2026",
    readTime: "5 min",
    category: "Guide local",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80",
  },
  {
    slug: "espaces-canins-avignon-vaucluse",
    title: "Espaces canins à Avignon et en Vaucluse — Guide complet",
    excerpt: "Découvrez les meilleurs parcs à chiens à Avignon et en Vaucluse (84). Espaces canins, jardins canins et bons plans pour sortir votre chien en Vaucluse.",
    date: "23 juin 2026",
    readTime: "6 min",
    category: "Guide local",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "parcs-chiens-cannes-alpes-maritimes",
    title: "Parcs à chiens à Cannes et sur la Côte d'Azur — Alpes-Maritimes",
    excerpt: "Guide des parcs à chiens à Cannes, Antibes, Cagnes-sur-Mer et dans les Alpes-Maritimes (06). Aires canines, espaces clôturés et conseils pour la Côte d'Azur.",
    date: "23 juin 2026",
    readTime: "6 min",
    category: "Guide local",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
  },
  {
    slug: "balade-chien-calanques-marseille",
    title: "Balades avec son chien dans les Calanques de Marseille",
    excerpt: "Guide complet pour se balader avec son chien dans les Calanques de Marseille, Cassis et La Ciotat. Règles du Parc National, zones autorisées et conseils pratiques.",
    date: "23 juin 2026",
    readTime: "6 min",
    category: "Balade & Nature",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    image: "https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=800&q=80",
  },
  {
    slug: "choisir-croquettes-chien-conseils",
    title: "Comment choisir les croquettes de son chien — Guide 2026",
    excerpt: "Guide complet 2026 pour choisir les meilleures croquettes pour votre chien : types, ingrédients à éviter, critères selon la race et l'âge.",
    date: "23 juin 2026",
    readTime: "6 min",
    category: "Conseils & Santé",
    categoryColor: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
  },
  {
    slug: "parc-chien-avignon-villeneuve",
    title: "Parc à chien Avignon — Villeneuve-lès-Avignon et Gard",
    excerpt: "Espaces canins à Villeneuve-lès-Avignon et dans le Gard (30). Où promener son chien côté rive droite du Rhône, autour d'Avignon.",
    date: "23 juin 2026",
    readTime: "6 min",
    category: "Guide local",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
  },
  {
    slug: "veterinaire-urgence-chien-paca",
    title: "Urgences vétérinaires pour chiens en PACA — Où aller ?",
    excerpt: "Cliniques vétérinaires d'urgence 24h/24 pour chiens en PACA : Marseille, Nice, Toulon, Aix-en-Provence. SOS vétérinaire, numéros utiles et conseils.",
    date: "23 juin 2026",
    readTime: "6 min",
    category: "Santé & Urgences",
    categoryColor: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80",
  },
  {
    slug: "regles-espaces-canins-marseille",
    title: "Règles des espaces canins à Marseille : tout ce qu'il faut savoir",
    excerpt: "Réglementation, horaires, obligations des propriétaires et bonnes pratiques dans les espaces canins de Marseille. Guide complet 2026.",
    date: "1er juin 2026",
    readTime: "4 min",
    category: "Réglementation",
    categoryColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
  },
];

export default function BlogPage() {
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
          <span className="text-neutral-700 dark:text-neutral-300">Blog & Conseils</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl font-black mb-4 leading-tight"
            style={{ color: "var(--neutral-800)", fontFamily: "'Nunito', sans-serif" }}
          >
            Le Blog ParcAChien 📝
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl text-neutral-500 dark:text-neutral-400">
            Retrouvez tous nos guides, conseils santé, réglementations et astuces pour rendre les balades de votre chien exceptionnelles en région PACA.
          </p>
        </div>

        {/* Interactive content search & categories */}
        <BlogContent articles={ARTICLES} />

        {/* CTA banner */}
        <div
          className="mt-20 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-lg border border-white/10"
          style={{ background: "linear-gradient(135deg, #7C6EF5 0%, #F59500 100%)" }}
        >
          {/* Subtle decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <p className="text-white font-black text-2xl sm:text-3xl mb-3 relative z-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
            🗺️ Trouvez votre parc maintenant
          </p>
          <p className="text-white/95 text-base sm:text-lg mb-8 max-w-xl mx-auto relative z-10">
            Rejoignez plus de 1 200 propriétaires en région PACA. Check-ins live, alertes dangers et forum communautaire.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-[#7C6EF5] font-extrabold px-8 py-3.5 rounded-2xl no-underline text-sm hover:shadow-xl transition-all hover:scale-105 relative z-10"
          >
            Explorer la carte interactive →
          </a>
        </div>

        <SeoFooter />
      </main>
    </div>
  );
}
