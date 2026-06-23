"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DogProfile,
  CheckIn,
  ParkReport,
  ParkEvent,
  Story,
  UserStats,
  VisitHistory,
  ALL_BADGES,
  Badge,
  FeedPost,
  FeedComment,
  ForumThread,
  ForumReply,
  Friend,
  ChatMessage,
} from "./types";

interface AppState {
  // Dog profile
  myDog: DogProfile | null;
  setMyDog: (dog: DogProfile) => void;

  // Check-ins (global simulation)
  checkins: CheckIn[];
  addCheckin: (parkId: string, parkName: string, city: string) => void;
  removeCheckin: (checkinId: string) => void;
  getActiveCheckins: (parkId: string) => CheckIn[];

  // Reports
  reports: ParkReport[];
  addReport: (parkId: string, type: ParkReport["type"]) => void;
  getActiveReports: (parkId: string) => ParkReport[];

  // Events
  events: ParkEvent[];
  addEvent: (event: Omit<ParkEvent, "id">) => void;
  getEvents: (parkId: string) => ParkEvent[];

  // Stories
  stories: Story[];
  addStory: (story: Omit<Story, "id" | "timestamp" | "expiresAt" | "likes">) => void;
  likeStory: (storyId: string) => void;
  getActiveStories: () => Story[];

  // Stats & gamification
  stats: UserStats;
  favoriteParks: string[];
  toggleFavorite: (parkId: string) => void;

  // Notifications
  notifications: { id: string; message: string; parkId: string; timestamp: number }[];
  addNotification: (message: string, parkId: string) => void;
  clearNotification: (id: string) => void;

  // Feed
  feedPosts: FeedPost[];
  addFeedPost: (text: string, photo?: string, parkId?: string, parkName?: string) => void;
  likeFeedPost: (postId: string) => void;
  addFeedComment: (postId: string, text: string) => void;

  // Forum
  forumThreads: ForumThread[];
  addForumThread: (thread: Omit<ForumThread, "id" | "timestamp" | "replies" | "views">) => void;
  addForumReply: (threadId: string, text: string) => void;
  likeForumReply: (threadId: string, replyId: string) => void;

  // Social & Messages
  friends: Friend[];
  chatMessages: ChatMessage[];
  addFriend: (friend: Friend) => void;
  acceptFriend: (friendId: string) => void;
  sendMessage: (receiverId: string, text: string) => void;
}

function computeBadges(stats: UserStats): Badge[] {
  const badges: Badge[] = [];
  const now = Date.now();
  const uniqueParks = new Set(stats.history.map((h) => h.parkId)).size;
  const depts = new Set(stats.history.map((h) => h.parkId.split("-")[0]));

  if (stats.totalCheckins >= 1) badges.push({ ...ALL_BADGES[0], unlockedAt: now });
  if (uniqueParks >= 5) badges.push({ ...ALL_BADGES[1], unlockedAt: now });
  if (uniqueParks >= 10) badges.push({ ...ALL_BADGES[2], unlockedAt: now });
  if (stats.totalCheckins >= 50) badges.push({ ...ALL_BADGES[3], unlockedAt: now });
  if (depts.size >= 6) badges.push({ ...ALL_BADGES[9], unlockedAt: now });

  return badges;
}

const DEMO_DOG: DogProfile = {
  id: "demo-dog-1",
  name: "Uguette",
  breed: "Teckel",
  age: 36,
  weight: "petit",
  gender: "female",
  sterilized: false,
  character: ["joueur", "affectueux", "energique", "sociable"],
  vaccinated: true,
  photo: "/uguette.jpg",
  ownerId: "demo-user-1",
};

