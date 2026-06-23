export type Partner = {
  id: string;
  name: string;
  category: "veterinaire" | "boutique";
  description: string;
  address: string;
  city: string;
  citySlug: string;
  postalCode: string;
  phone?: string;
  website?: string;
  lat: number;
  lng: number;
  premium: boolean;
  hours?: string;
  specialite?: string;
};

export const PARTNERS: Partner[] = [
  // === MARSEILLE ===
  // Vétérinaires
  { id: "vet-mrs-01", name: "Clinique Vétérinaire du Prado", category: "veterinaire", description: "Clinique généraliste et spécialisée au cœur du 8ème arrondissement. Consultations, chirurgie, urgences.", address: "245 Avenue du Prado", city: "Marseille", citySlug: "marseille", postalCode: "13008", phone: "04 91 78 XX XX", lat: 43.2720, lng: 5.3850, premium: true, hours: "Lun-Sam 8h-20h", specialite: "Généraliste + chirurgie" },
  { id: "vet-mrs-02", name: "SOS Vétérinaires Marseille", category: "veterinaire", description: "Urgences vétérinaires 24h/24, 7j/7. Consultations sans rendez-vous.", address: "12 Rue de Rome", city: "Marseille", citySlug: "marseille", postalCode: "13001", phone: "04 91 52 XX XX", lat: 43.2940, lng: 5.3750, premium: true, hours: "24h/24 — 7j/7", specialite: "Urgences 24h/24" },
  { id: "vet-mrs-03", name: "Cabinet Vétérinaire Belle de Mai", category: "veterinaire", description: "Équipe bienveillante au service de vos animaux. Consultations, vaccins, bilans de santé.", address: "38 Rue Nationale", city: "Marseille", citySlug: "marseille", postalCode: "13003", phone: "04 91 64 XX XX", lat: 43.3055, lng: 5.3740, premium: false, hours: "Lun-Ven 9h-19h, Sam 9h-13h", specialite: "Généraliste" },
  // Boutiques
  { id: "shop-mrs-01", name: "Maxi Zoo Marseille Grand Littoral", category: "boutique", description: "Grande animalerie avec rayon croquettes premium, accessoires, jouets et alimentation naturelle pour chiens.", address: "Centre Commercial Grand Littoral", city: "Marseille", citySlug: "marseille", postalCode: "13015", phone: "04 91 09 XX XX", lat: 43.3575, lng: 5.3235, premium: true, hours: "Lun-Sam 9h-21h, Dim 9h-19h", specialite: "Croquettes premium & accessoires" },
  { id: "shop-mrs-02", name: "Animalis Marseille Valentine", category: "boutique", description: "Alimentation naturelle, croquettes bio, compléments alimentaires et jouets pour chiens de toutes tailles.", address: "Centre Commercial Valentine", city: "Marseille", citySlug: "marseille", postalCode: "13011", phone: "04 91 43 XX XX", lat: 43.2940, lng: 5.4350, premium: false, hours: "Lun-Sam 9h-20h", specialite: "Alimentation bio & naturelle" },
  { id: "shop-mrs-03", name: "Tom & Compagnie Marseille Prado", category: "boutique", description: "Spécialiste des croquettes haut de gamme, sans céréales, BARF et alimentation crue. Conseils personnalisés.", address: "156 Boulevard Michelet", city: "Marseille", citySlug: "marseille", postalCode: "13008", lat: 43.2650, lng: 5.3820, premium: true, hours: "Mar-Sam 10h-19h", specialite: "Croquettes premium sans céréales" },

  // === NICE ===
  // Vétérinaires
  { id: "vet-nice-01", name: "Clinique Vétérinaire Cimiez", category: "veterinaire", description: "Clinique moderne dans le quartier Cimiez, équipée pour l'imagerie médicale et la chirurgie.", address: "18 Avenue de la Marne", city: "Nice", citySlug: "nice", postalCode: "06100", phone: "04 93 81 XX XX", lat: 43.7210, lng: 7.2720, premium: true, hours: "Lun-Ven 8h30-19h30, Sam 9h-13h", specialite: "Imagerie & chirurgie" },
  { id: "vet-nice-02", name: "Cabinet Vétérinaire Promenade", category: "veterinaire", description: "Cabinet de proximité sur la Promenade des Anglais. Consultations rapides et urgences légères.", address: "85 Promenade des Anglais", city: "Nice", citySlug: "nice", postalCode: "06000", phone: "04 93 97 XX XX", lat: 43.6955, lng: 7.2485, premium: false, hours: "Lun-Sam 9h-19h", specialite: "Généraliste" },
  { id: "vet-nice-03", name: "Urgences Vétérinaires Nice Côte d'Azur", category: "veterinaire", description: "Service d'urgences vétérinaires pour Nice et la Côte d'Azur. Équipe spécialisée 7j/7.", address: "24 Avenue de Saint-Lambert", city: "Nice", citySlug: "nice", postalCode: "06100", phone: "04 93 52 XX XX", lat: 43.7055, lng: 7.2745, premium: true, hours: "Urgences 24h/24", specialite: "Urgences 24h/24" },
  // Boutiques
  { id: "shop-nice-01", name: "Maxi Zoo Nice Saint-Isidore", category: "boutique", description: "Vaste animalerie avec tout le nécessaire pour votre chien : croquettes, laisses, couchages, soins.", address: "Zone Commerciale Saint-Isidore", city: "Nice", citySlug: "nice", postalCode: "06200", phone: "04 97 00 XX XX", lat: 43.7355, lng: 7.2420, premium: true, hours: "Lun-Sam 9h-20h30, Dim 9h-19h", specialite: "Croquettes & accessoires" },
  { id: "shop-nice-02", name: "Animalis Cap 3000", category: "boutique", description: "Au cœur du centre commercial Cap 3000 à Saint-Laurent-du-Var. Alimentation premium et bien-être animal.", address: "Cap 3000, Saint-Laurent-du-Var", city: "Nice", citySlug: "nice", postalCode: "06700", lat: 43.6695, lng: 7.1985, premium: false, hours: "Lun-Sam 10h-21h, Dim 11h-20h", specialite: "Bien-être & alimentation" },
  { id: "shop-nice-03", name: "Zooplus Nice — Livraison à domicile", category: "boutique", description: "Service de livraison de croquettes et accessoires directement à Nice et agglomération. Commande en ligne.", address: "Service livraison Nice", city: "Nice", citySlug: "nice", postalCode: "06000", website: "https://www.zooplus.fr", lat: 43.7102, lng: 7.2620, premium: false, hours: "Livraison 7j/7", specialite: "Livraison croquettes à domicile" },

  // === TOULON ===
  // Vétérinaires
  { id: "vet-tln-01", name: "Clinique Vétérinaire Toulon Centre", category: "veterinaire", description: "Clinique centrale à Toulon. Consultations toutes espèces, chirurgie douce, bilans annuels.", address: "14 Rue Pierre Semard", city: "Toulon", citySlug: "toulon", postalCode: "83000", phone: "04 94 92 XX XX", lat: 43.1255, lng: 5.9305, premium: true, hours: "Lun-Ven 8h30-19h, Sam 9h-13h", specialite: "Généraliste toutes espèces" },
  { id: "vet-tln-02", name: "Cabinet du Mourillon", category: "veterinaire", description: "Cabinet de quartier dans le Mourillon, accessible et humain. Idéal pour les familles avec chiens.", address: "8 Rue de la Palud", city: "Toulon", citySlug: "toulon", postalCode: "83000", phone: "04 94 41 XX XX", lat: 43.1095, lng: 5.9520, premium: false, hours: "Lun-Sam 9h-18h30", specialite: "Généraliste" },
  { id: "vet-tln-03", name: "Clinique Vétérinaire La Valette", category: "veterinaire", description: "Clinique moderne à La Valette-du-Var avec plateau technique complet.", address: "24 Avenue François Duchatel", city: "Toulon", citySlug: "toulon", postalCode: "83160", phone: "04 94 60 XX XX", lat: 43.1415, lng: 5.9965, premium: true, hours: "Lun-Ven 8h-19h30, Sam 9h-13h", specialite: "Imagerie & prévention" },
  // Boutiques
  { id: "shop-tln-01", name: "Maxi Zoo Toulon La Valette", category: "boutique", description: "Grande surface animalière en périphérie de Toulon. Croquettes toutes marques, lits, jouets, soins.", address: "Zone Commerciale La Valette", city: "Toulon", citySlug: "toulon", postalCode: "83160", phone: "04 94 21 XX XX", lat: 43.1380, lng: 5.9820, premium: true, hours: "Lun-Sam 9h-20h, Dim 9h-19h", specialite: "Croquettes & accessoires" },
  { id: "shop-tln-02", name: "Animalis Toulon Grand Var", category: "boutique", description: "Au centre commercial Grand Var. Large choix de croquettes premium et alimentation naturelle.", address: "Centre Commercial Grand Var", city: "Toulon", citySlug: "toulon", postalCode: "83130", lat: 43.1645, lng: 6.0025, premium: false, hours: "Lun-Sam 9h30-21h, Dim 10h-19h", specialite: "Alimentation naturelle" },
  { id: "shop-tln-03", name: "Tom & Compagnie Toulon", category: "boutique", description: "Boutique spécialisée croquettes haut de gamme, BARF, compléments et accessoires.", address: "28 Boulevard Maréchal Leclerc", city: "Toulon", citySlug: "toulon", postalCode: "83000", lat: 43.1265, lng: 5.9310, premium: false, hours: "Mar-Sam 10h-19h", specialite: "Croquettes premium" },

  // === AIX-EN-PROVENCE ===
  // Vétérinaires
  { id: "vet-aix-01", name: "Clinique Vétérinaire du Jas", category: "veterinaire", description: "La clinique de référence du Jas de Bouffan à Aix. Équipe de 5 vétérinaires, échographie, radio.", address: "8 Avenue de l'Europe", city: "Aix-en-Provence", citySlug: "aix-en-provence", postalCode: "13090", phone: "04 42 26 XX XX", lat: 43.5280, lng: 5.4190, premium: true, hours: "Lun-Ven 8h30-20h, Sam 9h-18h", specialite: "Clinique multi-vétérinaires" },
  { id: "vet-aix-02", name: "Cabinet Vétérinaire Celony", category: "veterinaire", description: "Cabinet de proximité dans le quartier Celony, à deux pas du Parc Gauffredy.", address: "12 Rue Celony", city: "Aix-en-Provence", citySlug: "aix-en-provence", postalCode: "13100", phone: "04 42 27 XX XX", lat: 43.5335, lng: 5.4415, premium: false, hours: "Lun-Ven 9h-19h, Sam 9h-13h", specialite: "Généraliste" },
  { id: "vet-aix-03", name: "Urgences Vétérinaires Aix PACA", category: "veterinaire", description: "Service d'urgences vétérinaires pour Aix et les Bouches-du-Rhône. Ouvert nuits et week-ends.", address: "Zone d'activité Les Milles", city: "Aix-en-Provence", citySlug: "aix-en-provence", postalCode: "13290", phone: "04 42 39 XX XX", lat: 43.4960, lng: 5.4095, premium: true, hours: "Urgences 24h/24", specialite: "Urgences 24h/24" },
  // Boutiques
  { id: "shop-aix-01", name: "Maxi Zoo Aix-en-Provence", category: "boutique", description: "Animalerie complète aux Milles. Croquettes, accessoires, soins et alimentation pour toutes les tailles.", address: "Zone Commerciale Les Milles", city: "Aix-en-Provence", citySlug: "aix-en-provence", postalCode: "13290", phone: "04 42 24 XX XX", lat: 43.4955, lng: 5.3985, premium: true, hours: "Lun-Sam 9h-20h, Dim 9h-19h", specialite: "Croquettes & alimentation" },
  { id: "shop-aix-02", name: "Jardiland Aix-en-Provence", category: "boutique", description: "Rayon animalerie Jardiland : croquettes grandes marques, jouets, accessoires et soins pour chiens.", address: "Route de Galice", city: "Aix-en-Provence", citySlug: "aix-en-provence", postalCode: "13090", lat: 43.5420, lng: 5.4105, premium: false, hours: "Lun-Sam 9h-19h30, Dim 9h-13h", specialite: "Alimentation & jardin" },
  { id: "shop-aix-03", name: "Animalerie du Cours Mirabeau", category: "boutique", description: "Boutique indépendante au cœur d'Aix. Sélection de croquettes bio, accessoires et conseils personnalisés.", address: "45 Cours Mirabeau", city: "Aix-en-Provence", citySlug: "aix-en-provence", postalCode: "13100", lat: 43.5270, lng: 5.4485, premium: false, hours: "Mar-Sam 10h-19h", specialite: "Bio & conseils" },

  // === AVIGNON ===
  { id: "vet-avi-01", name: "Clinique Vétérinaire des Remparts", category: "veterinaire", description: "À l'ombre des remparts d'Avignon, clinique généraliste pour tous vos animaux. Consultations et urgences.", address: "8 Rue de la République", city: "Avignon", citySlug: "avignon", postalCode: "84000", phone: "04 90 82 XX XX", lat: 43.9495, lng: 4.8060, premium: true, hours: "Lun-Ven 8h30-19h30, Sam 9h-12h30", specialite: "Généraliste" },
  { id: "vet-avi-02", name: "Cabinet Vétérinaire Montfavet", category: "veterinaire", description: "Cabinet en périphérie d'Avignon. Parking facile, consultations sans attente avec RDV.", address: "35 Route de Lyon", city: "Avignon", citySlug: "avignon", postalCode: "84140", lat: 43.9360, lng: 4.8755, premium: false, hours: "Lun-Sam 9h-18h30", specialite: "Généraliste" },
  { id: "shop-avi-01", name: "Maxi Zoo Avignon", category: "boutique", description: "Grande animalerie zone commerciale Avignon Nord. Croquettes, laisses, jouets, vivarium.", address: "Zone Commerciale Cap Sud", city: "Avignon", citySlug: "avignon", postalCode: "84000", lat: 43.9715, lng: 4.8050, premium: true, hours: "Lun-Sam 9h-20h, Dim 9h-19h", specialite: "Croquettes & accessoires" },
  { id: "shop-avi-02", name: "Animalis Avignon Le Pontet", category: "boutique", description: "Au Pontet, juste à côté d'Avignon. Large gamme alimentation naturelle pour chiens et chats.", address: "Centre Commercial Mistral 7, Le Pontet", city: "Avignon", citySlug: "avignon", postalCode: "84130", lat: 43.9785, lng: 4.8590, premium: false, hours: "Lun-Sam 9h30-21h", specialite: "Alimentation naturelle" },

  // === CANNES ===
  { id: "vet-can-01", name: "Clinique Vétérinaire Cannes Palm", category: "veterinaire", description: "Clinique moderne à Cannes. Consultation, vaccination, suivi santé, chirurgie douce.", address: "12 Rue d'Antibes", city: "Cannes", citySlug: "cannes", postalCode: "06400", phone: "04 93 68 XX XX", lat: 43.5524, lng: 7.0179, premium: true, hours: "Lun-Ven 8h30-19h, Sam 9h-13h", specialite: "Généraliste" },
  { id: "vet-can-02", name: "Cabinet Vétérinaire La Bocca", category: "veterinaire", description: "Vétérinaire de quartier à La Bocca. Accueil chaleureux, consultations et soins courants.", address: "48 Avenue Francis Tonner", city: "Cannes", citySlug: "cannes", postalCode: "06150", phone: "04 93 47 XX XX", lat: 43.5525, lng: 6.9965, premium: false, hours: "Lun-Sam 9h-18h30", specialite: "Généraliste" },
  { id: "shop-can-01", name: "Maxi Zoo Cannes Mandelieu", category: "boutique", description: "Grande surface animalière à Cannes-Mandelieu. Croquettes premium, accessoires, jouets.", address: "Zone Cannes-Mandelieu", city: "Cannes", citySlug: "cannes", postalCode: "06210", lat: 43.5465, lng: 6.9875, premium: true, hours: "Lun-Sam 9h-20h, Dim 9h-19h", specialite: "Croquettes & accessoires" },
  { id: "shop-can-02", name: "Animalis Cannes Centre", category: "boutique", description: "Boutique animalerie au centre de Cannes. Alimentation naturelle, soins, accessoires haut de gamme.", address: "72 Rue d'Antibes", city: "Cannes", citySlug: "cannes", postalCode: "06400", lat: 43.5505, lng: 7.0145, premium: false, hours: "Lun-Sam 10h-19h", specialite: "Premium & naturel" },
];

export const PARTNER_CITIES = [
  { city: "Marseille", slug: "marseille" },
  { city: "Nice", slug: "nice" },
  { city: "Toulon", slug: "toulon" },
  { city: "Aix-en-Provence", slug: "aix-en-provence" },
  { city: "Avignon", slug: "avignon" },
  { city: "Cannes", slug: "cannes" },
];

export function getPartnersByCity(citySlug: string) {
  return PARTNERS.filter((p) => p.citySlug === citySlug);
}

export function getVetsByCity(citySlug: string) {
  return PARTNERS.filter((p) => p.citySlug === citySlug && p.category === "veterinaire");
}

export function getBoutiquesByCity(citySlug: string) {
  return PARTNERS.filter((p) => p.citySlug === citySlug && p.category === "boutique");
}
