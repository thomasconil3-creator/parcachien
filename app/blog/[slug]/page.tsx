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

  "espaces-canins-avignon-vaucluse": {
    title: "Espaces canins à Avignon et en Vaucluse — Guide complet | ParcAChien",
    description: "Découvrez les meilleurs parcs à chiens à Avignon et en Vaucluse (84). Espaces canins, jardins canins et bons plans pour sortir votre chien en Vaucluse.",
    keywords: ["parc à chien Avignon", "espace canin Vaucluse", "jardin canin Avignon", "sortir son chien Avignon", "parc chien Villeneuve-lès-Avignon", "espace canin 84", "aire canine Avignon", "promenade chien Vaucluse"],
    date: "2026-06-23",
    readTime: "6 min",
    category: "Guide local",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    content: `
      <p>Avignon et le département du Vaucluse (84) offrent de nombreuses possibilités pour promener son chien dans des espaces dédiés et sécurisés. Que vous habitiez intra-muros ou en périphérie, voici le guide complet des <strong>espaces canins à Avignon et en Vaucluse</strong>.</p>

      <h2>Les espaces canins à Avignon</h2>
      <p>La Ville d'Avignon a aménagé plusieurs aires canines dans ses quartiers pour répondre à la demande croissante des propriétaires de chiens. Ces espaces clôturés permettent à votre compagnon de courir librement en toute sécurité.</p>
      <ul>
        <li><strong>Espace canin du Parc de l'Ile Piot</strong> : Situé sur l'île de la Barthelasse, cet espace offre un cadre naturel exceptionnel avec des pelouses et des arbres pour l'ombre.</li>
        <li><strong>Espace canin du quartier Monclar</strong> : Accessible et pratique pour les habitants du quartier, clôturé et bien entretenu.</li>
        <li><strong>Jardin canin de la Rocade</strong> : Situé en périphérie du centre, idéal pour les chiens de grande taille qui ont besoin d'espace.</li>
      </ul>

      <h2>Sortir son chien autour des remparts d'Avignon</h2>
      <p>Les abords des remparts médiévaux d'Avignon constituent une promenade de choix pour les propriétaires de chiens. Le chemin qui longe les fortifications permet une balade d'environ 4 km avec votre compagnon tenu en laisse. Les jardins du Rocher des Doms, dominant le Rhône, sont également accessibles aux chiens.</p>

      <h2>Espaces canins en Vaucluse hors Avignon</h2>
      <p>Le reste du Vaucluse n'est pas en reste pour les propriétaires de chiens :</p>
      <ul>
        <li><strong>Carpentras</strong> : Espace canin au Parc Maurice Clavel, clôturé.</li>
        <li><strong>Apt</strong> : Jardin canin aménagé en bord de rivière, idéal pour une balade rafraîchissante.</li>
        <li><strong>Orange</strong> : Espace canin près du Théâtre antique, pratique pour les habitants du centre.</li>
        <li><strong>Cavaillon</strong> : Aire canine avec équipements d'agility.</li>
      </ul>

      <h2>Parc chien Villeneuve-lès-Avignon</h2>
      <p>Juste de l'autre côté du Rhône, <strong>Villeneuve-lès-Avignon</strong> dispose d'espaces canins agréables dans un cadre historique. La ville est reliée à Avignon en quelques minutes et les propriétaires des deux rives profitent de ces espaces. Retrouvez les infos détaillées sur notre page <a href="/parcs/avignon">parcs à chiens Avignon</a>.</p>

      <h2>Bonnes pratiques dans les espaces canins du 84</h2>
      <ul>
        <li>Ramassage des déjections obligatoire partout en Vaucluse</li>
        <li>Laisse obligatoire hors des zones canines clôturées</li>
        <li>Vaccinations à jour recommandées avant toute visite en espace collectif</li>
        <li>Eau à disposition — la chaleur du Vaucluse peut être intense en été</li>
      </ul>

      <p>Consultez la <a href="/parcs/avignon">carte des espaces canins à Avignon</a> sur ParcAChien pour voir les avis de la communauté et l'affluence en temps réel avant de vous déplacer.</p>
    `,
  },

  "parcs-chiens-cannes-alpes-maritimes": {
    title: "Parcs à chiens à Cannes et sur la Côte d'Azur — Alpes-Maritimes | ParcAChien",
    description: "Guide des parcs à chiens à Cannes, Antibes, Cagnes-sur-Mer et dans les Alpes-Maritimes (06). Aires canines, espaces clôturés et conseils pour la Côte d'Azur.",
    keywords: ["parc à chien Cannes", "espace canin 06", "jardin canin Cannes", "parc chien Antibes", "parc chien Cagnes-sur-Mer", "aire canine Alpes-Maritimes", "espace canin Côte d'Azur", "sortir chien Cannes"],
    date: "2026-06-23",
    readTime: "6 min",
    category: "Guide local",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80",
    content: `
      <p>Les <strong>Alpes-Maritimes (06)</strong> sont un territoire privilégié pour les propriétaires de chiens, entre mer et montagne. Des plages de Cannes aux parcs d'Antibes, voici notre guide complet des <strong>espaces canins sur la Côte d'Azur</strong>.</p>

      <h2>Parcs à chiens à Cannes</h2>
      <p>Cannes, célèbre pour son festival du cinéma, propose des espaces canins bien aménagés pour ses résidents et leurs compagnons :</p>
      <ul>
        <li><strong>Espace canin du Lys</strong> : Inauguré fin 2024, cet espace de 400 m² est clôturé, équipé d'obstacles d'agility et d'une fontaine canine. Situé dans le quartier du Lys, facilement accessible depuis le centre de Cannes.</li>
        <li><strong>Jardins de la Croix des Gardes</strong> : Parc arboré avec zone canine, offrant une vue magnifique sur la baie de Cannes.</li>
        <li><strong>Espace canin de la Bocca</strong> : Pratique pour les habitants de ce quartier résidentiel de l'ouest cannois.</li>
      </ul>

      <h2>Espaces canins à Antibes et Juan-les-Pins</h2>
      <p>Antibes dispose de plusieurs aires canines dans ses différents quartiers :</p>
      <ul>
        <li><strong>Parc canin du Pont Romain</strong> : Grand espace clôturé avec zones séparées pour petits et grands chiens.</li>
        <li><strong>Jardin canin du Bacon</strong> : Vue sur mer, promenade agréable avec votre chien tenu en laisse.</li>
        <li><strong>Espace canin de Sophia-Antipolis</strong> : Idéal pour les professionnels de la technopole qui viennent déjeuner avec leur chien.</li>
      </ul>
      <p>Retrouvez tous les spots sur notre page <a href="/parcs/antibes">parcs à chiens Antibes</a>.</p>

      <h2>Parc chien Cagnes-sur-Mer</h2>
      <p>Cagnes-sur-Mer, entre Nice et Antibes, offre plusieurs options canines :</p>
      <ul>
        <li>Espace canin des Lucayas — clôturé, bien entretenu</li>
        <li>Allée des Saules — promenade en bord de rivière</li>
        <li>Zone canine côté Cagnes Plage — accès hors saison</li>
      </ul>

      <h2>Aire canine Alpes-Maritimes : le reste du département</h2>
      <p>Au-delà des grandes villes, les Alpes-Maritimes proposent des espaces canins dans de nombreuses communes :</p>
      <ul>
        <li><strong>Grasse</strong> : Capitale mondiale du parfum et espace canin au Parc de la Corniche</li>
        <li><strong>Vence</strong> : Aire canine au cœur de la vieille ville</li>
        <li><strong>Menton</strong> : Espace canin avec vue sur la frontière italienne</li>
        <li><strong>Mandelieu-la-Napoule</strong> : Espace canin proche de la marina</li>
      </ul>

      <h2>Conseils pour les sorties chien en été sur la Côte d'Azur</h2>
      <ul>
        <li>Évitez les sorties entre 11h et 16h en été — l'asphalte chauffe les coussinets</li>
        <li>La plupart des plages interdisent les chiens de juin à septembre</li>
        <li>Apportez toujours de l'eau fraîche et une gamelle pliable</li>
        <li>Certaines plages privées acceptent les chiens toute l'année — renseignez-vous</li>
      </ul>

      <p>Consultez la <a href="/partenaires/cannes">page partenaires à Cannes</a> pour trouver les animaleries et vétérinaires partenaires ParcAChien dans les Alpes-Maritimes.</p>
    `,
  },

  "balade-chien-calanques-marseille": {
    title: "Balades avec son chien dans les Calanques de Marseille | ParcAChien",
    description: "Guide complet pour se balader avec son chien dans les Calanques de Marseille, Cassis et La Ciotat. Règles du Parc National, zones autorisées et conseils pratiques.",
    keywords: ["balade chien Calanques", "chien Parc National Calanques", "sortir chien Cassis", "promenade chien La Ciotat", "calanques Marseille chien autorisé", "randonnée chien Marseille", "zones chien autorisé calanques", "chien laisse calanques"],
    date: "2026-06-23",
    readTime: "6 min",
    category: "Balade & Nature",
    image: "https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=1200&q=80",
    content: `
      <p>Le Parc National des Calanques est l'un des joyaux naturels de la région PACA, et la bonne nouvelle c'est que vous pouvez l'explorer avec votre chien ! Voici tout ce qu'il faut savoir pour une <strong>balade réussie avec son chien dans les Calanques</strong>.</p>

      <h2>Règles du Parc National des Calanques pour les chiens</h2>
      <p>Le Parc National des Calanques accueille les chiens avec quelques règles importantes à respecter :</p>
      <ul>
        <li><strong>Laisse obligatoire en permanence</strong> dans l'ensemble du Parc National, sur tous les sentiers</li>
        <li>Les chiens sont <strong>interdits sur les plages</strong> des Calanques de mai à septembre</li>
        <li>Ramassage des déjections obligatoire — respect de la faune et de la flore</li>
        <li>Ne laissez pas votre chien déranger la faune sauvage (mouflons, chauves-souris, oiseaux nicheurs)</li>
        <li>Certaines zones protégées sont totalement fermées aux animaux de compagnie</li>
      </ul>

      <h2>Sentiers accessibles aux chiens depuis Marseille</h2>
      <p>Depuis Marseille, plusieurs itinéraires permettent de randonnée avec votre chien :</p>
      <ul>
        <li><strong>Sentier des Baumettes vers la Calanque de Sormiou</strong> : 3 km aller-retour, accessible, belle vue sur la méditerranée</li>
        <li><strong>Vallon de l'Escalette</strong> : Itinéraire ombragé, idéal en été, départ depuis le 8ème arrondissement</li>
        <li><strong>Massif de Marseilleveyre</strong> : Randonnées pour chiens sportifs, terrain varié, panoramas exceptionnels</li>
        <li><strong>Calanque de Callelongue</strong> (départ du 8ème) : Accès direct depuis la route des Goudes, chiens admis hors saison</li>
      </ul>

      <h2>Balades côté Cassis</h2>
      <p>Cassis est une porte d'entrée magnifique pour les Calanques. Les chiens sont acceptés sur les sentiers balisés :</p>
      <ul>
        <li><strong>Sentier vers la Calanque de Port-Pin</strong> : Accessible avec un chien bien tenu en laisse</li>
        <li><strong>Port-Miou</strong> : La plus proche de Cassis, accessible en quelques minutes à pied depuis le port</li>
        <li><strong>Sentier de crête</strong> : Vue panoramique sur toutes les calanques, recommandé pour les randonneurs expérimentés</li>
      </ul>

      <h2>Balades avec son chien à La Ciotat</h2>
      <p>La Ciotat et ses environs offrent également de belles possibilités :</p>
      <ul>
        <li>Sentiers de la Calanque du Mugel — accessible, idéal pour une première balade</li>
        <li>Île Verte (accessible en bateau) — certains bateaux-taxis acceptent les chiens</li>
        <li>Parc du Mugel — jardin tropical avec zones de promenade</li>
      </ul>

      <h2>Points d'eau et conseils pratiques</h2>
      <p>Les Calanques sont un environnement aride en été. Préparez votre sortie :</p>
      <ul>
        <li>Apportez <strong>minimum 1,5 litre d'eau par chien</strong> pour une randonnée de 3h</li>
        <li>Points d'eau disponibles aux parkings de départ et dans les villages</li>
        <li>Évitez les sorties entre 10h et 17h en juillet-août — risque de coup de chaleur</li>
        <li>Vérifiez les fermetures préfectorales risque incendie avant de partir</li>
        <li>Protégez les coussinets sur les rochers calcaires très abrasifs</li>
      </ul>

      <p>Pour les sorties en ville après votre randonnée, retrouvez les <a href="/parcs/marseille">espaces canins proches des Calanques à Marseille</a> sur ParcAChien.</p>
    `,
  },

  "choisir-croquettes-chien-conseils": {
    title: "Comment choisir les croquettes de son chien — Guide 2026 | ParcAChien",
    description: "Guide complet 2026 pour choisir les meilleures croquettes pour votre chien : types, ingrédients à éviter, critères selon la race et l'âge. Conseils d'experts.",
    keywords: ["choisir croquettes chien", "meilleures croquettes chien 2026", "croquettes premium chien", "croquettes sans céréales chien", "alimentation BARF chien", "croquettes bio chien", "ingrédients croquettes chien", "nutrition canine"],
    date: "2026-06-23",
    readTime: "6 min",
    category: "Conseils & Santé",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
    content: `
      <p>L'alimentation est le premier facteur de santé et de longévité de votre chien. Face à la multitude d'offres sur le marché, choisir les bonnes croquettes peut sembler complexe. Ce guide 2026 vous donne toutes les clés pour faire le bon choix.</p>

      <h2>Les différents types de croquettes</h2>

      <h3>Croquettes économiques (entrée de gamme)</h3>
      <p>Moins chères à l'achat, ces croquettes contiennent souvent une forte proportion de céréales (maïs, blé) et des sous-produits animaux peu nobles. Elles peuvent convenir pour un budget serré mais ne sont pas idéales sur le long terme pour la santé de votre chien.</p>

      <h3>Croquettes premium</h3>
      <p>Les croquettes premium se distinguent par une <strong>teneur en viande élevée</strong> (minimum 25-30%), des sources de protéines identifiées (poulet, saumon, agneau) et l'absence de colorants artificiels. Marques réputées : Royal Canin, Hill's Science Plan, Eukanuba.</p>

      <h3>Croquettes sans céréales (grain-free)</h3>
      <p>Formulées pour les chiens sensibles ou allergiques aux céréales, ces croquettes remplacent le blé et le maïs par des légumineuses (pois, lentilles) ou des pommes de terre. Attention : certaines études associent les régimes grain-free à des cardiomyopathies chez certaines races — consultez votre vétérinaire.</p>

      <h3>Croquettes bio et naturelles</h3>
      <p>Certifiées agriculture biologique, ces croquettes garantissent des ingrédients sans pesticides ni OGM. Plus coûteuses, elles correspondent à une démarche éthique et environnementale cohérente.</p>

      <h3>L'alimentation BARF (Biologically Appropriate Raw Food)</h3>
      <p>Le BARF consiste à nourrir votre chien avec des aliments crus : viande, os charnus, abats, légumes. Cette approche est appréciée pour ses résultats sur le pelage et la digestion, mais demande une réelle expertise nutritionnelle pour éviter les carences. À pratiquer avec l'accompagnement d'un vétérinaire nutritionniste.</p>

      <h2>Ingrédients à éviter dans les croquettes</h2>
      <ul>
        <li><strong>"Viandes et sous-produits animaux"</strong> non spécifiés — terme fourre-tout de mauvaise qualité</li>
        <li><strong>BHA, BHT, éthoxyquine</strong> — conservateurs synthétiques controversés</li>
        <li><strong>Sucre, sirop de glucose</strong> — inutile pour le chien, favorise l'obésité</li>
        <li><strong>Colorants artificiels</strong> (E102, E120, E150...) — aucun intérêt nutritionnel</li>
        <li><strong>Propylène glycol</strong> — interdit dans les aliments pour chats, à éviter pour les chiens aussi</li>
      </ul>

      <h2>Adapter le choix selon la race et l'âge</h2>
      <ul>
        <li><strong>Chiot (0-12 mois)</strong> : Croquettes riches en protéines et calcium, formules "Junior" ou "Puppy"</li>
        <li><strong>Adulte actif</strong> : Teneur en protéines 25-30%, glucides modérés</li>
        <li><strong>Senior (7+ ans)</strong> : Moins de phosphore, plus de glucosamine pour les articulations</li>
        <li><strong>Grande race</strong> : Formule spéciale grande race pour protéger les articulations</li>
        <li><strong>Chien stérilisé</strong> : Croquettes "Light" pour éviter la prise de poids</li>
      </ul>

      <h2>Où acheter des croquettes de qualité en PACA ?</h2>
      <p>Les animaleries partenaires ParcAChien proposent des gammes premium avec des conseillères formées à la nutrition canine. Retrouvez les meilleures animaleries près de chez vous :</p>
      <ul>
        <li><a href="/partenaires/marseille">Animaleries partenaires à Marseille</a></li>
        <li><a href="/partenaires/nice">Animaleries partenaires à Nice</a></li>
        <li><a href="/partenaires/toulon">Animaleries partenaires à Toulon</a></li>
        <li><a href="/partenaires/avignon">Animaleries partenaires à Avignon</a></li>
      </ul>

      <p>Un bon conseiller en animalerie peut vous aider à transitionner progressivement vers une nouvelle alimentation (sur 7-10 jours) pour éviter les troubles digestifs.</p>
    `,
  },

  "parc-chien-avignon-villeneuve": {
    title: "Parc à chien Avignon — Villeneuve-lès-Avignon et Gard | ParcAChien",
    description: "Espaces canins à Villeneuve-lès-Avignon et dans le Gard (30). Où promener son chien côté rive droite du Rhône, autour d'Avignon et dans le 30400.",
    keywords: ["parc chien Villeneuve-lès-Avignon", "espace canin Gard", "sortir chien Avignon rive droite", "aire canine 30400", "parc canin Villeneuve", "promenade chien Gard 30", "espace canin Pont du Gard", "chien Gard PACA"],
    date: "2026-06-23",
    readTime: "6 min",
    category: "Guide local",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80",
    content: `
      <p><strong>Villeneuve-lès-Avignon</strong> (code postal 30400), situé en rive droite du Rhône face à Avignon, est une ville du Gard particulièrement agréable pour les propriétaires de chiens. Voici tout ce qu'il faut savoir pour sortir son chien dans ce secteur.</p>

      <h2>Espaces canins à Villeneuve-lès-Avignon</h2>
      <p>La commune de Villeneuve-lès-Avignon propose des espaces canins adaptés dans un cadre historique et naturel exceptionnel :</p>
      <ul>
        <li><strong>Espace canin du Fort Saint-André</strong> : À proximité du fort médiéval, cet espace offre un cadre remarquable pour les sorties matinales de votre chien.</li>
        <li><strong>Aire canine des bords du Rhône</strong> : La promenade des bords du Rhône permet de longs chemins avec votre chien, avec une vue directe sur les remparts d'Avignon.</li>
        <li><strong>Espace vert du Parc des Loisirs</strong> : Espace aménagé dans le quartier résidentiel, pratique pour les habitants du centre de Villeneuve.</li>
      </ul>

      <h2>Sortir son chien côté rive droite du Rhône</h2>
      <p>La rive droite du Rhône est souvent moins fréquentée qu'Avignon, ce qui en fait un secteur privilégié pour les promenades avec votre chien :</p>
      <ul>
        <li>Le chemin des berges du Rhône relie Villeneuve à plusieurs communes du Gard en longeant le fleuve</li>
        <li>L'Île de la Piboulette, accessible en canoë, est un spot sauvage apprécié des propriétaires de chiens</li>
        <li>Les vignes et garrigues autour de Villeneuve offrent des balades magnifiques en dehors des périodes à risque incendie</li>
      </ul>

      <h2>Aire canine dans le Gard (30)</h2>
      <p>Au-delà de Villeneuve, le département du Gard propose de nombreuses aires canines :</p>
      <ul>
        <li><strong>Nîmes</strong> : Plusieurs espaces canins dans les jardins de la Fontaine et les quartiers résidentiels</li>
        <li><strong>Pont du Gard</strong> : Le site archéologique est accessible avec les chiens tenus en laisse sur les sentiers extérieurs</li>
        <li><strong>Uzès</strong> : Espace canin dans les jardins municipaux de cette cité médiévale</li>
        <li><strong>Alès</strong> : Aire canine au Parc du Bosquet</li>
      </ul>

      <h2>Connexion entre Avignon et Villeneuve-lès-Avignon</h2>
      <p>Les propriétaires des deux rives profitent souvent des espaces des deux communes. Le passage se fait par :</p>
      <ul>
        <li>Le <strong>Pont Daladier</strong> — accessible à pied avec votre chien</li>
        <li>Le <strong>bac fluvial</strong> (navette fluviale saisonnière) — certaines navettes acceptent les chiens</li>
      </ul>

      <p>Retrouvez la carte complète des espaces canins autour d'Avignon sur <a href="/parcs/avignon">ParcAChien — Avignon</a>. Pour les partenaires locaux (animaleries, vétérinaires), consultez la <a href="/partenaires/avignon">page partenaires Avignon</a>.</p>

      <h2>Conseils pratiques pour le secteur 30400</h2>
      <ul>
        <li>En été, partez tôt le matin — la chaleur du Gard peut être intense</li>
        <li>Vérifiez les arrêtés préfectoraux de fermeture des massifs en période sèche</li>
        <li>Emportez toujours de l'eau fraîche pour votre chien</li>
        <li>Les marchés locaux (Villeneuve a un marché le mercredi et samedi) sont généralement chien-friendly</li>
      </ul>
    `,
  },

  "veterinaire-urgence-chien-paca": {
    title: "Urgences vétérinaires pour chiens en PACA — Où aller ? | ParcAChien",
    description: "Cliniques vétérinaires d'urgence 24h/24 pour chiens en PACA : Marseille, Nice, Toulon, Aix-en-Provence. SOS vétérinaire, numéros utiles et conseils en cas d'urgence.",
    keywords: ["vétérinaire urgence chien Marseille", "urgences vétérinaires Nice", "clinique vétérinaire 24h PACA", "SOS vétérinaire chien", "vétérinaire nuit PACA", "urgence vétérinaire Toulon", "vétérinaire garde PACA", "clinique vétérinaire urgence"],
    date: "2026-06-23",
    readTime: "6 min",
    category: "Santé & Urgences",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200&q=80",
    content: `
      <p>En cas d'urgence vétérinaire avec votre chien, chaque minute compte. Ce guide recense les principales <strong>cliniques vétérinaires d'urgence en PACA</strong>, disponibles 24h/24 et 7j/7, pour que vous soyez toujours prêt.</p>

      <h2>Urgences vétérinaires à Marseille</h2>
      <p>Marseille dispose de plusieurs structures capables d'accueillir des urgences vétérinaires de nuit :</p>
      <ul>
        <li><strong>Centre Hospitalier Vétérinaire Languedoc (CHVL)</strong> — 13ème arrondissement. Urgences 24h/24, imagerie médicale, chirurgie d'urgence.</li>
        <li><strong>Clinique Vétérinaire des Calanques</strong> — 9ème arrondissement. Permanence de nuit assurée en saison.</li>
        <li><strong>SOS Vétérinaire Marseille</strong> — Service de garde assurant les visites à domicile en urgence, de 20h à 8h.</li>
      </ul>
      <p>En cas de doute, appelez en premier votre vétérinaire habituel : même fermé, son répondeur indique généralement le vétérinaire de garde du secteur.</p>

      <h2>Urgences vétérinaires à Nice</h2>
      <p>Sur la Côte d'Azur, plusieurs cliniques assurent la permanence nocturne :</p>
      <ul>
        <li><strong>Centre Vétérinaire de la Côte d'Azur</strong> — Nice nord. Référence régionale en médecine d'urgence et soins intensifs.</li>
        <li><strong>Clinique Vétérinaire Saint-Isidore</strong> — Urgences nocturnes et week-end.</li>
        <li><strong>CHV Véto Côte d'Azur</strong> (Cagnes-sur-Mer) — Centre hospitalier vétérinaire avec plateau technique complet.</li>
      </ul>

      <h2>Urgences vétérinaires à Toulon et dans le Var</h2>
      <ul>
        <li><strong>Clinique Vétérinaire des 4 Saisons</strong> — Toulon. Urgences assurées en permanence.</li>
        <li><strong>Centre Hospitalier Vétérinaire de Provence</strong> — Brignoles. Couvre le centre-Var.</li>
        <li><strong>Clinique Vétérinaire de La Seyne</strong> — Urgences nuit et week-end.</li>
      </ul>

      <h2>Urgences vétérinaires à Aix-en-Provence</h2>
      <ul>
        <li><strong>Clinique Vétérinaire du Pays d'Aix</strong> — Permanence nocturne, service d'urgence réputé.</li>
        <li><strong>Centre Vétérinaire du Jas de Bouffan</strong> — Urgences soirée et week-end.</li>
      </ul>

      <h2>Que faire en attendant le vétérinaire ?</h2>
      <p>En cas d'urgence, quelques gestes essentiels en attendant la consultation :</p>
      <ul>
        <li><strong>Empoisonnement</strong> : N'induisez pas le vomissement sans avis vétérinaire. Notez ce qu'a ingéré votre chien et l'heure.</li>
        <li><strong>Blessure hémorragique</strong> : Comprimez avec un linge propre. Ne posez un garrot que sur un membre et jamais plus de 20 minutes.</li>
        <li><strong>Coup de chaleur</strong> : Refroidissez progressivement avec de l'eau fraîche (pas glacée), aérez et rendez-vous d'urgence chez le vétérinaire.</li>
        <li><strong>Choc traumatique</strong> (accident) : Ne bougez pas votre chien si une fracture de la colonne est possible. Appelez le vétérinaire avant de transporter.</li>
        <li><strong>Convulsions</strong> : Éloignez les objets dangereux, ne mettez pas vos doigts dans la gueule. Chronométrez la crise.</li>
      </ul>

      <h2>Numéro d'urgence : CAPAE-Ouest</h2>
      <p>Le <strong>Centre Anti-Poison Animal de l'Ouest (CAPAE)</strong> répond 24h/24 en cas d'intoxication : <strong>02 40 68 77 40</strong>. Ayez ce numéro en mémoire dans votre téléphone.</p>

      <p>Retrouvez les vétérinaires partenaires ParcAChien dans votre secteur : <a href="/partenaires/marseille">Marseille</a>, <a href="/partenaires/nice">Nice</a>, <a href="/partenaires/toulon">Toulon</a>, <a href="/partenaires/avignon">Avignon</a>.</p>
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