const DEMO_CHECKINS: CheckIn[] = [
  {
    id: "demo-ci-1",
    parkId: "06-001",
    dogId: "demo-dog-2",
    dog: { id: "demo-dog-2", name: "Luna", breed: "Golden Retriever", age: 18, weight: "grand", gender: "female", sterilized: false, character: ["joueur", "affectueux", "sociable"], vaccinated: true, ownerId: "user-2" },
    timestamp: Date.now() - 30 * 60 * 1000,
    expiresAt: Date.now() + 2.5 * 60 * 60 * 1000,
  },
  {
    id: "demo-ci-2",
    parkId: "06-001",
    dogId: "demo-dog-3",
    dog: { id: "demo-dog-3", name: "Rocky", breed: "Berger Allemand", age: 36, weight: "grand", gender: "male", sterilized: true, character: ["calme", "dominant"], vaccinated: true, ownerId: "user-3" },
    timestamp: Date.now() - 45 * 60 * 1000,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000,
  },
  {
    id: "demo-ci-3",
    parkId: "13-018",
    dogId: "demo-dog-4",
    dog: { id: "demo-dog-4", name: "Bella", breed: "Beagle", age: 12, weight: "moyen", gender: "female", sterilized: false, character: ["energique", "joueur", "craintif"], vaccinated: true, ownerId: "user-4" },
    timestamp: Date.now() - 15 * 60 * 1000,
    expiresAt: Date.now() + 2.75 * 60 * 60 * 1000,
  },
  {
    id: "demo-ci-4",
    parkId: "83-010",
    dogId: "demo-dog-5",
    dog: { id: "demo-dog-5", name: "Milo", breed: "Bichon", age: 60, weight: "petit", gender: "male", sterilized: true, character: ["affectueux", "calme", "soumis"], vaccinated: true, ownerId: "user-5" },
    timestamp: Date.now() - 10 * 60 * 1000,
    expiresAt: Date.now() + 2.8 * 60 * 60 * 1000,
  },
];

