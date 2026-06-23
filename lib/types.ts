export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: number; // mois
  weight: "petit" | "moyen" | "grand";
  gender: "male" | "female";
  sterilized: boolean;
  character: CharacterTrait[];
  vaccinated: boolean;
  photo?: string;
  ownerId: string;
}

export type CharacterTrait =
  | "joueur"
  | "calme"
  | "dominant"
  | "soumis"
  | "sociable"
  | "craintif"
  | "energique"
  | "affectueux";

export interface CheckIn {
  id: string;
  parkId: string;
  dogId: string;
  dog: DogProfile;
  timestamp: number; // ms
  expiresAt: number; // timestamp + 3h
}

export interface ParkReport {
  id: string;
  parkId: string;
  type: "portail_casse" | "terrain_boueux" | "chien_excite" | "parc_propre" | "fontaine_panne" | "sol_glissant";
  timestamp: number;
  resolved: boolean;
}

export interface ParkEvent {
  id: string;
  parkId: string;
  title: string;
  description: string;
  date: string;
  breed?: string;
  createdBy: string;
}

export interface Story {
  id: string;
  parkId: string;
  parkName: string;
  dogName: string;
  emoji: string;
  text: string;
  timestamp: number;
  expiresAt: number;
  likes: number;
}

export interface ProPartner {
  id: string;
  name: string;
  type: "veto" | "toiletteur" | "educateur" | "petshop";
  city: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  radius: number; // km de couverture
  rating: number;
  reviewCount: number;
}

export interface VisitHistory {
  parkId: string;
  parkName: string;
  city: string;
  date: number;
}

export interface UserStats {
  totalVisits: number;
  uniqueParks: number;
  totalCheckins: number;
  badges: Badge[];
  history: VisitHistory[];
  favoriteParks: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface FeedPost {
  id: string;
  authorDogName: string;
  authorBreed: string;
  parkId?: string;
  parkName?: string;
  text: string;
  photo?: string; // base64 ou URL
  emoji: string;
  timestamp: number;
  likes: string[]; // IDs qui ont liké
  comments: FeedComment[];
}

export interface FeedComment {
  id: string;
  authorDogName: string;
  text: string;
  timestamp: number;
}

export interface ForumThread {
  id: string;
  category: ForumCategory;
  title: string;
  body: string;
  authorDogName: string;
  authorBreed: string;
  timestamp: number;
  replies: ForumReply[];
  pinned?: boolean;
  views: number;
}

export interface ForumReply {
  id: string;
  authorDogName: string;
  text: string;
  timestamp: number;
  likes: number;
}

export type ForumCategory =
  | "général"
  | "santé"
  | "education"
  | "bonsplans"
  | "perdutrouvé"
  | "événements"
  | "races";

export const ALL_BADGES: Badge[] = [
  { id: "first_checkin", name: "Premier Pas", description: "Premier check-in", icon: "🐾" },
  { id: "explorer_5", name: "Explorateur", description: "5 parcs différents visités", icon: "🗺️" },
  { id: "explorer_10", name: "Grand Explorateur", description: "10 parcs différents visités", icon: "🧭" },
  { id: "ambassador", name: "Ambassadeur", description: "50 check-ins au total", icon: "⭐" },
  { id: "early_bird", name: "Lève-tôt", description: "Check-in avant 8h du matin", icon: "☀️" },
  { id: "rainy_day", name: "Courageux", description: "Check-in par temps de pluie", icon: "🌧️" },
  { id: "socializer", name: "Socialisateur", description: "20 Dog Matches réussis", icon: "🤝" },
  { id: "reporter", name: "Sentinelle", description: "5 signalements soumis", icon: "🛡️" },
  { id: "storyteller", name: "Conteur", description: "3 stories postées", icon: "📸" },
  { id: "paca_master", name: "Maître PACA", description: "Visité un parc dans chaque département PACA", icon: "🏆" },
];

export interface Friend {
  id: string;
  dogName: string;
  breed: string;
  photo?: string;
  status: "pending" | "accepted";
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  read: boolean;
}
