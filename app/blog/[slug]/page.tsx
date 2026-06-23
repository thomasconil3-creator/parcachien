import { Metadata } from "next";
import { notFound } from "next/navigation";

const ARTICLES: Record<string, {
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  "top-10-parcs-chiens-marseille-2026": {
    title: "Top 10 des parcs à chiens à Marseille en 2026",
    description: "De Longchamp à Belle de Mai en passant par le Parc Saucisse, voici notre sélection des meilleurs espaces canins de la cité phocéenne.",
    date: "10 juin 2026",
    readTime: "5 min",
    category: "Guide",
    content: `
      <p>Marseille compte aujourd'hui plus de 28 espaces canins officiels, répartis dans tous les arrondissements. Que votre chien soit une boule d'énergie ou un retraité tranquille, la ville a de quoi combler tout le monde.</p>

      <h2>1. Parc Saucisse (Longchamp) — Le plus emblématique</h2>
      <p>Inauguré en 2025 en hommage au célèbre chien de Marseille, ce parc de <strong>6 000 m²</strong> dans l'enceinte du Palais Longchamp est le plus grand espace canin du centre-ville. Clôturé, sans laisse, avec une vue imprenable sur les jardins classés.</p>

      <h2>2. Espace canin Belle de Mai</h2>
      <p>En plein cœur du quartier culturel de la Belle de Mai, cet espace est clôturé et bien entretenu. Idéal pour les matins avant le boulot.</p>

      <h2>3. Espace canin Lodi</h2>
      <p>Boulevard Vincent Delpuech, le Lodi est l'un des rares espaces "sans laisse" au centre de Marseille. Très fréquenté le soir, ambiance conviviale garantie.</p>

      <h2>4. Espace canin Baille</h2>
      <p>Rue Saint-Pierre, en plein 5e arrondissement. Clôturé, pratique pour les habitants du centre.</p>

      <h2>5. Espace canin Cinq-Avenues</h2>
      <p>Rue Buffon, dans le quartier des Cinq-Avenues. Bien situé, accessible en transports.</p>

      <h2>6. Espace canin La Capelette</h2>
      <p>Avenue de la Capelette, clôturé. Un des plus populaires du 10e arrondissement.</p>

      <h2>7. Espace canin Saint-Barnabé</h2>
      <p>Avenue d'Haïti dans le 12e. Espace spacieux, bien apprécié par les familles.</p>

      <h2>8. Espace canin Sainte-Marguerite</h2>
      <p>Avenue de la Magalone dans le 9e. Calme, bien entretenu, idéal pour les chiens timides.</p>

      <h2>9. Espace canin Saint-Tronc</h2>
      <p>Boulevard Paul Claudel. Grand espace vert, très apprécié des propriétaires du 10e-11e.</p>

      <h2>10. Espace canin Roucas-Blanc</h2>
      <p>Rue du Bois Sacré dans le 7e. Un peu excentré mais magnifique cadre, proche du littoral.</p>

      <p><strong>Astuce :</strong> Utilisez ParcAChien pour voir en temps réel combien de chiens sont présents dans chaque parc avant de vous déplacer !</p>
    `,
  },
  "preparer-premiere-visite-parc-canin": {
    title: "Comment préparer la première visite de votre chien dans un parc canin ?",
    description: "Socialisation, équipement, règles à respecter… Tout ce qu'il faut savoir avant d'emmener votre compagnon pour la première fois.",
    date: "3 juin 2026",
    readTime: "4 min",
    category: "Conseils",
    content: `
      <p>La première visite dans un parc canin est une étape importante pour votre chien. Bien préparée, elle peut déclencher une vraie passion pour ces sorties sociales. Mal préparée, elle peut créer du stress pour des mois.</p>

      <h2>Avant la visite</h2>
      <h3>Vérifiez le niveau de socialisation de votre chien</h3>
      <p>Si votre chien n'a jamais été en contact avec d'autres chiens, commencez par des rencontres en laisse avant d'envisager un espace sans laisse. Les parcs canins sont des environnements à haute stimulation.</p>

      <h3>Choisissez le bon moment</h3>
      <p>Évitez les heures de pointe (18h-20h en semaine, matins de week-end). Utilisez ParcAChien pour voir le nombre de check-ins en temps réel et choisir un moment plus calme pour la première fois.</p>

      <h3>Apportez le nécessaire</h3>
      <ul>
        <li>🧴 Eau et gamelle pliable</li>
        <li>🦮 Laisse longue de rappel (pour les entraînements à l'entrée)</li>
        <li>🍖 Friandises pour renforcer les comportements positifs</li>
        <li>🧻 Sacs à déjections (obligatoire)</li>
      </ul>

      <h2>Pendant la visite</h2>
      <p>Entrez calmement, laissez votre chien renifler et observer. Ne forcez pas les interactions. Restez attentif au langage corporel de votre chien et des autres.</p>

      <p><strong>Signaux d'alerte :</strong> queue basse, oreilles plaquées, grognements — sortez calmement sans punir.</p>

      <h2>Les règles universelles des parcs canins</h2>
      <ul>
        <li>Ramassez systématiquement les déjections</li>
        <li>Surveillez votre chien en permanence</li>
        <li>N'apportez pas de nourriture (source de conflits)</li>
        <li>Les chiens en chaleur sont déconseillés</li>
        <li>Respectez les zones petits/grands chiens quand elles existent</li>
      </ul>
    `,
  },
  "velox-ia-agence-derriere-parcachien": {
    title: "Velox IA : l'agence derrière ParcAChien",
    description: "Découvrez l'histoire de Velox IA, l'agence marseillaise qui a conçu ParcAChien et révolutionne la présence digitale des PME en PACA.",
    date: "28 mai 2026",
    readTime: "3 min",
    category: "À propos",
    content: `
      <p>ParcAChien est né d'une idée simple : il n'existait aucune app dédiée aux propriétaires de chiens en PACA, malgré les 300+ espaces canins de la région.</p>

      <h2>Qui est Velox IA ?</h2>
      <p>Velox IA est une agence digitale marseillaise fondée par Thomas Conil, spécialisée dans la création de présences web sur-mesure pour les PME et commerçants de la région PACA. L'approche ? Des sites premium, déployés rapidement, avec une vraie stratégie de visibilité locale.</p>

      <h2>La genèse de ParcAChien</h2>
      <p>L'idée a émergé d'un constat terrain : les propriétaires de chiens cherchent leurs espaces canins sur Google Maps, sans infos fiables sur les horaires, l'état du parc ou l'affluence en temps réel. ParcAChien résout ça avec :</p>
      <ul>
        <li>🗺️ Une carte interactive avec 308+ parcs vérifiés</li>
        <li>📍 Des check-ins live pour voir l'affluence en temps réel</li>
        <li>🐾 Une communauté de propriétaires connectés</li>
        <li>🤖 DogMatch, l'algorithme de compatibilité canine</li>
      </ul>

      <h2>Lancement prévu le 28 juin 2026</h2>
      <p>L'application sera disponible sur iOS et Android. La version web est déjà accessible sur <strong>parcachien.com</strong>.</p>

      <p>Pour en savoir plus sur Velox IA et ses services : <strong>contact@parcachien.com</strong></p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Article introuvable — ParcAChien" };
  return {
    title: `${article.title} — ParcAChien`,
    description: article.description,
    openGraph: {
      title: `${article.title} — ParcAChien`,
      description: article.description,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "article",
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 740, margin: "0 auto", padding: "40px 20px" }}>
      <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
        <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>ParcAChien</a>
        {" › "}
        <a href="/blog" style={{ color: "#7C6EF5", textDecoration: "none" }}>Blog</a>
        {" › "}
        {article.title}
      </nav>

      <div style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ background: "#f0eeff", color: "#7C6EF5", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
          {article.category}
        </span>
        <span style={{ fontSize: 12, color: "#aaa" }}>{article.date} · {article.readTime} de lecture</span>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2, marginBottom: 32 }}>
        {article.title}
      </h1>

      <div
        style={{ fontSize: 16, lineHeight: 1.8, color: "#444" }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div style={{ marginTop: 48, borderTop: "1px solid #f0eeff", paddingTop: 32, textAlign: "center" }}>
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
          🗺️ Explorer les parcs sur la carte
        </a>
      </div>
    </main>
  );
}