const DEMO_FEED: FeedPost[] = [
  {
    id: "feed-12",
    authorDogName: "Nala",
    authorBreed: "Husky Sibérien",
    parkId: "06-024",
    parkName: "Parc canin Batterie Russe",
    text: "Nala fait sa star sur la Côte d'Azur 🌊❄️ Un Husky à Nice c'est pas commun mais elle adore le soleil ! Ce parc est ouvert 24h/24, on y va même le soir en été 🌙",
    photo: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&q=80",
    emoji: "🐺",
    timestamp: Date.now() - 10 * 60 * 1000,
    likes: ["user-2", "user-3", "user-7", "user-8", "user-9", "user-10"],
    comments: [
      { id: "cn1", authorDogName: "Luna", text: "Trop belle Nala ! Les yeux bleus 😍", timestamp: Date.now() - 5 * 60 * 1000 },
    ],
  },
  {
    id: "feed-13",
    authorDogName: "Léo",
    authorBreed: "Labrador Chocolat",
    parkId: "06-017",
    parkName: "Parc canin du Lys",
    text: "On a testé le tout nouveau parc de Cannes ! Inauguré en décembre 2024, le parcours agility est incroyable 🎯 Léo a traversé le pont suspendu du premier coup, trop fier de lui 🏆",
    photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    emoji: "🏅",
    timestamp: Date.now() - 45 * 60 * 1000,
    likes: ["user-2", "user-4", "user-5", "user-8"],
    comments: [
      { id: "cl1", authorDogName: "Rex", text: "On y va demain avec Rex ! Merci pour le tip 🎉", timestamp: Date.now() - 30 * 60 * 1000 },
      { id: "cl2", authorDogName: "Bella", text: "Le parcours agility pour les chiens c'est une super idée !", timestamp: Date.now() - 20 * 60 * 1000 },
    ],
  },
  {
    id: "feed-uguette-1",
    authorDogName: "Uguette",
    authorBreed: "Teckel",
    parkId: "13-028",
    parkName: "Parc Saucisse (Longchamp)",
    text: "Moi Uguette j'ai testé le parc Longchamp ce matin avec mes lunettes de soleil 😎🐾 Franchement top, j'ai couru partout et j'ai même fait des selfies. La mascotte officielle de ParcAChien c'est moi !",
    photo: "/uguette.jpg",
    emoji: "😎",
    timestamp: Date.now() - 30 * 60 * 1000,
    likes: ["user-2", "user-3", "user-4", "user-5", "user-6"],
    comments: [
      { id: "cu1", authorDogName: "Luna", text: "Uguette t'es trop swag avec tes lunettes 😂❤️", timestamp: Date.now() - 20 * 60 * 1000 },
      { id: "cu2", authorDogName: "Rocky", text: "La mascotte officielle ParcAChien 🏆🐾", timestamp: Date.now() - 10 * 60 * 1000 },
    ],
  },
  {
    id: "feed-1",
    authorDogName: "Luna",
    authorBreed: "Golden Retriever",
    parkId: "06-001",
    parkName: "Parc Carol de Roumanie",
    text: "Première sortie au parc ce matin après la pluie 🌈 L'herbe était encore mouillée mais Luna s'en foutait complètement 😂 Elle a couru pendant 1h non-stop !",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80",
    emoji: "🌟",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: ["user-3", "user-4", "user-5"],
    comments: [
      { id: "c1", authorDogName: "Rocky", text: "Trop mignon ! On était là hier soir, super parc 🐾", timestamp: Date.now() - 90 * 60 * 1000 },
      { id: "c2", authorDogName: "Bella", text: "On adore aussi cet endroit ! À bientôt peut-être 🥰", timestamp: Date.now() - 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-2",
    authorDogName: "Rocky",
    authorBreed: "Berger Allemand",
    parkId: "13-018",
    parkName: "Parc canin Gauffredy",
    text: "Rocky vient d'avoir 3 ans aujourd'hui 🎂🎉 On a fêté ça au parc Gauffredy avec ses potes du quartier. Note 4.5/5 sur les avis, et on comprend pourquoi — super espace, 2 zones séparées grands/petits !",
    photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80",
    emoji: "🎂",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: ["user-2", "user-5", "user-6", "user-7"],
    comments: [
      { id: "c3", authorDogName: "Milo", text: "Joyeux anniversaire Rocky !! 🎉🐕", timestamp: Date.now() - 4 * 60 * 60 * 1000 },
      { id: "c3b", authorDogName: "Nala", text: "3 ans déjà ! Il est magnifique ton Rocky 🐕", timestamp: Date.now() - 3 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-3",
    authorDogName: "Bella",
    authorBreed: "Beagle",
    text: "Question pour la communauté : vous connaissez un bon parc clôturé pas trop loin de la Joliette à Marseille ? Bella est encore en apprentissage du rappel et je peux pas la lâcher sans filet 😅",
    photo: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80",
    emoji: "🙏",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    likes: ["user-2"],
    comments: [
      { id: "c4", authorDogName: "Rex", text: "Essaie l'espace canin Belle de Mai, c'est clôturé et propre !", timestamp: Date.now() - 7 * 60 * 60 * 1000 },
      { id: "c5", authorDogName: "Luna", text: "Oui Belle de Mai +1 ! Ou Baille dans le 5e si t'es motorisée", timestamp: Date.now() - 6 * 60 * 60 * 1000 },
      { id: "c5b", authorDogName: "Léo", text: "Le parc Lodi aussi, c'est sans laisse et assez grand 🐾", timestamp: Date.now() - 5 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-4",
    authorDogName: "Milo",
    authorBreed: "Bichon",
    parkId: "83-010",
    parkName: "Jardin des chiens des Virgiles",
    text: "Week-end à Sainte-Maxime avec Milo ☀️ Ce jardin canin est INCROYABLE. Vue sur la mer, clôturé, propre... On reviendra tous les étés ! 🏖️",
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80",
    emoji: "🏖️",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    likes: ["user-2", "user-3", "user-4", "user-5", "user-6", "user-7", "user-8"],
    comments: [
      { id: "cm1", authorDogName: "Nala", text: "Sainte-Maxime c'est le paradis 😍 On y était le mois dernier !", timestamp: Date.now() - 20 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-5",
    authorDogName: "Coco",
    authorBreed: "Cocker Spaniel",
    parkId: "84-001",
    parkName: "Caniparc Chico Mendes",
    text: "Avignon la maison 🏠❤️ Le Caniparc Chico Mendes c'est notre spot quotidien. 2000m² clôturés, Coco peut sprinter à fond. Ce matin il a trouvé un nouveau copain Dalmatien 🐕‍🦺",
    photo: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&q=80",
    emoji: "🌸",
    timestamp: Date.now() - 36 * 60 * 60 * 1000,
    likes: ["user-2", "user-6", "user-9"],
    comments: [
      { id: "cc1", authorDogName: "Bella", text: "Coco est trop mignon !! 😍", timestamp: Date.now() - 30 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-6",
    authorDogName: "Zeus",
    authorBreed: "Doberman",
    parkId: "83-002",
    parkName: "Parc des Lices (agility)",
    text: "Zeus en mode athlète au Parc des Lices à Toulon 🏋️ 90 000m² de bonheur, le plus grand parc canin de la ville. Parcours d'agility et de sport canin. Franchement les Toulonnais sont chanceux d'avoir ça 👏",
    photo: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&q=80",
    emoji: "💪",
    timestamp: Date.now() - 48 * 60 * 60 * 1000,
    likes: ["user-2", "user-3", "user-4", "user-5", "user-9", "user-10"],
    comments: [
      { id: "cz1", authorDogName: "Rocky", text: "Zeus est impressionnant ! Le doberman le plus élégant 🖤", timestamp: Date.now() - 45 * 60 * 60 * 1000 },
      { id: "cz2", authorDogName: "Rex", text: "Je confirme, les Lices c'est top niveau PACA 🔝", timestamp: Date.now() - 40 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-7",
    authorDogName: "Peanut",
    authorBreed: "Chihuahua",
    text: "Peanut fait sa vie à Marseille 🐜 Petit mais costaud ! Au parc Baille ce matin, il a chassé un pigeon deux fois plus gros que lui 😂😂 Les petits chiens ont un grand cœur",
    photo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80",
    emoji: "💛",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    likes: ["user-2", "user-3", "user-8", "user-10", "user-11", "user-12"],
    comments: [
      { id: "cp1", authorDogName: "Uguette", text: "Les petits c'est les meilleurs 😂🐾 Je valide en tant que Teckel !", timestamp: Date.now() - 2.5 * 24 * 60 * 60 * 1000 },
      { id: "cp2", authorDogName: "Milo", text: "Solidarité petit format 🤝", timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-8",
    authorDogName: "Loulou",
    authorBreed: "Bouledogue Français",
    parkId: "06-003",
    parkName: "Square Jean Baptiste Carpeaux",
    text: "Nice ce soir 🌆 Le Square Carpeaux a une zone spéciale petits chiens — Loulou adore ! Il peut enfin courir sans se faire bousculer par les gros labos 😅 2 zones séparées c'est la meilleure idée",
    photo: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80",
    emoji: "🥰",
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    likes: ["user-4", "user-5", "user-6", "user-11"],
    comments: [
      { id: "cll1", authorDogName: "Peanut", text: "Les zones séparées c'est vital pour nous les petits 💯", timestamp: Date.now() - 3.5 * 24 * 60 * 60 * 1000 },
    ],
  },
  {
    id: "feed-9",
    authorDogName: "Artémis",
    authorBreed: "Dalmatien",
    text: "Artémis en mode pause café ☕ On cherche un éducateur canin sympa sur Marseille pour travailler le rappel. Des recommandations ? Elle est adorable mais sélective sur l'obéissance 😅",
    photo: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&q=80",
    emoji: "🎯",
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    likes: ["user-3", "user-7"],
    comments: [
      { id: "ca1", authorDogName: "Rocky", text: "Je connais une super éducatrice canine à Aix, je t'envoie le contact en privé !", timestamp: Date.now() - 4.5 * 24 * 60 * 60 * 1000 },
      { id: "ca2", authorDogName: "Coco", text: "Méthode positive uniquement pour Coco, ça change la vie 💚", timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    ],
  },
];

const DEMO_FORUM: ForumThread[] = [
  {
    id: "thread-1",
    category: "général",
    title: "Bienvenue sur ParcAChien ! Présentez votre chien 🐾",
    body: "Salut la communauté ! C'est le thread de présentation. Dites-nous comment s'appelle votre chien, sa race et votre coin en PACA !",
    authorDogName: "L'équipe ParcAChien",
    authorBreed: "Tous les chiens",
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    pinned: true,
    views: 142,
    replies: [
      { id: "r1", authorDogName: "Luna", text: "Coucou ! Moi c'est Luna, Golden de 18 mois, on est à Nice 13e 🌟", timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, likes: 5 },
      { id: "r2", authorDogName: "Rocky", text: "Rocky, Berger Allemand 3 ans, Aix-en-Provence. Champion du frisbee du quartier 🥏", timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, likes: 3 },
      { id: "r3", authorDogName: "Bella", text: "Bella, Beagle 1 an, Marseille 1er. Elle est adorable mais le rappel... on travaille 😅", timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, likes: 8 },
    ],
  },
  {
    id: "thread-2",
    category: "santé",
    title: "Tiques en ce moment à Marseille — faites gaffe !",
    body: "Salut, on est allé au parc Saucisse hier et j'ai trouvé une tique sur Rex ce soir. Vous avez remarqué aussi ? C'est la saison je suppose mais au centre-ville c'est surprenant...",
    authorDogName: "Rex",
    authorBreed: "Jack Russell",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    views: 67,
    replies: [
      { id: "r4", authorDogName: "Milo", text: "Oui pareil la semaine dernière au Roucas-Blanc ! Anti-parasitaire à jour c'est essentiel en ce moment.", timestamp: Date.now() - 1.5 * 24 * 60 * 60 * 1000, likes: 4 },
      { id: "r5", authorDogName: "Luna", text: "Mon véto conseille Bravecto pour l'été, très efficace 👍", timestamp: Date.now() - 24 * 60 * 60 * 1000, likes: 2 },
    ],
  },
  {
    id: "thread-3",
    category: "bonsplans",
    title: "Les meilleurs parcs clôturés de Marseille selon vous ?",
    body: "Je fais un top pour les nouveaux arrivants. Partagez vos adresses préférées avec vos critiques !",
    authorDogName: "Bella",
    authorBreed: "Beagle",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    views: 89,
    replies: [
      { id: "r6", authorDogName: "Rocky", text: "Belle de Mai 3e : propre, clôturé, espace correct. Mon préféré côté nord. ⭐⭐⭐⭐", timestamp: Date.now() - 2.5 * 24 * 60 * 60 * 1000, likes: 6 },
      { id: "r7", authorDogName: "Rex", text: "Baille dans le 5e très bien pour les petits gabarits. ⭐⭐⭐⭐⭐", timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, likes: 3 },
    ],
  },
  {
    id: "thread-4",
    category: "education",
    title: "Rappel — méthode positive qui marche enfin pour moi",
    body: "Après 6 mois galère avec Coco, j'ai trouvé une technique qui marche vraiment. Je partage ici pour ceux qui galérent comme moi...",
    authorDogName: "Coco",
    authorBreed: "Cocker",
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    views: 203,
    replies: [],
  },
];

const DEMO_STORIES: Story[] = [
  { id: "story-1", parkId: "06-001", parkName: "Parc Carol de Roumanie", dogName: "Luna", emoji: "🌟", text: "Super ambiance ce matin ! Luna a trouvé son meilleur pote ici 🐶", timestamp: Date.now() - 2 * 60 * 60 * 1000, expiresAt: Date.now() + 22 * 60 * 60 * 1000, likes: 7 },
  { id: "story-2", parkId: "13-018", parkName: "Parc canin Gauffredy", dogName: "Bella", emoji: "☀️", text: "Parc propre, herbe fraîche, on adore cet endroit !", timestamp: Date.now() - 4 * 60 * 60 * 1000, expiresAt: Date.now() + 20 * 60 * 60 * 1000, likes: 3 },
  { id: "story-3", parkId: "06-017", parkName: "Parc canin du Lys", dogName: "Rex", emoji: "🎾", text: "Rex a passé 2h à courir ! Il est épuisé mais heureux 😂", timestamp: Date.now() - 1 * 60 * 60 * 1000, expiresAt: Date.now() + 23 * 60 * 60 * 1000, likes: 12 },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      myDog: DEMO_DOG,
      setMyDog: (dog) => set({ myDog: dog }),

      checkins: DEMO_CHECKINS,
      addCheckin: (parkId, parkName, city) => {
        const { myDog, stats } = get();
        if (!myDog) return;
        const now = Date.now();
        const newCheckin: CheckIn = {
          id: `ci-${now}`,
          parkId,
          dogId: myDog.id,
          dog: myDog,
          timestamp: now,
          expiresAt: now + 3 * 60 * 60 * 1000,
        };
        const newHistory: VisitHistory = { parkId, parkName, city, date: now };
        const newStats = {
          ...stats,
          totalCheckins: stats.totalCheckins + 1,
          history: [newHistory, ...stats.history].slice(0, 100),
        };
        newStats.badges = computeBadges(newStats);
        set((state) => ({
          checkins: [...state.checkins, newCheckin],
          stats: newStats,
        }));
      },
      removeCheckin: (checkinId) =>
        set((state) => ({ checkins: state.checkins.filter((c) => c.id !== checkinId) })),
      getActiveCheckins: (parkId) => {
        const now = Date.now();
        return get().checkins.filter((c) => c.parkId === parkId && c.expiresAt > now);
      },

      reports: [],
      addReport: (parkId, type) => {
        const report: ParkReport = {
          id: `r-${Date.now()}`,
          parkId,
          type,
          timestamp: Date.now(),
          resolved: false,
        };
        set((state) => ({ reports: [...state.reports, report] }));
      },
      getActiveReports: (parkId) => {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        return get().reports.filter((r) => r.parkId === parkId && r.timestamp > cutoff && !r.resolved);
      },

      events: [
        { id: "evt-1", parkId: "06-001", title: "Rassemblement Golden Retrievers", description: "Rendez-vous entre goldens et leurs maîtres !", date: "2026-06-22", breed: "Golden Retriever", createdBy: "user-2" },
        { id: "evt-2", parkId: "13-018", title: "Dimanche détente à Aix", description: "Session socialisation pour tous les gabarits", date: "2026-06-21", createdBy: "user-3" },
      ],
      addEvent: (event) => {
        const newEvent: ParkEvent = { ...event, id: `evt-${Date.now()}` };
        set((state) => ({ events: [...state.events, newEvent] }));
      },
      getEvents: (parkId) => get().events.filter((e) => e.parkId === parkId),

      stories: DEMO_STORIES,
      addStory: (story) => {
        const now = Date.now();
        const newStory: Story = {
          ...story,
          id: `story-${now}`,
          timestamp: now,
          expiresAt: now + 24 * 60 * 60 * 1000,
          likes: 0,
        };
        set((state) => ({ stories: [...state.stories, newStory] }));
      },
      likeStory: (storyId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, likes: s.likes + 1 } : s
          ),
        })),
      getActiveStories: () => {
        const now = Date.now();
        return get().stories.filter((s) => s.expiresAt > now).sort((a, b) => b.timestamp - a.timestamp);
      },

      stats: {
        totalVisits: 3,
        uniqueParks: 2,
        totalCheckins: 3,
        badges: [{ ...ALL_BADGES[0], unlockedAt: Date.now() - 86400000 }],
        history: [],
        favoriteParks: [],
      },
      favoriteParks: [],
      toggleFavorite: (parkId) =>
        set((state) => ({
          favoriteParks: state.favoriteParks.includes(parkId)
            ? state.favoriteParks.filter((id) => id !== parkId)
            : [...state.favoriteParks, parkId],
        })),

      notifications: [],
      addNotification: (message, parkId) =>
        set((state) => ({
          notifications: [
            { id: `n-${Date.now()}`, message, parkId, timestamp: Date.now() },
            ...state.notifications,
          ].slice(0, 10),
        })),
      clearNotification: (id) =>
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),

      feedPosts: DEMO_FEED,
      addFeedPost: (text, photo, parkId, parkName) => {
        const { myDog } = get();
        const post: FeedPost = {
          id: `fp-${Date.now()}`,
          authorDogName: myDog?.name ?? "Anonyme",
          authorBreed: myDog?.breed ?? "",
          parkId,
          parkName,
          text,
          photo,
          emoji: "📸",
          timestamp: Date.now(),
          likes: [],
          comments: [],
        };
        set((state) => ({ feedPosts: [post, ...state.feedPosts] }));
      },
      likeFeedPost: (postId) => {
        set((state) => ({
          feedPosts: state.feedPosts.map((p) =>
            p.id === postId
              ? { ...p, likes: p.likes.includes("me") ? p.likes.filter((l) => l !== "me") : [...p.likes, "me"] }
              : p
          ),
        }));
      },
      addFeedComment: (postId, text) => {
        const { myDog } = get();
        const comment: FeedComment = {
          id: `fc-${Date.now()}`,
          authorDogName: myDog?.name ?? "Anonyme",
          text,
          timestamp: Date.now(),
        };
        set((state) => ({
          feedPosts: state.feedPosts.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
          ),
        }));
      },

      forumThreads: DEMO_FORUM,
      addForumThread: (thread) => {
        const { myDog } = get();
        const newThread: ForumThread = {
          ...thread,
          id: `th-${Date.now()}`,
          authorDogName: myDog?.name ?? "Anonyme",
          authorBreed: myDog?.breed ?? "",
          timestamp: Date.now(),
          replies: [],
          views: 0,
        };
        set((state) => ({ forumThreads: [newThread, ...state.forumThreads] }));
      },
      addForumReply: (threadId, text) => {
        const { myDog } = get();
        const reply: ForumReply = {
          id: `rp-${Date.now()}`,
          authorDogName: myDog?.name ?? "Anonyme",
          text,
          timestamp: Date.now(),
          likes: 0,
        };
        set((state) => ({
          forumThreads: state.forumThreads.map((t) =>
            t.id === threadId
              ? { ...t, replies: [...t.replies, reply], views: t.views + 1 }
              : t
          ),
        }));
      },
      likeForumReply: (threadId, replyId) => {
        set((state) => ({
          forumThreads: state.forumThreads.map((t) =>
            t.id === threadId
              ? { ...t, replies: t.replies.map((r) => r.id === replyId ? { ...r, likes: r.likes + 1 } : r) }
              : t
          ),
        }));
      },

      friends: [
        { id: "demo-dog-2", dogName: "Luna", breed: "Golden Retriever", photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80", status: "accepted" },
        { id: "demo-dog-3", dogName: "Rocky", breed: "Berger Allemand", photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80", status: "accepted" },
        { id: "demo-dog-4", dogName: "Bella", breed: "Beagle", photo: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80", status: "pending" },
      ],
      chatMessages: [
        { id: "m1", senderId: "demo-dog-2", receiverId: "demo-dog-1", text: "Coucou Uguette ! Tu vas au parc ce soir ?", timestamp: Date.now() - 3600000, read: true },
        { id: "m2", senderId: "demo-dog-1", receiverId: "demo-dog-2", text: "Oui vers 18h !!", timestamp: Date.now() - 3500000, read: true },
        { id: "m3", senderId: "demo-dog-3", receiverId: "demo-dog-1", text: "Uguette j'ai mon nouveau frisbee 🥏", timestamp: Date.now() - 10000, read: false },
      ],
      addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
      acceptFriend: (friendId) => set((state) => ({
        friends: state.friends.map((f) => f.id === friendId ? { ...f, status: "accepted" } : f)
      })),
      sendMessage: (receiverId, text) => set((state) => {
        const { myDog } = get();
        if (!myDog) return state;
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: myDog.id,
          receiverId,
          text,
          timestamp: Date.now(),
          read: false
        };
        return { chatMessages: [...state.chatMessages, newMsg] };
      }),
    }),
    { name: "parcachien-store-v1" }
  )
);
