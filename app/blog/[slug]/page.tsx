import { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoFooter from "@/components/SeoFooter";

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

  "parc-a-chien-marseille-8eme-arrondissement": {
    title: "Parc à chien dans le 8ème arrondissement de Marseille (13008)",
    description: "Où promener son chien dans le 8ème arrondissement de Marseille ? Espaces canins, alternatives et bons plans pour les propriétaires du 13008.",
    date: "20 juin 2026",
    readTime: "4 min",
    category: "Guide local",
    content: `
      <p>Le 8ème arrondissement de Marseille (code postal 13008) est l'un des quartiers résidentiels les plus prisés de la ville. Avec ses quartiers de Périer, Sainte-Anne, Bonneveine et Pointe-Rouge, il regroupe une forte densité de propriétaires de chiens. Voici tout ce qu'il faut savoir pour promener votre compagnon dans le 13008.</p>

      <h2>L'espace canin du 8ème : Mazargues</h2>
      <p>L'espace canin le plus proche du 8ème arrondissement est l'<strong>Espace canin Mazargues</strong>, situé en limite du 8ème et du 9ème. Il s'agit d'un espace accessible et pratique pour les habitants du secteur Sainte-Anne et Bonneveine.</p>

      <h2>Les alternatives pour le 13008</h2>
      <p>Les propriétaires de chiens du 8ème ont plusieurs options :</p>
      <ul>
        <li><strong>Plage de la Pointe-Rouge</strong> : En dehors de la saison balnéaire, les chiens sont tolérés sur certaines parties de la plage. Un cadre magnifique !</li>
        <li><strong>Parc Borély</strong> : Le grand parc de la ville, accessible aux chiens tenus en laisse. Vastes pelouses et plan d'eau.</li>
        <li><strong>Sentiers côtiers</strong> : Les calanques sont accessibles depuis le 8ème et offrent des balades extraordinaires avec votre chien (hors zones protégées).</li>
        <li><strong>Espace Sainte-Marguerite</strong> (13009) : À quelques minutes en voiture.</li>
      </ul>

      <h2>Règles à respecter dans le 8ème</h2>
      <p>Comme partout à Marseille, les chiens doivent être tenus en laisse dans les espaces publics du 8ème, sauf dans les espaces canins dédiés. Le ramassage des déjections est obligatoire et des distributeurs de sacs sont présents dans de nombreuses rues.</p>

      <h2>Trouver un parc à chien en temps réel</h2>
      <p>Utilisez <a href="/">ParcAChien</a> pour voir l'affluence en temps réel dans tous les espaces canins proches du 8ème, et faites un check-in pour signaler votre présence à la communauté.</p>

      <p><strong>Voir aussi :</strong> <a href="/parcs/marseille/13008">Espaces canins — Marseille 8ème (13008)</a></p>
    `,
  },

  "chien-sans-laisse-marseille-ou-aller": {
    title: "Où laisser son chien sans laisse à Marseille ?",
    description: "Liste complète des espaces canins sans laisse à Marseille : Parc Saucisse, Lodi, Capelette, et tous les lieux où votre chien peut courir librement.",
    date: "15 juin 2026",
    readTime: "5 min",
    category: "Guide",
    content: `
      <p>L'une des questions les plus posées par les propriétaires de chiens à Marseille : où puis-je laisser mon chien courir librement sans laisse ? Voici le guide complet des espaces "sans laisse" officiels dans la cité phocéenne.</p>

      <h2>Les espaces canins clôturés : la solution idéale</h2>
      <p>À Marseille, tous les espaces canins <strong>clôturés</strong> permettent de laisser votre chien sans laisse en toute sécurité. La clôture empêche les fugues et les conflits avec les piétons extérieurs.</p>

      <h3>1. Parc Saucisse — Longchamp (4ème, 13004)</h3>
      <p>Le <strong>plus grand espace canin du centre de Marseille</strong> avec 6 000 m². Clôturé, sans laisse, dans l'enceinte majestueuse du Palais Longchamp. Inauguré en 2025, c'est la référence absolue des propriétaires marseillais.</p>

      <h3>2. Espace Lodi (6ème, 13006)</h3>
      <p>Boulevard Vincent Delpuech. L'un des rares espaces officiellement <strong>"sans laisse"</strong> en plein centre-ville. Très fréquenté, ambiance conviviale entre propriétaires.</p>

      <h3>3. Espace canin Belle de Mai (3ème, 13003)</h3>
      <p>Clôturé, accessible et bien entretenu. Parfait pour les chiens des quartiers nord et du 3ème arrondissement.</p>

      <h3>4. Espace canin Baille (5ème, 13005)</h3>
      <p>Clôturé, rue Saint-Pierre. Idéal pour les chiens du centre-ville.</p>

      <h3>5. Espace canin La Capelette (10ème, 13010)</h3>
      <p>Avenue de la Capelette. Clôturé, populaire dans l'est marseillais.</p>

      <h2>Les espaces non clôturés : prudence requise</h2>
      <p>Certains espaces canins ne sont pas clôturés. Votre chien peut s'y promener librement, mais un bon rappel est indispensable :</p>
      <ul>
        <li>Espace Roucas-Blanc (7ème) — cadre naturel, attention aux passages de promeneurs</li>
        <li>Espace Saint-Tronc (10ème) — grand espace vert</li>
        <li>Espace Saint-Barnabé (12ème)</li>
      </ul>

      <h2>Les calanques : un paradis (avec précautions)</h2>
      <p>Les sentiers des calanques autour de Marseille sont accessibles aux chiens, mais avec la laisse obligatoire dans le Parc National. Certaines zones côtières permettent les bains avec vos compagnons hors saison.</p>

      <h2>Astuce ParcAChien</h2>
      <p>Filtrez les parcs par la mention "sans laisse" ou "clôturé" sur notre <a href="/">carte interactive</a> pour trouver instantanément les espaces adaptés à votre chien.</p>
    `,
  },

  "trouver-parc-chien-pres-de-chez-moi-paca": {
    title: "Comment trouver un parc à chien près de chez moi en PACA ?",
    description: "Guide pratique pour localiser les espaces canins les plus proches : géolocalisation, carte interactive, conseils pour chaque ville de la région PACA.",
    date: "10 juin 2026",
    readTime: "4 min",
    category: "Guide",
    content: `
      <p>Vous cherchez un <strong>parc à chien près de chez vous en PACA</strong> ? Avec 308 espaces canins recensés en région PACA, trouver le bon spot n'a jamais été aussi simple grâce à ParcAChien.</p>

      <h2>La méthode la plus rapide : la géolocalisation</h2>
      <p>Sur <a href="/">ParcAChien.com</a>, cliquez sur le bouton de géolocalisation (l'icône de navigation en haut à droite). La carte se centre automatiquement sur votre position et affiche les parcs les plus proches dans un rayon de 10 km.</p>

      <h2>Chercher par ville ou arrondissement</h2>
      <p>Vous pouvez rechercher directement par nom de ville ou de quartier dans la barre de recherche. Les pages dédiées vous donnent toutes les infos :</p>
      <ul>
        <li><a href="/parcs/marseille">Parcs à chiens à Marseille</a> — 28+ espaces, par arrondissement</li>
        <li><a href="/parcs/nice">Parcs à chiens à Nice</a> — Côte d'Azur</li>
        <li><a href="/parcs/toulon">Parcs à chiens à Toulon</a> — Var</li>
        <li><a href="/parcs/aix-en-provence">Parcs à chiens à Aix-en-Provence</a></li>
        <li><a href="/parcs/avignon">Parcs à chiens à Avignon</a> — Vaucluse</li>
        <li><a href="/parcs">Tous les parcs en PACA</a></li>
      </ul>

      <h2>Pour les Marseillais : chercher par code postal</h2>
      <p>Marseille compte 16 arrondissements avec des espaces canins répartis dans toute la ville. Trouvez directement celui de votre quartier :</p>
      <ul>
        <li><a href="/parcs/marseille/13004">13004 — 4ème (Longchamp, Parc Saucisse)</a></li>
        <li><a href="/parcs/marseille/13006">13006 — 6ème (Lodi, Vauban)</a></li>
        <li><a href="/parcs/marseille/13008">13008 — 8ème (Périer, Bonneveine)</a></li>
        <li><a href="/parcs/marseille/13010">13010 — 10ème (La Capelette)</a></li>
        <li><a href="/parcs/marseille/13012">13012 — 12ème (Saint-Barnabé)</a></li>
      </ul>

      <h2>Voir l'affluence en temps réel</h2>
      <p>ParcAChien permet de faire un <strong>check-in</strong> dans un espace canin pour signaler votre présence. Grâce aux check-ins de la communauté, vous savez combien de chiens sont présents avant de vous déplacer — très utile pour les chiens qui préfèrent les moments calmes.</p>

      <h2>Application mobile disponible</h2>
      <p>ParcAChien est aussi disponible en application mobile sur iOS et Android. Géolocalisation, check-ins, DogMatch et communauté — tout dans votre poche lors de vos sorties.</p>
    `,
  },

  "espaces-canins-nice-cote-azur": {
    title: "Les meilleurs espaces canins à Nice et sur la Côte d'Azur",
    description: "Guide complet des parcs à chiens à Nice, Cannes, Antibes, Cagnes-sur-Mer et toute la Côte d'Azur. Carte, horaires et avis de la communauté.",
    date: "5 juin 2026",
    readTime: "5 min",
    category: "Guide local",
    content: `
      <p>La Côte d'Azur est une région magnifique pour se promener avec son chien. Entre jardins canins aménagés, parcs communaux et accès à la nature, les propriétaires de chiens ne manquent pas d'options. Voici notre sélection des meilleurs espaces.</p>

      <h2>Les espaces canins à Nice</h2>
      <p>Nice, deuxième ville de la région PACA, dispose de plusieurs espaces canins bien équipés :</p>

      <h3>Parc Carol de Roumanie</h3>
      <p>Niché dans les collines de Nice, ce parc propose une zone canine spacieuse avec de l'ombre et des équipements. Très apprécié pour les longues balades matinales.</p>

      <h3>Parc Valrose</h3>
      <p>Le magnifique parc de l'Université de Nice dispose d'espaces verts accessibles aux chiens tenus en laisse. Cadre exceptionnel avec des jardins à l'anglaise.</p>

      <h3>Batterie Russe (Cimiez)</h3>
      <p>Espace naturel sur les hauteurs de Nice, avec vue panoramique. Idéal pour les longues balades et les chiens qui adorent l'exploration.</p>

      <h2>Les espaces canins à Cannes</h2>
      <h3>Espace canin du Lys</h3>
      <p>Inauguré en décembre 2024, cet espace de <strong>400 m²</strong> dispose d'équipements d'agility et d'une fontaine canine. Clôturé, accessible facilement depuis le centre de Cannes.</p>

      <h2>Les espaces canins à Cagnes-sur-Mer</h2>
      <p>Cagnes-sur-Mer dispose de plusieurs jardins canins bien répartis : les Lucayas, l'Allée des Saules et un espace côté Cagnes Plage pour les amateurs de mer.</p>

      <h2>Antibes et Juan-les-Pins</h2>
      <p>Antibes propose plusieurs espaces canins dans ses quartiers résidentiels. La promenade le long du bord de mer est accessible aux chiens hors saison.</p>

      <h2>Conseils pour la Côte d'Azur</h2>
      <ul>
        <li><strong>Été :</strong> Évitez les heures chaudes (11h-17h). Beaucoup de plages interdisent les chiens en juillet-août.</li>
        <li><strong>Hors saison :</strong> Certaines plages autoriserent les chiens — vérifiez localement.</li>
        <li><strong>Eau :</strong> Apportez toujours de l'eau fraîche, surtout en été sur la côte.</li>
        <li><strong>Laisse :</strong> Obligatoire sur les promenades et plages urbaines.</li>
      </ul>

      <p>Retrouvez tous les espaces canins de la Côte d'Azur sur la <a href="/parcs/nice">page Nice de ParcAChien</a>.</p>
    `,
  },

  "regles-espaces-canins-marseille": {
    title: "Règles des espaces canins à Marseille : tout ce qu'il faut savoir",
    description: "Réglementation, horaires, obligations des propriétaires et bonnes pratiques dans les espaces canins de Marseille. Guide complet 2026.",
    date: "1er juin 2026",
    readTime: "4 min",
    category: "Réglementation",
    content: `
      <p>Les espaces canins de Marseille sont des lieux de liberté pour vos chiens — mais ils fonctionnent avec des règles précises pour garantir la sécurité et la convivialité de tous. Voici ce que tout propriétaire doit savoir.</p>

      <h2>Règles communes à tous les espaces canins marseillais</h2>
      <ul>
        <li>🐕 <strong>Vaccinations à jour obligatoires</strong> : Rage, typhus, parvovirose, toux du chenil.</li>
        <li>📋 <strong>Identification obligatoire</strong> : Tatouage ou puce électronique.</li>
        <li>🧹 <strong>Ramassage des déjections</strong> : Obligatoire. Des sacs sont souvent fournis à l'entrée.</li>
        <li>👀 <strong>Surveillance permanente</strong> : Vous êtes responsable de votre chien en toutes circonstances.</li>
        <li>🚫 <strong>Nourriture interdite</strong> : Source de conflits entre chiens. Ne donnez pas à manger dans l'espace.</li>
        <li>🔞 <strong>Chiens en chaleur déconseillés</strong> : Pour éviter les tensions.</li>
        <li>👶 <strong>Enfants</strong> : Surveillez les jeunes enfants, même avec des chiens connus comme doux.</li>
      </ul>

      <h2>Zones petits/grands chiens</h2>
      <p>Certains espaces comme le Parc canin Gauffredy à Aix-en-Provence proposent deux enclos séparés selon la taille du chien. À Marseille, ces zones commencent à se développer. Respectez-les : un grand chien peut effrayer involontairement un petit.</p>

      <h2>Horaires des espaces canins</h2>
      <p>Les horaires varient selon les espaces. La plupart sont accessibles de <strong>7h à 20h</strong> (ou 22h en été). Quelques espaces sont ouverts 24h/24. Vérifiez les informations sur ParcAChien ou sur les panneaux à l'entrée de chaque espace.</p>

      <h2>Chiens de catégorie 1 et 2</h2>
      <p>Les chiens de <strong>catégorie 1</strong> (chiens d'attaque : Pitbull, Boerbull...) ne sont pas admis dans les espaces canins publics à Marseille. Les chiens de <strong>catégorie 2</strong> (chiens de garde : Rottweiler, Tosa...) doivent être muselés à l'extérieur de la zone canine et peuvent être admis selon la signalétique locale.</p>

      <h2>En cas de conflit entre chiens</h2>
      <p>Restez calme. Claquement de mains, voix ferme, interposer un objet (sac, veste) — mais ne vous interposez jamais physiquement entre deux chiens en bagarre. Signalez tout incident via la communauté ParcAChien.</p>

      <h2>Signaler un danger</h2>
      <p>ParcAChien permet de signaler les dangers dans les parcs (verre, épillets, déjections non ramassées, comportement agressif). Vos alertes aident toute la communauté.</p>

      <p><strong>→</strong> <a href="/">Accéder à la carte des espaces canins de Marseille</a></p>
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
      <SeoFooter />
    </main>
  );
}
